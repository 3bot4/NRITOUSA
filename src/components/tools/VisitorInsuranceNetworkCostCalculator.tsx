"use client";

/**
 * Visitor Insurance In-Network vs Out-of-Network Calculator
 * (/tools/visitor-insurance-network-cost-calculator).
 *
 * Teaching point: the SAME entered bill is run through the shared engine
 * twice — once as in-network, once as out-of-network — using two separate
 * runSingleClaim calls against the same policy/claimant, so the allowed-
 * amount, balance-billing, and network-coinsurance difference is visible
 * side by side. Not a quote engine: no live insurer pricing is used, and
 * nothing here reimplements a formula — all calculation runs through
 * src/lib/calc/visitorInsurance/engine.ts.
 */
import { useEffect, useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { formatUsd } from "@/lib/format";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { runSingleClaim, initRunningState } from "@/lib/calc/visitorInsurance/engine";
import { SERVICE_CATEGORIES, type Claim, type Claimant, type ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import { ILLUSTRATIVE_SCENARIOS } from "@/lib/calc/visitorInsurance/scenarios";
import PolicyTermsForm, { type PolicyFormSection } from "@/components/tools/visitorInsurance/PolicyTermsForm";
import { BLANK_POLICY_FORM, EXAMPLE_POLICY_FORM, toPolicyTerms, type PolicyFormState } from "@/components/tools/visitorInsurance/policyFormState";
import ClaimResultPanel from "@/components/tools/visitorInsurance/ClaimResultPanel";
import PrintShareBar from "@/components/tools/visitorInsurance/PrintShareBar";
import IconSegmentedSelect from "@/components/tools/visitorInsurance/IconSegmentedSelect";
import { SERVICE_CATEGORY_ICONS } from "@/components/tools/visitorInsurance/shared";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "visitor-insurance-network-cost-calculator";
const STORAGE_KEY = "nritousa.visitorInsuranceNetworkCostCalculator.v1";
const CLAIMANT: Claimant = { id: "network-cost-claimant" };
const SECTIONS: PolicyFormSection[] = ["network", "deductible", "costSharing", "policyLimits"];
const SERVICE_OPTIONS = SERVICE_CATEGORIES.map((s) => ({ value: s.value, label: s.label, icon: SERVICE_CATEGORY_ICONS[s.value] }));

interface SavedState {
  policyForm: PolicyFormState;
  serviceCategory: ServiceCategory;
  billedCharge: string;
  allowedCharge: string;
}

export default function VisitorInsuranceNetworkCostCalculator() {
  const [policyForm, setPolicyForm] = useState<PolicyFormState>(EXAMPLE_POLICY_FORM);
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>("urgent-care");
  const [billedCharge, setBilledCharge] = useState("1000");
  const [allowedCharge, setAllowedCharge] = useState("700");
  const [started, setStarted] = useState(false);
  const [exampleActive, setExampleActive] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedState;
      if (saved.policyForm) setPolicyForm(saved.policyForm);
      if (saved.serviceCategory) setServiceCategory(saved.serviceCategory);
      if (saved.billedCharge !== undefined) setBilledCharge(saved.billedCharge);
      if (saved.allowedCharge !== undefined) setAllowedCharge(saved.allowedCharge);
      // eslint-disable-next-line no-empty
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ policyForm, serviceCategory, billedCharge, allowedCharge }));
    } catch {
      // Storage unavailable (private browsing, quota) — silently skip persistence.
    }
  }, [policyForm, serviceCategory, billedCharge, allowedCharge, started]);

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      trackVisitorInsuranceEvent("calculator_start", { tool_slug: TOOL_SLUG });
    }
  };

  const policy = useMemo(() => toPolicyTerms(policyForm), [policyForm]);
  const hasEnoughToCalculate = billedCharge !== "";

  const baseClaim: Omit<Claim, "networkStatus"> = useMemo(
    () => ({
      claimantId: CLAIMANT.id,
      serviceCategory,
      billedChargeCents: dollarsToCents(billedCharge),
      allowedChargeCents: allowedCharge ? dollarsToCents(allowedCharge) : undefined,
      coverageEligibility: "unknown",
    }),
    [serviceCategory, billedCharge, allowedCharge]
  );

  const inNetworkResult = useMemo(() => {
    if (!hasEnoughToCalculate) return null;
    const claim: Claim = { ...baseClaim, networkStatus: "in-network" };
    return runSingleClaim(policy, CLAIMANT, claim, initRunningState()).result;
  }, [hasEnoughToCalculate, baseClaim, policy]);

  const outOfNetworkResult = useMemo(() => {
    if (!hasEnoughToCalculate) return null;
    const claim: Claim = { ...baseClaim, networkStatus: "out-of-network" };
    return runSingleClaim(policy, CLAIMANT, claim, initRunningState()).result;
  }, [hasEnoughToCalculate, baseClaim, policy]);

  useEffect(() => {
    if (inNetworkResult && outOfNetworkResult) {
      trackVisitorInsuranceEvent("calculation_complete", {
        tool_slug: TOOL_SLUG,
        result_status: inNetworkResult.uncappedExposureWarning || outOfNetworkResult.uncappedExposureWarning ? "uncapped" : "capped",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(inNetworkResult), Boolean(outOfNetworkResult)]);

  const differenceCents = inNetworkResult && outOfNetworkResult ? outOfNetworkResult.memberLiability.totalCents - inNetworkResult.memberLiability.totalCents : null;

  const loadExample = (scenarioKey: string) => {
    markStarted();
    setExampleActive(true);
    const scenario = ILLUSTRATIVE_SCENARIOS.find((s) => s.key === scenarioKey) ?? ILLUSTRATIVE_SCENARIOS[0];
    trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: scenario.key });
    setPolicyForm(EXAMPLE_POLICY_FORM);
    setServiceCategory(scenario.serviceCategory);
    setBilledCharge(String(scenario.billedChargeUsd));
    setAllowedCharge("");
  };

  const reset = () => {
    setPolicyForm(BLANK_POLICY_FORM);
    setServiceCategory("urgent-care");
    setBilledCharge("");
    setAllowedCharge("");
    setExampleActive(false);
    setStarted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const summaryText = useMemo(() => {
    if (!inNetworkResult || !outOfNetworkResult) return "";
    const lines = [
      "VISITOR INSURANCE IN-NETWORK VS OUT-OF-NETWORK — EDUCATIONAL ESTIMATE",
      "(NRI to USA · nritousa.com — educational only, not a quote or coverage determination)",
      "",
      `Plan: ${policyForm.label || "Untitled plan"}`,
      `Billed charge: ${formatUsd(dollarsToCents(billedCharge) / 100)}`,
      `In-network — insurer pays ${formatUsd(inNetworkResult.insurerPaymentCents / 100)}, you owe ${formatUsd(inNetworkResult.memberLiability.totalCents / 100)}`,
      `Out-of-network — insurer pays ${formatUsd(outOfNetworkResult.insurerPaymentCents / 100)}, you owe ${formatUsd(outOfNetworkResult.memberLiability.totalCents / 100)}`,
      "",
      "This tool provides educational estimates based on the information you enter. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination.",
    ];
    return lines.join("\n");
  }, [inNetworkResult, outOfNetworkResult, policyForm.label, billedCharge]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-ink-600">Load an example:</span>
        {ILLUSTRATIVE_SCENARIOS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => loadExample(s.key)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100"
          >
            {s.label}
          </button>
        ))}
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/15 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 transition hover:bg-ink-50">
          Reset
        </button>
      </div>
      {exampleActive && (
        <p className="-mt-4 text-xs font-medium text-amber-700">Example only — edit every number below to match your actual quote or certificate.</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* Inputs */}
        <div className="space-y-4" onFocus={markStarted}>
          <InputCard eyebrow="The bill" title="One bill, run both ways">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink-700">Service</p>
              <IconSegmentedSelect
                options={SERVICE_OPTIONS}
                value={serviceCategory}
                onChange={(v) => {
                  markStarted();
                  setServiceCategory(v);
                }}
                compact
              />
            </div>
            <Field label="Billed charge" help="The full amount on the provider's bill, before any insurer discount.">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  className={`${fieldClass} pl-7`}
                  value={billedCharge}
                  onChange={(e) => {
                    markStarted();
                    setBilledCharge(e.target.value);
                  }}
                />
              </div>
            </Field>
            <Field
              label="Allowed (negotiated) charge, if known"
              help="Leave blank if you don't know it — the calculator will flag that clearly and use the billed charge as a temporary base instead."
            >
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  className={`${fieldClass} pl-7`}
                  value={allowedCharge}
                  onChange={(e) => {
                    markStarted();
                    setAllowedCharge(e.target.value);
                  }}
                />
              </div>
            </Field>
          </InputCard>

          <PolicyTermsForm
            value={policyForm}
            onChange={(v) => {
              markStarted();
              setPolicyForm(v);
            }}
            sections={SECTIONS}
          />
        </div>

        {/* Results */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {!inNetworkResult || !outOfNetworkResult ? (
            <ResultCard tone="info" eyebrow="Waiting on inputs" title="Enter a billed charge to compare">
              <p>Enter the billed charge above (plus your plan&rsquo;s deductible and coinsurance terms) to see the in-network and out-of-network estimate side by side.</p>
            </ResultCard>
          ) : (
            <>
              {differenceCents !== null && (
                <ResultCard tone={differenceCents > 0 ? "attention" : "neutral"} eyebrow="The teaching point" title="Same bill, different network status">
                  <p>
                    For this bill, treating it as out-of-network is estimated to cost you{" "}
                    <strong className="tabular-nums">{formatUsd(Math.abs(differenceCents) / 100)}</strong>{" "}
                    {differenceCents > 0 ? "more" : differenceCents < 0 ? "less" : "the same as"} in-network — mainly from a higher out-of-network coinsurance percentage and, when the allowed amount is known, potential balance billing.
                  </p>
                  <p className="text-xs text-ink-400">Both estimates below carry their own confidence label and uncertainty notes — treat this difference as illustrative, not a guarantee.</p>
                </ResultCard>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">In-network</p>
                  <ClaimResultPanel result={inNetworkResult} policy={policy} billedChargeCents={dollarsToCents(billedCharge)} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Out-of-network</p>
                  <ClaimResultPanel result={outOfNetworkResult} policy={policy} billedChargeCents={dollarsToCents(billedCharge)} />
                </div>
              </div>

              <PrintShareBar toolSlug={TOOL_SLUG} summaryText={summaryText} onReset={reset} comparePlanHref="/tools/visitor-insurance-plan-comparison" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
