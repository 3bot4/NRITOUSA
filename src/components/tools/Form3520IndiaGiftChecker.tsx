"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { fieldClass } from "@/components/tools/InputCard";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import { formatDate } from "@/lib/format";
import { latestForm3520TaxYear, form3520TaxYears } from "@/data/foreignGiftRules";
import {
  ASSET_TYPE_OPTIONS,
  DONOR_RELATIONSHIP_OPTIONS,
  EMPTY_INPUTS,
  HELD_WHERE_OPTIONS,
  INTERNAL_LINKS,
  SOURCE_CATEGORY_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  YES_NO_UNSURE,
  evaluate,
  type Form3520Inputs,
  type YesNoUnsure,
} from "@/lib/form3520Checker";

/* Privacy by design: every answer below lives only in React state in the
   user's browser. There is no backend call and no storage — analytics only
   ever receives a broad, categorical result label, NEVER the entered amount. */

const TONE_MAP: Record<string, ResultTone> = {
  info: "info",
  positive: "positive",
  caution: "caution",
  attention: "attention",
};

/** Segmented Yes / No / Not sure control with a proper group label. */
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
  const labelId = useId();
  return (
    <div role="group" aria-labelledby={labelId}>
      <span id={labelId} className="text-xs font-semibold text-ink-800">
        {label}
      </span>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {YES_NO_UNSURE.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
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
      {help && <span className="mt-1 block text-xs text-ink-400">{help}</span>}
    </div>
  );
}

/** A labelled <select> wired with htmlFor/id. */
function SelectField<T extends string>({
  label,
  help,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  help?: string;
  value: T | "";
  placeholder: string;
  options: { value: T; label: string }[];
  onChange: (v: T | "") => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-ink-800">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={id}
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(e.target.value as T | "")}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {help && <span className="mt-1 block text-xs text-ink-400">{help}</span>}
    </div>
  );
}

/** Render "1,234,567" from a number for the amount input. */
const formatWithCommas = (n: number | null): string =>
  n === null ? "" : n.toLocaleString("en-US");

export default function Form3520IndiaGiftChecker() {
  const [inputs, setInputs] = useState<Form3520Inputs>({
    ...EMPTY_INPUTS,
    taxYear: latestForm3520TaxYear,
  });
  const result = useMemo(() => evaluate(inputs), [inputs]);
  const amountId = useId();
  const amountErrId = useId();

  // Fire one analytics event per distinct (categorical) result type, once ready.
  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.resultType) return;
    lastTracked.current = result.resultType;
    trackToolUsed({
      tool_name: "form-3520-india-gift-checker",
      result_type: result.resultType, // categorical only — no financial amount
      category: "tax-compliance",
      page_slug: "/tools/form-3520-india-gift-checker",
    });
  }, [result.ready, result.resultType]);

  const set = <K extends keyof Form3520Inputs>(
    key: K,
    value: Form3520Inputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  const reset = () =>
    setInputs({ ...EMPTY_INPUTS, taxYear: latestForm3520TaxYear });

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    set("aggregateUsd", digits === "" ? null : Number(digits));
  };

  const usPersonNeedsMore =
    inputs.usPerson === "yes" || inputs.usPerson === "";

  return (
    <ToolLayout
      inputs={
        <InputCard
          eyebrow="Your situation"
          title="Tell us about the gift or inheritance"
        >
          <SelectField
            label="Tax year the amount was received"
            help="US Form 3520 is measured by your US tax year (calendar year for most individuals)."
            value={String(inputs.taxYear)}
            placeholder="Select a tax year…"
            options={form3520TaxYears.map((y) => ({
              value: String(y),
              label: String(y),
            }))}
            onChange={(v) => set("taxYear", v ? Number(v) : latestForm3520TaxYear)}
          />

          <YesNoField
            label="Are you a US person for tax purposes?"
            help="US citizen, green-card holder, or resident under the substantial-presence test. Visa type alone does not decide this."
            value={inputs.usPerson}
            onChange={(v) => set("usPerson", v)}
          />

          {usPersonNeedsMore && (
            <>
              <SelectField
                label="What kind of transaction was it?"
                help="A foreign-trust distribution follows a different rule from a gift or bequest."
                value={inputs.transactionType}
                placeholder="Select transaction type…"
                options={TRANSACTION_TYPE_OPTIONS}
                onChange={(v) => set("transactionType", v)}
              />

              <SelectField
                label="Who was the source?"
                help="The Form 3520 threshold depends on this — individual, estate, corporation, partnership, or trust."
                value={inputs.sourceCategory}
                placeholder="Select the source…"
                options={SOURCE_CATEGORY_OPTIONS}
                onChange={(v) => set("sourceCategory", v)}
              />

              <SelectField
                label="Your relationship to the source (optional)"
                help="Matters for India's gift exemption, not for the US threshold."
                value={inputs.relationship}
                placeholder="Select…"
                options={DONOR_RELATIONSHIP_OPTIONS}
                onChange={(v) => set("relationship", v)}
              />

              <div>
                <label
                  htmlFor={amountId}
                  className="text-xs font-semibold text-ink-800"
                >
                  Aggregate value in USD (total from this source this year)
                </label>
                <div className="mt-1">
                  <div className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
                    <span aria-hidden className="text-sm text-ink-400">
                      $
                    </span>
                    <input
                      id={amountId}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      disabled={!inputs.amountKnown}
                      aria-describedby={amountErrId}
                      placeholder="e.g. 150,000"
                      value={formatWithCommas(inputs.aggregateUsd)}
                      onChange={(e) => onAmountChange(e.target.value)}
                      className="min-h-[44px] w-full bg-transparent py-2.5 text-sm text-ink-900 outline-none disabled:text-ink-300"
                    />
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs text-ink-500">
                  <input
                    type="checkbox"
                    checked={!inputs.amountKnown}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        amountKnown: !e.target.checked,
                        aggregateUsd: e.target.checked ? null : prev.aggregateUsd,
                      }))
                    }
                    className="h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500/30"
                  />
                  I don&apos;t know the exact amount yet
                </label>
                <span
                  id={amountErrId}
                  role="alert"
                  className="mt-1 block text-xs text-ink-400"
                >
                  {inputs.amountKnown
                    ? "Aggregate across all wires for the year — the test is on the total, not per transfer."
                    : "We'll show which threshold applies and what to gather; add the amount later for a clearer result."}
                </span>
              </div>

              <YesNoField
                label="Did related donors also contribute?"
                help="Related donors (e.g. both parents) are combined into one aggregate."
                value={inputs.relatedDonors}
                onChange={(v) => set("relatedDonors", v)}
              />

              <SelectField
                label="What was it?"
                help="Cash, property, mutual funds, shares, gold, or a business interest."
                value={inputs.assetType}
                placeholder="Select asset type…"
                options={ASSET_TYPE_OPTIONS}
                onChange={(v) => set("assetType", v)}
              />

              <SelectField
                label="Where was it received / held?"
                help="An Indian account adds FBAR/FATCA and possible repatriation steps."
                value={inputs.heldWhere}
                placeholder="Select…"
                options={HELD_WHERE_OPTIONS}
                onChange={(v) => set("heldWhere", v)}
              />

              <YesNoField
                label="Did it generate income after you received it?"
                help="Interest, dividends, rent, or capital gains are reportable going forward."
                value={inputs.generatedIncome}
                onChange={(v) => set("generatedIncome", v)}
              />
            </>
          )}

          <button
            type="button"
            onClick={reset}
            className="text-xs font-semibold text-ink-400 underline hover:text-ink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          >
            Reset
          </button>
        </InputCard>
      }
      results={
        result.ready ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Your screening result
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              >
                <span aria-hidden>🖨️</span> Print / save result
              </button>
            </div>

            {/* Primary Form 3520 result */}
            <ResultCard
              tone={TONE_MAP[result.primary.tone]}
              eyebrow="Primary Form 3520 result"
              title={result.primary.label}
              badge={result.primary.badge}
            >
              {result.primary.lines.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <dl className="mt-3 grid gap-x-4 gap-y-1.5 rounded-xl bg-ink-50/60 p-3 text-xs sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink-700">Threshold used</dt>
                  <dd className="text-ink-500">{result.primary.thresholdUsed}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-700">Tax year used</dt>
                  <dd className="text-ink-500">{result.primary.taxYearUsed}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-ink-700">
                    Related-donor treatment
                  </dt>
                  <dd className="text-ink-500">{result.relatedDonorTreatment}</dd>
                </div>
              </dl>
            </ResultCard>

            {/* Additional review flags */}
            {result.flags.map((flag) => (
              <ResultCard
                key={flag.key}
                tone={TONE_MAP[flag.tone]}
                eyebrow="Additional reporting flag"
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
                      <span className="text-ink-600">
                        <span className="sr-only">Document: </span>
                        {d}
                      </span>
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

            {/* Official sources — explained rule first, links here at the end */}
            <ResultCard
              tone="neutral"
              eyebrow="Verify against the official rules"
              title="Primary official sources"
            >
              <ul className="space-y-1.5">
                {result.officialLinks.map((l) => (
                  <li key={l.href} className="flex gap-2">
                    <span aria-hidden className="text-brand-500">
                      ↗
                    </span>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand-600 hover:text-brand-700"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-400">
                Rules last verified:{" "}
                <time dateTime={result.lastVerified}>
                  {formatDate(result.lastVerified)}
                </time>
                . This tool provides an educational screening result only. It
                does not determine whether you have a filing obligation and is
                not tax, legal or financial advice.
              </p>
            </ResultCard>

            {/* Related guides & tools */}
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
            eyebrow="Educational screening"
            title="Answer the questions to see your result"
            badge="Fill in the form"
          >
            <p>
              Tell us the tax year, whether you&apos;re a US person, the
              transaction and source type, the approximate aggregate value, and
              what you received — to see your Form 3520 result (with the exact
              threshold and tax year used), FBAR/FATCA and PFIC flags, the
              documents to collect, and questions for your CPA and CA.
            </p>
            <p className="text-xs text-ink-400">
              No names, account numbers, or personal data are collected, and no
              entered amount is ever sent to analytics.
            </p>
          </ResultCard>
        )
      }
    />
  );
}
