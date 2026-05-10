import { randomUUID } from "crypto";
import { deflateRawSync, inflateRawSync } from "zlib";

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

const memoryReports = new Map<string, PersistedRecord>();

type SupabaseAuditReportRow = {
  id: string;
  slug: string;
  createdAt: string;
  inputJson: AuditFormInput;
  auditJson: AuditResult;
  summary: string;
};

type EncodedReport = {
  createdAt: string;
  input: AuditFormInput;
  audit: AuditResult;
  summary: string;
};

function encodeFallbackReport(report: EncodedReport) {
  return deflateRawSync(JSON.stringify(report)).toString("base64url");
}

function decodeFallbackReport(slug: string): PersistedRecord | null {
  try {
    const report = JSON.parse(
      inflateRawSync(Buffer.from(slug, "base64url")).toString("utf8"),
    ) as EncodedReport;

    return {
      slug,
      createdAt: report.createdAt,
      input: report.input,
      audit: report.audit,
      summary: report.summary,
      leadCaptured: false,
    };
  } catch {
    return null;
  }
}

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

function shouldUseMemoryFallback() {
  return !getSupabaseConfig() && process.env.VERCEL === "1";
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
  if (shouldUseMemoryFallback()) {
    const createdAt = new Date().toISOString();
    const slug = encodeFallbackReport({
      createdAt,
      input: report.input,
      audit: report.audit,
      summary: report.summary,
    });
    const record: PersistedRecord = {
      slug,
      createdAt,
      input: report.input,
      audit: report.audit,
      summary: report.summary,
      leadCaptured: false,
    };
    memoryReports.set(slug, record);
    return record;
  }

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
  if (shouldUseMemoryFallback()) {
    return memoryReports.get(slug) ?? decodeFallbackReport(slug);
  }

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
  if (shouldUseMemoryFallback()) {
    const record = memoryReports.get(slug);

    if (!record) {
      const decoded = decodeFallbackReport(slug);
      return decoded ? { ...decoded, leadCaptured: true } : null;
    }

    memoryReports.set(slug, {
      ...record,
      lead: {
        ...lead,
        createdAt: new Date().toISOString(),
      },
      leadCaptured: true,
    });
    return memoryReports.get(slug) ?? null;
  }

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
