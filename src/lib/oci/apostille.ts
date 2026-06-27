/**
 * OCI Apostille Need Checker — pure logic.
 *
 * Educational guidance only: it never decides an OCI case. It maps the
 * applicant's document situation to safe, VFS-checklist-first guidance about
 * whether apostille/attestation is likely involved and who handles it.
 */

export type ApplicantType = "adult" | "minor" | "spouse" | "";
export type DocType =
  | "birth"
  | "marriage"
  | "divorce"
  | "death"
  | "name-change"
  | "other"
  | "";
export type IssuedIn = "us" | "india" | "other" | "";
export type CertifiedCopy = "yes" | "no" | "unsure" | "";

export interface ApostilleInputs {
  applicant: ApplicantType;
  docType: DocType;
  issuedIn: IssuedIn;
  /** US state, when issuedIn === "us". */
  usState: string;
  certified: CertifiedCopy;
}

export const EMPTY_APOSTILLE: ApostilleInputs = {
  applicant: "",
  docType: "",
  issuedIn: "",
  usState: "",
  certified: "",
};

export const APPLICANT_OPTIONS: { value: ApplicantType; label: string }[] = [
  { value: "adult", label: "Adult" },
  { value: "minor", label: "Minor or newborn" },
  { value: "spouse", label: "Spouse-based OCI" },
];

export const DOC_OPTIONS: { value: DocType; label: string }[] = [
  { value: "birth", label: "Birth certificate" },
  { value: "marriage", label: "Marriage certificate" },
  { value: "divorce", label: "Divorce decree" },
  { value: "death", label: "Death certificate" },
  { value: "name-change", label: "Name-change order" },
  { value: "other", label: "Other" },
];

export const ISSUED_OPTIONS: { value: IssuedIn; label: string }[] = [
  { value: "us", label: "United States" },
  { value: "india", label: "India" },
  { value: "other", label: "Other country" },
];

export const CERTIFIED_OPTIONS: { value: CertifiedCopy; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

/** A handful of high-population states; the rest fall back to a generic note. */
export const US_STATES: { value: string; label: string }[] = [
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "NJ", label: "New Jersey" },
  { value: "NY", label: "New York" },
  { value: "IL", label: "Illinois" },
  { value: "other", label: "Another U.S. state" },
];

const STATE_AUTHORITY: Record<string, string> = {
  CA: "the California Secretary of State",
  TX: "the Texas Secretary of State (Authentications Unit)",
  NJ: "the NJ Division of Revenue & Enterprise Services",
  NY: "the New York Department of State (county-clerk certification is often required first)",
  IL: "the Illinois Secretary of State (Index Department)",
};

export interface ApostilleNote {
  tone: "info" | "positive" | "caution" | "attention" | "neutral";
  text: string;
}

export interface ApostilleResult {
  ready: boolean;
  /** Coarse label for analytics (never user inputs). */
  resultType: string;
  headline: string;
  tone: ApostilleNote["tone"];
  notes: ApostilleNote[];
}

export function evaluateApostille(i: ApostilleInputs): ApostilleResult {
  const ready = Boolean(i.applicant && i.docType && i.issuedIn);
  if (!ready) {
    return {
      ready: false,
      resultType: "incomplete",
      headline: "Tell us about your document to see guidance",
      tone: "neutral",
      notes: [
        {
          tone: "neutral",
          text: "Pick your applicant type, document, and where it was issued. Your answers stay in your browser.",
        },
      ],
    };
  }

  const notes: ApostilleNote[] = [];
  let headline = "";
  let tone: ApostilleNote["tone"] = "info";

  if (i.issuedIn === "us") {
    headline = "Apostille may be needed — handled by the issuing U.S. authority";
    tone = "info";
    const authority =
      i.usState && i.usState !== "other" && STATE_AUTHORITY[i.usState]
        ? `Use ${STATE_AUTHORITY[i.usState]}.`
        : "Use the apostille authority of the state that issued the document.";
    notes.push({
      tone: "info",
      text: `Apostille may be needed if the VFS checklist asks for apostille/attestation. ${authority} Usually submit a self-attested copy to VFS, not the original apostilled document.`,
    });
  } else if (i.issuedIn === "india") {
    headline = "Indian-issued documents are handled differently";
    tone = "caution";
    notes.push({
      tone: "caution",
      text: "Indian-issued documents are not apostilled by a U.S. state. Check the latest VFS checklist for how Indian-issued documents should be submitted.",
    });
  } else if (i.issuedIn === "other") {
    headline = "Apostille or mission attestation, depending on the country";
    tone = "info";
    notes.push({
      tone: "info",
      text: "You may need apostille from that country if it is part of the Hague Apostille Convention, or consular/mission attestation if not.",
    });
  }

  if (i.certified === "no") {
    notes.push({
      tone: "attention",
      text: "Order a certified government copy first. Photocopies and hospital certificates are usually not accepted for apostille/OCI.",
    });
  } else if (i.certified === "unsure") {
    notes.push({
      tone: "caution",
      text: "Not sure if it's a certified government copy? Confirm with the issuing vital-records office — only certified government records can be apostilled.",
    });
  }

  if (i.applicant === "minor") {
    notes.push({
      tone: "caution",
      text: "Hospital birth certificates are not accepted for OCI. Parent information on the birth certificate matters.",
    });
  } else if (i.applicant === "spouse") {
    notes.push({
      tone: "caution",
      text: "Spouse-based OCI has additional marriage documentation and eligibility rules. Verify using official OCI/VFS guidance.",
    });
  }

  notes.push({
    tone: "neutral",
    text: "Always follow the latest VFS checklist for your applicant type and consulate jurisdiction before mailing or uploading anything.",
  });

  return {
    ready: true,
    resultType: `${i.issuedIn}-${i.applicant}`,
    headline,
    tone,
    notes,
  };
}
