# DEVLOG

## Day 1 — 2026-05-07
**Hours worked:** 6
**What I did:** Scaffolded the Next.js 15 app with TypeScript and Tailwind CSS. Implemented the full pricing data for all 8 AI tools with real published plans. Built the rule-based audit engine with deterministic business logic covering plan downgrades, overspend detection, alternative recommendations, and API credit savings. Created the report persistence layer, API routes for audit and lead capture, and the initial landing page with hero section.
**What I learned:** The assignment rewards working functionality and documentation quality over visual polish. Spending time on the audit engine logic was far more valuable than pixel-perfect animations.
**Blockers / what I'm stuck on:** Need to verify all pricing links are current. Supabase setup deferred in favor of file-based storage for portability.
**Plan for tomorrow:** Build the full landing page with all sections, add the results dashboard with charts, and improve the audit form UX.

## Day 2 — 2026-05-08
**Hours worked:** 5
**What I did:** Complete landing page rewrite with Hero, Features (6 items with Lucide icons), How It Works (3-step flow), Testimonials (3 quotes), FAQ (accordion with smooth animation), and bottom CTA. Rebranded everything from "AI Spend Audit" to "Stackwise". Built the dedicated results page at /results/[id] with Recharts savings chart, optimization score, confidence levels per recommendation, and share-to-clipboard. Added mobile hamburger menu. Extracted lead capture into its own component. Added 2 more tests (7 total). Fixed hydration warning, clipboard API fallback, and dark mode form styling.
**What I learned:** `navigator.clipboard` isn't available on HTTP localhost in some browsers — always need a fallback. The `suppressHydrationWarning` pattern is standard for theme scripts.
**Blockers / what I'm stuck on:** Real user interviews still needed. Deployment to Vercel pending.
**Plan for tomorrow:** Deploy to Vercel, conduct user interviews, add more polish to results page, update all documentation files.

## Day 3 — YYYY-MM-DD
**Hours worked:** 0
**What I did:** Fill this on the actual calendar day. Do not backdate this entry.
**What I learned:** TBD.
**Blockers / what I'm stuck on:** TBD.
**Plan for tomorrow:** TBD.

## Day 4 — YYYY-MM-DD
**Hours worked:** 0
**What I did:** Fill this on the actual calendar day. Do not backdate this entry.
**What I learned:** TBD.
**Blockers / what I'm stuck on:** TBD.
**Plan for tomorrow:** TBD.

## Day 5 — YYYY-MM-DD
**Hours worked:** 0
**What I did:** Fill this on the actual calendar day. Do not backdate this entry.
**What I learned:** TBD.
**Blockers / what I'm stuck on:** TBD.
**Plan for tomorrow:** TBD.

## Day 6 — YYYY-MM-DD
**Hours worked:** 0
**What I did:** Fill this on the actual calendar day. Do not backdate this entry.
**What I learned:** TBD.
**Blockers / what I'm stuck on:** TBD.
**Plan for tomorrow:** TBD.

## Day 7 — YYYY-MM-DD
**Hours worked:** 0
**What I did:** Fill this on the actual calendar day. Do not backdate this entry.
**What I learned:** TBD.
**Blockers / what I'm stuck on:** TBD.
**Plan for tomorrow:** TBD.
