"use client";

/**
 * Visitor Insurance Policy Maximum & Liability Calculator
 * (/tools/visitor-insurance-policy-maximum-calculator).
 *
 * Single most important point of this page: "policy maximum" (the most the
 * PLAN will pay) and "out-of-pocket maximum" (what caps what YOU pay, only
 * if the certificate has one) are NOT the same thing. This component never
 * computes or displays a single "worst case" / "your maximum possible
 * liability" number unless policy.outOfPocketMaximum is actually set — see
 * the three labeled conclusions below. All calculation runs through
 * src/lib/calc/visitorInsurance/engine.ts (runClaimsForClaimant), which
 * folds the policy-maximum running state chronologically across claims.
 */
import { useEffect, useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { formatUsd } from "@/lib/format";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { runClaimsForClaimant } from "@/lib/calc/visitorInsurance/engine";
import { SERVICE_CATEGORIES, type Claim, type Claimant, type ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import { ILLUSTRATIVE_SCENARIOS } from "@/lib/calc/visitorInsurance/scenarios";
import PolicyTermsForm, { type PolicyFormSection } from "@/components/tools/visitorInsurance/PolicyTermsForm";
import { BLANK_POLICY_FORM, EXAMPLE_POLICY_FORM, toPolicyTerms, type PolicyFormState } from "@/components/tools/visitorInsurance/policyFormState";
import ClaimResultPanel from "@/components/tools/visitorInsurance/ClaimResultPanel";
import PrintShareBar from "@/components/tools/visitorInsurance/PrintShareBar";
import IconSegmentedSelect from "@/components/tools/visitorInsurance/IconSegmentedSelect";
import { UNCAPPED_EXPOSURE_NOTE, SERVICE_CATEGORY_ICONS } from "@/components/tools/visitorInsurance/shared";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "visitor-insurance-policy-maximum-calculator";
const STORAGE_KEY = "nritousa.visitorInsurancePolicyMaximumCalculator.v1";
const SERVICE_OPTIONS = SERVICE_CATEGORIES.map((s) => ({ value: s.value, label: s.label, icon: SERVICE_CATEGORY_ICONS[s.value] }));
const CLAIMANT: Claimant = { id: "policy-max-claimant" };
const SECTIONS: PolicyFormSection[] = ["policyLimits", "outOfPocket", "deductible", "costSharing"];

const newId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);

interface ClaimState {
  id: string;
  serviceCategory: ServiceCategory;
  billedCharge: string;
}

function defaultClaim(): ClaimState {
  return { id: newId(), serviceCategory: "hospital-admission", billedCharge: "120000" };
}

type CeilingStatus = "capped" | "no-ceiling" | "cannot-cap";

export default function VisitorInsurancePolicyMaximumCalculator() {
  const [policyForm, setPolicyForm] = useState<PolicyFormState>(EXAMPLE_POLICY_FORM);
  const [claims, setClaims] = useState<ClaimState[]>([defaultClaim()]);
  const [started, setStarted] = useState(false);
  const [exampleActive, setExampleActive] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { policyForm: PolicyFormState; claims: ClaimState[] };
      if (saved.policyForm) setPolicyForm(saved.policyForm);
      if (saved.claims?.length) setClaims(saved.claims);
      // eslint-disable-next-line no-empty
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ policyForm, claims }));
    } catch {
      // Storage unavailable (private browsing, quota) — silently skip persistence.
    }
  }, [policyForm, claims, started]);

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      trackVisitorInsuranceEvent("calculator_start", { tool_slug: TOOL_SLUG });
    }
  };

  const policy = useMemo(() => toPolicyTerms(policyForm), [policyForm]);
  const hasPolicyMax = policy.policyMaximum !== undefined;
  const hasOopMax = policy.outOfPocketMaximum !== undefined;

  const engineClaims: Claim[] = claims
    .filter((c) => c.billedCharge !== "")
    .map((c) => ({
      claimantId: CLAIMANT.id,
      serviceCategory: c.serviceCategory,
      billedChargeCents: dollarsToCents(c.billedCharge),
      networkStatus: "unknown",
      coverageEligibility: "unknown",
    }));

  const hasEnoughToCalculate = engineClaims.length > 0;

  const results = useMemo(() => {
    if (!hasEnoughToCalculate) return [];
    return runClaimsForClaimant(policy, CLAIMANT, engineClaims);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEnoughToCalculate, policy, JSON.stringify(engineClaims)]);

  useEffect(() => {
    if (results.length > 0) {
      trackVisitorInsuranceEvent("calculation_complete", { tool_slug: TOOL_SLUG, result_status: hasOopMax ? "capped" : hasPolicyMax ? "no_ceiling" : "cannot_cap" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.length]);

  const lastResult = results.length > 0 ? results[results.length - 1] : null;
  const remainingPolicyBenefitCents = hasPolicyMax ? lastResult?.remaining.policyMaximumCents ?? 0 : undefined;
  const totalAbovePolicyMaxCents = results.reduce((sum, r) => sum + r.memberLiability.abovePolicyMaximumCents, 0);

  const ceilingStatus: CeilingStatus = hasOopMax ? "capped" : hasPolicyMax ? "no-ceiling" : "cannot-cap";

  const addClaim = () => {
    markStarted();
    if (claims.length >= 6) return;
    setClaims((p) => [...p, defaultClaim()]);
  };
  const removeClaim = (id: string) => setClaims((p) => (p.length > 1 ? p.filter((c) => c.id !== id) : p));
  const updateClaim = (id: string, patch: Partial<ClaimState>) => {
    markStarted();
    setClaims((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const loadExample = (scenarioKey: string) => {
    markStarted();
    setExampleActive(true);
    const scenario = ILLUSTRATIVE_SCENARIOS.find((s) => s.key === scenarioKey) ?? ILLUSTRATIVE_SCENARIOS[0];
    trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: scenario.key });
    setPolicyForm(EXAMPLE_POLICY_FORM);
    setClaims([{ id: newId(), serviceCategory: scenario.serviceCategory, billedCharge: String(scenario.billedChargeUsd) }]);
  };

  const reset = () => {
    setPolicyForm(BLANK_POLICY_FORM);
    setClaims([defaultClaim()]);
    setExampleActive(false);
    setStarted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const summaryText = useMemo(() => {
    if (results.length === 0) return "";
    const lines = [
      "VISITOR INSURANCE POLICY MAXIMUM & LIABILITY — EDUCATIONAL ESTIMATE",
      "(NRI to USA · nritousa.com — educational only, not a quote or coverage determination)",
      "",
      `Plan: ${policyForm.label || "Untitled plan"}`,
      hasPolicyMax ? `Remaining policy benefit after entered claims: ${formatUsd((remainingPolicyBenefitCents ?? 0) / 100)}` : "Policy maximum: not entered",
      hasPolicyMax ? `Amount above policy maximum across entered claims: ${formatUsd(totalAbovePolicyMaxCents / 100)}` : "",
      ceilingStatus === "capped"
        ? "Contractual cost-sharing ceiling identified — a true out-of-pocket maximum was entered."
        : ceilingStatus === "no-ceiling"
          ? `No contractual cost-sharing ceiling entered — ${UNCAPPED_EXPOSURE_NOTE}`
          : "Liability cannot be capped from available information.",
      "",
      "This tool provides educational estimates based on the information you enter. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination.",
    ];
    return lines.filter(Boolean).join("\n");
  }, [results.length, policyForm.label, hasPolicyMax, remainingPolicyBenefitCents, totalAbovePolicyMaxCents, ceilingStatus]);

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
        <p className="-mt-4 text-xs font-medium text-amber-700">Example only — edit every number below to match your actual quote or certificate. Notice the example does not include an out-of-pocket maximum, which is the common case.</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Inputs */}
        <div className="space-y-4" onFocus={markStarted}>
          <PolicyTermsForm
            value={policyForm}
            onChange={(v) => {
              markStarted();
              setPolicyForm(v);
            }}
            sections={SECTIONS}
          />

          <InputCard eyebrow="Medical bill(s)" title="Claim amount(s) to run against the maximum">
            <p className="text-xs text-ink-500">Enter one or more claims to see the policy maximum and any out-of-pocket maximum draw down as bills come in, in the order you list them.</p>
            {claims.map((c, i) => (
              <div key={c.id} className="space-y-2 border-b border-ink-900/5 pb-3 last:border-0 last:pb-0">
                <p className="text-xs font-semibold text-ink-700">Claim {i + 1} — service</p>
                <IconSegmentedSelect options={SERVICE_OPTIONS} value={c.serviceCategory} onChange={(v) => updateClaim(c.id, { serviceCategory: v })} compact />
                <Field label="Billed charge">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-ink-400">$</span>
                    <input type="number" min={0} inputMode="numeric" className={`${fieldClass} h-12 pl-8 text-lg font-bold text-ink-900`} value={c.billedCharge} onChange={(e) => updateClaim(c.id, { billedCharge: e.target.value })} />
                  </div>
                </Field>
                {claims.length > 1 && (
                  <button type="button" onClick={() => removeClaim(c.id)} className="text-left text-xs font-bold text-ink-400 hover:text-ink-600">
                    Remove this claim
                  </button>
                )}
              </div>
            ))}
            {claims.length < 6 && (
              <button type="button" onClick={addClaim} className="text-xs font-bold text-brand-600 hover:text-brand-700">
                + Add another claim
              </button>
            )}
          </InputCard>
        </div>

        {/* Results */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {!hasEnoughToCalculate || results.length === 0 ? (
            <ResultCard tone="info" eyebrow="Waiting on inputs" title="Enter at least one claim amount">
              <p>Fill in the policy maximum (and, if your certificate states one, an out-of-pocket maximum) plus at least one billed amount to see the estimate.</p>
            </ResultCard>
          ) : (
            <>
              <ResultCard tone="neutral" eyebrow="Policy maximum status" title="Remaining policy benefit & amount above the maximum">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-ink-900/10 bg-slate-50/70 p-3">
                    <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Remaining policy benefit</p>
                    <p className="mt-1 text-base font-extrabold tabular-nums text-ink-900">{hasPolicyMax ? formatUsd((remainingPolicyBenefitCents ?? 0) / 100) : "Not entered"}</p>
                  </div>
                  <div className="rounded-xl border border-ink-900/10 bg-slate-50/70 p-3">
                    <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Amount above policy maximum</p>
                    <p className="mt-1 text-base font-extrabold tabular-nums text-ink-900">{hasPolicyMax ? formatUsd(totalAbovePolicyMaxCents / 100) : "Cannot calculate"}</p>
                  </div>
                </div>
                {!hasPolicyMax && <p className="text-xs text-ink-400">No policy maximum was entered above, so neither figure can be measured against a contractual limit.</p>}
              </ResultCard>

              {ceilingStatus === "capped" && (
                <ResultCard tone="positive" eyebrow="Contractual cost-sharing ceiling identified" title="Your certificate states a true out-of-pocket maximum">
                  <p>
                    You entered an out-of-pocket maximum of <strong className="tabular-nums">{formatUsd((policy.outOfPocketMaximum?.amountCents ?? 0) / 100)}</strong>. Cost-sharing that counts toward it, per what you specified, stops adding to your liability once that ceiling is
                    reached — the insurer covers the remainder of what counts. This is a genuine contractual cap because you entered it explicitly, not an assumption this tool made.
                  </p>
                </ResultCard>
              )}

              {ceilingStatus === "no-ceiling" && (
                <ResultCard tone="attention" eyebrow="No contractual cost-sharing ceiling entered" title="A policy maximum caps what the PLAN pays — not what YOU could owe">
                  <p>
                    You entered a policy maximum of <strong className="tabular-nums">{formatUsd((policy.policyMaximum?.amountCents ?? 0) / 100)}</strong>, but no true out-of-pocket maximum. A policy maximum limits the insurer&rsquo;s total payout on this policy; by itself it does
                    not limit your personal liability. Without a stated out-of-pocket maximum, your deductible, coinsurance, and any amount above the policy maximum can keep adding up as bills come in.
                  </p>
                  <p className="font-semibold text-ink-700">{UNCAPPED_EXPOSURE_NOTE}</p>
                  <p className="text-xs italic text-ink-500">Design principle this calculator follows: never display a misleading finite &ldquo;worst-case&rdquo; amount when your exposure may remain uncapped.</p>
                </ResultCard>
              )}

              {ceilingStatus === "cannot-cap" && (
                <ResultCard tone="attention" eyebrow="Liability cannot be capped from available information" title="Neither a policy maximum nor an out-of-pocket maximum was entered">
                  <p>
                    Without a policy maximum or an out-of-pocket maximum entered above, this calculator has no contractual ceiling to measure your liability against. Add the policy maximum from your certificate — and check separately whether it states a true out-of-pocket
                    maximum — for a more complete estimate.
                  </p>
                  <p className="font-semibold text-ink-700">{UNCAPPED_EXPOSURE_NOTE}</p>
                  <p className="text-xs italic text-ink-500">Design principle this calculator follows: never display a misleading finite &ldquo;worst-case&rdquo; amount when your exposure may remain uncapped.</p>
                </ResultCard>
              )}

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Claim-by-claim detail</p>
                {results.map((r, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-xs font-semibold text-ink-600">
                      Claim {i + 1}: {SERVICE_CATEGORIES.find((s) => s.value === r.claim.serviceCategory)?.label ?? r.claim.serviceCategory}
                    </p>
                    <ClaimResultPanel result={r} policy={policy} billedChargeCents={r.claim.billedChargeCents} />
                  </div>
                ))}
              </div>

              <PrintShareBar toolSlug={TOOL_SLUG} summaryText={summaryText} onReset={reset} comparePlanHref="/tools/visitor-insurance-plan-comparison" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
