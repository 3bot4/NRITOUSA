import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";
import { getArticle } from "@/lib/articles";
import {
  TAX_COMPLIANCE_PATH,
  TAX_COMPLIANCE_TITLE,
  TAX_TOPIC_GROUPS,
  TAX_TOPIC_SLUGS,
  taxComplianceCalculators,
  taxComplianceTools,
} from "@/lib/taxCompliance";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  ITR_CLUSTER_SECTION,
  itrPath,
  itrPillar,
  itrSupportPages,
} from "@/lib/itrCluster";
import {
  TDS_CLUSTER_SECTION,
  tdsPath,
  tdsPillar,
  tdsSupportPages,
} from "@/lib/tdsCluster";

const title = "India Tax & Compliance for US NRIs";
const description =
  "The cross-border tax hub for NRIs in the USA: calculators for property gains, remittance TCS, and RNOR; an FBAR/FATCA checker; and DTAA guides.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: TAX_COMPLIANCE_PATH,
});

/** Resolve article slugs to real articles, dropping any that don't exist. */
function resolve(slugs: string[]) {
  return slugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
}

export default function IndiaTaxCompliancePage() {
  const calcs = taxComplianceCalculators();
  const tools = taxComplianceTools();
  const topicArticles = resolve(TAX_TOPIC_SLUGS);

  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(TAX_COMPLIANCE_PATH)}#collection`,
      name: title,
      description,
      url: absoluteUrl(TAX_COMPLIANCE_PATH),
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...calcs.map((c) => ({
            url: absoluteUrl(`/calculators/${c.slug}`),
            name: c.title,
          })),
          ...tools.map((t) => ({
            url: absoluteUrl(`/tools/${t.slug}`),
            name: t.title,
          })),
          ...topicArticles.map((a) => ({
            url: articleUrl(a.slug),
            name: a.title,
          })),
        ].map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: item.url,
          name: item.name,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: TAX_COMPLIANCE_TITLE, url: TAX_COMPLIANCE_PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-rose-500 to-pink-600">
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-12 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{TAX_COMPLIANCE_TITLE}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              🧾
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              India Tax &amp; Compliance
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            One place for the tax side of your India–US money: when you become a
            US tax resident, what India can still tax, how the DTAA stops double
            taxation, and how to report Indian accounts, property sales, and
            remittances correctly. Start with a calculator, then dig into the
            topic guides.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculators/india-property-capital-gains"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
            >
              Estimate property-sale tax
            </Link>
            <Link
              href="#tax-topics"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Browse all tax topics
            </Link>
          </div>
        </Container>
      </section>

      {/* NRI Wealth & Tax Organizer entry point */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <Link
            href="/nri-wealth-checkup"
            className="group flex flex-col gap-2 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Free organizer
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                NRI Global Wealth &amp; Tax Organizer
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Add your India and U.S. assets and income once, then get an educational FBAR, FATCA,
                PFIC, foreign tax credit, and India-ITR checklist with questions for your CPA/CA.
              </p>
            </div>
            <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
              Start your checkup{" "}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </Container>
      </section>

      {/* India ITR Filing from USA — new cluster */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow={ITR_CLUSTER_SECTION.eyebrow}
            title={ITR_CLUSTER_SECTION.title}
            description={ITR_CLUSTER_SECTION.description}
            action={{ label: "Start the guide", href: itrPath(itrPillar.slug) }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={itrPath(itrPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${itrPillar.accent} text-2xl shadow-sm`}
              >
                {itrPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  NRI ITR Filing from USA: Forms, Deadlines, TDS Refunds &amp;
                  Documents
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  {itrPillar.excerpt}
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-rose-600 group-hover:text-rose-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {itrSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={itrPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* TDS Refunds & Lower TDS for NRIs — new cluster */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow={TDS_CLUSTER_SECTION.eyebrow}
            title={TDS_CLUSTER_SECTION.title}
            description={TDS_CLUSTER_SECTION.description}
            action={{ label: "Start the guide", href: tdsPath(tdsPillar.slug) }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={tdsPath(tdsPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${tdsPillar.accent} text-2xl shadow-sm`}
              >
                {tdsPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  NRI TDS Refund from USA: NRO Interest, Property Sale, DTAA &amp;
                  Form 13
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Banks and buyers often deduct TDS before your final tax is
                  known. Learn how NRO interest, rent, property-sale TDS, DTAA
                  paperwork, Form 13, and Indian ITR filing connect.
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-teal-600 group-hover:text-teal-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tdsSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={tdsPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {/* Interactive checklist tool card */}
            <Link
              href="/tools/nri-tds-refund-checklist"
              className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-lg shadow-sm"
                >
                  ✅
                </span>
                <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                  Tool
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                TDS refund checklist
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                Map your income type and what was deducted, then get a document
                checklist, likely next step, and CA questions.
              </p>
              <span className="mt-2.5 text-xs font-semibold text-brand-600">
                Open{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Free wealth-guide lead magnet */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-[#101a3a] to-ink-800 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-2xl shadow-sm"
                >
                  📘
                </span>
                <div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
                    Free PDF
                  </span>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-white">
                    Free Immigrant Wealth Guide
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/70">
                    Download Deepak Middha&apos;s practical PDF guide on the
                    money traps that hold immigrants back — and how to start
                    building wealth in the U.S.
                  </p>
                </div>
              </div>
              <Link
                href="/free-immigrant-wealth-guide"
                className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:bg-white/90"
              >
                Download the free guide →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Calculators + Tools — compact, glanceable cards */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Calculators & tools"
            title="Run the numbers, then check compliance"
            description="The decisions that move the most money — capital gains, repatriation, residency timing, transfer costs, and foreign-account reporting."
            action={{ label: "All calculators", href: "/calculators" }}
          />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {calcs.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${c.accent} text-lg shadow-sm`}
                  >
                    {c.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Calculator
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {c.label}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {c.description}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${t.accent} text-lg shadow-sm`}
                  >
                    {t.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Tool
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {t.label}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {t.description}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Tax Topics — dense text cards, grouped */}
      <section id="tax-topics" className="scroll-mt-20 bg-slate-50/60 py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Tax topics"
            title="Cross-border tax, explained"
            description="Every India–US tax guide, grouped by the question you're trying to answer."
            action={{ label: "More tax guides", href: "/topics/taxes" }}
          />
          <div className="space-y-8">
            {TAX_TOPIC_GROUPS.map((group) => {
              const items = resolve(group.slugs);
              if (items.length === 0) return null;
              return (
                <div key={group.title}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-base font-bold tracking-tight text-ink-900">
                      {group.title}
                    </h3>
                    <p className="text-xs text-ink-400">{group.description}</p>
                  </div>
                  <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/articles/${a.slug}`}
                        className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                      >
                        <h4 className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                          {a.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                          {a.excerpt}
                        </p>
                        <span className="mt-2.5 text-[0.6875rem] font-semibold text-brand-600">
                          Read guide{" "}
                          <span className="inline-block transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="bg-white pb-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Disclaimer:</strong>{" "}
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice. {site.name}{" "}
            is owned by {site.owner}. Cross-border rules differ between the USA
            and India, vary by state and by individual situation, and change over
            time. Please consult a qualified CPA, attorney, financial advisor,
            tax professional, or India-based professional for your situation. See
            our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              full disclaimer
            </Link>
            .
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink-500">
            Looking for visa and green card tools?{" "}
            <Link
              href="/tools"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Browse all tools <span aria-hidden>→</span>
            </Link>
          </p>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
