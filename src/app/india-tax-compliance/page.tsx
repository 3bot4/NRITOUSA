import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import HubLinkGroups from "@/components/HubLinkGroups";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import ToolFaq from "@/components/tools/ToolFaq";
import {
  taxComplianceSnapshotRows,
  taxComplianceSources,
  TAX_COMPLIANCE_VERIFIED,
  TAX_COMPLIANCE_DISCLAIMER,
} from "@/data/siteWideVerifiedNumbers";
import RelatedHubs from "@/components/RelatedHubs";
import Newsletter from "@/components/Newsletter";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import { getArticle } from "@/lib/articles";
import {
  TAX_COMPLIANCE_PATH,
  TAX_COMPLIANCE_TITLE,
  TAX_TOPIC_GROUPS,
  TAX_TOPIC_SLUGS,
  taxComplianceCalculators,
  taxComplianceTools,
} from "@/lib/taxCompliance";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
  faqJsonLd,
  toolArticleJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  ITR_CLUSTER_SECTION,
  itrPath,
  itrPillar,
  itrSupportPages,
} from "@/lib/itrCluster";
import {
  TDS_CLUSTER_SECTION,
  tdsPath,
  tdsPillar,
  tdsSupportPages,
} from "@/lib/tdsCluster";
import {
  REPAT_CLUSTER_SECTION,
  repatPath,
  repatPillar,
  repatSupportPages,
} from "@/lib/repatriationCluster";
import {
  GIFT_CLUSTER_SECTION,
  giftPath,
  giftPillar,
  giftSupportPages,
} from "@/lib/giftsCluster";
import { FORMS_LIMITS_PATH } from "@/lib/formsLimitsCenter";

const title = "India Tax & Compliance for US NRIs";
const description =
  "NRI tax compliance hub: FBAR at $10,000, FATCA from $50,000, RNOR day-count rules, TDS on property, and DTAA relief — with calculators for each.";

/** Hub FAQs — also emitted as FAQPage JSON-LD. */
const hubFaqs = [
  {
    question: "What are the tax compliance rules for NRIs in India?",
    answer:
      "Your India tax obligations depend on residential status, which is set by days present in the April-March financial year: 182 days or more makes you Resident, as does 60 days in the year plus 365 across the previous four. Non-residents are taxed only on India-sourced income such as rent, capital gains, and NRO interest, usually collected through TDS, and may need to file an ITR to reclaim excess TDS.",
  },
  {
    question: "Do NRIs have to file an income tax return in India?",
    answer:
      "You must file if your India-sourced income exceeds the basic exemption limit, and you should file whenever TDS was deducted at more than your actual liability — that refund is only recoverable through a return. Filing is also required to carry forward capital losses and is often needed as documentation for repatriation.",
  },
  {
    question: "What is the TDS rate for NRIs?",
    answer:
      "TDS on NRI income is deducted at source at rates that vary by income type — NRO interest, rent, and capital gains each carry their own rate, and property sales attract TDS on the sale consideration rather than on the gain. Because the deducted amount frequently exceeds the real liability, a lower-deduction certificate or an ITR refund claim is often worth pursuing.",
  },
  {
    question: "What is Form 15CA and 15CB used for?",
    answer:
      "They are the compliance pair for remitting money out of India. Form 15CA is your declaration to the bank about the remittance, and Form 15CB is a chartered accountant's certificate confirming the tax treatment. Which parts apply depends on the amount and whether the income is taxable in India.",
  },
  {
    question: "Do I need to report Indian bank accounts on my US taxes?",
    answer:
      "Yes, once thresholds are crossed. FBAR (FinCEN Form 114) is required if all your foreign accounts combined exceeded $10,000 at any point in the year, and FATCA Form 8938 applies from $50,000 year-end or $75,000 peak for a single filer living in the US. NRE, NRO, fixed deposits, PPF, and demat accounts all count toward these tests.",
  },
  {
    question: "How does the DTAA prevent double taxation for NRIs?",
    answer:
      "The India-US treaty assigns taxing rights and allows a foreign tax credit, so tax paid in one country generally offsets liability on the same income in the other. In practice most US-resident NRIs claim a US foreign tax credit for Indian tax already deducted, which requires keeping TDS certificates and Indian return documentation.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: TAX_COMPLIANCE_PATH,
});

/** Resolve article slugs to real articles, dropping any that don't exist. */
function resolve(slugs: string[]) {
  return slugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
}

export default function IndiaTaxCompliancePage() {
  const calcs = taxComplianceCalculators();
  const tools = taxComplianceTools();
  const topicArticles = resolve(TAX_TOPIC_SLUGS);

  const jsonLd = jsonLdGraph(
    faqJsonLd(hubFaqs),
    toolArticleJsonLd({
      path: TAX_COMPLIANCE_PATH,
      headline: title,
      description,
      datePublished: "2026-06-16",
      dateModified: TAX_COMPLIANCE_VERIFIED,
    }),
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(TAX_COMPLIANCE_PATH)}#collection`,
      name: title,
      description,
      url: absoluteUrl(TAX_COMPLIANCE_PATH),
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...calcs.map((c) => ({
            url: absoluteUrl(`/calculators/${c.slug}`),
            name: c.title,
          })),
          ...tools.map((t) => ({
            url: absoluteUrl(`/tools/${t.slug}`),
            name: t.title,
          })),
          ...topicArticles.map((a) => ({
            url: articleUrl(a.slug),
            name: a.title,
          })),
        ].map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: item.url,
          name: item.name,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: TAX_COMPLIANCE_TITLE, url: TAX_COMPLIANCE_PATH },
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
            <span className="text-white">{TAX_COMPLIANCE_TITLE}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              🧾
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              India Tax &amp; Compliance
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            One place for the tax side of your India–US money: when you become a
            US tax resident, what India can still tax, how the DTAA stops double
            taxation, and how to report Indian accounts, property sales, and
            remittances correctly. Start with a calculator, then dig into the
            topic guides.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculators/india-property-capital-gains"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
            >
              Estimate property-sale tax
            </Link>
            <Link
              href="#tax-topics"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Browse all tax topics
            </Link>
          </div>
        </Container>
      </section>

      {/* Quick Answer + takeaways + thresholds tables */}
      <section className="border-b border-ink-900/5 bg-white py-10">
        <Container>
          <div className="mx-auto max-w-3xl">
            <ReviewedByline date={TAX_COMPLIANCE_VERIFIED} />

            <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 sm:p-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Quick Answer
              </p>
              <p className="text-[0.95rem] leading-relaxed text-ink-800">
                NRI tax compliance runs on two tracks at once. On the <strong>India side</strong>, your
                residential status is decided by days present in the April–March financial year — <strong>182
                days</strong> or more makes you Resident, as does 60 days plus 365 across the prior four — and
                non-residents are taxed only on India-sourced income, usually collected through TDS. On the{" "}
                <strong>US side</strong>, you report the same Indian accounts regardless: <strong>FBAR</strong>{" "}
                once all foreign accounts combined top <strong>$10,000</strong> at any point, and{" "}
                <strong>Form 8938</strong> from <strong>$50,000</strong> year-end for a single filer in the US.
                The DTAA then prevents the same income being taxed twice through the foreign tax credit.
              </p>
            </div>

            {/* Key takeaways */}
            <div className="mt-6 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
                <li>• File an <strong>FBAR</strong> if all your foreign accounts combined exceeded <strong>$10,000</strong> at any moment in the year — it is an aggregate test, not per account.</li>
                <li>• Add <strong>Form 8938</strong> from <strong>$50,000</strong> (year-end) or <strong>$75,000</strong> (peak) if you file single and live in the US; double those figures when married filing jointly.</li>
                <li>• Count your India days carefully — <strong>182 days</strong> in a financial year changes your Indian residential status and what India can tax.</li>
                <li>• Reclaim over-deducted <strong>TDS</strong> by filing an Indian return; on property sales TDS applies to the sale value, not the gain.</li>
                <li>• Claim <strong>DTAA</strong> relief through the US foreign tax credit rather than assuming income is exempt — keep TDS certificates as evidence.</li>
              </ul>
            </div>

            {/* Opening keyword paragraph */}
            <p className="mt-6 text-base leading-relaxed text-ink-700">
              NRI tax compliance means satisfying two tax systems that do not talk to each other. This hub is
              for Indians living in the USA who still hold NRE/NRO accounts, fixed deposits, mutual funds, or
              property in India, and who need to know what India taxes, what the US requires them to report,
              and how NRI income tax rules and the DTAA fit together. The two numbers that drive most of it:
              182 days of presence decides your Indian residential status, and $10,000 in combined foreign
              accounts triggers US FBAR reporting. Below you&apos;ll find the reporting thresholds side by
              side, the India-side obligations including TDS rates and Form 15CA/15CB, calculators for
              property gains, remittance TCS and RNOR status, and topic guides for each situation.
            </p>

            {/* Table 1 — US reporting thresholds */}
            <h2 className="mt-8 text-xl font-bold tracking-tight text-ink-900">
              What Do You Have to Report to the US?
            </h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                    <th className="p-3 font-semibold">Filing</th>
                    <th className="p-3 font-semibold">Threshold</th>
                    <th className="p-3 font-semibold">Filed with</th>
                    <th className="p-3 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5 bg-white">
                  {[
                    ["FBAR (FinCEN 114)", "Over $10,000 combined, any point in the year", "FinCEN (BSA e-file)", "Apr 15, auto-extended to Oct 15"],
                    ["Form 8938 (FATCA)", "$50,000 year-end / $75,000 peak (single, in US)", "IRS, with your return", "With the tax return"],
                    ["Form 8938 (married jointly, in US)", "$100,000 year-end / $150,000 peak", "IRS, with your return", "With the tax return"],
                    ["Form 8938 (living abroad, single)", "$200,000 year-end / $300,000 peak", "IRS, with your return", "With the tax return"],
                    ["Schedule B, Part III", "Any foreign account", "IRS, with your return", "With the tax return"],
                  ].map((r) => (
                    <tr key={r[0]} className="align-top">
                      <td className="p-3 font-semibold text-ink-900">{r[0]}</td>
                      <td className="p-3 text-ink-600">{r[1]}</td>
                      <td className="p-3 text-ink-600">{r[2]}</td>
                      <td className="p-3 text-ink-600">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink-500">
              Per FinCEN Form 114 and IRS Form 8938 instructions. Verify against current IRS guidance each
              filing season.
            </p>

            {/* Table 2 — India-side obligations */}
            <h2 className="mt-8 text-xl font-bold tracking-tight text-ink-900">
              What Does India Still Tax When You Live in the USA?
            </h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                    <th className="p-3 font-semibold">India income or action</th>
                    <th className="p-3 font-semibold">Taxable for a non-resident?</th>
                    <th className="p-3 font-semibold">What to watch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5 bg-white">
                  {[
                    ["NRE account interest", "Exempt in India", "Still US-taxable income and FBAR-reportable"],
                    ["NRO account interest", "Taxable, TDS deducted at source", "File an ITR to reclaim excess TDS"],
                    ["Rental income from India property", "Taxable, TDS applies", "Deductions available; ITR usually worthwhile"],
                    ["Sale of India property", "Capital gains taxable; TDS on sale value", "Consider a lower-deduction certificate"],
                    ["Indian mutual funds / shares", "Capital gains taxable", "PFIC questions arise on the US side"],
                    ["Remitting money out of India", "Not income, but compliance applies", "Form 15CA/15CB and LRS limits"],
                  ].map((r) => (
                    <tr key={r[0]} className="align-top">
                      <td className="p-3 font-semibold text-ink-900">{r[0]}</td>
                      <td className="p-3 text-ink-600">{r[1]}</td>
                      <td className="p-3 text-ink-600">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink-500">
              General education, not advice. Rates and rules change with each Finance Act — confirm with a
              qualified CA before acting.
            </p>
          </div>
        </Container>
      </section>

      {/* Fast Answer: FBAR/FATCA thresholds first */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <FastAnswerSnapshot
            title="US reporting thresholds every NRI should know"
            accent="brand"
            rows={taxComplianceSnapshotRows}
            badges={["FBAR $10,000", "Due Apr 15 → auto Oct 15"]}
            lastVerified={TAX_COMPLIANCE_VERIFIED}
            sources={taxComplianceSources}
            disclaimer={TAX_COMPLIANCE_DISCLAIMER}
            ctaText="Browse all tax topics"
            ctaHref="#command-center"
          />
        </Container>
      </section>

      {/* Command center — grouped table of contents */}
      <section id="command-center" className="scroll-mt-24 bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow="Command center"
            title="Everything you might need this tax year"
            description="Grouped by what you're trying to do — start here, U.S. reporting for India assets, India-side compliance, and the calculators that do the math."
          />
          <HubLinkGroups
            columns={4}
            groups={[
              {
                title: "Start here",
                links: [
                  { label: "DIY NRI Tax Filing Roadmap", href: "/tools/nri-tax-filing-roadmap" },
                  { label: "NRI Tax Forms & Limits Center", href: "/india-tax-compliance/nri-tax-forms-limits" },
                  { label: "FBAR/FATCA Checker", href: "/tools/fbar-fatca-checker" },
                  { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
                ],
              },
              {
                title: "U.S. reporting for India assets",
                links: [
                  { label: "FBAR (FinCEN 114)", href: "/tools/fbar-fatca-checker" },
                  { label: "FATCA / Form 8938", href: "/articles/fbar-fatca-nri-guide" },
                  { label: "PFIC / Indian mutual funds", href: "/articles/pfic-indian-mutual-funds-trap" },
                  { label: "Foreign tax credit / DTAA", href: "/calculators/dtaa-foreign-tax-credit" },
                  { label: "Indian income (incl. rental) on a U.S. return", href: "/articles/indian-income-us-tax-return" },
                  { label: "NRE/NRO/FD interest", href: "/articles/nre-nro-accounts-explained" },
                ],
              },
              {
                title: "India-side compliance",
                links: [
                  { label: "India ITR for NRIs", href: "/india-tax-compliance/nri-itr-filing-usa" },
                  { label: "TDS refund", href: "/tools/nri-tds-refund-checklist" },
                  { label: "Form 10F", href: "/tools/form-10f-generator" },
                  { label: "15CA / 15CB", href: "/tools/form-15ca-15cb-checklist" },
                  { label: "Repatriation paperwork", href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation" },
                  { label: "Property sale TDS", href: "/calculators/india-property-capital-gains" },
                ],
              },
              {
                title: "Calculators",
                links: [
                  { label: "RNOR Tax Residency", href: "/calculators/rnor-tax-residency" },
                  { label: "India Property Sale", href: "/calculators/india-property-capital-gains" },
                  { label: "DTAA / Foreign Tax Credit", href: "/calculators/dtaa-foreign-tax-credit" },
                  { label: "Remittance & TCS Cost", href: "/calculators/remittance-tcs-cost" },
                  { label: "FCNR vs HYSA", href: "/calculators/fcnr-vs-hysa" },
                ],
              },
              {
                title: "Wealth, estate & assets",
                links: [
                  { label: "Should NRIs keep investments in India?", href: "/india-investments/should-nris-keep-investments-in-india" },
                  { label: "NRI Estate Planning & Legacy", href: "/nri-estate-planning" },
                  { label: "Gold customs limit (US → India)", href: "/gold-limit-usa-to-india" },
                  { label: "Life insurance for Indian families", href: "/life-insurance-for-indian-families-usa" },
                ],
              },
            ]}
          />
        </Container>
      </section>

      {/* NRI Wealth & Tax Organizer entry point */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <Link
            href="/nri-wealth-checkup"
            className="group flex flex-col gap-2 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Free organizer
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                NRI Global Wealth &amp; Tax Organizer
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Add your India and U.S. assets and income once, then get an educational FBAR, FATCA,
                PFIC, foreign tax credit, and India-ITR checklist with questions for your CPA/CA.
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

      {/* DIY NRI Tax Filing Roadmap — front-door router */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <Link
            href="/tools/nri-tax-filing-roadmap"
            className="group flex flex-col gap-2 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-2xl shadow-sm"
              >
                🧭
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Not sure what to file first?
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  DIY NRI Tax Filing Roadmap
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Use the{" "}
                  <span className="font-semibold text-brand-700">
                    DIY NRI tax filing roadmap
                  </span>{" "}
                  to see how FBAR, FATCA, U.S. Form 1040, India ITR, TDS refunds,
                  Form 10F, and 15CA/15CB connect.
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
              Start the roadmap{" "}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </Container>
      </section>

      {/* NRI Tax Forms & Limits Center — reference hub */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <Link
            href={FORMS_LIMITS_PATH}
            className="group flex flex-col gap-2 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-2xl shadow-sm"
              >
                🗂️
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Reference hub
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  NRI Tax Forms &amp; Limits Center
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Two master tables — US forms (FBAR, FATCA, Form 3520, PFIC,
                  Form 1116) and India forms (ITR-2/3, 15CA, 15CB, Form 10F,
                  Form 67) — with triggers, thresholds, deadlines, documents, and
                  the right tool for each.
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-rose-600 group-hover:text-rose-700">
              Open the center{" "}
              <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </Container>
      </section>

      {/* India ITR Filing from USA — new cluster */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow={ITR_CLUSTER_SECTION.eyebrow}
            title={ITR_CLUSTER_SECTION.title}
            description={ITR_CLUSTER_SECTION.description}
            action={{ label: "Start the guide", href: itrPath(itrPillar.slug) }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={itrPath(itrPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${itrPillar.accent} text-2xl shadow-sm`}
              >
                {itrPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  NRI ITR Filing from USA: Forms, Deadlines, TDS Refunds &amp;
                  Documents
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  {itrPillar.excerpt}
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-rose-600 group-hover:text-rose-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {itrSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={itrPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
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

      {/* TDS Refunds & Lower TDS for NRIs — new cluster */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow={TDS_CLUSTER_SECTION.eyebrow}
            title={TDS_CLUSTER_SECTION.title}
            description={TDS_CLUSTER_SECTION.description}
            action={{ label: "Start the guide", href: tdsPath(tdsPillar.slug) }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={tdsPath(tdsPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${tdsPillar.accent} text-2xl shadow-sm`}
              >
                {tdsPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  NRI TDS Refund from USA: NRO Interest, Property Sale, DTAA &amp;
                  Form 13
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Banks and buyers often deduct TDS before your final tax is
                  known. Learn how NRO interest, rent, property-sale TDS, DTAA
                  paperwork, Form 13, and Indian ITR filing connect.
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-teal-600 group-hover:text-teal-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tdsSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={tdsPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {/* Interactive checklist tool card */}
            <Link
              href="/tools/nri-tds-refund-checklist"
              className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-lg shadow-sm"
                >
                  ✅
                </span>
                <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                  Tool
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                TDS refund checklist
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                Map your income type and what was deducted, then get a document
                checklist, likely next step, and CA questions.
              </p>
              <span className="mt-2.5 text-xs font-semibold text-brand-600">
                Open{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Form 15CA / 15CB & Repatriation Paperwork — new cluster */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow={REPAT_CLUSTER_SECTION.eyebrow}
            title={REPAT_CLUSTER_SECTION.title}
            description={REPAT_CLUSTER_SECTION.description}
            action={{
              label: "Start the guide",
              href: repatPath(repatPillar.slug),
            }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={repatPath(repatPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${repatPillar.accent} text-2xl shadow-sm`}
              >
                {repatPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  Form 15CA &amp; 15CB for NRIs: Repatriating Money from India to
                  the USA
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Moving money from India to the USA? Learn the document trail —
                  Form 15CA, Form 15CB, source-of-funds proof, TDS proof, and the
                  FEMA/bank repatriation request — and the order to do it in.
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {repatSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={repatPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {/* Interactive checklist tool card */}
            <Link
              href="/tools/form-15ca-15cb-checklist"
              className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-lg shadow-sm"
                >
                  ✅
                </span>
                <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                  Tool
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                15CA / 15CB checklist
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                Map your source of funds and taxability to a document checklist
                and whether a CA review is strongly recommended.
              </p>
              <span className="mt-2.5 text-xs font-semibold text-brand-600">
                Open{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Parents, Gifts, Inheritance & Form 3520 — new cluster */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <SectionHeading
            eyebrow={GIFT_CLUSTER_SECTION.eyebrow}
            title={GIFT_CLUSTER_SECTION.title}
            description={GIFT_CLUSTER_SECTION.description}
            action={{
              label: "Start the guide",
              href: giftPath(giftPillar.slug),
            }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={giftPath(giftPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${giftPillar.accent} text-2xl shadow-sm`}
              >
                {giftPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  Money from Parents in India: Gifts, Inheritance, Property &amp;
                  Form 3520
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Gifts from parents, inheritance from India, money for a US down
                  payment — none of it is taxable income to you, but Form 3520,
                  FBAR/FATCA, PFIC, and the Indian paperwork still matter.
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-rose-600 group-hover:text-rose-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {giftSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={giftPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {/* Interactive checker tool card */}
            <Link
              href="/tools/form-3520-india-gift-checker"
              className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-lg shadow-sm"
                >
                  ✅
                </span>
                <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                  Tool
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                Form 3520 gift checker
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                Map who gave it, the value, and the asset to a Form 3520,
                FBAR/FATCA, and PFIC review flag plus documents and CPA/CA
                questions.
              </p>
              <span className="mt-2.5 text-xs font-semibold text-brand-600">
                Open{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Free wealth-guide lead magnet */}
      <section className="bg-white pt-10 sm:pt-12">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-[#101a3a] to-ink-800 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-2xl shadow-sm"
                >
                  📘
                </span>
                <div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
                    Free PDF
                  </span>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-white">
                    Free Immigrant Wealth Guide
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/70">
                    Download Deepak Middha&apos;s practical PDF guide on the
                    money traps that hold immigrants back — and how to start
                    building wealth in the U.S.
                  </p>
                </div>
              </div>
              <Link
                href="/free-immigrant-wealth-guide"
                className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:bg-white/90"
              >
                Download the free guide →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Calculators + Tools — compact, glanceable cards */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Calculators & tools"
            title="Run the numbers, then check compliance"
            description="The decisions that move the most money — capital gains, repatriation, residency timing, transfer costs, and foreign-account reporting."
            action={{ label: "All calculators", href: "/calculators" }}
          />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {calcs.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
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
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {c.label}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {c.description}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${t.accent} text-lg shadow-sm`}
                  >
                    {t.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Tool
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {t.label}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {t.description}
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

      {/* Tax Topics — dense text cards, grouped */}
      <section id="tax-topics" className="scroll-mt-20 bg-slate-50/60 py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Tax topics"
            title="Cross-border tax, explained"
            description="Every India–US tax guide, grouped by the question you're trying to answer."
            action={{ label: "More tax guides", href: "/topics/taxes" }}
          />
          <div className="space-y-8">
            {TAX_TOPIC_GROUPS.map((group) => {
              const items = resolve(group.slugs);
              if (items.length === 0) return null;
              return (
                <div key={group.title}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-base font-bold tracking-tight text-ink-900">
                      {group.title}
                    </h3>
                    <p className="text-xs text-ink-400">{group.description}</p>
                  </div>
                  <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/articles/${a.slug}`}
                        className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                      >
                        <h4 className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                          {a.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                          {a.excerpt}
                        </p>
                        <span className="mt-2.5 text-[0.6875rem] font-semibold text-brand-600">
                          Read guide{" "}
                          <span className="inline-block transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Return-to-India Playbook lead magnet */}
      <section className="bg-white pt-4 pb-6">
        <Container>
          <ReturnToIndiaLeadMagnetCard />
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white pt-4 pb-10">
        <Container>
          <ToolFaq items={hubFaqs} />
        </Container>
      </section>

      {/* Author bio */}
      <section className="bg-white pb-10">
        <Container>
          <AuthorBioBox
            tags={["US-India cross-border tax", "FBAR & FATCA reporting", "NRI compliance"]}
          />
        </Container>
      </section>

      {/* Related hubs */}
      <section className="bg-white pt-4 pb-10">
        <Container>
          <RelatedHubs hubs={["taxRoadmap", "fbar", "wealth", "immigration"]} />
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="bg-white pb-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Disclaimer:</strong>{" "}
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice. {site.name}{" "}
            is owned by {site.owner}. Cross-border rules differ between the USA
            and India, vary by state and by individual situation, and change over
            time. Please consult a qualified CPA, attorney, financial advisor,
            tax professional, or India-based professional for your situation. See
            our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              full disclaimer
            </Link>
            .
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink-500">
            Looking for visa and green card tools?{" "}
            <Link
              href="/tools"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Browse all tools <span aria-hidden>→</span>
            </Link>
          </p>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
