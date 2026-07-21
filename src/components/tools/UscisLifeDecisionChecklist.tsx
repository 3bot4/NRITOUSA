"use client";

import { useState } from "react";
import Link from "next/link";

/* ─────────────────────── types ─────────────────────────────────────────── */

type Decision =
  | "change-job"
  | "buy-house"
  | "travel-india"
  | "side-business"
  | "move-state"
  | "renew-h1b"
  | "h4-ead"
  | "file-i485"
  | "kids-aging-out"
  | "other"
  | "";

type VisaStatus =
  | "h1b"
  | "h4"
  | "h4-ead"
  | "f1-opt"
  | "i485-pending"
  | "ead-ap"
  | "green-card"
  | "other"
  | "";

type GcStage =
  | "perm-not-started"
  | "perm-pending"
  | "i140-pending"
  | "i140-approved"
  | "priority-date-waiting"
  | "i485-filed"
  | "ead-ap-received"
  | "not-sure"
  | "";

type TravelPlan = "yes" | "no" | "maybe" | "";
type EmployerChange = "yes" | "no" | "maybe" | "";
type FamilyInvolved = "spouse" | "kids" | "parents" | "none" | "";
type Urgency = "this-week" | "this-month" | "3-6-months" | "long-term" | "";

type RiskLevel = "low" | "medium" | "high" | "attorney";

interface ChecklistResult {
  riskLevel: RiskLevel;
  riskLabel: string;
  summary: string;
  checklist: string[];
  warnings: string[];
  relatedArticles: { href: string; label: string }[];
  relatedTools: { href: string; label: string }[];
}

/* ─────────────────────── poll types ────────────────────────────────────── */

interface PollData {
  city?: string;
  visaCategory?: string;
  decisionType?: string;
  biggestConcern?: string;
  email?: string;
}

/* ─────────────────────── result builder ────────────────────────────────── */

function buildResult(
  decision: Decision,
  status: VisaStatus,
  gcStage: GcStage,
  travel: TravelPlan,
  employer: EmployerChange,
  family: FamilyInvolved,
  urgency: Urgency
): ChecklistResult {
  const hasI485 = gcStage === "i485-filed" || gcStage === "ead-ap-received" || status === "i485-pending" || status === "ead-ap";
  const hasEad = status === "h4-ead" || status === "ead-ap" || gcStage === "ead-ap-received";
  const i140Approved = gcStage === "i140-approved" || gcStage === "priority-date-waiting" || gcStage === "i485-filed" || gcStage === "ead-ap-received";
  const isUrgent = urgency === "this-week" || urgency === "this-month";

  switch (decision) {
    case "change-job":
      return {
        riskLevel: hasI485 && i140Approved ? "medium" : "attorney",
        riskLabel: hasI485 && i140Approved ? "Medium — AC21 analysis required" : "Attorney advised — high stakes",
        summary: hasI485 && i140Approved
          ? "Your I-485 is filed and I-140 is approved. AC21 portability may protect your green card if you change to a same-or-similar job. The 180-day threshold is critical — verify exact days before acting."
          : "Changing jobs before I-485 has been pending 180 days, or before I-140 is approved, carries significant risk to your green card process. Get attorney advice before any action.",
        checklist: [
          "Confirm exactly how many days your I-485 has been pending (receipt date to today)",
          "Verify I-140 has been approved (not just filed) and for how long",
          "Confirm the new job's SOC code matches or is closely similar to current job",
          "Prepare I-485 Supplement J (Form I-485J) to notify USCIS of AC21 portability",
          "Secure a copy of your I-140 approval notice (I-797) before leaving employer",
          "Confirm H-1B transfer with new employer if you need to maintain H-1B status",
          ...(family === "spouse" ? ["Check H-4 EAD status for your spouse — it is tied to your H-1B"] : []),
          ...(isUrgent ? ["Urgency noted — call your attorney TODAY, do not act without confirmation"] : []),
        ],
        warnings: [
          "Never resign until your attorney confirms AC21 is safe for your specific case",
          "I-485J must be filed promptly after starting the new job",
          ...(gcStage === "perm-pending" || gcStage === "perm-not-started"
            ? ["Warning: If PERM is not complete, job change restarts your entire green card process from PERM"]
            : []),
        ],
        relatedArticles: [
          { href: "/uscis/change-job-during-green-card", label: "Change Job During Green Card: Full Guide" },
          { href: "/uscis/layoff-green-card-process", label: "Layoff During Green Card Process" },
        ],
        relatedTools: [
          { href: "/tools/h1b-transfer-risk-checklist", label: "H-1B Transfer Risk Checklist" },
          { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder" },
          { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker" },
        ],
      };

    case "buy-house":
      return {
        riskLevel: status === "green-card" ? "low" : hasI485 ? "medium" : "medium",
        riskLabel: status === "green-card" ? "Low complexity" : "Medium — plan for scenarios",
        summary: status === "green-card"
          ? "As a permanent resident, buying a house is straightforward. You have full US mortgage access and no immigration timing risk."
          : "You can legally buy a house on H-1B or with I-485 pending. The key is planning for scenarios: what if you need to leave, change employers, or face an I-485 denial? Plan these before signing.",
        checklist: [
          "Verify H-1B validity — most lenders require 1–2+ years remaining on visa",
          "Have SSN for mortgage application (or ITIN if in status transition)",
          "Document income: W-2s, recent pay stubs, employment verification letter",
          "Calculate 6 months of mortgage reserves in US accounts",
          "Understand what happens to the home if you must leave the US",
          ...(hasI485 ? ["Discuss with attorney: does the purchase affect any pending filing? (Generally no, but verify)"] : []),
          ...(family === "spouse" ? ["If spouse is on H-4 EAD: document their income too for co-borrower application"] : []),
          "Understand FBAR/FATCA implications if using Indian savings for down payment",
          ...(employer === "yes" || employer === "maybe" ? ["If you anticipate a job change: understand geographic restrictions on H-1B if you move work location"] : []),
        ],
        warnings: [
          "Mortgage approval does not guarantee continued eligibility if H-1B is not renewed",
          "Foreign down payment funds require documentation of source to satisfy AML requirements",
          ...(hasEad && !i140Approved ? ["H-4 EAD is at risk if spouse loses H-1B or I-140 eligibility — factor this income risk into mortgage planning"] : []),
        ],
        relatedArticles: [
          { href: "/uscis/buy-house-while-waiting-for-green-card", label: "Buy a House While Waiting for Green Card" },
        ],
        relatedTools: [
          { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder" },
          { href: "/tools/priority-date-checker", label: "Priority Date Checker" },
        ],
      };

    case "travel-india":
      return {
        riskLevel: hasI485 && !hasEad ? "attorney" : hasI485 ? "high" : "medium",
        riskLabel: hasI485 ? "High — Advance Parole required" : "Medium — check visa stamp validity",
        summary: hasI485
          ? "Your I-485 is pending. You CANNOT travel internationally without a physically received Advance Parole card. Do not book travel until the AP card (not the approval notice, the actual card) is in your hand."
          : "No I-485 pending detected. Ensure your H-1B visa stamp is valid for re-entry. Check your I-94 expiry and H-1B validity before booking.",
        checklist: [
          ...(hasI485
            ? [
                "Physical Advance Parole card is in your possession (not just USCIS approval notice)",
                "AP card's expiration date is AFTER your planned return date with buffer",
                "Your H-4/dependent spouse also has AP if their I-485 is pending",
                "Carry: AP card + passport + I-797 I-485 receipt + attorney contact",
                "Inform your attorney of travel dates before departure",
              ]
            : [
                "H-1B visa stamp is valid and not expired",
                "H-1B I-94 expiry date matches your expected return",
                "Employer confirms continued H-1B sponsorship after trip",
              ]),
          ...(family === "kids" ? ["Check your children's visa/status for re-entry if they are traveling with you"] : []),
          ...(isUrgent ? ["Travel is urgent — contact attorney immediately if AP is not yet in hand"] : []),
        ],
        warnings: [
          ...(hasI485
            ? [
                "Departing without physical AP card = I-485 abandonment. Your priority date in the India EB queue would be lost.",
                "USCIS 'Card Is Being Produced' status is NOT the same as holding the card",
                "An expired AP card cannot be used for re-entry even if renewal is pending",
              ]
            : []),
        ],
        relatedArticles: [
          { href: "/uscis/travel-to-india-while-i485-pending", label: "Travel to India While I-485 Pending" },
          { href: "/uscis/parents-visiting-usa-while-case-pending", label: "Parents Visiting USA (Reverse trip info)" },
        ],
        relatedTools: [
          { href: "/tools/uscis-processing-delay-checker", label: "AP Processing Delay Checker" },
        ],
      };

    case "side-business":
      return {
        riskLevel: hasEad || status === "green-card" ? "low" : "medium",
        riskLabel: hasEad || status === "green-card" ? "Low — EAD allows active work" : "Medium — passive only on H-1B",
        summary: hasEad || status === "green-card"
          ? "With EAD or green card, you can actively work in your own business — writing code, serving clients, managing operations, taking a salary. You have full work flexibility."
          : "On H-1B without EAD, you can OWN a business and earn passive income, but cannot actively work in it — writing code, serving clients, managing operations. The line between owner and active worker matters.",
        checklist: [
          ...(hasEad || status === "green-card"
            ? [
                "EAD card is valid (check expiration date)",
                "Understand self-employment tax obligations (quarterly estimated taxes)",
                "Register the LLC or corporation in your state",
                "Open a business bank account (separate from personal)",
              ]
            : [
                "Confirm you are NOT providing services or labor to the business (only owning and receiving passive income)",
                "Document the passive nature of your business involvement",
                "Consider whether your H-4 EAD spouse can actively run the business you own",
                "Consult your tax advisor about LLC passive income reporting on your US return",
              ]),
          "Consult an immigration attorney to confirm your specific activities are permissible",
          "Understand any conflicts of interest with your H-1B employer if in same industry",
        ],
        warnings: [
          ...(status === "h1b" && !hasEad
            ? [
                "Active work in your own business without EAD = unauthorized employment",
                "Unauthorized employment can jeopardize all pending USCIS applications",
              ]
            : []),
        ],
        relatedArticles: [
          { href: "/uscis/start-side-business-on-h1b", label: "Side Business on H-1B: What's Allowed" },
          { href: "/uscis/h4-ead-renewal-delay", label: "H-4 EAD Renewal Gap Planning" },
        ],
        relatedTools: [
          { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator" },
        ],
      };

    case "move-state":
      return {
        riskLevel: status === "h1b" ? "high" : "medium",
        riskLabel: status === "h1b" ? "High — H-1B amendment likely needed" : "Medium — AR-11 and field office update",
        summary: status === "h1b"
          ? "Moving your work location to a new MSA requires a new LCA and likely an H-1B amendment. Remote work from a new state has the same requirement. This must be handled by your employer's immigration counsel before or immediately after the move."
          : "Filing AR-11 is required within 10 days of any move. If your I-485 is pending, notify USCIS so your case is routed to the new field office for interview purposes.",
        checklist: [
          "File AR-11 online at my.uscis.gov within 10 days of move",
          "Notify your immigration attorney of the new address",
          ...(status === "h1b"
            ? [
                "Confirm with employer's immigration attorney whether new LCA is required (new MSA = yes)",
                "Confirm whether H-1B amendment (I-129 amendment) is required",
                "Do NOT start working from new location until LCA/amendment is handled",
              ]
            : []),
          ...(hasI485
            ? [
                "Expect I-485 interview to be routed to new state's USCIS field office",
                "If interview is already scheduled at old office, contact USCIS immediately to reschedule",
              ]
            : []),
          "Update state DMV with new address",
          "Update US bank accounts, credit cards, and employer HR records",
        ],
        warnings: [
          ...(status === "h1b"
            ? ["Working from new location before LCA is certified for that location = DOL violation for employer and status issue for you"]
            : []),
        ],
        relatedArticles: [
          { href: "/uscis/moving-states-address-change", label: "Moving States: H-1B, I-485, and What to File" },
          { href: "/uscis/ar-11-change-address", label: "AR-11 Change of Address" },
        ],
        relatedTools: [
          { href: "/tools/uscis-processing-delay-checker", label: "USCIS Processing Delay Checker" },
        ],
      };

    case "renew-h1b":
      return {
        riskLevel: hasI485 ? "medium" : "medium",
        riskLabel: "Medium — value depends on your stage",
        summary: hasI485
          ? "You have I-485 pending and likely have EAD. H-1B renewal is not legally required to work — but many attorneys recommend it for travel flexibility (no AP needed with valid H-1B stamp) and as a safety net if I-485 is denied."
          : "H-1B renewal is routine but timing matters. If your I-140 is approved and your priority date is not current, you qualify for 1-year H-1B extensions beyond the 6-year cap under AC21.",
        checklist: [
          "Confirm I-140 is approved (needed for extensions beyond 6 years)",
          ...(hasI485
            ? [
                "Consider: do you travel internationally regularly? H-1B stamp avoids AP dependency",
                "Consider: what is the safety net value if I-485 is denied?",
                "Discuss with your employer whether they will pay for the renewal",
              ]
            : []),
          "Check premium processing availability if H-1B expiry is close",
          "Confirm LCA is current and accurate for your work location",
          ...(family === "spouse" ? ["Coordinate H-4 I-539 renewal alongside H-1B I-129"] : []),
        ],
        warnings: [
          "If you let H-1B lapse and I-485 is later denied, you may have no valid nonimmigrant status",
        ],
        relatedArticles: [
          { href: "/uscis/h1b-renewal-while-i485-pending", label: "H-1B Renewal While I-485 Pending" },
        ],
        relatedTools: [
          { href: "/tools/h1b-lottery-timeline", label: "H-1B Timeline" },
          { href: "/tools/processing-times", label: "USCIS Processing Times" },
        ],
      };

    case "h4-ead":
      return {
        riskLevel: "medium",
        riskLabel: "Medium — file early, plan for gap",
        summary: "H-4 EAD has NO automatic 180-day extension. If your EAD expires before renewal is approved, you must stop working. File the I-765 renewal 6 months before expiration and financially plan for a potential gap.",
        checklist: [
          "File I-765 renewal at least 6 months before current EAD expiration",
          "Plan without premium processing — Form I-907 is not available for H-4 EAD category (c)(26)",
          "Confirm I-140 is still approved and H-1B is still valid (H-4 EAD eligibility requires both)",
          "File I-539 if H-4 status is also expiring (alongside H-1B I-129 renewal)",
          "Build 3–6 months of household expense reserves for potential EAD gap",
          "Notify employer of possible gap timeline so they can plan",
          ...(family === "kids" ? ["Check if children's H-4 status is also expiring and needs renewal"] : []),
        ],
        warnings: [
          "Do NOT work after EAD expiration — even one day of unauthorized employment can jeopardize future applications",
          "H-4 EAD does NOT qualify for the 180-day automatic extension rule — common misconception",
        ],
        relatedArticles: [
          { href: "/uscis/h4-ead-renewal-delay", label: "H-4 EAD Renewal Delay Guide" },
        ],
        relatedTools: [
          { href: "/tools/h4-ead-navigator", label: "H-4 EAD Navigator" },
          { href: "/tools/processing-times", label: "EAD Processing Times" },
        ],
      };

    case "file-i485":
      return {
        riskLevel: "high",
        riskLabel: "High complexity — act quickly when date is current",
        summary: "Filing I-485 is a major milestone. When your priority date becomes current in the visa bulletin, file immediately — priority dates can retrogress the next month. File I-485, I-765 (EAD), and I-131 (Advance Parole) all at once.",
        checklist: [
          "Check visa bulletin monthly — Final Action Date AND Dates for Filing",
          "Have all documents ready BEFORE the date becomes current so you can file within days",
          "Documents: passport, I-94, I-140 approval, medical exam (I-693), civil documents, photos",
          "File I-485 + I-765 + I-131 together (combo EAD-AP card typically issued together)",
          "Receive receipt notices — I-485 is now 'pending'",
          "File AR-11 if you move at any point during the pending period",
          ...(travel === "yes" ? ["Do NOT travel internationally until physical AP card is in hand after filing"] : []),
          ...(family === "spouse" ? ["Spouse's I-485 (as derivative beneficiary) requires separate I-485, I-765, I-131 filing"] : []),
          ...(family === "kids" ? ["Calculate children's CSPA age — consult attorney if any child is close to 21"] : []),
        ],
        warnings: [
          "Priority dates can retrogress (move backward) any month — file as soon as possible",
          "Medical exam (I-693) has a one-year validity — don't get it too early",
          ...(travel === "yes" ? ["Do NOT travel until AP card is physically received — not just USCIS tracking status"] : []),
        ],
        relatedArticles: [
          { href: "/uscis/forms/i-485", label: "I-485 Form Explained" },
          { href: "/uscis/travel-to-india-while-i485-pending", label: "Travel with I-485 Pending" },
          { href: "/green-card/cspa-kids-aging-out", label: "Kids Aging Out (CSPA)" },
        ],
        relatedTools: [
          { href: "/tools/priority-date-checker", label: "Priority Date Checker" },
          { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder" },
          { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker" },
        ],
      };

    case "kids-aging-out":
      return {
        riskLevel: "attorney",
        riskLabel: "Attorney advised — high stakes for children",
        summary: "Children aging out of the green card process is one of the most difficult immigration situations. CSPA may protect some children, but India's long EB backlogs mean many children will age out before the priority date becomes current. Get attorney analysis immediately.",
        checklist: [
          "Document each child's date of birth and ensure they are listed as derivative beneficiaries on I-140",
          "Calculate CSPA age with your attorney: (Actual age at visa availability) − (days I-140 was pending)",
          "File I-485 immediately when priority date becomes current — 'seek to acquire' within 1 year",
          "Explore F-1 student visa for children approaching 21 as a parallel path",
          "Help children establish H-1B sponsorship if they are working age",
          "Ask attorney about concurrent I-485 filing under 'Dates for Filing' to create CSPA time",
        ],
        warnings: [
          "A child who ages out loses derivative beneficiary status and must have their own immigration path",
          "India EB-2/EB-3 backlogs of 15–50+ years make aging out a near-certainty without an independent path",
        ],
        relatedArticles: [
          { href: "/green-card/cspa-kids-aging-out", label: "Kids Aging Out (CSPA): Full Guide" },
        ],
        relatedTools: [
          { href: "/tools/priority-date-checker", label: "Priority Date Checker" },
          { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder" },
        ],
      };

    default:
      return {
        riskLevel: "medium",
        riskLabel: "Medium — general guidance",
        summary: "Select your specific decision above for a personalized checklist and risk assessment.",
        checklist: [
          "Document your current visa status and expiration date",
          "Know whether your I-140 is approved and for how long",
          "Know whether your I-485 is filed and how long it has been pending",
          "Have your immigration attorney's contact ready before any major action",
          "File AR-11 within 10 days of any address change",
        ],
        warnings: [],
        relatedArticles: [
          { href: "/uscis/life-planning", label: "USCIS Life Planning Guide" },
        ],
        relatedTools: [
          { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder" },
          { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker" },
        ],
      };
  }
}

const RISK_CONFIG: Record<RiskLevel, { bg: string; border: string; badge: string; label: string }> = {
  low: { bg: "bg-emerald-50/60", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800", label: "Low planning complexity" },
  medium: { bg: "bg-amber-50/60", border: "border-amber-200", badge: "bg-amber-100 text-amber-800", label: "Plan carefully before acting" },
  high: { bg: "bg-rose-50/60", border: "border-rose-200", badge: "bg-rose-100 text-rose-800", label: "High complexity — review with attorney" },
  attorney: { bg: "bg-violet-50/60", border: "border-violet-200", badge: "bg-violet-100 text-violet-800", label: "Attorney consultation strongly advised" },
};

/* ─────────────────────── anonymous poll component ──────────────────────── */

function AnonymousPoll({ decision, status }: { decision: Decision; status: VisaStatus }) {
  const [pollData, setPollData] = useState<PollData>({
    decisionType: decision || "",
    visaCategory: status || "",
  });
  const [concern, setConcern] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePollSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pollData,
          biggestConcern: concern,
          email: email || undefined,
        }),
      });
    } catch {
      // fail silently — poll is optional
    }
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        <p className="font-semibold">Thank you for sharing! 🙏</p>
        <p className="mt-1 text-emerald-800/80">
          Your anonymous input helps other NRIs understand what decisions others face.{" "}
          <Link href="/community/nri-uscis-decisions" className="underline font-semibold">
            See aggregated insights →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePollSubmit} className="rounded-2xl border border-ink-900/5 bg-ink-50/40 p-5 space-y-3">
      <div>
        <p className="text-sm font-semibold text-ink-900">Help other NRIs: what decision are you dealing with?</p>
        <p className="mt-0.5 text-xs text-ink-500">Anonymous — no name, no email required. Takes 30 seconds.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-ink-700 mb-1">City / state (optional)</label>
          <input
            type="text"
            placeholder="e.g., San Jose, CA"
            value={pollData.city ?? ""}
            onChange={(e) => setPollData((p) => ({ ...p, city: e.target.value }))}
            className="w-full rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            maxLength={50}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-700 mb-1">Biggest concern</label>
          <select
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            className="w-full rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Select…</option>
            <option value="job-security">Job security / layoff risk</option>
            <option value="priority-date">Priority date / wait time</option>
            <option value="travel">Travel restrictions</option>
            <option value="family-income">Family income (H-4 EAD)</option>
            <option value="house-stability">Housing stability</option>
            <option value="children">Children / aging out</option>
            <option value="business">Starting a business</option>
            <option value="attorney-access">Finding good legal advice</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-700 mb-1">Email for future insights (optional)</label>
        <input
          type="email"
          placeholder="Optional — we'll notify you when community data is published"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <p className="mt-0.5 text-xs text-ink-400">We never share your email. No spam. Unsubscribe any time.</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-700 disabled:opacity-40"
      >
        {loading ? "Submitting…" : "Share anonymously →"}
      </button>
    </form>
  );
}

/* ─────────────────────── main component ────────────────────────────────── */

export default function UscisLifeDecisionChecklist() {
  const [decision, setDecision] = useState<Decision>("");
  const [status, setStatus] = useState<VisaStatus>("");
  const [gcStage, setGcStage] = useState<GcStage>("");
  const [travel, setTravel] = useState<TravelPlan>("");
  const [employer, setEmployer] = useState<EmployerChange>("");
  const [family, setFamily] = useState<FamilyInvolved>("");
  const [urgency, setUrgency] = useState<Urgency>("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setDecision(""); setStatus(""); setGcStage(""); setTravel("");
    setEmployer(""); setFamily(""); setUrgency(""); setSubmitted(false);
  }

  const result = submitted ? buildResult(decision, status, gcStage, travel, employer, family, urgency) : null;
  const cfg = result ? RISK_CONFIG[result.riskLevel] : null;

  return (
    <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/50 to-white p-6 shadow-sm sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-green-700">USCIS Life Decision Checklist</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          Is this safe for your immigration status?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Select your situation for a personalized risk level, checklist of questions to answer, and related guides.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Main decision</span>
              <select value={decision} onChange={(e) => setDecision(e.target.value as Decision)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select decision…</option>
                <option value="change-job">Changing job / employer</option>
                <option value="buy-house">Buying a house</option>
                <option value="travel-india">Traveling to India</option>
                <option value="side-business">Starting a side business</option>
                <option value="move-state">Moving to another state</option>
                <option value="renew-h1b">Renewing H-1B</option>
                <option value="h4-ead">H-4 EAD renewal / gap</option>
                <option value="file-i485">Filing I-485 (green card)</option>
                <option value="kids-aging-out">Child aging out concern</option>
                <option value="other">Other / general planning</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Current status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as VisaStatus)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select status…</option>
                <option value="h1b">H-1B</option>
                <option value="h4">H-4 (no EAD)</option>
                <option value="h4-ead">H-4 EAD</option>
                <option value="f1-opt">F-1 / OPT</option>
                <option value="i485-pending">I-485 pending</option>
                <option value="ead-ap">EAD / Advance Parole</option>
                <option value="green-card">Green card holder</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Green card stage</span>
              <select value={gcStage} onChange={(e) => setGcStage(e.target.value as GcStage)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select stage…</option>
                <option value="perm-not-started">PERM not started</option>
                <option value="perm-pending">PERM pending</option>
                <option value="i140-pending">I-140 pending</option>
                <option value="i140-approved">I-140 approved</option>
                <option value="priority-date-waiting">Priority date waiting (I-140 approved)</option>
                <option value="i485-filed">I-485 filed</option>
                <option value="ead-ap-received">EAD / AP received</option>
                <option value="not-sure">Not sure</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Planning international travel?</span>
              <select value={travel} onChange={(e) => setTravel(e.target.value as TravelPlan)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Employer change involved?</span>
              <select value={employer} onChange={(e) => setEmployer(e.target.value as EmployerChange)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-800">Family involved?</span>
              <select value={family} onChange={(e) => setFamily(e.target.value as FamilyInvolved)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="spouse">Spouse</option>
                <option value="kids">Children</option>
                <option value="parents">Parents visiting</option>
                <option value="none">None / just me</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-ink-800">Timeline / urgency</span>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/20">
                <option value="">Select…</option>
                <option value="this-week">This week</option>
                <option value="this-month">This month</option>
                <option value="3-6-months">3–6 months</option>
                <option value="long-term">Long-term planning</option>
              </select>
            </label>
          </div>

          <button type="submit" disabled={!decision}
            className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:opacity-40">
            Get my checklist
          </button>
        </form>
      ) : result && cfg ? (
        <div className="space-y-4">
          {/* Risk badge + summary */}
          <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${cfg.badge}`}>
              {result.riskLabel}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-ink-800">{result.summary}</p>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm space-y-2">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-rose-900">
                  <strong className="font-bold">⚠️ </strong>{w}
                </p>
              ))}
            </div>
          )}

          {/* Checklist */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">Your checklist before acting</p>
            <ul className="space-y-2">
              {result.checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-0.5 flex-none font-bold text-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal disclaimer */}
          <div className="rounded-xl border border-ink-900/5 bg-ink-50/60 px-4 py-3 text-xs text-ink-500">
            This checklist is educational only — not legal or immigration advice. Rules, processing times, and eligibility requirements change frequently. Consult a licensed immigration attorney before any major immigration-related decision.
          </div>

          {/* Related articles */}
          {result.relatedArticles.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">Related guides</p>
              <div className="space-y-2">
                {result.relatedArticles.map((a) => (
                  <Link key={a.href} href={a.href}
                    className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-green-400">
                    <span>📖</span> {a.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related tools */}
          {result.relatedTools.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">Related tools</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.relatedTools.map((t) => (
                  <Link key={t.href} href={t.href}
                    className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm font-semibold text-ink-900 transition hover:border-green-400">
                    <span>🔧</span> {t.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Anonymous poll */}
          <AnonymousPoll decision={decision} status={status} />

          <button onClick={handleReset}
            className="w-full rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
            ← Check another decision
          </button>
        </div>
      ) : null}
    </div>
  );
}
