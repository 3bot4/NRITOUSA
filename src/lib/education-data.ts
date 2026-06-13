/**
 * Reference datasets and pure calculation logic for the US Education Hub.
 *
 * All figures are public, approximate, and educational. Calculators import the
 * pure functions here; the data constants double as on-page reference tables.
 * Refresh annually (see the "Content Update Schedule" in the project brief):
 *  - Tuition figures: NCES (College Board "Trends in College Pricing")
 *  - SAT percentiles: College Board year-end percentile report
 *  - Rankings: US News / QS (October)
 *  - Federal loan rate: set each July 1 by Congress
 *
 * Last reviewed: 2025 cycle (2024–25 figures).
 */

/* ====================================================================== *
 * 1. GRADE LEVEL FINDER
 * ====================================================================== */

export interface StateCutoff {
  state: string;
  /** Calendar cutoff a child must reach the entry age BY, in "MM-DD" form. */
  cutoff: string;
  /** Human label for the cutoff date. */
  label: string;
  note?: string;
}

/**
 * Kindergarten entry-age cutoff dates by state. A child must typically turn 5
 * by this date to start kindergarten that fall. Most states use September 1;
 * the notable exceptions (later cutoffs, "local option" states) are flagged.
 * Verify with the specific district — many districts set their own line.
 */
export const stateCutoffs: StateCutoff[] = [
  { state: "Alabama", cutoff: "09-01", label: "September 1" },
  { state: "Alaska", cutoff: "09-01", label: "September 1" },
  { state: "Arizona", cutoff: "09-01", label: "September 1" },
  { state: "Arkansas", cutoff: "08-01", label: "August 1" },
  { state: "California", cutoff: "09-01", label: "September 1", note: "Children turning 5 by Sept 1 enter kindergarten; younger 5-year-olds may qualify for Transitional Kindergarten (TK)." },
  { state: "Colorado", cutoff: "10-01", label: "October 1", note: "Set by local district; October 1 is common." },
  { state: "Connecticut", cutoff: "09-01", label: "September 1", note: "Moving to a Sept 1 cutoff; historically January 1." },
  { state: "Delaware", cutoff: "08-31", label: "August 31" },
  { state: "District of Columbia", cutoff: "09-30", label: "September 30" },
  { state: "Florida", cutoff: "09-01", label: "September 1" },
  { state: "Georgia", cutoff: "09-01", label: "September 1" },
  { state: "Hawaii", cutoff: "07-31", label: "July 31" },
  { state: "Idaho", cutoff: "09-01", label: "September 1" },
  { state: "Illinois", cutoff: "09-01", label: "September 1" },
  { state: "Indiana", cutoff: "08-01", label: "August 1", note: "Local district option; August 1 is common." },
  { state: "Iowa", cutoff: "09-15", label: "September 15" },
  { state: "Kansas", cutoff: "08-31", label: "August 31" },
  { state: "Kentucky", cutoff: "08-01", label: "August 1" },
  { state: "Louisiana", cutoff: "09-30", label: "September 30" },
  { state: "Maine", cutoff: "10-15", label: "October 15", note: "Local district option." },
  { state: "Maryland", cutoff: "09-01", label: "September 1" },
  { state: "Massachusetts", cutoff: "09-01", label: "September 1", note: "Set by local district; varies widely." },
  { state: "Michigan", cutoff: "12-01", label: "December 1", note: "Late cutoff — children can be 4 turning 5 by December 1." },
  { state: "Minnesota", cutoff: "09-01", label: "September 1" },
  { state: "Mississippi", cutoff: "09-01", label: "September 1" },
  { state: "Missouri", cutoff: "08-01", label: "August 1" },
  { state: "Montana", cutoff: "09-10", label: "September 10" },
  { state: "Nebraska", cutoff: "07-31", label: "July 31" },
  { state: "Nevada", cutoff: "09-30", label: "September 30" },
  { state: "New Hampshire", cutoff: "09-30", label: "September 30", note: "Local district option." },
  { state: "New Jersey", cutoff: "10-01", label: "October 1", note: "Set by local district; October 1 is common." },
  { state: "New Mexico", cutoff: "09-01", label: "September 1" },
  { state: "New York", cutoff: "12-01", label: "December 1", note: "Set by local district; December 1 is common, NYC uses the calendar year." },
  { state: "North Carolina", cutoff: "08-31", label: "August 31" },
  { state: "North Dakota", cutoff: "07-31", label: "July 31" },
  { state: "Ohio", cutoff: "09-30", label: "September 30", note: "Local district option; August 1–September 30 range." },
  { state: "Oklahoma", cutoff: "09-01", label: "September 1" },
  { state: "Oregon", cutoff: "09-01", label: "September 1" },
  { state: "Pennsylvania", cutoff: "09-01", label: "September 1", note: "Set by local district; varies widely." },
  { state: "Rhode Island", cutoff: "09-01", label: "September 1" },
  { state: "South Carolina", cutoff: "09-01", label: "September 1" },
  { state: "South Dakota", cutoff: "09-01", label: "September 1" },
  { state: "Tennessee", cutoff: "08-15", label: "August 15" },
  { state: "Texas", cutoff: "09-01", label: "September 1" },
  { state: "Utah", cutoff: "09-01", label: "September 1" },
  { state: "Vermont", cutoff: "09-01", label: "September 1", note: "Local district option." },
  { state: "Virginia", cutoff: "09-30", label: "September 30" },
  { state: "Washington", cutoff: "08-31", label: "August 31" },
  { state: "West Virginia", cutoff: "09-01", label: "September 1" },
  { state: "Wisconsin", cutoff: "09-01", label: "September 1" },
  { state: "Wyoming", cutoff: "09-15", label: "September 15" },
];

export interface GradeResult {
  /** Grade label: "Pre-K", "Kindergarten", "1st"… "12th", or beyond. */
  grade: string;
  /** Numeric grade for sorting: -1 = Pre-K, 0 = K, 1..12, 13 = graduated. */
  gradeNum: number;
  stage: "Preschool / Pre-K" | "Elementary" | "Middle School" | "High School" | "Post–high school";
  ageYears: number;
  ageMonths: number;
  /** Whether the child meets the chosen state's kindergarten cutoff this year. */
  meetsCutoff: boolean;
  cutoffLabel: string;
  note: string;
}

const ORDINALS = [
  "Kindergarten", "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th",
];

function stageFor(gradeNum: number): GradeResult["stage"] {
  if (gradeNum < 0) return "Preschool / Pre-K";
  if (gradeNum <= 5) return "Elementary";
  if (gradeNum <= 8) return "Middle School";
  if (gradeNum <= 12) return "High School";
  return "Post–high school";
}

/**
 * Estimate the US grade a child enters in the school year that begins in the
 * fall on or after `asOf`. Kindergarten begins the fall a child has turned 5
 * by the state cutoff; each subsequent grade adds a year.
 */
export function findGrade(
  dob: Date,
  asOf: Date,
  cutoff: StateCutoff
): GradeResult {
  // The fall term we're placing the child into: if we're already past ~July,
  // assume the upcoming/ current academic year that starts this fall.
  const schoolYearStart =
    asOf.getMonth() >= 6 ? asOf.getFullYear() : asOf.getFullYear() - 1;

  const [cm, cd] = cutoff.cutoff.split("-").map(Number);
  const cutoffDate = new Date(schoolYearStart, cm - 1, cd);

  // Age (in years) on this school year's cutoff date.
  let ageOnCutoff = schoolYearStart - dob.getFullYear();
  const beforeBirthday =
    cutoffDate.getMonth() < dob.getMonth() ||
    (cutoffDate.getMonth() === dob.getMonth() &&
      cutoffDate.getDate() < dob.getDate());
  if (beforeBirthday) ageOnCutoff -= 1;

  // Child enters kindergarten the fall they have turned 5 by the cutoff →
  // grade number = ageOnCutoff - 5 (K = 0).
  const gradeNum = ageOnCutoff - 5;

  // Current real age (for display).
  let ageYears = asOf.getFullYear() - dob.getFullYear();
  let ageMonths = asOf.getMonth() - dob.getMonth();
  if (asOf.getDate() < dob.getDate()) ageMonths -= 1;
  if (ageMonths < 0) {
    ageYears -= 1;
    ageMonths += 12;
  }

  let grade: string;
  if (gradeNum < -1) grade = "Too young for school";
  else if (gradeNum === -1) grade = "Pre-K";
  else if (gradeNum <= 12) grade = ORDINALS[gradeNum];
  else grade = "Graduated high school";

  const meetsCutoff = gradeNum >= 0 && gradeNum <= 12;

  let note: string;
  if (gradeNum < -1) {
    note = "Your child is below typical preschool age. Many states offer pre-K from age 3–4.";
  } else if (gradeNum === -1) {
    note = `Your child is pre-kindergarten age. They would start kindergarten next fall if they turn 5 by ${cutoff.label}.`;
  } else if (gradeNum === 0) {
    note = `Your child reaches kindergarten age this fall under ${cutoff.state}'s ${cutoff.label} cutoff.`;
  } else if (gradeNum > 12) {
    note = "Your child is past the standard K–12 range — explore college, GED, or community college options.";
  } else {
    note = `Based on a ${cutoff.label} cutoff in ${cutoff.state}. Districts can place individual children differently after assessment.`;
  }

  return {
    grade,
    gradeNum,
    stage: stageFor(gradeNum),
    ageYears,
    ageMonths,
    meetsCutoff,
    cutoffLabel: cutoff.label,
    note,
  };
}

/* ====================================================================== *
 * 2. GPA CALCULATOR
 * ====================================================================== */

export interface GradeScale {
  letter: string;
  points: number;
  percent: string;
}

/** Standard US 4.0 letter-grade scale (unweighted). */
export const gradeScale: GradeScale[] = [
  { letter: "A+", points: 4.0, percent: "97–100" },
  { letter: "A", points: 4.0, percent: "93–96" },
  { letter: "A−", points: 3.7, percent: "90–92" },
  { letter: "B+", points: 3.3, percent: "87–89" },
  { letter: "B", points: 3.0, percent: "83–86" },
  { letter: "B−", points: 2.7, percent: "80–82" },
  { letter: "C+", points: 2.3, percent: "77–79" },
  { letter: "C", points: 2.0, percent: "73–76" },
  { letter: "C−", points: 1.7, percent: "70–72" },
  { letter: "D+", points: 1.3, percent: "67–69" },
  { letter: "D", points: 1.0, percent: "63–66" },
  { letter: "D−", points: 0.7, percent: "60–62" },
  { letter: "F", points: 0.0, percent: "Below 60" },
];

export const gradePoints: Record<string, number> = Object.fromEntries(
  gradeScale.map((g) => [g.letter, g.points])
);

export type CourseLevel = "regular" | "honors" | "ap-ib";

/** Weighted-GPA bonus added to the base grade points. */
export const levelBonus: Record<CourseLevel, number> = {
  regular: 0,
  honors: 0.5,
  "ap-ib": 1.0,
};

export interface Course {
  id: string;
  name: string;
  grade: string; // letter
  credits: number;
  level: CourseLevel;
}

export interface GpaResult {
  unweighted: number;
  weighted: number;
  totalCredits: number;
  band: "low" | "fair" | "good" | "excellent";
}

export function computeGpa(courses: Course[]): GpaResult {
  let qpUnweighted = 0;
  let qpWeighted = 0;
  let credits = 0;

  for (const c of courses) {
    const base = gradePoints[c.grade];
    if (base === undefined || !(c.credits > 0)) continue;
    credits += c.credits;
    qpUnweighted += base * c.credits;
    // Weighted: bonus only applies to passing grades (D− and above).
    const weighted = base > 0 ? Math.min(base + levelBonus[c.level], 5.0) : base;
    qpWeighted += weighted * c.credits;
  }

  const unweighted = credits > 0 ? qpUnweighted / credits : 0;
  const weighted = credits > 0 ? qpWeighted / credits : 0;

  const band: GpaResult["band"] =
    unweighted >= 3.5 ? "excellent"
      : unweighted >= 3.0 ? "good"
        : unweighted >= 2.0 ? "fair"
          : "low";

  return {
    unweighted: Math.round(unweighted * 1000) / 1000,
    weighted: Math.round(weighted * 1000) / 1000,
    totalCredits: credits,
    band,
  };
}

/** GPA benchmarks for well-known schools (median admitted, approximate). */
export const collegeGpaTargets: { school: string; gpa: string }[] = [
  { school: "Ivy League / Stanford / MIT", gpa: "3.9–4.0 (often 4.0+ weighted)" },
  { school: "Top 25 universities", gpa: "3.8–3.95" },
  { school: "Top 50 universities", gpa: "3.6–3.85" },
  { school: "Strong state flagships", gpa: "3.4–3.7" },
  { school: "Most 4-year colleges", gpa: "3.0–3.4" },
  { school: "Open-admission / community college", gpa: "2.0+ (or none required)" },
];

/* ====================================================================== *
 * 3. SAT SCORE & COLLEGE FIT
 * ====================================================================== */

/**
 * Total-score → national percentile anchors (College Board 2024, approximate).
 * `satPercentile` interpolates between these. Section scores are 200–800 each;
 * total is 400–1600.
 */
const satPercentileAnchors: [score: number, percentile: number][] = [
  [400, 1], [600, 3], [700, 6], [800, 9], [900, 16], [1000, 25],
  [1050, 31], [1100, 38], [1150, 46], [1200, 55], [1250, 63],
  [1300, 71], [1350, 78], [1400, 84], [1450, 90], [1500, 95],
  [1550, 98], [1600, 99],
];

/** Approximate national percentile for a total SAT score (400–1600). */
export function satPercentile(total: number): number {
  const a = satPercentileAnchors;
  if (total <= a[0][0]) return a[0][1];
  if (total >= a[a.length - 1][0]) return a[a.length - 1][1];
  for (let i = 0; i < a.length - 1; i++) {
    const [s0, p0] = a[i];
    const [s1, p1] = a[i + 1];
    if (total >= s0 && total <= s1) {
      const t = (total - s0) / (s1 - s0);
      return Math.round(p0 + t * (p1 - p0));
    }
  }
  return 50;
}

export interface SatFit {
  tier: string;
  band: "reach" | "strong" | "solid" | "broad" | "transfer";
  blurb: string;
  examples: string;
}

export function satFit(total: number): SatFit {
  if (total >= 1500)
    return {
      tier: "Ivy League / MIT / Stanford competitive",
      band: "reach",
      blurb: "This score is in range for the most selective schools in the country. Scores alone never guarantee admission here — essays, rigor, and extracurriculars decide it — but you clear the academic bar.",
      examples: "Harvard, MIT, Stanford, Princeton, Yale, Caltech",
    };
  if (total >= 1400)
    return {
      tier: "Top 50 universities",
      band: "strong",
      blurb: "A strong score that's competitive at top-50 national universities and many top liberal-arts colleges. Pair it with a strong GPA and you're a serious applicant.",
      examples: "UCLA, Michigan, NYU, Georgia Tech, UNC, Wisconsin",
    };
  if (total >= 1300)
    return {
      tier: "Strong state schools & merit scholarships",
      band: "solid",
      blurb: "A solid score that opens most large public flagships and frequently triggers automatic merit scholarships at many universities — real money off the sticker price.",
      examples: "Purdue, Ohio State, Arizona State (honors), UT Dallas",
    };
  if (total >= 1200)
    return {
      tier: "Most four-year colleges",
      band: "broad",
      blurb: "Above the national average and accepted at the majority of four-year colleges. Strong applications and a good GPA can still reach higher-ranked schools.",
      examples: "Most public regional universities and private colleges",
    };
  return {
    tier: "Community college → transfer path recommended",
    band: "transfer",
    blurb: "Many students start at community college, raise their GPA, and transfer to a four-year university — often saving tens of thousands of dollars. A retake after free Khan Academy prep can also lift this fast.",
    examples: "Community college → UC / state flagship transfer",
  };
}

/* ====================================================================== *
 * 4. TUITION / COLLEGE COST CALCULATOR
 * ====================================================================== */

export interface CollegeType {
  key: string;
  label: string;
  tuition: number;
  roomBoard: number;
}

/** 2024–25 published national averages (College Board, approximate). */
export const collegeTypes: CollegeType[] = [
  { key: "public-in", label: "Public, in-state", tuition: 11610, roomBoard: 13200 },
  { key: "public-out", label: "Public, out-of-state", tuition: 30780, roomBoard: 13200 },
  { key: "private", label: "Private nonprofit", tuition: 43505, roomBoard: 16800 },
  { key: "community", label: "Community college", tuition: 3900, roomBoard: 0 },
  { key: "ivy", label: "Ivy League (avg)", tuition: 68000, roomBoard: 19000 },
];

export const BOOKS_FEES_PER_YEAR = 1200;
/** Federal undergraduate Direct Loan interest rate (set each July 1). */
export const FED_LOAN_RATE = 0.065;

export interface TuitionInputs {
  typeKey: string;
  years: number;
  inflation: number; // e.g. 0.04
  aidPerYear: number;
  loanTermYears: number; // standard repayment, default 10
}

export interface TuitionResult {
  year1Tuition: number;
  roomBoardYear1: number;
  booksFees: number;
  totalTuition: number;
  totalRoomBoard: number;
  totalBooks: number;
  grossTotal: number;
  totalAid: number;
  netTotal: number;
  monthlyLoanPayment: number;
}

export function projectTuition(inp: TuitionInputs): TuitionResult {
  const type = collegeTypes.find((t) => t.key === inp.typeKey) ?? collegeTypes[0];
  const years = Math.max(1, Math.min(8, inp.years));

  let totalTuition = 0;
  let totalRoomBoard = 0;
  let totalBooks = 0;
  for (let y = 0; y < years; y++) {
    const factor = Math.pow(1 + inp.inflation, y);
    totalTuition += type.tuition * factor;
    totalRoomBoard += type.roomBoard * factor;
    totalBooks += BOOKS_FEES_PER_YEAR * factor;
  }

  const grossTotal = totalTuition + totalRoomBoard + totalBooks;
  const totalAid = Math.min(inp.aidPerYear * years, grossTotal);
  const netTotal = Math.max(0, grossTotal - totalAid);

  // Standard amortized monthly payment on the net (borrowed) amount.
  const r = FED_LOAN_RATE / 12;
  const n = inp.loanTermYears * 12;
  const monthlyLoanPayment =
    netTotal > 0 && r > 0
      ? (netTotal * r) / (1 - Math.pow(1 + r, -n))
      : netTotal / n;

  return {
    year1Tuition: Math.round(type.tuition),
    roomBoardYear1: Math.round(type.roomBoard),
    booksFees: BOOKS_FEES_PER_YEAR,
    totalTuition: Math.round(totalTuition),
    totalRoomBoard: Math.round(totalRoomBoard),
    totalBooks: Math.round(totalBooks),
    grossTotal: Math.round(grossTotal),
    totalAid: Math.round(totalAid),
    netTotal: Math.round(netTotal),
    monthlyLoanPayment: Math.round(monthlyLoanPayment),
  };
}

/* ====================================================================== *
 * 5. COLLEGE RANKINGS EXPLORER
 * ====================================================================== */

export interface College {
  rank: number;
  name: string;
  state: string;
  type: "Public" | "Private";
  /** Acceptance rate as a percentage. */
  acceptance: number;
  /** Approximate middle-50% SAT midpoint. */
  avgSat: number;
  inState: number;
  outState: number;
  /** Category tags for filtering. */
  tags: CollegeTag[];
  notableFor: string;
}

export type CollegeTag =
  | "cs"
  | "engineering"
  | "business"
  | "value"
  | "affordable-public"
  | "liberal-arts"
  | "ivy";

/** Approximate 2025 figures (US News / QS blend). Tuition is published rate. */
export const colleges: College[] = [
  { rank: 1, name: "Princeton University", state: "NJ", type: "Private", acceptance: 4, avgSat: 1540, inState: 59710, outState: 59710, tags: ["ivy", "engineering", "liberal-arts"], notableFor: "Overall" },
  { rank: 2, name: "MIT", state: "MA", type: "Private", acceptance: 4, avgSat: 1555, inState: 60156, outState: 60156, tags: ["cs", "engineering"], notableFor: "STEM" },
  { rank: 3, name: "Harvard University", state: "MA", type: "Private", acceptance: 3, avgSat: 1550, inState: 59076, outState: 59076, tags: ["ivy", "business", "liberal-arts"], notableFor: "Overall" },
  { rank: 4, name: "Stanford University", state: "CA", type: "Private", acceptance: 4, avgSat: 1545, inState: 62484, outState: 62484, tags: ["cs", "engineering", "business"], notableFor: "STEM" },
  { rank: 5, name: "Yale University", state: "CT", type: "Private", acceptance: 5, avgSat: 1540, inState: 64700, outState: 64700, tags: ["ivy", "liberal-arts"], notableFor: "Liberal Arts" },
  { rank: 6, name: "Caltech", state: "CA", type: "Private", acceptance: 3, avgSat: 1560, inState: 60864, outState: 60864, tags: ["cs", "engineering"], notableFor: "STEM" },
  { rank: 7, name: "Duke University", state: "NC", type: "Private", acceptance: 6, avgSat: 1530, inState: 63450, outState: 63450, tags: ["engineering", "business"], notableFor: "Overall" },
  { rank: 8, name: "Johns Hopkins University", state: "MD", type: "Private", acceptance: 7, avgSat: 1530, inState: 63340, outState: 63340, tags: ["engineering"], notableFor: "Medicine & Research" },
  { rank: 9, name: "Northwestern University", state: "IL", type: "Private", acceptance: 7, avgSat: 1525, inState: 65997, outState: 65997, tags: ["business", "engineering"], notableFor: "Overall" },
  { rank: 10, name: "University of Pennsylvania", state: "PA", type: "Private", acceptance: 6, avgSat: 1530, inState: 66104, outState: 66104, tags: ["ivy", "business"], notableFor: "Business (Wharton)" },
  { rank: 11, name: "Cornell University", state: "NY", type: "Private", acceptance: 7, avgSat: 1520, inState: 68380, outState: 68380, tags: ["ivy", "cs", "engineering"], notableFor: "Engineering" },
  { rank: 12, name: "University of Chicago", state: "IL", type: "Private", acceptance: 5, avgSat: 1540, inState: 65619, outState: 65619, tags: ["business", "liberal-arts"], notableFor: "Economics" },
  { rank: 13, name: "Columbia University", state: "NY", type: "Private", acceptance: 4, avgSat: 1535, inState: 68400, outState: 68400, tags: ["ivy", "business"], notableFor: "Overall" },
  { rank: 14, name: "UC Berkeley", state: "CA", type: "Public", acceptance: 11, avgSat: 1430, inState: 15247, outState: 49281, tags: ["cs", "engineering", "business", "value", "affordable-public"], notableFor: "STEM & Value" },
  { rank: 15, name: "UCLA", state: "CA", type: "Public", acceptance: 9, avgSat: 1420, inState: 13804, outState: 46326, tags: ["business", "value", "affordable-public"], notableFor: "Value" },
  { rank: 16, name: "Rice University", state: "TX", type: "Private", acceptance: 8, avgSat: 1530, inState: 58128, outState: 58128, tags: ["engineering", "value"], notableFor: "Engineering" },
  { rank: 17, name: "University of Michigan", state: "MI", type: "Public", acceptance: 18, avgSat: 1450, inState: 17228, outState: 60946, tags: ["cs", "engineering", "business", "affordable-public"], notableFor: "STEM" },
  { rank: 18, name: "Carnegie Mellon University", state: "PA", type: "Private", acceptance: 11, avgSat: 1540, inState: 63829, outState: 63829, tags: ["cs", "engineering"], notableFor: "Computer Science" },
  { rank: 19, name: "University of Notre Dame", state: "IN", type: "Private", acceptance: 12, avgSat: 1500, inState: 62693, outState: 62693, tags: ["business", "engineering"], notableFor: "Business" },
  { rank: 20, name: "Georgia Tech", state: "GA", type: "Public", acceptance: 16, avgSat: 1450, inState: 10558, outState: 31370, tags: ["cs", "engineering", "value", "affordable-public"], notableFor: "Engineering & Value" },
  { rank: 21, name: "University of Texas at Austin", state: "TX", type: "Public", acceptance: 29, avgSat: 1370, inState: 11448, outState: 40582, tags: ["cs", "engineering", "business", "value", "affordable-public"], notableFor: "STEM & Value" },
  { rank: 22, name: "University of Illinois Urbana-Champaign", state: "IL", type: "Public", acceptance: 45, avgSat: 1420, inState: 17640, outState: 36068, tags: ["cs", "engineering", "value", "affordable-public"], notableFor: "Computer Science" },
  { rank: 23, name: "University of Washington", state: "WA", type: "Public", acceptance: 48, avgSat: 1380, inState: 12643, outState: 41997, tags: ["cs", "engineering", "value", "affordable-public"], notableFor: "Computer Science" },
  { rank: 24, name: "Purdue University", state: "IN", type: "Public", acceptance: 50, avgSat: 1330, inState: 9992, outState: 28794, tags: ["cs", "engineering", "value", "affordable-public"], notableFor: "Engineering & Value" },
  { rank: 25, name: "University of Wisconsin–Madison", state: "WI", type: "Public", acceptance: 49, avgSat: 1370, inState: 11205, outState: 41265, tags: ["engineering", "business", "affordable-public"], notableFor: "Overall Value" },
  { rank: 30, name: "UC San Diego", state: "CA", type: "Public", acceptance: 24, avgSat: 1370, inState: 15730, outState: 49764, tags: ["cs", "engineering", "value", "affordable-public"], notableFor: "STEM" },
  { rank: 35, name: "Rensselaer Polytechnic Institute", state: "NY", type: "Private", acceptance: 65, avgSat: 1420, inState: 62484, outState: 62484, tags: ["engineering"], notableFor: "Engineering" },
  { rank: 40, name: "Arizona State University", state: "AZ", type: "Public", acceptance: 90, avgSat: 1240, inState: 12473, outState: 32193, tags: ["engineering", "affordable-public", "value"], notableFor: "Accessible & Value" },
];

export interface CategoryList {
  tag: CollegeTag;
  title: string;
  blurb: string;
}

export const collegeCategories: CategoryList[] = [
  { tag: "cs", title: "Top for Computer Science", blurb: "Strongest CS departments and recruiting pipelines." },
  { tag: "engineering", title: "Top for Engineering", blurb: "Leading engineering programs across disciplines." },
  { tag: "business", title: "Top for Business", blurb: "Best undergraduate business and MBA-feeder schools." },
  { tag: "affordable-public", title: "Affordable Public Universities", blurb: "Public flagships with strong rankings and lower in-state cost." },
  { tag: "value", title: "Best Value Picks", blurb: "High ranking relative to cost — strong return on tuition." },
];

export function collegesByTag(tag: CollegeTag): College[] {
  return colleges
    .filter((c) => c.tags.includes(tag))
    .sort((a, b) => a.rank - b.rank);
}
