/**
 * Form I-94 data: the record itself, the travel history, D/S, the three
 * documents people confuse, and how to fix or replace an I-94.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVENANCE — read before editing
 *
 * CBP facts come from cbp.gov's Arrival/Departure Forms: I-94 page and the
 * i94.cbp.dhs.gov FAQ. The ten-year travel-history window and the exclusions
 * are from that FAQ and from DHS/CBP/PIA-016(a), which records the change from
 * five years to ten. Fee figures are Form G-1055, edition 10/07/26.
 *
 * THREE LIMITS ON THE TRAVEL HISTORY, ALL LOAD-BEARING:
 *   1. Ten years only.
 *   2. Most land-border arrivals and departures may not appear.
 *   3. CBP states it is a helpful tool for the public and NOT an official
 *      record for legal purposes.
 * Plus a fourth that matters more than any of them for this site's readers:
 * US citizens and lawful permanent residents cannot retrieve travel history
 * from the site at all and must file a FOIA request. The reader most likely to
 * need a decade-long trip log — an LPR preparing an N-400 — is the one reader
 * the tool will not serve. Any edit that softens these points makes the page
 * wrong in the direction that costs someone a filing.
 *
 * WHAT THIS FILE DOES NOT OWN. The passport-truncated admit-until date and the
 * deferred-inspection route to a correction belong to /h1b-denied-entry-airport
 * (src/data/portOfEntryData.ts). The 240-day rule belongs to /h1b/extension and
 * the 60-day grace period to /h1b/layoff-60-day-grace-period. Summarise and
 * link; do not re-document them here.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal or immigration advice.
 */

export const I94_VERIFIED = "2026-10-13";
export const I94_UPDATED = "2026-10-13";
export const I94_PUBLISHED = "2026-10-13";

export const I94_SOURCES = {
  i94Site: "https://i94.cbp.dhs.gov/",
  i94Faq: "https://i94.cbp.dhs.gov/help",
  cbpI94: "https://www.cbp.gov/travel/international-visitors/i-94",
  deferredInspection: "https://www.cbp.gov/about/contact/ports/deferred-inspection-sites",
  pia: "https://www.dhs.gov/publication/us-customs-and-border-protection-form-i-94-automation",
  i102: "https://www.uscis.gov/i-102",
  feeSchedule: "https://www.uscis.gov/g-1055",
  cfr2641: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-264/section-264.1",
  cfr2352: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-235/section-235.2",
  foia: "https://www.dhs.gov/freedom-information-act-foia",
  irsSpt: "https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test",
} as const;

/* ══════════════════ 1. What it is ═══════════════════════════════════════ */

export const I94_BASICS = {
  fullName: "Form I-94, Arrival/Departure Record",
  what:
    "The record of your admission to the United States. It states the class of admission you were given and the date to which you were admitted, and that date is what governs how long you may stay — rather than your visa's expiry or your petition's validity. Note the one case people get wrong in the other direction: when USCIS approves a change or extension of status it issues Form I-797A with a NEW I-94 attached at the bottom, and that attached I-94 is then your current one. So the rule is not \"never the I-797\" — it is always your most recent I-94, wherever it came from.",
  numberShape:
    "An 11-character admission record number, new for every admission. Records issued before May 2019 are 11 digits; from May 2019 CBP issues nine digits, then a letter, then a digit — for example 012345678A1. An unexpired numeric-format number stays valid until its admit-until date.",
  electronic:
    "For almost everyone it is now electronic. CBP builds the record from your travel documents and you retrieve or print it yourself from i94.cbp.dhs.gov or the CBP Link app. At the land border travellers are issued I-94s electronically and no longer receive a paper stub.",
  paper:
    "A paper form can still be requested during the inspection process, and such requests are handled in a secondary setting. If you were issued a paper I-94, surrender it when you leave — to the commercial carrier, to the Canada Border Services Agency, or to CBP.",
  registration:
    "The I-94 is also your federal alien-registration record. 8 CFR 264.1 lists it both as a prescribed registration form and as evidence of registration — which is why most people admitted on a visa have nothing to file under the registration requirement.",
  registrationCite: "8 CFR 264.1(a), (b)",
  checkEveryEntry:
    "Download it after every single entry. It takes a minute, it is free, and it is the only moment at which an error is cheap to fix. People discover a wrong class of admission or a wrong date months later, when the fix has become a trip to a deferred inspection site or a refiling.",
} as const;

/* ══════════════════ 2. Retrieval, step by step ══════════════════════════ */

export interface RetrievalStep {
  n: number;
  title: string;
  detail: string;
}

export const GET_MOST_RECENT_I94: RetrievalStep[] = [
  {
    n: 1,
    title: "Open the CBP I-94 site",
    detail:
      "Go to i94.cbp.dhs.gov. There is no account and no login. The CBP Link mobile app offers the same lookup.",
  },
  {
    n: 2,
    title: "Choose Get Most Recent I-94",
    detail:
      "This is a different screen from the travel-history lookup, and people conflate them. Most Recent I-94 gives you the current admission record; View Travel History gives you the list of crossings.",
  },
  {
    n: 3,
    title: "Enter your details exactly as they appear in your passport",
    detail:
      "Family name, first name, date of birth, passport number and country of issuance. The match is literal: a middle name recorded as part of the first name on the passport has to be entered that way, and an Indian passport that puts the surname first will not match if you reorder it.",
  },
  {
    n: 4,
    title: "Read the four things that matter",
    detail:
      "Admit Until Date, Class of Admission, the record number, and the most recent date of entry. Check the class of admission against the status you were actually granted, and the admit-until date against your petition's validity.",
  },
  {
    n: 5,
    title: "Save a PDF, not a screenshot",
    detail:
      "Print to PDF and keep it with that entry's boarding pass. The record on the site is overwritten by your next admission; your own copy is not.",
  },
];

export const GET_TRAVEL_HISTORY: RetrievalStep[] = [
  {
    n: 1,
    title: "Open i94.cbp.dhs.gov and choose View Travel History",
    detail: "A separate option from Get Most Recent I-94.",
  },
  {
    n: 2,
    title: "Enter the same passport details",
    detail: "Same literal matching rules.",
  },
  {
    n: 3,
    title: "Read the table",
    detail:
      "Each row is one crossing: the date, whether it was an arrival or a departure, and the port of entry or exit. Travel on a passport that has since expired is still shown.",
  },
  {
    n: 4,
    title: "Export it before you count anything",
    detail:
      "Save the PDF. Then reconcile it against your passport stamps and your own flight records before you use it for a day count — see the three limits below.",
  },
  {
    n: 5,
    title: "If you are a citizen or a green card holder, stop here",
    detail:
      "The site will not return travel history for US citizens or lawful permanent residents. Your route is a FOIA request. This is covered below.",
  },
];

/* ══════════════════ 3. The limits ═══════════════════════════════════════ */

export interface HistoryLimit {
  limit: string;
  detail: string;
  consequence: string;
}

export const HISTORY_LIMITS: HistoryLimit[] = [
  {
    limit: "Ten years, and no more",
    detail:
      "CBP's own FAQ states the travel-history module provides arrival and departure dates, with the port of entry or exit, for the past ten years only. It used to be five; DHS's privacy impact assessment for the I-94 website records the change to ten.",
    consequence:
      "An N-400 that asks about trips since you became a permanent resident can reach back further than ten years. For anyone who got their green card before 2016, the history is structurally incomplete for that purpose.",
  },
  {
    limit: "Most land crossings may be missing",
    detail:
      "CBP states that certain types of travel may not appear on the website, including most land-border arrivals and departures.",
    consequence:
      "A weekend in Toronto or a drive to Tijuana can be invisible. Worse, a land DEPARTURE that goes unrecorded leaves your last recorded event as an arrival — which reads, on the face of the record, like you never left.",
  },
  {
    limit: "It is not an official record",
    detail:
      "CBP describes the history as a helpful tool for the public and expressly not an official record for legal purposes.",
    consequence:
      "It is a starting document. For anything consequential — an N-400, a recapture claim, a tax residency position — you reconcile it against passport stamps, boarding passes and your own records, and you keep that reconciliation.",
  },
  {
    limit: "Citizens and permanent residents are locked out",
    detail:
      "CBP states that US citizens and green card holders cannot retrieve their travel history using the I-94 site and must submit a request through the Freedom of Information Act.",
    consequence:
      "This is the sharpest edge of the whole system: the person with the strongest need for a long, accurate trip log is the person the tool refuses. FOIA processing takes months, so an LPR planning to naturalise should request it well before filing, not after.",
  },
];

export const LAND_DEPARTURE_NOTE =
  "CBP's own guidance on this is worth carrying: if you received an electronic I-94 and you depart by land, the departure may not be recorded accurately unless you re-enter the United States before your passport's expiration date. Carry evidence of the departure — a Canada Border Services Agency or Mexican INM entry stamp, a toll receipt, a boarding pass.";

/* ══════════════════ 4. D/S ══════════════════════════════════════════════ */

export const DS_NOTATION = {
  stands: "Duration of Status",
  what:
    "Instead of a date, your I-94 says D/S. You are admitted for as long as you maintain the terms of your status rather than until a fixed day.",
  whoGets: [
    { cls: "F-1 and F-2", why: "Students and their dependants, for the length of the programme plus any authorised practical training and the grace period." },
    { cls: "J-1 and J-2", why: "Exchange visitors and dependants, for the length of the programme on the DS-2019." },
    { cls: "M-1 and M-2", why: "Vocational students — though M-1 admission carries its own additional limits." },
    { cls: "A and G", why: "Diplomatic and international-organisation classes, for the length of the assignment." },
    { cls: "I", why: "Representatives of foreign information media." },
  ],
  whoDoesNot: [
    "H-1B and H-4",
    "L-1 and L-2",
    "O-1 and O-3",
    "E-1, E-2 and E-3",
    "TN",
    "B-1 and B-2",
  ],
  whoDoesNotNote:
    "These get a date. The date is set by the petition's validity, or by the officer's judgement for a visitor, and is capped by your passport's expiry.",
  /** The counter-intuitive half. */
  notSafer:
    "D/S is not a longer permission; it is a different kind of permission, and in one respect a riskier one. A dated I-94 gives you a deadline you can diary. D/S gives you no date at all, so there is nothing to warn you when the underlying condition stops being met — a programme ends, a course load drops below full-time, employment authorisation lapses. You can be out of status without any document having expired.",
  unlawfulPresence:
    "The counterweight is how unlawful presence accrues. For someone admitted until a date, it generally starts the day after that date. For someone admitted D/S it generally starts only when an immigration judge or USCIS makes a formal finding of a status violation in the course of adjudicating a request. That cuts both ways: it means a technical lapse does not silently build a three- or ten-year bar, and it means you may have been out of status for a long time before anything tells you so.",
  policyNote:
    "A proposed rule that would have replaced D/S with fixed admission periods for F, J and I classes did not take effect. D/S remains the rule. The site's student cluster carries the current status of that proposal.",
} as const;

/* ══════════════════ 5. Three documents ══════════════════════════════════ */

export interface ThreeDocRow {
  question: string;
  visa: string;
  i94: string;
  i797: string;
}

export const THREE_DOCUMENTS: ThreeDocRow[] = [
  {
    question: "What is it for?",
    visa: "Permission to travel to a US port of entry and ask to be admitted",
    i94: "The record of the admission you were actually given",
    i797: "Notice that USCIS approved a petition and for what period",
  },
  {
    question: "Who issues it?",
    visa: "A US consulate — in India, Delhi, Mumbai, Chennai, Hyderabad or Kolkata",
    i94: "CBP, at the port of entry",
    i797: "USCIS",
  },
  {
    question: "Where does it live?",
    visa: "A foil sticker in your passport",
    i94: "i94.cbp.dhs.gov, or a tear-off at the bottom of an I-797A",
    i797: "Paper, held by your employer or you",
  },
  {
    question: "Does it control how long you may stay?",
    visa: "No",
    i94: "Yes. This is the one",
    i797: "No — it sets the petition's validity, which caps the I-94 but is not the same thing",
  },
  {
    question: "What happens when it expires while you are in the US?",
    visa: "Nothing immediately. You may stay. You cannot re-enter without a new one",
    i94: "Your authorised stay ends. Staying on is a status problem",
    i797: "Your employer's authority to employ you under that petition ends",
  },
  {
    question: "What happens when it expires while you are abroad?",
    visa: "You need a new visa before you can travel back",
    i94: "Nothing — it was closed out when you left. A new one is generated on your next admission",
    i797: "You need a valid petition to be admitted in that classification",
  },
];

export const COMMON_MISMATCH =
  "The combination an NRI hits most often is a valid I-94 with an expired visa. You may stay for the whole of the I-94 period — the expired visa does not shorten it — but you cannot leave and come back without a new visa, which means a consular appointment in India and the current wait for one. That is why a trip home in the last months of an H-1B period deserves a check of the visa foil's date, not just the I-94's.";

/* ══════════════════ 6. Errors, corrections, replacement ═════════════════ */

export interface I94Error {
  symptom: string;
  likely: string;
  route: string;
  ownerPath?: string;
}

export const I94_ERRORS: I94Error[] = [
  {
    symptom: "The admit-until date matches my passport expiry, not my petition",
    likely: "Usually not an error at all. CBP routinely admits a traveller only to the expiry of the passport.",
    route:
      "Renew the passport, then get a new admission or a corrected record. Not an argument to have at the airport.",
    ownerPath: "/h1b-denied-entry-airport",
  },
  {
    symptom: "The class of admission is wrong — it says B-2 and I was admitted H-1B",
    likely: "A genuine CBP error, and the kind that matters most, because it strips your work authorisation on paper.",
    route:
      "A deferred inspection site. Go quickly, with the petition, the approval notice and the visa.",
    ownerPath: "/h1b-denied-entry-airport",
  },
  {
    symptom: "The date is wrong for a reason unrelated to my passport",
    likely: "A genuine error.",
    route: "A deferred inspection site.",
    ownerPath: "/h1b-denied-entry-airport",
  },
  {
    symptom: "My name or date of birth is wrong, or my name will not match at all",
    likely:
      "Either a data-entry error or a name-order mismatch. An Indian passport that prints the surname first, or a single-field name, is the usual cause of a lookup that returns nothing.",
    route:
      "Try the lookup with the name fields swapped and with the full name in the first-name field before concluding the record is wrong. If it is genuinely wrong, a deferred inspection site corrects biographical information.",
  },
  {
    symptom: "My paper I-94 is lost, stolen or damaged",
    likely: "You need a replacement rather than a correction.",
    route: "Form I-102. See the fee below.",
  },
  {
    symptom: "I have no I-94 and I think I should have one",
    likely:
      "Possible after a land-border entry, or if the electronic record did not generate.",
    route: "Form I-102 requests an initial I-94 as well as a replacement.",
  },
];

/** Form G-1055, edition 10/07/26. */
export const I102_FEES = {
  filing: "$560",
  extra: "$24",
  extraLabel: "Additional Form I-94 Fee: Pub. L. 119-21 Fee",
  extraNote:
    "Submitted separately from the filing fee when you are requesting a replacement or an initial I-94. It is not charged if you are replacing a lost, stolen or mutilated Form I-94W or Form I-95.",
  exemptions:
    "No filing fee for an initial Form I-94 requested as a nonimmigrant member of the US armed forces, a participant in a NATO armed forces or civil component, or a nonimmigrant member of the Partnership for Peace programme.",
  edition: "10/07/26",
} as const;

/* ══════════════════ 7. What the history is used for ═════════════════════ */

export const SPT_FORMULA = {
  name: "Substantial Presence Test",
  statute: "26 U.S.C. 7701(b)(3)",
  test:
    "You are treated as a US resident for tax purposes for a calendar year if you were physically present in the United States on at least 31 days during that year AND 183 days or more across a three-year weighted count.",
  weights: [
    { year: "The current year", weight: "every day counts as 1 day" },
    { year: "The first preceding year", weight: "every day counts as 1/3 of a day" },
    { year: "The second preceding year", weight: "every day counts as 1/6 of a day" },
  ],
  threshold: 183,
  minCurrentYear: 31,
  whyHistory:
    "The test is a day count, and the travel history is where most people get their days from. It is also where most people get them slightly wrong, because of the three limits above.",
  notModelled:
    "A day count is not a residency determination. Exempt-individual years for F and J holders, the closer-connection exception, treaty tie-breakers under the India–US treaty, and first-year and dual-status elections all change the answer and none of them is a day count.",
} as const;

export const N400_TRIP_RULES = {
  rebuttableDays: 180,
  breaksDays: 365,
  rebuttable:
    "A single absence of between six months and one year disrupts continuous residence unless you can establish otherwise to the satisfaction of USCIS.",
  breaks:
    "A single absence of one year or more disrupts continuous residence. Form N-470 is the only instrument that preserves it — and it is narrow: it needs a year of unbroken prior US presence plus qualifying employment under INA 316(b), which an ordinary posting to a foreign company is not. For most people in this position there is no instrument, and the route is to file for naturalisation four years and one day after returning.",
  cite: "8 CFR 316.5(c)(1)",
  ownerPath: "/green-card/travel-rules",
  note:
    "The day counter on this page flags trips at those two thresholds. What the thresholds mean, how a presumption is rebutted, and who the narrow N-470 route is actually open to are on the green card travel rules page, which owns them.",
} as const;

export const RECAPTURE_NOTE =
  "There is a third use, and it is worth money. Time spent outside the United States does not count against the H-1B six-year limit or the L-1 five- and seven-year limits, so days abroad can be recaptured to extend your status. Your I-94 travel history is the standard evidence for a recapture claim, which is a concrete reason to download and keep it after every trip rather than reconstructing a decade of travel under deadline.";
