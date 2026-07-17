import { describe, it, expect } from "vitest";
import {
  screen,
  groupResults,
  clearedFiveYearBar,
  isQualifiedImmigrant,
  isNarrowListStatus,
  likelyHas40Quarters,
  type Person,
  type ScreenerInputs,
  type ImmigrationStatus,
} from "./benefitsScreenerLogic";
import { povertyGuideline, fplPercent } from "@/data/governmentBenefitsData";

/* ------------------------------------------------------------------ *
 * Builders
 * ------------------------------------------------------------------ */

const person = (over: Partial<Person> & { status: ImmigrationStatus }): Person => ({
  id: over.id ?? "p1",
  label: over.label ?? "You",
  age: over.age ?? 35,
  ...over,
});

const inputs = (over: Partial<ScreenerInputs> = {}): ScreenerInputs => ({
  persons: [person({ status: "us-citizen" })],
  state: "TX",
  householdSize: 1,
  annualIncome: 40000,
  circumstances: [],
  work: { currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 5, paidSsTax: "yes" },
  tax: { filesUsReturn: "yes", childrenWithSsn: 0, filerHasSsn: "yes" },
  ...over,
});

const find = (r: ReturnType<typeof screen>, id: string) => {
  const p = r.programs.find((x) => x.id === id);
  if (!p) throw new Error(`program ${id} not found`);
  return p;
};

/* ------------------------------------------------------------------ *
 * Poverty guideline maths — the backbone of every income screen
 * ------------------------------------------------------------------ */

describe("federal poverty guidelines (2026)", () => {
  it("matches the published ASPE figures for the 48 contiguous states", () => {
    expect(povertyGuideline(1, "TX")).toBe(15960);
    expect(povertyGuideline(2, "TX")).toBe(21640);
    expect(povertyGuideline(3, "TX")).toBe(27320);
    expect(povertyGuideline(4, "TX")).toBe(33000);
    expect(povertyGuideline(8, "TX")).toBe(55720);
  });

  it("uses the higher Alaska and Hawaii figures", () => {
    expect(povertyGuideline(1, "AK")).toBe(19950);
    expect(povertyGuideline(8, "AK")).toBe(69650);
    expect(povertyGuideline(1, "HI")).toBe(18360);
    expect(povertyGuideline(8, "HI")).toBe(64070);
  });

  it("computes a percentage of the guideline", () => {
    expect(fplPercent(33000, 4, "TX")).toBe(100);
    expect(fplPercent(16500, 4, "TX")).toBe(50);
  });
});

/* ------------------------------------------------------------------ *
 * Status predicates
 * ------------------------------------------------------------------ */

describe("status predicates", () => {
  it("treats refugees and asylees as qualified immigrants but not on the narrow post-2025 list", () => {
    const r = person({ status: "refugee" });
    expect(isQualifiedImmigrant(r)).toBe(true);
    // OBBB §10108 / §71109 / §71301 narrow list = citizens, LPRs, CHE, COFA
    expect(isNarrowListStatus(r)).toBe(false);
  });

  it("does not treat work-visa holders as qualified immigrants", () => {
    for (const s of ["h1b", "h4", "l1", "f1", "j"] as ImmigrationStatus[]) {
      expect(isQualifiedImmigrant(person({ status: s }))).toBe(false);
    }
  });

  it("applies the five-year bar to LPRs but exempts refugees-turned-LPRs and military", () => {
    expect(clearedFiveYearBar(person({ status: "lpr", gcYears: 2 }))).toBe(false);
    expect(clearedFiveYearBar(person({ status: "lpr", gcYears: 6 }))).toBe(true);
    expect(clearedFiveYearBar(person({ status: "lpr", gcYears: 2, refugeeBeforeLpr: true }))).toBe(true);
    expect(clearedFiveYearBar(person({ status: "lpr", gcYears: 1, military: true }))).toBe(true);
  });

  it("infers 40 quarters only from sufficient taxed work", () => {
    expect(likelyHas40Quarters({ currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 12, paidSsTax: "yes" })).toBe(true);
    expect(likelyHas40Quarters({ currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 12, paidSsTax: "no" })).toBe(false);
    expect(likelyHas40Quarters({ currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 3, paidSsTax: "yes" })).toBe(false);
    expect(likelyHas40Quarters({ currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 1, paidSsTax: "yes", ssCredits: 44 })).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 * THE CENTRAL SAFETY GUARANTEE:
 * household members are evaluated separately.
 * ------------------------------------------------------------------ */

describe("household members are evaluated separately", () => {
  const h1bFamily = inputs({
    persons: [
      person({ id: "a", label: "You (H-1B)", status: "h1b", age: 38 }),
      person({ id: "b", label: "Spouse (H-4)", status: "h4", age: 36 }),
      person({ id: "c", label: "Child 1 (U.S. citizen)", status: "us-born-child", age: 6 }),
      person({ id: "d", label: "Child 2 (U.S. citizen)", status: "us-born-child", age: 3 }),
    ],
    householdSize: 4,
    annualIncome: 38000,
    circumstances: ["child-under-5", "school-age-child", "needs-food"],
    tax: { filesUsReturn: "yes", childrenWithSsn: 2, filerHasSsn: "yes" },
  });

  it("does not disqualify U.S.-citizen children because the parents hold temporary visas", () => {
    const r = screen(h1bFamily);
    const snap = find(r, "snap");
    // The citizen children must appear as people who may qualify.
    expect(snap.who).toContain("Child 1 (U.S. citizen)");
    expect(snap.who).toContain("Child 2 (U.S. citizen)");
    // The visa-holding parents must not.
    expect(snap.who).not.toContain("You (H-1B)");
    expect(snap.who).not.toContain("Spouse (H-4)");
  });

  it("never returns an entirely empty result set for a mixed-status household", () => {
    const r = screen(h1bFamily);
    const anyone = r.programs.filter((p) => p.who.length > 0);
    expect(anyone.length).toBeGreaterThan(0);
  });

  it("gives the citizen children school meals and the H-1B parents Marketplace access", () => {
    const r = screen(h1bFamily);
    expect(find(r, "school-meals").tier).toBe("strong");
    expect(find(r, "marketplace").who).toContain("You (H-1B)");
  });

  it("flags the January 1, 2027 premium tax credit change for the visa-holder parents", () => {
    const r = screen({ ...h1bFamily, annualIncome: 60000 });
    const ptc = find(r, "ptc");
    expect(ptc.immigrationNote).toMatch(/December 31, 2026|2027/);
    expect(ptc.immigrationNote).toContain("You (H-1B)");
  });
});

/* ------------------------------------------------------------------ *
 * Required test scenarios (Phase 15)
 * ------------------------------------------------------------------ */

describe("scenario: U.S. citizen adult", () => {
  it("does not raise a public-charge flag about the citizen", () => {
    const r = screen(inputs());
    expect(find(r, "marketplace").tier).toBe("strong");
    expect(r.sponsorRisk).toBe(false);
  });
});

describe("scenario: green card holder 5+ years vs under 5 years", () => {
  const gc = (years: number) =>
    inputs({
      persons: [person({ status: "lpr", label: "You", gcYears: years })],
      annualIncome: 18000,
      householdSize: 2,
      circumstances: ["needs-food", "low-income"],
      work: { currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 3, paidSsTax: "yes" },
    });

  it("offers SNAP to a 6-year green card holder", () => {
    const r = screen(gc(6));
    expect(find(r, "snap").who).toContain("You");
  });

  it("withholds SNAP from a 2-year green card holder with no exception", () => {
    const r = screen(gc(2));
    expect(find(r, "snap").who).toHaveLength(0);
    expect(find(r, "snap").tier).toBe("unlikely");
  });

  it("restores SNAP for a 2-year green card holder with 40 quarters", () => {
    const base = gc(2);
    const r = screen({
      ...base,
      work: { currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 12, paidSsTax: "yes" },
    });
    expect(find(r, "snap").who).toContain("You");
  });

  it("exempts an LPR child under 18 from the five-year bar for SNAP", () => {
    const r = screen(
      inputs({
        persons: [
          person({ id: "a", label: "Parent", status: "lpr", gcYears: 2, age: 40 }),
          person({ id: "b", label: "Child", status: "lpr", gcYears: 2, age: 9 }),
        ],
        householdSize: 2,
        annualIncome: 18000,
        circumstances: ["school-age-child"],
      }),
    );
    const snap = find(r, "snap");
    expect(snap.who).toContain("Child");
    expect(snap.who).not.toContain("Parent");
  });
});

describe("scenario: recently laid-off H-1B worker", () => {
  const laidOff = inputs({
    persons: [person({ status: "h1b", label: "You" })],
    circumstances: ["recently-lost-job", "needs-health-insurance"],
    work: { currentlyWorking: false, recentlyLaidOff: true, usWorkYears: 6, paidSsTax: "yes" },
    annualIncome: 30000,
  });

  it("routes unemployment to the state rather than guessing", () => {
    const r = screen(laidOff);
    const ui = find(r, "unemployment");
    expect(ui.tier).toBe("state-check");
    expect(ui.estimate?.basis).toMatch(/official agency calculation required/i);
    expect(ui.estimate?.monthly).toBeUndefined();
  });

  it("explains the work-authorization obstacle rather than saying a flat no", () => {
    const r = screen(laidOff);
    expect(find(r, "unemployment").immigrationNote).toMatch(/authorized to work/i);
  });

  it("treats unemployment as outside the means-tested category", () => {
    const r = screen(laidOff);
    expect(find(r, "unemployment").publicCharge).toBe("outside-category");
  });
});

describe("scenario: refugee / asylee", () => {
  const refugee = inputs({
    persons: [person({ status: "refugee", label: "You" })],
    annualIncome: 15000,
    householdSize: 2,
    circumstances: ["needs-food", "low-income"],
  });

  it("reflects that SNAP by virtue of refugee status ended in July 2025", () => {
    const r = screen(refugee);
    const snap = find(r, "snap");
    expect(snap.who).toHaveLength(0);
    expect(snap.immigrationNote).toMatch(/July 4, 2025/);
  });

  it("notes the refugee is exempt from public charge", () => {
    const r = screen(refugee);
    expect(r.immigrationFlags.join(" ")).toMatch(/exempt from the public-charge/i);
  });

  it("flags the October 1, 2026 Medicaid change", () => {
    const r = screen(refugee);
    expect(r.immigrationFlags.join(" ")).toMatch(/October 1, 2026/);
  });
});

describe("scenario: F-1 student", () => {
  it("does not offer federal student aid to an F-1 student", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "f1", label: "You", age: 24 })],
        circumstances: ["college-student"],
        annualIncome: 12000,
      }),
    );
    const fafsa = find(r, "fafsa");
    expect(fafsa.tier).toBe("unlikely");
    expect(fafsa.who).toHaveLength(0);
    // …but must still point to state options rather than dead-ending.
    expect(fafsa.stateNote).toMatch(/in-state tuition/i);
  });
});

describe("scenario: senior immigrant with limited U.S. work history", () => {
  const senior = inputs({
    persons: [person({ status: "lpr", label: "Parent", age: 68, gcYears: 6 })],
    circumstances: ["age-65-plus", "low-income"],
    annualIncome: 11000,
    work: { currentlyWorking: false, recentlyLaidOff: false, usWorkYears: 2, paidSsTax: "yes" },
  });

  it("explains the Medicare buy-in route when 40 quarters are missing", () => {
    const r = screen(senior);
    expect(find(r, "medicare").why).toMatch(/five years of continuous residence|Part A premium/i);
  });

  it("is honest that SSI is hard, and that receipt is considerable but not decisive", () => {
    const r = screen(senior);
    const ssi = find(r, "ssi");
    // Cash aid is considerable under both frameworks — but never automatic.
    expect(ssi.publicCharge).toBe("may-consider");
    expect(ssi.publicChargeNote).toMatch(/not automatically decisive|does not automatically result in denial/i);
    // No 40 quarters → should not be presented as a strong possibility.
    expect(ssi.tier).toBe("unlikely");
  });
});

describe("scenario: ITIN filer", () => {
  it("denies EITC but still surfaces other credits", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "other-lawful", label: "You" })],
        tax: { filesUsReturn: "yes", childrenWithSsn: 0, filerHasSsn: "no" },
        annualIncome: 25000,
      }),
    );
    expect(find(r, "eitc").tier).toBe("unlikely");
    expect(find(r, "eitc").why).toMatch(/ITIN filers cannot claim it/i);
    expect(find(r, "itin-credits").tier).toBe("possible");
  });
});

/* ------------------------------------------------------------------ *
 * Non-negotiable output guarantees
 * ------------------------------------------------------------------ */

describe("output guarantees", () => {
  const everyStatus = Object.keys({
    "us-citizen": 1, "us-born-child": 1, naturalized: 1, lpr: 1, "conditional-lpr": 1,
    h1b: 1, h4: 1, l1: 1, l2: 1, f1: 1, f2: 1, j: 1, o1: 1, e: 1, tps: 1,
    refugee: 1, asylee: 1, parolee: 1, "pending-aos": 1, "other-lawful": 1,
    "no-lawful-status": 1, "prefer-not": 1,
  }) as ImmigrationStatus[];

  it("never guarantees eligibility for any status", () => {
    for (const status of everyStatus) {
      const r = screen(
        inputs({
          persons: [person({ status, label: "You" })],
          circumstances: ["needs-food", "needs-health-insurance", "low-income"],
          annualIncome: 20000,
          householdSize: 3,
        }),
      );
      for (const p of r.programs) {
        // No result may assert a determination.
        expect(p.why).not.toMatch(/\byou qualify\b/i);
        expect(p.why).not.toMatch(/\byou are eligible\b/i);
        expect(p.why).not.toMatch(/\bguaranteed\b/i);
      }
    }
  });

  it("never fabricates a precise dollar amount without a published basis", () => {
    const r = screen(
      inputs({
        circumstances: ["recently-lost-job", "age-65-plus"],
        work: { currentlyWorking: false, recentlyLaidOff: true, usWorkYears: 4, paidSsTax: "yes" },
      }),
    );
    for (const p of r.programs) {
      if (p.estimate?.annual || p.estimate?.monthly) {
        // Any figure must carry a year and a stated basis.
        expect(p.estimate.year).toBeTruthy();
        expect(p.estimate.basis.length).toBeGreaterThan(30);
      }
    }
  });

  it("keeps public charge and I-864 sponsor reimbursement separate", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "lpr", label: "You", gcYears: 2, sponsoredI864: "yes" })],
        circumstances: ["needs-food", "low-income"],
        annualIncome: 15000,
      }),
    );
    const flags = r.immigrationFlags.join(" ");
    expect(flags).toMatch(/separate issue from public charge/i);
    expect(flags).toMatch(/cannot block a green card/i);
    // The sponsor note must never claim the sponsor debt affects admissibility.
    for (const p of r.programs) {
      if (p.sponsorNote) {
        expect(p.sponsorNote).toMatch(/not public charge/i);
      }
    }
  });

  it("treats means-tested programs as 'may be considered', never categorically counted/not counted", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "lpr", label: "You", gcYears: 7 })],
        circumstances: ["low-income", "disability", "needs-food"],
        annualIncome: 12000,
        work: { currentlyWorking: false, recentlyLaidOff: false, usWorkYears: 12, paidSsTax: "yes" },
      }),
    );
    // Cash aid and non-cash means-tested benefits alike: considerable, not decisive.
    expect(find(r, "ssi").publicCharge).toBe("may-consider");
    expect(find(r, "tanf").publicCharge).toBe("may-consider");
    expect(find(r, "snap").publicCharge).toBe("may-consider");
    expect(find(r, "medicaid").publicCharge).toBe("may-consider");
    // Earned benefits sit outside the means-tested category entirely.
    expect(find(r, "social-security").publicCharge).toBe("outside-category");
    expect(find(r, "workers-comp").publicCharge).toBe("outside-category");
  });

  it("always warns against blindly adding programs together", () => {
    const r = screen(inputs());
    expect(r.assumptions.join(" ")).toMatch(/do not add|interact/i);
    expect(r.notInTotal.length).toBeGreaterThan(0);
  });

  it("always tells the user the I-485 household-income exclusion rule", () => {
    const r = screen(inputs());
    expect(r.immigrationFlags.join(" ")).toMatch(/I-485/);
  });

  it("gives every program an official .gov or official-program apply link", () => {
    const r = screen(
      inputs({
        circumstances: [
          "pregnant", "child-under-5", "school-age-child", "age-65-plus", "disability",
          "recently-lost-job", "low-income", "needs-health-insurance", "college-student",
          "needs-food", "needs-housing-utility",
        ],
        householdSize: 5,
        annualIncome: 20000,
      }),
    );
    expect(r.programs.length).toBeGreaterThan(10);
    for (const p of r.programs) {
      expect(p.applyUrl).toMatch(/^https:\/\/[a-z0-9.-]*\.gov\//);
      expect(p.publicChargeNote.length).toBeGreaterThan(10);
      expect(p.immigrationNote.length).toBeGreaterThan(10);
    }
  });

  /* ---------------------------------------------------------------- *
   * PUBLIC-CHARGE OUTPUT SAFETY — DHS final rule 2026-14539.
   * ---------------------------------------------------------------- */

  it("never emits a banned public-charge phrase for any household", () => {
    // The four phrases the output must never contain: the first two because DHS
    // adopted no post-2026-09-18 exclusion list, the last two because no single
    // benefit is ever outcome-determinative.
    const banned = [
      /\bsafe\b/i,
      /definitely not counted/i,
      /will hurt your green card/i,
      /automatically disqualifying/i,
    ];
    const statuses: ImmigrationStatus[] = [
      "us-citizen", "lpr", "h1b", "h4", "f1", "refugee", "asylee", "tps",
      "parolee", "pending-aos", "other-lawful",
    ];
    for (const status of statuses) {
      const r = screen(
        inputs({
          persons: [person({ status, label: "You" })],
          circumstances: [
            "needs-food", "low-income", "needs-health-insurance", "disability",
            "age-65-plus", "recently-lost-job", "child-under-5",
          ],
          householdSize: 4,
          annualIncome: 20000,
        }),
      );
      const blob = [
        ...r.programs.map((p) => `${p.publicChargeNote} ${p.why} ${p.immigrationNote}`),
        ...r.immigrationFlags,
      ].join(" ");
      for (const b of banned) {
        expect(blob, `banned phrase ${b} leaked for status ${status}`).not.toMatch(b);
      }
    }
  });

  it("never says a single benefit automatically causes denial", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "pending-aos", label: "You" })],
        circumstances: ["needs-food", "low-income", "disability", "age-65-plus"],
        annualIncome: 11000,
        householdSize: 3,
      }),
    );
    const blob = r.programs.map((p) => p.publicChargeNote).join(" ") + r.immigrationFlags.join(" ");
    expect(blob).not.toMatch(/automatically (results in|causes) (a )?(denial|public-charge finding)\b(?! )/i);
    // …and must affirmatively say the opposite somewhere.
    expect(blob).toMatch(/does not automatically|no single benefit|one factor/i);
  });

  it("scenario: H-1B applicant personally receiving unemployment → outside the means-tested category", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "h1b", label: "You" })],
        circumstances: ["recently-lost-job"],
        work: { currentlyWorking: false, recentlyLaidOff: true, usWorkYears: 6, paidSsTax: "yes" },
      }),
    );
    const ui = find(r, "unemployment");
    expect(ui.publicCharge).toBe("outside-category");
    expect(ui.publicChargeNote).toMatch(/generally outside means-tested public-benefit consideration/i);
  });

  it("scenario: H-1B parent with a U.S.-citizen child receiving SNAP → child's receipt is not the parent's", () => {
    const r = screen(
      inputs({
        persons: [
          person({ id: "a", label: "You", status: "h1b", age: 38 }),
          person({ id: "c", label: "Child", status: "us-born-child", age: 7 }),
        ],
        householdSize: 2,
        annualIncome: 18000,
        circumstances: ["needs-food", "school-age-child"],
      }),
    );
    const snap = find(r, "snap");
    expect(snap.who).toContain("Child");
    expect(snap.who).not.toContain("You");
    expect(snap.publicChargeNote).toMatch(
      /generally not treated as the applicant's receipt; household financial circumstances may still be relevant/i,
    );
  });

  it("scenario: applicant claiming a means-tested tax credit → may be considered from Sept 18, not automatic", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "pending-aos", label: "You" })],
        tax: { filesUsReturn: "yes", childrenWithSsn: 2, filerHasSsn: "yes" },
        annualIncome: 42000,
        householdSize: 4,
      }),
    );
    const ctc = find(r, "ctc");
    expect(ctc.publicCharge).toBe("may-consider");
    expect(ctc.publicChargeNote).toMatch(/September 18, 2026/);
    expect(ctc.publicChargeNote).toMatch(/one factor in the totality/i);
    expect(ctc.publicChargeNote).toMatch(/does not automatically result in a public-charge finding/i);
    // Tax eligibility and public charge must be presented as separate questions.
    expect(ctc.publicChargeNote).toMatch(/separate questions/i);
    // The old, now-wrong claim must be gone.
    expect(ctc.publicChargeNote).not.toMatch(/not public assistance/i);
  });

  it("scenario: adjustment applicant receiving SNAP — both transition rules are stated and kept distinct", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "pending-aos", label: "You" })],
        circumstances: ["needs-food", "low-income"],
        annualIncome: 15000,
        householdSize: 3,
      }),
    );
    const flags = r.immigrationFlags.join(" ");
    // Filing-date rule
    expect(flags).toMatch(/postmarked or electronically submitted and accepted before September 18, 2026/i);
    expect(flags).toMatch(/FILING date/);
    // Receipt-date rule
    expect(flags).toMatch(/RECEIPT date/);
    expect(flags).toMatch(/received before September 18, 2026 are treated consistently with the 2022 rule/i);
    // Never merged
    expect(flags).toMatch(/different question from your filing date/i);
    // SNAP itself carries the pre/post distinction
    expect(find(r, "snap").publicChargeNote).toMatch(/before September 18, 2026: excluded under the 2022 framework/i);
    expect(find(r, "snap").publicChargeNote).toMatch(/may be considered — individual review recommended/i);
  });

  it("scenario: refugee/asylee is flagged as exempt from public charge", () => {
    for (const status of ["refugee", "asylee"] as ImmigrationStatus[]) {
      const r = screen(inputs({ persons: [person({ status, label: "You" })], annualIncome: 14000 }));
      expect(r.immigrationFlags.join(" ")).toMatch(/exempt from the public-charge ground/i);
    }
  });

  it("states the correct public-charge definition and never the 'primarily dependent' standard", () => {
    const r = screen(
      inputs({ persons: [person({ status: "pending-aos", label: "You" })], annualIncome: 30000 }),
    );
    const flags = r.immigrationFlags.join(" ");
    expect(flags).toMatch(/ground of inadmissibility/i);
    expect(flags).toMatch(/likely at any time to become a public charge/i);
    expect(flags).toMatch(/individualized determination based on the totality/i);
    // The 2022 standard must only ever appear as something REMOVED.
    expect(flags).toMatch(/without the 2022 rule's "primarily dependent" standard/i);
    // Renewal + naturalization are outside it.
    expect(flags).toMatch(/not assessed at green card renewal or at naturalization/i);
  });

  it("scenario: applicant personally receiving SSI → considered, never automatic", () => {
    // An LPR sponsored on I-864: the one realistic profile where SSI eligibility,
    // public charge and sponsor reimbursement can all be live at once. (A
    // pending-AOS filer is not a qualified immigrant, so SSI does not arise.)
    const r = screen(
      inputs({
        persons: [
          person({ status: "lpr", label: "You", age: 67, gcYears: 7, sponsoredI864: "yes" }),
        ],
        circumstances: ["age-65-plus", "disability", "low-income"],
        annualIncome: 10000,
        householdSize: 2,
        work: { currentlyWorking: false, recentlyLaidOff: false, usWorkYears: 12, paidSsTax: "yes" },
      }),
    );
    const ssi = find(r, "ssi");
    expect(ssi.publicCharge).toBe("may-consider");
    expect(ssi.publicChargeNote).toMatch(/may be considered — individual review recommended/i);
    expect(ssi.publicChargeNote).toMatch(/not automatically decisive/i);

    // Sponsor reimbursement: a POTENTIAL claim, kept separate, never automatic.
    expect(ssi.sponsorNote).toMatch(/may seek reimbursement/i);
    expect(ssi.sponsorNote).toMatch(/subject to the applicable rules/i);
    expect(ssi.sponsorNote).toMatch(/it is not public charge/i);
    expect(ssi.sponsorNote).toMatch(/does not follow automatically/i);

    // The SSI immigration flag must carry the corrected framing.
    const flags = r.immigrationFlags.join(" ");
    expect(flags).toMatch(/SSI may be considered in a public-charge determination/i);
    expect(flags).toMatch(/one factor and does not automatically result in denial/i);
    expect(flags).toMatch(/separate sponsor-reimbursement questions may also arise/i);
  });

  it("never emits a categorical SSI or sponsor claim for any household", () => {
    const banned = [
      /automatically counted against you/i,
      /will cause denial/i,
      /\bdisqualifying\b/i,
      /sponsor must repay/i,
      /automatically reimbursable/i,
      /\breimbursable\b/i,
      /SSI is counted/i,
      /counted under public charge/i,
      /counted under the public-charge rule/i,
    ];
    for (const status of ["lpr", "pending-aos", "refugee", "us-citizen"] as ImmigrationStatus[]) {
      const r = screen(
        inputs({
          persons: [person({ status, label: "You", age: 67, sponsoredI864: "yes" })],
          circumstances: ["age-65-plus", "disability", "low-income", "needs-food"],
          annualIncome: 10000,
          householdSize: 3,
          work: { currentlyWorking: false, recentlyLaidOff: false, usWorkYears: 12, paidSsTax: "yes" },
        }),
      );
      const blob = [
        ...r.programs.map((p) => `${p.publicChargeNote} ${p.sponsorNote ?? ""} ${p.why}`),
        ...r.immigrationFlags,
      ].join(" ");
      for (const b of banned) {
        expect(blob, `banned SSI/sponsor phrase ${b} leaked for ${status}`).not.toMatch(b);
      }
    }
  });

  it("keeps cash-aid programs consistent — TANF is framed like SSI, not categorically", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "lpr", label: "You", gcYears: 7 })],
        circumstances: ["low-income", "needs-food"],
        annualIncome: 12000,
        householdSize: 3,
      }),
    );
    const flags = r.immigrationFlags.join(" ");
    expect(flags).toMatch(/limited benefit categories USCIS considers under the 2022 framework/i);
    expect(flags).toMatch(/does not automatically result in denial/i);
    expect(flags).not.toMatch(/counted under the public-charge rule both before and after/i);
  });

  it("never tells anyone to disenroll", () => {
    const r = screen(
      inputs({
        persons: [person({ status: "pending-aos", label: "You" })],
        circumstances: ["needs-food", "child-under-5", "pregnant"],
        annualIncome: 16000,
        householdSize: 4,
      }),
    );
    const blob = r.immigrationFlags.join(" ") + r.programs.map((p) => p.publicChargeNote).join(" ");
    expect(blob).toMatch(/does not direct or require anyone to disenroll/i);
    expect(blob).not.toMatch(/you should (cancel|disenroll|stop receiving)/i);
  });

  it("groups results into the documented display buckets", () => {
    const r = screen(
      inputs({
        circumstances: ["needs-food", "low-income", "recently-lost-job"],
        householdSize: 4,
        annualIncome: 22000,
      }),
    );
    const groups = groupResults(r);
    expect(groups.length).toBeGreaterThan(1);
    // Every returned group must actually have programs in it.
    for (const g of groups) expect(g.programs.length).toBeGreaterThan(0);
  });
});
