import { describe, expect, it } from "vitest";
import {
  WAIVER_EMPTY,
  checkInterviewWaiver,
  daysBetween,
  renewalWindowDaysRemaining,
  type WaiverInputs,
} from "./interviewWaiver";
import {
  iwCategoryVerdicts,
  iwChronology,
  iwConditions,
  iwFees,
} from "@/data/interviewWaiverData";

/** Fixed "today" so window arithmetic is deterministic. */
const NOW = new Date(Date.UTC(2026, 8, 9)); // 2026-09-09

/** A parent renewing a B-2 six months after it expired — the live dropbox path. */
const CLEAN_B2: WaiverInputs = {
  applyingFor: "b1b2",
  priorClass: "b1b2",
  priorExpiry: "2026-03-09",
  fullValidity: "yes",
  age18AtIssuance: "yes",
  refusalType: "none",
  refusalOvercome: "",
  nationality: "India",
  residence: "India",
  applyingIn: "India",
  identityChanged: "no",
};

describe("date helpers", () => {
  it("counts whole days across a DST boundary without drifting", () => {
    expect(
      daysBetween(new Date(Date.UTC(2026, 2, 1)), new Date(Date.UTC(2026, 2, 31))),
    ).toBe(30);
  });

  it("runs the 12-month window from expiration, not issuance", () => {
    // Expired 2026-03-09 → window closes 2027-03-09 → 181 days from 2026-09-09.
    expect(
      renewalWindowDaysRemaining(new Date(Date.UTC(2026, 2, 9)), NOW),
    ).toBe(181);
    // Expired 2025-01-01 → closed 2026-01-01, well before "now".
    expect(
      renewalWindowDaysRemaining(new Date(Date.UTC(2025, 0, 1)), NOW),
    ).toBeLessThan(0);
  });
});

describe("categorical exclusions — the heart of the page", () => {
  it("says plainly that H-1B is not eligible", () => {
    const r = checkInterviewWaiver({ ...WAIVER_EMPTY, applyingFor: "h1b" }, NOW);
    expect(r.verdict).toBe("not-eligible");
    expect(r.headline).toContain("H-1B");
    expect(r.summary).toContain("48-month");
  });

  it("says the same for H-4, L and F", () => {
    for (const c of ["h4", "l", "f", "j", "other"] as const) {
      const r = checkInterviewWaiver({ ...WAIVER_EMPTY, applyingFor: c }, NOW);
      expect(r.verdict, `${c} should be excluded`).toBe("not-eligible");
    }
  });

  it("does not ask an excluded class for any further facts", () => {
    // The category settles it — no incomplete state, no follow-up questions.
    const r = checkInterviewWaiver({ ...WAIVER_EMPTY, applyingFor: "l" }, NOW);
    expect(r.verdict).not.toBe("incomplete");
    expect(r.failures).toHaveLength(1);
  });

  it("keeps the diplomatic and official track eligible", () => {
    const r = checkInterviewWaiver(
      { ...WAIVER_EMPTY, applyingFor: "diplomatic" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
    expect(r.summary).toContain("C-3");
  });

  it("keeps H-2A on the renewal route, restored on 1 October 2025", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, applyingFor: "h2a", priorClass: "h2a" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
  });
});

describe("the renewal route", () => {
  it("clears a clean B-2 renewal and reports the window countdown", () => {
    const r = checkInterviewWaiver(CLEAN_B2, NOW);
    expect(r.verdict).toBe("likely-eligible");
    expect(r.windowDaysRemaining).toBe(181);
    expect(r.windowLabel).toContain("181 days");
    expect(r.failures).toHaveLength(0);
  });

  it("never promises a waiver, only eligibility to be considered", () => {
    const r = checkInterviewWaiver(CLEAN_B2, NOW);
    expect(r.summary).toContain("does not entitle you");
  });

  it("closes the window once the prior visa expired over 12 months ago", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, priorExpiry: "2025-01-01" },
      NOW,
    );
    expect(r.verdict).toBe("not-eligible");
    expect(r.windowDaysRemaining!).toBeLessThan(0);
    expect(r.windowLabel).toContain("closed");
  });

  it("enforces the same-classification requirement", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, priorClass: "h1b" }, NOW);
    expect(r.verdict).toBe("not-eligible");
    expect(r.failures.some((f) => f.condition === "Same classification")).toBe(true);
  });

  it("enforces the full-validity condition nobody asks about", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, fullValidity: "no" }, NOW);
    expect(r.verdict).toBe("not-eligible");
    expect(
      r.failures.some((f) => f.condition.indexOf("full validity") !== -1),
    ).toBe(true);
  });

  it("treats an unsure answer as something to check, not a disqualification", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, fullValidity: "unsure" }, NOW);
    expect(r.verdict).toBe("needs-review");
    expect(r.failures[0].curable).not.toBeNull();
  });

  it("blocks the renewal route for an applicant under 18 at prior issuance", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, age18AtIssuance: "no" }, NOW);
    expect(r.verdict).toBe("not-eligible");
  });

  it("waits for the answers it needs before ruling", () => {
    expect(
      checkInterviewWaiver({ ...CLEAN_B2, priorExpiry: "" }, NOW).verdict,
    ).toBe("incomplete");
    // A refusal is stated but not yet resolved either way.
    expect(
      checkInterviewWaiver(
        { ...CLEAN_B2, refusalType: "214b", refusalOvercome: "" },
        NOW,
      ).verdict,
    ).toBe("incomplete");
  });
});

describe("the 'never refused unless overcome or waived' clause", () => {
  it("does NOT disqualify a refusal that was later overcome", () => {
    // The single most misstated sentence in the rule.
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, refusalType: "214b", refusalOvercome: "yes" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
    expect(r.met.some((m) => m.indexOf("overcome") !== -1)).toBe(true);
  });

  it("treats an unresolved refusal as failing the condition", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, refusalType: "214b", refusalOvercome: "no" },
      NOW,
    );
    expect(r.verdict).not.toBe("likely-eligible");
    expect(
      r.failures.some((f) => f.condition.indexOf("Never refused") !== -1),
    ).toBe(true);
  });

  it("explains that a resolved 221(g) is overcome", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, refusalType: "221g", refusalOvercome: "no" },
      NOW,
    );
    const f = r.failures.filter(
      (x) => x.condition.indexOf("Never refused") !== -1,
    )[0];
    expect(f.why).toContain("221(g)");
    expect(f.curable).toContain("issuance");
  });
});

describe("country of application", () => {
  it("flags a third-country application and explains the wider policy", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, applyingIn: "Canada" }, NOW);
    expect(r.verdict).not.toBe("likely-eligible");
    expect(r.thirdCountryWarning).toContain("6 September 2025");
    expect(r.thirdCountryWarning).toContain("neither refundable nor transferable");
  });

  it("accepts an application in the country of usual residence", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, nationality: "India", residence: "Canada", applyingIn: "Canada" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
    expect(r.thirdCountryWarning).toBeNull();
  });

  it("is not case- or whitespace-sensitive", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, nationality: "  india ", applyingIn: "INDIA" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
  });
});

describe("data integrity", () => {
  it("marks exactly one chronology entry as the rule in force", () => {
    expect(iwChronology.filter((e) => e.current)).toHaveLength(1);
  });

  it("keeps the chronology in chronological order of effect", () => {
    const years = iwChronology.map((e) =>
      Number(/(\d{4})/.exec(e.effective)![1]),
    );
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeGreaterThanOrEqual(years[i - 1]);
    }
  });

  it("states plainly that H-1B, H-4, L, F and J are not eligible", () => {
    for (const c of ["H-1B", "H-4", "L-1 / L-2", "F-1 / F-2", "J-1 / J-2"]) {
      const row = iwCategoryVerdicts.filter((r) => r.category === c)[0];
      expect(row, `${c} missing from the verdict table`).toBeTruthy();
      expect(row.verdict).toBe("not-eligible");
    }
  });

  it("keeps H-2A on the eligible-on-renewal list", () => {
    const row = iwCategoryVerdicts.filter(
      (r) => r.category.indexOf("H-2A") !== -1,
    )[0];
    expect(row.verdict).toBe("conditional");
  });

  it("gives every condition a nuance paragraph", () => {
    expect(iwConditions).toHaveLength(5);
    for (const c of iwConditions) {
      expect(c.nuance.length, `${c.id}`).toBeGreaterThan(40);
    }
  });

  it("publishes both fee tiers", () => {
    expect(iwFees).toHaveLength(2);
    expect(iwFees.map((f) => f.amount).sort()).toEqual(["$185", "$205"]);
  });
});
