/**
 * Port-of-entry / denied-entry cluster — single source of truth.
 *
 *   /h1b-denied-entry-airport        (hub + Port-of-Entry Risk Scorecard)
 *   /automatic-visa-revalidation     (AVR explainer + eligibility checker)
 *
 * EVERY legal statement in this file was read against the primary source and
 * carries its citation. Where the regulation and common practice differ, the
 * regulation is stated first and the practice is labelled as practice. Nothing
 * here is legal advice.
 *
 * VERIFICATION LOG — all checked 2026-09-09 against the sources named:
 *   · 22 CFR 41.112(d)   — eCFR, full text read. Automatic extension of visa
 *                          validity at ports of entry (AVR). Note (d)(2)(vii):
 *                          the bar is "has not applied for a new visa while
 *                          abroad" — applying at all defeats AVR, not merely
 *                          being refused.
 *   · 8 CFR 214.1(b)     — eCFR, full text read. IMPORTANT: this paragraph
 *                          covers ONLY F, J, M and Q(ii). It is NOT the
 *                          authority for H-1B automatic revalidation; for
 *                          H-1B the operative authority is 22 CFR 41.112(d)
 *                          alone. Widely mis-cited.
 *   · 8 CFR 214.1(l)     — eCFR. (l)(1) 10-day periods before/after validity
 *                          for E/H-1B/L-1/TN; (l)(2) the 60-day cessation-of-
 *                          employment grace period, discretionary and once per
 *                          authorized validity period.
 *   · 8 CFR 235.2        — eCFR. "Parole for deferred inspection"; (c) deferral
 *                          is accomplished under INA 212(d)(5).
 *   · 8 CFR 235.3(b)(2)(i) — eCFR. Form I-867A/I-867B sworn statement; the
 *                          traveller "shall sign and initial each page of the
 *                          statement and each correction"; Form I-860 Notice
 *                          and Order of Expedited Removal.
 *   · 8 CFR 235.4        — eCFR. Withdrawal of application for admission is
 *                          discretionary: "nothing in this section shall be
 *                          construed as to give an alien the right to withdraw".
 *   · INA 235(a)(4) / 8 USC 1225(a)(4) — withdrawal, "in the discretion of the
 *                          Attorney General and at any time".
 *   · INA 212(a)(9)(A)(i) / 8 USC 1182(a)(9)(A)(i) — 5-year bar after removal
 *                          under INA 235(b)(1); 20 years for a second removal.
 *   · CBP deferred inspection — cbp.gov: 70+ sites; Form I-546 "Order to
 *                          Appear — Deferred Inspection"; sites also correct
 *                          I-94 errors (wrong class, wrong period of admission,
 *                          biographical errors).
 *
 * COULD NOT VERIFY against a primary source (deliberately omitted from page
 * copy rather than asserted): Form I-275 "Withdrawal of Application for
 * Admission/Consular Notification" and Form I-877 do not appear anywhere in
 * 8 CFR part 235. I-877 belongs to the credible-fear process (8 CFR 208.30),
 * not to a routine H-1B refusal. Both were named in the source brief; neither
 * is cited on-page.
 */

export const POE_VERIFIED = "2026-09-09";

/* ─────────────────────── official sources ──────────────────────────────── */

export interface PoeSource {
  label: string;
  href: string;
  /** What this source was used to verify. */
  note: string;
}

export const poeSources: PoeSource[] = [
  {
    label: "22 CFR 41.112 — Validity of visa",
    href: "https://www.ecfr.gov/current/title-22/chapter-I/subchapter-E/part-41/subpart-K/section-41.112",
    note: "Automatic revalidation: the 30-day limit, contiguous territory, the seven conditions, and the state-sponsor-of-terrorism exclusion.",
  },
  {
    label: "8 CFR 214.1 — Requirements for admission, extension, maintenance of status",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/subpart-A/section-214.1",
    note: "214.1(b) readmission for F/J/M/Q only; 214.1(l) the 10-day and 60-day periods.",
  },
  {
    label: "8 CFR 235.2 — Parole for deferred inspection",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-235/section-235.2",
    note: "Deferred inspection and its statutory basis in INA 212(d)(5).",
  },
  {
    label: "8 CFR 235.3 — Inadmissible aliens and expedited removal",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-235/section-235.3",
    note: "The sworn statement on Forms I-867A/I-867B, the right to correct it, and Form I-860.",
  },
  {
    label: "8 CFR 235.4 — Withdrawal of application for admission",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-235/section-235.4",
    note: "Withdrawal is discretionary and confers no right.",
  },
  {
    label: "INA 235 / 8 USC 1225 — Inspection of applicants for admission",
    href: "https://www.law.cornell.edu/uscode/text/8/1225",
    note: "235(a)(4) withdrawal; 235(b)(1) expedited removal.",
  },
  {
    label: "INA 212 / 8 USC 1182 — Inadmissible aliens",
    href: "https://www.law.cornell.edu/uscode/text/8/1182",
    note: "212(a)(6)(C)(i) misrepresentation; 212(a)(7) documentation; 212(a)(9)(A)(i) the five-year bar; 212(d)(3) and (d)(5).",
  },
  {
    label: "CBP — Deferred Inspection Sites",
    href: "https://www.cbp.gov/about/contact/ports/deferred-inspection-sites",
    note: "The site list, Form I-546, and what deferred inspection can correct.",
  },
  {
    label: "CBP — Automatic revalidation for certain temporary visitors",
    href: "https://www.help.cbp.gov/s/article/Article-1446?language=en_US",
    note: "CBP's operational statement of AVR, including that you cannot apply for a new visa and use AVR at the same time.",
  },
  {
    label: "CBP — I-94 Arrival/Departure Record",
    href: "https://www.cbp.gov/travel/international-visitors/i-94",
    note: "Retrieving and checking the electronic I-94 after admission.",
  },
];

/* ─────────────────────── the three outcomes ────────────────────────────── */

export interface OutcomeRow {
  id: "withdrawal" | "expedited" | "deferred";
  name: string;
  whatItIs: string;
  /** Is it a removal order? */
  removalOrder: string;
  /** Statutory bar created. */
  bar: string;
  visaEffect: string;
  laterDisclosure: string;
  authority: string;
  tone: "caution" | "attention" | "info";
}

/**
 * The outcome fork at secondary inspection. These three are not interchangeable
 * and the difference between the first two is the single most consequential
 * thing on this page: one creates a five-year statutory bar, the other does not.
 */
export const poeOutcomes: OutcomeRow[] = [
  {
    id: "withdrawal",
    name: "Withdrawal of application for admission",
    whatItIs:
      "You ask to withdraw your request to enter and depart immediately, instead of being formally refused. CBP does not have to allow it — it is discretionary and confers no right.",
    removalOrder: "No — no removal order is issued",
    bar: "No INA 212(a)(9)(A)(i) five-year bar",
    visaEffect:
      "The visa is normally cancelled, but without a removal order attached to your record.",
    laterDisclosure:
      "You were refused admission and must disclose it. You were not removed.",
    authority: "INA 235(a)(4); 8 CFR 235.4",
    tone: "caution",
  },
  {
    id: "expedited",
    name: "Expedited removal",
    whatItIs:
      "A formal removal order issued by a CBP officer at the port, without a hearing before an immigration judge. Documented on a sworn statement (I-867A/B) and Form I-860.",
    removalOrder: "Yes — a formal order of removal",
    bar: "Five years' inadmissibility; 20 years for a second or subsequent removal",
    visaEffect:
      "Visa cancelled, and the removal order sits permanently on your immigration record.",
    laterDisclosure:
      "You must disclose a removal order on every future visa application and admission.",
    authority:
      "INA 235(b)(1); INA 212(a)(9)(A)(i); 8 CFR 235.3(b)",
    tone: "attention",
  },
  {
    id: "deferred",
    name: "Deferred inspection",
    whatItIs:
      "Inspection is not completed at the port. You are paroled in and ordered to report to a deferred inspection site on a later date with the documents CBP wants to see.",
    removalOrder: "No — the inspection is simply not finished",
    bar: "None, provided you report as ordered and the case resolves",
    visaEffect:
      "Visa normally untouched while the deferred inspection is pending.",
    laterDisclosure:
      "You were paroled for deferred inspection rather than admitted; keep the paperwork.",
    authority: "8 CFR 235.2; INA 212(d)(5); Form I-546",
    tone: "info",
  },
];

/* ─────────────────────── the referral causes ───────────────────────────── */

export interface ReferralCause {
  id: string;
  title: string;
  why: string;
  /** The question CBP is likely to ask about it. */
  question: string;
  /** The document that closes the gap. */
  closer: string;
}

/**
 * Why H-1B travellers get referred to secondary. Ordered roughly by how often
 * each one drives a referral for the Indian H-1B population specifically.
 */
export const referralCauses: ReferralCause[] = [
  {
    id: "third-party",
    title: "Third-party worksite / client-site placement",
    why: "The employer-employee relationship is hardest to see when you work at a client's site for a vendor of a prime contractor. CBP is looking for whether your petitioner actually controls your work.",
    question:
      "Who do you actually work for, who pays you, who assigns your daily tasks, and where is that written down?",
    closer:
      "Client letter or statement of work naming your petitioner, plus an employer letter describing supervision, and the itinerary if your petition had one.",
  },
  {
    id: "employer-inactive",
    title: "Employer no longer looks active",
    why: "If the petitioner has laid off staff, moved, or shows no recent filings, the officer may doubt the job still exists.",
    question: "Is your employer still operating and is the job still there?",
    closer:
      "Recent pay stubs, a dated employment verification letter, and a business card or corporate directory entry.",
  },
  {
    id: "duties-mismatch",
    title: "Duties do not match the I-129",
    why: "The petition describes a specialty occupation. If your description of your own job differs from it, that is a specialty-occupation problem in front of an officer with your petition on screen.",
    question: "Describe what you do day to day.",
    closer:
      "Know your own petition's job title and duties before you fly. A copy of the I-129 job description helps you answer consistently.",
  },
  {
    id: "worksite-change",
    title: "Worksite changed without an amendment",
    why: "A move outside the area of intended employment on the certified LCA generally requires an amended petition. An unamended move is a status problem, not a paperwork nicety.",
    question: "Where do you physically work, and what address is on your LCA?",
    closer:
      "The certified ETA-9035 LCA covering your current worksite, or the receipt for the amendment that covers the move.",
  },
  {
    id: "recent-change",
    title: "Employer changed in the last 90 days",
    why: "A new petitioner means a new relationship with no payroll history to show. Travel this soon after a transfer is the most avoidable risk on this list.",
    question: "When did you start, and have you actually been paid yet?",
    closer:
      "At least one pay stub from the new employer, the I-797 approval or receipt, and the new LCA.",
  },
  {
    id: "gap",
    title: "Employment gap or recent layoff",
    why: "Time out of payroll raises a maintenance-of-status question. The 60-day cessation-of-employment period at 8 CFR 214.1(l)(2) is discretionary and applies once per authorized validity period — it is not an entitlement.",
    question: "What were you doing between these two jobs?",
    closer:
      "Documentation of the gap's length and any filing made during it. If the gap is unresolved, get advice before flying.",
  },
  {
    id: "stamp-expired",
    title: "Approved extension but an expired visa stamp",
    why: "The approval and the visa are different documents. An expired stamp generally means a new visa before boarding — this is exactly the fact pattern people search for after being turned back.",
    question: "Where is your valid visa?",
    closer:
      "A valid visa stamp. If travelling only to Canada or Mexico for under 30 days, automatic revalidation may apply instead.",
  },
  {
    id: "i797b",
    title: "You are carrying an I-797B, not an I-797A",
    why: "An I-797A carries an I-94 tear-off and reflects an approved change or extension of status inside the US. An I-797B is a consular-notification approval with no I-94 attached — it does not by itself give you status.",
    question: "Which approval notice is that?",
    closer:
      "Know which one you hold. Carry all prior I-797s and your most recent I-94 printout.",
  },
  {
    id: "doc-inconsistency",
    title: "Document or online inconsistency",
    why: "A resume, LinkedIn profile or message thread that names a different employer or job title than the petition is a direct contradiction of the document CBP is holding.",
    question: "Your profile says you work somewhere else — explain.",
    closer:
      "Make sure your public profiles match your petition before you travel. Correct stale entries rather than explaining them at 2am.",
  },
  {
    id: "prior-history",
    title: "Prior immigration or criminal history",
    why: "A prior refusal, overstay, 221(g), withdrawal, or any arrest record will surface on the officer's screen whether or not you raise it.",
    question: "Have you ever been refused entry or a visa, or arrested anywhere?",
    closer:
      "Certified disposition documents for anything in your history, and legal advice before travel rather than after.",
  },
];

/* ─────────────────────── automatic revalidation ────────────────────────── */

/**
 * The seven conditions at 22 CFR 41.112(d)(2), in the regulation's own order,
 * plus the (d)(3) nationality exclusion. Paraphrased tightly; the regulation
 * text is linked on-page.
 */
export interface AvrCondition {
  id: string;
  cite: string;
  label: string;
  detail: string;
}

export const avrConditions: AvrCondition[] = [
  {
    id: "i94",
    cite: "22 CFR 41.112(d)(2)(i)",
    label: "An unexpired I-94 showing your period of admission or extension",
    detail:
      "F students additionally need a current, properly endorsed Form I-20; J exchange visitors a current Form DS-2019.",
  },
  {
    id: "trip",
    cite: "22 CFR 41.112(d)(2)(ii)",
    label: "An absence of 30 days or less, solely in contiguous territory",
    detail:
      "Contiguous territory means Canada and Mexico. Adjacent islands are available only to F and J nonimmigrants and their dependants, and never Cuba. For H-1B, H-4, L and most other categories it is Canada and Mexico only.",
  },
  {
    id: "maintained",
    cite: "22 CFR 41.112(d)(2)(iii)",
    label: "You have maintained, and intend to resume, your nonimmigrant status",
    detail:
      "A status problem does not disappear because the trip was short.",
  },
  {
    id: "within",
    cite: "22 CFR 41.112(d)(2)(iv)",
    label: "You are returning within your authorized period of stay",
    detail:
      "The admit-until date on your I-94 must not have passed while you were away.",
  },
  {
    id: "passport",
    cite: "22 CFR 41.112(d)(2)(v)",
    label: "You hold a valid passport",
    detail: "Valid at the moment you apply for readmission.",
  },
  {
    id: "212d3",
    cite: "22 CFR 41.112(d)(2)(vi)",
    label: "You do not require a waiver under INA 212(d)(3)",
    detail:
      "If you need a nonimmigrant waiver to be admissible, automatic revalidation is not available to you.",
  },
  {
    id: "no-application",
    cite: "22 CFR 41.112(d)(2)(vii)",
    label: "You have NOT applied for a new visa while abroad",
    detail:
      "This is the trap, and it is stricter than most write-ups suggest. The regulation bars automatic revalidation once you have applied — not merely once you have been refused. Apply for a visa in Canada or Mexico and you have given up automatic revalidation for that trip, whatever the outcome. If the application is still pending you wait abroad for it; if it is refused you may be stuck outside the United States.",
  },
];

export const AVR_NATIONALITY_EXCLUSION = {
  cite: "22 CFR 41.112(d)(3)",
  text: "Automatic revalidation does not apply to nationals of countries identified as supporting terrorism in the Department of State's annual report to Congress — the State Sponsors of Terrorism designation. Check the current designated list before relying on this provision.",
  listHref: "https://www.state.gov/state-sponsors-of-terrorism/",
};

/**
 * Deliberately NOT a general AVR authority. Recorded here because the
 * mis-citation is so common that the page corrects it explicitly.
 */
export const AVR_MISCITATION_NOTE = {
  cite: "8 CFR 214.1(b)",
  text: "8 CFR 214.1(b) is frequently cited as the authority for automatic revalidation for all nonimmigrants. It is not. Read in full, that paragraph is titled 'Readmission of nonimmigrants under section 101(a)(15) (F), (J), (M), or (Q)(ii)' and applies only to those four classifications — it tells the inspecting officer how to readmit an F, J, M or Q(ii) traveller whose visa is revalidated under 22 CFR 41.112(d). For an H-1B, H-4 or L traveller the operative authority is 22 CFR 41.112(d) alone.",
};

/* ─────────────────────── the sworn statement ───────────────────────────── */

export const swornStatement = {
  forms: "Forms I-867A and I-867B",
  cite: "8 CFR 235.3(b)(2)(i)",
  /** Verbatim from the regulation — the reader's most useful single sentence. */
  correctionRight:
    "the alien shall sign and initial each page of the statement and each correction",
  summary:
    "In every case where expedited removal will be applied, the officer must create a sworn record. Form I-867A is read to you; your answers are recorded on Form I-867B. You are then to read the statement — or have it read to you — and sign and initial each page and each correction. Form I-860 is the Notice and Order of Expedited Removal itself.",
} as const;

/* ─────────────────────── deferred inspection ───────────────────────────── */

export const deferredInspection = {
  form: "Form I-546, Order to Appear — Deferred Inspection",
  siteCount: "more than 70",
  sitesHref: "https://www.cbp.gov/about/contact/ports/deferred-inspection-sites",
  cite: "8 CFR 235.2; INA 212(d)(5)",
  corrects: [
    "An improper nonimmigrant classification recorded at entry",
    "An incorrect period of admission (the admit-until date)",
    "Inaccurate biographical information on the arrival record",
  ],
} as const;

/* ─────────────────────── I-94 truncation ───────────────────────────────── */

export const i94Notes = {
  /**
   * The most common "my I-94 is wrong" case is not an error at all.
   */
  passportTruncation:
    "If your I-94 admit-until date matches your passport expiry rather than your petition validity, that is usually not a mistake. CBP routinely admits a traveller only to the expiry of the passport. The fix is a new passport and then an I-94 correction or a new admission — not an argument at the airport.",
  realErrors:
    "A genuine CBP error — wrong visa class, wrong date unrelated to your passport, misspelled name or wrong date of birth — is what deferred inspection sites exist to correct.",
  checkHref: "https://i94.cbp.dhs.gov/",
  cite: "8 CFR 235.2 (deferred inspection); CBP I-94 guidance",
} as const;

/* ─────────────────────── grace periods ─────────────────────────────────── */

export const gracePeriods = {
  tenDay: {
    cite: "8 CFR 214.1(l)(1)",
    text: "E-1, E-2, E-3, H-1B, L-1 and TN holders and their dependants may be admitted for the petition validity period plus up to 10 days before it begins and 10 days after it ends. You may not work during those 10-day windows unless separately authorized.",
  },
  sixtyDay: {
    cite: "8 CFR 214.1(l)(2)",
    text: "After employment ceases, an E-1, E-2, E-3, H-1B, H-1B1, L-1, O-1 or TN holder is not treated as having failed to maintain status for up to 60 consecutive days, or until the end of the authorized validity period, whichever is shorter — once during each authorized validity period. DHS may shorten or eliminate this period as a matter of discretion, and you may not work during it.",
  },
} as const;
