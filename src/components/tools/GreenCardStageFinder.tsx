"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────── types ─────────────────────────────────────────── */

type VisaStatus =
  | "h1b" | "h4" | "l1" | "f1" | "i485-pending" | "ead-ap" | "other" | "";

type EbCategory = "eb1" | "eb2" | "eb3" | "" ;

type CountryOfBirth = "india" | "other" | "";

type PermFiled = "yes" | "no" | "not-sure" | "not-needed" | "";
type PermApproved = "yes" | "no" | "not-sure" | "na" | "";
type I140Filed = "yes" | "no" | "not-sure" | "";
type I140Approved = "yes" | "no" | "not-sure" | "";
type I485Filed = "yes" | "no" | "not-sure" | "";
type EadReceived = "yes" | "no" | "not-sure" | "";
type ApReceived = "yes" | "no" | "not-sure" | "";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─────────────────────── stage definitions ─────────────────────────────── */

type Stage =
  | "pre-perm"
  | "perm-pending"
  | "i140-pending"
  | "waiting-priority-date"
  | "i485-pending"
  | "ead-ap-pending"
  | "near-complete"
  | "eb1-direct"
  | "unknown";

interface StageResult {
  stage: Stage;
  stageLabel: string;
  stageNumber: string;
  headline: string;
  whatHappensNext: string[];
  bottleneck: string;
  readNext: { href: string; label: string }[];
  visaBulletinMatters: boolean;
  priorityDateCheckerHelps: boolean;
  questionsForLawyer: string[];
  indiaNote?: string;
  cspaWarning?: boolean;
}

/* ─────────────────────── assessment logic ───────────────────────────────── */

function assess(
  visa: VisaStatus,
  category: EbCategory,
  country: CountryOfBirth,
  permFiled: PermFiled,
  permApproved: PermApproved,
  i140Filed: I140Filed,
  i140Approved: I140Approved,
  i485Filed: I485Filed,
  eadReceived: EadReceived,
  apReceived: ApReceived,
  priorityMonth: number,
  priorityYear: number
): StageResult {

  const isIndia = country === "india";
  const hasDate = priorityMonth > 0 && priorityYear > 0;
  const hasI485Pending = i485Filed === "yes" || visa === "i485-pending" || visa === "ead-ap";
  const hasEad = eadReceived === "yes" || visa === "ead-ap";

  // EB-1 path (no PERM)
  if (category === "eb1" || permFiled === "not-needed") {
    if (i140Approved === "no" || i140Filed === "no") {
      return {
        stage: "eb1-direct",
        stageLabel: "EB-1: I-140 filing",
        stageNumber: "Stage 1",
        headline: "EB-1 applicants skip PERM — file I-140 directly",
        whatHappensNext: [
          "Your employer (or you, for EB-1A self-petition) files Form I-140 directly with USCIS.",
          "No PERM labor certification is required for EB-1.",
          "Premium processing is available for I-140 — USCIS action in 15 business days.",
          "Once I-140 is approved, your priority date is set at the I-140 filing date.",
        ],
        bottleneck: "I-140 filing and adjudication — then priority date availability in the visa bulletin.",
        readNext: [
          { href: "/green-card/i-140-approved-what-next", label: "I-140 approved — what next?" },
          { href: "/green-card/priority-date", label: "Priority date explained" },
        ],
        visaBulletinMatters: true,
        priorityDateCheckerHelps: hasDate,
        questionsForLawyer: [
          "Do I qualify for EB-1A (extraordinary ability) or does my employer need to file EB-1B/EB-1C?",
          "Is premium processing advisable for my I-140?",
          "What evidence is needed for my EB-1 petition?",
        ],
        indiaNote: isIndia
          ? "EB-1 India typically has a shorter wait than EB-2 or EB-3 India — but still check the current visa bulletin for the India EB-1 cutoff date."
          : undefined,
      };
    }
  }

  // Stage: I-485 filed / pending
  if (hasI485Pending) {
    return {
      stage: "i485-pending",
      stageLabel: "I-485 pending",
      stageNumber: "Stage 5–6",
      headline: "I-485 is pending — you are in the final domestic stage",
      whatHappensNext: [
        "USCIS will schedule a biometrics appointment at an Application Support Center (ASC).",
        "USCIS will schedule an interview at your local field office.",
        "Keep all supporting documents current — employment letter, medical exam, tax records.",
        "Do NOT travel internationally without an approved Advance Parole document in hand.",
        "Renew your EAD before it expires — do not rely on receiving the renewal before the old one expires.",
        "Notify your attorney of any job changes, address changes, or legal issues.",
      ],
      bottleneck: hasDate && priorityYear < 2022
        ? "USCIS processing and interview scheduling — your priority date appears to be current."
        : "Visa bulletin Final Action Date must also be current for your case to be approved — check the latest visa bulletin.",
      readNext: [
        { href: "/green-card/i-485", label: "I-485 adjustment of status guide" },
        { href: "/green-card/ead-advance-parole", label: "EAD and Advance Parole guide" },
        { href: "/green-card/ac21", label: "AC21 portability — changing jobs while pending" },
      ],
      visaBulletinMatters: true,
      priorityDateCheckerHelps: hasDate,
      questionsForLawyer: [
        "Is my I-485 outside the normal processing window? Should we file a case inquiry?",
        "What are the implications if I change employers now?",
        "My child is approaching age 21 — what are the CSPA implications?",
        "Do I need to maintain H1B status alongside my pending I-485?",
        "What happens to my EAD if my priority date retrogresses?",
      ],
      indiaNote: isIndia
        ? "If your priority date retrogresses after filing I-485, your case will be held pending — but your EAD and AP remain renewable. You do not need to refile."
        : undefined,
      cspaWarning: isIndia,
    };
  }

  // EAD/AP received — infer I-485 is pending
  if (hasEad) {
    return {
      stage: "ead-ap-pending",
      stageLabel: "EAD/AP active — I-485 pending",
      stageNumber: "Stage 5–6",
      headline: "EAD/AP in hand — I-485 is pending",
      whatHappensNext: [
        "Continue renewing your EAD before it expires.",
        "Do not travel internationally without a valid, approved Advance Parole.",
        "Your I-485 is proceeding — USCIS will schedule biometrics and interview.",
        "Notify your attorney of any job changes, address changes, or legal issues.",
      ],
      bottleneck: "USCIS I-485 adjudication and visa bulletin availability.",
      readNext: [
        { href: "/green-card/i-485", label: "I-485 adjustment of status guide" },
        { href: "/green-card/ead-advance-parole", label: "EAD and Advance Parole guide" },
        { href: "/green-card/ac21", label: "AC21 portability" },
      ],
      visaBulletinMatters: true,
      priorityDateCheckerHelps: hasDate,
      questionsForLawyer: [
        "Is my I-485 within normal processing time?",
        "Should I maintain H1B status alongside the EAD?",
        "What happens if my priority date retrogresses?",
      ],
      indiaNote: isIndia
        ? "For India, retrogression is common. Your EAD remains renewable while I-485 is pending even if the priority date retrogresses."
        : undefined,
    };
  }

  // I-140 approved — waiting for priority date (i485Filed is not "yes" here — already returned above)
  if (i140Approved === "yes") {
    return {
      stage: "waiting-priority-date",
      stageLabel: "Waiting for priority date",
      stageNumber: "Stage 3–4",
      headline: "I-140 approved — waiting for priority date to become current",
      whatHappensNext: [
        "Monitor the monthly State Department Visa Bulletin at travel.state.gov.",
        "Check both the Final Action Date (Part A) and Dates for Filing (Part B) charts for your category.",
        "When your priority date becomes current (or Part B is available), be ready to file I-485 quickly.",
        "Prepare your I-485 package now — have your medical exam done in advance so you're ready.",
        "Explore EB-3 downgrade if EB-3 India is moving faster than EB-2 India.",
        "Ensure children approaching age 21 have a CSPA analysis done now.",
      ],
      bottleneck: isIndia
        ? "The India per-country backlog. The visa bulletin for India EB-2 and EB-3 moves very slowly. Check the latest official bulletin for current dates."
        : "Visa bulletin availability for your priority date and category.",
      readNext: [
        { href: "/green-card/priority-date", label: "Priority date explained" },
        { href: "/green-card/green-card-backlog-india", label: "India green card backlog" },
        { href: "/green-card/eb2-vs-eb3-india", label: "EB-2 vs EB-3 for India" },
        { href: "/green-card/i-485", label: "I-485: what to prepare now" },
      ],
      visaBulletinMatters: true,
      priorityDateCheckerHelps: hasDate,
      questionsForLawyer: [
        "Should I explore EB-3 downgrade given current visa bulletin movement?",
        "What is my CSPA situation for my children?",
        "Should I file I-485 under the Dates for Filing chart if USCIS authorizes it?",
        "How do I handle an employer change during this waiting period?",
        "Is my H1B extension plan secure with the approved I-140?",
      ],
      indiaNote: isIndia
        ? "For Indian EB-2 and EB-3 applicants, the wait after I-140 approval can be measured in years or decades depending on your priority date. Use this time to prepare your I-485 package, explore EB-3 options, and protect your H1B status with the I-140 approval."
        : undefined,
      cspaWarning: isIndia,
    };
  }

  // I-140 filed but not yet approved (i140Approved is not "yes" here — returned above)
  if (i140Filed === "yes") {
    return {
      stage: "i140-pending",
      stageLabel: "I-140 pending",
      stageNumber: "Stage 2",
      headline: "I-140 petition is pending with USCIS",
      whatHappensNext: [
        "Monitor case status at egov.uscis.gov using your I-140 receipt number.",
        "Compare your receipt date against published processing times at uscis.gov/check-processing-times.",
        "If your employer has not used premium processing, discuss whether to upgrade — approval locks in your priority date sooner.",
        "Once approved, your H1B can be extended beyond 6 years in 3-year increments.",
        "Your priority date is already set from your PERM filing date — the I-140 approval formalizes it.",
      ],
      bottleneck: "I-140 adjudication by USCIS. Regular processing: 6–12+ months. Premium processing: 15 business days.",
      readNext: [
        { href: "/green-card/i-140-approved-what-next", label: "I-140 approved — what to expect" },
        { href: "/green-card/priority-date", label: "Priority date explained" },
        { href: "/uscis/processing-times", label: "USCIS processing times" },
      ],
      visaBulletinMatters: false,
      priorityDateCheckerHelps: false,
      questionsForLawyer: [
        "Should we upgrade to premium processing for the I-140?",
        "Is my priority date already established from PERM, or does it set at I-140 approval?",
        "What should I do if I want to change employers while I-140 is pending?",
        "Are there any RFE risks on my specific I-140 petition type?",
      ],
      indiaNote: isIndia
        ? "For Indian EB applicants, the I-140 approval locks in the priority date that determines your place in the multi-year backlog. Getting this approved quickly — especially with premium processing — is important."
        : undefined,
    };
  }

  // PERM approved, I-140 not yet filed (i140Filed is not "yes" here — returned above)
  if (permApproved === "yes") {
    return {
      stage: "perm-pending",
      stageLabel: "PERM approved — I-140 not yet filed",
      stageNumber: "Stage 1→2",
      headline: "PERM is certified — your employer should file I-140 promptly",
      whatHappensNext: [
        "PERM certification is valid for 180 days — your employer must file I-140 within this window or the PERM expires.",
        "Your employer should file I-140 immediately — do not let the 180-day window lapse.",
        "Your employer can request premium processing for I-140 to lock in your priority date faster.",
        "Your priority date is set at the PERM filing date — it is already established.",
      ],
      bottleneck: "Employer action to file I-140 within the 180-day PERM certification window.",
      readNext: [
        { href: "/green-card/perm", label: "PERM labor certification guide" },
        { href: "/green-card/i-140-approved-what-next", label: "I-140 approved — what next" },
      ],
      visaBulletinMatters: false,
      priorityDateCheckerHelps: false,
      questionsForLawyer: [
        "When does the 180-day PERM certification window expire?",
        "Has my employer initiated the I-140 filing?",
        "Should premium processing be requested for the I-140?",
        "What is my confirmed priority date from the PERM receipt?",
      ],
      indiaNote: isIndia
        ? "Your priority date is already set from the PERM filing — even though I-140 has not yet been filed. Make sure your employer files I-140 promptly to preserve this date."
        : undefined,
    };
  }

  // PERM filed but not approved (permApproved is not "yes" here — returned above)
  if (permFiled === "yes") {
    return {
      stage: "perm-pending",
      stageLabel: "PERM pending with DOL",
      stageNumber: "Stage 1",
      headline: "PERM labor certification is pending with the Department of Labor",
      whatHappensNext: [
        "PERM is processed by DOL — your employer's attorney tracks this.",
        "Typical DOL processing: 6–18 months. Audited cases take longer.",
        "Your priority date will be set at the PERM filing date once I-140 is filed.",
        "You cannot file I-140 until DOL certifies the PERM.",
        "Continue working under your current H1B status — PERM pending does not change your work authorization.",
      ],
      bottleneck: "DOL PERM adjudication. Audit selection (~20–30% of cases) adds months to the timeline.",
      readNext: [
        { href: "/green-card/perm", label: "PERM labor certification explained" },
        { href: "/green-card/green-card-backlog-india", label: "India green card backlog" },
      ],
      visaBulletinMatters: false,
      priorityDateCheckerHelps: false,
      questionsForLawyer: [
        "Has PERM been filed and what is the filing date (this will be my priority date)?",
        "Was our PERM selected for audit? If so, what is the timeline?",
        "Can I begin H1B extension planning now based on the pending PERM (1-year extensions after 365 days)?",
        "Can I change employers while PERM is pending?",
      ],
      indiaNote: isIndia
        ? "Your PERM filing date will become your priority date — the earlier this is, the better your position in India's long EB queue. Confirm the exact filing date with your attorney."
        : undefined,
    };
  }

  // PERM not yet filed
  if (permFiled === "no" || permFiled === "") {
    return {
      stage: "pre-perm",
      stageLabel: "Stage 1: PERM not yet filed",
      stageNumber: "Stage 1",
      headline: "Green card process has not started — PERM needs to be filed",
      whatHappensNext: [
        "Ask your employer's HR or immigration attorney about sponsoring your green card.",
        "Your employer must first file a PERM labor certification with the Department of Labor.",
        "PERM involves a prevailing wage determination and a labor market recruitment test.",
        "After PERM is certified (6–18 months), I-140 is filed with USCIS.",
        "The PERM filing date becomes your priority date — earlier is better for the India queue.",
      ],
      bottleneck: "Employer willingness to sponsor and initiate PERM. For Indian workers, the sooner PERM is filed, the better — the priority date determines your place in a multi-year queue.",
      readNext: [
        { href: "/green-card/perm", label: "PERM labor certification guide" },
        { href: "/green-card/green-card-backlog-india", label: "India green card backlog" },
        { href: "/green-card/eb2-vs-eb3-india", label: "EB-2 vs EB-3 for India" },
      ],
      visaBulletinMatters: false,
      priorityDateCheckerHelps: false,
      questionsForLawyer: [
        "Is my employer willing to sponsor my green card and when can they start?",
        "Do I qualify for EB-1 or EB-2 NIW (National Interest Waiver) to self-petition without PERM?",
        "Should I request PERM filing in EB-2 or EB-3, or both simultaneously?",
        "What is the earliest my employer can realistically start the PERM process?",
      ],
      indiaNote: isIndia
        ? "For Indian H1B workers, starting PERM as early as possible in your career is extremely important. The India EB-2 and EB-3 backlogs are measured in years or decades — every year of priority date delay is a year added to your total wait."
        : undefined,
    };
  }

  // fallback
  return {
    stage: "unknown",
    stageLabel: "Stage unclear — more information needed",
    stageNumber: "?",
    headline: "Your green card stage could not be clearly determined",
    whatHappensNext: [
      "Review your most recent immigration documents with your employer's attorney.",
      "Confirm your priority date and current I-140 status.",
      "Check the current visa bulletin at travel.state.gov.",
      "Consult your immigration attorney for a complete status review.",
    ],
    bottleneck: "More information is needed to identify your stage.",
    readNext: [
      { href: "/green-card", label: "Green card process overview" },
      { href: "/uscis/case-status", label: "USCIS case status guide" },
    ],
    visaBulletinMatters: true,
    priorityDateCheckerHelps: false,
    questionsForLawyer: ["Can you give me a complete status review of my green card process?"],
    indiaNote: isIndia
      ? "For Indian applicants, confirm your priority date and category — these are the most important numbers in your green card journey."
      : undefined,
  };
}

/* ─────────────────────── stage badge colors ────────────────────────────── */

const STAGE_COLORS: Record<Stage, { bg: string; border: string; badge: string }> = {
  "pre-perm": { bg: "bg-slate-50/60", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" },
  "perm-pending": { bg: "bg-blue-50/60", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
  "i140-pending": { bg: "bg-indigo-50/60", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-800" },
  "waiting-priority-date": { bg: "bg-amber-50/60", border: "border-amber-200", badge: "bg-amber-100 text-amber-800" },
  "i485-pending": { bg: "bg-emerald-50/60", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800" },
  "ead-ap-pending": { bg: "bg-emerald-50/60", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800" },
  "near-complete": { bg: "bg-green-50/60", border: "border-green-200", badge: "bg-green-100 text-green-800" },
  "eb1-direct": { bg: "bg-purple-50/60", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
  "unknown": { bg: "bg-ink-50/60", border: "border-ink-200", badge: "bg-ink-100 text-ink-700" },
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function GreenCardStageFinder() {
  const [visa, setVisa] = useState<VisaStatus>("");
  const [category, setCategory] = useState<EbCategory>("");
  const [country, setCountry] = useState<CountryOfBirth>("");
  const [permFiled, setPermFiled] = useState<PermFiled>("");
  const [permApproved, setPermApproved] = useState<PermApproved>("");
  const [i140Filed, setI140Filed] = useState<I140Filed>("");
  const [i140Approved, setI140Approved] = useState<I140Approved>("");
  const [i485Filed, setI485Filed] = useState<I485Filed>("");
  const [eadReceived, setEadReceived] = useState<EadReceived>("");
  const [apReceived, setApReceived] = useState<ApReceived>("");
  const [priorityMonth, setPriorityMonth] = useState(0);
  const [priorityYear, setPriorityYear] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setVisa(""); setCategory(""); setCountry(""); setPermFiled(""); setPermApproved("");
    setI140Filed(""); setI140Approved(""); setI485Filed(""); setEadReceived("");
    setApReceived(""); setPriorityMonth(0); setPriorityYear(0);
    setSubmitted(false);
  }

  const result = submitted
    ? assess(visa, category, country, permFiled, permApproved, i140Filed, i140Approved, i485Filed, eadReceived, apReceived, priorityMonth, priorityYear)
    : null;

  const colors = result ? STAGE_COLORS[result.stage] : null;

  return (
    <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/50 to-white p-6 shadow-sm sm:p-8">
      {/* header */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-green-700">Green Card Stage Finder</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Where are you in the green card process?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Answer a few questions to identify your current stage, understand the next step, and know what questions to ask your attorney.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* row 1 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Current visa / status</span>
              <select value={visa} onChange={(e) => setVisa(e.target.value as VisaStatus)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="h1b">H1B</option>
                <option value="h4">H4</option>
                <option value="l1">L1</option>
                <option value="f1">F1</option>
                <option value="i485-pending">I-485 pending</option>
                <option value="ead-ap">EAD / Advance Parole holder</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">EB green card category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as EbCategory)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="eb1">EB-1 (extraordinary ability / outstanding researcher / multinational exec)</option>
                <option value="eb2">EB-2 (advanced degree / exceptional ability / NIW)</option>
                <option value="eb3">EB-3 (skilled worker / professional)</option>
              </select>
            </label>
          </div>

          {/* row 2 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Country of birth</span>
              <select value={country} onChange={(e) => setCountry(e.target.value as CountryOfBirth)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="india">India</option>
                <option value="other">Other country</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">PERM labor certification filed?</span>
              <select value={permFiled} onChange={(e) => setPermFiled(e.target.value as PermFiled)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes — PERM has been filed</option>
                <option value="no">No — not yet filed</option>
                <option value="not-sure">Not sure</option>
                <option value="not-needed">Not needed (EB-1 or EB-2 NIW)</option>
              </select>
            </label>
          </div>

          {/* row 3 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">PERM approved (DOL certified)?</span>
              <select value={permApproved} onChange={(e) => setPermApproved(e.target.value as PermApproved)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes — PERM certified</option>
                <option value="no">No — still pending or denied</option>
                <option value="not-sure">Not sure</option>
                <option value="na">Not applicable</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">I-140 petition filed with USCIS?</span>
              <select value={i140Filed} onChange={(e) => setI140Filed(e.target.value as I140Filed)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes — I-140 has been filed</option>
                <option value="no">No — not yet filed</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>
          </div>

          {/* row 4 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">I-140 approved by USCIS?</span>
              <select value={i140Approved} onChange={(e) => setI140Approved(e.target.value as I140Approved)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes — I-140 is approved</option>
                <option value="no">No — pending or denied</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">I-485 filed?</span>
              <select value={i485Filed} onChange={(e) => setI485Filed(e.target.value as I485Filed)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes — I-485 filed</option>
                <option value="no">No — not yet filed</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>
          </div>

          {/* row 5 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">EAD (work permit) received?</span>
              <select value={eadReceived} onChange={(e) => setEadReceived(e.target.value as EadReceived)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Advance Parole received?</span>
              <select value={apReceived} onChange={(e) => setApReceived(e.target.value as ApReceived)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>
          </div>

          {/* priority date */}
          <div>
            <span className="text-xs font-semibold text-ink-800">
              Priority date{" "}
              <span className="font-normal text-ink-400">(month and year — optional but improves result)</span>
            </span>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <select value={priorityMonth} onChange={(e) => setPriorityMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value={0}>Month…</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select value={priorityYear} onChange={(e) => setPriorityYear(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value={0}>Year…</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <p className="mt-1 text-xs text-ink-400">
              Found on your I-797 PERM receipt or I-140 approval notice. Do not enter receipt numbers.
            </p>
          </div>

          <button type="submit"
            className="mt-2 w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800">
            Find my stage
          </button>
        </form>
      ) : result && colors ? (
        <div className="space-y-4">
          {/* stage card */}
          <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${colors.badge}`}>
                  {result.stageNumber}
                </span>
                <h3 className="mt-2 font-bold text-ink-900">{result.headline}</h3>
              </div>
              <span className="text-xs font-semibold text-ink-500">{result.stageLabel}</span>
            </div>
          </div>

          {/* India note */}
          {result.indiaNote && (
            <div className="rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-3 text-xs leading-relaxed text-orange-900">
              <strong className="font-semibold">India-specific:</strong> {result.indiaNote}
            </div>
          )}

          {/* CSPA warning */}
          {result.cspaWarning && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs leading-relaxed text-rose-900">
              <strong className="font-semibold">Children aging out:</strong> If you have children who may turn 21 before your green card is approved, discuss CSPA (Child Status Protection Act) with your attorney now. The India backlog makes this a real risk for many families.{" "}
              <Link href="/green-card/cspa-kids-aging-out" className="underline font-semibold">Read the CSPA guide →</Link>
            </div>
          )}

          {/* what comes next */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">What usually comes next</p>
            <ul className="space-y-2">
              {result.whatHappensNext.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1 flex-none text-green-600">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* bottleneck */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <strong className="font-semibold">Likely bottleneck:</strong> {result.bottleneck}
          </div>

          {/* visa bulletin note */}
          {result.visaBulletinMatters && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs leading-relaxed text-blue-900">
              <strong className="font-semibold">Visa bulletin matters for your stage.</strong>{" "}
              Check the latest official visa bulletin at{" "}
              <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="underline font-semibold">travel.state.gov</a>{" "}
              for the current Final Action Date and Dates for Filing cutoffs for your category and country.
            </div>
          )}

          {/* read next */}
          <div className="grid gap-2 sm:grid-cols-2">
            {result.readNext.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-green-500 hover:shadow-sm">
                <span className="text-base">📗</span>
                {link.label}
              </Link>
            ))}
            <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-green-500 hover:shadow-sm">
              <span className="text-base">🔗</span>
              Official visa bulletin
            </a>
            <Link href="/uscis/processing-times"
              className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-green-500 hover:shadow-sm">
              <span className="text-base">⏱️</span>
              USCIS processing times
            </Link>
          </div>

          {/* questions for lawyer */}
          <div className="rounded-2xl border border-ink-900/5 bg-ink-50/40 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Questions to ask your employer's attorney</p>
            <ul className="space-y-1.5">
              {result.questionsForLawyer.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-ink-400">?</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {/* disclaimer */}
          <p className="text-center text-xs leading-relaxed text-ink-400">
            Educational guidance only — not legal or immigration advice. Always verify priority date availability at the official{" "}
            <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="underline">visa bulletin</a>{" "}
            and consult a qualified immigration attorney.
          </p>

          <button onClick={handleReset}
            className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Start over
          </button>
        </div>
      ) : null}
    </div>
  );
}
