import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CollegeRankingsExplorer from "@/components/education/CollegeRankingsExplorer";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { EduIntro, EduDeepDive } from "@/components/education/EduHub";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { getEducationContent } from "@/lib/educationContent";
import { collegeCategories, collegesByTag } from "@/lib/education-data";
import { formatUsd as usd } from "@/lib/format";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const calc = getEduCalc("college-rankings")!;
const content = getEducationContent("college-rankings")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = pageMetadata({
  title: calc.seoTitle,
  description: calc.seoDescription,
  path: "/education/college-rankings",
});

export default function CollegeRankingsPage() {
  const url = absoluteUrl("/education/college-rankings");
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: calc.title,
      description: calc.seoDescription,
      url,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(content.faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Education", url: "/education" },
      { name: calc.label, url: "/education/college-rankings" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="college-rankings"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: calc.label },
        ]}
        icon={calc.icon}
        category="Education"
        title={calc.title}
        hook="Sort and filter top US universities by ranking, acceptance rate, and in-state or out-of-state tuition — with curated category lists."
        badges={["Instant result", "No signup", "Filterable", "Updated data"]}
        accent={calc.accent}
        sourceNote={
          <>
            Approximate 2024–25 figures compiled from US News, QS, and published
            cost of attendance. Always verify on the school&apos;s official site.
          </>
        }
        disclaimerExtra={
          <p>
            Rankings, acceptance rates, and tuition are approximate 2024–25
            figures compiled from US News, QS, and published cost of attendance.
            Always verify on the school&apos;s official site.
          </p>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <EduIntro content={content} />
          </div>

          <CollegeRankingsExplorer />
          <p className="mt-6 text-xs text-ink-400">
            Last reviewed:{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>
        </Container>
      </section>

      {/* Category lists */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="By category"
            title="Top schools by focus"
            description="Quick lists pulled from the same dataset — useful when you already know your major or your budget."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {collegeCategories.map((cat) => {
              const list = collegesByTag(cat.tag).slice(0, 6);
              return (
                <div
                  key={cat.tag}
                  className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
                >
                  <h3 className="text-base font-bold text-ink-900">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-400">{cat.blurb}</p>
                  <ol className="mt-4 space-y-2">
                    {list.map((c) => (
                      <li
                        key={c.name}
                        className="flex items-center justify-between gap-3 border-b border-ink-900/5 pb-2 text-sm last:border-0"
                      >
                        <span className="font-medium text-ink-900">
                          {c.name}
                        </span>
                        <span className="tabular-nums text-xs text-ink-400">
                          {c.type === "Public"
                            ? `${usd(c.inState)} in-state`
                            : usd(c.inState)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: how to use result, factors explainer,
          comparison table, steps, mistakes, example, related links, and FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <EduDeepDive content={content} />
        </Container>
      </section>

      {/* Related + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={calc.relatedArticles}
            extras={[
              {
                href: "/education/tuition-calculator",
                title: "College Cost Calculator",
                description:
                  "Project the full four-year cost for any of these schools by type.",
              },
            ]}
          />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
