import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import { eduCalcs, eduArticleSlugs } from "@/lib/education";
import { getArticle } from "@/lib/articles";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "US Education Hub for Immigrant Families | nritousa.com",
  description:
    "Navigate the US education system: free K-12 grade finder, GPA and SAT calculators, college cost projector, rankings explorer, and in-depth guides for newly arrived immigrant and NRI families.",
  keywords: [
    "US education system for immigrants",
    "what grade is my child in USA",
    "US college cost calculator",
    "GPA calculator",
    "SAT score calculator",
  ],
  alternates: { canonical: "/education" },
  openGraph: {
    type: "website",
    url: "/education",
    title: "US Education Hub for Immigrant Families",
    description:
      "Free calculators and guides for the US education system — grade levels, GPA, SAT, college costs, and rankings — built for newly arrived immigrant and NRI families.",
  },
};

const stats = [
  { value: "56M", label: "K-12 students in the US" },
  { value: "Free", label: "Public K-12 for all children" },
  { value: "Oct 1", label: "FAFSA opens each year" },
  { value: "12 mo", label: "Green card → in-state eligible" },
];

const faq: FaqItem[] = [
  {
    question: "Is public school free for immigrant children in the USA?",
    answer:
      "Yes. Public K-12 education is free for all children living in the US regardless of immigration status — this was settled by the Supreme Court in Plyler v. Doe (1982). Schools cannot ask about your immigration status or deny enrollment based on it. You only need proof of address, your child's age (birth certificate or passport), and immunization records.",
  },
  {
    question: "What grade will my child be placed in?",
    answer:
      "US grade placement is based on age, using your state's kindergarten cutoff date (most commonly September 1). A child generally starts kindergarten the fall they turn 5 by the cutoff. Use our Grade Finder to estimate the grade, then confirm with the district — schools assess newly arrived students individually and may adjust placement based on prior schooling and English level.",
  },
  {
    question: "How much does college cost in the USA?",
    answer:
      "For 2024–25, average published tuition is about $11,610/year for public in-state, $30,780 for public out-of-state, $43,505 for private nonprofit, and around $68,000 for Ivy League schools. Community college averages just $3,900/year. Room and board adds roughly $13,000–$19,000 a year. Our Tuition Calculator projects the full multi-year cost including inflation and aid.",
  },
  {
    question: "Can green card holders get in-state tuition?",
    answer:
      "Generally yes. Lawful permanent residents (green card holders) can qualify for in-state tuition after meeting the same residency requirement as citizens — typically living in the state for 12 months. H-1B and H-4 families are often charged out-of-state rates, though some states (California, Texas, New York) have exceptions. F-1 students pay out-of-state rates and aren't eligible for federal aid.",
  },
  {
    question: "Who is eligible for FAFSA and federal financial aid?",
    answer:
      "US citizens and eligible non-citizens — including green card holders, refugees, asylees, and certain other statuses — can file the FAFSA for federal grants and loans. Students on F-1, H-4, or other temporary visas generally cannot receive federal aid, but may qualify for institutional scholarships or state Dream Act aid (in CA, TX, NY, IL, WA and others). FAFSA opens October 1 each year at studentaid.gov.",
  },
  {
    question: "What GPA and SAT score do US colleges expect?",
    answer:
      "It varies enormously by school. The most selective universities admit students with near-4.0 GPAs and SAT scores above 1500, while most four-year colleges accept GPAs around 3.0 and SAT scores near 1200. Many schools are now test-optional. Use our GPA and SAT tools to see where your numbers land and which tier of colleges they fit.",
  },
];

export default function EducationHubPage() {
  const url = absoluteUrl("/education");
  const articles = eduArticleSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${url}#collection`,
      name: "US Education Hub for Immigrant Families",
      description: metadata.description,
      url,
      isPartOf: { "@id": `${site.url}/#website` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Education", url: "/education" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500">
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-16 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">Education</span>
          </nav>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Navigate the US Education System
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            A complete, free guide for newly arrived immigrant and NRI families
            — from which grade your child belongs in, to GPA and SAT scores, to
            what college really costs and how to pay for it.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-white/80">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Calculators */}
      <section className="py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Interactive tools"
            title="Free education calculators"
            description="Everything is computed in your browser. Nothing is stored or submitted."
          />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eduCalcs.map((c) => (
              <Link
                key={c.slug}
                href={`/education/${c.slug}`}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${c.accent} text-lg shadow-sm`}
                  >
                    {c.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Calculator
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                  {c.label}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {c.description}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open tool{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Articles */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="In-depth guides"
            title="Read the guides"
            description="Long-form, regularly updated explainers written for immigrant families."
            action={{ label: "All education guides", href: "/education/articles" }}
          />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <h3 className="text-sm font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                  {a.title}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {a.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Read guide{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20">
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
