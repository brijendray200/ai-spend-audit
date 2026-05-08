import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendAuditConfirmation } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureLead, getStoredReport } from "@/lib/report-store";

const leadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  website: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`lead:${ip}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many email submissions." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead capture payload." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const report = await getStoredReport(slug);
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  await captureLead(slug, {
    email: parsed.data.email,
    companyName: parsed.data.companyName,
    role: parsed.data.role,
    teamSize: parsed.data.teamSize,
  });

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await sendAuditConfirmation({
    email: parsed.data.email,
    companyName: parsed.data.companyName,
    monthlySavings: report.audit.totalMonthlySavings,
    shareUrl: `${origin}/r/${slug}`,
  });

  return NextResponse.json({ ok: true });
}
