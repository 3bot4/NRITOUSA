"use client";

import { useState } from "react";
import Link from "next/link";
import { eadProcessingData as D } from "@/data/eadProcessingData";
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
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
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

type Kind = "new" | "renewal" | "";
type YesNo = "yes" | "no" | "";

interface Inputs {
  category: string;
  kind: Kind;
  filedDate: string;
  currentEadExpiry: string;
  premium: YesNo;
}

const EMPTY: Inputs = { category: "", kind: "", filedDate: "", currentEadExpiry: "", premium: "" };

interface Result {
  decisionValue: string;
  decisionDetail: string;
  autoExtValue: string;
  autoExtDetail: string;
  autoExtTone: "ok" | "warn" | "info";
  nextSteps: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

function compute(inp: Inputs): Result {
  const now = new Date();
  const filed = parseDate(inp.filedDate);
  const expiry = parseDate(inp.currentEadExpiry);
  const cat = D.categories.find((c) => c.key === inp.category) ?? D.categories[D.categories.length - 1];
  const anchor = filed ? laterOf(filed, now) : now;
  const usesPremium = inp.premium === "yes" && cat.premiumEligible;

  /* decision window */
  let decisionValue: string;
  let decisionDetail: string;
  if (usesPremium) {
    const i765 = getPremiumFeeByForm("I-765")[0];
    const by = addBusinessDays(anchor, 30);
    decisionValue = `By ~${monthDayYear(by)}`;
    decisionDetail = `Premium processing is available for ${cat.label} (~30 business days${i765 ? `, fee ${i765.feeDisplay}` : ""}). "Action" can be approval, denial, or an RFE.`;
  } else {
    const low = addMonths(anchor, cat.monthsLow);
    const high = addMonths(anchor, cat.monthsHigh);
    decisionValue = `~${monthYear(low)} – ${monthYear(high)}`;
    decisionDetail = `General planning range for ${cat.label} (${cat.code}): ~${cat.monthsLow}–${cat.monthsHigh} months. Times vary widely by service center — check current USCIS processing times.`;
  }

  /* auto-extension */
  let autoExtValue: string;
  let autoExtDetail: string;
  let autoExtTone: Result["autoExtTone"];
  if (inp.kind === "renewal" && cat.autoExtension) {
    autoExtValue = `Up to ${D.autoExtensionDays} days`;
    autoExtTone = "ok";
    const until = expiry ? addDays(expiry, D.autoExtensionDays) : null;
    autoExtDetail = `A timely-filed renewal in ${cat.label} generally qualifies for the automatic EAD extension — up to ${D.autoExtensionDays} days past your current expiry${until ? ` (≈ ${monthDayYear(until)})` : ""}. Your Form I-797C receipt plus the expired card documents work authorization. Verify the current rule and your eligibility on USCIS.`;
  } else if (inp.kind === "renewal" && !cat.autoExtension) {
    autoExtValue = "No auto-extension";
    autoExtTone = "warn";
    autoExtDetail = cat.autoExtensionPreRule
      ? `${cat.label} (${cat.code}) renewals no longer get an automatic extension. A DHS interim final rule effective October 30, 2025 removed it, so a renewal received on or after that date does not extend your EAD — you must stop working when the card expires and may only resume once the new EAD is approved and received. If your renewal was received BEFORE October 30, 2025, the previous up-to-${D.autoExtensionDays}-day extension still runs. Confirm your receipt date on your Form I-797C.`
      : `${cat.label} (${cat.code}) renewals do not get an automatic extension. If your EAD expires before the renewal is approved, you are not authorized to work in the interim. File as early as USCIS allows and ask your attorney.`;
  } else if (inp.kind === "new") {
    autoExtValue = "N/A (new EAD)";
    autoExtTone = "info";
    autoExtDetail = "The automatic extension applies to renewals, not first-time EADs. You cannot work on this category until the EAD is approved and issued.";
  } else {
    autoExtValue = "Select new or renewal";
    autoExtTone = "info";
    autoExtDetail = "Tell us whether this is a new EAD or a renewal to check automatic-extension eligibility.";
  }

  /* next steps */
  const nextSteps: string[] = [];
  if (inp.kind === "renewal") {
    nextSteps.push("File your EAD renewal as early as USCIS permits (often up to 180 days before expiry) to reduce gap risk.");
    if (!cat.autoExtension) nextSteps.push("Renewals filed on or after October 30, 2025 get no automatic extension — plan for a gap in work authorization if the EAD expires before approval, and confirm the receipt date on your Form I-797C.");
  }
  if (cat.premiumEligible && inp.premium !== "yes") {
    nextSteps.push("Premium processing (~30 business days) is available for your category if you need the EAD faster.");
  }
  if (expiry && expiry.getTime() < now.getTime()) {
    nextSteps.push("Your entered EAD expiry is in the past — confirm your current work-authorization status with your employer and attorney immediately.");
  }
  nextSteps.push("Keep your Form I-797C receipt notice — it is what proves a timely renewal and any automatic extension.");
  nextSteps.push("This is an educational estimate — confirm your category, timing, and work authorization with your immigration attorney.");

  return { decisionValue, decisionDetail, autoExtValue, autoExtDetail, autoExtTone, nextSteps };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20";

const AUTO_TONE: Record<Result["autoExtTone"], string> = {
  ok: "border-emerald-200 bg-emerald-50/50",
  warn: "border-amber-200 bg-amber-50/50",
  info: "border-ink-900/10 bg-white",
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

export default function EadProcessingCalculator() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));
  const cat = D.categories.find((c) => c.key === inp.category);

  const result = submitted ? compute(inp) : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">EAD Processing Time</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your EAD timeline & auto-extension
        </h2>
        <p className="mt-1 text-sm text-ink-500">By category — with automatic-extension eligibility and gap-risk guidance.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This calculator is for educational planning only and is not legal advice.</strong>{" "}
        EAD times vary widely by category — verify at{" "}
        <a href={D.uscisProcessingTimesUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">USCIS processing times</a>{" "}
        and confirm your work authorization with your immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="EAD category">
              <select className={selectCls} value={inp.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select…</option>
                {D.categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label} {c.code !== "varies" ? `— ${c.code}` : ""}</option>
                ))}
              </select>
            </Field>
            <Field label="New or renewal?">
              <select className={selectCls} value={inp.kind} onChange={(e) => set("kind", e.target.value as Kind)}>
                <option value="">Select…</option><option value="new">New (first-time)</option><option value="renewal">Renewal</option>
              </select>
            </Field>
            <Field label="Application filed date" hint="(optional)">
              <input type="date" className={selectCls} value={inp.filedDate} onChange={(e) => set("filedDate", e.target.value)} />
            </Field>
            <Field label="Current EAD expiry" hint="(renewals)">
              <input type="date" className={selectCls} value={inp.currentEadExpiry} onChange={(e) => set("currentEadExpiry", e.target.value)} />
            </Field>
            {cat?.premiumEligible && (
              <Field label="Premium processing?" hint="(available for your category)">
                <select className={selectCls} value={inp.premium} onChange={(e) => set("premium", e.target.value as YesNo)}>
                  <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option>
                </select>
              </Field>
            )}
          </div>
          <button type="submit" className="w-full rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">
            Estimate My EAD Timeline
          </button>
        </form>
      ) : result ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Estimated EAD decision</p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{result.decisionValue}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{result.decisionDetail}</p>
          </div>

          <div className={`rounded-2xl border p-5 ${AUTO_TONE[result.autoExtTone]}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Automatic extension</p>
            <p className="mt-1 text-lg font-extrabold text-ink-900">{result.autoExtValue}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{result.autoExtDetail}</p>
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
            <Link href="/ead-renewal-gap" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-cyan-400 hover:shadow-sm">→ Avoid an EAD renewal gap</Link>
            <Link href="/advance-parole-processing-time" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-cyan-400 hover:shadow-sm">→ Advance parole timing</Link>
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
