import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import ToolFaq from "@/components/tools/ToolFaq";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import NriTaxFilingRoadmap from "@/components/tools/NriTaxFilingRoadmap";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  DEADLINE_CARDS,
  FORMS_LIMITS_PATH,
  ROADMAP_LAST_REVIEWED,
  VERIFY_NOTE,
} from "@/lib/nriTaxRoadmap";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("nri-tax-filing-roadmap")!;
const PATH = "/tools/nri-tax-filing-roadmap";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Can I file FBAR myself?",
    answer:
      "Many people do. FBAR (FinCEN Form 114) is filed for free online through the BSA E-Filing System, separate from your tax return, and the form itself is fairly mechanical once you have each account's highest balance for the year. That said, if you have missed prior years, signature-authority accounts, or a complex set of Indian assets, it is worth reviewing with a CPA familiar with US–India reporting before you file.",
  },
  {
    question: "Is FBAR filed with my tax return?",
    answer:
      "No. FBAR is an information report filed with FinCEN through the BSA E-Filing System, completely separate from your IRS Form 1040. Filing your tax return does not satisfy FBAR, and filing FBAR does not report any income. FATCA / Form 8938, by contrast, is attached to your tax return — which is one reason people confuse the two.",
  },
  {
    question: "Is FATCA Form 8938 the same as FBAR?",
    answer:
      "No — they are separate regimes with separate forms, thresholds, and filing channels. FBAR goes to FinCEN and starts at a low aggregate balance; FATCA / Form 8938 goes to the IRS with your return and has higher thresholds that depend on your filing status and whether you live in the US or abroad. Many NRIs end up filing both for the same accounts. Verify current thresholds with the IRS each year.",
  },
  {
    question: "Do I need to file India ITR if I live in the USA?",
    answer:
      "It depends on your facts. Filing an Indian return can be mandatory once your Indian income crosses the basic exemption limit, and it is often worth filing voluntarily to reclaim TDS that was over-deducted on NRO interest, rent, or a property sale. Living in the USA does not by itself remove an India filing question. Confirm what applies to you for the current assessment year with a Chartered Accountant.",
  },
  {
    question: "Can I claim TDS refund from the USA?",
    answer:
      "Yes — if the TDS deducted on your Indian income is more than your actual Indian tax liability, the excess is generally refundable when you file an Indian income-tax return, with the refund credited to a pre-validated NRO account. You do not need to be in India to do this. The TDS must appear against your PAN in Form 26AS before it can be claimed.",
  },
  {
    question: "Do I report Indian income on my U.S. tax return?",
    answer:
      "As a US person (citizen, green card holder, or tax resident), you generally report your worldwide income — including Indian interest, rent, dividends, and capital gains — on your US return, even if it was already taxed in India. The India–US DTAA and the foreign tax credit (Form 1116) are what prevent the same income from being taxed twice; they do not remove the requirement to report it.",
  },
  {
    question: "What documents should I collect before filing?",
    answer:
      "A typical cross-border set includes: your PAN and prior-year returns; Form 26AS, AIS, and TIS from the Income Tax portal; NRO/NRE/FCNR statements and TDS certificates (Form 16A/16B); highest-balance records for FBAR and year-end balances for FATCA; proof of any tax paid in both countries; and, if claiming DTAA rates, a Tax Residency Certificate and Form 10F. The roadmap above tailors this list to your answers.",
  },
  {
    question: "Should I use a CPA, CA, or both?",
    answer:
      "Cross-border situations often need both — a US CPA for the IRS/FinCEN side and an Indian CA for the India side — because few professionals are deeply expert in both systems. The most efficient approach is to organize your facts once and bring the same summary and question list to each advisor. This roadmap and the free NRI Wealth & Tax Organizer are built to help you do exactly that.",
  },
];

export default function NriTaxFilingRoadmapPage() {
  const url = absoluteUrl(PATH);
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
      { name: tool.label, url: PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="nri-tax-filing-roadmap"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title="DIY NRI Tax Filing Roadmap for Indians in the USA"
        hook="Answer a few simple questions and see which U.S. and India tax forms, deadlines, documents, and NRItoUSA tools may apply to your situation — FBAR, FATCA, Indian income on your U.S. return, India ITR, TDS refund, and repatriation paperwork."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#roadmap"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Start the roadmap
            </a>
            <Link
              href={FORMS_LIMITS_PATH}
              className="rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/20"
            >
              Open Forms &amp; Limits Center
            </Link>
          </div>
        }
        sourceNote={
          <>
            Educational roadmap, not tax advice and not filing software · last
            reviewed{" "}
            <time dateTime={ROADMAP_LAST_REVIEWED}>{ROADMAP_LAST_REVIEWED}</time>
            . No account numbers, SSN, PAN, Aadhaar, passport numbers, or exact
            property addresses — this is an educational checklist only.
          </>
        }
        disclaimerExtra={
          <p>
            This roadmap is for educational and organizational purposes only. It
            does not prepare tax returns, file forms, determine legal
            obligations, or provide tax, legal, or financial advice. U.S. and
            India tax rules change, and individual facts matter. Verify
            current-year rules with the IRS, FinCEN, the Income Tax Department of
            India, and qualified professionals.
          </p>
        }
      >
        {/* Roadmap tool */}
        <section id="roadmap" className="scroll-mt-24 pb-12 pt-6 sm:pb-16">
          <Container>
            <NriTaxFilingRoadmap />
            <div className="mx-auto mt-8 max-w-3xl">
              <ReturnToIndiaLeadMagnetCard />
            </div>
          </Container>
        </section>

        {/* Key deadlines and limits to verify */}
        <section className="bg-white py-12 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Verify, don't assume"
              title="Key deadlines and limits to verify"
              description="Triggers, deadlines, and documents for the forms that most often apply to Indians in the USA. Figures and dates change every year — always confirm against the official source for the current year."
              action={{
                label: "Open the Forms & Limits Center",
                href: FORMS_LIMITS_PATH,
              }}
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
              {DEADLINE_CARDS.map((card) => (
                <div
                  key={card.name}
                  className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-ink-900">
                      {card.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-ink-500">
                      {card.authority}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-2 text-xs leading-relaxed text-ink-500">
                    <div>
                      <dt className="font-semibold text-ink-700">What it is</dt>
                      <dd>{card.row.purpose}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-700">
                        Common NRI trigger
                      </dt>
                      <dd>{card.row.trigger}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-700">
                        Where it is filed
                      </dt>
                      <dd>{card.filedWith}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-700">
                        When to check the deadline
                      </dt>
                      <dd>
                        {card.row.deadline}{" "}
                        <span className="font-semibold text-amber-700">
                          ({VERIFY_NOTE})
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-700">
                        Documents to collect
                      </dt>
                      <dd>{card.row.documents}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-ink-900/5 pt-3 text-xs font-semibold">
                    <Link href={FORMS_LIMITS_PATH} className="text-brand-600 hover:text-brand-700">
                      Forms &amp; Limits Center →
                    </Link>
                    {card.row.source && (
                      <a
                        href={card.row.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-400 underline hover:text-ink-600"
                      >
                        Official source: {card.row.source.label}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-400">
              Last reviewed:{" "}
              <time dateTime={ROADMAP_LAST_REVIEWED}>{ROADMAP_LAST_REVIEWED}</time>{" "}
              · Thresholds and deadlines summarized from IRS, FinCEN, and Income
              Tax Department of India guidance; verify current-year figures
              before filing.
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        {/* Related guides */}
        <section className="bg-white py-12 sm:py-16">
          <Container>
            <RelatedGuides
              slugs={[
                "fbar-fatca-nri-guide",
                "indian-income-us-tax-return",
                "double-taxation-dtaa-india-usa",
                "nre-nro-accounts-explained",
                "h1b-first-tax-return-guide",
                "repatriate-india-property-sale-usa",
              ]}
            />
          </Container>
        </section>

        {/* Related tax & compliance tools (5 interlinks → hub) */}
        <section className="bg-slate-50/60 py-12 sm:py-16">
          <Container>
            <RelatedToolsStrip currentHref={PATH} />
          </Container>
        </section>
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["tax", "taxRoadmap", "fbar", "wealthCheckup"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
