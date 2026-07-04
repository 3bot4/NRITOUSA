/**
 * Shared helpers for the NVC cluster:
 *   /nvc-case-status              (main pillar + tool)
 *   /what-is-nvc-case-number
 *   /nvc-processing-time          (tool)
 *   /nvc-document-checklist-india
 *   /nvc-public-inquiry
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

export const nvcClusterLinks: ClusterLink[] = [
  { href: "/nvc-case-status", label: "NVC Case Status & Timeline", desc: "Where you are after USCIS approval + next step" },
  { href: "/what-is-nvc-case-number", label: "What Is an NVC Case Number?", desc: "Format, example, and where to find it" },
  { href: "/nvc-processing-time", label: "NVC Processing Time", desc: "Case creation, document review & interview wait" },
  { href: "/nvc-document-checklist-india", label: "NVC Document Checklist (India)", desc: "Civil & financial documents for Indian applicants" },
  { href: "/nvc-public-inquiry", label: "NVC Public Inquiry", desc: "When and how to contact NVC" },
];

export const nvcRelatedLinks: ClusterLink[] = [
  { href: "/i485-processing-time", label: "I-485 Processing Time", desc: "Adjusting status inside the U.S. instead" },
  { href: "/visa-bulletin", label: "Visa Bulletin Explained", desc: "When your priority date becomes current" },
  { href: "/green-card", label: "Green Card Process", desc: "The full PERM → I-140 → visa journey" },
  { href: "/immigration-tracker", label: "Immigration Tracker", desc: "Priority dates, backlog & processing times" },
];

export function otherNvcLinks(currentHref: string): ClusterLink[] {
  return nvcClusterLinks.filter((l) => l.href !== currentHref);
}

export function nvcWebAppJsonLd(opts: { path: string; name: string; description: string }) {
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

export function nvcArticleJsonLd(opts: {
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

export const NVC_PUBLISHED = "2026-07-04";
export const NVC_UPDATED = "2026-07-04";
export const NVC_UPDATED_HUMAN = "July 4, 2026";
