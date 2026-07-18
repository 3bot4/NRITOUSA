/**
 * Shared, EDITABLE config + content for /gold-limit-usa-to-india
 * (gold customs guide + duty calculator).
 *
 * IMPORTANT: Do NOT hardcode customs limits, duty rates, or exchange rates
 * anywhere else — every number the page or the calculator shows comes from
 * `goldDutyConfig` below so a rule change is a one-place edit.
 *
 * Verified against primary sources on 2026-07-18:
 *  - Baggage Rules, 2026 — Notification No. 14/2026-Customs (N.T.),
 *    01-Feb-2026, in force 02-Feb-2026 (gazette text read verbatim):
 *      Rule 2(1)(f): "jewellery" = articles of adornment ordinarily worn,
 *        made of gold, silver, platinum or other precious metals, studded
 *        or not.
 *      Rule 6: duty-free jewellery for "a resident or tourist of Indian
 *        origin residing abroad for more than one year, on return to India"
 *        — 40 g female passenger / 20 g other passenger, bona fide baggage.
 *        Weight-only (the 2016 rupee-value caps were not carried forward).
 *      Rule 5 Explanation: free allowances cannot be pooled.
 *      Annexure-I item 5: gold/silver in any form other than ornaments is
 *        excluded from the free-allowance rules.
 *      Rule 4(1): articles taken out of India earlier re-import free of duty
 *        on a departure declaration, subject to officer satisfaction.
 *  - Notification No. 45/2025-Customs (G.S.R. 781(E), 24-Oct-2025): eligible
 *    passenger (Indian origin / valid Indian passport, ≥6 months abroad) may
 *    import up to 1 kg of gold, duty paid in convertible foreign currency;
 *    the passenger-gold entries carry 5% duty (bars with engraved serial
 *    numbers and coins ≥99.5% purity; and other forms including tola bars
 *    and ornaments, excluding stone-studded ornaments). AIDC of 1% applies
 *    to gold separately → ≈6% total.
 *  - The standard baggage assessment for passengers who do NOT qualify could
 *    not be tied to a single current official entry from here; it is treated
 *    below as an ILLUSTRATIVE assumption (commonly cited around 36%) and the
 *    page says so. Never present it as a verified rate.
 *
 * Educational information only — not tax, legal, or customs advice. Actual
 * assessment is always at the customs officer's discretion.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Official sources ──────────────────────────── */

export const goldCustomsSources = {
  baggageRules2026Pdf: "https://www.indiabudget.gov.in/doc/cen/cus1426.pdf",
  cbic: "https://www.cbic.gov.in/",
  cbicTravellersGuide:
    "https://www.cbic.gov.in/resources/htdocs-cbec/customs_clearance_of_passengers_at_a_glance.pdf",
  rbi: "https://www.rbi.org.in/",
} as const;

export const goldCustomsSourceLinks: { label: string; href: string }[] = [
  { label: "Baggage Rules, 2026 — official gazette PDF", href: goldCustomsSources.baggageRules2026Pdf },
  { label: "CBIC — Central Board of Indirect Taxes & Customs", href: goldCustomsSources.cbic },
  { label: "CBIC Guide: Customs Clearance of Passengers", href: goldCustomsSources.cbicTravellersGuide },
];

/* ──────────────────────── THE duty config object ───────────────────────── *
 * Single source of truth for every constant the calculator uses.            */

export const goldDutyConfig = {
  /** ISO date the figures below were last verified against official sources. */
  lastVerified: "2026-07-18",
  lastVerifiedHuman: "July 18, 2026",

  /* Duty-free jewellery allowance — Rule 6, Baggage Rules 2026 (weight-only).
     Applies ONLY to jewellery (precious-metal articles of adornment), and
     ONLY to a resident or tourist of Indian origin residing abroad for MORE
     than one year, returning to India. Per passenger; never pooled. */
  freeJewelleryGramsFemale: 40,
  freeJewelleryGramsOther: 20,
  minMonthsAbroadForFreeAllowance: 12,

  /* Concessional passenger-gold route — Notification No. 45/2025-Customs
     (G.S.R. 781(E), 24-Oct-2025). Components shown separately so the
     calculator can display the formula, not just a total. */
  concessionalBcdPct: 5,
  concessionalAidcPct: 1,
  get concessionalRatePct() {
    return this.concessionalBcdPct + this.concessionalAidcPct; // ≈6%
  },
  minMonthsAbroadForConcession: 6,
  maxGramsPerPassenger: 1000,

  /* ILLUSTRATIVE ONLY: assessment when the passenger does not qualify for
     the concessional route. Commonly cited around 36%, but we could not tie
     this to a single current official entry — the page and calculator label
     it as an assumption and tell readers to confirm with Customs. */
  standardRatePctIllustrative: 36,

  /* Display-only conversion for the ₹ estimate. Customs actually assesses
     duty on CBIC-notified tariff values and notified exchange rates — this
     approximation is clearly labelled as such in the UI. */
  approxInrPerUsd: 88,
} as const;

export const GOLD_DISCLAIMER =
  "Estimates are based on official customs sources as last verified on July 18, 2026 (Baggage Rules 2026; Notification No. 45/2025-Customs). Customs limits, duty rates, tariff values, and notifications change, and the actual assessment is always at the customs officer's discretion using CBIC-notified tariff values — not your purchase receipt. Verify current rules at cbic.gov.in before you travel. Educational information only — not tax, legal, or customs advice.";

/* ───────────────────── Quick-answer table (limits) ─────────────────────── */

export interface GoldLimitRow {
  traveler: string;
  dutyFree: string;
  condition: string;
  notes: string;
}

export const goldLimitRows: GoldLimitRow[] = [
  {
    traveler: "Eligible female passenger",
    dutyFree: "Up to 40 g of qualifying jewellery",
    condition: "Resident or tourist of Indian origin, abroad more than 1 year, returning to India",
    notes: "Rule 6, Baggage Rules 2026. Weight-only — the old ₹1,00,000 value cap was not carried forward.",
  },
  {
    traveler: "Other eligible passenger",
    dutyFree: "Up to 20 g of qualifying jewellery",
    condition: "Resident or tourist of Indian origin, abroad more than 1 year, returning to India",
    notes: "Rule 6, Baggage Rules 2026. Weight-only — the old ₹50,000 value cap was not carried forward.",
  },
  {
    traveler: "Traveler who does not meet the 1-year test",
    dutyFree: "No jewellery allowance",
    condition: "Allowance is passenger-specific — not every international traveler gets it",
    notes: "Short-stay visitors and returning residents under 1 year abroad pay duty on jewellery beyond personal effects.",
  },
  {
    traveler: "Any traveler — coins, bars, biscuits, bullion",
    dutyFree: "No duty-free allowance (0 g)",
    condition: "Duty always applies; declare at the Red Channel",
    notes: "Rule 6 covers jewellery only. Gold or silver in any form other than ornaments is excluded (Annexure-I).",
  },
];

/* ─────────────── Jewellery vs bullion comparison table ─────────────────── */

export interface GoldFormRow {
  item: string;
  allowanceApplies: string;
  note: string;
}

export const goldFormRows: GoldFormRow[] = [
  {
    item: "Gold jewellery (worn or packed)",
    allowanceApplies: "Potentially — if the passenger qualifies",
    note: "Within 40 g / 20 g for an eligible passenger (abroad >1 year). Beyond that, duty applies on the excess.",
  },
  {
    item: "Other precious-metal jewellery (silver, platinum, studded)",
    allowanceApplies: "Potentially — same jewellery definition",
    note: "The rules define jewellery as precious-metal articles of adornment, studded or not — but stone-studded ornaments are excluded from the concessional duty-paid gold route.",
  },
  {
    item: "Gold coins",
    allowanceApplies: "No jewellery allowance",
    note: "Declare and pay duty. Coins ≥99.5% purity fall under the concessional passenger-gold entry if you qualify.",
  },
  {
    item: "Gold bars / biscuits",
    allowanceApplies: "No jewellery allowance",
    note: "Declare and pay duty. Serial-numbered bars fall under the concessional passenger-gold entry if you qualify.",
  },
  {
    item: "Previously exported personal jewellery",
    allowanceApplies: "Separate re-import route",
    note: "Jewellery taken OUT of India earlier can re-enter free of duty against a declaration made at departure (Rule 4) — get an export certificate before you leave India.",
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
    scenario: "Eligible passenger, up to 1 kg (jewellery beyond the free allowance, coins ≥99.5%, serial-numbered bars)",
    rate: "5% duty + 1% AIDC ≈ 6%",
    conditions:
      "Indian origin or valid Indian passport, at least 6 months abroad, duty paid in convertible foreign currency, declared on arrival — passenger-gold entries of Notification No. 45/2025-Customs (G.S.R. 781(E), 24-Oct-2025).",
  },
  {
    scenario: "Not eligible for the concession (e.g., under 6 months abroad)",
    rate: "Substantially higher — confirm with Customs",
    conditions:
      "The general baggage/import assessment applies; commonly cited around 36%, but verify the current figure with Customs before travel — we could not tie it to a single current official entry.",
  },
  {
    scenario: "Above 1 kg per passenger",
    rate: "Not permitted under the passenger route",
    conditions: "The eligible-passenger concession is capped at 1 kg. Larger quantities need commercial import channels.",
  },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * These exact strings render on-page (ToolFaq) AND in FAQPage JSON-LD, so
 * the schema always matches the visible text word-for-word.                 */

export const goldFaqs: FaqItem[] = [
  {
    question: "How much gold can I carry from USA to India?",
    answer:
      "As of July 2026, a resident or tourist of Indian origin who has lived abroad for more than one year can carry duty-free jewellery by weight on return to India — up to 40 grams for a female passenger and up to 20 grams for any other passenger, under Rule 6 of the Baggage Rules 2026. Beyond that, eligible passengers may bring up to 1 kg of gold in total by paying duty. Verify current limits with CBIC before you fly.",
  },
  {
    question: "How much gold can I carry to India without duty?",
    answer:
      "Only jewellery qualifies for the duty-free allowance — up to 40 grams for an eligible female passenger and 20 grams for another eligible passenger, and only if the traveler is a resident or tourist of Indian origin returning after more than one year abroad. The 2026 rules made these weight-only limits; the old rupee-value caps were not carried forward. Coins, bars, and bullion are never duty-free. The allowance is personal to each passenger.",
  },
  {
    question: "How much gold can an NRI carry to India in checked baggage?",
    answer:
      "The customs limits are identical whether gold is worn, in hand baggage, or in checked baggage — the jewellery allowance if you qualify, and up to 1 kg in total for an eligible passenger paying duty. That said, checked baggage is a poor place for gold: airline liability for valuables is limited and theft is hard to recover. Most travelers keep gold on their person and declare anything dutiable at the Red Channel.",
  },
  {
    question: "How much gold can we carry to India as a family?",
    answer:
      "Limits apply per passenger — allowances are never pooled (the Baggage Rules 2026 say so explicitly for free allowances). Each family member gets only their own jewellery allowance based on their own eligibility: 40 grams for an eligible female passenger, 20 grams for another eligible passenger. A couple cannot combine allowances to cover one 60-gram necklace carried by one person, and duty on any excess is assessed traveler by traveler.",
  },
  {
    question: "How much gold can be taken to India in the form of coins or bars?",
    answer:
      "Gold coins, bars, and biscuits get no duty-free allowance. Under Notification No. 45/2025-Customs, an eligible passenger — of Indian origin or holding a valid Indian passport, returning after at least six months abroad — may bring up to 1 kg of gold by paying duty of about 6% (5% customs duty plus 1% AIDC) in convertible foreign currency. It must be declared at the Red Channel on arrival, and duty is assessed on CBIC-notified tariff values.",
  },
  {
    question: "Do I have to declare gold jewellery I am wearing when I land in India?",
    answer:
      "Personal jewellery within your duty-free allowance can generally use the Green Channel. Anything beyond the allowance — extra jewellery, coins, or bars — must be declared at the Red Channel; the customs baggage declaration (Form CBD-I) can be filed electronically. Wearing jewellery does not exempt it from duty: the allowance is measured by weight and eligibility, not by where the gold sits. When in doubt, declare — undeclared excess gold risks seizure and penalties.",
  },
  {
    question: "What is the customs duty rate on gold brought to India above the free allowance?",
    answer:
      "As of July 2026, an eligible passenger (at least six months abroad, up to 1 kg, duty paid in convertible foreign currency) pays about 6% — 5% duty under the passenger-gold entries of Notification No. 45/2025-Customs plus 1% AIDC. A passenger who does not meet those conditions faces the general baggage assessment, which is substantially higher — commonly cited around 36%, but confirm the current figure with Customs. Duty is computed on CBIC-notified tariff values, not your receipt.",
  },
  {
    question: "Can I carry old or personally owned jewellery to India?",
    answer:
      "Yes — the jewellery allowance does not distinguish old from new, and genuinely personal jewellery within 40 g / 20 g clears duty-free for an eligible passenger. For jewellery you originally took out of India, a different route helps: articles declared at departure can re-enter free of duty under Rule 4 of the Baggage Rules 2026, so obtain an export certificate from customs before leaving India. Carry receipts or an appraisal for anything substantial either way.",
  },
];
