/**
 * Shared helpers for the prevailing-wage cluster:
 *   /prevailing-wage-calculator (main tool)
 *   /dol-wage-levels-explained
 *   /h1b-prevailing-wage
 *
 * Mirrors src/lib/permCluster.ts. Keeps JSON-LD and internal linking consistent.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/** Pages within this cluster. */
export const wageClusterLinks: ClusterLink[] = [
  { href: "/prevailing-wage-calculator", label: "Prevailing Wage Calculator", desc: "Estimate your wage level & check an offer" },
  { href: "/dol-wage-levels-explained", label: "DOL Wage Levels Explained", desc: "Level I, II, III, IV — who fits where" },
  { href: "/h1b-prevailing-wage", label: "H-1B Prevailing Wage", desc: "How the required wage works for H-1B" },
];

/** Related pages in the sibling PERM cluster + existing immigration tools. */
export const wageRelatedLinks: ClusterLink[] = [
  { href: "/perm-processing-time-calculator", label: "PERM Processing Time Calculator", desc: "Your full PWD → PERM → I-140 timeline" },
  { href: "/pwd-processing-time", label: "PWD Processing Time", desc: "Prevailing wage determination timeline" },
  { href: "/dol-processing-times", label: "DOL Processing Times", desc: "PERM, PWD & audit review queues" },
  { href: "/tools/h1b-salaries", label: "H-1B Salary Explorer", desc: "Real certified H-1B wages by role & city" },
  { href: "/tools/h1b-sponsor-finder", label: "H-1B Sponsor Finder", desc: "Employers that sponsor by role & state" },
  { href: "/h1b", label: "H-1B Guide", desc: "The full H-1B process for Indians" },
];

export function otherWageLinks(currentHref: string): ClusterLink[] {
  return wageClusterLinks.filter((l) => l.href !== currentHref);
}

/** WebApplication schema for the calculator page. */
export function wageWebAppJsonLd(opts: { path: string; name: string; description: string }) {
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

/** Article schema authored/reviewed by Deepak Middha for every cluster page. */
export function wageArticleJsonLd(opts: {
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

export const WAGE_PUBLISHED = "2026-07-03";
export const WAGE_UPDATED = "2026-07-03";
export const WAGE_UPDATED_HUMAN = "July 3, 2026";
