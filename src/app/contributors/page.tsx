import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import AuthorCard from "@/components/contributors/AuthorCard";
import { authors } from "@/lib/authors";

const title = "Contributors";
const description =
  "Meet the immigrant IT professionals sharing their real career, visa, and relocation journeys to help NRIs one step behind them.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: "/contributors",
});

export default function ContributorsPage() {
  return (
    <>
      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Contributor Directory
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              The people sharing the road behind them
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              Real immigrant IT professionals writing about H-1B transfers,
              layoffs survived, salary negotiation, and the first months in the
              US — the lived experience search engines can&apos;t fake.
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

      <section className="py-16 sm:py-20">
        <Container>
          {authors.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {authors.map((author) => (
                <AuthorCard key={author.slug} author={author} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">
              Our first contributors are being onboarded.{" "}
              <Link href="/contribute" className="text-brand-600 underline">
                Share your story
              </Link>{" "}
              to be among them.
            </p>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
