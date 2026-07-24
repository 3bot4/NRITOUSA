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
  occupations,
  economyPoints,
  sources,
  methodology,
  communitiesDisclaimer,
  INDIAN_POP_UPDATED,
  INDIAN_POP_UPDATED_HUMAN,
  INDIAN_POP_PUBLISHED,
  CENSUS_STATE_SOURCE,
  CENSUS_STATE_DEFINITION,
  CENSUS_STATE_LAST_VERIFIED,
  CENSUS_STATE_METHODOLOGY,
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

/** Exact-match FAQ set, answered directly first, built from the dataset. */
function buildFaqs(name: string, info: StateInfo, child: StateChild): FaqItem[] {
  const topCities = child.cities.slice(0, 4).join(", ");
  const groups = child.communityGroups.map((g) => g.group).join(", ");
  return [
    {
      question: `How many Indians live in ${name}?`,
      answer: `The 2020 Census counted about ${child.census.count2020.toLocaleString()} people as "Asian Indian alone" in ${name} (${child.census.pctOfState2020} of the state's population), ${child.census.rankNote.charAt(0).toLowerCase()}${child.census.rankNote.slice(1)} Broader definitions that include U.S.-born and mixed-heritage residents would show a higher number. Check the latest ACS tables at data.census.gov for the most current figure.`,
    },
    {
      question: `Which city in ${name} has the most Indians?`,
      answer: `The largest Indian communities in ${name} are concentrated around ${topCities}. These metros and suburbs have the densest Indian populations, businesses, temples, and cultural associations.`,
    },
    {
      question: `Where do most Indians live in ${name}?`,
      answer: `Most Indians in ${name} live in and around ${topCities}, clustered near major job markets, universities, and established immigrant neighborhoods rather than spread evenly across the state.`,
    },
    {
      question: `Why do Indians move to ${name}?`,
      answer: `Indians move to ${name} mainly for ${child.whyMove.slice(0, 3).join(", ").toLowerCase()}, plus established community and family networks. ${child.rankLine}`,
    },
    {
      question: `Are there many Indian students in ${name}?`,
      answer: `Yes. ${child.studentHubs}`,
    },
    {
      question: `What jobs do Indians do in ${name}?`,
      answer: `${info.occupation} Indian Americans here are highly represented in professional and technical fields, plus small business and hospitality.`,
    },
    {
      question: `Which Indian communities are common in ${name}?`,
      answer: `${name} has visible ${groups} communities, among others. These patterns are based on cultural associations, business communities, and settlement history — not official Indian-state-of-origin Census counts.`,
    },
    {
      question: `Is the Indian population in ${name} growing?`,
      answer: `Yes. Like the U.S. Indian-origin population overall — which grew about 174% from 2000 to 2023 — ${name}'s Indian community has been growing, driven by work visas, students, and family immigration.`,
    },
    {
      question: `How does ${name} compare with the Indian population in USA?`,
      answer: `${child.rankLine} Nationally, about 4.9 million people identify as Indian-origin. See the Indian population in USA pillar guide for the full state-by-state picture.`,
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
 * Shared internal-link map (only routes that actually exist)
 * ------------------------------------------------------------------ */

const IMMIGRATION_LINKS = [
  { href: "/h1b", label: "H-1B Visa Guide" },
  { href: "/tools/h1b-sponsor-finder", label: "H-1B Sponsor Finder" },
  { href: "/h1b-layoff", label: "H-1B Layoff Options" },
  { href: "/visa-bulletin", label: "Visa Bulletin Explained for Indians" },
  { href: "/eb2-eb3-priority-date-india", label: "EB-2 / EB-3 India Dates" },
  { href: "/green-card", label: "Green Card basics" },
];

const RELATED_LINKS = [
  { href: "/indian-population-in-usa", label: "Indian population in USA" },
  { href: "/h1b", label: "H-1B Visa Guide" },
  { href: "/tools/h1b-sponsor-finder", label: "H-1B Sponsor Finder" },
  { href: "/visa-bulletin", label: "Visa Bulletin Explained for Indians" },
  { href: "/green-card", label: "Green Card basics" },
  { href: "/articles/moving-to-usa-from-india-checklist", label: "Moving to USA from India Checklist" },
  { href: "/india-tax-compliance", label: "India Tax Compliance" },
  { href: "/trump-account-h1b-immigrant-families", label: "Trump Accounts for H-1B Families" },
];

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function StatePopulationPage({ slug }: { slug: string }) {
  const { code, info, child } = resolve(slug);
  const name = info.name;
  const path = `/indian-population-in-${slug}`;
  const faqs = buildFaqs(name, info, child);

  const factSheet: { label: string; value: string }[] = [
    {
      label: "2020 Census (Asian Indian alone)",
      value: `≈${child.census.count2020.toLocaleString()} (${child.census.pctOfState2020} of ${name}'s population)`,
    },
    { label: "National rank by total count", value: `${child.census.rankLabel} — ${child.census.rankNote}` },
    { label: "Growth, 2010→2020 Census", value: `${child.census.growthLabel} (Asian Indian alone, same definition both years)` },
    { label: "Major Indian metro areas", value: info.metros },
    { label: "Common occupations", value: "IT, medicine, engineering, finance, business, academia" },
    { label: "Student / university hubs", value: child.cities.slice(0, 3).join(", ") + " area universities" },
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
            Indian Population in {name}: Cities, Jobs, Income, Students &amp; Community Trends
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-base">
            {child.intro}
          </p>
          <p className="mt-3 text-sm text-ink-600">
            For the national picture, see our pillar guide on the{" "}
            <Link href="/indian-population-in-usa" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
              Indian population in USA
            </Link>
            .
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
            The 2020 Census counted <strong>≈{child.census.count2020.toLocaleString()} people</strong> as
            &ldquo;Asian Indian alone&rdquo; in {name} — {child.census.pctOfState2020} of the
            state&apos;s population, and {child.census.rankLabel} nationally by that measure,
            up {child.census.growthLabel} from the 2010 Census. Broader definitions (Indian-origin,
            including U.S.-born and mixed-heritage residents) would count higher. {child.rankLine}
          </p>
        </div>
        <div className="mt-6">
          <FastAnswerSnapshot
            title={`${name} Census snapshot — Asian Indian alone`}
            accent="brand"
            rows={[
              { label: "2020 Census", value: `≈${child.census.count2020.toLocaleString()}`, note: `${child.census.pctOfState2020} of ${name}'s population` },
              { label: "2010 Census", value: `≈${child.census.count2010.toLocaleString()}`, note: "Same definition, for comparison" },
              { label: "Growth, 2010→2020", value: child.census.growthLabel, highlight: true, note: "One consistent Census definition — not mixed with other measures" },
              { label: "Approx. national rank", value: child.census.rankLabel, note: child.census.rankNote },
            ]}
            lastVerified={CENSUS_STATE_LAST_VERIFIED}
            sources={[
              CENSUS_STATE_SOURCE,
              { label: "U.S. Census Bureau — ACS", href: "https://www.census.gov/programs-surveys/acs" },
            ]}
            disclaimer={`Measure: ${CENSUS_STATE_DEFINITION}. ${CENSUS_STATE_METHODOLOGY}`}
          />
        </div>
      </Section>

      {/* 2. Where Indians live */}
      <Section id="cities" title={`Where Indians live in ${name}`} tinted>
        <p className="text-sm leading-relaxed text-ink-600">
          The largest Indian communities in {name} cluster around these cities and
          suburbs:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {child.cities.map((c) => (
            <span key={c} className="rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 shadow-sm">
              {c}
            </span>
          ))}
        </div>
      </Section>

      {/* 3. Why Indians move */}
      <Section id="why" title={`Why Indians move to ${name}`}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {child.whyMove.map((w) => (
            <li key={w} className="flex items-start gap-2 rounded-xl border border-ink-900/10 bg-white p-3 text-sm text-ink-700 shadow-card">
              <span className="mt-0.5 text-brand-600" aria-hidden>✓</span>
              {w}
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. Occupations */}
      <Section id="jobs" title={`Indian occupations in ${name}`} tinted>
        <p className="text-sm leading-relaxed text-ink-600">{info.occupation}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {occupations.slice(0, 6).map((o) => (
            <div key={o.label} className="rounded-xl border border-ink-900/10 bg-white p-3 shadow-card">
              <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
                <span aria-hidden>{o.icon}</span> {o.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-600">{o.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Students */}
      <Section id="students" title={`Indian students in ${name}`}>
        <p className="text-sm leading-relaxed text-ink-600">{child.studentHubs}</p>
        <p className="mt-2 text-xs text-ink-500">
          Student numbers use general patterns; check university and IIE Open Doors
          data for specific enrollment figures.
        </p>
      </Section>

      {/* 6. Visa & immigration */}
      <Section id="visa" title={`Visa and immigration patterns in ${name}`} tinted>
        <p className="text-sm leading-relaxed text-ink-600">
          {info.visa} Common statuses include H-1B and other work visas, F-1
          students on OPT/STEM OPT, green card holders (many in the India
          employment-based backlog), family-sponsored immigrants, and naturalized
          or U.S.-born citizens.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {IMMIGRATION_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 transition hover:border-brand-300">
              {l.label} →
            </Link>
          ))}
        </div>
      </Section>

      {/* 7. Communities */}
      <Section id="communities" title={`Indian communities by region in ${name}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {child.communityGroups.map((g) => (
            <div key={g.group} className="rounded-xl border border-ink-900/10 bg-white p-3 shadow-card">
              <p className="text-sm font-bold text-ink-900">{g.group} communities</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-600">{g.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl border border-ink-900/10 bg-ink-50/60 p-3 text-xs leading-relaxed text-ink-500">
          Community patterns are based on visible cultural associations, business
          communities, migration history, and metro-level settlement patterns, not
          official Indian-state-of-origin Census counts. {communitiesDisclaimer}
        </p>
      </Section>

      {/* 8. Economy */}
      <Section id="economy" title={`Indian economic contribution in ${name}`} tinted>
        <p className="text-sm leading-relaxed text-ink-600">{child.economy}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {economyPoints.slice(0, 6).map((e) => (
            <div key={e.title} className="rounded-xl border border-ink-900/10 bg-white p-3 shadow-card">
              <p className="text-sm font-bold text-ink-900">{e.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-600">{e.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. FAQ */}
      <Section id="faq" title={`Indian Population in ${name} — FAQ`}>
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

      {/* Sources & methodology */}
      <Section id="sources" title="Sources &amp; Methodology" tinted>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-2.5">
            {sources.slice(0, 5).map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="nofollow noopener noreferrer" className="block rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-brand-300">
                <p className="text-sm font-semibold text-brand-700">{s.label} ↗</p>
                <p className="mt-1 text-xs text-ink-500">{s.note}</p>
              </a>
            ))}
          </div>
          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
            <p className="text-xs leading-relaxed text-ink-600">
              This page uses public demographic sources and rounded estimates.
              Definitions vary: Asian Indian alone, Indian alone or in combination,
              Indian-origin, Indian-born, Indian immigrant, and Indian American are
              not the same category. State and metro estimates should be checked
              against the latest ACS tables before citing as exact numbers. {methodology}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-600">
              <strong className="font-semibold text-ink-800">State Census snapshot methodology: </strong>
              {CENSUS_STATE_METHODOLOGY}
            </p>
          </div>
        </div>
      </Section>

      {/* Related + author */}
      <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-bold text-ink-900">Related guides</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {RELATED_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 shadow-sm transition hover:border-brand-300">
                  {l.label} →
                </Link>
              ))}
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
