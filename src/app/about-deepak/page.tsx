import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { author, authorInitials } from "@/lib/author";
import { site } from "@/lib/site";
import { absoluteUrl, jsonLdGraph } from "@/lib/seo";

const title = "Deepak Middha — Founder & Author | NRI to USA";
const description =
  "Deepak Middha is the founder of NRI to USA and Wealth Building Academy LLC — a Chartered Accountant with 15+ years in the hedge fund industry and holder of the Series 65.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: author.url },
  openGraph: { type: "profile", url: author.url, title, description },
  twitter: { title, description },
};

/** Person structured data for E-E-A-T / author authority. */
const personJsonLd = {
  "@type": "Person",
  "@id": `${site.url}${author.url}#person`,
  name: author.name,
  jobTitle: author.jobTitle,
  url: absoluteUrl(author.url),
  description,
  worksFor: { "@id": `${site.url}/#organization` },
  sameAs: [author.linkedin, ...author.books.map((b) => b.url)],
};

export default function AboutDeepakPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdGraph(personJsonLd)),
        }}
      />

      {/* Hero / bio */}
      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-xl font-extrabold text-brand-700">
                {authorInitials}
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                  {author.jobTitle}
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                  {author.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-ink-400">
                  {author.credentials}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 leading-8 text-ink-700">
              <p>
                Deepak Middha is the founder of {site.name} and{" "}
                <strong>{site.owner}</strong>. He is a Chartered Accountant with
                over 15 years of experience in the hedge fund industry, where he
                worked alongside prominent trading advisors and fund managers,
                and holds the Series 65 (Uniform Investment Adviser Law Exam).
              </p>
              <p>
                As an immigrant himself, he navigated the exact financial system
                this site covers — building wealth in the US through equity and
                options investing, rental real estate, and tax-efficient
                retirement accounts.
              </p>
              {/* TODO: Deepak to add more specifics — firms worked at, education, and years in the US. */}
            </div>
          </div>
        </Container>
      </section>

      {/* Author of */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Author of
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {author.books.map((book) => (
                <div
                  key={book.url}
                  className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
                >
                  {/* TODO: add book cover image to /public and render here instead of this placeholder.
                      Do not hotlink Amazon-hosted cover images. */}
                  <div className="flex aspect-[3/4] w-24 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-emerald-500 text-2xl font-extrabold text-white">
                    📘
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-snug text-ink-900">
                    {book.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                    {book.description}
                  </p>
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-fit font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View on Amazon →
                  </a>
                </div>
              ))}
            </div>

            {/* LinkedIn */}
            <div className="mt-10 rounded-2xl border border-ink-900/5 bg-[#fafafa] p-6">
              <p className="text-sm text-ink-500">Connect with Deepak</p>
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-brand-600 hover:text-brand-700"
              >
                LinkedIn → linkedin.com/in/deepak-middha
              </a>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/topics"
                className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Read the guides
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                About {site.name}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
