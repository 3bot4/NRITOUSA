import { describe, expect, it } from "vitest";
import {
  dsFixedAdmissionRule,
  factsById,
  optDenialRules,
  unlawfulPresence,
  f1VisaFees,
  f1VisaTotalUsd,
  f2DependentAddOnUsd,
  h1bCapSubjectFeeProposal,
  h1bProclamationFee,
  indiaTcs,
  mythVsRealityFacts,
  optProposedFee,
  optRules,
  policyItems,
  studentSources,
  taxConstants,
  usRemittanceExcise,
  globalMobilityFacts,
  STUDENT_DATA_VERIFIED,
} from "./studentClusterData";
import { studentPageList, shareCopy, relatedByPage } from "@/lib/studentCluster";

describe("policy items can never be silently totalled", () => {
  it("gives every non-in-force policy item a null amount", () => {
    for (const item of policyItems) {
      if (item.status !== "in-force") {
        expect(item.amountUsd, `${item.id} must not be summable`).toBeNull();
      }
    }
  });

  it("keeps the $100,000 H-1B fee out of any total", () => {
    expect(h1bProclamationFee.amountUsd).toBeNull();
    expect(h1bProclamationFee.status).toBe("blocked");
  });

  it("keeps the proposed OPT fee out of any total", () => {
    expect(optProposedFee.amountUsd).toBeNull();
    // "reported", not "proposed": no Federal Register proposal exists for it,
    // so the badge must not read "Proposed only" beside a line saying it was
    // never formally proposed.
    expect(optProposedFee.status).toBe("reported");
  });

  it("states the vacatur on the H-1B fee status line", () => {
    expect(h1bProclamationFee.statusLine).toMatch(/NOT currently collected/i);
    expect(h1bProclamationFee.statusLine).toContain("June 8, 2026");
    expect(h1bProclamationFee.detail).toContain("employer");
  });

  it("says DISCUSSED/REPORTED ONLY on the OPT fee status line", () => {
    expect(optProposedFee.statusLine).toContain("DISCUSSED/REPORTED ONLY");
    expect(optProposedFee.statusLine).toMatch(/not formally proposed/i);
    expect(optProposedFee.statusLine).toMatch(/nobody is currently being charged/i);
    // The old label contradicted the sentence that followed it.
    expect(optProposedFee.statusLine).not.toContain("PROPOSED ONLY —");
  });

  it("keeps the $103,265 NPRM scope tied to the operative regulatory text", () => {
    expect(h1bCapSubjectFeeProposal.status).toBe("proposed");
    expect(h1bCapSubjectFeeProposal.amountUsd).toBeNull();
    expect(h1bCapSubjectFeeProposal.detail).toMatch(
      /cap-subject F-1-to-H-1B change-of-status petition filed inside the United States/i
    );
    expect(h1bCapSubjectFeeProposal.detail).toContain("214(g)(5)(C)");
    expect(h1bCapSubjectFeeProposal.detail).toMatch(/advanced-degree allocation is included/i);
    expect(h1bCapSubjectFeeProposal.detail).toMatch(/paid by H-1B petitioners and not H-1B beneficiaries/i);
  });

  it("gives every policy item a source and a verification date", () => {
    for (const item of policyItems) {
      expect(item.source.href).toMatch(/^https:\/\//);
      expect(item.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("the end of duration of status", () => {
  it("is carried as a scheduled rule that can never be treated as in force", () => {
    expect(dsFixedAdmissionRule.status).toBe("scheduled");
    expect(dsFixedAdmissionRule.amountUsd).toBeNull();
    expect(dsFixedAdmissionRule.statusLine).toMatch(/not yet in effect/i);
  });

  it("names the effective date and the legal challenge", () => {
    expect(dsFixedAdmissionRule.statusLine).toContain("September 15, 2026");
    expect(dsFixedAdmissionRule.detail).toMatch(/September 9, 2026/);
    expect(dsFixedAdmissionRule.detail).toMatch(/30-day grace period/);
  });

  it("keeps the 60-day grace period as the modelled default", () => {
    // Students already admitted for D/S keep 60 days until they travel, so the
    // calculators must not switch to 30 before the rule reaches them.
    expect(optRules.gracePeriodDays).toBe(60);
    expect(optRules.gracePeriodDaysUnderFixedAdmission).toBe(30);
  });
});

describe("OPT denial consequences follow the USCIS Policy Manual", () => {
  it("uses the later of program end and denial date, not just the denial date", () => {
    expect(optDenialRules.postCompletion).toMatch(/whichever is later/i);
    expect(optDenialRules.postCompletion).toContain("60 days");
  });

  it("keeps the failure-to-maintain-status carve-out attached to the rule", () => {
    // Publishing the 60-day rule without this exception would tell a student
    // who must leave immediately that they have two months.
    expect(optDenialRules.postCompletionException).toMatch(/immediately/i);
  });

  it("keeps the STEM branch separate, running from the denial date", () => {
    expect(optDenialRules.stemExtension).toMatch(/denial date/i);
  });

  it("cites the Policy Manual", () => {
    expect(optDenialRules.source.href).toContain("policy-manual");
  });
});

describe("the fixed-admission rule's practical-training transition relief", () => {
  it("records the March 18, 2027 I-765 window that avoids a separate I-539", () => {
    expect(dsFixedAdmissionRule.detail).toContain("March 18, 2027");
    expect(dsFixedAdmissionRule.detail).toMatch(/I-539/);
  });

  it("names the court, judge and docket behind the challenge", () => {
    expect(dsFixedAdmissionRule.detail).toContain("1:26-cv-13799");
    expect(dsFixedAdmissionRule.detail).toMatch(/Saylor/);
  });
});

describe("unlawful presence is not conflated with status violation", () => {
  it("states the post-Guilford rule rather than 'starts immediately'", () => {
    expect(unlawfulPresence.currentRule).toMatch(/formally finds|immigration judge/i);
    expect(unlawfulPresence.currentRule).not.toMatch(/starts? immediately/i);
  });

  it("keeps a correcting share fact and a source", () => {
    const [fact] = factsById("unlawful-presence");
    expect(fact.reality).toMatch(/not/i);
    expect(unlawfulPresence.source.href).toMatch(/^https:\/\//);
  });
});

describe("the extra OPT filing deadlines most content omits", () => {
  it("carries the 30-day DSO recommendation rule", () => {
    expect(optRules.dsoRecommendationFilingDays).toBe(30);
    expect(optRules.stemDsoRecommendationFilingDays).toBe(60);
  });

  it("carries the 180-day authorisation while a STEM extension is pending", () => {
    expect(optRules.stemPendingAutoExtensionDays).toBe(180);
  });
});

describe("share facts are addressed by id, not position", () => {
  it("resolves every id used across the cluster", () => {
    expect(() =>
      factsById(
        "std-deduction",
        "five-year-rule",
        "fica-refund",
        "stem-resets",
        "counter-abroad",
        "cpt-12-month",
        "unlawful-presence"
      )
    ).not.toThrow();
  });

  it("throws loudly on an unknown id rather than rendering the wrong fact", () => {
    expect(() => factsById("no-such-fact")).toThrow(/Unknown share fact/);
  });

  it("gives every fact a unique id", () => {
    const ids = mythVsRealityFacts.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("F-1 visa fee stack", () => {
  it("totals $785 for a single applicant", () => {
    expect(f1VisaTotalUsd).toBe(785);
  });

  it("charges the SEVIS fee once but repeats per-applicant fees", () => {
    const sevis = f1VisaFees.find((f) => f.id === "sevis")!;
    expect(sevis.perDependent).toBe(false);
    expect(f2DependentAddOnUsd).toBe(185 + 250);
  });

  it("gives every fee a source and a refundability note", () => {
    for (const f of f1VisaFees) {
      expect(f.source.href).toMatch(/^https:\/\//);
      expect(f.refundable.length).toBeGreaterThan(20);
    }
  });

  it("flags the integrity fee's uneven rollout rather than asserting it is always charged", () => {
    const integrity = f1VisaFees.find((f) => f.id === "integrity")!;
    expect(integrity.status).toBe("uneven");
  });
});

describe("OPT rules", () => {
  it("treats 150 days as an aggregate, not a per-phase allowance", () => {
    expect(optRules.initialUnemploymentDays).toBe(90);
    expect(optRules.aggregateUnemploymentDaysWithStem).toBe(150);
    expect(
      optRules.initialUnemploymentDays + optRules.stemAdditionalUnemploymentDays
    ).toBe(optRules.aggregateUnemploymentDaysWithStem);
  });

  it("keeps the filing window at 90 days before and 60 after", () => {
    expect(optRules.filingWindowDaysBefore).toBe(90);
    expect(optRules.filingWindowDaysAfter).toBe(60);
  });

  it("keeps the STEM extension at 24 months and grace at 60 days", () => {
    expect(optRules.stemMonths).toBe(24);
    expect(optRules.gracePeriodDays).toBe(60);
  });

  it("gives a terminated student no grace period", () => {
    expect(optRules.terminationGraceDays).toBe(0);
  });
});

describe("tax constants", () => {
  it("splits FICA into its two statutory components", () => {
    expect(taxConstants.socialSecurityPct + taxConstants.medicarePct).toBeCloseTo(
      taxConstants.ficaPct,
      5
    );
  });

  it("uses the published standard deductions", () => {
    expect(taxConstants.standardDeductionSingle[2025]).toBe(15750);
    expect(taxConstants.standardDeductionSingle[2026]).toBe(16100);
  });

  it("gives F-1 five exempt calendar years and J-1 scholars two", () => {
    expect(taxConstants.f1ExemptCalendarYears).toBe(5);
    expect(taxConstants.j1ScholarExemptCalendarYears).toBe(2);
  });
});

describe("remittance rules", () => {
  it("scopes the US excise tax to physical instruments only", () => {
    expect(usRemittanceExcise.ratePct).toBe(1);
    expect(usRemittanceExcise.taxable).toMatch(/cash/i);
    expect(usRemittanceExcise.exempt).toMatch(/bank account/i);
    expect(usRemittanceExcise.exempt).toMatch(/NOT taxed/i);
  });

  it("records the April 2026 TCS cut and the zero loan rate", () => {
    expect(indiaTcs.educationSelfFunded.beforeApr2026Pct).toBe(5);
    expect(indiaTcs.educationSelfFunded.fromApr2026Pct).toBe(2);
    expect(indiaTcs.educationLoanFundedPct).toBe(0);
    expect(indiaTcs.thresholdInr).toBe(1_000_000);
  });

  it("states that TCS is a credit rather than a cost", () => {
    expect(indiaTcs.creditNote).toMatch(/credited|refundable/i);
  });
});

describe("shareable facts", () => {
  it("has a claim, a reality and a why for each", () => {
    for (const f of mythVsRealityFacts) {
      expect(f.claim.length).toBeGreaterThan(10);
      expect(f.reality.length).toBeGreaterThan(5);
      expect(f.why.length).toBeGreaterThan(30);
    }
  });

  it("has no duplicate claims", () => {
    const claims = mythVsRealityFacts.map((f) => f.claim);
    expect(new Set(claims).size).toBe(claims.length);
  });

  it("corrects the STEM-resets myth explicitly", () => {
    const fact = mythVsRealityFacts.find((f) => f.claim.includes("resets"));
    expect(fact).toBeDefined();
    expect(fact!.why).toContain("110");
  });
});

describe("global mobility facts", () => {
  it("states a catch for every route", () => {
    for (const f of globalMobilityFacts) {
      expect(f.catch.length).toBeGreaterThan(30);
      expect(f.source.href).toMatch(/^https:\/\//);
    }
  });

  it("covers the UK and Canada routes", () => {
    const ids = globalMobilityFacts.map((f) => f.id);
    expect(ids).toContain("uk-hpi");
    expect(ids).toContain("ca-express-entry");
  });
});

describe("cluster wiring", () => {
  it("has five pages, all under /education", () => {
    expect(studentPageList).toHaveLength(5);
    for (const p of studentPageList) {
      expect(p.path).toBe(`/education/${p.slug}`);
    }
  });

  it("gives every page share copy with a tagline", () => {
    for (const p of studentPageList) {
      const copy = shareCopy[p.slug];
      expect(copy, `missing share copy for ${p.slug}`).toBeDefined();
      expect(copy.text.length).toBeGreaterThan(40);
      expect(copy.tagline.length).toBeGreaterThan(20);
    }
  });

  it("gives every page related links", () => {
    for (const p of studentPageList) {
      const links = relatedByPage[p.slug];
      expect(links, `missing related links for ${p.slug}`).toBeDefined();
      expect(links.length).toBeGreaterThanOrEqual(3);
      for (const l of links) {
        expect(l.href.startsWith("/")).toBe(true);
      }
    }
  });

  it("gives every page a unique slug, title and seo title", () => {
    const slugs = studentPageList.map((p) => p.slug);
    const titles = studentPageList.map((p) => p.title);
    const seoTitles = studentPageList.map((p) => p.seoTitle);
    expect(new Set(slugs).size).toBe(5);
    expect(new Set(titles).size).toBe(5);
    expect(new Set(seoTitles).size).toBe(5);
  });

  it("gives every page a distinct question, so pages do not cannibalise", () => {
    const answers = studentPageList.map((p) => p.answers.toLowerCase());
    expect(new Set(answers).size).toBe(5);
    for (const p of studentPageList) {
      expect(p.answers.length, `${p.slug} needs a real question`).toBeGreaterThan(20);
      expect(p.audience.length, `${p.slug} needs an audience`).toBeGreaterThan(15);
    }
  });

  it("keeps SEO titles within a sane length", () => {
    for (const p of studentPageList) {
      expect(p.seoTitle.length, `${p.slug} seoTitle too long`).toBeLessThanOrEqual(60);
      expect(
        p.seoDescription.length,
        `${p.slug} seoDescription too long`
      ).toBeLessThanOrEqual(165);
    }
  });

  it("uses https for every official source", () => {
    for (const [key, src] of Object.entries(studentSources)) {
      expect(src.href, `${key} must be https`).toMatch(/^https:\/\//);
    }
  });

  it("carries a single verification date used across the cluster", () => {
    expect(STUDENT_DATA_VERIFIED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(h1bProclamationFee.lastVerified).toBe(STUDENT_DATA_VERIFIED);
    expect(optProposedFee.lastVerified).toBe(STUDENT_DATA_VERIFIED);
  });
});
