#!/usr/bin/env node
/**
 * Submit all live URLs to IndexNow (Bing, Yandex, etc.).
 *
 * Reads the deployed sitemap.xml and POSTs every page URL to the IndexNow API
 * in batches (the API limit is 10,000 URLs/request).
 *
 * /sitemap.xml is a <sitemapindex>, NOT a <urlset> — its <loc> elements are
 * the six child sitemaps, not pages. Scraping <loc> from it directly (which
 * this script used to do) submitted six sitemap files as if they were content
 * URLs and never told IndexNow about a single page. So: detect the index and
 * recurse into each child.
 *
 * Usage:
 *   node scripts/indexnow.mjs                  # submit all sitemap URLs
 *   node scripts/indexnow.mjs <url> [url...]   # submit specific URLs only
 *   node scripts/indexnow.mjs --dry-run        # list what would be submitted
 *
 * Prefer the explicit-URL form after a normal content change: IndexNow is for
 * telling engines what just changed, and resubmitting the whole site on every
 * deploy is noise. The full-sitemap form is for a new-property backfill or
 * after a bulk change.
 *
 * The key file must be live at: https://www.nritousa.com/<KEY>.txt
 */

const KEY = "3f803f9f5b274acba833f51009f58b58";
const HOST = "www.nritousa.com";
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const SITEMAP_URL = `${ORIGIN}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10000; // IndexNow hard limit per request.

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res.text();
}

const locsIn = (xml) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

async function getSitemapUrls() {
  const xml = await fetchXml(SITEMAP_URL);

  // A <urlset> at the top level means a flat sitemap; anything containing
  // <sitemapindex> lists child sitemaps that must be fetched in turn.
  if (!/<sitemapindex[\s>]/.test(xml)) return [...new Set(locsIn(xml))];

  const children = locsIn(xml);
  console.log(`Sitemap index lists ${children.length} child sitemap(s).`);

  const urls = [];
  for (const child of children) {
    const pageUrls = locsIn(await fetchXml(child));
    console.log(`  ${child.replace(ORIGIN, "")} → ${pageUrls.length} URLs`);
    urls.push(...pageUrls);
  }
  return [...new Set(urls)];
}

async function verifyKeyFile() {
  const res = await fetch(KEY_LOCATION);
  if (!res.ok) throw new Error(`Key file not reachable (${res.status}) at ${KEY_LOCATION}`);
  const body = (await res.text()).trim();
  if (body !== KEY) throw new Error(`Key file contents mismatch at ${KEY_LOCATION}`);
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  return res;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const cliUrls = args.filter((a) => !a.startsWith("--"));

  const urls = cliUrls.length ? cliUrls : await getSitemapUrls();
  if (!urls.length) throw new Error("No URLs to submit.");

  // Every URL must be on the declared host or IndexNow rejects the whole batch.
  const offHost = urls.filter((u) => !u.startsWith(`${ORIGIN}/`));
  if (offHost.length) {
    throw new Error(
      `${offHost.length} URL(s) are not on ${HOST}:\n  ${offHost.slice(0, 5).join("\n  ")}`
    );
  }

  if (dryRun) {
    console.log(`\nDry run — ${urls.length} URL(s) would be submitted:`);
    urls.forEach((u) => console.log("  " + u));
    return;
  }

  console.log(`\nVerifying key file at ${KEY_LOCATION} ...`);
  await verifyKeyFile();
  console.log("✓ Key file verified");

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(`Submitting ${batch.length} URL(s) to IndexNow ...`);
    const res = await submit(batch);
    const text = await res.text();

    // IndexNow returns 200 (accepted) or 202 (accepted, pending). Anything else is an error.
    if (res.status === 200 || res.status === 202) {
      console.log(`✓ Accepted (HTTP ${res.status}). ${batch.length} URLs submitted.`);
    } else {
      console.error(`✗ IndexNow returned HTTP ${res.status}`);
      if (text) console.error(text);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
