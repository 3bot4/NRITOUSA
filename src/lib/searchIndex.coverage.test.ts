/**
 * Coverage guard for the homepage search box.
 *
 * The rule this locks in: **every URL the site puts in a sitemap must be
 * findable from the homepage search**. The sitemap is already the site's own
 * statement of "these pages are meant to be discovered", so reusing it as the
 * search contract means the two can never drift — publish a page into a
 * sitemap and forget the search index, and this test fails instead of the page
 * quietly becoming unsearchable.
 *
 * Most of the index is derived from the same catalogs that build the sitemap
 * (toolCatalog, articles, the topic and standalone clusters), so adding a page
 * to a catalog satisfies both at once. The hand-maintained SUPPORTING list in
 * searchIndex.ts exists for the pages that belong to no catalog — section
 * indexes and the site/legal pages.
 *
 * The homepage is the single deliberate exclusion: a search result that links
 * you back to the page you are searching from is noise, not a destination.
 */
import { describe, expect, it } from "vitest";
import { searchIndex, searchSite } from "./searchIndex";
import * as sitemapData from "./sitemap-data";

/** Paths that are intentionally absent from the search index. */
const EXCLUDED = new Set(["/"]);

/** Every path across every sitemap segment, de-duplicated. */
const sitemapPaths = [
  ...new Set(
    Object.values(sitemapData)
      .filter((v): v is { path: string }[] => Array.isArray(v))
      .flat()
      .map((entry) => entry?.path)
      .filter((p): p is string => typeof p === "string"),
  ),
];

const indexedHrefs = new Set(searchIndex.map((i) => i.href));

describe("search index covers the sitemap", () => {
  it("finds enough sitemap paths to be a meaningful check", () => {
    // Guards against the projection above silently returning nothing, which
    // would make every assertion below vacuously pass.
    expect(sitemapPaths.length).toBeGreaterThan(300);
  });

  it("indexes every sitemap URL except the deliberate exclusions", () => {
    const missing = sitemapPaths
      .filter((p) => !EXCLUDED.has(p) && !indexedHrefs.has(p))
      .sort();
    expect(missing).toEqual([]);
  });

  it("keeps the exclusion list honest", () => {
    // An excluded path that no longer exists in any sitemap is dead config.
    const stale = [...EXCLUDED].filter((p) => !sitemapPaths.includes(p));
    expect(stale).toEqual([]);
  });

  it("points every result at a page the sitemap still advertises", () => {
    // The other direction. A search result for a retired or mistyped path is
    // worse than a missing one: it sends a reader into a 301 or a 404. Retired
    // topic hubs are the live example — /topics/money-transfer redirects to
    // /send-money-to-india, which carries its own entry.
    const orphans = searchIndex
      .map((i) => i.href.split("#")[0])
      .filter((h) => !sitemapPaths.includes(h))
      .sort();
    expect(orphans).toEqual([]);
  });
});

describe("search index integrity", () => {
  it("has no duplicate hrefs", () => {
    const seen = new Set<string>();
    const dupes = searchIndex
      .map((i) => i.href)
      .filter((h) => (seen.has(h) ? true : (seen.add(h), false)));
    expect(dupes).toEqual([]);
  });

  it("gives every entry a title, description and internal href", () => {
    const broken = searchIndex.filter(
      (i) => !i.title.trim() || !i.description.trim() || !i.href.startsWith("/"),
    );
    expect(broken.map((i) => i.href)).toEqual([]);
  });

  it("leaves the default 'most searched' list driven by analytics, not volume", () => {
    // SUPPORTING entries sit at priority 0 precisely so the curated defaults
    // stay curated. If a bulk import ever lands with a positive priority it
    // would start crowding that list.
    const defaults = searchSite("", 12);
    expect(defaults.every((i) => i.priority > 0)).toBe(true);
  });
});

describe("search finds representative pages by name", () => {
  const cases: [string, string][] = [
    ["40 credits", "/articles/social-security-40-credits-h1b-nri"],
    ["perm timeline", "/perm-timeline"],
    ["i-140 premium", "/i140-premium-processing"],
    ["green card renewal fee", "/green-card-renewal-fee"],
    ["h1b lottery chances", "/h1b-lottery-chances"],
    ["nvc case status", "/nvc-case-status"],
    ["visitor insurance parents", "/visitor-insurance/parents-visiting-usa"],
    ["indian population texas", "/indian-population-in-texas"],
    ["opt calculator", "/education/opt-calculator"],
    ["privacy policy", "/privacy-policy"],
  ];

  it.each(cases)("query %j surfaces %s", (query, href) => {
    const hrefs = searchSite(query, 12).map((r) => r.href);
    expect(hrefs).toContain(href);
  });
});
