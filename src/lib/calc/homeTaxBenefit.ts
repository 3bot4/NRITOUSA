/**
 * Incremental US tax benefit of homeownership.
 *
 * The previous rent-vs-buy model multiplied (mortgage interest + capped
 * property tax) by the marginal rate every year, unconditionally. That
 * overstates the benefit: a taxpayer only gains from the mortgage-interest and
 * property-tax deductions to the extent their itemized deductions WITH the home
 * exceed what they would deduct anyway — either their other itemized deductions
 * or the standard deduction, whichever is larger.
 *
 * This computes the true incremental deduction and defaults to ZERO whenever it
 * cannot establish that itemizing with the home beats the alternative.
 *
 * SALT-cap value comes from the sourced tax-year config. Because the exact 2026
 * cap could not be confirmed to a primary source, the caller must treat any
 * benefit as an estimate and the tool defaults to standard-deduction mode.
 */

export interface HomeBenefitInput {
  /** Deductible mortgage interest for the year. */
  mortgageInterest: number;
  /** Property tax for the year. */
  propertyTax: number;
  /** Other state/local tax already paid (income/sales), before the home. */
  otherSaltPaid: number;
  /** Other itemized deductions unrelated to the home (e.g. charity). */
  otherItemized: number;
  /** Filing-status standard deduction for the tax year. */
  standardDeduction: number;
  /** SALT deduction cap for the tax year. */
  saltCap: number;
  /** Marginal rate applied to the incremental deduction, decimal. */
  marginalRate: number;
  /**
   * Whether the user itemizes. When false, homeownership yields NO incremental
   * deduction (they take the standard deduction), so the benefit is zero.
   */
  itemize: boolean;
}

export interface HomeBenefitResult {
  /** Deduction attributable to the home, over and above the alternative. */
  incrementalDeduction: number;
  /** incrementalDeduction x marginalRate. */
  taxBenefit: number;
  /** True when a positive incremental benefit was established. */
  hasBenefit: boolean;
}

export function homeTaxBenefit(input: HomeBenefitInput): HomeBenefitResult {
  const none: HomeBenefitResult = {
    incrementalDeduction: 0,
    taxBenefit: 0,
    hasBenefit: false,
  };

  // Standard-deduction users get no incremental deduction from the home.
  if (!input.itemize) return none;

  // SALT is capped; the home adds property tax up to the remaining cap room.
  const saltWithoutHome = Math.min(Math.max(0, input.otherSaltPaid), input.saltCap);
  const saltWithHome = Math.min(
    Math.max(0, input.otherSaltPaid) + Math.max(0, input.propertyTax),
    input.saltCap,
  );

  const itemizedWithoutHome = Math.max(0, input.otherItemized) + saltWithoutHome;
  const itemizedWithHome =
    Math.max(0, input.otherItemized) + saltWithHome + Math.max(0, input.mortgageInterest);

  // Incremental deduction = what itemizing WITH the home gives you, minus the
  // larger of (itemizing without the home) or (the standard deduction).
  const alternative = Math.max(itemizedWithoutHome, input.standardDeduction);
  const incrementalDeduction = Math.max(0, itemizedWithHome - alternative);

  if (incrementalDeduction <= 0) return none;

  const rate = Math.min(1, Math.max(0, input.marginalRate));
  return {
    incrementalDeduction,
    taxBenefit: incrementalDeduction * rate,
    hasBenefit: true,
  };
}
