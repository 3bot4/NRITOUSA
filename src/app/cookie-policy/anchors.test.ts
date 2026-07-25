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

function sectionsBlock(): string {
  const start = pageSrc.indexOf("const sections");
  const end = pageSrc.indexOf("\n  ];", start);
  return pageSrc.slice(start, end);
}

function sectionIds(): string[] {
  return [...sectionsBlock().matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}

function sectionHeadings(): string[] {
  return [...sectionsBlock().matchAll(/heading:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const EXPECTED_IDS = [
  "what-cookies-are",
  "types-we-use",
  "google-analytics",
  "email-marketing-tracking",
  "third-party-cookies",
  "control-cookies",
  "cookie-consent",
  "updates",
  "contact",
];

describe("cookie policy anchor integrity", () => {
  it("has no duplicate section ids", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("renders exactly the 9 expected sections, numbered 1-9 with no gaps, in order", () => {
    const ids = sectionIds();
    expect(ids).toHaveLength(9);
    expect(ids).toEqual(EXPECTED_IDS);
  });

  it("every ToC href (LegalPageLayout renders `#${s.id}`) resolves to a real section id", () => {
    // LegalPageLayout builds the ToC as `href={`#${s.id}`}` from this exact
    // sections array (see the "same array" test below), so each id here IS
    // the ToC target. This is the literal check that would have caught the
    // reported "6 -> 8" gap: a missing "cookie-consent" entry here means a
    // ToC link to #cookie-consent with no matching rendered section.
    expect(layoutSrc).toContain("href={`#${s.id}`}");
    for (const id of EXPECTED_IDS) {
      expect(sectionIds(), `#${id} must be a real, rendered section`).toContain(id);
    }
  });

  it("LegalPageLayout builds the ToC and the body from the same sections array", () => {
    // Two `sections.map` call sites (ToC list, section bodies) reading the
    // same prop — not two separately maintained lists that could disagree.
    const mapCount = (layoutSrc.match(/sections\.map/g) ?? []).length;
    expect(mapCount).toBeGreaterThanOrEqual(2);
  });

  it("uses the exact requested heading for section 7", () => {
    expect(sectionHeadings()).toContain("Cookie consent and privacy choices");
  });

  it("never implies that continuing to browse is itself consent to all cookies", () => {
    expect(pageSrc).not.toMatch(/continuing to use the site,? you consent/i);
    expect(pageSrc).not.toMatch(/by using the site,? you agree/i);
  });

  it("tells visitors how to reopen their privacy choices", () => {
    expect(pageSrc).toMatch(/privacy choices/i);
  });

  it("commits to a certified CMP before personalized AdSense ads, without claiming one is active", () => {
    expect(pageSrc).toMatch(/google-certified consent-management/i);
    expect(pageSrc).toMatch(/no consent-management platform is\s*\n?\s*active on the site today/i);
  });
});
