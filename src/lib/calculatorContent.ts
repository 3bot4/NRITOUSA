/**
 * Rich, page-specific SEO content for the calculator hub pages. Each entry
 * layers static, human-and-crawler-friendly context around the interactive
 * calculator rendered by app/calculators/[slug]/page.tsx — a quick answer,
 * "who it's for", key inputs, an options/explainer breakdown, tax
 * consequences, a step-by-step process, common mistakes, a worked example,
 * an optional timeline / comparison table, curated internal links, and FAQs
 * (which also drive the FAQPage JSON-LD).
 *
 * Only slugs present here get the expanded hub treatment; other calculators
 * fall back to the compact layout. Numbers are hedged estimates — thresholds,
 * fees, and tax rates change, so wording stays "may / typically / as of 2026".
 */

export interface CalcLink {
  label: string;
  href: string;
}

export interface CalcBullet {
  label: string;
  body: string;
}

export interface CalcTimelineRow {
  stage: string;
  whatToCheck?: string;
  notes?: string;
}

export interface CalcTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface CalcFaq {
  question: string;
  answer: string;
}

export interface CalculatorContent {
  slug: string;
  /** SoftwareApplication category — Finance for money tools, Business for compliance flows. */
  appCategory: "FinanceApplication" | "BusinessApplication";
  /** Inputs the calculator needs, shown above the tool so users can gather them first. */
  keyInputs: string[];
  /** One-line timeline / tax-year / decision-window note shown above the tool. */
  decisionWindow?: string;
  /** "Your options" / explainer breakdown shown after the calculator. */
  options?: { heading: string; items: CalcBullet[] };
  /** Plain-English explanation of what the calculator's result means. */
  resultMeaning: string;
  /** Tax consequences, grouped by jurisdiction / topic. */
  taxConsequences: CalcBullet[];
  /** Ordered step-by-step process. */
  steps: string[];
  /** Common mistakes to avoid. */
  mistakes: string[];
  /** One concrete worked example. */
  example: { title: string; body: string };
  /** Optional stage-by-stage timeline. */
  timeline?: { title: string; intro?: string; rows: CalcTimelineRow[] };
  /** Optional comparison table (e.g. FCNR vs HYSA). */
  table?: CalcTable;
  /** Curated internal links shown before the FAQ. */
  relatedLinks: CalcLink[];
  /** Page-specific FAQs — also emitted as FAQPage JSON-LD. */
  faqs: CalcFaq[];
}

export const calculatorContent: Record<string, CalculatorContent> = {
  /* ------------------------------------------------------------------ *
   * 1. 401(k) return to India
   * ------------------------------------------------------------------ */
  "401k-return-to-india": {
    slug: "401k-return-to-india",
    appCategory: "FinanceApplication",
    keyInputs: [
      "Current 401(k) balance (USD)",
      "Your age (to check the 59½ early-withdrawal threshold)",
      "Expected US federal tax bracket in the year you withdraw",
      "US state you last worked in (some states tax distributions, some don't)",
      "Years you plan to leave the money invested",
      "Assumed annual growth rate on the invested balance",
    ],
    decisionWindow:
      "The highest-leverage decisions happen in the months before you leave the US and in your first India tax year (often an RNOR year). Withdrawals are taxed in the US tax year they're taken.",
    options: {
      heading: "Your four main options",
      items: [
        {
          label: "Keep the 401(k) in the US",
          body: "Most plans let you leave the balance invested after you leave the employer and the country. It keeps compounding in USD, and you decide when to draw it down — ideally in low-income US tax years. There is usually no requirement to cash out just because you've moved to India.",
        },
        {
          label: "Roll it over to an IRA",
          body: "Rolling a 401(k) into a Traditional IRA (a direct trustee-to-trustee transfer) is not a taxable event and usually gives you more investment choice and lower fees. Many people do this before leaving the US while it's administratively easy.",
        },
        {
          label: "Cash out before leaving the US",
          body: "You can withdraw the full balance, but under age 59½ you generally pay ordinary US income tax plus a 10% early-withdrawal penalty, and 20% is typically withheld up front. This is usually the most expensive option unless the balance is small.",
        },
        {
          label: "Withdraw after becoming an India resident",
          body: "You can take distributions after you're back. The US still taxes the distribution at source (Article 20 of the India–US treaty covers pensions), and India may tax it too depending on your residency status (NRI / RNOR / ROR) — with the DTAA and foreign tax credit reducing double taxation.",
        },
      ],
    },
    resultMeaning:
      "The calculator compares the after-tax lump sum you'd keep by cashing out now against the projected after-tax value of leaving the balance invested in USD and drawing it later. A large gap in favor of 'keep invested' usually reflects the combined drag of the early-withdrawal penalty, up-front withholding, and lost compounding on a cash-out. Treat the output as a planning estimate, not a filing figure — your actual bracket, state, and future returns will differ.",
    taxConsequences: [
      {
        label: "US federal tax",
        body: "401(k) distributions are ordinary income on your US return in the year taken. As an NRI, withdrawals after you leave are generally subject to US tax at source; plan to file a US return (often Form 1040-NR) to reconcile withholding.",
      },
      {
        label: "US state tax",
        body: "A few states may still reach the distribution depending on your last domicile, but many don't tax non-residents on retirement plan payouts. Check the rules for the state you last worked in.",
      },
      {
        label: "10% early-withdrawal penalty",
        body: "If you take money out before age 59½ and no exception applies, a 10% additional tax typically stacks on top of ordinary income tax. This is the single biggest reason cashing out early is usually costly.",
      },
      {
        label: "India taxation & residency",
        body: "Whether India taxes the withdrawal depends on your status. During an RNOR window, most foreign-sourced income (including US retirement withdrawals) is often outside India's net; once you become ROR, worldwide income — including 401(k) distributions — is generally taxable in India.",
      },
      {
        label: "DTAA & foreign tax credit",
        body: "The India–US DTAA lets you offset US tax paid against India tax on the same income (and vice versa) so you're not fully taxed twice. You claim the foreign tax credit in India via Form 67 and rely on treaty Article 20 for pensions.",
      },
    ],
    steps: [
      "Confirm your 401(k) plan's rules for former employees and non-US-resident account holders.",
      "Before you leave the US, decide whether to keep the 401(k) or roll it to an IRA (a direct rollover avoids tax).",
      "File a US W-8BEN with the plan/IRA custodian once you're a non-resident so treaty rates and correct withholding apply.",
      "Map your India residency timeline (year of return → RNOR window → ROR) using the RNOR calculator.",
      "Sequence any withdrawals into low-income US tax years and, ideally, RNOR years on the India side.",
      "Each year you withdraw, file the US return (Form 1040-NR) and claim India foreign tax credit (Form 67) if India also taxes it.",
    ],
    mistakes: [
      "Cashing out the full balance on the way out the door and eating the 10% penalty plus withholding when keeping it invested was cheaper.",
      "Taking an indirect rollover (a check to yourself) and missing the 60-day window, turning a tax-free move into a taxable distribution.",
      "Forgetting to file W-8BEN, so the custodian applies default withholding instead of the treaty rate.",
      "Assuming India never taxes the 401(k) — it can, once you're ROR — and not planning withdrawals inside the RNOR window.",
      "Overlooking US FBAR/FATCA and India Schedule FA reporting on the accounts involved.",
    ],
    example: {
      title: "H-1B worker returning to India with an $80,000 401(k)",
      body: "Priya, 34, moves back to India after six years on H-1B. Cashing out her $80,000 balance before leaving would trigger ~22% federal tax plus the 10% penalty and 20% up-front withholding — she'd keep well under $55,000. Instead she rolls it to a Traditional IRA, files W-8BEN, and leaves it invested. Over 20 years at ~6% it could grow past $250,000 before tax. She plans to draw it down gradually in retirement, using her RNOR years and the DTAA foreign tax credit to keep the combined India+US bite low.",
    },
    timeline: {
      title: "401(k) timeline: before you leave → after you're ROR",
      intro: "How the decision and the tax exposure shift across the move.",
      rows: [
        {
          stage: "Before leaving the US",
          whatToCheck: "Plan rules; roll to IRA?; file W-8BEN",
          notes: "Easiest time to consolidate accounts and set up correct withholding.",
        },
        {
          stage: "First India tax year (often RNOR)",
          whatToCheck: "Your residency status for the year",
          notes: "Foreign income is often outside India's net — a good window for withdrawals.",
        },
        {
          stage: "RNOR period",
          whatToCheck: "How many more years you qualify",
          notes: "US still taxes distributions at source; India generally does not tax foreign income yet.",
        },
        {
          stage: "After becoming ROR",
          whatToCheck: "Worldwide income now taxable in India",
          notes: "401(k) withdrawals taxable in India; use DTAA/Form 67 to avoid double tax.",
        },
      ],
    },
    relatedLinks: [
      { label: "RNOR & India tax residency calculator", href: "/calculators/rnor-tax-residency" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
      { label: "Moving to the USA from India checklist", href: "/articles/moving-to-usa-from-india-checklist" },
    ],
    faqs: [
      {
        question: "Can I keep my 401(k) after moving to India?",
        answer:
          "Usually yes. Most plans let former employees leave the balance invested even after they leave the US, and you are generally not forced to cash out just because you've become an India resident. Keeping it invested in USD — or rolling it to an IRA — is often cheaper than cashing out.",
      },
      {
        question: "Should I withdraw my 401(k) before leaving the USA?",
        answer:
          "Rarely, unless the balance is small or you're over 59½. Cashing out before leaving typically triggers ordinary US income tax, a 10% early-withdrawal penalty if you're under 59½, and 20% up-front withholding — so you usually keep far less than the headline balance.",
      },
      {
        question: "Is a 401(k) taxable in India?",
        answer:
          "It can be, depending on your residency status. During an RNOR window, foreign-sourced income like US retirement withdrawals is often outside India's tax net. Once you become an ordinary resident (ROR), worldwide income — including 401(k) distributions — is generally taxable in India, with DTAA relief to avoid double taxation.",
      },
      {
        question: "Can I roll my 401(k) into an IRA before returning to India?",
        answer:
          "Yes. A direct trustee-to-trustee rollover from a 401(k) to a Traditional IRA is not a taxable event and often gives you lower fees and more investment choice. Many people do this while still in the US because it's administratively simpler.",
      },
      {
        question: "Does the DTAA help with 401(k) withdrawals?",
        answer:
          "Yes. The India–US Double Taxation Avoidance Agreement lets you offset tax paid in one country against tax on the same income in the other, so a 401(k) withdrawal taxed in the US isn't taxed again in full in India. You claim the foreign tax credit in India using Form 67.",
      },
      {
        question: "What happens if I withdraw before age 59½?",
        answer:
          "You generally pay ordinary US income tax on the amount plus a 10% early-withdrawal penalty, unless a specific exception applies. That combined cost is why cashing out early is usually the most expensive of the four options.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 2. Backdoor Roth eligibility
   * ------------------------------------------------------------------ */
  "backdoor-roth-eligibility": {
    slug: "backdoor-roth-eligibility",
    appCategory: "FinanceApplication",
    keyInputs: [
      "Your tax filing status (single, married filing jointly, etc.)",
      "Modified adjusted gross income (MAGI) for the tax year",
      "Any existing pre-tax Traditional / SEP / SIMPLE IRA balances (for the pro-rata rule)",
      "How much you intend to contribute this year",
      "Whether you may leave the US / return to India later",
    ],
    decisionWindow:
      "You can make a prior-year IRA contribution up to the April tax-filing deadline, but conversions are reported in the calendar year they happen. Report the whole flow on Form 8606 for that tax year.",
    options: {
      heading: "How the backdoor Roth works",
      items: [
        {
          label: "Direct Roth contribution limits",
          body: "If your income is below the phase-out range for your filing status, just contribute to a Roth directly — you don't need the backdoor at all. The backdoor only matters when your income is too high for a direct Roth contribution.",
        },
        {
          label: "Non-deductible Traditional IRA contribution",
          body: "There's no income limit to contribute to a Traditional IRA on a non-deductible (after-tax) basis. This is step one of the backdoor: put after-tax money into a Traditional IRA.",
        },
        {
          label: "Roth conversion",
          body: "Step two is converting that Traditional IRA to a Roth. Because the contribution was after-tax, converting it soon after (before it earns much) usually creates little or no additional tax.",
        },
        {
          label: "The pro-rata rule",
          body: "The catch: the IRS treats all your Traditional/SEP/SIMPLE IRAs as one pool. If you hold pre-tax IRA money, part of every conversion is taxable in proportion to the pre-tax share — so a clean backdoor Roth usually requires little or no pre-tax IRA balance.",
        },
        {
          label: "Form 8606",
          body: "You file Form 8606 to report the non-deductible contribution and the conversion, establishing your basis so the after-tax portion isn't taxed again.",
        },
      ],
    },
    resultMeaning:
      "The tool tells you whether your income blocks a direct Roth contribution (so a backdoor is worth considering) and flags whether existing pre-tax IRA balances would make the pro-rata rule create tax on a conversion. A 'clean' result means the strategy can likely be done with little tax; a pro-rata warning means you'd want to move pre-tax IRA money into an employer 401(k) first, or accept a partial tax hit.",
    taxConsequences: [
      {
        label: "Tax on the conversion",
        body: "If you have no pre-tax IRA balances and convert soon after contributing, the conversion is usually close to tax-free — you already paid tax on the contributed dollars.",
      },
      {
        label: "Pro-rata tax",
        body: "If you hold pre-tax IRA money, the taxable portion of the conversion equals the pre-tax share of your total IRA balances. This can turn a 'free' backdoor Roth into a taxable event.",
      },
      {
        label: "Form 8606 basis tracking",
        body: "Filing Form 8606 each year records your after-tax basis. Skipping it risks being taxed twice on the same dollars later.",
      },
      {
        label: "If you later return to India",
        body: "A Roth IRA's qualified withdrawals are tax-free in the US, but India does not recognize the Roth wrapper — once you're an ordinary resident (ROR), India may tax the growth. RNOR timing and the DTAA matter if you plan to return.",
      },
    ],
    steps: [
      "Check your MAGI against the Roth phase-out for your filing status to confirm you actually need the backdoor.",
      "Reduce or eliminate pre-tax Traditional/SEP/SIMPLE IRA balances (e.g. roll them into a 401(k)) to avoid the pro-rata rule.",
      "Contribute after-tax money to a Traditional IRA (non-deductible).",
      "Convert the Traditional IRA to a Roth IRA — ideally soon after, before it earns much.",
      "File Form 8606 for the year to report the non-deductible contribution and the conversion.",
      "If you may return to India, factor in how RNOR/ROR status and the DTAA will treat the Roth later.",
    ],
    mistakes: [
      "Converting while holding pre-tax IRA money and getting an unexpected pro-rata tax bill.",
      "Forgetting to file Form 8606, losing the record of after-tax basis.",
      "Letting the Traditional IRA sit and earn a lot before converting, so the earnings become taxable at conversion.",
      "Assuming a Roth stays tax-free after moving to India — India may tax the growth once you're ROR.",
      "Doing a backdoor Roth when your income is actually below the limit and a direct contribution was allowed.",
    ],
    example: {
      title: "High-income H-1B couple, married filing jointly",
      body: "Arjun and Meera are on H-1B, file jointly, and have a MAGI above the direct-Roth phase-out, so they can't contribute to a Roth directly. Neither holds any pre-tax IRA balance. Each contributes the annual limit to a Traditional IRA (non-deductible) and converts to a Roth a few days later — the conversion is essentially tax-free. They each file Form 8606. Because they may return to India in a few years, they note that qualified Roth withdrawals are US-tax-free but India could tax the growth once they become ROR, so they plan around their RNOR window.",
    },
    relatedLinks: [
      { label: "401(k) return-to-India calculator", href: "/calculators/401k-return-to-india" },
      { label: "RNOR & India tax residency calculator", href: "/calculators/rnor-tax-residency" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
    ],
    faqs: [
      {
        question: "Can H-1B workers do a backdoor Roth IRA?",
        answer:
          "Yes. Anyone with US earned income and US tax residency — including H-1B, L-1, and F-1 holders who are resident for tax purposes — can generally use the backdoor Roth strategy. The rules are the same as for US citizens; visa status by itself doesn't disqualify you.",
      },
      {
        question: "Is a backdoor Roth legal?",
        answer:
          "Yes. It's a widely used, IRS-acknowledged strategy that combines a non-deductible Traditional IRA contribution with a Roth conversion. You must report it correctly on Form 8606 and watch the pro-rata rule, but the approach itself is legitimate.",
      },
      {
        question: "What is the pro-rata rule?",
        answer:
          "The IRS treats all your Traditional, SEP, and SIMPLE IRAs as one combined pool. When you convert, the taxable portion equals the pre-tax share of that total pool — so if you hold pre-tax IRA money, part of a 'backdoor' conversion becomes taxable rather than tax-free.",
      },
      {
        question: "Do I need Form 8606?",
        answer:
          "Yes. Form 8606 reports your non-deductible Traditional IRA contribution and the Roth conversion, and records your after-tax basis. Filing it is what keeps the IRS from taxing the same after-tax dollars a second time.",
      },
      {
        question: "Should I do a backdoor Roth if I may return to India?",
        answer:
          "It can still make sense, but with a caveat: India doesn't recognize the Roth wrapper. US-qualified Roth withdrawals are US-tax-free, but once you're an ordinary resident (ROR) in India, India may tax the growth. Plan around your RNOR window and use the DTAA where it applies.",
      },
      {
        question: "Is a Roth IRA taxable in India?",
        answer:
          "India doesn't give the Roth the same tax-free treatment the US does. While you're NRI or RNOR, foreign income is often outside India's net, but once you become ROR, India may tax Roth earnings as worldwide income. The DTAA helps avoid double taxation on the US-taxed portion.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 3. DTAA foreign tax credit
   * ------------------------------------------------------------------ */
  "dtaa-foreign-tax-credit": {
    slug: "dtaa-foreign-tax-credit",
    appCategory: "FinanceApplication",
    keyInputs: [
      "The income type (salary, interest, dividends, capital gains, rental, pension)",
      "Gross income earned in the source country",
      "Tax already paid in the source country",
      "Your tax bracket / rate in the country of residence",
      "Which forms apply (Form 67 in India, Form 1116 in the US, Form 10F where a TRC is needed)",
    ],
    decisionWindow:
      "Foreign tax credit is claimed for the tax year the income arises. In India, Form 67 generally must be filed on or before your income-tax return deadline; in the US, Form 1116 is filed with your annual return.",
    options: {
      heading: "How DTAA relief actually works",
      items: [
        {
          label: "What DTAA means",
          body: "The Double Taxation Avoidance Agreement between India and the US allocates taxing rights over each income type so the same income isn't taxed twice in full. It sets which country taxes first and how the other gives relief.",
        },
        {
          label: "Treaty relief vs foreign tax credit",
          body: "Treaty relief can cap the rate the source country charges (e.g. reduced withholding on interest/dividends). The foreign tax credit then lets your country of residence offset the tax you already paid abroad — the two work together.",
        },
        {
          label: "Income type matters",
          body: "Salary, interest, dividends, capital gains, rental income, and pensions are each treated differently under the treaty. The credit you can claim depends on which article covers the income and the rate the source country applied.",
        },
        {
          label: "The forms",
          body: "India: Form 67 to claim foreign tax credit, and Form 10F plus a Tax Residency Certificate when treaty benefits are claimed on Indian income. US: Form 1116 to claim the foreign tax credit against US tax.",
        },
      ],
    },
    resultMeaning:
      "The calculator estimates how much of your tax is offset by the foreign tax credit and how much double taxation the DTAA removes — plus whether any residual tax is still due in your country of residence or any excess foreign tax carries over. Importantly, the credit is generally capped at the residence-country tax on that same income, so it reduces double taxation but rarely erases all tax.",
    taxConsequences: [
      {
        label: "Credit is capped, not unlimited",
        body: "The foreign tax credit can't exceed the tax your residence country would charge on that same income. If the source country taxed it more heavily, the excess may carry over rather than refund.",
      },
      {
        label: "Income-type specific rates",
        body: "Interest and dividends often have treaty-reduced withholding; capital gains and rental income follow their own articles. Applying the wrong rate is a common source of over- or under-credit.",
      },
      {
        label: "Documentation is required",
        body: "You generally need proof of foreign tax paid, and in India a Tax Residency Certificate plus Form 10F to claim treaty benefits. Missing paperwork can cause the credit to be denied.",
      },
      {
        label: "Timing mismatches",
        body: "India and the US have different tax years. Income taxed in one year abroad may line up with a different residence-country year, which can affect when you claim the credit.",
      },
    ],
    steps: [
      "Identify the income type and which country is the source vs your country of residence.",
      "Confirm the treaty article and any reduced withholding rate that applies to that income.",
      "Gather proof of foreign tax paid, plus a Tax Residency Certificate and Form 10F if claiming treaty benefits on Indian income.",
      "Compute the residence-country tax on the same income to find your credit cap.",
      "File the credit: Form 67 in India, Form 1116 in the US, with your annual return.",
      "Track any excess foreign tax that carries over to future years.",
    ],
    mistakes: [
      "Assuming the DTAA erases all tax — it caps double taxation, but residual residence-country tax often remains.",
      "Filing Form 67 late in India, which can jeopardize the foreign tax credit for the year.",
      "Claiming treaty benefits on Indian income without a valid TRC and Form 10F.",
      "Applying the wrong treaty rate for the income type (e.g. treating dividends like salary).",
      "Ignoring the different India/US tax years and claiming the credit in the wrong period.",
    ],
    example: {
      title: "NRI with US income who is tax-resident in India",
      body: "Rohit has become an ordinary resident of India but still receives US-sourced interest and a small US pension. The US taxes that income at source. On his India return, his worldwide income is taxable, but he claims a foreign tax credit (Form 67) for the US tax already paid, capped at the Indian tax on that same income. The DTAA means he isn't taxed twice in full — he effectively pays the higher of the two rates, not the sum. He keeps his US tax documents and files Form 10F where the treaty rate is claimed.",
    },
    relatedLinks: [
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
      { label: "RNOR & India tax residency calculator", href: "/calculators/rnor-tax-residency" },
      { label: "India property capital gains calculator", href: "/calculators/india-property-capital-gains" },
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
    ],
    faqs: [
      {
        question: "What is the DTAA between India and the USA?",
        answer:
          "The Double Taxation Avoidance Agreement is a tax treaty between India and the US that decides which country taxes each type of cross-border income and how the other country gives relief. Its purpose is to stop the same income from being fully taxed twice.",
      },
      {
        question: "Can I claim a foreign tax credit in India?",
        answer:
          "Yes. If you're tax-resident in India and paid tax abroad on the same income, you can claim a foreign tax credit against your Indian tax by filing Form 67, subject to the treaty and to the Indian tax on that income as a cap.",
      },
      {
        question: "What is Form 67?",
        answer:
          "Form 67 is the Indian form you file to claim a foreign tax credit for taxes paid outside India. It generally must be submitted on or before your income-tax return due date and lists the foreign income and tax paid.",
      },
      {
        question: "What is Form 10F?",
        answer:
          "Form 10F is an Indian form that supplies treaty-relevant details (like your tax residency) when you claim DTAA benefits on Indian income and your Tax Residency Certificate doesn't already contain all the required information.",
      },
      {
        question: "Does the DTAA avoid all taxes?",
        answer:
          "No. The DTAA and foreign tax credit reduce double taxation, but they generally don't erase all tax. The credit is capped at the residence country's tax on the same income, so you typically end up paying roughly the higher of the two countries' rates, not zero.",
      },
      {
        question: "Can NRIs claim DTAA relief on interest income?",
        answer:
          "Yes. Interest income is covered by its own treaty article, which often caps the withholding rate the source country can charge. NRIs can then claim relief or a foreign tax credit so the interest isn't taxed twice in full — with a valid TRC and Form 10F where required.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 4. FCNR vs HYSA
   * ------------------------------------------------------------------ */
  "fcnr-vs-hysa": {
    slug: "fcnr-vs-hysa",
    appCategory: "FinanceApplication",
    keyInputs: [
      "The FCNR deposit rate and tenure offered by the Indian bank",
      "The US high-yield savings / CD rate",
      "Your US marginal (federal) tax bracket",
      "How long you plan to keep the money invested",
      "Whether you'll need the money in USD in the US or plan to return to India",
    ],
    decisionWindow:
      "FCNR deposits lock in for a fixed tenure (often 1–5 years); HYSA balances stay liquid. Match the choice to when you'll actually need the money and to your return-to-India plans.",
    options: {
      heading: "FCNR and HYSA, side by side",
      items: [
        {
          label: "FCNR basics",
          body: "A Foreign Currency Non-Resident (FCNR) deposit lets an NRI hold a fixed deposit in a foreign currency (like USD) at an Indian bank. There's no rupee conversion, so you avoid INR/USD currency risk on the principal, and the interest is exempt from Indian tax for NRIs.",
        },
        {
          label: "HYSA basics",
          body: "A US high-yield savings account (or CD) holds USD at a US bank, typically FDIC-insured, and stays liquid (a CD locks for a term). The interest is fully taxable on your US federal return.",
        },
        {
          label: "Currency risk",
          body: "Both hold USD, so neither carries INR conversion risk while the money stays in dollars. The difference is where the money sits and how it's taxed and insured — not the currency itself.",
        },
        {
          label: "Tax treatment",
          body: "FCNR interest is exempt from Indian tax for NRIs but is still reportable and taxable on a US return if you're a US tax resident. HYSA interest is taxable in the US. So for a US-resident NRI, both are usually US-taxable — the FCNR's India exemption mainly helps once you're back in India.",
        },
        {
          label: "Deposit insurance & repatriation",
          body: "HYSA balances are typically FDIC-insured up to the limit. FCNR deposits sit at an Indian bank (covered by Indian deposit rules) and are fully repatriable, principal and interest, back to the US.",
        },
      ],
    },
    resultMeaning:
      "The calculator compares the net, after-US-tax return of an FCNR deposit against a US HYSA or CD over your chosen horizon, with a compounding view. A higher FCNR headline rate doesn't automatically win — for a US tax resident, FCNR interest is still US-taxable, so the comparison usually comes down to the rate gap, liquidity needs, and whether you're staying in the US or returning to India.",
    taxConsequences: [
      {
        label: "US tax (if you're a US resident)",
        body: "Interest from both FCNR and HYSA is generally taxable on your US federal return while you're a US tax resident. The FCNR's Indian exemption doesn't change US taxability.",
      },
      {
        label: "India tax",
        body: "FCNR interest is exempt from Indian tax for NRIs, which becomes valuable if you return to India while the deposit is still running. HYSA interest has no India angle unless you're India-resident and it becomes worldwide income.",
      },
      {
        label: "Reporting",
        body: "FCNR accounts at Indian banks are foreign financial accounts for a US person — factor in FBAR/FATCA reporting thresholds. HYSA at a US bank has no such foreign-account reporting.",
      },
    ],
    table: {
      caption: "FCNR vs HYSA at a glance",
      headers: ["Factor", "FCNR deposit", "US HYSA / CD"],
      rows: [
        ["Currency", "USD (or other forex) at an Indian bank", "USD at a US bank"],
        ["Tax angle", "India-tax-exempt for NRIs; US-taxable if US resident", "US-taxable interest"],
        ["Liquidity", "Locked for a fixed tenure (often 1–5 yrs)", "HYSA fully liquid; CD locked for term"],
        ["Deposit insurance", "Indian bank deposit rules", "FDIC-insured up to the limit"],
        ["Repatriation", "Fully repatriable to the US", "Already in the US"],
        ["Best for", "NRIs holding USD who may return to India", "Money staying in the US, needed liquid"],
      ],
    },
    steps: [
      "Get the current FCNR rate and tenure from the Indian bank and the best US HYSA/CD rate.",
      "Note your US marginal tax bracket — both interest streams are usually US-taxable.",
      "Decide your horizon and whether you need the money liquid or can lock it in.",
      "Run the comparison to see net after-tax returns side by side.",
      "Factor in FBAR/FATCA reporting if you open or hold an FCNR account.",
      "Revisit when rates reset or your return-to-India timeline changes.",
    ],
    mistakes: [
      "Comparing headline rates without adjusting FCNR interest for US tax while you're still a US resident.",
      "Locking money into a multi-year FCNR when you'll need it liquid in the US.",
      "Forgetting FBAR/FATCA reporting on the Indian FCNR account.",
      "Assuming FCNR carries currency risk — the principal stays in USD, so it doesn't while in dollars.",
      "Ignoring early-withdrawal penalties on CDs or FCNR deposits when you break the term.",
    ],
    example: {
      title: "NRI choosing where to park $50,000 in USD savings",
      body: "Sanjay, on an H-1B and a US tax resident, has $50,000 he won't need for three years. An Indian bank offers an FCNR USD deposit at a slightly higher rate than his US HYSA. But because he's a US tax resident, the FCNR interest is still taxable on his US return, so the after-tax edge shrinks — and the FCNR locks the money for the term and adds FBAR reporting. Since he wants flexibility and is staying in the US for now, the HYSA is the simpler fit. If he were about to move back to India, the FCNR's India-tax exemption and full repatriability would tilt the other way.",
    },
    relatedLinks: [
      { label: "RNOR & India tax residency calculator", href: "/calculators/rnor-tax-residency" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
      { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
    ],
    faqs: [
      {
        question: "Is FCNR better than HYSA?",
        answer:
          "It depends. FCNR can suit NRIs who want to hold USD at an Indian bank and may return to India (its interest is India-tax-exempt and fully repatriable). A HYSA is simpler and liquid for money staying in the US. For a US tax resident, both interest streams are usually US-taxable, so the decision often comes down to the rate gap and liquidity.",
      },
      {
        question: "Is FCNR interest taxable in India?",
        answer:
          "No — FCNR interest is exempt from Indian income tax for NRIs. That exemption is one of the main attractions of an FCNR deposit, and it becomes especially useful if you return to India while the deposit is still running.",
      },
      {
        question: "Is HYSA interest taxable for NRIs?",
        answer:
          "If you're a US tax resident, HYSA interest is taxable on your US federal return. If you're a non-resident who is no longer a US tax resident, US bank interest is often exempt from US tax — but check your specific status.",
      },
      {
        question: "Can I move money from a US bank to an FCNR deposit?",
        answer:
          "Yes. You can remit USD from a US bank into an FCNR deposit at an Indian bank without converting to rupees. Keep in mind the transfer costs and any reporting, and that the FCNR then becomes a foreign account for FBAR/FATCA purposes.",
      },
      {
        question: "Does FCNR avoid currency risk?",
        answer:
          "For the principal, yes — an FCNR deposit is held in foreign currency (like USD), so you don't take on INR/USD conversion risk while the money stays in dollars. You only face currency conversion if and when you convert to rupees.",
      },
      {
        question: "Should returning Indians keep money in the US or India?",
        answer:
          "It depends on when you'll need it and in which currency. FCNR deposits let returning NRIs keep USD at an Indian bank with India-tax-exempt interest and full repatriability, while a US HYSA keeps money liquid in the US. Many people split across both based on their timeline.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 5. India property capital gains
   * ------------------------------------------------------------------ */
  "india-property-capital-gains": {
    slug: "india-property-capital-gains",
    appCategory: "FinanceApplication",
    keyInputs: [
      "Purchase date and purchase price of the property",
      "Sale price (or expected sale price)",
      "Cost of improvements / capital additions",
      "Whether you'll hold long-term (>24 months) or short-term",
      "Whether you plan to claim an exemption (e.g. Section 54 / 54EC reinvestment)",
      "Whether you have a lower/nil TDS certificate",
    ],
    decisionWindow:
      "TDS is deducted by the buyer at the time of sale; capital gains tax is settled when you file your India return for that year. Exemption reinvestment (e.g. Section 54/54EC) has strict deadlines after the sale — plan before you sign.",
    options: {
      heading: "What drives the tax on an NRI property sale",
      items: [
        {
          label: "Resident vs NRI seller",
          body: "TDS rules differ sharply. When the seller is an NRI, the buyer must deduct TDS at the NRI rate on the sale consideration (not just on the gain), which is far higher than the ~1% that applies to resident sellers — so NRIs often over-withhold and reclaim later.",
        },
        {
          label: "Buyer's TDS responsibility",
          body: "The buyer is legally responsible for deducting TDS at source on an NRI's property sale and depositing it with the tax department. Getting this wrong exposes the buyer, so buyers are cautious.",
        },
        {
          label: "Short-term vs long-term gains",
          body: "Hold the property longer than 24 months and the gain is long-term (taxed at the LTCG rate); sell sooner and it's short-term (taxed at slab rates). The holding period is decisive for the rate.",
        },
        {
          label: "Exemption options",
          body: "Reinvesting the gain — e.g. into another residential property (Section 54) or specified bonds (Section 54EC) within the deadlines — can reduce or defer the capital gains tax.",
        },
        {
          label: "Lower TDS certificate",
          body: "Because default NRI TDS is on the whole sale value, many NRIs apply for a lower/nil TDS certificate (Form 13) so tax is withheld closer to the actual gain, avoiding a large blocked refund.",
        },
        {
          label: "Repatriation documents",
          body: "To move the proceeds to the US you'll typically need Form 15CA/15CB certification and bank paperwork, within the annual repatriation limit.",
        },
      ],
    },
    resultMeaning:
      "The calculator estimates your capital gain, the TDS the buyer is likely to withhold, the tax actually due (with surcharge/cess where relevant), and the net amount left to repatriate. Because NRI TDS is often deducted on the full sale value rather than the gain, the TDS figure may be much larger than the final tax — the difference is what you reclaim as a refund when you file, unless you obtained a lower-TDS certificate first.",
    taxConsequences: [
      {
        label: "TDS at source",
        body: "For an NRI seller, the buyer deducts TDS on the sale consideration at the NRI rate (plus surcharge/cess), which frequently exceeds the eventual tax — the excess is refundable on filing.",
      },
      {
        label: "Capital gains tax",
        body: "Long-term gains are taxed at the LTCG rate; short-term gains at slab rates. Post-July-2024 rules changed indexation treatment, so check whether indexation applies to your purchase date.",
      },
      {
        label: "Surcharge & cess",
        body: "High gains can attract a surcharge, and health-and-education cess applies on top of the base tax and surcharge.",
      },
      {
        label: "US side (if US resident)",
        body: "As a US tax resident you also report the gain on your US return, but the India–US DTAA foreign tax credit lets you offset Indian tax paid so the gain isn't taxed twice in full.",
      },
    ],
    steps: [
      "Establish your holding period and compute the gain (sale price minus indexed/actual cost and improvements).",
      "If TDS on the full sale value would far exceed your actual tax, apply for a lower/nil TDS certificate (Form 13) before signing.",
      "At sale, ensure the buyer deducts TDS at the correct NRI rate and deposits it under your PAN — then collect the TDS certificate.",
      "To defer or reduce tax, reinvest the gain under Section 54/54EC within the statutory deadlines.",
      "Prepare Form 15CA/15CB and bank documents to repatriate the net proceeds within the annual limit.",
      "File your India return to reclaim any excess TDS, and claim the DTAA foreign tax credit on your US return if applicable.",
    ],
    mistakes: [
      "Letting the buyer deduct TDS on the full sale value without a lower-TDS certificate, locking up a large refund for months.",
      "Missing the Section 54/54EC reinvestment deadlines and losing the exemption.",
      "Not confirming the TDS was deposited under your PAN, which stalls the refund.",
      "Forgetting Form 15CA/15CB, so the bank won't release the repatriation.",
      "Overlooking the US return — as a US resident you must report the gain and claim the DTAA credit.",
    ],
    example: {
      title: "NRI selling a Bengaluru flat bought in 2012",
      body: "Anil, a US green-card holder, sells a flat he bought in 2012 for ₹40 lakh at ₹1.2 crore. The buyer, cautious about NRI rules, would otherwise deduct TDS on the full ₹1.2 crore. Anil applies for a lower-TDS certificate so tax is withheld closer to his real long-term capital gain. He reinvests part of the gain in 54EC bonds to reduce tax, files Form 15CA/15CB to repatriate the balance, reclaims the small excess TDS on his India return, and claims a DTAA foreign tax credit on his US return so the gain isn't taxed twice in full.",
    },
    timeline: {
      title: "NRI property sale timeline",
      intro: "Key actions before, during, and after the sale.",
      rows: [
        {
          stage: "Before sale",
          whatToCheck: "Holding period; exemption plan; lower-TDS certificate (Form 13)",
          notes: "Applying for a lower-TDS certificate early avoids a large blocked refund.",
        },
        {
          stage: "During sale",
          whatToCheck: "Buyer deducts and deposits TDS; get the TDS certificate",
          notes: "Confirm TDS is deposited under your PAN so you can reclaim it.",
        },
        {
          stage: "After sale",
          whatToCheck: "Reinvest for exemption (Section 54/54EC) within deadlines",
          notes: "Prepare Form 15CA/15CB for repatriation of net proceeds.",
        },
        {
          stage: "Tax filing",
          whatToCheck: "File India return; claim refund of excess TDS; claim US DTAA credit",
          notes: "The gap between TDS withheld and tax due comes back as a refund.",
        },
      ],
    },
    relatedLinks: [
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
      { label: "Form 15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
    ],
    faqs: [
      {
        question: "How much TDS is deducted on an NRI property sale?",
        answer:
          "For an NRI seller, the buyer deducts TDS on the sale consideration at the NRI rate (plus surcharge and cess) — not just on the gain. That's why NRIs often see a large amount withheld and reclaim the excess when they file, unless they obtained a lower-TDS certificate first.",
      },
      {
        question: "Can an NRI claim a refund of excess TDS?",
        answer:
          "Yes. Because TDS is often deducted on the full sale value rather than the actual gain, the amount withheld usually exceeds the final tax. You reclaim the difference as a refund by filing your India income-tax return for that year.",
      },
      {
        question: "Is a lower TDS certificate required?",
        answer:
          "It's not mandatory, but it's often worth it. A lower/nil TDS certificate (Form 13) lets the buyer withhold closer to your actual tax rather than the full sale value — avoiding a large refund that's otherwise locked up until you file.",
      },
      {
        question: "Can an NRI repatriate property sale money to the USA?",
        answer:
          "Yes, within the annual repatriation limit and after taxes. You'll typically need Form 15CA/15CB certification and supporting bank documents. Proceeds from property are generally repatriable subject to those limits and paperwork.",
      },
      {
        question: "What documents are needed after a property sale?",
        answer:
          "Commonly the sale deed, the TDS certificate showing tax deposited under your PAN, proof of purchase cost and improvements, any lower-TDS certificate, and Form 15CA/15CB for repatriation. Keep them for your India return and any US DTAA credit claim.",
      },
      {
        question: "Is the capital gain taxable in both India and the USA?",
        answer:
          "If you're a US tax resident, yes — India taxes the gain at source and the US also taxes it. But the India–US DTAA foreign tax credit lets you offset the Indian tax against your US tax on the same gain, so you're not taxed twice in full.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 6. Remittance TCS cost
   * ------------------------------------------------------------------ */
  "remittance-tcs-cost": {
    slug: "remittance-tcs-cost",
    appCategory: "FinanceApplication",
    keyInputs: [
      "The amount you're sending and the direction (India → US)",
      "The purpose of the remittance (education, medical, investment, family maintenance)",
      "The remittance provider or bank and its flat fee",
      "The exchange rate offered vs the mid-market rate (the FX spread)",
      "Your total LRS usage for the year so far",
    ],
    decisionWindow:
      "TCS applies within India's financial year (April–March) based on your cumulative LRS remittances. TCS collected is credited/refundable when you file your India income-tax return for that year.",
    options: {
      heading: "What makes up the true cost of a remittance",
      items: [
        {
          label: "LRS (Liberalised Remittance Scheme)",
          body: "The RBI's LRS lets resident individuals remit up to a set annual limit abroad for permitted purposes. Your cumulative LRS usage in the year determines when TCS kicks in.",
        },
        {
          label: "TCS (Tax Collected at Source)",
          body: "On certain outward remittances above the annual threshold, the bank collects TCS up front. It's not a separate final tax — it's a prepayment you can claim back as a credit or refund on your India return.",
        },
        {
          label: "Purpose matters",
          body: "TCS treatment varies by purpose: remittances for education (especially via an education loan), medical treatment, investment, and family maintenance can each be treated differently, with different thresholds and rates.",
        },
        {
          label: "Bank fees and FX spread",
          body: "Beyond TCS, the real cost includes the provider's flat fee and — often larger — the hidden exchange-rate margin (the gap between the rate you get and the mid-market rate). The spread is frequently the biggest cost people overlook.",
        },
        {
          label: "TCS credit / refund",
          body: "Because TCS is a prepaid tax, you reclaim it against your tax liability (or as a refund) when you file. So the cash-flow hit is temporary even though it feels like an extra charge at the time.",
        },
      ],
    },
    resultMeaning:
      "The calculator breaks a transfer into its real components — flat fee, exchange-rate margin, and TCS — and shows the net amount that actually arrives. The key insight: TCS is usually recoverable when you file your India return, so it's a cash-flow cost rather than a permanent one, while the FX spread and fees are the costs you can't get back. Optimize the recoverable and non-recoverable parts differently.",
    taxConsequences: [
      {
        label: "TCS is a prepaid tax, not a final one",
        body: "TCS collected on your remittance is credited against your India tax liability, and any excess is refundable when you file. Keep the TCS certificate to claim it.",
      },
      {
        label: "Purpose-based thresholds",
        body: "Education (particularly funded by an education loan), medical, and other purposes can attract different TCS thresholds and rates than general remittances. Classify the purpose correctly.",
      },
      {
        label: "FX spread and fees aren't recoverable",
        body: "Unlike TCS, the exchange-rate margin and provider fees are true costs. Comparing providers on the effective rate — not just the advertised fee — is where the real savings are.",
      },
    ],
    steps: [
      "Choose a remittance provider or bank and compare the effective rate (flat fee plus FX spread), not just the advertised fee.",
      "Gather your PAN, the correct purpose code, and complete Form A2.",
      "Confirm how much TCS applies based on your cumulative LRS usage and the purpose of the remittance.",
      "Complete the transfer and collect the TCS certificate the bank issues.",
      "When you file your India income-tax return, claim the TCS as a credit or refund.",
    ],
    mistakes: [
      "Comparing providers on the flat fee alone and ignoring the FX spread, which is often the bigger cost.",
      "Treating TCS as a lost extra tax instead of claiming it back on your India return.",
      "Declaring the wrong purpose code, which can change the TCS treatment.",
      "Losing the TCS certificate and being unable to claim the credit.",
      "Overlooking Form 15CA/15CB when the remittance is tied to income or a property sale.",
    ],
    example: {
      title: "Sending ₹20 lakh from India to the US for investment",
      body: "Neha remits ₹20 lakh to her US account for investment. Her bank quotes a modest flat fee, but the exchange rate is a fraction below mid-market — that hidden spread costs more than the fee. Because her cumulative LRS remittances cross the annual threshold, the bank also collects TCS up front. Neha keeps the TCS certificate and, when she files her India return, claims the TCS back as a credit — so her real, non-recoverable cost is mostly the FX spread and fee, not the TCS.",
    },
    timeline: {
      title: "How a remittance flows",
      intro: "The typical steps and documents for an India → US transfer.",
      rows: [
        {
          stage: "Choose provider",
          whatToCheck: "Effective rate (fee + FX spread), not just the flat fee",
          notes: "The spread is often the largest and least visible cost.",
        },
        {
          stage: "Gather documents",
          whatToCheck: "PAN, purpose code, Form A2",
          notes: "The declared purpose affects TCS treatment.",
        },
        {
          stage: "Bank collects TCS",
          whatToCheck: "TCS applied on cumulative LRS above the threshold",
          notes: "Get the TCS certificate for your records.",
        },
        {
          stage: "File India return",
          whatToCheck: "Claim TCS credit / refund",
          notes: "The up-front TCS comes back as a credit or refund.",
        },
      ],
    },
    relatedLinks: [
      { label: "Form 15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
      { label: "FCNR vs HYSA calculator", href: "/calculators/fcnr-vs-hysa" },
    ],
    faqs: [
      {
        question: "Is TCS an extra tax?",
        answer:
          "Not really — TCS is a tax collected up front on certain remittances, but it's a prepayment, not a separate final tax. You can claim it as a credit against your income-tax liability or get it refunded when you file your India return.",
      },
      {
        question: "Can I claim a TCS refund?",
        answer:
          "Yes. TCS collected on your outward remittance is credited against your India tax for the year, and any excess is refundable when you file your income-tax return. Keep the TCS certificate the bank issues.",
      },
      {
        question: "What is the LRS?",
        answer:
          "The Liberalised Remittance Scheme is the RBI framework that lets resident individuals send up to a set amount abroad each financial year for permitted purposes. Your cumulative LRS usage determines when TCS applies.",
      },
      {
        question: "Does TCS apply to NRI remittances?",
        answer:
          "TCS under the LRS applies to resident individuals remitting abroad. NRIs remitting from their NRO/NRE accounts follow different rules and limits, so the LRS-based TCS may not apply the same way — check your account type and residency.",
      },
      {
        question: "What documents are needed for an India-to-USA remittance?",
        answer:
          "Typically your PAN, the correct purpose code, and Form A2, plus the TCS certificate the bank issues. For remittances tied to income or property, Form 15CA/15CB may also be required.",
      },
      {
        question: "How do banks calculate remittance cost?",
        answer:
          "The total cost is the flat transfer fee, plus the exchange-rate margin (the gap between the rate you get and the mid-market rate), plus any TCS collected. The FX spread is often the biggest piece, and TCS is recoverable — so compare providers on the effective rate.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 7. RNOR tax residency
   * ------------------------------------------------------------------ */
  "rnor-tax-residency": {
    slug: "rnor-tax-residency",
    appCategory: "FinanceApplication",
    keyInputs: [
      "Days physically present in India in the current financial year",
      "Days present in India across the previous several years",
      "Your residency history (years you were a non-resident)",
      "The date you returned (or plan to return) to India",
      "Your sources of foreign income (401(k)/IRA, brokerage, salary, rental)",
    ],
    decisionWindow:
      "Residency is assessed per India financial year (April–March) based on days present and your history. The RNOR window is typically a limited number of years right after you return — a planning window that closes once you become ROR.",
    options: {
      heading: "NRI, RNOR, and ROR — what changes",
      items: [
        {
          label: "NRI (Non-Resident Indian)",
          body: "You've spent few enough days in India to be a non-resident. Only India-sourced income is taxable in India; your US/foreign income generally isn't in India's net.",
        },
        {
          label: "RNOR (Resident but Not Ordinarily Resident)",
          body: "A transitional status many returning NRIs qualify for in the first years back. You're resident, but most foreign-sourced income (like US retirement withdrawals, foreign salary, and foreign investment income) is still largely outside India's tax net — a valuable planning window.",
        },
        {
          label: "ROR (Resident and Ordinarily Resident)",
          body: "Once you cross the residency thresholds over time, you become ordinarily resident and India taxes your worldwide income — 401(k)/IRA withdrawals, foreign brokerage gains, foreign rental income, and more.",
        },
        {
          label: "Why RNOR matters",
          body: "The RNOR years are often the best time to realize foreign income (e.g. draw down a 401(k), harvest US brokerage gains, take FCNR interest) because India generally doesn't tax that foreign income yet — before ROR brings worldwide income into scope.",
        },
        {
          label: "Accounts and reporting",
          body: "As your status shifts, so does reporting: NRE/NRO/FCNR account rules, plus India's foreign-asset disclosure (Schedule FA) once you're a resident, and US FBAR/FATCA if you remain a US person.",
        },
      ],
    },
    resultMeaning:
      "The calculator uses your day counts and history to classify you as NRI, RNOR, or ROR for the year, and estimates when your status will flip to ROR. If you're RNOR, that's your window: foreign income is largely untaxed in India for now, so it's often the best time to realize gains or draw down US retirement accounts before worldwide income becomes taxable.",
    taxConsequences: [
      {
        label: "NRI",
        body: "Only India-sourced income is taxable in India. Foreign income (US salary, 401(k), brokerage) is generally outside India's net.",
      },
      {
        label: "RNOR",
        body: "You're resident, but foreign-sourced income is still largely not taxed in India — the transitional window that makes RNOR so useful for return planning.",
      },
      {
        label: "ROR",
        body: "Worldwide income is taxable in India, including 401(k)/IRA withdrawals, foreign brokerage gains, and foreign rental income — with the DTAA/foreign tax credit to avoid double taxation.",
      },
      {
        label: "Reporting obligations",
        body: "Residents must disclose foreign assets (Schedule FA) on the India return; US persons continue FBAR/FATCA. Getting reporting right matters as much as the tax itself.",
      },
    ],
    steps: [
      "Count your days physically present in India for the current financial year and across the prior several years.",
      "Enter your day counts and residency history to classify yourself as NRI, RNOR, or ROR.",
      "Estimate when your status will flip to ROR — that's the deadline for RNOR-window planning.",
      "During RNOR years, plan to realize foreign income (401(k) draws, US brokerage gains, FCNR interest) while it's largely untaxed in India.",
      "Set up correct account types (NRE/NRO/FCNR) and prepare for Schedule FA disclosure once you're resident.",
      "Once ROR, report worldwide income and use the DTAA/Form 67 to avoid double taxation.",
    ],
    mistakes: [
      "Miscounting days in India and misclassifying your status for the year.",
      "Wasting the RNOR window — not realizing foreign income before ROR brings worldwide income into India's net.",
      "Forgetting Schedule FA foreign-asset disclosure once you become a resident.",
      "Assuming NRI/RNOR status carries over automatically — it's re-assessed every financial year.",
      "Overlooking continued US FBAR/FATCA obligations if you remain a US person.",
    ],
    example: {
      title: "Engineer returning to India after 8 years in the US",
      body: "Kavita returns to India mid-year after eight years on H-1B and a green card. For the first couple of years she qualifies as RNOR, so her US 401(k) withdrawals and brokerage gains are largely outside India's tax net. She uses that window to draw down part of her 401(k) and rebalance her US portfolio before ROR kicks in. She tracks her days carefully each financial year, sets up NRO/FCNR accounts, and once she becomes ROR she reports worldwide income in India and claims DTAA foreign tax credits for the US tax already paid.",
    },
    timeline: {
      title: "Residency timeline after you return",
      intro: "How your status — and what India taxes — typically evolves.",
      rows: [
        {
          stage: "Year of return",
          whatToCheck: "Days in India this financial year",
          notes: "Often still NRI or entering RNOR; foreign income usually not taxed in India.",
        },
        {
          stage: "Next 1–3 tax years (RNOR)",
          whatToCheck: "Whether you still meet RNOR conditions",
          notes: "Prime window to realize foreign income before ROR.",
        },
        {
          stage: "When ROR starts",
          whatToCheck: "Cumulative days/history crossing the thresholds",
          notes: "Worldwide income becomes taxable in India from this point.",
        },
      ],
    },
    relatedLinks: [
      { label: "401(k) return-to-India calculator", href: "/calculators/401k-return-to-india" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
      { label: "FCNR vs HYSA calculator", href: "/calculators/fcnr-vs-hysa" },
    ],
    faqs: [
      {
        question: "What is RNOR status?",
        answer:
          "RNOR (Resident but Not Ordinarily Resident) is a transitional India tax status that many returning NRIs qualify for in their first years back. You're treated as resident, but most foreign-sourced income is still largely outside India's tax net — unlike an ordinary resident, whose worldwide income is taxable.",
      },
      {
        question: "How long can I be RNOR after returning to India?",
        answer:
          "RNOR is typically a limited window — often a couple of years right after you return — determined by your days present in India and your recent residency history. The calculator estimates when your status will flip from RNOR to ROR based on your specific day counts.",
      },
      {
        question: "Is foreign income taxable during RNOR?",
        answer:
          "Generally not. During the RNOR window, most foreign-sourced income — such as US salary, retirement withdrawals, and foreign investment income — is usually outside India's tax net. That's what makes RNOR a valuable planning window before worldwide income becomes taxable.",
      },
      {
        question: "Is a 401(k) taxable during RNOR?",
        answer:
          "Usually not on the India side during the RNOR window, since it's foreign-sourced income. The US still taxes the distribution at source. This is why many returnees plan 401(k) withdrawals inside their RNOR years, before ROR brings worldwide income into India's net.",
      },
      {
        question: "What happens after RNOR becomes ROR?",
        answer:
          "Once you become Resident and Ordinarily Resident, India taxes your worldwide income — including 401(k)/IRA withdrawals, foreign brokerage gains, and foreign rental income. The India–US DTAA and foreign tax credit then help you avoid being taxed twice on the same income.",
      },
      {
        question: "How many days can an NRI stay in India?",
        answer:
          "Your status depends on days present in the financial year and your history over prior years. Staying beyond the residency thresholds can move you from NRI to resident (RNOR, then ROR). Use the calculator with your actual day counts to see where you fall for the year.",
      },
    ],
  },
};

export function getCalculatorContent(slug: string): CalculatorContent | undefined {
  return calculatorContent[slug];
}
