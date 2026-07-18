/**
 * Shared, EDITABLE content for /invitation-letter-for-parents-to-visit-usa
 * (free B-2 invitation letter generator + guide).
 *
 * An invitation letter is a SUPPORTING document only — B-2 decisions are made
 * on the applicant's own circumstances and DS-160 under INA 214(b). Keep every
 * claim hedged accordingly: never suggest the letter is required, decisive, or
 * officially approved, and never present sponsor documents as guarantees.
 *
 * Link check 2026-07-18: ustraveldocs.com/in/ now redirects to the site root —
 * link the root directly. travel.state.gov visitor page is canonical (the
 * server blocks bots with 403 but loads normally in browsers).
 *
 * Educational information only — not legal or immigration advice.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Official sources ──────────────────────────── */

export const invitationSources = {
  visitorVisa: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
  ustraveldocs: "https://www.ustraveldocs.com/",
} as const;

export const invitationSourceLinks: { label: string; href: string }[] = [
  { label: "Visitor Visa (B-1/B-2) — travel.state.gov", href: invitationSources.visitorVisa },
  { label: "U.S. Visa Information & Appointments — ustraveldocs.com", href: invitationSources.ustraveldocs },
];

export const INVITE_DISCLAIMER =
  "This letter is a supporting document only — a B-2 visa decision is made by the consular officer based on the applicant's own circumstances and DS-160, under U.S. law (INA 214(b)). No letter, sponsor, or document guarantees a visa, and no letter format is officially approved. Educational information only — not legal or immigration advice.";

/* ───────────────────── Supporting documents checklist ──────────────────── */

export interface ChecklistItem {
  item: string;
  who: "Parents carry" | "You provide";
  note: string;
}

export const inviteChecklist: ChecklistItem[] = [
  { item: "Invitation letter (this generator)", who: "You provide", note: "Commonly included, not officially required." },
  { item: "Copy of your status document (passport/green card/I-797/I-20)", who: "You provide", note: "Shows the officer who the parents are visiting and their status." },
  { item: "Your employment letter or proof of occupation", who: "You provide", note: "Commonly included when you cover expenses; not required and no guarantee." },
  { item: "Your recent bank statement", who: "You provide", note: "Commonly included when you cover expenses; not required and no guarantee." },
  { item: "Parents' valid passports", who: "Parents carry", note: "Generally valid for at least six months beyond the intended stay, unless a country-specific exemption applies." },
  { item: "DS-160 confirmation + appointment confirmation", who: "Parents carry", note: "The DS-160 is the application the officer actually decides on." },
  { item: "Parents' own circumstances evidence (property, pension, bank records)", who: "Parents carry", note: "May help demonstrate their circumstances and reasons to return — the officer evaluates the application as a whole." },
  { item: "MRV fee receipt", who: "Parents carry", note: "Fee amounts change — verify on ustraveldocs.com." },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * Exact strings rendered on-page AND emitted in FAQPage JSON-LD.            */

export const inviteFaqs: FaqItem[] = [
  {
    question: "How do I write an invitation letter for my parents to visit the USA?",
    answer:
      "Write it as a short formal letter to the visa officer at the consulate where your parents will apply: your name, address, and immigration status; your parents' names and passport numbers; the visit dates and purpose; where they will stay; and who covers airfare and living expenses. Keep it factual and one page. The free generator on this page produces exactly that format as a downloadable PDF or printable letter.",
  },
  {
    question: "Is an invitation letter required for a parents' B-2 visitor visa?",
    answer:
      "No. The U.S. State Department does not require an invitation letter for a B-2 visa, and officers decide primarily on the applicant's own circumstances and the DS-160. In practice, many families include one anyway — it neatly documents who the parents are visiting, the sponsor's status, and who pays. Treat it as helpful context, never as the deciding document, and never as a substitute for the DS-160.",
  },
  {
    question: "Who can write an invitation letter for parents visiting the USA?",
    answer:
      "Anyone lawfully in the United States can write one — a U.S. citizen, green card holder, or someone on H-1B, L-1, F-1, or another lawful status. There is no sponsorship requirement for a B-2 visa, and a son-in-law or daughter-in-law can write the letter for parents-in-law just as a son or daughter can for parents; simply state the relationship accurately. Whoever writes it, the applicants must independently qualify for the visa.",
  },
  {
    question: "Does an invitation letter for parents visiting the USA need to be notarized?",
    answer:
      "Notarization is generally not required and adds no official weight. A plainly formatted, signed letter is standard practice; consular officers know notary stamps are trivial to obtain and do not treat them as verification. Skip the notary fee. What actually matters is that the facts in the letter match the DS-160 and your parents' answers at the interview.",
  },
  {
    question: "What documents should I attach with the invitation letter for my parents?",
    answer:
      "Commonly included, though none are officially required: a copy of your status document (U.S. passport, green card, I-797 approval notice, or I-20), an employment or occupation letter, and a recent bank statement if you are covering expenses. These may help document the visit's circumstances, but no sponsor document guarantees approval. Your parents separately carry their own documents — passports, DS-160 confirmation, and evidence of their own circumstances and reasons to return.",
  },
  {
    question: "Should the invitation letter be mailed to the consulate?",
    answer:
      "No — do not mail it. Your parents may carry the letter to the interview in case the consular officer requests supporting information; each post controls how and whether supporting documents are reviewed, and many interviews conclude without the officer asking for any paperwork beyond the passport and DS-160 confirmation. Email a PDF to your parents, have them print it, and treat it as a document to present on request.",
  },
  {
    question: "Should an invitation letter include passport numbers and exact dates?",
    answer:
      "Passport numbers are optional but useful — they tie the letter to the exact applications in front of the officer, which helps when a surname is common. Dates should match the DS-160 as closely as possible; if exact travel dates are not final, use a clearly stated intended window (for example, 'from approximately December 2026 for about ten weeks') rather than inventing precise dates you may later contradict.",
  },
  {
    question: "Can my parents stay in a hotel instead of my home?",
    answer:
      "Yes — there is no requirement that visiting parents stay with their child. Staying with you, in a hotel, or a mix is all acceptable; the letter should simply describe the plan accurately, along with who pays for airfare and who pays day-to-day expenses if those differ. The generator on this page asks these separately so the letter says exactly what your family actually intends.",
  },
  {
    question: "Can I invite my parents to the USA if I am on an H-1B or F-1 visa?",
    answer:
      "Yes. Any lawful status — H-1B, L-1, F-1, green card, or citizenship — can write an invitation letter; there is no sponsorship requirement for a B-2 visitor visa. Your status does not decide the outcome: the officer evaluates your parents' own circumstances and intent to return under INA 214(b). State your status accurately in the letter and attach a copy of your status document.",
  },
  {
    question: "Who should the invitation letter for parents visiting the USA be addressed to?",
    answer:
      "Address it to the Visa Officer at the U.S. embassy or consulate where your parents will interview — the U.S. Embassy in New Delhi, or the U.S. Consulate General in Mumbai, Chennai, Hyderabad, or Kolkata. If the post is not decided yet, a generic 'The Visa Officer, United States Embassy / Consulate General' works fine — the generator offers that option. Your parents keep the letter with their documents; you do not mail it anywhere.",
  },
];
