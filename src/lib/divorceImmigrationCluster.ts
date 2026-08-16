/**
 * Shared config + schema for "Divorce and Your US Immigration Status".
 *
 * Page: /divorce-immigration-status
 *
 * Mirrors governmentBenefitsCluster.ts. All facts live in
 * src/data/divorceImmigrationData.ts — read the editing rules at the top of
 * that file before changing anything on this page.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";
import { RULES_LAST_VERIFIED } from "@/data/divorceImmigrationData";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

export const DIV_PATH = "/divorce-immigration-status";
export const DIV_URL = absoluteUrl(DIV_PATH);

export const DIV_PUBLISHED = "2026-08-16";
export const DIV_UPDATED = "2026-08-16";
export const DIV_UPDATED_HUMAN = "August 16, 2026";

/** Topical keywords for Article schema (never stuffed on-page). */
export const DIV_KEYWORDS = [
  "divorce and immigration status",
  "divorce on H-4 visa",
  "what happens to H-4 status after divorce",
  "H-4 EAD after divorce",
  "divorce green card holder",
  "conditional green card divorce",
  "I-751 waiver divorce",
  "removing conditions after divorce",
  "divorce before green card interview",
  "does divorce affect H-1B",
  "affidavit of support after divorce",
  "I-864 obligation divorce",
  "citizenship after divorce",
  "three year rule naturalization divorce",
  "VAWA self petition",
  "is US divorce valid in India",
  "US divorce recognition India",
  "Section 13B mutual consent divorce from USA",
  "alimony calculator NRI",
  "maintenance India NRI husband",
];

/* ------------------------------------------------------------------ *
 * Internal links — every target verified to exist in src/app.
 * ------------------------------------------------------------------ */
export const relatedGuideLinks: ClusterLink[] = [
  {
    href: "/i90-vs-i751",
    label: "I-90 vs I-751",
    desc: "Which form removes conditions and which one just replaces the card",
  },
  {
    href: "/green-card-renewal",
    label: "Green Card Renewal",
    desc: "Form I-90 renewal — a document replacement, unaffected by a divorce",
  },
  {
    href: "/i485-processing-time",
    label: "I-485 Processing Time",
    desc: "Where an adjustment application sits, and what a denial means",
  },
  {
    href: "/h1b",
    label: "H-1B Guide",
    desc: "Lottery, transfers, extensions and what keeps your own status intact",
  },
  {
    href: "/h1b-layoff",
    label: "H-1B Layoff Checklist",
    desc: "The grace-period rules that actually apply to workers — and only to workers",
  },
  {
    href: "/usa-government-benefits-immigrants",
    label: "Government Benefits for Immigrants",
    desc: "What a newly single-income household may qualify for, by status and state",
  },
  {
    href: "/immigration-attorney-lawyer-cost",
    label: "Immigration Attorney Costs",
    desc: "What the consultations and filings on this page typically cost",
  },
  {
    href: "/indian-passport-renewal-usa",
    label: "Indian Passport Renewal in the USA",
    desc: "Name and status changes on an Indian passport after a divorce",
  },
  {
    href: "/oci",
    label: "OCI Resource Center",
    desc: "OCI held through a spouse, and what apostilled documents India expects",
  },
  {
    href: "/nri-estate-planning",
    label: "NRI Estate Planning",
    desc: "Beneficiaries, wills and nominations that a divorce decree does not update for you",
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

export function divWebPageJsonLd() {
  return {
    "@type": "WebPage",
    "@id": `${DIV_URL}#webpage`,
    url: DIV_URL,
    name: "Divorce and Your US Immigration Status",
    description:
      "What divorce does to H-4 status, H-1B, a conditional or 10-year green card, a pending I-485, naturalization and the I-864 affidavit of support — plus an alimony estimator for the US and India.",
    isPartOf: { "@id": `${site.url}/#website` },
    inLanguage: "en-US",
    datePublished: DIV_PUBLISHED,
    dateModified: DIV_UPDATED,
  };
}

export function divArticleJsonLd() {
  return {
    "@type": "Article",
    "@id": `${DIV_URL}#article`,
    headline:
      "Divorce and Your US Immigration Status: H-1B, H-4, Green Card and Citizenship",
    description:
      "How divorce affects each US immigration status for Indian families — H-4 and its EAD, the H-1B principal, conditional and 10-year green cards, a pending I-130/I-485, naturalization timing, and the Form I-864 obligation that survives the decree. Includes whether a US divorce is recognized in India.",
    mainEntityOfPage: { "@id": `${DIV_URL}#webpage` },
    datePublished: DIV_PUBLISHED,
    dateModified: DIV_UPDATED,
    author: {
      "@type": "Person",
      name: author.name,
      url: absoluteUrl(author.url),
    },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
    keywords: DIV_KEYWORDS.join(", "),
    about: [
      { "@type": "Thing", name: "Divorce" },
      { "@type": "Thing", name: "Immigration status" },
      { "@type": "Thing", name: "Affidavit of Support" },
      { "@type": "Thing", name: "Spousal support" },
    ],
  };
}

/**
 * WebApplication schema for the estimator. Deliberately carries NO
 * AggregateRating, Review or usage counts — none of those would be real.
 */
export function divWebAppJsonLd() {
  return {
    "@type": "WebApplication",
    "@id": `${DIV_URL}#estimator`,
    name: "Alimony & Maintenance Estimator (US vs India)",
    url: `${DIV_URL}#estimator`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    description:
      "A free, private, client-side estimator that shows the guideline spousal-support figure a US state formula would produce alongside the maintenance benchmark an Indian court might work from, for the same couple. Educational only — not a legal determination, and no substitute for advice in either jurisdiction.",
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
