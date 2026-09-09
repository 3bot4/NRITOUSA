import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import IvSchedulingStatusTool from "@/components/tools/IvSchedulingStatusTool";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  nvcClusterLinks,
  nvcRelatedLinks,
  nvcWebAppJsonLd,
  nvcArticleJsonLd,
  NVC_PUBLISHED,
  NVC_UPDATED,
  NVC_UPDATED_HUMAN,
} from "@/lib/nvcCluster";
import {
  IV_SCHEDULING_VERIFIED,
  IV_TOOL_EXCLUSIONS,
  bulletinMonth,
  formatCutoffDate,
  ivSchedulingLinks,
} from "@/lib/ivScheduling";

const PATH = "/tools/iv-scheduling-status";
const TITLE =
  "IV Scheduling Status Tool: How to Read It, and Why Your Case Is Not Scheduled";
const DESC =
  "The Department of State IV Scheduling Status Tool shows a documentarily complete date, not a priority date. Work out which of the two gates — visa availability or your post's queue — is actually holding your immigrant visa interview.";

export const metadata: Metadata = pageMetadata({
  title: "IV Scheduling Status Tool",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "What does the IV Scheduling Status Tool actually show?",
    answer:
      "It shows the date on which recently scheduled immigrant visa interviews at a given embassy or consulate became documentarily complete — meaning fees paid, DS-260 submitted, and all civil and financial documents accepted by NVC. It is a marker of how far through its documentarily complete queue a post has worked. It is not a priority date, not a processing time, and not a prediction of your interview date.",
  },
  {
    question: "Is the date in the IV Scheduling Status Tool my priority date?",
    answer:
      "No, and this is the most common misreading. Your priority date comes from your petition — the PERM filing date or I-130/I-140 receipt date — and it governs visa availability under the Visa Bulletin. The date in the scheduling tool is a documentarily complete date, which is generated years later when NVC accepts your document package. The two numbers measure different queues and are usually years apart. Comparing your priority date against the scheduling tool's month will give you a meaningless answer.",
  },
  {
    question:
      "My case has been documentarily complete for over a year and my post is still showing an earlier month. Why?",
    answer:
      "Either the post's queue genuinely has not reached you, or visa availability is the real constraint. For preference categories, NVC can only schedule an interview when a visa number is expected to be available — that is, when your priority date is current under the Final Action Dates chart. Many Indian EB-2 and EB-3 applicants are documentarily complete for years while the Final Action Date sits behind their priority date. In that situation the post's queue is irrelevant to you, and no inquiry will change it.",
  },
  {
    question: "Why is my case not showing in the IV Scheduling Status Tool?",
    answer:
      "The tool reports by category and post, not by case, so it never shows an individual case at all. Separately, the Department of State states that Diversity Visa cases, Afghan Special Immigrant Visa cases, I-601A provisional waiver cases and adoption cases are not reflected in the tool. If you are in one of those, the tool cannot describe your queue.",
  },
  {
    question:
      "Does becoming documentarily qualified sooner get me an earlier interview?",
    answer:
      "Yes — but only once visa availability lets you be scheduled at all. Your documentarily complete date is what puts you in the post's queue, and NVC fills interview slots broadly first-in, first-out by that date. So becoming complete early banks a better queue position for the moment your priority date becomes current. It does not move your priority date, and it cannot pull you ahead of the Visa Bulletin.",
  },
  {
    question:
      "The tool's date for my post went backwards. What does that mean?",
    answer:
      "It can happen, and it is not necessarily a sign of trouble. The figure reflects the cases a post actually scheduled recently, so it moves with the mix of cases being worked, appointment capacity, staffing and category. A month or two of backwards movement is noise. A sustained reversal usually means the post is working through an older segment of the queue or has changed how it allocates appointments.",
  },
  {
    question: "How often is the IV Scheduling Status Tool updated?",
    answer:
      "The Department of State refreshes it periodically rather than on a fixed published schedule, so treat any reading as a snapshot with a date attached rather than a live figure. Reading it two or three months running tells you far more than a single reading, because the rate of movement is the useful signal, not the absolute month.",
  },
  {
    question:
      "Should I file an NVC public inquiry if the tool has passed my documentarily complete month?",
    answer:
      "Only after you have checked CEAC and confirmed there is no outstanding document request and that every applicant on the case, including derivatives, shows as complete — and only if your priority date is current under Final Action Dates. Where all of that is true and the post is scheduling cases newer than yours, an inquiry is appropriate. Inquiring while your category is not current, or while a document request sits unanswered, adds to the queue without helping your case.",
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    nvcArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: NVC_PUBLISHED,
      dateModified: NVC_UPDATED,
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "IV Scheduling Status", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="iv-scheduling-status"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "IV Scheduling Status" },
        ]}
        icon="📆"
        category="Visa & Green Card"
        title="IV Scheduling Status Tool"
        hook="The official tool tells you where a consulate's queue has reached. It does not tell you why your case is not scheduled. This works out which of the two gates is actually holding you."
        accent="from-indigo-600 to-violet-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#tool"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Diagnose My Case →
            </a>
            <a
              href={ivSchedulingLinks.tool}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Official DOS Tool ↗
            </a>
          </div>
        }
        sourceNote={
          <>
            Visa Bulletin cutoffs from the {formatCutoffDate(bulletinMonth)}{" "}
            bulletin. Policy statements verified {IV_SCHEDULING_VERIFIED}. Cutoffs
            change monthly and can retrogress — verify against the official
            bulletin before acting.
          </>
        }
        disclaimerExtra={
          <p>
            Educational only, and not legal advice. This page does not replace an
            immigration attorney. Always verify against the Department of State,
            NVC and CEAC directly.
          </p>
        }
      >
        {/* ── Fast answer ─────────────────────────────────────────────── */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="What the IV Scheduling Status Tool actually tells you"
              accent="brand"
              rows={[
                {
                  label: "What the date means",
                  value: "Documentarily complete date",
                  note: "The DQ month of cases the post recently scheduled — not a priority date.",
                  highlight: true,
                },
                {
                  label: "What it does not mean",
                  value: "Not your interview date",
                  note: "It is a queue marker, not a prediction or a guarantee.",
                },
                {
                  label: "Gate 1 — visa availability",
                  value: "Final Action Dates",
                  note: "No interview can be scheduled until a visa number is available.",
                },
                {
                  label: "Gate 2 — the post's queue",
                  value: "First-in, first-out by DQ",
                  note: "This is the only gate the official tool shows.",
                },
              ]}
              badges={[
                "Two gates, one published figure",
                `${formatCutoffDate(bulletinMonth)} bulletin`,
              ]}
              lastVerified={IV_SCHEDULING_VERIFIED}
              sources={[
                { label: "DOS IV Scheduling Status Tool", href: ivSchedulingLinks.tool },
                { label: "NVC Timeframes", href: ivSchedulingLinks.nvcTimeframes },
                { label: "Visa Bulletin", href: ivSchedulingLinks.visaBulletin },
              ]}
              disclaimer="Educational planning information only. Interview scheduling is controlled by NVC and the consular post, and is never guaranteed."
              ctaText="Work out which gate is holding my case"
              ctaHref="#tool"
            />
          </Container>
        </section>

        {/* ── The tool ────────────────────────────────────────────────── */}
        <section className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">
                Which gate is holding your case?
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Fill in what you know. The visa availability half is answered from
                the {formatCutoffDate(bulletinMonth)} Visa Bulletin data this site
                maintains; the queue half uses the number you read off the official
                tool.
              </p>
              <div className="mt-5">
                <IvSchedulingStatusTool />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-relaxed text-ink-600">
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  The one-sentence version
                </h2>
                <p className="mt-2">
                  The Department of State&rsquo;s{" "}
                  <a
                    href={ivSchedulingLinks.tool}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 underline"
                  >
                    IV Scheduling Status Tool
                  </a>{" "}
                  publishes one number per category per post: the date on which
                  recently scheduled interviews became{" "}
                  <strong>documentarily complete</strong>. That number describes a
                  queue you may not even be standing in yet — because for every
                  preference category there is an earlier gate, visa availability,
                  that the tool says nothing about.
                </p>
                <p className="mt-3">
                  Almost every confused reading of this tool comes from collapsing
                  those two gates into one. This page separates them.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Documentarily complete is not a priority date
                </h2>
                <p className="mt-2">
                  These are two different dates, generated years apart, measuring
                  different things. Confusing them is the single most common error
                  in third-party coverage of this tool, and it produces answers
                  that are not merely imprecise but backwards.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900"></th>
                        <th className="py-2 pr-3 font-bold text-ink-900">
                          Priority date
                        </th>
                        <th className="py-2 font-bold text-ink-900">
                          Documentarily complete date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      <tr className="border-b border-ink-900/5">
                        <td className="py-2 pr-3 font-semibold text-ink-800">
                          Where it comes from
                        </td>
                        <td className="py-2 pr-3">
                          Your petition — PERM filing date, or the I-130/I-140
                          receipt date where no PERM applies
                        </td>
                        <td className="py-2">
                          NVC, when it accepts your fees, DS-260 and full document
                          package
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-2 pr-3 font-semibold text-ink-800">
                          What it controls
                        </td>
                        <td className="py-2 pr-3">
                          Whether a visa number is available to you at all
                        </td>
                        <td className="py-2">
                          Your position in your post&rsquo;s interview queue
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5">
                        <td className="py-2 pr-3 font-semibold text-ink-800">
                          Where you look it up
                        </td>
                        <td className="py-2 pr-3">
                          The monthly Visa Bulletin
                        </td>
                        <td className="py-2">
                          The IV Scheduling Status Tool (by post), CEAC (for your
                          own case)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-semibold text-ink-800">
                          Typical India EB gap
                        </td>
                        <td className="py-2 pr-3">2012&ndash;2015</td>
                        <td className="py-2">2023&ndash;2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  If you take one thing from this page: never compare your priority
                  date against the month shown in the scheduling tool. They are not
                  on the same scale. For the priority date half of the question,
                  use the{" "}
                  <Link href="/tools/priority-date-checker" className="text-brand-600 underline">
                    priority date checker
                  </Link>{" "}
                  or read{" "}
                  <Link href="/visa-bulletin/priority-date" className="text-brand-600 underline">
                    how priority dates work
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  The two gates, in order
                </h2>
                <p className="mt-2">
                  An immigrant visa interview requires both gates to be open. They
                  are checked in this order, and the second one never rescues you
                  from the first.
                </p>

                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Gate 1
                    </p>
                    <p className="mt-1 font-bold text-ink-900">
                      Visa availability — the Visa Bulletin
                    </p>
                    <p className="mt-2 text-sm">
                      Preference categories are subject to annual numerical limits.
                      A consular officer can only issue an immigrant visa when a
                      number is available, so NVC only schedules an interview when
                      your priority date is current under the{" "}
                      <strong>Final Action Dates</strong> chart. The separate{" "}
                      <strong>Dates for Filing</strong> chart is used earlier and
                      for a different purpose: it tells NVC when to invite your fee
                      payments, DS-260 and documents — the steps that make you
                      documentarily complete in the first place.
                    </p>
                    <p className="mt-2 text-sm">
                      Immediate relatives — IR1, IR2 and IR5 — are exempt from
                      numerical limits, so gate 1 does not exist for them. That is
                      why an IR5 parent case can move to interview far faster than
                      an F4 sibling case filed on the same day.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                      Gate 2
                    </p>
                    <p className="mt-1 font-bold text-ink-900">
                      The post&rsquo;s documentarily complete queue
                    </p>
                    <p className="mt-2 text-sm">
                      Among cases that have cleared gate 1, the consular post tells
                      NVC how many interview slots it is releasing, and NVC fills
                      them broadly first-in, first-out by documentarily complete
                      date. This is the queue the official tool publishes — and it
                      is the only one it publishes.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  The practical consequence: a reader whose category is not current
                  can stare at their post&rsquo;s scheduling month for years and
                  learn nothing, because that number describes a queue they have
                  not joined. Conversely, a reader whose category is current and
                  whose DQ month has been passed by the posted marker has a real,
                  actionable anomaly worth raising.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  How to read the official tool without misleading yourself
                </h2>
                <ol className="mt-3 space-y-3">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      1
                    </span>
                    <span>
                      <strong className="text-ink-900">
                        Check gate 1 first, not the tool.
                      </strong>{" "}
                      Look up your category and chargeability in the current Visa
                      Bulletin&rsquo;s Final Action Dates chart. If your priority
                      date is not earlier than that cutoff, stop — the scheduling
                      tool is not describing your situation.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      2
                    </span>
                    <span>
                      <strong className="text-ink-900">
                        Select the right visa path and post.
                      </strong>{" "}
                      The tool is segmented by immediate relative, family
                      preference and employment preference, and then by embassy or
                      consulate. A reading for the wrong post is worthless — Mumbai
                      and New Delhi run independent queues.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      3
                    </span>
                    <span>
                      <strong className="text-ink-900">
                        Write down the date and the day you read it.
                      </strong>{" "}
                      The figure is a snapshot that is refreshed periodically
                      rather than on a published schedule. An undated reading is
                      not evidence of anything a month later.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      4
                    </span>
                    <span>
                      <strong className="text-ink-900">
                        Read it again next month, and the month after.
                      </strong>{" "}
                      The rate of movement is the useful signal. A post that
                      advances its marker by three months in a quarter is telling
                      you something; a single absolute month is not.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      5
                    </span>
                    <span>
                      <strong className="text-ink-900">
                        Compare it against your DQ month, not your priority date.
                      </strong>{" "}
                      That comparison — and only that comparison — tells you your
                      queue position.
                    </span>
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Cases the tool does not cover
                </h2>
                <p className="mt-2">
                  The Department of State states that the following are not
                  reflected in the IV Scheduling Status Tool. If you are in one of
                  these, the tool cannot describe your queue and a reading from it
                  should not be applied to your case:
                </p>
                <ul className="mt-3 space-y-1.5">
                  {IV_TOOL_EXCLUSIONS.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-ink-400">
                        &middot;
                      </span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3">
                  Note also that the tool reports by category and post, never by
                  case. There is no view of your own case in it — for that, CEAC is
                  the only authoritative source, and{" "}
                  <Link href="/nvc-case-status" className="text-brand-600 underline">
                    NVC case status
                  </Link>{" "}
                  walks through what each stage means.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  What this means for Indian applicants specifically
                </h2>
                <p className="mt-2">
                  For Indian employment-based cases the two gates are almost never
                  in balance, and gate 1 dominates. India EB-2 and EB-3 Final
                  Action Dates sit far behind the Dates for Filing chart, which
                  produces the single most common Indian fact pattern: a case that
                  has been documentarily complete for years, with every document
                  accepted, that still cannot be scheduled. Nothing is wrong with
                  it. The visa numbers are not there.
                </p>
                <p className="mt-3">
                  That is why the Dates for Filing chart moving is so often
                  mistaken for progress toward an interview. It is progress toward
                  being <em>allowed to submit documents</em> — genuinely useful,
                  because it banks a queue position for the day the Final Action
                  Date arrives, but it is not progress toward a visa. The{" "}
                  <Link
                    href="/visa-bulletin/final-action-date-vs-date-of-filing"
                    className="text-brand-600 underline"
                  >
                    difference between the two charts
                  </Link>{" "}
                  is worth reading once properly.
                </p>
                <p className="mt-3">
                  Indian family cases behave differently. F4 sibling cases carry
                  the longest queue of any Indian category, so gate 1 again
                  dominates. But F2A — spouses and minor children of green card
                  holders — has recently been close to current, which flips the
                  problem: for those applicants gate 1 is often open and the post
                  queue at Mumbai or New Delhi is the real constraint, making the
                  official tool genuinely informative for once.
                </p>
                <p className="mt-3">
                  Mumbai and New Delhi maintain separate queues with separate
                  capacity, and they do not move in step. A figure someone quotes
                  from a forum is only meaningful if it is for your post, your
                  visa path and a date you can see.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Five misreadings worth avoiding
                </h2>
                <ul className="mt-3 space-y-3">
                  <li>
                    <strong className="text-ink-900">
                      &ldquo;The tool shows 2024, my priority date is 2013, so I am
                      years ahead.&rdquo;
                    </strong>{" "}
                    Different scales. The 2024 figure is a documentarily complete
                    date. Your 2013 date is a priority date. They cannot be
                    compared.
                  </li>
                  <li>
                    <strong className="text-ink-900">
                      &ldquo;I am documentarily qualified, so I am in the
                      queue.&rdquo;
                    </strong>{" "}
                    Only if your category is current under Final Action Dates. DQ
                    is necessary but not sufficient.
                  </li>
                  <li>
                    <strong className="text-ink-900">
                      &ldquo;The tool moved forward two months, so my interview is
                      two months closer.&rdquo;
                    </strong>{" "}
                    Movement is uneven and reflects the cases a post actually
                    scheduled, which depends on capacity and case mix.
                  </li>
                  <li>
                    <strong className="text-ink-900">
                      &ldquo;My friend at the same post with the same priority date
                      got an interview.&rdquo;
                    </strong>{" "}
                    Same priority date, different DQ date — and possibly a
                    different category or chargeability. The DQ date is what orders
                    the queue.
                  </li>
                  <li>
                    <strong className="text-ink-900">
                      &ldquo;The tool passed my month, so NVC lost my case.&rdquo;
                    </strong>{" "}
                    Usually it is an unanswered document request in CEAC, or a
                    derivative applicant who is not yet complete. Check that before
                    inquiring.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Where this sits in the wider process
                </h2>
                <p className="mt-2">
                  This page covers one narrow question: how to interpret the
                  scheduling marker. The stages around it are covered elsewhere and
                  are not repeated here.{" "}
                  <Link href="/nvc-processing-time" className="text-brand-600 underline">
                    NVC processing time
                  </Link>{" "}
                  covers the planning ranges for case creation, document review and
                  the wait from DQ to interview.{" "}
                  <Link
                    href="/nvc-document-checklist-india"
                    className="text-brand-600 underline"
                  >
                    The NVC document checklist for India
                  </Link>{" "}
                  covers what you have to submit to become documentarily complete
                  in the first place, and{" "}
                  <Link href="/what-is-nvc-case-number" className="text-brand-600 underline">
                    the NVC case number
                  </Link>{" "}
                  explains the identifier you will need for any of it. If you are
                  adjusting status inside the United States rather than
                  interviewing abroad, none of this applies to you — see{" "}
                  <Link href="/i485-processing-time" className="text-brand-600 underline">
                    I-485 processing time
                  </Link>{" "}
                  instead.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── CTA row ─────────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
              <Link
                href="/tools/priority-date-checker"
                className="rounded-2xl border border-blue-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm"
              >
                <p className="font-bold text-ink-900">Is my date current?</p>
                <p className="mt-1 text-xs text-ink-600">
                  Check gate 1 with the Priority Date Checker →
                </p>
              </Link>
              <Link
                href="/nvc-processing-time"
                className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm"
              >
                <p className="font-bold text-ink-900">How long does NVC take?</p>
                <p className="mt-1 text-xs text-ink-600">
                  Stage-by-stage planning ranges →
                </p>
              </Link>
              <Link
                href="/nvc-public-inquiry"
                className="rounded-2xl border border-rose-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm"
              >
                <p className="font-bold text-ink-900">Past the posted month?</p>
                <p className="mt-1 text-xs text-ink-600">
                  When an NVC public inquiry is appropriate →
                </p>
              </Link>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="More NVC & green card guides"
              links={[...nvcClusterLinks, ...nvcRelatedLinks]}
            />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={NVC_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
