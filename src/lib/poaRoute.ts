/**
 * Pure decision logic behind the "Which POA route do I need?" builder on
 * /power-of-attorney-for-india-from-usa.
 *
 * Framework-agnostic and unit-tested (poaRoute.test.ts). The component only
 * renders what this returns — no rules live in JSX.
 *
 * Every rule here traces to the notes at the top of
 * src/data/nriPowerOfAttorneyData.ts. Educational only, not legal advice.
 */

export type PassportType = "" | "indian" | "us-oci" | "us-no-oci" | "other";
export type PoaPurpose = "" | "sell" | "buy" | "manage" | "banking" | "litigation" | "inherit";
export type YesNoUnsure = "" | "yes" | "no" | "unsure";

export interface PoaRouteInputs {
  /** What travel document the principal holds. */
  passport: PassportType;
  /** What the attorney needs to do in India. */
  purpose: PoaPurpose;
  /** Is the attorney a spouse/parent/child/sibling of the principal? */
  attorneyIsCloseRelative: YesNoUnsure;
  /** Can the principal realistically reach an Indian Mission / VFS centre? */
  canVisitConsulate: YesNoUnsure;
}

export const EMPTY_POA_ROUTE: PoaRouteInputs = {
  passport: "",
  purpose: "",
  attorneyIsCloseRelative: "",
  canVisitConsulate: "",
};

export const PASSPORT_OPTIONS: { value: PassportType; label: string }[] = [
  { value: "indian", label: "Indian passport" },
  { value: "us-oci", label: "US passport + OCI card" },
  { value: "us-no-oci", label: "US passport, no OCI" },
  { value: "other", label: "Other passport (with OCI or Indian origin)" },
];

export const PURPOSE_OPTIONS: { value: PoaPurpose; label: string }[] = [
  { value: "sell", label: "Sell a property in India" },
  { value: "buy", label: "Buy / register a property in India" },
  { value: "manage", label: "Rent out & manage a property" },
  { value: "inherit", label: "Inherited property — mutation / succession" },
  { value: "banking", label: "Operate an NRE / NRO account" },
  { value: "litigation", label: "A court case or dispute in India" },
];

export const RELATIVE_OPTIONS: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes — spouse, parent, child or sibling" },
  { value: "no", label: "No — a friend, agent or other relative" },
  { value: "unsure", label: "Not decided yet" },
];

export const CONSULATE_OPTIONS: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes — I can get to a VFS centre / consulate" },
  { value: "no", label: "No — mail-in or apostille only" },
  { value: "unsure", label: "Not sure" },
];

export type NoteTone = "info" | "positive" | "caution" | "attention" | "neutral";

export interface PoaNote {
  tone: NoteTone;
  text: string;
}

export interface PoaRouteResult {
  ready: boolean;
  /** Short label used for analytics — never a user-entered value. */
  resultType: string;
  /** Recommended instrument, e.g. "Special POA — sale of one property". */
  instrument: string;
  /** "Consular attestation" | "Notary + apostille" | either. */
  route: string;
  routeWhy: string;
  /** Must this POA be stamped AND registered in India? */
  mustRegister: boolean;
  registerWhy: string;
  /** Directional stamp-duty exposure. */
  stampExposure: string;
  /** Ordered document checklist for the US side. */
  documents: string[];
  notes: PoaNote[];
}

const BASE_DOCS = [
  "The POA drafted by an advocate in the Indian state where the property is situated",
  "Your passport — notarised copies of the first and last pages",
  "Notarised proof of your US status (visa, green card, EAD, I-797/I-140/I-20, or OCI card)",
  "Notarised proof of your US address",
  "A passport photograph to affix on the deed, signed across",
  "Two witnesses who are NOT your spouse or blood relatives, with full names and addresses",
];

const INSTRUMENT: Record<Exclude<PoaPurpose, "">, string> = {
  sell: "Special POA — sale of one named property",
  buy: "Special POA — purchase, payment and registration",
  manage: "Special POA — letting and management only",
  inherit: "Special POA — succession, mutation and khata transfer",
  banking: "Banking POA — NRE/NRO operation, plus your bank's own mandate",
  litigation: "Special POA — a single named matter, plus a vakalatnama for counsel",
};

/** Purposes that create or transfer an interest in immovable property. */
const REGISTRABLE: PoaPurpose[] = ["sell", "buy"];

export function evaluatePoaRoute(inputs: PoaRouteInputs): PoaRouteResult {
  const { passport, purpose, attorneyIsCloseRelative, canVisitConsulate } = inputs;

  if (!passport || !purpose) {
    return {
      ready: false,
      resultType: "incomplete",
      instrument: "",
      route: "",
      routeWhy: "",
      mustRegister: false,
      registerWhy: "",
      stampExposure: "",
      documents: [],
      notes: [],
    };
  }

  const notes: PoaNote[] = [];

  /* ── Route ────────────────────────────────────────────────────────────── */
  // A US passport holder without OCI is generally required to apostille the
  // deed before an Indian Mission will process it, so the apostille step is
  // unavoidable for that group.
  let route: string;
  let routeWhy: string;

  if (passport === "us-no-oci") {
    route = "Notary + Secretary of State apostille";
    routeWhy =
      "You hold a US passport without an OCI card. Indian Missions in the USA generally require the deed to be apostilled by the Secretary of State before they will process it, so the apostille is the step you cannot skip.";
    notes.push({
      tone: "caution",
      text: "As a US citizen without OCI you may also face separate restrictions on holding or acquiring agricultural land, plantation property or a farmhouse in India. Confirm your position under FEMA before committing to a purchase.",
    });
  } else if (canVisitConsulate === "no") {
    route = "Notary + Secretary of State apostille";
    routeWhy =
      "You cannot get to a consular centre, and the apostille route does not require you to. India has been a party to the Hague Apostille Convention since July 14, 2005, so an apostille from your state's Secretary of State is a complete authentication in its own right.";
  } else {
    route = "Either — consular attestation or notary + apostille";
    routeWhy =
      "Both routes are recognised: Section 33(1)(c) of the Registration Act, 1908 names a Notary Public and an Indian Consul or Vice-Consul side by side. Ask your Indian advocate which one the specific Sub-Registrar's office actually accepts, because local practice decides this, not the statute. Check your own consulate's checklist too — some US Missions now attest only an already-apostilled deed.";
  }

  /* ── Registration ─────────────────────────────────────────────────────── */
  const mustRegister = REGISTRABLE.includes(purpose);
  const registerWhy = mustRegister
    ? "This POA authorises dealing in immovable property, so treat registration at the Sub-Registrar's office as compulsory — Section 17(1)(b) of the Registration Act plus state amendments. Registration is also what lets your attorney present the deed and admit execution under Section 32(c)."
    : purpose === "inherit"
      ? "Succession and mutation offices vary widely on whether they will accept an unregistered POA. Assume registration will be asked for and confirm with the local office before you execute."
      : "A POA limited to management, banking or a court matter is usually not compulsorily registrable — but it must still be properly stamped, and your bank or the court will apply its own acceptance rules.";

  /* ── Stamp duty exposure ──────────────────────────────────────────────── */
  let stampExposure: string;
  if (purpose === "banking" || purpose === "litigation") {
    stampExposure =
      "Nominal fixed duty in most states — no interest in immovable property is being passed.";
  } else if (attorneyIsCloseRelative === "yes") {
    stampExposure =
      "Likely nominal fixed duty. Most states charge a small fixed amount where the authority is given to a spouse, parent, child or sibling without consideration. Keep the deed free of any consideration or development rights to stay in this bracket.";
  } else if (attorneyIsCloseRelative === "no") {
    stampExposure =
      "Potentially CONVEYANCE-RATE duty. Several states charge duty as though it were a sale where a property POA is given to a non-relative for consideration, coupled with possession, or carrying development rights. Have it adjudicated by the Collector of Stamps rather than guessing the article.";
    notes.push({
      tone: "attention",
      text: "The close-relative distinction is the largest single cost variable here. If a family member can hold the POA instead, the stamp duty difference alone usually dwarfs every other cost on this page.",
    });
  } else {
    stampExposure =
      "Depends on who you appoint. A spouse, parent, child or sibling generally attracts nominal fixed duty; a non-relative holding a property POA for consideration can attract duty at conveyance rates in several states.";
  }

  /* ── Documents ────────────────────────────────────────────────────────── */
  const documents = [...BASE_DOCS];

  if (passport === "us-no-oci") {
    documents.splice(1, 1, "Your US passport — notarised copy of the biographic page");
    documents.push("The deed apostilled by the Secretary of State of the state where it was notarised");
  } else if (passport === "us-oci" || passport === "other") {
    documents.push("A notarised copy of your OCI card (front and back)");
  }

  if (purpose === "sell" || purpose === "buy" || purpose === "manage" || purpose === "inherit") {
    documents.push("A copy of the title deed, so the Schedule of Property matches it word for word");
    documents.push("Your PAN, and the NRO account number that must receive any money");
  }
  if (purpose === "inherit") {
    documents.push("The death certificate and the legal-heir or succession document relied on");
  }
  if (purpose === "banking") {
    documents.push("Your bank's own POA form or mandate — the deed alone is rarely enough");
  }
  if (purpose === "litigation") {
    documents.push("The case number and the court or authority before which the matter is pending");
  }

  documents.push("The Mission's application form and the prescribed fees, in the exact instruments it accepts");

  /* ── Universal notes ──────────────────────────────────────────────────── */
  notes.push({
    tone: "attention",
    text: "Once the deed reaches India you have three months to get it stamped — Section 18 of the Indian Stamp Act, 1899 runs from first receipt in India, not from the date you signed it. Late stamping risks impounding and penalty duty.",
  });

  if (purpose === "sell" || purpose === "buy") {
    notes.push({
      tone: "caution",
      text: "A POA is an authority to act, never a transfer of title. In Suraj Lamp & Industries (P) Ltd v State of Haryana (October 11, 2011) the Supreme Court held that SA/GPA/WILL transactions do not convey title. Only a registered conveyance does.",
    });
  }

  if (purpose === "banking") {
    notes.push({
      tone: "info",
      text: "FEMA caps what your POA holder can do regardless of your drafting: local rupee payments yes, remitting your current income abroad net of tax yes — but no repatriation abroad to anyone other than you, and no gifts to residents on your behalf.",
    });
  }

  notes.push({
    tone: "positive",
    text: "Grant one Special POA per purpose with an expiry date, an enumerated list of acts, an express exclusion list and your NRO account named as the only destination for money. That combination is what a buyer's counsel accepts and what protects you.",
  });

  return {
    ready: true,
    resultType: `${purpose}:${passport}`,
    instrument: INSTRUMENT[purpose],
    route,
    routeWhy,
    mustRegister,
    registerWhy,
    stampExposure,
    documents,
    notes,
  };
}
