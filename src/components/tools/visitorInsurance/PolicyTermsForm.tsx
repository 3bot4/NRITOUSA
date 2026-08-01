"use client";

import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import { COST_SHARING_PRESETS, type PolicyFormState } from "./policyFormState";

/** Bigger label + bigger input for the handful of fields that carry the most weight in a comparison. */
function BigLabel({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink-900">{label}</span>
      <div className="mt-1.5">{children}</div>
      {help && <span className="mt-1 block text-xs text-ink-400">{help}</span>}
    </label>
  );
}

function MoneyField({ label, help, value, onChange, big = false }: { label: string; help?: string; value: string; onChange: (v: string) => void; big?: boolean }) {
  const input = (
    <div className="relative">
      <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 ${big ? "text-lg" : "text-sm"}`}>$</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="0"
        className={big ? `${fieldClass} h-12 pl-8 text-lg font-bold text-ink-900` : `${fieldClass} pl-7`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
  return big ? (
    <BigLabel label={label} help={help}>{input}</BigLabel>
  ) : (
    <Field label={label} help={help}>{input}</Field>
  );
}

function PercentField({ label, help, value, onChange, big = false }: { label: string; help?: string; value: string; onChange: (v: string) => void; big?: boolean }) {
  const input = (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        placeholder="0"
        className={big ? `${fieldClass} h-12 pr-8 text-lg font-bold text-ink-900` : `${fieldClass} pr-7`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 ${big ? "text-lg" : "text-sm"}`}>%</span>
    </div>
  );
  return big ? (
    <BigLabel label={label} help={help}>{input}</BigLabel>
  ) : (
    <Field label={label} help={help}>{input}</Field>
  );
}

export type PolicyFormSection = "planType" | "premium" | "network" | "deductible" | "costSharing" | "policyLimits" | "outOfPocket" | "scheduledBenefits" | "advanced";

const DEFAULT_SECTIONS: PolicyFormSection[] = ["planType", "premium", "network", "deductible", "costSharing", "policyLimits", "outOfPocket", "advanced"];

/**
 * Compact by design: a handful of essential fields are always visible; every
 * certificate-level detail (frequency/scope, cost-sharing order, per-incident
 * max, out-of-pocket-maximum countsToward flags, scheduled benefits, ER/evac
 * rules) lives inside ONE collapsed "More policy details" section instead of
 * five-plus separate always-open cards. Redesigned after user feedback that
 * the previous all-sections-open layout was long with no guidance.
 */
export default function PolicyTermsForm({
  value,
  onChange,
  sections = DEFAULT_SECTIONS,
  idPrefix = "",
}: {
  value: PolicyFormState;
  onChange: (next: PolicyFormState) => void;
  sections?: PolicyFormSection[];
  idPrefix?: string;
}) {
  const set = <K extends keyof PolicyFormState>(key: K) => (v: PolicyFormState[K]) => onChange({ ...value, [key]: v });
  const has = (s: PolicyFormSection) => sections.includes(s);
  const isFixed = value.planType === "fixed-benefit";

  return (
    <div className="space-y-3">
      <InputCard eyebrow={`${idPrefix}Plan terms`} title="Enter the numbers from your quote">
        <Field label="Plan label">
          <input type="text" className={fieldClass} value={value.label} onChange={(e) => set("label")(e.target.value)} />
        </Field>

        {has("planType") && (
          <Field label="Plan type" help="Comprehensive uses deductible/coinsurance. Fixed-benefit pays a flat scheduled amount per service.">
            <select className={fieldClass} value={value.planType} onChange={(e) => set("planType")(e.target.value as PolicyFormState["planType"])}>
              <option value="comprehensive">Comprehensive</option>
              <option value="fixed-benefit">Fixed-benefit / scheduled</option>
              <option value="hybrid">Hybrid (mix of both)</option>
            </select>
          </Field>
        )}

        {has("premium") && <MoneyField big label="Premium" value={value.premium} onChange={set("premium")} />}

        {has("network") && (
          <Field label="Network type">
            <select className={fieldClass} value={value.networkType} onChange={(e) => set("networkType")(e.target.value as PolicyFormState["networkType"])}>
              <option value="unknown">Not sure</option>
              <option value="PPO">PPO network</option>
              <option value="none-stated">No network stated</option>
            </select>
          </Field>
        )}

        {has("deductible") && !isFixed && <MoneyField big label="Deductible amount" value={value.deductibleAmount} onChange={set("deductibleAmount")} />}

        {has("costSharing") && !isFixed && (
          <PercentField big label="Coinsurance — your share (in-network)" help="E.g. 20 for an 80/20 split." value={value.coinsuranceInNetworkPct} onChange={set("coinsuranceInNetworkPct")} />
        )}

        {has("policyLimits") && <MoneyField big label="Policy maximum" value={value.policyMaxAmount} onChange={set("policyMaxAmount")} />}

        {has("outOfPocket") && (
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={value.oopMaxEnabled} onChange={(e) => set("oopMaxEnabled")(e.target.checked)} />
            My certificate states a true out-of-pocket maximum
          </label>
        )}
        {has("outOfPocket") && value.oopMaxEnabled && <MoneyField label="Out-of-pocket maximum amount" value={value.oopMaxAmount} onChange={set("oopMaxAmount")} />}
      </InputCard>

      <details className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
        <summary className="cursor-pointer text-sm font-bold text-ink-800">More policy details (frequency, order, sublimits, ER rules…)</summary>
        <div className="mt-4 space-y-5">
          {has("premium") && (
            <Field label="Premium applies to">
              <select className={fieldClass} value={value.premiumScope} onChange={(e) => set("premiumScope")(e.target.value as PolicyFormState["premiumScope"])}>
                <option value="per-traveler">Per traveler (multiply by number of travelers)</option>
                <option value="per-policy">The whole policy (already covers everyone)</option>
              </select>
            </Field>
          )}

          {has("deductible") && !isFixed && (
            <div className="space-y-3 border-t border-ink-900/5 pt-4 first:border-0 first:pt-0">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Deductible details</p>
              <Field label="Deductible applies">
                <select className={fieldClass} value={value.deductibleFrequency} onChange={(e) => set("deductibleFrequency")(e.target.value as PolicyFormState["deductibleFrequency"])}>
                  <option value="policy">Once per policy period</option>
                  <option value="incident">Per incident (each new medical event)</option>
                  <option value="service">Per service category</option>
                </select>
              </Field>
              <Field label="Deductible scope (household)" help="Only change this if your certificate explicitly says so.">
                <select className={fieldClass} value={value.deductibleScope} onChange={(e) => set("deductibleScope")(e.target.value as PolicyFormState["deductibleScope"])}>
                  <option value="individual">Individual — each traveler has their own</option>
                  <option value="shared-family">Shared family deductible — one pool for everyone</option>
                  <option value="embedded-individual">Embedded individual — each has their own, within a family total</option>
                </select>
              </Field>
              {value.deductibleScope !== "individual" && <MoneyField label="Family / shared deductible total" value={value.deductibleFamilyAmount} onChange={set("deductibleFamilyAmount")} />}
            </div>
          )}

          {has("costSharing") && !isFixed && (
            <div className="space-y-3 border-t border-ink-900/5 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Cost-sharing order &amp; copay</p>
              <Field label="How the certificate applies copay/deductible/coinsurance" help="Different policy documents apply these in different orders — never assume.">
                <select className={fieldClass} value={value.costSharingPreset} onChange={(e) => set("costSharingPreset")(e.target.value as PolicyFormState["costSharingPreset"])}>
                  {COST_SHARING_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </Field>
              {value.costSharingPreset.includes("copay") && <MoneyField label="Copay amount" value={value.copayAmount} onChange={set("copayAmount")} />}
              {value.costSharingPreset.includes("coinsurance") && (
                <PercentField label="Coinsurance — your share (out-of-network)" value={value.coinsuranceOutOfNetworkPct} onChange={set("coinsuranceOutOfNetworkPct")} />
              )}
            </div>
          )}

          {has("policyLimits") && (
            <div className="space-y-3 border-t border-ink-900/5 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Policy &amp; incident limits</p>
              <Field label="Policy maximum scope">
                <select className={fieldClass} value={value.policyMaxScope} onChange={(e) => set("policyMaxScope")(e.target.value as PolicyFormState["policyMaxScope"])}>
                  <option value="individual">Individual — per traveler</option>
                  <option value="shared">Shared across the whole policy</option>
                </select>
              </Field>
              <MoneyField label="Per-incident maximum, if stated" value={value.perIncidentMax} onChange={set("perIncidentMax")} />
            </div>
          )}

          {has("outOfPocket") && value.oopMaxEnabled && (
            <div className="space-y-3 border-t border-ink-900/5 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Out-of-pocket maximum details</p>
              <Field label="Scope">
                <select className={fieldClass} value={value.oopMaxScope} onChange={(e) => set("oopMaxScope")(e.target.value as PolicyFormState["oopMaxScope"])}>
                  <option value="individual">Individual</option>
                  <option value="shared-family">Shared family</option>
                </select>
              </Field>
              <fieldset className="space-y-1.5 text-sm text-ink-700">
                <legend className="mb-1 text-xs font-semibold text-ink-800">What counts toward it?</legend>
                {([
                  ["oopCountsDeductible", "Deductible"],
                  ["oopCountsCopay", "Copay"],
                  ["oopCountsCoinsurance", "Coinsurance"],
                  ["oopCountsOutOfNetwork", "Out-of-network spending"],
                  ["oopCountsNonCovered", "Non-covered services"],
                ] as [keyof PolicyFormState, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input type="checkbox" checked={Boolean(value[key])} onChange={(e) => set(key)(e.target.checked as PolicyFormState[typeof key])} />
                    {label}
                  </label>
                ))}
              </fieldset>
            </div>
          )}

          {(value.planType === "fixed-benefit" || value.planType === "hybrid") && has("scheduledBenefits") && (
            <div className="space-y-3 border-t border-ink-900/5 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Scheduled benefits (flat payment per service)</p>
              <MoneyField label="Physician visit" value={value.scheduledPhysician} onChange={set("scheduledPhysician")} />
              <MoneyField label="Urgent care" value={value.scheduledUrgentCare} onChange={set("scheduledUrgentCare")} />
              <MoneyField label="Emergency room" value={value.scheduledEr} onChange={set("scheduledEr")} />
              <MoneyField label="Hospital admission (per day or total, as stated)" value={value.scheduledHospitalAdmission} onChange={set("scheduledHospitalAdmission")} />
            </div>
          )}

          {has("advanced") && (
            <div className="space-y-3 border-t border-ink-900/5 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Coinsurance limits &amp; ER / evacuation rules</p>
              <MoneyField label="Coinsurance threshold (100% above this amount), if stated" value={value.coinsuranceThreshold} onChange={set("coinsuranceThreshold")} />
              <MoneyField label="Coinsurance cap (max you can owe in coinsurance), if stated" value={value.coinsuranceCap} onChange={set("coinsuranceCap")} />
              <MoneyField label="ER-specific copay, if different from the general copay" value={value.erCopay} onChange={set("erCopay")} />
              <MoneyField label="ER-specific deductible, if stated" value={value.erDeductible} onChange={set("erDeductible")} />
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={value.erWaivedIfAdmitted} onChange={(e) => set("erWaivedIfAdmitted")(e.target.checked)} />
                ER charge is waived if admitted to the hospital
              </label>
              <MoneyField label="Medical evacuation maximum, if stated" value={value.evacuationMax} onChange={set("evacuationMax")} />
              <MoneyField label="Repatriation maximum, if stated" value={value.repatriationMax} onChange={set("repatriationMax")} />
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
