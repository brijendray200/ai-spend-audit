# Testing

## Overview

The test suite validates the **rule-based audit engine** — the core business logic that produces savings recommendations. Tests are written in **Vitest** and run against the deterministic engine with zero external dependencies or mocking.

**Test file:** `tests/audit-engine.test.ts`  
**Test runner:** Vitest 4.x  
**Total tests:** 7  
**Pass rate:** 7/7 ✅

---

## Running Tests

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test -- --coverage

# Run in watch mode (development)
npx vitest watch

# Run a specific test by name
npx vitest run -t "downgrades plans"
```

---

## Test Suite

### Test 1: Plan Downgrade for Low Seat Count

**Scenario:** Team/Business plans with ≤2 seats should trigger a downgrade to Pro/Individual.

| Input | Expected |
|---|---|
| Tool: Cursor, Plan: Business, Seats: 2 | Action: Downgrade to Pro |
| Monthly spend: $80 (2 × $40) | Savings: $40/mo ($480/yr) |

**Why this matters:** Startups frequently buy Team/Business plans for 1–2 people. This is the most common waste pattern.

---

### Test 2: API Credit Savings

**Scenario:** Usage-based API spend generates a 20% credit savings recommendation via Credex.

| Input | Expected |
|---|---|
| Tool: OpenAI API, Plan: API, Spend: $500/mo | Action: Route through Credex for credits |
| Seats: 1 | Savings: $100/mo ($1,200/yr) |

**Why this matters:** API credit savings are the primary Credex business model — high-spend API users are the most valuable leads.

---

### Test 3: Overspend vs List Pricing

**Scenario:** Monthly spend 20%+ above current list price triggers a realignment recommendation.

| Input | Expected |
|---|---|
| Tool: Any, Plan: Pro, Seats: 1 | Action: Realign to list pricing |
| Actual spend: significantly above list price | Savings: difference between spend and list price |

**Why this matters:** Users sometimes enter negotiated or grandfathered rates that are actually _above_ current public pricing. The engine catches this honestly.

---

### Test 4: Cheaper Alternative Recommendation

**Scenario:** Claude Max at $100+/mo should recommend a cheaper coding alternative when the gap is ≥$15.

| Input | Expected |
|---|---|
| Tool: Claude, Plan: Max, Use case: coding | Action: Consider cheaper alternative |
| Monthly spend: $100+ | Savings: difference to alternative |

**Why this matters:** The engine doesn't always say "switch" — it only recommends alternatives when the savings gap is meaningful enough to justify workflow disruption.

---

### Test 5: Honest Zero Savings

**Scenario:** Well-priced setups should get a "Stay on current setup" recommendation with $0 savings.

| Input | Expected |
|---|---|
| Tool: Cursor, Plan: Pro, Seats: 1, Spend: $20 | Action: Stay on current setup |
| | Savings: $0/mo |

**Why this matters:** The engine must be honest. If there's nothing to save, saying so builds trust. A tool that always finds "savings" loses credibility.

---

### Test 6: Enterprise Downgrade for Small Teams

**Scenario:** Enterprise plans with fewer seats than the minimum threshold should trigger a downgrade.

| Input | Expected |
|---|---|
| Tool: ChatGPT, Plan: Enterprise, Seats: 3 | Action: Downgrade recommended |
| (Enterprise minSeats = 10) | Savings: based on plan difference |

**Why this matters:** Enterprise plans often have 10+ seat minimums. Teams that bought Enterprise with 3 seats are overpaying significantly.

---

### Test 7: Credex CTA Trigger

**Scenario:** Total savings exceeding $500/month should set `CTAType` to `"credex"`.

| Input | Expected |
|---|---|
| High API spend across multiple tools | CTAType: `"credex"` |
| Total savings: >$500/mo | Triggers Credex consultation CTA |

**Why this matters:** This is the business-critical threshold. Users with $500+/month in potential savings are the highest-value leads for Credex's credit purchasing business.

---

## Test Design Decisions

### 1. Base Input Helper

All tests use a `baseInput()` helper that provides a complete default form state. Each test overrides only the specific fields being tested. This keeps tests focused and avoids repeating boilerplate.

### 2. Dual Assertion Strategy

Every test validates both:
- The **action string** (what the recommendation says to do)
- The **numerical savings** (that the math is correct)

This catches cases where the recommendation text is right but the savings calculation is wrong, or vice versa.

### 3. Full Path Coverage

The 7 tests intentionally cover every audit engine decision path:

| Path | Test # |
|---|---|
| Plan downgrade (seat mismatch) | 1, 6 |
| API credit savings | 2 |
| Overspend vs list pricing | 3 |
| Cheaper alternative | 4 |
| No savings (honest) | 5 |
| CTA type threshold | 7 |

### 4. No Mocking Required

The audit engine is purely deterministic with no external dependencies (no database, no API calls, no file I/O). This means tests run instantly, never flake, and test the actual production code path.

---

## Edge Cases Handled

| Edge Case | How It's Handled |
|---|---|
| Tool not enabled | Skipped by the engine — no recommendation generated |
| Zero spend | Engine returns "Stay on current setup" with $0 savings |
| Single seat on Team plan | Triggers downgrade to Individual/Pro |
| Spend below list price | No overspend flag — engine only flags 20%+ above |
| Enterprise plan, small team | Downgrades to Team/Business based on seat count vs minSeats |
| All tools efficient | CTAType = `"healthy"`, honest messaging, no false urgency |
| API spend below credit threshold | Smaller credit savings percentage or no recommendation |

---

## Validation Coverage

### Input Validation (Zod)

| Route | Validated Fields |
|---|---|
| `POST /api/reports` | `teamSize` (min 1), `primaryUseCase` (enum), `tools[].toolKey` (enum), `tools[].monthlySpend` (min 0), `tools[].seats` (min 1) |
| `POST /api/reports/:slug/lead` | `email` (valid format), `companyName` (optional string), `role` (optional string), `teamSize` (optional number) |

### Fallback Handling

| Component | Fallback |
|---|---|
| AI Summary (Anthropic) | Falls back to OpenAI |
| AI Summary (OpenAI) | Falls back to deterministic template |
| Clipboard API | Falls back to `document.execCommand('copy')` |
| Email (Resend) | Gracefully no-ops when API key is missing |
| Rate limiter | Resets on server restart (acceptable for MVP) |

---

## CI Integration

Tests run automatically on every push and pull request via GitHub Actions:

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm run test
```

The CI pipeline runs:
1. `npm ci` — Clean install
2. `npm run lint` — ESLint check
3. `npm run test` — All 7 Vitest tests

---

## Future Testing Plans

| Priority | Test Area | Description |
|---|---|---|
| High | API route integration tests | Test full request → response cycle for both endpoints |
| High | Zod validation edge cases | Malformed payloads, missing fields, type coercion |
| Medium | Rate limiter unit tests | Verify window sliding and limit enforcement |
| Medium | Summary fallback chain | Mock API failures to verify Anthropic → OpenAI → template cascade |
| Low | E2E with Playwright | Full browser flow: landing → audit → results → share → lead capture |
| Low | Performance benchmarks | Audit engine execution time with 8 tools at various scales |
