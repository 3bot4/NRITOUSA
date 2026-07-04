import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import RenewOnlineChecklist from "@/components/tools/RenewOnlineChecklist";
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
  renewOnlineSteps,
  renewOnlineFaqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";
import {
  onlineTimelineColumns,
  onlineTimelineRows,
  greenCardRenewalTimingConfig as T,
  greenCardRenewalOfficialLinks,
} from "@/data/greenCardRenewalTimelineData";

const PATH = "/renew-green-card-online";
const TITLE = "Renew Green Card Online: Form I-90 Step-by-Step Guide";
const DESC =
  "Renew or replace your green card online with Form I-90. See the step-by-step USCIS online filing process, documents, fees, and a readiness checklist tool.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: string }[] = [
  { h: "Benefits of online filing", body: "Filing Form I-90 online through a free USCIS account usually lets you complete the form at your own pace, upload evidence directly, pay electronically, get an immediate confirmation, and track your case in one place. It also reduces the risk of a lost or delayed mailing." },
  { h: "When online filing may not be best", body: "Some situations may call for paper filing — for example, certain fee-waiver requests, unusual case types, or if you would rather not create an online account. Check the Form I-90 instructions, and remember that conditional 2-year card holders usually file a different form entirely (I-751 or I-829)." },
  { h: "Documents to prepare", body: "A simple renewal may need little beyond your application, while a name change requires legal name-change evidence and a USCIS-error correction may require different documentation. Have a clear copy or photo of your current card ready to upload, and follow the instructions for your specific reason." },
  { h: "Common mistakes", body: "Watch for typos in your name or A-number, choosing the wrong reason for filing, forgetting required evidence, assuming an outdated fee amount, and — most seriously — filing Form I-90 for a conditional 2-year card. Review every answer before you submit." },
  { h: "What happens after online filing", body: "USCIS issues a receipt notice (which may extend green card validity for eligible renewals), may schedule biometrics or reuse prior biometrics, reviews the application, may request more evidence, and — if approved — produces and mails the new card. Track everything in your USCIS account." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Online Green Card Renewal Steps", items: renewOnlineSteps.map((r) => ({ name: r.step, description: r.whatHappens })) }),
    faqJsonLd(renewOnlineFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: "/green-card-renewal" },
      { name: "Renew Online", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="renew-green-card-online"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal", href: "/green-card-renewal" },
          { label: "Renew Online" },
        ]}
        icon="💻"
        category="Visa & Green Card"
        title="Renew Green Card Online: Form I-90 Step-by-Step Guide"
        hook="File Form I-90 online with a free USCIS account. See the exact step-by-step process, what to prepare, and check your online filing readiness."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#online-checklist" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Readiness →</a>
            <a href={S.uscisFileOnline} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">USCIS File Online ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: Can You Renew a Green Card Online?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Many lawful permanent residents can renew or replace a green card online by creating a free USCIS online account and filing <strong>Form I-90</strong>. Some users may need to file by mail or use a different form depending on their situation.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#online-checklist" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Check readiness →</a>
                <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Form I-90 ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Fast-answer online timeline estimate */}
        <section className="py-10 sm:py-12">
          <Container>
            <EstimatedTimelineAnswer
              title="Online Green Card Renewal Timeline"
              intro="Here is how the online Form I-90 process usually flows and roughly how long each step takes."
              columns={onlineTimelineColumns}
              rows={onlineTimelineRows}
              badges={["Online may be easier", "Not guaranteed faster", "Timing varies", "Check USCIS"]}
              summaryTitle="Does Filing Online Make It Faster?"
              summaryText="Renewing online may make filing and tracking easier, but it does not guarantee faster USCIS approval. Processing time still depends on USCIS workload and case facts."
              sourceNote={T.sourceNote}
              officialLinks={greenCardRenewalOfficialLinks}
              ctaText="Check Online Filing Readiness"
              ctaHref="#online-renewal-tool"
            />
          </Container>
        </section>

        {/* Steps table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Online Green Card Renewal Steps</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">The usual order for filing Form I-90 online. Do the readiness check below before you start.</p>
              <ol className="mt-5 space-y-3">
                {renewOnlineSteps.map((s, i) => (
                  <li key={s.step} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{s.step}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{s.whatHappens}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-400"><span className="font-semibold text-ink-500">Check:</span> {s.whatToCheck}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-5">
                <a href="#online-checklist" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Online Filing Readiness →</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section id="online-renewal-tool" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <RenewOnlineChecklist />
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Online filing, explained</h2>
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
            <ToolFaq items={renewOnlineFaqs} />
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
