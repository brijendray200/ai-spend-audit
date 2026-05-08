# Business Requirements Document (BRD)

## Product: Stackwise — AI Spend Audit Tool

**Version:** 1.0  
**Date:** 2026-05-08  
**Author:** [Your Name]  
**Status:** MVP Shipped

---

## 1. Problem Statement

Startups that adopted AI tools rapidly in 2024–2026 now carry fragmented, unaudited AI spend across multiple vendors, plans, and seat counts. Engineering managers and founders are spending $500–$5,000+/month on overlapping AI subscriptions without knowing which plans are oversized, which seats are unused, or whether cheaper alternatives exist for their actual use case.

There is no lightweight, self-serve tool that gives a fast, defensible answer to the question: **"Am I overpaying for my AI stack?"**

### The Gap

- Manual spreadsheet audits take hours and miss cross-vendor opportunities
- SaaS management platforms (Zylo, Productiv) are enterprise-priced and overkill for <100-person teams
- Generic "AI tool comparison" sites don't factor in team size, use case, or actual spend
- Credex already facilitates discounted AI credits — but lacks a top-of-funnel diagnostic tool to identify qualified buyers

---

## 2. User Personas

### Persona 1: The Engineering Manager

| Attribute | Detail |
|---|---|
| **Role** | Engineering Manager / VP Eng |
| **Company stage** | Series A–B, 20–80 employees |
| **AI spend** | $1,500–$5,000/month across 3–5 tools |
| **Pain point** | Gets renewal surprises; no single view of what the team actually uses |
| **Motivation** | Wants to optimize before the next board review |
| **Behavior** | Searches "Cursor vs Copilot for teams," reads HN and Twitter threads |

### Persona 2: The Startup Founder

| Attribute | Detail |
|---|---|
| **Role** | CEO / CTO at seed-stage startup |
| **Company stage** | Pre-seed to Seed, 3–15 employees |
| **AI spend** | $200–$1,000/month, mostly personal subscriptions expensed to the company |
| **Pain point** | Knows the AI bill is growing but doesn't have time to audit it |
| **Motivation** | Wants a "second opinion" before renewing annual plans |
| **Behavior** | Active in founder Slack groups, Indie Hackers, X/Twitter |

### Persona 3: The Finance / Ops Lead

| Attribute | Detail |
|---|---|
| **Role** | Head of Finance or Operations |
| **Company stage** | Series A+, 30–100 employees |
| **AI spend** | $3,000–$10,000/month, managed across departments |
| **Pain point** | Needs defensible data for budget planning — not opinions |
| **Motivation** | Wants to present savings recommendations to leadership with source-backed numbers |
| **Behavior** | Prefers downloadable reports, pricing source links, and clear methodology |

---

## 3. Goals

### Business Goals

1. **Generate qualified leads for Credex** — users whose audit reveals $500+/month in savings are natural candidates for discounted AI credits
2. **Build top-of-funnel awareness** — shareable public reports create organic distribution
3. **Validate product-market fit** — measure whether founders actually act on audit recommendations

### Product Goals

1. Deliver a complete, defensible AI spend audit in under 60 seconds
2. Capture leads _after_ delivering value — not before
3. Enable viral distribution through public, PII-stripped share pages
4. Maintain pricing accuracy with verifiable sources

### Technical Goals

1. Ship a production-grade Next.js application with API routes, persistence, and CI
2. Keep the audit engine deterministic and fully testable
3. Design a storage layer that can migrate from file-based to managed database without code changes

---

## 4. Scope

### In Scope (MVP)

| Feature | Status |
|---|---|
| Landing page with hero, features, FAQ, testimonials, CTA | ✅ Shipped |
| Multi-tool audit form with real-time validation | ✅ Shipped |
| Rule-based audit engine (8 tools, all plans) | ✅ Shipped |
| AI-generated narrative summary with fallback | ✅ Shipped |
| Results dashboard with Recharts savings chart | ✅ Shipped |
| Public share pages with OG metadata | ✅ Shipped |
| Post-value lead capture with honeypot | ✅ Shipped |
| Transactional email via Resend | ✅ Shipped |
| Dark mode with system preference detection | ✅ Shipped |
| Mobile responsive design | ✅ Shipped |
| Rate limiting (in-memory) | ✅ Shipped |
| 7 unit tests with Vitest | ✅ Shipped |
| GitHub Actions CI | ✅ Shipped |
| Vercel deployment | ✅ Shipped |

### Out of Scope (Future)

| Feature | Priority |
|---|---|
| Benchmark mode (spend per developer) | High |
| PDF export for procurement teams | High |
| Event analytics instrumentation | High |
| Supabase Postgres migration | Medium |
| OAuth / saved audit history | Medium |
| Embeddable widget for blogs | Medium |
| Multi-currency support | Low |
| Admin dashboard | Low |

---

## 5. Functional Requirements

### FR-1: Audit Input

- User selects which AI tools they use from 8 supported options
- For each tool: select plan tier, enter monthly spend, enter seat count
- User provides team size and primary use case (coding, writing, data, research, mixed)
- Form state persists in `localStorage` to survive page refreshes
- Input is validated client-side for UX and server-side via Zod for security

### FR-2: Audit Engine

- Engine runs deterministic, rule-based analysis — no AI in the math
- Checks for plan-seat mismatches (e.g., Team plan with 2 seats)
- Detects overspend vs. current list pricing (20%+ threshold)
- Recommends cheaper alternatives for the same use case
- Suggests API credit savings for usage-based tools
- Returns per-tool recommendations with action, savings, reasoning, and confidence level
- Calculates total monthly and annual savings
- Determines CTA type: `credex` (>$500 savings), `notify` (some savings), or `healthy` (no savings)

### FR-3: Results Display

- Renders savings breakdown with bar chart (Recharts)
- Shows per-tool recommendation cards with confidence indicators
- Displays AI-generated or templated narrative summary
- Surfaces credibility notes and pricing source links
- Provides copy-to-clipboard share URL

### FR-4: Public Share Pages

- Every report gets a unique public URL at `/r/:slug`
- PII (company name, email) is stripped from public view
- Dynamic Open Graph and Twitter Card metadata for social sharing
- Report data is read-only on the public page

### FR-5: Lead Capture

- Email capture form appears _after_ the full report is visible
- Optional fields: company name, role, team size
- Honeypot field (`website`) catches bot submissions silently
- Rate limited to 5 submissions per IP per minute
- Triggers transactional email via Resend when configured

### FR-6: Transactional Email

- Sends confirmation email with savings summary and share URL
- Gracefully no-ops when Resend API key is not configured
- Uses branded "From" address configurable via environment variable

---

## 6. Non-Functional Requirements

| Requirement | Target | Implementation |
|---|---|---|
| **Performance** | Report generation < 3 seconds | Deterministic engine + async AI summary |
| **Availability** | 99.9% uptime | Vercel serverless with edge CDN |
| **Security** | No PII in public URLs | Server-side PII stripping on share pages |
| **Abuse prevention** | Rate limiting on all POST endpoints | Sliding-window in-memory limiter + honeypot |
| **Data validation** | All inputs validated before processing | Zod schemas on every API route |
| **Accessibility** | WCAG 2.1 AA compliant UI | Semantic HTML, keyboard navigation, contrast ratios |
| **Browser support** | Chrome, Firefox, Safari, Edge (latest 2 versions) | Progressive enhancement with clipboard fallback |
| **Mobile** | Fully responsive down to 320px | Tailwind responsive utilities + hamburger nav |
| **Testability** | Core logic 100% unit tested | 7 Vitest tests covering all engine paths |
| **Deployability** | One-click Vercel deploy | Zero-config Next.js with env variable injection |

---

## 7. User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. DISCOVER                                                    │
│     └─ User finds Stackwise via social post, community,        │
│        or direct link                                           │
│                                                                 │
│  2. LAND                                                        │
│     └─ Landing page: hero → features → how it works →          │
│        testimonials → FAQ → CTA                                 │
│                                                                 │
│  3. AUDIT                                                       │
│     └─ User fills in tools, plans, spend, seats, team size     │
│     └─ Form auto-saves to localStorage                         │
│     └─ User clicks "Run Audit"                                 │
│                                                                 │
│  4. PROCESS                                                     │
│     └─ Server validates input (Zod)                            │
│     └─ Rate limiter checks IP                                  │
│     └─ Audit engine runs deterministic analysis                │
│     └─ LLM generates narrative summary (with fallback)         │
│     └─ Report stored with unique slug                          │
│                                                                 │
│  5. RESULTS                                                     │
│     └─ User sees full savings breakdown + chart                │
│     └─ Per-tool recommendations with confidence levels         │
│     └─ Credibility notes + pricing source links                │
│                                                                 │
│  6. CAPTURE (optional)                                          │
│     └─ User enters email to "save" the report                 │
│     └─ Honeypot filters bots                                   │
│     └─ Transactional email sent with share URL                 │
│                                                                 │
│  7. SHARE                                                       │
│     └─ User copies public share URL                            │
│     └─ Public page shows audit without PII                     │
│     └─ OG metadata enables rich social previews                │
│                                                                 │
│  8. CONVERT (Credex path)                                       │
│     └─ High-savings users see Credex CTA                       │
│     └─ Consultation booking for $500+/mo savings               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Success Metrics

### North Star Metric

**Qualified savings reports per week** — where "qualified" means the audit found ≥$500 in monthly savings OR the user completed lead capture despite low savings.

### Primary Metrics

| Metric | Target (Week 1) | Why It Matters |
|---|---|---|
| Audit completion rate | >60% of form starts | Validates that the form isn't too long or confusing |
| Completion → lead capture rate | >18% | Proves the value-first flow earns trust |
| High-savings share rate | >25% of $500+ reports | Validates organic distribution loop |
| Completed audits | 35 in first 30 days | Minimum for statistical signal |

### Instrumentation Plan

Events to track: `landing_cta_click`, `form_start`, `form_complete`, `report_view`, `lead_submit`, `share_link_open`, `share_link_copy`

Tag reports crossing the `$500/month savings` threshold — this is the point where Credex becomes a clear next step.

### Pivot Trigger

If <10% of completed audits generate either a lead capture or a share event after the first 150 completed audits, the value proposition is probably too weak or too generic and the product framing needs fundamental rethinking.

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Pricing data becomes stale | Recommendations lose credibility | All prices sourced with URLs and verification dates; update checklist in PRICING_DATA.md |
| Enterprise pricing is estimated | Users on Enterprise plans get inaccurate advice | All estimates clearly labeled in-product with conservative modeling |
| File-based storage doesn't scale | Data loss on serverless redeploys | Prisma schema ready; migration to Supabase Postgres planned |
| LLM summary adds latency | Slow report generation | Templated fallback ensures <1s response even without AI |
| Low adoption / weak distribution | Insufficient data to validate PMF | GTM plan targets narrow founder channels with personalized outreach |

---

## 10. Appendix

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design and data flow
- [API.md](./API.md) — Full API reference
- [PRICING_DATA.md](./PRICING_DATA.md) — Verified pricing sources
- [GTM.md](./GTM.md) — Go-to-market strategy
- [ECONOMICS.md](./ECONOMICS.md) — Unit economics model
- [METRICS.md](./METRICS.md) — Instrumentation plan
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) — Customer discovery interviews
