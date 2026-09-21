import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleBody from "@/components/ArticleBody";
import RfeDeadlineCalculator from "@/components/tools/RfeDeadlineCalculator";
import RfeFlowDiagram from "@/components/tools/rfe/RfeFlowDiagram";
import {
  RfeResponseWindowChart,
  RfeOrNotDiagram,
} from "@/components/tools/rfe/RfeVisuals";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import { RFE_RULES, RFE_SOURCES } from "@/data/rfeData";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  extractFaq,
  jsonLdGraph,
  absoluteUrl,
  notFoundMetadata,
} from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import {
  uscisChildPages,
  uscisChildSlugs,
  getUscisChildPage,
  USCIS_CASE_STATUS_HUB,
} from "@/lib/uscisCluster";
import {
  myuscisChildSlugs,
  getMyuscisChildPage,
  MYUSCIS_HUB,
} from "@/lib/myuscisCluster";
import {
  lifePlanningChildSlugs,
  getLifePlanningChildPage,
  LIFE_PLANNING_HUB,
} from "@/lib/uscisLifePlanningCluster";

/* ── static params ──────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return [
    ...uscisChildSlugs.map((slug) => ({ slug })),
    ...myuscisChildSlugs.map((slug) => ({ slug })),
    ...lifePlanningChildSlugs.map((slug) => ({ slug })),
  ];
}

/* ── metadata ───────────────────────────────────────────────────────────── */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page =
    getUscisChildPage(params.slug) ??
    getMyuscisChildPage(params.slug) ??
    getLifePlanningChildPage(params.slug);
  if (!page) return notFoundMetadata();
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
  const uscisPage = getUscisChildPage(params.slug);
  const myuscisPage = !uscisPage ? getMyuscisChildPage(params.slug) : undefined;
  const lifePlanningPage =
    !uscisPage && !myuscisPage
      ? getLifePlanningChildPage(params.slug)
      : undefined;
  const page = uscisPage ?? myuscisPage ?? lifePlanningPage;

  if (!page) notFound();

  const isMyuscisCluster = !!myuscisPage;
  const isLifePlanningCluster = !!lifePlanningPage;

  const faqs = extractFaq(page.content);

  const crumbs = isMyuscisCluster
    ? [
        { name: "Home", url: "/" },
        { name: "USCIS Hub", url: "/uscis" },
        { name: "myUSCIS Account", url: MYUSCIS_HUB },
        { name: page.navLabel, url: `/uscis/${page.slug}` },
      ]
    : isLifePlanningCluster
    ? [
        { name: "Home", url: "/" },
        { name: "USCIS Hub", url: "/uscis" },
        { name: "Life Planning", url: LIFE_PLANNING_HUB },
        { name: page.navLabel, url: `/uscis/${page.slug}` },
      ]
    : [
        { name: "Home", url: "/" },
        { name: "USCIS Hub", url: "/uscis" },
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

  // Sibling pages: show pages from same cluster only
  const siblings = isMyuscisCluster
    ? ([] as typeof uscisChildPages) // myuscis siblings shown on hub
    : uscisChildPages.filter((p) => p.slug !== page.slug);

  const backHref = isMyuscisCluster
    ? MYUSCIS_HUB
    : isLifePlanningCluster
    ? LIFE_PLANNING_HUB
    : USCIS_CASE_STATUS_HUB;
  const backLabel = isMyuscisCluster
    ? "← Back to myUSCIS Account guide"
    : isLifePlanningCluster
    ? "← Back to USCIS Life Planning guide"
    : "← Back to USCIS Case Status guide";

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
              <ReviewedByline date={page.updated ?? page.date} className="mt-4" />
            </div>
          </Container>
        </header>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto">
              {/* /uscis/request-for-evidence-rfe is the general RFE page and
                  owns the deadline arithmetic. /uscis/rfe-notice decodes the
                  document itself and /h1b/rfe covers H-1B-specific RFE types;
                  none of the three carries the others' H2s. */}
              {page.slug === "request-for-evidence-rfe" && (
                <div className="mx-auto mb-10 max-w-[720px] space-y-6">
                  <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5 sm:p-6">
                    <p className="text-base leading-relaxed text-ink-700">
                      An RFE means an officer has paused your case because the
                      record does not yet establish that you qualify — it is not
                      a denial and it is not an accusation. You must respond by
                      the date on the notice, at most{" "}
                      <strong>{RFE_RULES.maxLabel}</strong> (plus{" "}
                      {RFE_RULES.mailGraceDays} days when it was mailed), and{" "}
                      <strong>no extension exists</strong>. Once you respond, the
                      status changes to &ldquo;Response To USCIS&rsquo; Request
                      For Evidence Was Received&rdquo; — a receipt, not a verdict.
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {[
                        `Maximum response period: ${RFE_RULES.maxLabel}`,
                        `Form ${RFE_RULES.shortForms.join(" and Form ")}: ${RFE_RULES.shortFormDays} days`,
                        `Mailed service adds ${RFE_RULES.mailGraceDays} days — so 87 days is the outer limit`,
                        "Officers are prohibited from granting more time",
                        "USCIS counts receipt, not postmark",
                        "A partial response is treated as asking for a decision on the record",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex gap-2 rounded-xl border border-ink-900/5 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-700"
                        >
                          <span aria-hidden className="text-brand-600">
                            ▸
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs leading-relaxed text-ink-500">
                      Rules read from the{" "}
                      <a
                        href={RFE_SOURCES.policyManualEvidence}
                        target="_blank"
                        rel="nofollow noopener"
                        className="text-brand-600 underline"
                      >
                        USCIS Policy Manual, Vol. 1, Pt. E, Ch. 6
                      </a>{" "}
                      on {RFE_RULES.lastVerified}.
                    </p>
                  </div>
                  <NotLegalAdvice />
                </div>
              )}

              {page.slug === "request-for-evidence-rfe" && (
                <div className="mx-auto mb-10 max-w-[720px]">
                  <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                    How an RFE actually runs
                  </h2>
                  <RfeFlowDiagram />

                  <h2 className="mt-10 text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                    An RFE is one of four things that can happen
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    Worth seeing before anything else on this page, because it
                    reframes the question people usually arrive with. An RFE is
                    not the step before a decision — it is one of four decisions
                    an officer can take, and since{" "}
                    {RFE_RULES.discretionPolicy.effective} the fourth branch is
                    fully open to them.
                  </p>
                  <RfeOrNotDiagram />

                  <h2 className="mt-10 text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                    The response window, to scale
                  </h2>
                  <RfeResponseWindowChart />
                </div>
              )}

              <ArticleBody content={page.content} />

              {page.slug === "request-for-evidence-rfe" && (
                <section id="rfe-deadline" className="mt-12 scroll-mt-24">
                  <div className="mx-auto max-w-[720px]">
                    <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                      RFE deadline calculator
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      Two things off the notice — the date at the top and the
                      response period near the end — and you get the last day
                      USCIS will accept the response, a countdown, and a
                      last-safe-post date. Nothing is stored and we never ask for
                      a receipt number.
                    </p>
                  </div>
                  <div className="mt-6">
                    <RfeDeadlineCalculator />
                  </div>

                  <div className="mx-auto mt-8 max-w-[720px] rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                    <p className="text-sm font-bold text-ink-900">
                      What changed on {RFE_RULES.discretionPolicy.effective}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700">
                      {RFE_RULES.discretionPolicy.summary}{" "}
                      {RFE_RULES.discretionPolicy.consequence} In practice that
                      shifts where the effort belongs: a thin filing that would
                      once have drawn an RFE can now simply be refused, so the
                      initial evidence matters more than the ability to fix it
                      later.
                    </p>
                    <p className="mt-2 text-xs text-ink-500">
                      Source:{" "}
                      <a
                        href={RFE_SOURCES.evidentiaryStandardsAlert}
                        target="_blank"
                        rel="nofollow noopener"
                        className="text-brand-600 underline"
                      >
                        USCIS policy alert, 5 August 2026
                      </a>
                      .
                    </p>
                  </div>
                </section>
              )}

              <AuthorBioBox
                className="mt-8"
                tags={["USCIS accounts & notices", "Case status decoding", "Immigrant life planning"]}
              />

              {/* Tool CTA */}
              <div className="mx-auto mt-8 max-w-[720px] rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-sm">
                <p className="font-semibold text-blue-900">
                  {isLifePlanningCluster
                    ? "Get a personalized checklist for your life decision"
                    : isMyuscisCluster
                    ? "Not sure what a USCIS notice means?"
                    : "Not sure what your status means for your specific form?"}
                </p>
                <p className="mt-1 text-blue-800/80">
                  {isLifePlanningCluster
                    ? "Use the USCIS Life Decision Checklist — select your decision, status, and green card stage for a risk assessment and action checklist."
                    : isMyuscisCluster
                    ? "Use the USCIS Notice Decoder — select your notice type and form for plain-English guidance."
                    : "Use the USCIS Case Status Meaning Tool — select your form type and current status for plain-English guidance."}
                </p>
                <Link
                  href={
                    isLifePlanningCluster
                      ? "/tools/uscis-life-decision-checklist"
                      : isMyuscisCluster
                      ? "/tools/uscis-notice-decoder"
                      : "/tools/uscis-case-status-meaning"
                  }
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {isLifePlanningCluster
                    ? "Try the Life Decision Checklist →"
                    : isMyuscisCluster
                    ? "Try the Notice Decoder →"
                    : "Try the tool →"}
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
                NRItoUSA is not affiliated with USCIS or any US government agency.
              </div>

              {/* Back link */}
              <div className="mx-auto mt-6 max-w-[720px] text-sm">
                <Link
                  href={backHref}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  {backLabel}
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </article>

      {/* ── Sibling navigation (case status cluster only) ────────────────────── */}
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
