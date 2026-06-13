import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import EduHero from "@/components/education/EduHero";
import TuitionCalc from "@/components/education/TuitionCalc";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import { getEduCalc } from "@/lib/education";
import { collegeTypes } from "@/lib/education-data";
import { formatUsd as usd } from "@/lib/format";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

const calc = getEduCalc("tuition-calculator")!;
const LAST_UPDATED = "2025-08-15";

export const metadata: Metadata = {
  title: calc.seoTitle,
  description: calc.seoDescription,
  alternates: { canonical: "/education/tuition-calculator" },
  openGraph: {
    type: "website",
    url: "/education/tuition-calculator",
    title: calc.seoTitle,
    description: calc.seoDescription,
  },
};

const residency = [
  {
    status: "Green card holders",
    rule: "Qualify for in-state tuition after meeting the state's residency period — usually 12 months living in the state, same as citizens. Eligible for FAFSA / federal aid.",
    tone: "good" as const,
  },
  {
    status: "H-1B / H-4 dependents",
    rule: "Usually charged out-of-state rates and not eligible for federal aid. Exceptions exist in some states (e.g. California, Texas, New York) where in-state status is possible after meeting residency rules.",
    tone: "warn" as const,
  },
  {
    status: "F-1 student visa",
    rule: "Out-of-state / international rates, no federal financial aid. Can receive institutional merit scholarships and assistantships.",
    tone: "bad" as const,
  },
  {
    status: "DACA / undocumented",
    rule: "20+ states offer in-state tuition and several (CA, TX, NY, IL, WA and others) offer state financial aid through their Dream Acts. Not eligible for federal FAFSA aid.",
    tone: "warn" as const,
  },
];

const faq: FaqItem[] = [
  {
    question: "How much does a US college degree actually cost?",
    answer:
      "For 2024–25, published annual tuition averages about $11,610 for public in-state, $30,780 for public out-of-state, $43,505 for private nonprofit, $68,000 for Ivy League schools, and just $3,900 for community college. Room and board adds roughly $13,000–$19,000 a year, plus about $1,200 for books and fees. Over four years with inflation, that's anywhere from under $30,000 (community college commuter) to $300,000+ (private/Ivy on campus).",
  },
  {
    question: "Can green card holders get in-state tuition?",
    answer:
      "Yes. Lawful permanent residents qualify for in-state tuition once they meet the state's residency requirement — typically 12 months of living in the state — just like citizens. This can cut tuition by $15,000–$20,000 a year versus out-of-state rates.",
  },
  {
    question: "Who can file the FAFSA?",
    answer:
      "US citizens and eligible non-citizens — green card holders, refugees, asylees, and certain others — can file the FAFSA for federal grants and loans at studentaid.gov. Students on F-1, H-4, or other temporary visas generally cannot get federal aid, but should still pursue institutional and private scholarships, and state Dream Act aid where available.",
  },
  {
    question: "Can immigrants use a 529 college savings plan?",
    answer:
      "Yes. Anyone with a Social Security number or ITIN can open a 529 plan, regardless of visa status. Earnings grow tax-free and withdrawals for qualified education expenses are federal-tax-free — many states also give a tax deduction. It's one of the best tools for immigrant families saving for college.",
  },
  {
    question: "How much can students borrow in federal loans?",
    answer:
      "Federal Direct Loan limits for dependent undergraduates are $5,500 in year one, $6,500 in year two, and $7,500 per year after that — capped at $31,000 total. Anything beyond that typically requires a Parent PLUS loan or a private loan, which is why families lean on savings, 529 plans, and scholarships to close the gap.",
  },
];

export default function TuitionCalculatorPage() {
  const url = absoluteUrl("/education/tuition-calculator");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: calc.title,
      description: calc.seoDescription,
      url,
      applicationCategory: "FinanceApplication",
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
      { name: calc.label, url: "/education/tuition-calculator" },
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
            <DisclaimerBox title="Estimate only">
              This projects published-price averages, not what any specific
              family pays. Net price after aid varies widely — always run the
              college&apos;s own Net Price Calculator before deciding.
            </DisclaimerBox>
          </div>
          <TuitionCalc />
          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last reviewed:{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · 2024–25
            national averages (College Board). Federal undergrad loan rate
            6.5%.
          </p>
        </Container>
      </section>

      {/* Base cost table */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="2024–25 averages"
            title="Published cost by college type"
          />
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 bg-slate-50 text-xs uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 text-right font-semibold">Tuition/yr</th>
                  <th className="px-4 py-3 text-right font-semibold">Room & board/yr</th>
                </tr>
              </thead>
              <tbody>
                {collegeTypes.map((t) => (
                  <tr
                    key={t.key}
                    className="border-b border-ink-900/5 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-semibold text-ink-900">
                      {t.label}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                      {usd(t.tuition)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                      {t.roomBoard > 0 ? usd(t.roomBoard) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Residency rules */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Who pays what"
            title="In-state vs out-of-state by immigration status"
            description="Residency status determines whether you pay the in-state or (often double) out-of-state rate, and whether you can get federal aid."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {residency.map((r) => (
              <div
                key={r.status}
                className={`rounded-2xl border-l-4 bg-white p-5 shadow-card ${
                  r.tone === "good"
                    ? "border-emerald-400"
                    : r.tone === "warn"
                      ? "border-amber-400"
                      : "border-rose-400"
                }`}
              >
                <h3 className="text-sm font-bold text-ink-900">{r.status}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {r.rule}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-500">
            File the FAFSA at{" "}
            <a
              href="https://studentaid.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline"
            >
              studentaid.gov
            </a>{" "}
            (opens October 1). Scholarship databases worth searching:{" "}
            <a href="https://www.fastweb.com" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline">Fastweb</a>,{" "}
            <a href="https://www.scholarships.com" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline">Scholarships.com</a>, and South Asian community funds.
          </p>
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
                  "Compare in-state and out-of-state tuition across top universities.",
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
