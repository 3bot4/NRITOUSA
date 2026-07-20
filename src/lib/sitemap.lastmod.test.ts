/**
 * Regression guard for <lastmod> correctness.
 *
 * Why this exists: every evergreen entry used to default to `new Date()`, so
 * the deployment timestamp was written to ~117 URLs. A layout-only build told
 * Google that a third of the site had changed that day, which is both false and
 * a good way to get the signal ignored. The fallback is now a committed
 * constant (CONTENT_BASELINE), and pages that carry their own date use it.
 *
 * These tests fail if someone reintroduces a build-time date.
 */
import { describe, expect, it } from "vitest";
import { CONTENT_BASELINE, sitemapSegments } from "./sitemap-data";
import { calculators } from "./calculators";

const allEntries = sitemapSegments.flatMap(({ entries }) => entries);

describe("sitemap lastmod", () => {
  it("emits at least one entry", () => {
    // Guards the test itself: an empty list would make everything below vacuous.
    expect(allEntries.length).toBeGreaterThan(100);
  });

  it("never uses a build-time timestamp", () => {
    // A `new Date()` default lands within milliseconds of module import, so
    // the tell is proximity to *now* — not "is it dated today". The baseline
    // is legitimately allowed to be today's date (that is when a content pass
    // happened); what it must never be is the current clock reading.
    //
    // Deliberately not `setHours(0,0,0,0)`: that made the test pass only
    // because the runner's local midnight sat ahead of the baseline's UTC
    // midnight, so it would have failed in a UTC CI container on the day the
    // baseline was set.
    const WINDOW_MS = 5 * 60 * 1000;
    const now = Date.now();

    const buildStamped = allEntries.filter(
      (entry) => Math.abs(now - entry.lastModified.getTime()) < WINDOW_MS,
    );

    expect(
      buildStamped.map((entry) => entry.path),
      "entries dated within minutes of now — did a `new Date()` default come back?",
    ).toEqual([]);
  });

  it("uses a date-only baseline, never a wall-clock instant", () => {
    // A committed constant parses to exact UTC midnight. A captured timestamp
    // would carry hours/minutes/seconds.
    expect(CONTENT_BASELINE.getUTCHours()).toBe(0);
    expect(CONTENT_BASELINE.getUTCMinutes()).toBe(0);
    expect(CONTENT_BASELINE.getUTCSeconds()).toBe(0);
    expect(CONTENT_BASELINE.getUTCMilliseconds()).toBe(0);
  });

  it("has a stable baseline that is not computed at import time", () => {
    // Importing twice must yield the same instant. `new Date()` would not.
    expect(CONTENT_BASELINE.getTime()).toBe(new Date("2026-07-20").getTime());
  });

  it("produces a valid, finite date for every entry", () => {
    for (const entry of allEntries) {
      expect(
        Number.isNaN(entry.lastModified.getTime()),
        `${entry.path} has an Invalid Date`,
      ).toBe(false);
    }
  });

  it("serializes every date as valid ISO 8601", () => {
    const iso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    for (const entry of allEntries) {
      expect(
        entry.lastModified.toISOString(),
        `${entry.path} is not ISO 8601`,
      ).toMatch(iso8601);
    }
  });

  it("never dates a page in the future", () => {
    // A future lastmod is invalid and gets discarded by crawlers.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    for (const entry of allEntries) {
      expect(
        entry.lastModified.getTime(),
        `${entry.path} is dated in the future`,
      ).toBeLessThan(tomorrow.getTime());
    }
  });

  it("lists every canonical URL exactly once across all segments", () => {
    const paths = allEntries.map((entry) => entry.path);
    const dupes = [...new Set(paths.filter((p, i) => paths.indexOf(p) !== i))];
    expect(dupes).toEqual([]);
  });

  it("dates each calculator from its own dataChecked stamp", () => {
    // Not the baseline, and not the build date — the real review date.
    for (const calc of calculators) {
      const entry = allEntries.find(
        (x) => x.path === `/calculators/${calc.slug}`,
      );
      expect(entry, `${calc.slug} is missing from the sitemap`).toBeDefined();
      expect(entry!.lastModified.getTime()).toBe(
        new Date(calc.dataChecked).getTime(),
      );
    }
  });

  it("keeps the retired rent-vs-buy-visa URL out of the sitemap", () => {
    // It 301s to rent-vs-buy-immigrant; a redirect must never be submitted.
    const paths = allEntries.map((entry) => entry.path);
    expect(paths).not.toContain("/calculators/rent-vs-buy-visa");
    expect(paths).toContain("/calculators/rent-vs-buy-immigrant");
  });
});

describe("noindex pages are never submitted", () => {
  // A URL cannot both ask crawlers to skip it and be advertised for crawling.
  // Any page that sets `robots: { index: false }` must stay out of the sitemap.
  const noindexRoutes = walkForNoindex();

  it("finds the noindex routes it is meant to guard", () => {
    // Guards the parser: an empty list would make the assertion vacuous.
    expect(noindexRoutes).toContain("/community/nri-uscis-decisions");
  });

  it.each(noindexRoutes)("%s is not in any sitemap", (route) => {
    expect(allEntries.map((entry) => entry.path)).not.toContain(route);
  });
});

/** Route paths whose page.tsx declares `index: false` in its metadata. */
function walkForNoindex(): string[] {
  const { readFileSync, readdirSync, statSync } = require("node:fs");
  const { join, relative, sep } = require("node:path");
  const APP_DIR = join(__dirname, "..", "app");

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "page.tsx" || name === "page.ts") files.push(full);
    }
  };
  walk(APP_DIR);

  return files
    .filter((f) => /index:\s*false/.test(readFileSync(f, "utf8")))
    .map((f) => {
      const segs = relative(APP_DIR, f).split(sep).slice(0, -1);
      return (
        "/" + segs.filter((s: string) => !(s.startsWith("(") && s.endsWith(")"))).join("/")
      );
    });
}
