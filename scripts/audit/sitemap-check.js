#!/usr/bin/env node
// Compare sitemap-data.ts literal paths + dynamic sources against real routes.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const audit = require("./audit-data.json");
const sm = fs.readFileSync(path.join(ROOT, "src/lib/sitemap-data.ts"), "utf8");

// literal e("/path", ...) entries
const literals = [...sm.matchAll(/\be\(\s*["'`](\/[^"'`]*)["'`]/g)].map((m) => m[1]);
// dynamic families present in sitemap (…map builders)
const dynFamilies = [];
if (/tools\.map/.test(sm)) dynFamilies.push("/tools/*");
if (/calculators\.map/.test(sm)) dynFamilies.push("/calculators/*");
if (/eduCalcs\.map/.test(sm)) dynFamilies.push("/education/*");
if (/articles\.map/.test(sm)) dynFamilies.push("/articles/*");
if (/topics\.map/.test(sm)) dynFamilies.push("/topics/*");
for (const kw of ["itrPages","tdsPages","repatPages","giftPages","ociGuides","clusterPages","uscisChildPages","myuscisChildPages","formsChildPages","lifePlanningChildPages","h1bChildPages","greenCardChildPages","visaBulletinChildPages"]) {
  if (new RegExp(kw).test(sm)) dynFamilies.push(kw);
}

const litSet = new Set(literals);
// Indexable static routes that should be in sitemap (exclude intentional).
const excluded = (r) =>
  r.hasRedirect ||
  r.isDynamic ||
  /^\/api\//.test(r.route) ||
  /sitemap|robots|opengraph-image|icon|apple-icon/.test(r.route) ||
  /^\/author(\/|$)/.test(r.route) ||
  /^\/nri-wealth-checkup\/(income|assets|dashboard|profile|report)$/.test(r.route);

const staticRoutes = audit.routes.filter((r) => !excluded(r));
// A route counts as "covered" if it's a literal OR belongs to a dynamic family sitemap builder.
function coveredByFamily(route) {
  if (/^\/tools\//.test(route) && dynFamilies.includes("/tools/*")) return true;
  if (/^\/calculators\//.test(route) && dynFamilies.includes("/calculators/*")) return true;
  if (/^\/education\/[^/]+$/.test(route) && dynFamilies.includes("/education/*")) return true;
  if (/^\/topics\//.test(route) && dynFamilies.includes("/topics/*")) return true;
  return false;
}
const missing = staticRoutes.filter((r) => !litSet.has(r.route) && !coveredByFamily(r.route));

// Literal sitemap paths that don't map to a real static route (stale) — allow
// child cluster paths that are static dirs.
const routeSet = new Set(audit.routes.map((r) => r.route));
const stale = literals.filter((p) => !routeSet.has(p));

console.log("literal sitemap entries:", literals.length);
console.log("dynamic families:", dynFamilies.join(", "));
console.log("\n=== static indexable routes possibly MISSING from sitemap (" + missing.length + ") ===");
missing.forEach((r) => console.log("  " + r.route + "  [" + r.type + "]"));
console.log("\n=== literal sitemap paths with NO matching route dir (verify; may be cluster child) (" + stale.length + ") ===");
stale.forEach((p) => console.log("  " + p));
fs.writeFileSync(path.join(__dirname, "sitemap-check.json"), JSON.stringify({ literals, dynFamilies, missing, stale }, null, 2));
