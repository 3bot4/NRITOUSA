"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import {
  evaluateAsset,
  type AssistantInputs,
  type AssistantResult,
  type ResultCategory,
} from "./keepAssistantLogic";

const TOOL_SLUG = "should-nris-keep-investments-in-india-assistant";

type QKey = keyof AssistantInputs;

interface Question {
  key: QKey;
  legend: string;
  help?: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    key: "usPerson",
    legend: "Are you currently a US person for tax purposes?",
    help: "US citizen, green-card holder, or someone who meets the substantial-presence test.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    key: "asset",
    legend: "What type of Indian asset are you reviewing?",
    options: [
      { value: "stocks", label: "Direct Indian stocks" },
      { value: "mutual-fund", label: "Indian mutual fund or ETF" },
      { value: "ulip", label: "ULIP or pooled investment product" },
      { value: "nre-fd", label: "NRE fixed deposit" },
      { value: "fcnr", label: "FCNR deposit" },
      { value: "nro-fd", label: "NRO fixed deposit" },
      { value: "real-estate", label: "Indian real estate" },
      { value: "ppf", label: "PPF" },
      { value: "nps", label: "NPS" },
      { value: "gold", label: "Gold or Sovereign Gold Bond" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "returnPlan",
    legend: "Do you expect to return to India?",
    options: [
      { value: "within-3", label: "Within 3 years" },
      { value: "3-7", label: "In 3–7 years" },
      { value: "uncertain", label: "Possibly, but uncertain" },
      { value: "no-plan", label: "No current plan" },
    ],
  },
  {
    key: "horizon",
    legend: "When are you likely to need this money?",
    options: [
      { value: "under-2", label: "Within 2 years" },
      { value: "2-5", label: "In 2–5 years" },
      { value: "over-5", label: "More than 5 years" },
      { value: "no-date", label: "No defined date" },
    ],
  },
  {
    key: "currency",
    legend: "In which currency will the likely goal be paid?",
    options: [
      { value: "usd", label: "Mostly US dollars" },
      { value: "inr", label: "Mostly Indian rupees" },
      { value: "both", label: "Both" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    key: "portion",
    legend: "Is this asset a meaningful portion of your total investment portfolio?",
    options: [
      { value: "under-10", label: "Under 10%" },
      { value: "10-25", label: "10%–25%" },
      { value: "over-25", label: "More than 25%" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    key: "reporting",
    legend: "For US persons: are your foreign accounts and assets already being reported?",
    help: "FBAR (FinCEN 114) and FATCA (Form 8938), where required.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
];

const CATEGORY_STYLE: Record<ResultCategory, { icon: string; ring: string; chip: string }> = {
  "simple-keep": { icon: "✅", ring: "border-emerald-300 bg-emerald-50/60", chip: "bg-emerald-600" },
  "keep-review": { icon: "🔎", ring: "border-sky-300 bg-sky-50/60", chip: "bg-sky-600" },
  "high-friction": { icon: "⚠️", ring: "border-amber-300 bg-amber-50/70", chip: "bg-amber-600" },
  "favor-usd": { icon: "💵", ring: "border-violet-300 bg-violet-50/60", chip: "bg-violet-600" },
  "return-changes": { icon: "🔁", ring: "border-teal-300 bg-teal-50/60", chip: "bg-teal-600" },
  "pro-review": { icon: "🧑‍⚖️", ring: "border-rose-300 bg-rose-50/60", chip: "bg-rose-600" },
  "more-info": { icon: "❓", ring: "border-slate-300 bg-slate-50", chip: "bg-slate-600" },
};

const EMPTY: Partial<AssistantInputs> = {};

export default function KeepInvestmentAssistant() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<AssistantInputs>>(EMPTY);
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [started, setStarted] = useState(false);
  const focusRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const current = answers[q.key];

  // Move focus to the step prompt (or result) on change — keyboard + SR friendly.
  useEffect(() => {
    if (result) resultRef.current?.focus();
    else focusRef.current?.focus();
  }, [step, result]);

  const onStart = () => {
    if (started) return;
    setStarted(true);
    trackEvent("tool_started", { tool_slug: TOOL_SLUG });
  };

  const choose = (value: string) => {
    onStart();
    setAnswers((p) => ({ ...p, [q.key]: value as AssistantInputs[QKey] }));
  };

  const next = () => {
    if (!current) return;
    trackEvent("tool_step_next", { tool_slug: TOOL_SLUG, step: q.key });
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      const r = evaluateAsset(answers as AssistantInputs);
      setResult(r);
      // Coarse, non-identifying labels only — never balances, names, or free text.
      trackEvent("tool_completed", {
        tool_slug: TOOL_SLUG,
        result_category: r.category,
        asset_type: answers.asset,
      });
    }
  };

  const back = () => {
    if (result) {
      setResult(null);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    setResult(null);
    setAnswers(EMPTY);
    setStep(0);
    setStarted(false);
  };

  const trackLink = (kind: "section" | "guide") =>
    trackEvent("related_link_clicked", { tool_slug: TOOL_SLUG, link_type: kind });

  const style = result ? CATEGORY_STYLE[result.category] : null;

  return (
    <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/50 to-white p-5 shadow-card sm:p-7 print:border-0 print:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Interactive · one asset at a time</p>
          <h3 className="mt-0.5 text-lg font-extrabold tracking-tight text-ink-900 sm:text-xl">
            Should I keep this India investment?
          </h3>
        </div>
        {!result && (
          <p className="text-xs font-semibold text-ink-500" aria-hidden>
            Step {step + 1} of {total}
          </p>
        )}
      </div>

      {/* Progress bar (decorative; step text above is the accessible status) */}
      {!result && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10 print:hidden" aria-hidden>
          <div
            className="h-full rounded-full bg-brand-500 transition-all motion-reduce:transition-none"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      )}

      {!result ? (
        <div className="mt-5">
          <fieldset>
            <legend className="sr-only">{q.legend}</legend>
            <p ref={focusRef} tabIndex={-1} className="text-base font-bold text-ink-900 outline-none">
              {q.legend}
            </p>
            {q.help && <p className="mt-1 text-xs leading-relaxed text-ink-500">{q.help}</p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt) => {
                const id = `${baseId}-${q.key}-${opt.value}`;
                const active = current === opt.value;
                return (
                  <label
                    key={opt.value}
                    htmlFor={id}
                    className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                      active
                        ? "border-brand-500 bg-brand-50 font-semibold text-brand-800 ring-2 ring-brand-500/20"
                        : "border-ink-900/10 bg-white text-ink-700 hover:border-brand-300"
                    }`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`${baseId}-${q.key}`}
                      value={opt.value}
                      checked={active}
                      onChange={() => choose(opt.value)}
                      className="h-4 w-4 accent-brand-600"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex min-h-11 items-center rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!current}
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step < total - 1 ? "Next →" : "See my read →"}
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-5 outline-none"
        >
          <div className={`rounded-2xl border p-5 ${style?.ring}`}>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full ${style?.chip} px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-white`}>
                <span aria-hidden>{style?.icon}</span> Educational read
              </span>
              <span className="text-xs font-bold text-ink-500">Main issue: {result.mainIssue}</span>
            </div>
            <p className="mt-2.5 text-base font-bold text-ink-900">{result.categoryLabel}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.summary}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Why — based on your answers</p>
            <ul className="mt-2 space-y-2">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
                  <span aria-hidden className="mt-0.5 flex-none text-brand-500">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              href={result.sectionHref}
              onClick={() => trackLink("section")}
              className="rounded-xl border border-brand-200 bg-brand-50/50 p-3.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-100"
            >
              ↓ Read on this page: {result.sectionLabel}
            </a>
            {result.guideLinks.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                onClick={() => trackLink("guide")}
                className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-800 transition hover:border-brand-300"
              >
                → {g.label}
              </Link>
            ))}
          </div>

          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <strong>Always compare the after-tax and after-currency outcome</strong> against a US-based
            alternative before acting. This is educational triage for one asset — not personalized
            investment, tax, or legal advice, and never a recommendation to buy or sell. Your inputs stay in
            your browser and are not sent to any server.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              ↻ Start over
            </button>
            <button
              type="button"
              onClick={back}
              className="inline-flex min-h-11 items-center rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              ← Change last answer
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-11 items-center rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              🖨 Print this read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
