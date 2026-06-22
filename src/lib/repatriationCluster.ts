import { computeReadingTime } from "@/lib/format";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TITLE } from "@/lib/taxCompliance";

/**
 * Topic cluster (hub-&-spoke) for "Form 15CA, Form 15CB & Repatriation Paperwork".
 *
 *   /india-tax-compliance/                                       ← parent hub (existing)
 *     └─ /form-15ca-15cb-nri-repatriation                        ← pillar page
 *          ├─ /form-15ca-for-nri
 *          ├─ /form-15cb-ca-certificate-nri
 *          ├─ /repatriating-property-sale-proceeds-india-usa
 *          └─ /nro-to-usa-transfer-documents                     ← supporting pages
 *
 * A *document & workflow* cluster, not a calculator: it explains the paperwork
 * (Form 15CA / 15CB, CA certificate, FEMA / bank repatriation request, source-
 * of-funds proof) for moving money from India to the USA. It deliberately does
 * NOT recompute property-gain tax or remittance TCS — it links out to the
 * existing calculators for those.
 *
 * Sibling of lib/itrCluster.ts and lib/tdsCluster.ts: same authoring format
 * (light-markdown + ::: fences rendered by ArticleBody), same /india-tax-compliance
 * parent hub, and the same shared dynamic route at /india-tax-compliance/[slug]
 * (which resolves all three clusters by slug). See components/RepatriationClusterPage.tsx.
 *
 * Educational-only: nothing here is tax, legal, or FEMA advice. The forms,
 * thresholds, the Form 15CA Part A/B/C/D split, AO-certificate rules, and the
 * repatriation limits change over time and depend on your facts — always
 * confirm with a qualified CA and your authorised-dealer bank, and verify on
 * the Income Tax portal (incometax.gov.in) / RBI before acting.
 */

export type RepatPageKind = "pillar" | "support";

export interface RepatPageData {
  /** The child segment under /india-tax-compliance (e.g. "form-15ca-for-nri"). */
  slug: string;
  kind: RepatPageKind;
  title: string;
  /** SEO <title> override (falls back to `title`). */
  seoTitle?: string;
  /** SEO meta description (falls back to `excerpt`). ~140–160 chars. */
  metaDescription?: string;
  excerpt: string;
  /** Short label shown in cluster navigation + hub cards. */
  navLabel: string;
  /** Emoji shown in the topic pill and hub card tile. */
  icon: string;
  /** Tailwind gradient classes for the hub card icon tile. */
  accent: string;
  date: string;
  updated?: string;
  content: string;
}

export interface RepatPage extends RepatPageData {
  readingTime: number;
}

/** Parent hub these pages live under (the existing India Tax & Compliance hub). */
export const REPAT_HUB_PATH = TAX_COMPLIANCE_PATH;
export const REPAT_HUB_TITLE = TAX_COMPLIANCE_TITLE;

/** The pillar slug (everything else is a supporting page). */
export const REPAT_PILLAR_SLUG = "form-15ca-15cb-nri-repatriation";

/** Root-relative path for any cluster page. */
export const repatPath = (slug: string) => `${REPAT_HUB_PATH}/${slug}`;

/** Section heading + card copy used on the parent hub page. */
export const REPAT_CLUSTER_SECTION = {
  eyebrow: "New",
  title: "Form 15CA / 15CB & Repatriation Paperwork",
  description:
    "Moving money from India to the USA? Learn the document trail — Form 15CA, Form 15CB CA certificate, source-of-funds proof, TDS proof, and the FEMA/bank repatriation request — and the order to do it in.",
};

const rawPages: RepatPageData[] = [
  /* ----------------------------- PILLAR ----------------------------- */
  {
    slug: REPAT_PILLAR_SLUG,
    kind: "pillar",
    title:
      "Form 15CA & 15CB for NRIs: Repatriating Money from India to the USA",
    seoTitle:
      "Form 15CA & 15CB for NRIs: Repatriating Money from India to the USA",
    metaDescription:
      "Understand when Form 15CA, Form 15CB, CA certificate, bank documents, TDS proof, and FEMA paperwork may be needed before moving money from India to the USA.",
    navLabel: "Start here: the full guide",
    icon: "🌐",
    accent: "from-indigo-500 to-blue-600",
    date: "2026-06-22",
    excerpt:
      "Before your bank wires money from India to the USA, it usually wants a paper trail: Form 15CA, sometimes a Form 15CB CA certificate, proof of where the money came from, and tax/TDS proof. Here's what each piece is, when it's needed, and the order to do it in.",
    content: `Moving money from India to the USA is rarely just a bank transfer. Because the funds are leaving the country, your **authorised-dealer (AD) bank** has to satisfy two separate masters: the **Income Tax Department** (has the right tax been accounted for?) and **FEMA / RBI** (is this a permitted remittance with the right paperwork?). The tools that connect the two are **Form 15CA** and **Form 15CB**. This guide explains each form, when banks ask for them, the documents to gather, and a step-by-step "before you wire money" checklist.

:::warn
title: Read this first — educational only
- This is general educational information, **not tax, legal, or FEMA advice**. The forms, thresholds, the Form 15CA Part A/B/C/D split, and repatriation limits change over time and depend on your facts.
- Always confirm what applies to **your** remittance with a qualified **Chartered Accountant (CA)** and your **AD bank**, and verify current rules on the [Income Tax portal](https://www.incometax.gov.in) and with the [RBI](https://www.rbi.org.in).
- This is a **document & workflow** guide. For the numbers, use the [India property capital-gains calculator](/calculators/india-property-capital-gains), the [remittance TCS calculator](/calculators/remittance-tcs-cost), and the [DTAA / foreign tax credit calculator](/calculators/dtaa-foreign-tax-credit).
:::

:::info
title: What you'll get on this page
- Plain-English definitions of **Form 15CA** and **Form 15CB**
- **When banks ask** for them, and the difference between tax compliance and bank/FEMA documentation
- The common **NRI remittance sources** and what each one needs
- A full **documents checklist** and a high-level view of the four **Form 15CA parts**
- A visual **"before you wire money" checklist**, common mistakes, and questions for your CA and bank
:::

## 1. What is Form 15CA?
**Form 15CA** is an online **declaration by the remitter** — the person sending money abroad — filed on the Income Tax portal. In broad terms, it tells the tax department about a payment being made to a non-resident or abroad, and confirms how the tax side has been handled. The bank typically wants the **15CA acknowledgement** on file before it processes the outward remittance.

:::tip
title: The one-line version
- Form 15CA = **your declaration** about the remittance and its tax treatment, filed online and given to the bank.
- It is **self-filed** (by you or your CA) on the [Income Tax portal](https://www.incometax.gov.in) — not issued by anyone else.
- The exact part of 15CA you file, and whether a 15CB is needed first, depends on the amount and taxability — **confirm with your CA**. See [Form 15CA for NRIs](/india-tax-compliance/form-15ca-for-nri).
:::

## 2. What is Form 15CB?
**Form 15CB** is a **certificate issued by a Chartered Accountant**. Where it applies, the CA reviews the remittance and certifies details such as the nature of the payment, its taxability, the rate and amount of any tax/TDS, and any **DTAA** treaty position. It is commonly required **before** filing certain parts of Form 15CA for larger, taxable remittances.

| Form 15CA | Form 15CB |
|---|---|
| Self-declaration by the remitter (you) | Certificate signed by a Chartered Accountant |
| Filed online on the Income Tax portal | The CA certifies taxability, rate, TDS and DTAA position |
| Given to the bank as the acknowledgement | Often a prerequisite for the 15CA part used for larger taxable remittances |

Read the deep dive: [Form 15CB & the CA certificate](/india-tax-compliance/form-15cb-ca-certificate-nri).

## 3. When banks ask for them
Banks generally raise these forms when money is leaving India through your **NRO account** to an overseas (e.g. US) account, because NRO funds are India-sourced and the bank must see that tax has been accounted for.

:::good
title: Situations where the bank commonly asks
- Repatriating **property-sale proceeds** from an NRO account
- Transferring **accumulated rent, dividends, or interest** out of an NRO account
- Moving **inherited money** or a **gift** received in India abroad
- Any **NRO-to-overseas** transfer above the bank's documentation trigger
:::

:::tip
title: NRE vs NRO matters
- **NRE** balances are generally freely repatriable and often need lighter paperwork, because that money was already foreign-sourced.
- **NRO** balances are India-sourced, so the 15CA/15CB and source-of-funds trail is where most of the work sits. See [NRE vs NRO accounts explained](/articles/nre-nro-accounts-explained).
- Each bank applies its own internal checklist on top of the legal requirement — **ask your bank for its exact list early**.
:::

## 4. Tax compliance vs bank / FEMA documentation
A common source of confusion: 15CA/15CB are about **tax**, but they are only one half of what the bank needs. The other half is **FEMA / RBI** documentation that the remittance is permitted and within limits.

| Tax compliance (Income Tax) | Bank / FEMA documentation (RBI) |
|---|---|
| Form 15CA declaration | Bank's outward-remittance / repatriation request form |
| Form 15CB CA certificate (where applicable) | Source-of-funds proof and KYC |
| TDS proof, Form 26AS / AIS | Compliance with the annual repatriation limit under FEMA |
| The income was correctly taxed in India | The transaction is a permitted current/capital-account remittance |

:::warn
title: Both halves must line up
- A perfect 15CA/15CB still won't move money if the **FEMA / bank** paperwork (source proof, request form, limit check) is missing — and vice versa.
- The widely-cited **USD 1 million per financial year** repatriation limit from NRO sits on the **FEMA side**, not the tax side. Confirm the current limit and conditions with your bank. See [repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa).
:::

## 5. Common NRI remittance sources
What you'll need varies by **where the money came from**. The source drives the source-of-funds proof and the taxability question.

| Source of funds | What it typically needs |
|---|---|
| **Property-sale proceeds** | Sale deed, purchase deed, capital-gains computation, TDS proof; often 15CB. See [the property workflow](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa). |
| **Inherited money** | Inheritance evidence (will / succession certificate / legal heir proof), plus proof the underlying asset's tax was handled. |
| **NRO-to-overseas transfer** | NRO statement, source proof for the credits, 15CA (and 15CB where applicable). See [NRO-to-USA transfer documents](/india-tax-compliance/nro-to-usa-transfer-documents). |
| **Accumulated rent** | Rent records, proof rent was offered to tax / TDS handled, Form 26AS / AIS. |
| **Dividend / interest income** | Dividend & interest statements, TDS proof, Form 26AS / AIS. |
| **Gift from parents** | Gift documentation / declaration and the giver's details; consider US-side gift-reporting separately. |
| **Sale of shares / mutual funds** | Broker / AMC capital-gains statements, TDS proof, cost records. |

:::tip
title: Don't forget the US side
- Whatever the source, once the money is in the US it interacts with your **US return, FBAR, and FATCA**. A large gift from parents can raise **Form 3520** questions; the underlying Indian accounts feed **FBAR/FATCA**.
- See [DTAA & double taxation](/articles/double-taxation-dtaa-india-usa), [gifting money from India](/articles/gifting-money-india-tax-implications), and [FBAR / FATCA](/articles/fbar-fatca-nri-guide).
:::

## 6. Documents checklist
Gather these into one folder before you approach the bank. The exact set depends on the source and amount — your bank and CA will tell you which apply.

:::steps
1. **PAN** — your remittance and any 15CA/15CB are keyed to it
2. **Passport / OCI** — to evidence NRI status
3. **NRO bank statement** — for the account the money is leaving
4. **Source-of-funds proof** — what the credits in the account actually are
5. **Tax paid / TDS proof** — challans, TDS certificates (Form 16A / 16B as applicable)
6. **Form 26AS / AIS** — the department's record of income and TDS against your PAN
7. **Sale deed + purchase deed** — if the money is property-sale proceeds
8. **Inheritance documents** — will / succession certificate / legal-heir proof, if inherited
9. **CA certificate / Form 15CB** — if applicable to your remittance
10. **Form 15CA acknowledgement** — the filed declaration from the portal
11. **Bank repatriation request form** — the bank's own outward-remittance form (FEMA side)
:::

For the income-record pieces, see [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri); for treaty paperwork, the [Form 10F generator](/tools/form-10f-generator).

## 7. The four parts of Form 15CA (high level)
Form 15CA is split into parts, and **which part applies depends on the amount and whether the payment is taxable**. At a high level it is commonly understood as:

:::info
title: A general map — confirm the right part with your CA / bank
- **Part A** — generally used for **smaller taxable remittances** up to a specified limit in the financial year.
- **Part B** — generally used where an **order or certificate from the Assessing Officer (AO)** has been obtained for the payment.
- **Part C** — generally used for **larger taxable remittances** above the specified limit, where a **Form 15CB** CA certificate is obtained first.
- **Part D** — generally used where the remittance is **not chargeable to tax** in India.
:::

:::warn
title: This is a high-level map, not legal advice
- The **threshold** (often cited as around **₹5 lakh** of taxable remittance in a financial year), the conditions for each part, and the list of payments exempt from 15CA/15CB **change over time** and depend on your specific facts.
- Do **not** decide your part from this page. **Confirm the correct part and whether a 15CB is required with your CA and your bank** for the current year.
:::

## 8. Before you wire money — the checklist
A clean order of operations keeps a transfer from stalling at the bank counter:

:::steps
1. **Identify the source of funds** — property sale, inheritance, rent, dividends, gift, or share/MF sale
2. **Check taxability / TDS** — is this income taxable in India, and was TDS already deducted?
3. **Collect Form 26AS / AIS** — confirm the income and TDS show against your PAN
4. **Ask your CA if a 15CB is needed** — based on the amount and taxability
5. **File Form 15CA if required** — the correct part, online on the Income Tax portal
6. **Submit the bank documents** — repatriation request form, source proof, 15CA/15CB, KYC
7. **Keep records for US tax / FBAR / FATCA review** — store everything for your US return
:::

:::tip
title: Map your own situation in two minutes
- Not sure which documents and whether a CA review is needed? Run your case through the [Form 15CA / 15CB checklist tool](/tools/form-15ca-15cb-checklist).
:::

## 9. Common mistakes
:::warn
title: Where NRI remittances get stuck
- **Treating it as a tax-only or bank-only task** — you need both the 15CA/15CB **and** the FEMA/bank paperwork.
- **Leaving 15CB to the last minute** — the CA needs time and documents to certify; book it early.
- **Weak source-of-funds proof** — the bank wants to see exactly what each NRO credit is.
- **A Form 26AS / AIS mismatch** — if TDS or income doesn't reconcile, expect questions. See [Form 26AS, AIS & TIS](/india-tax-compliance/form-26as-ais-tis-nri).
- **Guessing the 15CA part** — filing the wrong part, or skipping a required 15CB, causes rework.
- **Forgetting the US side** — not keeping records for the US return, FBAR, and FATCA.
- **Ignoring the FEMA limit** — assuming any amount is freely repatriable from NRO.
:::

## 10. Questions to ask your CA and bank
:::info
title: For your CA
- Is this remittance **taxable in India**, and has the right **TDS** been accounted for?
- Do I need a **Form 15CB**, and which **part of Form 15CA** applies to me this year?
- Can the **DTAA** reduce the tax — and do you have my **Form 10F + TRC**?
- Does my **Form 26AS / AIS** reconcile with the source income?
:::

:::info
title: For your bank
- What is your **exact document checklist** for this repatriation?
- Which **repatriation request form** do you need, and in what order with the 15CA/15CB?
- How does the **FEMA repatriation limit** apply to my transfer this financial year?
- Is my **NRO account and KYC** in order for an outward remittance?
:::

:::cta
title: Walk through your remittance step by step
body: Use the free Form 15CA / 15CB checklist to map your source of funds, taxability, and documents — and see whether a CA review is strongly recommended.
button: Open the 15CA / 15CB checklist
href: /tools/form-15ca-15cb-checklist
:::

- **Go deeper:** [Form 15CA for NRIs](/india-tax-compliance/form-15ca-for-nri) · [Form 15CB & the CA certificate](/india-tax-compliance/form-15cb-ca-certificate-nri) · [Repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa) · [NRO-to-USA transfer documents](/india-tax-compliance/nro-to-usa-transfer-documents)
- **Related guides:** [NRI TDS refund from USA](/india-tax-compliance/nri-tds-refund-usa) · [NRI ITR filing from USA](/india-tax-compliance/nri-itr-filing-usa) · [Form 26AS, AIS & TIS](/india-tax-compliance/form-26as-ais-tis-nri)
- **Run the numbers:** [Property capital-gains calculator](/calculators/india-property-capital-gains) · [Remittance TCS calculator](/calculators/remittance-tcs-cost) · [DTAA calculator](/calculators/dtaa-foreign-tax-credit) · [Form 10F generator](/tools/form-10f-generator)

## Frequently asked questions

### What is the difference between Form 15CA and Form 15CB?
Form 15CA is an online self-declaration filed by the person sending money abroad, submitted on the Income Tax portal and given to the bank. Form 15CB is a certificate signed by a Chartered Accountant that certifies the taxability, rate, TDS, and treaty position of the remittance, and is commonly required before filing the 15CA part used for larger taxable remittances. Confirm what applies with your CA.

### Do NRIs always need Form 15CB to send money from India to the USA?
Not always. Whether a 15CB is needed depends on the amount, whether the remittance is taxable, and the current rules — some remittances need only a part of Form 15CA, and some categories are exempt. Larger taxable remittances commonly need a 15CB first. Always confirm with your CA and your bank for your specific transfer.

### Is there a limit on repatriating money from an NRO account?
Yes. Repatriation from NRO is subject to a FEMA limit, widely cited as up to USD 1 million per financial year, along with documentation requirements. This is a FEMA/RBI rule, separate from the tax forms. Verify the current limit and conditions with your authorised-dealer bank.

### Do I need to report money brought from India on my US taxes?
If you are a US tax resident, the income behind the money is generally reportable on your US return, and the underlying Indian accounts may trigger FBAR and FATCA reporting. A large gift from family abroad can raise Form 3520 questions. Keep your repatriation records and coordinate both sides with a CPA.

### Which part of Form 15CA applies to me?
It depends on the amount and taxability: smaller taxable remittances, AO-certified cases, larger taxable remittances (with a 15CB), and non-taxable remittances are handled by different parts. The exact part and thresholds change over time — do not decide it from a guide; confirm the correct part with your CA and bank.`,
  },

  /* --------------------------- FORM 15CA ----------------------------- */
  {
    slug: "form-15ca-for-nri",
    kind: "support",
    title: "Form 15CA for NRIs: The Remitter's Online Declaration",
    seoTitle: "Form 15CA for NRIs: The Online Remittance Declaration Explained",
    metaDescription:
      "Form 15CA is the online declaration you file before sending money abroad from India. Here's what it is for NRIs, its four parts at a high level, and how it reaches your bank.",
    navLabel: "Form 15CA for NRIs",
    icon: "🧾",
    accent: "from-sky-500 to-blue-600",
    date: "2026-06-22",
    excerpt:
      "Form 15CA is the remitter's online declaration filed before money leaves India. Here's what it covers for NRIs, the four parts at a high level, and how the acknowledgement reaches your bank.",
    content: `When you move money out of India, **Form 15CA** is usually the first tax-side document the bank wants. It is an **online declaration by the remitter** — you, or your CA on your behalf — filed on the Income Tax portal, telling the department about the payment and how its tax has been handled.

:::warn
title: Educational only — confirm with CA / bank
- This is general information, **not tax or legal advice**. The parts, thresholds, and exemptions for Form 15CA **change over time** and depend on your facts.
- Confirm the correct part and whether a 15CB is required with your **CA** and your **bank**, and verify on the [Income Tax portal](https://www.incometax.gov.in).
:::

## What Form 15CA does
At a high level, Form 15CA records the **remittance details** (amount, currency, beneficiary), the **nature of the payment**, and its **tax treatment**, and acts as your declaration to the department. The bank typically keeps the **15CA acknowledgement** on file before processing the outward transfer.

:::good
title: Key things to know
- It is **self-filed online** — not issued by the bank or a third party.
- It is filed **before** the remittance is processed.
- For certain remittances it must be filed **after** obtaining a **[Form 15CB](/india-tax-compliance/form-15cb-ca-certificate-nri)** CA certificate.
- Some categories of payment are **exempt** from 15CA — your CA can confirm whether yours is.
:::

## The four parts — a high-level map
Which part you file depends on the **amount** and whether the payment is **taxable**:

:::info
title: General map — confirm the right part with your CA
- **Part A** — generally for **smaller taxable remittances** up to a specified financial-year limit.
- **Part B** — generally where an **Assessing Officer (AO) order/certificate** has been obtained.
- **Part C** — generally for **larger taxable remittances** above the limit, with a **Form 15CB** obtained first.
- **Part D** — generally where the remittance is **not chargeable to tax** in India.
:::

:::warn
title: Don't pick your part from this page
- The threshold (often cited around **₹5 lakh** in a financial year), the per-part conditions, and the exempt list **change** and are fact-specific.
- **Confirm the correct part — and whether a 15CB is needed — with your CA and bank** for the current year.
:::

## How it reaches your bank
:::steps
1. Gather the remittance details — amount, beneficiary, purpose, and the tax position
2. Obtain a 15CB first if your case needs one (your CA will tell you)
3. File the correct part of Form 15CA online on the Income Tax portal
4. Download the 15CA acknowledgement
5. Hand the acknowledgement (and 15CB, if any) to your bank with its repatriation request form
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Which **part of Form 15CA** applies to my remittance this year?
- Do I need a **Form 15CB** first, or is my payment exempt?
- Does the **DTAA** change the tax position — and do you have my **Form 10F + TRC**?
- Does my **Form 26AS / AIS** support the declaration?
:::

:::cta
title: See the full repatriation workflow
body: The pillar guide ties Form 15CA to the 15CB certificate, the bank/FEMA paperwork, and the order to do everything in.
button: Read the Form 15CA & 15CB guide
href: /india-tax-compliance/form-15ca-15cb-nri-repatriation
:::

- **Back to the pillar:** [Form 15CA & 15CB for NRIs](/india-tax-compliance/form-15ca-15cb-nri-repatriation)
- **Siblings:** [Form 15CB & the CA certificate](/india-tax-compliance/form-15cb-ca-certificate-nri) · [Repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa) · [NRO-to-USA transfer documents](/india-tax-compliance/nro-to-usa-transfer-documents)
- **Tools:** [15CA / 15CB checklist](/tools/form-15ca-15cb-checklist) · [Form 10F generator](/tools/form-10f-generator)

## Frequently asked questions

### Who files Form 15CA?
The remitter — the person sending the money abroad — files Form 15CA, either themselves or through their CA, online on the Income Tax portal. The bank then keeps the acknowledgement on file before processing the outward remittance.

### Is Form 15CA always required to send money abroad?
Not in every case. Some categories of remittance are exempt, and small or non-taxable remittances use different parts. Whether you need it, and which part, depends on the amount and taxability for the current year — confirm with your CA and bank.

### Do I file Form 15CA before or after Form 15CB?
Where a Form 15CB is required, the CA certificate is generally obtained first and its details are used when filing the relevant part of Form 15CA. Your CA will confirm the order for your specific remittance.`,
  },

  /* --------------------------- FORM 15CB ----------------------------- */
  {
    slug: "form-15cb-ca-certificate-nri",
    kind: "support",
    title: "Form 15CB & the CA Certificate for NRI Remittances",
    seoTitle: "Form 15CB for NRIs: The CA Certificate for Outward Remittances",
    metaDescription:
      "Form 15CB is a Chartered Accountant's certificate on the taxability of money sent abroad. Here's when NRIs need it, what the CA certifies, and how it links to DTAA and Form 15CA.",
    navLabel: "Form 15CB CA certificate",
    icon: "📝",
    accent: "from-violet-500 to-purple-600",
    date: "2026-06-22",
    excerpt:
      "Form 15CB is a Chartered Accountant's certificate on the taxability of an outward remittance. Here's when NRIs need it, what the CA certifies, and how it connects to the DTAA and Form 15CA.",
    content: `Where **Form 15CA** is your own declaration, **Form 15CB** is the **independent check** — a certificate signed by a **Chartered Accountant** confirming how the remittance should be taxed. For larger, taxable transfers out of India, the bank commonly wants the 15CB on file.

:::warn
title: Educational only — confirm with CA / bank
- This is general information, **not tax or legal advice**. When a 15CB is required, and what it must contain, **change over time** and depend on your facts.
- Confirm with a qualified **CA** and your **bank**, and verify on the [Income Tax portal](https://www.incometax.gov.in).
:::

## What the CA certifies
In a 15CB, the CA reviews the remittance and certifies details such as:

:::good
title: Typically covered in a 15CB
- The **nature of the payment** and the income behind it
- Whether it is **chargeable to tax** in India, and under which head
- The **rate and amount** of tax / TDS applied
- The **DTAA** treaty position, where a treaty rate is claimed
:::

## When NRIs commonly need it
:::info
title: Often required when
- The remittance is **taxable** and **above the specified limit** (the [Form 15CA](/india-tax-compliance/form-15ca-for-nri) **Part C** route).
- The bank's checklist asks for an independent CA certificate before an outward transfer.
:::

:::bad
title: It may not be needed when
- The remittance is **not chargeable to tax** (often a different 15CA part).
- The payment falls in an **exempt category**, or is **small** and below the threshold.
- An **AO certificate/order** governs the deduction instead.
- In all cases, **your CA confirms** whether a 15CB is required — don't assume from a guide.
:::

## How 15CB connects to DTAA and Form 10F
If a **DTAA** treaty rate reduces the Indian tax, the CA will usually want the treaty paperwork to support the certificate.

:::tip
title: Have the treaty documents ready
- A **Tax Residency Certificate (TRC)** from the US and a **[Form 10F](/tools/form-10f-generator)** are commonly needed to support a treaty rate.
- Estimate the credit side with the [DTAA / foreign tax credit calculator](/calculators/dtaa-foreign-tax-credit), and read [DTAA & double taxation](/articles/double-taxation-dtaa-india-usa).
:::

## The workflow
:::steps
1. Give your CA the remittance details and source-of-funds documents
2. The CA reviews taxability, TDS, and any DTAA position
3. The CA issues Form 15CB
4. You (or the CA) file the relevant part of [Form 15CA](/india-tax-compliance/form-15ca-for-nri) using the 15CB
5. Submit both to the bank with its repatriation request form
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Does my remittance actually **need a 15CB**, or a different 15CA part?
- What **taxability and rate** will you certify, and why?
- Can the **DTAA** lower the rate — and do you have my **Form 10F + TRC**?
- What **documents** do you need from me to issue the certificate?
:::

:::cta
title: See where 15CB fits in the whole flow
body: The pillar guide shows how the 15CB, Form 15CA, and the bank/FEMA paperwork fit together, in order.
button: Read the Form 15CA & 15CB guide
href: /india-tax-compliance/form-15ca-15cb-nri-repatriation
:::

- **Back to the pillar:** [Form 15CA & 15CB for NRIs](/india-tax-compliance/form-15ca-15cb-nri-repatriation)
- **Siblings:** [Form 15CA for NRIs](/india-tax-compliance/form-15ca-for-nri) · [Repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa) · [NRO-to-USA transfer documents](/india-tax-compliance/nro-to-usa-transfer-documents)
- **Tools:** [15CA / 15CB checklist](/tools/form-15ca-15cb-checklist) · [Form 10F generator](/tools/form-10f-generator) · [DTAA calculator](/calculators/dtaa-foreign-tax-credit)

## Frequently asked questions

### What is Form 15CB?
Form 15CB is a certificate issued by a Chartered Accountant that certifies the taxability, rate of tax/TDS, and treaty position of money being remitted abroad from India. Banks commonly require it before processing larger taxable outward remittances.

### When is Form 15CB required for an NRI?
It is commonly required for taxable remittances above a specified financial-year limit — the route that pairs with Part C of Form 15CA. Some remittances need only a part of Form 15CA, and some are exempt. Your CA confirms whether your transfer needs a 15CB.

### Does Form 15CB use the DTAA?
Yes, where a treaty rate applies. The CA certifies the DTAA position and typically needs supporting documents such as a Tax Residency Certificate and Form 10F to certify a reduced treaty rate.`,
  },

  /* ---------------- PROPERTY-SALE PROCEEDS REPATRIATION --------------- */
  {
    slug: "repatriating-property-sale-proceeds-india-usa",
    kind: "support",
    title: "Repatriating Property-Sale Proceeds from India to the USA",
    seoTitle: "Repatriating Property-Sale Proceeds from India to the USA (NRIs)",
    metaDescription:
      "Sold Indian property and want to move the money to the USA? Here's the document and FEMA workflow — TDS proof, 15CA/15CB, source documents, and the repatriation limit.",
    navLabel: "Repatriating property-sale proceeds",
    icon: "🏠",
    accent: "from-amber-500 to-orange-600",
    date: "2026-06-22",
    excerpt:
      "Sold Indian property and want the money in the USA? This is the document and FEMA workflow — TDS proof, 15CA/15CB, the sale and purchase deeds, and the repatriation limit — without re-running the tax math.",
    content: `Once an Indian property sale is done and the tax side is handled, the next job is **moving the proceeds to the USA** — and that is a paperwork exercise. This page is the **document and FEMA workflow**; for the tax numbers themselves, use the [India property capital-gains calculator](/calculators/india-property-capital-gains).

:::warn
title: Educational only — confirm with CA / bank
- This is general information, **not tax, legal, or FEMA advice**. Rules, thresholds, and the repatriation limit **change over time** and depend on your facts.
- Confirm with your **CA** and **authorised-dealer bank**, and verify on the [Income Tax portal](https://www.incometax.gov.in) and with the [RBI](https://www.rbi.org.in).
:::

## The order of operations
:::steps
1. **Settle the tax side** — capital gain computed, TDS accounted for, and any [TDS refund / Form 13](/india-tax-compliance/nri-property-sale-tds-refund) position clear
2. **Assemble source documents** — sale deed, purchase deed, and cost records
3. **Pull tax proof** — TDS certificate (Form 16B), challans, and Form 26AS / AIS
4. **Get the CA certificate** — Form 15CB, if your remittance needs one
5. **File Form 15CA** — the correct part, online
6. **Submit the bank repatriation request** — with source proof and KYC
7. **Keep everything** — for your US return, FBAR, and FATCA
:::

## Documents specific to a property sale
:::good
title: Have these ready
- **Sale deed** — the disposal and consideration
- **Purchase deed and cost records** — the cost base behind the gain
- **Form 16B** — the buyer's TDS certificate, matching your **Form 26AS**
- **Capital-gains computation** — cost, indexation, and any exemption
- **15CA / 15CB** — as applicable to the remittance
:::

:::warn
title: The FEMA repatriation limit
- Repatriation from NRO is subject to a FEMA limit — widely cited as up to **USD 1 million per financial year** — with documentation requirements.
- This is a **FEMA / RBI** rule, separate from the tax forms. Confirm the **current limit and conditions** with your bank before planning the transfer.
- For the broader picture of life after the sale, see [repatriating India property-sale proceeds](/articles/repatriate-india-property-sale-usa).
:::

## Common mistakes
:::warn
title: What stalls a property repatriation
- **Mismatched TDS** — the buyer's Form 16B not reconciling with your Form 26AS.
- **Missing cost records** — weakening both the gain computation and the source proof.
- **Leaving 15CB late** — the CA needs the documents and time to certify.
- **Overlooking the FEMA limit** — assuming the whole amount is freely repatriable.
- **No US-side records** — forgetting this feeds your US return, FBAR, and FATCA.
:::

## Questions to ask your CA and bank
:::info
title: Bring these along
- Is my **capital-gains and TDS** position fully settled before we remit?
- Do I need a **15CB**, and which **15CA part** applies?
- How does the **FEMA repatriation limit** apply to my proceeds this year?
- What is the bank's **exact document list** for property-sale repatriation?
:::

:::cta
title: Check your documents and next step
body: Run your situation through the 15CA / 15CB checklist to see what to gather and whether a CA review is strongly recommended.
button: Open the 15CA / 15CB checklist
href: /tools/form-15ca-15cb-checklist
:::

- **Back to the pillar:** [Form 15CA & 15CB for NRIs](/india-tax-compliance/form-15ca-15cb-nri-repatriation)
- **Siblings:** [Form 15CA for NRIs](/india-tax-compliance/form-15ca-for-nri) · [Form 15CB & the CA certificate](/india-tax-compliance/form-15cb-ca-certificate-nri) · [NRO-to-USA transfer documents](/india-tax-compliance/nro-to-usa-transfer-documents)
- **Related:** [NRI property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund) · [Property capital-gains calculator](/calculators/india-property-capital-gains) · [Repatriating proceeds (overview)](/articles/repatriate-india-property-sale-usa)

## Frequently asked questions

### How do NRIs repatriate property-sale proceeds from India to the USA?
After the capital-gains tax and TDS are settled, you assemble the sale and purchase deeds, TDS proof, and Form 26AS; obtain a Form 15CB if required; file Form 15CA; and submit the bank's repatriation request with source-of-funds proof. The transfer is also subject to the FEMA repatriation limit. Confirm specifics with your CA and bank.

### What is the limit on repatriating property-sale money from NRO?
Repatriation from NRO is subject to a FEMA limit, widely cited as up to USD 1 million per financial year, with documentation requirements. This is separate from the tax forms — verify the current limit and conditions with your authorised-dealer bank.

### Do I need Form 15CB to repatriate property proceeds?
Often, yes — taxable remittances above the specified limit commonly need a CA's Form 15CB before filing the relevant part of Form 15CA. Whether yours does depends on the amount and taxability; confirm with your CA.`,
  },

  /* ---------------- NRO-TO-USA TRANSFER DOCUMENTS --------------------- */
  {
    slug: "nro-to-usa-transfer-documents",
    kind: "support",
    title: "NRO-to-USA Transfer: The Documents Your Bank Wants",
    seoTitle: "NRO to USA Transfer Documents for NRIs: The Bank Checklist",
    metaDescription:
      "Transferring money from an NRO account to the USA? Here's the document checklist banks ask NRIs for — source proof, TDS proof, Form 26AS, 15CA/15CB, and the repatriation request.",
    navLabel: "NRO-to-USA transfer documents",
    icon: "🏦",
    accent: "from-emerald-500 to-teal-600",
    date: "2026-06-22",
    excerpt:
      "Moving money from an NRO account to the USA means satisfying the bank on both tax and FEMA. Here's the document checklist banks ask NRIs for — and why NRO is more paperwork than NRE.",
    content: `An **NRO account** holds your India-sourced rupee income — rent, dividends, interest, sale proceeds. Because that money is India-sourced, moving it to the USA means giving the bank a **tax trail and a FEMA trail**. This is the document checklist that typically gets an NRO-to-USA transfer through.

:::warn
title: Educational only — confirm with CA / bank
- This is general information, **not tax, legal, or FEMA advice**. Bank checklists, thresholds, and the repatriation limit **change over time** and vary by bank.
- Confirm your bank's exact requirements with the **bank** and your **CA**, and verify on the [Income Tax portal](https://www.incometax.gov.in) and with the [RBI](https://www.rbi.org.in).
:::

## Why NRO is more paperwork than NRE
:::tip
title: The NRE vs NRO split
- **NRE** money was already foreign-sourced and is generally freely repatriable with lighter paperwork.
- **NRO** money is India-sourced, so the bank must see that **tax has been accounted for** and the remittance is **within the FEMA limit** — which is where 15CA/15CB come in.
- See [NRE vs NRO accounts explained](/articles/nre-nro-accounts-explained).
:::

## The document checklist
:::steps
1. **PAN** and **passport / OCI** — identity and NRI status
2. **NRO account statement** — showing the funds and their credits
3. **Source-of-funds proof** — what each relevant credit actually is (rent, dividend, sale, inheritance, gift)
4. **Tax paid / TDS proof** — challans and TDS certificates (Form 16A / 16B)
5. **Form 26AS / AIS** — the department's record against your PAN
6. **Form 15CB** — the CA certificate, if your remittance needs one
7. **Form 15CA acknowledgement** — the filed declaration
8. **Bank repatriation / outward-remittance request form** — the FEMA-side form
:::

:::warn
title: Source-of-funds proof is the usual sticking point
- The bank wants to tie **each credit** in the NRO account to a documented source.
- Rent needs rent records; a sale needs the deed; an inheritance needs the will / succession proof; a gift needs gift documentation.
- Weak or missing source proof is a common reason transfers stall.
:::

## Don't forget the FEMA limit and the US side
:::info
title: Two things people miss
- **FEMA limit** — repatriation from NRO is capped (widely cited as up to **USD 1 million per financial year**) with documentation; confirm the current limit with your bank.
- **US side** — keep records for your **US return, FBAR, and FATCA**; the NRO account itself is generally an FBAR/FATCA item. See [FBAR / FATCA](/articles/fbar-fatca-nri-guide).
:::

## Questions to ask your bank
:::info
title: Bring these to your bank
- What is your **exact document checklist** for an NRO-to-USA transfer?
- Which **repatriation request form** do you need, and in what order with 15CA/15CB?
- How does the **FEMA repatriation limit** apply to me this financial year?
- Is my **KYC and NRO account** in order for an outward remittance?
:::

:::cta
title: Build your document list
body: The 15CA / 15CB checklist maps your source of funds to the documents to collect and whether a CA review is strongly recommended.
button: Open the 15CA / 15CB checklist
href: /tools/form-15ca-15cb-checklist
:::

- **Back to the pillar:** [Form 15CA & 15CB for NRIs](/india-tax-compliance/form-15ca-15cb-nri-repatriation)
- **Siblings:** [Form 15CA for NRIs](/india-tax-compliance/form-15ca-for-nri) · [Form 15CB & the CA certificate](/india-tax-compliance/form-15cb-ca-certificate-nri) · [Repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa)
- **Related:** [NRI TDS refund from USA](/india-tax-compliance/nri-tds-refund-usa) · [NRE/NRO accounts explained](/articles/nre-nro-accounts-explained) · [Remittance TCS calculator](/calculators/remittance-tcs-cost)

## Frequently asked questions

### What documents are needed to transfer money from NRO to a US account?
Banks typically ask for PAN and passport/OCI, the NRO account statement, source-of-funds proof, tax/TDS proof, Form 26AS/AIS, a Form 15CB if applicable, the Form 15CA acknowledgement, and the bank's repatriation request form. The exact list varies by bank — ask yours early.

### Why does an NRO transfer need more paperwork than NRE?
NRE balances were already foreign-sourced and are generally freely repatriable, while NRO balances are India-sourced, so the bank must see that tax has been accounted for and that the remittance is within the FEMA limit. That is why the 15CA/15CB and source-of-funds trail apply to NRO.

### Is there a yearly limit on NRO-to-USA transfers?
Yes. Repatriation from NRO is subject to a FEMA limit, widely cited as up to USD 1 million per financial year, along with documentation requirements. Confirm the current limit and conditions with your authorised-dealer bank.`,
  },
];

/** All cluster pages, with reading time computed. */
export const repatPages: RepatPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

/** The pillar page. */
export const repatPillar: RepatPage = repatPages.find(
  (p) => p.kind === "pillar"
)!;

/** The supporting pages, in authored order. */
export const repatSupportPages: RepatPage[] = repatPages.filter(
  (p) => p.kind === "support"
);

/** Look up a cluster page by its slug ("" / unknown → undefined). */
export function getRepatPage(slug: string): RepatPage | undefined {
  return repatPages.find((p) => p.slug === slug);
}
