/**
 * Regression guard for the Privacy Policy — mirrors
 * src/app/cookie-policy/anchors.test.ts. Guards: the AdSense disclosure
 * section exists with a working Google Ads Settings link, no passive
 * "by using/continuing you agree" consent language remains, and section
 * ordering/ids stay in sync (same shared-array mechanism as the Cookie
 * Policy — see LegalPageLayout.tsx).
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
  "introduction",
  "information-we-collect",
  "sensitive-information",
  "how-we-use-information",
  "analytics-and-cookies",
  "advertising-adsense",
  "email-marketing",
  "sharing-of-information",
  "third-party-links",
  "data-retention",
  "data-security",
  "childrens-privacy",
  "state-privacy-rights",
  "california-notice",
  "international-visitors",
  "do-not-track",
  "biometric-data",
  "changes",
  "contact",
];

describe("privacy policy anchor integrity", () => {
  it("has no duplicate section ids", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("renders exactly the 19 expected sections, in order, with no gaps", () => {
    const ids = sectionIds();
    expect(ids).toHaveLength(19);
    expect(ids).toEqual(EXPECTED_IDS);
  });

  it("places Advertising and Google AdSense immediately after Analytics and cookies", () => {
    const ids = sectionIds();
    const analyticsIndex = ids.indexOf("analytics-and-cookies");
    expect(ids[analyticsIndex + 1]).toBe("advertising-adsense");
  });

  it("every ToC href resolves to a real section id (shared-array mechanism)", () => {
    expect(layoutSrc).toContain("href={`#${s.id}`}");
    for (const id of EXPECTED_IDS) {
      expect(sectionIds(), `#${id} must be a real, rendered section`).toContain(id);
    }
  });

  it('has an "Advertising and Google AdSense" section', () => {
    expect(sectionHeadings()).toContain("Advertising and Google AdSense");
  });

  it("links to Google Ads Settings", () => {
    expect(pageSrc).toContain('href="https://adssettings.google.com/"');
    expect(pageSrc).toMatch(/Google Ads Settings/);
  });

  it("links to Google's privacy policy with descriptive anchor text, not a bare URL in prose", () => {
    expect(pageSrc).toContain('href="https://policies.google.com/privacy"');
  });

  it("states that AdSense is not enabled merely because the policy language exists", () => {
    expect(pageSrc).toMatch(/does not currently enable adsense/i);
  });

  it("never treats continued/optional use as blanket consent to optional tracking", () => {
    expect(pageSrc).not.toMatch(/by using the site,? you agree/i);
    expect(pageSrc).not.toMatch(/continuing to use the site,? you (agree|consent)/i);
  });

  it("does not condition privacy/consent mechanisms on the Site \"targeting\" EU/UK users", () => {
    expect(pageSrc).not.toMatch(/if we begin targeting users in the eu or uk/i);
  });

  it("does not claim complete GDPR/CCPA/global legal compliance", () => {
    expect(pageSrc).not.toMatch(/fully compliant with (the )?(gdpr|ccpa)/i);
    expect(pageSrc).not.toMatch(/guarantees? compliance/i);
  });
});
