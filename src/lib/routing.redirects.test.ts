/**
 * Routing + indexing guards for the 2026-09 accuracy pass.
 *
 * Two defects these lock out:
 *
 *  1. /h1b/visa-stamping-after-selection returned a real 404. Every other H-1B
 *     guide lives at /h1b/<slug>, so people and crawlers guessed that form of
 *     the URL, but the article is at the ROOT path. It now 301s.
 *  2. A dynamic route that could not resolve a slug returned `{}` from
 *     generateMetadata, inheriting the root layout's `index, follow` AND a
 *     self-referencing canonical — so a genuine 404 told crawlers to index it
 *     and declared itself canonical.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { notFoundMetadata } from "./seo";
import { h1bChildSlugs } from "./h1bCluster";
import * as sitemapData from "./sitemap-data";

const root = join(__dirname, "..", "..");
const nextConfig = readFileSync(join(root, "next.config.mjs"), "utf8");

const BAD = "/h1b/visa-stamping-after-selection";
const CANONICAL = "/h1b-visa-stamping-after-selection";

const sitemapPaths = [
  ...new Set(
    Object.values(sitemapData)
      .filter((v): v is { path: string }[] => Array.isArray(v))
      .flat()
      .map((e) => e?.path)
      .filter((p): p is string => typeof p === "string"),
  ),
];

describe("the bad stamping slug redirects to the canonical URL", () => {
  it("is not a real h1b cluster slug, so it would otherwise 404", () => {
    expect(h1bChildSlugs).not.toContain("visa-stamping-after-selection");
  });

  it("has exactly one permanent redirect to the root canonical", () => {
    const matches = nextConfig.split(`source: "${BAD}"`).length - 1;
    expect(matches, "expected exactly one redirect rule").toBe(1);
    const idx = nextConfig.indexOf(`source: "${BAD}"`);
    const block = nextConfig.slice(idx, idx + 240);
    expect(block).toContain(`destination: "${CANONICAL}"`);
    expect(block).toContain("permanent: true");
  });

  it("keeps only the canonical URL in the sitemap", () => {
    expect(sitemapPaths).toContain(CANONICAL);
    expect(sitemapPaths).not.toContain(BAD);
  });

  it("has no internal link pointing at the broken nested URL", () => {
    // A redirect is a safety net, not a licence to keep linking at it.
    for (const f of [
      "src/lib/searchIndex.ts",
      "src/lib/sitemap-data.ts",
      "src/lib/h1bCluster.ts",
    ]) {
      expect(readFileSync(join(root, f), "utf8")).not.toContain(BAD);
    }
  });
});

describe("a genuine 404 is noindex with no canonical", () => {
  const meta = notFoundMetadata();

  it("sets robots explicitly on the root not-found page", () => {
    // Omitting it to avoid Next's duplicate `noindex` made the page inherit
    // the ROOT layout's `index, follow` — a real contradiction on a 404. Two
    // agreeing noindex directives are correct; one contradiction is not.
    const nf = readFileSync(join(root, "src/app/not-found.tsx"), "utf8");
    expect(nf).not.toContain("omitRobots");
    expect(nf).toContain("notFoundMetadata()");
  });

  it("emits noindex, follow and nothing contradictory", () => {
    expect(meta.robots).toMatchObject({ index: false, follow: true });
    expect(meta.robots).toMatchObject({
      googleBot: { index: false, follow: true },
    });
  });

  it("suppresses the canonical entirely", () => {
    expect(meta.alternates?.canonical).toBeNull();
  });

  it("is used by the global not-found page", () => {
    const nf = readFileSync(join(root, "src/app/not-found.tsx"), "utf8");
    expect(nf).toContain("notFoundMetadata");
    expect(nf).toContain("export const metadata");
  });

  it("is used by every dynamic route that can fail to resolve a page", () => {
    const routes = [
      "src/app/h1b/[slug]/page.tsx",
      "src/app/uscis/[slug]/page.tsx",
      "src/app/uscis/forms/[slug]/page.tsx",
      "src/app/visa-bulletin/[slug]/page.tsx",
      "src/app/green-card/[slug]/page.tsx",
    ];
    for (const r of routes) {
      const src = readFileSync(join(root, r), "utf8");
      expect(src, `${r} still returns bare {}`).not.toMatch(
        /if \(!page\) return \{\};/,
      );
      expect(src, `${r} does not use notFoundMetadata`).toContain(
        "notFoundMetadata",
      );
    }
  });
});
