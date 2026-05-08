import { TOOL_DEFINITIONS, TOOL_MAP, getPlan } from "@/lib/pricing-data";
import type {
  AuditFormInput,
  AuditRecommendation,
  AuditResult,
  ToolAuditResult,
  ToolDefinition,
  ToolSpendInput,
  UseCase,
} from "@/lib/types";

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function monthlyListCost(tool: ToolDefinition, input: ToolSpendInput) {
  const selectedPlan = getPlan(tool.key, input.planId);

  if (!selectedPlan) {
    return input.monthlySpend;
  }

  if (tool.category === "api") {
    return input.monthlySpend;
  }

  if (selectedPlan.monthlyFlatPrice !== undefined && selectedPlan.monthlyFlatPrice > 0) {
    return selectedPlan.monthlyFlatPrice;
  }

  return (selectedPlan.monthlySeatPrice ?? 0) * Math.max(input.seats, 1);
}

function cheaperTool(useCase: UseCase, currentTool: ToolDefinition, seats: number) {
  const candidates = TOOL_DEFINITIONS.filter(
    (tool) =>
      tool.key !== currentTool.key &&
      tool.category === "assistant" &&
      tool.useCases.includes(useCase),
  );

  let best: { tool: ToolDefinition; planLabel: string; monthlyCost: number } | null = null;

  for (const candidate of candidates) {
    for (const plan of candidate.plans) {
      if ((plan.minSeats ?? 1) > Math.max(seats, 1)) {
        continue;
      }

      if ((plan.monthlyFlatPrice ?? plan.monthlySeatPrice ?? 0) === 0) {
        continue;
      }

      const monthlyCost =
        plan.monthlyFlatPrice ?? (plan.monthlySeatPrice ?? 0) * Math.max(seats, 1);

      if (!best || monthlyCost < best.monthlyCost) {
        best = { tool: candidate, planLabel: plan.label, monthlyCost };
      }
    }
  }

  return best;
}

function recommendAction(input: AuditFormInput, toolInput: ToolSpendInput): AuditRecommendation {
  const tool = TOOL_MAP[toolInput.toolKey];
  const currentPlan = getPlan(tool.key, toolInput.planId);
  const currentListCost = monthlyListCost(tool, toolInput);
  const retailSpend = Math.max(currentListCost, toolInput.monthlySpend);
  const seats = Math.max(toolInput.seats, 1);

  if (tool.category === "api") {
    const creditSavings = roundCurrency(retailSpend * 0.2);
    const vendorName = tool.label.includes("Anthropic") ? "Anthropic API via Credex credits" : "OpenAI API via Credex credits";

    return {
      action: creditSavings > 0 ? "Route usage through discounted credits" : "Keep current setup",
      recommendedPlan: "API credits",
      vendor: vendorName,
      monthlySavings: creditSavings,
      annualSavings: roundCurrency(creditSavings * 12),
      comparison: `${tool.label} API direct -> ${vendorName}`,
      confidence: creditSavings > 0 ? "medium" : "low",
      reasoning:
        creditSavings > 0
          ? "Direct API usage is usually the cleanest place to apply vendor credits because functionality stays the same while unit cost drops."
          : "Usage already looks lean enough that no pricing-only recommendation is stronger than staying put.",
    };
  }

  if (
    ["business", "team", "teams", "enterprise"].includes(toolInput.planId) &&
    seats <= 2
  ) {
    const lowerPlan = tool.plans.find(
      (plan) => !plan.minSeats && (plan.monthlySeatPrice ?? 0) > 0,
    );
    if (lowerPlan) {
      const nextCost = (lowerPlan.monthlySeatPrice ?? 0) * seats;
      const savings = roundCurrency(retailSpend - nextCost);
      return {
        action: `Downgrade from ${currentPlan?.label ?? "current plan"} to ${lowerPlan.label}`,
        recommendedPlan: lowerPlan.label,
        vendor: tool.label,
        monthlySavings: Math.max(0, savings),
        annualSavings: roundCurrency(Math.max(0, savings) * 12),
        comparison: `${tool.label} ${currentPlan?.label ?? "Current"} -> ${tool.label} ${lowerPlan.label}`,
        confidence: "high",
        reasoning:
          "Small teams rarely extract enough collaboration value from team or enterprise-style tiers to justify the premium over strong individual plans.",
      };
    }
  }

  if (currentPlan?.minSeats && seats < currentPlan.minSeats) {
    const lowerPlan = tool.plans.find((plan) => !plan.minSeats && (plan.monthlySeatPrice ?? 0) > 0);
    if (lowerPlan) {
      const nextCost = (lowerPlan.monthlySeatPrice ?? 0) * seats;
      const savings = roundCurrency(retailSpend - nextCost);
      return {
        action: `Downgrade from ${currentPlan.label} to ${lowerPlan.label}`,
        recommendedPlan: lowerPlan.label,
        vendor: tool.label,
        monthlySavings: Math.max(0, savings),
        annualSavings: roundCurrency(Math.max(0, savings) * 12),
        comparison: `${tool.label} ${currentPlan.label} -> ${tool.label} ${lowerPlan.label}`,
        confidence: "high",
        reasoning: `${currentPlan.label} is priced for larger collaborating teams, but ${seats} seat${seats > 1 ? "s" : ""} does not justify the collaboration premium.`,
      };
    }
  }

  if (retailSpend > currentListCost * 1.2 && currentListCost > 0) {
    const savings = roundCurrency(retailSpend - currentListCost);
    return {
      action: "Realign to published list pricing",
      recommendedPlan: currentPlan?.label ?? "Current plan",
      vendor: tool.label,
      monthlySavings: savings,
      annualSavings: roundCurrency(savings * 12),
      comparison: `${tool.label} current spend -> ${tool.label} list price`,
      confidence: "high",
      reasoning:
        "Your entered spend is materially above current public pricing, which usually signals legacy billing, add-ons, or seats that were not right-sized.",
    };
  }

  const alternative = cheaperTool(input.primaryUseCase, tool, seats);
  if (alternative && retailSpend - alternative.monthlyCost >= 15) {
    const savings = roundCurrency(retailSpend - alternative.monthlyCost);
    return {
      action: `Switch to ${alternative.tool.label} ${alternative.planLabel}`,
      recommendedPlan: alternative.planLabel,
      vendor: alternative.tool.label,
      monthlySavings: savings,
      annualSavings: roundCurrency(savings * 12),
      comparison: `${tool.label} ${currentPlan?.label ?? "Current"} -> ${alternative.tool.label} ${alternative.planLabel}`,
      confidence: "medium",
      reasoning: `${alternative.tool.label} covers a similar ${input.primaryUseCase} workflow at a meaningfully lower retail cost for ${seats} seat${seats > 1 ? "s" : ""}.`,
    };
  }

  if (retailSpend >= 50) {
    const creditSavings = roundCurrency(retailSpend * 0.15);
    return {
      action: "Keep the product, reduce procurement cost with credits",
      recommendedPlan: currentPlan?.label ?? "Current plan",
      vendor: `${tool.label} via Credex`,
      monthlySavings: creditSavings,
      annualSavings: roundCurrency(creditSavings * 12),
      comparison: `${tool.label} retail -> ${tool.label} with discounted credits`,
      confidence: "medium",
      reasoning:
        "If the tool is a strong fit, the lowest-friction optimization is usually keeping the workflow and lowering the purchase price through discounted credits.",
    };
  }

  return {
    action: "Stay on the current setup",
    recommendedPlan: currentPlan?.label ?? "Current plan",
    vendor: tool.label,
    monthlySavings: 0,
    annualSavings: 0,
    comparison: `${tool.label} ${currentPlan?.label ?? "Current"} -> no change`,
    confidence: "low",
    reasoning:
      "This spend looks proportionate for the current team size and use case, so forcing a switch would create more disruption than savings.",
  };
}

export function runAudit(input: AuditFormInput): AuditResult {
  const activeTools = input.tools.filter((tool) => tool.enabled && tool.monthlySpend >= 0);
  const tools: ToolAuditResult[] = activeTools.map((toolInput) => {
    const tool = TOOL_MAP[toolInput.toolKey];
    const recommendation = recommendAction(input, toolInput);
    return {
      toolKey: tool.key,
      toolName: tool.label,
      currentSpend: roundCurrency(toolInput.monthlySpend),
      seats: toolInput.seats,
      currentPlan: getPlan(tool.key, toolInput.planId)?.label ?? toolInput.planId,
      recommendation,
    };
  });

  const totalCurrentSpend = roundCurrency(
    activeTools.reduce((sum, tool) => sum + Math.max(tool.monthlySpend, 0), 0),
  );
  const totalMonthlySavings = roundCurrency(
    tools.reduce((sum, tool) => sum + tool.recommendation.monthlySavings, 0),
  );
  const totalAnnualSavings = roundCurrency(totalMonthlySavings * 12);

  const CTAType =
    totalMonthlySavings > 500 ? "credex" : totalMonthlySavings < 100 ? "notify" : "healthy";

  return {
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    CTAType,
    credibilityNotes: [
      "Recommendations prioritize same-vendor downgrades before vendor switches.",
      "API lines assume savings come from credits, not model-quality trade-offs.",
      "Custom enterprise tiers are modeled conservatively and flagged in PRICING_DATA.md.",
    ],
    tools,
  };
}
