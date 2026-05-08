"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ToolAuditResult } from "@/lib/types";

const COLORS = [
  "#38bdf8",
  "#22d3ee",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#4ade80",
];

export function SavingsChart({ tools }: { tools: ToolAuditResult[] }) {
  const data = tools
    .filter((t) => t.recommendation.monthlySavings > 0)
    .map((t) => ({
      name: t.toolName,
      savings: t.recommendation.monthlySavings,
      current: t.currentSpend,
    }));

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-[300px] w-full rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barCategoryGap="24%"
          margin={{ top: 12, right: 18, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(56, 189, 248, 0.08)" }}
            contentStyle={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
              fontSize: 13,
              boxShadow: "0 18px 48px -24px rgba(0, 0, 0, 0.55)",
            }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--foreground)", fontWeight: 700 }}
            formatter={(value) => [`$${value}/mo`, "Savings"]}
          />
          <Bar dataKey="savings" maxBarSize={92} radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
