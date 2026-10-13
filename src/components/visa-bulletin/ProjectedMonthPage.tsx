import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import PriorityDateChecker from "@/components/tools/PriorityDateChecker";
import {
  ProjectedMovementChart,
  ProjectionMethodDiagram,
} from "@/components/visa-bulletin/ProjectedMonthCharts";
import { formatCutoff, getApplicableChart } from "@/lib/visa-bulletin";
import { monthLabel, monthPath, publishedMonthSlugs, slugToMonth, BULLETIN_ARCHIVE_URL } from "@/lib/visaBulletinMonths";
import {
  LAST_PUBLISHED_MONTH,
  PROJECTED_BADGE,
  PROJECTED_BANNER,
  PROJECTED_MONTHS,
  WINDOW,
  fiscalStage,
  indiaEbProjections,
  monthsBetween,
  projectCutoff,
  projectionTable,
  type Projection,
  type ProjectionRow,
} from "@/lib/visaBulletinProjections";
import {
  EB_WORLDWIDE_FLOOR,
  PER_COUNTRY_SHARE,
  fmt as fmtNum,
  getFiscalYear,
  pct,
} from "@/data/visaAnnualLimitsData";
import type { FaqItem } from "@/lib/seo";

/**
 * One PROJECTED month's visa bulletin page.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE HONESTY CONTRACT, AND IT IS NOT NEGOTIABLE
 *
 *  • A banner above the fold says the official bulletin has not been published.
 *  • EVERY projected value carries a PROJECTED badge or sits in a column headed
 *    "Projected range". No projected figure is ever typeset the way a published
 *    one is.
 *  • Every range states its own method and sample size.
 *  • The USCIS chart determination is NEVER asserted for this month. The page
 *    names the month the tracked determination actually covers, which is the
 *    same guard chartCopyFor() applies on an archive month page.
 *  • The FY2027 annual limit is not claimed, because DOS has not published it.
 *
 * Flipping to OFFICIAL is a data edit: add the snapshot, add the month to
 * PUBLISHED_MONTHS, remove it from PROJECTED_MONTHS. The URL does not move, and
 * visaBulletinProjections.test.ts fails if a month is ever in both lists.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const COUNTRIES = ["india", "china", "mexico", "philippines", "row"];

function ProjectedCell({ p }: { p: Projection }) {
  if (p.stateOnly) {
    return (
      <span className="whitespace-nowrap">
        <span className="font-semibold text-ink-900">{formatCutoff(p.basis)}</span>
        <span className="mt-0.5 block text-[0.65rem] text-ink-400">
          a state, not a date
        </span>
      </span>
    );
  }
  return (
    <span>
      <span className="whitespace-nowrap font-semibold text-ink-900">
        {p.rangeLabel}
      </span>
      {p.highAdvanceDays > 0 && (
        <span className="mt-0.5 block text-[0.65rem] text-ink-400">
          up to {p.highAdvanceDays} days of movement
        </span>
      )}
    </span>
  );
}

function ProjectionTable({
  rows,
  caption,
}: {
  rows: ProjectionRow[];
  caption: string;
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink-900/10 text-left">
            <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
              Category
            </th>
            <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
              Country
            </th>
            <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
              Last published
              <span className="block text-[0.65rem] font-normal text-ink-500">
                {monthLabel(LAST_PUBLISHED_MONTH)}, official
              </span>
            </th>
            <th scope="col" className="py-2 pr-3 font-bold text-amber-800">
              Projected range
              <span className="block text-[0.65rem] font-normal text-amber-700">
                final action &mdash; not official
              </span>
            </th>
            <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
              Last published
              <span className="block text-[0.65rem] font-normal text-ink-500">
                dates for filing
              </span>
            </th>
            <th scope="col" className="py-2 font-bold text-amber-800">
              Projected range
              <span className="block text-[0.65rem] font-normal text-amber-700">
                dates for filing &mdash; not official
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="text-ink-600">
          {rows.map((r) => (
            <tr
              key={`${r.category}-${r.country}`}
              className={`border-b border-ink-900/5 align-top ${
                r.country === "india" ? "bg-brand-50/40" : ""
              }`}
            >
              <td className="py-2.5 pr-3 font-semibold text-ink-800">
                {r.categoryLabel}
              </td>
              <td className="py-2.5 pr-3">{r.countryLabel}</td>
              <td className="py-2.5 pr-3 whitespace-nowrap">
                {formatCutoff(r.fad.basis)}
              </td>
              <td className="bg-amber-50/40 py-2.5 pr-3">
                <ProjectedCell p={r.fad} />
              </td>
              <td className="py-2.5 pr-3 whitespace-nowrap">
                {formatCutoff(r.dff.basis)}
              </td>
              <td className="bg-amber-50/40 py-2.5">
                <ProjectedCell p={r.dff} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function projectedMonthFaqs(bulletinMonth: string): FaqItem[] {
  const label = monthLabel(bulletinMonth);
  const india = indiaEbProjections(bulletinMonth);
  const pick = (c: string) => india.filter((r) => r.category === c)[0];
  const eb1 = pick("eb1");
  const eb2 = pick("eb2");
  const eb3 = pick("eb3");
  const chart = getApplicableChart();
  const stage = fiscalStage(bulletinMonth);
  const horizon = monthsBetween(LAST_PUBLISHED_MONTH, bulletinMonth);

  return [
    {
      question: `Has the ${label} visa bulletin been published?`,
      answer: `Not when this page was last updated. The latest bulletin the Department of State has published is ${monthLabel(
        LAST_PUBLISHED_MONTH,
      )}. DOS normally releases the next month's bulletin in the second or third week of the preceding month. Everything on this page below the banner is a projection built from the published archive, not a published figure — and this page becomes the official ${label} bulletin page, at this same URL, on release.`,
    },
    {
      question: `What are the projected India EB dates for ${label}?`,
      answer: `${
        eb2
          ? `EB-2 India final action is projected at ${eb2.fad.rangeLabel}, from a published ${monthLabel(
              LAST_PUBLISHED_MONTH,
            )} cutoff of ${formatCutoff(eb2.fad.basis)}.`
          : "EB-2 India is not projectable this month."
      } ${
        eb3
          ? `EB-3 India is projected at ${eb3.fad.rangeLabel}.`
          : ""
      } ${
        eb1 ? `EB-1 India is projected at ${eb1.fad.rangeLabel}.` : ""
      } These are ranges rather than dates, their floor is no movement, and they are this site's arithmetic rather than a government figure. Verify against the Department of State once the bulletin is out.`,
    },
    {
      question: "How is the projection calculated?",
      answer: `From the site's own snapshot archive of published bulletins. For each category and country we take the month-over-month change in the cutoff across the trailing ${WINDOW} bulletins, excluding every month the category was Current or Unavailable — those are states rather than dates, and treating "U" as an old date is how movement trackers produce a confident "retrogressed 4,000 days". The low bound of the range is no movement, which is the most common single outcome in the archive. The high bound applies the 75th-percentile observed advance per bulletin across the ${horizon}-bulletin horizon, then holds it at the bulletin's own month, because a cutoff that reaches the present means there is no queue left. Every row on this page shows its own sample size.`,
    },
    {
      question: `Which chart will USCIS accept for filing in ${label}?`,
      answer: `We do not know, and no honest page can tell you. USCIS makes that determination month by month and publishes it separately from the bulletin. The determination tracked site-wide covers ${chart.determinationMonthLabel}, where the answer is: ${chart.label}. That is a different month from this one. Check uscis.gov/visabulletininfo before you file — using the wrong chart gets an I-485 rejected rather than held.`,
    },
    {
      question: `What is the FY2027 annual limit?`,
      answer: `The Department of State has not published it. The statutory floor for the worldwide employment-based level is ${fmtNum(
        EB_WORLDWIDE_FLOOR,
      )} under INA 201(d)(1)(A), and the per-country ceiling is ${pct(
        PER_COUNTRY_SHARE,
      )} of the year's total under INA 202(a)(2) — but the actual pool is the floor plus family-sponsored numbers unused in the prior year, which is not knowable in advance. Any page quoting a specific FY2027 employment-based total is quoting an estimate. That is also why these projections are not anchored on a supply figure.`,
    },
    {
      question: `Could the dates retrogress in ${label} instead?`,
      answer: `Yes, and the ranges on this page do not capture it — a range with a floor of "no movement" cannot. ${stage.note} India EB-2 is the live example from the last fiscal year: it advanced to 15 July 2014 by April 2026, retrogressed in June, and went Unavailable from July through September before resetting at 1 November 2013 in the October 2026 bulletin. Retrogression and a category going Unavailable are both real possibilities and neither is forecastable from a trend.`,
    },
    {
      question: "Why is this page at a clean URL instead of a predictions URL?",
      answer: `Because the URL is the month, and the month does not change when the bulletin is published — only the page's status does. Putting a forecast word in the path would mean moving the page later, splitting the links and the history across two URLs for no reason. This page carries a projected status today and becomes the official ${label} bulletin page at this same address on release.`,
    },
    {
      question: "What is the difference between final action dates and dates for filing?",
      answer:
        "Dates for Filing is the earlier of the two charts and controls when you may submit an I-485, along with the EAD and advance parole applications that go with it. Final Action Dates is the later chart and controls when a green card can actually be approved and a visa number issued. Being current on Dates for Filing gets you a work permit and a travel document; only Final Action ends the wait.",
    },
  ];
}

export default function ProjectedMonthPage({
  bulletinMonth,
}: {
  bulletinMonth: string;
}) {
  const label = monthLabel(bulletinMonth);
  const lastLabel = monthLabel(LAST_PUBLISHED_MONTH);
  const india = indiaEbProjections(bulletinMonth);
  const employment = projectionTable(bulletinMonth, "categories", COUNTRIES);
  const family = projectionTable(bulletinMonth, "family", COUNTRIES);
  const chart = getApplicableChart();
  const stage = fiscalStage(bulletinMonth);
  const horizon = monthsBetween(LAST_PUBLISHED_MONTH, bulletinMonth);
  const faqs = projectedMonthFaqs(bulletinMonth);
  const fy2027 = getFiscalYear(2027);

  const pick = (c: string) => india.filter((r) => r.category === c)[0];
  const otherMonths = PROJECTED_MONTHS.filter((m) => m !== bulletinMonth);
  const publishedMonths = publishedMonthSlugs();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Visa Bulletin Guide", url: "/visa-bulletin" },
    { name: "Monthly Updates", url: "/visa-bulletin/monthly-update" },
    { name: `${label} Bulletin`, url: monthPath(bulletinMonth) },
  ];

  return (
    <article>
      <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-9">
        <Container>
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

          {/* ══ THE BANNER. Above the fold, before the H1. ══ */}
          <div
            role="status"
            className="mb-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5"
          >
            <p className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[0.7rem] font-black uppercase tracking-wider text-white">
                {PROJECTED_BADGE}
              </span>
              <span className="text-sm font-bold text-amber-900">
                {PROJECTED_BANNER}
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
              The newest bulletin the Department of State has published is{" "}
              <Link
                href="/visa-bulletin/october-2026"
                className="font-semibold underline"
              >
                {lastLabel}
              </Link>
              . Every figure below in an amber column is this site&rsquo;s
              arithmetic over the published archive, shown as a range with its
              method and sample size. None of it is a government figure. This
              page becomes the official {label} bulletin page, at this same
              address, on release.
            </p>
          </div>

          <h1 className="max-w-3xl text-2xl font-black tracking-tight text-ink-900 sm:text-4xl">
            {label} visa bulletin: projected India EB-1, EB-2 and EB-3 movement
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
            {pick("eb2") && (
              <>
                Projected <strong>India EB-2 final action</strong>:{" "}
                {pick("eb2").fad.rangeLabel}, from a published {lastLabel}{" "}
                cutoff of {formatCutoff(pick("eb2").fad.basis)}.{" "}
              </>
            )}
            {pick("eb3") && (
              <>
                <strong>EB-3</strong>: {pick("eb3").fad.rangeLabel}.{" "}
              </>
            )}
            {pick("eb1") && (
              <>
                <strong>EB-1</strong>: {pick("eb1").fad.rangeLabel}.{" "}
              </>
            )}
            Ranges, not dates &mdash; {label} is {horizon} bulletin
            {horizon === 1 ? "" : "s"} beyond the last published one, and the
            floor of every range is no movement.
          </p>

          <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
            {india.slice(0, 3).map((r) => (
              <li
                key={r.category}
                className="rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-2.5"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink-800">
                    {r.categoryLabel} India
                  </span>
                  <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[0.6rem] font-black uppercase tracking-wide text-white">
                    projected
                  </span>
                </span>
                <span className="mt-1 block text-sm font-bold text-ink-900">
                  {r.fad.rangeLabel}
                </span>
                <span className="mt-0.5 block text-[0.7rem] text-ink-500">
                  from {formatCutoff(r.fad.basis)} · n={r.fad.sampleSize}
                </span>
              </li>
            ))}
            <li className="rounded-xl border border-ink-900/10 bg-ink-900/[0.02] px-3.5 py-2.5">
              <span className="text-sm font-semibold text-ink-800">
                Chart USCIS accepts
              </span>
              <span className="mt-1 block text-sm font-bold text-ink-900">
                Not determined for {label}
              </span>
              <span className="mt-0.5 block text-[0.7rem] text-ink-500">
                Tracked determination covers {chart.determinationMonthLabel}
              </span>
            </li>
          </ul>

          <ReviewedByline date={`${LAST_PUBLISHED_MONTH}-01`} className="mt-5" />
          <NotLegalAdvice className="mt-4 max-w-3xl" />
        </Container>
      </header>

      {/* ── The chart ─────────────────────────────────────────── */}
      <section className="bg-ink-900/[0.02] py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-ink-900">
              Twelve published bulletins, and where the projection starts
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Solid lines are published cutoffs. The shaded band to the right of
              the dashed line is the projected range for {label}. A gap in a line
              is a month the category was Current or Unavailable &mdash; states
              rather than dates, and excluded from the arithmetic entirely.
            </p>
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <ProjectedMovementChart targetMonth={bulletinMonth} chart="fad" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── The method ────────────────────────────────────────── */}
      <section id="method" className="scroll-mt-24 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-[800px]">
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              The method, stated
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Every prediction page we checked asserts movement without stating
              a basis. Here is ours, and it is derived in code from the snapshot
              archive rather than typed into copy, so it cannot quietly go stale.
            </p>
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <ProjectionMethodDiagram targetMonth={bulletinMonth} />
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <caption className="sr-only">
                  The basis behind each projected India EB range
                </caption>
                <thead>
                  <tr className="border-b border-ink-900/10 text-left">
                    <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                      Category
                    </th>
                    <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                      Sample
                    </th>
                    <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                      Confidence
                    </th>
                    <th scope="col" className="py-2 font-bold text-ink-900">
                      How this range was built
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-600">
                  {india.map((r) => (
                    <tr key={r.category} className="border-b border-ink-900/5 align-top">
                      <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                        {r.categoryLabel} India
                      </th>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        {r.fad.sampleSize} pairs
                        <span className="mt-0.5 block text-[0.7rem] text-ink-400">
                          {r.fad.excludedMonths} excluded as C or U
                        </span>
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap capitalize">
                        {r.fad.confidence}
                      </td>
                      <td className="py-3">
                        {r.fad.method}
                        {r.fad.downside && (
                          <span className="mt-2 block rounded-lg border border-rose-200 bg-rose-50/60 p-2.5 text-[0.78rem] text-rose-900">
                            {r.fad.downside}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
              <p className="text-sm font-bold text-ink-900">
                Where {label} sits in the fiscal year &mdash; {stage.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{stage.note}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
              <p className="text-sm font-bold text-ink-900">
                What the projection is NOT anchored on
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The supply side. The employment-based pool each year is the{" "}
                {fmtNum(EB_WORLDWIDE_FLOOR)} statutory floor plus
                family-sponsored numbers unused in the prior year, and that
                fall-up is not knowable in advance.{" "}
                {fy2027 && fy2027.status === "awaiting-dos"
                  ? `DOS has not published the FY2027 figure — our own annual-limits data records it as awaiting publication, and ${fy2027.basis.charAt(0).toLowerCase() + fy2027.basis.slice(1)}`
                  : "The FY2027 figure is recorded in our annual-limits data."}{" "}
                Any page quoting a specific FY2027 total is quoting an estimate.{" "}
                <Link href="/visa-bulletin/annual-limits" className="text-brand-600 underline">
                  How the annual limits work
                </Link>{" "}
                has the statutory arithmetic.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Which chart ───────────────────────────────────────── */}
      <section className="border-t border-ink-900/5 bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-[760px]">
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              Which chart applies in {label}?
            </h2>
            <div className="mt-3 rounded-2xl border border-ink-900/10 bg-ink-900/[0.02] p-5">
              <p className="text-sm font-bold text-ink-900">
                Nobody knows yet, including us
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                USCIS decides month by month whether adjustment-of-status
                applicants may use the Dates for Filing chart or must use Final
                Action Dates, and it publishes that determination separately from
                the bulletin. The determination this site tracks covers{" "}
                <strong>{chart.determinationMonthLabel}</strong>, where the
                answer is: {chart.label}. That is a different month from{" "}
                {label}, and asserting it for {label} is exactly the mistake that
                gets an I-485 rejected rather than held. Confirm at{" "}
                <a
                  href="https://www.uscis.gov/visabulletininfo"
                  target="_blank"
                  rel="nofollow noopener"
                  className="text-brand-600 underline"
                >
                  uscis.gov/visabulletininfo
                </a>{" "}
                before you file.
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                The determination can also differ between employment-based and
                family-sponsored cases in the same month, which is a second
                reason not to read one answer off the other.{" "}
                <Link
                  href="/visa-bulletin/final-action-date-vs-date-of-filing"
                  className="text-brand-600 underline"
                >
                  Final action dates versus dates for filing
                </Link>{" "}
                explains what the two charts control.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Priority date checker ─────────────────────────────── */}
      <section id="checker" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
        <Container>
          <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
            Check your priority date against the published bulletin
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            The same checker that runs on{" "}
            <Link href="/tools/priority-date-checker" className="text-brand-600 underline">
              /tools/priority-date-checker
            </Link>
            . It reads the <strong>published</strong> {lastLabel} cutoffs, not the
            projections on this page &mdash; deliberately, because a checker that
            told you where you stood against a forecast would be worse than
            useless. Nothing is stored.
          </p>
          <div className="mt-6">
            <PriorityDateChecker />
          </div>
        </Container>
      </section>

      {/* ── Projection tables ─────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl space-y-10">
            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Employment-based: every category and country
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                The two amber columns are projections. The two plain columns are
                the published {lastLabel} figures they are built from. India rows
                are highlighted.
              </p>
              <ProjectionTable
                rows={employment}
                caption={`Projected employment-based final action and dates for filing ranges for the ${label} visa bulletin, with the published ${lastLabel} cutoffs they are derived from.`}
              />
            </div>

            {family.length > 0 && (
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Family-sponsored: every category and country
                </h2>
                <p className="mt-2 text-sm text-ink-600">
                  Family-sponsored cases have their own USCIS chart
                  determination, which is often different from the
                  employment-based one in the same month.
                </p>
                <ProjectionTable
                  rows={family}
                  caption={`Projected family-sponsored final action and dates for filing ranges for the ${label} visa bulletin, with the published ${lastLabel} cutoffs they are derived from.`}
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── What it means for you ─────────────────────────────── */}
      <section className="bg-ink-900/[0.02] py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-[760px] space-y-8 text-[0.975rem] leading-relaxed text-ink-700">
            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                What this would mean for you
              </h2>
              <p className="mt-3">
                Four worked cases against the ranges above. Each one assumes the
                projection lands somewhere inside its band, which is an
                assumption and not a forecast.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <caption className="sr-only">
                    Worked scenarios against the projected {label} ranges
                  </caption>
                  <thead>
                    <tr className="border-b border-ink-900/10 text-left">
                      <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                        Your situation
                      </th>
                      <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                        Against the projected range
                      </th>
                      <th scope="col" className="py-2 font-bold text-ink-900">
                        What to actually do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-ink-600">
                    {[
                      {
                        s: "EB-2 India, priority date in 2015",
                        r: pick("eb2")
                          ? `The projected final action range tops out at ${formatCutoff(
                              pick("eb2").fad.high,
                            )}, so a 2015 date is not reached in ${label} on any point in this band.`
                          : "Not projectable this month.",
                        d: "Dates for Filing is the chart that matters to you first — check whether your date is current on it, because that is what lets you file the I-485 package with the EAD and advance parole.",
                      },
                      {
                        s: "EB-2 India, priority date in late 2013",
                        r: pick("eb2")
                          ? `This is the live edge of the range: the floor is ${formatCutoff(
                              pick("eb2").fad.low,
                            )} and the ceiling ${formatCutoff(pick("eb2").fad.high)}.`
                          : "Not projectable this month.",
                        d: "Have the medical, the documents and the attorney engagement ready now rather than when the bulletin lands. A month of movement is a month, and the window between a date becoming current and a chart changing again is not under your control.",
                      },
                      {
                        s: "EB-3 India, considering a downgrade from EB-2",
                        r: pick("eb3") && pick("eb2")
                          ? `Projected EB-3 ${pick("eb3").fad.rangeLabel} against EB-2 ${pick("eb2").fad.rangeLabel}. Compare the floors, not the ceilings.`
                          : "Compare the two rows in the table above.",
                        d: "A downgrade is a strategy with real costs and a dependence on which chart USCIS accepts. Read the downgrade guide before acting on one month's movement.",
                      },
                      {
                        s: "EB-1 India, I-140 approved",
                        r: pick("eb1")
                          ? `Projected ${pick("eb1").fad.rangeLabel}, from ${formatCutoff(
                              pick("eb1").fad.basis,
                            )}.`
                          : "Not projectable this month.",
                        d: "EB-1 India has both advanced and retrogressed inside the last twelve bulletins, which is why its downside note is on this page. Watch the trend across the chart rather than the single month.",
                      },
                    ].map((row) => (
                      <tr key={row.s} className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          {row.s}
                        </th>
                        <td className="py-3 pr-3">{row.r}</td>
                        <td className="py-3 text-ink-600">{row.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                The explainers, which this page deliberately does not repeat
              </h2>
              <p className="mt-3">
                A monthly page is for that month&rsquo;s figures. Everything
                structural is owned elsewhere on this site and kept in one place,
                so it stays right.
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/visa-bulletin/priority-date", label: "What a priority date is, and when yours was set" },
                  { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Final action dates vs dates for filing" },
                  { href: "/visa-bulletin/retrogression", label: "What retrogression actually does" },
                  { href: "/visa-bulletin/annual-limits", label: "How the annual and per-country limits work" },
                  { href: "/visa-bulletin/eb1-india", label: "EB-1 India — cutoffs and outlook" },
                  { href: "/visa-bulletin/eb2-india", label: "EB-2 India — cutoffs and outlook" },
                  { href: "/visa-bulletin/eb3-india", label: "EB-3 India — cutoffs and outlook" },
                  { href: "/visa-bulletin/eb2-to-eb3-downgrade", label: "EB-2 to EB-3 downgrade" },
                  { href: "/green-card/green-card-backlog-india", label: "How long the India backlog really is" },
                  { href: "/tools/green-card-tracker", label: "Where you are in the queue" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300"
                    >
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Other months
              </h2>
              <p className="mt-3 text-sm text-ink-600">
                Published bulletins carry real figures. Projected months carry
                ranges.
              </p>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
                    Published
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-2">
                    <li>
                      <Link
                        href="/visa-bulletin/october-2026"
                        className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-800 hover:border-emerald-400"
                      >
                        October 2026
                      </Link>
                    </li>
                    {publishedMonths.map((s) => (
                      <li key={s}>
                        <Link
                          href={`/visa-bulletin/${s}`}
                          className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-800 hover:border-emerald-400"
                        >
                          {monthLabel(slugToMonth(s) ?? "")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {otherMonths.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      Projected
                    </p>
                    <ul className="mt-1.5 flex flex-wrap gap-2">
                      {otherMonths.map((m) => (
                        <li key={m}>
                          <Link
                            href={monthPath(m)}
                            className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-sm font-semibold text-amber-800 hover:border-amber-400"
                          >
                            {monthLabel(m)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm">
                <Link href="/visa-bulletin/monthly-update" className="font-semibold text-brand-600 underline">
                  The monthly update hub
                </Link>{" "}
                carries the full index, and{" "}
                <Link href="/visa-bulletin" className="font-semibold text-brand-600 underline">
                  the visa bulletin guide
                </Link>{" "}
                is the place to start if this is your first month reading one.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faqs} />
        </Container>
      </section>

      <section className="bg-ink-900/[0.02] py-12">
        <Container>
          <OfficialSourceBox
            title="Sources, method and status"
            intro={`The ${label} bulletin has not been published. Every published figure on this page comes from the ${lastLabel} bulletin via the snapshot archive in data/visa-bulletin/, which is derived cell by cell from the official Department of State bulletins. The projected ranges are this site's arithmetic over that archive, derived in code, with the sample size shown for every row. Verify against the Department of State on release.`}
            links={[
              { label: "Visa bulletin archive (Department of State)", href: BULLETIN_ARCHIVE_URL },
              {
                label: "USCIS — adjustment of status filing charts",
                href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin",
              },
              {
                label: "USCIS — visa availability and priority dates",
                href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-and-priority-dates",
              },
              {
                label: "INA 201, 202 and 203 — annual and per-country limits",
                href: "https://www.law.cornell.edu/uscode/text/8/1151",
              },
            ]}
          />

          <div className="mx-auto mt-6 max-w-3xl">
            <NotLegalAdvice />
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <AuthorBioBox
              tags={[
                "Visa bulletin & priority dates",
                "India EB backlog",
                "Employment green card process",
              ]}
            />
          </div>
        </Container>
      </section>

      <Newsletter />
    </article>
  );
}
