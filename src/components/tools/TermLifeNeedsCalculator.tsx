"use client";

/**
 * Term Life Insurance Needs Calculator (Indian-family cluster).
 *
 * Educational estimate only — computes a protection GAP, never a
 * recommendation. No premiums, no prices, no insurer or product names.
 * Everything runs in the browser; nothing is stored or sent to a server
 * (the optional email CTA sends only an email address, never these inputs).
 * Compliance rules: see the header of src/data/lifeInsuranceData.ts.
 */
import { useState } from "react";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import LifeInsuranceEmailCTA from "@/components/tools/LifeInsuranceEmailCTA";
import { formatUsd } from "@/lib/format";
import { TERM_CALC_DISCLAIMER, agentQuestionsCalculator } from "@/data/lifeInsuranceData";

/* ------------------------------------------------------------------ *
 * Inputs
 * ------------------------------------------------------------------ */
type ChildAgeBand = "under5" | "school" | "none";

interface Inputs {
  annualIncome: string;
  incomeYears: string;
  mortgageBalance: string;
  otherUsDebts: string;
  educationGoal: string;
  spouseTransitionFund: string;
  finalExpenses: string;
  relocationFund: string;
  indiaMonthlySupport: string;
  indiaSupportYears: string;
  indiaPropertyDebt: string;
  indiaOtherObligations: string;
  existingSavings: string;
  existingIndividualCover: string;
  employerCover: string;
  spouseIncomeSupport: string;
  youngestChild: ChildAgeBand;
}

const BLANK: Inputs = {
  annualIncome: "",
  incomeYears: "10",
  mortgageBalance: "",
  otherUsDebts: "",
  educationGoal: "",
  spouseTransitionFund: "",
  finalExpenses: "",
  relocationFund: "",
  indiaMonthlySupport: "",
  indiaSupportYears: "10",
  indiaPropertyDebt: "",
  indiaOtherObligations: "",
  existingSavings: "",
  existingIndividualCover: "",
  employerCover: "",
  spouseIncomeSupport: "",
  youngestChild: "none",
};

/** Sample scenario for the "Load example" button (P2). Illustrative only. */
const EXAMPLE: Inputs = {
  annualIncome: "180000",
  incomeYears: "12",
  mortgageBalance: "550000",
  otherUsDebts: "35000",
  educationGoal: "250000",
  spouseTransitionFund: "75000",
  finalExpenses: "25000",
  relocationFund: "30000",
  indiaMonthlySupport: "1200",
  indiaSupportYears: "10",
  indiaPropertyDebt: "80000",
  indiaOtherObligations: "50000",
  existingSavings: "300000",
  existingIndividualCover: "500000",
  employerCover: "250000",
  spouseIncomeSupport: "400000",
  youngestChild: "under5",
};

/** Clamp a parsed number to a sane range, falling back to `fallback`. */
function num(raw: string, fallback: number, min: number, max: number): number {
  const v = Number(raw);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

interface LineItem {
  label: string;
  value: number;
}

interface Result {
  needItems: LineItem[];
  resourceItems: LineItem[];
  incomeReplacement: number;
  indiaSupport: number;
  totalNeed: number;
  availableResources: number;
  gap: number;
}

function compute(inp: Inputs): Result {
  const money = (raw: string) => num(raw, 0, 0, 100_000_000);
  const incomeReplacement = money(inp.annualIncome) * num(inp.incomeYears, 0, 0, 40);
  const indiaSupport = money(inp.indiaMonthlySupport) * 12 * num(inp.indiaSupportYears, 0, 0, 40);

  const needItems: LineItem[] = [
    { label: "Income replacement", value: incomeReplacement },
    { label: "Mortgage balance", value: money(inp.mortgageBalance) },
    { label: "Other U.S. debts", value: money(inp.otherUsDebts) },
    { label: "Children's education goal", value: money(inp.educationGoal) },
    { label: "Childcare / spouse transition fund", value: money(inp.spouseTransitionFund) },
    { label: "Final expenses", value: money(inp.finalExpenses) },
    { label: "Emergency relocation or travel fund", value: money(inp.relocationFund) },
    { label: "India/home-country family support", value: indiaSupport },
    { label: "India/home-country property or home-loan debt", value: money(inp.indiaPropertyDebt) },
    { label: "Other India/home-country obligations", value: money(inp.indiaOtherObligations) },
  ];

  const resourceItems: LineItem[] = [
    { label: "Existing savings/investments available to family", value: money(inp.existingSavings) },
    { label: "Existing individual life insurance", value: money(inp.existingIndividualCover) },
    { label: "Employer life insurance", value: money(inp.employerCover) },
    { label: "Estimated spouse income support", value: money(inp.spouseIncomeSupport) },
  ];

  const totalNeed = needItems.reduce((s, i) => s + i.value, 0);
  const availableResources = resourceItems.reduce((s, i) => s + i.value, 0);
  const gap = Math.max(totalNeed - availableResources, 0);

  return { needItems, resourceItems, incomeReplacement, indiaSupport, totalNeed, availableResources, gap };
}

const TERM_GUIDANCE: Record<ChildAgeBand, { label: string; text: string }> = {
  under5: {
    label: "25–30 year term",
    text: "With a youngest child under 5, many families review a 25–30 year term so coverage lasts until children are independent.",
  },
  school: {
    label: "20–25 year term",
    text: "With school-age children, many families review a 20–25 year term to cover the remaining child-raising and college years.",
  },
  none: {
    label: "10–20 year term",
    text: "If the mortgage or remaining obligations need fewer years — or children are nearly independent — a 10–20 year term may be the range to review.",
  },
};

/** Build a plain-text copy of the on-screen results + agent checklist. */
function buildResultsText(r: Result, band: ChildAgeBand): string {
  const line = (label: string, value: number, sign = "") =>
    `  ${label}: ${sign}${formatUsd(value)}`;
  const rows = [
    "TERM LIFE INSURANCE NEEDS — EDUCATIONAL ESTIMATE",
    "(NRI to USA · nritousa.com — educational only, not advice)",
    "",
    "FAMILY NEED",
    ...r.needItems.map((i) => line(i.label, i.value)),
    line("Estimated total need", r.totalNeed),
    "",
    "AVAILABLE RESOURCES",
    ...r.resourceItems.map((i) => line(i.label, i.value)),
    line("Available resources", r.availableResources),
    "",
    "RESULT",
    line("Estimated coverage gap", r.gap),
    line("Lower estimate (80% of gap)", r.gap * 0.8),
    line("Base estimate (100% of gap)", r.gap),
    line("Higher cushion (120% of gap)", r.gap * 1.2),
    "",
    `SUGGESTED TERM LENGTH: ${TERM_GUIDANCE[band].label}`,
    `  ${TERM_GUIDANCE[band].text}`,
    "",
    "AGENT DISCUSSION CHECKLIST",
    ...agentQuestionsCalculator.map((q) => `  - ${q}`),
    "",
    TERM_CALC_DISCLAIMER,
  ];
  return rows.join("\n");
}

function MoneyField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} help={hint}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="0"
          className={`${fieldClass} pl-7`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Field>
  );
}

export default function TermLifeNeedsCalculator() {
  const [inp, setInp] = useState<Inputs>(EXAMPLE);
  const [showExampleNote, setShowExampleNote] = useState(true);
  const set = (k: keyof Inputs) => (v: string) => {
    setShowExampleNote(false);
    setInp((p) => ({ ...p, [k]: v }));
  };
  const r = compute(inp);
  const resultsText = buildResultsText(r, inp.youngestChild);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setInp(EXAMPLE);
            setShowExampleNote(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
        >
          Load example
        </button>
        <button
          type="button"
          onClick={() => {
            setInp(BLANK);
            setShowExampleNote(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/15 bg-white px-4 py-2 text-sm font-bold text-ink-700 transition hover:bg-ink-50"
        >
          Reset
        </button>
        {showExampleNote && (
          <p className="text-xs font-medium text-amber-700">
            Example only — replace these numbers with your own family situation.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ------------------------------ Inputs ------------------------------ */}
        <div className="space-y-4">
          <InputCard eyebrow="Step 1 · U.S. needs" title="What would your family need here?">
            <MoneyField
              label="Annual household income to replace"
              hint="Take-home income your family relies on."
              value={inp.annualIncome}
              onChange={set("annualIncome")}
            />
            <Field label="Years income should be replaced" help="Until kids are independent or your spouse's plan stands on its own.">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={40}
                className={fieldClass}
                value={inp.incomeYears}
                onChange={(e) => set("incomeYears")(e.target.value)}
              />
            </Field>
            <MoneyField label="Mortgage balance" value={inp.mortgageBalance} onChange={set("mortgageBalance")} />
            <MoneyField
              label="Other U.S. debts"
              hint="Car loans, personal loans, credit cards."
              value={inp.otherUsDebts}
              onChange={set("otherUsDebts")}
            />
            <MoneyField
              label="Children's education goal"
              hint="Total amount you'd want set aside for education."
              value={inp.educationGoal}
              onChange={set("educationGoal")}
            />
            <MoneyField
              label="Childcare / spouse transition fund"
              hint="Childcare plus a cushion while your spouse adjusts."
              value={inp.spouseTransitionFund}
              onChange={set("spouseTransitionFund")}
            />
            <MoneyField label="Final expenses" value={inp.finalExpenses} onChange={set("finalExpenses")} />
            <MoneyField
              label="Emergency relocation or travel fund"
              hint="Family travel between the U.S. and India, or a possible move."
              value={inp.relocationFund}
              onChange={set("relocationFund")}
            />
            <Field label="Youngest child's age" help="Used only for the term-length guidance below.">
              <select
                className={fieldClass}
                value={inp.youngestChild}
                onChange={(e) => set("youngestChild")(e.target.value)}
              >
                <option value="none">No children / nearly independent</option>
                <option value="under5">Under 5</option>
                <option value="school">School age (5–17)</option>
              </select>
            </Field>
          </InputCard>

          <InputCard eyebrow="Step 2 · India / home country" title="Obligations back home">
            <MoneyField
              label="Monthly support sent to parents/family"
              hint="What you send to India or your home country each month."
              value={inp.indiaMonthlySupport}
              onChange={set("indiaMonthlySupport")}
            />
            <Field label="Years that support should continue">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={40}
                className={fieldClass}
                value={inp.indiaSupportYears}
                onChange={(e) => set("indiaSupportYears")(e.target.value)}
              />
            </Field>
            <MoneyField
              label="India/home-country home loan or property debt"
              hint="In U.S. dollars."
              value={inp.indiaPropertyDebt}
              onChange={set("indiaPropertyDebt")}
            />
            <MoneyField
              label="Other India/home-country family obligations"
              hint="Sibling education, medical care, family commitments."
              value={inp.indiaOtherObligations}
              onChange={set("indiaOtherObligations")}
            />
          </InputCard>

          <InputCard eyebrow="Step 3 · What you already have" title="Existing resources and coverage">
            <MoneyField
              label="Existing savings/investments available to family"
              hint="Amounts your family could actually use — not locked or earmarked elsewhere."
              value={inp.existingSavings}
              onChange={set("existingSavings")}
            />
            <MoneyField
              label="Existing individual life insurance"
              hint="Death benefit of policies you personally own (U.S. or India)."
              value={inp.existingIndividualCover}
              onChange={set("existingIndividualCover")}
            />
            <MoneyField
              label="Employer life insurance"
              hint="Usually ends when the job does — enter 0 to be conservative."
              value={inp.employerCover}
              onChange={set("employerCover")}
            />
            <MoneyField
              label="Estimated ongoing spouse income support, if any"
              hint="Total future earnings you'd count on from a surviving spouse."
              value={inp.spouseIncomeSupport}
              onChange={set("spouseIncomeSupport")}
            />
          </InputCard>

          <p className="text-xs leading-relaxed text-ink-400">{TERM_CALC_DISCLAIMER}</p>
        </div>

        {/* ------------------------------ Results ------------------------------ */}
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* Full line-item breakdown */}
          <ResultCard
            tone={r.gap > 0 ? "caution" : "positive"}
            eyebrow="Educational estimate"
            title="Your coverage gap, line by line"
            badge={r.gap > 0 ? "Gap to discuss" : "No gap at these inputs"}
          >
            {/* Needs */}
            <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">Family need</p>
            <div className="space-y-1">
              {r.needItems.map((i) => (
                <div key={i.label} className="flex items-center justify-between gap-3">
                  <span className="text-ink-600">{i.label}</span>
                  <span className="tabular-nums text-ink-800">{formatUsd(i.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 border-t border-ink-900/10 pt-1.5">
                <span className="font-semibold text-ink-900">Estimated total need</span>
                <span className="font-bold tabular-nums text-ink-900">{formatUsd(r.totalNeed)}</span>
              </div>
            </div>

            {/* Resources */}
            <p className="mt-3 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">
              Available resources (subtracted)
            </p>
            <div className="space-y-1">
              {r.resourceItems.map((i) => (
                <div key={i.label} className="flex items-center justify-between gap-3">
                  <span className="text-ink-600">{i.label}</span>
                  <span className="tabular-nums text-ink-800">− {formatUsd(i.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 border-t border-ink-900/10 pt-1.5">
                <span className="font-semibold text-ink-900">Available resources</span>
                <span className="font-bold tabular-nums text-ink-900">− {formatUsd(r.availableResources)}</span>
              </div>
            </div>

            {/* Gap */}
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-ink-900/5 px-3 py-2.5">
              <span className="font-bold text-ink-900">Estimated coverage gap</span>
              <span className="text-xl font-extrabold tabular-nums text-ink-900">{formatUsd(r.gap)}</span>
            </div>
          </ResultCard>

          {/* Conservative range */}
          <ResultCard tone="info" eyebrow="Framing, not precision" title="A conservative range to discuss">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Lower estimate", pct: "80%", value: r.gap * 0.8 },
                { label: "Base estimate", pct: "100%", value: r.gap },
                { label: "Higher cushion", pct: "120%", value: r.gap * 1.2 },
              ].map((b) => (
                <div key={b.label} className="rounded-xl border border-ink-900/10 bg-slate-50/70 p-3">
                  <p className="text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">{b.label}</p>
                  <p className="mt-1 text-sm font-extrabold tabular-nums text-ink-900">{formatUsd(b.value)}</p>
                  <p className="text-[0.625rem] text-ink-400">{b.pct} of gap</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-400">
              Every input is an estimate, so a range frames the agent conversation better than one number.
            </p>
          </ResultCard>

          {/* Term-length guidance */}
          <ResultCard tone="neutral" eyebrow="Term length" title="Suggested term-length guidance">
            <p>
              <span className="mr-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {TERM_GUIDANCE[inp.youngestChild].label}
              </span>
            </p>
            <p>{TERM_GUIDANCE[inp.youngestChild].text}</p>
            <p className="text-xs text-ink-400">
              General educational patterns only — always verify the right term length with a licensed agent.
            </p>
          </ResultCard>

          {/* Agent checklist */}
          <ResultCard tone="info" eyebrow="Bring to the meeting" title="Agent discussion checklist">
            <ul className="space-y-1.5">
              {agentQuestionsCalculator.map((q) => (
                <li key={q} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-none text-brand-500">✓</span>
                  <span className="text-ink-700">{q}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <p className="text-xs leading-relaxed text-ink-400">{TERM_CALC_DISCLAIMER}</p>
        </div>
      </div>

      {/* Email / download CTA — after the results */}
      <div className="mt-6">
        <LifeInsuranceEmailCTA resultsText={resultsText} />
      </div>
    </div>
  );
}
