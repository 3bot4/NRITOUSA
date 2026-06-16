import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleBody from "@/components/ArticleBody";
import Newsletter from "@/components/Newsletter";
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
  h1bChildPages,
  h1bChildSlugs,
  getH1bChildPage,
  H1B_CLUSTER_BASE,
} from "@/lib/h1bCluster";

/* ── static params ──────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return h1bChildSlugs.map((slug) => ({ slug }));
}

/* ── metadata ───────────────────────────────────────────────────────────── */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getH1bChildPage(params.slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.metaDescription ?? page.excerpt,
    path: `/h1b/${page.slug}`,
    type: "article",
    openGraph: {
      publishedTime: page.date,
      modifiedTime: page.updated ?? page.date,
    },
  });
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function H1bChildPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getH1bChildPage(params.slug);
  if (!page) notFound();

  const faqs = extractFaq(page.content);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "H1B Guide", url: H1B_CLUSTER_BASE },
    { name: page.navLabel, url: `/h1b/${page.slug}` },
  ];

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${absoluteUrl(`/h1b/${page.slug}`)}#article`,
    headline: page.title,
    description: page.excerpt,
    datePublished: page.date,
    dateModified: page.updated ?? page.date,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/h1b/${page.slug}`),
    },
    url: absoluteUrl(`/h1b/${page.slug}`),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    ...(faqs.length ? [faqJsonLd(faqs)] : [])
  );

  const siblings = h1bChildPages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* header */}
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
                <Link href="/h1b"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1 font-semibold text-white">
                  <span>🛂</span> H1B Guide
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
            </div>
          </Container>
        </header>

        {/* body */}
        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto">
              <ArticleBody content={page.content} />

              {/* tool CTA */}
              <div className="mx-auto mt-8 max-w-[720px] rounded-2xl border border-orange-100 bg-orange-50/50 p-5 text-sm">
                <p className="font-semibold text-orange-900">
                  Check your H1B transfer situation
                </p>
                <p className="mt-1 text-orange-800/80">
                  Use the H1B Transfer Risk Checklist to assess documents, timing, and whether to ask about premium processing.
                </p>
                <Link href="/tools/h1b-transfer-risk-checklist"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                  Open the checklist →
                </Link>
              </div>

              {/* disclaimer */}
              <div className="mx-auto mt-6 max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">A quick note: </strong>
                This guide is educational and not legal or immigration advice. H1B rules, USCIS processing times, and DOL regulations change. Always verify at the official{" "}
                <a href="https://www.uscis.gov" className="text-brand-600 underline" rel="nofollow noopener" target="_blank">
                  USCIS website
                </a>{" "}
                and consult a licensed immigration attorney for your situation.
              </div>

              {/* back link */}
              <div className="mx-auto mt-6 max-w-[720px] text-sm">
                <Link href={H1B_CLUSTER_BASE} className="font-medium text-brand-600 hover:text-brand-700">
                  ← Back to H1B Guide
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </article>

      {/* sibling navigation */}
      {siblings.length > 0 && (
        <section className="bg-white py-12 sm:py-14">
          <Container>
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-1">Also in this guide</p>
            <h2 className="text-xl font-bold text-ink-900 mb-6">More H1B guides</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.slice(0, 6).map((p) => (
                <Link key={p.slug} href={`/h1b/${p.slug}`}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">H1B guide</span>
                  <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-orange-700">{p.navLabel}</h3>
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
