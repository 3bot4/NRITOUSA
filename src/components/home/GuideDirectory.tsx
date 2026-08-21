import Link from "next/link";
import Container from "@/components/Container";

/**
 * The homepage's by-topic guide index — a dense, crawlable directory of the
 * site's real guides, tools and calculators grouped the way people actually
 * search (H-1B, the green card stages, the visa bulletin, USCIS, India visa &
 * OCI, tax & FBAR, money, family).
 *
 * This is deliberately a long list of exact-match titles rather than more
 * cards: it is the homepage's main internal-linking surface into the clusters,
 * and every entry points at an existing route. When a cluster gains a page,
 * add it to the matching group here.
 */
type Group = {
  title: string;
  href: string;
  links: { label: string; href: string }[];
};

const groups: Group[] = [
  {
    title: "H-1B visa, lottery & sponsorship",
    href: "/h1b",
    links: [
      { label: "H-1B Visa Guide for Indians", href: "/h1b" },
      { label: "H-1B Lottery Results 2026 / 2027", href: "/h1b-lottery-results" },
      { label: "H-1B Lottery Chances & Odds", href: "/h1b-lottery-chances" },
      { label: "Not Selected in the H-1B Lottery?", href: "/h1b-lottery-not-selected-options" },
      { label: "Selected — What Happens Next", href: "/h1b-lottery-selected-next-steps" },
      { label: "H-1B Second Lottery Round", href: "/h1b-second-lottery" },
      { label: "H-1B Visa Stamping After Selection", href: "/h1b-visa-stamping-after-selection" },
      { label: "H-1B Layoff & the 60-Day Grace Period", href: "/h1b-layoff" },
      { label: "H-1B Prevailing Wage Explained", href: "/h1b-prevailing-wage" },
      { label: "H-1B Sponsor Finder by Role & State", href: "/tools/h1b-sponsor-finder" },
      { label: "H-1B Salaries Database", href: "/tools/h1b-salaries" },
      { label: "H-1B Lottery Chance Calculator", href: "/h1b-lottery-chance-calculator" },
    ],
  },
  {
    title: "Green card: PERM, I-140, I-485 & EAD",
    href: "/green-card",
    links: [
      { label: "Green Card Process for Indians", href: "/green-card" },
      { label: "PERM Timeline & Labor Certification", href: "/perm-timeline" },
      { label: "PERM Processing Time Calculator", href: "/perm-processing-time-calculator" },
      { label: "PWD (Prevailing Wage) Processing Time", href: "/pwd-processing-time" },
      { label: "DOL Processing Times", href: "/dol-processing-times" },
      { label: "DOL Wage Levels I–IV Explained", href: "/dol-wage-levels-explained" },
      { label: "I-140 Processing Time", href: "/i140-processing-time" },
      { label: "I-140 Premium Processing", href: "/i140-premium-processing" },
      { label: "I-485 Timeline & Adjustment of Status", href: "/i485-timeline" },
      { label: "I-485 Documents Checklist", href: "/i485-documents-checklist" },
      { label: "EAD Processing Time & Renewal Gap", href: "/ead-processing-time" },
      { label: "Advance Parole Processing Time", href: "/advance-parole-processing-time" },
    ],
  },
  {
    title: "Visa bulletin & priority dates",
    href: "/visa-bulletin",
    links: [
      { label: "Visa Bulletin for India, Explained", href: "/visa-bulletin" },
      { label: "EB-1 India Priority Date", href: "/visa-bulletin/eb1-india" },
      { label: "EB-2 India Priority Date", href: "/visa-bulletin/eb2-india" },
      { label: "EB-3 India Priority Date", href: "/visa-bulletin/eb3-india" },
      { label: "What Is a Priority Date?", href: "/visa-bulletin/priority-date" },
      { label: "Final Action Date vs Date of Filing", href: "/visa-bulletin/final-action-date-vs-date-of-filing" },
      { label: "Retrogression, Explained", href: "/visa-bulletin/retrogression" },
      { label: "EB-2 to EB-3 Downgrade", href: "/visa-bulletin/eb2-to-eb3-downgrade" },
      { label: "EB-2 vs EB-3 Priority Date for India", href: "/eb2-eb3-priority-date-india" },
      { label: "Priority Date Checker", href: "/tools/priority-date-checker" },
      { label: "Green Card Wait Time Tracker", href: "/tools/green-card-tracker" },
      { label: "Immigration Tracker Dashboard", href: "/immigration-tracker" },
    ],
  },
  {
    title: "USCIS case status, forms & notices",
    href: "/uscis",
    links: [
      { label: "USCIS Hub for Indian Applicants", href: "/uscis" },
      { label: "USCIS Case Status Messages", href: "/uscis/case-status" },
      { label: "USCIS Receipt Number Decoder", href: "/tools/uscis-receipt-number-decoder" },
      { label: "What Your Case Status Means", href: "/tools/uscis-case-status-meaning" },
      { label: "USCIS Notice Decoder", href: "/tools/uscis-notice-decoder" },
      { label: "Processing Delay Checker", href: "/tools/uscis-processing-delay-checker" },
      { label: "USCIS Form Finder", href: "/tools/uscis-form-finder" },
      { label: "USCIS Forms Explained", href: "/uscis/forms" },
      { label: "USCIS Processing Times", href: "/uscis/processing-times" },
      { label: "myUSCIS Account Setup", href: "/uscis/myuscis-account" },
      { label: "Request for Evidence (RFE)", href: "/uscis/request-for-evidence-rfe" },
      { label: "Immigration Attorney Cost", href: "/immigration-attorney-lawyer-cost" },
    ],
  },
  {
    title: "Green card renewal, NVC & consular",
    href: "/green-card-renewal",
    links: [
      { label: "Green Card Renewal (Form I-90)", href: "/green-card-renewal" },
      { label: "Green Card Renewal Fee", href: "/green-card-renewal-fee" },
      { label: "Green Card Renewal Processing Time", href: "/green-card-renewal-processing-time" },
      { label: "Renew Your Green Card Online", href: "/renew-green-card-online" },
      { label: "Replace a Lost or Stolen Green Card", href: "/replace-green-card" },
      { label: "Expired Green Card: Work & Travel", href: "/expired-green-card" },
      { label: "I-90 vs I-751 — Which Form?", href: "/i90-vs-i751" },
      { label: "NVC Case Status", href: "/nvc-case-status" },
      { label: "NVC Processing Time", href: "/nvc-processing-time" },
      { label: "NVC Document Checklist for India", href: "/nvc-document-checklist-india" },
      { label: "NVC Public Inquiry Form", href: "/nvc-public-inquiry" },
      { label: "What Is an NVC Case Number?", href: "/what-is-nvc-case-number" },
    ],
  },
  {
    title: "India visa, OCI & Indian passport",
    href: "/india-visa-from-usa",
    links: [
      { label: "India Visa from the USA", href: "/india-visa-from-usa" },
      { label: "India Tourist Visa from the USA", href: "/india-tourist-visa-from-usa" },
      { label: "India Business Visa from the USA", href: "/india-business-visa-from-usa" },
      { label: "India Entry Visa (X Visa)", href: "/entry-visa-india-from-usa" },
      { label: "India eVisa for US Citizens", href: "/india-evisa-for-us-citizens" },
      { label: "India Visa Fees in the USA", href: "/india-visa-fees-usa" },
      { label: "India Visa Processing Time", href: "/india-visa-processing-time-usa" },
      { label: "OCI Card: Fees, Documents & Timeline", href: "/oci" },
      { label: "OCI vs India Visa", href: "/oci-vs-india-visa" },
      { label: "OCI Eligibility Checker", href: "/tools/oci-eligibility-checker" },
      { label: "Indian Passport Renewal in the USA", href: "/indian-passport-renewal-usa" },
      { label: "Power of Attorney for India", href: "/power-of-attorney-for-india-from-usa" },
    ],
  },
  {
    title: "US tax, FBAR, FATCA & India ITR",
    href: "/india-tax-compliance",
    links: [
      { label: "India Tax & Compliance Hub", href: "/india-tax-compliance" },
      { label: "FBAR & FATCA Checker", href: "/tools/fbar-fatca-checker" },
      { label: "FBAR for NRE & NRO Accounts", href: "/articles/fbar-nre-nro-accounts" },
      { label: "DTAA: Double Taxation India–USA", href: "/articles/double-taxation-dtaa-india-usa" },
      { label: "PFIC Trap: Indian Mutual Funds", href: "/articles/pfic-indian-mutual-funds-trap" },
      { label: "Substantial Presence Test", href: "/articles/substantial-presence-test-explained" },
      { label: "Reporting Indian Income in the USA", href: "/articles/indian-income-us-tax-return" },
      { label: "Catch Up on Missed FBARs", href: "/articles/catch-up-missed-fbar-streamlined" },
      { label: "NRI Tax Filing Roadmap", href: "/tools/nri-tax-filing-roadmap" },
      { label: "Form 15CA / 15CB Checklist", href: "/tools/form-15ca-15cb-checklist" },
      { label: "Form 10F Generator", href: "/tools/form-10f-generator" },
      { label: "NRI Tax Forms & Limits", href: "/india-tax-compliance/nri-tax-forms-limits" },
    ],
  },
  {
    title: "Money, property & return to India",
    href: "/long-term-nri-wealth",
    links: [
      { label: "Long-Term NRI Wealth Hub", href: "/long-term-nri-wealth" },
      { label: "Free NRI Wealth Checkup", href: "/nri-wealth-checkup" },
      { label: "Should NRIs Keep Investments in India?", href: "/india-investments/should-nris-keep-investments-in-india" },
      { label: "India FD vs US Investments", href: "/articles/india-fd-vs-us-investments" },
      { label: "What Happens to Your 401(k)", href: "/articles/what-happens-to-401k-leaving-usa" },
      { label: "NRE vs NRO Accounts Explained", href: "/articles/nre-nro-accounts-explained" },
      { label: "Send Money to India", href: "/send-money-to-india" },
      { label: "Selling India Property: TDS & Repatriation", href: "/nri-selling-property-in-india-tds" },
      { label: "Inheriting Indian Assets", href: "/articles/inheriting-indian-assets-us-tax" },
      { label: "NRI Estate Planning", href: "/nri-estate-planning" },
      { label: "Return to India Checklist", href: "/return-to-india-checklist" },
      { label: "Gold Limit: USA to India", href: "/gold-limit-usa-to-india" },
    ],
  },
  {
    title: "Family, insurance, students & benefits",
    href: "/visitor-insurance",
    links: [
      { label: "Visitor Insurance for Parents", href: "/visitor-insurance/parents-visiting-usa" },
      { label: "How Much Visitor Coverage You Need", href: "/visitor-insurance/how-much-coverage" },
      { label: "Pre-Existing Conditions & Acute Onset", href: "/visitor-insurance/pre-existing-conditions-acute-onset" },
      { label: "Invitation Letter for Parents", href: "/invitation-letter-for-parents-to-visit-usa" },
      { label: "Term Life Insurance for Indian Families", href: "/term-life-insurance-for-indian-families-usa" },
      { label: "Trump Account $1,000 Eligibility", href: "/trump-account-1000-eligibility" },
      { label: "Trump Account vs 529 Plan", href: "/trump-account-vs-529-for-h1b-families" },
      { label: "H-4 EAD Navigator", href: "/tools/h4-ead-navigator" },
      { label: "Government Benefits for Immigrants", href: "/usa-government-benefits-immigrants" },
      { label: "CPT vs OPT for F-1 Students", href: "/education/cpt-vs-opt" },
      { label: "OPT Unemployment Day Calculator", href: "/education/opt-calculator" },
      { label: "Indian Population in the USA", href: "/indian-population-in-usa" },
    ],
  },
];

export default function GuideDirectory() {
  return (
    <section
      aria-labelledby="guide-directory-h"
      className="border-y border-ink-900/10 bg-white py-14 sm:py-16"
    >
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-brand-600">
              Every guide, by topic
            </span>
            <h2
              id="guide-directory-h"
              className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
            >
              The full library, from H-1B to return to India
            </h2>
            <p className="mt-1.5 max-w-2xl text-ink-500">
              Immigration guides, USCIS explainers, visa bulletin analysis, India
              visa and OCI paperwork, FBAR and FATCA compliance, and the money
              decisions in between — every guide on the site, grouped the way
              people search for it.
            </p>
          </div>
          <Link
            href="/topics"
            className="shrink-0 border-b border-transparent pb-0.5 text-sm font-semibold text-brand-600 hover:border-brand-600"
          >
            Browse all topics <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="border-b border-ink-900/10 pb-2 text-sm font-bold tracking-tight text-ink-900">
                <Link href={group.href} className="hover:text-brand-600">
                  {group.title}
                </Link>
              </h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13.5px] leading-snug text-ink-500 hover:text-brand-600 hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
