import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import GreenCardRenewalChecker from "@/components/tools/GreenCardRenewalChecker";
import RenewalTimelineTable from "@/components/tools/RenewalTimelineTable";
import EstimatedTimelineAnswer from "@/components/tools/EstimatedTimelineAnswer";
import RenewalReasonCards from "@/components/tools/RenewalReasonCards";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  gcRenewalClusterLinks,
  gcRenewalRelatedLinks,
  gcRenewalWebAppJsonLd,
  gcRenewalArticleJsonLd,
  gcRenewalItemListJsonLd,
  GC_RENEWAL_PUBLISHED,
  GC_RENEWAL_UPDATED,
  GC_RENEWAL_UPDATED_HUMAN,
} from "@/lib/greenCardRenewalCluster";
import {
  greenCardRenewalTimelineRows,
  greenCardRenewalBadges,
  greenCardRenewalPlanningSummary,
  greenCardRenewalReasons,
  greenCardRenewalFaqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";
import {
  greenCardRenewalFastAnswerColumns,
  greenCardRenewalFastAnswerRows,
  greenCardRenewalTimingConfig as T,
  greenCardRenewalOfficialLinks,
} from "@/data/greenCardRenewalTimelineData";

const PATH = "/green-card-renewal";
const TITLE = "Green Card Renewal 2026: Timeline, Fee, Form I-90 & Checklist";
const DESC =
  "Learn how to renew or replace your green card with Form I-90. See timeline, fee, documents, online filing steps, and use a free renewal checklist tool.";

export const metadata: Metadata = pageMetadata({
  title: "Green Card Renewal 2026: Timeline, Fee & Form I-90",
  description: DESC,
  path: PATH,
});

const GUIDE: { h: string; body: string }[] = [
  { h: "What is green card renewal?", body: "Green card renewal is the process of getting a new Permanent Resident Card when your current 10-year card is expiring or has expired. It does not change your status — it updates the physical card that proves you are a lawful permanent resident. Most people renew using Form I-90." },
  { h: "Who should file Form I-90?", body: "Form I-90 is generally for lawful permanent residents with a 10-year card that is expiring or expired, or whose card is lost, stolen, damaged, has incorrect information, or whose name has legally changed. It is also used when a card was never received." },
  { h: "Who should not file Form I-90?", body: "Conditional permanent residents with a 2-year card usually should not use Form I-90 to remove conditions. Marriage-based conditional residents generally file Form I-751, and EB-5 investor conditional residents generally file Form I-829. Filing the wrong form can cause serious delays." },
  { h: "Green card renewal vs replacement", body: "Renewal usually refers to getting a new card when a 10-year card expires. Replacement usually refers to a lost, stolen, damaged, or incorrect card. Both are typically handled on Form I-90, but the reason you select affects the evidence and, sometimes, the fee." },
  { h: "Green card renewal documents", body: "A simple renewal may need little beyond your application, while a name change requires legal name-change evidence and a USCIS-error correction may require different documentation. Keep a clear copy or photo of your current card. Always follow the official Form I-90 instructions for your specific reason." },
  { h: "How to renew green card online", body: "Many residents file Form I-90 online by creating a free USCIS account, completing the form, uploading any required evidence, paying the fee, and submitting. Online filing usually makes it easier to upload documents and track the case. Some situations may still require mail filing." },
  { h: "What happens after filing I-90", body: "USCIS issues a receipt notice (Form I-797C). For eligible renewal applicants, that notice may extend green card validity. USCIS may schedule biometrics or reuse prior biometrics, review the application, possibly request more evidence, and — if approved — produce and mail the new card." },
  { h: "Biometrics for green card renewal", body: "USCIS may require a biometrics appointment for fingerprints, photo, and signature, or it may reuse previous biometrics. Watch for an appointment notice or a reuse notice in your USCIS account. Completing biometrics is a routine step and does not by itself mean approval is imminent." },
  { h: "Receipt notice and temporary proof", body: "USCIS has announced a validity extension (up to 36 months) for eligible I-90 renewals. The receipt notice, presented with your expired card, may serve as temporary evidence of status. Keep the notice with your card and follow USCIS instructions. If you need urgent proof, ask about an ADIT/I-551 stamp." },
  { h: "Expired green card: work, travel, DMV, and proof issues", body: "An expired card does not automatically end your permanent resident status, but it can complicate I-9 employment verification, international travel, and DMV/ID renewals. A receipt notice or extension documentation may help. Check USCIS, employer, airline, and consulate requirements before you rely on an expired card." },
  { h: "Green card renewal mistakes to avoid", body: "Common mistakes include filing Form I-90 for a conditional 2-year card, filing at the wrong time, submitting incomplete evidence, assuming an old fee amount, and ignoring the receipt notice. Verify the current fee, the correct form, and the required documents before filing." },
  { h: "When to talk to an immigration attorney", body: "Consider professional help if you have a conditional card, a complex history (such as criminal issues or prior immigration problems), an urgent travel need, a pending naturalization decision, or you are simply unsure which form applies. An attorney can help you avoid costly errors." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Green Card Renewal Timeline", items: greenCardRenewalTimelineRows.map((r) => ({ name: r.step, description: r.whatHappens })) }),
    faqJsonLd(greenCardRenewalFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="green-card-renewal"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal" },
        ]}
        icon="🟢"
        category="Visa & Green Card"
        title="Green Card Renewal 2026: Timeline, Fee, Form I-90 & Checklist"
        hook="Renew or replace your green card with a clear Form I-90 timeline, fee checklist, document list, online filing guide, and personalized next-step tool."
        badges={["Free educational checklist", "No case number", "No signup", "No personal data"]}
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Renewal Steps →</a>
            <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">Check USCIS Form I-90 ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Do You Renew a Green Card?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Most lawful permanent residents renew or replace a 10-year green card by filing <strong>Form I-90</strong> with USCIS. You may need Form I-90 if your card is expired, expiring, lost, stolen, damaged, has incorrect information, or your name changed. Conditional permanent residents with a 2-year card usually should <strong>not</strong> use Form I-90 to remove conditions; they generally need Form I-751 or I-829 depending on the case.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Use the checklist tool →</a>
                <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Form I-90 ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Fast-answer estimated timeline (above everything else) */}
        <section className="py-10 sm:py-12">
          <Container>
            <EstimatedTimelineAnswer
              title="Green Card Renewal Timeline Estimate"
              intro="Most users want the timeline first. The table below gives a quick planning estimate for Form I-90 renewal or replacement. Use the checker below for a personal next-step checklist."
              columns={greenCardRenewalFastAnswerColumns}
              rows={greenCardRenewalFastAnswerRows}
              badges={["Form I-90", "Estimated timeline first", "Check USCIS monthly", "Receipt may extend validity", "Conditional cards are different"]}
              summaryTitle="Green Card Renewal Planning Answer"
              summaryText="For a standard 10-year green card renewal, a practical planning range is about 8–14 months, but the current official Form I-90 processing time should always be checked on USCIS. After filing, users usually wait for a receipt notice, possible biometrics, USCIS review, approval, card production, and mailing."
              sourceNote={T.sourceNote}
              officialLinks={greenCardRenewalOfficialLinks}
              ctaText="Check My Renewal Steps"
              ctaHref="#green-card-renewal-tool"
            />
          </Container>
        </section>

        {/* Detailed stage table */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <RenewalTimelineTable
              title="Green Card Renewal Stages Explained"
              intro="Now that you have the estimate above, here is what happens at each Form I-90 stage. Use the personalized checklist below for your specific situation."
              rows={greenCardRenewalTimelineRows}
              badges={greenCardRenewalBadges}
              sourceNote={C.sourceNote}
              sourceLinks={[
                { label: "Form I-90", href: S.formI90 },
                { label: "USCIS Processing Times", href: S.uscisProcessingTimes },
                { label: "USCIS Fee Schedule", href: S.uscisFeeSchedule },
              ]}
              ctaText="Check My Renewal Steps"
              ctaHref="#green-card-renewal-tool"
            />

            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-card">
              <h3 className="text-base font-bold text-ink-900">Green Card Renewal Planning Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{greenCardRenewalPlanningSummary}</p>
            </div>
          </Container>
        </section>

        {/* Reasons table */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <RenewalReasonCards
              intro="Your situation decides which form you file and what evidence you need. The 2-year conditional card row is the most important to get right."
              reasons={greenCardRenewalReasons}
            />
          </Container>
        </section>

        {/* Tool */}
        <section className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Check Your Green Card Renewal Steps</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">The tables above give the general path. Answer a few questions for a personalized Form I-90 checklist, documents list, urgency level, and official links.</p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <GreenCardRenewalChecker />
            </div>
          </Container>
        </section>

        {/* Detailed guide */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Green card renewal, explained in detail</h2>
              <div className="mt-5 space-y-5">
                {GUIDE.map((g) => (
                  <div key={g.h}>
                    <h3 className="text-base font-bold text-ink-900">{g.h}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{g.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-ink-500">{GC_RENEWAL_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox links={greenCardRenewalSourceLinks} />
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related Green Card and Immigration Tools"
              links={[...gcRenewalClusterLinks.filter((l) => l.href !== PATH), ...gcRenewalRelatedLinks]}
            />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={greenCardRenewalFaqs} />
          </Container>
        </section>

        {/* Author */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={GC_RENEWAL_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
