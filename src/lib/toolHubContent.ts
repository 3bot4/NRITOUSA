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

export interface ToolHubContent {
  slug: string;
  /** SoftwareApplication category. */
  appCategory: "BusinessApplication" | "ReferenceApplication";
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
      "H-4 EAD (category c(26)) processing commonly takes several months to over a year, and a DHS rule effective October 30, 2025 removed the automatic extension for renewals filed on or after that date. File as early as possible within the renewal window and verify current processing times before relying on any date.",
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
          "As of 2026 it commonly takes several months to over a year, and processing times fluctuate. Because a DHS rule removed the automatic extension for renewals filed on or after October 30, 2025, a long processing time can now mean a work gap — so file as early as the window allows.",
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
};

export function getToolHubContent(slug: string): ToolHubContent | undefined {
  return toolHubContent[slug];
}
