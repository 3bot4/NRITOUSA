import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import EduHero from "@/components/education/EduHero";
import SatScoreCalc from "@/components/education/SatScoreCalc";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

const calc = getEduCalc("sat-guide")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = {
  title: calc.seoTitle,
  description: calc.seoDescription,
  alternates: { canonical: "/education/sat-guide" },
  openGraph: {
    type: "website",
    url: "/education/sat-guide",
    title: calc.seoTitle,
    description: calc.seoDescription,
  },
};

const satVsAct = [
  ["Format", "Digital, adaptive", "Paper or digital"],
  ["Total time", "2 hr 14 min", "~2 hr 55 min"],
  ["Sections", "Reading & Writing, Math", "English, Math, Reading, Science"],
  ["Score range", "400–1600", "1–36 (composite)"],
  ["Science section", "No (data in other sections)", "Yes, dedicated"],
  ["Calculator", "Allowed on all Math", "Allowed on Math only"],
  ["Best for", "Strong readers, less time pressure", "Fast workers, science-strong"],
];

const faq: FaqItem[] = [
  {
    question: "What is the digital SAT format (2024+)?",
    answer:
      "The SAT is now fully digital and adaptive, taken on a laptop or tablet through the Bluebook app. It has two sections — Reading & Writing and Math — each split into two modules, and runs about 2 hours 14 minutes. It's section-adaptive: how you do on the first module determines the difficulty of the second. Total score is still 400–1600.",
  },
  {
    question: "Should I take the SAT or the ACT?",
    answer:
      "Colleges accept both equally — take whichever you score better on. The SAT is shorter, digital, and has no dedicated science section. The ACT includes a science-reasoning section and moves faster. Take a free practice test of each and go with the one that feels better; then focus all your prep there.",
  },
  {
    question: "How much does the SAT cost, and are fee waivers available?",
    answer:
      "The SAT costs $68. Fee waivers are available to eligible low-income US students (through your school counselor) and cover the test fee plus extra score reports and sometimes college application fees. International test-takers pay an additional regional fee.",
  },
  {
    question: "What are the best free SAT prep resources?",
    answer:
      "Khan Academy's Official Digital SAT Prep is free and built in partnership with the College Board — it includes full-length adaptive practice tests in the real Bluebook format. Combined with the official practice tests in Bluebook, it's enough to prepare well without paying for a course.",
  },
  {
    question: "Do international students need TOEFL or IELTS too?",
    answer:
      "Often yes. Students whose first language isn't English, or who studied in a non-English-medium school, are usually asked for TOEFL or IELTS to prove English proficiency — this is separate from the SAT. The SAT measures college readiness; TOEFL/IELTS measures English ability. Check each college's requirements, as some waive it for students from English-medium schools.",
  },
  {
    question: "Do test-optional schools mean I shouldn't submit a score?",
    answer:
      "Test-optional means you may apply without a score, not that scores are ignored. A strong score (relative to the school's range) still helps and can earn merit aid. A score below the school's typical range is usually better left off. As a guide: submit if your score is at or above the school's middle-50% range.",
  },
];

export default function SatGuidePage() {
  const url = absoluteUrl("/education/sat-guide");
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
      { name: calc.label, url: "/education/sat-guide" },
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
            <DisclaimerBox title="Approximate">
              Percentiles and college-fit bands are directional estimates from
              College Board 2024 data. Admissions weigh GPA, course rigor,
              essays, and extracurriculars alongside scores — and many schools
              are test-optional.
            </DisclaimerBox>
          </div>
          <SatScoreCalc />
          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last reviewed:{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Percentiles
            from College Board 2024 total-score distribution.
          </p>
        </Container>
      </section>

      {/* SAT vs ACT */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            title="SAT vs ACT"
            description="Colleges accept both equally. Take whichever fits how you work."
          />
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 bg-slate-50 text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold"></th>
                  <th className="px-4 py-3 font-semibold">SAT</th>
                  <th className="px-4 py-3 font-semibold">ACT</th>
                </tr>
              </thead>
              <tbody>
                {satVsAct.map(([k, sat, act]) => (
                  <tr
                    key={k}
                    className="border-b border-ink-900/5 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-semibold text-ink-900">
                      {k}
                    </td>
                    <td className="px-4 py-2.5 text-ink-700">{sat}</td>
                    <td className="px-4 py-2.5 text-ink-700">{act}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Prep & registration */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Register",
                body: "Sign up at collegeboard.org. The fee is $68; fee waivers are available for eligible low-income US students through a school counselor.",
                link: { href: "https://www.collegeboard.org", label: "College Board" },
              },
              {
                title: "Prep for free",
                body: "Khan Academy's Official Digital SAT Prep is free, adaptive, and built with the College Board — the best no-cost option. Paid courses run $200–$1,500.",
                link: { href: "https://www.khanacademy.org/digital-sat", label: "Khan Academy" },
              },
              {
                title: "Send scores",
                body: "You get 4 free score reports per registration; additional reports are $16 each. AP exams can convert to college credit and save thousands in tuition.",
                link: null,
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
              >
                <h3 className="text-base font-bold text-ink-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {c.body}
                </p>
                {c.link && (
                  <a
                    href={c.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-brand-600 underline"
                  >
                    {c.link.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>

      {/* Related + disclaimer */}
      <section className="py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={calc.relatedArticles}
            extras={[
              {
                href: "/education/college-rankings",
                title: "College Rankings Explorer",
                description:
                  "Filter top US universities by ranking, acceptance rate, and tuition.",
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
