import { randomUUID } from "crypto";

import type { AuditFormInput, AuditResult, StoredReport } from "@/lib/types";
import { prisma } from "@/lib/prisma";

type StoredLead = {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  createdAt: string;
};

type PersistedRecord = StoredReport & {
  lead?: StoredLead;
};

type SupabaseAuditReportRow = {
  id: string;
  slug: string;
  createdAt: string;
  inputJson: AuditFormInput;
  auditJson: AuditResult;
  summary: string;
};

function toStoredReport(record: {
  slug: string;
  createdAt: Date | string;
  inputJson: unknown;
  auditJson: unknown;
  summary: string;
  lead: { id: string } | null;
}): PersistedRecord {
  return {
    slug: record.slug,
    createdAt:
      record.createdAt instanceof Date
        ? record.createdAt.toISOString()
        : record.createdAt,
    input: record.inputJson as AuditFormInput,
    audit: record.auditJson as AuditResult,
    summary: record.summary,
    leadCaptured: Boolean(record.lead),
  };
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

async function supabaseRequest<T>(path: string, init?: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function getSupabaseLead(reportId: string) {
  const rows = await supabaseRequest<Array<{ id: string }>>(
    `Lead?reportId=eq.${encodeURIComponent(reportId)}&select=id&limit=1`,
  );

  return rows[0] ?? null;
}

export async function createStoredReport(report: {
  slug: string;
  input: AuditFormInput;
  audit: AuditResult;
  summary: string;
}) {
  if (getSupabaseConfig()) {
    const rows = await supabaseRequest<SupabaseAuditReportRow[]>("AuditReport", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        id: randomUUID(),
        slug: report.slug,
        teamSize: report.input.teamSize,
        primaryUseCase: report.input.primaryUseCase,
        inputJson: report.input,
        auditJson: report.audit,
        summary: report.summary,
        totalMonthlySavings: report.audit.totalMonthlySavings,
        totalAnnualSavings: report.audit.totalAnnualSavings,
      }),
    });

    return toStoredReport({ ...rows[0], lead: null });
  }

  const record = await prisma.auditReport.create({
    data: {
      slug: report.slug,
      teamSize: report.input.teamSize,
      primaryUseCase: report.input.primaryUseCase,
      inputJson: report.input,
      auditJson: report.audit,
      summary: report.summary,
      totalMonthlySavings: report.audit.totalMonthlySavings,
      totalAnnualSavings: report.audit.totalAnnualSavings,
    },
    include: { lead: true },
  });

  return toStoredReport(record);
}

export async function getStoredReport(slug: string) {
  if (getSupabaseConfig()) {
    const rows = await supabaseRequest<SupabaseAuditReportRow[]>(
      `AuditReport?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    );
    const record = rows[0];

    if (!record) {
      return null;
    }

    const lead = await getSupabaseLead(record.id);
    return toStoredReport({ ...record, lead });
  }

  const record = await prisma.auditReport.findUnique({
    where: { slug },
    include: { lead: true },
  });

  return record ? toStoredReport(record) : null;
}

export async function captureLead(
  slug: string,
  lead: Omit<StoredLead, "createdAt">,
) {
  if (getSupabaseConfig()) {
    const rows = await supabaseRequest<Array<{ id: string }>>(
      `AuditReport?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
    );
    const record = rows[0];

    if (!record) {
      return null;
    }

    const existingLead = await getSupabaseLead(record.id);

    if (existingLead) {
      await supabaseRequest<null>(
        `Lead?reportId=eq.${encodeURIComponent(record.id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            email: lead.email,
            companyName: lead.companyName,
            role: lead.role,
            teamSize: lead.teamSize,
          }),
        },
      );
    } else {
      await supabaseRequest<unknown>("Lead", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          id: randomUUID(),
          reportId: record.id,
          email: lead.email,
          companyName: lead.companyName,
          role: lead.role,
          teamSize: lead.teamSize,
        }),
      });
    }

    return getStoredReport(slug);
  }

  const record = await prisma.auditReport.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!record) {
    return null;
  }

  await prisma.lead.upsert({
    where: { reportId: record.id },
    create: {
      reportId: record.id,
      email: lead.email,
      companyName: lead.companyName,
      role: lead.role,
      teamSize: lead.teamSize,
    },
    update: {
      email: lead.email,
      companyName: lead.companyName,
      role: lead.role,
      teamSize: lead.teamSize,
    },
  });

  return getStoredReport(slug);
}
