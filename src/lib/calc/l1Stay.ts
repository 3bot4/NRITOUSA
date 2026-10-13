/**
 * L-1 eligibility screen and maximum-stay calculator.
 *
 * Two separate questions, both from 8 CFR 214.2(l):
 *
 * 1. ELIGIBILITY — (l)(1)(ii)(A). One CONTINUOUS year of qualifying employment
 *    abroad with the company group inside the three years preceding the
 *    application for admission. Time spent in the United States for the same
 *    group is "not interruptive" of that year but "shall not be counted toward
 *    fulfillment of that requirement" — so US months reduce the countable
 *    total without breaking the run. That second half is what the calculator
 *    exists to make visible; it is the half every competitor guide omits.
 *
 * 2. REMAINING STAY — (l)(12)(i). Five years in a specialized knowledge
 *    capacity or seven years in a managerial or executive capacity, counted
 *    across time in the United States "under section 101(a)(15)(L) AND/OR (H)".
 *    H-1B years consume L-1 years. Four years on an H-1B leaves three years of
 *    L-1A and one year of L-1B.
 *
 * The reset is a year abroad: residence and physical presence outside the
 * United States, except brief visits for business or pleasure, for the
 * immediate prior year.
 *
 * Months in, months out. No dates — a date-based model would imply a precision
 * this screen does not have, and the real inputs people can answer are
 * durations.
 */

export type L1Role = "l1a" | "l1b";

export interface L1StayInput {
  /** Months employed by the company group ABROAD within the last 36 months. */
  monthsAbroadInLast36: number;
  /**
   * Of those 36 months, months spent IN the United States working for the same
   * group. Not interruptive, but not countable either.
   */
  monthsInUsForSameGroupInLast36: number;
  /** Was the qualifying year a single continuous run? */
  continuous: boolean;
  role: L1Role;
  /** Months already spent in the US in L status. */
  monthsAlreadyInL: number;
  /** Months already spent in the US in H status. Counts against the same cap. */
  monthsAlreadyInH: number;
  /** Has the person had a full year of residence + presence abroad since then? */
  yearAbroadSince: boolean;
}

export interface L1StayResult {
  /** Months that actually count toward the one-year requirement. */
  countableMonths: number;
  oneYearMet: boolean;
  eligibilityTone: "ok" | "short" | "not-continuous";
  eligibilityHeadline: string;
  eligibilityDetail: string;

  capMonths: number;
  capYears: 5 | 7;
  /** L + H months used against the cap, after any reset. */
  usedMonths: number;
  remainingMonths: number;
  capTone: "ok" | "tight" | "maxed";
  capHeadline: string;
  capDetail: string;
  /** How much of the cap H-1B time alone has consumed. */
  hImpactMonths: number;
  resetApplied: boolean;
  notes: string[];
}

export const L1_CAP_MONTHS: Record<L1Role, number> = { l1a: 84, l1b: 60 };
export const ONE_YEAR_MONTHS = 12;
export const LOOKBACK_MONTHS = 36;

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : 0));

const fmtMonths = (m: number): string => {
  const months = Math.max(0, Math.round(m));
  if (months === 0) return "none";
  const y = Math.floor(months / 12);
  const r = months % 12;
  const yPart = y > 0 ? `${y} year${y === 1 ? "" : "s"}` : "";
  const mPart = r > 0 ? `${r} month${r === 1 ? "" : "s"}` : "";
  return [yPart, mPart].filter(Boolean).join(" ");
};

export function calculateL1Stay(input: L1StayInput): L1StayResult {
  const role = input.role;
  const abroad = clamp(input.monthsAbroadInLast36, 0, LOOKBACK_MONTHS);
  const inUs = clamp(input.monthsInUsForSameGroupInLast36, 0, LOOKBACK_MONTHS);

  // US time for the same group does not count toward the year. It is already
  // excluded from `abroad` by definition, but a user can double-count, so the
  // countable figure is capped by the room the US months leave in the window.
  const countableMonths = Math.min(abroad, LOOKBACK_MONTHS - inUs);

  const oneYearMet = countableMonths >= ONE_YEAR_MONTHS && input.continuous;

  let eligibilityTone: L1StayResult["eligibilityTone"];
  let eligibilityHeadline: string;
  let eligibilityDetail: string;

  if (countableMonths < ONE_YEAR_MONTHS) {
    eligibilityTone = "short";
    const shortfall = ONE_YEAR_MONTHS - countableMonths;
    eligibilityHeadline = `${fmtMonths(countableMonths)} of countable time abroad — ${fmtMonths(shortfall)} short`;
    eligibilityDetail =
      `8 CFR 214.2(l)(1)(ii)(A) needs one continuous year of qualifying employment with the group abroad inside the last three years. You have ${fmtMonths(countableMonths)} that counts.` +
      (inUs > 0
        ? ` The ${fmtMonths(inUs)} you spent in the United States for the same group does not break the run, but the regulation says expressly that it does not count toward the year either — which is why the figure is lower than your total service.`
        : "") +
      ` You are ${fmtMonths(shortfall)} short. More time abroad with the group, or waiting until a longer continuous run sits inside the three-year window, are the two ways this changes.`;
  } else if (!input.continuous) {
    eligibilityTone = "not-continuous";
    eligibilityHeadline = `${fmtMonths(countableMonths)} abroad, but not in one continuous run`;
    eligibilityDetail =
      "The year has to be continuous. Twelve months split across two separate postings, with something else in between, is not one continuous year even though the total reaches twelve. Check whether a single unbroken block of twelve months or more sits anywhere inside the last thirty-six — if it does, answer yes and re-run this.";
  } else {
    eligibilityTone = "ok";
    eligibilityHeadline = `${fmtMonths(countableMonths)} of continuous countable time abroad`;
    eligibilityDetail =
      `That clears the one-year-in-three requirement at 8 CFR 214.2(l)(1)(ii)(A) on the facts you entered.` +
      (inUs > 0
        ? ` The ${fmtMonths(inUs)} in the United States for the same group is excluded from the count, as the regulation requires, and does not break the run.`
        : "") +
      " Eligibility also needs a qualifying relationship between the two entities and a US role that meets the managerial, executive or specialized-knowledge definition — neither of which is a duration question.";
  }

  const capMonths = L1_CAP_MONTHS[role];
  const capYears = role === "l1a" ? 7 : 5;
  const lMonths = clamp(input.monthsAlreadyInL, 0, 600);
  const hMonths = clamp(input.monthsAlreadyInH, 0, 600);

  const resetApplied = input.yearAbroadSince;
  const usedMonths = resetApplied ? 0 : lMonths + hMonths;
  const remainingMonths = Math.max(0, capMonths - usedMonths);

  let capTone: L1StayResult["capTone"];
  let capHeadline: string;
  let capDetail: string;

  if (resetApplied) {
    capTone = "ok";
    capHeadline = `Full ${capYears} years available`;
    capDetail =
      `A year of residence and physical presence outside the United States, apart from brief visits for business or pleasure, resets the clock under 8 CFR 214.2(l)(12)(i). On that basis the whole ${capYears}-year ${role === "l1a" ? "managerial and executive" : "specialized-knowledge"} cap is available again. On a new petition the employer has to supply your employment, your place of residence, and the dates and purpose of every trip to the United States during that year — so keep the record.`;
  } else if (remainingMonths === 0) {
    capTone = "maxed";
    capHeadline = `The ${capYears}-year cap is used up`;
    capDetail =
      `You have entered ${fmtMonths(usedMonths)} in the United States in L and H status combined, against a ${capYears}-year cap. 8 CFR 214.2(l)(12)(i) says someone who has spent the maximum may not be readmitted under L or H unless they have resided and been physically present outside the United States, apart from brief visits, for the immediate prior year. A blanket petition is not a way round it — the same bar applies to a consular officer certifying eligibility under a blanket.`;
  } else if (remainingMonths <= 12) {
    capTone = "tight";
    capHeadline = `About ${fmtMonths(remainingMonths)} left of the ${capYears}-year cap`;
    capDetail =
      `${fmtMonths(usedMonths)} of L and H time in the United States counts against the ${capYears}-year cap, leaving roughly ${fmtMonths(remainingMonths)}. At this point the cap, not the petition, is the binding constraint — a three-year petition cannot be approved past it. This is the stage at which the green card route stops being a background project.`;
  } else {
    capTone = "ok";
    capHeadline = `About ${fmtMonths(remainingMonths)} left of the ${capYears}-year cap`;
    capDetail =
      `${fmtMonths(usedMonths)} of L and H time in the United States counts against the ${capYears}-year cap, leaving roughly ${fmtMonths(remainingMonths)}.`;
  }

  const notes: string[] = [];
  if (!resetApplied && hMonths > 0) {
    notes.push(
      `Your ${fmtMonths(hMonths)} of H-1B time is counted here, and that is the point most L-1 guides miss. 8 CFR 214.2(l)(12)(i) caps time spent in the United States "under section 101(a)(15)(L) and/or (H)" — the two statuses share one clock. Those H months have taken ${fmtMonths(hMonths)} off your ${capYears}-year ${role === "l1a" ? "L-1A" : "L-1B"} ceiling, and nothing about changing employer, company group or classification resets it.`,
    );
  }
  if (role === "l1b" && remainingMonths > 0 && remainingMonths <= 24 && !resetApplied) {
    notes.push(
      "L-1B runs out two years earlier than L-1A. If the US role genuinely meets the managerial or executive definition — and managing an essential function counts, not only managing people — an L-1A petition buys two more years against the same history. That is a question about the role as evidenced, not a relabelling exercise.",
    );
  }
  notes.push(
    "Time spent outside the United States does not count against the cap, so days abroad can be recaptured. Your I-94 travel history is the evidence, and it only goes back ten years.",
  );
  notes.push(
    "The L-1 is tied to the company group. There is no transfer to an unrelated employer, which is the structural difference from an H-1B and the reason the cap matters so much more here.",
  );

  return {
    countableMonths,
    oneYearMet,
    eligibilityTone,
    eligibilityHeadline,
    eligibilityDetail,
    capMonths,
    capYears,
    usedMonths,
    remainingMonths,
    capTone,
    capHeadline,
    capDetail,
    hImpactMonths: resetApplied ? 0 : hMonths,
    resetApplied,
    notes,
  };
}
