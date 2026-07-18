/**
 * Shared, EDITABLE config + content for /nri-selling-property-in-india-tds
 * (NRI property sale: TDS, capital gains, US reporting, repatriation).
 *
 * IMPORTANT: Never hardcode TDS/tax rates in the page — every figure comes
 * from this file. Indian rates changed twice recently and WILL change again:
 *   - Finance (No. 2) Act, 2024: LTCG on property cut to 12.5% (no
 *     indexation) for transfers on/after 23-Jul-2024.
 *   - Income-tax Act, 2025 (in force 01-Apr-2026): Section 195 is now
 *     Section 393(2); several forms renumbered; buyer TAN requirement ends
 *     01-Oct-2026.
 * Verify against incometax.gov.in on every review and bump NRI_TDS_UPDATED*
 * in src/lib/nriEssentialsCluster.ts whenever anything here changes.
 *
 * Educational information only — not tax or legal advice.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Official sources ──────────────────────────── */

export const nriTdsSources = {
  incomeTaxPortal: "https://www.incometax.gov.in/",
  incomeTaxIntl: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
  rbi: "https://www.rbi.org.in/",
  irsFtc: "https://www.irs.gov/individuals/international-taxpayers/foreign-tax-credit",
  irs1116: "https://www.irs.gov/forms-pubs/about-form-1116",
} as const;

export const nriTdsSourceLinks: { label: string; href: string }[] = [
  { label: "Income Tax Department (incometax.gov.in)", href: nriTdsSources.incomeTaxPortal },
  { label: "Reserve Bank of India (remittance rules)", href: nriTdsSources.rbi },
  { label: "IRS — Foreign Tax Credit", href: nriTdsSources.irsFtc },
  { label: "IRS — Form 1116", href: nriTdsSources.irs1116 },
];

export const NRI_TDS_DISCLAIMER =
  "Indian TDS and capital gains rates, surcharge slabs, section numbers, and forms change with Finance Acts and notifications — the figures here were last verified on July 18, 2026 against the sources linked at the end of this page. A property sale is a high-value transaction: engage a qualified CA in India and a cross-border CPA in the US before acting. Educational information only — not tax or legal advice.";

/* ──────────────────────────── Rate config ──────────────────────────────── */

export const nriTdsConfig = {
  lastVerified: "2026-07-18",
  lastVerifiedHuman: "July 18, 2026",
  /** Holding period that makes property gains long-term. */
  ltcgHoldingMonths: 24,
  /** LTCG base rate for transfers on/after 23-Jul-2024 (no indexation). */
  ltcgBasePct: 12.5,
  /** STCG: taxed at slab rates; buyers commonly deduct at the top slab. */
  stcgBasePct: 30,
  cessPct: 4,
  /** Old→new law mapping (Income-tax Act, 2025, in force 01-Apr-2026). */
  sectionOld: "Section 195 (Income-tax Act, 1961)",
  sectionNew: "Section 393(2) (Income-tax Act, 2025)",
  /** Buyer TAN requirement ends for NRI-seller deals on this date. */
  tanRemovalDate: "October 1, 2026",
  /** NRO repatriation ceiling per financial year (USD). */
  repatriationLimitUsd: "USD 1 million",
} as const;

/* ─────────────── LTCG effective TDS by sale-value slab ─────────────────── */

export interface TdsRateRow {
  saleValue: string;
  surcharge: string;
  effectiveRate: string;
  note: string;
}

/** Long-term (held > 24 months), transfers on/after 23-Jul-2024. */
export const ltcgTdsRows: TdsRateRow[] = [
  {
    saleValue: "Up to ₹50 lakh",
    surcharge: "Nil",
    effectiveRate: "≈ 13.0%",
    note: "12.5% + 4% cess. No surcharge below ₹50 lakh.",
  },
  {
    saleValue: "₹50 lakh – ₹1 crore",
    surcharge: "10%",
    effectiveRate: "≈ 14.3%",
    note: "12.5% × 1.10 + 4% cess.",
  },
  {
    saleValue: "Above ₹1 crore",
    surcharge: "15%",
    effectiveRate: "≈ 14.95%",
    note: "Surcharge on LTCG is capped at 15%, so the effective rate tops out here.",
  },
];

export const stcgRow: TdsRateRow = {
  saleValue: "Any value — property held ≤ 24 months (short-term)",
  surcharge: "As applicable",
  effectiveRate: "≈ 31.2% – 39%",
  note: "Short-term gains are taxed at slab rates; buyers commonly deduct at 30% + surcharge + cess.",
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
    detail: "Your CA works out the real gain (sale price minus indexed/actual cost and eligible expenses) and the tax on it — usually far below TDS on the full sale value.",
    timing: "Before listing, ideally",
  },
  {
    step: "2. File Form 13 online on the TRACES/e-filing portal",
    detail: "Application to the jurisdictional Assessing Officer (International Taxation) for a lower or nil deduction certificate, with the sale agreement, cost proofs, and computation attached. The buyer's details (PAN) are needed, so have a buyer identified.",
    timing: "As soon as a buyer is identified",
  },
  {
    step: "3. Respond to AO queries",
    detail: "The officer may ask for prior returns, purchase deed, bank statements, or a revised computation. Prompt replies keep the clock moving.",
    timing: "1–3 rounds, typically",
  },
  {
    step: "4. Certificate issued; buyer deducts at the certificate rate",
    detail: "The certificate names the buyer and a rate matched to your actual tax liability. Registration and payment can then close with TDS at that rate instead of ~13–15% of the full price.",
    timing: "Commonly 3–8 weeks end to end",
  },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * Exact strings rendered on-page AND emitted in FAQPage JSON-LD.            */

export const nriTdsFaqs: FaqItem[] = [
  {
    question: "What is the TDS rate on sale of property by an NRI?",
    answer:
      "As of July 2026, for property held more than 24 months, the buyer must deduct TDS at 12.5% plus surcharge and 4% cess — effectively about 13% up to ₹50 lakh, 14.3% between ₹50 lakh and ₹1 crore, and 14.95% above ₹1 crore. Short-term sales face roughly 31.2%–39%. Rates change with Finance Acts — verify at incometax.gov.in.",
  },
  {
    question: "How can an NRI reduce or avoid excess TDS on the sale of property in India?",
    answer:
      "The legal route is a lower or nil TDS certificate: apply in Form 13 to the Assessing Officer (International Taxation) before the sale closes, showing your actual expected capital gain. The certificate lets the buyer deduct tax matched to your real liability instead of ~13–15% of the full sale price. Certificates commonly take 3–8 weeks, so apply as soon as a buyer is identified.",
  },
  {
    question: "Is TDS deducted on the full sale value or only the capital gain for NRIs?",
    answer:
      "By default, on the full sale value. When the seller is an NRI, the buyer deducts under Section 195 of the Income-tax Act, 1961 — Section 393(2) of the Income-tax Act, 2025 from April 2026 — which works on the entire sale consideration, not the gain. That is why a lower-TDS certificate (Form 13) matters: it is the only mechanism that aligns the deduction with your actual gain.",
  },
  {
    question: "What are the US tax implications when an NRI sells property in India?",
    answer:
      "If you are a US tax resident (citizen, green card holder, or resident alien), the sale is reportable on your US return in the year of sale, with gain computed under US rules in dollars. India taxes the same gain, so the US-India tax treaty and the foreign tax credit (typically via Form 1116) generally prevent double taxation, though timing and rate mismatches can leave residual US tax. Use a cross-border CPA.",
  },
  {
    question: "How does an NRI repatriate money to the USA after selling property in India?",
    answer:
      "Sale proceeds are credited to your NRO account. From there, banks generally allow remittance of up to USD 1 million per financial year under RBI rules, supported by a CA certificate in Form 15CB and your own Form 15CA (renumbered under the Income-tax Act, 2025 — your CA will use the current forms). Ensure the TDS or certificate paperwork is complete first; banks check before remitting.",
  },
  {
    question: "What is Form 13 and how long does a lower TDS certificate take?",
    answer:
      "Form 13 is the online application asking the Assessing Officer to authorize the buyer to deduct TDS at a lower or nil rate that matches your actual capital gains liability, instead of the default deduction on the full sale price. As of July 2026 it commonly takes about 3–8 weeks depending on the jurisdiction and how quickly you answer queries — build it into your sale timeline.",
  },
];
