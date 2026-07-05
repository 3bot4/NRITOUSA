/**
 * Shared, EDITABLE data for the "India Visa from USA" SEO cluster:
 *   /india-visa-from-usa            (main hub)
 *   /india-evisa-for-us-citizens
 *   /india-tourist-visa-from-usa
 *   /india-business-visa-from-usa
 *   /entry-visa-india-from-usa
 *   /india-visa-fees-usa
 *   /india-visa-processing-time-usa
 *   /oci-vs-india-visa
 *
 * Fees, processing-time notes, and disclaimers live here so they can be
 * updated monthly WITHOUT rewriting the pages. Every figure is intentionally
 * conservative ("estimated", "usually", "minimum", "verify latest") because
 * Indian visa fees and timelines change by nationality, category, validity,
 * consulate jurisdiction, and service provider.
 *
 * DO NOT hardcode uncertain eVisa fees. DO NOT copy official government text.
 * DO NOT guarantee approval or exact timelines.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Dates ─────────────────────────── */

export const INDIA_VISA_PUBLISHED = "2026-07-05";
export const INDIA_VISA_UPDATED = "2026-07-05";
export const INDIA_VISA_UPDATED_HUMAN = "July 5, 2026";

/* ─────────────────────── Core config object ─────────────────── */

export const indiaVisaConfig = {
  lastReviewed: INDIA_VISA_UPDATED_HUMAN,

  // Timeline notes (conservative, verify-first wording).
  regularVisaMinimumProcessing:
    "Minimum 3 working days after the application is received by the Indian Mission/Post, excluding special cases — real-world timing is often longer.",
  eVisaProcessingNote:
    "Often processed within a few business days, but apply well ahead of travel — approval is never guaranteed and some applications take longer.",

  // Fee estimates (US nationals). Verify the latest official amount before paying.
  touristVisaUSFeeEstimate:
    "Around $160 government fee for a visa valid up to 10 years for U.S. nationals — verify the latest official fee.",
  businessVisaUSFeeEstimate:
    "Around $160 government fee for a visa valid up to 10 years for U.S. nationals — verify the latest official fee.",
  vfsServiceFeeEstimate:
    "A VFS/consular service fee (for example, around $15.90) may apply on top of the government fee — verify the latest amount.",
  eVisaFeeNote:
    "Varies by visa type, nationality, validity, and current government rules. Verify the exact amount on the official portal before payment.",

  // Disclaimers (reused everywhere).
  feeDisclaimer:
    "Fees can change by nationality, visa category, validity, consulate jurisdiction, service provider, and optional services. Amounts here are estimates for planning only — verify the latest official fee before paying.",
  timelineDisclaimer:
    "Processing times are estimates and can vary based on application completeness, consulate workload, nationality, special cases, holidays, and document issues. Do not book non-refundable travel until your visa is approved.",
  officialSourcesNote:
    "Always verify final requirements on Indianvisaonline.gov.in, VFS Global USA, and the relevant Indian Consulate before applying. This guide is educational and is not legal or consular advice.",
  approvalNote:
    "No visa or OCI outcome is guaranteed. Eligibility, documents, and decisions are determined by the Indian government, the consulate, and the authorized service provider.",
} as const;

/* ─────────────────────── Official sources ───────────────────── */

export const indiaVisaSources = {
  eVisaPortal: "https://indianvisaonline.gov.in/evisa/tvoa.html",
  visaOnline: "https://indianvisaonline.gov.in",
  vfsUsa: "https://visa.vfsglobal.com/usa/en/ind",
  ociVfs: "https://visa.vfsglobal.com/usa/en/ind/apply-oci-services",
  ociServices: "https://ociservices.gov.in",
  mhaOci:
    "https://www.mha.gov.in/en/foreigners/overseas-citizenship-of-india-oci-cardholder",
  embassyUsa: "https://www.indianembassyusa.gov.in",
  passportIndia: "https://www.passportindia.gov.in",
} as const;

export const indiaVisaSourceLinks: { label: string; href: string }[] = [
  { label: "Indian Visa Online (Government portal)", href: indiaVisaSources.visaOnline },
  { label: "India eVisa application", href: indiaVisaSources.eVisaPortal },
  { label: "VFS Global USA (India visa services)", href: indiaVisaSources.vfsUsa },
  { label: "OCI services (Government of India)", href: indiaVisaSources.ociServices },
  { label: "Embassy of India, Washington D.C.", href: indiaVisaSources.embassyUsa },
];

/* ─────────────────── Hub: master comparison table ────────────── */

export interface VisaRow {
  type: string;
  bestFor: string;
  processing: string;
  fee: string;
  where: string;
  notes: string;
}

export const visaComparisonRows: VisaRow[] = [
  {
    type: "e-Tourist Visa",
    bestFor: "Short tourism, family visits, sightseeing",
    processing: "Often a few business days — apply early",
    fee: "Varies; verify on portal",
    where: "Indianvisaonline.gov.in (eVisa portal)",
    notes: "Eligible nationalities only; entry through designated airports/seaports.",
  },
  {
    type: "e-Business Visa",
    bestFor: "Meetings, conferences, trade shows, vendor visits",
    processing: "Often a few business days — apply early",
    fee: "Varies; verify on portal",
    where: "Indianvisaonline.gov.in (eVisa portal)",
    notes: "For permitted business activities; not for employment.",
  },
  {
    type: "e-Medical Visa",
    bestFor: "Medical treatment at recognized hospitals (+ e-Medical Attendant)",
    processing: "Often a few business days — apply early",
    fee: "Varies; verify on portal",
    where: "Indianvisaonline.gov.in (eVisa portal)",
    notes: "Limited entries/validity; keep hospital documents ready.",
  },
  {
    type: "Regular Tourist Visa",
    bestFor: "Longer or multi-entry tourism, cases not eligible for eVisa",
    processing: "Minimum 3 working days after receipt; often longer",
    fee: "~$160 for up to 10 years (U.S. nationals); verify",
    where: "VFS Global USA / Indian Consulate",
    notes: "Paper/consular process; VFS service fee may apply.",
  },
  {
    type: "Regular Business Visa",
    bestFor: "Longer-term or repeat business travel, larger scope",
    processing: "Minimum 3 working days after receipt; often longer",
    fee: "~$160 for up to 10 years (U.S. nationals); verify",
    where: "VFS Global USA / Indian Consulate",
    notes: "Invitation letter + company proof usually required.",
  },
  {
    type: "Entry Visa (X Visa)",
    bestFor: "Indian-origin families, non-Indian spouses, minor children",
    processing: "Can take longer when origin/family documents are reviewed",
    fee: "Varies by case; verify with consulate/VFS",
    where: "VFS Global USA / Indian Consulate",
    notes: "Common when you don't qualify for eVisa/OCI or need a family-visit status.",
  },
  {
    type: "Student Visa",
    bestFor: "Full-time study at a recognized Indian institution",
    processing: "Varies; apply well in advance",
    fee: "Varies; verify with consulate/VFS",
    where: "VFS Global USA / Indian Consulate",
    notes: "Admission letter and supporting documents required.",
  },
  {
    type: "Employment Visa",
    bestFor: "Working for an organization in India",
    processing: "Varies; can be longer due to documentation",
    fee: "Varies; verify with consulate/VFS",
    where: "VFS Global USA / Indian Consulate",
    notes: "Employment contract and salary thresholds usually apply.",
  },
  {
    type: "OCI Card",
    bestFor: "Indian-origin U.S. citizens who travel often / want long-term convenience",
    processing: "Usually longer than a visa — not for urgent travel",
    fee: "Government + VFS fees; verify latest",
    where: "VFS Global USA / OCI services",
    notes: "A lifelong multiple-entry facility — not a visa and not citizenship.",
  },
  {
    type: "Emergency / urgent travel",
    bestFor: "Genuine emergencies (family illness, bereavement)",
    processing: "Handled case by case — contact consulate/VFS directly",
    fee: "Varies; verify",
    where: "Indian Consulate / VFS Global USA",
    notes: "Do not rely on OCI for urgent travel if it is not already approved.",
  },
];

/* ─────────────── Hub: "quick pick" recommendation cards ─────────── */

export const hubPickCards: { badge: string; title: string; body: string; href: string }[] = [
  {
    badge: "Short tourist trip",
    title: "India e-Tourist Visa",
    body: "For sightseeing, weddings, and short family visits if you're an eligible U.S. citizen.",
    href: "/india-tourist-visa-from-usa",
  },
  {
    badge: "Indian-origin, long-term",
    title: "OCI or Entry Visa",
    body: "For Indian-origin U.S. citizens, non-Indian spouses, and U.S.-born children visiting family.",
    href: "/oci-vs-india-visa",
  },
  {
    badge: "Business / conference",
    title: "e-Business or Business Visa",
    body: "For meetings, conferences, trade shows, and company or vendor visits.",
    href: "/india-business-visa-from-usa",
  },
];

/* ─────────────── Hub: "common searches explained" block ─────────── */

export const commonSearches: { term: string; answer: string; href: string }[] = [
  {
    term: "India visa",
    answer:
      "A permit to enter India for a specific purpose (tourism, business, medical, study, or work). U.S. citizens usually apply online (eVisa) or through VFS/consulate.",
    href: "/india-visa-from-usa",
  },
  {
    term: "Indian visa for U.S. citizen",
    answer:
      "Most U.S. citizens can apply for an eVisa if eligible; some cases need a regular visa or Entry Visa. Indian-origin travelers may prefer OCI.",
    href: "/india-evisa-for-us-citizens",
  },
  {
    term: "India online visa",
    answer:
      "The eVisa applied for on Indianvisaonline.gov.in. Covers e-Tourist, e-Business, and e-Medical categories for eligible nationalities.",
    href: "/india-evisa-for-us-citizens",
  },
  {
    term: "India tourist visa",
    answer:
      "For sightseeing and family visits. You can often use the e-Tourist Visa; a regular tourist visa suits longer or non-eligible cases.",
    href: "/india-tourist-visa-from-usa",
  },
  {
    term: "Indian travel visa",
    answer:
      "A general phrase for a visa to travel to India. For most short U.S.-based trips this means the e-Tourist Visa.",
    href: "/india-tourist-visa-from-usa",
  },
  {
    term: "India visa multiple entry",
    answer:
      "A visa that lets you enter India more than once during its validity. Availability depends on visa type and current rules — verify before you rely on it.",
    href: "/india-tourist-visa-from-usa",
  },
  {
    term: "Visa on arrival for Indians",
    answer:
      "Often searched incorrectly. Indian citizens don't need a visa to enter India; U.S. citizens should not rely on visa on arrival for India — use eVisa or a regular visa.",
    href: "/india-visa-from-usa",
  },
  {
    term: "Entry visa India",
    answer:
      "Often relevant for Indian-origin families, non-Indian spouses, and minor children who don't fit the eVisa/OCI path.",
    href: "/entry-visa-india-from-usa",
  },
  {
    term: "OCI card vs eVisa",
    answer:
      "OCI is a lifelong multiple-entry facility for Indian-origin people; an eVisa is a short-term travel permit. OCI is not a visa and not for urgent travel.",
    href: "/oci-vs-india-visa",
  },
];

/* ─────────────── Hub: decision-guide outputs ─────────── */

export const decisionOutputs: { key: string; label: string; blurb: string; href: string }[] = [
  { key: "etourist", label: "e-Tourist Visa may fit", blurb: "Short tourism or family visit, eligible U.S. citizen.", href: "/india-tourist-visa-from-usa" },
  { key: "ebusiness", label: "e-Business Visa may fit", blurb: "Meetings, conferences, or business exploration.", href: "/india-business-visa-from-usa" },
  { key: "emedical", label: "e-Medical Visa may fit", blurb: "Treatment at a recognized Indian hospital.", href: "/india-evisa-for-us-citizens" },
  { key: "entry", label: "Entry Visa may fit", blurb: "Indian-origin family, non-Indian spouse, or U.S.-born child.", href: "/entry-visa-india-from-usa" },
  { key: "tourist", label: "Regular Tourist Visa may fit", blurb: "Longer stay or a case not eligible for eVisa.", href: "/india-tourist-visa-from-usa" },
  { key: "oci", label: "OCI may be better", blurb: "Indian-origin, frequent travel, long-term convenience.", href: "/oci-vs-india-visa" },
  { key: "consulate", label: "Check with consulate/VFS", blurb: "Special case — confirm the right category directly.", href: "https://visa.vfsglobal.com/usa/en/ind" },
];

/* ─────────────────────── Documents checklists ──────────────────── */

export const eVisaDocuments: string[] = [
  "Passport valid at least 6 months with 2+ blank pages",
  "Recent color passport-style photo (per portal specs)",
  "Scanned passport bio page",
  "Confirmed return/onward travel details (as required)",
  "Business/medical supporting documents for e-Business or e-Medical",
  "A payment card for the online fee",
];

export const regularVisaDocuments: string[] = [
  "Passport valid at least 6 months with 2+ blank pages",
  "Completed VFS/consular application form",
  "Passport-style photo per specification",
  "Proof of U.S. status/residence (as required by your jurisdiction)",
  "Purpose-of-travel documents (itinerary, invitation, hospital letter)",
  "VFS service fee and shipping/courier as applicable",
];

export const businessDocuments: string[] = [
  "Passport valid 6+ months with blank pages",
  "Completed business visa application",
  "Invitation letter from the Indian company/host",
  "Letter from your U.S. employer describing the purpose",
  "Business card and company proof (as requested)",
  "Financial standing / GST or incorporation proof where asked",
];

export const entryVisaDocuments: string[] = [
  "Passport valid 6+ months with blank pages",
  "Proof of Indian origin or the family relationship (as required)",
  "Marriage certificate (for a non-Indian spouse)",
  "Child's birth certificate + parents' documents (for a minor)",
  "Prior Indian passport / surrender or renunciation certificate where relevant",
  "Completed application via VFS/consulate + applicable fees",
];

/* ─────────────────────────── Fee table ─────────────────────────── */

export interface FeeRow {
  type: string;
  govFee: string;
  serviceFee: string;
  optional: string;
  notes: string;
}

export const feeTableRows: FeeRow[] = [
  {
    type: "e-Tourist Visa",
    govFee: "Varies by validity/nationality — verify on portal",
    serviceFee: "Bank/processing charge may apply",
    optional: "Photo, printing",
    notes: "Paid online at Indianvisaonline.gov.in.",
  },
  {
    type: "e-Business Visa",
    govFee: "Varies — verify on portal",
    serviceFee: "Bank/processing charge may apply",
    optional: "Photo, printing, document prep",
    notes: "For permitted business activities only.",
  },
  {
    type: "e-Medical Visa",
    govFee: "Varies — verify on portal",
    serviceFee: "Bank/processing charge may apply",
    optional: "Photo, printing",
    notes: "Includes e-Medical Attendant options.",
  },
  {
    type: "Regular Tourist Visa",
    govFee: "~$160 for up to 10 years (U.S. nationals) — verify latest",
    serviceFee: "VFS service fee (e.g. ~$15.90) may apply",
    optional: "Courier, SMS, photo, printing",
    notes: "Consular/paper process via VFS.",
  },
  {
    type: "Regular Business Visa",
    govFee: "~$160 for up to 10 years (U.S. nationals) — verify latest",
    serviceFee: "VFS service fee may apply",
    optional: "Courier, SMS, photo, printing",
    notes: "Invitation letter usually required.",
  },
  {
    type: "Entry Visa (X)",
    govFee: "Varies by case — verify with consulate/VFS",
    serviceFee: "VFS service fee may apply",
    optional: "Courier, document prep, translations",
    notes: "Family-origin documents can affect cost/time.",
  },
  {
    type: "OCI Card",
    govFee: "Government fee + separate VFS fee — verify latest",
    serviceFee: "VFS/OCI service fee applies",
    optional: "Courier, photo, document prep",
    notes: "One-time facility; not a per-trip visa.",
  },
];

/* ─────────────── Processing-time planning cards ─────────── */

export const processingCards: { label: string; estimate: string; note: string }[] = [
  {
    label: "eVisa",
    estimate: "Often a few business days",
    note: "Faster on average, but apply early — approval isn't guaranteed and some take longer.",
  },
  {
    label: "Regular visa (tourist/business)",
    estimate: "Minimum 3 working days after receipt",
    note: "Real-world timing is often longer once VFS handling and mailing are included.",
  },
  {
    label: "Entry Visa",
    estimate: "Can take longer",
    note: "Origin/family documents may need extra review at the consulate.",
  },
  {
    label: "OCI",
    estimate: "Usually longer than a visa",
    note: "Plan far ahead — do not treat OCI as an urgent-travel solution if it isn't approved yet.",
  },
];

/* ─────────────── Common mistakes (reused / adapted) ─────────── */

export const commonMistakes: { title: string; body: string }[] = [
  { title: "Passport expiring too soon", body: "India generally wants at least 6 months of passport validity and blank pages. Renew first if you're close to the limit." },
  { title: "Name mismatch", body: "Names must match across passport, application, and supporting documents. Mismatches (especially after marriage) cause delays." },
  { title: "Wrong visa type", body: "Applying for a tourist visa when your trip is business (or vice versa), or an eVisa when your case needs a regular/Entry Visa." },
  { title: "Applying too late", body: "Leaving little buffer before travel. Apply early, especially with minors, name changes, or old-Indian-passport questions." },
  { title: "Old Indian passport / surrender questions", body: "Former Indian citizens are often asked about surrender/renunciation of the Indian passport. Sort this out before applying." },
  { title: "Photo or document format errors", body: "Photos and scans that don't meet the portal/VFS specs are a frequent rejection reason. Follow the exact requirements." },
];

/* ─────────────────────────── FAQs ─────────────────────────── */

export const hubFaqs: FaqItem[] = [
  { question: "Do U.S. citizens need a visa for India?", answer: "Yes. U.S. citizens generally need a visa to enter India. Most short trips for tourism, business, or medical treatment can use an eVisa if eligible; some cases need a regular visa or Entry Visa. Indian-origin U.S. citizens may prefer OCI. Verify your category before you travel." },
  { question: "Can U.S. citizens get India visa on arrival?", answer: "U.S. citizens should not rely on visa on arrival for India. The practical route is to apply for an eVisa online in advance, or a regular visa through VFS Global / the Indian Consulate. Confirm current rules before booking travel." },
  { question: "How long does India visa processing take from USA?", answer: "eVisas are often processed within a few business days, while regular visas require a minimum of 3 working days after the Mission receives them and are frequently longer in practice. Entry Visas and OCI can take longer. Apply early — these are estimates, not guarantees." },
  { question: "How much does an India visa cost for U.S. citizens?", answer: "For U.S. nationals, a regular tourist or business visa valid up to 10 years is commonly around a $160 government fee, plus a possible VFS service fee. eVisa fees vary by type, validity, and current rules. Always verify the latest official fee before paying." },
  { question: "Is India eVisa better than a regular tourist visa?", answer: "For eligible short trips, the eVisa is usually faster and simpler. A regular tourist visa can be better for longer stays, more entries, or cases not eligible for the eVisa. Compare both before choosing." },
  { question: "Can Indian-origin U.S. citizens use OCI instead of a visa?", answer: "Often yes. OCI is a lifelong multiple-entry facility for eligible people of Indian origin and can be more convenient for frequent travel. It is not a visa and not citizenship, and it usually takes longer to obtain — so it's not an urgent-travel solution if you don't already hold it." },
  { question: "Which India visa is best for a non-Indian spouse?", answer: "A non-Indian spouse of an Indian citizen or OCI holder often uses an Entry Visa, and may be eligible for OCI in some cases. The right path depends on documents and current rules — check with the consulate/VFS." },
  { question: "What documents are required for India visa from USA?", answer: "Typically a passport valid at least 6 months with blank pages, a compliant photo, a completed application, and purpose-of-travel documents (itinerary, invitation letter, or hospital letter). Business, medical, Entry, and student visas have extra requirements." },
  { question: "Can I apply for an India visa if my passport expires soon?", answer: "It's risky. India generally expects at least 6 months of passport validity and blank pages. If you're close to expiry, renew your passport first to avoid rejection or complications at the border." },
  { question: "What should I do if my India visa is delayed?", answer: "Check your application status on the eVisa portal or VFS tracking, confirm you submitted complete and correct documents, and contact VFS/the consulate if it's past normal timelines. Avoid non-refundable bookings until you're approved." },
  { question: "Is VFS required for India visa from USA?", answer: "For eVisas you apply directly on the government portal, not VFS. For regular, Entry, student, employment visas and OCI, VFS Global is the authorized service provider in the USA in most jurisdictions." },
  { question: "Can minors apply for India visa from USA?", answer: "Yes. U.S.-born children usually need their own visa or OCI. Applications typically require the child's birth certificate and parents' documents, and Entry Visa/OCI is common for Indian-origin families. Build in extra time for minors." },
  { question: "What is the difference between Entry Visa India and Tourist Visa India?", answer: "A tourist visa is for sightseeing and short visits. An Entry Visa is commonly used for Indian-origin people, non-Indian spouses, and minor children visiting family or living with relatives — situations that don't fit the tourist/eVisa box." },
  { question: "What is India visa multiple entry?", answer: "A multiple-entry visa lets you enter India more than once while it's valid, which suits travelers who leave and return during a trip. Availability depends on the visa type and current rules — confirm before relying on it." },
  { question: "How do I get a visa in India?", answer: "If you are outside India, you usually apply through the official Indian visa/eVisa portal or the authorized service provider (VFS) for your country. If you are already in India and need an extension or a status change, the process may involve the FRRO/FRO depending on your case." },
];

export const eVisaFaqs: FaqItem[] = [
  { question: "What is India eVisa?", answer: "The eVisa is an electronically-issued travel authorization applied for online at Indianvisaonline.gov.in. It covers e-Tourist, e-Business, and e-Medical categories for eligible nationalities, without visiting a consulate." },
  { question: "Are U.S. citizens eligible for India eVisa?", answer: "U.S. citizens are generally among the eligible nationalities for the eVisa, subject to purpose and current rules. Some situations (longer stays, certain family cases) still need a regular or Entry Visa." },
  { question: "How long does India eVisa processing take?", answer: "eVisas are often approved within a few business days, but you should apply well before travel. Processing can take longer, and approval is never guaranteed — do not book non-refundable travel until you're authorized." },
  { question: "How much does an India eVisa cost?", answer: "The eVisa fee varies by visa type, validity, nationality, and current government rules, and a small bank/processing charge may apply. Verify the exact amount on the official portal before paying." },
  { question: "What documents do I need for an India eVisa?", answer: "Usually a passport valid at least 6 months with blank pages, a recent passport-style photo meeting the portal specs, a scan of your passport bio page, and business or medical documents for those categories." },
  { question: "Where do I apply for the India online visa?", answer: "Only through the official government portal, Indianvisaonline.gov.in. Be cautious of look-alike third-party sites that charge extra fees." },
  { question: "Can I enter India anywhere with an eVisa?", answer: "eVisa holders can typically enter through designated airports and seaports only. Confirm the current list of authorized entry points before you travel." },
  { question: "Is eVisa or OCI better for Indian-origin travelers?", answer: "If you're eligible, OCI is usually more convenient for frequent, long-term travel because it's a lifelong facility. The eVisa is simpler for a one-off short trip, but it isn't a substitute for OCI's benefits." },
  { question: "Can I extend or convert an eVisa?", answer: "eVisas have limited validity and entries and are generally not meant for long stays or conversion. If your plans change, check current rules — you may need a different visa category." },
  { question: "What are common eVisa mistakes?", answer: "Uploading a photo or passport scan that doesn't meet specs, choosing the wrong category, entering name/passport details that don't match, applying too late, and paying on an unofficial site." },
];

export const touristFaqs: FaqItem[] = [
  { question: "Is a visitor visa for India the same as a tourist visa?", answer: "Yes. 'India visitor visa' and 'visitor visa for India' are common informal names for the tourist visa — there is no separate visitor-visa category. For most short leisure or family trips you'll use the e-Tourist Visa, or a regular tourist visa for longer or non-eligible cases." },
  { question: "Which India tourist visa should I choose?", answer: "For a short, eligible trip, the e-Tourist Visa is usually fastest. For longer stays, more entries, or cases not eligible for the eVisa, a regular tourist visa via VFS/consulate may be better." },
  { question: "How much is the India tourist visa fee from USA?", answer: "eVisa tourist fees vary by validity and rules. A regular tourist visa for U.S. nationals valid up to 10 years is commonly around a $160 government fee, plus a possible VFS service fee. Verify the latest amounts." },
  { question: "How long does the India tourist visa take?", answer: "eTourist visas are often approved within a few business days; regular tourist visas need a minimum of 3 working days after receipt and are frequently longer. Apply early, especially around holidays." },
  { question: "Can I get a multiple-entry India tourist visa?", answer: "Multiple-entry options exist for some tourist visa types, letting you enter India more than once during validity. Availability depends on category and current rules — confirm before you rely on it." },
  { question: "What documents do I need for an India tourist visa?", answer: "Typically a passport valid 6+ months with blank pages, a compliant photo, a completed application, and travel details. Regular visas via VFS may require proof of U.S. status and additional forms." },
  { question: "Can I visit family in India on a tourist visa?", answer: "Yes, short family visits are a common tourist-visa use. However, Indian-origin travelers and those living long-term with family may find OCI or an Entry Visa more suitable." },
  { question: "Is there visa on arrival for tourists to India?", answer: "U.S. citizens should not rely on visa on arrival. Apply for an e-Tourist Visa online in advance, or a regular tourist visa through VFS/consulate." },
  { question: "What passport validity do I need for an India tourist visa?", answer: "Generally at least 6 months of validity beyond your travel dates plus blank pages. If your passport is close to expiring, renew it before applying." },
  { question: "Can I apply for an India tourist visa for my child?", answer: "Yes. Minors usually need their own visa. For Indian-origin families, an Entry Visa or OCI is often more appropriate — build in extra processing time." },
  { question: "What are common tourist visa mistakes?", answer: "Choosing the wrong entry count, ignoring passport validity, name mismatches, applying too late for a wedding or event, and using unofficial application websites." },
];

export const businessFaqs: FaqItem[] = [
  { question: "Do I need an eBusiness visa or a regular business visa?", answer: "For short, eligible business trips — meetings, conferences, trade shows — the e-Business Visa is usually simplest. Longer, repeat, or broader-scope business travel may call for a regular business visa via VFS/consulate." },
  { question: "What is an invitation letter for an India business visa?", answer: "It's a letter from the Indian company or host inviting you, stating the purpose, duration, and relationship. It's a standard requirement for business visas and should match your application details." },
  { question: "What documents does an India business visa need?", answer: "Commonly a valid passport with blank pages, the application, an invitation letter from the Indian host, a letter from your U.S. employer, a business card, and company proof. Requirements vary — check current rules." },
  { question: "How much is the India business visa fee?", answer: "A regular business visa for U.S. nationals valid up to 10 years is commonly around a $160 government fee, plus a possible VFS service fee. eBusiness fees vary. Verify the latest official amounts." },
  { question: "How long does the India business visa take?", answer: "eBusiness visas are often approved within a few business days; regular business visas require a minimum of 3 working days after receipt and are often longer. Apply early for conferences and fixed-date events." },
  { question: "Can I work in India on a business visa?", answer: "No. A business visa is for permitted business activities like meetings and negotiations — not employment. Working for an Indian organization generally requires an Employment Visa." },
  { question: "Can I attend a conference in India on an eBusiness visa?", answer: "Attending conferences and trade shows is a typical business-visa purpose. Confirm your specific activity is permitted under the category and keep your invitation/agenda handy." },
  { question: "Do I need company proof for an India business visa?", answer: "Often yes — a business card and evidence of your company or the Indian host's business may be requested. Provide what the application asks for to avoid delays." },
  { question: "What passport validity is required for a business visa?", answer: "Generally at least 6 months beyond travel plus blank pages. Renew first if you're close to expiry." },
  { question: "What are common business visa mistakes?", answer: "Missing or mismatched invitation letters, applying under the wrong category, weak company documentation, and leaving too little time before a fixed event date." },
];

export const entryFaqs: FaqItem[] = [
  { question: "Who may need an Entry Visa for India?", answer: "The Entry (X) Visa is commonly used by people of Indian origin, non-Indian spouses of Indian citizens/OCI holders, and minor children — situations that don't fit the tourist/eVisa box or where OCI isn't held." },
  { question: "What is the difference between an Entry Visa and a tourist visa?", answer: "A tourist visa is for sightseeing and short visits. An Entry Visa suits family-based travel and living with relatives in India, and is often used by Indian-origin families and their non-Indian spouses/children." },
  { question: "Is an Entry Visa or OCI better?", answer: "OCI is a lifelong multiple-entry facility and usually more convenient for frequent travel if you're eligible, but it takes longer to obtain. An Entry Visa can be faster for a specific trip or when OCI isn't available yet." },
  { question: "Can a non-Indian spouse get an Entry Visa?", answer: "Yes, a non-Indian spouse of an Indian citizen or OCI holder often uses an Entry Visa, typically requiring the marriage certificate and the spouse's Indian/OCI documents. Some spouses may also qualify for OCI." },
  { question: "How do U.S.-born children of Indian-origin parents travel to India?", answer: "U.S.-born children usually need their own status — commonly an Entry Visa or OCI, with the child's birth certificate and parents' documents. Apply early because minor cases can take longer." },
  { question: "What documents are needed for an India Entry Visa?", answer: "Typically a valid passport, proof of Indian origin or the family relationship, marriage/birth certificates where relevant, and old Indian passport / surrender documents for former citizens. Requirements vary by case." },
  { question: "How long does an India Entry Visa take?", answer: "It can take longer than a tourist visa because origin and family documents may need extra review. Apply well ahead of travel and keep your supporting documents complete and consistent." },
  { question: "Do Indian citizens need a visa to enter India?", answer: "No. Indian citizens do not need an India visa to enter India. This guide is for U.S.-based travelers applying for a visa to India — not for Indian citizens seeking a U.S. visa." },
  { question: "How much does an India Entry Visa cost?", answer: "Fees vary by case and validity. Check the current government fee and any VFS service fee for your category — amounts here are estimates for planning only." },
  { question: "What are common Entry Visa mistakes?", answer: "Incomplete proof of origin or relationship, name mismatches after marriage, missing surrender/renunciation documents for former Indian citizens, and underestimating processing time for minors." },
];

export const feesFaqs: FaqItem[] = [
  { question: "How much does an India visa cost from USA?", answer: "It depends on the type. A regular tourist or business visa for U.S. nationals valid up to 10 years is commonly around a $160 government fee, plus a possible VFS service fee. eVisa fees vary by category and validity. Always verify the latest official amount." },
  { question: "What is the India tourist visa fee?", answer: "eTourist fees vary by validity and rules; a regular tourist visa for U.S. nationals (up to 10 years) is commonly around $160 government fee plus a possible VFS service fee. Verify current figures before paying." },
  { question: "Is there a VFS service fee on top of the visa fee?", answer: "For regular, Entry, student, employment visas and OCI processed through VFS, a service fee (for example around $15.90) may apply in addition to the government fee. eVisas are paid directly on the portal." },
  { question: "Why is my India visa cost different from the quoted fee?", answer: "Final cost changes with nationality, visa category, validity, consulate jurisdiction, service provider, and optional services like courier, SMS, photos, and printing. Treat published figures as estimates." },
  { question: "Are India eVisa fees fixed?", answer: "No. eVisa fees vary by visa type, validity, nationality, and current government rules, and a bank/processing charge may apply. Confirm the exact amount on the official portal before payment." },
  { question: "What optional costs should I budget for?", answer: "Courier/shipping, SMS updates, passport photos, printing, and document preparation or translations. These add to the base government fee, especially for regular visas via VFS." },
  { question: "Do children pay the same India visa fee?", answer: "Fees can differ for minors and by category. Check the current fee schedule for the specific visa or OCI you're applying for." },
  { question: "Are India visa fees refundable?", answer: "Government and service fees are generally non-refundable even if an application is refused. Apply carefully and confirm you're using the correct category and current fee before paying." },
  { question: "How do I pay the India visa fee?", answer: "eVisa fees are paid online on the government portal by card. Regular visa and OCI fees are paid through VFS per its accepted methods. Use only official channels." },
  { question: "Where can I verify the latest India visa fees?", answer: "Check Indianvisaonline.gov.in, VFS Global USA, and your Indian Consulate. Fees change, so always confirm the current amount before applying." },
];

export const processingFaqs: FaqItem[] = [
  { question: "How long does an India visa take from USA?", answer: "eVisas are often approved within a few business days; regular visas require a minimum of 3 working days after the Mission receives them and are frequently longer once VFS handling and mailing are included. Entry Visas and OCI can take longer. These are estimates, not guarantees." },
  { question: "How long does the India eVisa take to process?", answer: "Commonly a few business days, but apply well ahead of travel. Some applications take longer, and approval isn't guaranteed — don't book non-refundable travel until you're authorized." },
  { question: "What is the minimum India regular visa processing time?", answer: "The stated minimum is 3 working days after the application is received by the Indian Mission/Post, excluding special cases. Real-world timing is often longer, so plan a buffer." },
  { question: "How long does an India Entry Visa take?", answer: "Entry Visas can take longer than tourist visas because origin and family documents may need additional review. Apply early and keep your documentation complete and consistent." },
  { question: "How long does OCI take compared to a visa?", answer: "OCI usually takes longer than a visa and is not suitable for urgent travel if you don't already hold it. If you need to travel soon, a visa is generally the faster route." },
  { question: "Why do India visa applications get delayed?", answer: "Common causes include incomplete or inconsistent documents, name mismatches, passport-validity issues, old-Indian-passport/surrender questions, minor-child cases, high consulate workload, and holidays." },
  { question: "How early should I apply before traveling to India?", answer: "Apply as early as your dates allow — several weeks ahead when possible, and even earlier for Entry Visa, minors, name changes, or OCI. Don't leave it to the last week." },
  { question: "Can I expedite an urgent India visa?", answer: "Genuine emergencies (serious family illness or bereavement) are handled case by case — contact the Indian Consulate or VFS directly. Do not rely on OCI for urgent travel if it isn't approved." },
  { question: "Does VFS add to the processing time?", answer: "Yes. For regular visas, VFS intake, consular processing, and return mailing all add to the timeline beyond the stated minimum. Factor this into your planning." },
  { question: "How do I check my India visa status?", answer: "Use the eVisa portal's status check for eVisas, or VFS tracking for regular visas and OCI. If you're past normal timelines, contact VFS or the consulate." },
];

export const ociFaqs: FaqItem[] = [
  { question: "Is OCI a visa?", answer: "No. OCI (Overseas Citizen of India) is a lifelong multiple-entry facility for eligible people of Indian origin — not a visa and not Indian citizenship. It removes the need for a visa for most travel to India once you hold it." },
  { question: "Should I get OCI or an India visa?", answer: "If you're eligible and travel to India often, OCI is usually more convenient long-term. For a one-off short trip, or if you need to travel soon, a visa (often an eVisa) is faster because OCI takes longer to obtain." },
  { question: "What is the difference between OCI and an eVisa?", answer: "An eVisa is a short-term travel permit with limited validity and entries. OCI is a lifelong multiple-entry facility for Indian-origin people, offering broader long-term convenience but requiring eligibility and more processing time." },
  { question: "What is the difference between OCI and an Entry Visa?", answer: "An Entry Visa is issued for a specific period and purpose (often family-based), while OCI is a permanent facility. Non-Indian spouses and children sometimes use an Entry Visa first and pursue OCI later if eligible." },
  { question: "Is OCI better for a non-Indian spouse?", answer: "It depends. Some non-Indian spouses qualify for OCI and benefit from its long-term convenience; others use an Entry Visa, especially for a quicker single trip. Check eligibility and current rules." },
  { question: "Is OCI better for a U.S.-born child?", answer: "For Indian-origin U.S.-born children who will visit India regularly, OCI is often convenient long-term. For a single upcoming trip, an Entry Visa may be faster. Apply early either way." },
  { question: "How long does OCI take versus a visa?", answer: "OCI generally takes longer than a visa. If your travel is soon, don't count on OCI — use a visa and consider OCI for the future." },
  { question: "How much does OCI cost compared to a visa?", answer: "OCI has a government fee plus a separate VFS/OCI service fee, and it's a one-time facility rather than a per-trip cost. A visa fee is per application. Verify the latest amounts on official sources." },
  { question: "Does OCI make me an Indian citizen?", answer: "No. OCI is not dual citizenship and does not grant a right to vote, hold certain offices, or buy certain agricultural property. It's a long-term travel and residence facility for Indian-origin people." },
  { question: "Can I use OCI for urgent travel if it's not approved yet?", answer: "No. OCI is not an urgent-travel solution before it's issued. If you must travel soon and don't hold OCI, apply for a visa (often an eVisa) instead." },
];

/* ─────────────── Cross-page related NRI links ─────────── */

export const indiaVisaRelatedLinks: { href: string; label: string; desc: string }[] = [
  { href: "/oci", label: "OCI Card (Resource Center)", desc: "Eligibility, documents, timeline, and cost for the OCI card — often better than a visa for Indian-origin travelers" },
  { href: "/indian-passport-renewal-usa", label: "Indian Passport Renewal in USA", desc: "Renew your Indian passport before you apply for a visa or OCI card — expiry and name mismatches are the top delays" },
  { href: "/return-to-india", label: "Return to India Planning", desc: "Moving-back checklist for NRIs and families" },
  { href: "/send-money-to-india", label: "Send Money to India", desc: "Compare transfer options for your trip or family" },
  { href: "/immigration", label: "Immigration Hub", desc: "All U.S. immigration and India-USA travel guides" },
];
