"use client";

import { useState } from "react";
import {
  FEDERAL_SEED_AMOUNT,
  MILESTONE_AGES,
  projectedValueAtAge,
  totalFamilyContributions,
  type ProjectionInput,
} from "@/lib/trumpAccountProjection";
import { formatUsd } from "@/lib/format";

/* ------------------------------------------------------------------ *
 * Inputs
 * ------------------------------------------------------------------ */
interface Inputs {
  childCurrentAge: string;
  startingBalance: string;
  includeFederalSeedContribution: "yes" | "no";
  annualContribution: string;
  contributionYears: string;
  expectedAnnualReturn: string;
  projectionAge: string;
  movingBackToIndia: "yes" | "no";
}

const DEFAULTS: Inputs = {
  childCurrentAge: "0",
  startingBalance: "0",
  includeFederalSeedContribution: "yes",
  annualContribution: "5000",
  contributionYears: "18",
  expectedAnnualReturn: "7",
  projectionAge: "50",
  movingBackToIndia: "no",
};

/** Clamp a parsed number to a sane range, falling back to `fallback`. */
function num(raw: string, fallback: number, min: number, max: number): number {
  const v = Number(raw);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

function toProjectionInput(inp: Inputs): ProjectionInput {
  return {
    childCurrentAge: num(inp.childCurrentAge, 0, 0, 17),
    startingBalance: num(inp.startingBalance, 0, 0, 10_000_000),
    includeSeed: inp.includeFederalSeedContribution === "yes",
    annualContribution: num(inp.annualContribution, 0, 0, 5000),
    contributionYears: num(inp.contributionYears, 0, 0, 18),
    annualReturnPct: num(inp.expectedAnnualReturn, 7, 0, 15),
  };
}

/* ------------------------------------------------------------------ *
 * UI atoms
 * ------------------------------------------------------------------ */
const fieldCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="mt-0.5 block text-[0.6875rem] text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ResultCard({ age, value, highlight }: { age: number; value: number | null; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center ${
        highlight ? "border-brand-300 bg-brand-50/70" : "border-ink-900/10 bg-white"
      }`}
    >
      <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-ink-500">At age {age}</p>
      <p className={`mt-1 text-lg font-extrabold tracking-tight ${highlight ? "text-brand-700" : "text-ink-900"}`}>
        {value === null ? "—" : formatUsd(value)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Calculator
 * ------------------------------------------------------------------ */
export default function TrumpAccountMillionaireCalculator({ id = "calculator" }: { id?: string }) {
  const [inp, setInp] = useState<Inputs>(DEFAULTS);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const proj = toProjectionInput(inp);
  const projectionAge = num(inp.projectionAge, 50, proj.childCurrentAge, 80);

  const totalContrib = totalFamilyContributions(proj);
  const milestones = MILESTONE_AGES.map((age) => ({ age, value: projectedValueAtAge(proj, age) }));
  const atProjection = projectedValueAtAge(proj, projectionAge);
  const couldReachMillion = (atProjection ?? 0) >= 1_000_000;
  const movingBack = inp.movingBackToIndia === "yes";

  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/50 to-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Trump Account millionaire calculator</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Could a Trump Account make your child a millionaire?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Estimate how contributions could grow with decades of compounding. This is an educational projection, not a
          prediction — returns are never guaranteed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Child's current age" hint="Whole years (0 = newborn).">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={17}
            className={fieldCls}
            value={inp.childCurrentAge}
            onChange={(e) => set("childCurrentAge", e.target.value)}
            aria-label="Child's current age"
          />
        </Field>
        <Field label="Starting balance ($)" hint="Money already in the account today.">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className={fieldCls}
            value={inp.startingBalance}
            onChange={(e) => set("startingBalance", e.target.value)}
            aria-label="Starting balance"
          />
        </Field>
        <Field label="Include the $1,000 federal seed?" hint="Only eligible U.S.-citizen children born 2025–2028.">
          <select
            className={fieldCls}
            value={inp.includeFederalSeedContribution}
            onChange={(e) => set("includeFederalSeedContribution", e.target.value as "yes" | "no")}
            aria-label="Include federal seed contribution"
          >
            <option value="yes">Yes — add $1,000 seed</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Yearly family contribution ($)" hint="Up to $5,000 per child per year.">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={5000}
            className={fieldCls}
            value={inp.annualContribution}
            onChange={(e) => set("annualContribution", e.target.value)}
            aria-label="Annual contribution"
          />
        </Field>
        <Field label="Years of contributions" hint="How many years you keep adding money (up to 18).">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={18}
            className={fieldCls}
            value={inp.contributionYears}
            onChange={(e) => set("contributionYears", e.target.value)}
            aria-label="Contribution years"
          />
        </Field>
        <Field label="Expected annual return (%)" hint="Historical stock returns vary; there is no guaranteed rate.">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={15}
            step={0.5}
            className={fieldCls}
            value={inp.expectedAnnualReturn}
            onChange={(e) => set("expectedAnnualReturn", e.target.value)}
            aria-label="Expected annual return"
          />
        </Field>
        <Field label="Project to age" hint="See the balance at a chosen future age.">
          <input
            type="number"
            inputMode="numeric"
            min={proj.childCurrentAge}
            max={80}
            className={fieldCls}
            value={inp.projectionAge}
            onChange={(e) => set("projectionAge", e.target.value)}
            aria-label="Projection age"
          />
        </Field>
        <Field label="Might you move back to India?">
          <select
            className={fieldCls}
            value={inp.movingBackToIndia}
            onChange={(e) => set("movingBackToIndia", e.target.value as "yes" | "no")}
            aria-label="Moving back to India"
          >
            <option value="no">No</option>
            <option value="yes">Yes / maybe</option>
          </select>
        </Field>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-ink-900/10 bg-slate-50/60 p-3 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-4 flex items-baseline justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-500">Total family contributions</span>
            <span className="text-base font-extrabold text-ink-900">{formatUsd(totalContrib)}</span>
          </div>
          {milestones.map((m) => (
            <ResultCard key={m.age} age={m.age} value={m.value} highlight={m.age === projectionAge} />
          ))}
        </div>

        <div
          className={`rounded-2xl border p-5 ${
            couldReachMillion ? "border-emerald-200 bg-emerald-50/60" : "border-brand-200 bg-brand-50/50"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
            Projected value at age {projectionAge}
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
            {atProjection === null ? "—" : formatUsd(atProjection)}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink-700">
            {atProjection === null
              ? "Choose a projection age at or above the child's current age."
              : couldReachMillion
              ? "🎯 On these assumptions, the account could reach $1,000,000 or more — but returns are not guaranteed."
              : "On these assumptions, the account stays under $1,000,000. Try a longer time horizon or higher (riskier) return."}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm leading-relaxed text-ink-700">
          <p className="font-bold text-blue-800">Tax-deferred is not tax-free</p>
          <p className="mt-1">
            A Trump Account grows tax-deferred (traditional-IRA style), so earnings aren&apos;t taxed year by year — but
            tax can still apply later under the account&apos;s distribution rules. Deferral is not the same as never
            paying tax. Confirm current IRS rules before you rely on any number here.
          </p>
        </div>

        {movingBack && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm leading-relaxed text-ink-800">
            <p className="font-bold text-amber-800">If you may move back to India</p>
            <ul className="mt-2 space-y-1.5">
              <li className="flex gap-2">
                <span className="mt-0.5 flex-none text-amber-600">→</span>
                The account belongs to the child and generally stays open — but set up foreign-address access, U.S. bank
                links, and 2-factor methods that work from India before you leave.
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 flex-none text-amber-600">→</span>
                A U.S.-citizen child keeps lifelong U.S. filing duties; once you are Indian tax residents, India may tax
                the account&apos;s income differently. Get cross-border advice.
              </li>
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Recommended next pages</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href="/trump-account-h1b-immigrant-families"
              className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
            >
              Main Trump Account guide →
            </a>
            <a
              href="/trump-account-vs-529-for-h1b-families"
              className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
            >
              Trump Account vs 529 →
            </a>
            {movingBack ? (
              <a
                href="/trump-account-moving-back-to-india"
                className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
              >
                Moving back to India →
              </a>
            ) : (
              <a
                href="/trump-account-1000-eligibility"
                className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
              >
                $1,000 eligibility →
              </a>
            )}
          </div>
        </div>

        <button
          onClick={() => setInp(DEFAULTS)}
          className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
        >
          Reset to defaults
        </button>

        <p className="text-center text-xs leading-relaxed text-ink-400">
          This calculator is for education only. It does not predict actual investment results or provide tax, legal, or
          investment advice. Actual results depend on market performance, fees, taxes, contribution timing, withdrawal
          timing, and future rule changes.{" "}
          {FEDERAL_SEED_AMOUNT === 1000 ? "The $1,000 seed is only added when the child is eligible." : ""}
        </p>
      </div>
    </div>
  );
}
