import Link from "next/link";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import OfficialSourceNote from "@/components/OfficialSourceNote";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import { getArticle } from "@/lib/articles";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

/**
 * Shared template for the wealth / tax / India-money planning hubs linked from
 * the homepage repositioning section (NriWealthPlanning). Each hub is a curated
 * landing page over EXISTING articles, calculators, and tools — no duplicate
 * content is authored here. Visual language matches /long-term-nri-wealth:
 * gradient hero, a "what's covered" checklist, featured article cards, a related
 * tools strip, disclaimer, and the newsletter.
 */

export type HubTool = { label: string; href: string; kind: string };

export type MoneyHubConfig = {
  path: string;
  breadcrumb: string;
  icon: string;
  accent: string; // hero gradient e.g. "from-brand-600 to-indigo-700"
  title: string;
  intro: string;
  /** Bullet list of what the hub covers. */
  covers: string[];
  /** Article slugs surfaced as cards (filtered to those that exist). */
  articleSlugs: string[];
  /** Calculators / tools surfaced as a related strip. */
  tools: HubTool[];
  /** Primary in-hero CTA. */
  primaryCta: { label: string; href: string };
  /**
   * Deep-dive pillars that live at their own top-level route rather than under
   * /articles, so `articleSlugs` cannot reach them.
   *
   * Without this a pillar can sit in the sitemap at priority 0.9 with zero
   * inbound internal links — discoverable in theory, unsupported in practice.
   * Only link a guide a reader of THIS hub would actually want next; the point
   * is the contextual relevance, not the link count.
   */
  relatedGuides?: { label: string; href: string; blurb: string }[];
  /** Optional "Fast Answer" numbers snapshot shown under the hero. */
  snapshot?: {
    title: string;
    rows: { label: string; value: string; note?: string; highlight?: boolean }[];
    badges?: string[];
    lastVerified: string;
    sources: { label: string; href: string }[];
    disclaimer: string;
    ctaText?: string;
    ctaHref?: string;
  };
  /** Show the Return-to-India Playbook lead-magnet card under the hero. */
  showReturnToIndiaLeadMagnet?: boolean;
  /**
   * Substantive prose the hub itself owns, rendered ahead of the link lists.
   *
   * A hub whose whole body is cards and tiles has nothing to rank for and
   * nothing to say that its own articles do not say better. This slot is for
   * the material that belongs to the hub and to no single article beneath
   * it — usually the decision framework, the sequencing, or the irreversible
   * choice a reader has to get right before any of the guides are useful.
   * Keep it distinct from the articles: if a section would duplicate one of
   * them, link to it instead.
   */
  deepDive?: HubDeepDive;
};

export type HubDeepDiveBlock =
  /** Body paragraphs under an H3. */
  | { kind: "prose"; heading: string; paragraphs: string[] }
  /** A bulleted list under an H3; each item may lead with a bold lead-in. */
  | { kind: "list"; heading: string; intro?: string; items: { lead?: string; body: string }[] }
  /** A tinted callout, for the thing that costs money if missed. */
  | { kind: "callout"; tone: "warn" | "info" | "good"; heading: string; paragraphs: string[] }
  /** A simple table; `headers.length` must match each row's length. */
  | { kind: "table"; heading: string; intro?: string; headers: string[]; rows: string[][]; note?: string };

export type HubDeepDive = {
  eyebrow: string;
  title: string;
  description?: string;
  blocks: HubDeepDiveBlock[];
  /** Verified stamp + official links for any figure quoted in the blocks. */
  lastVerified?: string;
  sources?: { label: string; href: string }[];
  footnote?: string;
};

const CALLOUT_TONE: Record<"warn" | "info" | "good", string> = {
  warn: "border-amber-200 bg-amber-50/60",
  info: "border-blue-100 bg-blue-50/50",
  good: "border-emerald-200 bg-emerald-50/50",
};

/** Renders the hub's own prose. Plain server markup — no client JS. */
function DeepDive({ dd }: { dd: HubDeepDive }) {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow={dd.eyebrow} title={dd.title} description={dd.description} />
        <div className="mx-auto max-w-3xl space-y-8">
          {dd.blocks.map((b, i) => {
            if (b.kind === "prose") {
              return (
                <div key={i}>
                  <h3 className="text-lg font-bold text-ink-900">{b.heading}</h3>
                  {b.paragraphs.map((t, j) => (
                    <p key={j} className="mt-3 text-sm leading-relaxed text-ink-600">{t}</p>
                  ))}
                </div>
              );
            }
            if (b.kind === "list") {
              return (
                <div key={i}>
                  <h3 className="text-lg font-bold text-ink-900">{b.heading}</h3>
                  {b.intro && <p className="mt-3 text-sm leading-relaxed text-ink-600">{b.intro}</p>}
                  <ul className="mt-4 space-y-2">
                    {b.items.map((it, j) => (
                      <li key={j} className="text-sm leading-relaxed text-ink-600">
                        {it.lead && <strong className="text-ink-900">{it.lead} </strong>}
                        {it.body}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            if (b.kind === "callout") {
              return (
                <div key={i} className={`rounded-2xl border p-5 ${CALLOUT_TONE[b.tone]}`}>
                  <h3 className="text-base font-bold text-ink-900">{b.heading}</h3>
                  {b.paragraphs.map((t, j) => (
                    <p key={j} className="mt-2 text-sm leading-relaxed text-ink-700">{t}</p>
                  ))}
                </div>
              );
            }
            return (
              <div key={i}>
                <h3 className="text-lg font-bold text-ink-900">{b.heading}</h3>
                {b.intro && <p className="mt-3 text-sm leading-relaxed text-ink-600">{b.intro}</p>}
                {/* Wide tables scroll inside their own container, never the page body. */}
                <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10">
                  <table className="w-full min-w-[34rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 bg-slate-50/80 text-xs uppercase tracking-wide text-ink-500">
                        {b.headers.map((h) => (
                          <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, j) => (
                        <tr key={j} className="border-b border-ink-900/5 last:border-0">
                          {r.map((c, k) => (
                            <td key={k} className={`px-4 py-3 ${k === 0 ? "font-medium text-ink-800" : "text-ink-600"}`}>{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.note && <p className="mt-3 text-xs leading-relaxed text-ink-500">{b.note}</p>}
              </div>
            );
          })}

          {(dd.sources?.length || dd.lastVerified) && (
            <OfficialSourceNote lastVerified={dd.lastVerified} sources={dd.sources ?? []} />
          )}
          {dd.footnote && <p className="text-xs leading-relaxed text-ink-500">{dd.footnote}</p>}
        </div>
      </Container>
    </section>
  );
}

export default function MoneyHub({ config }: { config: MoneyHubConfig }) {
  const articles = config.articleSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // Additive structured data: a CollectionPage over the hub's curated links
  // (articles + tools) plus a Home > hub BreadcrumbList. Mirrors the visual
  // breadcrumb; no layout/content is changed. #website resolves against the
  // site-wide node emitted in the root layout.
  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(config.path)}#collection`,
      url: absoluteUrl(config.path),
      name: config.title,
      description: config.intro,
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...articles.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: articleUrl(a.slug),
            name: a.title,
          })),
          ...config.tools.map((t, i) => ({
            "@type": "ListItem",
            position: articles.length + i + 1,
            url: absoluteUrl(t.href),
            name: t.label,
          })),
        ],
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: config.breadcrumb, url: config.path },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section
        className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${config.accent}`}
      >
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-16 sm:py-24">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{config.breadcrumb}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              {config.icon}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              {config.title}
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            {config.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={config.primaryCta.href}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
            >
              {config.primaryCta.label}
            </Link>
            <Link
              href="/nri-wealth-checkup"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              NRI Wealth Checkup
            </Link>
          </div>
        </Container>
      </section>

      {/* Fast Answer snapshot (opt-in) */}
      {config.snapshot && (
        <section className="bg-ink-50/40 py-8">
          <Container>
            <FastAnswerSnapshot
              title={config.snapshot.title}
              accent="emerald"
              rows={config.snapshot.rows}
              badges={config.snapshot.badges}
              lastVerified={config.snapshot.lastVerified}
              sources={config.snapshot.sources}
              disclaimer={config.snapshot.disclaimer}
              ctaText={config.snapshot.ctaText}
              ctaHref={config.snapshot.ctaHref}
            />
          </Container>
        </section>
      )}

      {/* Return-to-India Playbook lead magnet (opt-in) */}
      {config.showReturnToIndiaLeadMagnet && (
        <section className="bg-white pt-10 sm:pt-14">
          <Container>
            <ReturnToIndiaLeadMagnetCard />
          </Container>
        </section>
      )}

      {/* What's covered */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What this covers" title="In this hub" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.covers.map((c) => (
              <div
                key={c}
                className="flex gap-3 rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                >
                  ✓
                </span>
                <p className="text-ink-700">{c}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The hub's own substance, ahead of the link lists */}
      {config.deepDive && <DeepDive dd={config.deepDive} />}

      {/* Featured guides */}
      {articles.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Start here"
              title="Guides for this topic"
              description="Plain-English walkthroughs of the rules, trade-offs, and numbers that matter."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related tools & calculators */}
      {config.tools.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Run the numbers"
              title="Tools & calculators"
              description="Free, no-signup calculators and checkers for this topic."
            />
            <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {config.tools.map((t) => (
                <Link
                  key={`${t.href}-${t.label}`}
                  href={t.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                      {t.kind}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-brand-600 transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* In-depth guides that live outside /articles */}
      {config.relatedGuides && config.relatedGuides.length > 0 && (
        <section className="bg-slate-50/60 py-14 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Go deeper"
              title="In-depth guides"
              description="Longer reads that answer the bigger decision behind this topic."
            />
            <div className="grid items-stretch gap-3 sm:grid-cols-2">
              {config.relatedGuides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <span className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
                    {g.label}
                  </span>
                  <span className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-500">
                    {g.blurb}
                  </span>
                  <span className="mt-3 text-xs font-semibold text-brand-600">
                    Read the guide{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

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
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
