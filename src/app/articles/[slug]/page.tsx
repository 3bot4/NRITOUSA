import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleBody from "@/components/ArticleBody";
import ArticleCard from "@/components/ArticleCard";
import ArticleByline from "@/components/ArticleByline";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import IulComparisonCalculator from "@/components/calculators/IulComparisonCalculator";
import { articles, getArticle, getRelatedArticles } from "@/lib/articles";
import { getTopic } from "@/lib/topics";
import { resolveByline } from "@/lib/byline";
import {
  articleJsonLd,
  articlePath,
  breadcrumbJsonLd,
  extractFaq,
  faqJsonLd,
  jsonLdGraph,
  topicPath,
} from "@/lib/seo";

/**
 * Interactive components embedded inside specific articles. The article's
 * content marks the insertion point with a line containing exactly
 * "{{calculator}}"; everything before/after renders through ArticleBody.
 */
const ARTICLE_EMBEDS: Record<string, React.ComponentType> = {
  "iul-vs-401k-honest-comparison": IulComparisonCalculator,
};

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Article not found" };
  const topic = getTopic(article.topic);
  return {
    title: article.seoTitle ?? article.title,
    description: article.excerpt,
    alternates: { canonical: articlePath(article.slug) },
    openGraph: {
      type: "article",
      url: articlePath(article.slug),
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      section: topic?.title,
      authors: [resolveByline(article).name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const topic = getTopic(article.topic);
  const related = getRelatedArticles(article);
  const faqs = extractFaq(article.content);

  const jsonLd = jsonLdGraph(
    articleJsonLd(article),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/topics" },
      ...(topic ? [{ name: topic.title, url: topicPath(topic.slug) }] : []),
      { name: article.title, url: articlePath(article.slug) },
    ]),
    ...(faqs.length ? [faqJsonLd(faqs)] : [])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Header */}
        <header className="border-b border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-prose">
              <nav
                aria-label="Breadcrumb"
                className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-400"
              >
                <Link href="/" className="hover:text-brand-600">
                  Home
                </Link>
                <span aria-hidden>/</span>
                <Link href="/topics" className="hover:text-brand-600">
                  Guides
                </Link>
                {topic && (
                  <>
                    <span aria-hidden>/</span>
                    <Link
                      href={topicPath(topic.slug)}
                      className="hover:text-brand-600"
                    >
                      {topic.title}
                    </Link>
                  </>
                )}
              </nav>

              {topic && (
                <Link
                  href={topicPath(topic.slug)}
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${topic.accent} px-3 py-1 text-xs font-semibold text-white`}
                >
                  <span>{topic.icon}</span>
                  {topic.label}
                </Link>
              )}

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl md:text-[2.75rem]">
                {article.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-500">
                {article.excerpt}
              </p>

              <ArticleByline article={article} />
            </div>
          </Container>
        </header>

        {/* Body */}
        <div className="py-12 sm:py-16">
          <Container>
            <div className="mx-auto">
              {(() => {
                const Embed = ARTICLE_EMBEDS[article.slug];
                const parts = article.content.split("{{calculator}}");
                if (Embed && parts.length === 2) {
                  return (
                    <>
                      <ArticleBody content={parts[0]} />
                      <div className="my-10">
                        <Embed />
                      </div>
                      <ArticleBody content={parts[1]} />
                    </>
                  );
                }
                return <ArticleBody content={article.content} />;
              })()}

              <div className="mx-auto mt-12 max-w-prose rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">
                  A quick note:
                </strong>{" "}
                This article is educational and reflects general information,
                not personalized financial, tax, legal, or immigration advice.
                Rules change and individual situations differ — consult a
                qualified professional before acting. See our{" "}
                <Link href="/disclaimer" className="text-brand-600 underline">
                  full disclaimer
                </Link>
                .
              </div>

              {topic && (
                <div className="mx-auto mt-6 max-w-prose text-sm">
                  <Link
                    href={topicPath(topic.slug)}
                    className="font-medium text-brand-600 hover:text-brand-700"
                  >
                    ← More {topic.title} guides
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Keep reading" title="Related guides" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <Newsletter />
    </>
  );
}
