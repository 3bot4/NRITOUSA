import { computeReadingTime } from "@/lib/format";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TITLE } from "@/lib/taxCompliance";

/**
 * Topic cluster (hub-&-spoke) for "NRI India ITR Filing from USA".
 *
 *   /india-tax-compliance/                              ← parent hub (existing)
 *     └─ /nri-itr-filing-usa                            ← pillar page
 *          ├─ /itr-2-for-nri
 *          ├─ /itr-3-for-nri
 *          ├─ /form-26as-ais-tis-nri
 *          └─ /nri-india-tax-documents-checklist        ← supporting pages
 *
 * Every page is authored in the same light-markdown + ::: fence format as
 * lib/articles / lib/passportCluster (rendered by ArticleBody). The pillar
 * links down to every supporting page; each supporting page links back up to
 * the pillar and across to its siblings. That dense internal linking is the
 * whole point of the cluster — see components/ItrClusterPage.tsx.
 *
 * Educational-only: nothing here is tax advice. Indian assessment-year forms,
 * eligibility, deadlines, and slabs change every year — always verify on the
 * Income Tax portal (incometax.gov.in) or with a qualified CA.
 */

export type ItrPageKind = "pillar" | "support";

export interface ItrPageData {
  /** The child segment under /india-tax-compliance (e.g. "itr-2-for-nri"). */
  slug: string;
  kind: ItrPageKind;
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

export interface ItrPage extends ItrPageData {
  readingTime: number;
}

/** Parent hub these pages live under (the existing India Tax & Compliance hub). */
export const ITR_HUB_PATH = TAX_COMPLIANCE_PATH;
export const ITR_HUB_TITLE = TAX_COMPLIANCE_TITLE;

/** The pillar slug (everything else is a supporting page). */
export const ITR_PILLAR_SLUG = "nri-itr-filing-usa";

/** Root-relative path for any cluster page. */
export const itrPath = (slug: string) => `${ITR_HUB_PATH}/${slug}`;

/** Section heading + card copy used on the parent hub page. */
export const ITR_CLUSTER_SECTION = {
  eyebrow: "New",
  title: "India ITR Filing from USA",
  description:
    "File your Indian tax return from the USA with a clean checklist: ITR form selection, NRO/NRE statements, Form 26AS, AIS/TIS, TDS refund, rental income, capital gains, and CA questions.",
};

const rawPages: ItrPageData[] = [
  /* ----------------------------- PILLAR ----------------------------- */
  {
    slug: ITR_PILLAR_SLUG,
    kind: "pillar",
    title:
      "NRI ITR Filing from USA: Forms, Deadlines, TDS Refunds & Documents",
    seoTitle:
      "NRI ITR Filing from USA: Forms, Deadlines, TDS Refunds & Documents",
    metaDescription:
      "Indian NRI living in the USA? Learn when you need to file an Indian ITR, which ITR form may apply, what documents to collect, how TDS refunds work, and what to review with your CA.",
    navLabel: "Start here: the full guide",
    icon: "🧾",
    accent: "from-rose-500 to-pink-600",
    date: "2026-06-22",
    excerpt:
      "Living in the USA but earning in India? Here's when you may need to file an Indian ITR, which form may apply, the documents to gather, how TDS refunds work, and the exact questions to take to your CA.",
    content: `Plenty of NRIs in the USA assume that because they pay US tax, or because their NRE interest is exempt, they have nothing to file in India. Often that's wrong — and the most common casualty is a **TDS refund you simply never claimed**. This guide walks through when an Indian return is worth filing, which form tends to apply, what to gather, and how the timeline works.

:::warn
title: Read this first — educational only
- This is general educational information, **not tax advice**. Indian assessment-year (AY) forms, eligibility, due dates, and slabs change every year.
- Always verify the current rules on the official [Income Tax portal](https://www.incometax.gov.in) or with a qualified **Chartered Accountant (CA)** before you file.
- Your US side (Form 1040, FBAR, FATCA) is separate — see the [India Tax & Compliance hub](/india-tax-compliance) for that.
:::

:::cta
title: Filing India ITR from the USA?
body: Before you file, check whether the same income also needs U.S. reporting, FBAR/FATCA review, or foreign tax credit planning. The DIY NRI tax filing roadmap maps the whole U.S. + India picture.
button: Open U.S. + India tax roadmap
href: /tools/nri-tax-filing-roadmap
:::

:::info
title: What you'll get on this page
- When an NRI in the USA may need to file an Indian return
- The income types that usually trigger a review (NRO interest, rent, capital gains, TDS refunds, and more)
- Which ITR form may apply — **ITR-2 vs ITR-3** — with the must-verify caveat
- A full documents checklist, the filing timeline, common mistakes, and questions for your CA
:::

## 1. When NRIs in the USA may need to file an Indian ITR
Your **residential status under Indian tax law** (which is about days in India, not your visa) decides what India can tax. As an NRI, India generally taxes only your **India-sourced income** — but "taxed" and "needs a return" are not the same thing.

:::good
title: You should usually review whether to file if any of these is true
- Your total Indian taxable income is **above the basic exemption limit** for the year
- **TDS was deducted** on your Indian income (NRO interest, rent, capital gains, dividends) and you want a refund
- You **sold property, shares, or mutual funds** in India during the year
- You earned **rental income** from Indian property
- You need a filed return for a **visa, loan, or repatriation** paper trail
- You want to **carry forward a capital loss** to offset future gains
:::

:::tip
title: The exemption-limit nuance
- Filing can be **mandatory** once gross total income crosses the basic exemption limit, even if TDS already covered the tax.
- It can also be **worth filing voluntarily** below that limit — that's how you reclaim over-deducted TDS.
- The exact limit and any NRI-specific conditions change by year and regime — confirm the current figure on the [Income Tax portal](https://www.incometax.gov.in).
:::

## 2. Income types that usually trigger a review
If you have any of the following from India, it's worth a closer look before you decide not to file:

| Income type | Why it matters for an NRI |
|---|---|
| **NRO interest** | Interest on NRO accounts/FDs is taxable in India and TDS is typically deducted at a higher NRO rate — often refundable. |
| **NRE / FCNR interest** | Generally exempt while you qualify as an NRI — but exemption is not the same as "no filing." |
| **Rental income** | Rent from Indian property is India-sourced and taxable; tenants may be required to deduct TDS. |
| **Capital gains** | Gains on shares, mutual funds, or property are taxable and frequently have TDS withheld at source. |
| **Property sale** | Sale proceeds attract TDS that is often **far higher than the actual tax** — a classic refund situation. |
| **Dividends** | Indian dividends are taxable in your hands and usually have TDS deducted. |
| **Salary from India** | If any portion of salary is for services in India or paid in India, it can be taxable here. |
| **Business / professional income** | Income from a profession, freelancing, or a business connection in India. |
| **TDS refund claims** | Any case where tax deducted exceeds your actual liability — filing is the only way to get it back. |

For the cross-border treatment of several of these, see [Indian income on your US tax return](/articles/indian-income-us-tax-return), the [NRE vs NRO account guide](/articles/nre-nro-accounts-explained), and [selling Indian shares as a US resident](/articles/selling-indian-shares-us-resident-tax).

## 3. Which ITR form may apply
Two forms cover most NRIs. The dividing line is usually **whether you have business or professional income**.

:::info
title: ITR-2 — the common NRI form
- Generally for **individuals and HUFs without business or professional income**.
- Covers **salary, house property (rent), capital gains, and other sources** (interest, dividends) — and lets you report **multiple income heads** together.
- This is what many NRIs use to claim **NRO TDS / property-sale TDS refunds**. Read the [ITR-2 for NRIs](/india-tax-compliance/itr-2-for-nri) deep dive.
:::

:::info
title: ITR-3 — when business or profession is involved
- Generally used when there's **business or professional income**, or **partnership-related income** (e.g. share of profits from a firm).
- Includes everything ITR-2 covers **plus** the business/profession schedules. Read the [ITR-3 for NRIs](/india-tax-compliance/itr-3-for-nri) deep dive.
:::

:::warn
title: Always verify the form before you file
- Form numbers, eligibility conditions, and schedules **change by assessment year**.
- Confirm the correct current-AY form and your eligibility on the [Income Tax portal](https://www.incometax.gov.in) or with a CA before filing.
- Filing the **wrong form** is one of the most common — and most avoidable — NRI mistakes.
:::

## 4. Documents checklist
Gather these before you start. Having them in one folder is what turns a stressful filing into a 30-minute one. The full annotated version lives in the [NRI India tax documents checklist](/india-tax-compliance/nri-india-tax-documents-checklist).

:::steps
1. Identity — PAN (mandatory), Aadhaar status if applicable, and Passport / OCI if relevant to your status
2. Bank statements — NRE, NRO, and FCNR account statements for the full financial year
3. Tax credit statements — Form 26AS, plus AIS and TIS downloaded from the portal
4. TDS certificates — Form 16 / 16A / 16B as applicable, and any TDS certificates from banks or buyers
5. Rental income — rent agreement, rent received summary, and the home loan interest certificate if you have a loan
6. Property sale — the sale deed, the original purchase deed / cost records, and improvement-cost proofs
7. Capital gains — brokerage / mutual-fund capital-gains statements for the year
8. US coordination — your US tax return summary if you'll claim foreign tax credit in India
:::

:::tip
title: Why Form 26AS, AIS and TIS come first
- They are the tax department's own record of your income and the TDS deducted against your PAN.
- Filing figures that don't match them is the #1 cause of notices. See [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri).
:::

## 5. Filing timeline
Three dates matter: the **due date**, the **belated / revised** window, and when your **refund** actually lands.

### Return due date
There is an annual due date for filing an individual's ITR for a given assessment year. The exact date moves year to year and is sometimes extended.

:::warn
title: Verify the current assessment-year deadline
- Do not rely on last year's date — **confirm the current-AY due date** on the [Income Tax portal](https://www.incometax.gov.in).
- Filing after the due date can mean **late fees, interest, and loss of some carry-forward benefits**.
:::

### Belated and revised returns
- Missed the due date? A **belated return** can usually still be filed within a later cut-off, typically with a late fee and interest.
- Spotted an error after filing? A **revised return** lets you correct it within the allowed window.
- Both windows have hard cut-offs that change by year — check the current limits before relying on them.

### Refund tracking
- Refunds (e.g. over-deducted NRO or property-sale TDS) are paid after the return is **filed and e-verified**.
- Track status on the [Income Tax portal](https://www.incometax.gov.in) under your account, and via the NSDL/TIN refund-status tools.
- Make sure your **NRO bank account is pre-validated** on the portal — refunds are paid into a validated account.

## 6. Common NRI mistakes
:::warn
title: The mistakes that cost NRIs money
- **Assuming NRE interest exemption means no Indian filing** — exemption is not the same as having nothing to file.
- **Missing the NRO TDS refund** — NRO/property-sale TDS is often far higher than the real tax, and goes unclaimed.
- **Ignoring an AIS / 26AS mismatch** — figures that don't match the department's records trigger notices.
- **Using the wrong ITR form** — e.g. ITR-1 (often not for NRIs) or ITR-2 when business income needs ITR-3.
- **Not reporting a property sale correctly** — wrong cost base, missed indexation, or forgetting the TDS credit.
- **Not coordinating India and US returns** — double-counting income or missing the foreign tax credit on one side.
:::

For the US side of double taxation, see [DTAA & avoiding double taxation](/articles/double-taxation-dtaa-india-usa) and the [FBAR / FATCA guide](/articles/fbar-fatca-nri-guide).

## 7. Questions to ask your CA
Take this list to your Chartered Accountant — it covers the decisions that actually change your outcome:

:::info
title: Bring these to your CA
- Based on my days in India, what's my **residential status** for this assessment year?
- Given my income, **am I required to file**, or only filing to claim a refund?
- Which **ITR form** applies to me this year — and why?
- How do we **reconcile my AIS / TIS / Form 26AS** with my own records?
- What **NRO / property-sale TDS** can I reclaim, and how long will the refund take?
- How should we handle my **property sale** — cost base, indexation, and the TDS credit?
- Can we use the **DTAA** so I'm not taxed twice across India and the US?
- Is my **NRO account validated** on the portal so the refund can be paid?
- What do I need to keep for **repatriation** of the proceeds afterwards?
:::

## 8. Keep going
:::cta
title: Organize everything in one place
body: Use the free NRI Global Wealth & Tax Organizer to list your India and US income once and get an educational India-ITR + FBAR/FATCA checklist with questions for your CA/CPA.
button: Start the free organizer
href: /nri-wealth-checkup
:::

- **Pick your form:** [ITR-2 for NRIs](/india-tax-compliance/itr-2-for-nri) · [ITR-3 for NRIs](/india-tax-compliance/itr-3-for-nri)
- **Match the records:** [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri)
- **Gather the paperwork:** [NRI India tax documents checklist](/india-tax-compliance/nri-india-tax-documents-checklist)
- **Related guides:** [DTAA](/articles/double-taxation-dtaa-india-usa) · [Indian income on a US return](/articles/indian-income-us-tax-return) · [NRE/NRO accounts](/articles/nre-nro-accounts-explained) · [Repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa) · [Form 3520 on foreign gifts](/articles/gifting-money-india-tax-implications) · [PFIC & Indian mutual funds](/articles/pfic-indian-mutual-funds-trap) · [FBAR / FATCA](/articles/fbar-fatca-nri-guide)
- **Tools:** [Form 10F generator](/tools/form-10f-generator) · [all calculators](/calculators)

## Frequently asked questions

### Do NRIs in the USA have to file an Indian tax return?
Not always — it depends on your India-sourced income. Filing is generally required once your Indian taxable income crosses the basic exemption limit, and it's worth filing voluntarily whenever TDS was over-deducted and you want a refund. Confirm the current limit on the Income Tax portal or with a CA.

### Is NRE account interest taxable in India?
NRE and FCNR interest is generally exempt while you qualify as an NRI. But exemption is not the same as "nothing to file" — if you have other India-sourced income or refundable TDS, you may still need or want to file.

### Which ITR form should an NRI use?
Many NRIs use ITR-2 (no business/professional income), while ITR-3 applies when business, professional, or partnership income is involved. Form eligibility changes by assessment year, so verify the correct current form before filing.

### How do NRIs claim a TDS refund in India?
File the ITR for the relevant assessment year, e-verify it, and ensure your NRO bank account is pre-validated on the portal. The refund of over-deducted TDS is paid into the validated account after processing.

### Do I have to report Indian income on my US tax return too?
If you're a US tax resident, the US taxes your worldwide income, so Indian income generally must be reported on your US return as well. The DTAA and foreign tax credit usually prevent actual double taxation — see the DTAA guide and coordinate both returns with your CA/CPA.`,
  },

  /* --------------------------- ITR-2 ----------------------------- */
  {
    slug: "itr-2-for-nri",
    kind: "support",
    title: "ITR-2 for NRIs: When This Is Your Indian Tax Return",
    seoTitle: "ITR-2 for NRIs in the USA: When to Use It & What It Covers",
    metaDescription:
      "ITR-2 is the form many NRIs use to report Indian salary, rent, capital gains, and interest — and to claim NRO/property TDS refunds. Here's when it applies and how to verify.",
    navLabel: "ITR-2 for NRIs",
    icon: "📄",
    accent: "from-blue-500 to-indigo-600",
    date: "2026-06-22",
    excerpt:
      "ITR-2 is the form many NRIs use when there's no business income — covering salary, house property, capital gains, and other sources, and the route to most NRO and property-sale TDS refunds.",
    content: `If you're an NRI in the USA with Indian income but **no business or professional income**, ITR-2 is most likely your form. It's also the form behind most NRI TDS refunds. This is when it applies, what it covers, and what to confirm before you file.

:::warn
title: Educational only — verify the current AY
- This is general information, not tax advice. ITR form numbers, eligibility, and schedules **change every assessment year**.
- Confirm the correct current-AY form and your eligibility on the [Income Tax portal](https://www.incometax.gov.in) or with a CA before filing.
:::

## When ITR-2 generally applies
ITR-2 is generally for **individuals and HUFs who do not have income from business or profession**. For a typical NRI in the USA, that fits when your Indian income is some mix of:

:::good
title: ITR-2 usually fits if you have
- **Salary or pension** income from India (no business)
- **House property** income — i.e. rent from Indian property
- **Capital gains** — from shares, mutual funds, or property
- **Other sources** — NRO interest, dividends, etc.
- **More than one** of the above at the same time (multiple income heads)
:::

:::bad
title: ITR-2 usually does NOT fit if you have
- **Business or professional income** — that generally points to [ITR-3](/india-tax-compliance/itr-3-for-nri)
- **Partnership / firm** profit share — also generally ITR-3
:::

:::tip
title: Why not ITR-1?
- ITR-1 (Sahaj) is a simpler form, but it is **commonly not available to non-residents** and is limited in the income it allows.
- That's a key reason many NRIs land on ITR-2 instead. Verify your eligibility for the current year before assuming either.
:::

## What ITR-2 covers for an NRI
The form is organized by **income heads** plus supporting schedules. The ones NRIs use most:

| Schedule / head | What goes here |
|---|---|
| **Salary** | India salary or pension, if any |
| **House Property** | Rent received, municipal taxes, standard deduction, home loan interest |
| **Capital Gains** | Sale of shares, mutual funds, and property — short- and long-term |
| **Other Sources** | NRO interest, dividends, and other interest income |
| **TDS schedules** | The TDS already deducted against your PAN — the basis of your refund |
| **Foreign / DTAA** | Treaty-relief details where applicable |

## The NRI refund angle
This is why ITR-2 matters so much for NRIs. TDS on **NRO interest** and on a **property sale** is frequently deducted at rates well above your actual liability. Filing ITR-2 is how you reconcile that and claim the difference back.

:::steps
1. Pull your records — Form 26AS, AIS, and TIS to confirm the income and TDS the department already sees
2. Report each head — salary, house property, capital gains, other sources — matching those records
3. Claim the TDS — enter the deducted TDS so it offsets your computed tax
4. File and e-verify — the return must be e-verified for processing to begin
5. Get the refund — paid into your pre-validated NRO account after processing
:::

:::warn
title: Common ITR-2 mistakes for NRIs
- Reporting figures that **don't match AIS / 26AS** — reconcile first ([26AS / AIS / TIS guide](/india-tax-compliance/form-26as-ais-tis-nri)).
- **Forgetting the property-sale TDS credit**, so the refund is understated or missed.
- Getting the **capital-gains cost base** wrong (purchase cost, improvements, indexation where applicable).
- Not **pre-validating the NRO account**, so the refund can't be paid.
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Am I eligible for **ITR-2** this assessment year, or does my situation need ITR-3?
- Have we captured **all TDS** from Form 26AS / AIS so my refund is complete?
- Is my **capital-gains computation** correct, including cost and any indexation?
- Should we apply the **DTAA** for any treaty relief?
- Is my **NRO account validated** on the portal for the refund?
:::

:::cta
title: Not sure ITR-2 is your form?
body: Start with the full pillar guide to compare ITR-2 vs ITR-3, the documents you'll need, and the filing timeline.
button: Read the NRI ITR filing guide
href: /india-tax-compliance/nri-itr-filing-usa
:::

- **Compare:** [ITR-3 for NRIs](/india-tax-compliance/itr-3-for-nri)
- **Match records:** [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri)
- **Gather docs:** [NRI India tax documents checklist](/india-tax-compliance/nri-india-tax-documents-checklist)
- **Related:** [Selling Indian shares as a US resident](/articles/selling-indian-shares-us-resident-tax) · [Repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa) · [DTAA](/articles/double-taxation-dtaa-india-usa)

## Frequently asked questions

### Can an NRI file ITR-2?
Yes — ITR-2 is generally available to individuals and HUFs without business or professional income, which fits many NRIs with salary, rent, capital gains, or interest from India. Verify eligibility for the current assessment year before filing.

### What's the difference between ITR-2 and ITR-3 for an NRI?
ITR-2 is for income without a business or profession; ITR-3 is used when business, professional, or partnership income is involved. ITR-3 includes everything in ITR-2 plus the business/profession schedules.

### Do I use ITR-2 to claim an NRO TDS refund?
If you have no business income, ITR-2 is commonly the form used to report your income and claim back over-deducted NRO or property-sale TDS. The refund is paid after the return is filed and e-verified into a validated NRO account.`,
  },

  /* --------------------------- ITR-3 ----------------------------- */
  {
    slug: "itr-3-for-nri",
    kind: "support",
    title: "ITR-3 for NRIs: When Business or Professional Income Applies",
    seoTitle: "ITR-3 for NRIs in the USA: Business & Professional Income",
    metaDescription:
      "ITR-3 is the Indian return for NRIs with business, professional, or partnership income. Here's when it applies, what it adds over ITR-2, and what to confirm with your CA.",
    navLabel: "ITR-3 for NRIs",
    icon: "🏢",
    accent: "from-violet-500 to-purple-600",
    date: "2026-06-22",
    excerpt:
      "ITR-3 is the form for NRIs whose Indian income includes business, professional, or partnership income — everything ITR-2 covers, plus the business and profession schedules.",
    content: `Most NRIs in the USA file ITR-2. But if any of your Indian income comes from a **business, a profession, or a partnership firm**, ITR-2 generally isn't enough — that's where ITR-3 comes in. Here's how to tell, and what changes.

:::warn
title: Educational only — verify the current AY
- This is general information, not tax advice. ITR eligibility and schedules **change every assessment year**.
- Confirm the correct current-AY form and your eligibility on the [Income Tax portal](https://www.incometax.gov.in) or with a CA before filing.
:::

## When ITR-3 generally applies
ITR-3 is generally used by individuals and HUFs who have **income from a business or profession** — and it also covers everything ITR-2 does.

:::good
title: ITR-3 usually fits if you have
- **Business income** with an India connection
- **Professional income** — consulting, freelancing, or practising a profession in India
- **Partnership / firm income** — your share of profits, interest, or remuneration from a firm
- Business/professional income **together with** salary, rent, capital gains, or interest
:::

:::bad
title: You probably don't need ITR-3 if
- Your Indian income is only **salary, rent, capital gains, and interest** — that's typically [ITR-2](/india-tax-compliance/itr-2-for-nri)
- You have **no business, professional, or partnership** income at all
:::

## What ITR-3 adds over ITR-2
Think of ITR-3 as **ITR-2 plus the business/profession machinery**:

| Area | ITR-2 | ITR-3 |
|---|---|---|
| Salary, house property, capital gains, other sources | Yes | Yes |
| Business / profession income | No | Yes |
| Partnership / firm income | No | Yes |
| Profit & loss / balance-sheet schedules | No | Yes (as applicable) |
| Books-of-account / audit linkage | No | May apply |

:::tip
title: Business income raises the stakes
- ITR-3 can pull in **profit-and-loss and balance-sheet** details and, in some cases, **audit** requirements.
- Cross-border business or professional income also interacts with the **DTAA** and the concept of a permanent establishment.
- This is the form where working with a **CA is most worth it** for an NRI.
:::

## Don't lose the NRI essentials
Even with business income, the NRI fundamentals still apply inside ITR-3:

:::steps
1. Reconcile records — Form 26AS, AIS, and TIS still drive your reported income and TDS
2. Capture all TDS — including TDS on professional fees, contracts, NRO interest, and any property sale
3. Apply the DTAA — coordinate India and US treatment so the same income isn't taxed twice
4. File and e-verify — required before any refund is processed
5. Validate your NRO account — so refunds can actually be paid
:::

:::warn
title: Common ITR-3 mistakes for NRIs
- Filing **ITR-2 when business income exists** — wrong form, likely a notice.
- Missing **TDS on professional fees / contracts** that's sitting in your 26AS.
- Ignoring **DTAA / permanent-establishment** questions on cross-border business income.
- Not reconciling against [AIS / TIS / 26AS](/india-tax-compliance/form-26as-ais-tis-nri) first.
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Does my income actually require **ITR-3**, or can I stay on ITR-2 this year?
- Do I have **books-of-account or audit** obligations for my business/professional income?
- How does the **DTAA** treat my Indian business or professional income?
- Have we captured **all TDS** — including on fees and contracts — for the refund?
- Is my **NRO account validated** on the portal?
:::

:::cta
title: Start with the big picture
body: The pillar guide compares ITR-2 vs ITR-3, lists every document, and walks the filing timeline and TDS-refund process.
button: Read the NRI ITR filing guide
href: /india-tax-compliance/nri-itr-filing-usa
:::

- **Compare:** [ITR-2 for NRIs](/india-tax-compliance/itr-2-for-nri)
- **Match records:** [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri)
- **Gather docs:** [NRI India tax documents checklist](/india-tax-compliance/nri-india-tax-documents-checklist)
- **Related:** [DTAA](/articles/double-taxation-dtaa-india-usa) · [Indian income on a US return](/articles/indian-income-us-tax-return) · [Form 10F generator](/tools/form-10f-generator)

## Frequently asked questions

### When does an NRI need ITR-3 instead of ITR-2?
Use ITR-3 when you have income from a business, profession, or partnership firm in India. If your Indian income is only salary, rent, capital gains, and interest, ITR-2 is usually the right form. Verify for the current assessment year.

### Does ITR-3 cover capital gains and rent too?
Yes. ITR-3 covers everything ITR-2 does — salary, house property, capital gains, and other sources — and adds the business and profession schedules on top.

### Can an NRI freelancer file in India?
An NRI with professional or freelance income connected to India may need to file, typically using ITR-3, and should consider DTAA treatment to avoid double taxation. Discuss the specifics, including any audit obligations, with a CA.`,
  },

  /* --------------------- 26AS / AIS / TIS ------------------------ */
  {
    slug: "form-26as-ais-tis-nri",
    kind: "support",
    title: "Form 26AS, AIS & TIS for NRIs: Match Before You File",
    seoTitle: "Form 26AS, AIS & TIS for NRIs: The Pre-Filing Reconciliation",
    metaDescription:
      "Form 26AS, AIS, and TIS are the tax department's record of your Indian income and TDS. Here's what each one is and how NRIs reconcile them before filing to avoid notices.",
    navLabel: "Form 26AS, AIS & TIS",
    icon: "📊",
    accent: "from-emerald-500 to-teal-600",
    date: "2026-06-22",
    excerpt:
      "Form 26AS, AIS, and TIS are the income-tax department's own record of your Indian income and the TDS deducted. Reconciling them before you file is how NRIs avoid mismatch notices.",
    content: `Before you enter a single number in your ITR, pull three documents: **Form 26AS, the AIS, and the TIS**. They are the tax department's view of your income and TDS — and filing figures that disagree with them is the fastest route to a notice. This is what each one is and how to reconcile them as an NRI.

:::warn
title: Educational only — verify on the portal
- This is general information, not tax advice. Where and how these statements appear can **change by year**.
- Download the current versions from the official [Income Tax portal](https://www.incometax.gov.in) and confirm specifics with a CA.
:::

## What each statement is
:::info
title: The three records
- **Form 26AS** — your tax-credit statement: TDS/TCS deducted against your PAN, advance/self-assessment tax, and certain high-value items.
- **AIS (Annual Information Statement)** — a wider view of reported financial information: interest, dividends, securities and mutual-fund transactions, property dealings, and more.
- **TIS (Taxpayer Information Summary)** — a simplified, category-wise summary derived from the AIS, showing processed values you can use as a starting point.
:::

| Statement | Best for |
|---|---|
| **Form 26AS** | Confirming exactly how much **TDS** was deducted so you claim the full credit |
| **AIS** | Seeing **all reported income** — including items you may have forgotten |
| **TIS** | A quick **category summary** to sanity-check totals before filing |

## Why this matters more for NRIs
As an NRI, much of your Indian income has **TDS deducted at source** — NRO interest, rent, dividends, and property sales. The TDS in Form 26AS is precisely what you'll claim back as a refund, so it must be captured in full. And because AIS now pulls in a wide net of transactions, an NRI who only remembers their NRO FD but forgets a small dividend or a mutual-fund redemption can easily file a mismatched return.

:::tip
title: Reconcile, don't just copy
- Numbers in AIS are **not always final** — they can include duplicates or misclassified entries.
- You can submit **feedback** in the AIS to flag an entry that's wrong or already counted.
- Reconcile AIS/TIS against **your own statements** (bank, broker, rent records) and let any genuine discrepancy be corrected.
:::

## How to reconcile before filing
:::steps
1. Download all three — Form 26AS, AIS, and TIS for the relevant assessment year from the portal
2. List your own income — from NRO/NRE statements, broker capital-gains reports, and rent records
3. Match line by line — tie every AIS/26AS entry to something in your records, and vice versa
4. Flag mismatches — submit AIS feedback for duplicates or misclassified items
5. Capture all TDS — make sure every rupee of TDS in 26AS is claimed in your return
6. File only when aligned — your ITR figures should reconcile to these statements
:::

:::warn
title: Common mismatch traps for NRIs
- A **property-sale TDS** entry that wasn't carried into the return.
- A **dividend or interest** line in AIS that was overlooked.
- TDS shown under the **wrong year** because of timing differences.
- Treating an AIS figure as final without checking it against **your own records**.
:::

## Questions to ask your CA
:::info
title: Bring these to your CA
- Does my return **fully reconcile** with Form 26AS, AIS, and TIS?
- Is there any **AIS entry I should dispute** via feedback?
- Have we claimed **every TDS credit** in 26AS so my refund is complete?
- Are any items showing in the **wrong assessment year**?
:::

:::cta
title: Ready to file?
body: Once your records reconcile, the pillar guide walks you through form selection, the documents, and the TDS-refund timeline.
button: Read the NRI ITR filing guide
href: /india-tax-compliance/nri-itr-filing-usa
:::

- **Pick your form:** [ITR-2 for NRIs](/india-tax-compliance/itr-2-for-nri) · [ITR-3 for NRIs](/india-tax-compliance/itr-3-for-nri)
- **Gather docs:** [NRI India tax documents checklist](/india-tax-compliance/nri-india-tax-documents-checklist)
- **Related:** [NRE/NRO accounts](/articles/nre-nro-accounts-explained) · [Indian income on a US return](/articles/indian-income-us-tax-return)

## Frequently asked questions

### What is the difference between Form 26AS and AIS?
Form 26AS focuses on tax credits — the TDS/TCS deducted against your PAN and taxes paid. The AIS is broader, listing a wide range of reported financial transactions such as interest, dividends, and securities or property dealings. The TIS is a simplified summary of the AIS.

### Why should NRIs check AIS and TIS before filing?
Because the tax department compares your return against these statements. Filing income or TDS figures that don't match is a leading cause of mismatch notices. Reconciling first lets you catch missed income and claim every TDS credit.

### What if my AIS shows wrong information?
You can submit feedback in the AIS to flag an entry that is a duplicate, misclassified, or not yours. Reconcile against your own bank, broker, and rent records, and have genuine discrepancies corrected before filing.`,
  },

  /* ------------------ DOCUMENTS CHECKLIST ----------------------- */
  {
    slug: "nri-india-tax-documents-checklist",
    kind: "support",
    title: "NRI India Tax Documents Checklist (Filing from the USA)",
    seoTitle: "NRI India Tax Documents Checklist for Filing from the USA",
    metaDescription:
      "Every document an NRI in the USA needs to file an Indian ITR: PAN, NRE/NRO/FCNR statements, Form 26AS, AIS/TIS, TDS certificates, property deeds, capital-gains statements, and more.",
    navLabel: "Documents checklist",
    icon: "🗂️",
    accent: "from-amber-500 to-orange-600",
    date: "2026-06-22",
    excerpt:
      "The complete, annotated list of what an NRI in the USA needs to file an Indian return — identity, bank statements, tax-credit records, TDS certificates, property deeds, and US coordination.",
    content: `Half the pain of filing an Indian return from the USA is simply **finding the paperwork** across two countries and several institutions. Gather these once, into one folder, and the rest is straightforward. Here's the full checklist with notes on why each item matters.

:::warn
title: Educational only
- This is a general checklist, not tax advice. Exactly what you need depends on your income and the assessment year.
- Confirm specifics on the [Income Tax portal](https://www.incometax.gov.in) or with a CA.
:::

:::info
title: The fast version
- Identity: PAN, Aadhaar status, Passport/OCI
- Bank: NRE, NRO, FCNR statements
- Tax records: Form 26AS, AIS, TIS, TDS certificates
- Property & gains: rent agreement, sale & purchase deeds, loan interest cert, brokerage statements
- US side: your US return summary for foreign tax credit
:::

## 1. Identity and status
- **PAN** — mandatory to file; everything is keyed to it.
- **Aadhaar status** — note your Aadhaar position if it applies to you; rules on PAN–Aadhaar linkage vary by case, so confirm what applies to NRIs.
- **Passport / OCI** — useful to evidence your days in/out of India and your status, and relevant if you're an OCI holder.

## 2. Bank statements
- **NRE account** statements — for the full financial year.
- **NRO account** statements — these carry the taxable interest and the TDS you'll often reclaim.
- **FCNR deposit** records — for completeness and interest tracking.

:::tip
title: Why full-year statements
- Interest is often credited quarterly, and **TDS is deducted as it accrues** — partial statements miss credits.
- Your refund depends on capturing **every** TDS entry. See the [NRE/NRO account guide](/articles/nre-nro-accounts-explained) and [FCNR deposits](/articles/fcnr-deposit-usd-yield).
:::

## 3. Tax-credit records
- **Form 26AS** — the TDS/TCS deducted against your PAN.
- **AIS** — the wider statement of reported financial transactions.
- **TIS** — the category-wise summary of the AIS.
- **TDS certificates** — from banks, tenants, or a property buyer.

These three are important enough to have their own guide: [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri).

## 4. Rental income
- **Rent agreement** — to support the rent figure and any TDS by the tenant.
- **Rent received summary** — month-by-month for the year.
- **Home loan interest certificate** — interest on a loan against the let-out property is generally deductible.

## 5. Property sale
- **Sale deed** — the disposal that triggers capital gains and TDS.
- **Purchase deed / cost records** — your original cost, essential to compute the gain.
- **Improvement-cost proofs** — capital improvements can add to your cost base.

:::tip
title: Cost records save the most tax
- The bigger your provable cost base, the smaller the taxable gain — and the larger your **TDS refund**.
- See [repatriating property-sale proceeds](/articles/repatriate-india-property-sale-usa) for what happens after the sale.
:::

## 6. Capital gains (securities)
- **Brokerage capital-gains statements** — the year's realized short- and long-term gains.
- **Mutual-fund capital-gains statements** — from the registrar / AMC.

For the cross-border angle, see [selling Indian shares as a US resident](/articles/selling-indian-shares-us-resident-tax) and the [PFIC trap](/articles/pfic-indian-mutual-funds-trap).

## 7. TDS / salary certificates
- **Form 16** — for any Indian salary.
- **Form 16A** — for TDS on non-salary income (interest, professional fees).
- **Form 16B** — for TDS on a property sale (issued by the buyer).

## 8. US coordination
- **US tax return summary** — if you'll claim a **foreign tax credit in India** for tax paid in the US, or coordinate the DTAA across both returns.

:::info
title: Don't file India and the US in isolation
- Coordinating the two avoids double-counting income and missed credits. See [DTAA & double taxation](/articles/double-taxation-dtaa-india-usa) and [Indian income on a US return](/articles/indian-income-us-tax-return).
- US-side reporting of these Indian accounts is separate: [FBAR / FATCA](/articles/fbar-fatca-nri-guide).
:::

## Before you hit file
:::steps
1. Reconcile — match your documents to Form 26AS / AIS / TIS
2. Pick the form — ITR-2 or ITR-3 based on whether you have business income
3. Validate your NRO account — so any refund can be paid
4. E-verify — the return isn't processed until it's e-verified
:::

:::cta
title: Put it all together
body: The pillar guide ties this checklist to form selection, the filing timeline, and the TDS-refund process end to end.
button: Read the NRI ITR filing guide
href: /india-tax-compliance/nri-itr-filing-usa
:::

- **Pick your form:** [ITR-2 for NRIs](/india-tax-compliance/itr-2-for-nri) · [ITR-3 for NRIs](/india-tax-compliance/itr-3-for-nri)
- **Match records:** [Form 26AS, AIS & TIS for NRIs](/india-tax-compliance/form-26as-ais-tis-nri)
- **Tools:** [Form 10F generator](/tools/form-10f-generator) · [all calculators](/calculators)

## Frequently asked questions

### What documents does an NRI need to file an Indian tax return?
At minimum: PAN; NRE/NRO/FCNR bank statements; Form 26AS, AIS, and TIS; TDS certificates (Form 16/16A/16B as applicable); rent agreement and home loan interest certificate for rental income; sale and purchase deeds for any property sale; brokerage capital-gains statements; and your US return summary if claiming a foreign tax credit.

### Do NRIs need Aadhaar to file an ITR?
PAN is mandatory to file. Aadhaar and PAN–Aadhaar linkage rules can differ for NRIs and change over time, so confirm what currently applies to your situation on the Income Tax portal or with a CA.

### Why do I need my US tax return to file in India?
If you claim a foreign tax credit in India for US tax paid, or coordinate DTAA relief across both returns, your US return summary documents the tax already paid and the income reported. This helps avoid double taxation.`,
  },
];

/** All cluster pages, with reading time computed. */
export const itrPages: ItrPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

/** The pillar page. */
export const itrPillar: ItrPage = itrPages.find(
  (p) => p.kind === "pillar"
)!;

/** The supporting pages, in authored order. */
export const itrSupportPages: ItrPage[] = itrPages.filter(
  (p) => p.kind === "support"
);

/** Look up a cluster page by its slug ("" / unknown → undefined). */
export function getItrPage(slug: string): ItrPage | undefined {
  return itrPages.find((p) => p.slug === slug);
}
