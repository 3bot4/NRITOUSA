#!/usr/bin/env node
/**
 * Live-site technical auditor.
 *
 *   node audit.js https://www.nritousa.com
 *   node audit.js https://example.com
 *
 * Zero dependencies — uses Node's built-in fetch and dns (Node 18+).
 *
 * What it does, seeded from <origin>/sitemap.xml (falling back to crawling
 * from the homepage if there's no sitemap):
 *   - Fetches every internal page (polite delay, custom User-Agent).
 *   - Checks every unique internal + external link and image for HTTP status.
 *   - Validates in-page fragment anchors (#id) against the target page's ids.
 *   - Extracts per-page SEO basics: <title>, meta description, canonical,
 *     H1 count, og:image.
 *   - Checks the apex domain for MX records (can it receive email?).
 *
 * Prints a summary table and writes a full Markdown report to
 * audit-report.<host>.md. Exits non-zero if hard errors (4xx/5xx links,
 * broken anchors, missing MX) are found.
 */

"use strict";

const dns = require("dns").promises;
const fs = require("fs");

/* --------------------------------------------------------------- */
/* Config                                                           */
/* --------------------------------------------------------------- */
const UA =
  "Mozilla/5.0 (compatible; NRIToUSA-Auditor/1.0; +https://www.nritousa.com)";
const POLITE_DELAY_MS = 500; // between internal page fetches
const LINK_CONCURRENCY = 8; // parallel external/link checks
const FETCH_TIMEOUT_MS = 20000;
const MAX_PAGES = 500; // safety cap

/* --------------------------------------------------------------- */
/* Small helpers                                                    */
/* --------------------------------------------------------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...opts,
      redirect: "manual",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, ...(opts.headers || {}) },
    });
  } finally {
    clearTimeout(t);
  }
}

// Browser-like headers used to re-check links that bots get blocked from.
// Many gov/finance sites (USCIS processing-times, AnnualCreditReport) return
// 403/404 to a plain crawler UA but load fine in a real browser — those are
// false positives, not broken links.
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

/** Follow redirects manually so we can report redirect chains. */
async function resolveChain(url, { method = "GET", max = 5, headers } = {}) {
  const chain = [];
  let current = url;
  for (let i = 0; i <= max; i++) {
    let res;
    try {
      res = await fetchWithTimeout(current, { method, headers });
    } catch (err) {
      return { ok: false, status: 0, error: String(err.message || err), chain };
    }
    chain.push({ url: current, status: res.status });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) break;
      current = new URL(loc, current).href;
      continue;
    }
    return { ok: res.ok, status: res.status, finalUrl: current, chain, res };
  }
  return { ok: false, status: 310, error: "too many redirects", chain };
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

/* --------------------------------------------------------------- */
/* HTML extraction (regex-based; no DOM dependency)                 */
/* --------------------------------------------------------------- */
function extractAttr(tag, attr) {
  const m = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
}

function extractLinks(html, baseUrl) {
  const out = [];
  const re = /<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    out.push({ href, text, abs: safeAbs(href, baseUrl) });
  }
  return out;
}

function extractImages(html, baseUrl) {
  const out = [];
  const re = /<img\b[^>]*?src\s*=\s*["']([^"']+)["'][^>]*>/gis;
  let m;
  while ((m = re.exec(html))) {
    const src = m[1].trim();
    out.push({ src, abs: safeAbs(src, baseUrl) });
  }
  return out;
}

function extractIds(html) {
  const ids = new Set();
  const re = /\bid\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  // name= anchors count too
  const re2 = /<a\b[^>]*?name\s*=\s*["']([^"']+)["']/gi;
  while ((m = re2.exec(html))) ids.add(m[1]);
  return ids;
}

function extractSeo(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  let description = null;
  let ogImage = null;
  for (const tag of metas) {
    const name = (extractAttr(tag, "name") || "").toLowerCase();
    const prop = (extractAttr(tag, "property") || "").toLowerCase();
    if (name === "description") description = extractAttr(tag, "content");
    if (prop === "og:image") ogImage = extractAttr(tag, "content");
  }
  const links = html.match(/<link\b[^>]*>/gi) || [];
  let canonical = null;
  for (const tag of links) {
    if ((extractAttr(tag, "rel") || "").toLowerCase() === "canonical")
      canonical = extractAttr(tag, "href");
  }
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  return {
    title: titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : null,
    description,
    canonical,
    ogImage,
    h1Count,
  };
}

function safeAbs(href, baseUrl) {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------- */
/* Sitemap                                                          */
/* --------------------------------------------------------------- */
async function getSitemapUrls(origin) {
  const url = new URL("/sitemap.xml", origin).href;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(
      (m) => m[1]
    );
    return locs.length ? [...new Set(locs)] : null;
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------- */
/* Main                                                             */
/* --------------------------------------------------------------- */
async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node audit.js <url>");
    process.exit(2);
  }
  let start;
  try {
    start = new URL(arg);
  } catch {
    console.error(`Invalid URL: ${arg}`);
    process.exit(2);
  }
  const origin = start.origin;
  const host = start.hostname;
  const apex = host.replace(/^www\./, "");

  console.log(`\n🔍 Auditing ${origin}\n`);

  /* 1. Seed the crawl ------------------------------------------------ */
  let pages = await getSitemapUrls(origin);
  let seededFrom = "sitemap.xml";
  if (!pages) {
    seededFrom = "homepage crawl";
    pages = [start.href];
  }
  pages = pages.filter((u) => safeAbs(u, origin)).slice(0, MAX_PAGES);
  console.log(`Seeded ${pages.length} page(s) from ${seededFrom}.`);

  const isInternal = (u) => {
    try {
      return new URL(u).hostname === host;
    } catch {
      return false;
    }
  };

  /* 2. Fetch every internal page ------------------------------------- */
  const pageData = new Map(); // url -> { status, html, seo, ids }
  const discovered = new Set(pages);
  const queue = [...pages];

  while (queue.length && pageData.size < MAX_PAGES) {
    const url = queue.shift();
    process.stdout.write(`  fetching ${pageData.size + 1}/${discovered.size}\r`);
    const r = await resolveChain(url, { method: "GET" });
    let html = "";
    if (r.res) {
      try {
        html = await r.res.text();
      } catch {
        /* ignore body read errors */
      }
    }
    pageData.set(url, {
      status: r.status,
      finalUrl: r.finalUrl || url,
      chain: r.chain,
      error: r.error,
      seo: html ? extractSeo(html) : null,
      ids: html ? extractIds(html) : new Set(),
      links: html ? extractLinks(html, r.finalUrl || url) : [],
      images: html ? extractImages(html, r.finalUrl || url) : [],
    });

    // If we crawled from the homepage (no sitemap), discover internal links.
    if (seededFrom === "homepage crawl" && html) {
      for (const { abs } of pageData.get(url).links) {
        if (!abs) continue;
        const clean = abs.split("#")[0];
        if (isInternal(clean) && !discovered.has(clean) && discovered.size < MAX_PAGES) {
          discovered.add(clean);
          queue.push(clean);
        }
      }
    }
    await sleep(POLITE_DELAY_MS);
  }
  process.stdout.write("\n");

  /* 3. Collect unique links & images across all pages ---------------- */
  const linkSources = new Map(); // abs URL -> { texts:Set, pages:Set, isImage }
  for (const [pageUrl, data] of pageData) {
    for (const { abs, text, href } of data.links) {
      if (!abs || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
      const key = abs;
      if (!linkSources.has(key))
        linkSources.set(key, { texts: new Set(), pages: new Set(), isImage: false });
      linkSources.get(key).texts.add(text || href);
      linkSources.get(key).pages.add(pageUrl);
    }
    for (const { abs } of data.images) {
      if (!abs) continue;
      if (!linkSources.has(abs))
        linkSources.set(abs, { texts: new Set(["[image]"]), pages: new Set(), isImage: true });
      linkSources.get(abs).isImage = true;
      linkSources.get(abs).pages.add(pageUrl);
    }
  }

  /* 4. Check every unique URL ---------------------------------------- */
  const urls = [...linkSources.keys()];
  console.log(`Checking ${urls.length} unique link/image URL(s)…`);
  const checks = await mapLimit(urls, LINK_CONCURRENCY, async (u) => {
    // Fragment-only / same-page anchors are validated separately.
    const [bare, frag] = u.split("#");
    let r = await resolveChain(bare, { method: "GET" });
    // Re-check failing external links with a real browser UA before flagging:
    // datacenter/bot blocking (403/404 to crawlers) is not a broken link.
    if ((r.status === 0 || r.status >= 400) && !isInternal(bare)) {
      const retry = await resolveChain(bare, { method: "GET", headers: BROWSER_HEADERS });
      if (retry.status && retry.status < 400) {
        r = { ...retry, botBlocked: true, botStatus: r.status };
      }
    }
    return { url: u, bare, frag, ...r };
  });
  const checkByUrl = new Map(checks.map((c) => [c.url, c]));

  /* 5. Validate fragment anchors ------------------------------------- */
  const brokenAnchors = [];
  for (const [u, src] of linkSources) {
    if (!u.includes("#")) continue;
    const [bare, frag] = u.split("#");
    if (!frag) continue;
    if (!isInternal(bare)) continue; // only validate our own anchors
    const target = pageData.get(bare) || pageData.get(bare + "/") ||
      [...pageData.values()].find((d) => d.finalUrl === bare);
    if (target && target.ids && !target.ids.has(frag)) {
      brokenAnchors.push({ url: u, frag, pages: [...src.pages] });
    }
  }

  /* 6. MX records ---------------------------------------------------- */
  let mx = [];
  let mxError = null;
  try {
    mx = await dns.resolveMx(apex);
  } catch (err) {
    mxError = err.code || String(err.message || err);
  }

  /* 7. Classify ------------------------------------------------------ */
  const internalPages = [...pageData.entries()];
  const internal200 = internalPages.filter(([, d]) => d.status === 200).length;
  const internalBad = internalPages.filter(
    ([, d]) => d.status === 0 || d.status >= 400
  );

  // 401/403/429 mean the server is up and the URL exists — it's just refusing
  // our request (bot protection / rate limiting). That's a warning, not a
  // broken link. Truly broken = network failure (0) or 404/410/5xx etc.
  const BLOCKED = new Set([401, 403, 429]);
  const isBroken = (c) => c.status === 0 || (c.status >= 400 && !BLOCKED.has(c.status));

  const brokenLinks = checks.filter((c) => !isInternal(c.bare) && isBroken(c));
  const blockedLinks = checks.filter(
    (c) => !isInternal(c.bare) && BLOCKED.has(c.status)
  );
  const brokenInternalLinks = checks.filter((c) => isInternal(c.bare) && isBroken(c));
  const redirectChains = checks.filter((c) => c.chain && c.chain.length > 1 && c.status < 400);
  const brokenImages = checks.filter(
    (c) => linkSources.get(c.url)?.isImage && isBroken(c)
  );

  // SEO issues
  const seoIssues = [];
  for (const [url, d] of pageData) {
    if (!d.seo) continue;
    const probs = [];
    if (!d.seo.title) probs.push("no <title>");
    if (!d.seo.description) probs.push("no meta description");
    if (!d.seo.canonical) probs.push("no canonical");
    if (d.seo.h1Count === 0) probs.push("no H1");
    if (d.seo.h1Count > 1) probs.push(`${d.seo.h1Count} H1s`);
    if (!d.seo.ogImage) probs.push("no og:image");
    if (probs.length) seoIssues.push({ url, probs });
  }

  /* 8. Report -------------------------------------------------------- */
  const lines = [];
  const p = (s = "") => lines.push(s);
  p(`# Technical Audit — ${origin}`);
  p();
  p(`**Audit date:** ${new Date().toISOString().slice(0, 10)} · **Method:** crawl seeded from ${seededFrom} (${pageData.size} URLs), polite ${POLITE_DELAY_MS}ms delay, custom User-Agent. Every internal page fetched; every unique link & image checked; fragment anchors validated; per-page SEO extracted; MX checked.`);
  p();
  p("## Executive summary");
  p();
  p("| Metric | Result |");
  p("|---|---|");
  p(`| Pages crawled | **${pageData.size}** |`);
  p(`| Internal pages returning 200 | **${internal200} / ${pageData.size}** ${internal200 === pageData.size ? "✅" : "🔴"} |`);
  p(`| Broken internal links | **${brokenInternalLinks.length}** ${brokenInternalLinks.length ? "🔴" : "✅"} |`);
  p(`| Broken external links | **${brokenLinks.length}** ${brokenLinks.length ? "🔴" : "✅"} |`);
  p(`| Blocked external links (bot protection, 401/403/429) | **${blockedLinks.length}** ${blockedLinks.length ? "⚠️" : "✅"} |`);
  p(`| Redirect chains (links) | **${redirectChains.length}** ${redirectChains.length ? "⚠️" : "✅"} |`);
  p(`| Broken images | **${brokenImages.length}** ${brokenImages.length ? "🔴" : "✅"} |`);
  p(`| Broken fragment anchors | **${brokenAnchors.length}** ${brokenAnchors.length ? "🔴" : "✅"} |`);
  p(`| Pages with SEO issues | **${seoIssues.length}** ${seoIssues.length ? "⚠️" : "✅"} |`);
  p(`| Email (MX on ${apex}) | ${mx.length ? `✅ ${mx.length} record(s)` : `🔴 **no MX records** — cannot receive mail`} |`);
  p();

  function table(title, rows, header) {
    p(`## ${title}`);
    p();
    if (!rows.length) {
      p("_None._");
      p();
      return;
    }
    p(header.join(" | ").replace(/^|$/g, "| "));
    p(header.map(() => "---").join(" | ").replace(/^|$/g, "| "));
    for (const r of rows) p(r.join(" | ").replace(/^|$/g, "| "));
    p();
  }

  table(
    "Broken internal pages (status ≠ 200)",
    internalBad.map(([u, d]) => [d.status || "ERR", u, d.error || ""]),
    ["Status", "URL", "Note"]
  );
  table(
    "Broken external links (4xx/5xx/unreachable)",
    brokenLinks.map((c) => [
      c.status || "ERR",
      c.url,
      [...(linkSources.get(c.url)?.texts || [])].slice(0, 2).join(" / "),
      `${linkSources.get(c.url)?.pages.size || 0} page(s)`,
    ]),
    ["Status", "URL", "Anchor", "Seen on"]
  );
  table(
    "Blocked external links (bot protection — verify manually, not counted as broken)",
    blockedLinks.map((c) => [
      c.status,
      c.url,
      [...(linkSources.get(c.url)?.texts || [])].slice(0, 2).join(" / "),
      `${linkSources.get(c.url)?.pages.size || 0} page(s)`,
    ]),
    ["Status", "URL", "Anchor", "Seen on"]
  );
  table(
    "Broken images",
    brokenImages.map((c) => [c.status || "ERR", c.url, `${linkSources.get(c.url)?.pages.size || 0} page(s)`]),
    ["Status", "URL", "Seen on"]
  );
  table(
    "Redirect chains",
    redirectChains.map((c) => [
      c.chain.map((h) => h.status).join(" → "),
      c.url,
      c.finalUrl || "",
    ]),
    ["Chain", "From", "To"]
  );
  table(
    "Broken fragment anchors",
    brokenAnchors.map((a) => [a.url, `${a.pages.length} page(s)`]),
    ["URL#fragment", "Seen on"]
  );
  table(
    "Pages with SEO issues",
    seoIssues.map((s) => [s.url, s.probs.join(", ")]),
    ["URL", "Issues"]
  );

  const report = lines.join("\n") + "\n";
  const outFile = `audit-report.${host}.md`;
  fs.writeFileSync(outFile, report);

  /* 9. Console summary ---------------------------------------------- */
  console.log("\n────────────────────────────────────────");
  console.log(`Pages crawled:            ${pageData.size}`);
  console.log(`Internal 200:             ${internal200}/${pageData.size}`);
  console.log(`Broken internal links:    ${brokenInternalLinks.length}`);
  console.log(`Broken external links:    ${brokenLinks.length}`);
  console.log(`Blocked (bot protection): ${blockedLinks.length}`);
  console.log(`Redirect chains:          ${redirectChains.length}`);
  console.log(`Broken images:            ${brokenImages.length}`);
  console.log(`Broken fragment anchors:  ${brokenAnchors.length}`);
  console.log(`Pages with SEO issues:    ${seoIssues.length}`);
  console.log(`MX on ${apex}:${" ".repeat(Math.max(1, 18 - apex.length))}${mx.length ? mx.length + " record(s)" : "NONE 🔴"}`);
  console.log("────────────────────────────────────────");
  console.log(`\n📄 Full report written to ${outFile}\n`);

  const hardErrors =
    internalBad.length +
    brokenLinks.length +
    brokenInternalLinks.length +
    brokenImages.length +
    brokenAnchors.length +
    (mx.length ? 0 : 1);
  process.exit(hardErrors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\nAudit failed:", err);
  process.exit(2);
});
