/**
 * Content + accuracy guards for the 2026-08 SEO audit pass.
 *
 * Covers the six changes made in response to the external audit CSV:
 *   1. New /visa-bulletin/cross-chargeability cluster page (INA §202(b)).
 *   2. Priority Date Checker wired to the tested estimateWait() velocity math.
 *   3. Interfiling / transfer of underlying basis on /i485-processing-time.
 *   4. Surrender Certificate + emergency travel on /india-visa-from-usa.
 *   5. General free allowance vs gold allowance + ATITHI on the gold page.
 *   6. Dual India/US tax calendar on /india-tax-compliance.
 *
 * These assert the FACTS that make each page correct, so a future rewrite
 * cannot silently reintroduce the errors the audit itself contained (e.g.
 * "40g for females, 20g for males", or stacking the ₹75,000 general allowance
 * on top of the gold allowance).
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  visaBulletinChildPages,
  getVisaBulletinChildPage,
} from "./visaBulletinCluster";
import { extractFaq } from "./seo";
import { estimateWait } from "./visa-bulletin";
import {
  goldDutyConfig,
  allowanceContrastRows,
  customsDeclaration,
  goldFaqs,
} from "@/data/goldCustomsData";
import {
  surrenderCertificate,
  emergencyVisa,
  touristStayLimits,
  hubFaqs as indiaVisaFaqs,
} from "@/data/indiaVisaData";
import {
  taxCalendar,
  fyAyMapping,
  foreignTaxCreditTiming,
  yearOffsetExplainer,
  residencyTests,
  nreVsNroRows,
  NRE_NRO_TRAP,
} from "@/data/nriTaxCalendarData";

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

const checkerWidget = read("src/components/tools/PriorityDateChecker.tsx");
const i485Page = read("src/app/i485-processing-time/page.tsx");
const goldPage = read("src/app/gold-limit-usa-to-india/page.tsx");
const indiaVisaPage = read("src/app/india-visa-from-usa/page.tsx");
const taxPage = read("src/app/india-tax-compliance/page.tsx");

/* ───────────────────────── 1. Cross-chargeability ──────────────────────── */

describe("cross-chargeability page", () => {
  const page = getVisaBulletinChildPage("cross-chargeability");

  it("exists in the visa bulletin cluster", () => {
    expect(page).toBeTruthy();
  });

  it("cites the correct statute for the spouse rule", () => {
    // The spouse rule is §202(b)(2). Getting this wrong sends readers to the
    // wrong provision in a conversation with their attorney.
    expect(page!.content).toMatch(/§202\(b\)\(2\)/);
    expect(page!.content).toMatch(/8 U\.S\.C\. §1152\(b\)/);
    // YMYL: the statute must be a resolvable citation, not a bare mention.
    expect(page!.content).toContain(
      "https://www.law.cornell.edu/uscode/text/8/1152"
    );
  });

  it("states the derivative direction of the rule, not just spouse-to-principal", () => {
    expect(page!.content).toMatch(
      /derivative spouse or child can be charged to the principal/i
    );
  });

  it("answers the H-4 spouse question", () => {
    const faqs = extractFaq(page!.content);
    const h4 = faqs.find((f) => /H-4/.test(f.question));
    expect(h4).toBeTruthy();
    expect(h4!.answer).toMatch(/[Yy]es/);
    // H-4 is a nonimmigrant status; chargeability is about birth.
    expect(h4!.answer).toMatch(/country of birth/i);
  });

  it("states chargeability follows country of BIRTH, not citizenship", () => {
    expect(page!.content).toMatch(/country of birth/i);
    expect(page!.content).toMatch(/[Nn]ot your citizenship|[Nn]ot citizenship/);
  });

  it("warns that a USC/LPR spouse cannot provide cross-chargeability", () => {
    // The single most common disqualifier — must be stated, not implied.
    expect(page!.content).toMatch(
      /U\.S\. citizen or (a )?(lawful permanent resident|green card holder)/i
    );
    expect(page!.content).toMatch(/cannot be (a |your )?derivative/i);
  });

  it("states it does NOT change the priority date", () => {
    expect(page!.content).toMatch(/does \*\*not\*\* change your priority date|not change your priority date/i);
  });

  it("covers the Gulf-birth case that NRI readers most often miss", () => {
    expect(page!.content).toMatch(/UAE/);
    expect(page!.content).toMatch(/§202\(b\)\(4\)/);
    // (b)(4) only redirects when neither parent was born there AND neither
    // resided there — the residence prong is what defeats it for Gulf births.
    expect(page!.content).toMatch(/residence/i);
  });

  it("does not promise the benefit is automatic", () => {
    expect(page!.content).toMatch(/never applied automatically|not automatic/i);
  });

  it("emits FAQ schema (H3 questions under an FAQ H2)", () => {
    const faqs = extractFaq(page!.content);
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(faqs.every((f) => f.question.length > 0 && f.answer.length > 0)).toBe(true);
  });

  it("is linked from the EB category pages so it is not an orphan", () => {
    for (const slug of ["eb1-india", "eb2-india", "eb3-india", "priority-date"]) {
      const sibling = getVisaBulletinChildPage(slug)!;
      expect(sibling.content).toContain("/visa-bulletin/cross-chargeability");
    }
  });

  it("is reachable from the i485 processing page", () => {
    expect(i485Page).toContain("/visa-bulletin/cross-chargeability");
  });
});

/* ─────────────────── 2. Priority Date Checker projection ───────────────── */

describe("priority date checker — velocity projection", () => {
  it("uses the shared estimateWait math rather than a local reimplementation", () => {
    expect(checkerWidget).toMatch(/estimateWait/);
    expect(checkerWidget).toMatch(/from "@\/lib\/visa-bulletin"/);
  });

  it("labels the projection as arithmetic, not a forecast", () => {
    expect(checkerWidget).toMatch(/not a forecast/i);
    // Must not claim predictive power over the bulletin.
    expect(/we predict|will become current on|guaranteed to be current/i.test(checkerWidget)).toBe(
      false
    );
  });

  it("suppresses a projection when the cutoff is retrogressing or stalled", () => {
    expect(checkerWidget).toMatch(/retrogressing/);
    expect(checkerWidget).toMatch(/stalled/);
  });

  it("produces a usable estimate for a backlogged India case", () => {
    const e = estimateWait("2015-06-01", "eb3", "india");
    expect(["estimate", "stalled", "retrogressing", "unavailable"]).toContain(e.status);
    if (e.status === "estimate") {
      expect(e.monthsBehind).toBeGreaterThan(0);
      expect(e.optimisticMonths).not.toBeNull();
      expect(e.pessimisticMonths).not.toBeNull();
      // Optimistic must never exceed pessimistic — a sign-flip bug would
      // render a nonsense range in the UI.
      expect(e.optimisticMonths!).toBeLessThanOrEqual(e.pessimisticMonths!);
    }
  });

  it("reports 'current' rather than a projection once the date has cleared", () => {
    const e = estimateWait("2010-01-01", "eb3", "india");
    expect(e.status).toBe("current");
  });
});

/* ──────────────────────── 3. I-485 interfiling ─────────────────────────── */

describe("i485 — interfiling vs Supplement J", () => {
  it("distinguishes transfer of underlying basis from §204(j) portability", () => {
    expect(i485Page).toMatch(/transfer of underlying basis/i);
    expect(i485Page).toMatch(/Supplement J/);
    expect(i485Page).toMatch(/204\(j\)/);
  });

  it("attaches the 180-day rule to Supplement J, not to interfiling", () => {
    expect(i485Page).toMatch(/pending at least 180 days/i);
    // Interfiling explicitly has no waiting period.
    expect(i485Page).toMatch(/[Nn]o 180-day waiting period/);
  });

  it("states interfiling does not restart the I-485", () => {
    expect(i485Page).toMatch(/original filing date|original receipt date/i);
  });

  it("warns that interfiling is not freely reversible", () => {
    expect(i485Page).toMatch(/not freely reversible|cannot casually bounce back/i);
  });
});

/* ───────────────── 4. Surrender Certificate + emergency visa ───────────── */

describe("india visa — surrender certificate", () => {
  it("cites the correct statutory basis for loss of Indian citizenship", () => {
    expect(surrenderCertificate.rule).toMatch(/Section 9 of the Citizenship Act, 1955/);
    expect(surrenderCertificate.rule).toMatch(/automatic|operation of law/i);
  });

  it("states an expired Indian passport still triggers the requirement", () => {
    const traps = surrenderCertificate.traps.map((t) => `${t.title} ${t.body}`).join(" ");
    expect(traps).toMatch(/[Ee]xpir/);
  });

  it("covers children endorsed on a parent's Indian passport", () => {
    const traps = surrenderCertificate.traps.map((t) => `${t.title} ${t.body}`).join(" ");
    expect(traps).toMatch(/child/i);
  });

  it("does not hardcode a surrender fee or penalty amount", () => {
    // Consulate fees change; the page must point at the official portal.
    const blob = JSON.stringify(surrenderCertificate);
    expect(/\$\d|₹\s?\d/.test(blob)).toBe(false);
    expect(surrenderCertificate.sourceNote).toMatch(/VFS Global/);
  });

  it("renders on the page and is covered by the FAQ schema", () => {
    expect(indiaVisaPage).toMatch(/surrenderCertificate/);
    const qs = indiaVisaFaqs.map((f) => f.question).join(" ");
    expect(qs).toMatch(/Surrender Certificate/);
  });
});

describe("india visa — emergency travel", () => {
  it("does not promise guaranteed expedited processing", () => {
    const blob = JSON.stringify(emergencyVisa);
    // Must explicitly negate the guarantee, not merely use the word.
    expect(emergencyVisa.caution).toMatch(/never guaranteed/i);
    expect(/we can get you|always approved|guaranteed approval/i.test(blob)).toBe(false);
    // And it must not imply urgency waives eligibility.
    expect(emergencyVisa.caution).toMatch(/does not waive/i);
  });

  it("warns against non-refundable bookings before approval", () => {
    expect(emergencyVisa.caution).toMatch(/non-refundable/i);
  });

  it("flags the surrender-certificate dependency for former Indian citizens", () => {
    const routes = emergencyVisa.routes.map((r) => `${r.label} ${r.body}`).join(" ");
    expect(routes).toMatch(/Surrender Certificate/);
  });

  it("renders on the page", () => {
    expect(indiaVisaPage).toMatch(/emergencyVisa/);
  });
});

/* ───────────── 5. Gold: general allowance vs jewellery allowance ───────── */

describe("gold page — general free allowance vs gold allowance", () => {
  it("keeps the gender wording of the Baggage Rules, not 'male/female'", () => {
    // The rule says "female passenger" vs "passenger other than a female
    // passenger". The audit CSV said "40g females / 20g males", which is wrong.
    expect(goldPage).not.toMatch(/20\s*g(rams)? for (a )?males?\b/i);
    expect(goldPage).toMatch(/passenger other than a female passenger/i);
  });

  it("keeps the verified Rule 6 weights", () => {
    expect(goldDutyConfig.freeJewelleryGramsFemale).toBe(40);
    expect(goldDutyConfig.freeJewelleryGramsOther).toBe(20);
  });

  it("carries the general free allowance figures", () => {
    expect(goldDutyConfig.generalFreeAllowanceInr).toBe(75_000);
    expect(goldDutyConfig.generalFreeAllowanceTouristInr).toBe(25_000);
  });

  it("states the standard baggage rate with its components, not as an unknown", () => {
    // Resolved 2026-08-17: 35% BCD (Notification 26/2016-Customs, heading
    // 9803) + 10% SWS on the duty = 38.5%. The old "commonly cited around
    // 36%, confirm with Customs" hedge must not return.
    expect(goldDutyConfig.standardBaggageRatePct).toBe(38.5);
    expect(goldPage).toMatch(/26\/2016-Customs/);
    expect(goldPage).toMatch(/9803/);
    expect(goldPage).not.toMatch(/commonly cited around/i);
    expect(goldPage).not.toMatch(/standardRatePctIllustrative/);
  });

  it("cites the notification for the general allowance, with no hedge left on the page", () => {
    // Verified against CBIC 2026-08-17, so the page states it plainly and
    // cites the notification rather than carrying a provisional caveat.
    expect(goldDutyConfig.generalAllowanceVerifiedVerbatim).toBe(true);
    expect(goldPage).toMatch(/14\/2026-Customs/);
    expect(goldPage).not.toMatch(/have not been read back/i);
  });

  it("states the general allowance does NOT cover bullion", () => {
    const bullionRow = allowanceContrastRows.find((r) =>
      /bars or coins/i.test(r.question)
    )!;
    expect(bullionRow).toBeTruthy();
    // BOTH columns must answer "no" — the whole point of the row.
    expect(bullionRow.general).toMatch(/^No\b/);
    expect(bullionRow.gold).toMatch(/^No\b/);
    expect(bullionRow.general).toMatch(/Annexure-I item 5/);
    expect(goldPage).toMatch(/does not cover your gold/i);
  });

  it("says the two allowances cannot be stacked", () => {
    const stackRow = allowanceContrastRows.find((r) =>
      /added together/i.test(r.question)
    )!;
    expect(stackRow).toBeTruthy();
    expect(stackRow.general).toMatch(/^No\b/);
    // Rule 5 also bars pooling between passengers — a separate trap.
    expect(stackRow.gold).toMatch(/pooled/i);
  });

  it("documents the ATITHI declaration route and both channels", () => {
    expect(customsDeclaration.appName).toBe("ATITHI");
    expect(customsDeclaration.appUrl).toMatch(/cbic\.gov\.in/);
    const channels = customsDeclaration.channels.map((c) => c.label).join(" ");
    expect(channels).toMatch(/Red Channel/);
    expect(channels).toMatch(/Green Channel/);
  });

  it("adds FAQ coverage for the ₹75,000 confusion", () => {
    const qs = goldFaqs.map((f) => f.question).join(" ");
    expect(qs).toMatch(/₹75,000/);
    expect(qs).toMatch(/ATITHI/);
  });
});

/* ──────────────────────── 6. Dual tax calendar ─────────────────────────── */

describe("india tax compliance — dual calendar", () => {
  it("covers both tax systems", () => {
    expect(taxCalendar.some((e) => e.system === "india")).toBe(true);
    expect(taxCalendar.some((e) => e.system === "us")).toBe(true);
  });

  it("carries the deadlines NRIs most often miss", () => {
    const blob = taxCalendar.map((e) => `${e.date} ${e.title}`).join(" | ");
    expect(blob).toMatch(/July 31.*ITR due date/);
    expect(blob).toMatch(/April 15.*FBAR/);
    expect(blob).toMatch(/October 15/);
    expect(blob).toMatch(/December 31.*Belated/);
  });

  it("uses recurring dates, never a specific year", () => {
    // Bulk date-bumping is a known hazard in this repo — these must stay
    // year-free so they never need updating.
    for (const e of taxCalendar) {
      expect(e.date).not.toMatch(/\b(19|20)\d{2}\b/);
    }
  });

  it("explains the three-month year offset", () => {
    expect(yearOffsetExplainer.body).toMatch(/1 April to 31 March/);
    expect(yearOffsetExplainer.body).toMatch(/1 January to 31 December/);
  });

  it("states the relaxed Form 67 deadline correctly", () => {
    const f67 = foreignTaxCreditTiming.forms.find((f) => f.form === "Form 67")!;
    expect(f67.system).toBe("India");
    // Post-2022 Rule 128: end of the assessment year, NOT the ITR due date.
    // Phrasing is kept identical to the rest of the site so form67Wording.test
    // guards this surface too.
    expect(f67.rule).toMatch(/end of the assessment year/i);
    expect(f67.rule).toMatch(/no longer has to be filed by the ITR due date/i);
    // The 139(8A) updated-return carve-out must travel with the main rule.
    expect(f67.rule).toMatch(/139\(8A\)/);
  });

  it("pairs Form 1116 with the US side", () => {
    const f1116 = foreignTaxCreditTiming.forms.find((f) => f.form === "Form 1116")!;
    expect(f1116.system).toBe("US");
  });

  it("warns that an extension to file is not an extension to pay", () => {
    const qs = taxPage;
    expect(qs).toMatch(/extension to file is not an extension to pay/i);
  });

  it("renders the calendar on the page", () => {
    expect(taxPage).toMatch(/taxCalendar/);
    expect(taxPage).toMatch(/id="tax-calendar"/);
  });
});

/* ══════════ 2026-08 Gemini-audit remediation pass ══════════════════════ */

const hubPage = read("src/app/visa-bulletin/page.tsx");

describe("priority-date page — not every category uses the PERM date", () => {
  const pd = getVisaBulletinChildPage("priority-date")!;

  it("meta description no longer asserts the PERM-only version", () => {
    // The body always qualified this; the meta did not.
    expect(pd.metaDescription).not.toMatch(/is the day your PERM/i);
    expect(pd.metaDescription!.length).toBeLessThanOrEqual(155);
  });

  it("covers all four filings that can set a priority date", () => {
    for (const form of ["ETA-9089", "I-140", "I-526", "I-130"]) {
      expect(pd.content).toContain(form);
    }
  });

  it("names the I-797 Notice of Action as the authoritative record", () => {
    expect(pd.content).toMatch(/I-797 Notice of Action/);
    // And explicitly rules out the ETA-9089 Section O misconception.
    expect(pd.content).toMatch(/Section O of the ETA-9089 is not/i);
  });

  it("states the 8 CFR 204.5(e) 180-day withdrawal protection", () => {
    expect(pd.content).toContain("https://www.law.cornell.edu/cfr/text/8/204.5");
    expect(pd.content).toMatch(/approved for 180 days or more/i);
    expect(pd.content).toMatch(/fraud or willful misrepresentation/i);
  });

  it("states a priority date is not transferable to another person", () => {
    expect(pd.content).toMatch(/cannot be transferred to another person/i);
  });
});

describe("bulletin release timing — the 8th–10th claim is gone sitewide", () => {
  // The site's own release schedule (data/homepage-config.json) lists days
  // 12–21, so "8th–10th" was contradicted by our own data.
  const files = [
    "src/lib/visaBulletinCluster.ts",
    "src/app/visa-bulletin/page.tsx",
    "src/app/tools/priority-date-checker/page.tsx",
    "src/lib/toolHubContent.ts",
    "src/lib/visa-bulletin.ts",
    "src/lib/visaBulletinDates.ts",
  ];
  it.each(files)("%s no longer claims the 8th–10th", (f) => {
    expect(read(f)).not.toMatch(/8th[–-]10th/);
  });
});

describe("visa bulletin hub", () => {
  it("emits CollectionPage + ItemList alongside the existing graph", () => {
    expect(hubPage).toMatch(/"@type": "CollectionPage"/);
    expect(hubPage).toMatch(/"@type": "ItemList"/);
    // Must not have dropped what was already there.
    expect(hubPage).toMatch(/articleJsonLd/);
    expect(hubPage).toMatch(/breadcrumbJsonLd/);
    expect(hubPage).toMatch(/faqJsonLd/);
  });

  it("renders the current-month snapshot from the shared module, not hardcoded", () => {
    expect(hubPage).toMatch(/getCutoffs\(/);
    expect(hubPage).toMatch(/getBulletinLabel\(\)/);
    expect(hubPage).toMatch(/getApplicableChart\(\)/);
  });

  it("states USCIS designates the chart — filers do not choose", () => {
    expect(hubPage).toMatch(/do not choose between the two charts/i);
    expect(hubPage).toContain(
      "adjustment-of-status-filing-charts-from-the-visa-bulletin"
    );
  });

  it("explains the Unavailable case when EB-2 India is U", () => {
    expect(hubPage).toMatch(/October 1/);
    expect(hubPage).toMatch(/Unavailable/);
  });
});

describe("i485 — premium processing and field-office transfer", () => {
  it("states premium processing is NOT available for I-485", () => {
    expect(i485Page).toMatch(/premium processing is not available for Form I-485/i);
    expect(i485Page).toContain(
      "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing"
    );
  });

  it("explains the 80th-percentile basis of the published figure", () => {
    expect(i485Page).toMatch(/80% of adjudicated cases/i);
  });

  it("tells employment filers to read the field office, not the NBC", () => {
    expect(i485Page).toMatch(/National Benefits Center/);
    expect(i485Page).toMatch(/local field office/i);
  });

  it("carries a visible provenance stamp on the planning ranges", () => {
    expect(i485Page).toMatch(/planning estimates, last reviewed/i);
    expect(i485Page).toMatch(/not USCIS-published figures/i);
  });

  it("never states the typical band without also stating the longer tail", () => {
    // The title/meta advertise a TYPICAL 8-14 month band. Independent sources
    // put the employment-based ceiling higher (Google AI Overview 7-18;
    // practitioner sources up to 36), so the band is only honest while the
    // page also says the tail runs longer. If someone edits the range without
    // the tail language, this fails rather than shipping an overpromise.
    // Normalise JSX line-wrapping so multi-line prose matches.
    const flat = i485Page.replace(/\s+/g, " ");
    if (/8-14|8–14/.test(flat)) {
      expect(flat).toMatch(/to about two years|up to .{0,12}two years|24 months/i);
      // And the 80th-percentile explanation is what justifies a "typical" band.
      expect(flat).toMatch(/80% of adjudicated cases/i);
      expect(flat).toMatch(/One in five cases finished slower/i);
    }
  });
});

describe("eb3-india — Other Workers framed as current state, not a rule", () => {
  const eb3 = getVisaBulletinChildPage("eb3-india")!;

  it("defines all three EB-3 sub-categories", () => {
    expect(eb3.content).toMatch(/Skilled Worker/);
    expect(eb3.content).toMatch(/Professional/);
    expect(eb3.content).toMatch(/Other Worker/);
    expect(eb3.content).toMatch(/less than 2 years/i);
  });

  it("says EW India currently matches EB-3 India rather than always trailing it", () => {
    expect(eb3.content).toMatch(/identical Final Action Date/i);
    // Must be framed as current, reversible state.
    expect(eb3.content).toMatch(/current fact, not a permanent rule/i);
  });

  it("notes all EB-3 sub-categories require PERM (no self-petition)", () => {
    expect(eb3.content).toMatch(/no self-petition route anywhere in EB-3/i);
  });
});

describe("tax calendar — FY/AY labelling is unambiguous", () => {
  it("every entry declares which tax year it applies to", () => {
    for (const e of taxCalendar) {
      expect(e.appliesTo, `${e.date} ${e.title}`).toBeTruthy();
      expect(e.appliesTo.length).toBeGreaterThan(10);
    }
  });

  it("appliesTo stays relational — no hardcoded years", () => {
    for (const e of taxCalendar) {
      expect(e.appliesTo).not.toMatch(/\b(19|20)\d{2}\b/);
    }
  });

  it("maps FY to AY correctly — AY is always FY+1", () => {
    for (const r of fyAyMapping) {
      const fyStart = Number(r.financialYear.match(/(\d{4})/)![1]);
      const ayStart = Number(r.assessmentYear.match(/(\d{4})/)![1]);
      expect(ayStart).toBe(fyStart + 1);
    }
  });

  it("puts the non-audit ITR due date in July of the assessment year", () => {
    for (const r of fyAyMapping) {
      const ayStart = Number(r.assessmentYear.match(/(\d{4})/)![1]);
      expect(r.itrDueNonAudit).toBe(`31 July ${ayStart}`);
      expect(r.belatedRevisedBy).toBe(`31 Dec ${ayStart}`);
    }
  });

  it("renders the FY→AY table on the page", () => {
    expect(taxPage).toMatch(/fyAyMapping/);
    expect(taxPage).toMatch(/Assessment year/);
  });
});

describe("tax page — residency tests and NRE/NRO", () => {
  it("covers the 120-day / ₹15 lakh trigger, not just 182 days", () => {
    const blob = JSON.stringify(residencyTests);
    expect(blob).toMatch(/182/);
    expect(blob).toMatch(/120/);
    expect(blob).toMatch(/15 lakh/);
    expect(blob).toMatch(/RNOR/);
  });

  it("states NRE interest is India-exempt but US-taxable", () => {
    const interest = nreVsNroRows.find((r) => /India tax/.test(r.aspect))!;
    expect(interest.nre).toMatch(/10\(4\)\(ii\)/);
    const us = nreVsNroRows.find((r) => /US tax/.test(r.aspect))!;
    expect(us.nre).toMatch(/taxable/i);
    // The trap: exempt in India does NOT mean exempt in the US.
    expect(NRE_NRO_TRAP).toMatch(/no foreign tax credit/i);
  });
});

describe("india visa — 180-day cumulative stay cap", () => {
  it("states the verified 180-day per-calendar-year cap", () => {
    expect(touristStayLimits.cumulativeDaysPerCalendarYear).toBe(180);
    expect(touristStayLimits.rule).toMatch(/one calendar year/i);
    expect(touristStayLimits.source).toContain("cgisf.gov.in");
  });

  it("frames long validity as not equalling long stay", () => {
    expect(touristStayLimits.whyItMatters).toMatch(/not.*permitted residence|not per-trip/i);
  });

  it("keeps the 10-year visa — the audit's removal claim was wrong", () => {
    const qs = indiaVisaFaqs.map((f) => `${f.question} ${f.answer}`).join(" ");
    expect(qs).toMatch(/10-year regular paper tourist visa/i);
    expect(qs).toMatch(/inaccurate|still/i);
  });

  it("renders on the page", () => {
    expect(indiaVisaPage).toMatch(/touristStayLimits/);
  });
});

/* ─────────────── Cross-cutting: no new orphan or broken links ──────────── */

describe("audit pass — internal linking", () => {
  it("every new cluster page is exposed through the cluster list", () => {
    const slugs = visaBulletinChildPages.map((p) => p.slug);
    expect(slugs).toContain("cross-chargeability");
    // Cluster pages are auto-wired into the sitemap and hub from this list.
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
