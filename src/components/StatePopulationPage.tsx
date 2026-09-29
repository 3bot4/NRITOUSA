import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  states,
  stateChild,
  INDIAN_POP_UPDATED,
  INDIAN_POP_UPDATED_HUMAN,
  INDIAN_POP_PUBLISHED,
  CENSUS_STATE_SOURCE,
  CENSUS_STATE_LAST_VERIFIED,
  type StateInfo,
  type StateChild,
} from "@/data/indianPopulationData";

/* ------------------------------------------------------------------ *
 * Data resolution
 * ------------------------------------------------------------------ */

interface Resolved {
  code: string;
  info: StateInfo;
  child: StateChild;
}

function resolve(slug: string): Resolved {
  const code = Object.keys(stateChild).find((c) => stateChild[c].slug === slug);
  if (!code) throw new Error(`Unknown Indian-population state slug: ${slug}`);
  const info = states.find((s) => s.code === code);
  if (!info) throw new Error(`No StateInfo for code: ${code}`);
  return { code, info, child: stateChild[code] };
}

/**
 * FAQ set built entirely from this state's own fields.
 *
 * Deliberately avoids shared boilerplate sentences: an answer that reads the
 * same on eleven state pages is duplicate content, and these pages compete
 * with each other in the same result set. Every answer below resolves to
 * per-state data (census numbers, anchors, employers, moneyNote) — the only
 * constant is the question phrasing, which is what people actually search.
 */
function buildFaqs(name: string, info: StateInfo, child: StateChild): FaqItem[] {
  const anchor = child.anchors[0];
  const groups = child.communityGroups.map((g) => g.group).join(", ");
  const firstGroup = child.communityGroups[0];
  return [
    {
      question: `How many Indians live in ${name}?`,
      answer: `The 2020 Census counted ${child.census.count2020.toLocaleString()} people as "Asian Indian alone" in ${name} — ${child.census.pctOfState2020} of the state, up from ${child.census.count2010.toLocaleString()} in 2010. ${child.census.rankNote}`,
    },
    {
      question: `Where do most Indians live in ${name}?`,
      answer: `${child.cities.slice(0, 3).join(", ")} hold the densest communities. ${anchor.place} is the commercial centre: ${anchor.note.charAt(0).toLowerCase()}${anchor.note.slice(1)}`,
    },
    {
      question: `Why do Indians move to ${name}?`,
      answer: `${child.whyMove.slice(0, 3).join("; ")}. ${child.rankLine}`,
    },
    {
      question: `Who hires Indian professionals in ${name}?`,
      answer: child.employers,
    },
    {
      question: `Are there many Indian students in ${name}?`,
      answer: child.studentHubs,
    },
    {
      question: `Which Indian communities are common in ${name}?`,
      answer: `${name} has visible ${groups} communities. ${firstGroup.group}: ${firstGroup.note.charAt(0).toLowerCase()}${firstGroup.note.slice(1)} These are settlement patterns, not Census counts — the Census does not record Indian state of origin.`,
    },
    {
      question: `Is the Indian population in ${name} growing?`,
      answer: `Yes — ${child.census.growthLabel} between the 2010 and 2020 Censuses on one consistent definition, from ${child.census.count2010.toLocaleString()} to ${child.census.count2020.toLocaleString()}.`,
    },
    {
      question: `What does living in ${name} cost an Indian family?`,
      answer: child.moneyNote,
    },
  ];
}

/* ------------------------------------------------------------------ *
 * Metadata helper (imported by each thin route file)
 * ------------------------------------------------------------------ */

export function stateMetadata(slug: string): Metadata {
  const { child } = resolve(slug);
  return pageMetadata({
    title: child.metaTitle,
    description: child.metaDesc,
    path: `/indian-population-in-${slug}`,
  });
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function StatePopulationPage({ slug }: { slug: string }) {
  const { info, child } = resolve(slug);
  const name = info.name;
  const path = `/indian-population-in-${slug}`;
  const faqs = buildFaqs(name, info, child);

  const factSheet: { label: string; value: string }[] = [
    {
      label: "2020 Census (Asian Indian alone)",
      value: `${child.census.count2020.toLocaleString()} — ${child.census.pctOfState2020} of ${name}'s population`,
    },
    { label: "National rank by total count", value: `${child.census.rankLabel} — ${child.census.rankNote}` },
    { label: "Growth, 2010→2020 Census", value: child.census.growthLabel },
    { label: "Major Indian metro areas", value: info.metros },
    { label: "Main employers", value: child.employers },
    { label: "University hubs", value: child.studentHubs },
    { label: "Community drivers", value: info.drivers },
    { label: "Best-known Indian areas", value: child.cities.slice(0, 5).join(", ") },
  ];

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      headline: child.metaTitle,
      description: child.metaDesc,
      datePublished: INDIAN_POP_PUBLISHED,
      dateModified: INDIAN_POP_UPDATED,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
      image: absoluteUrl(site.ogImage),
      author: {
        "@type": "Person",
        name: author.name,
        jobTitle: author.jobTitle,
        url: absoluteUrl(author.url),
        sameAs: [author.linkedin],
      },
      publisher: { "@id": `${site.url}/#organization` },
    },
    faqJsonLd(faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Indian Population in USA", url: "/indian-population-in-usa" },
      { name: `Indian Population in ${name}`, url: path },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <header className="border-b border-ink-900/5 bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-8 sm:py-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/immigration" className="hover:text-brand-600">Immigration</Link>
            <span aria-hidden>/</span>
            <Link href="/indian-population-in-usa" className="hover:text-brand-600">Indian Population in USA</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-600">{name}</span>
          </nav>

          <h1 className="mt-4 max-w-4xl text-2xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            Indian Population in {name}: Cities, Jobs, Income &amp; Community Trends
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-base">
            {child.intro}
          </p>
          <p className="mt-3 text-xs text-ink-400">Last updated: {INDIAN_POP_UPDATED_HUMAN}</p>
        </Container>
      </header>

      {/* Quick facts sheet (crawlable key-value HTML) */}
      <section className="py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-bold text-ink-900">
              Indian Population in {name} — Quick Facts
            </h2>
            <dl className="mt-4 divide-y divide-ink-900/5">
              {factSheet.map((f) => (
                <div key={f.label} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                  <dt className="text-sm font-semibold text-ink-700 sm:w-64 sm:shrink-0">{f.label}</dt>
                  <dd className="text-sm text-ink-600">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* 1. Quick answer */}
      <Section id="answer" title={`How many Indians live in ${name}?`}>
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <p className="text-sm leading-relaxed text-ink-800">
            The 2020 Census counted <strong>{child.census.count2020.toLocaleString()} people</strong> as
            &ldquo;Asian Indian alone&rdquo; in {name} — {child.census.pctOfState2020} of the
            state&apos;s population, and {child.census.rankLabel} nationally by that measure,
            up {child.census.growthLabel} from the 2010 Census. {child.rankLine}
          </p>
        </div>
        <div className="mt-6">
          <FastAnswerSnapshot
            title={`${name} Census snapshot — Asian Indian alone`}
            accent="brand"
            rows={[
              { label: "2020 Census", value: child.census.count2020.toLocaleString(), note: `${child.census.pctOfState2020} of ${name}'s population` },
              { label: "2010 Census", value: child.census.count2010.toLocaleString(), note: "Same definition, for comparison" },
              { label: "Growth, 2010→2020", value: child.census.growthLabel, highlight: true },
              { label: "Approx. national rank", value: child.census.rankLabel, note: child.census.rankNote },
            ]}
            lastVerified={CENSUS_STATE_LAST_VERIFIED}
            sources={[CENSUS_STATE_SOURCE]}
          />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          Both years use &ldquo;Asian Indian alone&rdquo;, so the growth figure is
          comparable; the rank is approximate. Full definitions and sources are on the{" "}
          <Link href="/indian-population-in-usa#sources" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            pillar guide
          </Link>
          .
        </p>
      </Section>

      {/* 2. Where Indians live */}
      <Section id="cities" title={`Where Indians live in ${name}`} tinted>
        <div className="flex flex-wrap gap-2">
          {child.cities.map((c) => (
            <span key={c} className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 shadow-sm">
              {c}
            </span>
          ))}
        </div>
      </Section>

      {/* 3. Where the community actually gathers — per-state anchors */}
      <Section id="anchors" title={`Indian neighbourhoods and commercial hubs in ${name}`}>
        <div className="space-y-3">
          {child.anchors.map((a) => (
            <div key={a.place} className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-card">
              <p className="text-sm font-bold text-ink-900">{a.place}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{a.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Why Indians move */}
      <Section id="why" title={`Why Indians move to ${name}`} tinted>
        <ul className="grid gap-2 sm:grid-cols-2">
          {child.whyMove.map((w) => (
            <li key={w} className="flex items-start gap-2 rounded-xl border border-ink-900/10 bg-white p-3 text-sm text-ink-700 shadow-card">
              <span className="mt-0.5 text-brand-600" aria-hidden>✓</span>
              {w}
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Jobs & employers */}
      <Section id="jobs" title={`Who hires Indian professionals in ${name}`}>
        <p className="text-sm leading-relaxed text-ink-700">{child.employers}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{info.occupation}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link href="/tools/h1b-sponsor-finder" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 transition hover:border-brand-300">
            See which {name} employers file the most H-1Bs →
          </Link>
        </div>
      </Section>

      {/* 6. Students */}
      <Section id="students" title={`Indian students in ${name}`} tinted>
        <p className="text-sm leading-relaxed text-ink-600">{child.studentHubs}</p>
      </Section>

      {/* 7. Cost of living / money */}
      <Section id="money" title={`What ${name} costs an Indian family`}>
        <p className="text-sm leading-relaxed text-ink-700">{child.moneyNote}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{child.economy}</p>
      </Section>

      {/* 8. Visa & immigration */}
      <Section id="visa" title={`Visa and immigration patterns in ${name}`} tinted>
        <p className="text-sm leading-relaxed text-ink-600">{info.visa}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link href="/h1b" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 transition hover:border-brand-300">
            H-1B Visa Guide →
          </Link>
          <Link href="/visa-bulletin" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 transition hover:border-brand-300">
            Visa Bulletin →
          </Link>
          <Link href="/green-card" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 transition hover:border-brand-300">
            Green Card basics →
          </Link>
        </div>
      </Section>

      {/* 9. Communities */}
      <Section id="communities" title={`Indian communities by region in ${name}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {child.communityGroups.map((g) => (
            <div key={g.group} className="rounded-xl border border-ink-900/10 bg-white p-3 shadow-card">
              <p className="text-sm font-bold text-ink-900">{g.group} communities</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-600">{g.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          Settlement patterns, not Census counts — the Census does not record Indian
          state of origin.
        </p>
      </Section>

      {/* 10. FAQ */}
      <Section id="faq" title={`Indian Population in ${name} — FAQ`} tinted>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.question} className="group rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
              <summary className="cursor-pointer list-none text-sm font-bold text-ink-900 marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {f.question}
                  <span className="text-ink-300 transition group-open:rotate-45" aria-hidden>+</span>
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Related + author */}
      <section className="border-t border-ink-900/5 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-bold text-ink-900">Next</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Link href="/indian-population-in-usa" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 shadow-sm transition hover:border-brand-300">
                Indian population in USA — the national picture →
              </Link>
              <Link href="/articles/moving-to-usa-from-india-checklist" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 shadow-sm transition hover:border-brand-300">
                Moving to USA from India checklist →
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <div className="flex flex-col gap-1.5 text-sm text-ink-600 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Written / reviewed by{" "}
                  <Link href="/about-deepak" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
                    {author.name}
                  </Link>
                  <span className="text-ink-400"> · {author.credentials}</span>
                </p>
                <p className="text-xs text-ink-400">Last updated: {INDIAN_POP_UPDATED_HUMAN}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Local section wrapper
 * ------------------------------------------------------------------ */
function Section({
  id,
  title,
  tinted,
  children,
}: {
  id: string;
  title: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-10 sm:py-12 ${tinted ? "border-t border-ink-900/5 bg-ink-50/40" : ""}`}
    >
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{title}</h2>
          <div className="mt-4">{children}</div>
        </div>
      </Container>
    </section>
  );
}
