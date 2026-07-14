/**
 * Content data for the India Investments pillar page:
 *   /india-investments/should-nris-keep-investments-in-india
 *
 * ─────────────────────────── EDITORIAL RULES (YMYL) ───────────────────────────
 * This is a Your-Money-Your-Life topic. When editing anything here:
 *  1. EDUCATE, never advise. No "you should sell / keep / buy" statements.
 *  2. Every tax figure is an ILLUSTRATION as of 2026 that changes with law,
 *     income level, treaty position, and individual facts. Always pair a number
 *     with "verify current rules / consult a qualified professional."
 *  3. Distinguish TDS (tax withheld at source) from the FINAL tax liability.
 *     They are often different, and refunds or credits may apply.
 *  4. Never imply the DTAA or a foreign tax credit is automatic — it depends on
 *     paperwork (TRC, Form 10F, Form 1116) and facts.
 *  5. Prefer ranges and "generally / commonly / may" over absolutes.
 *
 * Table cell values are plain strings so the shared DataTable / ComparisonTable
 * components (src/components/tools/TrumpAccountUI.tsx) can render them and reflow
 * to cards on mobile. Rich prose with links lives in the page.tsx itself.
 */
import type {
  DataCol,
  DataRow,
  ComparisonColumn,
  ComparisonRow,
} from "@/data/trumpAccountData";
import type { Scenario, FlowNode, QuickQA } from "@/components/tools/TrumpAccountUI";
import type { FaqItem } from "@/lib/seo";

/* ------------------------------------------------------------------ *
 * Disclaimers
 * ------------------------------------------------------------------ */
export const II_SHORT_DISCLAIMER =
  "Educational only — not legal, tax, or investment advice. Tax rules change and depend on your personal facts.";

export const II_DISCLAIMER =
  "This guide is educational and general in nature. It is not legal, tax, immigration, or investment advice, and it does not create a professional relationship. Cross-border tax rules for NRIs change frequently and depend heavily on your residency status, income level, the type of account, the year you invested, and the India–US tax treaty position you can support with documentation. Figures are illustrations as of 2026, not promises. Before acting on anything here, verify the current rules with official sources and consider working with a qualified cross-border tax professional and, where relevant, a fiduciary financial adviser.";

export const II_DATA_NOTE =
  "Tax rates, thresholds, exemptions, TDS percentages, and treaty positions in this guide reflect widely published rules as of 2026 and are shown to illustrate how the decision works — not to state your exact liability. India revised several capital-gains rules in 2024, and both countries adjust thresholds regularly. Confirm the current figures for your situation before you file or transact.";

/* ------------------------------------------------------------------ *
 * Quick answer (top of page) supporting bullets
 * ------------------------------------------------------------------ */
export const quickAnswerBullets: string[] = [
  "Keeping or moving investments is rarely all-or-nothing — most NRIs keep some assets in India and shift others.",
  "US persons are taxed on worldwide income, so India income keeps showing up on your US return even if you never bring the money over.",
  "Indian mutual funds are the biggest US-tax headache (PFIC rules); NRE deposits and Indian stocks are usually simpler to hold.",
  "If you may return to India, the maths changes — the RNOR window and rupee-denominated goals can favour keeping India assets.",
];

/* ------------------------------------------------------------------ *
 * Key takeaways (10)
 * ------------------------------------------------------------------ */
export const keyTakeaways: string[] = [
  "There is no single right answer. The decision depends on the asset type, your US tax situation, whether you plan to return to India, currency exposure, liquidity needs, and your goals.",
  "Becoming an NRI changes the rules automatically. Your resident bank and demat accounts, mutual funds, and tax status must be updated — leaving them as-is is itself a decision, and usually the wrong one.",
  "As a US person you are taxed on worldwide income. Interest, dividends, and capital gains from India go on your US return whether or not you repatriate the money.",
  "TDS is not your final tax bill. India often withholds tax at a flat rate; your actual liability can be lower, and refunds or treaty relief may apply if you file correctly.",
  "The DTAA and the US foreign tax credit exist to prevent double taxation — but they are not automatic. They require the right paperwork (TRC, Form 10F, Form 1116) and still depend on your facts.",
  "Indian mutual funds are usually PFICs for US tax purposes. That means Form 8621 and a punitive default tax regime, which is why many NRIs reconsider holding them.",
  "NRE interest is tax-free in India but fully taxable in the US. NRO interest is taxable in both — with a US foreign tax credit for the Indian tax.",
  "Currency matters as much as tax. Measured in dollars, rupee assets carry exchange-rate risk that can quietly erode India returns over long horizons.",
  "Reporting is mandatory, not optional. FBAR (FinCEN 114) and FATCA (Form 8938) cover Indian accounts, and penalties for missing them are severe.",
  "Plans change decisions. If you might move back to India, the RNOR period and rupee-denominated goals can make keeping India assets more attractive than the tax view alone suggests.",
];

/* ------------------------------------------------------------------ *
 * Big comparison: Resident vs NRI (how the same asset is treated)
 * ------------------------------------------------------------------ */
export const residentVsNriCols: ComparisonColumn[] = [
  { key: "resident", label: "As a resident in India" },
  { key: "nri", label: "As an NRI / US person", highlight: true },
];

export const residentVsNriRows: ComparisonRow[] = [
  {
    feature: "Bank accounts",
    values: {
      resident: "Ordinary savings / current accounts.",
      nri: "Resident accounts must be re-designated to NRO; new NRE/FCNR accounts allowed under FEMA.",
    },
  },
  {
    feature: "Dividend tax (India)",
    values: {
      resident: "Taxed at your slab; no TDS below thresholds in many cases.",
      nri: "TDS commonly ~20% + surcharge/cess; treaty rate may be claimed with a TRC + Form 10F.",
    },
  },
  {
    feature: "Equity capital gains (India)",
    values: {
      resident: "LTCG ~12.5% above ₹1.25L/yr; STCG ~20% (2026 rules).",
      nri: "Same rates, but TDS is deducted before you receive the money; refund via ITR if over-withheld.",
    },
  },
  {
    feature: "FD / NRO interest",
    values: {
      resident: "Taxed at slab; ~10% TDS with PAN.",
      nri: "NRO interest TDS ~30% + surcharge/cess; NRE/FCNR interest is India-tax-free.",
    },
  },
  {
    feature: "Mutual funds",
    values: {
      resident: "Simple — taxed only in India.",
      nri: "Usually PFICs for US tax → Form 8621 and a punitive default regime.",
    },
  },
  {
    feature: "Where you are taxed",
    values: {
      resident: "India only.",
      nri: "Worldwide — India income also goes on your US return, with a foreign tax credit for Indian tax.",
    },
  },
  {
    feature: "FBAR (FinCEN 114)",
    values: {
      resident: "Not applicable.",
      nri: "Required if all foreign accounts together exceed $10,000 at any point in the year.",
    },
  },
  {
    feature: "FATCA (Form 8938)",
    values: {
      resident: "Not applicable.",
      nri: "Required above threshold amounts that depend on filing status and where you live.",
    },
  },
  {
    feature: "Currency risk",
    values: {
      resident: "None — you earn and spend in rupees.",
      nri: "Real — returns measured in dollars fall if the rupee weakens.",
    },
  },
  {
    feature: "Repatriation",
    values: {
      resident: "Not relevant.",
      nri: "NRE/FCNR freely repatriable; NRO up to ~US$1M/year with 15CA/15CB paperwork.",
    },
  },
  {
    feature: "Estate planning",
    values: {
      resident: "India has no estate/inheritance tax today.",
      nri: "US estate tax can apply to US-situs assets; cross-border wills and nominations need care.",
    },
  },
  {
    feature: "Tax filing",
    values: {
      resident: "One ITR in India.",
      nri: "Possibly an India ITR plus a US return (1040) — and the forms have to agree.",
    },
  },
];

/* ------------------------------------------------------------------ *
 * NRE vs NRO comparison
 * ------------------------------------------------------------------ */
export const nreVsNroCols: ComparisonColumn[] = [
  { key: "nre", label: "NRE account", highlight: true },
  { key: "nro", label: "NRO account" },
];

export const nreVsNroRows: ComparisonRow[] = [
  {
    feature: "What it holds",
    values: {
      nre: "Foreign earnings you bring into India, converted to rupees.",
      nro: "India-sourced income — rent, dividends, pension, pre-existing balances.",
    },
  },
  {
    feature: "India tax on interest",
    values: {
      nre: "Exempt while you qualify as a person resident outside India.",
      nro: "Fully taxable; TDS commonly ~30% + surcharge/cess.",
    },
  },
  {
    feature: "US tax on interest",
    values: {
      nre: "Fully taxable — 'India-tax-free' does not mean US-tax-free.",
      nro: "Fully taxable, with a foreign tax credit for the Indian tax withheld.",
    },
  },
  {
    feature: "Repatriation",
    values: {
      nre: "Principal and interest freely repatriable.",
      nro: "Up to about US$1 million per financial year with Form 15CA/15CB.",
    },
  },
  {
    feature: "Currency held",
    values: {
      nre: "Rupees (FCNR holds foreign currency instead).",
      nro: "Rupees.",
    },
  },
  {
    feature: "Typical use",
    values: {
      nre: "Parking US savings in India, repatriable deposits, rupee goals.",
      nro: "Collecting Indian rent/dividends/pension and paying India expenses.",
    },
  },
];

/* ------------------------------------------------------------------ *
 * Dividend tax — TDS vs final liability walk-through
 * ------------------------------------------------------------------ */
export const dividendStepCols: DataCol[] = [
  { key: "step", label: "Stage" },
  { key: "what", label: "What actually happens", highlight: true },
];

export const dividendStepRows: DataRow[] = [
  {
    step: "1. Company pays dividend",
    what: "Since FY2020-21, dividends are taxable in your hands (no dividend distribution tax). For NRIs the company withholds TDS before paying you.",
  },
  {
    step: "2. TDS is withheld",
    what: "TDS on NRI dividends is commonly ~20% plus surcharge and cess under domestic law (Section 195).",
  },
  {
    step: "3. Treaty (DTAA) rate",
    what: "The India–US treaty caps dividend tax (commonly cited as 25%, or 15% for some corporate holders). You claim the lower rate by giving the payer a Tax Residency Certificate and Form 10F — it is not applied automatically.",
  },
  {
    step: "4. File India ITR",
    what: "If too much was withheld relative to your actual India liability, filing an Indian return can recover the excess as a refund.",
  },
  {
    step: "5. Report on US return",
    what: "The dividend is US-taxable as worldwide income. A foreign tax credit (Form 1116) generally offsets the Indian tax so you are not taxed twice — subject to limits.",
  },
];

/* ------------------------------------------------------------------ *
 * Capital gains matrix
 * ------------------------------------------------------------------ */
export const capitalGainsCols: DataCol[] = [
  { key: "asset", label: "Asset" },
  { key: "india", label: "India treatment (2026, illustrative)", highlight: true },
  { key: "us", label: "US treatment" },
];

export const capitalGainsRows: DataRow[] = [
  {
    asset: "Listed equity & equity mutual funds",
    india: "LTCG (held >12 months) ~12.5% on gains above ₹1.25L/yr; STCG ~20%. NRIs face TDS on redemptions.",
    us: "Capital gain on your 1040; equity funds also raise PFIC issues (Form 8621).",
  },
  {
    asset: "Debt mutual funds (bought on/after 1 Apr 2023)",
    india: "Gains taxed at your slab rate regardless of holding period — the old indexation/LTCG benefit was removed.",
    us: "Capital gain / ordinary income; PFIC rules also apply.",
  },
  {
    asset: "Unlisted shares / other securities",
    india: "Different holding periods and rates apply; often higher. Check the specific asset.",
    us: "Capital gain on your 1040; possible PFIC/other regimes.",
  },
  {
    asset: "Real estate",
    india: "LTCG after 24 months (2026 rules changed indexation); buyer must deduct TDS on an NRI seller — often over-withheld.",
    us: "Capital gain on your 1040; foreign tax credit for Indian tax; currency affects the USD gain.",
  },
  {
    asset: "Gold / jewellery",
    india: "Physical gold and gold funds have their own holding-period rules; SGBs have specific treatment.",
    us: "Capital gain (collectibles rules can apply to physical gold); funds may be PFICs.",
  },
];

/* ------------------------------------------------------------------ *
 * Instrument-by-instrument comparison
 * ------------------------------------------------------------------ */
export const instrumentCols: DataCol[] = [
  { key: "instrument", label: "Instrument" },
  { key: "hold", label: "Simple to hold as an NRI?", highlight: true },
  { key: "friction", label: "Main US-tax friction" },
  { key: "note", label: "What to weigh" },
];

export const instrumentRows: DataRow[] = [
  {
    instrument: "Indian stocks (direct)",
    hold: "Usually yes — via an NRI demat/PIS or repatriable account.",
    friction: "Dividends and gains are US-taxable; no PFIC issue for direct shares.",
    note: "Simpler than funds; still need US reporting and currency view.",
  },
  {
    instrument: "Indian equity mutual funds",
    hold: "Complicated for US persons.",
    friction: "Almost always PFICs → Form 8621, punitive default tax.",
    note: "The single biggest reason NRIs restructure their India portfolio.",
  },
  {
    instrument: "Indian debt mutual funds",
    hold: "Complicated.",
    friction: "PFIC, plus post-2023 slab-rate taxation in India.",
    note: "Often the least tax-efficient India holding for a US person.",
  },
  {
    instrument: "NRO fixed deposit",
    hold: "Yes.",
    friction: "Interest taxable in India (~30% TDS) and in the US.",
    note: "Simple but heavily taxed; refund possible if over-withheld.",
  },
  {
    instrument: "NRE / FCNR fixed deposit",
    hold: "Yes.",
    friction: "India-tax-free, but fully US-taxable and repatriable.",
    note: "Popular for rupee/dollar parking; compare after-US-tax yield to US options.",
  },
  {
    instrument: "US index funds / ETFs",
    hold: "Yes — and no PFIC problem.",
    friction: "Ordinary US taxation; may be India-taxable if you return.",
    note: "Often simpler for a long-term US resident than Indian funds.",
  },
  {
    instrument: "US Treasuries / HYSA",
    hold: "Yes.",
    friction: "Ordinary US income; state-tax treatment varies.",
    note: "Dollar-denominated, no currency risk, very liquid.",
  },
  {
    instrument: "Indian real estate",
    hold: "Yes, but illiquid.",
    friction: "US-taxable gains; TDS and 15CA/15CB on sale; currency risk.",
    note: "Emotional and practical value vs. concentration and hassle on exit.",
  },
  {
    instrument: "NPS (India)",
    hold: "NRIs can often continue contributing.",
    friction: "US tax treatment is uncertain and may not be treaty-protected.",
    note: "Attractive if you may retire in India; get advice on US reporting.",
  },
  {
    instrument: "PPF",
    hold: "You cannot open new PPF as an NRI; existing accounts run to maturity.",
    friction: "India-tax-free, but the US may tax the annual growth; possible foreign-trust reporting debate.",
    note: "'Tax-free' in India is not tax-free in the US.",
  },
  {
    instrument: "Gold / Sovereign Gold Bonds",
    hold: "Physical gold yes; SGBs have residency nuances.",
    friction: "US-taxable; funds may be PFICs.",
    note: "Diversifier; weigh storage, liquidity, and reporting.",
  },
];

/* ------------------------------------------------------------------ *
 * Decision matrices
 * ------------------------------------------------------------------ */
export const moveToUsCols: DataCol[] = [
  { key: "situation", label: "This tends to favour moving to the US" },
  { key: "why", label: "Why", highlight: true },
];

export const moveToUsRows: DataRow[] = [
  { situation: "You hold Indian mutual funds as a US person", why: "PFIC rules make them costly and complex to report; US funds avoid that entirely." },
  { situation: "You are settled in the US long-term with US-dollar goals", why: "Retirement, home, and children's costs are in dollars; dollar assets match the liability." },
  { situation: "You want simplicity and fewer forms", why: "Consolidating in the US removes FBAR/FATCA/PFIC complexity on new money." },
  { situation: "You are in a high US bracket and India over-withholds", why: "Chasing India refunds and treaty relief every year has a real time cost." },
  { situation: "You have no plans to return to India", why: "Rupee-denominated goals are limited, so currency risk mostly works against you." },
];

export const keepInIndiaCols: DataCol[] = [
  { key: "situation", label: "This tends to favour keeping assets in India" },
  { key: "why", label: "Why", highlight: true },
];

export const keepInIndiaRows: DataRow[] = [
  { situation: "You may return to India", why: "Future expenses will be in rupees; India assets and the RNOR window can work in your favour." },
  { situation: "You support family or own a home in India", why: "You need rupee cash flow and local assets; NRO/NRE accounts serve that directly." },
  { situation: "You hold direct Indian stocks or NRE/FCNR deposits", why: "These are comparatively simple to hold and report as a US person." },
  { situation: "You have illiquid or emotionally significant assets", why: "Ancestral property or long-held holdings may not be worth force-selling for tax reasons alone." },
  { situation: "Selling now triggers a large avoidable tax event", why: "Timing a sale across low-income years or a residency change can matter more than acting immediately." },
];

/* ------------------------------------------------------------------ *
 * Main decision tree (vertical flow)
 * ------------------------------------------------------------------ */
export const decisionFlowNodes: FlowNode[] = [
  { text: "Should I keep this investment in India?", kind: "start" },
  { text: "Is it an Indian mutual fund / ULIP / pooled fund?", kind: "decision", branch: "Start here, per asset" },
  { text: "If yes: it is likely a PFIC. Weigh the reporting cost and whether to unwind it deliberately (with advice) vs. keep it.", kind: "action", branch: "Mutual fund" },
  { text: "Do you plan to return to India within a few years?", kind: "decision", branch: "Not a fund" },
  { text: "If you may return: rupee goals and the RNOR window can favour keeping India assets — plan the transition.", kind: "action", branch: "Might return" },
  { text: "Do you need this money in US dollars for US goals soon?", kind: "decision", branch: "Staying in US" },
  { text: "If yes: currency risk and liquidity may favour US-dollar assets — plan repatriation and paperwork.", kind: "action", branch: "Need USD" },
  { text: "Is it simple to hold and report (direct stock, NRE/FCNR deposit)?", kind: "decision", branch: "No near-term USD need" },
  { text: "Keeping it can be reasonable — just handle FBAR/FATCA and the US tax on the income each year.", kind: "end", branch: "Simple to hold" },
  { text: "Whatever the branch: model the after-tax, after-currency result and get cross-border advice before large moves.", kind: "end" },
];

/* ------------------------------------------------------------------ *
 * Case studies (educational, illustrative — not real people)
 * ------------------------------------------------------------------ */
export const caseStudies: Scenario[] = [
  {
    label: "Software engineer on H-1B, staying in the US",
    situation: "Has Indian equity mutual funds and an NRE FD from before moving. Long-term goals are all in dollars.",
    verdict: "Often simplifies",
    verdictTone: "review",
    detail: "The mutual funds create PFIC reporting every year. Many in this position unwind Indian funds deliberately (with advice) and keep the simpler NRE deposit, while building new investments in US index funds. Timing of any fund sale and the currency matter.",
  },
  {
    label: "Physician, green card, parents in India",
    situation: "Owns an apartment in India used by parents, plus an NRO account collecting rent.",
    verdict: "Often keeps",
    verdictTone: "good",
    detail: "The property serves a real family purpose and forcing a sale for tax reasons alone rarely makes sense. The focus is usually clean NRO reporting, TDS refunds where over-withheld, and a US foreign tax credit for Indian tax — not liquidation.",
  },
  {
    label: "Couple planning to return to India in 3–4 years",
    situation: "Have Indian stocks, an NRE deposit, and US 401(k)s. Future spending will be in rupees.",
    verdict: "Often keeps",
    verdictTone: "good",
    detail: "Rupee-denominated goals reduce the currency argument for moving money out. The RNOR period after returning can shelter foreign income for a while. Planning the residency transition and account changes is usually more valuable than acting now.",
  },
  {
    label: "Retired parents gifting to a US-citizen child",
    situation: "Parents in India want to help a child in the US with a home purchase.",
    verdict: "Depends on facts",
    verdictTone: "review",
    detail: "Gifts from non-US parents are generally not US-taxable to the child, but large foreign gifts trigger US reporting (Form 3520). India-side gift and remittance rules and TCS also apply. This is about paperwork and thresholds, not a keep/sell question.",
  },
  {
    label: "Dividend investor with a large Indian stock portfolio",
    situation: "Holds direct shares paying meaningful dividends; is in a high US bracket.",
    verdict: "Manageable",
    verdictTone: "review",
    detail: "Direct shares avoid PFIC. The work is claiming the DTAA rate (TRC + Form 10F), recovering excess TDS, and taking a US foreign tax credit. Whether to keep or diversify is a portfolio-concentration and currency question more than a pure tax one.",
  },
  {
    label: "NRI with Indian mutual funds bought years ago",
    situation: "Discovers the funds are PFICs after several years in the US and no Form 8621 was filed.",
    verdict: "Get advice fast",
    verdictTone: "bad",
    detail: "Past-year PFIC non-compliance is a specialist area. The priority is correcting reporting properly (possibly amended returns) rather than making a hasty sale that could worsen the tax outcome.",
  },
  {
    label: "Rental-income owner repatriating a sale",
    situation: "Sells an Indian flat and wants to bring proceeds to the US.",
    verdict: "Plan the exit",
    verdictTone: "review",
    detail: "Buyer TDS on an NRI seller is frequently over-withheld; a lower-deduction certificate or an ITR refund can help. Repatriation needs 15CA/15CB, and the US taxes the gain in dollars with a foreign tax credit for Indian tax.",
  },
  {
    label: "Young NRI just starting to invest",
    situation: "New to the US, no India portfolio yet, deciding where to build wealth.",
    verdict: "Usually builds in the US",
    verdictTone: "good",
    detail: "For a US person with no return plans, building in US index funds avoids PFIC and currency drag. A modest NRE deposit for rupee goals can still make sense. The key is not accidentally buying Indian mutual funds as a US person.",
  },
];

/* ------------------------------------------------------------------ *
 * Common mistakes (22)
 * ------------------------------------------------------------------ */
export const commonMistakes: string[] = [
  "Leaving resident bank and demat accounts un-updated after becoming an NRI, instead of re-designating them to NRO/NRE.",
  "Assuming money left in India is invisible to the IRS — US persons are taxed on worldwide income and India shares account data under FATCA.",
  "Treating TDS as the final tax and never filing an Indian return to recover excess withholding.",
  "Believing the DTAA applies automatically, without a Tax Residency Certificate and Form 10F.",
  "Buying or holding Indian mutual funds as a US person without realising they are almost always PFICs.",
  "Never filing Form 8621 for PFIC holdings and letting the punitive default regime compound.",
  "Thinking NRE interest is tax-free everywhere — it is India-tax-free but fully US-taxable.",
  "Forgetting FBAR (FinCEN 114) when combined foreign accounts cross $10,000 at any point in the year.",
  "Missing FATCA Form 8938 when balances exceed the threshold for your filing status.",
  "Ignoring currency risk and judging India returns in rupees instead of dollars.",
  "Continuing SIPs into Indian mutual funds after moving, quietly growing a PFIC problem every month.",
  "Selling everything in a panic in a single tax year and bunching gains into a high bracket.",
  "Not claiming the US foreign tax credit for tax already paid in India, and paying twice.",
  "Assuming PPF stays fully tax-advantaged — India-tax-free growth can still be US-taxable.",
  "Opening new PPF or certain resident-only products after becoming an NRI, which is not permitted.",
  "Overlooking TDS on an NRI property sale, where buyers often over-withhold badly.",
  "Repatriating NRO funds without the required Form 15CA/15CB.",
  "Keeping a joint resident account with a resident relative instead of the correct NRO/NRE structure.",
  "Letting a KYC/PAN or residency-status mismatch freeze accounts at the worst moment.",
  "Making a big keep-or-sell decision on tax alone, ignoring goals, liquidity, and return plans.",
  "Not coordinating India and US filings, so the two returns tell different stories.",
  "Waiting until you actually move back to India to plan the transition, and missing the RNOR window.",
];

/* ------------------------------------------------------------------ *
 * Snippet-friendly quick answers
 * ------------------------------------------------------------------ */
export const quickAnswers: QuickQA[] = [
  {
    q: "Should NRIs keep their investments in India?",
    a: "It depends on the asset. Direct Indian stocks and NRE/FCNR deposits are usually simple to keep; Indian mutual funds create PFIC problems for US persons; and return-to-India plans can tilt the whole decision toward keeping rupee assets.",
    href: "#quick-answer",
  },
  {
    q: "Do NRIs pay US tax on Indian investments?",
    a: "Yes. US persons are taxed on worldwide income, so India interest, dividends, and capital gains go on your US return — usually with a foreign tax credit for the tax already paid in India.",
    href: "#us-tax",
  },
  {
    q: "Are Indian mutual funds a problem for US taxpayers?",
    a: "Usually. They are almost always PFICs, which means Form 8621 and a punitive default tax regime. This is the most common reason NRIs restructure their India portfolio.",
    href: "#mutual-funds",
  },
  {
    q: "Should I close my NRO account?",
    a: "Not necessarily. An NRO account is the correct place for India-sourced income like rent, dividends, or pension. The issue is usually correct reporting and recovering excess TDS — not closing it.",
    href: "#nre-nro",
  },
  {
    q: "Is NRE interest tax-free?",
    a: "In India, yes, while you qualify as a person resident outside India. In the US, no — NRE interest is fully taxable on your US return.",
    href: "#fd",
  },
  {
    q: "What if I move back to India later?",
    a: "That can change the answer. Rupee-denominated goals and the RNOR status you may get on return can make keeping India assets more attractive than the pure US-tax view suggests.",
    href: "#returning",
  },
];

/* ------------------------------------------------------------------ *
 * FAQs (42) — mirrors People Also Ask intent. Answers are 40–90 words.
 * ------------------------------------------------------------------ */
export const faqs: FaqItem[] = [
  {
    question: "Should NRIs keep their investments in India?",
    answer:
      "There is no universal yes or no. It depends on the asset type, your US tax situation, whether you plan to return to India, your currency exposure, liquidity needs, and goals. Most NRIs keep some India assets (like NRE deposits or direct stocks) and simplify or exit others (like Indian mutual funds). Decide asset by asset, and get cross-border advice before large moves.",
  },
  {
    question: "Do I have to tell the IRS about my Indian investments?",
    answer:
      "Generally yes. US persons report worldwide income, so Indian interest, dividends, and capital gains go on your US return. Separately, you may have to file FBAR (FinCEN 114) if your combined foreign accounts exceed $10,000 at any time, and FATCA Form 8938 above certain thresholds. India also shares account information with the US under FATCA, so non-reporting is risky.",
  },
  {
    question: "Will US taxes destroy my Indian returns?",
    answer:
      "Not usually 'destroy,' but they change the picture. You are taxed on worldwide income, and India already taxes much of this. The DTAA and the US foreign tax credit are designed to prevent double taxation, so in many cases you pay roughly the higher of the two countries' effective rates — not both in full. PFIC holdings like Indian mutual funds are the main exception, where the drag can be severe.",
  },
  {
    question: "Can I keep my Indian mutual funds after moving to the US?",
    answer:
      "You can hold them, but they are almost always PFICs for US tax purposes. That means Form 8621 and, by default, a punitive tax regime unless specific elections are available (they usually are not for Indian funds). Many NRIs restructure out of Indian mutual funds deliberately, with advice, and stop new SIPs. Never sell in a panic — timing and reporting both matter.",
  },
  {
    question: "Should I sell my Indian stocks after becoming an NRI?",
    answer:
      "Not automatically. Direct Indian shares do not create the PFIC problem that funds do, so they are comparatively simple to hold. The real questions are portfolio concentration, currency risk, and whether you need the money in dollars. If you keep them, handle the US tax on dividends and gains and claim a foreign tax credit for Indian tax.",
  },
  {
    question: "Should I close my NRO account?",
    answer:
      "Usually not. An NRO account is the correct home for India-sourced income such as rent, dividends, and pension, and for balances you had before moving. The common issue is recovering excess TDS and reporting the interest correctly, not closing the account. You can repatriate up to about US$1 million per year from an NRO account with Form 15CA/15CB.",
  },
  {
    question: "What is the difference between NRE and NRO accounts?",
    answer:
      "An NRE account holds foreign earnings you bring into India; its interest is tax-free in India and the funds are freely repatriable. An NRO account holds India-sourced income; its interest is taxable in India with TDS, and repatriation is capped at about US$1 million a year with paperwork. Both are US-taxable on the interest. Many NRIs use both for different purposes.",
  },
  {
    question: "Is NRE FD interest taxable in the US?",
    answer:
      "Yes. NRE fixed-deposit interest is exempt from tax in India while you are a non-resident, but it is fully taxable on your US return as ordinary income. 'Tax-free in India' is a common source of confusion — it never means tax-free for a US person. Report the interest each year in dollars using the appropriate exchange rate.",
  },
  {
    question: "How are NRI dividends from Indian companies taxed?",
    answer:
      "Since FY2020-21, dividends are taxable in the investor's hands. For NRIs, the company withholds TDS, commonly around 20% plus surcharge and cess. You may be able to claim a lower treaty rate under the DTAA with a Tax Residency Certificate and Form 10F, and recover any excess by filing an Indian return. On the US side the dividend is taxable, usually with a foreign tax credit for the Indian tax.",
  },
  {
    question: "What is TDS and is it my final tax?",
    answer:
      "TDS is tax deducted at source — the payer withholds a flat percentage before paying you. It is often not your final liability. Your actual India tax depends on your total Indian income and applicable rates, so you may be owed a refund. To claim it, you generally have to file an Indian income-tax return. Treating TDS as final can mean overpaying.",
  },
  {
    question: "How does the India–US DTAA help me?",
    answer:
      "The Double Taxation Avoidance Agreement allocates taxing rights between the two countries and caps certain withholding rates, so the same income is not fully taxed twice. In practice you often claim a reduced Indian rate (with a TRC and Form 10F) and a US foreign tax credit for Indian tax paid. The relief is not automatic — it depends on paperwork and your specific facts.",
  },
  {
    question: "What is the foreign tax credit and how do I claim it?",
    answer:
      "The US foreign tax credit lets you offset US tax with income tax you already paid to India, so you are not taxed twice on the same income. You generally claim it on Form 1116. There are limits based on income category and the ratio of foreign to total income, and credits you cannot use may sometimes carry over. It does not apply to every kind of tax or charge.",
  },
  {
    question: "What is a PFIC and why does it matter for Indian mutual funds?",
    answer:
      "A Passive Foreign Investment Company is a non-US pooled investment. Indian mutual funds, many ETFs, and ULIPs typically qualify. For US taxpayers, PFICs are reported on Form 8621 and, by default, taxed under a punitive regime that can tax gains at high rates with an interest charge. Elections that soften this usually are not available for Indian funds, which is why PFICs drive many NRI decisions.",
  },
  {
    question: "Do I need to file FBAR for my Indian accounts?",
    answer:
      "You must file FBAR (FinCEN Form 114) if the combined highest balance of all your foreign financial accounts exceeds $10,000 at any point during the year — even for a single day, and even if no account individually crosses $10,000. This includes NRE, NRO, FD, demat, and often PPF accounts. FBAR is informational, but penalties for not filing are severe.",
  },
  {
    question: "What is FATCA / Form 8938 and does it apply to me?",
    answer:
      "FATCA requires US taxpayers to report specified foreign financial assets on Form 8938 when their total value exceeds thresholds that depend on your filing status and whether you live in the US or abroad. It overlaps with, but is separate from, FBAR — many NRIs must file both. India reports account data to the US under FATCA, so mismatches can surface.",
  },
  {
    question: "How is capital gains tax handled on Indian equity for NRIs?",
    answer:
      "As of 2026, long-term gains on listed equity and equity funds (held over 12 months) are generally taxed at about 12.5% above a ₹1.25 lakh annual exemption, and short-term gains at about 20%. NRIs typically have TDS deducted on redemptions. The gain is also reported on your US return, with a foreign tax credit for Indian tax. These rates changed in 2024, so verify current figures.",
  },
  {
    question: "How are Indian debt mutual funds taxed now?",
    answer:
      "For units bought on or after 1 April 2023, gains are taxed at your slab rate regardless of holding period — the earlier long-term/indexation benefit was removed. For a US person there is also the PFIC layer. This combination often makes Indian debt funds one of the least tax-efficient India holdings, though your specific facts and purchase dates matter.",
  },
  {
    question: "Can I keep contributing to my PPF as an NRI?",
    answer:
      "You cannot open a new PPF account as an NRI, and existing accounts generally must run to maturity without extension. PPF is tax-free in India, but the US may tax the annual growth and there is debate about foreign-trust reporting. Treating PPF as fully tax-free is a common NRI mistake — check the US treatment for your situation.",
  },
  {
    question: "What happens to my NPS if I move to the US?",
    answer:
      "NRIs can often continue an NPS account, and it can be attractive if you may retire in India. The complication is the US side: NPS is not clearly protected by the treaty, and its US tax and reporting treatment is uncertain. If you hold or plan to contribute to NPS as a US person, get specific cross-border advice rather than assuming symmetry with US retirement accounts.",
  },
  {
    question: "Should I move all my money from India to the US?",
    answer:
      "Rarely all of it. Moving everything can trigger avoidable taxes, sacrifice rupee-denominated goals, and force the sale of illiquid assets. A more common approach is to simplify the problem holdings (like Indian mutual funds), keep simple ones (NRE deposits, direct stocks, a family home), and build new savings where they fit your goals — while planning currency and timing.",
  },
  {
    question: "How does currency risk affect the decision?",
    answer:
      "Your US goals are in dollars, so an India return has to be measured in dollars too. If the rupee weakens against the dollar over your holding period, part of your rupee gain disappears when converted. Over long horizons this currency drag can matter as much as tax. If you plan to spend in rupees later, the same risk works in your favour.",
  },
  {
    question: "What if I plan to return to India?",
    answer:
      "Return plans can flip the decision. Your future expenses will be in rupees, which reduces the currency argument for moving money out, and India assets stay useful. On return you may qualify as Resident but Not Ordinarily Resident (RNOR) for a period, during which foreign income is generally not taxed in India — a valuable planning window worth mapping in advance.",
  },
  {
    question: "What is RNOR status and why does it matter?",
    answer:
      "Resident but Not Ordinarily Resident is a transitional tax status many returning NRIs qualify for, typically for up to two to three years, based on their recent history of non-residence. During RNOR, foreign income is generally not taxed in India, which creates a window to reorganise foreign assets, realise certain gains, or bring in money more efficiently. The exact eligibility depends on your day-count history.",
  },
  {
    question: "Can I repatriate money from my NRO account to the US?",
    answer:
      "Yes, up to about US$1 million per financial year from your NRO account, after taxes, using Form 15CA and a Chartered Accountant's Form 15CB. NRE and FCNR balances are freely repatriable without that annual cap. Keep documentation of the source of funds and the tax paid, because your bank and the US side may both ask.",
  },
  {
    question: "Are gifts from parents in India taxable in the US?",
    answer:
      "A gift from a non-US person is generally not US-income-taxable to the recipient, but large foreign gifts must be reported on IRS Form 3520 (above an annual threshold). On the India side, gift and remittance rules and TCS on outward remittances can apply to the sender. So it is mainly a reporting-and-threshold issue, not usually an extra income tax on the child.",
  },
  {
    question: "How do I report Indian rental income in the US?",
    answer:
      "Indian rent is US-taxable as worldwide income. You report the gross rent and deduct allowable expenses under US rules, which differ from India's, and you may claim depreciation. Tax paid in India on the rent can generally support a foreign tax credit. You convert amounts to dollars using appropriate exchange rates and keep records reconciling the India and US figures.",
  },
  {
    question: "Do I pay tax twice on the same Indian income?",
    answer:
      "Usually not in full. Both countries may have a claim, but the DTAA and the US foreign tax credit are designed to prevent genuine double taxation. In practice you often end up paying roughly the higher of the two effective rates on that income, not the sum of both. The mechanics depend on the income type and correct filing in both countries.",
  },
  {
    question: "Is it worth keeping an Indian home after moving to the US?",
    answer:
      "That is a goals and liquidity question as much as a tax one. A home used by family, or one you may return to, often justifies keeping despite the reporting. A purely investment property adds concentration, currency risk, US-taxable rent, and messy TDS on eventual sale. Neither answer is automatic — weigh the personal purpose against the ongoing complexity.",
  },
  {
    question: "How is the sale of Indian property taxed for NRIs?",
    answer:
      "India taxes the capital gain (long-term after 24 months, with 2026 rule changes to indexation), and the buyer must deduct TDS from an NRI seller — often at a high rate that over-withholds. You can seek a lower-deduction certificate or recover excess via an Indian return. The US taxes the gain in dollars, with a foreign tax credit for Indian tax, and repatriation needs 15CA/15CB.",
  },
  {
    question: "Should I keep investing through SIPs in Indian mutual funds?",
    answer:
      "For a US person, continuing SIPs into Indian mutual funds usually grows a PFIC problem every month, with more Form 8621 reporting and default-regime tax. Many NRIs pause new SIPs after moving and redirect contributions to US-based funds or other holdings. What to do with existing units is a separate, more careful decision that benefits from professional advice.",
  },
  {
    question: "What forms might I need to file as an NRI investor in the US?",
    answer:
      "Commonly Form 1040 with Schedule B (foreign accounts), Form 1116 (foreign tax credit), FBAR / FinCEN 114, Form 8938 (FATCA), Form 8621 (each PFIC), and possibly Form 3520 for large foreign gifts or certain foreign trusts. On the India side you may file an ITR to claim TDS refunds. Which forms apply depends entirely on your assets and amounts.",
  },
  {
    question: "Do I need to file an Indian tax return as an NRI?",
    answer:
      "You may want to, even if not strictly required, when TDS has been over-deducted and you want a refund, or when you have India income above the basic exemption. Filing an Indian ITR is also how you formally claim treaty relief and reconcile TDS. Whether it is mandatory depends on your India income level and sources for the year.",
  },
  {
    question: "Is FCNR a good option for NRIs?",
    answer:
      "An FCNR deposit holds foreign currency (so no rupee conversion risk) and is tax-free in India and freely repatriable, which appeals to NRIs parking dollars. But the interest is fully US-taxable, and the yield should be compared after US tax to US alternatives like high-yield savings or Treasuries. It is a reasonable tool for specific goals, not automatically superior.",
  },
  {
    question: "How are exchange rates handled for US reporting?",
    answer:
      "You report foreign income and account balances in US dollars. The IRS publishes yearly average exchange rates you can use for income, and you use appropriate spot rates for specific transactions and year-end balances. Currency movements can also create separate taxable gains or losses on foreign-currency principal in some cases. Keep clear records of the rates you used.",
  },
  {
    question: "What about US estate tax on my Indian and US assets?",
    answer:
      "India currently has no estate or inheritance tax, but the US estate tax can apply to US-situs assets, and the rules differ sharply for US citizens/residents versus non-residents. Cross-border families should coordinate wills, nominations, and beneficiary designations across both countries. This is a specialist area where generic assumptions are risky, so get tailored estate-planning advice.",
  },
  {
    question: "Can I hold US index funds and ETFs as an NRI?",
    answer:
      "Yes. For a US person, US-domiciled index funds and ETFs avoid the PFIC problem entirely and are straightforward to report. They are dollar-denominated, so no rupee currency risk, and highly liquid. If you later return to India, their India tax treatment changes, so factor your long-term residency plans into how much you build in them.",
  },
  {
    question: "How does becoming an NRI change my demat account?",
    answer:
      "A resident demat account should be converted to an NRI demat, and investing generally moves to a Portfolio Investment Scheme (PIS) or the current repatriable/non-repatriable framework your broker uses. Leaving a resident demat unchanged after you become an NRI is non-compliant and can cause account freezes. Update KYC and residency status promptly with your broker and bank.",
  },
  {
    question: "Should I keep gold or Sovereign Gold Bonds as an NRI?",
    answer:
      "Gold can be a reasonable diversifier, but weigh the practicalities. Physical gold has storage and liquidity issues; gold funds may be PFICs; and Sovereign Gold Bonds have residency nuances for NRIs. All of it is US-taxable on gains. Treat gold as a small diversification decision within your overall plan rather than a core holding for tax reasons.",
  },
  {
    question: "What is the biggest mistake NRIs make with India investments?",
    answer:
      "Two stand out: not updating their status and accounts after becoming an NRI, and unknowingly holding Indian mutual funds as US persons and never filing Form 8621. Both are common, both compound over time, and both are avoidable. A close third is treating TDS as final tax and never recovering excess withholding by filing in India.",
  },
  {
    question: "Do I need a cross-border tax professional?",
    answer:
      "For simple situations — one NRE deposit, a few direct stocks — you may manage with careful reading and good software. But PFICs, property sales, large portfolios, a planned move back to India, or past-year non-compliance are areas where a cross-border CPA or CA usually pays for itself. The cost of getting PFIC or FBAR reporting wrong is far higher than the advice.",
  },
  {
    question: "When is the best time to restructure my India investments?",
    answer:
      "There is no universal date, but low-income years, a change in residency status, and the RNOR window after returning to India are often favourable for realising gains or reorganising. Spreading large sales across tax years can keep you out of higher brackets. Plan the sequence before you act, rather than reacting to a single year's tax bill.",
  },
  {
    question: "Does keeping money in India affect my US immigration or green card?",
    answer:
      "Holding legal, properly reported investments in India does not by itself harm your immigration status. What matters is compliance — filing FBAR, FATCA, and PFIC forms and reporting worldwide income. Undisclosed foreign accounts and unfiled forms are the real risk. Keep your India assets transparent and well-documented on both sides, and consult an immigration attorney for status-specific questions.",
  },
];

/* ------------------------------------------------------------------ *
 * HowTo steps (schema + on-page framework)
 * ------------------------------------------------------------------ */
export const howToSteps: { name: string; text: string }[] = [
  { name: "Update your status and accounts", text: "Re-designate resident bank and demat accounts to NRO/NRE, update KYC and residency, and stop resident-only contributions. Leaving accounts unchanged is non-compliant." },
  { name: "Inventory every India asset", text: "List each holding — stocks, mutual funds, FDs, NRE/NRO balances, property, PPF, NPS, gold — with amounts, purchase dates, and account types, converted to US dollars." },
  { name: "Flag the US-tax problem assets", text: "Identify PFICs (Indian mutual funds, many ETFs/ULIPs) and confirm your FBAR and FATCA reporting obligations for the combined balances." },
  { name: "Model after-tax, after-currency outcomes", text: "For each asset, estimate the India tax, the US tax after a foreign tax credit, and the effect of the rupee-dollar exchange rate over your likely holding period." },
  { name: "Factor in your return-to-India plans", text: "If you may move back, map the RNOR window and rupee-denominated goals; if you are staying, weigh currency risk and dollar liquidity." },
  { name: "Sequence any changes and get advice", text: "Time sales across tax years and residency changes, keep documentation, and consult a cross-border tax professional before large moves or if past reporting was missed." },
];
