/**
 * Global site search index.
 *
 * A single, read-only projection over the site's existing content catalogs that
 * powers the homepage "Search NRI to USA" box. It does NOT define new routes or
 * change any slug — it merely assembles a flat, searchable list of every
 * high-value destination (tools, calculators, checklists, guides, articles, hub
 * pages, and PDF lead magnets), each tagged with a content-type badge and a
 * priority weight so the most-useful pages surface first.
 *
 * Sources (all already crawlable elsewhere on the site):
 *   - toolCatalog        → Tool / Calculator / Checklist / Hub
 *   - articles.ts        → Article
 *   - the topic clusters → Guide (ITR, TDS, repatriation, gifts, passport, OCI,
 *                          USCIS, myUSCIS, forms, life-planning, H-1B, green
 *                          card, visa bulletin)
 *   - trumpAccountCluster→ Guide
 *   - the standalone top-level clusters → Guide/Tool/Calculator (PERM, I-140,
 *                          EAD, I-485, green card renewal, NVC, DOL wage,
 *                          India visa, student/F-1, visitor insurance)
 *   - successStories     → Guide
 *   - CURATED            → Hub + PDF + the flagship top-level pages
 *   - SUPPORTING         → hub indexes, state pages and site/legal pages, all
 *                          at priority 0 so they are findable by name but never
 *                          crowd the default "most searched" list
 *
 * Adding a page to any source catalog surfaces it here automatically. Only the
 * PRIORITY map and CURATED list below are hand-maintained.
 */

import { toolCatalog } from "@/lib/toolCatalog";
import { articles } from "@/lib/articles";
import { itrPages, itrPath } from "@/lib/itrCluster";
import { tdsPages, tdsPath } from "@/lib/tdsCluster";
import { repatPages, repatPath } from "@/lib/repatriationCluster";
import { giftPages, giftPath } from "@/lib/giftsCluster";
import { clusterPages, clusterPath } from "@/lib/passportCluster";
import { ociGuides, ociGuidePath } from "@/lib/ociGuides";
import { uscisChildPages } from "@/lib/uscisCluster";
import { myuscisChildPages } from "@/lib/myuscisCluster";
import { formsChildPages } from "@/lib/uscisFormsCluster";
import { lifePlanningChildPages } from "@/lib/uscisLifePlanningCluster";
import { h1bChildPages } from "@/lib/h1bCluster";
import { greenCardChildPages } from "@/lib/greenCardCluster";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { trumpAccountClusterLinks } from "@/lib/trumpAccountCluster";
import { lifeInsuranceClusterLinks } from "@/lib/lifeInsuranceCluster";
import { clusterLinks as permClusterLinks } from "@/lib/permCluster";
import { i140ClusterLinks } from "@/lib/i140Cluster";
import { eadClusterLinks } from "@/lib/eadCluster";
import { i485ClusterLinks } from "@/lib/i485Cluster";
import { gcRenewalClusterLinks } from "@/lib/greenCardRenewalCluster";
import { nvcClusterLinks } from "@/lib/nvcCluster";
import { wageClusterLinks } from "@/lib/wageCluster";
import { indiaVisaClusterLinks } from "@/lib/indiaVisaCluster";
import { studentPageList } from "@/lib/studentCluster";
import { visitorInsuranceChildPages } from "@/lib/visitorInsuranceCluster";
import { getPublishedStories } from "@/lib/successStories";
import type { ClusterLink } from "@/lib/permCluster";
import { liveTopics } from "@/lib/topics";
import { states } from "@/data/indianPopulationData";

/** Content-type badge shown on each search result. */
export type SearchType =
  | "Tool"
  | "Calculator"
  | "Checklist"
  | "Guide"
  | "Article"
  | "Hub"
  | "PDF";

export interface SearchItem {
  title: string;
  description: string;
  href: string;
  type: SearchType;
  /** Higher surfaces first (default 0). */
  priority: number;
  /** Lowercased free-text terms folded into the search haystack. */
  keywords?: string;
}

/** Trim a description to a short, card-friendly length on a word boundary. */
function short(text: string, max = 150): string {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/**
 * States that have their own /indian-population-in-<state> route. Keep in sync
 * with src/app — a name added here without a route would surface a dead result.
 */
const STATE_PAGES = [
  "California",
  "Texas",
  "New Jersey",
  "New York",
  "Illinois",
  "Washington",
  "Georgia",
  "Florida",
  "Maryland",
  "Massachusetts",
  "Virginia",
] as const;

/**
 * Supporting pages: section indexes, standalone guides with no cluster of their
 * own, and the site/legal pages. All sit at priority 0 — they are findable by
 * name but never surface in the default "most searched" list, which stays
 * driven by analytics (see TOP_SEARCHED_HREFS).
 *
 * The homepage itself is intentionally absent: linking home → home is noise.
 * So are the /nri-wealth-checkup/* wizard steps, which are stages of a flow
 * rather than destinations — the entry point is indexed instead, and they are
 * excluded from the sitemap for the same reason.
 */
const SUPPORTING: SearchItem[] = [
  // ---- H-1B lottery cluster --------------------------------------------
  {
    title: "H-1B Lottery Chance Calculator",
    description:
      "Estimate your FY 2027 H-1B odds against the 85,000 cap — wage level (Level I = 1 entry to Level IV = 4), the master's cap, and multi-year attempts.",
    href: "/h1b-lottery-chance-calculator",
    type: "Calculator",
    priority: 0,
    keywords: "h1b lottery chance calculator odds probability cap registration wage level masters cap",
  },
  {
    title: "H-1B Lottery Chances by Year",
    description:
      "Selection odds year by year — roughly 35% in FY 2026 and 25% in FY 2024 — plus how the FY 2027 wage-weighted rules change the maths.",
    href: "/h1b-lottery-chances",
    type: "Guide",
    priority: 0,
    keywords: "h1b lottery chances odds selection rate percentage by year wage weighted",
  },
  {
    title: "H-1B Lottery Results",
    description:
      "FY 2027 results: the late-March release window, what Selected and Submitted actually mean, and whether a second round is coming.",
    href: "/h1b-lottery-results",
    type: "Guide",
    priority: 0,
    keywords: "h1b lottery results fy2027 selected submitted second round",
  },
  {
    title: "H-1B Lottery Results Date",
    description:
      "When results are announced: the registration and selection timeline, and when Indian applicants typically hear back.",
    href: "/h1b-lottery-results-date",
    type: "Guide",
    priority: 0,
    keywords: "h1b lottery results date when announced timeline registration period march",
  },
  {
    title: "H-1B Registration Status Meaning",
    description:
      "What each registration status means in plain language — Submitted, Selected, Not Selected, Denied and Invalidated-Failed Payment.",
    href: "/h1b-registration-status-meaning",
    type: "Guide",
    priority: 0,
    keywords: "h1b registration status meaning submitted selected not selected denied invalidated failed payment",
  },
  {
    title: "H-1B Lottery: Selected — Next Steps",
    description:
      "A next-steps checklist after selection: confirming your employer's plan, the petition window, premium processing and what to prepare.",
    href: "/h1b-lottery-selected-next-steps",
    type: "Checklist",
    priority: 0,
    keywords: "h1b selected next steps after selection petition filing employer i-129",
  },
  {
    title: "H-1B Lottery: Not Selected — Your Options",
    description:
      "Realistic options if you were not selected: staying on F-1 OPT or STEM OPT, cap-exempt employers, and other visa routes.",
    href: "/h1b-lottery-not-selected-options",
    type: "Guide",
    priority: 0,
    keywords: "h1b not selected options rejected alternatives cap exempt opt stem opt o1 l1",
  },
  {
    title: "Will There Be a Second H-1B Lottery?",
    description:
      "How additional selection rounds work, why USCIS runs them, and whether you need to do anything to stay in the pool.",
    href: "/h1b-second-lottery",
    type: "Guide",
    priority: 0,
    keywords: "h1b second lottery additional selection round reserve pool third lottery",
  },
  {
    title: "H-1B Multiple Registrations",
    description:
      "Can several employers register you? Yes — but the beneficiary-centric rule still gives you exactly one entry.",
    href: "/h1b-lottery-multiple-registrations",
    type: "Guide",
    priority: 0,
    keywords: "h1b multiple registrations several employers beneficiary centric one entry duplicate",
  },
  {
    title: "H-1B Lottery Results for F-1 OPT Students",
    description:
      "What the results mean for F-1 OPT and STEM OPT students: your OPT end date, STEM eligibility and cap-gap basics.",
    href: "/h1b-lottery-results-for-f1-opt-students",
    type: "Guide",
    priority: 0,
    keywords: "h1b lottery f1 opt stem opt students cap gap extension end date",
  },
  {
    title: "H-1B Lottery Results for H-4 Families",
    description:
      "What the results mean for H-4 spouses and children — spouse planning, H-4 EAD considerations and school timing.",
    href: "/h1b-lottery-results-for-h4-families",
    type: "Guide",
    priority: 0,
    keywords: "h1b lottery h4 families spouse children dependents h4 ead school",
  },
  {
    title: "H-1B Visa Stamping After Selection",
    description:
      "Stamping in India: the MRV fee, DS-160 through interview, dropbox eligibility, the documents checklist and timing.",
    href: "/h1b-visa-stamping-after-selection",
    type: "Guide",
    priority: 0,
    keywords: "h1b visa stamping india consulate ds-160 dropbox interview mrv fee 221g",
  },
  {
    title: "H-1B Layoff Checklist",
    description:
      "The 60-day planning window after an H-1B layoff: I-94, I-797, status options, and what to line up first.",
    href: "/h1b-layoff",
    type: "Checklist",
    priority: 0,
    keywords: "h1b layoff laid off 60 day grace period i94 i797 transfer status change unemployment",
  },

  // ---- Standalone guides and tools -------------------------------------
  {
    title: "Immigration Attorney & Lawyer Cost",
    description:
      "What immigration lawyers charge in the USA by case type — consultation, H-1B, marriage green card and employment green card ranges.",
    href: "/immigration-attorney-lawyer-cost",
    type: "Guide",
    priority: 0,
    keywords: "immigration attorney lawyer cost fees price consultation flat fee hourly h1b green card",
  },
  {
    title: "Send Money to India: Costs, TCS & Fees",
    description:
      "Compare India–USA transfer costs, understand TCS on outward remittances, and avoid hidden exchange-rate fees.",
    href: "/send-money-to-india",
    type: "Guide",
    priority: 0,
    keywords: "send money to india remittance transfer wise remitly tcs exchange rate fees usd inr",
  },
  {
    title: "Should NRIs Keep Investments in India?",
    description:
      "A six-step framework to decide, asset by asset, whether to keep or move your Indian investments after settling in the USA.",
    href: "/india-investments/should-nris-keep-investments-in-india",
    type: "Guide",
    priority: 0,
    keywords: "should nris keep investments in india mutual funds fd ppf nps property pfic repatriate exit",
  },
  {
    title: "NRI Tax Forms & Limits Center",
    description:
      "One table of the US and India tax forms that may apply to you — FBAR, FATCA, Form 3520, 15CA/15CB, ITR and Form 67 — with thresholds and deadlines.",
    href: "/india-tax-compliance/nri-tax-forms-limits",
    type: "Tool",
    priority: 0,
    keywords: "nri tax forms limits fbar fatca 8938 form 3520 15ca 15cb itr form 67 thresholds deadlines",
  },
  {
    title: "e-OCI Card: Generate & Download",
    description:
      "How existing OCI holders generate and download the digital e-OCI card from the official OCI Services portal.",
    href: "/oci/e-oci-card",
    type: "Guide",
    priority: 0,
    keywords: "e-oci card digital download generate oci services portal reissue",
  },
  {
    title: "October 2026 Visa Bulletin Predictions",
    description:
      "The FY2027 reset analysis for EB-2 India, which is Unavailable until 30 September 2026 — and why a return to at least July 2014 looks likely.",
    href: "/visa-bulletin/october-2026-predictions",
    type: "Guide",
    priority: 0,
    keywords: "october 2026 visa bulletin predictions eb2 india fy2027 reset priority date forecast unavailable",
  },
  {
    title: "Visa & Green Card Tools",
    description:
      "Every visa and green card tool in one place: priority dates, H-1B lottery odds, H-4 EAD eligibility and case tracking.",
    href: "/tools/visa-green-card",
    type: "Hub",
    priority: 0,
    keywords: "visa green card tools priority date h1b lottery h4 ead eb1 eb2 eb3 tracker",
  },

  // ---- Section indexes --------------------------------------------------
  {
    title: "All Calculators",
    description:
      "Every cross-border calculator: RNOR residency, India property gains, 401(k) cash-out, backdoor Roth, rent vs buy and more.",
    href: "/calculators",
    type: "Hub",
    priority: 0,
    keywords: "all calculators index list cross border nri immigrant tools",
  },
  {
    title: "All Guides by Topic",
    description:
      "Browse every NRI to USA guide by topic — finance, taxes, credit, housing, cars, investing, immigration and community.",
    href: "/topics",
    type: "Hub",
    priority: 0,
    keywords: "all guides topics index browse articles categories",
  },
  {
    title: "New to the USA: Resources",
    description:
      "Everything to set up in your first weeks — SSN, bank account, phone plan and your first credit card.",
    href: "/resources",
    type: "Hub",
    priority: 0,
    keywords: "resources new to usa first weeks setup checklist ssn bank phone credit card newcomer",
  },
  {
    title: "Education Tools & Guides",
    description:
      "Free tools for the US education system: K-12 grade finder, GPA and SAT calculators, and a college-cost projector.",
    href: "/education",
    type: "Hub",
    priority: 0,
    keywords: "education hub school k12 gpa sat college cost calculator students immigrant families",
  },
  {
    title: "Education Articles",
    description:
      "In-depth guides on the US education system for immigrant families: college costs, K-12 enrolment and the digital SAT.",
    href: "/education/articles",
    type: "Hub",
    priority: 0,
    keywords: "education articles guides college costs k12 enrollment digital sat immigrant families",
  },
  {
    title: "Visitor Insurance for the USA",
    description:
      "Visitor medical insurance explained with numbers: premium vs. liability, deductible, coinsurance and policy maximum.",
    href: "/visitor-insurance",
    type: "Hub",
    priority: 0,
    keywords: "visitor insurance usa parents travel medical coverage premium deductible coinsurance policy maximum",
  },
  {
    title: "NRI Success Stories",
    description:
      "Original interviews with Indian immigrant professionals, physicians, executives and founders on career, money and life in the USA.",
    href: "/success-stories",
    type: "Hub",
    priority: 0,
    keywords: "success stories interviews indian immigrants professionals founders physicians career journey",
  },
  {
    title: "How We Produce NRI Success Stories",
    description:
      "How subjects are selected, consent collected, professional details verified, quotes approved and errors corrected.",
    href: "/success-stories/editorial-methodology",
    type: "Guide",
    priority: 0,
    keywords: "editorial methodology success stories consent verification corrections policy sourcing",
  },
  {
    title: "USCIS Case Status",
    description:
      "Decode every USCIS case status message and check yours with a 13-character receipt number.",
    href: "/uscis/case-status",
    type: "Guide",
    priority: 0,
    keywords: "uscis case status message receipt number egov check meaning actively reviewed",
  },
  {
    title: "USCIS Forms Guide",
    description:
      "A plain guide to the USCIS forms Indians file most: I-129, I-140, I-485, I-765, I-131, I-130, I-539, I-907 and AR-11.",
    href: "/uscis/forms",
    type: "Hub",
    priority: 0,
    keywords: "uscis forms i-129 i-140 i-485 i-765 i-131 i-130 i-539 i-907 ar-11 guide list",
  },
  {
    title: "USCIS Processing Times",
    description:
      "How processing times work: receipt dates, service centers, premium processing, delays and case inquiries.",
    href: "/uscis/processing-times",
    type: "Guide",
    priority: 0,
    keywords: "uscis processing times receipt date service center premium processing outside normal case inquiry",
  },
  {
    title: "myUSCIS Account",
    description:
      "How myUSCIS works for Indian applicants: the online account number, access code, linking paper-filed cases and notices.",
    href: "/uscis/myuscis-account",
    type: "Guide",
    priority: 0,
    keywords: "myuscis account online access code link paper filed case notices rfe upload",
  },
  {
    title: "USCIS Life Planning",
    description:
      "Living with USCIS delays: H-1B, the green card backlog, I-485, travel to India and job changes.",
    href: "/uscis/life-planning",
    type: "Guide",
    priority: 0,
    keywords: "uscis life planning delays backlog i-485 travel india job change ac21 waiting",
  },

  // ---- Site and legal pages ---------------------------------------------
  {
    title: "About NRI to USA",
    description:
      "NRI to USA, owned by Wealth Building Academy LLC, helps NRIs, immigrants, students and families make practical money decisions.",
    href: "/about",
    type: "Guide",
    priority: 0,
    keywords: "about us who we are wealth building academy llc mission editorial",
  },
  {
    title: "Deepak Middha — Founder & Author",
    description:
      "Founder of NRI to USA: a Chartered Accountant, Series 65 holder and immigrant finance educator.",
    href: "/about-deepak",
    type: "Guide",
    priority: 0,
    keywords: "deepak middha founder author bio chartered accountant series 65 about the author",
  },
  {
    title: "Contributors & Featured Leaders",
    description:
      "The founder, editorial reviewers and immigrant professionals behind NRI to USA.",
    href: "/contributors",
    type: "Guide",
    priority: 0,
    keywords: "contributors authors editorial reviewers featured leaders team",
  },
  {
    title: "Write for Us",
    description:
      "Share your H-1B, layoff, salary-negotiation or relocation story and get a byline.",
    href: "/contribute",
    type: "Guide",
    priority: 0,
    keywords: "write for us contribute guest post byline share your story submit",
  },
  {
    title: "Contact",
    description:
      "Reach the editorial team with questions, feedback, corrections or partnership enquiries.",
    href: "/contact",
    type: "Guide",
    priority: 0,
    keywords: "contact us email support feedback corrections enquiries reach out",
  },
  {
    title: "Partnerships",
    description:
      "Working with NRI to USA as an educational publisher for Indian immigrants, NRIs and H-1B families.",
    href: "/partnerships",
    type: "Guide",
    priority: 0,
    keywords: "partnerships advertise sponsor collaborate media kit business",
  },
  {
    title: "Press & Data",
    description:
      "Data, analysis and expert comment for journalists: visa bulletin history, H-1B sponsorship records and Census-based population data.",
    href: "/press",
    type: "Guide",
    priority: 0,
    keywords: "press media journalists data expert comment interview visa bulletin h1b census",
  },
  {
    title: "Privacy Policy",
    description:
      "How NRI to USA collects, uses, shares and protects your information — cookies, analytics and email.",
    href: "/privacy-policy",
    type: "Guide",
    priority: 0,
    keywords: "privacy policy data protection gdpr ccpa cookies analytics email personal information",
  },
  {
    title: "Terms & Conditions",
    description:
      "The terms governing your use of NRI to USA, operated by Wealth Building Academy LLC — educational content and tools only.",
    href: "/terms-and-conditions",
    type: "Guide",
    priority: 0,
    keywords: "terms and conditions of use legal agreement tos service",
  },
  {
    title: "Cookie Policy",
    description:
      "How NRI to USA uses cookies and similar technologies for analytics, performance, preferences and advertising.",
    href: "/cookie-policy",
    type: "Guide",
    priority: 0,
    keywords: "cookie policy cookies tracking consent analytics advertising preferences",
  },
  {
    title: "Disclaimer",
    description:
      "Content and tools here are general educational information — not legal, immigration, tax, accounting or financial advice.",
    href: "/disclaimer",
    type: "Guide",
    priority: 0,
    keywords: "disclaimer not advice educational legal tax financial immigration liability",
  },
  {
    title: "Affiliate Disclosure",
    description:
      "How affiliate links, sponsored placements and partner recommendations work — and how they do not change our guidance.",
    href: "/affiliate-disclosure",
    type: "Guide",
    priority: 0,
    keywords: "affiliate disclosure sponsored links commission partner advertising compensation",
  },
];

/** Turn an href into extra search terms, so "/i90-vs-i751" matches "i90". */
function slugWords(href: string): string {
  return href.replace(/^\//, "").replace(/[/-]/g, " ").toLowerCase();
}

/**
 * Infer the result badge from a page's own label. Cluster arrays don't carry a
 * content type, but their labels are consistent enough to read one off — and a
 * wrong guess only changes a badge, never a destination.
 */
function typeFromLabel(label: string): SearchType {
  if (/calculator|estimator/i.test(label)) return "Calculator";
  if (/checklist/i.test(label)) return "Checklist";
  if (/tracker|checker|finder|generator|organizer|\btool\b/i.test(label))
    return "Tool";
  return "Guide";
}

/**
 * Priority weights for the flagship pages we always want at the top of results
 * (requirement: high-value pages first). Keyed by exact href.
 */
const PRIORITY: Record<string, number> = {
  "/nri-wealth-checkup": 100,
  "/tools/fbar-fatca-checker": 95,
  "/tools/nri-tax-filing-roadmap": 92,
  "/tools/h1b-sponsor-finder": 90,
  "/trump-account-h1b-immigrant-families": 88,
  "/return-to-india-checklist": 86,
  "/calculators/401k-return-to-india": 84,
  "/immigration-tracker": 82,
  "/uscis": 80,
  "/india-tax-compliance": 78,
};

/** Map the toolCatalog's CatalogKind onto our SearchType badges. */
const KIND_TO_TYPE: Record<string, SearchType> = {
  Tool: "Tool",
  Calculator: "Calculator",
  Checklist: "Checklist",
  Hub: "Hub",
};

/**
 * Hand-curated hub pages and PDF lead magnets. These are real, existing routes
 * that either have no entry in a source catalog or deserve an explicit Hub/PDF
 * badge and elevated priority.
 */
const CURATED: SearchItem[] = [
  // ---- Flagship top-level pages ----------------------------------------
  {
    title: "Government Benefits for Immigrants",
    description:
      "Check which U.S. benefits your family may qualify for by immigration status, state, income and work history — with public charge and I-864 sponsor rules explained separately.",
    href: "/usa-government-benefits-immigrants",
    type: "Tool",
    priority: 82,
    keywords:
      "government benefits immigrants green card holders h1b visa holders public charge medicaid snap chip wic marketplace aca subsidy unemployment social security medicare ssi tanf fafsa tax credits mixed status families five year rule i-864 sponsor repayment food stamps welfare",
  },
  {
    title: "Divorce and Your US Immigration Status",
    description:
      "What divorce does to H-4 status and its EAD, H-1B, a conditional or 10-year green card, a pending I-485, naturalization and the I-864 — with an alimony estimator for the US and India.",
    href: "/divorce-immigration-status",
    type: "Guide",
    priority: 80,
    keywords:
      "divorce immigration status h4 visa divorce h1b divorce green card holder divorce conditional green card i-751 waiver removing conditions after divorce joint filing waiver divorce before green card interview i-130 denied affidavit of support i-864 after divorce citizenship naturalization three year rule vawa self petition u visa abused spouse alimony spousal support maintenance calculator estimator is us divorce valid in india narasimha rao section 13b mutual consent hindu marriage act stridhan separation ex spouse",
  },
  // ---- Hubs -------------------------------------------------------------
  {
    title: "Immigration Hub",
    description:
      "H-1B, green card, USCIS case status, visa bulletin and India priority dates in one place.",
    href: "/immigration",
    type: "Hub",
    priority: 76,
    keywords: "immigration hub h1b green card uscis visa bulletin",
  },
  {
    title: "USCIS Hub",
    description:
      "Case status, receipt numbers, processing times, forms and life-planning guides for USCIS applicants.",
    href: "/uscis",
    type: "Hub",
    priority: 80,
    keywords: "uscis hub case status receipt number processing times forms",
  },
  {
    title: "India Tax & Compliance Hub",
    description:
      "FBAR, FATCA, DTAA, ITR filing, TDS refunds, repatriation and Form 3520 for NRIs.",
    href: "/india-tax-compliance",
    type: "Hub",
    priority: 78,
    keywords:
      "india tax compliance hub fbar fatca dtaa itr tds repatriation form 3520",
  },
  {
    title: "NRI Wealth Hub",
    description:
      "India vs US investing, property, retirement and estate planning for long-term NRI wealth.",
    href: "/long-term-nri-wealth",
    type: "Hub",
    priority: 70,
    keywords: "nri wealth hub investing retirement estate property",
  },
  {
    title: "Return to India Hub",
    description:
      "401(k) decisions, RNOR tax status, currency timing and the full moving-back-to-India plan.",
    href: "/return-to-india",
    type: "Hub",
    priority: 72,
    keywords: "return to india hub 401k rnor currency moving back repatriation",
  },
  {
    title: "OCI Resource Center",
    description:
      "OCI card eligibility, documents, fees, timelines and step-by-step guides for the USA.",
    href: "/oci",
    type: "Hub",
    priority: 64,
    keywords: "oci card resource center eligibility fees timeline",
  },
  {
    title: "Power of Attorney for India From USA (NRI Property)",
    description:
      "How to make a power of attorney for India from the USA: notary vs apostille vs consulate attestation, stamping, registration, stamp duty, revocation and specimen formats.",
    href: "/power-of-attorney-for-india-from-usa",
    type: "Guide",
    priority: 62,
    keywords:
      "power of attorney nri india from usa poa property sell notary apostille consulate attestation stamp duty registration revoke format sample",
  },
  {
    title: "NRI Selling Property in India: TDS Guide",
    description:
      "TDS rates on NRI property sales, Form 13 lower-TDS certificate, US tax reporting and repatriation.",
    href: "/nri-selling-property-in-india-tds",
    type: "Guide",
    priority: 62,
    keywords:
      "nri selling property india tds sale form 13 lower tds certificate capital gains repatriation",
  },
  {
    title: "Gold Limit USA to India + Duty Calculator",
    description:
      "How much gold you can carry from the USA to India duty-free, customs duty rates, and a free calculator.",
    href: "/gold-limit-usa-to-india",
    type: "Calculator",
    priority: 62,
    keywords:
      "gold limit usa to india customs duty calculator carry jewellery coins bars baggage rules",
  },
  {
    title: "Shipping Household Goods to India: Cost & Duty Calculator",
    description:
      "Compare courier, air, and sea freight cost ranges for shipping household goods to India, plus estimated customs duty — total landed cost in one place.",
    href: "/shipping-household-goods-to-india",
    type: "Calculator",
    priority: 62,
    keywords:
      "shipping household goods to india cost calculator customs duty transfer of residence sea freight air freight courier moving",
  },
  {
    title: "Invitation Letter for Parents to Visit USA",
    description:
      "Free B-2 invitation letter generator with PDF download, sample letter, and documents checklist.",
    href: "/invitation-letter-for-parents-to-visit-usa",
    type: "Tool",
    priority: 62,
    keywords:
      "invitation letter parents visit usa b2 visitor visa generator sample format pdf",
  },
  {
    title: "India Property for NRIs",
    description:
      "Buying, selling, renting and the capital-gains tax rules on Indian property from the USA.",
    href: "/india-property",
    type: "Hub",
    priority: 60,
    keywords: "india property nri capital gains sale rent tds",
  },
  {
    title: "Green Card Hub",
    description:
      "Green card categories, priority dates, the EB-2/EB-3 India wait and adjustment of status.",
    href: "/green-card",
    type: "Hub",
    priority: 66,
    keywords: "green card hub eb2 eb3 priority date adjustment of status",
  },
  {
    title: "H-1B Hub",
    description:
      "H-1B lottery, transfers, extensions, prevailing wage and layoff options for Indians.",
    href: "/h1b",
    type: "Hub",
    priority: 66,
    keywords: "h1b hub lottery transfer extension prevailing wage layoff",
  },
  {
    title: "All Tools & Calculators",
    description:
      "Browse every free NRI calculator, checklist and interactive tool in one index.",
    href: "/tools",
    type: "Hub",
    priority: 62,
    keywords: "all tools calculators index browse",
  },
  // ---- PDF lead magnets --------------------------------------------------
  {
    title: "Free Immigrant Wealth Guide (PDF)",
    description:
      "Deepak Middha's free PDF on the money traps that hold immigrants back — and how to start building U.S. wealth.",
    href: "/free-immigrant-wealth-guide",
    type: "PDF",
    priority: 68,
    keywords: "free immigrant wealth guide pdf download ebook lead magnet",
  },
  {
    title: "Return to India Checklist (PDF)",
    description:
      "Free downloadable checklist covering finances, taxes, accounts and logistics for moving back to India.",
    href: "/return-to-india-checklist",
    type: "PDF",
    priority: 86,
    keywords:
      "return to india checklist pdf download moving back relocation lead magnet",
  },
  // ---- Flagship top-level pages / glossary-style ------------------------
  {
    title: "Visa Bulletin Tracker",
    description:
      "Latest visa bulletin final action and filing dates for India, explained for EB-2 and EB-3.",
    href: "/visa-bulletin",
    type: "Guide",
    priority: 58,
    keywords: "visa bulletin final action dates filing eb2 eb3 india",
  },
  {
    title: "Indian Population in the USA",
    description:
      "How many Indians live in America — by state and city, income, students, H-1B and green card trends.",
    href: "/indian-population-in-usa",
    type: "Guide",
    priority: 40,
    keywords: "indian population usa state city demographics statistics",
  },
];

/** Assign a priority: explicit PRIORITY map wins, else the provided base. */
function weight(href: string, base = 0): number {
  return PRIORITY[href] ?? base;
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // 1. Tools / calculators / checklists / flagship hubs from the tool catalog.
  for (const c of toolCatalog) {
    const type = KIND_TO_TYPE[c.kind] ?? "Tool";
    items.push({
      title: c.title,
      description: short(c.description),
      href: c.href,
      type,
      priority: weight(c.href),
      keywords: `${c.categories.join(" ")} ${c.keywords}`.toLowerCase(),
    });
  }

  // 2. Editorial guides / articles.
  for (const a of articles) {
    items.push({
      title: a.title,
      description: short(a.excerpt),
      href: `/articles/${a.slug}`,
      type: "Article",
      priority: weight(`/articles/${a.slug}`),
      keywords: `${a.topic} ${a.slug}`.toLowerCase(),
    });
  }

  // 3. Topic clusters → Guide. Each entry has { title, excerpt, slug }.
  type ClusterPage = {
    slug: string;
    title: string;
    excerpt?: string;
    metaDescription?: string;
  };
  const clusters: { pages: ClusterPage[]; path: (slug: string) => string }[] = [
    { pages: itrPages, path: itrPath },
    { pages: tdsPages, path: tdsPath },
    { pages: repatPages, path: repatPath },
    { pages: giftPages, path: giftPath },
    { pages: clusterPages, path: clusterPath },
    { pages: ociGuides, path: ociGuidePath },
    { pages: uscisChildPages, path: (s) => `/uscis/${s}` },
    { pages: myuscisChildPages, path: (s) => `/uscis/${s}` },
    { pages: formsChildPages, path: (s) => `/uscis/forms/${s}` },
    { pages: lifePlanningChildPages, path: (s) => `/uscis/${s}` },
    { pages: h1bChildPages, path: (s) => `/h1b/${s}` },
    { pages: greenCardChildPages, path: (s) => `/green-card/${s}` },
    { pages: visaBulletinChildPages, path: (s) => `/visa-bulletin/${s}` },
  ];
  for (const { pages, path } of clusters) {
    for (const p of pages) {
      const href = path(p.slug);
      items.push({
        title: p.title,
        description: short(p.metaDescription ?? p.excerpt ?? ""),
        href,
        type: "Guide",
        priority: weight(href),
        keywords: p.slug.toLowerCase(),
      });
    }
  }

  // 4. Trump Account cluster (standalone top-level routes) → Guide.
  for (const l of trumpAccountClusterLinks) {
    items.push({
      title: l.label,
      description: short(l.desc),
      href: l.href,
      type: "Guide",
      priority: weight(l.href),
      keywords: "trump account child 1000 form 4547 immigrant family",
    });
  }

  // 4b. Life insurance cluster (standalone top-level routes) → Guide.
  for (const l of lifeInsuranceClusterLinks) {
    items.push({
      title: l.label,
      description: short(l.desc),
      href: l.href,
      type: "Guide",
      priority: weight(l.href),
      keywords: "life insurance term iul indexed universal life coverage protection nri h1b family",
    });
  }

  // 4c. Standalone top-level clusters. These live at the site root rather than
  //      under a shared segment (an SEO decision — see CLAUDE.md), so they have
  //      no parent catalog to inherit from; their own ClusterLink arrays are the
  //      source of truth. Adding a page to one of those arrays surfaces it here.
  const standaloneClusters: { links: ClusterLink[]; keywords: string }[] = [
    { links: permClusterLinks, keywords: "perm labor certification dol green card process" },
    { links: i140ClusterLinks, keywords: "i-140 immigrant petition premium processing eb2 eb3" },
    { links: eadClusterLinks, keywords: "ead advance parole work permit c08 c09 auto extension" },
    { links: i485ClusterLinks, keywords: "i-485 adjustment of status aos green card application" },
    { links: gcRenewalClusterLinks, keywords: "green card renewal i-90 replace expired permanent resident card" },
    { links: nvcClusterLinks, keywords: "nvc national visa center consular processing ds-260 case number" },
    { links: wageClusterLinks, keywords: "prevailing wage dol flag wage level pwd h1b lca" },
    { links: indiaVisaClusterLinks, keywords: "india visa from usa tourist business evisa oci entry visa fees" },
  ];
  for (const { links, keywords } of standaloneClusters) {
    for (const l of links) {
      items.push({
        title: l.label,
        description: short(l.desc),
        href: l.href,
        type: typeFromLabel(l.label),
        priority: weight(l.href),
        keywords: `${keywords} ${slugWords(l.href)}`,
      });
    }
  }

  // 4d. Student / F-1 cluster → Tool or Guide depending on the page's own kind.
  for (const p of studentPageList) {
    items.push({
      title: p.title,
      description: short(p.seoDescription ?? p.description),
      href: p.path,
      type: p.kind === "tool" ? typeFromLabel(p.label) : "Guide",
      priority: weight(p.path),
      keywords: `student f1 opt cpt sevis international student ${p.owns.join(" ")} ${slugWords(p.path)}`,
    });
  }

  // 4e. Visitor insurance cluster → Guide.
  for (const p of visitorInsuranceChildPages) {
    items.push({
      title: p.title,
      description: short(p.excerpt),
      href: p.path,
      type: "Guide",
      priority: weight(p.path),
      keywords: `visitor insurance parents visiting usa travel medical coverage ${slugWords(p.path)}`,
    });
  }

  // 4f. Success stories → Guide. Drafts stay out of the index for the same
  //     reason they stay off the hub and out of the sitemap.
  for (const story of getPublishedStories()) {
    items.push({
      title: story.title,
      description: short(story.metaDescription),
      href: `/success-stories/${story.slug}`,
      type: "Guide",
      priority: weight(`/success-stories/${story.slug}`),
      keywords: `success story interview ${slugWords(story.slug)}`,
    });
  }

  // 4g. Topic hubs (/topics/<slug>). Retired topics are skipped: their route
  //      301s to a replacement that is already indexed under its own entry, so
  //      indexing the old slug would only add a redirecting result.
  for (const t of liveTopics) {
    items.push({
      title: t.title,
      description: short(t.description),
      href: `/topics/${t.slug}`,
      type: "Hub",
      priority: weight(`/topics/${t.slug}`),
      keywords: `topic guides ${slugWords(t.slug)}`,
    });
  }

  // 4h. Indian-population state pages. Only the states that actually have a
  //      route are listed — the data file carries every state, most of which
  //      render inside the explorer rather than as their own page.
  for (const name of STATE_PAGES) {
    const info = states.find((st) => st.name === name);
    const href = `/indian-population-in-${name.toLowerCase().replace(/\s+/g, "-")}`;
    items.push({
      title: `Indian Population in ${name}`,
      description: short(
        info
          ? `Indian-origin community in ${name}: ${info.metros}. ${info.drivers}.`
          : `Indian-origin population, metros and community profile for ${name}.`,
      ),
      href,
      type: "Guide",
      priority: weight(href),
      keywords: `indian population indians in ${name.toLowerCase()} census asian indian community metros desi`,
    });
  }

  // 5. Curated hubs / PDFs / flagship pages, then the supporting pages.
  items.push(...CURATED);
  items.push(...SUPPORTING);

  // De-duplicate by href, keeping the highest-priority (and thus best-badged)
  // entry — curated Hub/PDF entries win over an auto-generated duplicate.
  const byHref = new Map<string, SearchItem>();
  for (const item of items) {
    const existing = byHref.get(item.href);
    if (!existing || item.priority > existing.priority) {
      byHref.set(item.href, item);
    }
  }

  return Array.from(byHref.values()).sort((a, b) => b.priority - a.priority);
}

export const searchIndex: SearchItem[] = buildIndex();

/** Fast lookup of an index item by its href. */
const indexByHref = new Map(searchIndex.map((i) => [i.href, i]));

/**
 * The site's actual most-viewed pages (Google Analytics, last 30 days), in
 * descending traffic order. These back the "Most searched" default state of the
 * homepage search box so it reflects what real visitors land on. The two
 * site-level homepage titles are intentionally excluded (linking home → home is
 * pointless). Refresh this list when the analytics ranking shifts.
 */
const TOP_SEARCHED_HREFS: string[] = [
  "/calculators/rent-vs-buy-immigrant", // Rent vs. Buy Calculator for Visa Holders
  "/immigration-tracker", // NRI Immigration Tracker
  "/articles/what-happens-to-401k-leaving-usa", // Your 401(k) When You Move Back to India
  "/trump-account-h1b-immigrant-families", // Trump Accounts for H1B Visa Holders
  "/calculators/401k-return-to-india", // 401(k) Cash Out vs Keep Calculator
  "/articles/india-fd-vs-us-investments", // India FD vs US Investments for NRIs
  "/tools/green-card-tracker", // Green Card Wait Time Estimator
];

/** Most-viewed pages (from analytics), resolved to full search items in order. */
export const topSearched: SearchItem[] = TOP_SEARCHED_HREFS.map(
  (href) => indexByHref.get(href),
).filter((i): i is SearchItem => Boolean(i));

/** Lowercased haystack used for substring matching against a search item. */
export function searchItemHaystack(item: SearchItem): string {
  return `${item.title} ${item.description} ${item.type} ${item.keywords ?? ""}`.toLowerCase();
}

/**
 * Rank search results for a query. Empty query → the highest-priority items
 * (the curated high-value defaults). Otherwise substring match with a light
 * relevance boost for title/priority so flagship pages stay near the top.
 */
export function searchSite(query: string, limit = 10): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return searchIndex.filter((i) => i.priority > 0).slice(0, limit);
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = searchIndex
    .map((item) => {
      const hay = searchItemHaystack(item);
      const title = item.title.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (!hay.includes(term)) return null;
        if (title.includes(term)) score += 5;
        score += 1;
      }
      // Flagship / priority pages get a gentle lift so they lead the results.
      score += item.priority / 20;
      return { item, score };
    })
    .filter((x): x is { item: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.item);
}
