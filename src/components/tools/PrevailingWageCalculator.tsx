"use client";

import { useState } from "react";
import { prevailingWageData as W } from "@/data/prevailingWageData";

/* ─────────────────────── types ─────────────────────────────────────────── */

type Experience = "0-1" | "2-3" | "4-6" | "7+" | "";
type YesNo = "yes" | "no" | "";
type Basis = "year" | "hour";
type Level = "I" | "II" | "III" | "IV";

interface Inputs {
  experience: Experience;
  advancedDegreeRequired: YesNo;
  supervises: YesNo;
  independentJudgment: YesNo;
  offeredWage: string;
  prevailingWage: string;
  basis: Basis;
}

const EMPTY: Inputs = {
  experience: "", advancedDegreeRequired: "", supervises: "",
  independentJudgment: "", offeredWage: "", prevailingWage: "", basis: "year",
};

interface Result {
  level: Level;
  offerCheck: "ok" | "below" | "no-pw" | "no-offer";
  offerDetail: string;
  gapText: string;
  nextSteps: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

function estimateLevel(inp: Inputs): Level {
  let score = 0;
  score += inp.experience === "2-3" ? 1 : inp.experience === "4-6" ? 2 : inp.experience === "7+" ? 3 : 0;
  if (inp.advancedDegreeRequired === "yes") score += 1;
  if (inp.supervises === "yes") score += 1;
  if (inp.independentJudgment === "yes") score += 1;
  if (score <= 1) return "I";
  if (score === 2) return "II";
  if (score <= 4) return "III";
  return "IV";
}

function parseWage(v: string): number | null {
  const n = parseFloat((v || "").replace(/[$,\s]/g, ""));
  return isNaN(n) || n <= 0 ? null : n;
}

function compute(inp: Inputs): Result {
  const level = estimateLevel(inp);
  const offered = parseWage(inp.offeredWage);
  const pw = parseWage(inp.prevailingWage);
  const unit = inp.basis === "hour" ? "/hr" : "/yr";

  let offerCheck: Result["offerCheck"] = "no-offer";
  let offerDetail = "";
  let gapText = "";

  if (offered && pw) {
    if (offered >= pw) {
      offerCheck = "ok";
      const cushion = ((offered - pw) / pw) * 100;
      offerDetail = `Your offered wage ($${offered.toLocaleString()}${unit}) meets or exceeds the prevailing wage you entered ($${pw.toLocaleString()}${unit}).`;
      gapText = cushion > 0 ? `Cushion: about ${cushion.toFixed(1)}% above prevailing wage.` : "Exactly at the prevailing wage.";
    } else {
      offerCheck = "below";
      const gap = ((pw - offered) / pw) * 100;
      offerDetail = `Your offered wage ($${offered.toLocaleString()}${unit}) is BELOW the prevailing wage you entered ($${pw.toLocaleString()}${unit}).`;
      gapText = `Shortfall: about ${gap.toFixed(1)}% below prevailing wage. Employers must pay at least the prevailing wage (or the actual wage, whichever is higher). Ask your attorney/employer.`;
    }
  } else if (offered && !pw) {
    offerCheck = "no-pw";
    offerDetail = `You entered an offered wage ($${offered.toLocaleString()}${unit}) but not a prevailing wage. Look up your exact prevailing wage by SOC occupation + area on DOL FLAG, then compare.`;
  } else if (!offered && pw) {
    offerCheck = "no-offer";
    offerDetail = `You entered a prevailing wage ($${pw.toLocaleString()}${unit}). Add your offered wage to check whether it meets the requirement.`;
  } else {
    offerCheck = "no-offer";
    offerDetail = "Add your offered wage and (once you look it up) the prevailing wage for your SOC + area to compare.";
  }

  const nextSteps: string[] = [
    `Look up your exact prevailing wage by SOC occupation code and area of employment at the DOL wage search.`,
    `Confirm which wage level your employer used on the PWD / LCA — it drives the required wage.`,
  ];
  if (offerCheck === "below") {
    nextSteps.unshift("Your offer appears below the prevailing wage you entered — raise this with your employer's immigration attorney before filing.");
  }
  nextSteps.push("Remember: the required wage is the HIGHER of the prevailing wage and the employer's actual wage for similar workers.");
  nextSteps.push("This is an educational estimate — confirm your wage level and figure with your employer's immigration attorney.");

  return { level, offerCheck, offerDetail, gapText, nextSteps };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20";

const OFFER_CFG: Record<Result["offerCheck"], { badge: string; label: string }> = {
  ok: { badge: "bg-emerald-100 text-emerald-800", label: "Offer meets prevailing wage" },
  below: { badge: "bg-rose-100 text-rose-800", label: "Offer below prevailing wage" },
  "no-pw": { badge: "bg-amber-100 text-amber-800", label: "Look up your prevailing wage" },
  "no-offer": { badge: "bg-blue-100 text-blue-700", label: "Add wages to compare" },
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="ml-1 text-xs font-normal text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function PrevailingWageCalculator() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = submitted ? compute(inp) : null;
  const levelDef = result ? W.levels.find((l) => l.level === result.level)! : null;
  const offerCfg = result ? OFFER_CFG[result.offerCheck] : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Prevailing Wage Calculator</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your wage level & check an offer
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Answer a few questions to estimate which DOL wage level fits, then compare an offered wage to the prevailing wage.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This calculator is for educational planning only and is not legal advice.</strong>{" "}
        It does not set an official wage level or prevailing wage — those depend on your exact SOC occupation and area. Look up your figure at{" "}
        <a href={W.wageLookupUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">DOL FLAG wage search</a>{" "}
        and confirm with your employer&rsquo;s immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Experience the role requires">
              <select className={selectCls} value={inp.experience} onChange={(e) => set("experience", e.target.value as Experience)}>
                <option value="">Select…</option>
                <option value="0-1">0–1 years (entry)</option>
                <option value="2-3">2–3 years</option>
                <option value="4-6">4–6 years</option>
                <option value="7+">7+ years (senior)</option>
              </select>
            </Field>
            <Field label="Advanced degree required?" hint="(above the occupation's baseline)">
              <select className={selectCls} value={inp.advancedDegreeRequired} onChange={(e) => set("advancedDegreeRequired", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="Does the role supervise/lead others?">
              <select className={selectCls} value={inp.supervises} onChange={(e) => set("supervises", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="Uses independent judgment / complex tasks?">
              <select className={selectCls} value={inp.independentJudgment} onChange={(e) => set("independentJudgment", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Offered wage" hint="(number)">
              <input inputMode="decimal" placeholder="e.g. 120000" className={selectCls} value={inp.offeredWage} onChange={(e) => set("offeredWage", e.target.value)} />
            </Field>
            <Field label="Prevailing wage" hint="(if known)">
              <input inputMode="decimal" placeholder="from DOL lookup" className={selectCls} value={inp.prevailingWage} onChange={(e) => set("prevailingWage", e.target.value)} />
            </Field>
            <Field label="Basis">
              <select className={selectCls} value={inp.basis} onChange={(e) => set("basis", e.target.value as Basis)}>
                <option value="year">Per year</option><option value="hour">Per hour</option>
              </select>
            </Field>
          </div>

          <button type="submit" className="w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700">
            Estimate My Wage Level
          </button>
        </form>
      ) : result && levelDef && offerCfg ? (
        <div className="space-y-5">
          {/* level card */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Estimated wage level</p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{levelDef.name}</p>
            <p className="mt-1 text-xs text-ink-500">{levelDef.percentile}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{levelDef.summary}</p>
            <p className="mt-2 text-xs text-ink-400">Educational estimate only — DOL/your attorney determine the official level using the full worksheet.</p>
          </div>

          {/* offer check card */}
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${offerCfg.badge}`}>{offerCfg.label}</span>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.offerDetail}</p>
            {result.gapText && <p className="mt-1 text-sm font-semibold text-ink-900">{result.gapText}</p>}
          </div>

          {/* next steps */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">What to do next</p>
            <ul className="space-y-2">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-blue-500">→</span>{s}
                </li>
              ))}
            </ul>
            <a href={W.wageLookupUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-100 transition hover:bg-teal-50">
              🔗 Look up my prevailing wage on DOL FLAG
            </a>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This calculator is for educational planning only and is not legal advice. Always confirm your wage level and prevailing wage with your employer&rsquo;s immigration attorney.
          </p>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my details
          </button>
        </div>
      ) : null}
    </div>
  );
}
