#!/usr/bin/env node
// Orphan (incoming-link) analysis + thin tool/calculator detection. Read-only.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const audit = require("./audit-data.json");

function walk(dir, out = []) {
  for (const n of fs.readdirSync(dir)) {
    const f = path.join(dir, n);
    const s = fs.statSync(f);
    if (s.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(n)) continue;
      walk(f, out);
    } else if (/\.(tsx|ts|md|mdx)$/.test(n)) out.push(f);
  }
  return out;
}
const files = walk(path.join(ROOT, "src"));
// Match BOTH JSX attr form (href="/x") AND object-literal form (href: "/x",
// to: "/x") used by Footer/nav config arrays — the latter was previously missed.
const re = /(?:href|to)\s*[=:]\s*(?:{`?|["'`])([^"'`}\s]+)/g;

// incoming counts: count references to each static route path (ignore self-file)
const incoming = {};
const staticRoutes = audit.routes.filter((r) => !r.isDynamic).map((r) => r.route);
for (const r of staticRoutes) incoming[r] = 0;
// also count references that hit dynamic children by prefix -> attribute to the [slug] parent
const dynPrefixes = audit.dynamicRoutePrefixes.filter((d) => d.prefix);

const linkOccurrences = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(src))) {
    let l = m[1];
    if (!l.startsWith("/") || l.startsWith("//")) continue;
    l = l.split("#")[0].split("?")[0];
    if (l.includes("${") || l.includes("`")) continue;
    if (l.length > 1 && l.endsWith("/")) l = l.slice(0, -1);
    linkOccurrences.push(l);
    if (incoming[l] !== undefined) incoming[l]++;
  }
}
// data-file links too (some clusters build hrefs in lib) — scan lib string literals for "/..."
for (const f of files.filter((x) => /[/\\]lib[/\\]/.test(x) || /[/\\]data[/\\]/.test(x))) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/["'`](\/[a-z0-9][a-z0-9\/-]*)["'`]/g)) {
    let l = m[1];
    if (l.length > 1 && l.endsWith("/")) l = l.slice(0, -1);
    if (incoming[l] !== undefined) incoming[l]++;
  }
}

// Orphans: indexable content routes with 0 incoming internal links.
// Exclude redirect stubs, app-state subpages, api, sitemap/robots, dynamic.
const excluded = (r) =>
  r.hasRedirect ||
  /^\/api\//.test(r.route) ||
  /sitemap|robots|opengraph-image|icon|apple-icon/.test(r.route) ||
  /^\/nri-wealth-checkup\/(income|assets|dashboard|profile|report)$/.test(r.route);
const orphans = audit.routes
  .filter((r) => !r.isDynamic && !excluded(r))
  .map((r) => ({ route: r.route, incoming: incoming[r.route] ?? 0, type: r.type }))
  .filter((r) => r.incoming === 0)
  .sort((a, b) => a.route.localeCompare(b.route));

const low = audit.routes
  .filter((r) => !r.isDynamic && !excluded(r))
  .map((r) => ({ route: r.route, incoming: incoming[r.route] ?? 0 }))
  .filter((r) => r.incoming > 0 && r.incoming <= 2)
  .sort((a, b) => a.incoming - b.incoming);

// Thin tool/calculator detection: tool/calc pages whose page.tsx does NOT wire
// hub content (ToolHub/CalculatorHub/toolHubContent/calculatorContent).
const toolRoutes = audit.routes.filter(
  (r) => (/^\/tools\//.test(r.route) || /^\/calculators\//.test(r.route) || r.type === "calculator/tool") && !r.isDynamic && !r.hasRedirect
);
const thin = [];
for (const r of toolRoutes) {
  const full = path.join(ROOT, r.file);
  const src = fs.readFileSync(full, "utf8");
  const hasHub = /ToolHub|CalculatorHub|toolHubContent|calculatorContent|getToolContent|getCalculatorContent/.test(src);
  const hasFaq = /Faq|FAQ|faqs/.test(src);
  const hasIntro = /Intro|intro|whatIs|whoShould|deepDive|DeepDive/.test(src);
  if (!hasHub) thin.push({ route: r.route, hasFaq, hasIntro, lines: r.lineCount });
}

console.log("=== ORPHANS (0 incoming internal links, " + orphans.length + ") ===");
orphans.forEach((o) => console.log(`  ${o.route}   [${o.type}]`));
console.log("\n=== LOW incoming (1-2 links, " + low.length + ") ===");
low.forEach((o) => console.log(`  ${o.incoming}  ${o.route}`));
console.log("\n=== TOOL/CALC pages WITHOUT hub content (" + thin.length + " of " + toolRoutes.length + ") ===");
thin.forEach((t) => console.log(`  ${t.route}  [faq:${t.hasFaq} intro:${t.hasIntro} lines:${t.lines}]`));

fs.writeFileSync(path.join(__dirname, "orphans-thin.json"), JSON.stringify({ orphans, low, thin, toolCount: toolRoutes.length }, null, 2));
