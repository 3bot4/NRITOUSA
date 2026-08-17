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
  hubFaqs as indiaVisaFaqs,
} from "@/data/indiaVisaData";
import {
  taxCalendar,
  foreignTaxCreditTiming,
  yearOffsetExplainer,
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
    expect(page!.content).toMatch(/8 U\.S\.C\. §1152\(b\)\(2\)/);
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

  it("flags the general allowance as not verbatim-verified from the gazette", () => {
    // Provenance discipline: the Rule 6 figures were read from the gazette,
    // these were not. The UI must show the weaker-provenance caveat.
    expect(goldDutyConfig.generalAllowanceVerifiedVerbatim).toBe(false);
    expect(goldPage).toMatch(/generalAllowanceVerifiedVerbatim/);
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

/* ─────────────── Cross-cutting: no new orphan or broken links ──────────── */

describe("audit pass — internal linking", () => {
  it("every new cluster page is exposed through the cluster list", () => {
    const slugs = visaBulletinChildPages.map((p) => p.slug);
    expect(slugs).toContain("cross-chargeability");
    // Cluster pages are auto-wired into the sitemap and hub from this list.
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
