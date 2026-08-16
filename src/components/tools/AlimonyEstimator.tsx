"use client";

/**
 * Alimony / maintenance estimator — US state guideline vs Indian benchmark.
 *
 * All arithmetic lives in @/lib/calc/alimonyEstimate (pure + unit-tested).
 * This component only collects inputs, validates them, and formats output.
 *
 * Two deliberate design choices worth keeping:
 *
 *  1. The exchange rate is an INPUT, not a hidden constant. The India column
 *     scales linearly with it, so a rate that quietly goes stale silently
 *     distorts the entire US-vs-India comparison — the one thing this tool
 *     exists to show. The default comes from the site's own market snapshot
 *     and is stated on screen.
 *
 *  2. Eligibility is rendered BEFORE the figure, not as a footnote. Texas
 *     screens out most marriages under ten years entirely, and a tool that
 *     prints "$3,000/month" over that fact is worse than no tool.
 */

import { useMemo, useState } from "react";
import {
  estimateAlimony,
  NET_OF_TAX_SHARE,
  type AlimonyJurisdiction,
} from "@/lib/calc/alimonyEstimate";
import { validateAll, USD_AMOUNT, FX_USD_INR, type FieldSpec } from "@/lib/calc/validation";
import { DEFAULT_USD_INR } from "@/data/divorceImmigrationData";

type FieldKey = "higher" | "lower" | "years" | "fx";

const SPECS: Record<FieldKey, FieldSpec> = {
  higher: { label: "Higher earner's gross annual income", ...USD_AMOUNT },
  lower: { label: "Lower earner's gross annual income", ...USD_AMOUNT },
  years: { label: "Years married", min: 0, max: 70 },
  fx: { label: "USD to INR rate", ...FX_USD_INR, fallback: DEFAULT_USD_INR },
};

const JURISDICTIONS: { value: AlimonyJurisdiction; label: string }[] = [
  { value: "AAML", label: "Other state (AAML benchmark)" },
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
];

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Indian numbering: crore above 1e7, lakh above 1e5, else grouped rupees. */
function inr(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n / 1e7 >= 10 ? 1 : 2)} cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n / 1e5 >= 10 ? 1 : 2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

const eligibilityChip: Record<string, { text: string; cls: string }> = {
  guideline: {
    text: "Threshold met",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  "screened-out": {
    text: "Likely not eligible",
    cls: "border-rose-200 bg-rose-50 text-rose-800",
  },
  discretionary: {
    text: "Discretionary — no statutory gate",
    cls: "border-amber-200 bg-amber-50 text-amber-900",
  },
};

export default function AlimonyEstimator() {
  const [raw, setRaw] = useState<Record<FieldKey, string>>({
    higher: "180000",
    lower: "0",
    years: "9",
    fx: String(DEFAULT_USD_INR),
  });
  const [jurisdiction, setJurisdiction] = useState<AlimonyJurisdiction>("AAML");
  const [childSupport, setChildSupport] = useState(false);

  const { values, errors, ok } = useMemo(() => validateAll(raw, SPECS), [raw]);

  const result = useMemo(
    () =>
      ok
        ? estimateAlimony({
            higherGrossAnnualUsd: values.higher,
            lowerGrossAnnualUsd: values.lower,
            yearsMarried: values.years,
            jurisdiction,
            payorPaysChildSupport: childSupport,
            usdInr: values.fx,
          })
        : null,
    [ok, values, jurisdiction, childSupport],
  );

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setRaw((r) => ({ ...r, [k]: e.target.value }));

  const inputCls = (k: FieldKey) =>
    `w-full rounded-lg border px-3 py-2.5 text-[15px] text-ink-900 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-600 ${
      errors[k] ? "border-rose-400 bg-rose-50/40" : "border-ink-900/15 bg-white"
    }`;

  const labelCls = "mb-1.5 block text-xs font-semibold text-ink-600";

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
      <div className="border-b border-ink-900/10 bg-slate-50/80 px-5 py-4">
        <h3 className="text-base font-bold text-ink-900">
          Illustrative alimony &amp; maintenance comparison
        </h3>
        <p className="mt-1 text-xs text-ink-500">
          A US state guideline benchmark alongside a reference point drawn from Indian case
          law — for the same couple. Nothing you type leaves your browser.
        </p>
      </div>

      {/*
        The "this is not a prediction" notice sits ABOVE the inputs as well as
        beside the result. A disclaimer that only appears after the number has
        already been read is doing very little work.
      */}
      <p
        role="note"
        className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs font-semibold leading-relaxed text-amber-900"
      >
        <span aria-hidden>⚠️ </span>
        Illustrative only — NOT a prediction of what a court will award. Actual support depends
        on jurisdiction, income, assets, needs, duration of marriage, applicable law, and the
        facts of the case.
      </p>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="al-higher">
            Higher earner — gross annual (USD)
          </label>
          <input
            id="al-higher"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={raw.higher}
            onChange={set("higher")}
            aria-invalid={Boolean(errors.higher)}
            aria-describedby={errors.higher ? "al-higher-err" : undefined}
            className={inputCls("higher")}
          />
          {errors.higher && (
            <p id="al-higher-err" className="mt-1 text-xs font-medium text-rose-700">
              {errors.higher}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor="al-lower">
            Lower earner — gross annual (USD)
          </label>
          <input
            id="al-lower"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={raw.lower}
            onChange={set("lower")}
            aria-invalid={Boolean(errors.lower)}
            aria-describedby={errors.lower ? "al-lower-err" : undefined}
            className={inputCls("lower")}
          />
          {errors.lower && (
            <p id="al-lower-err" className="mt-1 text-xs font-medium text-rose-700">
              {errors.lower}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor="al-years">
            Years married
          </label>
          <input
            id="al-years"
            type="number"
            inputMode="decimal"
            min={0}
            max={70}
            step={0.5}
            value={raw.years}
            onChange={set("years")}
            aria-invalid={Boolean(errors.years)}
            aria-describedby={errors.years ? "al-years-err" : undefined}
            className={inputCls("years")}
          />
          {errors.years && (
            <p id="al-years-err" className="mt-1 text-xs font-medium text-rose-700">
              {errors.years}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls} htmlFor="al-state">
            State handling the divorce
          </label>
          <select
            id="al-state"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value as AlimonyJurisdiction)}
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2.5 text-[15px] text-ink-900 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-600"
          >
            {JURISDICTIONS.map((j) => (
              <option key={j.value} value={j.value}>
                {j.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="al-fx">
            USD → INR rate
          </label>
          <input
            id="al-fx"
            type="number"
            inputMode="decimal"
            min={1}
            step={0.01}
            value={raw.fx}
            onChange={set("fx")}
            aria-invalid={Boolean(errors.fx)}
            aria-describedby={errors.fx ? "al-fx-err" : "al-fx-help"}
            className={inputCls("fx")}
          />
          {errors.fx ? (
            <p id="al-fx-err" className="mt-1 text-xs font-medium text-rose-700">
              {errors.fx}
            </p>
          ) : (
            <p id="al-fx-help" className="mt-1 text-xs text-ink-400">
              The India column moves with this. Change it to test a scenario.
            </p>
          )}
        </div>

        {jurisdiction === "NY" && (
          <div className="flex items-end">
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-ink-900/15 bg-white px-3 py-2.5">
              <input
                type="checkbox"
                checked={childSupport}
                onChange={(e) => setChildSupport(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none accent-brand-600"
              />
              <span className="text-xs leading-snug text-ink-700">
                The payor is also the non-custodial parent paying child support
                <span className="mt-0.5 block text-ink-400">
                  New York uses a different formula when this is true.
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* ---------------- Results ---------------- */}
      <div className="border-t border-ink-900/10 bg-slate-50/50 px-5 py-5">
        {!result ? (
          <p className="text-sm font-medium text-rose-700">
            Fix the highlighted fields above to see an estimate. The tool will not compute a
            figure from an input it could not read — a confident number built on junk is worse
            than no number.
          </p>
        ) : (
          <>
            <p className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              Both figures below are mathematical benchmarks, not legal entitlements and not
              predicted court awards.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* US column */}
              <div className="rounded-xl border border-ink-900/10 bg-white p-4">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                  Illustrative U.S. support benchmark
                </p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">
                  {usd(result.usMonthlyUsd)}
                  <span className="text-base font-bold text-ink-400">/mo</span>
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {result.usFormulaLabel} · {result.usDurationLabel}
                </p>
                <span
                  className={`mt-2.5 inline-block rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold ${
                    eligibilityChip[result.usEligibility].cls
                  }`}
                >
                  {eligibilityChip[result.usEligibility].text}
                </span>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-600">
                  {result.usEligibilityNote}
                </p>
              </div>

              {/* India column */}
              <div className="rounded-xl border border-ink-900/10 bg-white p-4">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
                  Illustrative Indian maintenance reference point
                </p>
                {/*
                  The "25% is not a statutory formula" qualification sits BEFORE
                  the number, not after it. Placed below, it reads as a footnote
                  to a figure the user has already taken as authoritative.
                */}
                <p className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-2 text-[0.6875rem] font-semibold leading-relaxed text-amber-900">
                  India has no statutory maintenance formula. The Supreme Court of India referred
                  to 25% of net salary as a just-and-proper figure in a particular case
                  (<em>Kalyan Dey Chowdhury</em>, 2017); Indian courts decide on the facts and
                  circumstances of each case.
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
                  {inr(result.indiaMonthlyInr)}
                  <span className="text-base font-bold text-ink-400">/mo</span>
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  ≈ {usd(result.indiaMonthlyUsd)}/mo · illustrative one-time settlement range{" "}
                  {inr(result.indiaLumpSumLowInr)}–{inr(result.indiaLumpSumHighInr)}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-600">
                  This applies that 25% reference to net income, reduced for the lower
                  earner&rsquo;s own income. Indian courts may consider a spouse&rsquo;s actual US
                  income and earning capacity when determining maintenance, depending on the facts
                  and applicable law (see <em>Rajnesh v. Neha</em>, 2020, on disclosure of assets
                  and income).
                </p>
              </div>
            </div>

            <p className="mt-4 border-t border-ink-900/10 pt-3.5 text-xs leading-relaxed text-ink-600">
              <strong className="text-ink-800">Reading the gap.</strong>{" "}
              {result.comparison === "neither" &&
                "The incomes are too close for either system to order support on these inputs."}
              {result.comparison === "us-higher" &&
                `On these inputs the US benchmark is about ${
                  result.ratio ? `${result.ratio}×` : "well above"
                } the Indian reference point. Where that gap exists, the two spouses often have opposing interests in which forum hears the case, so the choice of where to file can be contested.`}
              {result.comparison === "india-higher" &&
                "On these inputs the Indian reference point sits above the US benchmark, which tends to happen where a statutory cap or eligibility limit constrains the US figure while the Indian reference keeps scaling with income."}
              {result.comparison === "similar" &&
                "The two sit within about 25% of each other on these inputs, so a choice of forum would likely turn on speed, cost, custody and enforceability rather than on the amount."}{" "}
              Assumes {Math.round(NET_OF_TAX_SHARE * 100)}% of gross income is net of tax and ₹
              {values.fx} to the dollar. Excludes child support, property division, retirement
              accounts and QDROs, Indian real estate, NRE/NRO balances and stridhan.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
