/**
 * Shared helpers for the Life Insurance (Indian-family) cluster:
 *   /life-insurance-for-indian-families-usa              (pillar)
 *   /term-life-insurance-for-indian-families-usa
 *   /indexed-universal-life-iul-for-indian-families-usa
 *   /term-vs-iul-for-indian-families-usa
 *
 * Mirrors trumpAccountCluster.ts / greenCardRenewalCluster.ts. Educational,
 * compliance-conscious content — see the rules atop src/data/lifeInsuranceData.ts.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/** In-cluster pages. */
export const lifeInsuranceClusterLinks: ClusterLink[] = [
  {
    href: "/life-insurance-for-indian-families-usa",
    label: "Life Insurance for Indian Families in the U.S.",
    desc: "Pillar guide: why coverage matters after moving to the U.S., protection gaps, term vs permanent, and what to ask an agent",
  },
  {
    href: "/term-life-insurance-for-indian-families-usa",
    label: "Term Life Insurance for Indian Families",
    desc: "How much coverage your family may need, term-length choices, and the mistakes H-1B and NRI families make",
  },
  {
    href: "/indexed-universal-life-iul-for-indian-families-usa",
    label: "Indexed Universal Life (IUL) for Indian Families",
    desc: "How IUL works in plain English — caps, floors, charges, loans, MEC risk, and what “tax-free” really means",
  },
  {
    href: "/term-vs-iul-for-indian-families-usa",
    label: "Term vs IUL for Indian Families",
    desc: "Side-by-side comparison, when each may fit, why some families use both, and a checklist before meeting an agent",
  },
  {
    href: "/term-life-insurance-needs-calculator-indian-families",
    label: "Term Life Insurance Needs Calculator",
    desc: "Estimate your family's coverage gap — U.S. income, mortgage, children, plus India/home-country support and debts",
  },
];

/** Related pages elsewhere on the site. */
export const lifeInsuranceRelatedLinks: ClusterLink[] = [
  { href: "/h1b-layoff", label: "H-1B Layoff Guide", desc: "Why job loss is exactly when employer-only coverage fails" },
  { href: "/return-to-india-checklist", label: "Return to India Checklist", desc: "What to review before moving back — including U.S. policies" },
  { href: "/free-immigrant-wealth-guide", label: "Immigrant Wealth Guide", desc: "Long-term money planning for immigrant families" },
  { href: "/long-term-nri-wealth", label: "NRI Wealth Hub", desc: "The full long-term wealth resource center" },
];

export function otherLifeInsuranceLinks(currentHref: string): ClusterLink[] {
  return lifeInsuranceClusterLinks.filter((l) => l.href !== currentHref);
}

export function lifeInsuranceWebAppJsonLd(opts: {
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
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
  };
}

export function lifeInsuranceArticleJsonLd(opts: {
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
    author: lifeInsuranceAuthorJsonLd(),
    reviewedBy: lifeInsuranceAuthorJsonLd(),
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

/** Standalone Person schema for the author (E-E-A-T) — includes credentials. */
export function lifeInsuranceAuthorJsonLd() {
  return {
    "@type": "Person",
    "@id": `${site.url}${author.url}#person`,
    name: author.name,
    jobTitle: author.jobTitle,
    description:
      "Focused on immigrant tax, accounting, and cross-border financial planning for Indian families in the U.S.",
    url: absoluteUrl(author.url),
    sameAs: [author.linkedin],
    hasCredential: author.credentials.split(",").map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: c.trim(),
    })),
    knowsAbout: [
      "Life insurance planning basics for immigrant families",
      "Term life insurance coverage frameworks",
      "Indexed universal life (IUL) mechanics and risks",
      "Cross-border U.S.–India financial planning",
      "NRI financial planning",
    ],
  };
}

/**
 * Per-page publish/modify metadata. Structured per-path so a later revision to
 * one page can bump only that page's dates rather than a single shared string.
 * All five pages were genuinely created and last revised on 2026-07-10.
 */
export interface LifePageMeta {
  published: string;
  modified: string;
  modifiedHuman: string;
}

export const lifePageMeta: Record<string, LifePageMeta> = {
  "/life-insurance-for-indian-families-usa": {
    published: "2026-07-10",
    modified: "2026-07-10",
    modifiedHuman: "July 10, 2026",
  },
  "/term-life-insurance-for-indian-families-usa": {
    published: "2026-07-10",
    modified: "2026-07-10",
    modifiedHuman: "July 10, 2026",
  },
  "/indexed-universal-life-iul-for-indian-families-usa": {
    published: "2026-07-10",
    modified: "2026-07-10",
    modifiedHuman: "July 10, 2026",
  },
  "/term-vs-iul-for-indian-families-usa": {
    published: "2026-07-10",
    modified: "2026-07-10",
    modifiedHuman: "July 10, 2026",
  },
  "/term-life-insurance-needs-calculator-indian-families": {
    published: "2026-07-10",
    modified: "2026-07-10",
    modifiedHuman: "July 10, 2026",
  },
};

export function lifeMeta(path: string): LifePageMeta {
  return (
    lifePageMeta[path] ?? {
      published: "2026-07-10",
      modified: "2026-07-10",
      modifiedHuman: "July 10, 2026",
    }
  );
}
