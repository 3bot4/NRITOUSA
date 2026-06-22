"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  EMPTY_INPUTS,
  INCOME_TYPE_OPTIONS,
  INTERNAL_LINKS,
  YES_NO_UNSURE,
  evaluate,
  type TdsChecklistInputs,
  type YesNoUnsure,
} from "@/lib/tdsRefundChecklist";

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

export default function NriTdsRefundChecklist() {
  const [inputs, setInputs] = useState<TdsChecklistInputs>(EMPTY_INPUTS);
  const result = useMemo(() => evaluate(inputs), [inputs]);

  // Fire one analytics event per distinct result type, only once ready.
  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.resultType) return;
    lastTracked.current = result.resultType;
    trackToolUsed({
      tool_name: "nri-tds-refund-checklist",
      result_type: result.resultType,
      category: "tax-compliance",
      page_slug: "/tools/nri-tds-refund-checklist",
    });
  }, [result.ready, result.resultType]);

  const set = <K extends keyof TdsChecklistInputs>(
    key: K,
    value: TdsChecklistInputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <ToolLayout
      inputs={
        <InputCard eyebrow="Your situation" title="Tell us about your India income">
          <Field
            label="Income type"
            help="What kind of Indian income had (or may have had) TDS deducted?"
          >
            <select
              className={fieldClass}
              value={inputs.incomeType}
              onChange={(e) =>
                set("incomeType", e.target.value as TdsChecklistInputs["incomeType"])
              }
            >
              <option value="">Select income type…</option>
              {INCOME_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <YesNoField
            label="Was TDS deducted on this income?"
            help="Check your bank/buyer/tenant statement or Form 26AS."
            value={inputs.tdsDeducted}
            onChange={(v) => set("tdsDeducted", v)}
          />

          <YesNoField
            label="Does the TDS match Form 26AS / AIS?"
            help="Does the deducted amount show against your PAN in 26AS / AIS?"
            value={inputs.recordsMatch}
            onChange={(v) => set("recordsMatch", v)}
          />

          <YesNoField
            label="Is your PAN active?"
            help="An inoperative PAN blocks refunds and raises TDS rates."
            value={inputs.panActive}
            onChange={(v) => set("panActive", v)}
          />

          <YesNoField
            label="Do you have DTAA documents (Form 10F + TRC)?"
            help="Needed to claim a reduced India–US treaty rate."
            value={inputs.dtaaDocs}
            onChange={(v) => set("dtaaDocs", v)}
          />

          <YesNoField
            label="Have you filed your Indian ITR for the year?"
            value={inputs.itrFiled}
            onChange={(v) => set("itrFiled", v)}
          />

          <YesNoField
            label="Have you received the refund?"
            value={inputs.refundReceived}
            onChange={(v) => set("refundReceived", v)}
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
            eyebrow="Likely next review step"
            title={result.nextStepTitle}
            badge={result.badge}
          >
            {result.nextStep.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </ResultCard>

          {result.ready && result.documents.length > 0 && (
            <ResultCard tone="info" eyebrow="Gather these" title="Your document checklist">
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

          {result.ready && result.caQuestions.length > 0 && (
            <ResultCard tone="neutral" eyebrow="Take these to your CA" title="Questions to ask">
              <ul className="space-y-1.5">
                {result.caQuestions.map((q) => (
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

          <ResultCard tone="neutral" eyebrow="Keep going" title="Related guides & tools">
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
