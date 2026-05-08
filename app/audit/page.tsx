import type { Metadata } from "next";

import { SpendAuditForm } from "@/components/spend-audit-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Run Free Audit",
  description:
    "Enter your AI tools, plans, and spending to get an instant savings report. No login required.",
};

export default function AuditPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <Badge variant="primary">Free audit</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Input your stack, get a shareable savings report.
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
          No login required. The app runs the math, explains the recommendation
          per tool, and only asks for email after the user already has the
          result.
        </p>
      </div>
      <SpendAuditForm />
    </section>
  );
}
