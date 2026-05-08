import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultsView } from "@/components/results-view";
import { getStoredReport } from "@/lib/report-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const report = await getStoredReport(id);

  if (!report) {
    return { title: "Report not found" };
  }

  return {
    title: `$${report.audit.totalMonthlySavings.toFixed(0)}/month potential AI savings`,
    description: `See the current spend, recommended actions, and potential savings for a ${report.input.teamSize}-person ${report.input.primaryUseCase} team.`,
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getStoredReport(id);

  if (!report) {
    notFound();
  }

  return <ResultsView report={report} />;
}
