"use client";

import { useState } from "react";
import { greenCardRenewalSources as S } from "@/data/greenCardRenewalData";

type CardType = "ten-year" | "conditional" | "not-sure" | "";
type Reason = "renewal" | "lost" | "damaged" | "name-changed" | "incorrect" | "other" | "";
type YesNo = "yes" | "no" | "";

interface Inputs {
  cardType: CardType;
  reason: Reason;
  hasAccount: YesNo;
  hasCopy: YesNo;
  hasNameDoc: YesNo;
  canPayOnline: YesNo;
  needWaiver: YesNo;
  preferPaper: YesNo;
}

const EMPTY: Inputs = {
  cardType: "", reason: "", hasAccount: "", hasCopy: "", hasNameDoc: "",
  canPayOnline: "", needWaiver: "", preferPaper: "",
};

interface Result {
  score: number;
  scoreLabel: string;
  mailMayBeNeeded: boolean;
  missing: string[];
  ready: string[];
  notes: string[];
}

function compute(inp: Inputs): Result {
  const missing: string[] = [];
  const ready: string[] = [];
  const notes: string[] = [];

  const needsNameDoc = inp.reason === "name-changed";

  // Weighted readiness checks (only those relevant).
  const checks: { ok: boolean; readyText: string; missingText: string }[] = [
    { ok: inp.hasAccount === "yes", readyText: "USCIS online account ready", missingText: "Create a free USCIS online account" },
    { ok: inp.hasCopy === "yes", readyText: "Copy/photo of current card on hand", missingText: "Get a clear copy/photo of your current green card" },
    { ok: inp.canPayOnline === "yes" || inp.needWaiver === "yes", readyText: "Payment or fee-waiver path identified", missingText: "Decide how you'll pay the fee (or whether to request a fee waiver)" },
  ];
  if (needsNameDoc) {
    checks.push({ ok: inp.hasNameDoc === "yes", readyText: "Legal name-change document ready", missingText: "Gather your legal name-change evidence (marriage certificate or court order)" });
  }

  for (const c of checks) {
    if (c.ok) ready.push(c.readyText);
    else missing.push(c.missingText);
  }

  const score = Math.round((ready.length / checks.length) * 100);
  const scoreLabel = score >= 80 ? "You look ready to file online" : score >= 50 ? "Almost ready — a few items left" : "Gather a few things first";

  let mailMayBeNeeded = false;
  if (inp.cardType === "conditional") {
    mailMayBeNeeded = false;
    notes.push("You selected a 2-year conditional card. Form I-90 usually does not apply — review Form I-751 or I-829 before filing anything.");
  }
  if (inp.preferPaper === "yes") {
    mailMayBeNeeded = true;
    notes.push("You prefer paper filing — you can mail Form I-90 to the address in the official instructions. Fees may differ from online.");
  }
  if (inp.hasAccount === "no" && inp.preferPaper !== "yes") {
    notes.push("Online filing needs a free USCIS account. If you'd rather not create one, you can file by mail instead.");
  }
  if (inp.needWaiver === "yes") {
    notes.push("If you request a fee waiver (Form I-912), review the eligibility criteria carefully — approval is not guaranteed.");
  }

  return { score, scoreLabel, mailMayBeNeeded, missing, ready, notes };
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

export default function RenewOnlineChecklist() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const result = submitted ? compute(inp) : null;

  return (
    <div id="online-checklist" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Online Filing</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">Online filing readiness check</h2>
        <p className="mt-1 text-sm text-ink-500">See if you're ready to file Form I-90 online, or whether mail filing may fit better.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational planning only — not legal advice.</strong>{" "}
        File on the official{" "}
        <a href={S.uscisFileOnline} target="_blank" rel="noopener noreferrer" className="font-semibold underline">USCIS File Online</a>{" "}portal. Never share your USCIS password with anyone.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card type">
              <select className={selectCls} value={inp.cardType} onChange={(e) => set("cardType", e.target.value as CardType)} aria-label="Card type">
                <option value="">Select…</option><option value="ten-year">10-year card</option><option value="conditional">2-year conditional card</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Renewal / replacement reason">
              <select className={selectCls} value={inp.reason} onChange={(e) => set("reason", e.target.value as Reason)} aria-label="Reason">
                <option value="">Select…</option><option value="renewal">Renewal (expiring/expired)</option><option value="lost">Lost / stolen</option><option value="damaged">Damaged</option><option value="name-changed">Name changed</option><option value="incorrect">Incorrect information</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Have a USCIS online account?">
              <select className={selectCls} value={inp.hasAccount} onChange={(e) => set("hasAccount", e.target.value as YesNo)} aria-label="Have a USCIS online account">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Have a copy/photo of your card?">
              <select className={selectCls} value={inp.hasCopy} onChange={(e) => set("hasCopy", e.target.value as YesNo)} aria-label="Have a card copy">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Have legal name-change document (if needed)?">
              <select className={selectCls} value={inp.hasNameDoc} onChange={(e) => set("hasNameDoc", e.target.value as YesNo)} aria-label="Have name-change document">
                <option value="">Not applicable</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Can pay the fee online?">
              <select className={selectCls} value={inp.canPayOnline} onChange={(e) => set("canPayOnline", e.target.value as YesNo)} aria-label="Can pay online">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Need a fee waiver?">
              <select className={selectCls} value={inp.needWaiver} onChange={(e) => set("needWaiver", e.target.value as YesNo)} aria-label="Need a fee waiver">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Prefer paper filing?">
              <select className={selectCls} value={inp.preferPaper} onChange={(e) => set("preferPaper", e.target.value as YesNo)} aria-label="Prefer paper filing">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Readiness</button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Online filing readiness</p>
            <p className="mt-1 text-3xl font-extrabold text-ink-900">{result.score}%</p>
            <p className="mt-1 text-sm font-semibold text-ink-700">{result.scoreLabel}</p>
            {result.mailMayBeNeeded && <p className="mt-1 text-xs text-ink-600">Based on your answers, mail filing may fit you better than online.</p>}
          </div>

          {result.missing.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-700">Still to do</p>
              <ul className="space-y-2">
                {result.missing.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-amber-500">•</span>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {result.ready.length > 0 && (
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Ready</p>
              <ul className="space-y-2">
                {result.ready.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-emerald-500">✓</span>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {result.notes.length > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Notes</p>
              <ul className="space-y-2">
                {result.notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-blue-500">→</span>{n}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <a href={S.uscisFileOnline} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">File Online ↗</a>
            <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Form I-90 ↗</a>
            <a href={S.uscisFeeSchedule} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Fee Schedule ↗</a>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">This tool is for educational planning only and is not legal advice.</p>
          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">← Edit my details</button>
        </div>
      ) : null}
    </div>
  );
}
