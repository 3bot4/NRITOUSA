/**
 * NRI Success Stories — content model + registry.
 *
 * This is the single source of truth for the /success-stories hub, the
 * individual story pages, and the contributor entities behind them. It doubles
 * as the reusable "story production system": every future profile is a new
 * `SuccessStory` object with a matching `Contributor`, so the hub, cards,
 * schema, sitemap, and OG image all update from data with no component changes.
 *
 * EDITORIAL RULES (enforced by structure, not just convention):
 *  - Only stories with `publicationStatus: "published"` are routed, indexed,
 *    added to the sitemap, or shown in the hub ItemList. Drafts/stubs are held
 *    back automatically (see getPublishedStories / getPublishableStory).
 *  - Every factual claim in a published story must trace to an approved source
 *    (the subject's own published writing, an approved bio, or an approved
 *    transcript). Do NOT add biographical facts here that a source doesn't
 *    support. See docs/success-stories/README-editorial.md for the checklist.
 *  - One persistent Person @id per subject (personId), reused everywhere the
 *    subject appears, so Google resolves a single entity across the site.
 *  - No headshot is invented. When `approvedPhoto` is null the UI renders an
 *    initials monogram (the site-wide convention). Never synthesize a face.
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

/** Where a subject is in the editorial pipeline. Gates publication. */
export type ConsentStatus =
  | "self-published-source" // facts come from the subject's own published work
  | "approved" // subject reviewed and approved this specific page
  | "awaiting-source-package" // invited; no interview/source yet
  | "awaiting-subject-review"; // drafted; pending subject sign-off

export type PublicationStatus = "published" | "draft";

/**
 * A person featured on the Success Stories hub or contributor directory.
 * Consent booleans live here for the editorial record but are never rendered
 * publicly — the UI only shows the last-verified date and the role labels.
 */
export interface Contributor {
  slug: string;
  fullName: string;
  /** All roles this person holds relative to NRItoUSA. */
  profileType: ProfileType[];
  currentTitle: string;
  currentOrganization: string;
  /** Bio approved for publication (or drawn from the subject's own writing). */
  approvedBio: string;
  /** Path to an approved headshot in /public, or null → initials monogram. */
  approvedPhoto: string | null;
  photoAlt: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  areasOfExperience: string[];
  /** One-line, non-sensitive summary of the immigration route (if approved). */
  immigrationRouteSummary?: string;
  countriesLivedIn: string[];
  /** Canonical profile URL on this site (e.g. /about-deepak). */
  authorPageUrl: string;
  /** Published story pages about this person. */
  storyUrls: string[];
  /** Editorial record — not rendered publicly. */
  consentStatus: ConsentStatus;
  profileVerifiedDate: string; // ISO
  featured: boolean;
}

export interface TimelineMilestone {
  /** Display label for when — a year or range. Kept vague enough to be safe. */
  when: string;
  title: string;
  detail: string;
}

export interface InterviewExchange {
  question: string;
  /** One or more paragraphs. Adapted from the subject's approved source. */
  answer: string[];
  /** Optional verbatim pull-quote the subject owns/approved. */
  quote?: string;
}

export interface StoryInternalLink {
  href: string;
  label: string;
  /** Why this link helps the reader here (used for the "keep exploring" grid). */
  context: string;
}

/** Byline roles for a story — who actually did what. */
export interface StoryByline {
  interviewee: string;
  writtenBy: string;
  editedBy: string;
  reviewedBy: string;
}

export interface SuccessStory {
  slug: string;
  /** Subject's contributor slug (links story ↔ person entity). */
  subjectSlug: string;
  /** On-page H1. */
  title: string;
  /** SEO <title> (<60 chars ideally). */
  seoTitle: string;
  metaDescription: string;
  /** Short subtitle under the H1. */
  subtitle: string;
  /** Editorial category label (drives hub filters). */
  category: StoryCategory;
  /** Countries in the journey (rendered only when approved). */
  countries: string[];
  publicationDate: string; // ISO
  modifiedDate: string; // ISO
  verificationDate: string; // ISO
  readingTime: number; // minutes
  byline: StoryByline;
  /** Visible transparency disclosure shown near the top of the story. */
  disclosure: string;
  /** Card teaser + hub summary. */
  teaser: string;
  /** A short pull-quote used on the card, hero, and OG image. */
  pullQuote: string;
  openingScene: string[];
  timeline: TimelineMilestone[];
  takeaways: string[];
  interview: InterviewExchange[];
  checklist: { items: string[]; disclaimer: string };
  bookCallout?: { title: string; description: string; url: string; note: string };
  internalLinks: StoryInternalLink[];
  /** Slugs of related published stories (empty → related guides shown). */
  relatedStories: string[];
  publicationStatus: PublicationStatus;
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

/* ------------------------------------------------------------------ *
 * Person entity IDs (one persistent @id per subject, reused everywhere)
 * ------------------------------------------------------------------ */

/**
 * Deepak's canonical Person @id. It MUST match the @id emitted by the
 * /about-deepak ProfilePage so the founder story, the author profile, and
 * every article byline resolve to ONE entity for Google (E-E-A-T).
 */
export const DEEPAK_PERSON_ID = `${site.url}/about-deepak#person`;

/** Resolve the persistent Person @id for a contributor. */
export function personId(c: Contributor): string {
  if (c.slug === "deepak-middha") return DEEPAK_PERSON_ID;
  return `${site.url}${c.authorPageUrl}#person`;
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
 * Invited future subjects. These are intentionally NOT `Contributor`s and are
 * NOT rendered anywhere public: no page, no schema, no sitemap, no hub card.
 * They exist only to seed the editorial pipeline. Move a person into
 * `contributors` + add a published `SuccessStory` only after a full, approved
 * source package (see docs/success-stories/README-editorial.md).
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

/* ------------------------------------------------------------------ *
 * Stories
 * ------------------------------------------------------------------ *
 * The Deepak founder story. Every claim below is traceable to Deepak's own
 * published book "Why Immigrants Failed to Build Wealth" (the free Immigrant
 * Wealth Guide PDF) and his approved author bio — see the source-to-claim map
 * in docs/success-stories/README-editorial.md. Quotations are his own words,
 * drawn from that published work.
 */
const deepakStory: SuccessStory = {
  slug: "deepak-middha",
  subjectSlug: "deepak-middha",
  title:
    "From India to America: Deepak Middha on immigration, career and building wealth",
  seoTitle: "Deepak Middha: Founder's Journey | NRI Success Story",
  metaDescription:
    "Our founder Deepak Middha on arriving from India with student loans, rebuilding his finances, real estate and investing, and why immigrants shouldn't wait to start.",
  subtitle:
    "Our founder arrived from India carrying student and marriage loans. This is how a Chartered Accountant taught himself to invest — and why he built NRI to USA.",
  category: "Finance",
  countries: ["India", "United States"],
  publicationDate: "2026-07-13",
  modifiedDate: "2026-07-13",
  verificationDate: "2026-07-13",
  readingTime: 11,
  byline: {
    interviewee: "Deepak Middha",
    writtenBy: "NRItoUSA Editorial Team",
    editedBy: "NRItoUSA Editorial Team",
    reviewedBy: "Deepak Middha",
  },
  disclosure:
    "Deepak Middha is the founder and an author/reviewer at NRI to USA — this is a founder profile, not an independent third-party review. It was written and edited by the NRItoUSA Editorial Team, drawing on Deepak's published book “Why Immigrants Failed to Build Wealth” and his author biography. All quotations are his own words from that published work.",
  teaser:
    "A Chartered Accountant who landed with education and marriage loans, taught himself to trade after midnight, and turned one foreclosure into a small property portfolio — then built NRI to USA so other immigrants wouldn't learn it all the hard way.",
  pullQuote:
    "Spread your wings. Never clip them. The biggest risk in life is taking none at all.",
  openingScene: [
    "For six years, the most important hours of Deepak Middha's day started after everyone else had gone to sleep. A Chartered Accountant by training, he would come home from a full day inside the machinery of institutional finance, eat dinner, and open his laptop to the Indian market — which, twelve hours ahead, opened at 9 p.m. his time. Later he added the German and French exchanges: sleep from 10 p.m. to 2 a.m., trade the European open until 5 a.m., then back up for the office by 8.",
    "“For six years I traded until 2 a.m. after a full day's work,” he writes, “because the education I wanted wasn't going to teach itself.” He had no investing mentor. Friends told him to sit it out — “it's a recession, don't risk it.” He listened politely and kept buying. That stubbornness, more than any single trade, is the throughline of his immigrant story.",
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
        "Immigrated to America married, with his wife and children — and carrying roughly $6,000–$8,000 in education loans plus a $15,000 marriage loan. First mission: clear the debt while supporting a younger brother's tuition and family back home.",
    },
    {
      when: "2009–10",
      title: "First real-estate moves (in India)",
      detail:
        "Before holding a green card, he made his first property investments back in India during the downturn, when prices had fallen. One property bought for around $10,000 later rose to roughly $80,000; two others multiplied several-fold.",
    },
    {
      when: "2012",
      title: "First U.S. property — a foreclosure",
      detail:
        "About a year and a half into renting, he bought a foreclosed home at a low price, lived in it, and later sold it for a profit that became the seed capital for everything else.",
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
  takeaways: [
    "Time in the market beats a perfect entry. The years spent waiting — for a green card, for certainty, for a lump sum — are the most expensive years an immigrant can lose.",
    "Saving alone is a subtraction game. Frugality has a floor; owning income-producing assets is what changes the trajectory.",
    "Financial education is a habit you build in the margins — an hour a day, often after work — not a talent you're born with.",
    "Debt used to buy an income-producing asset behaves differently from debt used to consume. Know which one you're taking on.",
    "Never leave an employer retirement match on the table — it is one of the few pieces of genuinely free money most immigrants have access to.",
  ],
  interview: [
    {
      question: "You write that immigrants often arrive with a specific mindset about money. What did you notice?",
      answer: [
        "In the early years, his friends and neighbors were good people from solid middle-class families, earning decent salaries at real companies. But the financial strategy Deepak saw around him was almost entirely subtraction: clip the coupon, find the secondhand furniture, buy the cheaper groceries, send a little home, repeat.",
        "He has nothing against frugality — but he argues it only goes so far. “You cannot save your way to wealth on a salary alone,” he writes. “Their mindset, not their income, was the limitation.”",
      ],
      quote: "Spread your wings. Never clip them. The biggest risk in life is taking none at all.",
    },
    {
      question: "You call waiting for the green card the most expensive mistake immigrants make. Why so strong?",
      answer: [
        "In his book he names it plainly: “the single most expensive mistake I see Indian immigrants make in America: waiting for the green card.” The milestone becomes so sacred, he argues, that people put their entire financial life on hold for it — sometimes a decade or more — renting, saving, and waiting while cash sits idle.",
        "The money parked in a savings account during those years, he points out, could have been quietly compounding into something life-changing. His answer isn't recklessness; it's starting early, consistently, with a long horizon — and separating the immigration timeline from the investing one.",
      ],
    },
    {
      question: "How did you actually learn to invest, with no mentor and a full-time job?",
      answer: [
        "The hard way, and on very little sleep. As a Chartered Accountant, his instinct was to learn the markets directly rather than wait for permission. He bought a few stocks and started teaching himself how trading worked — first the Indian market at 9 p.m. Chicago time, later the German and French exchanges before dawn.",
        "For roughly six years he traded until 2 a.m. after a full day at the office, then was back at his desk by morning. He's careful to frame this as tuition, not glamour: “losing some and winning some, all of it tuition.”",
      ],
      quote: "For six years I traded until 2 a.m. after a full day's work — because the education I wanted wasn't going to teach itself.",
    },
    {
      question: "Your first property wasn't in the U.S. Walk us through those early real-estate moves.",
      answer: [
        "Because he'd just arrived and didn't yet hold a green card, his first real-estate moves were back in India, in 2009–10, when a downturn had knocked prices down. He describes buying a few properties cheaply — one for around $10,000 that later climbed to roughly $80,000, with two others multiplying several-fold.",
        "His first American property came in 2012: a foreclosure bought at a low price, lived in for a few years, then sold for a profit that seeded everything else. Across 2013–2014 he bought several more, many of which he still holds.",
      ],
      quote: "Recessions scare most people. To me they looked like clearance sales.",
    },
    {
      question: "You talk a lot about leverage and “good” versus “bad” debt. How should a new immigrant think about it?",
      answer: [
        "He draws a hard line between debt that traps you and debt that works for you. A loan for a credit-card balance or a car is a liability. A loan that buys an income-producing asset, he argues, can become an asset itself.",
        "That's how he describes scaling up: one property financing the next. He's equally clear about the cautions — leverage is a double-edged sword that requires a strong credit profile, stable income, and a clear-eyed read of the market before you use it.",
      ],
      quote: "A loan you use to buy an income-producing asset is not a burden. It is leverage — and leverage, used wisely, builds wealth.",
    },
    {
      question: "Where do you see immigrants most often go wrong?",
      answer: [
        "Two decades of watching the pattern, he says, points to the same place: leaning too heavily on savings accounts and CDs out of a craving for safety and control, and delaying investment and retirement accounts for the first five to ten years in the country — exactly when starting would matter most.",
        "He's blunt that this isn't about age or income. He's seen immigrants from their twenties to their sixties cling to cash, and professionals earning six figures still living paycheck to paycheck. The root cause, in his telling, is almost always mindset — and inherited fear of the markets — not a lack of money.",
      ],
    },
    {
      question: "What's the one piece of “free money” you wish every immigrant grabbed on day one?",
      answer: [
        "The employer retirement match. If a company matches contributions, that match is free money, and skipping it is one of the costliest mistakes he sees. Every matched dollar effectively doubles that part of your investment on the spot — and the earlier it lands, the more decades it has to compound.",
        "His rule of thumb is simple: read your plan's match formula, always contribute at least enough to capture the full match, and increase beyond it when you can.",
      ],
    },
    {
      question: "You keep money between two countries. How do you think about home-country investments?",
      answer: [
        "With eyes open to currency risk. He walks through a concrete example in the book: a property in India that gains 20% in rupee terms can deliver far less in dollar terms once the rupee weakens against the dollar — sometimes turning a 20% gain into single digits.",
        "He doesn't tell people to avoid home-country investments; he tells them to give the decision a hard, clear-eyed look and to weigh the exchange-rate drift that quietly erodes returns for dollar-based investors.",
      ],
    },
    {
      question: "Why build NRI to USA at all — you already had books and a business?",
      answer: [
        "Because the information immigrants need is scattered — across government websites, banks, tax rules, visa rules, and personal-finance platforms that were never written with a new immigrant in mind. He lived that confusion himself: taxes, banking, credit, visas, insurance, investing, retirement, and cross-border India compliance, all at once.",
        "NRI to USA exists, in his words, so immigrants don't have to learn every U.S. money, tax, visa, and compliance rule the hard way — turning hard-to-find answers into guides, calculators, and checklists they can actually use.",
      ],
    },
    {
      question: "If you could hand a new arrival a single sentence, what would it be?",
      answer: [
        "That the same courage it took to move is enough to build wealth — if it's pointed at money and given time. He ends his book on exactly that note, and it's the closest thing he has to a personal creed.",
      ],
      quote: "You crossed an ocean and started over. That same courage — pointed at your finances, applied consistently, and given time — is more than enough to build real wealth. Don't wait for the green card. Don't wait for permission.",
    },
  ],
  checklist: {
    items: [
      "Build an emergency fund of three to six months of expenses in an accessible account before investing.",
      "Contribute at least enough to your workplace plan to capture the full employer match.",
      "Separate your immigration timeline from your investing timeline — don't put money decisions on hold waiting for status.",
      "Understand the difference between debt that consumes and debt that buys an income-producing asset.",
      "Give any home-country investment a clear-eyed look at currency risk before committing.",
      "Trade an hour of screen time for an hour of financial learning — consistency compounds like the portfolio does.",
    ],
    disclaimer:
      "This checklist is educational only and reflects Deepak's personal experience and published writing. It is not individualized tax, legal, investment, or immigration advice. Contribution limits and rules change — verify current figures and consult a qualified professional for your situation.",
  },
  bookCallout: {
    title: "Why Immigrants Failed to Build Wealth",
    description:
      "Deepak's book on why so many immigrants under-build wealth in America — and the mindset and money habits that change the outcome. The free Immigrant Wealth Guide is drawn from it.",
    url: "/free-immigrant-wealth-guide",
    note: "Educational only — not investment, tax, or legal advice.",
  },
  internalLinks: [
    {
      href: "/free-immigrant-wealth-guide",
      label: "Free Immigrant Wealth Guide",
      context: "The full PDF this story draws from — the money traps and the investment checklist for new immigrants.",
    },
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
      href: "/india-tax-compliance",
      label: "India tax & compliance",
      context: "For readers weighing cross-border money and the currency-risk point above.",
    },
  ],
  relatedStories: [],
  publicationStatus: "published",
};

export const stories: SuccessStory[] = [deepakStory];

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

export const storyPath = (slug: string) => `/success-stories/${slug}`;

export function getContributor(slug: string): Contributor | undefined {
  return contributors.find((c) => c.slug === slug);
}

/** All stories that are cleared for publication — the only ones ever exposed. */
export function getPublishedStories(): SuccessStory[] {
  return stories
    .filter((s) => s.publicationStatus === "published")
    .sort(
      (a, b) =>
        new Date(b.publicationDate).getTime() -
        new Date(a.publicationDate).getTime(),
    );
}

/** Resolve a story ONLY if it is published (draft protection for routes). */
export function getPublishableStory(slug: string): SuccessStory | undefined {
  return stories.find(
    (s) => s.slug === slug && s.publicationStatus === "published",
  );
}

/** The featured story shown at the top of the hub (first published, featured). */
export function getFeaturedStory(): SuccessStory | undefined {
  const published = getPublishedStories();
  return published[0];
}

export function getStoryContributor(story: SuccessStory): Contributor {
  const c = getContributor(story.subjectSlug);
  if (!c) throw new Error(`Missing contributor for story ${story.slug}`);
  return c;
}

/** Deterministic initials for the monogram avatar (no external image). */
export function contributorInitials(c: Contributor): string {
  return c.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
