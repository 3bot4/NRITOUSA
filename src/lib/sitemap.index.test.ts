/**
 * Regression guard for the sitemap INDEX and for the deliberate exclusion of
 * the programmatic H-1B sponsor pages.
 *
 * Two things are locked in here:
 *
 * 1. /sitemap.xml is the only sitemap robots.txt and Search Console point at,
 *    so a segment sitemap that exists as a route but is missing from the index
 *    is a segment no crawler ever reads — and nothing else would fail.
 *
 * 2. /h1b-sponsors/<role>/<state> must stay noindex and out of every sitemap.
 *    Those 500 prerendered role×state pages are permutations of the same DOL
 *    data that /tools/h1b-sponsor-finder filters interactively. They shipped
 *    indexable in June 2026 and were orphans — the finder emits exactly one
 *    internal link, for the current search result — with ~66% shared vocabulary
 *    between any two states. The tool page is the single canonical entry point
 *    for this dataset; the permutations stay live but stop competing for the
 *    index. Adding them to a sitemap would re-advertise pages the site is
 *    explicitly asking crawlers to skip.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { sitemapIndexXml, sitemapSegments } from "./sitemap-data";
import { site } from "./site";

const APP_DIR = join(__dirname, "..", "app");
const xml = sitemapIndexXml();
const indexedLocs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

/** Every `sitemap-*.xml` route directory that exists under src/app. */
const routeDirs = readdirSync(APP_DIR).filter(
  (name) => name.startsWith("sitemap-") && name.endsWith(".xml"),
);

describe("sitemap index", () => {
  it("finds the segment routes it is meant to guard", () => {
    // Guards the parser: an empty list would make the assertions vacuous.
    expect(routeDirs.length).toBeGreaterThan(1);
  });

  it("links every segment route that exists on disk, and nothing else", () => {
    // A route handler nobody links to is a sitemap no crawler reads; a link to
    // a route that does not exist is a 404 inside the index.
    const expected = routeDirs.map((name) => `${site.url}/${name}`).sort();
    expect([...indexedLocs].sort()).toEqual(expected);
  });

  it("covers each segment exactly once", () => {
    for (const { name } of sitemapSegments) {
      const hits = indexedLocs.filter((loc) => loc === `${site.url}/${name}`);
      expect(hits, `${name} appears ${hits.length} times in the index`).toHaveLength(1);
    }
  });

  it("gives every segment a valid, non-build-time lastmod", () => {
    const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    expect(lastmods).toHaveLength(indexedLocs.length);

    const iso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const now = Date.now();
    for (const stamp of lastmods) {
      expect(stamp).toMatch(iso8601);
      // Same tell as sitemap.lastmod.test.ts: a `new Date()` default lands
      // within milliseconds of module import.
      expect(Math.abs(now - new Date(stamp).getTime())).toBeGreaterThan(5 * 60 * 1000);
      expect(new Date(stamp).getTime()).toBeLessThan(now);
    }
  });

  it("is well-formed sitemapindex XML on the canonical host", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.trimEnd().endsWith("</sitemapindex>")).toBe(true);
    // Balanced tags — a stray template edit is otherwise silent until a crawler
    // rejects the whole file.
    const open = (xml.match(/<sitemap>/g) ?? []).length;
    const close = (xml.match(/<\/sitemap>/g) ?? []).length;
    expect(open).toBe(close);
    expect(open).toBe(indexedLocs.length);
    for (const loc of indexedLocs) {
      expect(loc.startsWith("https://www.nritousa.com/")).toBe(true);
    }
  });
});

describe("H-1B sponsor permutations stay out of the index", () => {
  const routeSrc = readFileSync(
    join(APP_DIR, "h1b-sponsors", "[socSlug]", "[state]", "page.tsx"),
    "utf8",
  );

  it("marks the role×state route noindex, follow", () => {
    // Not `index: false` alone: the pages link back to the finder and the H-1B
    // cluster, and that equity should still flow.
    expect(routeSrc).toMatch(/robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
  });

  it("has no sitemap segment advertising them", () => {
    // The one indexable entry point for this dataset is the tool page. A
    // sitemap-sponsors.xml route would contradict the noindex above.
    expect(routeDirs).not.toContain("sitemap-sponsors.xml");
    expect(indexedLocs.some((loc) => loc.includes("sponsor"))).toBe(false);
  });

  it("keeps the tool page itself indexable and submitted", () => {
    // The exclusion is scoped to the permutations — losing the tool too would
    // be a silent regression.
    const toolPaths = sitemapSegments
      .flatMap(({ entries }) => entries.map((entry) => entry.path))
      .filter((p) => p === "/tools/h1b-sponsor-finder");
    expect(toolPaths).toEqual(["/tools/h1b-sponsor-finder"]);
  });
});
