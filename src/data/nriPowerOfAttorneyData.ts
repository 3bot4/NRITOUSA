/**
 * Shared, EDITABLE config + content for /power-of-attorney-for-india-from-usa
 * (Power of Attorney for NRIs: executing an India POA from the USA).
 *
 * IMPORTANT: Never hardcode fees, timelines, statute sections or stamp-duty
 * figures into the page — every figure comes from this file so a single edit
 * updates the page, the FAQ and the JSON-LD together.
 *
 * Verified 2026-08-19 against the sources exported at the bottom of this file:
 *  - Registration Act, 1908 s.33(1)(c): where the principal does not reside in
 *    India, a power-of-attorney executed before AND authenticated by a Notary
 *    Public, or any Court, Judge, Magistrate, Indian Consul or Vice-Consul, or
 *    representative of the Central Government is recognised for s.32 purposes
 *    (i.e. lets the attorney PRESENT a document for registration).
 *  - Hague Apostille Convention entered into force for India on 14 July 2005
 *    (instrument of accession deposited 26 Oct 2004) — an apostille from a
 *    member state replaces consular legalisation.
 *  - Indian Stamp Act, 1899 s.18: an instrument (other than a bill/note)
 *    executed only out of India may be stamped within THREE MONTHS after it is
 *    first received in India. Missing that window exposes the instrument to
 *    impounding + penalty (Andhra Pradesh HC).
 *  - Registration Act, 1908 s.17(1)(b) + state amendments (Maharashtra, Tamil
 *    Nadu, Odisha and others): a POA that authorises sale/transfer of
 *    immovable property, or creates an interest in it, is compulsorily
 *    registrable. Treat registration as the default for any property POA.
 *  - Suraj Lamp & Industries (P) Ltd v State of Haryana, decided 11 Oct 2011:
 *    SA/GPA/WILL transactions do NOT convey title. Only a registered
 *    conveyance transfers immovable property (s.54 TPA + s.17 Registration
 *    Act). A POA is an authority to ACT, never a way to buy or sell title.
 *  - Indian Contract Act, 1872 ss.201-202: agency terminates on revocation,
 *    death, unsoundness of mind or insolvency of the principal; an agency
 *    coupled with interest is irrevocable to the extent of that interest.
 *  - RBI / FEMA (Deposit) Regulations: a RESIDENT POA holder operating an
 *    NRE/NRO account is limited to local rupee payments (and, for NRO,
 *    remittance of current income net of tax); the POA holder may NOT
 *    repatriate funds abroad other than to the account holder himself, and may
 *    NOT make gifts to residents on the account holder's behalf.
 *  - Consular fees/processing: published per-jurisdiction by the Indian
 *    Mission and its outsourced partner. Figures below are marked DIRECTIONAL
 *    and must be re-verified against your own consulate before relying on them.
 *
 * Educational information only — not legal, tax or investment advice.
 */
import type { FaqItem } from "@/lib/seo";

/* ────────────────────────────── Config ─────────────────────────────────── */

/** Bump POA_UPDATED (and the human string) on every content change. */
export const POA_PUBLISHED = "2026-08-19";
export const POA_UPDATED = "2026-08-19";
export const POA_UPDATED_HUMAN = "August 19, 2026";

export const poaConfig = {
  lastVerified: "2026-08-19",
  lastVerifiedHuman: "August 19, 2026",
  /** Statutory window to stamp an instrument executed outside India. */
  stampWindowMonths: 3,
  /** Number of witnesses Indian Missions in the USA typically require. */
  witnessCount: 2,
  /** Hague Apostille Convention entry into force for India. */
  apostilleInForce: "July 14, 2005",
  /** Statute references used in copy — change here, not in JSX. */
  sections: {
    registrationAuth: "Section 33(1)(c), Registration Act, 1908",
    registrationPresent: "Section 32(c), Registration Act, 1908",
    registrationCompulsory: "Section 17(1)(b), Registration Act, 1908",
    stampOutsideIndia: "Section 18, Indian Stamp Act, 1899",
    stampAdjudication: "Sections 31–32, Indian Stamp Act, 1899",
    transferOfProperty: "Section 54, Transfer of Property Act, 1882",
    agencyTermination: "Sections 201–202, Indian Contract Act, 1872",
    poaAct: "Powers of Attorney Act, 1882",
  },
  /** Landmark judgment that kills the "GPA sale" idea. */
  surajLamp: {
    name: "Suraj Lamp & Industries (P) Ltd v State of Haryana",
    decided: "October 11, 2011",
  },
} as const;

export const POA_DISCLAIMER =
  "A power of attorney over Indian property is a high-value legal instrument that hands another person the ability to sign in your name. Stamp duty, registration requirements and sub-registrar practice are STATE-specific and change; consular documents, fees and checklists are jurisdiction-specific and change without notice. The specimen wording on this page is an educational starting point to discuss with counsel — it is not a drafted deed, it has not been settled for your state, your property or your facts, and it should never be signed as-is. Engage an advocate in the Indian state where the property is situated before executing anything. Educational information only — not legal, tax or investment advice.";

/* ──────────────────────── Fast-answer snapshot ─────────────────────────── */

export const poaFastAnswer: { label: string; value: string; note?: string; highlight?: boolean }[] = [
  {
    label: "Two lawful routes from the USA",
    value: "Consular attestation OR notary + apostille",
    note: "Both are named in Section 33(1)(c) of the Registration Act, 1908",
    highlight: true,
  },
  {
    label: "Best instrument for property",
    value: "Special (specific) POA — never a wide General POA",
    note: "One property, one named attorney, a listed set of acts, an end date",
  },
  {
    label: "Deadline once it lands in India",
    value: "Stamp within 3 months of first receipt",
    note: "Section 18, Indian Stamp Act, 1899 — late stamping risks impounding + penalty",
    highlight: true,
  },
  {
    label: "Registration",
    value: "Compulsory for a POA that authorises sale or transfer",
    note: "Section 17(1)(b) plus state amendments — treat as the default, not the exception",
  },
  {
    label: "Witnesses on the deed",
    value: "2, and not your spouse or blood relatives",
    note: "Standard Indian Mission requirement in the USA",
  },
  {
    label: "Typical consular turnaround",
    value: "About 10 business days after it reaches the Consulate",
    note: "Excludes courier time both ways — build in 3–5 weeks end to end",
  },
];

/* ─────────────────────────── Types of POA ──────────────────────────────── */

export interface PoaType {
  id: string;
  name: string;
  scope: string;
  bestFor: string;
  risk: string;
  verdict: "recommended" | "situational" | "avoid";
}

export const poaTypes: PoaType[] = [
  {
    id: "spa-sale",
    name: "Special POA — sale of one property",
    scope:
      "Names one property by survey/khata/flat number and authorises a listed set of acts: execute the sale deed, present it for registration, admit execution before the Sub-Registrar, receive consideration into your named NRO account, hand over possession, and complete mutation.",
    bestFor: "An NRI selling a single flat, plot or house in India without flying back.",
    risk: "Low, if the property is described precisely and the powers stop at that property.",
    verdict: "recommended",
  },
  {
    id: "spa-purchase",
    name: "Special POA — purchase and registration",
    scope:
      "Authorises your attorney to sign the sale deed as purchaser, pay stamp duty and registration fees, present the deed and admit execution, take possession, and apply for mutation and khata transfer in your name.",
    bestFor: "Buying under construction or resale property while you are in the USA.",
    risk: "Low to moderate — cap the consideration the attorney may pay, in words and figures.",
    verdict: "recommended",
  },
  {
    id: "spa-admin",
    name: "Special POA — property management",
    scope:
      "Let and manage a named property: sign leave-and-licence or rental agreements, collect rent into your NRO account, pay property tax, society dues and utilities, and deal with the society or builder.",
    bestFor: "A rented-out flat in India that needs a local hand for routine matters.",
    risk: "Low — but expressly EXCLUDE any power to sell, mortgage, gift or create a charge.",
    verdict: "recommended",
  },
  {
    id: "banking",
    name: "Banking POA — NRE / NRO account operations",
    scope:
      "Lets a resident operate your NRE/NRO account within the limits RBI permits. Most banks insist on their own POA form or mandate in addition to your deed.",
    bestFor: "Local rupee payments — EMIs, taxes, society dues, maintenance — from your NRO account.",
    risk: "Bounded by FEMA, not by your drafting: a resident POA holder cannot repatriate funds abroad other than to you, and cannot gift from the account.",
    verdict: "situational",
  },
  {
    id: "litigation",
    name: "POA for litigation / vakalatnama support",
    scope:
      "Authorises a named person to instruct counsel, sign pleadings and affidavits, appear before authorities, and settle or compromise a specific matter you identify by case number.",
    bestFor: "A pending suit, partition matter, or a tax or society dispute in India.",
    risk: "Moderate — the power to compromise or withdraw a suit should be a conscious, separate grant.",
    verdict: "situational",
  },
  {
    id: "gpa",
    name: "General POA — broad, open-ended authority",
    scope:
      "Sweeping authority over all your Indian assets and affairs, usually with no end date and no property named.",
    bestFor:
      "Almost nothing in an NRI's life. Sub-registrars scrutinise it, banks push back on it, and it is the instrument behind most family property litigation.",
    risk:
      "High. It survives your intentions, is hard to police from 8,000 miles away, and attracts conveyance-rate stamp duty in several states when given to a non-relative.",
    verdict: "avoid",
  },
];

/* ────────── Power of attorney to sell property in India: the acts ─────────
 * The 50/mo head term. A sale POA is accepted or rejected at the counter on
 * whether these specific acts are enumerated in it — so they are listed as
 * data, not prose, and the page renders them as a checklist. */

export const sellPropertyActs: { act: string; why: string }[] = [
  {
    act: "Execute and sign the agreement to sell and the sale deed",
    why: "The core act. Without it in words, your attorney can negotiate but cannot sign, and the deal dies at the drafting table.",
  },
  {
    act: "Present the sale deed for registration before the named Sub-Registrar",
    why: "A separate act from signing. Presentation is what Section 32(c) of the Registration Act governs, and it is the reason the POA itself has to be authenticated under Section 33(1)(c).",
  },
  {
    act: "Admit execution before the Sub-Registrar",
    why: "The registry asks the presenting party to admit that the deed was executed. An attorney who can sign but cannot admit execution stalls at the counter.",
  },
  {
    act: "Receive the sale consideration — into your named NRO account only",
    why: "Name the bank, branch and account number. This single clause closes off the most damaging failure mode in the entire instrument.",
  },
  {
    act: "Deliver vacant possession on registration and full payment",
    why: "Tie possession to both events. A POA that lets possession pass before the money lands is how NRI families lose control of a property.",
  },
  {
    act: "Apply for mutation, khata transfer and utility name changes",
    why: "The sale is not finished at registration. Somebody has to move the municipal and utility records, and the buyer will hold your money back until it happens.",
  },
  {
    act: "Sign the affidavits, indemnities and undertakings the registry requires",
    why: "Narrow it to what is strictly necessary to complete the acts above — never a free-standing power to sign anything.",
  },
];

/* ─────────── Does a POA need to be registered in India? (≈60/mo) ────────── */

export const registrationRules: { situation: string; answer: string; basis: string }[] = [
  {
    situation: "The POA authorises sale or transfer of immovable property",
    answer: "Yes — treat registration as compulsory",
    basis:
      "Section 17(1)(b) of the Registration Act, 1908, plus amendments adopted in states including Maharashtra, Tamil Nadu and Odisha. Registration is also what lets the attorney present the deed and admit execution under Section 32(c).",
  },
  {
    situation: "The POA is coupled with possession, consideration or development rights",
    answer: "Yes — and expect conveyance-rate stamp duty with it",
    basis:
      "The instrument is treated as effectively transferring an interest, so it is both registrable and stamped like the transaction it really is.",
  },
  {
    situation: "The POA only lets someone present an already-executed document for registration",
    answer: "Authentication is the requirement, not registration",
    basis:
      "Section 33(1)(c) recognises a POA executed before and authenticated by a Notary Public or an Indian Consul where the principal does not reside in India.",
  },
  {
    situation: "The POA is for letting, rent collection, society dues and repairs only",
    answer: "Usually not compulsorily registrable",
    basis:
      "No interest in the property passes. Keep an express bar on sale, mortgage and gift in the deed so it stays in this bracket — and stamp it properly regardless.",
  },
  {
    situation: "The POA is for operating an NRE/NRO account or running a court matter",
    answer: "Not registrable, but institution-specific rules apply",
    basis:
      "Your bank will require its own POA form or mandate; a court will apply its own filing practice. Registration is not the gate here — acceptance by the institution is.",
  },
];

/* ─────────────── Route A: Indian Consulate / VFS attestation ───────────── */

export interface RouteStep {
  step: string;
  detail: string;
  watchOut?: string;
}

export const consularRoute: RouteStep[] = [
  {
    step: "Get the deed drafted in India first",
    detail:
      "Have an advocate in the state where the property sits draft the POA — the acceptable wording, the schedule of property, and the stamp article all depend on that state, not on where you live. Ask for it as an editable file so you can print it in the USA.",
    watchOut:
      "A template downloaded from a US website is the single most common reason a POA is rejected at the Sub-Registrar's counter.",
  },
  {
    step: "Print it, but do not sign it yet",
    detail:
      "Print on plain paper (the Indian stamp paper is bought later, in India). Leave the signature blocks blank until you are in front of the notary or the consular officer, and affix your photograph where the deed provides for it.",
    watchOut:
      "Missions in the USA generally require your photo affixed on the last page and your signature across it.",
  },
  {
    step: "Sign before a Notary Public with two witnesses",
    detail:
      "Sign in the notary's presence. Your two witnesses sign in the same sitting, with their full names, addresses and signatures. Indian Missions in the USA require witnesses who are neither your spouse nor blood relatives.",
    watchOut:
      "Some jurisdictions instead require you to sign at the counter in front of the consular officer. Confirm with your own Mission before you sign anything.",
  },
  {
    step: "Assemble the Mission's document set",
    detail:
      "Typically: the official application form, the original signed POA plus a photocopy, notarised copies of your passport's first and last pages, notarised proof of US status (visa, green card, EAD, I-797/I-140/I-20 or OCI card) and notarised proof of US address.",
    watchOut:
      "Check whether your Mission wants the deed apostilled FIRST. A US passport holder without an OCI card almost always has to apostille before the Mission will look at it — and some jurisdictions now require the Secretary of State apostille before consular attestation regardless of which passport you hold. That turns Route A into Route A plus Route B, and adds weeks.",
  },
  {
    step: "Submit through VFS Global or in person",
    detail:
      "Indian consular services in the USA are submitted through the outsourced service partner — in person at a centre, or by mail after paying online. The centre checks the file and forwards it to the Consulate.",
    watchOut:
      "Mail-in files usually require every supporting copy to be notarised; walk-ins with originals often do not. The two checklists are different.",
  },
  {
    step: "Pay the Government of India fee, the ICWF levy and the service charge",
    detail:
      "Three separate line items. Several Missions insist on cashier's cheques or money orders in exact amounts, drawn in favour of the named Consulate — personal cheques, cash and cards are commonly refused.",
    watchOut:
      "The amounts differ per jurisdiction and per number of executants. A husband and wife signing the same deed usually pay twice.",
  },
  {
    step: "Collect the attested deed and courier it to India",
    detail:
      "Budget roughly ten business days from the day the file reaches the Consulate, plus courier time each way. Send the attested original — not a scan — to your attorney in India.",
    watchOut:
      "Track the courier. A registrable POA has no substitute: if the original is lost you start over from the drafting step.",
  },
];

/* ─────────────── Route B: US notary + Secretary of State apostille ─────── */

export const apostilleRoute: RouteStep[] = [
  {
    step: "Sign before a Notary Public with two witnesses",
    detail:
      "Same as the consular route: the deed is drafted in India, printed on plain paper in the USA, and signed only in the notary's presence with two non-relative witnesses.",
    watchOut:
      "The notarial certificate must be complete — commission number, expiry, county and seal. An apostille office will reject an incomplete acknowledgment outright.",
  },
  {
    step: "Send it to the Secretary of State of the SAME state",
    detail:
      "The apostille is issued at state level by the Secretary of State that commissioned your notary. A deed notarised in California is apostilled by California; one notarised in New York by the New York Department of State.",
    watchOut:
      "Notarise in the state you actually live in. A cross-state notarisation turns a two-week errand into a month of chasing county clerks.",
  },
  {
    step: "Rely on the Hague Convention, not on a second attestation",
    detail:
      "India has been a party to the Hague Apostille Convention since " +
      poaConfig.apostilleInForce +
      ". An apostille from a member state is, by treaty, the complete authentication — no Indian Embassy or Consulate stamp is legally required on top of it.",
    watchOut:
      "Practice is not always the law: some conservative Sub-Registrars still ask for a consular stamp. Ask your Indian advocate which the local office actually accepts BEFORE choosing a route.",
  },
  {
    step: "Courier the apostilled original to India",
    detail:
      "The apostille is a separate certificate attached to the deed. Keep the staple and the seal intact — never separate the pages to scan them.",
    watchOut:
      "Scan the whole set for your records first. You will need the reference numbers if the courier goes missing.",
  },
];

/* ─────────────────── What happens after it lands in India ──────────────── */

export const indiaSteps: RouteStep[] = [
  {
    step: "Stamp it within three months of arrival in India",
    detail:
      "Section 18 of the Indian Stamp Act, 1899 gives you three months after the deed is FIRST received in India to have it stamped. The clock starts on arrival, not on the date you signed it in the USA.",
    watchOut:
      "An unstamped or under-stamped POA can be impounded and charged penalty duty — courts have held exactly that. This is the deadline NRIs miss most often.",
  },
  {
    step: "Have it adjudicated where the correct duty is unclear",
    detail:
      "Where the right duty is not obvious — a POA to a non-relative, or one carrying consideration or development rights — take it to the Collector of Stamps for adjudication under Sections 31–32 and pay the duty determined.",
    watchOut:
      "Adjudication is cheap insurance. Guessing the article and under-paying is what converts a small fee into a penalty years later.",
  },
  {
    step: "Register it at the Sub-Registrar's office where the property is",
    detail:
      "A POA that authorises sale or transfer of immovable property is compulsorily registrable under Section 17(1)(b) and the state amendments. Your attorney attends with the deed, their ID, photographs and two witnesses.",
    watchOut:
      "Registration is what lets your attorney present the sale deed and admit execution under Section 32(c). Skipping it does not save money — it stops the transaction.",
  },
  {
    step: "Only then let the attorney act",
    detail:
      "With the deed authenticated, stamped and registered, your attorney can execute and present the sale deed, admit execution, receive consideration into your named NRO account, and complete mutation and khata transfer.",
    watchOut:
      "The buyer's lawyer will read the POA line by line. Any act not listed in it is an act your attorney cannot perform, and the deal stalls at the counter.",
  },
];

/* ──────────────────────── When you need one (and don't) ────────────────── */

export const whenYouNeedPoa: string[] = [
  "You are selling a flat, plot or house in India and cannot be physically present to sign the sale deed and admit execution before the Sub-Registrar.",
  "You are buying property in India and someone must sign as purchaser, pay stamp duty and take possession on your behalf.",
  "A property has to be registered, mutated or transferred into your name and the office requires a physical signature at the counter.",
  "You own a rented property in India and need a local person to sign leases, collect rent into your NRO account and pay society dues and property tax.",
  "You are a co-owner and the other co-owners are proceeding with a sale, partition or development agreement that needs every owner's signature.",
  "An inherited property needs succession or mutation formalities completed while you are abroad.",
  "A pending suit, tax matter or society dispute needs someone in India to instruct counsel and sign pleadings.",
];

export const whenYouDontNeedPoa: string[] = [
  "Filing your Indian income tax return — an authorised CA or e-return intermediary handles that without a POA.",
  "Routine NRE/NRO banking you can do yourself through net banking. A POA hands over standing access you may not want to give.",
  "Selling listed shares or mutual funds — the broker's and AMC's own mandates cover it, and are far narrower than a property POA.",
  "Anything where you can realistically fly to India inside the deal timeline. Signing in person is always cleaner than a POA.",
  "Applying for an OCI card, passport renewal or visa — these have their own consular processes with no POA route.",
];

/* ──────────────────────── Clauses that must be in it ───────────────────── */

export interface PoaClause {
  clause: string;
  why: string;
}

export const essentialClauses: PoaClause[] = [
  {
    clause: "Full identification of the principal",
    why: "Your name exactly as it appears on the title deed, passport number, PAN, OCI number where applicable, and your US address. A mismatch between the title deed and the passport is the single most common counter-side objection.",
  },
  {
    clause: "Full identification of the attorney",
    why: "Name, relationship to you, Aadhaar/PAN, and Indian address. Sub-registrars verify the attorney's identity against the deed; an incomplete description invites a rejection.",
  },
  {
    clause: "A schedule of property, not a description",
    why: "Survey number, plot or flat number, floor, built-up area, boundaries, khata/property tax number and the registered document number under which you hold it. 'My flat in Pune' is not a schedule.",
  },
  {
    clause: "An enumerated list of powers",
    why: "Each act spelled out: execute the sale deed, present it for registration, admit execution, receive consideration, hand over possession, apply for mutation. A power not written is a power not granted.",
  },
  {
    clause: "An express exclusion list",
    why: "State what the attorney may NOT do — no mortgage, no gift, no lease beyond a stated term, no creation of any charge, no sale below a stated floor price. Exclusions are read strictly and protect you.",
  },
  {
    clause: "Where the money must go",
    why: "Name your NRO account and account number as the only permitted destination for sale consideration. This closes off the most damaging failure mode in the whole instrument.",
  },
  {
    clause: "A price floor and a consideration cap",
    why: "For a sale, a minimum acceptable consideration in words and figures. For a purchase, a maximum. Without it your attorney's commercial judgement replaces yours.",
  },
  {
    clause: "An expiry date",
    why: "A POA with no end date is a permanent liability. Six to twelve months, extendable by a fresh deed, matches how long an Indian property transaction actually takes.",
  },
  {
    clause: "A ratification clause",
    why: "Confirms acts lawfully done within the granted powers, so a buyer's counsel is satisfied the sale deed binds you. It should be limited to acts within the authority, never a blanket ratification.",
  },
  {
    clause: "Photographs, signatures and two witnesses",
    why: "Your photo affixed and signed across, the attorney's photo where the state requires it, and two witnesses who are not your spouse or blood relatives, with full addresses.",
  },
];

/* ─────────────────────────── Costs (directional) ───────────────────────── */

/**
 * DIRECTIONAL ONLY. Consular fees are set per Mission and revised without
 * notice; stamp duty is state law. Every row must be re-verified before use —
 * the page renders the `verify` note alongside the table for that reason.
 */
export const poaCostRows: { item: string; typical: string; note: string }[] = [
  {
    item: "US Notary Public",
    typical: "$5–$25 per signature",
    note: "State-capped in many states; banks and UPS/FedEx counters often notarise for account holders at no charge.",
  },
  {
    item: "Secretary of State apostille",
    typical: "$3–$25 per document",
    note: "Set by each state. Expedited counter service and courier add to it.",
  },
  {
    item: "Government of India consular fee",
    typical: "About $20 per document",
    note: "Published per Mission. A deed with two executants is generally charged twice.",
  },
  {
    item: "Indian Community Welfare Fund (ICWF) levy",
    typical: "About $2 per document",
    note: "A separate line item, usually a separate instrument of payment.",
  },
  {
    item: "Outsourced service-partner charge",
    typical: "About $19 per application",
    note: "Charged by the Mission's service partner on top of the Government fee.",
  },
  {
    item: "Courier, both directions",
    typical: "$60–$150",
    note: "Trackable international courier for the original. Do not economise here.",
  },
  {
    item: "Indian stamp duty on the POA",
    typical: "Nominal, or conveyance-rate",
    note: "See the stamp-duty rule below — the difference between the two is the largest number in this table.",
  },
  {
    item: "Registration fee + advocate's drafting fee",
    typical: "Varies by state and counsel",
    note: "Ask your advocate for drafting, adjudication, registration and follow-up as one quoted scope.",
  },
];

export const stampDutyRule: { scenario: string; treatment: string; why: string }[] = [
  {
    scenario: "POA to a close relative, no consideration, no development rights",
    treatment: "Nominal fixed duty",
    why: "Several states define a family class — spouse, parent, child, sibling — and charge a small fixed amount when the authority is given without consideration.",
  },
  {
    scenario: "POA to a non-relative, with consideration or coupled with possession",
    treatment: "Duty commonly charged as on a conveyance",
    why: "State stamp acts treat a POA that is effectively a transfer as a transfer. This is where a casually drafted GPA becomes ruinously expensive.",
  },
  {
    scenario: "POA to a developer with development rights",
    treatment: "Conveyance-rate duty in most states",
    why: "The instrument transfers economic control of the land, so it is stamped like the transaction it really is.",
  },
  {
    scenario: "Pure management POA — rent, dues, repairs, no power to transfer",
    treatment: "Nominal fixed duty",
    why: "No interest in the property passes, so the nominal article applies. Keep the exclusion list explicit to stay in this bracket.",
  },
];

/* ────────────────────────── Banking / FEMA limits ──────────────────────── */

export const bankingPoaLimits: { rule: string; detail: string; allowed: boolean }[] = [
  {
    rule: "Local rupee payments from your NRO account",
    detail:
      "Your resident POA holder may make all local payments in rupees on your behalf, including payments for eligible investments, subject to the relevant regulations.",
    allowed: true,
  },
  {
    rule: "Remitting your current Indian income abroad from the NRO account",
    detail:
      "Permitted — remittance outside India of current income in India of the non-resident account holder, net of applicable taxes.",
    allowed: true,
  },
  {
    rule: "Withdrawals for local payments from your NRE account",
    detail:
      "Operations on an NRE account through a POA are restricted to withdrawals for local payments, or remittance to the account holder himself through banking channels.",
    allowed: true,
  },
  {
    rule: "Repatriating funds abroad to anyone other than you",
    detail:
      "A resident POA holder shall not repatriate funds held in your NRE or NRO account outside India under any circumstances other than to you, the account holder.",
    allowed: false,
  },
  {
    rule: "Making a gift to a resident on your behalf",
    detail:
      "A resident POA holder cannot make payment by way of gift to a resident on behalf of the non-resident account holder.",
    allowed: false,
  },
  {
    rule: "Opening the NRE/NRO account itself",
    detail:
      "Account opening is yours to do — a POA holder operates an existing account within the permitted limits; banks additionally insist on their own POA form or mandate.",
    allowed: false,
  },
];

/* ────────────────────────────── Red flags ──────────────────────────────── */

export const poaRedFlags: { flag: string; detail: string }[] = [
  {
    flag: "Buying or selling property 'on GPA'",
    detail:
      "In " +
      poaConfig.surajLamp.name +
      " (" +
      poaConfig.surajLamp.decided +
      ") the Supreme Court held that SA/GPA/WILL transactions do not convey title and are not a valid mode of transfer of immovable property. Only a registered conveyance transfers title. If a broker offers you a GPA-based deal at a discount, the discount is the litigation risk.",
  },
  {
    flag: "An open-ended General POA over 'all my properties in India'",
    detail:
      "It survives the transaction it was created for, cannot be policed from abroad, and in several states attracts conveyance-rate stamp duty when the holder is not a close relative. Grant a Special POA per property instead.",
  },
  {
    flag: "No expiry date",
    detail:
      "A POA without an end date remains capable of being acted on until it is formally revoked and everyone relying on it has notice. Put a date in the deed.",
  },
  {
    flag: "Sale proceeds payable to the attorney",
    detail:
      "Consideration must be routed to your named NRO account. An attorney authorised to 'receive and deal with' proceeds is the fact pattern behind most NRI property recovery suits.",
  },
  {
    flag: "Signing a template found online",
    detail:
      "Wording, the stamp article, the schedule format and even the photograph placement are state-specific. A generic template is rejected at the counter — after you have already paid consular fees and couriered it 8,000 miles.",
  },
  {
    flag: "Assuming the POA outlives you",
    detail:
      "Under Sections 201–202 of the Indian Contract Act, agency terminates on the principal's death, unsoundness of mind or insolvency — unless the agency is coupled with an interest. A POA is not a substitute for a will or for a properly planned estate.",
  },
  {
    flag: "Letting the three-month stamping window lapse",
    detail:
      "Section 18 of the Indian Stamp Act gives three months from first receipt in India. Deeds that sit in a relative's drawer for a year come back as impounded instruments with penalty duty.",
  },
];

/* ─────────────────────────── Revocation ────────────────────────────────── */

export const revocationSteps: RouteStep[] = [
  {
    step: "Execute a Deed of Revocation the same way you executed the POA",
    detail:
      "Draft in India, sign before a Notary Public in the USA with two witnesses, then either attest at the Indian Mission or apostille through your Secretary of State — matching the route used for the original.",
  },
  {
    step: "Register the revocation where the POA was registered",
    detail:
      "If the POA was registered, the revocation must go on record at the same Sub-Registrar's office. An unregistered revocation of a registered POA leaves a live document on the public record.",
  },
  {
    step: "Give the attorney written notice",
    detail:
      "Serve the revocation on the attorney by a trackable method and keep proof. Acts done by an attorney before notice reaches them can still bind you.",
  },
  {
    step: "Notify everyone relying on it",
    detail:
      "Your bank, the housing society, tenants, the builder, the buyer's counsel and any court where the POA has been filed. Each needs its own written intimation.",
  },
  {
    step: "Publish a public notice",
    detail:
      "A notice in a newspaper circulating where the property is situated is standard practice and cheap evidence that third parties had constructive notice.",
  },
  {
    step: "Know what you cannot revoke",
    detail:
      "Under Section 202 of the Indian Contract Act, an agency coupled with an interest cannot be terminated to the prejudice of that interest. If you granted a developer or lender an interest, revocation may not be yours to make unilaterally.",
  },
];

/* ──────────────────────────── Timeline ─────────────────────────────────── */

export const poaTimeline: { phase: string; detail: string }[] = [
  {
    phase: "Week 0 — brief an advocate in the property's state",
    detail:
      "Send the title deed, the tax receipt, your passport and OCI details, and the name of your intended attorney. Ask for the draft plus written confirmation of the local Sub-Registrar's requirements.",
  },
  {
    phase: "Week 1 — receive and read the draft",
    detail:
      "Check the schedule of property against the title deed word for word. Confirm the enumerated powers, the exclusions, the price floor, the NRO account and the expiry date are all in it.",
  },
  {
    phase: "Week 1–2 — sign before a notary with two witnesses",
    detail:
      "Print on plain paper, affix your photo, sign only in the notary's presence. Do not sign in advance, even to 'save a trip'.",
  },
  {
    phase: "Week 2–4 — attestation or apostille",
    detail:
      "Consular route: submit through the service partner and allow about ten business days after the file reaches the Consulate. Apostille route: allow your state's published turnaround plus courier.",
  },
  {
    phase: "Week 4–5 — courier the original to India",
    detail:
      "Trackable international courier of the original attested or apostilled deed. Scan everything before it leaves your hands.",
  },
  {
    phase: "Within 3 months of arrival — stamp, adjudicate, register",
    detail:
      "The Section 18 clock starts when the deed is first received in India. Stamping, adjudication where needed, and registration at the Sub-Registrar all sit inside that window.",
  },
  {
    phase: "Then — the attorney acts",
    detail:
      "Execution and presentation of the sale deed, admission of execution, receipt of consideration into your NRO account, possession, mutation and khata transfer.",
  },
];

/* ─────────────────── Keyword clusters (visible, semantic) ──────────────── */

/**
 * Long-tail intents this page is built to answer. Rendered as a real,
 * navigable "what people search for" block — every entry is a question the
 * page genuinely answers, anchored to the section that answers it. This is a
 * navigation aid, not a keyword dump: keep it truthful and keep it linked.
 */
export const poaKeywordClusters: {
  theme: string;
  anchor: string;
  queries: string[];
}[] = [
  {
    theme: "Making one from the USA",
    anchor: "#execute-from-usa",
    queries: [
      "power of attorney for India from USA",
      "how to make power of attorney for India from USA",
      "power of attorney for property in India from USA",
      "power of attorney executed outside India",
    ],
  },
  {
    theme: "Selling property in India",
    anchor: "#sell-property",
    queries: [
      "power of attorney to sell property in India",
      "can power of attorney sell property in India",
      "POA for selling property in India",
      "power of attorney for property sale in India",
      "NRI power of attorney to sell property in India",
      "power of attorney to sell flat in India",
      "how to sell property in India from USA",
    ],
  },
  {
    theme: "Registration of the POA",
    anchor: "#registration",
    queries: [
      "does power of attorney need to be registered in India",
      "is power of attorney required to be registered in India",
      "power of attorney for property registration in India",
      "power of attorney for registration of property in India",
    ],
  },
  {
    theme: "General vs special POA",
    anchor: "#types",
    queries: [
      "general power of attorney for property in India",
      "difference between general and special power of attorney India",
      "special power of attorney for property sale India",
    ],
  },
  {
    theme: "Notary, apostille and attestation",
    anchor: "#notary-apostille",
    queries: [
      "is notarized power of attorney valid in India",
      "apostille power of attorney for India",
      "Indian consulate power of attorney attestation",
      "does POA need to be attested by Indian embassy",
    ],
  },
  {
    theme: "Validity and revocation",
    anchor: "#validity",
    queries: [
      "validity of power of attorney in India",
      "how to revoke power of attorney in India",
      "does power of attorney expire on death India",
      "how long is power of attorney valid in India",
    ],
  },
  {
    theme: "Stamp duty and cost",
    anchor: "#stamp-duty",
    queries: [
      "stamp duty on power of attorney in India",
      "power of attorney registration charges India",
      "cost of power of attorney for NRI",
    ],
  },
  {
    theme: "Formats and drafts",
    anchor: "#formats",
    queries: [
      "power of attorney format for property sale in India",
      "power of attorney format for NRI",
      "power of attorney draft for property sale India",
    ],
  },
];

/* ────────────────────────── Official sources ───────────────────────────── */

export const poaSources = {
  meaApostille: "https://www.mea.gov.in/apostille-menu",
  hcchIndia: "https://www.hcch.net/en/news-archive/details/?varevent=102",
  registrationAct: "https://www.indiacode.nic.in/bitstream/123456789/2190/5/A1908-16.pdf",
  stampAct: "https://www.indiacode.nic.in/bitstream/123456789/20095/1/the_indian_stamp_act,_1899.pdf",
  rbiNriAccountsFaq:
    "https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/Accountresidents16012025.pdf",
  femaDepositRegs: "https://rbidocs.rbi.org.in/rdocs/notification/PDFs/13255.pdf",
  indianEmbassyUsa: "https://www.indianembassyusa.gov.in/",
  vfsIndiaUsa: "https://services.vfsglobal.com/usa/en/ind/",
  ncslNotary: "https://www.nass.org/",
} as const;

export const poaSourceLinks: { label: string; href: string }[] = [
  { label: "MEA — Attestation / Apostille", href: poaSources.meaApostille },
  { label: "HCCH — India's accession to the Apostille Convention", href: poaSources.hcchIndia },
  { label: "Registration Act, 1908 (India Code)", href: poaSources.registrationAct },
  { label: "Indian Stamp Act, 1899 (India Code)", href: poaSources.stampAct },
  { label: "RBI — FAQs: Accounts in India by non-residents", href: poaSources.rbiNriAccountsFaq },
  { label: "FEMA (Deposit) Regulations", href: poaSources.femaDepositRegs },
  { label: "Embassy of India, Washington DC", href: poaSources.indianEmbassyUsa },
  { label: "VFS Global — Indian consular services (USA)", href: poaSources.vfsIndiaUsa },
  { label: "NASS — find your Secretary of State (apostille)", href: poaSources.ncslNotary },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * Exact strings rendered on-page AND emitted in FAQPage JSON-LD.            */

export const poaFaqs: FaqItem[] = [
  {
    question: "Is a notarized power of attorney valid in India?",
    answer:
      "Yes, provided it is authenticated the way Indian law requires. Section 33(1)(c) of the Registration Act, 1908 recognises a power of attorney executed before and authenticated by a Notary Public, a Court, a Judge, a Magistrate, or an Indian Consul or Vice-Consul where the principal does not reside in India. In practice that means one of two routes from the USA: notarise and then apostille through your state's Secretary of State, or have the deed attested by the Indian Mission. A bare US notarisation with neither an apostille nor consular attestation is what gets rejected at the Sub-Registrar's counter.",
  },
  {
    question: "Do I need an apostille, or attestation by the Indian consulate?",
    answer:
      "Legally, either. India has been a party to the Hague Apostille Convention since July 14, 2005, so an apostille issued by the Secretary of State of the US state where the deed was notarised is a complete authentication and needs no further Indian consular stamp. Attestation by the Indian Mission is an equally valid alternative. Two practical caveats matter more than the law. Some Sub-Registrars in India still ask for consular attestation out of habit — ask your advocate in the property's state which route that specific office accepts before you choose. And in the other direction, some Indian Missions in the USA now want the apostille done FIRST and will only attest an already-apostilled deed, so confirm your own consulate's current checklist before you book anything.",
  },
  {
    question: "How long does it take to make a power of attorney for India from USA?",
    answer:
      "Plan for three to five weeks end to end. Drafting in India takes a few days; signing before a notary with two witnesses takes an afternoon; consular attestation typically runs about ten business days from the day the file reaches the Consulate, and a state apostille runs to its own published turnaround. Add international courier time in both directions. Then, in India, stamping and registration happen before your attorney can act.",
  },
  {
    question: "Does a power of attorney need to be registered in India?",
    answer:
      "Treat registration as the default for any property POA. Section 17(1)(b) of the Registration Act, together with amendments in states including Maharashtra, Tamil Nadu and Odisha, makes a power of attorney that authorises the sale or transfer of immovable property compulsorily registrable. Registration is also what allows your attorney to present the sale deed and admit execution under Section 32(c). A purely administrative POA — collect rent, pay dues, no power to transfer — is usually not compulsorily registrable, but confirm in your state.",
  },
  {
    question: "Is there a deadline to stamp a power of attorney executed in the USA?",
    answer:
      "Yes, and it is the deadline NRIs miss most often. Section 18 of the Indian Stamp Act, 1899 allows an instrument executed only outside India to be stamped within three months after it is FIRST received in India. The clock starts when the deed lands in India, not when you signed it. A power of attorney that is not duly stamped inside that window can be impounded and charged penalty duty. Where the correct duty is unclear, take it to the Collector of Stamps for adjudication.",
  },
  {
    question: "How much stamp duty is payable on an NRI power of attorney?",
    answer:
      "It depends on your state and, critically, on who the attorney is and what the POA does. Where the authority is given to a close relative — spouse, parent, child or sibling — without consideration, most states charge a small fixed duty. Where the POA is given to a non-relative for consideration, is coupled with possession, or grants development rights, states commonly charge duty as though it were a conveyance, which is a completely different order of magnitude. That distinction is the largest cost variable in the whole exercise.",
  },
  {
    question: "Should an NRI give a General Power of Attorney or a Special Power of Attorney?",
    answer:
      "A Special (specific) Power of Attorney, in almost every case. It names one property, one attorney, an enumerated list of acts and an end date. A General POA hands over open-ended authority across all your Indian affairs, is scrutinised heavily by Sub-Registrars and banks, can attract conveyance-rate stamp duty when given to a non-relative, and is the instrument behind a large share of NRI property litigation. If you need two things done, execute two special powers rather than one general one.",
  },
  {
    question: "Can a power of attorney sell property in India?",
    answer:
      "Yes — an NRI can sell property in India through a properly executed, stamped and registered Special Power of Attorney authorising the attorney to execute the sale deed and admit execution before the Sub-Registrar. What you cannot do is treat the POA itself as the sale. In Suraj Lamp & Industries (P) Ltd v State of Haryana, decided on October 11, 2011, the Supreme Court held that SA/GPA/WILL transactions do not convey title and are not a valid mode of transfer of immovable property. Title passes only under a registered conveyance.",
  },
  {
    question: "What is the validity of a power of attorney in India, and does it end on death?",
    answer:
      "A POA runs until the date stated in it, until the purpose is completed, or until it is revoked — whichever comes first, which is why an expiry date belongs in the deed. It also terminates by operation of law: under Sections 201 and 202 of the Indian Contract Act, 1872 an agency ends on the principal's death, unsoundness of mind or insolvency, unless the agency is coupled with an interest, in which case it cannot be terminated to the prejudice of that interest. A POA is not an estate-planning document and is no substitute for a will.",
  },
  {
    question: "How do I revoke a power of attorney in India from the USA?",
    answer:
      "Execute a Deed of Revocation the same way you executed the original — signed before a US Notary Public with two witnesses, then attested by the Indian Mission or apostilled by your Secretary of State. If the POA was registered, register the revocation at the same Sub-Registrar's office. Then serve written notice on the attorney by a trackable method, notify every institution relying on it (bank, society, tenants, builder, the buyer's counsel, any court), and publish a public notice in a newspaper circulating where the property is. Acts done before notice reaches the attorney can still bind you.",
  },
  {
    question: "Can my power of attorney holder in India operate my NRE or NRO account?",
    answer:
      "Within limits set by FEMA, not by your drafting. A resident POA holder may make local rupee payments from your NRO account, including payments for eligible investments, and may remit your current Indian income abroad net of applicable taxes; on an NRE account, operations are restricted to withdrawals for local payments or remittance to you. The holder may NOT repatriate funds outside India to anyone other than you, and may NOT make a gift to a resident on your behalf. Banks also require their own POA form or mandate in addition to your deed.",
  },
  {
    question: "Who can be my power of attorney holder in India, and who can be a witness?",
    answer:
      "Your attorney should be an adult of sound mind who is resident in India, reachable, and willing to be identified at the Sub-Registrar's counter — usually a parent, sibling or trusted family member, sometimes an advocate. Witnesses are a separate question: Indian Missions in the USA require two witnesses on the deed who are neither your spouse nor blood relatives, with their full names and addresses. Choose an attorney for reliability and a witness for independence — they are different jobs.",
  },
  {
    question: "What does a power of attorney for an NRI cost?",
    answer:
      "The US-side costs are modest and predictable: a notary is typically $5 to $25 per signature, a state apostille runs roughly $3 to $25, the Government of India consular fee is around $20 per document with a separate ICWF levy of about $2 and a service-partner charge of about $19, plus $60 to $150 for trackable courier. The India-side costs are the variable ones: your advocate's drafting fee, the registration fee, and stamp duty that is nominal for a close-relative POA but can be charged at conveyance rates for a non-relative POA with consideration. Verify every figure with your own consulate and state before relying on it.",
  },
  {
    question: "Is a power of attorney executed outside India valid, and what must I do with it?",
    answer:
      "It is valid, provided it is authenticated as Section 33(1)(c) of the Registration Act, 1908 requires — before a Notary Public with an apostille, or before an Indian Consul or Vice-Consul. But validity is only the first half. A power of attorney executed outside India must then be stamped within three months of the date it is first received in India, under Section 18 of the Indian Stamp Act, 1899, and registered where the state requires it. An authenticated deed that was never stamped is still an unstamped instrument, liable to be impounded with penalty duty.",
  },
  {
    question: "How do I sell property in India from the USA without travelling?",
    answer:
      "Selling property in India from USA is doable entirely by proxy, but three things have to line up, and they are usually done in the wrong order. First, the power of attorney: drafted by an advocate in the property's state, signed before a US notary with two non-relative witnesses, attested or apostilled, couriered to India, then stamped within three months and registered. Second, the tax: apply for a lower or nil TDS certificate in Form 13 before payments begin, or the buyer will commonly withhold on the full sale price rather than your actual gain. Third, repatriation: the proceeds land in your NRO account, and moving them abroad needs Form 15CA and, where required, a CA certificate in Form 15CB. Start the POA and the Form 13 in parallel — both take weeks.",
  },
  {
    question: "What is the difference between a general power of attorney for property in India and a special POA?",
    answer:
      "A general power of attorney confers broad, open-ended authority over your affairs or your property generally, usually with no named property and no end date. A special or specific power of attorney names one property, one attorney, an enumerated list of acts and an expiry date. For an NRI the special POA is almost always right: it is cheaper to stamp, faster to register, easier to revoke, harder to misuse, and far better received at the Sub-Registrar's counter. A general POA given to someone outside your immediate family can also attract conveyance-rate stamp duty in several states. If two things need doing, grant two special powers rather than one general one.",
  },
  {
    question: "Can two people, like a husband and wife, sign the same power of attorney?",
    answer:
      "Yes, where both are co-owners on the title deed both must grant the authority, and they can do so in one instrument. Practically, both executants generally have to appear together, both photographs go on the deed, and the consular fee is charged per executant rather than per document. Check the title deed first: if only one spouse is on title, only that spouse needs to execute the POA, and adding the other creates confusion at the counter.",
  },
];
