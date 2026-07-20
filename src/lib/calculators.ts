/**
 * Calculator catalog. Each entry powers the /calculators menu, the dynamic
 * /calculators/[slug] route (metadata, breadcrumbs, JSON-LD), and the
 * contextual lead-magnet box shown on each tool's results.
 *
 * The interactive UI for each slug lives in src/components/calculators and is
 * wired to the slug in the registry inside app/calculators/[slug]/page.tsx.
 */

export interface CalculatorMeta {
  slug: string;
  title: string;
  /** Short label for cards / nav */
  label: string;
  category: string;
  description: string;
  icon: string;
  /** Tailwind gradient for the hero accent */
  accent: string;
  seoTitle: string;
  seoDescription: string;
  /** Related guide slugs (must exist in lib/articles) */
  related: string[];
  /**
   * Cross-cutting cluster tags (e.g. "tax-compliance"). Drives the India Tax
   * & Compliance hub and the related-tools strip at the foot of each page.
   */
  tags?: string[];
  /** Contextual lead magnet shown on the results panel */
  leadMagnet: {
    heading: string;
    body: string;
    cta: string;
  };
  /** One-to-two sentence Quick Answer shown above the calculator for AI citability. */
  quickSummary: string;
  /** Who this calculator is designed for — shown in the AI-friendly summary box. */
  audience: string;
  /** ISO date of last data/threshold review (YYYY-MM-DD). */
  dataChecked: string;
  /** Official source(s) for the rules or thresholds used. */
  officialSource: string;
}

export const calculators: CalculatorMeta[] = [
  {
    slug: "rnor-tax-residency",
    title: "RNOR Window & Tax Residency Calculator",
    label: "RNOR / Tax Residency",
    category: "Finance & Taxes",
    description:
      "Find out if you're an NRI, RNOR, or ordinary resident (ROR) for Indian tax — and exactly when your global US income starts becoming taxable in India.",
    icon: "🗓️",
    accent: "from-rose-500 to-pink-600",
    seoTitle: "RNOR Status Calculator 2026: 182-Day India Residency Test",
    seoDescription:
      "Check your India tax residency: the 182-day rule, the 60+365 test, and whether you qualify as RNOR — the window where foreign income is exempt.",
    related: [
      "substantial-presence-test-explained",
      "indian-income-us-tax-return",
      "double-taxation-dtaa-india-usa",
    ],
    tags: ["tax-compliance"],
    leadMagnet: {
      heading: "Planning your move back to India?",
      body: "Get our free RNOR planning checklist — how to use your tax-free transitional window before global income becomes taxable.",
      cta: "Send me the RNOR checklist",
    },
    quickSummary:
      "Your India tax status depends on how many days you've spent there over the last several years. Enter your day count to find out if you're NRI (taxed on India-sourced income only), RNOR (transitional status with limited global-income exposure), or ordinary resident (taxed on worldwide income).",
    audience: "NRIs planning to return to India, and Indians who recently moved to the US who want to understand when their global income starts being taxable in India",
    dataChecked: "2026-06-01",
    officialSource: "Income Tax Act, 1961, Section 6 (residence rules); Indian Income Tax Department",
  },
  {
    slug: "india-property-capital-gains",
    title: "Indian Property Sale Capital Gains & Repatriation Estimator",
    label: "India Property Sale",
    category: "Finance & Taxes",
    description:
      "Estimate capital gains tax and TDS on selling property in India, the 54EC exemption, and how much you can repatriate to the US under the $1M limit.",
    icon: "🏘️",
    accent: "from-amber-500 to-orange-600",
    seoTitle: "India Property Sale Tax Calculator (NRI)",
    seoDescription:
      "Estimate LTCG/STCG tax, TDS, the Section 54EC exemption, and your USD 1 million repatriation headroom when selling property in India as an NRI.",
    related: [
      "repatriate-india-property-sale-usa",
      "inheriting-indian-assets-us-tax",
      "selling-indian-shares-us-resident-tax",
    ],
    tags: ["tax-compliance"],
    leadMagnet: {
      heading: "Selling property in India?",
      body: "Get our free repatriation pack — the 15CA/15CB compliance checklist and the documents your bank will ask for.",
      cta: "Send me the repatriation pack",
    },
    quickSummary:
      "Capital-gains tax and TDS are two different calculations, and this calculator keeps them separate. Long-term gains on property transferred on or after 23 July 2024 are taxed at 12.5% without indexation; short-term gains are taxed at your applicable slab rate, not at a fixed rate. Separately, under Section 195 the buyer withholds TDS on the full sale consideration — not on your gain — unless you obtain a lower/nil deduction certificate, so the amount withheld is usually far larger than the tax you actually owe and the difference is reclaimed by filing an Indian return. Repatriation of up to USD 1 million per financial year is subject to RBI/FEMA conditions and your bank's review.",
    audience: "US-based NRIs and Indian-Americans who own or have inherited property in India and are considering a sale",
    dataChecked: "2026-06-01",
    officialSource: "Income Tax Act, 1961, Sections 48, 54, 54EC, 195; RBI Master Circular on repatriation",
  },
  {
    slug: "401k-return-to-india",
    title: "401(k) Return-to-India: Cash Out vs Keep Calculator",
    label: "401(k) Cash Out vs Keep",
    category: "401(k) & Retirement",
    description:
      "Moving back to India? Compare cashing out your 401(k) now (after penalty + withholding) against leaving it to compound in USD for retirement.",
    icon: "🏦",
    accent: "from-indigo-500 to-blue-700",
    seoTitle: "401(k) Cash Out vs Keep Calculator (NRIs)",
    seoDescription:
      "Compare the after-tax value of cashing out your 401(k) when you leave the US versus letting it compound for 10–20 years under the DTAA.",
    related: [
      "what-happens-to-401k-leaving-usa",
      "transfer-401k-to-india-nps-ppf",
      "401k-match-explained-nri",
    ],
    tags: ["tax-compliance"],
    leadMagnet: {
      heading: "Returning to India soon?",
      body: "Get our free guide chapter on minimizing US tax and withholding on 401(k) and IRA distributions after you leave.",
      cta: "Send me the 401(k) exit guide",
    },
    quickSummary:
      "Cashing out a 401(k) before age 59½ triggers a 10% early-withdrawal penalty plus federal tax withholding — but keeping it invested in USD may build significantly more long-term wealth. The India–USA DTAA reduces India-side tax on periodic distributions. Compare both paths over your expected timeline.",
    audience: "H-1B workers and green card holders who accumulated 401(k) savings in the US and are planning to move back to India",
    dataChecked: "2026-06-01",
    officialSource: "IRS Publication 575; India–USA DTAA Article 20; IRS Form W-8BEN",
  },
  {
    slug: "backdoor-roth-eligibility",
    title: "Backdoor Roth IRA Eligibility Calculator",
    label: "Backdoor Roth IRA",
    category: "401(k) & Retirement",
    description:
      "High income phasing you out of a Roth IRA? Check your eligibility, the pro-rata tax trap, and the steps to a clean backdoor Roth conversion.",
    icon: "🚪",
    accent: "from-violet-500 to-purple-600",
    seoTitle: "Backdoor Roth IRA Eligibility Calculator",
    seoDescription:
      "Check Roth IRA income phase-out limits by filing status, the pro-rata tax on existing Traditional IRA balances, and a clean backdoor Roth checklist.",
    related: [
      "backdoor-roth-ira-nri",
      "roth-ira-vs-traditional-nri",
      "index-funds-for-beginners-nri",
    ],
    leadMagnet: {
      heading: "Want tax-free growth despite a high income?",
      body: "Get our free step-by-step backdoor Roth walkthrough, including how to avoid the pro-rata rule.",
      cta: "Send me the backdoor Roth guide",
    },
    quickSummary:
      "For tax year 2026, direct Roth IRA contributions phase out at $153,000–$168,000 MAGI (single or head of household) and $242,000–$252,000 (married filing jointly). The IRA contribution limit is $7,500, or $8,600 if you are 50 or older. The backdoor Roth strategy — a non-deductible Traditional IRA contribution followed by a Roth conversion — lets high earners contribute above these limits, but it is not automatically tax-free: the pro-rata rule taxes part of the conversion in proportion to any pre-tax Traditional, SEP or SIMPLE IRA balance, and the conversion must be reported on Form 8606.",
    audience: "High-income immigrants and NRIs in the US who earn above the Roth IRA direct-contribution income limits",
    dataChecked: "2026-07-20",
    officialSource:
      "IRS, \"401(k) limit increases to $24,500 for 2026; IRA limit increases to $7,500\"; IRS Publication 590-A; IRS Notice 2014-54",
  },
  {
    slug: "rent-vs-buy-visa",
    title: "Visa-Timeline Rent vs Buy Calculator",
    label: "Rent vs Buy (Visa)",
    category: "Housing, Cars & Remittances",
    description:
      "Standard calculators assume you'll stay 30 years. This one ties the rent-vs-buy decision to your real US visa horizon, including selling costs if you relocate.",
    icon: "🔑",
    accent: "from-sky-500 to-blue-600",
    seoTitle: "Visa-Timeline Rent vs Buy Calculator",
    seoDescription:
      "Should an H-1B or visa holder rent or buy? Compare total cost over your secure US timeline, including closing costs, selling costs, and appreciation.",
    related: [
      "rent-vs-buy-house-immigrants",
      "buying-first-home-on-visa",
      "how-much-rent-can-you-afford",
    ],
    leadMagnet: {
      heading: "Deciding whether to buy on a visa?",
      body: "Get our free home-buying-on-a-visa checklist, including mortgage options for non-citizens.",
      cta: "Send me the visa home-buying guide",
    },
    quickSummary:
      "On a visa, the financial break-even on buying vs renting is typically 4–7 years — far longer than the 2–3 years standard calculators suggest — because closing costs (2–5%) and selling costs (6–8%) are fixed regardless of how long you stay. Enter your visa horizon and local home prices to see whether buying makes financial sense on your specific timeline.",
    audience: "H-1B, L-1, O-1, and other visa holders in the US who are on a defined immigration timeline and considering buying a home",
    dataChecked: "2026-06-01",
    officialSource: "No single official source; estimates based on typical US closing and selling cost ranges",
  },
  {
    slug: "rent-vs-buy-immigrant",
    title: "Rent vs. Buy Calculator for Immigrants & Visa Holders",
    label: "Rent vs Buy (Immigrant)",
    category: "Housing, Cars & Remittances",
    description:
      "The only rent vs. buy calculator that factors in your visa, immigration timeline, and relocation risk — built for visa holders, not 30-year US citizens.",
    icon: "🏡",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "Rent vs. Buy Calculator for Visa Holders",
    seoDescription:
      "Built for visa holders: accounts for visa type, immigration timeline, and relocation risk. See the immigrant-adjusted break-even — rent or buy.",
    related: [
      "rent-vs-buy-house-immigrants",
      "buying-first-home-on-visa",
      "selling-us-home-nri-firpta",
      "transfer-money-india-us-home-downpayment",
    ],
    leadMagnet: {
      heading: "Deciding whether to buy on a visa?",
      body: "Get our free home-buying-on-a-visa checklist — visa-friendly lenders, the EMI-to-rent test, and how to fund a down payment from India.",
      cta: "Send me the visa home-buying guide",
    },
    quickSummary:
      "Unlike standard rent-vs-buy calculators, this one factors in your visa type, immigration uncertainty, and the risk of an unplanned relocation. See the immigrant-adjusted break-even point and a cost comparison that reflects the real tradeoffs for non-citizens in the US housing market.",
    audience: "Immigrants and visa holders at any stage of the US immigration process who are deciding whether to rent or buy a home",
    dataChecked: "2026-06-01",
    officialSource: "No single official source; uses standard US housing market cost assumptions",
  },
  {
    slug: "remittance-tcs-cost",
    title: "True-Cost Remittance & TCS Fee Estimator",
    label: "Remittance & TCS",
    category: "Housing, Cars & Remittances",
    description:
      "See the real cost of an India–US transfer: flat fees, hidden exchange-rate margin, and India's TCS on outward remittances — and the net amount that actually arrives.",
    icon: "💸",
    accent: "from-cyan-500 to-teal-600",
    seoTitle: "Remittance & TCS Calculator (India–USA)",
    seoDescription:
      "See the true cost of sending money between India and the USA — provider fees, exchange-rate spread, and India's TCS — and the net amount received.",
    related: [
      "cheapest-way-send-money-usa-india",
      "us-1-percent-remittance-fee",
      "tcs-india-remittance-tax",
    ],
    tags: ["tax-compliance"],
    leadMagnet: {
      heading: "Moving large sums across borders?",
      body: "Get our free India–USA transfer playbook — how to cut fees, beat the spread, and stay TCS-compliant.",
      cta: "Send me the transfer playbook",
    },
    quickSummary:
      "India charges 20% TCS on outward remittances above ₹10 lakh per year for most purposes (the threshold was raised to ₹10 lakh from FY 2025-26); you can reclaim TCS as an income tax credit when filing in India. Enter your transfer amount, provider, and current exchange rate to see total fees, TCS withheld, exchange-rate margin, and the net USD (or INR) amount received on the other end.",
    audience: "NRIs and Indians sending money between India and the USA — whether transferring savings, paying for education, or repatriating property sale proceeds",
    dataChecked: "2026-06-01",
    officialSource: "Income Tax Act, 1961, Section 206C(1G) (TCS on remittances); RBI Liberalised Remittance Scheme (LRS)",
  },
  {
    slug: "fcnr-vs-hysa",
    title: "FCNR vs HYSA: After-Tax Returns Calculator",
    label: "FCNR vs HYSA",
    category: "Finance & Taxes",
    description:
      "Compare FCNR fixed deposit returns vs a US High-Yield Savings Account or CD after US income tax. See net returns, tax impact, and a 10-year compounding chart.",
    icon: "🏦",
    accent: "from-teal-500 to-cyan-600",
    seoTitle: "FCNR vs HYSA Calculator — Compare After-Tax Returns | NRI to USA",
    seoDescription:
      "Compare FCNR fixed deposit returns vs US HYSA or CD after US income tax. Free calculator for NRIs shows net returns, tax impact, and 10-year compounding graph.",
    related: [],
    tags: ["tax-compliance"],
    leadMagnet: {
      heading: "Parking USD savings as an NRI?",
      body: "Get our free NRI banking guide — when to use FCNR vs NRE vs regular US accounts, and how to optimize after-tax returns.",
      cta: "Send me the NRI banking guide",
    },
    quickSummary:
      "FCNR deposits and US HYSAs or CDs can both hold USD, but their tax treatment differs: FCNR interest is exempt from Indian tax but fully taxable on a US federal return. Enter current FCNR and HYSA rates plus your US marginal tax bracket to compare net after-tax returns over 1–5 years, with a compounding chart.",
    audience: "NRIs holding USD savings who are comparing FCNR fixed deposits at Indian banks versus US high-yield savings accounts or CDs",
    dataChecked: "2026-06-01",
    officialSource: "IRS Publication 550 (investment income); FEMA 1999 (FCNR account rules); RBI Master Circular on NRI accounts",
  },
  {
    slug: "dtaa-foreign-tax-credit",
    title: "DTAA Relief & Foreign Tax Credit Calculator (India–US)",
    label: "DTAA / Foreign Tax Credit",
    category: "Finance & Taxes",
    description:
      "Taxed on the same income in both India and the US? Estimate your Foreign Tax Credit, how much double taxation the DTAA avoids, and any US tax still due or India tax to carry over.",
    icon: "⚖️",
    accent: "from-teal-500 to-emerald-600",
    seoTitle: "DTAA & Foreign Tax Credit Calculator (NRI)",
    seoDescription:
      "Estimate India–US DTAA relief: enter your India income, tax paid, and US bracket to see your Foreign Tax Credit (Form 1116) and double tax avoided.",
    related: [
      "double-taxation-dtaa-india-usa",
      "indian-income-us-tax-return",
      "selling-indian-shares-us-resident-tax",
    ],
    tags: ["tax-compliance"],
    leadMagnet: {
      heading: "Worried about being taxed twice?",
      body: "Get our free DTAA relief pack — the Form 1116 vs Form 67 walkthrough and the documents to keep so your foreign tax credit holds up.",
      cta: "Send me the DTAA relief pack",
    },
    quickSummary:
      "Under the India–USA Double Taxation Avoidance Agreement (DTAA), income taxes you paid in India on India-sourced income can offset your US federal tax bill via the Foreign Tax Credit (IRS Form 1116). The credit is limited to the US tax that would have applied on that same income — you cannot use it to reduce tax on other income. Enter your India income and tax paid to estimate how much double taxation you avoid.",
    audience: "US-resident NRIs and green card holders with income from India — such as rental income, fixed deposit interest, dividends, or capital gains — who want to claim DTAA relief on their US tax return",
    dataChecked: "2026-06-01",
    officialSource: "India–USA DTAA (1989, as amended); IRS Form 1116 instructions; IRS Publication 514",
  },
];

export const calculatorCategories = [
  "Finance & Taxes",
  "401(k) & Retirement",
  "Housing, Cars & Remittances",
];

/**
 * Calculators surfaced under the "US Investing & Wealth" section (on /tools and
 * the home grid) instead of the generic Cross-border calculators list. Keyed by
 * slug so both surfaces split the catalog the same way. The IUL vs 401(k)
 * comparison also belongs to this group but lives at an article URL, so it is
 * rendered separately via <IulComparisonCard>.
 */
export const usInvestingCalculatorSlugs = [
  "backdoor-roth-eligibility",
  "rent-vs-buy-visa",
  "rent-vs-buy-immigrant",
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}
