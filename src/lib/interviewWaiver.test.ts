import { describe, expect, it } from "vitest";
import {
  WAIVER_EMPTY,
  checkInterviewWaiver,
  daysBetween,
  renewalWindowDaysRemaining,
  type WaiverInputs,
} from "./interviewWaiver";
import {
  IW_INTEGRITY_FEE,
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
  nationality: "IN",
  residence: "IN",
  applyingIn: "IN",
  identityChanged: "no",
  potentialIneligibility: "no",
  applicationDate: "2026-09-10",
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
    // Measured to the APPLICATION date (2026-09-10), not to "today":
    // expiry 2026-03-09 -> window closes 2027-03-09 -> 180 days.
    expect(r.windowDaysRemaining).toBe(180);
    expect(r.windowLabel).toContain("180 days");
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
  it("does NOT disqualify a refusal that was specifically resolved", () => {
    // The single most misstated sentence in the rule.
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, refusalType: "214b", refusalOvercome: "yes" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
    expect(r.met.some((m) => /resolved|waiver/i.test(m))).toBe(true);
  });

  it("will not infer that a later issuance overcame an earlier refusal", () => {
    // "unsure" must route to manual review, never to eligible.
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, refusalType: "214b", refusalOvercome: "unsure" },
      NOW,
    );
    expect(r.verdict).not.toBe("likely-eligible");
    const f = r.failures.filter(
      (x) => x.condition.indexOf("Never refused") !== -1,
    )[0];
    expect(f.why).toMatch(/does not by itself establish/i);
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
    const r = checkInterviewWaiver({ ...CLEAN_B2, applyingIn: "CA" }, NOW);
    expect(r.verdict).not.toBe("likely-eligible");
    expect(r.thirdCountryWarning).toContain("country of nationality or residence");
    expect(r.thirdCountryWarning).toContain("neither refundable nor transferable");
  });

  it("accepts an application in the country of usual residence", () => {
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, nationality: "IN", residence: "CA", applyingIn: "CA" },
      NOW,
    );
    expect(r.verdict).toBe("likely-eligible");
    expect(r.thirdCountryWarning).toBeNull();
  });

  it("never treats two different 'other' countries as the same country", () => {
    // The regression this locks in: a shared "Other" option made a Brazilian
    // national resident in Germany applying in France compare as one country.
    const r = checkInterviewWaiver(
      { ...CLEAN_B2, nationality: "BR", residence: "DE", applyingIn: "FR" },
      NOW,
    );
    expect(r.verdict).not.toBe("likely-eligible");
    expect(r.thirdCountryWarning).not.toBeNull();

    const generic = checkInterviewWaiver(
      {
        ...CLEAN_B2,
        nationality: "OTHER_A",
        residence: "OTHER_B",
        applyingIn: "OTHER_C",
      },
      NOW,
    );
    expect(generic.verdict).not.toBe("likely-eligible");
  });
});

describe("date safety and the ineligibility gate", () => {
  it("treats a not-yet-expired prior visa as inside the window", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, priorExpiry: "2027-06-01" }, NOW);
    expect(r.verdict).toBe("likely-eligible");
    expect(r.windowLabel).toMatch(/has not (expired|started)/i);
  });

  it("never silently passes an unparseable expiry", () => {
    const r = checkInterviewWaiver({ ...CLEAN_B2, priorExpiry: "not-a-date" }, NOW);
    expect(r.verdict).not.toBe("likely-eligible");
    expect(r.failures.some((f) => f.condition.indexOf("12-month") !== -1)).toBe(true);
  });

  it("measures the window to the application date", () => {
    const early = checkInterviewWaiver({ ...CLEAN_B2, applicationDate: "2026-09-10" }, NOW);
    const late = checkInterviewWaiver({ ...CLEAN_B2, applicationDate: "2027-06-01" }, NOW);
    expect(early.verdict).toBe("likely-eligible");
    expect(late.verdict).toBe("not-eligible");
  });

  it("blocks an eligible verdict when a potential ineligibility exists", () => {
    for (const v of ["yes", "unsure"] as const) {
      const r = checkInterviewWaiver({ ...CLEAN_B2, potentialIneligibility: v }, NOW);
      expect(r.verdict, `potentialIneligibility=${v}`).not.toBe("likely-eligible");
      expect(r.failures.some((f) => f.condition.indexOf("ineligibility") !== -1)).toBe(true);
    }
  });

  it("excludes C-3 attendants while keeping other C-3 applicants eligible", () => {
    const attendant = checkInterviewWaiver({ ...WAIVER_EMPTY, applyingFor: "c3-attendant" }, NOW);
    expect(attendant.verdict).toBe("not-eligible");
    expect(attendant.headline).toMatch(/attendant/i);
    const c3 = checkInterviewWaiver({ ...WAIVER_EMPTY, applyingFor: "c3" }, NOW);
    expect(c3.verdict).toBe("likely-eligible");
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
    expect(iwConditions.length).toBeGreaterThanOrEqual(5);
    for (const c of iwConditions) {
      expect(c.nuance.length, `${c.id}`).toBeGreaterThan(40);
    }
  });

  it("publishes both fee tiers", () => {
    expect(iwFees).toHaveLength(2);
    expect(iwFees.map((f) => f.amount).sort()).toEqual(["$185", "$205"]);
  });

  it("never presents the Visa Integrity Fee as currently payable", () => {
    expect(IW_INTEGRITY_FEE.payableNow).toBe(false);
    expect(IW_INTEGRITY_FEE.detail).not.toMatch(/uneven implementation/i);
    expect(IW_INTEGRITY_FEE.budgetingRule).toMatch(/Do not add this to your total/i);
  });
});
