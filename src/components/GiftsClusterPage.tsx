import Link from "next/link";
import Container from "@/components/Container";
import ArticleBody from "@/components/ArticleBody";
import Newsletter from "@/components/Newsletter";
import RecommendedToolsAd from "@/components/RecommendedToolsAd";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import PrintButton from "@/components/PrintButton";
import {
  giftsSnapshotRows,
  giftsTaxSources,
  INDIA_TAX_VERIFIED,
  INDIA_TAX_DISCLAIMER,
} from "@/data/siteWideVerifiedNumbers";
import {
  form3520Rules,
  indiaGiftRemittanceRules,
} from "@/data/foreignGiftRules";
import SectionHeading from "@/components/SectionHeading";
import { author as owner, authorInitials as ownerInitials } from "@/lib/author";
import { formatDate } from "@/lib/format";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  extractFaq,
  faqJsonLd,
  jsonLdGraph,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  GIFT_HUB_PATH,
  GIFT_HUB_TITLE,
  giftPath,
  giftPillar,
  giftSupportPages,
  type GiftPage,
} from "@/lib/giftsCluster";

/** Primary official sources shown on every retained cluster guide (Phase 7). */
const PRIMARY_SOURCES: { label: string; href: string }[] = [
  {
    label: "IRS — Gifts or bequests from foreign persons",
    href: form3520Rules.officialSourceUrls.largeGiftsOrBequests,
  },
  {
    label: "IRS — About Form 3520 & instructions",
    href: form3520Rules.officialSourceUrls.form3520Instructions,
  },
  {
    label: "IRS — International information reporting penalties",
    href: form3520Rules.officialSourceUrls.internationalPenalties,
  },
  {
    label: "RBI — Liberalised Remittance Scheme",
    href: indiaGiftRemittanceRules.officialSourceUrls.rbiLrs,
  },
  {
    label: "Income Tax Department (India) — TCS & Form 15CA/15CB",
    href: indiaGiftRemittanceRules.officialSourceUrls.incomeTaxTcs,
  },
];

/**
 * Renders one page of the "Parents, Gifts, Inheritance & Form 3520" cluster
 * (pillar or supporting). Sibling of components/RepatriationClusterPage.tsx —
 * same dense, no-hero article layout under the existing /india-tax-compliance
 * hub. The disclaimer points at both the IRS (US side: Form 3520 / FBAR / FATCA
 * / PFIC) and the Income Tax portal (India side), because this cluster spans
 * both systems. The pillar links down to every supporting page; each supporting
 * page links back up to the pillar and across to its siblings.
 */
export default function GiftsClusterPage({ page }: { page: GiftPage }) {
  const isPillar = page.kind === "pillar";
  const faqs = extractFaq(page.content);

  const navPages = isPillar
    ? giftSupportPages
    : [giftPillar, ...giftSupportPages.filter((p) => p.slug !== page.slug)];

  const crumbs = isPillar
    ? [
        { name: "Home", url: "/" },
        { name: GIFT_HUB_TITLE, url: GIFT_HUB_PATH },
        { name: "Gifts, Inheritance & Form 3520", url: giftPath(page.slug) },
      ]
    : [
        { name: "Home", url: "/" },
        { name: GIFT_HUB_TITLE, url: GIFT_HUB_PATH },
        {
          name: "Gifts, Inheritance & Form 3520",
          url: giftPath(giftPillar.slug),
        },
        { name: page.navLabel, url: giftPath(page.slug) },
      ];

  // Deepak Middha authors and reviews these guides. Reuse the persistent
  // about-deepak Person @id so the byline, reviewer, and profile page resolve
  // to one entity for E-E-A-T. Credentials are stated as-is (CA, Series 65) —
  // never represented as a US CPA or legal credential.
  const reviewer = {
    "@type": "Person",
    "@id": `${absoluteUrl(owner.url)}#person`,
    name: owner.name,
    jobTitle: owner.credentials,
    url: absoluteUrl(owner.url),
    sameAs: [owner.linkedin],
  };

  const articleNode = {
    "@type": "Article",
    "@id": `${absoluteUrl(giftPath(page.slug))}#article`,
    headline: page.h1 ?? page.title,
    description: page.excerpt,
    datePublished: page.date,
    dateModified: page.updated ?? page.date,
    author: reviewer,
    reviewedBy: reviewer,
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(giftPath(page.slug)),
    },
    url: absoluteUrl(giftPath(page.slug)),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const jsonLd = jsonLdGraph(
    articleNode,
    breadcrumbJsonLd(crumbs),
    ...(faqs.length ? [faqJsonLd(faqs)] : [])
  );

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
                  href={giftPath(giftPillar.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1 font-semibold text-white"
                >
                  <span aria-hidden>{page.icon}</span>
                  Gifts, Inheritance & Form 3520
                </Link>
                <span>{page.readingTime} min read</span>
                <span aria-hidden>·</span>
                <span>{formatDate(page.updated ?? page.date)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                {page.h1 ?? page.title}
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                {page.excerpt}
              </p>

              {/* E-E-A-T: author + reviewer + verification dates */}
              <div className="mt-5 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {ownerInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">
                      Reviewed by{" "}
                      <Link
                        href={owner.url}
                        className="text-brand-600 hover:text-brand-700"
                      >
                        {owner.byline}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-sm leading-[1.5] text-ink-500">
                      {owner.reviewerBio} Credentials shown are Indian (CA) and
                      US securities (Series 65); this is not US CPA or legal
                      advice.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
                      <span>Published {formatDate(page.date)}</span>
                      <span aria-hidden>·</span>
                      <span>Updated {formatDate(page.updated ?? page.date)}</span>
                      <span aria-hidden>·</span>
                      <span>
                        Rules verified {formatDate(form3520Rules.lastVerified)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                        <span aria-hidden>✓</span> Sources verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {page.showPrintButton && (
                <div className="mt-4">
                  <PrintButton />
                </div>
              )}
            </div>
          </Container>
        </header>

        {!page.hideSnapshot && (
          <div className="border-b border-ink-900/5 bg-ink-50/40 py-6">
            <Container>
              <FastAnswerSnapshot
                title={page.snapshotTitle ?? "Foreign gifts & inheritance — US reporting"}
                accent="brand"
                rows={page.snapshotRows ?? giftsSnapshotRows}
                badges={page.snapshotBadges ?? ["Form 3520 > $100k", "PFIC on Indian funds"]}
                lastVerified={INDIA_TAX_VERIFIED}
                sources={giftsTaxSources}
                disclaimer={INDIA_TAX_DISCLAIMER}
              />
            </Container>
          </div>
        )}

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto">
              <ArticleBody content={page.content} />

              {/* Primary official sources — explain the rule first (above), then
                  the government sources. New tab + rel=noopener noreferrer. */}
              <div className="mx-auto mt-10 max-w-[720px] rounded-2xl border border-ink-900/10 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Primary official sources
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Verify the current figures and mechanics against the source of
                  truth — thresholds and instructions change.
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {PRIMARY_SOURCES.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink-400">
                  Rules last verified {formatDate(form3520Rules.lastVerified)} ·
                  Reviewed on each material update.
                </p>
              </div>

              <div className="mx-auto mt-6 max-w-[720px] rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
                <strong className="font-semibold text-ink-700">
                  Educational disclaimer:
                </strong>{" "}
                This guide is for educational purposes only and is not financial,
                legal, or tax advice. {site.name} is owned by {site.owner}. The
                Form 3520 thresholds, PFIC rules, FBAR/FATCA thresholds, and
                Indian gift/inheritance taxability change over time and depend on
                your situation. Always confirm what applies to you with a
                qualified cross-border CPA (US side) and a Chartered Accountant
                (CA) (India side), and verify current rules with the{" "}
                <a
                  href="https://www.irs.gov"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  IRS
                </a>{" "}
                and on the official{" "}
                <a
                  href="https://www.incometax.gov.in"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  Income Tax portal
                </a>
                . See our{" "}
                <Link href="/disclaimer" className="text-brand-600 underline">
                  full disclaimer
                </Link>
                .
              </div>

              {!isPillar && (
                <div className="mx-auto mt-6 max-w-[720px] text-sm">
                  <Link
                    href={giftPath(giftPillar.slug)}
                    className="font-medium text-brand-600 hover:text-brand-700"
                  >
                    ← Back to the full gifts, inheritance &amp; Form 3520 guide
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      </article>

      {/* Cluster navigation */}
      {navPages.length > 0 && (
        <section className="no-print bg-white py-12 sm:py-14">
          <Container>
            <SectionHeading
              eyebrow="Keep reading"
              title={isPillar ? "Explore this cluster" : "More in this cluster"}
              action={{ label: "India Tax & Compliance", href: GIFT_HUB_PATH }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {navPages.map((p) => (
                <Link
                  key={p.slug}
                  href={giftPath(p.slug)}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                    >
                      {p.icon}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {p.kind === "pillar" ? "Overview" : "Guide"}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-semibold text-ink-900 group-hover:text-brand-700">
                    {p.navLabel}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Contextual partner tool — India tax & compliance hub → TaxSaveIQ. */}
      <div className="no-print">
        <RecommendedToolsAd
          category="tax"
          text={`${page.slug} ${page.title} ${page.excerpt}`}
          sourcePage={`india-tax-compliance/${page.slug}`}
        />

        <Newsletter />
      </div>
    </>
  );
}
