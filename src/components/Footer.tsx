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
      { label: "India-USA Money", href: "/topics/money-transfer" },
      { label: "Long-Term NRI Wealth", href: "/long-term-nri-wealth" },
    ],
  },
  {
    title: "Tools & Calculators",
    links: [
      { label: "All Tools", href: "/tools" },
      { label: "H-4 EAD Navigator", href: "/tools/h4-ead-navigator" },
      { label: "Citizenship Checklist", href: "/tools/citizenship-checklist" },
      { label: "Green Card Tracker", href: "/tools/green-card-tracker" },
      { label: "H-1B Salaries", href: "/tools/h1b-salaries" },
      { label: "Visa-Free Travel", href: "/tools/visa-free-countries" },
      { label: "Processing Times", href: "/tools/processing-times" },
      { label: "Flight Price Guide", href: "/tools/flight-price-guide" },
      { label: "FBAR / FATCA Checker", href: "/tools/fbar-fatca-checker" },
      { label: "Calculators", href: "/calculators" },
      { label: "IUL vs 401(k) Calculator", href: "/articles/iul-vs-401k-honest-comparison" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-900/10 bg-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 text-sm font-extrabold text-white">
                N
              </span>
              <span className="text-lg tracking-tight text-ink-900">
                NRI <span className="font-semibold text-ink-400">to</span>{" "}
                <span className="text-brand-600">USA</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {site.tagline}. Practical, premium guides for NRIs and new
              immigrants in America.
            </p>
            <div className="mt-5 flex gap-4 text-sm">
              <a href={site.social.twitter} className="text-ink-400 hover:text-brand-600">
                Twitter
              </a>
              <a href={site.social.instagram} className="text-ink-400 hover:text-brand-600">
                Instagram
              </a>
              <a href={site.social.youtube} className="text-ink-400 hover:text-brand-600">
                YouTube
              </a>
            </div>
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
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice.{" "}
            {site.name} is owned by {site.owner}. Please consult qualified
            professionals for your situation.
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
