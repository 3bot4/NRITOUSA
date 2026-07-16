import type { Metadata } from "next";
import MoneyHub, { type MoneyHubConfig } from "@/components/MoneyHub";
import { pageMetadata } from "@/lib/seo";
import {
  wealthReturnSnapshotRows,
  wealthReturnSources,
  WEALTH_RETURN_VERIFIED,
  WEALTH_RETURN_DISCLAIMER,
} from "@/data/siteWideVerifiedNumbers";

const config: MoneyHubConfig = {
  showReturnToIndiaLeadMagnet: true,
  path: "/return-to-india",
  breadcrumb: "Return to India",
  icon: "✈️",
  accent: "from-emerald-600 to-teal-700",
  title: "Retirement & Return to India",
  intro:
    "Thinking about moving back to India — this year or a decade from now? This hub covers what happens to your US retirement accounts and benefits, how RNOR status protects you, and how to plan currency timing so the move doesn't quietly cost you years of savings.",
  covers: [
    "401(k) when you leave the USA",
    "IRA — Roth vs traditional",
    "Social Security after leaving the US",
    "RNOR residency status",
    "Currency planning & timing",
    "Cross-border retirement readiness",
  ],
  articleSlugs: [
    "what-happens-to-401k-leaving-usa",
    "transfer-401k-to-india-nps-ppf",
    "social-security-benefits-leaving-us",
    "roth-ira-vs-traditional-nri",
    "nri-retirement-usa-india-currency-risk",
    "hsa-after-leaving-usa",
  ],
  tools: [
    { label: "401(k) return-to-India calculator", href: "/calculators/401k-return-to-india", kind: "Calculator" },
    { label: "RNOR tax residency calculator", href: "/calculators/rnor-tax-residency", kind: "Calculator" },
    { label: "DTAA foreign tax credit", href: "/calculators/dtaa-foreign-tax-credit", kind: "Calculator" },
    { label: "FBAR/FATCA risk checker", href: "/tools/fbar-fatca-checker", kind: "Tool" },
  ],
  primaryCta: { label: "Model your 401(k) move", href: "/calculators/401k-return-to-india" },
  relatedGuides: [
    {
      label: "Should NRIs keep their investments in India?",
      href: "/india-investments/should-nris-keep-investments-in-india",
      blurb:
        "The other half of the move: what to do with the mutual funds, FDs, and property you still hold in India — and how the US taxes them while you're here.",
    },
  ],
  snapshot: {
    title: "Return-to-India money decisions — key numbers first",
    rows: wealthReturnSnapshotRows,
    badges: ["401(k) 10% early penalty", "SS 40 credits (~10 yrs)", "RNOR ~2–3 yrs"],
    lastVerified: WEALTH_RETURN_VERIFIED,
    sources: wealthReturnSources,
    disclaimer: WEALTH_RETURN_DISCLAIMER,
    ctaText: "Model your 401(k) move",
    ctaHref: "/calculators/401k-return-to-india",
  },
};

export const metadata: Metadata = pageMetadata({
  title: "Retirement & Return to India — 401(k), IRA, Social Security, RNOR & Currency",
  description:
    "Planning to move back to India? What happens to your 401(k), IRA, and Social Security, how RNOR status works, and how to plan currency timing for NRIs.",
  path: config.path,
});

export default function ReturnToIndiaPage() {
  return <MoneyHub config={config} />;
}
