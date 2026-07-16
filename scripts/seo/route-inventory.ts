/**
 * Emit the route inventory to reports/route-inventory.{json,csv}.
 *
 * Run: npm run seo:inventory
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildInventory, REPO_ROOT, type RouteRecord } from "./lib/inventory";

const REPORTS = join(REPO_ROOT, "reports");

const COLUMNS: (keyof RouteRecord)[] = [
  "route",
  "routeType",
  "status",
  "inSitemap",
  "sitemapSegment",
  "declaredCanonicalPath",
  "canonicalAbsolute",
  "title",
  "description",
  "robots",
  "redirectTo",
  "schemaTypes",
  "usesPageMetadata",
  "approxSourceBytes",
  "file",
];

const csvCell = (v: unknown): string => {
  const s = Array.isArray(v) ? v.join(" ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function main() {
  const inv = buildInventory();
  mkdirSync(REPORTS, { recursive: true });

  writeFileSync(
    join(REPORTS, "route-inventory.json"),
    JSON.stringify(inv, null, 2) + "\n",
  );

  const csv = [
    COLUMNS.join(","),
    ...inv.routes.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(",")),
  ].join("\n");
  writeFileSync(join(REPORTS, "route-inventory.csv"), csv + "\n");

  console.log("\n═══ Route Inventory ═══");
  console.log(`Route files:   ${inv.counts.routeFiles}`);
  console.log(`Sitemap URLs:  ${inv.counts.sitemapUrls}`);
  console.log("");
  for (const [k, v] of Object.entries(inv.counts)) {
    if (k === "routeFiles" || k === "sitemapUrls") continue;
    console.log(`  ${k.padEnd(20)} ${v}`);
  }
  console.log(`\nWrote reports/route-inventory.{json,csv}\n`);
}

main();
