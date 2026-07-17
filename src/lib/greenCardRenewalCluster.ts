/**
 * Shared helpers for the Green Card Renewal cluster:
 *   /green-card-renewal                (main hub + checklist tool)
 *   /green-card-renewal-processing-time
 *   /renew-green-card-online
 *   /green-card-renewal-fee
 *   /replace-green-card
 *   /i90-vs-i751
 *   /expired-green-card
 *
 * Mirrors permCluster.ts / i485Cluster.ts / eadCluster.ts.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/** In-cluster pages (varied anchors used across the pages). */
export const gcRenewalClusterLinks: ClusterLink[] = [
  { href: "/green-card-renewal", label: "Green Card Renewal Guide", desc: "Form I-90 timeline, fee, documents, and checklist" },
  { href: "/green-card-renewal-processing-time", label: "Green Card Renewal Processing Time", desc: "How long Form I-90 takes, stage by stage" },
  { href: "/renew-green-card-online", label: "Renew Green Card Online", desc: "Form I-90 online filing, step by step" },
  { href: "/green-card-renewal-fee", label: "Green Card Renewal Fee", desc: "Form I-90 cost and fee-waiver basics" },
  { href: "/replace-green-card", label: "Replace Green Card", desc: "Lost, stolen, damaged, or incorrect card" },
  { href: "/i90-vs-i751", label: "I-90 vs I-751", desc: "Which green card form you actually need" },
  { href: "/expired-green-card", label: "Expired Green Card Renewal", desc: "Work, travel, and DMV before you renew" },
];

/** Related tools elsewhere on the site. */
export const gcRenewalRelatedLinks: ClusterLink[] = [
  { href: "/i485-processing-time", label: "I-485 Processing Time", desc: "Adjustment-of-status timeline" },
  { href: "/nvc-case-status", label: "NVC Case Status", desc: "Consular processing case stage" },
  { href: "/immigration-tracker", label: "Immigration Tracker", desc: "Track your immigration journey" },
  { href: "/uscis/case-status", label: "USCIS Case Status", desc: "Understand your case status messages" },
  {
    href: "/usa-government-benefits-immigrants",
    label: "Government Benefits for Immigrants",
    desc: "What your family may qualify for — and why renewal has no public-charge test",
  },
];

export function otherRenewalLinks(currentHref: string): ClusterLink[] {
  return gcRenewalClusterLinks.filter((l) => l.href !== currentHref);
}

export function gcRenewalWebAppJsonLd(opts: {
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

export function gcRenewalArticleJsonLd(opts: {
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
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.jobTitle,
      url: absoluteUrl(author.url),
      sameAs: [author.linkedin],
    },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

/** ItemList schema for a timeline / step list (each row becomes a ListItem). */
export function gcRenewalItemListJsonLd(opts: {
  path: string;
  name: string;
  items: { name: string; description?: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "ItemList",
    "@id": `${url}#steps`,
    name: opts.name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.description ? { description: it.description } : {}),
    })),
  };
}

export const GC_RENEWAL_PUBLISHED = "2026-07-04";
export const GC_RENEWAL_UPDATED = "2026-07-04";
export const GC_RENEWAL_UPDATED_HUMAN = "July 4, 2026";
