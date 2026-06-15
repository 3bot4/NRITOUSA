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
    seoTitle: "RNOR & India Tax Residency Calculator for NRIs",
    seoDescription:
      "Enter your days in India to find your tax status (NRI, RNOR, or ROR) and when your worldwide income becomes taxable in India.",
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
