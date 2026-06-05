import Link from "next/link";
import Container from "./Container";
import { site } from "@/lib/site";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Guides",
    links: [
      { label: "New to USA", href: "/topics/finance" },
      { label: "Banking & Credit", href: "/topics/credit" },
      { label: "Renting vs Buying", href: "/topics/housing" },
      { label: "Cars & Insurance", href: "/topics/cars" },
      { label: "All Guides", href: "/topics" },
    ],
  },
  {
    title: "Finance",
    links: [
      { label: "Taxes", href: "/topics/taxes" },
      { label: "401k & Roth IRA", href: "/topics/retirement" },
      { label: "Investing", href: "/topics/investing" },
      { label: "India-USA Money", href: "/topics/money-transfer" },
      { label: "Property", href: "/topics/property" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discussions", href: "/topics/community" },
      { label: "Immigrant Stories", href: "/topics/stories" },
      { label: "Ask a Question", href: "/topics/community" },
      { label: "Join the Community", href: "/topics/community" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About", href: "/about" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Contact", href: `mailto:${site.email}` },
      { label: "All Topics", href: "/topics" },
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
            financial, legal, tax, or immigration advice. Please consult a
            qualified professional for your situation.
          </p>
          <p className="mt-3 text-xs text-ink-400">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
