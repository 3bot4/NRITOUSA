/**
 * "Which number is this?" identifier.
 *
 * Matches a typed identifier against the SHAPES of the six numbers an
 * immigration applicant is routinely asked for, and reports which one it is,
 * what it identifies and where it is used.
 *
 * PRIVACY. This runs in the browser and nothing is stored or transmitted. The
 * matcher only ever looks at shape — length, prefix letters, digit count — and
 * `maskNumber` exists so the UI can echo a confirmation without reprinting the
 * digits. Never add a lookup, a validation API or a checksum that would need
 * the real value to leave the page.
 *
 * AMBIGUITY IS A RESULT, NOT A FAILURE. Several of these shapes overlap: an
 * 11-character string is an I-94 number, a 12-digit string is a USCIS online
 * account number, and a bare 9-digit string could be an A-number without its
 * prefix. The function returns every shape that matches, ordered by how
 * distinctive the match is, because telling someone "this is one of two things,
 * and here is how to tell them apart" is more useful than guessing.
 *
 * The I-94 pattern accepts BOTH formats CBP has issued: 11 digits (before May
 * 2019) and nine digits + a letter + a digit (from May 2019). A pattern that
 * only took digits rejected every currently-issued I-94 number.
 */

import { NUMBER_TYPES, type NumberType } from "@/data/aNumberData";

export interface NumberMatch {
  type: NumberType;
  /** "exact" when the shape is unique to this type; "possible" when it overlaps. */
  confidence: "exact" | "possible";
  why: string;
}

export interface IdentifyResult {
  /** The cleaned input: whitespace, hyphens and dots removed. */
  normalized: string;
  /** Digits masked for display. */
  masked: string;
  matches: NumberMatch[];
  /** Set when a document type was given and the shape does not fit it. */
  mismatch?: string;
  guidance: string;
}

/** Strip the formatting people type and leave the characters that carry meaning. */
export function normalizeNumber(raw: string): string {
  return (raw || "").toUpperCase().replace(/[\s\-.()#]/g, "");
}

/** Replace all but the last three characters with bullets. */
export function maskNumber(normalized: string): string {
  if (normalized.length <= 3) return normalized;
  const tail = normalized.slice(-3);
  return "•".repeat(normalized.length - 3) + tail;
}

/**
 * Shapes that are unique versus shapes that overlap with another type. An
 * explicit list beats inferring it, because the overlap is the useful part of
 * the answer.
 */
const AMBIGUOUS_WITHOUT_PREFIX = new Set(["a-number", "i94-number", "online-account", "visa-control"]);

export function identifyNumber(
  raw: string,
  documentType?: string,
): IdentifyResult {
  const normalized = normalizeNumber(raw);
  const masked = maskNumber(normalized);

  if (normalized.length === 0) {
    return {
      normalized,
      masked,
      matches: [],
      guidance:
        "Type the number as it appears on the document. Nothing you type leaves your browser — the check looks only at the shape of the number.",
    };
  }

  const hasLetterPrefix = /^[A-Z]/.test(normalized);

  const matches: NumberMatch[] = [];
  for (const type of NUMBER_TYPES) {
    if (!type.pattern.test(normalized)) continue;

    // A shape carrying its own letter prefix (A, N, or a service-centre code)
    // is distinctive. A bare run of digits is not.
    const distinctive = hasLetterPrefix || !AMBIGUOUS_WITHOUT_PREFIX.has(type.id);
    matches.push({
      type,
      confidence: distinctive ? "exact" : "possible",
      why: whyMatched(type, normalized, hasLetterPrefix),
    });
  }

  matches.sort((a, b) => (a.confidence === "exact" ? -1 : 1) - (b.confidence === "exact" ? -1 : 1));

  let mismatch: string | undefined;
  if (documentType && matches.length > 0) {
    const expected = EXPECTED_BY_DOCUMENT[documentType];
    if (expected && !matches.some((m) => m.type.id === expected)) {
      const want = NUMBER_TYPES.find((t) => t.id === expected);
      // Not lowercased: "A + 8 or 9 digits" is a capital A, and lowercasing
      // the shape string turned the answer into an instruction to type "a".
      mismatch = want
        ? `You chose ${documentType}, which carries the ${want.name} — shaped "${want.shape}". What you typed does not fit that shape, so either the number came from a different document or a digit is off.`
        : undefined;
    }
  }

  return {
    normalized,
    masked,
    matches,
    mismatch,
    guidance: guidanceFor(matches, normalized),
  };
}

function whyMatched(type: NumberType, normalized: string, hasPrefix: boolean): string {
  const digits = normalized.replace(/[^0-9]/g, "").length;
  switch (type.id) {
    case "a-number":
      return hasPrefix
        ? `It starts with A and carries ${digits} digits, which is the A-number shape.`
        : `${digits} digits with no prefix fits an A-number written without its A. On a current green card or EAD the A is not printed at all — the label reads USCIS # and the digits follow.`;
    case "receipt-number":
      return `It opens with a three-letter service-centre or electronic-system code followed by 10 digits, which only a USCIS receipt number does.`;
    case "online-account":
      return `12 digits with no prefix fits a USCIS online account number.`;
    case "i94-number":
      return /[A-Z]/i.test(normalized)
        ? `Nine digits, a letter, then a digit — the format CBP has issued for I-94 admission records since May 2019.`
        : `11 digits fits an I-94 admission record number in the numeric format CBP issued before May 2019. Those stay valid until their admit-until date.`;
    case "sevis-id":
      return `It starts with N followed by 10 digits, which only a SEVIS ID does.`;
    case "visa-control":
      return `8 digits fits the control number printed on a visa foil — and also an 8-digit A-number written without its A.`;
    default:
      return `The shape matches ${type.name}.`;
  }
}

const EXPECTED_BY_DOCUMENT: Record<string, string> = {
  "Green card (Form I-551)": "a-number",
  "Employment Authorization Document": "a-number",
  "Immigrant visa foil": "a-number",
  "Nonimmigrant visa foil": "visa-control",
  "Form I-797 notice": "receipt-number",
  "I-94 record": "i94-number",
  "Form I-20 or DS-2019": "sevis-id",
  "myUSCIS account page": "online-account",
};

export const DOCUMENT_CHOICES = Object.keys(EXPECTED_BY_DOCUMENT);

function guidanceFor(matches: NumberMatch[], normalized: string): string {
  if (matches.length === 0) {
    const digits = normalized.replace(/[^0-9]/g, "").length;
    return `That shape does not match any of the six identifiers on this page — ${digits} digit${digits === 1 ? "" : "s"}${/^[A-Z]/.test(normalized) ? ` with a ${normalized[0]} prefix` : " with no letter prefix"}. Check for a transposed digit, and check whether the leading characters on the document are part of the number or a label. Indian documents are a common source of confusion here: an OCI card number, a PIO number and an Indian passport file number all belong to Indian systems and none of them is a US identifier.`;
  }
  if (matches.length === 1) {
    const m = matches[0];
    return m.confidence === "exact"
      ? `This is ${m.type.name}. It identifies ${m.type.identifies.toLowerCase()}, and you will find it on: ${m.type.whereFound.toLowerCase()}.`
      : `This is most likely ${m.type.name}, but a bare run of digits is not unique to one identifier. Check the label printed next to it on the document — that is what settles it.`;
  }
  const names = matches.map((m) => m.type.name).join(", or ");
  return `That shape fits more than one identifier: ${names}. A run of digits on its own does not tell you which, so look at the label beside it on the document — USCIS #, Receipt Number, Admission Record Number. That is the reliable answer, and it is why the labels exist.`;
}
