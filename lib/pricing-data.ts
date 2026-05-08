import type { ToolDefinition, ToolKey, ToolPlan } from "@/lib/types";

function plan(id: string, label: string, config: Omit<ToolPlan, "id" | "label">): ToolPlan {
  return { id, label, ...config };
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    key: "cursor",
    label: "Cursor",
    category: "assistant",
    useCases: ["coding", "mixed"],
    officialUrl: "https://www.cursor.com/pricing",
    alternativeFor: ["copilot", "windsurf"],
    plans: [
      plan("hobby", "Hobby", { monthlySeatPrice: 0 }),
      plan("pro", "Pro", { monthlySeatPrice: 20 }),
      plan("business", "Business", { monthlySeatPrice: 40, minSeats: 2 }),
      plan("enterprise", "Enterprise", { monthlySeatPrice: 60, minSeats: 10, notes: "Modeled estimate for internal budgeting; confirm directly with sales." }),
    ],
  },
  {
    key: "copilot",
    label: "GitHub Copilot",
    category: "assistant",
    useCases: ["coding", "mixed"],
    officialUrl: "https://github.com/features/copilot/plans",
    alternativeFor: ["cursor", "windsurf"],
    plans: [
      plan("individual", "Individual", { monthlySeatPrice: 10 }),
      plan("business", "Business", { monthlySeatPrice: 19, minSeats: 2 }),
      plan("enterprise", "Enterprise", { monthlySeatPrice: 39, minSeats: 10 }),
    ],
  },
  {
    key: "claude",
    label: "Claude",
    category: "assistant",
    useCases: ["writing", "research", "coding", "mixed"],
    officialUrl: "https://www.anthropic.com/pricing",
    alternativeFor: ["chatgpt", "gemini"],
    plans: [
      plan("free", "Free", { monthlySeatPrice: 0 }),
      plan("pro", "Pro", { monthlySeatPrice: 20 }),
      plan("max", "Max", { monthlySeatPrice: 100 }),
      plan("team", "Team", { monthlySeatPrice: 30, minSeats: 5 }),
      plan("enterprise", "Enterprise", { monthlySeatPrice: 60, minSeats: 10, notes: "Budgeting estimate; enterprise is custom." }),
      plan("api", "API direct", { monthlyFlatPrice: 0, notes: "Spend entered directly by user." }),
    ],
  },
  {
    key: "chatgpt",
    label: "ChatGPT",
    category: "assistant",
    useCases: ["writing", "research", "data", "mixed"],
    officialUrl: "https://openai.com/chatgpt/pricing/",
    alternativeFor: ["claude", "gemini"],
    plans: [
      plan("plus", "Plus", { monthlySeatPrice: 20 }),
      plan("team", "Team / Business", { monthlySeatPrice: 25, minSeats: 2 }),
      plan("enterprise", "Enterprise", { monthlySeatPrice: 60, minSeats: 10, notes: "Budgeting estimate; enterprise is custom." }),
      plan("api", "API direct", { monthlyFlatPrice: 0, notes: "Spend entered directly by user." }),
    ],
  },
  {
    key: "anthropicApi",
    label: "Anthropic API",
    category: "api",
    useCases: ["coding", "writing", "research", "data", "mixed"],
    officialUrl: "https://www.anthropic.com/pricing#api",
    alternativeFor: ["openaiApi"],
    plans: [plan("api", "API direct", { monthlyFlatPrice: 0 })],
  },
  {
    key: "openaiApi",
    label: "OpenAI API",
    category: "api",
    useCases: ["coding", "writing", "research", "data", "mixed"],
    officialUrl: "https://openai.com/api/pricing/",
    alternativeFor: ["anthropicApi", "gemini"],
    plans: [plan("api", "API direct", { monthlyFlatPrice: 0 })],
  },
  {
    key: "gemini",
    label: "Gemini",
    category: "assistant",
    useCases: ["research", "data", "writing", "mixed"],
    officialUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    alternativeFor: ["chatgpt", "claude"],
    plans: [
      plan("pro", "Pro", { monthlySeatPrice: 19.99 }),
      plan("ultra", "Ultra", { monthlySeatPrice: 124.99 }),
      plan("api", "API direct", { monthlyFlatPrice: 0 }),
    ],
  },
  {
    key: "windsurf",
    label: "Windsurf",
    category: "assistant",
    useCases: ["coding", "mixed"],
    officialUrl: "https://windsurf.com/pricing",
    alternativeFor: ["cursor", "copilot"],
    plans: [
      plan("free", "Free", { monthlySeatPrice: 0 }),
      plan("pro", "Pro", { monthlySeatPrice: 15 }),
      plan("teams", "Teams", { monthlySeatPrice: 30, minSeats: 3 }),
      plan("enterprise", "Enterprise", { monthlySeatPrice: 50, minSeats: 10, notes: "Budgeting estimate; enterprise is custom." }),
    ],
  },
];

export const TOOL_MAP = Object.fromEntries(
  TOOL_DEFINITIONS.map((tool) => [tool.key, tool]),
) as Record<ToolKey, ToolDefinition>;

export function getPlan(toolKey: ToolKey, planId: string) {
  return TOOL_MAP[toolKey].plans.find((plan) => plan.id === planId);
}
