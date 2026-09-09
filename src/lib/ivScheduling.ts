/**
 * IV Scheduling Status — interpretation layer for the Department of State's
 * "IV Scheduling Status Tool" (/tools/iv-scheduling-status).
 *
 * WHAT THE GOVERNMENT TOOL DOES: for a chosen visa path and consular post, it
 * reports the date on which recently scheduled immigrant-visa interviews became
 * DOCUMENTARILY COMPLETE (fees paid + DS-260 + all civil/financial documents
 * accepted). It is a queue marker, not a priority date, and confusing the two is
 * the single most common error in third-party coverage of this tool.
 *
 * WHAT THIS MODULE ADDS: the government tool answers "where is the post's DQ
 * queue?" but never "why am I not scheduled?". For preference categories — which
 * is every Indian employment case and most Indian family cases — there are two
 * independent gates, and the tool only shows one of them:
 *
 *   Gate 1 — VISA AVAILABILITY (the Visa Bulletin). A consular interview can
 *            only be scheduled when a visa number is expected to be available,
 *            i.e. when the priority date is current under the FINAL ACTION
 *            DATES chart. NVC uses the DATES FOR FILING chart earlier, to
 *            decide when to invite the document package that leads to DQ.
 *   Gate 2 — THE POST'S DQ QUEUE. Among cases that clear gate 1, NVC fills the
 *            interview slots a post releases, broadly first-in/first-out by DQ
 *            date. That is the number the government tool publishes.
 *
 * The diagnosis below tells a user WHICH gate is holding them, because the
 * remedy is completely different: gate 1 is a wait for the bulletin to move and
 * no inquiry will help, while gate 2 is a queue position that a public inquiry
 * can legitimately address once you are past the post's posted DQ date.
 *
 * DATA: cutoffs come from data/visa-bulletin/current.json — the same single
 * source of truth used by the visa bulletin cluster, the priority date checker
 * and the green card tracker (see src/lib/visa-bulletin.ts). This module never
 * hardcodes a cutoff. The post's currently-scheduling DQ month is NOT stored
 * here: it changes constantly and per post, so the user reads it off the live
 * official tool and enters it, and we date-stamp their entry in the result.
 *
 * Educational only — not legal advice.
 */

import currentData from "../../data/visa-bulletin/current.json";

/* ─────────────────────── official sources ──────────────────────────────── */

export const ivSchedulingLinks = {
  /** The Department of State IV Scheduling Status Tool itself. */
  tool: "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc/iv-scheduling-status.html",
  /** NVC's own published processing timeframes. */
  nvcTimeframes:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc/nvc-timeframes.html",
  /** CEAC — where the case status and document requests actually live. */
  ceac: "https://ceac.state.gov/IV/Login.aspx",
  /** The monthly Visa Bulletin (gate 1). */
  visaBulletin:
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
  /** NVC public inquiry form. */
  publicInquiry:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc/nvc-contact-information.html",
  /** "Helpful Hints: IV Processing" — where DOS explains DQ and scheduling. */
  helpfulHints:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-1-submit-a-petition/step-2-begin-nvc-processing/helpful-hints-iv-processing.html",
} as const;

/**
 * Case types the Department of State states are NOT reflected in the IV
 * Scheduling Status Tool. Verified against the tool's own page copy.
 */
export const IV_TOOL_EXCLUSIONS = [
  "Diversity Visa (DV) cases",
  "Afghan Special Immigrant Visa (SIV) cases",
  "I-601A provisional unlawful presence waiver cases",
  "Adoption cases",
] as const;

/** Date this cluster's policy statements were last checked against DOS. */
export const IV_SCHEDULING_VERIFIED = "2026-09-09";

/* ─────────────────────── categories ────────────────────────────────────── */

export type VisaPath = "immediate" | "family" | "employment";

export type IvCategory =
  // Immediate relatives — no numerical limit, so gate 1 never applies
  | "IR1"
  | "IR2"
  | "IR5"
  // Family preference
  | "F1"
  | "F2A"
  | "F2B"
  | "F3"
  | "F4"
  // Employment preference
  | "EB1"
  | "EB2"
  | "EB3"
  | "EB3Other"
  | "EB4"
  | "EB5";

export type Chargeability = "india" | "china" | "mexico" | "philippines" | "row";

export const CHARGEABILITY_LABELS: Record<Chargeability, string> = {
  india: "India",
  china: "China — mainland born",
  mexico: "Mexico",
  philippines: "Philippines",
  row: "All other chargeability areas",
};

export interface CategoryMeta {
  label: string;
  path: VisaPath;
  /** Key into current.json; null for immediate relatives (never numbered). */
  bulletinKey: string | null;
  /** "family" or "categories" bucket in current.json. */
  bucket: "family" | "categories" | null;
  hint: string;
}

export const IV_CATEGORIES: Record<IvCategory, CategoryMeta> = {
  IR1: {
    label: "IR1 — Spouse of a U.S. citizen",
    path: "immediate",
    bulletinKey: null,
    bucket: null,
    hint: "Immediate relative — no annual visa limit, so there is no priority date wait.",
  },
  IR2: {
    label: "IR2 — Unmarried child under 21 of a U.S. citizen",
    path: "immediate",
    bulletinKey: null,
    bucket: null,
    hint: "Immediate relative — no annual visa limit, so there is no priority date wait.",
  },
  IR5: {
    label: "IR5 — Parent of a U.S. citizen",
    path: "immediate",
    bulletinKey: null,
    bucket: null,
    hint: "Immediate relative — no annual visa limit, so there is no priority date wait.",
  },
  F1: {
    label: "F1 — Unmarried adult son/daughter of a U.S. citizen",
    path: "family",
    bulletinKey: "f1",
    bucket: "family",
    hint: "Family first preference.",
  },
  F2A: {
    label: "F2A — Spouse/child of a lawful permanent resident",
    path: "family",
    bulletinKey: "f2a",
    bucket: "family",
    hint: "Family second preference (2A).",
  },
  F2B: {
    label: "F2B — Unmarried adult son/daughter of an LPR",
    path: "family",
    bulletinKey: "f2b",
    bucket: "family",
    hint: "Family second preference (2B).",
  },
  F3: {
    label: "F3 — Married son/daughter of a U.S. citizen",
    path: "family",
    bulletinKey: "f3",
    bucket: "family",
    hint: "Family third preference.",
  },
  F4: {
    label: "F4 — Sibling of an adult U.S. citizen",
    path: "family",
    bulletinKey: "f4",
    bucket: "family",
    hint: "Family fourth preference — the longest family queue for India.",
  },
  EB1: {
    label: "EB-1 — Priority worker",
    path: "employment",
    bulletinKey: "eb1",
    bucket: "categories",
    hint: "Employment first preference.",
  },
  EB2: {
    label: "EB-2 — Advanced degree / exceptional ability",
    path: "employment",
    bulletinKey: "eb2",
    bucket: "categories",
    hint: "Employment second preference.",
  },
  EB3: {
    label: "EB-3 — Skilled worker / professional",
    path: "employment",
    bulletinKey: "eb3",
    bucket: "categories",
    hint: "Employment third preference.",
  },
  EB3Other: {
    label: "EB-3 — Other Worker (unskilled)",
    path: "employment",
    bulletinKey: "eb3Other",
    bucket: "categories",
    hint: "The separate Other Worker cutoff, which usually lags EB-3.",
  },
  EB4: {
    label: "EB-4 — Special immigrant",
    path: "employment",
    bulletinKey: "eb4",
    bucket: "categories",
    hint: "Employment fourth preference.",
  },
  EB5: {
    label: "EB-5 — Investor (Unreserved)",
    path: "employment",
    bulletinKey: "eb5",
    bucket: "categories",
    hint: "Unreserved EB-5. The three reserved set-asides have their own cutoffs.",
  },
};

export const IV_CATEGORY_ORDER: IvCategory[] = [
  "IR1",
  "IR2",
  "IR5",
  "F1",
  "F2A",
  "F2B",
  "F3",
  "F4",
  "EB1",
  "EB2",
  "EB3",
  "EB3Other",
  "EB4",
  "EB5",
];

/* ─────────────────────── bulletin lookup ───────────────────────────────── */

export type CutoffValue = string; // "C" | "U" | "YYYY-MM-DD"

export interface Cutoffs {
  fad: CutoffValue;
  dff: CutoffValue;
}

type RawBucket = Record<string, Record<string, Cutoffs>>;

/** The bulletin month these cutoffs come from, e.g. "2026-09". */
export const bulletinMonth: string = currentData.bulletinMonth;
export const bulletinSource: string = currentData.source;
export const bulletinLastUpdated: string = currentData.lastUpdated;

/**
 * Cutoffs for a category + chargeability area, or null for immediate relatives
 * (which are exempt from numerical limits entirely).
 */
export function getIvCutoffs(
  category: IvCategory,
  country: Chargeability,
): Cutoffs | null {
  const meta = IV_CATEGORIES[category];
  if (!meta.bulletinKey || !meta.bucket) return null;
  const bucket = (
    meta.bucket === "family" ? currentData.family : currentData.categories
  ) as unknown as RawBucket;
  const row = bucket[meta.bulletinKey];
  if (!row) return null;
  return row[country] ?? row.row ?? null;
}

/* ─────────────────────── date helpers ──────────────────────────────────── */

/** Parse "YYYY-MM" or "YYYY-MM-DD" to a UTC Date, or null. */
export function parseMonth(value: string): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = m[3] ? Number(m[3]) : 1;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  return isNaN(d.getTime()) ? null : d;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-09" → "September 2026"; "2015-01-15" → "15 January 2015". */
export function formatCutoffDate(value: string): string {
  if (value === "C") return "Current";
  if (value === "U") return "Unavailable";
  const d = parseMonth(value);
  if (!d) return value;
  const hasDay = /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
  const label = `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return hasDay ? `${d.getUTCDate()} ${label}` : label;
}

/** Whole months from `a` to `b` (negative when b precedes a). */
export function monthsBetween(a: Date, b: Date): number {
  return (
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth())
  );
}

/** Render a month count as "about 1 year 4 months". */
export function formatMonthGap(months: number): string {
  const n = Math.abs(months);
  if (n === 0) return "the same month";
  if (n < 12) return `${n} month${n === 1 ? "" : "s"}`;
  const years = Math.floor(n / 12);
  const rem = n % 12;
  const y = `${years} year${years === 1 ? "" : "s"}`;
  return rem === 0 ? y : `${y} ${rem} month${rem === 1 ? "" : "s"}`;
}

/* ─────────────────────── priority-date comparison ──────────────────────── */

export type DateStatus =
  | "no-limit" // immediate relative
  | "all-current" // cutoff is "C"
  | "current" // priority date is earlier than the cutoff
  | "not-current" // priority date is not yet reached
  | "unavailable"; // cutoff is "U" — no numbers at all this month

/**
 * Compare a priority date against a cutoff. A priority date qualifies only when
 * it is STRICTLY EARLIER than the listed cutoff — a date equal to the cutoff is
 * not current. This mirrors comparePriorityDate() in visaBulletinDates.ts.
 */
export function compareToCutoff(
  priorityDate: Date,
  cutoff: CutoffValue,
): DateStatus {
  if (cutoff === "C") return "all-current";
  if (cutoff === "U") return "unavailable";
  const c = parseMonth(cutoff);
  if (!c) return "not-current";
  return priorityDate.getTime() < c.getTime() ? "current" : "not-current";
}

const QUALIFIES: DateStatus[] = ["no-limit", "all-current", "current"];
export const cutoffQualifies = (s: DateStatus): boolean =>
  QUALIFIES.indexOf(s) !== -1;

/* ─────────────────────── the diagnosis ─────────────────────────────────── */

export interface IvSchedulingInputs {
  category: IvCategory | "";
  country: Chargeability | "";
  /** ISO date — the priority date on the approved petition. */
  priorityDate: string;
  /** "YYYY-MM" — the month this case became documentarily complete. */
  dqMonth: string;
  /** "YYYY-MM" — the month the official tool shows for the chosen post. */
  postSchedulingMonth: string;
  /** Free-text post name, e.g. "Mumbai". Display only. */
  post: string;
}

export type Bottleneck =
  | "incomplete"
  | "visa-availability"
  | "visa-unavailable"
  | "not-yet-invited"
  | "post-queue"
  | "due-now"
  | "overdue";

export interface IvSchedulingResult {
  bottleneck: Bottleneck;
  /** One-line verdict. */
  headline: string;
  /** Which of the two gates is actually holding the case. */
  gateLabel: string;
  tone: "neutral" | "positive" | "info" | "caution" | "attention";
  badge: string;
  /** The reasoning, in plain language. */
  detail: string;
  /** What to do next. */
  nextStep: string;
  /** Gate 1 detail lines. */
  finalActionStatus: DateStatus | null;
  filingStatus: DateStatus | null;
  finalActionCutoff: CutoffValue | null;
  filingCutoff: CutoffValue | null;
  /** Gate 2: months between the post's DQ marker and this case's DQ month. */
  queueGapMonths: number | null;
  /** True when an NVC public inquiry is a reasonable next step. */
  inquiryReasonable: boolean;
  /** Things that would change the answer. */
  caveats: string[];
}

const INCOMPLETE: IvSchedulingResult = {
  bottleneck: "incomplete",
  headline: "Fill in your category, chargeability and priority date",
  gateLabel: "Not enough information yet",
  tone: "neutral",
  badge: "Incomplete",
  detail:
    "Choose your immigrant visa category and country of chargeability, and enter the priority date from your approved petition. Add your documentarily complete month and the month the official tool shows for your post to also get a queue position.",
  nextStep: "",
  finalActionStatus: null,
  filingStatus: null,
  finalActionCutoff: null,
  filingCutoff: null,
  queueGapMonths: null,
  inquiryReasonable: false,
  caveats: [],
};

/**
 * Work out which gate is holding an immigrant visa case, and what to do.
 *
 * Order matters: visa availability is checked first because it sits upstream of
 * the DQ queue entirely. A case that is not current under Final Action Dates
 * cannot be scheduled however early its DQ date is, and telling that user to
 * file a public inquiry about their queue position would be actively harmful.
 */
export function diagnoseIvScheduling(
  inputs: IvSchedulingInputs,
): IvSchedulingResult {
  const { category, country, priorityDate, dqMonth, postSchedulingMonth } = inputs;
  if (!category || !country || !priorityDate) return INCOMPLETE;

  const pd = parseMonth(priorityDate);
  if (!pd) return INCOMPLETE;

  const meta = IV_CATEGORIES[category];
  const cutoffs = getIvCutoffs(category, country);
  const caveats: string[] = [];

  const dq = parseMonth(dqMonth);
  const postMonth = parseMonth(postSchedulingMonth);
  const queueGapMonths =
    dq && postMonth ? monthsBetween(postMonth, dq) : null;

  /* ---- Immediate relatives: gate 1 does not exist ---------------------- */
  if (meta.path === "immediate" || !cutoffs) {
    const base = {
      finalActionStatus: "no-limit" as DateStatus,
      filingStatus: "no-limit" as DateStatus,
      finalActionCutoff: null,
      filingCutoff: null,
      queueGapMonths,
      caveats: [
        "Immediate relative categories (IR1, IR2, IR5) have no annual visa limit, so the Visa Bulletin never gates your interview. Your only queue is your post's.",
      ],
    };
    if (queueGapMonths === null) {
      return {
        ...base,
        bottleneck: "post-queue",
        headline: "No priority date wait — your only queue is the post's",
        gateLabel: "Gate 2: the post's DQ queue",
        tone: "info",
        badge: "Immediate relative",
        detail:
          "As an immediate relative you are exempt from the numerical limits in the Visa Bulletin, so a visa number is always available to you. The only thing between you and an interview is your consular post's scheduling queue.",
        nextStep:
          "Enter your documentarily complete month and the month the official IV Scheduling Status Tool currently shows for your post to see where you sit in that queue.",
        inquiryReasonable: false,
      };
    }
    return {
      ...base,
      ...queueVerdict(queueGapMonths, inputs.post, true),
    };
  }

  /* ---- Gate 1: visa availability -------------------------------------- */
  const fadStatus = compareToCutoff(pd, cutoffs.fad);
  const dffStatus = compareToCutoff(pd, cutoffs.dff);

  const shared = {
    finalActionStatus: fadStatus,
    filingStatus: dffStatus,
    finalActionCutoff: cutoffs.fad,
    filingCutoff: cutoffs.dff,
    queueGapMonths,
  };

  const bulletinLabel = formatCutoffDate(bulletinMonth);

  // 1a. No visa numbers at all this month.
  if (fadStatus === "unavailable") {
    return {
      ...shared,
      bottleneck: "visa-unavailable",
      headline: "No visa numbers are available in your category this month",
      gateLabel: "Gate 1: visa availability",
      tone: "attention",
      badge: "Unavailable (U)",
      detail: `The ${bulletinLabel} Visa Bulletin lists your category as "U" — Unavailable — for ${CHARGEABILITY_LABELS[country]}. That means no immigrant visa numbers are being issued in this category at all this month, so no interview can be scheduled regardless of how long ago you became documentarily complete. This is a hard stop set by the annual numerical limits, not a backlog at your post.`,
      nextStep:
        "There is nothing to file and no inquiry that will move this. Watch the Visa Bulletin each month for the category to reopen with a date. A 'U' at the end of a fiscal year very often reopens in October when the new year's visa numbers become available.",
      inquiryReasonable: false,
      caveats: [
        "A public inquiry will not change a 'U'. NVC cannot schedule an interview without an available visa number.",
        `Cutoffs move monthly. This reflects the ${bulletinLabel} bulletin only.`,
      ],
    };
  }

  // 1b. Not even current for filing — the case should not be DQ yet.
  if (!cutoffQualifies(dffStatus)) {
    return {
      ...shared,
      bottleneck: "not-yet-invited",
      headline: "Your priority date has not reached the Dates for Filing cutoff",
      gateLabel: "Gate 1: visa availability",
      tone: "caution",
      badge: "Too early",
      detail: `Your priority date (${formatCutoffDate(priorityDate)}) is not yet earlier than the ${bulletinLabel} Dates for Filing cutoff of ${formatCutoffDate(cutoffs.dff)} for ${CHARGEABILITY_LABELS[country]}. NVC uses that chart to decide when to invite your fee payments, DS-260 and document package — the steps that make a case documentarily complete. Until it passes you, there is nothing for NVC to review.`,
      nextStep:
        "Keep your documents current and watch the Dates for Filing chart each month. You do not need to do anything at NVC yet, and an inquiry now will not speed anything up.",
      inquiryReasonable: false,
      caveats: [
        "Dates for Filing governs when you can submit; Final Action Dates governs when a visa can actually be issued. Clearing the first does not schedule an interview.",
        `Cutoffs move monthly. This reflects the ${bulletinLabel} bulletin only.`,
      ],
    };
  }

  // 1c. THE CLASSIC TRAP: current for filing, not current for final action.
  if (!cutoffQualifies(fadStatus)) {
    return {
      ...shared,
      bottleneck: "visa-availability",
      headline:
        "You can be documentarily complete, but no interview can be scheduled yet",
      gateLabel: "Gate 1: visa availability",
      tone: "caution",
      badge: "DQ but not current",
      detail: `This is the position most Indian preference applicants are in, and it is the one the official tool cannot explain. Your priority date (${formatCutoffDate(priorityDate)}) is past the Dates for Filing cutoff (${formatCutoffDate(cutoffs.dff)}), so NVC invited your documents and your case can sit at "documentarily complete". But it is not yet past the ${bulletinLabel} Final Action Date of ${formatCutoffDate(cutoffs.fad)} for ${CHARGEABILITY_LABELS[country]} — and a consular interview can only be scheduled when a visa number is expected to be available at issuance. Your DQ date is banked; the queue you are actually in is the Visa Bulletin's.`,
      nextStep:
        "Do not read your post's scheduling month as your wait — it does not apply to you yet. Track the Final Action Date for your category each month. Keep passports, police certificates and civil documents valid so you are ready when it passes you, and keep NVC updated if your address or family composition changes.",
      inquiryReasonable: false,
      caveats: [
        "Being documentarily complete is necessary but not sufficient. Visa availability is the binding constraint here.",
        "When the Final Action Date does pass your priority date, your banked DQ date is what puts you in the post's queue — which is why becoming DQ early still matters.",
        `Cutoffs move monthly, and can retrogress. This reflects the ${bulletinLabel} bulletin only.`,
      ],
    };
  }

  /* ---- Gate 1 cleared. Gate 2: the post's queue ------------------------ */
  caveats.push(
    fadStatus === "all-current"
      ? `Your category is Current ("C") for ${CHARGEABILITY_LABELS[country]} in the ${bulletinLabel} bulletin, so visa availability is not holding you.`
      : `Your priority date is earlier than the ${bulletinLabel} Final Action Date of ${formatCutoffDate(cutoffs.fad)}, so a visa number is expected to be available.`,
  );
  caveats.push(
    "Final Action Dates can retrogress. If your category moves backwards past your priority date before the interview, scheduling stops until it moves forward again.",
  );

  if (queueGapMonths === null) {
    return {
      ...shared,
      bottleneck: "post-queue",
      headline: "Visa availability is not your problem — your post's queue is",
      gateLabel: "Gate 2: the post's DQ queue",
      tone: "info",
      badge: "Current",
      detail: `Your priority date is current under the ${bulletinLabel} Final Action Dates chart, so gate 1 is clear. What remains is your consular post's interview capacity, which NVC fills broadly first-in, first-out by documentarily complete date.`,
      nextStep:
        "Enter your documentarily complete month and the month the official IV Scheduling Status Tool currently shows for your post to see how far ahead of you the queue is.",
      inquiryReasonable: false,
      caveats,
    };
  }

  return {
    ...shared,
    ...queueVerdict(queueGapMonths, inputs.post, false),
    caveats,
  };
}

/**
 * Gate 2 verdict: compare this case's DQ month against the DQ month the post is
 * currently scheduling. A positive gap means the case is still ahead of (later
 * than) the marker — i.e. still waiting.
 */
function queueVerdict(
  gapMonths: number,
  post: string,
  immediateRelative: boolean,
): Pick<
  IvSchedulingResult,
  | "bottleneck"
  | "headline"
  | "gateLabel"
  | "tone"
  | "badge"
  | "detail"
  | "nextStep"
  | "inquiryReasonable"
> {
  const where = post.trim() ? post.trim() : "your post";
  const gap = formatMonthGap(gapMonths);

  if (gapMonths > 0) {
    return {
      bottleneck: "post-queue",
      headline: `You are about ${gap} behind the cases ${where} is scheduling now`,
      gateLabel: "Gate 2: the post's DQ queue",
      tone: "info",
      badge: "In the queue",
      detail: `${where} is currently scheduling interviews for cases that became documentarily complete around the month you entered. Yours became complete ${gap} later, so there are still cases ahead of you. That gap is not a countdown — it shrinks only as fast as the post releases appointment slots, and posts release them unevenly.${immediateRelative ? " As an immediate relative you have no priority date wait, so this queue is the only thing between you and an interview." : ""}`,
      nextStep:
        "Nothing to file. Watch the official tool monthly and see how fast the post's date is moving — two or three readings tell you far more than one. Keep your documents and passports valid so a sudden appointment does not catch you short.",
      inquiryReasonable: false,
    };
  }

  if (gapMonths === 0) {
    return {
      bottleneck: "due-now",
      headline: `Your DQ month is the one ${where} is scheduling now`,
      gateLabel: "Gate 2: the post's DQ queue",
      tone: "positive",
      badge: "At the front",
      detail: `Your case became documentarily complete in the same month ${where} is currently working through. Appointment letters for your month may be going out now, in batches, over several weeks.`,
      nextStep:
        "Watch your email and CEAC closely, and make sure NVC has a current email address for you and your attorney. Book nothing non-refundable until the appointment letter actually arrives, and start planning the medical exam.",
      inquiryReasonable: false,
    };
  }

  const behind = formatMonthGap(gapMonths);
  return {
    bottleneck: "overdue",
    headline: `${where} is scheduling cases ${behind} newer than yours`,
    gateLabel: "Gate 2: the post's DQ queue — you appear to be past it",
    tone: "attention",
    badge: "Past the marker",
    detail: `Your case became documentarily complete ${behind} before the month ${where} is currently scheduling. Cases that became complete after yours are being given interviews, which is not how the queue normally runs. The usual explanations are mundane: an unresolved document request sitting in CEAC that you have not noticed, a name or case-number mismatch, a derivative applicant who is not yet documentarily complete, or a case still held for administrative reasons.`,
    nextStep:
      "Log in to CEAC first and confirm there is no outstanding item on the case and that every applicant — including derivatives — shows as complete. If everything is clean and you are genuinely past the posted month, this is one of the few situations where an NVC public inquiry is the right next step.",
    inquiryReasonable: true,
  };
}
