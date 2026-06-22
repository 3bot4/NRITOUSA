"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  AMOUNT_OPTIONS,
  EMPTY_INPUTS,
  INTERNAL_LINKS,
  SOURCE_OPTIONS,
  YES_NO_UNSURE,
  evaluate,
  type AmountBand,
  type Form15Inputs,
  type YesNoUnsure,
} from "@/lib/form15Checklist";

/* Privacy by design: every answer lives only in React state in the user's
   browser. There is no backend call and no storage — analytics only ever
   receives a broad result label, never any of the inputs. */

const TONE_MAP: Record<string, ResultTone> = {
  info: "info",
  positive: "positive",
  caution: "caution",
  attention: "attention",
};

const CA_REVIEW_LABEL: Record<string, string> = {
  "strongly-recommended": "Strongly recommended",
  recommended: "Recommended",
  "likely-lighter": "Often lighter",
};

const CA_REVIEW_TONE: Record<string, ResultTone> = {
  "strongly-recommended": "attention",
  recommended: "caution",
  "likely-lighter": "positive",
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

export default function Form15Checklist() {
  const [inputs, setInputs] = useState<Form15Inputs>(EMPTY_INPUTS);
  const result = useMemo(() => evaluate(inputs), [inputs]);

  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.resultType) return;
    lastTracked.current = result.resultType;
    trackToolUsed({
      tool_name: "form-15ca-15cb-checklist",
      result_type: result.resultType,
      category: "tax-compliance",
      page_slug: "/tools/form-15ca-15cb-checklist",
    });
  }, [result.ready, result.resultType]);

  const set = <K extends keyof Form15Inputs>(key: K, value: Form15Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <ToolLayout
      inputs={
        <InputCard eyebrow="Your remittance" title="Tell us about the money">
          <Field
            label="What is the source of the money?"
            help="Where the funds in the account actually came from."
          >
            <select
              className={fieldClass}
              value={inputs.source}
              onChange={(e) =>
                set("source", e.target.value as Form15Inputs["source"])
              }
            >
              <option value="">Select source…</option>
              {SOURCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <YesNoField
            label="Is the money taxable in India?"
            help="If unsure, that's fine — your CA can confirm."
            value={inputs.taxableInIndia}
            onChange={(v) => set("taxableInIndia", v)}
          />

          <YesNoField
            label="Has TDS already been deducted?"
            value={inputs.tdsDeducted}
            onChange={(v) => set("tdsDeducted", v)}
          />

          <Field
            label="Is the amount over ₹5 lakh this financial year?"
            help="A commonly-cited threshold; verify the current limit with your CA."
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {AMOUNT_OPTIONS.map((o) => {
                const active = inputs.amountBand === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("amountBand", o.value as AmountBand)}
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

          <YesNoField
            label="Is there an AO certificate / order for this payment?"
            help="An order/certificate from the Assessing Officer, if obtained."
            value={inputs.aoCertificate}
            onChange={(v) => set("aoCertificate", v)}
          />

          <YesNoField
            label="Are Form 26AS / AIS and bank proof available?"
            value={inputs.recordsReady}
            onChange={(v) => set("recordsReady", v)}
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
        <div className="space-y-6">
          <ResultCard
            tone={TONE_MAP[result.tone]}
            eyebrow="Likely next step"
            title={result.headline}
            badge={result.badge}
          >
            {result.notes.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </ResultCard>

          {result.ready && (
            <ResultCard
              tone={CA_REVIEW_TONE[result.caReview]}
              eyebrow="CA review"
              title="Is a CA review recommended?"
              badge={CA_REVIEW_LABEL[result.caReview]}
            >
              <p>{result.caReviewNote}</p>
              <p className="text-xs text-ink-400">
                This checklist never decides your Form 15CA part or whether a
                15CB is required — confirm that with your CA and bank.
              </p>
            </ResultCard>
          )}

          {result.ready && result.documents.length > 0 && (
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

          <ResultCard
            tone="neutral"
            eyebrow="Keep going"
            title="Related guides, tools & calculators"
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
      }
    />
  );
}
