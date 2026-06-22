/**
 * Pure logic for the Form 15CA / 15CB Checklist tool (no React, no DOM).
 *
 * A question-based *checklist*, not a calculator: it never decides which Form
 * 15CA part applies or computes any tax. It maps a few situational answers
 * (source of funds, taxability, TDS, amount band, AO certificate, records on
 * hand) to (a) the documents to collect, (b) whether a CA review is strongly
 * recommended, and (c) internal links. Everything is educational only — the
 * exact part of 15CA and whether a 15CB is required must be confirmed with a
 * CA and the bank.
 *
 * Tied to the "Form 15CA, 15CB & Repatriation Paperwork" cluster
 * (lib/repatriationCluster.ts).
 */

export type FundSource =
  | "property-sale"
  | "inheritance"
  | "rent"
  | "dividend-interest"
  | "shares-mf"
  | "gift"
  | "other";

export type YesNoUnsure = "yes" | "no" | "not-sure";
export type AmountBand = "under-5l" | "over-5l" | "not-sure";

export interface Form15Inputs {
  source: FundSource | "";
  taxableInIndia: YesNoUnsure | "";
  tdsDeducted: YesNoUnsure | "";
  amountBand: AmountBand | "";
  aoCertificate: YesNoUnsure | "";
  recordsReady: YesNoUnsure | "";
}

export const EMPTY_INPUTS: Form15Inputs = {
  source: "",
  taxableInIndia: "",
  tdsDeducted: "",
  amountBand: "",
  aoCertificate: "",
  recordsReady: "",
};

export const SOURCE_OPTIONS: { value: FundSource; label: string }[] = [
  { value: "property-sale", label: "Property-sale proceeds" },
  { value: "inheritance", label: "Inherited money" },
  { value: "rent", label: "Accumulated rent" },
  { value: "dividend-interest", label: "Dividend / interest income" },
  { value: "shares-mf", label: "Sale of shares / mutual funds" },
  { value: "gift", label: "Gift from parents / family" },
  { value: "other", label: "Other India income" },
];

export const YES_NO_UNSURE: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

export const AMOUNT_OPTIONS: { value: AmountBand; label: string }[] = [
  { value: "under-5l", label: "Up to ₹5 lakh this FY" },
  { value: "over-5l", label: "Over ₹5 lakh this FY" },
  { value: "not-sure", label: "Not sure" },
];

export const INTERNAL_LINKS: { href: string; label: string }[] = [
  {
    href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation",
    label: "Form 15CA & 15CB repatriation guide (pillar)",
  },
  { href: "/tools/form-10f-generator", label: "Form 10F generator (DTAA)" },
  {
    href: "/calculators/india-property-capital-gains",
    label: "India property capital-gains calculator",
  },
  {
    href: "/calculators/dtaa-foreign-tax-credit",
    label: "DTAA / foreign tax credit calculator",
  },
  {
    href: "/calculators/remittance-tcs-cost",
    label: "Remittance TCS calculator",
  },
  {
    href: "/india-tax-compliance/nri-tds-refund-usa",
    label: "NRI TDS refund from USA",
  },
  { href: "/india-tax-compliance", label: "India Tax & Compliance hub" },
];

export type ResultTone = "info" | "positive" | "caution" | "attention";

export interface Form15Result {
  ready: boolean;
  resultType: string;
  badge: string;
  tone: ResultTone;
  /** Headline next-step. */
  headline: string;
  /** A few sentences of context. */
  notes: string[];
  /** Whether a CA review is strongly recommended. */
  caReview: "strongly-recommended" | "recommended" | "likely-lighter";
  caReviewNote: string;
  /** Documents to collect. */
  documents: string[];
}

const COMMON_DOCS = [
  "PAN",
  "Passport / OCI (NRI status)",
  "NRO bank statement for the source account",
  "Source-of-funds proof for the relevant credits",
  "Form 26AS / AIS",
  "Bank repatriation / outward-remittance request form",
];

const SOURCE_DOCS: Record<FundSource, string[]> = {
  "property-sale": [
    "Sale deed (the consideration)",
    "Purchase deed and cost records",
    "Capital-gains computation",
    "Form 16B (buyer's TDS certificate)",
  ],
  inheritance: [
    "Inheritance evidence — will / succession certificate / legal-heir proof",
    "Proof the underlying asset's tax was handled",
  ],
  rent: [
    "Rent agreement and rent-received records",
    "Proof rent was offered to tax / TDS handled (Form 16A if applicable)",
  ],
  "dividend-interest": [
    "Dividend and interest statements",
    "TDS certificates (Form 16A) and challans",
  ],
  "shares-mf": [
    "Broker / AMC capital-gains statements",
    "Cost / purchase records for the securities sold",
    "TDS proof, if any",
  ],
  gift: [
    "Gift documentation / declaration and the giver's details",
    "Note: a large gift may raise US-side Form 3520 questions — keep records",
  ],
  other: [
    "Documentation of the income source",
    "Any TDS certificates and challans",
  ],
};

/** Minimum inputs to show a useful result. */
export function isReady(inputs: Form15Inputs): boolean {
  return Boolean(inputs.source && inputs.taxableInIndia);
}

export function evaluate(inputs: Form15Inputs): Form15Result {
  if (!isReady(inputs)) {
    return {
      ready: false,
      resultType: "incomplete",
      badge: "Fill in the form",
      tone: "info",
      headline: "Answer a couple of questions to begin",
      notes: [
        "Pick your source of funds and whether it's taxable in India to see your document checklist and whether a CA review is strongly recommended.",
      ],
      caReview: "recommended",
      caReviewNote: "",
      documents: [],
    };
  }

  const source = inputs.source as FundSource;

  // Documents: common + source-specific + AO certificate if present.
  const documents = [...COMMON_DOCS, ...SOURCE_DOCS[source]];
  if (inputs.aoCertificate === "yes") {
    documents.push("Assessing Officer (AO) certificate / order");
  }

  // Decide CA-review strength and the 15CB hint.
  // Non-taxable + small → lighter; taxable or large or unsure → stronger.
  const taxableUnclear =
    inputs.taxableInIndia === "yes" || inputs.taxableInIndia === "not-sure";
  const largeOrUnsure =
    inputs.amountBand === "over-5l" || inputs.amountBand === "not-sure";

  let caReview: Form15Result["caReview"];
  let caReviewNote: string;
  let tone: ResultTone;
  let badge: string;
  let headline: string;
  let resultType: string;
  const notes: string[] = [];

  if (inputs.taxableInIndia === "no" && inputs.amountBand === "under-5l") {
    caReview = "likely-lighter";
    resultType = "non-taxable-small";
    badge = "Likely lighter paperwork";
    tone = "positive";
    headline = "Non-taxable and small — paperwork is usually lighter";
    caReviewNote =
      "For a small, non-taxable remittance a 15CB is often not required and a part of Form 15CA may suffice — but the correct part and any exemption must still be confirmed with your CA and bank.";
    notes.push(
      "You still file the relevant part of Form 15CA where required and satisfy the bank's FEMA documentation.",
      "Keep records for your US return, FBAR, and FATCA."
    );
  } else if (taxableUnclear && largeOrUnsure) {
    caReview = "strongly-recommended";
    resultType = "taxable-large";
    badge = "CA review strongly recommended";
    tone = "attention";
    headline = "Taxable and above the threshold — get a CA review";
    caReviewNote =
      "Taxable remittances above the commonly-cited ₹5 lakh financial-year threshold often need a Form 15CB CA certificate before filing the relevant part of Form 15CA. Confirm the current threshold, the correct 15CA part, and whether a 15CB is required with your CA and bank.";
    notes.push(
      "Book the CA early — the 15CB needs your source documents and time to certify.",
      "If a DTAA treaty rate applies, prepare Form 10F and your TRC."
    );
  } else {
    caReview = "recommended";
    resultType = "review-recommended";
    badge = "CA review recommended";
    tone = "caution";
    headline = "Confirm the 15CA part and 15CB need with a CA";
    caReviewNote =
      "Whether a Form 15CB is required, and which part of Form 15CA applies, depends on the exact amount and taxability for the current year. Confirm with your CA and bank before filing.";
    notes.push(
      "Reconcile your Form 26AS / AIS with the source income first.",
      "Have your bank's exact repatriation document list in hand before you file."
    );
  }

  if (inputs.tdsDeducted === "no" && taxableUnclear) {
    notes.push(
      "If this income is taxable but no TDS has been deducted, ask your CA how the tax should be accounted for before the remittance."
    );
  }
  if (inputs.aoCertificate === "yes") {
    notes.push(
      "You mentioned an AO certificate/order — that can change which 15CA part applies; have your CA factor it in."
    );
  }
  if (inputs.recordsReady === "no" || inputs.recordsReady === "not-sure") {
    notes.push(
      "Gather Form 26AS / AIS and your bank proof before approaching the bank — missing records are a common reason transfers stall."
    );
  }

  return {
    ready: true,
    resultType,
    badge,
    tone,
    headline,
    notes,
    caReview,
    caReviewNote,
    documents,
  };
}
