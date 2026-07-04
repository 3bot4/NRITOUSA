"use client";

import { useState } from "react";
import Link from "next/link";
import { greenCardRenewalSources as S } from "@/data/greenCardRenewalData";

type Reason = "lost" | "stolen" | "damaged" | "name-changed" | "incorrect" | "never-received" | "expired" | "";
type YesNo = "yes" | "no" | "";
type YesNoNS = "yes" | "no" | "not-sure" | "";

interface Inputs {
  reason: Reason;
  travelSoon: YesNo;
  needProof: YesNo;
  hasCopy: YesNo;
  nameChanged: YesNo;
  uscisError: YesNoNS;
  conditional: YesNoNS;
}

const EMPTY: Inputs = {
  reason: "", travelSoon: "", needProof: "", hasCopy: "", nameChanged: "", uscisError: "", conditional: "",
};

interface Result {
  category: string;
  ok: boolean;
  documents: string[];
  warnings: string[];
  steps: string[];
}

function compute(inp: Inputs): Result {
  const documents: string[] = ["A copy or photo of your current/old green card, if available"];
  const warnings: string[] = [];
  const steps: string[] = [];

  let category = "Form I-90 replacement";
  let ok = true;

  if (inp.conditional === "yes") {
    category = "Different process — usually not Form I-90";
    ok = false;
    warnings.push("You indicated a 2-year conditional card. Conditional residents usually file Form I-751 or I-829, not Form I-90. Confirm before filing.");
  }

  const labels: Record<Exclude<Reason, "">, string> = {
    lost: "lost card",
    stolen: "stolen card",
    damaged: "damaged card",
    "name-changed": "name change",
    incorrect: "incorrect information",
    "never-received": "card never received",
    expired: "expired card",
  };
  if (inp.reason) steps.push(`Reason: ${labels[inp.reason]} — generally handled with Form I-90 (unless conditional).`);

  if (inp.reason === "stolen") warnings.push("Consider a police report for your records and watch for identity theft.");
  if (inp.reason === "damaged") steps.push("Follow USCIS instructions for submitting or returning the damaged card.");
  if (inp.reason === "never-received") warnings.push("Non-delivery has a specific USCIS process and possible time limits — act promptly.");
  if (inp.reason === "incorrect") {
    if (inp.uscisError === "yes") steps.push("If USCIS caused the error, the fee may not apply — check the instructions.");
    else steps.push("If the error came from your application, a fee may apply.");
  }
  if (inp.reason === "name-changed" || inp.nameChanged === "yes") {
    documents.push("Legal name-change evidence (marriage certificate or court order)");
  }

  if (inp.travelSoon === "yes" || inp.needProof === "yes") {
    warnings.push("If you need urgent travel/work/DMV proof, check whether a temporary I-551/ADIT stamp is available. Do not rely on this tool alone for travel.");
  }

  steps.push("Confirm the current fee on the USCIS Fee Schedule before filing.");
  steps.push("File Form I-90 (online or by mail) and save your receipt notice.");
  steps.push("This is an educational estimate — confirm with USCIS or an immigration attorney.");

  return { category, ok, documents, warnings, steps };
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

export default function ReplaceGreenCardChecker() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const result = submitted ? compute(inp) : null;

  return (
    <div id="replace-checker" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Replace Green Card</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">Replacement reason checker</h2>
        <p className="mt-1 text-sm text-ink-500">Find the likely I-90 category, documents, and warnings for your situation.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational planning only — not legal advice.</strong>{" "}
        See the official{" "}
        <a href={S.replaceGreenCard} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Replace Your Green Card</a>{" "}page.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Reason for replacement">
              <select className={selectCls} value={inp.reason} onChange={(e) => set("reason", e.target.value as Reason)} aria-label="Reason for replacement">
                <option value="">Select…</option><option value="lost">Lost</option><option value="stolen">Stolen</option><option value="damaged">Damaged</option><option value="name-changed">Name changed</option><option value="incorrect">Incorrect information</option><option value="never-received">Never received</option><option value="expired">Expired</option>
              </select>
            </Field>
            <Field label="Need to travel soon?">
              <select className={selectCls} value={inp.travelSoon} onChange={(e) => set("travelSoon", e.target.value as YesNo)} aria-label="Need to travel soon">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Need work / DMV proof?">
              <select className={selectCls} value={inp.needProof} onChange={(e) => set("needProof", e.target.value as YesNo)} aria-label="Need work or DMV proof">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Have a copy of the old card?">
              <select className={selectCls} value={inp.hasCopy} onChange={(e) => set("hasCopy", e.target.value as YesNo)} aria-label="Have a copy of the old card">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Name changed?">
              <select className={selectCls} value={inp.nameChanged} onChange={(e) => set("nameChanged", e.target.value as YesNo)} aria-label="Name changed">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Error caused by USCIS?">
              <select className={selectCls} value={inp.uscisError} onChange={(e) => set("uscisError", e.target.value as YesNoNS)} aria-label="Error caused by USCIS">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Conditional (2-year) card?">
              <select className={selectCls} value={inp.conditional} onChange={(e) => set("conditional", e.target.value as YesNoNS)} aria-label="Conditional card">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Replacement</button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${result.ok ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Likely category</p>
            <p className="mt-1 text-lg font-extrabold text-ink-900">{result.category}</p>
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

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Documents to prepare</p>
            <ul className="space-y-2">
              {result.documents.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-emerald-500">✓</span>{d}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Next steps</p>
            <ul className="space-y-2">
              {result.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-blue-500">→</span>{s}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/i90-vs-i751" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ I-90 vs I-751: which form?</Link>
            <Link href="/green-card-renewal-fee" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ Green card renewal fee</Link>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">This tool is for educational planning only and is not legal advice.</p>
          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">← Edit my details</button>
        </div>
      ) : null}
    </div>
  );
}
