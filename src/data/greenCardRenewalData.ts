/**
 * Shared, EDITABLE config + content for the Green Card Renewal cluster:
 *   /green-card-renewal              (main hub + checklist tool)
 *   /green-card-renewal-processing-time
 *   /renew-green-card-online
 *   /green-card-renewal-fee
 *   /replace-green-card
 *   /i90-vs-i751
 *   /expired-green-card
 *
 * IMPORTANT: Do NOT hardcode current USCIS fees or processing times as if they
 * were permanent. They change. Where a real, verified number is not stored in
 * `greenCardRenewalConfig`, show "Check USCIS Fee Schedule" / "Check USCIS
 * Processing Times" instead of an invented figure. Update this file monthly
 * against the official sources below and bump GC_RENEWAL_UPDATED* in
 * src/lib/greenCardRenewalCluster.ts.
 *
 * This is general planning information only — not legal advice.
 */

/* ─────────────────────────── Official sources ──────────────────────────── */

export const greenCardRenewalSources = {
  formI90: "https://www.uscis.gov/i-90",
  replaceGreenCard:
    "https://www.uscis.gov/green-card/after-we-grant-your-green-card/replace-your-green-card",
  uscisProcessingTimes: "https://egov.uscis.gov/processing-times/",
  uscisFileOnline: "https://www.uscis.gov/file-online",
  uscisFeeSchedule: "https://www.uscis.gov/g-1055",
  uscisCaseStatus: "https://egov.uscis.gov/",
  validityExtension36Months:
    "https://www.uscis.gov/newsroom/alerts/uscis-extends-green-card-validity-extension-to-36-months-for-green-card-renewals",
  formI751:
    "https://www.uscis.gov/i-751",
  formI829: "https://www.uscis.gov/i-829",
} as const;

/** Convenience array for an "Official USCIS sources" box. */
export const greenCardRenewalSourceLinks: { label: string; href: string }[] = [
  { label: "Form I-90 (official)", href: greenCardRenewalSources.formI90 },
  { label: "Replace Your Green Card", href: greenCardRenewalSources.replaceGreenCard },
  { label: "USCIS Processing Times", href: greenCardRenewalSources.uscisProcessingTimes },
  { label: "USCIS File Online", href: greenCardRenewalSources.uscisFileOnline },
  { label: "USCIS Fee Schedule (G-1055)", href: greenCardRenewalSources.uscisFeeSchedule },
  { label: "USCIS Case Status", href: greenCardRenewalSources.uscisCaseStatus },
  { label: "36-month validity extension alert", href: greenCardRenewalSources.validityExtension36Months },
];

/* ─────────────────────────── Editable config ───────────────────────────── */

/**
 * Fees and processing times are intentionally NOT hardcoded to a dollar amount.
 * When you verify a current fee on the USCIS Fee Schedule, replace the
 * "Check USCIS Fee Schedule" string with the confirmed value AND update
 * `feeVerified` to true so pages can render the number with a source note.
 */
export const greenCardRenewalConfig = {
  lastUpdated: "2026-07-04",
  formName: "Form I-90, Application to Replace Permanent Resident Card",
  /** Whether onlineFee/paperFee below hold a verified figure (false → show "Check USCIS Fee Schedule"). */
  feeVerified: true,
  onlineFee: "$415",
  paperFee: "$465",
  feeSavingsOnline: "Online is $50 cheaper than paper",
  biometricsFee: "No separate biometrics fee",
  feeWaiverAvailable:
    "USCIS offers a fee waiver (Form I-912) for some applicants who cannot pay. Eligibility is limited — never assume you qualify.",
  processingTimeRange: "8–14 months",
  receiptExtension:
    "USCIS has announced a 36-month validity extension for eligible lawful permanent residents who properly file Form I-90 to renew an expiring or expired Green Card. The receipt notice, presented with the expired card, may serve as temporary evidence of status.",
  sourceNote:
    "Fees, processing times, and USCIS policies can change. Always verify with official USCIS sources.",
  sourceUrl: greenCardRenewalSources.uscisFeeSchedule,
} as const;

/** Standard disclaimer required on every cluster page. */
export const GC_RENEWAL_DISCLAIMER =
  "This tool is for educational planning only and is not legal advice. USCIS rules, fees, processing times, and eligibility can change. Always verify with official USCIS sources or consult a qualified immigration attorney.";

export const GC_RENEWAL_DATA_NOTE =
  "General planning information only. Confirm current USCIS fees, forms, and processing times on the official USCIS website before you file.";

/* ─────────────────────────── Timeline (main) ───────────────────────────── */

export interface RenewalTimelineRow {
  step: string;
  estimatedTime: string;
  whatHappens: string;
  whatToCheck: string;
  highlight?: boolean;
}

export const greenCardRenewalTimelineRows: RenewalTimelineRow[] = [
  {
    step: "Check whether you need Form I-90",
    estimatedTime: "Before filing",
    whatHappens:
      "Confirm whether you have a regular 10-year green card, a lost/stolen/damaged card, an incorrect card, or another replacement reason.",
    whatToCheck:
      "Do not use Form I-90 for most conditional green card removal cases; review I-751 if you have a 2-year conditional card.",
    highlight: true,
  },
  {
    step: "Prepare your USCIS account or paper filing",
    estimatedTime: "Same day to a few days",
    whatHappens:
      "Most users can prepare Form I-90 online through a USCIS account or file by mail if needed.",
    whatToCheck: "USCIS online filing page and Form I-90 instructions.",
  },
  {
    step: "Submit Form I-90",
    estimatedTime: "Filing day",
    whatHappens:
      "You submit the renewal or replacement request and pay the filing fee unless eligible for a fee waiver.",
    whatToCheck: "USCIS Fee Schedule and confirmation receipt.",
  },
  {
    step: "Receipt notice",
    estimatedTime: "Usually after filing; timing varies",
    whatHappens:
      "USCIS issues a receipt notice. For eligible renewal applicants, the notice may extend green card validity.",
    whatToCheck: "Receipt notice language and USCIS account.",
    highlight: true,
  },
  {
    step: "Biometrics, if required",
    estimatedTime: "Varies",
    whatHappens:
      "USCIS may schedule fingerprints/photo/signature or reuse previous biometrics.",
    whatToCheck: "Biometrics appointment notice or USCIS account update.",
  },
  {
    step: "USCIS review",
    estimatedTime: "Varies by USCIS workload",
    whatHappens:
      "USCIS reviews the Form I-90 application and may request additional information if needed.",
    whatToCheck: "USCIS Case Status and Processing Times.",
  },
  {
    step: "Card production and mailing",
    estimatedTime: "After approval",
    whatHappens: "USCIS produces and mails the new permanent resident card.",
    whatToCheck: "USCIS case status and mailing updates.",
  },
  {
    step: "If your card is lost, stolen, or damaged",
    estimatedTime: "File replacement as soon as practical",
    whatHappens:
      "You may need a replacement card and possibly temporary proof for travel, work, or ID needs.",
    whatToCheck:
      "USCIS replacement guidance and whether you need an ADIT/I-551 stamp.",
    highlight: true,
  },
];

export const greenCardRenewalBadges = [
  "Form I-90",
  "Online filing available for many users",
  "Check USCIS fee schedule",
  "Receipt notice may extend validity",
  "Conditional cards are different",
];

export const greenCardRenewalPlanningSummary =
  "For a standard 10-year green card renewal, the usual path is: confirm Form I-90 is the right form, file online or by mail, receive a USCIS receipt notice, complete biometrics if required, wait for USCIS review, and receive the new card by mail. Processing times and fees change, so always verify current USCIS information.";

/* ─────────────────────── Renewal / replacement reasons ─────────────────── */

export interface RenewalReason {
  reason: string;
  likelyForm: string;
  quickAnswer: string;
  warning: string;
  highlight?: boolean;
}

export const greenCardRenewalReasons: RenewalReason[] = [
  {
    reason: "10-year green card expiring or expired",
    likelyForm: "Form I-90",
    quickAnswer: "Most lawful permanent residents renew a 10-year card with Form I-90.",
    warning: "Check USCIS guidance and avoid filing too early.",
    highlight: true,
  },
  {
    reason: "Green card lost, stolen, or damaged",
    likelyForm: "Form I-90",
    quickAnswer: "Use Form I-90 to request a replacement permanent resident card.",
    warning: "Consider whether you need temporary proof for travel, work, or ID.",
    highlight: true,
  },
  {
    reason: "Name legally changed",
    likelyForm: "Form I-90",
    quickAnswer: "Use Form I-90 and include required legal name-change evidence.",
    warning: "Documents must match USCIS instructions.",
  },
  {
    reason: "Card has incorrect information",
    likelyForm: "Form I-90",
    quickAnswer: "Use Form I-90 to correct some card errors.",
    warning:
      "Fee responsibility may depend on whether the error was USCIS or applicant-related.",
  },
  {
    reason: "2-year conditional green card expiring",
    likelyForm: "Usually Form I-751 or I-829, not Form I-90",
    quickAnswer:
      "Conditional permanent residents usually do not renew with Form I-90.",
    warning:
      "This is a high-risk mistake. Review I-751/I-829 rules or talk to an attorney.",
    highlight: true,
  },
];

/* ─────────────────────── Processing-time stages ────────────────────────── */

export const greenCardRenewalProcessingStages: RenewalTimelineRow[] = [
  {
    step: "Form I-90 submitted",
    estimatedTime: "Filing day",
    whatHappens: "You file online or by mail and pay the fee (or request a fee waiver).",
    whatToCheck: "Confirmation screen or mailing receipt.",
  },
  {
    step: "Receipt notice",
    estimatedTime: "Usually days to a few weeks after filing",
    whatHappens:
      "USCIS issues Form I-797C. For eligible renewals, it may extend green card validity.",
    whatToCheck: "Receipt number, extension language, and USCIS account.",
    highlight: true,
  },
  {
    step: "Biometrics, if required",
    estimatedTime: "Varies",
    whatHappens: "USCIS may collect fingerprints/photo/signature, or reuse prior biometrics.",
    whatToCheck: "Biometrics appointment notice (ASC) or reuse notice.",
  },
  {
    step: "USCIS review",
    estimatedTime: "Varies by USCIS workload",
    whatHappens: "An officer reviews the application and evidence.",
    whatToCheck: "Case status and official processing times for Form I-90.",
  },
  {
    step: "Request for evidence, if issued",
    estimatedTime: "Adds time; depends on the response deadline",
    whatHappens: "USCIS asks for more documentation before deciding.",
    whatToCheck: "The RFE notice, requested documents, and deadline.",
  },
  {
    step: "Card production",
    estimatedTime: "After approval",
    whatHappens: "USCIS approves and orders your new permanent resident card.",
    whatToCheck: "'Card is being produced' / 'Case approved' status.",
  },
  {
    step: "Card mailed",
    estimatedTime: "After production",
    whatHappens: "USPS delivers your new green card.",
    whatToCheck: "Tracking and 'Card was mailed' / 'Card was delivered' status.",
    highlight: true,
  },
  {
    step: "Outside normal processing time",
    estimatedTime: "Only when USCIS says you are eligible",
    whatHappens: "You may submit a case inquiry (service request).",
    whatToCheck: "The 'case inquiry date' on the USCIS processing-times page.",
  },
];

export const greenCardRenewalProcessingBadges = [
  "Timing varies",
  "Biometrics may be reused",
  "Receipt may extend validity",
  "Check USCIS",
];

export const greenCardRenewalProcessingSummary =
  "Green card renewal processing time is not based on the filing date alone. USCIS workload, whether biometrics is required, background checks, and any request for evidence all affect the wait. Always check the official USCIS processing-times tool for Form I-90 and your own case status before assuming a timeline.";

/* ─────────────────────── Online filing steps ──────────────────────────── */

export interface OnlineStep {
  step: string;
  whatHappens: string;
  whatToCheck: string;
}

export const renewOnlineSteps: OnlineStep[] = [
  { step: "Confirm Form I-90 is the right form", whatHappens: "Rule out a conditional (2-year) card, which usually needs I-751 or I-829.", whatToCheck: "Your card's category and expiration; the I-90 vs I-751 guide." },
  { step: "Create or sign in to a USCIS online account", whatHappens: "A free myUSCIS account lets you file, upload evidence, and track the case.", whatToCheck: "USCIS File Online page." },
  { step: "Complete Form I-90", whatHappens: "Answer the questions about your card, status, and reason for filing.", whatToCheck: "Form I-90 instructions for your specific reason." },
  { step: "Upload evidence, if required", whatHappens: "Some reasons (name change, USCIS error) require supporting documents.", whatToCheck: "The evidence list in the I-90 instructions." },
  { step: "Review your answers", whatHappens: "Check every field for accuracy before submitting.", whatToCheck: "Spelling of name, A-number, and dates against your card." },
  { step: "Pay the fee or review the fee-waiver option", whatHappens: "Pay online, or request a fee waiver (Form I-912) if eligible.", whatToCheck: "USCIS Fee Schedule and fee-waiver eligibility." },
  { step: "Submit", whatHappens: "You electronically file Form I-90 with USCIS.", whatToCheck: "The on-screen confirmation." },
  { step: "Save your receipt notice", whatHappens: "USCIS issues a receipt (I-797C) that may extend card validity.", whatToCheck: "Receipt number and any validity-extension language." },
  { step: "Track your case", whatHappens: "Use your USCIS account and Case Status to follow progress.", whatToCheck: "USCIS Case Status online." },
  { step: "Attend biometrics if scheduled", whatHappens: "If required, go to your ASC appointment for fingerprints/photo.", whatToCheck: "Your biometrics appointment notice." },
];

/* ─────────────────────── Fee snapshot ──────────────────────────────────── */

export interface FeeRow {
  situation: string;
  possibleCost: string;
  whatToCheck: string;
  notes: string;
}

/** Costs deliberately reference the fee schedule instead of hardcoding dollars. */
export const greenCardRenewalFeeRows: FeeRow[] = [
  {
    situation: "Online Form I-90 filing",
    possibleCost: greenCardRenewalConfig.onlineFee,
    whatToCheck: "USCIS Fee Schedule (G-1055) for Form I-90.",
    notes: "Online and paper fees can differ. Verify the current amount before paying.",
  },
  {
    situation: "Paper Form I-90 filing",
    possibleCost: greenCardRenewalConfig.paperFee,
    whatToCheck: "USCIS Fee Schedule (G-1055) for Form I-90.",
    notes: "Mail filing may carry a different fee than online. Verify before mailing.",
  },
  {
    situation: "Fee waiver request",
    possibleCost: "May reduce or waive the fee if you qualify",
    whatToCheck: "Form I-912 fee-waiver eligibility.",
    notes: "Eligibility is limited. Never assume you qualify.",
  },
  {
    situation: "USCIS error correction",
    possibleCost: "May be no fee",
    whatToCheck: "Form I-90 instructions on USCIS-caused errors.",
    notes: "If USCIS printed the card incorrectly, the fee may not apply.",
  },
  {
    situation: "Applicant error correction",
    possibleCost: "A fee may apply",
    whatToCheck: "Form I-90 instructions on applicant-caused errors.",
    notes: "If the error came from your original application, a fee may be due.",
  },
  {
    situation: "Lost / stolen / damaged replacement",
    possibleCost: greenCardRenewalConfig.paperFee,
    whatToCheck: "USCIS Fee Schedule for a replacement card.",
    notes: "Replacement is generally filed on Form I-90.",
  },
  {
    situation: "Conditional (2-year) green card issue",
    possibleCost: "Different form and fee — usually not Form I-90",
    whatToCheck: "Form I-751 or I-829 fees, not the I-90 fee.",
    notes: "High-risk area. Conditional residents usually file a different form.",
  },
];

/* ─────────────────────── Replacement situations ────────────────────────── */

export interface ReplacementSituation {
  situation: string;
  likelyForm: string;
  whatToDo: string;
  warning: string;
  highlight?: boolean;
}

export const greenCardReplacementSituations: ReplacementSituation[] = [
  { situation: "Lost card", likelyForm: "Form I-90", whatToDo: "File Form I-90 to replace the card. Keep proof of status for travel/work/ID.", warning: "Consider whether you need a temporary I-551/ADIT stamp.", highlight: true },
  { situation: "Stolen card", likelyForm: "Form I-90", whatToDo: "File Form I-90; consider a police report for your records.", warning: "Watch for identity-theft misuse of your information.", highlight: true },
  { situation: "Damaged card", likelyForm: "Form I-90", whatToDo: "File Form I-90 and submit the damaged card as instructed.", warning: "Follow USCIS instructions for returning the old card." },
  { situation: "Name changed", likelyForm: "Form I-90", whatToDo: "File Form I-90 with legal name-change evidence.", warning: "Evidence must match USCIS instructions." },
  { situation: "Incorrect information", likelyForm: "Form I-90", whatToDo: "File Form I-90 to correct card errors.", warning: "Fee may depend on whether USCIS or you caused the error." },
  { situation: "Never received card", likelyForm: "Form I-90 (non-delivery)", whatToDo: "Report non-delivery; USCIS instructions cover cards returned as undeliverable.", warning: "Time limits and specific steps may apply — check USCIS guidance." },
  { situation: "Card expired", likelyForm: "Form I-90", whatToDo: "File Form I-90 to renew a 10-year card.", warning: "An expired card can still cause work/travel/ID friction while pending." },
  { situation: "Conditional card expiring", likelyForm: "Usually Form I-751 or I-829", whatToDo: "Do not use Form I-90 to remove conditions.", warning: "High-risk mistake. Review I-751/I-829 or consult an attorney.", highlight: true },
];

/* ─────────────────────── I-90 vs I-751 comparison ──────────────────────── */

export interface FormComparisonRow {
  situation: string;
  usuallyUse: string;
  why: string;
  warning: string;
}

export const i90VsI751Rows: FormComparisonRow[] = [
  { situation: "10-year green card expiring", usuallyUse: "Form I-90", why: "I-90 renews or replaces a standard permanent resident card.", warning: "Avoid filing too early; check USCIS timing guidance." },
  { situation: "10-year green card lost / stolen / damaged", usuallyUse: "Form I-90", why: "I-90 replaces a card that is missing or unusable.", warning: "Consider temporary proof for travel or work." },
  { situation: "Name changed on a 10-year card", usuallyUse: "Form I-90", why: "I-90 updates the card with legal name-change evidence.", warning: "Include required documents." },
  { situation: "2-year conditional marriage-based card expiring", usuallyUse: "Form I-751", why: "I-751 removes conditions on a marriage-based green card.", warning: "Filing I-90 instead can cause serious delays. Watch the I-751 filing window." },
  { situation: "2-year investor conditional card expiring", usuallyUse: "Form I-829", why: "I-829 removes conditions for EB-5 investor residents.", warning: "This is a different process from both I-90 and I-751." },
  { situation: "Not sure what card you have", usuallyUse: "Check the card's validity period first", why: "A 10-year card usually means I-90; a 2-year card usually means I-751/I-829.", warning: "When unsure, confirm with USCIS or an immigration attorney before filing." },
];

/* ─────────────────────── Expired green card situations ─────────────────── */

export interface ExpiredCardConcern {
  concern: string;
  reality: string;
  whatToDo: string;
}

export const expiredGreenCardConcerns: ExpiredCardConcern[] = [
  { concern: "Do I lose my status when the card expires?", reality: "An expired card does not by itself end lawful permanent resident status.", whatToDo: "Renew the card with Form I-90 and keep proof of status." },
  { concern: "Employment verification (I-9)", reality: "An expired card can complicate proving work authorization.", whatToDo: "Check whether a receipt notice or other document satisfies I-9 rules; ask your employer's HR and USCIS guidance." },
  { concern: "International travel", reality: "Airlines and border officers may question an expired card.", whatToDo: "Check USCIS, airline, and consulate requirements; consider whether you need an ADIT/I-551 stamp." },
  { concern: "DMV / ID renewal", reality: "State agencies may ask for unexpired status evidence.", whatToDo: "Bring the receipt notice and any USCIS extension documentation." },
  { concern: "Receipt-notice extension", reality: "USCIS may extend green card validity for eligible I-90 renewals (up to 36 months).", whatToDo: "Keep the receipt notice with your expired card as instructed." },
  { concern: "Conditional (2-year) card expired", reality: "Form I-90 usually does not apply to conditional residents.", whatToDo: "Review I-751 or I-829 rules, or consult an attorney." },
];

/* ─────────────────────────────── FAQs ──────────────────────────────────── */

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Main hub FAQ (question list matches the brief; answers are educational). */
export const greenCardRenewalFaqs: FaqEntry[] = [
  { question: "How do I renew my green card?", answer: "Most lawful permanent residents renew a 10-year green card by filing Form I-90 (Application to Replace Permanent Resident Card) with USCIS, either online through a USCIS account or by mail. Confirm you have a 10-year card first — conditional 2-year residents usually file a different form." },
  { question: "How long does green card renewal take?", answer: "Processing time varies by USCIS workload, whether biometrics is required, background checks, and whether USCIS requests more information. There is no single guaranteed timeline — check the official USCIS processing-times tool for Form I-90 and your own case status." },
  { question: "How much is the green card renewal fee?", answer: "The Form I-90 fee depends on current USCIS fee rules and whether you file online or by mail. Fees change, so always confirm the current amount on the official USCIS Fee Schedule (G-1055) before filing. Some applicants may qualify for a fee waiver." },
  { question: "Can I renew my green card online?", answer: "Many lawful permanent residents can file Form I-90 online by creating a free USCIS account. Some situations may require filing by mail. Online filing usually makes it easier to upload evidence and track your case." },
  { question: "What form do I use to renew a green card?", answer: "Form I-90 is generally used to renew or replace a 10-year permanent resident card. Conditional permanent residents with a 2-year card usually file Form I-751 (marriage-based) or Form I-829 (investor) instead." },
  { question: "When should I renew my green card?", answer: "Many residents renew a 10-year card when it is expiring soon. Filing too early or too late can cause issues, so check USCIS guidance on renewal timing for your situation." },
  { question: "Can I work with an expired green card?", answer: "An expired green card does not automatically end your status, but it can complicate employment verification. A USCIS receipt notice or extension documentation may help — check current USCIS guidance and speak with an attorney if needed." },
  { question: "Can I travel while my green card renewal is pending?", answer: "Travel with an expired card or pending renewal can be complicated. Check USCIS, airline, and consulate requirements, and consider whether you need temporary I-551/ADIT proof. Confirm your specific situation before traveling." },
  { question: "What if my green card is lost or stolen?", answer: "You can generally file Form I-90 to replace a lost or stolen permanent resident card. If you need urgent proof for travel, work, or ID, check whether a temporary I-551/ADIT stamp is available." },
  { question: "What if my green card has incorrect information?", answer: "You can use Form I-90 to correct certain card errors. Whether a fee applies may depend on whether USCIS or the applicant caused the error — check the Form I-90 instructions." },
  { question: "Do I need biometrics for green card renewal?", answer: "USCIS may schedule a biometrics appointment for fingerprints, photo, and signature, or it may reuse previous biometrics. Watch for a biometrics appointment notice or a reuse notice in your USCIS account." },
  { question: "What is the difference between Form I-90 and Form I-751?", answer: "Form I-90 renews or replaces a 10-year green card. Form I-751 removes conditions on a 2-year marriage-based green card. Filing the wrong form can cause serious delays — confirm which card you have." },
  { question: "Can a conditional green card be renewed with Form I-90?", answer: "Usually not. Conditional permanent residents with a 2-year card generally remove conditions using Form I-751 or I-829, not Form I-90. This is a common and high-risk mistake." },
  { question: "Does filing Form I-90 extend my green card?", answer: "For eligible renewal applicants, the USCIS receipt notice may extend the validity of an expiring or expired green card (USCIS has announced up to a 36-month extension). Keep the receipt notice with your card as instructed." },
  { question: "Is this green card renewal tool legal advice?", answer: "No. This tool is for educational planning only and is not legal advice. USCIS rules, fees, processing times, and eligibility can change. Always verify with official USCIS sources or consult a qualified immigration attorney." },
];

export const processingTimeFaqs: FaqEntry[] = [
  { question: "How long does green card renewal take?", answer: "It varies by USCIS workload, filing reason, whether biometrics is required, background checks, and whether USCIS requests more information. There is no guaranteed timeline — check the official USCIS processing-times tool for Form I-90." },
  { question: "How do I check I-90 processing time?", answer: "Use the official USCIS processing-times page, select Form I-90, and choose the office handling your case. Compare the posted range to how long your case has been pending." },
  { question: "Why is my I-90 taking so long?", answer: "Delays can come from USCIS workload, biometrics scheduling, background checks, a request for evidence, or high filing volumes. Check your case status and the posted processing time for your office." },
  { question: "Does biometrics mean my green card is approved soon?", answer: "Not necessarily. Biometrics is a routine step so USCIS can run background checks. It is a sign the case is moving, but it does not guarantee that approval is imminent." },
  { question: "Can I expedite green card renewal?", answer: "USCIS grants expedites only in limited circumstances and does not guarantee them. Review the official USCIS expedite criteria before requesting one." },
  { question: "What if my case is outside normal processing time?", answer: "You may be able to submit a USCIS case inquiry (service request) once your case passes the 'case inquiry date' USCIS publishes for your form and office. Submitting earlier rarely helps." },
  { question: "Can I work while my I-90 is pending?", answer: "An expired card does not automatically end status, but proving work authorization can be harder. A receipt notice or extension documentation may help — check current USCIS guidance." },
  { question: "Can I travel while my I-90 is pending?", answer: "Travel with a pending renewal can be complicated. Check USCIS, airline, and consulate requirements and whether you need a temporary I-551/ADIT stamp before you leave." },
];

export const renewOnlineFaqs: FaqEntry[] = [
  { question: "Can I renew my green card online?", answer: "Many lawful permanent residents can file Form I-90 online through a free USCIS account. Some situations may still require filing by mail." },
  { question: "Do I need a USCIS online account?", answer: "To file Form I-90 online you create a free myUSCIS account, which also lets you upload evidence and track your case. You can file by mail without one." },
  { question: "Can I file I-90 by mail instead?", answer: "Yes. If you prefer paper filing, or your situation calls for it, you can mail Form I-90 to the address in the official instructions. Fees may differ from online filing." },
  { question: "What documents do I upload?", answer: "It depends on your reason for filing. A simple renewal may need little, while a name change or USCIS error correction requires supporting evidence. Check the Form I-90 instructions." },
  { question: "Can I pay the green card renewal fee online?", answer: "Yes, online filing lets you pay the USCIS fee electronically. Confirm the current fee on the USCIS Fee Schedule before paying." },
  { question: "Can I request a fee waiver online?", answer: "Some applicants who cannot pay may request a fee waiver (Form I-912). Eligibility is limited — review the official criteria and never assume you qualify." },
  { question: "What happens after online filing?", answer: "USCIS issues a receipt notice, may schedule biometrics, reviews your application, and — if approved — produces and mails your new card. Track everything in your USCIS account." },
];

export const feeFaqs: FaqEntry[] = [
  { question: "How much does it cost to renew a green card?", answer: "As last verified against the USCIS Fee Schedule (G-1055), renewing a green card costs $415 if you file Form I-90 online or $465 by paper. Fees change, so always confirm the current amount on the official fee schedule before paying." },
  { question: "What is the Form I-90 fee?", answer: "The Form I-90 filing fee is $415 for online filing and $465 for paper filing, as last verified. USCIS adjusts fees periodically — check the official USCIS Fee Schedule for the current amount rather than relying on an older figure." },
  { question: "Is online filing cheaper than paper filing?", answer: "Yes — as last verified, filing Form I-90 online costs $415 versus $465 by paper, a $50 saving. Online filing also gives you easier payment and case tracking. Compare both on the official USCIS Fee Schedule before you file." },
  { question: "Is biometrics included in the I-90 fee?", answer: "Yes — there is currently no separate biometrics fee for Form I-90; biometrics, if required, is covered by the filing fee. Check the USCIS Fee Schedule and Form I-90 instructions for the latest structure, since this has changed over time." },
  { question: "Can I get a fee waiver for green card renewal?", answer: "Some applicants who cannot pay may qualify for a fee waiver using Form I-912 — generally based on a means-tested benefit, household income at or below 150% of the Federal Poverty Guidelines, or financial hardship. Eligibility is limited and never guaranteed — review the official criteria." },
  { question: "Is the green card replacement fee the same as the renewal fee?", answer: "Yes — replacing a lost, stolen, or damaged card uses the same Form I-90 and the same $415 online / $465 paper fee, as last verified. What changes is the reason you select and the evidence you attach, not the fee." },
  { question: "Do I pay if USCIS made an error?", answer: "If USCIS caused the error on your card, the fee may not apply. If the error came from your original application, a fee may be due. Check the Form I-90 instructions." },
  { question: "Are USCIS fees refundable?", answer: "USCIS filing fees are generally not refundable, even if a request is denied. File carefully and confirm eligibility before paying." },
];

export const replaceFaqs: FaqEntry[] = [
  { question: "How do I replace a lost green card?", answer: "You can generally file Form I-90 to replace a lost permanent resident card. If you need urgent proof for travel or work, check whether a temporary I-551/ADIT stamp is available." },
  { question: "What should I do if my green card was stolen?", answer: "File Form I-90 to request a replacement. Consider filing a police report for your records and watch for misuse of your personal information." },
  { question: "Can I replace a damaged green card?", answer: "Yes. Form I-90 covers a damaged card. Follow USCIS instructions for submitting or returning the damaged card." },
  { question: "What if USCIS made an error on my card?", answer: "You can use Form I-90 to correct card errors. If USCIS caused the error, the fee may not apply — check the Form I-90 instructions." },
  { question: "What if I never received my card?", answer: "If your card was mailed but never arrived, USCIS has a non-delivery process. Time limits and specific steps may apply, so check the official guidance promptly." },
  { question: "Can I travel while waiting for a replacement?", answer: "Travel while a replacement is pending can be complicated. Check USCIS, airline, and consulate requirements and whether you need temporary I-551/ADIT proof." },
  { question: "Can I work without the physical card?", answer: "An expired or missing card does not automatically end status, but proving work authorization can be harder. A receipt notice or temporary stamp may help — check current guidance." },
  { question: "How long does replacement take?", answer: "Replacement timing varies by USCIS workload and whether biometrics is required. Check the official processing-times tool for Form I-90 and your case status." },
];

export const i90VsI751Faqs: FaqEntry[] = [
  { question: "What is the difference between I-90 and I-751?", answer: "Form I-90 renews or replaces a 10-year permanent resident card. Form I-751 removes conditions on a 2-year marriage-based green card. They serve different purposes." },
  { question: "Can I use I-90 for a 2-year green card?", answer: "Usually not. A 2-year conditional card generally requires Form I-751 (marriage-based) or Form I-829 (investor) to remove conditions, not Form I-90." },
  { question: "What happens if I file the wrong form?", answer: "Filing the wrong form can cause serious delays, rejections, or status problems. If you are unsure which form you need, confirm with USCIS or an immigration attorney first." },
  { question: "What form renews a 10-year green card?", answer: "Form I-90 is generally used to renew or replace a standard 10-year permanent resident card." },
  { question: "What form removes conditions from a green card?", answer: "Form I-751 removes conditions on a 2-year marriage-based card; Form I-829 removes conditions for EB-5 investor residents." },
  { question: "How do I know if I have a conditional green card?", answer: "Check the card's validity period. A card valid for 2 years is usually conditional; a card valid for 10 years is usually a standard permanent resident card." },
  { question: "Should I talk to an attorney?", answer: "If you are unsure which form applies, are close to a filing deadline, or have a complicated case, consulting a qualified immigration attorney can help you avoid costly mistakes." },
];

export const expiredCardFaqs: FaqEntry[] = [
  { question: "Does an expired green card mean I lost my status?", answer: "No. An expired card does not by itself end lawful permanent resident status, but it can cause problems for work, travel, and ID until you renew it with Form I-90." },
  { question: "Can I work with an expired green card?", answer: "An expired card can complicate I-9 employment verification. A USCIS receipt notice or extension documentation may help — check current USCIS guidance and speak with your employer's HR." },
  { question: "Can I travel with an expired green card?", answer: "Airlines and border officers may question an expired card. Check USCIS, airline, and consulate requirements and whether you need a temporary I-551/ADIT stamp before traveling." },
  { question: "Does the receipt notice extend my expired card?", answer: "For eligible I-90 renewals, USCIS may extend green card validity (up to 36 months). Keep the receipt notice with your expired card as instructed." },
  { question: "What should I do first if my green card expired?", answer: "Confirm you have a 10-year card, then file Form I-90 to renew it. If you have a 2-year conditional card, review I-751 or I-829 instead." },
  { question: "Can a conditional (2-year) card be renewed the same way?", answer: "No. Conditional residents usually remove conditions with Form I-751 or I-829, not Form I-90. Filing the wrong form can cause serious delays." },
];
