import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import RenewalFeeChecker from "@/components/tools/RenewalFeeChecker";
import EstimatedTimelineAnswer from "@/components/tools/EstimatedTimelineAnswer";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  gcRenewalClusterLinks,
  gcRenewalRelatedLinks,
  gcRenewalWebAppJsonLd,
  gcRenewalArticleJsonLd,
  GC_RENEWAL_PUBLISHED,
  GC_RENEWAL_UPDATED,
  GC_RENEWAL_UPDATED_HUMAN,
} from "@/lib/greenCardRenewalCluster";
import {
  greenCardRenewalFeeRows,
  feeFaqs,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";
import {
  feeTimingColumns,
  feeTimingRows,
  greenCardRenewalTimingConfig as T,
  greenCardRenewalOfficialLinks,
} from "@/data/greenCardRenewalTimelineData";

const PATH = "/green-card-renewal-fee";
const TITLE = "Green Card Renewal Fee 2026: $415 Online vs $465 Paper (Form I-90)";
const DESC =
  "Green card renewal costs $415 online or $465 by paper (Form I-90) — online is $50 cheaper. See the fee snapshot, fee-waiver basics, last-verified date, and official USCIS fee links.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: string }[] = [
  { h: "What the fee is right now", body: "As last verified, USCIS charges $415 to file Form I-90 online and $465 by paper — so filing online saves you $50. Fees change, so confirm the current figure on the USCIS Fee Schedule (G-1055) before you file or pay." },
  { h: "Online vs paper fee", body: "Online filing is $415 versus $465 by paper — $50 cheaper — and online filing also makes payment and case tracking easier. Choose the method that fits you, but the online discount applies to most I-90 renewals." },
  { h: "Is biometrics included?", body: "There is currently no separate biometrics fee for Form I-90 — biometrics, if required, is covered by the filing fee. Confirm on the current Fee Schedule and Form I-90 instructions, since USCIS fee structures have changed over time." },
  { h: "Fee waiver basics", body: "Some applicants who cannot pay may request a fee waiver using Form I-912. Eligibility is limited — for example, based on means-tested benefits, income, or financial hardship — and is never guaranteed. Review the official criteria carefully before requesting one." },
  { h: "Common fee mistakes", body: "Common mistakes include relying on an outdated fee amount, paying the wrong fee for your filing method, assuming biometrics is or isn't included, and paying an I-90 fee when a conditional card actually requires a different form and fee (I-751 or I-829)." },
  { h: "Refund warning", body: "USCIS filing fees are generally non-refundable, even if your application is denied or rejected. File carefully, confirm you are using the correct form, and double-check the current fee before submitting payment." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    faqJsonLd(feeFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: "/green-card-renewal" },
      { name: "Renewal Fee", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="green-card-renewal-fee"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal", href: "/green-card-renewal" },
          { label: "Renewal Fee" },
        ]}
        icon="💵"
        category="Visa & Green Card"
        title="Green Card Renewal Fee 2026: Form I-90 Cost & Fee Waiver"
        hook="What does it cost to renew a green card? See the Form I-90 fee snapshot, online vs paper, and fee-waiver basics — with links to the always-current USCIS fee."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#fee-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Get My Fee Checklist →</a>
            <a href={S.uscisFeeSchedule} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">USCIS Fee Schedule ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Fast Answer: the actual fee, first */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="How much is the green card renewal fee?"
              answerLabel="Form I-90 filing fee (2026)"
              answer={`${C.onlineFee} online · ${C.paperFee} paper`}
              rows={[
                { label: "Online (Form I-90)", value: C.onlineFee, note: C.feeSavingsOnline, highlight: true },
                { label: "Paper (Form I-90)", value: C.paperFee, note: "Mailed filing costs $50 more." },
                { label: "Biometrics", value: "$0", note: "No separate biometrics fee." },
                { label: "Fee waiver", value: "Form I-912", note: "Limited eligibility — never assume you qualify." },
              ]}
              badges={["Online is $50 cheaper", "Fee waiver may apply"]}
              lastVerified={GC_RENEWAL_UPDATED}
              sources={[
                { label: "USCIS Fee Schedule (G-1055)", href: S.uscisFeeSchedule },
                { label: "USCIS Fee Calculator", href: "https://www.uscis.gov/feecalculator" },
              ]}
              disclaimer={GC_RENEWAL_DISCLAIMER}
              ctaText="Get my personal fee checklist"
              ctaHref="#green-card-fee-tool"
            />
          </Container>
        </section>

        {/* Fast-answer fee + timing snapshot */}
        <section className="py-10 sm:py-12">
          <Container>
            <EstimatedTimelineAnswer
              title="Green Card Renewal Fee and Timing Snapshot"
              intro="How each filing situation affects your cost and timing. The base Form I-90 fee is $415 online / $465 paper — always confirm the current amount on USCIS before you pay."
              columns={feeTimingColumns}
              rows={feeTimingRows}
              badges={["Fees change", "Check USCIS Fee Schedule", "Online vs paper differs", "Conditional cards are different"]}
              summaryTitle="Green Card Renewal Fee Answer"
              summaryText="The green card renewal fee changes with USCIS rules. Do not rely on outdated blog fees. Always check the USCIS Fee Schedule before filing."
              sourceNote={T.sourceNote}
              officialLinks={greenCardRenewalOfficialLinks}
              ctaText="Check My Fee Situation"
              ctaHref="#green-card-fee-tool"
            />
          </Container>
        </section>

        {/* Fee snapshot table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Green Card Renewal Fee Snapshot</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">Base Form I-90 fee: <strong className="text-emerald-700">$415 online</strong> / <strong className="text-emerald-700">$465 paper</strong>. The situations below show when your total may differ — always confirm the current amount on USCIS before you pay.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {greenCardRenewalFeeRows.map((r) => (
                  <div key={r.situation} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.situation}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700">{r.possibleCost}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600"><span className="font-semibold text-ink-500">Check:</span> {r.whatToCheck}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{r.notes}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Filing situation</th>
                      <th className="p-3 font-semibold">Possible cost</th>
                      <th className="p-3 font-semibold">What to check</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {greenCardRenewalFeeRows.map((r) => (
                      <tr key={r.situation} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.situation}</td>
                        <td className="p-3 font-medium text-emerald-700">{r.possibleCost}</td>
                        <td className="p-3 text-ink-600">{r.whatToCheck}</td>
                        <td className="p-3 text-ink-600">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <a href="#fee-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">Get My Fee Checklist →</a>
              </div>
              <div className="mt-5 rounded-xl border border-ink-900/10 bg-ink-50/50 p-4">
                <p className="text-xs leading-relaxed text-ink-600">{C.sourceNote}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a href={S.uscisFeeSchedule} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">USCIS Fee Schedule ↗</a>
                  <a href={S.formI90} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Form I-90 ↗</a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section id="green-card-fee-tool" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <RenewalFeeChecker />
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Green card renewal fee, explained</h2>
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
            <ToolFaq items={feeFaqs} />
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
