/**
 * Shared helpers for the PERM processing-time cluster:
 *   /perm-processing-time-calculator (main tool)
 *   /dol-processing-times
 *   /pwd-processing-time
 *   /perm-timeline
 *   /h1b-perm-max-out-calculator
 *   /eb2-eb3-priority-date-india
 *
 * Keeps JSON-LD (Article + WebApplication) and the cross-cluster internal-link
 * set consistent across every page.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/** Every page in the cluster, for the "Related immigration timeline tools" box. */
export const clusterLinks: ClusterLink[] = [
  { href: "/perm-processing-time-calculator", label: "PERM Processing Time Calculator", desc: "Estimate your full PWD → PERM → I-140 timeline" },
  { href: "/dol-processing-times", label: "DOL Processing Times", desc: "Current PERM, PWD & audit review queues" },
  { href: "/pwd-processing-time", label: "PWD Processing Time", desc: "Prevailing wage timeline before PERM" },
  { href: "/perm-timeline", label: "PERM Timeline", desc: "Step-by-step green card process after H-1B" },
  { href: "/h1b-perm-max-out-calculator", label: "H-1B PERM Max-Out Calculator", desc: "Six-year limit & extension risk" },
  { href: "/eb2-eb3-priority-date-india", label: "EB2 / EB3 India Priority Date", desc: "Where your India priority date stands" },
];

/** Related existing immigration tools/pages linked from cluster pages. */
export const relatedImmigrationLinks: ClusterLink[] = [
  { href: "/i485-processing-time", label: "I-485 Processing Time", desc: "Adjustment-of-status timeline after your date is current" },
  { href: "/nvc-case-status", label: "NVC Case Status", desc: "Consular processing stage after USCIS approval" },
  { href: "/prevailing-wage-calculator", label: "Prevailing Wage Calculator", desc: "Estimate your DOL wage level & check an offer" },
  { href: "/i140-processing-time", label: "I-140 Processing Time", desc: "Standard vs premium decision estimate" },
  { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Compare your date to the current bulletin" },
  { href: "/tools/green-card-tracker", label: "Green Card Wait Tracker", desc: "How many are ahead of you in line" },
  { href: "/visa-bulletin", label: "Visa Bulletin Guide", desc: "How the monthly bulletin works for Indians" },
  { href: "/immigration-tracker", label: "Immigration Tracker", desc: "Bulletin, backlog & lottery in one place" },
  { href: "/h1b-layoff", label: "H-1B Layoff Guide", desc: "Grace period, options and next steps" },
  { href: "/green-card", label: "Green Card Guide", desc: "PERM, I-140, I-485 — the full process" },
];

/** Return a subset of cluster links excluding the current page. */
export function otherClusterLinks(currentHref: string): ClusterLink[] {
  return clusterLinks.filter((l) => l.href !== currentHref);
}

/**
 * WebApplication schema for the two interactive calculator pages.
 */
export function webAppJsonLd(opts: {
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

/**
 * Article schema authored/reviewed by Deepak Middha (E-E-A-T) for every
 * cluster page.
 */
export function clusterArticleJsonLd(opts: {
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

/** Human-readable publish/update stamps for the cluster (edit when you revise). */
export const CLUSTER_PUBLISHED = "2026-07-03";
export const CLUSTER_UPDATED = "2026-07-04";
export const CLUSTER_UPDATED_HUMAN = "July 4, 2026";
