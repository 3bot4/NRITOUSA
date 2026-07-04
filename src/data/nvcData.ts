/**
 * NVC (National Visa Center) data — editable config for the NVC cluster
 * (/nvc-case-status, /what-is-nvc-case-number, /nvc-processing-time,
 *  /nvc-document-checklist-india, /nvc-public-inquiry).
 *
 * NVC is the Department of State stage that sits AFTER USCIS approves an
 * immigrant petition and BEFORE the consular interview — it applies to people
 * doing consular processing (interview abroad, e.g. at U.S. Embassy New Delhi
 * or Consulate Mumbai), not adjustment of status inside the U.S. (that is the
 * I-485 cluster).
 *
 * NVC and embassy timelines change constantly and are NOT guaranteed. The
 * ranges below are GENERAL PLANNING ESTIMATES, clearly labelled on-page. Always
 * verify the official NVC timeframes and CEAC before acting.
 *
 * HOW TO UPDATE: sanity-check the ranges against the official NVC timeframes
 * page (link below) and bump NVC_UPDATED in lib/nvcCluster.ts.
 */

/* ─────────────────────── official external sources ─────────────────────── */

export const nvcLinks = {
  /** Department of State — NVC landing page. */
  nvcHome:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc.html",
  /** NVC processing timeframes (how current NVC is on case creation & review). */
  nvcTimeframes:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc/nvc-timeframes.html",
  /** CEAC immigrant visa (IV) portal — where you check NVC status and upload. */
  ceac: "https://ceac.state.gov/IV/Login.aspx",
  /** NVC public inquiry form / contact page. */
  publicInquiry:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc/nvc-contact-information.html",
  /** NVC fees (AOS + IV fees) payment guidance. */
  fees: "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc/nvc-fees.html",
  /** DS-260 immigrant visa application. */
  ds260:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-1-submit-a-petition/step-2-begin-nvc-processing.html",
  /** Affidavit of Support (I-864) info. */
  affidavit:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-1-submit-a-petition/step-5-collect-financial-evidence-and-other-supporting-documents.html",
  /** Document finder — civil documents required per country. */
  documentFinder:
    "https://travel.state.gov/content/travel/en/us-visas/Visa-Reciprocity-and-Civil-Documents-by-Country.html",
} as const;

/* ─────────────────────── planning ranges (NOT guaranteed) ──────────────── */

export interface NvcProcessingData {
  /** Rough range for NVC to create a case & send the welcome letter after USCIS approval. */
  caseCreationWeeksLow: number;
  caseCreationWeeksHigh: number;
  /** Rough range for NVC to review a submitted document package (per review cycle). */
  docReviewWeeksLow: number;
  docReviewWeeksHigh: number;
  /** Rough range from documentarily qualified to an interview being scheduled. */
  dqToInterviewMonthsLow: number;
  dqToInterviewMonthsHigh: number;
}

export const nvcProcessingData: NvcProcessingData = {
  caseCreationWeeksLow: 2,
  caseCreationWeeksHigh: 8,
  docReviewWeeksLow: 2,
  docReviewWeeksHigh: 12,
  dqToInterviewMonthsLow: 1,
  dqToInterviewMonthsHigh: 12,
};

/** Standard educational data-source note reused across the NVC cluster. */
export const NVC_DATA_NOTE =
  "These are general planning ranges only — NVC and embassy timelines change constantly and are never guaranteed. Interview scheduling depends on appointment availability at your embassy or consulate. Always verify the official NVC timeframes and check CEAC.";

/* ─────────────────────── the NVC stages, in order ──────────────────────── */

export interface NvcStage {
  /** Stable id used for anchor jump-links (#stage-...). */
  id: string;
  label: string;
  /** One-line "what this stage means". */
  meaning: string;
  /** What to do while you are here. */
  next: string;
}

export const nvcStages: NvcStage[] = [
  {
    id: "uscis-approved",
    label: "USCIS approved my petition",
    meaning:
      "USCIS approved the immigrant petition (I-130, I-140, etc.) and forwards the approved case to the National Visa Center for pre-processing.",
    next: "Wait for USCIS to physically send the case to NVC — this handoff itself can take a few weeks.",
  },
  {
    id: "waiting-welcome",
    label: "Waiting for NVC welcome letter",
    meaning:
      "NVC has (or soon will) create your case and issue a welcome letter or email with your NVC case number and invoice ID.",
    next: "Watch email and physical mail. Nothing to submit yet — you need the case number first.",
  },
  {
    id: "case-number",
    label: "Received NVC case number",
    meaning:
      "You have your NVC case number and invoice ID and can log in to the CEAC immigrant visa portal.",
    next: "Log in to CEAC and start the process: pay fees, then complete DS-260 and upload documents.",
  },
  {
    id: "paying-fees",
    label: "Paying NVC fees",
    meaning:
      "The Affidavit of Support fee and the immigrant visa application fee are paid through CEAC before you can proceed.",
    next: "Pay both fees in CEAC; allow a business day or two for payment to clear before the next step unlocks.",
  },
  {
    id: "ds-260",
    label: "Completing DS-260",
    meaning:
      "Each applicant completes the online DS-260 immigrant visa application in CEAC.",
    next: "Complete and submit DS-260 for every family member on the case.",
  },
  {
    id: "uploading-docs",
    label: "Uploading civil & financial documents",
    meaning:
      "You upload the Affidavit of Support, financial evidence, and civil documents (birth, marriage, police certificates, passport, etc.) to CEAC.",
    next: "Upload clear, complete documents for each applicant. Check the country-specific document requirements.",
  },
  {
    id: "docs-submitted",
    label: "Documents submitted",
    meaning:
      "Your package is submitted and waiting for NVC to review it. NVC reviews in the order received.",
    next: "Wait for NVC review. Do not submit duplicates — that can slow the review.",
  },
  {
    id: "documentarily-qualified",
    label: "Documentarily qualified (DQ)",
    meaning:
      "NVC accepted your documents and the case is documentarily qualified — it is ready for the interview stage and waits for an appointment.",
    next: "Wait for interview scheduling by NVC / the embassy. Keep documents and passports valid.",
  },
  {
    id: "waiting-interview",
    label: "Waiting for interview letter",
    meaning:
      "Your DQ case is in the queue for an interview appointment at your embassy or consulate, based on availability and visa category.",
    next: "Watch for the interview appointment letter. Timing depends on embassy availability and priority date.",
  },
  {
    id: "interview-scheduled",
    label: "Interview scheduled",
    meaning:
      "An interview date has been set. You complete the medical exam and gather original documents for the interview.",
    next: "Book your medical exam, gather originals, and follow your embassy's specific interview instructions.",
  },
];
