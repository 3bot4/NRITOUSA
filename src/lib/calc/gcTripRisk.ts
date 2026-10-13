/**
 * Green card trip risk checker.
 *
 * Maps a planned trip onto the two regimes that actually govern it, which have
 * different thresholds and must not be merged:
 *
 *   (a) Is the card still a valid entry document?
 *       8 CFR 211.1(a)(2) and 211.3 — the line is ONE YEAR, measured to the
 *       moment you board, not the moment you land.
 *
 *   (b) Is continuous residence for naturalisation intact?
 *       8 CFR 316.5(c)(1) — six months raises a rebuttable presumption, one
 *       year breaks it.
 *
 * And onto the statute that decides what kind of inspection you face:
 *       INA 101(a)(13)(C) — a returning permanent resident is NOT seeking
 *       admission unless one of six conditions applies. Absence over 180 days
 *       is one. Criminal history under INA 212(a)(2) is another, and it has no
 *       time limit.
 *
 * NOTHING IS STORED. The criminal-history input is a yes/no only — no detail is
 * collected, nothing is transmitted, and the single thing the tool does with a
 * "yes" is tell the user to speak to a lawyer before booking. That is the
 * honest output: the analysis turns on how an offence maps onto INA 212(a)(2),
 * which is not a question a screen can answer and not one a user can answer
 * about themselves from how it was handled in state court.
 */

export type TripRiskTier = "routine" | "attention" | "serious" | "critical";

export interface TripRiskInput {
  /** ISO date of departure from the US. */
  departure: string;
  /** ISO date of planned return. */
  plannedReturn: string;
  hasReentryPermit: boolean;
  /** Has any previous single trip exceeded six months? */
  priorLongTrips: boolean;
  /** Pending I-485, I-751 or N-400? */
  pendingApplication: "none" | "i-485" | "i-751" | "n-400";
  /** Any arrest or criminal charge, ever, anywhere. Yes/no only. */
  anyCriminalHistory: boolean;
  /** Is the green card itself valid through the return date? */
  cardValidThroughReturn: boolean;
}

export interface TripRiskResult {
  valid: boolean;
  error?: string;
  tripDays: number;
  tier: TripRiskTier;
  headline: string;
  /** Regime (a): the entry document. */
  entryDocument: { ok: boolean; text: string };
  /** Regime (b): continuous residence for naturalisation. */
  continuousResidence: { ok: boolean; level: "intact" | "rebuttable" | "broken"; text: string };
  /** INA 101(a)(13)(C): what kind of inspection. */
  seekingAdmission: { triggered: boolean; reasons: string[]; text: string };
  documents: string[];
  actions: string[];
  /** Set when the answer is "talk to a lawyer before you book". */
  lawyerBeforeBooking: boolean;
  lawyerReason?: string;
}

const DAY_MS = 86_400_000;
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDate(v: string): number | null {
  const m = ISO.exec((v || "").trim());
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const back = new Date(t);
  if (back.getUTCMonth() !== Number(m[2]) - 1 || back.getUTCDate() !== Number(m[3])) {
    return null;
  }
  return t;
}

/** tsconfig targets ES5, so Set/Map spread is unavailable. */
function dedupe(values: string[]): string[] {
  const out: string[] = [];
  for (const v of values) if (out.indexOf(v) === -1) out.push(v);
  return out;
}

const TIER_ORDER: TripRiskTier[] = ["routine", "attention", "serious", "critical"];
const worst = (a: TripRiskTier, b: TripRiskTier): TripRiskTier =>
  TIER_ORDER.indexOf(a) >= TIER_ORDER.indexOf(b) ? a : b;

export function assessTripRisk(input: TripRiskInput): TripRiskResult {
  const dep = parseDate(input.departure);
  const ret = parseDate(input.plannedReturn);

  const empty: TripRiskResult = {
    valid: false,
    tripDays: 0,
    tier: "routine",
    headline: "",
    entryDocument: { ok: true, text: "" },
    continuousResidence: { ok: true, level: "intact", text: "" },
    seekingAdmission: { triggered: false, reasons: [], text: "" },
    documents: [],
    actions: [],
    lawyerBeforeBooking: false,
  };

  if (dep === null || ret === null) {
    return { ...empty, error: "Enter both dates as YYYY-MM-DD." };
  }
  if (ret < dep) {
    return { ...empty, error: "The return date falls before the departure date." };
  }

  // Days abroad, exclusive of the departure and arrival days themselves —
  // the same convention as the I-94 day counter, so the two agree.
  const tripDays = Math.max(0, Math.round((ret - dep) / DAY_MS) - 1);

  let tier: TripRiskTier = "routine";
  const reasons: string[] = [];
  const documents: string[] = ["Valid passport", "Green card (Form I-551)"];
  const actions: string[] = [];
  let lawyerBeforeBooking = false;
  let lawyerReason: string | undefined;

  /* ── Regime (a): the entry document ── */
  let entryOk = true;
  let entryText: string;
  if (tripDays < 365) {
    entryText =
      "Your green card is a valid entry document for a temporary absence of less than one year under 8 CFR 211.1(a)(2). On length alone, the document question is settled.";
    if (!input.cardValidThroughReturn) {
      entryOk = false;
      tier = worst(tier, "serious");
      entryText =
        "The trip is under a year, so length is not the problem — but you have said the card itself expires before you return. An expired card is not the entry document 8 CFR 211.1(a)(2) describes, and renewing it from abroad is not something Form I-90 is designed for.";
      actions.push(
        "Deal with the card before you go: file Form I-90 and get the receipt notice or an ADIT stamp, or move the trip. A conditional two-year card with a pending I-751 has its own narrow rule — an expired card plus a filing receipt issued within the previous six months works for an absence under a year, under 8 CFR 211.1(a)(5).",
      );
      documents.push("Form I-90 receipt notice, or an ADIT stamp / extension letter");
    }
  } else if (input.hasReentryPermit) {
    entryText =
      "Past one year the card stops being the document that gets you in — your reentry permit (Form I-327) is, under 8 CFR 211.1(a)(3). Check that the permit is valid through your return date, and remember 8 CFR 211.3 measures to the moment you BOARD, not the moment you land.";
    tier = worst(tier, "attention");
    documents.push("Form I-327 reentry permit");
    documents.push("Evidence of continuing US ties");
  } else {
    entryOk = false;
    entryText =
      "This is the hard stop. 8 CFR 211.1(a)(2) covers an absence of less than one year, and you have no reentry permit. Past the first anniversary of your departure the card is not, by itself, the document that gets you back in.";
    tier = worst(tier, "critical");
    lawyerBeforeBooking = true;
    lawyerReason =
      "An absence of a year or more without a reentry permit. The decision is effectively being made before you board, and the two routes back — an SB-1 returning resident visa at a consulate, or a discretionary waiver of the document requirement at the port of entry under 8 CFR 211.1(b)(3) — both need preparation.";
    actions.push(
      "If the trip has not started: apply for a reentry permit on Form I-131 BEFORE you leave. You must be physically in the United States to file, and biometrics are taken here, so this cannot be done from India.",
    );
    actions.push(
      "If you are already abroad and approaching a year: 8 CFR 211.3 measures to the boarding, not the landing. Boarding on day 364 is inside the rule. If that is not achievable, the designed route is an SB-1 returning resident visa on Form DS-117 at the consulate, applied for well ahead of travel.",
    );
  }

  /* ── Regime (b): continuous residence ── */
  let crLevel: TripRiskResult["continuousResidence"]["level"];
  let crText: string;
  if (tripDays <= 180) {
    crLevel = "intact";
    crText =
      "Not disrupted by the length of this trip. The thresholds in 8 CFR 316.5(c)(1) start at six months.";
  } else if (tripDays < 365) {
    crLevel = "rebuttable";
    crText =
      "An absence of between six months and one year disrupts continuous residence for naturalisation UNLESS you establish otherwise to the satisfaction of USCIS. It is a rebuttable presumption, not an automatic loss, and 8 CFR 316.5(c)(1)(i) names the evidence: you did not end your US employment, your immediate family stayed, you kept full access to your US home, and you did not take employment abroad. Note that this is a separate question from your entry document — the card is still fine.";
    tier = worst(tier, "attention");
    documents.push("Evidence of the four ties 8 CFR 316.5(c)(1)(i) names");
    documents.push("Your most recent US tax return, filed as a resident");
  } else {
    crLevel = "broken";
    crText =
      "An absence of one year or more disrupts continuous residence under 8 CFR 316.5(c)(1)(ii). After returning to resume permanent residence, a five-year applicant may file four years and one day later, and a three-year applicant two years and one day later. A reentry permit does not change this — the two regimes are separate, and this is where that distinction costs the most.";
    tier = worst(tier, "serious");
    actions.push(
      "If the naturalisation clock matters and the absence is for qualifying employment abroad, Form N-470 is the only instrument that preserves it — and 8 CFR 316.5(d)(1)(i) requires it to be filed BEFORE the absence reaches one continuous year. After twelve months that door has closed.",
    );
  }

  /* ── INA 101(a)(13)(C) ── */
  if (tripDays > 180) {
    reasons.push(
      "Absence of more than 180 continuous days — INA 101(a)(13)(C)(ii).",
    );
  }
  if (input.anyCriminalHistory) {
    reasons.push(
      "Criminal history. INA 101(a)(13)(C)(v) reaches an offence identified in INA 212(a)(2), and it carries no time limit — an old conviction, including one you believe was dismissed or expunged, can bring a returning resident inside the subsection.",
    );
    tier = worst(tier, "serious");
    lawyerBeforeBooking = true;
    lawyerReason =
      lawyerReason ??
      "Any arrest or charge in your history. Whether it matters turns on how the offence maps onto INA 212(a)(2), which is not the same as how it was disposed of in state court, and is not a question to resolve at a counter.";
  }
  if (input.priorLongTrips) {
    reasons.push(
      "A pattern of long absences. Abandonment under INA 101(a)(13)(C)(i) is an intent question drawn from the facts of your life, and a sequence of long trips is part of those facts even where no single trip crossed a threshold.",
    );
    tier = worst(tier, "attention");
  }

  const seekingText =
    reasons.length === 0
      ? "On what you have entered, none of the six conditions in INA 101(a)(13)(C) is triggered. That matters more than it sounds: by default a returning permanent resident is not an applicant for admission at all, and the grounds of inadmissibility in INA 212(a) are not applied to you."
      : "On what you have entered, you fall inside INA 101(a)(13)(C), which means you are treated as seeking admission. The whole of INA 212(a) becomes available to the officer, and the inspection is a real inspection rather than a formality. It does not mean you will be refused — it means the legal posture is different, and preparation is worth something.";

  /* ── Pending applications ── */
  if (input.pendingApplication === "i-485") {
    tier = worst(tier, "critical");
    actions.push(
      "A pending I-485 means you are not yet a permanent resident, and this tool is not built for your situation. Departing without an approved advance parole in hand is generally treated as abandoning the application. The site's guide to travelling to India with a pending I-485 covers it.",
    );
    lawyerBeforeBooking = true;
    lawyerReason =
      lawyerReason ?? "A pending I-485. The travel rules are completely different and the downside is losing your place in the queue.";
  }
  if (input.pendingApplication === "i-751") {
    documents.push("Form I-751 filing receipt — check its issue date");
    actions.push(
      "With a pending I-751 and an expired conditional card, 8 CFR 211.1(a)(5) works only where the filing receipt was issued within the previous six months and the absence is under a year. Long-pending I-751s outlive that window, which is when an ADIT stamp or extension letter becomes necessary.",
    );
  }
  if (input.pendingApplication === "n-400") {
    documents.push("Your N-400 receipt notice");
    actions.push(
      "You remain a permanent resident while an N-400 is pending and you may travel. Watch two things: a trip that crosses the six-month line can disrupt the continuous residence the application depends on, and you must be in the United States for your biometrics and interview appointments.",
    );
    if (tripDays > 180) tier = worst(tier, "serious");
  }

  /* ── Headline ── */
  const HEADLINES: Record<TripRiskTier, string> = {
    routine: `${tripDays} days abroad — an ordinary trip`,
    attention: `${tripDays} days abroad — prepare before you go`,
    serious: `${tripDays} days abroad — get advice first`,
    critical: `${tripDays} days abroad — do not book yet`,
  };

  if (!actions.length) {
    actions.push(
      "Download your I-94 after you return. It is the record of the trip, it is free, and the travel history only goes back ten years.",
    );
  }
  actions.push(
    "Carry an immigration attorney's number on paper, not only in your phone. There is no guaranteed right to counsel during inspection, and devices are sometimes taken.",
  );

  return {
    valid: true,
    tripDays,
    tier,
    headline: HEADLINES[tier],
    entryDocument: { ok: entryOk, text: entryText },
    continuousResidence: {
      ok: crLevel === "intact",
      level: crLevel,
      text: crText,
    },
    seekingAdmission: {
      triggered: reasons.length > 0,
      reasons,
      text: seekingText,
    },
    documents: dedupe(documents),
    actions,
    lawyerBeforeBooking,
    lawyerReason,
  };
}
