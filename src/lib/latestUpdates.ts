/**
 * Homepage "Latest updates and checks" feed.
 *
 * One read-only projection over every page that carries a REAL, hand-entered
 * date: articles, cluster guides, tools, calculators, and a short list of
 * standalone guides. Each page contributes up to three dates:
 *
 *   published   — first published            → label "New"
 *   updated     — content or rules changed    → label "Updated"
 *   lastChecked — figures re-verified against official sources, no content
 *                 change (data/page-checks.json via `npm run mark-checked`,
 *                 plus the calculators' existing `dataChecked`)
 *                                             → label "Numbers checked"
 *
 * HONESTY RULES (the reason this file exists):
 *  - Every date is read from the SAME field the page itself renders, so the
 *    homepage and the page can't disagree.
 *  - Nothing here may use `new Date()`, the build date or the deploy date. A
 *    page with no recorded date simply doesn't appear.
 *  - A check never counts as an update: it doesn't touch dateModified,
 *    sitemap <lastmod>, or any "Updated" stamp.
 *
 * Adding a page to a source catalog with a date surfaces it here
 * automatically. latestUpdates.test.ts guards the rules above.
 */

import { articles } from "@/lib/articles";
import { liveTools } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import { calculators } from "@/lib/calculators";
import { getCalculatorContent } from "@/lib/calculatorContent";
import { clusterPages, clusterPath } from "@/lib/passportCluster";
import { ociGuides, ociGuidePath } from "@/lib/ociGuides";
import { itrPages, itrPath } from "@/lib/itrCluster";
import { tdsPages, tdsPath } from "@/lib/tdsCluster";
import { repatPages, repatPath } from "@/lib/repatriationCluster";
import { giftPages, giftPath } from "@/lib/giftsCluster";
import { uscisChildPages } from "@/lib/uscisCluster";
import { myuscisChildPages } from "@/lib/myuscisCluster";
import { formsChildPages } from "@/lib/uscisFormsCluster";
import { lifePlanningChildPages } from "@/lib/uscisLifePlanningCluster";
import { h1bChildPages } from "@/lib/h1bCluster";
import { greenCardChildPages } from "@/lib/greenCardCluster";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { EXPEDITE_UPDATED } from "@/data/expediteData";
import { MARRIAGE_INTERVIEW_UPDATED } from "@/data/marriageInterviewData";
import { POE_PUBLISHED, POE_UPDATED } from "@/lib/portOfEntryCluster";
import { POE_VERIFIED } from "@/data/portOfEntryData";
import { IW_VERIFIED } from "@/data/interviewWaiverData";
import {
  VB_OCT_2026_PUBLISHED,
  VB_OCT_2026_UPDATED,
} from "@/lib/visaBulletinOctober2026";
import {
  PROJECTED_MONTHS,
  VB_PROJECTION_PUBLISHED,
} from "@/lib/visaBulletinProjections";
import { monthLabel, monthPath } from "@/lib/visaBulletinMonths";
import { O1_PUBLISHED, O1_UPDATED } from "@/data/o1VisaData";
import { L1_PUBLISHED, L1_UPDATED } from "@/data/l1VisaData";
import { A_NUMBER_PUBLISHED, A_NUMBER_UPDATED } from "@/data/aNumberData";
import { I94_PUBLISHED, I94_UPDATED } from "@/data/i94Data";
import {
  GC_TRAVEL_PUBLISHED,
  GC_TRAVEL_UPDATED,
} from "@/data/greenCardTravelData";
import { PAGE_CHECKS } from "@/lib/pageChecks";

export type PageKind = "article" | "guide" | "tool" | "calculator";
export type UpdateLabel = "New" | "Updated" | "Numbers checked";

export interface PageDates {
  path: string;
  title: string;
  kind: PageKind;
  published?: string;
  updated?: string;
  /** Latest of the page's own check stamp and data/page-checks.json. */
  lastChecked?: string;
}

export interface UpdateRow {
  path: string;
  title: string;
  kind: PageKind;
  date: string;
  label: UpdateLabel;
}

const latest = (...ds: (string | undefined)[]): string | undefined =>
  ds.filter((d): d is string => !!d).sort().pop();

/** Shape shared by every cluster catalog entry. */
type Dated = { slug: string; title: string; date: string; updated?: string };
const guides = (pages: readonly Dated[], path: (slug: string) => string) =>
  pages.map(
    (p): Omit<PageDates, "lastChecked"> => ({
      path: path(p.slug),
      title: p.title,
      kind: "guide",
      published: p.date,
      // Templates render `updated ?? date`; an absent `updated` is not a change.
      updated: p.updated,
    }),
  );

/**
 * Standalone guides that keep their dates in an exported constant the page
 * itself renders. Only add a page here after confirming that — a date the
 * page doesn't show would break the "never disagree" rule.
 */
const STANDALONE: Omit<PageDates, "lastChecked">[] = [
  {
    path: "/visa-bulletin/october-2026",
    title: "October 2026 Visa Bulletin: EB-2 India Reopens at Nov 1, 2013",
    kind: "guide",
    published: VB_OCT_2026_PUBLISHED,
    updated: VB_OCT_2026_UPDATED,
  },
  {
    path: "/uscis/expedite-request",
    title: "USCIS Expedite Request: The 5 Criteria, and When to Use Premium Instead",
    kind: "guide",
    // The page's schema declares datePublished = this same constant.
    published: EXPEDITE_UPDATED,
    updated: EXPEDITE_UPDATED,
  },
  {
    path: "/green-card/marriage-interview-questions",
    title: "Marriage Green Card Interview Questions: Practise as a Couple",
    kind: "guide",
    // The page's schema declares datePublished = this same constant.
    published: MARRIAGE_INTERVIEW_UPDATED,
    updated: MARRIAGE_INTERVIEW_UPDATED,
  },
  {
    path: "/h1b-denied-entry-airport",
    title: "H-1B Denied Entry at the Airport",
    kind: "guide",
    published: POE_PUBLISHED,
    updated: POE_UPDATED,
  },
  {
    path: "/automatic-visa-revalidation",
    title: "Automatic Visa Revalidation",
    kind: "guide",
    published: POE_PUBLISHED,
    updated: POE_UPDATED,
  },
  {
    path: "/visa-interview-waiver",
    title: "Visa Interview Waiver (Dropbox)",
    kind: "guide",
    published: POE_PUBLISHED,
    updated: POE_UPDATED,
  },
  // October 2026 immigration cluster. Each page renders the same constant as
  // its ReviewedByline date, so the homepage and the page cannot disagree.
  {
    path: "/o1-visa",
    title: "O-1 Visa: Three Standards, Eight Criteria, No Lottery",
    kind: "guide",
    published: O1_PUBLISHED,
    updated: O1_UPDATED,
  },
  {
    path: "/l1-visa",
    title: "L-1 Visa: One Year Abroad, and a Clock Your H-1B Already Started",
    kind: "guide",
    published: L1_PUBLISHED,
    updated: L1_UPDATED,
  },
  {
    path: "/uscis/a-number",
    title: "Your A-Number, and the Six Numbers It Is Not",
    kind: "guide",
    published: A_NUMBER_PUBLISHED,
    updated: A_NUMBER_UPDATED,
  },
  {
    path: "/uscis/i-94",
    title: "Your I-94, and the Four Things the Travel History Leaves Out",
    kind: "guide",
    published: I94_PUBLISHED,
    updated: I94_UPDATED,
  },
  {
    path: "/green-card/travel-rules",
    title: "Green Card Travel Rules & ICE Detention Tracker",
    kind: "guide",
    published: GC_TRAVEL_PUBLISHED,
    updated: GC_TRAVEL_UPDATED,
  },
  // Projected bulletin months. The title carries the status, so a feed row
  // cannot read as though the bulletin had been published. The date is the
  // projection's own committed constant — never a clock, which
  // latestUpdates.test.ts enforces site-wide.
  ...PROJECTED_MONTHS.map((m) => ({
    path: monthPath(m),
    title: `${monthLabel(m)} Visa Bulletin — projection`,
    kind: "guide" as const,
    published: VB_PROJECTION_PUBLISHED,
    updated: VB_PROJECTION_PUBLISHED,
  })),
];

/**
 * Check stamps a page ALREADY renders as "Last verified" (OfficialSourceNote),
 * folded in so the homepage reflects them too.
 */
const OWN_CHECK_STAMPS: Record<string, string> = {
  "/h1b-denied-entry-airport": POE_VERIFIED,
  "/automatic-visa-revalidation": POE_VERIFIED,
  "/visa-interview-waiver": IW_VERIFIED,
};

function buildCatalog(): PageDates[] {
  const base: (Omit<PageDates, "lastChecked"> & { ownCheck?: string })[] = [
    ...articles.map((a) => ({
      path: `/articles/${a.slug}`,
      title: a.title,
      kind: "article" as const,
      published: a.date,
      updated: a.updated,
    })),
    ...guides(clusterPages, clusterPath),
    ...guides(ociGuides, ociGuidePath),
    ...guides(itrPages, itrPath),
    ...guides(tdsPages, tdsPath),
    ...guides(repatPages, repatPath),
    ...guides(giftPages, giftPath),
    // /uscis/receipt-number has its own route and dates; skip the duplicate
    // (same exclusion as sitemap-data.ts).
    ...guides(
      uscisChildPages.filter((p) => p.slug !== "receipt-number"),
      (s) => `/uscis/${s}`,
    ),
    ...guides(myuscisChildPages, (s) => `/uscis/${s}`),
    ...guides(formsChildPages, (s) => `/uscis/forms/${s}`),
    ...guides(lifePlanningChildPages, (s) => `/uscis/${s}`),
    ...guides(h1bChildPages, (s) => `/h1b/${s}`),
    ...guides(greenCardChildPages, (s) => `/green-card/${s}`),
    ...guides(visaBulletinChildPages, (s) => `/visa-bulletin/${s}`),
    ...STANDALONE,
    ...liveTools.map((t) => ({
      path: `/tools/${t.slug}`,
      title: t.title,
      kind: "tool" as const,
      // Tool pages have no publish date. The hub `updated` drives the
      // byline on rebuilt hubs; otherwise the catalog's own `updated`.
      updated: getToolHubContent(t.slug)?.updated ?? t.updated,
    })),
    ...calculators.map((c) => ({
      path: `/calculators/${c.slug}`,
      title: c.title,
      kind: "calculator" as const,
      updated: getCalculatorContent(c.slug)?.updated,
      ownCheck: c.dataChecked,
    })),
  ];

  return base.map(({ ownCheck, ...p }) => ({
    ...p,
    lastChecked: latest(ownCheck, OWN_CHECK_STAMPS[p.path], PAGE_CHECKS[p.path]),
  }));
}

let cache: PageDates[] | undefined;
/** Every page with at least one recorded date. */
export function pageDatesCatalog(): PageDates[] {
  return (cache ??= buildCatalog());
}

/** Merged dates for one path, or undefined if the page isn't in the feed. */
export function getPageDates(path: string): PageDates | undefined {
  return pageDatesCatalog().find((p) => p.path === path);
}

/**
 * The page's most recent real date and what it was. Ties resolve towards the
 * stronger claim: a content update also re-checks the numbers, and a page
 * updated on the day it was published is simply new.
 */
export function rowFor(p: PageDates): UpdateRow | undefined {
  const date = latest(p.published, p.updated, p.lastChecked);
  if (!date) return undefined;
  const changed = latest(p.published, p.updated);
  let label: UpdateLabel;
  if (!changed || p.lastChecked! > changed) label = "Numbers checked";
  else if (p.published && p.published === date) label = "New";
  else label = "Updated";
  return { path: p.path, title: p.title, kind: p.kind, date, label };
}

/** The n most recent rows across every page type. Stable: ties sort by path. */
export function getLatestUpdates(n = 8): UpdateRow[] {
  return pageDatesCatalog()
    .map(rowFor)
    .filter((r): r is UpdateRow => !!r)
    .sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path))
    .slice(0, n);
}

/** Most recent numbers check recorded on any page, if any. */
export function getLastSiteWideCheck(): string | undefined {
  return latest(...pageDatesCatalog().map((p) => p.lastChecked));
}
