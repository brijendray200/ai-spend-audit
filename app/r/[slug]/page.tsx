import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicReport } from "@/components/public-report";
import { getStoredReport } from "@/lib/report-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = await getStoredReport(slug);

  if (!report) {
    return {};
  }

  const title = `${report.audit.totalMonthlySavings.toFixed(0)} USD monthly AI savings found`;
  const description = `Public Stackwise audit for a ${report.input.teamSize}-person ${report.input.primaryUseCase} team.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/r/${slug}`,
      images: [`/r/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/r/${slug}/opengraph-image`],
    },
  };
}

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await getStoredReport(slug);

  if (!report) {
    notFound();
  }

  return <PublicReport report={report} />;
}
