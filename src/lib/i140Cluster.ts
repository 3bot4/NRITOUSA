/**
 * Shared helpers for the I-140 cluster:
 *   /i140-processing-time (main tool)
 *   /i140-premium-processing
 *   /i140-approved-what-next
 *
 * Mirrors src/lib/permCluster.ts / wageCluster.ts.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

export const i140ClusterLinks: ClusterLink[] = [
  { href: "/i140-processing-time", label: "I-140 Processing Time", desc: "Standard vs premium decision estimate" },
  { href: "/i140-premium-processing", label: "I-140 Premium Processing", desc: "Fee, timeline & eligibility" },
  { href: "/i140-approved-what-next", label: "I-140 Approved — What Next", desc: "Priority date, I-485 & H-1B extensions" },
];

export const i140RelatedLinks: ClusterLink[] = [
  { href: "/perm-processing-time-calculator", label: "PERM Processing Time Calculator", desc: "The step before I-140" },
  { href: "/perm-timeline", label: "PERM Timeline", desc: "Full green card process after H-1B" },
  { href: "/eb2-eb3-priority-date-india", label: "EB2/EB3 India Priority Date", desc: "When you can file I-485" },
  { href: "/ead-processing-time", label: "EAD Processing Time", desc: "Work permit timeline & auto-extension" },
  { href: "/h1b-perm-max-out-calculator", label: "H-1B Max-Out Calculator", desc: "How an approved I-140 extends H-1B" },
  { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Compare your date to the bulletin" },
  { href: "/tools/green-card-tracker", label: "Green Card Wait Tracker", desc: "How many are ahead of you in line" },
];

export function otherI140Links(currentHref: string): ClusterLink[] {
  return i140ClusterLinks.filter((l) => l.href !== currentHref);
}

export function i140WebAppJsonLd(opts: { path: string; name: string; description: string }) {
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

export function i140ArticleJsonLd(opts: {
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

export const I140_PUBLISHED = "2026-07-03";
export const I140_UPDATED = "2026-07-03";
export const I140_UPDATED_HUMAN = "July 3, 2026";
