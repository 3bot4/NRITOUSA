/**
 * Shared helpers for the "NRI cross-border essentials" trio:
 *   /gold-limit-usa-to-india                      (guide + duty calculator)
 *   /invitation-letter-for-parents-to-visit-usa   (letter generator + guide)
 *   /nri-selling-property-in-india-tds            (authority guide)
 *
 * Mirrors greenCardRenewalCluster.ts / permCluster.ts. The author Person node
 * uses the same @id as the /about-deepak profile page (#person) so the
 * article author and the bio page resolve to ONE entity for E-E-A-T, and the
 * jobTitle carries the professional credential rather than the site role.
 */
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";

export interface ClusterLink {
  href: string;
  label: string;
  desc: string;
}

/* ── Per-page publication dates (bump *_UPDATED on every content change) ── */

export const GOLD_PUBLISHED = "2026-07-18";
export const GOLD_UPDATED = "2026-07-18";
export const GOLD_UPDATED_HUMAN = "July 18, 2026";

export const INVITE_PUBLISHED = "2026-07-18";
export const INVITE_UPDATED = "2026-07-18";
export const INVITE_UPDATED_HUMAN = "July 18, 2026";

export const NRI_TDS_PUBLISHED = "2026-07-18";
export const NRI_TDS_UPDATED = "2026-07-18";
export const NRI_TDS_UPDATED_HUMAN = "July 18, 2026";

/* ── Cross-links between the three pages (keyword-rich anchors) ─────────── */

export const essentialsClusterLinks: ClusterLink[] = [
  {
    href: "/gold-limit-usa-to-india",
    label: "How Much Gold Can I Carry From USA to India",
    desc: "Duty-free limits, customs duty rates, and a free duty calculator",
  },
  {
    href: "/invitation-letter-for-parents-to-visit-usa",
    label: "Invitation Letter for Parents to Visit USA",
    desc: "Free B-2 invitation letter generator, sample, and format",
  },
  {
    href: "/nri-selling-property-in-india-tds",
    label: "NRI Selling Property in India: TDS Guide",
    desc: "TDS rates, Form 13 lower-TDS certificate, US tax, repatriation",
  },
];

export function otherEssentialsLinks(currentHref: string): ClusterLink[] {
  return essentialsClusterLinks.filter((l) => l.href !== currentHref);
}

/* ── JSON-LD builders ───────────────────────────────────────────────────── */

/** Author Person node — same entity as the /about-deepak profile page. */
const authorPersonJsonLd = {
  "@type": "Person",
  "@id": `${absoluteUrl(author.url)}#person`,
  name: author.name,
  jobTitle: "Chartered Accountant, Series 65",
  url: absoluteUrl(author.url),
  sameAs: [author.linkedin],
};

export function essentialsArticleJsonLd(opts: {
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
    author: authorPersonJsonLd,
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

/** SoftwareApplication node for the free on-page tools (calculator/generator). */
export function essentialsSoftwareAppJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  applicationCategory?: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "SoftwareApplication",
    "@id": `${url}#app`,
    name: opts.name,
    description: opts.description,
    url,
    applicationCategory: opts.applicationCategory ?? "UtilitiesApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-US",
  };
}
