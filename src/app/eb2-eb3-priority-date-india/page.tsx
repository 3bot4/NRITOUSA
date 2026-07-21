import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  clusterLinks,
  relatedImmigrationLinks,
  clusterArticleJsonLd,
  CLUSTER_PUBLISHED,
} from "@/lib/permCluster";

const PATH = "/eb2-eb3-priority-date-india";
// This page owns the "how long is the wait" projections/scenarios intent, so it
// carries its own review stamp rather than the shared PERM-cluster date.
const UPDATED = "2026-07-21";
const UPDATED_HUMAN = "July 21, 2026";
// JSON-LD headline matches the on-page H1 (rendered by ToolFirstLayout `title`).
const TITLE = "EB-2 & EB-3 India: How Long Is the Wait?";
const DESC =
  "How long until an EB-2 or EB-3 India priority date is current? Illustrative wait-time scenarios based on historical visa-bulletin movement — clearly labeled estimates, not predictions — plus what actually drives the numbers.";
const VISA_BULLETIN_URL =
  "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html";

export const metadata: Metadata = pageMetadata({
  title: "EB-2 & EB-3 India Wait-Time Scenarios (Estimates)",
  description: DESC,
  path: PATH,
  type: "article",
  openGraph: { publishedTime: CLUSTER_PUBLISHED, modifiedTime: UPDATED },
});

const faq: FaqItem[] = [
  {
    question: "Can anyone predict when my EB-2 or EB-3 India date will be current?",
    answer:
      "No. No service — free or paid — can reliably predict future visa-bulletin cutoffs. The scenarios on this page are illustrative arithmetic based on historical movement, not forecasts. Actual movement is driven by annual demand, retrogression, spillover from other categories, and any change in law, none of which are predictable.",
  },
  {
    question: "How are the wait-time scenarios on this page calculated?",
    answer:
      "They apply a simple, stated assumption: that the India EB-2/EB-3 Final Action Date keeps advancing at its recent historical pace of roughly one to three months of priority-date space per calendar year. Multiplying the gap between your priority date and today's cutoff by that pace gives a wide range. It is arithmetic on a fragile assumption, not a promise.",
  },
  {
    question: "Why is the range so wide?",
    answer:
      "Because the cutoff does not move at a steady rate. In good years it may jump several months; in bad years it stalls or retrogresses (moves backward). A one-to-three-month annual pace already spans a 3× difference, and real outcomes can fall outside even that range in either direction.",
  },
  {
    question: "Where do I see the actual current EB-2 / EB-3 India date?",
    answer:
      "On the live category pages: EB-2 India and EB-3 India each show the current Final Action Date and Dates for Filing straight from the Department of State bulletin, with recent movement. This scenarios page never shows a live date — it is only for modeling the wait.",
  },
  {
    question: "Could a downgrade or category switch shorten my wait?",
    answer:
      "Sometimes. EB-2 and EB-3 India move independently, so when one is ahead a downgrade or interfiling can help — but it usually requires a new I-140 and does not reset your retained priority date. See the EB-2 vs EB-3 comparison for how to decide.",
  },
  {
    question: "Does an earlier PERM filing date really change my wait this much?",
    answer:
      "Yes. For PERM cases the PERM filing date is your priority date. Filing even a year earlier moves you ahead of everyone who filed after you — and given India's backlog, a one-year-earlier place in line can translate to years of difference in when your date becomes current.",
  },
  {
    question: "Where is the official visa bulletin?",
    answer:
      "The U.S. Department of State Visa Bulletin at travel.state.gov is the only official source for cutoff dates, and USCIS announces monthly which chart it will accept for I-485 filing. Always verify there and confirm your eligibility with an attorney — this page is educational only.",
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    clusterArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: CLUSTER_PUBLISHED,
      dateModified: UPDATED,
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "EB-2/EB-3 India Wait-Time Scenarios", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="eb2-eb3-priority-date-india"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "EB-2/EB-3 India Wait Scenarios" },
        ]}
        icon="⏳"
        category="Visa & Green Card"
        title="EB-2 & EB-3 India: How Long Is the Wait?"
        hook="Illustrative priority-date wait scenarios based on historical visa-bulletin movement — clearly labeled estimates, never predictions."
        accent="from-blue-700 to-indigo-600"
        badges={["Estimates only", "EB-2 / EB-3 India", "Scenario modeling"]}
        headerExtra={
          <Link href="/tools/priority-date-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
            Check your actual date →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Prominent estimates disclaimer */}
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-900">⚠️ These are estimates, not predictions</p>
                <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
                  Nobody can predict future visa-bulletin cutoffs. Everything below is
                  <strong> illustrative arithmetic</strong> on a single assumption — that the India
                  EB-2/EB-3 Final Action Date keeps moving at its recent historical pace. Real
                  movement is irregular, can retrogress (move backward), and can change with law.
                  Use these ranges to understand the <em>scale</em> of the wait, never as a timeline
                  to plan a specific date around.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What this page is for</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  This is the <strong>scenario-modeling</strong> page for the EB-2 and EB-3 India
                  backlog. It does not show a live cutoff date and it does not explain the
                  mechanics of the bulletin — it exists to help you grasp roughly how many years a
                  given priority date implies, so you can plan careers, H-1B extensions, and your
                  children&rsquo;s{" "}
                  <Link href="/green-card/cspa-kids-aging-out" className="text-brand-600 underline">CSPA</Link>{" "}
                  timelines around the right order of magnitude. For the current date, the concept,
                  or the causes of the backlog, use the links further down.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">How the scenarios are built</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The India EB-2 and EB-3 Final Action Dates have historically advanced only about
                  <strong> one to three months of priority-date space per calendar year</strong>. If
                  that pace held, the time for the cutoff to reach your priority date is roughly the
                  gap between your date and today&rsquo;s cutoff, divided by that pace. Because the
                  pace itself spans 1–3 months, every estimate is a wide range — and reality can
                  land outside it.
                </p>
              </div>

              {/* Scenario table */}
              <div className="overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-card">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <caption className="sr-only">
                    Illustrative EB-2/EB-3 India wait scenarios at historical movement pace
                  </caption>
                  <thead className="bg-ink-50/70 text-ink-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">If your priority date is around…</th>
                      <th className="px-4 py-3 font-bold">Gap to a ~2014 cutoff</th>
                      <th className="px-4 py-3 font-bold">Illustrative wait at 1–3 mo/yr</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 text-ink-600">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink-800">2015</td>
                      <td className="px-4 py-3">~1 year</td>
                      <td className="px-4 py-3">very roughly 4–12 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink-800">2018</td>
                      <td className="px-4 py-3">~4 years</td>
                      <td className="px-4 py-3">very roughly 15–45 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink-800">2021</td>
                      <td className="px-4 py-3">~7 years</td>
                      <td className="px-4 py-3">commonly modeled in decades</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink-800">2024</td>
                      <td className="px-4 py-3">~10 years</td>
                      <td className="px-4 py-3">commonly modeled in decades</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs leading-relaxed text-ink-400">
                Illustration only. Assumes today&rsquo;s India EB-2/EB-3 Final Action Date sits near
                2014 and advances 1–3 months per year with no retrogression — an assumption that has
                not held steadily in practice. Not legal advice. Verify current dates in the{" "}
                <a href={VISA_BULLETIN_URL} target="_blank" rel="noopener noreferrer" className="underline">
                  official visa bulletin
                </a>.
              </p>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <h3 className="text-base font-bold text-ink-900">What can push the real number off the estimate</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-600">
                  <li>• <strong>Retrogression:</strong> a demand spike can move the cutoff backward, erasing years of progress overnight.</li>
                  <li>• <strong>Spillover:</strong> unused numbers from other categories or countries can temporarily speed India dates in some years.</li>
                  <li>• <strong>Fiscal-year resets:</strong> numbers refresh every October 1, so early-year bulletins often move the most.</li>
                  <li>• <strong>Legislation:</strong> any change to the per-country cap would rewrite every scenario here.</li>
                </ul>
              </div>

              {/* Where to go for the real thing */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">For the actual dates and the why</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-600">
                  <li>• Current cutoffs &amp; movement: <Link href="/visa-bulletin/eb2-india" className="text-brand-600 underline">EB-2 India</Link> · <Link href="/visa-bulletin/eb3-india" className="text-brand-600 underline">EB-3 India</Link></li>
                  <li>• What a priority date is &amp; how the bulletin works: <Link href="/visa-bulletin/priority-date" className="text-brand-600 underline">priority date guide</Link></li>
                  <li>• Which category to choose: <Link href="/green-card/eb2-vs-eb3-india" className="text-brand-600 underline">EB-2 vs EB-3 for India</Link></li>
                  <li>• Why the backlog exists (causes &amp; scale): <Link href="/green-card/green-card-backlog-india" className="text-brand-600 underline">India green card backlog</Link></li>
                </ul>
              </div>

              <div className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm text-ink-600">
                Official source:{" "}
                <a href={VISA_BULLETIN_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline">
                  U.S. Department of State Visa Bulletin
                </a>. Cutoff dates change monthly — always verify there.
              </div>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks links={[...clusterLinks.filter((l) => l.href !== PATH), ...relatedImmigrationLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
