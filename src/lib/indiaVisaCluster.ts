/**
 * Shared helpers for the "India Visa from USA" cluster:
 *   /india-visa-from-usa            (hub)
 *   /india-evisa-for-us-citizens
 *   /india-tourist-visa-from-usa
 *   /india-business-visa-from-usa
 *   /entry-visa-india-from-usa
 *   /india-visa-fees-usa
 *   /india-visa-processing-time-usa
 *   /oci-vs-india-visa
 *
 * Mirrors greenCardRenewalCluster.ts / i485Cluster.ts: cluster link lists plus
 * Article / WebPage / Breadcrumb / ItemList JSON-LD builders. These pages are
 * editorial content (not tools), so we emit Article + WebPage nodes (not
 * WebApplication).
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/** Every page in the cluster (used for "related pages" grids). */
export const indiaVisaClusterLinks: ClusterLink[] = [
  { href: "/india-visa-from-usa", label: "India Visa from USA (Hub)", desc: "Which visa you need, fees, timelines, and how to apply" },
  { href: "/india-evisa-for-us-citizens", label: "India eVisa for U.S. Citizens", desc: "eTourist, eBusiness, eMedical: eligibility, fees, documents" },
  { href: "/india-tourist-visa-from-usa", label: "India Tourist Visa from USA", desc: "eVisa vs regular tourist visa, fees, and multiple entry" },
  { href: "/india-business-visa-from-usa", label: "India Business Visa from USA", desc: "Invitation letter, company proof, fees, processing time" },
  { href: "/entry-visa-india-from-usa", label: "Entry Visa India from USA", desc: "For Indian-origin families, non-Indian spouses, and children" },
  { href: "/india-visa-fees-usa", label: "India Visa Fees for U.S. Citizens", desc: "Tourist, business, entry, eVisa, and VFS service costs" },
  { href: "/india-visa-processing-time-usa", label: "India Visa Processing Time from USA", desc: "eVisa, regular visa, Entry Visa, VFS, and urgent travel" },
  { href: "/oci-vs-india-visa", label: "OCI vs India Visa", desc: "Which is better for Indian-origin U.S. citizens and families" },
];

/** All cluster links except the current page. */
export function otherIndiaVisaLinks(currentHref: string): ClusterLink[] {
  return indiaVisaClusterLinks.filter((l) => l.href !== currentHref);
}

/** Article schema for a single cluster guide. */
export function indiaVisaArticleJsonLd(opts: {
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

/** WebPage schema node for a cluster page. */
export function indiaVisaWebPageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  dateModified: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    dateModified: opts.dateModified,
    isPartOf: { "@id": `${site.url}/#website` },
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

/** ItemList schema for a step list (each entry becomes a ListItem). */
export function indiaVisaItemListJsonLd(opts: {
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
