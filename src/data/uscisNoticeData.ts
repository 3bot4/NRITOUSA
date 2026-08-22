/**
 * Single source of truth for the FACTS shown by the USCIS Notice Decoder
 * (/tools/uscis-notice-decoder).
 *
 * Two very different kinds of number live here, and the distinction matters:
 *
 *  1. REGULATORY CAPS (`noticeDeadlineRules`) — these come from the text of
 *     8 CFR and only change when the regulation itself is amended. They are
 *     NOT part of the monthly verified-numbers rotation in
 *     siteWideVerifiedNumbers.ts, because putting stable regulatory text into
 *     a 45-day staleness audit generates noise rather than signal. Re-check
 *     them when a rule change is announced, not on a calendar.
 *
 *  2. AGENCY STATISTICS (`rfeReality`) — USCIS publishes these once per fiscal
 *     year in its H-1B Petitions Annual Report to Congress. Each figure is
 *     stamped with the fiscal year it describes, so it self-dates: an FY2024
 *     number labelled "FY2024" does not silently rot the way an unlabelled
 *     "8%" would. Refresh when the next fiscal year's report publishes.
 *
 * ⚠️  A DATE IS NOT EVIDENCE — the same rule as siteWideVerifiedNumbers.ts.
 * Do not bump `lastVerified` without actually reopening the cited source.
 *
 * NOTE ON SOURCING: uscis.gov returns 403 to automated fetches, so the CFR
 * text below was verified against Cornell LII's mirror of the eCFR (a verbatim
 * reproduction) and cross-checked against a second independent reading of the
 * same subsection. The USCIS statistics were read out of the official PDF
 * report linked in `source`. See CLAUDE.md → "Known gotchas".
 *
 * This is general educational information, NOT legal advice. The deadline
 * PRINTED ON YOUR NOTICE always controls — these are the regulatory maximums
 * USCIS cannot exceed, not a promise of how long you personally have.
 */

export const USCIS_NOTICE_VERIFIED = "2026-08-21";

export const uscisNoticeSources = [
  {
    label: "8 CFR 103.2(b)(8) — RFE / NOID response periods",
    href: "https://www.law.cornell.edu/cfr/text/8/103.2",
  },
  {
    label: "8 CFR 103.8(b) — service by mail",
    href: "https://www.law.cornell.edu/cfr/text/8/103.8",
  },
  {
    label: "USCIS — Form I-797: Types and Functions",
    href: "https://www.uscis.gov/forms/filing-guidance/form-i-797-types-and-functions",
  },
  {
    label: "USCIS — FY2024 H-1B Petitions Annual Report to Congress",
    href: "https://www.uscis.gov/sites/default/files/document/legal-docs/ola_signed_fy2024_h1b_petitions.pdf",
  },
];

export const USCIS_NOTICE_DISCLAIMER =
  "The response date printed on your own notice always controls. These are the maximum periods USCIS may allow under federal regulation — many notices give less. Rules change; verify at uscis.gov and consult a licensed immigration attorney.";

/* ───────────────────────── 1. Regulatory deadline caps ──────────────────── */

export interface NoticeDeadlineRule {
  /** Short label, e.g. "Request for Evidence (RFE)". */
  label: string;
  /** The headline cap as USCIS/the CFR expresses it, e.g. "12 weeks". */
  cap: string;
  /** Same cap converted to days, for people counting on a calendar. */
  capDays: number;
  /** Days once the standard mail-service addition is applied. */
  withMailingDays: number;
  /** The regulation that sets the cap. */
  cite: string;
  /** Plain-English note on what the cap does and does not mean. */
  note: string;
}

export const noticeDeadlineRules: NoticeDeadlineRule[] = [
  {
    label: "Request for Evidence (RFE)",
    cap: "12 weeks",
    capDays: 84,
    withMailingDays: 87,
    cite: "8 CFR 103.2(b)(8)(iv)",
    note:
      'The regulation says "in no case shall the maximum response period provided in a request for evidence exceed twelve weeks." USCIS routinely gives less, and some forms (I-539, I-601A) run on a 30-day period instead.',
  },
  {
    label: "Notice of Intent to Deny (NOID)",
    cap: "30 days",
    capDays: 30,
    withMailingDays: 33,
    cite: "8 CFR 103.2(b)(8)(iv)",
    note:
      "The same subsection caps a NOID at thirty days — a NOID is both more serious than an RFE and gives you well under half the time, which is why it needs an attorney immediately.",
  },
];

/**
 * The single most-missed fact about both deadlines, and the reason people file
 * a day late: extra time is not available for the asking.
 */
export const noExtensionRule = {
  text:
    "Additional time to respond to a request for evidence or notice of intent to deny may not be granted.",
  cite: "8 CFR 103.2(b)(8)(iv)",
} as const;

export const mailingRule = {
  addedDays: 3,
  text:
    "When USCIS serves a notice by mail, 3 days are added to the response period, and service is complete upon mailing — the clock starts the day it goes in the mail, not the day it reaches you.",
  cite: "8 CFR 103.8(b)",
} as const;

/* ───────────────────────── 2. How common is an RFE? ─────────────────────── */

/**
 * Context for the single most anxiety-producing notice. Figures describe H-1B
 * adjudications specifically — they are NOT an all-forms RFE rate, and the
 * copy that renders them must say so.
 */
export const rfeReality = {
  fiscalYear: "FY2024",
  rfesIssued: "33,393",
  petitionsCompleted: "407,625",
  overallRatePct: "8%",
  initialEmploymentRatePct: "13%",
  note:
    "Petitions for initial employment drew an RFE more often than petitions to continue existing employment.",
  source:
    "https://www.uscis.gov/sites/default/files/document/legal-docs/ola_signed_fy2024_h1b_petitions.pdf",
  sourceName: "USCIS, FY2024 H-1B Petitions Annual Report to Congress",
} as const;

/* ───────────────────────── 3. The I-797 decode key ──────────────────────── */

export interface I797Variant {
  code: string;
  name: string;
  meaning: string;
  /** The thing people most often get wrong about this variant. */
  gotcha?: string;
}

/**
 * USCIS uses one form number for many unrelated messages, which is exactly why
 * a notice is hard to read: the letter suffix carries the meaning. Sourced from
 * the official "Form I-797: Types and Functions" page.
 */
export const i797Variants: I797Variant[] = [
  {
    code: "I-797",
    name: "Approval Notice",
    meaning: "Approval of an application or petition.",
    gotcha: "An approval notice is not a visa and not status by itself.",
  },
  {
    code: "I-797A",
    name: "Replacement I-94",
    meaning:
      "Issued to an applicant already in the US as a replacement Form I-94, carrying the new status and its validity dates on a tear-off at the bottom.",
    gotcha:
      "The tear-off I-94 is the part that proves status — do not detach and lose it.",
  },
  {
    code: "I-797B",
    name: "Alien worker petition approval",
    meaning:
      "Approval of a worker petition where the beneficiary will be processed abroad rather than adjusting status inside the US.",
    gotcha:
      "Unlike an I-797A it carries NO I-94, because it does not grant status inside the US — the next step is consular processing.",
  },
  {
    code: "I-797C",
    name: "Notice of Action",
    meaning:
      "The workhorse: receipt, rejection, transfer, reopening, and appointment notices (biometrics, interview, reschedule) all arrive as an I-797C.",
    gotcha:
      "An I-797C is never an approval — this is the single most common misreading of a USCIS notice.",
  },
  {
    code: "I-797D",
    name: "Benefit card carrier",
    meaning: "The letter a benefit card (such as an EAD) is attached to.",
  },
  {
    code: "I-797E",
    name: "Request for Evidence",
    meaning: "Issued to request evidence — this is what an RFE arrives as.",
    gotcha: "Has a hard deadline; see the RFE cap above.",
  },
  {
    code: "I-797F",
    name: "Transportation Letter",
    meaning: "Issued overseas to allow an applicant to travel to the US.",
  },
];
