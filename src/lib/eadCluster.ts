/**
 * Shared helpers for the EAD / Advance Parole cluster:
 *   /ead-processing-time (main tool)
 *   /advance-parole-processing-time
 *   /ead-renewal-gap
 *
 * Mirrors permCluster.ts / wageCluster.ts / i140Cluster.ts.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

export const eadClusterLinks: ClusterLink[] = [
  { href: "/ead-processing-time", label: "EAD Processing Time", desc: "Estimate + auto-extension by category" },
  { href: "/advance-parole-processing-time", label: "Advance Parole Processing Time", desc: "I-131 travel document timing" },
  { href: "/ead-renewal-gap", label: "EAD Renewal Gap", desc: "Avoid a work-authorization gap" },
];

export const eadRelatedLinks: ClusterLink[] = [
  { href: "/i485-processing-time", label: "I-485 Processing Time", desc: "The green card stage EAD/AP are filed with" },
  { href: "/i140-processing-time", label: "I-140 Processing Time", desc: "The petition before your green card stage" },
  { href: "/eb2-eb3-priority-date-india", label: "EB2/EB3 India Priority Date", desc: "When you can file I-485 + EAD" },
  { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator", desc: "What an H-4 EAD spouse can do" },
  { href: "/tools/green-card-tracker", label: "Green Card Wait Tracker", desc: "How long the India wait really is" },
  { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your case outside normal range?" },
  { href: "/immigration-tracker", label: "Immigration Tracker", desc: "Bulletin, backlog & processing in one place" },
];

export function otherEadLinks(currentHref: string): ClusterLink[] {
  return eadClusterLinks.filter((l) => l.href !== currentHref);
}

export function eadWebAppJsonLd(opts: { path: string; name: string; description: string }) {
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

export function eadArticleJsonLd(opts: {
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

export const EAD_PUBLISHED = "2026-07-03";
export const EAD_UPDATED = "2026-07-03";
export const EAD_UPDATED_HUMAN = "July 3, 2026";
