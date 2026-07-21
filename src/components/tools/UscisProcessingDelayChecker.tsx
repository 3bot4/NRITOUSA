"use client";

import { useState } from "react";
import Link from "next/link";
import { premiumProcessing } from "@/lib/premiumProcessing";

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

type CaseCategory =
  | "h1b-transfer"
  | "h1b-extension"
  | "h1b-amendment"
  | "h4-ead"
  | "f1-opt"
  | "employment-gc"
  | "family-gc"
  | "citizenship"
  | "other"
  | "";

type FilingType = "regular" | "premium" | "" ;

type CurrentStatus =
  | "received"
  | "actively-reviewed"
  | "rfe"
  | "rfe-response"
  | "approved"
  | "transferred"
  | "other"
  | "";

type RfeReceived = "yes" | "no" | "";
type EmployerFiled = "yes" | "no" | "";

/* ─────────────────────── result tiers ──────────────────────────────────── */

type ResultTier =
  | "normal"
  | "monitor"
  | "consider-premium"
  | "consider-inquiry"
  | "urgent";

interface AssessmentResult {
  tier: ResultTier;
  headline: string;
  summary: string;
  actions: string[];
  premiumNote?: string;
  urgentNote?: string;
  showCaseStatusTool: boolean;
  showAttorneyBadge: boolean;
}

/* ─────────────────────── receipt date helpers ───────────────────────────── */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthsAgo(month: number, year: number): number {
  const now = new Date();
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
}

/* ─────────────────────── assessment logic ───────────────────────────────── */

function assess(
  form: FormType,
  category: CaseCategory,
  filing: FilingType,
  receiptMonth: number,
  receiptYear: number,
  status: CurrentStatus,
  rfe: RfeReceived,
  employer: EmployerFiled
): AssessmentResult {
  const hasDate = receiptMonth > 0 && receiptYear > 0;
  const age = hasDate ? monthsAgo(receiptMonth, receiptYear) : -1;
  const isPremium = filing === "premium";

  // ── urgent overrides ─────────────────────────────────────────────────────
  if (rfe === "yes" && status === "rfe") {
    return {
      tier: "urgent",
      headline: "RFE deadline — act immediately",
      summary:
        "A Request for Evidence has a hard deadline printed on the notice — the standard maximum is generally up to about 84 days (≈87 with US mailing time), and USCIS must receive your response by it, not just see it postmarked. Miss it and USCIS may deny the case as abandoned or decide it on the existing record.",
      actions: [
        "Contact your immigration attorney today — the same day if possible.",
        "Locate the RFE notice and find the exact response-due date.",
        "Do not submit a partial or rushed response without attorney review.",
        "Gather all supporting documents your attorney identifies.",
        "Do not miss the deadline under any circumstances.",
      ],
      showCaseStatusTool: false,
      showAttorneyBadge: true,
      urgentNote:
        "For employer-filed petitions (H1B, I-140), your employer's attorney must lead the RFE response. Contact HR or your attorney immediately.",
    };
  }

  if (status === "other") {
    return {
      tier: "urgent",
      headline: "Unusual status — verify and consult",
      summary:
        "An unexpected or unclear case status can indicate a notice you may have missed, a denial, a transfer, or a system update. Check egov.uscis.gov directly and compare against the Case Status Meaning Tool.",
      actions: [
        "Check egov.uscis.gov/casestatus for the exact status wording.",
        "Use the USCIS Case Status Meaning Tool to understand what it means.",
        "If the status involves denial, withdrawal, or administrative closure — contact your attorney immediately.",
        "Do not ignore an unfamiliar status update.",
      ],
      showCaseStatusTool: true,
      showAttorneyBadge: true,
    };
  }

  // ── premium processing submitted ──────────────────────────────────────────
  if (isPremium && (form === "I-129" || form === "I-140")) {
    if (status === "received" || status === "actively-reviewed") {
      const premiumWindow = form === "I-129" ? 15 : 15;
      if (age >= 0 && age > 2) {
        return {
          tier: "consider-inquiry",
          headline: "Premium processing — check processing clock",
          summary: `Premium processing petitions for ${form} are guaranteed a USCIS action (approval, RFE, denial, or notice of intent to deny) within 15 business days of USCIS accepting the premium processing request — not necessarily within 15 days of your original filing. If USCIS has missed that window, your employer's attorney may request a refund of the premium processing fee and ask USCIS to expedite.`,
          actions: [
            "Confirm the exact date USCIS accepted the premium processing upgrade.",
            "Count 15 business days (excluding federal holidays) from that acceptance date.",
            "If past the window, have your attorney contact USCIS or file a service request.",
            "Premium processing guarantees USCIS action — not approval. An RFE response period does not count against the 15-day clock.",
          ],
          premiumNote: `Premium processing for ${form}: current fee for many eligible categories is ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Guarantees USCIS action within 15 business days — not approval. Always verify the current fee on the USCIS Form I-907 page before filing.`,
          showCaseStatusTool: true,
          showAttorneyBadge: employer === "yes",
        };
      }
      return {
        tier: "normal",
        headline: "Premium processing — within typical window",
        summary: `Your ${form} is filed with premium processing. USCIS typically acts within 15 business days of accepting the premium upgrade. Continue monitoring egov.uscis.gov for updates.`,
        actions: [
          "Monitor egov.uscis.gov for status updates.",
          "Count 15 business days from USCIS's premium acceptance date.",
          "Have your attorney's contact information ready in case an RFE arrives.",
        ],
        premiumNote: `Premium processing for ${form}: current fee for many eligible categories is ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Guarantees USCIS action within 15 business days — not approval. An RFE restarts the premium clock. Always verify the current fee on the USCIS Form I-907 page.`,
        showCaseStatusTool: true,
        showAttorneyBadge: employer === "yes",
      };
    }
  }

  // ── approved / produced ───────────────────────────────────────────────────
  if (status === "approved") {
    return {
      tier: "normal",
      headline: "Case approved — review next steps",
      summary:
        "Your case has been approved. Depending on the form type, your next step may be waiting for a physical card, monitoring the visa bulletin, or preparing for a consular appointment.",
      actions: [
        "For I-765 (EAD) or green card — wait for the card production and mailing notice.",
        "For I-140 — your priority date is now established. Monitor the visa bulletin at travel.state.gov.",
        "For I-129 (H1B) — confirm new I-94 dates with your employer before traveling.",
        "For N-400 — prepare for the oath ceremony.",
        "Keep the I-797 approval notice in a safe place — it is an official immigration document.",
      ],
      showCaseStatusTool: false,
      showAttorneyBadge: false,
    };
  }

  // ── transferred ───────────────────────────────────────────────────────────
  if (status === "transferred") {
    return {
      tier: "monitor",
      headline: "Case transferred — update your wait estimate",
      summary:
        "USCIS has moved your case to a different service center or the National Benefits Center. Your receipt number stays the same. Functionally, your case joins the new center's queue — compare your receipt date against the new center's published processing times.",
      actions: [
        "Note the new service center from the transfer notice.",
        "Go to uscis.gov/check-processing-times and look up processing times for your form at the new center.",
        "Continue monitoring egov.uscis.gov — no action needed from you.",
        "For I-485 transfers to NBC/MSC — this typically means interview scheduling is being prepared. Normal.",
      ],
      showCaseStatusTool: true,
      showAttorneyBadge: false,
    };
  }

  // ── form-specific logic ───────────────────────────────────────────────────

  // I-129 H1B
  if (form === "I-129") {
    const typicalMonths = category === "h1b-transfer" ? 3 : 4;
    if (age >= 0 && age > typicalMonths + 2) {
      return {
        tier: "consider-inquiry",
        headline: "H1B petition — longer than typical",
        summary: `Your H1B ${category === "h1b-transfer" ? "transfer" : category === "h1b-amendment" ? "amendment" : "extension"} petition has been pending for about ${age} month${age !== 1 ? "s" : ""}. Regular processing for I-129 H1B petitions currently runs approximately ${typicalMonths}–6 months depending on the service center and USCIS workload. Verify this against the current published processing times at uscis.gov before drawing conclusions.`,
        actions: [
          "Go to uscis.gov/check-processing-times and enter Form I-129, your service center, and H1B classification.",
          "If outside the published window, ask your employer's attorney about filing a case inquiry.",
          "Ask your employer's attorney about upgrading to premium processing if status is time-sensitive.",
          "For H1B transfers — confirm your employment authorization start date with your employer.",
          "Do not change employers or take other immigration actions without attorney advice.",
        ],
        premiumNote: `Premium processing is available for most I-129 H1B petitions. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Guarantees USCIS action within 15 business days — not approval. Verify the current fee on the USCIS Form I-907 page before filing.`,
        showCaseStatusTool: true,
        showAttorneyBadge: true,
      };
    }
    if (age >= 0 && age <= typicalMonths + 2) {
      return {
        tier: "normal",
        headline: "H1B petition — within normal range",
        summary: `Your H1B petition has been pending for about ${age > 0 ? `${age} month${age !== 1 ? "s" : ""}` : "less than a month"}. Typical regular processing for I-129 H1B petitions runs several months depending on the service center. Check current published times at uscis.gov — these change frequently.`,
        actions: [
          "Monitor egov.uscis.gov for status updates.",
          "Check uscis.gov/check-processing-times periodically and compare to your receipt date.",
          "Keep your employer's HR and attorney informed if your current work authorization has an upcoming expiration.",
        ],
        premiumNote: `Premium processing is available for most I-129 H1B petitions if your timeline is urgent. Current fee for many H1B/I-129 categories: ${premiumProcessing.items.find(i => i.form === "I-129" && i.eligible)?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Always verify on the USCIS Form I-907 page before filing.`,
        showCaseStatusTool: true,
        showAttorneyBadge: employer === "yes",
      };
    }
  }

  // I-140
  if (form === "I-140") {
    const typicalMonths = 8;
    if (age >= 0 && age > typicalMonths + 2) {
      return {
        tier: "consider-inquiry",
        headline: "I-140 — longer than typical, check official times",
        summary: `Your I-140 petition has been pending for about ${age} month${age !== 1 ? "s" : ""}. Regular I-140 processing typically runs 6–12+ months depending on the service center and category. Compare against official times at uscis.gov — this varies significantly. Note: your priority date is established at receipt, not approval.`,
        actions: [
          "Check uscis.gov/check-processing-times for your service center and I-140 category.",
          "If outside the published window, ask your employer's attorney about a case inquiry.",
          "Ask about premium processing if establishing the priority date urgently matters.",
          "Even with I-140 pending, your H1B can typically be extended beyond 6 years if an I-140 is approvable.",
        ],
        premiumNote: `Premium processing is available for I-140. Current fee: ${premiumProcessing.items.find(i => i.form === "I-140")?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Guarantees USCIS action within 15 business days — useful if you need to establish your priority date quickly. Verify the current fee on the USCIS Form I-907 page.`,
        showCaseStatusTool: true,
        showAttorneyBadge: true,
      };
    }
    return {
      tier: "normal",
      headline: "I-140 — within typical range",
      summary: `Your I-140 petition has been pending for about ${age > 0 ? `${age} month${age !== 1 ? "s" : ""}` : "less than a month"}. I-140 processing is one of the longer waits in the employment green card process. Your priority date is established at receipt — that date is what matters for the visa bulletin, not the approval date.`,
      actions: [
        "Monitor egov.uscis.gov for status updates.",
        "Compare to official processing times at uscis.gov/check-processing-times.",
        "Begin monitoring the visa bulletin at travel.state.gov — your priority date is already set.",
        "Discuss H1B extension strategy with your employer's attorney now, regardless of I-140 status.",
      ],
      premiumNote: `Premium processing is available for I-140 if establishing your priority date quickly matters. Current fee: ${premiumProcessing.items.find(i => i.form === "I-140")?.feeDisplay ?? "$2,965"} (last verified: ${premiumProcessing.lastVerified}). Verify on the USCIS Form I-907 page before filing.`,
      showCaseStatusTool: true,
      showAttorneyBadge: employer === "yes",
    };
  }

  // I-485
  if (form === "I-485") {
    return {
      tier: "monitor",
      headline: "I-485 — monitor official processing times",
      summary:
        "I-485 adjustment of status processing for Indian applicants is often determined more by visa bulletin priority date availability than USCIS workload alone. Processing times for I-485 vary enormously — from under a year for some categories to many years for oversubscribed categories. The key factors are your priority date, your category (EB-2/EB-3/family), and the current visa bulletin.",
      actions: [
        "Check current I-485 processing times at uscis.gov/check-processing-times.",
        "Monitor the monthly visa bulletin at travel.state.gov — priority date must remain current.",
        "Do NOT travel internationally without a valid Advance Parole document while I-485 is pending.",
        "Keep all supporting documents current (medical exam, affidavit of support, employment letter).",
        "Discuss biometrics scheduling and interview preparation with your attorney.",
      ],
      premiumNote: "Premium processing is not available for I-485 Adjustment of Status.",
      showCaseStatusTool: true,
      showAttorneyBadge: true,
    };
  }

  // I-765 EAD
  if (form === "I-765") {
    const typicalMonths = category === "h4-ead" ? 5 : 4;
    if (age >= 0 && age > typicalMonths + 2) {
      return {
        tier: "consider-inquiry",
        headline: "EAD — longer than typical, check official times",
        summary: `Your I-765 EAD application has been pending for about ${age} month${age !== 1 ? "s" : ""}. EAD processing times vary by service center and category. Compare to the current published times at uscis.gov. If you are outside the official processing window, you may be eligible to contact USCIS.`,
        actions: [
          "Check current EAD processing times at uscis.gov/check-processing-times.",
          "If outside the published window, submit a case inquiry at egov.uscis.gov.",
          "For H4 EAD — your work authorization cannot begin until you physically hold the EAD card.",
          "For I-485-based EAD — verify your underlying I-485 is still pending and in good standing.",
          "Consult your attorney about a combo card (EAD + Advance Parole) if applicable.",
        ],
        showCaseStatusTool: true,
        showAttorneyBadge: false,
      };
    }
    return {
      tier: "normal",
      headline: "EAD — within typical range",
      summary: `Your I-765 EAD application has been pending for about ${age > 0 ? `${age} month${age !== 1 ? "s" : ""}` : "less than a month"}. EAD processing is currently running several months at most service centers. Compare to official times at uscis.gov.`,
      actions: [
        "Monitor egov.uscis.gov for status updates.",
        "Compare to uscis.gov/check-processing-times for your service center.",
        "Do not start working based on a pending EAD — wait until you physically hold the card.",
        "File EAD renewals at least 6 months before expiration to avoid gaps.",
      ],
      showCaseStatusTool: true,
      showAttorneyBadge: false,
    };
  }

  // I-131 Advance Parole
  if (form === "I-131") {
    if (age >= 0 && age > 6) {
      return {
        tier: "consider-inquiry",
        headline: "Advance Parole — longer than typical",
        summary: `Your I-131 AP application has been pending for about ${age} month${age !== 1 ? "s" : ""}. AP processing can run 3–8+ months depending on service center. If you have urgent travel, contact your attorney — there may be options for expedite requests in certain hardship situations.`,
        actions: [
          "Check current I-131 processing times at uscis.gov/check-processing-times.",
          "If outside the published window, consider a case inquiry via egov.uscis.gov.",
          "Do NOT travel internationally while I-485 is pending without the AP document physically in hand.",
          "Ask your attorney about an expedite request if you have a documented emergency.",
          "Confirm your AP application was filed as a combo card with EAD if applicable.",
        ],
        showCaseStatusTool: true,
        showAttorneyBadge: true,
      };
    }
    return {
      tier: "normal",
      headline: "Advance Parole — within typical range",
      summary: `Your I-131 AP application has been pending for about ${age > 0 ? `${age} month${age !== 1 ? "s" : ""}` : "less than a month"}. AP processing typically runs 3–6 months. Do not plan any international travel until you have the document in hand.`,
      actions: [
        "Monitor egov.uscis.gov for updates.",
        "Plan no international travel until Advance Parole is physically approved and in hand.",
        "Check uscis.gov/check-processing-times for current estimates.",
        "Contact your attorney if travel becomes unavoidable before AP arrives.",
      ],
      showCaseStatusTool: true,
      showAttorneyBadge: true,
    };
  }

  // I-130
  if (form === "I-130") {
    return {
      tier: "monitor",
      headline: "I-130 — long processing expected",
      summary:
        "I-130 family-based petitions are often the start of a multi-year process. Processing times for I-130 itself can range from months to years depending on the relationship category and service center. After I-130 approval, priority date availability in the visa bulletin governs when the beneficiary can proceed — this can involve significant additional waits.",
      actions: [
        "Check current I-130 processing times at uscis.gov/check-processing-times.",
        "Monitor the visa bulletin at travel.state.gov after I-130 approval.",
        "For immediate relatives of US citizens — I-130 approval allows direct immigrant visa processing without a wait.",
        "Consult your attorney about the full process: I-130 → visa bulletin → NVC → consular processing or I-485.",
      ],
      showCaseStatusTool: true,
      showAttorneyBadge: true,
    };
  }

  // N-400
  if (form === "N-400") {
    if (age >= 0 && age > 14) {
      return {
        tier: "consider-inquiry",
        headline: "N-400 — longer than typical",
        summary: `Your N-400 naturalization application has been pending for about ${age} month${age !== 1 ? "s" : ""}. N-400 processing currently runs approximately 8–18 months at most field offices. Compare to the published time for your specific field office at uscis.gov.`,
        actions: [
          "Check processing times for your local USCIS field office at uscis.gov/check-processing-times.",
          "If outside the published window, you can submit a case inquiry or contact your local USCIS office.",
          "Confirm your biometrics appointment was completed.",
          "Ensure your continuous residence documentation is current.",
          "Contact your local elected representative's office — congressional inquiries can sometimes help move stalled cases.",
        ],
        showCaseStatusTool: true,
        showAttorneyBadge: false,
      };
    }
    return {
      tier: "normal",
      headline: "N-400 — within typical range",
      summary: `Your N-400 application has been pending for about ${age > 0 ? `${age} month${age !== 1 ? "s" : ""}` : "less than a month"}. N-400 processing typically runs 8–18 months depending on your local USCIS field office. The interview is at your local office regardless of where the application was initially routed.`,
      actions: [
        "Monitor egov.uscis.gov for updates, including biometrics scheduling.",
        "Prepare your supporting documents — tax returns, travel history, continuous residence evidence.",
        "Review USCIS's civics test materials at uscis.gov.",
        "Check uscis.gov/check-processing-times for your specific field office.",
      ],
      showCaseStatusTool: true,
      showAttorneyBadge: false,
    };
  }

  // Generic fallback
  return {
    tier: hasDate && age > 9 ? "consider-inquiry" : "monitor",
    headline: "Check official USCIS processing times",
    summary:
      "Processing times vary significantly by form type, service center, and USCIS workload. The most reliable way to assess your wait is to compare your receipt date against the current published processing times at uscis.gov/check-processing-times.",
    actions: [
      "Go to uscis.gov/check-processing-times and enter your form type and service center.",
      "Note the date on USCIS's processing time page — if your receipt date is before that date, your case may be outside the normal window.",
      "If outside the published window, consider submitting a case inquiry at egov.uscis.gov.",
      "Consult your attorney for employer-filed petitions.",
    ],
    showCaseStatusTool: true,
    showAttorneyBadge: employer === "yes",
  };
}

/* ─────────────────────── tier UI config ────────────────────────────────── */

const TIER_CONFIG: Record<ResultTier, { bg: string; border: string; badge: string; badgeText: string }> = {
  normal: {
    bg: "bg-emerald-50/60",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    badgeText: "Within normal range",
  },
  monitor: {
    bg: "bg-blue-50/60",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    badgeText: "Monitor official times",
  },
  "consider-premium": {
    bg: "bg-indigo-50/60",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-800",
    badgeText: "Consider premium processing",
  },
  "consider-inquiry": {
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    badgeText: "May be outside normal window",
  },
  urgent: {
    bg: "bg-rose-50/60",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800",
    badgeText: "Requires immediate attention",
  },
};

/* ─────────────────────── component ─────────────────────────────────────── */

export default function UscisProcessingDelayChecker() {
  const [form, setForm] = useState<FormType>("");
  const [category, setCategory] = useState<CaseCategory>("");
  const [filing, setFiling] = useState<FilingType>("");
  const [receiptMonth, setReceiptMonth] = useState(0);
  const [receiptYear, setReceiptYear] = useState(0);
  const [status, setStatus] = useState<CurrentStatus>("");
  const [rfe, setRfe] = useState<RfeReceived>("");
  const [employer, setEmployer] = useState<EmployerFiled>("");
  const [submitted, setSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const canSubmit = form !== "" && status !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) setSubmitted(true);
  }

  function handleReset() {
    setForm("");
    setCategory("");
    setFiling("");
    setReceiptMonth(0);
    setReceiptYear(0);
    setStatus("");
    setRfe("");
    setEmployer("");
    setSubmitted(false);
  }

  const result =
    submitted && form && status
      ? assess(form, category, filing, receiptMonth, receiptYear, status, rfe, employer)
      : null;

  const tierCfg = result ? TIER_CONFIG[result.tier] : null;

  return (
    <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-6 shadow-sm sm:p-8">
      {/* header */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Processing delay checker
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Is my USCIS case delayed?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Get an educational assessment based on form type, receipt date, and current status. No personal information collected.
        </p>
      </div>

      {/* disclaimer */}
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        <strong className="font-bold">Not legal advice.</strong> This tool provides general educational guidance based on publicly available information. Processing times change constantly. Always verify at{" "}
        <a
          href="https://www.uscis.gov/check-processing-times"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold"
        >
          uscis.gov/check-processing-times
        </a>{" "}
        and consult your immigration attorney before taking any action.
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* row 1 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">
                Form type <span className="text-rose-500">*</span>
              </span>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as FormType)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="">Select form…</option>
                <option value="I-129">I-129 — H1B / L1 petition</option>
                <option value="I-140">I-140 — Employment green card</option>
                <option value="I-485">I-485 — Adjustment of status</option>
                <option value="I-765">I-765 — EAD</option>
                <option value="I-131">I-131 — Advance Parole</option>
                <option value="I-130">I-130 — Family petition</option>
                <option value="N-400">N-400 — Naturalization</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">
                Case category{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CaseCategory)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select category…</option>
                <option value="h1b-transfer">H1B transfer</option>
                <option value="h1b-extension">H1B extension</option>
                <option value="h1b-amendment">H1B amendment</option>
                <option value="h4-ead">H4 EAD</option>
                <option value="f1-opt">F1 OPT / STEM OPT</option>
                <option value="employment-gc">Employment green card</option>
                <option value="family-gc">Family green card</option>
                <option value="citizenship">Citizenship</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* row 2 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">
                Filing type{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </span>
              <select
                value={filing}
                onChange={(e) => setFiling(e.target.value as FilingType)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select…</option>
                <option value="regular">Regular processing</option>
                <option value="premium">Premium processing</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">
                Current case status <span className="text-rose-500">*</span>
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CurrentStatus)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="">Select status…</option>
                <option value="received">Case received</option>
                <option value="actively-reviewed">Actively reviewed</option>
                <option value="rfe">RFE sent</option>
                <option value="rfe-response">RFE response received</option>
                <option value="approved">Approved</option>
                <option value="transferred">Transferred</option>
                <option value="other">Other / not sure</option>
              </select>
            </label>
          </div>

          {/* receipt date */}
          <div>
            <span className="text-xs font-semibold text-ink-800">
              Receipt date{" "}
              <span className="font-normal text-ink-400">(month and year only — optional but improves accuracy)</span>
            </span>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <select
                value={receiptMonth}
                onChange={(e) => setReceiptMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={0}>Month…</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={receiptYear}
                onChange={(e) => setReceiptYear(Number(e.target.value))}
                className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={0}>Year…</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-ink-400">
              Do not enter your full receipt number — month and year is sufficient.
            </p>
          </div>

          {/* row 4 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">
                Have you received an RFE?{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </span>
              <select
                value={rfe}
                onChange={(e) => setRfe(e.target.value as RfeReceived)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select…</option>
                <option value="yes">Yes — RFE received</option>
                <option value="no">No RFE</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">
                Is this employer-filed?{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </span>
              <select
                value={employer}
                onChange={(e) => setEmployer(e.target.value as EmployerFiled)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select…</option>
                <option value="yes">Yes — employer filed (H1B, I-140, etc.)</option>
                <option value="no">No — self-filed</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check my case
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

          {/* actions */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">
              Recommended actions
            </p>
            <ol className="space-y-2">
              {result.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ol>
          </div>

          {/* premium note */}
          {result.premiumNote && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-xs leading-relaxed text-indigo-900">
              <strong className="font-semibold">Premium processing note:</strong>{" "}
              {result.premiumNote}
            </div>
          )}

          {/* urgent note */}
          {result.urgentNote && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs leading-relaxed text-rose-900">
              <strong className="font-semibold">Important:</strong>{" "}
              {result.urgentNote}
            </div>
          )}

          {/* attorney badge */}
          {result.showAttorneyBadge && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Talk to your employer's attorney.</strong>{" "}
              For employer-sponsored petitions (H1B, I-140), the immigration attorney your employer retained is your primary contact — not USCIS directly. Contact HR to reach the attorney.
            </div>
          )}

          {/* links */}
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.uscis.gov/check-processing-times"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-400 hover:shadow-sm"
            >
              <span className="text-base">🔗</span>
              Official USCIS processing times
            </a>
            {result.showCaseStatusTool && (
              <Link
                href="/tools/uscis-case-status-meaning"
                className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-blue-400 hover:shadow-sm"
              >
                <span className="text-base">🛂</span>
                Case Status Meaning Tool
              </Link>
            )}
          </div>

          {/* disclaimer */}
          <p className="text-center text-xs leading-relaxed text-ink-400">
            This tool provides general educational guidance only — not legal or immigration advice.
            Individual cases vary. Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              uscis.gov
            </a>{" "}
            and consult a qualified immigration attorney.
          </p>

          <button
            onClick={handleReset}
            className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            ← Check another case
          </button>
        </div>
      ) : null}
    </div>
  );
}
