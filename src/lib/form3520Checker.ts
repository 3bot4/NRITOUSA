/**
 * Pure logic for the "Form 3520 India Gift Checker" tool (no React, no DOM).
 *
 * This is an educational *screening / checklist*, not a tax calculator: it never
 * computes any tax or penalty figure. It maps situational inputs to:
 *   (a) a primary Form 3520 review result (with the threshold + tax year used),
 *   (b) FBAR/FATCA, PFIC, basis/valuation and worldwide-income review flags,
 *   (c) a tailored document checklist, and
 *   (d) questions to take to a cross-border CPA and an Indian CA.
 *
 * ALL threshold figures come from src/data/foreignGiftRules.ts — the single
 * source of truth shared with the pillar, cash-gift, and checklist pages. The
 * annually-indexed foreign corporation/partnership threshold is looked up by
 * tax year; an unconfigured year returns "verify current-year threshold" rather
 * than a guessed number.
 *
 * Donor/source categories are kept legally separate:
 *   - Nonresident individual & foreign estate → Part IV > $100,000 aggregate
 *   - Foreign corporation & foreign partnership → annually-indexed Part IV entity
 *   - Foreign trust → Part III foreign-trust review (NOT the $100,000 gift test)
 *
 * Everything is educational only. Tied to the "Foreign Gifts, Inheritance &
 * Form 3520" cluster (lib/giftsCluster.ts).
 */

import {
  form3520Rules,
  indiaGiftRemittanceRules,
  entityThresholdForYear,
  fmtUsd,
} from "@/data/foreignGiftRules";

export type YesNoUnsure = "yes" | "no" | "not-sure";

export type TransactionType = "gift" | "bequest" | "trust-distribution" | "not-sure";

export type SourceCategory =
  | "nonresident-individual"
  | "foreign-estate"
  | "foreign-corporation"
  | "foreign-partnership"
  | "foreign-trust"
  | "not-sure";

export type DonorRelationship = "parents" | "relative" | "non-relative";

export type AssetType =
  | "cash"
  | "property"
  | "mutual-fund"
  | "shares"
  | "gold"
  | "business-interest";

export type HeldWhere = "india" | "usa";

export interface Form3520Inputs {
  taxYear: number;
  usPerson: YesNoUnsure | "";
  transactionType: TransactionType | "";
  sourceCategory: SourceCategory | "";
  relationship: DonorRelationship | "";
  /** When false, the user chose the "amount not known" path. */
  amountKnown: boolean;
  /** Exact aggregate USD amount from this source for the tax year (or null). */
  aggregateUsd: number | null;
  relatedDonors: YesNoUnsure | "";
  assetType: AssetType | "";
  heldWhere: HeldWhere | "";
  generatedIncome: YesNoUnsure | "";
}

export const EMPTY_INPUTS: Form3520Inputs = {
  taxYear: 0, // set to the latest configured year by the UI on mount
  usPerson: "",
  transactionType: "",
  sourceCategory: "",
  relationship: "",
  amountKnown: true,
  aggregateUsd: null,
  relatedDonors: "",
  assetType: "",
  heldWhere: "",
  generatedIncome: "",
};

/* ----------------------------- UI option lists ---------------------------- */

export const YES_NO_UNSURE: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

export const TRANSACTION_TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "gift", label: "A gift" },
  { value: "bequest", label: "A bequest / inheritance" },
  { value: "trust-distribution", label: "A distribution from a foreign trust" },
  { value: "not-sure", label: "Not sure" },
];

export const SOURCE_CATEGORY_OPTIONS: { value: SourceCategory; label: string }[] = [
  { value: "nonresident-individual", label: "A nonresident individual (e.g. a parent)" },
  { value: "foreign-estate", label: "A foreign estate" },
  { value: "foreign-corporation", label: "A foreign corporation" },
  { value: "foreign-partnership", label: "A foreign partnership" },
  { value: "foreign-trust", label: "A foreign trust" },
  { value: "not-sure", label: "Not sure" },
];

export const DONOR_RELATIONSHIP_OPTIONS: { value: DonorRelationship; label: string }[] = [
  { value: "parents", label: "Parent(s)" },
  { value: "relative", label: "Other relative (sibling, grandparent, etc.)" },
  { value: "non-relative", label: "Friend / non-relative / other" },
];

export const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: "cash", label: "Cash / bank transfer" },
  { value: "property", label: "Real estate / property" },
  { value: "mutual-fund", label: "Mutual funds" },
  { value: "shares", label: "Shares / direct equities" },
  { value: "gold", label: "Gold / jewellery" },
  { value: "business-interest", label: "Business interest" },
];

export const HELD_WHERE_OPTIONS: { value: HeldWhere; label: string }[] = [
  { value: "usa", label: "Into a US account / in the USA" },
  { value: "india", label: "Into an Indian account / in India" },
];

/** Related guides & tools shown with every result (Phase 6 checker hierarchy). */
export const INTERNAL_LINKS: { href: string; label: string }[] = [
  {
    href: "/india-tax-compliance/foreign-gifts-inheritance-form-3520-india",
    label: "Foreign gifts & inheritance from India (pillar guide)",
  },
  {
    href: "/india-tax-compliance/gift-from-parents-india-to-usa",
    label: "Gift from parents in India to the USA",
  },
  {
    href: "/india-tax-compliance/form-3520-indian-gift-inheritance-checklist",
    label: "Form 3520 checklist",
  },
  { href: "/tools/fbar-fatca-checker", label: "FBAR / FATCA checker" },
  {
    href: "/articles/pfic-indian-mutual-funds-trap",
    label: "PFIC & Indian mutual funds guide",
  },
  {
    href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation",
    label: "Form 15CA / 15CB repatriation guide",
  },
];

/** Government sources surfaced with every result (explain first, then link). */
export const OFFICIAL_LINKS: { href: string; label: string }[] = [
  {
    href: form3520Rules.officialSourceUrls.largeGiftsOrBequests,
    label: "IRS — Gifts or bequests from foreign persons",
  },
  {
    href: form3520Rules.officialSourceUrls.form3520Instructions,
    label: "IRS — About Form 3520 & instructions",
  },
  {
    href: form3520Rules.officialSourceUrls.internationalPenalties,
    label: "IRS — International information reporting penalties",
  },
  {
    href: indiaGiftRemittanceRules.officialSourceUrls.incomeTaxTcs,
    label: "Income Tax Department (India) — TCS & Form 15CA/15CB",
  },
  {
    href: indiaGiftRemittanceRules.officialSourceUrls.rbiLrs,
    label: "RBI — Liberalised Remittance Scheme",
  },
];

export type FlagTone = "info" | "positive" | "caution" | "attention";

export interface ReviewFlag {
  key: "form3520" | "fbar" | "pfic" | "basis" | "income";
  label: string;
  tone: FlagTone;
  badge: string;
  lines: string[];
}

export interface Form3520Result {
  /** Whether enough required inputs are filled to show a meaningful result. */
  ready: boolean;
  /** Broad analytics label — NEVER contains an entered financial amount. */
  resultType: string;
  /** Primary Form 3520 result flag (always flags[0] when ready). */
  primary: ReviewFlag & { thresholdUsed: string; taxYearUsed: number };
  /** How related donors are treated for the threshold test. */
  relatedDonorTreatment: string;
  /** Additional review flags: FBAR/FATCA, PFIC, basis, worldwide income. */
  flags: ReviewFlag[];
  /** Tailored document checklist. */
  documents: string[];
  /** Questions to take to a CPA / CA. */
  questions: string[];
  /** Official government sources for this result. */
  officialLinks: { href: string; label: string }[];
  /** Date the underlying rules were last verified. */
  lastVerified: string;
}

/**
 * The trust path is driven by EITHER the source being a foreign trust OR the
 * transaction being a foreign-trust distribution — both route to Part III.
 */
function isTrustCase(inputs: Form3520Inputs): boolean {
  return (
    inputs.sourceCategory === "foreign-trust" ||
    inputs.transactionType === "trust-distribution"
  );
}

/** True once the minimum inputs to give a useful result are present. */
export function isReady(inputs: Form3520Inputs): boolean {
  if (!inputs.usPerson) return false;
  // Non-US / unsure short-circuits: no further inputs needed.
  if (inputs.usPerson === "no" || inputs.usPerson === "not-sure") return true;

  if (!inputs.transactionType || !inputs.sourceCategory) return false;
  if (!inputs.assetType || !inputs.heldWhere) return false;

  // Trust cases don't depend on an amount; other cases need an amount or the
  // explicit "amount not known" path.
  if (isTrustCase(inputs)) return true;
  if (inputs.amountKnown) {
    return inputs.aggregateUsd !== null && inputs.aggregateUsd >= 0;
  }
  return true;
}

/* --------------------------- Primary Form 3520 --------------------------- */
function primaryResult(
  inputs: Form3520Inputs
): ReviewFlag & { thresholdUsed: string; taxYearUsed: number } {
  const base = {
    key: "form3520" as const,
    label: "Form 3520",
    taxYearUsed: inputs.taxYear,
  };

  // US person = No.
  if (inputs.usPerson === "no") {
    return {
      ...base,
      tone: "positive",
      badge: "Likely N/A",
      thresholdUsed: "Not applicable to non-US persons",
      lines: [
        "Form 3520 may not apply based on your current US tax status, but tax residency can be fact-specific or change during the year. Confirm before relying on this result.",
      ],
    };
  }

  // US person = Not sure.
  if (inputs.usPerson === "not-sure") {
    return {
      ...base,
      tone: "caution",
      badge: "Determine residency first",
      thresholdUsed: "Determine US tax residency first",
      lines: [
        "Determine US tax residency before applying Form 3520 thresholds. Residency is not decided by visa type alone — a cross-border CPA can confirm your status for the year.",
      ],
    };
  }

  // Foreign trust → Part III review (NOT the $100,000 gift test).
  if (isTrustCase(inputs)) {
    return {
      ...base,
      tone: "attention",
      badge: "Foreign-trust review",
      thresholdUsed: "Not threshold-based — foreign-trust rules apply",
      lines: [
        "Foreign-trust distribution review — the ordinary $100,000 gift threshold is not the correct decision rule here. Form 3520 Part III and other foreign-trust rules (possibly Form 3520-A) may apply.",
        "This is the most complex case. Obtain specialist review from a cross-border CPA before acting.",
      ],
    };
  }

  // Source category still unknown → can't pick a threshold.
  if (inputs.sourceCategory === "not-sure") {
    return {
      ...base,
      tone: "caution",
      badge: "Identify the source",
      thresholdUsed: "Depends on the source category",
      lines: [
        "The correct threshold depends on who the source is. Identify whether the gift or bequest came from a nonresident individual, a foreign estate, a foreign corporation, or a foreign partnership to see the right decision rule.",
      ],
    };
  }

  const individualOrEstate =
    inputs.sourceCategory === "nonresident-individual" ||
    inputs.sourceCategory === "foreign-estate";

  // Nonresident individual / foreign estate → > $100,000 aggregate (Part IV).
  if (individualOrEstate) {
    const threshold = form3520Rules.individualOrForeignEstateThresholdUsd;
    const thresholdUsed = `${fmtUsd(threshold)} aggregate (nonresident individual / foreign estate, Part IV)`;

    if (!inputs.amountKnown || inputs.aggregateUsd === null) {
      return {
        ...base,
        tone: "caution",
        badge: "Add the aggregate",
        thresholdUsed,
        lines: [
          `Whether Form 3520 Part IV applies turns on your aggregate for the year from this source. The trigger is more than ${fmtUsd(threshold)} in total.`,
          "Enter the approximate aggregate USD amount to see a clearer result, and remember related donors are combined.",
        ],
      };
    }

    if (inputs.aggregateUsd > threshold) {
      return {
        ...base,
        tone: "attention",
        badge: "Likely Part IV review",
        thresholdUsed,
        lines: [
          `Likely Part IV filing review. Gifts and bequests from a nonresident individual or foreign estate are reported on Form 3520 when the year's total is more than ${fmtUsd(threshold)} — your aggregate is above that line.`,
          `Form 3520 is an information return (a disclosure), not a tax on the gift. Once the trigger is crossed, each separate gift above ${fmtUsd(form3520Rules.itemizationThresholdUsd)} must be identified individually. Confirm the current instructions and deadline with a CPA.`,
        ],
      };
    }

    return {
      ...base,
      tone: "positive",
      badge: "Below the threshold",
      thresholdUsed,
      lines: [
        `Below the ordinary Part IV individual/estate threshold based on your answers — the year's total is ${fmtUsd(threshold)} or less.`,
        "Keep records and review any related donors or other Form 3520 transactions: more gifts later in the year, or combining related donors, can still cross the line.",
      ],
    };
  }

  // Foreign corporation / partnership → annually-indexed entity threshold.
  const entity = entityThresholdForYear(inputs.taxYear);
  if (entity === null) {
    return {
      ...base,
      tone: "caution",
      badge: "Verify the threshold",
      thresholdUsed: `Verify the current-year entity threshold for ${inputs.taxYear}`,
      lines: [
        `The threshold for a purported gift from a foreign corporation or partnership is indexed annually, and tax year ${inputs.taxYear} is not configured here.`,
        "Verify the current-year figure in the Instructions for Form 3520 before relying on any result — do not assume last year's number.",
      ],
    };
  }

  const entityThresholdUsed = `${fmtUsd(entity)} (foreign corporation/partnership, tax year ${inputs.taxYear}, indexed annually)`;

  if (!inputs.amountKnown || inputs.aggregateUsd === null) {
    return {
      ...base,
      tone: "caution",
      badge: "Add the aggregate",
      thresholdUsed: entityThresholdUsed,
      lines: [
        `Purported gifts from a foreign corporation or partnership use a separate, much lower threshold — ${fmtUsd(entity)} for tax year ${inputs.taxYear}, indexed annually.`,
        "Enter the approximate aggregate USD amount to see whether you are above or below that figure.",
      ],
    };
  }

  if (inputs.aggregateUsd > entity) {
    return {
      ...base,
      tone: "attention",
      badge: "Likely Part IV review",
      thresholdUsed: entityThresholdUsed,
      lines: [
        `Likely Part IV filing review. Purported gifts from a foreign corporation or partnership are reported when the year's total exceeds ${fmtUsd(entity)} for tax year ${inputs.taxYear} — your aggregate is above that.`,
        "This is a lower, annually-indexed threshold that applies to entity gifts, not gifts from a parent. Confirm the current-year figure and entity-specific rules with a cross-border CPA.",
      ],
    };
  }

  return {
    ...base,
    tone: "positive",
    badge: "Below the threshold",
    thresholdUsed: entityThresholdUsed,
    lines: [
      `Below the foreign corporation/partnership threshold of ${fmtUsd(entity)} for tax year ${inputs.taxYear} based on your answers.`,
      "Keep records; the entity threshold is indexed and re-checked each year, so verify the current figure if amounts change.",
    ],
  };
}

/* ---------------------------- Related donors ----------------------------- */
function relatedDonorTreatment(inputs: Form3520Inputs): string {
  if (inputs.usPerson === "no" || inputs.usPerson === "not-sure") {
    return "Related-donor aggregation only matters once US-person status is confirmed.";
  }
  if (isTrustCase(inputs) || inputs.sourceCategory === "not-sure") {
    return "Related-donor aggregation applies to the individual/estate gift test, not to the foreign-trust review path.";
  }
  if (inputs.relatedDonors === "yes") {
    return "You indicated related donors — combine their gifts and bequests into a single aggregate for the threshold test (for example, both parents count together).";
  }
  if (inputs.relatedDonors === "no") {
    return "You indicated no related donors. If another parent or relative also gave you money this year, re-run with the combined total — related donors are aggregated.";
  }
  return "Related donors (for example, both parents) are combined into one aggregate for the threshold test. Confirm whether anyone else also gave you money this year.";
}

/* ---------------------------- FBAR / FATCA flag --------------------------- */
function fbarFlag(inputs: Form3520Inputs): ReviewFlag {
  const { heldWhere, assetType } = inputs;

  const isFinancialAccountOrSecurity =
    assetType === "cash" ||
    assetType === "mutual-fund" ||
    assetType === "shares";

  if (heldWhere === "india" && isFinancialAccountOrSecurity) {
    return {
      key: "fbar",
      label: "FBAR / FATCA",
      tone: "attention",
      badge: "Review flag",
      lines: [
        "The money or securities sit in an Indian financial account, so they count toward your FBAR (FinCEN 114) and FATCA (Form 8938) review. A filing is not automatically required — it depends on whether your aggregate balances cross the separate FBAR and Form 8938 thresholds.",
        "Run your accounts through the FBAR / FATCA checker and confirm the thresholds with a CPA.",
      ],
    };
  }

  if (heldWhere === "india" && (assetType === "property" || assetType === "gold")) {
    return {
      key: "fbar",
      label: "FBAR / FATCA",
      tone: "caution",
      badge: "Indirect",
      lines: [
        "Real estate and physical gold held directly are generally not FBAR/FATCA account items by themselves — but the Indian bank accounts that rent or sale proceeds flow into are.",
        "Once cash lands in an Indian account, review it against the FBAR/Form 8938 thresholds.",
      ],
    };
  }

  if (heldWhere === "india" && assetType === "business-interest") {
    return {
      key: "fbar",
      label: "FBAR / FATCA",
      tone: "caution",
      badge: "Review with CPA",
      lines: [
        "An interest in an Indian business may bring FATCA (Form 8938) reporting and other foreign-entity filings, and any related Indian accounts can be FBAR items.",
        "Foreign business interests carry their own US reporting — confirm the full picture with a cross-border CPA.",
      ],
    };
  }

  return {
    key: "fbar",
    label: "FBAR / FATCA",
    tone: "positive",
    badge: "Lower priority",
    lines: [
      "If the money landed in a US account and you do not hold Indian financial accounts because of it, this receipt by itself is unlikely to drive new FBAR/FATCA reporting.",
      "FBAR/FATCA still apply to any other Indian accounts you hold — check those separately if relevant.",
    ],
  };
}

/* ------------------------------- PFIC flag ------------------------------- */
function pficFlag(inputs: Form3520Inputs): ReviewFlag {
  if (inputs.assetType === "mutual-fund") {
    return {
      key: "pfic",
      label: "PFIC (Form 8621)",
      tone: "attention",
      badge: "Review before selling",
      lines: [
        "Indian mutual funds are generally PFICs for US tax. Holding and selling them can trigger Form 8621 and the punitive default ('excess distribution') rules — highest rates plus an interest charge.",
        "Do not reflexively sell or switch. Talk to a PFIC-experienced CPA first; elections like QEF or mark-to-market have strict timing.",
      ],
    };
  }

  if (inputs.assetType === "business-interest") {
    return {
      key: "pfic",
      label: "PFIC (Form 8621)",
      tone: "caution",
      badge: "Possible",
      lines: [
        "Depending on what the business holds and how it is structured, a foreign business interest could raise PFIC or other foreign-entity (e.g. Form 5471) questions.",
        "Have a cross-border CPA look at the structure before you act.",
      ],
    };
  }

  return {
    key: "pfic",
    label: "PFIC (Form 8621)",
    tone: "positive",
    badge: "Unlikely here",
    lines: [
      "PFIC mainly bites on pooled foreign funds like Indian mutual funds. Cash, direct shares, property, and gold are generally not PFICs themselves.",
      "If you also hold or inherited Indian mutual funds or ETFs, review those separately for PFIC.",
    ],
  };
}

/* --------------------------- Basis / income flags ------------------------ */
function extraFlags(inputs: Form3520Inputs): ReviewFlag[] {
  const flags: ReviewFlag[] = [];

  if (
    inputs.assetType === "property" ||
    inputs.assetType === "gold" ||
    inputs.assetType === "shares" ||
    inputs.assetType === "business-interest"
  ) {
    flags.push({
      key: "basis",
      label: "Cost basis & valuation",
      tone: "info",
      badge: "Keep valuations",
      lines: [
        "For a non-cash asset, your eventual capital gain depends on cost basis. A gifted asset generally takes a carryover basis (subject to special loss-basis rules); an inherited asset generally takes a date-of-death fair-market-value basis — under each country's own rules.",
        "Get a dated valuation near the gift or death date and keep the ownership/title records now — reconstructing them later is painful.",
      ],
    });
  }

  if (inputs.generatedIncome === "yes" || inputs.generatedIncome === "not-sure") {
    flags.push({
      key: "income",
      label: "Worldwide income",
      tone: "info",
      badge: "Report ongoing income",
      lines: [
        "Receiving the gift or bequest is generally not US-taxable income, but the income the asset earns afterward — interest, dividends, rent, capital gains — is taxable and reportable on your US return going forward.",
        "Coordinate the credit for any Indian tax with your CPA/CA under the India–US treaty (DTAA).",
      ],
    });
  }

  return flags;
}

/* ---------------------------- Documents & Qs ----------------------------- */
function buildDocuments(inputs: Form3520Inputs): string[] {
  const docs: string[] = [
    "Source details — name, relationship, and (for an entity) the type of entity",
    "The date and USD value of each gift / bequest",
    "Bank wire records on both the sending and receiving side",
  ];

  if (
    inputs.transactionType === "bequest" ||
    inputs.sourceCategory === "foreign-estate"
  ) {
    docs.push(
      "Death certificate of the person you inherited from",
      "Will / probate or, if intestate, succession documents",
      "Legal heir certificate establishing you as a lawful heir"
    );
  } else if (isTrustCase(inputs)) {
    docs.push(
      "Trust deed and beneficiary statement",
      "Distribution statement and trustee details",
      "Specialist CPA review of the trust's US treatment"
    );
  } else {
    docs.push("Gift deed / gift declaration (who gave what, when, relationship)");
  }

  switch (inputs.assetType) {
    case "property":
      docs.push(
        "Property title and the chain of ownership",
        "Original purchase deed and cost records",
        "Valuation report near the date of gift / inheritance"
      );
      break;
    case "mutual-fund":
      docs.push(
        "AMC / registrar statement — units, NAV, purchase and transfer dates",
        "Value at the date of gift / inheritance (for basis and PFIC)"
      );
      break;
    case "shares":
      docs.push(
        "Demat / holding statement and broker records",
        "Cost / purchase records and value at the date received"
      );
      break;
    case "gold":
      docs.push("Valuation report for the gold / jewellery (for basis)");
      break;
    case "business-interest":
      docs.push(
        "Ownership / shareholding documents for the business",
        "A valuation of the business interest at the date received"
      );
      break;
    default:
      break;
  }

  if (inputs.heldWhere === "india") {
    docs.push(
      "Indian bank statements showing the credits and source of funds",
      "Any bank/FEMA repatriation paperwork (Form 15CA / 15CB) if and when you move it to the US — depending on the remitter, source and route"
    );
  }

  return docs;
}

function buildQuestions(inputs: Form3520Inputs): string[] {
  const qs: string[] = [];

  if (inputs.usPerson === "not-sure") {
    qs.push(
      "Am I a US person for tax purposes this year (residency / dual-status), which decides whether Form 3520 applies?"
    );
  }

  if (isTrustCase(inputs)) {
    qs.push(
      "How is this foreign-trust distribution reported (Form 3520 Part III, and possibly Form 3520-A), and what is the least-bad treatment?"
    );
  } else {
    qs.push(
      "Did my year's aggregate from this source cross the correct Form 3520 threshold — and what is the deadline?",
      "Do I need to combine related donors (e.g. both parents) for the threshold test?"
    );
  }

  if (inputs.heldWhere === "india") {
    qs.push(
      "Do the Indian accounts involved push me over the FBAR or FATCA thresholds?",
      "If and when I move the money to the US, what documentation does my authorized dealer bank require (Form 15CA/15CB or otherwise) given the source and route?"
    );
  }

  if (inputs.assetType === "mutual-fund") {
    qs.push(
      "Are these PFICs needing Form 8621, and is a QEF / mark-to-market election worth it?",
      "What is the least-bad way and timing to exit the funds across both countries?"
    );
  }

  if (
    inputs.assetType === "property" ||
    inputs.assetType === "shares" ||
    inputs.assetType === "gold" ||
    inputs.assetType === "business-interest"
  ) {
    qs.push(
      "What is my cost basis for an eventual sale — carryover for a gift, or date-of-death value for an inheritance — under US and Indian rules?"
    );
  }

  if (inputs.generatedIncome === "yes" || inputs.generatedIncome === "not-sure") {
    qs.push(
      "How is the income this asset earns (interest, dividends, rent, gains) taxed and credited across both countries?"
    );
  }

  if (
    inputs.relationship === "parents" ||
    inputs.relationship === "relative"
  ) {
    qs.push(
      "Is this gift/inheritance exempt in India (gifts from specified relatives), and what proof should I keep?"
    );
  }

  return qs;
}

export function evaluate(inputs: Form3520Inputs): Form3520Result {
  const primary = primaryResult(inputs);

  if (!isReady(inputs)) {
    return {
      ready: false,
      resultType: "incomplete",
      primary,
      relatedDonorTreatment: "",
      flags: [],
      documents: [],
      questions: [],
      officialLinks: OFFICIAL_LINKS,
      lastVerified: form3520Rules.lastVerified,
    };
  }

  const flags: ReviewFlag[] = [fbarFlag(inputs), pficFlag(inputs), ...extraFlags(inputs)];

  // Broad analytics label built ONLY from categorical answers — never the
  // entered amount. `primary.badge` is the outcome category, not a dollar value.
  const resultType = [
    inputs.taxYear,
    inputs.transactionType || "?",
    inputs.sourceCategory || "?",
    inputs.assetType || "?",
    inputs.heldWhere || "?",
    primary.badge,
  ].join("|");

  return {
    ready: true,
    resultType,
    primary,
    relatedDonorTreatment: relatedDonorTreatment(inputs),
    flags,
    documents: buildDocuments(inputs),
    questions: buildQuestions(inputs),
    officialLinks: OFFICIAL_LINKS,
    lastVerified: form3520Rules.lastVerified,
  };
}
