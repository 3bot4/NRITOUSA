"use client";

import QuickPickBands from "./QuickPickBands";
import { DEDUCTIBLE_BANDS, COINSURANCE_BANDS, POLICY_MAX_BANDS } from "./shared";
import type { PolicyFormState } from "./policyFormState";

/**
 * Natural-language question set that edits the SAME PolicyFormState the
 * full manual form (PolicyTermsForm, "Advanced mode") edits — Basic and
 * Advanced are two different UIs over one shared state, not two separate
 * data models. "Not sure" always clears the field rather than guessing; the
 * engine treats an unset field honestly (flags it, never invents a value).
 */
export default function BasicInsuranceQuestions({ value, onChange }: { value: PolicyFormState; onChange: (next: PolicyFormState) => void }) {
  const set = <K extends keyof PolicyFormState>(key: K) => (v: PolicyFormState[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-ink-900">Is this plan a flat scheduled-benefit plan, or does it work like typical health insurance?</p>
        <p className="mt-0.5 text-xs text-ink-500">Most visitor plans work like typical insurance (a deductible, then a percentage split). A scheduled plan instead pays a fixed dollar amount per service.</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:max-w-md">
          {(
            [
              { value: "comprehensive" as const, label: "Works like typical insurance", sub: "Deductible + percentage split" },
              { value: "fixed-benefit" as const, label: "Pays a flat amount per service", sub: "Scheduled-benefit plan" },
            ]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("planType")(opt.value)}
              className={`rounded-xl border-2 p-3 text-left transition ${value.planType === opt.value ? "border-brand-500 bg-brand-50" : "border-ink-900/10 bg-white hover:border-brand-200"}`}
            >
              <p className={`text-xs font-bold ${value.planType === opt.value ? "text-brand-800" : "text-ink-800"}`}>{opt.label}</p>
              <p className="mt-0.5 text-[0.7rem] text-ink-400">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-ink-900">Roughly what did you pay for the policy?</p>
        <div className="relative mt-1.5 max-w-[200px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-ink-400">$</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className="h-12 w-full rounded-xl border border-ink-900/10 bg-white pl-8 text-lg font-bold text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={value.premium}
            onChange={(e) => set("premium")(e.target.value)}
          />
        </div>
      </div>

      {value.planType !== "fixed-benefit" && (
        <>
          <QuickPickBands
            question="Roughly what's the deductible?"
            help="The amount you generally pay before the plan starts sharing costs. Pick the closest, or say you're not sure."
            bands={DEDUCTIBLE_BANDS}
            value={value.deductibleAmount}
            onChange={set("deductibleAmount")}
          />
          <QuickPickBands
            question="After the deductible, how does the plan split the bill?"
            help="This is your certificate's coinsurance split."
            bands={COINSURANCE_BANDS}
            value={value.coinsuranceInNetworkPct}
            onChange={(v) => onChange({ ...value, coinsuranceInNetworkPct: v, costSharingPreset: v === "" ? value.costSharingPreset : "deductible-coinsurance" })}
          />
        </>
      )}

      <QuickPickBands
        question="What's the total coverage amount (policy maximum)?"
        help="The most the plan will pay in total — usually printed on the first page of the certificate."
        bands={POLICY_MAX_BANDS}
        value={value.policyMaxAmount}
        onChange={set("policyMaxAmount")}
      />

      <details className="rounded-xl border border-ink-900/10 bg-white p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink-700">A few more questions (optional)</summary>
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-ink-700">Does the certificate mention a true out-of-pocket maximum?</p>
            <div className="mt-1.5 flex gap-2">
              {[
                { label: "Yes", v: true },
                { label: "No / not sure", v: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange({ ...value, oopMaxEnabled: opt.v })}
                  className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold ${value.oopMaxEnabled === opt.v ? "border-brand-500 bg-brand-50 text-brand-800" : "border-ink-900/10 bg-white text-ink-600"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {value.oopMaxEnabled && (
            <div className="relative max-w-[200px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                className="h-10 w-full rounded-xl border border-ink-900/10 bg-white pl-7 text-sm font-bold text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                value={value.oopMaxAmount}
                onChange={(e) => set("oopMaxAmount")(e.target.value)}
              />
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
