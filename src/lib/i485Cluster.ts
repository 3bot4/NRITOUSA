/**
 * Shared helpers for the I-485 cluster:
 *   /i485-processing-time (main tool)
 *   /i485-timeline
 *   /i485-documents-checklist
 *
 * Mirrors permCluster.ts / wageCluster.ts / i140Cluster.ts / eadCluster.ts.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

export const i485ClusterLinks: ClusterLink[] = [
  { href: "/i485-processing-time", label: "I-485 Processing Time", desc: "Can you file yet + adjudication estimate" },
  { href: "/i485-timeline", label: "I-485 Timeline", desc: "Filing to green card, step by step" },
  { href: "/i485-documents-checklist", label: "I-485 Documents Checklist", desc: "Everything to gather before filing" },
];

export const i485RelatedLinks: ClusterLink[] = [
  { href: "/nvc-document-checklist-india", label: "NVC document checklist", desc: "Consular-processing documents for Indian applicants" },
  { href: "/eb2-eb3-priority-date-india", label: "EB2/EB3 India Priority Date", desc: "When your date becomes current" },
  { href: "/i140-processing-time", label: "I-140 Processing Time", desc: "The petition before I-485" },
  { href: "/ead-processing-time", label: "EAD Processing Time", desc: "Work permit filed with I-485" },
  { href: "/advance-parole-processing-time", label: "Advance Parole", desc: "Travel document filed with I-485" },
  { href: "/tools/green-card-tracker", label: "Green Card Wait Tracker", desc: "How many are ahead of you in line" },
  { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Compare your date to the bulletin" },
];

export function otherI485Links(currentHref: string): ClusterLink[] {
  return i485ClusterLinks.filter((l) => l.href !== currentHref);
}

export function i485WebAppJsonLd(opts: { path: string; name: string; description: string }) {
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

export function i485ArticleJsonLd(opts: {
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

export const I485_PUBLISHED = "2026-07-03";
export const I485_UPDATED = "2026-07-03";
export const I485_UPDATED_HUMAN = "July 3, 2026";
