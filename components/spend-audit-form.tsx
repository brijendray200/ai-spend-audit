"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, RotateCcw } from "lucide-react";

import { TOOL_DEFINITIONS, getPlan } from "@/lib/pricing-data";
import type { AuditFormInput, StoredReport, ToolSpendInput, UseCase } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "credex-audit-form";

const useCases: Array<{ label: string; value: UseCase }> = [
  { label: "Coding", value: "coding" },
  { label: "Writing", value: "writing" },
  { label: "Data", value: "data" },
  { label: "Research", value: "research" },
  { label: "Mixed", value: "mixed" },
];

function buildDefaultTools(): ToolSpendInput[] {
  return TOOL_DEFINITIONS.map((tool) => ({
    toolKey: tool.key,
    enabled: tool.key === "cursor" || tool.key === "chatgpt",
    planId: tool.plans[0]?.id ?? "api",
    monthlySpend:
      tool.key === "cursor" || tool.key === "chatgpt"
        ? tool.plans[0]?.monthlySeatPrice ?? tool.plans[0]?.monthlyFlatPrice ?? 0
        : 0,
    seats: 1,
  }));
}

const defaultState: AuditFormInput = {
  companyName: "",
  teamSize: 5,
  primaryUseCase: "coding",
  tools: buildDefaultTools(),
};

export function SpendAuditForm() {
  const router = useRouter();
  const [form, setForm] = useState<AuditFormInput>(defaultState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setForm(JSON.parse(raw) as AuditFormInput);
      }
    } catch {
      setForm(defaultState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const totalSpend = useMemo(
    () =>
      form.tools.reduce((sum, tool) => sum + (tool.enabled ? Number(tool.monthlySpend || 0) : 0), 0),
    [form.tools],
  );

  const enabledCount = form.tools.filter((t) => t.enabled).length;

  function baselineFor(toolIndex: number) {
    const toolState = form.tools[toolIndex];
    const plan = getPlan(toolState.toolKey, toolState.planId);

    if (plan?.monthlySeatPrice !== undefined) {
      return plan.monthlySeatPrice * Math.max(toolState.seats, 1);
    }

    return toolState.monthlySpend;
  }

  async function submitAudit() {
    if (enabledCount === 0) {
      setMessage("Please enable at least one tool to run the audit.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as StoredReport | { error: string };

      if (!response.ok || "error" in data) {
        setMessage("error" in data ? data.error : "Unable to run the audit.");
        return;
      }

      // Redirect to results page
      router.push(`/results/${data.slug}`);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Badge variant="primary">Input</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Model your current AI stack
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            Enter the tools your team pays for, the plan, current monthly spend,
            seats, and your primary workflow. The form saves locally so you can
            refresh without losing work.
          </p>
        </div>
        <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Current spend
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {formatCurrency(totalSpend)}
          </p>
          <p className="text-xs text-[color:var(--muted)]">
            {enabledCount} tool{enabledCount !== 1 ? "s" : ""} selected
          </p>
        </div>
      </div>

      {/* ── Team info ── */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm">
          Company name (optional)
          <input
            className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
            placeholder="e.g. Acme Inc."
            value={form.companyName || ""}
            onChange={(event) =>
              setForm({ ...form, companyName: event.target.value })
            }
          />
        </label>

        <label className="grid gap-2 text-sm">
          Team size
          <input
            className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
            min={1}
            type="number"
            value={form.teamSize}
            onChange={(event) =>
              setForm({ ...form, teamSize: Number(event.target.value) || 1 })
            }
          />
        </label>

        <label className="grid gap-2 text-sm">
          Primary use case
          <select
            className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
            value={form.primaryUseCase}
            onChange={(event) =>
              setForm({
                ...form,
                primaryUseCase: event.target.value as UseCase,
              })
            }
          >
            {useCases.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ── Tool cards ── */}
      <div className="mt-8 grid gap-4">
        {TOOL_DEFINITIONS.map((tool, toolIndex) => {
          const toolState = form.tools[toolIndex];
          const baseline = baselineFor(toolIndex);
          return (
            <div
              key={tool.key}
              className={`rounded-[22px] border p-5 transition-all duration-200 ${
                toolState.enabled
                  ? "border-[color:var(--primary)]/45 bg-[color:var(--surface-strong)] shadow-[0_18px_48px_-36px_rgba(37,99,235,0.8)]"
                  : "border-[color:var(--border)] bg-[color:var(--surface)] opacity-75"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{tool.label}</h3>
                    <Badge variant="neutral">{tool.category}</Badge>
                    {toolState.enabled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--primary-foreground)] px-2.5 py-1 text-xs font-semibold text-[color:var(--primary)]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Selected
                      </span>
                    ) : (
                      <span className="rounded-full border border-[color:var(--border)] px-2.5 py-1 text-xs font-medium text-[color:var(--muted)]">
                        Not included
                      </span>
                    )}
                  </div>
                  <a
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] underline-offset-4 hover:text-[color:var(--primary)] hover:underline"
                    href={tool.officialUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Official pricing source
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <label
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium cursor-pointer ${
                    toolState.enabled
                      ? "border-[color:var(--primary)]/40 bg-[color:var(--primary-foreground)] text-[color:var(--primary)]"
                      : "border-[color:var(--border)] text-[color:var(--muted)]"
                  }`}
                >
                  <input
                    checked={toolState.enabled}
                    type="checkbox"
                    className="h-4 w-4 rounded accent-sky-500"
                    onChange={(event) => {
                      const nextTools = [...form.tools];
                      nextTools[toolIndex] = {
                        ...toolState,
                        enabled: event.target.checked,
                      };
                      setForm({ ...form, tools: nextTools });
                    }}
                  />
                  {toolState.enabled ? "Included in audit" : "Include in audit"}
                </label>
              </div>

              {toolState.enabled && (
                <div className="mt-5 grid gap-4 md:grid-cols-3 animate-fade-in">
                  <label className="grid gap-2 text-sm">
                    Plan
                    <select
                      className="rounded-2xl border bg-[color:var(--surface-strong)] text-[color:var(--foreground)] px-4 py-3"
                      value={toolState.planId}
                      onChange={(event) => {
                        const nextTools = [...form.tools];
                        nextTools[toolIndex] = {
                          ...toolState,
                          planId: event.target.value,
                        };
                        setForm({ ...form, tools: nextTools });
                      }}
                    >
                      {tool.plans.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm">
                    Monthly spend ($)
                    <input
                      className="rounded-2xl border bg-[color:var(--surface-strong)] text-[color:var(--foreground)] px-4 py-3"
                      min={0}
                      step={1}
                      type="number"
                      value={toolState.monthlySpend}
                      onChange={(event) => {
                        const nextTools = [...form.tools];
                        nextTools[toolIndex] = {
                          ...toolState,
                          monthlySpend: Number(event.target.value) || 0,
                        };
                        setForm({ ...form, tools: nextTools });
                      }}
                    />
                  </label>

                  <label className="grid gap-2 text-sm">
                    Seats
                    <input
                      className="rounded-2xl border bg-[color:var(--surface-strong)] text-[color:var(--foreground)] px-4 py-3"
                      min={1}
                      type="number"
                      value={toolState.seats}
                      onChange={(event) => {
                        const nextTools = [...form.tools];
                        nextTools[toolIndex] = {
                          ...toolState,
                          seats: Number(event.target.value) || 1,
                        };
                        setForm({ ...form, tools: nextTools });
                      }}
                    />
                  </label>
                </div>
              )}

              {toolState.enabled && (
                <p className="mt-3 text-xs text-[color:var(--muted)]">
                  Baseline retail for this plan:{" "}
                  {formatCurrency(baseline)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button disabled={loading} onClick={submitAudit}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running audit...
            </>
          ) : (
            "Run free audit"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setForm(defaultState);
            setMessage("Form reset.");
          }}
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset
        </Button>
        {message && (
          <p className="flex items-center gap-1.5 text-sm text-[color:var(--muted)]">
            <AlertCircle className="h-4 w-4" />
            {message}
          </p>
        )}
      </div>
    </Card>
  );
}
