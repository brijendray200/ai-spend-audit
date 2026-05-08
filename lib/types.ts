export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolKey =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "anthropicApi"
  | "openaiApi"
  | "gemini"
  | "windsurf";

export type ToolPlan = {
  id: string;
  label: string;
  monthlySeatPrice?: number;
  monthlyFlatPrice?: number;
  minSeats?: number;
  notes?: string;
};

export type ToolDefinition = {
  key: ToolKey;
  label: string;
  category: "assistant" | "api";
  useCases: UseCase[];
  plans: ToolPlan[];
  alternativeFor: ToolKey[];
  officialUrl: string;
};

export type ToolSpendInput = {
  toolKey: ToolKey;
  enabled: boolean;
  planId: string;
  monthlySpend: number;
  seats: number;
};

export type AuditFormInput = {
  companyName?: string;
  teamSize: number;
  primaryUseCase: UseCase;
  tools: ToolSpendInput[];
};

export type AuditRecommendation = {
  action: string;
  recommendedPlan: string;
  vendor: string;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  comparison: string;
  confidence: "high" | "medium" | "low";
};

export type ToolAuditResult = {
  toolKey: ToolKey;
  toolName: string;
  currentSpend: number;
  seats: number;
  currentPlan: string;
  recommendation: AuditRecommendation;
};

export type AuditResult = {
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  credibilityNotes: string[];
  tools: ToolAuditResult[];
  CTAType: "credex" | "notify" | "healthy";
};

export type StoredReport = {
  slug: string;
  createdAt: string;
  input: AuditFormInput;
  audit: AuditResult;
  summary: string;
  leadCaptured: boolean;
};
