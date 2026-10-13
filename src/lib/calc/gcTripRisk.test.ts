import { describe, expect, it } from "vitest";
import { assessTripRisk, type TripRiskInput } from "./gcTripRisk";

const base: TripRiskInput = {
  departure: "2026-01-01",
  plannedReturn: "2026-02-01",
  hasReentryPermit: false,
  priorLongTrips: false,
  pendingApplication: "none",
  anyCriminalHistory: false,
  cardValidThroughReturn: true,
};

/** Return a trip of roughly `days` days abroad. */
const tripOf = (days: number): Partial<TripRiskInput> => {
  const dep = Date.UTC(2026, 0, 1);
  const ret = dep + (days + 1) * 86_400_000;
  return {
    departure: "2026-01-01",
    plannedReturn: new Date(ret).toISOString().slice(0, 10),
  };
};

describe("trip length", () => {
  it("measures days abroad, excluding the departure and return days", () => {
    // Depart 1 Jan, return 11 Jan: 9 days abroad.
    const r = assessTripRisk({
      ...base,
      departure: "2026-01-01",
      plannedReturn: "2026-01-11",
    });
    expect(r.tripDays).toBe(9);
  });

  it("rejects a return before departure", () => {
    const r = assessTripRisk({
      ...base,
      departure: "2026-05-01",
      plannedReturn: "2026-04-01",
    });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/before the departure/);
  });

  it("rejects malformed dates", () => {
    expect(assessTripRisk({ ...base, departure: "01/01/2026" }).valid).toBe(false);
    expect(assessTripRisk({ ...base, plannedReturn: "2026-02-30" }).valid).toBe(false);
  });
});

describe("the two regimes stay separate", () => {
  it("a three-month trip leaves both regimes intact", () => {
    const r = assessTripRisk({ ...base, ...tripOf(90) });
    expect(r.tier).toBe("routine");
    expect(r.entryDocument.ok).toBe(true);
    expect(r.continuousResidence.level).toBe("intact");
    expect(r.seekingAdmission.triggered).toBe(false);
  });

  // The error the page exists to prevent: a 7-month trip does NOT invalidate
  // the card, but it DOES raise the continuous-residence presumption.
  it("a seven-month trip keeps the card valid but disrupts continuous residence", () => {
    const r = assessTripRisk({ ...base, ...tripOf(210) });
    expect(r.entryDocument.ok).toBe(true);
    expect(r.entryDocument.text).toContain("211.1(a)(2)");
    expect(r.continuousResidence.level).toBe("rebuttable");
    expect(r.continuousResidence.text).toContain("rebuttable presumption");
    expect(r.tier).toBe("attention");
  });

  it("a seven-month trip triggers the 180-day condition in the statute", () => {
    const r = assessTripRisk({ ...base, ...tripOf(210) });
    expect(r.seekingAdmission.triggered).toBe(true);
    expect(r.seekingAdmission.reasons.join(" ")).toContain("180");
  });

  it("a six-month trip does not cross either threshold", () => {
    const r = assessTripRisk({ ...base, ...tripOf(180) });
    expect(r.continuousResidence.level).toBe("intact");
    expect(r.seekingAdmission.triggered).toBe(false);
  });

  it("a fourteen-month trip with no permit breaks both regimes", () => {
    const r = assessTripRisk({ ...base, ...tripOf(420) });
    expect(r.entryDocument.ok).toBe(false);
    expect(r.continuousResidence.level).toBe("broken");
    expect(r.tier).toBe("critical");
    expect(r.lawyerBeforeBooking).toBe(true);
  });

  // A reentry permit answers the document question and NOT the naturalisation
  // question. Conflating them is the costliest mistake in this area.
  it("a reentry permit fixes the entry document but not continuous residence", () => {
    const r = assessTripRisk({ ...base, ...tripOf(420), hasReentryPermit: true });
    expect(r.entryDocument.ok).toBe(true);
    expect(r.entryDocument.text).toContain("211.1(a)(3)");
    expect(r.continuousResidence.level).toBe("broken");
    expect(r.continuousResidence.text).toContain("reentry permit does not change this");
    expect(r.tier).toBe("serious");
    expect(r.lawyerBeforeBooking).toBe(false);
  });

  it("names the N-470 filing deadline when continuous residence breaks", () => {
    const r = assessTripRisk({ ...base, ...tripOf(420), hasReentryPermit: true });
    const actions = r.actions.join(" ");
    expect(actions).toContain("N-470");
    expect(actions).toContain("BEFORE the absence reaches one continuous year");
  });

  it("explains that the one-year line is measured at boarding", () => {
    const r = assessTripRisk({ ...base, ...tripOf(420), hasReentryPermit: true });
    expect(r.entryDocument.text).toContain("BOARD");
  });
});

describe("criminal history", () => {
  it("escalates and sends the user to a lawyer before booking", () => {
    const r = assessTripRisk({ ...base, ...tripOf(14), anyCriminalHistory: true });
    expect(r.tier).toBe("serious");
    expect(r.lawyerBeforeBooking).toBe(true);
    expect(r.seekingAdmission.triggered).toBe(true);
    expect(r.seekingAdmission.reasons.join(" ")).toContain("212(a)(2)");
  });

  it("says the condition has no time limit", () => {
    const r = assessTripRisk({ ...base, anyCriminalHistory: true });
    expect(r.seekingAdmission.reasons.join(" ")).toContain("no time limit");
  });
});

describe("other inputs", () => {
  it("flags an expired card on a short trip", () => {
    const r = assessTripRisk({
      ...base,
      ...tripOf(20),
      cardValidThroughReturn: false,
    });
    expect(r.entryDocument.ok).toBe(false);
    expect(r.tier).toBe("serious");
    expect(r.documents.join(" ")).toContain("I-90");
  });

  it("treats a pending I-485 as a different problem entirely", () => {
    const r = assessTripRisk({ ...base, ...tripOf(20), pendingApplication: "i-485" });
    expect(r.tier).toBe("critical");
    expect(r.lawyerBeforeBooking).toBe(true);
    expect(r.actions.join(" ")).toContain("advance parole");
  });

  it("notes the six-month I-751 receipt window", () => {
    const r = assessTripRisk({ ...base, ...tripOf(20), pendingApplication: "i-751" });
    expect(r.actions.join(" ")).toContain("211.1(a)(5)");
    expect(r.actions.join(" ")).toContain("six months");
  });

  it("warns an N-400 applicant about a long trip and about appointments", () => {
    const r = assessTripRisk({ ...base, ...tripOf(200), pendingApplication: "n-400" });
    expect(r.tier).toBe("serious");
    expect(r.actions.join(" ")).toContain("biometrics and interview");
  });

  it("raises the tier for a pattern of prior long trips", () => {
    const short = assessTripRisk({ ...base, ...tripOf(30) });
    const pattern = assessTripRisk({ ...base, ...tripOf(30), priorLongTrips: true });
    expect(short.tier).toBe("routine");
    expect(pattern.tier).toBe("attention");
    expect(pattern.seekingAdmission.reasons.join(" ")).toContain("intent question");
  });
});

describe("output hygiene", () => {
  it("never tells the user the trip is safe", () => {
    const r = assessTripRisk({ ...base, ...tripOf(5) });
    const blob = JSON.stringify(r).toLowerCase();
    expect(blob).not.toContain("you will be admitted");
    expect(blob).not.toContain("no risk");
    // "no guaranteed right to counsel" is a correct statement of the law and
    // is expected; a promise of a guaranteed outcome is not.
    expect(blob).not.toMatch(/guaranteed (entry|admission|re-?entry)/);
  });

  it("always advises carrying a lawyer's number on paper", () => {
    const r = assessTripRisk({ ...base, ...tripOf(5) });
    expect(r.actions.join(" ")).toContain("on paper");
  });

  it("de-duplicates the document list", () => {
    const r = assessTripRisk({ ...base, ...tripOf(210) });
    expect(new Set(r.documents).size).toBe(r.documents.length);
  });

  it("never uses the word caveat", () => {
    const r = assessTripRisk({ ...base, ...tripOf(400), anyCriminalHistory: true });
    expect(JSON.stringify(r).toLowerCase()).not.toContain("caveat");
  });
});
