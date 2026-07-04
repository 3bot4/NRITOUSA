"use client";

import { useState } from "react";
import { greenCardRenewalSources as S } from "@/data/greenCardRenewalData";

type YesNo = "yes" | "no" | "";
type CardReason = "renewal" | "replacement" | "other" | "";

interface Inputs {
  filingDate: string;
  receiptDate: string;
  biometricsDone: YesNo;
  rfe: YesNo;
  reason: CardReason;
  checkedTimes: YesNo;
}

const EMPTY: Inputs = {
  filingDate: "", receiptDate: "", biometricsDone: "", rfe: "", reason: "", checkedTimes: "",
};

interface Result {
  daysSince: number | null;
  stage: string;
  stageDetail: string;
  inquiryNote: string;
  checks: string[];
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

function compute(inp: Inputs): Result {
  const now = new Date();
  const filed = inp.filingDate ? new Date(inp.filingDate + "T00:00:00") : null;
  const daysSince = filed && !isNaN(filed.getTime()) ? Math.max(0, daysBetween(filed, now)) : null;

  let stage = "Waiting on USCIS";
  let stageDetail =
    "Your case is somewhere in the USCIS review process. Use your USCIS account and the official processing-times tool to see where Form I-90 stands.";

  if (inp.rfe === "yes") {
    stage = "Request for Evidence (RFE) stage";
    stageDetail = "USCIS needs more documentation. Respond fully and by the deadline to keep the case moving.";
  } else if (inp.biometricsDone === "yes") {
    stage = "Post-biometrics review";
    stageDetail = "Biometrics is complete and USCIS is running checks and reviewing your application. This does not guarantee that approval is imminent.";
  } else if (inp.receiptDate) {
    stage = "Receipt issued — awaiting biometrics or review";
    stageDetail = "USCIS has your case. If biometrics is required, watch for an appointment notice; otherwise the case moves to review.";
  } else if (filed) {
    stage = "Filed — awaiting receipt notice";
    stageDetail = "USCIS should issue a receipt notice (I-797C). For eligible renewals, it may extend green card validity.";
  }

  const checks: string[] = [
    "Check your USCIS case status online for the latest update.",
    "Compare your wait to the posted processing time for Form I-90 at your office.",
  ];
  if (inp.reason === "renewal") checks.push("Confirm whether your receipt notice extends your green card's validity.");
  if (inp.reason === "replacement") checks.push("If you need travel/work proof, check whether a temporary I-551/ADIT stamp is available.");
  if (inp.checkedTimes !== "yes") checks.push("You haven't checked the official USCIS processing times yet — do that first before assuming a delay.");

  let inquiryNote =
    "Only submit a USCIS case inquiry once your case passes the 'case inquiry date' USCIS publishes for Form I-90 at your office.";
  if (daysSince !== null && daysSince > 365) {
    inquiryNote =
      "Your case has been pending for over a year. Check the USCIS processing-times page — if you are past the posted 'case inquiry date', you may be able to submit a service request.";
  }

  return { daysSince, stage, stageDetail, inquiryNote, checks };
}

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="ml-1 text-xs font-normal text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function GreenCardProcessingChecker() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const result = submitted ? compute(inp) : null;

  return (
    <div id="processing-checker" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">I-90 Processing</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">Where is my green card renewal?</h2>
        <p className="mt-1 text-sm text-ink-500">Estimate your likely stage and what to check next. No case number needed.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational planning only — not legal advice.</strong>{" "}
        This is not an official case status. Check the{" "}
        <a href={S.uscisProcessingTimes} target="_blank" rel="noopener noreferrer" className="font-semibold underline">USCIS processing times</a>{" "}and your{" "}
        <a href={S.uscisCaseStatus} target="_blank" rel="noopener noreferrer" className="font-semibold underline">case status</a>.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Filing date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.filingDate} onChange={(e) => set("filingDate", e.target.value)} aria-label="Filing date" />
            </Field>
            <Field label="Receipt date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.receiptDate} onChange={(e) => set("receiptDate", e.target.value)} aria-label="Receipt date" />
            </Field>
            <Field label="Biometrics completed?">
              <select className={selectCls} value={inp.biometricsDone} onChange={(e) => set("biometricsDone", e.target.value as YesNo)} aria-label="Biometrics completed">
                <option value="">Not sure</option><option value="yes">Yes</option><option value="no">No / not required</option>
              </select>
            </Field>
            <Field label="RFE received?">
              <select className={selectCls} value={inp.rfe} onChange={(e) => set("rfe", e.target.value as YesNo)} aria-label="RFE received">
                <option value="">Not sure</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Reason for filing">
              <select className={selectCls} value={inp.reason} onChange={(e) => set("reason", e.target.value as CardReason)} aria-label="Reason for filing">
                <option value="">Select…</option><option value="renewal">Renewal (expiring/expired)</option><option value="replacement">Replacement (lost/stolen/damaged)</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Checked USCIS processing times?">
              <select className={selectCls} value={inp.checkedTimes} onChange={(e) => set("checkedTimes", e.target.value as YesNo)} aria-label="Checked USCIS processing times">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
            Check My Stage
          </button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Days since filing</p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.daysSince === null ? "—" : `${result.daysSince} days`}</p>
              {result.daysSince === null && <p className="mt-1 text-xs text-ink-500">Add your filing date for a day count.</p>}
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Likely current stage</p>
              <p className="mt-1 text-lg font-extrabold text-ink-900">{result.stage}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.stageDetail}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">What to check next</p>
            <ul className="space-y-2">
              {result.checks.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-blue-500">→</span>{c}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Outside normal processing time?</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.inquiryNote}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={S.uscisProcessingTimes} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Processing Times ↗</a>
            <a href={S.uscisCaseStatus} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Case Status ↗</a>
            <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Form I-90 ↗</a>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This tool is for educational planning only and is not legal advice. Processing times vary by office and change often.
          </p>
          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">← Edit my details</button>
        </div>
      ) : null}
    </div>
  );
}
