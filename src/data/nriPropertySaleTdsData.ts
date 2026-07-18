/**
 * Shared, EDITABLE config + content for /nri-selling-property-in-india-tds
 * (NRI property sale: TDS, capital gains, US reporting, repatriation).
 *
 * IMPORTANT: Never hardcode TDS/tax rates in the page or estimator — every
 * figure comes from this file. Verified 2026-07-18:
 *  - Finance (No. 2) Act, 2024: LTCG on immovable property 12.5% without
 *    indexation for transfers on/after 23-Jul-2024; the transitional option
 *    to compute under the old 20%-with-indexation method was limited to
 *    RESIDENT individuals/HUF — nonresidents generally do not get it.
 *    (Confirmed in CBDT ITR-2 validation rules, AY 2025-26.)
 *  - Income-tax Act, 2025 in force 01-Apr-2026: s.195 (1961) → s.393(2).
 *  - Finance Act 2026: amends s.397(1)(c) of the 2025 Act so that from
 *    01-Oct-2026 a RESIDENT INDIVIDUAL/HUF buyer purchasing immovable
 *    property from a nonresident can use a PAN-based challan-cum-statement
 *    (26QB pattern) instead of TAN + Form 27Q. Companies/firms still need
 *    TAN. Frame as "subject to the enacted provision and operational rules".
 *  - Surcharge legally depends on the seller's income circumstances, NOT the
 *    sale price. Sale-value bands are shown ONLY as illustrative withholding
 *    assumptions, labeled as such, with assumptions stated above the table.
 *  - Form 13 (lower/nil deduction): the principal seller-side route; no
 *    statutory processing deadline — any timeline shown is experience-based.
 *  - Forms 15CA/15CB: keep the current names; do NOT claim they were
 *    renumbered (no official notification confirming that was located).
 *
 * Educational information only — not tax or legal advice.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Official sources ──────────────────────────── */

export const nriTdsSources = {
  incomeTaxPortal: "https://www.incometax.gov.in/iec/foportal/",
  ldcGuidance:
    "https://www.incometaxindia.gov.in/w/certificate-of-lower/no-deduction-of-tax-at-source",
  itr2ValidationRules:
    "https://www.incometax.gov.in/iec/foportal/sites/default/files/2025-07/CBDT__e-Filing_ITR%202_Validation%20Rules_AY%202025-26_V1.0.pdf",
  rbi: "https://www.rbi.org.in/",
  irsFtc: "https://www.irs.gov/individuals/international-taxpayers/foreign-tax-credit",
  irs1116: "https://www.irs.gov/forms-pubs/about-form-1116",
} as const;

export const nriTdsSourceLinks: { label: string; href: string }[] = [
  { label: "Income Tax Department e-filing portal", href: nriTdsSources.incomeTaxPortal },
  { label: "Lower/no TDS certificate — official guidance", href: nriTdsSources.ldcGuidance },
  { label: "CBDT ITR-2 validation rules (12.5% LTCG for NRIs)", href: nriTdsSources.itr2ValidationRules },
  { label: "Reserve Bank of India — FEMA remittance rules", href: nriTdsSources.rbi },
  { label: "IRS — Foreign Tax Credit", href: nriTdsSources.irsFtc },
  { label: "IRS — Form 1116", href: nriTdsSources.irs1116 },
];

export const NRI_TDS_DISCLAIMER =
  "Indian TDS and capital gains rates, surcharge rules, section numbers, and forms change with Finance Acts and notifications — the figures here were last verified on July 18, 2026 against the sources linked on this page. Surcharge in particular depends on the seller's own income circumstances, and joint ownership requires seller-by-seller analysis. A property sale is a high-value transaction: engage a qualified CA in India and a cross-border CPA in the US before acting. Educational information only — not tax or legal advice.";

/* ──────────────────────────── Rate config ──────────────────────────────── */

export const nriTdsConfig = {
  lastVerified: "2026-07-18",
  lastVerifiedHuman: "July 18, 2026",
  /** Holding period that makes immovable-property gains long-term (months). */
  ltcgHoldingMonths: 24,
  /** LTCG rate for transfers on/after 23-Jul-2024 (no indexation for NRIs). */
  ltcgBasePct: 12.5,
  /** Law-change date for the 12.5% regime. */
  ltcgRegimeDate: "2024-07-23",
  /** STCG: slab-taxed; 30% is the common conservative planning assumption. */
  stcgPlanningPct: 30,
  cessPct: 4,
  /** Surcharge slabs (individual sellers), by aggregate income; LTCG surcharge capped at 15%. */
  surchargeSlabs: [
    { threshold: 5_000_000, pct: 0 },
    { threshold: 10_000_000, pct: 10 },
    { threshold: Infinity, pct: 15 },
  ],
  ltcgSurchargeCapPct: 15,
  /** Old→new law mapping (Income-tax Act, 2025, in force 01-Apr-2026). */
  sectionOld: "Section 195 (Income-tax Act, 1961)",
  sectionNew: "Section 393(2) (Income-tax Act, 2025)",
  /** Buyer TAN change (Finance Act 2026 amending s.397(1)(c), IT Act 2025). */
  tanChangeDate: "October 1, 2026",
  /** NRO repatriation ceiling per financial year (USD). */
  repatriationLimitUsd: "USD 1 million",
} as const;

/* ─────────────── Three concepts that get conflated ─────────────────────── */

export const threeConcepts = [
  {
    title: "1. Capital-gains tax rate",
    body: "The rate that determines your FINAL Indian tax on the actual gain — as of July 2026, 12.5% (plus surcharge and cess) for long-term transfers on or after July 23, 2024, slab rates for short-term. Applied to your gain, not the price.",
  },
  {
    title: "2. Withholding (TDS)",
    body: "What the buyer deducts and deposits when paying you. Without a lower/nil certificate, buyers commonly withhold using the gross amount payable, because they cannot independently establish your taxable gain. This is a prepayment, not the tax itself.",
  },
  {
    title: "3. Final tax liability",
    body: "What you actually owe after cost, improvement and transfer expenses, exemptions, losses, surcharge, and cess — settled when you file your Indian return. Excess withholding comes back as a refund; a shortfall is payable.",
  },
] as const;

/* ─────────────── LTCG withholding table (ILLUSTRATIVE) ─────────────────── */

export interface TdsRateRow {
  saleValue: string;
  surcharge: string;
  effectiveRate: string;
  note: string;
}

/**
 * ILLUSTRATIVE withholding assumptions only. Surcharge is legally driven by
 * the seller's income circumstances and statutory assumptions — not by the
 * property's price. These bands reflect common buyer-side withholding
 * practice using the payment amount as the reference. State this above the
 * table wherever it renders.
 */
export const ltcgTdsRows: TdsRateRow[] = [
  {
    saleValue: "Payment up to ₹50 lakh",
    surcharge: "Nil assumed",
    effectiveRate: "≈ 13.0%",
    note: "12.5% + 4% cess, assuming no surcharge.",
  },
  {
    saleValue: "Payment ₹50 lakh – ₹1 crore",
    surcharge: "10% assumed",
    effectiveRate: "≈ 14.3%",
    note: "12.5% × 1.10 + 4% cess.",
  },
  {
    saleValue: "Payment above ₹1 crore",
    surcharge: "15% assumed",
    effectiveRate: "≈ 14.95%",
    note: "Surcharge on LTCG is capped at 15%, so the illustration tops out here.",
  },
];

export const stcgRow: TdsRateRow = {
  saleValue: "Any value — property held ≤ 24 months (short-term)",
  surcharge: "As applicable",
  effectiveRate: "≈ 31.2% – 39%",
  note: "Short-term gains are slab-taxed; buyers commonly withhold at 30% + surcharge + cess as a conservative practice.",
};

/* ─────────────────── Form 13 (lower TDS) step rows ─────────────────────── */

export interface Form13Step {
  step: string;
  detail: string;
  timing: string;
}

export const form13Steps: Form13Step[] = [
  {
    step: "1. Compute your actual expected capital gain",
    detail:
      "Your CA works out the real gain (sale price minus acquisition cost, improvement cost, and eligible transfer expenses, with any exemptions) and the tax on it — usually far below withholding on the full sale value.",
    timing: "Before listing, ideally",
  },
  {
    step: "2. File Form 13 online with the Assessing Officer (International Taxation)",
    detail:
      "Application for a lower or nil deduction certificate via the e-filing/TRACES route, with the sale agreement, cost proofs, and computation attached. The buyer's details (PAN) are needed, so have a buyer identified.",
    timing: "As soon as a buyer is identified",
  },
  {
    step: "3. Respond to AO queries",
    detail:
      "The officer may ask for prior returns, the purchase deed, bank statements, or a revised computation. Prompt replies keep the file moving.",
    timing: "1–3 rounds, typically",
  },
  {
    step: "4. Certificate issued; buyer deducts at the certificate rate",
    detail:
      "The certificate names the buyer and a rate matched to your expected liability. Registration and payment can then close with withholding at that rate instead of ~13–15% of the full price.",
    timing: "Processing varies by jurisdiction — no statutory deadline; many families plan for several weeks",
  },
];

/* ───────────────────── Joint-ownership examples ────────────────────────── */

export interface OwnershipExample {
  title: string;
  detail: string;
}

export const ownershipExamples: OwnershipExample[] = [
  {
    title: "One NRI seller, one buyer",
    detail:
      "The base case: the buyer deducts on payments to the NRI seller at the applicable rate (or the certificate rate), deposits it, files the required statement, and issues the TDS certificate. One seller, one compliance trail.",
  },
  {
    title: "Two NRI sellers, equal ownership",
    detail:
      "Compliance is seller-by-seller: each seller's 50% share is analyzed separately — separate certificate applications, separate withholding computations, separate TDS credits, separate Indian returns. One brother's Form 13 certificate does not cover the other's share.",
  },
  {
    title: "One resident seller + one NRI seller",
    detail:
      "Two different regimes on one deal: the resident's share follows the resident TDS process, while the NRI's share follows the nonresident process. Buyers who apply the resident treatment to the whole price face the shortfall personally.",
  },
  {
    title: "Two buyers purchasing from one NRI seller",
    detail:
      "Each buyer is a deductor for the payments they make. Both need their own deposit-and-statement compliance (TAN-based, or PAN-based for eligible individual/HUF buyers from October 1, 2026), even if one spouse funds most of the price.",
  },
  {
    title: "Unequal ownership (e.g., 70/30)",
    detail:
      "Withholding and gains follow beneficial ownership, which may differ from what the sale deed's face suggests — funding history matters. Document each seller's percentage early; the buyer needs it to withhold correctly on each share.",
  },
  {
    title: "Sale price paid in installments",
    detail:
      "Deduction obligations generally attach at each payment or credit, not once at registration. An advance paid in March and the balance in June are two compliance events — a certificate obtained after the advance does not retroactively fix the first deduction.",
  },
];

/* ───────────────────── Transaction timeline ────────────────────────────── */

export interface TimelineStep {
  phase: string;
  detail: string;
}

export const transactionTimeline: TimelineStep[] = [
  { phase: "Before listing", detail: "Confirm your residency status for the year, ownership shares, PAN, and cost records (purchase deed, improvement invoices). Inherited property: document the prior owner's holding and cost basis." },
  { phase: "Buyer identified", detail: "Compute the expected gain with your CA and file Form 13 for a lower/nil certificate if the default withholding would far exceed your real liability." },
  { phase: "Before agreement / closing", detail: "Settle the certificate, the withholding rate, the buyer's TAN or PAN-based process, and how payments will be allocated between sellers." },
  { phase: "At each payment or credit", detail: "The buyer deducts at the applicable or certificate rate on that payment — installments and advances included." },
  { phase: "After deduction", detail: "The buyer deposits the tax and files the correct statement; you collect the TDS certificate and verify the credit appears against your PAN (Form 26AS/AIS)." },
  { phase: "Return season", detail: "File your Indian return, compute the actual gain and tax, and claim the refund if withholding exceeded your liability." },
  { phase: "Repatriation", detail: "With tax compliance documented, complete the bank's file — CA certificate (Form 15CB where required), Form 15CA, source documents — within the USD 1 million per financial year facility for eligible NRO funds." },
  { phase: "US filing", detail: "Report the sale on your US return for the year of sale, recomputed under US rules, and evaluate the foreign tax credit (Form 1116) with a cross-border CPA." },
];

/* ───────────────────────── Checklists ──────────────────────────────────── */

export interface Checklist {
  id: string;
  title: string;
  items: string[];
}

export const tdsChecklists: Checklist[] = [
  {
    id: "form13-docs",
    title: "Form 13 (lower/nil TDS certificate) — document checklist",
    items: [
      "PAN (active, linked, and registered on the e-filing portal)",
      "Draft or executed sale agreement with the price and payment schedule",
      "Buyer's name, address, and PAN (the certificate names the buyer)",
      "Purchase deed showing your acquisition date and cost",
      "Improvement cost invoices, if claimed",
      "Estimated transfer expenses (brokerage, legal)",
      "Capital gains computation prepared by your CA",
      "Prior Indian tax returns, if filed",
      "Details of planned Section 54/54EC reinvestment, if claiming",
      "Bank account details for correspondence",
    ],
  },
  {
    id: "seller-preclosing",
    title: "NRI seller — pre-closing checklist",
    items: [
      "Residency status for the financial year confirmed with your CA",
      "Ownership share and funding history documented",
      "Form 13 certificate obtained (or the withholding math accepted)",
      "Certificate names this buyer and covers the payment schedule",
      "NRO account ready to receive proceeds",
      "TDS certificate collection and 26AS/AIS verification planned",
      "Repatriation paperwork discussed with the bank in advance",
      "US tax treatment reviewed with a cross-border CPA before closing",
    ],
  },
  {
    id: "buyer-compliance",
    title: "Buyer — TDS compliance checklist (NRI seller)",
    items: [
      "Confirmed the seller is a nonresident (residency drives the regime)",
      "Correct rate determined — or certificate verified (names you, your PAN, in-force dates)",
      "TAN obtained — or, for eligible resident individual/HUF buyers from October 1, 2026, the PAN-based challan-cum-statement route confirmed",
      "Deduction applied on every payment including advances and installments",
      "Tax deposited within the prescribed time after each deduction",
      "Required TDS statement filed for each quarter with payments",
      "TDS certificate issued to the seller",
      "Professional advice taken — buyer-side liability for shortfalls is personal",
    ],
  },
  {
    id: "repatriation-docs",
    title: "Repatriation — document checklist",
    items: [
      "Sale deed and proof the property was held per FEMA rules",
      "Evidence of the original purchase and payment source",
      "TDS certificates / proof of Indian tax compliance on the sale",
      "CA certificate (Form 15CB), where required for the remittance",
      "Form 15CA filed (the applicable part depends on the payment)",
      "Bank's remittance application for the NRO-to-abroad transfer",
      "Running total of this financial year's remittances vs the USD 1 million facility",
    ],
  },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * Exact strings rendered on-page AND emitted in FAQPage JSON-LD.            */

export const nriTdsFaqs: FaqItem[] = [
  {
    question: "What is the TDS rate on sale of property by an NRI?",
    answer:
      "As of July 2026, for property held more than 24 months, buyers withhold at 12.5% plus applicable surcharge and 4% cess — in common practice about 13% to 14.95% of the payment, depending on surcharge assumptions. Short-term sales are commonly withheld around 31.2%–39%. The exact surcharge legally depends on the seller's income circumstances, not just the price, and rates change with Finance Acts — verify at incometax.gov.in.",
  },
  {
    question: "How can an NRI reduce or avoid excess TDS on the sale of property in India?",
    answer:
      "The principal seller-side route is a lower or nil deduction certificate: apply in Form 13 to the Assessing Officer (International Taxation) before payments are made, showing your actual expected capital gain. The certificate lets the buyer withhold tax matched to your expected liability instead of ~13–15% of the full price. There is no statutory processing deadline — many families plan for several weeks — so apply as soon as a buyer is identified.",
  },
  {
    question: "Is TDS deducted on the full sale value or only the capital gain for NRIs?",
    answer:
      "The law — Section 195 of the Income-tax Act, 1961, and Section 393(2) of the Income-tax Act, 2025 for deductions from April 2026 — applies to sums chargeable to tax. In practice, without an Assessing Officer's lower/nil certificate, buyers commonly withhold using the gross amount payable, because they cannot independently establish your taxable gain. A Form 13 certificate is how the deduction gets aligned with your actual gain in advance.",
  },
  {
    question: "What are the US tax implications when an NRI sells property in India?",
    answer:
      "If you are a US tax resident (citizen, green card holder, or resident alien), the sale is reportable on your US return in the year of sale, with the gain recomputed under US rules in dollars — purchase and sale translated at their own historical exchange rates, and no Indian indexation. India taxes the same gain, so the US-India treaty and the foreign tax credit (typically via Form 1116, subject to its limits) generally prevent double taxation. Use a cross-border CPA.",
  },
  {
    question: "How does an NRI repatriate money to the USA after selling property in India?",
    answer:
      "Sale proceeds are credited to your NRO account. From there, banks generally permit remitting up to USD 1 million per financial year for eligible funds under RBI's FEMA rules, supported by Form 15CA and, where required, a CA certificate in Form 15CB. It is a facility subject to bank review, source documentation, and tax compliance — not an automatic right to wire any sale amount immediately — so start the paperwork conversation with your bank early.",
  },
  {
    question: "What is Form 13 and how long does a lower TDS certificate take?",
    answer:
      "Form 13 is the online application asking the Assessing Officer to authorize the buyer to withhold at a lower or nil rate matched to your expected capital gains liability, instead of the default deduction on the gross payment. There is no government-guaranteed timeline: processing varies by jurisdiction and how quickly you answer queries. As a planning matter, many practitioners suggest allowing several weeks — build it into your sale timeline rather than around it.",
  },
];
