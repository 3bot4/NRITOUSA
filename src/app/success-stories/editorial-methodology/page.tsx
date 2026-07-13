import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/success-stories/editorial-methodology";
const title = "How We Produce NRI Success Stories";
const description =
  "How NRI to USA selects interview subjects, collects consent, verifies professional details, approves quotes, and corrects errors in its immigrant success stories.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: PATH,
});

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "How we select interview subjects",
    body: (
      <>
        We feature immigrants and NRIs whose journeys carry a useful, transferable
        lesson — not simply an impressive title. Subjects are chosen for what a
        reader one step behind them can learn: a career pivot, an immigration
        decision, a money mistake, a way of adapting. Being featured is not a paid
        placement and does not imply that we endorse a subject&apos;s employer,
        business, product, or service.
      </>
    ),
  },
  {
    heading: "How we collect consent",
    body: (
      <>
        Every subject gives written consent before publication and separate
        permission for any photograph we use. Subjects approve which details may
        appear — and any sensitive facts (immigration specifics, compensation,
        family details) are only published when the subject has explicitly agreed
        to them. We keep consent and approval records privately; we do not publish
        them.
      </>
    ),
  },
  {
    heading: "How we verify professional details",
    body: (
      <>
        We check names, current roles, credentials, and employers against
        first-hand source material — an interview transcript, the subject&apos;s
        own published writing, or documentation the subject provides. Where a fact
        cannot be supported by an approved source, it does not appear. We do not
        rewrite public LinkedIn profiles or reproduce profile text.
      </>
    ),
  },
  {
    heading: "How quotations are approved",
    body: (
      <>
        Direct quotations are drawn only from material the subject said in an
        interview or owns and has approved for reuse (for example, their own
        published book). Interviews are edited for clarity and length, and the
        subject reviews the edited piece for factual accuracy before it is
        published.
      </>
    ),
  },
  {
    heading: "Author, interviewee, contributor, reviewer, editor",
    body: (
      <>
        We keep these roles distinct and label them on every story:
        <ul className="mt-3 space-y-2">
          <li>
            <strong>Author / writer</strong> — the person or team that actually
            wrote the piece.
          </li>
          <li>
            <strong>Interviewee / subject</strong> — the person the story is about.
            Being the subject does not make someone the author.
          </li>
          <li>
            <strong>Contributor</strong> — a guest who writes their own first-person
            article.
          </li>
          <li>
            <strong>Reviewer</strong> — who checked the piece for accuracy.
          </li>
          <li>
            <strong>Editor</strong> — who edited it for clarity and length.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Corrections & updates",
    body: (
      <>
        If we get something wrong, we fix it and note material corrections. Stories
        show a &ldquo;last reviewed&rdquo; date, and we update them when facts
        change. To request a correction, use our{" "}
        <Link href="/contact" className="font-semibold text-brand-600 underline">
          contact page
        </Link>
        .
      </>
    ),
  },
  {
    heading: "Disclosure & independence",
    body: (
      <>
        When a story features someone connected to NRI to USA — for example our
        founder — we say so plainly at the top of the page. Editorial decisions are
        made independently of any commercial relationship, and inclusion in this
        section is never sold.
      </>
    ),
  },
  {
    heading: "Financial, legal, medical, immigration & employment claims",
    body: (
      <>
        Personal experiences are shared as one person&apos;s story, not as
        individualized advice. Nothing in a success story is legal, tax, financial,
        investment, medical, or immigration advice for your situation. Where a
        subject discusses money or immigration, we frame it as their experience and
        point readers to official sources and qualified professionals. See our{" "}
        <Link href="/disclaimer" className="font-semibold text-brand-600 underline">
          disclaimer
        </Link>
        .
      </>
    ),
  },
];

export default function EditorialMethodologyPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Success Stories", url: "/success-stories" },
      { name: "Editorial Methodology", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-ink-900/5 bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-ink-400"
            >
              <Link href="/" className="hover:text-brand-600">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href="/success-stories" className="hover:text-brand-600">
                Success Stories
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink-500">Editorial methodology</span>
            </nav>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-600">
              Editorial methodology
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              How we produce NRI Success Stories
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Our stories are only useful if they&apos;re trustworthy. This page
              explains how we choose subjects, collect consent, verify facts,
              approve quotes, and correct mistakes — so you know exactly what
              you&apos;re reading.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-bold tracking-tight text-ink-900">
                  {s.heading}
                </h2>
                <div className="mt-3 leading-8 text-ink-700">{s.body}</div>
              </div>
            ))}

            <div className="rounded-2xl border border-ink-900/10 bg-slate-50/60 p-6">
              <p className="text-sm leading-relaxed text-ink-600">
                {site.name} is a content platform operated by {site.owner}. This
                methodology applies to the Success Stories section and complements
                our{" "}
                <Link
                  href="/disclaimer"
                  className="font-semibold text-brand-600 underline"
                >
                  disclaimer
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-brand-600 underline"
                >
                  privacy policy
                </Link>
                .
              </p>
            </div>

            <p>
              <Link
                href="/success-stories"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                ← Back to all NRI Success Stories
              </Link>
            </p>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
