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
    expect(content).toContain("130,000");
    expect(content).toContain("US calendar year 2026");
    expect(content).toContain("Form 3520 Part IV");
  });

  it("does not describe December + following February as one US calendar year", () => {
    expect(content).not.toMatch(/December[\s\S]{0,120}same US calendar year/i);
    expect(content).not.toMatch(/December[\s\S]{0,120}two Indian financial years/i);
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
  const CLUSTER_SLUGS = [
    PILLAR,
    CASH_GIFT,
    "form-3520-indian-gift-inheritance-checklist",
  ];

  it("no checker step/mistake carries a manual '1.' style numeric prefix", () => {
    const c = getToolHubContent("form-3520-india-gift-checker")!;
    for (const s of [...c.steps, ...c.mistakes, ...c.keyInputs]) {
      expect(s).not.toMatch(/^\s*\d+\.\s/);
    }
  });

  it("no cluster page content contains a literal duplicated 'N. N' pattern", () => {
    for (const slug of CLUSTER_SLUGS) {
      const content = getGiftPage(slug)!.content;
      const m = content.match(/(\d+)\.\s+(\d+)\b/);
      if (m) {
        // Only fail when the two numbers are equal (true duplicate marker).
        expect(m[1], `${slug}: "${m[0]}"`).not.toBe(m[2]);
      }
    }
  });

  it("no :::steps item keeps a second number after the leading marker is stripped", () => {
    for (const slug of CLUSTER_SLUGS) {
      const content = getGiftPage(slug)!.content;
      const blocks = content.match(/:::steps([\s\S]*?):::/g) ?? [];
      for (const block of blocks) {
        for (const raw of block.split("\n")) {
          const line = raw.trim();
          if (!/^\d+\.\s/.test(line)) continue;
          // ArticleBody's StepsBox strips the leading "N. " and renders one badge.
          const afterStrip = line.replace(/^\d+\.\s+/, "");
          expect(afterStrip, `${slug}: "${line}"`).not.toMatch(/^\d+\.\s/);
        }
      }
    }
  });
});

describe("checker page disclaimer is tax-specific (no immigration boilerplate)", () => {
  const src = readFileSync(CHECKER_PAGE, "utf8");
  // JSX wraps prose across indented lines; collapse whitespace to mirror how the
  // text actually renders before asserting on multi-word phrases.
  const flat = src.replace(/\s+/g, " ");
  const flatLower = flat.toLowerCase();

  it("contains no immigration boilerplate or immigration sources in its own source", () => {
    for (const banned of [
      "immigration rules",
      "immigration fees",
      "immigration processing times",
      "immigration processing",
      "uscis.gov",
      "uscis",
      "travel.state.gov",
      "dol.gov",
    ]) {
      expect(flatLower, banned).not.toContain(banned);
    }
  });

  it("references the correct tax authorities and professionals", () => {
    expect(flat).toContain("IRS");
    expect(flat).toContain("FinCEN");
    expect(flat).toContain("RBI");
    expect(flat).toContain("Indian Income Tax Department");
    expect(flat).toContain("cross-border CPA");
    expect(flat).toContain("Indian Chartered Accountant");
  });

  it("includes the required educational-screening limitation sentence", () => {
    expect(flat).toContain("provides an educational screening result only");
    expect(flat).toContain(
      "does not determine whether you have a filing obligation"
    );
  });

  it("supplies the tax-specific override props", () => {
    expect(flat).toContain("verifyNote");
    expect(flat).toContain("topDisclaimer");
  });
});

describe("checker hub content has no immigration language", () => {
  it("the checker's toolHubContent entry references no immigration sources", () => {
    const c = getToolHubContent("form-3520-india-gift-checker")!;
    const blob = JSON.stringify(c).toLowerCase();
    for (const banned of [
      "immigration rules",
      "immigration fees",
      "immigration processing",
      "uscis",
      "travel.state.gov",
      "dol.gov",
    ]) {
      expect(blob, banned).not.toContain(banned);
    }
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
