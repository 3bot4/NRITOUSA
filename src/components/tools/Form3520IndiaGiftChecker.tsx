"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  ASSET_TYPE_OPTIONS,
  DONOR_RELATIONSHIP_OPTIONS,
  DONOR_TYPE_OPTIONS,
  EMPTY_INPUTS,
  INTERNAL_LINKS,
  RECEIVED_IN_OPTIONS,
  VALUE_BAND_OPTIONS,
  YES_NO_UNSURE,
  evaluate,
  type Form3520Inputs,
  type YesNoUnsure,
} from "@/lib/form3520Checker";

/* Privacy by design: every answer below lives only in React state in the
   user's browser. There is no backend call and no storage — analytics only
   ever receives a broad result label, never any of the inputs. */

const TONE_MAP: Record<string, ResultTone> = {
  info: "info",
  positive: "positive",
  caution: "caution",
  attention: "attention",
};

/** Segmented Yes / No / Not sure control. */
function YesNoField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: YesNoUnsure | "";
  onChange: (v: YesNoUnsure) => void;
}) {
  return (
    <Field label={label} help={help}>
      <div className="grid grid-cols-3 gap-2">
        {YES_NO_UNSURE.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export default function Form3520IndiaGiftChecker() {
  const [inputs, setInputs] = useState<Form3520Inputs>(EMPTY_INPUTS);
  const result = useMemo(() => evaluate(inputs), [inputs]);

  // Fire one analytics event per distinct result type, only once ready.
  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.resultType) return;
    lastTracked.current = result.resultType;
    trackToolUsed({
      tool_name: "form-3520-india-gift-checker",
      result_type: result.resultType,
      category: "tax-compliance",
      page_slug: "/tools/form-3520-india-gift-checker",
    });
  }, [result.ready, result.resultType]);

  const set = <K extends keyof Form3520Inputs>(
    key: K,
    value: Form3520Inputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <ToolLayout
      inputs={
        <InputCard
          eyebrow="Your situation"
          title="Tell us about the gift or inheritance"
        >
          <YesNoField
            label="Are you a US person for tax purposes?"
            help="US citizen, green-card holder, or resident under the substantial-presence test."
            value={inputs.usPerson}
            onChange={(v) => set("usPerson", v)}
          />

          <Field
            label="Who gave you the money / property?"
            help="Your relationship to the giver (matters for India's gift exemption)."
          >
            <select
              className={fieldClass}
              value={inputs.donorRelationship}
              onChange={(e) =>
                set(
                  "donorRelationship",
                  e.target.value as Form3520Inputs["donorRelationship"]
                )
              }
            >
              <option value="">Select…</option>
              {DONOR_RELATIONSHIP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Was the giver an individual/estate or a company/partnership/trust?"
            help="The Form 3520 threshold depends on this."
          >
            <select
              className={fieldClass}
              value={inputs.donorType}
              onChange={(e) =>
                set("donorType", e.target.value as Form3520Inputs["donorType"])
              }
            >
              <option value="">Select donor type…</option>
              {DONOR_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Approximate value in USD"
            help="Total from this donor type for the year. Aggregate, not per wire."
          >
            <select
              className={fieldClass}
              value={inputs.valueBand}
              onChange={(e) =>
                set("valueBand", e.target.value as Form3520Inputs["valueBand"])
              }
            >
              <option value="">Select a value band…</option>
              {VALUE_BAND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="What was it?"
            help="Cash, property, mutual funds, shares, gold, or a business interest."
          >
            <select
              className={fieldClass}
              value={inputs.assetType}
              onChange={(e) =>
                set("assetType", e.target.value as Form3520Inputs["assetType"])
              }
            >
              <option value="">Select asset type…</option>
              {ASSET_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Where was it received?"
            help="An Indian account adds FBAR/FATCA and repatriation steps."
          >
            <select
              className={fieldClass}
              value={inputs.receivedIn}
              onChange={(e) =>
                set("receivedIn", e.target.value as Form3520Inputs["receivedIn"])
              }
            >
              <option value="">Select…</option>
              {RECEIVED_IN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <YesNoField
            label="Did it generate income?"
            help="Interest, dividends, rent, or capital gains after you received it."
            value={inputs.generatedIncome}
            onChange={(v) => set("generatedIncome", v)}
          />

          <button
            type="button"
            onClick={() => setInputs(EMPTY_INPUTS)}
            className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
          >
            Reset
          </button>
        </InputCard>
      }
      results={
        result.ready ? (
          <div className="space-y-6">
            {result.flags.map((flag) => (
              <ResultCard
                key={flag.key}
                tone={TONE_MAP[flag.tone]}
                eyebrow="Review flag"
                title={flag.label}
                badge={flag.badge}
              >
                {flag.lines.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </ResultCard>
            ))}

            {result.documents.length > 0 && (
              <ResultCard
                tone="info"
                eyebrow="Gather these"
                title="Documents to collect"
              >
                <ul className="space-y-1.5">
                  {result.documents.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span aria-hidden className="text-brand-500">
                        ✓
                      </span>
                      <span className="text-ink-600">{d}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            )}

            {result.questions.length > 0 && (
              <ResultCard
                tone="neutral"
                eyebrow="Take these to your CPA / CA"
                title="Questions to ask"
              >
                <ul className="space-y-1.5">
                  {result.questions.map((q) => (
                    <li key={q} className="flex gap-2">
                      <span aria-hidden className="text-brand-500">
                        ?
                      </span>
                      <span className="text-ink-600">{q}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            )}

            <ResultCard
              tone="neutral"
              eyebrow="Keep going"
              title="Related guides & tools"
            >
              <ul className="space-y-1.5">
                {INTERNAL_LINKS.map((l) => (
                  <li key={l.href} className="flex gap-2">
                    <span aria-hidden className="text-brand-500">
                      →
                    </span>
                    <Link
                      href={l.href}
                      className="font-medium text-brand-600 hover:text-brand-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </ResultCard>
          </div>
        ) : (
          <ResultCard
            tone="info"
            eyebrow="Likely review flags"
            title="Answer a few questions to begin"
            badge="Fill in the form"
          >
            <p>
              Tell us whether you&apos;re a US person, who gave it, the donor
              type, the approximate value, and what it was — to see your Form
              3520, FBAR/FATCA, and PFIC review flags, the documents to collect,
              and questions for your CPA and CA.
            </p>
          </ResultCard>
        )
      }
    />
  );
}
