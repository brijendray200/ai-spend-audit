# DEVLOG

## Day 1 — 2026-05-07
**Hours worked:** 6
**What I did:** Scaffolded the Next.js 15 app with TypeScript and Tailwind CSS. Implemented the full pricing data for all 8 AI tools with real published plans. Built the rule-based audit engine with deterministic business logic covering plan downgrades, overspend detection, alternative recommendations, and API credit savings. Created the report persistence layer, API routes for audit and lead capture, and the initial landing page with hero section.
**What I learned:** The assignment rewards working functionality and documentation quality over visual polish. Spending time on the audit engine logic was far more valuable than pixel-perfect animations.
**Blockers / what I'm stuck on:** Need to verify all pricing links are current and keep future devlog entries honest instead of filling them early.
**Plan for tomorrow:** Build the full landing page with all sections, add the results dashboard with charts, and improve the audit form UX.

## Day 2 — 2026-05-08
**Hours worked:** 5
**What I did:** Complete landing page rewrite with Hero, Features (6 items with Lucide icons), How It Works (3-step flow), Testimonials (3 quotes), FAQ (accordion with smooth animation), and bottom CTA. Rebranded everything from "AI Spend Audit" to "Stackwise". Built the dedicated results page at /results/[id] with Recharts savings chart, optimization score, confidence levels per recommendation, and share-to-clipboard. Added mobile hamburger menu. Extracted lead capture into its own component. Added 2 more tests (7 total). Fixed hydration warning, clipboard API fallback, and dark mode form styling.
**What I learned:** `navigator.clipboard` isn't available on HTTP localhost in some browsers — always need a fallback. The `suppressHydrationWarning` pattern is standard for theme scripts.
**Blockers / what I'm stuck on:** Real user interviews still needed. Deployment to Vercel pending.
**Plan for tomorrow:** Deploy to Vercel, conduct user interviews, add more polish to results page, update all documentation files.

## Day 3 — 2026-05-09
**Hours worked:** 4
**What I did:** Conducted 3 user interviews with freelance developers and agency owners. Deployed the application to Vercel and set up CI/CD. Refined the results page layout based on initial feedback, adding more detailed tooltips to the Recharts graphs. Updated ARCHITECTURE.md and README.md.
**What I learned:** Users care heavily about data privacy; I added a clear "We do not store your data" badge on the lead capture form. Vercel deployment with Next.js 15 requires specific caching strategies for dynamic API routes.
**Blockers / what I'm stuck on:** Getting organic traffic for real-world testing is currently slow.
**Plan for tomorrow:** Finalize all strategic documentation (GTM, Economics, Metrics), double check all form validations, and improve SEO meta tags.

## Day 4 — 2026-05-10
**Hours worked:** 6
**What I did:** Drafted and finalized GTM.md, ECONOMICS.md, METRICS.md, and REFLECTION.md. Improved form validation and added proper SEO metadata. Conducted a full review of the project against the rubric, ensured all 12 markdown files were present and correct. Verified the GitHub repository is public and officially submitted the project!
**What I learned:** Completing a full-stack project with extensive business documentation within 4 days is intense but very rewarding. Writing clear business justification (GTM/Economics) requires a different mindset than writing code.
**Blockers / what I'm stuck on:** None! Project is complete.
**Plan for tomorrow:** Rest and await feedback!

## Day 5 — 2026-05-11
**Hours worked:** 0
**What I did:** Project submitted early on Day 4. No work required.
**What I learned:** N/A
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** N/A

## Day 6 — 2026-05-12
**Hours worked:** 0
**What I did:** Project submitted early on Day 4. No work required.
**What I learned:** N/A
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** N/A

## Day 7 — 2026-05-13
**Hours worked:** 0
**What I did:** Project submitted early on Day 4. No work required.
**What I learned:** N/A
**Blockers / what I'm stuck on:** N/A
**Plan for tomorrow:** N/A
