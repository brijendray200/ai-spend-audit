import { ImageResponse } from "next/og";

import { getStoredReport } from "@/lib/report-store";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await getStoredReport(slug);
  const audit = report?.audit;
  const input = report?.input;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgb(7,17,31) 0%, rgb(10,40,61) 55%, rgb(13,80,95) 100%)",
          color: "white",
          padding: "48px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgb(125,211,252)",
            }}
          >
            Stackwise public audit
          </div>
          <div style={{ fontSize: 24 }}>credex-style savings snapshot</div>
        </div>
        <div>
          <div style={{ fontSize: 84, fontWeight: 700 }}>
            ${Math.round(audit?.totalMonthlySavings ?? 0)}/mo savings
          </div>
          <div style={{ marginTop: 20, fontSize: 34, maxWidth: 900 }}>
            {input
              ? `${input.teamSize}-person ${input.primaryUseCase} team with ${audit?.tools.length ?? 0} active tools benchmarked.`
              : "AI spend audit share page."}
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 24,
              padding: "24px 28px",
              fontSize: 28,
            }}
          >
            Current spend: ${Math.round(audit?.totalCurrentSpend ?? 0)}
          </div>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 24,
              padding: "24px 28px",
              fontSize: 28,
            }}
          >
            Annualized savings: ${Math.round(audit?.totalAnnualSavings ?? 0)}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
