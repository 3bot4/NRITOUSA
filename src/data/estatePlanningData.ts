/**
 * Single source of truth for the cross-border (USA + India) estate-planning
 * guide at /articles/estate-planning-usa-india-assets.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY THIS FILE EXISTS
 * The estate-planning article quotes a dozen figures that are individually
 * cheap to get wrong and expensive for a reader to act on: the federal estate
 * tax exclusion, the $60,000 US-situs threshold for a nonresident who is not a
 * US citizen, the noncitizen-spouse gift exclusion, FBAR/Form 8938/Form 3520
 * thresholds, and the RBI USD 1 million remittance-of-assets limit. None of
 * them may be typed as a literal into the article body — the prose reads them
 * from here so the number and its source can never drift apart.
 *
 * WHAT THIS FILE IS *NOT*
 * It is not a statement of law. Nothing here is a substitute for a US estate
 * attorney, an Indian succession lawyer, or a cross-border tax professional,
 * and several entries are deliberately expressed as "depends" rather than as a
 * value, because the honest answer is fact-specific:
 *
 *   - Whether an Indian NOMINEE takes beneficially or holds for the legal
 *     heirs varies BY STATUTE AND BY ASSET (see `nominationRegimes`). There is
 *     no single site-wide rule and the article must not invent one.
 *   - Intestate heir shares under Indian personal law are NOT tabulated here
 *     at all. They differ by religion, by whether property is self-acquired or
 *     coparcenary, by state, and by family composition. A generic percentage
 *     table would be actively harmful.
 *
 * MAINTENANCE
 * Re-verify every `lastVerified` against its `sourceUrl` and bump the date only
 * after actually reopening the source. A stamp is not evidence. US figures are
 * inflation-indexed and move each January; the Indian items move when
 * Parliament or the RBI acts, which is irregular — see `recentIndianChanges`.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** ISO date the values in this file were last checked against source. */
export const ESTATE_DATA_VERIFIED = "2026-08-25";

/** Human-readable version of the same date, for prose. */
export const ESTATE_DATA_VERIFIED_LABEL = "August 25, 2026";

/** Tax year the US figures below belong to. Label every US amount with this. */
export const ESTATE_US_TAX_YEAR = 2026;

/* ──────────────────────────── Official sources ─────────────────────────── */

export const estateSources = {
  irsEstateTax: {
    label: "IRS — Estate tax (filing thresholds by year of death)",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax",
  },
  irsEstateNonresident: {
    label: "IRS — Estate tax for nonresidents not citizens of the United States",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax-for-nonresidents-not-citizens-of-the-united-states",
  },
  irsEstateNonresidentFaq: {
    label: "IRS — FAQ on estate taxes for nonresidents not citizens",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes-for-nonresidents-not-citizens-of-the-united-states",
  },
  irsInflation2026: {
    label: "IRS — Tax inflation adjustments for tax year 2026",
    href: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
  },
  irsGiftTaxFaq: {
    label: "IRS — Frequently asked questions on gift taxes",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes",
  },
  irsEstateGiftTreaties: {
    label: "IRS — Estate & gift tax treaties (international)",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-gift-tax-treaties-international",
  },
  irsQdot: {
    label: "IRS — Instructions for Form 706-QDT (qualified domestic trust)",
    href: "https://www.irs.gov/instructions/i706qdt",
  },
  irsIrmInternational: {
    label: "IRS — IRM 4.25.4, International Estate and Gift Tax Examinations",
    href: "https://www.irs.gov/irm/part4/irm_04-025-004",
  },
  irsFbar: {
    label: "IRS — Report of Foreign Bank and Financial Accounts (FBAR)",
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar",
  },
  fincenFbar: {
    label: "FinCEN — BSA E-Filing, FinCEN Form 114",
    href: "https://bsaefiling.fincen.treas.gov/main.html",
  },
  irsForm8938: {
    label: "IRS — Basic questions and answers on Form 8938",
    href: "https://www.irs.gov/businesses/corporations/basic-questions-and-answers-on-form-8938",
  },
  irsFatcaThresholds: {
    label: "IRS — Summary of FATCA reporting for US taxpayers (thresholds)",
    href: "https://www.irs.gov/businesses/corporations/summary-of-fatca-reporting-for-us-taxpayers",
  },
  irsForeignGifts: {
    label: "IRS — Gifts from foreign person (Form 3520)",
    href: "https://www.irs.gov/businesses/gifts-from-foreign-person",
  },
  irsBasis: {
    label: "IRS — Publication 551, Basis of Assets",
    href: "https://www.irs.gov/publications/p551",
  },
  irsPfic: {
    label: "IRS — Form 8621, passive foreign investment companies",
    href: "https://www.irs.gov/forms-pubs/about-form-8621",
  },
  rbiRemittanceFaq: {
    label: "RBI — FAQ: Remittance of Assets",
    href: "https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=17",
  },
  rbiRemittanceMasterDirection: {
    label: "RBI — Master Direction No. 13, Remittance of Assets",
    href: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10197",
  },
  rbiImmovableProperty: {
    label:
      "RBI — Acquisition and Transfer of Immovable Property in India (FEMA)",
    href: "https://www.rbi.org.in/commonman/english/scripts/Notification.aspx?Id=1175",
  },
  indianSuccessionAct: {
    label: "India Code — The Indian Succession Act, 1925",
    href: "https://www.indiacode.nic.in/handle/123456789/1362",
  },
  repealingAmendingAct2025: {
    label:
      "India Code — The Repealing and Amending Act, 2025 (Act 37 of 2025)",
    href: "https://www.indiacode.nic.in/bitstream/123456789/22046/1/a2025-37.pdf",
  },
  registrationAct: {
    label: "India Code — The Registration Act, 1908",
    href: "https://www.indiacode.nic.in/handle/123456789/2384",
  },
  hinduSuccessionAct: {
    label: "India Code — The Hindu Succession Act, 1956",
    href: "https://www.indiacode.nic.in/handle/123456789/1670",
  },
  insuranceAct: {
    label: "India Code — The Insurance Act, 1938 (nomination, section 39)",
    href: "https://www.indiacode.nic.in/handle/123456789/2410",
  },
  bankingLawsAmendment2025: {
    label:
      "PIB (Government of India) — Nomination provisions of the Banking Laws (Amendment) Act, 2025",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2181734",
  },
  shaktiYezdani: {
    label:
      "Supreme Court of India — Shakti Yezdani v. Jayanand Jayant Salgaonkar, judgment of 14 December 2023 (full text)",
    href: "https://indiankanoon.org/doc/166607072/",
  },
  form15caFaq: {
    label: "Income Tax Department (India) — Form 15CA FAQ",
    href: "https://www.incometax.gov.in/iec/foportal/help/statutory-forms/popular-forms/form-15ca-faq",
  },
  rule37bb: {
    label: "Income Tax Department (India) — Rule 37BB",
    href: "https://www.incometaxindia.gov.in/w/rule-37bb",
  },
} as const;

export type EstateSourceKey = keyof typeof estateSources;

/* ─────────────────────────── Verified US figures ───────────────────────── */

export interface EstateNumber {
  /** Human label used in tables and snapshots. */
  label: string;
  /**
   * The value to display, e.g. "$15,000,000". MUST be a plain string literal —
   * the number audits regex-parse this file, so a template literal or computed
   * expression drops the value out of the audit silently.
   */
  value: string;
  /** ISO date this value was last verified against the official source. */
  lastVerified: string;
  /** Key into `estateSources`. */
  source: EstateSourceKey;
  /**
   * For the Form 8938 rows only: the alternate "at any time during the year"
   * threshold that sits beside the year-end one. Kept as a field rather than
   * prose because both halves of the test are load-bearing.
   */
  anyTimeValue?: string;
  /** Short caveat rendered wherever the number is rendered. */
  note?: string;
}

/**
 * US transfer-tax and reporting figures. Every one of these is inflation-
 * indexed or statutory and must be labelled by year in the copy — none of them
 * is permanent.
 */
export const usEstateNumbers = {
  basicExclusion2026: {
    label: "Federal estate tax basic exclusion amount (deaths in 2026)",
    value: "$15,000,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsInflation2026",
    note: "Per person, for decedents dying in 2026. Up from $13,990,000 in 2025. Indexed annually — not a permanent figure.",
  },
  basicExclusion2025: {
    label: "Federal estate tax basic exclusion amount (deaths in 2025)",
    value: "$13,990,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsEstateTax",
    note: "Shown only to make the year-by-year indexing visible.",
  },
  nrncFilingThreshold: {
    label:
      "US-situated assets threshold before Form 706-NA is required (nonresident who is not a US citizen)",
    value: "$60,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsEstateNonresident",
    note: "Not indexed for inflation. Applies to a decedent neither domiciled in nor a citizen of the US. A treaty can change the result — but the US has no estate or gift tax treaty with India.",
  },
  annualGiftExclusion: {
    label: "Annual gift tax exclusion (2026)",
    value: "$19,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsInflation2026",
    note: "Per donee, per year. Unchanged from 2025.",
  },
  noncitizenSpouseGiftExclusion: {
    label: "Annual exclusion for gifts to a spouse who is not a US citizen (2026)",
    value: "$194,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsInflation2026",
    note: "A GIFT-tax rule during life. It is not the estate-tax marital deduction and does not substitute for one.",
  },
  fbarThreshold: {
    label: "FBAR aggregate threshold",
    value: "$10,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsFbar",
    note: "Aggregate maximum value of ALL foreign financial accounts at any point in the calendar year — not a per-account test.",
  },
  form8938DomesticSingle: {
    label: "Form 8938 threshold — living in the US, unmarried or filing separately",
    value: "$50,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsFatcaThresholds",
    anyTimeValue: "$75,000",
    note: "On the last day of the tax year, or more than $75,000 at any time during the year.",
  },
  form8938DomesticJoint: {
    label: "Form 8938 threshold — living in the US, married filing jointly",
    value: "$100,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsFatcaThresholds",
    anyTimeValue: "$150,000",
    note: "On the last day of the tax year, or more than $150,000 at any time during the year.",
  },
  form8938AbroadSingle: {
    label: "Form 8938 threshold — living abroad, not married filing jointly",
    value: "$200,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsFatcaThresholds",
    anyTimeValue: "$300,000",
    note: "On the last day of the tax year, or more than $300,000 at any time during the year.",
  },
  form8938AbroadJoint: {
    label: "Form 8938 threshold — living abroad, married filing jointly",
    value: "$400,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsFatcaThresholds",
    anyTimeValue: "$600,000",
    note: "On the last day of the tax year, or more than $600,000 at any time during the year.",
  },
  form3520ForeignGift: {
    label:
      "Form 3520 threshold — gifts or bequests from a nonresident alien individual or foreign estate",
    value: "$100,000",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsForeignGifts",
    note: "Aggregate during the tax year. Above it, each gift over $5,000 must be identified separately. Reporting only — a bequest is not itself US income.",
  },
  form3520PenaltyCap: {
    label: "Form 3520 penalty cap",
    value: "25%",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsForeignGifts",
    note: "Maximum total penalty under IRC 6039F(c) for an unreported foreign gift or bequest.",
  },
  form3520Penalty: {
    label: "Form 3520 late/non-filing penalty for an unreported foreign gift",
    value: "5%",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "irsForeignGifts",
    note: "Of the value of the gift or bequest for each month unreported, capped at 25%, absent reasonable cause (IRC §6039F(c)).",
  },
} as const satisfies Record<string, EstateNumber>;

/* ────────────────────────── Verified India figures ─────────────────────── */

export const indiaEstateNumbers = {
  remittanceOfAssetsLimit: {
    label: "RBI remittance-of-assets limit for an NRI/PIO",
    value: "USD 1 million",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "rbiRemittanceFaq",
    note: "Per Indian financial year, out of NRO balances or sale proceeds of assets INCLUDING assets acquired by inheritance or legacy — subject to documentary evidence, applicable Indian taxes and the authorised dealer's review. Amounts beyond this route need RBI approval.",
  },
  willWitnessesMinimum: {
    label: "Attesting witnesses required for an unprivileged will in India",
    value: "2",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "indianSuccessionAct",
    note: "Section 63(c), Indian Succession Act 1925: two OR MORE. Each signs in the testator's presence, but the section expressly says it is not necessary that more than one witness be present at the same time.",
  },
  form15cbThreshold: {
    label: "Form 15CB accountant certificate — remittance trigger",
    value: "₹5 lakh",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "form15caFaq",
    note: "Event-based, not universal. Applicability turns on the nature of the payment and the rules in Rule 37BB — several categories are exempt entirely.",
  },
  bankNomineesMax: {
    label: "Maximum nominees per bank deposit account",
    value: "4",
    lastVerified: ESTATE_DATA_VERIFIED,
    source: "bankingLawsAmendment2025",
    note: "Banking Laws (Amendment) Act 2025, in force 1 November 2025 — simultaneous (with shares) or successive for deposits; successive only for lockers and safe custody. Confirm your bank's current form.",
  },
} as const satisfies Record<string, EstateNumber>;

/* ───────────────── Nomination: the rule that is NOT one rule ───────────── */

/**
 * How a nomination interacts with succession DIFFERS BY STATUTE. This is the
 * single most-repeated error in NRI estate content — "a nominee is only a
 * trustee" is true for some assets and wrong for others. Any UI that renders
 * this must render `effect` verbatim rather than collapsing the rows.
 */
export interface NominationRegime {
  asset: string;
  /** Governing statute or authority, named plainly. */
  governedBy: string;
  /** What nomination does — and does not — decide, for this asset class. */
  effect: string;
}

export const nominationRegimes: readonly NominationRegime[] = [
  {
    asset: "Company shares and dematerialised securities",
    governedBy: "Companies Act / Depositories Act",
    effect:
      "The Supreme Court held in Shakti Yezdani v. Jayanand Jayant Salgaonkar (14 December 2023) that nomination under these Acts does not override succession law: the nominee takes the shares for administration, and beneficial ownership still devolves under the will or applicable succession law.",
  },
  {
    asset: "Life insurance policy proceeds",
    governedBy: "Insurance Act 1938, section 39",
    effect:
      "Different by statute. Since the Insurance Laws (Amendment) Act 2015, where the nominee is a parent, spouse or child (a 'beneficial nominee' under section 39(7)), the nominee is beneficially entitled to the proceeds — unless it is proved the policyholder could not have conferred such beneficial title.",
  },
  {
    asset: "Bank deposits, lockers and safe custody",
    governedBy: "Banking Regulation Act 1949, sections 45ZA–45ZF",
    effect:
      "Nomination lets the bank pay out and obtain a valid discharge without adjudicating competing claims. It is a payment mechanism; it does not by itself settle who is finally entitled as against the legal heirs.",
  },
  {
    asset: "Provident fund, gratuity and superannuation",
    governedBy: "The scheme's own statute and rules",
    effect:
      "Each scheme has its own nomination and payment rules, and some confer entitlement on specified family members directly. Check the specific scheme rather than assuming the bank or securities position applies.",
  },
  {
    asset: "Mutual fund units",
    governedBy: "SEBI regulations and the scheme's terms",
    effect:
      "Nomination drives transmission by the registrar/AMC. Whether the nominee holds beneficially or for the heirs turns on the scheme terms and the general law — coordinate the nomination with the will rather than relying on it to distribute the estate.",
  },
  {
    asset: "Cooperative housing society shares and flats",
    governedBy: "State cooperative societies legislation",
    effect:
      "Society rules commonly transfer the share certificate to the nominee to keep the society's records working. State law and case law generally treat that as provisional for the society's purposes, not as a final determination of ownership.",
  },
];

/* ──────────────── Recent Indian changes worth flagging in copy ─────────── */

export interface DatedChange {
  /** What changed, in one line. */
  change: string;
  /** ISO date the change took effect (or received assent, where noted). */
  effective: string;
  /** Human-readable date for prose. */
  effectiveLabel: string;
  /** Key into `estateSources`. */
  source: EstateSourceKey;
  /** Why a cross-border reader should care. */
  whyItMatters: string;
}

/**
 * These are EVENT DATES, not freshness stamps — never bulk-update them.
 * Both entries are recent enough that institutional practice is still settling,
 * which the copy must say rather than presenting them as fully bedded in.
 */
export const recentIndianChanges: readonly DatedChange[] = [
  {
    change:
      "Section 213 of the Indian Succession Act 1925 was omitted, removing the mandatory-probate bar for the wills described in sections 57(a) and 57(b)",
    effective: "2025-12-20",
    effectiveLabel: "20 December 2025",
    source: "repealingAmendingAct2025",
    whyItMatters:
      "Probate is no longer compulsory as a precondition to establishing a right under those wills — which historically caught Hindu, Buddhist, Sikh and Jain wills made in, or covering immovable property in, the former presidency towns of Bombay, Madras and Calcutta. Probate remains available, a will must still be proved, and the Act's savings clause preserves anything already done and any pending proceeding. How registrars, banks and societies actually apply the change is still settling.",
  },
  {
    change:
      "Banking Laws (Amendment) Act 2025 allows up to four nominees per bank deposit account",
    effective: "2025-11-01",
    effectiveLabel: "1 November 2025",
    source: "bankingLawsAmendment2025",
    whyItMatters:
      "Deposits can now carry simultaneous nominees with defined shares, or successive nominees in priority order; lockers and safe custody allow successive nomination only. Existing nominations do not update themselves.",
  },
];
