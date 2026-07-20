import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorBioBox from "@/components/AuthorBioBox";
import { ToolIntro, ReferenceTable } from "@/components/tools/ToolHub";
import { getToolHubContent } from "@/lib/toolHubContent";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  taxComplianceSnapshotRows,
  taxComplianceSources,
  TAX_COMPLIANCE_VERIFIED,
  TAX_COMPLIANCE_DISCLAIMER,
} from "@/data/siteWideVerifiedNumbers";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import HubLinkGroups from "@/components/HubLinkGroups";
import RelatedHubs from "@/components/RelatedHubs";
import FbarFatcaChecker from "@/components/tools/FbarFatcaChecker";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  toolArticleJsonLd,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("fbar-fatca-checker")!;
const content = getToolHubContent("fbar-fatca-checker")!;
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
    question: "If I have to file FBAR, do I automatically have to file Form 8938?",
    answer:
      "No — the two tests are independent, and you have to run each one separately. FBAR is triggered when the combined maximum value of your foreign financial accounts tops $10,000 at any point in the calendar year; that is an aggregate test across all accounts, not a per-account one. Form 8938 uses its own, much higher thresholds that depend on your filing status and on whether you meet the IRS definition of living abroad. You can easily owe one and not the other, or both. Note too that reporting an account does not itself create any tax — but income from that account, such as NRE/NRO interest, may still be taxable on your US return.",
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
      "For FBAR, you convert each account's maximum value during the calendar year to US dollars using the Treasury Reporting Rates of Exchange for the last day of that calendar year — published by the Treasury Bureau of the Fiscal Service. Form 8938 is separate: value specified foreign financial assets at fair market value in US dollars following the Form 8938 instructions for that year. Always pull the rate for the year you are actually reporting, apply one consistent source across every account, and keep a record of the rate and where it came from — inconsistent conversions are one of the most common DIY mistakes.",
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
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: content.description,
      url,
      applicationCategory: content.appCategory,
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    toolArticleJsonLd({
      path: "/tools/fbar-fatca-checker",
      headline: tool.seoTitle,
      description: content.description,
      datePublished: "2026-06-16",
      dateModified: content.updated ?? "2026-06-16",
    }),
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

      <ToolFirstLayout
        toolSlug="fbar-fatca-checker"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Worried your NRE/NRO accounts, FDs, or mutual funds need US reporting? Check FBAR & FATCA in about a minute."
        accent={tool.accent}
        sourceNote={
          <>
            Thresholds summarized from FinCEN Form 114 and IRS Form 8938
            instructions · last updated{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>. Verify against
            current IRS guidance before filing.
          </>
        }
        disclaimerExtra={
          <p>
            This FBAR/FATCA checker is for educational purposes only and is not
            tax, legal, financial, or immigration advice. Rules are complex and
            can change. Please consult a qualified CPA or tax professional
            familiar with US and India cross-border tax reporting.
          </p>
        }
      >
        {/* Fast Answer: FBAR/FATCA thresholds first */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="FBAR & FATCA — thresholds and deadlines"
              accent="brand"
              rows={taxComplianceSnapshotRows}
              badges={["FBAR $10,000", "Due Apr 15 → auto Oct 15"]}
              lastVerified={TAX_COMPLIANCE_VERIFIED}
              sources={taxComplianceSources}
              disclaimer={TAX_COMPLIANCE_DISCLAIMER}
              ctaText="Check if I need to file"
              ctaHref="#fbar-fatca-tool"
            />
          </Container>
        </section>

        {/* Checker */}
        <section id="fbar-fatca-tool" className="scroll-mt-24 pb-12 pt-10 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>
          <FbarFatcaChecker />
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 text-sm">
            <strong className="font-semibold text-ink-900">
              FBAR/FATCA is only one part of your filing year.
            </strong>{" "}
            <span className="text-ink-600">
              If you also have Indian income, TDS, a property sale, or India ITR
              questions, use the{" "}
              <Link
                href="/tools/nri-tax-filing-roadmap"
                className="font-semibold text-brand-700 underline"
              >
                DIY NRI tax filing roadmap
              </Link>{" "}
              to see the full U.S. + India checklist.
            </span>
          </div>
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
          <div className="mx-auto mt-8 max-w-3xl">
            <ReturnToIndiaLeadMagnetCard />
          </div>
        </Container>
      </section>

      {/* Threshold reference tables + how the check works + context */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="space-y-12">
            {[...(content.table ? [content.table] : []), ...(content.tables ?? [])].map(
              (tbl) => (
                <ReferenceTable key={tbl.caption ?? tbl.headers.join("|")} table={tbl} />
              )
            )}

            {content.howItWorks && (
              <div className="mx-auto max-w-3xl">
                <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                  {content.howItWorks.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {content.howItWorks.body}
                </p>
              </div>
            )}

            {content.connects && (
              <div className="mx-auto max-w-3xl">
                <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                  {content.connects.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {content.connects.body}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {content.connects.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
                      >
                        {l.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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

      {/* FBAR/FATCA Resource Center */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Resource center"
            title="FBAR/FATCA Resource Center for NRIs"
            description="The forms, deadlines, tools, and guides that surround foreign-account reporting — so you can see the whole picture, not just the threshold check above."
          />
          <HubLinkGroups
            columns={4}
            groups={[
              {
                title: "Forms",
                links: [
                  {
                    label: "FBAR / FinCEN Form 114",
                    href: "/articles/fbar-fatca-nri-guide",
                    desc: "Annual report of foreign accounts when the combined total tops $10,000.",
                  },
                  {
                    label: "FATCA / IRS Form 8938",
                    href: "/articles/fbar-fatca-nri-guide",
                    desc: "Specified foreign assets filed with your federal tax return.",
                  },
                  {
                    label: "Schedule B foreign account question",
                    desc: "Part III asks whether you have a foreign account — answer it honestly.",
                  },
                  {
                    label: "Form 8621 / PFIC for Indian mutual funds",
                    href: "/articles/pfic-indian-mutual-funds-trap",
                    desc: "Indian mutual funds are usually PFICs with punitive US tax rules.",
                  },
                  {
                    label: "Form 3520 for foreign gifts/inheritance",
                    href: "/tools/form-3520-india-gift-checker",
                    desc: "Reports large gifts or inheritance from parents/relatives in India.",
                  },
                ],
              },
              {
                title: "Timelines",
                links: [
                  {
                    label: "FBAR annual deadline",
                    desc: "Due April 15 each year, alongside your federal return.",
                  },
                  {
                    label: "FBAR automatic extension",
                    desc: "Automatically extended to October 15 — no form to file.",
                  },
                  {
                    label: "Form 8938 timing",
                    desc: "Attached to and filed with your federal income tax return.",
                  },
                  {
                    label: "Prior-year cleanup / missed filing",
                    href: "/articles/catch-up-missed-fbar-streamlined",
                    desc: "Streamlined & delinquent-FBAR routes for catching up on missed years.",
                  },
                ],
              },
              {
                title: "Related tools",
                links: [
                  {
                    label: "DIY NRI Tax Filing Roadmap",
                    href: "/tools/nri-tax-filing-roadmap",
                  },
                  {
                    label: "NRI Tax Forms & Limits Center",
                    href: "/india-tax-compliance/nri-tax-forms-limits",
                  },
                  {
                    label: "NRI Wealth & Tax Organizer",
                    href: "/nri-wealth-checkup",
                  },
                  {
                    label: "DTAA / Foreign Tax Credit Calculator",
                    href: "/calculators/dtaa-foreign-tax-credit",
                  },
                  {
                    label: "Form 3520 Gift Checker",
                    href: "/tools/form-3520-india-gift-checker",
                  },
                ],
              },
              {
                title: "Related guides",
                links: [
                  {
                    label: "FBAR for NRE/NRO accounts",
                    href: "/articles/fbar-nre-nro-accounts",
                  },
                  {
                    label: "NRE/NRO/FD tax guide",
                    href: "/articles/nre-nro-accounts-explained",
                  },
                  {
                    label: "Indian income on a U.S. tax return",
                    href: "/articles/indian-income-us-tax-return",
                  },
                  {
                    label: "PFIC / Indian mutual funds guide",
                    href: "/articles/pfic-indian-mutual-funds-trap",
                  },
                  {
                    label: "Catching up on missed FBARs",
                    href: "/articles/catch-up-missed-fbar-streamlined",
                  },
                ],
              },
            ]}
          />

          {/* Next step CTA */}
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-ink-900">
                Next step: organize every account in one place
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-ink-600">
                The free NRI Wealth Checkup screens FBAR, FATCA, PFIC, foreign
                tax credit, and India income together and builds a CPA/CA
                question list and PDF report.
              </p>
            </div>
            <Link
              href="/nri-wealth-checkup"
              className="inline-flex flex-none items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Start the NRI Wealth Checkup →
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <AuthorBioBox
            className="mt-10"
            tags={["FBAR & FATCA reporting", "NRI cross-border tax", "US-India compliance"]}
          />
        </Container>
      </section>

      {/* Related guides */}
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
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/fbar-fatca-checker" />
        </Container>
      </section>

      {/* Related hubs */}
      <section className="py-12 sm:py-16">
        <Container>
          <RelatedHubs hubs={["tax", "taxRoadmap", "wealthCheckup", "immigration"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
