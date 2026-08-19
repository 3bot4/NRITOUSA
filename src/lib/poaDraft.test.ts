import { describe, expect, it } from "vitest";
import {
  DOC_TYPES,
  DRAFT_BANNER,
  EMPTY_POA_DRAFT,
  REQUIRED_BY_TYPE,
  buildPoaDraft,
  draftProgress,
  poaDraftFilename,
  poaDraftText,
  type PoaDocType,
  type PoaDraftFields,
} from "./poaDraft";

const ALL: PoaDocType[] = ["sale", "purchase", "manage", "revocation"];

const filled: PoaDraftFields = {
  ...EMPTY_POA_DRAFT,
  principalName: "Asha Ramanathan",
  principalRelation: "daughter",
  principalParent: "R Ramanathan",
  principalAge: "41",
  passportType: "Indian",
  passportNo: "Z1234567",
  ociNo: "A0099887",
  pan: "ABCDE1234F",
  usAddress: "12 Maple Ct, Edison, NJ 08820, USA",
  attorneyName: "Vikram Ramanathan",
  attorneyRelationship: "brother",
  attorneyAge: "46",
  attorneyAadhaar: "1111 2222 3333",
  attorneyPan: "ZYXWV9876K",
  attorneyAddress: "44 Anna Salai, Chennai 600002",
  propertySchedule: "Flat 3B, Lakeview Apartments, Survey No. 12/4, Adyar, Chennai",
  subRegistrar: "Adyar, Chennai",
  minPrice: "Rupees One Crore Fifty Lakh (Rs. 1,50,00,000)",
  maxPrice: "Rupees Two Crore (Rs. 2,00,00,000)",
  rentMin: "Rs. 45,000",
  leaseMonths: "11",
  repairCap: "Rs. 25,000",
  bankName: "HDFC Bank",
  bankBranch: "Adyar",
  nroAccount: "50100123456789",
  startDate: "September 1, 2026",
  endDate: "August 31, 2027",
  executionCity: "Edison",
  executionState: "New Jersey",
  executionDate: "August 19, 2026",
  witness1Name: "John Alvarez",
  witness1Address: "9 Oak St, Edison, NJ",
  witness2Name: "Mary Chen",
  witness2Address: "77 Pine Ave, Iselin, NJ",
  originalPoaDate: "March 2, 2024",
  originalPoaRegNo: "1234/2024",
  originalPoaRegOffice: "Adyar, Chennai",
  revocationEffective: "September 1, 2026",
  newspaper: "The Hindu, Chennai edition",
};

describe("buildPoaDraft", () => {
  it("puts the not-a-deed banner first in every document", () => {
    for (const t of ALL) {
      const paras = buildPoaDraft(t, filled);
      expect(paras[0].text).toBe(DRAFT_BANNER);
      expect(paras[0].bold).toBe(true);
      expect(paras[0].text).toMatch(/NOT A DEED/);
      expect(paras[0].text).toMatch(/Do not sign/i);
    }
  });

  it("keeps the banner in the copyable text, so it cannot be separated", () => {
    for (const t of ALL) {
      expect(poaDraftText(t, filled)).toContain(DRAFT_BANNER);
      expect(poaDraftText(t, EMPTY_POA_DRAFT)).toContain(DRAFT_BANNER);
    }
  });

  it("substitutes entered values into the draft", () => {
    const txt = poaDraftText("sale", filled);
    expect(txt).toContain("Asha Ramanathan");
    expect(txt).toContain("Vikram Ramanathan");
    expect(txt).toContain("Z1234567");
    expect(txt).toContain("50100123456789");
    expect(txt).toContain("Rupees One Crore Fifty Lakh");
    expect(txt).toContain("Flat 3B, Lakeview Apartments");
  });

  it("falls back to obvious bracketed placeholders when a field is blank", () => {
    const txt = poaDraftText("sale", EMPTY_POA_DRAFT);
    expect(txt).toContain("[FULL NAME EXACTLY AS ON THE TITLE DEED]");
    expect(txt).toContain("[FULL NAME OF ATTORNEY]");
    expect(txt).toContain("[ACCOUNT NO.]");
    expect(txt).toContain("[MINIMUM PRICE IN WORDS AND FIGURES]");
  });

  it("omits optional identifiers entirely rather than printing empty labels", () => {
    const noOci = poaDraftText("sale", { ...filled, ociNo: "", pan: "" });
    expect(noOci).not.toContain("OCI Card No. ,");
    expect(noOci).not.toContain("Permanent Account Number ,");
    expect(poaDraftText("sale", filled)).toContain("OCI Card No. A0099887");
  });

  it("names the NRO account as the only money destination on a sale POA", () => {
    const txt = poaDraftText("sale", filled);
    expect(txt).toMatch(/ONLY by way of credit to my NRO account No\. 50100123456789/);
    expect(txt).toMatch(/into any account other than the account named in clause 4/);
  });

  it("carries an express exclusion list on every POA (not the revocation deed)", () => {
    for (const t of ["sale", "purchase", "manage"] as const) {
      expect(poaDraftText(t, filled)).toMatch(/SHALL NOT/);
    }
  });

  it("bars sale, mortgage and gift on a management POA", () => {
    const txt = poaDraftText("manage", filled);
    expect(txt).toMatch(/sell, agree to sell, gift, exchange, mortgage, charge/);
    expect(txt).toContain("11 months");
  });

  it("caps the consideration on a purchase POA and floors it on a sale POA", () => {
    expect(poaDraftText("purchase", filled)).toMatch(/NOT EXCEEDING Rupees Two Crore/);
    expect(poaDraftText("sale", filled)).toMatch(/not less than Rupees One Crore Fifty Lakh/);
  });

  it("gives every POA an end date clause", () => {
    for (const t of ["sale", "purchase", "manage"] as const) {
      expect(poaDraftText(t, filled)).toMatch(/stand automatically revoked on August 31, 2027/);
    }
  });

  it("flags the Section 202 carve-out in the revocation deed", () => {
    const txt = poaDraftText("revocation", filled);
    expect(txt).toMatch(/Section 202 of the Indian Contract Act, 1872/);
    expect(txt).toMatch(/coupled with an interest cannot be revoked/);
    expect(txt).toContain("March 2, 2024");
  });

  it("requires two non-relative witnesses in every document", () => {
    for (const t of ALL) {
      const txt = poaDraftText(t, filled);
      expect(txt).toContain("WITNESS 1:");
      expect(txt).toContain("WITNESS 2:");
      expect(txt).toMatch(/must not be the Principal's spouse or blood relatives/);
    }
  });

  it("leaves room for the notarial block and the attestation/apostille", () => {
    for (const t of ALL) {
      const txt = poaDraftText(t, filled);
      expect(txt).toMatch(/NOTARIAL ACKNOWLEDGMENT BLOCK/);
      expect(txt).toMatch(/CONSULAR ATTESTATION|APOSTILLE/);
    }
  });

  it("never emits an empty paragraph into the PDF", () => {
    for (const t of ALL) {
      for (const p of buildPoaDraft(t, EMPTY_POA_DRAFT)) {
        expect(p.text.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("draftProgress", () => {
  it("is 0% on an empty form and 100% when every required field is filled", () => {
    for (const t of ALL) {
      expect(draftProgress(t, EMPTY_POA_DRAFT).pct).toBe(0);
      expect(draftProgress(t, EMPTY_POA_DRAFT).ready).toBe(false);
      const p = draftProgress(t, filled);
      expect(p.pct).toBe(100);
      expect(p.ready).toBe(true);
      expect(p.filled).toBe(p.total);
    }
  });

  it("ignores whitespace-only input", () => {
    const ws = { ...EMPTY_POA_DRAFT, principalName: "   " };
    expect(draftProgress("sale", ws).filled).toBe(0);
  });

  it("counts partial completion", () => {
    const partial = { ...EMPTY_POA_DRAFT, principalName: "A", passportNo: "B" };
    const p = draftProgress("sale", partial);
    expect(p.filled).toBe(2);
    expect(p.pct).toBeGreaterThan(0);
    expect(p.pct).toBeLessThan(100);
  });
});

describe("metadata", () => {
  it("exposes a required-field list and a filename for every doc type", () => {
    for (const t of ALL) {
      expect(REQUIRED_BY_TYPE[t].length).toBeGreaterThan(4);
      expect(poaDraftFilename(t)).toMatch(/^poa-[a-z]+-draft-nritousa$/);
    }
  });

  it("keeps DOC_TYPES and the builders in sync", () => {
    expect(DOC_TYPES.map((d) => d.value).sort()).toEqual([...ALL].sort());
  });
});

/* The generator hands these paragraphs straight to the shared PDF writer, so
   the seam between the two is worth asserting — a draft that cannot be
   downloaded is a broken tool, and nothing else in the suite covers it. */
describe("PDF integration", () => {
  it("produces a structurally valid PDF for every document type", async () => {
    const { buildLetterPdf } = await import("./letterPdf");
    for (const t of ALL) {
      const bytes = buildLetterPdf(buildPoaDraft(t, filled));
      const s = Buffer.from(bytes).toString("latin1");
      expect(s.startsWith("%PDF-1.")).toBe(true);
      expect(s.trimEnd().endsWith("%%EOF")).toBe(true);
      expect(s).toContain("/Type /Catalog");
      expect(s).toContain("trailer");
      expect(bytes.byteLength).toBeGreaterThan(1000);
    }
  });

  it("writes the not-a-deed banner into the PDF bytes", async () => {
    const { buildLetterPdf } = await import("./letterPdf");
    const s = Buffer.from(buildLetterPdf(buildPoaDraft("sale", filled))).toString("latin1");
    expect(s).toMatch(/NOT A DEED/);
  });

  it("does not throw on a completely empty form", async () => {
    const { buildLetterPdf } = await import("./letterPdf");
    for (const t of ALL) {
      expect(() => buildLetterPdf(buildPoaDraft(t, EMPTY_POA_DRAFT))).not.toThrow();
    }
  });
});

/* Fixes from the POA generator review. Each block names the defect it locks
   out, so a future edit that reintroduces it fails here rather than on a deed. */
describe("revocation deed does not assert registration that did not happen", () => {
  const unregistered = { ...filled, originalPoaRegNo: "", originalPoaRegOffice: "" };

  it("omits the registration clause entirely when both fields are blank", () => {
    const txt = poaDraftText("revocation", unregistered);
    expect(txt).toMatch(
      /executed by me and attested or apostilled in the United States \(the "said Power of Attorney"\)/,
    );
    expect(txt).not.toMatch(/registered as document No\./);
  });

  it("never prints a raw [PLACE] placeholder when the POA was not registered", () => {
    expect(poaDraftText("revocation", unregistered)).not.toContain("[PLACE]");
  });

  it("declares the POA was NOT registered instead of claiming the revocation is", () => {
    const txt = poaDraftText("revocation", unregistered);
    expect(txt).toMatch(/the said Power of Attorney was not registered/);
    expect(txt).not.toMatch(/this revocation is being registered/);
  });

  it("keeps the registered wording when both fields are supplied", () => {
    const txt = poaDraftText("revocation", filled);
    expect(txt).toMatch(/and registered as document No\. 1234\/2024 at the office of the Sub-Registrar at Adyar, Chennai/);
    expect(txt).toMatch(/this revocation is being registered at the office of the Sub-Registrar/);
  });

  it("keeps the 'AND' conjunction when only the office is known", () => {
    const txt = poaDraftText("revocation", { ...filled, originalPoaRegNo: "" });
    expect(txt).toMatch(/United States, AND registered at the office of the Sub-Registrar at Adyar, Chennai/);
    expect(txt).not.toMatch(/United States registered at/);
    expect(txt).not.toContain("[PLACE]");
  });

  it("still falls back to a bracketed newspaper placeholder when blank", () => {
    expect(poaDraftText("revocation", { ...unregistered, newspaper: "" })).toContain("[NEWSPAPER]");
  });
});

describe("passport type 'Other' never reaches the deed literally", () => {
  it("names the issuing country when one is given", () => {
    const txt = poaDraftText("sale", { ...filled, passportType: "Other", passportCountry: "Canadian" });
    expect(txt).toContain("holder of Canadian passport No. Z1234567");
    expect(txt).not.toContain("holder of Other passport");
  });

  it("falls back to a bracketed country placeholder when it is blank", () => {
    const txt = poaDraftText("sale", { ...filled, passportType: "Other", passportCountry: "" });
    expect(txt).toContain("holder of passport No. Z1234567 issued by [COUNTRY OF ISSUE]");
    expect(txt).not.toContain("holder of Other passport");
  });

  it("leaves the Indian and United States branches untouched", () => {
    expect(poaDraftText("sale", { ...filled, passportType: "Indian" })).toContain(
      "holder of Indian passport No.",
    );
    expect(poaDraftText("sale", { ...filled, passportType: "United States" })).toContain(
      "holder of United States passport No.",
    );
  });
});

describe("ratification and attorney acceptance appear on every POA", () => {
  it("is present on sale, purchase and management drafts", () => {
    for (const t of ["sale", "purchase", "manage"] as const) {
      const txt = poaDraftText(t, filled);
      expect(txt).toMatch(/I HEREBY RATIFY and confirm all lawful acts/);
      expect(txt).toMatch(/accept the above appointment and the limits placed on it/);
      expect(txt).toMatch(/ATTORNEY: _+/);
    }
  });

  it("is absent from the revocation deed, which has neither to give", () => {
    const txt = poaDraftText("revocation", filled);
    expect(txt).not.toMatch(/I HEREBY RATIFY/);
    expect(txt).not.toMatch(/accept the above appointment/);
  });

  it("puts ratification before the schedule and acceptance at the very end", () => {
    const txt = poaDraftText("purchase", filled);
    expect(txt.indexOf("I HEREBY RATIFY")).toBeLessThan(txt.indexOf("THE SCHEDULE ABOVE REFERRED TO"));
    expect(txt.indexOf("accept the above appointment")).toBeGreaterThan(txt.indexOf("APOSTILLE"));
  });
});

describe("termination trigger matches the document", () => {
  it("keeps 'completion of the acts' on sale and purchase", () => {
    for (const t of ["sale", "purchase"] as const) {
      expect(poaDraftText(t, filled)).toMatch(/or upon completion of the acts authorised above, whichever is earlier,/);
    }
  });

  it("drops it on a management POA, which has no completion point", () => {
    const txt = poaDraftText("manage", filled);
    expect(txt).not.toMatch(/completion of the acts authorised above/);
    expect(txt).toMatch(
      /shall stand automatically revoked on August 31, 2027, unless expressly extended by me in writing/,
    );
  });
});

describe("sale draft carries a TDS clause", () => {
  it("adds the Section 197 lower-deduction clause as clause 7", () => {
    const txt = poaDraftText("sale", filled);
    expect(txt).toMatch(/7\. To apply for, pursue and receive a certificate under Section 197 of the Income-tax Act, 1961/);
    expect(txt).toMatch(/Form 16A and the TDS certificate from the purchaser/);
  });

  it("renumbers the residual clause to 8 and updates its cross-reference", () => {
    const txt = poaDraftText("sale", filled);
    expect(txt).toMatch(/8\. To sign, verify and file such applications/);
    expect(txt).toMatch(/acts numbered 1 to 7 above/);
    expect(txt).not.toMatch(/acts numbered 1 to 6 above/);
  });
});

describe("regression guards from the review checklist", () => {
  it("keeps the key-field denominators at Sell 12, Buy 10, Manage 12, Revoke 9", () => {
    expect(draftProgress("sale", EMPTY_POA_DRAFT).total).toBe(12);
    expect(draftProgress("purchase", EMPTY_POA_DRAFT).total).toBe(10);
    expect(draftProgress("manage", EMPTY_POA_DRAFT).total).toBe(12);
    expect(draftProgress("revocation", EMPTY_POA_DRAFT).total).toBe(9);
  });

  it("never leaves a dangling comma or an empty gap where a field was blank", () => {
    // Signature and witness lines pad with runs of spaces on purpose, so the
    // "collapsed gap" check skips them and applies to prose lines only.
    const isPadded = (line: string) => /_{4,}/.test(line);
    for (const t of ALL) {
      const txt = poaDraftText(t, EMPTY_POA_DRAFT);
      expect(txt).not.toMatch(/,\s*,/);
      expect(txt).not.toMatch(/\s,/);
      expect(txt).not.toMatch(/\(\s*\)/);
      for (const line of txt.split("\n").filter((l) => !isPadded(l))) {
        expect(line, `collapsed gap in ${t}: ${line}`).not.toMatch(/ {3,}\S/);
      }
    }
  });

  it("still opens with the not-a-deed banner on every tab after the changes", () => {
    for (const t of ALL) {
      expect(poaDraftText(t, filled).split("\n\n")[0]).toBe(DRAFT_BANNER);
      expect(poaDraftText(t, EMPTY_POA_DRAFT).split("\n\n")[0]).toBe(DRAFT_BANNER);
    }
  });

  it("carries the full draft through to the final block in the PDF", async () => {
    const { buildLetterPdf } = await import("./letterPdf");
    for (const t of ALL) {
      const paras = buildPoaDraft(t, filled);
      const last = paras[paras.length - 1].text;
      expect(last.trim().length).toBeGreaterThan(0);
      expect(() => buildLetterPdf(paras)).not.toThrow();
      expect(buildLetterPdf(paras).byteLength).toBeGreaterThan(1000);
    }
  });
});
