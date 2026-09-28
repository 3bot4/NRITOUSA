#!/usr/bin/env node
/*
 * Site-wide INTERNAL link audit, measured from the rendered build output.
 *
 * Why this exists alongside the two checkers we already had:
 *
 *   scripts/check-links.js      source scan, internal routes  — skips any link
 *                               built from a template literal (`${...}`) and
 *                               knows nothing about redirects or anchors.
 *   scripts/audit/link-health.js  rendered HTML, EXTERNAL citations only.
 *
 * Neither one answers "what does a reader actually get when they click a link
 * on the live site". This does, by reading .next/server/app/ ** /*.html — the
 * same HTML the CDN serves — and resolving every internal href against the
 * real route manifest (static routes, dynamic route regexes, redirect table).
 *
 * Five classes of finding, in descending severity:
 *   BROKEN     the href resolves to no route at all -> a reader hits a 404.
 *   REDIRECTED the href 301s. Not user-visible, but it leaks link equity and
 *              costs a round trip; the fix is to point the link at the final
 *              destination. Chains (A->B->C) are called out separately.
 *   ANCHOR     the page exists but the #fragment has no matching id.
 *   NOINDEX    an indexable page links to a noindex page (crawl-budget sink).
 *   ORPHAN     a prerendered page nothing else links to.
 *
 * Read-only. Requires a prior `next build`. Usage:
 *   node scripts/audit/internal-links.js [--json]
 */

const { readFileSync, readdirSync, statSync, writeFileSync, existsSync } = require("node:fs");
const { join, relative, sep } = require("node:path");

const ROOT = join(__dirname, "..", "..");
const APP_OUT = join(ROOT, ".next", "server", "app");
const MANIFEST = join(ROOT, ".next", "routes-manifest.json");
const OUT_FILE = join(__dirname, "internal-links.json");
const SITE = "https://www.nritousa.com";

const jsonOnly = process.argv.includes("--json");

if (!existsSync(APP_OUT) || !existsSync(MANIFEST)) {
  console.error("No build output found. Run `npm run build` first.");
  process.exit(1);
}

/* ---------------------------------------------------------------- */
/* 1. Ground truth: what pages exist                                 */
/* ---------------------------------------------------------------- */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** .next/server/app/a/b.html -> /a/b ; index.html -> / ; (group) segments dropped. */
function fileToRoute(file) {
  let rel = relative(APP_OUT, file).split(sep).join("/").replace(/\.html$/, "");
  rel = rel
    .split("/")
    .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
    .join("/");
  if (rel === "index") return "/";
  return "/" + rel;
}

const htmlFiles = walk(APP_OUT);
const pages = new Map(); // route -> file
for (const f of htmlFiles) pages.set(fileToRoute(f), f);

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const staticRoutes = new Set((manifest.staticRoutes || []).map((r) => r.page));
const dynamicRoutes = (manifest.dynamicRoutes || []).map((r) => ({
  page: r.page,
  re: new RegExp(r.regex),
}));
const redirects = (manifest.redirects || [])
  .filter((r) => r.source !== "/:path*")
  .map((r) => ({
    source: r.source,
    destination: r.destination,
    statusCode: r.statusCode,
    re: new RegExp(r.regex),
  }));

/* ---------------------------------------------------------------- */
/* 2. Resolve a path the way the edge does                           */
/* ---------------------------------------------------------------- */
function matchRedirect(path) {
  for (const r of redirects) if (r.re.test(path)) return r;
  return null;
}

function routeExists(path) {
  if (pages.has(path)) return true;
  if (staticRoutes.has(path)) return true;
  // trailing slash tolerance
  if (path.length > 1 && path.endsWith("/") && pages.has(path.slice(0, -1))) return true;
  for (const d of dynamicRoutes) if (d.re.test(path)) return true;
  return false;
}

/** Follow the redirect table to a fixed point; report the chain. */
function resolve(path) {
  const chain = [];
  let cur = path;
  for (let i = 0; i < 8; i++) {
    const r = matchRedirect(cur);
    if (!r) break;
    // Only literal destinations are followed; parameterised ones are recorded as-is.
    const next = r.destination;
    chain.push({ from: cur, to: next, statusCode: r.statusCode });
    if (next === cur) break; // self-loop guard
    cur = next;
    if (chain.length > 1 && chain.some((c, j) => j < chain.length - 1 && c.from === cur)) {
      return { final: cur, chain, loop: true };
    }
  }
  return { final: cur, chain, loop: false };
}

/* ---------------------------------------------------------------- */
/* 3. Parse every rendered page                                      */
/* ---------------------------------------------------------------- */
const A_HREF = /<a\b[^>]*?\bhref=["']([^"']+)["'][^>]*>/gi;
const ID_ATTR = /\bid=["']([^"']+)["']/gi;
const NOINDEX = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;

const pageIds = new Map(); // route -> Set(id)
const pageNoindex = new Set();
const links = []; // {from, href, path, hash}
const inbound = new Map(); // route -> Set(source route)

for (const [route, file] of pages) {
  const html = readFileSync(file, "utf8");

  if (NOINDEX.test(html)) pageNoindex.add(route);

  const ids = new Set();
  let m;
  ID_ATTR.lastIndex = 0;
  while ((m = ID_ATTR.exec(html)) !== null) ids.add(m[1]);
  pageIds.set(route, ids);

  A_HREF.lastIndex = 0;
  const seen = new Set();
  while ((m = A_HREF.exec(html)) !== null) {
    let href = m[1].trim();
    if (!href) continue;
    if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) continue;
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
    if (/^https?:\/\//i.test(href)) continue; // external — link-health.js owns these
    if (!href.startsWith("/")) continue;
    if (href.startsWith("//")) continue;

    const [beforeHash, hash = ""] = href.split("#");
    const path = (beforeHash.split("?")[0] || "/").replace(/\/+$/, "") || "/";

    const key = path + "#" + hash;
    if (seen.has(key)) continue; // one finding per distinct target per page
    seen.add(key);

    links.push({ from: route, href, path, hash });

    if (!inbound.has(path)) inbound.set(path, new Set());
    if (path !== route) inbound.get(path).add(route);
  }
}

/* ---------------------------------------------------------------- */
/* 4. Classify                                                       */
/* ---------------------------------------------------------------- */
const broken = [];
const redirected = [];
const badAnchors = [];
const noindexTargets = [];

// Assets emitted next to pages (og images, etc.) aren't HTML routes.
const isAsset = (p) => /\.(png|jpe?g|gif|svg|webp|ico|pdf|xml|txt|json|css|js|csv)$/i.test(p);
const isApi = (p) => p.startsWith("/api/");

for (const link of links) {
  const { from, href, path, hash } = link;
  if (isAsset(path) || isApi(path)) continue;

  const red = matchRedirect(path);
  if (red) {
    const r = resolve(path);
    redirected.push({
      from,
      href,
      path,
      final: r.final,
      hops: r.chain.length,
      loop: r.loop,
      finalExists: routeExists(r.final),
      statusCode: red.statusCode,
    });
    continue;
  }

  if (!routeExists(path)) {
    broken.push({ from, href, path });
    continue;
  }

  if (hash && pageIds.has(path)) {
    const ids = pageIds.get(path);
    if (!ids.has(hash) && !ids.has(decodeURIComponent(hash))) {
      badAnchors.push({ from, href, path, hash });
    }
  }

  if (pageNoindex.has(path) && !pageNoindex.has(from)) {
    noindexTargets.push({ from, path });
  }
}

/* ---------------------------------------------------------------- */
/* 5. Orphans                                                        */
/* ---------------------------------------------------------------- */
const ORPHAN_EXEMPT =
  /^\/(api\/|_not-found|robots|sitemap|opengraph-image|icon|apple-icon|manifest)|\/(opengraph-image|icon|apple-icon)/;

const orphans = [];
for (const route of pages.keys()) {
  if (route === "/") continue;
  if (ORPHAN_EXEMPT.test(route)) continue;
  if (pageNoindex.has(route)) continue; // deliberately de-indexed, orphan by design
  const count = inbound.has(route) ? inbound.get(route).size : 0;
  if (count === 0) orphans.push(route);
}
orphans.sort();

/* ---------------------------------------------------------------- */
/* 6. Report                                                         */
/* ---------------------------------------------------------------- */
const byTarget = (rows, key = "path") => {
  const g = new Map();
  for (const r of rows) {
    if (!g.has(r[key])) g.set(r[key], []);
    g.get(r[key]).push(r);
  }
  return [...g.entries()].sort((a, b) => b[1].length - a[1].length);
};

const result = {
  generatedAt: new Date().toISOString().slice(0, 10),
  pagesScanned: pages.size,
  linksChecked: links.length,
  broken,
  redirected,
  badAnchors,
  noindexTargets,
  orphans,
};

writeFileSync(OUT_FILE, JSON.stringify(result, null, 2));

if (jsonOnly) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(broken.length > 0 ? 1 : 0);
}

const line = (s) => console.log(s);
line(`\nRendered-HTML internal link audit`);
line(`  pages scanned : ${pages.size}`);
line(`  links checked : ${links.length} (distinct target per page)`);
line(`  redirect rules: ${redirects.length}\n`);

line(`BROKEN (404 for the reader): ${broken.length}`);
for (const [path, rows] of byTarget(broken)) {
  line(`  ${path}   <- ${rows.length} page(s)`);
  for (const r of rows.slice(0, 5)) line(`      from ${r.from}`);
  if (rows.length > 5) line(`      ...and ${rows.length - 5} more`);
}

line(`\nREDIRECTED (link equity leak): ${redirected.length}`);
for (const [path, rows] of byTarget(redirected)) {
  const s = rows[0];
  line(
    `  ${path} -> ${s.final}${s.hops > 1 ? ` (${s.hops} hops)` : ""}${
      s.loop ? " [LOOP]" : ""
    }${s.finalExists ? "" : " [DESTINATION MISSING]"}   <- ${rows.length} page(s)`
  );
  for (const r of rows.slice(0, 5)) line(`      from ${r.from}`);
  if (rows.length > 5) line(`      ...and ${rows.length - 5} more`);
}

line(`\nBROKEN ANCHORS (#fragment has no matching id): ${badAnchors.length}`);
for (const [path, rows] of byTarget(badAnchors)) {
  const hashes = [...new Set(rows.map((r) => r.hash))];
  line(`  ${path}  missing #${hashes.join(", #")}   <- ${rows.length} link(s)`);
  for (const r of rows.slice(0, 3)) line(`      from ${r.from}`);
  if (rows.length > 3) line(`      ...and ${rows.length - 3} more`);
}

line(`\nLINKS TO NOINDEX PAGES: ${noindexTargets.length}`);
for (const [path, rows] of byTarget(noindexTargets)) {
  line(`  ${path}   <- ${rows.length} indexable page(s)`);
}

line(`\nORPHANS (zero inbound internal links): ${orphans.length}`);
for (const o of orphans) line(`  ${o}`);

line(`\nWrote ${relative(ROOT, OUT_FILE)}`);
process.exit(broken.length > 0 ? 1 : 0);
