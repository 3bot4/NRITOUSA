/**
 * Port-of-entry cluster logic — the Risk Scorecard and the AVR Eligibility
 * Checker. Pure functions, unit-tested in portOfEntry.test.ts.
 *
 * Every rule encoded here traces to a citation in src/data/portOfEntryData.ts.
 * The scorecard deliberately produces a BAND and a document list rather than a
 * percentage: nobody can quantify the chance of a referral, and a false number
 * would be worse than no number. What it can do honestly is name which of your
 * facts an officer is likely to ask about, and which document answers it.
 *
 * Not legal advice.
 */

import { referralCauses, type ReferralCause } from "@/data/portOfEntryData";

/* ════════════════════════ AVR eligibility checker ═══════════════════════ */

export type YesNo = "yes" | "no" | "";

export type AvrDestination =
  | "canada-mexico"
  | "adjacent-island"
  | "elsewhere"
  | "";

export type AvrStatusClass = "h1b-h4" | "l" | "f-j" | "other" | "";

export interface AvrInputs {
  /** Where the traveller went. */
  destination: AvrDestination;
  /** Nonimmigrant classification, because F/J get adjacent islands. */
  statusClass: AvrStatusClass;
  /** Trip 30 days or less? */
  under30Days: YesNo;
  /** Unexpired I-94 covering the return? */
  unexpiredI94: YesNo;
  /** Maintained status and intends to resume it? */
  maintainedStatus: YesNo;
  /** Valid passport in hand? */
  validPassport: YesNo;
  /** Applied for a new visa while on this trip? */
  appliedForVisa: YesNo;
  /** If they applied — was it refused? Display nuance only; see note below. */
  visaRefused: YesNo;
  /** Needs a 212(d)(3) waiver to be admissible? */
  needsWaiver: YesNo;
  /** National of a State Sponsor of Terrorism country? */
  sstNational: YesNo;
}

export const AVR_EMPTY: AvrInputs = {
  destination: "",
  statusClass: "",
  under30Days: "",
  unexpiredI94: "",
  maintainedStatus: "",
  validPassport: "",
  appliedForVisa: "",
  visaRefused: "",
  needsWaiver: "",
  sstNational: "",
};

export type AvrVerdict =
  | "incomplete"
  | "eligible"
  | "forfeited"
  | "ineligible";

export interface AvrFailure {
  cite: string;
  label: string;
  detail: string;
}

export interface AvrResult {
  verdict: AvrVerdict;
  headline: string;
  badge: string;
  tone: "neutral" | "positive" | "caution" | "attention";
  summary: string;
  /** Every condition that failed, with its citation. */
  failures: AvrFailure[];
  /** Conditions confirmed met, for the reader's own record. */
  met: string[];
  nextStep: string;
}

/**
 * Apply 22 CFR 41.112(d) in the regulation's own order.
 *
 * The forfeiture branch is separated from plain ineligibility because it is the
 * one users most need named: applying for a visa abroad ends automatic
 * revalidation for that trip under (d)(2)(vii) whether or not the application
 * is refused. A refusal on top of that is what strands people outside the US.
 */
export function checkAvr(inp: AvrInputs): AvrResult {
  const required: (keyof AvrInputs)[] = [
    "destination",
    "statusClass",
    "under30Days",
    "unexpiredI94",
    "maintainedStatus",
    "validPassport",
    "appliedForVisa",
    "needsWaiver",
    "sstNational",
  ];
  const missing = required.filter((k) => !inp[k]);
  if (missing.length > 0) {
    return {
      verdict: "incomplete",
      headline: "Answer the remaining questions",
      badge: "Incomplete",
      tone: "neutral",
      summary:
        "Automatic revalidation has seven separate conditions plus a nationality exclusion. Every one has to hold, so the answer is only meaningful once all of them are answered.",
      failures: [],
      met: [],
      nextStep: "",
    };
  }

  const failures: AvrFailure[] = [];
  const met: string[] = [];

  /* (d)(3) — nationality exclusion. Checked first: it is absolute. */
  if (inp.sstNational === "yes") {
    failures.push({
      cite: "22 CFR 41.112(d)(3)",
      label: "Nationality exclusion",
      detail:
        "Automatic revalidation does not apply to nationals of countries designated as State Sponsors of Terrorism. This exclusion is absolute — no combination of the other conditions overcomes it.",
    });
  }

  /* (d)(2)(ii) — destination and trip length. */
  const isFJ = inp.statusClass === "f-j";
  if (inp.destination === "elsewhere") {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(ii)",
      label: "Destination outside contiguous territory",
      detail:
        "Automatic revalidation covers an absence solely in contiguous territory — Canada and Mexico. A trip anywhere else, including a connection through a third country, ends it. India is not covered.",
    });
  } else if (inp.destination === "adjacent-island" && !isFJ) {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(ii)",
      label: "Adjacent islands are not available in your classification",
      detail:
        "The adjacent-islands extension applies only to F and J nonimmigrants and their accompanying spouse and children, and never to Cuba. In H, L and other classifications the trip must be solely to Canada or Mexico.",
    });
  } else if (inp.destination) {
    met.push(
      isFJ && inp.destination === "adjacent-island"
        ? "Travel to an adjacent island, which F and J travellers may use"
        : "Travel solely in contiguous territory (Canada or Mexico)",
    );
  }

  if (inp.under30Days === "no") {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(ii)",
      label: "Absence longer than 30 days",
      detail:
        "The absence must not exceed 30 days. There is no discretion in this figure and no rounding.",
    });
  } else if (inp.under30Days === "yes") {
    met.push("Absence of 30 days or less");
  }

  /* (d)(2)(i) — the I-94. */
  if (inp.unexpiredI94 === "no") {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(i)",
      label: "No unexpired I-94",
      detail:
        "You must hold an I-94 endorsed to show an unexpired period of initial admission or extension of stay. F students also need a current endorsed Form I-20; J exchange visitors a current Form DS-2019.",
    });
  } else if (inp.unexpiredI94 === "yes") {
    met.push("An unexpired I-94 covering the return");
  }

  /* (d)(2)(iii) — maintained status. */
  if (inp.maintainedStatus === "no") {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(iii)",
      label: "Status not maintained",
      detail:
        "You must have maintained your nonimmigrant status and intend to resume it. A short trip does not cure a status problem, and presenting yourself at a port with one is a much larger risk than the expired stamp.",
    });
  } else if (inp.maintainedStatus === "yes") {
    met.push("Status maintained, and intended to be resumed");
  }

  /* (d)(2)(v) — passport. */
  if (inp.validPassport === "no") {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(v)",
      label: "No valid passport",
      detail: "A valid passport is required at the moment of readmission.",
    });
  } else if (inp.validPassport === "yes") {
    met.push("A valid passport");
  }

  /* (d)(2)(vi) — 212(d)(3) waiver. */
  if (inp.needsWaiver === "yes") {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(vi)",
      label: "You require a 212(d)(3) waiver",
      detail:
        "Automatic revalidation is unavailable to anyone who needs a nonimmigrant waiver of inadmissibility under INA 212(d)(3).",
    });
  } else if (inp.needsWaiver === "no") {
    met.push("No INA 212(d)(3) waiver required");
  }

  /* (d)(2)(vii) — the forfeiture rule. Handled last so it reads as the headline. */
  const applied = inp.appliedForVisa === "yes";
  if (applied) {
    failures.push({
      cite: "22 CFR 41.112(d)(2)(vii)",
      label: "You applied for a new visa while abroad",
      detail:
        inp.visaRefused === "yes"
          ? "The regulation requires that you have NOT applied for a new visa while abroad. You applied and were refused, so automatic revalidation is doubly unavailable: applying ended it, and there is now a refusal on the record. You cannot re-enter until a visa is issued."
          : "The regulation requires that you have NOT applied for a new visa while abroad — applying is what ends automatic revalidation, not being refused. Whether your application is approved, pending or refused, you cannot fall back on automatic revalidation for this trip. You must wait abroad until the visa is issued.",
    });
  } else if (inp.appliedForVisa === "no") {
    met.push("No new visa application made while abroad");
  }

  if (failures.length === 0) {
    return {
      verdict: "eligible",
      headline: "You appear to meet every condition for automatic revalidation",
      badge: "Appears eligible",
      tone: "positive",
      summary:
        "On these answers your expired visa may be treated as automatically extended to the date you apply for readmission, under 22 CFR 41.112(d). This is not a guarantee: the officer at the port makes the admission decision, and automatic revalidation only extends the visa's validity — it does not decide your admissibility.",
      failures: [],
      met,
      nextStep:
        "Carry your unexpired I-94 printout, your current I-797 approval notice, recent pay stubs and an employer letter. Do not apply for a visa while you are in Canada or Mexico: doing so would end automatic revalidation for this trip even if you change your mind.",
    };
  }

  const forfeited =
    applied && failures.length === 1 && failures[0].cite.indexOf("(vii)") !== -1;

  if (forfeited) {
    return {
      verdict: "forfeited",
      headline: "You would have qualified — the visa application ended it",
      badge: "Forfeited",
      tone: "attention",
      summary:
        "Every other condition in 22 CFR 41.112(d) is met on your answers. The visa application you made while abroad is the only thing defeating automatic revalidation, and under (d)(2)(vii) that is enough on its own.",
      failures,
      met,
      nextStep:
        "You cannot use automatic revalidation on this trip. Wait for the visa to be issued before travelling to a US port of entry, and get legal advice before booking anything if the application is refused or goes into administrative processing.",
    };
  }

  return {
    verdict: "ineligible",
    headline:
      failures.length === 1
        ? "One condition fails, so automatic revalidation is not available"
        : `${failures.length} conditions fail, so automatic revalidation is not available`,
    badge: "Not eligible",
    tone: "caution",
    summary:
      "Automatic revalidation under 22 CFR 41.112(d) requires every condition to hold at once. Where one fails, the expired visa is simply an expired visa and you will need a new one before returning.",
    failures,
    met,
    nextStep:
      "Plan on applying for a new visa at a consulate in your country of nationality or usual residence, and do not travel expecting to be readmitted on the expired stamp.",
  };
}

/* ════════════════════════ Port-of-entry risk scorecard ══════════════════ */

export type EmployerType = "direct" | "staffing" | "third-party" | "";

export interface ScorecardInputs {
  employerType: EmployerType;
  /** Days since the most recent pay stub. */
  daysSincePayStub: string;
  worksiteMatchesLca: YesNo;
  amendmentFiled: YesNo;
  /** Has the worksite changed since the LCA was certified? */
  worksiteChanged: YesNo;
  employerChanged90Days: YesNo;
  extensionApprovedStampExpired: YesNo;
  priorRefusal: YesNo;
  employmentGap: YesNo;
  dutiesMatchPetition: YesNo;
  onlineProfileMatches: YesNo;
  carryingI797A: YesNo;
  priorCriminalHistory: YesNo;
  h4Travelling: YesNo;
}

export const SCORECARD_EMPTY: ScorecardInputs = {
  employerType: "",
  daysSincePayStub: "",
  worksiteMatchesLca: "",
  amendmentFiled: "",
  worksiteChanged: "",
  employerChanged90Days: "",
  extensionApprovedStampExpired: "",
  priorRefusal: "",
  employmentGap: "",
  dutiesMatchPetition: "",
  onlineProfileMatches: "",
  carryingI797A: "",
  priorCriminalHistory: "",
  h4Travelling: "",
};

export type RiskBand = "incomplete" | "low" | "moderate" | "elevated" | "high";

export interface Flag {
  /** Matches a ReferralCause id where one exists. */
  causeId: string;
  title: string;
  weight: number;
  /** What CBP is likely to ask. */
  question: string;
  /** The document that closes it. */
  closer: string;
}

export interface ScorecardResult {
  band: RiskBand;
  score: number;
  maxScore: number;
  headline: string;
  badge: string;
  tone: "neutral" | "positive" | "caution" | "attention";
  summary: string;
  flags: Flag[];
  /** De-duplicated document checklist built from the flags. */
  documents: string[];
  /** Extra guidance where an H-4 family is travelling. */
  h4Note: string | null;
  /** Answered inputs, so the reader knows the score is not a partial read. */
  answered: number;
  total: number;
}

const causeById = (id: string): ReferralCause | undefined =>
  referralCauses.filter((c) => c.id === id)[0];

/**
 * The heaviest weight each referral cause can contribute. Declared once so the
 * scorecard's maximum is derived rather than guessed — an earlier hardcoded
 * ceiling was lower than the score a worst-case answer set actually produced.
 */
const MAX_WEIGHTS: Record<string, number> = {
  "third-party": 3,
  "employer-inactive": 3,
  "worksite-change": 3,
  "recent-change": 2,
  gap: 2,
  "stamp-expired": 3,
  i797b: 2,
  "duties-mismatch": 3,
  "doc-inconsistency": 2,
  "prior-history": 3,
};

/** Highest score any answer set can reach — each cause counts once. */
export const SCORECARD_MAX = Object.keys(MAX_WEIGHTS).reduce(
  (sum, k) => sum + MAX_WEIGHTS[k],
  0,
);

/** Build a flag from the shared referral-cause taxonomy, so copy stays in one place. */
function flagFor(id: string, weight: number): Flag {
  const c = causeById(id);
  return {
    causeId: id,
    title: c ? c.title : id,
    weight,
    question: c ? c.question : "",
    closer: c ? c.closer : "",
  };
}

/**
 * Score the traveller's fact pattern.
 *
 * Weights are ordinal, not probabilistic: they rank which facts an officer is
 * most likely to press on for an H-1B traveller, they do not estimate a
 * likelihood of refusal. The output that matters is the flag list and the
 * documents that answer each one.
 */
export function scoreEntryRisk(inp: ScorecardInputs): ScorecardResult {
  const keys = Object.keys(SCORECARD_EMPTY) as (keyof ScorecardInputs)[];
  const answered = keys.filter((k) => inp[k] !== "").length;
  const total = keys.length;

  const flags: Flag[] = [];

  if (inp.employerType === "third-party") flags.push(flagFor("third-party", 3));
  else if (inp.employerType === "staffing") flags.push(flagFor("third-party", 2));

  const days = Number(inp.daysSincePayStub);
  if (inp.daysSincePayStub !== "" && !Number.isNaN(days)) {
    if (days > 60) flags.push(flagFor("employer-inactive", 3));
    else if (days > 30) flags.push(flagFor("employer-inactive", 2));
  }

  if (inp.worksiteChanged === "yes" && inp.amendmentFiled === "no") {
    flags.push(flagFor("worksite-change", 3));
  } else if (inp.worksiteMatchesLca === "no") {
    flags.push(flagFor("worksite-change", 2));
  }

  if (inp.employerChanged90Days === "yes") flags.push(flagFor("recent-change", 2));
  if (inp.employmentGap === "yes") flags.push(flagFor("gap", 2));
  if (inp.extensionApprovedStampExpired === "yes")
    flags.push(flagFor("stamp-expired", 3));
  if (inp.carryingI797A === "no") flags.push(flagFor("i797b", 2));
  if (inp.dutiesMatchPetition === "no") flags.push(flagFor("duties-mismatch", 3));
  if (inp.onlineProfileMatches === "no") flags.push(flagFor("doc-inconsistency", 2));
  if (inp.priorRefusal === "yes") flags.push(flagFor("prior-history", 3));
  if (inp.priorCriminalHistory === "yes") flags.push(flagFor("prior-history", 3));

  // De-duplicate: prior-history can be pushed twice; keep the single heaviest.
  const seen: Record<string, Flag> = {};
  for (const f of flags) {
    const prev = seen[f.causeId];
    if (!prev || f.weight > prev.weight) seen[f.causeId] = f;
  }
  const unique = Object.keys(seen)
    .map((k) => seen[k])
    .sort((a, b) => b.weight - a.weight);

  const score = unique.reduce((sum, f) => sum + f.weight, 0);
  const maxScore = SCORECARD_MAX;

  if (answered < total) {
    return {
      band: "incomplete",
      score,
      maxScore,
      headline: "Answer every question for a usable read",
      badge: `${answered} of ${total}`,
      tone: "neutral",
      summary:
        "A partial answer set produces a misleadingly low score, because an unanswered question is not a clean one. Finish the list and the scorecard will name the specific questions an officer is likely to ask you.",
      flags: unique,
      documents: [],
      h4Note: null,
      answered,
      total,
    };
  }

  let band: RiskBand;
  let headline: string;
  let badge: string;
  let tone: ScorecardResult["tone"];
  let summary: string;

  if (score === 0) {
    band = "low";
    badge = "Few flags";
    tone = "positive";
    headline = "Nothing here is a common referral trigger";
    summary =
      "None of the fact patterns that most often send an H-1B traveller to secondary inspection appear in your answers. That is not a guarantee of anything — referrals happen for reasons that have nothing to do with your file, and every traveller is an applicant for admission each time they arrive. Carry the standard document set anyway.";
  } else if (score <= 3) {
    band = "moderate";
    badge = "One area to close";
    tone = "caution";
    headline = "One area an officer is likely to ask about";
    summary =
      "Your answers raise a single line of questioning. It is usually answerable on the spot with the right document in your hand rather than in an email you cannot open at the border.";
  } else if (score <= 8) {
    band = "elevated";
    badge = "Several flags";
    tone = "caution";
    headline = "Several things here invite questions at the same time";
    summary =
      "More than one of the common referral triggers is present. Referrals are driven by the combination, not by any single fact — a recent employer change alone is ordinary, but a recent change plus a third-party worksite plus a thin payroll history is the pattern officers are trained to look at. Close what you can before you fly.";
  } else {
    band = "high";
    badge = "Get advice before flying";
    tone = "attention";
    headline = "This combination warrants legal advice before you travel";
    summary =
      "Your answers include several of the heaviest referral triggers together. This is not a prediction that you will be refused — but it is the point at which the cost of an hour with an immigration attorney is far lower than the cost of being turned around, and where some of the underlying problems are fixable before departure and not after.";
  }

  const documents: string[] = [];
  const push = (d: string) => {
    if (d && documents.indexOf(d) === -1) documents.push(d);
  };
  push("Valid passport and a valid visa stamp, or a documented basis for automatic revalidation");
  push("Current I-797 approval notice, plus all prior I-797s");
  push("Most recent I-94 printout from i94.cbp.dhs.gov");
  push("Pay stubs for the last three to six months");
  push("Dated employment verification letter on company letterhead");
  push("Certified ETA-9035 LCA covering your current worksite");
  for (const f of unique) push(f.closer);

  const h4Note =
    inp.h4Travelling === "yes"
      ? "Your H-4 spouse and children are separate applicants for admission, and their status is derivative of yours. If you are referred to secondary they will normally be held with you; if you are refused admission, their H-4 admission generally cannot stand on its own, because it depends on your H-1B. Carry their own document set — marriage certificate, birth certificates, their I-797 approvals and I-94s — and make sure an adult travelling with children has the means to make arrangements independently if the family is separated at the port. Children who are US citizens cannot be refused admission, which creates its own practical problem if both parents are refused."
      : null;

  return {
    band,
    score,
    maxScore,
    headline,
    badge,
    tone,
    summary,
    flags: unique,
    documents,
    h4Note,
    answered,
    total,
  };
}
