#!/usr/bin/env node
/**
 * Internal link checker for NRI to USA.
 *
 * Scans the codebase for internal links — both JSX `href="/..."` and
 * markdown `](/...)` inside article content — and verifies each one resolves
 * to a real route:
 *   - Static routes are discovered from src/app/<...>/page.tsx
 *   - /articles/<slug> is validated against slugs in src/lib/articles.ts
 *   - /topics/<slug>  is validated against slugs in src/lib/topics.ts
 *
 * External links (http), mailto:, tel:, pure anchors (#...) and dynamic
 * template placeholders (containing ${ or [ ) are ignored.
 *
 * Exits non-zero if any broken internal links are found.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const APP = path.join(SRC, "app");

/* --------------------------------------------------------------- */
/* Collect files                                                    */
/* --------------------------------------------------------------- */
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (/\.(tsx?|jsx?|mdx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/* --------------------------------------------------------------- */
/* Known static routes from the app router                          */
/* --------------------------------------------------------------- */
function staticRoutes() {
  const routes = new Set(["/"]);
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
        let rel = path.relative(APP, dir).split(path.sep).join("/");
        if (rel.includes("[")) continue; // dynamic route, handled separately
        // strip route groups like (marketing)
        rel = rel
          .split("/")
          .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
          .join("/");
        routes.add("/" + rel);
      }
    }
  }
  visit(APP);
  // Legacy/redirect route kept intentionally.
  routes.add("/privacy");
  return routes;
}

/* --------------------------------------------------------------- */
/* Slugs from data files                                            */
/* --------------------------------------------------------------- */
function slugsFrom(file) {
  const text = fs.readFileSync(file, "utf8");
  const set = new Set();
  const re = /slug:\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = re.exec(text)) !== null) set.add(m[1]);
  return set;
}

const articleSlugs = slugsFrom(path.join(SRC, "lib", "articles.ts"));
const topicSlugs = slugsFrom(path.join(SRC, "lib", "topics.ts"));
const calculatorSlugs = slugsFrom(path.join(SRC, "lib", "calculators.ts"));
const authorSlugs = slugsFrom(path.join(SRC, "lib", "authors.ts"));
const routes = staticRoutes();

/* --------------------------------------------------------------- */
/* Nested cluster [slug] routes                                     */
/*                                                                  */
/* Several top-level hubs render their children through a shared    */
/* /<base>/[slug] route whose slugs come from cluster data files    */
/* (see each route's generateStaticParams). staticRoutes() skips    */
/* dynamic dirs, so without this map every cluster child link would */
/* be reported as broken — the historical false-positive class.     */
/* Precompute the full set of valid /<base>/<slug> paths from the   */
/* same `slug:` fields the pages are generated from.                */
/* --------------------------------------------------------------- */
const dynamicClusters = {
  "/green-card": ["greenCardCluster.ts"],
  "/visa-bulletin": ["visaBulletinCluster.ts"],
  "/h1b": ["h1bCluster.ts"],
  "/uscis": ["uscisCluster.ts", "myuscisCluster.ts", "uscisLifePlanningCluster.ts"],
  "/uscis/forms": ["uscisFormsCluster.ts"],
  "/india-tax-compliance": [
    "itrCluster.ts",
    "tdsCluster.ts",
    "repatriationCluster.ts",
    "giftsCluster.ts",
  ],
  "/oci": ["ociGuides.ts"],
  "/success-stories": ["successStories.ts"],
  "/indian-passport-renewal-usa": ["passportCluster.ts"],
};

/**
 * Cluster child slugs come from two shapes: page objects with a `slug: "..."`
 * field, and a pillar constant like `ITR_PILLAR_SLUG = "..."` referenced as
 * `slug: ITR_PILLAR_SLUG`. Capture both so pillar pages aren't reported broken.
 */
function clusterSlugs(file) {
  const text = fs.readFileSync(file, "utf8");
  const set = new Set();
  for (const re of [
    /slug:\s*["'`]([^"'`]+)["'`]/g,
    /_SLUG\s*=\s*["'`]([^"'`]+)["'`]/g,
  ]) {
    let m;
    while ((m = re.exec(text)) !== null) set.add(m[1]);
  }
  return set;
}

const dynamicRoutes = new Set();
for (const [base, files] of Object.entries(dynamicClusters)) {
  for (const f of files) {
    const full = path.join(SRC, "lib", f);
    if (!fs.existsSync(full)) continue;
    for (const slug of clusterSlugs(full)) dynamicRoutes.add(`${base}/${slug}`);
  }
}

/* --------------------------------------------------------------- */
/* Extract internal links from every source file                   */
/* --------------------------------------------------------------- */
const linkPatterns = [
  /href=["'`](\/[^"'`]*)["'`]/g, // JSX href="/..."
  /\]\((\/[^)]+)\)/g, // markdown ](/...)
];

const broken = [];
let checked = 0;

for (const file of walk(SRC)) {
  // Test files are not rendered pages — they reference paths (legacy URLs,
  // regex examples) as data/assertions, which would be false positives.
  if (/\.test\.(t|j)sx?$/.test(file)) continue;
  // Strip block comments so `[label](/href)`-style doc examples in comments
  // aren't mistaken for real links.
  const text = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const pattern of linkPatterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      let link = m[1];
      // ignore dynamic template links, JSX expressions, and doc examples
      if (link.includes("${") || link.includes("[")) continue;
      if (/\s/.test(link)) continue; // real URLs never contain whitespace
      // strip hash and query
      link = link.split("#")[0].split("?")[0];
      if (link === "") continue;
      checked++;

      const ok = isValid(link);
      if (!ok) {
        broken.push({ file: path.relative(ROOT, file), link });
      }
    }
  }
}

function isValid(link) {
  if (routes.has(link)) return true;
  if (dynamicRoutes.has(link)) return true;
  // normalize trailing slash
  if (link.length > 1 && link.endsWith("/") && routes.has(link.slice(0, -1)))
    return true;

  const articleMatch = link.match(/^\/articles\/([^/]+)$/);
  if (articleMatch) return articleSlugs.has(articleMatch[1]);

  const topicMatch = link.match(/^\/topics\/([^/]+)$/);
  if (topicMatch) return topicSlugs.has(topicMatch[1]);

  const calcMatch = link.match(/^\/calculators\/([^/]+)$/);
  if (calcMatch) return calculatorSlugs.has(calcMatch[1]);

  const authorMatch = link.match(/^\/author\/([^/]+)$/);
  if (authorMatch) return authorSlugs.has(authorMatch[1]);

  return false;
}

/* --------------------------------------------------------------- */
/* Report                                                           */
/* --------------------------------------------------------------- */
console.log(
  `Checked ${checked} internal links across the codebase.\n` +
    `Known routes: ${routes.size} static, ${dynamicRoutes.size} cluster [slug], ${topicSlugs.size} topics, ${calculatorSlugs.size} calculators, ${articleSlugs.size} articles, ${authorSlugs.size} authors.\n`
);

if (broken.length === 0) {
  console.log("✅ No broken internal links found.");
  process.exit(0);
} else {
  console.error(`❌ Found ${broken.length} broken internal link(s):\n`);
  for (const b of broken) {
    console.error(`  ${b.link}  →  ${b.file}`);
  }
  process.exit(1);
}
