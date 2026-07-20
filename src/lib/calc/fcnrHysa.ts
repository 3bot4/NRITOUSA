/**
 * FCNR vs HYSA — one explicit period-by-period model.
 *
 * The previous inline calculation was internally inconsistent: maturity value
 * compounded (principal x (1+r)^n) while "gross interest", "tax" and "net gain"
 * used simple interest (principal x r x n). The three did not reconcile.
 *
 * This model computes every figure from a single period loop so the identity
 *
 *     endingBalance = principal + cumulativeGrossInterest - cumulativeTax - fees
 *
 * holds to the cent by construction.
 *
 * Tax model (disclosed to the user, not hidden):
 *  - Interest compounds GROSS at the selected frequency. That mirrors an Indian
 *    FCNR bank, which does not withhold Indian tax from an NRI, and a US HYSA,
 *    where US tax is paid separately by the account holder rather than deducted
 *    from the balance.
 *  - FCNR interest carries INDIAN tax only once the holder is ROR. While the
 *    holder is NRI or RNOR it is exempt from Indian income tax. (Exemption ends
 *    at ROR — the model never treats a resident-and-ordinarily-resident holder
 *    as exempt.)
 *  - US federal and state tax apply to both instruments for a US taxpayer, on
 *    the interest credited each period. Any DTAA relief is not modelled and is
 *    noted separately in the UI.
 */

export type IndiaStatus = "nri" | "rnor" | "ror";

/** Compounding intervals per year. */
export type Compounding = "annual" | "semiannual" | "quarterly";

export const COMPOUNDING_PER_YEAR: Record<Compounding, number> = {
  annual: 1,
  semiannual: 2,
  quarterly: 4,
};

export interface FcnrInputs {
  principal: number;
  /** Gross annual rate as a decimal, e.g. 0.055. */
  annualRate: number;
  years: number;
  compounding: Compounding;
  /** India residency status of the depositor. Drives Indian tax on FCNR. */
  indiaStatus: IndiaStatus;
  /** Indian marginal rate applied to interest ONLY when ROR. Decimal. */
  indiaRate: number;
  /** US federal marginal rate, decimal. */
  usFederalRate: number;
  /** US state marginal rate, decimal. */
  stateRate: number;
  /**
   * Whether Indian tax applies to this instrument at all. FCNR: true (Indian
   * source, exempt only pre-ROR). US HYSA: false (US-source interest is not
   * Indian-source; a ROR holder's worldwide-income position is out of scope
   * here and flagged in the UI).
   */
  indianSource: boolean;
  /** One-off fee/penalty deducted at the end (e.g. premature withdrawal). */
  fee?: number;
}

export interface PeriodRow {
  period: number;
  openingBalance: number;
  interestCredited: number;
  cumulativeGrossInterest: number;
  indianTax: number;
  usFederalTax: number;
  stateTax: number;
  cumulativeTax: number;
  /** After-tax economic value: principal + gross interest - tax - fees. */
  endingBalance: number;
  netGain: number;
}

export interface FcnrResult {
  rows: PeriodRow[];
  final: PeriodRow;
  /** True when endingBalance reconciles with the identity to the cent. */
  reconciles: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Run the period model. One row per COMPOUNDING PERIOD, so a 5-year semiannual
 * deposit yields 10 rows. Indian tax applies only when the holder is ROR and
 * the instrument is Indian-source.
 */
export function runFcnrModel(input: FcnrInputs): FcnrResult {
  const perYear = COMPOUNDING_PER_YEAR[input.compounding];
  const totalPeriods = Math.max(0, Math.round(input.years * perYear));
  const periodRate = input.annualRate / perYear;
  const fee = input.fee ?? 0;

  const indiaApplies = input.indianSource && input.indiaStatus === "ror";

  const rows: PeriodRow[] = [];
  let balance = input.principal; // gross (pre-tax) account balance
  let cumGross = 0;
  let cumIndian = 0;
  let cumFederal = 0;
  let cumState = 0;

  for (let p = 1; p <= totalPeriods; p++) {
    const opening = balance;
    const interest = opening * periodRate;
    balance = opening + interest;
    cumGross += interest;

    const indianTax = indiaApplies ? interest * input.indiaRate : 0;
    const federalTax = interest * input.usFederalRate;
    const stateTax = interest * input.stateRate;
    cumIndian += indianTax;
    cumFederal += federalTax;
    cumState += stateTax;
    const cumTax = cumIndian + cumFederal + cumState;

    // Fee applies only at the final period.
    const appliedFee = p === totalPeriods ? fee : 0;
    const ending = input.principal + cumGross - cumTax - appliedFee;

    rows.push({
      period: p,
      openingBalance: round2(opening),
      interestCredited: round2(interest),
      cumulativeGrossInterest: round2(cumGross),
      indianTax: round2(cumIndian),
      usFederalTax: round2(cumFederal),
      stateTax: round2(cumState),
      cumulativeTax: round2(cumTax),
      endingBalance: round2(ending),
      netGain: round2(ending - input.principal),
    });
  }

  // A zero-period deposit still returns a well-formed terminal row.
  const final: PeriodRow =
    rows[rows.length - 1] ?? {
      period: 0,
      openingBalance: round2(input.principal),
      interestCredited: 0,
      cumulativeGrossInterest: 0,
      indianTax: 0,
      usFederalTax: 0,
      stateTax: 0,
      cumulativeTax: 0,
      endingBalance: round2(input.principal - fee),
      netGain: round2(-fee),
    };

  // Verify the reconciliation identity on the final row, to the cent.
  const expected = round2(
    input.principal + final.cumulativeGrossInterest - final.cumulativeTax - fee,
  );
  const reconciles = Math.abs(expected - final.endingBalance) < 0.01;

  return { rows, final, reconciles };
}
