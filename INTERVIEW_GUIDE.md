# Interview Guide

## 30-Second Pitch

I built Stackwise, a free AI spend audit tool for startup founders and engineering managers. A visitor enters the AI tools they pay for, their plan, monthly spend, seats, team size, and primary use case. The app returns an instant audit with per-tool recommendations, estimated monthly and annual savings, a personalized summary, and a shareable public URL. If the savings are material, the flow naturally positions Credex as the next step because the user can keep the workflow but reduce procurement cost through discounted credits.

## How To Explain The Architecture

Say it simply:

1. The front end is a Next.js App Router app with a landing page, an audit builder, and public report pages.
2. The audit form persists in localStorage so refreshes do not wipe the user’s work.
3. When the form is submitted, a server route validates input, runs a rule-based audit engine, generates an LLM summary with a fallback, and stores the report in a server-side backend file store.
4. The user sees the result immediately, then can capture the report by email.
5. Every report also gets a public share page with no company or email data and with Open Graph metadata for sharing.

## How To Explain The Audit Logic

Use this sequence:

1. I preferred deterministic rules over AI because pricing recommendations should be explainable.
2. The engine first checks if the current plan is mismatched for seat count.
3. Then it checks if the entered spend is above current list pricing.
4. Then it considers cheaper alternatives for the same use case.
5. If the tool is still a good fit, it suggests credits-based savings instead of forcing a switch.

That ordering sounds thoughtful in interviews because it mirrors how a finance-conscious buyer would reason.

## Questions You Should Expect

1. Why not use AI for the whole audit?
Answer: because the math should be reproducible and trustworthy; AI is only used for the personalized narrative layer.

2. Why Next.js?
Answer: because I needed product pages, APIs, metadata, and share URLs in one codebase with low integration overhead.

3. What are the weak spots right now?
Answer: enterprise pricing is partially modeled because many vendors hide those numbers, rate limiting is in-memory for MVP simplicity, the backend store should be upgraded to a managed database for a final submission, and the project still needs real user interviews plus deployment polish.

4. What would you improve next?
Answer: benchmark mode, managed Postgres, event instrumentation, async job processing for summaries, and better procurement-focused reporting.

## Best Way To Practice

Open these files before your interview and rehearse in this order:

1. `README.md`
2. `ARCHITECTURE.md`
3. `PRICING_DATA.md`
4. `REFLECTION.md`
5. `ECONOMICS.md`

Then demo the app in this order:

1. Landing page
2. Audit input
3. Results and summary
4. Share page
5. One test file that proves the core logic is covered
