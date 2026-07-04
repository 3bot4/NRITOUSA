import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import FormSelectorI90I751 from "@/components/tools/FormSelectorI90I751";
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
  i90VsI751Rows,
  i90VsI751Faqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";

const PATH = "/i90-vs-i751";
const TITLE = "Form I-90 vs I-751: Which Green Card Form Do You Need?";
const DESC =
  "Form I-90 vs I-751 vs I-829: which green card form do you need? Compare 10-year renewal and 2-year conditional cases, and use a form-selector tool.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: string }[] = [
  { h: "What Form I-90 is for", body: "Form I-90 (Application to Replace Permanent Resident Card) is generally used to renew or replace a standard 10-year green card — for example, when it is expiring or expired, lost, stolen, damaged, has incorrect information, or your name changed." },
  { h: "What Form I-751 is for", body: "Form I-751 (Petition to Remove Conditions on Residence) is generally used by conditional permanent residents who received a 2-year green card through marriage. It removes the conditions and, once approved, leads to a 10-year card." },
  { h: "What Form I-829 is for", body: "Form I-829 removes conditions for EB-5 investor conditional residents who hold a 2-year card. It is a separate process from both I-90 and I-751 and follows the investor immigration rules." },
  { h: "How to tell which card you have", body: "Look at the card's validity period. A card valid for 10 years is usually a standard permanent resident card (Form I-90 for renewal/replacement). A card valid for 2 years is usually conditional (Form I-751 for marriage-based, Form I-829 for investor-based)." },
  { h: "Why filing the wrong form is risky", body: "Filing Form I-90 when you actually need I-751 or I-829 can cause serious delays, rejections, or problems maintaining status. Conditional residents also have filing windows tied to their card's expiration, so the timing and the form both matter." },
  { h: "When to talk to an attorney", body: "If you are unsure which card you have, are close to a filing deadline, have a complex marriage or investor situation, or have had prior immigration issues, a qualified immigration attorney can help you pick the correct form and file on time." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Form I-90 vs Form I-751", items: i90VsI751Rows.map((r) => ({ name: r.situation, description: `${r.usuallyUse} — ${r.why}` })) }),
    faqJsonLd(i90VsI751Faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: "/green-card-renewal" },
      { name: "I-90 vs I-751", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i90-vs-i751"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal", href: "/green-card-renewal" },
          { label: "I-90 vs I-751" },
        ]}
        icon="📑"
        category="Visa & Green Card"
        title="Form I-90 vs I-751: Which Green Card Form Do You Need?"
        hook="I-90 renews a 10-year card; I-751 removes conditions on a 2-year marriage card. Compare the two (and I-829) and use a form-selector to avoid a costly mistake."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#form-selector" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Show My Likely Form →</a>
            <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">Form I-90 ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: I-90 or I-751?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                <strong>Form I-90</strong> is generally used to renew or replace a regular 10-year Permanent Resident Card. <strong>Form I-751</strong> is generally used by certain conditional permanent residents to remove conditions on a 2-year marriage-based green card. Filing the wrong form can cause serious delays.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#form-selector" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Use the form selector →</a>
                <a href={S.formI751} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Form I-751 ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Comparison table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Form I-90 vs Form I-751</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">Match your situation to the form you usually use. When unsure, confirm before filing.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {i90VsI751Rows.map((r) => (
                  <div key={r.situation} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.situation}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700">{r.usuallyUse}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{r.why}</p>
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
                      <th className="p-3 font-semibold">Usually use</th>
                      <th className="p-3 font-semibold">Why</th>
                      <th className="p-3 font-semibold">Warning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {i90VsI751Rows.map((r) => (
                      <tr key={r.situation} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.situation}</td>
                        <td className="p-3 font-medium text-emerald-700">{r.usuallyUse}</td>
                        <td className="p-3 text-ink-600">{r.why}</td>
                        <td className="p-3 text-amber-800">{r.warning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <a href="#form-selector" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">Show My Likely Form →</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <FormSelectorI90I751 />
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">I-90, I-751, and I-829 explained</h2>
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
            <ToolFaq items={i90VsI751Faqs} />
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
