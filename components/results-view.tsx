"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingDown,
  Share2,
  CheckCircle2,
  ArrowRight,
  Copy,
  ExternalLink,
  Gauge,
} from "lucide-react";

import type { StoredReport } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SavingsChart } from "@/components/charts/savings-chart";
import { LeadCapture } from "@/components/lead-capture";

export function ResultsView({ report }: { report: StoredReport }) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${report.slug}`
      : `/r/${report.slug}`;

  function copyShareLink() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { audit, input, summary } = report;

  // Compute optimization score (0-100)
  const optimizationScore = audit.totalCurrentSpend > 0
    ? Math.round(Math.min(100, (audit.totalMonthlySavings / audit.totalCurrentSpend) * 100))
    : 0;
  const scoreLabel = optimizationScore >= 30 ? "High" : optimizationScore >= 10 ? "Moderate" : "Low";
  const scoreColor = optimizationScore >= 30 ? "text-emerald-500" : optimizationScore >= 10 ? "text-amber-500" : "text-[color:var(--primary)]";

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-8">
      {/* ── Header stats ── */}
      <div className="mb-8">
        <Badge variant="primary">Audit Results</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {formatCurrency(audit.totalMonthlySavings)}{" "}
          <span className="text-[color:var(--muted)]">monthly savings</span>
        </h1>
        <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
          {formatCurrency(audit.totalAnnualSavings)} annualized for a{" "}
          {input.teamSize}-person {input.primaryUseCase} team. Current stack
          spend: {formatCurrency(audit.totalCurrentSpend)}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Current spend
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {formatCurrency(audit.totalCurrentSpend)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">per month</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Monthly savings
          </p>
          <p className="mt-2 text-3xl font-semibold text-emerald-500">
            {formatCurrency(audit.totalMonthlySavings)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">identified</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Annual savings
          </p>
          <p className="mt-2 text-3xl font-semibold text-emerald-500">
            {formatCurrency(audit.totalAnnualSavings)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">projected</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Optimization score
          </p>
          <p className={`mt-2 text-3xl font-semibold ${scoreColor}`}>
            {optimizationScore}%
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">{scoreLabel} opportunity</p>
        </Card>
      </div>

      {/* ── Savings chart ── */}
      <Card className="mt-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">Savings by tool</h2>
        <SavingsChart tools={audit.tools} />
      </Card>

      {/* ── AI Summary ── */}
      <Card className="mt-8 p-6">
        <Badge variant="neutral">AI-generated summary</Badge>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          {summary}
        </p>
      </Card>

      {/* ── Per-tool recommendations ── */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Per-tool recommendations</h2>
        <div className="grid gap-4">
          {audit.tools.map((tool) => (
            <Card key={tool.toolKey} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{tool.toolName}</h3>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {tool.currentPlan} · {formatCurrency(tool.currentSpend)}/mo ·{" "}
                    {tool.seats} seat{tool.seats > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={tool.recommendation.confidence === "high" ? "primary" : "neutral"}>
                    {tool.recommendation.confidence} confidence
                  </Badge>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-emerald-500">
                      {formatCurrency(tool.recommendation.monthlySavings)}
                    </p>
                    <p className="text-xs text-[color:var(--muted)]">
                      savings / month
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-[20px] border bg-[color:var(--surface-strong)] p-4">
                <div className="flex items-start gap-3">
                  {tool.recommendation.monthlySavings > 0 ? (
                    <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--primary)]" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">
                      {tool.recommendation.action}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                      {tool.recommendation.reasoning}
                    </p>
                    <p className="mt-2 text-xs text-[color:var(--muted)]">
                      {tool.recommendation.comparison}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── CTA section ── */}
      {audit.CTAType === "credex" && (
        <Card className="mt-8 overflow-hidden bg-gradient-to-br from-sky-600 to-cyan-500 p-8 text-white">
          <Badge variant="primary">High savings identified</Badge>
          <h2 className="mt-4 text-2xl font-semibold">
            Your savings exceed $500/month
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-100">
            Credex can help you lock in these savings through procurement
            optimization and discounted credits. No workflow changes needed.
          </p>
          <div className="mt-6">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Talk to Credex
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {audit.CTAType === "healthy" && (
        <Card className="mt-8 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
            <div>
              <h2 className="text-xl font-semibold">
                Good news — your stack has room to optimize
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                The recommendations above can be implemented directly. When you
                are ready for more complex procurement optimization, Credex is
                available.
              </p>
            </div>
          </div>
        </Card>
      )}

      {audit.CTAType === "notify" && (
        <Card className="mt-8 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[color:var(--primary)]" />
            <div>
              <h2 className="text-xl font-semibold">
                Your AI spend is already well-optimized
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                Your current stack looks proportionate for the team size and use
                case. No major changes recommended at this time.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Share section ── */}
      <Card className="mt-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-[color:var(--primary)]" />
            <div>
              <p className="text-sm font-semibold">Share this report</p>
              <p className="text-xs text-[color:var(--muted)]">
                Public link strips company and email data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Copy className="mr-2 h-3.5 w-3.5" />
              {copied ? "Copied!" : "Copy link"}
            </Button>
            <a href={`/r/${report.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Open
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* ── Lead capture ── */}
      <div className="mt-8">
        <LeadCapture slug={report.slug} ctaType={audit.CTAType} />
      </div>

      {/* ── Credibility notes ── */}
      <div className="mt-8 rounded-[24px] border bg-[color:var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
          Methodology notes
        </p>
        <ul className="mt-3 grid gap-2">
          {audit.credibilityNotes.map((note, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm leading-6 text-[color:var(--muted)]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--primary)]" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
