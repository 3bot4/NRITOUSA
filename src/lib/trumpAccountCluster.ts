/**
 * Shared helpers for the Trump Account (immigrant-family) cluster:
 *   /trump-account-h1b-immigrant-families        (pillar)
 *   /can-h1b-parents-open-trump-account-for-child
 *   /trump-account-1000-eligibility
 *   /how-to-apply-for-trump-account-form-4547
 *   /trump-account-tax-rules-immigrants
 *   /trump-account-moving-back-to-india
 *   /trump-account-vs-529-for-h1b-families
 *   /trump-account-ssn-itin-child
 *
 * Mirrors greenCardRenewalCluster.ts / permCluster.ts / i485Cluster.ts.
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
export const trumpAccountClusterLinks: ClusterLink[] = [
  {
    href: "/trump-account-h1b-immigrant-families",
    label: "Trump Account for H-1B Parents",
    desc: "Pillar guide: eligibility, the $1,000 benefit, taxes, and how to apply",
  },
  {
    href: "/can-h1b-parents-open-trump-account-for-child",
    label: "Can H-1B Parents Open a Trump Account?",
    desc: "Exact H-1B / H-4 / green-card scenarios and who can open the account",
  },
  {
    href: "/trump-account-1000-eligibility",
    label: "Trump Account $1,000 Eligibility",
    desc: "Who gets the federal child contribution — checklist + eligibility checker",
  },
  {
    href: "/how-to-apply-for-trump-account-form-4547",
    label: "How to Apply (IRS Form 4547)",
    desc: "Step-by-step: open the account and request the $1,000 pilot contribution",
  },
  {
    href: "/trump-account-tax-rules-immigrants",
    label: "Trump Account Tax Rules for Immigrants",
    desc: "Tax-deferred growth, contributions, gift-tax safe harbor, and exit issues",
  },
  {
    href: "/trump-account-moving-back-to-india",
    label: "Moving Back to India",
    desc: "What happens to the account if H-1B parents return to India",
  },
  {
    href: "/trump-account-vs-529-for-h1b-families",
    label: "Trump Account vs 529 Plan",
    desc: "Long-term wealth vs education savings for H-1B and Indian families",
  },
  {
    href: "/trump-account-ssn-itin-child",
    label: "SSN vs ITIN Rules",
    desc: "Can a child without an SSN qualify? Valid-SSN rule explained",
  },
];

/** Related tools elsewhere on the site. */
export const trumpAccountRelatedLinks: ClusterLink[] = [
  { href: "/india-tax-compliance", label: "India Tax Compliance for NRIs", desc: "What Indian tax residency means when you return" },
  { href: "/free-immigrant-wealth-guide", label: "Immigrant Wealth Guide", desc: "Long-term money planning for immigrant families" },
  { href: "/h1b", label: "H-1B Resource Center", desc: "H-1B status, timelines, and family planning" },
  { href: "/calculators", label: "Financial Calculators", desc: "Plan contributions, growth, and family goals" },
];

export function otherTrumpAccountLinks(currentHref: string): ClusterLink[] {
  return trumpAccountClusterLinks.filter((l) => l.href !== currentHref);
}

/** Pull a cluster link by href (throws in dev if the slug is wrong). */
export function trumpLink(href: string): ClusterLink {
  const found = trumpAccountClusterLinks.find((l) => l.href === href);
  if (!found) throw new Error(`Unknown Trump Account cluster link: ${href}`);
  return found;
}

export function trumpAccountWebAppJsonLd(opts: {
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

export function trumpAccountArticleJsonLd(opts: {
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

/** HowTo schema for the step-by-step application flow (Form 4547). */
export function trumpAccountHowToJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** ItemList schema for a checklist / ordered list (each row becomes a ListItem). */
export function trumpAccountItemListJsonLd(opts: {
  path: string;
  name: string;
  items: { name: string; description?: string }[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@type": "ItemList",
    "@id": `${url}#items`,
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

/** Standalone Person schema for the author (E-E-A-T). Article nodes already
 *  embed the author; this adds an explicit, referenceable Person node. */
export function trumpAccountAuthorJsonLd() {
  return {
    "@type": "Person",
    "@id": `${site.url}${author.url}#person`,
    name: author.name,
    jobTitle: author.jobTitle,
    description:
      "Focused on immigrant tax, accounting, and cross-border financial planning for Indian families in the U.S.",
    url: absoluteUrl(author.url),
    sameAs: [author.linkedin],
    knowsAbout: [
      "H-1B immigrant tax planning",
      "Cross-border U.S.–India tax",
      "Trump Accounts",
      "529 plans",
      "NRI financial planning",
    ],
  };
}

export const TRUMP_ACCOUNT_PUBLISHED = "2026-07-06";
export const TRUMP_ACCOUNT_UPDATED = "2026-07-06";
export const TRUMP_ACCOUNT_UPDATED_HUMAN = "July 6, 2026";
