"use client";

/**
 * Pre-Existing Condition & Acute-Onset policy-language analyzer UI
 * (embedded on /visitor-insurance/pre-existing-conditions-acute-onset).
 *
 * This is an educational POLICY-LANGUAGE workflow, not a medical coverage
 * checker — it never accepts a diagnosis as input and its output type
 * (AnalyzerOutcome) cannot express a coverage verdict. See
 * src/lib/calc/visitorInsurance/preExistingAnalyzer.ts.
 */
import { useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { dollarsToCents } from "@/lib/calc/visitorInsurance/money";
import { analyzePreExistingLanguage, ANALYZER_OUTCOME_TEXT, type AnalyzerOutcome, type PreExistingAnalyzerInput } from "@/lib/calc/visitorInsurance/preExistingAnalyzer";
import { trackVisitorInsuranceEvent } from "@/lib/analytics";

const TOOL_SLUG = "pre-existing-conditions-acute-onset-analyzer";

type TriState = "unknown" | "yes" | "no";
const toBool = (v: TriState): boolean | undefined => (v === "unknown" ? undefined : v === "yes");

interface FormState {
  hasExclusion: TriState;
  mentionsAcuteOnset: TriState;
  acuteOnsetMaximum: string;
  insuredAge: string;
  ageCutoff: string;
  describedAsSuddenAndUnexpected: TriState;
  treatmentRecommendedOrScheduledBeforeCoverage: TriState;
  medicationChangedRecently: TriState;
  conditionWasUnstable: TriState;
  serviceIsEmergencyCare: TriState;
  ongoingOrRoutineCareExcluded: TriState;
  evacuationIncludedUnderAcuteOnset: TriState;
  termUndefinedOrAmbiguous: TriState;
  quotedProvision: string;
}

const BLANK: FormState = {
  hasExclusion: "unknown",
  mentionsAcuteOnset: "unknown",
  acuteOnsetMaximum: "",
  insuredAge: "",
  ageCutoff: "",
  describedAsSuddenAndUnexpected: "unknown",
  treatmentRecommendedOrScheduledBeforeCoverage: "unknown",
  medicationChangedRecently: "unknown",
  conditionWasUnstable: "unknown",
  serviceIsEmergencyCare: "unknown",
  ongoingOrRoutineCareExcluded: "unknown",
  evacuationIncludedUnderAcuteOnset: "unknown",
  termUndefinedOrAmbiguous: "unknown",
  quotedProvision: "",
};

const OUTCOME_TONE: Record<AnalyzerOutcome, "positive" | "attention" | "caution" | "neutral" | "info"> = {
  "may-be-considered": "positive",
  "appears-excluded": "attention",
  "more-information-required": "caution",
  "certificate-must-be-reviewed": "caution",
  "cannot-be-determined": "neutral",
};
const OUTCOME_DOT: Record<AnalyzerOutcome, string> = {
  "may-be-considered": "bg-emerald-500",
  "appears-excluded": "bg-rose-500",
  "more-information-required": "bg-amber-500",
  "certificate-must-be-reviewed": "bg-amber-500",
  "cannot-be-determined": "bg-rose-400",
};

const TRI_OPTIONS: { value: TriState; label: string }[] = [
  { value: "unknown", label: "Not sure" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

/** Large segmented buttons instead of a dropdown — matches the cluster's icon-card input language. */
function TriSelect({ label, help, value, onChange }: { label: string; help?: string; value: TriState; onChange: (v: TriState) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink-800">{label}</p>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={label}>
        {TRI_OPTIONS.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border-2 py-2 text-xs font-bold transition ${
                selected ? "border-brand-500 bg-brand-50 text-brand-800" : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-200"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {help && <p className="mt-1 text-xs text-ink-400">{help}</p>}
    </div>
  );
}

export default function VisitorInsurancePreExistingAnalyzer() {
  const [form, setForm] = useState<FormState>(BLANK);
  const [ran, setRan] = useState(false);
  const set = <K extends keyof FormState>(k: K) => (v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  const input: PreExistingAnalyzerInput = {
    hasExclusion: toBool(form.hasExclusion),
    mentionsAcuteOnset: toBool(form.mentionsAcuteOnset),
    acuteOnsetMaximumCents: form.acuteOnsetMaximum ? dollarsToCents(form.acuteOnsetMaximum) : undefined,
    insuredAge: form.insuredAge ? Number(form.insuredAge) : undefined,
    ageCutoff: form.ageCutoff ? Number(form.ageCutoff) : undefined,
    describedAsSuddenAndUnexpected: toBool(form.describedAsSuddenAndUnexpected),
    treatmentRecommendedOrScheduledBeforeCoverage: toBool(form.treatmentRecommendedOrScheduledBeforeCoverage),
    medicationChangedRecently: toBool(form.medicationChangedRecently),
    conditionWasUnstable: toBool(form.conditionWasUnstable),
    serviceIsEmergencyCare: toBool(form.serviceIsEmergencyCare),
    ongoingOrRoutineCareExcluded: toBool(form.ongoingOrRoutineCareExcluded),
    evacuationIncludedUnderAcuteOnset: toBool(form.evacuationIncludedUnderAcuteOnset),
    termUndefinedOrAmbiguous: toBool(form.termUndefinedOrAmbiguous),
    quotedProvision: form.quotedProvision || undefined,
  };

  const result = ran ? analyzePreExistingLanguage(input) : null;

  const run = () => {
    setRan(true);
    trackVisitorInsuranceEvent("calculation_complete", { tool_slug: TOOL_SLUG });
  };
  const reset = () => {
    setForm(BLANK);
    setRan(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
        This tool reads <strong>policy language you enter</strong> — it does not know your medical history and never determines whether a diagnosis is covered. Do not enter a diagnosis name; answer only about what the certificate says and the circumstances of the
        event.
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <InputCard eyebrow="The certificate" title="What does your policy say?">
            <TriSelect label="Does the certificate exclude pre-existing conditions?" value={form.hasExclusion} onChange={(v) => { set("hasExclusion")(v); trackVisitorInsuranceEvent("calculator_start", { tool_slug: TOOL_SLUG }); }} />
            <TriSelect label="Does it mention acute onset of a pre-existing condition?" value={form.mentionsAcuteOnset} onChange={set("mentionsAcuteOnset")} />
            <Field label="Exact acute-onset benefit maximum, if stated">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                <input type="number" min={0} inputMode="numeric" className={`${fieldClass} pl-7`} value={form.acuteOnsetMaximum} onChange={(e) => set("acuteOnsetMaximum")(e.target.value)} />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Insured person's age">
                <input type="number" min={0} max={120} inputMode="numeric" className={fieldClass} value={form.insuredAge} onChange={(e) => set("insuredAge")(e.target.value)} />
              </Field>
              <Field label="Acute-onset age cutoff, if stated">
                <input type="number" min={0} max={120} inputMode="numeric" className={fieldClass} value={form.ageCutoff} onChange={(e) => set("ageCutoff")(e.target.value)} />
              </Field>
            </div>
            <TriSelect label="Is the term undefined or ambiguous in the certificate?" value={form.termUndefinedOrAmbiguous} onChange={set("termUndefinedOrAmbiguous")} />
          </InputCard>

          <InputCard eyebrow="The event" title="Circumstances (not a diagnosis)">
            <TriSelect label="Is the event described as sudden and unexpected?" value={form.describedAsSuddenAndUnexpected} onChange={set("describedAsSuddenAndUnexpected")} />
            <TriSelect label="Was treatment recommended or scheduled before coverage started?" value={form.treatmentRecommendedOrScheduledBeforeCoverage} onChange={set("treatmentRecommendedOrScheduledBeforeCoverage")} />
            <TriSelect label="Was medication changed recently?" value={form.medicationChangedRecently} onChange={set("medicationChangedRecently")} />
            <TriSelect label="Was the condition unstable before the event?" value={form.conditionWasUnstable} onChange={set("conditionWasUnstable")} />
            <TriSelect label="Is the service being claimed emergency care?" value={form.serviceIsEmergencyCare} onChange={set("serviceIsEmergencyCare")} />
            <TriSelect label="Does the certificate exclude ongoing or routine care under this provision?" value={form.ongoingOrRoutineCareExcluded} onChange={set("ongoingOrRoutineCareExcluded")} />
            <TriSelect label="Is medical evacuation included under the acute-onset benefit?" value={form.evacuationIncludedUnderAcuteOnset} onChange={set("evacuationIncludedUnderAcuteOnset")} />
          </InputCard>

          <InputCard eyebrow="Exact wording" title="Paste the provision (optional)">
            <Field label="Quote the exact certificate wording you're evaluating" help="Shown beside the result so you can double-check the analyzer against your own certificate.">
              <textarea className={`${fieldClass} min-h-[90px]`} value={form.quotedProvision} onChange={(e) => set("quotedProvision")(e.target.value)} />
            </Field>
          </InputCard>

          <div className="flex gap-2">
            <button type="button" onClick={run} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
              Analyze this policy language
            </button>
            <button type="button" onClick={reset} className="rounded-lg border border-ink-900/15 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50">
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {!result ? (
            <ResultCard tone="info" eyebrow="Waiting" title="Answer the questions and click Analyze">
              <p>The result will be one of five fixed educational labels — never a coverage guarantee.</p>
            </ResultCard>
          ) : (
            <>
              <ResultCard tone={OUTCOME_TONE[result.outcome]} eyebrow="Educational result" title={ANALYZER_OUTCOME_TEXT[result.outcome]}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-500">
                  <span aria-hidden className={`h-2.5 w-2.5 flex-none rounded-full ${OUTCOME_DOT[result.outcome]}`} />
                  Policy-language signal
                </div>
                <ul className="list-disc space-y-1.5 pl-5">
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </ResultCard>
              {result.quotedProvision && (
                <ResultCard tone="neutral" eyebrow="Your quoted provision" title="What you entered">
                  <p className="whitespace-pre-wrap italic text-ink-700">&ldquo;{result.quotedProvision}&rdquo;</p>
                </ResultCard>
              )}
              <ResultCard tone="caution" eyebrow="Read before you rely on this" title="What this result does not guarantee">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Medical necessity determination</li>
                  <li>Claim approval</li>
                  <li>Policy interpretation by the insurer</li>
                  <li>Final insurer reimbursement</li>
                </ul>
                <p className="mt-2 text-xs">Claims and benefit determinations are made by the insurer or administrator, not by this tool.</p>
              </ResultCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
