"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RotateCcw, Loader2 } from "lucide-react";

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
    monthlySpend: 0,
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
          return (
            <div
              key={tool.key}
              className={`rounded-[28px] border p-5 transition-all duration-200 ${
                toolState.enabled
                  ? "bg-[color:var(--surface-strong)] border-[color:var(--primary)]/30"
                  : "bg-[color:var(--surface-strong)] opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{tool.label}</h3>
                    <Badge variant="neutral">{tool.category}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    {tool.officialUrl}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
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
                  Include
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
                  {formatCurrency(
                    getPlan(tool.key, toolState.planId)?.monthlySeatPrice
                      ? (getPlan(tool.key, toolState.planId)?.monthlySeatPrice ?? 0) *
                          Math.max(toolState.seats, 1)
                      : toolState.monthlySpend,
                  )}
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
