/**
 * Shared, EDITABLE timeline config for the "static timeline estimate" tables
 * shown near the top of:
 *   /perm-processing-time-calculator
 *   /i485-processing-time
 *   /nvc-case-status
 *
 * These are GENERAL PLANNING RANGES only — not guarantees, not legal advice.
 * Timelines vary by case, agency workload, category, country, documents, RFE,
 * interview, and case-specific facts. Update the rows monthly against the
 * official sources in `timelineSourceLinks` and bump TIMELINE_LAST_UPDATED*.
 */

export interface TimelineRow {
  step: string;
  estimatedTime: string;
  fasterPath: string;
  whatToCheck: string;
  /** Visually emphasise "total / key" rows. */
  highlight?: boolean;
}

/** Month-stamped so the "Last updated" line and Article schema stay in sync. */
export const TIMELINE_LAST_UPDATED = "2026-07-04";
export const TIMELINE_LAST_UPDATED_HUMAN = "July 4, 2026";

export const timelineSourceLinks = {
  dolFlag: "https://flag.dol.gov/processingtimes",
  uscisProcessingTimes: "https://egov.uscis.gov/processing-times/",
  uscisCaseStatus: "https://egov.uscis.gov/",
  visaBulletin:
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
  nvcTimeframes:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc-timeframes.html",
  ceacStatus: "https://ceac.state.gov/CEACStatTracker/Status.aspx",
} as const;

export interface SourceLink {
  label: string;
  href: string;
}

/** Standard disclaimer required on all three timeline pages. */
export const TIMELINE_DISCLAIMER =
  "This tool is for educational planning only and is not legal advice. Immigration timelines vary by case, agency workload, category, country, documents, RFE, interview, and case-specific facts.";

/* ─────────────────────────────── PERM ──────────────────────────────────── */

export const permTimelineRows: TimelineRow[] = [
  {
    step: "Prevailing Wage Determination (PWD)",
    estimatedTime: "About 5–7 months",
    fasterPath: "No premium processing",
    whatToCheck: "DOL PWD processing queue",
  },
  {
    step: "Recruitment + 30-day quiet period",
    estimatedTime: "About 2–3 months",
    fasterPath: "No shortcut; employer must follow PERM recruitment rules",
    whatToCheck: "Recruitment start/end date and attorney readiness",
  },
  {
    step: "PERM filing after recruitment",
    estimatedTime: "Usually filed after recruitment is complete and attorney review is ready",
    fasterPath: "Depends on employer and attorney speed",
    whatToCheck: "Whether ETA Form 9089 has been filed",
  },
  {
    step: "PERM analyst review",
    estimatedTime: "About 12–16 months, depending on current DOL queue",
    fasterPath: "No premium processing",
    whatToCheck: "DOL analyst review priority date",
  },
  {
    step: "PERM audit, if selected",
    estimatedTime: "Can add 6–12+ months",
    fasterPath: "No premium processing",
    whatToCheck: "DOL audit review queue and attorney response timing",
  },
  {
    step: "Total to PERM approval, no audit",
    estimatedTime: "Planning range: about 20–26 months",
    fasterPath: "No direct premium processing for PERM",
    whatToCheck: "PWD date, recruitment timing, PERM filing date, and DOL queue",
    highlight: true,
  },
  {
    step: "Total to PERM approval, with audit",
    estimatedTime: "Could be 26–36+ months",
    fasterPath: "No direct premium processing for PERM",
    whatToCheck: "Audit notice date, response date, and DOL audit queue",
    highlight: true,
  },
  {
    step: "I-140 after PERM approval",
    estimatedTime: "Regular processing may take several months; premium processing may be available for many cases",
    fasterPath: "I-140 premium processing may be available depending on case type",
    whatToCheck: "USCIS I-140 category and premium processing eligibility",
  },
  {
    step: "I-485 / green card stage",
    estimatedTime: "Depends heavily on Visa Bulletin, country, category, and USCIS processing",
    fasterPath: "Usually not controlled by PERM timing alone",
    whatToCheck: "Visa Bulletin Final Action Date and Date for Filing",
  },
];

export const permTimelineBadges = ["No premium processing", "Audit adds time", "Check DOL monthly"];

export const permPlanningSummary =
  "For many employer-sponsored EB-2 and EB-3 cases, a no-audit PERM path can easily take around 20–26 months from PWD filing to PERM approval. If the case is audited, the timeline can become much longer. After PERM approval, the employer usually files I-140, and Indian applicants may still need to wait for Visa Bulletin movement before I-485 approval.";

export const permSourceNote =
  "Planning ranges should be checked against official DOL FLAG processing times and USCIS processing times. Update this table monthly when agency data changes.";

export const permSourceLinks: SourceLink[] = [
  { label: "DOL FLAG Processing Times", href: timelineSourceLinks.dolFlag },
  { label: "USCIS Processing Times", href: timelineSourceLinks.uscisProcessingTimes },
  { label: "Visa Bulletin", href: timelineSourceLinks.visaBulletin },
];

/* ─────────────────────────────── I-485 ─────────────────────────────────── */

export const i485TimelineRows: TimelineRow[] = [
  {
    step: "I-485 receipt notice",
    estimatedTime: "Usually a few weeks after filing",
    fasterPath: "No direct shortcut",
    whatToCheck: "USCIS receipt number and filing date",
  },
  {
    step: "Biometrics appointment notice",
    estimatedTime: "Often within 1–3 months after filing, but varies",
    fasterPath: "Usually no shortcut",
    whatToCheck: "ASC appointment notice and USCIS account",
  },
  {
    step: "Biometrics completed",
    estimatedTime: "Same-day appointment, then case continues review",
    fasterPath: "No direct shortcut",
    whatToCheck: "Case status update after biometrics",
  },
  {
    step: "EAD / Advance Parole, if filed",
    estimatedTime: "Can take several months and varies by category and USCIS workload",
    fasterPath: "Expedite may be possible only in limited situations",
    whatToCheck: "I-765 and I-131 case status",
  },
  {
    step: "RFE, if issued",
    estimatedTime: "Adds time depending on response deadline and USCIS review",
    fasterPath: "Respond completely and on time",
    whatToCheck: "RFE notice, deadline, and documents requested",
  },
  {
    step: "Interview, if required",
    estimatedTime: "Timing depends on field office and case type",
    fasterPath: "Usually no direct shortcut",
    whatToCheck: "Interview notice, documents, medical exam status",
  },
  {
    step: "Final review",
    estimatedTime: "Varies after biometrics, RFE, or interview",
    fasterPath: "Usually no direct shortcut",
    whatToCheck: "USCIS case status and priority date",
  },
  {
    step: "I-485 approval / green card production",
    estimatedTime: "Depends on USCIS approval and visa availability",
    fasterPath: "Usually not guaranteed",
    whatToCheck: "Priority date, Visa Bulletin, and USCIS case status",
    highlight: true,
  },
  {
    step: "Employment-based India cases",
    estimatedTime: "Can be delayed by Visa Bulletin even after I-485 is pending",
    fasterPath: "Not controlled by USCIS processing alone",
    whatToCheck: "Final Action Date and Date for Filing for India",
    highlight: true,
  },
  {
    step: "Case outside normal processing time",
    estimatedTime: "User may be able to submit a USCIS inquiry once eligible",
    fasterPath: "Case inquiry only when USCIS allows it",
    whatToCheck: "USCIS processing times and case inquiry date",
    highlight: true,
  },
];

export const i485TimelineBadges = ["Visa Bulletin matters", "Field office varies", "RFE adds time", "Check USCIS"];

export const i485PlanningSummary =
  "I-485 timing is not based on filing date alone. USCIS processing, field office workload, biometrics, RFE, interview, medical exam, background checks, and visa availability can all affect approval. For Indian EB-2 and EB-3 applicants, I-485 may stay pending until the priority date is current under the Visa Bulletin.";

export const i485SourceNote =
  "Check official USCIS processing times and the Department of State Visa Bulletin before assuming your green card approval timeline.";

export const i485SourceLinks: SourceLink[] = [
  { label: "USCIS Processing Times", href: timelineSourceLinks.uscisProcessingTimes },
  { label: "USCIS Case Status", href: timelineSourceLinks.uscisCaseStatus },
  { label: "Visa Bulletin", href: timelineSourceLinks.visaBulletin },
];

/* ─────────────────────────────── NVC ───────────────────────────────────── */

export const nvcTimelineRows: TimelineRow[] = [
  {
    step: "USCIS approved petition",
    estimatedTime: "Case transfer to NVC may take several weeks",
    fasterPath: "Usually no direct shortcut",
    whatToCheck: "USCIS approval notice and NVC welcome letter",
  },
  {
    step: "NVC case created",
    estimatedTime: "After NVC receives the petition and creates case number",
    fasterPath: "No direct shortcut",
    whatToCheck: "NVC case number and invoice ID",
  },
  {
    step: "Fee payment",
    estimatedTime: "Payment processing may take a few days after payment",
    fasterPath: "Pay promptly when available",
    whatToCheck: "CEAC fee status",
  },
  {
    step: "DS-260 submitted",
    estimatedTime: "User-controlled step; depends on how quickly the applicant completes it",
    fasterPath: "Complete accurately and promptly",
    whatToCheck: "DS-260 confirmation page",
  },
  {
    step: "Civil and financial documents submitted",
    estimatedTime: "User-controlled step; NVC review begins after submission",
    fasterPath: "Upload complete documents correctly the first time",
    whatToCheck: "CEAC document status",
  },
  {
    step: "NVC document review",
    estimatedTime: "Varies depending on NVC workload",
    fasterPath: "Avoid checklist/RFE by submitting correct documents",
    whatToCheck: "NVC Timeframes page and CEAC messages",
  },
  {
    step: "Documentarily Qualified (DQ)",
    estimatedTime: "Means NVC accepted required documents; interview wait starts",
    fasterPath: "Interview timing depends heavily on embassy availability",
    whatToCheck: "DQ email date and embassy interview backlog",
    highlight: true,
  },
  {
    step: "Interview scheduled",
    estimatedTime: "Varies by embassy, visa category, and priority date",
    fasterPath: "Expedite only in limited urgent situations",
    whatToCheck: "Interview letter, medical exam, police certificate, and original documents",
    highlight: true,
  },
  {
    step: "In Transit",
    estimatedTime: "Case is being sent to embassy or consulate",
    fasterPath: "Usually no action needed",
    whatToCheck: "CEAC status and embassy instructions",
  },
  {
    step: "Ready",
    estimatedTime: "Embassy has case and can proceed according to its process",
    fasterPath: "Follow embassy instructions quickly",
    whatToCheck: "Appointment, medical exam, document checklist",
  },
  {
    step: "Administrative Processing",
    estimatedTime: "Can vary widely by case",
    fasterPath: "Usually no guaranteed shortcut",
    whatToCheck: "Embassy status updates and any requested documents",
    highlight: true,
  },
  {
    step: "Issued",
    estimatedTime: "Visa approved and printing/return process begins",
    fasterPath: "No action unless embassy asks",
    whatToCheck: "Passport delivery instructions",
    highlight: true,
  },
];

export const nvcTimelineBadges = ["Embassy wait varies", "DQ is not interview scheduled", "Check CEAC", "Check NVC timeframes"];

export const nvcPlanningSummary =
  "NVC timing has two main parts: document review and interview scheduling. You can control how quickly you pay fees, submit DS-260, and upload documents, but interview timing depends mostly on the embassy or consulate, visa category, priority date, and local backlog. Being documentarily qualified does not always mean an interview will be scheduled immediately.";

export const nvcSourceNote =
  "Check official NVC timeframes, CEAC case status, and the U.S. embassy or consulate page for the most current updates.";

export const nvcSourceLinks: SourceLink[] = [
  { label: "NVC Timeframes", href: timelineSourceLinks.nvcTimeframes },
  { label: "CEAC Case Status", href: timelineSourceLinks.ceacStatus },
  { label: "Visa Bulletin", href: timelineSourceLinks.visaBulletin },
];

/** NVC CEAC status meanings — rendered as a static table under the timeline. */
export interface NvcStatusMeaning {
  status: string;
  means: string;
  next: string;
}

export const nvcStatusMeanings: NvcStatusMeaning[] = [
  {
    status: "At NVC",
    means: "NVC has the case or is waiting for applicant/sponsor action.",
    next: "Check CEAC messages, fees, DS-260, and document status.",
  },
  {
    status: "Submit requested documents",
    means: "NVC needs civil or financial documents.",
    next: "Upload correct documents and review country-specific requirements.",
  },
  {
    status: "Documentarily Qualified",
    means: "NVC accepted required documents and the case is waiting for interview scheduling.",
    next: "Watch for interview letter and keep documents updated.",
  },
  {
    status: "In Transit",
    means: "Case is being sent from NVC to the embassy or consulate.",
    next: "Monitor CEAC and embassy instructions.",
  },
  {
    status: "Ready",
    means: "Embassy or consulate has the case and can proceed.",
    next: "Follow embassy instructions for interview, medical, and documents.",
  },
  {
    status: "Administrative Processing",
    means: "The case needs additional review after interview or submission.",
    next: "Wait for embassy updates and submit anything requested.",
  },
  {
    status: "Issued",
    means: "Visa was approved and is being printed/returned.",
    next: "Track passport delivery and review visa details.",
  },
  {
    status: "Refused",
    means: "This can include temporary refusal under administrative processing or a final refusal depending on the case.",
    next: "Read embassy instructions carefully and talk to an immigration attorney if needed.",
  },
];
