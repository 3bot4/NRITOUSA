/**
 * Pure letter-building logic for the B-2 invitation letter generator on
 * /invitation-letter-for-parents-to-visit-usa. Produces the letter as
 * structured paragraphs consumed by BOTH the live on-screen preview and the
 * client-side PDF writer (lib/letterPdf.ts), so the preview always matches
 * the download exactly. No formatting, no React, no I/O — unit-testable.
 */

export type ImmigrationStatus = "citizen" | "green-card" | "h1b" | "f1" | "other";
export type ExpenseCoverage = "inviter" | "parents" | "shared";
export type ConsularPost = "New Delhi" | "Mumbai" | "Chennai" | "Hyderabad" | "Kolkata";

export const CONSULAR_POSTS: { value: ConsularPost; label: string; address: string }[] = [
  { value: "New Delhi", label: "New Delhi (U.S. Embassy)", address: "U.S. Embassy, New Delhi" },
  { value: "Mumbai", label: "Mumbai (U.S. Consulate General)", address: "U.S. Consulate General, Mumbai" },
  { value: "Chennai", label: "Chennai (U.S. Consulate General)", address: "U.S. Consulate General, Chennai" },
  { value: "Hyderabad", label: "Hyderabad (U.S. Consulate General)", address: "U.S. Consulate General, Hyderabad" },
  { value: "Kolkata", label: "Kolkata (U.S. Consulate General)", address: "U.S. Consulate General, Kolkata" },
];

export const STATUS_OPTIONS: { value: ImmigrationStatus; label: string }[] = [
  { value: "citizen", label: "U.S. citizen" },
  { value: "green-card", label: "Green card holder (permanent resident)" },
  { value: "h1b", label: "H-1B visa holder" },
  { value: "f1", label: "F-1 student" },
  { value: "other", label: "Other lawful status" },
];

export interface InvitationLetterInput {
  inviterName: string;
  addressLine1: string;
  addressLine2: string;
  cityStateZip: string;
  status: ImmigrationStatus;
  /** Free-text status description when status === "other". */
  statusOther: string;
  employer: string;
  occupation: string;
  /** e.g. "Ramesh Kumar and Sunita Kumar" */
  parentNames: string;
  /** e.g. "parents" | "mother" | "father" */
  relationship: string;
  passportNumbers: string;
  /** e.g. "tourism and spending time with our family" */
  purpose: string;
  arrivalDate: string;
  departureDate: string;
  expenses: ExpenseCoverage;
  consulate: ConsularPost;
  /** Pre-formatted letter date, e.g. "July 18, 2026". */
  letterDate: string;
}

export interface LetterParagraph {
  text: string;
  bold?: boolean;
  /** Extra blank space before this paragraph (in line-heights). */
  spaceBefore?: number;
}

function statusPhrase(input: InvitationLetterInput): string {
  switch (input.status) {
    case "citizen":
      return "a citizen of the United States";
    case "green-card":
      return "a lawful permanent resident of the United States (green card holder)";
    case "h1b":
      return "lawfully residing and working in the United States in H-1B status";
    case "f1":
      return "lawfully studying in the United States in F-1 student status";
    case "other":
      return input.statusOther.trim()
        ? `lawfully residing in the United States (${input.statusOther.trim()})`
        : "lawfully residing in the United States";
  }
}

function statusEnclosure(status: ImmigrationStatus): string {
  switch (status) {
    case "citizen":
      return "Copy of U.S. passport (biographic page) or naturalization certificate";
    case "green-card":
      return "Copy of Permanent Resident Card (front and back)";
    case "h1b":
      return "Copy of Form I-797 approval notice (H-1B) and most recent I-94 record";
    case "f1":
      return "Copy of Form I-20 and enrollment verification letter";
    case "other":
      return "Copy of current U.S. immigration status document";
  }
}

function expensesSentence(input: InvitationLetterInput, subject: string): string {
  switch (input.expenses) {
    case "inviter":
      return `During their stay, ${subject} will live with me at my residence, and I will be responsible for their accommodation, food, local transportation, and other day-to-day expenses.`;
    case "parents":
      return `During their stay, ${subject} will live with me at my residence. They will bear their own travel and personal expenses, and I will provide accommodation and family support throughout the visit.`;
    case "shared":
      return `During their stay, ${subject} will live with me at my residence. Their travel and day-to-day expenses will be shared between us, and I will provide accommodation and support throughout the visit.`;
  }
}

/** The consular address block for the chosen post. */
export function consulateAddress(post: ConsularPost): string {
  return CONSULAR_POSTS.find((p) => p.value === post)?.address ?? `U.S. Consulate General, ${post}`;
}

/** Build the complete letter as ordered paragraphs. */
export function buildInvitationLetter(input: InvitationLetterInput): LetterParagraph[] {
  const name = input.inviterName.trim() || "[Your full name]";
  const parents = input.parentNames.trim() || "[Parent name(s)]";
  const relationship = input.relationship.trim() || "parents";
  const purpose = input.purpose.trim() || "tourism and spending time with our family";
  const arrival = input.arrivalDate.trim() || "[arrival date]";
  const departure = input.departureDate.trim() || "[departure date]";
  const plural = /\band\b|,|&/.test(parents) || relationship === "parents";
  const subject = plural ? `my ${relationship}` : `my ${relationship}`;

  const paras: LetterParagraph[] = [];

  // Sender address block.
  paras.push({ text: name, bold: true });
  if (input.addressLine1.trim()) paras.push({ text: input.addressLine1.trim() });
  if (input.addressLine2.trim()) paras.push({ text: input.addressLine2.trim() });
  if (input.cityStateZip.trim()) paras.push({ text: input.cityStateZip.trim() });

  paras.push({ text: input.letterDate, spaceBefore: 1 });

  // Recipient.
  paras.push({ text: "To:", spaceBefore: 1 });
  paras.push({ text: "The Visa Officer" });
  paras.push({ text: consulateAddress(input.consulate) });
  paras.push({ text: "India" });

  // Subject line.
  paras.push({
    text: `Subject: Invitation letter in support of B-2 visitor visa application of ${parents}${
      input.passportNumbers.trim() ? ` (Passport No. ${input.passportNumbers.trim()})` : ""
    }`,
    bold: true,
    spaceBefore: 1,
  });

  paras.push({ text: "Dear Visa Officer,", spaceBefore: 1 });

  // Body.
  paras.push({
    text: `I, ${name}, residing at ${[input.addressLine1, input.addressLine2, input.cityStateZip]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ") || "[your address]"}, am ${statusPhrase(input)}. I am writing to respectfully invite ${subject}, ${parents}, to visit me in the United States from ${arrival} to ${departure}.`,
    spaceBefore: 1,
  });

  // Trailing periods stripped so "Acme Inc." doesn't yield "Acme Inc.."
  const occupation = input.occupation.trim().replace(/\.+$/, "");
  const employer = input.employer.trim().replace(/\.+$/, "");
  const employment =
    occupation && employer
      ? ` I am employed as ${occupation} at ${employer}.`
      : occupation
        ? ` I work as ${occupation}.`
        : employer
          ? ` I am employed at ${employer}.`
          : "";

  paras.push({
    text: `The purpose of this visit is ${purpose}.${employment} ${expensesSentence(input, plural ? "they" : subject)}`,
    spaceBefore: 1,
  });

  paras.push({
    text: `${plural ? "They" : `My ${relationship}`} maintain${plural ? "" : "s"} strong family, financial, and social ties to India and ${plural ? "intend" : "intends"} to return before the expiry of ${plural ? "their" : "the"} authorized period of stay. This visit is temporary and for the purpose stated above.`,
    spaceBefore: 1,
  });

  paras.push({
    text: `I request you to kindly consider ${plural ? "their" : "the"} B-2 visitor visa application favorably. Please feel free to contact me if any further information or documentation is required.`,
    spaceBefore: 1,
  });

  // Signature block.
  paras.push({ text: "Sincerely,", spaceBefore: 1 });
  paras.push({ text: name, bold: true, spaceBefore: 2 });
  paras.push({ text: "(Signature)" });

  // Enclosures.
  paras.push({ text: "Enclosures (commonly included, not officially required):", bold: true, spaceBefore: 1 });
  paras.push({ text: `1. ${statusEnclosure(input.status)}` });
  paras.push({ text: "2. Employment or occupation letter" });
  paras.push({ text: "3. Recent bank statement" });

  return paras;
}

/** Plain-text rendering used by the live preview (mirrors the PDF exactly). */
export function letterPlainText(input: InvitationLetterInput): string {
  return buildInvitationLetter(input)
    .map((p) => `${"\n".repeat(p.spaceBefore ?? 0)}${p.text}`)
    .join("\n");
}
