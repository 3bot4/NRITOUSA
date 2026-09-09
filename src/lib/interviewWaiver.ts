/**
 * Interview waiver eligibility logic for /visa-interview-waiver.
 *
 * Encodes the Department of State's 18 September 2025 Interview Waiver Update
 * (effective 1 October 2025). Every disqualifying branch names the condition it
 * failed and whether that condition is curable, because "no" on its own is a
 * useless answer when the reason might be a date that passes next month.
 *
 * Not legal advice, and not a determination — consular officers may require an
 * interview in any case for any reason.
 */

import { IW_VERIFIED, IW_CURRENT_RULE } from "@/data/interviewWaiverData";

export type WaiverClass =
  | "b1b2"
  | "bcc"
  | "h2a"
  | "diplomatic"
  | "h1b"
  | "h4"
  | "l"
  | "f"
  | "j"
  | "other"
  | "";

export interface WaiverClassMeta {
  label: string;
  /** Can this class ever qualify under the current rule? */
  renewalRoute: boolean;
  categoricallyEligible: boolean;
}

export const WAIVER_CLASSES: Record<Exclude<WaiverClass, "">, WaiverClassMeta> = {
  b1b2: { label: "B-1 / B-2 / B1-B2 (visitor)", renewalRoute: true, categoricallyEligible: false },
  bcc: { label: "Border Crossing Card / Foil", renewalRoute: true, categoricallyEligible: false },
  h2a: { label: "H-2A (agricultural worker)", renewalRoute: true, categoricallyEligible: false },
  diplomatic: {
    label: "Diplomatic / official (A, G, NATO, C-3, TECRO E-1)",
    renewalRoute: false,
    categoricallyEligible: true,
  },
  h1b: { label: "H-1B", renewalRoute: false, categoricallyEligible: false },
  h4: { label: "H-4 (dependent)", renewalRoute: false, categoricallyEligible: false },
  l: { label: "L-1 / L-2", renewalRoute: false, categoricallyEligible: false },
  f: { label: "F-1 / F-2 (student)", renewalRoute: false, categoricallyEligible: false },
  j: { label: "J-1 / J-2 (exchange visitor)", renewalRoute: false, categoricallyEligible: false },
  other: { label: "Another classification (O, P, Q, R, M…)", renewalRoute: false, categoricallyEligible: false },
};

export const WAIVER_CLASS_ORDER: Exclude<WaiverClass, "">[] = [
  "b1b2",
  "bcc",
  "h2a",
  "h1b",
  "h4",
  "l",
  "f",
  "j",
  "diplomatic",
  "other",
];

export type YesNoUnsure = "yes" | "no" | "unsure" | "";
export type RefusalType = "none" | "214b" | "221g" | "other" | "";

export interface WaiverInputs {
  /** Class being applied for now. */
  applyingFor: WaiverClass;
  /** Class of the prior visa — the same-classification requirement. */
  priorClass: WaiverClass;
  /** ISO date the prior visa expired (or will expire). */
  priorExpiry: string;
  /** Was the prior visa issued for its full validity? */
  fullValidity: YesNoUnsure;
  /** Was the applicant 18+ when the prior visa was issued? */
  age18AtIssuance: YesNoUnsure;
  /** Any prior refusal, and of what kind. */
  refusalType: RefusalType;
  /** If refused — was it overcome (later issued) or formally waived? */
  refusalOvercome: YesNoUnsure;
  /** Country of nationality. */
  nationality: string;
  /** Country of usual residence. */
  residence: string;
  /** Country where the application will be filed. */
  applyingIn: string;
  /** Name or date-of-birth change since the prior visa was issued. */
  identityChanged: YesNoUnsure;
}

export const WAIVER_EMPTY: WaiverInputs = {
  applyingFor: "",
  priorClass: "",
  priorExpiry: "",
  fullValidity: "",
  age18AtIssuance: "",
  refusalType: "",
  refusalOvercome: "",
  nationality: "",
  residence: "",
  applyingIn: "",
  identityChanged: "",
};

export type WaiverVerdict =
  | "incomplete"
  | "likely-eligible"
  | "not-eligible"
  | "needs-review";

export interface WaiverFailure {
  condition: string;
  why: string;
  /** Can this be fixed, and how? */
  curable: string | null;
}

export interface WaiverResult {
  verdict: WaiverVerdict;
  headline: string;
  badge: string;
  tone: "neutral" | "positive" | "caution" | "attention";
  summary: string;
  failures: WaiverFailure[];
  met: string[];
  /** Days remaining in the 12-month renewal window; negative when blown. */
  windowDaysRemaining: number | null;
  /** Human copy for the countdown. */
  windowLabel: string | null;
  /** Third-country application warning. */
  thirdCountryWarning: string | null;
  rulesVerified: string;
  ruleEffective: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days from `from` to `to`, using UTC midnight to avoid DST drift. */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const b = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.round((b - a) / MS_PER_DAY);
}

/**
 * The 12-month renewal window runs from the prior visa's EXPIRATION, not its
 * issuance. Returns days left before the window closes; negative once it has.
 */
export function renewalWindowDaysRemaining(
  priorExpiry: Date,
  now: Date = new Date(),
): number {
  const deadline = new Date(
    Date.UTC(
      priorExpiry.getUTCFullYear() + 1,
      priorExpiry.getUTCMonth(),
      priorExpiry.getUTCDate(),
    ),
  );
  return daysBetween(now, deadline);
}

function parseDate(v: string): Date | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return isNaN(d.getTime()) ? null : d;
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function checkInterviewWaiver(
  inp: WaiverInputs,
  now: Date = new Date(),
): WaiverResult {
  const base = {
    rulesVerified: IW_VERIFIED,
    ruleEffective: IW_CURRENT_RULE.effective,
  };

  if (!inp.applyingFor) {
    return {
      ...base,
      verdict: "incomplete",
      headline: "Start with the visa you are applying for",
      badge: "Incomplete",
      tone: "neutral",
      summary:
        "Under the rules effective 1 October 2025, most classifications are categorically ineligible, so the class you are applying for settles the question before anything else is considered.",
      failures: [],
      met: [],
      windowDaysRemaining: null,
      windowLabel: null,
      thirdCountryWarning: null,
    };
  }

  const meta = WAIVER_CLASSES[inp.applyingFor];
  const failures: WaiverFailure[] = [];
  const met: string[] = [];

  /* ---- Categorical exclusion: settled before any other condition ------- */
  if (!meta.renewalRoute && !meta.categoricallyEligible) {
    return {
      ...base,
      verdict: "not-eligible",
      headline: `${meta.label} is not interview-waiver eligible`,
      badge: "Not eligible",
      tone: "attention",
      summary: `The Department of State's update effective ${IW_CURRENT_RULE.effective} lists the complete set of categories that may qualify, and ${meta.label} is not among them. This is not about your history or your documents — the classification itself is excluded, so an in-person interview is required. Pages still describing a 48-month renewal window for this category are quoting a rule that was replaced in February 2025 and eliminated in July 2025.`,
      failures: [
        {
          condition: "Eligible category",
          why: `${meta.label} is not on the eligible list in the ${IW_CURRENT_RULE.announced} update.`,
          curable: null,
        },
      ],
      met: [],
      windowDaysRemaining: null,
      windowLabel: null,
      thirdCountryWarning: null,
    };
  }

  /* ---- Diplomatic/official track: exempt from most conditions ---------- */
  if (meta.categoricallyEligible) {
    return {
      ...base,
      verdict: "likely-eligible",
      headline: `${meta.label} remains interview-waiver eligible`,
      badge: "Category eligible",
      tone: "positive",
      summary:
        "Diplomatic and official-type applicants, and the A, G, NATO, C-3 and TECRO E-1 classifications, remain eligible under the current rule and are excepted from the country-of-application condition. C-3 is the exception to the exception: attendants, servants and personal employees of accredited officials are not covered. A consular officer may still require an interview in any individual case.",
      failures: [],
      met: ["An eligible classification under the current update"],
      windowDaysRemaining: null,
      windowLabel: null,
      thirdCountryWarning: null,
    };
  }

  /* ---- Renewal route: B-1/B-2, BCC, H-2A ------------------------------ */
  const required: (keyof WaiverInputs)[] = [
    "priorClass",
    "priorExpiry",
    "fullValidity",
    "age18AtIssuance",
    "refusalType",
    "nationality",
    "residence",
    "applyingIn",
  ];
  const missing = required.filter((k) => !inp[k]);
  if (
    missing.length > 0 ||
    (inp.refusalType !== "none" && !inp.refusalOvercome)
  ) {
    return {
      ...base,
      verdict: "incomplete",
      headline: "Answer the remaining questions",
      badge: "Incomplete",
      tone: "neutral",
      summary:
        "The renewal route has five separate conditions and all of them must hold. A partial answer would be misleading.",
      failures: [],
      met: [],
      windowDaysRemaining: null,
      windowLabel: null,
      thirdCountryWarning: null,
    };
  }

  /* Same classification. */
  if (inp.priorClass !== inp.applyingFor) {
    failures.push({
      condition: "Same classification",
      why: `The renewal route requires you to be renewing the same visa class. You are applying for ${meta.label} but your prior visa was ${inp.priorClass ? WAIVER_CLASSES[inp.priorClass as Exclude<WaiverClass, "">].label : "a different class"}.`,
      curable: null,
    });
  } else {
    met.push("Renewing the same visa classification");
  }

  /* The 12-month window. */
  const expiry = parseDate(inp.priorExpiry);
  let windowDaysRemaining: number | null = null;
  let windowLabel: string | null = null;
  if (expiry) {
    windowDaysRemaining = renewalWindowDaysRemaining(expiry, now);
    if (windowDaysRemaining < 0) {
      windowLabel = `The 12-month window closed ${Math.abs(windowDaysRemaining)} days ago.`;
      failures.push({
        condition: "12-month renewal window",
        why: `The prior visa expired more than 12 months ago, so the renewal route is closed. The window runs from the prior visa's expiration date, not its issuance date.`,
        curable: null,
      });
    } else {
      windowLabel = `${windowDaysRemaining} days left in the 12-month window.`;
      met.push(
        `Within the 12-month renewal window — ${windowDaysRemaining} days remaining`,
      );
    }
  }

  /* Full validity. */
  if (inp.fullValidity === "no") {
    failures.push({
      condition: "Prior visa issued for full validity",
      why: "The rule requires the prior visa to have been issued for full validity. A shortened or limited issuance does not satisfy it.",
      curable: null,
    });
  } else if (inp.fullValidity === "unsure") {
    failures.push({
      condition: "Prior visa issued for full validity",
      why: "You are not sure whether the prior visa was issued for full validity. This is an express condition and almost nobody checks it — compare the issue and expiry dates printed on the prior visa against the standard full validity for your nationality and class.",
      curable:
        "Check your prior visa's printed validity dates against the reciprocity schedule for your nationality.",
    });
  } else {
    met.push("Prior visa issued for full validity");
  }

  /* Age 18 at issuance. */
  if (inp.age18AtIssuance === "no") {
    failures.push({
      condition: "At least 18 at prior issuance",
      why: "The renewal route requires that you were at least 18 when the prior visa was issued. Since September 2025 there is no automatic waiver for applicants under 14 or over 79, so children attend in-person interviews.",
      curable: null,
    });
  } else if (inp.age18AtIssuance === "unsure") {
    failures.push({
      condition: "At least 18 at prior issuance",
      why: "Check the issuance date on the prior visa against the applicant's date of birth.",
      curable: "Confirm the applicant's age on the prior visa's issuance date.",
    });
  } else {
    met.push("At least 18 when the prior visa was issued");
  }

  /* Refusal history — the clause everyone misstates. */
  if (inp.refusalType === "none") {
    met.push("No prior visa refusal");
  } else if (inp.refusalOvercome === "yes") {
    met.push(
      "A prior refusal that was overcome or waived — which the rule expressly allows",
    );
  } else if (inp.refusalOvercome === "no") {
    failures.push({
      condition: "Never refused, unless overcome or waived",
      why:
        inp.refusalType === "221g"
          ? "An unresolved 221(g) is an open refusal. Once the administrative processing concludes and the visa is issued, that refusal has been overcome and this condition is satisfied — but while it is open, it is not."
          : "The refusal on your record has not been overcome or waived, so this condition is not met.",
      curable:
        inp.refusalType === "221g"
          ? "A 221(g) that resolves in issuance is overcome. Wait for the outcome rather than assuming the answer."
          : "A later successful issuance in the same or another class can overcome an earlier refusal. A formal waiver also satisfies the condition.",
    });
  } else {
    failures.push({
      condition: "Never refused, unless overcome or waived",
      why: "You are unsure whether the prior refusal was overcome. This clause is the most misread sentence in the rule: it does not permanently disqualify anyone who has ever been refused — it disqualifies an unresolved refusal. A 214(b) later followed by a successful issuance has been overcome.",
      curable:
        "Check whether a visa was actually issued to you after that refusal. If it was, the refusal was overcome.",
    });
  }

  /* Country of application. */
  const nat = norm(inp.nationality);
  const res = norm(inp.residence);
  const app = norm(inp.applyingIn);
  let thirdCountryWarning: string | null = null;
  if (app && app !== nat && app !== res) {
    failures.push({
      condition: "Apply in your country of nationality or usual residence",
      why: `You are applying in ${inp.applyingIn.trim()}, which is neither your country of nationality (${inp.nationality.trim()}) nor your country of usual residence (${inp.residence.trim()}). Place of application is itself a condition of the waiver.`,
      curable: `Apply in ${inp.nationality.trim()} or ${inp.residence.trim()} instead.`,
    });
    thirdCountryWarning = `Beyond the waiver question: since 6 September 2025 the Department of State has directed nonimmigrant applicants to schedule interviews in their country of nationality or residence, and warns that applying elsewhere may make it harder to qualify for the visa at all. Fees paid on a third-country application are neither refundable nor transferable. This is the specific trap for Indian nationals in the United States who book appointments in Canada or Mexico.`;
  } else if (app) {
    met.push("Applying in your country of nationality or usual residence");
  }

  /* Identity change — not a rule condition, but a practical one. */
  const identityNote =
    inp.identityChanged === "yes"
      ? "A name or date-of-birth change since the prior visa was issued does not appear as a condition in the rule, but in practice it complicates the identity match a waiver depends on. Expect the post to require an interview, and carry the documents evidencing the change."
      : null;
  if (identityNote) {
    failures.push({
      condition: "Identity match (practical, not a rule condition)",
      why: identityNote,
      curable:
        "Carry the marriage certificate, deed poll or corrected birth record evidencing the change, and expect an interview anyway.",
    });
  }

  if (failures.length === 0) {
    return {
      ...base,
      verdict: "likely-eligible",
      headline: "You appear to meet every condition for an interview waiver",
      badge: "Likely eligible",
      tone: "positive",
      summary: `On these answers you satisfy each condition in the update effective ${IW_CURRENT_RULE.effective}. That makes you eligible to be considered — it does not entitle you to a waiver. Consular officers may require an in-person interview in any case, for any reason, and the post makes the final call when the application is submitted.`,
      failures: [],
      met,
      windowDaysRemaining,
      windowLabel,
      thirdCountryWarning,
    };
  }

  const allCurable =
    failures.length > 0 && failures.every((f) => f.curable !== null);

  return {
    ...base,
    verdict: allCurable ? "needs-review" : "not-eligible",
    headline: allCurable
      ? "One or more conditions need checking before you can rely on this"
      : failures.length === 1
        ? "One condition fails, so an interview will be required"
        : `${failures.length} conditions fail, so an interview will be required`,
    badge: allCurable ? "Needs checking" : "Not eligible",
    tone: allCurable ? "caution" : "attention",
    summary: allCurable
      ? "Nothing here is a definite disqualification, but at least one condition depends on a fact you have not confirmed. Each one below says how to check it."
      : "Every condition has to hold at once. Where one fails, the application proceeds as a normal in-person interview.",
    failures,
    met,
    windowDaysRemaining,
    windowLabel,
    thirdCountryWarning,
  };
}
