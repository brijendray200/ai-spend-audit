import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/app/globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stackwise — Find wasted AI spend in one pass",
    template: "%s | Stackwise",
  },
  description:
    "Stackwise audits AI subscriptions, seats, and API spend for startups. Get instant savings reports with shareable URLs. No login required.",
  keywords: [
    "AI spend audit",
    "AI tool optimization",
    "startup costs",
    "SaaS savings",
    "Cursor pricing",
    "ChatGPT pricing",
    "Claude pricing",
    "GitHub Copilot pricing",
  ],
  openGraph: {
    title: "Stackwise — Find wasted AI spend in one pass",
    description:
      "Audit your AI stack and discover hidden savings in minutes. Free, instant, shareable reports.",
    type: "website",
    siteName: "Stackwise",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stackwise — Find wasted AI spend in one pass",
    description:
      "Audit your AI stack and discover hidden savings in minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t){document.documentElement.dataset.theme=t}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark'}}catch(e){}",
          }}
        />
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_38%)]" />
          <SiteHeader />
          <main className="relative">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
