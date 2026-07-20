/**
 * Rich, immigration-focused SEO content for the tool hub pages. Turns each
 * thin tool into a mini-hub: quick answer first, then the tool, then a
 * step-by-step process, timeline, fees/costs (where relevant), a document
 * checklist, common mistakes, curated internal links, and page-specific FAQs
 * (which also drive the FAQPage JSON-LD).
 *
 * Immigration fees, forms, and processing times change constantly, so every
 * number here is deliberately an estimate/range with a "verify before filing"
 * pointer to the official source. Nothing here is legal advice.
 */

import { officialSources } from "@/data/siteWideVerifiedNumbers";

export interface ToolBullet {
  label: string;
  body: string;
}

export interface ToolLink {
  label: string;
  href: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolTimelineRow {
  stage: string;
  estimate?: string;
  notes?: string;
}

export interface ToolTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ToolHubContent {
  slug: string;
  /** SoftwareApplication category. */
  appCategory: "BusinessApplication" | "ReferenceApplication" | "FinanceApplication";
  /** Unique schema description for this page. */
  description: string;
  /** Plain-English quick answer shown above the tool. */
  quickAnswer: string;
  /** 2–3 sentence intro shown above the tool. */
  shortDescription: string;
  /** Who this tool is for. */
  audience: string;
  /** Key inputs / documents needed, shown above the tool. */
  keyInputs: string[];
  /** Estimated timeline or fee-range line shown above the tool. */
  timelineFeeNote?: string;
  /** Plain-English "what your result means" shown first after the tool. */
  resultMeaning?: string;
  /** Optional reference/comparison table shown after the tool. */
  table?: ToolTable;
  /** Additional reference tables rendered after `table`. */
  tables?: ToolTable[];
  /** Explainer breakdown shown after the tool. */
  explain?: { heading: string; items: ToolBullet[] };
  /** Ordered step-by-step process. */
  steps: string[];
  /** Optional stage-by-stage timeline. */
  timeline?: { title: string; intro?: string; rows: ToolTimelineRow[] };
  /** Optional fees / costs section. */
  fees?: {
    heading: string;
    items: ToolBullet[];
    note?: string;
    sourceUrl?: string;
    sourceName?: string;
  };
  /** Optional document checklist. */
  documents?: { heading: string; items: string[] };
  /** Common mistakes to avoid. */
  mistakes: string[];
  /** Optional worked example. */
  example?: { title: string; body: string };
  /** Curated internal links shown before the FAQ. */
  relatedLinks: ToolLink[];
  /** Page-specific FAQs — also emitted as FAQPage JSON-LD. */
  faqs: ToolFaqItem[];
  /**
   * ISO date this hub's content and figures were last verified. Renders the
   * byline row ("Reviewed by … · Updated … · verified") above the tool.
   */
  updated?: string;
  /** Expertise tags for the author bio box at the foot of the page. */
  expertiseTags?: string[];
  /**
   * Plain-language explanation of the formula, inputs, and assumptions behind
   * the tool's output — rendered directly under the tool. Required for
   * calculator-style tools; this is what makes the page citable.
   */
  howItWorks?: { heading: string; body: string };
  /** Key takeaways: 4–5 standalone facts, each with a specific number. */
  takeaways?: string[];
  /**
   * How this topic interacts with adjacent processes. `body` is plain prose;
   * `links` render below it as contextual internal links.
   */
  connects?: { heading: string; body: string; links: ToolLink[] };
}

export const toolHubContent: Record<string, ToolHubContent> = {
  /* ------------------------------------------------------------------ *
   * 1. Citizenship checklist (N-400)
   * ------------------------------------------------------------------ */
  "citizenship-checklist": {
    slug: "citizenship-checklist",
    appCategory: "BusinessApplication",
    description:
      "Interactive US citizenship (N-400) eligibility and document checklist — continuous residence, physical presence, good moral character, English/civics, and filing steps for green card holders, including NRIs.",
    quickAnswer:
      "Most green card holders can apply for US citizenship once they meet continuous residence, physical presence, good moral character, English and civics, and filing requirements — generally after 5 years as a permanent resident (or 3 years if married to and living with a US citizen).",
    shortDescription:
      "Naturalization has a handful of hard requirements that trip people up — days outside the US, tax filing, and continuous residence. This checklist walks through eligibility and the documents you'll need for Form N-400, then explains the process end to end.",
    audience:
      "Green card holders — including NRIs and Indian-origin permanent residents — checking whether they're eligible to naturalize and what to gather before filing Form N-400.",
    keyInputs: [
      "Date you became a permanent resident (green card 'resident since' date)",
      "Whether you're applying under the 5-year rule or the 3-year marriage rule",
      "A list of every trip outside the US (dates and durations)",
      "Tax filing history for the qualifying period",
      "Selective Service registration status (if applicable)",
      "Any arrests, citations, or legal issues (good moral character)",
    ],
    timelineFeeNote:
      "Estimated end-to-end time is often ~8–14 months, but it varies widely by field office. The N-400 filing fee changes periodically — always confirm the current amount on the official USCIS fee schedule before filing.",
    explain: {
      heading: "Eligibility checklist — what you must meet",
      items: [
        {
          label: "5-year rule",
          body: "Most applicants qualify after 5 years as a green card holder. You generally must not have filed too early — USCIS allows filing up to 90 days before you hit the required period.",
        },
        {
          label: "3-year marriage rule",
          body: "If you've been a permanent resident for 3 years and have been married to and living with the same US citizen for those 3 years, you may qualify under the shorter rule.",
        },
        {
          label: "Physical presence",
          body: "You typically must have been physically present in the US for at least half of the qualifying period (about 30 months out of 5 years, or 18 out of 3).",
        },
        {
          label: "Continuous residence",
          body: "Long trips can break continuous residence. A single trip of 6+ months can raise questions, and 12+ months usually breaks it unless you took specific steps to preserve residence.",
        },
        {
          label: "Selective Service (if applicable)",
          body: "Most men who lived in the US between ages 18 and 26 were required to register with Selective Service. Failure to register can affect good moral character findings.",
        },
        {
          label: "Tax filing history",
          body: "You should have filed required federal (and state) tax returns and not owe taxes without a payment plan. Claiming to be a 'non-resident' on taxes can undermine a naturalization case.",
        },
        {
          label: "Trips outside the US",
          body: "Keep an accurate list of every departure and return. USCIS uses it to test both physical presence and continuous residence, and gaps or errors cause delays.",
        },
      ],
    },
    steps: [
      "Confirm eligibility (5-year or 3-year rule, physical presence, continuous residence).",
      "Gather documents — green card, travel history, tax records, and any legal records.",
      "Prepare and file Form N-400 (online or by mail).",
      "Attend the biometrics appointment (fingerprints and photo).",
      "Attend the interview and take the English and civics tests.",
      "Receive the decision, then attend the oath of allegiance ceremony to become a citizen.",
    ],
    timeline: {
      title: "Estimated naturalization timeline",
      intro: "Ranges only — actual times depend heavily on your USCIS field office.",
      rows: [
        { stage: "File N-400", estimate: "Day 0", notes: "Online or paper filing; you can file up to 90 days early." },
        { stage: "Biometrics", estimate: "~3–8 weeks after filing", notes: "Fingerprints and photo; some cases are waived." },
        { stage: "Interview + tests", estimate: "~5–12 months after filing", notes: "English and civics tests; bring updated documents." },
        { stage: "Oath ceremony", estimate: "Days to weeks after approval", notes: "You become a US citizen at the oath." },
      ],
    },
    fees: {
      heading: "Fees — verify before filing",
      items: [
        {
          label: "N-400 filing fee",
          body: "USCIS charges a filing fee for Form N-400 that changes periodically and may differ for online vs paper filing. A fee reduction or waiver may be available for lower-income applicants.",
        },
        {
          label: "Biometrics",
          body: "Biometrics costs are often bundled into the filing fee under the current fee schedule, but this has changed over time — check the current rule.",
        },
      ],
      note: "Immigration fees change. Always confirm the current N-400 fee and any reduction/waiver on the official USCIS fee schedule before filing.",
      sourceUrl: officialSources.uscisFeeSchedule,
      sourceName: "USCIS Fee Schedule (G-1055)",
    },
    documents: {
      heading: "Document checklist",
      items: [
        "Green card (Permanent Resident Card), front and back",
        "A complete list of trips outside the US for the qualifying period",
        "Tax returns / tax transcripts for the qualifying years",
        "Marriage certificate and spouse's proof of citizenship (3-year rule)",
        "Any court or police records for arrests, citations, or charges",
        "Selective Service registration confirmation (if applicable)",
        "Current and prior addresses and employment history",
      ],
    },
    mistakes: [
      "Filing too early — before you've met the required 5 or 3 years (minus the 90-day window).",
      "Under-counting or misremembering trips outside the US, which breaks physical presence math.",
      "Ignoring a long trip (6+ months) that can disrupt continuous residence.",
      "Not filing required tax returns, or filing as a 'non-resident' while claiming green-card status.",
      "Overlooking Selective Service registration for men who lived in the US at the relevant ages.",
      "Assuming an old arrest doesn't matter — disclose everything; non-disclosure is worse.",
    ],
    relatedLinks: [
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
      { label: "USCIS notice decoder", href: "/tools/uscis-notice-decoder" },
      { label: "Green card wait-time tracker", href: "/tools/green-card-tracker" },
    ],
    table: {
      caption: "N-400 naturalization requirements and fees at a glance",
      headers: ["Requirement", "Standard (5-year) path", "Married to US citizen (3-year) path"],
      rows: [
        ["Time as a permanent resident", "5 years", "3 years"],
        ["Physical presence in the US", "At least 30 months", "At least 18 months"],
        ["Continuous residence", "Unbroken for the full period", "Unbroken for the full period"],
        ["Earliest filing", "90 days before you complete 5 years", "90 days before you complete 3 years"],
        ["State/district residence", "3 months before filing", "3 months before filing"],
        ["N-400 filing fee", "$760 online / $710 paper", "$760 online / $710 paper"],
        ["Tests at interview", "English + civics (6 of 10 correct)", "English + civics (6 of 10 correct)"],
      ],
    },
    updated: "2026-07-19",
    expertiseTags: ["Naturalization & N-400", "USCIS filing requirements", "Green card to citizenship"],
    takeaways: [
      "Budget $760 to file Form N-400 online ($710 by paper), which includes biometrics, per the USCIS fee schedule.",
      "Meet the residence rule first: 5 years as a permanent resident, or 3 years if you are married to and living with a US citizen.",
      "Count your days — you need physical presence in the US for at least half the qualifying period (30 months of 5 years, or 18 months of 3).",
      "File up to 90 days early: USCIS accepts the N-400 three months before you complete the residence requirement.",
      "Prepare for two tests at the interview — English (reading, writing, speaking) and 100-question civics, with 6 of 10 correct to pass.",
    ],
    howItWorks: {
      heading: "How this citizenship checklist is built",
      body:
        "The checklist maps your answers onto the statutory N-400 requirements rather than scoring you. Your green card date and marital basis select the residence track (5 years, or 3 years married to a US citizen), and the tool then applies the two separate clocks that trip most applicants: continuous residence, which absences of 6 months or more can break, and physical presence, which requires at least half the qualifying period on US soil. Your answers about travel, taxes, selective service, and legal history flag the good-moral-character items USCIS examines. The document list is assembled from the official N-400 instructions for your specific situation — name changes, prior marriages, tax balances, and trips abroad each add their own evidence. Fees shown come from the current USCIS fee schedule. Nothing is stored, and the tool never asks for your A-number.",
    },
    connects: {
      heading: "How naturalization connects to your green card and travel",
      body:
        "Citizenship eligibility runs on the clock that started the day you became a permanent resident, so anything that disturbs that status disturbs the timeline — long trips abroad can break continuous residence, and an expired card complicates I-9 and travel even though your status continues. Renewing the green card and applying for citizenship are separate filings with separate fees, and many people do both when a card expires mid-process.",
      links: [
        { href: "/green-card-renewal", label: "Green card renewal (Form I-90)" },
        { href: "/expired-green-card", label: "Travelling with an expired green card" },
        { href: "/uscis/case-status", label: "USCIS case status meaning" },
        { href: "/uscis/processing-times", label: "USCIS processing times" },
      ],
    },
    faqs: [
      {
        question: "When can I apply for US citizenship?",
        answer:
          "Most green card holders can apply after 5 years as a permanent resident, or 3 years if married to and living with a US citizen for that time. USCIS lets you file up to 90 days before you reach the required period, as long as you also meet physical presence and continuous residence rules.",
      },
      {
        question: "What documents are needed for the N-400?",
        answer:
          "Commonly your green card, a complete list of trips outside the US, tax returns or transcripts, marriage and spouse citizenship proof (for the 3-year rule), any court/police records, and Selective Service confirmation if applicable. Gathering an accurate travel history is the step most people underestimate.",
      },
      {
        question: "How long does US citizenship take?",
        answer:
          "As a rough estimate it often takes about 8–14 months from filing to the oath, but it varies a lot by USCIS field office. The interview and tests are usually the longest wait. Check current processing times for your field office before assuming a date.",
      },
      {
        question: "Can long trips outside the US affect citizenship?",
        answer:
          "Yes. Trips of 6 months or more can raise questions about continuous residence, and trips of 12 months or more usually break it unless you took specific steps to preserve residence. USCIS also uses your travel history to check physical presence, so keep accurate dates.",
      },
      {
        question: "Do I need tax returns for citizenship?",
        answer:
          "Generally yes. You should have filed required federal and state tax returns for the qualifying period and not owe taxes without a payment plan. Filing as a 'non-resident' while holding a green card can undermine a naturalization case, so bring your tax records.",
      },
      {
        question: "What happens at the citizenship interview?",
        answer:
          "A USCIS officer reviews your N-400, verifies your documents and travel history, and administers the English test (reading, writing, speaking) and the civics test. If you pass and are approved, you're scheduled for the oath ceremony, where you officially become a US citizen.",
      },
      {
        question: "What documents do I need for the N-400 citizenship application?",
        answer:
          "At minimum: a copy of both sides of your green card, the $760 online filing fee, and evidence for anything that applies to you — marriage certificate and your spouse's proof of citizenship for the 3-year path, divorce decrees, legal name-change documents, tax transcripts if you owe or filed late, selective service registration for men who lived here between 18 and 26, and a full list of trips outside the US.",
      },
      {
        question: "What are the naturalization requirements in 2026?",
        answer:
          "Be at least 18, hold a green card for 5 years (or 3 if married to and living with a US citizen), have physical presence in the US for at least half that period, keep continuous residence unbroken, live in your state or district for 3 months, show good moral character, and pass the English and civics tests. You may file up to 90 days before completing the residence period.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 2. Green card tracker (priority dates / visa bulletin)
   * ------------------------------------------------------------------ */
  "green-card-tracker": {
    slug: "green-card-tracker",
    appCategory: "ReferenceApplication",
    description:
      "Green card wait-time tracker for Indian applicants — estimate EB1/EB2/EB3 waits from your priority date, country of chargeability, and visa bulletin movement (final action vs dates for filing).",
    quickAnswer:
      "The green card wait for Indian-born applicants depends on your category (EB1/EB2/EB3), country of chargeability, priority date, how the monthly visa bulletin moves, and whether USCIS accepts the 'Dates for Filing' chart that month. India's employment categories are heavily backlogged, so waits are measured in years.",
    shortDescription:
      "India's employment-based green card queues are among the longest in the world. This tracker helps you place your priority date against visa bulletin movement so you can estimate where you stand — and understand why the wait is so long.",
    audience:
      "Indian-born EB1/EB2/EB3 applicants (and their families) tracking priority dates and visa bulletin movement to estimate their green card wait.",
    keyInputs: [
      "Your green card category (EB1, EB2, or EB3)",
      "Your country of chargeability (usually India for India-born applicants)",
      "Your priority date (PERM filing date, or I-140 date for EB1)",
      "The current visa bulletin final action and filing dates",
      "Whether USCIS is accepting the 'Dates for Filing' chart this month",
    ],
    timelineFeeNote:
      "Waits for India EB2/EB3 are commonly estimated in the 10+ year range and shift with each monthly visa bulletin. These are estimates only — the queue can move forward, stall, or retrogress month to month.",
    explain: {
      heading: "Key concepts for reading the queue",
      items: [
        {
          label: "Priority date",
          body: "Your place in line — usually the date your PERM labor certification was filed (or the I-140 date for categories without PERM). Your priority date must become 'current' before a green card number is available.",
        },
        {
          label: "Final action date",
          body: "The date the visa bulletin says green cards are actually being approved for. When your priority date is earlier than the final action date, a visa number can be issued.",
        },
        {
          label: "Dates for filing",
          body: "A separate, usually earlier chart that lets you submit your I-485 (adjustment of status) sooner — but only in months when USCIS announces it will accept that chart.",
        },
        {
          label: "EB1, EB2, EB3",
          body: "Employment categories with different requirements and queues. EB1 (extraordinary ability / multinational managers) is usually faster; EB2 (advanced degree) and EB3 (skilled workers) are deeply backlogged for India.",
        },
        {
          label: "Retrogression",
          body: "When demand exceeds supply, the visa bulletin can move backward, pushing final action dates to an earlier date. A category that was current can retrogress, delaying cases.",
        },
        {
          label: "Porting EB3 ↔ EB2",
          body: "In some cases applicants 'port' between EB2 and EB3 (interfiling a second I-140) to take advantage of whichever category is moving faster, keeping their original priority date.",
        },
      ],
    },
    steps: [
      "Identify your category (EB1/EB2/EB3) and country of chargeability.",
      "Find your priority date (usually your PERM filing date).",
      "Open the current monthly visa bulletin and locate your category/country row.",
      "Compare your priority date against the final action date and the dates-for-filing date.",
      "Check whether USCIS is accepting the 'Dates for Filing' chart this month for I-485 filing.",
      "Re-check every month — the bulletin updates monthly and can advance or retrogress.",
    ],
    timeline: {
      title: "Employment green card stages",
      intro: "The typical path, and where the visa bulletin controls timing.",
      rows: [
        { stage: "PERM labor certification", estimate: "Sets your priority date", notes: "Filed by the employer with the DOL." },
        { stage: "I-140 petition", estimate: "Months", notes: "Employer petition; establishes the category." },
        { stage: "Priority date wait", estimate: "Years (India EB2/EB3)", notes: "Governed by the monthly visa bulletin." },
        { stage: "I-485 / adjustment", estimate: "After date is current (or filing chart)", notes: "Final green card step; can file early if the filing chart is open." },
      ],
    },
    documents: {
      heading: "What to keep on hand",
      items: [
        "Your PERM / labor certification approval (priority date)",
        "Your I-140 approval notice and category",
        "Prior USCIS receipt notices for your case",
        "The current month's visa bulletin (State Department)",
        "Any I-485 receipt if adjustment is already filed",
      ],
    },
    mistakes: [
      "Confusing the 'Dates for Filing' chart with the 'Final Action' chart — only final action lets a green card be approved.",
      "Assuming you can file I-485 whenever the filing chart moves — USCIS must announce it accepts that chart that month.",
      "Ignoring retrogression risk and assuming the queue only moves forward.",
      "Using the wrong priority date (e.g., the I-140 date instead of the PERM date where PERM applies).",
      "Overlooking EB2↔EB3 porting when one category is moving faster.",
    ],
    example: {
      title: "EB2 India priority date example",
      body: "Suppose your PERM was filed in 2014, giving you an EB2-India priority date of that year. Each month you compare that date to the EB2-India final action date in the visa bulletin. If the bulletin's final action date is still earlier than yours, you keep waiting; if it advances past your date, a visa number becomes available and your I-485 can move to approval. If EB3-India is temporarily ahead of EB2-India, some applicants file a second I-140 to port to EB3 while keeping the 2014 priority date.",
    },
    relatedLinks: [
      { label: "Priority date checker", href: "/tools/priority-date-checker" },
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS case status meaning", href: "/tools/uscis-case-status-meaning" },
      { label: "USCIS receipt number decoder", href: "/tools/uscis-receipt-number-decoder" },
    ],
    table: {
      caption: "What drives the India green card wait",
      headers: ["Factor", "Figure", "Effect on your wait"],
      rows: [
        ["Employment green cards per year (worldwide)", "~140,000", "Fixed ceiling set by statute"],
        ["Per-country cap", "7% (~9,800 for India, all EB categories)", "The single biggest cause of the India backlog"],
        ["EB-1 worldwide share", "28.6% (~40,040)", "Shortest India queue of the three categories"],
        ["EB-2 / EB-3 worldwide share", "28.6% each", "Deepest India backlogs — often a decade or more"],
        ["Bulletin publication", "8th–10th monthly, effective next month", "When your cutoff can move"],
        ["Typical annual cutoff movement (EB-2 India)", "1–3 months per calendar year", "Why estimates run to decades for new filings"],
      ],
    },
    updated: "2026-07-19",
    expertiseTags: ["Green card backlog analysis", "Visa bulletin data", "Employment-based immigration"],
    takeaways: [
      "Expect the India queue to be governed by one number: the 7% per-country cap, about 9,800 employment green cards a year across EB-1, EB-2 and EB-3 combined.",
      "Compare against both charts each month — Final Action Dates control approval, Dates for Filing control when you may submit the I-485.",
      "Treat any wait estimate as a scenario, not a promise: cutoffs can retrogress, and EB-2 India was marked Unavailable in the July 2026 bulletin.",
      "Check the new bulletin around the 8th–10th of each month; it takes effect the following month.",
      "Keep your I-140 approved — it lets you retain your priority date across employers and categories, including an EB-3 downgrade.",
    ],
    howItWorks: {
      heading: "How this green card wait time is calculated",
      body:
        "The tracker projects forward from published Department of State data, not from crowd-sourced reports. It reads the current month's Final Action Date and Dates for Filing for your category and country from the same central bulletin dataset used across this site, then measures historical movement: how many months of cutoff advancement each category has actually delivered per calendar year, taken from the change-point history of past bulletins. Dividing the gap between your priority date and the current cutoff by that observed velocity produces the estimate, and the tool shows an optimistic and pessimistic band because velocity is volatile rather than linear. Three limits are built in deliberately: months marked Unavailable contribute no movement, retrogression can push a date backward and reset the math, and estimates are capped rather than extrapolated indefinitely for the deepest backlogs. Nothing here predicts policy or legislative change.",
    },
    connects: {
      heading: "How the tracker fits your actual filing decisions",
      body:
        "A wait estimate only matters next to the filings it gates. Your priority date is set at PERM filing, carried by the approved I-140, and cashed in at I-485 — so the tracker tells you roughly when the I-485 window opens, while USCIS processing times tell you how long each form itself takes. If the estimate is long, the practical levers are a category change (EB-1 or an EB-3 downgrade), H-1B extensions beyond six years on the approved I-140, and CSPA planning for children who may age out.",
      links: [
        { href: "/tools/priority-date-checker", label: "Priority Date Checker" },
        { href: "/visa-bulletin/eb2-india", label: "EB-2 India priority date" },
        { href: "/visa-bulletin/eb1-india", label: "EB-1 India priority date" },
        { href: "/visa-bulletin/eb2-to-eb3-downgrade", label: "EB-2 to EB-3 downgrade" },
        { href: "/i485-timeline", label: "I-485 timeline" },
      ],
    },
    faqs: [
      {
        question: "Why is the India green card wait so long?",
        answer:
          "Employment green cards are capped per country per year, and demand from India far exceeds that per-country limit. The result is a backlog in EB2 and EB3 for India that is measured in many years, because far more people qualify each year than there are visa numbers available to them.",
      },
      {
        question: "What is a priority date?",
        answer:
          "Your priority date is your place in the green card line — usually the date your PERM labor certification was filed (or the I-140 date for categories without PERM). A green card number only becomes available once your priority date is earlier than the visa bulletin's final action date for your category and country.",
      },
      {
        question: "What is the visa bulletin?",
        answer:
          "The visa bulletin is a monthly State Department publication that shows which priority dates are current for each green card category and country. It has two charts — 'Final Action Dates' (when green cards can be approved) and 'Dates for Filing' (when you may be able to submit your I-485).",
      },
      {
        question: "Can EB3 move faster than EB2?",
        answer:
          "Sometimes, yes. Because EB2 and EB3 for India move independently based on demand, EB3 can occasionally be ahead of EB2 (or vice versa). Some applicants 'port' between the two by filing a second I-140 to use the faster category while keeping their original priority date.",
      },
      {
        question: "Can I file I-485 before the final action date?",
        answer:
          "Only if two things line up: your priority date is current on the 'Dates for Filing' chart, and USCIS has announced it will accept that chart for the month. When both are true you can file the I-485 earlier, which can unlock work and travel benefits while you wait for final approval.",
      },
      {
        question: "What does retrogression mean?",
        answer:
          "Retrogression is when the visa bulletin moves backward — the final action date for a category becomes earlier than it was. It happens when demand outpaces the available visa numbers, and it can delay cases that looked close to approval, especially for heavily backlogged categories like India EB2/EB3.",
      },
      {
        question: "How long is the green card wait time for India?",
        answer:
          "It depends entirely on your category and priority date. EB-1 India has recently sat a few years back, while EB-2 and EB-3 India cutoffs sit around a decade or more back — and EB-2 India was marked Unavailable in the July 2026 bulletin. The structural cause is the 7% per-country cap, roughly 9,800 employment green cards a year for India across all categories.",
      },
      {
        question: "How is the green card wait time calculated?",
        answer:
          "This tracker measures the gap between your priority date and the current Final Action Date, then divides it by how fast that category's cutoff has actually moved in past bulletins. Because movement is volatile — often only 1 to 3 months of advancement per calendar year for EB-2 India — the result is shown as an optimistic-to-pessimistic band rather than a single date.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 3. H-1B lottery timeline
   * ------------------------------------------------------------------ */
  "h1b-lottery-timeline": {
    slug: "h1b-lottery-timeline",
    appCategory: "ReferenceApplication",
    description:
      "H-1B cap season timeline and lottery-odds explorer — registration, selection, LCA, petition filing window, premium processing, and the October 1 start date for cap-subject H-1B employment.",
    quickAnswer:
      "H-1B cap season generally runs: employer electronic registration in the spring, a lottery selection, then selected registrations file the full petition during a filing window, followed by approval/denial/RFE, and an October 1 earliest start date for cap-subject employment.",
    shortDescription:
      "The H-1B cap process is a fixed annual cycle with a registration window, a random lottery, and a petition-filing period. This page lays out the timeline, who does what, the fees involved, and realistic odds so you can plan around cap season.",
    audience:
      "Prospective H-1B workers (including F-1 students on OPT) and employers planning around the annual H-1B cap registration and lottery — with a focus on Indian applicants.",
    keyInputs: [
      "Whether you have a sponsoring employer for cap season",
      "Your degree level (a US master's may qualify for the advanced-degree bonus)",
      "The job's SOC code and worksite (for the LCA)",
      "Whether the employer plans to use premium processing",
      "Your current status and work-authorization dates (e.g., OPT/STEM OPT end date)",
    ],
    timelineFeeNote:
      "The cap cycle is roughly: registration in March, selections announced by late March, petition filing from April 1 into June, and an October 1 earliest start. Exact dates are set by USCIS each year — verify the current-year schedule before relying on it.",
    explain: {
      heading: "Who does what in cap season",
      items: [
        {
          label: "Employer account & registration",
          body: "The sponsoring employer creates a USCIS account and electronically registers each beneficiary during the registration window, paying the registration fee. Workers cannot register themselves.",
        },
        {
          label: "Beneficiary registration",
          body: "Each candidate is registered by the employer with basic biographical details. USCIS runs a beneficiary-centric selection so a person isn't advantaged by multiple registrations.",
        },
        {
          label: "Selection notice",
          body: "If selected in the lottery, the registration status changes to 'Selected,' and the employer becomes eligible to file the full H-1B petition for that beneficiary within the filing window.",
        },
        {
          label: "LCA",
          body: "Before filing, the employer obtains a certified Labor Condition Application (LCA) from the Department of Labor attesting to the wage and worksite.",
        },
        {
          label: "Petition filing",
          body: "The employer files the Form I-129 H-1B petition with supporting evidence during the filing window that opens April 1.",
        },
        {
          label: "Premium processing (optional)",
          body: "For an extra fee, premium processing gives a faster adjudication decision. It's optional and speeds the decision, not the start date.",
        },
        {
          label: "Start date",
          body: "Cap-subject H-1B employment can generally begin no earlier than October 1 of that fiscal year, even if approved earlier.",
        },
      ],
    },
    steps: [
      "Line up a sponsoring employer before registration opens (usually early March).",
      "Employer registers you electronically and pays the registration fee.",
      "Wait for the lottery selection results (typically by late March).",
      "If selected, the employer obtains a certified LCA from the DOL.",
      "Employer files the Form I-129 petition during the filing window (from April 1).",
      "Optionally use premium processing for a faster decision; if approved, begin cap-subject work on or after October 1.",
    ],
    timeline: {
      title: "H-1B cap season timeline (typical)",
      intro: "Dates are set by USCIS each year — confirm the current-year schedule.",
      rows: [
        { stage: "Registration", estimate: "~March", notes: "Employer registers beneficiaries; registration fee due." },
        { stage: "Selection (lottery)", estimate: "By late March", notes: "Random selection; status shows 'Selected'." },
        { stage: "Petition filing window", estimate: "April 1 into June", notes: "Employer files Form I-129 with the LCA." },
        { stage: "Earliest start date", estimate: "October 1", notes: "Cap-subject employment can begin." },
      ],
    },
    fees: {
      heading: "Who pays — and what's optional",
      items: [
        {
          label: "Employer-paid fees",
          body: "Certain H-1B costs are legally the employer's responsibility, including the registration fee and key petition filing fees. Employers generally cannot pass these required costs to the worker.",
        },
        {
          label: "Optional premium processing",
          body: "Premium processing is an optional add-on for a faster decision. Who pays can depend on the situation, but it is not a required cost of the petition.",
        },
      ],
      note: "Fees change and specific cost-shifting rules apply. Confirm current H-1B fees on the official USCIS source and consult an immigration attorney about who may pay what — this is not legal advice.",
      sourceUrl: officialSources.uscisFormI129,
      sourceName: "USCIS Form I-129 (H-1B)",
    },
    mistakes: [
      "Assuming you can register yourself — only an employer can register and file.",
      "Missing the registration window because a sponsor wasn't lined up in time.",
      "Treating selection as approval — a selected registration still needs a filed, approved petition.",
      "Expecting to start before October 1 for cap-subject employment.",
      "Confusing premium processing (faster decision) with a faster start date.",
    ],
    relatedLinks: [
      { label: "H-1B transfer risk checklist", href: "/tools/h1b-transfer-risk-checklist" },
      { label: "H-1B salary explorer", href: "/tools/h1b-salaries" },
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
    ],
    faqs: [
      {
        question: "When is H-1B lottery registration?",
        answer:
          "The electronic registration window typically opens in early-to-mid March each year and lasts a few weeks, with selections announced by late March. Exact dates are set by USCIS annually, so confirm the current-year schedule before planning around it.",
      },
      {
        question: "Who can register for the H-1B lottery?",
        answer:
          "Only a sponsoring employer can register a beneficiary — workers cannot register themselves. The employer creates a USCIS account, registers each candidate with basic details, and pays the registration fee during the window.",
      },
      {
        question: "What happens after selection?",
        answer:
          "If your registration is selected, the employer can file the full H-1B petition (Form I-129) during the filing window, after obtaining a certified LCA from the Department of Labor. Selection is only the eligibility to file — the petition still has to be filed and approved.",
      },
      {
        question: "Can I pay for my own H-1B?",
        answer:
          "Certain H-1B costs are legally the employer's responsibility and generally cannot be shifted to the worker. Some optional costs, like premium processing, can be handled differently. Because the rules on who may pay what are specific, confirm your situation with an immigration attorney — this is educational information, not legal advice.",
      },
      {
        question: "What are the H-1B lottery odds?",
        answer:
          "Odds vary year to year based on how many registrations are submitted against the annual cap. In recent high-demand years the selection chance has often been well below 50%, and the advanced-degree (US master's) bonus can improve chances. Treat any odds estimate as approximate.",
      },
      {
        question: "When can an H-1B worker start?",
        answer:
          "For cap-subject H-1B employment, the earliest start date is generally October 1 of that fiscal year, even if the petition is approved earlier in the summer. Premium processing speeds up the decision but does not move the October 1 start date.",
      },
      {
        question: "What happens if I'm not selected in the H-1B lottery?",
        answer:
          "Unselected registrations aren't carried forward — you'd need to be registered again the next cap season. In the meantime, options can include staying on OPT/STEM OPT if eligible, working for a cap-exempt employer (like a university or nonprofit research organization), or exploring other visa categories. Discuss your situation with an immigration attorney.",
      },
      {
        question: "What is a cap-exempt H-1B employer?",
        answer:
          "Cap-exempt employers — commonly universities, affiliated nonprofits, and nonprofit or government research organizations — can file H-1B petitions year-round without going through the lottery cap. Working cap-exempt first and later moving to a cap-subject employer is one strategy when lottery odds are uncertain.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 4. H-1B salaries
   * ------------------------------------------------------------------ */
  "h1b-salaries": {
    slug: "h1b-salaries",
    appCategory: "ReferenceApplication",
    description:
      "H-1B salary explorer — look up disclosed H-1B wages by job title, SOC code, city/metro, employer, and wage level, and see how prevailing-wage rules shape the required salary.",
    quickAnswer:
      "An H-1B salary depends on the job title and SOC code, the work location, the employer, the wage level (1–4), and the worker's experience. The offered wage generally must meet the required wage — the higher of the prevailing wage for that role and location or the employer's actual wage for similar workers.",
    shortDescription:
      "H-1B wage data comes from disclosed employer filings, but the number that matters legally is the required wage for the specific role and location. This explorer helps you compare disclosed salaries and understand prevailing wage, SOC codes, and wage levels.",
    audience:
      "H-1B workers and candidates (especially in tech) comparing salaries by title, city, and employer, and anyone wanting to understand how prevailing wage shapes an H-1B offer.",
    keyInputs: [
      "The job title you want to compare",
      "The SOC occupation code that matches the role's duties",
      "The city or metro area (wages vary a lot by location)",
      "The wage level (1–4) tied to experience and requirements",
      "Optionally, a specific employer to compare",
    ],
    timelineFeeNote:
      "Salary figures come from historical disclosed filings and are estimates for comparison — they are not a guarantee of any offer. The legally required wage is set by the prevailing wage for the role and location at the time of filing.",
    explain: {
      heading: "What actually drives an H-1B wage",
      items: [
        {
          label: "Prevailing wage",
          body: "The prevailing wage is the typical wage for a given occupation in a given area, based on Department of Labor data. The H-1B offer generally must meet at least this figure for the role and location.",
        },
        {
          label: "SOC code",
          body: "Each role maps to a Standard Occupational Classification (SOC) code. The SOC code and the job's actual duties drive which wage data applies — a mismatch between title, code, and duties is a common problem.",
        },
        {
          label: "Wage level 1–4",
          body: "Within an occupation and area, wages are set at four levels roughly tied to experience and requirements: Level 1 (entry) up to Level 4 (fully competent/senior). Higher levels mean higher required wages.",
        },
        {
          label: "City / metro differences",
          body: "The same title can carry very different required wages across metros. A role in a high-cost tech hub often has a substantially higher prevailing wage than the same role in a lower-cost metro.",
        },
        {
          label: "Job title mismatch risk",
          body: "If the title and SOC code suggest a routine role but the duties are more advanced (or vice versa), it can trigger questions. The wage level should fit the real duties and requirements.",
        },
      ],
    },
    steps: [
      "Identify the job title and the SOC code that matches the actual duties.",
      "Select the city or metro area where the work is performed.",
      "Check the wage level (1–4) that fits the experience and requirements.",
      "Compare disclosed salaries for that title, location, and employer as a reference range.",
      "Treat the result as an estimate for comparison — the required wage at filing is what governs, not historical data.",
    ],
    example: {
      title: "Software engineer in Chicago vs Dallas",
      body: "A 'Software Developer' role maps to a specific SOC code. In a higher-cost metro like Chicago, the prevailing wage for a given wage level is typically higher than for the same level and SOC code in Dallas. So two identical job titles can carry meaningfully different required wages purely because of location. Comparing the two on this explorer shows the metro gap — but the number that governs any actual petition is the prevailing wage for that role and location at the time of filing.",
    },
    mistakes: [
      "Treating disclosed salary data as a guaranteed offer rather than a reference range.",
      "Comparing titles across cities without accounting for large metro wage differences.",
      "Picking a wage level that doesn't match the real duties and requirements.",
      "Ignoring the SOC code — the code and duties, not just the title, drive the wage.",
      "Assuming the market salary and the required (prevailing) wage are the same thing.",
    ],
    relatedLinks: [
      { label: "H-1B lottery timeline", href: "/tools/h1b-lottery-timeline" },
      { label: "H-1B transfer risk checklist", href: "/tools/h1b-transfer-risk-checklist" },
      { label: "USCIS processing times", href: "/tools/processing-times" },
    ],
    faqs: [
      {
        question: "What is the H-1B prevailing wage?",
        answer:
          "The prevailing wage is the typical wage for a specific occupation in a specific area, based on Department of Labor data. An H-1B offer generally must meet at least the required wage — the higher of this prevailing wage or what the employer pays similar workers.",
      },
      {
        question: "Is a Level 1 wage risky?",
        answer:
          "A Level 1 (entry-level) wage isn't automatically a problem, but if the job's duties and requirements look more advanced than entry level, a Level 1 designation can attract questions. The wage level should genuinely match the role's experience and complexity.",
      },
      {
        question: "Does an H-1B salary depend on location?",
        answer:
          "Yes, heavily. The prevailing wage for the same title and SOC code can differ substantially between metros, so location is one of the biggest drivers of the required H-1B wage. A high-cost tech hub typically has higher required wages than a lower-cost metro.",
      },
      {
        question: "Can an H-1B salary be lower than the market salary?",
        answer:
          "The offered wage must meet the required wage (the higher of the prevailing wage or the employer's actual wage for similar roles). It can differ from broad 'market' averages, but it can't fall below the prevailing wage for the role and location, which is set from DOL data.",
      },
      {
        question: "What if the job title doesn't match the duties?",
        answer:
          "A mismatch between title, SOC code, and actual duties can create problems, including questions about whether the role is a specialty occupation and whether the wage level is right. The SOC code and wage level should reflect the real duties, not just a generic title.",
      },
      {
        question: "How should I use H-1B salary data?",
        answer:
          "Use it as a reference range to compare titles, locations, and employers — not as a guaranteed offer. The number that legally governs a petition is the prevailing wage for the specific role and location at the time of filing, so treat disclosed historical data as an estimate.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 5. H-1B transfer risk checklist
   * ------------------------------------------------------------------ */
  "h1b-transfer-risk-checklist": {
    slug: "h1b-transfer-risk-checklist",
    appCategory: "BusinessApplication",
    description:
      "H-1B transfer risk checklist — gauge the risk of changing employers based on I-94 validity, employer strength, wage level, specialty-occupation fit, prior approvals, and starting on receipt vs waiting for approval.",
    quickAnswer:
      "H-1B transfer risk depends on your current status and valid I-94, the new employer's strength, whether the role is a clear specialty occupation at an appropriate wage level, your prior approvals, and whether you start work on the receipt notice or wait for the approval.",
    shortDescription:
      "Changing H-1B employers is common and legal, but the risk profile varies. This checklist helps you weigh the factors — I-94 validity, employer and role strength, and the start-on-receipt vs wait-for-approval decision — before you move.",
    audience:
      "H-1B workers considering changing employers (including after a layoff) who want to understand transfer risk and whether to start on receipt or wait for approval.",
    keyInputs: [
      "Your current H-1B status and I-94 validity dates",
      "Whether you're currently employed or in a grace period after a layoff",
      "The new role's specialty-occupation fit and wage level",
      "The new employer's size, financials, and filing history",
      "Your prior H-1B approvals and any past RFEs",
      "Whether the employer will use premium processing",
    ],
    timelineFeeNote:
      "A transfer (Form I-129) can take from a couple of weeks with premium processing to several months in regular processing. You may be able to start work once USCIS receives the petition, but doing so before approval carries more risk — weigh it carefully.",
    explain: {
      heading: "Concepts that shape transfer risk",
      items: [
        {
          label: "Bridge petition",
          body: "If you file a second petition before the first is approved, the cases can become linked ('bridge' petitions). If an earlier petition is denied, it can affect the later one — sequencing matters.",
        },
        {
          label: "Receipt notice",
          body: "The I-797C receipt confirms USCIS received the transfer petition. Under H-1B portability, you may begin working for the new employer once a non-frivolous petition is received, though this carries risk if the case is later denied.",
        },
        {
          label: "Premium processing",
          body: "For an extra fee, premium processing gives a much faster decision, which reduces the uncertainty of starting on a receipt. It speeds the decision, not your eligibility.",
        },
        {
          label: "RFE risk",
          body: "A Request for Evidence can arise from specialty-occupation questions, a low wage level relative to duties, weak employer documentation, or title/duty mismatches. Stronger filings reduce this risk.",
        },
        {
          label: "Layoff & grace period",
          body: "After a qualifying job loss, H-1B workers generally get a discretionary grace period (commonly up to 60 days) to find a new employer, change status, or depart. A transfer must typically be filed within that window.",
        },
        {
          label: "Start on receipt vs approval",
          body: "You can often start on the receipt to avoid an income gap, but waiting for approval is lower risk. The right choice depends on your I-94 validity, the strength of the case, and your risk tolerance.",
        },
      ],
    },
    steps: [
      "Confirm your current status and I-94 validity (and any grace-period deadline after a layoff).",
      "Assess the new role's specialty-occupation fit and wage level.",
      "Have the employer obtain a certified LCA for the role and worksite.",
      "File the Form I-129 transfer petition (optionally with premium processing).",
      "Get the receipt notice, then decide whether to start on receipt or wait for approval.",
      "Keep evidence of maintained status throughout in case of an RFE.",
    ],
    timeline: {
      title: "H-1B transfer timeline",
      intro: "Ranges depend on processing type and case complexity.",
      rows: [
        { stage: "Before the offer", estimate: "—", notes: "Confirm status, I-94, and any grace-period clock." },
        { stage: "LCA certification", estimate: "~7 business days", notes: "Employer files the LCA with the DOL." },
        { stage: "Petition filing", estimate: "Day 0", notes: "Employer files Form I-129 transfer." },
        { stage: "Receipt notice", estimate: "Days to ~2 weeks", notes: "Portability may allow starting work on receipt." },
        { stage: "Premium decision", estimate: "~15 business days (if premium)", notes: "Faster certainty; regular processing takes months." },
      ],
    },
    documents: {
      heading: "Document checklist",
      items: [
        "Current I-797 approval notice(s) and I-94",
        "Recent pay stubs proving maintained H-1B status",
        "Passport and visa stamp pages",
        "New offer letter and detailed job description",
        "Educational degrees and any credential evaluations",
        "Prior H-1B petitions/approvals for the same specialty (helpful context)",
      ],
    },
    mistakes: [
      "Starting on a receipt when the case is weak or your I-94 is about to expire.",
      "Missing the grace-period deadline to file after a layoff.",
      "Filing multiple petitions without understanding bridge-petition sequencing.",
      "Accepting a wage level that's too low for the role's duties, inviting an RFE.",
      "Not keeping pay stubs and evidence of maintained status for an RFE response.",
    ],
    relatedLinks: [
      { label: "H-1B lottery timeline", href: "/tools/h1b-lottery-timeline" },
      { label: "H-1B salary explorer", href: "/tools/h1b-salaries" },
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS case status meaning", href: "/tools/uscis-case-status-meaning" },
    ],
    faqs: [
      {
        question: "Can I start an H-1B transfer on the receipt notice?",
        answer:
          "Often yes. Under H-1B portability, you can generally begin working for the new employer once USCIS receives a non-frivolous transfer petition and you're maintaining valid status. It avoids an income gap, but it carries more risk than waiting for the approval, since a later denial can affect you.",
      },
      {
        question: "Is premium processing safer?",
        answer:
          "It reduces uncertainty rather than changing your eligibility. Premium processing gives a much faster decision, so if you start on the receipt you learn the outcome quickly instead of waiting months. It doesn't guarantee approval, but it shortens the risky window.",
      },
      {
        question: "What happens if an H-1B transfer is denied?",
        answer:
          "If you were still employed by your prior employer and hadn't started with the new one, you may be able to remain with the prior employer. If you already switched and started on a receipt, a denial can end your work authorization, which is why the start-on-receipt decision matters. Consult an attorney for your specifics.",
      },
      {
        question: "Can I transfer during the 60-day grace period?",
        answer:
          "Yes. After a qualifying job loss, H-1B workers generally get a discretionary grace period (commonly up to 60 days) during which a new employer can file a transfer petition. The petition typically must be filed before the grace period ends, so act quickly.",
      },
      {
        question: "What documents are needed for an H-1B transfer?",
        answer:
          "Commonly your current I-797 approval and I-94, recent pay stubs proving maintained status, passport and visa pages, the new offer letter and job description, and your degrees/credential evaluations. Prior approvals for the same specialty can also help.",
      },
      {
        question: "Does a low salary increase H-1B RFE risk?",
        answer:
          "It can. A wage level that looks too low for the role's duties and requirements is a common trigger for a Request for Evidence, because it raises questions about whether the position and wage level are consistent. Matching the wage level to the real duties reduces that risk.",
      },
      {
        question: "Can I travel to India while my H-1B transfer is pending?",
        answer:
          "It carries real risk. You may need a valid visa stamp to re-enter, and if your stamp is expired or shows a prior employer, consular stamping can trigger 221(g) administrative processing that delays your return by weeks or months. Talk to your attorney before booking international travel while a petition is pending.",
      },
      {
        question: "What should I do if I get an RFE on my H-1B transfer?",
        answer:
          "Contact your employer's immigration attorney immediately — RFEs have a hard response deadline (often around 87 days from the notice), and missing it usually means denial. Your attorney should lead the response with the right evidence, so don't wait.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 6. H-4 EAD navigator
   * ------------------------------------------------------------------ */
  "h4-ead-navigator": {
    slug: "h4-ead-navigator",
    appCategory: "BusinessApplication",
    description:
      "H-4 EAD navigator — check eligibility (approved I-140 or AC21), what work is allowed, renewal timing and the automatic-extension caution, and the I-765 filing steps for H-4 spouses.",
    quickAnswer:
      "An H-4 EAD (work permit) may be available to certain H-4 spouses — generally when the H-1B spouse has an approved I-140, or qualifies under AC21 provisions tied to a pending green card. Once granted, the EAD lets the H-4 spouse work for any employer while it's valid.",
    shortDescription:
      "The H-4 EAD lets some H-1B spouses work, but eligibility, renewals, and automatic-extension rules have changed. This navigator helps you check eligibility, understand what work is allowed, and plan renewals to avoid a work gap.",
    audience:
      "H-4 spouses of H-1B workers (often in the green card queue) checking whether they qualify for an EAD, what work it allows, and how to time a renewal.",
    keyInputs: [
      "The H-1B spouse's I-140 approval status",
      "Whether the H-1B spouse qualifies under AC21 (pending green card past certain milestones)",
      "Your current H-4 status and I-94 validity",
      "Your current EAD expiration date (for renewals)",
      "Documents proving the qualifying basis (I-140 approval, etc.)",
    ],
    timelineFeeNote:
      "H-4 EAD (category c(26)) processing time depends on your form category and the USCIS office handling the case, and it changes month to month — check your own case on the official USCIS processing-times tool at egov.uscis.gov/processing-times. A DHS rule effective October 30, 2025 removed the automatic extension for renewals filed on or after that date, so file as early as the renewal window allows.",
    explain: {
      heading: "How H-4 EAD eligibility and rules work",
      items: [
        {
          label: "Eligibility",
          body: "H-4 EAD is available to certain H-4 dependent spouses of H-1B workers who are on the path to a green card — it is not automatic for all H-4 holders.",
        },
        {
          label: "Approved I-140",
          body: "The most common qualifying basis is that the H-1B spouse has an approved I-140 immigrant petition. This is what makes many H-4 spouses eligible to apply for the EAD.",
        },
        {
          label: "AC21",
          body: "Alternatively, eligibility can arise under AC21 provisions when the H-1B spouse has been granted H-1B time beyond the usual six-year limit based on a long-pending green card case.",
        },
        {
          label: "Work allowed",
          body: "While the EAD is valid, work is unrestricted as to employer and type — W-2 employment, 1099/freelance, or running your own business — with no specialty-occupation or wage requirement.",
        },
        {
          label: "Renewal timing",
          body: "File the renewal as early as the window allows (often up to 180 days before expiry) because processing can be long.",
        },
        {
          label: "Automatic-extension caution",
          body: "A DHS rule effective October 30, 2025 removed the automatic extension for H-4 EAD renewals filed on or after that date — so if your EAD expires before the renewal is approved, you must stop working until the new card is issued.",
        },
        {
          label: "Travel risk",
          body: "H-4 status and the EAD depend on maintaining valid H-4 status, which depends on the H-1B spouse. Travel and status changes can create gaps — plan carefully.",
        },
      ],
    },
    steps: [
      "Confirm your qualifying basis (H-1B spouse's approved I-140 or AC21 eligibility).",
      "Confirm your H-4 status and I-94 are valid — the EAD depends on H-4 status.",
      "Collect documents (I-140 approval, marriage and status proof, prior EAD if renewing).",
      "File Form I-765 for the EAD (with any concurrent H-4 extension if needed).",
      "Attend biometrics if required.",
      "Wait for approval and the physical EAD card before starting or resuming work.",
    ],
    timeline: {
      title: "H-4 EAD timeline",
      intro: "Estimates only — processing varies widely and has been long recently.",
      rows: [
        { stage: "Gather documents", estimate: "—", notes: "I-140 approval and proof of H-4 status." },
        { stage: "File I-765", estimate: "Day 0", notes: "Often filed with an H-4 extension (I-539) if needed." },
        { stage: "Biometrics", estimate: "Weeks (if required)", notes: "Not always required for renewals." },
        { stage: "Approval + card", estimate: "Several months to 1+ year", notes: "No automatic extension for renewals filed on/after Oct 30, 2025." },
      ],
    },
    documents: {
      heading: "Document checklist",
      items: [
        "H-1B spouse's I-140 approval notice (or AC21 basis documents)",
        "Your current I-94 and H-4 approval notice",
        "Marriage certificate",
        "Passport biographic page",
        "Prior EAD card (for renewals)",
        "Passport-style photos as required by the form",
      ],
    },
    mistakes: [
      "Filing the renewal late and hitting a work gap now that the automatic extension is gone (for filings on/after Oct 30, 2025).",
      "Continuing to work after the EAD expires while a renewal is pending.",
      "Forgetting that the EAD depends on valid H-4 status, which depends on the H-1B spouse.",
      "Overlooking the need to also extend H-4 status (I-539) when required.",
      "Not accounting for how an I-140 withdrawal or H-1B employer change can affect eligibility.",
    ],
    relatedLinks: [
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
      { label: "USCIS notice decoder", href: "/tools/uscis-notice-decoder" },
      { label: "H-1B transfer risk checklist", href: "/tools/h1b-transfer-risk-checklist" },
    ],
    table: {
      caption: "H-4 EAD at a glance: eligibility, filing, and timing",
      headers: ["Item", "Rule as of July 2026", "Why it matters"],
      rows: [
        ["Qualifying basis", "H-1B spouse has an approved I-140, or H-1B time beyond 6 years under AC21", "H-4 status alone never qualifies you"],
        ["Form and category", "Form I-765, category c(26)", "Filed by the H-4 spouse, not the employer"],
        ["Earliest renewal filing", "Up to 180 days before EAD expiry", "The only real lever you control on timing"],
        ["Automatic extension", "Removed for renewals filed on/after Oct 30, 2025", "Work must stop at EAD expiry — plan around it"],
        ["Work allowed", "Any employer, 1099, or your own business", "No wage floor or specialty-occupation test"],
        ["Validity limit", "Tied to your H-4 I-94 end date", "EAD cannot outlive the underlying H-4 status"],
      ],
    },
    updated: "2026-07-19",
    expertiseTags: ["H-4 EAD & work authorization", "USCIS filing timelines", "Immigrant family planning"],
    takeaways: [
      "File Form I-765 up to 180 days before your current EAD expires — check your own timeline on the USCIS processing-times tool, since it varies by category and office.",
      "Do not count on an automatic extension: a DHS rule effective October 30, 2025 removed it for H-4 EAD renewals filed on or after that date.",
      "Qualify through the H-1B spouse: an approved I-140, or H-1B time granted beyond six years under AC21 — H-4 status alone is not enough.",
      "Work without restriction while the EAD is valid — any employer, 1099 freelance, or your own business, with no wage or specialty-occupation rule.",
      "Stop working the day the EAD expires or H-4 status lapses; the EAD is only as valid as the underlying H-4 I-94.",
    ],
    howItWorks: {
      heading: "How this H-4 EAD estimate works",
      body:
        "The navigator is a rules engine over the published H-4 EAD criteria, not a prediction model. Your eligibility answer comes from one branch: does the H-1B spouse have an approved I-140, or H-1B time granted beyond the six-year limit under AC21? Either path yields eligibility to apply under category c(26); neither does not. The renewal-gap estimate then subtracts today's date from your EAD expiration to give days remaining, compares that to the 180-day early-filing window, and — because the automatic extension no longer applies to renewals filed on or after October 30, 2025 — treats your EAD expiry as a hard stop for work authorization rather than assuming a bridge. Processing-time ranges shown are the currently posted USCIS figures for the form and category, not user-reported averages; verify your service center's current time before relying on any date.",
    },
    connects: {
      heading: "How H-4 EAD connects to the rest of your family's case",
      body:
        "The H-4 EAD is downstream of your spouse's green card progress: the I-140 approval that unlocks it is the same approval that sets the priority date deciding when you can file I-485. That means a long India backlog is what keeps you on H-4 EAD renewals for years, and each renewal now needs its own 180-day lead time. If your spouse changes jobs or is laid off, both H-4 status and the EAD ride on the H-1B remaining valid, so plan the two together.",
      links: [
        { href: "/i140-processing-time", label: "I-140 processing time" },
        { href: "/visa-bulletin/priority-date", label: "What is a priority date?" },
        { href: "/ead-processing-time", label: "EAD processing time" },
        { href: "/ead-renewal-gap", label: "EAD renewal gap planning" },
        { href: "/h1b-layoff", label: "H-1B layoff: what happens to H-4" },
      ],
    },
    faqs: [
      {
        question: "Who qualifies for an H-4 EAD?",
        answer:
          "Certain H-4 dependent spouses of H-1B workers on the green card path — most commonly when the H-1B spouse has an approved I-140, or qualifies under AC21 provisions for H-1B time beyond six years. It's not automatic for every H-4 holder.",
      },
      {
        question: "Can an H-4 spouse work without an EAD card?",
        answer:
          "No. H-4 status by itself does not authorize work — you need a valid EAD to work. Once the EAD is approved and valid, work is unrestricted as to employer and type, but you must stop working if it expires without a valid extension.",
      },
      {
        question: "How long does an H-4 EAD take?",
        answer:
          "There is no single answer: USCIS processing time for Form I-765 depends on the eligibility category and the office or service center handling your case, and it is updated monthly. Check your own case at egov.uscis.gov/processing-times. Because a DHS rule removed the automatic extension for renewals filed on or after October 30, 2025, a long processing time can now mean a work gap — so file as early as the window allows. Premium processing is not available for category (c)(26).",
      },
      {
        question: "Can an H-4 EAD be renewed early?",
        answer:
          "You can generally file a renewal within a window before expiry (often up to 180 days early). Filing early is strongly recommended because processing can be long and, for renewals filed on or after October 30, 2025, there's no automatic extension to bridge a gap.",
      },
      {
        question: "What happens if the H-1B spouse changes employer?",
        answer:
          "Your H-4 status and EAD depend on the H-1B spouse maintaining valid H-1B status and the qualifying basis (like an approved I-140). An employer change is usually manageable, but if the underlying I-140 is withdrawn or the basis changes, your EAD eligibility can be affected — check your specifics.",
      },
      {
        question: "Is an H-4 EAD affected by I-140 withdrawal?",
        answer:
          "It can be. Because an approved I-140 is the common basis for H-4 EAD eligibility, a withdrawn or revoked I-140 may affect future eligibility or renewals, depending on the timing and whether another basis (like AC21) applies. This is educational information, not legal advice.",
      },
      {
        question: "Can an H-4 EAD holder start a business or an LLC?",
        answer:
          "Yes. On a valid H-4 EAD you can form and actively work in your own LLC or sole proprietorship — the EAD is what authorizes active work (anyone can passively own a company). Once the EAD expires without a valid extension, you must stop actively working until a new one is approved.",
      },
      {
        question: "Can an H-4 EAD holder do freelance or 1099 work?",
        answer:
          "Yes. Freelance and 1099 self-employment are allowed while the H-4 EAD is valid, with no employer or specialty restriction. Self-employment income is reported on Schedule C and is subject to self-employment tax, so set money aside and consider quarterly estimated payments; confirm specifics with a CPA.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 7. USCIS processing times
   * ------------------------------------------------------------------ */
  "processing-times": {
    slug: "processing-times",
    appCategory: "ReferenceApplication",
    description:
      "USCIS processing-times explainer — how form type, service center, case category, premium processing, RFEs, and biometrics shape H-1B, I-140, I-485, EAD, Advance Parole, N-400, and H-4 EAD timelines, and how to check yours.",
    quickAnswer:
      "USCIS processing time depends on the form type, the service center or field office handling it, the case category, whether premium processing is available, and whether an RFE or biometrics step is added — plus overall agency workload. There is no single number; each form and location has its own posted range.",
    shortDescription:
      "Processing times vary widely by form and location, and the official posted range is only an estimate. This page explains what drives your timeline, how to check the official estimate for your exact form and center, and when you can raise a service request.",
    audience:
      "Anyone with a pending USCIS case — H-1B, green card (I-140/I-485), EAD, Advance Parole, or citizenship — who wants to understand why it's taking a certain amount of time and how to check the official estimate.",
    keyInputs: [
      "Your form type (e.g., I-129, I-140, I-485, I-765, I-131, N-400)",
      "Your receipt number (the service center prefix indicates where it's processing)",
      "The service center or field office handling your case",
      "Your case category / subtype where the form has several",
      "Your receipt (priority) date, to compare against the posted range",
    ],
    resultMeaning:
      "A processing-time estimate is a range (often the time within which most cases at that office are completed), not a promise for your specific case. If your case is within the posted range, it's generally considered normal and it's usually too early to inquire. Only once you pass the office's 'case inquiry date' does USCIS treat it as outside normal time and let you submit a service request.",
    table: {
      caption: "What affects the timeline by form",
      headers: ["Form / case type", "What affects the timeline", "What to check"],
      rows: [
        ["H-1B (I-129)", "Cap vs non-cap, premium processing, RFEs, center workload", "Premium option; receipt center; posted range"],
        ["I-140 (immigrant petition)", "Category, premium processing eligibility, RFEs", "Whether premium is available for your category"],
        ["I-485 (adjustment)", "Visa number availability, field office, interview, biometrics", "Visa bulletin; your field office backlog"],
        ["EAD (I-765)", "Category code (e.g., c(9), c(26)), center workload, biometrics", "Your category code; whether an extension applies"],
        ["Advance Parole (I-131)", "Filed with I-485 or standalone, center workload", "Whether it's bundled with your I-485"],
        ["N-400 (naturalization)", "Field office backlog, interview scheduling, name checks", "Your field office; interview wait"],
        ["H-4 EAD (I-765 c(26))", "Center workload, biometrics, no auto-extension (post Oct 30 2025)", "File early; no automatic extension for late filings"],
        ["OCI (for Indians)", "Handled by Indian mission/VFS, not USCIS; document/apostille steps", "The consulate/VFS timeline, not USCIS"],
      ],
    },
    steps: [
      "Identify your exact form type and any subtype/category.",
      "Find your receipt number and read the 3-letter prefix to see which center is processing.",
      "Look up the official USCIS processing time for that form and center.",
      "Compare your receipt date against the posted range to see if you're still within normal time.",
      "Note the office's 'case inquiry date' — only after it passes can you submit a service request.",
    ],
    mistakes: [
      "Treating the posted range as a deadline — it's an estimate, and many cases fall outside it.",
      "Comparing your wait to someone else's without matching the form, center, and category.",
      "Submitting a service request before the case inquiry date, which USCIS will just close.",
      "Assuming an RFE 'resets' the clock — responding restarts active review but the case isn't back to zero.",
      "Confusing OCI timelines (handled by the Indian mission/VFS) with USCIS processing.",
    ],
    relatedLinks: [
      { label: "USCIS receipt number decoder", href: "/tools/uscis-receipt-number-decoder" },
      { label: "USCIS case status meaning", href: "/tools/uscis-case-status-meaning" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
      { label: "H-1B lottery timeline", href: "/tools/h1b-lottery-timeline" },
      { label: "H-4 EAD navigator", href: "/tools/h4-ead-navigator" },
    ],
    faqs: [
      {
        question: "Why is my USCIS case taking so long?",
        answer:
          "Timelines depend on your form type, the service center or field office, the case category, agency workload, and whether an RFE or biometrics step was added. Some forms and offices simply have longer posted ranges than others, so a long wait is often within normal time for your specific case.",
      },
      {
        question: "What is a normal USCIS processing time?",
        answer:
          "There's no single normal — each form and center has its own posted range on the USCIS website. If your case is within that range, it's generally considered normal. The range often represents the time within which most cases at that office are completed, not a guaranteed date.",
      },
      {
        question: "Does premium processing help?",
        answer:
          "For eligible forms (like many I-129 and I-140 categories), premium processing gives a much faster adjudication decision for an extra fee. It speeds the decision, not visa availability or a start date, and it's not offered for every form or category.",
      },
      {
        question: "When can I raise a service request?",
        answer:
          "Generally only after your case passes the office's 'case inquiry date,' which is when USCIS treats it as outside normal processing time. Before that date, a service request is usually closed without action, so check the inquiry date for your form and center first.",
      },
      {
        question: "Does an RFE reset the timeline?",
        answer:
          "An RFE pauses adjudication until you respond; once USCIS receives your response, the case goes back into active review. It doesn't literally reset to zero, but it does add the response and re-review time, so an RFE typically extends the overall timeline.",
      },
      {
        question: "Which service center is processing my case?",
        answer:
          "The first three letters of your receipt number indicate the filing system or service center (for example, IOE for the electronic system, or center codes like LIN, SRC, EAC, WAC). Use that prefix to look up the correct processing-time estimate for your case.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 8. USCIS case status meaning
   * ------------------------------------------------------------------ */
  "uscis-case-status-meaning": {
    slug: "uscis-case-status-meaning",
    appCategory: "ReferenceApplication",
    description:
      "USCIS case status meaning explainer — what messages like 'Case Was Received,' 'Actively Reviewing,' 'Request for Evidence,' 'Case Approved,' 'Card Is Being Produced,' 'Case Was Transferred,' and 'Decision Notice Mailed' mean, and what to do next.",
    quickAnswer:
      "USCIS case status messages are short updates that show roughly where your case may be in the process. They don't always explain the full reason or give an exact timeline — a status can stay the same for weeks even while work continues, and some steps don't generate a new message.",
    shortDescription:
      "The one-line status on the USCIS site rarely tells the whole story. This page translates the common status messages into plain English — what each likely means, what to do next, and when it's actually a reason to worry.",
    audience:
      "Anyone tracking a pending USCIS case online who wants to understand what their current status message means and whether they need to take any action.",
    keyInputs: [
      "Your current case status message (as shown on the USCIS site)",
      "Your receipt number",
      "The form type the status applies to",
      "The date the status last changed",
    ],
    resultMeaning:
      "A status message is a snapshot, not a full explanation. 'Actively Reviewing' doesn't guarantee a decision is imminent, and a long stretch on 'Case Was Received' is common and usually normal. Read the message alongside the official processing time for your form and center before drawing conclusions — and don't assume a status change is coming on any particular day.",
    table: {
      caption: "Common status messages, in plain English",
      headers: ["Status message", "Plain meaning", "What to do next", "When to worry"],
      rows: [
        ["Case Was Received", "USCIS logged your filing and issued a receipt", "Save the receipt number; nothing to do", "Only if you never get a receipt notice"],
        ["Actively Reviewing", "An officer is (or recently was) reviewing it", "Wait; keep your address updated", "If far past the posted processing time"],
        ["Request for Evidence", "USCIS needs more documents to decide", "Respond fully before the deadline", "If the deadline is near and you're not ready"],
        ["Case Approved", "The petition/application was approved", "Watch for the approval notice/card", "Rarely — this is good news"],
        ["Card Is Being Produced", "An approved card is being printed", "Watch for mailing updates", "If it stalls here for many weeks"],
        ["Case Was Transferred", "Moved to another office for workload/type", "Note the new office; expect a new estimate", "Not usually — it's routine"],
        ["Interview Was Scheduled", "You'll be interviewed", "Prepare documents; attend on time", "If you can't make the date (reschedule early)"],
        ["Decision Notice Was Mailed", "A decision letter is on the way", "Wait for the letter to see the outcome", "If the letter never arrives"],
        ["Case Was Denied", "The case was denied", "Read the notice for reasons and options", "Yes — review appeal/motion options quickly"],
      ],
    },
    steps: [
      "Find your current status message on the official USCIS case status page.",
      "Match it to the plain-English meaning in the table above.",
      "Check whether the message requires action (e.g., an RFE deadline).",
      "Compare the time since the last update against the posted processing time for your form.",
      "Keep your mailing address current so you don't miss a notice or card.",
    ],
    mistakes: [
      "Reading 'Actively Reviewing' as 'approval is coming soon' — it doesn't promise a timeline.",
      "Panicking over a long 'Case Was Received' status, which is often normal.",
      "Missing an RFE deadline because the online status wasn't checked often enough.",
      "Assuming 'Case Was Transferred' is bad news — it's usually a routine workload move.",
      "Ignoring the approval notice/card mailing after 'Card Is Being Produced.'",
    ],
    relatedLinks: [
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS notice decoder", href: "/tools/uscis-notice-decoder" },
      { label: "USCIS receipt number decoder", href: "/tools/uscis-receipt-number-decoder" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
    ],
    faqs: [
      {
        question: "What does 'Actively Reviewing' mean?",
        answer:
          "It generally means an officer is reviewing, or recently reviewed, your case. It's a positive sign that the case is being worked, but it doesn't guarantee a decision on any particular date — cases can sit on this status for a while.",
      },
      {
        question: "Does 'Actively Reviewing' mean approval is soon?",
        answer:
          "Not necessarily. It indicates review activity, not an imminent decision. An officer may still request evidence, transfer the case, or take time to decide, so treat it as progress rather than a promise of quick approval.",
      },
      {
        question: "What does RFE mean?",
        answer:
          "RFE stands for Request for Evidence — USCIS needs more documents or information before it can decide. It comes with a response deadline, and you generally must respond completely and on time, because missing the deadline usually leads to a denial.",
      },
      {
        question: "What does 'Case Was Transferred' mean?",
        answer:
          "It means your case was moved to another USCIS office, often to balance workload or because another office handles that case type. It's usually routine and not a bad sign, but you may see a new processing-time estimate for the new office.",
      },
      {
        question: "What does 'Card Is Being Produced' mean?",
        answer:
          "It means your case was approved and an approved card (such as a green card or EAD) is being printed. The next updates typically relate to mailing. If it stays on this status for many weeks without a mailing update, it may be worth checking.",
      },
      {
        question: "What should I do if my case is denied?",
        answer:
          "Read the denial notice carefully — it explains the reasons and any options, which can include an appeal or a motion to reopen or reconsider, often with short deadlines. Because timing matters, consider consulting an immigration attorney promptly. This is educational information, not legal advice.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 9. USCIS form finder
   * ------------------------------------------------------------------ */
  "uscis-form-finder": {
    slug: "uscis-form-finder",
    appCategory: "ReferenceApplication",
    description:
      "USCIS form finder — match your immigration goal (work visa, green card, EAD, advance parole, citizenship, change of status, family petition) to the right form: I-129, I-140, I-485, I-765, I-131, I-130, I-539, N-400, I-751, or I-90.",
    quickAnswer:
      "The right USCIS form depends on the benefit you're seeking — a work visa, a green card, an EAD work permit, advance parole travel, citizenship, a change or extension of status, or a family petition. Each goal maps to a specific form, and who files (you vs an employer or relative) depends on the benefit.",
    shortDescription:
      "USCIS has dozens of forms and picking the wrong one wastes time and fees. This finder maps common immigration goals to the usual form, who files it, and what to check — so you can confirm the right filing before you start.",
    audience:
      "Immigrants and their sponsors (including Indian families) trying to figure out which USCIS form matches their goal — a job petition, green card step, work permit, travel document, citizenship, or family filing.",
    keyInputs: [
      "Your immigration goal (work, green card, EAD, travel, citizenship, status change, family)",
      "Who the petitioner/sponsor is (yourself, an employer, or a relative)",
      "Your current immigration status",
      "Your eligibility basis for the benefit",
    ],
    resultMeaning:
      "A form suggestion points you to the usual filing for a given goal, but eligibility rules, evidence, and fees still apply — and some situations need more than one form (for example, filing I-485 with I-765 and I-131 together). Confirm the current form edition, fee, and requirements on the official USCIS page before filing.",
    table: {
      caption: "Goal → common USCIS form",
      headers: ["Goal", "Common form", "Who usually files", "Notes"],
      rows: [
        ["Work visa (e.g., H-1B, L-1)", "I-129", "Employer", "Nonimmigrant worker petition"],
        ["Employment green card petition", "I-140", "Employer", "Immigrant petition for a worker"],
        ["Adjust status to green card", "I-485", "The applicant", "Requires a visa number to be available"],
        ["Work permit (EAD)", "I-765", "The applicant", "Category code drives eligibility"],
        ["Advance parole (travel)", "I-131", "The applicant", "Often filed with I-485"],
        ["Family green card petition", "I-130", "US citizen/LPR relative", "Establishes the family relationship"],
        ["Extend/change nonimmigrant status", "I-539", "The applicant", "E.g., H-4, B-2, F-2 changes/extensions"],
        ["Citizenship (naturalization)", "N-400", "The applicant", "Green card holders meeting requirements"],
        ["Remove conditions on residence", "I-751", "Conditional resident (spouse)", "For 2-year marriage-based green cards"],
        ["Renew/replace green card", "I-90", "The applicant", "For expiring or lost green cards"],
      ],
    },
    steps: [
      "Identify your goal (work, green card, EAD, travel, citizenship, status change, or family).",
      "Determine who the petitioner or sponsor is — you, an employer, or a relative.",
      "Check the eligibility requirements for that benefit and form.",
      "Confirm the current filing fee on the official USCIS fee schedule.",
      "Gather the required evidence and use the correct current form edition before filing.",
    ],
    mistakes: [
      "Filing the wrong form for the goal and losing time and fees.",
      "Using an outdated form edition, which USCIS may reject.",
      "Forgetting that some goals need multiple forms filed together (e.g., I-485 + I-765 + I-131).",
      "Assuming you can self-file when the benefit requires an employer or relative petitioner.",
      "Not checking the current fee, since fees change periodically.",
    ],
    relatedLinks: [
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "US citizenship (N-400) checklist", href: "/tools/citizenship-checklist" },
      { label: "H-4 EAD navigator", href: "/tools/h4-ead-navigator" },
      { label: "H-1B lottery timeline", href: "/tools/h1b-lottery-timeline" },
    ],
    faqs: [
      {
        question: "Which form is used for an H-1B?",
        answer:
          "The employer files Form I-129 (Petition for a Nonimmigrant Worker) for an H-1B. Workers can't file it themselves — H-1B is employer-sponsored, and for cap cases the employer also completes the electronic registration before filing I-129.",
      },
      {
        question: "Which form is used for a green card?",
        answer:
          "It depends on the path. Employment cases typically use I-140 (employer petition) then I-485 (adjustment of status) if you're in the US. Family cases use I-130 (relative petition) then I-485 or consular processing. The green card 'form' is really a sequence.",
      },
      {
        question: "Which form is used for an EAD?",
        answer:
          "Form I-765 (Application for Employment Authorization) is used to request an EAD work permit. The eligibility category code (such as c(9) for pending adjustment or c(26) for H-4) determines who qualifies and what to file with it.",
      },
      {
        question: "Which form is used for citizenship?",
        answer:
          "Form N-400 (Application for Naturalization) is used by eligible green card holders to apply for US citizenship. You generally file it after meeting the residence, physical presence, and other requirements.",
      },
      {
        question: "Can I file USCIS forms myself?",
        answer:
          "For applicant-filed benefits (like I-485, I-765, I-131, N-400, I-90) you can generally file yourself. Employer- or relative-sponsored benefits (like I-129 or I-130) must be filed by the petitioner. Complex cases often benefit from an immigration attorney's help.",
      },
      {
        question: "Where do I check USCIS filing fees?",
        answer:
          "Check the official USCIS fee schedule (and the fee calculator) on uscis.gov, since fees change periodically and can differ by filing method. Always confirm the current fee for your exact form and edition before filing.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 10. USCIS notice decoder
   * ------------------------------------------------------------------ */
  "uscis-notice-decoder": {
    slug: "uscis-notice-decoder",
    appCategory: "ReferenceApplication",
    description:
      "USCIS notice decoder — understand I-797/I-797C notices and other USCIS mail: receipt, approval, biometrics appointment, RFE, NOID, transfer, interview, and oath notices, and which ones need a response.",
    quickAnswer:
      "USCIS notices explain updates like receipt, approval, biometrics, a request for evidence, a transfer, an interview, or a denial. The notice type (often an I-797 variant) and its heading tell you what it is and whether you need to take action by a deadline.",
    shortDescription:
      "USCIS communicates by mailed notices, and they aren't always self-explanatory. This page decodes the common notice types — what each means, whether it needs a response, and the deadline to watch — so you don't miss a required action.",
    audience:
      "Anyone who receives a USCIS notice (I-797/I-797C or an appointment/RFE letter) and wants to understand what it is and whether action is required.",
    keyInputs: [
      "The notice type / heading (e.g., I-797C, Request for Evidence, Biometrics)",
      "The receipt number printed on the notice",
      "The applicant/beneficiary name on the notice",
      "Any response deadline or appointment date shown",
    ],
    resultMeaning:
      "The notice heading tells you its purpose, and whether there's a deadline tells you if action is required. Receipt and approval notices are usually informational; RFEs, NOIDs, biometrics, and interview notices require you to act by a specific date. Always verify the receipt number and name match your case, and keep every notice.",
    explain: {
      heading: "Common USCIS notice types",
      items: [
        {
          label: "I-797C, Receipt Notice",
          body: "Confirms USCIS received your filing and shows your receipt number and received date. It's informational — no action needed — but keep it, since the receipt number tracks your case.",
        },
        {
          label: "I-797, Approval Notice",
          body: "Confirms your petition or application was approved. Depending on the case, the bottom may include an I-94 or other tear-off. Keep the original safe.",
        },
        {
          label: "Biometrics Appointment Notice",
          body: "Tells you when and where to appear for fingerprints and a photo. Bring the notice and ID on the date shown; reschedule promptly if you can't attend.",
        },
        {
          label: "Request for Evidence (RFE)",
          body: "USCIS needs more documents to decide. It lists what's needed and a hard deadline — respond fully and on time, because a missed deadline usually means denial.",
        },
        {
          label: "Notice of Intent to Deny (NOID)",
          body: "A warning that USCIS is leaning toward denial and is giving you a chance to respond with evidence and argument. It's more serious than an RFE — respond carefully by the deadline.",
        },
        {
          label: "Transfer Notice",
          body: "Says your case was moved to another office. It's usually routine; note the new office because the processing-time estimate may change.",
        },
        {
          label: "Interview Notice",
          body: "Schedules an in-person interview (common for I-485 and N-400). It lists documents to bring and the date/place — attend on time and prepare.",
        },
        {
          label: "Oath (Naturalization) Notice",
          body: "For approved N-400 cases, schedules the oath ceremony where you become a US citizen. Bring the notice and your green card as instructed.",
        },
      ],
    },
    steps: [
      "Read the notice type/heading to identify what it is.",
      "Check for a deadline or appointment date — that tells you if action is required.",
      "Verify the applicant name and receipt number match your case.",
      "Respond or attend as required (RFE, NOID, biometrics, interview) before the deadline.",
      "Save a copy of every notice for your records.",
    ],
    mistakes: [
      "Assuming an I-797C receipt notice is an approval — it only confirms receipt.",
      "Missing an RFE or NOID deadline, which typically results in denial.",
      "Skipping a biometrics or interview appointment without rescheduling.",
      "Not verifying the receipt number and name match your case.",
      "Discarding notices instead of keeping originals safe.",
    ],
    relatedLinks: [
      { label: "USCIS case status meaning", href: "/tools/uscis-case-status-meaning" },
      { label: "USCIS receipt number decoder", href: "/tools/uscis-receipt-number-decoder" },
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
    ],
    faqs: [
      {
        question: "What is an I-797?",
        answer:
          "I-797 is the family of official USCIS notices. Variants include the I-797C (receipt and other action notices) and the I-797 approval notice. The heading on the notice tells you which type it is and what it's confirming.",
      },
      {
        question: "Is an I-797C an approval?",
        answer:
          "Not by itself. The I-797C is typically a receipt or action notice — for example, confirming USCIS received your filing or scheduling biometrics. An approval is usually communicated on an I-797 Approval Notice, so read the heading to be sure.",
      },
      {
        question: "What is an RFE notice?",
        answer:
          "An RFE (Request for Evidence) notice means USCIS needs more documents or information before deciding. It lists exactly what's required and sets a firm deadline; you generally must respond completely and on time to avoid a denial.",
      },
      {
        question: "What is a NOID?",
        answer:
          "A NOID (Notice of Intent to Deny) warns that USCIS is leaning toward denying your case and gives you a chance to respond with evidence and argument before it decides. It's more serious than an RFE, so respond carefully by the deadline.",
      },
      {
        question: "What should I do after a biometrics notice?",
        answer:
          "Attend the appointment on the date and at the location shown, bringing the notice and a valid photo ID. If you can't make it, follow the notice's instructions to reschedule as early as possible so your case isn't delayed.",
      },
      {
        question: "How do I know if a USCIS notice requires action?",
        answer:
          "Look for a deadline or an appointment date. Notices like RFEs, NOIDs, biometrics, and interviews require you to act by a specific date; receipt and approval notices are usually informational. When in doubt, read the notice fully and check the response-by date.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 11. USCIS receipt number decoder
   * ------------------------------------------------------------------ */
  "uscis-receipt-number-decoder": {
    slug: "uscis-receipt-number-decoder",
    appCategory: "ReferenceApplication",
    description:
      "USCIS receipt number decoder — read the 13-character receipt number: the 3-letter prefix (IOE, LIN, SRC, EAC, WAC, MSC, NBC), the fiscal year, the computer workday, and the case sequence, and what they do (and don't) tell you.",
    quickAnswer:
      "A USCIS receipt number can tell you which filing system or service center is handling your case from its 3-letter prefix, plus the fiscal year it was received. It does not reveal your exact processing speed or the outcome — it's an identifier, not a status.",
    shortDescription:
      "Your 13-character receipt number encodes where and roughly when your case entered the system. This page breaks down the format and the service-center prefixes so you can look up the right processing time and track your case.",
    audience:
      "Anyone with a USCIS receipt number who wants to understand what the prefix and digits mean and which service center or system is handling their case.",
    keyInputs: [
      "Your 13-character receipt number (from your I-797 receipt notice)",
      "The 3-letter prefix (e.g., IOE, LIN, SRC, EAC, WAC, MSC, NBC)",
      "The form type the receipt belongs to",
    ],
    resultMeaning:
      "Decoding the receipt number tells you the handling system/center and the fiscal year received — useful for looking up the correct processing time and tracking case status. It does not predict how fast your case will move or what the decision will be, so use it to find the right official estimate rather than to guess an outcome.",
    explain: {
      heading: "How the receipt number is structured",
      items: [
        {
          label: "First 3 letters (prefix)",
          body: "Identify the filing system or service center handling the case (for example, IOE for the electronic ELIS system, or a physical center code). This tells you where to look up processing times.",
        },
        {
          label: "Fiscal year (next 2 digits)",
          body: "The two digits after the prefix indicate the government fiscal year the case was received — a quick way to see how old the case is.",
        },
        {
          label: "Computer workday (next 3 digits)",
          body: "Represent the workday the case was entered into the system during that fiscal year — an internal processing-day figure, not a calendar date you need to act on.",
        },
        {
          label: "Case sequence number (final digits)",
          body: "The remaining digits are the unique sequence number identifying your specific case within that batch.",
        },
      ],
    },
    table: {
      caption: "Service center / system prefixes",
      headers: ["Prefix", "System / center"],
      rows: [
        ["IOE", "USCIS electronic immigration system (ELIS) — online filings and electronically processed paper filings"],
        ["LIN", "Nebraska Service Center"],
        ["SRC", "Texas Service Center"],
        ["EAC", "Vermont Service Center"],
        ["WAC", "California Service Center"],
        ["MSC", "National Benefits Center"],
        ["NBC", "National Benefits Center (some filings)"],
      ],
    },
    steps: [
      "Find your receipt number on your I-797 receipt notice (13 characters).",
      "Read the first 3 letters to identify the system or service center.",
      "Note the next two digits for the fiscal year the case was received.",
      "Use the prefix to look up the correct processing time for your form and center.",
      "Track your case with the official USCIS case-status tool using the full receipt number.",
    ],
    mistakes: [
      "Assuming the receipt number reveals your approval date — it doesn't predict speed or outcome.",
      "Looking up processing times for the wrong center by misreading the prefix.",
      "Confusing the internal 'workday' digits with a calendar date.",
      "Mistyping the 13-character number when checking case status.",
      "Assuming an online (IOE) case and a paper-center case move at the same pace.",
    ],
    relatedLinks: [
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS case status meaning", href: "/tools/uscis-case-status-meaning" },
      { label: "USCIS notice decoder", href: "/tools/uscis-notice-decoder" },
      { label: "USCIS form finder", href: "/tools/uscis-form-finder" },
    ],
    faqs: [
      {
        question: "What does IOE mean?",
        answer:
          "IOE is the prefix for cases in the USCIS electronic immigration system (ELIS). It means your case is handled through that electronic system rather than a specific physical service center. It is typically an online filing, but not necessarily — USCIS also assigns IOE numbers to paper filings processed or digitised electronically. Unlike traditional service-center numbers, the digits following IOE do not encode a fiscal year and computer workday.",
      },
      {
        question: "What does LIN mean?",
        answer:
          "LIN is the prefix for the Nebraska Service Center. A receipt number starting with LIN means that center received and is associated with your case, which tells you where to look up the relevant processing time.",
      },
      {
        question: "What does SRC mean?",
        answer:
          "SRC is the prefix for the Texas Service Center. A receipt beginning with SRC indicates your case is associated with that center, so you'd check the Texas Service Center's processing times for your form.",
      },
      {
        question: "What does WAC mean?",
        answer:
          "WAC is the prefix for the California Service Center. A WAC receipt number means your case is tied to that center, so use the California Service Center's posted processing times for your form type.",
      },
      {
        question: "Does the receipt number show an approval timeline?",
        answer:
          "No. The receipt number identifies the handling system/center and the fiscal year received, but it doesn't predict how fast your case will be decided or the outcome. Use it to find the correct official processing-time estimate rather than a guaranteed date.",
      },
      {
        question: "Where is the receipt number on the I-797?",
        answer:
          "On an I-797/I-797C notice, the 13-character receipt number is usually printed near the top, often labeled 'Receipt Number.' It's the identifier you enter into the USCIS case-status tool to track your case.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 12. Priority date checker
   * ------------------------------------------------------------------ */
  "priority-date-checker": {
    slug: "priority-date-checker",
    appCategory: "ReferenceApplication",
    description:
      "Priority date checker for Indian applicants — compare your priority date against the visa bulletin's Final Action Dates and Dates for Filing for EB2/EB3 India (and other categories) to see if you're current and whether you can file I-485.",
    quickAnswer:
      "Your priority date is 'current' when the visa bulletin date for your category and country of chargeability reaches or passes it. Which chart applies depends on whether USCIS is using the Final Action Dates chart (for approval) or the Dates for Filing chart (to submit I-485) that month.",
    shortDescription:
      "The visa bulletin decides when a green card number is available to you. This checker compares your priority date to the current bulletin for your category and country, so you can see whether you're current and whether you may file your I-485.",
    audience:
      "Employment- and family-based green card applicants (especially EB2/EB3 India) tracking whether their priority date is current under the monthly visa bulletin.",
    keyInputs: [
      "Your priority date (usually your PERM filing date, or I-130/I-140 date)",
      "Your green card category (e.g., EB2, EB3, or a family category)",
      "Your country of chargeability (usually India for India-born applicants)",
      "The current month's visa bulletin dates",
      "Whether USCIS is accepting the Dates for Filing chart this month",
    ],
    resultMeaning:
      "If your priority date is earlier than the applicable bulletin date for your category and country, you're 'current' for that chart. Being current on Final Action Dates means a green card can be approved; being current on Dates for Filing (in months USCIS accepts it) means you may submit your I-485. If neither chart has reached your date, you keep waiting — and remember dates can retrogress.",
    explain: {
      heading: "Key concepts",
      items: [
        {
          label: "Priority date",
          body: "Your place in line — usually your PERM labor certification filing date (employment) or the date the I-130/I-140 petition was filed. It's fixed to you and portable in some cases.",
        },
        {
          label: "Final Action Date (FAD)",
          body: "The cutoff that controls when a green card can actually be approved. When your priority date is earlier than the FAD for your category/country, a visa number can be issued.",
        },
        {
          label: "Dates for Filing (DFF)",
          body: "A usually-earlier cutoff that lets you file your I-485 sooner — but only in months when USCIS announces it accepts the Dates for Filing chart.",
        },
        {
          label: "Country of chargeability",
          body: "Usually your country of birth, which determines which per-country column of the bulletin applies. Heavily demanded countries like India have their own, more backlogged, dates.",
        },
        {
          label: "EB2 / EB3 India",
          body: "Both are deeply backlogged for India and move independently. Sometimes EB3 is ahead of EB2 (or vice versa), which is why some applicants consider porting between them.",
        },
        {
          label: "Family-based categories",
          body: "Family preference categories (F1–F4) have their own priority dates and bulletin columns, separate from the employment categories, and also vary by country.",
        },
      ],
    },
    steps: [
      "Find your priority date (usually your PERM or petition filing date).",
      "Select your green card category (e.g., EB2, EB3, or a family category).",
      "Select your country of chargeability (usually India for India-born applicants).",
      "Compare your priority date to the current visa bulletin's Final Action and Dates for Filing dates.",
      "If Dates for Filing has reached your date and USCIS accepts that chart, you may be able to file your I-485.",
    ],
    mistakes: [
      "Comparing your priority date to the wrong chart (Final Action vs Dates for Filing).",
      "Filing I-485 on the Dates for Filing chart in a month USCIS isn't accepting it.",
      "Using country of citizenship instead of country of birth for chargeability.",
      "Assuming the bulletin only moves forward — dates can retrogress.",
      "Using the wrong priority date (e.g., the I-140 date where the PERM date applies).",
    ],
    relatedLinks: [
      { label: "Green card wait-time tracker", href: "/tools/green-card-tracker" },
      { label: "USCIS processing times", href: "/tools/processing-times" },
      { label: "USCIS case status meaning", href: "/tools/uscis-case-status-meaning" },
      { label: "USCIS receipt number decoder", href: "/tools/uscis-receipt-number-decoder" },
    ],
    updated: "2026-07-20",
    expertiseTags: ["Visa bulletin & priority dates", "Employment green cards", "India backlog analysis"],
    takeaways: [
      "Compare your date against two charts every month — Final Action Dates control approval, Dates for Filing control when you may submit the I-485.",
      "Read the rule literally: your priority date must be strictly earlier than the posted cutoff for you to act.",
      "Check the new bulletin around the 8th-10th of each month; it takes effect the following month.",
      "Know the codes — 'C' means current with no backlog, and 'U' means no visa numbers at all that month.",
      "Remember country of birth, not citizenship, decides which column applies to you.",
    ],
    howItWorks: {
      heading: "How this priority date check works",
      body:
        "The checker performs the same comparison an attorney would, against the same published data. It reads the current month's Final Action Dates and Dates for Filing for your category and country of chargeability from the centralized visa bulletin dataset this site maintains from the Department of State's monthly release, then compares those cutoffs to the priority date you enter. If your date falls before the posted cutoff you are shown as current for that chart; if the cell holds 'C' everyone is current, and if it holds 'U' no visa numbers exist that month and nobody in that category is current regardless of date. It also surfaces which chart USCIS has announced for adjustment-of-status filings that month, because being current on Dates for Filing without USCIS accepting that chart does not open a filing window. The tool makes no prediction about future movement and stores nothing you enter.",
    },
    connects: {
      heading: "How your priority date fits the rest of the process",
      body:
        "The date you enter here was set the day your PERM was filed (or your I-140, for EB-1 and EB-2 NIW), and it is the number every later stage waits on. When the checker shows you as current, the next step is the I-485 filing window; when it does not, the practical questions become how fast your category is moving and whether a different category would be faster. The explainer pages cover what the date means and how each category is behaving this month.",
      links: [
        { label: "What is a priority date?", href: "/visa-bulletin/priority-date" },
        { label: "Priority date current - what next", href: "/visa-bulletin/priority-date-current-what-next" },
        { label: "EB-2 India priority date", href: "/visa-bulletin/eb2-india" },
        { label: "EB-3 India priority date", href: "/visa-bulletin/eb3-india" },
        { label: "Green card wait time tracker", href: "/tools/green-card-tracker" },
      ],
    },
    table: {
      caption: "How to read your result",
      headers: ["What the bulletin shows", "What it means", "What you can do"],
      rows: [
        ["A date later than yours", "You are current for that chart", "Act — file or await approval, per the chart"],
        ["A date earlier than yours", "Not current yet", "Wait; watch monthly movement"],
        ["C (Current)", "No backlog in that category", "Any priority date qualifies"],
        ["U (Unavailable)", "No visa numbers that month", "Nobody is approved; wait for the new fiscal year"],
      ],
    },
    tables: [
      {
        caption: "Final Action Dates vs Dates for Filing",
        headers: ["Chart", "Also called", "What it controls", "When it applies"],
        rows: [
          ["Final Action Dates", "Table A", "When a green card can actually be approved", "Always"],
          ["Dates for Filing", "Table B", "When an I-485 may be submitted", "Only in months USCIS announces it accepts Chart B"],
        ],
      },
    ],
    faqs: [
      {
        question: "What is a priority date?",
        answer:
          "Your priority date is your place in the green card line — usually the date your PERM labor certification (employment) or I-130/I-140 petition was filed. A green card number becomes available only once the visa bulletin's date for your category and country reaches or passes it.",
      },
      {
        question: "How do I know if my priority date is current?",
        answer:
          "Compare your priority date to the visa bulletin date for your category and country of chargeability. If your priority date is earlier than the applicable chart's date, you're current for that chart — Final Action Dates for approval, or Dates for Filing to submit your I-485.",
      },
      {
        question: "Which visa bulletin chart should I use?",
        answer:
          "Use the Final Action Dates chart to know when a green card can be approved. Use the Dates for Filing chart to know when you can submit your I-485 — but only in months when USCIS announces it's accepting that chart for filing.",
      },
      {
        question: "What is a Final Action Date?",
        answer:
          "The Final Action Date is the cutoff that controls when a green card can actually be approved for your category and country. When your priority date is earlier than the Final Action Date, a visa number can be issued and your case can be approved.",
      },
      {
        question: "What is Dates for Filing?",
        answer:
          "Dates for Filing is a usually-earlier cutoff in the visa bulletin that lets you submit your I-485 sooner — unlocking EAD and travel benefits while you wait — but only in months when USCIS announces it will accept the Dates for Filing chart.",
      },
      {
        question: "Can a priority date move backward?",
        answer:
          "Yes. When demand exceeds the available visa numbers, the State Department can move a cutoff backward — called retrogression — or mark a category unavailable. Cases already filed stay in line, but approvals pause until the date advances past your priority date again.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 13. FBAR / FATCA checker
   * ------------------------------------------------------------------ */
  "fbar-fatca-checker": {
    slug: "fbar-fatca-checker",
    appCategory: "FinanceApplication",
    description:
      "FBAR & FATCA checker for NRIs — see whether your Indian accounts (NRE, NRO, FCNR, demat, mutual funds) and other foreign assets may need to be reported on FinCEN Form 114 (FBAR) or IRS Form 8938 (FATCA), and the reporting thresholds.",
    quickAnswer:
      "If you're a US person (citizen, green card holder, or US tax resident), you may need to report foreign financial accounts — including NRE, NRO, FCNR, Indian demat, and mutual fund accounts — once certain thresholds are met. FBAR (FinCEN Form 114) and FATCA (Form 8938) are reporting requirements; reporting an account doesn't by itself create a tax.",
    shortDescription:
      "Many NRIs are surprised that Indian bank and investment accounts can be reportable in the US. This checker helps you see whether your accounts likely cross the FBAR and FATCA thresholds, and explains the difference between the two so you can file correctly.",
    audience:
      "US persons with Indian financial accounts — NRIs, green card holders, and Indian-origin US citizens with NRE/NRO/FCNR accounts, Indian demat/mutual funds, or other foreign assets.",
    keyInputs: [
      "The types of foreign accounts you hold (NRE, NRO, FCNR, demat, mutual funds, PF, etc.)",
      "The highest balance in each account during the year (for FBAR's aggregate test)",
      "Whether any accounts are jointly held",
      "Your US filing status and whether you live in the US or abroad (affects 8938 thresholds)",
      "The year-end and maximum values of specified foreign financial assets (for Form 8938)",
    ],
    timelineFeeNote:
      "FBAR is filed annually to FinCEN, generally due with your tax return in April with an automatic extension to October. Form 8938 is filed with your income tax return. Thresholds and rules can change — verify current requirements before filing.",
    resultMeaning:
      "A 'likely reportable' result means your accounts may meet the FBAR and/or FATCA thresholds and should be reported — it does not mean you owe extra tax just for holding them. FBAR and Form 8938 are informational reports. Whether any income (like NRO interest) is taxable is a separate question handled on your tax return, often with a foreign tax credit under the DTAA.",
    table: {
      caption: "FBAR vs FATCA (Form 8938) at a glance",
      headers: ["Feature", "FBAR (FinCEN 114)", "FATCA (Form 8938)"],
      rows: [
        ["Filed with", "FinCEN, separately (BSA e-file)", "IRS, with your tax return"],
        ["Covers", "Foreign financial accounts", "Specified foreign financial assets"],
        ["Threshold", "Aggregate over $10,000 at any point in the year", "Higher, and varies by filing status and US vs abroad"],
        ["NRE / NRO / FCNR", "Reportable when threshold met", "Reportable when threshold met"],
        ["Indian mutual funds / demat", "Generally reportable", "Generally reportable"],
        ["Purpose", "Informational report of accounts", "Informational report of assets"],
      ],
    },
    steps: [
      "List every foreign account you hold or have signature authority over (NRE, NRO, FCNR, demat, mutual funds, PF).",
      "Find the highest balance in each during the year and total them for the FBAR aggregate test.",
      "If the aggregate exceeds the FBAR threshold, file FinCEN Form 114 electronically.",
      "Separately check the Form 8938 thresholds for your filing status and residence, and file it with your tax return if met.",
      "Report any taxable income from those accounts (e.g., NRO interest) on your return, using the DTAA foreign tax credit where applicable.",
    ],
    mistakes: [
      "Assuming NRE/NRO accounts don't count because they're in India — they generally do if you're a US person.",
      "Forgetting joint accounts or accounts where you only have signature authority.",
      "Reporting on FBAR but missing the separate Form 8938, or vice versa.",
      "Thinking reporting an account means you owe tax on the balance — it doesn't; only income is taxed.",
      "Overlooking Indian mutual funds/ETFs, which can also carry PFIC complications — consult a cross-border tax pro.",
    ],
    example: {
      title: "NRI on H-1B with NRE + NRO accounts",
      body: "Ravi is a US tax resident on H-1B with an NRE savings account and an NRO account in India. During the year the two accounts together peaked above $10,000, so he files an FBAR listing both. His total specified assets are below the Form 8938 threshold for his filing status, so he doesn't file 8938 this year. He also reports his NRO interest as income on his US return and claims a foreign tax credit for the Indian TDS under the DTAA — so he isn't taxed twice.",
    },
    relatedLinks: [
      { label: "RNOR & India tax residency calculator", href: "/calculators/rnor-tax-residency" },
      { label: "FCNR vs HYSA calculator", href: "/calculators/fcnr-vs-hysa" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "Form 3520 India gift checker", href: "/tools/form-3520-india-gift-checker" },
    ],
    tables: [
      {
        caption: "FATCA (Form 8938) reporting thresholds by filing status",
        headers: ["Your situation", "Total value on the last day of the year", "OR total value at any time during the year"],
        rows: [
          ["Single / married filing separately, living in the US", "Over $50,000", "Over $75,000"],
          ["Married filing jointly, living in the US", "Over $100,000", "Over $150,000"],
          ["Single / married filing separately, living abroad", "Over $200,000", "Over $300,000"],
          ["Married filing jointly, living abroad", "Over $400,000", "Over $600,000"],
          ["FBAR (all filers, for comparison)", "No year-end test", "Over $10,000 aggregate"],
        ],
      },
    ],
    updated: "2026-07-19",
    expertiseTags: ["FBAR & FATCA reporting", "NRI cross-border tax", "US-India compliance"],
    takeaways: [
      "File an FBAR (FinCEN Form 114) if all your foreign accounts combined exceeded $10,000 at any point during the year — even for a single day.",
      "File Form 8938 (FATCA) at much higher thresholds: $50,000 on the last day of the year or $75,000 at any time for a single filer living in the US.",
      "Double those FATCA thresholds if married filing jointly ($100,000 year-end / $150,000 peak), and roughly quadruple them if you live abroad.",
      "Aggregate every account: NRE, NRO, fixed deposits, PPF, demat, and Indian mutual funds all count toward the $10,000 FBAR test.",
      "The FBAR is due April 15 with an automatic extension to October 15 — no request needed — and is filed to FinCEN, not with your tax return.",
    ],
    howItWorks: {
      heading: "How this FBAR and FATCA check works",
      body:
        "The checker applies the two statutory tests independently, because they are genuinely different rules that catch different people. For the FBAR it sums the maximum balance of every foreign financial account you report during the calendar year and compares that aggregate to the $10,000 threshold — the test is the peak combined balance at any moment, not the year-end balance, and not per account. For Form 8938 it applies the FATCA threshold matched to your filing status and residence: $50,000 year-end or $75,000 peak for a single filer in the US, $100,000 / $150,000 for married filing jointly, and the substantially higher thresholds that apply if your tax home is abroad. Because the two tests use different definitions of a reportable asset, the tool can legitimately tell you that one applies and the other does not. It performs no currency conversion for you: convert using the Treasury year-end rate before entering balances, and confirm anything unusual with a cross-border CPA.",
    },
    connects: {
      heading: "How FBAR and FATCA fit your wider India tax picture",
      body:
        "Reporting an account is not the same as being taxed on it, but the two travel together. Interest on NRO deposits is taxed in India via TDS and is also reportable US income, with DTAA relief claimed through the foreign tax credit; Indian mutual funds raise separate PFIC questions that the FBAR total does not capture. Your residency status drives all of it — the year you move back to India, RNOR treatment changes both what India taxes and what you keep reporting to the US.",
      links: [
        { href: "/india-tax-compliance", label: "India tax & compliance for NRIs" },
        { href: "/nri-selling-property-in-india-tds", label: "TDS on selling property in India" },
        { href: "/return-to-india", label: "Returning to India: RNOR rules" },
        { href: "/tools/nri-tax-filing-roadmap", label: "NRI tax filing roadmap" },
      ],
    },
    faqs: [
      {
        question: "Do I report an NRE account on FBAR?",
        answer:
          "Generally yes, if you're a US person and your foreign accounts together exceed the FBAR aggregate threshold at any point in the year. An NRE account is a foreign financial account, so it counts toward the total and is listed on FinCEN Form 114 when the threshold is met.",
      },
      {
        question: "Is an NRO account reportable?",
        answer:
          "Yes, an NRO account is a foreign financial account and is generally reportable on FBAR (and possibly Form 8938) when the thresholds are met. NRO interest is also usually taxable income in the US, though you can often claim a foreign tax credit for the Indian TDS under the DTAA.",
      },
      {
        question: "What is the FBAR threshold?",
        answer:
          "FBAR is generally required when the aggregate value of your foreign financial accounts exceeds $10,000 at any point during the calendar year. It's an aggregate test across all your accounts, not per-account, so several smaller accounts can add up to cross it.",
      },
      {
        question: "What is FATCA Form 8938?",
        answer:
          "Form 8938 is the FATCA report of 'specified foreign financial assets' filed with your IRS tax return. Its thresholds are higher than FBAR's and vary by filing status and whether you live in the US or abroad. It overlaps with FBAR but is a separate, additional filing.",
      },
      {
        question: "Are Indian mutual funds reportable?",
        answer:
          "Generally yes — Indian mutual funds and demat holdings are typically reportable on FBAR and often Form 8938 when thresholds are met. Indian mutual funds can also raise PFIC (passive foreign investment company) issues on your US return, so consider a cross-border tax professional.",
      },
      {
        question: "What happens if I missed an FBAR?",
        answer:
          "There are established ways to catch up, such as the IRS streamlined or delinquent-filing procedures, especially where the failure was non-willful. Penalties exist but are often avoidable when you come forward and correct it. Because the details matter, consult a cross-border tax professional about the right path.",
      },
      {
        question: "Do I need to file FBAR?",
        answer:
          "You must file FinCEN Form 114 if the combined maximum balance of all your foreign financial accounts exceeded $10,000 at any point during the calendar year. It is an aggregate test across every account — NRE, NRO, fixed deposits, PPF, demat — not a per-account test, and even a single day above the threshold triggers it.",
      },
      {
        question: "What is the difference between FBAR and FATCA?",
        answer:
          "FBAR (FinCEN Form 114) is filed with FinCEN at a $10,000 aggregate threshold and covers foreign financial accounts. FATCA (Form 8938) is filed with your tax return at much higher thresholds — $50,000 year-end or $75,000 peak for a single filer in the US, doubled for married filing jointly — and covers a broader set of specified foreign financial assets. Many NRIs must file both.",
      },
      {
        question: "What is the FBAR deadline?",
        answer:
          "The FBAR is due April 15, with an automatic extension to October 15 that requires no request or form. It is filed electronically to FinCEN through the BSA E-Filing System, separately from your federal tax return.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 14. Form 10F generator
   * ------------------------------------------------------------------ */
  "form-10f-generator": {
    slug: "form-10f-generator",
    appCategory: "FinanceApplication",
    description:
      "Form 10F generator for NRIs — prepare the details for India's Form 10F used to claim DTAA tax-treaty benefits, alongside a Tax Residency Certificate (TRC) and PAN, so payers apply the correct (often lower) TDS.",
    quickAnswer:
      "Form 10F is commonly used by non-residents to claim DTAA tax-treaty benefits in India — typically together with a Tax Residency Certificate (TRC) from your country of residence and, where applicable, a PAN. It supplies the treaty details a payer needs to apply the correct, often reduced, TDS rate.",
    shortDescription:
      "When Indian income (interest, dividends, fees) is paid to a non-resident, the payer withholds TDS. Form 10F, with a TRC, lets you claim the treaty rate instead of the higher default. This tool helps you prepare the Form 10F details to give your bank, broker, or payer.",
    audience:
      "NRIs and other non-residents claiming India–US (or other) tax-treaty benefits on Indian income — for example, to reduce TDS on interest, dividends, or professional fees.",
    keyInputs: [
      "Your name, address, and country of tax residence",
      "Your Tax Residency Certificate (TRC) details",
      "Your PAN, where applicable",
      "Your tax identification number in your country of residence",
      "The period for which treaty benefits are claimed",
    ],
    timelineFeeNote:
      "Form 10F is usually prepared per financial year (or as your payer requires) and given to the payer/platform before TDS is deducted. Filing/portal requirements can change — verify current rules before submitting.",
    resultMeaning:
      "The prepared Form 10F gives your payer the treaty-relevant details they need to apply a reduced TDS rate under the DTAA. On its own it doesn't reduce tax automatically — the payer must accept it (usually with a valid TRC), and you may still need to file an Indian return to reconcile. Keep copies for your records and any refund claim.",
    explain: {
      heading: "What Form 10F is and when you need it",
      items: [
        {
          label: "What Form 10F is",
          body: "A short Indian form in which a non-resident provides treaty-relevant details (residency status, TIN, period) to support a claim for DTAA benefits on Indian income.",
        },
        {
          label: "When it's required",
          body: "Typically when you want a payer in India to apply a treaty (reduced) TDS rate rather than the higher default rate — for interest, dividends, fees, and similar income.",
        },
        {
          label: "Tax Residency Certificate (TRC)",
          body: "Usually required alongside Form 10F. The TRC is issued by your country of residence (for the US, via IRS Form 6166) to prove you're a treaty resident.",
        },
        {
          label: "PAN",
          body: "Where applicable, a PAN helps ensure correct TDS treatment and is often needed to avoid a higher withholding rate and to claim refunds.",
        },
        {
          label: "Treaty benefit & use cases",
          body: "Banks (on NRO interest), companies (on dividends), brokers, and clients paying professional fees may ask for Form 10F plus a TRC before applying the treaty rate.",
        },
      ],
    },
    steps: [
      "Obtain your Tax Residency Certificate (TRC) from your country of residence (US: IRS Form 6166).",
      "Prepare Form 10F with your residency, TIN, PAN (where applicable), and the period claimed.",
      "Submit Form 10F and the TRC to the payer/platform (bank, company, broker, or client) before TDS is deducted.",
      "Keep copies of the Form 10F, TRC, and any acknowledgement for your records.",
      "If TDS was still over-deducted, claim the excess by filing an Indian tax return.",
    ],
    documents: {
      heading: "Documents to have ready",
      items: [
        "Tax Residency Certificate (TRC) from your country of residence",
        "PAN card (where applicable)",
        "Passport / proof of identity and address",
        "Your foreign Tax Identification Number (TIN)",
        "Details of the Indian income and payer",
      ],
    },
    mistakes: [
      "Submitting Form 10F without a valid TRC, which payers usually require.",
      "Not having a PAN where it's needed, leading to a higher default TDS rate.",
      "Giving Form 10F to the payer after TDS is already deducted instead of before.",
      "Letting the TRC lapse or cover the wrong period.",
      "Assuming Form 10F alone eliminates the need to file an Indian return to reconcile.",
    ],
    relatedLinks: [
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
      { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
      { label: "Form 15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
    ],
    faqs: [
      {
        question: "What is Form 10F?",
        answer:
          "Form 10F is an Indian form in which a non-resident supplies treaty-relevant details to claim DTAA benefits on Indian income. It's typically provided to a payer (bank, company, broker) alongside a Tax Residency Certificate so they apply the reduced treaty TDS rate.",
      },
      {
        question: "Is Form 10F mandatory for NRIs?",
        answer:
          "It's generally required when you want to claim treaty (DTAA) benefits — such as a reduced TDS rate — on Indian income. If you're not claiming treaty benefits, you may not need it, but payers usually ask for it (with a TRC) before applying a lower rate.",
      },
      {
        question: "Do I need a TRC for Form 10F?",
        answer:
          "Usually yes. A Tax Residency Certificate from your country of residence (for the US, IRS Form 6166) is normally required to support the treaty claim. Form 10F provides the additional details, but the TRC is what proves your treaty residency.",
      },
      {
        question: "Is a PAN required for Form 10F?",
        answer:
          "Where applicable, a PAN helps ensure the correct TDS rate and is often needed to avoid a higher default withholding and to claim refunds. Requirements have evolved, so confirm the current rule with your payer or a tax professional.",
      },
      {
        question: "Where do I submit Form 10F?",
        answer:
          "You typically provide Form 10F (with your TRC) to the Indian payer or platform deducting TDS — such as your bank, the dividend-paying company, your broker, or a client. Depending on current rules, electronic filing on the Indian income-tax portal may also apply, so verify before submitting.",
      },
      {
        question: "Does Form 10F reduce TDS?",
        answer:
          "Indirectly, yes — it supports your claim for the treaty rate so the payer can apply a lower TDS than the default. It doesn't reduce tax automatically; the payer must accept it (usually with a valid TRC), and you may still file an Indian return to reconcile any excess.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 15. Form 15CA / 15CB checklist
   * ------------------------------------------------------------------ */
  "form-15ca-15cb-checklist": {
    slug: "form-15ca-15cb-checklist",
    appCategory: "FinanceApplication",
    description:
      "Form 15CA & 15CB checklist for NRIs — the documents and steps to repatriate money from India to the USA, including when a Chartered Accountant's Form 15CB certificate is required and how purpose codes and property-sale proceeds are handled.",
    quickAnswer:
      "Form 15CA (a remitter declaration) and Form 15CB (a Chartered Accountant's certificate) may be required for certain remittances from India to the USA — especially where the taxability of the money needs to be certified before the bank will process the transfer. Not every remittance needs both.",
    shortDescription:
      "Banks often ask for Form 15CA (and sometimes 15CB) before releasing an outward remittance from an NRO/NRE account. This checklist explains which forms apply, when a CA certificate is needed, and the documents to gather so your repatriation isn't held up.",
    audience:
      "NRIs repatriating funds from India to the USA — from NRO account balances, property sale proceeds, or other income — who need to know which forms and documents the bank will require.",
    keyInputs: [
      "The source of the funds (NRO balance, property sale, gift, income, etc.)",
      "The remittance amount and purpose code",
      "Whether the funds are taxable and whether tax has been paid",
      "Your PAN and bank/account details",
      "Supporting documents proving the source and tax status",
    ],
    timelineFeeNote:
      "15CA is filed by the remitter on the income-tax portal; 15CB (when needed) is issued by a Chartered Accountant, usually for a fee. Thresholds and exemptions change — verify current requirements with your bank/CA before filing.",
    resultMeaning:
      "The checklist tells you which forms your remittance likely needs and what to prepare. A completed 15CA (and 15CB where required) certifies the tax status of the money so the bank can process the outward transfer. It doesn't create a new tax — it documents that applicable Indian tax has been handled on the funds being sent.",
    explain: {
      heading: "The forms and when each applies",
      items: [
        {
          label: "Form 15CA",
          body: "An online declaration by the remitter (you) about the remittance and its tax status, filed on the Indian income-tax portal. It has different parts depending on amount and taxability.",
        },
        {
          label: "Form 15CB",
          body: "A certificate from a Chartered Accountant confirming the nature of the payment, taxability, and that applicable TDS/tax has been dealt with. It's typically required for larger taxable remittances.",
        },
        {
          label: "CA certificate & purpose codes",
          body: "The CA verifies the source and applies the correct purpose code (the RBI category for the remittance). The right purpose code matters for both the bank and compliance.",
        },
        {
          label: "Property sale repatriation",
          body: "Sending property-sale proceeds abroad usually requires careful documentation of the sale, capital gains, and TDS, and commonly a 15CB certificate.",
        },
        {
          label: "NRO to foreign account",
          body: "Moving money out of an NRO account to a US account is a classic 15CA/15CB scenario, subject to the annual repatriation limit.",
        },
        {
          label: "When it's not required",
          body: "Certain small or specified remittances are exempt from 15CB (and sometimes 15CA parts). Confirm the current exemptions before assuming a form is needed.",
        },
      ],
    },
    steps: [
      "Identify the source of the funds and gather documents proving it (sale deed, income proof, tax paid).",
      "Have a Chartered Accountant review taxability and, if required, issue Form 15CB.",
      "File Form 15CA on the income-tax portal (the relevant part based on amount/taxability).",
      "Obtain Form 15CB from the CA where the remittance requires it.",
      "Submit 15CA/15CB and supporting documents to your bank to process the outward remittance.",
    ],
    documents: {
      heading: "Documents typically needed",
      items: [
        "PAN and passport",
        "Bank account details (NRO/NRE) and remittance request",
        "Proof of source of funds (sale deed, income proof, gift documents)",
        "Evidence of tax paid / TDS on the funds",
        "Form 15CB from a Chartered Accountant (where required)",
        "Purpose code for the remittance",
      ],
    },
    mistakes: [
      "Assuming 15CB is always required — some remittances are exempt.",
      "Using the wrong purpose code, which can stall the transfer at the bank.",
      "Not documenting the source of funds (especially for property sales) before requesting the remittance.",
      "Exceeding the annual repatriation limit without realizing it.",
      "Filing 15CA in the wrong part for the amount/taxability.",
    ],
    relatedLinks: [
      { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
      { label: "India property capital gains calculator", href: "/calculators/india-property-capital-gains" },
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
    ],
    faqs: [
      {
        question: "What is Form 15CA?",
        answer:
          "Form 15CA is an online declaration filed by the remitter on the Indian income-tax portal about a foreign remittance and its tax status. It has different parts depending on the amount and whether the payment is taxable, and banks usually require it before processing an outward transfer.",
      },
      {
        question: "What is Form 15CB?",
        answer:
          "Form 15CB is a certificate from a Chartered Accountant certifying the nature of a remittance, its taxability, and that applicable tax/TDS has been handled. It's typically required for larger taxable remittances and supports the details declared in Form 15CA.",
      },
      {
        question: "Is Form 15CB always required?",
        answer:
          "No. Certain small or specified remittances are exempt from 15CB, and some only need parts of 15CA. Whether you need a CA certificate depends on the amount and taxability, so confirm the current thresholds and exemptions with your bank or CA.",
      },
      {
        question: "Do NRIs need Form 15CA for remittance?",
        answer:
          "Often yes — banks commonly require Form 15CA (and 15CB where applicable) before releasing an outward remittance from an NRO/NRE account. Some specified or small remittances are exempt, so check the current rules for your specific transfer.",
      },
      {
        question: "What documents are needed for repatriation?",
        answer:
          "Typically your PAN and passport, bank details, proof of the source of funds (such as a sale deed or income proof), evidence that applicable tax/TDS was handled, the correct purpose code, and Form 15CB from a CA where required. Property-sale repatriations need the most documentation.",
      },
      {
        question: "Can I transfer property sale money to the USA?",
        answer:
          "Yes, within the annual repatriation limit and after taxes. You'll generally document the sale and capital gains, ensure TDS/tax is handled, obtain a 15CB certificate where required, file 15CA, and submit everything to your bank. Keep records for your Indian return and any refund claim.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 16. Form 3520 India gift checker
   * ------------------------------------------------------------------ */
  "form-3520-india-gift-checker": {
    slug: "form-3520-india-gift-checker",
    appCategory: "FinanceApplication",
    description:
      "Form 3520 India gift checker — see whether a large gift or inheritance from parents or relatives in India may need to be reported to the IRS on Form 3520, and understand that reporting a foreign gift usually doesn't mean tax is due.",
    quickAnswer:
      "A US person who receives a large gift or inheritance from a foreign person (like parents in India) may need to report it to the IRS on Form 3520 once the reporting threshold is met. Importantly, reporting a foreign gift is usually informational — it does not by itself mean US tax is owed on the gift.",
    shortDescription:
      "Money or property received from family in India can trigger a US reporting requirement even when no tax is due. This checker helps you see whether a gift or inheritance likely crosses the Form 3520 threshold so you can report it and avoid steep penalties for a missed form.",
    audience:
      "US persons (citizens, green card holders, US tax residents) receiving large gifts or inheritances from parents, relatives, or estates in India.",
    keyInputs: [
      "Who the source was (a nonresident individual, a foreign estate, a foreign corporation/partnership, or a foreign trust)",
      "The total value received from that person during the year",
      "Whether it was a gift or an inheritance",
      "Whether multiple related foreign persons gave amounts that should be aggregated",
      "The tax year the amounts were received",
    ],
    timelineFeeNote:
      "Form 3520 is filed separately from Form 1040 — not attached to it. For most calendar-year individuals it is generally due April 15 (June 15 if you live and work abroad), and a valid return extension generally moves it no later than October 15. Reporting rules differ for gifts from foreign individuals, foreign estates, foreign corporations/partnerships, and foreign trusts — verify the current instructions before filing.",
    resultMeaning:
      "A 'likely reportable' result means the amount may cross the Form 3520 threshold and should be reported — not that you owe tax on the gift. Gifts and inheritances from foreign persons are generally not US-taxable income to the recipient; Form 3520 is an informational report. The main risk is a penalty for failing to file, not tax on the gift itself.",
    explain: {
      heading: "Foreign gifts, inheritances, and reporting",
      items: [
        {
          label: "Foreign gift",
          body: "Money or property given to you by a foreign person (not a US person) with nothing expected in return. Large foreign gifts can trigger Form 3520 reporting.",
        },
        {
          label: "Inheritance",
          body: "Amounts received from a foreign person's estate. These are also reportable on Form 3520 when the threshold is met, and are generally not US-taxable income to you.",
        },
        {
          label: "Parents in India / NRI family transfers",
          body: "A common scenario: parents in India transfer a large sum to their child in the US. If it exceeds the threshold for gifts from a foreign individual, the US-person recipient reports it on Form 3520.",
        },
        {
          label: "Reporting threshold",
          body: "The rule depends on the source. Gifts or bequests from a nonresident individual or a foreign estate use the aggregate $100,000 test; purported gifts from a foreign corporation or partnership use a separate, annually-indexed threshold; and a foreign trust follows Part III rules rather than a gift threshold. Related givers may need to be aggregated. Confirm the current figures before deciding.",
        },
        {
          label: "Gift tax vs reporting",
          body: "US gift tax is generally the giver's concern, and a foreign giver usually isn't subject to it. For the US recipient, Form 3520 is a report, not a tax — the two are different things.",
        },
        {
          label: "Penalties for missing the form",
          body: "The penalty risk for not filing Form 3520 can be significant, which is why reporting matters even though the gift itself usually isn't taxed. Correcting a missed form is possible.",
        },
      ],
    },
    // Intentionally empty: the interactive checker already walks the user
    // through the process, and the step-by-step / common-mistakes narratives
    // are covered in depth by the pillar and cash-gift guides. Keeping them
    // here would reproduce a second full guide below the tool (ToolDeepDive
    // hides these sections when the arrays are empty).
    steps: [],
    mistakes: [],
    example: {
      title: "Parents in India send a down-payment gift to their child in the US",
      body: "Anjali, a US green card holder, receives a large sum from her parents in India to help buy a home. Because the aggregate exceeds the $100,000 Form 3520 threshold for gifts from a nonresident individual, she files Form 3520 — separately from her Form 1040 — for that tax year. She owes no US tax on the gift itself; it's an informational report, but filing protects her from the steep penalty for a missed form. She keeps the bank transfer records and a short gift letter from her parents.",
    },
    relatedLinks: [
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
      { label: "Remittance & TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "Form 15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
    ],
    faqs: [
      {
        question: "Do I pay tax on a gift from parents in India?",
        answer:
          "Generally no. A gift from a foreign person like your parents is usually not US-taxable income to you as the recipient. However, if it's large enough you may need to report it on Form 3520 — that's an informational report, not a tax on the gift.",
      },
      {
        question: "When is Form 3520 required?",
        answer:
          "For US persons, Form 3520 is generally required when gifts or bequests from a nonresident individual or a foreign estate exceed $100,000 for the year, or when a purported gift from a foreign corporation or partnership exceeds the separate, annually-indexed threshold. A distribution from a foreign trust follows different Part III rules rather than a gift threshold. Related givers may need to be aggregated.",
      },
      {
        question: "Is an inheritance from India taxable in the USA?",
        answer:
          "An inheritance from a foreign person is generally not US-taxable income to the recipient. Like large foreign gifts, though, it may need to be reported on Form 3520 once the threshold is met. Any later income the inherited assets produce can be taxable.",
      },
      {
        question: "Does gift reporting mean tax is due?",
        answer:
          "No. Reporting a foreign gift or inheritance on Form 3520 is informational — it generally does not create a tax on the amount received. The purpose is disclosure; the main risk of skipping it is a penalty for failing to file, not tax on the gift.",
      },
      {
        question: "What if I forgot Form 3520?",
        answer:
          "Missed Form 3520 filings can often be corrected, sometimes with reasonable-cause relief, especially where no tax was due. Because the penalties can be significant, it's best to address it promptly with a cross-border tax professional rather than ignore it.",
      },
      {
        question: "Are foreign wire transfers automatically taxable?",
        answer:
          "No. A wire transfer itself isn't a taxable event — what matters is the nature of the money. A genuine gift or inheritance from a foreign person is generally not taxable to the US recipient, though large amounts may be reportable on Form 3520.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 17. NRI TDS refund checklist
   * ------------------------------------------------------------------ */
  "nri-tds-refund-checklist": {
    slug: "nri-tds-refund-checklist",
    appCategory: "FinanceApplication",
    description:
      "NRI TDS refund checklist — how to reclaim excess TDS on NRO interest, property sales, and capital gains by filing an Indian income-tax return, plus the documents (Form 16A, Form 26AS/AIS) and refund timeline.",
    quickAnswer:
      "NRIs can often reclaim excess TDS by filing an Indian income-tax return when the tax deducted at source is more than the actual tax liability. This is common on NRO interest and, especially, property sales — where TDS is deducted on the sale value rather than just the gain.",
    shortDescription:
      "NRIs frequently have far more TDS withheld than they actually owe — particularly on property sales. This checklist walks through the documents and steps to file an Indian return and claim the refund, and gives a realistic sense of the refund timeline.",
    audience:
      "NRIs who had Indian TDS withheld — on NRO interest, property sales, or capital gains — and want to reclaim the excess by filing an Indian income-tax return.",
    keyInputs: [
      "The type of income TDS was deducted on (NRO interest, property sale, capital gains)",
      "The TDS amount withheld (from Form 16A / TDS certificate)",
      "Your actual income and tax liability for the year",
      "Whether you obtained a lower/nil TDS certificate",
      "Your PAN and Indian bank account for the refund",
    ],
    timelineFeeNote:
      "Refunds are claimed by filing an Indian income-tax return for the relevant year. Processing commonly takes a few weeks to several months after filing and verification. Timelines vary — treat any estimate as approximate.",
    resultMeaning:
      "The checklist shows whether you likely have refundable excess TDS and what to file. Because TDS (especially on property sales) is often deducted on the gross amount rather than the actual gain, the withheld tax frequently exceeds the real liability — and the difference comes back as a refund once you file and the return is processed.",
    explain: {
      heading: "Where excess TDS comes from",
      items: [
        {
          label: "NRO interest TDS",
          body: "Banks deduct TDS on NRO account interest at the applicable non-resident rate. If your overall Indian tax is lower (or the DTAA rate applies), part of it may be refundable.",
        },
        {
          label: "Property sale TDS",
          body: "For NRI sellers, the buyer deducts TDS on the sale consideration (not just the gain), which usually far exceeds the actual capital gains tax — creating a large refundable amount.",
        },
        {
          label: "Capital gains",
          body: "Your real tax is on the gain (after cost and any exemptions), so the gap between TDS on the sale value and tax on the gain is typically refundable.",
        },
        {
          label: "Lower deduction certificate",
          body: "A lower/nil TDS certificate (Form 13) obtained before the sale reduces the amount withheld up front, shrinking the refund you have to chase later.",
        },
        {
          label: "ITR filing",
          body: "The refund is claimed by filing an Indian income-tax return that reports the income, the tax actually due, and the TDS already paid.",
        },
      ],
    },
    steps: [
      "Collect your Form 16A / TDS certificates showing the tax deducted.",
      "Check Form 26AS and the AIS to confirm the TDS is credited against your PAN.",
      "Calculate your actual tax liability on the income (e.g., gain, not sale value; DTAA rate on interest).",
      "File your Indian income-tax return reporting the income, tax due, and TDS paid.",
      "Verify the return and track the refund to your Indian bank account.",
    ],
    documents: {
      heading: "Documents needed",
      items: [
        "Form 16A / TDS certificates for the deducted tax",
        "Form 26AS and AIS (tax credit statements)",
        "Sale deed and cost documents (for property sales)",
        "Bank interest statements (for NRO interest)",
        "Any lower/nil TDS certificate (Form 13)",
        "PAN and a valid Indian bank account for the refund",
      ],
    },
    mistakes: [
      "Not filing a return because 'TDS was already deducted' — filing is how you reclaim the excess.",
      "Assuming property-sale TDS equals the tax due — it's usually on the sale value, so much is refundable.",
      "Filing before the TDS shows in Form 26AS/AIS, causing mismatches.",
      "Missing the DTAA benefit on NRO interest, leaving refundable tax on the table.",
      "Not keeping cost/sale documentation needed to prove the actual gain.",
    ],
    example: {
      title: "NRI reclaiming TDS after selling a flat in India",
      body: "Deepa, an NRI, sells a flat and the buyer withholds TDS on the full sale value — far more than her actual long-term capital gains tax. She collects the TDS certificate, confirms it in Form 26AS, computes tax on the gain (after indexed cost and a 54EC reinvestment), and files an Indian return. The tax due is much lower than the TDS withheld, so she claims a sizable refund to her NRO account. Had she obtained a lower-TDS certificate before the sale, less would have been blocked in the first place.",
    },
    relatedLinks: [
      { label: "India property capital gains calculator", href: "/calculators/india-property-capital-gains" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
      { label: "Form 15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
    ],
    faqs: [
      {
        question: "Can an NRI claim a TDS refund?",
        answer:
          "Yes. When the TDS deducted is more than your actual Indian tax liability, you can reclaim the excess by filing an Indian income-tax return for that year. This is common on NRO interest and especially on property sales, where TDS is deducted on the sale value.",
      },
      {
        question: "How long does an NRI TDS refund take?",
        answer:
          "It varies. After you file and verify your return, refunds commonly take from a few weeks to several months to be processed and credited. Accurate details and a validated Indian bank account help avoid delays. Treat any timeframe as an estimate.",
      },
      {
        question: "Is an ITR required for a TDS refund?",
        answer:
          "Yes. Filing an Indian income-tax return is the mechanism to claim a refund — it reports your actual income and tax due against the TDS already paid, and the difference is refunded. There's generally no refund without filing a return.",
      },
      {
        question: "Can an NRI claim a refund on property sale TDS?",
        answer:
          "Yes, and it's often substantial. Because TDS on an NRI's property sale is usually deducted on the full sale consideration rather than the actual gain, the withheld amount typically exceeds the real capital gains tax — and the excess is refundable when you file.",
      },
      {
        question: "What documents are needed?",
        answer:
          "Commonly your Form 16A/TDS certificates, Form 26AS and AIS, sale deed and cost documents (for property), bank interest statements (for NRO interest), any lower-TDS certificate, your PAN, and a valid Indian bank account for the refund.",
      },
      {
        question: "What is a lower TDS certificate?",
        answer:
          "A lower/nil TDS certificate (Form 13) is obtained before a transaction so tax is withheld closer to your actual liability rather than the default higher rate. For property sales it prevents a large amount being blocked and refunded later — reducing the refund you have to chase.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 18. OCI cost calculator
   * ------------------------------------------------------------------ */
  "oci-cost-calculator": {
    slug: "oci-cost-calculator",
    appCategory: "ReferenceApplication",
    description:
      "OCI cost calculator for applicants in the USA — estimate the all-in cost of an OCI card, including the Indian government fee, VFS/service fee, courier/shipping, and optional photo and notary costs, with a last-reviewed date.",
    quickAnswer:
      "OCI cost in the USA usually combines several parts: the Indian government fee, the VFS/service fee, courier/return shipping, and optional costs like photos and notarization. Fees change periodically, so treat any total as an estimate and confirm the current amounts on the official VFS/portal before paying.",
    shortDescription:
      "The OCI 'price' isn't a single number — it's a stack of government, service, and shipping fees, plus a few optional add-ons. This tool estimates the all-in cost so you can budget, with the live fee breakdown and a last-reviewed date shown on the page.",
    audience:
      "People of Indian origin (and eligible spouses) in the USA applying for a new OCI card or reissue who want to budget the total cost before starting.",
    keyInputs: [
      "Application type (fresh OCI vs reissue/renewal)",
      "Number of applicants (e.g., family members)",
      "Whether you'll mail the application or apply in person",
      "Return courier/shipping preference",
      "Optional costs you may need (photos, notary)",
    ],
    timelineFeeNote:
      "Costs are estimates that change over time — the page shows a last-reviewed date and links to official sources. Always confirm the current Indian government fee and VFS service fee before paying.",
    resultMeaning:
      "The estimate adds up the typical OCI cost components so you can budget the all-in amount, not just the government fee. Because fees are revised periodically, use the number as a planning estimate and verify each component against the official VFS and Indian government portals before you pay.",
    fees: {
      heading: "What makes up the OCI cost (estimated)",
      items: [
        {
          label: "Indian government fee",
          body: "The core fee set by the Government of India for the OCI service (fresh or reissue). This is the largest fixed component and is revised from time to time.",
        },
        {
          label: "VFS / service fee",
          body: "A separate service fee charged by VFS Global (the outsourced processor in the USA) on top of the government fee.",
        },
        {
          label: "Courier / return shipping",
          body: "Cost to mail your documents in and to have your passport/OCI returned securely — varies by carrier and speed.",
        },
        {
          label: "Photo & notary (optional)",
          body: "Passport-spec photos and any notarization you may need are usually small, optional add-ons.",
        },
      ],
      note: "Fees change and vary by application type — the live breakdown and last-reviewed date are shown on this page. Verify current amounts before paying.",
      sourceUrl: "https://visa.vfsglobal.com/usa/en/ind/apply-oci-services",
      sourceName: "VFS Global — OCI services (USA)",
    },
    steps: [
      "Prepare your documents and confirm your application type (fresh vs reissue).",
      "Complete the online OCI application on the Indian government portal.",
      "Book a VFS appointment or prepare a mail-in submission per current instructions.",
      "Pay the government fee, VFS service fee, and shipping; keep receipts.",
      "Track the application and receive the OCI by the return courier you selected.",
    ],
    mistakes: [
      "Budgeting only the government fee and forgetting the VFS service fee and shipping.",
      "Assuming last year's fees still apply — they're revised periodically.",
      "Overlooking per-applicant costs when applying as a family.",
      "Missing optional but sometimes-required costs (photos to spec, notarization).",
      "Paying before confirming the current amounts on the official sources.",
    ],
    relatedLinks: [
      { label: "OCI eligibility checker", href: "/tools/oci-eligibility-checker" },
      { label: "OCI timeline calculator", href: "/tools/oci-timeline-calculator" },
      { label: "OCI resource center", href: "/oci" },
    ],
    faqs: [
      {
        question: "How much does OCI cost in the USA?",
        answer:
          "There's no single fixed number — the all-in cost combines the Indian government fee, the VFS service fee, courier/shipping, and optional photo/notary costs. The live breakdown and a last-reviewed date are shown on this page; always confirm current amounts before paying.",
      },
      {
        question: "What fees are included in an OCI application?",
        answer:
          "Typically the Indian government service fee, the VFS Global service fee, and return courier/shipping, plus optional costs like passport-spec photos and notarization. Together these make up the all-in OCI cost, which is more than the government fee alone.",
      },
      {
        question: "Is the VFS fee separate?",
        answer:
          "Yes. VFS Global charges its own service fee on top of the Indian government fee, since VFS processes OCI applications in the USA. Both appear as separate line items, so budget for them together.",
      },
      {
        question: "Does OCI renewal cost the same?",
        answer:
          "OCI reissue/renewal fees can differ from a fresh application, and both are revised periodically. Check the current amounts for your specific application type on the official VFS/government portal rather than assuming they match.",
      },
      {
        question: "Can the OCI fee change?",
        answer:
          "Yes. Both the Indian government fee and the VFS service fee are revised from time to time. That's why this page shows a last-reviewed date and links to official sources — treat any figure as an estimate and verify before paying.",
      },
      {
        question: "Is courier included in the OCI cost?",
        answer:
          "Courier/return shipping is usually a separate cost you pay for secure mailing of your documents and the return of your passport/OCI. It's part of the all-in cost but isn't part of the government or VFS service fee itself.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 19. OCI eligibility checker
   * ------------------------------------------------------------------ */
  "oci-eligibility-checker": {
    slug: "oci-eligibility-checker",
    appCategory: "ReferenceApplication",
    description:
      "OCI eligibility checker — see whether you qualify for an Overseas Citizen of India card based on former Indian citizenship, parent/grandparent/great-grandparent Indian origin, spouse rules, and the categories that are not eligible.",
    quickAnswer:
      "OCI eligibility generally depends on your Indian origin or connection: former Indian citizens, and people with a parent, grandparent, or great-grandparent who was an Indian citizen, often qualify, as can certain spouses of Indian citizens/OCIs. Some categories are not eligible — including those with certain citizenship histories — so check the specific rules.",
    shortDescription:
      "OCI eligibility has several qualifying routes and a few hard exclusions. This checker helps you see whether your Indian-origin connection or spouse relationship likely qualifies, and what documents you'd use to prove it — so you don't apply (and pay) before confirming.",
    audience:
      "People of Indian origin abroad (and spouses of Indian citizens/OCIs) who want to confirm whether they're eligible for an OCI card before applying.",
    keyInputs: [
      "Whether you were ever an Indian citizen",
      "Whether a parent, grandparent, or great-grandparent was an Indian citizen",
      "Whether you're the spouse of an Indian citizen or OCI (and marriage duration)",
      "Whether the applicant is a minor child of eligible parents",
      "Your current citizenship and any prior citizenship history",
    ],
    resultMeaning:
      "A 'likely eligible' result points to the qualifying route (former citizen, ancestry, or spouse) and the documents you'd use to prove it. Eligibility ultimately depends on the official rules and document verification, and some categories are excluded, so treat the result as guidance and confirm against the official OCI criteria before applying.",
    explain: {
      heading: "Who qualifies (and who doesn't)",
      items: [
        {
          label: "Former Indian citizen",
          body: "Someone who was a citizen of India at or after independence, and later took another citizenship, is a core eligible category.",
        },
        {
          label: "Child / grandchild / great-grandchild",
          body: "A person whose parent, grandparent, or great-grandparent was an Indian citizen may qualify by ancestry, with documents tracing that link.",
        },
        {
          label: "Spouse eligibility",
          body: "A foreign-origin spouse of an Indian citizen or an OCI cardholder can be eligible, generally subject to a minimum marriage duration and other conditions.",
        },
        {
          label: "Minor child",
          body: "A minor child where both parents are Indian citizens, or one parent is an Indian citizen, may qualify depending on the situation.",
        },
        {
          label: "Ineligible categories",
          body: "Certain people are not eligible — for example, those who (or whose parents/grandparents) have been citizens of specific countries (such as Pakistan or Bangladesh) may be excluded. These exclusions are specific, so verify carefully against the official criteria.",
        },
      ],
    },
    documents: {
      heading: "Documents that prove Indian origin",
      items: [
        "Current foreign passport",
        "Naturalization/citizenship certificate (showing when you acquired foreign citizenship)",
        "Old/expired Indian passport (or a parent's/grandparent's proof of Indian citizenship)",
        "Birth certificate linking you to the Indian-citizen ancestor",
        "Marriage certificate (for spouse-based applications)",
      ],
    },
    steps: [
      "Identify your qualifying route (former citizen, ancestry, or spouse).",
      "Gather documents that prove the Indian-origin link or marriage.",
      "Check the exclusions to confirm you're not in an ineligible category.",
      "Confirm the current eligibility rules on the official OCI portal/VFS.",
      "Proceed to the application only once eligibility and documents are confirmed.",
    ],
    mistakes: [
      "Applying before confirming the Indian-origin link can be documented.",
      "Assuming a distant ancestor qualifies without the paperwork to trace the link.",
      "Overlooking the marriage-duration condition for spouse applications.",
      "Missing an exclusion category based on prior citizenship history.",
      "Not having the naturalization certificate that shows when Indian citizenship ended.",
    ],
    relatedLinks: [
      { label: "OCI cost calculator", href: "/tools/oci-cost-calculator" },
      { label: "OCI timeline calculator", href: "/tools/oci-timeline-calculator" },
      { label: "OCI resource center", href: "/oci" },
    ],
    faqs: [
      {
        question: "Who is eligible for OCI?",
        answer:
          "Broadly, former Indian citizens and people with a parent, grandparent, or great-grandparent who was an Indian citizen, plus certain spouses of Indian citizens/OCIs, can be eligible. Some categories are excluded, so confirm your specific route against the official OCI criteria.",
      },
      {
        question: "Can a US citizen of Indian origin apply for OCI?",
        answer:
          "Yes, typically. A US citizen who is a former Indian citizen, or who has the qualifying Indian-origin ancestry (parent/grandparent/great-grandparent who was an Indian citizen), can generally apply — provided they can document the link and aren't in an excluded category.",
      },
      {
        question: "Can the spouse of an Indian-origin person apply?",
        answer:
          "A foreign-origin spouse of an Indian citizen or an OCI cardholder can be eligible, generally subject to a minimum marriage duration and other conditions. You'd provide a marriage certificate and the spouse's Indian citizenship/OCI proof.",
      },
      {
        question: "Can a minor child apply for OCI?",
        answer:
          "Yes, minor children can be eligible — for example, where both parents are Indian citizens, or one parent is an Indian citizen (or OCI). The exact route depends on the parents' status, and you'd provide the child's birth certificate and the parents' documents.",
      },
      {
        question: "Who is not eligible for OCI?",
        answer:
          "Certain categories are excluded — notably people who, or whose parents or grandparents, have been citizens of specific countries (such as Pakistan or Bangladesh). These exclusions are specific and can affect otherwise-eligible applicants, so verify carefully against the official rules.",
      },
      {
        question: "What documents prove Indian origin?",
        answer:
          "Commonly an old/expired Indian passport, a naturalization certificate showing when you took foreign citizenship, a birth certificate linking you to an Indian-citizen ancestor, and (for ancestry claims) the ancestor's proof of Indian citizenship. Spouses add a marriage certificate.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * 20. OCI timeline calculator
   * ------------------------------------------------------------------ */
  "oci-timeline-calculator": {
    slug: "oci-timeline-calculator",
    appCategory: "ReferenceApplication",
    description:
      "OCI timeline calculator for the USA — estimate how long an OCI card takes across each stage: document prep, submission, VFS acknowledgement, consulate processing, printing/dispatch, and courier delivery, plus the common delays to avoid.",
    quickAnswer:
      "The OCI timeline depends on your application type, your consulate jurisdiction, VFS processing, document quality, any police/mission review, and courier delivery. Because several independent stages are involved, treat any total as an estimate and verify current processing times before planning travel.",
    shortDescription:
      "OCI processing isn't one wait — it's a chain of stages, each with its own variability. This tool estimates the end-to-end timeline stage by stage and flags the common issues (photo, signature, name mismatch) that add weeks, so you can plan realistically.",
    audience:
      "OCI applicants in the USA who want a realistic, stage-by-stage estimate of how long their card will take and what commonly causes delays.",
    keyInputs: [
      "Your application type (fresh OCI vs reissue)",
      "Your consulate jurisdiction",
      "Whether your documents (photo, signature) meet the exact specs",
      "Whether any additional mission/police review may apply",
      "Your return courier/shipping choice",
    ],
    timelineFeeNote:
      "Processing times vary by jurisdiction and application type and change over time — the page shows the current estimate and a last-reviewed date. Verify official processing times before booking any travel.",
    resultMeaning:
      "The estimate adds up the typical time for each stage so you get an end-to-end range rather than a single guess. Because any one stage (especially consulate review or a document issue) can extend the total, use the estimate for planning and avoid booking non-refundable travel that assumes the fastest path.",
    timeline: {
      title: "OCI timeline, stage by stage",
      intro: "Estimated stages — actual times vary by jurisdiction and are shown live on the page.",
      rows: [
        { stage: "Prepare documents", estimate: "Varies (your prep)", notes: "Photo, signature, and scans to exact spec save time later." },
        { stage: "Submit application", estimate: "Day 0", notes: "Online application + VFS mail-in or appointment." },
        { stage: "VFS acknowledgement", estimate: "Days", notes: "VFS receives and forwards your file." },
        { stage: "Consulate/mission processing", estimate: "The main wait", notes: "Includes any police/mission review; varies by jurisdiction." },
        { stage: "Printed / dispatched", estimate: "After approval", notes: "OCI booklet/document is printed and sent." },
        { stage: "Courier delivery", estimate: "Days", notes: "Return shipping to you." },
      ],
    },
    steps: [
      "Prepare documents to the exact spec (photo, signature, scans) before submitting.",
      "Submit the online application and complete the VFS mail-in or appointment.",
      "Watch for the VFS acknowledgement that your file was received.",
      "Allow for consulate/mission processing — the main and most variable wait.",
      "Track printing/dispatch and receive the OCI by your chosen courier.",
    ],
    mistakes: [
      "Photo that doesn't meet the exact spec (size, background), which triggers a re-do.",
      "Signature issues (out of the box, wrong style) that bounce the application.",
      "Name mismatch across passport, naturalization certificate, and old Indian passport.",
      "Missing the naturalization certificate that proves when Indian citizenship ended.",
      "Applying under the wrong consulate jurisdiction for your address.",
    ],
    relatedLinks: [
      { label: "OCI cost calculator", href: "/tools/oci-cost-calculator" },
      { label: "OCI eligibility checker", href: "/tools/oci-eligibility-checker" },
      { label: "OCI resource center", href: "/oci" },
    ],
    faqs: [
      {
        question: "How long does OCI take in the USA?",
        answer:
          "It depends on your application type and consulate jurisdiction and involves several stages — submission, VFS handling, consulate processing, printing, and courier delivery. The live estimate and a last-reviewed date are shown on this page; verify current processing times before planning travel.",
      },
      {
        question: "Why is my OCI delayed?",
        answer:
          "Common causes include a photo or signature that doesn't meet spec, a name mismatch across documents, a missing naturalization certificate, applying under the wrong jurisdiction, or additional mission/police review. Any single stage can extend the total, which is why estimates are ranges.",
      },
      {
        question: "Can I travel to India while my OCI is pending?",
        answer:
          "OCI is separate from a visa. If you need to travel while your OCI is being processed, you'd generally look at the appropriate Indian visa for your trip. Because rules and your document status matter, confirm your specific situation with the consulate/VFS before booking.",
      },
      {
        question: "How do I track OCI status?",
        answer:
          "You can typically track status through the VFS/Indian government OCI portals using your application reference. This page links to the official sources; keep your reference number handy and check periodically rather than assuming a fixed date.",
      },
      {
        question: "Does OCI renewal take less time?",
        answer:
          "A reissue/renewal can differ from a fresh application in both steps and timing, but processing still varies by jurisdiction and workload. Don't assume it's always faster — check the current estimate for your application type and consulate.",
      },
      {
        question: "What causes OCI rejection or delay?",
        answer:
          "Frequent triggers are document-quality issues (photo/signature to spec), name mismatches across passport and citizenship documents, missing proof of when Indian citizenship ended, wrong jurisdiction, and eligibility/exclusion questions. Getting documents exactly right up front prevents most delays.",
      },
    ],
  },
};

export function getToolHubContent(slug: string): ToolHubContent | undefined {
  return toolHubContent[slug];
}
