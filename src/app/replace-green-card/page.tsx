import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import ReplaceGreenCardChecker from "@/components/tools/ReplaceGreenCardChecker";
import EstimatedTimelineAnswer from "@/components/tools/EstimatedTimelineAnswer";
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
  greenCardReplacementSituations,
  replaceFaqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";
import {
  replacementTimingColumns,
  replacementTimingRows,
  greenCardRenewalTimingConfig as T,
  greenCardRenewalOfficialLinks,
} from "@/data/greenCardRenewalTimelineData";

const PATH = "/replace-green-card";
const TITLE = "Replace Green Card: Lost, Stolen, Damaged, or Incorrect Card";
const DESC =
  "Lost, stolen, damaged, never-received, or incorrect green card? See when to file Form I-90, what documents to prepare, and how to get temporary proof.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: string }[] = [
  { h: "What to do if your green card is lost", body: "If your card is lost, you can generally file Form I-90 to request a replacement. Keep proof of your status for work, travel, and ID, and consider whether you need a temporary I-551/ADIT stamp while you wait for the new card." },
  { h: "What to do if it's stolen", body: "For a stolen card, file Form I-90 for a replacement and consider filing a police report for your records. Watch for possible identity-theft misuse of your personal information, and monitor your accounts." },
  { h: "What to do if it's damaged", body: "A damaged or unusable card can be replaced with Form I-90. Follow the USCIS instructions for submitting or returning the damaged card as part of your application." },
  { h: "What to do if the card has incorrect information", body: "You can use Form I-90 to correct certain card errors. Whether a fee applies may depend on whether USCIS caused the error or the mistake came from your original application — check the Form I-90 instructions." },
  { h: "What if your card never arrived", body: "If USCIS mailed your card but it never arrived, there is a specific non-delivery process. Time limits and steps may apply, so review the official guidance promptly and report the non-delivery." },
  { h: "How to get temporary proof", body: "If you need urgent evidence of status for travel, employment, or ID, you may be able to get temporary proof such as an ADIT/I-551 stamp, or use a USCIS receipt notice. Check current USCIS guidance for your situation." },
  { h: "Common mistakes", body: "Common mistakes include filing Form I-90 for a conditional 2-year card (which usually needs I-751 or I-829), relying on an outdated fee, missing non-delivery time limits, and traveling without confirming what documentation you need." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Green Card Replacement Situations", items: greenCardReplacementSituations.map((r) => ({ name: r.situation, description: r.whatToDo })) }),
    faqJsonLd(replaceFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: "/green-card-renewal" },
      { name: "Replace Green Card", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="replace-green-card"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal", href: "/green-card-renewal" },
          { label: "Replace Green Card" },
        ]}
        icon="🪪"
        category="Visa & Green Card"
        title="Replace Green Card: Lost, Stolen, Damaged, or Incorrect Card"
        hook="Lost, stolen, damaged, never-received, or incorrect card? See when Form I-90 applies, what documents to prepare, and how to get temporary proof."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#replace-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Replacement →</a>
            <a href={S.replaceGreenCard} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">Replace Your Green Card ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Do You Replace a Green Card?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                If your green card is lost, stolen, damaged, never received, or has incorrect information, you may need to file <strong>Form I-90</strong> to replace it. If you need urgent proof for travel, work, or DMV, check USCIS temporary proof options such as an I-551/ADIT stamp.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#replace-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Check my replacement →</a>
                <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Form I-90 ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Fast-answer replacement timeline estimate */}
        <section className="py-10 sm:py-12">
          <Container>
            <EstimatedTimelineAnswer
              title="Green Card Replacement Timeline Estimate"
              intro="How long replacement usually takes by reason, and when you may need temporary proof. These are planning ranges — always confirm on USCIS."
              columns={replacementTimingColumns}
              rows={replacementTimingRows}
              badges={["Usually Form I-90", "Timing varies", "Temporary proof for urgent needs", "Conditional cards are different"]}
              summaryTitle="Green Card Replacement Answer"
              summaryText="Replacing a green card usually uses Form I-90, but urgent travel, work, or DMV needs may require temporary proof while waiting. Timing is similar to a Form I-90 renewal and varies by USCIS workload."
              sourceNote={T.sourceNote}
              officialLinks={greenCardRenewalOfficialLinks}
              ctaText="Check My Replacement Steps"
              ctaHref="#replace-green-card-tool"
            />
          </Container>
        </section>

        {/* Situations table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Green Card Replacement Situations</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">Find your situation, the likely form, and what to watch for. The conditional-card row is the most important to get right.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {greenCardReplacementSituations.map((r) => (
                  <div key={r.situation} className={`rounded-2xl border p-4 shadow-card ${r.highlight ? "border-amber-300 bg-amber-50/60" : "border-ink-900/10 bg-white"}`}>
                    <p className="text-sm font-bold text-ink-900">{r.situation}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700">{r.likelyForm}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{r.whatToDo}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-amber-800"><span className="font-semibold">Warning:</span> {r.warning}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Situation</th>
                      <th className="p-3 font-semibold">Likely form</th>
                      <th className="p-3 font-semibold">What to do</th>
                      <th className="p-3 font-semibold">Warning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {greenCardReplacementSituations.map((r) => (
                      <tr key={r.situation} className={`align-top ${r.highlight ? "bg-amber-50/60" : ""}`}>
                        <td className="p-3 font-semibold text-ink-900">{r.situation}</td>
                        <td className="p-3 font-medium text-emerald-700">{r.likelyForm}</td>
                        <td className="p-3 text-ink-600">{r.whatToDo}</td>
                        <td className="p-3 text-amber-800">{r.warning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <a href="#replace-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Replacement →</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section id="replace-green-card-tool" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ReplaceGreenCardChecker />
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Replacing your green card, explained</h2>
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
            <ToolFaq items={replaceFaqs} />
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
