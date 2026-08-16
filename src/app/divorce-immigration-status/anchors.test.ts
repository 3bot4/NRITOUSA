import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  faqs,
  divorceFacts,
  officialSourceLinks,
  indianAuthorities,
  statusImpactRows,
  h4OptionsRows,
  i751WaiverRows,
  indiaRecognitionRows,
  DEFAULT_USD_INR,
  RULES_LAST_VERIFIED,
} from "@/data/divorceImmigrationData";
import {
  DIV_PATH,
  DIV_PUBLISHED,
  DIV_UPDATED,
  relatedGuideLinks,
} from "@/lib/divorceImmigrationCluster";
import { searchSite, searchIndex } from "@/lib/searchIndex";
import { immigrationEntries, sitemapSegments } from "@/lib/sitemap-data";

/** Every canonical path the site publishes, across all five sitemap segments. */
const allSitemapPaths = new Set(
  sitemapSegments.flatMap((s) => s.entries.map((e) => e.path)),
);

const pageSrc = readFileSync(resolve(__dirname, "page.tsx"), "utf8");
const dataSrc = readFileSync(
  resolve(__dirname, "../../data/divorceImmigrationData.ts"),
  "utf8",
);
const calcSrc = readFileSync(resolve(__dirname, "../../lib/calc/alimonyEstimate.ts"), "utf8");
const faqBlob = faqs.map((f) => `${f.question} ${f.answer}`).join(" ");

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
    for (const required of [
      "quick-answer",
      "h4",
      "conditional-gc",
      "pending",
      "abuse",
      "i864",
      "citizenship",
      "estimator",
      "india",
      "sources",
      "faq",
    ]) {
      expect(sectionIds()).toContain(required);
    }
  });
});

describe("SEO + schema wiring", () => {
  it("canonical path is the production slug", () => {
    expect(DIV_PATH).toBe("/divorce-immigration-status");
    expect(pageSrc).toContain("path: DIV_PATH");
  });

  it("emits Article, WebPage, WebApplication, Breadcrumb and FAQ schema", () => {
    for (const fn of [
      "divWebPageJsonLd",
      "divArticleJsonLd",
      "divWebAppJsonLd",
      "breadcrumbJsonLd",
      "faqJsonLd",
    ]) {
      expect(pageSrc).toContain(fn);
    }
  });

  it("does not fabricate ratings, reviews or usage counts", () => {
    expect(pageSrc).not.toMatch(/aggregateRating|AggregateRating/);
    expect(pageSrc).not.toMatch(/"Review"|reviewCount/);
  });

  it("carries coherent publish/modified dates", () => {
    for (const d of [DIV_PUBLISHED, DIV_UPDATED, RULES_LAST_VERIFIED]) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(new Date(DIV_UPDATED) >= new Date(DIV_PUBLISHED)).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 * Legal accuracy. These are the claims the draft of this page got wrong,
 * and each one is a real-world dead end for the reader if it regresses.
 * ------------------------------------------------------------------ */
describe("VAWA eligibility — the prerequisite that must never be dropped", () => {
  it("never offers VAWA to an H-4 spouse without naming the citizen/LPR requirement", () => {
    // Any mention of VAWA alongside H-4 must sit near the prerequisite.
    const all = pageSrc + dataSrc;
    expect(all).toMatch(/VAWA/);
    expect(all).toMatch(/must be a US citizen or lawful permanent resident/i);
    expect(all).toMatch(/not available to (an )?H-4|cannot self-petition|is not available to you/i);
  });

  it("routes an abused H-4 spouse to the U visa / T visa instead", () => {
    expect(pageSrc + dataSrc).toMatch(/U visa/);
    expect(faqBlob).toMatch(/U visa/);
  });

  it("answers the H-4 VAWA question explicitly in the FAQ", () => {
    const q = faqs.find((f) => /VAWA if my spouse is on H-1B/i.test(f.question));
    expect(q, "the H-4/VAWA FAQ must exist").toBeTruthy();
    expect(q!.answer).toMatch(/^No\./);
    expect(q!.answer).toMatch(/U visa/);
  });

  it("keeps the two-year post-divorce VAWA window stated", () => {
    expect(divorceFacts.vawaAfterDivorce.value).toMatch(/2 years/);
  });
});

describe("the 60-day grace period must never be attributed to divorce", () => {
  it("states that it covers cessation of employment, not a lost marriage", () => {
    expect(divorceFacts.gracePeriod60.value).toMatch(/[Cc]essation of employment/);
    expect(pageSrc).toMatch(/no 60-day grace period/i);
  });

  it("never tells an H-4 spouse they HAVE 60 days", () => {
    // The myth may be named in order to debunk it; it may never be asserted.
    const all = pageSrc + dataSrc;
    expect(all).not.toMatch(/\b(have|get|are allowed|receive) 60 days\b/i);
    expect(all).not.toMatch(
      /60-day grace period (applies|is available|extends|covers) (to )?(a )?(dependent|H-4|spouse)/i,
    );
    // …and the debunk itself must still be present.
    expect(all).toMatch(/has no regulatory basis|does not extend to a dependent/i);
  });
});

describe("unlawful presence bars attach on departure", () => {
  it("says so, rather than implying the accrual alone is the trigger", () => {
    expect(divorceFacts.unlawfulPresence3Year.note).toMatch(/on DEPARTURE/);
    expect(pageSrc + faqBlob).toMatch(/departing after accruing it|then departing/i);
  });
});

describe("I-751 waiver mechanics", () => {
  it("distinguishes the joint 90-day window from the waiver's absence of one", () => {
    expect(divorceFacts.i751JointWindow.note).toMatch(/JOINT petitions only/);
    expect(divorceFacts.i751WaiverWindow.value).toMatch(/before, during or after/i);
    expect(pageSrc).toMatch(/90-day window does not apply to a waiver/i);
  });

  it("says a waiver can be filed before the divorce is final, with an RFE for the decree", () => {
    expect(divorceFacts.i751WaiverWindow.note).toMatch(/Request for Evidence/);
    const q = faqs.find((f) => /I-751 if the divorce is not final/i.test(f.question));
    expect(q?.answer).toMatch(/^Yes\./);
  });

  it("publishes all three waiver grounds, not only divorce", () => {
    const grounds = i751WaiverRows.map((r) => r.ground).join(" ");
    expect(grounds).toMatch(/divorce or annulment/i);
    expect(grounds).toMatch(/[Bb]attery or extreme cruelty/);
    expect(grounds).toMatch(/[Ee]xtreme hardship/);
  });
});

describe("the three money obligations stay separate", () => {
  it("states that I-864 survives the divorce and runs alongside alimony", () => {
    expect(pageSrc).toMatch(/Divorce is not on that list/);
    expect(pageSrc).toMatch(/alongside<\/strong> alimony, not instead of it/);
  });

  it("does not claim a settlement can simply waive the I-864", () => {
    const all = pageSrc + dataSrc;
    expect(all).not.toMatch(/waiv\w+ the I-864 (ends|terminates|disposes)/i);
    expect(all).toMatch(/not automatically/i);
  });
});

describe("alimony estimator honesty", () => {
  it("models the Texas eligibility gate, not just the dollar cap", () => {
    expect(calcSrc).toMatch(/TX_MIN_YEARS_MARRIED\s*=\s*10/);
    expect(calcSrc).toMatch(/screened-out/);
    expect(pageSrc).toMatch(/Texas has an eligibility gate/i);
  });

  it("states the New York income cap and that income above it is discretionary", () => {
    expect(calcSrc).toMatch(/NY_INCOME_CAP_USD\s*=\s*241_000/);
    expect(divorceFacts.nyIncomeCap.value).toBe("$241,000");
    expect(pageSrc).toMatch(/statutory income cap/i);
  });

  it("never presents a guideline figure as an award", () => {
    const all = pageSrc + dataSrc;
    expect(all).not.toMatch(/you will (receive|pay) \$/i);
    expect(all).not.toMatch(/\bguaranteed (award|amount)\b/i);
    expect(all).toMatch(/discretionary/i);
  });

  it("uses a current exchange rate, not the stale ~₹87 of the draft", () => {
    expect(DEFAULT_USD_INR).toBeGreaterThan(90);
    expect(divorceFacts.usdInr.value).toBe(`₹${DEFAULT_USD_INR}`);
  });

  it("carries the post-2018 alimony tax treatment", () => {
    expect(divorceFacts.alimonyTaxTreatment.value).toMatch(/[Nn]ot deductible by the payer/);
    expect(divorceFacts.alimonyTaxTreatment.year).toMatch(/December 31, 2018/);
  });
});

describe("India recognition section", () => {
  it("names irretrievable breakdown as the condition most US decrees fail", () => {
    const blob = indiaRecognitionRows.map((r) => Object.values(r).join(" ")).join(" ");
    expect(blob).toMatch(/[Ii]rretrievable breakdown/);
    expect(pageSrc).toMatch(/not\s*\n?\s*a ground for divorce under the Hindu Marriage Act/);
  });

  it("credits Article 142 as the only route to an irretrievable-breakdown decree", () => {
    expect(pageSrc + dataSrc).toMatch(/Article 142/);
  });

  it("cites the bigamy provision under its current name", () => {
    expect(pageSrc + dataSrc).toMatch(/Bharatiya Nyaya Sanhita/);
  });

  it("lists the Indian authorities it relies on, each with a point of law", () => {
    expect(indianAuthorities.length).toBeGreaterThanOrEqual(8);
    for (const a of indianAuthorities) {
      expect(a.cite.length).toBeGreaterThan(15);
      expect(a.point.length).toBeGreaterThan(60);
    }
  });
});

/* ------------------------------------------------------------------ *
 * Content safety + house style
 * ------------------------------------------------------------------ */
describe("content safety", () => {
  it("FAQ set is substantive and free of duplicates", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(25);
    const qs = faqs.map((f) => f.question.trim().toLowerCase());
    expect(new Set(qs).size, "duplicate FAQ question").toBe(qs.length);
    for (const f of faqs) {
      expect(f.answer.length, `answer too thin: ${f.question}`).toBeGreaterThan(120);
    }
  });

  it("FAQPage schema only contains FAQs that are visibly rendered", () => {
    expect(pageSrc).toContain("faqJsonLd(faqs)");
    expect(pageSrc).toContain("<ToolFaq items={faqs} />");
  });

  it("never gives a legal determination", () => {
    // Rules are stated impersonally ("as soon as a waiver ground applies");
    // the page never tells a reader what their own outcome will be.
    const all = faqBlob + pageSrc;
    expect(all).not.toMatch(/\byou will qualify\b/i);
    expect(all).not.toMatch(/\byou (do )?qualify for\b/i);
    expect(all).not.toMatch(/\byou are eligible\b/i);
    expect(all).not.toMatch(/\bthis is legal advice\b/i);
    expect(all).not.toMatch(/\byour (petition|waiver) will be approved\b/i);
  });

  it("routes every path to a licensed professional", () => {
    expect(pageSrc + dataSrc).toMatch(/immigration attorney/i);
    expect(pageSrc + dataSrc).toMatch(/family lawyer/i);
    expect(pageSrc + dataSrc).toMatch(/DOJ-accredited/i);
  });

  it("every official source is a government, court or statute URL", () => {
    for (const l of officialSourceLinks) {
      expect(l.href, `${l.label} must be an official source`).toMatch(
        /^https:\/\/([a-z0-9.-]*\.gov|statutes\.capitol\.texas\.gov|www\.ecfr\.gov)\//,
      );
    }
  });

  it("every changeable figure carries a year, a jurisdiction, a source and a check date", () => {
    for (const [key, f] of Object.entries(divorceFacts)) {
      expect(f.year, `${key} must state what it applies to`).toBeTruthy();
      expect(f.jurisdiction, `${key} must state its jurisdiction`).toBeTruthy();
      expect(f.sourceUrl, `${key} must cite a source`).toMatch(/^https:\/\//);
      expect(f.lastVerified, `${key} must carry a check date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("uses American spelling in visible copy", () => {
    const all = pageSrc + dataSrc + calcSrc;
    for (const b of [/naturalis/i, /recognis/i, /authoris/i, /\bprogramme\b/i, /\bdependants\b/i]) {
      expect(all, `British spelling ${b} found`).not.toMatch(b);
    }
  });

  it("keeps every internal link relative and every external link off the page top", () => {
    // Outbound links belong in the sources box and fact chips, never in the
    // intro or a top-of-page CTA (site-wide rule).
    const beforeEstimator = pageSrc.slice(0, pageSrc.indexOf('id="estimator"'));
    expect(beforeEstimator).not.toMatch(/<a\s+href="https?:\/\//);
  });
});

/* ------------------------------------------------------------------ *
 * Discoverability. A page nobody can reach is a page that does not exist,
 * and these three wirings live in three different files — exactly the kind
 * of thing that silently rots in a refactor.
 * ------------------------------------------------------------------ */
describe("discoverability", () => {
  it("is in the immigration sitemap exactly once", () => {
    const hits = immigrationEntries.filter((x) => x.path === DIV_PATH);
    expect(hits).toHaveLength(1);
    expect(hits[0].priority).toBeGreaterThanOrEqual(0.8);
  });

  it("is in the site search index", () => {
    expect(searchIndex.some((i) => i.href === DIV_PATH)).toBe(true);
  });

  it("surfaces for the queries people actually type", () => {
    for (const q of [
      "divorce",
      "h4 divorce",
      "divorce green card",
      "i-751 waiver",
      "alimony",
      "affidavit of support divorce",
      "us divorce valid in india",
    ]) {
      const hrefs = searchSite(q, 10).map((r) => r.href);
      expect(hrefs, `"${q}" should surface the divorce guide`).toContain(DIV_PATH);
    }
  });

  it("links only to routes that exist", () => {
    // Guards against a related-link map pointing at a page that was renamed.
    for (const l of relatedGuideLinks) {
      expect(l.href, `${l.label} must be an internal root-relative path`).toMatch(/^\/[a-z0-9/-]*$/);
      expect(
        allSitemapPaths.has(l.href) || searchIndex.some((i) => i.href === l.href),
        `${l.href} is linked from the divorce page but is not a known route`,
      ).toBe(true);
    }
  });
});

describe("table data integrity", () => {
  it("covers every status a reader might hold", () => {
    const blob = statusImpactRows.map((r) => r.status).join(" ");
    for (const s of ["H-4", "H-1B", "Conditional", "10-year", "I-485", "citizen"]) {
      expect(blob).toContain(s);
    }
  });

  it("gives each H-4 alternative a work answer and a lead time", () => {
    for (const r of h4OptionsRows) {
      expect(r.works.length).toBeGreaterThan(1);
      expect(r.lead.length).toBeGreaterThan(4);
      expect(r.reality.length).toBeGreaterThan(60);
    }
  });
});
