/**
 * USCIS processing-time and premium-processing facts — one dated source object.
 *
 * WHY THIS FILE EXISTS: /tools/processing-times previously repeated editorial
 * ranges ("3–8 months", "8–18 months", "3–6 months") across its hero, tables,
 * body copy, FAQ and delay checker. Those numbers disagreed with each other,
 * were not sourced to any dated USCIS publication, and were captioned as
 * "current USCIS processing times" — which they were not. The page also carried
 * a disclaimer saying the site does not publish processing times while doing
 * exactly that.
 *
 * THE RULE THIS FILE ENFORCES: we do not publish a numeric processing-time
 * estimate for any form unless it is tied to a specific, dated source for that
 * exact form, subtype and office. Where we have no such source — which is
 * everywhere, because USCIS's figures are per-form/per-office and change
 * monthly — we publish no number and send the reader to the official tool.
 *
 * Premium processing is different: the periods below are set by USCIS policy,
 * not by workload, so they can be stated. Read verbatim 2026-09-10 from
 * https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing
 */

export const USCIS_DATA_VERIFIED = "2026-09-10";

export const uscisLinks = {
  processingTimes: "https://egov.uscis.gov/processing-times/",
  caseStatus: "https://egov.uscis.gov/",
  premiumProcessing:
    "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  premiumFeeAlert:
    "https://www.uscis.gov/newsroom/alerts/uscis-to-increase-premium-processing-fees",
  eadAutoExtensionRule:
    "https://www.federalregister.gov/documents/2025/10/30/2025-19702/removal-of-the-automatic-extension-of-employment-authorization-documents",
  caseInquiry: "https://egov.uscis.gov/e-request/displayForm.do?entryPoint=init",
} as const;

/* ─────────────────────── how USCIS's own figure works ──────────────────── */

/**
 * The methodology matters because readers treat the published figure as a
 * deadline. It is neither a median nor a promise.
 */
export const uscisMethodology = {
  displayedTime:
    "USCIS's displayed processing time for a form and office generally represents the time within which 80% of adjudicated cases were completed over the relevant recent period. It is a descriptive statistic about cases already decided — not a target, a queue position, or a guarantee about your case.",
  inquiryDate:
    "Separately, the USCIS processing-times tool returns a case inquiry date. That date — not the displayed processing time — is what determines whether you may submit an outside-normal-processing-time inquiry. If your receipt date is earlier than the inquiry date shown, you may submit an inquiry; otherwise USCIS will decline it as premature.",
  whyNoNumbersHere:
    "Figures are published per form, per subtype and per office, and they move every month. A number copied onto a third-party page is stale almost immediately, and a single range covering several offices is wrong for most readers. That is why this page does not print one.",
  verified: USCIS_DATA_VERIFIED,
} as const;

/* ─────────────────────── premium processing ────────────────────────────── */

export type PremiumPeriod = 15 | 30 | 45;

export interface PremiumRule {
  id: string;
  form: string;
  /** The classification or subtype, where the period depends on it. */
  classification: string;
  businessDays: PremiumPeriod;
  note?: string;
}

/**
 * Verbatim from USCIS: "15 business days for most classifications; 30 business
 * days for Form I-765; 30 business days for Form I-539 applicants requesting a
 * change of status to F-1, F-2, M-1, M-2, J-1 or J-2 nonimmigrant status, once
 * all prerequisites have been met; 45 business days for Form I-140 E13
 * multinational executive and manager and Form I-140 E21 national interest
 * waiver classifications".
 */
export const premiumRules: PremiumRule[] = [
  {
    id: "i129",
    form: "Form I-129",
    classification: "Most nonimmigrant classifications, including H-1B, L-1, O-1, TN and E",
    businessDays: 15,
  },
  {
    id: "i140-standard",
    form: "Form I-140",
    classification:
      "E11 extraordinary ability, E12 outstanding professor/researcher, E21 advanced degree WITHOUT a national interest waiver, E31 skilled worker, E32 professional, EW3 other worker",
    businessDays: 15,
  },
  {
    id: "i140-e13",
    form: "Form I-140",
    classification: "E13 multinational executive and manager",
    businessDays: 45,
    note: "Eligible for premium processing since 30 January 2023 for all pending and initial petitions.",
  },
  {
    id: "i140-e21-niw",
    form: "Form I-140",
    classification: "E21 national interest waiver (NIW)",
    businessDays: 45,
    note: "Eligible since 30 January 2023. Note that E21 WITHOUT a NIW is a 15-business-day classification — the waiver is what changes the period.",
  },
  {
    id: "i765",
    form: "Form I-765",
    classification: "Employment authorization, including F-1 OPT and STEM OPT",
    businessDays: 30,
    note: "F-1 students seeking OPT and STEM OPT extensions have been eligible for all pending and initial I-765 filings since 3 April 2023.",
  },
  {
    id: "i539",
    form: "Form I-539",
    classification:
      "Change of status to F-1, F-2, M-1, M-2, J-1 or J-2 nonimmigrant status",
    businessDays: 30,
    note: "The period runs once all prerequisites have been met.",
  },
];

/** What USCIS guarantees, and what it does not. */
export const PREMIUM_GUARANTEE =
  "USCIS guarantees adjudicative action within the applicable period or it refunds the premium fee. Adjudicative action means an approval notice, a denial notice, a notice of intent to deny, or a request for evidence — or the opening of a fraud or misrepresentation investigation. It is not a guarantee of approval.";

/**
 * The clock rule, quoted from USCIS: the period "will stop and reset", and "a
 * new premium processing time period will begin when we receive a response".
 */
export const PREMIUM_RFE_CLOCK = {
  rule: "If the case requires additional evidence or a response to a notice of intent to deny, the 15-, 30- or 45-business-day premium processing period stops and resets. A new premium processing period begins when USCIS receives the response.",
  deadlineWarning:
    "The deadline to respond is the exact date printed on the RFE or NOID itself. Do not rely on a generic figure — response windows vary by notice, and a date computed from a blog post is not a date USCIS recognises.",
  clockStart:
    "The period begins when USCIS receives a properly completed Form I-907 at the correct filing address — not when you post it, and not on the receipt month.",
} as const;

/** Premium processing fees. Verified 1 March 2026 increase. */
export const premiumFees = {
  verified: USCIS_DATA_VERIFIED,
  effective: "2026-03-01",
  href: uscisLinks.premiumFeeAlert,
  note: "Premium processing fees are adjusted periodically. Verify the amount for your exact form and classification on the USCIS Form I-907 page before filing.",
} as const;

/* ─────────────────────── EAD automatic extension ───────────────────────── */

/**
 * The Federal Register rule removing the automatic extension, published
 * 30 October 2025. The cut-off is the filing date, which is why a reader who
 * filed earlier may still hold the prior treatment.
 */
export const eadAutoExtension = {
  ruleDate: "2025-10-30",
  href: uscisLinks.eadAutoExtensionRule,
  summary:
    "A qualifying renewal Form I-765 filed BEFORE 30 October 2025 may retain the automatic extension treatment that applied when it was filed. A renewal filed on or after that date generally does not receive an automatic extension, unless another law, regulation or Federal Register notice provides one.",
  caution:
    "Do not assume an automatic extension based on anything written before October 2025. Check the filing date of your own renewal against the rule, and check whether any separate notice covers your category.",
  verified: USCIS_DATA_VERIFIED,
} as const;

/* ─────────────────────── related explanations ──────────────────────────── */

/**
 * Corrections to explanations this page previously got wrong. Kept here so the
 * page and any future page share one wording.
 */
export const uscisExplainers = {
  priorityDateSource:
    "For PERM-based EB-2 and EB-3 cases the priority date is generally the date the labor certification was filed with the Department of Labor — not the I-140 receipt date. Where no labor certification is required, such as a national interest waiver, the I-140 receipt date governs.",
  ac21OneYear:
    "A one-year H-1B extension beyond the sixth year under AC21 section 106(a) depends on a qualifying labor certification or I-140 having been FILED at least 365 days before the requested extension period — it is about how long the filing has been pending or on file, not about approval.",
  ac21ThreeYear:
    "A three-year extension under AC21 section 104(c) is different: it requires an APPROVED I-140 and that a visa number is unavailable to the beneficiary because of per-country or category limits. An I-140 that has merely been approved for 365 days does not, by itself, produce a three-year extension.",
  i140WithdrawalVsPortability:
    "Three separate things are routinely conflated. I-140 retention after withdrawal concerns whether an approved petition remains valid for priority-date and AC21 purposes. I-485 portability under AC21 section 106(c) concerns changing jobs with a long-pending adjustment application. H-1B extensions beyond six years are a third question governed by AC21 sections 106(a) and 104(c). Satisfying one does not satisfy another.",
  i485Travel:
    "Departing with a pending I-485 generally abandons it under 8 CFR 245.2(a)(4)(ii)(A), but 8 CFR 245.2(a)(4)(ii)(C) excepts an applicant in lawful H-1 or L-1 status who remains eligible for H or L status, is returning to resume employment with the same employer, and holds a valid H or L visa where one is required. A parallel sentence covers H-4 and L-2.",
  i485Interview:
    "USCIS may require or waive an interview in an employment-based adjustment case, decided case by case. It is not correct to say employment-based I-485 interviews are usually required, or usually waived.",
  nbcTransfer:
    "A transfer to the National Benefits Center does not reliably indicate that an interview is being scheduled. Cases move between offices for workload and routing reasons. Read the transfer notice itself rather than inferring a meaning from the destination office.",
  transferReceiptDate:
    "A transfer does not reset your receipt date. The original receipt date continues to govern your place in the queue and your case inquiry date — a case does not start over from the transfer date.",
} as const;
