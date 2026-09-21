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
  IndiaMovementChart,
  WhichChartDiagram,
} from "@/components/visa-bulletin/MonthCharts";
import { formatCutoff, getApplicableChart } from "@/lib/visa-bulletin";
import {
  getSnapshot,
  indiaEmploymentMovement,
  monthLabel,
  monthPath,
  movementTable,
  previousMonth,
  publishedMonthSlugs,
  slugToMonth,
  BULLETIN_ARCHIVE_URL,
  type Movement,
  type MovementRow,
} from "@/lib/visaBulletinMonths";
import type { FaqItem } from "@/lib/seo";

/**
 * One month's visa bulletin page. Driven entirely by the snapshot data already
 * in data/visa-bulletin/ — adding a month is a data change plus one line in
 * PUBLISHED_MONTHS, not a new page.
 *
 * Publishing checklist: docs/seo/visa-bulletin-monthly-runbook.md
 */

const MOVEMENT_TONE: Record<Movement["kind"], string> = {
  advanced: "text-emerald-700",
  retrogressed: "text-rose-700",
  unchanged: "text-ink-500",
  "became-current": "text-emerald-700",
  "became-unavailable": "text-rose-700",
  "left-unavailable": "text-emerald-700",
  "no-comparison": "text-ink-400",
};

function MovementCell({ m }: { m: Movement }) {
  return (
    <span className={`text-xs font-semibold ${MOVEMENT_TONE[m.kind]}`}>
      {m.label}
    </span>
  );
}

function ChangeTable({ rows, caption }: { rows: MovementRow[]; caption: string }) {
  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-ink-900/10 text-left">
              <th className="py-2 pr-3 font-bold text-ink-900">Category</th>
              <th className="py-2 pr-3 font-bold text-ink-900">Country</th>
              <th className="py-2 pr-3 font-bold text-ink-900">Final Action</th>
              <th className="py-2 pr-3 font-bold text-ink-900">Change</th>
              <th className="py-2 pr-3 font-bold text-ink-900">Dates for Filing</th>
              <th className="py-2 font-bold text-ink-900">Change</th>
            </tr>
          </thead>
          <tbody className="text-ink-600">
            {rows.map((r) => (
              <tr
                key={`${r.category}-${r.country}`}
                className={`border-b border-ink-900/5 ${
                  r.country === "india" ? "bg-brand-50/40" : ""
                }`}
              >
                <td className="py-2.5 pr-3 font-semibold text-ink-800">
                  {r.categoryLabel}
                </td>
                <td className="py-2.5 pr-3">{r.countryLabel}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap font-semibold text-ink-900">
                  {formatCutoff(r.fad.to)}
                </td>
                <td className="py-2.5 pr-3">
                  <MovementCell m={r.fad} />
                </td>
                <td className="py-2.5 pr-3 whitespace-nowrap">{formatCutoff(r.dff.to)}</td>
                <td className="py-2.5">
                  <MovementCell m={r.dff} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function monthFaqs(bulletinMonth: string): FaqItem[] {
  const label = monthLabel(bulletinMonth);
  const prevLabel = monthLabel(previousMonth(bulletinMonth));
  const india = indiaEmploymentMovement(bulletinMonth);
  const pick = (c: string) => india.filter((r) => r.category === c)[0];
  const eb1 = pick("eb1");
  const eb2 = pick("eb2");
  const eb3 = pick("eb3");
  const chart = getApplicableChart();

  const line = (r: MovementRow | undefined, name: string) =>
    r
      ? `${name} final action is ${formatCutoff(r.fad.to)} (${r.fad.label.toLowerCase()} from ${prevLabel}), with a dates-for-filing cutoff of ${formatCutoff(r.dff.to)}`
      : `${name} is not listed separately this month`;

  return [
    {
      question: `What are the India employment dates in the ${label} visa bulletin?`,
      answer: `${line(eb1, "EB-1 India")}. ${line(eb2, "EB-2 India")}. ${line(eb3, "EB-3 India")}. All figures are read from the official ${label} bulletin published by the Department of State.`,
    },
    {
      question: `Which chart do I use to file in ${label}?`,
      answer: `${chart.statusHeadline} ${chart.statusValue} USCIS makes this determination separately from the bulletin each month, and it can differ between employment-based and family-sponsored cases. Check it before you file — using the wrong chart gets an I-485 rejected, not held.`,
    },
    {
      question: "What does U mean in the visa bulletin?",
      answer:
        "U means unavailable: no visa numbers are being issued in that category and country that month, whatever your priority date is. It is not a date and it is not the same as a cutoff moving backwards. It usually means the annual per-country limit has been used up, and a cutoff date typically returns when the new fiscal year starts on 1 October.",
    },
    {
      question: "What does C mean in the visa bulletin?",
      answer:
        "C means current: there is no backlog in that category and country, so anyone with an approved petition can file and be approved without waiting for a priority date.",
    },
    {
      question: "What is the difference between final action dates and dates for filing?",
      answer:
        "Dates for Filing is the earlier of the two charts and controls when you may submit an I-485, along with the EAD and advance parole applications that go with it. Final Action Dates is the later chart and controls when a green card can actually be approved and a visa number issued. Being current on Dates for Filing gets you a work permit and travel document; only Final Action ends the wait.",
    },
    {
      question: `When is the next visa bulletin after ${label} published?`,
      answer:
        "The Department of State usually publishes the next month's bulletin in the second week of the preceding month, though recent releases have slipped into the third week. We publish a page for each bulletin once it is actually released — never before, because a forecast is not a bulletin.",
    },
    {
      question: "My priority date is current — what happens next?",
      answer:
        "If it is current on the chart USCIS is accepting this month, you can file the I-485 package. If it is current on Final Action Dates and your I-485 is already pending, your case becomes approvable — which is when medical exams, interviews and the final decision come into play. Neither is automatic; USCIS still has to reach your case.",
    },
  ];
}

export function monthDescription(bulletinMonth: string): string {
  const india = indiaEmploymentMovement(bulletinMonth);
  const eb2 = india.filter((r) => r.category === "eb2")[0];
  const eb3 = india.filter((r) => r.category === "eb3")[0];
  return `${monthLabel(bulletinMonth)} visa bulletin: India EB-2 final action ${
    eb2 ? formatCutoff(eb2.fad.to) : "see table"
  }, EB-3 ${
    eb3 ? formatCutoff(eb3.fad.to) : "see table"
  }. Month-over-month movement for every category and country, the 24-bulletin India trend, and which chart USCIS is accepting.`;
}

export default function VisaBulletinMonthPage({
  bulletinMonth,
}: {
  bulletinMonth: string;
}) {
  const snapshot = getSnapshot(bulletinMonth);
  if (!snapshot) return null;

  const label = monthLabel(bulletinMonth);
  const prevLabel = monthLabel(previousMonth(bulletinMonth));
  const india = indiaEmploymentMovement(bulletinMonth);
  const employment = movementTable(bulletinMonth, "categories");
  const family = movementTable(bulletinMonth, "family");
  const chart = getApplicableChart();
  const faqs = monthFaqs(bulletinMonth);
  const pick = (c: string) => india.filter((r) => r.category === c)[0];
  const otherMonths = publishedMonthSlugs().filter(
    (s) => slugToMonth(s) !== bulletinMonth
  );

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Visa Bulletin Guide", url: "/visa-bulletin" },
    { name: "Monthly Updates", url: "/visa-bulletin/monthly-update" },
    { name: `${label} Bulletin`, url: monthPath(bulletinMonth) },
  ];

  const headline = (r: MovementRow | undefined, name: string) =>
    r ? (
      <>
        <strong>{name}</strong> {formatCutoff(r.fad.to)}
        <span className="text-ink-500"> ({r.fad.label.toLowerCase()})</span>
      </>
    ) : null;

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

          <h1 className="max-w-3xl text-2xl font-black tracking-tight text-ink-900 sm:text-4xl">
            {label} visa bulletin: India EB-1, EB-2 and EB-3 movement
          </h1>

          {/* ANSWER FIRST — exact dates, exact movement, from the snapshot. */}
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
            In the {label} visa bulletin, {headline(pick("eb2"), "India EB-2 final action is")}
            {". "}
            {headline(pick("eb3"), "EB-3 is")}
            {". "}
            {headline(pick("eb1"), "EB-1 is")}
            {". "}
            {chart.statusHeadline} {chart.statusValue}
          </p>

          <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
            {india.slice(0, 3).map((r) => (
              <li
                key={r.category}
                className="flex items-baseline justify-between gap-3 rounded-xl border border-ink-900/5 bg-ink-900/[0.02] px-3.5 py-2.5"
              >
                <span className="text-sm font-semibold text-ink-800">
                  {r.categoryLabel} India
                </span>
                <span className="text-right">
                  <span className="block text-sm font-bold text-ink-900">
                    {formatCutoff(r.fad.to)}
                  </span>
                  <MovementCell m={r.fad} />
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-3 rounded-xl border border-ink-900/5 bg-ink-900/[0.02] px-3.5 py-2.5">
              <span className="text-sm font-semibold text-ink-800">
                Chart USCIS accepts
              </span>
              <span className="text-sm font-bold text-ink-900">
                {chart.badgeLabel}
              </span>
            </li>
          </ul>

          <ReviewedByline date={bulletinMonth + "-01"} className="mt-5" />
          <NotLegalAdvice className="mt-4 max-w-3xl" />
        </Container>
      </header>

      {/* ── Movement chart ─────────────────────────────────────── */}
      <section className="bg-ink-900/[0.02] py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-ink-900">
              India EB movement, the last 24 bulletins
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              One month in isolation tells you very little. The shape of the
              trailing two years tells you whether a category is grinding
              forward, stalled, or being pulled back at the end of each fiscal
              year.
            </p>
            <div className="overflow-x-auto">
              <div className="min-w-[380px]">
                <IndiaMovementChart bulletinMonth={bulletinMonth} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Which chart diagram ────────────────────────────────── */}
      <section className="py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-[760px]">
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              Which chart applies to you?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              This is the single most common source of false hope and false
              panic in any bulletin month. The two charts answer different
              questions, and USCIS decides separately which one it will accept
              for filing.
            </p>
            <WhichChartDiagram
              chartInUse={chart.chart}
              chartStatus={chart.pending ? "pending" : "posted"}
              chartMonthLabel={chart.determinationMonthLabel}
            />

            <h3 className="mt-8 text-base font-bold text-ink-900">
              How to read a cell in the tables below
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Three things can appear in a bulletin cell, and only one of them
              is a date. The other two are the ones that get misread.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <caption className="sr-only">
                  What each value in a visa bulletin cell means
                </caption>
                <thead>
                  <tr className="border-b border-ink-900/10 text-left">
                    <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                      You see
                    </th>
                    <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                      It means
                    </th>
                    <th scope="col" className="py-2 font-bold text-ink-900">
                      You may act if
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-600">
                  {[
                    {
                      v: "A date",
                      m: "The cut-off. Only cases with a priority date earlier than this one are reached.",
                      a: "Your priority date is strictly earlier than the date shown. The same day is not earlier.",
                    },
                    {
                      v: "C — current",
                      m: "No cut-off at all this month. Every priority date in this category and country is reached.",
                      a: "Always, while it stays C. This can reverse in a later bulletin.",
                    },
                    {
                      v: "U — unavailable",
                      m: "No visa numbers are being issued in this category and country this month. It is not a very old date; it is a closed door.",
                      a: "Not at all this month, whatever your priority date is.",
                    },
                  ].map((r) => (
                    <tr key={r.v} className="border-b border-ink-900/5 align-top">
                      <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                        {r.v}
                      </th>
                      <td className="py-3 pr-3">{r.m}</td>
                      <td className="py-3 text-ink-500">{r.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Two more things a cell cannot tell you. A date moving forward is
              not a promise that it keeps moving — categories retrogress, and
              the change column below shows direction for one month only. And a
              date becoming current does not mean a decision is imminent; it
              means a visa number is available, which is the constraint, not the
              queue.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Priority date checker (embedded, not rebuilt) ──────── */}
      <section id="checker" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-10 sm:py-14">
        <Container>
          <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
            Check your own priority date against this bulletin
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            The same checker that runs on{" "}
            <Link href="/tools/priority-date-checker" className="text-brand-600 underline">
              /tools/priority-date-checker
            </Link>
            , reading this month&apos;s cutoffs. Nothing is stored.
          </p>
          <div className="mt-6">
            <PriorityDateChecker />
          </div>
        </Container>
      </section>

      {/* ── Change tables ──────────────────────────────────────── */}
      <section className="bg-ink-900/[0.02] py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl space-y-10">
            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Employment-based: every category and country
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                Change is measured against the {prevLabel} bulletin. India rows
                are highlighted.
              </p>
              <ChangeTable
                rows={employment}
                caption={`Employment-based final action and dates for filing cutoffs in the ${label} visa bulletin, with movement since ${prevLabel}.`}
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
                  employment-based one.
                </p>
                <ChangeTable
                  rows={family}
                  caption={`Family-sponsored final action and dates for filing cutoffs in the ${label} visa bulletin, with movement since ${prevLabel}.`}
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── What it means ──────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-[720px] space-y-8 text-[0.975rem] leading-relaxed text-ink-700">
            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                What this month means if you are Indian-born
              </h2>
              <p className="mt-3">
                The per-country limit is what makes an Indian-born applicant&apos;s
                experience different from everyone else&apos;s in the same
                category. No single country may take more than 7% of the annual
                total, and demand from India has run far above that share for
                years, so the queue behaves less like a line and more like a
                reservoir that drains at a fixed rate whatever flows in.
              </p>
              <p className="mt-3">
                That is why the fiscal year matters so much. Annual numbers reset
                on 1 October, which is why categories that go Unavailable late in
                a fiscal year typically get a cutoff date back in the October
                bulletin. It is also why a big advance in one month is not a
                trend — the useful question is what the trailing two years look
                like, which is what the chart above is for.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Go deeper on your category
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/visa-bulletin/eb1-india", label: "EB-1 India — cutoffs and outlook" },
                  { href: "/visa-bulletin/eb2-india", label: "EB-2 India — cutoffs and outlook" },
                  { href: "/visa-bulletin/eb3-india", label: "EB-3 India — cutoffs and outlook" },
                  { href: "/visa-bulletin/retrogression", label: "What retrogression actually does" },
                  { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Final action vs dates for filing" },
                  { href: "/visa-bulletin/priority-date-current-what-next", label: "My date is current — now what?" },
                  { href: "/green-card/green-card-backlog-india", label: "How long the India backlog really is" },
                  { href: "/visa-bulletin/eb2-to-eb3-downgrade", label: "EB-2 to EB-3 downgrade" },
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

            {otherMonths.length > 0 && (
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Other months
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {otherMonths.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/visa-bulletin/${s}`}
                        className="inline-flex rounded-full border border-ink-900/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-brand-600 hover:border-brand-300"
                      >
                        {monthLabel(slugToMonth(s) ?? "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-ink-900/[0.02] py-12 sm:py-16">
        <Container>
          <ToolFaq items={faqs} />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <OfficialSourceBox
            title="Sources and last verified"
            intro={`Every cutoff on this page is read from the official ${label} visa bulletin. Verify against the Department of State before acting on any date.`}
            links={[
              { label: `Official ${label} visa bulletin`, href: snapshot.source },
              { label: "Visa bulletin archive (Department of State)", href: BULLETIN_ARCHIVE_URL },
              { label: "USCIS — adjustment of status filing charts", href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin" },
              { label: "USCIS — visa availability and priority dates", href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates" },
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
