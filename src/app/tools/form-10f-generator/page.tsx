import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import Form10FGenerator from "@/components/tools/Form10FGenerator";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("form-10f-generator")!;
const LAST_UPDATED = "2026-06-14";

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: "/tools/form-10f-generator" },
  openGraph: {
    type: "website",
    url: "/tools/form-10f-generator",
    title: tool.seoTitle,
    description: tool.seoDescription,
  },
  twitter: { title: tool.seoTitle, description: tool.seoDescription },
};

const faq: FaqItem[] = [
  {
    question: "What is Form 10F?",
    answer:
      "Form 10F is a self-declaration under Rule 21AB of the Indian Income-tax Rules that a non-resident files to claim benefits under a Double Taxation Avoidance Agreement (DTAA), such as the India–US treaty. It supplies the particulars — name, status, nationality, tax residency period, foreign tax ID, and address — that a Tax Residency Certificate (TRC) is required to contain but sometimes does not.",
  },
  {
    question: "Who needs to file Form 10F?",
    answer:
      "A non-resident who wants to claim a reduced tax rate or exemption under a DTAA — for example, an NRI in the USA receiving Indian interest, dividends, capital gains, or other income subject to TDS — generally needs Form 10F when their TRC does not already include every prescribed detail. In practice most TRCs (including the US Form 6166) don't carry all the particulars, so Form 10F is commonly required alongside the TRC.",
  },
  {
    question: "Does this tool file Form 10F for me?",
    answer:
      "No. This is an educational draft generator only. Since 2022–23, Form 10F generally must be filed electronically on the Indian Income-tax e-filing portal (incometax.gov.in) after registering and linking a PAN. This tool simply helps you organize the seven particulars in advance so the actual e-filing — or a session with your tax professional — goes faster.",
  },
  {
    question: "Do I still need a Tax Residency Certificate (TRC)?",
    answer:
      "Yes. Form 10F supplements a TRC — it does not replace it. To claim DTAA benefits you generally need a valid TRC from your country of residence (in the USA, that's IRS Form 6166, obtained by filing Form 8802). Form 10F provides any required details the TRC omits. Keep both together with the payer/withholding agent.",
  },
  {
    question: "What is the TIN I should enter for the USA?",
    answer:
      "The Tax Identification Number in your country of residence. For an individual tax resident of the USA, that is normally your SSN or ITIN. If a category of taxpayer has no TIN, the form allows a unique number used to identify you to that tax authority. Everything you type here stays in your browser — nothing is sent anywhere — but never enter such numbers into untrusted websites.",
  },
  {
    question: "What period should I enter for residential status?",
    answer:
      "Use the period for which your residential status, as stated on your TRC, applies — usually the relevant tax year. For a US resident the TRC (Form 6166) is typically issued for a calendar year, so the period would run from January 1 to December 31 of that year unless your certificate states otherwise.",
  },
  {
    question: "Is my data safe in this tool?",
    answer:
      "Yes. The generator is 100% client-side: every value lives only in your browser's memory while the page is open. There is no account, no database, and no server call — even the analytics only ever records a coarse 'complete / in-progress' label, never the values you type. Close the tab and nothing remains.",
  },
];

export default function Form10FGeneratorPage() {
  const url = absoluteUrl("/tools/form-10f-generator");
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
      { name: tool.label, url: "/tools/form-10f-generator" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      {/* Top disclaimer + generator */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <DisclaimerBox title="Important">
              This Form 10F generator is for educational purposes only and is
              not tax, legal, or financial advice. It produces a draft to help
              you prepare — the official Form 10F must be filed electronically
              on the Indian Income-tax e-filing portal and generally requires a
              valid Tax Residency Certificate. Rules change; please consult a
              qualified tax professional familiar with India–US cross-border tax.
            </DisclaimerBox>
          </div>
          <Form10FGenerator />
          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            Field structure summarized from Form 10F under Rule 21AB of the
            Income-tax Rules, 1962; verify against current Income-tax Department
            guidance before filing.
          </p>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="How it fits together"
            title="Form 10F, TRC & DTAA — the short version"
            description="Three documents work together to get you the treaty rate instead of full Indian TDS."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "1. Tax Residency Certificate (TRC)",
                body: "Proof you're a tax resident of your country. US residents get this as IRS Form 6166 by filing Form 8802. It's the foundation — without it, no treaty benefit.",
              },
              {
                title: "2. Form 10F",
                body: "Fills in any prescribed particulars your TRC doesn't carry — status, nationality, tax residency period, foreign TIN, and address. This tool drafts exactly those fields.",
              },
              {
                title: "3. Claim the DTAA rate",
                body: "Give the TRC and Form 10F to the Indian payer / withholding agent (or use them on your Indian return) to claim the lower India–US treaty rate on interest, dividends, or gains.",
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
              "double-taxation-dtaa-india-usa",
              "selling-indian-shares-us-resident-tax",
              "indian-income-us-tax-return",
              "repatriate-india-property-sale-usa",
              "nre-nro-accounts-explained",
              "tcs-india-remittance-tax",
            ]}
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>

      {/* Related tax & compliance tools (interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/form-10f-generator" />
        </Container>
      </section>
    </>
  );
}
