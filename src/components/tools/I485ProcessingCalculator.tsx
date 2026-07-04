"use client";

import { useState } from "react";
import Link from "next/link";
import { i485ProcessingData as D } from "@/data/i485ProcessingData";

/* ─────────────────────── date helpers ──────────────────────────────────── */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
function parseDate(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}
function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}
function monthYear(d: Date | null): string {
  if (!d) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function laterOf(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

/* ─────────────────────── types ─────────────────────────────────────────── */

type Basis = "employment" | "family" | "other" | "";
type Country = "india" | "china" | "row" | "other" | "";
type PdCurrent = "yes" | "no" | "not-sure" | "";
type Status = "not-filed" | "filed" | "interview" | "rfe" | "approved" | "";
type YesNo = "yes" | "no" | "";

interface Inputs {
  basis: Basis;
  country: Country;
  pdCurrent: PdCurrent;
  status: Status;
  filedDate: string;
  interviewRequired: YesNo;
  concurrentEadAp: YesNo;
}

const EMPTY: Inputs = {
  basis: "", country: "", pdCurrent: "", status: "", filedDate: "",
  interviewRequired: "", concurrentEadAp: "",
};

interface Result {
  canFile: "yes" | "no" | "maybe" | "filed";
  canFileText: string;
  decisionValue: string;
  decisionDetail: string;
  eadApText: string;
  nextSteps: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

function compute(inp: Inputs): Result {
  const now = new Date();
  const filed = parseDate(inp.filedDate);
  const approved = inp.status === "approved";
  const alreadyFiled = inp.status === "filed" || inp.status === "interview" || inp.status === "rfe";
  const backlogged = inp.country === "india" || inp.country === "china";

  /* can you file? */
  let canFile: Result["canFile"];
  let canFileText: string;
  if (approved || alreadyFiled) {
    canFile = "filed";
    canFileText = approved ? "Your I-485 is approved — congratulations." : "Your I-485 is already filed and pending.";
  } else if (inp.pdCurrent === "yes") {
    canFile = "yes";
    canFileText = "Your priority date appears current — you may be able to file I-485 under the chart USCIS is honoring this month. Confirm the current Visa Bulletin and chart with your attorney.";
  } else if (inp.pdCurrent === "no") {
    canFile = "no";
    canFileText = backlogged
      ? "Your priority date is not current. For India/China employment cases this is the long wait — you generally cannot file I-485 until your date is current in the Visa Bulletin."
      : "Your priority date is not current yet — you generally cannot file I-485 until it is current in the Visa Bulletin.";
  } else {
    canFile = "maybe";
    canFileText = "Whether you can file depends on your priority date being current under the chart USCIS honors this month. Check the Visa Bulletin and confirm with your attorney.";
  }

  /* adjudication estimate (only meaningful once filed / fileable) */
  let decisionValue: string;
  let decisionDetail: string;
  if (approved) {
    decisionValue = "Approved";
    decisionDetail = "Your green card is approved. Watch for your card in the mail and keep your approval notice.";
  } else if (canFile === "no") {
    decisionValue = "Not fileable yet";
    decisionDetail = "The dominant wait for India/China employment cases is the priority-date backlog before you can file — not the I-485 adjudication itself. Track the Visa Bulletin.";
  } else {
    const anchor = filed ? laterOf(filed, now) : now;
    const interview = inp.interviewRequired === "yes";
    const low = addMonths(anchor, D.standardMonthsLow + (interview ? D.interviewExtraMonthsLow : 0));
    const high = addMonths(anchor, D.standardMonthsHigh + (interview ? D.interviewExtraMonthsHigh : 0));
    decisionValue = `~${monthYear(low)} – ${monthYear(high)}`;
    decisionDetail = `General planning range: ~${D.standardMonthsLow}–${D.standardMonthsHigh} months after filing${interview ? `, plus ~${D.interviewExtraMonthsLow}–${D.interviewExtraMonthsHigh} months if a field-office interview is required` : ""}. Times vary by field office — check current USCIS I-485 processing times.`;
  }

  /* EAD/AP */
  const eadApText = inp.concurrentEadAp === "yes"
    ? "You filed EAD (I-765) and Advance Parole (I-131) with your I-485 — these typically arrive months before the green card and let you work and travel while it is pending."
    : "You can file EAD (I-765) and Advance Parole (I-131) together with your I-485 to work and travel while it is pending. H-1B/L-1 holders may keep working/traveling on their visa instead.";

  /* next steps */
  const nextSteps: string[] = [];
  if (canFile === "no" || canFile === "maybe") {
    nextSteps.push("Track the monthly Visa Bulletin — you can file I-485 only when your priority date is current under the chart USCIS honors that month.");
    nextSteps.push("Prepare your I-485 package now (medical, documents) so you can file quickly when your date becomes current.");
  }
  if (canFile === "yes") {
    nextSteps.push("Confirm which chart (Final Action or Dates for Filing) USCIS is accepting this month before filing.");
    nextSteps.push("File EAD (I-765) and Advance Parole (I-131) concurrently to get work and travel authorization while I-485 is pending.");
    nextSteps.push("Schedule your I-693 medical exam with a USCIS-designated civil surgeon.");
  }
  if (inp.status === "rfe") {
    nextSteps.push("Respond to the RFE fully and on time with your attorney to avoid denial.");
  }
  if (inp.status === "interview") {
    nextSteps.push("Prepare for your interview — bring originals of your filed documents and any updates.");
  }
  nextSteps.push("This is an educational estimate — confirm your filing eligibility, chart, and documents with your immigration attorney.");

  return { canFile, canFileText, decisionValue, decisionDetail, eadApText, nextSteps };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20";

const CANFILE_CFG: Record<Result["canFile"], { badge: string; label: string }> = {
  yes: { badge: "bg-emerald-100 text-emerald-800", label: "May be able to file" },
  no: { badge: "bg-amber-100 text-amber-800", label: "Not fileable yet" },
  maybe: { badge: "bg-blue-100 text-blue-700", label: "Depends on the bulletin" },
  filed: { badge: "bg-indigo-100 text-indigo-800", label: "Already filed" },
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

export default function I485ProcessingCalculator() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = submitted ? compute(inp) : null;
  const cfg = result ? CANFILE_CFG[result.canFile] : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">I-485 Processing Time</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Can you file I-485 yet — and how long will it take?
        </h2>
        <p className="mt-1 text-sm text-ink-500">Check filing eligibility and estimate the adjustment-of-status timeline.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This calculator is for educational planning only and is not legal advice.</strong>{" "}
        Filing eligibility depends on the current Visa Bulletin — verify at{" "}
        <a href={D.visaBulletinUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">the official Visa Bulletin</a>{" "}
        and confirm with your immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Filing basis">
              <select className={selectCls} value={inp.basis} onChange={(e) => set("basis", e.target.value as Basis)}>
                <option value="">Select…</option>
                <option value="employment">Employment (I-140 based)</option>
                <option value="family">Family based</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Country of birth">
              <select className={selectCls} value={inp.country} onChange={(e) => set("country", e.target.value as Country)}>
                <option value="">Select…</option><option value="india">India</option><option value="china">China</option><option value="row">Rest of World</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Is your priority date current?">
              <select className={selectCls} value={inp.pdCurrent} onChange={(e) => set("pdCurrent", e.target.value as PdCurrent)}>
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="I-485 status">
              <select className={selectCls} value={inp.status} onChange={(e) => set("status", e.target.value as Status)}>
                <option value="">Select…</option>
                <option value="not-filed">Not filed yet</option>
                <option value="filed">Filed and pending</option>
                <option value="interview">Interview scheduled</option>
                <option value="rfe">RFE received</option>
                <option value="approved">Approved</option>
              </select>
            </Field>
            <Field label="I-485 filed date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.filedDate} onChange={(e) => set("filedDate", e.target.value)} />
            </Field>
            <Field label="Field-office interview required?">
              <select className={selectCls} value={inp.interviewRequired} onChange={(e) => set("interviewRequired", e.target.value as YesNo)}>
                <option value="">Not sure</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="Filing EAD + Advance Parole with it?">
              <select className={selectCls} value={inp.concurrentEadAp} onChange={(e) => set("concurrentEadAp", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
            Check My I-485 Timeline
          </button>
        </form>
      ) : result && cfg ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}>{cfg.label}</span>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.canFileText}</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Estimated I-485 decision</p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.decisionValue}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.decisionDetail}</p>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">EAD & Advance Parole</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.eadApText}</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">What to do next</p>
            <ul className="space-y-2">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-blue-500">→</span>{s}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/i485-documents-checklist" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ I-485 documents checklist</Link>
            <Link href="/eb2-eb3-priority-date-india" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ Is my priority date current?</Link>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This calculator is for educational planning only and is not legal advice. Always confirm your case with your immigration attorney.
          </p>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my details
          </button>
        </div>
      ) : null}
    </div>
  );
}
