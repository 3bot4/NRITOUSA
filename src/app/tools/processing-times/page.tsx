import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DataStamp from "@/components/tools/DataStamp";
import processingData from "../../../../data/processing-times.json";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("processing-times")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: "/tools/processing-times" },
  openGraph: {
    type: "website",
    url: "/tools/processing-times",
    title: tool.seoTitle,
    description: tool.seoDescription,
  },
  twitter: { title: tool.seoTitle, description: tool.seoDescription },
};

const faq: FaqItem[] = [
  {
    question: "How long does an H-1B extension or transfer take in 2026?",
    answer:
      "A regular I-129 H-1B extension or transfer typically takes 2–4 months, while premium processing guarantees USCIS action within 15 business days for an extra $2,805. You can usually start working for a new employer as soon as the transfer petition is received, and extensions get an automatic 240-day work authorization cushion.",
  },
  {
    question: "How long does an OCI card take from the USA?",
    answer:
      "OCI applications filed through VFS Global in the USA typically take 6–10 weeks door to door, including the time your Indian passport-related documents spend with the consulate. Passport renewals via VFS are faster, usually 2–6 weeks.",
  },
  {
    question: "What is the H-1B visa stamping wait at Indian consulates?",
    answer:
      "Interview appointment waits at Mumbai, Delhi, Hyderabad, Chennai, and Kolkata have ranged from a few weeks to a few months, while dropbox (interview waiver) cases usually move in days to weeks. Waits move constantly — always check the State Department's global visa wait times page for this week's numbers before booking travel.",
  },
  {
    question: "Are these processing times guaranteed?",
    answer:
      "No. They are typical published ranges from USCIS, the State Department, and VFS, and individual cases routinely run faster or slower depending on service center workload, RFEs, and security checks. Use them for planning, and check your specific receipt's status on the official case tracker.",
  },
];

interface TimeItem {
  item: string;
  typical: string;
  premium: string | null;
  source: string;
  sourceLabel: string;
  lastUpdated: string;
  todo?: boolean;
}

export default function ProcessingTimesPage() {
  const url = absoluteUrl("/tools/processing-times");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "UtilityApplication",
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
      { name: tool.label, url: "/tools/processing-times" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      <section className="py-12 sm:py-16">
        <Container>
          <div className="space-y-10">
            {processingData.groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xl font-bold tracking-tight text-ink-900">
                  {group.title}
                </h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/5 bg-[#fafafa] text-left text-xs font-bold uppercase tracking-wider text-ink-400">
                        <th className="px-5 py-3.5">Item</th>
                        <th className="px-5 py-3.5">Typical range</th>
                        <th className="px-5 py-3.5">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(group.items as TimeItem[]).map((row) => (
                        <tr
                          key={row.item}
                          className="border-b border-ink-900/5 align-top last:border-0"
                        >
                          <td className="px-5 py-4 font-semibold text-ink-900">
                            {row.item}
                          </td>
                          <td className="px-5 py-4 text-ink-700">
                            {row.typical}
                            {row.premium && (
                              <span className="mt-1 block text-xs text-emerald-600">
                                ⚡ {row.premium}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <a
                              href={row.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-brand-600 underline decoration-brand-200 underline-offset-2 hover:text-brand-700"
                            >
                              {row.sourceLabel}
                            </a>
                            <span className="mt-0.5 block text-[11px] text-ink-400">
                              as of {row.lastUpdated}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          <DataStamp
            className="mt-6"
            lastUpdated={processingData.lastUpdated}
            source={processingData.source}
            sourceLabel={processingData.sourceLabel}
          />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
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
