"use client";

import { useState } from "react";
import Link from "next/link";
import { nvcProcessingData as D, nvcLinks } from "@/data/nvcData";

/* ─────────────────────── date helpers ──────────────────────────────────── */

function parseDate(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}
function weeksBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 7));
}

/* ─────────────────────── types ─────────────────────────────────────────── */

type YesNo = "yes" | "no" | "";
type Category =
  | "IR1" | "CR1" | "IR5" | "F2A" | "F3" | "F4" | "EB" | "other" | "";

interface Inputs {
  uscisApprovalDate: string;
  welcome: YesNo;
  caseNumber: YesNo;
  feesPaid: YesNo;
  ds260: YesNo;
  docsUploaded: YesNo;
  docSubmissionDate: string;
  dq: YesNo;
  country: string;
  category: Category;
}

const EMPTY: Inputs = {
  uscisApprovalDate: "",
  welcome: "",
  caseNumber: "",
  feesPaid: "",
  ds260: "",
  docsUploaded: "",
  docSubmissionDate: "",
  dq: "",
  country: "",
  category: "",
};

interface Result {
  stageLabel: string;
  badge: string;
  stageDetail: string;
  nextStep: string;
  documents: string[];
  checkTimeframes: boolean;
  maybeInquiry: boolean;
  inquiryReason: string;
}

/* ─────────────────────── computation ───────────────────────────────────── */

function compute(inp: Inputs): Result {
  const now = new Date();
  const approval = parseDate(inp.uscisApprovalDate);
  const submitted = parseDate(inp.docSubmissionDate);

  const weeksSinceApproval = approval ? weeksBetween(approval, now) : null;
  const weeksSinceSubmit = submitted ? weeksBetween(submitted, now) : null;

  let stageLabel: string;
  let badge: string;
  let stageDetail: string;
  let nextStep: string;
  let documents: string[] = [];
  let checkTimeframes = false;
  let maybeInquiry = false;
  let inquiryReason = "";

  if (inp.dq === "yes") {
    stageLabel = "Documentarily qualified — waiting for interview";
    badge = "bg-emerald-100 text-emerald-800";
    stageDetail =
      "NVC has accepted your documents. Your case is documentarily qualified (DQ) and is in the queue for an interview appointment at your embassy or consulate.";
    nextStep =
      "Wait for the interview appointment letter. Keep passports and documents valid, and start planning your medical exam. Interview timing depends on appointment availability and, for preference categories, your priority date.";
    documents = [
      "Keep passports valid (6+ months beyond the expected interview)",
      "Originals of all civil documents you uploaded (birth, marriage, police certificates)",
      "Be ready to book the required medical exam once the interview is set",
    ];
    checkTimeframes = true;
    maybeInquiry = false;
    inquiryReason =
      "Once DQ, interview scheduling is handled by NVC and the embassy — a public inquiry usually only helps if you are outside the official interview-scheduling timeframe for your post.";
  } else if (inp.docsUploaded === "yes") {
    stageLabel = "Documents submitted — in NVC review";
    badge = "bg-blue-100 text-blue-700";
    stageDetail =
      "Your document package is submitted and waiting for NVC to review it. NVC reviews packages roughly in the order received.";
    nextStep =
      "Wait for NVC to review your documents. If something is missing, NVC will list it in CEAC — respond only to what they ask for. Do not resubmit duplicates, which can slow the review.";
    documents = [
      "Nothing new to submit unless NVC requests it in CEAC",
      "Check CEAC periodically for a review result or a document request",
    ];
    checkTimeframes = true;
    if (weeksSinceSubmit !== null && weeksSinceSubmit > D.docReviewWeeksHigh) {
      maybeInquiry = true;
      inquiryReason = `Your documents were submitted about ${weeksSinceSubmit} weeks ago, which is beyond the general ~${D.docReviewWeeksLow}–${D.docReviewWeeksHigh}-week review range. Confirm the official NVC document-review timeframe — if you are outside it, a public inquiry may be appropriate.`;
    }
  } else if (inp.ds260 === "yes") {
    stageLabel = "DS-260 done — upload your documents";
    badge = "bg-indigo-100 text-indigo-800";
    stageDetail =
      "You have submitted DS-260. The next step is uploading the Affidavit of Support, financial evidence, and civil documents to CEAC for each applicant.";
    nextStep =
      "Upload the Affidavit of Support (I-864) and financial evidence for the petitioner/sponsor, plus civil documents for each applicant. Check the country-specific document requirements before uploading.";
    documents = [
      "Affidavit of Support (I-864) + petitioner tax returns / W-2s / pay evidence",
      "Birth certificate for each applicant",
      "Marriage certificate (and divorce/death certificates if previously married)",
      "Police clearance certificate(s) per country rules",
      "Passport biographic page for each applicant",
    ];
  } else if (inp.feesPaid === "yes") {
    stageLabel = "Fees paid — complete DS-260";
    badge = "bg-indigo-100 text-indigo-800";
    stageDetail =
      "Your NVC fees are paid. Once payment clears in CEAC, the DS-260 immigrant visa application unlocks for each applicant.";
    nextStep =
      "Complete and submit the online DS-260 for every family member on the case. Then move on to uploading civil and financial documents.";
    documents = [
      "Information to complete DS-260 (addresses, work/travel history, family details)",
      "Passport details for each applicant",
    ];
  } else if (inp.caseNumber === "yes" || inp.welcome === "yes") {
    stageLabel = "Case number received — pay NVC fees";
    badge = "bg-amber-100 text-amber-800";
    stageDetail =
      "You have your NVC case number and invoice ID and can log in to CEAC. The first action is paying the required NVC fees.";
    nextStep =
      "Log in to the CEAC immigrant visa portal and pay the Affidavit of Support fee and the immigrant visa application fee. Allow a business day or two for payment to clear.";
    documents = [
      "Your NVC case number and invoice ID (from the welcome letter/email)",
      "A U.S. bank account for the CEAC fee payments",
    ];
  } else {
    stageLabel = "Waiting for the NVC welcome letter";
    badge = "bg-slate-100 text-slate-700";
    stageDetail =
      "USCIS has approved (or is sending) your petition to NVC. NVC will create your case and issue a welcome letter or email with your case number and invoice ID.";
    nextStep =
      "Watch your email and mail for the NVC welcome notice. You cannot start fee payment or DS-260 until you have the case number and invoice ID.";
    documents = [
      "Nothing to submit yet — you need the NVC case number first",
    ];
    if (weeksSinceApproval !== null && weeksSinceApproval > D.caseCreationWeeksHigh) {
      maybeInquiry = true;
      inquiryReason = `Your petition was approved about ${weeksSinceApproval} weeks ago, which is beyond the general ~${D.caseCreationWeeksLow}–${D.caseCreationWeeksHigh}-week case-creation range. Confirm the official NVC timeframe — if you are past it and have no case number, a public inquiry may help.`;
    }
    checkTimeframes = true;
  }

  return {
    stageLabel,
    badge,
    stageDetail,
    nextStep,
    documents,
    checkTimeframes,
    maybeInquiry,
    inquiryReason,
  };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="ml-1 text-xs font-normal text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function YesNoSelect({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <select className={selectCls} value={value} onChange={(e) => onChange(e.target.value as YesNo)}>
      <option value="">Select…</option>
      <option value="yes">Yes</option>
      <option value="no">No / not yet</option>
    </select>
  );
}

export default function NvcTimelineChecker() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = submitted ? compute(inp) : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">NVC Timeline & Next Step Checker</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Where are you in the NVC process — and what&apos;s next?
        </h2>
        <p className="mt-1 text-sm text-ink-500">Answer a few yes/no questions to find your NVC stage and next step. No sensitive data required.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This checker is for educational planning only and is not legal advice.</strong>{" "}
        We never ask for your full case number, invoice ID, passport number, or date of birth. Always verify with{" "}
        <a href={nvcLinks.ceac} target="_blank" rel="noopener noreferrer" className="font-semibold underline">CEAC</a>{" "}
        and the official{" "}
        <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="font-semibold underline">NVC timeframes</a>.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="USCIS petition approval date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.uscisApprovalDate} onChange={(e) => set("uscisApprovalDate", e.target.value)} />
            </Field>
            <Field label="NVC welcome letter received?">
              <YesNoSelect value={inp.welcome} onChange={(v) => set("welcome", v)} />
            </Field>
            <Field label="NVC case number received?">
              <YesNoSelect value={inp.caseNumber} onChange={(v) => set("caseNumber", v)} />
            </Field>
            <Field label="NVC fees paid?">
              <YesNoSelect value={inp.feesPaid} onChange={(v) => set("feesPaid", v)} />
            </Field>
            <Field label="DS-260 submitted?">
              <YesNoSelect value={inp.ds260} onChange={(v) => set("ds260", v)} />
            </Field>
            <Field label="Documents uploaded to CEAC?">
              <YesNoSelect value={inp.docsUploaded} onChange={(v) => set("docsUploaded", v)} />
            </Field>
            <Field label="Document submission date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.docSubmissionDate} onChange={(e) => set("docSubmissionDate", e.target.value)} />
            </Field>
            <Field label="Documentarily qualified (DQ)?">
              <YesNoSelect value={inp.dq} onChange={(v) => set("dq", v)} />
            </Field>
            <Field label="Embassy / consulate country" hint="(optional)">
              <input type="text" placeholder="e.g. India" className={selectCls} value={inp.country} onChange={(e) => set("country", e.target.value)} />
            </Field>
            <Field label="Visa category">
              <select className={selectCls} value={inp.category} onChange={(e) => set("category", e.target.value as Category)}>
                <option value="">Select…</option>
                <option value="IR1">IR1 (spouse of citizen)</option>
                <option value="CR1">CR1 (recent-marriage spouse)</option>
                <option value="IR5">IR5 (parent of citizen)</option>
                <option value="F2A">F2A (spouse/child of LPR)</option>
                <option value="F3">F3 (married child of citizen)</option>
                <option value="F4">F4 (sibling of citizen)</option>
                <option value="EB">Employment-based (EB)</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Check My NVC Stage
          </button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${result.badge}`}>Current stage</span>
            <p className="mt-2 text-lg font-extrabold text-ink-900">{result.stageLabel}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{result.stageDetail}</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Your next step</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.nextStep}</p>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Documents to have ready</p>
            <ul className="space-y-2">
              {result.documents.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-blue-500">→</span>{s}
                </li>
              ))}
            </ul>
            <Link href="/nvc-document-checklist-india" className="mt-3 inline-block text-xs font-semibold text-blue-700 underline">
              Full NVC document checklist for Indian applicants →
            </Link>
          </div>

          {result.checkTimeframes && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Check the official timeframe</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">
                NVC and embassy timelines change constantly and are never guaranteed. Before assuming a delay, compare where you are against the official NVC timeframes.
              </p>
              <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-amber-800 underline">
                Official NVC timeframes ↗
              </a>
            </div>
          )}

          {result.maybeInquiry && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-700">You may be outside normal timeframes</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.inquiryReason}</p>
              <Link href="/nvc-public-inquiry" className="mt-2 inline-block text-xs font-semibold text-rose-700 underline">
                When and how to submit an NVC public inquiry →
              </Link>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/nvc-processing-time" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-400 hover:shadow-sm">→ NVC processing time</Link>
            <Link href="/what-is-nvc-case-number" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-400 hover:shadow-sm">→ What is my NVC case number?</Link>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This checker is for educational planning only and is not legal advice. Always confirm your case in CEAC and with your immigration attorney.
          </p>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my answers
          </button>
        </div>
      ) : null}
    </div>
  );
}
