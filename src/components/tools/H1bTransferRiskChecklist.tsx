"use client";

import { useState } from "react";
import Link from "next/link";
import { premiumProcessing } from "@/lib/premiumProcessing";

/* ─────────────────────── types ─────────────────────────────────────────── */

type EmploymentStatus = "employed" | "laid-off" | "resigned" | "offer-received" | "" ;
type DaysSinceEmployment = "0-15" | "16-30" | "31-45" | "46-60" | "60+" | "na" | "";
type PetitionFiled = "yes" | "no" | "in-progress" | "" ;
type ReceiptReceived = "yes" | "no" | "" ;
type PremiumProcessing = "yes" | "no" | "considering" | "" ;
type I94Valid = "yes" | "no" | "" ;
type VisaStampValid = "yes" | "no" | "" ;
type TravelPlan = "yes" | "no" | "maybe" | "";
type RfeReceived = "yes" | "no" | "" ;

/* ─────────────────────── risk tiers ────────────────────────────────────── */

type RiskTier = "low" | "medium" | "high" | "urgent";

interface ChecklistResult {
  tier: RiskTier;
  headline: string;
  summary: string;
  documentsToCollect: string[];
  whatToCheck: string[];
  premiumNote?: string;
  travelWarning?: string;
  gracePeriodCaution?: string;
  showAttorneyBadge: boolean;
}

/* ─────────────────────── assessment logic ───────────────────────────────── */

function assess(
  status: EmploymentStatus,
  days: DaysSinceEmployment,
  petitionFiled: PetitionFiled,
  receiptReceived: ReceiptReceived,
  premium: PremiumProcessing,
  i94Valid: I94Valid,
  visaValid: VisaStampValid,
  travel: TravelPlan,
  rfe: RfeReceived
): ChecklistResult {

  const isLayoff = status === "laid-off" || status === "resigned";
  const isLate = days === "46-60" || days === "60+";
  const isVeryLate = days === "60+";
  const i94Expired = i94Valid === "no";
  const rfeActive = rfe === "yes";
  const travelRisk = travel === "yes" || travel === "maybe";
  const noFiling = petitionFiled === "no";

  // Urgent tier
  if (rfeActive) {
    return {
      tier: "urgent",
      headline: "RFE received — attorney action required immediately",
      summary:
        "A Request for Evidence has a hard deadline on the notice — for H-1B I-129, generally up to about 84 days (≈87 with US mailing time). Miss it and USCIS may deny the petition as abandoned or decide it on the existing record. Contact your employer's immigration attorney the same day.",
      documentsToCollect: [
        "The RFE notice (get a copy from HR or the attorney)",
        "All prior H1B I-797 approval notices",
        "Employment offer letter and current LCA",
        "Recent pay stubs (last 6 months)",
        "Academic transcripts and degree certificates",
        "Any client letters or project documentation (for consulting RFEs)",
      ],
      whatToCheck: [
        "Exact RFE response deadline (from the notice date, not mailing date)",
        "Which attorney is handling the response",
        "Whether premium processing applies to the remaining adjudication",
        "Your current work authorization status while RFE is pending",
      ],
      showAttorneyBadge: true,
    };
  }

  if (isVeryLate && isLayoff) {
    return {
      tier: "urgent",
      headline: "Likely past 60-day grace period — consult an attorney immediately",
      summary:
        "If more than 60 days have passed since your H1B employment ended and no petition has been filed or change of status pursued, you may be out of status. Do not make assumptions — consult an immigration attorney today to understand your options.",
      documentsToCollect: [
        "All prior H1B I-797 approval notices",
        "Passport copies",
        "I-94 record (cbp.dhs.gov/I94)",
        "Last pay stub from prior employer",
        "Any severance or WARN Act notice documentation",
        "Any job offer letters received",
      ],
      whatToCheck: [
        "Exact date your H1B employment ended",
        "Whether a WARN Act notice extended your employment date",
        "Your current I-94 status and expiry",
        "Whether any petition was filed during the 60-day window",
      ],
      showAttorneyBadge: true,
      gracePeriodCaution:
        "The 60-day H1B grace period starts from the last day of H1B employment — not the last paycheck. If this window has passed without a filed petition or change of status, speak to an attorney before making any decisions.",
    };
  }

  if (i94Expired) {
    return {
      tier: "urgent",
      headline: "I-94 expired — immediate attorney consultation needed",
      summary:
        "If your I-94 has expired and no approved or pending petition covers you, you may be out of status. AC21 portability does not apply after I-94 expiry. Consult an immigration attorney immediately.",
      documentsToCollect: [
        "Current I-94 record (cbp.dhs.gov/I94)",
        "All prior H1B I-797 approval notices",
        "Any pending petition receipt notices",
        "Passport copies",
      ],
      whatToCheck: [
        "Whether a pending petition was filed before the I-94 expired",
        "Whether the 240-day rule may apply",
        "Your current legal status in the US",
      ],
      showAttorneyBadge: true,
    };
  }

  // High risk tier
  if (isLayoff && isLate && noFiling) {
    return {
      tier: "high",
      headline: "High planning risk — act before the grace period expires",
      summary:
        "You are in or approaching the critical window of the H1B 60-day grace period without a filed transfer petition. Time is running short. Contact an attorney and pursue a new employer filing or change of status before day 60.",
      documentsToCollect: [
        "All prior H1B I-797 approval notices",
        "Passport and all immigration documents",
        "I-94 record printout",
        "Last pay stub from prior employer",
        "Any new offer letters",
      ],
      whatToCheck: [
        "Exact last day of H1B employment",
        "Whether a WARN Act notice applies",
        "Your I-94 expiry date",
        "New employer filing timeline — premium processing is strongly advisable",
        "Whether H-4 or other change of status is an option",
      ],
      premiumNote: `Premium processing is strongly recommended in this situation. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). USCIS acts within 15 business days — regular processing (months) may be too slow given the grace period timeline. Always verify the current fee on the USCIS Form I-907 page.`,
      showAttorneyBadge: true,
      gracePeriodCaution:
        "The 60-day H1B grace period allows you to stay in the US and seek a new employer, but you cannot work without a valid work authorization. The period runs from your last day of H1B employment.",
    };
  }

  if (isLayoff && petitionFiled !== "yes" && !isLate) {
    return {
      tier: "high",
      headline: "Laid off with no petition filed yet — act quickly",
      summary:
        "You are in the H1B grace period and no new petition has been filed yet. Time is limited. Get a new employer filing started — ideally with premium processing — as soon as possible.",
      documentsToCollect: [
        "All prior H1B I-797 approval notices",
        "Passport copies",
        "I-94 record",
        "Most recent pay stubs",
        "Academic credentials",
        "Termination or layoff documentation",
      ],
      whatToCheck: [
        "Exact last day of H1B employment",
        "I-94 expiry date",
        "New employer or offer situation",
        "Whether premium processing will be used",
        "Whether H-4 change of status is available if new employer timeline is uncertain",
      ],
      premiumNote: `Premium processing is strongly advisable when you have a job offer and are in the grace period. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). It reduces the wait from months to 15 business days. Verify on the USCIS Form I-907 page before filing.`,
      showAttorneyBadge: true,
      gracePeriodCaution:
        "You have up to 60 days (or until your I-94 expires, whichever is shorter) from your last day of H1B employment to file a new petition or change status. You cannot work during this period without valid work authorization.",
    };
  }

  if (petitionFiled === "yes" && receiptReceived === "no" && isLayoff) {
    return {
      tier: "high",
      headline: "Petition filed but no receipt yet — confirm filing and status",
      summary:
        "Your petition has been filed but you do not yet have a receipt notice. Until USCIS issues a receipt number, work authorization under AC21 portability is not clearly established. Confirm the filing date and follow up with the attorney for the receipt notice.",
      documentsToCollect: [
        "Filing cover letter or FedEx/USPS tracking confirming delivery to USCIS",
        "Copy of the I-129 petition filed",
        "Prior I-797 approval notices",
        "I-94 record",
      ],
      whatToCheck: [
        "Confirm the petition was physically delivered to USCIS",
        "Ask your attorney for the receipt notice (may take 2-4 weeks for regular, faster for premium)",
        "Confirm whether premium processing was included",
        "Do not begin work until receipt notice is in hand and attorney confirms portability applies",
      ],
      premiumNote: `If premium processing was not included, ask your attorney about upgrading now — the receipt notice arrives faster and reduces your uncertainty window. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Verify on the USCIS Form I-907 page before filing.`,
      showAttorneyBadge: true,
      gracePeriodCaution:
        "Continue tracking the 60-day grace period from your employment end date. The petition filing date matters — ensure it was filed within the grace period while your I-94 was still valid.",
    };
  }

  // Travel warning (medium risk overlay)
  if (travelRisk) {
    const base: ChecklistResult = {
      tier: "medium",
      headline: "Travel before approval carries real risk — consult attorney first",
      summary:
        "Planning to travel to India before your H1B transfer or extension is approved significantly increases your risk. You may need a new visa stamp to re-enter, and the stamping process carries 221(g) administrative processing risk — especially after a recent employer change.",
      documentsToCollect: [
        "Current I-797 H1B approval notice",
        "Prior I-797 notices",
        "Valid passport",
        "I-94 record",
        "Employer support letter",
        "Recent pay stubs",
      ],
      whatToCheck: [
        "Whether your visa stamp is valid for re-entry",
        "Whether your H1B petition needs to be approved before you can safely travel",
        "221(g) risk at Indian consulates given your employer/role type",
        "Your employer's policy on travel during pending petitions",
      ],
      showAttorneyBadge: true,
      travelWarning:
        "Do not travel to India (or internationally) while an H1B petition is pending without consulting your attorney. If your visa stamp expired or shows a previous employer, you will need new stamping to re-enter — which carries 221(g) risk. Some situations require waiting for the petition to be approved before traveling.",
    };
    return base;
  }

  // Low-medium: employed, petition filed, receipt received
  if (
    status === "employed" &&
    petitionFiled === "yes" &&
    receiptReceived === "yes" &&
    !i94Expired &&
    !rfeActive
  ) {
    return {
      tier: "low",
      headline: "Low planning risk — standard transfer in progress",
      summary:
        "Your H1B transfer petition is filed and receipted, you are currently employed, and there are no immediate red flags. Continue monitoring your case and ensure your employment and I-94 remain valid until the petition is adjudicated.",
      documentsToCollect: [
        "Receipt notice (I-797C) — keep a copy",
        "Current I-797 approval notice from current employer",
        "Valid passport",
        "I-94 record",
        "Recent pay stubs from current employer",
      ],
      whatToCheck: [
        "Monitor case status at egov.uscis.gov",
        "Check uscis.gov/check-processing-times for your service center",
        "Ensure your I-94 and current H1B do not expire before the transfer is approved",
        "Confirm whether premium processing was selected — if not, compare timeline to I-94 expiry",
      ],
      premiumNote:
        premium === "no"
          ? `Consider asking your employer about premium processing if your current I-94 expiry is within 6 months. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Regular processing can take 3–6 months. Verify on the USCIS Form I-907 page.`
          : undefined,
      showAttorneyBadge: false,
    };
  }

  // Medium fallback
  return {
    tier: "medium",
    headline: "Medium planning risk — verify your situation carefully",
    summary:
      "Your situation has one or more factors that warrant careful attention. Review the checklist below and confirm your status with your employer's immigration attorney before making any employment or travel decisions.",
    documentsToCollect: [
      "All prior H1B I-797 approval notices",
      "Passport copies",
      "I-94 record (cbp.dhs.gov/I94)",
      "Recent pay stubs from current or last employer",
      "Offer letter from new employer (if applicable)",
      "Academic credentials",
    ],
    whatToCheck: [
      "Your current I-94 validity and expiry date",
      "Whether a new H1B petition is filed or in progress",
      "Whether premium processing is advisable given your timeline",
      "Whether your visa stamp is valid for any planned travel",
      "Official processing times at uscis.gov/check-processing-times",
    ],
    premiumNote: `If your current H1B status or I-94 expiry is within 6 months, ask your employer about premium processing for the pending or planned petition. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Verify on the USCIS Form I-907 page before filing.`,
    showAttorneyBadge: true,
  };
}

/* ─────────────────────── tier UI ───────────────────────────────────────── */

const TIER_CONFIG: Record<RiskTier, { bg: string; border: string; badge: string; badgeText: string }> = {
  low: {
    bg: "bg-emerald-50/60",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    badgeText: "Low planning risk",
  },
  medium: {
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    badgeText: "Medium planning risk",
  },
  high: {
    bg: "bg-orange-50/60",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
    badgeText: "High planning risk",
  },
  urgent: {
    bg: "bg-rose-50/60",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800",
    badgeText: "Attorney discussion recommended urgently",
  },
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function H1bTransferRiskChecklist() {
  const [empStatus, setEmpStatus] = useState<EmploymentStatus>("");
  const [days, setDays] = useState<DaysSinceEmployment>("");
  const [petitionFiled, setPetitionFiled] = useState<PetitionFiled>("");
  const [receiptReceived, setReceiptReceived] = useState<ReceiptReceived>("");
  const [premium, setPremium] = useState<PremiumProcessing>("");
  const [i94Valid, setI94Valid] = useState<I94Valid>("");
  const [visaValid, setVisaValid] = useState<VisaStampValid>("");
  const [travel, setTravel] = useState<TravelPlan>("");
  const [rfe, setRfe] = useState<RfeReceived>("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (empStatus) setSubmitted(true);
  }

  function handleReset() {
    setEmpStatus(""); setDays(""); setPetitionFiled(""); setReceiptReceived("");
    setPremium(""); setI94Valid(""); setVisaValid(""); setTravel(""); setRfe("");
    setSubmitted(false);
  }

  const result = submitted && empStatus
    ? assess(empStatus, days, petitionFiled, receiptReceived, premium, i94Valid, visaValid, travel, rfe)
    : null;

  const tierCfg = result ? TIER_CONFIG[result.tier] : null;

  return (
    <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/60 to-white p-6 shadow-sm sm:p-8">
      {/* header */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">H1B Transfer Risk Checklist</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Check your H1B transfer situation
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Get an educational risk assessment based on your current status. No personal information collected.
        </p>
      </div>

      {/* disclaimer */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Not legal advice.</strong> H1B transfer situations depend on specific legal facts that vary by case. Many H1B transfer situations depend on timing, filing, receipt, status, and employer attorney guidance.{" "}
        <strong>Confirm with your immigration attorney before making work or travel decisions.</strong>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Current employment status <span className="text-rose-500">*</span></span>
              <select value={empStatus} onChange={(e) => setEmpStatus(e.target.value as EmploymentStatus)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20" required>
                <option value="">Select status…</option>
                <option value="employed">Currently employed (H1B active)</option>
                <option value="laid-off">Laid off</option>
                <option value="resigned">Resigned</option>
                <option value="offer-received">Job offer received, not yet started</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Days since last H1B employment ended</span>
              <select value={days} onChange={(e) => setDays(e.target.value as DaysSinceEmployment)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="0-15">0–15 days</option>
                <option value="16-30">16–30 days</option>
                <option value="31-45">31–45 days</option>
                <option value="46-60">46–60 days</option>
                <option value="60+">More than 60 days</option>
                <option value="na">Not applicable / still employed</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Has new employer filed H1B transfer?</span>
              <select value={petitionFiled} onChange={(e) => setPetitionFiled(e.target.value as PetitionFiled)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="yes">Yes — petition filed</option>
                <option value="no">No — not yet filed</option>
                <option value="in-progress">In progress (preparing to file)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Receipt notice (I-797C) received?</span>
              <select value={receiptReceived} onChange={(e) => setReceiptReceived(e.target.value as ReceiptReceived)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="yes">Yes — receipt notice in hand</option>
                <option value="no">No — not yet received</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Premium processing requested?</span>
              <select value={premium} onChange={(e) => setPremium(e.target.value as PremiumProcessing)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="considering">Considering it</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Is your current I-94 valid?</span>
              <select value={i94Valid} onChange={(e) => setI94Valid(e.target.value as I94Valid)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="yes">Yes — I-94 is currently valid</option>
                <option value="no">No — I-94 has expired</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Is your H1B visa stamp valid?</span>
              <select value={visaValid} onChange={(e) => setVisaValid(e.target.value as VisaStampValid)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="yes">Yes — valid stamp in passport</option>
                <option value="no">No — expired or never stamped</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Planning to travel to India before approval?</span>
              <select value={travel} onChange={(e) => setTravel(e.target.value as TravelPlan)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
                <option value="">Select…</option>
                <option value="yes">Yes — travel planned</option>
                <option value="no">No — no travel planned</option>
                <option value="maybe">Maybe / not decided yet</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-ink-800">Have you received an RFE?</span>
            <select value={rfe} onChange={(e) => setRfe(e.target.value as RfeReceived)}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-400/20">
              <option value="">Select…</option>
              <option value="yes">Yes — RFE received</option>
              <option value="no">No RFE</option>
            </select>
          </label>

          <button type="submit" disabled={!empStatus}
            className="mt-2 w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40">
            Run the checklist
          </button>
        </form>
      ) : result && tierCfg ? (
        <div className="space-y-4">
          {/* result card */}
          <div className={`rounded-2xl border ${tierCfg.border} ${tierCfg.bg} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-ink-900">{result.headline}</h3>
              <span className={`flex-none rounded-full px-2.5 py-1 text-xs font-bold ${tierCfg.badge}`}>
                {tierCfg.badgeText}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.summary}</p>
          </div>

          {/* 60-day caution */}
          {result.gracePeriodCaution && (
            <div className="rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-3 text-xs leading-relaxed text-orange-900">
              <strong className="font-semibold">60-day grace period:</strong>{" "}
              {result.gracePeriodCaution}
            </div>
          )}

          {/* travel warning */}
          {result.travelWarning && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs leading-relaxed text-rose-900">
              <strong className="font-semibold">Travel warning:</strong>{" "}
              {result.travelWarning}
            </div>
          )}

          {/* what to check */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">What to check</p>
            <ul className="space-y-2">
              {result.whatToCheck.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1 flex-none text-orange-500">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* documents to collect */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Documents to collect</p>
            <ul className="space-y-1.5">
              {result.documentsToCollect.map((doc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1 flex-none text-emerald-500">✓</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* premium note */}
          {result.premiumNote && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-xs leading-relaxed text-indigo-900">
              <strong className="font-semibold">Premium processing:</strong>{" "}
              {result.premiumNote}{" "}
              <strong>Premium processing does not guarantee approval</strong> — it guarantees USCIS will act within 15 business days.
            </div>
          )}

          {/* attorney badge */}
          {result.showAttorneyBadge && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Talk to your employer's immigration attorney.</strong>{" "}
              H1B transfer situations are legally complex. Many H1B transfer situations depend on timing, filing, receipt, status, and employer attorney guidance. Confirm all work and travel decisions with your immigration attorney before acting.
            </div>
          )}

          {/* links */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/h1b/transfer" className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-orange-400 hover:shadow-sm">
              <span className="text-base">📋</span> H1B Transfer Guide
            </Link>
            <Link href="/tools/uscis-processing-delay-checker" className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-orange-400 hover:shadow-sm">
              <span className="text-base">⏱️</span> Processing Delay Checker
            </Link>
          </div>

          {/* disclaimer */}
          <p className="text-center text-xs leading-relaxed text-ink-400">
            This tool provides general educational guidance only — not legal or immigration advice. H1B transfer situations depend on specific facts. Confirm with your immigration attorney before making work or travel decisions.
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
