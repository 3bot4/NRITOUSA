import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { bulletin, formatBulletinMonth } from "@/lib/visa-bulletin";
import {
  INDIAN_POP_UPDATED_HUMAN,
  CENSUS_STATE_DEFINITION,
} from "@/data/indianPopulationData";

/**
 * /press — the media and data page the analysis pages cite.
 *
 * It exists because /visa-bulletin/october-2026-predictions links here twice
 * (byline and citation box) and the route was a 404.
 *
 * Two attribution rules this page has to hold, because its whole job is making
 * citation correct:
 *  1. Data we maintain is described by what it actually is (source, definition,
 *     vintage), never as a headline figure a journalist might quote loosely.
 *  2. Reports from sister brands (LayoffNext, TaxSaveIQ, OptionLeo) are labelled
 *     as network work and linked to their own canonical URL, so nothing here
 *     gets mis-attributed to NRItoUSA.
 */

const MEDIA_EMAIL = "team@nritousa.com";
const MAILTO = `mailto:${MEDIA_EMAIL}?subject=Press%20%2F%20Data%20Inquiry%20-%20NRItoUSA`;

const TITLE = "Press & Data";
const META_TITLE = "Press & Data | NRItoUSA — Immigration and NRI Data for Journalists";
const DESCRIPTION =
  "Data, analysis, and expert comment for journalists covering Indian immigration to the US: visa bulletin history, H-1B sponsorship records, Census-based Indian population figures, and processing timelines. Same-day custom cuts available.";

export const metadata: Metadata = pageMetadata({
  title: META_TITLE,
  description: DESCRIPTION,
  path: "/press",
  socialTitle: TITLE,
});

/** What we hold, described so a journalist can judge whether it fits. */
const DATASETS = [
  {
    icon: "📅",
    name: "Visa Bulletin history",
    detail:
      "Every Final Action Date and Date for Filing by category and country of chargeability, month by month, from August 2021 to the current bulletin — 55 category/country series in all.",
    definition:
      "Transcribed from the published Department of State bulletins; step carry-forward applied so any month resolves to the cutoff in force.",
    cuts: "Movement by category, retrogression episodes, October reset comparisons, India vs China vs Rest of World.",
    href: "/visa-bulletin",
    hrefLabel: "See the live cluster",
  },
  {
    icon: "🏢",
    name: "H-1B sponsorship records",
    detail:
      "About 75,000 employer × occupation × state rows drawn from Labor Condition Application disclosures, with position counts, median wage and wage level.",
    definition:
      "LCA filings are requests to employ, not visas granted — they measure sponsorship demand, not approvals.",
    cuts: "Top sponsors by metro or occupation, wage distribution by SOC code, year-over-year sponsorship trend.",
    href: "/h1b-sponsors",
    hrefLabel: "See the sponsor finder",
  },
  {
    icon: "🗺️",
    name: "Indian population by state",
    detail:
      "State-level Indian-origin population with 2020 vs 2010 change, plus metro concentrations.",
    definition: `US Census — ${CENSUS_STATE_DEFINITION}.`,
    cuts: "Growth ranking by state, metro concentration, share of state population.",
    href: "/indian-population-in-usa",
    hrefLabel: "See the population data",
  },
  {
    icon: "⏱️",
    name: "Immigration processing timelines",
    detail:
      "PERM and prevailing-wage queues, I-140, I-485, EAD and Advance Parole, and green card renewal — maintained against DOL and USCIS published figures.",
    definition:
      "Government-published processing times and queue positions, refreshed on each agency update; sentinel-flagged when a source goes stale.",
    cuts: "Queue length over time, category comparison, employer-stage bottlenecks.",
    href: "/perm-timeline",
    hrefLabel: "See the timelines",
  },
];

/** Analyses we will stand behind on the record. */
const ANALYSES = [
  {
    title: "October 2026 Visa Bulletin: the FY2027 reset",
    body: "Why EB-2 India went Unavailable, what the October reset should restore, and the statutory math behind the annual cliff.",
    href: "/visa-bulletin/october-2026-predictions",
  },
  {
    title: "EB-2 & EB-3 India wait scenarios",
    body: "Illustrative wait ranges from historical movement — clearly labelled estimates, never forecasts.",
    href: "/eb2-eb3-priority-date-india",
  },
  {
    title: "Indian population in the United States",
    body: "Where the Indian-origin population lives and how it shifted between the 2010 and 2020 Censuses.",
    href: "/indian-population-in-usa",
  },
];

export default function PressPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Press & Data", url: "/press" },
  ];

  const jsonLd = jsonLdGraph(
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: "NRItoUSA",
      legalName: site.owner,
      url: site.url,
      email: MEDIA_EMAIL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site.ogImage),
        width: 1200,
        height: 630,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: MEDIA_EMAIL,
        contactType: "Press and Data Inquiries",
      },
      sameAs: [
        "https://www.taxsaveiq.com",
        "https://www.layoffnext.com",
        "https://www.optionleo.com",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${site.url}/press#webpage`,
      url: `${site.url}/press`,
      name: META_TITLE,
      description: DESCRIPTION,
      inLanguage: "en-US",
    },
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-ink-900/5 bg-gradient-to-b from-brand-50/70 to-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-[760px]">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-600">
              For journalists &amp; researchers
            </p>
            <h1 className="mt-2 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">
              Press &amp; Data
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-600">
              We maintain structured data on Indian immigration to the United
              States — visa bulletin history, sponsorship records, Census
              population figures and processing queues — and we cut it to order
              for reporters, usually the same day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={MAILTO}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Request a data cut →
              </a>
              <Link
                href="/about-deepak"
                className="inline-flex items-center gap-2 rounded-lg border border-ink-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
              >
                Source background
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-500">
              {MEDIA_EMAIL} · Current bulletin on file:{" "}
              <strong className="font-semibold text-ink-700">
                {formatBulletinMonth(bulletin.month)}
              </strong>
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mx-auto max-w-[860px] py-12">
          {/* ── datasets ───────────────────────────────────────────────────── */}
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            Data we maintain
          </h2>
          <p className="mt-2 text-ink-600">
            Each set below is described by what it actually measures, because
            the distinction usually matters to the story.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {DATASETS.map((d) => (
              <div
                key={d.name}
                className="flex flex-col rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span aria-hidden className="text-xl">
                    {d.icon}
                  </span>
                  <h3 className="text-base font-bold text-ink-900">{d.name}</h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {d.detail}
                </p>
                <p className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                  <strong className="font-semibold">What it is: </strong>
                  {d.definition}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-500">
                  <strong className="font-semibold text-ink-700">
                    Cuts we can run:{" "}
                  </strong>
                  {d.cuts}
                </p>
                <Link
                  href={d.href}
                  className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {d.hrefLabel} →
                </Link>
              </div>
            ))}
          </div>

          {/* ── featured network report ────────────────────────────────────── */}
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
            Featured report
          </h2>
          <p className="mt-2 text-ink-600">
            Published by <strong>LayoffNext</strong>, a sister publication in the
            same portfolio. Cite it to LayoffNext, not to NRItoUSA.
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 to-brand-800 px-6 py-5 text-white">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white/70">
                LayoffNext · 2026 Report
              </p>
              <h3 className="mt-1.5 text-xl font-extrabold leading-snug">
                H-1B Layoffs vs Overall Layoffs, 2026
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                How much of the 2026 tech layoff wave landed on visa holders —
                estimated from layoff trackers and USCIS petition data.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-ink-900/10 sm:grid-cols-4">
              {[
                { n: "164K–186K", l: "US tech workers laid off, 2026 YTD" },
                { n: "9.3K–12.3K", l: "Estimated H-1B workers among them" },
                { n: "6–7%", l: "Estimated H-1B exposure rate" },
                { n: "406,348", l: "FY2025 H-1B petitions approved" },
              ].map((s) => (
                <div key={s.l} className="bg-white px-4 py-3.5">
                  <div className="text-lg font-extrabold leading-none tracking-tight text-ink-900">
                    {s.n}
                  </div>
                  <div className="mt-1.5 text-[0.6875rem] leading-snug text-ink-500">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-5">
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                <strong className="font-semibold">Read the figures correctly: </strong>
                no public dataset identifies laid-off workers by visa status. The
                report models exposure from layoff counts and petition data and
                labels its own numbers directional estimates, not counts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.layoffnext.com/reports/h1b-layoffs-vs-overall-layoffs-2026"
                  rel="noopener"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Read the full report ↗
                </a>
                <a
                  href="https://www.layoffnext.com/reports/layoffnext-h1b-layoffs-vs-overall-layoffs-2026.pdf"
                  rel="noopener"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
                >
                  ⬇ Download PDF
                </a>
              </div>
              <p className="mt-3 text-xs text-ink-400">
                Sources cited in the report: Layoffs.fyi, TrueUp, SkillSyncer,
                USCIS H-1B data and WARN notices.
              </p>
            </div>
          </div>

          {/* ── analyses ───────────────────────────────────────────────────── */}
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
            Analysis we will stand behind
          </h2>
          <div className="mt-5 space-y-3">
            {ANALYSES.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="block rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <h3 className="text-base font-bold text-ink-900">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  {a.body}
                </p>
              </Link>
            ))}
          </div>

          {/* ── how to cite ────────────────────────────────────────────────── */}
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
            How to cite us
          </h2>
          <div className="mt-4 rounded-2xl border border-ink-900/10 bg-ink-50/60 p-5">
            <p className="text-sm leading-relaxed text-ink-600">
              Attribute analysis to <strong>NRItoUSA</strong> and name the
              underlying source where the figure is a government one — most of
              what we publish is a transcription or a calculation on top of
              Department of State, USCIS, DOL or Census data, and the story is
              usually better with the primary source named.
            </p>
            <code className="mt-3 block rounded-lg border border-ink-900/10 bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-700">
              &ldquo;NRItoUSA analysis of U.S. Department of State Visa Bulletin
              data, {formatBulletinMonth("2021-08")}–
              {formatBulletinMonth(bulletin.month)}.&rdquo;
            </code>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Population figures should carry the Census definition and vintage
              ({CENSUS_STATE_DEFINITION}; last verified{" "}
              {INDIAN_POP_UPDATED_HUMAN}). H-1B figures should say
              &ldquo;sponsorship filings&rdquo; rather than &ldquo;visas,&rdquo;
              since LCAs are requests to employ.
            </p>
          </div>

          {/* ── contact ────────────────────────────────────────────────────── */}
          <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50/50 p-6">
            <h2 className="text-xl font-bold text-ink-900">
              Requests and interviews
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Custom cuts by category, priority date, employer, occupation or
              state — usually same day. We are also available for background and
              on-the-record comment on Indian immigration, the visa bulletin, and
              cross-border tax questions.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={MAILTO}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Email {MEDIA_EMAIL}
              </a>
              <Link
                href="/partnerships"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Partnerships →
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              NRItoUSA is published by {site.owner}. We publish educational
              analysis, not legal advice, and we do not represent applicants.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
