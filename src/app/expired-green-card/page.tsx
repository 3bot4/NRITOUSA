import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import GreenCardRenewalChecker from "@/components/tools/GreenCardRenewalChecker";
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
  expiredGreenCardConcerns,
  expiredCardFaqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";

const PATH = "/expired-green-card";
const TITLE = "Expired Green Card: What to Do Before Travel, Work, or Renewal";
const DESC =
  "An expired green card doesn't end your status, but it affects travel, work, and DMV. See what to do, receipt-notice extensions, and how to renew with Form I-90.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: string }[] = [
  { h: "Work proof with an expired card", body: "An expired card can complicate I-9 employment verification. A USCIS receipt notice or validity-extension documentation may help you prove work authorization. Talk with your employer's HR and check current USCIS guidance — do not assume you cannot work." },
  { h: "Travel warning", body: "Traveling internationally with an expired green card can be difficult: airlines and border officers may question the card. Check USCIS, airline, and consulate requirements before you travel, and consider whether you need a temporary I-551/ADIT stamp for re-entry." },
  { h: "DMV and ID issues", body: "State DMVs and other agencies may ask for unexpired evidence of status when you renew a license or ID. Bring your receipt notice and any USCIS extension documentation, and check the specific requirements of your state agency in advance." },
  { h: "Receipt notice extension", body: "USCIS has announced a validity extension (up to 36 months) for eligible lawful permanent residents who properly file Form I-90. The receipt notice, presented with the expired card, may serve as temporary evidence of status. Keep the notice and follow its instructions." },
  { h: "Temporary proof / ADIT note", body: "If you need urgent proof of status and the receipt notice isn't enough for your situation, you may be able to request a temporary I-551/ADIT stamp. Check current USCIS procedures for obtaining temporary evidence of permanent resident status." },
  { h: "When to file Form I-90", body: "If you have a standard 10-year card that expired or is expiring, file Form I-90 to renew it — online or by mail. Confirm the current fee on the USCIS Fee Schedule, keep your receipt notice, and track your case in your USCIS account." },
  { h: "When Form I-90 may be wrong", body: "If you have a 2-year conditional card, Form I-90 usually does not apply. Marriage-based conditional residents generally file Form I-751, and EB-5 investor conditional residents generally file Form I-829. Filing the wrong form can cause serious delays." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Expired Green Card Concerns", items: expiredGreenCardConcerns.map((r) => ({ name: r.concern, description: r.whatToDo })) }),
    faqJsonLd(expiredCardFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: "/green-card-renewal" },
      { name: "Expired Green Card", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="expired-green-card"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal", href: "/green-card-renewal" },
          { label: "Expired Green Card" },
        ]}
        icon="⌛"
        category="Visa & Green Card"
        title="Expired Green Card: What to Do Before Travel, Work, or Renewal"
        hook="An expired card doesn't end your status — but it affects work, travel, and DMV. See what to do, receipt-notice extensions, and how to renew with Form I-90."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Renewal Steps →</a>
            <a href={S.validityExtension36Months} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">36-Month Extension Alert ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: What Happens If My Green Card Expires?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                An expired green card does not automatically mean you lost permanent resident status, but the expired card can create problems for travel, employment verification, DMV, and proof of status. Many people renew with <strong>Form I-90</strong>, but conditional (2-year) residents may need a different process.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Check my renewal steps →</a>
                <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Form I-90 ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Concerns table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Expired Green Card: Common Concerns</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">What an expired card really means for each situation, and what to do next.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {expiredGreenCardConcerns.map((r) => (
                  <div key={r.concern} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.concern}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600"><span className="font-semibold text-ink-500">Reality:</span> {r.reality}</p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-800"><span className="font-semibold">Do:</span> {r.whatToDo}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Concern</th>
                      <th className="p-3 font-semibold">Reality</th>
                      <th className="p-3 font-semibold">What to do</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {expiredGreenCardConcerns.map((r) => (
                      <tr key={r.concern} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.concern}</td>
                        <td className="p-3 text-ink-600">{r.reality}</td>
                        <td className="p-3 text-ink-600">{r.whatToDo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Renewal Steps →</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <GreenCardRenewalChecker />
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Expired green card, explained</h2>
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
            <ToolFaq items={expiredCardFaqs} />
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
