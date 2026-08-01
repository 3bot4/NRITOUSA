"use client";

/**
 * Master Visitor Insurance Cost & Liability Calculator (/tools/visitor-insurance-cost-calculator).
 *
 * A guided 4-step wizard (Traveler → Situation → Insurance → Results) built
 * around the one question that matters: "if something happens, how much
 * will I actually pay?" The Insurance step defaults to Basic Mode — a
 * handful of natural-language questions with quick-pick bands instead of
 * raw certificate fields — with Advanced Mode (the full manual form) one
 * tap away for anyone with a certificate in hand. Both modes edit the same
 * underlying PolicyFormState; "Not sure" always leaves a field genuinely
 * unset rather than guessing — the engine already flags missing terms
 * honestly instead of inventing them. Not a quote engine: no live insurer
 * pricing is fetched or estimated. All calculation runs through
 * src/lib/calc/visitorInsurance/* — nothing here reimplements a formula.
 */
import { useEffect, useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { formatUsd } from "@/lib/format";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { runHousehold } from "@/lib/calc/visitorInsurance/familyAggregation";
import { SERVICE_CATEGORIES, type Claim, type NetworkStatus, type CoverageEligibility, type ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import { ILLUSTRATIVE_SCENARIOS, getScenario } from "@/lib/calc/visitorInsurance/scenarios";
import PolicyTermsForm, { type PolicyFormSection } from "@/components/tools/visitorInsurance/PolicyTermsForm";
import BasicInsuranceQuestions from "@/components/tools/visitorInsurance/BasicInsuranceQuestions";
import { BLANK_POLICY_FORM, EXAMPLE_POLICY_FORM, toPolicyTerms, type PolicyFormState } from "@/components/tools/visitorInsurance/policyFormState";
import IconSegmentedSelect from "@/components/tools/visitorInsurance/IconSegmentedSelect";
import ScenarioPresetGrid from "@/components/tools/visitorInsurance/ScenarioPresetGrid";
import WizardProgress from "@/components/tools/visitorInsurance/WizardProgress";
import WizardActions from "@/components/tools/visitorInsurance/WizardActions";
import ClaimResultPanel from "@/components/tools/visitorInsurance/ClaimResultPanel";
import FamilyBreakdown from "@/components/tools/visitorInsurance/FamilyBreakdown";
import PrintShareBar from "@/components/tools/visitorInsurance/PrintShareBar";
import { SERVICE_CATEGORY_ICONS } from "@/components/tools/visitorInsurance/shared";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "visitor-insurance-cost-calculator";
const STORAGE_KEY = "nritousa.visitorInsuranceCostCalculator.v3";

interface TravelerState {
  id: string;
  label: string;
  age: string;
}
interface ClaimState {
  id: string;
  claimantId: string;
  serviceCategory: ServiceCategory;
  billedCharge: string;
  allowedCharge: string;
  networkStatus: NetworkStatus;
  coverageEligibility: CoverageEligibility;
}

const newId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);

function defaultTraveler(n: number): TravelerState {
  return { id: newId(), label: `Traveler ${n}`, age: "" };
}
function defaultClaim(claimantId: string): ClaimState {
  return { id: newId(), claimantId, serviceCategory: "urgent-care", billedCharge: "", allowedCharge: "", networkStatus: "unknown", coverageEligibility: "unknown" };
}
function exampleClaim(claimantId: string): ClaimState {
  return { id: newId(), claimantId, serviceCategory: "er", billedCharge: "4500", allowedCharge: "", networkStatus: "unknown", coverageEligibility: "covered" };
}

const POLICY_SECTIONS: PolicyFormSection[] = ["planType", "premium", "network", "deductible", "costSharing", "policyLimits", "outOfPocket", "scheduledBenefits", "advanced"];
const SERVICE_OPTIONS = SERVICE_CATEGORIES.map((s) => ({ value: s.value, label: s.label, icon: SERVICE_CATEGORY_ICONS[s.value] }));

const STEPS = [
  { key: "traveler", label: "Traveler" },
  { key: "situation", label: "Situation" },
  { key: "insurance", label: "Insurance" },
  { key: "results", label: "Results" },
];

export default function VisitorInsuranceCostCalculator() {
  const [step, setStep] = useState(0);
  const [detailMode, setDetailMode] = useState<"basic" | "advanced">("basic");
  const [policyForm, setPolicyForm] = useState<PolicyFormState>(EXAMPLE_POLICY_FORM);
  const [travelers, setTravelers] = useState<TravelerState[]>(() => [defaultTraveler(1)]);
  const [claims, setClaims] = useState<ClaimState[]>(() => [exampleClaim(travelers[0].id)]);
  const [started, setStarted] = useState(false);
  const [exampleActive, setExampleActive] = useState(true);

  useEffect(() => {
    setClaims((prev) => {
      const travelerIds = new Set(travelers.map((t) => t.id));
      const kept = prev.filter((c) => travelerIds.has(c.claimantId));
      const missing = travelers.filter((t) => !kept.some((c) => c.claimantId === t.id));
      return [...kept, ...missing.map((t) => defaultClaim(t.id))];
    });
  }, [travelers]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { policyForm: PolicyFormState; travelers: TravelerState[]; claims: ClaimState[]; detailMode?: "basic" | "advanced" };
      if (saved.policyForm) setPolicyForm(saved.policyForm);
      if (saved.travelers?.length) setTravelers(saved.travelers);
      if (saved.claims) setClaims(saved.claims);
      if (saved.detailMode) setDetailMode(saved.detailMode);
      // eslint-disable-next-line no-empty
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ policyForm, travelers, claims, detailMode }));
    } catch {
      // Storage unavailable (private browsing, quota) — silently skip persistence.
    }
  }, [policyForm, travelers, claims, detailMode, started]);

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      trackVisitorInsuranceEvent("calculator_start", { tool_slug: TOOL_SLUG, mode: detailMode });
    }
  };

  const goToStep = (i: number) => {
    if (i > step) return; // upcoming steps aren't clickable — use Continue buttons
    setStep(i);
  };
  const next = () => {
    markStarted();
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const policy = useMemo(() => toPolicyTerms(policyForm), [policyForm]);

  const engineClaims: Claim[] = claims
    .filter((c) => c.billedCharge !== "")
    .map((c) => ({
      claimantId: c.claimantId,
      serviceCategory: c.serviceCategory,
      billedChargeCents: dollarsToCents(c.billedCharge),
      allowedChargeCents: c.allowedCharge ? dollarsToCents(c.allowedCharge) : undefined,
      networkStatus: c.networkStatus,
      coverageEligibility: c.coverageEligibility,
    }));

  const hasEnoughToCalculate = policyForm.premium !== "" && engineClaims.length > 0;

  const household = useMemo(() => {
    if (!hasEnoughToCalculate) return null;
    return runHousehold(
      travelers.map((t) => ({
        claimant: { id: t.id, label: t.label, age: t.age ? Number(t.age) : undefined },
        policy,
        claims: engineClaims.filter((c) => c.claimantId === t.id),
      }))
    );
  }, [hasEnoughToCalculate, travelers, policy, engineClaims]);

  useEffect(() => {
    if (household) trackVisitorInsuranceEvent("calculation_complete", { tool_slug: TOOL_SLUG, result_status: household.uncappedExposureWarning ? "uncapped" : "capped" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(household)]);

  const travelerLabels = Object.fromEntries(travelers.map((t) => [t.id, t.label]));

  const addTraveler = () => {
    markStarted();
    if (travelers.length >= 6) return;
    setTravelers((p) => [...p, defaultTraveler(p.length + 1)]);
  };
  const removeTraveler = (id: string) => {
    markStarted();
    setTravelers((p) => (p.length > 1 ? p.filter((t) => t.id !== id) : p));
  };
  const addClaim = (claimantId: string) => {
    markStarted();
    setClaims((p) => [...p, defaultClaim(claimantId)]);
  };
  const removeClaim = (id: string) => setClaims((p) => p.filter((c) => c.id !== id));
  const updateClaim = (id: string, patch: Partial<ClaimState>) => {
    markStarted();
    setClaims((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const applyScenario = (claimantId: string, scenarioKey: string) => {
    const scenario = getScenario(scenarioKey);
    if (!scenario) return;
    markStarted();
    trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: scenario.key });
    setClaims((prev) => {
      const idx = prev.findIndex((c) => c.claimantId === claimantId);
      const updated: ClaimState = { ...(prev[idx] ?? defaultClaim(claimantId)), serviceCategory: scenario.serviceCategory, billedCharge: String(scenario.billedChargeUsd), coverageEligibility: "covered" };
      if (idx === -1) return [...prev, updated];
      return prev.map((c, i) => (i === idx ? updated : c));
    });
  };

  const reset = () => {
    setPolicyForm(BLANK_POLICY_FORM);
    setTravelers([defaultTraveler(1)]);
    setClaims([]);
    setExampleActive(false);
    setStarted(false);
    setStep(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const summaryText = useMemo(() => {
    if (!household) return "";
    const lines = [
      "VISITOR INSURANCE COST & LIABILITY — EDUCATIONAL ESTIMATE",
      "(NRI to USA · nritousa.com — educational only, not a quote or coverage determination)",
      "",
      `Plan: ${policyForm.label || "Untitled plan"}`,
      `Total premium: ${formatUsd(household.aggregatePremiumCents / 100)}`,
      `Total estimated insurer payment: ${formatUsd(household.aggregateInsurerPaymentCents / 100)}`,
      `Total estimated your liability: ${formatUsd(household.aggregateMedicalLiabilityCents / 100)}`,
      `Total estimated financial cost: ${formatUsd(household.aggregateTotalCostCents / 100)}`,
      household.uncappedExposureWarning ? "Your total exposure may exceed this estimate." : "",
      "",
      "This tool provides educational estimates based on the information you enter. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination.",
    ];
    return lines.filter(Boolean).join("\n");
  }, [household, policyForm.label]);

  return (
    <div>
      <WizardProgress steps={STEPS} currentIndex={step} onJump={goToStep} />
      {exampleActive && step < 3 && (
        <p className="mb-4 text-xs font-medium text-amber-700">Showing an illustrative example so you can see it working — edit anything below to match your own quote.</p>
      )}

      {/* ---- Step 1: Traveler ---- */}
      {step === 0 && (
        <div className="space-y-4">
          <InputCard eyebrow="Step 1 of 4" title="Who is this for?">
            <div className="space-y-3">
              {travelers.map((t, i) => (
                <div key={t.id} className="flex items-end gap-2">
                  <Field label={`Traveler ${i + 1} label`}>
                    <input type="text" className={fieldClass} value={t.label} onChange={(e) => setTravelers((p) => p.map((x) => (x.id === t.id ? { ...x, label: e.target.value } : x)))} />
                  </Field>
                  <Field label="Age">
                    <input type="number" min={0} max={120} inputMode="numeric" className={fieldClass} value={t.age} onChange={(e) => setTravelers((p) => p.map((x) => (x.id === t.id ? { ...x, age: e.target.value } : x)))} />
                  </Field>
                  {travelers.length > 1 && (
                    <button type="button" onClick={() => removeTraveler(t.id)} className="mb-1 rounded-lg border border-ink-900/10 px-2.5 py-2 text-xs font-bold text-ink-500 hover:bg-ink-50">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {travelers.length < 6 && (
                <button type="button" onClick={addTraveler} className="text-xs font-bold text-brand-600 hover:text-brand-700">
                  + Add another traveler
                </button>
              )}
            </div>
          </InputCard>
          <WizardActions onNext={next} />
        </div>
      )}

      {/* ---- Step 2: Situation ---- */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Step 2 of 4 — Situation</p>
          {travelers.map((t) => {
            const travelerClaims = claims.filter((c) => c.claimantId === t.id);
            return (
              <InputCard key={t.id} eyebrow={t.label} title="What happened?">
                <div>
                  <p className="mb-2 text-xs font-semibold text-ink-600">Tap the closest situation — it prefills an editable example</p>
                  <ScenarioPresetGrid onSelect={(key) => applyScenario(t.id, key)} max={8} />
                </div>
                {travelerClaims.map((c) => (
                  <div key={c.id} className="space-y-3 border-t border-ink-900/5 pt-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-ink-600">Or pick the service type directly</p>
                      <IconSegmentedSelect options={SERVICE_OPTIONS} value={c.serviceCategory} onChange={(v) => updateClaim(c.id, { serviceCategory: v })} compact />
                    </div>
                    <Field label="Estimated or actual bill">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-ink-400">$</span>
                        <input type="number" min={0} inputMode="numeric" className={`${fieldClass} h-12 pl-8 text-lg font-bold text-ink-900`} value={c.billedCharge} onChange={(e) => updateClaim(c.id, { billedCharge: e.target.value })} />
                      </div>
                    </Field>
                    <details className="rounded-xl border border-ink-900/10 bg-white p-3">
                      <summary className="cursor-pointer text-xs font-bold text-ink-700">Network &amp; allowed charge (optional)</summary>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Field label="Allowed (negotiated) charge, if known">
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                            <input type="number" min={0} inputMode="numeric" className={`${fieldClass} pl-7`} value={c.allowedCharge} onChange={(e) => updateClaim(c.id, { allowedCharge: e.target.value })} />
                          </div>
                        </Field>
                        <Field label="Network status">
                          <select className={fieldClass} value={c.networkStatus} onChange={(e) => updateClaim(c.id, { networkStatus: e.target.value as NetworkStatus })}>
                            <option value="unknown">Not sure</option>
                            <option value="in-network">In-network</option>
                            <option value="out-of-network">Out-of-network</option>
                          </select>
                        </Field>
                      </div>
                    </details>
                    {travelerClaims.length > 1 && (
                      <button type="button" onClick={() => removeClaim(c.id)} className="text-xs font-bold text-ink-400 hover:text-ink-600">
                        Remove this claim
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addClaim(t.id)} className="text-xs font-bold text-brand-600 hover:text-brand-700">
                  + Add another claim for {t.label}
                </button>
              </InputCard>
            );
          })}
          <WizardActions onBack={back} onNext={next} nextDisabled={engineClaims.length === 0} />
        </div>
      )}

      {/* ---- Step 3: Insurance ---- */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Step 3 of 4 — Insurance</p>
            <div className="flex gap-1.5">
              {(["basic", "advanced"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setDetailMode(m);
                    trackVisitorInsuranceEvent("calculator_mode_selected", { tool_slug: TOOL_SLUG, mode: m });
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${detailMode === m ? "bg-brand-600 text-white" : "border border-ink-900/15 bg-white text-ink-600"}`}
                >
                  {m === "basic" ? "Basic" : "Advanced"}
                </button>
              ))}
            </div>
          </div>
          {detailMode === "basic" ? (
            <p className="text-xs text-ink-500">A handful of plain-English questions. Don&rsquo;t know an answer? Say so — we&rsquo;ll never guess a number for you.</p>
          ) : (
            <p className="text-xs text-ink-500">Every certificate-level field this engine supports, for when you have the actual policy document in hand.</p>
          )}
          {detailMode === "basic" ? (
            <BasicInsuranceQuestions value={policyForm} onChange={(v) => { markStarted(); setPolicyForm(v); }} />
          ) : (
            <PolicyTermsForm value={policyForm} onChange={(v) => { markStarted(); setPolicyForm(v); }} sections={POLICY_SECTIONS} />
          )}
          <WizardActions onBack={back} onNext={next} nextLabel="See results →" nextDisabled={!hasEnoughToCalculate} />
        </div>
      )}

      {/* ---- Step 4: Results ---- */}
      {step === 3 && (
        <div className="space-y-4">
          {!household ? (
            <ResultCard tone="info" eyebrow="Waiting on inputs" title="Enter a premium and at least one medical bill">
              <p>Fill in the plan&rsquo;s premium and at least one expected medical bill to see the estimate.</p>
            </ResultCard>
          ) : (
            <>
              <FamilyBreakdown household={household} travelerLabels={travelerLabels} />
              {travelers.map((t) => {
                const results = household.perClaimant[t.id] ?? [];
                if (results.length === 0) return null;
                return (
                  <div key={t.id} className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{t.label}</p>
                    {results.map((r, i) => (
                      <ClaimResultPanel key={i} result={r} policy={policy} premiumCents={i === 0 && travelers.length === 1 ? household.aggregatePremiumCents : undefined} billedChargeCents={r.claim.billedChargeCents} />
                    ))}
                  </div>
                );
              })}
              <PrintShareBar toolSlug={TOOL_SLUG} summaryText={summaryText} onReset={reset} comparePlanHref="/tools/visitor-insurance-plan-comparison" />
            </>
          )}
          <button type="button" onClick={back} className="rounded-xl border border-ink-900/15 bg-white px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50">
            ← Edit inputs
          </button>
        </div>
      )}
    </div>
  );
}
