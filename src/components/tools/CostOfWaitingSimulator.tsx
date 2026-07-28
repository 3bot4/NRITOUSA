"use client";

/**
 * Cost-of-waiting simulator: translates a projected green card wait into a
 * rough dollar figure — forgone salary growth (from reduced job mobility
 * while sponsorship-dependent) plus blocked spouse income, compounded over
 * the wait. Every input is a labeled assumption, not a fact; outputs are
 * explicitly a planning estimate.
 */

import { useEffect, useState } from "react";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function sliderInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayValue,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-ink-800">
          {label}
        </label>
        <span className="text-sm font-bold text-ink-900">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
      {hint && <p className="mt-1 text-[11px] text-ink-400">{hint}</p>}
    </div>
  );
}

export interface CostOfWaitingSimulatorProps {
  /** Years remaining from the current pace-scenario projection, used to auto-fill the slider. */
  projectedYears: number | null;
}

export default function CostOfWaitingSimulator({ projectedYears }: CostOfWaitingSimulatorProps) {
  const [years, setYears] = useState(Math.min(25, Math.max(1, Math.round((projectedYears ?? 8) * 10) / 10)));
  const [salary, setSalary] = useState(120000);
  const [mobilityPenaltyPct, setMobilityPenaltyPct] = useState(5);
  const [spouseIncome, setSpouseIncome] = useState(0);

  useEffect(() => {
    if (projectedYears !== null && Number.isFinite(projectedYears)) {
      setYears(Math.min(25, Math.max(0.5, Math.round(projectedYears * 10) / 10)));
    }
  }, [projectedYears]);

  const penalty = mobilityPenaltyPct / 100;
  const wholeYears = Math.floor(years);
  const fraction = years - wholeYears;

  let forgoneGrowth = 0;
  for (let t = 1; t <= wholeYears; t++) {
    forgoneGrowth += salary * (Math.pow(1 + penalty, t) - 1);
  }
  if (fraction > 0) {
    const t = wholeYears + fraction;
    forgoneGrowth += salary * (Math.pow(1 + penalty, t) - 1) * fraction;
  }

  const blockedSpouseTotal = spouseIncome * years;
  const total = forgoneGrowth + blockedSpouseTotal;

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
        Cost-of-waiting simulator
      </p>
      <h3 className="mt-1 text-lg font-bold text-ink-900">
        What might the wait cost you?
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-ink-500">
        A rough planning estimate, not a forecast — every number below is an
        assumption you can change.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {sliderInput({
          id: "cow-years",
          label: "Years remaining",
          value: years,
          onChange: setYears,
          min: 0.5,
          max: 25,
          step: 0.5,
          displayValue: `${years} yr`,
          hint: projectedYears !== null
            ? `Auto-filled from your selected pace scenario above (${Math.round(projectedYears * 10) / 10} yr) — drag to try other lengths.`
            : "No projection available above — set manually.",
        })}
        {sliderInput({
          id: "cow-salary",
          label: "Current annual salary",
          value: salary,
          onChange: setSalary,
          min: 40000,
          max: 400000,
          step: 5000,
          displayValue: usd(salary),
        })}
        {sliderInput({
          id: "cow-penalty",
          label: "Annual mobility penalty",
          value: mobilityPenaltyPct,
          onChange: setMobilityPenaltyPct,
          min: 0,
          max: 15,
          step: 0.5,
          displayValue: `${mobilityPenaltyPct}%/yr`,
          hint: "Assumption: the extra annual raise you'd likely get by freely job-hopping, that you forgo while tied to a sponsoring employer. Set to 0 to exclude this factor.",
        })}
        {sliderInput({
          id: "cow-spouse",
          label: "Blocked spouse income (per year)",
          value: spouseIncome,
          onChange: setSpouseIncome,
          min: 0,
          max: 150000,
          step: 5000,
          displayValue: usd(spouseIncome),
          hint: "Assumption: annual income your spouse can't earn while waiting on work authorization. Set to 0 if not applicable.",
        })}
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-ink-900/5 bg-[#fafafa] p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Forgone pay growth
          </p>
          <p className="mt-1 text-xl font-extrabold text-ink-900">{usd(Math.round(forgoneGrowth))}</p>
          <p className="mt-1 text-[11px] text-ink-400">
            Compounded over {years} yr at a {mobilityPenaltyPct}%/yr mobility penalty on {usd(salary)}.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Blocked spouse income
          </p>
          <p className="mt-1 text-xl font-extrabold text-ink-900">{usd(Math.round(blockedSpouseTotal))}</p>
          <p className="mt-1 text-[11px] text-ink-400">
            {usd(spouseIncome)}/yr x {years} yr, not compounded.
          </p>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm sm:bg-transparent sm:p-0 sm:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Total estimate
          </p>
          <p className="mt-1 text-2xl font-extrabold text-brand-700">{usd(Math.round(total))}</p>
          <p className="mt-1 text-[11px] text-ink-400">Sum of both figures above.</p>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">Planning estimate only.</strong>{" "}
        Real outcomes depend on your actual raises, job market, employer, and
        family decisions. This does not include benefits, taxes, cost-of-living
        changes, or the possibility your wait is shorter or longer than
        projected above. Not financial or legal advice.
      </p>
    </div>
  );
}
