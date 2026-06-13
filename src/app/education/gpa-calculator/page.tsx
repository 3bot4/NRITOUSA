import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import EduHero from "@/components/education/EduHero";
import GpaCalc from "@/components/education/GpaCalc";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { gradeScale, collegeGpaTargets } from "@/lib/education-data";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

const calc = getEduCalc("gpa-calculator")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = {
  title: calc.seoTitle,
  description: calc.seoDescription,
  alternates: { canonical: "/education/gpa-calculator" },
  openGraph: {
    type: "website",
    url: "/education/gpa-calculator",
    title: calc.seoTitle,
    description: calc.seoDescription,
  },
};

const faq: FaqItem[] = [
  {
    question: "What's the difference between weighted and unweighted GPA?",
    answer:
      "Unweighted GPA puts every course on the same 4.0 scale — an A is 4.0 whether it's a regular class or AP Calculus. Weighted GPA adds a bonus for harder courses, typically +1.0 for AP/IB and +0.5 for Honors, so weighted GPAs can exceed 4.0 (often up to 5.0). Colleges look at both, and most recalculate your GPA their own way using your transcript.",
  },
  {
    question: "How do US letter grades convert to GPA points?",
    answer:
      "On the standard 4.0 scale: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, and so on down to F = 0.0. Your GPA is the credit-hour-weighted average of these points across all your courses.",
  },
  {
    question: "How is my Indian or foreign GPA converted for US colleges?",
    answer:
      "US colleges and employers usually require a credential evaluation from a service like WES (World Education Services) or another NACES-member agency. They convert your percentage marks or CGPA into a US 4.0-scale equivalent. Rules of thumb vary, but a credential evaluation is the document that actually counts — don't rely on a rough self-conversion for applications.",
  },
  {
    question: "What GPA do top colleges require?",
    answer:
      "The most selective universities (Ivy League, Stanford, MIT) admit students with median GPAs near 3.9–4.0 unweighted and often well above 4.0 weighted. Top-50 schools cluster around 3.6–3.85, strong state flagships around 3.4–3.7, and most four-year colleges around 3.0. Community colleges are typically open-admission.",
  },
  {
    question: "What are Dean's List, cum laude, and academic probation?",
    answer:
      "Dean's List recognizes a strong semester GPA (often 3.5+). Latin honors at graduation are usually cum laude (~3.5), magna cum laude (~3.7), and summa cum laude (~3.9), though exact thresholds vary by school. Academic probation is a warning status for students who fall below a minimum GPA (commonly 2.0) and risk dismissal if it isn't raised.",
  },
];

export default function GpaCalculatorPage() {
  const url = absoluteUrl("/education/gpa-calculator");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: calc.title,
      description: calc.seoDescription,
      url,
      applicationCategory: "EducationApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
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

      <EduHero calc={calc} />

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <DisclaimerBox title="Heads up">
              Schools and colleges calculate GPA in slightly different ways
              (some omit ± grades, weight differently, or exclude certain
              courses). This tool uses the most common standard 4.0 scale.
            </DisclaimerBox>
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

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
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
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
