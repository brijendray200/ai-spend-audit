import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { runAudit } from "@/lib/audit-engine";
import { checkRateLimit } from "@/lib/rate-limit";
import { createStoredReport } from "@/lib/report-store";
import { generateSummary } from "@/lib/summary";
import type { StoredReport } from "@/lib/types";

const reportSchema = z.object({
  companyName: z.string().optional(),
  teamSize: z.number().min(1),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(
    z.object({
      toolKey: z.enum([
        "cursor",
        "copilot",
        "claude",
        "chatgpt",
        "anthropicApi",
        "openaiApi",
        "gemini",
        "windsurf",
      ]),
      enabled: z.boolean(),
      planId: z.string(),
      monthlySpend: z.number().min(0),
      seats: z.number().min(1),
    }),
  ),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`report:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many audits in a short window." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = reportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid audit input." }, { status: 400 });
  }

  const audit = runAudit(parsed.data);
  const summary = await generateSummary(parsed.data, audit);
  const slug = randomUUID().slice(0, 8);

  const record = await createStoredReport({
    slug,
    input: parsed.data,
    audit,
    summary,
  });

  const stored: StoredReport = {
    slug: record.slug,
    createdAt: record.createdAt,
    input: parsed.data,
    audit,
    summary,
    leadCaptured: false,
  };

  return NextResponse.json(stored);
}
