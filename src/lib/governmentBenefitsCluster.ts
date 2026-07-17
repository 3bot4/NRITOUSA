/**
 * Shared helpers for the "USA Government Benefits for Immigrants" pillar.
 *
 * Pillar page:
 *   /usa-government-benefits-immigrants
 *
 * Mirrors indiaInvestmentsCluster.ts / trumpAccountCluster.ts. Content rules
 * live atop src/data/governmentBenefitsData.ts — read them before editing.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";
import { RULES_LAST_VERIFIED } from "@/data/governmentBenefitsData";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

export const GB_PATH = "/usa-government-benefits-immigrants";
export const GB_URL = absoluteUrl(GB_PATH);

export const GB_PUBLISHED = "2026-07-16";
export const GB_UPDATED = "2026-07-16";
export const GB_UPDATED_HUMAN = "July 16, 2026";
export const GB_READING_MINUTES = 34;

/** Topical keywords for Article schema (never stuffed on-page). */
export const GB_KEYWORDS = [
  "government benefits for immigrants",
  "government benefits for green card holders",
  "benefits for visa holders in USA",
  "benefits for H1B visa holders",
  "can green card holders get government benefits",
  "public benefits for mixed status families",
  "green card five year rule benefits",
  "does Medicaid affect green card",
  "does SNAP affect immigration status",
  "can H1B get unemployment benefits",
  "Social Security benefits for green card holders",
  "Medicare eligibility for immigrants",
  "FAFSA eligibility for green card holders",
  "tax credits for immigrants",
  "public charge rule government benefits",
  "I-864 sponsor repayment public benefits",
  "ACA subsidy for H1B visa holders",
  "benefits for US citizen child of H1B parents",
];

/* ------------------------------------------------------------------ *
 * Internal links — every target verified to exist in src/app.
 * ------------------------------------------------------------------ */
export const relatedGuideLinks: ClusterLink[] = [
  {
    href: "/immigration",
    label: "Immigration Hub",
    desc: "H-1B, green card, USCIS and visa bulletin guidance in one place",
  },
  {
    href: "/h1b-layoff",
    label: "H-1B Layoff Checklist",
    desc: "Grace periods, status options, and what to do in the first 60 days",
  },
  {
    href: "/h1b",
    label: "H-1B Guide",
    desc: "The complete H-1B picture — lottery, transfers, extensions and status",
  },
  {
    href: "/green-card-renewal",
    label: "Green Card Renewal",
    desc: "Form I-90 renewal — a document replacement, with no public-charge test",
  },
  {
    href: "/uscis",
    label: "USCIS Hub",
    desc: "Case status, processing times, forms and life-planning guides",
  },
  {
    href: "/india-tax-compliance",
    label: "India Tax & Compliance Hub",
    desc: "FBAR, FATCA, DTAA and US tax filing for immigrant families",
  },
  {
    href: "/trump-account-h1b-immigrant-families",
    label: "Trump Accounts for Immigrant Families",
    desc: "The child savings account rules for H-1B and green card families",
  },
  {
    href: "/education",
    label: "Education Hub",
    desc: "College costs, aid and planning for immigrant families",
  },
];

export const relatedTools: ClusterLink[] = [
  {
    href: "/tools",
    label: "All tools",
    desc: "Every calculator and checker on the site",
  },
  {
    href: "/calculators",
    label: "All calculators",
    desc: "Money, tax and planning calculators for immigrant families",
  },
];

/* ------------------------------------------------------------------ *
 * Schema
 * ------------------------------------------------------------------ */

export function gbWebPageJsonLd() {
  return {
    "@type": "WebPage",
    "@id": `${GB_URL}#webpage`,
    url: GB_URL,
    name: "USA Government Benefits for Immigrants",
    description:
      "Check which U.S. benefits may be available to visa holders, green card holders, citizens and mixed-status families based on state, income, work history and household.",
    isPartOf: { "@id": `${site.url}/#website` },
    inLanguage: "en-US",
    datePublished: GB_PUBLISHED,
    dateModified: GB_UPDATED,
  };
}

export function gbArticleJsonLd() {
  return {
    "@type": "Article",
    "@id": `${GB_URL}#article`,
    headline:
      "USA Government Benefits for Immigrants: Visa Holders, Green Card Holders & Citizens",
    description:
      "How U.S. government benefit eligibility works for immigrant and mixed-status families — by immigration status, state, income, household and work history, with public-charge and I-864 sponsor issues explained separately.",
    mainEntityOfPage: { "@id": `${GB_URL}#webpage` },
    datePublished: GB_PUBLISHED,
    dateModified: GB_UPDATED,
    author: {
      "@type": "Person",
      name: author.name,
      url: absoluteUrl(author.url),
    },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
    keywords: GB_KEYWORDS.join(", "),
    about: [
      { "@type": "Thing", name: "Public charge" },
      { "@type": "Thing", name: "Immigration status" },
      { "@type": "Thing", name: "Government benefits" },
    ],
  };
}

/**
 * WebApplication schema for the screener. Deliberately carries NO
 * AggregateRating, Review, or usage counts — none of those would be real.
 */
export function gbWebAppJsonLd() {
  return {
    "@type": "WebApplication",
    "@id": `${GB_URL}#screener`,
    name: "Immigrant Benefits Eligibility Screener",
    url: `${GB_URL}#screener`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    description:
      "A free, private, client-side screening tool that checks which U.S. government benefit programs each member of an immigrant or mixed-status household may be able to apply for, based on immigration status, state, income, household size and work history. Educational only — not an eligibility determination.",
    isAccessibleForFree: true,
    inLanguage: "en-US",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: { "@id": `${site.url}/#organization` },
    dateModified: RULES_LAST_VERIFIED,
  };
}
