"use client";

import { useState } from "react";
import Link from "next/link";
import { permProcessingData as D } from "@/data/permProcessingData";

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
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
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
function laterOf(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

/* ─────────────────────── input types ───────────────────────────────────── */

type CaseStatus =
  | "not-started" | "pwd-filed" | "pwd-approved" | "recruitment-started"
  | "recruitment-completed" | "perm-filed" | "perm-audited" | "perm-approved" | "";
type YesNo = "yes" | "no" | "";
type YesNoNotSure = "yes" | "no" | "not-sure" | "";
type Category = "EB1" | "EB2" | "EB3" | "not-sure" | "";
type Country = "india" | "china" | "row" | "other" | "";
type VisaStatus = "h1b" | "l1" | "f1-opt" | "other" | "";

interface Inputs {
  caseStatus: CaseStatus;
  pwdFiled: string;
  pwdApproved: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  permFiled: string;
  audit: YesNo;
  permApproval: string;
  i140Filed: YesNo;
  i140Approved: YesNo;
  i140Premium: YesNoNotSure;
  category: Category;
  country: Country;
  visaStatus: VisaStatus;
  h1bStart: string;
  h1bExpiration: string;
  daysOutside: string;
  priorityDate: string;
  pdCurrent: YesNoNotSure;
}

const EMPTY: Inputs = {
  caseStatus: "", pwdFiled: "", pwdApproved: "", recruitmentStart: "",
  recruitmentEnd: "", permFiled: "", audit: "", permApproval: "", i140Filed: "",
  i140Approved: "", i140Premium: "", category: "", country: "", visaStatus: "",
  h1bStart: "", h1bExpiration: "", daysOutside: "", priorityDate: "", pdCurrent: "",
};

/* ─────────────────────── result model ──────────────────────────────────── */

type Risk = "low" | "medium" | "high" | "missing";
type StageState = "done" | "current" | "upcoming";

interface Card {
  key: string;
  title: string;
  value: string;
  detail: string;
  tone: "done" | "estimate" | "action" | "warn";
}

interface TimelineStage {
  label: string;
  state: StageState;
}

interface Result {
  cards: Card[];
  stages: TimelineStage[];
  risk: Risk;
  riskNote: string;
  nextSteps: string[];
}

/* ─────────────────────── computation ───────────────────────────────────── */

function compute(inp: Inputs): Result {
  const now = new Date();
  const pwdFiled = parseDate(inp.pwdFiled);
  const pwdApproved = parseDate(inp.pwdApproved);
  const recStart = parseDate(inp.recruitmentStart);
  const recEnd = parseDate(inp.recruitmentEnd);
  const permFiled = parseDate(inp.permFiled);
  const permApproval = parseDate(inp.permApproval);
  const h1bExp = parseDate(inp.h1bExpiration);

  const auditYes = inp.audit === "yes";
  const permDone = inp.caseStatus === "perm-approved" || !!permApproval;
  const i140Done = inp.i140Approved === "yes";

  /* --- Stage projection (chained estimates) --- */
  // 1. PWD completion
  let pwdDone: Date | null = pwdApproved;
  if (!pwdDone && pwdFiled) pwdDone = addMonths(pwdFiled, D.pwdPlanningMonthsHigh);
  const pwdEstimated = !pwdApproved && !!pwdFiled;

  // 2. Recruitment completion (min 30-day quiet period after ads end before filing)
  let recDone: Date | null = recEnd;
  if (!recDone) {
    const anchor = recStart ?? pwdDone;
    if (anchor) recDone = addDays(anchor, D.recruitmentTypicalDays);
  }
  const recEstimated = !recEnd && !!recDone;

  // 3. PERM filing (estimated if not filed)
  let permFileEst: Date | null = permFiled;
  if (!permFileEst && recDone) permFileEst = addDays(recDone, 30);

  // 4. PERM decision
  let permDecisionLow: Date | null = permApproval;
  let permDecisionHigh: Date | null = permApproval;
  if (!permApproval && permFileEst) {
    const analystDays = D.averagePermAnalystReviewDays;
    if (analystDays != null) {
      const base = addDays(permFileEst, analystDays);
      permDecisionLow = base;
      permDecisionHigh = auditYes
        ? addMonths(base, D.averagePermAuditReviewDays != null ? Math.round(D.averagePermAuditReviewDays / 30) : D.permAuditPlanningMonthsHigh)
        : base;
    } else {
      permDecisionLow = addMonths(permFileEst, D.permAnalystPlanningMonthsLow + (auditYes ? D.permAuditPlanningMonthsLow : 0));
      permDecisionHigh = addMonths(permFileEst, D.permAnalystPlanningMonthsHigh + (auditYes ? D.permAuditPlanningMonthsHigh : 0));
    }
  }
  const permEstimated = !permApproval && !!permDecisionHigh;

  // 5. I-140 decision
  let i140Low: Date | null = null;
  let i140High: Date | null = null;
  let i140Text = "";
  if (i140Done) {
    i140Text = "I-140 already approved.";
  } else {
    const permBase = permApproval ?? permDecisionHigh;
    if (permBase) {
      const start = laterOf(permBase, now);
      if (inp.i140Premium === "yes") {
        // EB-1C / EB-2 NIW premium processing is ~45 business days; other I-140s ~15.
        const ppDays = inp.category === "EB1"
          ? D.i140Niweb1cPremiumProcessingBusinessDays
          : D.i140PremiumProcessingBusinessDays;
        i140Low = addBusinessDays(start, ppDays);
        i140High = addBusinessDays(start, ppDays);
        i140Text = `Premium processing: USCIS decides within ~${ppDays} business days of a complete filing.`;
      } else {
        i140Low = addMonths(start, D.standardI140EstimateMonthsLow);
        i140High = addMonths(start, D.standardI140EstimateMonthsHigh);
        i140Text = `Standard processing estimate: ~${D.standardI140EstimateMonthsLow}–${D.standardI140EstimateMonthsHigh} months (premium processing may be available for EB-2/EB-3).`;
      }
    } else {
      i140Text = "I-140 timing depends on when PERM is approved.";
    }
  }

  /* --- Green card stage after I-140 --- */
  const isBacklogged = inp.country === "india" || inp.country === "china";
  let gcStage = "";
  if (inp.pdCurrent === "yes") {
    gcStage = "Your priority date appears current — after I-140 approval you may be able to file (or already have filed) I-485. Confirm the current Visa Bulletin with your attorney.";
  } else if (isBacklogged) {
    gcStage = `${inp.country === "india" ? "India" : "China"} EB-2/EB-3 has a long Visa Bulletin backlog. After I-140 approval you typically wait for your priority date to become current before filing I-485. Track the monthly Visa Bulletin.`;
  } else if (inp.pdCurrent === "no") {
    gcStage = "After I-140 approval you wait for your priority date to become current in the Visa Bulletin before filing I-485.";
  } else {
    gcStage = "After I-140 approval, whether you can file I-485 depends on your Visa Bulletin priority date. For India/China this is usually a multi-year wait.";
  }

  /* --- H-1B max-out / extension risk --- */
  let risk: Risk = "missing";
  let riskNote = "";
  const keyMilestone = i140Done ? now : (i140High ?? null);
  if (!h1bExp) {
    risk = "missing";
    riskNote = "Add your current H-1B expiration date to estimate max-out risk. An approved I-140 pending 180+ days generally supports 3-year H-1B extensions beyond the 6-year limit under AC21.";
  } else if (i140Done) {
    risk = "low";
    riskNote = "Your I-140 is approved. An approved I-140 generally supports H-1B extensions beyond 6 years (3-year extensions if your priority date is not current) under AC21 §104(c)/§106. Confirm eligibility with your attorney.";
  } else if (keyMilestone) {
    const monthsGap = (h1bExp.getTime() - keyMilestone.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsGap >= 6) {
      risk = "low";
      riskNote = `Your estimated I-140 approval (~${monthYear(keyMilestone)}) is comfortably before your H-1B expiration (${monthYear(h1bExp)}). An approved I-140 pending 180+ days generally supports extensions beyond 6 years.`;
    } else if (monthsGap >= 0) {
      risk = "medium";
      riskNote = `Your estimated I-140 approval (~${monthYear(keyMilestone)}) is close to your H-1B expiration (${monthYear(h1bExp)}). Timing is tight — file PERM and I-140 (premium) as early as possible and ask your employer's attorney about the safest sequencing.`;
    } else {
      risk = "high";
      riskNote = `Your estimated I-140 approval (~${monthYear(keyMilestone)}) may come AFTER your H-1B expiration (${monthYear(h1bExp)}). This is a risky window. Discuss H-1B extension options, recapture of time spent outside the U.S., and contingency plans with your employer's immigration attorney immediately.`;
    }
  } else {
    risk = "missing";
    riskNote = "Add more PERM/PWD dates so we can estimate your I-140 milestone against your H-1B expiration.";
  }
  riskNote += " H-1B extension rules are case-specific — this is an educational planning estimate only.";

  /* --- Result cards --- */
  const cards: Card[] = [];

  cards.push({
    key: "pwd",
    title: "Estimated PWD completion",
    value: pwdApproved ? `Approved ${monthYear(pwdApproved)}` : pwdDone ? `~${monthYear(pwdDone)}` : "Add PWD filed date",
    detail: pwdApproved
      ? "Prevailing wage determination is complete."
      : pwdEstimated
        ? `Estimated using a general ${D.pwdPlanningMonthsLow}–${D.pwdPlanningMonthsHigh} month PWD planning range. Verify the current PWD queue on DOL FLAG.`
        : "Enter your PWD filed date to estimate completion.",
    tone: pwdApproved ? "done" : "estimate",
  });

  cards.push({
    key: "recruitment",
    title: "Estimated recruitment completion",
    value: recEnd ? `Completed ${monthYear(recEnd)}` : recDone ? `~${monthYear(recDone)}` : "After PWD approval",
    detail: recEnd
      ? "Recruitment window has ended. A 30-day quiet period is required before PERM can be filed."
      : recEstimated
        ? `Estimated at ~${D.recruitmentTypicalDays} days (minimum ${D.recruitmentMinimumDays} days incl. the mandatory 30-day quiet period).`
        : "Recruitment usually runs after PWD approval and must span at least the required advertising and quiet periods.",
    tone: recEnd ? "done" : "estimate",
  });

  cards.push({
    key: "perm",
    title: "Estimated PERM decision month",
    value: permApproval
      ? `Approved ${monthYear(permApproval)}`
      : permDecisionHigh
        ? (permDecisionLow && permDecisionLow.getTime() !== permDecisionHigh.getTime()
            ? `~${monthYear(permDecisionLow)} – ${monthYear(permDecisionHigh)}`
            : `~${monthYear(permDecisionHigh)}`)
        : "After PERM filing",
    detail: permApproval
      ? "PERM labor certification is approved."
      : permEstimated
        ? `${auditYes ? "Includes audit review time. " : ""}${D.averagePermAnalystReviewDays != null ? "Uses the current DOL average review days." : `Uses a general ${D.permAnalystPlanningMonthsLow}–${D.permAnalystPlanningMonthsHigh} month analyst-review planning range${auditYes ? ` plus ${D.permAuditPlanningMonthsLow}–${D.permAuditPlanningMonthsHigh} months for audit` : ""}.`} PERM cannot be premium processed.`
        : "Enter your PERM filed date (or earlier dates) to estimate the DOL decision window.",
    tone: permApproval ? "done" : "estimate",
  });

  cards.push({
    key: "i140",
    title: "Estimated I-140 decision window",
    value: i140Done
      ? "Approved"
      : i140High
        ? (i140Low && i140Low.getTime() !== i140High.getTime()
            ? `~${monthYear(i140Low)} – ${monthYear(i140High)}`
            : `~${monthYear(i140High)}`)
        : "After PERM approval",
    detail: i140Text,
    tone: i140Done ? "done" : "estimate",
  });

  cards.push({
    key: "gc",
    title: "Estimated green card stage after I-140",
    value: inp.pdCurrent === "yes" ? "Priority date may be current" : isBacklogged ? "Visa Bulletin wait likely" : "Depends on Visa Bulletin",
    detail: gcStage,
    tone: "estimate",
  });

  cards.push({
    key: "risk",
    title: "H-1B max-out / extension risk",
    value: risk === "low" ? "Low risk" : risk === "medium" ? "Medium risk" : risk === "high" ? "High risk" : "Missing data",
    detail: riskNote,
    tone: risk === "high" ? "warn" : risk === "medium" ? "warn" : "estimate",
  });

  /* --- Next steps --- */
  const nextSteps: string[] = [];
  if (permDone && inp.i140Filed !== "yes") {
    nextSteps.push("File I-140 before your PERM certification expires (PERM is valid for 180 days from approval). Confirm the exact deadline with your attorney.");
  }
  if (!pwdFiled && inp.caseStatus === "not-started") {
    nextSteps.push("Ask your employer to start the prevailing wage determination (PWD) — it is the first DOL step.");
  }
  if (pwdApproved && !recEnd && inp.caseStatus !== "recruitment-completed") {
    nextSteps.push("Confirm your recruitment plan and start dates — recruitment must be completed and the 30-day quiet period observed before PERM filing.");
  }
  if (risk === "high" || risk === "medium") {
    nextSteps.push("Ask your employer's immigration attorney about H-1B extension options and whether AC21-style extensions may apply to your case.");
  }
  if (inp.i140Approved === "yes" && inp.pdCurrent !== "yes" && isBacklogged) {
    nextSteps.push("Track the monthly Visa Bulletin — with an approved I-140 you are waiting for your priority date to become current before filing I-485.");
  }
  if (nextSteps.length === 0) {
    nextSteps.push("Keep every approval notice (PWD, PERM, I-140) and maintain valid status. Re-run this estimate whenever a case milestone changes.");
  }
  nextSteps.push("Always confirm your specific case with your employer's immigration attorney — this tool is educational planning only.");

  /* --- Timeline stages --- */
  const stages: TimelineStage[] = [
    { label: "PWD", state: pwdApproved ? "done" : pwdFiled ? "current" : "upcoming" },
    { label: "Recruitment", state: recEnd ? "done" : (recStart || pwdApproved) ? "current" : "upcoming" },
    { label: "PERM Filing", state: (permFiled || permDone) ? "done" : recEnd ? "current" : "upcoming" },
    { label: "PERM Review", state: permDone ? "done" : permFiled ? "current" : "upcoming" },
    { label: "I-140", state: i140Done ? "done" : inp.i140Filed === "yes" ? "current" : "upcoming" },
    { label: "Visa Bulletin / I-485", state: inp.pdCurrent === "yes" ? "current" : "upcoming" },
  ];

  return { cards, stages, risk, riskNote, nextSteps };
}

/* ─────────────────────── small UI helpers ──────────────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      {hint && <span className="ml-1 text-xs font-normal text-ink-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const selectCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20";
const dateCls = selectCls;

const RISK_CFG: Record<Risk, { badge: string; label: string }> = {
  low: { badge: "bg-emerald-100 text-emerald-800", label: "Low risk" },
  medium: { badge: "bg-amber-100 text-amber-800", label: "Medium risk" },
  high: { badge: "bg-rose-100 text-rose-800", label: "High risk" },
  missing: { badge: "bg-blue-100 text-blue-700", label: "Missing data" },
};

const CARD_TONE: Record<Card["tone"], string> = {
  done: "border-emerald-200 bg-emerald-50/50",
  estimate: "border-ink-900/10 bg-white",
  action: "border-blue-200 bg-blue-50/50",
  warn: "border-amber-200 bg-amber-50/50",
};

const STAGE_TONE: Record<StageState, string> = {
  done: "bg-emerald-500 text-white",
  current: "bg-blue-600 text-white",
  upcoming: "bg-ink-100 text-ink-400",
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function PermTimelineCalculator() {
  const [inp, setInp] = useState<Inputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) =>
    setInp((prev) => ({ ...prev, [k]: v }));

  const result = submitted ? compute(inp) : null;
  const riskCfg = result ? RISK_CFG[result.risk] : null;

  return (
    <div id="calculator" className="scroll-mt-24 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">PERM Timeline Calculator</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Estimate your PWD → PERM → I-140 → green card timeline
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Enter what you know. Every field except your case status is optional — the more you add, the sharper the estimate.
        </p>
      </div>

      {/* disclaimer */}
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">This calculator is for educational planning only and is not legal advice.</strong>{" "}
        Always confirm your case with your employer&rsquo;s immigration attorney. DOL processing times change monthly — verify at{" "}
        <a href={D.dolSourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">DOL FLAG processing times</a>.
      </div>

      {!submitted ? (
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="space-y-5"
        >
          <Field label="PERM case status" hint="(required)">
            <select className={selectCls} value={inp.caseStatus} required
              onChange={(e) => set("caseStatus", e.target.value as CaseStatus)}>
              <option value="">Select…</option>
              <option value="not-started">Not started</option>
              <option value="pwd-filed">PWD filed</option>
              <option value="pwd-approved">PWD approved</option>
              <option value="recruitment-started">Recruitment started</option>
              <option value="recruitment-completed">Recruitment completed</option>
              <option value="perm-filed">PERM filed</option>
              <option value="perm-audited">PERM audited</option>
              <option value="perm-approved">PERM approved</option>
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="PWD filed date"><input type="date" className={dateCls} value={inp.pwdFiled} onChange={(e) => set("pwdFiled", e.target.value)} /></Field>
            <Field label="PWD approved date" hint="(optional)"><input type="date" className={dateCls} value={inp.pwdApproved} onChange={(e) => set("pwdApproved", e.target.value)} /></Field>
            <Field label="Recruitment start date" hint="(optional)"><input type="date" className={dateCls} value={inp.recruitmentStart} onChange={(e) => set("recruitmentStart", e.target.value)} /></Field>
            <Field label="Recruitment end date" hint="(optional)"><input type="date" className={dateCls} value={inp.recruitmentEnd} onChange={(e) => set("recruitmentEnd", e.target.value)} /></Field>
            <Field label="PERM filed date" hint="(optional)"><input type="date" className={dateCls} value={inp.permFiled} onChange={(e) => set("permFiled", e.target.value)} /></Field>
            <Field label="PERM approval date" hint="(optional)"><input type="date" className={dateCls} value={inp.permApproval} onChange={(e) => set("permApproval", e.target.value)} /></Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Audit received?">
              <select className={selectCls} value={inp.audit} onChange={(e) => set("audit", e.target.value as YesNo)}>
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
            <Field label="I-140 premium processing?">
              <select className={selectCls} value={inp.i140Premium} onChange={(e) => set("i140Premium", e.target.value as YesNoNotSure)}>
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Green card category">
              <select className={selectCls} value={inp.category} onChange={(e) => set("category", e.target.value as Category)}>
                <option value="">Select…</option><option value="EB1">EB-1</option><option value="EB2">EB-2</option><option value="EB3">EB-3</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Country of birth">
              <select className={selectCls} value={inp.country} onChange={(e) => set("country", e.target.value as Country)}>
                <option value="">Select…</option><option value="india">India</option><option value="china">China</option><option value="row">Rest of World</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Current visa status">
              <select className={selectCls} value={inp.visaStatus} onChange={(e) => set("visaStatus", e.target.value as VisaStatus)}>
                <option value="">Select…</option><option value="h1b">H-1B</option><option value="l1">L-1</option><option value="f1-opt">F-1 OPT</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Days spent outside USA" hint="(optional)">
              <input type="number" min={0} className={dateCls} value={inp.daysOutside} placeholder="e.g. 45" onChange={(e) => set("daysOutside", e.target.value)} />
            </Field>
            <Field label="H-1B start date" hint="(optional)"><input type="date" className={dateCls} value={inp.h1bStart} onChange={(e) => set("h1bStart", e.target.value)} /></Field>
            <Field label="H-1B current expiration date" hint="(optional)"><input type="date" className={dateCls} value={inp.h1bExpiration} onChange={(e) => set("h1bExpiration", e.target.value)} /></Field>
            <Field label="Priority date" hint="(optional)"><input type="date" className={dateCls} value={inp.priorityDate} onChange={(e) => set("priorityDate", e.target.value)} /></Field>
            <Field label="Is priority date current?">
              <select className={selectCls} value={inp.pdCurrent} onChange={(e) => set("pdCurrent", e.target.value as YesNoNotSure)}>
                <option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not sure</option>
              </select>
            </Field>
          </div>

          <button type="submit" className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
            Calculate My PERM Timeline
          </button>
        </form>
      ) : result && riskCfg ? (
        <div className="space-y-5">
          {/* risk badge */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-900/10 bg-white p-4">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${riskCfg.badge}`}>
              H-1B risk: {riskCfg.label}
            </span>
            <span className="text-xs text-ink-500">Educational estimate — verify every date with your attorney and DOL FLAG.</span>
          </div>

          {/* timeline visual */}
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Your PERM → green card path</p>
            <ol className="flex flex-wrap items-center gap-2">
              {result.stages.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${STAGE_TONE[s.state]}`}>
                    {s.state === "done" ? "✓" : s.state === "current" ? "●" : "○"} {s.label}
                  </span>
                  {i < result.stages.length - 1 && <span aria-hidden className="text-ink-300">→</span>}
                </li>
              ))}
            </ol>
          </div>

          {/* result cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {result.cards.map((c) => (
              <div key={c.key} className={`rounded-2xl border p-4 ${CARD_TONE[c.tone]}`}>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{c.title}</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{c.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{c.detail}</p>
              </div>
            ))}
          </div>

          {/* what to do next */}
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

          <p className="text-center text-xs leading-relaxed text-ink-400">
            This calculator is for educational planning only and is not legal advice. Always confirm your case with your employer&rsquo;s immigration attorney. Source:{" "}
            <a href={D.dolSourceUrl} target="_blank" rel="noopener noreferrer" className="underline">DOL FLAG processing times</a>.
          </p>

          <button onClick={() => setSubmitted(false)} className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Edit my details
          </button>
        </div>
      ) : null}
    </div>
  );
}
