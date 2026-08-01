/**
 * Household aggregation. Defaults to fully independent per-traveler
 * calculations (spec §E) — shared deductible / out-of-pocket maximum /
 * policy maximum pools activate ONLY when a member's policy explicitly sets
 * that provision's scope to "shared-family" / "shared" / "embedded-individual".
 * Never invents a family provision the user did not enter.
 */

import {
  initRunningState,
  initSharedPools,
  runSingleClaim,
  sortClaimsChronologically,
  type RunningState,
  type SharedPools,
} from "./engine";
import type { Claim, HouseholdMemberInput, HouseholdResult } from "./types";

export function runHousehold(members: HouseholdMemberInput[]): HouseholdResult {
  const sharedDeductible = members.some(
    (m) => m.policy.deductible?.scope === "shared-family" || m.policy.deductible?.scope === "embedded-individual"
  );
  const sharedPolicyMaximum = members.some((m) => m.policy.policyMaximum?.scope === "shared");
  const sharedOutOfPocketMaximum = members.some((m) => m.policy.outOfPocketMaximum?.scope === "shared-family");

  const policyByClaimant = new Map(members.map((m) => [m.claimant.id, m.policy]));
  const claimantById = new Map(members.map((m) => [m.claimant.id, m.claimant]));

  const flattened: Claim[] = members.flatMap((m) => m.claims);
  const ordered = sortClaimsChronologically(flattened);

  const individualStates = new Map<string, RunningState>(members.map((m) => [m.claimant.id, initRunningState()]));
  let sharedPools: SharedPools = initSharedPools();

  const perClaimant: HouseholdResult["perClaimant"] = {};
  const claimantOrder = members.map((m) => m.claimant.id);
  for (const id of claimantOrder) perClaimant[id] = [];

  for (const claim of ordered) {
    const policy = policyByClaimant.get(claim.claimantId);
    const claimant = claimantById.get(claim.claimantId);
    if (!policy || !claimant) continue;
    const state = individualStates.get(claim.claimantId) ?? initRunningState();
    const outcome = runSingleClaim(policy, claimant, claim, state, sharedPools);
    individualStates.set(claim.claimantId, outcome.nextState);
    if (outcome.nextShared) sharedPools = outcome.nextShared;
    perClaimant[claim.claimantId].push(outcome.result);
  }

  let aggregatePremiumCents = 0;
  const perPolicyPremiumsSeen = new Set<number>();
  for (const m of members) {
    if (m.policy.premiumScope === "per-policy") {
      perPolicyPremiumsSeen.add(m.policy.premiumCents);
    } else {
      aggregatePremiumCents += m.policy.premiumCents;
    }
  }
  for (const p of Array.from(perPolicyPremiumsSeen)) aggregatePremiumCents += p;

  let aggregateMedicalLiabilityCents = 0;
  let aggregateInsurerPaymentCents = 0;
  let uncappedExposureWarning = false;
  for (const id of claimantOrder) {
    for (const r of perClaimant[id]) {
      aggregateMedicalLiabilityCents += r.memberLiability.totalCents;
      aggregateInsurerPaymentCents += r.insurerPaymentCents;
      if (r.uncappedExposureWarning) uncappedExposureWarning = true;
    }
  }

  const sharedProvisionsApplied: HouseholdResult["sharedProvisionsApplied"] = [];
  if (sharedDeductible) sharedProvisionsApplied.push("deductible");
  if (sharedOutOfPocketMaximum) sharedProvisionsApplied.push("outOfPocketMaximum");
  if (sharedPolicyMaximum) sharedProvisionsApplied.push("policyMaximum");

  return {
    perClaimant,
    claimantOrder,
    aggregatePremiumCents,
    aggregateMedicalLiabilityCents,
    aggregateInsurerPaymentCents,
    aggregateTotalCostCents: aggregatePremiumCents + aggregateMedicalLiabilityCents,
    sharedProvisionsApplied,
    uncappedExposureWarning,
  };
}
