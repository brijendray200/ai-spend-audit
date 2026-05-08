import { describe, expect, it } from "vitest";

import { runAudit } from "@/lib/audit-engine";
import type { AuditFormInput } from "@/lib/types";

function baseInput(overrides?: Partial<AuditFormInput>): AuditFormInput {
  return {
    companyName: "Acme",
    teamSize: 4,
    primaryUseCase: "coding",
    tools: [
      { toolKey: "cursor", enabled: true, planId: "business", monthlySpend: 80, seats: 2 },
      { toolKey: "copilot", enabled: false, planId: "individual", monthlySpend: 0, seats: 1 },
      { toolKey: "claude", enabled: false, planId: "pro", monthlySpend: 0, seats: 1 },
      { toolKey: "chatgpt", enabled: false, planId: "plus", monthlySpend: 0, seats: 1 },
      { toolKey: "anthropicApi", enabled: false, planId: "api", monthlySpend: 0, seats: 1 },
      { toolKey: "openaiApi", enabled: false, planId: "api", monthlySpend: 0, seats: 1 },
      { toolKey: "gemini", enabled: false, planId: "pro", monthlySpend: 0, seats: 1 },
      { toolKey: "windsurf", enabled: false, planId: "pro", monthlySpend: 0, seats: 1 },
    ],
    ...overrides,
  };
}

describe("runAudit", () => {
  it("downgrades plans that are below minimum seat thresholds", () => {
    const result = runAudit(baseInput());
    expect(result.tools[0]?.recommendation.action).toContain("Downgrade");
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("captures credits-based savings for API spend", () => {
    const result = runAudit(
      baseInput({
        tools: baseInput().tools.map((tool) =>
          tool.toolKey === "openaiApi"
            ? { ...tool, enabled: true, monthlySpend: 500, seats: 1 }
            : { ...tool, enabled: false, monthlySpend: 0 },
        ),
      }),
    );

    expect(result.tools[0]?.recommendation.action).toContain("credits");
    expect(result.tools[0]?.recommendation.monthlySavings).toBe(100);
  });

  it("flags overspend versus current list pricing", () => {
    const result = runAudit(
      baseInput({
        tools: baseInput().tools.map((tool) =>
          tool.toolKey === "copilot"
            ? { ...tool, enabled: true, planId: "individual", seats: 1, monthlySpend: 40 }
            : { ...tool, enabled: false, monthlySpend: 0 },
        ),
      }),
    );

    expect(result.tools[0]?.recommendation.action).toContain("list pricing");
    expect(result.tools[0]?.recommendation.monthlySavings).toBe(30);
  });

  it("recommends cheaper alternatives when the gap is meaningful", () => {
    const result = runAudit(
      baseInput({
        teamSize: 2,
        tools: baseInput().tools.map((tool) =>
          tool.toolKey === "claude"
            ? { ...tool, enabled: true, planId: "max", seats: 1, monthlySpend: 100 }
            : { ...tool, enabled: false, monthlySpend: 0 },
        ),
      }),
    );

    expect(result.tools[0]?.recommendation.action).toContain("Switch");
    expect(result.tools[0]?.recommendation.monthlySavings).toBeGreaterThanOrEqual(15);
  });

  it("stays honest when savings are negligible", () => {
    const result = runAudit(
      baseInput({
        tools: baseInput().tools.map((tool) =>
          tool.toolKey === "cursor"
            ? { ...tool, enabled: true, planId: "pro", seats: 1, monthlySpend: 20 }
            : { ...tool, enabled: false, monthlySpend: 0 },
        ),
      }),
    );

    expect(result.tools[0]?.recommendation.action).toContain("Stay");
    expect(result.CTAType).toBe("notify");
  });

  it("recommends enterprise downgrade for small teams on enterprise plans", () => {
    const result = runAudit(
      baseInput({
        teamSize: 3,
        tools: baseInput().tools.map((tool) =>
          tool.toolKey === "chatgpt"
            ? { ...tool, enabled: true, planId: "enterprise", seats: 3, monthlySpend: 180 }
            : { ...tool, enabled: false, monthlySpend: 0 },
        ),
      }),
    );

    // Enterprise plan has minSeats of 10, so 3 seats should trigger a downgrade
    expect(result.tools[0]?.recommendation.action).toContain("Downgrade");
    expect(result.tools[0]?.recommendation.monthlySavings).toBeGreaterThan(0);
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("triggers credex CTA type when total savings exceed $500", () => {
    const result = runAudit(
      baseInput({
        teamSize: 10,
        tools: baseInput().tools.map((tool) => {
          if (tool.toolKey === "openaiApi") {
            return { ...tool, enabled: true, monthlySpend: 2000, seats: 1 };
          }
          if (tool.toolKey === "anthropicApi") {
            return { ...tool, enabled: true, monthlySpend: 1500, seats: 1 };
          }
          return { ...tool, enabled: false, monthlySpend: 0 };
        }),
      }),
    );

    expect(result.CTAType).toBe("credex");
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });
});
