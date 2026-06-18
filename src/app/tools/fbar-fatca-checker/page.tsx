import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import FbarFatcaChecker from "@/components/tools/FbarFatcaChecker";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("fbar-fatca-checker")!;
const LAST_UPDATED = "2026-06-10";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/fbar-fatca-checker",
});

const faq: FaqItem[] = [
  {
    question: "What is FBAR?",
    answer:
      "FBAR (Report of Foreign Bank and Financial Accounts, FinCEN Form 114) is an annual report US persons file when the combined value of their foreign financial accounts exceeded $10,000 at any point during the calendar year. It's filed online through the BSA e-filing system — separately from your tax return — and is due April 15 with an automatic extension to October 15.",
  },
  {
    question: "What is FATCA / Form 8938?",
    answer:
      "FATCA (Foreign Account Tax Compliance Act) requires certain taxpayers to report specified foreign financial assets on IRS Form 8938, filed with the federal tax return. Its thresholds are much higher than FBAR's and depend on filing status and where you live — starting at more than $50,000 (year-end) for single filers living in the US. Many NRIs end up filing both FBAR and Form 8938 for the same accounts.",
  },
  {
    question: "Are NRE and NRO accounts foreign accounts for US reporting?",
    answer:
      "Generally yes. NRE and NRO accounts are accounts at financial institutions located outside the US, so they typically count toward FBAR and FATCA totals — even though NRE interest is tax-free in India. NRE/NRO interest is also generally taxable income on a US return. The India-side tax treatment doesn't change the US-side reporting picture.",
  },
  {
    question: "Do Indian fixed deposits count?",
    answer:
      "Generally yes. Fixed deposits are financial accounts at a foreign institution, so they typically count toward the FBAR $10,000 aggregate and FATCA totals. A common trap: each FD is its own account, auto-renewals keep old FDs alive longer than people remember, and the value to use is the highest balance during the year, including accrued interest.",
  },
  {
    question: "What exchange rate should I use to convert INR to USD?",
    answer:
      "FBAR instructions point to the US Treasury's Bureau of the Fiscal Service year-end exchange rate for converting maximum account values. Whatever source you use, be consistent across all accounts and keep a note of the rate and date — inconsistent conversions are one of the most common DIY mistakes. A CPA can confirm the right rate for your forms.",
  },
  {
    question: "Is FBAR the same as a tax return?",
    answer:
      "No. FBAR is an information report filed with FinCEN (a Treasury bureau) through the BSA e-filing system, completely separate from your IRS tax return. Filing your 1040 doesn't satisfy FBAR, and filing FBAR doesn't report any income — interest from those accounts still belongs on your tax return, and Form 8938 (if required) is attached to the return itself.",
  },
  {
    question: "Should I ask a CPA about my India accounts?",
    answer:
      "If you have NRE/NRO accounts, FDs, mutual funds, or other Indian financial assets and you're a US person, a CPA familiar with US–India cross-border reporting is usually worth the fee — at least for the first year. Indian mutual funds in particular can raise PFIC questions that are genuinely complex. Use this tool's checklist to arrive at the meeting with documents and questions ready.",
  },
  {
    question: "What if I forgot to report in previous years?",
    answer:
      "Don't panic, and don't just start filing silently going forward. The IRS has formal catch-up routes — including the Streamlined Filing Compliance Procedures for non-willful cases and the Delinquent FBAR Submission Procedures — that can sharply reduce or eliminate penalties when used correctly. Which route fits depends on your facts, so this is exactly the situation to take to a qualified cross-border tax professional.",
  },
];

export default function FbarFatcaCheckerPage() {
  const url = absoluteUrl("/tools/fbar-fatca-checker");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/fbar-fatca-checker" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      {/* Top disclaimer + checker */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <DisclaimerBox title="Important">
              This FBAR/FATCA checker is for educational purposes only and is
              not tax, legal, financial, or immigration advice. Rules are
              complex and can change. Please consult a qualified CPA or tax
              professional familiar with US and India cross-border tax
              reporting.
            </DisclaimerBox>
          </div>
          <FbarFatcaChecker />
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-sm">
            <strong className="font-semibold text-ink-900">
              Want to organize all your accounts in one place?
            </strong>{" "}
            <span className="text-ink-600">
              The free{" "}
              <Link href="/nri-wealth-checkup" className="font-semibold text-brand-700 underline">
                NRI Global Wealth &amp; Tax Organizer
              </Link>{" "}
              screens FBAR, FATCA/Form 8938, PFIC, foreign tax credit, and India income together and
              builds a CPA/CA question list and PDF report.
            </span>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            Thresholds summarized from FinCEN Form 114 and IRS Form 8938
            instructions; verify against current IRS guidance each tax season.
          </p>
        </Container>
      </section>

      {/* Common mistakes */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Watch out"
            title="Common mistakes NRIs make"
            description="None of these mean trouble by themselves — they're just the spots where well-meaning filers most often slip."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Using the year-end balance",
                body: "FBAR looks at the highest combined value at any time during the year — a property sale or bonus that passed through an account for a week still counts at its peak.",
              },
              {
                title: "Forgetting old India accounts",
                body: "Dormant savings accounts from before you moved, accounts opened by parents in your name, and joint accounts all count toward the combined total.",
              },
              {
                title: "Forgetting FDs",
                body: "Each fixed deposit is its own account, and auto-renewal keeps them alive for years. Collect every FD receipt, not just the active bank statement.",
              },
              {
                title: "Ignoring signature authority",
                body: "An account you can operate but don't own — a parent's account, an employer's account — can still create FBAR reporting questions for you.",
              },
              {
                title: "Assuming NRE/NRO don't matter",
                body: "India-side tax treatment (like tax-free NRE interest) doesn't change US-side reporting. NRE and NRO accounts generally count toward both FBAR and FATCA totals.",
              },
              {
                title: "Confusing FBAR with FATCA",
                body: "They're separate regimes with separate forms, thresholds, and filing channels. Being under one threshold says nothing about the other — FBAR's $10,000 line is far lower.",
              },
              {
                title: "Inconsistent INR→USD conversion",
                body: "Mixing rate sources across accounts produces totals that don't reconcile. Pick one source (e.g. the Treasury year-end rate), use it everywhere, and note it down.",
              },
              {
                title: "Waiting until the deadline",
                body: "Indian banks can be slow to produce historical statements. Start gathering highest-balance records well before tax season, not the week the return is due.",
              },
            ].map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
              >
                <h3 className="text-sm font-bold text-ink-900">{m.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>

      {/* Related guides + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={[
              "fbar-fatca-nri-guide",
              "nre-nro-accounts-explained",
              "indian-income-us-tax-return",
              "h1b-first-tax-return-guide",
              "catch-up-missed-fbar-streamlined",
              "pfic-indian-mutual-funds-trap",
            ]}
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/fbar-fatca-checker" />
        </Container>
      </section>
    </>
  );
}
