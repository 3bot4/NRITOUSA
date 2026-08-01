/**
 * Comprehensive-plan cost-sharing sequencer. Pure function — takes a single
 * claim plus the deductible/coinsurance-cap amounts currently available (as
 * resolved by the caller, which owns pool scope/frequency logic — see
 * engine.ts) and returns how much of each layer applied. Never assumes an
 * order: if policy.costSharingOrder is absent, this refuses to guess and
 * returns a "missing input" result instead of inventing a $0 or 100% split.
 *
 * Note on "serviceDeductible": the spec's example sequences include a
 * service-specific deductible layer distinct from the general deductible
 * (e.g. "service deductible -> general deductible -> coinsurance"). The only
 * per-service deductible captured in the Detailed Policy Mode input list is
 * the ER-specific one (policy.erRule.deductibleCents), so that is what the
 * "serviceDeductible" step consumes for ER claims; for every other service
 * category the step is a documented no-op rather than an invented amount.
 */

import { clampCents, minWithUnlimited, pctOfCents } from "./money";
import type { Claim, LedgerLine, PolicyTerms } from "./types";

export interface ComprehensiveAvailable {
  /** Remaining general deductible the caller has resolved for this claim, if policy.deductible is set. */
  generalDeductibleCents?: number;
  /** Remaining ER-specific deductible, if policy.erRule.deductibleCents is set. */
  erDeductibleCents?: number;
  /** Remaining coinsurance cap, if policy.coinsurance.capCents is set. */
  coinsuranceCapCents?: number;
}

export interface ComprehensiveResult {
  ledger: LedgerLine[];
  copayCents: number;
  deductibleCents: number;
  coinsuranceCents: number;
  insurerPaymentBeforeLimits: number;
  nonCoveredCents: number;
  balanceBillingCents: number;
  eligibleBaseCents: number;
  consumed: {
    generalDeductibleCents: number;
    erDeductibleCents: number;
    coinsuranceCapCents: number;
  };
  missingInputs: string[];
  usedSimplifiedAllowedCharge: boolean;
  ok: boolean;
}

function emptyConsumed() {
  return { generalDeductibleCents: 0, erDeductibleCents: 0, coinsuranceCapCents: 0 };
}

export function runComprehensiveClaim(
  policy: PolicyTerms,
  claim: Claim,
  available: ComprehensiveAvailable
): ComprehensiveResult {
  const ledger: LedgerLine[] = [];
  const missingInputs: string[] = [];
  const billed = clampCents(claim.billedChargeCents);

  ledger.push({ step: "billed", label: "Billed charge", amountCents: billed });

  // Step 1-2: exclusion / non-covered handling.
  if (claim.coverageEligibility === "excluded") {
    const base =
      claim.allowedChargeCents !== undefined
        ? Math.min(clampCents(claim.allowedChargeCents), billed)
        : billed;
    ledger.push({ step: "exclusion", label: "Excluded per entered policy terms — non-covered amount", amountCents: base });
    return {
      ledger,
      copayCents: 0,
      deductibleCents: 0,
      coinsuranceCents: 0,
      insurerPaymentBeforeLimits: 0,
      nonCoveredCents: base,
      balanceBillingCents: 0,
      eligibleBaseCents: 0,
      consumed: emptyConsumed(),
      missingInputs,
      usedSimplifiedAllowedCharge: false,
      ok: true,
    };
  }

  if (claim.coverageEligibility === "unknown") {
    missingInputs.push("coverageEligibility");
  }
  if (claim.networkStatus === "unknown") {
    missingInputs.push("networkStatus");
  }

  // Step 3: allowed charge.
  let usedSimplifiedAllowedCharge = false;
  let allowedOrBilled: number;
  if (claim.allowedChargeCents !== undefined) {
    allowedOrBilled = Math.min(clampCents(claim.allowedChargeCents), billed);
  } else {
    allowedOrBilled = billed;
    usedSimplifiedAllowedCharge = true;
    missingInputs.push("allowedCharge");
  }
  ledger.push({
    step: "allowed",
    label: usedSimplifiedAllowedCharge
      ? "Allowed charge unknown — using billed charge as a temporary base"
      : "Allowed (negotiated) charge",
    amountCents: allowedOrBilled,
  });

  // Step 4: balance billing.
  let balanceBillingCents = 0;
  if (!usedSimplifiedAllowedCharge) {
    if (claim.networkStatus === "out-of-network") {
      balanceBillingCents = Math.max(0, billed - allowedOrBilled);
    } else if (claim.networkStatus === "in-network") {
      balanceBillingCents = 0; // in-network providers generally cannot balance-bill above the allowed amount
    } else {
      // network unknown: don't assert a number either way, but don't hide the gap.
      balanceBillingCents = 0;
    }
  }
  if (balanceBillingCents > 0) {
    ledger.push({ step: "balanceBilling", label: "Potential balance billing (billed − allowed, out-of-network)", amountCents: balanceBillingCents });
  }

  const eligibleBaseCents = allowedOrBilled;

  if (!policy.costSharingOrder || policy.costSharingOrder.length === 0) {
    if (!policy.costSharingOrder) {
      missingInputs.push("costSharingOrder");
      ledger.push({
        step: "blocked",
        label: "Cost-sharing order not entered — cannot calculate deductible/copay/coinsurance split for this claim",
        amountCents: 0,
      });
      return {
        ledger,
        copayCents: 0,
        deductibleCents: 0,
        coinsuranceCents: 0,
        insurerPaymentBeforeLimits: 0,
        nonCoveredCents: 0,
        balanceBillingCents,
        eligibleBaseCents,
        consumed: emptyConsumed(),
        missingInputs,
        usedSimplifiedAllowedCharge,
        ok: false,
      };
    }
    // Explicit empty order = "first-dollar coverage": insurer pays the full eligible base, no cost-sharing steps.
    ledger.push({ step: "firstDollar", label: "First-dollar coverage — no copay/deductible/coinsurance steps entered", amountCents: eligibleBaseCents });
    return {
      ledger,
      copayCents: 0,
      deductibleCents: 0,
      coinsuranceCents: 0,
      insurerPaymentBeforeLimits: eligibleBaseCents,
      nonCoveredCents: 0,
      balanceBillingCents,
      eligibleBaseCents,
      consumed: emptyConsumed(),
      missingInputs,
      usedSimplifiedAllowedCharge,
      ok: true,
    };
  }

  let remaining = eligibleBaseCents;
  let copayCents = 0;
  let generalDeductibleAppliedCents = 0;
  let erDeductibleAppliedCents = 0;
  let coinsuranceCents = 0;
  let coinsuranceCapConsumed = 0;

  for (const step of policy.costSharingOrder) {
    if (remaining <= 0) break;

    if (step === "copay") {
      const isErOverride = claim.serviceCategory === "er" && policy.erRule?.copayCents !== undefined;
      if (!policy.copay && !isErOverride) continue;
      if (!isErOverride) {
        const servicesFilter = policy.copay!.services;
        const applies = !servicesFilter || servicesFilter.length === 0 || servicesFilter.includes(claim.serviceCategory);
        if (!applies) continue;
      }
      const copayAmount = isErOverride
        ? policy.erRule!.waivedIfAdmitted && claim.erAdmitted
          ? 0
          : policy.erRule!.copayCents!
        : policy.copay!.amountCents;
      const applied = Math.min(remaining, clampCents(copayAmount));
      copayCents += applied;
      remaining -= applied;
      if (applied > 0) ledger.push({ step: "copay", label: "Copay", amountCents: applied });
    }

    if (step === "serviceDeductible") {
      if (claim.serviceCategory !== "er" || policy.erRule?.deductibleCents === undefined) continue;
      const waived = policy.erRule.waivedIfAdmitted && claim.erAdmitted;
      const availableEr = waived ? 0 : available.erDeductibleCents ?? clampCents(policy.erRule.deductibleCents);
      const applied = Math.min(remaining, availableEr);
      erDeductibleAppliedCents += applied;
      remaining -= applied;
      if (applied > 0) ledger.push({ step: "serviceDeductible", label: "ER-specific deductible", amountCents: applied });
      else if (waived) ledger.push({ step: "serviceDeductible", label: "ER deductible waived (admitted)", amountCents: 0 });
    }

    if (step === "generalDeductible") {
      if (!policy.deductible) {
        missingInputs.push("deductible");
        continue;
      }
      const availableGeneral = available.generalDeductibleCents ?? clampCents(policy.deductible.amountCents);
      const applied = Math.min(remaining, availableGeneral);
      generalDeductibleAppliedCents += applied;
      remaining -= applied;
      if (applied > 0) ledger.push({ step: "generalDeductible", label: "General deductible", amountCents: applied });
    }

    if (step === "coinsurance") {
      if (!policy.coinsurance) {
        missingInputs.push("coinsurance");
        continue;
      }
      const memberPct =
        claim.networkStatus === "out-of-network"
          ? policy.coinsurance.outOfNetworkMemberPct ?? policy.coinsurance.inNetworkMemberPct
          : policy.coinsurance.inNetworkMemberPct;
      const coinsuranceEligible = minWithUnlimited(remaining, policy.coinsurance.thresholdCents);
      let memberShare = pctOfCents(coinsuranceEligible, memberPct);
      if (policy.coinsurance.capCents !== undefined) {
        const capAvailable = available.coinsuranceCapCents ?? clampCents(policy.coinsurance.capCents);
        memberShare = Math.min(memberShare, capAvailable);
      }
      coinsuranceCapConsumed += memberShare;
      coinsuranceCents += memberShare;
      // Everything in the coinsurance-eligible slice not charged to the member goes to the insurer;
      // anything above the threshold (not part of coinsuranceEligible) is 100% insurer.
      remaining -= memberShare;
      if (memberShare > 0) ledger.push({ step: "coinsurance", label: `Coinsurance (${memberPct}% member)`, amountCents: memberShare });
    }
  }

  const insurerPaymentBeforeLimits = Math.max(0, remaining);
  if (insurerPaymentBeforeLimits > 0) {
    ledger.push({ step: "insurerBeforeLimits", label: "Insurer payment before policy limits", amountCents: insurerPaymentBeforeLimits });
  }

  return {
    ledger,
    copayCents,
    deductibleCents: generalDeductibleAppliedCents + erDeductibleAppliedCents,
    coinsuranceCents,
    insurerPaymentBeforeLimits,
    nonCoveredCents: 0,
    balanceBillingCents,
    eligibleBaseCents,
    consumed: {
      generalDeductibleCents: generalDeductibleAppliedCents,
      erDeductibleCents: erDeductibleAppliedCents,
      coinsuranceCapCents: coinsuranceCapConsumed,
    },
    missingInputs,
    usedSimplifiedAllowedCharge,
    ok: true,
  };
}
