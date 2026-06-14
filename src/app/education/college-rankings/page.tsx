import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import EduHero from "@/components/education/EduHero";
import CollegeRankingsExplorer from "@/components/education/CollegeRankingsExplorer";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { collegeCategories, collegesByTag } from "@/lib/education-data";
import { formatUsd as usd } from "@/lib/format";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const calc = getEduCalc("college-rankings")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = pageMetadata({
  title: calc.seoTitle,
  description: calc.seoDescription,
  path: "/education/college-rankings",
});

const faq: FaqItem[] = [
  {
    question: "Which US universities are best for international and immigrant students?",
    answer:
      "For STEM, the standouts include MIT, Stanford, Carnegie Mellon, UC Berkeley, Georgia Tech, UIUC, Purdue, and UT Austin — all with strong recruiting and (for the public ones) lower in-state cost. The 'best' school depends on your budget, intended major, and whether you qualify for in-state tuition. Use the filters to weigh ranking against cost.",
  },
  {
    question: "Are public universities cheaper than private ones?",
    answer:
      "For in-state students, dramatically so — public flagships can cost $10,000–$17,000 in tuition versus $60,000+ at private universities. But out-of-state and international students pay much higher public rates ($30,000–$60,000), which can approach private-school cost. Top private schools also often give the most generous need-based aid, so the sticker price isn't the whole story.",
  },
  {
    question: "What's a good 'value' college?",
    answer:
      "A value pick is a school with a strong ranking relative to its cost — typically public flagships like Georgia Tech, UT Austin, Purdue, UC Berkeley, and the University of Michigan, which deliver top-tier programs at a fraction of private-school tuition for in-state students. Many also offer automatic merit scholarships based on GPA and test scores.",
  },
  {
    question: "Can I transfer from community college to a top university?",
    answer:
      "Yes, and it's a proven money-saving path. Many states have guaranteed-transfer agreements — California's community colleges, for instance, have admission pathways into the UC system. Two years at community college followed by two years at a four-year university can cut a bachelor's degree cost by tens of thousands of dollars.",
  },
];

export default function CollegeRankingsPage() {
  const url = absoluteUrl("/education/college-rankings");
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
      { name: calc.label, url: "/education/college-rankings" },
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
          <div className="mx-auto mb-8 max-w-4xl">
            <DisclaimerBox title="Approximate data">
              Rankings, acceptance rates, and tuition are approximate 2024–25
              figures compiled from US News, QS, and published cost of
              attendance. Always verify on the school&apos;s official site.
            </DisclaimerBox>
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
                href: "/education/tuition-calculator",
                title: "College Cost Calculator",
                description:
                  "Project the full four-year cost for any of these schools by type.",
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
