"use client";

import { useMemo, useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import {
  computeDegreeRoi,
  DEFAULT_ROI_INPUT,
  type RoiInput,
  type ScenarioResult,
} from "@/lib/calc/degreeRoi";

/**
 * Four-scenario 10-year net-worth projection.
 *
 * Chart is hand-rolled inline SVG — no chart library, which keeps this inside
 * the site's strict CSP and adds no bundle weight. One hue per scenario,
 * dashed stroke for the speculative one so a reader can tell at a glance
 * which line is not describing current law.
 */

const PRESETS: { id: string; label: string; patch: Partial<RoiInput> }[] = [
  {
    id: "ms-cs-public",
    label: "MS CS — public university",
    patch: {
      tuitionTotalUsd: 50000,
      livingCostPerYearUsd: 20000,
      programYears: 2,
      usStartSalaryUsd: 105000,
    },
  },
  {
    id: "ms-cs-private",
    label: "MS CS — private university",
    patch: {
      tuitionTotalUsd: 110000,
      livingCostPerYearUsd: 26000,
      programYears: 2,
      usStartSalaryUsd: 115000,
    },
  },
  {
    id: "mba-top",
    label: "MBA — top programme",
    patch: {
      tuitionTotalUsd: 180000,
      livingCostPerYearUsd: 30000,
      programYears: 2,
      usStartSalaryUsd: 150000,
      indiaStartSalaryLpa: 25,
    },
  },
  {
    id: "ms-eng",
    label: "MS Engineering — mid-tier",
    patch: {
      tuitionTotalUsd: 45000,
      livingCostPerYearUsd: 18000,
      programYears: 2,
      usStartSalaryUsd: 85000,
    },
  },
];

const HUES: Record<string, { stroke: string; chip: string; text: string }> = {
  "us-career": {
    stroke: "#4f46e5",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    text: "text-indigo-700",
  },
  "opt-fee": {
    stroke: "#d97706",
    chip: "bg-amber-50 text-amber-800 border-amber-200",
    text: "text-amber-800",
  },
  "return-india": {
    stroke: "#059669",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-700",
  },
  "never-go": {
    stroke: "#64748b",
    chip: "bg-slate-100 text-slate-700 border-slate-300",
    text: "text-slate-700",
  },
};

const num = (v: string, fb = 0) => {
  const n = Number(v.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : fb;
};

export default function DegreeRoiCalc() {
  const [input, setInput] = useState<RoiInput>(DEFAULT_ROI_INPUT);
  const [currency, setCurrency] = useState<"usd" | "inr">("usd");
  const [showAssumptions, setShowAssumptions] = useState(false);

  const result = useMemo(() => computeDegreeRoi(input), [input]);

  const set = <K extends keyof RoiInput>(key: K) => (v: RoiInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: v }));

  const money = (usd: number) => {
    if (currency === "inr") {
      const inr = usd * input.fxRateInrPerUsd;
      const lakh = inr / 100_000;
      if (Math.abs(lakh) >= 100) {
        return `₹${(lakh / 100).toFixed(2)} Cr`;
      }
      return `₹${lakh.toFixed(1)} L`;
    }
    return usd.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Presets */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
          Start from a typical programme
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setInput((prev) => ({ ...prev, ...p.patch }))}
              className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-brand-500 hover:text-brand-600"
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-xs text-ink-400">
          Presets are starting points built from typical published figures, not
          quotes for any specific school. Change every number below to match
          your actual offer.
        </p>
      </div>

      {/* Core inputs */}
      <InputCard eyebrow="Your numbers" title="The cost side">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Total tuition for the programme (USD)">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.tuitionTotalUsd)}
              onChange={(e) => set("tuitionTotalUsd")(num(e.target.value))}
            />
          </Field>
          <Field label="Living cost per year while studying (USD)">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.livingCostPerYearUsd)}
              onChange={(e) => set("livingCostPerYearUsd")(num(e.target.value))}
            />
          </Field>
          <Field label="Programme length (years)">
            <input
              className={fieldClass}
              inputMode="numeric"
              value={String(input.programYears)}
              onChange={(e) => set("programYears")(num(e.target.value, 2))}
            />
          </Field>
          <Field
            label={`Share funded by loan: ${Math.round(input.loanShare * 100)}%`}
            help="The rest is family money — spent, not borrowed."
          >
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={input.loanShare * 100}
              onChange={(e) => set("loanShare")(Number(e.target.value) / 100)}
              className="w-full accent-brand-600"
            />
          </Field>
          <Field label="Loan interest rate (%)" help="Indian education loans typically run 9–11%.">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.loanRatePct)}
              onChange={(e) => set("loanRatePct")(num(e.target.value))}
            />
          </Field>
          <Field label="Loan repayment term (years)">
            <input
              className={fieldClass}
              inputMode="numeric"
              value={String(input.loanTermYears)}
              onChange={(e) => set("loanTermYears")(num(e.target.value, 10))}
            />
          </Field>
        </div>
      </InputCard>

      <InputCard eyebrow="Your numbers" title="The earning side">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Starting US salary (USD)">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.usStartSalaryUsd)}
              onChange={(e) => set("usStartSalaryUsd")(num(e.target.value))}
            />
          </Field>
          <Field label="US living cost per year (USD)">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.usLivingCostUsd)}
              onChange={(e) => set("usLivingCostUsd")(num(e.target.value))}
            />
          </Field>
          <Field label="Starting salary in India (₹ lakh/year)">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.indiaStartSalaryLpa)}
              onChange={(e) => set("indiaStartSalaryLpa")(num(e.target.value))}
            />
          </Field>
          <Field label="India living cost (₹ lakh/year)">
            <input
              className={fieldClass}
              inputMode="decimal"
              value={String(input.indiaLivingCostLpa)}
              onChange={(e) => set("indiaLivingCostLpa")(num(e.target.value))}
            />
          </Field>
          <Field
            label={`Sponsorship probability: ${Math.round(input.sponsorshipProbability * 100)}%`}
            help="Your honest odds of an employer sponsoring you. This is the most consequential input here — move it and watch the result."
          >
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={input.sponsorshipProbability * 100}
              onChange={(e) =>
                set("sponsorshipProbability")(Number(e.target.value) / 100)
              }
              className="w-full accent-brand-600"
            />
          </Field>
          <Field
            label={`Years in the US before returning: ${input.usYearsBeforeReturn}`}
            help="Only affects the return-to-India path — and your career capital score."
          >
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={input.usYearsBeforeReturn}
              onChange={(e) => set("usYearsBeforeReturn")(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </Field>
        </div>

        <button
          type="button"
          onClick={() => setShowAssumptions((s) => !s)}
          className="mt-2 text-xs font-semibold text-brand-600 underline"
        >
          {showAssumptions ? "Hide" : "Show"} the remaining assumptions
        </button>

        {showAssumptions && (
          <div className="grid gap-4 rounded-xl bg-ink-50/70 p-4 sm:grid-cols-2">
            <Field label="US salary growth (%/yr)">
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.usSalaryGrowthPct)}
                onChange={(e) => set("usSalaryGrowthPct")(num(e.target.value))}
              />
            </Field>
            <Field label="India salary growth (%/yr)">
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.indiaSalaryGrowthPct)}
                onChange={(e) => set("indiaSalaryGrowthPct")(num(e.target.value))}
              />
            </Field>
            <Field label="US effective tax rate (%)">
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.usTaxRatePct)}
                onChange={(e) => set("usTaxRatePct")(num(e.target.value))}
              />
            </Field>
            <Field label="India effective tax rate (%)">
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.indiaTaxRatePct)}
                onChange={(e) => set("indiaTaxRatePct")(num(e.target.value))}
              />
            </Field>
            <Field
              label="US-experience salary premium in India (%)"
              help="What a returner commands over a peer who never left. Your assumption, not a measured figure."
            >
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.indiaReturnPremiumPct)}
                onChange={(e) => set("indiaReturnPremiumPct")(num(e.target.value))}
              />
            </Field>
            <Field label="₹ per USD" help="A planning rate, not a live quote.">
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.fxRateInrPerUsd)}
                onChange={(e) => set("fxRateInrPerUsd")(num(e.target.value, 88))}
              />
            </Field>
            <Field label="Investment return on savings (%/yr)">
              <input
                className={fieldClass}
                inputMode="decimal"
                value={String(input.investmentReturnPct)}
                onChange={(e) => set("investmentReturnPct")(num(e.target.value))}
              />
            </Field>
            <Field label="Projection horizon (years)">
              <input
                className={fieldClass}
                inputMode="numeric"
                value={String(input.horizonYears)}
                onChange={(e) => set("horizonYears")(num(e.target.value, 10))}
              />
            </Field>
          </div>
        )}
      </InputCard>

      {/* Verdict + currency toggle */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            After {input.horizonYears} years
          </p>
          <div className="flex gap-1 rounded-lg border border-ink-900/10 bg-white p-0.5">
            {(["usd", "inr"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                  currency === c
                    ? "bg-brand-600 text-white"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {c === "usd" ? "$" : "₹"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink-800">
          {result.verdict}
        </p>
      </div>

      <RoiChart result={result.scenarios} money={money} horizon={input.horizonYears} />

      {/* Scenario cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {result.scenarios.map((s) => (
          <ScenarioCard key={s.id} s={s} money={money} programYears={input.programYears} />
        ))}
      </div>

      {/* Career capital — deliberately separate from the money */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          What the chart cannot show
        </p>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
          Career capital: {result.careerCapital.band}
        </h3>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${result.careerCapital.mobilityScore}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          {result.careerCapital.headline}
        </p>
        <ul className="mt-4 space-y-2">
          {result.careerCapital.drivers.map((d) => (
            <li key={d.label} className="flex gap-2.5 text-sm">
              <span aria-hidden className="flex-none pt-0.5">
                {d.earned ? "✅" : "⬜"}
              </span>
              <span>
                <strong
                  className={d.earned ? "text-ink-900" : "text-ink-400"}
                >
                  {d.label}
                </strong>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  {d.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-white/70 p-3 text-xs leading-relaxed text-ink-600">
          {result.careerCapital.durabilityNote}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────── chart ────────────────────────────────── */

function RoiChart({
  result,
  money,
  horizon,
}: {
  result: ScenarioResult[];
  money: (n: number) => string;
  horizon: number;
}) {
  const W = 720;
  const H = 300;
  const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

  const all = result.flatMap((s) => s.series.map((p) => p.netWorthUsd));
  const min = Math.min(0, ...all);
  const max = Math.max(0, ...all);
  const span = max - min || 1;

  const x = (i: number) =>
    PAD.left + (i / Math.max(1, horizon - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + (1 - (v - min) / span) * (H - PAD.top - PAD.bottom);

  const zeroY = y(0);

  return (
    <figure className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card sm:p-5">
      <figcaption className="mb-3 text-sm font-bold text-ink-900">
        Net worth over {horizon} years
      </figcaption>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[36rem]"
          role="img"
          aria-label={`Net worth projection across ${result.length} scenarios over ${horizon} years`}
        >
          {/* zero line */}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={zeroY}
            y2={zeroY}
            stroke="#cbd5e1"
            strokeWidth={1}
          />
          <text x={4} y={zeroY + 4} className="fill-ink-400" fontSize={11}>
            {money(0)}
          </text>
          <text x={4} y={y(max) + 4} className="fill-ink-400" fontSize={11}>
            {money(max)}
          </text>
          {min < 0 && (
            <text x={4} y={y(min) - 2} className="fill-ink-400" fontSize={11}>
              {money(min)}
            </text>
          )}

          {/* x axis labels */}
          {Array.from({ length: horizon }, (_, i) => i)
            .filter((i) => i % 2 === 0 || i === horizon - 1)
            .map((i) => (
              <text
                key={i}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                className="fill-ink-400"
                fontSize={11}
              >
                Yr {i + 1}
              </text>
            ))}

          {result.map((s) => {
            const hue = HUES[s.id];
            const d = s.series
              .map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.netWorthUsd)}`)
              .join(" ");
            return (
              <path
                key={s.id}
                d={d}
                fill="none"
                stroke={hue.stroke}
                strokeWidth={s.speculative ? 2 : 2.5}
                strokeDasharray={s.speculative ? "5 4" : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={s.speculative ? 0.75 : 1}
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {result.map((s) => (
          <span
            key={s.id}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${HUES[s.id].chip}`}
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ background: HUES[s.id].stroke }}
            />
            {s.label}
            {s.speculative ? " (hypothetical)" : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ──────────────────────────── scenario card ────────────────────────────── */

function ScenarioCard({
  s,
  money,
  programYears,
}: {
  s: ScenarioResult;
  money: (n: number) => string;
  programYears: number;
}) {
  const hue = HUES[s.id];
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-card ${
        s.speculative ? "border-amber-200" : "border-ink-900/5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`text-sm font-bold ${hue.text}`}>{s.label}</h3>
        {s.speculative && (
          <span className="flex-none rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-amber-800">
            Not law
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.summary}</p>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">
        {money(s.finalNetWorthUsd)}
      </p>
      <dl className="mt-2 space-y-1 text-xs text-ink-500">
        <div className="flex justify-between gap-2">
          <dt>Break-even</dt>
          <dd className="font-semibold text-ink-700">
            {s.breakEvenYear === null
              ? "Not within the horizon"
              : `Year ${s.breakEvenYear + 1}`}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Total degree cost</dt>
          <dd className="font-semibold text-ink-700">
            {s.totalDegreeCostUsd === 0 ? "—" : money(s.totalDegreeCostUsd)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Study years</dt>
          <dd className="font-semibold text-ink-700">
            {s.id === "never-go" ? "—" : programYears}
          </dd>
        </div>
      </dl>
      {s.note && (
        <p className="mt-3 rounded-lg bg-ink-50/70 p-2.5 text-xs leading-relaxed text-ink-600">
          {s.note}
        </p>
      )}
    </div>
  );
}
