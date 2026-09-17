/**
 * Request for Evidence (RFE) rules and sources.
 *
 * Every figure here comes from the USCIS Policy Manual, Volume 1, Part E,
 * Chapter 6. These are POLICY numbers, not workload numbers — they do not
 * change monthly the way processing times do, but they do change when USCIS
 * issues a policy alert, so re-read the chapter when one lands.
 *
 * Educational only. Not legal advice.
 */

export const RFE_SOURCES = {
  policyManualEvidence: "https://www.uscis.gov/policy-manual/volume-1-part-e-chapter-6",
  policyManualDecision: "https://www.uscis.gov/policy-manual/volume-1-part-e-chapter-9",
  evidentiaryStandardsAlert:
    "https://www.uscis.gov/sites/default/files/document/policy-manual-updates/20260805-EvidentiaryStandards.pdf",
  evidentiaryStandardsNews:
    "https://www.uscis.gov/newsroom/alerts/uscis-to-reduce-frivolous-immigration-benefits-requests-by-reinforcing-evidence-standards",
  caseStatus: "https://egov.uscis.gov/",
  myUscis: "https://my.uscis.gov/",
  eRequest: "https://egov.uscis.gov/e-request/displayForm.do?entryPoint=init",
  processingTimes: "https://egov.uscis.gov/processing-times/",
} as const;

export const RFE_RULES = {
  /** USCIS Policy Manual: "The maximum response time for an RFE is 12 weeks (84 days)." */
  maxDays: 84,
  maxLabel: "12 weeks (84 days)",
  /** Forms USCIS caps at 30 days rather than 84. */
  shortFormDays: 30,
  shortForms: ["I-539", "I-601A"],
  /**
   * When USCIS serves an RFE by MAIL, 3 days are added to the period — so the
   * outer limit becomes 87 days from the notice date. Electronic or in-person
   * service gets no such addition.
   */
  mailGraceDays: 3,
  /**
   * Regulations PROHIBIT officers from granting more time. There is no
   * extension to ask for, which is the single most consequential thing on the
   * page and the thing people most often assume is negotiable.
   */
  extensionsAllowed: false,
  /** What USCIS may do when a response is late or partial. */
  lateOutcomes: [
    "Deny the request as abandoned",
    "Deny on the record as it stands",
    "Deny on both grounds",
  ],
  partialResponseNote:
    "A partial response is treated as a request for a decision on the record as it stands — USCIS does not wait for the rest.",
  /** The 2026 policy change restoring discretion to deny without an RFE. */
  discretionPolicy: {
    effective: "2026-08-05",
    summary:
      "USCIS restored officers' full discretion to deny a benefit request without first issuing an RFE or a Notice of Intent to Deny where the filing fails to establish eligibility or omits required initial evidence. It applies to requests pending or filed on or after 5 August 2026.",
    consequence:
      "An RFE is no longer something you can count on receiving as a second chance. The filing itself has to establish eligibility.",
  },
  lastVerified: "2026-09-16",
} as const;

/** Post-response case status messages, in the order they usually appear. */
export const RFE_STATUS_SEQUENCE: { status: string; meaning: string }[] = [
  {
    status: "Request for Additional Evidence Was Sent",
    meaning:
      "The RFE has been mailed and/or posted to your online account. The clock starts from the date on the notice, not from the day you read it.",
  },
  {
    status: "Response To USCIS' Request For Evidence Was Received",
    meaning:
      "USCIS has your response in hand. This is a receipt confirmation and nothing more — it is not an assessment of whether the evidence is sufficient, and it does not mean an officer has looked at it.",
  },
  {
    status: "Case Is Being Actively Reviewed By USCIS",
    meaning:
      "An officer has picked the file back up. Cases often sit between the previous status and this one for weeks.",
  },
  {
    status: "Case Was Approved / Case Was Denied / a second RFE or a NOID",
    meaning:
      "The three ways this ends. A second RFE is uncommon but happens when the response opened a new question; a Notice of Intent to Deny means the officer is minded to refuse and is giving you a last chance to answer.",
  },
];
