"use client";

import { useEffect, useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  estimateFicaRefund,
  estimateNonresidentRefund,
  runSubstantialPresenceTest,
  type StudentVisa,
} from "@/lib/calc/f1Tax";
import { indiaTreaty, taxConstants } from "@/data/studentClusterData";
import { formatUsd } from "@/lib/format";

/**
 * Three chained steps: residency → FICA recovery → refund estimate.
 *
 * State is mirrored into the query string (replaceState, no history spam) so
 * a shared link reopens the same scenario — the share block on the page picks
 * up window.location.href at click time. Nothing is stored or transmitted.
 */

const TAX_YEARS = [2026, 2025];

type Step = 1 | 2 | 3;

const num = (v: string, fallback = 0) => {
  const n = Number(v.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : fallback;
};

export default function F1TaxCalc() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — residency
  const [visa, setVisa] = useState<StudentVisa>("f1");
  const [arrivalYear, setArrivalYear] = useState("2022");
  const [taxYear, setTaxYear] = useState("2026");
  const [days0, setDays0] = useState("365");
  const [days1, setDays1] = useState("365");
  const [days2, setDays2] = useState("365");

  // Step 2 — FICA
  const [wages, setWages] = useState("35000");
  const [employerWithheld, setEmployerWithheld] = useState(false);
  const [exactWithheld, setExactWithheld] = useState("");

  // Step 3 — refund
  const [federalWithheld, setFederalWithheld] = useState("3200");
  const [isIndian, setIsIndian] = useState(true);

  const year = num(taxYear, 2026);

  const spt = useMemo(
    () =>
      runSubstantialPresenceTest({
        visa,
        firstArrivalYear: num(arrivalYear, 2022),
        taxYear: year,
        daysCurrentYear: num(days0),
        daysPriorYear: num(days1),
        daysSecondPriorYear: num(days2),
      }),
    [visa, arrivalYear, year, days0, days1, days2]
  );

  const fica = useMemo(
    () =>
      estimateFicaRefund({
        wages: num(wages),
        wasNonresident: !spt.isResident,
        employerWithheld,
        actualWithheldAmount: exactWithheld ? num(exactWithheld) : undefined,
      }),
    [wages, spt.isResident, employerWithheld, exactWithheld]
  );

  const refund = useMemo(
    () =>
      estimateNonresidentRefund({
        taxYear: year,
        wages: num(wages),
        federalWithheld: num(federalWithheld),
        claimIndiaTreaty: isIndian && !spt.isResident,
      }),
    [year, wages, federalWithheld, isIndian, spt.isResident]
  );

  // Keep the URL shareable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams({
      v: visa,
      a: arrivalYear,
      ty: taxYear,
      d0: days0,
      w: wages,
      fw: federalWithheld,
      in: isIndian ? "1" : "0",
      fica: employerWithheld ? "1" : "0",
    });
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [
    visa,
    arrivalYear,
    taxYear,
    days0,
    wages,
    federalWithheld,
    isIndian,
    employerWithheld,
  ]);

  // Restore from a shared link once, on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (!window.location.search) return;
    const set = (k: string, fn: (v: string) => void) => {
      const v = p.get(k);
      if (v !== null) fn(v);
    };
    set("v", (v) => setVisa(v as StudentVisa));
    set("a", setArrivalYear);
    set("ty", setTaxYear);
    set("d0", setDays0);
    set("w", setWages);
    set("fw", setFederalWithheld);
    set("in", (v) => setIsIndian(v === "1"));
    set("fica", (v) => setEmployerWithheld(v === "1"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StepTab = ({ n, label }: { n: Step; label: string }) => (
    <button
      type="button"
      onClick={() => setStep(n)}
      aria-current={step === n ? "step" : undefined}
      className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
        step === n
          ? "bg-brand-600 text-white shadow-sm"
          : "bg-white text-ink-500 hover:text-ink-900"
      }`}
    >
      <span className="block text-[0.625rem] font-semibold uppercase tracking-wide opacity-70">
        Step {n}
      </span>
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div
        role="tablist"
        aria-label="Calculator steps"
        className="mb-5 flex gap-1.5 rounded-2xl border border-ink-900/5 bg-ink-50/70 p-1.5"
      >
        <StepTab n={1} label="Residency" />
        <StepTab n={2} label="FICA refund" />
        <StepTab n={3} label="Refund estimate" />
      </div>

      {/* ─────────────────────────── Step 1 ─────────────────────────── */}
      {step === 1 && (
        <div id="residency" className="space-y-5">
          <InputCard
            eyebrow="Step 1"
            title="Are you a nonresident or a resident for tax purposes?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your status">
                <select
                  className={fieldClass}
                  value={visa}
                  onChange={(e) => setVisa(e.target.value as StudentVisa)}
                >
                  <option value="f1">F-1 student</option>
                  <option value="j1-student">J-1 student</option>
                  <option value="j1-scholar">J-1 scholar / researcher</option>
                </select>
              </Field>
              <Field
                label="Year you first arrived on this status"
                help="Calendar year, even if you arrived in December."
              >
                <input
                  className={fieldClass}
                  inputMode="numeric"
                  value={arrivalYear}
                  onChange={(e) => setArrivalYear(e.target.value)}
                />
              </Field>
              <Field label="Tax year you are filing for">
                <select
                  className={fieldClass}
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                >
                  {TAX_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`Days in the US during ${year}`}>
                <input
                  className={fieldClass}
                  inputMode="numeric"
                  value={days0}
                  onChange={(e) => setDays0(e.target.value)}
                />
              </Field>
              <Field label={`Days in the US during ${year - 1}`}>
                <input
                  className={fieldClass}
                  inputMode="numeric"
                  value={days1}
                  onChange={(e) => setDays1(e.target.value)}
                />
              </Field>
              <Field label={`Days in the US during ${year - 2}`}>
                <input
                  className={fieldClass}
                  inputMode="numeric"
                  value={days2}
                  onChange={(e) => setDays2(e.target.value)}
                />
              </Field>
            </div>
          </InputCard>

          <ResultCard
            tone={spt.isResident ? "info" : "positive"}
            eyebrow="Result"
            title={`You file Form ${spt.form} for ${year}`}
            badge={spt.isResident ? "Resident alien" : "Nonresident alien"}
          >
            <p className="text-ink-700">{spt.verdict}</p>

            <div className="rounded-xl bg-ink-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
                Showing the work
              </p>
              <ul className="mt-2 space-y-1 text-xs text-ink-600">
                <li>
                  Exempt calendar years:{" "}
                  <strong className="text-ink-900">
                    {spt.exemptYears.join(", ")}
                  </strong>{" "}
                  — days in these years are excluded entirely.
                </li>
                <li>
                  First year your days count:{" "}
                  <strong className="text-ink-900">{spt.firstCountingYear}</strong>
                </li>
                <li>
                  {year}: {spt.breakdown.currentYear} days +{" "}
                  {spt.breakdown.priorYearWeighted.toFixed(1)} (⅓ of {year - 1}) +{" "}
                  {spt.breakdown.secondPriorYearWeighted.toFixed(1)} (⅙ of{" "}
                  {year - 2}) ={" "}
                  <strong className="text-ink-900">
                    {spt.weightedDays.toFixed(1)} weighted days
                  </strong>{" "}
                  (threshold {taxConstants.sptTotalDaysThreshold})
                </li>
              </ul>
            </div>

            {spt.form8843Required && (
              <p className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
                <strong>Form 8843 is required</strong> for every year you are an
                exempt individual — including years you earned nothing at all.
                It is not a tax return; it is the form that documents why your
                days do not count.
              </p>
            )}

            {spt.isFlipYear && (
              <p className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-xs text-sky-900">
                <strong>This is your flip year.</strong> {year} is the first year
                you meet the test. From here you report worldwide income —
                including Indian bank interest, mutual funds and property income
                — and you pick up FBAR and FATCA obligations if your foreign
                accounts cross the thresholds. You also lose the treaty standard
                deduction as a nonresident benefit, though as a resident you get
                the ordinary standard deduction instead.
              </p>
            )}
          </ResultCard>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            Next: check your FICA refund →
          </button>
        </div>
      )}

      {/* ─────────────────────────── Step 2 ─────────────────────────── */}
      {step === 2 && (
        <div id="fica-refund" className="space-y-5">
          <InputCard
            eyebrow="Step 2"
            title="Did your employer withhold Social Security and Medicare?"
          >
            <Field
              label={`Gross wages in ${year} (USD)`}
              help="Box 1 of your W-2. Include on-campus, CPT and OPT wages."
            >
              <input
                className={fieldClass}
                inputMode="decimal"
                value={wages}
                onChange={(e) => setWages(e.target.value)}
              />
            </Field>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-900/10 p-3">
              <input
                type="checkbox"
                checked={employerWithheld}
                onChange={(e) => setEmployerWithheld(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none accent-brand-600"
              />
              <span className="text-sm text-ink-700">
                <strong className="text-ink-900">
                  Boxes 4 and 6 of my W-2 are not zero
                </strong>
                <span className="mt-0.5 block text-xs text-ink-500">
                  Box 4 is Social Security tax withheld, box 6 is Medicare. If
                  either shows an amount and you were a nonresident, it should
                  not have been taken.
                </span>
              </span>
            </label>

            {employerWithheld && (
              <Field
                label="Exact amount from boxes 4 + 6 (optional)"
                help="Leave blank to estimate at the statutory 7.65%."
              >
                <input
                  className={fieldClass}
                  inputMode="decimal"
                  placeholder="e.g. 2677.50"
                  value={exactWithheld}
                  onChange={(e) => setExactWithheld(e.target.value)}
                />
              </Field>
            )}
          </InputCard>

          <ResultCard
            tone={fica.refundable ? "positive" : "neutral"}
            eyebrow="Result"
            title={
              fica.refundable
                ? `You may be owed ${formatUsd(fica.amount)}`
                : "Nothing to reclaim"
            }
            badge={fica.refundable ? "Recoverable" : undefined}
          >
            {fica.refundable ? (
              <>
                <p className="text-ink-700">
                  As a nonresident on F-1, your wages are exempt from Social
                  Security and Medicare tax. If it was withheld anyway, it is
                  recoverable — but the order matters.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl bg-ink-50/70 p-3">
                    <p className="text-xs text-ink-400">
                      Social Security ({taxConstants.socialSecurityPct}%)
                    </p>
                    <p className="text-lg font-bold text-ink-900">
                      {formatUsd(fica.socialSecurity)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-ink-50/70 p-3">
                    <p className="text-xs text-ink-400">
                      Medicare ({taxConstants.medicarePct}%)
                    </p>
                    <p className="text-lg font-bold text-ink-900">
                      {formatUsd(fica.medicare)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-ink-400">{fica.note}</p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
                    How to reclaim it — in this order
                  </p>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink-600 marker:font-bold marker:text-brand-600">
                    {fica.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              </>
            ) : (
              <p className="text-ink-700">{fica.note}</p>
            )}
          </ResultCard>

          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            Next: estimate your refund →
          </button>
        </div>
      )}

      {/* ─────────────────────────── Step 3 ─────────────────────────── */}
      {step === 3 && (
        <div id="refund-estimator" className="space-y-5">
          <InputCard eyebrow="Step 3" title="Estimate your federal refund">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Gross wages in ${year} (USD)`} help="Box 1 of your W-2.">
                <input
                  className={fieldClass}
                  inputMode="decimal"
                  value={wages}
                  onChange={(e) => setWages(e.target.value)}
                />
              </Field>
              <Field
                label="Federal income tax withheld"
                help="Box 2 of your W-2 — not boxes 4 or 6."
              >
                <input
                  className={fieldClass}
                  inputMode="decimal"
                  value={federalWithheld}
                  onChange={(e) => setFederalWithheld(e.target.value)}
                />
              </Field>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
              <input
                type="checkbox"
                checked={isIndian}
                onChange={(e) => setIsIndian(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none accent-emerald-600"
              />
              <span className="text-sm text-ink-700">
                <strong className="text-ink-900">
                  I was a resident of India immediately before coming to the US
                </strong>
                <span className="mt-0.5 block text-xs text-ink-500">
                  {indiaTreaty.article} of the {indiaTreaty.name} lets you claim
                  the standard deduction on Form 1040-NR. Almost no other
                  nationality can.
                </span>
              </span>
            </label>
          </InputCard>

          <ResultCard
            tone={refund.isRefund ? "positive" : "caution"}
            eyebrow="Estimate"
            title={
              refund.isRefund
                ? `Estimated refund: ${formatUsd(refund.net)}`
                : `Estimated balance due: ${formatUsd(Math.abs(refund.net))}`
            }
            badge={refund.treatyApplied ? "Treaty applied" : undefined}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[20rem] text-sm">
                <tbody className="divide-y divide-ink-900/5">
                  <tr>
                    <td className="py-2 text-ink-500">Wages</td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      {formatUsd(num(wages))}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-ink-500">
                      Standard deduction
                      {refund.treatyApplied ? " (treaty)" : ""}
                    </td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      −{formatUsd(refund.standardDeduction)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-ink-500">Taxable income</td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      {formatUsd(refund.taxableIncome)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-ink-500">Estimated federal tax</td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      {formatUsd(refund.estimatedTax)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-ink-500">Already withheld</td>
                    <td className="py-2 text-right font-semibold text-ink-900">
                      {formatUsd(num(federalWithheld))}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-ink-900">
                      {refund.isRefund ? "Refund" : "Balance due"}
                    </td>
                    <td
                      className={`py-2 text-right text-lg font-extrabold ${
                        refund.isRefund ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {formatUsd(Math.abs(refund.net))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {refund.treatyApplied && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900">
                <strong>
                  The treaty is worth {formatUsd(refund.standardDeduction)} of
                  deduction here.
                </strong>{" "}
                {indiaTreaty.claimMechanic} {indiaTreaty.caution}
              </p>
            )}

            <ul className="space-y-1 text-xs text-ink-400">
              {refund.caveats.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </ResultCard>
        </div>
      )}
    </div>
  );
}
