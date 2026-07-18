/**
 * Shared, EDITABLE content for /invitation-letter-for-parents-to-visit-usa
 * (free B-2 invitation letter generator + guide).
 *
 * An invitation letter is a SUPPORTING document only — B-2 decisions are made
 * on the applicant's own ties and DS-160 under INA 214(b). Keep every claim
 * hedged accordingly: never suggest the letter is required or decisive.
 * Educational information only — not legal or immigration advice.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Official sources ──────────────────────────── */

export const invitationSources = {
  visitorVisa: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
  ustraveldocsIndia: "https://www.ustraveldocs.com/in/",
} as const;

export const invitationSourceLinks: { label: string; href: string }[] = [
  { label: "Visitor Visa (B-1/B-2) — travel.state.gov", href: invitationSources.visitorVisa },
  { label: "U.S. Visa Information for India — ustraveldocs.com", href: invitationSources.ustraveldocsIndia },
];

export const INVITE_DISCLAIMER =
  "This letter is a supporting document only — a B-2 visa decision is made by the consular officer based on the applicant's own ties and DS-160, under U.S. law (INA 214(b)). No letter, sponsor, or document guarantees a visa. Educational information only — not legal or immigration advice.";

/* ───────────────────── Supporting documents checklist ──────────────────── */

export interface ChecklistItem {
  item: string;
  who: "Parents carry" | "You provide";
  note: string;
}

export const inviteChecklist: ChecklistItem[] = [
  { item: "Invitation letter (this generator)", who: "You provide", note: "Commonly included, not officially required." },
  { item: "Copy of your status document (passport/green card/I-797/I-20)", who: "You provide", note: "Shows the officer who the parents are visiting and their status." },
  { item: "Your employment letter or proof of occupation", who: "You provide", note: "Commonly included when you cover expenses; not required." },
  { item: "Your recent bank statement", who: "You provide", note: "Commonly included when you cover expenses; not required." },
  { item: "Parents' valid passports", who: "Parents carry", note: "Valid for six months beyond the intended stay." },
  { item: "DS-160 confirmation + appointment confirmation", who: "Parents carry", note: "The DS-160 is the application the officer actually decides on." },
  { item: "Parents' own ties evidence (property, pension, bank records)", who: "Parents carry", note: "The decisive factor under INA 214(b) — far more than any letter." },
  { item: "MRV fee receipt", who: "Parents carry", note: "Fee amounts change — verify on ustraveldocs.com." },
];

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * Exact strings rendered on-page AND emitted in FAQPage JSON-LD.            */

export const inviteFaqs: FaqItem[] = [
  {
    question: "How do I write an invitation letter for my parents to visit the USA?",
    answer:
      "Write it as a short formal letter to the visa officer at the consulate where your parents will apply: your name, address, and immigration status; your parents' names and passport numbers; the visit dates and purpose; where they will stay; and who covers expenses. Keep it factual and one page. The free generator on this page produces exactly that format as a downloadable PDF.",
  },
  {
    question: "Is an invitation letter required for a parents' B-2 visitor visa?",
    answer:
      "No. The U.S. State Department does not require an invitation letter for a B-2 visa, and officers decide primarily on the applicant's own ties to India and the DS-160. In practice, many families include one anyway — it neatly documents who the parents are visiting, the sponsor's status, and who pays. Treat it as helpful context, never as the deciding document.",
  },
  {
    question: "Does an invitation letter for parents visiting the USA need to be notarized?",
    answer:
      "No — notarization is not required and adds no official weight. A plainly formatted, signed letter is standard practice; consular officers know notary stamps are trivial to obtain and do not treat them as verification. Skip the notary fee. What actually matters is that the facts in the letter match the DS-160 and your parents' answers at the interview.",
  },
  {
    question: "What documents should I attach with the invitation letter for my parents?",
    answer:
      "Commonly included, though none are officially required: a copy of your status document (U.S. passport, green card, I-797 approval notice, or I-20), an employment or occupation letter, and a recent bank statement if you are covering expenses. Your parents separately carry their own documents — passports, DS-160 confirmation, and evidence of their ties to India, which matter far more.",
  },
  {
    question: "Can I invite my parents to the USA if I am on an H-1B or F-1 visa?",
    answer:
      "Yes. Any lawful status — H-1B, F-1, green card, or citizenship — can write an invitation letter; there is no sponsorship requirement for a B-2 visitor visa. Your status does not decide the outcome: the officer evaluates your parents' own ties and intent to return under INA 214(b). State your status accurately in the letter and attach a copy of your status document.",
  },
  {
    question: "Who should the invitation letter for parents visiting the USA be addressed to?",
    answer:
      "Address it to the Visa Officer at the U.S. embassy or consulate where your parents will interview — the U.S. Embassy in New Delhi, or the U.S. Consulate General in Mumbai, Chennai, Hyderabad, or Kolkata. A generic 'To whom it may concern' also works, but naming the post looks tidier. Your parents simply carry the letter to the interview; you do not mail it anywhere.",
  },
];
