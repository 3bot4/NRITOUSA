"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CURRENT_VISA_BULLETIN,
  comparePriorityDate,
  isBulletinFresh,
  type CutoffValue,
} from "@/lib/visaBulletinDates";

/* ─────────────────────── types ─────────────────────────────────────────── */

type EbCategory = "EB1" | "EB2" | "EB3" | "";
type Country = "india" | "other" | "";
type Stage =
  | "perm-pending" | "perm-approved" | "i140-pending" | "i140-approved"
  | "i485-not-filed" | "i485-filed" | "ead-ap" | "not-sure" | "";
type ChartInterest = "final-action" | "dates-for-filing" | "not-sure" | "";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─────────────────────── result types ──────────────────────────────────── */

type ComparisonResult =
  | "all-current"     // cutoff is "C"
  | "current"         // priority date before cutoff
  | "not-current"     // priority date after cutoff
  | "unavailable"     // cutoff is "U"
  | "no-data"         // bulletin not fresh or category missing
  | "no-date";        // user did not provide a priority date

interface CheckerResult {
  comparison: ComparisonResult;
  relevantChart: "final-action" | "dates-for-filing" | "both";
  cutoffFinalAction: CutoffValue | null;
  cutoffDatesForFiling: CutoffValue | null;
  bulletinFresh: boolean;
  explanation: string[];
  whatItMeans: string;
  chartGuide: string;
  questionsForLawyer: string[];
  readNext: { href: string; label: string }[];
}

/* ─────────────────────── assessment ────────────────────────────────────── */

function assess(
  category: EbCategory,
  country: Country,
  stage: Stage,
  chartInterest: ChartInterest,
  priorityMonth: number,
  priorityYear: number
): CheckerResult {

  const bulletin = CURRENT_VISA_BULLETIN;
  const fresh = isBulletinFresh(bulletin);
  const isIndia = country === "india";
  const countryKey = isIndia ? "india" : "other";

  const hasPriorityDate = priorityMonth > 0 && priorityYear > 0;

  // Determine relevant chart
  const relevantChart: "final-action" | "dates-for-filing" | "both" =
    chartInterest === "final-action" ? "final-action" :
    chartInterest === "dates-for-filing" ? "dates-for-filing" :
    stage === "i485-filed" || stage === "ead-ap" ? "final-action" :
    "both";

  // Pull cutoff values
  let cutoffFA: CutoffValue | null = null;
  let cutoffDFF: CutoffValue | null = null;

  if (category) {
    cutoffFA = bulletin.finalActionDates[category]?.[countryKey] ?? null;
    cutoffDFF = bulletin.datesForFiling
      ? bulletin.datesForFiling[category]?.[countryKey] ?? null
      : null;
  }

  // No data cases
  if (!category) {
    return {
      comparison: "no-data",
      relevantChart,
      cutoffFinalAction: null,
      cutoffDatesForFiling: null,
      bulletinFresh: fresh,
      explanation: ["Select an EB category to see bulletin data for your category."],
      whatItMeans: "Select your employment-based category to get a comparison.",
      chartGuide: "The visa bulletin has two charts — Final Action Dates and Dates for Filing. Which one applies depends on your current stage and what USCIS announces each month.",
      questionsForLawyer: ["What EB category does my I-140 or PERM use?"],
      readNext: [
        { href: "/visa-bulletin", label: "Visa bulletin guide" },
        { href: "/green-card/priority-date", label: "Priority date explained" },
      ],
    };
  }

  if (!hasPriorityDate) {
    const faLabel = cutoffFA === "C" ? "Current (C)" : cutoffFA === "U" ? "Unavailable (U)" : cutoffFA ?? "—";
    const dffLabel = cutoffDFF === "C" ? "Current (C)" : cutoffDFF === "U" ? "Unavailable (U)" : cutoffDFF ?? (bulletin.datesForFiling === null ? "Not authorized this month" : "—");
    return {
      comparison: "no-date",
      relevantChart,
      cutoffFinalAction: cutoffFA,
      cutoffDatesForFiling: cutoffDFF,
      bulletinFresh: fresh,
      explanation: [
        `${bulletin.month} ${bulletin.year} ${category} ${isIndia ? "India" : "Other"} Final Action Date: ${faLabel}`,
        `${bulletin.month} ${bulletin.year} ${category} ${isIndia ? "India" : "Other"} Dates for Filing: ${dffLabel}`,
        "Add your priority date (month and year) to compare it against the current bulletin.",
      ],
      whatItMeans: "You can see the current cutoff dates above. Enter your priority date to find out whether you are current.",
      chartGuide: "Final Action Date (Table A) is required for green card approval. Dates for Filing (Table B) allows I-485 filing if USCIS authorizes it — check uscis.gov/visabulletininfo.",
      questionsForLawyer: [
        "What is my exact priority date from the PERM receipt?",
        "Is my priority date current under Table A or Table B this month?",
      ],
      readNext: [
        { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Table A vs Table B explained" },
        { href: "/visa-bulletin/priority-date", label: "Where to find your priority date" },
      ],
    };
  }

  // Compare priority date to bulletin
  const priorityDate = new Date(priorityYear, priorityMonth - 1, 1);
  const faComparison = cutoffFA ? comparePriorityDate(priorityDate, cutoffFA) : "no-data";
  const dffComparison = cutoffDFF ? comparePriorityDate(priorityDate, cutoffDFF) : "no-data";

  // Determine primary comparison result
  let comparison: ComparisonResult = "no-data";
  if (relevantChart === "final-action" || relevantChart === "both") {
    comparison = faComparison as ComparisonResult;
  } else if (relevantChart === "dates-for-filing") {
    comparison = dffComparison as ComparisonResult;
  }

  const pdLabel = `${MONTHS[priorityMonth - 1]} ${priorityYear}`;
  const faLabel = cutoffFA === "C" ? "Current (all dates qualify)" : cutoffFA === "U" ? "Unavailable" : cutoffFA ?? "—";
  const dffLabel = cutoffDFF === "C" ? "Current" : cutoffDFF === "U" ? "Unavailable" : cutoffDFF ?? (bulletin.datesForFiling === null ? "Not authorized this month" : "—");

  const staleNote = !fresh
    ? [`⚠ The visa bulletin data in this tool may not reflect the latest month. Always verify at travel.state.gov.`]
    : [];

  if (faComparison === "all-current") {
    return {
      comparison: "all-current",
      relevantChart,
      cutoffFinalAction: cutoffFA,
      cutoffDatesForFiling: cutoffDFF,
      bulletinFresh: fresh,
      explanation: [
        `Your priority date: ${pdLabel}`,
        `${bulletin.month} ${bulletin.year} Final Action Date for ${category} ${isIndia ? "India" : "Other"}: Current (C) — all priority dates in this category qualify`,
        ...staleNote,
      ],
      whatItMeans: `${category} ${isIndia ? "India" : "Other"} is marked "Current" in the ${bulletin.month} ${bulletin.year} bulletin — meaning all priority dates qualify for green card approval this month. Your date is current for Final Action purposes.`,
      chartGuide: "Since the category is fully current (C), both Table A and Table B are satisfied. Your attorney should check USCIS processing times and prepare to file or finalize I-485.",
      questionsForLawyer: [
        "My category is Current — can we file or approve I-485 now?",
        "How long are USCIS I-485 processing times at my field office?",
        stage === "i485-not-filed" || stage === "i140-approved" ? "Should we file I-485 immediately?" : "",
      ].filter(Boolean),
      readNext: [
        { href: "/visa-bulletin/priority-date-current-what-next", label: "Priority date current — what to do next" },
        { href: "/green-card/i-485", label: "I-485 filing guide" },
        { href: "/uscis/processing-times", label: "USCIS processing times" },
      ],
    };
  }

  if (faComparison === "current") {
    return {
      comparison: "current",
      relevantChart,
      cutoffFinalAction: cutoffFA,
      cutoffDatesForFiling: cutoffDFF,
      bulletinFresh: fresh,
      explanation: [
        `Your priority date: ${pdLabel}`,
        `${bulletin.month} ${bulletin.year} Final Action Date for ${category} ${isIndia ? "India" : "Other"}: ${faLabel}`,
        `Your priority date (${pdLabel}) appears to be before the Final Action Date cutoff — you may be current for final approval.`,
        ...staleNote,
      ],
      whatItMeans: `Based on the ${bulletin.month} ${bulletin.year} bulletin data in this tool, your priority date of ${pdLabel} appears to be before the ${category} ${isIndia ? "India" : ""} Final Action Date cutoff. This suggests your priority date may be current for green card approval — but verify with the official bulletin and your attorney.`,
      chartGuide: "Your date appearing current under Table A means USCIS can potentially approve your green card this month. If I-485 is not yet filed, file immediately. If pending, USCIS should be processing.",
      questionsForLawyer: [
        "My priority date appears current under Final Action Date — can we file or finalize I-485?",
        stage === "i485-not-filed" ? "Can we file I-485 this month given my priority date?" : "",
        stage === "i485-filed" ? "My I-485 is pending and my date appears current — when should I expect action?" : "",
        "Has USCIS confirmed I can file this month? Is Table B authorized?",
      ].filter(Boolean),
      readNext: [
        { href: "/visa-bulletin/priority-date-current-what-next", label: "Priority date current — what to do next" },
        { href: "/green-card/i-485", label: "I-485 adjustment of status guide" },
        { href: "/uscis/case-status", label: "USCIS case status guide" },
      ],
    };
  }

  if (faComparison === "not-current" && dffComparison === "current") {
    return {
      comparison: "not-current",
      relevantChart,
      cutoffFinalAction: cutoffFA,
      cutoffDatesForFiling: cutoffDFF,
      bulletinFresh: fresh,
      explanation: [
        `Your priority date: ${pdLabel}`,
        `${bulletin.month} ${bulletin.year} Final Action Date for ${category} ${isIndia ? "India" : "Other"}: ${faLabel}`,
        `${bulletin.month} ${bulletin.year} Dates for Filing for ${category} ${isIndia ? "India" : "Other"}: ${dffLabel}`,
        `Your priority date appears AFTER the Final Action Date but EARLIER THAN the Dates for Filing cutoff.`,
        `This means you may be able to FILE I-485 this month (for EAD/AP) — if USCIS authorizes Dates for Filing. Check uscis.gov/visabulletininfo.`,
        ...staleNote,
      ],
      whatItMeans: `Your priority date of ${pdLabel} appears to be in the "Dates for Filing" window for ${bulletin.month} ${bulletin.year}: past the Final Action Date (you cannot be approved yet), but before the Dates for Filing cutoff (you may be able to file I-485 for EAD/Advance Parole if USCIS authorizes Table B this month). Filing I-485 now gets you work authorization and a travel document while your Final Action Date approaches.`,
      chartGuide: "Filing under Dates for Filing (Table B) gives you EAD and AP, but your green card won't be approved until the Final Action Date (Table A) is also current. Verify USCIS has authorized Table B at uscis.gov/visabulletininfo before filing.",
      questionsForLawyer: [
        "Has USCIS authorized Dates for Filing (Table B) for this month?",
        "Should we file I-485 under Table B now to get EAD and AP?",
        "How far is my priority date from the Final Action Date cutoff?",
        "Is an EB-3 downgrade or EB-2 NIW worth exploring given my wait?",
      ],
      readNext: [
        { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Table A vs Table B — full guide" },
        { href: "/green-card/i-485", label: "I-485 adjustment of status guide" },
        { href: "/green-card/ead-advance-parole", label: "EAD and Advance Parole guide" },
      ],
    };
  }

  if (faComparison === "not-current") {
    return {
      comparison: "not-current",
      relevantChart,
      cutoffFinalAction: cutoffFA,
      cutoffDatesForFiling: cutoffDFF,
      bulletinFresh: fresh,
      explanation: [
        `Your priority date: ${pdLabel}`,
        `${bulletin.month} ${bulletin.year} Final Action Date for ${category} ${isIndia ? "India" : "Other"}: ${faLabel}`,
        bulletin.datesForFiling
          ? `${bulletin.month} ${bulletin.year} Dates for Filing for ${category} ${isIndia ? "India" : "Other"}: ${dffLabel}`
          : "Dates for Filing: Not authorized by USCIS this month",
        `Your priority date (${pdLabel}) appears AFTER both cutoff dates — your date is not yet current.`,
        ...staleNote,
      ],
      whatItMeans: `Based on the ${bulletin.month} ${bulletin.year} bulletin data, your priority date of ${pdLabel} appears to be after both the Final Action Date and the Dates for Filing cutoff for ${category} ${isIndia ? "India" : "Other"}. This means you are still waiting in the queue. Keep your I-140 approved, maintain valid H1B status, and monitor the bulletin monthly.`,
      chartGuide: "You are still in the priority date wait phase. Maintain your approved I-140 for H1B extensions. Prepare your I-485 package now so you can file quickly when your date eventually becomes current.",
      questionsForLawyer: [
        "Given my priority date and the current backlog movement, roughly when might my date become current?",
        "Should I explore EB-3 downgrade if EB-3 India is more current?",
        "Are my children at risk of aging out? Do we need a CSPA analysis?",
        "How do I ensure my H1B continues to be extended while I wait?",
      ],
      readNext: [
        { href: "/visa-bulletin/retrogression", label: "Retrogression explained" },
        { href: "/green-card/green-card-backlog-india", label: "India green card backlog" },
        { href: "/visa-bulletin/eb2-to-eb3-downgrade", label: "EB-2 to EB-3 downgrade strategy" },
        { href: "/green-card/cspa-kids-aging-out", label: "CSPA — children aging out" },
      ],
    };
  }

  if (faComparison === "unavailable") {
    return {
      comparison: "unavailable",
      relevantChart,
      cutoffFinalAction: cutoffFA,
      cutoffDatesForFiling: cutoffDFF,
      bulletinFresh: fresh,
      explanation: [
        `${category} ${isIndia ? "India" : "Other"} is marked "Unavailable (U)" in the ${bulletin.month} ${bulletin.year} bulletin.`,
        "No visa numbers are available for this category/country combination this month.",
        ...staleNote,
      ],
      whatItMeans: `This category and country combination is not available for green card issuance this month. This typically happens at the end of the fiscal year (September) or when demand in other categories has consumed available visa numbers. Check the next month's bulletin.`,
      chartGuide: "Unavailable (U) means no action is possible this month regardless of your priority date. Monitor future months.",
      questionsForLawyer: [
        "My category shows Unavailable — when is it expected to have numbers again?",
        "Should I consider a different category?",
      ],
      readNext: [
        { href: "/visa-bulletin/retrogression", label: "Retrogression and unavailability explained" },
        { href: "/visa-bulletin/monthly-update", label: "How to track the monthly bulletin" },
      ],
    };
  }

  // fallback: no data
  return {
    comparison: "no-data",
    relevantChart,
    cutoffFinalAction: cutoffFA,
    cutoffDatesForFiling: cutoffDFF,
    bulletinFresh: fresh,
    explanation: ["Unable to determine your comparison — please verify at travel.state.gov."],
    whatItMeans: "Check the official visa bulletin for your category and country directly.",
    chartGuide: "",
    questionsForLawyer: ["Can you review the current visa bulletin for my category and priority date?"],
    readNext: [{ href: "/visa-bulletin", label: "Visa bulletin guide" }],
  };
}

/* ─────────────────────── result color configs ───────────────────────────── */

const RESULT_CONFIGS: Record<ComparisonResult, { bg: string; border: string; badge: string; label: string }> = {
  "all-current":  { bg: "bg-emerald-50/60", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800", label: "Current — all dates qualify" },
  "current":      { bg: "bg-green-50/60",   border: "border-green-200",   badge: "bg-green-100 text-green-800",   label: "Priority date appears current" },
  "not-current":  { bg: "bg-amber-50/60",   border: "border-amber-200",   badge: "bg-amber-100 text-amber-800",   label: "Priority date not yet current" },
  "unavailable":  { bg: "bg-rose-50/60",    border: "border-rose-200",    badge: "bg-rose-100 text-rose-800",     label: "Category unavailable this month" },
  "no-data":      { bg: "bg-blue-50/60",    border: "border-blue-200",    badge: "bg-blue-100 text-blue-700",     label: "Educational mode — verify at official source" },
  "no-date":      { bg: "bg-blue-50/60",    border: "border-blue-200",    badge: "bg-blue-100 text-blue-700",     label: "Bulletin data shown — add priority date to compare" },
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function PriorityDateChecker() {
  const [category, setCategory] = useState<EbCategory>("");
  const [country, setCountry] = useState<Country>("");
  const [stage, setStage] = useState<Stage>("");
  const [chartInterest, setChartInterest] = useState<ChartInterest>("");
  const [priorityMonth, setPriorityMonth] = useState(0);
  const [priorityYear, setPriorityYear] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const bulletin = CURRENT_VISA_BULLETIN;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setCategory(""); setCountry(""); setStage(""); setChartInterest("");
    setPriorityMonth(0); setPriorityYear(0); setSubmitted(false);
  }

  const result = submitted
    ? assess(category, country, stage, chartInterest, priorityMonth, priorityYear)
    : null;

  const cfg = result ? RESULT_CONFIGS[result.comparison] : null;

  return (
    <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm sm:p-8">
      {/* header */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Priority Date Checker</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Where does your priority date stand?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Compare your priority date against the {bulletin.month} {bulletin.year} visa bulletin data.
        </p>
        <p className="mt-1 text-xs text-ink-400">
          Bulletin data last updated: {bulletin.lastUpdated} · Source:{" "}
          <a href={bulletin.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
            official visa bulletin
          </a>
        </p>
      </div>

      {/* disclaimer */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational only — not legal advice.</strong> This tool uses manually updated visa bulletin data. Always verify with the{" "}
        <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="underline font-semibold">official State Department visa bulletin</a>{" "}
        and the{" "}
        <a href="https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/visa-bulletin-information-for-adjustment-of-status-filing-chart" target="_blank" rel="noopener noreferrer" className="underline font-semibold">USCIS Adjustment of Status Filing Chart</a>.
        Confirm with your immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* row 1 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Employment green card category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as EbCategory)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20">
                <option value="">Select…</option>
                <option value="EB1">EB-1 (extraordinary ability / outstanding researcher / multinational exec)</option>
                <option value="EB2">EB-2 (advanced degree / exceptional ability / NIW)</option>
                <option value="EB3">EB-3 (skilled worker / professional)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Country of chargeability (country of birth)</span>
              <select value={country} onChange={(e) => setCountry(e.target.value as Country)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20">
                <option value="">Select…</option>
                <option value="india">India</option>
                <option value="other">Other country</option>
              </select>
            </label>
          </div>

          {/* row 2 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Current stage</span>
              <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20">
                <option value="">Select…</option>
                <option value="perm-pending">PERM pending with DOL</option>
                <option value="perm-approved">PERM approved — I-140 not yet filed</option>
                <option value="i140-pending">I-140 pending with USCIS</option>
                <option value="i140-approved">I-140 approved — waiting for priority date</option>
                <option value="i485-not-filed">Priority date current / approaching — I-485 not filed yet</option>
                <option value="i485-filed">I-485 already filed and pending</option>
                <option value="ead-ap">EAD / Advance Parole received</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Which chart are you trying to understand?</span>
              <select value={chartInterest} onChange={(e) => setChartInterest(e.target.value as ChartInterest)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20">
                <option value="">Select…</option>
                <option value="final-action">Final Action Date (Table A) — for green card approval</option>
                <option value="dates-for-filing">Dates for Filing (Table B) — to file I-485 early</option>
                <option value="not-sure">Not sure — show me both</option>
              </select>
            </label>
          </div>

          {/* priority date */}
          <div>
            <span className="text-xs font-semibold text-ink-800">
              Priority date{" "}
              <span className="font-normal text-ink-400">(month and year — optional, but enables comparison)</span>
            </span>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <select value={priorityMonth} onChange={(e) => setPriorityMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20">
                <option value={0}>Month…</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select value={priorityYear} onChange={(e) => setPriorityYear(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20">
                <option value={0}>Year…</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <p className="mt-1 text-xs text-ink-400">
              From your PERM receipt or I-140 approval notice. Do not enter receipt numbers or A-numbers.
            </p>
          </div>

          <button type="submit"
            className="mt-2 w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
            Check my priority date
          </button>
        </form>
      ) : result && cfg ? (
        <div className="space-y-4">
          {/* result card */}
          <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${cfg.badge}`}>
                {cfg.label}
              </span>
              <span className="text-xs text-ink-500">Based on {bulletin.month} {bulletin.year} data</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-800">{result.whatItMeans}</p>
          </div>

          {/* stale warning */}
          {!result.bulletinFresh && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-xs leading-relaxed text-rose-900">
              <strong className="font-semibold">Data may be stale:</strong> The visa bulletin data in this tool may not reflect the current month. Always check the latest official bulletin at{" "}
              <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="underline font-semibold">travel.state.gov</a>.
            </div>
          )}

          {/* bulletin data breakdown */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">{bulletin.month} {bulletin.year} visa bulletin data</p>
            <div className="space-y-2">
              {result.explanation.map((line, i) => (
                <p key={i} className="text-sm text-ink-700">→ {line}</p>
              ))}
            </div>
            {result.chartGuide && (
              <p className="mt-3 text-xs text-ink-500 border-t border-ink-900/5 pt-3">{result.chartGuide}</p>
            )}
          </div>

          {/* Dates for Filing note */}
          {bulletin.usingDatesForFiling && bulletin.datesForFiling && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs leading-relaxed text-blue-900">
              <strong className="font-semibold">Dates for Filing (Table B) is authorized this month</strong> per the USCIS Adjustment of Status Filing Chart. Verify at{" "}
              <a href="https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/visa-bulletin-information-for-adjustment-of-status-filing-chart" target="_blank" rel="noopener noreferrer" className="underline font-semibold">uscis.gov</a>.
            </div>
          )}
          {!bulletin.usingDatesForFiling && (
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Dates for Filing (Table B) is NOT authorized this month</strong> per this tool's data. Only Final Action Dates (Table A) governs I-485 filing this month. Verify at uscis.gov.
            </div>
          )}

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

          {/* read next */}
          <div className="grid gap-2 sm:grid-cols-2">
            {result.readNext.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-500 hover:shadow-sm">
                <span className="text-base">📘</span>
                {link.label}
              </Link>
            ))}
            <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-500 hover:shadow-sm">
              <span className="text-base">🔗</span>
              Official visa bulletin
            </a>
          </div>

          {/* disclaimer */}
          <p className="text-center text-xs leading-relaxed text-ink-400">
            This tool is educational and depends on manually updated visa bulletin data. Always verify with the official{" "}
            <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="underline">State Department visa bulletin</a>{" "}
            and USCIS adjustment of status filing chart. Not legal advice.
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
