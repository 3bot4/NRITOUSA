import { describe, expect, it } from "vitest";
import { computeDecisionSuggestions } from "./decisionSuggestions";
import { runSingleClaim, initRunningState } from "./engine";
import { dollarsToCents } from "./money";
import type { Claim, Claimant, PolicyTerms } from "./types";

const claimant: Claimant = { id: "t1" };
const usd = dollarsToCents;

function policy(over: Partial<PolicyTerms> = {}): PolicyTerms {
  return {
    planType: "comprehensive",
    premiumCents: usd(1200),
    premiumScope: "per-traveler",
    costSharingOrder: ["generalDeductible", "coinsurance"],
    deductible: { amountCents: usd(1000), frequency: "policy", scope: "individual" },
    coinsurance: { inNetworkMemberPct: 30 },
    policyMaximum: { scope: "individual", amountCents: usd(100_000) },
    ...over,
  };
}

describe("computeDecisionSuggestions", () => {
  it("suggests a true out-of-pocket maximum when none was entered", () => {
    const p = policy();
    const claim: Claim = { claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(5000), networkStatus: "in-network", coverageEligibility: "covered" };
    const { result } = runSingleClaim(p, claimant, claim, initRunningState());
    const s = computeDecisionSuggestions(p, claimant, claim, result);
    expect(s.some((x) => x.id === "oop-max")).toBe(true);
  });

  it("suggests a lower deductible with a real re-computed delta, not a guess", () => {
    const p = policy({ deductible: { amountCents: usd(1000), frequency: "policy", scope: "individual" } });
    const claim: Claim = { claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(5000), networkStatus: "in-network", coverageEligibility: "covered" };
    const { result } = runSingleClaim(p, claimant, claim, initRunningState());
    const s = computeDecisionSuggestions(p, claimant, claim, result);
    const suggestion = s.find((x) => x.id === "lower-deductible");
    expect(suggestion).toBeDefined();
    expect(suggestion!.deltaCents).toBeGreaterThan(0);
    // Halving the $1000 deductible saves $500 in deductible, but $500 more then flows through
    // 30% coinsurance ($150 owed on it), so the net saving is $500 - $150 = $350 — a real
    // re-computed delta via the engine, not a naive "half the deductible" guess.
    expect(suggestion!.deltaCents).toBe(usd(350));
  });

  it("suggests checking network status when unknown", () => {
    const p = policy();
    const claim: Claim = { claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(5000), networkStatus: "unknown", coverageEligibility: "covered" };
    const { result } = runSingleClaim(p, claimant, claim, initRunningState());
    const s = computeDecisionSuggestions(p, claimant, claim, result);
    expect(s.some((x) => x.id === "check-network")).toBe(true);
  });

  it("suggests a higher policy maximum when the claim exceeded it", () => {
    const p = policy({ policyMaximum: { scope: "individual", amountCents: usd(1000) }, deductible: { amountCents: 0, frequency: "policy", scope: "individual" }, coinsurance: { inNetworkMemberPct: 0 } });
    const claim: Claim = { claimantId: "t1", serviceCategory: "hospital-admission", billedChargeCents: usd(50_000), networkStatus: "in-network", coverageEligibility: "covered" };
    const { result } = runSingleClaim(p, claimant, claim, initRunningState());
    const s = computeDecisionSuggestions(p, claimant, claim, result);
    expect(s.some((x) => x.id === "higher-policy-max")).toBe(true);
  });

  it("never mentions a named insurer or product", () => {
    const p = policy();
    const claim: Claim = { claimantId: "t1", serviceCategory: "er", billedChargeCents: usd(5000), networkStatus: "unknown", coverageEligibility: "covered" };
    const { result } = runSingleClaim(p, claimant, claim, initRunningState());
    const s = computeDecisionSuggestions(p, claimant, claim, result);
    const allText = s.map((x) => `${x.title} ${x.why}`).join(" ").toLowerCase();
    expect(allText).not.toMatch(/geoblue|img global|seven corners|atlas travel|insubuy|visitorscoverage/);
  });
});
