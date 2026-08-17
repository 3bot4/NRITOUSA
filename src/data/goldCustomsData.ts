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
 *  - Standard baggage assessment for passengers who do NOT qualify: 38.5%
 *    effective — 35% basic customs duty under tariff heading 9803 (capped at
 *    that rate by Notification No. 26/2016-Customs) plus Social Welfare
 *    Surcharge at 10% OF THE DUTY. See the maintenance note on the constant
 *    itself for the one open question (whether non-ornament gold sits inside
 *    or outside heading 9803).
 *
 *  - General free allowance (Rule 3), added and verified 2026-08-17: ₹75,000
 *    for a resident, tourist of Indian origin, or foreigner on a non-tourist
 *    visa arriving other than by land; ₹25,000 for a foreign tourist. Same
 *    notification as the Rule 6 figures (No. 14/2026-Customs (N.T.)).
 *    This allowance does NOT cover bullion — Annexure-I item 5 excludes
 *    gold/silver other than ornaments — so never combine it with the Rule 6
 *    gold figures. That distinction is the whole point of the comparison
 *    table on the page; do not collapse the two allowances into one.
 *
 * Re-checked 2026-08-09 — no change to the figures below.
 *  - The May-2026 "gold import duty raised 6% → 15%" headlines concern the
 *    COMMERCIAL import tariff, not the passenger-baggage concession under
 *    Notification No. 45/2025-Customs. The eligible-passenger rate is still
 *    5% BCD + 1% AIDC ≈ 6%, capped at 1 kg. Do not "correct" the 6% here to
 *    15% on the strength of a commercial-tariff headline — check that the
 *    notification being cited is the passenger-gold entry before editing.
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
  lastVerified: "2026-08-09",
  lastVerifiedHuman: "August 9, 2026",

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

  /* Standard baggage assessment — applies when the passenger does NOT qualify
     for the concessional passenger-gold route above (e.g. abroad under 6
     months, or not of Indian origin / without a valid Indian passport).

     Tariff heading 9803 ("All dutiable articles imported by a passenger or a
     member of the crew in his baggage") carries a tariff rate of 100%, but
     Notification No. 26/2016-Customs (31-Mar-2016) caps the EFFECTIVE basic
     customs duty at 35%. Social Welfare Surcharge is 10% OF THE BCD (not of
     the value), so the effective total is 35 + 3.5 = 38.5%.

     MAINTENANCE NOTE (not user-facing): Notification 26/2016 carries an
     exclusion list which has historically included "gold or silver in any
     form other than ornaments", with an April-2016 corrigendum amending it.
     Whether non-ornament gold is assessed under the 9803 flat rate or at
     gold's own tariff heading (7108) is the one point that could not be
     settled from primary sources here — CBIC domains are unreachable from
     this environment. Set to 38.5% on the site owner's decision (2026-08-17).
     If a customs broker or the CBIC tariff confirms gold falls outside 9803,
     this constant and the components below are what need changing. */
  standardBaggageBcdPct: 35,
  /** Social Welfare Surcharge, levied at 10% OF the basic customs duty. */
  standardBaggageSwsRateOnBcdPct: 10,
  get standardBaggageRatePct() {
    return (
      this.standardBaggageBcdPct *
      (1 + this.standardBaggageSwsRateOnBcdPct / 100)
    ); // 35 + 3.5 = 38.5
  },

  /* Display-only conversion for the ₹ estimate. Customs actually assesses
     duty on CBIC-notified tariff values and notified exchange rates — this
     approximation is clearly labelled as such in the UI. */
  approxInrPerUsd: 88,

  /* GENERAL free allowance — Rule 3, Baggage Rules 2026 (same notification as
     the Rule 6 jewellery allowance above: No. 14/2026-Customs (N.T.)).
     This is a SEPARATE allowance covering ordinary articles, and it is the
     single biggest source of confusion on this page: it does NOT cover gold
     bars or coins, because gold/silver other than ornaments is excluded by
     Annexure-I item 5. Never let the UI imply ₹75,000 of bullion is free.

     Provenance: confirmed by the site owner against CBIC on 2026-08-17, and
     consistent with the PIB release for Notification No. 14/2026-Customs
     (N.T.) and the rule text ("up to the value of seventy-five thousand
     rupees"). Same notification as the Rule 6 jewellery figures above. */
  generalFreeAllowanceInr: 75_000,
  generalFreeAllowanceTouristInr: 25_000,
  generalAllowanceVerifiedVerbatim: true,
} as const;

export const GOLD_DISCLAIMER =
  `Estimates are based on official customs sources as last verified on ${goldDutyConfig.lastVerifiedHuman} (Baggage Rules 2026; Notification No. 45/2025-Customs). Customs limits, duty rates, tariff values, and notifications change, and the actual assessment is always at the customs officer's discretion using CBIC-notified tariff values — not your purchase receipt. Verify current rules at cbic.gov.in before you travel. Educational information only — not tax, legal, or customs advice.`;

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

/* ────────── General free allowance vs the gold allowance (Rule 3 vs Rule 6) ────────
 *
 * These are two different allowances under the SAME notification, and readers
 * routinely collapse them into one. The ₹75,000 general allowance is what the
 * "India raises duty-free limit" headlines refer to; it has nothing to do with
 * bullion, because Annexure-I item 5 pulls gold/silver other than ornaments out
 * of the free-allowance scheme entirely.
 */

export interface AllowanceContrastRow {
  question: string;
  general: string;
  gold: string;
}

export const allowanceContrastRows: AllowanceContrastRow[] = [
  {
    question: "What does it cover?",
    general: "Ordinary articles in bona fide baggage — gifts, electronics, clothing",
    gold: "Qualifying jewellery only (Rule 6), and only for an eligible passenger",
  },
  {
    question: "How is it measured?",
    general: "By value — ₹75,000 (₹25,000 for a foreign tourist)",
    gold: "By weight — 40 g / 20 g, with no rupee cap since Feb 2026",
  },
  {
    question: "Does it cover gold bars or coins?",
    general: "No — Annexure-I item 5 excludes gold/silver other than ornaments",
    gold: "No — Rule 6 is a jewellery allowance, not a bullion allowance",
  },
  {
    question: "Can the two be added together?",
    general: "No. They are separate schemes with separate tests",
    gold: "No. And neither can be pooled with another passenger (Rule 5)",
  },
];

/* ───────────────────── Declaring at the airport (ATITHI) ───────────────────── */

export const customsDeclaration = {
  appName: "ATITHI",
  appUrl: "https://atithi.cbic.gov.in/",
  intro:
    "ATITHI is CBIC's official declaration app for international passengers arriving in India. It lets you declare dutiable goods and currency before you board, instead of filling a paper form after landing — and CBIC has been moving the process toward fully paperless declaration.",

  whenYouMustDeclare: [
    "Any gold in a form other than jewellery — bars, coins, biscuits, bullion — regardless of quantity",
    "Jewellery beyond your Rule 6 allowance, or any jewellery if you do not qualify for the allowance",
    "Goods beyond the general free allowance",
    "Currency above the declaration thresholds set by CBIC and the RBI",
  ],

  channels: [
    {
      label: "Green Channel",
      body: "For passengers with nothing to declare. Walking through the Green Channel while carrying dutiable goods is treated as misdeclaration, not an oversight — the consequences are materially worse than paying the duty would have been.",
    },
    {
      label: "Red Channel",
      body: "For passengers carrying dutiable or restricted goods. This is where gold beyond your allowance gets assessed and duty is paid. Declaring here is the low-risk path.",
    },
  ],

  practicalNote:
    "Filing in the app ahead of time does not change what you owe — it changes how long you stand at the counter, and it makes clear that the declaration was voluntary. Carry purchase invoices where you have them, but remember that customs assesses duty on CBIC-notified tariff values rather than on what you paid.",
} as const;

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
    rate: "≈38.5% (35% BCD + 10% SWS on the duty)",
    conditions:
      "The standard baggage assessment applies — about 38.5%: 35% basic customs duty under tariff heading 9803, capped at that rate by Notification No. 26/2016-Customs, plus Social Welfare Surcharge charged at 10% of that duty rather than of the value.",
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
      "As of August 2026, a resident or tourist of Indian origin who has lived abroad for more than one year can carry duty-free jewellery by weight on return to India — up to 40 grams for a female passenger and up to 20 grams for any other passenger, under Rule 6 of the Baggage Rules 2026. Beyond that, eligible passengers may bring up to 1 kg of gold in total by paying duty. Verify current limits with CBIC before you fly.",
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
      "As of August 2026, an eligible passenger (at least six months abroad, up to 1 kg, duty paid in convertible foreign currency) pays about 6% — 5% duty under the passenger-gold entries of Notification No. 45/2025-Customs plus 1% AIDC. A passenger who does not meet those conditions faces the standard baggage assessment of about 38.5% — 35% basic customs duty under tariff heading 9803, capped at that rate by Notification No. 26/2016-Customs, plus Social Welfare Surcharge at 10% of that duty. Duty is computed on CBIC-notified tariff values, not your receipt.",
  },
  {
    question: "Can I carry old or personally owned jewellery to India?",
    answer:
      "Yes — the jewellery allowance does not distinguish old from new, and genuinely personal jewellery within 40 g / 20 g clears duty-free for an eligible passenger. For jewellery you originally took out of India, a different route helps: articles declared at departure can re-enter free of duty under Rule 4 of the Baggage Rules 2026, so obtain an export certificate from customs before leaving India. Carry receipts or an appraisal for anything substantial either way.",
  },
  {
    question: "Does the ₹75,000 duty-free allowance cover gold?",
    answer:
      "No. The ₹75,000 general free allowance under the Baggage Rules 2026 covers ordinary articles in your bona fide baggage — gifts, electronics, clothing. Annexure-I item 5 excludes gold and silver in any form other than ornaments from the free-allowance scheme, so bars, coins, and biscuits get no rupee-value exemption at all. Jewellery is handled separately under Rule 6 as a weight allowance of 40 g for a female passenger and 20 g for another eligible passenger. The two allowances are separate schemes and cannot be added together.",
  },
  {
    question: "What is the general duty-free allowance for India in 2026?",
    answer:
      "Under the Baggage Rules 2026, the general free allowance is ₹75,000 for a resident, a tourist of Indian origin, or a foreigner holding a valid non-tourist visa, arriving in India other than by land — up from ₹50,000 under the 2016 rules. A foreign tourist gets ₹25,000. This applies to ordinary articles and not to anything listed in Annexure-I, which is why it does not help with gold bullion. Confirm current figures with CBIC before you travel.",
  },
  {
    question: "What is the ATITHI app and do I have to use it?",
    answer:
      "ATITHI is the Central Board of Indirect Taxes and Customs (CBIC) app for international passengers arriving in India, letting you file your customs declaration for dutiable goods and currency before you board rather than on a paper form after landing. CBIC has been moving the declaration process toward fully paperless. Using it does not change how much duty you owe — it shortens the process at the counter and makes clear the declaration was voluntary.",
  },
  {
    question: "What happens if I walk through the Green Channel with undeclared gold?",
    answer:
      "Choosing the Green Channel is itself a declaration that you have nothing dutiable to declare, so carrying undeclared gold through it is treated as misdeclaration rather than a simple oversight. The consequences are materially worse than the duty would have been. If you are carrying gold beyond your allowance, or gold in any form other than jewellery, use the Red Channel and declare it.",
  },
];
