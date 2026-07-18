/**
 * Acceptance tests for the invitation letter: a structurally valid PDF
 * (correct xref offsets, stream lengths, header/trailer) for all five
 * immigration-status paths, clean degradation of blank optional fields,
 * HTML escaping in the print document, and the generic-consulate path —
 * all built entirely offline from the same paragraphs the preview renders.
 */
import { describe, expect, it } from "vitest";
import {
  buildInvitationLetter,
  buildPrintHtml,
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
  inviterEmail: "anil@example.com",
  inviterPhone: "+1 (732) 555-0142",
  status,
  statusOther: status === "other" ? "L-1A visa holder" : "",
  employer: "Acme Software Inc.",
  occupation: "Senior Software Engineer",
  parent1Name: "Ramesh Sharma",
  parent1Passport: "Z1234567",
  parent2Name: "Sunita Sharma",
  parent2Passport: "Z7654321",
  relationship: "parents",
  relationshipNote: "",
  purpose: "tourism and spending time with our family, including their grandchildren",
  arrivalDate: "December 10, 2026",
  departureDate: "March 5, 2027",
  airfarePayer: "parents",
  livingPayer: "inviter",
  accommodation: "with-inviter",
  usContact: "",
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
      expect(text).toContain("Ramesh Sharma and Sunita Sharma");
      expect(text).toContain("(Passport No. Z1234567, Z7654321)");
      expect(text).toContain("They will bear the cost of their own round-trip airfare.");
      expect(text).toContain("I will be responsible for their accommodation");
      expect(text).toContain("Enclosures (commonly included, not officially required):");
    });
  });

  it("addresses the consulate the parents actually apply at", () => {
    const text = letterPlainText({ ...baseInput("citizen"), consulate: "Hyderabad" });
    expect(text).toContain("U.S. Consulate General, Hyderabad");
  });

  it("addresses generically when no post is selected", () => {
    const text = letterPlainText({ ...baseInput("citizen"), consulate: "" });
    expect(text).toContain("United States Embassy / Consulate General");
    expect(text).not.toContain("New Delhi");
  });

  it("degrades cleanly when every optional field is blank", () => {
    const text = letterPlainText({
      ...baseInput("h1b"),
      inviterEmail: "",
      inviterPhone: "",
      employer: "",
      occupation: "",
      parent2Name: "",
      parent2Passport: "",
      relationship: "mother",
      relationshipNote: "",
      usContact: "",
      addressLine2: "",
    });
    expect(text).not.toMatch(/\(\s*\)/); // no empty parentheses
    expect(text).not.toMatch(/ {2,}/); // no double spaces from dropped fragments
    expect(text).not.toMatch(/\.\./); // no doubled periods
    expect(text).toContain("my mother, Ramesh Sharma,");
    expect(text).toContain("My mother maintains");
    expect(text).toContain("Please feel free to contact me if any further information");
    expect(text).not.toContain("Tel:");
    expect(text).not.toContain("Email:");
  });

  it("includes contact details, relationship note, and US contact when provided", () => {
    const text = letterPlainText({
      ...baseInput("green-card"),
      relationship: "parents-in-law",
      relationshipNote: "parents of my wife, Priya Sharma",
      usContact: "my wife Priya Sharma, +1 (732) 555-0199",
    });
    expect(text).toContain("my parents-in-law, Ramesh Sharma and Sunita Sharma (parents of my wife, Priya Sharma)");
    expect(text).toContain("local point of contact in the United States");
    expect(text).toContain("contact me at +1 (732) 555-0142 or anil@example.com");
  });
});

describe("buildLetterPdf", () => {
  (Object.keys(STATUS_MARKERS) as ImmigrationStatus[]).forEach((status) => {
    it(`produces a structurally valid PDF for the ${status} path`, () => {
      const bytes = buildLetterPdf(buildInvitationLetter(baseInput(status)));
      const pdf = decode(bytes);

      expect(pdf.startsWith("%PDF-1.4\n")).toBe(true);
      expect(pdf.endsWith("%%EOF\n")).toBe(true);
      expect(pdf).toContain("/Type /Catalog");
      expect(pdf).toContain("/BaseFont /Helvetica");

      const startxref = Number(pdf.match(/startxref\n(\d+)\n%%EOF\n$/)?.[1]);
      expect(pdf.slice(startxref, startxref + 4)).toBe("xref");

      const xrefBlock = pdf.slice(startxref);
      const entries = [...xrefBlock.matchAll(/^(\d{10}) 00000 n /gm)].map((m) => Number(m[1]));
      expect(entries.length).toBeGreaterThanOrEqual(6);
      entries.forEach((offset, i) => {
        expect(pdf.slice(offset, offset + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`);
      });

      for (const m of pdf.matchAll(/<< \/Length (\d+) >>\nstream\n/g)) {
        const start = (m.index ?? 0) + m[0].length;
        const declared = Number(m[1]);
        expect(pdf.slice(start + declared, start + declared + 11)).toBe("\nendstream\n");
      }

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
      expect(m[1].length).toBeLessThan(95);
    }
  });
});

describe("buildPrintHtml", () => {
  it("escapes user-entered HTML so the print document is safe", () => {
    const evil = {
      ...baseInput("citizen"),
      inviterName: `<script>alert("x")</script> O'Brien & Sons`,
    };
    const html = buildPrintHtml(buildInvitationLetter(evil));
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("O&#39;Brien &amp; Sons");
    expect(html).toContain("<!DOCTYPE html>");
  });

  it("mirrors the same paragraphs as the plain-text preview", () => {
    const input = baseInput("f1");
    const html = buildPrintHtml(buildInvitationLetter(input));
    const text = letterPlainText(input);
    for (const line of ["Dear Visa Officer,", "Sincerely,", "U.S. Embassy, New Delhi"]) {
      expect(html).toContain(line);
      expect(text).toContain(line);
    }
  });
});
