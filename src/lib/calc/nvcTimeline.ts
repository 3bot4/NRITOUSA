/**
 * NVC timeline estimation.
 *
 * Turns an I-130 approval date into dated ranges for each stage. Pure
 * functions, UTC-only dates (see i751Window.ts for why), no React.
 *
 * ⚠️ THE HONESTY CONSTRAINT: these are ESTIMATES built from the planning ranges
 * in src/data/nvcData.ts, not predictions and not a schedule. The Department of
 * State publishes exactly two dated facts — which day's case creation and which
 * day's document review NVC is currently working on — and those are surfaced
 * separately, as facts. Everything this module produces is a range and must be
 * rendered as one.
 */

import { nvcProcessingData } from "@/data/nvcData";
import { parseIsoDate, addDays, addMonths, toIso, daysBetween } from "@/lib/calc/i751Window";

export type StageId =
  | "case-creation"
  | "fees-ds260"
  | "document-review"
  | "documentarily-qualified"
  | "interview";

export interface StageEstimate {
  id: StageId;
  label: string;
  /** What actually happens here. */
  detail: string;
  /** Earliest plausible date, ISO. Null when it depends on the applicant. */
  earliest: string | null;
  latest: string | null;
  /** True when the stage moves at the applicant's pace, not NVC's. */
  selfPaced: boolean;
}

export interface NvcEstimate {
  approvalDate: string;
  /** Provided by the user, or null. */
  documentsSubmitted: string | null;
  stages: StageEstimate[];
  /** Earliest and latest plausible interview dates, ISO. */
  interviewEarliest: string;
  interviewLatest: string;
}

/**
 * How long we assume a well-organised applicant takes over the self-paced
 * middle — paying two fees and filling in the DS-260. Deliberately modest and
 * labelled as self-paced in the output: a family that takes three months to
 * gather documents from India is not "delayed", they are the cause.
 */
export const SELF_PACED_DAYS = { low: 14, high: 60 };

const W = 7;

export function estimateNvcTimeline(
  approvalDateIso: string,
  documentsSubmittedIso?: string
): NvcEstimate | null {
  const approval = parseIsoDate(approvalDateIso);
  if (approval === null) return null;

  const submitted = documentsSubmittedIso
    ? parseIsoDate(documentsSubmittedIso)
    : null;
  // A submission date before the approval date is not usable; ignore it rather
  // than producing a timeline that runs backwards.
  const usableSubmitted = submitted !== null && submitted >= approval ? submitted : null;

  const d = nvcProcessingData;

  const creationEarliest = addDays(approval, d.caseCreationWeeksLow * W);
  const creationLatest = addDays(approval, d.caseCreationWeeksHigh * W);

  const selfPacedEarliest = addDays(creationEarliest, SELF_PACED_DAYS.low);
  const selfPacedLatest = addDays(creationLatest, SELF_PACED_DAYS.high);

  // Once documents are actually submitted, review runs from that real date
  // rather than from an estimate stacked on an estimate.
  const reviewStartEarliest = usableSubmitted ?? selfPacedEarliest;
  const reviewStartLatest = usableSubmitted ?? selfPacedLatest;

  const reviewEarliest = addDays(reviewStartEarliest, d.docReviewWeeksLow * W);
  const reviewLatest = addDays(reviewStartLatest, d.docReviewWeeksHigh * W);

  const interviewEarliest = addMonths(reviewEarliest, d.dqToInterviewMonthsLow);
  const interviewLatest = addMonths(reviewLatest, d.dqToInterviewMonthsHigh);

  const stages: StageEstimate[] = [
    {
      id: "case-creation",
      label: "NVC creates your case",
      detail:
        "USCIS ships the approved petition to NVC, which creates the case and sends a welcome letter with your case number and invoice ID. Nothing you do speeds this up.",
      earliest: toIso(creationEarliest),
      latest: toIso(creationLatest),
      selfPaced: false,
    },
    {
      id: "fees-ds260",
      label: "You pay the fees and file the DS-260",
      detail:
        "Two fees through CEAC, then the immigrant visa application, then the civil documents and the affidavit of support. This stage moves entirely at your pace.",
      earliest: usableSubmitted ? null : toIso(selfPacedEarliest),
      latest: usableSubmitted ? null : toIso(selfPacedLatest),
      selfPaced: true,
    },
    {
      id: "document-review",
      label: "NVC reviews what you submitted",
      detail:
        "Reviewed roughly in the order received. A missing or unclear document sends the package back and the queue position resets — which is why one careful submission beats a fast one.",
      earliest: toIso(reviewEarliest),
      latest: toIso(reviewLatest),
      selfPaced: false,
    },
    {
      id: "documentarily-qualified",
      label: "Documentarily qualified",
      detail:
        "NVC has accepted everything. The case now waits for an interview slot — and, in a preference category, for the priority date to be current.",
      earliest: toIso(reviewEarliest),
      latest: toIso(reviewLatest),
      selfPaced: false,
    },
    {
      id: "interview",
      label: "Consular interview",
      detail:
        "Scheduled by NVC at your post. For India that is the immigrant visa unit at the US Consulate General in Mumbai.",
      earliest: toIso(interviewEarliest),
      latest: toIso(interviewLatest),
      selfPaced: false,
    },
  ];

  return {
    approvalDate: toIso(approval),
    documentsSubmitted: usableSubmitted === null ? null : toIso(usableSubmitted),
    stages,
    interviewEarliest: toIso(interviewEarliest),
    interviewLatest: toIso(interviewLatest),
  };
}

/** Whole months between two ISO dates, for a "roughly N months from now" line. */
export function monthsBetween(fromIso: string, toIsoDate: string): number | null {
  const a = parseIsoDate(fromIso);
  const b = parseIsoDate(toIsoDate);
  if (a === null || b === null) return null;
  return Math.max(0, Math.round(daysBetween(a, b) / 30.44));
}
