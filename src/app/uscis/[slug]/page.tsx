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
  uscisChildPages,
  uscisChildSlugs,
  getUscisChildPage,
  USCIS_CASE_STATUS_HUB,
} from "@/lib/uscisCluster";

/* ── static params ──────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return uscisChildSlugs.map((slug) => ({ slug }));
}

/* ── metadata ───────────────────────────────────────────────────────────── */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getUscisChildPage(params.slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.metaDescription ?? page.excerpt,
    path: `/uscis/${page.slug}`,
    type: "article",
    openGraph: {
      publishedTime: page.date,
      modifiedTime: page.updated ?? page.date,
    },
  });
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function UscisChildPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getUscisChildPage(params.slug);
  if (!page) notFound();

  const faqs = extractFaq(page.content);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "USCIS Guide", url: "/uscis" },
    { name: "Case Status", url: USCIS_CASE_STATUS_HUB },
    { name: page.navLabel, url: `/uscis/${page.slug}` },
  ];

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${absoluteUrl(`/uscis/${page.slug}`)}#article`,
    headline: page.title,
    description: page.excerpt,
    datePublished: page.date,
    dateModified: page.updated ?? page.date,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/uscis/${page.slug}`),
    },
    url: absoluteUrl(`/uscis/${page.slug}`),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    ...(faqs.length ? [faqJsonLd(faqs)] : [])
  );

  // Sibling pages for navigation (excluding current)
  const siblings = uscisChildPages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ── Header ────────────────────────────────────────────────────── */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav
                aria-label="Breadcrumb"
                className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
              >
                {crumbs.map((c, i) => (
                  <span key={c.url} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.url} className="hover:text-brand-600">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-ink-500">{c.name}</span>
                    )}
                  </span>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href="/uscis"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span>
                  USCIS
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

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto">
              <ArticleBody content={page.content} />

              {/* Tool CTA */}
              <div className="mx-auto mt-8 max-w-[720px] rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-sm">
                <p className="font-semibold text-blue-900">
                  Not sure what your status means for your specific form?
                </p>
                <p className="mt-1 text-blue-800/80">
                  Use the USCIS Case Status Meaning Tool — select your form type and current
                  status for plain-English guidance.
                </p>
                <Link
                  href="/tools/uscis-case-status-meaning"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Try the tool →
                </Link>
              </div>

              {/* Disclaimer */}
              <div className="mx-auto mt-6 max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">A quick note: </strong>
                This guide is educational and not legal or immigration advice. USCIS rules
                and processing times change. Always verify at the official{" "}
                <a
                  href="https://www.uscis.gov"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  USCIS website
                </a>{" "}
                and consult a licensed immigration attorney for your situation.
              </div>

              {/* Back link */}
              <div className="mx-auto mt-6 max-w-[720px] text-sm">
                <Link
                  href={USCIS_CASE_STATUS_HUB}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  ← Back to USCIS Case Status guide
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </article>

      {/* ── Sibling navigation ──────────────────────────────────────────────── */}
      {siblings.length > 0 && (
        <section className="bg-white py-12 sm:py-14">
          <Container>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">
              Also in this guide
            </p>
            <h2 className="text-xl font-bold text-ink-900 mb-6">
              More USCIS status guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.slice(0, 6).map((p) => (
                <Link
                  key={p.slug}
                  href={`/uscis/${p.slug}`}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {p.kind === "reference" ? "Reference" : "Status guide"}
                  </span>
                  <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-brand-700">
                    {p.navLabel}
                  </h3>
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
