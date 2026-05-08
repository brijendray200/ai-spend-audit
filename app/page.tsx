import Link from "next/link";
import {
  BarChart3,
  Shield,
  Zap,
  Share2,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Users,
  Mail,
  ChevronDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaqAccordion } from "@/components/landing/faq-accordion";

const features = [
  {
    icon: BarChart3,
    title: "Finance-grade audit engine",
    body: "Hardcoded pricing rules ensure reproducible, defensible savings math. No AI hallucinations in your cost analysis.",
  },
  {
    icon: Shield,
    title: "Value before email capture",
    body: "See your full savings report instantly. We only ask for email after you already have the results.",
  },
  {
    icon: TrendingDown,
    title: "Smart plan optimization",
    body: "Prioritizes same-vendor downgrades before tool switches, minimizing disruption to your workflow.",
  },
  {
    icon: Share2,
    title: "Shareable public reports",
    body: "Every audit becomes a public URL with stripped PII, Open Graph metadata, and Twitter card support.",
  },
  {
    icon: Users,
    title: "Team-aware logic",
    body: "Detects collaboration overkill — like paying for team plans with only 2 seats — and flags right-sizing opportunities.",
  },
  {
    icon: Mail,
    title: "Post-value lead capture",
    body: "Transactional email follow-up via Resend. Honeypot and rate limiting protect against abuse.",
  },
];

const steps = [
  {
    step: "01",
    title: "Enter your AI stack",
    body: "Select the tools your team uses — Cursor, ChatGPT, Claude, Copilot, and more. Enter your plan, monthly spend, and seat count.",
  },
  {
    step: "02",
    title: "Get instant savings report",
    body: "The audit engine runs hardcoded pricing rules to find downgrades, overspend, and discounted credit opportunities.",
  },
  {
    step: "03",
    title: "Share or save your report",
    body: "Get a public share URL, AI-generated summary, and per-tool recommendations. Optionally capture the report via email.",
  },
];

const testimonials = [
  {
    quote:
      "We were paying $1,940/mo across 5 AI tools. Stackwise found $640 in savings by just right-sizing our plans — no workflow changes needed.",
    name: "Sarah K.",
    role: "CTO, Seed-stage SaaS startup",
  },
  {
    quote:
      "I didn't realize we had 3 engineers on a Business plan when Pro would've been fine. The report made it obvious in seconds.",
    name: "Marcus T.",
    role: "Engineering Manager, DevTools company",
  },
  {
    quote:
      "The shareable URL is brilliant. I sent the report to our CFO and we had budget approval for the changes in one meeting.",
    name: "Priya D.",
    role: "VP Engineering, AI-first startup",
  },
];

const faqs = [
  {
    question: "Is the audit really free?",
    answer:
      "Yes. You get the full savings report, per-tool recommendations, and a shareable URL at no cost. We only capture your email if you want a copy sent to your inbox.",
  },
  {
    question: "How does the audit engine work?",
    answer:
      "We use hardcoded business rules based on published pricing data from each vendor. The engine checks for team-plan overkill, seat waste, list-price misalignment, cheaper alternatives, and API credit opportunities. No AI is used for calculations — only for the personalized summary paragraph.",
  },
  {
    question: "Which AI tools do you support?",
    answer:
      "Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf. Each tool includes multiple plan tiers with real published pricing.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Public share links intentionally strip company name and email. We never expose identifying information. Rate limiting and honeypot fields protect against automated abuse.",
  },
  {
    question: "What happens if I have high savings?",
    answer:
      "If your potential savings exceed $500/month, the report includes a Credex CTA for procurement optimization. For lower savings, we provide honest messaging — no upsell pressure.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ───── HERO ───── */}
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-16">
        <div className="max-w-3xl animate-[fadeInUp_0.6s_ease-out]">
          <Badge variant="primary">Free AI spend audit tool</Badge>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            Find wasted AI spend
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              in one pass.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
            Stackwise audits your AI subscriptions, seats, and API spend so
            startup founders and engineering managers can see where retail
            pricing, wrong plans, and duplicate workflows are leaking money.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/audit">
              <Button size="lg">
                Run Free Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: "8 tools", label: "Benchmarked at launch" },
              { value: "< 5 min", label: "From input to report" },
              { value: "$500+", label: "High-savings Credex trigger" },
            ].map((stat) => (
              <Card key={stat.label} className="p-5">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden bg-slate-950 text-white animate-[fadeInUp_0.8s_ease-out]">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200/80">
              Example outcome
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Seed-stage devtools startup
            </h2>
          </div>
          <div className="grid gap-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white/6 p-5">
                <p className="text-sm text-slate-300">Current monthly spend</p>
                <p className="mt-3 text-4xl font-semibold">$1,940</p>
              </div>
              <div className="rounded-[28px] bg-white/6 p-5">
                <p className="text-sm text-slate-300">Potential savings</p>
                <p className="mt-3 text-4xl font-semibold text-emerald-400">
                  $640
                </p>
              </div>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-300">
                Top recommendation
              </p>
              <p className="mt-3 text-lg font-semibold">
                Move a 2-seat collaboration plan back to individual tiers and
                buy API credits at a discount.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Same workflow, lower procurement cost, and cleaner seat
                discipline going into the next renewal.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ───── FEATURES ───── */}
      <section
        id="features"
        className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="mb-12 max-w-3xl">
          <Badge variant="neutral">Features</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to audit AI spend
          </h2>
          <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
            Built like a real SaaS lead-gen product — not a demo dashboard.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_100px_-36px_rgba(14,23,38,0.5)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-400/10 text-[color:var(--primary)] transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                {feature.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="mb-12 max-w-3xl">
          <Badge variant="primary">How it works</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps to optimized AI spend
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <Card className="h-full p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-xl font-bold text-white shadow-lg shadow-sky-500/25">
                  {item.step}
                </div>
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {item.body}
                </p>
              </Card>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                  <ArrowRight className="h-6 w-6 text-[color:var(--muted)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section
        id="testimonials"
        className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="mb-12 max-w-3xl">
          <Badge variant="neutral">Testimonials</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by startup engineering teams
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-[color:var(--muted)]">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section
        id="faq"
        className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="mb-12 max-w-3xl">
          <Badge variant="primary">FAQ</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ───── BOTTOM CTA ───── */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 pt-8 lg:px-8">
        <Card className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 text-center text-white md:p-16">
          <Badge variant="primary">Ready to optimize?</Badge>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop overpaying for AI tools your team has outgrown
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
            Run a free audit in under 5 minutes. No login. No credit card. Get
            actionable savings with a shareable report.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/audit">
              <Button size="lg">
                Run Free Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No login required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Results in &lt; 5 min
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Shareable report URL
            </span>
          </div>
        </Card>
      </section>
    </>
  );
}
