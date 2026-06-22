import { computeReadingTime } from "@/lib/format";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TITLE } from "@/lib/taxCompliance";

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

export interface GiftPageData {
  /** The child segment under /india-tax-compliance. */
  slug: string;
  kind: GiftPageKind;
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
    title:
      "Money from Parents in India: Gifts, Inheritance, Property & Form 3520 for US NRIs",
    seoTitle:
      "Money from Parents in India: Gifts, Inheritance, Property & Form 3520 for US NRIs",
    metaDescription:
      "US-based Indian? Learn how gifts from parents, inheritance from India, property transfers, bank wires, Form 3520, FBAR/FATCA, and Indian documentation fit together.",
    navLabel: "Start here: the full guide",
    icon: "🎁",
    accent: "from-rose-500 to-pink-600",
    date: "2026-06-22",
    excerpt:
      "Gifts from your parents, an inheritance from India, money for a US down payment — none of it is taxable income to you in the US, but the reporting (Form 3520, FBAR, FATCA) and the Indian paperwork still matter. This hub ties the whole picture together.",
    content: `When money or assets come to you from family in India — a cash gift from your parents, help with a US home down payment, or an inheritance of property, bank balances, gold, shares, or mutual funds — two questions get tangled together: **"will I be taxed on this?"** and **"do I have to report it?"** They are not the same question, and confusing them is where US-based Indians get into trouble. This hub walks through both sides — the **US reporting** (Form 3520, FBAR, FATCA, PFIC) and the **Indian documentation and tax** — and links to deeper guides and a free Form 3520 checker.

:::warn
title: Read this first — educational only
- This is general educational information, **not US tax, India tax, or legal advice**. The Form 3520 thresholds, PFIC rules, and Indian gift/inheritance taxability **change over time** and depend on your specific facts.
- Confirm what applies to **you** with a qualified **cross-border CPA** (US side) and a **Chartered Accountant (CA)** (India side), and verify current rules on the [IRS](https://www.irs.gov) and the [Income Tax portal](https://www.incometax.gov.in).
- This is a **reporting & documentation** guide. It does **not** compute any tax. Map your own case with the [Form 3520 India gift checker](/tools/form-3520-india-gift-checker).
:::

:::info
title: The big idea in five lines
- A **gift or inheritance** from family abroad is generally **not taxable income** to you in the US.
- But **reporting** can still apply — most importantly **Form 3520** for large foreign gifts/bequests.
- Once you **own** the asset, the **income it earns** (interest, dividends, rent, capital gains) **is** taxable and reportable.
- The **Indian accounts/assets** themselves can trigger **FBAR** and **FATCA (Form 8938)**.
- Keep the **Indian paperwork** (gift deed, will, death & legal-heir certificates, valuation, title) — both countries may want it.
:::

## 1. Tax vs reporting — the distinction that matters most
The single most important idea on this page: **a gift or inheritance is generally not income, but it can still be reportable.**

:::compare
left: Usually NOT taxable income to you
right: But reporting may still apply
✓ A cash gift from your parents in India
✓ An inheritance from a parent's estate
✓ Money gifted toward your US home down payment
✓ Inherited Indian property, FDs, gold, or shares
✗ Form 3520 for a large foreign gift / bequest
✗ FBAR / FATCA on the Indian accounts you now hold
✗ US tax on the income those assets later earn
✗ Form 8621 / PFIC if you inherit Indian mutual funds
:::

:::tip
title: Say it out loud
- "I don't pay US income tax just for **receiving** a gift or inheritance from abroad."
- "But I may have to **tell the IRS** about it, and I **do** pay tax on the **income** it earns afterward."
- Getting the first part right but missing the second is the classic, expensive mistake. **Form 3520 is an information return — penalties are for not filing, not a tax on the gift.**
:::

## 2. Cash gifts from parents in India
A cash gift from your parents is **not taxable income** to you in the US. The thing to watch is the **Form 3520 reporting threshold** for the year and the **paper trail**.

:::good
title: What to keep for a cash gift
- A simple **gift deed / gift declaration** from your parents (who, how much, when, relationship)
- The **bank wire records** on both sides (sender and receiver)
- Proof of the **source of funds** if the amount is large
- A note of the **date and USD value** for the Form 3520 test
:::

Read the deep dive: [Gift from parents in India to the USA](/india-tax-compliance/gift-from-parents-india-to-usa).

## 3. Gift for a US home down payment
Using a gift from parents toward a US down payment adds a **third party — your lender** — to the documentation. Lenders typically want a **gift letter** confirming the money is a gift (not a loan), plus a clear source-of-funds trail.

:::steps
1. **Gift letter for the lender** — states it's a gift, not a loan, with the relationship
2. **Source-of-funds trail** — where your parents' money came from
3. **Wire records** — matching the amount that lands in your account
4. **Form 3520 check** — if foreign gifts in the year cross the threshold
:::

See [gift for a US down payment](/india-tax-compliance/gift-from-parents-india-to-usa) in the gift guide.

## 4. Gift received in an Indian account vs a US account
Where the gift **lands** changes the **India-side** picture more than the US one.

:::compare
left: Received into your US account
right: Received into your Indian (NRO) account
✓ US side: gift income rules + Form 3520 test unchanged
✓ Wire is direct; one set of bank records
✗ India side: the NRO account becomes an FBAR / FATCA item
✗ Moving it to the US later needs 15CA/15CB + FEMA paperwork
:::

If the money sits in an Indian account, see the [Form 15CA / 15CB repatriation guide](/india-tax-compliance/form-15ca-15cb-nri-repatriation) for moving it to the USA, and remember the account itself feeds [FBAR / FATCA](/articles/fbar-fatca-nri-guide).

## 5. Inheritance of Indian property
Inheriting Indian property is **not taxable** to you in the US **when you inherit it** — tax enters the picture **only when you sell**, and is driven by your **cost basis** and the **capital gain**. The work up front is **documentation**.

:::good
title: Documents that establish your inheritance and basis
- **Death certificate** of the owner
- **Will / probate** or, if intestate, **succession documents**
- **Legal heir certificate** establishing you as heir
- **Property title** and the original **purchase records**
- A **valuation report** near the date of inheritance
:::

Read the deep dive: [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax). For the sale itself, see [repatriating property-sale proceeds](/india-tax-compliance/repatriating-property-sale-proceeds-india-usa) and the [India property capital-gains calculator](/calculators/india-property-capital-gains).

## 6. Inheritance of Indian bank accounts, FDs, gold, shares, mutual funds
The **receipt** of each of these is generally not taxable income to you in the US — but each one carries its own **reporting** and **future-income** consequences.

| Inherited asset | Watch on the US side |
|---|---|
| **Bank accounts / FDs** | FBAR + FATCA on the account; interest is taxable income going forward |
| **Gold** | No income until sold; keep a valuation for basis; capital gain on sale |
| **Shares (direct equities)** | Dividends + capital gains taxable; basis and holding records matter |
| **Mutual funds** | Likely **PFIC** — possible **Form 8621**; punitive default tax rules |

:::warn
title: Inherited Indian mutual funds are the trap
- Indian mutual funds are generally **PFICs** for US tax, which can mean **Form 8621** and punitive default tax treatment on gains and distributions.
- This is the one inherited asset where **getting US advice before you act** can save the most. See [inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic).
:::

## 7. The Form 3520 review threshold
**Form 3520** is the US **information return** for, among other things, large gifts and bequests received from foreign persons. It is **not a tax** — it's a disclosure. The thresholds depend on **who** the giver is.

:::info
title: Two different thresholds — confirm the current figures
- **From a nonresident alien individual or a foreign estate:** report on Form 3520 when the **total** such gifts/bequests in the year exceed **US $100,000**.
- **From a foreign corporation or foreign partnership:** a **separate, much lower** threshold that the IRS **adjusts annually for inflation** (in the high-five-figures range) — verify the **current-year** figure on [irs.gov](https://www.irs.gov).
- The $100,000 test is on the **aggregate** for the year, and related donors can be combined. Gifts from your **parents** are the nonresident-alien-individual case.
:::

:::warn
title: Why people care about Form 3520
- The penalties for **not filing** (or filing late) can be steep — a percentage of the gift — even though **no tax** is due on the gift itself.
- It is filed **separately** from your Form 1040 and has its **own deadline** (generally the same as your return, including extensions). Confirm the mechanics with your CPA.
:::

Deep dive + a printable list: [Form 3520 Indian gift & inheritance checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist).

## 8. Indian documentation to collect
Both countries can ask for proof. Gather the relevant subset early — chasing Indian documents from the US after the fact is painful.

:::steps
1. **Gift deed** — for a gift: who gave what, when, and the relationship
2. **Will / probate / succession documents** — for an inheritance
3. **Death certificate** — of the person you inherited from
4. **Legal heir certificate** — establishing you as a lawful heir
5. **Valuation report** — value near the date of gift / inheritance (for basis)
6. **Property title** — clear title and the chain of ownership
7. **Bank statements** — showing the credits, FDs, and the source of funds
:::

## 9. US reporting questions to work through
:::info
title: For your US CPA
- **Form 3520** — did my foreign gifts/bequests this year cross the threshold for my type of donor?
- **FBAR (FinCEN 114)** — do my Indian accounts (including inherited ones) cross the aggregate threshold?
- **Form 8938 (FATCA)** — do my specified foreign assets cross the (higher, residency-based) threshold?
- **Form 8621 / PFIC** — did I inherit Indian **mutual funds**, and how should they be handled?
- **Income after inheritance** — interest, dividends, rent, and capital gains are taxable and reportable going forward.
:::

See [FBAR & FATCA for NRIs](/articles/fbar-fatca-nri-guide), the [FBAR/FATCA checker](/tools/fbar-fatca-checker), and [PFIC & Indian mutual funds](/articles/pfic-indian-mutual-funds-trap).

## 10. India-side questions to work through
:::info
title: For your CA in India
- **Taxability** — is this gift/inheritance taxable in India (gifts from specified relatives like parents are generally exempt)?
- **Capital-gains basis** — what cost and holding period carry over when I eventually **sell** the inherited asset?
- **Repatriation documents** — what do I need to move the money to the US (15CA/15CB, source proof)?
- **Form 15CA / 15CB** — does my remittance need them, and which part?
:::

See the [Form 15CA / 15CB & repatriation cluster](/india-tax-compliance/form-15ca-15cb-nri-repatriation) and [Form 15CA / 15CB checklist](/tools/form-15ca-15cb-checklist).

## 11. Questions to ask your CPA / CA
:::good
title: Bring these to the table
- Did my foreign gifts/bequests this year trigger **Form 3520** — and what's the deadline?
- Do the inherited or gifted **accounts** push me over **FBAR** or **FATCA** thresholds?
- Are any inherited holdings **PFICs** (Indian mutual funds), and what's the cleanest treatment?
- What is my **cost basis** in inherited property / shares / gold for an eventual sale?
- Is the gift/inheritance **exempt in India**, and what paperwork proves it?
- What's the **repatriation** route and documentation to bring the money to the US?
:::

:::cta
title: Map your own situation in two minutes
body: Answer a few questions — who gave it, what it was, how much, and where it landed — and get a Form 3520 / FBAR / PFIC review flag, the documents to collect, and questions for your CPA and CA.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

- **Go deeper:** [Gift from parents in India to USA](/india-tax-compliance/gift-from-parents-india-to-usa) · [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax) · [Inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic) · [Form 3520 checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist)
- **Related guides:** [Gifting money to/from India](/articles/gifting-money-india-tax-implications) · [Inheriting Indian assets & US tax](/articles/inheriting-indian-assets-us-tax) · [FBAR / FATCA](/articles/fbar-fatca-nri-guide) · [PFIC & Indian mutual funds](/articles/pfic-indian-mutual-funds-trap)
- **Tools:** [Form 3520 gift checker](/tools/form-3520-india-gift-checker) · [FBAR / FATCA checker](/tools/fbar-fatca-checker) · [15CA / 15CB checklist](/tools/form-15ca-15cb-checklist)

## Frequently asked questions

### Is a gift from my parents in India taxable in the US?
No. A gift from your parents is not taxable income to you in the US. However, if your total gifts and bequests from foreign individuals or estates in the year exceed $100,000, you generally must report them on Form 3520 — a disclosure, not a tax. Confirm the current rules with a cross-border CPA.

### Do I pay US tax on an inheritance from India?
Receiving the inheritance is generally not taxable income to you in the US. Tax enters later, on the income the inherited assets earn (interest, dividends, rent) and on the capital gain when you sell. Large bequests from a foreign individual or estate over $100,000 must be reported on Form 3520.

### What is the Form 3520 threshold for gifts from parents?
Gifts and bequests from a nonresident alien individual or a foreign estate are reported on Form 3520 when the year's total exceeds US $100,000. Gifts from a foreign corporation or partnership use a separate, much lower threshold that the IRS adjusts annually — verify the current figure on irs.gov.

### Do inherited Indian bank accounts and mutual funds need FBAR or FATCA reporting?
Yes, potentially. Inherited Indian bank accounts and FDs count toward your FBAR and FATCA (Form 8938) thresholds once you own them. Inherited Indian mutual funds are generally PFICs and may require Form 8621 with punitive default tax rules. Get cross-border advice before acting.

### Is Form 3520 a tax on the gift?
No. Form 3520 is an information return — a disclosure. There is generally no US tax on receiving a foreign gift or inheritance. The risk is the penalty for failing to file or filing late, which can be a percentage of the unreported amount, so the filing itself is what matters.`,
  },

  /* --------------------- GIFT FROM PARENTS ---------------------- */
  {
    slug: "gift-from-parents-india-to-usa",
    kind: "support",
    title: "Gift from Parents in India to the USA: Tax, Form 3520 & Documents",
    seoTitle:
      "Gift from Parents in India to the USA: Tax, Form 3520 & Documents",
    metaDescription:
      "A cash gift from your parents in India isn't taxable income in the US — but Form 3520 reporting and a clean paper trail can still apply. Here's what to do.",
    navLabel: "Gift from parents to USA",
    icon: "💸",
    accent: "from-rose-500 to-pink-600",
    date: "2026-06-22",
    excerpt:
      "A cash gift from your parents — including money toward a US down payment — is generally not taxable income to you in the US. The things that matter are the Form 3520 threshold, where the money lands, and the paper trail.",
    content: `Your parents in India want to send you money — to help with a house, a wedding, a business, or just to share what they've built. The good news: **a gift from your parents is not taxable income to you in the US.** The work is in the **reporting** (Form 3520, if you cross the threshold) and the **documentation**, especially if the money touches a US mortgage or an Indian account.

:::warn
title: Educational only — confirm with CPA / CA
- This is general information, **not US or India tax advice**. The Form 3520 threshold and India's gift rules **change** and depend on your facts.
- Confirm with a **cross-border CPA** and a **CA**, and verify on the [IRS](https://www.irs.gov) and the [Income Tax portal](https://www.incometax.gov.in).
:::

:::info
title: The short version
- A gift from your parents is **not income** to you in the US.
- Report on **Form 3520** if your year's foreign gifts/bequests from individuals/estates exceed **$100,000**.
- In **India**, gifts from **specified relatives** (parents included) are generally **exempt** from gift tax.
- Keep a **gift deed**, **wire records**, and **source-of-funds** proof.
:::

## Is it taxable? (US and India)
:::compare
left: US side
right: India side
✓ Not taxable income to you for receiving it
✓ Gifts from parents (specified relatives) generally exempt
✗ Form 3520 if year's foreign gifts > $100,000
✗ Income the money later earns is taxable in both systems
:::

## The Form 3520 threshold
If your **total** gifts and bequests from foreign **individuals or estates** in the year exceed **US $100,000**, you generally report them on **Form 3520**. It's a **disclosure, not a tax** — but the penalty for missing it can be significant.

:::tip
title: Aggregate, not per-wire
- The $100,000 test is on the **total** for the year, and **related donors** (e.g. both parents) can be **combined**.
- Splitting one gift into several wires does **not** avoid the test.
- Gifts from a foreign **company/partnership** use a **separate, lower, annually-indexed** threshold — confirm the current figure.
:::

## Gift for a US home down payment
When the gift funds a US down payment, your **lender** joins the paperwork. They want to know the money is a **gift, not a loan**, and to see where it came from.

:::steps
1. **Lender gift letter** — confirms it's a gift, names the donor and relationship
2. **Source-of-funds trail** — your parents' bank records showing where the money came from
3. **Matching wire records** — the amount that lands in your account
4. **Form 3520 check** — if foreign gifts in the year cross the threshold
:::

## Gift received in India vs the USA
:::compare
left: Into your US account
right: Into your Indian (NRO) account
✓ Direct; one set of bank records
✓ US gift rules + Form 3520 test unchanged
✗ The NRO account is now an FBAR / FATCA item
✗ Moving it to the US later needs 15CA/15CB + FEMA paperwork
:::

If it lands in India, see the [Form 15CA / 15CB repatriation guide](/india-tax-compliance/form-15ca-15cb-nri-repatriation).

## Documents to keep
:::good
title: Your gift file
- A **gift deed / declaration** from your parents (who, how much, when, relationship)
- **Bank wire records** on both the sending and receiving side
- **Source-of-funds** proof for larger amounts
- The **date and USD value** of each gift (for the Form 3520 test)
- A **lender gift letter**, if it funds a US purchase
:::

## Questions to ask
:::info
title: For your CPA and CA
- Did my **year's foreign gifts** cross the **Form 3520** threshold for my donor type?
- If the gift landed in **India**, does that account trigger **FBAR / FATCA**?
- Is the gift **exempt in India**, and what proof should my parents keep?
- If it's for a **US home**, what does the lender need beyond a gift letter?
:::

:::cta
title: Check whether your gift needs Form 3520
body: Answer a few questions about who gave it, how much, and where it landed — and get a Form 3520 / FBAR review flag plus a document list.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

- **Back to the hub:** [Money from parents: gifts, inheritance & Form 3520](/india-tax-compliance/foreign-gifts-inheritance-form-3520-india)
- **Siblings:** [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax) · [Inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic) · [Form 3520 checklist](/india-tax-compliance/form-3520-indian-gift-inheritance-checklist)
- **Related:** [Gifting money to/from India](/articles/gifting-money-india-tax-implications) · [TCS on remittances](/articles/tcs-india-remittance-tax) · [FBAR / FATCA](/articles/fbar-fatca-nri-guide)

## Frequently asked questions

### Do I pay US tax on a gift from my parents in India?
No. A gift from your parents is not taxable income to you in the US. If your total gifts and bequests from foreign individuals or estates in the year exceed $100,000, you report them on Form 3520 — a disclosure, not a tax. Confirm the current threshold with a CPA.

### Does it matter if my parents send the gift in several smaller transfers?
No. The Form 3520 test is on the year's aggregate, and gifts from related donors such as both parents can be combined. Splitting a gift into multiple wires does not avoid the reporting requirement if the total still exceeds the threshold.

### Can my parents gift me money for a US house down payment?
Yes. The gift is not taxable income to you, but your lender will want a gift letter confirming it's a gift, not a loan, plus a source-of-funds trail. If foreign gifts in the year exceed $100,000, Form 3520 also applies.

### Is a gift from parents taxable in India?
Generally no. Gifts from specified relatives, which include parents, are generally exempt from Indian gift tax. Keep a gift deed and the parents' source-of-funds records. Confirm the current rules and any documentation with a CA.`,
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
    title: "Form 3520 for Indian Gifts & Inheritance: A Checklist for US NRIs",
    seoTitle: "Form 3520 Checklist for Indian Gifts & Inheritance (US NRIs)",
    metaDescription:
      "A plain-English Form 3520 checklist for US NRIs: when a gift or inheritance from India must be reported, the thresholds, documents, deadlines, and CPA questions.",
    navLabel: "Form 3520 checklist",
    icon: "🧾",
    accent: "from-sky-500 to-blue-600",
    date: "2026-06-22",
    excerpt:
      "When does a gift or inheritance from India have to go on Form 3520? This is the plain-English checklist — the two thresholds, what counts, the documents to keep, deadlines, and what to ask your CPA.",
    content: `**Form 3520** is the US information return for, among other things, **large gifts and bequests from foreign persons.** For US-based Indians, it's the form that decides whether a gift from your parents or an inheritance from India has to be **disclosed** to the IRS. It is **not a tax** on the gift — but the **penalty for not filing** can be steep. This is the plain-English checklist.

:::warn
title: Educational only — confirm with a CPA
- This is general information, **not US tax advice**. The Form 3520 thresholds, mechanics, and deadlines **change** and depend on your facts.
- Confirm with a **cross-border CPA**, and verify on the [IRS](https://www.irs.gov).
:::

:::info
title: The two thresholds (confirm the current figures)
- **Gifts/bequests from a nonresident alien individual or a foreign estate** — report when the **year's total** exceeds **US $100,000**. (Your **parents** are this case.)
- **Gifts from a foreign corporation or partnership** — a **separate, much lower** threshold the IRS **adjusts annually for inflation** (high five figures). Verify the **current-year** figure on irs.gov.
- The tests are on the **aggregate** for the year; **related donors** can be combined.
:::

## Do you need to file? — quick checklist
:::good
title: You likely need to look at Form 3520 if…
- You received **gifts/bequests from foreign individuals or estates** totalling **over $100,000** this year
- You received a **gift from a foreign company/partnership** over the **annually-indexed** lower threshold
- You received a **large inheritance** from a parent's estate in India
- Multiple **related donors** (e.g. both parents) together cross the line
:::

:::bad
title: It's usually NOT about…
- A **tax** on the gift — Form 3520 is a **disclosure**, not a tax
- **Small** gifts comfortably under the thresholds
- The **income** the gift later earns — that's ordinary income reporting, separate from 3520
:::

## Documents to keep
:::steps
1. **Gift deed / declaration** or **will / probate / succession** documents
2. **Death certificate** and **legal heir certificate** (for an inheritance)
3. **Bank wire records** on both sides, with dates
4. **USD value and date** of each gift/bequest (for the threshold test)
5. **Valuation report** for non-cash assets (property, gold, shares)
6. **Donor details** — name, relationship, and (for entities) the type of entity
:::

## Deadlines and mechanics
:::tip
title: How it's filed
- Form 3520 is filed **separately** from your Form 1040 and generally has the **same due date** as your return, **including extensions**.
- A **late or missing** Form 3520 is where the penalties bite — even with **no tax** due on the gift.
- Get the **mechanics and any catch-up options** from your CPA if you've missed a prior year.
:::

## Questions to ask your CPA
:::info
title: Bring these to your CPA
- Did my **year's foreign gifts/bequests** cross the threshold for my **donor type**?
- Do I need to **combine related donors** (e.g. both parents)?
- What's the **deadline**, and does my **extension** cover Form 3520?
- If I **missed a prior year**, what's the cleanest way to catch up?
- What **documentation** should I keep on file to support the filing?
:::

:::cta
title: See if your gift or inheritance is in scope
body: Answer a few questions — donor type, value, asset type, and where it landed — and get a Form 3520 review flag plus the documents to collect.
button: Open the Form 3520 India gift checker
href: /tools/form-3520-india-gift-checker
:::

- **Back to the hub:** [Money from parents: gifts, inheritance & Form 3520](/india-tax-compliance/foreign-gifts-inheritance-form-3520-india)
- **Siblings:** [Gift from parents to USA](/india-tax-compliance/gift-from-parents-india-to-usa) · [Inherited Indian property & US tax](/india-tax-compliance/inherited-indian-property-us-tax) · [Inherited Indian mutual funds & PFIC](/india-tax-compliance/inherited-indian-mutual-funds-pfic)
- **Related:** [Gifting money to/from India](/articles/gifting-money-india-tax-implications) · [Inheriting Indian assets & US tax](/articles/inheriting-indian-assets-us-tax) · [NRI Tax Forms & Limits Center](/india-tax-compliance/nri-tax-forms-limits)

## Frequently asked questions

### When do I have to file Form 3520 for a gift from India?
You generally file when your year's total gifts and bequests from foreign individuals or estates exceed US $100,000, or when a gift from a foreign corporation or partnership exceeds the separate, annually-indexed lower threshold. The tests are on the aggregate, and related donors can be combined.

### Is there a tax due with Form 3520?
No. For reporting a foreign gift or inheritance, Form 3520 is an information return — a disclosure, not a tax. The financial risk is the penalty for failing to file or filing late, which can be a percentage of the unreported amount.

### When is Form 3520 due?
It is generally due at the same time as your income-tax return, including extensions, but filed separately. Confirm the exact mechanics and whether your extension covers it with a cross-border CPA.

### What if I missed filing Form 3520 in a past year?
There may be ways to catch up, and reasonable-cause relief can apply in some situations. Because penalties can be significant, don't guess — speak with a cross-border CPA about the cleanest path for your facts.`,
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
