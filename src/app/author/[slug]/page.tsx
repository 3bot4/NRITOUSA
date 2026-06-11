import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import ArticleCard from "@/components/ArticleCard";
import Icon from "@/components/Icon";
import AuthorAvatar from "@/components/contributors/AuthorAvatar";
import { authors, getAuthor } from "@/lib/authors";
import { getArticlesByAuthor } from "@/lib/articles";
import { authorProfileJsonLd, jsonLdGraph } from "@/lib/seo";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const author = getAuthor(params.slug);
  if (!author) return { title: "Author not found" };
  const title = `${author.name} — ${author.role}`;
  const description = author.bio;
  const url = `/author/${author.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "profile", url, title, description },
    twitter: { title, description },
  };
}

export default function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = getAuthor(params.slug);
  if (!author) notFound();

  const authored = getArticlesByAuthor(author.slug);
  const jsonLd = jsonLdGraph(authorProfileJsonLd(author, authored));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Profile header */}
      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-400"
            >
              <Link href="/" className="hover:text-brand-600">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href="/contributors" className="hover:text-brand-600">
                Contributors
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink-500">{author.name}</span>
            </nav>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <AuthorAvatar author={author} size={112} />
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                  {author.name}
                </h1>
                <p className="mt-1 text-base font-medium text-brand-700">
                  {author.role}
                </p>
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-brand-600"
                >
                  <Icon name="linkedin" className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </div>
            </div>

            <p className="mt-6 leading-8 text-ink-700">{author.bio}</p>
          </div>
        </Container>
      </section>

      {/* Articles by this author */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Published work"
            title={`Articles by ${author.name}`}
          />
          {authored.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {authored.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-8 text-center">
              <p className="text-ink-500">
                {author.name}&apos;s first article is on the way — check back
                soon.
              </p>
              <Link
                href="/contribute"
                className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Want to contribute too? Share your story →
              </Link>
            </div>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
