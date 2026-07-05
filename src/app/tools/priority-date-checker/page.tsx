import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import ToolFaq from "@/components/tools/ToolFaq";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import PriorityDateChecker from "@/components/tools/PriorityDateChecker";
import VisaBulletinAlert from "@/components/VisaBulletinAlert";
import { currentBulletinNote } from "@/lib/visa-bulletin";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("priority-date-checker")!;
const content = getToolHubContent("priority-date-checker")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/priority-date-checker",
});

const faq: FaqItem[] = [
  {
    question: "What information do I need to use this tool?",
    answer:
      "Your EB category (EB-1, EB-2, or EB-3), your country of birth (India or Other), your priority date (month and year — from your PERM receipt or I-140 approval notice), your current stage (PERM pending, I-140 approved, etc.), and which chart you want to understand (Final Action Date or Dates for Filing). No receipt numbers, A-numbers, or personal information are collected.",
  },
  {
    question: "Why does this tool say to verify with the official visa bulletin?",
    answer:
      "The visa bulletin is updated monthly and this tool uses manually maintained data. While we update the data each month, there can be a brief lag. Always verify the current month's cutoff dates directly at travel.state.gov and the USCIS Dates for Filing authorization at uscis.gov/visabulletininfo. Decisions about filing I-485 should be made with your immigration attorney based on the current official bulletin.",
  },
  {
    question: "What is the difference between Final Action Date and Dates for Filing?",
    answer:
      "Final Action Date (Table A) is the cutoff for when USCIS can approve your green card. Dates for Filing (Table B) is an earlier cutoff that sometimes allows you to file I-485 — getting EAD and Advance Parole — before your Final Action Date is current. Table B is only available when USCIS specifically authorizes it in their monthly Adjustment of Status Filing Chart announcement.",
  },
  {
    question: "My priority date appears current in this tool but my attorney says it is not. Who is right?",
    answer:
      "Trust your attorney. This tool uses manually updated data that may not reflect the very latest bulletin, and your attorney has access to the exact current bulletin and USCIS filing authorization memo. This tool is educational only. Always defer to your attorney and the official sources.",
  },
  {
    question: "What does 'C' (Current) mean in the visa bulletin?",
    answer:
      "Current means all priority dates in that category and country combination qualify — there is no cutoff date. Anyone with an approved I-140 or met filing requirements in that category can proceed. For India EB-2 and EB-3, 'C' would mean no backlog exists — which is not the case as of 2026. 'C' typically applies to EB-1 India and most non-India EB categories.",
  },
  {
    question: "What does 'U' (Unavailable) mean in the visa bulletin?",
    answer:
      "Unavailable means no visa numbers are available for that category and country combination this month — regardless of priority date. This typically happens at the end of the fiscal year (September) or when demand in other categories has consumed all available numbers. Check the following month's bulletin.",
  },
  {
    question: "How often is the visa bulletin updated and when?",
    answer:
      "The State Department publishes a new visa bulletin around the 8th–10th of each month for the following month. For example, the July bulletin is published in early June. The USCIS Adjustment of Status Filing Chart (which announces Table B authorization) is published shortly after the State Department bulletin.",
  },
  {
    question: "I have both EB-2 and EB-3 I-140s approved. Which priority date should I use?",
    answer:
      "Each I-140 has its own priority date, typically the date the underlying PERM was filed. If both I-140s share the same PERM, they have the same priority date. You can check your situation under both EB-2 and EB-3 separately and compare. Having both gives flexibility — you can file I-485 under whichever category is more current and later interfile to the other if the visa bulletin moves.",
  },
];

export default function PriorityDateCheckerPage() {
  const url = absoluteUrl("/tools/priority-date-checker");
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
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/priority-date-checker" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="priority-date-checker"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Where does your EB priority date stand against the current India visa bulletin cutoffs? Compare Final Action & Filing dates."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/visa-bulletin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Visa bulletin guide →
            </Link>
            <Link
              href="/visa-bulletin/final-action-date-vs-date-of-filing"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              Table A vs Table B explained
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            This tool uses manually updated visa bulletin data. Always verify
            with the{" "}
            <a
              href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              official State Department visa bulletin
            </a>{" "}
            and the USCIS filing chart. Confirm with your immigration attorney.
          </p>
        }
      >
      {/* tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <ToolIntro content={content} />
            </div>
            <VisaBulletinAlert className="mb-6" />
            <PriorityDateChecker />
            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
              {currentBulletinNote}
            </div>
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: concepts, process, mistakes, related links
          (FAQ kept below) */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} hideFaq />
        </Container>
      </section>

      {/* related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Related visa bulletin and green card guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/visa-bulletin", label: "Visa Bulletin Guide Hub", desc: "Complete visa bulletin guide for Indians" },
                { href: "/visa-bulletin/priority-date", label: "Priority Date Explained", desc: "Where to find it, when it is set, why it matters" },
                { href: "/visa-bulletin/final-action-date-vs-date-of-filing", label: "Table A vs Table B", desc: "Which chart matters for I-485 filing" },
                { href: "/visa-bulletin/retrogression", label: "Retrogression Explained", desc: "What happens when dates move backward" },
                { href: "/green-card", label: "Green Card Guide", desc: "PERM, I-140, I-485 — full process for Indians" },
                { href: "/tools/green-card-stage-finder", label: "Green Card Stage Finder", desc: "Find where you are in the green card process" },
              ].map((g) => (
                <Link key={g.href} href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-blue-500 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-blue-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "uscis", "tax", "wealth"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
