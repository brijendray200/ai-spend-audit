import type { AuditFormInput, AuditResult } from "@/lib/types";

function templatedSummary(input: AuditFormInput, audit: AuditResult) {
  const tone =
    audit.totalMonthlySavings > 500
      ? "There is a clear optimization opportunity."
      : audit.totalMonthlySavings < 100
        ? "Your stack is already reasonably disciplined."
        : "There are a few worthwhile optimizations without a major workflow change.";

  return `${tone} For a ${input.teamSize}-person team focused on ${input.primaryUseCase}, the audit found $${audit.totalMonthlySavings.toFixed(
    0,
  )}/month in potential savings from right-sizing plans, removing collaboration overkill, and using discounted credits where the workflow can stay exactly the same. The biggest wins come from ${audit.tools
    .slice(0, 2)
    .map((tool) => tool.recommendation.action.toLowerCase())
    .join(" and ")}.`;
}

export async function generateSummary(input: AuditFormInput, audit: AuditResult) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const fallback = templatedSummary(input, audit);

  const prompt = `You are writing a concise CFO-friendly AI spend audit summary.
Team size: ${input.teamSize}
Primary use case: ${input.primaryUseCase}
Monthly savings: $${audit.totalMonthlySavings}
Annual savings: $${audit.totalAnnualSavings}
Per-tool actions:
${audit.tools
  .map(
    (tool) =>
      `- ${tool.toolName}: ${tool.recommendation.action}; savings $${tool.recommendation.monthlySavings}/mo; reason: ${tool.recommendation.reasoning}`,
  )
  .join("\n")}

Write one paragraph, 80-110 words, practical and specific, no hype.`;

  try {
    if (anthropicKey) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 220,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          content?: Array<{ type: string; text?: string }>;
        };
        const text = data.content?.find((item) => item.type === "text")?.text?.trim();
        if (text) {
          return text;
        }
      }
    }

    if (openAiKey) {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt,
          max_output_tokens: 220,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          output_text?: string;
        };
        if (data.output_text?.trim()) {
          return data.output_text.trim();
        }
      }
    }
  } catch {
    return fallback;
  }

  return fallback;
}
