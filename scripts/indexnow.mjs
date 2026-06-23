#!/usr/bin/env node
/**
 * Submit all live URLs to IndexNow (Bing, Yandex, etc.).
 *
 * Reads the deployed sitemap.xml, extracts every <loc>, and POSTs the list
 * to the IndexNow API in a single batch (limit is 10,000 URLs/request).
 *
 * Usage:
 *   node scripts/indexnow.mjs                  # submit all sitemap URLs
 *   node scripts/indexnow.mjs <url> [url...]   # submit specific URLs only
 *
 * The key file must be live at: https://www.nritousa.com/<KEY>.txt
 */

const KEY = "3f803f9f5b274acba833f51009f58b58";
const HOST = "www.nritousa.com";
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const SITEMAP_URL = `${ORIGIN}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function getSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(locs)];
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
  const cliUrls = process.argv.slice(2);

  console.log(`Verifying key file at ${KEY_LOCATION} ...`);
  await verifyKeyFile();
  console.log("✓ Key file verified\n");

  const urls = cliUrls.length ? cliUrls : await getSitemapUrls();
  if (!urls.length) throw new Error("No URLs to submit.");

  console.log(`Submitting ${urls.length} URL(s) to IndexNow ...`);
  const res = await submit(urls);
  const text = await res.text();

  // IndexNow returns 200 (accepted) or 202 (accepted, pending). Anything else is an error.
  if (res.status === 200 || res.status === 202) {
    console.log(`✓ Accepted (HTTP ${res.status}). ${urls.length} URLs submitted.`);
  } else {
    console.error(`✗ IndexNow returned HTTP ${res.status}`);
    if (text) console.error(text);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
