/**
 * A-Number (Alien Registration Number) data, the six identifiers it gets
 * confused with, and the federal alien-registration requirement.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVENANCE — read before editing
 *
 * The registration rules are quoted from 8 CFR 264.1, read from the eCFR
 * title-8 API at issue date 2026-10-08, plus the USCIS Alien Registration
 * Requirement page. Fee figures come from Form G-1055, edition 10/07/26.
 *
 * THE POINT OF THE REGISTRATION SECTION. 8 CFR 264.1(a) lists the forms that
 * ARE registration forms, and (b) lists the documents that CONSTITUTE evidence
 * of registration. The I-94 is on both lists and the I-551 is on the second.
 * That means the overwhelming majority of NRI readers — anyone admitted on a
 * visa with an I-94, anyone holding a green card — are already registered and
 * have nothing to file. Every competitor page answers "who must register"; the
 * question the traffic has is "does this apply to me", and for most readers the
 * answer is no. Do not let an edit turn this into a scare page.
 *
 * NO REAL IDENTIFIERS. Every example number in this file is invented and is
 * deliberately shaped so it cannot be a live record: the A-number examples use
 * the reserved-looking 000 prefix, and the receipt-number example uses a
 * service-centre prefix with an obviously sequential tail. Never replace one
 * with a number from a real document.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal or immigration advice.
 */

export const A_NUMBER_VERIFIED = "2026-10-13";
export const A_NUMBER_UPDATED = "2026-10-13";
export const A_NUMBER_PUBLISHED = "2026-10-13";

export const A_NUMBER_SOURCES = {
  cfr264: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-264",
  uscisRegistration: "https://www.uscis.gov/alienregistration",
  g325r: "https://www.uscis.gov/forms/all-forms/g-325r",
  registrationRule:
    "https://www.federalregister.gov/documents/2025/03/12/2025-03944/alien-registration-form-and-evidence-of-registration",
  ina262: "https://www.law.cornell.edu/uscode/text/8/1302",
  ina264: "https://www.law.cornell.edu/uscode/text/8/1304",
  feeSchedule: "https://www.uscis.gov/g-1055",
  g639: "https://www.uscis.gov/g-639",
  myUscis: "https://my.uscis.gov/",
  glossary: "https://www.uscis.gov/tools/glossary",
} as const;

/* ══════════════════ 1. What the number is ═══════════════════════════════ */

export const A_NUMBER_BASICS = {
  fullName: "Alien Registration Number",
  alsoCalled: ["A-Number", "A#", "USCIS #", "Alien Number", "Registration Number"],
  what:
    "A unique number attached to your alien-registration record. It identifies the person, for life, across every case and every agency — which is what makes it different from a receipt number, a case number or an account number, all of which identify a transaction or a login.",
  format: "The letter A followed by 8 or 9 digits.",
  examples: ["A000123456", "A00012345"],
  exampleNote:
    "Both example numbers above are invented. Older records carry 8 digits; numbers issued more recently carry 9.",
  zeroPadding:
    "If a form or an online field demands 9 digits and your number has 8, add a leading zero after the A. A000-123-456 and A00123456 are the same number written two ways; the digits are what matter, and the hyphens and the A are formatting.",
  whoGetsOne:
    "Not everyone. You get an A-number when USCIS or the State Department creates an immigration record for you — a green card, an Employment Authorization Document, an immigrant visa, a removal case, an asylum application, certain other filings. Plenty of people in lawful status for years have never had one: an H-1B or F-1 holder who has never filed for an EAD or a green card typically has no A-number at all, and that is normal rather than a problem.",
  sensitivity:
    "Treat it like a national ID number, because that is what it functions as. It is the key to your immigration file. Share it with your own attorney, your employer's attorney and the agency asking for it on a form — not in a forum post, not with a service that offers to check your case for a fee, and not in a screenshot.",
} as const;

/* ══════════════════ 2. Where it is printed ══════════════════════════════ */

export interface DocumentLocation {
  doc: string;
  label: string;
  where: string;
  note?: string;
  /** Does this document always carry an A-number? */
  always: boolean;
}

export const A_NUMBER_LOCATIONS: DocumentLocation[] = [
  {
    doc: "Green card (Form I-551)",
    label: "USCIS #",
    where:
      "On the front, in the block of text beside your photograph, labelled USCIS #. The digits also appear inside the machine-readable zone on the back.",
    note: "On a current-design card the A prefix is not printed — the label reads USCIS # and the digits follow.",
    always: true,
  },
  {
    doc: "Employment Authorization Document (EAD)",
    label: "USCIS #",
    where: "On the front of the card, beneath the label USCIS #.",
    always: true,
  },
  {
    doc: "Immigrant visa foil in your passport",
    label: "Registration Number",
    where:
      "In the upper portion of the visa foil, labelled Registration Number. This is your A-number.",
    note:
      "Only an IMMIGRANT visa carries this. A nonimmigrant visa foil — H-1B, L-1, B-1/B-2, F-1 — does not, and the number printed on it is a visa control number, which is a different thing entirely.",
    always: true,
  },
  {
    doc: "Immigrant Data Summary",
    label: "A-Number",
    where:
      "At the top of the sheet. If you did consular processing, this came stapled to the front of the sealed immigrant visa package handed to you at the consulate in Delhi, Mumbai, Chennai, Hyderabad or Kolkata.",
    always: true,
  },
  {
    doc: "Form I-797 notices",
    label: "A# or USCIS #",
    where: "Upper-right area of the notice, beside the receipt number.",
    note:
      "Not every I-797 shows one. An H-1B approval notice for someone with no immigration record typically has a receipt number and no A-number. An I-485 or I-765 notice almost always has both.",
    always: false,
  },
  {
    doc: "Biometrics appointment notice (Form I-797C)",
    label: "A#",
    where: "In the header block with the application type and the appointment details.",
    always: false,
  },
  {
    doc: "USCIS online account",
    label: "A-Number",
    where:
      "Under your profile or on the case page, where USCIS has associated a number with your account.",
    note: "A reliable place to look if the card is not to hand.",
    always: false,
  },
  {
    doc: "Form I-94 record",
    label: "Not shown",
    where:
      "An I-94 does not display your A-number. It carries its own 11-digit admission record number.",
    note:
      "Worth knowing because the I-94 is where people look first. It is also, under 8 CFR 264.1, your registration record — the number on it just is not the A-number.",
    always: false,
  },
];

/* ══════════════════ 3. The six numbers ══════════════════════════════════ */

export interface NumberType {
  id: string;
  name: string;
  shape: string;
  example: string;
  identifies: string;
  issuedBy: string;
  whereFound: string;
  lifetime: string;
  sensitive: "high" | "medium" | "low";
  /** Where the site explains this one in depth, if anywhere. */
  ownerPath?: string;
  /** Regex-ish description used by the identifier tool. */
  pattern: RegExp;
}

/**
 * Six identifiers, one table. Four of them appear somewhere in the organic
 * results for this keyword; all six together appear nowhere, and the visa
 * control number — the one Indian applicants are asked for at VFS — is the
 * one that is always missing.
 *
 * `pattern` drives the "which number is this?" tool. The tool matches on
 * SHAPE only and never transmits or stores what is typed.
 */
export const NUMBER_TYPES: NumberType[] = [
  {
    id: "a-number",
    name: "A-Number (Alien Registration Number)",
    shape: "A + 8 or 9 digits",
    example: "A000123456",
    identifies: "You, as a person, for life",
    issuedBy: "USCIS or the Department of State",
    whereFound: "Green card, EAD, immigrant visa foil, many I-797 notices",
    lifetime: "Permanent — one number, however many cases you file",
    sensitive: "high",
    pattern: /^A?0*\d{7,9}$/i,
  },
  {
    id: "receipt-number",
    name: "USCIS receipt number",
    shape: "3 letters + 10 digits",
    example: "LIN0000000001",
    identifies: "One specific application or petition",
    issuedBy: "USCIS, when it accepts a filing",
    whereFound: "Top of any Form I-797 receipt or approval notice",
    lifetime: "One case. A new filing gets a new number",
    sensitive: "high",
    ownerPath: "/uscis/receipt-number",
    // The prefixes /uscis/receipt-number decodes. That page is the owner; keep
    // the two in step rather than inventing a longer list here.
    pattern: /^(IOE|LIN|SRC|EAC|WAC|MSC|NBC)\d{10}$/i,
  },
  {
    id: "online-account",
    name: "USCIS online account number",
    shape: "12 digits",
    example: "000000000001",
    identifies: "Your myUSCIS login, not you and not a case",
    issuedBy: "USCIS, when you create an account at my.uscis.gov",
    whereFound: "Inside your myUSCIS account profile",
    lifetime: "As long as the account exists",
    sensitive: "medium",
    ownerPath: "/uscis/online-account-number",
    pattern: /^\d{12}$/,
  },
  {
    id: "i94-number",
    name: "I-94 admission record number",
    shape: "11 digits",
    example: "00000000001",
    identifies: "One admission to the United States",
    issuedBy: "CBP, at the port of entry",
    whereFound: "Your I-94 record at i94.cbp.dhs.gov, or the tear-off on an I-797A",
    lifetime: "One entry. Every admission generates a new one",
    sensitive: "medium",
    ownerPath: "/uscis/i-94",
    pattern: /^\d{11}$/,
  },
  {
    id: "sevis-id",
    name: "SEVIS ID",
    shape: "N + 10 digits",
    example: "N0001234567",
    identifies: "Your student or exchange-visitor record",
    issuedBy: "SEVP, through your school or programme sponsor",
    whereFound: "Top-left of your Form I-20 or DS-2019",
    lifetime: "The life of that student record",
    sensitive: "medium",
    ownerPath: "/education/sevis-termination-guide",
    pattern: /^N\d{10}$/i,
  },
  {
    id: "visa-control",
    name: "Visa control number (visa foil number)",
    shape: "8 digits, often red, on the visa foil",
    example: "00012345",
    identifies: "The physical visa sticker in your passport",
    issuedBy: "The Department of State, at the consulate",
    whereFound: "On the visa foil itself — lower right on most foils",
    lifetime: "That one visa. A new visa gets a new number",
    sensitive: "medium",
    pattern: /^\d{8}$/,
  },
];

export const NUMBER_TYPES_NOTE =
  "Every example number above is invented and deliberately shaped so it cannot be a live record.";

/* ══════════════════ 4. Alien registration ═══════════════════════════════ */

export const REGISTRATION = {
  statute: "INA 262 and 264 (8 U.S.C. 1302, 1304)",
  cfr: "8 CFR 264.1",
  ruleHistory: [
    {
      date: "2025-03-12",
      what:
        "DHS published an interim final rule, Alien Registration Form and Evidence of Registration, designating Form G-325R as a registration form and setting out the evidence of registration.",
    },
    {
      date: "2026-06-29",
      what:
        "DHS adopted the 2025 interim rule as a final rule with procedural and technical changes, and updated the list of forms that satisfy the requirement. Anyone required to register who has not yet done so continues to use Form G-325R.",
    },
    {
      date: "2026-09-04",
      what:
        "A separate interim final rule addressed registration for certain United States-born children of foreign government employees. Given the injunction in Casa Inc. v. Trump, No. 8:25-cv-00201 (D. Md., 2 September 2026), DHS has said it will not implement that rule for any member of the certified class unless it obtains relief from the injunction. This affects a narrow group and not the general requirement.",
    },
  ],
  whoMustRegister: [
    "You are 14 or older, were not registered and fingerprinted when you applied for a US visa, and you remain in the United States for 30 days or longer",
    "You are the parent or legal guardian of someone under 14 who has to register — you register them, through their own USCIS account",
    "You have turned 14 and were previously registered — you must apply for re-registration and fingerprinting within 30 days of your 14th birthday, under 8 CFR 264.1(g)",
  ],
  perTrip:
    "The requirement attaches to each stay of 30 days or more, so it is a question to ask about each entry rather than once in a lifetime.",
  deadline:
    "Before the 30 days run out. The clock is the length of the stay, not the date you discover the rule.",
  /** The bit everyone needs and nobody writes. */
  alreadyRegistered: [
    "You were admitted as a nonimmigrant and issued a Form I-94, I-94A or I-94W — paper or electronic — even if the admission period has since expired",
    "You hold a Permanent Resident Card (Form I-551)",
    "You were issued an Employment Authorization Document",
    "You were admitted on a visa issued by the Department of State and used that visa at your most recent arrival",
    "You hold another document the regulation designates as evidence of registration",
    "You have an application on file that is itself a registration form — Form I-485 is one",
  ],
  alreadyRegisteredCite: "8 CFR 264.1(a) and (b)",
  alreadyRegisteredPlain:
    "This is the part that matters for most readers of this page. 8 CFR 264.1 makes the I-94 both a registration form and evidence of registration, and the green card evidence of registration. If you flew in on an H-1B, H-4, L-1, F-1 or B-1/B-2 visa and have an I-94, or you hold a green card or an EAD, you are already registered and there is nothing to file. USCIS also publishes a determination tool on its own registration page if you want to check your specific facts.",
  exemptions: [
    "US citizens and nationals",
    "Anyone outside the United States",
    "Anyone in the United States for less than 30 days",
    "Certain diplomats and people affiliated with international organisations",
    "Anyone already registered for their current stay — unless they have turned 14 and owe re-registration",
  ],
  /** Who is actually left. */
  whoIsLeft:
    "Strip out everyone already registered and the group that genuinely has to file G-325R is small and specific: people who entered without a visa and without being issued an I-94, which in practice means long-staying Canadian visitors who crossed by land, plus people who entered without inspection and children who were born or turned 14 here without an immigration record of their own. If the news about registration reached you and you hold a visa and an I-94, it was not about you.",
  carryDuty:
    "Anyone issued evidence of registration must carry it and have it with them at all times.",
  carryDutyCite: "INA 264(e)",
  notStatus:
    "Registration is not an immigration status. Registration documentation does not create a status, does not establish employment authorization, and does not provide any other right or benefit under the INA or any other US law. It is a record-keeping duty, and completing it changes nothing else about your situation.",
  penalties:
    "Failing to comply can carry criminal and civil penalties. The statute, not USCIS guidance, sets them.",
  howToFile: [
    "Create a USCIS online account at my.uscis.gov — the person registering needs their own account, including a child under 14, whose account a parent or guardian creates in the child's name",
    "Complete Form G-325R inside that account. It is filed online only; there is no paper route",
    "Attend a biometrics appointment if USCIS schedules one",
    "Keep the proof of registration USCIS issues, and carry it",
  ],
  formEdition: "09/04/26",
  fee: "$0",
  feeNote: "Form G-325R carries no filing fee on the current fee schedule.",
} as const;

/* ══════════════════ 5. When you cannot find it ══════════════════════════ */

export interface RecoveryRoute {
  situation: string;
  action: string;
  cost: string;
  time: string;
  note?: string;
}

export const RECOVERY_ROUTES: RecoveryRoute[] = [
  {
    situation: "You have the card but cannot read the number",
    action: "Look for the label USCIS # on the front of a green card or EAD.",
    cost: "$0",
    time: "Immediate",
    note: "The A prefix is not printed on current card designs — the digits after USCIS # are the number.",
  },
  {
    situation: "You do not have the card to hand",
    action:
      "Sign in to your USCIS online account. Where USCIS has associated a number with the account it appears in your profile or on the case page.",
    cost: "$0",
    time: "Immediate",
    note: "Also check any I-797 notice you have saved, and the immigrant visa foil in an old passport.",
  },
  {
    situation: "Your green card is lost, stolen or damaged",
    action: "File Form I-90 to replace it.",
    cost: "$465 paper, $415 online",
    time: "Check the current USCIS processing times for Form I-90",
    note: "No fee if USCIS issued a card you never received and it came back undeliverable, or if the card was issued with wrong information because of a DHS error.",
  },
  {
    situation: "You have no document at all that carries it",
    action:
      "File Form G-639, a Freedom of Information Act request, for your own immigration file. The file contains the number.",
    cost: "$0",
    time: "FOIA processing times vary widely — plan in months, not weeks",
  },
  {
    situation: "Two different A-numbers appear on your documents",
    action:
      "Do not pick one. Tell USCIS in writing, through your attorney or on the next filing, that there are two records and give both numbers with the documents each appears on, so the records can be consolidated.",
    cost: "$0",
    time: "Depends on the case",
    note:
      "It happens, usually when a second record was created before the first was found — a childhood case and an adult one, or a name recorded differently in Hindi or a regional language and then transliterated two ways. Filing under one number while a case sits under the other is how people end up with an approval attached to a record that has their other history in it.",
  },
  {
    situation: "A form demands 9 digits and yours has 8",
    action: "Add a leading zero after the A.",
    cost: "$0",
    time: "Immediate",
  },
];

/* ══════════════════ 6. India-specific confusions ════════════════════════ */

export const INDIA_NOTES = [
  {
    title: "The immigrant visa foil versus the nonimmigrant visa foil",
    body:
      "The immigrant visa issued at a US consulate in India carries a field labelled Registration Number, and that is your A-number. The nonimmigrant visa foil for an H-1B, L-1, F-1 or B-1/B-2 carries a visa control number, which identifies the sticker and not you. People hand over the control number when a form asks for an A-number, and the filing comes back.",
  },
  {
    title: "An OCI card number is not a US identifier",
    body:
      "An OCI card number, a PIO number and an Indian passport file number belong to Indian systems. None of them is an A-number and none of them belongs on a USCIS form. The same is true in reverse: your A-number has no place on an Indian consular or VFS application.",
  },
  {
    title: "Transliteration is the usual cause of a duplicate record",
    body:
      "A name recorded one way on a school certificate and another way on a passport, or a surname that appears first on one document and last on another, is the most common route to two immigration records for one person. It is worth checking consistency across your documents before a green card filing rather than after.",
  },
  {
    title: "What VFS and the consulate actually ask for",
    body:
      "For Indian visa and OCI services through VFS, the identifiers in play are your Indian passport number, the VFS reference and, for an OCI application, your US green card details. Your A-number is not part of that process, and the green card number you are asked for is the USCIS # on the card.",
  },
] as const;
