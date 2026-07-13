import Link from "next/link";
import Container from "./Container";
import { site } from "@/lib/site";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Guides",
    links: [
      { label: "New to USA", href: "/topics/new-to-usa" },
      { label: "Banking & Credit", href: "/topics/credit" },
      { label: "Housing & Renting", href: "/topics/housing" },
      { label: "Cars & Driving", href: "/topics/cars" },
      { label: "All Guides", href: "/topics" },
    ],
  },
  {
    title: "Finance",
    links: [
      { label: "Taxes", href: "/topics/taxes" },
      { label: "401k & Roth IRA", href: "/topics/retirement" },
      { label: "Investing", href: "/topics/investing" },
      { label: "Insurance", href: "/topics/insurance" },
      { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
      { label: "Send Money to India", href: "/send-money-to-india" },
      { label: "India Tax & Compliance", href: "/india-tax-compliance" },
      {
        label: "DIY NRI Tax Filing Roadmap",
        href: "/tools/nri-tax-filing-roadmap",
      },
      {
        label: "NRI Tax Forms & Limits Center",
        href: "/india-tax-compliance/nri-tax-forms-limits",
      },
      {
        label: "Form 15CA / 15CB & Repatriation Paperwork",
        href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation",
      },
      { label: "Long-Term NRI Wealth", href: "/long-term-nri-wealth" },
      { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
    ],
  },
  {
    title: "Immigration",
    links: [
      { label: "USCIS Hub for Indians", href: "/uscis" },
      { label: "USCIS Case Status", href: "/uscis/case-status" },
      { label: "USCIS Processing Times", href: "/uscis/processing-times" },
      { label: "H1B Guide", href: "/h1b" },
      { label: "H-1B Layoff Checklist", href: "/h1b-layoff" },
      { label: "Green Card Process", href: "/green-card" },
      { label: "PERM Processing Time Calculator", href: "/perm-processing-time-calculator" },
      { label: "DOL Processing Times", href: "/dol-processing-times" },
      { label: "Prevailing Wage Calculator", href: "/prevailing-wage-calculator" },
      { label: "I-140 Processing Time", href: "/i140-processing-time" },
      { label: "EAD Processing Time", href: "/ead-processing-time" },
      { label: "I-485 Processing Time", href: "/i485-processing-time" },
      { label: "Visa Bulletin", href: "/visa-bulletin" },
      { label: "Indian Passport Renewal", href: "/indian-passport-renewal-usa" },
    ],
  },
  {
    title: "Tools & Calculators",
    links: [
      { label: "All Tools", href: "/tools" },
      { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
      { label: "DIY Tax Filing Roadmap", href: "/tools/nri-tax-filing-roadmap" },
      { label: "H-4 EAD Navigator", href: "/tools/h4-ead-navigator" },
      { label: "Citizenship Checklist", href: "/tools/citizenship-checklist" },
      { label: "Green Card Tracker", href: "/tools/green-card-tracker" },
      { label: "H-1B Salaries", href: "/tools/h1b-salaries" },
      { label: "Visa-Free Travel", href: "/tools/visa-free-countries" },
      { label: "Processing Times", href: "/tools/processing-times" },
      { label: "Flight Price Guide", href: "/tools/flight-price-guide" },
      { label: "FBAR / FATCA Checker", href: "/tools/fbar-fatca-checker" },
      { label: "Calculators", href: "/calculators" },
      { label: "IUL vs 401(k) article", href: "/articles/iul-vs-401k-honest-comparison" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "US Education",
    links: [
      { label: "Education Hub", href: "/education" },
      { label: "Grade Level Finder", href: "/education/grade-finder" },
      { label: "GPA Calculator", href: "/education/gpa-calculator" },
      { label: "SAT Score & Fit Tool", href: "/education/sat-guide" },
      { label: "College Cost Calculator", href: "/education/tuition-calculator" },
      { label: "College Rankings", href: "/education/college-rankings" },
      { label: "Education Guides", href: "/education/articles" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Deepak Middha — Founder", href: "/about-deepak" },
      { label: "NRI Success Stories", href: "/success-stories" },
      { label: "Write for Us", href: "/contribute" },
      { label: "Contributors", href: "/contributors" },
      { label: "Partnerships & Media", href: "/partnerships" },
      { label: "Contact", href: "/contact" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-900/10 bg-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link
              href="/"
              aria-label="NRI to USA — home"
              className="flex items-center gap-2 font-bold"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 bg-gradient-to-br from-brand-600 to-emerald-500 text-sm font-extrabold text-white"
              >
                N
              </span>
              <span aria-hidden className="text-lg tracking-tight text-ink-900">
                NRI <span className="font-semibold text-ink-400">to</span>{" "}
                <span className="text-brand-600">USA</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {site.tagline}. Practical, premium guides for NRIs and new
              immigrants in America.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink-900">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-ink-900/10 pt-6">
          <p className="text-xs leading-relaxed text-ink-400">
            {site.name} is operated by {site.owner}. Content and tools are for
            general educational purposes only and are not legal, tax,
            immigration, financial, or investment advice. Please consult
            qualified professionals for your situation. See our{" "}
            <Link href="/disclaimer" className="underline hover:text-brand-600">
              Disclaimer
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-ink-400">
            © {year} {site.owner}. All rights reserved. {site.name} is a
            content platform owned and operated by {site.owner}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
