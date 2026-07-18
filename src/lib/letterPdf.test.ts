/**
 * Acceptance tests for the invitation-letter PDF: a structurally valid PDF
 * (correct xref offsets, stream lengths, header/trailer) for all five
 * immigration-status paths, built entirely offline from the same paragraphs
 * the on-screen preview renders.
 */
import { describe, expect, it } from "vitest";
import {
  buildInvitationLetter,
  letterPlainText,
  type ImmigrationStatus,
  type InvitationLetterInput,
} from "@/lib/invitationLetter";
import { buildLetterPdf } from "@/lib/letterPdf";

const baseInput = (status: ImmigrationStatus): InvitationLetterInput => ({
  inviterName: "Anil Sharma",
  addressLine1: "1234 Maple Avenue, Apt 5B",
  addressLine2: "",
  cityStateZip: "Edison, NJ 08817",
  status,
  statusOther: status === "other" ? "L-1A visa holder" : "",
  employer: "Acme Software Inc.",
  occupation: "Senior Software Engineer",
  parentNames: "Ramesh Sharma and Sunita Sharma",
  relationship: "parents",
  passportNumbers: "Z1234567, Z7654321",
  purpose: "tourism and spending time with our family, including their grandchildren",
  arrivalDate: "December 10, 2026",
  departureDate: "March 5, 2027",
  expenses: "inviter",
  consulate: "New Delhi",
  letterDate: "July 18, 2026",
});

const decode = (bytes: Uint8Array) => {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return s;
};

const STATUS_MARKERS: Record<ImmigrationStatus, string> = {
  citizen: "citizen of the United States",
  "green-card": "lawful permanent resident",
  h1b: "H-1B status",
  f1: "F-1 student status",
  other: "L-1A visa holder",
};

describe("buildInvitationLetter", () => {
  (Object.keys(STATUS_MARKERS) as ImmigrationStatus[]).forEach((status) => {
    it(`writes a correctly framed letter for the ${status} path`, () => {
      const text = letterPlainText(baseInput(status));
      expect(text).toContain(STATUS_MARKERS[status]);
      expect(text).toContain("The Visa Officer");
      expect(text).toContain("U.S. Embassy, New Delhi");
      expect(text).toContain("Subject: Invitation letter in support of B-2 visitor visa application");
      expect(text).toContain("December 10, 2026");
      expect(text).toContain("Enclosures (commonly included, not officially required):");
      expect(text).toContain("return before the expiry");
    });
  });

  it("addresses the consulate the parents actually apply at", () => {
    const text = letterPlainText({ ...baseInput("citizen"), consulate: "Hyderabad" });
    expect(text).toContain("U.S. Consulate General, Hyderabad");
  });
});

describe("buildLetterPdf", () => {
  (Object.keys(STATUS_MARKERS) as ImmigrationStatus[]).forEach((status) => {
    it(`produces a structurally valid PDF for the ${status} path`, () => {
      const bytes = buildLetterPdf(buildInvitationLetter(baseInput(status)));
      const pdf = decode(bytes);

      // Header / trailer.
      expect(pdf.startsWith("%PDF-1.4\n")).toBe(true);
      expect(pdf.endsWith("%%EOF\n")).toBe(true);
      expect(pdf).toContain("/Type /Catalog");
      expect(pdf).toContain("/BaseFont /Helvetica");

      // startxref points at the xref table.
      const startxref = Number(pdf.match(/startxref\n(\d+)\n%%EOF\n$/)?.[1]);
      expect(pdf.slice(startxref, startxref + 4)).toBe("xref");

      // Every xref offset points at the matching "N 0 obj".
      const xrefBlock = pdf.slice(startxref);
      const entries = [...xrefBlock.matchAll(/^(\d{10}) 00000 n /gm)].map((m) => Number(m[1]));
      expect(entries.length).toBeGreaterThanOrEqual(6);
      entries.forEach((offset, i) => {
        expect(pdf.slice(offset, offset + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`);
      });

      // Declared stream lengths match actual stream bytes.
      for (const m of pdf.matchAll(/<< \/Length (\d+) >>\nstream\n/g)) {
        const start = (m.index ?? 0) + m[0].length;
        const declared = Number(m[1]);
        expect(pdf.slice(start + declared, start + declared + 11)).toBe("\nendstream\n");
      }

      // The letter text made it into the content stream.
      expect(pdf).toContain("Dear Visa Officer,");
    });
  });

  it("keeps every line inside the printable width", () => {
    const longInput = {
      ...baseInput("h1b"),
      purpose:
        "tourism, attending their granddaughter's first birthday celebration, visiting national parks on the east coast, and spending an extended period of quality time with our family after several years apart",
    };
    const bytes = buildLetterPdf(buildInvitationLetter(longInput));
    const pdf = decode(bytes);
    for (const m of pdf.matchAll(/\(([^)]*)\) Tj/g)) {
      // ~468pt at 11pt Helvetica comfortably fits < 95 chars.
      expect(m[1].length).toBeLessThan(95);
    }
  });
});
