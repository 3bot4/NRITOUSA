/**
 * Data + logic for the "DIY NRI Tax Filing Roadmap" front-door tool at
 * /tools/nri-tax-filing-roadmap.
 *
 * This is an EDUCATIONAL roadmap, not tax advice and not filing software. It
 * maps a few soft questions to a personalized "what to review" checklist that
 * routes users into the existing NRItoUSA tools and guides — it never decides
 * a filing obligation, never says "you must file", and never computes tax.
 *
 * The deadline/limit preview cards intentionally REUSE the maintained
 * formsLimitsCenter data (US_FORMS / INDIA_FORMS) so dates and thresholds live
 * in one place and are always paired with "verify current year" language.
 * Nothing here hard-codes a stale calendar date.
 */

import {
  FORMS_LIMITS_LAST_REVIEWED,
  FORMS_LIMITS_PATH,
  INDIA_FORMS,
  US_FORMS,
  VERIFY_NOTE,
  type FormRow,
} from "@/lib/formsLimitsCenter";

export const ROADMAP_PATH = "/tools/nri-tax-filing-roadmap";
export const ROADMAP_LAST_REVIEWED = FORMS_LIMITS_LAST_REVIEWED;
export { VERIFY_NOTE, FORMS_LIMITS_PATH };

/* ------------------------------------------------------------------ *
 * Questions
 * ------------------------------------------------------------------ */

export type QuestionId =
  | "usPerson"
  | "indianAccounts"
  | "crossedLimits"
  | "indianIncome"
  | "tds"
  | "itr"
  | "repatriation"
  | "doubleTax";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface RoadmapQuestion {
  id: QuestionId;
  /** Single-select or multi-select (checkboxes). */
  type: "single" | "multi";
  question: string;
  help?: string;
  options: QuestionOption[];
}

export const QUESTIONS: RoadmapQuestion[] = [
  {
    id: "usPerson",
    type: "single",
    question:
      "Are you a U.S. citizen, green card holder, or U.S. tax resident?",
    help: "U.S. citizens, green card holders, and those who pass the Substantial Presence Test are generally U.S. persons for tax purposes.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "indianAccounts",
    type: "single",
    question:
      "Do you have Indian bank accounts, NRE/NRO/FCNR accounts, FDs, brokerage, Demat, or mutual funds?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "crossedLimits",
    type: "single",
    question:
      "Did your combined non-U.S. account/asset balance cross important reporting limits during the year?",
    help: "Reporting limits (like the FBAR aggregate line or FATCA thresholds) are measured across all accounts, often at the highest balance during the year — not just on December 31.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "indianIncome",
    type: "multi",
    question: "Did you earn income from India?",
    help: "Select all that apply.",
    options: [
      { value: "nro-interest", label: "NRO interest" },
      { value: "nre-fcnr-interest", label: "NRE/FCNR interest" },
      { value: "rental", label: "Rental income" },
      { value: "property-sale", label: "Property sale" },
      { value: "salary-business", label: "Indian salary/business income" },
      { value: "dividends-capgains", label: "Dividends/capital gains" },
      { value: "mutual-funds", label: "Mutual funds" },
      { value: "none", label: "No Indian income" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "tds",
    type: "single",
    question: "Was TDS deducted in India?",
    help: "TDS (tax deducted at source) is Indian tax withheld before income reaches you.",
    options: [
      { value: "nro", label: "Yes, on NRO interest" },
      { value: "property", label: "Yes, on property sale" },
      { value: "other", label: "Yes, on rent/dividend/other income" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "itr",
    type: "single",
    question: "Are you filing or planning to file India ITR?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "repatriation",
    type: "single",
    question: "Are you moving money from India to the USA?",
    options: [
      { value: "nro-us", label: "Yes, NRO to U.S." },
      { value: "property-proceeds", label: "Yes, property sale proceeds" },
      { value: "gift-inheritance", label: "Yes, gift/inheritance/savings" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "doubleTax",
    type: "single",
    question: "Did you pay tax in both India and the U.S. on the same income?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Answers shape
 * ------------------------------------------------------------------ */

export interface RoadmapAnswers {
  usPerson: string;
  indianAccounts: string;
  crossedLimits: string;
  indianIncome: string[];
  tds: string;
  itr: string;
  repatriation: string;
  doubleTax: string;
}

export const EMPTY_ANSWERS: RoadmapAnswers = {
  usPerson: "",
  indianAccounts: "",
  crossedLimits: "",
  indianIncome: [],
  tds: "",
  itr: "",
  repatriation: "",
  doubleTax: "",
};

/** Whether the user has answered enough to produce a meaningful roadmap. */
export function hasEnoughAnswers(a: RoadmapAnswers): boolean {
  const single = [
    a.usPerson,
    a.indianAccounts,
    a.crossedLimits,
    a.tds,
    a.itr,
    a.repatriation,
    a.doubleTax,
  ].filter(Boolean).length;
  return single + (a.indianIncome.length > 0 ? 1 : 0) >= 3;
}

/* ------------------------------------------------------------------ *
 * Result sections
 * ------------------------------------------------------------------ */

/** Soft severity: "review" (worth a closer look) → "consider" → "low". */
export type SectionTone = "review" | "consider" | "low";

export interface SectionCta {
  label: string;
  href: string;
  /** Primary CTA gets the filled button; others are quiet links. */
  primary?: boolean;
  /** External (official source) links open in a new tab. */
  external?: boolean;
}

export interface RoadmapSection {
  id: string;
  eyebrow: string;
  title: string;
  tone: SectionTone;
  badge: string;
  /** One-line soft summary, adapted to the user's answers. */
  summary: string;
  /** Short "what to look at" bullets. */
  points: string[];
  ctas: SectionCta[];
}

const BADGE: Record<SectionTone, string> = {
  review: "May need review",
  consider: "Consider checking",
  low: "Likely lighter — still verify",
};

const has = (arr: string[], v: string) => arr.includes(v);

/**
 * Build the personalized roadmap. Every section is always returned (so the
 * user sees the whole picture), but the tone, badge, and summary soften or
 * sharpen based on the answers. Language stays educational throughout.
 */
export function buildRoadmap(a: RoadmapAnswers): RoadmapSection[] {
  const isUsPerson = a.usPerson === "yes";
  const maybeUsPerson = a.usPerson === "not-sure";
  const hasAccounts = a.indianAccounts === "yes";
  const maybeAccounts = a.indianAccounts === "not-sure";
  const incomeItems = a.indianIncome.filter(
    (v) => v !== "none" && v !== "not-sure"
  );
  const hasIncome = incomeItems.length > 0;
  const hasTds = ["nro", "property", "other"].includes(a.tds);
  const wantsItr = a.itr === "yes";
  const isRepatriating = ["nro-us", "property-proceeds", "gift-inheritance"].includes(
    a.repatriation
  );
  const doubleTaxed = a.doubleTax === "yes";

  const sections: RoadmapSection[] = [];

  /* 1. U.S. tax return review */
  {
    const tone: SectionTone = isUsPerson
      ? hasIncome || doubleTaxed
        ? "review"
        : "consider"
      : maybeUsPerson
        ? "consider"
        : "low";
    sections.push({
      id: "us-return",
      eyebrow: "U.S. side",
      title: "U.S. tax return review",
      tone,
      badge: BADGE[tone],
      summary: isUsPerson
        ? "As a U.S. person, your worldwide income — including Indian income — generally belongs on your U.S. return. Consider reviewing how Indian income is reported."
        : maybeUsPerson
          ? "Whether you're a U.S. person for tax purposes drives almost everything else. Consider confirming your status first."
          : "If you're not a U.S. person, U.S. return rules may be lighter — but verify your status, since it can change with time in the U.S.",
      points: [
        "Indian income (NRE/NRO interest, rent, dividends, gains) is generally reported on Form 1040 even if it was taxed in India.",
        hasIncome
          ? "You indicated Indian income — review which schedules (e.g. Schedule B) and forms may apply."
          : "Review whether any Indian interest or dividends need Schedule B.",
        "Verify your residency status (Substantial Presence Test) with current-year IRS guidance.",
      ],
      ctas: [
        {
          label: "Read: Indian income on a U.S. return",
          href: "/articles/indian-income-us-tax-return",
          primary: true,
        },
        { label: "Form 1040 / Form 1116 section", href: FORMS_LIMITS_PATH },
      ],
    });
  }

  /* 2. FBAR / FATCA review */
  {
    const tone: SectionTone =
      (isUsPerson || maybeUsPerson) && hasAccounts
        ? a.crossedLimits === "yes"
          ? "review"
          : "consider"
        : maybeAccounts
          ? "consider"
          : "low";
    sections.push({
      id: "fbar-fatca",
      eyebrow: "Foreign-account reporting",
      title: "FBAR / FATCA review",
      tone,
      badge: BADGE[tone],
      summary:
        (isUsPerson || maybeUsPerson) && hasAccounts
          ? "U.S. persons with Indian accounts often need to review FBAR (FinCEN Form 114) and FATCA (Form 8938). These are disclosures, not taxes."
          : "If you hold Indian accounts as a U.S. person, it's worth checking whether FBAR or FATCA reporting applies.",
      points: [
        "FBAR looks at the highest combined balance across all foreign accounts during the year — not the year-end balance.",
        "FATCA / Form 8938 has higher thresholds that depend on filing status and where you live.",
        "NRE/NRO/FCNR accounts and FDs generally count even when the India-side interest is tax-free.",
      ],
      ctas: [
        {
          label: "Check FBAR/FATCA risk",
          href: "/tools/fbar-fatca-checker",
          primary: true,
        },
        {
          label: "Read the FBAR/FATCA guide",
          href: "/articles/fbar-fatca-nri-guide",
        },
        { label: "See limits and forms", href: FORMS_LIMITS_PATH },
      ],
    });
  }

  /* 3. India ITR review */
  {
    const relevant = wantsItr || hasIncome || hasTds || a.itr === "not-sure";
    const tone: SectionTone = wantsItr || (hasIncome && hasTds)
      ? "review"
      : relevant
        ? "consider"
        : "low";
    sections.push({
      id: "india-itr",
      eyebrow: "India side",
      title: "India ITR review",
      tone,
      badge: BADGE[tone],
      summary: wantsItr
        ? "You're planning to file an India ITR — consider confirming the right form and documents before you file."
        : hasTds
          ? "Filing an India ITR is often how over-deducted TDS is reclaimed. Consider whether a return is worth filing."
          : "Check whether your Indian income needs (or benefits from) an India income-tax return.",
      points: [
        "Most NRIs use ITR-2; ITR-3 applies when there's business/professional income.",
        "Reconcile Form 26AS, AIS, and TIS before filing to avoid mismatch notices.",
        "Even when filing isn't mandatory, a voluntary return is how excess TDS comes back.",
      ],
      ctas: [
        {
          label: "NRI ITR filing from USA",
          href: "/india-tax-compliance/nri-itr-filing-usa",
          primary: true,
        },
        { label: "ITR-2 guide", href: "/india-tax-compliance/itr-2-for-nri" },
        { label: "ITR-3 guide", href: "/india-tax-compliance/itr-3-for-nri" },
        {
          label: "Documents checklist",
          href: "/india-tax-compliance/nri-india-tax-documents-checklist",
        },
      ],
    });
  }

  /* 4. TDS refund review */
  {
    const tone: SectionTone = hasTds
      ? "review"
      : a.tds === "not-sure"
        ? "consider"
        : "low";
    sections.push({
      id: "tds-refund",
      eyebrow: "India side",
      title: "TDS refund review",
      tone,
      badge: BADGE[tone],
      summary: hasTds
        ? "TDS was deducted, so there may be a refundable gap between what was withheld and your actual Indian tax. Consider mapping the refund."
        : "If TDS was ever deducted on your Indian income, it's worth checking whether some of it is refundable.",
      points: [
        a.tds === "property"
          ? "Property-sale TDS is withheld on the full sale price, not your gain — often a large over-deduction."
          : "NRO interest TDS is withheld at higher NRI rates, often from the first rupee.",
        "Form 26AS/AIS must show the TDS against your PAN before you can claim it.",
        "A Form 10F + Tax Residency Certificate may support a lower DTAA rate.",
      ],
      ctas: [
        {
          label: "NRI TDS refund guide",
          href: "/india-tax-compliance/nri-tds-refund-usa",
          primary: true,
        },
        {
          label: "Open TDS refund checklist",
          href: "/tools/nri-tds-refund-checklist",
        },
        { label: "Open Form 10F generator", href: "/tools/form-10f-generator" },
      ],
    });
  }

  /* 5. DTAA / Foreign Tax Credit review */
  {
    const relevant = doubleTaxed || (hasIncome && isUsPerson) || hasTds;
    const tone: SectionTone = doubleTaxed
      ? "review"
      : relevant
        ? "consider"
        : "low";
    sections.push({
      id: "dtaa",
      eyebrow: "Both sides",
      title: "DTAA / Foreign Tax Credit review",
      tone,
      badge: BADGE[tone],
      summary: doubleTaxed
        ? "You indicated the same income was taxed in both countries — the India–U.S. DTAA and foreign tax credits exist to prevent that. Consider reviewing them."
        : "Where income is taxed in both India and the U.S., the DTAA and foreign tax credit may reduce or remove the double tax.",
      points: [
        "On the U.S. side, Form 1116 claims a credit for Indian tax already paid.",
        "On the India side, Form 67 claims credit for U.S. tax (filed with your ITR).",
        "Treaty positions and timing matter — keep proof of tax paid in both countries.",
      ],
      ctas: [
        {
          label: "Estimate foreign tax credit (DTAA calculator)",
          href: "/calculators/dtaa-foreign-tax-credit",
          primary: true,
        },
        {
          label: "Read: DTAA & double taxation",
          href: "/articles/double-taxation-dtaa-india-usa",
        },
      ],
    });
  }

  /* 6. Repatriation paperwork review */
  {
    const tone: SectionTone = isRepatriating
      ? "review"
      : a.repatriation === "not-sure"
        ? "consider"
        : "low";
    sections.push({
      id: "repatriation",
      eyebrow: "Moving money",
      title: "Repatriation paperwork review",
      tone,
      badge: BADGE[tone],
      summary: isRepatriating
        ? "Moving money from India to the U.S. usually needs Form 15CA (and sometimes a CA's Form 15CB) before the bank remits. Consider preparing the paperwork."
        : "If you plan to move money from India to the U.S., the 15CA/15CB paperwork is worth understanding ahead of time.",
      points: [
        "Form 15CA is an online declaration filed before the remittance.",
        "Form 15CB (a CA certificate) is needed above certain taxable-remittance limits.",
        "Keep source-of-funds proof — sale deeds, tax records, account statements.",
      ],
      ctas: [
        {
          label: "Form 15CA / 15CB guide",
          href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation",
          primary: true,
        },
        {
          label: "Open 15CA / 15CB checklist",
          href: "/tools/form-15ca-15cb-checklist",
        },
        {
          label: "Remittance & TCS calculator",
          href: "/calculators/remittance-tcs-cost",
        },
      ],
    });
  }

  /* 7. Documents to gather */
  {
    const docs: string[] = [];
    if (isUsPerson || maybeUsPerson) {
      docs.push("Prior-year U.S. return, W-2s/1099s, and any Form 1042-S.");
    }
    if (hasAccounts || maybeAccounts) {
      docs.push(
        "Highest-balance records for each Indian account (FBAR) and year-end balances (FATCA)."
      );
    }
    if (hasIncome || hasTds || wantsItr) {
      docs.push("Form 26AS, AIS, and TIS downloaded from the Income Tax portal.");
      docs.push("NRO/NRE/FCNR statements and TDS certificates (16A / 16B).");
    }
    if (has(a.indianIncome, "property-sale") || a.tds === "property") {
      docs.push("Sale deed, original purchase deed, and capital-gains computation.");
    }
    if (doubleTaxed || hasTds) {
      docs.push("Proof of tax paid in India and in the U.S. for the same income.");
    }
    if (isRepatriating) {
      docs.push("Source-of-funds proof for any India → U.S. remittance.");
    }
    docs.push("PAN, and a Tax Residency Certificate / Form 10F if claiming DTAA rates.");
    sections.push({
      id: "documents",
      eyebrow: "Prepare",
      title: "Documents to gather",
      tone: "consider",
      badge: "Collect these",
      summary:
        "A starting checklist based on your answers. Indian banks can be slow to produce historical statements — gather early.",
      points: docs,
      ctas: [
        {
          label: "Full NRI documents checklist",
          href: "/india-tax-compliance/nri-india-tax-documents-checklist",
          primary: true,
        },
      ],
    });
  }

  /* 8. Questions to ask CPA / CA */
  {
    const qs: string[] = [];
    if (isUsPerson || maybeUsPerson) {
      qs.push("CPA: How should my Indian income be reported on my U.S. return?");
    }
    if (hasAccounts) {
      qs.push("CPA: Do my Indian accounts need FBAR and/or Form 8938 this year?");
    }
    if (has(a.indianIncome, "mutual-funds")) {
      qs.push("CPA: Do my Indian mutual funds raise PFIC / Form 8621 questions?");
    }
    if (hasTds || wantsItr) {
      qs.push("CA: Is an India ITR worth filing to reclaim my TDS, and which form?");
    }
    if (doubleTaxed) {
      qs.push("CPA & CA: How do we coordinate Form 1116 (US) and Form 67 (India)?");
    }
    if (isRepatriating) {
      qs.push("CA: What 15CA/15CB paperwork does my remittance need?");
    }
    qs.push("Both: Are there any prior-year filings I should catch up on?");
    sections.push({
      id: "cpa-questions",
      eyebrow: "Get advice",
      title: "Questions to ask your CPA / CA",
      tone: "consider",
      badge: "Bring these to your advisor",
      summary:
        "A cross-border situation often needs both a U.S. CPA and an India CA. Arrive with the same facts and questions for each.",
      points: qs,
      ctas: [
        {
          label: "Organize everything first (free organizer)",
          href: "/nri-wealth-checkup",
          primary: true,
        },
      ],
    });
  }

  return sections;
}

/* ------------------------------------------------------------------ *
 * Deadline / limit preview cards
 *
 * Built from the maintained formsLimitsCenter rows so the dates, thresholds,
 * documents, and official sources stay in one place. No hard-coded calendar
 * dates live here — every card carries the "verify current year" note.
 * ------------------------------------------------------------------ */

export interface DeadlineCard {
  /** Display name. */
  name: string;
  /** Official authority label. */
  authority: "IRS" | "FinCEN" | "Income Tax Department of India";
  /** Where it is filed, in plain language. */
  filedWith: string;
  /** Underlying maintained row (purpose, trigger, deadline, documents, source). */
  row: FormRow;
}

const findForm = (rows: FormRow[], match: string): FormRow =>
  rows.find((r) => r.form.toLowerCase().includes(match.toLowerCase()))!;

export const DEADLINE_CARDS: DeadlineCard[] = [
  {
    name: "U.S. Form 1040",
    authority: "IRS",
    filedWith: "Filed with the IRS",
    row: findForm(US_FORMS, "Form 1040"),
  },
  {
    name: "FBAR / FinCEN Form 114",
    authority: "FinCEN",
    filedWith: "Filed online with FinCEN (BSA E-Filing), separate from your return",
    row: findForm(US_FORMS, "FBAR"),
  },
  {
    name: "FATCA / Form 8938",
    authority: "IRS",
    filedWith: "Filed with your Form 1040",
    row: findForm(US_FORMS, "8938"),
  },
  {
    name: "India ITR",
    authority: "Income Tax Department of India",
    filedWith: "Filed on the Income Tax portal",
    row: findForm(INDIA_FORMS, "ITR-2"),
  },
  {
    name: "TDS refund (through India ITR)",
    authority: "Income Tax Department of India",
    filedWith: "Claimed by filing your India ITR",
    row: findForm(INDIA_FORMS, "TDS certificates"),
  },
  {
    name: "Form 10F / TRC",
    authority: "Income Tax Department of India",
    filedWith: "Form 10F filed on the Income Tax portal; TRC obtained via IRS Form 8802",
    row: findForm(INDIA_FORMS, "Form 10F"),
  },
  {
    name: "Form 15CA / 15CB",
    authority: "Income Tax Department of India",
    filedWith: "Filed before the bank processes a remittance",
    row: findForm(INDIA_FORMS, "Form 15CA"),
  },
  {
    name: "Form 67",
    authority: "Income Tax Department of India",
    filedWith: "Filed on the Income Tax portal with your ITR",
    row: findForm(INDIA_FORMS, "Form 67"),
  },
];
