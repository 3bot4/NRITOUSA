import { describe, expect, it } from "vitest";
import {
  AVR_EMPTY,
  SCORECARD_EMPTY,
  checkAvr,
  scoreEntryRisk,
  type AvrInputs,
  type ScorecardInputs,
} from "./portOfEntry";
import {
  avrConditions,
  poeOutcomes,
  referralCauses,
} from "@/data/portOfEntryData";

/** A fact pattern that satisfies every condition in 22 CFR 41.112(d). */
const CLEAN_AVR: AvrInputs = {
  destination: "canada-mexico",
  statusClass: "h1b-h4",
  under30Days: "yes",
  unexpiredI94: "yes",
  maintainedStatus: "yes",
  validPassport: "yes",
  appliedForVisa: "no",
  visaRefused: "",
  needsWaiver: "no",
  sstNational: "no",
};

/** A fact pattern with no referral triggers at all. */
const CLEAN_SCORECARD: ScorecardInputs = {
  employerType: "direct",
  daysSincePayStub: "14",
  worksiteMatchesLca: "yes",
  amendmentFiled: "yes",
  worksiteChanged: "no",
  employerChanged90Days: "no",
  extensionApprovedStampExpired: "no",
  priorRefusal: "no",
  employmentGap: "no",
  dutiesMatchPetition: "yes",
  onlineProfileMatches: "yes",
  carryingI797A: "yes",
  priorCriminalHistory: "no",
  h4Travelling: "no",
};

describe("AVR checker — completeness", () => {
  it("refuses to answer until every condition is answered", () => {
    expect(checkAvr(AVR_EMPTY).verdict).toBe("incomplete");
    expect(
      checkAvr({ ...CLEAN_AVR, sstNational: "" }).verdict,
    ).toBe("incomplete");
  });

  it("does not require the refusal follow-up when no application was made", () => {
    // visaRefused is deliberately left blank in CLEAN_AVR.
    expect(checkAvr(CLEAN_AVR).verdict).toBe("eligible");
  });
});

describe("AVR checker — 22 CFR 41.112(d)(2)(vii), the forfeiture rule", () => {
  it("treats APPLYING as fatal, not merely being refused", () => {
    // The central correction this cluster makes: an applicant who applied and
    // was NOT refused still loses automatic revalidation.
    const applied = checkAvr({
      ...CLEAN_AVR,
      appliedForVisa: "yes",
      visaRefused: "no",
    });
    expect(applied.verdict).toBe("forfeited");
    expect(applied.failures).toHaveLength(1);
    expect(applied.failures[0].cite).toContain("(d)(2)(vii)");
  });

  it("still forfeits — with sharper wording — when the visa was refused", () => {
    const refused = checkAvr({
      ...CLEAN_AVR,
      appliedForVisa: "yes",
      visaRefused: "yes",
    });
    expect(refused.verdict).toBe("forfeited");
    expect(refused.failures[0].detail).toContain("refused");
  });

  it("reports plain ineligibility, not forfeiture, when other conditions also fail", () => {
    const r = checkAvr({
      ...CLEAN_AVR,
      appliedForVisa: "yes",
      visaRefused: "no",
      under30Days: "no",
    });
    expect(r.verdict).toBe("ineligible");
    expect(r.failures.length).toBeGreaterThan(1);
  });
});

describe("AVR checker — destination rules", () => {
  it("rejects travel outside contiguous territory", () => {
    const r = checkAvr({ ...CLEAN_AVR, destination: "elsewhere" });
    expect(r.verdict).toBe("ineligible");
    expect(r.failures[0].cite).toContain("(d)(2)(ii)");
  });

  it("allows adjacent islands for F and J only", () => {
    const fj = checkAvr({
      ...CLEAN_AVR,
      statusClass: "f-j",
      destination: "adjacent-island",
    });
    expect(fj.verdict).toBe("eligible");

    const h1b = checkAvr({
      ...CLEAN_AVR,
      statusClass: "h1b-h4",
      destination: "adjacent-island",
    });
    expect(h1b.verdict).toBe("ineligible");
    expect(h1b.failures[0].label).toContain("Adjacent islands");
  });

  it("enforces the 30-day limit", () => {
    const r = checkAvr({ ...CLEAN_AVR, under30Days: "no" });
    expect(r.verdict).toBe("ineligible");
  });
});

describe("AVR checker — absolute exclusions", () => {
  it("treats the state-sponsor nationality exclusion as fatal", () => {
    const r = checkAvr({ ...CLEAN_AVR, sstNational: "yes" });
    expect(r.verdict).toBe("ineligible");
    expect(r.failures.some((f) => f.cite.indexOf("(d)(3)") !== -1)).toBe(true);
  });

  it("rejects an applicant needing a 212(d)(3) waiver", () => {
    const r = checkAvr({ ...CLEAN_AVR, needsWaiver: "yes" });
    expect(r.verdict).toBe("ineligible");
  });

  it("fails an expired I-94 or a lapsed status", () => {
    expect(checkAvr({ ...CLEAN_AVR, unexpiredI94: "no" }).verdict).toBe(
      "ineligible",
    );
    expect(checkAvr({ ...CLEAN_AVR, maintainedStatus: "no" }).verdict).toBe(
      "ineligible",
    );
  });

  it("cites a regulation for every failure it reports", () => {
    const r = checkAvr({
      ...AVR_EMPTY,
      destination: "elsewhere",
      statusClass: "h1b-h4",
      under30Days: "no",
      unexpiredI94: "no",
      maintainedStatus: "no",
      validPassport: "no",
      appliedForVisa: "yes",
      visaRefused: "yes",
      needsWaiver: "yes",
      sstNational: "yes",
    });
    expect(r.failures.length).toBeGreaterThan(5);
    for (const f of r.failures) {
      expect(f.cite, `${f.label} has no citation`).toMatch(/CFR|INA/);
    }
  });
});

describe("risk scorecard", () => {
  it("will not band a partially answered form", () => {
    expect(scoreEntryRisk(SCORECARD_EMPTY).band).toBe("incomplete");
    expect(
      scoreEntryRisk({ ...CLEAN_SCORECARD, employerType: "" }).band,
    ).toBe("incomplete");
  });

  it("reports a clean pattern as low with no flags", () => {
    const r = scoreEntryRisk(CLEAN_SCORECARD);
    expect(r.band).toBe("low");
    expect(r.score).toBe(0);
    expect(r.flags).toHaveLength(0);
    // The baseline document set is still returned.
    expect(r.documents.length).toBeGreaterThan(3);
  });

  it("escalates as triggers stack, and never exceeds the stated maximum", () => {
    const worst = scoreEntryRisk({
      employerType: "third-party",
      daysSincePayStub: "120",
      worksiteMatchesLca: "no",
      amendmentFiled: "no",
      worksiteChanged: "yes",
      employerChanged90Days: "yes",
      extensionApprovedStampExpired: "yes",
      priorRefusal: "yes",
      employmentGap: "yes",
      dutiesMatchPetition: "no",
      onlineProfileMatches: "no",
      carryingI797A: "no",
      priorCriminalHistory: "yes",
      h4Travelling: "yes",
    });
    expect(worst.band).toBe("high");
    expect(worst.score).toBeGreaterThan(8);
    expect(worst.score).toBeLessThanOrEqual(worst.maxScore);
  });

  it("counts the prior-history cause once even when both triggers fire", () => {
    const r = scoreEntryRisk({
      ...CLEAN_SCORECARD,
      priorRefusal: "yes",
      priorCriminalHistory: "yes",
    });
    const history = r.flags.filter((f) => f.causeId === "prior-history");
    expect(history).toHaveLength(1);
  });

  it("orders flags heaviest first and attaches a question and a closer to each", () => {
    const r = scoreEntryRisk({
      ...CLEAN_SCORECARD,
      employerType: "third-party",
      employerChanged90Days: "yes",
    });
    expect(r.flags.length).toBeGreaterThan(1);
    for (let i = 1; i < r.flags.length; i++) {
      expect(r.flags[i - 1].weight).toBeGreaterThanOrEqual(r.flags[i].weight);
    }
    for (const f of r.flags) {
      expect(f.question.length).toBeGreaterThan(0);
      expect(f.closer.length).toBeGreaterThan(0);
    }
  });

  it("treats an unamended worksite change as heavier than a plain LCA mismatch", () => {
    const unamended = scoreEntryRisk({
      ...CLEAN_SCORECARD,
      worksiteChanged: "yes",
      amendmentFiled: "no",
      worksiteMatchesLca: "no",
    });
    const mismatch = scoreEntryRisk({
      ...CLEAN_SCORECARD,
      worksiteChanged: "no",
      worksiteMatchesLca: "no",
    });
    expect(unamended.score).toBeGreaterThan(mismatch.score);
  });

  it("adds the H-4 family guidance only when a family is travelling", () => {
    expect(scoreEntryRisk(CLEAN_SCORECARD).h4Note).toBeNull();
    const withFamily = scoreEntryRisk({
      ...CLEAN_SCORECARD,
      h4Travelling: "yes",
    });
    expect(withFamily.h4Note).toContain("derivative");
  });

  it("never returns a duplicate document", () => {
    const r = scoreEntryRisk({
      ...CLEAN_SCORECARD,
      employerType: "third-party",
      priorRefusal: "yes",
      employmentGap: "yes",
    });
    expect(new Set(r.documents).size).toBe(r.documents.length);
  });
});

describe("cluster data integrity", () => {
  it("gives every referral cause a question and a document that answers it", () => {
    for (const c of referralCauses) {
      expect(c.question.length, `${c.id} question`).toBeGreaterThan(10);
      expect(c.closer.length, `${c.id} closer`).toBeGreaterThan(10);
    }
  });

  it("cites an authority for all three port-of-entry outcomes", () => {
    expect(poeOutcomes).toHaveLength(3);
    for (const o of poeOutcomes) {
      expect(o.authority, `${o.id} authority`).toMatch(/CFR|INA/);
    }
  });

  it("distinguishes withdrawal from expedited removal on the five-year bar", () => {
    const withdrawal = poeOutcomes.filter((o) => o.id === "withdrawal")[0];
    const expedited = poeOutcomes.filter((o) => o.id === "expedited")[0];
    expect(withdrawal.bar).toContain("No");
    expect(expedited.bar).toContain("Five years");
    expect(withdrawal.removalOrder).toContain("No");
    expect(expedited.removalOrder).toContain("Yes");
  });

  it("cites a subsection of 22 CFR 41.112(d) for every AVR condition", () => {
    expect(avrConditions).toHaveLength(7);
    for (const c of avrConditions) {
      expect(c.cite, `${c.id}`).toContain("22 CFR 41.112(d)(2)");
    }
  });
});
