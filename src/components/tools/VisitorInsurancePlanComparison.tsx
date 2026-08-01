"use client";

/**
 * Visitor Insurance Plan Comparison Calculator (/tools/visitor-insurance-plan-comparison).
 *
 * Exactly two plans (Plan A vs Plan B) — three columns left dead space and
 * added complexity with no real benefit. Desktop layout is inputs on the
 * left, a live sticky comparison on the right, so the comparison updates as
 * you type instead of being buried below both forms. Prefilled with a real
 * (clearly labeled) example on load so the tool isn't a wall of zeros.
 *
 * Never outputs a single "best overall" badge — per Non-Negotiable Rule 13,
 * that requires a published scoring methodology and verified live plan data,
 * neither of which this tool has. Instead it reports category winners
 * (tie-aware) and an "important tradeoffs" list.
 */
import { useEffect, useMemo, useState } from "react";
import { formatUsd } from "@/lib/format";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { runSingleClaim, initRunningState } from "@/lib/calc/visitorInsurance/engine";
import { SERVICE_CATEGORIES, type Claim, type Claimant, type ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import { ILLUSTRATIVE_SCENARIOS } from "@/lib/calc/visitorInsurance/scenarios";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import PolicyTermsForm, { type PolicyFormSection } from "@/components/tools/visitorInsurance/PolicyTermsForm";
import { toPolicyTerms, type PolicyFormState } from "@/components/tools/visitorInsurance/policyFormState";
import PrintShareBar from "@/components/tools/visitorInsurance/PrintShareBar";
import IconSegmentedSelect from "@/components/tools/visitorInsurance/IconSegmentedSelect";
import ScenarioPresetGrid from "@/components/tools/visitorInsurance/ScenarioPresetGrid";
import { SERVICE_CATEGORY_ICONS } from "@/components/tools/visitorInsurance/shared";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const SERVICE_OPTIONS = SERVICE_CATEGORIES.map((s) => ({ value: s.value, label: s.label, icon: SERVICE_CATEGORY_ICONS[s.value] }));

const TOOL_SLUG = "visitor-insurance-plan-comparison";
const SECTIONS: PolicyFormSection[] = ["planType", "premium", "network", "deductible", "costSharing", "policyLimits", "outOfPocket", "scheduledBenefits", "advanced"];

const EXAMPLE_PLAN_A: PolicyFormState = {
  label: "Plan A",
  planType: "comprehensive",
  premium: "1200",
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

const EXAMPLE_PLAN_B: PolicyFormState = {
  ...EXAMPLE_PLAN_A,
  label: "Plan B",
  premium: "800",
  policyMaxAmount: "50000",
  deductibleAmount: "1000",
  coinsuranceInNetworkPct: "30",
  coinsuranceOutOfNetworkPct: "50",
};

function winnerLabel(aVal: number, bVal: number, lowerIsBetter: boolean, labelA: string, labelB: string): string {
  if (aVal === bVal) return "Tied";
  const aWins = lowerIsBetter ? aVal < bVal : aVal > bVal;
  return aWins ? labelA : labelB;
}

export default function VisitorInsurancePlanComparison() {
  const [planA, setPlanA] = useState<PolicyFormState>(EXAMPLE_PLAN_A);
  const [planB, setPlanB] = useState<PolicyFormState>(EXAMPLE_PLAN_B);
  const [scenarioCategory, setScenarioCategory] = useState<ServiceCategory>("er");
  const [billedCharge, setBilledCharge] = useState("4500");
  const [scenarioLabel, setScenarioLabel] = useState("er-visit");
  const [exampleActive, setExampleActive] = useState(true);

  const claimant: Claimant = { id: "comparison-traveler" };
  const claim: Claim = {
    claimantId: claimant.id,
    serviceCategory: scenarioCategory,
    billedChargeCents: dollarsToCents(billedCharge),
    networkStatus: "unknown",
    coverageEligibility: "covered",
  };

  const results = useMemo(() => {
    return [planA, planB].map((form) => {
      const policy = toPolicyTerms(form);
      const { result } = runSingleClaim(policy, claimant, claim, initRunningState());
      return { form, policy, result };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planA, planB, scenarioCategory, billedCharge]);

  const [resultA, resultB] = results;

  useEffect(() => {
    trackVisitorInsuranceEvent("comparison_complete", { tool_slug: TOOL_SLUG, plan_count: 2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioLabel]);

  const winners = useMemo(
    () => ({
      premium: winnerLabel(resultA.policy.premiumCents, resultB.policy.premiumCents, true, planA.label, planB.label),
      liability: winnerLabel(resultA.result.memberLiability.totalCents, resultB.result.memberLiability.totalCents, true, planA.label, planB.label),
      remainingMax: winnerLabel(resultA.result.remaining.policyMaximumCents ?? 0, resultB.result.remaining.policyMaximumCents ?? 0, false, planA.label, planB.label),
      completeness: winnerLabel(resultA.result.missingInputs.length, resultB.result.missingInputs.length, true, planA.label, planB.label),
    }),
    [resultA, resultB, planA.label, planB.label]
  );

  const loadScenario = (key: string) => {
    const s = ILLUSTRATIVE_SCENARIOS.find((x) => x.key === key);
    if (!s) return;
    setScenarioLabel(s.key);
    setScenarioCategory(s.serviceCategory);
    setBilledCharge(String(s.billedChargeUsd));
    trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: s.key });
  };

  const summaryText = useMemo(() => {
    const lines = [
      "VISITOR INSURANCE PLAN COMPARISON — EDUCATIONAL ESTIMATE",
      "(NRI to USA · nritousa.com — educational only, not a ranking or recommendation)",
      "",
      `Scenario: ${scenarioLabel} — billed charge ${formatUsd(dollarsToCents(billedCharge) / 100)}`,
      "",
      ...results.map((r) => `${r.form.label}: insurer pays ${formatUsd(r.result.insurerPaymentCents / 100)}, you owe ${formatUsd(r.result.memberLiability.totalCents / 100)}, premium ${formatUsd(r.policy.premiumCents / 100)}`),
    ];
    return lines.join("\n");
  }, [results, scenarioLabel, billedCharge]);

  const markEdited = () => setExampleActive(false);

  return (
    <div className="space-y-4">
      <ol className="grid gap-2 rounded-2xl border border-ink-900/10 bg-slate-50/60 p-4 text-xs text-ink-600 sm:grid-cols-2">
        <li><span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[0.65rem] font-bold text-white">1</span>Pick or enter a bill below</li>
        <li><span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[0.65rem] font-bold text-white">2</span>Edit Plan A &amp; Plan B with your own quotes</li>
      </ol>
      {exampleActive && (
        <p className="text-xs font-medium text-amber-700">Showing illustrative example numbers so you can see the comparison working — edit every field to compare your own quotes.</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        {/* LEFT: inputs */}
        <div className="space-y-4">
          <InputCard eyebrow="Step 1 · Shared scenario" title="Run both plans through the same medical bill">
            <div>
              <p className="mb-2 text-xs font-semibold text-ink-600">Quick scenarios</p>
              <ScenarioPresetGrid activeKey={scenarioLabel} onSelect={loadScenario} max={8} />
            </div>
            <div>
              <p className="mb-2 mt-1 text-xs font-semibold text-ink-600">Or pick the service type directly</p>
              <IconSegmentedSelect options={SERVICE_OPTIONS} value={scenarioCategory} onChange={(v) => { setScenarioCategory(v); setScenarioLabel("custom"); }} compact />
            </div>
            <Field label="Billed charge">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-ink-400">$</span>
                <input type="number" min={0} inputMode="numeric" className={`${fieldClass} h-12 pl-8 text-lg font-bold text-ink-900`} value={billedCharge} onChange={(e) => { setBilledCharge(e.target.value); setScenarioLabel("custom"); }} />
              </div>
            </Field>
          </InputCard>

          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Step 2 · Plan terms</p>
          <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/30 p-3">
            <p className="mb-2 text-sm font-extrabold text-sky-800">Plan A</p>
            <PolicyTermsForm value={planA} onChange={(v) => { markEdited(); setPlanA(v); }} sections={SECTIONS} idPrefix="Plan A — " />
          </div>
          <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/30 p-3">
            <p className="mb-2 text-sm font-extrabold text-violet-800">Plan B</p>
            <PolicyTermsForm value={planB} onChange={(v) => { markEdited(); setPlanB(v); }} sections={SECTIONS} idPrefix="Plan B — " />
          </div>
        </div>

        {/* RIGHT: live comparison, sticky on desktop */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <ResultCard tone="neutral" eyebrow="Live comparison" title="Same bill, two plans">
            <div className="grid grid-cols-2 gap-3">
              {[{ r: resultA, tone: "sky" }, { r: resultB, tone: "violet" }].map(({ r, tone }) => (
                <div key={r.form.label} className={`rounded-xl border-2 p-3 ${tone === "sky" ? "border-sky-200 bg-sky-50/50" : "border-violet-200 bg-violet-50/50"}`}>
                  <p className={`text-xs font-extrabold ${tone === "sky" ? "text-sky-800" : "text-violet-800"}`}>{r.form.label}</p>
                  <p className="mt-2 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Premium</p>
                  <p className="text-base font-extrabold tabular-nums text-ink-900">{formatUsd(r.policy.premiumCents / 100)}</p>
                  <p className="mt-2 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Insurer pays</p>
                  <p className="text-base font-extrabold tabular-nums text-emerald-700">{formatUsd(r.result.insurerPaymentCents / 100)}</p>
                  <p className="mt-2 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">You pay</p>
                  <p className="text-lg font-extrabold tabular-nums text-brand-700">{formatUsd(r.result.memberLiability.totalCents / 100)}</p>
                  {r.result.missingInputs.length > 0 && <p className="mt-2 text-[0.6875rem] text-amber-700">{r.result.missingInputs.length} term(s) missing</p>}
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard tone="info" eyebrow="Category winners" title="No 'best plan' badge — by design">
            <ul className="space-y-1.5 text-sm">
              <li><strong>Lowest premium:</strong> {winners.premium}</li>
              <li><strong>Lowest liability for this bill:</strong> {winners.liability}</li>
              <li><strong>Highest remaining policy benefit:</strong> {winners.remainingMax}</li>
              <li><strong>Most complete entered terms:</strong> {winners.completeness}</li>
            </ul>
            <p className="mt-3 text-xs text-ink-500">
              No plan is labeled &ldquo;best overall.&rdquo; That needs a published methodology and verified plan data — see the{" "}
              <a href="/visitor-insurance/methodology" className="text-brand-600 underline">methodology page</a>.
            </p>
          </ResultCard>

          <ResultCard tone="caution" eyebrow="Read before deciding" title="Important tradeoffs">
            <ul className="list-disc space-y-1.5 pl-5 text-sm">
              <li>A lower premium is only a savings if it doesn&rsquo;t leave you owing more on a real claim.</li>
              <li>A higher policy maximum doesn&rsquo;t help if there&rsquo;s no true out-of-pocket maximum — exposure may still be uncapped.</li>
              <li>Missing terms mean lower confidence for that plan&rsquo;s numbers until you confirm them.</li>
            </ul>
          </ResultCard>

          <PrintShareBar
            toolSlug={TOOL_SLUG}
            summaryText={summaryText}
            onReset={() => {
              setPlanA(EXAMPLE_PLAN_A);
              setPlanB(EXAMPLE_PLAN_B);
              setExampleActive(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
