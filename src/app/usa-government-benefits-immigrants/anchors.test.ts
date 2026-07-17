import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  faqs,
  officialSourceLinks,
  keyDates,
  benefitFacts,
  stateExamples,
  timelineEvents,
  timelineSummary,
  AS_OF_DATE,
} from "@/data/governmentBenefitsData";

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
    }
  });

  it("keeps public charge and I-864 in separate sections", () => {
    expect(sectionIds()).toContain("public-charge");
    expect(sectionIds()).toContain("i864");
  });
});

/* ------------------------------------------------------------------ *
 * Timeline status is DERIVED, never stored — a badge must not be able to
 * contradict its own date, and device time must never decide a legal claim.
 * ------------------------------------------------------------------ */
describe("timeline status derivation", () => {
  it("returns events in chronological order regardless of authoring order", () => {
    const dates = timelineEvents().map((e) => e.event.dateIso);
    expect(dates).toEqual([...dates].sort());
    // The source array is deliberately NOT chronological; prove sorting matters.
    const authored = keyDates.map((k) => k.dateIso);
    expect(authored).not.toEqual([...authored].sort());
  });

  it("marks a date on or before the as-of date as in effect", () => {
    const events = timelineEvents("2026-07-16");
    const jan = events.find((e) => e.event.dateIso === "2026-01-01");
    expect(jan?.status).toBe("in-effect");
  });

  it("marks exactly one future event as the next change", () => {
    const events = timelineEvents("2026-07-16");
    expect(events.filter((e) => e.status === "next")).toHaveLength(1);
    // On 2026-07-16 the soonest future change is public charge on 2026-09-18.
    expect(events.find((e) => e.status === "next")?.event.dateIso).toBe("2026-09-18");
  });

  it("re-derives correctly as the as-of date moves — no stale badges", () => {
    // After the public-charge transition, Medicaid (Oct 1) becomes "next".
    const later = timelineEvents("2026-09-20");
    expect(later.find((e) => e.event.dateIso === "2026-09-18")?.status).toBe("in-effect");
    expect(later.find((e) => e.status === "next")?.event.dateIso).toBe("2026-10-01");

    // Once every date has passed, nothing claims to be upcoming.
    const allPast = timelineEvents("2030-01-01");
    expect(allPast.every((e) => e.status === "in-effect")).toBe(true);
    expect(timelineSummary("2030-01-01").next).toBeNull();
  });

  it("never derives status from the device clock", () => {
    const src = readFileSync(
      resolve(__dirname, "../../data/governmentBenefitsData.ts"),
      "utf8",
    );
    // AS_OF_DATE must be a maintained constant, not Date.now()/new Date().
    expect(AS_OF_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const asOfBlock = src.slice(src.indexOf("export const AS_OF_DATE"), src.indexOf("export type TimelineStatus"));
    expect(asOfBlock).not.toMatch(/new Date\(\)|Date\.now\(\)/);
  });
});

/* ------------------------------------------------------------------ *
 * Legal accuracy after DHS final rule 2026-14539.
 * These guard the page AND the FAQ schema, which read the same arrays.
 * ------------------------------------------------------------------ */
describe("public-charge legal accuracy", () => {
  const dataSrc = readFileSync(
    resolve(__dirname, "../../data/governmentBenefitsData.ts"),
    "utf8",
  );
  const logicSrc = readFileSync(
    resolve(__dirname, "../../components/government-benefits/benefitsScreenerLogic.ts"),
    "utf8",
  );
  const faqBlob = faqs.map((f) => `${f.question} ${f.answer}`).join(" ");

  it("never states the retired 'primarily dependent' standard as current law", () => {
    // The phrase may ONLY appear as something the new rule removed.
    for (const [name, src] of [["page", pageSrc], ["data", dataSrc], ["logic", logicSrc]] as const) {
      for (const m of src.matchAll(/likely to become primarily dependent/gi)) {
        throw new Error(`${name}: states the retired standard as current law near "${src.slice(Math.max(0, m.index! - 60), m.index! + 60)}"`);
      }
    }
    expect(faqBlob).not.toMatch(/likely to become primarily dependent/i);
  });

  it("uses the current statutory formulation", () => {
    expect(faqBlob + pageSrc).toMatch(/likely at any time to become a public charge/i);
  });

  it("never claims tax credits are not public assistance / never public-charge negatives", () => {
    const all = pageSrc + dataSrc + logicSrc;
    expect(all).not.toMatch(/tax credits are not public assistance/i);
    expect(all).not.toMatch(/never been public-charge negatives/i);
    expect(all).not.toMatch(/never been a ground for deporting/i);
  });

  it("keeps FAQ text and FAQ schema identical by construction", () => {
    // Both ToolFaq and faqJsonLd receive the SAME `faqs` array, so visible text
    // and JSON-LD cannot diverge. Assert the wiring, not a copy.
    expect(pageSrc).toContain("faqJsonLd(faqs)");
    expect(pageSrc).toContain("<ToolFaq items={faqs} />");
  });

  it("renames the misleading FAQ and answers it with the date-scoped wording", () => {
    const q = faqs.find((f) => f.question === "What benefits were excluded under the 2022 public-charge rule?");
    expect(q, "renamed FAQ must exist").toBeTruthy();
    expect(q!.answer).toMatch(/before September 18, 2026/);
    expect(q!.answer).toMatch(/no single benefit automatically determines the outcome/i);
    expect(q!.answer).toMatch(/Non-means-tested earned benefits/i);
    expect(faqs.find((f) => f.question === "What benefits are generally not considered?")).toBeUndefined();
  });

  it("never publishes a definitive post-September counted/not-counted list", () => {
    // publicCharge must expose the 2022 list only, never a post-transition one.
    expect(dataSrc).toMatch(/excludedUnder2022/);
    expect(dataSrc).not.toMatch(/notCountedAfter|excludedAfter|countedAfter/);
  });

  it("states both transition rules and never merges them", () => {
    expect(pageSrc).toMatch(/Two different transition rules/i);
    expect(pageSrc + dataSrc).toMatch(/postmarked or electronically submitted and accepted before September 18, 2026/i);
  });

  it("carries the guidance-monitoring notice", () => {
    expect(dataSrc).toMatch(/additional implementation guidance will be issued on or before September 18, 2026/i);
  });

  it("cites the final rule by document number and links a primary source", () => {
    expect(dataSrc).toContain("2026-14539");
    expect(dataSrc).toContain("https://public-inspection.federalregister.gov/2026-14539.pdf");
    expect(dataSrc).toContain("https://www.federalregister.gov/d/2026-14539");
  });

  it("uses American spelling in this guide's visible copy", () => {
    const all = pageSrc + dataSrc + logicSrc;
    for (const b of [/naturalis/i, /authoris/i, /\bprogramme\b/i, /sceptic/i, /individualis/i, /totalis/i]) {
      expect(all, `British spelling ${b} found`).not.toMatch(b);
    }
  });
});

describe("state examples", () => {
  it("never labels a state generous, strict, best or worst", () => {
    const blob = JSON.stringify(stateExamples).toLowerCase();
    // Word boundaries, not substrings: "strict" lives inside "district of
    // Columbia", which is a legitimate place name.
    for (const word of ["generous", "strict", "best state", "worst state", "harsh", "hostile"]) {
      expect(blob, `state examples must not label a state "${word}"`).not.toMatch(
        new RegExp(`\\b${word}\\b`),
      );
    }
  });

  it("names one program, an affected group, a year and an official source each", () => {
    expect(stateExamples.length).toBeGreaterThanOrEqual(3);
    for (const s of stateExamples) {
      expect(s.program.length).toBeGreaterThan(3);
      expect(s.who.length).toBeGreaterThan(3);
      expect(s.year).toMatch(/^\d{4}$/);
      expect(s.sourceUrl).toMatch(/^https:\/\/[a-z0-9.-]*\.(gov|ca\.gov)\//);
      expect(s.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
