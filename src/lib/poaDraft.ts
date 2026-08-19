/**
 * Draft-letter builder for the POA generator on
 * /power-of-attorney-for-india-from-usa.
 *
 * Pure and framework-agnostic (poaDraft.test.ts covers it). The component
 * only renders what these functions return — no drafting logic in JSX.
 *
 * PRIVACY: every field here is sensitive (passport, PAN, Aadhaar, bank
 * account, home addresses). Nothing in this module performs I/O. The whole
 * draft is assembled in the browser tab, and the component is forbidden from
 * passing any of these values to analytics.
 *
 * THESE ARE DISCUSSION DRAFTS, NOT DEEDS. Every document produced carries the
 * banner below so the warning cannot be separated from the wording — a filled
 * draft looks far more "final" than a bracketed skeleton, which makes the
 * banner more important here, not less.
 */
import type { LetterParagraph } from "@/lib/invitationLetter";

export type PoaDocType = "sale" | "purchase" | "manage" | "revocation";

export const DOC_TYPES: { value: PoaDocType; label: string; blurb: string }[] = [
  {
    value: "sale",
    label: "Sell a property",
    blurb:
      "Special POA authorising your attorney to execute the sale deed, present it for registration, admit execution and receive the consideration into your NRO account.",
  },
  {
    value: "purchase",
    label: "Buy & register a property",
    blurb:
      "Special POA to sign as purchaser, pay stamp duty and registration fees, take possession and move the khata into your name.",
  },
  {
    value: "manage",
    label: "Rent out & manage",
    blurb:
      "Special POA limited to letting, rent collection and outgoings, with an express bar on sale, mortgage and gift.",
  },
  {
    value: "revocation",
    label: "Revoke an existing POA",
    blurb:
      "Deed of Revocation cancelling a power of attorney you granted earlier, executed and attested the same way as the original.",
  },
];

export interface PoaDraftFields {
  /* Principal (you) */
  principalName: string;
  principalRelation: string; // son/daughter/wife of
  principalParent: string;
  principalAge: string;
  passportType: string; // "Indian" | "United States" | "Other"
  /** Only used when passportType is "Other". */
  passportCountry: string;
  passportNo: string;
  ociNo: string;
  pan: string;
  usAddress: string;

  /* Attorney */
  attorneyName: string;
  attorneyRelationship: string;
  attorneyAge: string;
  attorneyAadhaar: string;
  attorneyPan: string;
  attorneyAddress: string;

  /* Property */
  propertySchedule: string;
  subRegistrar: string;

  /* Commercials */
  minPrice: string; // sale
  maxPrice: string; // purchase
  rentMin: string; // manage
  leaseMonths: string; // manage
  repairCap: string; // manage
  bankName: string;
  bankBranch: string;
  nroAccount: string;

  /* Term */
  startDate: string;
  endDate: string;

  /* Execution */
  executionCity: string;
  executionState: string;
  executionDate: string;
  witness1Name: string;
  witness1Address: string;
  witness2Name: string;
  witness2Address: string;

  /* Revocation-only */
  originalPoaDate: string;
  originalPoaRegNo: string;
  originalPoaRegOffice: string;
  revocationEffective: string;
  newspaper: string;
}

export const EMPTY_POA_DRAFT: PoaDraftFields = {
  principalName: "",
  principalRelation: "son",
  principalParent: "",
  principalAge: "",
  passportType: "Indian",
  passportCountry: "",
  passportNo: "",
  ociNo: "",
  pan: "",
  usAddress: "",
  attorneyName: "",
  attorneyRelationship: "",
  attorneyAge: "",
  attorneyAadhaar: "",
  attorneyPan: "",
  attorneyAddress: "",
  propertySchedule: "",
  subRegistrar: "",
  minPrice: "",
  maxPrice: "",
  rentMin: "",
  leaseMonths: "",
  repairCap: "",
  bankName: "",
  bankBranch: "",
  nroAccount: "",
  startDate: "",
  endDate: "",
  executionCity: "",
  executionState: "",
  executionDate: "",
  witness1Name: "",
  witness1Address: "",
  witness2Name: "",
  witness2Address: "",
  originalPoaDate: "",
  originalPoaRegNo: "",
  originalPoaRegOffice: "",
  revocationEffective: "",
  newspaper: "",
};

export const RELATION_OPTIONS = ["son", "daughter", "wife", "husband"];
export const PASSPORT_TYPE_OPTIONS = ["Indian", "United States", "Other"];

/** Trim; fall back to an obvious bracketed placeholder when empty. */
const v = (value: string, placeholder: string): string => {
  const t = (value ?? "").trim().replace(/\s+/g, " ");
  return t.length > 0 ? t : `[${placeholder}]`;
};

/** True when the field has real content (used for completeness scoring). */
const has = (value: string): boolean => (value ?? "").trim().length > 0;

export const DRAFT_BANNER =
  "SPECIMEN / DISCUSSION DRAFT ONLY - NOT A DEED. Do not sign this document. It is an educational starting point to hand to an advocate in the Indian state where the property is situated, who must settle the wording, the stamp article, the schedule and the attestation clause for your facts and that state's registry practice.";

/** Fields that matter for each document type, in the order the form shows them. */
export const REQUIRED_BY_TYPE: Record<PoaDocType, (keyof PoaDraftFields)[]> = {
  sale: [
    "principalName", "passportNo", "usAddress",
    "attorneyName", "attorneyAddress",
    "propertySchedule", "subRegistrar",
    "minPrice", "bankName", "nroAccount",
    "endDate", "executionCity",
  ],
  purchase: [
    "principalName", "passportNo", "usAddress",
    "attorneyName", "attorneyAddress",
    "propertySchedule", "subRegistrar",
    "maxPrice",
    "endDate", "executionCity",
  ],
  manage: [
    "principalName", "passportNo", "usAddress",
    "attorneyName", "attorneyAddress",
    "propertySchedule",
    "rentMin", "leaseMonths", "bankName", "nroAccount",
    "endDate", "executionCity",
  ],
  revocation: [
    "principalName", "passportNo", "usAddress",
    "attorneyName", "attorneyAddress",
    "originalPoaDate", "originalPoaRegOffice",
    "revocationEffective", "executionCity",
  ],
};

export interface DraftProgress {
  filled: number;
  total: number;
  pct: number;
  ready: boolean;
}

export function draftProgress(type: PoaDocType, f: PoaDraftFields): DraftProgress {
  const keys = REQUIRED_BY_TYPE[type];
  const filled = keys.filter((k) => has(f[k])).length;
  const total = keys.length;
  return {
    filled,
    total,
    pct: total === 0 ? 0 : Math.round((filled / total) * 100),
    ready: filled === total,
  };
}

/* ── Shared blocks ───────────────────────────────────────────────────────── */

/**
 * "holder of X passport No. Y" — the passport phrase.
 *
 * Selecting "Other" must never print the literal word "Other" onto a deed, so
 * that branch either names the issuing country or falls back to a bracketed
 * placeholder the advocate can see and fill.
 */
function passportPhrase(f: PoaDraftFields): string {
  const no = v(f.passportNo, "PASSPORT NO.");
  if (f.passportType.trim() === "Other") {
    return has(f.passportCountry)
      ? `holder of ${f.passportCountry.trim()} passport No. ${no}`
      : `holder of passport No. ${no} issued by [COUNTRY OF ISSUE]`;
  }
  return `holder of ${v(f.passportType, "Indian/United States")} passport No. ${no}`;
}

function principalBlock(f: PoaDraftFields): string {
  const oci = has(f.ociNo) ? `OCI Card No. ${f.ociNo.trim()}, ` : "";
  const pan = has(f.pan) ? `Permanent Account Number ${f.pan.trim()}, ` : "";
  return `I, ${v(f.principalName, "FULL NAME EXACTLY AS ON THE TITLE DEED")}, ${v(
    f.principalRelation,
    "son/daughter/wife",
  )} of ${v(f.principalParent, "FATHER'S / HUSBAND'S NAME")}, aged about ${v(
    f.principalAge,
    "AGE",
  )} years, ${passportPhrase(f)}, ${oci}${pan}presently residing at ${v(
    f.usAddress,
    "FULL US ADDRESS, CITY, STATE, ZIP, USA",
  )}`;
}

function attorneyBlock(f: PoaDraftFields): string {
  const aadhaar = has(f.attorneyAadhaar) ? `Aadhaar No. ${f.attorneyAadhaar.trim()}, ` : "";
  const pan = has(f.attorneyPan) ? `PAN ${f.attorneyPan.trim()}, ` : "";
  const rel = has(f.attorneyRelationship) ? `my ${f.attorneyRelationship.trim()}, ` : "";
  return `${v(f.attorneyName, "FULL NAME OF ATTORNEY")}, ${rel}aged about ${v(
    f.attorneyAge,
    "AGE",
  )} years, ${aadhaar}${pan}residing at ${v(f.attorneyAddress, "FULL INDIAN ADDRESS")}`;
}

function accountPhrase(f: PoaDraftFields): string {
  return `NRO account No. ${v(f.nroAccount, "ACCOUNT NO.")} with ${v(
    f.bankName,
    "BANK NAME",
  )}, ${v(f.bankBranch, "BRANCH")}`;
}

/**
 * Termination clause. A sale or purchase POA has a natural completion point;
 * a standing management POA does not, so "whichever is earlier" is dropped
 * there rather than left as an incoherent trigger.
 */
function termClause(f: PoaDraftFields, hasCompletionPoint = true): string {
  const start = v(f.startDate, "START DATE");
  const end = v(f.endDate, "END DATE");
  const trigger = hasCompletionPoint
    ? ` or upon completion of the acts authorised above, whichever is earlier,`
    : ",";
  return `THIS POWER OF ATTORNEY shall come into force on ${start} and shall stand automatically revoked on ${end}${trigger} unless expressly extended by me in writing executed and attested in the same manner as this instrument.`;
}

/** Ratification clause — clause 09 of the page's "Ten Clauses" section. */
const RATIFICATION =
  "I HEREBY RATIFY and confirm all lawful acts done by the Attorney strictly within the powers expressly granted above, and nothing beyond them.";

/** The attorney's own acceptance of the appointment and its limits. */
const acceptanceBlock = (f: PoaDraftFields): string[] => [
  `I, ${v(f.attorneyName, "ATTORNEY NAME")}, accept the above appointment and the limits placed on it.`,
  "ATTORNEY: ________________________    [Affix photograph where the State requires it]",
];

function executionBlock(f: PoaDraftFields, label: string): string[] {
  return [
    `IN WITNESS WHEREOF I have signed this ${label} at ${v(
      f.executionCity,
      "CITY",
    )}, ${v(f.executionState, "STATE")}, USA on ${v(f.executionDate, "DATE")}, in the presence of the witnesses below.`,
    `PRINCIPAL: ________________________    ${v(f.principalName, "NAME")}`,
    `[Affix passport photograph above and sign across it]`,
    `WITNESS 1: ________________________    Name: ${v(f.witness1Name, "FULL NAME")}    Address: ${v(
      f.witness1Address,
      "FULL ADDRESS",
    )}`,
    `WITNESS 2: ________________________    Name: ${v(f.witness2Name, "FULL NAME")}    Address: ${v(
      f.witness2Address,
      "FULL ADDRESS",
    )}`,
    `(Witnesses must not be the Principal's spouse or blood relatives.)`,
    `[NOTARIAL ACKNOWLEDGMENT BLOCK - completed by the US Notary Public]`,
    `[CONSULAR ATTESTATION by the Indian Mission, or SECRETARY OF STATE APOSTILLE, to be affixed]`,
  ];
}

const scheduleBlock = (f: PoaDraftFields): string[] => [
  "THE SCHEDULE ABOVE REFERRED TO",
  has(f.propertySchedule)
    ? f.propertySchedule.trim()
    : "[Flat/Plot No., floor, building or project name, survey / CTS no., extent and built-up area, boundaries north / south / east / west, khata or property tax assessment no., village / taluka / district, State, and the registered document no., book, volume and date under which the Principal holds title.]",
];

/* ── The four documents ──────────────────────────────────────────────────── */

function saleDoc(f: PoaDraftFields): string[] {
  return [
    "SPECIAL POWER OF ATTORNEY",
    `KNOW ALL PERSONS BY THESE PRESENTS that ${principalBlock(f)} (hereinafter "the Principal"),`,
    `DO HEREBY APPOINT ${attorneyBlock(
      f,
    )} (hereinafter "the Attorney"), to be my true and lawful attorney, to do the following acts and NO OTHERS, in my name and on my behalf, in respect ONLY of the immovable property described in the Schedule below:`,
    `1. To negotiate and agree the sale of the Schedule Property at a consideration of not less than ${v(
      f.minPrice,
      "MINIMUM PRICE IN WORDS AND FIGURES",
    )}.`,
    "2. To execute and sign the agreement to sell and the sale deed in respect of the Schedule Property in my name.",
    `3. To present the said sale deed for registration before the Sub-Registrar of Assurances at ${v(
      f.subRegistrar,
      "PLACE",
    )}, to admit execution thereof, and to do all acts required under the Registration Act, 1908 for its registration.`,
    `4. To receive the sale consideration ONLY by way of credit to my ${accountPhrase(
      f,
    )}, and to issue receipts for the same.`,
    "5. To deliver vacant physical possession of the Schedule Property to the purchaser upon registration of the sale deed AND receipt of the entire consideration in the said account.",
    "6. To apply for and obtain mutation, khata transfer and change of name in the records of the municipal authority, the electricity and water utilities and the society or association.",
    "7. To apply for, pursue and receive a certificate under Section 197 of the Income-tax Act, 1961 for deduction of tax at a lower rate in respect of this sale, to collect Form 16A and the TDS certificate from the purchaser, and to sign the related applications and acknowledgements.",
    "8. To sign, verify and file such applications, indemnities, affidavits and undertakings before any authority as are strictly necessary to complete the acts numbered 1 to 7 above.",
    "THE ATTORNEY SHALL NOT, and this instrument confers no power whatsoever to: (a) mortgage, charge, gift, exchange, settle or otherwise encumber the Schedule Property; (b) enter into any development agreement or joint-venture arrangement in respect of it; (c) sell the Schedule Property at a consideration below the minimum stated in clause 1; (d) receive any part of the consideration in cash, or into any account other than the account named in clause 4; (e) delegate or substitute any of these powers to any other person; or (f) act in respect of any property of mine other than the Schedule Property.",
    termClause(f),
    RATIFICATION,
    ...scheduleBlock(f),
    ...executionBlock(f, "Special Power of Attorney"),
    ...acceptanceBlock(f),
  ];
}

function purchaseDoc(f: PoaDraftFields): string[] {
  return [
    "SPECIAL POWER OF ATTORNEY (PURCHASE AND REGISTRATION)",
    `KNOW ALL PERSONS BY THESE PRESENTS that ${principalBlock(f)} (the "Principal"),`,
    `DO HEREBY APPOINT ${attorneyBlock(
      f,
    )} (the "Attorney"), to act for me in respect ONLY of the acquisition of the property described in the Schedule below, and to:`,
    `1. Execute and sign, as purchaser and in my name, the agreement to sell and the sale deed for the Schedule Property at a consideration NOT EXCEEDING ${v(
      f.maxPrice,
      "MAXIMUM PRICE IN WORDS AND FIGURES",
    )}.`,
    "2. Pay stamp duty, registration fee and incidental charges out of funds remitted by me through banking channels, and obtain receipts in my name.",
    "3. Deduct and deposit tax at source where required by law, and file the prescribed challan-cum-statement in my name.",
    `4. Present the sale deed for registration before the Sub-Registrar of Assurances at ${v(
      f.subRegistrar,
      "PLACE",
    )} and admit execution.`,
    "5. Take delivery of vacant possession and receive the original title documents on my behalf.",
    "6. Apply for mutation, khata transfer and utility name changes in my name, and sign the society's membership and share-transfer forms.",
    "7. Sign such affidavits, indemnities and undertakings as are strictly necessary to complete the acts above.",
    "THE ATTORNEY SHALL NOT: agree a consideration above the cap in clause 1; pay any part of the consideration in cash; mortgage, charge or create any encumbrance on the Schedule Property; resell, gift or transfer it; delegate these powers; or act in respect of any other property.",
    termClause(f),
    RATIFICATION,
    ...scheduleBlock(f),
    ...executionBlock(f, "Special Power of Attorney"),
    ...acceptanceBlock(f),
  ];
}

function manageDoc(f: PoaDraftFields): string[] {
  return [
    "SPECIAL POWER OF ATTORNEY (PROPERTY MANAGEMENT ONLY)",
    `KNOW ALL PERSONS BY THESE PRESENTS that ${principalBlock(f)} (the "Principal"),`,
    `DO HEREBY APPOINT ${attorneyBlock(
      f,
    )} (the "Attorney"), to act for me in respect ONLY of the property in the Schedule below, and to:`,
    `1. Advertise, negotiate, sign and register leave-and-licence or lease agreements for a term NOT EXCEEDING ${v(
      f.leaseMonths,
      "NUMBER",
    )} months at a rent of not less than ${v(f.rentMin, "AMOUNT")} per month.`,
    `2. Collect rent, deposits and maintenance ONLY by credit to my ${accountPhrase(f)}, and issue receipts.`,
    "3. Pay property tax, society maintenance, utility bills and insurance premia in respect of the Schedule Property out of the said account.",
    "4. Attend meetings of, correspond with, and represent me before the society or association and the municipal authority.",
    `5. Arrange repairs and maintenance up to ${v(
      f.repairCap,
      "AMOUNT",
    )} per instance, and beyond that only with my prior written approval.`,
    "6. Take steps to recover possession from a defaulting or holding-over tenant, including instructing counsel.",
    "THE ATTORNEY SHALL NOT, under any circumstances: sell, agree to sell, gift, exchange, mortgage, charge or otherwise encumber the Schedule Property; enter into any development or redevelopment agreement; grant any lease exceeding the term in clause 1; receive any amount in cash or into any other account; or delegate these powers.",
    termClause(f, false),
    RATIFICATION,
    ...scheduleBlock(f),
    ...executionBlock(f, "Special Power of Attorney"),
    ...acceptanceBlock(f),
  ];
}

function revocationDoc(f: PoaDraftFields): string[] {
  /* A POA is not always registered, and the form says so ("leave blank if it
     was never registered"). Asserting registration anyway would put a false
     statement on the face of a deed the user may sign — and print a raw
     [PLACE] into it. So the registration language appears only when the user
     actually supplied registration details. */
  const regNo = f.originalPoaRegNo.trim();
  const sro = f.originalPoaRegOffice.trim();
  const wasRegistered = Boolean(regNo || sro);

  let reg = "";
  if (regNo) {
    reg = ` and registered as document No. ${regNo} at the office of the Sub-Registrar at ${v(
      f.originalPoaRegOffice,
      "PLACE",
    )}`;
  } else if (sro) {
    reg = `, AND registered at the office of the Sub-Registrar at ${sro}`;
  }

  const noticeDeclaration = wasRegistered
    ? `I FURTHER DECLARE that this revocation is being registered at the office of the Sub-Registrar at ${v(
        f.originalPoaRegOffice,
        "PLACE",
      )} where the said Power of Attorney was registered, that written notice of this revocation is being served on the said attorney, and that public notice is being published in ${v(
        f.newspaper,
        "NEWSPAPER",
      )}.`
    : `I FURTHER DECLARE that the said Power of Attorney was not registered, that written notice of this revocation is being served on the said attorney, and that public notice is being published in ${v(
        f.newspaper,
        "NEWSPAPER",
      )}.`;

  return [
    "DEED OF REVOCATION OF POWER OF ATTORNEY",
    `KNOW ALL PERSONS BY THESE PRESENTS that ${principalBlock(f)} (the "Principal"),`,
    `WHEREAS by a Power of Attorney dated ${v(
      f.originalPoaDate,
      "DATE OF ORIGINAL POA",
    )}, executed by me and attested or apostilled in the United States${reg} (the "said Power of Attorney"), I appointed ${v(
      f.attorneyName,
      "ATTORNEY NAME",
    )}, residing at ${v(f.attorneyAddress, "FULL INDIAN ADDRESS")}, as my attorney;`,
    "AND WHEREAS I no longer require the said Power of Attorney to remain in force;",
    `NOW THEREFORE I HEREBY REVOKE, CANCEL AND WITHDRAW the said Power of Attorney in its entirety with effect from ${v(
      f.revocationEffective,
      "EFFECTIVE DATE",
    )}, together with every power, authority and discretion conferred by it.`,
    `I DECLARE that the said ${v(
      f.attorneyName,
      "ATTORNEY NAME",
    )} shall have no authority whatsoever, from the effective date, to act for me or in my name in any manner, and that I shall not be bound by any act, deed or thing done by him or her on or after that date.`,
    noticeDeclaration,
    "I confirm that the said Power of Attorney was not coupled with any interest in favour of the attorney within the meaning of Section 202 of the Indian Contract Act, 1872. [Delete this paragraph if it is not correct - an agency coupled with an interest cannot be revoked to the prejudice of that interest.]",
    ...executionBlock(f, "Deed of Revocation"),
  ];
}

const BUILDERS: Record<PoaDocType, (f: PoaDraftFields) => string[]> = {
  sale: saleDoc,
  purchase: purchaseDoc,
  manage: manageDoc,
  revocation: revocationDoc,
};

/** Structured paragraphs — used for the PDF and the print view. */
export function buildPoaDraft(type: PoaDocType, f: PoaDraftFields): LetterParagraph[] {
  const body = BUILDERS[type](f);
  return [
    { text: DRAFT_BANNER, bold: true },
    ...body.map((text, i) => ({
      text,
      bold: i === 0,
      spaceBefore: i === 0 ? 1 : 0.5,
    })),
  ];
}

/** Plain text — used for the on-screen preview, copy and .txt download. */
export function poaDraftText(type: PoaDocType, f: PoaDraftFields): string {
  return buildPoaDraft(type, f)
    .map((p) => p.text)
    .join("\n\n");
}

/** Filename stem for downloads. */
export function poaDraftFilename(type: PoaDocType): string {
  return `poa-${type}-draft-nritousa`;
}
