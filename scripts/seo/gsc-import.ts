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

/** Aggregate rows of one dimension by a key, summing clicks/impressions. */
function aggregate(
  rows: GscRow[],
  keyOf: (r: GscRow) => string | null,
): Map<string, { clicks: number; impressions: number; position: number | null }> {
  const acc = new Map<
    string,
    { clicks: number; impressions: number; posWeighted: number; posImpr: number }
  >();
  for (const r of rows) {
    const k = keyOf(r);
    if (k == null) continue;
    const cur = acc.get(k) ?? { clicks: 0, impressions: 0, posWeighted: 0, posImpr: 0 };
    cur.clicks += r.clicks;
    cur.impressions += r.impressions;
    // Average position must be impression-weighted; a plain mean over rows
    // lets a 1-impression row at #3 outweigh a 900-impression row at #40.
    if (r.position != null && r.impressions > 0) {
      cur.posWeighted += r.position * r.impressions;
      cur.posImpr += r.impressions;
    }
    acc.set(k, cur);
  }
  const out = new Map<string, { clicks: number; impressions: number; position: number | null }>();
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

  /** Query→page pairs only exist when the export was filtered to one page. */
  const queryPageRows = cur.rows.filter((r) => r.query && r.page);

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: site.url,
    source: { current: args.dir, previous: args.previous },
    files: { current: cur.files, previous: prev?.files ?? null },
    warnings: [...cur.warnings, ...(prev?.warnings.map((w) => `[previous] ${w}`) ?? [])],
    totals: {
      clicks: byDim(cur.rows, "pages").reduce((s, r) => s + r.clicks, 0),
      impressions: byDim(cur.rows, "pages").reduce((s, r) => s + r.impressions, 0),
    },
    pages: normalizeEntity(
      aggregate(byDim(cur.rows, "pages"), (r) => r.page),
      prev ? aggregate(byDim(prev.rows, "pages"), (r) => r.page) : null,
    ),
    queries: normalizeEntity(
      aggregate(byDim(cur.rows, "queries"), (r) => r.query),
      prev ? aggregate(byDim(prev.rows, "queries"), (r) => r.query) : null,
    ),
    devices: normalizeEntity(
      aggregate(byDim(cur.rows, "devices"), (r) => r.device),
      prev ? aggregate(byDim(prev.rows, "devices"), (r) => r.device) : null,
    ),
    countries: normalizeEntity(
      aggregate(byDim(cur.rows, "countries"), (r) => r.country),
      prev ? aggregate(byDim(prev.rows, "countries"), (r) => r.country) : null,
    ),
    dates: normalizeEntity(
      aggregate(byDim(cur.rows, "dates"), (r) => r.date),
      null,
    ),
    queryPage: queryPageRows.map((r) => ({
      page: r.page,
      query: r.query,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    })),
  };

  mkdirSync(join(REPO_ROOT, "reports"), { recursive: true });
  writeFileSync(
    join(REPO_ROOT, "reports", "gsc-normalized.json"),
    JSON.stringify(report, null, 2) + "\n",
  );

  console.log("\n═══ Search Console Import ═══");
  for (const f of cur.files) {
    console.log(`  ${f.file.padEnd(24)} ${f.dimension.padEnd(10)} ${f.rows} rows` +
      (f.skipped ? ` (${f.skipped} empty skipped)` : ""));
  }
  console.log(
    `\nPages: ${report.pages.length} · Queries: ${report.queries.length} · ` +
      `Query-page pairs: ${report.queryPage.length}`,
  );
  console.log(
    `Totals: ${report.totals.clicks} clicks · ${report.totals.impressions} impressions`,
  );
  for (const w of report.warnings) console.log(`  ⚠ ${w}`);
  console.log("\nWrote reports/gsc-normalized.json\n");
}

main();
