/**
 * Single source of truth for every canonical, indexable URL on the site,
 * grouped into the segments that back the split sitemap:
 *
 *   /sitemap.xml             → sitemap index (links to the five below)
 *   /sitemap-pages.xml       → home, hubs, legal, topic landing pages
 *   /sitemap-tools.xml       → calculators + interactive tools
 *   /sitemap-articles.xml    → editorial guides (/articles/*)
 *   /sitemap-tax.xml         → India tax & NRI wealth clusters
 *   /sitemap-immigration.xml → USCIS / H-1B / green card / visa bulletin / passport
 *
 * Every entry is a 200-status, self-canonical, indexable URL on
 * https://www.nritousa.com. Redirect routes (/privacy, /terms-of-use,
 * /topics/money-transfer, /articles/indian-passport-renewal-usa,
 * /tools/nri-global-wealth-tax-organizer), noindex app states
 * (/nri-wealth-checkup/{income,assets,dashboard,profile,report}), API routes,
 * and author pages are deliberately excluded — see /seo-indexing-audit.md.
 */
import { topics } from "@/lib/topics";
import { articles } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import { tools } from "@/lib/tools";
import { eduCalcs } from "@/lib/education";
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
import { site } from "@/lib/site";

export interface SitemapEntry {
  /** Root-relative path (e.g. "/tools/fbar-fatca-checker"). */
  path: string;
  /** Last meaningful content change. */
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

/** Build date for evergreen pages that don't carry their own updated stamp. */
const now = new Date();

const e = (
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "monthly",
  lastModified: Date = now,
): SitemapEntry => ({ path, priority, changeFrequency, lastModified });

const clusterDate = (p: { updated?: string; date: string }) =>
  new Date(p.updated ?? p.date);

/* ------------------------------------------------------------------ *
 * 1. Pages — home, hubs, topic landing pages, legal
 * ------------------------------------------------------------------ */
export const pagesEntries: SitemapEntry[] = [
  e("/", 1, "weekly"),
  e("/topics", 0.9, "weekly"),
  e("/tools", 0.9, "weekly"),
  e("/calculators", 0.8, "monthly"),
  e("/education", 0.9, "weekly"),
  e("/education/articles", 0.8, "weekly"),
  e("/resources", 0.7, "monthly"),
  e("/free-immigrant-wealth-guide", 0.8, "monthly"),
  e("/indian-population-in-usa", 0.8, "monthly"),
  e("/indian-population-in-california", 0.6, "monthly"),
  e("/indian-population-in-texas", 0.6, "monthly"),
  e("/indian-population-in-new-jersey", 0.6, "monthly"),
  e("/indian-population-in-new-york", 0.6, "monthly"),
  e("/indian-population-in-illinois", 0.6, "monthly"),
  e("/indian-population-in-washington", 0.6, "monthly"),
  e("/indian-population-in-georgia", 0.6, "monthly"),
  e("/indian-population-in-florida", 0.6, "monthly"),
  e("/indian-population-in-virginia", 0.6, "monthly"),
  e("/indian-population-in-maryland", 0.6, "monthly"),
  e("/indian-population-in-massachusetts", 0.6, "monthly"),
  e("/about", 0.5, "monthly"),
  e("/about-deepak", 0.5, "monthly"),
  e("/contact", 0.5, "yearly"),
  e("/contributors", 0.5, "monthly"),
  e("/contribute", 0.5, "monthly"),
  e("/partnerships", 0.5, "monthly"),
  e("/privacy-policy", 0.3, "yearly"),
  e("/terms-and-conditions", 0.3, "yearly"),
  e("/disclaimer", 0.3, "yearly"),
  e("/cookie-policy", 0.3, "yearly"),
  ...topics.map((t) => e(`/topics/${t.slug}`, 0.8, "weekly")),
];

/* ------------------------------------------------------------------ *
 * 2. Tools — interactive tools + calculators
 * ------------------------------------------------------------------ */
export const toolsEntries: SitemapEntry[] = [
  ...tools.map((t) =>
    e(`/tools/${t.slug}`, t.status === "live" ? 0.8 : 0.4, "monthly"),
  ),
  ...calculators.map((c) => e(`/calculators/${c.slug}`, 0.8, "monthly")),
  ...eduCalcs.map((c) => e(`/education/${c.slug}`, 0.8, "monthly")),
];

/* ------------------------------------------------------------------ *
 * 3. Articles — editorial guides
 * ------------------------------------------------------------------ */
export const articlesEntries: SitemapEntry[] = articles.map((a) =>
  e(`/articles/${a.slug}`, 0.7, "monthly", new Date(a.updated ?? a.date)),
);

/* ------------------------------------------------------------------ *
 * 4. Tax & wealth — India tax compliance + NRI wealth clusters
 * ------------------------------------------------------------------ */
export const taxEntries: SitemapEntry[] = [
  e("/long-term-nri-wealth", 0.9, "weekly"),
  e("/india-tax-compliance", 0.9, "weekly"),
  e("/india-tax-compliance/nri-tax-forms-limits", 0.9, "weekly"),
  e("/nri-wealth-checkup", 0.9, "weekly"),
  e("/india-property", 0.8, "weekly"),
  e("/return-to-india", 0.8, "weekly"),
  e("/nri-estate-planning", 0.8, "weekly"),
  e("/send-money-to-india", 0.8, "weekly"),
  ...itrPages.map((p) =>
    e(itrPath(p.slug), p.kind === "pillar" ? 0.9 : 0.7, "monthly", clusterDate(p)),
  ),
  ...tdsPages.map((p) =>
    e(tdsPath(p.slug), p.kind === "pillar" ? 0.9 : 0.7, "monthly", clusterDate(p)),
  ),
  ...repatPages.map((p) =>
    e(repatPath(p.slug), p.kind === "pillar" ? 0.9 : 0.7, "monthly", clusterDate(p)),
  ),
  ...giftPages.map((p) =>
    e(giftPath(p.slug), p.kind === "pillar" ? 0.9 : 0.7, "monthly", clusterDate(p)),
  ),
];

/* ------------------------------------------------------------------ *
 * 5. Immigration — USCIS / H-1B / green card / visa bulletin / passport
 * ------------------------------------------------------------------ */
const immDate = new Date("2026-06-16");
export const immigrationEntries: SitemapEntry[] = [
  e("/immigration", 0.9, "weekly"),
  e("/uscis", 0.9, "weekly", immDate),
  e("/uscis/case-status", 0.9, "weekly", immDate),
  e("/uscis/myuscis-account", 0.85, "monthly", immDate),
  e("/uscis/forms", 0.9, "monthly", immDate),
  e("/uscis/life-planning", 0.9, "monthly", immDate),
  e("/uscis/receipt-number", 0.9, "weekly", immDate),
  e("/uscis/processing-times", 0.9, "weekly", immDate),
  e("/h1b", 0.9, "weekly", immDate),
  e("/h1b-layoff", 0.85, "monthly", immDate),
  // PERM processing-time cluster (top-level tool + supporting pages).
  e("/perm-processing-time-calculator", 0.9, "monthly"),
  e("/dol-processing-times", 0.85, "monthly"),
  e("/pwd-processing-time", 0.8, "monthly"),
  e("/perm-timeline", 0.8, "monthly"),
  e("/h1b-perm-max-out-calculator", 0.85, "monthly"),
  e("/eb2-eb3-priority-date-india", 0.8, "monthly"),
  // Prevailing-wage cluster.
  e("/prevailing-wage-calculator", 0.9, "monthly"),
  e("/dol-wage-levels-explained", 0.8, "monthly"),
  e("/h1b-prevailing-wage", 0.8, "monthly"),
  // I-140 cluster.
  e("/i140-processing-time", 0.9, "monthly"),
  e("/i140-premium-processing", 0.85, "monthly"),
  e("/i140-approved-what-next", 0.8, "monthly"),
  // EAD / Advance Parole cluster.
  e("/ead-processing-time", 0.9, "monthly"),
  e("/advance-parole-processing-time", 0.85, "monthly"),
  e("/ead-renewal-gap", 0.8, "monthly"),
  // I-485 / Adjustment of Status cluster.
  e("/i485-processing-time", 0.9, "monthly"),
  e("/i485-timeline", 0.85, "monthly"),
  e("/i485-documents-checklist", 0.8, "monthly"),
  // Green Card Renewal / Form I-90 cluster.
  e("/green-card-renewal", 0.9, "monthly"),
  e("/green-card-renewal-processing-time", 0.85, "monthly"),
  e("/renew-green-card-online", 0.85, "monthly"),
  e("/green-card-renewal-fee", 0.85, "monthly"),
  e("/replace-green-card", 0.85, "monthly"),
  e("/i90-vs-i751", 0.8, "monthly"),
  e("/expired-green-card", 0.8, "monthly"),
  // Trump Account (immigrant-family) cluster.
  e("/trump-account-h1b-immigrant-families", 0.9, "monthly"),
  e("/can-h1b-parents-open-trump-account-for-child", 0.85, "monthly"),
  e("/trump-account-1000-eligibility", 0.85, "monthly"),
  e("/how-to-apply-for-trump-account-form-4547", 0.85, "monthly"),
  e("/trump-account-tax-rules-immigrants", 0.8, "monthly"),
  e("/trump-account-moving-back-to-india", 0.8, "monthly"),
  e("/trump-account-vs-529-for-h1b-families", 0.8, "monthly"),
  e("/trump-account-ssn-itin-child", 0.8, "monthly"),
  // NVC (National Visa Center / consular processing) cluster.
  e("/nvc-case-status", 0.9, "monthly"),
  e("/what-is-nvc-case-number", 0.8, "monthly"),
  e("/nvc-processing-time", 0.85, "monthly"),
  e("/nvc-document-checklist-india", 0.8, "monthly"),
  e("/nvc-public-inquiry", 0.8, "monthly"),
  e("/green-card", 0.9, "weekly", immDate),
  e("/visa-bulletin", 0.9, "monthly", immDate),
  e("/immigration-tracker", 0.8, "weekly"),
  e("/oci", 0.9, "weekly"),
  ...ociGuides.map((g) => e(ociGuidePath(g.slug), 0.8, "monthly")),
  // India Visa from USA cluster (hub + 7 supporting intent pages).
  e("/india-visa-from-usa", 0.9, "monthly"),
  e("/india-evisa-for-us-citizens", 0.85, "monthly"),
  e("/india-tourist-visa-from-usa", 0.85, "monthly"),
  e("/india-business-visa-from-usa", 0.85, "monthly"),
  e("/entry-visa-india-from-usa", 0.8, "monthly"),
  e("/india-visa-fees-usa", 0.85, "monthly"),
  e("/india-visa-processing-time-usa", 0.85, "monthly"),
  e("/oci-vs-india-visa", 0.85, "monthly"),
  e("/community/nri-uscis-decisions", 0.7, "weekly", immDate),
  ...clusterPages.map((p) =>
    e(clusterPath(p.slug), p.kind === "hub" ? 0.9 : 0.7, "monthly", clusterDate(p)),
  ),
  // /uscis/receipt-number has its own dedicated entry above; skip the cluster
  // duplicate so each URL appears exactly once.
  ...uscisChildPages
    .filter((p) => p.slug !== "receipt-number")
    .map((p) => e(`/uscis/${p.slug}`, 0.8, "monthly", clusterDate(p))),
  ...myuscisChildPages.map((p) =>
    e(`/uscis/${p.slug}`, 0.8, "monthly", clusterDate(p)),
  ),
  ...formsChildPages.map((p) =>
    e(`/uscis/forms/${p.slug}`, 0.8, "monthly", clusterDate(p)),
  ),
  ...lifePlanningChildPages.map((p) =>
    e(`/uscis/${p.slug}`, 0.85, "monthly", clusterDate(p)),
  ),
  ...h1bChildPages.map((p) =>
    e(`/h1b/${p.slug}`, 0.8, "monthly", clusterDate(p)),
  ),
  ...greenCardChildPages.map((p) =>
    e(`/green-card/${p.slug}`, 0.8, "monthly", clusterDate(p)),
  ),
  ...visaBulletinChildPages.map((p) =>
    e(`/visa-bulletin/${p.slug}`, 0.8, "monthly", clusterDate(p)),
  ),
];

/** The five child sitemaps, in the order they appear in the index. */
export const sitemapSegments = [
  { name: "sitemap-pages.xml", entries: pagesEntries },
  { name: "sitemap-tools.xml", entries: toolsEntries },
  { name: "sitemap-articles.xml", entries: articlesEntries },
  { name: "sitemap-tax.xml", entries: taxEntries },
  { name: "sitemap-immigration.xml", entries: immigrationEntries },
] as const;

/* ------------------------------------------------------------------ *
 * XML serialization
 * ------------------------------------------------------------------ */

const abs = (path: string) => `${site.url}${path}`;
const iso = (d: Date) => d.toISOString();

/** Serialize a list of entries into a <urlset> sitemap document. */
export function urlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${abs(u.path)}</loc>\n` +
        `    <lastmod>${iso(u.lastModified)}</lastmod>\n` +
        `    <changefreq>${u.changeFrequency}</changefreq>\n` +
        `    <priority>${u.priority.toFixed(1)}</priority>\n` +
        `  </url>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
}

/** Serialize the sitemap index that points at the five segment sitemaps. */
export function sitemapIndexXml(): string {
  // The newest lastmod inside each segment becomes that segment's <lastmod>.
  const items = sitemapSegments
    .map(({ name, entries }) => {
      const latest = entries.reduce(
        (max, x) => (x.lastModified > max ? x.lastModified : max),
        new Date(0),
      );
      return (
        `  <sitemap>\n` +
        `    <loc>${abs("/" + name)}</loc>\n` +
        `    <lastmod>${iso(latest)}</lastmod>\n` +
        `  </sitemap>`
      );
    })
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${items}\n` +
    `</sitemapindex>\n`
  );
}
