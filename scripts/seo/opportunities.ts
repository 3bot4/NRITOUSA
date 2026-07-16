/**
 * Opportunity scoring over normalized Search Console data.
 *
 * Run:
 *   npm run seo:gsc-import -- --dir ./seo-data/gsc/2026-07-16
 *   npm run seo:opportunities
 *
 * Reads reports/gsc-normalized.json (never the raw CSVs) and joins it against
 * the route inventory, so a page's internal-link support and sitemap status
 * inform its score alongside its traffic.
 *
 * Writes reports/seo-opportunities.{json,csv,md}.
 *
 * SCORING PHILOSOPHY
 * ------------------
 * Volume alone is the wrong ranking. A page at position 8 with 200 impressions
 * is worth more work than one at position 60 with 2,000, because position 8 is
 * reachable and position 60 is a different project. So the score multiplies:
 *
 *   reach     — log-scaled impressions (diminishing returns, never zero-blind)
 *   proximity — how close position already is to page one
 *   headroom  — how far CTR sits below what that position normally earns
 *   intent    — business value of the cluster (a tax tool beats a trivia page)
 *
 * Every factor is 0..1 and the weights are declared in WEIGHTS below, so a
 * reader can see exactly why a page ranks where it does — no black box.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, buildInventory } from "./lib/inventory";
import type { Delta } from "./lib/gsc";

/* ------------------------------------------------------------------ *
 * Expected CTR by position
 *
 * Used only to measure a page against ITSELF — "this page earns far less than
 * pages at its own rank normally do" — not to forecast traffic. Values are a
 * conservative, widely-reported desktop+mobile blend; they are deliberately
 * approximate and only ever compared relatively.
 * ------------------------------------------------------------------ */
const EXPECTED_CTR: Record<number, number> = {
  1: 0.27, 2: 0.155, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.048, 7: 0.04, 8: 0.033, 9: 0.028, 10: 0.025,
};

export function expectedCtr(position: number | null): number | null {
  if (position == null) return null;
  const p = Math.round(position);
  if (p <= 0) return null;
  if (p <= 10) return EXPECTED_CTR[p];
  // Beyond page one, CTR decays fast and is dominated by noise. A small floor
  // keeps the ratio meaningful without pretending we can model page 4.
  if (p <= 20) return 0.012;
  if (p <= 30) return 0.006;
  return 0.002;
}

/* ------------------------------------------------------------------ *
 * Business intent
 *
 * Editorial judgement, stated explicitly rather than hidden in a heuristic.
 * Keyed by route prefix; first match wins, longest prefix first.
 * ------------------------------------------------------------------ */
const INTENT: { prefix: string; weight: number; cluster: string }[] = [
  { prefix: "/trump-account", weight: 1.0, cluster: "Trump Account" },
  { prefix: "/nri-wealth-checkup", weight: 1.0, cluster: "Wealth checkup" },
  { prefix: "/india-tax-compliance", weight: 0.95, cluster: "India tax" },
  { prefix: "/tools/fbar-fatca-checker", weight: 0.95, cluster: "FBAR/FATCA" },
  { prefix: "/return-to-india", weight: 0.9, cluster: "Return to India" },
  { prefix: "/india-investments", weight: 0.9, cluster: "India investments" },
  { prefix: "/h1b-lottery", weight: 0.9, cluster: "H-1B lottery" },
  { prefix: "/indian-passport-renewal-usa", weight: 0.85, cluster: "Passport" },
  { prefix: "/calculators", weight: 0.85, cluster: "Calculator" },
  { prefix: "/tools", weight: 0.85, cluster: "Tool" },
  { prefix: "/green-card", weight: 0.8, cluster: "Green card" },
  { prefix: "/h1b", weight: 0.8, cluster: "H-1B" },
  { prefix: "/uscis", weight: 0.75, cluster: "USCIS" },
  { prefix: "/visa-bulletin", weight: 0.75, cluster: "Visa bulletin" },
  { prefix: "/oci", weight: 0.7, cluster: "OCI" },
  { prefix: "/education", weight: 0.6, cluster: "Education" },
  { prefix: "/articles", weight: 0.6, cluster: "Article" },
  { prefix: "/success-stories", weight: 0.5, cluster: "Success stories" },
  { prefix: "/indian-population", weight: 0.35, cluster: "Population data" },
  { prefix: "/topics", weight: 0.4, cluster: "Topic index" },
].sort((a, b) => b.prefix.length - a.prefix.length);

function intentOf(route: string): { weight: number; cluster: string } {
  for (const i of INTENT) {
    if (route === i.prefix || route.startsWith(i.prefix + "/")) {
      return { weight: i.weight, cluster: i.cluster };
    }
  }
  return route === "/"
    ? { weight: 0.8, cluster: "Home" }
    : { weight: 0.5, cluster: "Other" };
}

/* ------------------------------------------------------------------ *
 * Categories (Phase 3 A–G)
 * ------------------------------------------------------------------ */
export type Category =
  | "near-winner"
  | "striking-distance"
  | "high-impression-low-ctr"
  | "declining"
  | "indexing-opportunity"
  | "consolidation-candidate"
  | "low-signal";

const WEIGHTS = { reach: 0.35, proximity: 0.3, headroom: 0.25, intent: 0.1 };

export interface PageStat {
  key: string;
  clicks: Delta;
  impressions: Delta;
  ctr: number | null;
  position: number | null;
  previousPosition: number | null;
}

export interface Opportunity {
  route: string;
  cluster: string;
  categories: Category[];
  score: number;
  clicks: number;
  clicksChange: number | null;
  impressions: number;
  impressionsChange: number | null;
  ctr: number | null;
  expectedCtr: number | null;
  ctrGap: number | null;
  position: number | null;
  positionChange: number | null;
  inSitemap: boolean;
  inboundLinks: number | null;
  factors: { reach: number; proximity: number; headroom: number; intent: number };
  why: string;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function scorePage(
  p: PageStat,
  ctx: { inSitemap: boolean; inboundLinks: number | null },
): Opportunity {
  const { weight: intentWeight, cluster } = intentOf(p.key);

  // log10 so 10→0.25, 100→0.5, 1000→0.75, 10k→1. Impressions are heavy-tailed;
  // a linear scale would let one page drown out every other opportunity.
  const reach = clamp01(Math.log10(Math.max(1, p.impressions.current)) / 4);

  // 1.0 at position 1, ~0.5 at 10, ~0 beyond 30. Below page one there is no
  // "nearly there" to exploit.
  const proximity =
    p.position == null ? 0.15 : clamp01(1 - (p.position - 1) / 30);

  const exp = expectedCtr(p.position);
  const ctrGap = exp != null && p.ctr != null ? exp - p.ctr : null;
  // Only UNDER-performance is headroom; a page beating its rank has none.
  const headroom = ctrGap != null && exp ? clamp01(ctrGap / exp) : 0;

  const score =
    100 *
    (WEIGHTS.reach * reach +
      WEIGHTS.proximity * proximity +
      WEIGHTS.headroom * headroom +
      WEIGHTS.intent * intentWeight);

  const categories: Category[] = [];
  const pos = p.position;
  const impr = p.impressions.current;

  if (pos != null && pos >= 4 && pos <= 15 && impr >= 50) categories.push("near-winner");
  if (pos != null && pos > 15 && pos <= 30 && impr >= 50) categories.push("striking-distance");
  if (impr >= 100 && (p.ctr ?? 0) < 0.01) categories.push("high-impression-low-ctr");
  if ((p.clicks.change ?? 0) < 0 || (p.impressions.change ?? 0) < -impr * 0.2) {
    categories.push("declining");
  }
  if (impr > 0 && impr < 10 && p.clicks.current === 0) categories.push("low-signal");
  if (!ctx.inSitemap) categories.push("indexing-opportunity");

  const why: string[] = [];
  if (categories.includes("high-impression-low-ctr")) {
    why.push(
      `${impr} impressions but ${((p.ctr ?? 0) * 100).toFixed(2)}% CTR` +
        (exp ? ` vs ~${(exp * 100).toFixed(1)}% typical at position ${pos?.toFixed(1)}` : ""),
    );
  }
  if (categories.includes("near-winner")) why.push(`position ${pos?.toFixed(1)} — page one is reachable`);
  if (categories.includes("striking-distance")) why.push(`position ${pos?.toFixed(1)} — needs content + links`);
  if (categories.includes("declining")) why.push(`clicks ${p.clicks.change}, impressions ${p.impressions.change}`);
  if (!ctx.inSitemap) why.push("not in any sitemap");
  if (ctx.inboundLinks === 0) why.push("orphan: no internal links");

  return {
    route: p.key,
    cluster,
    categories,
    score: Math.round(score * 10) / 10,
    clicks: p.clicks.current,
    clicksChange: p.clicks.change,
    impressions: impr,
    impressionsChange: p.impressions.change,
    ctr: p.ctr,
    expectedCtr: exp,
    ctrGap,
    position: pos,
    positionChange:
      p.previousPosition != null && pos != null ? p.previousPosition - pos : null,
    inSitemap: ctx.inSitemap,
    inboundLinks: ctx.inboundLinks,
    factors: {
      reach: +reach.toFixed(3),
      proximity: +proximity.toFixed(3),
      headroom: +headroom.toFixed(3),
      intent: intentWeight,
    },
    why: why.join("; ") || "no strong signal",
  };
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

const NORMALIZED = join(REPO_ROOT, "reports", "gsc-normalized.json");

if (!existsSync(NORMALIZED)) {
  console.error(
    "\n✗ reports/gsc-normalized.json not found.\n\n" +
      "Opportunity scoring is driven by REAL Search Console data — it will not\n" +
      "invent query or position numbers. Export the Performance report from\n" +
      "Search Console (Export → CSV), unzip it, then:\n\n" +
      "  npm run seo:gsc-import -- --dir ./seo-data/gsc/YYYY-MM-DD\n" +
      "  npm run seo:opportunities\n",
  );
  process.exit(1);
}

const gsc = JSON.parse(readFileSync(NORMALIZED, "utf8")) as {
  pages: PageStat[];
  totals: { clicks: number; impressions: number };
};

const inv = buildInventory();
const sitemapPaths = new Set(inv.sitemapPaths);

/**
 * Every route the repo can actually serve — static routes, sitemap URLs (which
 * cover the dynamic clusters), and redirect sources.
 *
 * Search Console reports the URL it saw, which is not necessarily a URL we
 * still serve. A reported page matching nothing here is either a real 404
 * accumulating impressions or a transcription error in a hand-copied baseline,
 * and both must surface loudly: silently scoring an unknown URL invites
 * "fixing" it by adding a 404 to the sitemap.
 */
const knownRoutes = new Set<string>([
  ...inv.routes.filter((r) => r.routeType !== "sitemap-only").map((r) => r.route),
  ...inv.sitemapPaths,
]);
const dynamicPrefixes = inv.routes
  .filter((r) => r.routeType === "dynamic")
  .map((r) => r.route.slice(0, r.route.indexOf("/[")))
  .filter(Boolean);

const isKnown = (route: string) =>
  knownRoutes.has(route) ||
  dynamicPrefixes.some((p) => route.startsWith(p + "/"));

const unknown = gsc.pages.map((p) => p.key).filter((k) => !isKnown(k));

// Inbound internal links come from the rendered build when it is available;
// absent a build the field stays null rather than defaulting to 0, which would
// mislabel every page an orphan.
let inbound: Map<string, number> | null = null;
try {
  const { loadRendered } = await import("./lib/rendered");
  const counts = new Map<string, number>();
  for (const p of loadRendered()) {
    for (const href of p.internalLinks) {
      if (href !== p.route) counts.set(href, (counts.get(href) ?? 0) + 1);
    }
  }
  inbound = counts;
} catch {
  console.log("(no build output — inbound link counts omitted; run `next build` for them)");
}

const opportunities = gsc.pages
  .map((p) =>
    scorePage(p, {
      inSitemap: sitemapPaths.has(p.key),
      inboundLinks: inbound ? (inbound.get(p.key) ?? 0) : null,
    }),
  )
  .sort((a, b) => b.score - a.score);

const REPORTS = join(REPO_ROOT, "reports");
mkdirSync(REPORTS, { recursive: true });

writeFileSync(
  join(REPORTS, "seo-opportunities.json"),
  JSON.stringify(
    { generatedAt: new Date().toISOString(), weights: WEIGHTS, totals: gsc.totals, opportunities },
    null,
    2,
  ) + "\n",
);

const cols = [
  "route", "cluster", "score", "categories", "clicks", "impressions",
  "ctr", "expectedCtr", "position", "inSitemap", "inboundLinks", "why",
];
const cell = (v: unknown) => {
  const s = Array.isArray(v) ? v.join(" ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
writeFileSync(
  join(REPORTS, "seo-opportunities.csv"),
  [cols.join(","), ...opportunities.map((o) =>
    cols.map((c) => cell((o as unknown as Record<string, unknown>)[c])).join(","),
  )].join("\n") + "\n",
);

const pct = (n: number | null) => (n == null ? "—" : `${(n * 100).toFixed(2)}%`);
const byCat = (c: Category) => opportunities.filter((o) => o.categories.includes(c));

const md = [
  "# SEO opportunities",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)} from \`reports/gsc-normalized.json\`.`,
  `Baseline: **${gsc.totals.clicks} clicks**, **${gsc.totals.impressions} impressions**.`,
  "",
  "Score = " +
    Object.entries(WEIGHTS).map(([k, v]) => `${v}·${k}`).join(" + ") +
    ", each factor 0–1. See scripts/seo/opportunities.ts for the definitions.",
  "",
  "## Top 25",
  "",
  "| # | Page | Score | Clicks | Impr | CTR | Exp. CTR | Pos | Why |",
  "|---|------|-------|--------|------|-----|----------|-----|-----|",
  ...opportunities.slice(0, 25).map((o, i) =>
    `| ${i + 1} | \`${o.route}\` | ${o.score} | ${o.clicks} | ${o.impressions} | ` +
    `${pct(o.ctr)} | ${pct(o.expectedCtr)} | ${o.position?.toFixed(1) ?? "—"} | ${o.why} |`,
  ),
  "",
  "## By category",
  "",
  ...(
    [
      ["high-impression-low-ctr", "C. High impressions, low CTR"],
      ["near-winner", "A. Near winners (pos 4–15)"],
      ["striking-distance", "B. Striking distance (pos 16–30)"],
      ["declining", "D. Declining"],
      ["indexing-opportunity", "E. Indexing opportunity"],
      ["low-signal", "G. Low signal"],
    ] as [Category, string][]
  ).flatMap(([cat, label]) => {
    const rows = byCat(cat);
    return [
      `### ${label} — ${rows.length}`,
      "",
      ...(rows.length
        ? rows.slice(0, 15).map((o) => `- \`${o.route}\` — ${o.why}`)
        : ["_None._"]),
      "",
    ];
  }),
].join("\n");

writeFileSync(join(REPORTS, "seo-opportunities.md"), md + "\n");

console.log("\n═══ SEO Opportunities ═══");
console.log(`Scored ${opportunities.length} pages from real Search Console data.\n`);

if (unknown.length > 0) {
  console.log("⚠ Reported pages that match NO route in this repo:");
  for (const u of unknown) console.log(`    ${u}`);
  console.log(
    "  Each is either a live 404 earning impressions (fix or redirect it) or a\n" +
      "  typo in a hand-entered baseline. Verify in Search Console before acting —\n" +
      "  do NOT add these to the sitemap.\n",
  );
}
for (const o of opportunities.slice(0, 15)) {
  console.log(
    `  ${String(o.score).padStart(5)}  ${o.route.padEnd(48).slice(0, 48)} ` +
      `${String(o.impressions).padStart(6)} impr  ${pct(o.ctr).padStart(7)}  pos ${o.position?.toFixed(1) ?? "—"}`,
  );
}
console.log("\nWrote reports/seo-opportunities.{json,csv,md}\n");
