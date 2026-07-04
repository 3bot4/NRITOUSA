"use client";

import { useState } from "react";
import { greenCardRenewalSources as S, greenCardRenewalConfig as C } from "@/data/greenCardRenewalData";

type Method = "online" | "mail" | "not-sure" | "";
type Reason = "renewal" | "lost" | "damaged" | "incorrect" | "name-changed" | "other" | "";
type YesNoNS = "yes" | "no" | "not-sure" | "";

interface Inputs {
  method: Method;
  reason: Reason;
  canAfford: YesNoNS;
  uscisError: YesNoNS;
  conditional: YesNoNS;
}

const EMPTY: Inputs = { method: "", reason: "", canAfford: "", uscisError: "", conditional: "" };

interface Result {
  feeSource: string;
  points: string[];
}

function compute(inp: Inputs): Result {
  const points: string[] = [];

  if (inp.conditional === "yes") {
    points.push("You indicated a 2-year conditional card. Form I-90 usually does not apply — the fee for Form I-751 or I-829 is what matters, and those are different processes. Confirm before paying.");
  }

  if (inp.method === "online") {
    points.push("Online filing fee: confirm the current Form I-90 online fee on the USCIS Fee Schedule (G-1055). Online and paper fees can differ.");
  } else if (inp.method === "mail") {
    points.push("Paper filing fee: confirm the current Form I-90 mail fee on the USCIS Fee Schedule (G-1055). It may differ from the online fee.");
  } else {
    points.push("Confirm both the online and paper Form I-90 fees on the USCIS Fee Schedule (G-1055) before choosing how to file.");
  }

  if (inp.uscisError === "yes") {
    points.push("If USCIS caused the error on your card, the filing fee may not apply. Check the Form I-90 instructions for USCIS-error cases.");
  } else if (inp.reason === "incorrect") {
    points.push("If the error came from your original application (not USCIS), a fee may be due. Review the Form I-90 instructions.");
  }

  if (inp.canAfford === "no") {
    points.push(C.feeWaiverAvailable + " Review the Form I-912 criteria before assuming you qualify.");
  } else if (inp.canAfford === "not-sure") {
    points.push("If paying the fee would be a hardship, a fee waiver (Form I-912) may be worth reviewing. Eligibility is limited.");
  }

  points.push("USCIS filing fees are generally non-refundable, even if a request is denied — file carefully.");

  return { feeSource: C.onlineFee, points };
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

export default function RenewalFeeChecker() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const result = submitted ? compute(inp) : null;

  return (
    <div id="fee-checker" className="scroll-mt-24 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Renewal Fee</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">Green card renewal fee reminder</h2>
        <p className="mt-1 text-sm text-ink-500">Get a personalized fee checklist and fee-waiver reminder. We never show fake dollar amounts.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Fees change — always verify.</strong>{" "}
        This tool does not hardcode a permanent fee. Confirm the current amount on the{" "}
        <a href={S.uscisFeeSchedule} target="_blank" rel="noopener noreferrer" className="font-semibold underline">official USCIS Fee Schedule</a>.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Filing method">
              <select className={selectCls} value={inp.method} onChange={(e) => set("method", e.target.value as Method)} aria-label="Filing method">
                <option value="">Select…</option><option value="online">Online</option><option value="mail">Mail</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Reason for filing">
              <select className={selectCls} value={inp.reason} onChange={(e) => set("reason", e.target.value as Reason)} aria-label="Reason for filing">
                <option value="">Select…</option><option value="renewal">Renewal (expiring/expired)</option><option value="lost">Lost / stolen</option><option value="damaged">Damaged</option><option value="incorrect">Incorrect information</option><option value="name-changed">Name changed</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Can you afford the fee?">
              <select className={selectCls} value={inp.canAfford} onChange={(e) => set("canAfford", e.target.value as YesNoNS)} aria-label="Can afford the fee">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Possible USCIS error on card?">
              <select className={selectCls} value={inp.uscisError} onChange={(e) => set("uscisError", e.target.value as YesNoNS)} aria-label="Possible USCIS error">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Conditional (2-year) card?">
              <select className={selectCls} value={inp.conditional} onChange={(e) => set("conditional", e.target.value as YesNoNS)} aria-label="Conditional card">
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Get My Fee Checklist</button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Your Form I-90 fee</p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.feeSource}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">We intentionally don't show a dollar amount here because USCIS fees change. Confirm the current figure on the official fee schedule.</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">What applies to you</p>
            <ul className="space-y-2">
              {result.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700"><span className="mt-0.5 flex-none text-blue-500">→</span>{p}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={S.uscisFeeSchedule} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Fee Schedule ↗</a>
            <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Form I-90 ↗</a>
            <a href={S.uscisFileOnline} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">File Online ↗</a>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">This tool is for educational planning only and is not legal advice.</p>
          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">← Edit my details</button>
        </div>
      ) : null}
    </div>
  );
}
