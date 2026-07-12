/**
 * H-1B wage-weighted lottery odds estimator (FY 2027+).
 *
 * Transparent, editable, educational model — NOT a prediction of USCIS behavior.
 * Every assumption lives in `ODDS_CONFIG` so it can be revised each cap season
 * without touching the math. Outputs are always RANGES, never exact odds.
 *
 * Model in one paragraph:
 *   Starting FY 2027, DHS/USCIS uses a wage-weighted selection: a beneficiary's
 *   OEWS wage level buys weighted entries (Level I = 1 … Level IV = 4). The
 *   chance a person is drawn is approximated as 1 - (1 - p)^weight, where p is
 *   the per-ticket probability for the relevant cap draw. U.S. master's-cap
 *   candidates get a two-step estimate: the regular 65,000 draw first, then the
 *   20,000 advanced-degree draw if not selected.
 */

export type DegreeCategory = "regular" | "masters";
export type WageLevel = "I" | "II" | "III" | "IV" | "unknown";

export interface WageDistribution {
  I: number;
  II: number;
  III: number;
  IV: number;
}

export interface OddsConfig {
  /** Regular H-1B cap (bachelor's + everyone). */
  regularCap: number;
  /** Advanced-degree exemption (U.S. master's or higher). */
  mastersCap: number;
  /** Lottery weight per OEWS wage level. */
  weights: Record<Exclude<WageLevel, "unknown">, number>;
  /** Default assumed distribution of registrations across wage levels (editable). */
  wageDistribution: WageDistribution;
  /**
   * Assumed share of all unique beneficiaries who are U.S. master's-cap
   * eligible. Only used to size the second (advanced-degree) draw. Editable.
   */
  mastersShare: number;
  /** Relative half-width of the estimate band for a KNOWN wage level (±). */
  bandKnown: number;
  /** Wider band when the applicant does not know their wage level (±). */
  bandUnknown: number;
}

/** Central, editable configuration. Revise each cap season. */
export const ODDS_CONFIG: OddsConfig = {
  regularCap: 65_000,
  mastersCap: 20_000,
  weights: { I: 1, II: 2, III: 3, IV: 4 },
  wageDistribution: { I: 0.4, II: 0.42, III: 0.11, IV: 0.07 },
  mastersShare: 0.4,
  bandKnown: 0.18,
  bandUnknown: 0.32,
};

/** Registration-volume scenarios (unique beneficiaries). Editable. */
export const VOLUME_SCENARIOS = {
  high: { label: "High competition", totalBeneficiaries: 450_000 },
  baseline: { label: "Baseline", totalBeneficiaries: 320_000 },
  low: { label: "Lower competition", totalBeneficiaries: 220_000 },
} as const;

export type VolumeScenarioKey = keyof typeof VOLUME_SCENARIOS;

export interface OddsInput {
  degreeCategory: DegreeCategory;
  wageLevel: WageLevel;
  totalBeneficiaries: number;
  /** Optional override of the assumed wage-level distribution. */
  wageDistribution?: WageDistribution;
  /** Number of future attempts (1–4). */
  attempts: number;
  config?: OddsConfig;
}

export interface OddsResult {
  oneYearLow: number;
  oneYearHigh: number;
  multiYearLow: number;
  multiYearHigh: number;
  /** Numeric weight used (weighted-average when wage level is unknown). */
  wageWeight: number;
  /** Display label for the weight, e.g. "3x" or "~1.85x (unknown)". */
  wageWeightLabel: string;
  /** Plain-English interpretation bucket. */
  interpretation: "low" | "moderate" | "stronger" | "unknown";
  explanation: string;
  assumptionsUsed: string[];
}

const clampProb = (p: number) => Math.min(0.99, Math.max(0.001, p));
const pct = (p: number) => `${Math.round(p * 100)}%`;

/** Average weighted tickets per beneficiary given a wage distribution. */
function averageWeight(dist: WageDistribution, w: OddsConfig["weights"]): number {
  return dist.I * w.I + dist.II * w.II + dist.III * w.III + dist.IV * w.IV;
}

/**
 * Estimate FY 2027 wage-weighted H-1B selection odds as a range.
 * Transparent assumptions only — see `assumptionsUsed` in the result.
 */
export function calculateH1BOdds(input: OddsInput): OddsResult {
  const cfg = input.config ?? ODDS_CONFIG;
  const dist = input.wageDistribution ?? cfg.wageDistribution;
  const attempts = Math.min(4, Math.max(1, Math.round(input.attempts || 1)));
  const N = Math.max(1, input.totalBeneficiaries);

  const avgW = averageWeight(dist, cfg.weights);
  const isUnknown = input.wageLevel === "unknown";
  const weight = isUnknown
    ? avgW
    : cfg.weights[input.wageLevel as Exclude<WageLevel, "unknown">];
  const wageWeightLabel = isUnknown
    ? `~${avgW.toFixed(2)}x (wage level unknown)`
    : `${weight}x`;

  // Total weighted tickets in the pool = Σ registrations(level) × weight(level).
  const weightedTickets = N * avgW;

  // Regular 65,000 draw runs against ALL registrations (masters included).
  const pRegular = clampProb(cfg.regularCap / weightedTickets);
  const regularChance = clampProb(1 - Math.pow(1 - pRegular, weight));

  let oneYear = regularChance;

  if (input.degreeCategory === "masters") {
    // Two-step: if not selected in the regular draw, compete in the 20,000
    // advanced-degree draw against the remaining (unselected) masters pool.
    const mastersTickets = N * cfg.mastersShare * avgW;
    // Fraction of the masters pool already taken in the regular round (rough).
    const regularTakeRate = clampProb(cfg.regularCap / N);
    const remainingMastersTickets = Math.max(1, mastersTickets * (1 - regularTakeRate));
    const pAdv = clampProb(cfg.mastersCap / remainingMastersTickets);
    const advChance = clampProb(1 - Math.pow(1 - pAdv, weight));
    oneYear = clampProb(regularChance + (1 - regularChance) * advChance);
  }

  const band = isUnknown ? cfg.bandUnknown : cfg.bandKnown;
  const oneYearLow = clampProb(oneYear * (1 - band));
  const oneYearHigh = clampProb(oneYear * (1 + band));

  // Independent-attempts approximation: 1 - (1 - oneYear)^attempts.
  const multiYearLow = clampProb(1 - Math.pow(1 - oneYearLow, attempts));
  const multiYearHigh = clampProb(1 - Math.pow(1 - oneYearHigh, attempts));

  // Interpretation bucket from the single-year midpoint.
  let interpretation: OddsResult["interpretation"];
  if (isUnknown) interpretation = "unknown";
  else if (oneYear < 0.25) interpretation = "low";
  else if (oneYear < 0.45) interpretation = "moderate";
  else interpretation = "stronger";

  const degreeText =
    input.degreeCategory === "masters"
      ? "a qualifying U.S. master's degree (two draws: regular 65,000 cap + 20,000 advanced-degree cap)"
      : "the regular 65,000 cap only";

  const explanation = isUnknown
    ? `Because your wage level is unknown, this estimate uses the pool's average weighting (~${avgW.toFixed(2)}x) and a wider range. Confirm your OEWS wage level for a sharper number. You are estimated against ${degreeText}.`
    : `At Wage Level ${input.wageLevel} (${weight}x weighted entries) competing under ${degreeText}, a single year's estimated selection chance is roughly ${pct(oneYearLow)}–${pct(
        oneYearHigh
      )}. Over ${attempts} attempt${attempts > 1 ? "s" : ""}, the estimated chance rises to about ${pct(
        multiYearLow
      )}–${pct(multiYearHigh)}. Higher wage levels get more weighted entries but are never guaranteed selection.`;

  const assumptionsUsed = [
    `Statutory cap: ${cfg.regularCap.toLocaleString()} regular + ${cfg.mastersCap.toLocaleString()} U.S. advanced-degree = ${(
      cfg.regularCap + cfg.mastersCap
    ).toLocaleString()} total.`,
    `Wage weighting: Level I=${cfg.weights.I}×, II=${cfg.weights.II}×, III=${cfg.weights.III}×, IV=${cfg.weights.IV}×.`,
    `Assumed unique beneficiaries: ${N.toLocaleString()}.`,
    `Assumed wage-level mix: Level I ${pct(dist.I)}, II ${pct(dist.II)}, III ${pct(dist.III)}, IV ${pct(
      dist.IV
    )} (editable).`,
    `Total weighted tickets ≈ ${Math.round(weightedTickets).toLocaleString()} (beneficiaries × ${avgW.toFixed(
      2
    )} avg weight).`,
    input.degreeCategory === "masters"
      ? `Master's-cap share of pool assumed at ${pct(cfg.mastersShare)} for the second draw.`
      : `Regular-cap candidate: modeled in the 65,000 draw only.`,
    `Per-person chance ≈ 1 − (1 − p)^weight; multi-year ≈ 1 − (1 − oneYear)^attempts.`,
  ];

  return {
    oneYearLow,
    oneYearHigh,
    multiYearLow,
    multiYearHigh,
    wageWeight: weight,
    wageWeightLabel,
    interpretation,
    explanation,
    assumptionsUsed,
  };
}

/** Format a probability 0–1 as an integer percent string (exported for UI). */
export const formatPct = pct;
