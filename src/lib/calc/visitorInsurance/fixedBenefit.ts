/**
 * Fixed-benefit (scheduled-benefit) plan math. Deliberately does NOT reuse
 * comprehensive-plan math (no deductible/copay/coinsurance split) — per the
 * spec, the member simply owes the difference between the bill and the
 * plan's scheduled payment for that service, subject to further policy
 * limits applied uniformly downstream (sublimit / per-incident / policy max).
 */

import { clampCents } from "./money";
import type { Claim, LedgerLine, PolicyTerms } from "./types";

export interface FixedBenefitResult {
  ledger: LedgerLine[];
  insurerPaymentBeforeLimits: number;
  aboveScheduledBenefitCents: number;
  nonCoveredCents: number;
  missingInputs: string[];
  ok: boolean;
}

export function runFixedBenefitClaim(policy: PolicyTerms, claim: Claim): FixedBenefitResult {
  const ledger: LedgerLine[] = [];
  const missingInputs: string[] = [];
  const billed = clampCents(claim.billedChargeCents);
  ledger.push({ step: "billed", label: "Billed charge", amountCents: billed });

  if (claim.coverageEligibility === "excluded") {
    ledger.push({ step: "exclusion", label: "Excluded per entered policy terms — non-covered amount", amountCents: billed });
    return {
      ledger,
      insurerPaymentBeforeLimits: 0,
      aboveScheduledBenefitCents: 0,
      nonCoveredCents: billed,
      missingInputs,
      ok: true,
    };
  }
  if (claim.coverageEligibility === "unknown") missingInputs.push("coverageEligibility");

  const scheduledBenefit = policy.scheduledBenefits?.[claim.serviceCategory];
  if (scheduledBenefit === undefined) {
    missingInputs.push("scheduledBenefit");
    ledger.push({
      step: "blocked",
      label: "No scheduled benefit entered for this service category — cannot calculate the plan payment",
      amountCents: 0,
    });
    return {
      ledger,
      insurerPaymentBeforeLimits: 0,
      aboveScheduledBenefitCents: 0,
      nonCoveredCents: 0,
      missingInputs,
      ok: false,
    };
  }

  const benefitCents = clampCents(scheduledBenefit);
  ledger.push({ step: "scheduledBenefit", label: "Scheduled benefit for this service", amountCents: benefitCents });

  const insurerPaymentBeforeLimits = Math.min(billed, benefitCents);
  const aboveScheduledBenefitCents = Math.max(0, billed - benefitCents);
  if (aboveScheduledBenefitCents > 0) {
    ledger.push({ step: "aboveScheduledBenefit", label: "Amount above the scheduled benefit (member owes)", amountCents: aboveScheduledBenefitCents });
  }

  return {
    ledger,
    insurerPaymentBeforeLimits,
    aboveScheduledBenefitCents,
    nonCoveredCents: 0,
    missingInputs,
    ok: true,
  };
}
