import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import PriorityDateChecker from "@/components/tools/PriorityDateChecker";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { CURRENT_VISA_BULLETIN } from "@/lib/visaBulletinDates";
import {
  currentBulletinNote,
  getApplicableChart,
  getBulletinLabel,
} from "@/lib/visa-bulletin";
import { formatDate } from "@/lib/format";
import VisaBulletinAlert from "@/components/VisaBulletinAlert";
import Eb5SetAsidePanel from "@/components/Eb5SetAsidePanel";

const PAGE_PATH = "/visa-bulletin";
const PUBLISHED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Visa Bulletin Explained for Indians: How to Read It",
    description:
      "Visa bulletin explained: published the 8th–10th monthly. How to read the India EB-1/EB-2/EB-3 charts, dates for filing vs final action, and current dates.",
    path: PAGE_PATH,
    type: "article",
    openGraph: {
      publishedTime: PUBLISHED,
      modifiedTime: CURRENT_VISA_BULLETIN.lastUpdated,
    },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Visa Bulletin Guide", url: PAGE_PATH },
];

// Hub-level FAQs only — category-specific and process-specific questions are
// owned by the child pages (eb1/eb2/eb3-india, priority-date, final-action,
// retrogression, priority-date-current-what-next). Keeping the hub FAQ small
// avoids duplicating FAQPage content across the cluster.
const faqs: FaqItem[] = [
  {
    question: "What is the visa bulletin?",
    answer:
      "The visa bulletin is a monthly publication from the US Department of State that sets priority-date cutoffs for each employment-based (EB) and family-based category by country. For Indian applicants pursuing employment green cards, it determines when a priority date is current — which controls eligibility to file or receive approval of Form I-485 (adjustment of status).",
  },
  {
    question: "Why are the India visa bulletin dates so much further back than other countries?",
    answer:
      "US law limits each country of birth to 7% of the annual employment-based green cards. India accounts for far more than 7% of EB-2 and EB-3 demand, so unused demand piles up into a backlog measured in years to decades. Country of birth — not citizenship — determines which cutoff applies to you.",
  },
  {
    question: "Which chart lets me file I-485 — Final Action Dates or Dates for Filing?",
    answer:
      "Final Action Dates (Table A) always control when a green card can be approved. Dates for Filing (Table B) is an earlier cutoff that can let you file I-485 sooner and unlock EAD/Advance Parole — but only in months USCIS authorizes it. Confirm which chart USCIS is accepting for adjustment of status at uscis.gov/visabulletininfo, and see our Final Action Date vs Dates for Filing guide for the full comparison.",
  },
  {
    question: "How often does the visa bulletin change and where do I verify it?",
    answer:
      "The State Department publishes a new bulletin around the 8th–10th of each month for the following month, and dates can move forward, hold, or retrogress. Always verify the current month at travel.state.gov and confirm the USCIS filing chart at uscis.gov/visabulletininfo before making any filing decision.",
  },
  {
    question: "How do I read the visa bulletin?",
    answer:
      "Three steps: find your category row (EB-1, EB-2, or EB-3), read down the column for your country of birth — India for most readers here — and compare the date shown to your own priority date. If your priority date is earlier than the posted cutoff, you may act that month. 'C' means current with no backlog, and 'U' means no visa numbers are available at all that month.",
  },
  {
    question: "What does 'C' mean in the visa bulletin?",
    answer:
      "'C' stands for Current: there is no backlog for that category and country, so any priority date qualifies that month. Rest of World applicants often see 'C' in categories where India shows a date years in the past, because the 7% per-country cap only binds high-demand countries like India and China.",
  },
];

export default function VisaBulletinPage() {
  const url = absoluteUrl(PAGE_PATH);
  const bulletin = CURRENT_VISA_BULLETIN;

  const articleJsonLd = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: "Visa Bulletin for India: Current EB-1, EB-2 & EB-3 Dates",
    description:
      "The India visa bulletin hub — current EB-1, EB-2 and EB-3 Final Action and Filing dates, plus links to the specialist category guides and priority-date tools.",
    datePublished: PUBLISHED,
    dateModified: bulletin.lastUpdated,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords:
      "visa bulletin India, EB2 India priority date, EB3 India priority date, EB1 India priority date, final action date vs date of filing, priority date checker India, green card priority date India, retrogression meaning",
  };

  const jsonLd = jsonLdGraph(
    articleJsonLd,
    breadcrumbJsonLd(crumbs),
    faqJsonLd(faqs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">

        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="pt-8 mb-5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
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

        {/* hero */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-700 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              📅 Visa Bulletin Guide
            </span>
            <span>Updated {bulletin.month} {bulletin.year}</span>
          </div>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">
            Visa Bulletin Explained for Indians: How to Read the Charts
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-500">
            The monthly cutoff dates that control when Indian applicants can file or receive approval of an employment-based green card. This hub shows the current EB-1, EB-2 and EB-3 India dates at a glance, then routes you to the specialist guide for your category.
          </p>
          <ReviewedByline date={CURRENT_VISA_BULLETIN.lastUpdated} className="mt-4" />

          {/* Quick Answer */}
          <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Quick Answer
            </p>
            <p className="text-[0.95rem] leading-relaxed text-ink-800">
              The visa bulletin is a monthly Department of State chart, published around the{" "}
              <strong>8th–10th</strong> of each month, that lists cutoff dates by green card category and
              country of birth. Read it in three steps: find your <strong>category row</strong>{" "}
              (EB-1/EB-2/EB-3), read down the <strong>India column</strong>, and compare that date to your
              own priority date — if yours is <strong>earlier</strong>, you may act. Two charts exist:{" "}
              <strong>Final Action Dates</strong> (Table A) control approval, and{" "}
              <strong>Dates for Filing</strong> (Table B) control when you may submit an I-485 in the months
              USCIS accepts it. &quot;C&quot; means current with no backlog; &quot;U&quot; means no visas
              are available that month.
            </p>
          </div>

          {/* Key takeaways */}
          <div className="mt-5 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
            <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
              <li>• Check the new bulletin around the <strong>8th–10th</strong> of each month — it takes effect the <strong>following</strong> month.</li>
              <li>• Compare against <strong>two</strong> charts every time: Final Action Dates for approval, Dates for Filing for submitting the I-485.</li>
              <li>• Remember why India is slower: the <strong>7% per-country cap</strong> gives India roughly <strong>9,800</strong> employment green cards a year across all categories.</li>
              <li>• Read your date as a threshold — your priority date must be <strong>strictly earlier</strong> than the posted cutoff, and &quot;U&quot; means nobody is approved that month.</li>
              <li>• Confirm which chart USCIS accepts for adjustment of status each month at uscis.gov/visabulletininfo — it changes.</li>
            </ul>
          </div>

          {/* Opening keyword paragraph */}
          <p className="mt-5 text-base leading-relaxed text-ink-700">
            The visa bulletin explained in plain terms: it is the monthly Department of State publication
            that decides when an Indian applicant&apos;s green card can move forward. This guide is for
            H-1B workers, PERM and I-140 filers, and families trying to learn how to read the visa bulletin
            without wading through State Department formatting. The number that explains everything is the
            7% per-country cap — roughly 9,800 employment-based green cards a year for India across EB-1,
            EB-2, and EB-3 combined, against demand many times larger, which is why the India column moves
            in weeks while Rest of World shows &quot;C&quot;. Below: what the visa bulletin is and who
            publishes it, how to read the India charts step by step, the difference between dates for filing
            vs final action date, what &quot;current&quot; and &quot;unavailable&quot; mean, the live EB-1,
            EB-2 and EB-3 India dates for this month, and what to do the month your date is finally current.
          </p>
        </div>

        {/* standing alert (single source of truth) */}
        <VisaBulletinAlert className="mb-6" />

        {/* current-month bulletin note */}
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-5 text-sm leading-relaxed text-amber-900">
          {currentBulletinNote}
        </div>

        {/* ── At-a-glance overview + primary CTAs ─────────────────────────────── */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <p className="text-sm leading-relaxed text-ink-800">
            The visa bulletin sets monthly cutoff dates for green card approval by
            category (EB-1/EB-2/EB-3) and country. Your <strong>priority date</strong>{" "}
            must be <strong>earlier than</strong> the published cutoff to file or
            receive I-485 approval. Current EB-1, EB-2 and EB-3 India dates are in
            the tables below; open a category guide for full analysis.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
            <span>
              <strong className="font-semibold text-ink-800">USCIS filing chart this month:</strong>{" "}
              {getApplicableChart().label}
            </span>
            <span aria-hidden>·</span>
            <span>{getBulletinLabel()} bulletin, data verified {formatDate(CURRENT_VISA_BULLETIN.lastUpdated)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/tools/priority-date-checker"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Check my priority date →
            </Link>
            <Link
              href="/tools/green-card-tracker"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-800 transition hover:border-blue-300"
            >
              Estimate my wait
            </Link>
          </div>
        </div>

        {/* ── Cluster navigation: route to specialist pages ───────────────────── */}
        <nav aria-label="Visa bulletin guides" className="mb-10 rounded-2xl border border-ink-900/5 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">Jump to the right guide</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/visa-bulletin/eb1-india", label: "EB-1 India priority date & backlog" },
              { href: "/visa-bulletin/eb2-india", label: "EB-2 India priority date & backlog" },
              { href: "/visa-bulletin/eb3-india", label: "EB-3 India priority date & backlog" },
              { href: "/visa-bulletin/priority-date", label: "What is a priority date?" },
              { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Final Action Date vs Dates for Filing" },
              { href: "/visa-bulletin/retrogression", label: "Visa bulletin retrogression explained" },
              { href: "/visa-bulletin/priority-date-current-what-next", label: "Priority date current — what next" },
              { href: "/visa-bulletin/monthly-update", label: "How to track the monthly update" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                {l.label} →
              </Link>
            ))}
          </div>
        </nav>

        {/* ── SECTION 2: What is the visa bulletin? ──────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">What Is the Visa Bulletin?</h2>
          <p className="text-sm leading-relaxed text-ink-600 mb-4">
            The US Department of State publishes the visa bulletin around the 8th–10th of each month. It sets the priority date cutoffs for employment-based and family-based immigration for each country.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: "📋", title: "Published by", desc: "US Department of State (travel.state.gov)" },
              { icon: "📅", title: "Published when", desc: "Around the 8th–10th of each month, effective the following month" },
              { icon: "🎯", title: "What it controls", desc: "Whether your priority date is current for I-485 filing or approval" },
              { icon: "🌍", title: "Country-specific", desc: "India has different (usually slower) dates than the Rest of World due to per-country caps" },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{c.title}</p>
                  <p className="text-xs text-ink-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Why Indians should care ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Why Does the Visa Bulletin Matter So Much for Indians?</h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="font-semibold text-amber-900 mb-2">The per-country 7% cap creates massive India backlogs</p>
            <ul className="space-y-1.5 text-sm text-amber-800">
              <li>• US immigration law limits each country to 7% of annual employment-based green cards</li>
              <li>• India accounts for far more than 7% of EB-2 and EB-3 applicants — creating a severe backlog</li>
              <li>• India EB-2 is Unavailable in the July 2026 bulletin (no numbers for the rest of FY 2026); new applicants face multi-decade waits when numbers return</li>
              <li>• The visa bulletin determines whether you can file I-485 this month — or must wait years longer</li>
              <li>• Retrogression (dates moving backward) can delay green card approval even after I-485 is filed</li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 4: Priority date ────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">What Is a Priority Date and How Do You Find Yours?</h2>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-left">
                  <th className="px-4 py-3 font-semibold text-ink-700">Category</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">Priority date = ?</th>
                  <th className="px-4 py-3 font-semibold text-ink-700">Where to find it</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-2 / EB-3</td>
                  <td className="px-4 py-3 text-ink-700">Date PERM was filed with DOL</td>
                  <td className="px-4 py-3 text-ink-500">PERM receipt or I-140 approval notice (I-797)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink-800">EB-1 / EB-2 NIW</td>
                  <td className="px-4 py-3 text-ink-700">Date I-140 was filed with USCIS</td>
                  <td className="px-4 py-3 text-ink-500">I-140 receipt notice or approval notice</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/priority-date" className="text-brand-600 underline">Read the full priority date guide →</Link>
          </p>
        </section>

        {/* ── SECTION 5: Final Action Date ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">How Do You Read the Final Action Date (Table A)?</h2>
          <p className="text-sm text-ink-600 mb-4">
            The Final Action Date is the most important cutoff. Your priority date must be <strong>earlier than</strong> this date for USCIS to approve your green card. This date is always published — it is never optional. When a category shows <strong>&ldquo;U&rdquo; (Unavailable)</strong>, no visa numbers are authorized that month and no case can be approved regardless of priority date.
          </p>
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
            <p className="text-sm font-semibold text-ink-900 mb-2">Current Final Action Dates ({bulletin.month} {bulletin.year})</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-ink-50/50">
                    <th className="px-3 py-2 font-semibold text-ink-700">Category</th>
                    <th className="px-3 py-2 font-semibold text-ink-700">India</th>
                    <th className="px-3 py-2 font-semibold text-ink-700">Other countries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {(["EB1", "EB2", "EB3"] as const).map((cat) => (
                    <tr key={cat}>
                      <td className="px-3 py-2 font-medium text-ink-800">{cat}</td>
                      <td className="px-3 py-2 text-ink-700">
                        {bulletin.finalActionDates[cat].india === "C" ? "Current (C)" :
                         bulletin.finalActionDates[cat].india === "U" ? "Unavailable" :
                         bulletin.finalActionDates[cat].india}
                      </td>
                      <td className="px-3 py-2 text-ink-500">
                        {bulletin.finalActionDates[cat].other === "C" ? "Current (C)" :
                         bulletin.finalActionDates[cat].other === "U" ? "Unavailable" :
                         bulletin.finalActionDates[cat].other}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              Data from {bulletin.month} {bulletin.year} bulletin. Always verify at{" "}
              <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="underline">travel.state.gov</a>.
            </p>
          </div>
        </section>

        {/* ── SECTION 6: Dates for Filing ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Dates for Filing vs Final Action Date: What's the Difference?</h2>
          <p className="text-sm text-ink-600 mb-4">
            Table B shows earlier cutoff dates that sometimes allow you to file I-485 before Final Action Date is current — but only when USCIS authorizes it each month.
          </p>
          {bulletin.datesForFiling && (
            <div className="rounded-2xl border border-ink-900/5 bg-white p-5 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-ink-900">Dates for Filing ({bulletin.month} {bulletin.year})</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${bulletin.usingDatesForFiling ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {bulletin.usingDatesForFiling ? "USCIS authorized this month" : "USCIS not authorized this month"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-ink-50/50">
                      <th className="px-3 py-2 font-semibold text-ink-700">Category</th>
                      <th className="px-3 py-2 font-semibold text-ink-700">India</th>
                      <th className="px-3 py-2 font-semibold text-ink-700">Other countries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5">
                    {(["EB1", "EB2", "EB3"] as const).map((cat) => (
                      <tr key={cat}>
                        <td className="px-3 py-2 font-medium text-ink-800">{cat}</td>
                        <td className="px-3 py-2 text-ink-700">
                          {bulletin.datesForFiling![cat].india === "C" ? "Current (C)" :
                           bulletin.datesForFiling![cat].india === "U" ? "Unavailable" :
                           bulletin.datesForFiling![cat].india}
                        </td>
                        <td className="px-3 py-2 text-ink-500">
                          {bulletin.datesForFiling![cat].other === "C" ? "Current (C)" :
                           bulletin.datesForFiling![cat].other === "U" ? "Unavailable" :
                           bulletin.datesForFiling![cat].other}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <p className="text-xs text-ink-500">
            <Link href="/visa-bulletin/final-action-date-vs-date-of-filing" className="text-brand-600 underline">Full guide: Final Action Date vs Dates for Filing →</Link>
          </p>
        </section>

        {/* ── SECTION 7: Which chart for I-485 ───────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Which Chart Matters for Filing Your I-485?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="font-semibold text-emerald-900 mb-1">Table A (Final Action Date)</p>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>• Always controls I-485 approval</li>
                <li>• Required every month — no exception</li>
                <li>• If current: USCIS can file AND approve</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="font-semibold text-blue-900 mb-1">Table B (Dates for Filing)</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Only valid when USCIS authorizes it monthly</li>
                <li>• If authorized + current: can file I-485, get EAD/AP</li>
                <li>• Green card approval still waits for Table A</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: EB-1 India ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-1 India: the fastest employment green card path</h2>
          <p className="text-sm text-ink-600 mb-3">
            EB-1 skips PERM entirely and has a much shorter India backlog than EB-2 or EB-3. Three sub-categories:
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { cat: "EB-1A", who: "Extraordinary ability", perm: "No — self-petition" },
              { cat: "EB-1B", who: "Outstanding researcher/professor", perm: "No — employer petition" },
              { cat: "EB-1C", who: "Multinational manager/exec", perm: "No — employer petition" },
            ].map((c) => (
              <div key={c.cat} className="rounded-xl border border-ink-900/5 bg-white p-3.5">
                <p className="font-semibold text-ink-900 text-sm">{c.cat}</p>
                <p className="text-xs text-ink-600 mt-0.5">{c.who}</p>
                <p className="text-xs text-emerald-700 mt-1 font-medium">{c.perm}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/eb1-india" className="text-brand-600 underline">Full EB-1 India guide →</Link>
          </p>
        </section>

        {/* ── SECTION 9: EB-2 India ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-2 India: advanced degree workers and NIW</h2>
          <p className="text-sm text-ink-600 mb-3">
            EB-2 requires a master's degree (or bachelor's + 5 years progressive experience). EB-2 NIW allows self-petition if work benefits the US national interest — no PERM needed. For July 2026, EB-2 India is <strong>Unavailable</strong> — no immigrant visa numbers are authorized for the remainder of FY 2026, so no EB-2 India case can receive final approval this month regardless of priority date.
          </p>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs text-amber-900">
            <strong className="font-semibold">India EB-2 current Final Action Date ({bulletin.month} {bulletin.year}):</strong>{" "}
            {bulletin.finalActionDates.EB2.india === "C" ? "Current (C)" :
             bulletin.finalActionDates.EB2.india === "U" ? "Unavailable" :
             bulletin.finalActionDates.EB2.india}
            {" "}— verify at travel.state.gov
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/eb2-india" className="text-brand-600 underline">Full EB-2 India guide →</Link>
          </p>
        </section>

        {/* ── SECTION 10: EB-3 India ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-3 India: bachelor&apos;s degree holders and skilled workers</h2>
          <p className="text-sm text-ink-600 mb-3">
            EB-3 covers professionals (bachelor&apos;s degree) and skilled workers (2+ years experience). Like EB-2 India, the wait is long — but EB-2 and EB-3 India move independently, creating the EB-2/EB-3 downgrade strategy.
          </p>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs text-amber-900">
            <strong className="font-semibold">India EB-3 current Final Action Date ({bulletin.month} {bulletin.year}):</strong>{" "}
            {bulletin.finalActionDates.EB3.india === "C" ? "Current (C)" :
             bulletin.finalActionDates.EB3.india === "U" ? "Unavailable" :
             bulletin.finalActionDates.EB3.india}
            {" "}— verify at travel.state.gov
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/eb3-india" className="text-brand-600 underline">Full EB-3 India guide + downgrade strategy →</Link>
          </p>
        </section>

        {/* ── SECTION 10b: EB-5 set-asides ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">EB-5 investor categories: Unreserved vs. set-asides</h2>
          <p className="text-sm text-ink-600 mb-4">
            EB-5 splits into the <strong>Unreserved</strong> category and three reserved <strong>set-asides</strong> (Rural, High Unemployment, Infrastructure). For July 2026, EB-5 India Unreserved is <strong>Unavailable</strong>, but the set-aside categories remain <strong>Current</strong> — one reason set-aside investments draw India-born investors.
          </p>
          <Eb5SetAsidePanel />
        </section>

        {/* ── SECTION 11: Retrogression ───────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">What Is Retrogression, and Why Do Dates Move Backward?</h2>
          <p className="text-sm text-ink-600 mb-4">
            Retrogression means the bulletin moved a cutoff date to an earlier date than the prior month — reducing the number of qualifying priority dates. It happens when visa demand is high and the per-country cap is consumed.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="font-semibold text-emerald-900 mb-1">If I-485 is already filed</p>
              <p className="text-sm text-emerald-800">Retrogression does NOT cause denial or abandonment. USCIS holds the case until your date is current again. EAD and AP remain renewable.</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
              <p className="font-semibold text-rose-900 mb-1">If I-485 is not yet filed</p>
              <p className="text-sm text-rose-800">You cannot file I-485 during retrogression (unless Table B is still authorized). Wait for your date to become current again.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            <Link href="/visa-bulletin/retrogression" className="text-brand-600 underline">Full retrogression guide →</Link>
          </p>
        </section>

        {/* ── When your date becomes current (summary + link to owner page) ───── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">What Happens When Your Priority Date Becomes Current?</h2>
          <p className="text-sm leading-relaxed text-ink-600">
            When your priority date is earlier than the applicable cutoff, you may be able to file — or have USCIS approve — your I-485, but only under the chart USCIS authorizes that month, and dates can retrogress, so act promptly with your attorney. The step-by-step package, timing, and travel cautions are covered in the full guide.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/visa-bulletin/priority-date-current-what-next" className="font-medium text-brand-600 hover:text-brand-700">
              Full guide: priority date current — what to do next →
            </Link>
          </p>
        </section>

        {/* ── SECTION 14: Priority Date Checker tool ──────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-3">Check your priority date against the {bulletin.month} {bulletin.year} bulletin</h2>
          <PriorityDateChecker />
        </section>

        {/* ── SECTION 15: Monthly update placeholder ──────────────────────────── */}
        <section className="mb-10">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Monthly bulletin update</p>
            <p className="font-semibold text-ink-900">{bulletin.month} {bulletin.year} Visa Bulletin Summary for India</p>
            <p className="mt-2 text-sm text-ink-600">
              Bulletin data in this tool is updated monthly. For the official current bulletin, check{" "}
              <a href={bulletin.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">
                travel.state.gov
              </a>.
            </p>
            <p className="mt-2 text-sm text-ink-600">
              For USCIS filing authorization (Table B), check{" "}
              <a href="https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/visa-bulletin-information-for-adjustment-of-status-filing-chart" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline font-semibold">
                uscis.gov/visabulletininfo
              </a>.
            </p>
            <Link href="/visa-bulletin/monthly-update"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              How to track the monthly bulletin →
            </Link>
          </div>
        </section>

        {/* ── Child pages grid ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Explore this visa bulletin guide</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visaBulletinChildPages.map((p) => (
              <Link key={p.slug} href={`/visa-bulletin/${p.slug}`}
                className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-0.5">Visa bulletin</p>
                <h3 className="font-semibold text-ink-900 group-hover:text-blue-700">{p.navLabel}</h3>
                <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                <p className="mt-2 text-xs text-ink-400">{p.readingTime} min read</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SECTION 16: FAQ ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                <p className="font-semibold text-ink-900">{faq.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* related links */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink-900 mb-3">Related guides and tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/green-card", label: "Green Card Guide", desc: "PERM, I-140, priority date, I-485, EAD — full process" },
              { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Compare your date to the current bulletin" },
              { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder", desc: "Find your current stage and what to do next" },
              { href: "/nvc-processing-time", label: "NVC interview wait after documentarily qualified", desc: "How long from DQ to a consular interview" },
              { href: "/uscis/case-status", label: "USCIS Case Status Guide", desc: "What your USCIS case status means" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm">
                <p className="text-sm font-semibold text-ink-900 group-hover:text-blue-700">{l.label}</p>
                <p className="mt-0.5 text-xs text-ink-500">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* author bio */}
        <div className="mb-10">
          <AuthorBioBox
            tags={["Visa bulletin & priority dates", "Employment green cards", "India backlog analysis"]}
          />
        </div>

        {/* disclaimer */}
        <div className="mb-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">Disclaimer: </strong>
          This guide is for general educational purposes only and is not legal or immigration advice. Visa bulletin cutoff dates change monthly and the data shown in this guide may not reflect the current month. Always verify the latest data at{" "}
          <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">travel.state.gov</a>{" "}
          and{" "}
          <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline">uscis.gov</a>.{" "}
          Consult a licensed immigration attorney for advice specific to your situation.
        </div>

      </div>

      <Newsletter />
    </>
  );
}
