/**
 * NRI Success Stories — content model + registry.
 *
 * Single source of truth for the /success-stories hub, individual story pages,
 * and the contributor entities behind them. It doubles as the reusable "story
 * production system": every future profile is a new `SuccessStory` + matching
 * `Contributor`, so the hub, cards, schema, sitemap, and OG image update from
 * data with no component changes.
 *
 * REQUIRED READING before adding a story: docs/success-stories/README-editorial.md
 * and the project rule in src/app/success-stories/CLAUDE.md. Every story MUST
 * follow the approved editorial + SEO framework. `assertPublishableStory` (run
 * from getPublishedStories) throws at build if a required field is missing, so
 * an incomplete or ad-hoc story can never ship.
 *
 * EDITORIAL RULES (enforced by structure, not just convention):
 *  - Only `publicationStatus: "published"` stories are routed, indexed,
 *    sitemapped, or shown in the hub ItemList. Drafts/stubs are held back.
 *  - Every factual claim in a published story must trace to an approved source.
 *    Do NOT add biographical facts a source doesn't support.
 *  - One persistent Person @id per subject (personId), reused everywhere.
 *  - Author attribution follows the story TYPE (see STORY_TYPE_META) — the
 *    featured person is NOT automatically the author.
 *  - No headshot is invented. `approvedPhoto: null` → initials monogram. Never
 *    synthesize a face, never hotlink LinkedIn images.
 *  - Only render sections that carry real, approved content.
 */
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

/** How a person relates to NRItoUSA. A person can hold several roles. */
export type ProfileType =
  | "author"
  | "interviewee"
  | "contributor"
  | "reviewer"
  | "editor"
  | "featured-guest";

/**
 * Every story carries exactly one visible classification. This drives the badge
 * shown on the page AND the schema author/subject attribution (STORY_TYPE_META).
 */
export type StoryType =
  | "interview" // a genuinely conducted interview
  | "first-person" // the contributor wrote it themselves
  | "editorial-profile" // Editorial Team profiles a subject
  | "founder-journey" // profile of the NRItoUSA founder
  | "expert-commentary" // a named expert's commentary
  | "career-case-study"; // Editorial Team career case study

export interface StoryTypeMeta {
  label: string;
  /** True when the featured person is the actual author (first-person work). */
  authorIsSubject: boolean;
  /** Whether interview metadata (date/interviewer) is meaningful for this type. */
  usesInterviewMeta: boolean;
}

export const STORY_TYPE_META: Record<StoryType, StoryTypeMeta> = {
  interview: { label: "Interview", authorIsSubject: false, usesInterviewMeta: true },
  "first-person": { label: "First-Person Contribution", authorIsSubject: true, usesInterviewMeta: false },
  "editorial-profile": { label: "Editorial Profile", authorIsSubject: false, usesInterviewMeta: false },
  "founder-journey": { label: "Founder Journey", authorIsSubject: false, usesInterviewMeta: false },
  "expert-commentary": { label: "Expert Commentary", authorIsSubject: true, usesInterviewMeta: false },
  "career-case-study": { label: "Career Case Study", authorIsSubject: false, usesInterviewMeta: false },
};

/** Where a subject is in the editorial pipeline. Gates publication. */
export type ConsentStatus =
  | "self-published-source"
  | "approved"
  | "awaiting-source-package"
  | "awaiting-subject-review";

export type PublicationStatus = "published" | "draft";

export interface Contributor {
  slug: string;
  fullName: string;
  profileType: ProfileType[];
  currentTitle: string;
  currentOrganization: string;
  approvedBio: string;
  /** Path to an approved headshot in /public, or null → initials monogram. */
  approvedPhoto: string | null;
  photoAlt: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  areasOfExperience: string[];
  immigrationRouteSummary?: string;
  countriesLivedIn: string[];
  /** Canonical profile URL on this site (e.g. /about-deepak). */
  authorPageUrl: string;
  storyUrls: string[];
  /** Editorial record — not rendered publicly. */
  consentStatus: ConsentStatus;
  profileVerifiedDate: string; // ISO
  featured: boolean;
}

export interface TimelineMilestone {
  when: string;
  title: string;
  detail: string;
}

export interface InterviewExchange {
  question: string;
  /** Paragraphs. May contain [label](/href) inline links. */
  answer: string[];
  /** Optional verbatim pull-quote the subject owns/approved. */
  quote?: string;
}

export interface StoryInternalLink {
  href: string;
  label: string;
  context: string;
}

/** Byline roles for a story — who actually did what. */
export interface StoryByline {
  /** The featured subject. */
  subject: string;
  writtenBy: string;
  editedBy: string;
  reviewedBy: string;
  /** Human review status line, e.g. "Reviewed by the subject for factual accuracy". */
  reviewStatus: string;
}

/** Optional interview metadata — only for genuine interviews. */
export interface InterviewMeta {
  interviewDate?: string; // ISO
  format?: string; // e.g. "Video call", "Written responses"
  interviewer?: string;
}

/** Compact, glanceable journey summary (approved, visible facts only). */
export interface JourneyGlance {
  origin: string;
  destination: string;
  professionalFoundation: string;
  primaryFields: string;
  majorChallenges: string;
  keyTurningPoints: string;
  currentContribution: string;
}

export interface SourceEntry {
  label: string;
  detail?: string;
  href?: string;
}

export type StoryCategory =
  | "Finance"
  | "Technology"
  | "Medicine"
  | "Entrepreneurship"
  | "Consulting"
  | "Leadership"
  | "Education"
  | "Career Transitions"
  | "Return to India";

export interface SuccessStory {
  slug: string;
  subjectSlug: string;
  /** Visible classification. Drives the badge + schema attribution. */
  storyType: StoryType;
  /** On-page H1 — descriptive, explains the value of the story. */
  title: string;
  /** SEO <title> — unique, targets a distinct human search topic. */
  seoTitle: string;
  metaDescription: string;
  /** Short editorial summary under the H1. */
  subtitle: string;
  category: StoryCategory;
  countries: string[];
  /** Optional profile facts — rendered only when present. */
  education?: string;
  yearsOfExperience?: string;
  expertise?: string[];
  publicationDate: string; // ISO
  modifiedDate: string; // ISO
  verificationDate: string; // ISO
  readingTime: number; // minutes
  byline: StoryByline;
  interviewMeta?: InterviewMeta;
  /** Editorial note explaining how the piece was produced (methodology). */
  editorialNote: string;
  /** Transparency disclosure (founder relationship, sourcing). */
  disclosure: string;
  teaser: string;
  pullQuote: string;
  journeyAtAGlance: JourneyGlance;
  /** Thematic lessons shown near the top. */
  keyLessons: string[];
  openingScene: string[];
  timeline: TimelineMilestone[];
  /** Q&A body. Framed per storyType (adapted-from-writing vs live interview). */
  interview: InterviewExchange[];
  /** One-line framing separating personal experience / principle / advice. */
  financialFraming?: string;
  /** Actionable, educational takeaways + a disclaimer. */
  takeaways: { items: string[]; disclaimer: string };
  /** Visible sources + verification method. */
  sources: SourceEntry[];
  internalLinks: StoryInternalLink[];
  relatedStories: string[];
  publicationStatus: PublicationStatus;
}

/* ------------------------------------------------------------------ *
 * Person entity IDs (one persistent @id per subject, reused everywhere)
 * ------------------------------------------------------------------ */

export const DEEPAK_PERSON_ID = `${site.url}/about-deepak#person`;

export function personId(c: Contributor): string {
  if (c.slug === "deepak-middha") return DEEPAK_PERSON_ID;
  return `${site.url}${c.authorPageUrl}#person`;
}

/* ------------------------------------------------------------------ *
 * Author / subject attribution (Part 10 logic, single source of truth)
 * ------------------------------------------------------------------ */

export interface StoryAttribution {
  classificationLabel: string;
  /** True → schema author is the subject Person; false → Editorial Org. */
  authorIsSubject: boolean;
  authorName: string;
  subjectName: string;
  reviewerName: string;
  usesInterviewMeta: boolean;
}

export function resolveAttribution(
  story: SuccessStory,
  contributor: Contributor,
): StoryAttribution {
  const meta = STORY_TYPE_META[story.storyType];
  return {
    classificationLabel: meta.label,
    authorIsSubject: meta.authorIsSubject,
    authorName: meta.authorIsSubject ? contributor.fullName : story.byline.writtenBy,
    subjectName: contributor.fullName,
    reviewerName: story.byline.reviewedBy,
    usesInterviewMeta: meta.usesInterviewMeta,
  };
}

/* ------------------------------------------------------------------ *
 * Contributors
 * ------------------------------------------------------------------ */

const deepak: Contributor = {
  slug: "deepak-middha",
  fullName: "Deepak Middha",
  profileType: ["author", "reviewer", "editor", "interviewee"],
  currentTitle: "Founder, Author & Editorial Reviewer",
  currentOrganization: site.name,
  approvedBio:
    "Deepak Middha is the founder of NRI to USA and Wealth Building Academy LLC. A Chartered Accountant with more than 17 years in the hedge fund and alternative-investment industry, and a Series 65 holder, he immigrated from India and rebuilt his financial life in the U.S. He is a two-time published financial author and the founder of OptionLeo.",
  approvedPhoto: null, // No approved headshot on file → initials monogram.
  photoAlt: "Deepak Middha, founder of NRI to USA",
  linkedinUrl: "https://www.linkedin.com/in/deepak-middha-2bb06638/",
  personalWebsite: "https://optionleo.com",
  areasOfExperience: [
    "Immigrant finance",
    "Investing & passive income",
    "Real estate",
    "Retirement accounts",
    "Cross-border (India–US) money",
    "Accounting & tax basics",
  ],
  immigrationRouteSummary: "Immigrated from India as a working professional and later built a life in the U.S.",
  countriesLivedIn: ["India", "United States"],
  authorPageUrl: "/about-deepak",
  storyUrls: ["/success-stories/deepak-middha"],
  consentStatus: "self-published-source",
  profileVerifiedDate: "2026-07-13",
  featured: true,
};

export const contributors: Contributor[] = [deepak];

/**
 * Invited future subjects — NOT `Contributor`s, NOT rendered anywhere public.
 * They only seed the pipeline. Move into `contributors` + add a published
 * `SuccessStory` only after a full, approved source package.
 */
export const pipelineSubjects: {
  fullName: string;
  proposedSlug: string;
  status: ConsentStatus;
}[] = [
  { fullName: "Babu Rao Eladasari", proposedSlug: "babu-rao-eladasari", status: "awaiting-source-package" },
  { fullName: "Ashish Ranjan", proposedSlug: "ashish-ranjan", status: "awaiting-source-package" },
  { fullName: "Vipin Bhatia", proposedSlug: "vipin-bhatia", status: "awaiting-source-package" },
  { fullName: "Sudhir Malhotra", proposedSlug: "sudhir-malhotra", status: "awaiting-source-package" },
  { fullName: "Manoj Tiwari", proposedSlug: "manoj-tiwari", status: "awaiting-source-package" },
  { fullName: "Vishal Srivastava", proposedSlug: "vishal-srivastava", status: "awaiting-source-package" },
  { fullName: "Rohit Tandon", proposedSlug: "rohit-tandon", status: "awaiting-source-package" },
];

/** Themes we're actively building toward (Coming Next on the hub). No names. */
export const upcomingThemes = [
  "Technology & engineering leadership",
  "Physicians and the medical path",
  "Immigrant founders & small business",
  "Finance and risk careers",
  "Career transitions & second acts",
  "Return-to-India journeys",
];

/* ------------------------------------------------------------------ *
 * Stories
 * ------------------------------------------------------------------ *
 * Deepak founder journey. Every claim traces to Deepak's own published book
 * "Why Immigrants Failed to Build Wealth" (the free Immigrant Wealth Guide PDF)
 * and his approved author bio — see the source-to-claim map in
 * docs/success-stories/README-editorial.md. Quotations are his own words.
 * Financial language is framed to separate personal experience, general
 * principle, and decisions that require individual evaluation.
 */
const deepakStory: SuccessStory = {
  slug: "deepak-middha",
  subjectSlug: "deepak-middha",
  storyType: "founder-journey",
  title:
    "From India to America: a Chartered Accountant's wealth-building journey",
  seoTitle: "Deepak Middha: An Immigrant CA's Wealth-Building Journey",
  metaDescription:
    "How NRI to USA's founder arrived from India with loans to clear, taught himself investing after work, and turned those lessons into a mission for immigrants.",
  subtitle:
    "A founder-journey profile of Deepak Middha — arriving from India with debt to clear, learning the U.S. financial system the hard way, and turning those lessons into NRI to USA.",
  category: "Finance",
  countries: ["India", "United States"],
  education: "Chartered Accountant (CA); Series 65 (Uniform Investment Adviser Law Exam)",
  yearsOfExperience: "17+ years in hedge fund & alternative-investment finance",
  expertise: [
    "Immigrant personal finance",
    "Investing & passive income",
    "Real estate",
    "Retirement accounts",
    "Cross-border India–US money",
  ],
  publicationDate: "2026-07-13",
  modifiedDate: "2026-07-13",
  verificationDate: "2026-07-13",
  readingTime: 12,
  byline: {
    subject: "Deepak Middha",
    writtenBy: "NRItoUSA Editorial Team",
    editedBy: "NRItoUSA Editorial Team",
    reviewedBy: "Deepak Middha",
    reviewStatus: "Reviewed by Deepak Middha for factual accuracy",
  },
  editorialNote:
    "Questions were developed by the NRItoUSA Editorial Team. Responses were adapted and condensed from Deepak Middha's published book and approved biography, then reviewed by Deepak for factual accuracy. This is not a transcript of a newly recorded interview.",
  disclosure:
    "Deepak Middha is the founder and an author/reviewer at NRI to USA — this is a founder-journey profile, not an independent third-party review. It was written and edited by the NRItoUSA Editorial Team, drawing on Deepak's published book “Why Immigrants Failed to Build Wealth” and his author biography. All quotations are his own words from that published work.",
  teaser:
    "A Chartered Accountant who landed with education and marriage loans and taught himself the U.S. financial system after work — then built NRI to USA so other immigrants wouldn't have to learn it all the hard way.",
  pullQuote:
    "You crossed an ocean and started over. That same courage — pointed at your finances, applied consistently, and given time — is more than enough to build real wealth.",
  journeyAtAGlance: {
    origin: "India",
    destination: "United States",
    professionalFoundation: "Chartered Accountant",
    primaryFields: "Finance, investing, real estate, and financial education",
    majorChallenges:
      "Education and marriage debt, limited mentorship, and immigration uncertainty",
    keyTurningPoints:
      "Early India investments, his first U.S. property, self-directed market education, two published books, and founding NRI to USA",
    currentContribution: "Founder and editorial reviewer at NRI to USA",
  },
  keyLessons: [
    "Immigration uncertainty doesn't have to freeze every financial decision — foundational steps like an emergency fund and an employer retirement match fit many situations, subject to your own status and needs.",
    "Saving from a paycheck is the foundation, but building long-term wealth usually means moving some of those savings into productive assets over time rather than leaving most of it in cash.",
    "Financial education is a habit built in the margins — an hour a day, often after work — not an inborn talent.",
    "Borrowing to acquire an income-producing asset is still a liability; whether that leverage helps depends on cash flow, financing costs, liquidity, and risk.",
    "An employer retirement match can be valuable, but review the matching formula and the vesting schedule before counting on it.",
  ],
  openingScene: [
    "For six years, the most demanding hours of Deepak Middha's day started after everyone else had gone to sleep. A Chartered Accountant by training, he would come home from a full day inside institutional finance, eat dinner, and open his laptop to the Indian market — which, twelve hours ahead, opened at 9 p.m. his time. Later he added the German and French exchanges: sleep from 10 p.m. to 2 a.m., trade the European open until 5 a.m., then back up for the office by 8.",
    "“For six years I traded until 2 a.m. after a full day's work,” he writes, “because the education I wanted wasn't going to teach itself.” He had no investing mentor. Friends told him to sit it out. That persistence — treating every trade as tuition — is the throughline of his immigrant story, and it's why the reflections below are framed as lessons learned, not a formula that guarantees the same result for anyone else.",
  ],
  timeline: [
    {
      when: "Growing up in India",
      title: "A middle-class start",
      detail:
        "Born in India in 1984. Money was tight, but as he puts it, he “never learned the word 'struggle'” — treating every setback as a lesson. Relatives helped fund his accounting education, a debt of gratitude he still carries.",
    },
    {
      when: "Qualification",
      title: "Chartered Accountant",
      detail:
        "Trained and qualified as a Chartered Accountant — the foundation of a “numbers first” way of thinking that shaped everything that followed.",
    },
    {
      when: "Arrival in the U.S.",
      title: "Landing with debt to clear",
      detail:
        "Immigrated to America married, with his wife and children — and carrying education loans plus a marriage loan. First mission: clear the debt while supporting a younger brother's tuition and family back home.",
    },
    {
      when: "2009–10",
      title: "First real-estate moves (in India)",
      detail:
        "Before holding a green card, he made his first property investments back in India during the downturn, buying at low recession-era prices that later appreciated. He describes these as his own early experience, not a template for others.",
    },
    {
      when: "2012",
      title: "First U.S. property — a foreclosure",
      detail:
        "About a year and a half into renting, he bought a foreclosed home at a low price, lived in it, and later sold it for a profit that became seed capital for what followed.",
    },
    {
      when: "2013–2015",
      title: "Trading nights, buying property",
      detail:
        "Bought several more properties (many still held today) and taught himself to trade across the Indian and European markets late into the night — running for years on five or six hours of sleep.",
    },
    {
      when: "Along the way",
      title: "OptionLeo & two books",
      detail:
        "Founded OptionLeo and became a two-time published financial author, teaching options income as a systematic, numbers-driven discipline rather than a lottery ticket.",
    },
    {
      when: "Now",
      title: "Founder of NRI to USA",
      detail:
        "Built NRI to USA (under Wealth Building Academy LLC) to turn the answers he learned the hard way into simple guides, tools, and checklists for immigrant families.",
    },
  ],
  financialFraming:
    "The reflections below mix Deepak's personal experience, general principles, and decisions that require individual evaluation. Quotations are his own words; nothing here is individualized financial, tax, or investment advice, and personal outcomes are not a promise of future results.",
  interview: [
    {
      question: "You write that immigrants often arrive with a specific mindset about money. What did you notice?",
      answer: [
        "In the early years, his friends and neighbors were good people from solid middle-class families, earning decent salaries at real companies. But the financial strategy Deepak saw around him was almost entirely subtraction: clip the coupon, find the secondhand furniture, buy the cheaper groceries, send a little home, repeat.",
        "He has nothing against frugality. His broader point, framed as a general principle rather than advice for any one person: saving from a paycheck is the foundation, but over the long run wealth usually comes from moving some of those savings into productive assets — a diversified mix suited to your own goals and risk tolerance — rather than leaving most of it sitting in cash. For the basics of getting started, see our [index funds for beginners](/articles/index-funds-for-beginners-nri) guide.",
      ],
      quote: "Spread your wings. Never clip them. The biggest risk in life is taking none at all.",
    },
    {
      question: "How should a new immigrant think about investing while their immigration status is still uncertain?",
      answer: [
        "This is the question he feels most strongly about — and where his personal conviction needs the most careful framing. In his book he argues that many immigrants put their entire financial life on hold waiting for a green card, sometimes for a decade, while cash sits idle.",
        "The balanced principle: immigration uncertainty shouldn't automatically place all long-term planning on hold. Many immigrants can still build [emergency savings](/articles/emergency-fund-first-year-usa), capture an [employer retirement match](/articles/401k-match-explained-nri), and use diversified investments appropriate to their immigration status, liquidity needs, time horizon, and risk tolerance. What's right varies by person — and some choices genuinely depend on your visa situation, so this is an area to evaluate individually and, where useful, with a professional. For the immigration side, our [immigration hub](/immigration) is a starting point.",
      ],
    },
    {
      question: "How did you actually learn to invest, with no mentor and a full-time job?",
      answer: [
        "The hard way, and on very little sleep. As a Chartered Accountant, his instinct was to learn the markets directly. He bought a few stocks and taught himself how trading worked — first the Indian market at 9 p.m. Chicago time, later the German and French exchanges before dawn.",
        "For roughly six years he traded until 2 a.m. after a full day at the office. He frames this as tuition, not glamour: “losing some and winning some, all of it tuition.” The transferable lesson isn't the late nights — it's that financial literacy is a habit you can build in the margins.",
      ],
      quote: "For six years I traded until 2 a.m. after a full day's work — because the education I wanted wasn't going to teach itself.",
    },
    {
      question: "Your first property wasn't in the U.S. Walk us through those early real-estate moves.",
      answer: [
        "Because he'd just arrived and didn't yet hold a green card, his first real-estate moves were back in India in 2009–10, when a downturn had knocked prices down. He bought at low recession-era prices that later appreciated — his own experience, he's careful to note, not a template that will repeat for anyone else.",
        "His first American property came in 2012: a foreclosure bought at a low price, lived in for a few years, then sold for a profit that seeded what followed. If you're weighing your own first purchase, our guide on [buying a first home on a visa](/articles/buying-first-home-on-visa) covers the practical questions.",
      ],
      quote: "Recessions scare most people. To me they looked like clearance sales.",
    },
    {
      question: "You talk about leverage and “good” versus “bad” debt. How should a new immigrant think about it?",
      answer: [
        "He's clear that this is where enthusiasm needs guardrails. Borrowing used to acquire an income-producing asset remains a liability — but the acquired asset may produce income or appreciate. Whether that leverage is beneficial depends on cash flow, financing costs, liquidity, market conditions, and risk, and it increases both potential return and potential loss.",
        "His own path — one property helping finance the next — is a personal example, not a promise. He's equally clear about the cautions: leverage requires a strong credit profile, stable income, and a clear-eyed read of the market before you use it. This is a decision to evaluate for your own situation.",
      ],
    },
    {
      question: "Where do you see immigrants most often get stuck financially?",
      answer: [
        "Two decades of watching the pattern, he says, points to the same place: leaning heavily on savings accounts and CDs out of a craving for safety, and delaying investment and retirement accounts for the first several years in the country. He's clear it isn't about age or income — he's seen this across the board.",
        "His read is that the root cause is usually mindset and inherited caution about the markets, not a lack of money. The constructive version of that observation: build the habit of learning, and revisit whether more of your long-term savings could be working in diversified investments suited to your situation.",
      ],
    },
    {
      question: "What's one thing you wish more immigrants understood about employer benefits?",
      answer: [
        "The employer retirement match. Where a company matches contributions, that match can be meaningful — effectively adding to what you set aside — and the earlier it's invested, the more time it has to compound. He calls it one of the closest things to free money most employees have access to.",
        "The important caveat, which he stresses: review both the matching formula and the vesting schedule, because some employer contributions may be forfeited if you leave before becoming fully vested. Our [401(k) match explained](/articles/401k-match-explained-nri) guide walks through how it works.",
      ],
    },
    {
      question: "You keep money between two countries. How do you think about home-country investments?",
      answer: [
        "With eyes open to currency risk. He walks through an example in the book: a property in India that gains in rupee terms can deliver far less in dollar terms once the rupee weakens against the dollar. He doesn't tell people to avoid home-country investments — he tells them to weigh the exchange-rate drift, and the tax and reporting side, before committing.",
        "For readers navigating exactly that, our [long-term NRI wealth](/long-term-nri-wealth) hub and [India tax & compliance](/india-tax-compliance) hub go deeper on cross-border money.",
      ],
    },
    {
      question: "Why build NRI to USA at all — you already had books and a business?",
      answer: [
        "Because the information immigrants need is scattered across government websites, banks, tax rules, visa rules, and personal-finance platforms that were never written with a new immigrant in mind. He lived that confusion himself: taxes, banking, credit, visas, insurance, investing, retirement, and cross-border India compliance, all at once.",
        "NRI to USA exists, in his words, so immigrants don't have to learn every U.S. money, tax, visa, and compliance rule the hard way — turning hard-to-find answers into guides, calculators, and checklists they can actually use.",
      ],
    },
    {
      question: "If you could hand a new arrival a single sentence, what would it be?",
      answer: [
        "That the same courage it took to move can go toward building a financial life — steadily, over time. He ends his book close to that note, and it's the closest thing he has to a personal creed.",
      ],
      quote: "You crossed an ocean and started over. That same courage — pointed at your finances, applied consistently, and given time — is more than enough to build real wealth.",
    },
  ],
  takeaways: {
    items: [
      "Build an emergency fund of three to six months of expenses in an accessible account as a foundation.",
      "If your workplace plan offers a match, understand the matching formula and vesting schedule before relying on it.",
      "Don't automatically freeze all long-term planning on immigration uncertainty — weigh what fits your status, liquidity, time horizon, and risk tolerance.",
      "Treat borrowing to buy an income-producing asset as a liability first; decide whether the leverage makes sense for your cash flow and risk.",
      "Give any home-country investment a clear-eyed look at currency, tax, and reporting risk before committing.",
      "Build the habit of financial learning — a little each week compounds like a portfolio does.",
    ],
    disclaimer:
      "These takeaways are educational only and reflect Deepak's personal experience and published writing. They are not individualized tax, legal, investment, or immigration advice, and are not a promise of any financial outcome. Rules and limits change — verify current figures and consult a qualified professional for your situation.",
  },
  sources: [
    {
      label: "Deepak Middha's published book",
      detail: "“Why Immigrants Failed to Build Wealth” (2024) — the source for the quotations and the events described.",
      href: "/free-immigrant-wealth-guide",
    },
    {
      label: "Approved founder biography",
      detail: "Deepak's biography as published on NRI to USA.",
      href: "/about-deepak",
    },
    {
      label: "Reviewed by Deepak Middha for factual accuracy",
      detail: "Review date: July 13, 2026.",
    },
    {
      label: "Corrections & editorial policy",
      detail: "How we verify, source, and correct stories.",
      href: "/success-stories/editorial-methodology",
    },
  ],
  internalLinks: [
    {
      href: "/about-deepak",
      label: "About Deepak Middha",
      context: "His full founder profile, credentials, and the tools he's built.",
    },
    {
      href: "/long-term-nri-wealth",
      label: "Long-term NRI wealth",
      context: "India-vs-US investing, property, retirement, and estate planning in one hub.",
    },
    {
      href: "/articles/keeping-too-much-money-in-india",
      label: "Keeping too much money in India",
      context: "The currency and concentration risk Deepak describes, explained in depth.",
    },
    {
      href: "/immigration",
      label: "Immigration hub",
      context: "H-1B, green card, and priority-date planning for readers weighing status questions.",
    },
  ],
  relatedStories: [],
  publicationStatus: "published",
};

export const stories: SuccessStory[] = [deepakStory];

/* ------------------------------------------------------------------ *
 * Validation — required fields cannot be silently omitted (Part 20)
 * ------------------------------------------------------------------ */

/** Throws if a story is marked published but is missing required content. */
export function assertPublishableStory(s: SuccessStory): void {
  const problems: string[] = [];
  const req: [keyof SuccessStory, unknown][] = [
    ["slug", s.slug],
    ["subjectSlug", s.subjectSlug],
    ["storyType", s.storyType],
    ["title", s.title],
    ["seoTitle", s.seoTitle],
    ["metaDescription", s.metaDescription],
    ["subtitle", s.subtitle],
    ["editorialNote", s.editorialNote],
    ["disclosure", s.disclosure],
    ["teaser", s.teaser],
    ["pullQuote", s.pullQuote],
  ];
  for (const [k, v] of req) {
    if (!v || (typeof v === "string" && v.trim() === "")) problems.push(String(k));
  }
  if (!s.byline?.writtenBy || !s.byline?.reviewedBy || !s.byline?.reviewStatus)
    problems.push("byline");
  if (!s.journeyAtAGlance?.origin) problems.push("journeyAtAGlance");
  if (!s.sources?.length) problems.push("sources");
  if (!s.keyLessons?.length) problems.push("keyLessons");
  if (!contributors.some((c) => c.slug === s.subjectSlug))
    problems.push(`contributor:${s.subjectSlug}`);
  if (STORY_TYPE_META[s.storyType].usesInterviewMeta && !s.interviewMeta)
    problems.push("interviewMeta (required for interview type)");
  if (problems.length) {
    throw new Error(
      `SuccessStory "${s.slug}" is not publishable — missing/empty: ${problems.join(", ")}. ` +
        `See src/app/success-stories/CLAUDE.md.`,
    );
  }
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

export const storyPath = (slug: string) => `/success-stories/${slug}`;

export function getContributor(slug: string): Contributor | undefined {
  return contributors.find((c) => c.slug === slug);
}

export function getPublishedStories(): SuccessStory[] {
  const published = stories.filter((s) => s.publicationStatus === "published");
  published.forEach(assertPublishableStory); // fail the build on incomplete stories
  return published.sort(
    (a, b) =>
      new Date(b.publicationDate).getTime() -
      new Date(a.publicationDate).getTime(),
  );
}

export function getPublishableStory(slug: string): SuccessStory | undefined {
  const s = stories.find(
    (x) => x.slug === slug && x.publicationStatus === "published",
  );
  if (s) assertPublishableStory(s);
  return s;
}

export function getFeaturedStory(): SuccessStory | undefined {
  return getPublishedStories()[0];
}

export function getStoryContributor(story: SuccessStory): Contributor {
  const c = getContributor(story.subjectSlug);
  if (!c) throw new Error(`Missing contributor for story ${story.slug}`);
  return c;
}

export function contributorInitials(c: Contributor): string {
  return c.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
