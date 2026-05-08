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

function toStoredReport(record: {
  slug: string;
  createdAt: Date;
  inputJson: unknown;
  auditJson: unknown;
  summary: string;
  lead: { id: string } | null;
}): PersistedRecord {
  return {
    slug: record.slug,
    createdAt: record.createdAt.toISOString(),
    input: record.inputJson as AuditFormInput,
    audit: record.auditJson as AuditResult,
    summary: record.summary,
    leadCaptured: Boolean(record.lead),
  };
}

export async function createStoredReport(report: {
  slug: string;
  input: AuditFormInput;
  audit: AuditResult;
  summary: string;
}) {
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
