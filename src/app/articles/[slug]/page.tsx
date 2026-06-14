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
import TuitionCalc from "@/components/education/TuitionCalc";
import { articles, getArticle, getRelatedArticles } from "@/lib/articles";
import { getTopic } from "@/lib/topics";
import { resolveByline } from "@/lib/byline";
import { formatDate } from "@/lib/format";
import {
  articleJsonLd,
  articlePath,
  breadcrumbJsonLd,
  extractFaq,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  topicPath,
} from "@/lib/seo";

/**
 * Interactive components embedded inside specific articles. The article's
 * content marks the insertion point with a line containing exactly
 * "{{calculator}}"; everything before/after renders through ArticleBody.
 */
const ARTICLE_EMBEDS: Record<string, React.ComponentType> = {
  "iul-vs-401k-honest-comparison": IulComparisonCalculator,
  "college-tuition-immigrants-2025": TuitionCalc,
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
  return pageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.excerpt,
    path: articlePath(article.slug),
    type: "article",
    image: `${articlePath(article.slug)}/opengraph-image`,
    socialTitle: article.title,
    openGraph: {
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      section: topic?.title,
      authors: [resolveByline(article).name],
    },
  });
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
        {/* Compact header — no hero image. Category, read time and date on
            one line, then straight into the title and subtitle. */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav
                aria-label="Breadcrumb"
                className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
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

              {/* Category pill · read time · date */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                {topic && (
                  <Link
                    href={topicPath(topic.slug)}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${topic.accent} px-3 py-1 font-semibold text-white`}
                  >
                    <span>{topic.icon}</span>
                    {topic.label}
                  </Link>
                )}
                <span>{article.readingTime} min read</span>
                <span aria-hidden>·</span>
                <span>{formatDate(article.updated ?? article.date)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                {article.title}
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                {article.excerpt}
              </p>

              <ArticleByline article={article} />
            </div>
          </Container>
        </header>

        {/* Body */}
        <div className="py-8 sm:py-10">
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

              <div className="mx-auto mt-10 max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
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
                <div className="mx-auto mt-6 max-w-[720px] text-sm">
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
        <section className="bg-white py-12 sm:py-14">
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
