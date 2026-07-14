/**
 * Shared helpers for the India Investments cluster.
 *
 * Pillar page:
 *   /india-investments/should-nris-keep-investments-in-india
 *
 * Mirrors trumpAccountCluster.ts / lifeInsuranceCluster.ts. This is an
 * EDUCATIONAL, YMYL money topic — every figure is framed as an illustration
 * that changes with law and personal facts, never as advice. See the rules
 * comment atop src/data/indiaInvestmentsData.ts before editing content.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/* ------------------------------------------------------------------ *
 * Publish / review metadata (single source of truth for the page dates)
 * ------------------------------------------------------------------ */
/** Topical keywords for Article schema (not stuffed on-page). */
export const INDIA_INVESTMENTS_KEYWORDS = [
  "should NRI keep investments in India",
  "NRI investment in India",
  "India vs US investing",
  "NRI mutual fund taxation",
  "PFIC Indian mutual funds",
  "NRI dividend tax",
  "NRE vs NRO",
  "India US DTAA",
  "foreign tax credit India USA",
  "NRI capital gains tax",
  "returning to India investments",
];

export const INDIA_INVESTMENTS_PUBLISHED = "2026-07-14";
export const INDIA_INVESTMENTS_UPDATED = "2026-07-14";
export const INDIA_INVESTMENTS_UPDATED_HUMAN = "July 14, 2026";
export const INDIA_INVESTMENTS_READING_MINUTES = 32;
/** Number of official sources reviewed for the E-E-A-T line. */
export const OFFICIAL_SOURCES_REVIEWED = 9;

/* ------------------------------------------------------------------ *
 * Related pages elsewhere on the site (all verified to exist).
 * These are the internal-linking spokes for this pillar.
 * ------------------------------------------------------------------ */
export const relatedGuideLinks: ClusterLink[] = [
  {
    href: "/articles/nre-nro-accounts-explained",
    label: "NRE vs NRO Accounts Explained",
    desc: "The money-transfer setup every NRI needs — which account to keep, close, or convert",
  },
  {
    href: "/articles/fbar-fatca-nri-guide",
    label: "FBAR & FATCA for NRIs",
    desc: "How to report Indian bank, demat, and investment accounts to the IRS",
  },
  {
    href: "/articles/pfic-indian-mutual-funds-trap",
    label: "The PFIC Trap: Indian Mutual Funds",
    desc: "Why Indian mutual funds are usually PFICs and how that changes your US tax",
  },
  {
    href: "/articles/double-taxation-dtaa-india-usa",
    label: "India–USA DTAA Explained",
    desc: "How the tax treaty and the foreign tax credit stop you paying tax twice",
  },
  {
    href: "/articles/indian-income-us-tax-return",
    label: "Declaring Indian Income on a US Return",
    desc: "Interest, dividends, rent, and capital gains from India on Form 1040",
  },
  {
    href: "/articles/indian-ppf-taxable-usa",
    label: "Is Your Indian PPF Taxable in the US?",
    desc: "How the IRS may treat PPF and other India-only tax-favoured accounts",
  },
  {
    href: "/articles/transfer-401k-to-india-nps-ppf",
    label: "401(k), NPS & PPF When You Move",
    desc: "What actually transfers between the US and India — and what does not",
  },
  {
    href: "/articles/repatriate-india-property-sale-usa",
    label: "Repatriating an Indian Property Sale",
    desc: "Moving sale proceeds to the US, TDS, and the 15CA/15CB paperwork",
  },
  {
    href: "/return-to-india-checklist",
    label: "Return to India Checklist",
    desc: "What to review before moving back — including your US and Indian accounts",
  },
  {
    href: "/india-tax-compliance",
    label: "India Tax Compliance Hub",
    desc: "The full resource center for NRI cross-border tax and reporting",
  },
  {
    href: "/long-term-nri-wealth",
    label: "Long-Term NRI Wealth Hub",
    desc: "How Indian families in the US build and keep wealth over decades",
  },
  {
    href: "/oci",
    label: "OCI Resource Center",
    desc: "Overseas Citizen of India status, and how it affects what you can hold in India",
  },
];

/* ------------------------------------------------------------------ *
 * Related tools & calculators (all live on the site today).
 * Rendered as CTA cards. We never link to calculators that do not exist yet.
 * ------------------------------------------------------------------ */
export interface ToolCard {
  href: string;
  label: string;
  desc: string;
  icon: string;
}

export const relatedTools: ToolCard[] = [
  {
    href: "/calculators/dtaa-foreign-tax-credit",
    label: "DTAA / Foreign Tax Credit Calculator",
    desc: "Estimate the US foreign tax credit for tax you already paid in India.",
    icon: "🧾",
  },
  {
    href: "/calculators/rnor-tax-residency",
    label: "RNOR Tax Residency Calculator",
    desc: "See whether a returning NRI qualifies for RNOR — and why it matters for foreign income.",
    icon: "🧭",
  },
  {
    href: "/calculators/india-property-capital-gains",
    label: "India Property Capital Gains Calculator",
    desc: "Estimate gains and TDS on the sale of Indian property before you repatriate.",
    icon: "🏠",
  },
  {
    href: "/calculators/remittance-tcs-cost",
    label: "Remittance & TCS Cost Calculator",
    desc: "See the real cost of moving money between India and the US, including TCS.",
    icon: "💸",
  },
  {
    href: "/calculators/fcnr-vs-hysa",
    label: "FCNR vs US High-Yield Savings",
    desc: "Compare an FCNR deposit against a US high-yield savings account, after tax.",
    icon: "⚖️",
  },
  {
    href: "/tools/fbar-fatca-checker",
    label: "FBAR / FATCA Checker",
    desc: "Check whether your Indian accounts trigger FBAR or FATCA reporting.",
    icon: "✅",
  },
  {
    href: "/nri-wealth-checkup",
    label: "NRI Wealth & Tax Organizer",
    desc: "Organize your India and US accounts in one place before you decide anything.",
    icon: "📋",
  },
  {
    href: "/tools/nri-tds-refund-checklist",
    label: "NRI TDS Refund Checklist",
    desc: "Recover excess TDS withheld in India by filing the right way.",
    icon: "↩️",
  },
];

/* ------------------------------------------------------------------ *
 * Official / authoritative source links (open in a new tab, nofollow).
 * ------------------------------------------------------------------ */
export const officialSourceLinks: { label: string; href: string }[] = [
  { label: "IRS — Foreign Tax Credit (Form 1116)", href: "https://www.irs.gov/forms-pubs/about-form-1116" },
  { label: "IRS — Report of Foreign Bank Accounts (FBAR)", href: "https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar" },
  { label: "IRS — FATCA / Form 8938", href: "https://www.irs.gov/businesses/corporations/foreign-account-tax-compliance-act-fatca" },
  { label: "IRS — PFIC / Form 8621", href: "https://www.irs.gov/forms-pubs/about-form-8621" },
  { label: "IRS — Yearly average currency exchange rates", href: "https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates" },
  { label: "Income Tax Department (India) — NRI", href: "https://www.incometax.gov.in/iec/foportal/" },
  { label: "RBI — FEMA / accounts for persons resident outside India", href: "https://www.rbi.org.in/" },
  { label: "India–US Income Tax Treaty (DTAA) text", href: "https://www.irs.gov/businesses/international-businesses/india-tax-treaty-documents" },
];

/* ------------------------------------------------------------------ *
 * JSON-LD builders
 * ------------------------------------------------------------------ */

/** Standalone Person schema for the author (E-E-A-T) — includes credentials. */
export function indiaInvestmentsAuthorJsonLd() {
  return {
    "@type": "Person",
    "@id": `${site.url}${author.url}#person`,
    name: author.name,
    jobTitle: author.jobTitle,
    description:
      "Chartered Accountant (CA) and Series 65 holder focused on cross-border tax and money decisions for Indian families in the US.",
    url: absoluteUrl(author.url),
    sameAs: [author.linkedin],
    hasCredential: author.credentials.split(",").map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: c.trim(),
    })),
    knowsAbout: [
      "NRI investment planning",
      "India–US Double Taxation Avoidance Agreement (DTAA)",
      "US foreign tax credit for Indian taxes",
      "PFIC rules and Indian mutual funds",
      "FBAR and FATCA reporting of Indian accounts",
      "NRE and NRO account taxation",
      "Cross-border capital gains and dividend taxation",
      "Returning to India and RNOR residency",
    ],
  };
}

export function indiaInvestmentsWebPageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: "en-US",
    isPartOf: { "@id": `${site.url}/#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(site.ogImage),
      width: 1200,
      height: 630,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#quick-answer", "#key-takeaways"],
    },
    about: [
      { "@type": "Thing", name: "NRI investments in India" },
      { "@type": "Thing", name: "India vs US investing" },
      { "@type": "Thing", name: "Cross-border taxation" },
    ],
  };
}

export function indiaInvestmentsArticleJsonLd(opts: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: indiaInvestmentsAuthorJsonLd(),
    reviewedBy: indiaInvestmentsAuthorJsonLd(),
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": `${url}#webpage` },
    url,
    image: absoluteUrl(site.ogImage),
    articleSection: "NRI Investing",
    keywords: INDIA_INVESTMENTS_KEYWORDS.join(", "),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export function indiaInvestmentsHowToJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: opts.name,
    description: opts.description,
    inLanguage: "en-US",
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
