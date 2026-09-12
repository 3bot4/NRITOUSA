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
  /**
   * Does the traveller actually hold a visa that could be automatically
   * revalidated (or converted under (d)(1)(ii))? Automatic revalidation extends
   * the validity of an EXISTING visa — it does not conjure one. An earlier
   * version returned "eligible" from an I-94 and a passport alone, which would
   * have told a visa-required traveller with no visa at all that they were fine.
   */
  hasRevalidatableVisa: YesNo;
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
  /**
   * F and J travellers only: a current, properly endorsed I-20 (F) or DS-2019
   * (J). 22 CFR 41.112(d)(2)(i) makes this a condition in its own right, and an
   * F/J traveller cannot pass without it.
   */
  endorsedForm: YesNo;
}

export const AVR_EMPTY: AvrInputs = {
  hasRevalidatableVisa: "",
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
  endorsedForm: "",
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
    "hasRevalidatableVisa",
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
  const needsEndorsement = inp.statusClass === "f-j";
  const missing = required
    .filter((k) => !inp[k])
    .concat(needsEndorsement && !inp.endorsedForm ? ["endorsedForm"] : []);
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

  /* Threshold: is there a visa to revalidate at all? */
  if (inp.hasRevalidatableVisa === "no") {
    failures.push({
      cite: "22 CFR 41.112(d)(1)",
      label: "You do not hold a visa that can be revalidated",
      detail:
        "Automatic revalidation extends the validity of an expired nonimmigrant visa you already hold, or converts one where DHS has changed your classification. It does not create a visa. Where a visa is required for your admission and you have never held one in a classification that can be extended or converted, there is nothing for this provision to act on and you will need to apply for a visa.",
    });
  } else if (inp.hasRevalidatableVisa === "yes") {
    met.push("A visa that can be automatically extended or converted");
  }

  /* F/J documentary condition. */
  if (needsEndorsement) {
    if (inp.endorsedForm === "no") {
      failures.push({
        cite: "22 CFR 41.112(d)(2)(i)",
        label: "No current, properly endorsed I-20 or DS-2019",
        detail:
          "For a qualified F student the regulation requires a current Form I-20 endorsed by the issuing school official; for a J exchange visitor, a current Form DS-2019 issued and endorsed by the programme sponsor. This is a separate condition from the I-94 and an F or J traveller cannot rely on automatic revalidation without it.",
      });
    } else if (inp.endorsedForm === "yes") {
      met.push("A current, properly endorsed I-20 or DS-2019");
    }
  }

  /* (d)(3) — nationality exclusion. Checked first among the reg conditions. */
  if (inp.sstNational === "yes") {
    failures.push({
      cite: "22 CFR 41.112(d)(3)",
      label: "Nationality exclusion",
      detail:
        "Automatic revalidation does not apply to nationals of countries identified in the Department of State's annual terrorism report — the State Sponsors of Terrorism designation. The designated list is maintained by the Department of State and changes, so check the current official list rather than any list reproduced on a third-party page. Where it applies, the exclusion is absolute.",
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
        "The absence must not exceed 30 days. The figure is a condition of the regulation, so an absence of 31 days simply falls outside the provision.",
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
        "On these answers you appear to satisfy the conditions in 22 CFR 41.112(d), so your expired visa may be treated as automatically extended to the date you apply for readmission. Satisfying the regulation's conditions and being admitted are two separate things: automatic revalidation goes to the validity of the visa document, while admission remains a decision the CBP officer makes on your admissibility at the port, on every arrival.",
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


/* ════════════════════ Port-of-Entry Preparedness Checklist ══════════════ */

/**
 * This replaced a weighted "risk scorecard".
 *
 * WHY IT CHANGED: the old version summed invented ordinal weights into a
 * 0–26 score and banded it low/moderate/elevated/high. However carefully it
 * was captioned, a number presented next to CBP terminology reads as a
 * probability of refusal — and no such probability exists, is published, or
 * could be derived from thirteen self-reported answers. Worse, some weights
 * encoded things that are simply not risk factors: an I-797B was scored as
 * inherently risky when it is an ordinary consular-notification approval.
 *
 * What replaced it is a checklist that sorts a traveller's facts into three
 * buckets that map to actual decisions:
 *
 *   hard-stop       — you are missing something you must have to travel, e.g.
 *                     no valid visa where one is required and no exception.
 *   document-gap    — you can travel, but you should be carrying a document
 *                     you have not confirmed you have.
 *   attorney-review — a fact that needs professional judgment before you fly,
 *                     not a document you can print.
 *
 * No score, no band, no percentage. Nothing here estimates the likelihood of
 * admission or refusal, and the UI says so.
 */

export type FindingKind = "hard-stop" | "document-gap" | "attorney-review";

export interface PrepFinding {
  id: string;
  kind: FindingKind;
  title: string;
  detail: string;
  /** What to do about it before travelling. */
  action: string;
}

/** Does the traveller hold a valid visa, or a stated basis to travel without one? */
export type VisaPosture =
  | "valid" // unexpired visa in the right classification
  | "expired-avr" // expired, but the AVR conditions are claimed to be met
  | "expired-none" // expired with no exception — a hard stop
  | "visa-exempt" // e.g. Canadian nationals, who are generally visa-exempt
  | "";

/** Was a worksite move material — i.e. outside the LCA area of intended employment? */
export type WorksiteMove =
  | "none" // no move
  | "same-area" // moved, but within the same area of intended employment
  | "outside-area" // moved outside the area of intended employment
  | "unsure"
  | "";

export interface PrepInputs {
  visaPosture: VisaPosture;
  passportValid: YesNo;
  worksiteMove: WorksiteMove;
  amendmentFiled: YesNo;
  haveLca: YesNo;
  havePayStubs: YesNo;
  haveApprovalNotice: YesNo;
  employerChanged90Days: YesNo;
  employmentGap: YesNo;
  dutiesMatchPetition: YesNo;
  profileAccurate: YesNo;
  priorRefusalOrRemoval: YesNo;
  priorCriminalHistory: YesNo;
  pendingI485: YesNo;
  h4Travelling: YesNo;
}

export const PREP_EMPTY: PrepInputs = {
  visaPosture: "",
  passportValid: "",
  worksiteMove: "",
  amendmentFiled: "",
  haveLca: "",
  havePayStubs: "",
  haveApprovalNotice: "",
  employerChanged90Days: "",
  employmentGap: "",
  dutiesMatchPetition: "",
  profileAccurate: "",
  priorRefusalOrRemoval: "",
  priorCriminalHistory: "",
  pendingI485: "",
  h4Travelling: "",
};

export interface PrepResult {
  complete: boolean;
  answered: number;
  total: number;
  findings: PrepFinding[];
  hardStops: PrepFinding[];
  documentGaps: PrepFinding[];
  attorneyReview: PrepFinding[];
  /** Baseline document list, always returned. */
  documents: string[];
  h4Note: string | null;
  i485Note: string | null;
  headline: string;
  summary: string;
  tone: "neutral" | "positive" | "caution" | "attention";
}

/** Documents every H-1B traveller should carry regardless of their answers. */
const BASE_DOCUMENTS = [
  "Passport, valid well beyond your intended stay",
  "Valid visa in the right classification, or a documented basis to travel without one",
  "Current I-797 approval notice, plus prior I-797s",
  "Most recent I-94 printout from i94.cbp.dhs.gov",
  "Certified ETA-9035 LCA covering your actual worksite",
  "Recent pay stubs",
  "Dated employment verification letter on company letterhead",
];

/**
 * Sort a traveller's answers into hard stops, document gaps and attorney-review
 * items. Deliberately returns no score.
 */
export function assessEntryPreparedness(inp: PrepInputs): PrepResult {
  const keys = Object.keys(PREP_EMPTY) as (keyof PrepInputs)[];
  const answered = keys.filter((k) => inp[k] !== "").length;
  const total = keys.length;
  const complete = answered === total;

  const findings: PrepFinding[] = [];
  const add = (f: PrepFinding) => findings.push(f);

  /* ---- Travel documents: the only true hard stops --------------------- */
  if (inp.visaPosture === "expired-none") {
    add({
      id: "visa-expired",
      kind: "hard-stop",
      title: "Your visa has expired and no exception applies",
      detail:
        "Where a visa is required, an expired visa is a travel-document problem before it is anything else — it is generally what stops you boarding, not something argued at the border. Automatic revalidation is the main exception and it is narrow: broadly, a trip of 30 days or less solely to Canada or Mexico, with no visa application made while abroad.",
      action:
        "Either obtain a new visa before travelling, or confirm in detail that you meet every condition of automatic revalidation. Do not travel on the assumption that the approval notice substitutes for the visa.",
    });
  }
  if (inp.passportValid === "no") {
    add({
      id: "passport",
      kind: "hard-stop",
      title: "You do not have a valid passport",
      detail:
        "A valid passport is required to travel and to be admitted, and your admission period can be limited to the passport's validity.",
      action: "Renew the passport before booking travel.",
    });
  }

  /* ---- Attorney-review items ------------------------------------------ */
  if (inp.worksiteMove === "outside-area" && inp.amendmentFiled === "no") {
    add({
      id: "worksite-material",
      kind: "attorney-review",
      title: "Worksite moved outside the LCA area with no amendment filed",
      detail:
        "Not every worksite change requires an amended petition. A move within the same area of intended employment on the certified LCA generally does not. A move outside that area is the one that raises an amendment question, and an unamended material move is a status question rather than a paperwork one.",
      action:
        "Have your employer's immigration counsel confirm whether an amendment was required and, if so, what was filed, before you travel.",
    });
  } else if (inp.worksiteMove === "unsure") {
    add({
      id: "worksite-unsure",
      kind: "attorney-review",
      title: "You are not sure whether your worksite is covered by the LCA",
      detail:
        "The question is whether your current worksite is within the area of intended employment on a certified LCA — not simply whether your desk moved.",
      action:
        "Ask your employer for the certified LCA covering your current worksite and confirm the address it lists.",
    });
  }
  if (inp.dutiesMatchPetition === "no") {
    add({
      id: "duties",
      kind: "attorney-review",
      title: "Your actual duties differ from the petition",
      detail:
        "The I-129 describes a specialty occupation. A material difference between that description and the work you actually do is a substantive petition question, and the officer has the petition on screen.",
      action:
        "Raise this with your employer's counsel before travelling. It is not something to resolve at a border.",
    });
  }
  if (inp.priorRefusalOrRemoval === "yes") {
    add({
      id: "prior-refusal",
      kind: "attorney-review",
      title: "You have a prior refusal, removal or refused admission",
      detail:
        "Prior immigration history is on the officer's screen whether or not you raise it, and some outcomes — a removal order in particular — create inadmissibility that must be waived before any admission.",
      action:
        "Get advice on what is on your record and whether a waiver or consent to reapply is needed, before you travel.",
    });
  }
  if (inp.priorCriminalHistory === "yes") {
    add({
      id: "criminal",
      kind: "attorney-review",
      title: "You have arrest or criminal history",
      detail:
        "Criminal history can create a separate ground of inadmissibility independent of your petition, and it does not go away because a case was dismissed or expunged.",
      action:
        "Speak to an immigration attorney with the certified disposition documents before travelling.",
    });
  }
  if (inp.employmentGap === "yes") {
    add({
      id: "gap",
      kind: "attorney-review",
      title: "You have a gap in employment or a recent layoff",
      detail:
        "The 60-day period at 8 CFR 214.1(l)(2) is discretionary, runs once per authorized validity period, and is capped by the end of that period. It is not a guaranteed 60 days.",
      action:
        "Confirm with counsel how the gap was covered before you place yourself at a port of entry.",
    });
  }
  if (inp.employerChanged90Days === "yes") {
    add({
      id: "recent-change",
      kind: "attorney-review",
      title: "You changed employers recently",
      detail:
        "A new petitioner means a new employment relationship with little payroll history to evidence it. There is no official waiting period after a change, and none is required — but the documentary picture is thinner, and that is worth planning around.",
      action:
        "Carry the new employer's I-797 (or receipt), the new LCA, and whatever payroll evidence exists. Confirm the filing status with counsel.",
    });
  }

  /* ---- Document gaps --------------------------------------------------- */
  if (inp.haveApprovalNotice === "no") {
    add({
      id: "no-i797",
      kind: "document-gap",
      title: "You are not carrying your I-797 approval notice",
      detail:
        "The approval notice evidences the petition your admission is based on. Carry the current one and any prior notices.",
      action: "Print the current I-797 and prior notices before you fly.",
    });
  }
  if (inp.haveLca === "no") {
    add({
      id: "no-lca",
      kind: "document-gap",
      title: "You are not carrying a certified LCA for your worksite",
      detail:
        "The certified ETA-9035 is the document that ties your work location to the petition.",
      action: "Ask your employer for the certified LCA covering your worksite.",
    });
  }
  if (inp.havePayStubs === "no") {
    add({
      id: "no-stubs",
      kind: "document-gap",
      title: "You are not carrying recent pay stubs",
      detail:
        "Pay records are the simplest evidence that the employment described in the petition is real and continuing.",
      action: "Print recent pay stubs and carry them on paper.",
    });
  }
  if (inp.profileAccurate === "no") {
    add({
      id: "profile",
      kind: "document-gap",
      title: "Your public profile or resume is inaccurate or out of date",
      detail:
        "A resume or profile that misstates your employer or job title is a problem because it is inaccurate, not because it is visible. The fix is to make it truthful and current — bringing your public record into line with the facts. Never alter, conceal or delete information to create a misleading impression before travel; that risks a misrepresentation problem under INA 212(a)(6)(C)(i) far more serious than an out-of-date job title.",
      action:
        "Correct anything that is factually wrong or stale so your public record accurately reflects your actual employment.",
    });
  }

  /* ---- Notes ----------------------------------------------------------- */
  const i485Note =
    inp.pendingI485 === "yes"
      ? "You have a pending I-485. Departing without advance parole generally abandons it under 8 CFR 245.2(a)(4)(ii)(A) — but there is an exception at 245.2(a)(4)(ii)(C) for applicants in lawful H-1 or L-1 status who remain eligible for H or L status, are returning to resume employment with the same employer, and hold a valid H or L visa where one is required. A parallel sentence covers H-4 and L-2 dependants. Confirm you are inside that exception before you travel; if you are not, you need advance parole."
      : null;

  const h4Note =
    inp.h4Travelling === "yes"
      ? "Your H-4 spouse and children are separate applicants for admission and their status is derivative of yours, so if you are not admitted in H-1B there is generally nothing for the H-4 to attach to. Carry each person's own passport, visa, I-797 and I-94, plus the marriage and birth certificates evidencing the relationship. A US citizen child cannot be refused admission, which creates a practical problem worth planning for if both parents are refused."
      : null;

  const hardStops = findings.filter((f) => f.kind === "hard-stop");
  const documentGaps = findings.filter((f) => f.kind === "document-gap");
  const attorneyReview = findings.filter((f) => f.kind === "attorney-review");

  let headline: string;
  let summary: string;
  let tone: PrepResult["tone"];

  if (!complete) {
    headline = "Answer every question for a complete checklist";
    summary =
      "An unanswered question is not a cleared one. Finish the list and the checklist will separate what stops you travelling from what you should simply be carrying.";
    tone = "neutral";
  } else if (hardStops.length > 0) {
    headline =
      hardStops.length === 1
        ? "One item should stop you travelling as planned"
        : `${hardStops.length} items should stop you travelling as planned`;
    summary =
      "These are not risk factors to weigh — they are missing prerequisites. Resolve them before you book or board.";
    tone = "attention";
  } else if (attorneyReview.length > 0) {
    headline = `${attorneyReview.length} ${attorneyReview.length === 1 ? "item needs" : "items need"} professional review before you fly`;
    summary =
      "Nothing here is a documentary gap you can close by printing something. Each one is a question of fact or status that an immigration attorney should look at, and all of them are cheaper to resolve before departure than after a refusal.";
    tone = "caution";
  } else if (documentGaps.length > 0) {
    headline = `${documentGaps.length} ${documentGaps.length === 1 ? "document is" : "documents are"} worth sorting before you fly`;
    summary =
      "No hard stops and nothing needing legal advice on these answers. What remains is paperwork you should be carrying.";
    tone = "caution";
  } else {
    headline = "Nothing on this checklist is outstanding";
    summary =
      "On these answers you have the documents this checklist looks for and none of the facts that warrant review. That is not a prediction about your admission: every arrival is a fresh inspection, the officer decides, and referrals happen for reasons unrelated to your file. Carry the baseline documents anyway.";
    tone = "positive";
  }

  return {
    complete,
    answered,
    total,
    findings,
    hardStops,
    documentGaps,
    attorneyReview,
    documents: BASE_DOCUMENTS.slice(),
    h4Note,
    i485Note,
    headline,
    summary,
    tone,
  };
}
