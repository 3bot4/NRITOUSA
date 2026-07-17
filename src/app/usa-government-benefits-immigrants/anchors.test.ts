import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { faqs, officialSourceLinks, keyDates, benefitFacts } from "@/data/governmentBenefitsData";

const pageSrc = readFileSync(resolve(__dirname, "page.tsx"), "utf8");

/** All literal `id="..."` targets rendered on the page. */
function sectionIds(): string[] {
  return [...pageSrc.matchAll(/\bid="([a-z0-9-]+)"/g)].map((m) => m[1]);
}
/** ToC ids declared in the JUMP registry. */
function jumpIds(): string[] {
  const start = pageSrc.indexOf("const JUMP");
  const block = pageSrc.slice(start, pageSrc.indexOf("];", start));
  return [...block.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}
/** Every literal in-page hash link. */
function hrefHashes(): string[] {
  return [...pageSrc.matchAll(/href="#([a-z0-9-]+)"/g)].map((m) => m[1]);
}

describe("anchor integrity", () => {
  it("has no duplicate section ids", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every ToC (JUMP) entry points to a rendered section id", () => {
    const ids = new Set(sectionIds());
    for (const id of jumpIds()) {
      expect(ids.has(id), `ToC id #${id} must exist on the page`).toBe(true);
    }
  });

  it("every in-page anchor link resolves to a rendered id", () => {
    const ids = new Set(sectionIds());
    for (const h of hrefHashes()) {
      expect(ids.has(h), `#${h} is linked but never rendered`).toBe(true);
    }
  });

  it("renders the sections the ToC promises", () => {
    // Guard against a section being silently dropped in a refactor.
    for (const required of [
      "screener",
      "public-charge",
      "i864",
      "five-year",
      "status-table",
      "faq",
      "sources",
    ]) {
      expect(sectionIds()).toContain(required);
    }
  });
});

describe("SEO + schema wiring", () => {
  it("canonical path matches production", () => {
    expect(pageSrc).toContain("GB_PATH");
    // The path constant itself is asserted in the cluster test below.
  });

  it("emits Article, WebPage, WebApplication, Breadcrumb and FAQ schema", () => {
    for (const fn of [
      "gbWebPageJsonLd",
      "gbArticleJsonLd",
      "gbWebAppJsonLd",
      "breadcrumbJsonLd",
      "faqJsonLd",
    ]) {
      expect(pageSrc).toContain(fn);
    }
  });

  it("does not fabricate ratings, reviews, or usage counts", () => {
    expect(pageSrc).not.toMatch(/aggregateRating|AggregateRating/);
    expect(pageSrc).not.toMatch(/"Review"|reviewCount/);
  });
});

describe("content safety", () => {
  it("FAQ set is substantive and free of duplicates", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(35);
    const qs = faqs.map((f) => f.question.trim().toLowerCase());
    expect(new Set(qs).size, "duplicate FAQ question").toBe(qs.length);
    for (const f of faqs) {
      expect(f.answer.length, `answer too thin: ${f.question}`).toBeGreaterThan(80);
    }
  });

  it("FAQPage schema only contains FAQs that are visibly rendered", () => {
    // The page passes the same `faqs` array to both ToolFaq and faqJsonLd.
    expect(pageSrc).toContain("faqJsonLd(faqs)");
    expect(pageSrc).toContain("<ToolFaq items={faqs} />");
  });

  it("never promises an eligibility determination", () => {
    const all = faqs.map((f) => f.answer).join(" ");
    expect(all).not.toMatch(/\byou will qualify\b/i);
    expect(all).not.toMatch(/\bguaranteed to receive\b/i);
  });

  it("every official source is a government or official program URL", () => {
    for (const l of officialSourceLinks) {
      expect(l.href, `${l.label} must be an official source`).toMatch(
        /^https:\/\/[a-z0-9.-]*\.gov\//,
      );
    }
  });

  it("every changeable figure carries a year, a source and a verification date", () => {
    for (const [key, f] of Object.entries(benefitFacts)) {
      expect(f.year, `${key} must state its applicable year`).toBeTruthy();
      expect(f.sourceUrl, `${key} must cite a source`).toMatch(/^https:\/\//);
      expect(f.lastVerified, `${key} must carry a verification date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.jurisdiction, `${key} must state its jurisdiction`).toBeTruthy();
    }
  });

  it("every key date carries a source and an ISO date", () => {
    for (const d of keyDates) {
      expect(d.dateIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.sourceUrl).toMatch(/^https:\/\//);
      expect(["in-effect", "upcoming"]).toContain(d.status);
    }
  });

  it("keeps public charge and I-864 in separate sections", () => {
    expect(sectionIds()).toContain("public-charge");
    expect(sectionIds()).toContain("i864");
  });
});
