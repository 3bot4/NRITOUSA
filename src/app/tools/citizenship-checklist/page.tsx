import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import DataStamp from "@/components/tools/DataStamp";
import RelatedGuides from "@/components/tools/RelatedGuides";
import CitizenshipChecklist from "@/components/tools/CitizenshipChecklist";
import citizenship from "../../../../data/citizenship-checklist.json";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const tool = getTool("citizenship-checklist")!;
const content = getToolHubContent("citizenship-checklist")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/citizenship-checklist",
});

const SEVERITY_STYLE: Record<string, string> = {
  high: "border-rose-200",
  medium: "border-amber-200",
};

export default function CitizenshipChecklistPage() {
  const url = absoluteUrl("/tools/citizenship-checklist");
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
    {
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: "How to prepare for US citizenship (Form N-400)",
      description:
        "Step-by-step naturalization readiness for green card holders: confirm eligibility, gather documents, audit good moral character, file N-400, pass the tests, and take the oath.",
      totalTime: "P5Y",
      step: citizenship.sections.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        itemListElement: s.items.map((item) => ({
          "@type": "HowToDirection",
          text: item.label,
        })),
      })),
    },
    faqJsonLd(content.faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/citizenship-checklist" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="citizenship-checklist"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Ready to file N-400? Compute your earliest filing date, find which civics test applies, and track every step to the oath."
        accent={tool.accent}
        disclaimerExtra={
          <p>
            This checklist is for educational planning and is not legal advice.
            Immigration rules change frequently and individual cases vary —
            always verify against{" "}
            <a
              href="https://www.uscis.gov/n-400"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              uscis.gov
            </a>{" "}
            and consider consulting a licensed immigration attorney before you
            file.
          </p>
        }
      >
      {/* Interactive tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>

          <CitizenshipChecklist />

          <div className="mx-auto mt-6 max-w-3xl">
            <DataStamp
              lastUpdated={citizenship.lastUpdated}
              source={citizenship.source}
              sourceLabel={citizenship.sourceLabel}
            />
          </div>
        </Container>
      </section>

      {/* Pain points */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="What's different now · Last updated 2026-06"
            title="Recent pain points to know before you file"
            description="The 2025–26 naturalization landscape changed in ways that catch green card holders — especially NRIs — off guard. Each note links to its official source."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {citizenship.painPoints.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border bg-white p-6 shadow-card ${
                  SEVERITY_STYLE[p.severity] ?? "border-ink-900/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-ink-900">{p.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      p.severity === "high"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {p.severity === "high" ? "High impact" : "Worth knowing"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {p.summary}
                </p>
                <p className="mt-3 rounded-xl bg-[#fafafa] px-3 py-2 text-xs leading-relaxed text-ink-500">
                  <strong className="font-semibold text-ink-700">
                    Why this matters now:
                  </strong>{" "}
                  {p.whyNow}
                </p>
                <p className="mt-2 text-xs text-ink-400">
                  Last updated {p.lastUpdated} ·{" "}
                  <a
                    href={p.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2"
                  >
                    source
                  </a>
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: eligibility checklist, process, timeline,
          fees, documents, mistakes, related links, and FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />
        </Container>
      </section>

      {/* Related guides + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={[
              "substantial-presence-test-explained",
              "indian-income-us-tax-return",
              "fbar-fatca-nri-guide",
              "documents-to-keep-safe-usa",
              "from-h1b-to-green-card-my-story",
              "us-tax-basics-new-immigrants",
            ]}
          />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
