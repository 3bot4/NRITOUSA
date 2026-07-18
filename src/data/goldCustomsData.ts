/**
 * Shared, EDITABLE config + content for /gold-limit-usa-to-india
 * (gold customs guide + duty calculator).
 *
 * IMPORTANT: Do NOT hardcode customs limits, duty rates, or exchange rates
 * anywhere else — every number the page or the calculator shows comes from
 * `goldDutyConfig` below so a rule change is a one-place edit. India's rules
 * changed materially with the Baggage Rules, 2026 (in force 02-Feb-2026,
 * Notification No. 14/2026-Customs (N.T.)): the old rupee-value caps on
 * duty-free jewellery were replaced by weight-only limits. The concessional
 * passenger duty comes from Notification No. 45/2025-Customs (24-Oct-2025).
 * Verify against cbic.gov.in on every review and bump GOLD_UPDATED* in
 * src/lib/nriEssentialsCluster.ts whenever anything here changes.
 *
 * Educational information only — not tax, legal, or customs advice. Actual
 * assessment is always at the customs officer's discretion.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Official sources ──────────────────────────── */

export const goldCustomsSources = {
  cbic: "https://www.cbic.gov.in/",
  cbicTravellersGuide:
    "https://www.cbic.gov.in/resources/htdocs-cbec/customs_clearance_of_passengers_at_a_glance.pdf",
  rbi: "https://www.rbi.org.in/",
} as const;

export const goldCustomsSourceLinks: { label: string; href: string }[] = [
  { label: "CBIC — Central Board of Indirect Taxes & Customs", href: goldCustomsSources.cbic },
  { label: "CBIC Guide: Customs Clearance of Passengers", href: goldCustomsSources.cbicTravellersGuide },
  { label: "Reserve Bank of India", href: goldCustomsSources.rbi },
];

/* ──────────────────────── THE duty config object ───────────────────────── *
 * Single source of truth for every constant the calculator uses.            */

export const goldDutyConfig = {
  /** ISO date the figures below were last verified against CBIC sources. */
  lastVerified: "2026-07-18",
  lastVerifiedHuman: "July 18, 2026",

  /* Duty-free jewellery allowance — Baggage Rules, 2026 (weight-only).
     Applies ONLY to jewellery/ornaments, and only to passengers of Indian
     origin (or Indian residents) returning after MORE than 1 year abroad. */
  freeJewelleryGramsWoman: 40,
  freeJewelleryGramsOther: 20,
  minMonthsAbroadForFreeAllowance: 12,

  /* Concessional duty route — Notification No. 45/2025-Customs (24-Oct-2025).
     Indian passport holders / persons of Indian origin returning after at
     least 6 months abroad may import up to 1 kg of gold on payment of duty
     in convertible foreign currency. */
  concessionalRatePct: 6,
  minMonthsAbroadForConcession: 6,
  maxGramsPerPassenger: 1000,

  /* Standard baggage rate applied when the passenger does not qualify for
     the concessional route (short stay abroad / conditions not met). */
  standardRatePct: 36,

  /* Display-only conversion for the ₹ estimate. Customs actually assesses
     duty on CBIC-notified tariff values and exchange rates, not your invoice
     — this is an approximation clearly labelled as such in the UI. */
  approxInrPerUsd: 88,
} as const;

export const GOLD_DISCLAIMER =
  "Estimates are based on CBIC rules as last verified on July 18, 2026. Customs limits, duty rates, and notifications change, and the actual assessment is always at the customs officer's discretion using CBIC tariff values. Verify current rules at cbic.gov.in before you travel. Educational information only — not tax, legal, or customs advice.";

/* ───────────────────── Quick-answer table (limits) ─────────────────────── */

export interface GoldLimitRow {
  traveler: string;
  dutyFree: string;
  condition: string;
  notes: string;
}

export const goldLimitRows: GoldLimitRow[] = [
  {
    traveler: "Woman (adult)",
    dutyFree: "Up to 40 g of gold jewellery",
    condition: "More than 1 year abroad",
    notes: "Weight-only limit under the Baggage Rules 2026 — the old ₹1,00,000 value cap no longer applies.",
  },
  {
    traveler: "Man (adult)",
    dutyFree: "Up to 20 g of gold jewellery",
    condition: "More than 1 year abroad",
    notes: "Weight-only limit under the Baggage Rules 2026 — the old ₹50,000 value cap no longer applies.",
  },
  {
    traveler: "Child",
    dutyFree: "Not separately carved out in the 2026 rules",
    condition: "Verify with CBIC before relying on it",
    notes: "Earlier rules gave children abroad 1+ year the same gender-based allowance; confirm current treatment.",
  },
  {
    traveler: "Any traveler — coins, bars, biscuits",
    dutyFree: "No duty-free allowance (0 g)",
    condition: "Duty always applies",
    notes: "Only jewellery/ornaments can be duty-free. Bullion in any form is always dutiable.",
  },
];

/* ───────────────────────── Duty-rate table rows ────────────────────────── */

export interface GoldDutyRateRow {
  scenario: string;
  rate: string;
  conditions: string;
}

export const goldDutyRateRows: GoldDutyRateRow[] = [
  {
    scenario: "Eligible passenger, up to 1 kg (jewellery beyond free allowance, coins, or bars)",
    rate: "≈ 6% (concessional)",
    conditions:
      "Indian passport holder / person of Indian origin, at least 6 months abroad, duty paid in convertible foreign currency — Notification No. 45/2025-Customs.",
  },
  {
    scenario: "Not eligible for the concession (e.g., less than 6 months abroad)",
    rate: "≈ 36% (standard baggage rate)",
    conditions: "Standard baggage duty applies; conditions and rates per current CBIC notifications.",
  },
  {
    scenario: "Above 1 kg per passenger",
    rate: "Not permitted under the passenger route",
    conditions: "The eligible-passenger concession is capped at 1 kg. Amounts above this need commercial import channels.",
  },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * These exact strings render on-page (ToolFaq) AND in FAQPage JSON-LD, so
 * the schema always matches the visible text word-for-word.                 */

export const goldFaqs: FaqItem[] = [
  {
    question: "How much gold can I carry from USA to India?",
    answer:
      "As of July 2026, if you have lived outside India for more than 1 year, you can generally carry duty-free gold jewellery by weight — up to 40 grams for women and up to 20 grams for other passengers — under the Baggage Rules 2026. Beyond that, eligible passengers may bring up to 1 kg total by paying customs duty. Verify current limits at cbic.gov.in before you fly.",
  },
  {
    question: "How much gold can I carry to India without duty?",
    answer:
      "Only gold jewellery qualifies for the duty-free allowance — typically 40 grams for women and 20 grams for other passengers, provided you stayed abroad for more than 1 year. As of the Baggage Rules 2026, these are weight-only limits; the old rupee-value caps were removed. Gold coins, bars, and biscuits are never duty-free. Verify the current rules with CBIC before travel.",
  },
  {
    question: "How much gold can I take to India from USA in checked baggage?",
    answer:
      "The customs limits are the same whether gold is worn, in hand baggage, or in checked baggage — generally up to 1 kg per eligible passenger, with duty payable above the jewellery allowance. That said, checked baggage is risky for gold: airline liability for valuables is limited, and theft is hard to recover. Most travelers carry gold on their person and declare it where required.",
  },
  {
    question: "How much gold can we carry to India as a family?",
    answer:
      "Limits apply per passenger — there is no pooling. Each family member gets only their own allowance based on their own stay abroad: typically 40 grams of jewellery for a woman and 20 grams for other passengers, as of July 2026. A couple cannot combine allowances to cover one 60-gram necklace carried by one person. Duty on any excess is assessed traveler by traveler.",
  },
  {
    question: "How much gold can be taken to India in the form of coins or bars?",
    answer:
      "Gold coins, bars, and biscuits get no duty-free allowance. As of Notification No. 45/2025-Customs, an eligible passenger — Indian passport holder or person of Indian origin returning after at least 6 months abroad — may bring up to 1 kg of gold by paying roughly 6% duty in convertible foreign currency. It must be declared at the Red Channel on arrival.",
  },
  {
    question: "Do I have to declare gold jewellery I am wearing when I land in India?",
    answer:
      "Personal jewellery within your duty-free allowance can generally go through the Green Channel without declaration. Anything beyond the allowance — extra jewellery, coins, or bars — must be declared at the Red Channel, and the 2026 rules add an electronic baggage declaration (Form CBD-I). When in doubt, declare: the officer's assessment controls, and undeclared excess gold risks seizure and penalties.",
  },
  {
    question: "What is the customs duty rate on gold brought to India above the free allowance?",
    answer:
      "As of July 2026, eligible passengers (at least 6 months abroad, up to 1 kg, duty paid in convertible foreign currency) pay a concessional rate of about 6% under Notification No. 45/2025-Customs. Passengers who do not meet those conditions face the standard baggage rate of roughly 36%. Rates change by notification — verify the current figure at cbic.gov.in before you travel.",
  },
];
