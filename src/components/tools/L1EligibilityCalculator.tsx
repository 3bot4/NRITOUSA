"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { calculateL1Stay, type L1Role } from "@/lib/calc/l1Stay";

/**
 * L-1 eligibility and maximum-stay calculator.
 *
 * Browser-only, nothing stored or sent.
 *
 * Two answers, kept apart on screen because they are separate questions with
 * separate regulations: the one-year-in-three requirement at
 * 8 CFR 214.2(l)(1)(ii)(A), and the five- or seven-year cap at (l)(12)(i) which
 * counts L and H time in the United States TOGETHER. The H-1B field is the
 * reason this calculator exists — every L-1 guide states the caps without it.
 */

const numField = (v: string): number => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export default function L1EligibilityCalculator() {
  const [role, setRole] = useState<L1Role>("l1a");
  const [abroad, setAbroad] = useState("24");
  const [inUs, setInUs] = useState("0");
  const [continuous, setContinuous] = useState(true);
  const [monthsL, setMonthsL] = useState("0");
  const [monthsH, setMonthsH] = useState("0");
  const [yearAbroad, setYearAbroad] = useState(false);

  const result = useMemo(
    () =>
      calculateL1Stay({
        monthsAbroadInLast36: numField(abroad),
        monthsInUsForSameGroupInLast36: numField(inUs),
        continuous,
        role,
        monthsAlreadyInL: numField(monthsL),
        monthsAlreadyInH: numField(monthsH),
        yearAbroadSince: yearAbroad,
      }),
    [abroad, inUs, continuous, role, monthsL, monthsH, yearAbroad],
  );

  const eligTone =
    result.eligibilityTone === "ok"
      ? "positive"
      : result.eligibilityTone === "not-continuous"
        ? "caution"
        : "attention";

  const capTone =
    result.capTone === "ok"
      ? "positive"
      : result.capTone === "tight"
        ? "caution"
        : "attention";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-5 lg:grid-cols-2">
        <InputCard eyebrow="Months in, months out" title="Your L-1 position">
          <p className="-mt-2 text-xs leading-relaxed text-ink-500">
            Two separate questions: whether you qualify at all, and how long you
            could stay. Months rather than dates, because months are what people
            can answer. Nothing is stored or sent.
          </p>

          <Field
            label="Which L-1 are you being transferred on?"
            help="L-1A is manager or executive, capped at 7 years. L-1B is specialized knowledge, capped at 5."
          >
            <select
              className={fieldClass}
              value={role}
              onChange={(e) => setRole(e.target.value as L1Role)}
            >
              <option value="l1a">L-1A — manager or executive</option>
              <option value="l1b">L-1B — specialized knowledge</option>
            </select>
          </Field>

          <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.02] p-3.5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
              The qualifying year
            </p>

            <div className="mt-3 space-y-3">
              <Field
                label="Months employed by the company group ABROAD, in the last 36"
                help="Any entity in the group — parent, branch, subsidiary or affiliate."
              >
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={36}
                  className={fieldClass}
                  value={abroad}
                  onChange={(e) => setAbroad(e.target.value)}
                />
              </Field>

              <Field
                label="Of those 36 months, months spent IN the United States for the same group"
                help="This is the field that surprises people. US time does not break your continuous year, and the regulation says expressly that it does not count toward it either."
              >
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={36}
                  className={fieldClass}
                  value={inUs}
                  onChange={(e) => setInUs(e.target.value)}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={continuous}
                  onChange={(e) => setContinuous(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                />
                <span className="text-xs leading-relaxed text-ink-700">
                  <strong className="text-ink-900">
                    At least 12 of those months abroad were one unbroken run
                  </strong>
                  <span className="mt-0.5 block text-ink-500">
                    Twelve months in two separate six-month postings is not one
                    continuous year, even though the total reaches twelve.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.02] p-3.5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
              Time already spent in the United States
            </p>

            <div className="mt-3 space-y-3">
              <Field label="Months already in L status, in the US" help="All L-1 time, with any employer in any group.">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className={fieldClass}
                  value={monthsL}
                  onChange={(e) => setMonthsL(e.target.value)}
                />
              </Field>

              <Field
                label="Months already in H status, in the US"
                help="H-1B, H-1B1, H-4 time as a principal — this counts against the SAME cap. It is the half of 8 CFR 214.2(l)(12)(i) that most guides leave out."
              >
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className={fieldClass}
                  value={monthsH}
                  onChange={(e) => setMonthsH(e.target.value)}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={yearAbroad}
                  onChange={(e) => setYearAbroad(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                />
                <span className="text-xs leading-relaxed text-ink-700">
                  <strong className="text-ink-900">
                    I have since spent a full year living outside the US
                  </strong>
                  <span className="mt-0.5 block text-ink-500">
                    Residence and physical presence abroad, apart from brief
                    visits for business or pleasure, for the immediate prior
                    year. This is the only thing that resets the clock.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </InputCard>

        <div className="space-y-5">
          <ResultCard
            tone={eligTone}
            eyebrow="Question 1 — do you qualify?"
            title={result.eligibilityHeadline}
            badge={result.oneYearMet ? "Year met" : "Year not met"}
          >
            <p>{result.eligibilityDetail}</p>
          </ResultCard>

          <ResultCard
            tone={capTone}
            eyebrow={`Question 2 — how long could you stay?`}
            title={result.capHeadline}
            badge={`${result.capYears}-year cap`}
          >
            <p>{result.capDetail}</p>

            {/* Cap usage bar */}
            <div className="mt-3">
              <div
                className="flex h-7 w-full overflow-hidden rounded-lg bg-ink-900/10"
                role="img"
                aria-label={`${result.usedMonths} of ${result.capMonths} months used against the ${result.capYears}-year cap, leaving ${result.remainingMonths} months.`}
              >
                {result.usedMonths > 0 && (
                  <span
                    className="flex items-center justify-center bg-ink-500 text-[0.65rem] font-bold text-white"
                    style={{
                      width: `${Math.min(100, (result.usedMonths / result.capMonths) * 100)}%`,
                    }}
                  >
                    {result.usedMonths} used
                  </span>
                )}
                {result.remainingMonths > 0 && (
                  <span
                    className="flex items-center justify-center bg-brand-200 text-[0.65rem] font-bold text-brand-900"
                    style={{
                      width: `${Math.min(100, (result.remainingMonths / result.capMonths) * 100)}%`,
                    }}
                  >
                    {result.remainingMonths} left
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[0.7rem] text-ink-400">
                Months against the {result.capMonths}-month cap in 8 CFR
                214.2(l)(12)(i).
              </p>
            </div>
          </ResultCard>

          <ResultCard tone="neutral" eyebrow="Worth knowing" title="Notes on your answer">
            <ul className="list-disc space-y-2 pl-5">
              {result.notes.map((n) => (
                <li key={n.slice(0, 40)}>{n}</li>
              ))}
            </ul>
            <p className="mt-3 border-t border-ink-900/5 pt-3 text-xs">
              Eligibility also turns on the qualifying relationship between the
              two entities and whether the US role meets the managerial,
              executive or specialized-knowledge definition — none of which is a
              duration question. If the cap is your binding constraint, the green
              card route is the answer:{" "}
              <Link href="/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw" className="text-brand-600 underline">
                L-1A feeds EB-1C, which skips PERM
              </Link>
              . Recapturing days abroad needs your{" "}
              <Link href="/uscis/i-94" className="text-brand-600 underline">
                I-94 travel history
              </Link>
              .
            </p>
          </ResultCard>
        </div>
      </div>
    </div>
  );
}
