import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import H1bLotteryTimeline from "@/components/tools/H1bLotteryTimeline";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h1b-lottery-timeline")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-lottery-timeline",
});

const faq: FaqItem[] = [
  {
    question: "When does the H-1B lottery happen each year?",
    answer:
      "Electronic registration typically opens in early March and closes in late March, with initial selections announced by March 31. Selected employers file petitions starting April 1, and approved H-1Bs begin October 1 — the start of the federal fiscal year.",
  },
  {
    question: "What are the odds of being selected in the H-1B lottery?",
    answer:
      "Odds depend on registration volume: 85,000 visas (65,000 regular + 20,000 US master's) are drawn from recent registration pools that have ranged from roughly 350,000 to over 750,000, putting single-registration odds anywhere from ~15% to ~35%. The beneficiary-centric system (one entry per person regardless of employers) has made odds more uniform since 2024.",
  },
  {
    question: "What happens if I am not selected in the H-1B lottery?",
    answer:
      "If not selected, you can remain on OPT STEM extension (if eligible), work for a cap-exempt employer such as a university or nonprofit research organization, or wait for the next cap season in March. Some people also explore O-1 (extraordinary ability) or EB-1A as alternative paths. Registrations not selected are not carried forward — you must re-register the following March.",
  },
  {
    question: "What is the H-1B grace period after a layoff?",
    answer:
      "H-1B workers who lose their job have a 60-day grace period during which they are in a period of authorized stay. During those 60 days you can look for a new employer who will file an H-1B transfer, change to another visa status, or prepare to leave the US. The 60-day clock starts from your last day of employment, not the date your paycheck stops.",
  },
  {
    question: "What is AC21 and how does it help H-1B workers with green cards?",
    answer:
      "AC21 (American Competitiveness in the 21st Century Act) lets you change employers or job roles without losing your place in the green card queue — as long as your I-485 has been pending for at least 180 days, you have an approved I-140, and the new job is in the same or similar occupational classification. This is a critical protection for Indians with long EB-2 or EB-3 wait times.",
  },
  {
    question: "What is a cap-exempt H-1B employer?",
    answer:
      "Cap-exempt employers — including most universities, affiliated nonprofits, and nonprofit or government research organizations — can file H-1B petitions at any time of year without going through the lottery cap. Working for a cap-exempt employer first and then transferring to a cap-subject employer is one strategy when lottery selection is uncertain.",
  },
];

export default function H1bLotteryTimelinePage() {
  const url = absoluteUrl("/tools/h1b-lottery-timeline");
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
      { name: tool.label, url: "/tools/h1b-lottery-timeline" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      {/* Trust block */}
      <div className="border-b border-amber-200 bg-amber-50">
        <Container>
          <div className="py-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-amber-900">
            <span><strong className="font-semibold">Educational only — not legal advice.</strong> NRItoUSA is not affiliated with USCIS or DHS.</span>
            <span>Data source: <a href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations-and-fashion-models/h-1b-cap-season" target="_blank" rel="noopener noreferrer nofollow" className="font-medium underline">USCIS H-1B Cap Season</a></span>
            <span>Updated: June 2026</span>
          </div>
        </Container>
      </div>

      <section className="py-12 sm:py-16">
        <Container>
          <H1bLotteryTimeline />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>

          {/* Internal links */}
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">Related guides and tools</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/h1b", label: "H-1B Guide for Indians", desc: "Cap, lottery, transfer, extensions, and AC21" },
                { href: "/uscis", label: "USCIS Hub", desc: "Case status, processing times, receipt numbers" },
                { href: "/tools/h1b-transfer-risk-checklist", label: "H-1B Transfer Risk Checklist", desc: "Layoff grace period, AC21 portability, travel risk" },
                { href: "/tools/h1b-salaries", label: "H-1B Salary Explorer", desc: "DOL LCA salary data by job title and city" },
                { href: "/tools/processing-times", label: "USCIS Processing Times", desc: "H-1B extension and transfer timelines" },
                { href: "/tools/visa-green-card", label: "All Visa & Green Card Tools", desc: "Every immigration tool on NRItoUSA" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="group flex flex-col gap-0.5 rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
                  <span className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{l.label}</span>
                  <span className="text-xs text-ink-500">{l.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
