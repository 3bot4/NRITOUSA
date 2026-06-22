/**
 * Pure logic for the "Form 3520 India Gift Checker" tool (no React, no DOM).
 *
 * This is a *checker / checklist*, not a tax calculator: it never computes any
 * tax, penalty, or threshold figure. It maps a few situational inputs (US-person
 * status, who gave it, donor type, approximate value band, asset type, where it
 * was received, and whether it generated income) to:
 *   (a) a Form 3520 review flag,
 *   (b) an FBAR / FATCA review flag,
 *   (c) a PFIC (Form 8621) review flag,
 *   (d) a tailored document checklist, and
 *   (e) questions to take to a cross-border CPA and an Indian CA.
 *
 * Everything is educational only. Tied to the "Parents, Gifts, Inheritance &
 * Form 3520" cluster (lib/giftsCluster.ts).
 *
 * Thresholds referenced (verify the current figures with a CPA / on irs.gov):
 *   - Gifts/bequests from a nonresident alien individual or foreign estate are
 *     reported on Form 3520 when the year's total exceeds US $100,000.
 *   - Gifts from a foreign corporation/partnership use a separate, much lower
 *     threshold the IRS adjusts annually for inflation (high five figures).
 */

export type YesNoUnsure = "yes" | "no" | "not-sure";

export type DonorRelationship = "parents" | "relative" | "non-relative";

export type DonorType = "individual" | "estate" | "company-partnership" | "trust";

export type AssetType =
  | "cash"
  | "property"
  | "mutual-fund"
  | "shares"
  | "gold"
  | "business-interest";

export type ValueBand = "under-20k" | "20k-100k" | "over-100k" | "not-sure";

export type ReceivedIn = "india" | "usa";

export interface Form3520Inputs {
  usPerson: YesNoUnsure | "";
  donorRelationship: DonorRelationship | "";
  donorType: DonorType | "";
  valueBand: ValueBand | "";
  assetType: AssetType | "";
  receivedIn: ReceivedIn | "";
  generatedIncome: YesNoUnsure | "";
}

export const EMPTY_INPUTS: Form3520Inputs = {
  usPerson: "",
  donorRelationship: "",
  donorType: "",
  valueBand: "",
  assetType: "",
  receivedIn: "",
  generatedIncome: "",
};

export const YES_NO_UNSURE: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

export const DONOR_RELATIONSHIP_OPTIONS: {
  value: DonorRelationship;
  label: string;
}[] = [
  { value: "parents", label: "Parent(s)" },
  { value: "relative", label: "Other relative (sibling, grandparent, etc.)" },
  { value: "non-relative", label: "Friend / non-relative / other" },
];

export const DONOR_TYPE_OPTIONS: { value: DonorType; label: string }[] = [
  { value: "individual", label: "An individual (a person)" },
  { value: "estate", label: "A deceased person's estate (inheritance)" },
  {
    value: "company-partnership",
    label: "A foreign company / partnership",
  },
  { value: "trust", label: "A foreign trust" },
];

export const VALUE_BAND_OPTIONS: { value: ValueBand; label: string }[] = [
  { value: "under-20k", label: "Under about $20,000" },
  { value: "20k-100k", label: "About $20,000 – $100,000" },
  { value: "over-100k", label: "Over $100,000" },
  { value: "not-sure", label: "Not sure" },
];

export const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: "cash", label: "Cash / bank transfer" },
  { value: "property", label: "Real estate / property" },
  { value: "mutual-fund", label: "Mutual funds" },
  { value: "shares", label: "Shares / direct equities" },
  { value: "gold", label: "Gold / jewellery" },
  { value: "business-interest", label: "Business interest" },
];

export const RECEIVED_IN_OPTIONS: { value: ReceivedIn; label: string }[] = [
  { value: "india", label: "Into an Indian account / in India" },
  { value: "usa", label: "Into a US account / in the USA" },
];

export const INTERNAL_LINKS: { href: string; label: string }[] = [
  {
    href: "/india-tax-compliance/foreign-gifts-inheritance-form-3520-india",
    label: "Gifts, inheritance & Form 3520 (hub)",
  },
  {
    href: "/india-tax-compliance/form-3520-indian-gift-inheritance-checklist",
    label: "Form 3520 checklist",
  },
  {
    href: "/india-tax-compliance/inherited-indian-mutual-funds-pfic",
    label: "Inherited Indian mutual funds & PFIC",
  },
  {
    href: "/india-tax-compliance/inherited-indian-property-us-tax",
    label: "Inherited Indian property & US tax",
  },
  { href: "/tools/fbar-fatca-checker", label: "FBAR / FATCA checker" },
  {
    href: "/tools/form-15ca-15cb-checklist",
    label: "15CA / 15CB repatriation checklist",
  },
  { href: "/india-tax-compliance", label: "India Tax & Compliance hub" },
];

export type FlagTone = "info" | "positive" | "caution" | "attention";

export interface ReviewFlag {
  key: "form3520" | "fbar" | "pfic";
  label: string;
  tone: FlagTone;
  badge: string;
  lines: string[];
}

export interface Form3520Result {
  /** Whether enough inputs are filled to show a meaningful result. */
  ready: boolean;
  /** Short label for analytics. */
  resultType: string;
  /** The three review flags, always in order: 3520, FBAR/FATCA, PFIC. */
  flags: ReviewFlag[];
  /** Tailored document checklist. */
  documents: string[];
  /** Questions to take to a CPA / CA. */
  questions: string[];
}

/** True once the minimum inputs to give a useful result are present. */
export function isReady(inputs: Form3520Inputs): boolean {
  return Boolean(
    inputs.usPerson && inputs.donorType && inputs.valueBand && inputs.assetType
  );
}

/* ----------------------------- Form 3520 flag ----------------------------- */
function form3520Flag(inputs: Form3520Inputs): ReviewFlag {
  // Not a US person → the Form 3520 reporting obligation generally doesn't apply.
  if (inputs.usPerson === "no") {
    return {
      key: "form3520",
      label: "Form 3520",
      tone: "positive",
      badge: "Likely N/A",
      lines: [
        "Form 3520 is a US-person reporting obligation. If you are not a US person for tax purposes, it generally does not apply to you for receiving this gift or bequest.",
        "If your US-person status is uncertain (e.g. visa-holder days, dual-status year), confirm it with a CPA before relying on this.",
      ],
    };
  }

  const usUnsure = inputs.usPerson === "not-sure";
  const { donorType, valueBand } = inputs;

  // Trust distributions to a US person have their own Form 3520 rules.
  if (donorType === "trust") {
    return {
      key: "form3520",
      label: "Form 3520",
      tone: "attention",
      badge: "Get advice",
      lines: [
        "Money or assets from a foreign trust have their own Form 3520 rules that are separate from the gift thresholds — distributions to a US person are generally reportable regardless of amount.",
        "This is the most complex case. Speak with a cross-border CPA about Form 3520 (and possibly Form 3520-A) before doing anything.",
      ],
    };
  }

  if (valueBand === "not-sure") {
    return {
      key: "form3520",
      label: "Form 3520",
      tone: "caution",
      badge: "Check the value",
      lines: [
        "Whether Form 3520 applies turns on the year's total value from this donor type. Pin down the approximate USD value to see a clearer flag.",
        "Remember the test is on the aggregate for the year, and related donors (e.g. both parents) can be combined.",
      ],
    };
  }

  const fromIndividualOrEstate =
    donorType === "individual" || donorType === "estate";

  // Individual / estate → $100,000 aggregate threshold.
  if (fromIndividualOrEstate) {
    if (valueBand === "over-100k") {
      return {
        key: "form3520",
        label: "Form 3520",
        tone: "attention",
        badge: "Likely required",
        lines: [
          "Gifts and bequests from a foreign individual or estate are reported on Form 3520 when the year's total exceeds US $100,000 — your value band crosses that line.",
          "It's an information return (a disclosure), not a tax on the gift. The risk is the penalty for not filing or filing late. Confirm the current threshold and deadline with a CPA.",
        ],
      };
    }
    return {
      key: "form3520",
      label: "Form 3520",
      tone: usUnsure ? "caution" : "positive",
      badge: "Likely below threshold",
      lines: [
        "Gifts/bequests from a foreign individual or estate are reported only once the year's total exceeds US $100,000. Your value band is below that.",
        "Watch the aggregate: more gifts later in the year, or combining related donors, can still cross $100,000. Keep records either way.",
      ],
    };
  }

  // Foreign company / partnership → separate, much lower annually-indexed threshold.
  if (valueBand === "under-20k") {
    return {
      key: "form3520",
      label: "Form 3520",
      tone: "caution",
      badge: "Verify the threshold",
      lines: [
        "Gifts from a foreign corporation or partnership use a separate, much lower threshold that the IRS adjusts annually for inflation (high five figures) — your value band may be near it.",
        "Verify the current-year figure with a CPA or on irs.gov; gifts from entities are also treated differently from individual gifts.",
      ],
    };
  }

  return {
    key: "form3520",
    label: "Form 3520",
    tone: "attention",
    badge: "Likely required",
    lines: [
      "Gifts from a foreign corporation or partnership use a separate, much lower threshold (high five figures, indexed annually) than the $100,000 individual figure — your value band likely crosses it.",
      "It's a disclosure, not a tax. Confirm the current-year threshold and the entity-specific rules with a cross-border CPA.",
    ],
  };
}

/* ---------------------------- FBAR / FATCA flag --------------------------- */
function fbarFlag(inputs: Form3520Inputs): ReviewFlag {
  const { receivedIn, assetType } = inputs;

  const isFinancialAccountOrSecurity =
    assetType === "cash" ||
    assetType === "mutual-fund" ||
    assetType === "shares";

  if (receivedIn === "india" && isFinancialAccountOrSecurity) {
    return {
      key: "fbar",
      label: "FBAR / FATCA",
      tone: "attention",
      badge: "Review likely",
      lines: [
        "Money or securities sitting in an Indian account are foreign financial assets. Once they're yours, they count toward your FBAR (FinCEN 114) and FATCA (Form 8938) thresholds.",
        "Run your accounts through the FBAR / FATCA checker and confirm with a CPA whether you cross the (separate) FBAR and Form 8938 thresholds.",
      ],
    };
  }

  if (receivedIn === "india" && (assetType === "property" || assetType === "gold")) {
    return {
      key: "fbar",
      label: "FBAR / FATCA",
      tone: "caution",
      badge: "Indirectly",
      lines: [
        "Real estate and physical gold are generally not FBAR/FATCA account items by themselves — but the Indian bank accounts the rent or sale proceeds flow into are.",
        "Once you sell or earn income and the cash lands in an Indian account, FBAR/FATCA can apply to that account. Keep it in view.",
      ],
    };
  }

  if (receivedIn === "india" && assetType === "business-interest") {
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
      "If the money landed in a US account and you don't hold Indian financial accounts because of it, this gift by itself is unlikely to drive new FBAR/FATCA reporting.",
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
        "Don't reflexively sell or switch. Talk to a PFIC-experienced CPA first; elections like QEF or mark-to-market have strict timing.",
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
        "Depending on what the business holds and how it's structured, a foreign business interest could raise PFIC or other foreign-entity (e.g. Form 5471) questions.",
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

/* ---------------------------- Documents & Qs ----------------------------- */
function buildDocuments(inputs: Form3520Inputs): string[] {
  const docs: string[] = [
    "Donor details — name, relationship, and (for an entity) the type of entity",
    "The date and approximate USD value of each gift / bequest",
    "Bank wire records on both the sending and receiving side",
  ];

  if (inputs.donorType === "estate" || inputs.donorType === "trust") {
    docs.push(
      "Death certificate of the person you inherited from",
      "Will / probate or, if intestate, succession documents",
      "Legal heir certificate establishing you as a lawful heir"
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
    case "cash":
    default:
      break;
  }

  if (inputs.receivedIn === "india") {
    docs.push(
      "Indian bank statements showing the credits and source of funds",
      "Repatriation paperwork if moving it to the US (Form 15CA / 15CB)"
    );
  }

  return docs;
}

function buildQuestions(inputs: Form3520Inputs): string[] {
  const qs: string[] = [
    "Did my year's foreign gifts/bequests cross the Form 3520 threshold for my donor type — and what's the deadline?",
    "Do I need to combine related donors (e.g. both parents) for the threshold test?",
  ];

  if (inputs.receivedIn === "india") {
    qs.push(
      "Do the Indian accounts involved push me over FBAR or FATCA thresholds?",
      "What's the repatriation route and documentation to bring the money to the US?"
    );
  }

  if (inputs.assetType === "mutual-fund") {
    qs.push(
      "Are these PFICs needing Form 8621, and is a QEF / mark-to-market election worth it?",
      "What's the least-bad way and timing to exit the funds across both countries?"
    );
  }

  if (
    inputs.assetType === "property" ||
    inputs.assetType === "shares" ||
    inputs.assetType === "gold" ||
    inputs.assetType === "business-interest"
  ) {
    qs.push(
      "What's my cost basis for an eventual sale — under US and Indian rules?"
    );
  }

  if (inputs.generatedIncome === "yes" || inputs.generatedIncome === "not-sure") {
    qs.push(
      "How is the income this asset earns (interest, dividends, rent, gains) taxed and credited across both countries?"
    );
  }

  if (inputs.donorRelationship === "parents" || inputs.donorRelationship === "relative") {
    qs.push(
      "Is this gift/inheritance exempt in India (gifts from specified relatives), and what proof should I keep?"
    );
  }

  if (inputs.usPerson === "not-sure") {
    qs.push(
      "Am I a US person for tax purposes this year (residency / dual-status), which decides whether Form 3520 applies?"
    );
  }

  return qs;
}

export function evaluate(inputs: Form3520Inputs): Form3520Result {
  if (!isReady(inputs)) {
    return {
      ready: false,
      resultType: "incomplete",
      flags: [],
      documents: [],
      questions: [],
    };
  }

  const flags = [form3520Flag(inputs), fbarFlag(inputs), pficFlag(inputs)];

  // A compact analytics label combining the headline flags.
  const resultType = `${inputs.donorType}|${inputs.valueBand}|${inputs.assetType}|${flags[0].badge}`;

  return {
    ready: true,
    resultType,
    flags,
    documents: buildDocuments(inputs),
    questions: buildQuestions(inputs),
  };
}
