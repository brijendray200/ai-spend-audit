import type { StoredReport } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function PublicReport({ report }: { report: StoredReport }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-8">
      <Card className="overflow-hidden">
        <div className="bg-slate-950 px-6 py-8 text-white md:px-8">
          <Badge variant="primary">Public report</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {formatCurrency(report.audit.totalMonthlySavings)} monthly savings identified
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Generated for a {report.input.teamSize}-person team focused on {report.input.primaryUseCase}. This
            share view intentionally removes company and email data.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border bg-[color:var(--surface-strong)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Current spend</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(report.audit.totalCurrentSpend)}</p>
            </div>
            <div className="rounded-[24px] border bg-[color:var(--surface-strong)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Monthly savings</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(report.audit.totalMonthlySavings)}</p>
            </div>
            <div className="rounded-[24px] border bg-[color:var(--surface-strong)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Annual savings</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(report.audit.totalAnnualSavings)}</p>
            </div>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold">Personalized summary</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{report.summary}</p>
          </Card>

          <div className="grid gap-4">
            {report.audit.tools.map((tool) => (
              <Card key={tool.toolKey} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{tool.toolName}</h3>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">{tool.currentPlan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">Recommendation</p>
                    <p className="mt-1 font-semibold">{tool.recommendation.action}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{tool.recommendation.reasoning}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border bg-[color:var(--surface-strong)] px-4 py-3">
                  <span className="text-sm text-[color:var(--muted)]">{tool.recommendation.comparison}</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(tool.recommendation.monthlySavings)} / month
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
