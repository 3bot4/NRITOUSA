/**
 * Global site search index.
 *
 * A single, read-only projection over the site's existing content catalogs that
 * powers the homepage "Search NRI to USA" box. It does NOT define new routes or
 * change any slug — it merely assembles a flat, searchable list of every
 * high-value destination (tools, calculators, checklists, guides, articles, hub
 * pages, and PDF lead magnets), each tagged with a content-type badge and a
 * priority weight so the most-useful pages surface first.
 *
 * Sources (all already crawlable elsewhere on the site):
 *   - toolCatalog        → Tool / Calculator / Checklist / Hub
 *   - articles.ts        → Article
 *   - the topic clusters → Guide (ITR, TDS, repatriation, gifts, passport, OCI,
 *                          USCIS, myUSCIS, forms, life-planning, H-1B, green
 *                          card, visa bulletin)
 *   - trumpAccountCluster→ Guide
 *   - CURATED            → Hub + PDF + the flagship top-level pages
 *
 * Adding a page to any source catalog surfaces it here automatically. Only the
 * PRIORITY map and CURATED list below are hand-maintained.
 */

import { toolCatalog } from "@/lib/toolCatalog";
import { articles } from "@/lib/articles";
import { itrPages, itrPath } from "@/lib/itrCluster";
import { tdsPages, tdsPath } from "@/lib/tdsCluster";
import { repatPages, repatPath } from "@/lib/repatriationCluster";
import { giftPages, giftPath } from "@/lib/giftsCluster";
import { clusterPages, clusterPath } from "@/lib/passportCluster";
import { ociGuides, ociGuidePath } from "@/lib/ociGuides";
import { uscisChildPages } from "@/lib/uscisCluster";
import { myuscisChildPages } from "@/lib/myuscisCluster";
import { formsChildPages } from "@/lib/uscisFormsCluster";
import { lifePlanningChildPages } from "@/lib/uscisLifePlanningCluster";
import { h1bChildPages } from "@/lib/h1bCluster";
import { greenCardChildPages } from "@/lib/greenCardCluster";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { trumpAccountClusterLinks } from "@/lib/trumpAccountCluster";
import { lifeInsuranceClusterLinks } from "@/lib/lifeInsuranceCluster";

/** Content-type badge shown on each search result. */
export type SearchType =
  | "Tool"
  | "Calculator"
  | "Checklist"
  | "Guide"
  | "Article"
  | "Hub"
  | "PDF";

export interface SearchItem {
  title: string;
  description: string;
  href: string;
  type: SearchType;
  /** Higher surfaces first (default 0). */
  priority: number;
  /** Lowercased free-text terms folded into the search haystack. */
  keywords?: string;
}

/** Trim a description to a short, card-friendly length on a word boundary. */
function short(text: string, max = 150): string {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/**
 * Priority weights for the flagship pages we always want at the top of results
 * (requirement: high-value pages first). Keyed by exact href.
 */
const PRIORITY: Record<string, number> = {
  "/nri-wealth-checkup": 100,
  "/tools/fbar-fatca-checker": 95,
  "/tools/nri-tax-filing-roadmap": 92,
  "/tools/h1b-sponsor-finder": 90,
  "/trump-account-h1b-immigrant-families": 88,
  "/return-to-india-checklist": 86,
  "/calculators/401k-return-to-india": 84,
  "/immigration-tracker": 82,
  "/uscis": 80,
  "/india-tax-compliance": 78,
};

/** Map the toolCatalog's CatalogKind onto our SearchType badges. */
const KIND_TO_TYPE: Record<string, SearchType> = {
  Tool: "Tool",
  Calculator: "Calculator",
  Checklist: "Checklist",
  Hub: "Hub",
};

/**
 * Hand-curated hub pages and PDF lead magnets. These are real, existing routes
 * that either have no entry in a source catalog or deserve an explicit Hub/PDF
 * badge and elevated priority.
 */
const CURATED: SearchItem[] = [
  // ---- Flagship top-level pages ----------------------------------------
  {
    title: "Government Benefits for Immigrants",
    description:
      "Check which U.S. benefits your family may qualify for by immigration status, state, income and work history — with public charge and I-864 sponsor rules explained separately.",
    href: "/usa-government-benefits-immigrants",
    type: "Tool",
    priority: 82,
    keywords:
      "government benefits immigrants green card holders h1b visa holders public charge medicaid snap chip wic marketplace aca subsidy unemployment social security medicare ssi tanf fafsa tax credits mixed status families five year rule i-864 sponsor repayment food stamps welfare",
  },
  // ---- Hubs -------------------------------------------------------------
  {
    title: "Immigration Hub",
    description:
      "H-1B, green card, USCIS case status, visa bulletin and India priority dates in one place.",
    href: "/immigration",
    type: "Hub",
    priority: 76,
    keywords: "immigration hub h1b green card uscis visa bulletin",
  },
  {
    title: "USCIS Hub",
    description:
      "Case status, receipt numbers, processing times, forms and life-planning guides for USCIS applicants.",
    href: "/uscis",
    type: "Hub",
    priority: 80,
    keywords: "uscis hub case status receipt number processing times forms",
  },
  {
    title: "India Tax & Compliance Hub",
    description:
      "FBAR, FATCA, DTAA, ITR filing, TDS refunds, repatriation and Form 3520 for NRIs.",
    href: "/india-tax-compliance",
    type: "Hub",
    priority: 78,
    keywords:
      "india tax compliance hub fbar fatca dtaa itr tds repatriation form 3520",
  },
  {
    title: "NRI Wealth Hub",
    description:
      "India vs US investing, property, retirement and estate planning for long-term NRI wealth.",
    href: "/long-term-nri-wealth",
    type: "Hub",
    priority: 70,
    keywords: "nri wealth hub investing retirement estate property",
  },
  {
    title: "Return to India Hub",
    description:
      "401(k) decisions, RNOR tax status, currency timing and the full moving-back-to-India plan.",
    href: "/return-to-india",
    type: "Hub",
    priority: 72,
    keywords: "return to india hub 401k rnor currency moving back repatriation",
  },
  {
    title: "OCI Resource Center",
    description:
      "OCI card eligibility, documents, fees, timelines and step-by-step guides for the USA.",
    href: "/oci",
    type: "Hub",
    priority: 64,
    keywords: "oci card resource center eligibility fees timeline",
  },
  {
    title: "NRI Selling Property in India: TDS Guide",
    description:
      "TDS rates on NRI property sales, Form 13 lower-TDS certificate, US tax reporting and repatriation.",
    href: "/nri-selling-property-in-india-tds",
    type: "Guide",
    priority: 62,
    keywords:
      "nri selling property india tds sale form 13 lower tds certificate capital gains repatriation",
  },
  {
    title: "Gold Limit USA to India + Duty Calculator",
    description:
      "How much gold you can carry from the USA to India duty-free, customs duty rates, and a free calculator.",
    href: "/gold-limit-usa-to-india",
    type: "Calculator",
    priority: 62,
    keywords:
      "gold limit usa to india customs duty calculator carry jewellery coins bars baggage rules",
  },
  {
    title: "Invitation Letter for Parents to Visit USA",
    description:
      "Free B-2 invitation letter generator with PDF download, sample letter, and documents checklist.",
    href: "/invitation-letter-for-parents-to-visit-usa",
    type: "Tool",
    priority: 62,
    keywords:
      "invitation letter parents visit usa b2 visitor visa generator sample format pdf",
  },
  {
    title: "India Property for NRIs",
    description:
      "Buying, selling, renting and the capital-gains tax rules on Indian property from the USA.",
    href: "/india-property",
    type: "Hub",
    priority: 60,
    keywords: "india property nri capital gains sale rent tds",
  },
  {
    title: "Green Card Hub",
    description:
      "Green card categories, priority dates, the EB-2/EB-3 India wait and adjustment of status.",
    href: "/green-card",
    type: "Hub",
    priority: 66,
    keywords: "green card hub eb2 eb3 priority date adjustment of status",
  },
  {
    title: "H-1B Hub",
    description:
      "H-1B lottery, transfers, extensions, prevailing wage and layoff options for Indians.",
    href: "/h1b",
    type: "Hub",
    priority: 66,
    keywords: "h1b hub lottery transfer extension prevailing wage layoff",
  },
  {
    title: "All Tools & Calculators",
    description:
      "Browse every free NRI calculator, checklist and interactive tool in one index.",
    href: "/tools",
    type: "Hub",
    priority: 62,
    keywords: "all tools calculators index browse",
  },
  // ---- PDF lead magnets --------------------------------------------------
  {
    title: "Free Immigrant Wealth Guide (PDF)",
    description:
      "Deepak Middha's free PDF on the money traps that hold immigrants back — and how to start building U.S. wealth.",
    href: "/free-immigrant-wealth-guide",
    type: "PDF",
    priority: 68,
    keywords: "free immigrant wealth guide pdf download ebook lead magnet",
  },
  {
    title: "Return to India Checklist (PDF)",
    description:
      "Free downloadable checklist covering finances, taxes, accounts and logistics for moving back to India.",
    href: "/return-to-india-checklist",
    type: "PDF",
    priority: 86,
    keywords:
      "return to india checklist pdf download moving back relocation lead magnet",
  },
  // ---- Flagship top-level pages / glossary-style ------------------------
  {
    title: "Visa Bulletin Tracker",
    description:
      "Latest visa bulletin final action and filing dates for India, explained for EB-2 and EB-3.",
    href: "/visa-bulletin",
    type: "Guide",
    priority: 58,
    keywords: "visa bulletin final action dates filing eb2 eb3 india",
  },
  {
    title: "Indian Population in the USA",
    description:
      "How many Indians live in America — by state and city, income, students, H-1B and green card trends.",
    href: "/indian-population-in-usa",
    type: "Guide",
    priority: 40,
    keywords: "indian population usa state city demographics statistics",
  },
];

/** Assign a priority: explicit PRIORITY map wins, else the provided base. */
function weight(href: string, base = 0): number {
  return PRIORITY[href] ?? base;
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // 1. Tools / calculators / checklists / flagship hubs from the tool catalog.
  for (const c of toolCatalog) {
    const type = KIND_TO_TYPE[c.kind] ?? "Tool";
    items.push({
      title: c.title,
      description: short(c.description),
      href: c.href,
      type,
      priority: weight(c.href),
      keywords: `${c.categories.join(" ")} ${c.keywords}`.toLowerCase(),
    });
  }

  // 2. Editorial guides / articles.
  for (const a of articles) {
    items.push({
      title: a.title,
      description: short(a.excerpt),
      href: `/articles/${a.slug}`,
      type: "Article",
      priority: weight(`/articles/${a.slug}`),
      keywords: `${a.topic} ${a.slug}`.toLowerCase(),
    });
  }

  // 3. Topic clusters → Guide. Each entry has { title, excerpt, slug }.
  type ClusterPage = {
    slug: string;
    title: string;
    excerpt?: string;
    metaDescription?: string;
  };
  const clusters: { pages: ClusterPage[]; path: (slug: string) => string }[] = [
    { pages: itrPages, path: itrPath },
    { pages: tdsPages, path: tdsPath },
    { pages: repatPages, path: repatPath },
    { pages: giftPages, path: giftPath },
    { pages: clusterPages, path: clusterPath },
    { pages: ociGuides, path: ociGuidePath },
    { pages: uscisChildPages, path: (s) => `/uscis/${s}` },
    { pages: myuscisChildPages, path: (s) => `/uscis/${s}` },
    { pages: formsChildPages, path: (s) => `/uscis/forms/${s}` },
    { pages: lifePlanningChildPages, path: (s) => `/uscis/${s}` },
    { pages: h1bChildPages, path: (s) => `/h1b/${s}` },
    { pages: greenCardChildPages, path: (s) => `/green-card/${s}` },
    { pages: visaBulletinChildPages, path: (s) => `/visa-bulletin/${s}` },
  ];
  for (const { pages, path } of clusters) {
    for (const p of pages) {
      const href = path(p.slug);
      items.push({
        title: p.title,
        description: short(p.metaDescription ?? p.excerpt ?? ""),
        href,
        type: "Guide",
        priority: weight(href),
        keywords: p.slug.toLowerCase(),
      });
    }
  }

  // 4. Trump Account cluster (standalone top-level routes) → Guide.
  for (const l of trumpAccountClusterLinks) {
    items.push({
      title: l.label,
      description: short(l.desc),
      href: l.href,
      type: "Guide",
      priority: weight(l.href),
      keywords: "trump account child 1000 form 4547 immigrant family",
    });
  }

  // 4b. Life insurance cluster (standalone top-level routes) → Guide.
  for (const l of lifeInsuranceClusterLinks) {
    items.push({
      title: l.label,
      description: short(l.desc),
      href: l.href,
      type: "Guide",
      priority: weight(l.href),
      keywords: "life insurance term iul indexed universal life coverage protection nri h1b family",
    });
  }

  // 5. Curated hubs / PDFs / flagship pages.
  items.push(...CURATED);

  // De-duplicate by href, keeping the highest-priority (and thus best-badged)
  // entry — curated Hub/PDF entries win over an auto-generated duplicate.
  const byHref = new Map<string, SearchItem>();
  for (const item of items) {
    const existing = byHref.get(item.href);
    if (!existing || item.priority > existing.priority) {
      byHref.set(item.href, item);
    }
  }

  return Array.from(byHref.values()).sort((a, b) => b.priority - a.priority);
}

export const searchIndex: SearchItem[] = buildIndex();

/** Fast lookup of an index item by its href. */
const indexByHref = new Map(searchIndex.map((i) => [i.href, i]));

/**
 * The site's actual most-viewed pages (Google Analytics, last 30 days), in
 * descending traffic order. These back the "Most searched" default state of the
 * homepage search box so it reflects what real visitors land on. The two
 * site-level homepage titles are intentionally excluded (linking home → home is
 * pointless). Refresh this list when the analytics ranking shifts.
 */
const TOP_SEARCHED_HREFS: string[] = [
  "/calculators/rent-vs-buy-immigrant", // Rent vs. Buy Calculator for Visa Holders
  "/immigration-tracker", // NRI Immigration Tracker
  "/articles/what-happens-to-401k-leaving-usa", // Your 401(k) When You Move Back to India
  "/trump-account-h1b-immigrant-families", // Trump Accounts for H1B Visa Holders
  "/calculators/401k-return-to-india", // 401(k) Cash Out vs Keep Calculator
  "/articles/india-fd-vs-us-investments", // India FD vs US Investments for NRIs
  "/tools/green-card-tracker", // Green Card Wait Time Estimator
];

/** Most-viewed pages (from analytics), resolved to full search items in order. */
export const topSearched: SearchItem[] = TOP_SEARCHED_HREFS.map(
  (href) => indexByHref.get(href),
).filter((i): i is SearchItem => Boolean(i));

/** Lowercased haystack used for substring matching against a search item. */
export function searchItemHaystack(item: SearchItem): string {
  return `${item.title} ${item.description} ${item.type} ${item.keywords ?? ""}`.toLowerCase();
}

/**
 * Rank search results for a query. Empty query → the highest-priority items
 * (the curated high-value defaults). Otherwise substring match with a light
 * relevance boost for title/priority so flagship pages stay near the top.
 */
export function searchSite(query: string, limit = 10): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return searchIndex.filter((i) => i.priority > 0).slice(0, limit);
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = searchIndex
    .map((item) => {
      const hay = searchItemHaystack(item);
      const title = item.title.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (!hay.includes(term)) return null;
        if (title.includes(term)) score += 5;
        score += 1;
      }
      // Flagship / priority pages get a gentle lift so they lead the results.
      score += item.priority / 20;
      return { item, score };
    })
    .filter((x): x is { item: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.item);
}
