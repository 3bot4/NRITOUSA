/**
 * The 50 required calculation test cases (spec Phase 5), covering the shared
 * engine used by every visitor-insurance calculator. Cases 34, 35, 42, 43,
 * 44, 45 are covered in preExistingAnalyzer.test.ts / money.test.ts instead
 * of here, since they exercise those pure modules directly — cross-referenced
 * in comments below so the full 1-50 list is traceable across the three
 * files.
 */

import { describe, expect, it } from "vitest";
import { dollarsToCents } from "./money";
import { initRunningState, runClaimsForClaimant, runSingleClaim } from "./engine";
import { runHousehold } from "./familyAggregation";
import type { Claim, Claimant, PolicyTerms, ServiceCategory } from "./types";

const usd = dollarsToCents;

function mkClaimant(id: string, age?: number): Claimant {
  return { id, age };
}

function mkClaim(over: Partial<Claim> & { claimantId: string; serviceCategory: ServiceCategory; billedChargeCents: number }): Claim {
  return {
    networkStatus: "in-network",
    coverageEligibility: "covered",
    ...over,
  };
}

function mkPolicy(over: Partial<PolicyTerms> = {}): PolicyTerms {
  return {
    planType: "comprehensive",
    premiumCents: usd(1200),
    premiumScope: "per-traveler",
    costSharingOrder: ["generalDeductible", "coinsurance"],
    deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" },
    coinsurance: { inNetworkMemberPct: 20 },
    policyMaximum: { scope: "individual", amountCents: usd(100_000) },
    outOfPocketMaximum: {
      amountCents: usd(6_000),
      scope: "individual",
      countsToward: { deductible: true, copay: true, coinsurance: true, outOfNetwork: false, nonCovered: false },
    },
    ...over,
  };
}

describe("1. $0 deductible", () => {
  it("skips straight to coinsurance", () => {
    const policy = mkPolicy({ deductible: { amountCents: 0, frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(1000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(0);
    expect(result.memberLiability.coinsuranceCents).toBe(usd(200));
    expect(result.insurerPaymentCents).toBe(usd(800));
  });
});

describe("2. Full deductible remaining (fresh policy period)", () => {
  it("draws from the entire deductible amount on the first claim", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(1200) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(usd(500));
    expect(result.remaining.deductibleCents).toBe(0);
  });
});

describe("3. Partially satisfied deductible", () => {
  it("a second claim sees the reduced remaining deductible", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const claims = [
      mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(200), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", serviceCategory: "urgent-care", billedChargeCents: usd(1000), date: "2026-02-01" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].memberLiability.deductibleCents).toBe(usd(200));
    expect(results[1].memberLiability.deductibleCents).toBe(usd(300)); // remaining 500-200
    expect(results[1].memberLiability.coinsuranceCents).toBe(usd(140)); // 20% of (1000-300)
    expect(results[1].remaining.deductibleCents).toBe(0);
  });
});

describe("4. Claim below deductible", () => {
  it("entire claim is deductible, insurer pays $0", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(300) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(usd(300));
    expect(result.insurerPaymentCents).toBe(0);
    expect(result.remaining.deductibleCents).toBe(usd(200));
  });
});

describe("5. Claim equal to deductible", () => {
  it("fully consumes the deductible, insurer pays $0", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(500) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(usd(500));
    expect(result.insurerPaymentCents).toBe(0);
    expect(result.remaining.deductibleCents).toBe(0);
  });
});

describe("6. Claim above deductible", () => {
  it("deductible fully applied, coinsurance on the remainder", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(2000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(usd(500));
    expect(result.memberLiability.coinsuranceCents).toBe(usd(300)); // 20% of 1500
    expect(result.insurerPaymentCents).toBe(usd(1200));
  });
});

describe("7. 80/20 coinsurance", () => {
  it("member pays 20%, insurer pays 80% of the post-deductible amount", () => {
    const policy = mkPolicy({ coinsurance: { inNetworkMemberPct: 20 } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(2000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.coinsuranceCents).toBe(usd(300));
    expect(result.insurerPaymentCents).toBe(usd(1200));
  });
});

describe("8. 90/10 coinsurance", () => {
  it("member pays 10%", () => {
    const policy = mkPolicy({ coinsurance: { inNetworkMemberPct: 10 } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(2000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.coinsuranceCents).toBe(usd(150));
    expect(result.insurerPaymentCents).toBe(usd(1350));
  });
});

describe("9. 100% after deductible (0% member coinsurance)", () => {
  it("insurer pays the entire post-deductible remainder", () => {
    const policy = mkPolicy({ coinsurance: { inNetworkMemberPct: 0 } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(2000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.coinsuranceCents).toBe(0);
    expect(result.insurerPaymentCents).toBe(usd(1500));
  });
});

describe("10. Coinsurance cap reached", () => {
  it("caps the member's coinsurance share", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 50, capCents: usd(100) },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(1000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.coinsuranceCents).toBe(usd(100));
    expect(result.insurerPaymentCents).toBe(usd(900));
  });
});

describe("11 & 12. Configurable copay/deductible order changes the breakdown", () => {
  const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(600) });
  it("copay before deductible", () => {
    const policy = mkPolicy({
      costSharingOrder: ["copay", "generalDeductible", "coinsurance"],
      copay: { amountCents: usd(200), appliesBeforeDeductible: true },
      deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" },
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.copayCents).toBe(usd(200));
    expect(result.memberLiability.deductibleCents).toBe(usd(400)); // only 400 left after copay
    expect(result.insurerPaymentCents).toBe(0);
  });
  it("deductible before copay", () => {
    const policy = mkPolicy({
      costSharingOrder: ["generalDeductible", "copay", "coinsurance"],
      copay: { amountCents: usd(200), appliesBeforeDeductible: false },
      deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" },
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(usd(500));
    expect(result.memberLiability.copayCents).toBe(usd(100)); // only 100 left after deductible
    expect(result.insurerPaymentCents).toBe(0);
  });
});

describe("13. Per-incident deductible", () => {
  it("a new incident gets a fresh deductible pool", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(300), frequency: "incident", scope: "individual" } });
    const claims = [
      mkClaim({ claimantId: "t1", incidentId: "A", serviceCategory: "physician", billedChargeCents: usd(200), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", incidentId: "A", serviceCategory: "physician", billedChargeCents: usd(500), date: "2026-01-02" }),
      mkClaim({ claimantId: "t1", incidentId: "B", serviceCategory: "urgent-care", billedChargeCents: usd(500), date: "2026-03-01" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].memberLiability.deductibleCents).toBe(usd(200)); // incident A: 300-200=100 left
    expect(results[1].memberLiability.deductibleCents).toBe(usd(100)); // incident A pool exhausted
    expect(results[2].memberLiability.deductibleCents).toBe(usd(300)); // incident B: fresh $300 pool
  });
});

describe("14. Per-policy deductible", () => {
  it("one pool shared across every incident", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(300), frequency: "policy", scope: "individual" } });
    const claims = [
      mkClaim({ claimantId: "t1", incidentId: "A", serviceCategory: "physician", billedChargeCents: usd(200), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", incidentId: "B", serviceCategory: "urgent-care", billedChargeCents: usd(500), date: "2026-03-01" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].memberLiability.deductibleCents).toBe(usd(200));
    expect(results[1].memberLiability.deductibleCents).toBe(usd(100)); // only 100 left, regardless of new incident
  });
});

describe("15. Multiple claims process in chronological order", () => {
  it("sorts out-of-order input by date before threading running state", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(300), frequency: "policy", scope: "individual" } });
    const claims = [
      mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(500), date: "2026-03-05" }),
      mkClaim({ claimantId: "t1", serviceCategory: "urgent-care", billedChargeCents: usd(200), date: "2026-01-10" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].claim.date).toBe("2026-01-10");
    expect(results[0].memberLiability.deductibleCents).toBe(usd(200));
    expect(results[1].claim.date).toBe("2026-03-05");
    expect(results[1].memberLiability.deductibleCents).toBe(usd(100));
  });
});

describe("16 & 17. Multiple travelers, independent deductibles", () => {
  it("each traveler's deductible tracks independently by default", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const household = runHousehold([
      { claimant: mkClaimant("t1"), policy, claims: [mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(400) })] },
      { claimant: mkClaimant("t2"), policy, claims: [mkClaim({ claimantId: "t2", serviceCategory: "physician", billedChargeCents: usd(400) })] },
    ]);
    expect(household.perClaimant["t1"][0].memberLiability.deductibleCents).toBe(usd(400));
    expect(household.perClaimant["t2"][0].memberLiability.deductibleCents).toBe(usd(400));
    expect(household.perClaimant["t1"][0].remaining.deductibleCents).toBe(usd(100));
    expect(household.perClaimant["t2"][0].remaining.deductibleCents).toBe(usd(100));
    expect(household.sharedProvisionsApplied).not.toContain("deductible");
  });
});

describe("18. Shared family deductible", () => {
  it("one pool drawn down across every member's claims", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(1000), familyAmountCents: usd(1000), frequency: "policy", scope: "shared-family" } });
    const household = runHousehold([
      { claimant: mkClaimant("t1"), policy, claims: [mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(600), date: "2026-01-01" })] },
      { claimant: mkClaimant("t2"), policy, claims: [mkClaim({ claimantId: "t2", serviceCategory: "physician", billedChargeCents: usd(500), date: "2026-01-02" })] },
    ]);
    expect(household.perClaimant["t1"][0].memberLiability.deductibleCents).toBe(usd(600));
    expect(household.perClaimant["t2"][0].memberLiability.deductibleCents).toBe(usd(400)); // only 400 left of the shared 1000
    expect(household.sharedProvisionsApplied).toContain("deductible");
  });
});

describe("19. Embedded individual deductible", () => {
  it("an individual whose own embedded cap is met stops paying deductible even if the family pool has room", () => {
    const policy = mkPolicy({
      deductible: { amountCents: usd(300), familyAmountCents: usd(1000), frequency: "policy", scope: "embedded-individual" },
    });
    const household = runHousehold([
      {
        claimant: mkClaimant("t1"),
        policy,
        claims: [
          mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(300), date: "2026-01-01" }),
          mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(200), date: "2026-01-02" }),
        ],
      },
    ]);
    expect(household.perClaimant["t1"][0].memberLiability.deductibleCents).toBe(usd(300)); // hits individual cap
    expect(household.perClaimant["t1"][0].remaining.deductibleCents).toBe(0);
    // Second claim: individual cap already at 0, so no further deductible applies even though the $1000 family pool is far from exhausted.
    expect(household.perClaimant["t1"][1].memberLiability.deductibleCents).toBe(0);
  });
});

describe("20. Fixed-benefit plan", () => {
  it("member owes billed minus the scheduled benefit, no comprehensive math applied", () => {
    const policy = mkPolicy({ planType: "fixed-benefit", scheduledBenefits: { physician: usd(80) } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(150) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.insurerPaymentCents).toBe(usd(80));
    expect(result.memberLiability.aboveScheduledBenefitCents).toBe(usd(70));
    expect(result.memberLiability.deductibleCents).toBe(0);
    expect(result.memberLiability.coinsuranceCents).toBe(0);
  });
});

describe("21. Hybrid plan", () => {
  it("routes each claim to fixed-benefit or comprehensive math per category", () => {
    const policy = mkPolicy({ planType: "hybrid", scheduledBenefits: { physician: usd(80) } });
    const claims = [
      mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(150), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(5000), date: "2026-02-01" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].insurerPaymentCents).toBe(usd(80)); // fixed-benefit path
    expect(results[0].memberLiability.aboveScheduledBenefitCents).toBe(usd(70));
    expect(results[1].memberLiability.aboveScheduledBenefitCents).toBe(0); // comprehensive path
    expect(results[1].memberLiability.deductibleCents).toBeGreaterThan(0);
  });
});

describe("22. Service sublimit", () => {
  it("caps the insurer payment at the entered sublimit", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      serviceSublimits: { imaging: usd(300) },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "imaging", billedChargeCents: usd(500) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.insurerPaymentCents).toBe(usd(300));
    expect(result.memberLiability.aboveSublimitCents).toBe(usd(200));
  });
});

describe("23. Policy maximum reached", () => {
  it("caps insurer payment and reports the shortfall", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      policyMaximum: { scope: "individual", amountCents: usd(1000) },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(1200) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.insurerPaymentCents).toBe(usd(1000));
    expect(result.memberLiability.abovePolicyMaximumCents).toBe(usd(200));
    expect(result.remaining.policyMaximumCents).toBe(0);
  });
});

describe("24. Policy maximum partially used across claims", () => {
  it("a second claim only has the remaining balance available", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      policyMaximum: { scope: "individual", amountCents: usd(1000) },
    });
    const claims = [
      mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(400), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(800), date: "2026-02-01" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].insurerPaymentCents).toBe(usd(400));
    expect(results[0].remaining.policyMaximumCents).toBe(usd(600));
    expect(results[1].insurerPaymentCents).toBe(usd(600));
    expect(results[1].memberLiability.abovePolicyMaximumCents).toBe(usd(200));
  });
});

describe("25. Out-of-pocket maximum present", () => {
  it("releases cost-sharing above the OOP max back to the insurer", () => {
    const policy = mkPolicy({
      deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 20 },
      policyMaximum: undefined,
      outOfPocketMaximum: {
        amountCents: usd(600),
        scope: "individual",
        countsToward: { deductible: true, copay: true, coinsurance: true, outOfNetwork: false, nonCovered: false },
      },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(5000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    // deductible 500 + coinsurance 900 = 1400 eligible toward OOP; only 600 of it is charged to the member.
    expect(result.memberLiability.deductibleCents + result.memberLiability.coinsuranceCents).toBe(usd(600));
    expect(result.memberLiability.totalCents).toBe(usd(600));
    // Conservation: billed = insurer payment + member liability.
    expect(result.insurerPaymentCents + result.memberLiability.totalCents).toBe(usd(5000));
  });
});

describe("26. No out-of-pocket maximum", () => {
  it("flags the missing OOP max and does not cap member liability", () => {
    const policy = mkPolicy({
      deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 20 },
      outOfPocketMaximum: undefined,
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(5000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents + result.memberLiability.coinsuranceCents).toBe(usd(1400));
    expect(result.missingInputs).toContain("outOfPocketMaximum");
    expect(result.uncappedExposureWarning).toBe(true);
  });
});

describe("27. In-network allowed charge", () => {
  it("costs are shared off the allowed amount, no balance billing", () => {
    const policy = mkPolicy({ deductible: { amountCents: 0, frequency: "policy", scope: "individual" } });
    const claim = mkClaim({
      claimantId: "t1",
      serviceCategory: "physician",
      billedChargeCents: usd(1000),
      allowedChargeCents: usd(700),
      networkStatus: "in-network",
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.balanceBillingCents).toBe(0);
    expect(result.memberLiability.coinsuranceCents).toBe(usd(140)); // 20% of allowed $700
  });
});

describe("28 & 29. Out-of-network allowed charge and balance billing", () => {
  it("computes balance billing as billed minus allowed", () => {
    const policy = mkPolicy({ deductible: { amountCents: 0, frequency: "policy", scope: "individual" } });
    const claim = mkClaim({
      claimantId: "t1",
      serviceCategory: "physician",
      billedChargeCents: usd(1000),
      allowedChargeCents: usd(700),
      networkStatus: "out-of-network",
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.balanceBillingCents).toBe(usd(300));
    expect(result.memberLiability.totalCents).toBeGreaterThanOrEqual(usd(300));
  });
});

describe("30. Excluded service", () => {
  it("the full allowed (or billed) amount is non-covered, insurer pays $0", () => {
    const policy = mkPolicy();
    const claim = mkClaim({
      claimantId: "t1",
      serviceCategory: "physical-therapy",
      billedChargeCents: usd(800),
      allowedChargeCents: usd(600),
      coverageEligibility: "excluded",
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.nonCoveredCents).toBe(usd(600));
    expect(result.insurerPaymentCents).toBe(0);
  });
});

describe("31. ER copay", () => {
  it("uses the ER-specific copay instead of the general copay", () => {
    const policy = mkPolicy({
      costSharingOrder: ["copay", "generalDeductible", "coinsurance"],
      erRule: { copayCents: usd(75) },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(400) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.copayCents).toBe(usd(75));
  });
});

describe("32. ER copay waived after hospital admission", () => {
  it("waives the ER copay when erAdmitted is true", () => {
    const policy = mkPolicy({
      costSharingOrder: ["copay", "generalDeductible", "coinsurance"],
      erRule: { copayCents: usd(75), waivedIfAdmitted: true },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(400), erAdmitted: true });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.copayCents).toBe(0);
  });
});

describe("33. Separate ER facility and physician bills share one per-incident maximum", () => {
  it("keeps two claims as distinct line items drawing from the same incident pool", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      costSharingOrder: [],
      perIncidentMaximumCents: usd(200),
    });
    const claims = [
      mkClaim({ claimantId: "t1", incidentId: "er-visit-1", serviceCategory: "er", billedChargeCents: usd(300), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", incidentId: "er-visit-1", serviceCategory: "physician", billedChargeCents: usd(150), date: "2026-01-01" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results).toHaveLength(2);
    expect(results[0].insurerPaymentCents).toBe(usd(200)); // whole per-incident max used by the first bill
    expect(results[1].insurerPaymentCents).toBe(0); // nothing left in the shared incident pool
    expect(results[1].memberLiability.abovePolicyMaximumCents).toBe(usd(150));
  });
});

// 34. Acute-onset benefit maximum — see preExistingAnalyzer.test.ts.
// 35. Age limitation — see preExistingAnalyzer.test.ts.

describe("36. Missing allowed charge", () => {
  it("falls back to billed charge as the base, clearly flagged", () => {
    const policy = mkPolicy({ deductible: { amountCents: 0, frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(1000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.missingInputs).toContain("allowedCharge");
    expect(result.confidence).not.toBe("higher");
    expect(result.ledger.some((l) => l.label.includes("Allowed charge unknown"))).toBe(true);
  });
});

describe("37. Missing coinsurance terms", () => {
  it("flags the missing coinsurance and does not fabricate a split", () => {
    const policy = mkPolicy({ coinsurance: undefined });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(2000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.missingInputs).toContain("coinsurance");
    expect(result.memberLiability.coinsuranceCents).toBe(0);
    expect(result.confidence).not.toBe("higher");
  });
});

describe("38. Missing network status", () => {
  it("flags unknown network status and raises the uncapped-exposure warning", () => {
    const policy = mkPolicy();
    const claim = mkClaim({
      claimantId: "t1",
      serviceCategory: "physician",
      billedChargeCents: usd(1000),
      allowedChargeCents: usd(900),
      networkStatus: "unknown",
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.missingInputs).toContain("networkStatus");
    expect(result.uncappedExposureWarning).toBe(true);
  });
});

describe("39. Zero-dollar claim", () => {
  it("returns all zeros without error", () => {
    const policy = mkPolicy();
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: 0 });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.insurerPaymentCents).toBe(0);
    expect(result.memberLiability.totalCents).toBe(0);
  });
});

describe("40. Very large claim", () => {
  it("stays exact at large integer-cent values (no float drift)", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      policyMaximum: { scope: "individual", amountCents: usd(100_000) },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(5_000_000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.insurerPaymentCents).toBe(usd(100_000));
    expect(result.memberLiability.abovePolicyMaximumCents).toBe(usd(4_900_000));
    expect(Number.isSafeInteger(result.insurerPaymentCents)).toBe(true);
    expect(Number.isSafeInteger(result.memberLiability.totalCents)).toBe(true);
  });
});

describe("41. Premium shown separately from medical cost-sharing", () => {
  it("household totals split premium from medical liability, and they sum exactly", () => {
    const policy = mkPolicy({ premiumCents: usd(1500), premiumScope: "per-traveler" });
    const household = runHousehold([
      { claimant: mkClaimant("t1"), policy, claims: [mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(1000) })] },
    ]);
    expect(household.aggregatePremiumCents).toBe(usd(1500));
    expect(household.aggregateTotalCostCents).toBe(household.aggregatePremiumCents + household.aggregateMedicalLiabilityCents);
  });
});

// 42. End date before start date — see money.test.ts (isValidDateRange).
// 43. Invalid negative input — see money.test.ts (clampCents / dollarsToCents).
// 44. Percentage over 100% — see money.test.ts (clampPercent).
// 45. Rounding to cents — see money.test.ts (pctOfCents).

describe("46. Policy maximum lower than the deductible", () => {
  it("still applies both correctly without error", () => {
    const policy = mkPolicy({
      deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 20 },
      policyMaximum: { scope: "individual", amountCents: usd(100) },
    });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(2000) });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.memberLiability.deductibleCents).toBe(usd(500));
    expect(result.insurerPaymentCents).toBe(usd(100)); // capped by the (very low) policy max
    expect(result.memberLiability.abovePolicyMaximumCents).toBe(usd(1100)); // 1200 (post-deductible insurer share) - 100
  });
});

describe("47. Multiple service sublimits tracked independently", () => {
  it("each category has its own remaining pool", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      serviceSublimits: { imaging: usd(300), lab: usd(150) },
    });
    const claims = [
      mkClaim({ claimantId: "t1", serviceCategory: "imaging", billedChargeCents: usd(500), date: "2026-01-01" }),
      mkClaim({ claimantId: "t1", serviceCategory: "lab", billedChargeCents: usd(200), date: "2026-01-02" }),
    ];
    const results = runClaimsForClaimant(policy, mkClaimant("t1"), claims);
    expect(results[0].insurerPaymentCents).toBe(usd(300));
    expect(results[1].insurerPaymentCents).toBe(usd(150));
  });
});

describe("48. Policy-period reset", () => {
  it("a fresh running state does not carry over a prior period's depletion", () => {
    const policy = mkPolicy({ deductible: { amountCents: usd(500), frequency: "policy", scope: "individual" } });
    const claim = mkClaim({ claimantId: "t1", serviceCategory: "physician", billedChargeCents: usd(1000) });
    const periodOneResult = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState()).result;
    const periodTwoResult = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState()).result; // new policy period
    expect(periodOneResult.memberLiability.deductibleCents).toBe(periodTwoResult.memberLiability.deductibleCents);
    expect(periodTwoResult.memberLiability.deductibleCents).toBe(usd(500));
  });
});

describe("49. Individual policy maximum aggregation across a household", () => {
  it("each member's policy maximum is tracked and reported independently", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      policyMaximum: { scope: "individual", amountCents: usd(1000) },
    });
    const household = runHousehold([
      { claimant: mkClaimant("t1"), policy, claims: [mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(1200) })] },
      { claimant: mkClaimant("t2"), policy, claims: [mkClaim({ claimantId: "t2", serviceCategory: "hospital-admission", billedChargeCents: usd(500) })] },
    ]);
    expect(household.perClaimant["t1"][0].remaining.policyMaximumCents).toBe(0);
    expect(household.perClaimant["t2"][0].remaining.policyMaximumCents).toBe(usd(500));
    expect(household.aggregateInsurerPaymentCents).toBe(usd(1000) + usd(500));
  });
});

describe("50. Shared family policy maximum explicitly entered", () => {
  it("draws down one pool across the whole household", () => {
    const policy = mkPolicy({
      deductible: { amountCents: 0, frequency: "policy", scope: "individual" },
      coinsurance: { inNetworkMemberPct: 0 },
      policyMaximum: { scope: "shared", amountCents: usd(1000) },
    });
    const household = runHousehold([
      { claimant: mkClaimant("t1"), policy, claims: [mkClaim({ claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(700), date: "2026-01-01" })] },
      { claimant: mkClaimant("t2"), policy, claims: [mkClaim({ claimantId: "t2", serviceCategory: "hospital-admission", billedChargeCents: usd(500), date: "2026-01-02" })] },
    ]);
    expect(household.perClaimant["t1"][0].insurerPaymentCents).toBe(usd(700));
    expect(household.perClaimant["t2"][0].insurerPaymentCents).toBe(usd(300)); // only 300 left of the shared 1000
    expect(household.perClaimant["t2"][0].memberLiability.abovePolicyMaximumCents).toBe(usd(200));
    expect(household.sharedProvisionsApplied).toContain("policyMaximum");
  });
});

describe("Never label a plan-agnostic result as an absolute maximum unless the policy explicitly caps everything", () => {
  it("an excluded/non-covered scenario still raises the uncapped-exposure warning", () => {
    const policy = mkPolicy({ outOfPocketMaximum: undefined });
    const claim = mkClaim({
      claimantId: "t1",
      serviceCategory: "physical-therapy",
      billedChargeCents: usd(800),
      coverageEligibility: "excluded",
    });
    const { result } = runSingleClaim(policy, mkClaimant("t1"), claim, initRunningState());
    expect(result.uncappedExposureWarning).toBe(true);
  });
});
