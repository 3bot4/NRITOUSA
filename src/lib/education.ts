/**
 * US Education Hub catalog. Powers the /education hub, the per-calculator
 * heroes, internal links, and the sitemap. Mirrors the shape of lib/tools so
 * the existing hero/card patterns drop in unchanged.
 *
 * Everything in /education is 100% client-side and informational: calculators
 * compute in the browser from the typed reference datasets in lib/education-data.
 * No database is involved and nothing is submitted anywhere.
 */

export interface EduCalc {
  slug: string;
  /** Full title used in the page hero and <h1> */
  title: string;
  /** Short label for cards / breadcrumbs */
  label: string;
  description: string;
  icon: string;
  /** Tailwind gradient for the hero + icon tile */
  accent: string;
  seoTitle: string;
  seoDescription: string;
  /** Article slugs this calculator links out to (must exist in lib/articles) */
  relatedArticles: string[];
}

export const eduCalcs: EduCalc[] = [
  {
    slug: "grade-finder",
    title: "US Grade Level Finder for Immigrant Families",
    label: "Grade Finder",
    description:
      "Enter your child's date of birth to see which US grade they belong in, the school stage (elementary, middle, or high), and your state's kindergarten cutoff date — plus exactly what documents you need to enroll.",
    icon: "🎒",
    accent: "from-sky-500 to-blue-600",
    seoTitle: "What Grade Is My Child In? US Finder (2025)",
    seoDescription:
      "Find your child's US grade level by date of birth, with every state's kindergarten cutoff, the K-12 age chart, and an enrollment checklist.",
    relatedArticles: [
      "us-school-system-guide-immigrants",
      "college-tuition-immigrants-2025",
    ],
  },
  {
    slug: "gpa-calculator",
    title: "US GPA Calculator (Weighted & Unweighted)",
    label: "GPA Calculator",
    description:
      "Add your courses, letter grades, and credit hours to get your unweighted 4.0 GPA and your weighted GPA with AP/IB and Honors bonuses — plus how your number compares to what top colleges expect.",
    icon: "📊",
    accent: "from-violet-500 to-purple-600",
    seoTitle: "GPA Calculator: Weighted & Unweighted (2025)",
    seoDescription:
      "Free US GPA calculator for weighted and unweighted GPA on the 4.0 scale, with a letter-grade table, AP/IB/Honors weighting, and college targets.",
    relatedArticles: [
      "us-school-system-guide-immigrants",
      "sat-act-guide-immigrant-students-2025",
    ],
  },
  {
    slug: "sat-guide",
    title: "SAT Score & College Fit Tool",
    label: "SAT Guide",
    description:
      "Move the sliders for your Math and Reading & Writing scores to see your total SAT score, approximate national percentile, and the tier of colleges where that score is competitive.",
    icon: "✏️",
    accent: "from-rose-500 to-pink-600",
    seoTitle: "SAT Score Calculator & College Fit (2025)",
    seoDescription:
      "See your total SAT score, national percentile, and which colleges fit your score — from Ivy League to transfer paths. Includes digital SAT 2025.",
    relatedArticles: [
      "sat-act-guide-immigrant-students-2025",
      "best-colleges-indian-immigrants-usa",
    ],
  },
  {
    slug: "tuition-calculator",
    title: "US College Cost Calculator for Immigrant Families",
    label: "Tuition Calculator",
    description:
      "Project the full four-year cost of college by school type, with tuition inflation, room and board, books and fees, financial aid, and an estimated monthly loan payment — built on 2024–25 national averages.",
    icon: "💰",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "College Cost Calculator: In vs Out-State",
    seoDescription:
      "Calculate total US college cost by school type with tuition inflation, room and board, and aid — plus in-state rules and FAFSA eligibility.",
    relatedArticles: [
      "college-tuition-immigrants-2025",
      "best-colleges-indian-immigrants-usa",
    ],
  },
  {
    slug: "college-rankings",
    title: "US College Rankings Explorer",
    label: "College Rankings",
    description:
      "Sort and filter the top US universities by ranking, acceptance rate, and in-state or out-of-state tuition — with category lists for computer science, engineering, business, value picks, and affordable public schools.",
    icon: "🏛️",
    accent: "from-amber-500 to-orange-600",
    seoTitle: "US College Rankings Explorer (2025)",
    seoDescription:
      "Explore and filter top US universities by ranking, acceptance rate, and tuition, with lists for CS, engineering, business, and value picks.",
    relatedArticles: [
      "best-colleges-indian-immigrants-usa",
      "college-tuition-immigrants-2025",
    ],
  },
];

export function getEduCalc(slug: string): EduCalc | undefined {
  return eduCalcs.find((c) => c.slug === slug);
}

export const eduPath = (slug?: string) =>
  slug ? `/education/${slug}` : "/education";

/** The four long-form education guides surfaced on the hub + articles page. */
export const eduArticleSlugs = [
  "college-tuition-immigrants-2025",
  "us-school-system-guide-immigrants",
  "sat-act-guide-immigrant-students-2025",
  "best-colleges-indian-immigrants-usa",
];
