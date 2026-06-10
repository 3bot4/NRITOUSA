/**
 * Educational FBAR / FATCA (Form 8938) review helper.
 *
 * This module deliberately never says "you must file." It maps a user's
 * answers to careful, educational language — "review likely needed",
 * "may not be triggered", "more information needed" — plus a document
 * checklist and CPA question list. All evaluation is client-side; nothing
 * the user enters is stored or transmitted.
 *
 * Threshold sources (verify before each tax season — thresholds can change):
 *  - FBAR: 31 CFR 1010.350 / FinCEN Form 114 — aggregate foreign financial
 *    accounts over $10,000 at any time in the calendar year.
 *  - FATCA: IRS Form 8938 instructions ("Reporting thresholds"). As of the
 *    2025 instructions: living in the US — unmarried/MFS $50k year-end /
 *    $75k any time, MFJ $100k / $150k; living abroad — unmarried/MFS
 *    $200k / $300k, MFJ $400k / $600k. These match data/fbar-fatca.json,
 *    which is the single source of truth read below.
 */

import fbarData from "../../data/fbar-fatca.json";

/* ------------------------------------------------------------------ *
 * Input options
 * ------------------------------------------------------------------ */

export type UsPersonStatus =
  | "citizen"
  | "green-card"
  | "resident-alien"
  | "not-sure"
  | "no";

export type FilingStatus = "single" | "mfj" | "mfs" | "hoh" | "not-sure";
export type Residence = "us" | "abroad" | "not-sure";
export type YesNoUnsure = "yes" | "no" | "not-sure";

export const US_PERSON_OPTIONS: { value: UsPersonStatus; label: string }[] = [
  { value: "citizen", label: "US citizen" },
  { value: "green-card", label: "Green card holder" },
  { value: "resident-alien", label: "Resident alien for tax purposes" },
  { value: "not-sure", label: "Not sure" },
  { value: "no", label: "No" },
];

export const FILING_STATUS_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "mfj", label: "Married filing jointly" },
  { value: "mfs", label: "Married filing separately" },
  { value: "hoh", label: "Head of household" },
  { value: "not-sure", label: "Not sure" },
];

export const RESIDENCE_OPTIONS: { value: Residence; label: string }[] = [
  { value: "us", label: "Living in the USA" },
  { value: "abroad", label: "Living outside the USA" },
  { value: "not-sure", label: "Split year / not sure" },
];

export type AccountTypeId =
  | "savings"
  | "nre"
  | "nro"
  | "fd"
  | "brokerage"
  | "mutual-funds"
  | "demat"
  | "pension"
  | "business"
  | "other";

export interface AccountTypeOption {
  id: AccountTypeId;
  label: string;
  /** What to gather / discuss for this account type. */
  reviewNote: string;
}

export const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    id: "savings",
    label: "Indian savings account",
    reviewNote:
      "Regular resident savings accounts count toward FBAR/FATCA totals — including old accounts you rarely use.",
  },
  {
    id: "nre",
    label: "NRE account",
    reviewNote:
      "NRE accounts are foreign accounts for US reporting even though the interest is tax-free in India.",
  },
  {
    id: "nro",
    label: "NRO account",
    reviewNote:
      "NRO accounts count toward reporting totals, and NRO interest is generally taxable income on a US return.",
  },
  {
    id: "fd",
    label: "Fixed deposits / FDs",
    reviewNote:
      "Each FD is its own account for reporting — collect maturity values, highest balances, and accrued interest per FD.",
  },
  {
    id: "brokerage",
    label: "Indian brokerage account",
    reviewNote:
      "Brokerage accounts count, and holdings inside them may raise extra questions (PFIC) worth asking a CPA about.",
  },
  {
    id: "mutual-funds",
    label: "Indian mutual funds",
    reviewNote:
      "Indian mutual funds typically count for FBAR/FATCA and are often treated as PFICs — a complex area where professional advice matters most.",
  },
  {
    id: "demat",
    label: "Demat account",
    reviewNote:
      "Demat accounts holding shares count toward reporting totals — gather year-end and highest-value statements.",
  },
  {
    id: "pension",
    label: "Foreign pension / retirement account",
    reviewNote:
      "Foreign retirement accounts (e.g. PPF/EPF) often count for FBAR and FATCA — treatment varies, so flag them for your CPA.",
  },
  {
    id: "business",
    label: "Business account",
    reviewNote:
      "Business accounts you own — or merely have signature authority over — can require reporting; bring ownership details to your CPA.",
  },
  {
    id: "other",
    label: "Other",
    reviewNote:
      "Other foreign financial accounts or assets (e.g. insurance policies with cash value) may count — list them all for review.",
  },
];

/* ------------------------------------------------------------------ *
 * Inputs / outputs
 * ------------------------------------------------------------------ */

export interface CheckerInputs {
  usPerson: UsPersonStatus;
  filingStatus: FilingStatus;
  residence: Residence;
  /** Highest combined value of all foreign financial accounts (USD), null = not entered. */
  maxAccountsUsd: number | null;
  accountTypes: AccountTypeId[];
  hasOtherAssets: YesNoUnsure;
  /** Highest combined value of foreign financial assets (USD), null = not entered. */
  maxAssetsUsd: number | null;
  signatureAuthority: YesNoUnsure;
  taxYear: number;
}

export type FbarStatus =
  | "review-likely"
  | "under-threshold"
  | "more-info"
  | "not-us-person";

export type FatcaStatus =
  | "review-likely"
  | "depends-on-year-end"
  | "under-threshold"
  | "more-info"
  | "not-us-person";

export type AttentionLevel = "low" | "medium" | "high";

/** Broad result label sent to analytics. Never includes amounts. */
export type TrackedResultType =
  | "fbar_review_likely"
  | "fbar_under_threshold"
  | "fatca_review_likely"
  | "more_info_needed";

export interface FatcaThresholdRow {
  residence: Residence;
  label: string;
  endOfYearUsd: number;
  anyTimeUsd: number;
}

export interface CheckerResult {
  fbar: { status: FbarStatus; headline: string; detail: string };
  fatca: {
    status: FatcaStatus;
    headline: string;
    detail: string;
    /** The threshold row that applies to the user's answers, if determinable. */
    applicable: FatcaThresholdRow | null;
  };
  attention: { level: AttentionLevel; label: string; factors: string[] };
  checklist: {
    accountNotes: { label: string; note: string }[];
    documents: string[];
    cpaQuestions: string[];
  };
  trackedResult: TrackedResultType;
}

/* ------------------------------------------------------------------ *
 * Thresholds (read from data/fbar-fatca.json — the source of truth)
 * ------------------------------------------------------------------ */

export const FBAR_THRESHOLD_USD: number = fbarData.fbar.thresholdUsd;
export const FBAR_FORM = fbarData.fbar.form;
export const FBAR_DEADLINE = fbarData.fbar.deadline;
export const FATCA_FORM = fbarData.fatca.form;
export const DATA_STAMP = {
  lastUpdated: fbarData.lastUpdated,
  source: fbarData.source,
  sourceLabel: fbarData.sourceLabel,
};

function jsonThreshold(filing: string): { endOfYearUsd: number; anyTimeUsd: number } {
  const row = fbarData.fatca.thresholds.find((t) => t.filing === filing);
  if (!row) throw new Error(`Missing FATCA threshold row: ${filing}`);
  return row;
}

/** All four simplified Form 8938 threshold rows, for the helper table. */
export const FATCA_THRESHOLD_TABLE: FatcaThresholdRow[] = [
  {
    residence: "us",
    label: "Living in USA — Single / Married filing separately",
    ...jsonThreshold("single-us-resident"),
  },
  {
    residence: "us",
    label: "Living in USA — Married filing jointly",
    ...jsonThreshold("married-joint-us-resident"),
  },
  {
    residence: "abroad",
    label: "Living abroad — Single / Married filing separately",
    ...jsonThreshold("single-abroad"),
  },
  {
    residence: "abroad",
    label: "Living abroad — Married filing jointly",
    ...jsonThreshold("married-joint-abroad"),
  },
];

function applicableFatcaRow(i: CheckerInputs): FatcaThresholdRow | null {
  if (i.residence === "not-sure" || i.filingStatus === "not-sure") return null;
  // Head of household and single use the "unmarried" thresholds in the
  // Form 8938 instructions; MFS shares the same numbers.
  const joint = i.filingStatus === "mfj";
  return (
    FATCA_THRESHOLD_TABLE.find(
      (r) => r.residence === i.residence && (joint ? /jointly/.test(r.label) : !/jointly/.test(r.label))
    ) ?? null
  );
}

/* ------------------------------------------------------------------ *
 * Evaluation
 * ------------------------------------------------------------------ */

const NOT_US_PERSON_NOTE =
  "FBAR and FATCA generally apply to US persons (citizens, green card holders, and resident aliens for tax purposes). If you are not a US person, these rules usually do not apply to you — but residency status itself can be complex, so verify if your situation is borderline.";

function evaluateFbar(i: CheckerInputs): CheckerResult["fbar"] {
  if (i.usPerson === "no") {
    return {
      status: "not-us-person",
      headline: "FBAR generally applies to US persons",
      detail: NOT_US_PERSON_NOTE,
    };
  }
  if (i.usPerson === "not-sure" || i.maxAccountsUsd === null) {
    return {
      status: "more-info",
      headline: "More information needed",
      detail:
        i.usPerson === "not-sure"
          ? "FBAR applies to US persons, and your US tax status is the first thing to pin down — the substantial presence test or green card status usually decides it. A CPA can confirm this quickly."
          : "Enter the highest combined value of all your foreign financial accounts at any point during the year to see how it compares with the FBAR review threshold.",
    };
  }
  if (i.maxAccountsUsd > FBAR_THRESHOLD_USD) {
    return {
      status: "review-likely",
      headline: "FBAR review likely needed",
      detail: `FBAR rules generally focus on whether the combined value of foreign financial accounts exceeded $${FBAR_THRESHOLD_USD.toLocaleString(
        "en-US"
      )} at any time during the calendar year. The amount you entered is above that level, so you may want to review FBAR (${FBAR_FORM}) requirements and consult a qualified tax professional. Typical deadline: ${FBAR_DEADLINE}.`,
    };
  }
  return {
    status: "under-threshold",
    headline: "FBAR may not be triggered by the amount entered",
    detail: `The amount you entered is at or below the $${FBAR_THRESHOLD_USD.toLocaleString(
      "en-US"
    )} aggregate level FBAR rules generally focus on. Still verify if your situation is complex — the test uses the highest combined value across all accounts at any moment in the year, including accounts you may have forgotten, joint accounts, and accounts you only have signature authority over.`,
  };
}

function evaluateFatca(i: CheckerInputs): CheckerResult["fatca"] {
  if (i.usPerson === "no") {
    return {
      status: "not-us-person",
      headline: "FATCA reporting generally applies to US persons",
      detail: NOT_US_PERSON_NOTE,
      applicable: null,
    };
  }
  const applicable = applicableFatcaRow(i);
  const assetValue = i.maxAssetsUsd ?? i.maxAccountsUsd;
  if (i.usPerson === "not-sure" || applicable === null || assetValue === null) {
    return {
      status: "more-info",
      headline: "More information needed",
      detail:
        "Form 8938 thresholds depend on your filing status, where you live, and the value of your foreign financial assets. Fill in those answers (or check the threshold table below) to see which level may apply to you. If you are unsure of your filing status or residency, that is a good first question for a CPA.",
      applicable,
    };
  }
  if (assetValue > applicable.anyTimeUsd) {
    return {
      status: "review-likely",
      headline: "FATCA / Form 8938 review likely needed",
      detail: `For "${applicable.label}", Form 8938 thresholds are generally more than $${applicable.endOfYearUsd.toLocaleString(
        "en-US"
      )} on the last day of the year or more than $${applicable.anyTimeUsd.toLocaleString(
        "en-US"
      )} at any time during the year. The value you entered is above the any-time level, so you may want to review Form 8938 requirements with a qualified tax professional. Thresholds can change and depend on your exact situation.`,
      applicable,
    };
  }
  if (assetValue > applicable.endOfYearUsd) {
    return {
      status: "depends-on-year-end",
      headline: "May depend on your year-end value",
      detail: `The value you entered is below the any-time threshold ($${applicable.anyTimeUsd.toLocaleString(
        "en-US"
      )}) but above the last-day-of-year threshold ($${applicable.endOfYearUsd.toLocaleString(
        "en-US"
      )}) for "${applicable.label}". Whether Form 8938 review is needed may turn on what your assets were worth on December 31 — worth checking your year-end statements and confirming with a CPA.`,
      applicable,
    };
  }
  return {
    status: "under-threshold",
    headline: "Form 8938 may not be triggered by the amount entered",
    detail: `The value you entered is below the Form 8938 thresholds for "${applicable.label}" (more than $${applicable.endOfYearUsd.toLocaleString(
      "en-US"
    )} on the last day of the year, or more than $${applicable.anyTimeUsd.toLocaleString(
      "en-US"
    )} at any time). "Specified foreign financial assets" is a broad and technical category though — still verify if you hold assets beyond ordinary bank accounts. Note that FBAR has a much lower, separate threshold.`,
    applicable,
  };
}

const PFIC_TYPES: AccountTypeId[] = ["mutual-funds", "brokerage", "demat"];

function evaluateAttention(
  i: CheckerInputs,
  fbar: CheckerResult["fbar"],
  fatca: CheckerResult["fatca"]
): CheckerResult["attention"] {
  if (i.usPerson === "no") {
    return {
      level: "low",
      label: "Low attention",
      factors: [
        "You answered that you are not a US person — these rules usually focus on US persons.",
      ],
    };
  }
  let score = 0;
  const factors: string[] = [];
  if (i.usPerson === "not-sure") {
    score += 2;
    factors.push("Your US tax status is unclear — settle this first; everything else depends on it.");
  }
  if (fbar.status === "review-likely") {
    score += 1;
    factors.push("Combined foreign account value above the $10,000 FBAR review level.");
  }
  if (fatca.status === "review-likely") {
    score += 2;
    factors.push("Foreign asset value above the Form 8938 any-time threshold for your situation.");
  } else if (fatca.status === "depends-on-year-end") {
    score += 1;
    factors.push("Foreign asset value close to the Form 8938 thresholds — year-end value matters.");
  }
  if (i.accountTypes.length >= 3) {
    score += 1;
    factors.push("Several different account types — more statements to gather and more chances to miss one.");
  }
  if (i.signatureAuthority === "yes") {
    score += 1;
    factors.push("Signature authority over an account you don't own — FBAR can reach these accounts too.");
  } else if (i.signatureAuthority === "not-sure") {
    factors.push("Unsure about signature authority — worth clarifying (e.g. a parent's account you can operate).");
  }
  if (i.accountTypes.some((t) => PFIC_TYPES.includes(t))) {
    score += 2;
    factors.push("Indian mutual funds / brokerage / demat holdings — these can raise PFIC questions, a genuinely complex area.");
  }
  if (i.hasOtherAssets === "yes" || i.hasOtherAssets === "not-sure") {
    factors.push("Foreign financial assets beyond bank accounts — the Form 8938 asset definition is broader than FBAR's.");
  }

  const level: AttentionLevel = score >= 5 ? "high" : score >= 2 ? "medium" : "low";
  const label =
    level === "high"
      ? "High attention — needs careful review"
      : level === "medium"
        ? "Medium attention — worth a careful look"
        : "Low attention";
  if (factors.length === 0) {
    factors.push("Nothing in your answers stands out — keep good records and re-check yearly as balances grow.");
  }
  return { level, label, factors };
}

function buildChecklist(i: CheckerInputs): CheckerResult["checklist"] {
  const selected = ACCOUNT_TYPE_OPTIONS.filter((o) =>
    i.accountTypes.includes(o.id)
  );
  const accountNotes = selected.map((o) => ({ label: o.label, note: o.reviewNote }));

  const documents = [
    `Year-end (Dec 31, ${i.taxYear}) statements for every foreign account`,
    `Highest-balance records for each account during ${i.taxYear} (not just year-end)`,
    "Interest and dividend income records for each account",
    "Bank/institution names, addresses, and account numbers (for your own forms — never share these with online tools)",
    "Dates each account was opened or closed during the year",
    "INR→USD conversion notes — use one consistent rate source (e.g. the US Treasury year-end rate) and write down which you used",
  ];
  if (i.accountTypes.includes("fd")) {
    documents.push("FD advice slips / receipts showing principal, maturity value, and renewal dates");
  }
  if (i.accountTypes.some((t) => PFIC_TYPES.includes(t))) {
    documents.push("Mutual fund / demat holding statements with purchase dates and NAVs (useful if PFIC analysis is needed)");
  }
  if (i.signatureAuthority === "yes") {
    documents.push("Details of accounts you can sign on but don't own (whose account, your role, highest balance)");
  }

  const cpaQuestions = [
    `Am I a US person for tax purposes for ${i.taxYear}, given my visa/green card and days in the US?`,
    "Based on my highest combined balances, do I need to file the FBAR (FinCEN Form 114), Form 8938, or both?",
    "Which of my Indian accounts and assets count toward each threshold?",
    "What exchange rate should I use to convert INR balances to USD?",
  ];
  if (i.accountTypes.some((t) => PFIC_TYPES.includes(t))) {
    cpaQuestions.push("Are my Indian mutual funds or demat holdings PFICs, and what would that mean for my return?");
  }
  if (i.accountTypes.includes("pension")) {
    cpaQuestions.push("How are my PPF/EPF or other foreign retirement accounts treated for US reporting and tax?");
  }
  if (i.signatureAuthority !== "no") {
    cpaQuestions.push("Does signature authority over a family member's or employer's account create an FBAR obligation for me?");
  }
  cpaQuestions.push("If anything was missed in earlier years, what are my options for catching up (e.g. streamlined procedures)?");

  return { accountNotes, documents, cpaQuestions };
}

function trackedResultFor(
  fbar: CheckerResult["fbar"],
  fatca: CheckerResult["fatca"]
): TrackedResultType {
  if (fatca.status === "review-likely") return "fatca_review_likely";
  if (fbar.status === "review-likely") return "fbar_review_likely";
  if (fbar.status === "under-threshold") return "fbar_under_threshold";
  return "more_info_needed";
}

export function evaluateChecker(i: CheckerInputs): CheckerResult {
  const fbar = evaluateFbar(i);
  const fatca = evaluateFatca(i);
  return {
    fbar,
    fatca,
    attention: evaluateAttention(i, fbar, fatca),
    checklist: buildChecklist(i),
    trackedResult: trackedResultFor(fbar, fatca),
  };
}

/** Tax-year dropdown: current year plus the previous five. */
export function taxYearOptions(currentYear: number): number[] {
  return Array.from({ length: 6 }, (_, k) => currentYear - k);
}
