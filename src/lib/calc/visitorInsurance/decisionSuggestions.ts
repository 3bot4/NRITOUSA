/**
 * "Suggestions to reduce financial risk" — a deterministic, rule-based
 * decision engine, not AI-generated. Every suggestion is a CONCEPT
 * ("a lower deductible", "a true out-of-pocket maximum"), never a named
 * product or insurer. Where a suggestion claims a dollar difference, that
 * number comes from actually re-running the same engine (runSingleClaim)
 * against a hypothetical policy — never a guess — so "why" is always a real
 * calculation, not a canned line.
 */
import { runSingleClaim, initRunningState } from "./engine";
import { clampCents } from "./money";
import type { Claim, Claimant, ClaimResult, PolicyTerms } from "./types";

export interface DecisionSuggestion {
  id: string;
  title: string;
  why: string;
  deltaCents?: number;
}

function whatIf(policy: PolicyTerms, claimant: Claimant, claim: Claim, patch: Partial<PolicyTerms>): ClaimResult {
  return runSingleClaim({ ...policy, ...patch }, claimant, claim, initRunningState()).result;
}

export function computeDecisionSuggestions(policy: PolicyTerms, claimant: Claimant, claim: Claim, result: ClaimResult): DecisionSuggestion[] {
  const suggestions: DecisionSuggestion[] = [];

  // 1. No out-of-pocket maximum entered.
  if (!policy.outOfPocketMaximum) {
    suggestions.push({
      id: "oop-max",
      title: "Ask whether this plan has a true out-of-pocket maximum",
      why: "Without one, there is no ceiling on your cost-sharing — a lower deductible or coinsurance percentage helps, but it won't cap your total exposure the way an out-of-pocket maximum would.",
    });
  }

  // 2. Deductible is meaningful and a lower deductible would help — show the actual delta.
  if (policy.deductible && result.memberLiability.deductibleCents > 0 && policy.deductible.amountCents > clampCents(10000)) {
    const lower = whatIf(policy, claimant, claim, { deductible: { ...policy.deductible, amountCents: Math.round(policy.deductible.amountCents / 2) } });
    const delta = result.memberLiability.totalCents - lower.memberLiability.totalCents;
    if (delta > 0) {
      suggestions.push({
        id: "lower-deductible",
        title: "Consider comparing a lower deductible",
        why: `Cutting this deductible in half would have reduced what you owe on this claim by about ${formatDeltaHint(delta)} — though a lower deductible usually comes with a higher premium, so weigh that against how many claims you actually expect.`,
        deltaCents: delta,
      });
    }
  }

  // 3. Coinsurance member share is high (>= 30%).
  if (policy.coinsurance && policy.coinsurance.inNetworkMemberPct >= 30 && result.memberLiability.coinsuranceCents > 0) {
    const better = whatIf(policy, claimant, claim, { coinsurance: { ...policy.coinsurance, inNetworkMemberPct: 20 } });
    const delta = result.memberLiability.totalCents - better.memberLiability.totalCents;
    if (delta > 0) {
      suggestions.push({
        id: "lower-coinsurance",
        title: "Consider comparing a lower coinsurance share",
        why: `An 80/20 split instead of your entered ${100 - policy.coinsurance.inNetworkMemberPct}/${policy.coinsurance.inNetworkMemberPct} would have reduced this claim's coinsurance by about ${formatDeltaHint(delta)}.`,
        deltaCents: delta,
      });
    }
  }

  // 4. Policy maximum was exceeded on this claim.
  if (result.memberLiability.abovePolicyMaximumCents > 0 && policy.policyMaximum) {
    const higher = whatIf(policy, claimant, claim, { policyMaximum: { ...policy.policyMaximum, amountCents: policy.policyMaximum.amountCents * 2 } });
    const delta = result.memberLiability.totalCents - higher.memberLiability.totalCents;
    suggestions.push({
      id: "higher-policy-max",
      title: "Consider a higher policy maximum",
      why: `This claim went above your entered policy maximum. Doubling it would have reduced your liability by about ${formatDeltaHint(Math.max(delta, 0))} on this specific claim — for a genuinely severe event, the policy maximum can matter more than the deductible or coinsurance.`,
      deltaCents: Math.max(delta, 0),
    });
  }

  // 5. Network status unknown or out-of-network with balance billing.
  if (claim.networkStatus === "out-of-network" || claim.networkStatus === "unknown") {
    suggestions.push({
      id: "check-network",
      title: "Confirm the provider's network status before you go",
      why:
        claim.networkStatus === "unknown"
          ? "Network status wasn't entered for this claim — in-network care generally avoids balance billing and often carries lower coinsurance."
          : "This claim was modeled as out-of-network, which can add balance billing on top of a higher coinsurance share. Ask if an in-network option is available nearby.",
    });
  }

  // 6. Fixed-benefit plan left a meaningful gap above the scheduled benefit.
  if (policy.planType === "fixed-benefit" && result.memberLiability.aboveScheduledBenefitCents > 0) {
    suggestions.push({
      id: "compare-plan-type",
      title: "Compare this against a comprehensive plan",
      why: "A fixed-benefit plan pays a flat scheduled amount regardless of the bill size, which is what created this gap. A comprehensive (deductible + coinsurance) plan calculates its payment differently and may leave a different gap on the same bill — worth comparing side by side.",
    });
  }

  return suggestions;
}

function formatDeltaHint(cents: number): string {
  const dollars = Math.round(cents / 100);
  return dollars.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
