# Metrics

The North Star metric is `qualified savings reports created per week`, where “qualified” means the audit found at least $500 in believable monthly savings or the user still completed lead capture despite low savings. This is better than DAU because the product is not a daily-use habit app. It is a lead-generation and decision-support tool, so value is concentrated in completed, high-intent sessions.

The three input metrics are:

1. Audit start to audit completion rate, because weak completion means the form is too long or the payoff is unclear.
2. Audit completion to email capture rate, because the value-first flow only works if users still trust the follow-up step.
3. High-savings report share rate, because public sharing is the cheapest compounding distribution loop in the product.

The first events I would instrument are landing CTA clicks, form starts, form completions, report views, lead submissions, and share-link opens. I would also tag whether a report crossed the `$500/month savings` threshold because that is the point where Credex becomes a clear next step. A pivot trigger would be fewer than 10% of completed audits generating either a lead capture or a share event after the first 150 completed audits. If users finish the audit but do nothing afterward, the value proposition is probably too weak or too generic.
