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
  /**
   * ISO date this hub's content and figures were last verified. Presence also
   * opts the page into the answer-first chrome (byline row + author bio box),
   * so untouched calculators render exactly as before.
   */
  updated?: string;
  /** Expertise tags for the author bio box at the foot of the page. */
  expertiseTags?: string[];
  /** Answer-first summary shown directly under the H1, with specific numbers. */
  quickAnswer?: string;
  /** Key takeaways: 4-5 standalone facts, each carrying a specific number. */
  takeaways?: string[];
  /** Plain-language formula / inputs / assumptions behind the calculator. */
  howItWorks?: { heading: string; body: string };
  /** How this topic interacts with adjacent processes, with internal links. */
  connects?: { heading: string; body: string; links: CalcLink[] };
  /** Additional reference tables rendered after `table`. */
  tables?: CalcTable[];
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
      "File a US W-8BEN with the plan/IRA custodian once you're a non-resident. Distributions to foreign payees are generally withheld at 30% unless valid documentation establishes eligibility for a lower treaty rate; submitting the form starts that process but does not by itself guarantee any particular rate, and custodians differ in what they require and whether they will apply a treaty rate at all.",
      "Map your India residency timeline (year of return → RNOR window → ROR) using the RNOR calculator.",
      "Sequence any withdrawals into low-income US tax years and, ideally, RNOR years on the India side.",
      "Each year you withdraw, file the US return (Form 1040-NR) and claim India foreign tax credit (Form 67) if India also taxes it.",
    ],
    mistakes: [
      "Cashing out the full balance on the way out the door and eating the 10% penalty plus withholding when keeping it invested was cheaper.",
      "Taking an indirect rollover (a check to yourself) and missing the 60-day window, turning a tax-free move into a taxable distribution.",
      "Forgetting to file W-8BEN, so the custodian has no documentation on file and applies the default 30% withholding.",
      "Assuming India never taxes the 401(k) — it can, once you're ROR — and not planning withdrawals inside the RNOR window.",
      "Overlooking US FBAR/FATCA and India Schedule FA reporting on the accounts involved.",
    ],
    example: {
      title: "H-1B worker returning to India with an $80,000 401(k)",
      body: "Priya, 34, moves back to India after six years on H-1B. Taking a taxable cash distribution of her $80,000 balance before leaving would cost roughly 22% in federal income tax plus the 10% additional tax on an early distribution — about $25,600, leaving her around $54,400 once she files. Withholding at the time of payment would hold back more than that up front, but the excess comes back as a refund rather than adding to the cost. Instead she completes a direct trustee-to-trustee rollover to a Traditional IRA — which is not a withdrawal and creates no distribution — files W-8BEN, and leaves it invested. Over 20 years at ~6% it could grow past $250,000 before tax. She plans to draw it down gradually in retirement, using her RNOR years and the DTAA foreign tax credit to keep the combined India+US bite low.",
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
          "Usually, you should not take a taxable cash distribution solely because you are leaving the United States. Depending on your plan and custodian, you may be able to leave the balance in the employer plan or complete a direct trustee-to-trustee rollover to a Traditional IRA. A rollover is not the same as withdrawing the money for personal use — it moves the balance between retirement accounts without creating a distribution. Compare plan fees, investment options, custodian policies for foreign addresses, early-distribution tax, withholding and India taxation before deciding.",
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
          body: "Step two is converting that Traditional IRA to a Roth. A backdoor Roth is not automatically tax-free: the contribution was after-tax, so converting before it earns much limits the taxable amount, but any earnings in the interim are taxable and the pro-rata rule can make a large share of the conversion taxable regardless of timing.",
        },
        {
          label: "The pro-rata rule",
          body: "The catch: the IRS treats all your Traditional/SEP/SIMPLE IRAs as one pool, measured by their combined balance on December 31 of the conversion year — not on the day you convert. If you hold pre-tax IRA money at that point, part of every conversion is taxable in proportion to the pre-tax share, so a clean backdoor Roth usually requires little or no pre-tax IRA balance at year end.",
        },
        {
          label: "Form 8606",
          body: "You file Form 8606 to report the non-deductible contribution and the conversion, establishing your basis so the after-tax portion isn't taxed again.",
        },
      ],
    },
    resultMeaning:
      "The tool tells you whether your income blocks a direct Roth contribution (so a backdoor is worth considering) and flags whether existing pre-tax IRA balances would make the pro-rata rule create tax on a conversion. A 'clean' result means the strategy can likely be done with little tax; a pro-rata warning means you would want to reduce pre-tax IRA balances before year end, or accept a partial tax hit. Moving pre-tax IRA money into an employer 401(k) is one way to do that, but employer plans are not required to accept incoming rollovers — confirm with your plan administrator before relying on it.",
    taxConsequences: [
      {
        label: "Tax on the conversion",
        body: "If you have no pre-tax IRA balances at year end and convert soon after contributing, the taxable amount is usually small — you already paid tax on the contributed dollars. Any earnings between contribution and conversion are still taxable income, so the conversion is rarely exactly zero-tax.",
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
      "Reduce or eliminate pre-tax Traditional/SEP/SIMPLE IRA balances before December 31 to limit the pro-rata rule. Rolling them into an employer 401(k) is a common route, but check first — plans are not obliged to accept incoming rollovers.",
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
      body: "Arjun and Meera are on H-1B, file jointly, and have a 2026 MAGI of $260,000 — above the $242,000–$252,000 direct-Roth phase-out — so they can't contribute to a Roth directly. Neither holds any pre-tax IRA balance. Each contributes the $7,500 annual limit to a Traditional IRA (non-deductible) and converts to a Roth a few days later; only the small amount of earnings in those few days is taxable. They each file Form 8606. Because they may return to India in a few years, they note that qualified Roth withdrawals are US-tax-free but India could tax the growth once they become ROR, so they plan around their RNOR window.",
    },
    relatedLinks: [
      { label: "401(k) return-to-India calculator", href: "/calculators/401k-return-to-india" },
      { label: "RNOR & India tax residency calculator", href: "/calculators/rnor-tax-residency" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
    ],
    faqs: [
      {
        question: "What are the 2026 Roth IRA income limits and contribution limits?",
        answer:
          "For tax year 2026 the IRA contribution limit is $7,500, rising to $8,600 if you are 50 or older (a $1,100 catch-up). Direct Roth contributions phase out between $153,000 and $168,000 of MAGI for single filers and heads of household, and between $242,000 and $252,000 for married couples filing jointly. A married person filing separately who lived with their spouse at any time during the year phases out between $0 and $10,000; one who lived apart for the entire year is treated as single for this purpose.",
      },
      {
        question: "Is a backdoor Roth tax-free?",
        answer:
          "Not automatically. The contribution itself is after-tax, so it is not taxed again on conversion, but two things can create tax: any earnings between the contribution and the conversion are taxable, and the pro-rata rule taxes part of the conversion in proportion to your combined pre-tax Traditional, SEP and SIMPLE IRA balance on December 31 of the conversion year. Someone with a large pre-tax IRA balance can find most of a backdoor conversion taxable.",
      },
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
      "Foreign tax credit is claimed for the tax year the income arises. In India, Form 67 and supporting documents are generally furnished on or before the end of the assessment year relevant to the previous year in which the income is offered or assessed to tax in India. When foreign income is included through an updated return under section 139(8A), the relevant documents must be furnished on or before the date the updated return is filed. Always verify the current instructions before filing. In the US, Form 1116 is filed with your annual return.",
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
          body: "A Foreign Currency Non-Resident (FCNR) deposit lets an NRI hold a fixed deposit in a foreign currency (like USD) at an Indian bank. There's no rupee conversion, so you avoid INR/USD currency risk on the principal. The interest is exempt from Indian income tax while you are a non-resident (NRI) or Resident but Not Ordinarily Resident (RNOR); once you become Resident and Ordinarily Resident (ROR), the interest becomes taxable in India. FCNR is a FEMA deposit category — that governs eligibility and repatriation, not the income-tax exemption, which is a separate income-tax provision.",
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
          "FCNR interest is exempt from Indian income tax while you qualify as a non-resident (NRI) or as Resident but Not Ordinarily Resident (RNOR) — so the exemption continues through the RNOR window after you return. It ends once you become Resident and Ordinarily Resident (ROR), at which point the interest is taxable in India. The exemption is an income-tax provision; do not confuse it with FEMA, which governs the deposit's eligibility and repatriation.",
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
          body: "To move the proceeds to the US you will need bank paperwork and, depending on the remittance, a Form 15CA declaration and a Form 15CB certificate from a Chartered Accountant. Whether 15CB is required depends on the nature, taxability and amount of the remittance — not every transfer needs one, so confirm which applies to yours. The USD 1 million per financial year facility is itself subject to RBI/FEMA conditions, eligible balances, payment of applicable taxes, documentation and your authorised dealer bank's review.",
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
      "Prepare the bank documents to repatriate the net proceeds, together with Form 15CA and — where your remittance requires it — a Form 15CB certificate from a Chartered Accountant.",
      "File your India return to reclaim any excess TDS, and claim the DTAA foreign tax credit on your US return if applicable.",
    ],
    mistakes: [
      "Letting the buyer deduct TDS on the full sale value without a lower-TDS certificate, locking up a large refund for months.",
      "Missing the Section 54/54EC reinvestment deadlines and losing the exemption.",
      "Not confirming the TDS was deposited under your PAN, which stalls the refund.",
      "Leaving the Form 15CA/15CB question until the last minute — the bank will not release the remittance until whichever of them your transfer requires is in place.",
      "Overlooking the US return — as a US resident you must report the gain and claim the DTAA credit.",
    ],
    example: {
      title: "NRI selling a Bengaluru flat bought in 2012",
      body: "Anil, a US green-card holder, sells a flat he bought in 2012 for ₹40 lakh at ₹1.2 crore. The buyer, cautious about NRI rules, would otherwise deduct TDS on the full ₹1.2 crore. Anil applies for a lower-TDS certificate so tax is withheld closer to his real long-term capital gain. He reinvests part of the gain in 54EC bonds to reduce tax, completes the Form 15CA/15CB paperwork his bank requires for the remittance, reclaims the small excess TDS on his India return, and claims a DTAA foreign tax credit on his US return so the gain isn't taxed twice in full.",
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
          "Generally yes, after applicable taxes, under the USD 1 million per financial year facility for NRO balances. That facility is not automatic: it is subject to RBI/FEMA conditions, eligible balances, payment of applicable taxes, supporting documentation and your authorised dealer bank's review. You will need bank documents plus Form 15CA, and a Form 15CB certificate from a Chartered Accountant where your particular remittance requires one — that depends on the nature, taxability and amount of the transfer rather than applying to every remittance.",
      },
      {
        question: "What documents are needed after a property sale?",
        answer:
          "Commonly the sale deed, the TDS certificate showing tax deposited under your PAN, proof of purchase cost and improvements, any lower-TDS certificate, and the Form 15CA (and Form 15CB where required) for the remittance. Keep them for your India return and any US DTAA credit claim.",
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
          body: "TCS treatment varies by purpose and applies only above the ₹10 lakh aggregate threshold per financial year. Remittances for overseas education funded by a qualifying loan under Section 80E(3)(b) are exempt from TCS collection; education not funded by such a loan, medical treatment, investment, and family maintenance are treated differently. Rates change between Finance Acts, so confirm the current-year rate for your purpose.",
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
          body: "As your status shifts, so does reporting: NRE/NRO/FCNR account rules, plus India's foreign-asset disclosure (Schedule FA), and US FBAR/FATCA if you remain a US person. Per the ITR instructions, Schedule FA generally does not need to be completed by NR or RNOR taxpayers and generally becomes relevant once you are Resident and Ordinarily Resident (ROR) — subject to the applicable return instructions for the year.",
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
        body: "Schedule FA foreign-asset disclosure generally applies once you are Resident and Ordinarily Resident (ROR) — not to NR or RNOR taxpayers — per the ITR instructions; US persons continue FBAR/FATCA. Getting reporting right matters as much as the tax itself.",
      },
    ],
    steps: [
      "Count your days physically present in India for the current financial year and across the prior several years.",
      "Enter your day counts and residency history to classify yourself as NRI, RNOR, or ROR.",
      "Estimate when your status will flip to ROR — that's the deadline for RNOR-window planning.",
      "During RNOR years, plan to realize foreign income (401(k) draws, US brokerage gains, FCNR interest) while it's largely untaxed in India.",
      "Set up correct account types (NRE/NRO/FCNR) and prepare for Schedule FA disclosure once you become Resident and Ordinarily Resident (ROR) — NR and RNOR taxpayers generally do not complete Schedule FA.",
      "Once ROR, report worldwide income and use the DTAA/Form 67 to avoid double taxation.",
    ],
    mistakes: [
      "Miscounting days in India and misclassifying your status for the year.",
      "Wasting the RNOR window — not realizing foreign income before ROR brings worldwide income into India's net.",
      "Forgetting Schedule FA foreign-asset disclosure once you become Resident and Ordinarily Resident (ROR) — though NR and RNOR taxpayers generally do not complete it.",
      "Assuming NRI/RNOR status carries over automatically — it's re-assessed every financial year.",
      "Overlooking continued US FBAR/FATCA obligations if you remain a US person.",
    ],
    example: {
      title: "Engineer returning to India after 8 years in the US",
      body: "Kavita returns to India mid-year after eight years on H-1B and a green card. On her own day counts and history she qualifies as RNOR for the next two financial years — how long RNOR lasts is not a fixed number of years and depends entirely on the section 6(6) tests applied to your own record, so it has to be re-checked every year. While it lasts, her US 401(k) withdrawals and brokerage gains are largely outside India's tax net. She uses that window to draw down part of her 401(k) and rebalance her US portfolio before ROR kicks in. She tracks her days carefully each financial year, sets up NRO/FCNR accounts, and once she becomes ROR she reports worldwide income in India and claims DTAA foreign tax credits for the US tax already paid.",
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
    updated: "2026-07-20",
    expertiseTags: ["India tax residency", "RNOR & return planning", "US-India cross-border tax"],
    quickAnswer:
      "Your India tax residency turns on days present in the Indian financial year (1 April – 31 March), not the US calendar year. You are a Resident if you spend 182 or more days in India that year, or meet a second test: 60 or more days that year plus 365 or more days across the preceding four years. That 60-day limb is relaxed to 182 days for an Indian citizen leaving India for employment abroad, and for an Indian citizen or PIO visiting India — though a visitor whose income other than from foreign sources exceeds ₹15 lakh is tested at 120 days instead. A separate deemed-residency rule can make an Indian citizen resident regardless of days if their income other than from foreign sources exceeds ₹15 lakh and they are not liable to tax in any other country. A Resident then qualifies as RNOR — the transitional status where most foreign income stays outside India's tax net — if they were a Non-Resident in 9 of the 10 preceding years, or spent 729 days or fewer in India across the preceding 7 years. How many RNOR years you get is not a fixed number: it depends entirely on your own day counts and history, and must be re-tested every financial year.",
    takeaways: [
      "Count 182 days: spending 182 or more days in India in a financial year makes you Resident for that year.",
      "Watch the second test too — 60 days in the current year plus 365 days across the previous four also makes you Resident. That 60-day limb relaxes to 182 days if you are an Indian citizen leaving for employment abroad, or an Indian citizen/PIO visiting India — but tightens to 120 days for a visitor whose income other than from foreign sources exceeds ₹15 lakh.",
      "Qualify as RNOR by being Non-Resident in 9 of the previous 10 years, or present 729 days or fewer over the previous 7 years. The 120-day visitor category and anyone caught by the deemed-residency rule are RNOR by statute.",
      "How long RNOR lasts is not a fixed number of years — it depends on your own day counts and history, and is re-tested every financial year.",
      "Time your return around March 31: arriving early in a financial year burns days that could have preserved an extra RNOR year.",
    ],
    howItWorks: {
      heading: "How this RNOR status is calculated",
      body:
        "The calculator applies the Income Tax Act's day-count tests in the order the law does, using India's April-to-March financial year rather than the US calendar year. First it decides residency: you are Resident if you were physically present in India for 182 days or more in the year being assessed, or for 60 days or more in that year combined with 365 days or more across the four preceding years. Only if you are Resident does the second test run, because RNOR is a sub-category of Resident, not an alternative to Non-Resident. There you qualify as RNOR if you were a Non-Resident in 9 out of the 10 preceding years, or if your total presence across the 7 preceding years is 729 days or fewer — meeting either condition is enough. Days are counted as days of physical presence, and part-days of arrival and departure are generally counted, which is why the tool asks for dates rather than approximate months. Two limits are worth stating: the 60-day threshold is extended to 182 days for certain Indian citizens leaving for employment abroad and for some visiting NRIs, and separate rules apply to high-income Indian citizens deemed resident. Confirm your specific facts with a CA before acting.",
    },
    connects: {
      heading: "How RNOR fits your wider return-to-India plan",
      body:
        "RNOR is the tax window that makes the sequencing of a return decision matter. Because foreign income is largely outside India's net while you are RNOR, the years you choose to withdraw from a 401(k) or IRA, sell US holdings, or repatriate savings can materially change the total tax you pay across both countries. It also interacts with US-side obligations that do not stop when you move: FBAR and FATCA reporting continue while you remain a US person, and NRE/NRO account classification has to be corrected once your residency changes.",
      links: [
        { label: "Returning to India checklist", href: "/return-to-india-checklist" },
        { label: "401(k) when returning to India", href: "/calculators/401k-return-to-india" },
        { label: "FBAR & FATCA checker", href: "/tools/fbar-fatca-checker" },
        { label: "India tax compliance for NRIs", href: "/india-tax-compliance" },
      ],
    },
    table: {
      caption: "India tax residency tests at a glance (financial year: April 1 – March 31)",
      headers: ["Status", "Test", "What India taxes"],
      rows: [
        ["Non-Resident (NRI)", "Fewer than 182 days, and not caught by the 60+365 test", "India-sourced income only"],
        ["Resident", "182+ days this year, OR 60+ days this year and 365+ days in the previous 4 years", "Depends on RNOR vs ROR below"],
        ["RNOR", "Resident, AND Non-Resident in 9 of the last 10 years OR 729 days or fewer in the last 7 years", "India income, plus foreign income only if from an India-controlled business"],
        ["ROR", "Resident and not meeting either RNOR condition", "Worldwide income"],
      ],
    },
    tables: [
      {
        caption: "Typical RNOR window after returning to India",
        headers: ["Year after return", "Usual status", "Planning implication"],
        rows: [
          ["Year of return (partial year)", "Often still Non-Resident", "Days before return do not count as presence"],
          ["Year 1 full year back", "Usually RNOR", "Foreign income largely outside India tax"],
          ["Year 2", "Usually RNOR", "Last clear year for foreign-income planning"],
          ["Year 3", "RNOR or ROR depending on day counts", "Check the 7-year 729-day test carefully"],
          ["Year 4 onward", "ROR", "Worldwide income taxable in India"],
        ],
      },
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

  /* ------------------------------------------------------------------ *
   * 8. Visa-timeline rent vs buy
   * ------------------------------------------------------------------ */
  "rent-vs-buy-immigrant": {
    slug: "rent-vs-buy-immigrant",
    appCategory: "FinanceApplication",
    keyInputs: [
      "Your visa type (H-1B, L-1, O-1, F-1 OPT, green card, etc.) and years of remaining clarity on your status",
      "Whether you have an approved I-140, your renewal confidence, and your green-card timeline",
      "Job stability and the likelihood you'd relocate for the next role",
      "Target home price, down payment, mortgage rate, and loan term",
      "Current monthly rent for a comparable place",
      "Closing costs to buy (typically ~2–5%) and selling costs to exit (typically ~6–8%)",
      "An assumed annual home-appreciation rate (kept conservative)",
    ],
    decisionWindow:
      "The decision hinges on your reliable US horizon, not a generic 30-year assumption — and for a visa holder that horizon depends on more than just a date. The tool folds in visa risk, immigration timeline, and relocation risk to produce an effective horizon that can be years shorter than your visa's face validity. Because buying costs (closing) and selling costs are fixed no matter how long you stay, a shorter or less certain effective horizon pushes the math toward renting.",
    options: {
      heading: "Why immigration status changes the rent-vs-buy math",
      items: [
        {
          label: "Fixed transaction costs",
          body: "Closing costs when you buy (often ~2–5% of price) and selling costs when you leave (agent commission plus fees, often ~6–8%) are one-time, roughly fixed amounts. The fewer years you own, the fewer months those costs get spread across — which is why a short stay rarely breaks even.",
        },
        {
          label: "The immigrant-adjusted break-even",
          body: "Standard US calculators often show buying winning after ~2–3 years. Once you layer in realistic selling costs, a conservative appreciation assumption, and your actual visa risk, the break-even for many visa holders stretches to roughly 4–7 years — sometimes longer if renewal or relocation risk is high. If your effective horizon is shorter than the break-even, renting is usually cheaper.",
        },
        {
          label: "Visa and relocation risk",
          body: "A layoff, a denied extension, an uncertain green-card timeline, or a forced move for the next job can push a sale onto someone else's timeline — sometimes into a soft market. The calculator scores this risk from your visa type, I-140 status, renewal confidence, job stability, and relocation likelihood, and shortens your effective horizon accordingly. Renting keeps that optionality; owning converts it into transaction cost and market-timing risk.",
        },
        {
          label: "What buying still offers",
          body: "If your horizon is long and reasonably secure — for example, an approved I-140 with a stable job and no planned relocation — buying builds equity, fixes your housing cost against rent inflation, and can appreciate. The calculator is meant to tell you whether your specific situation is secure enough to capture those benefits net of costs.",
        },
      ],
    },
    resultMeaning:
      "The calculator compares the total cost of renting against the total cost of buying-then-selling over your effective horizon, including closing costs, selling costs, mortgage interest, property tax, insurance, maintenance, and estimated appreciation. With the Immigrant Lens on, that horizon and the break-even are adjusted for your visa risk and relocation risk rather than using your raw visa validity; toggle it off to see the plain US-resident calculation a generic tool would show, for comparison. If buying comes out cheaper, your situation is likely past the break-even; if renting wins, the fixed transaction costs haven't had enough years to amortize, or your immigration risk shortens the horizon too much. Treat the output as a planning estimate — rates, prices, and your actual length of stay will differ.",
    taxConsequences: [
      {
        label: "US tax while you own",
        body: "As a US tax resident you can generally deduct mortgage interest and property tax if you itemize (subject to the SALT cap and the standard-deduction comparison). These deductions can lower the effective cost of owning but rarely flip a short-horizon decision on their own.",
      },
      {
        label: "Selling as a resident vs after you leave",
        body: "If you sell while still a US resident and it's your main home, you may qualify to exclude a large part of the capital gain (subject to ownership/use tests). Selling a US home after you've left the US can trigger FIRPTA withholding and a non-resident filing — a real cost to factor into an exit sale.",
      },
      {
        label: "India-side reporting",
        body: "Once you're an India tax resident (ROR), worldwide income and assets can come into scope, and US property or the sale proceeds may need reporting. During an RNOR window, foreign income is often outside India's net — timing an eventual sale matters.",
      },
    ],
    steps: [
      "Enter your visa type, I-140 status, renewal confidence, and green-card timeline so the tool can score your visa risk.",
      "Add your job stability and how likely you are to relocate for the next role — this drives relocation risk.",
      "Gather the target home price, down payment, mortgage rate, and property-tax rate for the area.",
      "Get a realistic monthly rent for a comparable home to compare against.",
      "Enter conservative closing (~2–5%) and selling (~6–8%) cost assumptions and a modest appreciation rate.",
      "Run the comparison with the Immigrant Lens on, and read the break-even against your effective horizon — buy only if it comfortably exceeds the break-even.",
      "Toggle the Immigrant Lens off to see the plain textbook number, then compare it against the risk-adjusted result to see how much your status is actually costing or saving you.",
    ],
    mistakes: [
      "Using your visa's face-validity years instead of your effective, risk-adjusted horizon.",
      "Leaving out selling costs (6–8%) — the single biggest reason short-stay buying loses.",
      "Assuming aggressive appreciation to make the numbers work.",
      "Ignoring the forced-sale risk of a layoff, denied extension, uncertain green-card timeline, or relocation.",
      "Forgetting FIRPTA withholding and a non-resident tax filing if you sell after leaving the US.",
      "Comparing a mortgage payment to rent without counting property tax, insurance, maintenance, and closing/selling costs.",
    ],
    example: {
      title: "H-1B holder deciding whether to buy a $450k home",
      body: "Priya is on an H-1B with an approved I-140 and a green-card timeline of 2–5 years, stable employment, and no planned relocation — a relatively low-risk profile. A $450,000 home means roughly $9,000–$22,500 in closing costs to buy and, at 6–8%, about $27,000–$36,000 in selling costs to exit before any market move. With the Immigrant Lens on, her low visa and relocation risk keep her effective horizon close to her stated years of clarity, and the calculator shows buying edging out renting once those fixed costs amortize and equity builds. A colleague on an F-1 OPT with an uncertain renewal and high relocation risk would see a much shorter effective horizon and a break-even that's harder to clear — even with an identical home price and mortgage rate.",
    },
    table: {
      caption: "How the answer typically shifts with your effective, risk-adjusted horizon (illustrative, not a guarantee)",
      headers: ["Effective horizon", "Typical lean", "Why"],
      rows: [
        ["Under 3 years", "Rent", "Closing + selling costs can't amortize over so few years"],
        ["3–5 years", "It depends", "Near the break-even — appreciation, rent level, and rate decide it"],
        ["5–7+ years", "Buying often works", "Enough years for equity and appreciation to outrun fixed costs"],
        ["Uncertain / high visa or relocation risk", "Lean rent", "Forced-sale risk turns fixed costs into real losses"],
      ],
    },
    relatedLinks: [
      { label: "India property capital-gains calculator", href: "/calculators/india-property-capital-gains" },
      { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
      { label: "Green card tracker", href: "/tools/green-card-tracker" },
    ],
    faqs: [
      {
        question: "Should I buy a house on an H-1B or other visa?",
        answer:
          "There's no legal barrier — visa holders can and do buy US homes. The real question is financial: buying usually only pays off if your effective horizon — adjusted for visa and relocation risk, not just your visa's face validity — comfortably exceeds the break-even (often around 4–7 years once selling costs are included). If your risk-adjusted timeline is short or uncertain, renting is typically cheaper and keeps your options open.",
      },
      {
        question: "Why is the break-even longer for visa holders than standard calculators show?",
        answer:
          "Standard US calculators often assume a long, certain stay and light selling costs, so buying can look like it wins after 2–3 years. Once you use realistic selling costs (6–8%), conservative appreciation, and account for genuine visa and relocation risk, the break-even for many visa holders stretches to roughly 4–7 years — and longer still for anyone with an uncertain renewal, no I-140, or a high chance of relocating.",
      },
      {
        question: "What does the 'Immigrant Lens' toggle actually change?",
        answer:
          "With it on, the calculator scores your visa type, I-140 status, renewal confidence, green-card timeline, job stability, and relocation likelihood into a visa-risk and relocation-risk score, shortens your effective horizon accordingly, and adds a break-even risk premium. Turn it off to see the plain US-resident calculation — the textbook number a generic calculator would show — so you can see exactly how much your immigration situation is changing the answer.",
      },
      {
        question: "What happens if I have to leave the US and sell the home?",
        answer:
          "Selling after you've left the US can trigger FIRPTA withholding on the sale proceeds and a US non-resident tax filing, on top of the usual 6–8% selling costs. A forced sale on a short timeline — or into a weak market — is the main way buying on a visa loses money, which is why the tool weights visa and relocation risk so heavily.",
      },
      {
        question: "Can I get a mortgage on a work visa?",
        answer:
          "Yes. Many US lenders offer mortgages to H-1B, L-1, and other visa holders, often with standard down payments if you have US credit history and stable income. Terms can vary by lender and visa type, so it's worth comparing a few. The calculator focuses on whether buying makes sense at all for your situation, not on loan approval.",
      },
      {
        question: "Is renting really 'throwing money away'?",
        answer:
          "Not on a short or uncertain timeline. Renting buys flexibility and avoids the large fixed costs of buying and selling. If you'd owe ~2–5% to buy and ~6–8% to sell within a few years — or face real visa or relocation risk — those transaction costs can easily exceed the equity you'd build, so renting is often the financially rational choice, not a waste.",
      },
      {
        question: "How accurate are these estimates?",
        answer:
          "Treat the output as a planning estimate, not a guarantee. It depends on assumptions you enter — appreciation, rates, and especially how long you actually stay — plus the visa-risk scoring, which is a simplified model of a genuinely uncertain situation. Use conservative inputs, stress-test a shorter horizon, and confirm specifics with a mortgage professional and immigration attorney before deciding.",
      },
    ],
  },
};

export function getCalculatorContent(slug: string): CalculatorContent | undefined {
  return calculatorContent[slug];
}
