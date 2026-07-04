/**
 * Shared, EDITABLE "estimated timeline answer" config for the Green Card
 * Renewal cluster. This exists so every cluster page can show a fast, honest
 * timeline estimate ABOVE the calculator without hardcoding numbers in JSX.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * SITEWIDE RULE — for ALL immigration processing-time pages:
 *   • Always show an estimated timeline answer BEFORE the calculator.
 *   • Do not only explain stages — search users want "how long" first.
 *   • Use static planning ranges + official source links + a personal tool.
 *   • Keep every estimate editable here in config, not inline in the page.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * These are GENERAL PLANNING RANGES, not guarantees and not legal advice.
 * USCIS processing times, fees, receipt-notice language, and policies change.
 * Update the ranges monthly against the official sources and bump the
 * `lastUpdated` label + the cluster's GC_RENEWAL_UPDATED dates.
 */

export const greenCardRenewalTimingConfig = {
  lastUpdated: "Update monthly",
  officialProcessingTimeLabel: "Check USCIS Processing Times",
  standardRenewalPlanningEstimate: "About 8–14 months",
  competitorStyleShortEstimate:
    "Around 10–12 months is a common planning estimate, but users should verify current USCIS Form I-90 processing times.",
  receiptNoticeEstimate: "Usually days to a few weeks after filing",
  biometricsEstimate: "Varies; USCIS may schedule biometrics or reuse prior biometrics",
  uscisReviewEstimate: "Varies by USCIS workload and case facts",
  cardProductionEstimate: "After approval",
  cardMailingEstimate: "Usually after card production; mailing time varies",
  rfeImpactEstimate: "Can add time depending on the response deadline and USCIS review",
  outsideNormalProcessingEstimate:
    "Check USCIS Processing Times before submitting an inquiry",
  receiptExtensionNote:
    "For eligible green card renewal applicants, USCIS has announced a receipt notice validity extension. Always read your receipt notice and verify current USCIS guidance.",
  sourceNote:
    "These are educational planning estimates. USCIS processing times, fees, receipt notice language, and policies can change. Always verify with official USCIS sources.",
  sources: {
    formI90: "https://www.uscis.gov/i-90",
    replaceGreenCard:
      "https://www.uscis.gov/green-card/after-we-grant-your-green-card/replace-your-green-card",
    processingTimes: "https://egov.uscis.gov/processing-times/",
    fileOnline: "https://www.uscis.gov/file-online",
    feeSchedule: "https://www.uscis.gov/g-1055",
    caseStatus: "https://egov.uscis.gov/",
    validityExtension36Months:
      "https://www.uscis.gov/newsroom/alerts/uscis-extends-green-card-validity-extension-to-36-months-for-green-card-renewals",
  },
} as const;

/** A single row in an EstimatedTimelineAnswer table. Extra string keys allowed. */
export interface EstimateRow {
  [key: string]: string | boolean | undefined;
  /** Visually emphasise "key" rows. */
  highlight?: boolean;
}

/** A column definition for the generic EstimatedTimelineAnswer component. */
export interface EstimateColumn {
  key: string;
  label: string;
  /** Render this cell as the visually prominent "estimated time" column. */
  emphasize?: boolean;
}

/** Convenience: official source links derived from config. */
const S = greenCardRenewalTimingConfig.sources;
export const greenCardRenewalOfficialLinks: { label: string; href: string }[] = [
  { label: "Form I-90", href: S.formI90 },
  { label: "USCIS Processing Times", href: S.processingTimes },
  { label: "USCIS Fee Schedule", href: S.feeSchedule },
  { label: "USCIS Case Status", href: S.caseStatus },
];

/* ───────────── Fast-answer rows (hub + processing-time pages) ───────────── */

export const greenCardRenewalFastAnswerColumns: EstimateColumn[] = [
  { key: "situation", label: "Situation" },
  { key: "estimatedTime", label: "Estimated time", emphasize: true },
  { key: "whatItMeans", label: "What it means" },
  { key: "whatToCheck", label: "What to check" },
];

export const greenCardRenewalFastAnswerRows: EstimateRow[] = [
  {
    situation: "10-year green card renewal",
    estimatedTime: "About 8–14 months as a planning range",
    whatItMeans:
      "This is the common Form I-90 renewal path for a regular 10-year Permanent Resident Card.",
    whatToCheck: "Official USCIS Form I-90 processing times",
    highlight: true,
  },
  {
    situation: "Green card replacement: lost, stolen, or damaged",
    estimatedTime: "Often similar to Form I-90 renewal timing, but varies",
    whatItMeans: "You may need Form I-90 to replace the physical card.",
    whatToCheck: "USCIS case status, temporary proof needs, and Form I-90 instructions",
  },
  {
    situation: "Receipt notice after filing I-90",
    estimatedTime: "Usually days to a few weeks after filing",
    whatItMeans: "USCIS confirms it received your application.",
    whatToCheck: "Receipt number, USCIS account, and receipt notice extension language",
  },
  {
    situation: "Biometrics",
    estimatedTime: "Varies; may be scheduled or reused",
    whatItMeans:
      "USCIS may collect fingerprints/photo/signature or reuse prior biometrics.",
    whatToCheck: "ASC appointment notice or biometrics reuse notice",
  },
  {
    situation: "USCIS review",
    estimatedTime: "Varies by workload and case facts",
    whatItMeans: "USCIS reviews your Form I-90 and evidence.",
    whatToCheck: "USCIS Form I-90 processing times and case status",
  },
  {
    situation: "RFE, if issued",
    estimatedTime: "Can add weeks or months",
    whatItMeans: "USCIS needs more information before deciding.",
    whatToCheck: "RFE deadline and requested documents",
  },
  {
    situation: "Card production and mailing",
    estimatedTime: "After approval",
    whatItMeans: "USCIS produces and mails the new card.",
    whatToCheck: "Case status updates such as card produced, card mailed, or tracking",
  },
  {
    situation: "Outside normal processing time",
    estimatedTime: "Only after USCIS says the case is outside normal time",
    whatItMeans: "You may be able to submit a USCIS inquiry.",
    whatToCheck: "USCIS Processing Times tool and inquiry date",
  },
];

/* ─────────────────── Stage rows (detailed "Stages Explained") ───────────── */

export const greenCardRenewalStageColumns: EstimateColumn[] = [
  { key: "step", label: "Step" },
  { key: "estimatedTime", label: "Estimated time", emphasize: true },
  { key: "whatHappens", label: "What happens" },
  { key: "whatToCheck", label: "What to check" },
];

export const greenCardRenewalStageRows: EstimateRow[] = [
  {
    step: "Form I-90 submitted",
    estimatedTime: "Filing day",
    whatHappens: "You file online or by mail and pay the fee or request a fee waiver.",
    whatToCheck: "Confirmation screen or mailing receipt",
  },
  {
    step: "Receipt notice",
    estimatedTime: "Usually days to a few weeks after filing",
    whatHappens:
      "USCIS issues Form I-797C. For eligible renewals, it may extend green card validity.",
    whatToCheck: "Receipt number, extension language, and USCIS account",
    highlight: true,
  },
  {
    step: "Biometrics, if required",
    estimatedTime: "Varies",
    whatHappens: "USCIS may collect fingerprints/photo/signature, or reuse prior biometrics.",
    whatToCheck: "Biometrics appointment notice or reuse notice",
  },
  {
    step: "USCIS review",
    estimatedTime: "Varies by USCIS workload",
    whatHappens: "An officer reviews the application and evidence.",
    whatToCheck: "Case status and official processing times for Form I-90",
  },
  {
    step: "Request for evidence, if issued",
    estimatedTime: "Adds time; depends on response deadline",
    whatHappens: "USCIS asks for more documentation before deciding.",
    whatToCheck: "RFE notice, requested documents, and deadline",
  },
  {
    step: "Card production",
    estimatedTime: "After approval",
    whatHappens: "USCIS approves and orders your new permanent resident card.",
    whatToCheck: "Card is being produced / Case approved status",
  },
  {
    step: "Card mailed",
    estimatedTime: "After production",
    whatHappens: "USPS delivers your new green card.",
    whatToCheck: "Tracking and card mailed status",
    highlight: true,
  },
];

/* ──────── Processing-time page: competitor-style simple estimate ────────── */

export const processingCompetitorColumns: EstimateColumn[] = [
  { key: "category", label: "Green card category" },
  { key: "estimatedTime", label: "Estimated processing time", emphasize: true },
  { key: "fasterPath", label: "Faster path?" },
  { key: "source", label: "Official source" },
];

export const processingCompetitorRows: EstimateRow[] = [
  {
    category: "10-year green card renewal",
    estimatedTime: "About 8–14 months planning range",
    fasterPath: "Expedite only in limited USCIS-approved situations",
    source: "USCIS Form I-90 processing times",
    highlight: true,
  },
  {
    category: "Lost / stolen / damaged replacement",
    estimatedTime: "Varies; often similar to I-90 renewal",
    fasterPath: "Temporary proof may help urgent travel/work/DMV needs, but does not guarantee faster card production",
    source: "USCIS Replace Your Green Card",
  },
  {
    category: "RFE issued",
    estimatedTime: "Adds time",
    fasterPath: "Respond completely and by the deadline",
    source: "USCIS case notice",
  },
  {
    category: "Outside normal processing time",
    estimatedTime: "Inquiry may be available after the USCIS date threshold",
    fasterPath: "Submit an inquiry only when eligible",
    source: "USCIS Processing Times",
  },
];

/* ──────────────── Renew online: online timeline estimate ────────────────── */

export const onlineTimelineColumns: EstimateColumn[] = [
  { key: "step", label: "Step" },
  { key: "estimatedTime", label: "Estimated time", emphasize: true },
];

export const onlineTimelineRows: EstimateRow[] = [
  { step: "Confirm Form I-90 is right", estimatedTime: "Before filing" },
  { step: "Create / sign in to USCIS account", estimatedTime: "Same day" },
  { step: "Complete Form I-90", estimatedTime: "Same day to a few days" },
  { step: "Upload evidence if needed", estimatedTime: "Same day to a few days" },
  { step: "Pay fee or review fee waiver", estimatedTime: "Filing day" },
  { step: "Submit and save receipt", estimatedTime: "Filing day", highlight: true },
  { step: "Receipt notice", estimatedTime: "Usually days to a few weeks" },
  { step: "Biometrics if required", estimatedTime: "Varies" },
  { step: "USCIS review", estimatedTime: "Varies" },
  { step: "Card production / mailing", estimatedTime: "After approval" },
];

/* ────────────────── Fee page: fee + timing snapshot ─────────────────────── */

export const feeTimingColumns: EstimateColumn[] = [
  { key: "situation", label: "Situation" },
  { key: "estimatedCost", label: "Estimated cost", emphasize: true },
  { key: "timingImpact", label: "Timing impact" },
  { key: "whatToCheck", label: "What to check" },
];

export const feeTimingRows: EstimateRow[] = [
  { situation: "Online Form I-90 filing", estimatedCost: "Check USCIS Fee Schedule", timingImpact: "Filing day", whatToCheck: "USCIS G-1055", highlight: true },
  { situation: "Paper Form I-90 filing", estimatedCost: "Check USCIS Fee Schedule", timingImpact: "Mailing may add time", whatToCheck: "USCIS G-1055" },
  { situation: "Fee waiver request", estimatedCost: "Check eligibility", timingImpact: "May affect filing preparation", whatToCheck: "USCIS fee-waiver guidance (I-912)" },
  { situation: "USCIS error correction", estimatedCost: "Fee rules vary", timingImpact: "Depends on the case", whatToCheck: "Form I-90 instructions" },
  { situation: "Applicant error / lost card", estimatedCost: "Fee may apply", timingImpact: "Depends on the case", whatToCheck: "USCIS Fee Schedule" },
  { situation: "Conditional card", estimatedCost: "Different form and fee", timingImpact: "Different process", whatToCheck: "Do not assume I-90; review I-751 / I-829" },
];

/* ───────────── Replace page: replacement timeline estimate ──────────────── */

export const replacementTimingColumns: EstimateColumn[] = [
  { key: "reason", label: "Replacement reason" },
  { key: "estimatedTime", label: "Estimated timeline", emphasize: true },
  { key: "urgency", label: "Urgency note" },
  { key: "whatToCheck", label: "What to check" },
];

export const replacementTimingRows: EstimateRow[] = [
  { reason: "Lost green card", estimatedTime: "Similar to I-90 replacement timing", urgency: "May need temporary proof if urgent", whatToCheck: "USCIS case status and Form I-90 instructions", highlight: true },
  { reason: "Stolen green card", estimatedTime: "Similar to I-90 replacement timing", urgency: "Consider a police report for your records", whatToCheck: "Watch for identity-theft misuse" },
  { reason: "Damaged green card", estimatedTime: "Similar to I-90 replacement timing", urgency: "Keep the damaged card if available", whatToCheck: "USCIS instructions for returning the card" },
  { reason: "Incorrect card information", estimatedTime: "Timing varies", urgency: "Fee/evidence depends on the error reason", whatToCheck: "Whether USCIS or you caused the error" },
  { reason: "Name changed", estimatedTime: "Timing varies", urgency: "Prepare legal name-change evidence", whatToCheck: "Form I-90 instructions for name changes" },
  { reason: "Never received card", estimatedTime: "Timing and process may differ", urgency: "Possible time limits apply", whatToCheck: "USCIS non-delivery instructions" },
  { reason: "Need travel soon", estimatedTime: "Card timeline may not be fast enough", urgency: "High — check temporary proof options", whatToCheck: "ADIT/I-551 stamp and travel requirements", highlight: true },
];

/* ─────────────── I-90 vs I-751: timing + form choice ────────────────────── */

export const i90i751TimingColumns: EstimateColumn[] = [
  { key: "situation", label: "Situation" },
  { key: "usuallyUse", label: "Usually use", emphasize: true },
  { key: "timeline", label: "Timeline issue" },
  { key: "warning", label: "Warning" },
];

export const i90i751TimingRows: EstimateRow[] = [
  { situation: "10-year green card expiring", usuallyUse: "Form I-90", timeline: "Renewal processing time varies", warning: "Standard renewal", highlight: true },
  { situation: "10-year card lost / damaged", usuallyUse: "Form I-90", timeline: "Replacement processing time varies", warning: "Consider temporary proof if urgent" },
  { situation: "2-year conditional marriage card expiring", usuallyUse: "Form I-751", timeline: "Must remove conditions", warning: "Do not use I-90 for a regular renewal", highlight: true },
  { situation: "2-year investor conditional card expiring", usuallyUse: "Form I-829", timeline: "Separate process", warning: "Different from both I-90 and I-751" },
  { situation: "Not sure of card type", usuallyUse: "Check card validity period", timeline: "Confirm before filing", warning: "Wrong form can cause serious delay" },
];

/* ─────────────── Expired card: timeline + next steps ────────────────────── */

export const expiredTimingColumns: EstimateColumn[] = [
  { key: "situation", label: "Situation" },
  { key: "estimatedTime", label: "Estimated timing", emphasize: true },
  { key: "risk", label: "Risk level" },
  { key: "whatToCheck", label: "What to check" },
];

export const expiredTimingRows: EstimateRow[] = [
  { situation: "Card expired, regular 10-year card", estimatedTime: "File I-90 as soon as practical", risk: "Medium", whatToCheck: "Form I-90 renewal steps", highlight: true },
  { situation: "Card expiring within 6 months", estimatedTime: "Normal renewal planning window", risk: "Low / Medium", whatToCheck: "USCIS timing guidance before filing" },
  { situation: "Expired card and need work proof", estimatedTime: "Timing may be urgent", risk: "Medium / High", whatToCheck: "Receipt notice and I-9 options" },
  { situation: "Expired card and travel soon", estimatedTime: "Timing may be urgent", risk: "High", whatToCheck: "Temporary I-551/ADIT proof and travel rules" },
  { situation: "2-year conditional card expired", estimatedTime: "Not a normal I-90 renewal", risk: "High", whatToCheck: "I-751 or I-829 process" },
  { situation: "I-90 already filed", estimatedTime: "Depends on case", risk: "Depends", whatToCheck: "Receipt notice and USCIS case status" },
];
