/**
 * US degree ROI engine — a 10-year net-worth projection across four paths.
 *
 * Deliberate design choices:
 *  - Every assumption is an explicit, editable input. Nothing is hidden in a
 *    constant the reader cannot see or change.
 *  - The "never go" baseline is modelled with the same rigour as the US
 *    scenarios. A comparison that flatters the US path by giving the India
 *    path no salary growth is not a comparison.
 *  - Money is modelled in USD internally; the UI converts for display. The FX
 *    rate is a user input, never a fetched or hardcoded live rate, because a
 *    10-year projection built on today's spot rate is false precision.
 *  - Career capital is scored SEPARATELY from money and never folded into the
 *    dollar figure. Mobility and credential value are real but not
 *    denominated in dollars, and pretending otherwise would be dishonest.
 *
 * Pure functions — no React, no I/O, no Date.now().
 */

export type ScenarioId = "us-career" | "opt-fee" | "return-india" | "never-go";

export interface RoiInput {
  /** Total tuition for the whole program, USD. */
  tuitionTotalUsd: number;
  /** Living costs per year while studying, USD. */
  livingCostPerYearUsd: number;
  /** Program length in years. */
  programYears: number;

  /** Share of the total cost funded by loan (0–1). Remainder is family money. */
  loanShare: number;
  /** Annual interest rate on the education loan, percent. */
  loanRatePct: number;
  /** Loan repayment term in years, starting after graduation. */
  loanTermYears: number;

  /** Starting US salary after graduation, USD. */
  usStartSalaryUsd: number;
  /** Annual US salary growth, percent. */
  usSalaryGrowthPct: number;
  /** Combined effective tax rate on US income, percent. */
  usTaxRatePct: number;
  /** Annual living costs while working in the US, USD. */
  usLivingCostUsd: number;

  /** Starting salary in India, ₹ lakh per annum. */
  indiaStartSalaryLpa: number;
  /** Annual salary growth in India, percent. */
  indiaSalaryGrowthPct: number;
  /** Combined effective tax rate on Indian income, percent. */
  indiaTaxRatePct: number;
  /** Annual living costs in India, ₹ lakh per annum. */
  indiaLivingCostLpa: number;
  /** Salary premium a US degree + US experience commands in India, percent. */
  indiaReturnPremiumPct: number;

  /** ₹ per US dollar. A user input, not a live rate. */
  fxRateInrPerUsd: number;
  /** Annual return on invested savings, percent. */
  investmentReturnPct: number;

  /**
   * Probability an employer sponsors H-1B, 0–1. Exposed as an input because
   * it is the single most consequential and most uncertain number in the
   * model, and readers should be able to see the result move.
   */
  sponsorshipProbability: number;
  /** Years worked in the US before returning, for the return-to-India path. */
  usYearsBeforeReturn: number;
  /** Projection horizon in years, measured from the start of the program. */
  horizonYears: number;
}

export const DEFAULT_ROI_INPUT: RoiInput = {
  tuitionTotalUsd: 60000,
  livingCostPerYearUsd: 20000,
  programYears: 2,
  loanShare: 0.7,
  loanRatePct: 10,
  loanTermYears: 10,
  usStartSalaryUsd: 95000,
  usSalaryGrowthPct: 6,
  usTaxRatePct: 28,
  usLivingCostUsd: 42000,
  indiaStartSalaryLpa: 12,
  indiaSalaryGrowthPct: 10,
  indiaTaxRatePct: 25,
  indiaLivingCostLpa: 6,
  indiaReturnPremiumPct: 30,
  fxRateInrPerUsd: 88,
  investmentReturnPct: 7,
  sponsorshipProbability: 0.6,
  usYearsBeforeReturn: 3,
  horizonYears: 10,
};

export interface YearPoint {
  /** Year index from the start of the program: 0 = first year of study. */
  year: number;
  /**
   * Cumulative net worth in USD at the end of that year — savings and
   * investments MINUS any outstanding education loan. Subtracting the loan is
   * the whole point: reporting accumulated savings while a student still owes
   * $60,000 shows a positive "net worth" for someone who is underwater, which
   * is exactly the flattery this page exists to avoid.
   */
  netWorthUsd: number;
  /** Savings and investments only, before the loan is deducted. */
  savingsUsd: number;
  /** Outstanding loan balance in USD. */
  loanBalanceUsd: number;
  /** Where the person is in this year. */
  stage: "studying" | "working-us" | "working-india" | "job-search";
  /** Whether this year's figures are probability-weighted. */
  weighted: boolean;
}

export interface ScenarioResult {
  id: ScenarioId;
  label: string;
  /** Short description shown under the label. */
  summary: string;
  series: YearPoint[];
  /** Net worth at the horizon, USD. */
  finalNetWorthUsd: number;
  /** First year index where net worth turns non-negative, or null. */
  breakEvenYear: number | null;
  /**
   * Total cost of the degree: money spent plus loan interest, both the
   * interest capitalised during study and the interest paid in repayment.
   * Interest that would still be paid after the projection horizon is not
   * included — see loanOutstandingAtHorizonUsd.
   */
  totalDegreeCostUsd: number;
  /** Loan still owed at the end of the horizon, USD. 0 when fully repaid. */
  loanOutstandingAtHorizonUsd: number;
  /** True when this scenario models something that is not current law. */
  speculative: boolean;
  /** Note shown alongside the scenario. */
  note?: string;
}

export interface RoiResult {
  scenarios: ScenarioResult[];
  best: ScenarioResult;
  /** The "never go" path, for reference. */
  baseline: ScenarioResult;
  /** One-sentence verdict. */
  verdict: string;
  /** How much the best path beats the baseline by, USD. */
  spreadVsBaselineUsd: number;
  careerCapital: CareerCapitalResult;
}

/* ─────────────────────────────── helpers ───────────────────────────────── */

const lpaToUsd = (lpa: number, fx: number) => (lpa * 100_000) / fx;

function amortisedAnnualPayment(
  principal: number,
  ratePct: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  const r = ratePct / 100;
  if (r === 0) return principal / years;
  return (principal * r) / (1 - Math.pow(1 + r, -years));
}

/* ───────────────────────────── core simulation ─────────────────────────── */

interface SimOptions {
  /** Year index at which the person moves to India (never = Infinity). */
  returnToIndiaAtYear: number;
  /** Extra one-off cost applied at the start of work, USD. */
  extraUpfrontCostUsd: number;
  /** Probability weight applied to US employment income. */
  employmentProbability: number;
  /** Skip the degree entirely — the India baseline. */
  skipDegree: boolean;
}

function simulate(input: RoiInput, opts: SimOptions): {
  series: YearPoint[];
  totalDegreeCostUsd: number;
  loanOutstandingAtHorizonUsd: number;
} {
  const {
    tuitionTotalUsd,
    livingCostPerYearUsd,
    programYears,
    loanShare,
    loanRatePct,
    loanTermYears,
    usStartSalaryUsd,
    usSalaryGrowthPct,
    usTaxRatePct,
    usLivingCostUsd,
    indiaStartSalaryLpa,
    indiaSalaryGrowthPct,
    indiaTaxRatePct,
    indiaLivingCostLpa,
    indiaReturnPremiumPct,
    fxRateInrPerUsd,
    investmentReturnPct,
    horizonYears,
  } = input;

  const series: YearPoint[] = [];
  let netWorth = 0;
  let loanBalance = 0;
  let interestPaid = 0;
  let interestDuringStudy = 0;

  const point = (
    year: number,
    stage: YearPoint["stage"],
    weighted: boolean
  ): YearPoint => ({
    year,
    netWorthUsd: round0(netWorth - loanBalance),
    savingsUsd: round0(netWorth),
    loanBalanceUsd: round0(loanBalance),
    stage,
    weighted,
  });

  const costPerStudyYear =
    programYears > 0
      ? tuitionTotalUsd / programYears + livingCostPerYearUsd
      : 0;
  const studyYears = opts.skipDegree ? 0 : programYears;

  // Family-funded money is real money spent, so it reduces net worth directly.
  // Loan money does not reduce net worth on day one — it creates a liability
  // that is repaid later with interest.
  const annualPayment = () =>
    amortisedAnnualPayment(loanBalance, loanRatePct, loanTermYears);
  let fixedPayment = 0;

  for (let year = 0; year < horizonYears; year++) {
    const isStudying = year < studyYears;
    const invReturn = investmentReturnPct / 100;

    if (isStudying) {
      const loanPortion = costPerStudyYear * loanShare;
      const familyPortion = costPerStudyYear * (1 - loanShare);
      // Interest accrues during study on most Indian education loans, and is
      // capitalised into the balance. Tracked separately so it is not lost
      // from the cost total when it is later repaid as "principal".
      const studyInterest = loanBalance * (loanRatePct / 100);
      interestDuringStudy += studyInterest;
      loanBalance = loanBalance + studyInterest + loanPortion;
      netWorth -= familyPortion;
      series.push(point(year, "studying", false));
      continue;
    }

    // First working year: fix the repayment schedule off the balance at
    // graduation, and apply any one-off cost.
    if (fixedPayment === 0 && loanBalance > 0) {
      fixedPayment = annualPayment();
    }
    if (year === studyYears && opts.extraUpfrontCostUsd > 0) {
      netWorth -= opts.extraUpfrontCostUsd;
    }

    const workYearIndex = year - studyYears;
    const inIndia = year >= opts.returnToIndiaAtYear;

    let netIncome: number;
    let livingCost: number;
    let stage: YearPoint["stage"];

    if (opts.skipDegree || inIndia) {
      // India earnings. Someone returning after US study and work carries a
      // premium; the never-go baseline does not.
      const premium = opts.skipDegree ? 0 : indiaReturnPremiumPct / 100;
      const yearsOfExperience = opts.skipDegree
        ? year
        : Math.max(0, year - studyYears);
      const grossLpa =
        indiaStartSalaryLpa *
        (1 + premium) *
        Math.pow(1 + indiaSalaryGrowthPct / 100, yearsOfExperience);
      const grossUsd = lpaToUsd(grossLpa, fxRateInrPerUsd);
      netIncome = grossUsd * (1 - indiaTaxRatePct / 100);
      livingCost = lpaToUsd(indiaLivingCostLpa, fxRateInrPerUsd);
      stage = "working-india";
    } else {
      const grossUsd =
        usStartSalaryUsd *
        Math.pow(1 + usSalaryGrowthPct / 100, workYearIndex);
      const full = grossUsd * (1 - usTaxRatePct / 100);
      // Probability weighting: the fraction of the outcome space in which the
      // person is not employed in the US falls back to India earnings rather
      // than to zero, which is what actually happens.
      const p = opts.employmentProbability;
      const fallbackLpa =
        indiaStartSalaryLpa *
        (1 + indiaReturnPremiumPct / 100) *
        Math.pow(1 + indiaSalaryGrowthPct / 100, workYearIndex);
      const fallbackNet =
        lpaToUsd(fallbackLpa, fxRateInrPerUsd) * (1 - indiaTaxRatePct / 100);
      netIncome = full * p + fallbackNet * (1 - p);
      livingCost =
        usLivingCostUsd * p +
        lpaToUsd(indiaLivingCostLpa, fxRateInrPerUsd) * (1 - p);
      stage = p < 1 ? "job-search" : "working-us";
    }

    // Loan servicing.
    let payment = 0;
    if (loanBalance > 0) {
      const interest = loanBalance * (loanRatePct / 100);
      payment = Math.min(fixedPayment, loanBalance + interest);
      interestPaid += Math.min(interest, payment);
      loanBalance = Math.max(0, loanBalance + interest - payment);
    }

    const savings = netIncome - livingCost - payment;
    netWorth = netWorth * (1 + invReturn) + savings;

    series.push(
      point(
        year,
        stage,
        !opts.skipDegree && !inIndia && opts.employmentProbability < 1
      )
    );
  }

  const principal = opts.skipDegree
    ? 0
    : costPerStudyYear * programYears * loanShare;
  const family = opts.skipDegree
    ? 0
    : costPerStudyYear * programYears * (1 - loanShare);

  return {
    series,
    totalDegreeCostUsd: round0(
      principal + family + interestDuringStudy + interestPaid
    ),
    loanOutstandingAtHorizonUsd: round0(loanBalance),
  };
}

function round0(n: number): number {
  return Math.round(n);
}

function breakEven(series: YearPoint[]): number | null {
  const hit = series.find((p) => p.netWorthUsd >= 0 && p.stage !== "studying");
  return hit ? hit.year : null;
}

/* ────────────────────────────── career capital ─────────────────────────── */

export interface CareerCapitalResult {
  /** 0–100 score for how portable the resulting credential profile is. */
  mobilityScore: number;
  band: "limited" | "moderate" | "strong" | "exceptional";
  headline: string;
  drivers: { label: string; detail: string; earned: boolean }[];
  /**
   * The specific point the money model cannot express: US work experience is
   * a durable asset that survives leaving the US.
   */
  durabilityNote: string;
}

/**
 * Scores the non-monetary payoff of the path. Kept explicitly separate from
 * the dollar projection: these are structural advantages in hiring and in
 * other countries' immigration systems, and converting them into a fake
 * dollar figure would be worse than leaving them uncounted.
 */
export function scoreCareerCapital(input: RoiInput): CareerCapitalResult {
  const usYears = Math.max(0, input.usYearsBeforeReturn);
  const drivers = [
    {
      label: "Accredited US degree",
      detail:
        "Recognised by credential-assessment bodies worldwide and used as the qualifying criterion by unsponsored routes such as the UK's High Potential Individual visa.",
      earned: true,
    },
    {
      label: "Any US work experience",
      detail:
        "Converts the degree from a claim about potential into a verifiable track record with callable references.",
      earned: usYears >= 1,
    },
    {
      label: "Three or more years of US experience",
      detail:
        "The point at which experience is deep enough to count as skilled work in points-based immigration systems and to price into a senior hire.",
      earned: usYears >= 3,
    },
    {
      label: "Five or more years of US experience",
      detail:
        "Enough of a track record to move markets on your own terms — senior roles, sponsored routes elsewhere, or a return to India at a materially different level.",
      earned: usYears >= 5,
    },
  ];

  const earned = drivers.filter((d) => d.earned).length;
  const mobilityScore = Math.min(100, 25 * earned);
  const band: CareerCapitalResult["band"] =
    earned >= 4 ? "exceptional" : earned === 3 ? "strong" : earned === 2 ? "moderate" : "limited";

  const headline =
    usYears === 0
      ? "A US degree alone is portable, but it is a claim about potential. Work experience is what converts it into evidence."
      : `${usYears} ${usYears === 1 ? "year" : "years"} of US work experience turns the degree into a documented track record — the part of this that no visa decision can take back.`;

  return {
    mobilityScore,
    band,
    headline,
    drivers,
    durabilityNote:
      "Nothing in the dollar projection above captures this. A visa expires and can be revoked; the years on your résumé cannot. Even in the scenario where you leave the US, the experience keeps paying out in every hiring market and counts as skilled foreign work experience in points-based systems such as Canada's Express Entry.",
  };
}

/* ─────────────────────────────── entry point ───────────────────────────── */

export function computeDegreeRoi(input: RoiInput): RoiResult {
  const { programYears, usYearsBeforeReturn, sponsorshipProbability } = input;

  const usCareer = simulate(input, {
    returnToIndiaAtYear: Infinity,
    extraUpfrontCostUsd: 0,
    employmentProbability: sponsorshipProbability,
    skipDegree: false,
  });

  // Models the reported-but-unpublished OPT fee as a shock to the sponsorship
  // rate rather than as a bill to the student, because no version of the
  // reporting says the student pays it.
  const optFeeProb = Math.max(0, sponsorshipProbability * 0.45);
  const optFee = simulate(
    { ...input, sponsorshipProbability: optFeeProb },
    {
      returnToIndiaAtYear: Infinity,
      extraUpfrontCostUsd: 0,
      employmentProbability: optFeeProb,
      skipDegree: false,
    }
  );

  const returnIndia = simulate(input, {
    returnToIndiaAtYear: programYears + usYearsBeforeReturn,
    extraUpfrontCostUsd: 0,
    employmentProbability: sponsorshipProbability,
    skipDegree: false,
  });

  const neverGo = simulate(input, {
    returnToIndiaAtYear: 0,
    extraUpfrontCostUsd: 0,
    employmentProbability: 1,
    skipDegree: true,
  });

  const build = (
    id: ScenarioId,
    label: string,
    summary: string,
    sim: {
      series: YearPoint[];
      totalDegreeCostUsd: number;
      loanOutstandingAtHorizonUsd: number;
    },
    speculative = false,
    note?: string
  ): ScenarioResult => ({
    id,
    label,
    summary,
    series: sim.series,
    finalNetWorthUsd: sim.series.at(-1)?.netWorthUsd ?? 0,
    breakEvenYear: breakEven(sim.series),
    totalDegreeCostUsd: sim.totalDegreeCostUsd,
    loanOutstandingAtHorizonUsd: sim.loanOutstandingAtHorizonUsd,
    speculative,
    note,
  });

  const scenarios: ScenarioResult[] = [
    build(
      "us-career",
      "Stay and build a US career",
      `Study, then OPT and a STEM extension, then H-1B — weighted at your ${Math.round(sponsorshipProbability * 100)}% sponsorship assumption.`,
      usCareer,
      false,
      "The $100,000 H-1B proclamation payment is not modelled as a cost here because it is not being collected — a federal court vacated it and the First Circuit declined to reinstate it. It also never applied to a student changing status inside the US."
    ),
    build(
      "opt-fee",
      "If the proposed OPT fee happened",
      "A stress test in which the reported OPT fee materialises and employers pull back sharply from hiring new graduates.",
      optFee,
      true,
      "PROPOSED ONLY. No rule has been published and no amount exists in regulation. This scenario models a collapse in sponsorship appetite, not a bill you would pay — under every version of the reporting, the fee would fall on employers."
    ),
    build(
      "return-india",
      `Return to India after ${usYearsBeforeReturn} ${usYearsBeforeReturn === 1 ? "year" : "years"}`,
      `Study, work in the US for ${usYearsBeforeReturn} ${usYearsBeforeReturn === 1 ? "year" : "years"}, then move back carrying a ${input.indiaReturnPremiumPct}% salary premium.`,
      returnIndia,
      false,
      "The premium is your editable assumption, not a measured figure. It reflects what employers hiring for global roles pay for US-standard experience."
    ),
    build(
      "never-go",
      "Never go — build a career in India",
      "The baseline. No tuition, no loan, no relocation, earning and compounding in India from year one.",
      neverGo
    ),
  ];

  const baseline = scenarios.find((s) => s.id === "never-go")!;
  const realistic = scenarios.filter((s) => !s.speculative);
  const best = realistic.reduce((a, b) =>
    b.finalNetWorthUsd > a.finalNetWorthUsd ? b : a
  );
  const spread = best.finalNetWorthUsd - baseline.finalNetWorthUsd;

  const verdict =
    best.id === "never-go"
      ? `On your assumptions, staying in India comes out ahead over ${input.horizonYears} years. That result is driven mostly by the cost of the degree and your sponsorship assumption — move either and the ranking can flip.`
      : `On your assumptions, "${best.label}" leads after ${input.horizonYears} years, ahead of the stay-in-India baseline by about ${Math.abs(spread).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}. The money is only half the picture — see the career-capital section below for the part this chart cannot show.`;

  return {
    scenarios,
    best,
    baseline,
    verdict,
    spreadVsBaselineUsd: spread,
    careerCapital: scoreCareerCapital(input),
  };
}
