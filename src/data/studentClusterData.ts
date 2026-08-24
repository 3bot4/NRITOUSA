/**
 * Single source of truth for the F-1 / international-student cluster.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY THIS FILE IS STRICT ABOUT "STATUS"
 * Two of the biggest numbers in this cluster — the $100,000 H-1B fee and the
 * $100,000 OPT fee — are NOT law as of the verification date below. One was
 * vacated by a federal court and is not being collected; the other has never
 * been published as a rule at all. Most competing pages still present both as
 * settled costs. Every policy item here therefore carries an explicit
 * `status` and `statusLine`, and UI must render the status wherever it
 * renders the number. Never print $100,000 without its status.
 *
 * MONTHLY MAINTENANCE
 * Re-verify each `PolicyItem.statusLine` and every fee against the official
 * source URL, then bump STUDENT_DATA_VERIFIED. Litigation moves fast.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** ISO date the values in this file were last checked against source. */
export const STUDENT_DATA_VERIFIED = "2026-08-20";

/** Human-readable version of the same date, for prose. */
export const STUDENT_DATA_VERIFIED_LABEL = "August 20, 2026";

/* ───────────────────────────── Official sources ────────────────────────── */

export const studentSources = {
  sevisFee: {
    label: "ICE — I-901 SEVIS Fee",
    href: "https://www.ice.gov/sevis/i901",
  },
  visaFees: {
    label: "State Dept — Fees for Visa Services",
    href: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
  },
  optUnemployment: {
    label: "DHS Study in the States — SEVIS unemployment counter",
    href: "https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/unemployment-counter",
  },
  stemOpt: {
    label: "DHS Study in the States — STEM OPT extension",
    href: "https://studyinthestates.dhs.gov/stem-opt-hub",
  },
  irsAliens: {
    label: "IRS — Substantial Presence Test",
    href: "https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test",
  },
  irsExempt: {
    label: "IRS — Exempt individual: students",
    href: "https://www.irs.gov/individuals/international-taxpayers/exempt-individual-who-is-a-student",
  },
  irsFica: {
    label: "IRS — Student FICA exception / nonresident alien FICA",
    href: "https://www.irs.gov/individuals/international-taxpayers/foreign-student-liability-for-social-security-and-medicare-taxes",
  },
  irsPub519: {
    label: "IRS Publication 519 — US Tax Guide for Aliens",
    href: "https://www.irs.gov/forms-pubs/about-publication-519",
  },
  irsInflation2026: {
    label: "IRS — Tax inflation adjustments for tax year 2026",
    href: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
  },
  irsForm843: {
    label: "IRS — Form 843 (refund of erroneously withheld tax)",
    href: "https://www.irs.gov/forms-pubs/about-form-843",
  },
  irsTreaty: {
    label: "IRS — US-India income tax treaty documents",
    href: "https://www.irs.gov/businesses/international-businesses/india-tax-treaty-documents",
  },
  reinstatement: {
    label: "DHS Study in the States — Reinstatement",
    href: "https://studyinthestates.dhs.gov/students/reinstatement",
  },
  dsFinalRule: {
    label:
      "Federal Register — Establishing a Fixed Time Period of Admission (final rule, July 17, 2026)",
    href:
      "https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant",
  },
  dsQuickFacts: {
    label: "DHS Study in the States — Fixed period of admission: quick facts",
    href:
      "https://studyinthestates.dhs.gov/final-rule-establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-quick",
  },
  dsLitigation: {
    label:
      "Presidents' Alliance — Duration of Status litigation tracker",
    href: "https://www.presidentsalliance.org/duration-of-status-litigation/",
  },
  unlawfulPresenceInjunction: {
    label:
      "Guilford College v. Nielsen — order vacating the 2018 unlawful-presence memo (USCIS)",
    href:
      "https://www.uscis.gov/sites/default/files/document/injunctions/Guilford-College-v.-Nielsen-summary-judgment-permanent-injunction.pdf",
  },
  uscisPolicyManualOpt: {
    label:
      "USCIS Policy Manual, Vol. 2, Part F, Ch. 5 — Practical Training",
    href: "https://www.uscis.gov/policy-manual/volume-2-part-f-chapter-5",
  },
  capGap: {
    label: "DHS Study in the States — F-1 cap-gap extension",
    href:
      "https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-status/f-1-cap-gap-extension",
  },
  nafsa: {
    label: "NAFSA — Association of International Educators",
    href: "https://www.nafsa.org/",
  },
  ailaLawyerSearch: {
    label: "AILA — Immigration Lawyer Search",
    href: "https://www.ailalawyer.com/",
  },
  hpiVisa: {
    label: "GOV.UK — High Potential Individual visa: global universities list",
    href: "https://www.gov.uk/government/publications/high-potential-individual-visa-global-universities-list",
  },
  expressEntry: {
    label: "IRCC — Express Entry: Comprehensive Ranking System",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html",
  },
  eca: {
    label: "IRCC — Educational credential assessment",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessment.html",
  },
  irsDualStatus: {
    label: "IRS — Taxation of dual-status individuals",
    href: "https://www.irs.gov/individuals/international-taxpayers/taxation-of-dual-status-individuals",
  },
  irsPub590a: {
    label:
      "IRS Publication 590-A — Contributions to Individual Retirement Arrangements",
    href: "https://www.irs.gov/publications/p590a",
  },
  irsSsMedicareAliens: {
    label: "IRS — Aliens employed in the US: Social Security taxes",
    href: "https://www.irs.gov/individuals/international-taxpayers/aliens-employed-in-the-us-social-security-taxes",
  },
  h1bModernizationRule: {
    label:
      "Federal Register — Modernizing H-1B Requirements and Providing Flexibility in the F-1 Program (final rule, effective January 17, 2025)",
    href:
      "https://www.federalregister.gov/documents/2024/12/18/2024-29354/modernizing-h-1b-requirements-providing-flexibility-in-the-f-1-program-and-program-improvements",
  },
  capGapRuleChange: {
    label: "DHS Study in the States — Recent H-1B rule extends the F-1 cap-gap extension",
    href: "https://studyinthestates.dhs.gov/2025/04/recent-h-1b-rule-extends-f-1-cap-gap-extension",
  },
  cfrNonimmigrantGracePeriod: {
    label: "8 CFR 214.1(l)(2) — 60-day grace period on cessation of employment",
    href:
      "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/subpart-A/section-214.1",
  },
} as const;

export type StudentSourceKey = keyof typeof studentSources;

/* ─────────────────────── Policy items with live status ─────────────────── */

/**
 * `status` drives the UI badge and, more importantly, whether the number is
 * allowed to be added into any total:
 *  - "in-force"        — law today, safe to total
 *  - "blocked"         — exists on paper but a court has stopped collection
 *  - "proposed"        — reported/floated, never published as a rule
 *  - "uneven"          — in force but inconsistently collected in practice
 *  - "scheduled"       — a final rule with a future effective date. Real, but
 *                        not yet operative, and may be enjoined before it is.
 */
export type PolicyStatus =
  | "in-force"
  | "blocked"
  | "proposed"
  | "uneven"
  | "scheduled";

export interface PolicyItem {
  id: string;
  label: string;
  /** Display value, e.g. "$100,000". */
  value: string;
  /** Numeric value for math. `null` when the item must never be totalled. */
  amountUsd: number | null;
  status: PolicyStatus;
  /** One sentence a reader can quote. Kept short enough for a badge tooltip. */
  statusLine: string;
  /** Longer explanation for the page body. */
  detail: string;
  lastVerified: string;
  source: { label: string; href: string };
}

export const STATUS_BADGE: Record<
  PolicyStatus,
  { label: string; tone: "good" | "warn" | "bad" | "info" }
> = {
  "in-force": { label: "In force", tone: "good" },
  blocked: { label: "Blocked by court", tone: "info" },
  proposed: { label: "Proposed only", tone: "warn" },
  uneven: { label: "In force — uneven rollout", tone: "warn" },
  scheduled: { label: "Final rule — not yet in effect", tone: "warn" },
};

/**
 * The $100,000 H-1B fee. Vacated June 8 2026; the First Circuit declined to
 * restore it on July 24 2026, so it is not being collected as of the
 * verification date. Proclamation 10973 is a 12-month measure that lapses
 * September 20 2026 unless extended.
 */
export const h1bProclamationFee: PolicyItem = {
  id: "h1b-proclamation-fee",
  label: "H-1B $100,000 proclamation payment",
  value: "$100,000",
  amountUsd: null,
  status: "blocked",
  statusLine:
    "Vacated by a federal court on June 8, 2026 and NOT currently collected — the First Circuit declined to reinstate it on July 24, 2026 while the government's appeal proceeds.",
  detail:
    "Proclamation 10973 (September 21, 2025) directed a $100,000 payment tied to certain new H-1B petitions for beneficiaries outside the United States. A federal district court vacated the implementing policy on June 8, 2026, holding it functioned as an unlawful tax. A brief administrative stay put it back in force in mid-June; on July 24, 2026 the First Circuit denied the government's motion to stay, so the vacatur stands and employers are not paying it while the appeal runs. Separately, the proclamation was written as a 12-month measure expiring September 20, 2026 unless extended. It never applied to students already in the US changing status from F-1 to H-1B, and where it did apply it fell on the employer, not the worker.",
  lastVerified: STUDENT_DATA_VERIFIED,
  source: {
    label: "Proclamation 10973 (Federal Register)",
    href: "https://www.federalregister.gov/documents/2025/09/25/2025-18627/restriction-on-entry-of-certain-nonimmigrant-workers",
  },
};

/**
 * The $100,000 OPT fee. Reported by the Wall Street Journal on July 30 2026.
 * Never published as a proposed rule. Must never appear as a cost.
 */
export const optProposedFee: PolicyItem = {
  id: "opt-proposed-fee",
  label: "OPT $100,000 fee",
  value: "$100,000",
  amountUsd: null,
  status: "proposed",
  statusLine:
    "PROPOSED ONLY — reported July 30, 2026, never published as a rule. Nobody is paying this, and it is not scheduled to take effect.",
  detail:
    "Press reporting on July 30, 2026 described an internal discussion at DHS about charging $100,000 in connection with Optional Practical Training. As of the verification date there is no published proposed rule, no Federal Register notice, no stated amount in regulation, and no answer to the basic questions of who would pay it or who would be exempt. The DHS regulatory agenda lists a separate OPT rulemaking with an expected publication date in February 2027. Immigration practitioners have widely questioned whether such a fee would survive the same legal challenge that defeated the H-1B version. Treat any page that quotes this as a real cost as out of date.",
  lastVerified: STUDENT_DATA_VERIFIED,
  source: {
    label: "DHS Unified Regulatory Agenda",
    href: "https://www.reginfo.gov/public/do/eAgendaMain",
  },
};

/**
 * The end of duration of status. This is the single most consequential change
 * scheduled for F-1 students, and unlike the two $100,000 numbers above it is
 * a real, published, final rule — it simply has not taken effect yet.
 *
 * It matters to this cluster because it halves the grace period every page
 * here quotes. The 60-day figure remains correct for students already
 * admitted for D/S, so the calculators keep using it; every page that prints
 * it must also print this item.
 */
export const dsFixedAdmissionRule: PolicyItem = {
  id: "ds-fixed-admission-rule",
  label: "End of duration of status — fixed admission periods",
  value: "Effective September 15, 2026",
  amountUsd: null,
  status: "scheduled",
  statusLine:
    "FINAL RULE, not yet in effect — takes effect September 15, 2026 and is being challenged in federal court, with a hearing set for September 9, 2026.",
  detail:
    "DHS published a final rule on July 17, 2026 replacing \"duration of status\" admission for F, J and I nonimmigrants with a fixed period of admission. From September 15, 2026, an F-1 student is admitted for the length of the program shown on the I-20, capped at four years, plus a 30-day grace period rather than 60 days. Staying past the I-94 date without a timely extension of stay would start unlawful presence accruing — the consequence the current duration-of-status framework does not carry. Students already admitted for duration of status before September 15, 2026 generally keep the 60-day grace period until they travel abroad and re-enter, or file an extension of stay; international travel after the effective date is what triggers conversion to a date-certain admission. There is transition relief specifically for practical training: a student who was admitted for duration of status, is in the US and maintaining status on September 15, 2026, and who timely files Form I-765 for post-completion OPT or STEM OPT on or before March 18, 2027, generally does not have to file a separate Form I-539 extension of stay for that training period. File after that window and the I-539 is generally required alongside the I-765, which is where delayed start dates and gaps in employment come from. A coalition led by NAFSA and the Presidents' Alliance sued to block the rule on August 18, 2026 (D. Mass., Presidents' Alliance v. DHS, No. 1:26-cv-13799, before Judge F. Dennis Saylor IV), the government's response is due August 31, 2026, and a hearing on the preliminary injunction is set for September 9, 2026. Nothing here is settled: confirm your own admission period with your DSO and check your most recent I-94 before relying on any grace-period figure.",
  lastVerified: STUDENT_DATA_VERIFIED,
  source: studentSources.dsFinalRule,
};

/* ────────────────────────── F-1 visa cost stack ────────────────────────── */

export interface FeeItem {
  id: string;
  label: string;
  amountUsd: number;
  status: PolicyStatus;
  note: string;
  perDependent: boolean;
  refundable: string;
  source: { label: string; href: string };
}

export const f1VisaFees: FeeItem[] = [
  {
    id: "sevis",
    label: "I-901 SEVIS fee",
    amountUsd: 350,
    status: "in-force",
    note: "Paid at FMJFEE.com before the visa interview. F-1 and M-1 students pay $350; J-1 exchange visitors pay a different amount.",
    perDependent: false,
    refundable:
      "Not refundable if the visa is refused. It stays valid for 12 months if you reapply for the same SEVIS ID.",
    source: studentSources.sevisFee,
  },
  {
    id: "mrv",
    label: "MRV visa application fee",
    amountUsd: 185,
    status: "in-force",
    note: "The nonimmigrant visa application fee, paid before booking the consular interview.",
    perDependent: true,
    refundable:
      "Never refundable — it is charged for processing the application, approved or refused.",
    source: studentSources.visaFees,
  },
  {
    id: "integrity",
    label: "Visa integrity fee",
    amountUsd: 250,
    status: "uneven",
    note: "Created by the 2025 budget act, effective October 1, 2025. Charged only when a visa is actually issued, and adjusted for inflation annually. Rollout across consulates has been uneven — some posts collect it, others are still standing up payment systems.",
    perDependent: true,
    refundable:
      "The statute describes a reimbursement in narrow circumstances, but no working refund process exists in practice. Budget as if it is unrecoverable.",
    source: studentSources.visaFees,
  },
];

/** $785 for a single F-1 applicant, as of the verification date. */
export const f1VisaTotalUsd = f1VisaFees.reduce((s, f) => s + f.amountUsd, 0);

/** Each F-2 dependent repeats the per-applicant fees but not the SEVIS fee. */
export const f2DependentAddOnUsd = f1VisaFees
  .filter((f) => f.perDependent)
  .reduce((s, f) => s + f.amountUsd, 0);

/* ─────────────────────────── OPT / CPT rule set ────────────────────────── */

export const optRules = {
  /** Unemployment allowed during the initial 12-month post-completion OPT. */
  initialUnemploymentDays: 90,
  /**
   * TOTAL unemployment allowed across post-completion OPT *and* the STEM
   * extension combined. This is an aggregate cap, NOT a reset: a student who
   * burns 40 days on initial OPT has 110 left on STEM, not 150.
   * Getting this wrong is the single most common error in OPT content.
   */
  aggregateUnemploymentDaysWithStem: 150,
  /** Extra days the STEM extension adds on top of the initial 90. */
  stemAdditionalUnemploymentDays: 60,
  /** Length of the STEM OPT extension in months. */
  stemMonths: 24,
  /** Standard post-completion OPT length in months. */
  postCompletionMonths: 12,
  /** Grace period after OPT ends (or after program end without OPT). */
  gracePeriodDays: 60,
  /** Grace period after a program is abandoned / status is terminated. */
  terminationGraceDays: 0,
  /** Earliest you may file I-765 before the program end date. */
  filingWindowDaysBefore: 90,
  /** Latest you may file I-765 after the program end date. */
  filingWindowDaysAfter: 60,
  /** STEM extension must be filed before the current EAD expires. */
  stemFilingWindowDaysBefore: 90,
  /**
   * Hard rule most OPT content omits: 8 CFR 214.2(f)(11)(i)(B)(2) requires the
   * I-765 to reach USCIS within 30 days of the DSO entering the OPT
   * recommendation in SEVIS. File outside that window and it is denied —
   * separately from, and in addition to, the 90/60-day window above.
   */
  dsoRecommendationFilingDays: 30,
  /** The equivalent window for a STEM extension recommendation. */
  stemDsoRecommendationFilingDays: 60,
  /**
   * A timely-filed STEM extension carries automatic work authorisation for up
   * to 180 days past EAD expiry while it is pending —
   * 8 CFR 274a.12(b)(6)(iv). This does NOT exist for initial OPT.
   */
  stemPendingAutoExtensionDays: 180,
  /**
   * Grace period an F-1 student admitted under the September 15, 2026 fixed
   * admission rule receives instead of 60 days. See dsFixedAdmissionRule.
   */
  gracePeriodDaysUnderFixedAdmission: 30,
  /** Minimum weekly hours for STEM OPT employment to count. */
  stemMinWeeklyHours: 20,
  /** Minimum weekly hours generally treated as employed on initial OPT. */
  initialMinWeeklyHours: 20,
  /** Months of full-time study normally required before CPT eligibility. */
  cptAcademicYearMonths: 9,
  /** Full-time CPT beyond this many months eliminates OPT eligibility. */
  cptFullTimeMonthsThatKillOpt: 12,
  /** Reinstatement must generally be filed within this window. */
  reinstatementFilingMonths: 5,
} as const;

/* ──────────────────────────── Cap-gap mechanics ────────────────────────── */

/**
 * The cap-gap bridge between an OPT end date and an H-1B start date.
 *
 * The end date changed and a great deal of published advice has not caught
 * up. The H-1B modernization final rule (89 FR 103186, effective January 17,
 * 2025) moved the end of the cap-gap extension from October 1 to April 1 of
 * the fiscal year the H-1B is requested for — first applied from the FY2026
 * registration season. Never write "through September 30" on this site.
 *
 * The status extension and the work-authorisation extension are separate
 * benefits with different conditions, and collapsing them is the second most
 * common cap-gap error after the date.
 */
export const capGapRules = {
  /** The extension now runs to April 1 of the relevant fiscal year. */
  endsOn: "April 1 of the fiscal year the H-1B is requested for",
  /** Headline/table form of the same date, for headings and tight cells. */
  endsOnShort: "April 1",
  /** …or the approved petition's validity start date, if that comes first. */
  orEarlier: "the validity start date of the approved petition, whichever is earlier",
  /** The pre-2025 end date, kept only so stale copy can be recognised. */
  formerEndDate: "October 1",
  effectiveDate: "2025-01-17",
  firstFiscalYearApplied: 2026,
  /** Extends F-1 STATUS when the petition is timely filed in a valid F-1 period. */
  statusCondition:
    "A timely cap-subject Form I-129 requesting a change of status, filed while the student's F-1 status was still valid — including during the 60-day grace period.",
  /** Extends WORK AUTHORISATION only on the narrower condition. */
  workAuthCondition:
    "employment authorisation is extended only if the student was in an authorized period of post-completion OPT when the petition was filed. A student already in the grace period gets the status extension without the right to work.",
  automatic:
    "there is no application and no new EAD; the DSO issues an updated Form I-20 as evidence, but the extension exists whether or not the document is in hand.",
  endsEarlyIf:
    "The extension ends if the petition is denied, rejected, revoked or withdrawn.",
  source: studentSources.capGapRuleChange,
  ruleSource: studentSources.h1bModernizationRule,
} as const;

/* ───────────────────────── OPT denial consequences ─────────────────────── */

/**
 * What happens to F-1 status when an OPT application is denied.
 *
 * This page previously asserted "60 days from the date of the denial notice",
 * then — during review — retreated to "confirm with your DSO" because no
 * primary source had been found. Both were wrong to publish: the USCIS Policy
 * Manual states the rule, and it is neither of those. The 60 days runs from
 * the LATER of the program end date and the denial date, and there is a
 * carve-out that reverses the answer entirely.
 *
 * The STEM branch is genuinely different — 60 days from the denial date — so
 * the two cases must not be collapsed into one line.
 */
export const optDenialRules = {
  postCompletion:
    "If an initial post-completion OPT application is denied, USCIS states that F-1 status expires 60 days from the date the degree program ends or the date of the denial, whichever is later.",
  postCompletionException:
    "The exception matters more than the rule: if the application was denied because the student failed to maintain F-1 status, there is no 60-day period — the student is expected to depart the United States immediately.",
  stemExtension:
    "If a STEM OPT extension is denied after the post-completion OPT EAD has already expired, employment authorisation ends on the date of the decision and F-1 status ends 60 days after the denial date.",
  caveat:
    "Which branch you are on turns on the stated reason for the denial, so read the notice itself and take it to your DSO before counting any days.",
  source: studentSources.uscisPolicyManualOpt,
} as const;

/* ─────────────────────── Unlawful presence position ────────────────────── */

/**
 * Widely mis-stated, including by pages that are otherwise careful.
 *
 * A 2018 USCIS policy memo would have started unlawful presence running from
 * the day an F-1 student violated status. It was vacated and permanently
 * enjoined nationwide in Guilford College v. Nielsen (M.D.N.C., 2020), and
 * was never reinstated. Under the rule that therefore still applies, a
 * student admitted for duration of status generally begins accruing unlawful
 * presence only once USCIS formally finds a status violation while
 * adjudicating a benefit request, or an immigration judge so finds.
 *
 * Status violation and unlawful presence are different things, and the
 * distinction is what decides whether the 3- and 10-year re-entry bars are in
 * play. Never write "unlawful presence starts immediately" — it is both wrong
 * and, on a page read by someone in a panic, actively harmful.
 *
 * IMPORTANT: the fixed-admission final rule (dsFixedAdmissionRule) is
 * designed to change exactly this for students admitted on or after
 * September 15, 2026, who would accrue unlawful presence from the day their
 * I-94 expires.
 */
export const unlawfulPresence = {
  currentRule:
    "For a student admitted for duration of status, unlawful presence generally begins only after USCIS formally finds a status violation while deciding a benefit request, or an immigration judge orders removal — not automatically on the day the violation or SEVIS termination occurs.",
  whyItMatters:
    "Losing status and accruing unlawful presence are separate problems. Losing status is serious and needs immediate advice; accruing more than 180 days of unlawful presence is what triggers the 3-year and 10-year bars on returning to the US.",
  caveat:
    "This is the position after Guilford College v. Nielsen vacated the 2018 policy memo nationwide. It does not make a terminated record safe, it does not authorise you to stay or work, and the fixed-admission rule taking effect September 15, 2026 is expressly intended to change it for students admitted from that date.",
  source: studentSources.unlawfulPresenceInjunction,
} as const;

/* ───────────────────────────── Tax constants ───────────────────────────── */

export const taxConstants = {
  /** Combined employee FICA rate: 6.2% Social Security + 1.45% Medicare. */
  ficaPct: 7.65,
  socialSecurityPct: 6.2,
  medicarePct: 1.45,
  /**
   * Calendar years an F-1 student is an "exempt individual" whose days do not
   * count toward the substantial presence test. Counted as calendar years, so
   * an August arrival burns a whole year on five months of presence.
   */
  f1ExemptCalendarYears: 5,
  /** J-1 students get the same 5 years; J-1 scholars/researchers get 2. */
  j1ScholarExemptCalendarYears: 2,
  /** Substantial presence test thresholds. */
  sptTotalDaysThreshold: 183,
  sptCurrentYearMinimum: 31,
  /** Standard deduction for a single filer, by tax year. */
  standardDeductionSingle: {
    2025: 15750,
    2026: 16100,
  } as Record<number, number>,
  /** Most recent tax year whose standard deduction is published. */
  latestPublishedTaxYear: 2026,
} as const;

export const indiaTreaty = {
  article: "Article 21(2)",
  name: "US-India Income Tax Treaty",
  benefit:
    "Students and business apprentices from India may claim the standard deduction on Form 1040-NR — a benefit almost no other nationality gets.",
  claimMechanic:
    'Claimed on Schedule A of Form 1040-NR, annotated "Standard Deduction Allowed Under US/India Income Tax Treaty".',
  eligibility:
    "You must have been a resident of India immediately before travelling to the US, and be present in the US principally for education or training.",
  caution:
    "The treaty does not make you a US resident for tax purposes, and it does not open up other resident-only benefits. It is a targeted deduction, nothing more.",
  source: studentSources.irsTreaty,
} as const;

/* ─────────────────────── Remittance: US side and India side ────────────── */

export const usRemittanceExcise = {
  ratePct: 1,
  code: "IRC §4475",
  effective: "Transfers made after December 31, 2025",
  taxable:
    "Only transfers the sender funds with cash, a money order, a cashier's check, or a similar physical instrument.",
  exempt:
    "Transfers funded from a US bank account, a debit card, a credit card, or a digital wallet are NOT taxed. That covers essentially every transfer a student or H-1B worker makes through a normal app or bank.",
  whoPays:
    "Imposed on the sender but collected and remitted quarterly by the transfer provider.",
  headline:
    "Almost no student pays this. If you send money from your US bank account or card, the rate is zero.",
} as const;

export const indiaTcs = {
  educationSelfFunded: {
    fromApr2026Pct: 2,
    beforeApr2026Pct: 5,
    changeDate: "2026-04-01",
  },
  educationLoanFundedPct: 0,
  thresholdInr: 1000000,
  thresholdLabel: "₹10 lakh",
  section: "Section 206C(1G)",
  loanCondition:
    "Zero TCS applies where the remittance is funded by an education loan from a financial institution specified under Section 80E.",
  creditNote:
    "TCS is not a cost. It is tax collected in advance and credited against the remitter's Indian income tax liability — refundable on the Indian return if there is no liability to absorb it.",
  headline:
    "The self-funded education rate fell from 5% to 2% on April 1, 2026. Loan-funded tuition is still 0%.",
} as const;

/* ──────────────────── Long-run value of US work experience ─────────────── */

/**
 * The part of the ROI story most "is a US degree worth it" content omits: a
 * US degree plus US work experience is a portable credential that changes
 * what other countries' immigration systems will do for you. These are
 * structural facts about other countries' systems, not projections.
 */
export interface MobilityFact {
  id: string;
  country: string;
  route: string;
  whatItDoes: string;
  whyUsExperienceMatters: string;
  catch: string;
  source: { label: string; href: string };
}

export const globalMobilityFacts: MobilityFact[] = [
  {
    id: "uk-hpi",
    country: "United Kingdom",
    route: "High Potential Individual (HPI) visa",
    whatItDoes:
      "An unsponsored UK work visa — no job offer and no employer needed — for graduates of qualifying global universities who finished within the last five years.",
    whyUsExperienceMatters:
      "The qualifying list is built from global university rankings, and US institutions make up a large share of it. A US degree can be the single qualifying fact that opens an unsponsored route into the UK labour market.",
    catch:
      "The eligible-university list is republished each year and you must match the list for the year you graduated. Your qualification has to be verified through Ecctis, and the five-year window is strict.",
    source: studentSources.hpiVisa,
  },
  {
    id: "ca-express-entry",
    country: "Canada",
    route: "Express Entry — Comprehensive Ranking System",
    whatItDoes:
      "Points-ranked permanent residence. Skilled foreign work experience earns points under the skills-transferability block when paired with language scores or Canadian experience.",
    whyUsExperienceMatters:
      "Skilled work experience gained outside Canada is one of the few levers that raises a skills-transferability score, and US employment is straightforward to document — offer letters, pay stubs, W-2s and reference letters map cleanly onto what IRCC asks for.",
    catch:
      "The work must be paid, skilled (NOC TEER 0/1/2/3), full-time or the part-time equivalent, and accrued in the last ten years. Your US degree needs an Educational Credential Assessment from an approved body such as WES before it counts.",
    source: studentSources.expressEntry,
  },
  {
    id: "credential-recognition",
    country: "Multiple",
    route: "Educational Credential Assessment (ECA)",
    whatItDoes:
      "Converts a foreign degree into a recognised local equivalent for immigration and licensing purposes.",
    whyUsExperienceMatters:
      "US regionally accredited degrees are among the most routinely recognised credentials worldwide, which usually makes the assessment a paperwork exercise rather than a risk.",
    catch:
      "Accreditation is what carries the weight, not the school's marketing. Verify a programme's regional accreditation before enrolling — this is the specific thing that goes wrong with degree-mill and some Day-1-CPT-marketed programmes.",
    source: studentSources.eca,
  },
];

/**
 * Career-capital effects of US work experience. These are directional
 * statements about how hiring and immigration systems treat the credential,
 * deliberately written without invented percentages.
 */
export const careerCapitalPoints = [
  {
    title: "The experience outlives the visa",
    body: "A visa is revocable and time-limited. Work experience on your résumé is neither. Even in the scenario where you leave the US, the years you worked there stay on your record permanently and keep paying out in every subsequent hiring market.",
  },
  {
    title: "It converts a degree into a track record",
    body: "A degree says you can learn. Shipped work at a named employer says you can deliver, in English, to US professional norms, with references who can be called. Employers everywhere price that difference — that is why the return on a US degree is so sensitive to whether any US work follows it.",
  },
  {
    title: "It is the input other immigration systems score",
    body: "Canada's Express Entry, and points systems modelled on it, award points for skilled foreign work experience. Time spent working in the US is not a detour from settling elsewhere — in several systems it is the thing being counted.",
  },
  {
    title: "It changes what returning to India is worth",
    body: "Returning after US work experience is a different transaction from returning straight after graduation. Global capability centres, multinational subsidiaries and Indian firms with US clients pay a premium for people who have worked to US standards and can operate across both time zones.",
  },
  {
    title: "The compounding is in the second job, not the first",
    body: "The first US role is usually priced close to market. The premium shows up at the second and third move, when your experience is verifiable and your network is domestic. This is why cutting a US stint short at 12 months captures far less than half the value of a 3-year stint.",
  },
] as const;

/* ─────────────────── Shareable facts (the WhatsApp payload) ────────────── */

/**
 * Short, checkable, counter-intuitive facts. Each is rendered in a table and
 * is written to survive being pasted into a WhatsApp thread with no context.
 */
export interface ShareFact {
  /** Stable key — pages select facts by id, never by array index. */
  id: string;
  claim: string;
  reality: string;
  why: string;
}

export const mythVsRealityFacts: ShareFact[] = [
  {
    id: "h1b-fee",
    claim: "The $100,000 H-1B fee makes hiring you impossible.",
    reality: "It is not being collected.",
    why: "A federal court vacated it on June 8, 2026 and the First Circuit refused to reinstate it on July 24, 2026. It also never applied to students already in the US changing status from F-1 to H-1B.",
  },
  {
    id: "opt-fee",
    claim: "There is a $100,000 fee on OPT.",
    reality: "There is no such fee.",
    why: "It was press reporting about an internal discussion, published July 30, 2026. No rule has been proposed, no amount set in regulation, and nobody has been charged.",
  },
  {
    id: "stem-resets",
    claim: "STEM OPT resets your unemployment clock to 150 days.",
    reality: "150 is a lifetime cap, not a reset.",
    why: "The 150 days is aggregate across post-completion OPT plus the STEM extension. Use 40 days on initial OPT and you have 110 left, not 150.",
  },
  {
    id: "remittance-tax",
    claim: "The new 1% US remittance tax hits money you send home.",
    reality: "Almost certainly not.",
    why: "IRC §4475 only taxes transfers funded with cash, money orders or cashier's checks. Bank-account, debit, credit and digital-wallet transfers are exempt.",
  },
  {
    id: "std-deduction",
    claim: "Nonresident students cannot claim the standard deduction.",
    reality: "Indian students can.",
    why: "Article 21(2) of the US-India tax treaty lets students from India claim the standard deduction on Form 1040-NR. Almost no other nationality has this.",
  },
  {
    id: "five-year-rule",
    claim: "You are a nonresident for tax as long as you hold an F-1 visa.",
    reality: "Five calendar years, not the length of the visa.",
    why: "F-1 students are exempt individuals for five calendar years. After that, days count toward the substantial presence test and you may become a resident for tax purposes while still on F-1.",
  },
  {
    id: "fica-refund",
    claim: "Social Security tax was withheld, so it is gone.",
    reality: "It is refundable.",
    why: "F-1 students who are nonresidents are exempt from FICA. If 7.65% was withheld in error, you ask the employer first, then file Form 843 with Form 8316.",
  },
  {
    id: "cpt-12-month",
    claim: "A year of full-time CPT is harmless.",
    reality: "12 months of full-time CPT eliminates OPT at that degree level.",
    why: "Reach 12 months of full-time CPT and post-completion OPT is gone for that level of study — a later, higher degree can carry its own OPT. Part-time CPT does not count toward the threshold at all.",
  },
  {
    id: "termination-vs-revocation",
    claim: "A terminated SEVIS record and a revoked visa are the same thing.",
    reality: "They are separate actions by separate agencies.",
    why: "SEVIS termination is a DHS status action; visa revocation is a State Department action on the stamp. You can have one without the other, and the responses differ.",
  },
  {
    id: "unlawful-presence",
    claim: "A SEVIS termination starts unlawful presence immediately.",
    reality: "Generally not — those are two different things.",
    why: "The 2018 memo that would have done this was vacated nationwide in Guilford College v. Nielsen. For a student admitted for duration of status, unlawful presence generally starts only after USCIS or an immigration judge formally finds a violation. Losing status is still urgent.",
  },
  {
    id: "grace-period-change",
    claim: "The F-1 grace period is 60 days and always has been.",
    reality: "It becomes 30 days under a rule effective September 15, 2026.",
    why: "DHS's fixed-admission final rule replaces duration of status with a dated I-94 plus 30 days. Students already admitted for D/S generally keep 60 days until they travel and re-enter. The rule is being challenged in court.",
  },
  {
    id: "counter-abroad",
    claim: "Leaving the US pauses your OPT unemployment counter.",
    reality: "It usually keeps running.",
    why: "Time spent outside the US while unemployed during an approved OPT period generally still counts against the limit, unless you are on employer-authorised leave.",
  },
];

/* ───────────────────────────── Sanity guard ────────────────────────────── */

/**
 * Any policy item whose status is not "in-force" must have a null amount so
 * it can never be silently summed into a cost total. Enforced by test.
 */
/** Select facts by id so page-level edits cannot silently reshuffle them. */
export function factsById(...ids: string[]): ShareFact[] {
  return ids.map((id) => {
    const found = mythVsRealityFacts.find((f) => f.id === id);
    if (!found) throw new Error(`Unknown share fact id: ${id}`);
    return found;
  });
}

export const policyItems: PolicyItem[] = [
  h1bProclamationFee,
  optProposedFee,
  dsFixedAdmissionRule,
];
