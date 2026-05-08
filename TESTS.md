# Tests

Automated tests written using **Vitest** for the rule-based audit engine.

## Test Suite: `tests/audit-engine.test.ts`

| # | Test | What it validates |
|---|------|-------------------|
| 1 | Downgrades plans below minimum seat thresholds | Team/Business plans with ≤2 seats trigger a downgrade to Pro/Individual |
| 2 | Captures credits-based savings for API spend | OpenAI/Anthropic API spend generates 20% credit savings |
| 3 | Flags overspend versus current list pricing | Monthly spend 20%+ above list price triggers realignment |
| 4 | Recommends cheaper alternatives when gap is meaningful | Claude Max → cheaper coding alternative when gap ≥ $15 |
| 5 | Stays honest when savings are negligible | Cursor Pro at $20 with 1 seat returns "Stay on current setup" |
| 6 | Recommends enterprise downgrade for small teams | ChatGPT Enterprise with 3 seats (minSeats=10) triggers downgrade |
| 7 | Triggers Credex CTA when total savings exceed $500 | High API spend (>$500/mo savings) sets CTAType to "credex" |

## Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage
```

## Test Design Decisions

- All tests use a `baseInput()` helper that provides a complete default form state, with per-test overrides for the specific scenario being tested.
- Tests validate both the recommendation action string and the numerical savings output.
- The test suite intentionally covers the full range of audit engine paths: downgrade, overspend, alternative, credits, no-change, and CTA type thresholds.
- No mocking is needed because the audit engine is purely deterministic with no external dependencies.
