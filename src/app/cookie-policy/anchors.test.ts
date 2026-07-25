/**
 * Regression guard for the Cookie Policy's table of contents.
 *
 * The site's LegalPageLayout renders the ToC and the section bodies from one
 * shared `sections` array (see LegalPageLayout.tsx), so they cannot drift
 * out of sync structurally. This guards the specific failure modes that
 * would matter if that ever changed: a duplicated/missing id, or the
 * page reverting to blanket "by continuing to use the Site you consent"
 * implied-consent language.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const pageSrc = readFileSync(resolve(__dirname, "page.tsx"), "utf8");
const layoutSrc = readFileSync(
  resolve(__dirname, "../../components/LegalPageLayout.tsx"),
  "utf8",
);

function sectionIds(): string[] {
  const start = pageSrc.indexOf("const sections");
  const end = pageSrc.indexOf("\n  ];", start);
  const block = pageSrc.slice(start, end);
  return [...block.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}

describe("cookie policy anchor integrity", () => {
  it("has no duplicate section ids", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("renders exactly the 9 expected sections, in order", () => {
    expect(sectionIds()).toEqual([
      "what-cookies-are",
      "types-we-use",
      "google-analytics",
      "email-marketing-tracking",
      "third-party-cookies",
      "control-cookies",
      "cookie-consent",
      "updates",
      "contact",
    ]);
  });

  it("LegalPageLayout builds the ToC and the body from the same sections array", () => {
    // Two `sections.map` call sites (ToC list, section bodies) reading the
    // same prop — not two separately maintained lists that could disagree.
    const mapCount = (layoutSrc.match(/sections\.map/g) ?? []).length;
    expect(mapCount).toBeGreaterThanOrEqual(2);
  });

  it("never implies that continuing to browse is itself consent to all cookies", () => {
    expect(pageSrc).not.toMatch(/continuing to use the site,? you consent/i);
  });

  it("tells visitors how to reopen their privacy choices", () => {
    expect(pageSrc).toMatch(/privacy choices/i);
  });
});
