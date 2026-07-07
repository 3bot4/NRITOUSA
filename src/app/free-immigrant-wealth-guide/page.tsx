import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import { absoluteUrl, jsonLdGraph, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/free-immigrant-wealth-guide";

const SEO_TITLE = "Free Immigrant Wealth Guide for the USA";
const META_DESCRIPTION =
  "A free PDF by Deepak Middha on why immigrants struggle to build wealth in the U.S., the money traps to avoid, and how to approach investing and retirement.";
const OG_TITLE = "Free Immigrant Wealth Guide";
const OG_DESCRIPTION =
  "A practical PDF guide for immigrants who want to build wealth in the U.S. without waiting years to start.";

export const metadata: Metadata = pageMetadata({
  title: SEO_TITLE,
  description: META_DESCRIPTION,
  path: PATH,
  socialTitle: OG_TITLE,
  socialDescription: OG_DESCRIPTION,
});

const guideBullets = [
  "Why waiting too long to invest can quietly cost immigrants years of compounding",
  "How to think about stocks, ETFs, real estate, retirement accounts, and passive income",
  "The hidden cost of keeping too much money back home",
  "Why green card uncertainty should not freeze every financial decision",
  "How mindset, timing, and financial education shape long-term wealth",
  "A practical investment checklist for new immigrants",
];

const audienceCards = [
  "New immigrants starting their first financial life in the U.S.",
  "H-1B and green card applicants balancing uncertainty with long-term planning",
  "Indian families managing money between India and the USA",
  "Professionals who save well but have not started investing confidently",
];

const relatedLinks = [
  { href: "/tools", label: "Free tools & calculators" },
  { href: "/india-tax-compliance", label: "India tax & compliance hub" },
  {
    href: "/articles/moving-to-usa-from-india-checklist",
    label: "Moving to USA from India checklist",
  },
  { href: "/articles/fbar-nre-nro-accounts", label: "FBAR, NRE & NRO accounts" },
];

/** Navy/gold book-cover card matching the PDF cover (no separate image yet). */
function BookCover() {
  return (
    <div
      role="img"
      aria-label="Cover of the free PDF guide “Why Many Immigrants Struggle to Build Wealth” by Deepak Middha"
      className="relative mx-auto flex aspect-[3/4] w-full max-w-[20rem] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-[#101a3a] to-ink-800 p-7 text-white shadow-card-hover ring-1 ring-white/10"
    >
      {/* Gold spine accent */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent-400 to-accent-600" />
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="relative">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
          Free PDF Guide
        </span>
        <h2 className="mt-4 font-serif text-2xl font-bold leading-snug text-white">
          Why Many Immigrants Struggle to Build Wealth
        </h2>
        <div className="mt-4 h-px w-12 bg-accent-400/70" />
      </div>

      <div className="relative">
        <p className="text-sm font-semibold text-white">Deepak Middha</p>
        <p className="mt-1 text-xs leading-relaxed text-white/70">
          Chartered Accountant · 17-year hedge fund industry veteran · Series 65
        </p>
      </div>
    </div>
  );
}

export default function LeadMagnetPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: site.url },
      { name: OG_TITLE, url: absoluteUrl(PATH) },
    ]),
    {
      "@type": "Book",
      name: "Why Immigrants Failed to Build Wealth",
      alternateName: "Why Many Immigrants Struggle to Build Wealth",
      author: { "@type": "Person", name: "Deepak Middha" },
      inLanguage: "en-US",
      url: absoluteUrl(PATH),
      publisher: { "@id": `${site.url}/#organization` },
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-14 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-ink-400"
          >
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink-600">Free Immigrant Wealth Guide</span>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: copy + form */}
            <div>
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                Free PDF Guide for Immigrants
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                Why Many Immigrants Struggle to Build Wealth
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Most immigrants work hard, save carefully, and support family
                across borders — but still lose years waiting to invest, waiting
                for a green card, or keeping too much money idle.
              </p>
              <p className="mt-4 text-sm font-medium text-ink-500">
                A practical wealth guide by Deepak Middha, Chartered Accountant
                and 17-year hedge fund industry veteran.
              </p>

              <div className="mt-8">
                <h2 className="text-base font-bold text-ink-900">
                  Inside the free guide, you&apos;ll learn:
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {guideBullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-ink-700">
                      <span
                        aria-hidden
                        className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                      >
                        ✓
                      </span>
                      <span className="text-[0.95rem] leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: book cover + form card */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
                <BookCover />
                <div className="mt-7">
                  <h2 className="text-xl font-bold tracking-tight text-ink-900">
                    Download the free PDF
                  </h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Enter your details and we&apos;ll send you the guide.
                  </p>
                  <div className="mt-5">
                    <LeadMagnetForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 1 — Who this guide is for */}
      <section className="border-t border-ink-900/5 bg-white py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Who this guide is for
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {audienceCards.map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5 shadow-card"
              >
                <p className="text-[0.95rem] leading-relaxed text-ink-700">
                  {card}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 2 — Why this guide matters */}
      <section className="border-t border-ink-900/5 bg-slate-50/60 py-14 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Why this guide matters
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Many immigrants are disciplined savers, but saving alone is not a
              full wealth plan. This guide explains the mindset traps, timing
              mistakes, home-country money habits, and investing fears that can
              delay wealth-building for years.
            </p>
          </div>
        </Container>
      </section>

      {/* Section 3 — About the author */}
      <section className="border-t border-ink-900/5 bg-white py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[auto,1fr] lg:items-start lg:gap-10">
            <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-ink-900 to-ink-700 text-2xl font-bold text-white">
              DM
            </div>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                About the author
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Deepak Middha is a Chartered Accountant and 17-year hedge fund
                and alternative-investment industry veteran. As an immigrant, he
                rebuilt his financial life in the U.S. and writes about the
                practical money decisions immigrants face — investing, real
                estate, retirement accounts, cross-border money, and long-term
                wealth-building.
              </p>
              <p className="mt-4">
                <Link
                  href="/about-deepak"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  More about Deepak Middha →
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Related links */}
      <section className="border-t border-ink-900/5 bg-slate-50/60 py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Keep exploring
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="font-semibold text-ink-900 group-hover:text-brand-700">
                  {link.label}
                </span>
                <span aria-hidden className="text-brand-600">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-ink-900/5 bg-white py-10">
        <Container>
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-ink-400">
            This guide is educational only and does not provide personalized
            financial, investment, tax, legal, or immigration advice.
          </p>
        </Container>
      </section>
    </>
  );
}
