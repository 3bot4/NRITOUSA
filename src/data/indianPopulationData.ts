/**
 * Data for the "Indian Population in USA" SEO data hub.
 *
 * IMPORTANT — sourcing rules for this file:
 *  - National totals are rounded estimates drawn from Pew Research Center
 *    (2021–2023 ACS/IPUMS analysis), the U.S. Census Bureau 2020 Census, and
 *    the Migration Policy Institute. Exact figures vary by definition
 *    ("Asian Indian alone", "Indian alone or in combination", "Indian
 *    immigrant", "Indian-born", "Indian-origin").
 *  - State-level values are relative concentrations / rankings, NOT exact
 *    counts, unless an exact ACS figure is cited. They are labelled as
 *    estimates so the page never overstates precision.
 *  - Never invent a "highest taxpayer" style claim. Income/tax language is
 *    kept to sourced, hedged phrasing.
 */

export const INDIAN_POP_UPDATED = "2026-07-05";
export const INDIAN_POP_UPDATED_HUMAN = "July 5, 2026";
export const INDIAN_POP_PUBLISHED = "2026-07-05";

/* ------------------------------------------------------------------ *
 * Headline numbers
 * ------------------------------------------------------------------ */

export interface QuickStat {
  label: string;
  value: string;
  note: string;
}

export const quickStats: QuickStat[] = [
  {
    label: "Indian-origin population in U.S.",
    value: "≈ 4.9M",
    note: "Indian alone or in combination (Pew, 2021–2023 ACS/IPUMS).",
  },
  {
    label: "Growth since 2000",
    value: "≈ 174%",
    note: "Up from about 1.8M in 2000 (Pew).",
  },
  {
    label: "2020 Census — Asian Indian alone",
    value: "≈ 4.4M",
    note: "4,397,737 recorded; up 50%+ from 2010 (U.S. Census Bureau).",
  },
  {
    label: "Indian immigrants (foreign-born)",
    value: "≈ 3.2M",
    note: "One of the largest immigrant-origin groups (MPI).",
  },
];

export const keyStates = ["CA", "TX", "NJ", "NY", "IL", "WA", "GA"];

export const majorMetros = [
  "New York / New Jersey",
  "San Francisco Bay Area",
  "Dallas–Fort Worth",
  "Chicago",
  "Seattle",
  "Washington, DC",
  "Atlanta",
  "Houston",
];

/* ------------------------------------------------------------------ *
 * Population growth timeline (for the line chart)
 * ------------------------------------------------------------------ */

export interface GrowthPoint {
  year: number;
  value: number; // millions
  label: string;
  basis: string;
}

export const growthTimeline: GrowthPoint[] = [
  { year: 2000, value: 1.8, label: "≈ 1.8M", basis: "Indian-origin (Pew)" },
  { year: 2010, value: 2.8, label: "≈ 2.8M", basis: "Asian Indian alone (Census, approx.)" },
  { year: 2020, value: 4.4, label: "≈ 4.4M", basis: "Asian Indian alone (2020 Census)" },
  { year: 2023, value: 4.9, label: "≈ 4.9M", basis: "Indian alone or in combination (Pew)" },
];

/* ------------------------------------------------------------------ *
 * State-level data — relative concentration, not exact counts
 * ------------------------------------------------------------------ */

export type Intensity = "veryHigh" | "high" | "growing" | "moderate";

export const intensityMeta: Record<
  Intensity,
  { label: string; cell: string; dot: string }
> = {
  veryHigh: {
    label: "Very high",
    cell: "bg-brand-600 text-white border-brand-700",
    dot: "bg-brand-600",
  },
  high: {
    label: "High",
    cell: "bg-brand-300 text-brand-950 border-brand-400",
    dot: "bg-brand-300",
  },
  growing: {
    label: "Growing",
    cell: "bg-accent-400/70 text-ink-900 border-accent-500/60",
    dot: "bg-accent-400",
  },
  moderate: {
    label: "Moderate / smaller",
    cell: "bg-slate-100 text-ink-600 border-slate-200",
    dot: "bg-slate-300",
  },
};

export interface StateInfo {
  code: string;
  name: string;
  rank: string;
  intensity: Intensity;
  metros: string;
  drivers: string;
  tooltip: string;
  /** Explorer category detail — all hedged, relative language. */
  population: string;
  income: string;
  occupation: string;
  education: string;
  students: string;
  visa: string;
  community: string;
}

export const states: StateInfo[] = [
  {
    code: "CA",
    name: "California",
    rank: "Very high",
    intensity: "veryHigh",
    metros: "SF Bay Area, Los Angeles, San Diego, Sacramento",
    drivers: "Tech, students, business, family immigration",
    tooltip:
      "California: Large Indian-origin population; strong tech, business, student, and family-based immigration communities.",
    population:
      "Typically ranked #1 for total Indian-origin residents. Estimate: verify with the latest ACS table.",
    income:
      "Bay Area Indian households are among the highest-earning metro cohorts, driven by senior tech and startup roles.",
    occupation:
      "Software engineering, product, data/AI, semiconductors, medicine, and venture-backed entrepreneurship.",
    education:
      "Very high share of graduate degrees, concentrated around Stanford, UC campuses, and tech employers.",
    students:
      "Major destination for Indian STEM students at UC and private universities feeding Bay Area employers.",
    visa:
      "Large H-1B and L-1 workforce plus a growing base of green card holders and naturalized citizens.",
    community:
      "Well-established Telugu, Tamil, Punjabi, Gujarati, and North Indian communities across the state.",
  },
  {
    code: "TX",
    name: "Texas",
    rank: "Very high / fast-growing",
    intensity: "veryHigh",
    metros: "Dallas–Fort Worth, Austin, Houston, San Antonio",
    drivers: "Tech, healthcare, business, students",
    tooltip:
      "Texas: Fast-growing Indian communities in Dallas, Austin, and Houston.",
    population:
      "Among the fastest-growing Indian populations in the U.S., especially in the Dallas suburbs. Estimate/range.",
    income:
      "Strong professional incomes with a lower cost of living than coastal metros, aiding homeownership.",
    occupation:
      "IT services, telecom, energy, healthcare, and a large small-business and franchise base.",
    education:
      "High share of engineering and business graduates; growing university enrollment.",
    students:
      "Rapidly rising Indian student numbers at UT, Texas A&M, UT-Dallas, and others.",
    visa:
      "Very large H-1B and consulting/IT-services workforce; strong movement to green cards over time.",
    community:
      "Prominent Telugu and Gujarati communities; active temples and cultural associations statewide.",
  },
  {
    code: "NJ",
    name: "New Jersey",
    rank: "Highest concentration (share of state)",
    intensity: "veryHigh",
    metros: "Edison, Jersey City, Iselin, Princeton corridor",
    drivers: "Family communities, professionals, business owners",
    tooltip:
      "New Jersey: One of the highest Indian-origin concentrations relative to state population.",
    population:
      "Consistently the highest Indian share of any state's population. Estimate; verify with ACS.",
    income:
      "High household incomes tied to NYC-area finance, pharma, and IT roles.",
    occupation:
      "Pharmaceuticals, finance, IT, medicine, and dense small-business ownership (Oak Tree Road corridor).",
    education:
      "Very high educational attainment; strong public-school outcomes in Indian-heavy townships.",
    students:
      "Feeder communities to Rutgers, NJIT, and NYC-area universities.",
    visa:
      "Large mix of long-settled citizens, green card holders, and H-1B professionals.",
    community:
      "Iconic Gujarati, Telugu, Tamil, Punjabi, and Malayali hubs — Edison/Iselin is a national landmark.",
  },
  {
    code: "NY",
    name: "New York",
    rank: "Very high",
    intensity: "veryHigh",
    metros: "New York City, Queens, Long Island",
    drivers: "Finance, healthcare, business, students",
    tooltip:
      "New York: Large Indian-origin population across NYC, Queens, and Long Island.",
    population:
      "One of the largest total Indian populations, centered on the NYC metro. Estimate/range.",
    income:
      "Wide income range — high-earning finance/medicine professionals alongside working-class and small-business families.",
    occupation:
      "Finance, medicine, healthcare, hospitality, retail/small business, and academia.",
    education:
      "Broad spread from elite graduate degrees to family-run enterprises.",
    students:
      "Major host for Indian students at NYU, Columbia, SUNY, and CUNY campuses.",
    visa:
      "Diverse status mix — long-settled citizens, green card holders, H-1B, and students.",
    community:
      "Historic Punjabi (Richmond Hill), Gujarati, Bengali, and South Indian communities.",
  },
  {
    code: "IL",
    name: "Illinois",
    rank: "High",
    intensity: "high",
    metros: "Chicago, Naperville, Schaumburg",
    drivers: "Tech, healthcare, business",
    tooltip: "Illinois: Strong Chicago-area Indian community.",
    population:
      "Large, established Chicago-area population, especially the western suburbs. Estimate/range.",
    income:
      "Strong professional incomes in the Naperville/Aurora corridor.",
    occupation:
      "IT, consulting, healthcare, finance, and a broad small-business base.",
    education:
      "High attainment; Naperville schools are a well-known draw for Indian families.",
    students:
      "Feeders to UIUC, University of Chicago, Northwestern, and UIC.",
    visa:
      "Balanced mix of citizens, green card holders, and H-1B workers.",
    community:
      "Devon Avenue in Chicago is a historic South Asian commercial hub; strong Gujarati and Telugu presence.",
  },
  {
    code: "WA",
    name: "Washington",
    rank: "High / growing",
    intensity: "high",
    metros: "Seattle, Bellevue, Redmond",
    drivers: "Tech",
    tooltip:
      "Washington: Tech-heavy Indian professional population in Seattle/Bellevue.",
    population:
      "Rapid growth driven by big-tech hiring on the Eastside. Estimate/range.",
    income:
      "Among the highest metro incomes, tied to senior software and cloud roles.",
    occupation:
      "Software engineering, cloud, program management, and data/AI at major tech employers.",
    education:
      "Very high share of graduate STEM degrees.",
    students:
      "Growing enrollment at UW and regional universities.",
    visa:
      "Heavily H-1B and L-1 in early career, converting to green cards over time.",
    community:
      "Fast-growing Telugu, Tamil, and North Indian tech communities in Bellevue/Redmond.",
  },
  {
    code: "GA",
    name: "Georgia",
    rank: "High / growing",
    intensity: "high",
    metros: "Atlanta metro (Alpharetta, Johns Creek)",
    drivers: "Tech, business, healthcare",
    tooltip:
      "Georgia: Fast-growing Atlanta-area Indian community in tech, business, and healthcare.",
    population:
      "Strong, growing Atlanta-metro population, especially north-side suburbs. Estimate/range.",
    income:
      "Solid professional incomes with lower housing costs than coastal hubs.",
    occupation:
      "IT, telecom, healthcare, logistics, and hospitality ownership.",
    education:
      "High attainment; Forsyth/Fulton county schools are popular with Indian families.",
    students:
      "Feeders to Georgia Tech, Emory, and Georgia State.",
    visa:
      "Growing H-1B base alongside established green card holders and citizens.",
    community:
      "Prominent Gujarati (hospitality), Telugu, and Tamil communities.",
  },
  {
    code: "FL",
    name: "Florida",
    rank: "Growing",
    intensity: "growing",
    metros: "Tampa, Orlando, Miami, Jacksonville",
    drivers: "Retirees, business, healthcare, students",
    tooltip:
      "Florida: Growing Indian communities in Tampa, Orlando, and Miami.",
    population:
      "Steadily growing, boosted by retirees and internal migration. Estimate/range.",
    income:
      "Mixed — professionals, business owners, and retirees.",
    occupation:
      "Healthcare, hospitality, business, IT, and small enterprise.",
    education: "Broad range of attainment.",
    students: "Rising enrollment at UF, USF, and UCF.",
    visa:
      "Notable share of retirees, family-sponsored immigrants, and settled citizens.",
    community:
      "Growing Gujarati (hospitality) and South Indian communities.",
  },
  {
    code: "VA",
    name: "Virginia",
    rank: "High (DC metro)",
    intensity: "high",
    metros: "Northern Virginia (Fairfax, Loudoun)",
    drivers: "Government contractors, tech, healthcare, students",
    tooltip:
      "Virginia: High Indian-origin population around the DC metro in tech and government-contracting roles.",
    population:
      "Dense Indian population in the Northern Virginia DC suburbs. Estimate/range.",
    income:
      "Very high household incomes tied to tech and federal contracting.",
    occupation:
      "IT, cybersecurity, consulting, medicine, and government contracting.",
    education:
      "Among the highest attainment nationally; top-ranked NoVA public schools.",
    students: "Feeders to George Mason, UVA, and Virginia Tech.",
    visa:
      "Mix of citizens, green card holders, and H-1B professionals.",
    community:
      "Large Telugu, Tamil, and North Indian communities across Fairfax and Loudoun.",
  },
  {
    code: "MD",
    name: "Maryland",
    rank: "High (DC metro)",
    intensity: "high",
    metros: "Montgomery County, Baltimore",
    drivers: "Healthcare, tech, government, students",
    tooltip:
      "Maryland: Strong Indian community in the DC suburbs, healthcare, and research.",
    population:
      "Established DC-suburb and Baltimore-area population. Estimate/range.",
    income: "High incomes in medicine, research, and tech.",
    occupation:
      "Medicine, biotech/NIH research, IT, and government.",
    education: "Very high attainment, including many physicians and researchers.",
    students: "Feeders to UMD and Johns Hopkins.",
    visa: "Long-settled citizens and green card holders plus H-1B professionals.",
    community: "Strong South Indian, Gujarati, and Punjabi communities.",
  },
  {
    code: "PA",
    name: "Pennsylvania",
    rank: "Moderate / growing",
    intensity: "growing",
    metros: "Philadelphia, Pittsburgh suburbs",
    drivers: "Medicine, academia, tech",
    tooltip:
      "Pennsylvania: Growing Indian community in medicine, academia, and tech near Philadelphia and Pittsburgh.",
    population: "Moderate but growing, centered on suburban Philadelphia. Estimate/range.",
    income: "Solid professional incomes in medicine and tech.",
    occupation: "Medicine, pharma, academia, and IT.",
    education: "High attainment near CMU, Penn, and Drexel.",
    students: "Feeders to Penn State, CMU, and Pitt.",
    visa: "Mix of citizens, green card holders, and H-1B workers.",
    community: "Established South Indian and Gujarati communities.",
  },
  {
    code: "MA",
    name: "Massachusetts",
    rank: "Moderate / high (per capita)",
    intensity: "high",
    metros: "Boston, Cambridge",
    drivers: "Academia, biotech, tech, students",
    tooltip:
      "Massachusetts: Research- and student-heavy Indian community around Boston and Cambridge.",
    population: "High per-capita concentration in the Boston research corridor. Estimate/range.",
    income: "High incomes in biotech, academia, and tech.",
    occupation: "Biotech, academia, medicine, and software.",
    education: "Among the highest attainment; MIT/Harvard/BU draw.",
    students: "One of the top student destinations in the U.S.",
    visa: "Student- and H-1B-heavy early on, moving to green cards.",
    community: "Research- and student-oriented South Indian and North Indian communities.",
  },
  {
    code: "MI",
    name: "Michigan",
    rank: "Moderate",
    intensity: "moderate",
    metros: "Detroit suburbs, Ann Arbor",
    drivers: "Automotive engineering, medicine, academia",
    tooltip:
      "Michigan: Engineering- and medicine-focused Indian community around Detroit and Ann Arbor.",
    population: "Long-established engineering/medicine community. Estimate/range.",
    income: "Solid professional incomes in engineering and medicine.",
    occupation: "Automotive/mechanical engineering, medicine, and academia.",
    education: "High attainment near the University of Michigan.",
    students: "Feeders to U-M and Michigan State.",
    visa: "Mix of long-settled citizens and H-1B professionals.",
    community: "Established Gujarati, Telugu, and North Indian communities.",
  },
  {
    code: "NC",
    name: "North Carolina",
    rank: "Growing",
    intensity: "growing",
    metros: "Raleigh–Durham (RTP), Charlotte",
    drivers: "Tech, research, healthcare",
    tooltip:
      "North Carolina: Fast-growing Indian tech and research community around the Research Triangle.",
    population: "Rapid growth in the Research Triangle and Charlotte. Estimate/range.",
    income: "Strong professional incomes with affordable housing.",
    occupation: "IT, biotech/research, banking, and healthcare.",
    education: "High attainment near Duke, UNC, and NC State.",
    students: "Growing enrollment across the Triangle universities.",
    visa: "Growing H-1B base plus settling green card holders.",
    community: "Growing Telugu, Tamil, and North Indian communities.",
  },
  {
    code: "AZ",
    name: "Arizona",
    rank: "Growing",
    intensity: "growing",
    metros: "Phoenix, Chandler, Tempe",
    drivers: "Tech, semiconductors, business",
    tooltip:
      "Arizona: Growing Indian tech and semiconductor community around Phoenix and Chandler.",
    population: "Growing, boosted by semiconductor and tech expansion. Estimate/range.",
    income: "Solid tech and professional incomes.",
    occupation: "Semiconductors, IT, business, and healthcare.",
    education: "High attainment near ASU and tech employers.",
    students: "Rising enrollment at ASU and University of Arizona.",
    visa: "Growing H-1B and green card population.",
    community: "Growing Telugu, Gujarati, and North Indian communities.",
  },
  {
    code: "OH",
    name: "Ohio",
    rank: "Moderate",
    intensity: "moderate",
    metros: "Columbus, Cincinnati, Cleveland",
    drivers: "Medicine, academia, IT",
    tooltip:
      "Ohio: Established Indian community in medicine, academia, and IT across major metros.",
    population: "Steady, long-established community. Estimate/range.",
    income: "Solid incomes in medicine and IT.",
    occupation: "Medicine, academia, IT, and business.",
    education: "High attainment near OSU and Case Western.",
    students: "Feeders to OSU and University of Cincinnati.",
    visa: "Mix of citizens, green card holders, and H-1B workers.",
    community: "Established South Indian and Gujarati communities.",
  },
];

/* ------------------------------------------------------------------ *
 * Explorer category filters
 * ------------------------------------------------------------------ */

export const explorerCategories: {
  key: keyof Pick<
    StateInfo,
    | "population"
    | "income"
    | "occupation"
    | "education"
    | "students"
    | "visa"
    | "community"
  >;
  label: string;
}[] = [
  { key: "population", label: "Population" },
  { key: "income", label: "Income" },
  { key: "occupation", label: "Occupation" },
  { key: "education", label: "Education" },
  { key: "students", label: "Students" },
  { key: "visa", label: "Visa / Immigration" },
  { key: "community", label: "Community notes" },
];

export const explorerDisclaimer =
  "State-level figures are based on the latest available ACS / Census / Pew / AAPI Data references where available. Some values are estimates, ranges, or rounded — verify against the current ACS table before citing an exact number.";

/* ------------------------------------------------------------------ *
 * Population-by-state table (sortable)
 * ------------------------------------------------------------------ */

export interface StateRow {
  state: string;
  rank: string;
  metros: string;
  drivers: string;
  notes: string;
}

export const stateTable: StateRow[] = [
  { state: "California", rank: "Very high", metros: "Bay Area, Los Angeles, San Diego", drivers: "Tech, students, business, family immigration", notes: "Typically the largest total Indian-origin population." },
  { state: "Texas", rank: "Very high / growing", metros: "Dallas, Austin, Houston", drivers: "Tech, healthcare, business, students", notes: "Among the fastest-growing communities." },
  { state: "New Jersey", rank: "Very high concentration", metros: "Edison, Jersey City, Iselin, Princeton", drivers: "Family communities, professionals, business owners", notes: "Highest Indian share of any state's population." },
  { state: "New York", rank: "Very high", metros: "NYC, Queens, Long Island", drivers: "Finance, healthcare, business, students", notes: "Large, diverse, long-established population." },
  { state: "Illinois", rank: "High", metros: "Chicago, Naperville", drivers: "Tech, healthcare, business", notes: "Historic Chicago-area community." },
  { state: "Washington", rank: "High / growing", metros: "Seattle, Bellevue, Redmond", drivers: "Tech", notes: "Big-tech-driven professional growth." },
  { state: "Georgia", rank: "High / growing", metros: "Atlanta", drivers: "Tech, business, healthcare", notes: "Fast-growing north-Atlanta suburbs." },
  { state: "Florida", rank: "Growing", metros: "Tampa, Orlando, Miami", drivers: "Retirees, business, healthcare, students", notes: "Boosted by retirees and internal migration." },
  { state: "Virginia / Maryland", rank: "High (DC metro)", metros: "NoVA, Montgomery County", drivers: "Government contractors, tech, healthcare, students", notes: "Dense, high-income DC-suburb communities." },
];

/* ------------------------------------------------------------------ *
 * Demographics cards
 * ------------------------------------------------------------------ */

export interface DemoCard {
  title: string;
  body: string;
}

export const demographics: DemoCard[] = [
  { title: "U.S.-born Indian Americans", body: "A large and growing second/third generation, especially in long-settled communities in New Jersey, California, New York, and Illinois. Exact share varies by source." },
  { title: "Indian immigrants (foreign-born)", body: "About 3.2 million foreign-born Indians live in the U.S. (MPI) — one of the largest immigrant-origin groups in the country." },
  { title: "Naturalized citizens", body: "Many Indian immigrants naturalize over time after years as green card holders; a substantial share of adults are U.S. citizens. Verify current rates with ACS/MPI." },
  { title: "Green card holders", body: "A large population of lawful permanent residents, many waiting years in the employment-based backlog before or after receiving a green card." },
  { title: "H-1B & employment visa workers", body: "Indian nationals receive the largest single-country share of H-1B approvals each year (USCIS), plus L-1, O-1, and other work visas." },
  { title: "F-1 students & recent grads", body: "Indian students are one of the two largest international student groups in the U.S. (Open Doors/IIE), many on OPT/STEM-OPT after graduation." },
  { title: "Family-sponsored & retirees", body: "Parents and relatives arrive through family-sponsored categories or long-stay visitor status, adding an older cohort to the community." },
  { title: "Business owners & professionals", body: "A dense layer of physicians, engineers, founders, franchisees, and hospitality owners across nearly every state." },
];

/* ------------------------------------------------------------------ *
 * Income distribution (illustrative bands, not exact percentages)
 * ------------------------------------------------------------------ */

export interface IncomeBand {
  label: string;
  weight: number; // 0–100, relative visual weight only (illustrative)
  note: string;
}

export const incomeBands: IncomeBand[] = [
  { label: "Students & new immigrants (lower income)", weight: 18, note: "Students on stipends, early-career arrivals, and family-support roles." },
  { label: "Middle-income professionals", weight: 30, note: "Salaried IT, healthcare support, engineering, and business staff." },
  { label: "Upper-middle-income families", weight: 30, note: "Dual-income professional households, common in tech and medicine hubs." },
  { label: "High-income tech / medicine / finance / business", weight: 22, note: "Senior engineers, physicians, executives, and business owners." },
];

export const incomeNote =
  "Illustrative distribution only — not exact ACS percentages. Pew Research Center reports Indian American households have among the highest median household incomes of any Asian-origin group in the U.S. High professional representation likely translates into significant federal, state, and local tax contributions, but no single official 'tax contribution' figure is published; treat that as an inference, not a stat.";

/** Sourced income/wealth numbers (approximate; verify against the source). */
export interface StatItem {
  value: string;
  label: string;
  source: string;
}

export const incomeStats: StatItem[] = [
  { value: "≈ $145,000", label: "Median household income for Indian Americans", source: "Pew Research Center" },
  { value: "≈ $75,000", label: "U.S. median household income (for comparison)", source: "U.S. Census Bureau" },
  { value: "≈ 6%", label: "Indian American poverty rate (vs ~12% U.S.)", source: "Pew Research Center" },
  { value: "Top group", label: "Among the highest-earning Asian-origin groups in the U.S.", source: "Pew Research Center" },
];

/* ------------------------------------------------------------------ *
 * Occupation clusters
 * ------------------------------------------------------------------ */

export interface OccupationCluster {
  label: string;
  icon: string;
  weight: number; // relative prominence, illustrative
  note: string;
}

export const occupations: OccupationCluster[] = [
  { label: "IT & software engineering", icon: "💻", weight: 100, note: "The single largest cluster — software, cloud, data/AI, and IT services." },
  { label: "Healthcare & medicine", icon: "🩺", weight: 78, note: "Physicians, nurses, pharmacists, and healthcare administrators." },
  { label: "Engineering", icon: "⚙️", weight: 62, note: "Semiconductors, mechanical, electrical, and civil engineering." },
  { label: "Finance & accounting", icon: "📈", weight: 55, note: "Banking, analysis, accounting, and fintech roles." },
  { label: "Academia & research", icon: "🔬", weight: 48, note: "University faculty, postdocs, and R&D scientists." },
  { label: "Small business & franchises", icon: "🏪", weight: 52, note: "Hospitality, retail, franchises, and services — a deep entrepreneurial base." },
  { label: "Startups & entrepreneurship", icon: "🚀", weight: 40, note: "Founders and executives across tech and services." },
  { label: "Students & early career", icon: "🎓", weight: 44, note: "F-1 students and OPT/STEM-OPT graduates entering the workforce." },
];

export const occupationNote =
  "Common occupational clusters, ranked qualitatively — not exact employment percentages. Shares vary by source, metro, and definition.";

/** Sourced demographic numbers (approximate; verify against the source). */
export const demographicStats: StatItem[] = [
  { value: "≈ 66%", label: "Foreign-born (immigrant) share of Indian Americans", source: "Pew Research Center" },
  { value: "≈ 75%", label: "Adults (25+) with a bachelor's degree or higher (vs ~34% U.S.)", source: "Pew Research Center" },
  { value: "≈ 79%", label: "Speak English proficiently", source: "Pew Research Center" },
  { value: "≈ 34", label: "Median age (years)", source: "U.S. Census / Pew" },
];

/** Sourced occupation number. */
export const occupationStat: StatItem = {
  value: "≈ 70%",
  label: "Work in management, business, science, and arts (professional) occupations — well above the U.S. average",
  source: "U.S. Census ACS / Pew",
};

/** Sourced student number. */
export const studentStats: StatItem[] = [
  { value: "≈ 331,600", label: "Indian students in the U.S. in 2023/24 — the #1 country of origin, surpassing China", source: "IIE Open Doors" },
  { value: "#1", label: "Largest source of international students in the U.S. (2023/24)", source: "IIE Open Doors" },
  { value: "≈ 29%", label: "Share of all international students in the U.S. who are from India", source: "IIE Open Doors" },
];

/** Sourced H-1B number. */
export const h1bStat: StatItem = {
  value: "≈ 72%",
  label: "Share of approved H-1B beneficiaries who are Indian nationals",
  source: "USCIS",
};

/* ------------------------------------------------------------------ *
 * Visa / immigration status
 * ------------------------------------------------------------------ */

export interface VisaCard {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
}

export const visaStatus: VisaCard[] = [
  { title: "H-1B workers", body: "Indian nationals consistently receive the largest single-country share of H-1B approvals each year (USCIS data). Many are in IT, engineering, and consulting.", href: "/h1b", linkLabel: "H-1B visa guide" },
  { title: "After an H-1B layoff", body: "Laid-off H-1B workers face a 60-day grace period to find a new sponsor, change status, or depart — a common concern given tech-sector volatility.", href: "/h1b-layoff", linkLabel: "H-1B layoff options" },
  { title: "F-1 students", body: "Indian students are one of the largest international student groups in the U.S. (Open Doors/IIE), many moving to OPT and then H-1B." },
  { title: "Green card holders", body: "A very large population of permanent residents, with Indian applicants facing the longest employment-based green card backlog of any country.", href: "/green-card", linkLabel: "Green card basics" },
  { title: "The green card backlog", body: "EB-2 and EB-3 priority dates for India can run years behind, so many Indians live and work here for a decade or more before adjusting status.", href: "/eb2-eb3-priority-date-india", linkLabel: "EB-2/EB-3 India dates" },
  { title: "Naturalized & U.S.-born citizens", body: "Many Indian immigrants naturalize after years as green card holders, and the U.S.-born second generation keeps growing." },
];

/* ------------------------------------------------------------------ *
 * Regional / language communities
 * ------------------------------------------------------------------ */

export interface CommunityCard {
  group: string;
  origin: string;
  body: string;
}

export const communities: CommunityCard[] = [
  { group: "Telugu", origin: "Andhra Pradesh & Telangana (Hyderabad)", body: "Very strong presence in tech, students, and H-1B pathways; large communities in Texas, California, New Jersey, and the DC metro." },
  { group: "Punjabi", origin: "Punjab", body: "Historic California roots (agriculture, trucking) plus small business and professionals in New York/New Jersey and beyond." },
  { group: "Gujarati", origin: "Gujarat", body: "Known for business, motel/hospitality ownership, and entrepreneurship — concentrated in New Jersey, Texas, Illinois, and Georgia." },
  { group: "Tamil", origin: "Tamil Nadu", body: "Strong in software, engineering, medicine, and academia across California, Texas, and the Northeast." },
  { group: "Malayali", origin: "Kerala", body: "Prominent in healthcare and nursing, often with Gulf-to-U.S. migration histories; families in Texas, New York, New Jersey, and Florida." },
  { group: "Bengali", origin: "West Bengal", body: "Well represented in academia, technology, medicine, and active cultural associations nationwide." },
  { group: "Marathi, Kannada, Hindi-belt & others", origin: "Maharashtra, Karnataka, North India, Rajasthan, Odisha", body: "Diverse professional communities across every major metro, with growing associations and cultural events." },
];

export const communitiesDisclaimer =
  "U.S. Census/ACS typically tracks ancestry, race, language spoken at home, and country of birth — not always Indian state of origin. This section describes common community patterns, not exact official counts.";

/* ------------------------------------------------------------------ *
 * Economic contribution
 * ------------------------------------------------------------------ */

export const economyPoints: { title: string; body: string }[] = [
  { title: "High-skilled labor", body: "Deep representation in technology, medicine, engineering, and finance — fields central to U.S. competitiveness." },
  { title: "Founders & executives", body: "Indian Americans lead and found companies across tech and services, including several of the largest U.S. firms." },
  { title: "Small business ownership", body: "A dense base of hospitality, retail, franchise, and service businesses that employ locally." },
  { title: "University ecosystems", body: "Indian international students pay significant tuition and sustain graduate programs and campus economies." },
  { title: "Essential services", body: "Physicians, nurses, and pharmacists deliver frontline care in communities across the country." },
  { title: "Tax & local spending", body: "High household incomes suggest significant federal, state, and local tax contributions, plus homeownership and local spending — an inference, not an official figure." },
  { title: "U.S.–India business", body: "Cross-border trade, investment, and IT-services links connect the two economies." },
];

export const economyCaveat =
  "Exact tax contribution by Indian Americans is not published as a simple official number. However, high household income, high educational attainment, and heavy professional employment suggest a strong fiscal contribution relative to the group's share of the population. Indian Americans are a small percentage of the U.S. population but have an outsized presence in technology, medicine, education, entrepreneurship, and high-skilled immigration.";

/* ------------------------------------------------------------------ *
 * World comparison
 * ------------------------------------------------------------------ */

export interface WorldCard {
  country: string;
  value: string;
  note: string;
}

export const worldComparison: WorldCard[] = [
  { country: "United States", value: "≈ 4.9M", note: "Indian-origin (Pew). Focus of this page." },
  { country: "Canada", value: "Large & growing", note: "One of the biggest Indian diasporas, concentrated in Ontario and BC. Verify with StatCan." },
  { country: "United Kingdom", value: "Large, long-established", note: "British Indians are among the largest UK ethnic-minority groups. Verify with ONS." },
  { country: "UAE / Gulf", value: "Very large", note: "Indians are a major share of the Gulf's expatriate workforce. Verify with local sources." },
  { country: "Australia", value: "Rapidly growing", note: "Indians are among the fastest-growing migrant communities. Verify with ABS." },
];

export const worldNote =
  "Comparative figures use different definitions and sources per country and are approximate. India's global diaspora is estimated in the tens of millions; this page focuses on the United States.";

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export const faqs: { question: string; answer: string }[] = [
  { question: "How many Indians live in America?", answer: "About 4.9 million people in the U.S. identify as Indian alone or in combination, based on Pew Research Center's analysis of 2021–2023 ACS/IPUMS data. The 2020 Census recorded about 4.4 million people as Asian Indian alone." },
  { question: "How many Indians live in the USA?", answer: "About 4.9 million people in the USA identify as Indian-origin (Pew, 2021–2023 ACS/IPUMS), and the 2020 Census recorded 4,397,737 as Asian Indian alone. No official 2025/2026 count exists yet, but the figure is rising — the community has grown about 174% since 2000. Confirm with the latest ACS release." },
  { question: "What state has the highest Indian population?", answer: "California typically has the largest total Indian-origin population, followed by Texas, New Jersey, New York, and Illinois. New Jersey has the highest Indian share relative to its state population — the highest concentration of any state." },
  { question: "Which U.S. city has the highest Indian population?", answer: "The New York–New Jersey metro (including Edison and Jersey City) and the San Francisco Bay Area have the largest Indian populations, followed by Dallas–Fort Worth, Chicago, Washington DC, Seattle, Atlanta, and Houston." },
  { question: "Where do most Indians live in the USA?", answer: "Most Indians in the USA live in large job-market states and metros — California, Texas, New Jersey, New York, Illinois, Washington, and Georgia — clustered around technology, healthcare, finance, universities, and established immigrant family networks. The New York/New Jersey area and the San Francisco Bay Area are the two biggest hubs." },
  { question: "Are Indians considered Asian in the U.S. Census?", answer: "Yes. In the U.S. Census, people with origins in India are classified under 'Asian' as 'Asian Indian.' This is different from Native Americans, who are recorded as 'American Indian or Alaska Native.'" },
  { question: "What is the difference between Indian American, Asian Indian, Indian immigrant, and Indian-origin?", answer: "'Asian Indian' is the Census race category. 'Indian immigrant' means someone born in India who moved to the U.S. 'Indian American' usually refers to people of Indian descent living in the U.S., including the U.S.-born. 'Indian-origin' or 'Indian alone or in combination' is the broadest, counting anyone identifying with Indian ancestry. These definitions produce different totals." },
  { question: "Why are there so many Indian software engineers in America?", answer: "India produces a very large number of STEM graduates, English is widely used in Indian higher education, and the H-1B visa and U.S. tech hiring have long recruited Indian engineers. Over decades this built dense professional networks that keep drawing talent." },
  { question: "How many Indian students are in the USA?", answer: "Indian students are one of the two largest international student groups in the U.S., numbering in the hundreds of thousands per year according to Open Doors/IIE. Many move to OPT and STEM-OPT work authorization after graduating." },
  { question: "How many Indians are on H-1B in the USA?", answer: "Indian nationals receive the largest single-country share of H-1B approvals each year — often around 70% of the total — according to USCIS data. The exact number changes yearly; check the latest USCIS H-1B characteristics report." },
  { question: "Are Indian Americans high income?", answer: "Yes, on average. Pew Research Center reports Indian American households have among the highest median household incomes of any Asian-origin group in the U.S., linked to high educational attainment and heavy representation in professional fields." },
  { question: "Which Indian state do most Indian Americans come from?", answer: "There is no exact official U.S. count by Indian state of origin. In practice, Telugu communities (Andhra Pradesh/Telangana), Gujaratis, Punjabis, Tamils, and Malayalis are among the most visible groups, but the Census tracks ancestry and language rather than Indian state." },
  { question: "How do Indians contribute to the U.S. economy?", answer: "Through high-skilled work in tech, medicine, engineering, and finance; founding and leading companies; owning small businesses; paying university tuition as students; and — given high household incomes — significant tax and local spending. No single official 'Indian American tax contribution' figure is published." },
  { question: "Are Indians in America mostly citizens, green card holders, or visa holders?", answer: "It's a mix. There are large numbers of naturalized and U.S.-born citizens, a large population of green card holders (many stuck in the employment-based backlog), and hundreds of thousands of H-1B and F-1 visa holders. The balance shifts as immigrants naturalize over time." },
  { question: "Where do Telugu, Punjabi, Gujarati, Tamil, and Malayali communities live in the USA?", answer: "Telugu communities are strong in Texas, California, New Jersey, and the DC area; Punjabis in California and New York/New Jersey; Gujaratis in New Jersey, Texas, Illinois, and Georgia; Tamils in California, Texas, and the Northeast; and Malayalis in Texas, New York, New Jersey, and Florida. These are community patterns, not exact counts." },
  { question: "Is the Indian population in America growing?", answer: "Yes. Pew reports the Indian-origin population grew from about 1.8 million in 2000 to about 4.9 million in 2023 — roughly 174% growth — driven by work visas, students, family immigration, and a growing U.S.-born generation." },
];

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */

export interface SourceLink {
  label: string;
  href: string;
  note: string;
}

export const sources: SourceLink[] = [
  { label: "Pew Research Center — Indian Americans fact sheet", href: "https://www.pewresearch.org/race-and-ethnicity/fact-sheet/asian-americans-indians-in-the-u-s/", note: "≈4.9M Indian-origin; ≈174% growth since 2000 (2021–2023 ACS/IPUMS)." },
  { label: "U.S. Census Bureau — 2020 Census Asian population", href: "https://www.census.gov/library/stories/2023/05/2020-census-dhc-a-asian-population.html", note: "Asian Indian alone: 4,397,737; up 50%+ since 2010." },
  { label: "U.S. Census Bureau — American Community Survey (ACS)", href: "https://www.census.gov/programs-surveys/acs", note: "Detailed race, ancestry, income, and geography tables." },
  { label: "Migration Policy Institute — Indian Immigrants in the U.S.", href: "https://www.migrationpolicy.org/article/indian-immigrants-united-states", note: "≈3.2M Indian immigrants; one of the largest origin groups." },
  { label: "USCIS — H-1B data & characteristics reports", href: "https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub", note: "Country-of-birth breakdown of H-1B approvals." },
  { label: "IIE Open Doors — International students", href: "https://opendoorsdata.org/", note: "Indian student enrollment and trends in the U.S." },
  { label: "AAPI Data — Indian Americans by the numbers", href: "https://aapidata.com/", note: "Demographic and community data on Asian Americans." },
];

export const methodology =
  "This page combines public demographic datasets and rounded estimates. Terms like Indian American, Asian Indian, Indian immigrant, Indian-born, Indian-origin, and 'Indian alone or in combination' can produce different totals, so figures are presented as estimates and ranges rather than exact counts. Always verify a specific number against the primary source before citing it.";

/* ------------------------------------------------------------------ *
 * AI-friendly "Quick Facts" sheet (crawlable key-value pairs)
 * ------------------------------------------------------------------ */

export const quickFacts: { label: string; value: string }[] = [
  { label: "Total Indian-origin population in U.S.", value: "About 4.9 million" },
  { label: "2020 Census Asian Indian alone population", value: "4,397,737" },
  { label: "Growth since 2000", value: "About 174%" },
  { label: "Indian immigrants in the U.S.", value: "About 3.2 million" },
  { label: "Top total-population states", value: "California, Texas, New Jersey, New York, Illinois" },
  { label: "Highest concentration state", value: "New Jersey" },
  { label: "Major metros", value: "New York/New Jersey, San Francisco Bay Area, Dallas–Fort Worth, Chicago, Seattle, Washington DC, Atlanta, Houston" },
  { label: "Common occupations", value: "IT, medicine, engineering, finance, business, academia" },
  { label: "Major visa/student categories", value: "H-1B, F-1, OPT/STEM OPT, green card holders, naturalized citizens, U.S.-born citizens" },
];

export const definitionNote =
  "Indian American, Asian Indian, Indian immigrant, Indian-born, and Indian-origin are related but not identical categories, so totals vary by source.";

/* ------------------------------------------------------------------ *
 * State cluster — child ("micro-spoke") pages
 * ------------------------------------------------------------------ *
 * Keyed by the same state code as `states[]`, which supplies metros,
 * drivers, tooltip, and per-category detail. This record adds the
 * extra fields each /indian-population-in-<state> page needs. Content is
 * hedged and pattern-based — no invented exact per-state counts.
 */

export interface StateChild {
  slug: string; // e.g. "california" → /indian-population-in-california
  metaTitle: string;
  metaDesc: string;
  /** One-line relative-standing summary used in the intro + fact sheet. */
  rankLine: string;
  /** Answer-first intro paragraph. */
  intro: string;
  /** Major cities / suburbs with notable Indian communities. */
  cities: string[];
  /** "Why Indians move here" bullet points. */
  whyMove: string[];
  /** University / student-hub sentence. */
  studentHubs: string;
  /** Regional / language community patterns (hedged). */
  communityGroups: { group: string; note: string }[];
  /** Economic-contribution sentence (hedged). */
  economy: string;
}

/** Ordered list of cluster states (drives the pillar cluster grid + sitemap). */
export const clusterStateCodes = [
  "CA",
  "TX",
  "NJ",
  "NY",
  "IL",
  "WA",
  "GA",
  "FL",
  "VA",
  "MD",
  "MA",
] as const;

export const stateChild: Record<string, StateChild> = {
  CA: {
    slug: "california",
    metaTitle: "Indian Population in California: Cities, Jobs, Income & Community",
    metaDesc:
      "How many Indians live in California, where Indian Americans live (Bay Area, Fremont, San Jose, LA), top jobs, universities, visa patterns, and community trends.",
    rankLine: "California typically has the largest total Indian-origin population of any U.S. state.",
    intro:
      "California is generally the #1 state for total Indian-origin residents, anchored by the San Francisco Bay Area's tech economy plus large communities in Los Angeles, San Diego, and Sacramento. Exact counts vary by ACS/Census definition, but California's Indian community is among the biggest and most established in the country.",
    cities: ["San Francisco Bay Area", "Fremont", "San Jose", "Sunnyvale", "Santa Clara", "Cupertino", "Los Angeles", "San Diego", "Sacramento"],
    whyMove: ["Bay Area tech and startup jobs", "Top universities (Stanford, UC system)", "Large H-1B employer base", "Established Indian family and business networks", "Healthcare, biotech, and finance roles"],
    studentHubs: "Stanford, UC Berkeley, UCLA, UC San Diego, San Jose State, and the wider UC/CSU system draw large numbers of Indian graduate and STEM students who often stay for Bay Area jobs.",
    communityGroups: [
      { group: "Telugu", note: "Very large Bay Area tech community." },
      { group: "Tamil", note: "Strong in software, engineering, and academia." },
      { group: "Punjabi", note: "Historic roots in the Central Valley, trucking, and agriculture." },
      { group: "Gujarati", note: "Business and hospitality across the state." },
    ],
    economy: "Indian Americans in California are heavily represented in senior tech, startups, medicine, and business, so their local economic contribution is significant — though exact tax contribution by state is not published as a simple official number.",
  },
  TX: {
    slug: "texas",
    metaTitle: "Indian Population in Texas: Dallas, Austin, Houston Jobs & Community",
    metaDesc:
      "How many Indians live in Texas, where they live (Dallas, Plano, Frisco, Austin, Houston, Sugar Land), top jobs, universities, visa patterns, and community trends.",
    rankLine: "Texas has one of the largest and fastest-growing Indian-origin populations in the U.S.",
    intro:
      "Texas is one of the fastest-growing states for Indian Americans, especially the Dallas–Fort Worth suburbs and the Houston and Austin metros. Jobs, lower cost of living, and no state income tax draw many Indian families. Exact counts vary by definition, but Texas ranks near the top nationally.",
    cities: ["Dallas–Fort Worth", "Plano", "Frisco", "Irving", "Austin", "Houston", "Sugar Land"],
    whyMove: ["Tech, telecom, and IT-services jobs", "Energy and healthcare employment", "No state income tax and lower housing costs", "Fast-growing suburbs with good schools", "Large H-1B and consulting employer base"],
    studentHubs: "UT Austin, Texas A&M, UT Dallas, UT Arlington, and the University of Houston enroll large numbers of Indian students, many staying for DFW and Austin tech jobs.",
    communityGroups: [
      { group: "Telugu", note: "One of the largest Telugu populations in the U.S., concentrated in DFW." },
      { group: "Gujarati", note: "Strong in business and hospitality, especially Houston." },
      { group: "Tamil", note: "Growing tech and engineering community." },
      { group: "Malayali", note: "Healthcare and nursing families, especially Houston/DFW." },
    ],
    economy: "With heavy representation in IT, energy, healthcare, and small business, Indian Americans contribute significantly to the Texas economy, but exact tax contribution by state is not published as a simple official number.",
  },
  NJ: {
    slug: "new-jersey",
    metaTitle: "Indian Population in New Jersey: Edison, Jersey City Jobs & Community",
    metaDesc:
      "How many Indians live in New Jersey, where they live (Edison, Iselin, Jersey City, Princeton), top jobs, universities, visa patterns, and community trends.",
    rankLine: "New Jersey has the highest Indian-origin concentration of any U.S. state relative to its population.",
    intro:
      "New Jersey has the highest share of Indian-origin residents of any state, centered on the Edison–Iselin corridor, Jersey City, and the Princeton area. It is one of the most established Indian communities in the country, spanning professionals, business owners, and a large second generation. Exact counts vary by definition.",
    cities: ["Edison", "Iselin", "Jersey City", "Princeton", "Parsippany", "North Brunswick", "South Brunswick"],
    whyMove: ["NYC-area finance, pharma, and IT jobs", "Highly rated public schools", "Dense, established Indian community and businesses", "Pharmaceutical and healthcare employers", "Family and cultural networks"],
    studentHubs: "Rutgers, NJIT, and nearby NYC-area universities enroll many Indian students, with strong feeder communities across central New Jersey.",
    communityGroups: [
      { group: "Gujarati", note: "Landmark community along Edison/Iselin's Oak Tree Road." },
      { group: "Telugu", note: "Large professional and tech community." },
      { group: "Tamil", note: "Well established across central NJ." },
      { group: "Punjabi", note: "Significant presence in Jersey City and the north." },
      { group: "Malayali", note: "Healthcare and nursing families statewide." },
    ],
    economy: "New Jersey's Indian community is dense in pharma, finance, IT, medicine, and small business, contributing significantly to the local economy — though exact tax contribution by state is not published as a simple official number.",
  },
  NY: {
    slug: "new-york",
    metaTitle: "Indian Population in New York: NYC, Queens, Long Island Jobs & Community",
    metaDesc:
      "How many Indians live in New York, where they live (Queens, NYC, Long Island, Westchester), top jobs, universities, visa patterns, and community trends.",
    rankLine: "New York has one of the largest total Indian-origin populations in the U.S.",
    intro:
      "New York is home to one of the largest and most diverse Indian communities in the country, concentrated in the New York City metro — Queens, Long Island, and the northern suburbs. It spans high-earning finance and medicine professionals as well as working-class families and small-business owners. Exact counts vary by definition.",
    cities: ["Queens", "New York City", "Long Island", "Brooklyn", "Westchester", "Albany area"],
    whyMove: ["Finance, medicine, and healthcare jobs", "World-class universities", "Long-established Indian neighborhoods", "Small business and retail ownership", "Global business connections"],
    studentHubs: "NYU, Columbia, Cornell, SUNY, and CUNY campuses host large numbers of Indian students across the state.",
    communityGroups: [
      { group: "Punjabi", note: "Historic community in Richmond Hill, Queens." },
      { group: "Gujarati", note: "Business and professional families across the metro." },
      { group: "Bengali", note: "Strong cultural and academic presence." },
      { group: "South Indian", note: "Tamil, Telugu, and Malayali communities across Queens and Long Island." },
    ],
    economy: "New York's Indian community spans finance, medicine, hospitality, and dense small business, contributing significantly to the local economy — though exact tax contribution by state is not published as a simple official number.",
  },
  IL: {
    slug: "illinois",
    metaTitle: "Indian Population in Illinois: Chicago & Naperville Jobs & Community",
    metaDesc:
      "How many Indians live in Illinois, where they live (Chicago, Naperville, Schaumburg, Aurora), top jobs, universities, visa patterns, and community trends.",
    rankLine: "Illinois has a large, long-established Indian-origin population centered on Chicago.",
    intro:
      "Illinois has a large, well-established Indian community centered on the Chicago metro, especially the western suburbs like Naperville, Schaumburg, and Aurora. Devon Avenue in Chicago is a historic South Asian commercial hub. Exact counts vary by ACS/Census definition.",
    cities: ["Chicago", "Naperville", "Schaumburg", "Aurora", "Bloomington-Normal"],
    whyMove: ["IT, consulting, and finance jobs", "Healthcare and pharma employment", "Strong suburban schools (Naperville/Aurora)", "Established Indian businesses and temples", "Central-U.S. logistics and business base"],
    studentHubs: "UIUC, the University of Chicago, Northwestern, and UIC draw many Indian students, with UIUC a major engineering and CS feeder.",
    communityGroups: [
      { group: "Gujarati", note: "Long-established business community." },
      { group: "Telugu", note: "Growing tech and professional community." },
      { group: "Tamil", note: "Engineering and academia families." },
      { group: "Punjabi", note: "Historic presence around Devon Avenue." },
    ],
    economy: "Indian Americans in Illinois are active in IT, healthcare, finance, and small business, contributing significantly to the local economy — though exact tax contribution by state is not published as a simple official number.",
  },
  WA: {
    slug: "washington",
    metaTitle: "Indian Population in Washington: Seattle & Bellevue Tech Community",
    metaDesc:
      "How many Indians live in Washington state, where they live (Seattle, Bellevue, Redmond, Sammamish), top jobs, universities, visa patterns, and community trends.",
    rankLine: "Washington has a fast-growing, tech-heavy Indian-origin population on the Seattle Eastside.",
    intro:
      "Washington state has a rapidly growing Indian community driven by big-tech hiring in Seattle and on the Eastside — Bellevue, Redmond, Kirkland, and Sammamish. It skews toward high-earning software professionals. Exact counts vary by definition, but growth over the past decade has been among the fastest nationally.",
    cities: ["Seattle", "Bellevue", "Redmond", "Kirkland", "Sammamish"],
    whyMove: ["Big-tech software and cloud jobs", "No state income tax", "High-paying senior engineering roles", "Growing Indian community on the Eastside", "Strong schools in Bellevue/Redmond/Sammamish"],
    studentHubs: "The University of Washington and regional universities enroll growing numbers of Indian students feeding the Seattle-area tech workforce.",
    communityGroups: [
      { group: "Telugu", note: "Large, fast-growing tech community." },
      { group: "Tamil", note: "Strong software and engineering presence." },
      { group: "North Indian / Hindi-belt", note: "Sizable professional community on the Eastside." },
    ],
    economy: "Washington's Indian community is concentrated in senior tech roles, contributing significantly to the regional economy — though exact tax contribution by state is not published as a simple official number.",
  },
  GA: {
    slug: "georgia",
    metaTitle: "Indian Population in Georgia: Atlanta, Alpharetta Jobs & Community",
    metaDesc:
      "How many Indians live in Georgia, where they live (Atlanta, Alpharetta, Johns Creek, Cumming), top jobs, universities, visa patterns, and community trends.",
    rankLine: "Georgia has a high and fast-growing Indian-origin population in the Atlanta metro.",
    intro:
      "Georgia's Indian community is concentrated in the Atlanta metro, especially north-side suburbs like Alpharetta, Johns Creek, Cumming, and Suwanee. It is one of the faster-growing Indian populations in the Southeast. Exact counts vary by ACS/Census definition.",
    cities: ["Atlanta", "Alpharetta", "Johns Creek", "Cumming", "Suwanee"],
    whyMove: ["IT, telecom, and logistics jobs", "Lower housing costs than coastal hubs", "Highly rated north-Atlanta schools", "Growing tech and healthcare employers", "Established hospitality and business community"],
    studentHubs: "Georgia Tech, Emory, and Georgia State enroll many Indian students, with Georgia Tech a major engineering and CS feeder.",
    communityGroups: [
      { group: "Gujarati", note: "Strong hospitality and business community." },
      { group: "Telugu", note: "Fast-growing tech and professional community." },
      { group: "Tamil", note: "Engineering and IT families across north Atlanta." },
    ],
    economy: "Indian Americans in Georgia are active in IT, hospitality, healthcare, and business, contributing significantly to the Atlanta-metro economy — though exact tax contribution by state is not published as a simple official number.",
  },
  FL: {
    slug: "florida",
    metaTitle: "Indian Population in Florida: Tampa, Orlando, Miami Jobs & Community",
    metaDesc:
      "How many Indians live in Florida, where they live (Tampa, Orlando, Miami, Jacksonville), top jobs, universities, visa patterns, and community trends.",
    rankLine: "Florida has a growing Indian-origin population spread across several metros.",
    intro:
      "Florida's Indian community is growing and spread across Tampa, Orlando, Miami, and Jacksonville, boosted by professionals, business owners, and retirees relocating from other states. Exact counts vary by definition, but Florida is a steadily rising destination.",
    cities: ["Tampa", "Orlando", "Miami", "Jacksonville"],
    whyMove: ["Healthcare, hospitality, and IT jobs", "No state income tax and warm climate", "Retiree and family relocation", "Business and franchise ownership", "Growing university and tech scene"],
    studentHubs: "The University of Florida, University of South Florida, and University of Central Florida enroll growing numbers of Indian students.",
    communityGroups: [
      { group: "Gujarati", note: "Strong hospitality and motel-business community." },
      { group: "Telugu", note: "Growing tech and professional community." },
      { group: "Malayali", note: "Healthcare and nursing families." },
    ],
    economy: "Florida's Indian community is active in healthcare, hospitality, business, and IT, contributing meaningfully to local economies — though exact tax contribution by state is not published as a simple official number.",
  },
  VA: {
    slug: "virginia",
    metaTitle: "Indian Population in Virginia: Northern Virginia Jobs & Community",
    metaDesc:
      "How many Indians live in Virginia, where they live (Fairfax, Loudoun, Arlington, Ashburn, Herndon), top jobs, universities, visa patterns, and community trends.",
    rankLine: "Virginia has a high Indian-origin concentration in the Northern Virginia DC suburbs.",
    intro:
      "Virginia's Indian community is dense in Northern Virginia — Fairfax and Loudoun counties, Arlington, Ashburn, and Herndon — tied to tech, cybersecurity, and government contracting around Washington DC. It has among the highest educational attainment nationally. Exact counts vary by definition.",
    cities: ["Northern Virginia", "Fairfax", "Loudoun", "Arlington", "Ashburn", "Herndon"],
    whyMove: ["IT, cybersecurity, and government contracting jobs", "Top-ranked NoVA public schools", "Data-center and cloud employment", "Established professional Indian community", "Proximity to Washington DC"],
    studentHubs: "George Mason University, the University of Virginia, and Virginia Tech enroll many Indian students, with strong NoVA feeder communities.",
    communityGroups: [
      { group: "Telugu", note: "Large professional and tech community." },
      { group: "Tamil", note: "Strong IT and engineering presence." },
      { group: "North Indian / Hindi-belt", note: "Sizable community across Fairfax and Loudoun." },
    ],
    economy: "Northern Virginia's Indian community is concentrated in tech, cybersecurity, and contracting, contributing significantly to the regional economy — though exact tax contribution by state is not published as a simple official number.",
  },
  MD: {
    slug: "maryland",
    metaTitle: "Indian Population in Maryland: Montgomery County Jobs & Community",
    metaDesc:
      "How many Indians live in Maryland, where they live (Montgomery County, Rockville, Gaithersburg, Baltimore suburbs), top jobs, universities, and community trends.",
    rankLine: "Maryland has a well-established Indian-origin community in the DC suburbs and Baltimore area.",
    intro:
      "Maryland's Indian community is established in the DC suburbs — Montgomery County, Rockville, and Gaithersburg — plus the Baltimore area, with a strong presence in medicine, biotech/NIH research, and IT. Exact counts vary by ACS/Census definition.",
    cities: ["Montgomery County", "Rockville", "Gaithersburg", "Baltimore suburbs"],
    whyMove: ["Medicine, biotech, and NIH research jobs", "Government and IT employment", "Strong Montgomery County schools", "Proximity to Washington DC", "Established professional community"],
    studentHubs: "The University of Maryland and Johns Hopkins enroll many Indian students, including a large medical and research cohort.",
    communityGroups: [
      { group: "South Indian", note: "Tamil, Telugu, and Malayali communities across the DC suburbs." },
      { group: "Gujarati", note: "Business and professional families." },
      { group: "Punjabi", note: "Established community in the Baltimore-DC corridor." },
    ],
    economy: "Maryland's Indian community is strong in medicine, research, and IT, contributing significantly to the local economy — though exact tax contribution by state is not published as a simple official number.",
  },
  MA: {
    slug: "massachusetts",
    metaTitle: "Indian Population in Massachusetts: Boston Area Jobs & Community",
    metaDesc:
      "How many Indians live in Massachusetts, where they live (Boston, Cambridge, Burlington, Lowell, Shrewsbury), top jobs, universities, and community trends.",
    rankLine: "Massachusetts has a high per-capita Indian-origin population in the Boston research corridor.",
    intro:
      "Massachusetts has a research- and student-heavy Indian community concentrated around Boston and Cambridge, plus suburbs like Burlington, Lowell, Shrewsbury, and Worcester. It skews toward biotech, academia, medicine, and software. Exact counts vary by definition, but per-capita concentration is high.",
    cities: ["Boston", "Cambridge", "Burlington", "Lowell", "Shrewsbury", "Worcester"],
    whyMove: ["Biotech, academia, and medicine jobs", "World-class universities (MIT, Harvard)", "Software and deep-tech employers", "Strong schools in the western suburbs", "Research and startup ecosystem"],
    studentHubs: "MIT, Harvard, Boston University, Northeastern, and UMass make Massachusetts one of the top U.S. destinations for Indian students.",
    communityGroups: [
      { group: "South Indian", note: "Large Tamil, Telugu, and Malayali research and tech community." },
      { group: "Bengali", note: "Strong academic and cultural presence." },
      { group: "North Indian / Hindi-belt", note: "Growing professional community in the suburbs." },
    ],
    economy: "Massachusetts' Indian community is concentrated in biotech, academia, medicine, and software, contributing significantly to the innovation economy — though exact tax contribution by state is not published as a simple official number.",
  },
};

/** Cluster links for the pillar "Indian Population by State" grid. */
export const clusterStateLinks = clusterStateCodes.map((code) => {
  const s = states.find((x) => x.code === code)!;
  const c = stateChild[code];
  return {
    code,
    name: s.name,
    slug: c.slug,
    href: `/indian-population-in-${c.slug}`,
    metros: s.metros,
    drivers: s.drivers,
    rankLine: c.rankLine,
  };
});
