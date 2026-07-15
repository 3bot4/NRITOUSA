import { computeReadingTime } from "@/lib/format";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TITLE } from "@/lib/taxCompliance";
import {
  form3520Rules,
  indiaGiftRemittanceRules,
  fmtUsd,
  LRS_TCS_THRESHOLD_LABEL,
  INDIVIDUAL_ESTATE_THRESHOLD_LABEL as USD_100K,
  ITEMIZATION_THRESHOLD_LABEL as USD_5K,
} from "@/data/foreignGiftRules";

/** Config-derived labels so every page renders the centralized figures. */
const ENTITY_2025 = fmtUsd(form3520Rules.entityThresholdByTaxYear[2025]);
const ENTITY_2026 = fmtUsd(form3520Rules.entityThresholdByTaxYear[2026]);
const TCS_RATE_PCT = `${Math.round(indiaGiftRemittanceRules.otherPurposeTcsRate * 100)}%`;
const GIFT_PURPOSE_CODE = indiaGiftRemittanceRules.giftPurposeCode;
const RULES_VERIFIED = form3520Rules.lastVerified;

/**
 * Topic cluster (hub-&-spoke) for "Parents, Gifts, Inheritance & Form 3520".
 *
 *   /india-tax-compliance/                                          ← parent hub (existing)
 *     └─ /foreign-gifts-inheritance-form-3520-india                 ← pillar / hub page
 *          ├─ /gift-from-parents-india-to-usa
 *          ├─ /inherited-indian-property-us-tax
 *          ├─ /inherited-indian-mutual-funds-pfic
 *          └─ /form-3520-indian-gift-inheritance-checklist          ← supporting pages
 *
 * A *reporting & documentation* cluster, not a calculator. It ties together the
 * pieces that confuse US-based Indians when money or assets come from family in
 * India: cash gifts from parents, gifts for a US down payment, inheritance of
 * Indian property / bank accounts / FDs / gold / shares / mutual funds, the
 * Form 3520 foreign-gift reporting threshold, the US tax-vs-reporting
 * distinction, the Indian documentation (gift deed, will, probate, death &
 * legal-heir certificates, valuation, title), and the US reporting questions
 * (Form 3520, FBAR, Form 8938, Form 8621 for inherited mutual funds). It does
 * NOT compute any tax — it links to calculators and the Form 3520 checker tool.
 *
 * Sibling of lib/itrCluster.ts, lib/tdsCluster.ts and lib/repatriationCluster.ts:
 * same authoring format (light-markdown + ::: fences rendered by ArticleBody),
 * same /india-tax-compliance parent hub, and the same shared dynamic route at
 * /india-tax-compliance/[slug] (which resolves all clusters by slug). See
 * components/GiftsClusterPage.tsx.
 *
 * Educational-only: nothing here is US tax, India tax, or legal advice. Form
 * 3520 thresholds (the >$100,000 foreign-individual/estate figure and the
 * separate, annually-indexed foreign-corporation/partnership figure), PFIC
 * rules, and Indian gift/inheritance taxability change over time and depend on
 * your facts — always confirm with a cross-border CPA and a CA, and verify on
 * the IRS (irs.gov) and Income Tax portal (incometax.gov.in).
 */

export type GiftPageKind = "pillar" | "support";

export interface SnapshotRowData {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

export interface GiftPageData {
  /** The child segment under /india-tax-compliance. */
  slug: string;
  kind: GiftPageKind;
  title: string;
  /** SEO <title> override (falls back to `title`). */
  seoTitle?: string;
  /** SEO meta description (falls back to `excerpt`). ~140–160 chars. */
  metaDescription?: string;
  /** H1 shown on the page (falls back to `title`). */
  h1?: string;
  excerpt: string;
  /** Short label shown in cluster navigation + hub cards. */
  navLabel: string;
  /** Emoji shown in the topic pill and hub card tile. */
  icon: string;
  /** Tailwind gradient classes for the hub card icon tile. */
  accent: string;
  date: string;
  updated?: string;
  /** Per-page "Fast Answer" snapshot so each page shows DISTINCT cards. */
  snapshotTitle?: string;
  snapshotBadges?: string[];
  snapshotRows?: SnapshotRowData[];
  /** Suppress the snapshot block entirely (e.g. the checklist opens with the list). */
  hideSnapshot?: boolean;
  /** Render a "Print checklist" button (the checklist page). */
  showPrintButton?: boolean;
  content: string;
}

export interface GiftPage extends GiftPageData {
  readingTime: number;
}

/** Parent hub these pages live under (the existing India Tax & Compliance hub). */
export const GIFT_HUB_PATH = TAX_COMPLIANCE_PATH;
export const GIFT_HUB_TITLE = TAX_COMPLIANCE_TITLE;

/** The pillar slug (everything else is a supporting page). */
export const GIFT_PILLAR_SLUG = "foreign-gifts-inheritance-form-3520-india";

/** Root-relative path for any cluster page. */
export const giftPath = (slug: string) => `${GIFT_HUB_PATH}/${slug}`;

/** Section heading + card copy used on the parent hubs. */
export const GIFT_CLUSTER_SECTION = {
  eyebrow: "New",
  title: "Parents, Gifts, Inheritance & Form 3520",
  description:
    "Money or assets coming from family in India? Learn how cash gifts from parents, inheritance of Indian property, bank accounts, gold, shares and mutual funds, Form 3520, FBAR/FATCA, PFIC, and Indian documentation all fit together.",
};

const rawPages: GiftPageData[] = [
  /* ----------------------------- PILLAR / HUB ----------------------------- */
  {
    slug: GIFT_PILLAR_SLUG,
    kind: "pillar",
    title: "Foreign Gifts and Inheritance from India: US Tax and Form 3520 Guide",
    h1: "Foreign Gifts and Inheritance from India: US Tax and Form 3520 Guide",
    seoTitle: "Foreign Gifts & Inheritance from India | Form 3520",
    metaDescription:
      "Learn when gifts or inheritances from India trigger Form 3520, FBAR, FATCA or PFIC reporting, plus documentation, basis and remittance considerations.",
    navLabel: "Start here: the overview",
    icon: "🎁",
    accent: "from-rose-500 to-pink-600",
    date: "2026-06-22",
    updated: RULES_VERIFIED,
    snapshotTitle: "Foreign gifts & inheritance from India — US reporting",
    snapshotBadges: ["Individual/estate > $100k", "Entity indexed yearly"],
    snapshotRows: [
      {
        label: "Individual / estate threshold",
        value: `> ${USD_100K} / year`,
        note: "Aggregate gifts/bequests from a nonresident individual or foreign estate (Part IV).",
        highlight: true,
      },
      {
        label: "Entity threshold (TY 2026)",
        value: ENTITY_2026,
        note: `Purported gifts from a foreign corporation/partnership; ${ENTITY_2025} for TY 2025, indexed annually.`,
      },
      {
        label: "FBAR / FATCA",
        value: "Account-based",
        note: "Indian accounts you now hold can cross FBAR (FinCEN 114) and Form 8938 thresholds.",
      },
      {
        label: "PFIC (Indian mutual funds)",
        value: "Form 8621",
        note: "Indian mutual funds are generally PFICs — special US tax and reporting.",
      },
    ],
    excerpt:
      "Gifts or an inheritance from India are generally not taxable income to you in the US — but the reporting (Form 3520, FBAR, FATCA, PFIC), the cost basis, and the Indian paperwork still matter. This overview ties the whole picture together and points you to the right deep dive.",
    content: `When money or assets come to you from family in India — a cash gift from your parents, help with a US home down payment, or an inheritance of property, bank balances, gold, shares, or mutual funds — two questions get tangled together: **"will I be taxed on this?"** and **"do I have to report it?"** They are not the same question, and confusing them is where US-based Indians get into trouble. This overview walks through both sides — the **US reporting** (Form 3520, FBAR, FATCA, PFIC) and the **Indian documentation and basis** — and points you to the right deep dive.

:::warn
title: Read this first — educational only
- This is general educational information, **not US tax, India tax, or legal advice**. The Form 3520 thresholds, PFIC rules, and Indian gift/inheritance taxability **change over time** and depend on your specific facts.
- Confirm what applies to **you** with a qualified **cross-border CPA** (US side) and a **Chartered Accountant (CA)** (India side).
- This is a **reporting & documentation** overview. It does **not** compute any tax. Map your own case with the [Form 3520 India gift checker](/tools/form-3520-india-gift-checker).
:::

## Quick answer
Receipt of a **genuine foreign gift or bequest is generally not US-taxable income** to you. What can still apply is **reporting** — most importantly **Form 3520** once you cross a threshold — plus **FBAR/FATCA** on any Indian accounts you now hold and **PFIC** rules if you inherit Indian mutual funds. Form 3520 is an **information return filed separately from Form 1040**; the risk is the penalty for not filing, not a tax on the gift. Special rules can apply to covered-expatriate gifts and to foreign-trust transactions.

## Choose your situation
Jump to the guide that fits what you received:

- **Cash from parents** (including a US down payment) → [Gift from parents in India to the USA](/india-tax-compliance/gift-from-parents-india-to-usa)
- **A foreign inheritance / bequest** → keep reading, then the [Form 3520 checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist)
- **Indian property** → [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax)
- **Indian bank accounts / FDs** → [FBAR & FATCA for NRIs](/articles/fbar-fatca-nri-guide)
- **Gold or direct shares** → see the asset-specific table below
- **Indian mutual funds** → [Inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic)
- **A foreign-trust distribution** → this follows a different rule (see the source table) — get specialist review

## Are you a US person?
Form 3520, FBAR, and FATCA are **US-person** obligations. If you are **not** a US person for tax purposes, receiving the gift or bequest generally does not create these US filings. US-person status is **not decided by visa type alone** — a green-card holder is generally a US person, an H-1B holder may be one under the substantial-presence test, and an F-1 nonresident alien may not yet be. Determine your US tax residency **before** applying any threshold. The [cash-gift page](/india-tax-compliance/gift-from-parents-india-to-usa) has a status table to work through.

## Donor / source-type decision table
The correct Form 3520 rule depends on **who** the source is. Keep these categories separate:

| Source of the gift / bequest | Form 3520 rule |
|---|---|
| **Nonresident individual** (e.g. a parent) | Part IV — report when the year's aggregate exceeds **${USD_100K}** |
| **Foreign estate** | Part IV — report when the year's aggregate exceeds **${USD_100K}** |
| **Foreign corporation** | Part IV — indexed **entity threshold** (${ENTITY_2026} for TY 2026) |
| **Foreign partnership** | Part IV — indexed **entity threshold** (${ENTITY_2026} for TY 2026) |
| **Foreign trust** | **Part III** foreign-trust review — the ${USD_100K} gift test does **not** apply |

A foreign trust is **not** just another donor under the estate threshold — trust distributions to a US person follow their own Part III rules (and possibly Form 3520-A). Treat that as a specialist case.

## US calendar year vs Indian financial year
The two systems measure time differently, which trips people up when a transfer straddles a year end.

| Timeline | Measured by | Runs |
|---|---|---|
| **US Form 3520** | The recipient's US tax year | Usually **January–December** for an individual calendar-year filer |
| **India LRS / TCS** | The sender's Indian financial year | **April–March** |

A gift wired in **January** and another in the following **April** can fall in **one US calendar year** but **two Indian financial years** — so the US Form 3520 aggregate and each sender's India-side LRS/TCS math can cover different periods. Line them up carefully.

## Form 3520 reporting matrix
| Situation | What to look at |
|---|---|
| Gift/bequest from a nonresident individual or estate, year's total ≤ ${USD_100K} | Generally no Form 3520; keep records and watch the aggregate |
| Same, year's total > ${USD_100K} | Form 3520 **Part IV**; identify each gift above ${USD_5K} individually |
| Purported gift from a foreign corporation/partnership over the indexed entity threshold | Form 3520 **Part IV** (entity), ${ENTITY_2026} for TY 2026 |
| Distribution from a foreign trust | Form 3520 **Part III** (and possibly Form 3520-A) — specialist review |
| Inherited Indian **mutual funds** | PFIC / **Form 8621** review |
| Money/securities held in an **Indian account** | **FBAR / Form 8938** review (threshold-based) |

## Gift vs inheritance
Both are generally **not** taxable income to you on receipt. The differences show up in the **paperwork** and the **cost basis**:

- A **gift** is documented with a **gift deed / declaration**; an **inheritance** needs a **will/probate or succession documents, a death certificate, and a legal-heir certificate**.
- For a **gifted** asset, US basis is generally the donor's **carryover** basis; for an **inherited** asset, US basis is generally the **date-of-death fair-market value**. That single difference can change the tax on an eventual sale dramatically.

## Asset-specific reporting table
Receiving each of these is generally not taxable income — but each carries its own reporting and future-income angle:

| Asset | US reporting / tax to watch |
|---|---|
| **Cash / bank transfer** | Form 3520 if over the threshold; FBAR/FATCA if held in an Indian account |
| **Property** | No US tax on inheriting; basis for a future sale; rent and gains taxable |
| **Bank accounts / FDs** | FBAR + FATCA on the account; interest taxable going forward |
| **Gold** | No income until sold; keep a valuation for basis; gain on sale |
| **Shares (direct equities)** | Dividends + capital gains taxable; basis and holding records matter |
| **Mutual funds** | Generally **PFIC** — possible **Form 8621** and special default tax rules |

## US basis vs Indian basis
Your eventual capital gain depends on **cost basis**, and the two countries compute it under their own rules:

| Asset received | US side | India side |
|---|---|---|
| **Gifted asset** | Generally **donor / carryover basis**, subject to special loss-basis rules | Determine applicable carryover and holding-period rules with a CA |
| **Inherited asset** | Generally **date-of-death fair-market-value basis**, subject to applicable rules | Inherited cost and holding-period rules may refer to the previous owner |

Get a **dated valuation** near the gift or death date and keep the ownership chain **now** — reconstructing it after a sale is painful.

## Documentation overview
Gather the relevant subset early; the [Form 3520 checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist) turns this into a step-by-step list.

- **Gift:** gift deed / declaration, source-of-funds records, sending and receiving bank records
- **Inheritance:** will / probate / succession documents, death certificate, legal-heir certificate
- **Any asset:** a valuation near the date received, and title/ownership records for non-cash assets

## Decision map
- **Cash from parents (or a down payment):** [Gift from parents in India to the USA](/india-tax-compliance/gift-from-parents-india-to-usa)
- **Ready to file:** [Form 3520 checklist for gifts and inheritance from India](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist)
- **Screen your own case:** [Form 3520 India gift and inheritance checker](/tools/form-3520-india-gift-checker)
- **Inherited property:** [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax)
- **Inherited mutual funds:** [Inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic)

:::cta
title: Screen your own situation in two minutes
body: Answer a few questions — the tax year, who the source was, how much, and what you received — and get a Form 3520 result with the exact threshold used, plus FBAR/FATCA and PFIC flags and the documents to collect.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

## Frequently asked questions

### Is a foreign gift or inheritance from India taxable income in the US?
Generally no — receiving a genuine gift or inheritance from a foreign person is not US-taxable income to you. Reporting can still apply: large foreign gifts or bequests can require Form 3520, a disclosure filed separately from Form 1040. Covered-expatriate gifts and foreign-trust transactions can follow special rules, so confirm your facts with a cross-border CPA.

### How do I know which Form 3520 threshold applies to me?
It depends on the source. Gifts or bequests from a nonresident individual or a foreign estate use the ${USD_100K} aggregate test; purported gifts from a foreign corporation or partnership use a separate, annually-indexed threshold (${ENTITY_2026} for tax year 2026); and a foreign-trust distribution is reviewed under Part III rather than any gift threshold.

### Does it matter whether I received the money in India or the US?
For the Form 3520 test itself, not much — that turns on the gift or bequest. But money or securities held in an Indian account become FBAR and Form 8938 review items once they are yours, and a later remittance to the US may require bank/FEMA documentation depending on the source and route. Real estate held in a US account does not create FBAR merely by being here.

### What is different about inheriting Indian mutual funds?
Indian mutual funds are generally PFICs for US tax. Receiving them is not taxable, but holding and selling them can trigger Form 8621 and special default ("excess distribution") tax rules. This is the one inherited asset where getting US advice before acting can save the most — see the inherited mutual funds and PFIC guide.

### Is Form 3520 filed with my tax return?
No. Form 3520 is an information return filed separately from Form 1040. For most calendar-year individuals it is generally due April 15 (June 15 if you live and work outside the US), and a valid income-tax-return extension generally extends it no later than October 15. Verify the current instructions and address before submitting.`,
  },

  /* --------------------- GIFT FROM PARENTS ---------------------- */
  {
    slug: "gift-from-parents-india-to-usa",
    kind: "support",
    title: "Gift from Parents in India to the USA: Tax, Form 3520 and Documents",
    h1: "Gift from Parents in India to the USA: Tax, Form 3520 and Documents",
    seoTitle: "Gift from Parents in India to USA: Tax & Form 3520",
    metaDescription:
      "See whether money from parents in India is taxable in the USA, when Form 3520 applies, current LRS/TCS rules and which documents to keep.",
    navLabel: "Gift from parents to USA",
    icon: "💸",
    accent: "from-rose-500 to-pink-600",
    date: "2026-06-05",
    updated: RULES_VERIFIED,
    snapshotTitle: "Gift from parents in India — what to know",
    snapshotBadges: [`Form 3520 > $100k`, `TCS above ${LRS_TCS_THRESHOLD_LABEL}`],
    snapshotRows: [
      {
        label: "US recipient tax",
        value: "Generally none",
        note: "Receiving a genuine gift is not US-taxable income to you.",
        highlight: true,
      },
      {
        label: "Form 3520 threshold",
        value: `> ${USD_100K} / year`,
        note: "Aggregate foreign gifts/bequests from individuals/estates; a disclosure, not a tax.",
      },
      {
        label: "India LRS / TCS (sender)",
        value: `${TCS_RATE_PCT} above ${LRS_TCS_THRESHOLD_LABEL}`,
        note: "On the resident sender's LRS remittances above the yearly threshold; an advance-tax credit for them.",
      },
      {
        label: "Documents",
        value: "Gift deed + wires",
        note: "Gift declaration, source-of-funds, and matching bank records on both sides.",
      },
    ],
    excerpt:
      "Money from your parents in India — including help with a US down payment — is generally not taxable income to you in the US. What matters is the Form 3520 threshold, your US-person status, the current LRS/TCS rules on your parents' side, and a clean paper trail.",
    content: `Your parents in India want to send you money — to help with a house, a wedding, a business, or just to share what they have built. The reassuring headline: **receiving a genuine gift from your parents is generally not taxable income to you in the US.** The work is in the **reporting** (Form 3520, if you cross the threshold), your **US-person status**, the **India-side LRS/TCS** on your parents' end, and the **documentation**.

:::warn
title: Educational only — confirm with CPA / CA
- This is general information, **not US or India tax advice**. The Form 3520 threshold and India's LRS/TCS rules **change** and depend on your facts.
- Confirm with a **cross-border CPA** (US side) and a **Chartered Accountant (CA)** (India side).
:::

:::info
title: The short version
- Receiving a gift from your parents is **generally not income** to you in the US.
- Report on **Form 3520** — filed **separately from Form 1040** — if your year's foreign gifts/bequests from individuals/estates exceed **${USD_100K}**.
- In **India**, gifts from **specified relatives** (parents included) are generally **exempt** from gift tax; the resident **sender** may owe **TCS** above ${LRS_TCS_THRESHOLD_LABEL} under the LRS.
- Keep a **gift deed**, **wire records**, and **source-of-funds** proof.
:::

## Direct answer
A parent-to-child cash gift from India is, for the US **recipient**, generally **not taxable income** — you owe no US income tax simply for receiving it. US **gift tax**, where it applies at all, falls on the **giver**, and non-US parents gifting non-US-situated cash are generally outside the US gift-tax net. Your responsibility is **reporting** (Form 3520 if the year's foreign gifts cross ${USD_100K}) and keeping a clean paper trail. Subsequent income the money earns — interest, dividends, gains — is a separate, taxable matter.

## US recipient treatment
In the US system a genuine gift is **not** taxable income to the person receiving it. Your parents can send you a modest amount or a large one and your US income tax on that receipt is generally **zero**. Two caveats keep this honest:

- The **income** the money later earns is taxable and reportable.
- Gifts or bequests from a **covered expatriate**, and distributions from a **foreign trust**, follow special rules that are not covered here.

## Who qualifies as a US person
Form 3520 is a **US-person** obligation, so your status decides whether the threshold even applies. **Do not determine tax residency solely from visa status** — work it out first:

| Your status | US person for tax? |
|---|---|
| **US citizen** | Generally a US person |
| **Green-card holder** | Generally a US person |
| **H-1B / L-1 meeting US residency rules** | May be a US person (substantial-presence test) |
| **F-1 or another nonresident alien** | May not yet be a US person |
| **Not sure** | Determine US tax residency before applying the threshold |

## The Form 3520 threshold
If your **total** gifts and bequests from foreign **individuals or estates** in the year exceed **${USD_100K}**, you generally report them on **Form 3520**. It is a **disclosure, not a tax** — but the penalty for missing it can be significant. Form 3520 is **filed separately from Form 1040**, generally due April 15 for calendar-year filers (June 15 if you live and work abroad), with a valid return extension moving it no later than October 15. Once the ${USD_100K} trigger is crossed, each separate gift above **${USD_5K}** must be identified individually.

## Both parents and related-donor aggregation
The ${USD_100K} test is on the **aggregate** for the year, and **related donors are combined**. If **both parents** each send you money, add the two together for the threshold — you cannot treat them as two separate ${USD_100K} allowances. Gifts from a foreign **corporation or partnership**, by contrast, use a separate, much lower, annually-indexed threshold (${ENTITY_2026} for tax year 2026) and are a different case entirely.

## Several wires vs one wire
Splitting one gift into several smaller transfers does **not** avoid Form 3520. The test is on the **year's total**, not on any single wire, so five transfers of \\$30,000 from your parents are aggregated to \\$150,000 and cross the line just as one \\$150,000 wire would.

## Current India LRS and TCS treatment
Do not forget your parents' end of the transfer. Under India's **Liberalised Remittance Scheme (LRS)**, a resident individual can remit up to **US \\$250,000 per financial year** abroad. **No TCS generally applies if the resident sender's aggregate LRS remittances during the Indian financial year do not exceed ${LRS_TCS_THRESHOLD_LABEL}.** For **gifts and most other non-education / non-medical purposes, ${TCS_RATE_PCT} TCS generally applies to the portion exceeding ${LRS_TCS_THRESHOLD_LABEL}.** Importantly, **TCS is collected from the sender as an advance-tax credit and is not a tax imposed on the US recipient** — your parents credit it against their Indian income tax or claim a refund when they file. It affects their cash-flow timing, not your US tax. See the deeper [TCS on India remittances guide](/articles/tcs-india-remittance-tax) and estimate the cost with the [remittance & TCS cost calculator](/calculators/remittance-tcs-cost).

## US calendar year vs Indian financial year
Your **US Form 3520** aggregate is measured by your **US tax year** (January–December for most individuals). Your parents' **LRS/TCS** is measured by the **Indian financial year** (April–March). A gift wired in **January** and another the following **April** can sit in **one US calendar year** but **two Indian financial years** — so your US aggregate and each sender's India-side math may cover different windows.

## Direct-to-US vs Indian-account comparison
Where the money **lands** changes the **India-side and FBAR** picture more than the US gift question:

| Received directly in a US account | Received or retained in your Indian account |
|---|---|
| Direct international wire | The Indian account may count toward **FBAR** and **Form 8938** thresholds |
| No FBAR merely because the money is held in a US account | Interest, dividends or gains after receipt may be US-reportable |
| The Form 3520 threshold test still applies | A later remittance **may** require bank, FEMA, Form 15CA or Form 15CB documentation **depending on** the source, taxability and route |
| Your Indian parent handles LRS, TCS and bank documentation | Form 15CA/15CB is **not** automatically required in every case — confirm with the bank |
| Keep sender and recipient wire records | Keep Indian bank statements showing the credit and source of funds |

If it lands in India and you later move it, confirm the applicable process with the authorized dealer bank and a CA — see the [Form 15CA / 15CB repatriation guide](/india-tax-compliance/form-15ca-15cb-nri-repatriation). The Indian account you now hold also feeds your [FBAR & FATCA review](/articles/fbar-fatca-nri-guide).

## Home down-payment documentation
When the gift funds a US down payment, your **lender** joins the paperwork. They want to know the money is a **gift, not a loan**, and to see where it came from.

:::steps
1. **Lender gift letter** — confirms it is a gift, names the donor and relationship
2. **Source-of-funds trail** — your parents' bank records showing where the money came from
3. **Matching wire records** — the amount that lands in your account
4. **Form 3520 check** — if foreign gifts in the year cross ${USD_100K}
:::

The same gift letter that satisfies your lender also helps document the transfer as a **gift, not disguised income** — the distinction the IRS cares about. See [buying a home on a visa](/articles/buying-first-home-on-visa).

## Indian bank-document checklist
Ask your parents to keep the India-side records; chasing them later is painful.

:::good
title: For the resident sender (your parents)
- **Sender PAN and KYC**
- **Form A2 or bank remittance application**
- **LRS declaration**
- **Proof of parent–child relationship**
- **Gift declaration or gift deed**
- **Source-of-funds records**
- **Sending and receiving bank records**
- **RBI purpose code ${GIFT_PURPOSE_CODE}** for personal gifts and donations, subject to bank confirmation
- **TCS certificate / credit records** where applicable
:::

## Worked example
**Two parents, an aggregate above the threshold, different calendars.** Suppose your father wires you the equivalent of **\\$70,000** in December and your mother wires **\\$60,000** the following February, both toward your US home.

- **US side:** the two are **related donors**, so you aggregate them to **\\$130,000** — above ${USD_100K} — and file **Form 3520 Part IV** for that US tax year (both wires fall in the same US calendar year). There is **no automatic US income tax** on the receipt; each gift above ${USD_5K} is identified individually on the form.
- **India side:** each parent runs their **own** LRS limit and their **own** ${TCS_RATE_PCT}-above-${LRS_TCS_THRESHOLD_LABEL} TCS math as the resident sender — the amounts are **not** combined for India TCS the way they are for US Form 3520.
- **Calendars:** the December and February wires sit in **one US calendar year** but **two Indian financial years** (the February wire is in the next Indian FY). Keep each sender's records aligned to the right period.

:::cta
title: Check whether your gift needs Form 3520
body: Enter the tax year, who sent it, the aggregate amount, and where it landed — and get a Form 3520 result with the threshold used, plus FBAR/FATCA flags and a document list.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

## Frequently asked questions

### Do I pay US tax on money my parents in India send me?
Generally no. Receiving a genuine gift from your parents is not US-taxable income to you. If your total gifts and bequests from foreign individuals or estates in the year exceed ${USD_100K}, you report them on Form 3520 — a disclosure filed separately from Form 1040, not a tax. The income the money later earns is a separate, taxable matter.

### Does it matter if my parents send the gift in several smaller transfers?
No. The Form 3520 test is on the year's aggregate, and gifts from related donors such as both parents are combined. Splitting a gift into multiple wires does not avoid the reporting requirement if the total still exceeds the threshold.

### Will my parents pay tax in India to send me a gift?
The gift itself is generally exempt in India when it is from a parent, but as the resident sender they may face TCS on their LRS remittances. No TCS generally applies up to ${LRS_TCS_THRESHOLD_LABEL} of aggregate LRS remittances in the Indian financial year; above that, ${TCS_RATE_PCT} TCS generally applies to the excess for gifts, and they recover it as an advance-tax credit or refund on their Indian return.

### Can my parents gift me money for a US house down payment?
Yes. The gift is generally not taxable income to you, but your lender will want a gift letter confirming it is a gift, not a loan, plus a source-of-funds trail. If foreign gifts in the year exceed ${USD_100K}, Form 3520 also applies. Start the transfers early to meet your closing date.

### Does receiving a gift affect my FBAR?
The gift itself is not an account, but once it is sitting in — or routed through — an Indian account you hold, that account counts toward your FBAR and FATCA review once it is yours. Money received directly into a US account does not create FBAR merely by being here.`,
  },

  /* ------------------- INHERITED INDIAN PROPERTY -------------------- */
  {
    slug: "inherited-indian-property-us-tax",
    kind: "support",
    title: "Inherited Indian Property & US Tax: Basis, Form 3520 & Selling",
    seoTitle: "Inherited Indian Property & US Tax: Basis, Form 3520 & Selling",
    metaDescription:
      "Inherited property in India? It isn't taxable in the US when you inherit — tax comes when you sell. Here's the documentation, cost basis, Form 3520, and repatriation.",
    navLabel: "Inherited Indian property",
    icon: "🏠",
    accent: "from-amber-500 to-orange-600",
    date: "2026-06-22",
    excerpt:
      "Inheriting Indian property isn't taxable in the US when you inherit it — tax enters only when you sell, driven by your cost basis. Here's the documentation to gather, the Form 3520 angle, and the path to repatriation.",
    content: `Inheriting a flat, a house, or land in India is, for US tax purposes, **not a taxable event when you inherit it**. The tax questions arrive **later** — when the property earns rent, and especially when you **sell** — and they turn on your **cost basis** and the **capital gain**. Before any of that, the job is **documentation**: proving you inherited it and establishing the value.

:::warn
title: Educational only — confirm with CPA / CA
- This is general information, **not US or India tax, or legal advice**. Inheritance, basis, and capital-gains rules **change** and depend on your facts.
- Confirm with a **cross-border CPA** and a **CA**, and verify on the [IRS](https://www.irs.gov) and the [Income Tax portal](https://www.incometax.gov.in).
:::

:::info
title: The short version
- **Inheriting** Indian property is **not taxable income** to you in the US.
- A bequest from a foreign individual/estate over **$100,000** is reported on **Form 3520** (disclosure, not tax).
- Tax comes **later** — on **rent** and on the **capital gain** when you sell.
- Your **cost basis** and the **documentation** behind it are everything.
:::

## When is it taxed?
:::steps
1. **At inheritance** — generally not taxable to you in the US (report on Form 3520 if over the threshold)
2. **While you hold it** — rental income is taxable and reportable in both countries
3. **When you sell** — capital gains tax in India, and reported on your US return (with foreign tax credit relief for India tax via the [DTAA](/articles/double-taxation-dtaa-india-usa))
:::

## Documentation to establish inheritance and basis
:::good
title: Gather these early
- **Death certificate** of the owner
- **Will / probate** or, if intestate, **succession certificate / documents**
- **Legal heir certificate** establishing you as a lawful heir
- **Property title** and the chain of ownership
- Original **purchase deed and cost records**
- A **valuation report** near the date of inheritance
:::

:::warn
title: Why the valuation matters
- Your eventual **capital gain** depends on the **cost basis**. The original cost, improvements, and an inheritance-date valuation all feed it — under each country's own rules.
- Chasing these documents from the US **after** a sale is painful. Get a valuation and collect the title chain **now**.
:::

## Selling and bringing the money to the US
When you sell, you compute the gain, the buyer typically deducts **TDS**, and you may file an Indian return to reconcile. To move proceeds to the US you'll need the **repatriation paperwork**.

:::tip
title: Don't re-run the math here
- For the numbers, use the [India property capital-gains calculator](/calculators/india-property-capital-gains).
- For the document/FEMA workflow to move the money, see [repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa) and the [Form 15CA / 15CB checklist](/tools/form-15ca-15cb-checklist).
- High TDS on the full sale price is often **refundable** — see the [NRI TDS refund guide](/india-tax-compliance/nri-tds-refund-usa).
:::

## Form 3520 on the inheritance
A bequest from a foreign **individual or estate** over **US $100,000** in the year is generally reported on **Form 3520**. It's a **disclosure, not a tax** — but the penalty for missing it is real.

## Questions to ask
:::info
title: For your CPA and CA
- What's my **cost basis** for an eventual sale — under US and Indian rules?
- Does this bequest trigger **Form 3520** this year?
- While I hold it, how is **rental income** taxed and credited across both countries?
- When I sell, how do **TDS, the DTAA, and repatriation** fit together?
:::

:::cta
title: Check the reporting on your inheritance
body: Map who you inherited from, what it was, and the value — and get a Form 3520 / FBAR / PFIC review flag and a document list.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

- **Back to the hub:** [Money from parents: gifts, inheritance & Form 3520](/india-tax-compliance/foreign-gifts-inheritance-form-3520-india)
- **Siblings:** [Gift from parents to USA](/india-tax-compliance/gift-from-parents-india-to-usa) · [Inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic) · [Form 3520 checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist)
- **Related:** [Inheriting Indian assets & US tax](/articles/inheriting-indian-assets-us-tax) · [Repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa) · [Property capital-gains calculator](/calculators/india-property-capital-gains)

## Frequently asked questions

### Do I pay US tax when I inherit property in India?
No. Inheriting Indian property is not a taxable event for you in the US. Tax comes later — on rental income while you hold it and on the capital gain when you sell. A bequest from a foreign individual or estate over $100,000 is reported on Form 3520.

### What is my cost basis in inherited Indian property?
Your basis determines the capital gain when you sell, and the US and India compute it under their own rules — drawing on the original cost, improvements, and a valuation around the date of inheritance. Get a dated valuation report and keep the title chain; confirm the treatment with a cross-border CPA and a CA.

### How do I bring the sale proceeds of inherited property to the US?
After settling Indian capital-gains tax and TDS, you assemble source documents and use the Form 15CA/15CB repatriation route, subject to the FEMA limit. The high TDS withheld on the sale price is often refundable when you file an Indian return. See the repatriation and TDS-refund guides.

### Do I report inherited Indian property on FBAR or FATCA?
Real estate held directly is generally not an FBAR or FATCA account item by itself, but the Indian bank accounts the rent or sale proceeds flow into are. Once you sell or rent, the cash and accounts can trigger FBAR/FATCA. Confirm your specific reporting with a CPA.`,
  },

  /* --------------- INHERITED INDIAN MUTUAL FUNDS / PFIC ---------------- */
  {
    slug: "inherited-indian-mutual-funds-pfic",
    kind: "support",
    title: "Inherited Indian Mutual Funds & the PFIC Trap for US NRIs",
    seoTitle: "Inherited Indian Mutual Funds & the PFIC Trap (US NRIs)",
    metaDescription:
      "Inherited Indian mutual funds are generally PFICs for US tax — meaning Form 8621 and punitive default rules. Here's what that means and what to ask before acting.",
    navLabel: "Inherited mutual funds (PFIC)",
    icon: "📈",
    accent: "from-violet-500 to-purple-600",
    date: "2026-06-22",
    excerpt:
      "Inheriting Indian mutual funds is the one asset where the US tax tail wags the dog. They're generally PFICs — meaning Form 8621 and punitive default tax rules. Here's the trap, in plain English, and what to ask before you sell.",
    content: `Of everything you might inherit from India, **mutual funds are the one to slow down on.** Indian mutual funds are generally treated as **PFICs (Passive Foreign Investment Companies)** for US tax — a regime designed to be **punitive by default**. Inheriting them isn't taxable, but how you **hold and sell** them can trigger ugly tax and a fiddly form (**Form 8621**). Get US advice **before** you act.

:::warn
title: Educational only — get advice before you act
- This is general information, **not US or India tax advice**. PFIC rules are complex and **change**; the right move depends on your facts.
- Talk to a **cross-border CPA experienced with PFICs** before selling, switching, or reinvesting inherited Indian mutual funds. Verify on the [IRS](https://www.irs.gov).
:::

:::info
title: The short version
- Indian **mutual funds** ≈ **PFICs** for US tax.
- **Receiving** them by inheritance isn't taxable — but **holding/selling** triggers the PFIC rules.
- The **default ("excess distribution") regime** is deliberately harsh: highest tax rates plus interest charges.
- Each PFIC generally needs its own **Form 8621**.
:::

## What is a PFIC, in plain English?
A PFIC is a foreign pooled investment — like a mutual fund — that the US taxes under a special, **anti-deferral** regime. Left on the **default** treatment, gains and certain distributions are taxed at the **highest** rates with an **interest charge** for the years you held the fund, regardless of your actual bracket.

:::bad
title: Why the default regime hurts
- Gains taxed at the **highest** ordinary rate, not capital-gains rates
- An **interest charge** layered on, as if the tax were owed in earlier years
- **No step-up benefit** you might expect from other inherited assets
- A separate **Form 8621** per fund, with detailed calculations
:::

## The elections (why advice matters)
There are elections (such as **QEF** or **mark-to-market**) that can soften PFIC treatment, but they have **strict requirements and timing**, and Indian funds often don't provide the information a QEF needs. Whether an election is available — and worth it — is exactly the kind of call to make **with a CPA**, ideally **before** you sell.

:::tip
title: The practical playbook
- **Inventory** every inherited Indian mutual fund (fund name, units, dates, values).
- **Don't reflexively sell or switch** — the timing and method affect the tax.
- **Ask a PFIC-savvy CPA** about Form 8621 and whether any election helps.
- Coordinate with the **India side** — redemption, capital-gains tax, and TDS there.
:::

## Documentation to gather
:::good
title: For each inherited fund
- **AMC / registrar statement** — units, NAV, purchase and inheritance dates
- **Value at the date of inheritance** — for basis and PFIC computations
- **Death certificate, will/succession, legal heir certificate** — to effect the transmission
- **Capital-gains statement** when you eventually redeem (India side)
:::

## Questions to ask
:::info
title: For your CPA (and CA)
- Are these holdings **PFICs**, and which need **Form 8621**?
- Is a **QEF or mark-to-market election** available and worth it for me?
- What's the **least-bad way and timing** to exit, across both countries?
- How do the Indian **redemption, capital-gains tax, and TDS** line up with the US side?
:::

:::cta
title: Flag the PFIC issue on your inheritance
body: Tell the checker you inherited mutual funds and it will raise the PFIC / Form 8621 review flag and list what to gather before you talk to a CPA.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

- **Back to the hub:** [Money from parents: gifts, inheritance & Form 3520](/india-tax-compliance/foreign-gifts-inheritance-form-3520-india)
- **Siblings:** [Gift from parents to USA](/india-tax-compliance/gift-from-parents-india-to-usa) · [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax) · [Form 3520 checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist)
- **Related:** [PFIC & Indian mutual funds trap](/articles/pfic-indian-mutual-funds-trap) · [Inheriting Indian assets & US tax](/articles/inheriting-indian-assets-us-tax) · [FBAR / FATCA](/articles/fbar-fatca-nri-guide)

## Frequently asked questions

### Are inherited Indian mutual funds taxable when I inherit them?
Receiving them by inheritance is generally not taxable income to you in the US. The catch is what happens afterward: Indian mutual funds are generally PFICs, so holding and selling them triggers the PFIC regime and likely Form 8621. Get advice before you sell.

### What is the PFIC problem with Indian mutual funds?
Under the default PFIC ("excess distribution") rules, gains and certain distributions are taxed at the highest ordinary rates with an added interest charge, regardless of your bracket. Each fund generally needs its own Form 8621. Elections like QEF or mark-to-market can help but have strict requirements.

### Should I sell inherited Indian mutual funds right away?
Not without advice. The timing and method of exit affect the US tax under the PFIC rules, and the Indian side has its own capital-gains tax and TDS. Inventory the holdings and consult a PFIC-experienced CPA before redeeming or switching.

### Do inherited mutual funds count for FBAR and FATCA?
They can. Indian mutual fund / demat holdings may count toward your FATCA (Form 8938) reporting, and related accounts toward FBAR. This is separate from the PFIC income rules. Confirm your specific reporting with a cross-border CPA.`,
  },

  /* ------------------ FORM 3520 CHECKLIST -------------------- */
  {
    slug: "form-3520-indian-gift-inheritance-checklist",
    kind: "support",
    title: "Form 3520 Checklist for Gifts and Inheritance from India",
    h1: "Form 3520 Checklist for Gifts and Inheritance from India",
    seoTitle: "Form 3520 Checklist for Indian Gifts & Inheritance",
    metaDescription:
      "Use this step-by-step Form 3520 checklist for gifts and inheritances from India: thresholds, donor types, deadlines, records and CPA questions.",
    navLabel: "Form 3520 checklist",
    icon: "🧾",
    accent: "from-sky-500 to-blue-600",
    date: "2026-06-22",
    updated: RULES_VERIFIED,
    hideSnapshot: true,
    showPrintButton: true,
    excerpt:
      "A step-by-step Form 3520 checklist for gifts and inheritance from India — determine your status, pick the right threshold, aggregate related donors, collect the records, and confirm the deadline and mechanics before you file.",
    content: `Work through this checklist top to bottom. It takes a gift from your parents or an inheritance from India and turns the Form 3520 question into concrete steps — the right threshold for your source, the records to gather, and the deadline mechanics. Form 3520 is an **information return filed separately from Form 1040**; the risk is the penalty for not filing, not a tax on the gift.

:::info
title: The four stages at a glance
- **Determine status** — confirm you are a US person and pick the tax year
- **Aggregate amounts** — combine related donors and convert to USD
- **Collect records** — the documents that support the filing
- **File separately** — Form 3520 is filed apart from Form 1040, on its own timeline
:::

## The step-by-step checklist
:::steps
1. **Determine US-person status** — Form 3520 is a US-person obligation; visa type alone does not decide it, so confirm your US tax residency first.
2. **Select the transaction type** — a gift, a bequest from a foreign estate, a distribution from a foreign trust, or a purported entity gift. Each routes differently.
3. **Identify the donor / source category** — nonresident individual, foreign estate, foreign corporation, foreign partnership, or foreign trust.
4. **Choose the tax year** — the US tax year the amount was received (calendar year for most individuals); the entity threshold is set per year.
5. **Aggregate related donors** — combine gifts from related givers (for example, both parents) into one total for the threshold test.
6. **Convert each receipt to USD** — value each gift or bequest in USD on the date it was received.
7. **Apply the correct threshold** — ${USD_100K} aggregate for a nonresident individual or foreign estate; the indexed entity figure (${ENTITY_2026} for TY 2026, ${ENTITY_2025} for TY 2025) for a foreign corporation/partnership; a foreign trust is reviewed under Part III, not the ${USD_100K} test.
8. **Identify gifts above ${USD_5K}** — once the individual/estate ${USD_100K} trigger is crossed, list each separate gift above ${USD_5K} individually.
9. **Collect the documents** — use the grouped lists below for your situation.
10. **Confirm the filing deadline and extension** — generally April 15 (June 15 if you live and work abroad); a valid income-tax-return extension generally extends Form 3520 no later than October 15.
11. **Confirm the mailing / e-filing mechanics** — using the current Instructions for Form 3520 and the current filing address before you submit.
12. **Send an organized package to your CPA** — the numbers, the documents, and your answers above.
13. **Retain records** — keep the filing and its supporting documents for your records.
14. **Missed a prior year?** — do not guess; ask your CPA about the cleanest catch-up path and any reasonable-cause relief.
:::

## Documents to collect — by situation
Pick the group that matches what you received.

:::good
title: Cash gift
- Gift letter / declaration
- Sender and recipient bank records
- Relationship proof
- Source-of-funds evidence
- Date and USD value
:::

:::good
title: Inheritance
- Will
- Probate / succession records
- Death certificate
- Legal-heir records
- Date-of-death valuation
- Estate distribution records
:::

:::info
title: Non-cash asset
- Asset description
- Original acquisition information
- Gift-date or death-date valuation
- Title / ownership records
- Subsequent income records
:::

:::info
title: Foreign trust
- Trust deed
- Beneficiary statement
- Distribution statement
- Trustee details
- Specialist CPA review
:::

## Questions to ask your CPA
- Did my year's aggregate from this source cross the correct Form 3520 threshold — and what is my deadline?
- Do I need to combine related donors (for example, both parents)?
- Does my income-tax-return extension cover Form 3520?
- If I missed a prior year, what is the cleanest way to catch up?
- What documentation should I keep on file to support the filing?

:::cta
title: Not sure if you are in scope? Start the checker
body: Answer a few questions — the tax year, source category, aggregate value, and what you received — and get a Form 3520 result with the threshold used, plus the documents to collect. No login and no email required.
button: Start the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

For the official form and current instructions, see the IRS in the Primary official sources below.

## Frequently asked questions

### Which Form 3520 threshold applies to a gift from my parents?
Gifts and bequests from a nonresident individual or a foreign estate — which includes your parents — are reported when the year's aggregate exceeds ${USD_100K}. That is different from the annually-indexed entity threshold for a foreign corporation or partnership (${ENTITY_2026} for tax year 2026), and different again from a foreign-trust distribution, which is reviewed under Part III.

### How do I aggregate gifts from both parents?
Add together the gifts and bequests from related donors and test the combined total against the ${USD_100K} threshold. Both parents count as related donors, so you cannot treat each as a separate ${USD_100K} allowance. Convert each receipt to USD on the date received before adding.

### When is Form 3520 due and how is it filed?
Form 3520 is filed separately from Form 1040. For most calendar-year individuals it is generally due April 15, or June 15 if you live and work outside the US, and a valid return extension generally extends it no later than October 15. Confirm the current mailing or e-filing mechanics in the Instructions for Form 3520 before submitting.

### Does a foreign trust use the $100,000 gift threshold?
No. A distribution from a foreign trust is reviewed under Form 3520 Part III (and possibly Form 3520-A), not the ${USD_100K} gift test. Treat it as a specialist case and get cross-border advice before acting.`,
  },
];

/** All cluster pages, with reading time computed. */
export const giftPages: GiftPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

/** The pillar page. */
export const giftPillar: GiftPage = giftPages.find(
  (p) => p.kind === "pillar"
)!;

/** The supporting pages, in authored order. */
export const giftSupportPages: GiftPage[] = giftPages.filter(
  (p) => p.kind === "support"
);

/** Look up a cluster page by its slug ("" / unknown → undefined). */
export function getGiftPage(slug: string): GiftPage | undefined {
  return giftPages.find((p) => p.slug === slug);
}
