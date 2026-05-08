# API Reference

Base URL: `http://localhost:3000` (dev) / `https://stackwise.vercel.app` (prod)

---

## Endpoints Overview

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `POST` | `/api/reports` | Create a new audit report | 8 req/IP/min |
| `POST` | `/api/reports/:slug/lead` | Capture a lead for an existing report | 5 req/IP/min |

---

## POST /api/reports

Creates a new AI spend audit report. Validates input via Zod, runs the deterministic audit engine, generates an AI summary (with fallback), and persists the report.

### Request

**Content-Type:** `application/json`

```json
{
  "companyName": "Acme Corp",
  "teamSize": 12,
  "primaryUseCase": "coding",
  "tools": [
    {
      "toolKey": "cursor",
      "enabled": true,
      "planId": "business",
      "monthlySpend": 480,
      "seats": 12
    },
    {
      "toolKey": "copilot",
      "enabled": true,
      "planId": "business",
      "monthlySpend": 228,
      "seats": 12
    },
    {
      "toolKey": "anthropicApi",
      "enabled": true,
      "planId": "api",
      "monthlySpend": 800,
      "seats": 1
    }
  ]
}
```

### Request Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `companyName` | `string` | No | Company name (excluded from public share pages) |
| `teamSize` | `number` | Yes | Total team size (min: 1) |
| `primaryUseCase` | `enum` | Yes | One of: `coding`, `writing`, `data`, `research`, `mixed` |
| `tools` | `array` | Yes | Array of tool spend entries |
| `tools[].toolKey` | `enum` | Yes | One of: `cursor`, `copilot`, `claude`, `chatgpt`, `anthropicApi`, `openaiApi`, `gemini`, `windsurf` |
| `tools[].enabled` | `boolean` | Yes | Whether this tool is included in the audit |
| `tools[].planId` | `string` | Yes | Plan identifier (e.g., `pro`, `business`, `enterprise`, `api`) |
| `tools[].monthlySpend` | `number` | Yes | Monthly spend in USD (min: 0) |
| `tools[].seats` | `number` | Yes | Number of seats/licenses (min: 1) |

### Response — 200 OK

```json
{
  "slug": "a1b2c3d4",
  "createdAt": "2026-05-08T10:30:00.000Z",
  "input": {
    "companyName": "Acme Corp",
    "teamSize": 12,
    "primaryUseCase": "coding",
    "tools": [...]
  },
  "audit": {
    "totalCurrentSpend": 1508,
    "totalMonthlySavings": 388,
    "totalAnnualSavings": 4656,
    "credibilityNotes": [
      "Cursor Business pricing verified at $40/user/month (cursor.com/pricing, May 2026)",
      "Copilot Business pricing verified at $19/user/month (github.com/features/copilot/plans, May 2026)"
    ],
    "tools": [
      {
        "toolKey": "cursor",
        "toolName": "Cursor",
        "currentSpend": 480,
        "seats": 12,
        "currentPlan": "business",
        "recommendation": {
          "action": "Stay on current plan",
          "recommendedPlan": "Business",
          "vendor": "Cursor",
          "monthlySavings": 0,
          "annualSavings": 0,
          "reasoning": "Current spend matches list pricing for 12 seats on Business plan.",
          "comparison": "$40/seat × 12 seats = $480/mo",
          "confidence": "high"
        }
      },
      {
        "toolKey": "anthropicApi",
        "toolName": "Anthropic API",
        "currentSpend": 800,
        "seats": 1,
        "currentPlan": "api",
        "recommendation": {
          "action": "Route through Credex for credit savings",
          "recommendedPlan": "API Credits",
          "vendor": "Anthropic",
          "monthlySavings": 160,
          "annualSavings": 1920,
          "reasoning": "API spend of $800/mo qualifies for ~20% savings through bulk credit purchasing.",
          "comparison": "$800/mo → ~$640/mo via credits",
          "confidence": "medium"
        }
      }
    ],
    "CTAType": "notify"
  },
  "summary": "Your team of 12 is spending $1,508/month across three AI tools...",
  "leadCaptured": false
}
```

### Response Schema

| Field | Type | Description |
|---|---|---|
| `slug` | `string` | Unique 8-character report identifier |
| `createdAt` | `string` | ISO 8601 timestamp |
| `input` | `object` | Echo of validated input |
| `audit.totalCurrentSpend` | `number` | Sum of all tool monthly spend |
| `audit.totalMonthlySavings` | `number` | Total estimated monthly savings |
| `audit.totalAnnualSavings` | `number` | `totalMonthlySavings × 12` |
| `audit.credibilityNotes` | `string[]` | Pricing source citations for transparency |
| `audit.tools[]` | `array` | Per-tool audit results |
| `audit.tools[].recommendation.action` | `string` | Human-readable recommendation |
| `audit.tools[].recommendation.confidence` | `enum` | `high`, `medium`, or `low` |
| `audit.CTAType` | `enum` | `credex` (>$500 savings), `notify` (some savings), `healthy` (no savings) |
| `summary` | `string` | AI-generated or templated narrative summary |
| `leadCaptured` | `boolean` | Whether a lead has been captured for this report |

### Error Responses

#### 400 Bad Request — Invalid Input

```json
{
  "error": "Invalid audit input."
}
```

#### 429 Too Many Requests — Rate Limit Exceeded

```json
{
  "error": "Too many audits in a short window."
}
```

---

## POST /api/reports/:slug/lead

Captures a lead (email + optional profile) for an existing report. Includes honeypot protection and triggers a transactional email via Resend when configured.

### URL Parameters

| Parameter | Type | Description |
|---|---|---|
| `slug` | `string` | The report's unique slug identifier |

### Request

**Content-Type:** `application/json`

```json
{
  "email": "cto@acme.com",
  "companyName": "Acme Corp",
  "role": "CTO",
  "teamSize": 12
}
```

### Request Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | Yes | Valid email address |
| `companyName` | `string` | No | Company name |
| `role` | `string` | No | User's role/title |
| `teamSize` | `number` | No | Team size |
| `website` | `string` | No | **Honeypot field** — if filled, request is silently accepted with no side effects |

### Response — 200 OK

```json
{
  "ok": true
}
```

### Error Responses

#### 400 Bad Request — Invalid Input

```json
{
  "error": "Invalid lead capture payload."
}
```

#### 404 Not Found — Report Does Not Exist

```json
{
  "error": "Report not found."
}
```

#### 429 Too Many Requests — Rate Limit Exceeded

```json
{
  "error": "Too many email submissions."
}
```

---

## Authentication

No authentication is required. The audit tool is intentionally open-access to minimize friction in the lead generation funnel.

---

## Rate Limiting

All endpoints use an in-memory sliding-window rate limiter keyed by IP address (`x-forwarded-for` header, falling back to `"local"`).

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/reports` | 8 requests | 60 seconds |
| `POST /api/reports/:slug/lead` | 5 requests | 60 seconds |

Rate limit state resets on server restart. For production scale, this should be replaced with Upstash Redis or a database-backed limiter.

---

## Bot Protection

The lead capture endpoint includes a honeypot field (`website`). If this field contains any value, the server returns `{ "ok": true }` without storing the lead or sending an email. This silently filters automated form submissions.

---

## Share URLs

Every report generates a public share page:

```
GET /r/:slug
```

This page:
- Renders the full audit result without PII (no company name, no email)
- Includes Open Graph (`og:title`, `og:description`, `og:image`) and Twitter Card metadata
- Is read-only — no lead capture or editing on the public page
- Can be shared on social media with rich previews

---

## cURL Examples

### Create an Audit Report

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "teamSize": 5,
    "primaryUseCase": "coding",
    "tools": [
      {
        "toolKey": "cursor",
        "enabled": true,
        "planId": "pro",
        "monthlySpend": 100,
        "seats": 5
      }
    ]
  }'
```

### Capture a Lead

```bash
curl -X POST http://localhost:3000/api/reports/a1b2c3d4/lead \
  -H "Content-Type: application/json" \
  -d '{
    "email": "founder@startup.com",
    "role": "Founder",
    "teamSize": 5
  }'
```
