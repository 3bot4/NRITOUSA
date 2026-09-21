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
  i140ClusterLinks,
  i140RelatedLinks,
  i140ArticleJsonLd,
  I140_PUBLISHED,
  I140_UPDATED,
  I140_UPDATED_HUMAN,
} from "@/lib/i140Cluster";
import { i140ProcessingData as D, i140SnapshotRows, i140SnapshotSources, I140_ESTIMATE_VERIFIED, I140_ESTIMATE_DISCLAIMER } from "@/data/i140ProcessingData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import { getPremiumFeeByForm, premiumProcessing } from "@/lib/premiumProcessing";

const PATH = "/i140-premium-processing";
const TITLE = "I-140 Premium Processing 2026: Fee, Timeline & Eligibility";
const DESC =
  "I-140 premium processing explained — the fee, the 15 business-day timeline, which categories qualify, and when it is worth it.";

export const metadata: Metadata = pageMetadata({
  title: "I-140 Premium Processing 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is I-140 premium processing?", answer: "It is a paid USCIS service (Form I-907) that guarantees USCIS will act on your I-140 within a set number of business days — approve, deny, or issue an RFE. It speeds up USCIS action only, not the Visa Bulletin or green card availability." },
  { question: "How long does I-140 premium processing take?", answer: `USCIS acts within about ${D.premiumBusinessDays} business days for most I-140 petitions, and about ${D.niwEb1cPremiumBusinessDays} business days for EB-1C and EB-2 NIW. The period starts when USCIS receives a properly completed Form I-907 at the correct address — not when it received the I-140. If USCIS issues an RFE or a notice of intent to deny, the period stops and resets: a brand-new period begins when your response arrives, so an RFE costs you the full clock again rather than the days already run.` },
  { question: "How much is the I-140 premium processing fee?", answer: "The current fee is shown on this page from our maintained data. Fees change, so always confirm the exact amount on the official USCIS Form I-907 page before filing." },
  { question: "Which I-140 categories are eligible for premium processing?", answer: "Most EB-1A, EB-1C, EB-2, EB-2 NIW, and EB-3 I-140 petitions are eligible. Timelines differ (EB-1C and NIW are ~45 business days). Confirm current eligibility on the USCIS I-907 page." },
  { question: "Is premium processing worth it?", answer: "It is most worth it when timing matters — an approaching H-1B six-year max-out, a priority date about to become current, or a job change where you need the approval fast. If none of those apply, standard processing saves the fee." },
  { question: "Does premium processing help my priority date?", answer: "No. Premium processing only speeds the I-140 decision. Your priority date and the Visa Bulletin wait are unaffected — for India EB-2/EB-3 you still wait years after approval to file I-485." },
  { question: "Can I add premium processing to a pending I-140?", answer: "Yes, in most cases. You file Form I-907 on its own, referencing the pending I-140's receipt number, rather than refiling the petition. The clock runs from when USCIS receives that properly completed I-907, so a petition that has already sat in the queue for months does not get credit for the wait." },
  { question: "What happens if USCIS misses the premium processing deadline?", answer: "USCIS refunds the premium processing fee and continues to handle the case as a premium request. You get the money back, not a decision — so premium processing buys a refund guarantee, never an outcome guarantee." },
  { question: "Can USCIS suspend premium processing for I-140?", answer: "It has before. USCIS has suspended premium processing for I-140 petitions during periods of high volume or operational strain, sometimes at short notice. If your plan depends on a 15-business-day decision — an H-1B max-out date, for example — treat availability as something to confirm on the USCIS I-907 page on the day you file, not as a fixed feature." },
  { question: "Is this page legal advice?", answer: "No. This page is educational only and not legal advice. Verify fees and timelines on official USCIS pages and confirm your case with your employer's immigration attorney." },
];

export default function Page() {
  const i140Fee = getPremiumFeeByForm("I-140")[0];
  const jsonLd = jsonLdGraph(
    i140ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I140_PUBLISHED, dateModified: I140_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-140 Premium Processing", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i140-premium-processing"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-140 Premium Processing" },
        ]}
        icon="⚡"
        category="Visa & Green Card"
        title="I-140 Premium Processing"
        hook="The fee, the 15 business-day timeline, which categories qualify, and when it is worth paying for."
        accent="from-violet-600 to-indigo-600"
        badges={["Form I-907", "~15 business days", "Fee & eligibility"]}
        headerExtra={
          <Link href="/i140-processing-time" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700">
            Estimate your I-140 timeline →
          </Link>
        }
      >
        {/* Fast Answer: I-140 premium */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="I-140 premium processing at a glance"
              accent="brand"
              rows={i140SnapshotRows}
              badges={["15 business days", "Fee $2,965"]}
              lastVerified={I140_ESTIMATE_VERIFIED}
              sources={i140SnapshotSources}
              disclaimer={I140_ESTIMATE_DISCLAIMER}
            />
          </Container>
        </section>

        <section className="pb-10 pt-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8">
              {/* fee + timeline cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-700">I-140 premium fee</p>
                  <p className="mt-1 text-2xl font-extrabold text-ink-900">{i140Fee ? i140Fee.feeDisplay : "See USCIS I-907"}</p>
                  <p className="mt-1 text-xs text-ink-500">Form I-907 · verify on USCIS before filing</p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Timeline</p>
                  <p className="mt-1 text-2xl font-extrabold text-ink-900">~{D.premiumBusinessDays} business days</p>
                  <p className="mt-1 text-xs text-ink-500">~{D.niwEb1cPremiumBusinessDays} business days for EB-1C and EB-2 NIW</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What premium processing does (and doesn&rsquo;t) do</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Premium processing guarantees USCIS will <strong>act</strong> on your I-140 within the timeline — approve, deny, or issue an RFE. It does <strong>not</strong> improve approval odds, and it does <strong>not</strong> move your priority date or the Visa Bulletin. For India EB-2/EB-3 applicants, a fast I-140 approval still leads to a multi-year wait for a current priority date before I-485.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">When it is worth paying for</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-600">
                  <li>→ Your H-1B six-year max-out is approaching and an approved I-140 unlocks 3-year extensions.</li>
                  <li>→ Your priority date is about to become current and you need the approval to file I-485.</li>
                  <li>→ You are changing employers and want the approval (and priority date protection) locked in.</li>
                  <li>→ You want certainty of timing rather than an open-ended standard queue.</li>
                </ul>
              </div>

              {/* ── how the clock actually runs ─────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  How the {D.premiumBusinessDays}-day clock actually runs
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The guarantee is narrower than it sounds, and three details decide
                  whether it delivers what you paid for.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">It starts on the I-907, not the I-140</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      The period begins when USCIS receives a <em>properly completed</em>{" "}
                      Form I-907 at the correct filing address — with the required
                      information, a valid signature and the correct fee. A form that
                      arrives incomplete or at the wrong address has not started anything.
                      If you are upgrading a petition that has been pending for months,
                      the clock starts now; the months already served earn nothing.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">An RFE resets it — it does not pause it</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      This is the detail that catches people out. If USCIS issues a request
                      for evidence or a notice of intent to deny, the premium period{" "}
                      <strong>stops and resets</strong>: a full new period starts when your
                      response is received. Eleven days already run do not carry over. An
                      RFE on a premium case therefore costs the whole clock again, plus
                      however long you take to answer — which is why a well-documented
                      petition matters more to your real timeline than the fee does.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">Missing the deadline buys a refund, not a decision</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      If USCIS does not act within the period, it refunds the premium fee
                      and carries on processing the case as a premium request. That is the
                      entire remedy. Premium processing is a refund guarantee on speed, not
                      a guarantee of either speed or approval — so do not build a plan that
                      only works if the {D.premiumBusinessDays} days hold.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── what it cannot fix ──────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  What paying will not change
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  For an Indian applicant in EB-2 or EB-3, the I-140 is rarely the binding
                  constraint, and it is worth being precise about which waits premium
                  processing touches. It shortens exactly one of them.
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
                  <li>
                    <strong className="text-ink-900">It does not move your priority date.</strong>{" "}
                    Your date was set when the PERM (or the I-140, for categories without
                    one) was filed. A faster approval confirms the date; it does not
                    advance it.{" "}
                    <Link href="/eb2-eb3-priority-date-india" className="font-semibold text-brand-600 underline">
                      Check where India EB-2/EB-3 stands
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-ink-900">It does not speed up the I-485.</strong>{" "}
                    Filing the two concurrently does not extend premium treatment to the
                    adjustment application, which runs on its own queue.{" "}
                    <Link href="/i485-processing-time" className="font-semibold text-brand-600 underline">
                      I-485 processing time
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-ink-900">It does not improve your odds.</strong>{" "}
                    The same officers apply the same standard. A thin petition adjudicated
                    quickly is an RFE or a denial arriving quickly.
                  </li>
                  <li>
                    <strong className="text-ink-900">It does not unlock the earlier steps.</strong>{" "}
                    Nothing about I-907 touches the PERM or prevailing-wage queues that sit
                    ahead of the I-140.{" "}
                    <Link href="/perm-processing-time-calculator" className="font-semibold text-brand-600 underline">
                      PERM timeline
                    </Link>
                    .
                  </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  Read against that list, the genuinely good reasons to pay are the ones
                  where a date is bearing down on you — an H-1B max-out, a priority date
                  about to become current, or a job change you want the approval locked in
                  before.
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-sm leading-relaxed text-amber-900">
                <strong>Verify fees before filing.</strong> {premiumProcessing.warning}{" "}
                <a href={premiumProcessing.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{premiumProcessing.officialSourceName}</a>.
              </div>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related I-140 & green card tools"
              links={[
                {
                  href: "/uscis/expedite-request",
                  label: "USCIS expedite requests",
                  desc: "The five criteria, and why an expedite is not available at all where premium processing exists",
                },
                ...i140ClusterLinks.filter((l) => l.href !== PATH),
                ...i140RelatedLinks,
              ]}
            />
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
            <AuthorReviewLine lastUpdated={I140_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
