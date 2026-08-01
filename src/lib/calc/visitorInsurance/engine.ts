/**
 * The single reusable visitor-insurance calculation engine. Every calculator
 * page (master cost calculator, plan comparison, deductible/coinsurance,
 * hospital/ER, network cost, policy maximum) calls into runClaimsForClaimant
 * / runHousehold from this file instead of reimplementing any formula. See
 * docs/visitor-insurance/architecture.md §2-4.
 */

import { clampCents, minWithUnlimited } from "./money";
import { runComprehensiveClaim } from "./comprehensive";
import { runFixedBenefitClaim } from "./fixedBenefit";
import type {
  Claim,
  ClaimResult,
  Claimant,
  ConfidenceLabel,
  LedgerLine,
  MemberLiabilityBreakdown,
  PolicyTerms,
  ServiceCategory,
} from "./types";

/** Per-claimant running state, threaded (immutably) across chronological claims. */
export interface RunningState {
  policyIndividualDeductibleRemainingCents?: number;
  incidentDeductibleRemainingCents?: Record<string, number>;
  serviceDeductibleRemainingCents?: Partial<Record<ServiceCategory, number>>;
  embeddedIndividualDeductibleRemainingCents?: number;
  erDeductibleRemainingCents?: number;
  coinsuranceCapRemainingCents?: number;
  policyMaximumRemainingCents?: number;
  perIncidentMaximumRemainingCents?: Record<string, number>;
  sublimitRemainingCents?: Partial<Record<ServiceCategory, number>>;
  evacuationRemainingCents?: number;
  repatriationRemainingCents?: number;
  outOfPocketRemainingCents?: number;
}

/** Household-level pools, only populated for provisions the user explicitly marked shared. */
export interface SharedPools {
  familyDeductibleRemainingCents?: number;
  policyMaximumRemainingCents?: number;
  outOfPocketRemainingCents?: number;
}

export function initRunningState(): RunningState {
  return {
    incidentDeductibleRemainingCents: {},
    serviceDeductibleRemainingCents: {},
    perIncidentMaximumRemainingCents: {},
    sublimitRemainingCents: {},
  };
}

export function initSharedPools(): SharedPools {
  return {};
}

function emptyLiability(): MemberLiabilityBreakdown {
  return {
    deductibleCents: 0,
    copayCents: 0,
    coinsuranceCents: 0,
    balanceBillingCents: 0,
    nonCoveredCents: 0,
    aboveSublimitCents: 0,
    aboveScheduledBenefitCents: 0,
    abovePolicyMaximumCents: 0,
    totalCents: 0,
  };
}

function totalLiability(m: Omit<MemberLiabilityBreakdown, "totalCents">): number {
  return (
    m.deductibleCents +
    m.copayCents +
    m.coinsuranceCents +
    m.balanceBillingCents +
    m.nonCoveredCents +
    m.aboveSublimitCents +
    m.aboveScheduledBenefitCents +
    m.abovePolicyMaximumCents
  );
}

function confidenceFromMissing(missing: string[], baseline: ConfidenceLabel = "higher"): ConfidenceLabel {
  if (missing.length === 0) return baseline;
  if (missing.length <= 2) return "moderate";
  return "limited";
}

/**
 * Resolves how much general deductible is available for this claim given the
 * policy's frequency/scope, using per-claimant state and (if the deductible
 * is shared) the household's shared pool. Returns the pool(s) to write back
 * to after the claim is processed.
 */
function resolveGeneralDeductible(
  policy: PolicyTerms,
  claim: Claim,
  state: RunningState,
  shared: SharedPools | undefined
): { availableCents: number; embeddedFamilyAvailableCents?: number } {
  const d = policy.deductible;
  if (!d) return { availableCents: 0 };

  if (d.frequency === "service") {
    const remaining = state.serviceDeductibleRemainingCents?.[claim.serviceCategory] ?? clampCents(d.amountCents);
    return { availableCents: remaining };
  }
  if (d.frequency === "incident") {
    const key = claim.incidentId ?? `${claim.claimantId}-default`;
    const remaining = state.incidentDeductibleRemainingCents?.[key] ?? clampCents(d.amountCents);
    return { availableCents: remaining };
  }

  // frequency === "policy"
  if (d.scope === "individual") {
    const remaining = state.policyIndividualDeductibleRemainingCents ?? clampCents(d.amountCents);
    return { availableCents: remaining };
  }
  if (d.scope === "shared-family") {
    const remaining = shared?.familyDeductibleRemainingCents ?? clampCents(d.familyAmountCents ?? d.amountCents);
    return { availableCents: remaining };
  }
  // embedded-individual
  const individualRemaining = state.embeddedIndividualDeductibleRemainingCents ?? clampCents(d.amountCents);
  const familyRemaining = shared?.familyDeductibleRemainingCents ?? clampCents(d.familyAmountCents ?? d.amountCents);
  return { availableCents: Math.min(individualRemaining, familyRemaining), embeddedFamilyAvailableCents: familyRemaining };
}

export interface SingleClaimOutcome {
  result: ClaimResult;
  nextState: RunningState;
  nextShared?: SharedPools;
}

/**
 * Process one claim against the current running state (and, for a household
 * member, the shared pools). Pure — returns new state objects rather than
 * mutating. Chronological ordering across multiple claims/claimants is the
 * caller's responsibility (runClaimsForClaimant / runHousehold).
 */
export function runSingleClaim(
  policy: PolicyTerms,
  claimant: Claimant,
  claim: Claim,
  state: RunningState,
  shared?: SharedPools
): SingleClaimOutcome {
  const ledger: LedgerLine[] = [];
  const missingInputs: string[] = [];
  let liability = emptyLiability();
  let insurerPaymentBeforeLimits = 0;
  let usedSimplifiedAllowedCharge = false;
  let eligibleBaseCents = 0;
  let engineOk = true;

  const nextState: RunningState = { ...state };
  const nextShared: SharedPools = { ...shared };

  const isFixedBenefitClaim =
    policy.planType === "fixed-benefit" ||
    (policy.planType === "hybrid" && policy.scheduledBenefits?.[claim.serviceCategory] !== undefined);

  if (isFixedBenefitClaim) {
    const fb = runFixedBenefitClaim(policy, claim);
    ledger.push(...fb.ledger);
    missingInputs.push(...fb.missingInputs);
    insurerPaymentBeforeLimits = fb.insurerPaymentBeforeLimits;
    liability.aboveScheduledBenefitCents = fb.aboveScheduledBenefitCents;
    liability.nonCoveredCents = fb.nonCoveredCents;
    engineOk = fb.ok;
  } else {
    const { availableCents: generalAvailable, embeddedFamilyAvailableCents } = resolveGeneralDeductible(
      policy,
      claim,
      state,
      shared
    );
    const comp = runComprehensiveClaim(policy, claim, {
      generalDeductibleCents: policy.deductible ? generalAvailable : undefined,
      erDeductibleCents: policy.erRule?.deductibleCents !== undefined ? state.erDeductibleRemainingCents ?? clampCents(policy.erRule.deductibleCents) : undefined,
      coinsuranceCapCents: policy.coinsurance?.capCents !== undefined ? state.coinsuranceCapRemainingCents ?? clampCents(policy.coinsurance.capCents) : undefined,
    });
    ledger.push(...comp.ledger);
    missingInputs.push(...comp.missingInputs);
    liability.copayCents = comp.copayCents;
    liability.deductibleCents = comp.deductibleCents;
    liability.coinsuranceCents = comp.coinsuranceCents;
    liability.balanceBillingCents = comp.balanceBillingCents;
    liability.nonCoveredCents = comp.nonCoveredCents;
    insurerPaymentBeforeLimits = comp.insurerPaymentBeforeLimits;
    usedSimplifiedAllowedCharge = comp.usedSimplifiedAllowedCharge;
    eligibleBaseCents = comp.eligibleBaseCents;
    engineOk = comp.ok;

    // Write back deductible pool(s) consumed.
    if (policy.deductible && comp.consumed.generalDeductibleCents > 0) {
      const d = policy.deductible;
      if (d.frequency === "service") {
        nextState.serviceDeductibleRemainingCents = {
          ...nextState.serviceDeductibleRemainingCents,
          [claim.serviceCategory]: generalAvailable - comp.consumed.generalDeductibleCents,
        };
      } else if (d.frequency === "incident") {
        const key = claim.incidentId ?? `${claim.claimantId}-default`;
        nextState.incidentDeductibleRemainingCents = {
          ...nextState.incidentDeductibleRemainingCents,
          [key]: generalAvailable - comp.consumed.generalDeductibleCents,
        };
      } else if (d.scope === "individual") {
        nextState.policyIndividualDeductibleRemainingCents = generalAvailable - comp.consumed.generalDeductibleCents;
      } else if (d.scope === "shared-family") {
        nextShared.familyDeductibleRemainingCents = generalAvailable - comp.consumed.generalDeductibleCents;
      } else {
        // embedded-individual: decrement both pools by the same applied amount.
        nextState.embeddedIndividualDeductibleRemainingCents =
          (state.embeddedIndividualDeductibleRemainingCents ?? clampCents(d.amountCents)) - comp.consumed.generalDeductibleCents;
        nextShared.familyDeductibleRemainingCents = (embeddedFamilyAvailableCents ?? 0) - comp.consumed.generalDeductibleCents;
      }
    }
    if (policy.erRule?.deductibleCents !== undefined) {
      const availableEr = state.erDeductibleRemainingCents ?? clampCents(policy.erRule.deductibleCents);
      nextState.erDeductibleRemainingCents = availableEr - comp.consumed.erDeductibleCents;
    }
    if (policy.coinsurance?.capCents !== undefined) {
      const availableCap = state.coinsuranceCapRemainingCents ?? clampCents(policy.coinsurance.capCents);
      nextState.coinsuranceCapRemainingCents = availableCap - comp.consumed.coinsuranceCapCents;
    }
  }

  // ---- Apply sublimit / evacuation-repatriation / per-incident / policy maximum, in that order ----
  let insurerAfterLimits = insurerPaymentBeforeLimits;

  if (policy.serviceSublimits?.[claim.serviceCategory] !== undefined) {
    const availableSublimit = state.sublimitRemainingCents?.[claim.serviceCategory] ?? clampCents(policy.serviceSublimits[claim.serviceCategory]);
    const capped = Math.min(insurerAfterLimits, availableSublimit);
    liability.aboveSublimitCents += insurerAfterLimits - capped;
    if (insurerAfterLimits - capped > 0) {
      ledger.push({ step: "sublimit", label: "Amount above service sublimit (member owes)", amountCents: insurerAfterLimits - capped });
    }
    insurerAfterLimits = capped;
    nextState.sublimitRemainingCents = { ...nextState.sublimitRemainingCents, [claim.serviceCategory]: availableSublimit - capped };
  }

  if (claim.serviceCategory === "evacuation" && policy.evacuationMaximumCents !== undefined) {
    const availableEvac = state.evacuationRemainingCents ?? clampCents(policy.evacuationMaximumCents);
    const capped = Math.min(insurerAfterLimits, availableEvac);
    liability.aboveSublimitCents += insurerAfterLimits - capped;
    if (insurerAfterLimits - capped > 0) {
      ledger.push({ step: "evacuationMax", label: "Amount above medical evacuation maximum (member owes)", amountCents: insurerAfterLimits - capped });
    }
    insurerAfterLimits = capped;
    nextState.evacuationRemainingCents = availableEvac - capped;
  }
  if (claim.serviceCategory === "repatriation" && policy.repatriationMaximumCents !== undefined) {
    const availableRepat = state.repatriationRemainingCents ?? clampCents(policy.repatriationMaximumCents);
    const capped = Math.min(insurerAfterLimits, availableRepat);
    liability.aboveSublimitCents += insurerAfterLimits - capped;
    if (insurerAfterLimits - capped > 0) {
      ledger.push({ step: "repatriationMax", label: "Amount above repatriation maximum (member owes)", amountCents: insurerAfterLimits - capped });
    }
    insurerAfterLimits = capped;
    nextState.repatriationRemainingCents = availableRepat - capped;
  }

  if (policy.perIncidentMaximumCents !== undefined) {
    const key = claim.incidentId ?? `${claim.claimantId}-default`;
    const availableIncident = state.perIncidentMaximumRemainingCents?.[key] ?? clampCents(policy.perIncidentMaximumCents);
    const capped = Math.min(insurerAfterLimits, availableIncident);
    liability.abovePolicyMaximumCents += insurerAfterLimits - capped;
    if (insurerAfterLimits - capped > 0) {
      ledger.push({ step: "perIncidentMax", label: "Amount above per-incident maximum (member owes)", amountCents: insurerAfterLimits - capped });
    }
    insurerAfterLimits = capped;
    nextState.perIncidentMaximumRemainingCents = { ...nextState.perIncidentMaximumRemainingCents, [key]: availableIncident - capped };
  }

  if (policy.policyMaximum) {
    const pm = policy.policyMaximum;
    if (pm.scope === "individual") {
      const availablePm = state.policyMaximumRemainingCents ?? clampCents(pm.amountCents);
      const capped = Math.min(insurerAfterLimits, availablePm);
      liability.abovePolicyMaximumCents += insurerAfterLimits - capped;
      if (insurerAfterLimits - capped > 0) {
        ledger.push({ step: "policyMax", label: "Amount above policy maximum (member owes)", amountCents: insurerAfterLimits - capped });
      }
      insurerAfterLimits = capped;
      nextState.policyMaximumRemainingCents = availablePm - capped;
    } else {
      const availablePm = shared?.policyMaximumRemainingCents ?? clampCents(pm.amountCents);
      const capped = Math.min(insurerAfterLimits, availablePm);
      liability.abovePolicyMaximumCents += insurerAfterLimits - capped;
      if (insurerAfterLimits - capped > 0) {
        ledger.push({ step: "policyMax", label: "Amount above shared policy maximum (member owes)", amountCents: insurerAfterLimits - capped });
      }
      insurerAfterLimits = capped;
      nextShared.policyMaximumRemainingCents = availablePm - capped;
    }
  } else {
    missingInputs.push("policyMaximum");
  }

  // ---- Out-of-pocket maximum: reclassify member cost-sharing into insurer payment once the OOP running total is met ----
  let releasedFromOop = 0;
  if (policy.outOfPocketMaximum) {
    const oop = policy.outOfPocketMaximum;
    const eligibleThisClaim =
      (oop.countsToward.deductible ? liability.deductibleCents : 0) +
      (oop.countsToward.copay ? liability.copayCents : 0) +
      (oop.countsToward.coinsurance ? liability.coinsuranceCents : 0) +
      (oop.countsToward.outOfNetwork ? liability.balanceBillingCents : 0) +
      (oop.countsToward.nonCovered ? liability.nonCoveredCents : 0);

    const availableOop =
      oop.scope === "individual"
        ? state.outOfPocketRemainingCents ?? clampCents(oop.amountCents)
        : shared?.outOfPocketRemainingCents ?? clampCents(oop.amountCents);

    const appliedTowardOop = Math.min(eligibleThisClaim, availableOop);
    releasedFromOop = eligibleThisClaim - appliedTowardOop;

    if (releasedFromOop > 0) {
      let toRelease = releasedFromOop;
      const release = (amount: number) => {
        const take = Math.min(toRelease, amount);
        toRelease -= take;
        return amount - take;
      };
      if (oop.countsToward.coinsurance) liability.coinsuranceCents = release(liability.coinsuranceCents);
      if (oop.countsToward.deductible) liability.deductibleCents = release(liability.deductibleCents);
      if (oop.countsToward.copay) liability.copayCents = release(liability.copayCents);
      if (oop.countsToward.outOfNetwork) liability.balanceBillingCents = release(liability.balanceBillingCents);
      if (oop.countsToward.nonCovered) liability.nonCoveredCents = release(liability.nonCoveredCents);
      ledger.push({ step: "oopMaxRelease", label: "Out-of-pocket maximum reached — insurer covers the remainder", amountCents: releasedFromOop });
    }

    if (oop.scope === "individual") {
      nextState.outOfPocketRemainingCents = availableOop - appliedTowardOop;
    } else {
      nextShared.outOfPocketRemainingCents = availableOop - appliedTowardOop;
    }
  } else {
    missingInputs.push("outOfPocketMaximum");
  }

  const insurerPaymentCents = insurerAfterLimits + releasedFromOop;
  liability.totalCents = totalLiability(liability);

  if (insurerPaymentCents > 0) {
    ledger.push({ step: "insurerFinal", label: "Final insurer payment", amountCents: insurerPaymentCents });
  }
  if (liability.totalCents > 0) {
    ledger.push({ step: "memberFinal", label: "Total member liability for this claim", amountCents: liability.totalCents });
  }

  // Uncapped-exposure warning: true whenever a hard ceiling is unknown/absent and money could still be owed above it,
  // or when the calculation base itself is uncertain.
  const hasUnknownCeiling =
    !policy.policyMaximum ||
    !policy.outOfPocketMaximum ||
    (policy.serviceSublimits === undefined && policy.planType !== "comprehensive") ||
    usedSimplifiedAllowedCharge ||
    claim.networkStatus === "unknown" ||
    claim.coverageEligibility === "unknown";
  const uncappedExposureWarning = !engineOk || hasUnknownCeiling;

  const confidence = confidenceFromMissing(missingInputs, engineOk ? "higher" : "limited");

  const result: ClaimResult = {
    claimantId: claimant.id,
    claim,
    ledger,
    insurerPaymentCents,
    memberLiability: liability,
    remaining: {
      deductibleCents: policy.deductible
        ? policy.deductible.scope === "shared-family"
          ? nextShared.familyDeductibleRemainingCents
          : policy.deductible.scope === "individual"
            ? nextState.policyIndividualDeductibleRemainingCents
            : nextState.embeddedIndividualDeductibleRemainingCents
        : undefined,
      policyMaximumCents: policy.policyMaximum
        ? policy.policyMaximum.scope === "individual"
          ? nextState.policyMaximumRemainingCents
          : nextShared.policyMaximumRemainingCents
        : undefined,
      sublimitCents: policy.serviceSublimits?.[claim.serviceCategory] !== undefined ? nextState.sublimitRemainingCents?.[claim.serviceCategory] : undefined,
      outOfPocketMaximumCents: policy.outOfPocketMaximum
        ? policy.outOfPocketMaximum.scope === "individual"
          ? nextState.outOfPocketRemainingCents
          : nextShared.outOfPocketRemainingCents
        : undefined,
      perIncidentMaximumCents:
        policy.perIncidentMaximumCents !== undefined
          ? nextState.perIncidentMaximumRemainingCents?.[claim.incidentId ?? `${claim.claimantId}-default`]
          : undefined,
    },
    missingInputs: Array.from(new Set(missingInputs)),
    confidence,
    uncappedExposureWarning,
  };

  return { result, nextState, nextShared: shared ? nextShared : undefined };
}

/** Sort claims chronologically; claims without a date keep their relative input order (stable sort). */
export function sortClaimsChronologically<T extends { date?: string }>(claims: T[]): T[] {
  return claims
    .map((c, i) => ({ c, i }))
    .sort((a, b) => {
      if (a.c.date && b.c.date) return a.c.date.localeCompare(b.c.date);
      if (a.c.date && !b.c.date) return -1;
      if (!a.c.date && b.c.date) return 1;
      return a.i - b.i;
    })
    .map((x) => x.c);
}

/** Single-claimant convenience: no shared pools, folds running state across chronological claims. */
export function runClaimsForClaimant(policy: PolicyTerms, claimant: Claimant, claims: Claim[]): ClaimResult[] {
  const ordered = sortClaimsChronologically(claims);
  let state = initRunningState();
  const results: ClaimResult[] = [];
  for (const claim of ordered) {
    const outcome = runSingleClaim(policy, claimant, claim, state);
    results.push(outcome.result);
    state = outcome.nextState;
  }
  return results;
}

export { minWithUnlimited };
