/**
 * Shared, EDITABLE data for the "India Visa from USA" SEO cluster.
 *
 * These are ESTIMATED all-in costs and processing times for planning, shown
 * with concrete numbers (government fee + service fee + photo + shipping) and
 * a single "estimates may change" disclaimer + last-checked date, rather than
 * repeated "verify on the portal" hedging. Update the numbers here monthly and
 * bump INDIA_VISA_UPDATED.
 */
import type { FaqItem } from "@/lib/seo";

/* ─────────────────────────── Dates ─────────────────────────── */

export const INDIA_VISA_PUBLISHED = "2026-07-05";
export const INDIA_VISA_UPDATED = "2026-07-05";
export const INDIA_VISA_UPDATED_HUMAN = "July 5, 2026";

/** Small, reusable "estimates may change" line shown near every fee/time table. */
export const INDIA_VISA_ESTIMATE_DISCLAIMER = `Estimated costs and times for planning only — they can change. Last checked: ${INDIA_VISA_UPDATED_HUMAN}.`;

/** Format a dollar amount. */
export const usd = (n: number) => `$${n}`;

/* ─────────────────────── Core config object ─────────────────── */

export const indiaVisaConfig = {
  lastReviewed: INDIA_VISA_UPDATED_HUMAN,

  // Concrete timeline estimates.
  eVisaProcessingNote:
    "The India eVisa is usually approved in about 3–5 business days. Apply at least a week before travel to leave a buffer.",
  regularVisaProcessingNote:
    "A regular visa through VFS usually takes about 5–10 business days once VFS intake, consular processing, and return mailing are counted.",

  // Concrete all-in fee estimates (US applicants).
  touristVisaUSFeeEstimate:
    "A regular tourist visa (valid up to 10 years) is about $216 all-in: $160 government fee + ~$19 VFS/ICWF service + ~$12 photo + ~$25 courier.",
  businessVisaUSFeeEstimate:
    "A regular business visa (valid up to 10 years) is about $216 all-in: $160 government fee + ~$19 VFS/ICWF service + ~$12 photo + ~$25 courier.",
  eVisaFeeEstimate:
    "An e-Tourist Visa (1 year) is about $54 all-in; an e-Business or e-Medical Visa is about $95 all-in, including the government fee, payment charge, and a ~$12 photo.",

  // Small disclaimers (one clear line each — no "check the portal" hedging).
  feeDisclaimer: INDIA_VISA_ESTIMATE_DISCLAIMER,
  timelineDisclaimer: INDIA_VISA_ESTIMATE_DISCLAIMER,
  officialSourcesNote: INDIA_VISA_ESTIMATE_DISCLAIMER,
  approvalNote:
    "These are estimates, not guarantees — no visa or OCI approval is ever guaranteed, and government fees are generally non-refundable.",
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

/* ─────────────────── Master fee + time model ────────────────── */
/**
 * Single source of truth for estimated fees and times by visa category.
 * All amounts are US-applicant estimates in USD; `total` is the sum of
 * govFee + serviceFee + photoFee + shipping. Summary tables (total cost by
 * category, total time by category) and the detailed breakdown all derive
 * from this array.
 */
export interface CategoryFee {
  type: string;
  govFee: number;
  serviceFee: number; // VFS + ICWF, or eVisa payment charge
  photoFee: number;
  shipping: number; // courier both ways (0 for online eVisa)
  total: number;
  time: string; // estimated processing time
  validity: string;
}

export const feeByCategory: CategoryFee[] = [
  { type: "e-Tourist Visa (1 yr)", govFee: 40, serviceFee: 2, photoFee: 12, shipping: 0, total: 54, time: "3–5 business days", validity: "1 year, multiple entry" },
  { type: "e-Business Visa (1 yr)", govFee: 80, serviceFee: 3, photoFee: 12, shipping: 0, total: 95, time: "3–5 business days", validity: "1 year, multiple entry" },
  { type: "e-Medical Visa", govFee: 80, serviceFee: 3, photoFee: 12, shipping: 0, total: 95, time: "3–5 business days", validity: "Up to 60 days, triple entry" },
  { type: "Regular Tourist Visa (10 yr)", govFee: 160, serviceFee: 19, photoFee: 12, shipping: 25, total: 216, time: "5–10 business days", validity: "Up to 10 years, multiple entry" },
  { type: "Regular Business Visa (10 yr)", govFee: 160, serviceFee: 19, photoFee: 12, shipping: 25, total: 216, time: "5–10 business days", validity: "Up to 10 years, multiple entry" },
  { type: "Entry Visa (X)", govFee: 120, serviceFee: 19, photoFee: 12, shipping: 25, total: 176, time: "2–3 weeks", validity: "Up to 5 years, multiple entry" },
  { type: "OCI Card", govFee: 275, serviceFee: 22, photoFee: 12, shipping: 25, total: 334, time: "8–12 weeks", validity: "Lifelong facility" },
];

/** Compact "total cost by category" rows (for the summary table). */
export const totalCostByCategory = feeByCategory.map((r) => ({
  type: r.type,
  total: r.total,
  breakdown: `${usd(r.govFee)} gov + ${usd(r.serviceFee)} service + ${usd(r.photoFee)} photo${r.shipping ? ` + ${usd(r.shipping)} courier` : ""}`,
}));

/** Compact "total time by category" rows (for the summary table). */
export const totalTimeByCategory = feeByCategory.map((r) => ({
  type: r.type,
  time: r.time,
  validity: r.validity,
}));

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
  { type: "e-Tourist Visa", bestFor: "Short tourism, family visits, sightseeing", processing: "3–5 business days", fee: "~$54 all-in", where: "Online (eVisa portal)", notes: "1-year multiple entry; enter via designated airports/seaports." },
  { type: "e-Business Visa", bestFor: "Meetings, conferences, trade shows, vendor visits", processing: "3–5 business days", fee: "~$95 all-in", where: "Online (eVisa portal)", notes: "For permitted business activities; not for employment." },
  { type: "e-Medical Visa", bestFor: "Treatment at recognized hospitals (+ attendant)", processing: "3–5 business days", fee: "~$95 all-in", where: "Online (eVisa portal)", notes: "Up to 60 days, triple entry." },
  { type: "Regular Tourist Visa", bestFor: "Longer or 10-year tourism, non-eVisa cases", processing: "5–10 business days", fee: "~$216 all-in", where: "VFS Global USA", notes: "Includes $160 gov + VFS + photo + courier." },
  { type: "Regular Business Visa", bestFor: "Longer-term or repeat business travel", processing: "5–10 business days", fee: "~$216 all-in", where: "VFS Global USA", notes: "Invitation letter + company proof required." },
  { type: "Entry Visa (X)", bestFor: "Indian-origin families, non-Indian spouses, children", processing: "2–3 weeks", fee: "~$176 all-in", where: "VFS Global USA", notes: "Family-based; origin documents reviewed." },
  { type: "Student Visa", bestFor: "Full-time study at a recognized institution", processing: "2–4 weeks", fee: "~$180 all-in", where: "VFS Global USA", notes: "Admission letter required." },
  { type: "Employment Visa", bestFor: "Working for an organization in India", processing: "3–6 weeks", fee: "~$220 all-in", where: "VFS Global USA", notes: "Employment contract + salary thresholds apply." },
  { type: "OCI Card", bestFor: "Indian-origin U.S. citizens who travel often", processing: "8–12 weeks", fee: "~$334 all-in", where: "VFS Global USA", notes: "Lifelong facility — not a visa, not citizenship." },
  { type: "Emergency / urgent travel", bestFor: "Genuine emergencies (illness, bereavement)", processing: "Often 1–3 days (priority)", fee: "From ~$216 + priority", where: "Indian Consulate / VFS", notes: "Handled case by case; OCI is not an urgent-travel fix." },
];

/* ─────────────── Hub: "quick pick" recommendation cards ─────────── */

export const hubPickCards: { badge: string; title: string; body: string; href: string }[] = [
  { badge: "Short tourist trip", title: "India e-Tourist Visa", body: "~$54 all-in, approved in 3–5 business days — for sightseeing, weddings, and short family visits.", href: "/india-tourist-visa-from-usa" },
  { badge: "Indian-origin, long-term", title: "OCI or Entry Visa", body: "OCI ~$334 (8–12 weeks) or Entry Visa ~$176 (2–3 weeks) — for families, spouses, and children.", href: "/oci-vs-india-visa" },
  { badge: "Business / conference", title: "e-Business or Business Visa", body: "e-Business ~$95 (3–5 days) or regular ~$216 (5–10 days) — for meetings and trade shows.", href: "/india-business-visa-from-usa" },
];

/* ─────────────── Hub: "common searches explained" block ─────────── */

// `href` is optional: glossary items that would only point back to the hub
// itself are left plain (no self-link) to avoid self-referencing loops.
export const commonSearches: { term: string; answer: string; href?: string }[] = [
  { term: "India visa", answer: "An India visa is permission for a foreign national, including most U.S. citizens, to enter India for tourism, business, medical treatment, study, work, or family-related travel. The right option depends on your purpose, stay length, and eligibility for eVisa, regular visa, Entry Visa, or OCI." },
  { term: "Indian visa for U.S. citizen", answer: "Most U.S. citizens need either an India eVisa for short trips or a regular visa for longer or non-eVisa cases. Indian-origin U.S. citizens may also compare visa options with OCI.", href: "/india-evisa-for-us-citizens" },
  { term: "India online visa", answer: "India online visa usually refers to the India eVisa application completed before travel. It may be used for eligible tourism, business, medical, and conference-related travel.", href: "/india-evisa-for-us-citizens" },
  { term: "India tourist visa", answer: "An India tourist visa is used for tourism, sightseeing, weddings, and short family visits. Eligible U.S. citizens often compare e-Tourist Visa with regular tourist visa.", href: "/india-tourist-visa-from-usa" },
  { term: "Indian travel visa", answer: "Indian travel visa is a broad search term. For U.S.-based travelers, it usually means an India tourist visa, eVisa, or another visa based on trip purpose.", href: "/india-tourist-visa-from-usa" },
  { term: "India visa multiple entry", answer: "Multiple entry means you can enter India more than once during the visa validity period. Some India eVisas, regular tourist visas, business visas, Entry Visas, and OCI options may allow multiple entries depending on category and approval." },
  { term: "Visa on arrival for Indians", answer: "Visa on arrival for Indians is a mixed-intent search. Indian citizens do not need a visa to enter India. U.S. citizens traveling to India should apply in advance through the India eVisa system or, when required, a regular visa through VFS/consulate." },
  { term: "Entry visa India", answer: "Entry Visa India may be relevant for Indian-origin families, non-Indian spouses, and minor children when a tourist visa or eVisa does not fit the purpose.", href: "/entry-visa-india-from-usa" },
  { term: "OCI card vs eVisa", answer: "OCI is a long-term facility for eligible Indian-origin travelers, while eVisa is a short-term online travel authorization. OCI is not a visa and is usually not the fastest solution for urgent travel.", href: "/oci-vs-india-visa" },
];

/* ─────────────── Hub: decision-guide outputs ─────────── */

export const decisionOutputs: { key: string; label: string; blurb: string; href: string }[] = [
  { key: "etourist", label: "e-Tourist Visa may fit", blurb: "~$54 all-in, 3–5 business days — short tourism or family visit.", href: "/india-tourist-visa-from-usa" },
  { key: "ebusiness", label: "e-Business Visa may fit", blurb: "~$95 all-in, 3–5 business days — meetings or conferences.", href: "/india-business-visa-from-usa" },
  { key: "emedical", label: "e-Medical Visa may fit", blurb: "~$95 all-in, 3–5 business days — treatment at a recognized hospital.", href: "/india-evisa-for-us-citizens" },
  { key: "entry", label: "Entry Visa may fit", blurb: "~$176 all-in, 2–3 weeks — Indian-origin family, spouse, or child.", href: "/entry-visa-india-from-usa" },
  { key: "tourist", label: "Regular Tourist Visa may fit", blurb: "~$216 all-in, 5–10 business days — longer or 10-year travel.", href: "/india-tourist-visa-from-usa" },
  { key: "oci", label: "OCI may be better", blurb: "~$334 all-in, 8–12 weeks — Indian-origin, frequent travel.", href: "/oci-vs-india-visa" },
  { key: "consulate", label: "Special case — Entry Visa or consulate route", blurb: "Study, work, or emergency travel — see the Entry Visa guide.", href: "/entry-visa-india-from-usa" },
];

/* ─────────────────────── Documents checklists ──────────────────── */

export const eVisaDocuments: string[] = [
  "Passport valid at least 6 months with 2+ blank pages",
  "Recent color passport-style photo (~$12 at a pharmacy, or free at home)",
  "Scanned passport bio page",
  "Confirmed return/onward travel details",
  "Business/medical supporting documents for e-Business or e-Medical",
  "A payment card for the online fee (~$54–$95 all-in)",
];

export const regularVisaDocuments: string[] = [
  "Passport valid at least 6 months with 2+ blank pages",
  "Completed VFS/consular application form",
  "Passport-style photo (~$12)",
  "Proof of U.S. status/residence",
  "Purpose-of-travel documents (itinerary, invitation, hospital letter)",
  "VFS service fee (~$19) + prepaid courier label (~$25)",
];

export const businessDocuments: string[] = [
  "Passport valid 6+ months with blank pages",
  "Completed business visa application",
  "Invitation letter from the Indian company/host",
  "Letter from your U.S. employer describing the purpose",
  "Business card and company proof",
  "Photo (~$12) + VFS service (~$19) + courier (~$25)",
];

export const entryVisaDocuments: string[] = [
  "Passport valid 6+ months with blank pages",
  "Proof of Indian origin or the family relationship",
  "Marriage certificate (for a non-Indian spouse)",
  "Child's birth certificate + parents' documents (for a minor)",
  "Prior Indian passport / surrender or renunciation certificate where relevant",
  "Photo (~$12) + VFS service (~$19) + courier (~$25)",
];

/* ─────────────── Processing-time planning cards ─────────── */

export const processingCards: { label: string; estimate: string; note: string }[] = [
  { label: "eVisa (tourist/business/medical)", estimate: "3–5 business days", note: "Fastest route — apply about a week before travel." },
  { label: "Regular visa (tourist/business)", estimate: "5–10 business days", note: "Includes VFS intake, consular processing, and return courier." },
  { label: "Entry Visa (X)", estimate: "2–3 weeks", note: "Origin/family documents add review time." },
  { label: "OCI", estimate: "8–12 weeks", note: "Two-stage clearance — plan far ahead, not for urgent travel." },
];

/* ─────────────── Common mistakes ─────────── */

export const commonMistakes: { title: string; body: string }[] = [
  { title: "Passport expiring too soon", body: "India needs at least 6 months of passport validity and blank pages. Renew first if you're close — a rejected application still costs the ~$54–$216 you paid." },
  { title: "Name mismatch", body: "Names must match across passport, application, and supporting documents. Mismatches (especially after marriage) cause delays and re-submission courier costs." },
  { title: "Wrong visa type", body: "Applying for a tourist visa when your trip is business (or vice versa), or an eVisa when your case needs a regular/Entry Visa." },
  { title: "Applying too late", body: "Leaving little buffer. Give the eVisa ~1 week, a regular visa ~2 weeks, an Entry Visa ~3 weeks, and OCI ~3 months." },
  { title: "Old Indian passport / surrender questions", body: "Former Indian citizens are asked about surrender/renunciation of the Indian passport. Sort this out before applying." },
  { title: "Photo or document format errors", body: "Photos and scans that don't meet spec are a frequent rejection reason. Budget ~$12 for a compliant photo and follow the size rules." },
];

/* ─────────────────────────── FAQs ─────────────────────────── */

export const hubFaqs: FaqItem[] = [
  { question: "Do U.S. citizens need a visa for India?", answer: "Yes. Most short trips use an e-Tourist Visa (~$54 all-in, 3–5 business days) or e-Business Visa (~$95). Longer cases use a regular visa (~$216, 5–10 days) or Entry Visa (~$176, 2–3 weeks). Indian-origin U.S. citizens may prefer OCI (~$334, 8–12 weeks)." },
  { question: "Can U.S. citizens get visa on arrival in India?", answer: "No. U.S. citizens should apply in advance through the India eVisa system if eligible, or through VFS/consulate for a regular visa if needed." },
  { question: "How long does India visa processing take from USA?", answer: "The eVisa takes about 3–5 business days, a regular tourist/business visa about 5–10 business days, an Entry Visa about 2–3 weeks, and OCI about 8–12 weeks. Apply early to leave a buffer." },
  { question: "How much does an India visa cost for U.S. citizens?", answer: "All-in estimates: e-Tourist ~$54, e-Business/e-Medical ~$95, regular tourist/business ~$216 ($160 government fee + ~$19 VFS + ~$12 photo + ~$25 courier), Entry Visa ~$176, and OCI ~$334." },
  { question: "Is India eVisa better than a regular tourist visa?", answer: "For eligible short trips the eVisa is cheaper (~$54 vs ~$216) and faster (3–5 vs 5–10 business days). A regular tourist visa is better for longer stays, 10-year validity, or non-eVisa cases." },
  { question: "Can Indian-origin U.S. citizens use OCI instead of a visa?", answer: "Often yes. OCI (~$334, 8–12 weeks) is a lifelong multiple-entry facility that's more convenient for frequent travel. It is not a visa and not citizenship, and it takes longer — so use a visa if you must travel soon." },
  { question: "Which India visa is best for a non-Indian spouse?", answer: "A non-Indian spouse of an Indian citizen or OCI holder usually uses an Entry Visa (~$176 all-in, 2–3 weeks), and may qualify for OCI (~$334, 8–12 weeks) for long-term convenience." },
  { question: "What documents are required for India visa from USA?", answer: "A passport valid 6+ months with blank pages, a ~$12 compliant photo, a completed application, and purpose-of-travel documents (itinerary, invitation letter, or hospital letter). Regular visas add a ~$19 VFS fee and ~$25 courier." },
  { question: "Can I apply for an India visa if my passport expires soon?", answer: "It's risky. India expects at least 6 months of validity and blank pages. Renew first — a rejected application still costs the ~$54–$216 you paid, plus re-application courier." },
  { question: "What should I do if my India visa is delayed?", answer: "Check your status (eVisa portal or VFS tracking), confirm your documents were complete, and contact VFS if it's past 5–10 business days (regular) or 5 days (eVisa). Avoid non-refundable bookings until approved." },
  { question: "Is VFS required for India visa from USA?", answer: "eVisas (~$54–$95) are applied for online, not through VFS. Regular, Entry, student, employment visas and OCI go through VFS Global, which adds a ~$19 service fee and ~$25 courier." },
  { question: "Can minors apply for India visa from USA?", answer: "Yes. U.S.-born children need their own visa or OCI, with the child's birth certificate and parents' documents. Entry Visa (~$176) or OCI (~$334) is common for Indian-origin families — allow extra time for minors." },
  { question: "What is the difference between Entry Visa India and Tourist Visa India?", answer: "A tourist visa (~$54 eVisa / ~$216 regular) is for sightseeing and short visits. An Entry Visa (~$176, 2–3 weeks) is for Indian-origin people, non-Indian spouses, and minor children visiting or living with family." },
  { question: "What is India visa multiple entry?", answer: "A multiple-entry visa lets you enter India more than once while it's valid. The 1-year eVisa (~$54) and the 10-year regular visa (~$216) are both multiple entry." },
  { question: "How do I get a visa in India?", answer: "If you're outside India, apply through the official eVisa portal (~$54–$95) or VFS (~$216). If you're already in India and need an extension or status change, the process may involve the FRRO/FRO depending on your case." },
];

export const eVisaFaqs: FaqItem[] = [
  { question: "What is India eVisa?", answer: "An electronically-issued travel authorization applied for online at Indianvisaonline.gov.in. It covers e-Tourist (~$54 all-in), e-Business, and e-Medical (~$95) categories and is usually approved in 3–5 business days." },
  { question: "Are U.S. citizens eligible for India eVisa?", answer: "Yes, U.S. citizens are eligible for the eVisa, subject to purpose. e-Tourist is ~$54 all-in and e-Business/e-Medical ~$95, each approved in about 3–5 business days." },
  { question: "How long does India eVisa processing take?", answer: "About 3–5 business days. Apply at least a week before travel — approval is not guaranteed, and government fees are non-refundable." },
  { question: "How much does an India eVisa cost?", answer: "All-in estimates: e-Tourist Visa (1 year) about $54 — a ~$40 government fee, ~$2 payment charge, and a ~$12 photo. e-Business and e-Medical are about $95 (~$80 government fee + charge + photo). eVisas are applied online, so there's no courier cost." },
  { question: "What documents do I need for an India eVisa?", answer: "A passport valid 6+ months with blank pages, a recent ~$12 passport-style photo, a scan of your passport bio page, and business or medical documents for those categories." },
  { question: "Where do I apply for the India online visa?", answer: "On the official government portal, Indianvisaonline.gov.in. The all-in cost is about $54 (e-Tourist) to $95 (e-Business/e-Medical)." },
  { question: "Can I enter India anywhere with an eVisa?", answer: "eVisa holders enter through designated airports and seaports. The 1-year e-Tourist Visa allows multiple entries." },
  { question: "Is eVisa or OCI better for Indian-origin travelers?", answer: "For frequent travel, OCI (~$334, 8–12 weeks) is more convenient long-term. For a one-off short trip, the eVisa (~$54–$95, 3–5 days) is far cheaper and faster." },
  { question: "Can I extend or convert an eVisa?", answer: "eVisas have limited validity and entries and aren't meant for long stays. For a longer trip, use a regular visa (~$216) or, if Indian-origin, OCI (~$334)." },
  { question: "What are common eVisa mistakes?", answer: "A photo or passport scan that doesn't meet spec, choosing the wrong category, name/passport details that don't match, and applying too late — the eVisa needs about 3–5 business days plus a buffer." },
];

export const touristFaqs: FaqItem[] = [
  { question: "Is a visitor visa for India the same as a tourist visa?", answer: "Yes. 'India visitor visa' and 'visitor visa for India' are informal names for the tourist visa — there's no separate visitor-visa category. Most short trips use the e-Tourist Visa (~$54 all-in, 3–5 business days)." },
  { question: "Which India tourist visa should I choose?", answer: "For a short, eligible trip, the e-Tourist Visa (~$54 all-in, 3–5 business days) is cheapest and fastest. For longer stays or 10-year validity, a regular tourist visa (~$216, 5–10 business days) is better." },
  { question: "How much is the India tourist visa fee from USA?", answer: "The e-Tourist Visa is about $54 all-in (~$40 government + ~$2 charge + ~$12 photo). A regular 10-year tourist visa is about $216 ($160 government + ~$19 VFS + ~$12 photo + ~$25 courier)." },
  { question: "How long does the India tourist visa take?", answer: "The e-Tourist Visa takes about 3–5 business days; a regular tourist visa about 5–10 business days including VFS handling and return courier." },
  { question: "Can I get a multiple-entry India tourist visa?", answer: "Yes. The 1-year e-Tourist Visa (~$54) and the 10-year regular tourist visa (~$216) both allow multiple entries." },
  { question: "What documents do I need for an India tourist visa?", answer: "A passport valid 6+ months with blank pages, a ~$12 photo, a completed application, and travel details. Regular visas add a ~$19 VFS fee and ~$25 courier." },
  { question: "Can I visit family in India on a tourist visa?", answer: "Yes — short family visits are a common use. But Indian-origin travelers who visit often may prefer OCI (~$334) or an Entry Visa (~$176)." },
  { question: "Is there visa on arrival for tourists to India?", answer: "No. Apply for the e-Tourist Visa online in advance (~$54, 3–5 business days) or a regular tourist visa through VFS (~$216)." },
  { question: "What passport validity do I need for an India tourist visa?", answer: "At least 6 months beyond your travel dates plus blank pages. Renew first if you're close — a rejected visa still costs the ~$54–$216 you paid." },
  { question: "Can I apply for an India tourist visa for my child?", answer: "Yes. Minors need their own visa (~$54 eVisa). For Indian-origin families, an Entry Visa (~$176) or OCI (~$334) is often better — allow extra time." },
];

export const businessFaqs: FaqItem[] = [
  { question: "Do I need an eBusiness visa or a regular business visa?", answer: "For short, eligible business trips, the e-Business Visa (~$95 all-in, 3–5 business days) is simplest. Longer or broader-scope travel uses a regular business visa (~$216, 5–10 business days)." },
  { question: "What is an invitation letter for an India business visa?", answer: "A letter from the Indian company or host stating who you are, the purpose, duration, and relationship. It should match your application exactly." },
  { question: "What documents does an India business visa need?", answer: "A valid passport, the application, an invitation letter from the Indian host, a letter from your U.S. employer, a business card, and company proof — plus a ~$12 photo, ~$19 VFS fee, and ~$25 courier for regular visas." },
  { question: "How much is the India business visa fee?", answer: "The e-Business Visa is about $95 all-in. A regular 10-year business visa is about $216 ($160 government + ~$19 VFS + ~$12 photo + ~$25 courier)." },
  { question: "How long does the India business visa take?", answer: "The e-Business Visa takes about 3–5 business days; a regular business visa about 5–10 business days. Apply early for fixed-date conferences." },
  { question: "Can I work in India on a business visa?", answer: "No. A business visa covers meetings and negotiations, not employment. Working for an Indian organization needs an Employment Visa (~$220 all-in)." },
  { question: "Can I attend a conference in India on an eBusiness visa?", answer: "Yes — conferences and trade shows are typical business-visa purposes. The e-Business Visa is ~$95 all-in and takes 3–5 business days." },
  { question: "Do I need company proof for an India business visa?", answer: "Usually yes — a business card and evidence of your company or the Indian host's business. Provide what's requested to avoid re-submission and extra courier cost." },
  { question: "What passport validity is required for a business visa?", answer: "At least 6 months beyond travel plus blank pages. Renew first if you're close." },
  { question: "What are common business visa mistakes?", answer: "Missing or mismatched invitation letters, the wrong category, weak company documentation, and applying with too little buffer before a fixed event." },
];

export const entryFaqs: FaqItem[] = [
  { question: "Who may need an Entry Visa for India?", answer: "People of Indian origin, non-Indian spouses of Indian citizens/OCI holders, and minor children — cases that don't fit the eVisa box or where OCI isn't held. It's about $176 all-in and 2–3 weeks." },
  { question: "What is the difference between an Entry Visa and a tourist visa?", answer: "A tourist visa (~$54 eVisa / ~$216 regular) is for sightseeing. An Entry Visa (~$176, 2–3 weeks) suits family-based travel and living with relatives in India." },
  { question: "Is an Entry Visa or OCI better?", answer: "OCI (~$334, 8–12 weeks) is a lifelong facility and more convenient for frequent travel. An Entry Visa (~$176, 2–3 weeks) is faster and cheaper for a specific trip or when OCI isn't available yet." },
  { question: "Can a non-Indian spouse get an Entry Visa?", answer: "Yes — a non-Indian spouse of an Indian citizen or OCI holder usually uses an Entry Visa (~$176 all-in), providing the marriage certificate and the spouse's Indian/OCI documents. Some spouses also qualify for OCI." },
  { question: "How do U.S.-born children of Indian-origin parents travel to India?", answer: "Usually on their own Entry Visa (~$176) or OCI (~$334), with the child's birth certificate and parents' documents. Apply early — minor cases take longer." },
  { question: "What documents are needed for an India Entry Visa?", answer: "A valid passport, proof of Indian origin or the family relationship, marriage/birth certificates where relevant, and old Indian passport / surrender documents for former citizens — plus a ~$12 photo, ~$19 VFS fee, and ~$25 courier." },
  { question: "How long does an India Entry Visa take?", answer: "About 2–3 weeks, since origin and family documents need extra review. Keep documentation complete and consistent to avoid re-submission." },
  { question: "Do Indian citizens need a visa to enter India?", answer: "No. Indian citizens do not need an India visa to enter India. This guide is for U.S.-based travelers applying for a visa to India — not for Indian citizens seeking a U.S. visa." },
  { question: "How much does an India Entry Visa cost?", answer: "About $176 all-in: a ~$120 government fee + ~$19 VFS/ICWF + ~$12 photo + ~$25 courier." },
  { question: "What are common Entry Visa mistakes?", answer: "Incomplete proof of origin or relationship, name mismatches after marriage, missing surrender/renunciation documents for former Indian citizens, and underestimating the 2–3 week processing time." },
];

export const feesFaqs: FaqItem[] = [
  { question: "How much does an India visa cost from USA?", answer: "All-in estimates: e-Tourist ~$54, e-Business/e-Medical ~$95, regular tourist/business ~$216, Entry Visa ~$176, and OCI ~$334. Each total includes government fee, service fee, photo, and courier where applicable." },
  { question: "What is the India tourist visa fee?", answer: "The e-Tourist Visa is about $54 all-in (~$40 government + ~$2 charge + ~$12 photo). A regular 10-year tourist visa is about $216 ($160 government + ~$19 VFS + ~$12 photo + ~$25 courier)." },
  { question: "Is there a VFS service fee on top of the visa fee?", answer: "Yes — regular, Entry, student, employment visas and OCI carry a VFS/ICWF service fee of about $19. eVisas are applied online and instead have a small ~$2–$3 payment charge." },
  { question: "How much is the photo and shipping cost?", answer: "A compliant passport-style photo is about $12 (or free if you print at home to spec). For regular visas via VFS, prepaid courier both ways is about $25." },
  { question: "Why might my India visa cost be a bit different?", answer: "Totals shift with the validity you pick, the visa category, and options like SMS updates or premium lounge. The estimates here cover the standard government fee, service fee, photo, and courier." },
  { question: "Are India eVisa fees the same for every type?", answer: "No. The e-Tourist Visa is about $40 government fee (1 year), while e-Business and e-Medical are about $80 — so all-in they're roughly $54 vs $95." },
  { question: "What optional costs should I budget for?", answer: "Beyond the base total, optional add-ons include SMS updates (~$3), premium lounge, and document translations. The photo (~$12) and courier (~$25) are already in the regular-visa total." },
  { question: "Do children pay the same India visa fee?", answer: "Broadly yes — a minor's e-Tourist Visa is ~$54 and an Entry Visa ~$176, similar to adults. Plan the same photo (~$12) and courier (~$25) for regular applications." },
  { question: "Are India visa fees refundable?", answer: "No — government and service fees are generally non-refundable even if refused. That's why the ~$54–$334 you pay should go with a complete, correct application." },
  { question: "How do I pay the India visa fee?", answer: "eVisa fees (~$54–$95) are paid online by card. Regular visa and OCI fees (~$176–$334) are paid through VFS by its accepted methods." },
];

export const processingFaqs: FaqItem[] = [
  { question: "How long does an India visa take from USA?", answer: "The eVisa takes about 3–5 business days, a regular tourist/business visa about 5–10 business days, an Entry Visa about 2–3 weeks, and OCI about 8–12 weeks. These are planning estimates, not guarantees." },
  { question: "How long does the India eVisa take to process?", answer: "India eVisa processing is often estimated around 3–5 business days, but it can take longer if the application needs manual review or documents are unclear. Apply at least a week before travel when possible." },
  { question: "How long does a regular India visa take through VFS?", answer: "About 5–10 business days once VFS intake, appointment availability, consular review, and return courier are counted. Plan roughly two weeks to be safe, and longer around holidays." },
  { question: "How long does an India Entry Visa take?", answer: "About 2–3 weeks, since Indian-origin and family documents need extra review. Apply early and keep your documentation complete and consistent." },
  { question: "Does VFS add to the processing time?", answer: "Yes. For regular and paper visas, VFS intake, appointment availability, mailing to the consulate, and return courier all add days on top of the raw consular review time." },
  { question: "Does courier shipping count in India visa processing time?", answer: "Yes. FedEx/UPS or other courier time to and from VFS is counted on top of consular processing. A package that is delayed, returned for correction, or held for missing documents can add several business days or more." },
  { question: "Why do India visa applications get delayed?", answer: "Incomplete or inconsistent documents, name mismatches, passport-validity issues, old-Indian-passport/surrender questions, minor-child cases, consulate workload, and holidays." },
  { question: "How early should I apply before traveling to India?", answer: "Allow about 1 week for a simple eVisa, 2–3 weeks for a regular visa, 3–4 weeks for an Entry Visa or minor-child case, and 8–12 weeks or more for OCI. Don't start in the final week before travel." },
  { question: "Can I expedite an urgent India visa?", answer: "Genuine emergencies may be reviewed case by case by the relevant Indian Consulate or VFS process, but approval and timing are not guaranteed. Contact the consulate or VFS directly and keep proof of emergency ready." },
  { question: "How do I check my India visa status?", answer: "Use the eVisa portal status check for eVisas, or VFS tracking for regular visas and OCI. Follow up if you're past about 5 business days (eVisa) or 10 business days (regular)." },
  { question: "Is OCI faster than an India visa?", answer: "No. OCI takes about 8–12 weeks because of its two-stage clearance, far longer than a visa. If you need to travel soon, use a visa — an eVisa is often 3–5 business days — and pursue OCI separately." },
];

export const ociFaqs: FaqItem[] = [
  { question: "Is OCI a visa?", answer: "No. OCI (Overseas Citizen of India) is a lifelong multiple-entry facility for eligible people of Indian origin — not a visa and not citizenship. It costs about $334 all-in and takes 8–12 weeks." },
  { question: "Should I get OCI or an India visa?", answer: "For frequent travel, OCI (~$334, 8–12 weeks) is more convenient long-term. For a one-off or urgent trip, a visa is faster and cheaper — the e-Tourist Visa is ~$54 and 3–5 business days." },
  { question: "What is the difference between OCI and an eVisa?", answer: "An eVisa (~$54–$95, 3–5 days) is a short-term permit; OCI (~$334, 8–12 weeks) is a lifelong facility. OCI wins for repeat travel; the eVisa wins for a single short trip." },
  { question: "What is the difference between OCI and an Entry Visa?", answer: "An Entry Visa (~$176, 2–3 weeks) is issued for a set period and purpose; OCI (~$334, 8–12 weeks) is permanent. Spouses and children often use an Entry Visa first, then OCI later." },
  { question: "Is OCI better for a non-Indian spouse?", answer: "It depends. OCI (~$334) suits frequent travel long-term; an Entry Visa (~$176, 2–3 weeks) is faster and cheaper for a single upcoming trip." },
  { question: "Is OCI better for a U.S.-born child?", answer: "For regular visits, OCI (~$334) is convenient long-term. For a single trip, an Entry Visa (~$176) is faster. Apply early either way." },
  { question: "How long does OCI take versus a visa?", answer: "OCI takes about 8–12 weeks versus 3–5 business days for an eVisa. If travel is soon, use a visa and get OCI later." },
  { question: "How much does OCI cost compared to a visa?", answer: "OCI is about $334 all-in ($275 government + ~$22 VFS + ~$12 photo + ~$25 courier) as a one-time facility. A visa is per-trip: ~$54 (eVisa) to ~$216 (regular)." },
  { question: "Does OCI make me an Indian citizen?", answer: "No. OCI is not dual citizenship and doesn't grant voting rights, certain offices, or the right to buy certain agricultural property. It's a lifelong travel and residence facility." },
  { question: "Can I use OCI for urgent travel if it's not approved yet?", answer: "No — OCI takes 8–12 weeks and isn't an urgent-travel solution before it's issued. If you must travel soon, apply for a visa (eVisa ~$54, 3–5 days)." },
];

/* ─────────────── Cross-page related NRI links ─────────── */

export const indiaVisaRelatedLinks: { href: string; label: string; desc: string }[] = [
  { href: "/oci", label: "OCI Card (Resource Center)", desc: "Eligibility, documents, timeline, and cost for the OCI card — ~$334 all-in, often better than a visa for Indian-origin travelers" },
  { href: "/indian-passport-renewal-usa", label: "Indian Passport Renewal in USA", desc: "Renew your Indian passport before you apply for a visa or OCI card — expiry and name mismatches are the top delays" },
  { href: "/return-to-india", label: "Return to India Planning", desc: "Moving-back checklist for NRIs and families" },
  { href: "/send-money-to-india", label: "Send Money to India", desc: "Compare transfer options for your trip or family" },
  { href: "/immigration", label: "Immigration Hub", desc: "All U.S. immigration and India-USA travel guides" },
];
