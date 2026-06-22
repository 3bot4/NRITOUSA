import { computeReadingTime } from "@/lib/format";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TITLE } from "@/lib/taxCompliance";

/**
 * Topic cluster (hub-&-spoke) for "NRI TDS Refund & Lower TDS".
 *
 *   /india-tax-compliance/                              ← parent hub (existing)
 *     └─ /nri-tds-refund-usa                            ← pillar page
 *          ├─ /nro-interest-tds-refund
 *          ├─ /form-13-lower-tds-certificate-nri
 *          └─ /nri-property-sale-tds-refund             ← supporting pages
 *
 * Sibling to the ITR-filing cluster (lib/itrCluster.ts): same authoring format
 * (light-markdown + ::: fences rendered by ArticleBody), same /india-tax-compliance
 * parent hub, and the same shared dynamic route at
 * /india-tax-compliance/[slug] (which resolves either cluster by slug). The
 * pillar links down to every supporting page and out to the TDS-refund
 * checklist tool; each supporting page links back up to the pillar and across
 * to its siblings. That dense internal linking is the whole point of the
 * cluster — see components/TdsClusterPage.tsx.
 *
 * Educational-only: nothing here is tax advice. Indian TDS rates, surcharge,
 * cess, threshold limits, and the forms involved (26AS, AIS, Form 13, Form
 * 10F, TRC) change by financial year / assessment year — always verify on the
 * Income Tax portal (incometax.gov.in) or with a qualified CA.
 */

export type TdsPageKind = "pillar" | "support";

export interface TdsPageData {
  /** The child segment under /india-tax-compliance (e.g. "nro-interest-tds-refund"). */
  slug: string;
  kind: TdsPageKind;
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

export interface TdsPage extends TdsPageData {
  readingTime: number;
}

/** Parent hub these pages live under (the existing India Tax & Compliance hub). */
export const TDS_HUB_PATH = TAX_COMPLIANCE_PATH;
export const TDS_HUB_TITLE = TAX_COMPLIANCE_TITLE;

/** The pillar slug (everything else is a supporting page). */
export const TDS_PILLAR_SLUG = "nri-tds-refund-usa";

/** Root-relative path for any cluster page. */
export const tdsPath = (slug: string) => `${TDS_HUB_PATH}/${slug}`;

/** Section heading + card copy used on the parent hub page. */
export const TDS_CLUSTER_SECTION = {
  eyebrow: "New",
  title: "TDS Refunds & Lower TDS for NRIs",
  description:
    "Banks and buyers often deduct TDS before your final tax is known. Learn how NRO interest, rent, property-sale TDS, DTAA paperwork, Form 13, and Indian ITR filing connect.",
};

const rawPages: TdsPageData[] = [
  /* ----------------------------- PILLAR ----------------------------- */
  {
    slug: TDS_PILLAR_SLUG,
    kind: "pillar",
    title:
      "NRI TDS Refund from USA: NRO Interest, Property Sale, DTAA & Form 13",
    seoTitle:
      "NRI TDS Refund from USA: NRO Interest, Property Sale, DTAA & Form 13",
    metaDescription:
      "Guide for US-based NRIs to understand Indian TDS deductions, NRO interest TDS, property sale TDS, refund claims, DTAA documents, Form 13 lower TDS certificate, and CA review questions.",
    navLabel: "Start here: the full guide",
    icon: "💸",
    accent: "from-teal-500 to-cyan-600",
    date: "2026-06-22",
    excerpt:
      "Indian banks and property buyers deduct TDS on your NRO interest, rent, dividends, and sale proceeds — often far more than your real tax. Here's how that TDS works, when a refund happens, what to gather, and how Form 13 can lower it up front.",
    content: `As an NRI in the USA, a large slice of your Indian income is taxed **before it ever reaches you** — the bank, the tenant, the company, or the property buyer deducts **TDS (tax deducted at source)** and pays it to the Indian government against your PAN. The catch: TDS is deducted on a fixed-rate, worst-case basis, not on your actual tax liability. The gap between the two is **your refund** — and the only way to claim it is to reconcile and file. This guide walks through every common NRI TDS situation, when money comes back, and how a **Form 13 lower/nil-deduction certificate** can stop over-deduction before it happens.

:::warn
title: Read this first — educational only
- This is general educational information, **not tax advice**. Indian TDS rates, surcharge, cess, threshold limits, and the relevant forms **change by financial year (FY) and assessment year (AY)**.
- Always verify current rates and forms on the official [Income Tax portal](https://www.incometax.gov.in) or with a qualified **Chartered Accountant (CA)** before acting.
- The US side (Form 1040, foreign tax credit, FBAR, FATCA) is separate — see the [India Tax & Compliance hub](/india-tax-compliance).
:::

:::info
title: What you'll get on this page
- What TDS is and why NRIs see it on almost every type of Indian income
- The common TDS situations: NRO interest, property sale, rent, dividends, capital gains, and professional fees
- When a **refund** actually happens — and when it doesn't
- The full **documents** list, including Form 10F / TRC for treaty benefits
- How **Form 13** lower/nil-TDS certificates work for big-ticket cases like property sales
- The **questions to ask your CA** and the bank-vs-department mismatch trap
:::

## 1. What is TDS for NRIs?
**TDS** is tax the *payer* withholds from money owed to you and deposits with the government against your **PAN**. It's an advance collection mechanism — not a final tax. At year-end you compute your **actual** tax liability on your Indian income, subtract the TDS already deposited, and either owe the balance or claim the excess back as a **refund**.

| Resident Indian | NRI (you) |
|---|---|
| TDS rates on many payments are **lower**, often nil below a threshold | TDS withheld at **higher, NRI-specific rates** with surcharge and cess |
| Banks generally don't withhold on small savings interest | Often deducted **from the first rupee**, with no small-balance exemption |
| — | Frequently **higher than your real tax** — which is exactly what creates the refund |

:::tip
title: The core idea to hold onto
- TDS deducted is **not the same as tax owed**. A bank deducting 30%-plus on your NRO FD interest does **not** mean your tax is 30%.
- Your real liability depends on your **total Indian income**, the **slab/regime**, available **deductions**, and any **DTAA** rate cap.
- The difference comes back **only if you file an Indian return** for that year. Unfiled = unclaimed.
:::

## 2. Common TDS situations for NRIs
If you have any of the following from India, expect TDS — and a possible refund.

| Income type | What's typically deducted | Refund tends to happen when… |
|---|---|---|
| **NRO savings / FD interest** | Higher NRO-rate TDS, often from the first rupee | Your total income is in a lower slab, or DTAA caps the rate. See [NRO interest TDS refund](/india-tax-compliance/nro-interest-tds-refund). |
| **Sale of Indian property** | TDS on the **whole sale price**, not just the gain | Your real **capital gain** (after cost, indexation, exemptions) is far smaller. See [property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund). |
| **Rent paid to an NRI landlord** | Tenant must deduct TDS on rent to an NRI | Deductions (municipal tax, standard deduction, loan interest) cut the taxable rent. |
| **Dividends** | TDS withheld by the company/registrar | DTAA caps the dividend rate, or your slab is lower. |
| **Mutual-fund / stock capital gains** | TDS on gains, withheld at source | Cost base, holding period, or loss set-off reduces the real gain. |
| **Professional / consulting fees from India** | TDS on fees for services | Treaty relief applies, or expenses/credits reduce net liability. |

For the cross-border treatment of several of these, see [Indian income on your US tax return](/articles/indian-income-us-tax-return), [NRE vs NRO accounts explained](/articles/nre-nro-accounts-explained), and [selling Indian shares as a US resident](/articles/selling-indian-shares-us-resident-tax).

### Property sale is the big one
A buyer purchasing property from an NRI is generally required to deduct TDS on the **entire sale consideration** — not on your profit. On a high-value flat or plot, that withholding can run into many lakhs, even when your **actual** long-term capital gain (after purchase cost, indexation, and any reinvestment exemption) is a fraction of it. That gap is the classic NRI refund — and the reason **Form 13** (below) exists.

## 3. When a refund may happen
A refund isn't automatic and isn't guaranteed — it appears when the tax **deducted** exceeds the tax **due**. The usual causes:

:::good
title: Situations that commonly produce a refund
- **TDS deducted at a higher rate than your final liability** — e.g. 30%-plus NRO TDS when your slab works out lower.
- **DTAA benefit not applied by the payer/bank** — the bank withheld at the full domestic rate because it didn't have your treaty paperwork (Form 10F + TRC) on file.
- **Deductions and exemptions reduce your actual liability** — standard deduction on rent, 80C-type deductions where available, home-loan interest, basic exemption limit.
- **Loss set-off or a corrected capital-gains computation** — capital losses offset gains, or the property gain is recomputed with the right cost base and indexation, shrinking the tax.
:::

:::bad
title: When a refund is unlikely
- Your total Indian income is **already in a high slab** and TDS roughly matched the real tax.
- The deduction was **correct** and you have no treaty rate cap, deductions, or losses to bring it down.
- The income was genuinely taxable at the rate withheld and nothing reduces it.
:::

:::tip
title: Two ways to fix over-deduction
- **After the fact** — let the TDS be deducted, then **file your ITR** to reconcile and claim the excess back as a refund. Works for everything.
- **Up front** — apply for a **Form 13 lower/nil-deduction certificate** *before* the payment so less (or no) TDS is withheld in the first place. Best for big one-off payments like a property sale. See [Form 13 for NRIs](/india-tax-compliance/form-13-lower-tds-certificate-nri).
:::

## 4. Documents you'll need
Gather these before you start a refund claim — most refund delays trace back to a missing document or an unvalidated bank account.

:::steps
1. **PAN** — everything is keyed to it; the TDS is deposited against it
2. **Form 26AS** — the tax department's record of TDS deposited against your PAN
3. **AIS / TIS** — the broader statement of reported income and transactions, and its summary
4. **Bank interest certificate** — the NRO interest paid and TDS deducted, from the bank
5. **TDS certificates** — Form 16A (non-salary) and Form 16B (property-sale TDS from the buyer)
6. **NRO / NRE account statements** — for the full financial year
7. **Property sale agreement** — the sale deed / consideration that triggered the TDS
8. **Purchase deed** — your original cost, essential to compute the real gain
9. **Capital-gains computation** — cost, improvements, indexation, and any reinvestment exemption
10. **Form 10F + TRC** — if you're claiming a **DTAA** treaty rate (Tax Residency Certificate from the IRS, plus Form 10F)
:::

:::tip
title: Why Form 26AS and AIS come first
- They are the department's own record of the TDS deducted against your PAN — the exact figure you'll claim back.
- Filing numbers that don't match them is the #1 cause of notices. See [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri).
- For the treaty paperwork, see the [Form 10F generator](/tools/form-10f-generator) and the [DTAA / foreign tax credit calculator](/calculators/dtaa-foreign-tax-credit).
:::

## 5. Form 13 lower/nil TDS certificate
For large, one-off payments — above all a **property sale** — waiting a year to reclaim lakhs of over-deducted TDS is painful. **Form 13** is the way to stop it before it starts.

:::info
title: What Form 13 is
- An application to the Income Tax Department for a **certificate authorising a lower or nil rate of TDS** on a specific payment.
- If granted, the payer (buyer, bank, tenant, company) withholds at the **reduced rate stated on the certificate** instead of the full default rate.
- It is applied for **before** the income is paid — it does not retroactively undo TDS already deducted.
:::

:::good
title: When NRIs consider Form 13
- **Selling Indian property**, where TDS on the full sale price vastly exceeds the tax on the actual gain.
- **High-value NRO interest** where the bank's default withholding far exceeds your real liability.
- Any situation where the **default TDS would tie up a large sum** for a year or more until you file and refund.
:::

:::warn
title: Property sale & high-value cases — the math
- On a property sale, default TDS is computed on the **sale consideration**, not the gain. On a ₹2 crore sale with a modest real gain, that can mean a seven-figure withholding.
- A Form 13 certificate lets the buyer deduct on the **estimated actual gain** instead — freeing up the rest at closing rather than after a refund cycle.
- Read the full walkthrough in [NRI property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund).
:::

:::info
title: Documents to ask your CA about for Form 13
- PAN and proof of NRI status
- The **sale agreement** and **purchase deed** (for property), or the deposit/payment details (for interest)
- **Capital-gains computation** showing the estimated real gain
- Existing **TDS history** (Form 26AS) and projected income for the year
- **Form 10F + TRC** if a DTAA rate is part of the claim
:::

Form 13 has its own dedicated guide: [Form 13 lower/nil TDS certificate for NRIs](/india-tax-compliance/form-13-lower-tds-certificate-nri).

## 6. Questions to ask your CA
Take this list to your Chartered Accountant — these are the decisions that actually change your refund:

:::info
title: Bring these to your CA
- Based on my total Indian income this year, **what's my real tax** versus the TDS already deducted?
- Has the **DTAA rate** been applied to my interest/dividends — and do you have my **Form 10F + TRC**?
- For my property sale, should we apply for a **Form 13 lower-TDS certificate** *before* closing?
- Is my **capital-gains computation** correct — cost, indexation, and any reinvestment exemption?
- Can any **capital losses** be set off to reduce the gain?
- Does my **Form 26AS / AIS** match what was actually deducted, and are there mismatches to fix?
- Is my **NRO account pre-validated** on the portal so the refund can be paid?
- How long will the refund take, and how do we track it?
:::

## 7. Bank vs Income Tax Department mismatch
A frequent NRI headache: the TDS your **bank** says it deducted doesn't match what shows in **Form 26AS / AIS** at the department.

:::warn
title: Why the mismatch happens — and why it matters
- The bank deducts TDS but **deposits or reports it late**, or against the **wrong PAN / wrong quarter**, so it hasn't yet appeared in your 26AS.
- You can only claim a refund for TDS that the **department actually shows** against your PAN — not for what the bank's certificate says alone.
- **Fix the mismatch first:** ask the bank/deductor to correct their TDS return so the credit reflects in your 26AS, *then* file. Filing against a credit that isn't in 26AS invites a notice or a withheld refund.
:::

See [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri) for how to reconcile these before filing.

## 8. Educational only — verify for the current FY/AY
:::warn
title: Always confirm current rates and forms
- TDS **rates, surcharge, cess, and threshold limits change every financial year**, and the forms (26AS, AIS, Form 13, Form 10F, TRC) and portals evolve too.
- Nothing here is a specific rate quote — verify the **current FY/AY** position on the [Income Tax portal](https://www.incometax.gov.in) or with a qualified CA before acting.
:::

:::cta
title: Walk through your situation, step by step
body: Use the free NRI TDS Refund Checklist to map your income type, what was deducted, and what to gather — then get the likely next review step and questions for your CA.
button: Open the TDS refund checklist
href: /tools/nri-tds-refund-checklist
:::

- **Go deeper:** [NRO interest TDS refund](/india-tax-compliance/nro-interest-tds-refund) · [Form 13 lower/nil TDS certificate](/india-tax-compliance/form-13-lower-tds-certificate-nri) · [NRI property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund)
- **File the return:** [NRI ITR filing from USA](/india-tax-compliance/nri-itr-filing-usa) · [Form 26AS, AIS & TIS](/india-tax-compliance/form-26as-ais-tis-nri)
- **Treaty paperwork:** [Form 10F generator](/tools/form-10f-generator) · [DTAA / foreign tax credit calculator](/calculators/dtaa-foreign-tax-credit) · [DTAA explained](/articles/double-taxation-dtaa-india-usa)
- **Related:** [Repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa) · [NRE/NRO accounts](/articles/nre-nro-accounts-explained)

## Frequently asked questions

### Can an NRI in the USA get an Indian TDS refund?
Yes. If the TDS deducted on your Indian income (NRO interest, property sale, rent, dividends, or capital gains) is more than your actual Indian tax liability, you claim the excess back by filing an Indian income-tax return for that assessment year and getting it refunded to a pre-validated NRO account. Confirm the current rules with a CA.

### Why is TDS on my NRO interest so high?
NRO interest is generally subject to higher, NRI-specific TDS rates plus surcharge and cess, and it's often deducted from the first rupee. That rate is a worst-case withholding, not your final tax — if your total income falls in a lower slab or a DTAA rate applies, the difference is refundable when you file.

### How is TDS on an NRI property sale calculated?
TDS on a property sale by an NRI is typically computed on the entire sale consideration, not just the capital gain, which is why the withholding is often far larger than the real tax. You can either reclaim the excess by filing a return, or apply for a Form 13 lower/nil-deduction certificate before the sale to reduce the withholding up front.

### What is Form 13 and when should an NRI use it?
Form 13 is an application for a certificate authorising a lower or nil rate of TDS on a specific payment. NRIs use it most for property sales and other large payments where default TDS would vastly exceed the actual tax — it lets the payer withhold at a reduced rate instead of locking up your money until a refund.

### Do I need Form 10F and a TRC to claim a DTAA rate?
To have a payer apply a reduced DTAA treaty rate (e.g. on interest or dividends), you generally need to provide a Tax Residency Certificate (TRC) from the US tax authority plus Form 10F. Without them, the bank or company usually withholds at the full domestic rate, and you'd reclaim the difference by filing. Verify current requirements with a CA.`,
  },

  /* --------------------- NRO INTEREST TDS ------------------------ */
  {
    slug: "nro-interest-tds-refund",
    kind: "support",
    title: "NRO Interest TDS Refund for NRIs in the USA",
    seoTitle: "NRO Interest TDS Refund for NRIs: Rates, DTAA & How to Claim",
    metaDescription:
      "NRO savings and FD interest is taxed at higher NRI TDS rates, often above your real liability. Here's how the NRO interest TDS refund works, how DTAA lowers it, and what to gather.",
    navLabel: "NRO interest TDS refund",
    icon: "🏦",
    accent: "from-emerald-500 to-teal-600",
    date: "2026-06-22",
    excerpt:
      "Interest on your NRO savings and fixed deposits is taxed at higher NRI TDS rates — frequently more than you actually owe. Here's why, how DTAA and Form 10F can lower it, and how to claim the excess back.",
    content: `If you have an **NRO account** — the one that holds your India-sourced rupee income like rent, dividends, or pension — the interest it earns is **taxable in India**, and the bank deducts TDS on it. For NRIs that TDS is typically withheld at a **higher rate than for residents**, often from the first rupee of interest. The good news: if it exceeds your real liability, it's refundable. This is how that works.

:::warn
title: Educational only — verify the current FY
- This is general information, not tax advice. NRO TDS **rates, surcharge, cess, and thresholds change every financial year**.
- Confirm the current rate and your DTAA position on the [Income Tax portal](https://www.incometax.gov.in) or with a CA.
:::

## Why NRO interest is taxed the way it is
NRE and FCNR interest is generally **exempt** while you qualify as an NRI. **NRO** interest is not — it's fully taxable in India, and because you're a non-resident, the bank applies the **NRI TDS rate** (plus applicable surcharge and cess) rather than the lower resident rate, and usually without the small-balance exemptions residents get.

| NRE / FCNR interest | NRO interest |
|---|---|
| Generally **exempt** while you qualify as an NRI | **Fully taxable** in India |
| Typically **no TDS** on the interest | **TDS deducted** at the higher NRI rate, often from the first rupee |
| — | The classic NRI **refund** situation when your real slab is lower |

See [NRE vs NRO accounts explained](/articles/nre-nro-accounts-explained) for the full account comparison.

## When NRO interest TDS becomes a refund
The withheld rate is a **worst-case** number. Your actual tax depends on your **total Indian income** for the year. A refund commonly arises when:

:::good
title: Common NRO refund triggers
- Your **total Indian income** falls in a lower slab than the TDS rate implies (or under the basic exemption limit).
- A **DTAA** treaty rate caps interest tax below the domestic withholding — but the bank deducted at full rate because it didn't have your **Form 10F + TRC**.
- **Deductions** available to you reduce the taxable total.
:::

:::tip
title: DTAA can lower the rate — if the paperwork is on file
- The India–US treaty often caps tax on interest at a lower rate than the domestic NRO withholding.
- To get the **bank** to apply it up front, you generally provide a **Tax Residency Certificate (TRC)** from the IRS plus **[Form 10F](/tools/form-10f-generator)**.
- Without those on file, the bank withholds at full rate and you reclaim the difference by filing. Estimate the credit with the [DTAA / foreign tax credit calculator](/calculators/dtaa-foreign-tax-credit).
:::

## How to claim the refund
:::steps
1. Get your **bank interest certificate** — interest paid and TDS deducted for the year
2. Pull **Form 26AS / AIS** and confirm that TDS shows against your PAN
3. Reconcile the bank figure with 26AS — fix any mismatch with the bank *before* filing
4. File your **ITR** for the assessment year, reporting the interest and claiming the TDS credit
5. Apply the **DTAA** rate if eligible, with Form 10F / TRC support
6. E-verify, and ensure your **NRO account is pre-validated** so the refund can be paid
:::

:::warn
title: Bank vs department mismatch
- If the bank deducted TDS but it hasn't appeared in your **Form 26AS** (late deposit, wrong PAN, wrong quarter), you can't yet claim it.
- Get the deductor to correct their TDS return so the credit reflects, then file. See [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri).
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- What's my **real tax** on this interest versus what the bank withheld?
- Can we apply the **DTAA** rate, and do you have my **Form 10F + TRC**?
- Does my **bank certificate match Form 26AS**, or is there a mismatch to fix?
- Is my **NRO account validated** on the portal for the refund?
- Should I file even if interest is my only Indian income, purely to reclaim the TDS?
:::

:::cta
title: Not sure where you stand?
body: Run your situation through the free TDS refund checklist to see what to gather and the likely next step.
button: Open the TDS refund checklist
href: /tools/nri-tds-refund-checklist
:::

- **Back to the pillar:** [NRI TDS refund from USA](/india-tax-compliance/nri-tds-refund-usa)
- **Siblings:** [Form 13 lower/nil TDS certificate](/india-tax-compliance/form-13-lower-tds-certificate-nri) · [NRI property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund)
- **File it:** [NRI ITR filing from USA](/india-tax-compliance/nri-itr-filing-usa) · [Form 26AS, AIS & TIS](/india-tax-compliance/form-26as-ais-tis-nri)
- **Tools:** [Form 10F generator](/tools/form-10f-generator) · [DTAA calculator](/calculators/dtaa-foreign-tax-credit)

## Frequently asked questions

### Is NRO interest taxable for NRIs?
Yes. Unlike NRE and FCNR interest, which is generally exempt while you qualify as an NRI, NRO account interest is fully taxable in India and the bank deducts TDS on it at the applicable NRI rate plus surcharge and cess.

### How do I reduce TDS on NRO interest?
You can provide the bank with a Tax Residency Certificate and Form 10F so it applies the lower DTAA treaty rate, or apply for a Form 13 lower-deduction certificate. Otherwise you reclaim any excess by filing an Indian return for the year. Verify the current rate and requirements with a CA.

### Can I get back the TDS deducted on my NRO fixed deposit?
If the TDS deducted exceeds your actual Indian tax liability for the year, the excess is refundable. You claim it by filing an income-tax return that reports the interest, claims the TDS credit shown in Form 26AS, and applies any DTAA rate, with the refund paid to a pre-validated NRO account.`,
  },

  /* --------------------- FORM 13 ------------------------ */
  {
    slug: "form-13-lower-tds-certificate-nri",
    kind: "support",
    title: "Form 13 Lower/Nil TDS Certificate for NRIs",
    seoTitle: "Form 13 Lower/Nil TDS Certificate for NRIs: When & How",
    metaDescription:
      "Form 13 lets NRIs get a lower or nil TDS certificate before income is paid — vital for property sales where TDS on the full price dwarfs the real tax. Here's when and how it works.",
    navLabel: "Form 13 lower/nil TDS certificate",
    icon: "📝",
    accent: "from-violet-500 to-purple-600",
    date: "2026-06-22",
    excerpt:
      "Form 13 is how an NRI gets TDS reduced before the payment happens, instead of waiting a year to reclaim it — most valuable on property sales and high-value income where default TDS dwarfs the real tax.",
    content: `Reclaiming over-deducted TDS by filing a return works — but it can lock up a large sum for a year or more. **Form 13** is the proactive alternative: you ask the Income Tax Department, *before* the income is paid, for a certificate that lets the payer deduct at a **lower or nil rate**. For NRIs it matters most on **property sales** and other big one-off payments.

:::warn
title: Educational only — verify the current process
- This is general information, not tax advice. The Form 13 process, the authority you apply to, and the documents required **can change**.
- Confirm the current procedure on the [Income Tax portal](https://www.incometax.gov.in) or with a CA before applying.
:::

## What Form 13 is
:::info
title: The certificate, in plain terms
- Form 13 is an **application** for a certificate of **lower or nil deduction of TDS** on a specified payment.
- If granted, the payer (property buyer, bank, tenant, company) withholds at the **rate on the certificate** instead of the full default rate.
- It must be obtained **before** the payment — it does **not** reverse TDS already deducted (for that, you file a return and claim a refund).
:::

## When NRIs consider it
:::good
title: Form 13 is worth it when
- You're **selling Indian property** and default TDS on the full sale price would be many times your real tax on the gain.
- You have **high-value NRO interest** or other income where the default withholding far exceeds your liability.
- The cash that would be **tied up** until a refund is large enough that getting it freed at source is worth the application effort.
:::

:::bad
title: It's usually not needed when
- The payment is **small** and the over-deduction isn't worth the process.
- The default TDS roughly matches your real tax anyway.
- It's already too late — the income has **already been paid and TDS deducted** (claim a refund by filing instead).
:::

## Property sale and high-value TDS cases
This is the headline use. On a property sale, TDS is computed on the **entire sale consideration**, not your gain.

:::warn
title: Why the property-sale math makes Form 13 so valuable
- Default TDS on a high-value sale can be a **seven-figure** withholding, even when your real long-term gain (after cost, indexation, and any reinvestment exemption) is far smaller.
- A Form 13 certificate lets the buyer deduct on the **estimated actual gain**, so most of your money is freed **at closing** rather than after a year-long refund cycle.
- See the full walkthrough in [NRI property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund).
:::

## Documents to ask your CA about
:::steps
1. **PAN** and proof of your **NRI status**
2. The **sale agreement** (property) or payment/deposit details (interest), plus the **purchase deed** for property
3. A **capital-gains computation** showing the estimated real gain
4. Your **TDS history** (Form 26AS) and projected income for the year
5. **Form 10F + TRC** if a DTAA rate is part of the claim
6. Bank / NRO account details for the income in question
:::

:::tip
title: Build in lead time
- A Form 13 certificate has to be **applied for and granted before** the payment — so start well ahead of a property closing, not the week of.
- Coordinate with your **buyer** so they withhold per the certificate once it's issued.
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Is **Form 13** worth it for my payment, or is filing for a refund simpler?
- What **rate** can we realistically support, and what's the estimated gain?
- What's the **timeline** to get the certificate before my closing date?
- Do we also need **Form 10F + TRC** for a DTAA rate?
- How does the certificate get **communicated to the buyer/bank** so they deduct correctly?
:::

:::cta
title: Map your situation first
body: The free TDS refund checklist helps you see whether your case points toward Form 13 up front or a refund after filing.
button: Open the TDS refund checklist
href: /tools/nri-tds-refund-checklist
:::

- **Back to the pillar:** [NRI TDS refund from USA](/india-tax-compliance/nri-tds-refund-usa)
- **Siblings:** [NRO interest TDS refund](/india-tax-compliance/nro-interest-tds-refund) · [NRI property-sale TDS refund](/india-tax-compliance/nri-property-sale-tds-refund)
- **Related:** [NRI ITR filing from USA](/india-tax-compliance/nri-itr-filing-usa) · [Repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa)
- **Tools:** [Form 10F generator](/tools/form-10f-generator) · [DTAA calculator](/calculators/dtaa-foreign-tax-credit)

## Frequently asked questions

### What is Form 13 in income tax?
Form 13 is an application to the Income Tax Department for a certificate authorising the payer to deduct TDS at a lower or nil rate on a specified payment. It's obtained before the income is paid, so less tax is withheld up front rather than reclaimed later through a refund.

### When should an NRI apply for a lower TDS certificate?
Most often when selling Indian property, where default TDS is computed on the full sale price and dwarfs the tax on the actual gain, or on other high-value income where the default withholding would lock up a large sum until you file a return and get a refund.

### Does Form 13 reduce TDS on a property sale?
If granted, a Form 13 certificate lets the buyer deduct TDS on the estimated actual capital gain rather than the entire sale consideration, sharply reducing the withholding at closing. It must be applied for and issued before the sale completes — verify the current process with a CA.`,
  },

  /* --------------------- PROPERTY SALE TDS ------------------------ */
  {
    slug: "nri-property-sale-tds-refund",
    kind: "support",
    title: "NRI Property Sale TDS Refund: Reclaim the Over-Deduction",
    seoTitle: "NRI Property Sale TDS Refund: How to Reclaim the Over-Deduction",
    metaDescription:
      "When an NRI sells Indian property, TDS is deducted on the full sale price, not the gain — often far more than the real tax. Here's how to reclaim it, or lower it up front with Form 13.",
    navLabel: "NRI property-sale TDS refund",
    icon: "🏠",
    accent: "from-amber-500 to-orange-600",
    date: "2026-06-22",
    excerpt:
      "Sell Indian property as an NRI and the buyer deducts TDS on the whole sale price — usually far more than the tax on your actual gain. Here's how the refund works, and how Form 13 can cut the withholding up front.",
    content: `Selling Indian property as an NRI almost always produces a **large TDS over-deduction**, because the buyer withholds on the **full sale consideration**, not on your profit. On a high-value sale that can be lakhs — even crores — locked up against a tax bill that's a fraction of it. Here's how the refund works, and how to avoid the lock-up entirely with **Form 13**.

:::warn
title: Educational only — verify the current FY/AY
- This is general information, not tax advice. Property-sale TDS **rates, surcharge, cess, and the computation change by year**, and depend on holding period and value.
- Confirm the current position on the [Income Tax portal](https://www.incometax.gov.in) or with a CA.
:::

## Why the over-deduction happens
When a buyer purchases property from an NRI seller, the buyer is generally required to **deduct TDS on the entire sale price** (plus applicable surcharge and cess), regardless of how small your actual gain is.

| TDS is withheld on | Tax is actually due on |
|---|---|
| The **full sale consideration** — the headline price | Only your **capital gain** — sale price minus indexed cost & improvements |
| A worst-case rate with surcharge and cess | After any **reinvestment exemption** and **loss set-off** |

The gap between TDS-on-price and tax-on-gain is your refund.

## Two paths: reclaim after, or lower before
:::good
title: Path A — reclaim after the sale (refund)
- Let the buyer deduct the default TDS at closing.
- **File your ITR** for the year, report the capital gain with the correct cost base and indexation, claim the TDS credit, and the excess is refunded.
- Always available, but your money is **tied up** until the return is processed.
:::

:::good
title: Path B — lower it before the sale (Form 13)
- Apply for a **[Form 13 lower/nil TDS certificate](/india-tax-compliance/form-13-lower-tds-certificate-nri)** *before* closing.
- If granted, the buyer deducts on the **estimated actual gain**, freeing most of your money **at closing**.
- Needs lead time and a clean capital-gains estimate — start early.
:::

## Getting the capital gain right
The size of both your tax **and** your refund hinges on the gain computation.

:::steps
1. Start with the **sale consideration** from the sale agreement
2. Subtract your **cost of acquisition** — from the original purchase deed — with **indexation** where applicable
3. Subtract **cost of improvements** (with proof) and eligible transfer expenses
4. Apply any **reinvestment exemption** you qualify for
5. Set off any eligible **capital losses**
6. The result is your taxable gain — compare it against the TDS withheld to size the refund
:::

:::warn
title: Don't lose these
- The **purchase deed and cost records** — without them the gain (and your refund) is overstated.
- The **Form 16B** TDS certificate from the buyer, and the matching entry in your **Form 26AS**.
- The **repatriation** paperwork for moving the proceeds out afterwards — see [repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa).
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Should we apply for a **Form 13** certificate before closing, or reclaim by filing?
- Is my **capital-gains computation** right — cost, indexation, improvements, exemptions?
- Can any **capital losses** be set off against this gain?
- Does the buyer's **Form 16B** match my **Form 26AS**?
- Is my **NRO account validated** for the refund, and what's the repatriation plan for the proceeds?
:::

:::cta
title: See which path fits you
body: The free TDS refund checklist helps you decide between a Form 13 up front and a refund after filing, and lists what to gather.
button: Open the TDS refund checklist
href: /tools/nri-tds-refund-checklist
:::

- **Back to the pillar:** [NRI TDS refund from USA](/india-tax-compliance/nri-tds-refund-usa)
- **Siblings:** [NRO interest TDS refund](/india-tax-compliance/nro-interest-tds-refund) · [Form 13 lower/nil TDS certificate](/india-tax-compliance/form-13-lower-tds-certificate-nri)
- **File it:** [NRI ITR filing from USA](/india-tax-compliance/nri-itr-filing-usa) · [Form 26AS, AIS & TIS](/india-tax-compliance/form-26as-ais-tis-nri)
- **Related:** [Repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa) · [India property capital-gains calculator](/calculators/india-property-capital-gains)

## Frequently asked questions

### How much TDS is deducted when an NRI sells property in India?
TDS on a sale by an NRI is generally computed on the entire sale consideration, not just the capital gain, plus applicable surcharge and cess, with the rate depending on the holding period. Because it's on the full price, it's usually far more than the tax on the actual gain. Verify the current rate with a CA.

### How does an NRI get a refund on property-sale TDS?
File an Indian income-tax return for the assessment year, report the capital gain with the correct indexed cost and any exemptions, and claim the TDS credit shown in Form 26AS. The excess of TDS over the real tax is refunded to a pre-validated NRO account after the return is processed.

### Can I avoid high TDS on my property sale up front?
Yes — by applying for a Form 13 lower/nil-deduction certificate before the sale completes. If granted, the buyer deducts TDS on your estimated actual gain instead of the full sale price, freeing most of the proceeds at closing rather than through a later refund.`,
  },
];

/** All cluster pages, with reading time computed. */
export const tdsPages: TdsPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

/** The pillar page. */
export const tdsPillar: TdsPage = tdsPages.find((p) => p.kind === "pillar")!;

/** The supporting pages, in authored order. */
export const tdsSupportPages: TdsPage[] = tdsPages.filter(
  (p) => p.kind === "support"
);

/** Look up a cluster page by its slug ("" / unknown → undefined). */
export function getTdsPage(slug: string): TdsPage | undefined {
  return tdsPages.find((p) => p.slug === slug);
}
