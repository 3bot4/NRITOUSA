/**
 * Pure, deterministic projection math for the Trump Account "generational
 * wealth" page and its Millionaire Calculator.
 *
 * Shared by BOTH the server-rendered static projection table and the client
 * calculator so the two never drift. No React, no hooks, no side effects — safe
 * to import from a server component or a "use client" component.
 *
 * Assumptions (kept explicit so the disclaimers can state them):
 *   - Annual compounding.
 *   - The optional $1,000 federal seed lands at the start (t = 0).
 *   - Contributions are made at the END of each year (years 1..contributionYears).
 *   - After contributions stop, the balance keeps compounding to the target age.
 *
 * These are illustrative projections, NOT guarantees. Returns are not
 * guaranteed, fees/taxes/timing/rule changes all affect the real result.
 */

/** The one-time federal pilot ("seed") contribution amount, in dollars. */
export const FEDERAL_SEED_AMOUNT = 1000;

export interface ProjectionInput {
  /** Child's age today, in whole years (0 = newborn). */
  childCurrentAge: number;
  /** Money already in the account today, in dollars. */
  startingBalance: number;
  /** Add the one-time $1,000 federal seed at t = 0. */
  includeSeed: boolean;
  /** Family contribution added at the end of each contributing year, in dollars. */
  annualContribution: number;
  /** Number of years the family keeps contributing. */
  contributionYears: number;
  /** Expected average annual return, as a percent (7 = 7%). */
  annualReturnPct: number;
}

/** Total the FAMILY puts in (the $1,000 federal seed is not family money). */
export function totalFamilyContributions(inp: ProjectionInput): number {
  return Math.max(0, inp.annualContribution) * Math.max(0, inp.contributionYears);
}

/**
 * Projected account value when the child reaches `targetAge`.
 * Returns null when the target age is in the past relative to the child's
 * current age (nothing meaningful to project).
 */
export function projectedValueAtAge(inp: ProjectionInput, targetAge: number): number | null {
  const n = targetAge - inp.childCurrentAge;
  if (n < 0) return null;

  const r = inp.annualReturnPct / 100;
  const base =
    Math.max(0, inp.startingBalance) + (inp.includeSeed ? FEDERAL_SEED_AMOUNT : 0);

  // Base (starting balance + seed) compounds for the full period.
  let fv = base * Math.pow(1 + r, n);

  // Each end-of-year contribution compounds for the remaining years.
  const years = Math.min(Math.max(0, inp.contributionYears), n);
  const annual = Math.max(0, inp.annualContribution);
  for (let k = 1; k <= years; k++) {
    fv += annual * Math.pow(1 + r, n - k);
  }
  return fv;
}

/** The standard milestone ages surfaced across the page and calculator. */
export const MILESTONE_AGES = [18, 30, 40, 50] as const;

export interface MilestoneRow {
  age: number;
  value: number | null;
}

export function milestoneProjection(inp: ProjectionInput): MilestoneRow[] {
  return MILESTONE_AGES.map((age) => ({ age, value: projectedValueAtAge(inp, age) }));
}
