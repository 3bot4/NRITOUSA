import type { Metadata } from "next";
import { pageMetadata, faqJsonLd, jsonLdGraph, type FaqItem } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import AuthorCard from "@/components/contributors/AuthorCard";
import ContributorAvatar from "@/components/success-stories/ContributorAvatar";
import { authors } from "@/lib/authors";
import { contributors, storyPath } from "@/lib/successStories";

const contributorFaqs: FaqItem[] = [
  {
    question: "Who can contribute to NRI to USA?",
    answer:
      "Immigrant IT and other professionals with a real, lived U.S. visa, career, or relocation experience — H-1B transfers, layoffs, salary negotiation, green card waits, and similar first-90-days topics. No formal writing credentials are required; the lived experience is the qualification. Finance, tax, and investment guidance is written in-house, not by guest contributors.",
  },
  {
    question: "Do I need credentials or a professional license to write a guest article?",
    answer:
      "No. Guest contributions are first-person accounts of your own experience, not professional advice, so no license or credential is required. If your piece cites specific rules, fees, or processing times, those claims are checked against current official sources before publishing.",
  },
  {
    question: "What happens after I submit a story?",
    answer:
      "The editorial team reads every submission for fit and accuracy, checks any factual claims (visa rules, fees, timelines) against current official sources, and may lightly edit for clarity, flow, and house style. If it's a fit, we'll follow up to finalize your byline, photo, and short bio before publishing. Given volume, we can't personally respond to every submission that isn't a fit.",
  },
  {
    question: "Do contributors get paid, or is this for exposure only?",
    answer:
      "Guest contributions are unpaid. In exchange, contributors get a named byline, a dedicated author page linking their LinkedIn, and a listing in this Contributor Directory — a portfolio piece, not compensation.",
  },
  {
    question: "Can I promote my business, course, or services in my article?",
    answer:
      "No. Self-promotional or affiliate links don't belong in the article body — only in your author bio, and all external links are vetted before publishing. If you have a financial or business relationship connected to your topic (for example, you work at an immigration law firm or financial advisory), disclose it when you submit so we can note it or decline as appropriate.",
  },
  {
    question: "What if a reader spots an error in a published article?",
    answer:
      "Report it through our contact page. We review, correct genuine errors, and note material corrections — the same standard we apply across the site, described in our editorial methodology.",
  },
];

const title = "Contributors & Featured Immigrant Leaders";
const description =
  "Meet the founder, editorial reviewers, and immigrant professionals behind NRI to USA — and the featured leaders sharing their real journeys.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: "/contributors",
});

/** Map a role code to a human label + accent for the profile cards. */
const roleLabel: Record<string, string> = {
  author: "Author",
  reviewer: "Editorial reviewer",
  editor: "Editor",
  interviewee: "Interview subject",
  contributor: "Contributor",
  "featured-guest": "Featured leader",
};

export default function ContributorsPage() {
  const featured = contributors.filter((c) => c.featured);
  const jsonLd = jsonLdGraph(faqJsonLd(contributorFaqs));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Contributor Directory
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              The people behind the guides
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              Our founder and editorial reviewers, the immigrant professionals who
              contribute first-person guides, and the featured leaders whose
              journeys we tell. Each person&apos;s relationship with NRI to USA is
              labeled — being featured never implies employment or endorsement.
            </p>
            <Link
              href="/contribute"
              className="mt-8 inline-block rounded-xl bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700"
            >
              Become a contributor
            </Link>
          </div>
        </Container>
      </section>

      {/* Founder & editorial */}
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            Founder &amp; editorial
          </h2>
          <p className="mt-2 max-w-2xl text-ink-500">
            The people who write, review, and stand behind our content.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <div
                key={c.slug}
                className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <ContributorAvatar contributor={c} size={64} />
                  <div className="min-w-0">
                    <p className="font-bold text-ink-900">{c.fullName}</p>
                    <p className="text-sm text-ink-500">{c.currentTitle}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.profileType.map((r) => (
                    <span
                      key={r}
                      className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700"
                    >
                      {roleLabel[r] ?? r}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
                  {c.approvedBio}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                  <Link
                    href={c.authorPageUrl}
                    className="text-brand-600 hover:text-brand-700"
                  >
                    Profile →
                  </Link>
                  {c.storyUrls[0] && (
                    <Link
                      href={c.storyUrls[0]}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      Read story →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-400">
            See how we verify identities and approve stories in our{" "}
            <Link
              href="/success-stories/editorial-methodology"
              className="font-semibold text-brand-600 underline"
            >
              editorial methodology
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* Guest contributors */}
      <section className="border-t border-ink-900/5 bg-slate-50/60 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            Guest contributors
          </h2>
          <p className="mt-2 max-w-2xl text-ink-500">
            Immigrant IT professionals writing about H-1B transfers, layoffs
            survived, salary negotiation, and the first months in the US — the
            lived experience search engines can&apos;t fake.
          </p>
          <div className="mt-8">
            {authors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {authors.map((author) => (
                  <AuthorCard key={author.slug} author={author} />
                ))}
              </div>
            ) : (
              <p className="text-ink-500">
                Our first guest contributors are being onboarded.{" "}
                <Link href="/contribute" className="text-brand-600 underline">
                  Share your story
                </Link>{" "}
                to be among them.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* How contributing works — editorial transparency */}
      <section className="border-t border-ink-900/5 bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              How contributing works
            </h2>
            <p className="mt-2 text-ink-500">
              The recruitment pitch and submission form live on our{" "}
              <Link href="/contribute" className="font-semibold text-brand-600 underline">
                Write for Us
              </Link>{" "}
              page. Here&apos;s the editorial detail behind it.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-ink-900">Who may contribute, and on what topics</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Immigrant IT and other professionals with a real, lived U.S. visa, career, or
                  relocation experience — H-1B transfers, layoffs, salary negotiation, green card
                  waits, and similar first-90-days topics. See the full{" "}
                  <Link href="/contribute#form" className="font-semibold text-brand-600 underline">
                    topics we&apos;re looking for
                  </Link>
                  . Finance, tax, and investment guidance is written in-house, not by guest
                  contributors, so we can hold it to a stricter sourcing bar.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-900">Credential expectations</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  No formal writing credentials, degree, or license is required — a guest piece is a
                  first-person account of your own experience, not professional advice. What we do
                  require: it must be your own original story, and any specific rule, fee, or
                  processing time you cite must hold up against current official sources.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-900">Editorial review process</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Every submission is read for fit and accuracy. Factual claims about visa rules,
                  fees, or timelines are checked against current official sources. We may lightly
                  edit for clarity, flow, and house style before publishing under your byline. Roles
                  are labeled consistently across the site — see how we define{" "}
                  <Link href="/success-stories/editorial-methodology" className="font-semibold text-brand-600 underline">
                    author, contributor, reviewer, and editor
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-900">Source requirements</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Personal narrative doesn&apos;t need a citation. Specific factual claims — a fee
                  amount, a processing time, a legal rule — do, and we verify those against official
                  sources (USCIS, Department of State, IRS, or equivalent) before publishing, not
                  just against what you remember.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-900">Conflicts of interest &amp; prohibited promotion</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Self-promotional and affiliate links don&apos;t belong in the article body — only
                  in your author bio — and all external links are vetted before publishing. If you
                  have a financial or business relationship connected to your topic (for example,
                  you work at an immigration law firm or a financial advisory), disclose it when you
                  submit so we can note it or decline the piece as appropriate. NRI to USA is not
                  affiliated with USCIS, the Department of State, or any other government agency, and
                  being featured never implies employment or endorsement.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-900">Submission process &amp; what happens after</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Submit your story through the form on{" "}
                  <Link href="/contribute#form" className="font-semibold text-brand-600 underline">
                    Write for Us
                  </Link>
                  . If it&apos;s a fit, we&apos;ll follow up to finalize your byline, photo, and short
                  bio before publishing, and you&apos;ll appear in this Contributor Directory with a
                  dedicated author page. Given volume, we can&apos;t personally respond to every
                  submission that isn&apos;t a fit.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-900">Author profile &amp; corrections</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Published contributors get a permanent author page listing their work. If a reader
                  spots an error in a published article, they can report it through our{" "}
                  <Link href="/contact" className="font-semibold text-brand-600 underline">
                    contact page
                  </Link>
                  ; we review, correct genuine errors, and note material corrections, per our{" "}
                  <Link href="/success-stories/editorial-methodology" className="font-semibold text-brand-600 underline">
                    editorial methodology
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {contributorFaqs.map((f) => (
                <details key={f.question} className="group rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                  <summary className="cursor-pointer list-none text-sm font-bold text-ink-900 marker:content-none">
                    <span className="flex items-center justify-between gap-3">
                      {f.question}
                      <span className="text-ink-300 transition group-open:rotate-45" aria-hidden>+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/contribute"
                className="inline-block rounded-xl bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Start your submission →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
