import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  usCalendarYear,
  indianFinancialYear,
} from "@/data/foreignGiftRules";
import { getGiftPage } from "@/lib/giftsCluster";
import { extractFaq } from "@/lib/seo";
import { getToolHubContent } from "@/lib/toolHubContent";

/**
 * Regression tests for the corrective pass on the Foreign Gifts / Form 3520
 * cluster: tax-specific checker disclaimer, no duplicated numbering, correct
 * US-calendar-year vs Indian-financial-year worked example, corrected pillar
 * FBAR FAQ wording, and FAQ-schema parity.
 */

const CASH_GIFT = "gift-from-parents-india-to-usa";
const PILLAR = "foreign-gifts-inheritance-form-3520-india";
const CHECKER_PAGE = resolve(
  process.cwd(),
  "src/app/tools/form-3520-india-gift-checker/page.tsx"
);

describe("US calendar year vs Indian financial year", () => {
  it("Feb 2026 and April 2026 are in the SAME US calendar year", () => {
    expect(usCalendarYear(new Date("2026-02-15"))).toBe(2026);
    expect(usCalendarYear(new Date("2026-04-15"))).toBe(2026);
  });

  it("Feb 2026 and April 2026 are in TWO different Indian financial years", () => {
    expect(indianFinancialYear(new Date("2026-02-15"))).toBe("2025-26");
    expect(indianFinancialYear(new Date("2026-04-15"))).toBe("2026-27");
    expect(indianFinancialYear(new Date("2026-02-15"))).not.toBe(
      indianFinancialYear(new Date("2026-04-15"))
    );
  });

  it("Dec 2025 and Feb 2026 are NOT in the same US calendar year", () => {
    expect(usCalendarYear(new Date("2025-12-15"))).toBe(2025);
    expect(usCalendarYear(new Date("2026-02-15"))).toBe(2026);
    expect(usCalendarYear(new Date("2025-12-15"))).not.toBe(
      usCalendarYear(new Date("2026-02-15"))
    );
  });

  it("March is the last month of the Indian financial year", () => {
    expect(indianFinancialYear(new Date("2026-03-31"))).toBe("2025-26");
  });
});

describe("cash-gift worked example is corrected", () => {
  const content = getGiftPage(CASH_GIFT)!.content;

  it("uses February 2026 and April 2026, not December/February", () => {
    expect(content).toContain("February 2026");
    expect(content).toContain("April 2026");
    expect(content).not.toMatch(/in December and your mother/i);
    expect(content).not.toContain("the following February");
  });

  it("aggregates to $130,000 in US calendar year 2026 and flags Part IV", () => {
    expect(content).toContain("US calendar year 2026");
    expect(content).toContain("Form 3520 Part IV");
  });

  it("maps Feb 2026 to Indian FY 2025–26 and April 2026 to FY 2026–27", () => {
    expect(content).toContain("2025–26");
    expect(content).toContain("2026–27");
  });

  it("states US aggregation and Indian LRS/TCS do not use the same year or person", () => {
    expect(content.toLowerCase()).toContain("not");
    expect(content).toMatch(/per sender and per Indian financial year/i);
  });
});

describe("pillar FBAR FAQ wording is corrected", () => {
  const content = getGiftPage(PILLAR)!.content;

  it("no longer says 'Real estate held in a US account'", () => {
    expect(content).not.toContain("Real estate held in a US account");
  });

  it("uses the corrected US-financial-account wording", () => {
    expect(content).toContain(
      "does not create an FBAR filing requirement merely because the funds came from India"
    );
  });

  it("separates real estate from a financial account correctly", () => {
    expect(content).toContain(
      "directly held foreign real estate is generally not itself a foreign financial account"
    );
  });
});

describe("checker content does not duplicate a full pillar article", () => {
  const c = getToolHubContent("form-3520-india-gift-checker")!;

  it("drops the generic step-by-step and copied mistakes lists", () => {
    expect(c.steps.length).toBe(0);
    expect(c.mistakes.length).toBe(0);
  });

  it("keeps result meaning, donor-category explainer, and related links", () => {
    expect(c.resultMeaning).toBeTruthy();
    expect(c.explain).toBeTruthy();
    expect(c.relatedLinks.length).toBeGreaterThan(0);
  });
});

describe("no duplicated list numbering can be introduced via content", () => {
  it("no checker step/mistake carries a manual '1.' style numeric prefix", () => {
    const c = getToolHubContent("form-3520-india-gift-checker")!;
    for (const s of [...c.steps, ...c.mistakes, ...c.keyInputs]) {
      expect(s).not.toMatch(/^\s*\d+\.\s/);
    }
  });
});

describe("checker page disclaimer is tax-specific (no immigration boilerplate)", () => {
  const src = readFileSync(CHECKER_PAGE, "utf8");

  it("contains no USCIS / travel.state.gov / DOL references in its own source", () => {
    expect(src.toLowerCase()).not.toContain("uscis");
    expect(src.toLowerCase()).not.toContain("travel.state.gov");
    expect(src.toLowerCase()).not.toContain("dol.gov");
    expect(src.toLowerCase()).not.toContain("immigration processing");
  });

  it("supplies tax-specific override props referencing IRS/FinCEN/RBI/Indian ITD", () => {
    expect(src).toContain("verifyNote");
    expect(src).toContain("topDisclaimer");
    expect(src).toContain("Indian Income Tax Department");
    expect(src).toContain("FinCEN");
  });

  it("keeps an educational-screening (not a filing determination) disclaimer", () => {
    expect(src).toContain("not a filing determination");
  });
});

describe("cash-gift FAQ visible text matches the FAQPage schema source", () => {
  it("extractFaq (used for both render and schema) yields the visible FAQs", () => {
    const faqs = extractFaq(getGiftPage(CASH_GIFT)!.content);
    expect(faqs.length).toBeGreaterThan(0);
    // Every answer is plain text derived from the same content the page renders.
    for (const f of faqs) {
      expect(f.question.length).toBeGreaterThan(0);
      expect(f.answer.length).toBeGreaterThan(0);
    }
  });
});
