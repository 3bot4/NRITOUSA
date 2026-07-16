import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { author, authorInitials } from "@/lib/author";
import { site } from "@/lib/site";
import { absoluteUrl, jsonLdGraph, pageMetadata } from "@/lib/seo";

const title = "Deepak Middha — Founder & Author of NRI to USA";
const description =
  "Deepak Middha is the founder of NRI to USA — a Chartered Accountant, Series 65 holder, immigrant finance educator, and author helping NRIs and immigrants understand U.S. taxes, money, compliance, and life in America.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: author.url,
  type: "profile",
});

/* ------------------------------------------------------------------ *
 * Page content (adapted to the site's educational, founder-led tone).
 * Only links to routes that already exist in the app are used below.
 * ------------------------------------------------------------------ */

/** Background & credentials — shared for transparency, not as advice. */
const credentials = [
  {
    icon: "🎓",
    title: "Chartered Accountant",
    body: "Formally trained in accounting, audit, and tax.",
  },
  {
    icon: "📜",
    title: "Series 65",
    body: "Passed the Series 65 Uniform Investment Adviser Law Examination.",
  },
  {
    icon: "🏦",
    title: "Fund administration",
    body: "Experience in accounting, taxes, and fund accounting across hedge fund and private equity administration in the United States.",
  },
  {
    icon: "🚀",
    title: "Founder of NRI to USA",
    body: "Built this platform to turn scattered immigrant-finance answers into simple guides and tools.",
  },
  {
    icon: "🏢",
    title: `Founder of ${site.owner}`,
    body: "The company that owns and operates NRI to USA.",
  },
  {
    icon: "✍️",
    title: "Two-time published author",
    body: "Author of immigrant wealth and options-income books.",
  },
  {
    icon: "📈",
    title: "Founder of OptionLeo",
    body: "Teaches options income as a systematic, numbers-driven discipline — not a lottery ticket.",
  },
];

/** Focus areas rendered as chips under the credentials grid. */
const focusAreas = [
  "Immigrant finance",
  "NRI tax compliance",
  "U.S. tax basics",
  "FBAR / FATCA awareness",
  "Retirement accounts",
  "Banking & credit",
  "Investing",
  "U.S. life planning",
];

/** Topics Deepak covers — each links to a real, existing route. */
const topics = [
  { label: "New to USA guides", href: "/topics/new-to-usa" },
  { label: "Banking & credit", href: "/topics/credit" },
  { label: "U.S. taxes", href: "/topics/taxes" },
  { label: "India tax & compliance", href: "/india-tax-compliance" },
  { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
  { label: "401(k), Roth IRA & retirement", href: "/topics/retirement" },
  { label: "Investing basics", href: "/topics/investing" },
  { label: "Send money to India", href: "/send-money-to-india" },
  { label: "H-1B & immigration guides", href: "/immigration" },
  { label: "Green card process", href: "/green-card" },
  { label: "Indian passport renewal", href: "/indian-passport-renewal-usa" },
  { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
];

/** Tools & guides Deepak built or contributed to — real internal routes. */
const toolsBuilt = [
  {
    label: "NRI Wealth & Tax Organizer",
    // The organizer became the wealth checkup; /tools/… 301s here.
    href: "/nri-wealth-checkup",
  },
  { label: "FBAR / FATCA Checker", href: "/tools/fbar-fatca-checker" },
  { label: "USCIS Hub", href: "/uscis" },
  { label: "Immigration Tracker", href: "/immigration-tracker" },
  { label: "H-4 EAD Navigator", href: "/tools/h4-ead-navigator" },
  { label: "Citizenship Checklist", href: "/tools/citizenship-checklist" },
  { label: "Green Card Tracker", href: "/tools/green-card-tracker" },
  { label: "H-1B Salaries", href: "/tools/h1b-salaries" },
  { label: "Visa-Free Travel", href: "/tools/visa-free-countries" },
  { label: "Processing Times", href: "/tools/processing-times" },
  {
    label: "IUL vs 401(k) article",
    href: "/articles/iul-vs-401k-honest-comparison",
  },
  {
    label: "Free Immigrant Wealth Guide",
    href: "/free-immigrant-wealth-guide",
  },
];

/* ------------------------------------------------------------------ *
 * Structured data — ProfilePage → Person (E-E-A-T author authority).
 * Organization and WebSite nodes are emitted globally in the root
 * layout, so the #organization / #website @id references resolve.
 * ------------------------------------------------------------------ */
const profileUrl = absoluteUrl(author.url);

const personJsonLd = {
  "@type": "Person",
  "@id": `${site.url}${author.url}#person`,
  name: author.name,
  jobTitle: "Founder and Author",
  url: profileUrl,
  description,
  worksFor: { "@id": `${site.url}/#organization` },
  affiliation: { "@type": "Organization", name: site.owner },
  knowsAbout: [
    "Immigrant finance",
    "NRI taxes",
    "U.S. taxes",
    "Accounting",
    "FBAR",
    "FATCA",
    "Retirement accounts",
    "Investing",
    "Banking",
    "Credit",
    "U.S. immigration basics",
    "India tax compliance",
  ],
  sameAs: [
    author.linkedin,
    "https://optionleo.com",
    ...author.books.map((b) => b.url),
  ],
  // The founder story is an editorial page ABOUT this person.
  subjectOf: {
    "@type": "Article",
    "@id": `${site.url}/success-stories/deepak-middha#article`,
    url: `${site.url}/success-stories/deepak-middha`,
  },
};

const profilePageJsonLd = {
  "@type": "ProfilePage",
  "@id": `${site.url}${author.url}#profilepage`,
  url: profileUrl,
  name: title,
  description,
  isPartOf: { "@id": `${site.url}/#website` },
  mainEntity: { "@id": personJsonLd["@id"] },
};

export default function AboutDeepakPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdGraph(profilePageJsonLd, personJsonLd)),
        }}
      />

      {/* A. Hero */}
      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-brand-50 text-2xl font-extrabold text-brand-700">
                {authorInitials}
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                  Founder &amp; Author
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                  {author.name}
                </h1>
                <p className="mt-1 text-lg font-semibold text-ink-700">
                  Founder of {site.name}
                </p>
                <p className="mt-1 text-sm font-medium text-ink-400">
                  Chartered Accountant, Series 65, immigrant finance educator
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                LinkedIn ↗
              </a>
              <Link
                href="/topics"
                className="rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Read the guides
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                About {site.name}
              </Link>
              <Link
                href="/free-immigrant-wealth-guide"
                className="rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Free Immigrant Wealth Guide
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* B. Biography */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Biography
            </h2>
            <div className="mt-6 space-y-4 leading-8 text-ink-700">
              <p>
                Deepak Middha is the founder of {site.name} and{" "}
                <strong>{site.owner}</strong>. He is a Chartered Accountant with
                deep experience in accounting, taxes, fund administration, and
                immigrant personal finance — including more than 17 years in the
                hedge fund and alternative-investment industry. He has worked in
                hedge fund and private equity administration in the United States,
                has passed the Series 65 Uniform Investment Adviser Law
                Examination, is the founder of OptionLeo, and is a two-time
                published financial author.
              </p>
              <p>
                As an immigrant himself, Deepak has personally seen the real
                confusion, stress, and pain immigrants face after moving to the
                United States — from understanding taxes, banking, credit, visas,
                insurance, investing, and retirement accounts to cross-border
                India compliance. {site.name} was created to turn those
                hard-to-find answers into simple guides, calculators, checklists,
                and tools that immigrants can actually use.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* B2. Founder story CTA */}
      <section className="pb-4">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Founder story
                </p>
                <h2 className="mt-1 text-lg font-bold text-ink-900">
                  From India to America: Deepak&apos;s journey
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  How he arrived with student and marriage loans, taught himself to
                  invest, and built {site.name}.
                </p>
              </div>
              <Link
                href="/success-stories/deepak-middha"
                className="flex-none rounded-xl bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
              >
                Read the story →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* C. Background & credentials */}
      <section className="border-t border-ink-900/5 bg-[#fafafa] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Background &amp; credentials
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {credentials.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="mt-3 text-base font-bold text-ink-900">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-ink-700">Focus areas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {focusAreas.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-ink-900/10 bg-white px-3 py-1 text-sm font-medium text-ink-600"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-ink-600">
              These credentials are shared for transparency. {site.name} provides
              educational content only and does not provide legal, tax, financial,
              immigration, investment, or insurance advice. Always consult
              qualified professionals or official government sources for your
              situation. See our{" "}
              <Link href="/disclaimer" className="font-semibold text-brand-600 underline">
                disclaimer
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* D. Mission */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              The mission behind {site.name}
            </h2>
            <div className="mt-6 space-y-4 leading-8 text-ink-700">
              <p>
                Immigrants often have the skills and the income to build real
                wealth in America — but lose time and money because the
                information is scattered across government websites, banks, tax
                rules, visa rules, and personal-finance platforms that were never
                written with a new immigrant in mind.
              </p>
              <p>
                {site.name} exists because immigrants should not have to learn
                every U.S. money, tax, visa, and compliance rule the hard way. The
                goal is to give NRIs and new immigrants a practical starting point:
                what to check, what to avoid, what forms may matter, and when to
                speak with a qualified professional.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* E. Topics Deepak covers */}
      <section className="border-t border-ink-900/5 bg-[#fafafa] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Topics Deepak covers
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex items-center justify-between rounded-xl border border-ink-900/5 bg-white px-4 py-3 text-sm font-semibold text-ink-700 shadow-card transition-all hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-card-hover"
                >
                  {t.label}
                  <span
                    aria-hidden
                    className="text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* F. Books */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Books by Deepak
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {author.books.map((book) => (
                <div
                  key={book.url}
                  className="flex gap-5 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
                >
                  {/* TODO: add real book-cover art to /public and render here.
                      Do not hotlink Amazon-hosted cover images. */}
                  <div className="flex aspect-[3/4] w-20 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-emerald-500 text-2xl font-extrabold text-white">
                    📘
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold leading-snug text-ink-900">
                      {book.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                      {book.description}
                    </p>
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-fit text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                      View on Amazon ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* G. Tools & guides created / contributed to */}
      <section className="border-t border-ink-900/5 bg-[#fafafa] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Tools &amp; guides Deepak built
            </h2>
            <p className="mt-3 text-ink-500">
              Free calculators, checkers, and guides created for NRIs and
              immigrants across {site.name}.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {toolsBuilt.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex items-center justify-between rounded-xl border border-ink-900/5 bg-white px-4 py-3 text-sm font-semibold text-ink-700 shadow-card transition-all hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-card-hover"
                >
                  {t.label}
                  <span
                    aria-hidden
                    className="text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* H. Contact / correction */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-8 shadow-card">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Questions, feedback, or a correction?
            </h2>
            <p className="mt-3 leading-8 text-ink-700">
              {site.name} welcomes updates, corrections, and suggestions so the
              guides stay useful for immigrant families. If something is unclear
              or out of date, we want to hear about it. See how we verify and
              correct our stories in the{" "}
              <Link
                href="/success-stories/editorial-methodology"
                className="font-semibold text-brand-600 underline"
              >
                editorial methodology
              </Link>
              .
            </p>
            <p className="mt-2 text-sm text-ink-400">
              Profile last verified: July 13, 2026.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Contact us
              </Link>
              <Link
                href="/contribute"
                className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Write for us
              </Link>
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Connect on LinkedIn ↗
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
