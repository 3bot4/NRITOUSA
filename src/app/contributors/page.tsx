import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import AuthorCard from "@/components/contributors/AuthorCard";
import ContributorAvatar from "@/components/success-stories/ContributorAvatar";
import { authors } from "@/lib/authors";
import { contributors, storyPath } from "@/lib/successStories";

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

  return (
    <>
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

      <Newsletter />
    </>
  );
}
