import Link from "next/link";
import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold">Stackwise</p>
            <p className="text-xs text-[color:var(--muted)]">
              Find wasted AI spend in one pass.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-[color:var(--muted)]">
          <Link href="/" className="transition hover:text-[color:var(--foreground)]">
            Home
          </Link>
          <Link href="/audit" className="transition hover:text-[color:var(--foreground)]">
            Run Audit
          </Link>
          <Link href="/#features" className="transition hover:text-[color:var(--foreground)]">
            Features
          </Link>
          <Link href="/#faq" className="transition hover:text-[color:var(--foreground)]">
            FAQ
          </Link>
        </div>
        <p className="text-xs text-[color:var(--muted)]">
          Built with Next.js, TypeScript, and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
