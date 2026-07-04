/**
 * Rich, parent-friendly SEO content for the education hub pages
 * (/education/college-rankings, /education/gpa-calculator,
 * /education/tuition-calculator). Layers static context around each
 * interactive tool: a quick answer, who the page is for, the inputs the
 * tool needs, why it matters for immigrant/NRI families, how to read the
 * result, an explainer, an optional comparison table, a step-by-step,
 * common mistakes, a worked example, internal links, and FAQs (which also
 * drive the FAQPage JSON-LD).
 *
 * Wording stays plain-English and avoids financial, legal, or admissions
 * guarantees — figures and rankings change and vary by school, state, and
 * status.
 */

export interface EduBullet {
  label: string;
  body: string;
}

export interface EduTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface EduLink {
  label: string;
  href: string;
}

export interface EduFaq {
  question: string;
  answer: string;
}

export interface EducationContent {
  slug: string;
  /** Plain-English quick answer shown above the tool. */
  quickAnswer: string;
  /** Who this page is for. */
  audience: string;
  /** Inputs the tool needs, listed above it so families can gather them. */
  keyInputs: string[];
  /** Why it matters specifically for immigrant / NRI families. */
  whyMatters: string;
  /** How to read / use the tool's result. */
  resultMeaning: string;
  /** Explainer breakdown shown after the tool. */
  explain?: { heading: string; items: EduBullet[] };
  /** Optional comparison table. */
  table?: EduTable;
  /** Step-by-step explanation. */
  steps: string[];
  /** Common mistakes to avoid. */
  mistakes: string[];
  /** One concrete worked example. */
  example: { title: string; body: string };
  /** Curated internal links shown before the FAQ. */
  relatedLinks: EduLink[];
  /** Page-specific FAQs — also emitted as FAQPage JSON-LD. */
  faqs: EduFaq[];
}

export const educationContent: Record<string, EducationContent> = {
  /* ------------------------------------------------------------------ *
   * College rankings
   * ------------------------------------------------------------------ */
  "college-rankings": {
    slug: "college-rankings",
    quickAnswer:
      "Rankings are a useful starting point, not the whole decision. Immigrant and NRI families usually get a better outcome by weighing a school's strength in the intended major, total family affordability, location and internship access, career and visa pathway, and graduation outcomes — alongside the headline rank.",
    audience:
      "Indian and immigrant parents and students comparing US universities — especially families weighing a higher-ranked, more expensive private college against a strong, more affordable in-state public university.",
    keyInputs: [
      "The intended major or field (STEM, business, pre-med, liberal arts)",
      "Whether the student qualifies for in-state tuition in your state",
      "Your realistic annual budget across four years",
      "Preferred region or proximity to family/community",
      "How much each school's rank, cost, and outcomes matter to you",
    ],
    whyMatters:
      "For immigrant and NRI families, the sticker rank rarely tells the full story: in-state eligibility can swing cost by tens of thousands a year, program strength and local internship markets shape post-graduation options (including OPT/visa pathways), and community and student support affect how well a first-generation-in-the-US student settles in. Sorting on rank alone can hide the school that's actually the best fit and value.",
    resultMeaning:
      "Use the explorer to shortlist schools, then compare them on more than the number: match the major's strength to the student's goals, check in-state vs out-of-state cost, look at where graduates get hired, and confirm the total four-year cost fits the family budget. The best pick is usually the school that balances a strong-enough rank with affordability and a clear career path — not simply the highest-ranked one you can get into.",
    explain: {
      heading: "What to weigh besides the ranking",
      items: [
        {
          label: "National ranking vs program ranking",
          body: "A school's overall national rank can differ a lot from its rank in a specific major. For an engineering or CS student, the program ranking and department reputation often matter more than the university's overall position.",
        },
        {
          label: "Public vs private colleges",
          body: "Public universities are far cheaper for in-state students; private universities cost more up front but sometimes give more generous need-based aid. Compare the net price you'd actually pay, not the published sticker price.",
        },
        {
          label: "In-state vs out-of-state",
          body: "In-state tuition at a public flagship can be a fraction of the out-of-state rate. Whether the student qualifies for in-state status depends on your family's residency and immigration status — it's one of the biggest cost levers.",
        },
        {
          label: "STEM vs business vs pre-med vs liberal arts",
          body: "The right 'best' school depends on the field. A top public engineering school, a business program with strong recruiting, and a pre-med feeder can each be the smartest choice for a different student.",
        },
        {
          label: "Internship and job-market location",
          body: "Being near a strong regional job market (tech, finance, healthcare) improves internship access and post-graduation hiring — which matters for career start and work-visa timing.",
        },
        {
          label: "Safety and student support",
          body: "Campus safety, advising, and support for first-generation or international students affect how well a student thrives — worth checking beyond any ranking.",
        },
      ],
    },
    table: {
      caption: "How families should use each factor",
      headers: ["Factor", "Why it matters", "How your family should use it"],
      rows: [
        ["Overall ranking", "A rough signal of reputation and resources", "Use as a starting filter, not the deciding vote"],
        ["Program strength", "Drives teaching quality and recruiting in the major", "Weight this heavily if the major is set"],
        ["In-state eligibility", "Can change cost by $15k–$20k+ per year", "Check your state's residency rules early"],
        ["Total 4-year cost", "Determines debt and family strain", "Compare net price after aid, not sticker price"],
        ["Internship/job location", "Shapes career start and visa timing", "Favor schools near relevant job markets"],
        ["Graduation & outcomes", "Reflects real student success", "Check graduation rates and career outcomes"],
      ],
    },
    steps: [
      "Decide the intended major (or a short list) — it drives which rankings matter.",
      "Filter the explorer by rank, cost, and school type to build a shortlist.",
      "For each shortlisted school, check in-state vs out-of-state tuition for your status.",
      "Compare program strength and graduate outcomes in the specific major, not just overall rank.",
      "Estimate the total four-year cost and compare it against your budget.",
      "Weigh location and internship access for the student's career goals before finalizing.",
    ],
    mistakes: [
      "Choosing purely by overall national rank and ignoring the program's strength in the actual major.",
      "Comparing sticker prices instead of the net price after scholarships and aid.",
      "Overlooking in-state eligibility, which can cut cost dramatically at a public university.",
      "Ignoring location and the local internship/job market that shapes career and visa outcomes.",
      "Treating one ranking source as absolute — different rankings use different methods.",
    ],
    example: {
      title: "Higher-ranked private vs strong in-state public",
      body: "A student is admitted to a higher-ranked private university at roughly $70,000/year and to a strong in-state public flagship (top program in their major) at about $28,000/year all-in. Over four years that's a gap of well over $150,000. The family compares net price after aid, the two programs' recruiting in the student's field, and internship access near each campus. Because the in-state public has a top-ranked program in the major and strong local hiring, they choose it — keeping the option to target a higher-ranked school for graduate study later, with far less debt.",
    },
    relatedLinks: [
      { label: "GPA calculator (weighted & unweighted)", href: "/education/gpa-calculator" },
      { label: "College tuition & cost calculator", href: "/education/tuition-calculator" },
      { label: "SAT score & college fit tool", href: "/education/sat-guide" },
      { label: "Education hub", href: "/education" },
    ],
    faqs: [
      {
        question: "Are US college rankings reliable?",
        answer:
          "They're a useful signal, not a precise verdict. Different rankings (US News, QS, and others) use different methods and weightings, so a school can rank high on one and lower on another. Treat rankings as one input alongside program strength, cost, and outcomes.",
      },
      {
        question: "Should Indian students choose a college by ranking only?",
        answer:
          "No. Ranking is a starting point. The strength of the specific major, total affordability (including in-state eligibility), internship and job-market access, and graduation outcomes usually matter more to the final result than the overall rank alone.",
      },
      {
        question: "Is an in-state public college better than a private college?",
        answer:
          "It depends on the student and the budget. In-state public universities are far cheaper for eligible families and many have top-ranked programs; private colleges cost more but can offer generous need-based aid and smaller classes. Compare net price and program fit rather than assuming one is always better.",
      },
      {
        question: "What ranking matters most for STEM?",
        answer:
          "For STEM students, the program or department ranking in the specific field (such as engineering or computer science) generally matters more than the university's overall national rank, because it reflects teaching strength and employer recruiting in that area.",
      },
      {
        question: "How should immigrant parents compare colleges?",
        answer:
          "Look beyond the headline rank: check the strength of the intended major, in-state vs out-of-state cost, the net price after aid, internship and job access near campus, graduation outcomes, and student support. The goal is the best balance of fit, affordability, and career path.",
      },
      {
        question: "Should cost matter more than ranking?",
        answer:
          "Often, yes — especially when a large cost gap would mean heavy student or family debt. A slightly lower-ranked school that is affordable and strong in the student's major can be the smarter long-term choice than a higher-ranked school that strains the family's finances.",
      },
      {
        question: "Which US universities are strong for international and immigrant students?",
        answer:
          "For STEM, schools like MIT, Stanford, Carnegie Mellon, UC Berkeley, Georgia Tech, UIUC, Purdue, and UT Austin are frequently cited for strong programs and recruiting — and the public ones are much cheaper in-state. The best fit still depends on the major, budget, and whether the student qualifies for in-state tuition.",
      },
      {
        question: "Can a student transfer from community college to a top university?",
        answer:
          "Yes. Many states have guaranteed-transfer pathways (for example, California community colleges into the UC system). Two years at community college followed by two years at a four-year university can cut the cost of a bachelor's degree substantially.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * GPA calculator
   * ------------------------------------------------------------------ */
  "gpa-calculator": {
    slug: "gpa-calculator",
    quickAnswer:
      "Weighted GPA gives extra points for harder courses like Honors, AP, or IB, so it can go above 4.0; unweighted GPA puts every course on the same 4.0 scale. Colleges often recalculate GPA their own way, so students should understand both numbers rather than fixate on one.",
    audience:
      "High-school students and immigrant/NRI parents who want to understand US GPA — weighted vs unweighted — and how it fits into college admissions alongside course rigor, test scores, and activities.",
    keyInputs: [
      "Each course name and the grade earned",
      "Whether each course is regular, Honors, AP, or IB (course level)",
      "Credit hours or weight for each course, if your school uses them",
      "Whether you want the weighted or unweighted result (the tool shows both)",
    ],
    whyMatters:
      "Many immigrant and NRI parents are used to a percentage or CGPA system, so the US weighted/unweighted 4.0 scale can be confusing. Knowing how GPA is built — and that colleges frequently recalculate it — helps families set realistic targets, value course rigor correctly, and avoid over- or under-estimating where a student stands.",
    resultMeaning:
      "The tool shows both your weighted and unweighted GPA on the US scale. Use the unweighted number to see raw performance and the weighted number to reflect course difficulty. Remember most colleges recalculate GPA from your transcript their own way, so treat these as strong estimates — and read them together with course rigor, test scores, and activities rather than as a single deciding number.",
    explain: {
      heading: "How US GPA actually works",
      items: [
        {
          label: "Weighted vs unweighted GPA",
          body: "Unweighted GPA caps every A at 4.0 regardless of difficulty. Weighted GPA adds a bonus for harder courses (commonly +1.0 for AP/IB and +0.5 for Honors), so weighted GPAs can exceed 4.0.",
        },
        {
          label: "Honors / AP / IB impact",
          body: "Taking and doing well in rigorous courses raises a weighted GPA and, just as importantly, signals to colleges that the student challenged themselves — which admissions officers value.",
        },
        {
          label: "Semester grades vs final grades",
          body: "Schools differ on whether they count semester grades, final grades, or both. Check how your school reports grades so your GPA estimate matches your official transcript.",
        },
        {
          label: "Class rank",
          body: "Some schools report class rank alongside GPA. Where they do, colleges read rank as context for how strong the GPA is relative to peers.",
        },
        {
          label: "Why colleges recalculate GPA",
          body: "To compare applicants fairly across thousands of different high schools, many colleges strip out non-academic courses and apply their own weighting — so your school's GPA and a college's recalculated GPA can differ.",
        },
        {
          label: "GPA vs test scores vs activities",
          body: "GPA is central but not the whole application. Test scores, course rigor, essays, and extracurricular activities all factor in — a single GPA number rarely decides admission on its own.",
        },
      ],
    },
    steps: [
      "List every course and the grade you earned for the term.",
      "Mark each course's level (regular, Honors, AP, or IB) so weighting applies correctly.",
      "Enter credit hours or weights if your school uses them.",
      "Read the unweighted GPA to see raw performance on the 4.0 scale.",
      "Read the weighted GPA to see performance adjusted for course difficulty.",
      "Compare both against your target schools' typical ranges — and remember colleges may recalculate.",
    ],
    mistakes: [
      "Counting middle-school grades — US high-school GPA generally starts in 9th grade.",
      "Mixing weighted and unweighted scales in the same calculation, which produces a meaningless number.",
      "Ignoring course rigor — a slightly lower GPA in demanding courses can be viewed more favorably than a perfect GPA in easy ones.",
      "Assuming one GPA number decides admission, when test scores, rigor, essays, and activities all count.",
      "Forgetting that colleges often recalculate GPA, so your school's number isn't the final word.",
    ],
    example: {
      title: "A student mixing AP, Honors, and regular classes",
      body: "A junior takes AP Calculus (A), AP Chemistry (B+), Honors English (A), and two regular classes (A and B). On the unweighted scale their GPA lands in the high-3.x range. With weighting (+1.0 for the AP courses, +0.5 for Honors), the weighted GPA rises above 4.0. Both numbers are true: the unweighted shows solid performance, and the weighted shows the student took a demanding schedule — exactly the combination selective colleges look for.",
    },
    relatedLinks: [
      { label: "College rankings explorer", href: "/education/college-rankings" },
      { label: "College tuition & cost calculator", href: "/education/tuition-calculator" },
      { label: "SAT score & college fit tool", href: "/education/sat-guide" },
    ],
    faqs: [
      {
        question: "What is the difference between weighted and unweighted GPA?",
        answer:
          "Unweighted GPA puts every course on the same 4.0 scale — an A is 4.0 whether it's a regular class or AP Calculus. Weighted GPA adds a bonus for harder courses (typically +1.0 for AP/IB and +0.5 for Honors), so weighted GPAs can exceed 4.0. Colleges look at both and often recalculate their own way.",
      },
      {
        question: "Is a 4.0 weighted GPA good?",
        answer:
          "A 4.0 unweighted GPA is excellent (straight A's). On a weighted scale, students taking many Honors/AP courses can exceed 4.0, so a 4.0 weighted GPA is good but may be around average at competitive schools where weighted GPAs run higher. Always compare against the weighting scale your school uses.",
      },
      {
        question: "Do colleges use weighted GPA?",
        answer:
          "Colleges look at weighted GPA to see course rigor, but many recalculate GPA from your transcript using their own method — often focusing on core academic courses. So both your weighted and unweighted numbers matter, and neither is necessarily the exact figure a college will use.",
      },
      {
        question: "How do AP classes affect GPA?",
        answer:
          "AP (and IB) classes usually add about +1.0 to the grade points for that course on a weighted scale, so an A in an AP class can count as 5.0 instead of 4.0. Beyond the number, taking AP courses signals that the student challenged themselves, which admissions officers value.",
      },
      {
        question: "Can I improve my GPA junior year?",
        answer:
          "Yes. Junior-year grades carry weight because they're recent and often the last full year colleges see before applications. Strong junior-year performance — especially in rigorous courses — can meaningfully raise a cumulative GPA and show an upward trend.",
      },
      {
        question: "What GPA do colleges look at?",
        answer:
          "Most colleges look at your cumulative high-school GPA, frequently recalculated to focus on core academic courses, alongside course rigor and grade trends. Highly selective schools often see median GPAs near 3.9–4.0 unweighted; strong state flagships and top-50 schools cluster a bit lower.",
      },
      {
        question: "How is an Indian or foreign GPA converted for US colleges?",
        answer:
          "US colleges usually require a credential evaluation from a service like WES (World Education Services) or another NACES-member agency, which converts percentage marks or CGPA into a US 4.0-scale equivalent. The official evaluation is what counts — don't rely on a rough self-conversion for applications.",
      },
      {
        question: "How do US letter grades convert to GPA points?",
        answer:
          "On the standard 4.0 scale: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, down to F = 0.0. Your GPA is the credit-hour-weighted average of these points across your courses.",
      },
    ],
  },

  /* ------------------------------------------------------------------ *
   * Tuition calculator
   * ------------------------------------------------------------------ */
  "tuition-calculator": {
    slug: "tuition-calculator",
    quickAnswer:
      "In-state tuition at a public university can be far cheaper than out-of-state or private college, but the real number is the total cost of attendance — tuition plus housing, food, health insurance, books, transportation, and any scholarships you'd give up. Always compare full four-year cost, not just the tuition line.",
    audience:
      "Immigrant and NRI parents and students planning for US college costs — comparing in-state public, out-of-state public, and private options, and figuring out how much to save.",
    keyInputs: [
      "School type (public in-state, public out-of-state, private, or community college)",
      "Whether the student qualifies for in-state tuition",
      "Expected room and board / living situation (on-campus vs commuter)",
      "Any merit or need-based aid or scholarships you expect",
      "Number of years and an inflation assumption for multi-year projection",
    ],
    whyMatters:
      "Immigration and residency status directly affect what a family pays: green-card holders can qualify for in-state tuition and federal aid, while students on some temporary visas pay out-of-state or international rates and can't get federal aid. Missing these rules — or budgeting only for tuition — can leave families off by tens of thousands of dollars a year.",
    resultMeaning:
      "The projection shows the full multi-year cost by school type, including living costs and inflation — not just tuition. Use it to compare options on total cost of attendance and to see how much in-state eligibility or scholarships change the number. It reflects published-price averages, so always run each school's own Net Price Calculator to see what your family would actually pay after aid.",
    explain: {
      heading: "What really drives college cost",
      items: [
        {
          label: "Tuition vs total cost of attendance",
          body: "Tuition is only part of it. Total cost of attendance adds room and board, health insurance, books, fees, and transportation — often another $15,000–$20,000 a year.",
        },
        {
          label: "In-state rules",
          body: "Public universities charge much less for state residents. Whether a student qualifies depends on your residency period and immigration status — a key factor to confirm early.",
        },
        {
          label: "Out-of-state premium",
          body: "Non-residents at public universities can pay two to three times the in-state rate, sometimes approaching private-school prices.",
        },
        {
          label: "Private college discounting",
          body: "Private colleges have high sticker prices but frequently discount heavily through merit and need-based aid, so the net price can be far lower than published.",
        },
        {
          label: "Merit aid",
          body: "Many public and private schools offer automatic or competitive merit scholarships based on GPA and test scores, which can significantly cut cost.",
        },
        {
          label: "FAFSA / CSS Profile basics",
          body: "The FAFSA (and, at some schools, the CSS Profile) determines federal and institutional aid eligibility. Green-card holders and certain others can file the FAFSA; students on temporary visas generally cannot get federal aid but should still pursue institutional and private scholarships.",
        },
        {
          label: "Immigrant family planning",
          body: "Tools like a 529 plan (open to anyone with an SSN or ITIN) let families save with tax advantages — one of the most effective ways to prepare for college cost.",
        },
      ],
    },
    table: {
      caption: "College cost items families often forget",
      headers: ["Cost item", "What it includes", "Often forgotten?"],
      rows: [
        ["Tuition & fees", "Instruction, mandatory school fees", "No — but out-of-state premium is"],
        ["Room & board", "Housing and meal plans", "Sometimes underestimated"],
        ["Health insurance", "Required student health coverage", "Frequently"],
        ["Books & supplies", "Textbooks, lab kits, a laptop", "Often"],
        ["Transportation", "Flights home, local travel", "Often (especially for NRI families)"],
        ["Personal expenses", "Phone, clothing, day-to-day costs", "Usually"],
        ["Lost scholarships", "Aid you'd give up at a pricier school", "Almost always"],
      ],
    },
    steps: [
      "Choose the school type and whether the student qualifies for in-state tuition.",
      "Add realistic living costs (on-campus room and board, or commuter costs).",
      "Enter any merit or need-based aid you reasonably expect.",
      "Project across four years with an inflation assumption to see the full cost.",
      "Compare the total cost of attendance across your in-state, out-of-state, and private options.",
      "Run each finalist school's own Net Price Calculator to confirm your real net price.",
    ],
    mistakes: [
      "Budgeting for tuition only and forgetting room, board, insurance, books, and travel.",
      "Assuming a private college is unaffordable before checking its net price after aid.",
      "Overlooking in-state eligibility, which can save $15,000–$20,000 a year.",
      "Ignoring that some visa statuses can't get federal aid, which changes the plan.",
      "Taking on heavy loans for a small increase in prestige without weighing the debt.",
    ],
    example: {
      title: "In-state public vs out-of-state public vs private",
      body: "A family compares three admits: an in-state public at about $28,000/year all-in, the same-tier public as an out-of-state student at roughly $50,000/year, and a private university at a $70,000 sticker that drops to about $45,000/year after merit aid. Over four years the in-state public is well over $80,000 cheaper than the others. Unless the pricier schools offer a clearly stronger program or aid package, the family leans in-state — choosing higher cost only if it comes with a meaningfully better fit or outcome, and keeping loans modest.",
    },
    relatedLinks: [
      { label: "College rankings explorer", href: "/education/college-rankings" },
      { label: "GPA calculator (weighted & unweighted)", href: "/education/gpa-calculator" },
      { label: "SAT score & college fit tool", href: "/education/sat-guide" },
    ],
    faqs: [
      {
        question: "What is included in a college's cost of attendance?",
        answer:
          "Cost of attendance is more than tuition. It includes tuition and fees, room and board, books and supplies, health insurance, transportation, and personal expenses. These extras often add $15,000–$20,000 a year on top of tuition, so budget for the full figure.",
      },
      {
        question: "Is in-state tuition always cheaper?",
        answer:
          "For eligible residents at public universities, in-state tuition is almost always much cheaper than out-of-state or private rates. The catch is eligibility — you generally must meet your state's residency requirements, and immigration status can affect whether a student qualifies.",
      },
      {
        question: "Can immigrants qualify for in-state tuition?",
        answer:
          "Often, yes. Green-card holders typically qualify for in-state tuition after meeting the state's residency period, just like citizens. Rules for students on temporary visas vary by state — some states allow in-state status after residency requirements, while others charge out-of-state or international rates.",
      },
      {
        question: "Is a private college always more expensive?",
        answer:
          "Not necessarily. Private colleges have high sticker prices but frequently give substantial merit and need-based aid, so the net price a family pays can be far lower — sometimes competitive with an out-of-state public. Always compare net price after aid, not the published cost.",
      },
      {
        question: "How much should parents save for college?",
        answer:
          "It depends on the target schools and expected aid, which is why the calculator projects a range by school type. Many families aim to cover a meaningful share through savings (for example, a 529 plan) and close the rest with scholarships and modest loans. There's no single right number — plan against your realistic options.",
      },
      {
        question: "How do scholarships affect college cost?",
        answer:
          "Scholarships and grants reduce the net price directly and, unlike loans, don't have to be repaid. Merit scholarships (based on GPA and test scores) and need-based aid can turn a high-sticker school into an affordable one, so pursue institutional, state, and private scholarships alongside the FAFSA where eligible.",
      },
      {
        question: "Who can file the FAFSA?",
        answer:
          "US citizens and eligible non-citizens — including green-card holders, refugees, and asylees — can file the FAFSA for federal grants and loans at studentaid.gov. Students on temporary visas such as F-1 or H-4 generally can't receive federal aid but should still pursue institutional, state, and private scholarships.",
      },
      {
        question: "Can immigrant families use a 529 college savings plan?",
        answer:
          "Yes. Anyone with a Social Security number or ITIN can open a 529 plan regardless of visa status. Earnings grow tax-free and withdrawals for qualified education expenses are federal-tax-free, and many states add a tax deduction — making it one of the most effective college-saving tools for immigrant families.",
      },
    ],
  },
};

export function getEducationContent(slug: string): EducationContent | undefined {
  return educationContent[slug];
}
