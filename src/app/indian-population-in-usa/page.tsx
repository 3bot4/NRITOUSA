import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import IndianPopulationExplorer from "@/components/IndianPopulationExplorer";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { author } from "@/lib/author";
import {
  INDIAN_POP_UPDATED,
  INDIAN_POP_UPDATED_HUMAN,
  INDIAN_POP_PUBLISHED,
  quickStats,
  keyStates,
  majorMetros,
  growthTimeline,
  stateTable,
  demographics,
  incomeBands,
  incomeNote,
  occupations,
  occupationNote,
  visaStatus,
  communities,
  communitiesDisclaimer,
  economyPoints,
  economyCaveat,
  worldComparison,
  worldNote,
  faqs,
  sources,
  methodology,
} from "@/data/indianPopulationData";

const PATH = "/indian-population-in-usa";
const TITLE =
  "How Many Indians Live in America? Indian Population in USA by State";
const DESC =
  "See how many Indians live in America, where Indian Americans live by state and city, income levels, occupations, education, visa status, student trends, and economic contribution to the U.S.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: PATH,
  socialTitle:
    "How Many Indians Live in America? Indian Population in USA by State, Income & Visa Status",
});

const TOC = [
  { id: "answer", label: "Quick answer" },
  { id: "explorer", label: "Population explorer" },
  { id: "by-state", label: "Population by state" },
  { id: "growth", label: "Growth timeline" },
  { id: "demographics", label: "Demographics" },
  { id: "income", label: "Income levels" },
  { id: "jobs", label: "Occupations" },
  { id: "visa", label: "Visa & status" },
  { id: "communities", label: "Communities by region" },
  { id: "economy", label: "Economic contribution" },
  { id: "world", label: "USA vs the world" },
  { id: "faq", label: "FAQ" },
  { id: "sources", label: "Sources" },
];

/* ------------------------------------------------------------------ *
 * Static SVG line chart for the population growth timeline
 * ------------------------------------------------------------------ */
function GrowthChart() {
  const W = 640;
  const H = 260;
  const padX = 48;
  const padY = 32;
  const years = growthTimeline.map((p) => p.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const maxVal = 5.5;
  const x = (year: number) =>
    padX + ((year - minYear) / (maxYear - minYear)) * (W - padX * 2);
  const y = (val: number) => H - padY - (val / maxVal) * (H - padY * 2);
  const line = growthTimeline
    .map((p) => `${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(" ");
  const area = `${padX},${H - padY} ${line} ${(W - padX).toFixed(1)},${H - padY}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Line chart of the Indian population in the USA growing from about 1.8 million in 2000 to about 4.9 million in 2023."
      className="w-full"
    >
      {[0, 1, 2, 3, 4, 5].map((g) => (
        <g key={g}>
          <line
            x1={padX}
            x2={W - padX}
            y1={y(g)}
            y2={y(g)}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <text x={padX - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#6b7280">
            {g}M
          </text>
        </g>
      ))}
      <polygon points={area} fill="#1e40f5" opacity={0.08} />
      <polyline
        points={line}
        fill="none"
        stroke="#1e40f5"
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {growthTimeline.map((p) => (
        <g key={p.year}>
          <circle cx={x(p.year)} cy={y(p.value)} r={5} fill="#1e40f5" />
          <text x={x(p.year)} y={y(p.value) - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#111827">
            {p.label}
          </text>
          <text x={x(p.year)} y={H - padY + 18} textAnchor="middle" fontSize="11" fill="#6b7280">
            {p.year}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Page() {
  const datasetJsonLd = {
    "@type": "Dataset",
    name: "Indian Population in the USA — key demographic estimates",
    description:
      "Rounded estimates of the Indian-origin population in the United States by national total, growth over time, state concentration, income, occupation, and visa status, compiled from Pew Research Center, the U.S. Census Bureau, and the Migration Policy Institute.",
    url: absoluteUrl(PATH),
    keywords: [
      "how many Indians in America",
      "Indian population in USA",
      "Indian American population by state",
      "Indian demographics USA",
    ],
    isAccessibleForFree: true,
    creator: { "@id": `${site.url}/#organization` },
    dateModified: INDIAN_POP_UPDATED,
    temporalCoverage: "2000/2023",
    spatialCoverage: "United States",
    variableMeasured: [
      "Indian-origin population",
      "Population growth rate",
      "State-level concentration",
      "Median household income (relative)",
    ],
  };

  const articleJsonLd = {
    "@type": "Article",
    headline: TITLE,
    description: DESC,
    datePublished: INDIAN_POP_PUBLISHED,
    dateModified: INDIAN_POP_UPDATED,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PATH) },
    image: absoluteUrl(site.ogImage),
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.jobTitle,
      url: absoluteUrl(author.url),
      sameAs: [author.linkedin],
    },
    publisher: { "@id": `${site.url}/#organization` },
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    datasetJsonLd,
    faqJsonLd(faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Indian Population in USA", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------------------------------------------------- Hero */}
      <header className="border-b border-ink-900/5 bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-8 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-ink-400"
          >
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/immigration" className="hover:text-brand-600">Immigration</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-600">Indian Population in USA</span>
          </nav>

          <h1 className="mt-4 max-w-4xl text-2xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            How Many Indians Live in America? Indian Population in USA by State,
            Income, Jobs &amp; Visa Status
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-base">
            A data-backed guide to Indian Americans, Indian immigrants, students,
            H-1B workers, green card holders, citizens, income levels,
            occupations, education, and where Indian communities are growing
            across the United States.
          </p>

          {/* Quick stats cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card"
              >
                <p className="text-2xl font-extrabold text-brand-600">{s.value}</p>
                <p className="mt-1 text-xs font-semibold text-ink-700">{s.label}</p>
                <p className="mt-1 text-[11px] leading-snug text-ink-400">{s.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-500">
            <p>
              <span className="font-semibold text-ink-700">Key states:</span>{" "}
              {keyStates.join(", ")}
            </p>
            <p>
              <span className="font-semibold text-ink-700">Major metros:</span>{" "}
              {majorMetros.join(" · ")}
            </p>
          </div>
          <p className="mt-3 text-xs text-ink-400">
            Last updated: {INDIAN_POP_UPDATED_HUMAN}
          </p>
        </Container>
      </header>

      {/* ---------------------------------------------------------- TOC */}
      <div className="border-b border-ink-900/5 bg-white">
        <Container className="py-4">
          <nav aria-label="On this page" className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {TOC.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="font-medium text-ink-500 hover:text-brand-600">
                {t.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* ---------------------------------------------------------- Answer-first */}
      <section id="answer" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
                Quick answer — how many Indians live in America?
              </p>
              <p className="mt-3 text-base leading-relaxed text-ink-800 sm:text-lg">
                As of the latest available U.S. demographic estimates, about{" "}
                <strong>4.9 million people</strong> in the United States identify
                as Indian alone or in combination with other races, ethnicities,
                or Asian origins. Census data also shows{" "}
                <strong>Asian Indian</strong> as one of the largest Asian-origin
                groups in America, with strong concentrations in California,
                Texas, New Jersey, New York, Illinois, Washington, and Georgia.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Sources: Pew Research Center analysis of 2021–2023 ACS/IPUMS, U.S.
                Census Bureau 2020 Census Asian population data, Migration Policy
                Institute, USCIS, Open Doors/IIE, and U.S. Census ACS tables where
                available.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Explorer */}
      <section id="explorer" className="scroll-mt-20 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Interactive"
            title="Indian Population in USA Explorer"
            sub="Select a state and a data category to see relative Indian-origin concentration, major metros, and community notes. Values are estimates and rankings, not exact counts, unless a source figure is cited."
          />
          <div className="mt-6">
            <IndianPopulationExplorer />
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- By state */}
      <section id="by-state" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Geography"
            title="Indian Population in USA by State"
            sub="Most Indians in America live in large job-market states and metro areas where technology, healthcare, finance, universities, and immigrant family networks are strong."
          />

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {stateTable.map((r) => (
              <div key={r.state} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink-900">{r.state}</p>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">{r.rank}</span>
                </div>
                <p className="mt-1.5 text-xs text-ink-600"><span className="font-semibold text-ink-500">Metros:</span> {r.metros}</p>
                <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Drivers:</span> {r.drivers}</p>
                <p className="mt-1 text-xs text-ink-500">{r.notes}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card md:block">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                  <th className="p-3 font-semibold">State</th>
                  <th className="p-3 font-semibold">Indian population rank</th>
                  <th className="p-3 font-semibold">Major metro areas</th>
                  <th className="p-3 font-semibold">Main community drivers</th>
                  <th className="p-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                {stateTable.map((r) => (
                  <tr key={r.state} className="align-top">
                    <td className="p-3 font-semibold text-ink-900">{r.state}</td>
                    <td className="p-3 font-medium text-brand-700">{r.rank}</td>
                    <td className="p-3 text-ink-600">{r.metros}</td>
                    <td className="p-3 text-ink-600">{r.drivers}</td>
                    <td className="p-3 text-ink-600">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Growth */}
      <section id="growth" className="scroll-mt-20 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Trend"
            title="Indian Population Growth Timeline"
            sub="The Indian-origin population roughly tripled between 2000 and 2023 — one of the fastest-growing origin groups in the country."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
              <GrowthChart />
            </div>
            <div className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
              <h3 className="text-sm font-bold text-ink-900">What the chart shows</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-600">
                {growthTimeline.map((p) => (
                  <li key={p.year} className="flex gap-2">
                    <span className="font-bold text-brand-600">{p.year}:</span>
                    <span>{p.label} — {p.basis}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">
                Different sources use different definitions: Asian Indian alone,
                Indian alone or in combination, Indian immigrants, Indian-born,
                and Indian-origin Americans are not exactly the same, so the line
                blends comparable-but-not-identical measures.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Demographics */}
      <section id="demographics" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Who they are"
            title="Indian Demographics in the U.S."
            sub="The Indian population in America spans U.S.-born citizens, immigrants, students, and workers. Exact breakdowns vary by source — the categories below use estimated, ranged language."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {demographics.map((d) => (
              <div key={d.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <h3 className="text-sm font-bold text-ink-900">{d.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{d.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Income */}
      <section id="income" className="scroll-mt-20 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Income"
            title="Indian Americans by Income Level"
            sub="Pew Research Center reports Indian American households have among the highest median household incomes of any Asian-origin group in the U.S."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
              <div className="space-y-4">
                {incomeBands.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-ink-800">{b.label}</span>
                    </div>
                    <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                        style={{ width: `${b.weight}%` }}
                        aria-hidden
                      />
                    </div>
                    <p className="mt-1 text-xs text-ink-500">{b.note}</p>
                  </div>
                ))}
              </div>
              <p className="sr-only">
                Illustrative income distribution: students and new immigrants make
                up a smaller lower-income share, with the bulk of Indian American
                households in middle and upper-middle income bands and a
                significant high-income group in tech, medicine, finance, and
                business.
              </p>
            </div>
            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5 sm:p-6">
              <h3 className="text-sm font-bold text-brand-800">On income &amp; tax</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700">{incomeNote}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Jobs */}
      <section id="jobs" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Work"
            title="What Jobs Do Indians Do in America?"
            sub="Indian Americans are highly represented in professional and technical fields. The clusters below are ranked qualitatively — they are common occupational patterns, not exact employment percentages."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {occupations.map((o) => (
              <div key={o.label} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-ink-900">
                    <span aria-hidden>{o.icon}</span> {o.label}
                  </h3>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${o.weight}%` }} aria-hidden />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{o.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-500">{occupationNote}</p>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Visa */}
      <section id="visa" className="scroll-mt-20 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Immigration"
            title="Indian Americans by Visa, Green Card, Student &amp; Citizenship Status"
            sub="Indian nationals receive a large share of H-1B visas and are one of the largest international student groups, while a growing number are green card holders and citizens."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visaStatus.map((v) => (
              <div key={v.title} className="flex flex-col rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <h3 className="text-sm font-bold text-ink-900">{v.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-600">{v.body}</p>
                {v.href && (
                  <Link href={v.href} className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    {v.linkLabel} →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <RelatedPill href="/h1b" label="H-1B Visa Guide" />
            <RelatedPill href="/h1b-layoff" label="H-1B Layoff Options" />
            <RelatedPill href="/green-card" label="Green Card" />
            <RelatedPill href="/visa-bulletin" label="Visa Bulletin" />
            <RelatedPill href="/eb2-eb3-priority-date-india" label="EB-2/EB-3 India Dates" />
            <RelatedPill href="/h1b-sponsors" label="H-1B Sponsor Finder" />
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Communities */}
      <section id="communities" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Origins"
            title="Where Do Indians in America Come From?"
            sub="Indian Americans trace to many regions and languages of India. Exact U.S. data by Indian state of origin is limited, so this describes common community patterns."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {communities.map((c) => (
              <div key={c.group} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-ink-900">{c.group} communities</h3>
                  <span className="text-[11px] font-medium text-ink-400">{c.origin}</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-ink-900/10 bg-ink-50/60 p-3 text-xs leading-relaxed text-ink-500">
            {communitiesDisclaimer}
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Economy */}
      <section id="economy" className="scroll-mt-20 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Impact"
            title="How Do Indians Contribute to the U.S. Economy?"
            sub="Indian Americans are a small share of the U.S. population but have an outsized presence in technology, medicine, education, entrepreneurship, and high-skilled immigration."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {economyPoints.map((e) => (
              <div key={e.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <h3 className="text-sm font-bold text-ink-900">{e.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{e.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-accent-500/30 bg-accent-400/10 p-3 text-xs leading-relaxed text-ink-600">
            <span className="font-semibold text-ink-800">Note on tax contribution:</span>{" "}
            {economyCaveat}
          </p>
        </Container>
      </section>

      {/* ---------------------------------------------------------- World */}
      <section id="world" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <SectionHead
            eyebrow="Comparison"
            title="Indian Population in USA vs Canada, UK &amp; the World"
            sub="The U.S. hosts one of the largest Indian diasporas, but Indians are a major community worldwide."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {worldComparison.map((w) => (
              <div key={w.country} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <h3 className="text-sm font-bold text-ink-900">{w.country}</h3>
                <p className="mt-1 text-lg font-extrabold text-brand-600">{w.value}</p>
                <p className="mt-1 text-[11px] leading-snug text-ink-500">{w.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-500">{worldNote}</p>
        </Container>
      </section>

      {/* ---------------------------------------------------------- FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <SectionHead eyebrow="FAQ" title="Indian Population in USA — Frequently Asked Questions" />
          <div className="mt-6 mx-auto max-w-3xl space-y-3">
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
        </Container>
      </section>

      {/* ---------------------------------------------------------- Sources */}
      <section id="sources" className="scroll-mt-20 py-10 sm:py-12">
        <Container>
          <SectionHead eyebrow="Methodology" title="Sources &amp; Methodology" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-2.5">
              {sources.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="block rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-brand-300"
                >
                  <p className="text-sm font-semibold text-brand-700">{s.label} ↗</p>
                  <p className="mt-1 text-xs text-ink-500">{s.note}</p>
                </a>
              ))}
            </div>
            <div className="rounded-2xl border border-ink-900/10 bg-ink-50/50 p-5">
              <h3 className="text-sm font-bold text-ink-900">How we compiled this</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-600">{methodology}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Author + related */}
      <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
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

          <div className="mx-auto mt-8 max-w-4xl">
            <h2 className="text-lg font-bold text-ink-900">Related guides</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { href: "/h1b", label: "H-1B Visa Guide for Indians", sub: "Sponsorship, lottery, and status basics." },
                { href: "/visa-bulletin", label: "Visa Bulletin Explained for Indians", sub: "Read priority dates and the green card queue." },
                { href: "/eb2-eb3-priority-date-india", label: "Green Card Backlog for Indians", sub: "EB-2 vs EB-3 India priority dates." },
                { href: "/indian-passport-renewal-usa", label: "Indian Passport Renewal in USA", sub: "Renew your Indian passport from the U.S." },
                { href: "/h1b-layoff", label: "H-1B Visa Layoff Options", sub: "The 60-day grace period and next steps." },
                { href: "/free-immigrant-wealth-guide", label: "Free Immigrant Wealth Guide", sub: "Money and planning for new immigrants." },
              ].map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-brand-300"
                >
                  <p className="text-sm font-bold text-ink-900">{r.label}</p>
                  <p className="mt-1 text-xs text-ink-500">{r.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Small presentational helpers
 * ------------------------------------------------------------------ */
function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-bold text-ink-900 sm:text-2xl">{title}</h2>
      {sub && <p className="mt-2 text-sm leading-relaxed text-ink-600">{sub}</p>}
    </div>
  );
}

function RelatedPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 font-semibold text-brand-600 transition hover:border-brand-300"
    >
      {label} →
    </Link>
  );
}
