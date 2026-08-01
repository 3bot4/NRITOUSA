/**
 * Visitor Insurance Cost & Liability cluster — shared, non-routing config.
 *
 * Unlike src/lib/greenCardCluster.ts, this file does NOT drive a dynamic
 * [slug] route: three of the six content child pages embed a live
 * calculator, which the ArticleBody markdown-fence system can't express, so
 * every page is its own literal route file. This file is the shared
 * metadata array (hub cards, sitemap, related-links), JSON-LD builders, and
 * date constants — the same role i140Cluster.ts plays for its cluster.
 * See docs/visitor-insurance/architecture.md.
 */
import { absoluteUrl, breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";
import { site } from "@/lib/site";

export const VISITOR_INSURANCE_BASE = "/visitor-insurance";
export const VISITOR_INSURANCE_PUBLISHED = "2026-07-29";
export const VISITOR_INSURANCE_UPDATED = "2026-07-29";
export const VISITOR_INSURANCE_UPDATED_HUMAN = "July 2026";

export interface VisitorInsuranceChildPageMeta {
  slug: string;
  path: string;
  navLabel: string;
  title: string;
  excerpt: string;
  icon: string;
}

export const visitorInsuranceChildPages: VisitorInsuranceChildPageMeta[] = [
  {
    slug: "parents-visiting-usa",
    path: "/visitor-insurance/parents-visiting-usa",
    navLabel: "Insurance for Parents Visiting the USA",
    title: "Insurance for Parents Visiting the USA: Coverage, Cost & Liability",
    excerpt: "Age, coverage amount, deductible choice, and pre-existing-condition wording — what to gather before you compare plans for a parent visiting from India.",
    icon: "👪",
  },
  {
    slug: "fixed-benefit-vs-comprehensive",
    path: "/visitor-insurance/fixed-benefit-vs-comprehensive",
    navLabel: "Fixed-Benefit vs Comprehensive",
    title: "Fixed-Benefit vs Comprehensive Visitor Insurance: What Changes",
    excerpt: "Two plans with the same policy maximum can pay very different amounts. See how scheduled benefits and comprehensive cost-sharing diverge on the same bill.",
    icon: "🔀",
  },
  {
    slug: "pre-existing-conditions-acute-onset",
    path: "/visitor-insurance/pre-existing-conditions-acute-onset",
    navLabel: "Pre-Existing Conditions & Acute Onset",
    title: "Visitor Insurance Pre-Existing Conditions & Acute Onset, Explained",
    excerpt: "An educational policy-language analyzer — not a medical diagnosis tool. See what your certificate's acute-onset wording may mean before you rely on it.",
    icon: "📋",
  },
  {
    slug: "how-much-coverage",
    path: "/visitor-insurance/how-much-coverage",
    navLabel: "How Much Coverage Do You Need",
    title: "How Much Visitor Insurance Coverage Do You Need?",
    excerpt: "A decision framework — not a fixed number — based on age, trip length, existing health concerns, and what your family could absorb above the plan maximum.",
    icon: "🧭",
  },
  {
    slug: "glossary",
    path: "/visitor-insurance/glossary",
    navLabel: "Glossary",
    title: "Visitor Insurance Glossary: Every Term, Explained With Numbers",
    excerpt: "Plain-English definitions with numeric examples for every term you'll see on a visitor insurance certificate — deductible to usual, reasonable and customary charge.",
    icon: "📖",
  },
  {
    slug: "methodology",
    path: "/visitor-insurance/methodology",
    navLabel: "Calculator Methodology",
    title: "How the Visitor Insurance Calculators Work",
    excerpt: "The exact calculation sequence, source hierarchy, rounding method, and known limitations behind every visitor-insurance calculator on this site.",
    icon: "🔬",
  },
];

export function getVisitorInsuranceChildPage(slug: string): VisitorInsuranceChildPageMeta | undefined {
  return visitorInsuranceChildPages.find((p) => p.slug === slug);
}

export const visitorInsuranceTools = [
  { slug: "visitor-insurance-cost-calculator", path: "/tools/visitor-insurance-cost-calculator", label: "Cost & Liability Calculator", icon: "🩺" },
  { slug: "visitor-insurance-plan-comparison", path: "/tools/visitor-insurance-plan-comparison", label: "Plan Comparison", icon: "⚖️" },
  { slug: "visitor-insurance-deductible-coinsurance-calculator", path: "/tools/visitor-insurance-deductible-coinsurance-calculator", label: "Deductible & Coinsurance", icon: "🧮" },
  { slug: "visitor-insurance-hospital-bill-calculator", path: "/tools/visitor-insurance-hospital-bill-calculator", label: "Hospital & ER Bill", icon: "🏥" },
  { slug: "visitor-insurance-network-cost-calculator", path: "/tools/visitor-insurance-network-cost-calculator", label: "In-Network vs Out-of-Network", icon: "🌐" },
  { slug: "visitor-insurance-policy-maximum-calculator", path: "/tools/visitor-insurance-policy-maximum-calculator", label: "Policy Maximum", icon: "🛡️" },
] as const;

/** WebApplication / SoftwareApplication node for a visitor-insurance calculator page. */
export function visitorInsuranceWebAppJsonLd(opts: { path: string; name: string; description: string }) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "SoftwareApplication",
    "@id": `${url}#app`,
    name: opts.name,
    description: opts.description,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
  };
}

/** Article node for a visitor-insurance guide/hub page. */
export function visitorInsuranceArticleJsonLd(opts: { path: string; headline: string; description: string; datePublished?: string; dateModified?: string }) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished ?? VISITOR_INSURANCE_PUBLISHED,
    dateModified: opts.dateModified ?? VISITOR_INSURANCE_UPDATED,
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/about-deepak")}#person`,
      name: "Deepak Middha",
      jobTitle: "Founder & Author",
      url: absoluteUrl("/about-deepak"),
    },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export function visitorInsuranceBreadcrumb(path: string, label: string) {
  const crumbs =
    path === VISITOR_INSURANCE_BASE
      ? [{ name: "Home", url: "/" }, { name: "Visitor Insurance", url: VISITOR_INSURANCE_BASE }]
      : [{ name: "Home", url: "/" }, { name: "Visitor Insurance", url: VISITOR_INSURANCE_BASE }, { name: label, url: path }];
  return breadcrumbJsonLd(crumbs);
}

export function visitorInsuranceToolBreadcrumb(path: string, label: string) {
  return breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Visitor Insurance", url: VISITOR_INSURANCE_BASE },
    { name: label, url: path },
  ]);
}

export { jsonLdGraph };

/** Common statement shown near every calculator result, not only in the footer disclaimer. */
export const VISITOR_INSURANCE_RESULT_NOTE =
  "This tool provides educational estimates based on the information you enter. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination.";
