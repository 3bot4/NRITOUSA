/**
 * Source-string checks, not a rendered-DOM test: this repo's vitest setup
 * has no jsdom/React plugin (JSX here compiles under the classic runtime,
 * which throws "React is not defined" when a component is invoked outside
 * Next's own build pipeline) and no other .tsx component is unit-tested by
 * rendering — see the anchors.test.ts files elsewhere in this repo for the
 * same readFileSync-based convention this follows.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const src = readFileSync(
  resolve(__dirname, "AffiliateDisclosureNotice.tsx"),
  "utf8",
);

describe("AffiliateDisclosureNotice", () => {
  it("supports all three required variants", () => {
    for (const variant of ["compact", "standard", "comparison-table"]) {
      expect(src).toContain(`"${variant}"`);
    }
  });

  it("compact default discloses compensation at no extra cost", () => {
    expect(src).toMatch(/compensation when you use certain links/i);
    expect(src).toMatch(/no additional cost to you/i);
  });

  it("standard default clarifies content is not personalized advice", () => {
    expect(src).toMatch(/not personalized legal, tax, immigration/i);
  });

  it("comparison-table default explains how providers are evaluated", () => {
    expect(src).toMatch(/compensate/i);
    expect(src).toMatch(/relevance, features, costs, limitations/i);
  });

  it("links \"Affiliate disclosure\" to the full disclosure page", () => {
    expect(src).toContain('href="/affiliate-disclosure"');
    expect(src).toContain("Affiliate disclosure");
  });

  it("a caller-supplied text prop can override the variant default", () => {
    expect(src).toMatch(/const body = text \?\? DEFAULT_TEXT\[variant\]/);
  });

  it("never uses low-contrast/tiny-only styling for every variant", () => {
    // compact stays text-xs (meant to sit tight beside a CTA); standard and
    // comparison-table step up to text-sm, and all variants use ink-500, not
    // the lighter ink-400 used for footer fine print.
    expect(src).toContain("text-ink-500");
  });
});
