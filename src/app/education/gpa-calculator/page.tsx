import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import GpaCalc from "@/components/education/GpaCalc";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { EduIntro, EduDeepDive } from "@/components/education/EduHub";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { getEducationContent } from "@/lib/educationContent";
import { gradeScale, collegeGpaTargets } from "@/lib/education-data";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const calc = getEduCalc("gpa-calculator")!;
const content = getEducationContent("gpa-calculator")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = pageMetadata({
  title: calc.seoTitle,
  description: calc.seoDescription,
  path: "/education/gpa-calculator",
});

export default function GpaCalculatorPage() {
  const url = absoluteUrl("/education/gpa-calculator");
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
      { name: calc.label, url: "/education/gpa-calculator" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="gpa-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: calc.label },
        ]}
        icon={calc.icon}
        category="Education"
        title={calc.title}
        hook="Add your courses and grades to get your weighted and unweighted GPA on the standard US 4.0 scale — instantly."
        badges={["Instant result", "No signup", "No personal data", "Weighted & unweighted"]}
        accent={calc.accent}
        disclaimerExtra={
          <p>
            Schools and colleges calculate GPA in slightly different ways (some
            omit ± grades, weight differently, or exclude certain courses). This
            tool uses the most common standard 4.0 scale.
          </p>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <EduIntro content={content} />
          </div>

          <GpaCalc />
          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last reviewed:{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Standard 4.0
            scale with +0.5 Honors / +1.0 AP-IB weighting.
          </p>
        </Container>
      </section>

      {/* Grade scale table */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Reference"
                title="US grading scale"
              />
              <div className="overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/10 bg-slate-50 text-xs uppercase tracking-wider text-ink-400">
                      <th className="px-4 py-3 font-semibold">Letter</th>
                      <th className="px-4 py-3 font-semibold">GPA points</th>
                      <th className="px-4 py-3 font-semibold">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeScale.map((g) => (
                      <tr
                        key={g.letter}
                        className="border-b border-ink-900/5 last:border-0"
                      >
                        <td className="px-4 py-2 font-bold text-ink-900">
                          {g.letter}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-ink-700">
                          {g.points.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-ink-500">{g.percent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Aim higher"
                title="GPA top colleges expect"
              />
              <div className="overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/10 bg-slate-50 text-xs uppercase tracking-wider text-ink-400">
                      <th className="px-4 py-3 font-semibold">School tier</th>
                      <th className="px-4 py-3 font-semibold">Median GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collegeGpaTargets.map((t) => (
                      <tr
                        key={t.school}
                        className="border-b border-ink-900/5 last:border-0"
                      >
                        <td className="px-4 py-2.5 font-semibold text-ink-900">
                          {t.school}
                        </td>
                        <td className="px-4 py-2.5 text-ink-700">{t.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                Foreign transcripts are usually converted by a service like{" "}
                <a
                  href="https://www.wes.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-600 underline"
                >
                  WES
                </a>{" "}
                or another NACES-member evaluator before US colleges will read
                them.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: how to use result, explainer, steps,
          mistakes, example, related links, and FAQ */}
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
                href: "/education/sat-guide",
                title: "SAT Score & College Fit Tool",
                description:
                  "See your SAT percentile and which tier of colleges your score fits.",
              },
            ]}
          />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
