/**
 * Port-of-entry cluster wiring — shared links and JSON-LD helpers for
 * /h1b-denied-entry-airport and /automatic-visa-revalidation.
 *
 * Mirrors nvcCluster.ts / permCluster.ts.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

export const POE_PUBLISHED = "2026-09-09";
export const POE_UPDATED = "2026-09-11";
export const POE_UPDATED_HUMAN = "11 September 2026";

export const poeClusterLinks: ClusterLink[] = [
  {
    href: "/h1b-denied-entry-airport",
    label: "Denied Entry at the Airport on H-1B",
    desc: "Secondary inspection, the outcome fork, and what each one costs you",
  },
  {
    href: "/automatic-visa-revalidation",
    label: "Automatic Visa Revalidation",
    desc: "Returning from Canada or Mexico on an expired visa — and the trap",
  },
];

/**
 * Related pages that already exist. The outbound leg of the journey — stamping,
 * 221(g), consulate choice — is covered on the H-1B travel pages and is
 * deliberately NOT repeated in this cluster.
 */
export const poeRelatedLinks: ClusterLink[] = [
  {
    href: "/h1b/travel-to-india",
    label: "H-1B Travel to India",
    desc: "The outbound leg: stamping, 221(g) risk, and when not to go",
  },
  {
    href: "/h1b/stamping-india-after-approval",
    label: "H-1B Stamping in India After Approval",
    desc: "The consulate process, documents and administrative processing",
  },
  {
    href: "/visa-interview-waiver",
    label: "Visa Interview Waiver (Dropbox)",
    desc: "Who still qualifies after the October 2025 rules",
  },
  {
    href: "/h1b/extension",
    label: "H-1B Extension",
    desc: "3-year, 6-year and beyond-6-year extensions with an approved I-140",
  },
  {
    href: "/h1b-layoff",
    label: "H-1B Layoff & the 60-Day Grace Period",
    desc: "What the discretionary grace period does and does not give you",
  },
  {
    href: "/uscis/forms/i-131",
    label: "Form I-131 (Advance Parole)",
    desc: "Travel while an adjustment of status application is pending",
  },
];

export function otherPoeLinks(currentHref: string): ClusterLink[] {
  return poeClusterLinks.filter((l) => l.href !== currentHref);
}

export function poeWebAppJsonLd(opts: {
  path: string;
  name: string;
  description: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name: opts.name,
    description: opts.description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
  };
}

export function poeArticleJsonLd(opts: {
  path: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished ?? POE_PUBLISHED,
    dateModified: opts.dateModified ?? POE_UPDATED,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: author.name, url: absoluteUrl("/about-deepak") },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
  };
}
