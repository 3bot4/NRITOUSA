"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────── types ─────────────────────────────────────────── */

type NoticeType =
  | "receipt"
  | "biometrics"
  | "rfe"
  | "approval"
  | "transfer"
  | "interview"
  | "card-production"
  | "access-code"
  | "address-confirmation"
  | "not-sure"
  | "";

type FormType =
  | "i129-h1b"
  | "i140"
  | "i485"
  | "i765"
  | "i131"
  | "i130"
  | "n400"
  | "not-sure"
  | "";

type Situation =
  | "h1b"
  | "h4"
  | "f1-opt"
  | "green-card-pending"
  | "citizenship"
  | "family-green-card"
  | "other"
  | "";

/* ─────────────────────── notice data ───────────────────────────────────── */

interface NoticeResult {
  summary: string;
  whatItMeans: string;
  checkOnNotice: string[];
  commonMistakes: string[];
  deadline: string | null;
  contactAttorney: boolean;
  attorneyNote: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  relatedLinks: { href: string; label: string }[];
}

const BASE_LINKS = {
  uscis: { href: "/uscis", label: "USCIS Hub" },
  statusMeaning: { href: "/tools/uscis-case-status-meaning", label: "USCIS Case Status Meaning" },
  delayChecker: { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker" },
  receiptNumber: { href: "/uscis/receipt-number", label: "Receipt Number Guide (IOE/LIN/SRC/EAC/WAC/MSC)" },
  caseStatus: { href: "/uscis/case-status", label: "USCIS Case Status Explained" },
  processingTimes: { href: "/tools/processing-times", label: "USCIS Processing Times" },
  myuscis: { href: "/uscis/myuscis-account", label: "myUSCIS Account Guide" },
  rfeGuide: { href: "/uscis/rfe-notice", label: "RFE Notice Guide" },
  approvalGuide: { href: "/uscis/approval-notice", label: "Approval Notice Guide" },
  i797Guide: { href: "/uscis/i-797-notice", label: "I-797 Notice Types Explained" },
  biometricsGuide: { href: "/uscis/biometrics-notice", label: "Biometrics Notice Guide" },
};

function buildResult(
  noticeType: NoticeType,
  formType: FormType,
  situation: Situation
): NoticeResult {
  const isH1b = formType === "i129-h1b" || situation === "h1b";
  const isGreenCard = formType === "i140" || formType === "i485" || situation === "green-card-pending";
  const isEad = formType === "i765" || formType === "i131";
  const isCitizenship = formType === "n400" || situation === "citizenship";

  switch (noticeType) {
    case "receipt":
      return {
        summary: "Receipt Notice (I-797C) — Your filing was accepted by USCIS",
        whatItMeans:
          "USCIS has received your filing, verified the fee, and assigned a case record. This is the first notice you receive after any petition or application is filed. It does not mean anything about whether your case will be approved — it simply confirms receipt. Your receipt number (on the notice) is how you track your case from this point forward.",
        checkOnNotice: [
          "Your full name — spelled exactly as in your passport",
          "Receipt number (13 characters, starts with 3 letters)",
          "Form type (e.g., I-129, I-140, I-485)",
          "Petitioner or applicant name",
          ...(isH1b ? ["Priority date if shown", "Petition classification (H-1B)"] : []),
          ...(isGreenCard ? ["Priority date (critical for I-140 receipts)", "EB category"] : []),
          "Receipt date (this is the official filing date)",
        ],
        commonMistakes: [
          "Thinking receipt = approval — they are very different",
          "Not checking the receipt number for typos (hard to fix after)",
          ...(isGreenCard ? ["Not noting the priority date — it controls your entire green card wait"] : []),
          "Losing the original notice — keep it in a secure place",
        ],
        deadline: null,
        contactAttorney: false,
        attorneyNote:
          "Share the receipt notice with your attorney and confirm they have the correct receipt number on file. No urgency unless your name, date, or form type is wrong — then contact attorney immediately.",
        urgencyLevel: "low",
        relatedLinks: [
          BASE_LINKS.receiptNumber,
          BASE_LINKS.caseStatus,
          BASE_LINKS.statusMeaning,
          BASE_LINKS.i797Guide,
        ],
      };

    case "biometrics":
      return {
        summary: "Biometrics Appointment Notice — Schedule your fingerprint and photo appointment",
        whatItMeans:
          "USCIS has scheduled a biometrics appointment for you at an Application Support Center (ASC). Biometrics are fingerprints, a digital photo, and sometimes a signature. They are used for background checks by FBI and DHS. This notice is required for I-485 (adjustment of status), I-765 (EAD), N-400 (naturalization), and some other forms. Missing without rescheduling can delay or harm your case.",
        checkOnNotice: [
          "Appointment date, time, and location (ASC address)",
          "What to bring: the notice itself, a valid government-issued photo ID",
          "Which forms this appointment covers",
          "Whether you can reschedule (instructions are on the notice)",
        ],
        commonMistakes: [
          "Not bringing the original biometrics notice to the appointment",
          "Bringing only a photocopy — bring the original",
          "Missing the appointment without rescheduling — contact USCIS immediately to reschedule",
          "Thinking biometrics = interview — they are different appointments",
          "Not showing a valid ID (passport, state ID, or driver's license)",
        ],
        deadline:
          "Attend on the scheduled date. If you cannot attend, reschedule BEFORE the appointment date by calling 1-800-375-5283 or through myUSCIS.",
        contactAttorney: true,
        attorneyNote:
          "Inform your attorney you received the biometrics notice. If you cannot attend, reschedule promptly. Missing biometrics without rescheduling can pause adjudication indefinitely.",
        urgencyLevel: "medium",
        relatedLinks: [
          BASE_LINKS.biometricsGuide,
          BASE_LINKS.caseStatus,
          BASE_LINKS.myuscis,
        ],
      };

    case "rfe":
      return {
        summary: "Request for Evidence (RFE) — USCIS needs more documentation from you",
        whatItMeans:
          "An RFE is USCIS formally requesting additional evidence or clarification before they can adjudicate your case. It is NOT a denial. Many cases with RFEs are ultimately approved. However, the response has a hard deadline — missing it typically results in automatic denial. The RFE will specify exactly what USCIS needs and cite the specific legal basis for the request.",
        checkOnNotice: [
          "RESPONSE DUE DATE — mark this immediately (typically 87 days from the notice date)",
          "The specific evidence or documentation requested",
          "The legal basis USCIS cited (regulation or policy memo)",
          "The exact mailing address or online submission instructions for your response",
          "Whether premium processing is suspended (common for I-129 H1B RFEs)",
        ],
        commonMistakes: [
          "Waiting to contact your attorney — start immediately",
          "Missing the deadline — results in denial with no further review",
          "Responding with incomplete evidence — a partial response is almost as bad as no response",
          "Mailing to the wrong address — read the specific return instructions on the RFE",
          ...(isH1b ? ["Underestimating specialty occupation RFEs — these require strong legal briefs and expert letters"] : []),
        ],
        deadline:
          "HARD DEADLINE: USCIS must RECEIVE (not postmark) your response by the date shown on the notice — typically 87 days from the notice date. Missing this deadline results in automatic denial.",
        contactAttorney: true,
        attorneyNote:
          "Contact your attorney TODAY. Do not wait even one day. Preparing a strong RFE response requires time for legal research, evidence gathering, and brief writing. Share the full RFE notice with your attorney immediately.",
        urgencyLevel: "critical",
        relatedLinks: [
          BASE_LINKS.rfeGuide,
          BASE_LINKS.caseStatus,
          BASE_LINKS.delayChecker,
          BASE_LINKS.statusMeaning,
        ],
      };

    case "approval":
      return {
        summary: "Approval Notice (I-797A or I-797B) — Your petition or application was approved",
        whatItMeans:
          "USCIS approved your petition or application. What you do next depends on which form was approved. An H1B approval (I-797A) includes a new I-94 at the bottom — this is your authorized stay document. An I-140 approval establishes your priority date for the green card queue. An I-485 approval means your green card is on the way. An EAD approval means your work card is being produced.",
        checkOnNotice: [
          "Your full name — spelled correctly",
          "Form type and category",
          ...(isH1b ? [
            "Petition validity dates (start and end)",
            "I-94 section at bottom — authorized stay from/to dates",
            "Classification code (H-1B)",
            "Employer name matches exactly",
          ] : []),
          ...(isGreenCard && formType === "i140" ? [
            "PRIORITY DATE — critical, verify this matches your PERM filing date exactly",
            "EB category (EB-1, EB-2, EB-3)",
            "Petitioner/employer name",
          ] : []),
          ...(isGreenCard && formType === "i485" ? [
            "Approval date",
            "Your name and A-number if shown",
          ] : []),
          ...(isEad ? [
            "EAD category code",
            "Do NOT assume you can work — wait for the physical card",
          ] : []),
        ],
        commonMistakes: [
          "Not keeping the original notice — it is a legal immigration document",
          ...(isH1b ? [
            "Confusing H1B visa stamp expiration with I-797 I-94 expiration — they are different",
            "Not checking the I-94 validity dates match what was requested",
          ] : []),
          ...(isGreenCard && formType === "i140" ? ["Not verifying the priority date — a wrong date affects your entire wait time"] : []),
          ...(isEad ? ["Starting work before receiving the physical EAD card — the approval notice alone is not work authorization"] : []),
          "Not telling your attorney immediately if any detail is wrong",
        ],
        deadline: null,
        contactAttorney: formType === "i140" || isH1b,
        attorneyNote:
          formType === "i140"
            ? "Verify the priority date with your attorney immediately. An incorrect priority date on I-140 needs to be corrected with USCIS as soon as possible."
            : isH1b
            ? "Review the approval notice with your attorney to confirm all details, especially if you have upcoming travel or a visa stamp appointment."
            : "Review the approval notice for any errors. Contact your attorney if your name, dates, or classification are incorrect.",
        urgencyLevel: "low",
        relatedLinks: [
          BASE_LINKS.approvalGuide,
          BASE_LINKS.i797Guide,
          BASE_LINKS.caseStatus,
          ...(isGreenCard ? [{ href: "/tools/green-card-tracker", label: "Green Card Wait Tracker" }] : []),
        ],
      };

    case "transfer":
      return {
        summary: "Transfer Notice (I-797C) — Your case moved to a different USCIS service center",
        whatItMeans:
          "USCIS transferred your case from one service center to another. This happens when workloads are redistributed or when your case requires a specific center's jurisdiction. Your receipt number does NOT change. The transfer itself does not mean anything is wrong. However, your processing time expectation should be reset to the new service center's published timeline.",
        checkOnNotice: [
          "Which service center the case was transferred FROM",
          "Which service center the case was transferred TO",
          "Your receipt number (should be unchanged)",
          "New mailing address if you need to correspond with USCIS about this case",
        ],
        commonMistakes: [
          "Panicking — transfers are routine and do not affect case merits",
          "Assuming your processing clock resets to zero — check the new center's current time estimate",
          "Sending correspondence to the old service center after transfer",
          "Forgetting to update your attorney about the transfer so they update their records",
        ],
        deadline: null,
        contactAttorney: false,
        attorneyNote:
          "Inform your attorney about the transfer notice so they update their correspondence address. No urgent action required unless you were close to an expected adjudication date at the original center.",
        urgencyLevel: "low",
        relatedLinks: [
          BASE_LINKS.processingTimes,
          BASE_LINKS.statusMeaning,
          BASE_LINKS.receiptNumber,
          BASE_LINKS.caseStatus,
        ],
      };

    case "interview":
      return {
        summary: "Interview Notice — USCIS has scheduled you for an in-person interview",
        whatItMeans:
          "USCIS requires you to appear for an in-person interview at a local field office. Interviews are common for I-485 (adjustment of status) and N-400 (naturalization). The interview tests your eligibility and truthfulness of your application. Missing the interview without rescheduling typically results in denial or abandonment.",
        checkOnNotice: [
          "Interview date, time, and field office address",
          "What documents to bring (typically listed on the notice)",
          "Which forms the interview covers (I-485, N-400, etc.)",
          "Whether a spouse or family member must also appear",
          "Whether original documents are required (passports, civil documents)",
        ],
        commonMistakes: [
          "Not bringing the interview notice and all requested original documents",
          "Missing the interview without rescheduling — contact USCIS immediately",
          "Not preparing with your attorney beforehand",
          ...(isCitizenship ? ["Not reviewing civics test questions for N-400 interviews"] : []),
          "Being late — treat the appointment like a court appearance",
        ],
        deadline:
          "Attend on the scheduled date. If you cannot attend, contact USCIS or your attorney BEFORE the interview date to reschedule. Missing without rescheduling = likely denial or abandonment.",
        contactAttorney: true,
        attorneyNote:
          "Contact your attorney immediately after receiving the interview notice. Many attorneys accompany clients to I-485 interviews. Prepare thoroughly — review your application, civil documents, and any potential issues your attorney has flagged.",
        urgencyLevel: "high",
        relatedLinks: [
          BASE_LINKS.caseStatus,
          BASE_LINKS.statusMeaning,
          BASE_LINKS.uscis,
          ...(isCitizenship ? [{ href: "/tools/citizenship-checklist", label: "Citizenship Checklist" }] : []),
        ],
      };

    case "card-production":
      return {
        summary: "Card Production Notice — Your physical card (green card or EAD) is being printed",
        whatItMeans:
          "USCIS is producing your physical card. This notice (or the online status 'Card Is Being Produced') means the printing process has started. After production, the card is mailed via USPS — the status then changes to 'Card Was Mailed.' Delivery typically takes 7–10 business days after the mailed status appears. Do not try to use an EAD card for work until you physically have it in hand.",
        checkOnNotice: [
          "Your mailing address — is it current?",
          "Which card is being produced (green card, EAD, combo EAD/AP card)",
          "Any instructions about delivery confirmation or card pickup",
        ],
        commonMistakes: [
          "Attempting to start work on an EAD before the physical card arrives",
          "Not being home to receive a card that requires signature",
          "Not updating your address before card production if you have moved",
          "Panicking if delivery takes 2–3 weeks after 'Card Was Mailed' — USPS can be slow",
          "Waiting more than 30 days after 'Card Was Mailed' without contacting USCIS",
        ],
        deadline: null,
        contactAttorney: false,
        attorneyNote:
          "If your card does not arrive within 30 days of the 'Card Was Mailed' status, contact USCIS. Your attorney can help initiate a card replacement if it appears lost in mail.",
        urgencyLevel: "low",
        relatedLinks: [
          BASE_LINKS.caseStatus,
          BASE_LINKS.statusMeaning,
          BASE_LINKS.uscis,
        ],
      };

    case "access-code":
      return {
        summary: "Online Access Code Notice — Code to link your paper case to myUSCIS",
        whatItMeans:
          "USCIS mailed you a one-time online access code to link your paper-filed case to your myUSCIS dashboard at my.uscis.gov. This is not a substantive immigration notice — it is a technical convenience notice. Enter the code on myUSCIS to view your case online, receive notifications, and in some cases respond to RFEs electronically.",
        checkOnNotice: [
          "The access code (copy it exactly — it is case-sensitive)",
          "Your receipt number (you will need both to link the case)",
          "Expiration date of the code (codes expire — use it promptly)",
        ],
        commonMistakes: [
          "Losing or discarding the notice before entering the code",
          "Trying to use the access code without also having the receipt number",
          "Entering the code on any site other than the official my.uscis.gov",
          "Waiting until the code expires — use it within the timeframe shown",
        ],
        deadline:
          "Enter your access code on my.uscis.gov before it expires. Check the notice for the specific expiration date.",
        contactAttorney: false,
        attorneyNote:
          "No attorney action needed for this notice. This is a technical linking notice for your myUSCIS account. Your attorney does not need a copy.",
        urgencyLevel: "low",
        relatedLinks: [
          { href: "/uscis/online-access-code", label: "Online Access Code Guide" },
          { href: "/uscis/add-paper-case-to-account", label: "How to Add Paper Case to myUSCIS" },
          BASE_LINKS.myuscis,
        ],
      };

    case "address-confirmation":
      return {
        summary: "Change of Address Confirmation — USCIS acknowledged your AR-11 address update",
        whatItMeans:
          "USCIS confirmed that they received your address change (Form AR-11). Your new address is now on file for the cases linked at the time of the update. This is a confirmation notice, not a case notice — it means your address was updated successfully.",
        checkOnNotice: [
          "Your new address — verify it is correct",
          "Which A-Number or cases the update applies to",
          "Confirmation date",
        ],
        commonMistakes: [
          "Assuming all pending cases updated automatically — verify with your attorney that all cases have the correct new address",
          "Not keeping the confirmation — it is proof you filed AR-11 on time",
          "Forgetting to also give your new address to your employer's attorney for any paper correspondence",
        ],
        deadline: null,
        contactAttorney: false,
        attorneyNote:
          "Forward the confirmation to your attorney so they can update their records and any pending case correspondence addresses with USCIS service centers.",
        urgencyLevel: "low",
        relatedLinks: [
          { href: "/uscis/change-address", label: "USCIS Address Change Guide (AR-11)" },
          BASE_LINKS.myuscis,
          BASE_LINKS.uscis,
        ],
      };

    case "not-sure":
    default:
      return {
        summary: "Select your notice type above to get specific guidance",
        whatItMeans:
          "Different USCIS notices mean very different things — from routine receipt confirmations to time-sensitive Requests for Evidence with hard deadlines. Select your notice type above to get specific guidance for your situation.",
        checkOnNotice: [
          "The form number and type at the top of the notice",
          "Whether it says 'Request for Evidence' — if so, treat as critical",
          "Whether it says 'Biometrics Appointment' or 'Interview' — attend on the date shown",
          "The receipt number (13-character code starting with 3 letters)",
          "Any response deadline or appointment date",
        ],
        commonMistakes: [
          "Assuming all USCIS notices are routine — RFEs and interview notices are time-sensitive",
          "Not sharing notices with your immigration attorney promptly",
          "Discarding notices — keep all original USCIS mail permanently",
        ],
        deadline: null,
        contactAttorney: true,
        attorneyNote:
          "Share any USCIS notice with your immigration attorney as soon as you receive it. Some notices have hard deadlines and require immediate action.",
        urgencyLevel: "medium",
        relatedLinks: [
          BASE_LINKS.i797Guide,
          BASE_LINKS.rfeGuide,
          BASE_LINKS.caseStatus,
          BASE_LINKS.statusMeaning,
        ],
      };
  }
}

const URGENCY_CONFIG = {
  low: { bg: "bg-emerald-50/60", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800", label: "Routine notice — no immediate action required" },
  medium: { bg: "bg-blue-50/60", border: "border-blue-200", badge: "bg-blue-100 text-blue-800", label: "Action may be needed — read carefully" },
  high: { bg: "bg-amber-50/60", border: "border-amber-200", badge: "bg-amber-100 text-amber-800", label: "Time-sensitive — act promptly" },
  critical: { bg: "bg-rose-50/60", border: "border-rose-200", badge: "bg-rose-100 text-rose-800", label: "Critical — contact attorney immediately" },
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function UscisNoticeDecoder() {
  const [noticeType, setNoticeType] = useState<NoticeType>("");
  const [formType, setFormType] = useState<FormType>("");
  const [situation, setSituation] = useState<Situation>("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setNoticeType(""); setFormType(""); setSituation(""); setSubmitted(false);
  }

  const result = submitted ? buildResult(noticeType || "not-sure", formType, situation) : null;
  const cfg = result ? URGENCY_CONFIG[result.urgencyLevel] : null;

  return (
    <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-white p-6 shadow-sm sm:p-8">
      {/* header */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">USCIS Notice Decoder</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          What does this USCIS notice mean?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Select your notice type, form, and situation for plain-English guidance, deadline warnings, and what to do next.
        </p>
      </div>

      {/* disclaimer */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Educational only — not legal advice.</strong>{" "}
        Do not upload actual notices. No receipt numbers, A-numbers, or personal details collected.
        NRItoUSA is not affiliated with USCIS. Always consult your immigration attorney.
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Notice type */}
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Notice type</span>
              <select value={noticeType} onChange={(e) => setNoticeType(e.target.value as NoticeType)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20">
                <option value="">Select notice…</option>
                <option value="receipt">I-797C — Receipt Notice</option>
                <option value="biometrics">Biometrics Appointment Notice</option>
                <option value="rfe">RFE — Request for Evidence</option>
                <option value="approval">Approval Notice (I-797A / I-797B)</option>
                <option value="transfer">Transfer Notice</option>
                <option value="interview">Interview Notice</option>
                <option value="card-production">Card Production Notice</option>
                <option value="access-code">Online Access Code Notice</option>
                <option value="address-confirmation">Change of Address Confirmation</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>

            {/* Form type */}
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Related form</span>
              <select value={formType} onChange={(e) => setFormType(e.target.value as FormType)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20">
                <option value="">Select form…</option>
                <option value="i129-h1b">I-129 — H-1B Petition</option>
                <option value="i140">I-140 — Immigrant Petition</option>
                <option value="i485">I-485 — Adjustment of Status</option>
                <option value="i765">I-765 — EAD (Work Permit)</option>
                <option value="i131">I-131 — Advance Parole</option>
                <option value="i130">I-130 — Family Petition</option>
                <option value="n400">N-400 — Naturalization</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>

            {/* Situation */}
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Your situation</span>
              <select value={situation} onChange={(e) => setSituation(e.target.value as Situation)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20">
                <option value="">Select…</option>
                <option value="h1b">H-1B worker</option>
                <option value="h4">H-4 / H-4 EAD</option>
                <option value="f1-opt">F-1 / OPT</option>
                <option value="green-card-pending">Green card pending (I-140 or I-485)</option>
                <option value="citizenship">Naturalization (N-400)</option>
                <option value="family-green-card">Family green card (I-130/I-485)</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <button type="submit"
            className="w-full rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800">
            Decode my notice
          </button>
        </form>
      ) : result && cfg ? (
        <div className="space-y-4">
          {/* Urgency badge + summary */}
          <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${cfg.badge}`}>
              {cfg.label}
            </span>
            <h3 className="mt-3 font-bold text-ink-900">{result.summary}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{result.whatItMeans}</p>
          </div>

          {/* Deadline warning */}
          {result.deadline && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-900">
              <strong className="font-bold">⏰ Deadline: </strong>{result.deadline}
            </div>
          )}

          {/* What to check */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">What to check on your notice</p>
            <ul className="space-y-2">
              {result.checkOnNotice.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none font-bold text-violet-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Common mistakes */}
          <div className="rounded-2xl border border-ink-900/5 bg-ink-50/40 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Common mistakes to avoid</p>
            <ul className="space-y-2">
              {result.commonMistakes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none text-rose-500">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact attorney */}
          <div className={`rounded-xl border px-4 py-4 text-sm leading-relaxed ${
            result.contactAttorney
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-ink-900/5 bg-white text-ink-700"
          }`}>
            <p className="font-semibold mb-1">
              {result.contactAttorney ? "📞 Contact your attorney" : "ℹ️ Attorney note"}
            </p>
            <p>{result.attorneyNote}</p>
          </div>

          {/* Related links */}
          <div className="grid gap-2 sm:grid-cols-2">
            {result.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-violet-400 hover:shadow-sm">
                <span className="text-base">📘</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs leading-relaxed text-ink-400">
            This tool is educational only. Always verify with the official{" "}
            <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="underline">USCIS website</a>
            {" "}and consult your immigration attorney. Not affiliated with USCIS.
          </p>

          <button onClick={handleReset}
            className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Decode another notice
          </button>
        </div>
      ) : null}
    </div>
  );
}
