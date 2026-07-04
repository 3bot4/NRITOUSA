"use client";

import { useState } from "react";
import Link from "next/link";
import { greenCardRenewalSources as S } from "@/data/greenCardRenewalData";

type Validity = "ten" | "two" | "not-sure" | "";
type YesNoNS = "yes" | "no" | "not-sure" | "";
type CardState = "expiring" | "expired" | "lost" | "damaged" | "not-sure" | "";

interface Inputs {
  validity: Validity;
  marriageConditional: YesNoNS;
  investorConditional: YesNoNS;
  cardState: CardState;
  removeConditions: YesNoNS;
}

const EMPTY: Inputs = {
  validity: "", marriageConditional: "", investorConditional: "", cardState: "", removeConditions: "",
};

interface Result {
  form: string;
  link: string;
  confident: boolean;
  reasoning: string;
  warnings: string[];
  steps: string[];
}

function compute(inp: Inputs): Result {
  const warnings: string[] = [];
  const steps: string[] = [];

  const looksConditional =
    inp.validity === "two" ||
    inp.marriageConditional === "yes" ||
    inp.investorConditional === "yes" ||
    inp.removeConditions === "yes";

  if (inp.investorConditional === "yes") {
    warnings.push("Investor (EB-5) conditional residents remove conditions with Form I-829 — a distinct process.");
    steps.push("Confirm your I-829 filing window (typically the 90 days before the 2-year card expires).");
    return {
      form: "Form I-829",
      link: S.formI829,
      confident: inp.validity !== "ten",
      reasoning: "You indicated an investor-based conditional (2-year) card, which is removed with Form I-829, not Form I-90.",
      warnings,
      steps: [...steps, "Do not file Form I-90 to remove EB-5 conditions.", "Confirm with an immigration attorney."],
    };
  }

  if (looksConditional && inp.validity !== "ten") {
    warnings.push("Filing Form I-90 for a conditional card is a common, high-risk mistake that can cause serious delays.");
    steps.push("Confirm your I-751 filing window (often the 90 days before your 2-year card expires).");
    return {
      form: "Form I-751",
      link: S.formI751,
      confident: inp.validity === "two" || inp.marriageConditional === "yes",
      reasoning: "You indicated a 2-year conditional (usually marriage-based) card or a need to remove conditions, which is handled with Form I-751 — not Form I-90.",
      warnings,
      steps: [...steps, "Do not use Form I-90 to remove conditions.", "Confirm with an immigration attorney if unsure."],
    };
  }

  if (inp.validity === "ten") {
    if (inp.cardState) steps.push("Form I-90 covers renewing an expiring/expired 10-year card and replacing a lost/damaged one.");
    steps.push("Confirm the current fee on the USCIS Fee Schedule and file online or by mail.");
    return {
      form: "Form I-90",
      link: S.formI90,
      confident: true,
      reasoning: "You indicated a 10-year permanent resident card, which is renewed or replaced with Form I-90.",
      warnings,
      steps,
    };
  }

  // Unsure
  warnings.push("You're not sure which card you have. Check the card's validity period first: 2 years usually means conditional (I-751/I-829); 10 years usually means I-90.");
  return {
    form: "Check your card first",
    link: S.formI90,
    confident: false,
    reasoning: "We couldn't determine your form with confidence. The card's validity period is the key clue.",
    warnings,
    steps: ["Look at how long your card is valid (2 years vs 10 years).", "If still unsure, confirm with USCIS or an immigration attorney before filing."],
  };
}

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function FormSelectorI90I751() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const result = submitted ? compute(inp) : null;

  return (
    <div id="form-selector" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Form Selector</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">Which form do you need — I-90, I-751, or I-829?</h2>
        <p className="mt-1 text-sm text-ink-500">Answer a few questions to see the likely form. Filing the wrong form can cause serious delays.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational planning only — not legal advice.</strong>{" "}
        When in doubt, confirm with USCIS or a qualified immigration attorney before filing anything.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card valid for 10 years or 2 years?">
              <select className={selectCls} value={inp.validity} onChange={(e) => set("validity", e.target.value as Validity)} aria-label="Card validity">
                <option value="">Select…</option><option value="ten">10 years</option><option value="two">2 years</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Marriage-based conditional card?">
              <select className={selectCls} value={inp.marriageConditional} onChange={(e) => set("marriageConditional", e.target.value as YesNoNS)} aria-label="Marriage-based conditional card">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Investor (EB-5) conditional card?">
              <select className={selectCls} value={inp.investorConditional} onChange={(e) => set("investorConditional", e.target.value as YesNoNS)} aria-label="Investor conditional card">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Card expired / expiring / lost / damaged?">
              <select className={selectCls} value={inp.cardState} onChange={(e) => set("cardState", e.target.value as CardState)} aria-label="Card state">
                <option value="">Select…</option><option value="expiring">Expiring</option><option value="expired">Expired</option><option value="lost">Lost</option><option value="damaged">Damaged</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Need to remove conditions?">
              <select className={selectCls} value={inp.removeConditions} onChange={(e) => set("removeConditions", e.target.value as YesNoNS)} aria-label="Need to remove conditions">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Show My Likely Form</button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${result.confident ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/50"}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Likely form</p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.form}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.reasoning}</p>
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">Open the official form page ↗</a>
          </div>

          {result.warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-700">Warnings</p>
              <ul className="space-y-2">
                {result.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-amber-500">!</span>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Next steps</p>
            <ul className="space-y-2">
              {result.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-blue-500">→</span>{s}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/green-card-renewal" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ Green card renewal guide</Link>
            <Link href="/replace-green-card" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ Replace green card</Link>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">This tool is for educational planning only and is not legal advice.</p>
          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">← Edit my details</button>
        </div>
      ) : null}
    </div>
  );
}
