# Prompts

## Summary prompt

The app uses an LLM only for the personalized narrative summary, not for the audit math.

```text
You are writing a concise CFO-friendly AI spend audit summary.
Team size: {teamSize}
Primary use case: {primaryUseCase}
Monthly savings: ${totalMonthlySavings}
Annual savings: ${totalAnnualSavings}
Per-tool actions:
- {tool}: {action}; savings ${monthlySavings}/mo; reason: {reasoning}

Write one paragraph, 80-110 words, practical and specific, no hype.
```

## Why I wrote it this way

I wanted the LLM output to stay constrained, specific, and legible to a buyer. The prompt includes only the data needed for synthesis and explicitly bans hype by asking for a practical CFO-friendly tone. That keeps the model from turning the summary into marketing copy.

## What I tried that didn’t work

More open-ended prompts produced longer, softer summaries that sounded impressive but were worse for trust. The assignment is stronger when the audit logic stays deterministic and the AI layer behaves like presentation polish rather than decision-maker.
