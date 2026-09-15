/**
 * Return-to-India: the immigration-status and exit-tax layer.
 *
 * WHY THIS FILE EXISTS
 * The return-to-India cluster was built as a money hub — 401(k), IRA, Social
 * Security, RNOR, currency — and it answered none of the questions that decide
 * whether the move is even reversible. A green-card holder who flies to India
 * "to try it for a year" can lose the status that makes coming back possible,
 * and one who formally gives it up can trigger a US exit tax on the way out.
 * Both are irreversible, both are missed, and neither belongs to any of the
 * retirement articles beneath the hub.
 *
 * HOW TO UPDATE
 * The immigration rules here are long-standing and rarely move. The
 * expatriation thresholds are indexed annually — re-check the net-income-tax
 * figure and the tax year it belongs to against the IRS expatriation page and
 * the current Form 8854 instructions before bumping `verified`. Never restate
 * the indexed figure without its tax year attached.
 */

export const returnToIndiaStatus = {
  verified: "2026-09-14",

  /* ── Keeping (or losing) permanent residence ───────────────────────────── */
  lpr: {
    /** Absence beyond which a re-entry permit is advised by USCIS. */
    reentryPermitAdvisedAfterMonths: 12,
    /** Longest absence a valid re-entry permit can cover. */
    reentryPermitMaxYears: 2,
    /** Absence beyond a re-entry permit's reach — needs an SB-1 returning resident visa. */
    sb1NeededAfterYears: 2,
    /**
     * Abandonment turns on intent, not only on a day count — which is why a
     * short trip can still cost the status and a long one can survive it.
     * Factors USCIS and CBP weigh, per the USCIS travel guidance.
     */
    intentFactors: [
      "whether the trip abroad was intended to be temporary",
      "whether US family and community ties were maintained",
      "whether US employment was maintained",
      "whether US income taxes were filed as a resident",
    ],
    forms: {
      reentryPermit: { id: "I-131", url: "https://www.uscis.gov/i-131" },
      abandonment: { id: "I-407", url: "https://www.uscis.gov/i-407" },
    },
    travelGuidanceUrl:
      "https://www.uscis.gov/green-card/after-we-grant-your-green-card/international-travel-as-a-permanent-resident",
  },

  /* ── The US exit tax on giving the status up ───────────────────────────── */
  expatriation: {
    /** LPR in this many of the last 15 tax years ⇒ a "long-term resident". */
    longTermResidentYears: 8,
    longTermResidentWindowYears: 15,
    /** Net worth at expatriation at or above this ⇒ covered expatriate. */
    netWorthTest: "$2 million",
    /**
     * Average annual net income tax for the 5 years before expatriation above
     * this ⇒ covered expatriate. Indexed annually; ALWAYS quote with its year.
     */
    netIncomeTaxTest: "$206,000",
    netIncomeTaxTestYear: "2025",
    /** Failing to certify 5 years of compliance also makes you covered. */
    certificationYears: 5,
    form: { id: "8854", url: "https://www.irs.gov/forms-pubs/about-form-8854" },
    penalty: "$10,000",
    infoUrl: "https://www.irs.gov/individuals/international-taxpayers/expatriation-tax",
  },
} as const;
