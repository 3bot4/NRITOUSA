import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import GreenCardProcessingChecker from "@/components/tools/GreenCardProcessingChecker";
import RenewalTimelineTable from "@/components/tools/RenewalTimelineTable";
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
  greenCardRenewalProcessingStages,
  greenCardRenewalProcessingBadges,
  greenCardRenewalProcessingSummary,
  processingTimeFaqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";

const PATH = "/green-card-renewal-processing-time";
const TITLE = "Green Card Renewal Processing Time 2026";
const DESC =
  "See the green card renewal timeline, Form I-90 stages, receipt notice, biometrics, USCIS review, and how to check official processing times.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: string }[] = [
  { h: "Why processing times vary", body: "Form I-90 timing depends on USCIS workload, the office handling your case, whether biometrics is required, background checks, and whether USCIS issues a request for evidence. Two people who file the same week can have very different waits, which is why an office-specific number matters more than a single national figure." },
  { h: "How to check USCIS Form I-90 processing times", body: "Open the official USCIS processing-times page, select Form I-90, and choose your form category and office. Compare the posted range to how long your case has been pending. The page also shows a 'case inquiry date' — the point at which you may submit a service request." },
  { h: "What the receipt notice means", body: "After you file, USCIS mails a receipt notice (Form I-797C) confirming your case. For eligible renewal applicants, that notice may extend the validity of an expiring or expired green card. Keep the notice with your card and follow the instructions printed on it." },
  { h: "Does biometrics mean approval is close?", body: "Not necessarily. Biometrics lets USCIS run background and security checks. It is a good sign your case is moving, but review and any evidence requests can still follow. USCIS may also reuse prior biometrics instead of scheduling a new appointment." },
  { h: "What to do if your case is delayed", body: "First confirm your case is actually past the posted processing time for your office. If it is, and you are past the 'case inquiry date', you may submit a USCIS case inquiry (service request). Submitting earlier rarely helps. Keep your USCIS account and mailing address current." },
  { h: "How to track case status", body: "Use your USCIS online account and the USCIS Case Status tool to follow milestones such as receipt, biometrics, card production, and mailing. Watch for any USCIS mail, which may include a biometrics notice or a request for evidence with a deadline." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Green Card Renewal Processing Time by Stage", items: greenCardRenewalProcessingStages.map((r) => ({ name: r.step, description: r.whatHappens })) }),
    faqJsonLd(processingTimeFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: "/green-card-renewal" },
      { name: "Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="green-card-renewal-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal", href: "/green-card-renewal" },
          { label: "Processing Time" },
        ]}
        icon="⏳"
        category="Visa & Green Card"
        title="Green Card Renewal Processing Time 2026"
        hook="See the Form I-90 timeline stage by stage — receipt notice, biometrics, USCIS review, card production — and estimate where your case stands."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#processing-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Stage →</a>
            <a href={S.uscisProcessingTimes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">USCIS Processing Times ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Long Does Green Card Renewal Take?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Green card renewal processing time varies by USCIS workload, filing reason, biometrics, background checks, and whether USCIS requests more information. There is no single guaranteed timeline — check the official USCIS Processing Times tool for <strong>Form I-90</strong> and your own case status.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#processing-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Estimate my stage →</a>
                <a href={S.uscisCaseStatus} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Case status ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Static stage table */}
        <section className="py-10 sm:py-12">
          <Container>
            <RenewalTimelineTable
              title="Green Card Renewal Processing Time by Stage"
              intro="Renewal timing is not based on the filing date alone. This table shows what happens at each Form I-90 stage and what to check. Use the checker below for a personal estimate."
              rows={greenCardRenewalProcessingStages}
              badges={greenCardRenewalProcessingBadges}
              sourceNote={C.sourceNote}
              sourceLinks={[
                { label: "USCIS Processing Times", href: S.uscisProcessingTimes },
                { label: "USCIS Case Status", href: S.uscisCaseStatus },
                { label: "Form I-90", href: S.formI90 },
              ]}
              ctaText="Check My Stage"
              ctaHref="#processing-checker"
            />
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-card">
              <h3 className="text-base font-bold text-ink-900">Processing Time Planning Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{greenCardRenewalProcessingSummary}</p>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Estimate where your green card renewal stands</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">Enter a few case dates and details for a likely current stage and what to check next. No case number or personal data collected.</p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <GreenCardProcessingChecker />
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Understanding green card renewal timing</h2>
              <div className="mt-5 space-y-5">
                {SECTIONS.map((s) => (
                  <div key={s.h}>
                    <h3 className="text-base font-bold text-ink-900">{s.h}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-ink-500">{GC_RENEWAL_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox links={greenCardRenewalSourceLinks} />
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related Green Card Renewal Tools" links={[...gcRenewalClusterLinks.filter((l) => l.href !== PATH), ...gcRenewalRelatedLinks]} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={processingTimeFaqs} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={GC_RENEWAL_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
