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
  { question: "How long does I-140 premium processing take?", answer: "USCIS acts within about 15 business days for most I-140 petitions, and about 45 business days for EB-1C and EB-2 NIW. If an RFE is issued, the clock pauses until you respond." },
  { question: "How much is the I-140 premium processing fee?", answer: "The current fee is shown on this page from our maintained data. Fees change, so always confirm the exact amount on the official USCIS Form I-907 page before filing." },
  { question: "Which I-140 categories are eligible for premium processing?", answer: "Most EB-1A, EB-1C, EB-2, EB-2 NIW, and EB-3 I-140 petitions are eligible. Timelines differ (EB-1C and NIW are ~45 business days). Confirm current eligibility on the USCIS I-907 page." },
  { question: "Is premium processing worth it?", answer: "It is most worth it when timing matters — an approaching H-1B six-year max-out, a priority date about to become current, or a job change where you need the approval fast. If none of those apply, standard processing saves the fee." },
  { question: "Does premium processing help my priority date?", answer: "No. Premium processing only speeds the I-140 decision. Your priority date and the Visa Bulletin wait are unaffected — for India EB-2/EB-3 you still wait years after approval to file I-485." },
  { question: "Can I add premium processing to a pending I-140?", answer: "Yes, in most cases you can upgrade a pending I-140 to premium processing by filing Form I-907. Confirm eligibility and current timelines with your attorney." },
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
            <div className="mx-auto max-w-3xl space-y-6">
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
            <PermClusterLinks title="Related I-140 & green card tools" links={[...i140ClusterLinks.filter((l) => l.href !== PATH), ...i140RelatedLinks]} />
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
