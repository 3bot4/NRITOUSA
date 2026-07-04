"use client";

import { useState } from "react";
import Link from "next/link";

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
function addYears(d: Date, n: number): Date {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() + n);
  return r;
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function monthDayYear(d: Date | null): string {
  if (!d) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ─────────────────────── types ─────────────────────────────────────────── */

type YesNo = "yes" | "no" | "";
type YesNoNotSure = "yes" | "no" | "not-sure" | "";
type Country = "india" | "china" | "row" | "other" | "";

interface Inputs {
  h1bStart: string;
  h1bExpiration: string;
  daysOutside: string;
  permFiled: string;
  permApproved: YesNo;
  i140Filed: YesNo;
  i140Approved: YesNo;
  pdCurrent: YesNoNotSure;
  country: Country;
}

const EMPTY: Inputs = {
  h1bStart: "", h1bExpiration: "", daysOutside: "", permFiled: "",
  permApproved: "", i140Filed: "", i140Approved: "", pdCurrent: "", country: "",
};

type Risk = "low" | "medium" | "high" | "missing";

interface Result {
  risk: Risk;
  maxOutDate: Date | null;
  recaptureDays: number;
  cards: { title: string; value: string; detail: string }[];
  checklist: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

function compute(inp: Inputs): Result {
  const now = new Date();
  const start = parseDate(inp.h1bStart);
  const exp = parseDate(inp.h1bExpiration);
  const recaptureDays = Math.max(0, parseInt(inp.daysOutside || "0", 10) || 0);
  const permFiled = parseDate(inp.permFiled);

  // Base six-year max-out = first H-1B start + 6 years, plus recaptured days.
  let maxOutDate: Date | null = null;
  if (start) {
    maxOutDate = addDays(addYears(start, 6), recaptureDays);
  }

  // PERM filed 365+ days before max-out generally supports 1-year extensions
  // beyond 6 years (AC21 §106(a)); an approved I-140 supports 3-year extensions.
  const permAgeDays = permFiled ? Math.floor((now.getTime() - permFiled.getTime()) / 86400000) : 0;
  const perm365 = permFiled != null && permAgeDays >= 365;
  const i140Approved = inp.i140Approved === "yes";
  const pdNotCurrent = inp.pdCurrent === "no" || inp.pdCurrent === "not-sure";
  const backlogged = inp.country === "india" || inp.country === "china";

  /* --- Risk assessment --- */
  let risk: Risk = "missing";
  if (i140Approved) {
    // Approved I-140 + not current → 3-year extensions available.
    risk = pdNotCurrent || backlogged ? "low" : "low";
  } else if (!start || !exp) {
    risk = "missing";
  } else if (perm365) {
    risk = "medium"; // 1-year extensions possible, but not yet the stronger 3-year track
  } else {
    // No approved I-140 and PERM not old enough to support extensions yet.
    const monthsToExp = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    risk = monthsToExp <= 12 ? "high" : "medium";
  }

  /* --- Cards --- */
  const cards: Result["cards"] = [
    {
      title: "Estimated six-year max-out date",
      value: maxOutDate ? monthDayYear(maxOutDate) : "Add H-1B start date",
      detail: start
        ? `First H-1B start + 6 years${recaptureDays > 0 ? ` + ${recaptureDays} recaptured days` : ""}. This is an educational estimate — your actual max-out depends on exact time in H-1B/L-1 status.`
        : "Enter your first H-1B start date to estimate your six-year limit.",
    },
    {
      title: "Recapture days estimate",
      value: recaptureDays > 0 ? `~${recaptureDays} days` : "None entered",
      detail: "Days physically spent outside the U.S. during H-1B status can generally be 'recaptured' to add time back onto the six-year limit, with proof (passport stamps, I-94 travel history). Your attorney calculates the exact amount.",
    },
    {
      title: "PERM / I-140 milestone",
      value: i140Approved ? "I-140 approved" : perm365 ? "PERM 365+ days old" : permFiled ? "PERM filed" : "Not started",
      detail: i140Approved
        ? "An approved I-140 generally supports H-1B extensions beyond 6 years — 3-year extensions when your priority date is not current (AC21 §104(c)/§106(c))."
        : perm365
          ? "A PERM (or I-140) pending 365+ days before your six-year date generally supports 1-year H-1B extensions beyond the limit (AC21 §106(a))."
          : "To extend H-1B beyond 6 years, a PERM or I-140 usually needs to be filed at least 365 days before your max-out date, or an I-140 must be approved.",
    },
  ];

  /* --- Checklist --- */
  const checklist: string[] = [];
  if (!i140Approved && !perm365) {
    checklist.push("File PERM (and later I-140) well before the 365-day mark ahead of your six-year date — timing is what unlocks extensions.");
  }
  if (recaptureDays === 0) {
    checklist.push("Gather passport stamps and I-94 travel history so any time spent outside the U.S. can be recaptured.");
  }
  if (i140Approved && (pdNotCurrent || backlogged)) {
    checklist.push("With an approved I-140 and a non-current priority date, ask about 3-year H-1B extensions and keep the I-140 valid (don't let the employer withdraw it after 180 days).");
  }
  if (perm365 && !i140Approved) {
    checklist.push("Ask whether premium processing your I-140 now would move you onto the stronger 3-year extension track sooner.");
  }
  checklist.push("Ask your immigration attorney/employer about whether AC21-style extensions may apply in your case.");

  return { risk, maxOutDate, recaptureDays, cards, checklist };
}

/* ─────────────────────── UI ────────────────────────────────────────────── */

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20";

const RISK_CFG: Record<Risk, { badge: string; label: string; note: string }> = {
  low: { badge: "bg-emerald-100 text-emerald-800", label: "Low risk", note: "You appear to have a path to extend H-1B beyond six years — confirm with your attorney." },
  medium: { badge: "bg-amber-100 text-amber-800", label: "Medium risk", note: "Extension may be possible, but timing is tight. Move quickly and get attorney guidance." },
  high: { badge: "bg-rose-100 text-rose-800", label: "High risk", note: "Without a qualifying PERM/I-140 milestone in time, extension beyond six years may not be available. Speak to your attorney urgently." },
  missing: { badge: "bg-blue-100 text-blue-700", label: "Missing data", note: "Add your H-1B start and expiration dates for a risk estimate." },
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

export default function H1bPermMaxOutCalculator() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const result = submitted ? compute(inp) : null;
  const cfg = result ? RISK_CFG[result.risk] : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-700">H-1B PERM Max-Out Calculator</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Will your PERM / I-140 outrun your six-year H-1B limit?
        </h2>
        <p className="mt-1 text-sm text-ink-500">Estimate your max-out date and whether your green card case can unlock an extension beyond six years.</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This calculator is for educational planning only and is not legal advice.</strong>{" "}
        H-1B extension rules (AC21) are highly case-specific. Always confirm your case with your employer&rsquo;s immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="H-1B first start date"><input type="date" className={selectCls} value={inp.h1bStart} onChange={(e) => set("h1bStart", e.target.value)} /></Field>
            <Field label="Current H-1B expiration date"><input type="date" className={selectCls} value={inp.h1bExpiration} onChange={(e) => set("h1bExpiration", e.target.value)} /></Field>
            <Field label="Time spent outside USA" hint="(days)"><input type="number" min={0} placeholder="e.g. 60" className={selectCls} value={inp.daysOutside} onChange={(e) => set("daysOutside", e.target.value)} /></Field>
            <Field label="PERM filed date" hint="(optional)"><input type="date" className={selectCls} value={inp.permFiled} onChange={(e) => set("permFiled", e.target.value)} /></Field>
            <Field label="PERM approved?">
              <select className={selectCls} value={inp.permApproved} onChange={(e) => set("permApproved", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="I-140 filed?">
              <select className={selectCls} value={inp.i140Filed} onChange={(e) => set("i140Filed", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="I-140 approved?">
              <select className={selectCls} value={inp.i140Approved} onChange={(e) => set("i140Approved", e.target.value as YesNo)}>
                <option value="">Select…</option><option value="no">No</option><option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="Priority date current?">
              <select className={selectCls} value={inp.pdCurrent} onChange={(e) => set("pdCurrent", e.target.value as YesNoNotSure)}>
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Country of birth">
              <select className={selectCls} value={inp.country} onChange={(e) => set("country", e.target.value as Country)}>
                <option value="">Select…</option><option value="india">India</option><option value="china">China</option><option value="row">Rest of World</option><option value="other">Other</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700">
            Estimate My Max-Out Risk
          </button>
        </form>
      ) : result && cfg ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}>{cfg.label}</span>
              <span className="text-sm font-semibold text-ink-900">{result.maxOutDate ? `Estimated max-out: ${monthDayYear(result.maxOutDate)}` : "Add your H-1B start date"}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{cfg.note}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {result.cards.map((c) => (
              <div key={c.title} className="rounded-2xl border border-ink-900/10 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{c.title}</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{c.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{c.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-orange-700">Educational next-step checklist</p>
            <ul className="space-y-2">
              {result.checklist.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-orange-500">→</span>{s}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This calculator is for educational planning only and is not legal advice. Ask your immigration attorney/employer about whether AC21-style extensions may apply in your case.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/perm-processing-time-calculator" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-orange-400 hover:shadow-sm">→ PERM Processing Time Calculator</Link>
            <Link href="/perm-timeline" className="rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-orange-400 hover:shadow-sm">→ Full PERM timeline explained</Link>
          </div>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my details
          </button>
        </div>
      ) : null}
    </div>
  );
}
