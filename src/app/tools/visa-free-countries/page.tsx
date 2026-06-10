import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import PassportAccessTable from "@/components/tools/PassportAccessTable";
import passportData from "../../../../data/passport-access.json";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("visa-free-countries")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: "/tools/visa-free-countries" },
  openGraph: {
    type: "website",
    url: "/tools/visa-free-countries",
    title: tool.seoTitle,
    description: tool.seoDescription,
  },
  twitter: { title: tool.seoTitle, description: tool.seoDescription },
};

const faq: FaqItem[] = [
  {
    question:
      "How many countries can Indian passport holders visit without a visa?",
    answer: `As of the February 2026 Henley Passport Index, Indian passport holders have visa-free, visa-on-arrival, or e-visa access to about ${passportData.summary.visaFreeOrOnArrival} destinations (India ranks ${passportData.summary.henleyRank}th), while roughly ${passportData.summary.visaRequired} destinations still require a pre-arranged visa.`,
  },
  {
    question:
      "Which countries are visa-free for Indians with a valid US visa?",
    answer:
      "A valid US visa unlocks far more than the US itself: Mexico (180 days), Costa Rica, Panama, the Dominican Republic, Bahamas, Guatemala, Honduras, El Salvador, Colombia, Peru, Georgia, Albania, Montenegro, and the UAE (visa on arrival) all waive or simplify visas for Indians holding a valid US visa or green card. Turkey and Saudi Arabia offer e-Visas conditional on a US visa. Toggle 'Easier with a US visa' in the table to see the full list and conditions.",
  },
  {
    question: "Do H-1B and F-1 visa holders get the same travel perks?",
    answer:
      "Mostly yes — these third-country benefits generally require a 'valid US visa', and an unexpired H-1B, F-1, B1/B2, or green card usually qualifies. But some countries require the visa to be multiple-entry or already used once, and stamps in expired passports can cause issues, so check the destination's official conditions before booking.",
  },
  {
    question: "Is a visa on arrival the same as visa-free entry?",
    answer:
      "No. Visa-free means you board and enter with just your passport. Visa on arrival still means queuing, paperwork, and usually a fee at the airport — and airlines may ask for extra documents at check-in. e-Visas must be approved before you travel, even if approval takes only hours.",
  },
];

export default function VisaFreeCountriesPage() {
  const url = absoluteUrl("/tools/visa-free-countries");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "TravelApplication",
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
      { name: tool.label, url: "/tools/visa-free-countries" },
    ])
  );

  const stats = [
    {
      value: String(passportData.summary.visaFreeOrOnArrival),
      label: "Destinations without a pre-arranged visa",
    },
    {
      value: `#${passportData.summary.henleyRank}`,
      label: "India's Henley Passport Index rank",
    },
    {
      value: String(
        passportData.countries.filter((c) => c.usVisaPerk).length
      ),
      label: "Listed perks unlocked by a US visa",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      <section className="py-12 sm:py-16">
        <Container>
          <dl className="mb-8 grid gap-5 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
              >
                <dt className="text-sm text-ink-500">{s.label}</dt>
                <dd className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
          <PassportAccessTable />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="The killer feature"
            title="Your US visa is a second passport"
            description="Many countries waive or simplify visas for Indians who already cleared US consular vetting. Before paying for a visa anywhere, check the 'Easier with a US visa' column — Mexico, Georgia, the UAE, and most of Central America may already be open to you."
          />
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
