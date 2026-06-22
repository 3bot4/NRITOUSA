/**
 * Pure logic for the NRI TDS Refund Checklist tool (no React, no DOM).
 *
 * This is a *checklist*, not a tax calculator: it never computes a tax or
 * refund figure. It maps a few situational inputs (income type, whether TDS
 * was deducted, 26AS/AIS match, PAN status, DTAA docs, ITR filed, refund
 * received) to (a) a tailored document checklist, (b) a likely next review
 * step, and (c) questions to take to a CA. Everything is educational only.
 *
 * Tied to the "NRI TDS Refund & Lower TDS" cluster (lib/tdsCluster.ts).
 */

export type IncomeType =
  | "nro-interest"
  | "property-sale"
  | "rent"
  | "dividend"
  | "capital-gains"
  | "other";

export type YesNoUnsure = "yes" | "no" | "not-sure";

export interface TdsChecklistInputs {
  incomeType: IncomeType | "";
  tdsDeducted: YesNoUnsure | "";
  recordsMatch: YesNoUnsure | "";
  panActive: YesNoUnsure | "";
  dtaaDocs: YesNoUnsure | "";
  itrFiled: YesNoUnsure | "";
  refundReceived: YesNoUnsure | "";
}

export const EMPTY_INPUTS: TdsChecklistInputs = {
  incomeType: "",
  tdsDeducted: "",
  recordsMatch: "",
  panActive: "",
  dtaaDocs: "",
  itrFiled: "",
  refundReceived: "",
};

export const INCOME_TYPE_OPTIONS: { value: IncomeType; label: string }[] = [
  { value: "nro-interest", label: "NRO savings / FD interest" },
  { value: "property-sale", label: "Sale of Indian property" },
  { value: "rent", label: "Rent from Indian property" },
  { value: "dividend", label: "Dividends" },
  { value: "capital-gains", label: "Mutual-fund / stock capital gains" },
  { value: "other", label: "Professional fees / other India income" },
];

export const YES_NO_UNSURE: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

export const INTERNAL_LINKS: { href: string; label: string }[] = [
  { href: "/india-tax-compliance/nri-tds-refund-usa", label: "NRI TDS refund guide (pillar)" },
  { href: "/india-tax-compliance/nri-itr-filing-usa", label: "NRI ITR filing from USA" },
  { href: "/india-tax-compliance/nri-property-sale-tds-refund", label: "Property-sale TDS refund" },
  { href: "/india-tax-compliance/form-13-lower-tds-certificate-nri", label: "Form 13 lower/nil TDS certificate" },
  { href: "/tools/form-10f-generator", label: "Form 10F generator (DTAA)" },
  { href: "/calculators/dtaa-foreign-tax-credit", label: "DTAA / foreign tax credit calculator" },
  { href: "/india-tax-compliance", label: "India Tax & Compliance hub" },
];

export type NextStepTone = "info" | "positive" | "caution" | "attention";

export interface TdsChecklistResult {
  /** Whether enough inputs are filled to show a meaningful result. */
  ready: boolean;
  /** Short label for analytics / badge. */
  resultType: string;
  badge: string;
  tone: NextStepTone;
  /** The headline next-step recommendation. */
  nextStepTitle: string;
  /** A few sentences expanding on the next step. */
  nextStep: string[];
  /** Tailored document checklist. */
  documents: string[];
  /** Questions to take to a CA. */
  caQuestions: string[];
}

const COMMON_DOCS = [
  "PAN card / PAN number",
  "Form 26AS (tax-credit statement for the assessment year)",
  "AIS and TIS (downloaded from the Income Tax portal)",
  "NRO / NRE account statements for the full financial year",
];

const INCOME_DOCS: Record<IncomeType, string[]> = {
  "nro-interest": [
    "Bank interest certificate (interest paid + TDS deducted)",
    "Fixed-deposit advices / receipts, including auto-renewed FDs",
    "Form 16A (TDS certificate from the bank)",
  ],
  "property-sale": [
    "Property sale agreement / sale deed (the consideration)",
    "Original purchase deed and cost records",
    "Cost-of-improvement proofs",
    "Capital-gains computation (cost, indexation, exemptions)",
    "Form 16B (TDS certificate from the buyer)",
  ],
  rent: [
    "Rent agreement",
    "Rent-received summary for the year",
    "Home-loan interest certificate (if applicable)",
    "Form 16A / TDS certificate from the tenant",
  ],
  dividend: [
    "Dividend statements from companies / registrars",
    "Form 16A (TDS certificate on dividends)",
    "Demat / holding statement",
  ],
  "capital-gains": [
    "Brokerage capital-gains statement (short- and long-term)",
    "Mutual-fund capital-gains statement from the AMC / registrar",
    "Cost / purchase records for the securities sold",
    "Capital-gains computation",
  ],
  other: [
    "Invoices / agreements for the professional or consulting fees",
    "Form 16A (TDS certificate from the payer)",
    "Any expense records relevant to the income",
  ],
};

const DTAA_DOCS = [
  "Tax Residency Certificate (TRC) from the US (IRS Form 6166)",
  "Form 10F (use the Form 10F generator to prepare a draft)",
];

const INCOME_CA_QUESTIONS: Record<IncomeType, string[]> = {
  "nro-interest": [
    "What's my real tax on this NRO interest versus the TDS withheld?",
    "Can we apply the DTAA rate, and do you have my Form 10F + TRC?",
  ],
  "property-sale": [
    "Should we apply for a Form 13 lower-TDS certificate before closing, or reclaim by filing?",
    "Is my capital-gains computation right — cost, indexation, improvements, exemptions?",
    "Can any capital losses be set off against this gain?",
  ],
  rent: [
    "After standard deduction and loan interest, what's the taxable rent versus the TDS?",
    "Did the tenant deduct and deposit the TDS correctly against my PAN?",
  ],
  dividend: [
    "Was the DTAA dividend rate applied, or can I reclaim the difference?",
    "Do my dividend figures match Form 26AS / AIS?",
  ],
  "capital-gains": [
    "Is my cost base and holding-period treatment correct for each lot?",
    "Can losses be set off to reduce the taxable gain?",
  ],
  other: [
    "Does the DTAA give treaty relief on this professional income?",
    "Are there expenses or credits that reduce the net taxable amount?",
  ],
};

/** True once the minimum inputs to give a useful result are present. */
export function isReady(inputs: TdsChecklistInputs): boolean {
  return Boolean(inputs.incomeType && inputs.tdsDeducted);
}

export function evaluate(inputs: TdsChecklistInputs): TdsChecklistResult {
  const ready = isReady(inputs);

  if (!ready) {
    return {
      ready: false,
      resultType: "incomplete",
      badge: "Fill in the form",
      tone: "info",
      nextStepTitle: "Answer a couple of questions to begin",
      nextStep: [
        "Pick your India income type and whether TDS was deducted to see a tailored checklist, the likely next step, and questions for your CA.",
      ],
      documents: [],
      caQuestions: [],
    };
  }

  const incomeType = inputs.incomeType as IncomeType;

  // ---- Document checklist (always shown once ready) ----
  const documents = [
    ...COMMON_DOCS,
    ...INCOME_DOCS[incomeType],
    ...(inputs.dtaaDocs === "no" || inputs.dtaaDocs === "not-sure"
      ? DTAA_DOCS
      : []),
  ];

  // ---- CA questions ----
  const caQuestions = [
    ...INCOME_CA_QUESTIONS[incomeType],
    "Does my Form 26AS / AIS match what was actually deducted — any mismatch to fix?",
    "Is my NRO account pre-validated on the portal so a refund can be paid?",
    "Given my total Indian income, is a refund likely — and how long would it take?",
  ];

  // ---- Likely next review step (priority-ordered) ----

  // No TDS deducted → usually nothing to refund.
  if (inputs.tdsDeducted === "no") {
    return {
      ready: true,
      resultType: "no-tds-no-refund",
      badge: "Likely no refund",
      tone: "positive",
      nextStepTitle: "No TDS deducted — usually nothing to refund",
      nextStep: [
        "A TDS refund only arises when tax was deducted at source and exceeds your real liability. If nothing was withheld, there's typically no TDS to reclaim.",
        "You may still have an Indian filing obligation if your income crosses the basic exemption limit — check the ITR filing guide and confirm with a CA.",
      ],
      documents,
      caQuestions,
    };
  }

  // PAN inactive is a hard blocker.
  if (inputs.panActive === "no") {
    return {
      ready: true,
      resultType: "fix-pan-first",
      badge: "Fix PAN first",
      tone: "attention",
      nextStepTitle: "Sort out your PAN before anything else",
      nextStep: [
        "TDS is credited against your PAN, and a refund can't be processed without an active PAN. An inoperative PAN also causes TDS to be deducted at higher rates.",
        "Resolve your PAN status (including any PAN–Aadhaar linkage that applies to you), then reconcile Form 26AS and proceed to filing.",
      ],
      documents,
      caQuestions: [
        "What's the current status of my PAN, and is any PAN–Aadhaar action needed for an NRI?",
        ...caQuestions,
      ],
    };
  }

  // Records mismatch / not checked → reconcile first.
  if (inputs.recordsMatch === "no") {
    return {
      ready: true,
      resultType: "fix-mismatch",
      badge: "Reconcile first",
      tone: "attention",
      nextStepTitle: "Fix the bank-vs-department mismatch before filing",
      nextStep: [
        "You can only claim a refund for TDS that actually shows against your PAN in Form 26AS. If the deductor's certificate and your 26AS disagree, the credit may be late, under the wrong PAN, or the wrong quarter.",
        "Ask the bank / buyer / tenant to correct their TDS return so the credit reflects in your 26AS, then file. See the Form 26AS, AIS & TIS guide.",
      ],
      documents,
      caQuestions,
    };
  }

  if (inputs.recordsMatch === "not-sure") {
    return {
      ready: true,
      resultType: "check-records",
      badge: "Check 26AS / AIS",
      tone: "caution",
      nextStepTitle: "Reconcile Form 26AS / AIS before you file",
      nextStep: [
        "Download Form 26AS, AIS, and TIS and confirm every rupee of TDS shows against your PAN, matching your bank/buyer certificates.",
        "Filing figures that don't match the department's records is the leading cause of mismatch notices — reconcile first, then file.",
      ],
      documents,
      caQuestions,
    };
  }

  // Already filed?
  if (inputs.itrFiled === "yes") {
    if (inputs.refundReceived === "yes") {
      return {
        ready: true,
        resultType: "refund-received",
        badge: "Refund received",
        tone: "positive",
        nextStepTitle: "Refund received — keep your records",
        nextStep: [
          "Looks like the cycle is complete. Keep your filed return, TDS certificates, and refund record together.",
          "If you plan to repatriate the proceeds (e.g. from a property sale), review the repatriation paperwork and confirm the USD limits with your CA.",
        ],
        documents,
        caQuestions: [
          "Is my refund amount consistent with my computed liability?",
          "What records should I keep for repatriation of the proceeds?",
        ],
      };
    }
    return {
      ready: true,
      resultType: "filed-track-refund",
      badge: "Track your refund",
      tone: "info",
      nextStepTitle: "Filed already — make sure it's e-verified and track the refund",
      nextStep: [
        "A return must be e-verified before processing begins, and the refund pays into a pre-validated NRO account.",
        "Track the refund status on the Income Tax portal under your account. If it's stuck, check for a 26AS mismatch or an unvalidated bank account.",
      ],
      documents,
      caQuestions: [
        "Is my return e-verified and my NRO account validated for the refund?",
        ...caQuestions,
      ],
    };
  }

  // TDS deducted, records fine (or not-sure handled above), not yet filed.
  // Property sale gets the Form 13 nudge.
  if (incomeType === "property-sale") {
    return {
      ready: true,
      resultType: "property-file-or-form13",
      badge: "File to reclaim",
      tone: "caution",
      nextStepTitle: "Reclaim the over-deduction by filing — or use Form 13 next time",
      nextStep: [
        "Property-sale TDS is withheld on the full sale price, not your gain, so the over-deduction is usually large. File your ITR with the correct indexed cost and any exemption to claim the excess back.",
        "If the sale hasn't closed yet, consider applying for a Form 13 lower/nil-TDS certificate before closing so less is withheld up front.",
      ],
      documents,
      caQuestions,
    };
  }

  return {
    ready: true,
    resultType: "file-to-refund",
    badge: "File to reclaim",
    tone: "caution",
    nextStepTitle: "File your Indian return to reconcile and claim the refund",
    nextStep: [
      "TDS was deducted and your records appear to match, but you haven't filed. The excess TDS over your real liability comes back only when you file an ITR for the assessment year.",
      inputs.dtaaDocs === "yes"
        ? "You have DTAA documents — make sure the treaty rate is applied so the claim is complete."
        : "If a DTAA treaty rate could lower your tax, prepare Form 10F and your TRC so it can be applied.",
    ],
    documents,
    caQuestions,
  };
}
