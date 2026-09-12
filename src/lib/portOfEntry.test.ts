import { describe, expect, it } from "vitest";
import {
  AVR_EMPTY,
  PREP_EMPTY,
  assessEntryPreparedness,
  checkAvr,
  type AvrInputs,
  type PrepInputs,
} from "./portOfEntry";
import {
  avrConditions,
  poeOutcomes,
  referralCauses,
} from "@/data/portOfEntryData";

/** A fact pattern that satisfies every condition in 22 CFR 41.112(d). */
const CLEAN_AVR: AvrInputs = {
  hasRevalidatableVisa: "yes",
  endorsedForm: "",
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

/** A traveller with nothing outstanding on the checklist. */
const CLEAN_PREP: PrepInputs = {
  visaPosture: "valid",
  passportValid: "yes",
  worksiteMove: "none",
  amendmentFiled: "yes",
  haveLca: "yes",
  havePayStubs: "yes",
  haveApprovalNotice: "yes",
  employerChanged90Days: "no",
  employmentGap: "no",
  dutiesMatchPetition: "yes",
  profileAccurate: "yes",
  priorRefusalOrRemoval: "no",
  priorCriminalHistory: "no",
  pendingI485: "no",
  h4Travelling: "no",
};

describe("AVR — completeness", () => {
  it("refuses to answer until every condition is answered", () => {
    expect(checkAvr(AVR_EMPTY).verdict).toBe("incomplete");
    expect(checkAvr({ ...CLEAN_AVR, sstNational: "" }).verdict).toBe("incomplete");
  });

  it("does not require the refusal follow-up when no application was made", () => {
    expect(checkAvr(CLEAN_AVR).verdict).toBe("eligible");
  });
});

describe("AVR — 22 CFR 41.112(d)(2)(vii), the forfeiture rule", () => {
  it("treats APPLYING as fatal, not merely being refused", () => {
    const applied = checkAvr({
      ...CLEAN_AVR,
      appliedForVisa: "yes",
      visaRefused: "no",
    });
    expect(applied.verdict).toBe("forfeited");
    expect(applied.failures).toHaveLength(1);
    expect(applied.failures[0].cite).toContain("(d)(2)(vii)");
  });

  it("still forfeits when the visa was refused", () => {
    const refused = checkAvr({
      ...CLEAN_AVR,
      appliedForVisa: "yes",
      visaRefused: "yes",
    });
    expect(refused.verdict).toBe("forfeited");
    expect(refused.failures[0].detail).toContain("refused");
  });

  it("reports plain ineligibility when other conditions also fail", () => {
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

describe("AVR — destination rules", () => {
  it("rejects travel outside contiguous territory", () => {
    const r = checkAvr({ ...CLEAN_AVR, destination: "elsewhere" });
    expect(r.verdict).toBe("ineligible");
    expect(r.failures.some((f) => f.cite.indexOf("(d)(2)(ii)") !== -1)).toBe(true);
  });

  it("allows adjacent islands for F and J only", () => {
    const fj = checkAvr({
      ...CLEAN_AVR,
      statusClass: "f-j",
      endorsedForm: "yes",
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
    expect(checkAvr({ ...CLEAN_AVR, under30Days: "no" }).verdict).toBe("ineligible");
  });
});

describe("AVR — absolute exclusions", () => {
  it("treats the state-sponsor nationality exclusion as fatal", () => {
    const r = checkAvr({ ...CLEAN_AVR, sstNational: "yes" });
    expect(r.verdict).toBe("ineligible");
    expect(r.failures.some((f) => f.cite.indexOf("(d)(3)") !== -1)).toBe(true);
  });

  it("rejects an applicant needing a 212(d)(3) waiver", () => {
    expect(checkAvr({ ...CLEAN_AVR, needsWaiver: "yes" }).verdict).toBe("ineligible");
  });

  it("fails an expired I-94 or a lapsed status", () => {
    expect(checkAvr({ ...CLEAN_AVR, unexpiredI94: "no" }).verdict).toBe("ineligible");
    expect(checkAvr({ ...CLEAN_AVR, maintainedStatus: "no" }).verdict).toBe("ineligible");
  });

  it("cites a regulation for every failure it reports", () => {
    const r = checkAvr({
      hasRevalidatableVisa: "yes",
      endorsedForm: "",
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

describe("AVR — you need a visa to revalidate", () => {
  it("does not declare eligibility from an I-94 and passport alone", () => {
    const r = checkAvr({ ...CLEAN_AVR, hasRevalidatableVisa: "no" });
    expect(r.verdict).not.toBe("eligible");
    expect(r.failures.some((f) => f.cite.indexOf("(d)(1)") !== -1)).toBe(true);
  });
});

describe("AVR — F and J documentary condition", () => {
  it("cannot pass an F/J traveller without an endorsed I-20 or DS-2019", () => {
    const r = checkAvr({
      ...CLEAN_AVR,
      statusClass: "f-j",
      endorsedForm: "no",
    });
    expect(r.verdict).not.toBe("eligible");
    expect(
      r.failures.some((f) => f.cite.indexOf("(d)(2)(i)") !== -1),
    ).toBe(true);
  });

  it("will not rule at all until the F/J form question is answered", () => {
    const r = checkAvr({ ...CLEAN_AVR, statusClass: "f-j", endorsedForm: "" });
    expect(r.verdict).toBe("incomplete");
  });

  it("passes an F/J traveller who holds the endorsed form", () => {
    const r = checkAvr({
      ...CLEAN_AVR,
      statusClass: "f-j",
      endorsedForm: "yes",
    });
    expect(r.verdict).toBe("eligible");
  });
});

describe("preparedness checklist", () => {
  it("returns nothing outstanding for a clean traveller", () => {
    const r = assessEntryPreparedness(CLEAN_PREP);
    expect(r.complete).toBe(true);
    expect(r.findings).toHaveLength(0);
    expect(r.documents.length).toBeGreaterThan(3);
  });

  it("will not assess a partially answered checklist", () => {
    expect(assessEntryPreparedness(PREP_EMPTY).complete).toBe(false);
  });

  it("treats an expired visa with no exception as a hard stop", () => {
    const r = assessEntryPreparedness({
      ...CLEAN_PREP,
      visaPosture: "expired-none",
    });
    expect(r.hardStops.map((f) => f.id)).toContain("visa-expired");
  });

  it("does NOT flag an expired visa when AVR conditions are met", () => {
    const r = assessEntryPreparedness({
      ...CLEAN_PREP,
      visaPosture: "expired-avr",
    });
    expect(r.hardStops).toHaveLength(0);
  });

  it("never treats an I-797B as inherently risky", () => {
    // The regression this locks in: the old scorecard scored an I-797B as a
    // risk factor. It is an ordinary consular-notification approval.
    const r = assessEntryPreparedness(CLEAN_PREP);
    const text = JSON.stringify(r).toLowerCase();
    expect(text).not.toContain("i-797b");
    expect(r.findings).toHaveLength(0);
  });

  it("only raises a worksite question when the move was outside the LCA area", () => {
    const sameArea = assessEntryPreparedness({
      ...CLEAN_PREP,
      worksiteMove: "same-area",
    });
    expect(sameArea.findings).toHaveLength(0);

    const outside = assessEntryPreparedness({
      ...CLEAN_PREP,
      worksiteMove: "outside-area",
      amendmentFiled: "no",
    });
    expect(outside.attorneyReview.map((f) => f.id)).toContain(
      "worksite-material",
    );
  });

  it("routes history and status questions to attorney review, not documents", () => {
    const r = assessEntryPreparedness({
      ...CLEAN_PREP,
      priorRefusalOrRemoval: "yes",
      priorCriminalHistory: "yes",
      employmentGap: "yes",
    });
    expect(r.attorneyReview.length).toBeGreaterThanOrEqual(3);
    expect(r.hardStops).toHaveLength(0);
  });

  it("frames profile advice around accuracy, never concealment", () => {
    const r = assessEntryPreparedness({
      ...CLEAN_PREP,
      profileAccurate: "no",
    });
    const f = r.documentGaps.filter((x) => x.id === "profile")[0];
    expect(f).toBeTruthy();
    expect(f.detail).toMatch(/truthful|accurate|misrepresentation/i);
    expect(f.detail).toMatch(/[Nn]ever alter, conceal or delete/);
  });

  it("produces no score, band or probability anywhere in the result", () => {
    const r = assessEntryPreparedness(CLEAN_PREP);
    expect(r).not.toHaveProperty("score");
    expect(r).not.toHaveProperty("band");
    expect(r).not.toHaveProperty("maxScore");
  });

  it("surfaces the H/L I-485 exception rather than demanding advance parole", () => {
    const r = assessEntryPreparedness({ ...CLEAN_PREP, pendingI485: "yes" });
    expect(r.i485Note).toContain("245.2(a)(4)(ii)(C)");
    expect(r.i485Note).toMatch(/exception/i);
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
    // The bar tiers must be complete enough not to mislead.
    expect(expedited.bar).toMatch(/20 years/);
    expect(expedited.bar).toMatch(/aggravated felony/i);
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
