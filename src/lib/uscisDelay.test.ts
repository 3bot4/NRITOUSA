import { describe, expect, it } from "vitest";
import {
  DELAY_EMPTY,
  assessDelay,
  elapsedLabel,
  parseIsoDate,
  type DelayInputs,
} from "./uscisDelay";
import {
  PREMIUM_RFE_CLOCK,
  premiumRules,
  uscisExplainers,
  uscisMethodology,
} from "@/data/uscisProcessingData";

const NOW = new Date(Date.UTC(2026, 8, 11)); // 2026-09-11

const CASE: DelayInputs = {
  form: "I-140",
  subtype: "E21 national interest waiver",
  office: "Texas Service Center",
  receiptDate: "2025-01-15",
  inquiryDate: "2025-06-01",
  transferred: "no",
};

describe("date handling", () => {
  it("rejects malformed and impossible dates", () => {
    expect(parseIsoDate("")).toBeNull();
    expect(parseIsoDate("2026-13-01")).toBeNull();
    expect(parseIsoDate("2026-02-31")).toBeNull();
    expect(parseIsoDate("Jan 2025")).toBeNull();
    expect(parseIsoDate("2025-01-15")).not.toBeNull();
  });

  it("never reports 'less than a month' for a real elapsed period", () => {
    const label = elapsedLabel(
      new Date(Date.UTC(2026, 8, 1)),
      new Date(Date.UTC(2026, 8, 11)),
    );
    expect(label).toBe("10 days");
    expect(label).not.toMatch(/less than a month/i);
  });

  it("renders long waits in years and months", () => {
    expect(
      elapsedLabel(new Date(Date.UTC(2024, 4, 15)), new Date(Date.UTC(2026, 8, 11))),
    ).toBe("2 years 3 months");
  });
});

describe("a missing receipt date never produces an elapsed-time result", () => {
  it("returns incomplete with no elapsed label", () => {
    const r = assessDelay(DELAY_EMPTY, NOW);
    expect(r.verdict).toBe("incomplete");
    expect(r.elapsedLabel).toBeNull();
    expect(r.summary).not.toMatch(/less than a month/i);
  });

  it("returns incomplete when the receipt date is unparseable", () => {
    const r = assessDelay({ ...CASE, receiptDate: "2026-02-31" }, NOW);
    expect(r.verdict).toBe("incomplete");
    expect(r.elapsedLabel).toBeNull();
  });

  it("returns incomplete when only the form is known", () => {
    const r = assessDelay({ ...DELAY_EMPTY, form: "I-129" }, NOW);
    expect(r.verdict).toBe("incomplete");
    expect(r.elapsedLabel).toBeNull();
  });
});

describe("no official inquiry date means no delay verdict", () => {
  it("reports elapsed time but refuses a normal/delayed verdict", () => {
    const r = assessDelay({ ...CASE, inquiryDate: "" }, NOW);
    expect(r.verdict).toBe("no-official-date");
    expect(r.elapsedLabel).toBe("1 year 7 months");
    expect(r.daysBeyond).toBeNull();
    // It must not claim the case is normal or delayed.
    expect(r.headline).not.toMatch(/within normal|delayed/i);
    expect(r.nextSteps.join(" ")).toMatch(/processing-times tool|inquiry date/i);
  });

  it("does the same for an unparseable inquiry date", () => {
    const r = assessDelay({ ...CASE, inquiryDate: "June 2025" }, NOW);
    expect(r.verdict).toBe("no-official-date");
  });
});

describe("verdicts are derived from the official inquiry date only", () => {
  it("says outside when the receipt date precedes the inquiry date", () => {
    const r = assessDelay(CASE, NOW);
    expect(r.verdict).toBe("outside");
    expect(r.daysBeyond).toBeGreaterThan(0);
    expect(r.nextSteps.join(" ")).toMatch(/e-Request/i);
  });

  it("says within when the receipt date is on or after the inquiry date", () => {
    const r = assessDelay({ ...CASE, inquiryDate: "2024-06-01" }, NOW);
    expect(r.verdict).toBe("within");
    expect(r.daysBeyond).toBeLessThanOrEqual(0);
  });

  it("treats an equal receipt and inquiry date as not yet outside", () => {
    const r = assessDelay(
      { ...CASE, receiptDate: "2025-06-01", inquiryDate: "2025-06-01" },
      NOW,
    );
    expect(r.verdict).toBe("within");
    expect(r.daysBeyond).toBe(0);
  });
});

describe("transfers", () => {
  it("states that a transfer does not reset the receipt date", () => {
    const r = assessDelay({ ...CASE, transferred: "yes" }, NOW);
    expect(r.notes.join(" ")).toMatch(/does not reset your receipt date/i);
  });

  it("does not claim an NBC transfer means an interview is being scheduled", () => {
    const r = assessDelay({ ...CASE, transferred: "yes" }, NOW);
    const joined = r.notes.join(" ");
    expect(joined).toMatch(/does not reliably indicate/i);
    expect(joined).not.toMatch(/typically means interview scheduling/i);
  });
});

describe("premium processing data", () => {
  it("gives NIW and multinational manager I-140s 45 business days", () => {
    const niw = premiumRules.filter((r) => r.id === "i140-e21-niw")[0];
    const e13 = premiumRules.filter((r) => r.id === "i140-e13")[0];
    expect(niw.businessDays).toBe(45);
    expect(e13.businessDays).toBe(45);
  });

  it("gives eligible OPT/STEM OPT I-765 requests 30 business days", () => {
    const i765 = premiumRules.filter((r) => r.id === "i765")[0];
    expect(i765.businessDays).toBe(30);
    expect(i765.classification).toMatch(/OPT/);
  });

  it("does not claim every I-140 gets 15 business days", () => {
    const i140 = premiumRules.filter((r) => r.form === "Form I-140");
    const periods = new Set(i140.map((r) => r.businessDays));
    expect(periods.size).toBeGreaterThan(1);
    expect(periods.has(45)).toBe(true);
  });

  it("keeps I-129 at 15 business days", () => {
    expect(premiumRules.filter((r) => r.id === "i129")[0].businessDays).toBe(15);
  });

  it("describes the RFE clock as stop-and-reset with a notice-specific deadline", () => {
    expect(PREMIUM_RFE_CLOCK.rule).toMatch(/stops and resets/i);
    expect(PREMIUM_RFE_CLOCK.rule).toMatch(/new premium processing period begins/i);
    expect(PREMIUM_RFE_CLOCK.deadlineWarning).toMatch(/exact date printed/i);
    expect(PREMIUM_RFE_CLOCK.deadlineWarning).not.toMatch(/8[47] days/);
  });
});

describe("methodology and explainer corrections", () => {
  it("states the 80% methodology and the separate inquiry date", () => {
    expect(uscisMethodology.displayedTime).toMatch(/80%/);
    expect(uscisMethodology.inquiryDate).toMatch(/case inquiry date/i);
  });

  it("sources PERM priority dates to the labor certification filing date", () => {
    expect(uscisExplainers.priorityDateSource).toMatch(/labor certification was filed/i);
    expect(uscisExplainers.priorityDateSource).toMatch(/not the I-140 receipt date/i);
  });

  it("distinguishes AC21 106(a) from 104(c)", () => {
    expect(uscisExplainers.ac21OneYear).toMatch(/365 days/);
    expect(uscisExplainers.ac21OneYear).toMatch(/FILED/);
    expect(uscisExplainers.ac21ThreeYear).toMatch(/APPROVED I-140/);
    expect(uscisExplainers.ac21ThreeYear).toMatch(/visa number is unavailable/i);
  });

  it("does not say employment-based I-485 interviews are usually required", () => {
    // The copy names the wrong claim in order to disclaim it, so assert on the
    // disclaimer rather than the absence of the phrase.
    expect(uscisExplainers.i485Interview).toMatch(/may require or waive/i);
    expect(uscisExplainers.i485Interview).toMatch(
      /not correct to say .*usually required/i,
    );
  });

  it("carries the H/L travel exception rather than a blanket advance-parole rule", () => {
    expect(uscisExplainers.i485Travel).toMatch(/245\.2\(a\)\(4\)\(ii\)\(C\)/);
  });
});
