import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TITLE } from "@/lib/taxCompliance";
import {
  FORMS_LIMITS_LAST_REVIEWED,
  FORMS_LIMITS_PATH,
  INDIA_FORMS,
  RELATED_RESOURCES,
  SITUATIONS,
  US_FORMS,
  VERIFY_NOTE,
  type FormRow,
} from "@/lib/formsLimitsCenter";

const title =
  "NRI Tax Forms & Limits Center: FBAR, FATCA, Form 3520, 15CA, 15CB, ITR & Form 67";
const description =
  "One table for US-based NRIs: which US and India tax forms may apply, what triggers them, key thresholds, deadlines, documents, and related NRItoUSA tools.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: FORMS_LIMITS_PATH,
  type: "article",
  openGraph: {
    publishedTime: "2026-06-22",
    modifiedTime: FORMS_LIMITS_LAST_REVIEWED,
  },
});

const faq: FaqItem[] = [
  {
    question: "Which US tax forms do NRIs in the USA usually need?",
    answer:
      "It depends on your accounts and income, but the common ones are Form 1040 (the return itself), Schedule B (interest/dividends and the foreign-account question), the FBAR (FinCEN Form 114) and Form 8938 (FATCA) for foreign accounts, Form 1116 for the foreign tax credit, Form 8621 if you hold Indian mutual funds (PFIC), and Form 3520 for large foreign gifts or inheritances. The exact set is personal — confirm with a CPA.",
  },
  {
    question: "Which India tax forms do NRIs in the USA usually need?",
    answer:
      "Most NRIs use ITR-2 (or ITR-3 if there is business income), reconcile against Form 26AS and AIS/TIS, and rely on TDS certificates and NRO/NRE statements. To claim treaty relief you may need a TRC and Form 10F; to repatriate funds you typically need Form 15CA and Form 15CB; Form 67 claims the India-side foreign tax credit.",
  },
  {
    question: "Are the thresholds on this page the current ones?",
    answer:
      "No — treat every number, threshold, and deadline here as illustrative of the kind of trigger, not the current-year figure. US (IRS/FinCEN) and India (CBDT/Income Tax) thresholds, due dates, and even form numbers change every year. Always verify against the official source linked in each row, or with a qualified CPA/CA, before relying on a figure.",
  },
  {
    question: "Do I file both US and India forms for the same income?",
    answer:
      "Often yes — if you are a US tax resident, the US taxes your worldwide income, while India taxes your India-sourced income. The DTAA, the foreign tax credit (Form 1116 in the US, Form 67 in India), and treaty positions are what stop the same income from being taxed twice. Coordinate both returns with your advisors.",
  },
];

/** A single forms table with a horizontal scroll on small screens. */
function FormsTable({ rows, idPrefix }: { rows: FormRow[]; idPrefix: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
      <table className="w-full min-w-[60rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-500">
            <th className="border-b border-ink-900/10 px-3 py-3">Form</th>
            <th className="border-b border-ink-900/10 px-3 py-3">What it is for</th>
            <th className="border-b border-ink-900/10 px-3 py-3">Common NRI trigger</th>
            <th className="border-b border-ink-900/10 px-3 py-3">Key threshold / trigger</th>
            <th className="border-b border-ink-900/10 px-3 py-3">Deadline timing</th>
            <th className="border-b border-ink-900/10 px-3 py-3">Documents needed</th>
            <th className="border-b border-ink-900/10 px-3 py-3">Related NRItoUSA guide / tool</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${idPrefix}-${row.form}`}
              className={i % 2 === 0 ? "bg-white align-top" : "bg-slate-50/40 align-top"}
            >
              <th
                scope="row"
                className="border-b border-ink-900/5 px-3 py-3 text-sm font-bold text-ink-900"
              >
                {row.form}
                {row.source && (
                  <a
                    href={row.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[0.6875rem] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {row.source.label} ↗
                  </a>
                )}
              </th>
              <td className="border-b border-ink-900/5 px-3 py-3 text-ink-600">{row.purpose}</td>
              <td className="border-b border-ink-900/5 px-3 py-3 text-ink-600">{row.trigger}</td>
              <td className="border-b border-ink-900/5 px-3 py-3 text-ink-600">
                {row.threshold}
                <span className="mt-1 block text-[0.625rem] font-semibold uppercase tracking-wider text-amber-600">
                  {VERIFY_NOTE}
                </span>
              </td>
              <td className="border-b border-ink-900/5 px-3 py-3 text-ink-600">
                {row.deadline}
                <span className="mt-1 block text-[0.625rem] font-semibold uppercase tracking-wider text-amber-600">
                  {VERIFY_NOTE}
                </span>
              </td>
              <td className="border-b border-ink-900/5 px-3 py-3 text-ink-600">{row.documents}</td>
              <td className="border-b border-ink-900/5 px-3 py-3">
                <ul className="space-y-1">
                  {row.related.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        {r.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NriTaxFormsLimitsPage() {
  const reviewedLabel = new Date(FORMS_LIMITS_LAST_REVIEWED).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${absoluteUrl(FORMS_LIMITS_PATH)}#article`,
      headline: title,
      description,
      url: absoluteUrl(FORMS_LIMITS_PATH),
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      datePublished: "2026-06-22",
      dateModified: FORMS_LIMITS_LAST_REVIEWED,
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: TAX_COMPLIANCE_TITLE, url: TAX_COMPLIANCE_PATH },
      { name: "NRI Tax Forms & Limits Center", url: FORMS_LIMITS_PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-rose-500 to-pink-600">
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-12 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href={TAX_COMPLIANCE_PATH} className="hover:text-white">
              {TAX_COMPLIANCE_TITLE}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">Forms &amp; Limits Center</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              🗂️
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              NRI Tax Forms &amp; Limits Center
            </h1>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/90">
            One reference for US-based NRIs: which US and India tax forms may
            apply, what triggers them, the key thresholds and deadlines, the
            documents you&apos;ll need, and the NRItoUSA tool or guide that goes
            deeper on each. Start with your situation, then scan the two tables.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#us-forms"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
            >
              US forms table
            </Link>
            <Link
              href="#india-forms"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              India forms table
            </Link>
          </div>
        </Container>
      </section>

      {/* Verify-for-current-year banner */}
      <section className="bg-amber-50">
        <Container className="py-4">
          <p className="text-sm leading-relaxed text-amber-900">
            <strong className="font-semibold">Verify every number for the current tax year.</strong>{" "}
            All thresholds, deadlines, and even form numbers below are
            illustrative of the kind of trigger — not the current-year figure. US
            (IRS/FinCEN) and India (CBDT/Income Tax) rules change every year.
            Always confirm against the official source linked in each row, or with
            a qualified CPA/CA.{" "}
            <span className="font-semibold">Last reviewed: {reviewedLabel}.</span>
          </p>
        </Container>
      </section>

      {/* Choose your situation */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Choose your situation"
            title="Start where you are"
            description="Pick the line that fits you and jump straight to the right tool or guide. Most NRIs match more than one."
          />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SITUATIONS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span
                  aria-hidden
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${s.accent} text-lg shadow-sm`}
                >
                  {s.icon}
                </span>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {s.label}
                </h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-500">
                  {s.blurb}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Table 1 — US forms */}
      <section id="us-forms" className="scroll-mt-20 bg-slate-50/60 py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Table 1 · United States"
            title="US tax & reporting forms for Indians in the USA"
            description="The forms the IRS and FinCEN may expect once you are a US tax resident with India accounts, investments, gifts, or entities."
          />
          <FormsTable rows={US_FORMS} idPrefix="us" />
        </Container>
      </section>

      {/* Table 2 — India forms */}
      <section id="india-forms" className="scroll-mt-20 bg-white py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Table 2 · India"
            title="India tax & forms for NRIs in the USA"
            description="The Indian returns, statements, and certificates that come up when you have India income, sell assets, claim treaty relief, or repatriate funds."
          />
          <FormsTable rows={INDIA_FORMS} idPrefix="india" />
        </Container>
      </section>

      {/* Related NRItoUSA tools & guides */}
      <section className="bg-slate-50/60 py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Go deeper"
            title="Related NRItoUSA tools & guides"
            description="Every form above links into one of these. Here they are in one place."
          />
          <div className="flex flex-wrap gap-2">
            {RELATED_RESOURCES.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-full border border-ink-900/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-card hover:border-brand-300 hover:text-brand-700"
              >
                {r.label} →
              </Link>
            ))}
          </div>

          {/* Organizer CTA */}
          <Link
            href="/nri-wealth-checkup"
            className="group mt-6 flex flex-col gap-2 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Free organizer
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                Not sure which forms apply to you?
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Add your India and US assets once in the NRI Global Wealth &amp;
                Tax Organizer and get an educational FBAR, FATCA, PFIC, foreign
                tax credit, and India-ITR checklist with questions for your CPA/CA.
              </p>
            </div>
            <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
              Start your checkup{" "}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mx-auto max-w-3xl divide-y divide-ink-900/10">
            {faq.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-ink-900">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex-none text-ink-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="bg-white pb-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Disclaimer:</strong>{" "}
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice. {site.name}{" "}
            is owned by {site.owner}. Every threshold, deadline, and form number on
            this page must be verified for the current tax year against the
            official IRS, FinCEN, or India Income Tax sources, or with a qualified
            CPA, Enrolled Agent, or Chartered Accountant. See our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              full disclaimer
            </Link>
            .
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
