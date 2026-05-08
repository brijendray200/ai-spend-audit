"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LeadCaptureProps = {
  slug: string;
  ctaType: "credex" | "notify" | "healthy";
  onCaptured?: () => void;
};

export function LeadCapture({ slug, ctaType, onCaptured }: LeadCaptureProps) {
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
      role: String(formData.get("role") ?? ""),
      teamSize: Number(formData.get("leadTeamSize") ?? 0),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch(`/api/reports/${slug}/lead`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || data.error) {
        setMessage(data.error ?? "Unable to save your email.");
        return;
      }

      setCaptured(true);
      setMessage("Email captured. A confirmation note has been queued.");
      onCaptured?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Badge variant="neutral">
            <Mail className="mr-1.5 h-3 w-3" />
            Email this report
          </Badge>
          <h3 className="mt-3 text-2xl font-semibold">
            Save a copy to your inbox
          </h3>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Public links strip identifying information. This step stores the
            lead privately and triggers a transactional follow-up email.
          </p>
        </div>
        <Badge variant={ctaType === "credex" ? "primary" : "neutral"}>
          {ctaType === "credex" ? "High savings" : "Low-friction lead"}
        </Badge>
      </div>

      {captured ? (
        <div className="mt-6 flex items-center gap-3 rounded-[24px] border bg-[color:var(--surface-strong)] p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-sm">{message || "Lead captured successfully."}</p>
        </div>
      ) : (
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {/* Honeypot field */}
          <input
            autoComplete="off"
            className="hidden"
            name="website"
            tabIndex={-1}
            type="text"
          />
          <label className="grid gap-2 text-sm">
            Work email
            <input
              className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
              name="email"
              required
              type="email"
              placeholder="you@company.com"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm">
              Company name
              <input
                className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
                name="companyName"
                placeholder="Acme Inc."
              />
            </label>
            <label className="grid gap-2 text-sm">
              Role
              <input
                className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
                name="role"
                placeholder="CTO"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Team size
              <input
                className="rounded-2xl border bg-[color:var(--surface-strong)] px-4 py-3"
                min={1}
                name="leadTeamSize"
                type="number"
                placeholder="5"
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Button disabled={loading} type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Email me this report
                </>
              )}
            </Button>
            {message && !captured && (
              <p className="text-sm text-[color:var(--muted)]">{message}</p>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}
