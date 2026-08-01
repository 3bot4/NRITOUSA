"use client";

/**
 * Deductible & Coinsurance Calculator (/tools/visitor-insurance-deductible-coinsurance-calculator).
 *
 * Focused on ONE traveler, a sequence of claims, so the deductible-frequency
 * behavior (per policy vs per incident vs per service) is visible across
 * claims — not just a single-claim snapshot. Uses the same shared engine as
 * every other calculator in the cluster.
 */
import { useEffect, useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { runClaimsForClaimant } from "@/lib/calc/visitorInsurance/engine";
import { SERVICE_CATEGORIES, type Claim, type Claimant, type ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import PolicyTermsForm, { type PolicyFormSection } from "@/components/tools/visitorInsurance/PolicyTermsForm";
import { BLANK_POLICY_FORM, toPolicyTerms, type PolicyFormState } from "@/components/tools/visitorInsurance/policyFormState";
import ClaimResultPanel from "@/components/tools/visitorInsurance/ClaimResultPanel";
import PrintShareBar from "@/components/tools/visitorInsurance/PrintShareBar";
import IconSegmentedSelect from "@/components/tools/visitorInsurance/IconSegmentedSelect";
import { SERVICE_CATEGORY_ICONS } from "@/components/tools/visitorInsurance/shared";
import { formatUsd } from "@/lib/format";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "visitor-insurance-deductible-coinsurance-calculator";
const STORAGE_KEY = "nritousa.visitorInsuranceDeductibleCoinsurance.v1";
const SECTIONS: PolicyFormSection[] = ["deductible", "costSharing", "policyLimits"];
const claimant: Claimant = { id: "traveler" };
const SERVICE_OPTIONS = SERVICE_CATEGORIES.map((s) => ({ value: s.value, label: s.label, icon: SERVICE_CATEGORY_ICONS[s.value] }));

const PRESETS: { key: string; label: string; patch: Partial<PolicyFormState> }[] = [
  { key: "zero-deductible", label: "$0 deductible", patch: { deductibleAmount: "0" } },
  { key: "250-deductible", label: "$250 deductible", patch: { deductibleAmount: "250" } },
  { key: "80-20", label: "80/20 coinsurance", patch: { costSharingPreset: "deductible-coinsurance", coinsuranceInNetworkPct: "20" } },
  { key: "90-10", label: "90/10 coinsurance", patch: { costSharingPreset: "deductible-coinsurance", coinsuranceInNetworkPct: "10" } },
  { key: "100-after-deductible", label: "100% after deductible", patch: { costSharingPreset: "deductible-coinsurance", coinsuranceInNetworkPct: "0" } },
  { key: "copay-before", label: "Copay before deductible", patch: { costSharingPreset: "copay-deductible-coinsurance", copayAmount: "50" } },
  { key: "copay-after", label: "Copay after deductible", patch: { costSharingPreset: "deductible-copay-coinsurance", copayAmount: "50" } },
];

function defaultClaim(n: number, incidentId?: string): Claim & { id: string } {
  return {
    id: `c${n}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    claimantId: claimant.id,
    incidentId,
    serviceCategory: "physician",
    billedChargeCents: dollarsToCents(500),
    networkStatus: "in-network",
    coverageEligibility: "covered",
    date: undefined,
  };
}

export default function VisitorInsuranceDeductibleCoinsuranceCalculator() {
  const [policyForm, setPolicyForm] = useState<PolicyFormState>({
    ...BLANK_POLICY_FORM,
    deductibleAmount: "250",
    deductibleFrequency: "policy",
    costSharingPreset: "deductible-coinsurance",
    coinsuranceInNetworkPct: "20",
  });
  const [claims, setClaims] = useState<(Claim & { id: string })[]>([defaultClaim(1)]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { policyForm: PolicyFormState; claims: (Claim & { id: string })[] };
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
      // ignore
    }
  }, [policyForm, claims, started]);

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      trackVisitorInsuranceEvent("calculator_start", { tool_slug: TOOL_SLUG });
    }
  };

  const applyPreset = (key: string) => {
    markStarted();
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    trackVisitorInsuranceEvent("scenario_selected", { tool_slug: TOOL_SLUG, scenario_key: key });
    setPolicyForm((p) => ({ ...p, ...preset.patch }));
  };

  const updateClaim = (id: string, patch: Partial<Claim>) => {
    markStarted();
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const addClaim = () => {
    markStarted();
    if (claims.length >= 4) return;
    setClaims((p) => [...p, defaultClaim(p.length + 1, policyForm.deductibleFrequency === "incident" ? undefined : undefined)]);
  };
  const removeClaim = (id: string) => setClaims((p) => (p.length > 1 ? p.filter((c) => c.id !== id) : p));

  const policy = useMemo(() => toPolicyTerms(policyForm), [policyForm]);
  const results = useMemo(() => runClaimsForClaimant(policy, claimant, claims), [policy, claims]);

  useEffect(() => {
    if (results.length) trackVisitorInsuranceEvent("calculation_complete", { tool_slug: TOOL_SLUG });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.length, policyForm.deductibleAmount, policyForm.coinsuranceInNetworkPct]);

  const reset = () => {
    setPolicyForm({ ...BLANK_POLICY_FORM, deductibleAmount: "250", deductibleFrequency: "policy", costSharingPreset: "deductible-coinsurance", coinsuranceInNetworkPct: "20" });
    setClaims([defaultClaim(1)]);
    setStarted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const summaryText = useMemo(() => {
    const lines = [
      "VISITOR INSURANCE DEDUCTIBLE & COINSURANCE — EDUCATIONAL ESTIMATE",
      "(NRI to USA · nritousa.com — educational only)",
      "",
      `Deductible: ${formatUsd(dollarsToCents(policyForm.deductibleAmount) / 100)} (${policyForm.deductibleFrequency})`,
      `Coinsurance: ${policyForm.coinsuranceInNetworkPct || "0"}% member share`,
      "",
      ...results.map((r, i) => `Claim ${i + 1} (${r.claim.serviceCategory}, ${formatUsd(r.claim.billedChargeCents / 100)}): insurer pays ${formatUsd(r.insurerPaymentCents / 100)}, you owe ${formatUsd(r.memberLiability.totalCents / 100)}`),
    ];
    return lines.join("\n");
  }, [results, policyForm]);

  return (
    <div className="space-y-6">
      <p className="text-xs font-medium text-amber-700">Starting numbers below are an illustrative example — edit every field to match your own certificate.</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-ink-600">Quick presets:</span>
        {PRESETS.map((p) => (
          <button key={p.key} type="button" onClick={() => applyPreset(p.key)} className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100">
            {p.label}
          </button>
        ))}
        <button type="button" onClick={reset} className="rounded-lg border border-ink-900/15 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50">
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <PolicyTermsForm value={policyForm} onChange={(v) => { markStarted(); setPolicyForm(v); }} sections={SECTIONS} />

          <InputCard eyebrow="Claims" title="One or more medical bills, in order">
            <p className="text-xs text-ink-500 mb-2">
              Add more than one claim to see how a {policyForm.deductibleFrequency === "incident" ? "per-incident" : policyForm.deductibleFrequency === "service" ? "per-service" : "per-policy"} deductible behaves across a sequence of bills. Give claims the
              same &ldquo;incident&rdquo; label to model separate bills from one event.
            </p>
            {claims.map((c, i) => (
              <div key={c.id} className="mb-3 space-y-3 rounded-xl border border-ink-900/10 p-3">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-ink-700">Claim {i + 1} service</p>
                  <IconSegmentedSelect options={SERVICE_OPTIONS} value={c.serviceCategory} onChange={(v) => updateClaim(c.id, { serviceCategory: v })} compact />
                </div>
                <Field label="Billed charge">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-ink-400">$</span>
                    <input type="number" min={0} inputMode="numeric" className={`${fieldClass} h-12 pl-8 text-lg font-bold text-ink-900`} value={c.billedChargeCents / 100} onChange={(e) => updateClaim(c.id, { billedChargeCents: dollarsToCents(e.target.value) })} />
                  </div>
                </Field>
                {policyForm.deductibleFrequency === "incident" && (
                  <Field label="Incident label (claims sharing a label share one deductible)">
                    <input type="text" className={fieldClass} placeholder={`incident-${i + 1}`} value={c.incidentId ?? ""} onChange={(e) => updateClaim(c.id, { incidentId: e.target.value || undefined })} />
                  </Field>
                )}
                {claims.length > 1 && (
                  <button type="button" onClick={() => removeClaim(c.id)} className="text-xs font-bold text-ink-400 hover:text-ink-600">
                    Remove claim {i + 1}
                  </button>
                )}
              </div>
            ))}
            {claims.length < 4 && (
              <button type="button" onClick={addClaim} className="text-xs font-bold text-brand-600 hover:text-brand-700">
                + Add another claim
              </button>
            )}
          </InputCard>
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {results.length === 0 ? (
            <ResultCard tone="info" eyebrow="Waiting on inputs" title="Add a claim to see the numbered calculation">
              <p>Enter a billed charge above.</p>
            </ResultCard>
          ) : (
            <>
              {results.map((r, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Claim {i + 1}</p>
                  <ClaimResultPanel result={r} policy={policy} billedChargeCents={r.claim.billedChargeCents} />
                </div>
              ))}
              <PrintShareBar toolSlug={TOOL_SLUG} summaryText={summaryText} onReset={reset} comparePlanHref="/tools/visitor-insurance-plan-comparison" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
