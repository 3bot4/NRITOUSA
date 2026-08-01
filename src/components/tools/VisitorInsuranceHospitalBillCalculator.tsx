"use client";

/**
 * Hospital & ER Bill Calculator (/tools/visitor-insurance-hospital-bill-calculator).
 *
 * Models a full episode of care as the SEPARATE bills it usually generates —
 * ambulance, ER facility, ER physician, imaging, lab, hospital room, ICU,
 * surgeon, anesthesiologist, prescriptions, follow-up visit — never combined
 * into one claim. All lines share one incidentId so a per-incident maximum
 * (if entered) is drawn down across them together, matching how a real
 * episode of care is usually adjudicated.
 */
import { useEffect, useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { formatUsd } from "@/lib/format";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { runClaimsForClaimant } from "@/lib/calc/visitorInsurance/engine";
import type { Claim, Claimant, NetworkStatus, ServiceCategory } from "@/lib/calc/visitorInsurance/types";
import PolicyTermsForm, { type PolicyFormSection } from "@/components/tools/visitorInsurance/PolicyTermsForm";
import { BLANK_POLICY_FORM, toPolicyTerms, type PolicyFormState } from "@/components/tools/visitorInsurance/policyFormState";
import ClaimResultPanel from "@/components/tools/visitorInsurance/ClaimResultPanel";
import PrintShareBar from "@/components/tools/visitorInsurance/PrintShareBar";
import { SERVICE_CATEGORY_ICONS } from "@/components/tools/visitorInsurance/shared";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "visitor-insurance-hospital-bill-calculator";
const STORAGE_KEY = "nritousa.visitorInsuranceHospitalBill.v1";
const SECTIONS: PolicyFormSection[] = ["deductible", "costSharing", "policyLimits", "advanced"];
const claimant: Claimant = { id: "traveler" };
const INCIDENT_ID = "hospital-episode-1";

interface EpisodeLine {
  key: string;
  label: string;
  category: ServiceCategory;
  included: boolean;
  billedUsd: string;
  networkStatus: NetworkStatus;
}

const DEFAULT_LINES: EpisodeLine[] = [
  { key: "ambulance", label: "Ambulance", category: "ambulance", included: false, billedUsd: "1200", networkStatus: "unknown" },
  { key: "er-facility", label: "ER facility", category: "er", included: true, billedUsd: "3500", networkStatus: "in-network" },
  { key: "er-physician", label: "ER physician (separate bill)", category: "physician", included: true, billedUsd: "800", networkStatus: "unknown" },
  { key: "imaging", label: "Diagnostic imaging", category: "imaging", included: true, billedUsd: "2200", networkStatus: "in-network" },
  { key: "lab", label: "Laboratory", category: "lab", included: true, billedUsd: "600", networkStatus: "in-network" },
  { key: "hospital-room", label: "Hospital room (admission)", category: "hospital-admission", included: false, billedUsd: "15000", networkStatus: "in-network" },
  { key: "icu", label: "ICU", category: "icu", included: false, billedUsd: "25000", networkStatus: "in-network" },
  { key: "surgeon", label: "Surgeon", category: "surgery", included: false, billedUsd: "8000", networkStatus: "unknown" },
  { key: "anesthesiologist", label: "Anesthesiologist (separate bill)", category: "surgery", included: false, billedUsd: "2500", networkStatus: "unknown" },
  { key: "prescriptions", label: "Prescriptions", category: "prescription", included: false, billedUsd: "300", networkStatus: "in-network" },
  { key: "follow-up", label: "Follow-up visit", category: "physician", included: false, billedUsd: "200", networkStatus: "in-network" },
];

export default function VisitorInsuranceHospitalBillCalculator() {
  const [policyForm, setPolicyForm] = useState<PolicyFormState>({ ...BLANK_POLICY_FORM, deductibleAmount: "500", costSharingPreset: "deductible-coinsurance", coinsuranceInNetworkPct: "20", policyMaxAmount: "100000" });
  const [lines, setLines] = useState<EpisodeLine[]>(DEFAULT_LINES);
  const [admitted, setAdmitted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { policyForm: PolicyFormState; lines: EpisodeLine[]; admitted: boolean };
      if (saved.policyForm) setPolicyForm(saved.policyForm);
      if (saved.lines?.length) setLines(saved.lines);
      if (saved.admitted !== undefined) setAdmitted(saved.admitted);
      // eslint-disable-next-line no-empty
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ policyForm, lines, admitted }));
    } catch {
      // ignore
    }
  }, [policyForm, lines, admitted, started]);

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      trackVisitorInsuranceEvent("calculator_start", { tool_slug: TOOL_SLUG });
    }
  };

  const updateLine = (key: string, patch: Partial<EpisodeLine>) => {
    markStarted();
    setLines((p) => p.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const policy = useMemo(() => toPolicyTerms(policyForm), [policyForm]);

  const claims: Claim[] = useMemo(
    () =>
      lines
        .filter((l) => l.included && l.billedUsd !== "")
        .map((l) => ({
          claimantId: claimant.id,
          incidentId: INCIDENT_ID,
          serviceCategory: l.category,
          billedChargeCents: dollarsToCents(l.billedUsd),
          networkStatus: l.networkStatus,
          coverageEligibility: "covered" as const,
          erAdmitted: l.category === "er" ? admitted : undefined,
        })),
    [lines, admitted]
  );

  const results = useMemo(() => (claims.length ? runClaimsForClaimant(policy, claimant, claims) : []), [policy, claims]);

  useEffect(() => {
    if (results.length) trackVisitorInsuranceEvent("calculation_complete", { tool_slug: TOOL_SLUG });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.length]);

  const totals = useMemo(
    () =>
      results.reduce(
        (acc, r) => ({
          billed: acc.billed + r.claim.billedChargeCents,
          insurer: acc.insurer + r.insurerPaymentCents,
          member: acc.member + r.memberLiability.totalCents,
        }),
        { billed: 0, insurer: 0, member: 0 }
      ),
    [results]
  );

  const reset = () => {
    setLines(DEFAULT_LINES);
    setAdmitted(false);
    setPolicyForm({ ...BLANK_POLICY_FORM, deductibleAmount: "500", costSharingPreset: "deductible-coinsurance", coinsuranceInNetworkPct: "20", policyMaxAmount: "100000" });
    setStarted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const summaryText = useMemo(() => {
    const lines2 = [
      "VISITOR INSURANCE HOSPITAL/ER EPISODE — EDUCATIONAL ESTIMATE",
      "(NRI to USA · nritousa.com — educational only)",
      "",
      ...results.map((r) => `${r.claim.serviceCategory}: billed ${formatUsd(r.claim.billedChargeCents / 100)}, insurer pays ${formatUsd(r.insurerPaymentCents / 100)}, you owe ${formatUsd(r.memberLiability.totalCents / 100)}`),
      "",
      `Episode total billed: ${formatUsd(totals.billed / 100)}`,
      `Episode total insurer payment: ${formatUsd(totals.insurer / 100)}`,
      `Episode total your liability: ${formatUsd(totals.member / 100)}`,
    ];
    return lines2.join("\n");
  }, [results, totals]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-900">
        A single hospital or ER visit usually generates <strong>several separate bills</strong> — the facility, the treating physician, imaging, lab, and any specialists are frequently billed independently, sometimes by different companies with different network
        status. This tool models each line item as its own claim rather than combining them into one number.
      </div>
      <p className="text-xs font-medium text-amber-700">Starting line items and amounts below are an illustrative example episode — edit them to match your own bills.</p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <PolicyTermsForm value={policyForm} onChange={(v) => { markStarted(); setPolicyForm(v); }} sections={SECTIONS} />

          <InputCard eyebrow="Episode of care" title="Which bills apply?">
            <label className="mb-2 flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={admitted} onChange={(e) => { markStarted(); setAdmitted(e.target.checked); }} />
              This ER visit resulted in hospital admission (tests the ER-charge-waived-if-admitted rule, if entered)
            </label>
            <div className="space-y-2">
              {lines.map((l) => (
                <div key={l.key} className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-900/10 p-2.5">
                  <label className="flex flex-1 min-w-[160px] items-center gap-2 text-sm font-medium text-ink-800">
                    <input type="checkbox" checked={l.included} onChange={(e) => updateLine(l.key, { included: e.target.checked })} />
                    <span aria-hidden>{SERVICE_CATEGORY_ICONS[l.category]}</span>
                    {l.label}
                  </label>
                  {l.included && (
                    <>
                      <div className="relative w-28">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-400">$</span>
                        <input type="number" min={0} inputMode="numeric" className={`${fieldClass} py-1.5 pl-6 text-xs`} value={l.billedUsd} onChange={(e) => updateLine(l.key, { billedUsd: e.target.value })} />
                      </div>
                      <select className={`${fieldClass} w-auto py-1.5 text-xs`} value={l.networkStatus} onChange={(e) => updateLine(l.key, { networkStatus: e.target.value as NetworkStatus })}>
                        <option value="unknown">Network: not sure</option>
                        <option value="in-network">In-network</option>
                        <option value="out-of-network">Out-of-network</option>
                      </select>
                    </>
                  )}
                </div>
              ))}
            </div>
          </InputCard>
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {results.length === 0 ? (
            <ResultCard tone="info" eyebrow="Waiting on inputs" title="Select at least one bill above">
              <p>Check the bills that apply to this episode of care and enter their billed charges.</p>
            </ResultCard>
          ) : (
            <>
              <ResultCard tone="neutral" eyebrow="Episode total" title="Every bill added together">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Total billed", value: totals.billed },
                    { label: "Total insurer payment", value: totals.insurer },
                    { label: "Total your liability", value: totals.member },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-ink-900/10 bg-slate-50/70 p-3 text-center">
                      <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">{s.label}</p>
                      <p className="mt-1 text-sm font-extrabold tabular-nums text-ink-900">{formatUsd(s.value / 100)}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>
              {results.map((r, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{lines.find((l) => l.category === r.claim.serviceCategory && l.included)?.label ?? r.claim.serviceCategory}</p>
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
