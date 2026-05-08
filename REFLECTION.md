# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The hardest issue was getting the project from “nice landing page” to “real assignment artifact.” The first failure mode was structural, not algorithmic: the Next.js scaffold partially generated inside a nested directory, which made the workspace look empty and caused the first setup command to fail. My first hypothesis was that `create-next-app` had aborted early and left no usable output. After inspecting the workspace more carefully, I found that the files had been created under a child folder with the same name as the repo. I verified the nested `package.json`, moved the app files to the correct root, and resumed from there instead of re-scaffolding again. That saved time and avoided a second broken install.

The second layer of debugging was around requirements fit. I initially treated the assignment as a design-heavy front-end build, but after extracting the PDF text I realized the evaluator cares about persistence, pricing defensibility, and root-level documentation just as much as the UI. That changed my test strategy. I began validating flows against the assignment itself: “Does this support shareable public URLs?”, “Can I explain each pricing recommendation numerically?”, and “What breaks if an LLM call fails?” That framing exposed missing pieces faster than debugging visually. The real lesson was to debug the product spec first, then the code.

## 2. A decision you reversed mid-week, and what made you reverse it

The biggest reversal was the persistence layer. My first instinct was to keep storage extremely lightweight with a local JSON file because it would have been fast to implement and easy to inspect. After rereading the assignment, I moved the active storage path to Prisma plus SQLite so reports and leads use a real relational model instead of a loose JSON document. The Prisma engine had some Windows setup friction, so I added a small `prisma/init.sql` fallback that initializes the same schema locally without changing the application code.

That reversal still changed the architecture in a useful way. Instead of mixing storage logic into pages and routes, I kept a dedicated report store abstraction. Once reports and leads were treated as records behind a boundary, it became straightforward to generate unique slugs, separate public data from private lead data, and attach transactional email behavior. The lesson was that a good storage boundary preserves momentum even when the final hosting database changes.

## 3. What you would build in week 2 if you had it

Week 2 would focus on making the product sharper as a business tool rather than adding random surface area. The first thing I would build is benchmark mode: AI spend per developer, AI spend as a percent of engineering payroll, and comparisons against startup stage or team size. That would strengthen the “second opinion” value proposition and create more screenshot-worthy output than plan downgrades alone.

Second, I would harden the data and conversion stack. That means moving from local SQLite to managed Postgres, implementing resilient rate limiting with Redis, adding analytics events for audit starts, completions, lead submits, and share clicks, and polishing the transactional email content into a proper follow-up funnel. I would also add PDF export because it fits how finance or procurement stakeholders actually share recommendations internally.

Third, I would tighten recommendation quality by separating “retail savings,” “credits savings,” and “workflow consolidation savings” into distinct buckets. That would make the output easier to trust because the user could see exactly which savings require switching tools and which just require better buying discipline. If there were time left, I would ship an embeddable widget for blogs and communities to create a lightweight distribution loop.

## 4. How you used AI tools

I used AI as an accelerator, not as an autopilot. The most useful role it played was helping me move quickly on repetitive but necessary implementation tasks: scaffolding project structure, drafting component layouts, generating test cases around the audit engine, and turning the extracted assignment into a concrete build checklist. I also used AI to help summarize the product requirements and to pressure-test whether the user flow matched the constraints in the PDF, especially around value-before-email and public shareability.

What I did not trust AI with was the core pricing logic or truth-sensitive deliverables. The audit engine is intentionally rule-based because every savings recommendation needs to be explainable. I also would not trust AI to fabricate user interviews, fake multi-day devlogs, or invent deployment proof, because those are exactly the kinds of artifacts human reviewers can detect as generic or false.

One specific time the AI was wrong was during setup. The generated plan implicitly assumed the workspace was empty, but the scaffold command had actually created a nested app folder. If I had trusted that assumption and rerun setup blindly, I would have made the workspace messier and lost time. I caught it by checking the directory structure directly and adjusting the plan from the actual filesystem state rather than from the AI’s initial assumption.

## 5. Self-rating

Discipline: 7/10. I set up the project in a way that respected the evaluation rubric, but the assignment still requires several days of honest follow-through in git history to score truly well.

Code quality: 7/10. The code is typed, tested around the audit engine, and organized around clear boundaries, though a production version would need more validation and analytics hardening.

Design sense: 7/10. The UI is intentionally product-like and shareable rather than template-flat, but there is still room to sharpen hierarchy and motion once real screenshots are being prepared.

Problem-solving: 8/10. I corrected course quickly once the assignment’s real priorities became clear and made trade-offs that aligned with the actual scoring model.

Entrepreneurial thinking: 6/10. The product framing, lead-gen logic, and value-first conversion flow are strong, but the real strength here will come from genuine user interviews and better week-2 distribution thinking.
