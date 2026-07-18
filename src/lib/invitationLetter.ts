/**
 * Pure letter-building logic for the B-2 invitation letter generator on
 * /invitation-letter-for-parents-to-visit-usa. Produces the letter as
 * structured paragraphs consumed by the live on-screen preview, the
 * client-side PDF writer (lib/letterPdf.ts), AND the print-friendly HTML
 * document — so every output matches exactly. No React, no I/O.
 *
 * Composition rules: every optional field must degrade cleanly — a blank
 * value never leaves dangling punctuation, empty lines, or half sentences.
 * Unit-tested in letterPdf.test.ts.
 */

export type ImmigrationStatus = "citizen" | "green-card" | "h1b" | "f1" | "other";
export type PayerChoice = "inviter" | "parents" | "shared";
export type Accommodation = "with-inviter" | "hotel" | "mixed";
export type ConsularPost = "New Delhi" | "Mumbai" | "Chennai" | "Hyderabad" | "Kolkata" | "";

export const CONSULAR_POSTS: { value: ConsularPost; label: string; address: string }[] = [
  { value: "", label: "Not decided yet (address generically)", address: "United States Embassy / Consulate General" },
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
  { value: "other", label: "Other lawful status (L-1, O-1, TN, …)" },
];

export const RELATIONSHIP_OPTIONS = [
  { value: "parents", label: "Parents (both)" },
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "parents-in-law", label: "Parents-in-law" },
] as const;

export interface InvitationLetterInput {
  inviterName: string;
  addressLine1: string;
  addressLine2: string;
  cityStateZip: string;
  /** Optional contact details for the signature block. */
  inviterEmail: string;
  inviterPhone: string;
  status: ImmigrationStatus;
  /** Free-text status description when status === "other". */
  statusOther: string;
  employer: string;
  occupation: string;
  parent1Name: string;
  parent1Passport: string;
  /** Optional second parent. */
  parent2Name: string;
  parent2Passport: string;
  /** "parents" | "mother" | "father" | "parents-in-law" */
  relationship: string;
  /** Optional clarification, e.g. "parents of my wife, Priya Sharma". */
  relationshipNote: string;
  purpose: string;
  arrivalDate: string;
  departureDate: string;
  /** Who pays airfare vs day-to-day expenses — asked separately. */
  airfarePayer: PayerChoice;
  livingPayer: PayerChoice;
  accommodation: Accommodation;
  /** Optional local/emergency contact in the US. */
  usContact: string;
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

const clean = (s: string) => s.trim().replace(/\s+/g, " ");
const noDot = (s: string) => clean(s).replace(/\.+$/, "");

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
      return clean(input.statusOther)
        ? `lawfully residing in the United States (${noDot(input.statusOther)})`
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

/** Names + passports of the invited parent(s), cleanly merged. */
function guests(input: InvitationLetterInput): {
  names: string;
  passports: string;
  plural: boolean;
} {
  const n1 = clean(input.parent1Name);
  const n2 = clean(input.parent2Name);
  const names = [n1, n2].filter(Boolean).join(" and ") || "[Parent name(s)]";
  const passports = [clean(input.parent1Passport), clean(input.parent2Passport)]
    .filter(Boolean)
    .join(", ");
  const plural =
    Boolean(n1 && n2) ||
    input.relationship === "parents" ||
    input.relationship === "parents-in-law";
  return { names, passports, plural };
}

function accommodationSentence(input: InvitationLetterInput, they: string): string {
  switch (input.accommodation) {
    case "with-inviter":
      return `During ${they === "they" ? "their" : "the"} stay, ${they} will live with me at my residence.`;
    case "hotel":
      return `During ${they === "they" ? "their" : "the"} stay, ${they} will stay in hotel accommodation arranged for the visit.`;
    case "mixed":
      return `During ${they === "they" ? "their" : "the"} stay, ${they} will stay partly with me at my residence and partly in hotel or other accommodation.`;
  }
}

function payerSentence(kind: "airfare" | "living", payer: PayerChoice): string {
  if (kind === "airfare") {
    switch (payer) {
      case "inviter":
        return "I will bear the cost of their round-trip airfare.";
      case "parents":
        return "They will bear the cost of their own round-trip airfare.";
      case "shared":
        return "The cost of airfare will be shared between us.";
    }
  }
  switch (payer) {
    case "inviter":
      return "I will be responsible for their accommodation, food, local transportation, and other day-to-day expenses during the visit.";
    case "parents":
      return "They will bear their own day-to-day expenses, and I will provide family support throughout the visit.";
    case "shared":
      return "Day-to-day living expenses will be shared between us.";
  }
}

/** The consular address block for the chosen post ("" → generic). */
export function consulateAddress(post: ConsularPost): string {
  return CONSULAR_POSTS.find((p) => p.value === post)?.address ?? "United States Embassy / Consulate General";
}

/** Build the complete letter as ordered paragraphs. */
export function buildInvitationLetter(input: InvitationLetterInput): LetterParagraph[] {
  const name = clean(input.inviterName) || "[Your full name]";
  const g = guests(input);
  const relationship = clean(input.relationship) || "parents";
  const relNote = clean(input.relationshipNote);
  const purpose = noDot(input.purpose) || "tourism and spending time with our family";
  const arrival = clean(input.arrivalDate) || "[arrival date]";
  const departure = clean(input.departureDate) || "[departure date]";
  const they = g.plural ? "they" : `my ${relationship}`;
  const theyCap = g.plural ? "They" : `My ${relationship}`;

  const paras: LetterParagraph[] = [];

  // Sender address block.
  paras.push({ text: name, bold: true });
  if (clean(input.addressLine1)) paras.push({ text: clean(input.addressLine1) });
  if (clean(input.addressLine2)) paras.push({ text: clean(input.addressLine2) });
  if (clean(input.cityStateZip)) paras.push({ text: clean(input.cityStateZip) });
  if (clean(input.inviterPhone)) paras.push({ text: `Tel: ${clean(input.inviterPhone)}` });
  if (clean(input.inviterEmail)) paras.push({ text: `Email: ${clean(input.inviterEmail)}` });

  paras.push({ text: input.letterDate, spaceBefore: 1 });

  // Recipient.
  paras.push({ text: "To:", spaceBefore: 1 });
  paras.push({ text: "The Visa Officer" });
  paras.push({ text: consulateAddress(input.consulate) });
  paras.push({ text: "India" });

  // Subject line.
  paras.push({
    text: `Subject: Invitation letter in support of B-2 visitor visa application of ${g.names}${
      g.passports ? ` (Passport No. ${g.passports})` : ""
    }`,
    bold: true,
    spaceBefore: 1,
  });

  paras.push({ text: "Dear Visa Officer,", spaceBefore: 1 });

  // Body P1 — who invites whom.
  const address = [input.addressLine1, input.addressLine2, input.cityStateZip]
    .map(clean)
    .filter(Boolean)
    .join(", ") || "[your address]";
  paras.push({
    text: `I, ${name}, residing at ${address}, am ${statusPhrase(input)}. I am writing to respectfully invite my ${relationship}, ${g.names}${
      relNote ? ` (${noDot(relNote)})` : ""
    }, to visit me in the United States from ${arrival} to ${departure}.`,
    spaceBefore: 1,
  });

  // Body P2 — purpose, employment, accommodation, who pays what.
  const occupation = noDot(input.occupation);
  const employer = noDot(input.employer);
  const employment =
    occupation && employer
      ? ` I am employed as ${occupation} at ${employer}.`
      : occupation
        ? ` I work as ${occupation}.`
        : employer
          ? ` I am employed at ${employer}.`
          : "";
  paras.push({
    text:
      `The purpose of this visit is ${purpose}.${employment} ` +
      `${accommodationSentence(input, they)} ` +
      `${payerSentence("airfare", input.airfarePayer)} ` +
      `${payerSentence("living", input.livingPayer)}`,
    spaceBefore: 1,
  });

  // Body P3 — ties and temporariness.
  const contact = clean(input.usContact);
  paras.push({
    text:
      `${theyCap} maintain${g.plural ? "" : "s"} family, financial, and social ties to India and ${
        g.plural ? "intend" : "intends"
      } to return before the expiry of ${g.plural ? "their" : "the"} authorized period of stay. This visit is temporary and for the purpose stated above.` +
      (contact ? ` During the visit, ${noDot(contact)} can also be reached as a local point of contact in the United States.` : ""),
    spaceBefore: 1,
  });

  // Body P4 — closing.
  const reachParts = [clean(input.inviterPhone), clean(input.inviterEmail)].filter(Boolean);
  paras.push({
    text: `I request you to kindly consider ${g.plural ? "their" : "the"} B-2 visitor visa application favorably. ${
      reachParts.length
        ? `Please feel free to contact me at ${reachParts.join(" or ")} if any further information or documentation is required.`
        : "Please feel free to contact me if any further information or documentation is required."
    }`,
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

/** HTML-escape a user-supplied string for the print document. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Standalone print-optimized HTML document of the letter — same paragraphs
 * as the PDF, printed via a hidden iframe so the browser's print dialog
 * yields a clean one-page letter instead of the whole website.
 */
export function buildPrintHtml(paragraphs: LetterParagraph[]): string {
  const body = paragraphs
    .map((p) => {
      const space = p.spaceBefore ? ` style="margin-top:${p.spaceBefore * 0.9}em"` : "";
      const text = escapeHtml(p.text) || "&nbsp;";
      return p.bold ? `<p${space}><strong>${text}</strong></p>` : `<p${space}>${text}</p>`;
    })
    .join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invitation Letter</title>
<style>
  @page { margin: 1in; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 11.5pt; line-height: 1.45; color: #111; margin: 0; }
  p { margin: 0; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}
