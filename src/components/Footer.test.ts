import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cmpActive } from "@/lib/consent";

const footerSrc = readFileSync(resolve(__dirname, "Footer.tsx"), "utf8");

const CANONICAL_LEGAL_LINKS = [
  "/terms-and-conditions",
  "/privacy-policy",
  "/disclaimer",
  "/cookie-policy",
  "/affiliate-disclosure",
];

describe("footer legal links", () => {
  it("links to every canonical legal route", () => {
    for (const href of CANONICAL_LEGAL_LINKS) {
      expect(footerSrc).toContain(`href: "${href}"`);
    }
  });

  it("never links to a legacy legal redirect stub", () => {
    expect(footerSrc).not.toContain('href: "/privacy"');
    expect(footerSrc).not.toContain('href: "/terms-of-use"');
  });

  it("renders the Privacy choices item only in the Company column", () => {
    expect(footerSrc).toContain(
      'col.title === "Company" ? <PrivacyChoicesLink /> : null',
    );
  });
});

describe("privacy choices link", () => {
  it("stays inactive until a CMP is configured (src/lib/consent.ts)", () => {
    expect(cmpActive).toBe(false);
  });
});
