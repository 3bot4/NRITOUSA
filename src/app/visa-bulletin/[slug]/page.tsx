import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleBody from "@/components/ArticleBody";
import Newsletter from "@/components/Newsletter";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import VisaBulletinCategoryStatus from "@/components/VisaBulletinCategoryStatus";
import VisaBulletinMovementHistory from "@/components/VisaBulletinMovementHistory";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  extractFaq,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import {
  visaBulletinChildPages,
  visaBulletinChildSlugs,
  getVisaBulletinChildPage,
  VISA_BULLETIN_CLUSTER_BASE,
} from "@/lib/visaBulletinCluster";

export function generateStaticParams() {
  return visaBulletinChildSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getVisaBulletinChildPage(params.slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.metaDescription ?? page.excerpt,
    path: `/visa-bulletin/${page.slug}`,
    type: "article",
    openGraph: {
      publishedTime: page.date,
      modifiedTime: page.updated ?? page.date,
    },
  });
}

export default function VisaBulletinChildPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getVisaBulletinChildPage(params.slug);
  if (!page) notFound();

  const faqs = extractFaq(page.content);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Visa Bulletin Guide", url: VISA_BULLETIN_CLUSTER_BASE },
    { name: page.navLabel, url: `/visa-bulletin/${page.slug}` },
  ];

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${absoluteUrl(`/visa-bulletin/${page.slug}`)}#article`,
    headline: page.title,
    description: page.excerpt,
    datePublished: page.date,
    dateModified: page.updated ?? page.date,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/visa-bulletin/${page.slug}`),
    },
    url: absoluteUrl(`/visa-bulletin/${page.slug}`),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    ...(faqs.length ? [faqJsonLd(faqs)] : [])
  );

  const siblings = visaBulletinChildPages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                {crumbs.map((c, i) => (
                  <span key={c.url} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.url} className="hover:text-brand-600">{c.name}</Link>
                    ) : (
                      <span className="text-ink-500">{c.name}</span>
                    )}
                  </span>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link href="/visa-bulletin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-600 px-3 py-1 font-semibold text-white">
                  <span>📅</span> Visa Bulletin Guide
                </Link>
                <span>{page.readingTime} min read</span>
                <span aria-hidden>·</span>
                <span>{formatDate(page.updated ?? page.date)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                {page.title}
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                {page.excerpt}
              </p>
              <ReviewedByline date={page.updated ?? page.date} className="mt-4" />
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto">
              {/* Live current-status card for EB category pages — every value
                  comes from the centralized bulletin data, so the evergreen
                  article body below can stay date-free. */}
              {page.category && (
                <>
                  <VisaBulletinCategoryStatus
                    category={page.category}
                    className="mx-auto mb-8 max-w-[720px]"
                  />
                  <VisaBulletinMovementHistory
                    category={page.category}
                    className="mb-8"
                  />
                </>
              )}

              <ArticleBody content={page.content} />

              {/* tool CTA */}
              <div className="mx-auto mt-8 max-w-[720px] rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-sm">
                <p className="font-semibold text-blue-900">Check your priority date against the visa bulletin</p>
                <p className="mt-1 text-blue-800/80">
                  Use the Priority Date Checker to compare your EB category, country, and priority date against the current visa bulletin data.
                </p>
                <Link href="/tools/priority-date-checker"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                  Open Priority Date Checker →
                </Link>
              </div>

              {/* disclaimer */}
              <div className="mx-auto mt-6 max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">A quick note: </strong>
                This guide is educational and not legal or immigration advice. Visa bulletin cutoff dates change monthly. Always verify the current month's bulletin at the{" "}
                <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" className="text-brand-600 underline" rel="nofollow noopener" target="_blank">Department of State</a>{" "}
                and the filing chart in use at{" "}
                <a href="https://www.uscis.gov/visabulletininfo" className="text-brand-600 underline" rel="nofollow noopener" target="_blank">USCIS</a>, and consult a licensed immigration attorney for your specific situation.
              </div>

              <div className="mx-auto mt-6 max-w-[720px] text-sm">
                <Link href={VISA_BULLETIN_CLUSTER_BASE} className="font-medium text-brand-600 hover:text-brand-700">
                  ← Back to Visa Bulletin Guide
                </Link>
              </div>

              <AuthorBioBox
                className="mt-6"
                tags={[
                  "Visa bulletin & priority dates",
                  "Employment-based green cards",
                  "NRI immigration planning",
                ]}
              />
            </div>
          </Container>
        </div>
      </article>

      {siblings.length > 0 && (
        <section className="bg-white py-12 sm:py-14">
          <Container>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">Also in this guide</p>
            <h2 className="text-xl font-bold text-ink-900 mb-6">More visa bulletin guides</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.slice(0, 6).map((p) => (
                <Link key={p.slug} href={`/visa-bulletin/${p.slug}`}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">Visa bulletin</span>
                  <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-blue-700">{p.navLabel}</h3>
                  <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Newsletter />
    </>
  );
}
