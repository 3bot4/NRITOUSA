/**
 * Pure, framework-free screening logic for the immigrant benefits screener.
 *
 * Kept out of the React component so it can be unit-tested under vitest and so
 * the UI stays thin. No network, no storage, no side effects — inputs in,
 * educational tiers out.
 *
 * ══════════════════════════════════════════════════════════════════════
 * DESIGN RULES (see also the header of src/data/governmentBenefitsData.ts)
 * ══════════════════════════════════════════════════════════════════════
 *  • This is EDUCATIONAL TRIAGE, never a determination. Every result is a
 *    likelihood tier plus the reason. The word "eligible" never appears as a
 *    conclusion about a real person — only "may qualify" / "appears
 *    potentially eligible" / "requires agency review".
 *  • EVERY PERSON IS EVALUATED SEPARATELY. A parent's temporary visa must
 *    never suppress a U.S.-citizen child's result. This is the single most
 *    important behaviour in this file and it is covered by tests.
 *  • Program eligibility, public charge, and I-864 sponsor reimbursement are
 *    three independent axes. They are computed independently and never merged.
 *  • Where a rule is genuinely state-set (Medicaid levels, unemployment, TANF,
 *    LIHEAP, child care), we return `state-check` rather than guessing.
 *  • Where a figure cannot be honestly estimated, `estimate` is left undefined
 *    and the caller shows "official agency calculation required".
 *
 * Legal basis for the status gates, all verified 2026-07-16:
 *  • Qualified-immigrant concept: 8 U.S.C. §1641.
 *  • Five-year bar: 8 U.S.C. §1613.
 *  • SNAP: 7 U.S.C. §2015(f) (as rewritten by OBBB §10108, eff. 2025-07-04)
 *    AND 8 U.S.C. §1612(a). BOTH must be satisfied — §1612 was not repealed.
 *  • Medicaid: 42 U.S.C. §1396b(v)(5) (added by OBBBA §71109, eff. 2026-10-01),
 *    which preserves §1396b(v)(2) (emergency) and §1396b(v)(4) (state option).
 *  • PTC: 26 U.S.C. §36B(e) as amended by OBBBA §71301 (tax years beginning
 *    after 2026-12-31) and §71302 (repealing the sub-100% FPL pathway, tax
 *    years beginning after 2025-12-31).
 *  • Public charge: 2022 Final Rule through 2026-09-17; DHS final rule
 *    2026-14539 removing 8 CFR 212.20–212.23 effective 2026-09-18.
 */
import { fplPercent } from "@/data/governmentBenefitsData";

/* ------------------------------------------------------------------ *
 * Inputs
 * ------------------------------------------------------------------ */

export type ImmigrationStatus =
  | "us-citizen"
  | "us-born-child"
  | "naturalized"
  | "lpr"
  | "conditional-lpr"
  | "h1b"
  | "h4"
  | "l1"
  | "l2"
  | "f1"
  | "f2"
  | "j"
  | "o1"
  | "e"
  | "tps"
  | "refugee"
  | "asylee"
  | "parolee"
  | "pending-aos"
  | "other-lawful"
  | "no-lawful-status"
  | "prefer-not";

export const STATUS_LABELS: Record<ImmigrationStatus, string> = {
  "us-citizen": "U.S. citizen",
  "us-born-child": "U.S.-born citizen child",
  naturalized: "Naturalised citizen",
  lpr: "Green card holder",
  "conditional-lpr": "Conditional green card holder",
  h1b: "H-1B",
  h4: "H-4",
  l1: "L-1",
  l2: "L-2",
  f1: "F-1",
  f2: "F-2",
  j: "J-1 / J-2",
  o1: "O-1",
  e: "E visa",
  tps: "TPS",
  refugee: "Refugee",
  asylee: "Asylee",
  parolee: "Parolee",
  "pending-aos": "Pending adjustment of status",
  "other-lawful": "Other lawful status",
  "no-lawful-status": "No current lawful status",
  "prefer-not": "Prefer not to answer",
};

export type Circumstance =
  | "pregnant"
  | "child-under-5"
  | "school-age-child"
  | "age-65-plus"
  | "disability"
  | "recently-lost-job"
  | "low-income"
  | "needs-health-insurance"
  | "college-student"
  | "needs-food"
  | "needs-housing-utility";

export interface Person {
  /** Stable id for React keys + result grouping. */
  id: string;
  /** Human label, e.g. "You", "Spouse", "Child 1". */
  label: string;
  status: ImmigrationStatus;
  /** Age in years. Optional — several rules turn on under-18 / 65+. */
  age?: number;
  /** Years held a green card. Only meaningful for lpr / conditional-lpr. */
  gcYears?: number;
  /** Qualifying U.S. military service (self, spouse, or parent). */
  military?: boolean;
  /** Had refugee/asylee status (or another exemption) before becoming an LPR. */
  refugeeBeforeLpr?: boolean;
  /** Sponsored via Form I-864, if the user knows. */
  sponsoredI864?: "yes" | "no" | "unknown";
}

export interface WorkHistory {
  currentlyWorking: boolean;
  recentlyLaidOff: boolean;
  /** Approximate years of U.S. work. */
  usWorkYears: number;
  /** Whether Social Security / Medicare tax was paid on that work. */
  paidSsTax: "yes" | "no" | "unknown";
  /** Optional self-reported Social Security credits. */
  ssCredits?: number;
}

export interface TaxFiling {
  filesUsReturn: "yes" | "no" | "unsure";
  filingStatus?: "single" | "mfj" | "mfs" | "hoh";
  /** Number of qualifying children with an SSN valid for employment. */
  childrenWithSsn: number;
  /** Whether the filer has an SSN valid for employment (vs ITIN only). */
  filerHasSsn: "yes" | "no" | "unsure";
}

export interface ScreenerInputs {
  persons: Person[];
  /** Two-letter state code. */
  state: string;
  householdSize: number;
  annualIncome: number;
  circumstances: Circumstance[];
  work: WorkHistory;
  tax: TaxFiling;
}

/* ------------------------------------------------------------------ *
 * Outputs
 * ------------------------------------------------------------------ */

export type Tier =
  /** Strong possibility on the facts given. */
  | "strong"
  /** Possible, but a material fact is missing or agency-determined. */
  | "possible"
  /** Probably unavailable on the selected facts. */
  | "unlikely"
  /** Genuinely set by the state — we will not guess. */
  | "state-check"
  /** Raises an immigration question worth reviewing. */
  | "immigration";

export type PublicChargeTreatment =
  | "not-counted"
  | "counted"
  | "review"
  | "not-applicable";

export type Confidence = "higher" | "medium" | "preliminary";

export interface ProgramResult {
  id: string;
  program: string;
  tier: Tier;
  /** Labels of household members who may qualify. Empty = nobody, on these facts. */
  who: string[];
  /** Why this landed in this tier — always in plain English. */
  why: string;
  immigrationNote: string;
  incomeNote?: string;
  stateNote?: string;
  publicCharge: PublicChargeTreatment;
  publicChargeNote: string;
  sponsorNote?: string;
  applyLabel: string;
  applyUrl: string;
  /** Only set where an official formula or published figure supports it. */
  estimate?: {
    monthly?: string;
    annual?: string;
    oneTime?: string;
    confidence: Confidence;
    basis: string;
    year: string;
  };
}

export interface ScreenerResult {
  fplPct: number;
  programs: ProgramResult[];
  /** Immigration/public-charge questions worth reviewing. */
  immigrationFlags: string[];
  /** Programs excluded from any dollar total, and why. */
  notInTotal: string[];
  /** Assumptions the estimates rest on. */
  assumptions: string[];
  /** Whether an I-864 sponsor question is potentially live. */
  sponsorRisk: boolean;
}

/* ------------------------------------------------------------------ *
 * Status predicates
 * ------------------------------------------------------------------ */

export const CITIZEN_STATUSES: ImmigrationStatus[] = [
  "us-citizen",
  "us-born-child",
  "naturalized",
];

export function isCitizen(p: Person): boolean {
  return CITIZEN_STATUSES.includes(p.status);
}

export function isLpr(p: Person): boolean {
  return p.status === "lpr" || p.status === "conditional-lpr";
}

/**
 * "Qualified alien" under 8 U.S.C. §1641 — the gate for most federal
 * means-tested programs. Note this is a status concept and is NOT the same as
 * "lawfully present" (which is broader and governs Marketplace access).
 */
export function isQualifiedImmigrant(p: Person): boolean {
  if (isCitizen(p)) return true;
  return ["lpr", "conditional-lpr", "refugee", "asylee", "parolee"].includes(p.status);
}

/** Lawfully present — the gate for Marketplace coverage. Broader than qualified. */
export function isLawfullyPresent(p: Person): boolean {
  if (p.status === "no-lawful-status" || p.status === "prefer-not") return false;
  return true;
}

/**
 * The narrow post-OBBB status list shared by SNAP (7 U.S.C. §2015(f)),
 * Medicaid from 2026-10-01 (42 U.S.C. §1396b(v)(5)), and the PTC from
 * tax year 2027 (26 U.S.C. §36B(e)(2)(B)): citizens/nationals, LPRs,
 * Cuban/Haitian entrants, and COFA residents.
 *
 * We cannot detect Cuban/Haitian entrant or COFA from our status list, so
 * those users land in "other-lawful" and are routed to review rather than
 * being told no.
 */
export function isNarrowListStatus(p: Person): boolean {
  return isCitizen(p) || isLpr(p);
}

/** Has the person cleared the five-year bar (8 U.S.C. §1613)? */
export function clearedFiveYearBar(p: Person): boolean {
  if (isCitizen(p)) return true;
  if (p.refugeeBeforeLpr) return true; // exempt from the bar
  if (p.military) return true;
  if (isLpr(p)) return (p.gcYears ?? 0) >= 5;
  // Refugees/asylees/parolees are qualified immigrants exempt from the bar.
  return ["refugee", "asylee", "parolee"].includes(p.status);
}

/** Rough 40-quarters test from self-reported work history. */
export function likelyHas40Quarters(work: WorkHistory): boolean {
  if (typeof work.ssCredits === "number" && work.ssCredits >= 40) return true;
  return work.usWorkYears >= 10 && work.paidSsTax === "yes";
}

const isChild = (p: Person) => (p.age ?? 99) < 18;

/* ------------------------------------------------------------------ *
 * Shared notes
 * ------------------------------------------------------------------ */

const PC_EARNED =
  "Not counted. Earned benefits funded by payroll taxes have never been public-charge negatives, before or after the September 18, 2026 transition.";
const PC_TAX =
  "Not counted. Tax credits are not public assistance and are not treated as public-charge negatives.";
const PC_NONCASH =
  "Not counted for benefits received before September 18, 2026 (the 2022 rule excludes it). On or after that date DHS removes the list and officers may weigh means-tested benefits in the totality of the circumstances — no single benefit is decisive, and receipt before the transition is still judged under the old standard.";
const PC_CASH =
  "Counted. This is cash assistance for income maintenance, which the 2022 rule counts and the new framework continues to weigh. If you have an admission or adjustment of status filing ahead, get individual legal advice before applying.";

const SPONSOR_MEANS_TESTED =
  "If the person was sponsored on Form I-864, this is one of the programs an agency may ask the sponsor to reimburse. That is a contract debt owed by the sponsor — it is not public charge and it cannot block a green card.";

/* ------------------------------------------------------------------ *
 * The screener
 * ------------------------------------------------------------------ */

export function screen(inputs: ScreenerInputs): ScreenerResult {
  const { persons, state, householdSize, annualIncome, circumstances, work, tax } = inputs;
  const pct = fplPercent(annualIncome, householdSize, state);
  const has = (c: Circumstance) => circumstances.includes(c);
  const labels = (ps: Person[]) => ps.map((p) => p.label);

  const programs: ProgramResult[] = [];
  const immigrationFlags: string[] = [];
  const notInTotal: string[] = [];
  const assumptions: string[] = [];

  assumptions.push(
    `Household income of ${usd(annualIncome)} for ${householdSize} ${householdSize === 1 ? "person" : "people"} is about ${pct}% of the 2026 federal poverty guideline for your state group.`,
  );
  assumptions.push(
    "Every person is screened on their own immigration status. One person's status never disqualifies another.",
  );

  /* ---------------- Healthcare ---------------- */

  // Marketplace access = lawfully present.
  const marketplacePeople = persons.filter(isLawfullyPresent);
  programs.push({
    id: "marketplace",
    program: "Health Insurance Marketplace (ACA) coverage",
    tier: marketplacePeople.length ? "strong" : "unlikely",
    who: labels(marketplacePeople),
    why: marketplacePeople.length
      ? "Lawfully present immigrants can buy a Marketplace plan. Buying a plan is separate from qualifying for a subsidy."
      : "Marketplace enrolment requires lawful presence.",
    immigrationNote:
      "Marketplace access turns on being lawfully present, which is broader than the 'qualified immigrant' test used by Medicaid and SNAP. Work and student visa holders are lawfully present.",
    stateNote:
      "Some states run their own exchange with their own enrolment periods and, in a few cases, their own state subsidies.",
    publicCharge: "not-counted",
    publicChargeNote: PC_NONCASH,
    applyLabel: "HealthCare.gov",
    applyUrl: "https://www.healthcare.gov/immigrants/lawfully-present-immigrants/",
  });

  // Premium tax credit — the 2026/2027 cliff.
  const ptcNowPeople = persons.filter(isLawfullyPresent);
  const ptcFuturePeople = persons.filter((p) => isLawfullyPresent(p) && isNarrowListStatus(p));
  const ptcLosers = ptcNowPeople.filter((p) => !isNarrowListStatus(p) && !isCitizen(p));
  const ptcIncomeOk = pct >= 100;
  const ptcTier: Tier = !ptcNowPeople.length
    ? "unlikely"
    : !ptcIncomeOk
      ? "unlikely"
      : pct <= 400
        ? "strong"
        : "possible";

  programs.push({
    id: "ptc",
    program: "Premium tax credit (Marketplace subsidy)",
    tier: ptcTier,
    who: labels(ptcIncomeOk ? ptcNowPeople : []),
    why: !ptcIncomeOk
      ? `At about ${pct}% of the poverty guideline, household income is below 100%. Congress repealed the rule that let lawfully present immigrants under 100% claim the credit, for tax years beginning after December 31, 2025. Very low income now means no credit rather than more help — check whether anyone in the household qualifies for Medicaid or CHIP instead.`
      : pct <= 400
        ? `At about ${pct}% of the poverty guideline, the household is in the range where the premium tax credit commonly applies for 2026.`
        : `At about ${pct}% of the poverty guideline, a credit is still possible depending on the cost of the benchmark plan in your area, but it is less likely.`,
    immigrationNote: ptcLosers.length
      ? `Time-sensitive: for tax years beginning after December 31, 2026, only green card holders, Cuban/Haitian entrants, and COFA residents remain 'eligible aliens' for this credit. On these facts that change would affect ${ptcLosers.map((p) => p.label).join(", ")}. Marketplace coverage stays available — at full price.`
      : "Green card holders remain eligible aliens for the credit after the January 1, 2027 change.",
    incomeNote:
      "The credit is calculated from your estimated annual household income (MAGI) against the cost of the benchmark plan where you live. The Marketplace does the real calculation.",
    stateNote: "Benchmark plan costs — and therefore the subsidy — vary by county.",
    publicCharge: "not-counted",
    publicChargeNote: PC_TAX,
    applyLabel: "HealthCare.gov — see if you qualify for savings",
    applyUrl: "https://www.healthcare.gov/lower-costs/",
    estimate: ptcIncomeOk && ptcTier !== "unlikely"
      ? {
          confidence: "preliminary",
          basis:
            "We deliberately do not put a dollar figure on this. The credit depends on the benchmark plan premium in your specific county, your exact MAGI, and each person's age — inputs we do not collect. The Marketplace calculates it instantly and accurately once you enter your ZIP.",
          year: "2026",
        }
      : undefined,
  });

  // Medicaid.
  const medicaidQualified = persons.filter((p) => isQualifiedImmigrant(p) && clearedFiveYearBar(p));
  const medicaidBarred = persons.filter((p) => isQualifiedImmigrant(p) && !clearedFiveYearBar(p));
  const medicaidChildren = persons.filter((p) => isChild(p) && isLawfullyPresent(p));
  const medicaidLosesOct = persons.filter(
    (p) => isQualifiedImmigrant(p) && !isNarrowListStatus(p),
  );
  programs.push({
    id: "medicaid",
    program: "Medicaid",
    tier: medicaidQualified.length ? (pct <= 138 ? "state-check" : "possible") : "state-check",
    who: labels(medicaidQualified),
    why: medicaidQualified.length
      ? `Medicaid income limits are set by each state, so we will not guess yours. At about ${pct}% of the poverty guideline${pct <= 138 ? ", the household is in the range where many states' rules reach — but your state decides." : ", the household is above the level many states use for adults, though children's limits are usually far higher."}`
      : "On these facts, nobody clearly meets the qualified-immigrant plus five-year test that federal Medicaid uses — but your state may cover people federal rules exclude, using state money.",
    immigrationNote: medicaidBarred.length
      ? `${medicaidBarred.map((p) => p.label).join(", ")} appears to be inside the five-year bar. Children under 19 and pregnant people are covered sooner in many states, and some states cover this group with state funds.`
      : "Medicaid uses the 'qualified immigrant' test plus, for many people, a five-year waiting period. Work and student visa holders are generally outside federal Medicaid regardless of income.",
    incomeNote: "State-set. Many states use 138% of the poverty guideline for adults; children's limits are typically much higher.",
    stateNote: `Check your state's actual limits — this is the single most state-dependent program on this page.`,
    publicCharge: "not-counted",
    publicChargeNote: PC_NONCASH,
    sponsorNote: SPONSOR_MEANS_TESTED,
    applyLabel: "Medicaid.gov — apply through your state",
    applyUrl: "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip/index.html",
  });

  if (medicaidLosesOct.length) {
    immigrationFlags.push(
      `From October 1, 2026, federal Medicaid payment is limited to citizens, green card holders, Cuban/Haitian entrants, and COFA residents. On these facts that change could affect ${medicaidLosesOct.map((p) => p.label).join(", ")}. Emergency Medicaid and the state option covering lawfully residing children and pregnant people are expressly preserved by the statute.`,
    );
  }

  // CHIP.
  if (medicaidChildren.length) {
    programs.push({
      id: "chip",
      program: "CHIP (children's health coverage)",
      tier: "state-check",
      who: labels(medicaidChildren),
      why: "CHIP covers children in households that earn too much for Medicaid but cannot readily afford private coverage. Limits are set by each state and are usually well above the Medicaid line.",
      immigrationNote:
        "Many states take the federal option to cover lawfully residing children without the five-year wait. A U.S.-citizen child is covered on their own status, whatever their parents hold.",
      incomeNote: "State-set, and typically generous — do not rule your children out on income alone.",
      stateNote: "Every state runs CHIP differently, including the name it uses.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "InsureKidsNow.gov",
      applyUrl: "https://www.insurekidsnow.gov/",
    });
  }

  // Pregnancy-related coverage.
  if (has("pregnant")) {
    programs.push({
      id: "pregnancy-coverage",
      program: "Pregnancy-related Medicaid / CHIP",
      tier: "state-check",
      who: labels(persons.filter(isLawfullyPresent)),
      why: "Pregnancy coverage commonly reaches higher incomes than regular Medicaid, and many states cover lawfully residing pregnant people without the five-year wait.",
      immigrationNote:
        "This is one of the areas where states most often use the federal option — or their own funds — to cover people the general federal rules exclude.",
      stateNote: "Ask your state specifically about pregnancy coverage; do not assume the adult rules apply.",
      publicCharge: "not-counted",
      publicChargeNote:
        "Not counted under the 2022 rule. The new framework's preamble specifically notes that officers consider pregnancy to be a temporary condition when weighing Medicaid used for prenatal care.",
      applyLabel: "Medicaid.gov — pregnancy coverage",
      applyUrl: "https://www.medicaid.gov/medicaid/eligibility/index.html",
    });
  }

  // Emergency Medicaid — everyone, always.
  programs.push({
    id: "emergency-medicaid",
    program: "Emergency Medicaid",
    tier: "possible",
    who: labels(persons),
    why: "Emergency Medicaid pays for treatment of an emergency medical condition for people who meet the income rules but are excluded from full Medicaid because of immigration status.",
    immigrationNote:
      "This is available regardless of immigration status. The statute that narrows federal Medicaid payment from October 1, 2026 expressly preserves it.",
    stateNote: "Administered by your state Medicaid agency.",
    publicCharge: "not-counted",
    publicChargeNote:
      "Not counted under the 2022 rule. Emergency care should never be avoided over an immigration concern.",
    applyLabel: "Medicaid.gov",
    applyUrl: "https://www.medicaid.gov/medicaid/eligibility/index.html",
  });

  // Community health centers — no status test.
  programs.push({
    id: "health-center",
    program: "Community health center (sliding scale)",
    tier: "strong",
    who: labels(persons),
    why: "Federally funded health centers see patients regardless of immigration status or ability to pay, charging on a sliding scale based on income.",
    immigrationNote: "No immigration status test and no qualified-immigrant test.",
    publicCharge: "not-counted",
    publicChargeNote: "Not counted under the 2022 rule.",
    applyLabel: "Find a health center (HRSA)",
    applyUrl: "https://findahealthcenter.hrsa.gov/",
  });

  // Medicare.
  const medicarePeople = persons.filter((p) => (p.age ?? 0) >= 65 || has("age-65-plus"));
  if (medicarePeople.length) {
    const q40 = likelyHas40Quarters(work);
    const lprLongEnough = medicarePeople.some((p) => isLpr(p) && (p.gcYears ?? 0) >= 5);
    programs.push({
      id: "medicare",
      program: "Medicare",
      tier: q40 ? "strong" : lprLongEnough || medicarePeople.some(isCitizen) ? "possible" : "immigration",
      who: labels(medicarePeople),
      why: q40
        ? "With about 40 credits of covered work, premium-free Part A is generally available at 65."
        : "Without 40 credits, a green card holder aged 65+ with five years of continuous residence as a permanent resident can generally still enrol by paying a Part A premium.",
      immigrationNote:
        "Medicare is an earned benefit. Citizens and green card holders with 40 quarters are treated the same. Green card holders short of 40 quarters need five years of continuous permanent residence to buy in.",
      publicCharge: "not-counted",
      publicChargeNote: PC_EARNED,
      applyLabel: "Medicare.gov — eligibility",
      applyUrl: "https://www.medicare.gov/basics/get-started-with-medicare",
    });
  }

  /* ---------------- Food & family ---------------- */

  // SNAP — both statutes must be satisfied.
  const snapPeople = persons.filter((p) => {
    if (!isNarrowListStatus(p)) return false; // 7 USC 2015(f)
    if (isCitizen(p)) return true;
    // 8 USC 1612(a) exceptions for LPRs
    if (isChild(p)) return true; // §1612(a)(2)(J)
    if (p.military) return true; // §1612(a)(2)(C)
    if (likelyHas40Quarters(work)) return true; // §1612(a)(2)(B)
    if (has("disability")) return true; // §1612(a)(2)(F)(ii), approximate
    return (p.gcYears ?? 0) >= 5; // §1612(a)(2)(L)
  });
  const snapExcludedByStatus = persons.filter(
    (p) => !isNarrowListStatus(p) && isQualifiedImmigrant(p),
  );
  const snapIncomeLikely = pct <= 130;
  programs.push({
    id: "snap",
    program: "SNAP (food benefits)",
    tier: !snapPeople.length ? "unlikely" : snapIncomeLikely ? "possible" : "state-check",
    who: labels(snapPeople),
    why: !snapPeople.length
      ? "On these facts, nobody appears to meet the status test SNAP now uses."
      : `${snapPeople.map((p) => p.label).join(", ")} appears to meet the status test. Income is the other half: SNAP generally looks at gross income around 130% of the poverty guideline, and your household is at about ${pct}%. Your state does the real calculation, including deductions that can help.`,
    immigrationNote: snapExcludedByStatus.length
      ? `Important change: since July 4, 2025, SNAP eligibility requires being a citizen, green card holder, Cuban/Haitian entrant, or COFA resident. ${snapExcludedByStatus.map((p) => p.label).join(", ")} is a qualified immigrant for other programs but no longer qualifies for SNAP by virtue of that status. Adjusting to a green card can restore it.`
      : "SNAP now requires two things at once: a status on the narrow post-2025 list, and an exception to the five-year bar (being under 18, 40 quarters of work, military service, or five years as a qualified immigrant).",
    incomeNote: "Roughly 130% of the poverty guideline for gross income, but deductions matter and the state calculates it.",
    stateNote: "Applications, interviews, and deductions are handled by your state agency.",
    publicCharge: "not-counted",
    publicChargeNote: PC_NONCASH,
    sponsorNote: SPONSOR_MEANS_TESTED,
    applyLabel: "USDA FNS — apply in your state",
    applyUrl: "https://www.fns.usda.gov/snap/state-directory",
  });

  // WIC — no status test.
  if (has("pregnant") || has("child-under-5")) {
    programs.push({
      id: "wic",
      program: "WIC (nutrition for pregnancy and young children)",
      tier: "strong",
      who: labels(persons.filter((p) => isChild(p) || has("pregnant"))),
      why: "WIC serves pregnant and postpartum people, infants, and children under 5 who meet an income or adjunctive-eligibility test. Being enrolled in Medicaid or SNAP often qualifies you automatically.",
      immigrationNote:
        "WIC does not require proof of immigration status, and USDA has long stated that WIC participation does not make someone a public charge.",
      incomeNote: "Commonly around 185% of the poverty guideline, set by the state agency.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "USDA FNS — find your state WIC agency",
      applyUrl: "https://www.fns.usda.gov/wic",
    });
  }

  // School meals — no status test.
  if (has("school-age-child")) {
    programs.push({
      id: "school-meals",
      program: "Free and reduced-price school meals",
      tier: "strong",
      who: labels(persons.filter(isChild)),
      why: "The National School Lunch and School Breakfast Programs are open to enrolled children based on household income, and many schools serve all students at no charge.",
      immigrationNote:
        "No immigration status test. Federal law preserves school meal access for anyone eligible for public education.",
      incomeNote: "Roughly 130% of the poverty guideline for free meals and 185% for reduced price — the school or district applies it.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "USDA FNS — school meals",
      applyUrl: "https://www.fns.usda.gov/nslp",
    });
  }

  // TANF — cash, so public charge counts it.
  if (snapIncomeLikely || has("low-income")) {
    const tanfPeople = persons.filter((p) => isQualifiedImmigrant(p) && clearedFiveYearBar(p));
    programs.push({
      id: "tanf",
      program: "TANF (cash assistance for families)",
      tier: tanfPeople.length ? "state-check" : "unlikely",
      who: labels(tanfPeople),
      why: "TANF is cash assistance for families with children. Each state sets its own income limits, time limits, and work requirements — they vary enormously.",
      immigrationNote:
        "TANF uses the qualified-immigrant test and, in most states, the five-year bar. Some states cover people sooner with state funds.",
      stateNote: "Entirely state-designed. Check your state's actual program.",
      publicCharge: "counted",
      publicChargeNote: PC_CASH,
      sponsorNote: SPONSOR_MEANS_TESTED,
      applyLabel: "Benefits.gov — TANF by state",
      applyUrl: "https://www.benefits.gov/benefit/613",
    });
    immigrationFlags.push(
      "TANF is cash assistance for income maintenance — one of the few benefits counted under the public-charge rule both before and after the September 18, 2026 transition. If anyone in the household has an admission or adjustment of status filing ahead, get legal advice before applying for cash aid.",
    );
  }

  // Child care / Head Start.
  if (has("child-under-5")) {
    programs.push({
      id: "head-start",
      program: "Head Start / Early Head Start and child care assistance",
      tier: "state-check",
      who: labels(persons.filter((p) => (p.age ?? 99) < 6)),
      why: "Head Start serves children from low-income families and does not test immigration status. Child care subsidies are state-run with state income limits.",
      immigrationNote:
        "Head Start does not require immigration status. State child care subsidy rules vary — some tie eligibility to the child, who may be a citizen.",
      stateNote: "Child care assistance is state-administered with waiting lists in many areas.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "Find a Head Start program",
      applyUrl: "https://eclkc.ohs.acf.hhs.gov/center-locator",
    });
  }

  /* ---------------- Employment & income ---------------- */

  // Unemployment — genuinely state-dependent.
  if (has("recently-lost-job") || work.recentlyLaidOff) {
    const visaWorkers = persons.filter(
      (p) => !isCitizen(p) && !isLpr(p) && ["h1b", "l1", "o1", "e", "j", "f1"].includes(p.status),
    );
    programs.push({
      id: "unemployment",
      program: "Unemployment insurance",
      tier: "state-check",
      who: labels(persons.filter((p) => isLawfullyPresent(p))),
      why: "Unemployment is an earned, state-run benefit funded by employer taxes. It turns on your recent covered wages, why the job ended, and whether you are able, available, and authorised to work now.",
      immigrationNote: visaWorkers.length
        ? `${visaWorkers.map((p) => p.label).join(", ")} is on a work or student visa. Federal law requires that the work was performed while lawfully present and authorised — that part is usually satisfied. The obstacle is the second test: you must be authorised to work *now*. When a sponsored job ends, work authorisation often ends with it unless you are in a grace period or have a pending change of status, which is why many states deny. Apply and let the state decide rather than assuming.`
        : "Green card holders and citizens have ongoing work authorisation, so the authorisation obstacle that blocks many visa holders does not apply. There is no five-year bar for unemployment.",
      stateNote:
        "Benefit amounts, formulas, and the treatment of visa holders vary by state. Only your state agency can determine this.",
      publicCharge: "not-counted",
      publicChargeNote: PC_EARNED,
      applyLabel: "DOL — find your state unemployment office",
      applyUrl: "https://www.dol.gov/general/topic/unemployment-insurance",
      estimate: {
        confidence: "preliminary",
        basis:
          "Possible eligibility — official agency calculation required. Every state uses its own formula, base period, and weekly maximum. We will not invent a number.",
        year: "2026",
      },
    });
    notInTotal.push("Unemployment insurance — state formula required");
  }

  // Social Security retirement / SSDI / survivors.
  const q40 = likelyHas40Quarters(work);
  programs.push({
    id: "social-security",
    program: "Social Security (retirement, disability, survivors)",
    tier: q40 ? "possible" : work.usWorkYears > 0 ? "possible" : "unlikely",
    who: labels(persons.filter((p) => isLawfullyPresent(p) && !isChild(p))),
    why: q40
      ? "About 40 credits of covered work is the usual test for retirement benefits, and your reported work history is around or above that."
      : `With about ${work.usWorkYears} year(s) of U.S. work reported, you may be short of the 40 credits usually needed for retirement benefits. Disability benefits can require fewer credits depending on age.`,
    immigrationNote:
      "Social Security is an earned benefit, not a means-tested one. Lawfully present people who have the credits can draw on their record. There is no five-year bar. Credits require work under a Social Security number valid for work.",
    incomeNote: "Your benefit is calculated from your own earnings record, not from current household income.",
    publicCharge: "not-counted",
    publicChargeNote: PC_EARNED,
    applyLabel: "SSA — check your record and estimate",
    applyUrl: "https://www.ssa.gov/myaccount/",
    estimate: {
      confidence: "preliminary",
      basis:
        "Possible eligibility — official agency calculation required. A meaningful estimate needs your full year-by-year earnings record, which we do not collect. Your my Social Security account shows a real, personalised figure.",
      year: "2026",
    },
  });
  notInTotal.push("Social Security — requires your earnings record");

  // SSI — the hard one, and cash, so public charge counts it.
  if (has("disability") || has("age-65-plus")) {
    const ssiPeople = persons.filter((p) => {
      if (isCitizen(p)) return true;
      if (!isQualifiedImmigrant(p)) return false;
      if (p.military) return true;
      if (isLpr(p)) return q40 && (p.gcYears ?? 0) >= 5;
      return ["refugee", "asylee"].includes(p.status);
    });
    programs.push({
      id: "ssi",
      program: "Supplemental Security Income (SSI)",
      tier: ssiPeople.length ? "possible" : "unlikely",
      who: labels(ssiPeople),
      why: ssiPeople.length
        ? "SSI is cash for people who are 65+, blind, or disabled and have very low income and resources. On these facts someone may meet the status test — SSA determines the rest."
        : "SSI is much harder for immigrants than most programs. A green card holder who entered on or after August 22, 1996 is generally not eligible for the first five years as a permanent resident, even with 40 quarters. Most qualify only through 40 qualifying quarters or military service.",
      immigrationNote:
        "SSI's immigration rules are stricter than Medicaid's or SNAP's. Work by a spouse or parent can count toward the 40 quarters for SSI specifically. Refugees and asylees have a time-limited window.",
      incomeNote: "SSI has strict income AND resource limits. SSA calculates both.",
      publicCharge: "counted",
      publicChargeNote: PC_CASH,
      sponsorNote: SPONSOR_MEANS_TESTED,
      applyLabel: "SSA — SSI for noncitizens",
      applyUrl: "https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm",
    });
    if (ssiPeople.length) {
      immigrationFlags.push(
        "SSI is cash assistance for income maintenance and is counted under the public-charge rule in both the current and the new framework. It is also a program a sponsor may be asked to reimburse. If anyone in the household has an adjustment of status filing ahead, this specific combination is worth paid legal advice.",
      );
    }
  }

  // Workers' comp — explicitly not a means-tested public benefit.
  programs.push({
    id: "workers-comp",
    program: "Workers' compensation",
    tier: "possible",
    who: labels(persons.filter((p) => !isChild(p))),
    why: "If you are injured at work, workers' compensation pays medical costs and part of your wages. It is paid through your employer's insurance, not from a public assistance budget.",
    immigrationNote:
      "This is not a federal means-tested public benefit. It is insurance your employer is required to carry, and it is generally available regardless of immigration status in most states.",
    stateNote: "Entirely state-run; rules and deadlines vary.",
    publicCharge: "not-counted",
    publicChargeNote:
      "Not counted. Workers' compensation is not a means-tested public benefit — it is employer-funded insurance. It should not be confused with public assistance.",
    applyLabel: "DOL — workers' compensation",
    applyUrl: "https://www.dol.gov/general/topic/workcomp",
  });

  /* ---------------- Tax credits ---------------- */

  const filesReturn = tax.filesUsReturn === "yes";
  const ctcKids = tax.childrenWithSsn;
  const filerSsn = tax.filerHasSsn === "yes";
  const ctcTier: Tier = filesReturn && ctcKids > 0 && filerSsn ? "strong" : ctcKids > 0 ? "possible" : "unlikely";
  programs.push({
    id: "ctc",
    program: "Child Tax Credit / Additional Child Tax Credit",
    tier: ctcTier,
    who: labels(persons.filter((p) => isChild(p))),
    why:
      ctcKids > 0
        ? `You reported ${ctcKids} qualifying ${ctcKids === 1 ? "child" : "children"} with a Social Security number. Each child must have an SSN valid for employment — a child with an ITIN is not a qualifying child for this credit.`
        : "The Child Tax Credit requires a qualifying child with a Social Security number valid for employment.",
    immigrationNote:
      "Tax credits follow tax rules, not the qualified-immigrant test. Beginning with tax year 2025 the filer also needs a valid SSN; on a joint return at least one spouse must have one and the other needs an SSN or ITIN. Visa-holder parents with SSNs and U.S.-citizen children commonly qualify.",
    incomeNote: "The credit phases out at higher incomes and the refundable portion depends on earned income.",
    publicCharge: "not-counted",
    publicChargeNote: PC_TAX,
    applyLabel: "IRS — Child Tax Credit",
    applyUrl: "https://www.irs.gov/credits-deductions/individuals/child-tax-credit",
    estimate:
      ctcTier === "strong"
        ? {
            annual: `up to ${usd(2200 * ctcKids)}`,
            confidence: "medium",
            basis:
              "The published maximum of $2,200 per qualifying child for tax year 2025 × the number of children with an SSN you reported. This is a ceiling, not a prediction: the credit phases out at higher incomes, and the refundable part (up to $1,700 per child) depends on earned income. Your actual figure comes from your return.",
            year: "Tax year 2025 (filed in 2026)",
          }
        : undefined,
  });

  const eitcTier: Tier = !filerSsn ? "unlikely" : filesReturn && pct <= 250 ? "possible" : "unlikely";
  programs.push({
    id: "eitc",
    program: "Earned Income Tax Credit",
    tier: eitcTier,
    who: filerSsn ? labels(persons.filter((p) => !isChild(p))) : [],
    why: !filerSsn
      ? "The EITC requires a Social Security number valid for employment for the filer, the spouse on a joint return, and every qualifying child. ITIN filers cannot claim it."
      : "The EITC is a refundable credit for people who work and have low to moderate earned income. The outcome depends on your earned income, filing status, and children.",
    immigrationNote:
      "The SSN requirement is the gate here, not immigration status as such. An SSN issued only to receive a federally funded benefit, and which does not authorise work, does not count. Nonresident aliens generally cannot claim the EITC.",
    incomeNote: "Income limits depend on filing status and number of children; the IRS assistant applies them.",
    publicCharge: "not-counted",
    publicChargeNote: PC_TAX,
    applyLabel: "IRS — EITC assistant",
    applyUrl: "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc",
    estimate:
      eitcTier === "possible"
        ? {
            confidence: "preliminary",
            basis:
              "Possible eligibility — official calculation required. The EITC depends on earned income, filing status, and number of qualifying children through a phase-in/phase-out formula. For scale only: the tax year 2026 maximum is $8,231 for three or more qualifying children. Most households receive far less. Use the IRS EITC Assistant.",
            year: "Tax year 2026",
          }
        : undefined,
  });

  if (!filerSsn && tax.filerHasSsn === "no") {
    programs.push({
      id: "itin-credits",
      program: "Credits an ITIN filer may still claim",
      tier: "possible",
      who: labels(persons.filter((p) => !isChild(p))),
      why: "An ITIN household is not shut out of the tax code. The Child and Dependent Care Credit, education credits, and the Saver's Credit follow different rules from the EITC.",
      immigrationNote:
        "The EITC and the Child Tax Credit have hard SSN requirements. Several other credits do not. Do not assume an ITIN means no credits — have a preparer check.",
      publicCharge: "not-counted",
      publicChargeNote: PC_TAX,
      applyLabel: "IRS — credits and deductions",
      applyUrl: "https://www.irs.gov/credits-deductions-for-individuals",
    });
  }

  /* ---------------- Education ---------------- */

  if (has("college-student")) {
    const aidEligible = persons.filter(
      (p) => isCitizen(p) || isLpr(p) || ["refugee", "asylee", "parolee"].includes(p.status),
    );
    programs.push({
      id: "fafsa",
      program: "Federal student aid (FAFSA)",
      tier: aidEligible.length ? "strong" : "unlikely",
      who: labels(aidEligible),
      why: aidEligible.length
        ? "Permanent residents, conditional permanent residents, and people whose I-94 shows Refugee, Asylum Granted, or Parolee are 'eligible noncitizens' and should file the FAFSA. There is no five-year bar for federal student aid."
        : "F-1, J-1, H-1B, H-4, L-1 and similar nonimmigrant statuses are not eligible-noncitizen categories, so federal grants and loans are generally unavailable.",
      immigrationNote:
        "Federal student aid uses its own 'eligible noncitizen' list — narrower than 'lawfully present' but not the same as the qualified-immigrant test either.",
      stateNote:
        "State aid and in-state tuition are set by state law. Several states grant in-state tuition based on where the student attended high school rather than on immigration status, and some run their own aid programs. Check your state before concluding there is no help.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "StudentAid.gov — eligibility for non-U.S. citizens",
      applyUrl: "https://studentaid.gov/understand-aid/eligibility/requirements/non-us-citizens",
    });
  }

  /* ---------------- Housing & utilities ---------------- */

  if (has("needs-housing-utility")) {
    programs.push({
      id: "housing",
      program: "Housing Choice Voucher / public housing",
      tier: "state-check",
      who: labels(persons.filter((p) => isQualifiedImmigrant(p))),
      why: "Rental assistance is run by local public housing agencies. Waiting lists are long and frequently closed, which is a bigger practical barrier than eligibility for most families.",
      immigrationNote:
        "Federal housing programs use their own eligible-status list. Mixed-status families can often receive prorated assistance based on the eligible members rather than being refused outright.",
      stateNote: "Administered by your local housing agency, not the state or federal government directly.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "HUD — Housing Choice Vouchers",
      applyUrl: "https://www.hud.gov/helping-americans/housing-choice-vouchers",
    });
    programs.push({
      id: "liheap",
      program: "LIHEAP (help with energy bills)",
      tier: "state-check",
      who: labels(persons),
      why: "LIHEAP helps with heating and cooling bills and, in some states, emergency shut-off situations. Each state sets its own income test and application window.",
      immigrationNote:
        "LIHEAP rules are set by the state. Many states do not apply an immigration test to the household when a member is eligible.",
      stateNote: "Funding is limited and often runs out — apply as early in the season as you can.",
      publicCharge: "not-counted",
      publicChargeNote: PC_NONCASH,
      applyLabel: "HHS — find your state LIHEAP office",
      applyUrl: "https://www.acf.hhs.gov/ocs/map/liheap-map-state-and-territory-contact-listing",
    });
  }

  /* ---------------- Immigration flags ---------------- */

  const pcSubject = persons.filter(
    (p) => p.status === "pending-aos" || (!isCitizen(p) && !isLpr(p) && isLawfullyPresent(p)),
  );
  if (pcSubject.length) {
    immigrationFlags.push(
      `Public charge applies when someone applies for admission or adjustment of status. On these facts that could be relevant to ${pcSubject.map((p) => p.label).join(", ")}. It does not apply to green card renewal or naturalisation.`,
    );
  }
  const exempt = persons.filter((p) => ["refugee", "asylee"].includes(p.status));
  if (exempt.length) {
    immigrationFlags.push(
      `${exempt.map((p) => p.label).join(", ")} is in a category that is exempt from the public-charge ground of inadmissibility. Benefit use should not create a public-charge problem for an exempt applicant — though the new framework notes officers may look at the circumstances of receipt if someone later adjusts under a non-exempt category.`,
    );
  }
  const sponsored = persons.filter((p) => p.sponsoredI864 === "yes");
  if (sponsored.length) {
    immigrationFlags.push(
      `${sponsored.map((p) => p.label).join(", ")} was sponsored on Form I-864. That is a separate issue from public charge: if a sponsored immigrant receives a federal means-tested benefit, the agency can ask the sponsor to reimburse it. It creates a debt for the sponsor — it cannot block a green card. The obligation usually ends at citizenship or 40 qualifying quarters.`,
    );
  }
  immigrationFlags.push(
    "On Form I-485 you must exclude income received from means-tested public benefits when reporting household income. Including it can create a misrepresentation problem, which is far more serious than the benefit itself. Read the instructions carefully or have them reviewed.",
  );

  notInTotal.push("Medicaid, CHIP, WIC and school meals — these are coverage and food, not cash; a dollar value would be invented");
  notInTotal.push("Any state-run program — the state sets the amount");

  assumptions.push(
    "Dollar figures shown are published maximums or official formula outputs, never predictions of what you will receive.",
  );
  assumptions.push(
    "We do not add programs together into a single household total, because several of them interact — qualifying for one can change or remove another.",
  );

  return {
    fplPct: pct,
    programs,
    immigrationFlags,
    notInTotal,
    assumptions,
    sponsorRisk: sponsored.length > 0 || persons.some((p) => p.sponsoredI864 === "unknown" && isLpr(p)),
  };
}

/* ------------------------------------------------------------------ *
 * Grouping for display (Phase 5 result groups)
 * ------------------------------------------------------------------ */

export interface ResultGroup {
  id: string;
  title: string;
  blurb: string;
  programs: ProgramResult[];
}

export function groupResults(r: ScreenerResult): ResultGroup[] {
  const by = (t: Tier) => r.programs.filter((p) => p.tier === t);
  return [
    {
      id: "strong",
      title: "Strong possibilities",
      blurb:
        "On the facts you gave, these look most promising. They are still not decisions — the agency decides.",
      programs: by("strong"),
    },
    {
      id: "possible",
      title: "Possible, but more information is needed",
      blurb: "These depend on a fact we did not collect, or on a calculation only the agency can run.",
      programs: by("possible"),
    },
    {
      id: "state",
      title: "State or local programs to check",
      blurb:
        "These are genuinely set by your state or local agency. We will not guess a number that your state defines.",
      programs: by("state-check"),
    },
    {
      id: "unlikely",
      title: "Probably unavailable under the selected facts",
      blurb:
        "Change a fact — status, income, or time held — and these can change. They are not permanent conclusions.",
      programs: by("unlikely"),
    },
    {
      id: "review",
      title: "Worth professional review",
      blurb: "These raise a question that deserves an individual answer.",
      programs: by("immigration"),
    },
  ].filter((g) => g.programs.length > 0);
}

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

export function usd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
