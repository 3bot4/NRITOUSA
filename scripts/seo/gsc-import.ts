/**
 * Normalize a folder of Search Console CSV exports into
 * reports/gsc-normalized.json.
 *
 * Run:
 *   npm run seo:gsc-import -- --dir ./seo-data/gsc/2026-07-16
 *   npm run seo:gsc-import -- --dir ./seo-data/gsc/2026-07-16 \
 *                             --previous ./seo-data/gsc/2026-04-16
 *
 * --previous is optional; when given, every page/query row carries
 * current/previous/change/changePct so the scorer can see declines.
 *
 * The raw CSVs under seo-data/ are gitignored and vercelignored. This script
 * only ever writes to reports/.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { site } from "@/lib/site";
import { REPO_ROOT } from "./lib/inventory";
import { delta, importDir, type Delta, type GscRow } from "./lib/gsc";

interface Args {
  dir: string | null;
  previous: string | null;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { dir: null, previous: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") out.dir = argv[++i] ?? null;
    else if (a === "--previous" || a === "--prev") out.previous = argv[++i] ?? null;
    else if (a.startsWith("--dir=")) out.dir = a.slice(6);
    else if (a.startsWith("--previous=")) out.previous = a.slice(11);
  }
  return out;
}

const abs = (p: string) => (isAbsolute(p) ? p : resolve(REPO_ROOT, p));

type Agg = { clicks: number; impressions: number; position: number | null };

/**
 * Aggregate rows of one dimension by a key, summing clicks/impressions.
 *
 * `pick` selects which period to read, so the same function aggregates the
 * current and previous periods of a Compare-mode export.
 */
function aggregate(
  rows: GscRow[],
  keyOf: (r: GscRow) => string | null,
  pick: (r: GscRow) => { clicks: number; impressions: number; position: number | null } | null = (r) => r,
): Map<string, Agg> {
  const acc = new Map<
    string,
    { clicks: number; impressions: number; posWeighted: number; posImpr: number }
  >();
  for (const r of rows) {
    const k = keyOf(r);
    if (k == null) continue;
    const m = pick(r);
    if (!m) continue;
    const cur = acc.get(k) ?? { clicks: 0, impressions: 0, posWeighted: 0, posImpr: 0 };
    cur.clicks += m.clicks;
    cur.impressions += m.impressions;
    // Average position must be impression-weighted; a plain mean over rows
    // lets a 1-impression row at #3 outweigh a 900-impression row at #40.
    if (m.position != null && m.impressions > 0) {
      cur.posWeighted += m.position * m.impressions;
      cur.posImpr += m.impressions;
    }
    acc.set(k, cur);
  }
  const out = new Map<string, Agg>();
  for (const [k, v] of acc) {
    out.set(k, {
      clicks: v.clicks,
      impressions: v.impressions,
      position: v.posImpr > 0 ? v.posWeighted / v.posImpr : null,
    });
  }
  return out;
}

export interface NormalizedEntity {
  key: string;
  clicks: Delta;
  impressions: Delta;
  ctr: number | null;
  position: number | null;
  previousPosition: number | null;
}

function normalizeEntity(
  current: ReturnType<typeof aggregate>,
  previous: ReturnType<typeof aggregate> | null,
): NormalizedEntity[] {
  const keys = new Set([...current.keys(), ...(previous?.keys() ?? [])]);
  const out: NormalizedEntity[] = [];
  for (const key of keys) {
    const c = current.get(key) ?? { clicks: 0, impressions: 0, position: null };
    const p = previous?.get(key) ?? null;
    out.push({
      key,
      clicks: delta(c.clicks, p ? p.clicks : null),
      impressions: delta(c.impressions, p ? p.impressions : null),
      ctr: c.impressions > 0 ? c.clicks / c.impressions : null,
      position: c.position,
      previousPosition: p?.position ?? null,
    });
  }
  return out.sort((a, b) => b.impressions.current - a.impressions.current);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.dir) {
    console.error(
      "Usage: npm run seo:gsc-import -- --dir ./seo-data/gsc/YYYY-MM-DD [--previous ./seo-data/gsc/YYYY-MM-DD]",
    );
    process.exit(1);
  }

  const cur = importDir(abs(args.dir), site.url);
  const prev = args.previous ? importDir(abs(args.previous), site.url) : null;

  const byDim = (rows: GscRow[], d: string) => rows.filter((r) => r.dimension === d);

  /**
   * Previous-period source, in preference order:
   *   1. Compare columns inside this export — same query, same filters, so the
   *      two periods are guaranteed comparable.
   *   2. A separate --previous folder.
   *
   * Preferring (1) also means passing both cannot double-count.
   */
  const inFile = cur.rows.some((r) => r.previous !== null);
  if (inFile && prev) {
    cur.warnings.push(
      "export already contains Previous-period columns — ignoring --previous",
    );
  }

  /** Current + previous aggregate for one dimension, whatever the source. */
  const pair = (dim: string, keyOf: (r: GscRow) => string | null) => {
    const current = aggregate(byDim(cur.rows, dim), keyOf);
    if (inFile) {
      return [current, aggregate(byDim(cur.rows, dim), keyOf, (r) => r.previous)] as const;
    }
    return [current, prev ? aggregate(byDim(prev.rows, dim), keyOf) : null] as const;
  };

  /** Query→page pairs only exist when the export was filtered to one page. */
  const queryPageRows = cur.rows.filter((r) => r.query && r.page);

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: site.url,
    source: { current: args.dir, previous: inFile ? "(in-file compare)" : args.previous },
    /**
     * The scope Search Console applied. Read `totals` through this: a Page
     * filter makes them that page's totals, not the site's.
     */
    filters: cur.filters,
    files: { current: cur.files, previous: prev?.files ?? null },
    warnings: [...cur.warnings, ...(prev?.warnings.map((w) => `[previous] ${w}`) ?? [])],
    totals: {
      clicks: byDim(cur.rows, "pages").reduce((s, r) => s + r.clicks, 0),
      impressions: byDim(cur.rows, "pages").reduce((s, r) => s + r.impressions, 0),
    },
    pages: normalizeEntity(...pair("pages", (r) => r.page)),
    queries: normalizeEntity(...pair("queries", (r) => r.query)),
    devices: normalizeEntity(...pair("devices", (r) => r.device)),
    countries: normalizeEntity(...pair("countries", (r) => r.country)),
    dates: normalizeEntity(aggregate(byDim(cur.rows, "dates"), (r) => r.date), null),
    queryPage: queryPageRows.map((r) => ({
      page: r.page,
      query: r.query,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
      previousPosition: r.previous?.position ?? null,
    })),
  };

  mkdirSync(join(REPO_ROOT, "reports"), { recursive: true });
  writeFileSync(
    join(REPO_ROOT, "reports", "gsc-normalized.json"),
    JSON.stringify(report, null, 2) + "\n",
  );

  console.log("\n═══ Search Console Import ═══");
  if (Object.keys(cur.filters).length) {
    console.log("Export scope (from Filters.csv):");
    for (const [k, v] of Object.entries(cur.filters)) {
      console.log(`  ${k.padEnd(14)} ${v}`);
    }
    console.log("");
  }
  for (const f of cur.files) {
    console.log(`  ${f.file.padEnd(24)} ${f.dimension.padEnd(10)} ${f.rows} rows` +
      (f.comparison ? " +compare" : "") +
      (f.skipped ? ` (${f.skipped} empty skipped)` : ""));
  }
  console.log(
    `\nPages: ${report.pages.length} · Queries: ${report.queries.length} · ` +
      `Query-page pairs: ${report.queryPage.length}`,
  );
  console.log(
    `Totals: ${report.totals.clicks} clicks · ${report.totals.impressions} impressions` +
      (cur.filters.Page ? `  (scoped to Page ${cur.filters.Page})` : ""),
  );
  for (const w of report.warnings) console.log(`  ⚠ ${w}`);
  console.log("\nWrote reports/gsc-normalized.json\n");
}

main();
