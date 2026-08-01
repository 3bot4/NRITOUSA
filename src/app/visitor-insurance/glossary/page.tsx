import type { Metadata } from "next";
import Link from "next/link";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import { visitorInsuranceGlossary } from "@/data/visitorInsuranceGlossary";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const PATH = "/visitor-insurance/glossary";

export const metadata: Metadata = pageMetadata({
  title: "Visitor Insurance Glossary: Every Term, Explained With Numbers",
  description:
    "Plain-English visitor insurance glossary — deductible, coinsurance, policy maximum, allowed charge, balance billing, acute onset, PPO, and more, each with a numeric example.",
  path: PATH,
  type: "article",
});

const faq: FaqItem[] = [
  {
    question: "What's the difference between a policy maximum and an out-of-pocket maximum?",
    answer:
      "A policy maximum caps what the insurer pays in total. An out-of-pocket maximum, when a certificate has one, caps what you pay in specified covered cost-sharing. Many visitor plans have a policy maximum but no true out-of-pocket maximum — never assume one exists.",
  },
  {
    question: "What does \"acute onset\" mean on a visitor insurance certificate?",
    answer:
      "It generally refers to a sudden, unexpected complication of a pre-existing condition that some certificates cover under a limited, separate benefit — narrower than full pre-existing-condition coverage, with its own age cutoff and dollar cap in many certificates.",
  },
];

export default function VisitorInsuranceGlossaryPage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: PATH,
      headline: "Visitor Insurance Glossary: Every Term, Explained With Numbers",
      description: "Plain-English definitions with numeric examples for every term on a visitor insurance certificate.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(PATH, "Glossary")
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-8 mb-5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span aria-hidden>/</span>
          <Link href={VISITOR_INSURANCE_BASE} className="hover:text-brand-600">Visitor Insurance</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-500">Glossary</span>
        </nav>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-teal-700 px-3 py-1 text-xs font-semibold text-white">📖 Glossary</span>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">Visitor Insurance Glossary: Every Term, Explained With Numbers</h1>
        </div>

        <div className="mb-8 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            This page defines every term you&rsquo;re likely to see on a visitor insurance certificate — deductible, coinsurance, policy maximum, allowed charge, balance billing, acute onset, and more — each with a plain-English definition, a numeric example where
            useful, and why it matters. Jump to a term below, or open the relevant calculator directly from each entry.
          </p>
        </div>

        {/* Jump list */}
        <nav aria-label="Glossary terms" className="mb-10 rounded-2xl border border-ink-900/10 bg-white p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Jump to a term</p>
          <div className="flex flex-wrap gap-1.5">
            {visitorInsuranceGlossary.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-ink-900/10 bg-slate-50 px-2.5 py-1 text-xs font-medium text-ink-600 hover:border-brand-300 hover:text-brand-700">
                {g.term}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-5">
          {visitorInsuranceGlossary.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-24 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">{g.term}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{g.definition}</p>
              {g.example && (
                <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-600">
                  <span className="font-semibold text-ink-800">Example: </span>
                  {g.example}
                </p>
              )}
              <p className="mt-2 text-xs text-ink-500">
                <span className="font-semibold text-ink-700">Why it matters: </span>
                {g.whyItMatters}
              </p>
              {g.calculatorHref && (
                <Link href={g.calculatorHref} className="mt-2 inline-block text-xs font-semibold text-brand-600 underline">
                  {g.calculatorLabel} →
                </Link>
              )}
            </div>
          ))}
        </div>

        <section className="my-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <div key={f.question} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                <p className="font-semibold text-ink-900">{f.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">A quick note: </strong>
          These definitions are general educational information, not a substitute for your own certificate. The exact meaning of any term can vary by insurer — the policy certificate controls, and the insurer or claims administrator makes the final benefit
          determination.
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2">
          <Link href={VISITOR_INSURANCE_BASE} className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
            <p className="font-semibold text-ink-900">← Back to the Visitor Insurance hub</p>
          </Link>
          <Link href="/visitor-insurance/methodology" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
            <p className="font-semibold text-ink-900">Calculator methodology &amp; sources</p>
          </Link>
        </div>

        <AuthorReviewLine lastUpdated={VISITOR_INSURANCE_UPDATED_HUMAN} className="mb-10" />
      </div>
    </>
  );
}
