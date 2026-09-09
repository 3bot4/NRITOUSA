/**
 * Visa interview waiver ("dropbox") — single source of truth for
 * /visa-interview-waiver.
 *
 * ACCURACY IS THE POINT OF THIS PAGE. At the time of writing, three of the five
 * pages ranking for these terms teach superseded rules — 48-month windows,
 * under-14/over-79 automatic waivers, and H-1B/L dropbox eligibility that was
 * eliminated in 2025. Two pages on THIS site did the same until this cluster
 * was built (see the correction note in lib/h1bCluster.ts).
 *
 * RULE: never edit an eligibility statement here without re-reading the
 * governing DOS announcement. Every entry carries its announcement date and
 * effective date, because in this area they differ and the difference matters.
 *
 * VERIFIED 2026-09-09 against travel.state.gov. The Department of State's
 * September 18, 2025 Interview Waiver Update (effective October 1, 2025) is the
 * current regime; no later interview-waiver change was found through
 * September 2026.
 *
 * NOTE ON travel.state.gov ITSELF: individual embassy sites — in.usembassy.gov
 * among them — have at times served stale copy implying dropbox is available
 * for "all nonimmigrant visa categories". Where an embassy page and the
 * Department's announcement disagree, the announcement governs.
 */

export const IW_VERIFIED = "2026-09-09";

/** The announcement currently in force. */
export const IW_CURRENT_RULE = {
  announced: "18 September 2025",
  effective: "1 October 2025",
  href: "https://travel.state.gov/content/travel/en/News/visas-news/interview-waiver-update-sept-18-2025.html",
  supersedes: "the July 25, 2025 update",
} as const;

/* ─────────────────────── official sources ──────────────────────────────── */

export const iwLinks = {
  currentRule: IW_CURRENT_RULE.href,
  july2025:
    "https://travel.state.gov/content/travel/en/News/visas-news/interview-waiver-update-july-25-2025.html",
  feb2025:
    "https://travel.state.gov/content/travel/en/News/visas-news/interview-waiver-update-feb-18-2025.html",
  countryOfResidence:
    "https://travel.state.gov/content/travel/en/News/visas-news/adjudicating-niv-applicants-in-their-country-of-residence.html",
  h1bScreening:
    "https://travel.state.gov/content/travel/en/News/visas-news/announcement-of-expanded-screening-and-vetting-for-h-1b-and-dependent-h-4-visa-applicants.html",
  expandedScreening:
    "https://travel.state.gov/content/travel/en/News/visas-news/announcement-of-expanded-screening-and-vetting-for-visa-applicants.html",
  fees: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
  waitTimes:
    "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html",
  visasNews: "https://travel.state.gov/content/travel/en/News/visas-news.html",
  ustraveldocs: "https://www.ustraveldocs.com/in/",
} as const;

/* ─────────────────────── chronology ────────────────────────────────────── */

export interface IwChronologyEntry {
  announced: string;
  effective: string;
  headline: string;
  detail: string;
  href?: string;
  /** Whether this entry is the rule in force today. */
  current?: boolean;
}

/**
 * Why a chronology and not just the current rule: this policy changed four
 * times between December 2023 and December 2025, and most of the wrong advice
 * circulating is simply an old rule that was correct when it was written. A
 * dated table lets a reader place whatever they were told.
 */
export const iwChronology: IwChronologyEntry[] = [
  {
    announced: "21 December 2023",
    effective: "1 January 2024",
    headline: "The 48-month window",
    detail:
      "Interview waivers were available to applicants renewing a visa in the same classification that had expired within the previous 48 months. This is the rule most obsolete write-ups are still describing, and under it many H-1B and H-4 renewals qualified.",
  },
  {
    announced: "18 February 2025",
    effective: "18 February 2025",
    headline: "Window cut from 48 months to 12",
    detail:
      "The renewal window was reduced to 12 months and the same-classification requirement was retained. Overnight, most H-1B renewals stopped qualifying.",
    href: iwLinks.feb2025,
  },
  {
    announced: "25 July 2025",
    effective: "2 September 2025",
    headline: "Waivers eliminated for most categories",
    detail:
      "Nearly all nonimmigrant applicants were required to appear in person, including applicants under 14 and over 79 — whose automatic waivers were removed. Only a narrow diplomatic/official list and B-1/B-2 and Border Crossing Card renewals survived.",
    href: iwLinks.july2025,
  },
  {
    announced: "18 September 2025",
    effective: "1 October 2025",
    headline: "The current regime — H-2A restored",
    detail:
      "Superseded the July update and added H-2A renewals within 12 months to the eligible list. This is the rule in force today; no later interview-waiver change has been announced through September 2026.",
    href: iwLinks.currentRule,
    current: true,
  },
  {
    announced: "3 December 2025",
    effective: "15 December 2025",
    headline: "Expanded online presence review for H-1B and H-4",
    detail:
      "All H-1B and dependent H-4 applicants were instructed to set the privacy settings on their social media profiles to public, extending a review already applied to F, M and J applicants. Consulates in India cancelled and rescheduled interviews as the change took effect.",
    href: iwLinks.h1bScreening,
  },
  {
    announced: "March 2026",
    effective: "30 March 2026",
    headline: "Online presence review widened again",
    detail:
      "The Department extended online presence review to further classifications, including A-3 and C-3 domestic workers, on top of the H-1B, H-4, F, M and J applicants already covered.",
    href: iwLinks.expandedScreening,
  },
];

/* ─────────────────────── who is eligible ───────────────────────────────── */

export type IwVerdict = "eligible" | "not-eligible" | "conditional";

export interface IwCategoryRow {
  category: string;
  verdict: IwVerdict;
  note: string;
}

/**
 * The complete eligible list under the 18 September 2025 update. Anything not
 * on it requires an in-person interview, subject to the consular officer's
 * discretion to require one anyway.
 */
export const iwCategoryVerdicts: IwCategoryRow[] = [
  {
    category: "B-1 / B-2 / B1-B2",
    verdict: "conditional",
    note: "Eligible on renewal within 12 months of the prior visa's expiration, if the prior visa was issued for full validity and you were at least 18 when it was issued. This is now the main dropbox route for most families — typically parents renewing a visitor visa.",
  },
  {
    category: "Border Crossing Card / Foil",
    verdict: "conditional",
    note: "Same 12-month renewal conditions as B-1/B-2. Relevant to Mexican nationals.",
  },
  {
    category: "H-2A (agricultural worker)",
    verdict: "conditional",
    note: "Restored by the 18 September 2025 update: eligible on renewal within 12 months of expiration where the prior visa was issued for full validity. Every competitor page we checked states that B-1/B-2 is the only renewal category — that has been wrong since 1 October 2025.",
  },
  {
    category: "A-1, A-2",
    verdict: "eligible",
    note: "Diplomatic and official categories remain eligible.",
  },
  {
    category: "C-3",
    verdict: "conditional",
    note: "Eligible except for attendants, servants and personal employees of accredited officials.",
  },
  {
    category: "G-1 through G-4",
    verdict: "eligible",
    note: "International organisation categories remain eligible.",
  },
  {
    category: "NATO-1 through NATO-6",
    verdict: "eligible",
    note: "Remain eligible.",
  },
  {
    category: "TECRO E-1",
    verdict: "eligible",
    note: "Remains eligible.",
  },
  {
    category: "Diplomatic or official-type visas",
    verdict: "eligible",
    note: "Eligible regardless of classification, and exempt from the country-of-application condition.",
  },
  {
    category: "H-1B",
    verdict: "not-eligible",
    note: "NOT eligible. H-1B dropbox ended with the February 2025 window cut and the July 2025 elimination, and was not restored on 1 October 2025. Every H-1B applicant attends an in-person interview. Pages still describing 48-month H-1B dropbox eligibility are teaching a rule that has been dead since February 2025.",
  },
  {
    category: "H-4",
    verdict: "not-eligible",
    note: "NOT eligible. Dependants interview in person too — including young children, since the under-14 automatic waiver was removed in September 2025.",
  },
  {
    category: "L-1 / L-2",
    verdict: "not-eligible",
    note: "NOT eligible. In-person interview required.",
  },
  {
    category: "F-1 / F-2",
    verdict: "not-eligible",
    note: "NOT eligible, and additionally subject to online presence review.",
  },
  {
    category: "J-1 / J-2",
    verdict: "not-eligible",
    note: "NOT eligible, and additionally subject to online presence review.",
  },
  {
    category: "O-1, P, Q, R",
    verdict: "not-eligible",
    note: "NOT eligible. In-person interview required.",
  },
];

/* ─────────────────────── the conditions ────────────────────────────────── */

export interface IwCondition {
  id: string;
  label: string;
  detail: string;
  /** The nuance that trips people up. */
  nuance: string;
}

export const iwConditions: IwCondition[] = [
  {
    id: "country",
    label: "Apply in your country of nationality or usual residence",
    detail:
      "Diplomatic and certain official applicants are excepted. For everyone else, the place of application is itself a condition of the waiver.",
    nuance:
      "This is what kills third-country stamping. Separately, since 6 September 2025 the Department has directed that all nonimmigrant applicants schedule interviews in their country of nationality or residence, warning that applying elsewhere makes it harder to qualify and that fees are neither refundable nor transferable. An Indian national in the US who books in Canada or Mexico is applying outside both categories.",
  },
  {
    id: "never-refused",
    label: "Never been refused a visa — unless the refusal was overcome or waived",
    detail:
      "The clause is not an absolute bar on anyone who has ever been refused. It is a bar on an unresolved refusal.",
    nuance:
      "This is the most misread sentence in the rule, and the tool that comes closest to being right in this SERP states it incorrectly. A prior 214(b) refusal that was later overcome by a successful issuance, or a 221(g) that was resolved and the visa issued, is a refusal that was overcome. It does not automatically disqualify you. An open, unresolved refusal is a different matter. Do not assume either way — the consular section decides.",
  },
  {
    id: "no-ineligibility",
    label: "No apparent or potential ineligibility",
    detail:
      "Anything on the record suggesting a ground of inadmissibility takes you out of the waiver and into an interview.",
    nuance:
      "This is deliberately broad and is applied by the consular section, not by you. A clean answer on a self-check tool is not a determination.",
  },
  {
    id: "full-validity",
    label: "The prior visa was issued for full validity",
    detail:
      "A visa issued for a shortened validity period — as happens under some reciprocity schedules or after a limited issuance — does not satisfy this.",
    nuance:
      "Almost nobody asks about this, and it is an express condition. Check the validity dates printed on your prior visa against the standard full validity for your nationality and class before assuming you qualify.",
  },
  {
    id: "age",
    label: "You were at least 18 when the prior visa was issued",
    detail:
      "Applies to the B-1/B-2, Border Crossing Card and H-2A renewal routes.",
    nuance:
      "Combined with the removal of the under-14 and over-79 automatic waivers in September 2025, this means children now attend in-person interviews, and so do elderly parents. Families who last renewed under the old rules are routinely surprised by this.",
  },
];

export const IW_OFFICER_DISCRETION =
  "Consular officers may still require an in-person interview in any individual case, for any reason. Meeting every condition makes you eligible to be considered for a waiver; it does not entitle you to one.";

/* ─────────────────────── fees ──────────────────────────────────────────── */

export interface IwFee {
  label: string;
  amount: string;
  note: string;
  verified: string;
}

/**
 * Two tiers, and the confusion between them is exactly what an H-1B family
 * hits: the parents' B-2 renewal and the principal's H-1B are different fees.
 */
export const iwFees: IwFee[] = [
  {
    label: "B-1 / B-2, and other non-petition-based visas (F, M, J)",
    amount: "$185",
    note: "The MRV application fee. Payable whether or not an interview is waived, and not refundable if the application is refused.",
    verified: IW_VERIFIED,
  },
  {
    label: "Petition-based visas — H, L, O, P, Q, R",
    amount: "$205",
    note: "Includes H-1B, H-4, L-1, L-2 and O-1. A different figure from the visitor fee, which is why family trips produce two different amounts.",
    verified: IW_VERIFIED,
  },
];

export const IW_INTEGRITY_FEE = {
  amount: "$250",
  status: "Enacted — verify collection status before budgeting",
  detail:
    "The Visa Integrity Fee was created by the reconciliation act signed on 4 July 2025 (Public Law 119-21), applies to nonimmigrant visa issuance from fiscal year 2026, and is indexed to the Consumer Price Index annually. It is charged on issuance rather than on application, so it is not paid if the visa is refused. Immigrant visa applicants and Visa Waiver Program / ESTA travellers are exempt. Implementation has been uneven across posts, so treat it as enacted-but-verify rather than as a line item you will certainly pay. A refund mechanism exists in the statute for holders who complied with their visa conditions, but the claims process is not operational.",
  verified: IW_VERIFIED,
} as const;

/* ─────────────────────── wait times ────────────────────────────────────── */

/**
 * Deliberately NOT a table of numbers. Per-consulate waits change weekly and
 * every competitor asserts figures with no source and no capture date. The
 * honest move is to send the reader to the official tool and tell them how to
 * read it.
 */
export const IW_WAIT_TIMES_NOTE =
  "Per-consulate wait times change constantly and any figure printed on a web page is stale by the time you read it. The Department of State publishes live appointment wait times by post and visa class. Read it yourself on the day you plan, note the date you read it, and treat any number quoted in a forum or a blog without a capture date as unusable.";

/* ─────────────────────── after the December 2025 change ────────────────── */

export const IW_SCREENING_NOTE = {
  effective: "15 December 2025",
  detail:
    "H-1B and H-4 applicants are instructed to set the privacy settings on all of their social media profiles to public. Consular officers may review publicly available online content as part of the adjudication. This applies to the interview itself, not to the waiver question — H-1B and H-4 applicants are not dropbox-eligible in any case — but it materially affects how long an H-1B family should budget for stamping, and it drove interview cancellations and rescheduling at Indian posts when it took effect.",
  href: iwLinks.h1bScreening,
} as const;
