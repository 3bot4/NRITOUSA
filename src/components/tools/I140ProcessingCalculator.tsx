"use client";

import { useState } from "react";
import Link from "next/link";
import { i140ProcessingData as D } from "@/data/i140ProcessingData";
import { getPremiumFeeByForm } from "@/lib/premiumProcessing";

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
function addBusinessDays(d: Date, n: number): Date {
  const r = new Date(d);
  let added = 0;
  while (added < n) {
    r.setDate(r.getDate() + 1);
    const day = r.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return r;
}
function monthYear(d: Date | null): string {
  if (!d) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function monthDayYear(d: Date | null): string {
  if (!d) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function laterOf(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

/* ─────────────────────── types ─────────────────────────────────────────── */

type Category = "EB1A" | "EB1C" | "EB2" | "EB2-NIW" | "EB3" | "not-sure" | "";
type Premium = "yes" | "no" | "not-sure" | "";
type Status = "not-filed" | "filed" | "receipt" | "rfe" | "approved" | "";
type Country = "india" | "china" | "row" | "other" | "";

interface Inputs {
  category: Category;
  premium: Premium;
  status: Status;
  filedDate: string;
  country: Country;
}

const EMPTY: Inputs = { category: "", premium: "", status: "", filedDate: "", country: "" };

interface Result {
  approved: boolean;
  usesPremium: boolean;
  ppDays: number;
  decisionValue: string;
  decisionDetail: string;
  feeText: string;
  nextSteps: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

function compute(inp: Inputs): Result {
  const now = new Date();
  const filed = parseDate(inp.filedDate);
  const approved = inp.status === "approved";
  const usesPremium = inp.premium === "yes";
  // EB-1C and EB-2 NIW premium SLA is longer (~45 business days).
  const ppDays = inp.category === "EB1C" || inp.category === "EB2-NIW"
    ? D.niwEb1cPremiumBusinessDays
    : D.premiumBusinessDays;

  const anchor = filed ? laterOf(filed, now) : now;

  let decisionValue = "";
  let decisionDetail = "";

  if (approved) {
    decisionValue = "Approved";
    decisionDetail = "Your I-140 is approved. See the next steps for priority date, I-485, and H-1B extension implications.";
  } else if (usesPremium) {
    const by = addBusinessDays(anchor, ppDays);
    decisionValue = `By ~${monthDayYear(by)}`;
    decisionDetail = `Premium processing: USCIS acts within ~${ppDays} business days of a complete filing${filed ? " (counted from your filing date, or today if later)" : ""}. "Action" can be an approval, denial, or an RFE — not necessarily an approval.`;
  } else {
    const low = addMonths(anchor, D.standardMonthsLow);
    const high = addMonths(anchor, D.standardMonthsHigh);
    decisionValue = `~${monthYear(low)} – ${monthYear(high)}`;
    decisionDetail = `Standard processing planning range: ~${D.standardMonthsLow}–${D.standardMonthsHigh} months. Actual times vary by service center — check current USCIS I-140 processing times. Premium processing (~${ppDays} business days) may be available.`;
  }

  // Fee (from the shared premium-processing source of truth).
  const i140Fee = getPremiumFeeByForm("I-140")[0];
  const feeText = i140Fee
    ? `Premium processing fee for I-140: ${i140Fee.feeDisplay} (USCIS Form I-907). ${i140Fee.note}`
    : "Verify the current premium processing fee on the USCIS Form I-907 page.";

  const nextSteps: string[] = [];
  if (approved) {
    nextSteps.push("Note your priority date — with an approved I-140 you wait for it to become current in the Visa Bulletin (for India, often years) before filing I-485.");
    nextSteps.push("An approved I-140 pending 180+ days generally supports 3-year H-1B extensions and lets you keep it even if you change employers.");
    nextSteps.push("Do not let your employer withdraw the I-140 after 180 days — it protects your priority date and H-1B extensions.");
  } else if (inp.status === "rfe") {
    nextSteps.push("Respond to the RFE fully and on time with your attorney — premium processing's clock pauses until USCIS gets your response.");
  } else if (inp.status === "not-filed") {
    nextSteps.push("I-140 is filed after PERM approval, within the PERM's 180-day validity window.");
  } else {
    nextSteps.push("If timing matters (H-1B max-out, priority date approaching), ask whether premium processing your I-140 is worth it.");
  }
  if (inp.premium === "not-sure") {
    nextSteps.push(`Premium processing is available for most I-140 categories (~${D.premiumBusinessDays} business days; ~${D.niwEb1cPremiumBusinessDays} for EB-1C and EB-2 NIW).`);
  }
  nextSteps.push("Premium processing speeds USCIS action, not Visa Bulletin movement or green card availability.");
  nextSteps.push("This is an educational estimate — confirm your case with your employer's immigration attorney.");

  return { approved, usesPremium, ppDays, decisionValue, decisionDetail, feeText, nextSteps };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="ml-1 text-xs font-normal text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function I140ProcessingCalculator() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = submitted ? compute(inp) : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">I-140 Processing Time</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your I-140 decision window
        </h2>
        <p className="mt-1 text-sm text-ink-500">Standard vs premium processing, the fee, and what happens after approval.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This calculator is for educational planning only and is not legal advice.</strong>{" "}
        USCIS times change — verify at{" "}
        <a href={D.uscisProcessingTimesUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">USCIS processing times</a>{" "}
        and confirm your case with your employer&rsquo;s immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Green card category">
              <select className={selectCls} value={inp.category} onChange={(e) => set("category", e.target.value as Category)}>
                <option value="">Select…</option>
                <option value="EB1A">EB-1A (extraordinary ability)</option>
                <option value="EB1C">EB-1C (multinational manager)</option>
                <option value="EB2">EB-2 (advanced degree)</option>
                <option value="EB2-NIW">EB-2 NIW (national interest waiver)</option>
                <option value="EB3">EB-3 (skilled worker)</option>
                <option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Premium processing?">
              <select className={selectCls} value={inp.premium} onChange={(e) => set("premium", e.target.value as Premium)}>
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Current status">
              <select className={selectCls} value={inp.status} onChange={(e) => set("status", e.target.value as Status)}>
                <option value="">Select…</option>
                <option value="not-filed">Not filed yet</option>
                <option value="filed">Filed (no receipt yet)</option>
                <option value="receipt">Receipt received / pending</option>
                <option value="rfe">RFE received</option>
                <option value="approved">Approved</option>
              </select>
            </Field>
            <Field label="I-140 filed date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.filedDate} onChange={(e) => set("filedDate", e.target.value)} />
            </Field>
            <Field label="Country of birth">
              <select className={selectCls} value={inp.country} onChange={(e) => set("country", e.target.value as Country)}>
                <option value="">Select…</option><option value="india">India</option><option value="china">China</option><option value="row">Rest of World</option><option value="other">Other</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
            Estimate My I-140 Timeline
          </button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Estimated I-140 decision</p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.decisionValue}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.decisionDetail}</p>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Premium processing fee</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.feeText}</p>
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
            <Link href="/i140-approved-what-next" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-indigo-400 hover:shadow-sm">→ I-140 approved — what next</Link>
            <Link href="/eb2-eb3-priority-date-india" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-indigo-400 hover:shadow-sm">→ When can I file I-485?</Link>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This calculator is for educational planning only and is not legal advice. Always confirm your case with your employer&rsquo;s immigration attorney.
          </p>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my details
          </button>
        </div>
      ) : null}
    </div>
  );
}
