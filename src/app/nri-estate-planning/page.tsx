import type { Metadata } from "next";
import MoneyHub, { type MoneyHubConfig } from "@/components/MoneyHub";
import { pageMetadata } from "@/lib/seo";

const config: MoneyHubConfig = {
  path: "/nri-estate-planning",
  breadcrumb: "Family & Legacy",
  icon: "👪",
  accent: "from-violet-600 to-purple-700",
  title: "Family & Legacy Planning",
  intro:
    "Estate planning gets complicated when your family, citizenship, and assets straddle two countries. This hub covers wills and trusts, naming beneficiaries, raising children as US citizens with India ties, and supporting parents in India — so your legacy passes the way you intend on both sides.",
  covers: [
    "Wills (US and India assets)",
    "Trusts",
    "Beneficiary designations",
    "Children as U.S. citizens",
    "Parents in India",
    "Cross-border inheritance & tax",
  ],
  articleSlugs: [
    "estate-planning-usa-india-assets",
    "inheriting-indian-assets-us-tax",
    "us-kids-india-property-problems",
    "buying-india-property-for-children",
    "term-life-insurance-immigrant-families",
    "10-year-nri-wealth-checklist",
  ],
  tools: [
    { label: "India property capital gains", href: "/calculators/india-property-capital-gains", kind: "Calculator" },
    { label: "FBAR/FATCA risk checker", href: "/tools/fbar-fatca-checker", kind: "Tool" },
    { label: "Long-term NRI wealth hub", href: "/long-term-nri-wealth", kind: "Hub" },
    { label: "NRI Wealth Checkup", href: "/nri-wealth-checkup", kind: "Hub" },
  ],
  primaryCta: { label: "Start the estate planning guide", href: "/articles/estate-planning-usa-india-assets" },
};

export const metadata: Metadata = pageMetadata({
  title: "NRI Estate Planning — Wills, Trusts, Beneficiaries & Cross-Border Inheritance",
  description:
    "Family and legacy planning for Indians in the USA: wills and trusts across US and India assets, beneficiaries, children as US citizens, and parents in India.",
  path: config.path,
});

export default function NriEstatePlanningPage() {
  return <MoneyHub config={config} />;
}
