/**
 * USCIS delay assessment — pure logic for the rebuilt delay checker.
 *
 * WHAT CHANGED AND WHY
 *
 * The previous checker produced a "within normal range" or "delayed" verdict
 * from a receipt MONTH plus a hardcoded editorial range per form type. Every
 * part of that was unsound:
 *
 *   · The ranges ("3–8 months", "8–18 months") were not sourced to any dated
 *     USCIS publication and disagreed with figures elsewhere on the same page.
 *   · A missing receipt date produced "less than a month" — the most confident
 *     possible answer from no data at all.
 *   · Processing location was inferred from a receipt-number prefix, which does
 *     not work for IOE (electronic) receipts or for transferred cases.
 *   · A transfer was treated as restarting the clock. It does not.
 *   · The receipt-year selector only went back five years, so genuinely
 *     long-pending cases could not be entered.
 *
 * WHAT IT DOES NOW
 *
 * USCIS publishes, for each form/subtype/office, a CASE INQUIRY DATE. That
 * date — not the displayed processing time — is the official test for whether a
 * case is outside normal processing time. So the checker asks the user to read
 * their inquiry date off the official tool and enter it. With it, the verdict
 * is arithmetic against an official figure. Without it, there is no verdict:
 * the checker says so rather than inventing one.
 *
 * Not legal advice.
 */

import { uscisExplainers } from "@/data/uscisProcessingData";

export type DelayVerdict =
  | "incomplete" // not enough input to say anything
  | "no-official-date" // enough case data, but no inquiry date → no verdict
  | "within" // receipt date is on/after the inquiry date → not yet outside
  | "outside"; // receipt date is before the inquiry date → may inquire

export interface DelayInputs {
  /** Exact form number, e.g. "I-129". */
  form: string;
  /** Subtype / classification, where the form has them. */
  subtype: string;
  /** Office or service center, where applicable. */
  office: string;
  /** EXACT receipt date (YYYY-MM-DD) from the I-797C receipt notice. */
  receiptDate: string;
  /**
   * The case inquiry date returned by the official USCIS processing-times tool
   * for this exact form + subtype + office.
   */
  inquiryDate: string;
  /** Has the case been transferred to another office? */
  transferred: "yes" | "no" | "";
}

export const DELAY_EMPTY: DelayInputs = {
  form: "",
  subtype: "",
  office: "",
  receiptDate: "",
  inquiryDate: "",
  transferred: "",
};

export interface DelayResult {
  verdict: DelayVerdict;
  headline: string;
  badge: string;
  tone: "neutral" | "positive" | "caution" | "attention";
  summary: string;
  /** Days between receipt date and inquiry date; null when not computable. */
  daysBeyond: number | null;
  /** Elapsed time since receipt — only ever shown with a real receipt date. */
  elapsedLabel: string | null;
  nextSteps: string[];
  notes: string[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseIsoDate(v: string): Date | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null; // rejects 2026-02-31 and friends
  }
  return dt;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/** "1 year 4 months" from a day count. Never returns "less than a month". */
export function elapsedLabel(from: Date, to: Date): string {
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  if (months < 0) return "a future date";
  if (months === 0) {
    const d = daysBetween(from, to);
    return `${d} day${d === 1 ? "" : "s"}`;
  }
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} month${rem === 1 ? "" : "s"}`;
  const y = `${years} year${years === 1 ? "" : "s"}`;
  return rem === 0 ? y : `${y} ${rem} month${rem === 1 ? "" : "s"}`;
}

/**
 * Assess whether a case is outside normal processing time.
 *
 * The only verdict this function will ever produce about delay is derived from
 * the user's own official case inquiry date. It never compares against an
 * editorial range, and it never fills in a missing date.
 */
export function assessDelay(
  inp: DelayInputs,
  now: Date = new Date(),
): DelayResult {
  const notes: string[] = [];
  const receipt = parseIsoDate(inp.receiptDate);
  const inquiry = parseIsoDate(inp.inquiryDate);

  if (inp.transferred === "yes") {
    notes.push(uscisExplainers.transferReceiptDate);
    notes.push(uscisExplainers.nbcTransfer);
  }

  /* ---- Not enough to say anything ------------------------------------- */
  const haveCaseBasics = Boolean(inp.form && inp.receiptDate);
  if (!haveCaseBasics || !receipt) {
    return {
      verdict: "incomplete",
      headline: inp.receiptDate && !receipt
        ? "That receipt date could not be read"
        : "Enter your form and exact receipt date",
      badge: "Incomplete",
      tone: "neutral",
      summary:
        inp.receiptDate && !receipt
          ? "Enter the receipt date exactly as printed on your I-797C receipt notice, as a full calendar date. A partial or malformed date cannot produce an elapsed time, and this checker will not estimate one."
          : "This checker needs the exact form and the exact receipt date printed on your I-797C receipt notice. Without a receipt date there is no elapsed time to report — and it will not guess one.",
      daysBeyond: null,
      elapsedLabel: null,
      nextSteps: [
        "Find your I-797C receipt notice and read the form number and receipt date off it.",
      ],
      notes,
    };
  }

  const elapsed = elapsedLabel(receipt, now);

  /* ---- Have the case, but no official inquiry date --------------------- */
  if (!inquiry) {
    return {
      verdict: "no-official-date",
      headline: "No verdict without your official case inquiry date",
      badge: "Need the official date",
      tone: "caution",
      summary: `Your case has been pending ${elapsed}. That is elapsed time, not a verdict: whether a case is outside normal processing time is determined by the case inquiry date USCIS publishes for your exact form, subtype and office. This page does not hold those dates — they are per-office and change monthly — so it will not tell you whether you are delayed until you enter yours.`,
      daysBeyond: null,
      elapsedLabel: elapsed,
      nextSteps: [
        "Open the official USCIS processing-times tool.",
        "Select your exact form, subtype/classification and the office or service center handling your case.",
        "Read the case inquiry date it returns and enter it above.",
      ],
      notes,
    };
  }

  const daysBeyond = daysBetween(receipt, inquiry);

  /* ---- Receipt on or after the inquiry date → not yet outside ---------- */
  if (daysBeyond <= 0) {
    return {
      verdict: "within",
      headline: "Not yet outside normal processing time",
      badge: "Within",
      tone: "positive",
      summary: `Your case was received on ${inp.receiptDate} and the case inquiry date you entered is ${inp.inquiryDate}. Because your receipt date is not earlier than the inquiry date, USCIS would treat an outside-normal-processing-time inquiry as premature. Your case has been pending ${elapsed}.`,
      daysBeyond,
      elapsedLabel: elapsed,
      nextSteps: [
        "Re-check the inquiry date monthly — it moves.",
        "Keep your address updated with USCIS so nothing is missed.",
      ],
      notes,
    };
  }

  /* ---- Receipt before the inquiry date → may submit an inquiry --------- */
  return {
    verdict: "outside",
    headline: "Outside normal processing time — you may submit an inquiry",
    badge: "Outside",
    tone: "attention",
    summary: `Your case was received on ${inp.receiptDate}, which is ${daysBeyond} day${daysBeyond === 1 ? "" : "s"} before the case inquiry date of ${inp.inquiryDate} that you entered. On USCIS's own test that puts your case outside normal processing time, so an inquiry should be accepted rather than declined as premature. Your case has been pending ${elapsed}.`,
    daysBeyond,
    elapsedLabel: elapsed,
    nextSteps: [
      "Submit an outside-normal-processing-time case inquiry through the USCIS e-Request system.",
      "Confirm first that USCIS has not sent a notice you have missed — an unanswered RFE is a more common explanation than a stalled queue.",
      "Check that your address on file is current.",
    ],
    notes,
  };
}
