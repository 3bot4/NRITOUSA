"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateH1BOdds,
  formatPct,
  VOLUME_SCENARIOS,
  type DegreeCategory,
  type WageLevel,
  type VolumeScenarioKey,
} from "@/lib/h1b/lotteryOdds";

/* ─────────────────────────── option data ─────────────────────────────────── */

const WAGE_OPTIONS: { value: WageLevel; label: string }[] = [
  { value: "I", label: "Level I — entry-level (1× weight)" },
  { value: "II", label: "Level II — qualified / mid (2× weight)" },
  { value: "III", label: "Level III — experienced (3× weight)" },
  { value: "IV", label: "Level IV — senior / highest (4× weight)" },
  { value: "unknown", label: "I don't know my wage level" },
];

const JOB_OPTIONS = [
  "Software / IT",
  "Data / analytics",
  "Engineering",
  "Finance / business",
  "Healthcare",
  "Education / research",
  "Other",
];

type VolumeChoice = VolumeScenarioKey | "custom";

const VOLUME_OPTIONS: { value: VolumeChoice; label: string; hint: string }[] = [
  { value: "high", label: "High competition", hint: `${VOLUME_SCENARIOS.high.totalBeneficiaries.toLocaleString()} beneficiaries` },
  { value: "baseline", label: "Baseline", hint: `${VOLUME_SCENARIOS.baseline.totalBeneficiaries.toLocaleString()} beneficiaries` },
  { value: "low", label: "Lower competition", hint: `${VOLUME_SCENARIOS.low.totalBeneficiaries.toLocaleString()} beneficiaries` },
  { value: "custom", label: "Custom total", hint: "Enter your own number" },
];

const FILING_OPTIONS = [
  { value: "f1-opt", label: "Inside U.S. on F-1 OPT" },
  { value: "stem-opt", label: "Inside U.S. on STEM OPT" },
  { value: "other-status", label: "Inside U.S. on another status" },
  { value: "consular", label: "Outside U.S. / consular processing" },
];

/* ─────────────────────────── types + state ───────────────────────────────── */

interface Inputs {
  degreeCategory: DegreeCategory;
  wageLevel: WageLevel;
  jobCategory: string;
  location: string;
  volume: VolumeChoice;
  customTotal: string;
  filing: string;
  attempts: number;
}

const DEFAULTS: Inputs = {
  degreeCategory: "regular",
  wageLevel: "I",
  jobCategory: "Software / IT",
  location: "",
  volume: "baseline",
  customTotal: "",
  filing: "f1-opt",
  attempts: 1,
};

const INTERP_COPY: Record<string, { label: string; tone: string; note: string }> = {
  low: {
    label: "Low",
    tone: "bg-rose-100 text-rose-800",
    note: "These are long odds in a single year. A U.S. master's degree, a genuinely higher wage level, and more attempts over time are the levers that matter — and a backup plan is essential.",
  },
  moderate: {
    label: "Moderate",
    tone: "bg-amber-100 text-amber-800",
    note: "Meaningful but far from guaranteed. Confirm your wage level is accurate and line up a backup path in case you are not selected.",
  },
  stronger: {
    label: "Stronger",
    tone: "bg-emerald-100 text-emerald-800",
    note: "A higher weighted position improves your estimated odds — but selection is still never guaranteed. Keep documentation clean and a backup ready.",
  },
  unknown: {
    label: "Unknown wage level",
    tone: "bg-sky-100 text-sky-700",
    note: "Your wage level drives your weighting. Ask your employer or check the OEWS wage level for your SOC code and work location to sharpen this estimate.",
  },
};

/* ─────────────────────────── UI primitives ───────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="ml-1 text-xs font-normal text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

/* ─────────────────────────── component ───────────────────────────────────── */

export default function H1bLotteryChanceCalculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setCopied(false);
    setInp((p) => ({ ...p, [k]: v }));
  };

  const totalBeneficiaries = useMemo(() => {
    if (inp.volume === "custom") {
      const n = parseInt(inp.customTotal.replace(/[^0-9]/g, ""), 10);
      return Number.isFinite(n) && n > 0 ? n : VOLUME_SCENARIOS.baseline.totalBeneficiaries;
    }
    return VOLUME_SCENARIOS[inp.volume].totalBeneficiaries;
  }, [inp.volume, inp.customTotal]);

  const result = useMemo(
    () =>
      calculateH1BOdds({
        degreeCategory: inp.degreeCategory,
        wageLevel: inp.wageLevel,
        totalBeneficiaries,
        attempts: inp.attempts,
      }),
    [inp.degreeCategory, inp.wageLevel, inp.attempts, totalBeneficiaries]
  );

  const interp = INTERP_COPY[result.interpretation];

  const copyResult = async () => {
    const text =
      `My estimated FY 2027 H-1B lottery selection chance: ${formatPct(result.oneYearLow)}–${formatPct(
        result.oneYearHigh
      )} in one year (${formatPct(result.multiYearLow)}–${formatPct(result.multiYearHigh)} over ${inp.attempts} attempt${
        inp.attempts > 1 ? "s" : ""
      }). Wage weight ${result.wageWeightLabel}. Educational estimate via NRItoUSA H-1B Lottery Chance Calculator — not legal advice.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div id="calculator" className="scroll-mt-24 grid gap-5 lg:grid-cols-[1fr_360px]">
      {/* ── Inputs ── */}
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/50 to-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
          FY 2027 wage-weighted estimator
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your H-1B selection odds
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Adjust the inputs — your estimate updates instantly. No signup, no personal data.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Degree category">
            <select
              className={selectCls}
              value={inp.degreeCategory}
              onChange={(e) => set("degreeCategory", e.target.value as DegreeCategory)}
            >
              <option value="regular">Regular cap only</option>
              <option value="masters">U.S. master&rsquo;s degree or higher</option>
            </select>
          </Field>

          <Field label="Wage level" hint="(OEWS)">
            <select className={selectCls} value={inp.wageLevel} onChange={(e) => set("wageLevel", e.target.value as WageLevel)}>
              {WAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Job category" hint="(SOC helper)">
            <select className={selectCls} value={inp.jobCategory} onChange={(e) => set("jobCategory", e.target.value)}>
              {JOB_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Work location" hint="(state or metro, optional)">
            <input
              type="text"
              placeholder="e.g. San Jose, CA"
              className={selectCls}
              value={inp.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </Field>

          <Field label="Registration environment">
            <select className={selectCls} value={inp.volume} onChange={(e) => set("volume", e.target.value as VolumeChoice)}>
              {VOLUME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} — {o.hint}
                </option>
              ))}
            </select>
          </Field>

          {inp.volume === "custom" ? (
            <Field label="Custom total unique beneficiaries">
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 350000"
                className={selectCls}
                value={inp.customTotal}
                onChange={(e) => set("customTotal", e.target.value)}
              />
            </Field>
          ) : (
            <Field label="Filing situation">
              <select className={selectCls} value={inp.filing} onChange={(e) => set("filing", e.target.value)}>
                {FILING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {inp.volume === "custom" && (
            <Field label="Filing situation">
              <select className={selectCls} value={inp.filing} onChange={(e) => set("filing", e.target.value)}>
                {FILING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Future attempts" hint="(over multiple years)">
            <select className={selectCls} value={inp.attempts} onChange={(e) => set("attempts", parseInt(e.target.value, 10))}>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} attempt{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {inp.wageLevel === "unknown" && (
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-900">
            <strong className="font-bold">How to find your wage level:</strong> Your OEWS prevailing wage level (I–IV)
            is set by the SOC occupation code and the area of intended employment. Ask your employer or attorney, or look
            up the wage for your role and location on the DOL FLAG / OEWS wage data. Level depends on the job&rsquo;s
            requirements versus the local wage distribution — not on how strong your résumé is.
          </div>
        )}

        <button
          onClick={() => setInp(DEFAULTS)}
          className="mt-5 w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
        >
          ↺ Reset to defaults
        </button>
      </div>

      {/* ── Result card (sticky on desktop) ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Estimated selection chance</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight text-ink-900">
            {formatPct(result.oneYearLow)}–{formatPct(result.oneYearHigh)}
          </p>
          <p className="mt-1 text-xs text-ink-400">one-year estimate · range, not a guarantee</p>

          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${interp.tone}`}>{interp.label}</span>
            <span className="text-xs font-semibold text-ink-600">Wage weight {result.wageWeightLabel}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-600">{interp.note}</p>

          <dl className="mt-4 space-y-2 border-t border-ink-900/5 pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-500">Degree advantage</dt>
              <dd className="text-right font-semibold text-ink-900">
                {inp.degreeCategory === "masters" ? "U.S. master's cap (2 draws)" : "Regular cap only"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-500">Over {inp.attempts} attempt{inp.attempts > 1 ? "s" : ""}</dt>
              <dd className="text-right font-semibold text-ink-900">
                {formatPct(result.multiYearLow)}–{formatPct(result.multiYearHigh)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-500">Assumed pool</dt>
              <dd className="text-right font-semibold text-ink-900">{totalBeneficiaries.toLocaleString()}</dd>
            </div>
          </dl>

          <button
            onClick={copyResult}
            className="mt-4 w-full rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            {copied ? "✓ Copied" : "Copy / share my result"}
          </button>
        </div>

        {/* Next steps */}
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/50 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-orange-700">Recommended next steps</p>
          <ul className="space-y-2 text-sm text-ink-700">
            {[
              "Check whether your wage level is accurate for your SOC code and work location.",
              "Confirm your employer's registration details and filing plan.",
              "Prepare a realistic backup plan in case you are not selected.",
              inp.filing === "stem-opt" || inp.filing === "f1-opt"
                ? "On OPT / STEM OPT, map out your future attempts across cap seasons."
                : "Plan any remaining valid attempts before your status runs out.",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex-none text-orange-500">→</span>
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            <Link
              href="/h1b-lottery-not-selected-options"
              className="rounded-xl border border-ink-900/10 bg-white p-3 text-sm font-semibold text-ink-900 transition hover:border-orange-400 hover:shadow-sm"
            >
              → If not selected: your options
            </Link>
            <Link
              href="/h1b-lottery-chances"
              className="rounded-xl border border-ink-900/10 bg-white p-3 text-sm font-semibold text-ink-900 transition hover:border-orange-400 hover:shadow-sm"
            >
              → Full explainer: how the odds work
            </Link>
          </div>
        </div>

        <p className="mt-3 px-1 text-[11px] leading-relaxed text-ink-400">
          Educational estimate only, not legal advice. Actual USCIS odds depend on final registration volume,
          wage-level distribution, withdrawals, denials, and USCIS selection behavior. Verify with USCIS, DOL wage
          data, your employer, and an immigration attorney.
        </p>
      </div>
    </div>
  );
}
