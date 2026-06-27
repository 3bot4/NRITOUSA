/**
 * OCI Eligibility engine.
 *
 * Pure, side-effect-free logic so it can be unit-tested and reused by the
 * Eligibility Checker UI. It encodes the broad eligibility rules for Overseas
 * Citizenship of India (OCI) — it is NOT legal advice and deliberately errs
 * toward "Possibly eligible" whenever the facts are incomplete or borderline.
 */

export type YesNoUnsure = "yes" | "no" | "unsure" | "";

export interface EligibilityInputs {
  /** Is the applicant currently a citizen of a country OTHER than India? */
  foreignCitizen: YesNoUnsure;
  /** Is the applicant currently an Indian citizen? */
  indianCitizen: YesNoUnsure;
  bornInIndia: YesNoUnsure;
  parentIndian: YesNoUnsure;
  grandparentIndian: YesNoUnsure;
  spouseOci: YesNoUnsure;
  /** How long has the marriage to the OCI/Indian-citizen spouse lasted? */
  marriageYears: YesNoUnsure; // "yes" = 2+ years, "no" = under 2 years
  /** Is the applicant a current/former citizen of Pakistan or Bangladesh? */
  pakBangladesh: YesNoUnsure;
  minor: YesNoUnsure;
}

export const EMPTY_ELIGIBILITY: EligibilityInputs = {
  foreignCitizen: "",
  indianCitizen: "",
  bornInIndia: "",
  parentIndian: "",
  grandparentIndian: "",
  spouseOci: "",
  marriageYears: "",
  pakBangladesh: "",
  minor: "",
};

export type EligibilityVerdict =
  | "eligible"
  | "possibly"
  | "not-eligible"
  | "incomplete";

export interface EligibilityResult {
  verdict: EligibilityVerdict;
  /** Headline shown in the result card. */
  title: string;
  tone: "positive" | "info" | "caution" | "attention" | "neutral";
  badge: string;
  /** Plain-English explanation paragraphs. */
  explanation: string[];
  /** The qualifying path(s) that matched, if any. */
  basis: string[];
  /** Next actions / documents to look at. */
  nextSteps: string[];
  ready: boolean;
}

const y = (v: YesNoUnsure) => v === "yes";
const n = (v: YesNoUnsure) => v === "no";

/** Has every question the user needs to answer been touched? */
function allAnswered(i: EligibilityInputs): boolean {
  // Minimum set required to reach any verdict.
  const core: YesNoUnsure[] = [
    i.foreignCitizen,
    i.indianCitizen,
    i.bornInIndia,
    i.parentIndian,
    i.grandparentIndian,
    i.spouseOci,
    i.pakBangladesh,
    i.minor,
  ];
  return core.every((v) => v !== "");
}

export function evaluateEligibility(i: EligibilityInputs): EligibilityResult {
  if (!allAnswered(i)) {
    return {
      verdict: "incomplete",
      title: "Answer the questions to see your eligibility",
      tone: "neutral",
      badge: "Awaiting answers",
      explanation: [
        "Tell us about your citizenship and your Indian ancestry. Your answers stay in your browser — nothing is sent or stored.",
      ],
      basis: [],
      nextSteps: [],
      ready: false,
    };
  }

  // Hard blocker 1: current Indian citizens cannot hold OCI.
  if (y(i.indianCitizen)) {
    return {
      verdict: "not-eligible",
      title: "Not eligible while you hold Indian citizenship",
      tone: "attention",
      badge: "Not eligible",
      explanation: [
        "OCI is for people of Indian origin who are foreign nationals. A current Indian citizen cannot hold an OCI card at the same time.",
        "If you later naturalise as a citizen of another country and surrender your Indian passport, you would then typically become eligible to apply for OCI.",
      ],
      basis: [],
      nextSteps: [
        "If you are about to become a foreign citizen, plan your OCI application for after you surrender your Indian passport.",
        "Read the OCI-after-naturalisation guide for the surrender-certificate sequence.",
      ],
      ready: true,
    };
  }

  // Hard blocker 2: Pakistan / Bangladesh current or former citizenship.
  if (y(i.pakBangladesh)) {
    return {
      verdict: "not-eligible",
      title: "Not eligible under current OCI rules",
      tone: "attention",
      badge: "Not eligible",
      explanation: [
        "Applicants who are, or whose parents/grandparents/great-grandparents were, citizens of Pakistan or Bangladesh are excluded from OCI under the current rules.",
        "This is a statutory exclusion, so the ancestry paths below do not override it.",
      ],
      basis: [],
      nextSteps: [
        "Confirm your exact situation with the Indian consulate — exceptions are rare and fact-specific.",
      ],
      ready: true,
    };
  }

  // You must be a foreign national to hold OCI.
  if (n(i.foreignCitizen)) {
    return {
      verdict: "not-eligible",
      title: "OCI requires foreign citizenship",
      tone: "caution",
      badge: "Not yet eligible",
      explanation: [
        "OCI is only granted to foreign nationals of Indian origin. You indicated you are not currently a citizen of another country.",
        "Green-card holders and visa holders who are still Indian citizens are not eligible — OCI replaces, it does not supplement, an Indian passport.",
      ],
      basis: [],
      nextSteps: [
        "You become eligible once you hold the citizenship of another country (e.g. after US naturalisation).",
      ],
      ready: true,
    };
  }

  // From here the applicant is a foreign national, not Indian, not Pak/Bangla.
  const basis: string[] = [];
  if (y(i.bornInIndia)) basis.push("You were born in India (former Indian national).");
  if (y(i.parentIndian)) basis.push("A parent is/was an Indian citizen.");
  if (y(i.grandparentIndian)) basis.push("A grandparent is/was an Indian citizen.");
  if (y(i.spouseOci)) {
    basis.push(
      i.marriageYears === "yes"
        ? "You are the spouse of an Indian citizen/OCI holder (married 2+ years)."
        : "You are the spouse of an Indian citizen/OCI holder."
    );
  }

  const hasAncestryPath =
    y(i.bornInIndia) || y(i.parentIndian) || y(i.grandparentIndian);
  const spousePathSolid = y(i.spouseOci) && i.marriageYears === "yes";
  const spousePathWeak = y(i.spouseOci) && i.marriageYears !== "yes";

  // Strong eligibility: a clear ancestry path, or a 2+ year qualifying marriage.
  if (hasAncestryPath || spousePathSolid) {
    return {
      verdict: "eligible",
      title: "You appear eligible for OCI",
      tone: "positive",
      badge: "Likely eligible",
      explanation: [
        "Based on your answers you meet one of the standard OCI eligibility paths. The final decision always rests with the Indian government, but you have a recognised basis to apply.",
        i.minor === "yes"
          ? "As a minor applicant, your eligibility flows through your Indian-origin parent(s); both parents' consent and signatures are required."
          : "Gather your origin proof (Indian birth certificate, parent/grandparent Indian passport, or marriage certificate) before you start the online form.",
      ],
      basis,
      nextSteps: [
        "Generate your exact paperwork with the OCI Document Checklist Generator.",
        "Estimate fees and processing time with the OCI Cost & Timeline calculators.",
        "Have origin documents apostilled where required before submitting to VFS.",
      ],
      ready: true,
    };
  }

  // Borderline: spouse path under 2 years, or only "unsure" ancestry answers.
  const anyUnsure =
    i.bornInIndia === "unsure" ||
    i.parentIndian === "unsure" ||
    i.grandparentIndian === "unsure" ||
    i.spouseOci === "unsure";

  if (spousePathWeak || anyUnsure) {
    return {
      verdict: "possibly",
      title: "You may be eligible — a few things to confirm",
      tone: "info",
      badge: "Possibly eligible",
      explanation: [
        spousePathWeak
          ? "Spouse-based OCI generally requires a registered marriage of at least two years that is still subsisting at the time of application. If you have not yet reached two years, you may qualify later."
          : "Some of your answers were “not sure”. If any Indian-ancestry link can be documented, you would likely qualify.",
        "OCI eligibility can also extend to great-grandchildren of Indian citizens and to some Indian-origin family lines — it's worth confirming the exact link before ruling yourself out.",
      ],
      basis,
      nextSteps: [
        "Trace whether any parent, grandparent, or great-grandparent ever held Indian citizenship.",
        "For spouse cases, note your marriage registration date and the two-year threshold.",
        "When in doubt, confirm with your Indian consulate before applying.",
      ],
      ready: true,
    };
  }

  // No qualifying link at all.
  return {
    verdict: "not-eligible",
    title: "No qualifying Indian-origin link found",
    tone: "caution",
    badge: "Not eligible",
    explanation: [
      "From your answers we couldn't identify an Indian-origin or spouse-based path to OCI. OCI requires a documented link: you (or a parent, grandparent, or great-grandparent) were an Indian citizen, or you are the long-term spouse of an Indian citizen/OCI holder.",
    ],
    basis: [],
    nextSteps: [
      "If you think an ancestry link exists but couldn't confirm it here, re-check with older family documents.",
      "Confirm edge cases directly with your Indian consulate.",
    ],
    ready: true,
  };
}
