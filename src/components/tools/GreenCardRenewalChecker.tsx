"use client";

import { useState } from "react";
import Link from "next/link";
import { greenCardRenewalSources as S } from "@/data/greenCardRenewalData";

/* ─────────────────────── types ─────────────────────────────────────────── */

type CardType = "ten-year" | "conditional" | "not-sure" | "";
type CardStatus =
  | "expiring"
  | "expired"
  | "lost"
  | "stolen"
  | "damaged"
  | "incorrect"
  | "name-changed"
  | "never-received"
  | "other"
  | "";
type Pref = "online" | "mail" | "not-sure" | "";
type YesNo = "yes" | "no" | "";
type YesNoNS = "yes" | "no" | "not-sure" | "";

interface Inputs {
  cardType: CardType;
  cardStatus: CardStatus;
  expiration: string;
  travelSoon: YesNo;
  needProof: YesNo;
  pref: Pref;
  canPay: YesNoNS;
  hasAccount: YesNo;
  hasCopy: YesNo;
  pendingN400: YesNoNS;
}

const EMPTY: Inputs = {
  cardType: "", cardStatus: "", expiration: "", travelSoon: "", needProof: "",
  pref: "", canPay: "", hasAccount: "", hasCopy: "", pendingN400: "",
};

type Urgency = "Low" | "Medium" | "High";

interface Result {
  likelyForm: string;
  formOk: boolean;
  urgency: Urgency;
  headline: string;
  notes: string[];
  documents: string[];
  nextSteps: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

const replacementStatuses: CardStatus[] = ["lost", "stolen", "damaged", "never-received"];

function compute(inp: Inputs): Result {
  const notes: string[] = [];
  const nextSteps: string[] = [];
  const documents: string[] = [
    "A copy or photo of your current green card (front and back), if you have it",
  ];

  const conditional = inp.cardType === "conditional";
  const isReplacement = replacementStatuses.includes(inp.cardStatus);

  let likelyForm = "Form I-90";
  let formOk = true;
  let headline =
    "Form I-90 (Application to Replace Permanent Resident Card) is generally used to renew or replace a 10-year green card.";
  let urgency: Urgency = "Low";

  /* A. Conditional card */
  if (conditional) {
    likelyForm = "Usually Form I-751 or I-829 — not Form I-90";
    formOk = false;
    headline =
      "You may not be looking for a regular green card renewal. Conditional permanent residents usually remove conditions using Form I-751 or I-829, not Form I-90. Review official USCIS guidance or speak with an attorney.";
    urgency = "High";
    notes.push(
      "Filing Form I-90 instead of I-751/I-829 is a high-risk mistake that can cause serious delays.",
    );
    nextSteps.push("Check whether your card is marriage-based (I-751) or investor-based (I-829).");
    nextSteps.push("Confirm the correct form and filing window before you file anything.");
  }

  /* B. Lost / stolen / damaged / never received */
  if (!conditional && isReplacement) {
    headline =
      "Form I-90 may be used to replace a lost, stolen, damaged, or never-received Permanent Resident Card. If you need travel or urgent proof, check whether temporary I-551/ADIT proof may be needed.";
    urgency = "Medium";
    if (inp.cardStatus === "stolen") {
      notes.push("Consider filing a police report for your records and watch for identity misuse.");
    }
    if (inp.cardStatus === "never-received") {
      notes.push("Non-delivery has its own USCIS process and possible time limits — act promptly.");
    }
    documents.push("Any evidence related to the loss/theft/damage, per USCIS instructions");
  }

  /* C. Expiring within 6 months */
  if (!conditional && inp.cardStatus === "expiring") {
    headline =
      "You may be in the normal renewal planning window for a 10-year card. Verify timing with USCIS before filing.";
    urgency = "Low";
  }

  /* D. Already expired */
  if (!conditional && inp.cardStatus === "expired") {
    headline =
      "You may still be able to file Form I-90. Keep your receipt notice and check whether it extends validity for your situation.";
    urgency = "Medium";
    notes.push("An expired card can create friction for work, travel, and ID until you renew.");
  }

  if (!conditional && inp.cardStatus === "name-changed") {
    documents.push("Legal name-change evidence (e.g., marriage certificate or court order)");
  }
  if (!conditional && inp.cardStatus === "incorrect") {
    notes.push("Whether a fee applies may depend on whether USCIS or you caused the error.");
  }

  /* E. Travel soon */
  if (inp.travelSoon === "yes") {
    urgency = urgency === "Low" ? "Medium" : "High";
    notes.push(
      "Do not rely only on this tool for travel. Check USCIS and airline/consulate requirements, and consider whether you need temporary proof such as ADIT/I-551 documentation.",
    );
  }

  /* Need proof for work / DMV */
  if (inp.needProof === "yes") {
    urgency = urgency === "Low" ? "Medium" : urgency;
    notes.push(
      "For work or DMV proof, your USCIS receipt notice and any validity-extension documentation may help. Confirm what your employer/DMV accepts.",
    );
  }

  /* F. Fee cannot be paid */
  if (inp.canPay === "no") {
    notes.push(
      "Check whether you may qualify for a USCIS fee waiver (Form I-912). Do not assume eligibility.",
    );
  }

  if (inp.pendingN400 === "yes") {
    notes.push(
      "You mentioned a pending N-400 naturalization. Some applicants weigh whether to file I-90 as well — this is case-specific, so confirm with an attorney.",
    );
  }

  /* Filing preference / account */
  if (!conditional) {
    if (inp.pref === "online" || inp.pref === "not-sure") {
      nextSteps.push(
        inp.hasAccount === "yes"
          ? "Sign in to your USCIS online account and start Form I-90."
          : "Create a free USCIS online account to file Form I-90 online.",
      );
    }
    if (inp.pref === "mail") {
      nextSteps.push("Prepare a paper Form I-90 and mail it to the USCIS address in the instructions.");
    }
    nextSteps.push("Confirm the current Form I-90 fee on the USCIS Fee Schedule before you pay.");
    nextSteps.push("After filing, save your receipt notice and track your case with USCIS.");
  }
  nextSteps.push(
    "This is an educational estimate — confirm the correct form, fee, and documents with USCIS or an immigration attorney.",
  );

  return { likelyForm, formOk, urgency, headline, notes, documents, nextSteps };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20";

const URGENCY_CFG: Record<Urgency, { badge: string; label: string }> = {
  Low: { badge: "bg-emerald-100 text-emerald-800", label: "Urgency: Low" },
  Medium: { badge: "bg-amber-100 text-amber-800", label: "Urgency: Medium" },
  High: { badge: "bg-rose-100 text-rose-800", label: "Urgency: High" },
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

export default function GreenCardRenewalChecker() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = submitted ? compute(inp) : null;
  const cfg = result ? URGENCY_CFG[result.urgency] : null;

  return (
    <div id="green-card-renewal-tool" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Green Card Renewal</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Check Your Green Card Renewal Steps
        </h2>
        <p className="mt-1 text-sm text-ink-500">Answer a few questions for a personalized Form I-90 next-step checklist. No case number required.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational planning only — not legal advice.</strong>{" "}
        This tool does not collect your A-number, receipt number, or any sensitive data. Always verify with{" "}
        <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="font-semibold underline">official USCIS sources</a>.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card type">
              <select className={selectCls} value={inp.cardType} onChange={(e) => set("cardType", e.target.value as CardType)} aria-label="Card type">
                <option value="">Select…</option>
                <option value="ten-year">10-year permanent resident card</option>
                <option value="conditional">2-year conditional resident card</option>
                <option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Card status">
              <select className={selectCls} value={inp.cardStatus} onChange={(e) => set("cardStatus", e.target.value as CardStatus)} aria-label="Card status">
                <option value="">Select…</option>
                <option value="expiring">Expiring within 6 months</option>
                <option value="expired">Already expired</option>
                <option value="lost">Lost</option>
                <option value="stolen">Stolen</option>
                <option value="damaged">Damaged</option>
                <option value="incorrect">Incorrect information</option>
                <option value="name-changed">Name changed</option>
                <option value="never-received">Never received card</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Expiration date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.expiration} onChange={(e) => set("expiration", e.target.value)} aria-label="Expiration date" />
            </Field>
            <Field label="Need to travel soon?">
              <select className={selectCls} value={inp.travelSoon} onChange={(e) => set("travelSoon", e.target.value as YesNo)} aria-label="Need to travel soon">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Need proof for work or DMV?">
              <select className={selectCls} value={inp.needProof} onChange={(e) => set("needProof", e.target.value as YesNo)} aria-label="Need proof for work or DMV">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Filing preference">
              <select className={selectCls} value={inp.pref} onChange={(e) => set("pref", e.target.value as Pref)} aria-label="Filing preference">
                <option value="">Select…</option><option value="online">Online</option><option value="mail">Mail</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Can pay the filing fee?">
              <select className={selectCls} value={inp.canPay} onChange={(e) => set("canPay", e.target.value as YesNoNS)} aria-label="Can pay the filing fee">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Have a USCIS online account?">
              <select className={selectCls} value={inp.hasAccount} onChange={(e) => set("hasAccount", e.target.value as YesNo)} aria-label="Have a USCIS online account">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Have a copy/photo of your current card?">
              <select className={selectCls} value={inp.hasCopy} onChange={(e) => set("hasCopy", e.target.value as YesNo)} aria-label="Have a copy of your current card">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Any pending naturalization (N-400)?">
              <select className={selectCls} value={inp.pendingN400} onChange={(e) => set("pendingN400", e.target.value as YesNoNS)} aria-label="Any pending N-400">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
            Check My Renewal Steps
          </button>
        </form>
      ) : result && cfg ? (
        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${result.formOk ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-800 ring-1 ring-ink-900/10">Likely form: {result.likelyForm}</span>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}>{cfg.label}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.headline}</p>
          </div>

          {result.notes.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Important notes</p>
              <ul className="mt-2 space-y-2">
                {result.notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-amber-500">!</span>{n}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Documents to prepare</p>
            <ul className="mt-2 space-y-2">
              {result.documents.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-emerald-500">✓</span>{d}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Your next-step checklist</p>
            <ul className="space-y-2">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-blue-500">→</span>{s}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Official USCIS links</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Form I-90 ↗</a>
              <a href={S.uscisFileOnline} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">File Online ↗</a>
              <a href={S.uscisFeeSchedule} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Fee Schedule ↗</a>
              <a href={S.uscisProcessingTimes} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Processing Times ↗</a>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Reminder: fees change — always confirm the current amount on the USCIS Fee Schedule. Processing times vary — check the USCIS processing-times tool for Form I-90.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/renew-green-card-online" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ Renew green card online</Link>
            <Link href="/i90-vs-i751" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-emerald-400 hover:shadow-sm">→ I-90 vs I-751: which form?</Link>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This tool is for educational planning only and is not legal advice. Always confirm your case with USCIS or a qualified immigration attorney.
          </p>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my details
          </button>
        </div>
      ) : null}
    </div>
  );
}
