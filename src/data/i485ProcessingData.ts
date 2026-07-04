/**
 * I-485 (Adjustment of Status) data — editable config for the I-485 cluster
 * (/i485-processing-time, /i485-timeline, /i485-documents-checklist).
 *
 * I-485 times vary a lot by field office and whether an interview is required,
 * so the ranges below are GENERAL PLANNING ESTIMATES, clearly labelled on-page —
 * never guaranteed times. For India/China employment cases, the dominant wait is
 * the Visa Bulletin priority-date backlog BEFORE you can even file, which this
 * config does not attempt to predict (use the visa bulletin tools).
 *
 * HOW TO UPDATE: sanity-check the ranges against egov.uscis.gov/processing-times
 * (Form I-485) and bump `lastUpdated`.
 */

export interface I485ProcessingData {
  lastUpdated: string;
  uscisProcessingTimesUrl: string;
  visaBulletinUrl: string;
  i485FormUrl: string;

  /** General planning range for I-485 adjudication after filing, months. */
  standardMonthsLow: number;
  standardMonthsHigh: number;
  /** Extra months to plan for when a field-office interview is required. */
  interviewExtraMonthsLow: number;
  interviewExtraMonthsHigh: number;
}

export const i485ProcessingData: I485ProcessingData = {
  lastUpdated: "Sanity-check against current USCIS I-485 times",
  uscisProcessingTimesUrl: "https://egov.uscis.gov/processing-times/",
  visaBulletinUrl:
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
  i485FormUrl: "https://www.uscis.gov/i-485",

  standardMonthsLow: 8,
  standardMonthsHigh: 20,
  interviewExtraMonthsLow: 2,
  interviewExtraMonthsHigh: 6,
};

/** I-485 document checklist groups (educational; USCIS instructions govern). */
export interface ChecklistGroup {
  title: string;
  items: string[];
}

export const i485Checklist: ChecklistGroup[] = [
  {
    title: "Core forms",
    items: [
      "Form I-485 (Application to Register Permanent Residence or Adjust Status)",
      "Form I-485 filing fee (verify current amount on USCIS)",
      "Form I-693 medical exam (sealed, by a USCIS-designated civil surgeon)",
      "Form I-765 (EAD) and Form I-131 (Advance Parole), if filing concurrently",
    ],
  },
  {
    title: "Proof of eligibility",
    items: [
      "Approved (or concurrently filed) I-140 approval notice / receipt",
      "Proof your priority date is current under the Visa Bulletin chart in use",
      "Copy of the underlying petition and priority date evidence",
    ],
  },
  {
    title: "Identity & status",
    items: [
      "Two passport-style photos (per current USCIS specs)",
      "Birth certificate (with certified translation if not in English)",
      "Passport biographic page and all U.S. visa stamps",
      "Copies of all I-94 records and prior I-797 approval notices",
      "Evidence of continuous lawful status (H-1B/L-1 pay stubs, notices)",
    ],
  },
  {
    title: "Supporting documents",
    items: [
      "Marriage certificate and dependents' documents (for family members)",
      "Form I-864 or employment/ability-to-pay evidence, if requested",
      "Any prior immigration filings relevant to admissibility",
      "Court/police records if there is any arrest history (with attorney guidance)",
    ],
  },
];

/** Standard educational data-source note for the I-485 cluster. */
export const I485_DATA_NOTE =
  "Data source: USCIS Form I-485 processing times and the Department of State Visa Bulletin. Times are estimates that vary by office and change; verify on USCIS and follow the official form instructions.";

/* ─────────────── I-485 stage planning estimate (Fast Answer) ────────────── */

/**
 * General planning ranges for the I-485 (adjustment of status) journey, shown as
 * the top "Fast Answer" on I-485 cluster pages. Planning estimates only — they
 * vary widely by field office, category, and visa availability. For Indian
 * EB-2/EB-3 the dominant wait is the Visa Bulletin BEFORE you can file.
 * lastVerified: 2026-07-04.
 */
export const I485_ESTIMATE_VERIFIED = "2026-07-04";

export interface I485EstimateRow {
  stage: string;
  estimatedTime: string;
  whatToCheck?: string;
  notes?: string;
  highlight?: boolean;
}

export const i485StageEstimateRows: I485EstimateRow[] = [
  { stage: "Receipt notice (I-797C)", estimatedTime: "Days to a few weeks", whatToCheck: "USCIS account / mail", notes: "Confirms USCIS received your I-485." },
  { stage: "Biometrics appointment", estimatedTime: "1–3 months", whatToCheck: "Appointment notice", notes: "Varies by ASC; can be reused in some cases." },
  { stage: "EAD / Advance Parole (if filed together)", estimatedTime: "Several months", whatToCheck: "I-765 / I-131 status", notes: "Lets you work/travel while I-485 is pending." },
  { stage: "Interview (if required)", estimatedTime: "Field-office dependent", whatToCheck: "Local office processing times", notes: "Many employment cases are waived; some offices require it." },
  { stage: "Employment-based I-485 decision", estimatedTime: "Months to 2+ years", whatToCheck: "USCIS Processing Times", notes: "Broad range by office, category, and visa availability.", highlight: true },
  { stage: "Indian EB-2 / EB-3 (before filing)", estimatedTime: "Visa Bulletin-gated", whatToCheck: "Monthly Visa Bulletin", notes: "The priority-date backlog is usually the main delay." },
];

export const i485EstimateSourceLinks: { label: string; href: string }[] = [
  { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
  { label: "USCIS Case Status", href: "https://egov.uscis.gov/" },
  { label: "Visa Bulletin", href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
];

export const I485_ESTIMATE_DISCLAIMER =
  "General planning ranges only — I-485 times vary widely by field office, category, and visa availability, and change over time. There is no premium processing for I-485. Not legal advice; verify with USCIS before relying on any date.";
