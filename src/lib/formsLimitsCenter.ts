/**
 * Data model for the "NRI Tax Forms & Limits Center" reference hub at
 * /india-tax-compliance/nri-tax-forms-limits.
 *
 * This is a high-authority, table-first reference page: two big tables (US
 * forms, India forms) plus a "Choose your situation" router into the most
 * relevant NRItoUSA guide/tool. It is intentionally a single static page (a
 * sibling of the /india-tax-compliance/[slug] clusters, resolved ahead of the
 * dynamic route because Next.js prefers static segments).
 *
 * Educational-only. EVERY number, threshold, and deadline below is marked
 * "verify for current tax year" — US (IRS/FinCEN) and India (CBDT/Income Tax)
 * thresholds, due dates, and forms change every year. The `lastReviewed` and
 * per-row `source` fields are the content model's source/update-date trail.
 */

export const FORMS_LIMITS_PATH =
  "/india-tax-compliance/nri-tax-forms-limits";
export const FORMS_LIMITS_TITLE = "NRI Tax Forms & Limits Center";
export const FORMS_LIMITS_NAV_LABEL = "Forms & Limits Center";

/**
 * When the figures on this page were last reviewed against official sources.
 * Surfaced in the page header and JSON-LD `dateModified`. Bump on every review.
 */
export const FORMS_LIMITS_LAST_REVIEWED = "2026-06-22";

/** Standard caveat appended to every threshold/deadline on the page. */
export const VERIFY_NOTE = "Verify for current tax year";

/** A related NRItoUSA guide, tool, or calculator link. */
export interface RelatedLink {
  label: string;
  href: string;
}

/** One row in either forms table. */
export interface FormRow {
  /** Form number / document name. */
  form: string;
  /** What it is for. */
  purpose: string;
  /** The situation that commonly puts it in front of a US-based NRI. */
  trigger: string;
  /**
   * Key threshold / trigger. Numbers here are illustrative of the *kind* of
   * threshold and are always paired with VERIFY_NOTE in the UI — never treat
   * them as the current-year figure.
   */
  threshold: string;
  /** Deadline / timing, in plain language. */
  deadline: string;
  /** Documents typically needed. */
  documents: string;
  /** Related NRItoUSA guides/tools (internal links). */
  related: RelatedLink[];
  /** Official source for verification (opens in a new tab). */
  source?: RelatedLink;
}

/* ------------------------------------------------------------------ *
 * TABLE 1 — US tax / reporting forms for Indians in the USA
 * ------------------------------------------------------------------ */
export const US_FORMS: FormRow[] = [
  {
    form: "Form 1040",
    purpose: "The main US individual income tax return — reports your worldwide income once you are a US tax resident.",
    trigger: "You are a US citizen, green-card holder, or pass the Substantial Presence Test.",
    threshold: "Filing thresholds vary by filing status, age, and income type.",
    deadline: "Annual return, typically mid-April; an automatic extension is available on request.",
    documents: "W-2s, 1099s, India income summary, foreign tax paid, prior-year return.",
    related: [
      { label: "Indian income on a US return", href: "/articles/indian-income-us-tax-return" },
      { label: "Substantial Presence Test", href: "/articles/substantial-presence-test-explained" },
    ],
    source: { label: "IRS Form 1040", href: "https://www.irs.gov/forms-pubs/about-form-1040" },
  },
  {
    form: "Schedule B",
    purpose: "Reports interest and dividends, and asks whether you have foreign financial accounts.",
    trigger: "You have Indian bank/FD interest or dividends, or any foreign account at all.",
    threshold: "Generally required once interest or dividends exceed a low dollar threshold; the foreign-account question can apply regardless of amount.",
    deadline: "Filed with your Form 1040.",
    documents: "NRE/NRO/FCNR interest statements, dividend statements, broker 1099s.",
    related: [
      { label: "NRE vs NRO accounts", href: "/articles/nre-nro-accounts-explained" },
      { label: "Indian income on a US return", href: "/articles/indian-income-us-tax-return" },
    ],
    source: { label: "IRS Schedule B", href: "https://www.irs.gov/forms-pubs/about-schedule-b-form-1040" },
  },
  {
    form: "Form 1116 — Foreign Tax Credit",
    purpose: "Claims a credit for income tax already paid to India, so the same income is not taxed twice.",
    trigger: "TDS or Indian tax was deducted on your India income (NRO interest, rent, capital gains).",
    threshold: "Used when claiming a foreign tax credit above the limited amount allowed without the form.",
    deadline: "Filed with your Form 1040.",
    documents: "Proof of India tax paid (Form 26AS, TDS certificates, India ITR), income breakdown by category.",
    related: [
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "DTAA & double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
    ],
    source: { label: "IRS Form 1116", href: "https://www.irs.gov/forms-pubs/about-form-1116" },
  },
  {
    form: "Form 8938 — FATCA",
    purpose: "Reports specified foreign financial assets (accounts, certain securities, foreign funds) to the IRS.",
    trigger: "Your India accounts and investments together exceed the FATCA reporting threshold.",
    threshold: "Threshold depends on filing status and whether you live in the US or abroad — higher for those living abroad.",
    deadline: "Filed with your Form 1040.",
    documents: "Year-end and maximum balances for each foreign account/asset, account nicknames, institution names.",
    related: [
      { label: "FBAR / FATCA guide", href: "/articles/fbar-fatca-nri-guide" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
    ],
    source: { label: "IRS Form 8938", href: "https://www.irs.gov/forms-pubs/about-form-8938" },
  },
  {
    form: "FBAR / FinCEN Form 114",
    purpose: "Reports foreign financial accounts to FinCEN (separate from your tax return).",
    trigger: "Your foreign accounts together cross the aggregate reporting line at any point in the year.",
    threshold: "Aggregate maximum balance across all foreign accounts above a fixed low threshold (commonly cited at USD 10,000).",
    deadline: "Filed electronically with FinCEN, aligned to the tax-return date with an automatic extension.",
    documents: "Maximum balance during the year for each account, institution names, account types.",
    related: [
      { label: "FBAR / FATCA guide", href: "/articles/fbar-fatca-nri-guide" },
      { label: "Catch up on missed FBARs", href: "/articles/catch-up-missed-fbar-streamlined" },
    ],
    source: { label: "FinCEN FBAR", href: "https://bsaefiling.fincen.treas.gov/main.html" },
  },
  {
    form: "Form 8621 — PFIC",
    purpose: "Reports Passive Foreign Investment Companies — which commonly include Indian mutual funds and ETFs.",
    trigger: "You hold Indian mutual funds, ETFs, or ULIPs as a US tax resident.",
    threshold: "Can apply per fund; some de-minimis exceptions exist but the rules are complex.",
    deadline: "Filed with your Form 1040.",
    documents: "Fund statements, purchase/sale records, annual NAV/value, PFIC annual information statements where available.",
    related: [
      { label: "The PFIC trap & Indian mutual funds", href: "/articles/pfic-indian-mutual-funds-trap" },
      { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
    ],
    source: { label: "IRS Form 8621", href: "https://www.irs.gov/forms-pubs/about-form-8621" },
  },
  {
    form: "Form 3520 — foreign gifts / inheritance / trusts",
    purpose: "Reports large gifts or bequests from foreign persons, and transactions with foreign trusts.",
    trigger: "You received money from parents in India, or inherited Indian assets, above the reporting threshold.",
    threshold: "Reporting kicks in above a large annual aggregate from foreign individuals/estates; different thresholds apply to foreign entities and trusts.",
    deadline: "Generally due with your income tax return, including extensions.",
    documents: "Date and amount of each gift/inheritance, donor relationship, supporting transfer records.",
    related: [
      { label: "Gifting money from India & Form 3520", href: "/articles/gifting-money-india-tax-implications" },
      { label: "Inheriting Indian assets & US tax", href: "/articles/inheriting-indian-assets-us-tax" },
    ],
    source: { label: "IRS Form 3520", href: "https://www.irs.gov/forms-pubs/about-form-3520" },
  },
  {
    form: "Form 5471 — foreign corporation",
    purpose: "Reports US persons' interests in certain foreign corporations.",
    trigger: "You own or are an officer/director with a significant stake in an Indian Pvt Ltd company.",
    threshold: "Various ownership/control percentages and categories of filer trigger it.",
    deadline: "Filed with your Form 1040.",
    documents: "Company financials, shareholding, officer/director details, earnings & profits records.",
    related: [
      { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
      { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
    ],
    source: { label: "IRS Form 5471", href: "https://www.irs.gov/forms-pubs/about-form-5471" },
  },
  {
    form: "Form 8865 — foreign partnership",
    purpose: "Reports US persons' interests in certain foreign partnerships.",
    trigger: "You are a partner in an Indian LLP or partnership firm.",
    threshold: "Control or ownership percentages and contribution events determine the filing category.",
    deadline: "Filed with your Form 1040.",
    documents: "Partnership/LLP agreement, capital account, share of profits, contribution records.",
    related: [
      { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
      { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
    ],
    source: { label: "IRS Form 8865", href: "https://www.irs.gov/forms-pubs/about-form-8865" },
  },
  {
    form: "Form 8858 — foreign disregarded entity / branch",
    purpose: "Reports a foreign disregarded entity or a foreign branch operation.",
    trigger: "You run an Indian proprietorship/branch treated as disregarded for US tax.",
    threshold: "Applies based on ownership of a foreign disregarded entity or branch.",
    deadline: "Filed with your Form 1040.",
    documents: "Entity/branch financials, income statement, ownership and functional-currency details.",
    related: [
      { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
      { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
    ],
    source: { label: "IRS Form 8858", href: "https://www.irs.gov/forms-pubs/about-form-8858" },
  },
  {
    form: "Form 8833 — treaty position",
    purpose: "Discloses a tax-treaty position that reduces or modifies your US tax.",
    trigger: "You rely on the India–US DTAA in a way that requires disclosure.",
    threshold: "Required for certain treaty-based return positions above a disclosure threshold.",
    deadline: "Filed with your Form 1040.",
    documents: "Treaty article relied on, the income affected, computation of the position.",
    related: [
      { label: "DTAA & double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
    ],
    source: { label: "IRS Form 8833", href: "https://www.irs.gov/forms-pubs/about-form-8833" },
  },
  {
    form: "Form 8802 / IRS Form 6166 — Tax Residency Certificate",
    purpose: "Form 8802 requests US tax residency certification; the IRS issues Form 6166 as proof for treaty benefits abroad.",
    trigger: "India asks for proof you are a US tax resident (e.g. for DTAA relief or lower TDS).",
    threshold: "An application fee applies; processing takes time, so request well in advance.",
    deadline: "Apply ahead of when India needs the certificate; allow several weeks.",
    documents: "Completed Form 8802, fee payment, details of the tax year and treaty country.",
    related: [
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
      { label: "DTAA & double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
    ],
    source: { label: "IRS Form 8802", href: "https://www.irs.gov/forms-pubs/about-form-8802" },
  },
  {
    form: "W-8BEN",
    purpose: "Certifies foreign status to a US payer so the correct withholding (often treaty-reduced) is applied.",
    trigger: "A US financial institution or payer asks you to certify your status.",
    threshold: "No dollar threshold — provided to the payer on request, not filed with the IRS.",
    deadline: "Given to the payer; generally valid for a period before re-certification.",
    documents: "Your foreign tax ID, treaty claim details, identifying information.",
    related: [
      { label: "DTAA & double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
      { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
    ],
    source: { label: "IRS Form W-8BEN", href: "https://www.irs.gov/forms-pubs/about-form-w-8-ben" },
  },
  {
    form: "W-7 — ITIN application",
    purpose: "Applies for an Individual Taxpayer Identification Number for those ineligible for an SSN.",
    trigger: "A spouse or dependent needs a US tax ID to be claimed on a return.",
    threshold: "No dollar threshold — based on a filing or reporting need.",
    deadline: "Usually submitted with the tax return that creates the ITIN need.",
    documents: "Passport or other identity/foreign-status documents, the attached tax return.",
    related: [
      { label: "Indian income on a US return", href: "/articles/indian-income-us-tax-return" },
      { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
    ],
    source: { label: "IRS Form W-7", href: "https://www.irs.gov/forms-pubs/about-form-w-7" },
  },
];

/* ------------------------------------------------------------------ *
 * TABLE 2 — India tax / forms for NRIs in the USA
 * ------------------------------------------------------------------ */
export const INDIA_FORMS: FormRow[] = [
  {
    form: "ITR-2",
    purpose: "The Indian income tax return most NRIs use when there is no business or professional income.",
    trigger: "You have Indian salary, rent, capital gains, or interest — or want an NRO/property TDS refund.",
    threshold: "Filing can be mandatory once gross total income crosses the basic exemption limit; voluntary filing reclaims over-deducted TDS.",
    deadline: "Annual ITR due date for the assessment year, with belated/revised windows after.",
    documents: "PAN, Form 26AS, AIS/TIS, NRO/NRE statements, TDS certificates, capital-gains statements.",
    related: [
      { label: "ITR-2 for NRIs", href: "/india-tax-compliance/itr-2-for-nri" },
      { label: "NRI ITR filing from USA", href: "/india-tax-compliance/nri-itr-filing-usa" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "ITR-3",
    purpose: "The Indian return for individuals with business, professional, or partnership income.",
    trigger: "You have Indian business, freelance/professional, or partnership-firm income.",
    threshold: "Used instead of ITR-2 when any business/professional income exists; audit may apply above turnover limits.",
    deadline: "Annual ITR due date; a tax-audit case may have a different due date.",
    documents: "Everything for ITR-2 plus business P&L, balance sheet, and books where applicable.",
    related: [
      { label: "ITR-3 for NRIs", href: "/india-tax-compliance/itr-3-for-nri" },
      { label: "NRI ITR filing from USA", href: "/india-tax-compliance/nri-itr-filing-usa" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Form 26AS",
    purpose: "Your tax-credit statement — the TDS/TCS deducted against your PAN and taxes paid.",
    trigger: "Any India income with TDS deducted; needed to claim the full TDS credit/refund.",
    threshold: "No threshold — always reconcile before filing.",
    deadline: "Download before filing; updates through the year as TDS is reported.",
    documents: "Accessed via the Income Tax portal using your PAN login.",
    related: [
      { label: "Form 26AS, AIS & TIS for NRIs", href: "/india-tax-compliance/form-26as-ais-tis-nri" },
      { label: "NRI documents checklist", href: "/india-tax-compliance/nri-india-tax-documents-checklist" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "AIS / TIS",
    purpose: "The Annual Information Statement and its Taxpayer Information Summary — a wide view of reported transactions.",
    trigger: "Reconciling all reported India income (interest, dividends, securities, property) before filing.",
    threshold: "No threshold — review to avoid mismatch notices.",
    deadline: "Download before filing; submit feedback for any wrong entries.",
    documents: "Accessed via the Income Tax portal; compare against your own bank/broker records.",
    related: [
      { label: "Form 26AS, AIS & TIS for NRIs", href: "/india-tax-compliance/form-26as-ais-tis-nri" },
      { label: "NRI ITR filing from USA", href: "/india-tax-compliance/nri-itr-filing-usa" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Form 10F",
    purpose: "A self-declaration that supplies treaty details not present on your TRC, to claim DTAA benefits.",
    trigger: "Claiming lower DTAA TDS on India income and your TRC lacks certain particulars.",
    threshold: "No dollar threshold — filed electronically on the Income Tax portal.",
    deadline: "Before the income is paid/TDS is deducted; valid for the period stated.",
    documents: "TRC (Form 6166), PAN, status/address/period details, your foreign tax ID.",
    related: [
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
      { label: "DTAA & double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "TRC — Tax Residency Certificate",
    purpose: "Proof of your country of tax residence, required to claim DTAA benefits in India.",
    trigger: "Claiming treaty relief / lower TDS on India income as a US tax resident.",
    threshold: "No threshold — obtained from your residence-country authority (in the US, via Form 8802 → Form 6166).",
    deadline: "Obtain before claiming treaty benefits; covers a specified period.",
    documents: "US: file Form 8802 to receive IRS Form 6166.",
    related: [
      { label: "Form 10F generator", href: "/tools/form-10f-generator" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
    ],
    source: { label: "IRS Form 8802", href: "https://www.irs.gov/forms-pubs/about-form-8802" },
  },
  {
    form: "Form 15CA",
    purpose: "An online declaration about a foreign remittance and its taxability, filed before money leaves India.",
    trigger: "You are repatriating funds from India to the USA (e.g. NRO to your US account).",
    threshold: "Different parts apply by amount and taxability; a CA certificate (15CB) is needed above certain limits.",
    deadline: "Filed before the bank processes the remittance.",
    documents: "Remitter/remittee details, nature and amount of remittance, TDS/tax position, 15CB if required.",
    related: [
      { label: "Form 15CA / 15CB & repatriation", href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation" },
      { label: "15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Form 15CB",
    purpose: "A Chartered Accountant's certificate on the taxability of a foreign remittance.",
    trigger: "Your remittance is taxable and above the limit that requires a CA certificate.",
    threshold: "Required above a specified taxable-remittance limit; not needed for some non-taxable or low-value transfers.",
    deadline: "Obtained before Form 15CA Part C and before the bank remits.",
    documents: "Source-of-funds proof, tax/TDS records, sale or income documents, PAN.",
    related: [
      { label: "Form 15CA / 15CB & repatriation", href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation" },
      { label: "15CA / 15CB checklist", href: "/tools/form-15ca-15cb-checklist" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Form 13 — lower / nil TDS certificate",
    purpose: "An application for a certificate authorizing TDS at a lower or nil rate.",
    trigger: "TDS (e.g. on a property sale or rent) would otherwise be far higher than your actual tax.",
    threshold: "No fixed threshold — granted on the Assessing Officer's assessment of expected income.",
    deadline: "Apply well before the transaction so the certificate is in hand when TDS is deducted.",
    documents: "Expected income computation, cost/sale documents, PAN, prior returns.",
    related: [
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
      { label: "India property capital-gains calculator", href: "/calculators/india-property-capital-gains" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Form 67 — foreign tax credit",
    purpose: "Claims credit in India for taxes paid in another country (the India-side foreign tax credit).",
    trigger: "You paid US tax on income that India also taxes and want to avoid double taxation in India.",
    threshold: "No dollar threshold; must be filed within the prescribed window relative to your ITR.",
    deadline: "Filed on the portal on/before the relevant filing date for the ITR.",
    documents: "Proof of foreign tax paid, income statement, the relevant US return summary.",
    related: [
      { label: "DTAA & double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
      { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "PAN",
    purpose: "Permanent Account Number — your India tax ID, required to file and to transact.",
    trigger: "Any India tax filing, NRO account, property transaction, or investment.",
    threshold: "No threshold — mandatory to file an ITR and to avoid higher TDS.",
    deadline: "Obtain before you need to file or transact; one-time, then keep linked.",
    documents: "Identity and address proof; overseas address allowed for NRIs.",
    related: [
      { label: "NRI documents checklist", href: "/india-tax-compliance/nri-india-tax-documents-checklist" },
      { label: "NRI ITR filing from USA", href: "/india-tax-compliance/nri-itr-filing-usa" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Aadhaar–PAN link status",
    purpose: "Confirms whether your PAN is linked to Aadhaar, which affects whether the PAN stays operative.",
    trigger: "Linking rules can differ for NRIs; an inoperative PAN can mean higher TDS and filing issues.",
    threshold: "No dollar threshold — confirm what currently applies to NRIs.",
    deadline: "Check status ahead of filing; linking deadlines change.",
    documents: "PAN and Aadhaar details (where Aadhaar applies); verified on the portal.",
    related: [
      { label: "NRI documents checklist", href: "/india-tax-compliance/nri-india-tax-documents-checklist" },
      { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "NRO / NRE / FCNR statements",
    purpose: "Your bank account/deposit statements — the basis for India interest income and TDS claims.",
    trigger: "Reporting interest, claiming NRO TDS refunds, and documenting source of funds for repatriation.",
    threshold: "No threshold — pull full-year statements so no TDS credit is missed.",
    deadline: "Needed before filing and before any 15CA/15CB repatriation.",
    documents: "Full financial-year statements for each NRO, NRE, and FCNR account/deposit.",
    related: [
      { label: "NRE vs NRO accounts", href: "/articles/nre-nro-accounts-explained" },
      { label: "NRI documents checklist", href: "/india-tax-compliance/nri-india-tax-documents-checklist" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "TDS certificates (Form 16 / 16A / 16B)",
    purpose: "Proof of tax deducted at source — by employers (16), on other income (16A), and on property sales (16B).",
    trigger: "TDS was deducted on salary, NRO interest, rent, professional fees, or a property sale.",
    threshold: "No threshold — collect each certificate to claim the matching credit.",
    deadline: "Issued after each quarter/transaction; gather before filing.",
    documents: "Form 16 (salary), 16A (other income), 16B (property buyer-issued).",
    related: [
      { label: "NRI TDS refund checklist", href: "/tools/nri-tds-refund-checklist" },
      { label: "Form 26AS, AIS & TIS for NRIs", href: "/india-tax-compliance/form-26as-ais-tis-nri" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Capital-gains statement",
    purpose: "The broker/AMC statement of realized short- and long-term gains for the year.",
    trigger: "You sold Indian shares, mutual funds, or other securities.",
    threshold: "No threshold — needed to compute gains and any indexation correctly.",
    deadline: "Pull for the full financial year before filing.",
    documents: "Broker and mutual-fund capital-gains reports, purchase/sale records.",
    related: [
      { label: "Selling Indian shares as a US resident", href: "/articles/selling-indian-shares-us-resident-tax" },
      { label: "The PFIC trap & Indian mutual funds", href: "/articles/pfic-indian-mutual-funds-trap" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
  {
    form: "Property-sale documents",
    purpose: "The deed and cost records that establish capital gains and the TDS to be reconciled.",
    trigger: "You sold (or are selling) property in India.",
    threshold: "Buyer-side TDS on an NRI sale is often far above the real tax — a classic refund situation.",
    deadline: "Keep before filing and before repatriating proceeds (15CA/15CB).",
    documents: "Sale deed, original purchase deed, improvement-cost proofs, Form 16B, bank records.",
    related: [
      { label: "India property capital-gains calculator", href: "/calculators/india-property-capital-gains" },
      { label: "Repatriating property-sale proceeds", href: "/articles/repatriate-india-property-sale-usa" },
    ],
    source: { label: "Income Tax portal", href: "https://www.incometax.gov.in" },
  },
];

/* ------------------------------------------------------------------ *
 * "Choose your situation" — a quick router into the right resource.
 * ------------------------------------------------------------------ */
export interface SituationCard {
  icon: string;
  label: string;
  /** One-line orientation. */
  blurb: string;
  href: string;
  /** Tailwind gradient for the icon tile. */
  accent: string;
}

export const SITUATIONS: SituationCard[] = [
  {
    icon: "🧭",
    label: "I want a step-by-step filing roadmap",
    blurb:
      "A guided sequence across U.S. return, FBAR, FATCA, India ITR, TDS refund, Form 10F, and 15CA/15CB.",
    href: "/tools/nri-tax-filing-roadmap",
    accent: "from-brand-600 to-indigo-600",
  },
  {
    icon: "🏦",
    label: "I have Indian bank accounts",
    blurb: "FBAR, FATCA / Form 8938 and Schedule B reporting on NRE/NRO/FCNR.",
    href: "/tools/fbar-fatca-checker",
    accent: "from-sky-500 to-blue-600",
  },
  {
    icon: "🏠",
    label: "I sold property in India",
    blurb: "Capital gains, buyer-side TDS, and the refund + repatriation trail.",
    href: "/calculators/india-property-capital-gains",
    accent: "from-amber-500 to-orange-600",
  },
  {
    icon: "🎁",
    label: "I received money from parents",
    blurb: "Form 3520 reporting of large foreign gifts from relatives.",
    href: "/articles/gifting-money-india-tax-implications",
    accent: "from-rose-500 to-pink-600",
  },
  {
    icon: "🏛️",
    label: "I inherited Indian property",
    blurb: "Form 3520, cost basis, and the US tax on inherited Indian assets.",
    href: "/articles/inheriting-indian-assets-us-tax",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: "📈",
    label: "I hold Indian mutual funds",
    blurb: "The PFIC trap and Form 8621 on Indian funds, ETFs, and ULIPs.",
    href: "/articles/pfic-indian-mutual-funds-trap",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    icon: "💸",
    label: "I want to move money from India to USA",
    blurb: "Form 15CA, Form 15CB, and the FEMA/bank repatriation paperwork.",
    href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation",
    accent: "from-indigo-500 to-blue-600",
  },
  {
    icon: "✈️",
    label: "I am returning to India",
    blurb: "RNOR residency timing and what India can tax after you move back.",
    href: "/calculators/rnor-tax-residency",
    accent: "from-cyan-500 to-sky-600",
  },
  {
    icon: "🏢",
    label: "I own an Indian company/LLP",
    blurb: "Form 5471, Form 8865, and Form 8858 on foreign entities.",
    href: "#us-forms",
    accent: "from-slate-500 to-slate-700",
  },
  {
    icon: "⚖️",
    label: "I paid tax in both countries",
    blurb: "DTAA, Form 1116 (US) and Form 67 (India) to avoid double tax.",
    href: "/calculators/dtaa-foreign-tax-credit",
    accent: "from-teal-500 to-cyan-600",
  },
  {
    icon: "🧾",
    label: "I need to file Indian ITR from USA",
    blurb: "ITR-2 vs ITR-3, documents, TDS refunds, and the filing timeline.",
    href: "/india-tax-compliance/nri-itr-filing-usa",
    accent: "from-rose-500 to-pink-600",
  },
];

/** Curated internal links shown in the "Related NRItoUSA tools & guides" strip. */
export const RELATED_RESOURCES: RelatedLink[] = [
  { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
  { label: "FBAR / FATCA guide", href: "/articles/fbar-fatca-nri-guide" },
  { label: "PFIC & Indian mutual funds", href: "/articles/pfic-indian-mutual-funds-trap" },
  { label: "Form 3520 on foreign gifts", href: "/articles/gifting-money-india-tax-implications" },
  { label: "DTAA & foreign tax credit calculator", href: "/calculators/dtaa-foreign-tax-credit" },
  { label: "Form 10F generator", href: "/tools/form-10f-generator" },
  { label: "India property capital-gains calculator", href: "/calculators/india-property-capital-gains" },
  { label: "RNOR tax-residency calculator", href: "/calculators/rnor-tax-residency" },
  { label: "Remittance TCS cost calculator", href: "/calculators/remittance-tcs-cost" },
  { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
  { label: "India Tax & Compliance hub", href: "/india-tax-compliance" },
];
