/**
 * Green card travel rules: absence thresholds, the documents that work, the
 * "seeking admission" test, reentry permits, N-470, SB-1, Form I-407, and
 * know-your-rights.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVENANCE — read before editing
 *
 * Everything here traces to a statute, a regulation or an official agency page,
 * read on 2026-10-13:
 *   INA 101(a)(13)(C) / 8 U.S.C. 1101(a)(13)(C) — "seeking admission"
 *   8 CFR 211.1, 211.3, 211.4                   — documents for readmission
 *   8 CFR 316.5(c), (d)                         — continuous residence, N-470
 *   Form G-1055, edition 10/07/26               — every fee figure
 *   USCIS, International Travel as a Permanent Resident
 *
 * THE PAGE IS WRITTEN FROM THE STATUTE DOWN, NOT THE DAY COUNT UP. The organising
 * idea is INA 101(a)(13)(C): a returning permanent resident is NOT an applicant
 * for admission unless one of six conditions applies. Two of those conditions —
 * absence over 180 days, and abandonment of status — are what the day counts are
 * about. Keep that order. It is the structural difference between this page and
 * every competitor page, and it is also the honest way round: the thresholds are
 * consequences of the statute, not rules of their own.
 *
 * TWO SEPARATE REGIMES, OFTEN CONFLATED, NEVER TO BE MERGED HERE:
 *   (a) Is the card still a valid entry document? — 8 CFR 211.1, 211.3.
 *       Threshold: one year.
 *   (b) Is continuous residence for naturalisation intact? — 8 CFR 316.5(c).
 *       Thresholds: six months (rebuttable) and one year (broken).
 * A six-month trip breaks nothing in regime (a) and raises a presumption in
 * regime (b). Writing "6 months is fine" or "6 months is dangerous" is wrong in
 * both directions.
 *
 * TONE. Calm and factual. The three largest keywords for this page are detention
 * queries, which means frightened readers. No fear language, no prediction about
 * what will happen to any individual, no advocacy sourcing in the rights section.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal advice. Abandonment of permanent residence is
 * fact-specific and effectively irreversible.
 */

export const GC_TRAVEL_VERIFIED = "2026-10-13";
export const GC_TRAVEL_UPDATED = "2026-10-13";
export const GC_TRAVEL_PUBLISHED = "2026-10-13";

export const GC_TRAVEL_SOURCES = {
  ina101: "https://www.law.cornell.edu/uscode/text/8/1101",
  cfr211: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-211",
  cfr3165: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-C/part-316/section-316.5",
  uscisTravel:
    "https://www.uscis.gov/green-card/after-we-grant-your-green-card/international-travel-as-a-permanent-resident",
  i131: "https://www.uscis.gov/i-131",
  i407: "https://www.uscis.gov/i-407",
  n470: "https://www.uscis.gov/n-470",
  n400: "https://www.uscis.gov/n-400",
  i90: "https://www.uscis.gov/i-90",
  feeSchedule: "https://www.uscis.gov/g-1055",
  sb1: "https://travel.state.gov/content/travel/en/us-visas/immigrate/returning-resident.html",
  iceDetention: "https://www.ice.gov/detain/detention-management",
  cbpDeferred: "https://www.cbp.gov/about/contact/ports/deferred-inspection-sites",
  eoirFind: "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers",
  ailaFind: "https://www.ailalawyer.com/",
} as const;

/* ══════════════ 1. The statute: when are you "seeking admission"? ═══════ */

export const SEEKING_ADMISSION = {
  cite: "INA 101(a)(13)(C) / 8 U.S.C. 1101(a)(13)(C)",
  lead:
    "An alien lawfully admitted for permanent residence in the United States shall not be regarded as seeking an admission into the United States for purposes of the immigration laws unless the alien —",
  conditions: [
    {
      n: "(i)",
      text: "has abandoned or relinquished that status,",
      plain:
        "The intent question. Not a day count — a conclusion drawn from the facts of your life. See the abandonment factors below.",
    },
    {
      n: "(ii)",
      text:
        "has been absent from the United States for a continuous period in excess of 180 days,",
      plain:
        "The only pure day count in the list, and the reason 180 days is a real line rather than folklore. Crossing it does not mean you lose anything; it means the inspection is a different kind of inspection.",
    },
    {
      n: "(iii)",
      text:
        "has engaged in illegal activity after having departed the United States,",
      plain: "Conduct abroad.",
    },
    {
      n: "(iv)",
      text:
        "has departed from the United States while under legal process seeking removal of the alien from the United States, including removal proceedings under this Act and extradition proceedings,",
      plain: "Leaving while removal or extradition proceedings are live.",
    },
    {
      n: "(v)",
      text:
        "has committed an offense identified in section 212(a)(2), unless since such offense the alien has been granted relief under section 212(h) or 240A(a), or",
      plain:
        "Certain criminal offences. This is the condition behind most of the reported cases involving long-settled permanent residents, and it has no time limit attached — an old conviction can still bring a returning resident inside 101(a)(13)(C).",
    },
    {
      n: "(vi)",
      text:
        "is attempting to enter at a time or place other than as designated by immigration officers or has not been admitted to the United States after inspection and authorization by an immigration officer.",
      plain: "Entering outside an official inspection.",
    },
  ],
  whyItMatters:
    "Read what the subsection does. By default a returning permanent resident is NOT applying for admission — you are a resident coming home, and the grounds of inadmissibility in INA 212(a) are not applied to you. Only if one of the six conditions is met does that change, and then the whole of 212(a) is available to the officer. Everything else on this page is downstream of which side of that line a trip puts you on.",
  burden:
    "Where the government asserts one of these conditions, the burden of establishing that a returning resident is not seeking admission is not simply the traveller's to carry informally at the counter. Abandonment is ultimately decided by an immigration judge, not by an officer at the port of entry.",
} as const;

/* ══════════════ 2. Absence tiers ════════════════════════════════════════ */

export type RiskTier = "routine" | "attention" | "serious" | "critical";

export interface AbsenceTier {
  id: string;
  label: string;
  days: string;
  tier: RiskTier;
  cardValid: string;
  continuousResidence: string;
  seekingAdmission: string;
  whatToDo: string[];
}

/**
 * The two regimes are columns, not one verdict, because they have different
 * thresholds and conflating them is the commonest error in this topic.
 */
export const ABSENCE_TIERS: AbsenceTier[] = [
  {
    id: "under-180",
    label: "Under 6 months",
    days: "0–180 days",
    tier: "routine",
    cardValid:
      "Yes. The green card is a valid entry document for readmission after a temporary absence of less than one year (8 CFR 211.1(a)(2)).",
    continuousResidence:
      "Not disrupted by the length of the trip. 8 CFR 316.5(c)(1) starts at six months.",
    seekingAdmission:
      "No, on length. None of the 101(a)(13)(C) conditions is triggered by a trip this short on its own.",
    whatToDo: [
      "Carry the card and your passport",
      "Download your I-94 after you return, as a record of the trip",
      "Nothing else, for most people",
    ],
  },
  {
    id: "180-to-365",
    label: "6 months to 1 year",
    days: "181–364 days",
    tier: "attention",
    cardValid:
      "Yes. Still under one year, so the card remains a valid entry document.",
    continuousResidence:
      "Disrupted UNLESS you establish otherwise to the satisfaction of USCIS. A rebuttable presumption, not an automatic loss — 8 CFR 316.5(c)(1)(i).",
    seekingAdmission:
      "Yes, on length. Past 180 continuous days you fall inside 101(a)(13)(C)(ii), so you are treated as seeking admission and the inspection is a real inspection.",
    whatToDo: [
      "Carry evidence of the ties the regulation itself names: continuing US employment, family remaining in the US, a US home you kept access to, and no employment taken abroad",
      "Carry your last US tax return, filed as a resident",
      "Expect questions about why the trip was long, and have a short, true answer",
      "If another long trip is likely, deal with it before you go — a reentry permit or N-470, not afterwards",
    ],
  },
  {
    id: "over-365",
    label: "Over 1 year, no reentry permit",
    days: "365+ days",
    tier: "critical",
    cardValid:
      "No. 8 CFR 211.1(a)(2) covers an absence of less than one year. Past that the card is not, by itself, the document that gets you in.",
    continuousResidence:
      "Broken. 8 CFR 316.5(c)(1)(ii). After returning to resume permanent residence, a five-year applicant may file four years and one day later; a three-year applicant, two years and one day later.",
    seekingAdmission:
      "Yes, and abandonment is squarely in issue under 101(a)(13)(C)(i) as well as (ii).",
    whatToDo: [
      "Do not board without advice. The decision is being made before you reach the counter",
      "An SB-1 returning resident visa, applied for at a consulate, is the designed route",
      "Alternatively a waiver of the document requirement at the port of entry under 8 CFR 211.1(b)(3), which is discretionary and depends on showing good cause",
      "Assemble the evidence that the absence was beyond your control and temporary in intent",
    ],
  },
  {
    id: "over-365-permit",
    label: "Over 1 year, with a valid reentry permit",
    days: "365 days to the permit's expiry",
    tier: "attention",
    cardValid:
      "The permit, not the card, is your entry document — Form I-327, listed at 8 CFR 211.1(a)(3).",
    continuousResidence:
      "Still broken for naturalisation unless an approved Form N-470 covers the absence. A reentry permit protects re-entry; it does not protect the naturalisation clock. These are the two regimes, and this is where the difference bites hardest.",
    seekingAdmission:
      "Yes, on length. The permit answers the document question, not the intent question — abandonment can still be asserted on the facts.",
    whatToDo: [
      "Carry the permit and the card",
      "Keep filing US tax returns as a resident for every year of the absence",
      "If naturalisation matters to you, you needed N-470 as well, and it had to be filed before the absence reached one year",
    ],
  },
];

/** The precise mechanic of the one-year line. People miss that it is the boarding. */
export const ONE_YEAR_MECHANIC = {
  cite: "8 CFR 211.3",
  text:
    "An immigrant visa, reentry permit, refugee travel document, or a permanent resident card shall be regarded as unexpired if the rightful holder embarked or enplaned before the expiration of his or her immigrant visa, reentry permit, or refugee travel document, or with respect to a permanent resident card, before the first anniversary of the date on which he or she departed from the United States, provided that the vessel or aircraft on which he or she so embarked or enplaned arrives in the United States or foreign contiguous territory on a continuous voyage.",
  plain:
    "The deadline is the moment you board, not the moment you land. Boarding in Delhi on day 364 of your absence and landing on day 365 is inside the rule. A layover does not break the continuous voyage, and neither does a scheduled or emergency stop.",
} as const;

/** The abandonment factors the regulation itself lists for rebutting a presumption. */
export const ABANDONMENT_FACTORS = {
  cite: "8 CFR 316.5(c)(1)(i)",
  lead:
    "The regulation names the kinds of documentation that may establish you did not disrupt your residence during an extended absence. It is not an exhaustive list, but it is the one USCIS wrote down:",
  factors: [
    "The applicant did not terminate his or her employment in the United States",
    "The applicant's immediate family remained in the United States",
    "The applicant retained full access to his or her United States abode",
    "The applicant did not obtain employment while abroad",
  ],
  notJustDays:
    "The regulation adds something people find surprising: this finding remains valid even if you did not apply for or request nonresident classification for tax purposes, did not document an abandonment of permanent resident status, and are still considered a lawful permanent resident under the immigration laws. In other words, continuing to hold the card and file as a resident does not by itself preserve continuous residence for naturalisation.",
  taxTrap: {
    cite: "8 CFR 316.5(c)(2)",
    text:
      "An applicant who is a lawfully admitted permanent resident of the United States, but who voluntarily claims nonresident alien status to qualify for special exemptions from income tax liability, or fails to file either federal or state income tax returns because he or she considers himself or herself to be a nonresident alien, raises a rebuttable presumption that the applicant has relinquished the privileges of permanent resident status in the United States.",
    plain:
      "Filing as a nonresident, or not filing at all because you thought of yourself as a nonresident, raises a rebuttable presumption that you gave up the status. For an NRI family spending years in India this is the single most consequential tax decision there is, and it is an immigration decision disguised as a tax one.",
  },
} as const;

/* ══════════════ 3. The instruments ══════════════════════════════════════ */

export interface Instrument {
  id: string;
  name: string;
  form: string;
  what: string;
  protects: string;
  doesNotProtect: string;
  fee: string;
  mustFileFrom: string;
  deadline: string;
  validity: string;
  cite: string;
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: "reentry-permit",
    name: "Reentry permit",
    form: "Form I-131, Part 1 item 1",
    what:
      "A travel document (Form I-327) that serves as your entry document in place of the green card for an extended absence.",
    protects:
      "Your ability to be readmitted after an absence of a year or more, and the argument that the absence was intended to be temporary.",
    doesNotProtect:
      "Continuous residence for naturalisation. It is not a shield against an abandonment finding either — it is evidence of temporary intent, which is strong but not conclusive.",
    fee: "$630, paper filing only",
    mustFileFrom:
      "Inside the United States. You must be physically present in the US when you file, and biometrics are taken in the US.",
    deadline:
      "Before you leave, in practice. USCIS advises applying before any absence of a year or more; because of the physical-presence and biometrics requirements, the application has to be started while you are still here.",
    validity: "Generally up to 2 years",
    cite: "8 CFR 211.1(a)(3); Form G-1055 ed. 10/07/26",
  },
  {
    id: "n470",
    name: "Preservation of residence for naturalisation",
    form: "Form N-470",
    what:
      "An application under INA 316(b) to have an absence of a year or more treated as not disrupting continuous residence, for qualifying employment abroad.",
    protects:
      "The naturalisation clock through a long absence — the thing a reentry permit does not touch.",
    doesNotProtect:
      "Your entry document. You still need a reentry permit, or you still face the one-year rule at the border.",
    fee: "$420",
    mustFileFrom: "Either before or after the qualifying employment commences.",
    deadline:
      "Before you have been absent from the United States for a continuous period of one year. That is the cliff — 8 CFR 316.5(d)(1)(i). Once the absence reaches twelve months, this route has closed.",
    validity: "Covers the period of the qualifying employment, as approved on Form N-472",
    cite: "8 CFR 316.5(d)(1); Form G-1055 ed. 10/07/26",
  },
  {
    id: "sb1",
    name: "Returning resident visa",
    form: "Form DS-117",
    what:
      "An immigrant visa in the SB-1 category, applied for at a US consulate, for a permanent resident who has been outside the US beyond the reach of their documents.",
    protects:
      "Your ability to return at all, when the card has stopped working as an entry document and no reentry permit covers you.",
    doesNotProtect:
      "Nothing is preserved by it automatically. It is an application, and it is the hardest of the three.",
    fee: "Set by the Department of State; verify on the consulate's own fee page",
    mustFileFrom: "A US consulate abroad — in India, the post with jurisdiction over where you are",
    deadline: "Generally at least three months before you intend to travel",
    validity: "One entry, as an immigrant visa",
    cite: "22 CFR 42.22; Department of State, Returning Resident Visas",
  },
];

export const SB1_REQUIREMENTS = {
  lead:
    "An SB-1 applicant generally has to establish all of the following, and the second and third are where applications fail:",
  items: [
    "You were a lawful permanent resident when you departed the United States",
    "You departed with the intention of returning and have not abandoned that intention",
    "You are returning from a temporary visit abroad, and if the stay was protracted, it was caused by reasons beyond your control and for which you were not responsible",
  ],
  reality:
    "\"Reasons beyond your control\" is doing the work. A medical emergency, a family member's terminal illness, a travel ban or a government closure are the kinds of facts that fit. A job that went well, a business that took longer than planned, or children settling into school in India generally do not, however reasonable they were as decisions.",
  alsoNeeded:
    "An SB-1 applicant is also treated as an immigrant visa applicant, which means a medical examination and the ordinary admissibility requirements.",
} as const;

/* ══════════════ 4. Documents by situation ═══════════════════════════════ */

export interface DocSituation {
  situation: string;
  carry: string[];
  cite?: string;
}

export const DOCUMENT_SITUATIONS: DocSituation[] = [
  {
    situation: "Ordinary trip, card valid, under 6 months",
    carry: ["Valid green card (Form I-551)", "Valid passport"],
    cite: "8 CFR 211.1(a)(2)",
  },
  {
    situation: "Green card expired, I-90 filed",
    carry: [
      "The expired card",
      "The I-90 receipt notice",
      "An ADIT stamp or extension letter if USCIS has issued one",
    ],
    cite: "See /green-card-renewal, which owns the expired-card rules",
  },
  {
    situation: "Conditional 2-year card expired, I-751 or I-829 pending",
    carry: [
      "The expired card",
      "The I-751 or I-829 filing receipt — and check its date",
    ],
    cite:
      "8 CFR 211.1(a)(5): an expired I-551 plus a filing receipt issued within the previous 6 months works as an entry document for an absence of less than one year. A receipt older than six months does not fit this provision, which is why people with long-pending I-751s travel on an extension letter or an ADIT stamp instead.",
  },
  {
    situation: "Absence of a year or more, permit obtained",
    carry: ["Form I-327 reentry permit", "Green card", "Passport", "Evidence of US ties"],
    cite: "8 CFR 211.1(a)(3)",
  },
  {
    situation: "Card lost or stolen abroad, absence under a year",
    carry: [
      "A police report where you can get one",
      "Your passport",
      "An application to replace the card",
    ],
    cite:
      "8 CFR 211.1(b)(3): where the card was lost or stolen and the absence is under a year, you apply for a replacement card rather than a separate waiver, and that filing serves as both the replacement application and the waiver of the passport and visa requirement.",
  },
  {
    situation: "I-485 pending — not yet a permanent resident",
    carry: ["Advance parole, physically in hand, valid through your return date"],
    cite: "This page does not own that situation. See /uscis/travel-to-india-while-i485-pending",
  },
  {
    situation: "US government employee or military, abroad on official orders",
    carry: ["Form I-551, whether or not expired", "Your orders"],
    cite:
      "8 CFR 211.1(a)(6), which also covers a spouse or child who resided abroad during the posting and is returning with or within four months of the employee.",
  },
];

/* ══════════════ 5. Form I-407 ═══════════════════════════════════════════ */

export const I407 = {
  name: "Form I-407, Record of Abandonment of Lawful Permanent Resident Status",
  facts: [
    {
      q: "Is it voluntary?",
      a: "Yes. It is the form by which a permanent resident records their own decision to give up the status. Its whole legal character is that it is a voluntary act.",
    },
    {
      q: "Do I have to sign it at the airport if an officer asks?",
      a: "No. There is no obligation to sign Form I-407 at a port of entry, and declining to sign it is not itself a ground for anything. You may say that you do not wish to abandon your status and that you would like the question decided by an immigration judge.",
    },
    {
      q: "What happens if I decline?",
      a: "Abandonment is not an officer's finding to make conclusively. If CBP believes you have abandoned the status, the route is a referral to immigration court, where an immigration judge decides — and where you can be represented. Signing the form gives up that process.",
    },
    {
      q: "Can I undo it?",
      a: "Not in any practical sense. There is no revocation procedure. Getting the status back means qualifying for it again from the beginning, which for an India-born applicant can mean re-entering a queue measured in years.",
    },
    {
      q: "Does signing it solve a tax problem?",
      a: "It can create one. Ending permanent residence is an expatriation event for someone who has been a lawful permanent resident in at least 8 of the last 15 tax years. That is a reason to take advice before signing, not a reason to sign quickly. The site's return-to-India guide covers the tax side.",
    },
    {
      q: "When is filing it the right thing to do?",
      a: "When you have genuinely decided to live in India permanently and want the status ended cleanly, deliberately and with the tax position planned. Filed on purpose, from a settled decision, it is a sensible instrument. Signed at a counter at the end of a long flight, it is not.",
    },
  ],
  ownerNote:
    "The permanent-move decision — keep the card or end it, and the exit-tax consequences — belongs to /return-to-india. This page covers only the airport scenario.",
} as const;

/* ══════════════ 6. Airport scenario ═════════════════════════════════════ */

export interface AirportRow {
  moment: string;
  doDo: string;
  dont: string;
}

export const AIRPORT_SCENARIOS: AirportRow[] = [
  {
    moment: "At primary inspection",
    doDo:
      "Present the green card and passport. Answer the questions asked, briefly and truthfully. Say where you live in the United States.",
    dont:
      "Do not volunteer a narrative about having moved to India, or that you are 'thinking about staying there'. Intent is the test, and you are describing it.",
  },
  {
    moment: "Referred to secondary",
    doDo:
      "Expect a wait. A referral to secondary is common and is not a refusal. Keep your documents together and stay civil.",
    dont:
      "Do not assume it is about you specifically, and do not argue the law at the counter. The site's denied-entry guide covers what secondary inspection is and what officers may do.",
  },
  {
    moment: "Asked about a long absence",
    doDo:
      "Give the reason, with the evidence you brought: employment that continued, family who stayed, the home you kept, the tax returns you filed as a resident.",
    dont:
      "Do not guess at dates. If you do not remember exactly, say so rather than estimating into the record.",
  },
  {
    moment: "Asked to sign Form I-407",
    doDo:
      "You may decline. Say clearly that you do not wish to abandon your permanent resident status and that you would like an immigration judge to decide the question.",
    dont:
      "Do not sign to end the conversation, and do not sign because you were told it is routine. This is the single most consequential document anyone will put in front of you at a border.",
  },
  {
    moment: "Asked about arrests or charges",
    doDo:
      "Answer truthfully. If there is any criminal history at all, you should have spoken to a lawyer before booking — INA 101(a)(13)(C)(v) has no time limit.",
    dont:
      "Do not say 'no' about something old you believe was expunged or dismissed. A misrepresentation is a separate and permanent problem under INA 212(a)(6)(C)(i).",
  },
  {
    moment: "Your devices",
    doDo: "Know that device searches at the border happen. Carry an attorney's number on paper.",
    dont:
      "Do not rely on being able to make a call from your phone. The denied-entry guide owns this topic in full.",
  },
  {
    moment: "Given a paper and told to appear later",
    doDo:
      "Read it. Deferred inspection on Form I-546 means your inspection was not completed; it is not the same thing as a refusal. Appear when and where it says, with what it asks for.",
    dont: "Do not ignore it, and do not leave the country before the appointment.",
  },
];

/* ══════════════ 7. Know your rights ═════════════════════════════════════ */

export interface RightItem {
  right: string;
  detail: string;
  source: string;
}

/**
 * Every item traces to a statute, a regulation or an official agency page.
 * Nothing here is sourced to advocacy material, deliberately — the point is
 * that these are rules, not positions.
 */
export const RIGHTS: RightItem[] = [
  {
    right: "You are not, by default, applying for admission",
    detail:
      "A returning lawful permanent resident is not regarded as seeking admission unless one of the six conditions in INA 101(a)(13)(C) applies. That is the starting position, in the statute.",
    source: "INA 101(a)(13)(C) / 8 U.S.C. 1101(a)(13)(C)",
  },
  {
    right: "Abandonment is decided by an immigration judge, not at a counter",
    detail:
      "If the government asserts that you have abandoned permanent residence and you do not agree, the route is removal proceedings before an immigration judge — where you may be represented and where the government has to prove its case. Signing Form I-407 removes that process.",
    source: "INA 240; 8 CFR 1240",
  },
  {
    right: "You do not have to sign Form I-407",
    detail:
      "It records a voluntary abandonment. There is no obligation to sign it at a port of entry.",
    source: "Form I-407 and its instructions, uscis.gov/i-407",
  },
  {
    right: "There is no guaranteed right to counsel during inspection",
    detail:
      "This is the uncomfortable one, and knowing it in advance is the point. Inspection is not a proceeding at which counsel appears, and a Form G-28 does not create a seat in the room. Where an officer permits it, you may contact counsel — which is why the number goes on paper, not only in a phone.",
    source: "The site's denied-entry guide documents this in full, with citations",
  },
  {
    right: "A correction to your record has a designated route",
    detail:
      "CBP operates more than 70 deferred inspection sites, which review and correct certain errors on admission documents after admission.",
    source: "cbp.gov, deferred inspection sites",
  },
  {
    right: "You can prepare the evidence before you travel",
    detail:
      "The documentation 8 CFR 316.5(c)(1)(i) names — continuing employment, family in the US, retained access to a US home, no employment abroad — is evidence you can assemble calmly at home rather than remember under pressure at a counter.",
    source: "8 CFR 316.5(c)(1)(i)",
  },
];

export const FIND_A_LAWYER = [
  {
    label: "EOIR list of pro bono legal service providers",
    href: "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers",
    note: "The Department of Justice's own list, by state. Free or low-cost providers recognised for immigration court work.",
  },
  {
    label: "Department of Justice — recognised organisations and accredited representatives",
    href: "https://www.justice.gov/eoir/recognition-and-accreditation-program",
    note: "Non-attorney representatives who are authorised to represent people in immigration matters.",
  },
  {
    label: "AILA lawyer search",
    href: "https://www.ailalawyer.com/",
    note: "The American Immigration Lawyers Association's referral directory. Paid representation.",
  },
  {
    label: "State bar referral services",
    href: "https://www.americanbar.org/groups/legal_services/flh-home/flh-lawyer-referral-directory/",
    note: "Each state bar runs a referral service, and most screen for practice area.",
  },
] as const;

export const LAWYER_TIMING =
  "The useful moment to call is before you book, not at the airport. Any criminal history at all, any prior removal proceedings, any absence approaching or past a year, and any pending application are all reasons to get advice while you still have options. From a secondary inspection room, almost every option has already closed.";

/* ══════════════ 8. Fees ═════════════════════════════════════════════════ */

export const GC_TRAVEL_FEES = [
  { item: "Form I-131, reentry permit", fee: "$630", note: "Paper filing only. Not eligible for a fee waiver request." },
  { item: "Form N-470, preservation of residence", fee: "$420", note: "Certain applicants may be eligible for a fee waiver." },
  { item: "Form I-90, replace green card", fee: "$465 paper / $415 online", note: "$0 where USCIS issued a card you never received and it was returned undeliverable, or where the card carried wrong information because of a DHS error." },
  { item: "Form N-400, naturalisation", fee: "$760 paper / $710 online", note: "$380 paper where documented household income is not more than 400% of the Federal Poverty Guidelines." },
  { item: "Form I-407, abandonment of status", fee: "$0", note: "There is no filing fee. That is not a reason to file it." },
  { item: "Form DS-117, returning resident (SB-1)", fee: "Set by the Department of State", note: "Verify on the consulate's own fee page. An SB-1 applicant also pays for a medical examination." },
] as const;

export const GC_TRAVEL_FEE_SOURCE = "Form G-1055, USCIS fee schedule, edition 10/07/26";

/* ══════════════ 9. ICE detention statistics ═════════════════════════════ */

/**
 * ICE's own published average daily population, from the FY2019–FY2026
 * Detention Statistics workbooks at ice.gov/detain/detention-management,
 * "ICE Average Daily Population by Facility Type and Month", Total row,
 * FY Overall column.
 *
 * FY2026 is a partial year: the workbook is dated 20 July 2026 and carries
 * October 2025 through July 2026, with August and September zero because they
 * have not happened. Its "FY Overall" figure is therefore a ten-month average,
 * and the chart caption says so. Do not compare it to a full year without the
 * note.
 */
export const ICE_ADP_BY_FY = [
  { fy: 2019, adp: 50_165, partial: false },
  { fy: 2020, adp: 33_724, partial: false },
  { fy: 2021, adp: 19_254, partial: false },
  { fy: 2022, adp: 22_578, partial: false },
  { fy: 2023, adp: 28_289, partial: false },
  { fy: 2024, adp: 37_722, partial: false },
  { fy: 2025, adp: 48_404, partial: false },
  { fy: 2026, adp: 64_508, partial: true },
] as const;

/** FY2026 monthly, same workbook, Oct 2025 – Jul 2026. */
export const ICE_ADP_FY2026_MONTHLY = [
  { month: "Oct 2025", adp: 63_189 },
  { month: "Nov 2025", adp: 66_620 },
  { month: "Dec 2025", adp: 69_541 },
  { month: "Jan 2026", adp: 71_937 },
  { month: "Feb 2026", adp: 68_224 },
  { month: "Mar 2026", adp: 63_256 },
  { month: "Apr 2026", adp: 59_862 },
  { month: "May 2026", adp: 58_192 },
  { month: "Jun 2026", adp: 59_425 },
  { month: "Jul 2026", adp: 65_634 },
] as const;

export const ICE_ADP_SOURCE = {
  label: "ICE Detention Statistics, FY2019–FY2026 workbooks",
  href: "https://www.ice.gov/detain/detention-management",
  asOf: "FY2026 workbook dated 20 July 2026",
  note:
    "Average daily population across all ICE detention facility types. FY2026 covers October 2025 through July 2026 only. These are totals for everyone in ICE detention — the overwhelming majority of whom are not lawful permanent residents, and the published data does not break the population down by immigration status, so it cannot be read as a measure of risk to a returning green card holder.",
} as const;

/** The honest reading, stated once and not editorialised. */
export const ICE_ADP_READING =
  "The detention population has roughly tripled from its FY2021 low and is at the highest level in the published series. That is a fact about enforcement capacity and activity overall. What it is not is a per-person risk figure for a returning permanent resident, because ICE does not publish the population by immigration status and because the legal test for a returning resident has not changed: INA 101(a)(13)(C) still decides whether a trip is an ordinary re-entry or something else. The practical response is the same as it has always been — know which side of that line your trip falls on, carry the evidence, and get advice before you travel if any of the six conditions could be in play.";
