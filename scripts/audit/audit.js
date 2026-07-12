#!/usr/bin/env node
/*
 * LOCAL-ONLY sitewide audit for NRITOUSA.com.
 * Read-only: walks the filesystem, extracts routes / links / metadata / schema
 * and writes a JSON blob to scripts/audit/audit-data.json for report assembly.
 * Does NOT touch git, network, or production. Safe to run repeatedly.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const APP = path.join(ROOT, "src", "app");
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");

/* ---------- fs helpers ---------- */
function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next" || name === ".git") continue;
      walk(full, exts, out);
    } else if (!exts || exts.some((e) => name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}
const read = (f) => fs.readFileSync(f, "utf8");
const rel = (f) => path.relative(ROOT, f);

/* ---------- 1. route inventory ---------- */
// Map an app-dir file to its URL route.
function routeForPageFile(file) {
  let r = path.relative(APP, path.dirname(file)); // dir under app
  const segs = r.split(path.sep).filter(Boolean);
  const kept = [];
  for (const s of segs) {
    if (s.startsWith("(") && s.endsWith(")")) continue; // route group
    if (s.startsWith("@")) continue; // parallel slot
    kept.push(s);
  }
  return "/" + kept.join("/");
}

const pageFiles = walk(APP, ["page.tsx", "page.jsx", "page.ts"]).filter((f) =>
  /[/\\]page\.(tsx|jsx|ts)$/.test(f)
);
const routeFiles = walk(APP, ["route.ts", "route.tsx"]).filter((f) =>
  /[/\\]route\.(ts|tsx)$/.test(f)
);

const routes = [];
const staticRoutePaths = new Set();
const dynamicRoutePrefixes = []; // { prefix, depth, path }

for (const f of pageFiles) {
  const src = read(f);
  const route = routeForPageFile(f);
  const isDynamic = /\[.+\]/.test(route);
  const info = {
    route,
    file: rel(f),
    isDynamic,
    useClient: /^["']use client["']/m.test(src) || /\n\s*["']use client["']/.test(src.slice(0, 200)),
    hasMetadataConst: /export\s+const\s+metadata\b/.test(src),
    hasGenerateMetadata: /export\s+(async\s+)?function\s+generateMetadata\b/.test(src),
    usesPageMetadata: /pageMetadata\s*\(/.test(src),
    hasRedirect: /\bredirect\s*\(/.test(src) || /\bpermanentRedirect\s*\(/.test(src),
    hasNotFound: /\bnotFound\s*\(/.test(src),
    // schema signals
    faqSchema: /faqJsonLd|FAQPage/.test(src),
    articleSchema: /articleJsonLd|"@type":\s*"Article"|'@type':\s*'Article'/.test(src),
    breadcrumbSchema: /breadcrumbJsonLd|BreadcrumbList/.test(src),
    personSchema: /authorProfileJsonLd|"@type":\s*"Person"|ProfilePage/.test(src),
    softwareSchema: /SoftwareApplication/.test(src),
    anyJsonLd: /application\/ld\+json|jsonLdGraph|JsonLd/.test(src),
    // content signals
    hasFaqData: /faqs?\b|Faqs|FAQ/i.test(src),
    importsCalculator: /Calculator|Checker|Estimator|Simulator/.test(src),
    hubContent: /toolHubContent|calculatorContent|ToolHub|CalculatorHub/.test(src),
    lineCount: src.split("\n").length,
    byteSize: Buffer.byteLength(src),
  };
  // classify type
  let type = "page";
  if (info.usesPageMetadata && /articleJsonLd/.test(src)) type = "article";
  if (/Calculator|Checker|Estimator|max-out-calculator/.test(route) || info.softwareSchema) type = "calculator/tool";
  if (/\/tools\//.test(route) || route === "/tools") type = "tool";
  if (/\/calculators\//.test(route) || route === "/calculators") type = "calculator";
  if (/hub|resources|topics|immigration$|uscis$|oci$|green-card$|visa-bulletin$/.test(route)) type = "hub";
  info.type = type;
  routes.push(info);

  if (isDynamic) {
    const prefix = route.replace(/\/\[.*$/, "");
    dynamicRoutePrefixes.push({ prefix, depth: route.split("/").length, path: route });
  } else {
    staticRoutePaths.add(route);
  }
}

// route.ts endpoints (sitemaps, robots, api, og images)
const routeEndpoints = routeFiles.map((f) => ({ route: routeForPageFile(f), file: rel(f) }));
for (const e of routeEndpoints) staticRoutePaths.add(e.route);

// next.config redirects + special files always resolvable
const cfg = fs.existsSync(path.join(ROOT, "next.config.mjs")) ? read(path.join(ROOT, "next.config.mjs")) : "";
const redirectSources = [...cfg.matchAll(/source:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const redirectMap = [...cfg.matchAll(/source:\s*["']([^"']+)["'][\s\S]{0,120}?destination:\s*["']([^"']+)["']/g)].map(
  (m) => ({ from: m[1], to: m[2] })
);

/* ---------- public assets ---------- */
const publicFiles = new Set(
  walk(PUBLIC, null).map((f) => "/" + path.relative(PUBLIC, f).split(path.sep).join("/"))
);

/* ---------- 2/3. link extraction ---------- */
const allSrcFiles = walk(SRC, [".tsx", ".ts", ".mdx", ".md"]).concat(
  walk(path.join(ROOT, "docs"), [".md", ".mdx"]).filter(() => false) // skip docs from link source
);
const internalLinks = []; // { file, link }
const externalLinks = []; // { file, link }
const linkRe = /(?:href|to)\s*=\s*(?:{`?|["'`])([^"'`}\s]+)/g;
// also object-form url: "/..." inside metadata/schema — capture canonical-ish
const urlPropRe = /(?:url|canonical|href)\s*:\s*["'`]([^"'`]+)["'`]/g;

for (const f of allSrcFiles) {
  const src = read(f);
  const push = (link) => {
    if (!link) return;
    if (link.startsWith("mailto:") || link.startsWith("tel:")) return;
    if (link.startsWith("http://") || link.startsWith("https://")) {
      externalLinks.push({ file: rel(f), link });
    } else if (link.startsWith("/") && !link.startsWith("//")) {
      internalLinks.push({ file: rel(f), link });
    }
  };
  let m;
  while ((m = linkRe.exec(src))) push(m[1]);
  while ((m = urlPropRe.exec(src))) push(m[1]);
}

/* ---------- internal link validation ---------- */
function stripHashQuery(l) {
  return l.split("#")[0].split("?")[0];
}
function isValidInternal(link) {
  let p = stripHashQuery(link);
  if (p === "" || p === "/") return { ok: true, kind: "home" };
  // template literals leftover
  if (p.includes("${") || p.includes("`")) return { ok: true, kind: "dynamic-template" };
  // trailing slash normalize
  const noTrail = p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  if (staticRoutePaths.has(noTrail)) return { ok: true, kind: "static" };
  if (redirectSources.includes(noTrail) || redirectSources.includes(p)) return { ok: true, kind: "redirect" };
  if (publicFiles.has(p)) return { ok: true, kind: "asset" };
  // opengraph-image / icon children of a static route
  if (/\/(opengraph-image|icon|apple-icon|twitter-image)$/.test(noTrail)) {
    const parent = noTrail.replace(/\/(opengraph-image|icon|apple-icon|twitter-image)$/, "") || "/";
    if (staticRoutePaths.has(parent) || parent === "/") return { ok: true, kind: "og-child" };
  }
  // dynamic route prefix match
  for (const d of dynamicRoutePrefixes) {
    if (d.prefix && (noTrail === d.prefix || noTrail.startsWith(d.prefix + "/"))) {
      return { ok: true, kind: "dynamic:" + d.path };
    }
  }
  // known asset extensions but missing file
  if (/\.(png|jpg|jpeg|svg|webp|ico|pdf|xml|txt|json|csv|gif|avif)$/i.test(p)) {
    return { ok: false, kind: "missing-asset" };
  }
  return { ok: false, kind: "no-route" };
}

const linkStats = {};
const brokenInternal = [];
const dynamicUnverified = {};
for (const { file, link } of internalLinks) {
  if (link === "#" || link === "") {
    brokenInternal.push({ file, link, kind: "empty-or-hash" });
    continue;
  }
  const v = isValidInternal(link);
  linkStats[v.kind] = (linkStats[v.kind] || 0) + 1;
  if (!v.ok) brokenInternal.push({ file, link, kind: v.kind });
  if (v.kind.startsWith("dynamic:")) {
    const key = v.kind.slice(8);
    dynamicUnverified[key] = (dynamicUnverified[key] || 0) + 1;
  }
}

/* trailing-slash & case inconsistency within internal links */
const linkSet = new Set(internalLinks.map((l) => stripHashQuery(l.link)));
const trailingIssues = [];
for (const l of linkSet) {
  if (l.length > 1 && l.endsWith("/") && linkSet.has(l.slice(0, -1))) {
    trailingIssues.push(l);
  }
  if (l !== l.toLowerCase() && /^[/a-z0-9-]+$/i.test(l)) {
    // uppercase in a path segment
    trailingIssues.push(l + " (uppercase)");
  }
}

/* ---------- external domains ---------- */
const extDomains = {};
const badExternal = [];
for (const { file, link } of externalLinks) {
  let host = "";
  try {
    host = new URL(link).host;
  } catch {
    host = "(unparseable) " + link;
  }
  extDomains[host] = (extDomains[host] || 0) + 1;
  if (/localhost|127\.0\.0\.1|example\.com|placeholder\.com|yourdomain|test\.com/.test(link)) {
    badExternal.push({ file, link, why: "placeholder/localhost" });
  }
  if (link.startsWith("http://")) badExternal.push({ file, link, why: "http-not-https" });
}

/* ---------- image alt audit ---------- */
const imgIssues = [];
const componentFiles = walk(SRC, [".tsx"]);
for (const f of componentFiles) {
  const src = read(f);
  // <img ...> without alt
  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt\s*=/.test(m[0])) imgIssues.push({ file: rel(f), issue: "<img> missing alt", snippet: m[0].slice(0, 80) });
    else if (/\balt\s*=\s*["'`]\s*["'`]/.test(m[0])) imgIssues.push({ file: rel(f), issue: "<img> empty alt", snippet: m[0].slice(0, 80) });
  }
  // next/image <Image ...> quick check for missing alt on same line-ish
  for (const m of src.matchAll(/<Image\b[\s\S]{0,300}?\/?>/g)) {
    if (!/\balt\s*=/.test(m[0])) imgIssues.push({ file: rel(f), issue: "<Image> missing alt", snippet: m[0].slice(0, 80).replace(/\n/g, " ") });
    else if (/\balt\s*=\s*["'`]\s*["'`]/.test(m[0]) && !/alt\s*=\s*["'`]["'`]\s*$/.test(m[0])) {
      // ignore decorative alt=""
    }
    if (/alt\s*=\s*["'`](image|logo|photo|picture|img)["'`]/i.test(m[0]))
      imgIssues.push({ file: rel(f), issue: "generic alt text", snippet: m[0].slice(0, 80).replace(/\n/g, " ") });
  }
}

/* ---------- write output ---------- */
const out = {
  generatedNote: "local-only static audit; dynamic slugs not fully expanded",
  counts: {
    pageFiles: pageFiles.length,
    staticRoutes: staticRoutePaths.size,
    dynamicRoutes: dynamicRoutePrefixes.length,
    routeEndpoints: routeEndpoints.length,
    internalLinkRefs: internalLinks.length,
    uniqueInternalLinks: linkSet.size,
    externalLinkRefs: externalLinks.length,
    brokenInternal: brokenInternal.length,
    imgIssues: imgIssues.length,
  },
  routes,
  dynamicRoutePrefixes,
  routeEndpoints,
  redirectMap,
  redirectSources,
  linkStats,
  brokenInternal,
  dynamicUnverified,
  trailingIssues,
  extDomains,
  badExternal,
  imgIssues,
  publicFileCount: publicFiles.size,
};
const outPath = path.join(__dirname, "audit-data.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log("Wrote", rel(outPath));
console.log(JSON.stringify(out.counts, null, 2));
console.log("\n-- broken internal (first 40) --");
console.log(brokenInternal.slice(0, 40).map((b) => `${b.kind}  ${b.link}  <- ${b.file}`).join("\n"));
console.log("\n-- link kinds --");
console.log(JSON.stringify(linkStats, null, 2));
console.log("\n-- dynamic prefixes --");
console.log(dynamicRoutePrefixes.map((d) => d.path).join("\n"));
console.log("\n-- external domains --");
console.log(Object.entries(extDomains).sort((a, b) => b[1] - a[1]).map(([d, c]) => `${c}\t${d}`).join("\n"));
console.log("\n-- bad external (" + badExternal.length + ") --");
console.log(badExternal.slice(0, 30).map((b) => `${b.why}  ${b.link}  <- ${b.file}`).join("\n"));
console.log("\n-- trailing/case issues --");
console.log(trailingIssues.join("\n"));
console.log("\n-- img issues (" + imgIssues.length + ", first 30) --");
console.log(imgIssues.slice(0, 30).map((i) => `${i.issue}  ${i.file}  ${i.snippet}`).join("\n"));
