"use client";

/**
 * Embedded, preconfigured comparison engine for the
 * /visitor-insurance/fixed-benefit-vs-comprehensive guide. Both example
 * plans share the same policy maximum on purpose — the point of this widget
 * is showing that an identical headline maximum does not mean identical
 * real-world payment.
 */
import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/format";
import { runSingleClaim, initRunningState } from "@/lib/calc/visitorInsurance/engine";
import type { Claim, Claimant, ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import PolicyTermsForm, { type PolicyFormSection } from "./PolicyTermsForm";
import { toPolicyTerms, type PolicyFormState } from "./policyFormState";
import ResultCard from "@/components/tools/ResultCard";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "fixed-benefit-vs-comprehensive-embed";

const COMPREHENSIVE_DEFAULT: PolicyFormState = {
  label: "Comprehensive example",
  planType: "comprehensive",
  premium: "1250",
  premiumScope: "per-traveler",
  policyMaxAmount: "100000",
  policyMaxScope: "individual",
  perIncidentMax: "",
  deductibleAmount: "250",
  deductibleFamilyAmount: "",
  deductibleFrequency: "policy",
  deductibleScope: "individual",
  costSharingPreset: "deductible-coinsurance",
  coinsuranceInNetworkPct: "20",
  coinsuranceOutOfNetworkPct: "40",
  coinsuranceThreshold: "",
  coinsuranceCap: "",
  copayAmount: "",
  erCopay: "",
  erDeductible: "",
  erWaivedIfAdmitted: false,
  oopMaxEnabled: false,
  oopMaxAmount: "",
  oopMaxScope: "individual",
  oopCountsDeductible: true,
  oopCountsCopay: true,
  oopCountsCoinsurance: true,
  oopCountsOutOfNetwork: false,
  oopCountsNonCovered: false,
  networkType: "PPO",
  evacuationMax: "",
  repatriationMax: "",
  scheduledPhysician: "",
  scheduledUrgentCare: "",
  scheduledEr: "",
  scheduledHospitalAdmission: "",
};

const FIXED_BENEFIT_DEFAULT: PolicyFormState = {
  ...COMPREHENSIVE_DEFAULT,
  label: "Fixed-benefit example",
  planType: "fixed-benefit",
  deductibleAmount: "",
  costSharingPreset: "unknown",
  coinsuranceInNetworkPct: "",
  scheduledPhysician: "100",
  scheduledUrgentCare: "500",
  scheduledEr: "1500",
  scheduledHospitalAdmission: "8000",
};

const SCENARIOS: { key: string; label: string; category: ServiceCategory; billedUsd: number }[] = [
  { key: "physician", label: "$500 physician visit", category: "physician", billedUsd: 500 },
  { key: "er", label: "$3,000 urgent-care / ER event", category: "er", billedUsd: 3000 },
  { key: "hospital-20k", label: "$20,000 hospitalization", category: "hospital-admission", billedUsd: 20000 },
  { key: "hospital-100k", label: "$100,000 major claim", category: "hospital-admission", billedUsd: 100000 },
];

const claimant: Claimant = { id: "example-traveler" };
const COMPREHENSIVE_SECTIONS: PolicyFormSection[] = ["deductible", "costSharing", "policyLimits"];
const FIXED_SECTIONS: PolicyFormSection[] = ["scheduledBenefits", "policyLimits"];

export default function FixedVsComprehensiveComparison() {
  const [comprehensive, setComprehensive] = useState(COMPREHENSIVE_DEFAULT);
  const [fixed, setFixed] = useState(FIXED_BENEFIT_DEFAULT);

  const rows = useMemo(() => {
    const compPolicy = toPolicyTerms(comprehensive);
    const fixedPolicy = toPolicyTerms(fixed);
    return SCENARIOS.map((s) => {
      const claim: Claim = { claimantId: claimant.id, serviceCategory: s.category, billedChargeCents: s.billedUsd * 100, networkStatus: "in-network", coverageEligibility: "covered" };
      const comp = runSingleClaim(compPolicy, claimant, claim, initRunningState()).result;
      const fb = runSingleClaim(fixedPolicy, claimant, claim, initRunningState()).result;
      return { scenario: s, comp, fb };
    });
  }, [comprehensive, fixed]);

  return (
    <div className="space-y-5">
      <ResultCard tone="neutral" eyebrow="Same policy maximum, different real-world payment" title="$100,000 maximum on both example plans">
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.scenario.key} className="rounded-2xl border border-ink-900/10 bg-white p-4">
              <p className="mb-2 text-sm font-bold text-ink-900">{r.scenario.label}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-sky-50 p-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-sky-700">Comprehensive</p>
                  <p className="mt-1 text-[0.65rem] text-ink-500">Insurer pays</p>
                  <p className="text-base font-extrabold tabular-nums text-emerald-700">{formatUsd(r.comp.insurerPaymentCents / 100)}</p>
                  <p className="mt-1 text-[0.65rem] text-ink-500">You pay</p>
                  <p className="text-base font-extrabold tabular-nums text-brand-700">{formatUsd(r.comp.memberLiability.totalCents / 100)}</p>
                </div>
                <div className="rounded-xl bg-violet-50 p-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-violet-700">Fixed-benefit</p>
                  <p className="mt-1 text-[0.65rem] text-ink-500">Insurer pays</p>
                  <p className="text-base font-extrabold tabular-nums text-emerald-700">{formatUsd(r.fb.insurerPaymentCents / 100)}</p>
                  <p className="mt-1 text-[0.65rem] text-ink-500">You pay</p>
                  <p className="text-base font-extrabold tabular-nums text-brand-700">{formatUsd(r.fb.memberLiability.totalCents / 100)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-500">Both example plans are edited below with the same $100,000 policy maximum, yet pay differently on the same bill — the deductible/coinsurance formula and the scheduled-benefit formula are not the same math.</p>
      </ResultCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-900/10 bg-slate-50/40 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">Comprehensive example — edit it</p>
          <PolicyTermsForm value={comprehensive} onChange={(v) => { setComprehensive(v); trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: "comprehensive_edited" }); }} sections={COMPREHENSIVE_SECTIONS} />
        </div>
        <div className="rounded-2xl border border-ink-900/10 bg-slate-50/40 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-500">Fixed-benefit example — edit it</p>
          <PolicyTermsForm value={fixed} onChange={(v) => { setFixed(v); trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: "fixed_benefit_edited" }); }} sections={FIXED_SECTIONS} />
        </div>
      </div>
      <p className="text-xs text-ink-400">These are illustrative example numbers, not quotes from any real insurer. Edit them to test your own plan&rsquo;s terms, or use the full{" "}
        <a href="/tools/visitor-insurance-plan-comparison" className="text-brand-600 underline">Plan Comparison Calculator</a> for a complete side-by-side.</p>
    </div>
  );
}
