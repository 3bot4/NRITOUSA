"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────── types ─────────────────────────────────────────── */

type FormType =
  | "I-129"
  | "I-140"
  | "I-485"
  | "I-765"
  | "I-131"
  | "I-130"
  | "N-400"
  | "";

type StatusKey =
  | "received"
  | "actively-reviewed"
  | "rfe-sent"
  | "rfe-response"
  | "approved"
  | "card-produced"
  | "transferred"
  | "biometrics"
  | "interview"
  | "denied"
  | "other"
  | "";

type Situation =
  | "h1b"
  | "h4-ead"
  | "f1-opt"
  | "gc-pending"
  | "family-gc"
  | "citizenship"
  | "other"
  | "";

interface StatusResult {
  meaning: string;
  next: string;
  actions: string[];
  worried: string;
  lawyerNote?: string;
  relatedSlug?: string;
  relatedLabel?: string;
}

/* ─────────────────────── data ──────────────────────────────────────────── */

type StatusMap = Partial<Record<StatusKey, StatusResult>>;
type FormStatusData = { default: StatusMap } & Partial<Record<FormType, StatusMap>>;

const DATA: FormStatusData = {
  // ── GENERIC FALLBACK ─────────────────────────────────────────────────────
  default: {
    received: {
      meaning:
        "USCIS received your application and created a case record. You should receive a Notice of Action (Form I-797C) with your receipt number.",
      next: "An adjudicator will pick up your case. Next status is usually 'Case Is Being Actively Reviewed'.",
      actions: [
        "Save your receipt notice — physical and scanned copy",
        "Check the priority date on the NOA1 (for I-140/I-485 filers)",
        "Set up case status email alerts on myUSCIS",
        "No further action needed — wait for the next update",
      ],
      worried:
        "Worry if no receipt notice arrives after 6 weeks, or if the notice shows wrong information.",
      relatedSlug: "case-was-received",
      relatedLabel: "Case Was Received guide",
    },
    "actively-reviewed": {
      meaning:
        "An adjudicator has opened your case file and is evaluating it. This is normal adjudication — no action is required from you.",
      next: "Approval, Request for Evidence (RFE), biometrics notice (if required), or interview scheduling.",
      actions: [
        "Keep your US address updated in USCIS's system (Form AR-11)",
        "Do not submit inquiries until you are outside the published processing time window",
        "Review the current processing times for your form at uscis.gov",
      ],
      worried:
        "Worry if you are past the published processing time window with no update. Submit a case inquiry only at that point.",
      relatedSlug: "case-is-being-actively-reviewed",
      relatedLabel: "Actively Reviewed guide",
    },
    "rfe-sent": {
      meaning:
        "USCIS reviewed your case and needs more documentation before it can make a decision. An RFE is not a denial — it is a request for additional evidence.",
      next: "You must respond with all requested documents before the deadline (usually 87 days from the date on the notice).",
      actions: [
        "Contact your immigration attorney immediately — same day",
        "Read the RFE notice completely to understand what USCIS is asking for",
        "Gather all documents on the RFE list — address every point explicitly",
        "Submit your complete response before the deadline via trackable mail",
      ],
      worried:
        "Worry immediately — the deadline is a hard cut-off. Missing it results in automatic denial.",
      lawyerNote:
        "Contact your immigration attorney the same day you receive the RFE. Do not attempt to respond without legal guidance.",
      relatedSlug: "request-for-evidence-rfe",
      relatedLabel: "RFE guide",
    },
    "rfe-response": {
      meaning:
        "USCIS received your RFE response and the case is back in adjudication.",
      next: "USCIS will either approve, issue another RFE, or deny. If premium processing applies, USCIS has 15 business days from receipt of your response.",
      actions: [
        "Monitor case status closely — changes can happen within days",
        "Keep copies of your full RFE response package",
        "Do not call USCIS unless you are outside the premium processing window or published time range",
      ],
      worried:
        "Worry if more than 3 months pass without any update and you are outside the processing time range.",
    },
    approved: {
      meaning:
        "USCIS approved your petition or application. You will receive an I-797 Approval Notice by mail.",
      next: "Depends on the form — see form-specific guidance below. Check if you need a card (EAD, green card) or if approval is the final step.",
      actions: [
        "Wait for the I-797 Approval Notice in the mail",
        "Verify all information on the notice is correct",
        "For cards (EAD, green card): watch for 'Card Is Being Produced' status",
        "Do not start working on an EAD until you physically hold the card",
      ],
      worried: "Worry if no approval notice arrives within 6 weeks of the status update.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "Case Approved — What Next",
    },
    "card-produced": {
      meaning:
        "Your physical card (green card, EAD, or Advance Parole) is being printed at a USCIS card production facility.",
      next: "'Card Was Mailed' — typically 1–3 weeks after production begins. Physical delivery: 7–10 business days after that.",
      actions: [
        "Confirm your mailing address is current in USCIS records",
        "Watch for 'Card Was Mailed' status and USPS tracking",
        "Inspect the card immediately on arrival for any errors",
        "Do not start working on EAD until you physically hold the valid card",
      ],
      worried:
        "Worry if no card arrives 30 days after 'Card Was Mailed' — request a replacement via myUSCIS.",
      relatedSlug: "card-is-being-produced",
      relatedLabel: "Card Is Being Produced guide",
    },
    transferred: {
      meaning:
        "USCIS transferred your case to a different service center or office. Your receipt number stays the same. No action required.",
      next: "'Case Is Being Actively Reviewed' at the new center.",
      actions: [
        "Continue monitoring with the same receipt number",
        "Check the new center's published processing time to reset your wait expectation",
        "Update your address via AR-11 if you've moved",
      ],
      worried:
        "Worry only if the case stays in transferred status for more than 3 months with no update.",
      relatedSlug: "case-transferred",
      relatedLabel: "Case Transferred guide",
    },
    biometrics: {
      meaning:
        "USCIS scheduled a biometrics appointment for fingerprint and photo capture at an Application Support Center (ASC). You will receive an appointment notice by mail.",
      next: "Attend the appointment, then case moves back to adjudication.",
      actions: [
        "Bring the printed biometrics notice and a valid photo ID",
        "Arrive 10–15 minutes early — no attorney needed",
        "Reschedule via myUSCIS if the date doesn't work (only once)",
      ],
      worried:
        "Worry if you miss the appointment without rescheduling — USCIS may deem the application abandoned.",
      relatedSlug: "biometrics-notice",
      relatedLabel: "Biometrics guide",
    },
    interview: {
      meaning:
        "USCIS scheduled an in-person interview at a local field office. You will receive an interview appointment notice.",
      next: "Attend the interview. Outcome: same-day approval, decision reserved, or additional evidence requested.",
      actions: [
        "Gather all original documents listed in the interview notice",
        "Bring all passports (including expired), I-94, I-797 notices, and supporting documents",
        "Consider bringing your immigration attorney",
        "Arrive at least 15 minutes early",
      ],
      worried: "Worry if you receive an interview notice that references a specific concern or issue — consult your attorney immediately.",
      lawyerNote:
        "Consult your immigration attorney before the interview to review your application and prepare answers.",
      relatedSlug: "interview-scheduled",
      relatedLabel: "Interview guide",
    },
    denied: {
      meaning:
        "USCIS denied your application. You will receive a written denial notice with the specific grounds for denial.",
      next: "Depending on the form and grounds: Motion to Reopen (MTR), Motion to Reconsider (MTC), AAO appeal, refile, or federal court challenge.",
      actions: [
        "Read the denial notice completely and note the specific grounds",
        "Contact your immigration attorney immediately — appeal/motion deadlines are short (usually 33 days)",
        "Do not stop working or leave the US without legal guidance if denial affects your status",
        "Preserve all prior application materials for any refile",
      ],
      worried:
        "Act immediately — deadlines for appeal/motion are typically 30–33 days from the denial date.",
      lawyerNote:
        "Contact your immigration attorney the same day. Do not miss the appeal window.",
      relatedSlug: "case-denied",
      relatedLabel: "Case Denied — options guide",
    },
    other: {
      meaning:
        "USCIS case statuses not listed above include notices for additional evidence, transfer confirmations, administrative processing holds, and more. Read your actual USCIS notice for the specific message.",
      next: "Follow the instructions in any notice you receive. If no notice, monitor status for updates.",
      actions: [
        "Check the full status message text on uscis.gov — the meaning varies by exact wording",
        "Review any physical notice you received for specific instructions",
        "Consult your immigration attorney if the status is unclear or concerning",
      ],
      worried:
        "Worry if your case has had no update for longer than the published processing time range.",
    },
  },

  // ── I-129 H1B / L1 OVERRIDES ────────────────────────────────────────────
  "I-129": {
    approved: {
      meaning:
        "Your H1B (or other I-129) petition is approved. You will receive a Form I-797 Approval Notice with your start date, end date, and employer details.",
      next: "If this is a new cap-subject H1B, you can start working on October 1 (or start date). For extensions/transfers, you may be able to continue working immediately per your employer's AC21 rights.",
      actions: [
        "Get a copy of the I-797 from your employer or attorney — carry it when traveling",
        "If your H1B visa stamp is expired, schedule a stamping appointment in India or at a US consulate abroad",
        "For extensions: confirm your start date and that the I-94 will be updated",
        "File for your H4 spouse's updated status if needed",
      ],
      worried:
        "Worry if the I-797 shows wrong employer, dates, or position — contact attorney immediately to correct.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "Case Approved — What Next",
    },
    denied: {
      meaning:
        "Your H1B petition was denied. You will receive a written denial notice with the grounds. Common reasons: specialty occupation challenge, degree-SOC mismatch, employer-employee relationship, wage level issues.",
      next: "Options: Motion to Reopen/Reconsider (33-day deadline), refile with a stronger package, or cap-subject refile in the next lottery.",
      actions: [
        "Contact your immigration attorney immediately",
        "Understand whether you have other valid status (H4, F1, OPT) to remain in the US",
        "Do not stop working if you have a valid status and the attorney believes a bridge exists",
        "Note the 33-day MTR/MTC deadline from denial date",
      ],
      worried:
        "Worry immediately — a denied H1B extension can put you out of status. Get legal guidance the same day.",
      lawyerNote:
        "Your status may be affected. Contact your immigration attorney today. Do not overstay.",
      relatedSlug: "case-denied",
      relatedLabel: "Case Denied — options guide",
    },
  },

  // ── I-140 OVERRIDES ───────────────────────────────────────────────────────
  "I-140": {
    approved: {
      meaning:
        "Your immigrant worker petition (I-140) is approved. Your priority date is now established. For most Indians in EB-2 or EB-3, you will wait for this date to become current in the visa bulletin before filing I-485.",
      next: "Monitor the monthly visa bulletin for your priority date. Once current, file I-485 (if in the US) or consular process (if abroad).",
      actions: [
        "Note your priority date from the I-140 approval notice — this is your queue position",
        "Keep your H1B status valid — the I-140 supports H1B extensions beyond 6 years under INA 106(c)",
        "Track the visa bulletin monthly at travel.state.gov",
        "Consult attorney about AC21 if you plan to change employers after 180 days",
      ],
      worried:
        "Worry if your priority date on the approval doesn't match what your attorney filed — dates matter enormously for Indians.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "What I-140 approval means",
    },
  },

  // ── I-485 OVERRIDES ───────────────────────────────────────────────────────
  "I-485": {
    approved: {
      meaning:
        "Your Adjustment of Status application is approved — you are now a Lawful Permanent Resident. Your physical green card (Form I-551) will be produced and mailed.",
      next: "'Card Is Being Produced' → 'Card Was Mailed' → receive green card (typically 2–5 weeks total).",
      actions: [
        "Watch for 'Card Is Being Produced' then 'Card Was Mailed' status",
        "Confirm your mailing address is correct in USCIS records",
        "Once the green card arrives, inspect it for accuracy and sign the back",
        "Your Advance Parole and EAD are no longer needed — you can now travel freely",
        "Start tracking your 5-year (or 3-year if married to US citizen) clock toward citizenship",
      ],
      worried:
        "Worry if your green card doesn't arrive within 6 weeks of the approval. Submit a case inquiry.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "I-485 Approved — what next",
    },
    denied: {
      meaning:
        "Your I-485 Adjustment of Status was denied. Common grounds: inadmissibility issue, missing priority date currentness at time of decision, medical issues, prior overstay, missing documents.",
      next: "Options: MTR/MTC (33 days), immigration court (if NTA issued), or refile when grounds are addressed and priority date is current.",
      actions: [
        "Read the denial notice for the specific grounds immediately",
        "Contact your immigration attorney same-day",
        "Determine if your underlying I-140 is still valid (usually yes)",
        "Understand your current status — an I-485 denial may affect your underlying status",
        "Note the 33-day MTR deadline",
      ],
      worried:
        "Act immediately. Depending on your underlying status, you may be at risk of being out of status.",
      lawyerNote:
        "I-485 denial has serious status implications. Contact your attorney today — same day.",
      relatedSlug: "case-denied",
      relatedLabel: "Case Denied — options for I-485",
    },
  },

  // ── I-765 EAD OVERRIDES ───────────────────────────────────────────────────
  "I-765": {
    approved: {
      meaning:
        "Your Employment Authorization Document (EAD) application is approved. Your physical I-766 card is being produced.",
      next: "'Card Is Being Produced' → 'Card Was Mailed' → receive EAD. Do not start working until you physically hold the valid card.",
      actions: [
        "Do NOT start working until the EAD card is physically in your hands",
        "Note the expiration date on the card when it arrives — set a reminder 180 days before to file renewal",
        "Store a scan of your EAD for I-9 completion with your employer",
      ],
      worried:
        "Worry if the EAD doesn't arrive within 30 days of 'Card Was Mailed' — submit a replacement request.",
      relatedSlug: "card-is-being-produced",
      relatedLabel: "Card production guide",
    },
  },

  // ── I-131 ADVANCE PAROLE OVERRIDES ────────────────────────────────────────
  "I-131": {
    approved: {
      meaning:
        "Your Advance Parole (travel document) application is approved. The physical document is being produced and mailed.",
      next: "Wait for the physical document before traveling. Do not travel internationally while I-485 is pending without this document in hand.",
      actions: [
        "Wait for the physical AP document before making any international travel plans",
        "If I-485 is pending: traveling without AP = abandonment of adjustment",
        "Travel using both the AP document and your passport",
        "If AP expires while abroad and I-485 is pending, consult your attorney before returning",
      ],
      worried:
        "Worry if your AP expires while you are abroad with a pending I-485. Contact your attorney immediately.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "AP Approved — what next",
    },
  },

  // ── N-400 OVERRIDES ───────────────────────────────────────────────────────
  "N-400": {
    interview: {
      meaning:
        "USCIS scheduled your naturalization interview at a local field office. The interview covers English language (reading, writing, speaking) and civics test (10 questions from the 100-question bank).",
      next: "Attend the interview. Bring your green card, all passports, tax returns, and all travel records. Pass the civics and English tests. Outcome: approval, continuance, or denial.",
      actions: [
        "Study the USCIS civics test questions at uscis.gov — must answer 6 of 10 correctly",
        "Bring: green card, all passports (including expired), I-94, tax returns, naturalization application copy",
        "Prepare to explain any gaps in US residence or extended trips abroad",
        "Review your N-400 application answers — officer will go through it with you line by line",
      ],
      worried:
        "Worry if you have extended trips outside the US exceeding 6 months, gaps in tax filing, or any criminal history — consult your attorney before the interview.",
      lawyerNote:
        "If you have any complicated travel history, tax issues, or any criminal matter on record, consult your attorney before the interview.",
      relatedSlug: "interview-scheduled",
      relatedLabel: "Citizenship interview guide",
    },
    approved: {
      meaning:
        "Your N-400 citizenship application is approved. You will be scheduled for the Oath of Allegiance ceremony.",
      next: "Wait for your Oath ceremony notice — may be same day or scheduled in coming weeks.",
      actions: [
        "Attend the Oath of Allegiance ceremony — bring your permanent resident card and appointment notice",
        "After the ceremony, you will receive your naturalization certificate (Form N-550)",
        "Apply for a US passport immediately after — the certificate is all you need",
        "Update your Indian passport status (you may need to surrender/cancel Indian citizenship)",
      ],
      worried:
        "Worry only if you don't receive an Oath ceremony notice within a few months — contact USCIS.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "N-400 approval — what next",
    },
  },

  // ── I-130 FAMILY PETITION OVERRIDES ──────────────────────────────────────
  "I-130": {
    approved: {
      meaning:
        "Your I-130 family petition is approved. The beneficiary's priority date is established. For immediate relatives of US citizens, a visa number is immediately available. For preference categories (F2A, etc.), the beneficiary must wait for the priority date to become current.",
      next: "If visa is immediately available: proceed to consular processing or I-485. If not: monitor the visa bulletin for your family preference category and country.",
      actions: [
        "Confirm whether the beneficiary is an immediate relative (no wait) or a preference category (wait required)",
        "For preference categories, monitor the visa bulletin monthly",
        "Consult attorney about next steps — consular processing vs. adjustment of status",
      ],
      worried: "Worry if the priority date on the approval notice is incorrect.",
      relatedSlug: "case-approved-what-next",
      relatedLabel: "I-130 Approved — what next",
    },
  },
};

/* ─────────────────────── situation notes ───────────────────────────────── */

const SITUATION_NOTES: Partial<Record<Situation, Record<string, string>>> = {
  h1b: {
    approved:
      "H1B workers: carry the I-797 when traveling. For visa stamping, schedule an appointment in India or at a US consulate — the I-797 is your primary document at the port of entry.",
    denied:
      "H1B denial can affect your ability to stay in the US. If you have no other valid status, consult your attorney about departure timing and whether an MTR can bridge the gap.",
    "rfe-sent":
      "H1B RFEs most often challenge specialty occupation or employer-employee relationship. Your attorney needs to respond with strong supporting documentation of your job duties and degree relevance.",
  },
  "gc-pending": {
    "actively-reviewed":
      "While I-485 is pending, many applicants can work on EAD and travel on Advance Parole. Avoid traveling internationally without a valid AP document — for many applicants it can cause the adjustment to be treated as abandoned. Travel rules are fact-specific, so confirm with your immigration attorney first.",
    approved:
      "Your green card application is approved — you are now a permanent resident. Your EAD and AP are no longer needed. You can now travel freely without Advance Parole.",
    "rfe-sent":
      "I-485 RFEs often request medical exam corrections, missing forms, or prior overstay/status documentation. Respond completely and on time.",
  },
  "h4-ead": {
    "rfe-sent":
      "H4 EAD RFEs often ask for documentation that the H1B principal is in valid H1B status and that an I-140 was approved or H1B extension was filed. Your attorney needs the H1B holder's current I-797.",
    denied:
      "H4 EAD denial typically happens when the underlying H1B status lapses or the I-140 requirement isn't met. Consult your attorney about whether the H1B holder's status needs to be resolved first.",
  },
};

/* ─────────────────────── helpers ───────────────────────────────────────── */

function getResult(
  form: FormType,
  status: StatusKey,
): StatusResult | null {
  if (!form || !status || status === "other") return null;
  const formData = DATA[form as keyof typeof DATA] ?? {};
  const defaultData = DATA.default;
  const result =
    (formData as StatusMap)[status] ??
    (defaultData as StatusMap)[status] ??
    null;
  return result ?? null;
}

function getSituationNote(
  situation: Situation,
  status: StatusKey,
): string | null {
  if (!situation || !status) return null;
  return SITUATION_NOTES[situation]?.[status] ?? null;
}

/* ─────────────────────── option lists ─────────────────────────────────── */

const FORM_OPTIONS: { value: FormType; label: string }[] = [
  { value: "I-129", label: "I-129 — H1B / L1 petition" },
  { value: "I-140", label: "I-140 — Employment green card petition" },
  { value: "I-485", label: "I-485 — Adjustment of Status (green card)" },
  { value: "I-765", label: "I-765 — Employment Authorization (EAD)" },
  { value: "I-131", label: "I-131 — Advance Parole / travel document" },
  { value: "I-130", label: "I-130 — Family petition" },
  { value: "N-400", label: "N-400 — Citizenship / naturalization" },
];

const STATUS_OPTIONS: { value: StatusKey; label: string }[] = [
  { value: "received", label: "Case Was Received" },
  { value: "actively-reviewed", label: "Case Is Being Actively Reviewed" },
  { value: "rfe-sent", label: "Request for Evidence Was Sent" },
  { value: "rfe-response", label: "Response to Request for Evidence Was Received" },
  { value: "approved", label: "Case Was Approved" },
  { value: "card-produced", label: "Card Is Being Produced / Card Was Mailed" },
  { value: "transferred", label: "Case Was Transferred" },
  { value: "biometrics", label: "Biometrics Appointment Was Scheduled" },
  { value: "interview", label: "Interview Was Scheduled" },
  { value: "denied", label: "Case Was Denied" },
  { value: "other", label: "Other / Not sure" },
];

const SITUATION_OPTIONS: { value: Situation; label: string }[] = [
  { value: "h1b", label: "I am on H1B" },
  { value: "h4-ead", label: "I am on H4 / H4 EAD" },
  { value: "f1-opt", label: "I am on F1 / OPT / STEM OPT" },
  { value: "gc-pending", label: "I have a green card application pending" },
  { value: "family-gc", label: "Family green card / sponsorship" },
  { value: "citizenship", label: "Citizenship / naturalization" },
  { value: "other", label: "Other / not listed" },
];

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => String(2020 + i));

/* ─────────────────────── component ─────────────────────────────────────── */

export default function UscisStatusTool() {
  const [form, setForm] = useState<FormType>("");
  const [status, setStatus] = useState<StatusKey>("");
  const [situation, setSituation] = useState<Situation>("");
  const [india, setIndia] = useState(false);
  const [receiptMonth, setReceiptMonth] = useState("");
  const [receiptYear, setReceiptYear] = useState("");

  const result = form && status ? getResult(form, status) : null;
  const situationNote = situation && status ? getSituationNote(situation, status) : null;

  const isRfe = status === "rfe-sent";
  const isDenied = status === "denied";
  const isInterview = status === "interview";
  const needsAttention = isRfe || isDenied || isInterview;

  return (
    <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-6 shadow-sm sm:p-8">
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          USCIS case decoder
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          What does my USCIS status mean?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          No receipt number, A-number, or personal details needed — just select your form and status.
        </p>
      </div>

      {/* ── privacy note ───────────────────────────────────────────────────── */}
      <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-800">
        <span className="mt-0.5 text-base leading-none">🔒</span>
        <span>
          <strong>Privacy first:</strong> This tool does not ask for your receipt number,
          A-number, passport number, date of birth, or any personal information. Everything
          runs in your browser.
        </span>
      </div>

      {/* ── form ───────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Form type */}
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Form type <span className="text-rose-500">*</span>
          </span>
          <select
            value={form}
            onChange={(e) => setForm(e.target.value as FormType)}
            className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select form…</option>
            {FORM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Status */}
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Current USCIS status <span className="text-rose-500">*</span>
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusKey)}
            className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select status…</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Situation */}
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Your situation{" "}
            <span className="font-normal text-ink-400">(optional — adds tailored notes)</span>
          </span>
          <select
            value={situation}
            onChange={(e) => setSituation(e.target.value as Situation)}
            className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select situation…</option>
            {SITUATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {/* Receipt date */}
        <div>
          <span className="block text-xs font-semibold text-ink-800">
            Receipt date{" "}
            <span className="font-normal text-ink-400">(month &amp; year only — optional)</span>
          </span>
          <div className="mt-1 flex gap-2">
            <select
              value={receiptMonth}
              onChange={(e) => setReceiptMonth(e.target.value)}
              className="flex-1 rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Month…</option>
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={receiptYear}
              onChange={(e) => setReceiptYear(e.target.value)}
              className="w-28 rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Year…</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* India checkbox */}
      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={india}
          onChange={(e) => setIndia(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-ink-900/20 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-ink-700">
          I am from India (or using India chargeability for EB green card)
        </span>
      </label>

      {/* ── result panel ───────────────────────────────────────────────────── */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Attention banner for RFE/denial/interview */}
          {needsAttention && (
            <div
              className={`flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold ${
                isDenied
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : isRfe
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-blue-200 bg-blue-50 text-blue-800"
              }`}
            >
              <span className="mt-0.5 text-lg leading-none">
                {isDenied ? "🚨" : isRfe ? "⚠️" : "📋"}
              </span>
              <span>
                {isDenied
                  ? "Denial — act immediately. Deadlines for appeal/motion are short (usually 33 days). Contact your attorney today."
                  : isRfe
                    ? "RFE deadline is a hard cut-off (usually 87 days from the notice date). Contact your attorney immediately."
                    : "Interview scheduled — prepare all original documents and review your application."}
              </span>
            </div>
          )}

          {/* India chargeability note */}
          {india && (form === "I-485" || form === "I-140") && (
            <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
              <span className="mt-0.5 leading-none">🇮🇳</span>
              <span>
                <strong>India chargeability note:</strong> As an India-born EB applicant, your
                priority date wait is measured against the India Final Action Date in the monthly
                visa bulletin — not the "All Chargeability" date. Indian EB-2 and EB-3 dates are
                typically years behind the rest-of-world dates. Monitor{" "}
                <a
                  href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  travel.state.gov
                </a>{" "}
                each month.
              </span>
            </div>
          )}

          {/* Meaning */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              What it means
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-800">{result.meaning}</p>
          </div>

          {/* What happens next */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              What usually happens next
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-800">{result.next}</p>
          </div>

          {/* Action steps */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Your action steps
            </p>
            <ul className="mt-2 space-y-2">
              {result.actions.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                    →
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* When to worry */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              When to be concerned
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">{result.worried}</p>
          </div>

          {/* Situation-specific note */}
          {situationNote && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
                Note for your situation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-violet-900">{situationNote}</p>
            </div>
          )}

          {/* Contact attorney note */}
          {result.lawyerNote && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <span className="mt-0.5 text-lg leading-none">⚖️</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                  Contact your attorney
                </p>
                <p className="mt-1 text-sm leading-relaxed text-rose-900">
                  {result.lawyerNote}
                </p>
              </div>
            </div>
          )}

          {/* Related NRItoUSA article */}
          {result.relatedSlug && (
            <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                Related NRItoUSA guide
              </p>
              <Link
                href={`/uscis/${result.relatedSlug}`}
                className="mt-2 block text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {result.relatedLabel} →
              </Link>
            </div>
          )}

          {/* Official USCIS reminder */}
          <div className="rounded-xl border border-ink-900/5 bg-ink-50/70 px-4 py-3 text-xs leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Educational only.</strong> This
            tool provides general guidance and is not legal or immigration advice. USCIS
            rules change. Always verify your case status at{" "}
            <a
              href="https://egov.uscis.gov/casestatus/landing.do"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline"
            >
              egov.uscis.gov
            </a>{" "}
            and consult a licensed immigration attorney for your specific situation.
          </div>
        </div>
      )}

      {/* prompt when nothing selected */}
      {!result && form && status === "other" && (
        <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-5 text-sm text-ink-600">
          For &ldquo;Other / Not sure&rdquo; statuses, read the full text of your status
          message on uscis.gov — the exact wording tells you what is happening. If unclear,
          consult your immigration attorney.
        </div>
      )}

      {!result && (!form || !status) && (
        <p className="mt-5 text-center text-sm text-ink-400">
          Select a form type and status above to see your plain-English explanation.
        </p>
      )}
    </div>
  );
}
