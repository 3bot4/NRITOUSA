import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import GradeFinderCalc from "@/components/education/GradeFinderCalc";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { stateCutoffs } from "@/lib/education-data";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const calc = getEduCalc("grade-finder")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = pageMetadata({
  title: calc.seoTitle,
  description: calc.seoDescription,
  path: "/education/grade-finder",
});

const schoolTypes = [
  {
    name: "Public school",
    body: "Free, funded by local taxes, open to every child in the district regardless of immigration status. The default for ~87% of US students.",
  },
  {
    name: "Charter school",
    body: "Publicly funded but independently run, often with a special focus. Free to attend; admission is usually by lottery when oversubscribed.",
  },
  {
    name: "Magnet school",
    body: "Public schools with a specialized theme (STEM, arts, IB) that draw students from across a district. Free, often selective by test or audition.",
  },
  {
    name: "STEM / exam school",
    body: "Selective public high schools focused on science and math, sometimes requiring an entrance exam. Free, highly competitive.",
  },
  {
    name: "Private school",
    body: "Tuition-charging independent or religious schools. Costs range from a few thousand to $40,000+ per year. No residency or status requirements.",
  },
];

const faq: FaqItem[] = [
  {
    question: "How is US grade level decided?",
    answer:
      "Primarily by age. A child generally starts kindergarten the fall they turn 5 by their state's cutoff date (most commonly September 1), then advances one grade each year. K-12 spans kindergarten (age ~5) through 12th grade (age ~18). Schools can adjust an individual child's placement after assessing prior schooling and English-language level.",
  },
  {
    question: "What is the kindergarten cutoff date?",
    answer:
      "It's the date by which a child must turn 5 to start kindergarten that fall. Most states use September 1, but some are notably later — Michigan and New York commonly use December 1, and several states leave it to the local district. A child born just after the cutoff usually waits a year.",
  },
  {
    question: "What documents do I need to enroll my child?",
    answer:
      "Typically: proof of address (a lease or utility bill), proof of the child's age (birth certificate or passport), immunization/vaccination records, and sometimes prior school records or transcripts. Schools cannot require proof of immigration status, a Social Security number, or a green card to enroll.",
  },
  {
    question: "My child went to school in India — will they repeat a grade?",
    answer:
      "Not necessarily. US schools place by age first, so an Indian student usually enters the grade matching their age, not a lower one. The school may assess English proficiency and offer ESL/ELL support, but being placed back a full grade purely because of a foreign transcript is uncommon. Bring translated transcripts to the enrollment meeting.",
  },
  {
    question: "What is an IEP or 504 plan?",
    answer:
      "Both are free supports for students who need them. An IEP (Individualized Education Program) provides specialized instruction for students with a qualifying disability under federal law (IDEA). A 504 plan provides accommodations (like extra time or seating) for students with a disability that affects learning. You can request an evaluation in writing at any time, and language barriers alone don't qualify — those are handled through ESL/ELL programs.",
  },
  {
    question: "How do I check how good a school is?",
    answer:
      "Look up the school on GreatSchools.org for ratings, test scores, and parent reviews, and check your state's department of education report card. Visit in person if you can. For immigrant families, ask specifically about the ESL/ELL program, the percentage of multilingual students, and what newcomer support exists.",
  },
];

export default function GradeFinderPage() {
  const url = absoluteUrl("/education/grade-finder");
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
      { name: calc.label, url: "/education/grade-finder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="grade-finder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: calc.label },
        ]}
        icon={calc.icon}
        category="Education"
        title={calc.title}
        hook="Just moved to the US? Find the likely US grade level for your child based on age and your state's cutoff — a starting point for the school."
        badges={["Instant result", "No signup", "No personal data", "By state"]}
        accent={calc.accent}
        disclaimerExtra={
          <p>
            Grade placement is set by your local school district, which assesses
            each newly arrived child individually. Use this as a starting point
            and confirm with the school.
          </p>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <GradeFinderCalc />
          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last reviewed:{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Cutoff dates
            summarized from state education guidance; many districts set their
            own line, so verify locally.
          </p>
        </Container>
      </section>

      {/* K-12 at a glance */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="The basics"
            title="What is K-12?"
            description="The US system runs from kindergarten through 12th grade — 13 years of free public education for ages roughly 5 to 18."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                stage: "Elementary",
                grades: "K–5",
                ages: "Ages 5–11",
                body: "One main classroom teacher. Focus on reading, writing, and arithmetic foundations.",
              },
              {
                stage: "Middle School",
                grades: "6–8",
                ages: "Ages 11–14",
                body: "Students rotate between subject teachers. Sometimes called junior high.",
              },
              {
                stage: "High School",
                grades: "9–12",
                ages: "Ages 14–18",
                body: "Grades 9–12 are freshman, sophomore, junior, and senior year. Ends with a diploma.",
              },
            ].map((s) => (
              <div
                key={s.stage}
                className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card"
              >
                <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
                  {s.stage}
                </p>
                <p className="mt-1 text-2xl font-extrabold text-ink-900">
                  Grades {s.grades}
                </p>
                <p className="text-sm text-ink-400">{s.ages}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* School types */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Your options"
            title="Public vs charter vs magnet vs private"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schoolTypes.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
              >
                <h3 className="text-sm font-bold text-ink-900">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enrollment checklist */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="How to enroll"
              title="Documents you'll need"
            />
            <ul className="space-y-3">
              {[
                "Proof of address — a lease, mortgage statement, or recent utility bill in a parent's name.",
                "Proof of the child's age — birth certificate or passport (foreign documents are accepted).",
                "Immunization / vaccination records — your home-country records usually count; the school nurse will tell you if any US shots are missing.",
                "Prior school records or transcripts — translated if not in English; helpful for placement but not always required to enroll.",
                "A parent/guardian photo ID.",
              ].map((d) => (
                <li key={d} className="flex gap-3 text-sm text-ink-700">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                  >
                    ✓
                  </span>
                  <span className="leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border-l-4 border-emerald-400 bg-emerald-50/70 px-5 py-3 text-sm leading-relaxed text-ink-700">
              Schools <strong>cannot</strong> require a Social Security number,
              green card, or proof of immigration status to enroll your child
              (Plyler v. Doe). Check school ratings on{" "}
              <a
                href="https://www.greatschools.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline"
              >
                GreatSchools.org
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* State cutoff reference table */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Reference"
            title="Kindergarten cutoff date by state"
            description="The date a child must turn 5 by to start kindergarten that fall. Many districts set their own line — confirm locally."
          />
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 bg-slate-50 text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold">Cutoff</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {stateCutoffs.map((s) => (
                  <tr
                    key={s.state}
                    className="border-b border-ink-900/5 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-2.5 font-semibold text-ink-900">
                      {s.state}
                    </td>
                    <td className="px-4 py-2.5 text-ink-700">{s.label}</td>
                    <td className="px-4 py-2.5 text-xs text-ink-400">
                      {s.note ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                href: "/education/tuition-calculator",
                title: "College Cost Calculator",
                description:
                  "Project the full multi-year cost of college by school type, with inflation and financial aid.",
              },
            ]}
          />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
