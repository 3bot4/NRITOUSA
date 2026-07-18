import type { Metadata } from "next";
import MoneyHub, { type MoneyHubConfig } from "@/components/MoneyHub";
import { pageMetadata } from "@/lib/seo";

const config: MoneyHubConfig = {
  showReturnToIndiaLeadMagnet: true,
  path: "/india-property",
  breadcrumb: "India Property",
  icon: "🏠",
  accent: "from-amber-600 to-orange-700",
  title: "India Property Planning",
  intro:
    "Own property in India while living in the USA? This hub walks through the decisions that actually move the needle: whether to sell or hold, how capital gains and TDS work, how to repatriate the proceeds, and what happens to inherited property — all from a cross-border US/India tax angle.",
  covers: [
    "Sell vs hold",
    "Capital gains on India property",
    "TDS on property sale",
    "Repatriation of sale proceeds",
    "Inheritance of India property",
    "US tax reporting on India real estate",
  ],
  articleSlugs: [
    "sell-india-property-before-retirement-usa",
    "repatriate-india-property-sale-usa",
    "inheriting-indian-assets-us-tax",
    "investment-property-usa-vs-india",
    "us-kids-india-property-problems",
    "buying-india-property-for-children",
  ],
  tools: [
    { label: "India property capital gains calculator", href: "/calculators/india-property-capital-gains", kind: "Calculator" },
    { label: "DTAA foreign tax credit", href: "/calculators/dtaa-foreign-tax-credit", kind: "Calculator" },
    { label: "FBAR/FATCA risk checker", href: "/tools/fbar-fatca-checker", kind: "Tool" },
    { label: "India Tax & Compliance hub", href: "/india-tax-compliance", kind: "Hub" },
  ],
  primaryCta: { label: "Calculate capital gains", href: "/calculators/india-property-capital-gains" },
  relatedGuides: [
    {
      label: "NRI selling property in India: TDS, capital gains & repatriation",
      href: "/nri-selling-property-in-india-tds",
      blurb:
        "The full sale playbook: TDS rates on the sale value, the Form 13 lower-TDS certificate, US tax reporting, and bringing the proceeds to the USA.",
    },
    {
      label: "Should NRIs keep their investments in India?",
      href: "/india-investments/should-nris-keep-investments-in-india",
      blurb:
        "Property is one piece of the picture. This guide weighs keeping vs exiting your Indian mutual funds, FDs, and real estate once you're a US taxpayer.",
    },
  ],
};

export const metadata: Metadata = pageMetadata({
  title: "India Property Planning for NRIs — Sell vs Hold, Capital Gains, TDS & Repatriation",
  description:
    "For Indians in the USA with property in India: sell vs hold, capital gains and TDS, repatriating sale proceeds, and inheritance — with US/India tax in mind.",
  path: config.path,
});

export default function IndiaPropertyPage() {
  return <MoneyHub config={config} />;
}
