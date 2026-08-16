import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  faqs,
  divorceFacts,
  officialSourceLinks,
  indianAuthorities,
  statusImpactRows,
  statusImpactCols,
  h4OptionsRows,
  i751WaiverCols,
  i751WaiverRows,
  i864Terminators,
  gracePeriodComparisonRows,
  priorityEvidence,
  dvResources,
  DV_RESOURCE_INTRO,
  indiaRecognitionRows,
  documentChecklist,
  goodFaithEvidence,
  DOCUMENT_HANDLING_NOTE,
  H4_TIMING_AMBIGUITY,
  SHORT_DISCLAIMER,
  DIVORCE_DISCLAIMER,
  DISCLAIMER_POINTS,
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
const estimatorSrc = readFileSync(
  resolve(__dirname, "../../components/tools/AlimonyEstimator.tsx"),
  "utf8",
);
const faqBlob = faqs.map((f) => `${f.question} ${f.answer}`).join(" ");

/**
 * Prose assertions must survive JSX line wrapping. Prettier breaks a sentence
 * across lines and inserts {" "} at the seam, so a naive regex against raw
 * source fails on formatting rather than on meaning. These collapse both.
 */
const flatten = (s: string) => s.replace(/\{"\s*"\}/g, " ").replace(/\s+/g, " ");
const pageText = flatten(pageSrc);
const dataText = flatten(dataSrc);
const estimatorText = flatten(estimatorSrc);
const allText = `${pageText} ${dataText} ${estimatorText}`;

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
    const all = `${pageText} ${dataText}`;
    expect(all).toMatch(/VAWA/);
    expect(all).toMatch(/must be a US citizen or lawful permanent resident/i);
    expect(all).toMatch(/not available to (an )?H-4|cannot self-petition|is not available in this situation/i);
  });

  it("routes an abused H-4 spouse to the U visa / T visa instead", () => {
    expect(allText).toMatch(/U (visa|or T )?nonimmigrant|U visa/);
    expect(faqBlob).toMatch(/U or T nonimmigrant/);
  });

  it("answers the H-4 VAWA question explicitly in the FAQ", () => {
    const q = faqs.find((f) => /VAWA if my spouse is on H-1B/i.test(f.question));
    expect(q, "the H-4/VAWA FAQ must exist").toBeTruthy();
    expect(q!.answer).toMatch(/^No\./);
    expect(q!.answer).toMatch(/U or T nonimmigrant/);
  });

  it("never lists VAWA as an option for spouses of H-1B/L-1 visa holders", () => {
    // A frequent suggestion is to present VAWA alongside U and T for spouses of
    // temporary visa holders. VAWA requires a USC/LPR abuser, so grouping it
    // there sends the most vulnerable readers down a path that cannot work.
    const blob = `${pageText} ${dataText}`;
    for (const m of blob.matchAll(/H-1B, L-1[^.]{0,120}/gi)) {
      expect(m[0], `VAWA offered to nonimmigrant spouses: ${m[0]}`).not.toMatch(/VAWA/i);
    }
    expect(blob).not.toMatch(/U-?[Vv]isas?, T-?[Vv]isas?,? (or|and) .{0,20}VAWA/);
    expect(blob).not.toMatch(/VAWA.{0,60}regardless of (your |the )?spouse.{0,3}s (immigration )?status/i);
  });

  it("prioritized I-751 evidence is a real subset of the full list", () => {
    expect(priorityEvidence.length).toBeGreaterThanOrEqual(3);
    expect(priorityEvidence.length).toBeLessThan(goodFaithEvidence.length);
    for (const e of priorityEvidence) expect(e.length).toBeGreaterThan(30);
  });

  it("keeps the two-year post-divorce VAWA window stated", () => {
    expect(divorceFacts.vawaAfterDivorce.value).toMatch(/2 years/);
  });
});

describe("the 60-day provision must never be attributed to divorce", () => {
  it("describes it as addressing cessation of employment", () => {
    expect(divorceFacts.gracePeriod60.value).toMatch(/[Cc]essation of employment/);
    expect(divorceFacts.gracePeriod60.note).toMatch(/does not expressly create a 60-day period/i);
    expect(pageText).toMatch(/Do not assume the 60-day provision applies/i);
  });

  it("never tells an H-4 spouse they HAVE 60 days", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/\b(have|get|are allowed|receive) 60 days\b/i);
    expect(all).not.toMatch(
      /60-day grace period (applies|is available|extends|covers) (to )?(a )?(dependent|H-4|spouse)/i,
    );
  });

  it("does not flatly assert 'there is no 60-day grace period'", () => {
    // The regulation is silent rather than prohibitive; the honest framing is
    // "do not assume it applies", not a categorical denial.
    expect(`${pageText} ${dataText}`).not.toMatch(/There is no 60-day grace period/i);
  });
});

describe("divorce vs H-1B job loss — the distinction the 60-day rule turns on", () => {
  it("acknowledges the regulation covers dependents when EMPLOYMENT ends", () => {
    const jobLoss = gracePeriodComparisonRows.find((r) => /loses their job/i.test(r.event));
    expect(jobLoss, "the job-loss row must exist").toBeTruthy();
    expect(jobLoss!.sixty).toMatch(/Yes/);
    expect(jobLoss!.what).toMatch(/his or her dependents/i);
    expect(divorceFacts.gracePeriod60.value).toMatch(/dependents/i);
  });

  it("still declines to extend the 60 days to the end of a marriage", () => {
    const divorce = gracePeriodComparisonRows.find((r) => /divorce/i.test(r.event));
    expect(divorce, "the divorce row must exist").toBeTruthy();
    expect(divorce!.sixty).toMatch(/Do not assume/i);
    expect(divorce!.what).toMatch(/not the end of a marriage/i);
  });

  it("carries the discretionary and no-work-authorization caveats", () => {
    const blob = gracePeriodComparisonRows.map((r) => r.what).join(" ");
    expect(blob).toMatch(/discretion/i);
    expect(blob).toMatch(/does not by itself authorize work/i);
  });

  it("never invents a post-divorce grace period to depart", () => {
    // A "reasonable grace period after the decree" has no primary source and
    // would tell a reader they have time they may not have.
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/reasonable grace period/i);
    expect(all).not.toMatch(/USCIS allows .{0,30}grace period/i);
    expect(all).not.toMatch(/grace period to (depart|leave)/i);
  });
});

describe("support resources are present, correct and reachable", () => {
  it("puts the crisis resources before the legal comparison in the abuse section", () => {
    const abuseIdx = pageText.indexOf('id="abuse"');
    const hotlineIdx = pageText.indexOf("Need confidential help now?");
    const vawaIdx = pageText.indexOf("VAWA self-petition</p>");
    expect(hotlineIdx).toBeGreaterThan(abuseIdx);
    expect(hotlineIdx, "resources must precede the VAWA/U/T comparison").toBeLessThan(vawaIdx);
  });

  it("lists the hotline numbers exactly as the organizations publish them", () => {
    const blob = dvResources.map((r) => `${r.name} ${r.detail}`).join(" ");
    expect(blob).toMatch(/800-799-7233/);
    expect(blob).toMatch(/text START to 88788/i);
    expect(blob).toMatch(/855-812-1001/); // Deaf Hotline video phone
    expect(blob).toMatch(/1-888-373-7888/); // Human Trafficking Hotline
  });

  it("does not publish the retired TTY number for the DV hotline", () => {
    // thehotline.org no longer lists 1-800-787-3224; it points to the Deaf
    // Hotline video phone instead. Publishing a dead number here fails someone
    // at the worst possible moment.
    expect(`${pageText} ${dataText}`).not.toMatch(/787-3224/);
  });

  it("gives every resource a working destination", () => {
    for (const r of dvResources) {
      expect(r.href, `${r.name} needs a link`).toMatch(/^https:\/\//);
      expect(r.detail.length).toBeGreaterThan(10);
    }
  });

  it("does not gate the resources behind an immigration-status test", () => {
    expect(DV_RESOURCE_INTRO).toMatch(/do not need to be a US citizen or permanent resident/i);
  });
});

describe("unlawful presence is stated carefully", () => {
  it("keeps unlawful presence, status violation and unauthorized employment distinct", () => {
    expect(pageText).toMatch(/Status violation/);
    expect(pageText).toMatch(/Unlawful presence/);
    expect(pageText).toMatch(/Unauthorized employment/);
  });

  it("ties the re-entry bars to departure rather than to accrual alone", () => {
    expect(divorceFacts.unlawfulPresence3Year.value).toMatch(/followed by departure/i);
    expect(pageText).toMatch(/re-entry bars turn on/i);
    expect(pageText).toMatch(/departure from the United States/i);
  });

  it("never says accrual begins automatically at the decree", () => {
    expect(`${pageText} ${dataText}`).not.toMatch(/you begin accruing unlawful presence/i);
    expect(pageText).toMatch(/may begin accruing unlawful presence depending on the facts/i);
  });
});

describe("H-4 status and EAD language is not categorical", () => {
  it("says a divorce CAN end the qualifying relationship, not that it ends at an instant", () => {
    expect(H4_TIMING_AMBIGUITY).toMatch(/can end the qualifying relationship/i);
    expect(H4_TIMING_AMBIGUITY).toMatch(/speak with an immigration attorney/i);
    expect(`${pageText} ${dataText}`).not.toMatch(/at the exact (moment|hour)/i);
    expect(`${pageText} ${dataText}`).not.toMatch(/status ends the (moment|instant)/i);
  });

  it("keeps the practical warning about not relying on the printed date", () => {
    expect(H4_TIMING_AMBIGUITY).toMatch(/Do not assume that the expiration date printed/i);
    expect(pageText).toMatch(/should not assume the expiration date printed on the card/i);
  });

  it("does not assert the EAD 'stops being valid' at a named instant", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/stops being valid/i);
    expect(all).not.toMatch(/EAD (goes|ends) with it/i);
  });
});

describe("I-751 waiver mechanics", () => {
  it("distinguishes the joint 90-day window from the waiver's absence of one", () => {
    expect(divorceFacts.i751JointWindow.note).toMatch(/governs JOINT petitions/);
    expect(divorceFacts.i751WaiverWindow.value).toMatch(/before, during or after/i);
    expect(pageText).toMatch(/90-day window governs joint petitions/i);
  });

  it("says a waiver can be filed before the divorce is final, with an RFE for the decree", () => {
    expect(divorceFacts.i751WaiverWindow.note).toMatch(/Request for Evidence/);
    const q = faqs.find((f) => /I-751 if the divorce is not final/i.test(f.question));
    expect(q?.answer).toMatch(/waiver request may be filed once a waiver ground applies/i);
    expect(q?.answer).toMatch(/Request for Evidence/);
  });

  it("publishes all three waiver grounds, not only divorce", () => {
    const grounds = i751WaiverRows.map((r) => r.ground).join(" ");
    expect(grounds).toMatch(/divorce or annulment/i);
    expect(grounds).toMatch(/[Bb]attery or extreme cruelty/);
    expect(grounds).toMatch(/[Ee]xtreme hardship/);
  });
});

describe("the three money obligations stay separate", () => {
  it("states that divorce is not a listed I-864 termination condition", () => {
    expect(pageText).toMatch(/Divorce does not appear on that list/);
    expect(pageText).toMatch(/alongside<\/strong> alimony rather than in place of it/);
  });

  it("tracks the five statutory termination conditions in 8 CFR 213a.2(e)(2)", () => {
    const blob = i864Terminators.join(" ");
    expect(i864Terminators).toHaveLength(5);
    expect(blob).toMatch(/becomes a US citizen/);
    expect(blob).toMatch(/40 qualifying quarters of coverage/);
    expect(blob).toMatch(/no longer a lawful permanent resident and has departed/);
    // The verified wording: a NEW GRANT OF ADJUSTMENT in removal proceedings —
    // not the loose "new status through a different sponsor" of the first draft.
    expect(blob).toMatch(
      /obtains in removal proceedings a new grant of adjustment of status, based on a new affidavit of support/,
    );
    expect(blob).toMatch(/dies/);
    expect(divorceFacts.i864Termination.sourceUrl).toMatch(/213a\.2/);
  });

  it("does not invent termination events or a 'different sponsor' rule", () => {
    const blob = i864Terminators.join(" ");
    expect(blob).not.toMatch(/different sponsor/i);
    expect(blob).not.toMatch(/divorce/i);
  });

  it("does not use 'ends only when' or claim settled law on waiver", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/obligation ends only when/i);
    expect(all).toMatch(/outcomes have varied|results have varied|courts have split/i);
  });

  it("labels the poverty guidelines by year and geography, and flags AK/HI", () => {
    const f = divorceFacts.povertyGuidelines2026;
    expect(f.label).toMatch(/2026 HHS Poverty Guidelines/);
    expect(f.label).toMatch(/48 contiguous states and D\.C\./);
    expect(f.note).toMatch(/Alaska and Hawaii use different poverty guidelines/i);
    expect(f.sourceUrl).toMatch(/^https:\/\/aspe\.hhs\.gov\//);
  });
});

describe("alimony estimator honesty", () => {
  it("models the Texas eligibility requirements, not just the dollar cap", () => {
    expect(calcSrc).toMatch(/TX_MIN_YEARS_MARRIED\s*=\s*10/);
    expect(calcSrc).toMatch(/screened-out/);
    expect(pageText).toMatch(/Texas requires specified eligibility conditions/i);
  });

  it("states the New York income cap and that income above it is discretionary", () => {
    expect(calcSrc).toMatch(/NY_INCOME_CAP_USD\s*=\s*241_000/);
    expect(divorceFacts.nyIncomeCap.value).toBe("$241,000");
    expect(pageText).toMatch(/statutory income cap/i);
  });

  it("labels both columns as illustrative, never as a court award", () => {
    expect(estimatorSrc).toMatch(/Illustrative U\.S\. support benchmark/);
    expect(estimatorSrc).toMatch(/Illustrative Indian maintenance reference point/);
    expect(estimatorSrc).not.toMatch(/>\s*US spousal support\s*</);
    expect(estimatorSrc).not.toMatch(/>\s*India maintenance benchmark\s*</);
  });

  it("carries the not-a-prediction notice before the result, not only after it", () => {
    const noticeIdx = estimatorSrc.indexOf("NOT a prediction of what a court will award");
    const resultIdx = estimatorSrc.indexOf("Illustrative U.S. support benchmark");
    expect(noticeIdx).toBeGreaterThan(-1);
    expect(noticeIdx).toBeLessThan(resultIdx);
    expect(estimatorSrc).toMatch(
      /depends\s*\n?\s*on jurisdiction, income, assets, needs, duration of marriage, applicable law/,
    );
  });

  it("separates benchmark, entitlement and award", () => {
    expect(estimatorSrc).toMatch(/mathematical benchmarks, not legal entitlements and not/);
  });

  it("qualifies the Indian 25% figure BEFORE the number is rendered", () => {
    const qualIdx = estimatorSrc.indexOf("India has no statutory maintenance formula");
    const numIdx = estimatorSrc.indexOf("{inr(result.indiaMonthlyInr)}");
    expect(qualIdx).toBeGreaterThan(-1);
    expect(numIdx).toBeGreaterThan(-1);
    expect(qualIdx).toBeLessThan(numIdx);
    expect(estimatorSrc).toMatch(/not a statutory formula|no statutory maintenance formula/i);
  });

  it("does not claim US income is 'routinely imputed in full'", () => {
    expect(allText).not.toMatch(/routinely imputed/i);
    expect(allText).not.toMatch(/imputed in full/i);
    expect(allText).toMatch(/may consider a spouse(&rsquo;|\u2019|')s actual US income and earning capacity/i);
  });

  it("never presents a guideline figure as an award", () => {
    expect(allText).not.toMatch(/you will (receive|pay) \$/i);
    expect(allText).not.toMatch(/\bguaranteed (award|amount)\b/i);
    expect(allText).toMatch(/discretionary/i);
  });

  it("uses a current exchange rate from a live source", () => {
    expect(DEFAULT_USD_INR).toBeGreaterThan(90);
    expect(divorceFacts.usdInr.value).toBe(`₹${DEFAULT_USD_INR}`);
    // The Yahoo Finance URL used in the first version 404s; the Fed H.10 does not.
    expect(divorceFacts.usdInr.sourceUrl).toMatch(/federalreserve\.gov/);
  });

  it("carries the post-2018 alimony tax treatment", () => {
    expect(divorceFacts.alimonyTaxTreatment.value).toMatch(/[Nn]ot deductible by the payer/);
    expect(divorceFacts.alimonyTaxTreatment.year).toMatch(/December 31, 2018/);
  });
});

describe("no attorney review is claimed", () => {
  it("states plainly that the page has not been reviewed by an attorney", () => {
    expect(pageText).toMatch(/this page has not been reviewed by a lawyer|not been reviewed by an attorney/i);
    expect(DISCLAIMER_POINTS.join(" ")).toMatch(/has not been reviewed by an attorney/i);
  });

  it("explains that the verification date means source verification", () => {
    expect(`${pageText} ${dataText}`).toMatch(/source verification, not (attorney |legal )?review/i);
  });

  it("does not imply NRItoUSA provides legal representation", () => {
    expect(DIVORCE_DISCLAIMER).toMatch(/does not provide legal representation/i);
    // Only NEGATED mentions of attorney review may appear.
    const blob = `${pageText} ${dataText}`;
    for (const m of blob.matchAll(/reviewed by [^.]{0,40}(attorney|lawyer)/gi)) {
      const window = blob.slice(Math.max(0, m.index! - 70), m.index! + 60);
      expect(window, `unnegated attorney-review claim: ${window}`).toMatch(
        /\bnot\b|\bno\b|Nothing|never/i,
      );
    }
  });

  it("shows the short disclaimer in the hero as well as the full one below", () => {
    expect(SHORT_DISCLAIMER).toMatch(/not legal advice/i);
    expect(pageText).toMatch(/topDisclaimer=\{SHORT_DISCLAIMER\}/);
    expect(pageText).toMatch(/\{SHORT_DISCLAIMER\}<\/strong>/);
  });
});

describe("tone", () => {
  it("avoids fear-based framing", () => {
    const all = allText;
    for (const phrase of [
      /most expensive mistake/i,
      /most damaging/i,
      /highest-leverage/i,
      /dead end/i,
      /catches people badly/i,
      /nobody tells you/i,
      /the whole game/i,
    ]) {
      expect(all, `sensational phrase ${phrase} found`).not.toMatch(phrase);
    }
  });
});

describe("India recognition section", () => {
  it("answers 'not automatically' rather than 'frequently not'", () => {
    expect(pageText).toMatch(/Not automatically\. Recognition depends on whether the foreign decree/);
    expect(`${pageText} ${dataText}`).not.toMatch(/Frequently not/);
  });

  it("never claims that MOST US no-fault decrees fail recognition", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/most (American|US|U\.S\.) (divorces|decrees)/i);
    expect(all).not.toMatch(/where most .{0,30}(divorces|decrees) fail/i);
    // The sourced, non-quantified replacement must be present instead.
    expect(all).toMatch(/[Ss]ome US no-fault divorces may face recognition problems/);
  });

  it("names irretrievable breakdown as the point most often needing to be addressed", () => {
    const blob = indiaRecognitionRows.map((r) => Object.values(r).join(" ")).join(" ");
    expect(blob).toMatch(/[Ii]rretrievable breakdown/);
    expect(pageText).toMatch(/not among the grounds for divorce listed in the Hindu Marriage Act/);
  });

  it("attributes the irretrievable-breakdown power to Article 142", () => {
    expect(`${pageText} ${dataText}`).toMatch(/Article 142/);
  });

  it("cites the bigamy provision under its current name without an anecdote", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).toMatch(/Bharatiya Nyaya Sanhita/);
    // The unsourced "this has happened to real NRIs" claim must stay removed.
    expect(all).not.toMatch(/happened to real NRIs/i);
    expect(all).toMatch(/confirm that the divorce is recognized under the law/i);
  });

  it("does not promise Section 13B is faster", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/13B is (usually|always) (the )?(faster|quicker)/i);
    expect(all).toMatch(/may provide a clearer route to establishing marital status/i);
  });

  it("frames Hague/custody as not automatically resolved rather than unenforceable", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).not.toMatch(/not directly enforceable/i);
    expect(all).toMatch(/does not automatically resolve enforcement questions/i);
    expect(all).toMatch(/highly fact-specific/i);
  });

  it("lists the Indian authorities it relies on, each with a point of law", () => {
    expect(indianAuthorities.length).toBeGreaterThanOrEqual(8);
    for (const a of indianAuthorities) {
      expect(a.cite.length).toBeGreaterThan(15);
      expect(a.point.length).toBeGreaterThan(60);
    }
    // Kalyan Dey Chowdhury must be described as a case reference, not a formula.
    const kalyan = indianAuthorities.find((a) => /Kalyan Dey Chowdhury/.test(a.cite));
    expect(kalyan?.point).toMatch(/not a statutory formula/i);
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
    const all = `${faqBlob} ${pageText}`;
    expect(all).not.toMatch(/\byou will qualify\b/i);
    expect(all).not.toMatch(/\byou (do )?qualify for\b/i);
    expect(all).not.toMatch(/\byou are eligible\b/i);
    expect(all).not.toMatch(/\bthis is legal advice\b/i);
    expect(all).not.toMatch(/\byour (petition|waiver) will be approved\b/i);
  });

  it("routes every path to a licensed professional", () => {
    const all = `${pageText} ${dataText}`;
    expect(all).toMatch(/immigration attorney/i);
    expect(all).toMatch(/family lawyer/i);
    expect(all).toMatch(/DOJ-accredited/i);
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
    const all = `${pageText} ${dataText} ${calcSrc} ${estimatorText}`;
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

describe("document checklist", () => {
  it("covers translations, prior filings, residence, insurance and pay records", () => {
    const blob = documentChecklist.join(" ").toLowerCase();
    for (const item of [
      "certified english translations",
      "uscis online account",
      "prior family-court filings",
      "proof of shared residence",
      "insurance records",
      "employment and pay records",
    ]) {
      expect(blob, `checklist should mention "${item}"`).toContain(item);
    }
  });

  it("carries the originals-vs-copies guidance", () => {
    expect(DOCUMENT_HANDLING_NOTE).toMatch(/Keep originals secure/);
    expect(DOCUMENT_HANDLING_NOTE).toMatch(/unless an agency, court, or other authority/);
  });

  it("does not tell readers to apostille everything reflexively", () => {
    const all = documentChecklist.join(" ") + DOCUMENT_HANDLING_NOTE;
    expect(all).not.toMatch(/apostilled if India is involved at all/i);
    expect(DOCUMENT_HANDLING_NOTE).toMatch(
      /Ask the Indian authority, court, consulate, or attorney whether an apostille/i,
    );
  });
});

describe("I-751 waiver table makes the differences obvious", () => {
  it("has a divorce-required column answered for each ground", () => {
    expect(i751WaiverCols.map((c) => c.key)).toContain("divorce");
    expect(i751WaiverRows).toHaveLength(3);
    expect(i751WaiverRows.map((r) => r.divorce)).toEqual(["Generally yes", "No", "No"]);
  });

  it("gives each ground a distinct main issue", () => {
    const issues = i751WaiverRows.map((r) => r.issue);
    expect(new Set(issues).size).toBe(3);
    expect(issues.join(" ")).toMatch(/good faith/i);
    expect(issues.join(" ")).toMatch(/[Aa]buse/);
    expect(issues.join(" ")).toMatch(/[Ee]xtreme hardship/);
  });
});

describe("SEO — the questions people search for are answered as headings", () => {
  const questions = faqs.map((f) => f.question.toLowerCase());
  const has = (re: RegExp) => questions.some((q) => re.test(q));

  it("covers the target long-tail question set", () => {
    for (const [name, re] of [
      ["H-4 spouse stay after divorce", /h-4 spouse stay in the us after divorce/],
      ["H-4 EAD after divorce", /h-4 ead after divorce/],
      ["H-4 to H-1B", /change from h-4 to h-1b/],
      ["H-4 to F-1", /change from h-4 to f-1/],
      ["green card after divorce", /can i get a green card after divorce/],
      ["I-751 after divorce", /what happens to i-751 after divorce/],
      ["I-140 / priority date", /i-140 or my priority date/],
      ["ex-spouse collect under I-864", /ex-spouse collect under the i-864/],
      ["US divorce valid in India", /is a us divorce valid in india/],
    ] as const) {
      expect(has(re), `missing FAQ for: ${name}`).toBe(true);
    }
  });

  it("does not keyword-stuff the question text", () => {
    for (const f of faqs) {
      const words = f.question.toLowerCase().split(/\W+/).filter(Boolean);
      const divorceCount = words.filter((w) => w === "divorce").length;
      expect(divorceCount, `"${f.question}" repeats "divorce"`).toBeLessThanOrEqual(1);
    }
  });
});

describe("page structure follows the intended reading order", () => {
  it("places documents before the calculator, and sources after the FAQs", () => {
    const order = sectionIds();
    const at = (id: string) => order.indexOf(id);
    expect(at("quick-answer")).toBeLessThan(at("h4"));
    expect(at("h4")).toBeLessThan(at("h1b"));
    expect(at("h1b")).toBeLessThan(at("conditional-gc"));
    expect(at("pending")).toBeLessThan(at("abuse"));
    expect(at("abuse")).toBeLessThan(at("i864"));
    expect(at("i864")).toBeLessThan(at("citizenship"));
    expect(at("citizenship")).toBeLessThan(at("india"));
    expect(at("india")).toBeLessThan(at("checklist"));
    expect(at("checklist")).toBeLessThan(at("estimator"));
    expect(at("estimator")).toBeLessThan(at("faq"));
    expect(at("faq")).toBeLessThan(at("sources"));
  });

  it("keeps the ToC in the same order as the sections", () => {
    const order = sectionIds();
    const toc = jumpIds();
    const positions = toc.map((id) => order.indexOf(id));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

describe("table data integrity", () => {
  it("covers every status a reader might hold", () => {
    const blob = statusImpactRows.map((r) => r.status).join(" ");
    for (const s of ["H-4", "H-1B", "Conditional", "10-year", "I-485", "citizen"]) {
      expect(blob).toContain(s);
    }
  });

  it("gives each status an effect, an urgency and a next step", () => {
    expect(statusImpactCols.map((c) => c.key)).toEqual(["status", "effect", "urgency", "next"]);
    for (const r of statusImpactRows) {
      expect(r.effect.length, `${r.status} needs an effect`).toBeGreaterThan(60);
      expect(r.urgency.length, `${r.status} needs an urgency`).toBeGreaterThan(2);
      expect(r.next.length, `${r.status} needs a next step`).toBeGreaterThan(20);
    }
  });

  it("does not rely on colour alone to signal urgency — the level is spelled out", () => {
    for (const r of statusImpactRows) {
      expect(r.urgency).toMatch(/High|Low|None/);
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
