import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const PARTNER_EMAIL = "team@nritousa.com";
const PARTNERSHIP_MAILTO = `mailto:${PARTNER_EMAIL}?subject=Partnership%20Inquiry%20-%20NRItoUSA`;
const MEDIA_MAILTO = `mailto:${PARTNER_EMAIL}?subject=Media%20Inquiry%20-%20NRItoUSA`;

const title = "Partner With NRItoUSA";
const metaTitle =
  "Partner With NRItoUSA | Publisher Partnerships, Media & Affiliate Opportunities";
const description =
  "Partner with NRItoUSA to reach Indian immigrants, H-1B families, NRIs, green card holders, U.S. taxpayers, and globally connected households through educational content, calculators, checklists, and high-intent resources.";

export const metadata: Metadata = pageMetadata({
  title: metaTitle,
  description,
  path: "/partnerships",
  socialTitle: title,
});

const stats = [
  { value: "3K–5K", label: "Monthly users and growing" },
  { value: "Organic", label: "Search-driven audience" },
  { value: "High-intent", label: "Informational traffic" },
  { value: "Evergreen", label: "Long-term content strategy" },
  { value: "U.S.–India", label: "Focused niche audience" },
  { value: "Growing", label: "Tax, immigration & finance library" },
];

const topics = [
  {
    icon: "🛂",
    title: "Immigration & Visa Planning",
    body: "H-1B, green card, visa status, moving to the U.S., and employment-based immigration topics.",
  },
  {
    icon: "🧾",
    title: "Taxes & Compliance",
    body: "FBAR, FATCA, NRE/NRO accounts, Indian assets, U.S. tax filing, cross-border tax questions, and compliance checklists.",
  },
  {
    icon: "📈",
    title: "Investing & Wealth",
    body: "Retirement accounts, 401(k), IRA, brokerage accounts, 529 plans, savings, investing, and wealth-building for immigrant families.",
  },
  {
    icon: "✈️",
    title: "Relocation & Life Decisions",
    body: "Moving to the U.S., moving back to India, family planning, education, housing, and practical settlement decisions.",
  },
  {
    icon: "🧮",
    title: "Calculators & Tools",
    body: "Decision calculators, checklists, comparison tools, tax tools, and finance calculators designed around real immigrant questions.",
  },
];

const audience = [
  "Indian immigrants living in the United States",
  "H-1B, L-1, F-1, green card, and NRI families",
  "U.S. taxpayers with Indian financial, family, or asset connections",
  "High-income professionals in technology, finance, healthcare, consulting, engineering, and business",
  "Families researching immigration, tax, investing, education, insurance, relocation, and retirement decisions",
  "Wealth-building households interested in U.S. investing, Indian assets, and cross-border tax planning",
  "Users actively searching for calculators, checklists, guides, and trusted explanations",
];

const opportunities = [
  {
    title: "Affiliate Partnerships",
    body: "We are open to affiliate and referral partnerships with brands that provide relevant value to Indian immigrants, NRIs, U.S. taxpayers, investors, families, and professionals.",
  },
  {
    title: "Sponsored Content",
    body: "Educational sponsored articles, guides, explainers, comparison pages, or resource pages aligned with our audience's needs.",
  },
  {
    title: "Calculator / Tool Sponsorships",
    body: "Sponsored placements around calculators, checklists, and decision tools used by high-intent visitors researching financial, tax, immigration, or relocation decisions.",
  },
  {
    title: "Lead Generation",
    body: "Relevant partner placements for tax filing, immigration help, financial planning, brokerage platforms, investing tools, insurance, education consulting, relocation, mortgage, real estate, and cross-border services.",
  },
  {
    title: "Newsletter / Email Partnerships",
    body: "Future email sponsorships, lead magnet collaborations, or targeted educational campaigns for NRI and immigrant audiences.",
  },
  {
    title: "Media Inquiries",
    body: "Expert commentary, quotes, interviews, data insights, and collaboration opportunities related to Indian immigrants, U.S.–India finance, cross-border planning, taxes, immigration, and U.S. taxpayer topics.",
  },
];

const whyPartner = [
  "Targeted audience of Indian immigrants, NRIs, H-1B families, green card holders, and U.S. taxpayers",
  "Original calculators, checklists, and educational content",
  "SEO-focused evergreen resources designed for long-term discovery",
  "Growing organic traffic from high-intent searches",
  "Educational, trust-first approach",
  "Strong relevance for finance, investing, tax, immigration, legal, insurance, relocation, and education brands",
  "Audience often researches before making meaningful financial or life decisions",
  "Opportunities for affiliate, referral, sponsored content, calculator sponsorships, and media collaborations",
  "Clear U.S.–India niche positioning that is difficult for broad publishers to replicate",
];

const portfolio = [
  {
    name: "TaxSaveIQ.com",
    href: "https://www.taxsaveiq.com",
    body: "TaxSaveIQ focuses on tax education, tax-saving calculators, and practical tools for U.S. taxpayers.",
  },
  {
    name: "LayoffNext.com",
    href: "https://www.layoffnext.com",
    body: "LayoffNext helps employees, visa holders, and professionals understand layoffs, severance, unemployment, career risk, and next-step planning.",
  },
  {
    name: "OptionLeo.com",
    href: "https://www.optionleo.com",
    body: "OptionLeo focuses on options education, trading tools, and market learning resources for users interested in options and investing.",
  },
];

const partnerCategories = [
  "Brokerage and investing platforms",
  "Tax software and tax filing providers",
  "Cross-border tax professionals",
  "Immigration attorneys and legal service providers",
  "Financial advisors and wealth platforms",
  "Insurance providers",
  "Education and student services",
  "Relocation and moving services",
  "Mortgage and real estate professionals",
  "Career, layoff, and employment platforms",
  "Fintech and payment/remittance platforms",
  "Media organizations and journalists",
];

export default function PartnershipsPage() {
  const jsonLd = jsonLdGraph(
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: "NRItoUSA",
      alternateName: site.name,
      legalName: site.owner,
      url: site.url,
      email: PARTNER_EMAIL,
      foundingDate: String(site.foundingYear),
      parentOrganization: { "@type": "Organization", name: site.owner },
      description:
        "NRItoUSA is an educational publisher helping Indian immigrants, NRIs, H-1B families, green card holders, and U.S. taxpayers make smarter money, tax, immigration, and relocation decisions.",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(site.ogImage),
        width: 1200,
        height: 630,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: PARTNER_EMAIL,
        contactType: "Partnerships and Media Inquiries",
      },
      sameAs: [
        "https://www.taxsaveiq.com",
        "https://www.layoffnext.com",
        "https://www.optionleo.com",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${site.url}/partnerships#webpage`,
      url: `${site.url}/partnerships`,
      name: metaTitle,
      description,
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#organization` },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Partnerships", url: "/partnerships" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-ink-900/5 bg-gradient-to-b from-brand-50/60 to-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Publisher Partnerships &amp; Media
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Partner With NRItoUSA
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              NRItoUSA is a growing educational publisher helping Indian
              immigrants, H-1B professionals, green card families, NRIs, U.S.
              taxpayers, and globally connected households make smarter decisions
              about money, taxes, immigration, relocation, investing, and
              long-term planning.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              We work with brands, platforms, media teams, and service providers
              that want to reach a high-intent U.S.–India audience through
              trusted educational content, tools, calculators, guides, referrals,
              sponsored resources, and media collaborations.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={PARTNERSHIP_MAILTO}
                className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Partnership Inquiry
              </a>
              <a
                href={MEDIA_MAILTO}
                className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Media Inquiry
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-ink-900/5 bg-white p-8 shadow-card sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Growing Monthly Reach
            </p>
            <p className="mt-3 text-lg leading-relaxed text-ink-700">
              NRItoUSA currently reaches{" "}
              <strong>approximately 3,000–5,000 monthly users</strong> and
              continues to grow as new calculators, checklists, guides, and
              evergreen resources are added.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-ink-900/5 bg-brand-50/40 p-4 text-center"
                >
                  <div className="text-xl font-extrabold text-brand-600">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-ink-500">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              Our traffic is modest but highly focused. NRItoUSA is built for
              quality, relevance, and user intent rather than broad, low-intent
              traffic.
            </p>
          </div>
        </Container>
      </section>

      {/* About + Mission */}
      <section className="pb-4">
        <Container>
          <div className="mx-auto max-w-prose">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              About NRItoUSA
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              NRItoUSA is an educational platform built for Indian immigrants,
              NRIs, H-1B families, students, professionals, green card holders,
              and U.S.–India connected households navigating life between India
              and the United States.
            </p>
            <p className="mt-4 leading-8 text-ink-700">
              Our goal is to simplify complex decisions around immigration,
              taxes, personal finance, investing, relocation, retirement,
              compliance, and cross-border planning through practical{" "}
              <Link href="/h1b" className="text-brand-600 underline">
                H-1B resources
              </Link>
              ,{" "}
              <Link href="/india-tax-compliance" className="text-brand-600 underline">
                cross-border tax guides
              </Link>
              ,{" "}
              <Link href="/calculators" className="text-brand-600 underline">
                calculators
              </Link>
              , checklists, and decision tools.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-ink-700">
              <li>H-1B and employment-based immigration resources</li>
              <li>Green card and visa planning topics</li>
              <li>
                <Link
                  href="/tools/fbar-fatca-checker"
                  className="text-brand-600 underline"
                >
                  FBAR, FATCA
                </Link>
                , NRE/NRO, and cross-border tax education
              </li>
              <li>U.S. tax topics for Indian immigrants and NRIs</li>
              <li>
                Retirement accounts including{" "}
                <Link href="/topics/retirement" className="text-brand-600 underline">
                  401(k), IRA
                </Link>
                , and moving back to India decisions
              </li>
              <li>U.S.–India relocation planning</li>
              <li>Investing and wealth-building for immigrant households</li>
              <li>
                Education, family, and long-term planning for Indian families in
                the U.S.
              </li>
              <li>Original calculators, checklists, and practical tools</li>
            </ul>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              Our Mission
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              Our mission is to help Indian immigrants and globally connected
              families make informed financial, tax, immigration, and life
              decisions with clear, practical, and trustworthy educational
              resources.
            </p>
            <p className="mt-4 leading-8 text-ink-700">
              NRItoUSA is designed around real questions users search for when
              they are making important decisions, such as:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-ink-700">
              <li>
                Can H-1B families invest, save, and plan confidently in the U.S.?
              </li>
              <li>What tax forms and compliance rules apply to Indian assets?</li>
              <li>
                What happens to U.S. retirement accounts when moving back to
                India?
              </li>
              <li>
                How should immigrant families compare 529 plans, retirement
                accounts, brokerage accounts, and cross-border financial options?
              </li>
              <li>
                What checklists and calculators can help simplify complex
                decisions?
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Audience */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Our Audience
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              NRItoUSA reaches a focused and valuable niche audience of Indian
              immigrants, NRIs, H-1B professionals, green card families, U.S.
              taxpayers, international students, and globally connected
              households. NRItoUSA reaches a financially active, professionally
              employed, and wealth-building Indian immigrant audience. Many
              readers are high-intent users researching meaningful financial,
              tax, immigration, and relocation decisions.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {audience.map((a) => (
                <div
                  key={a}
                  className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4 shadow-card"
                >
                  <span aria-hidden className="mt-0.5 text-brand-600">
                    ✓
                  </span>
                  <span className="text-ink-700">{a}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              Our audience is valuable because users often arrive while comparing
              options, solving compliance questions, or preparing for major life
              decisions.
            </p>
          </div>
        </Container>
      </section>

      {/* Topics */}
      <section className="py-4">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            Topics We Cover
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card"
              >
                <span className="text-3xl">{t.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  {t.title}
                </h3>
                <p className="mt-2 text-ink-500">{t.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Partnership opportunities */}
      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            Partnership Opportunities
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((o) => (
              <div
                key={o.title}
                className="rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card"
              >
                <h3 className="text-lg font-bold text-ink-900">{o.title}</h3>
                <p className="mt-2 text-ink-500">{o.body}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-brand-100 bg-brand-50/50 p-5 text-ink-700">
            NRItoUSA is open to affiliate, referral, sponsored, and educational
            partnerships with brands that help Indian immigrants, NRIs, U.S.
            taxpayers, professionals, and families make better financial and life
            decisions.
          </p>
        </Container>
      </section>

      {/* Why partner */}
      <section className="py-4">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Why Partner With Us
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {whyPartner.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4 shadow-card"
                >
                  <span aria-hidden className="mt-0.5 text-brand-600">
                    ✓
                  </span>
                  <span className="text-ink-700">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Publisher portfolio */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Our Growing Publisher Portfolio
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              NRItoUSA is part of a growing portfolio of educational finance,
              tax, career, and investing websites designed to help users make
              practical decisions through calculators, guides, tools, and
              evergreen resources.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {portfolio.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card transition-colors hover:border-brand-200"
                >
                  <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-600">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500">{p.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-600">
                    Visit site →
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              For the right partners, collaborations may extend across multiple
              properties where the audience fit is relevant.
            </p>
          </div>
        </Container>
      </section>

      {/* Who we work with */}
      <section className="py-4">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Who We Work With
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {partnerCategories.map((c) => (
                <div
                  key={c}
                  className="rounded-xl border border-ink-900/5 bg-white p-4 text-ink-700 shadow-card"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-gradient-to-b from-brand-50/60 to-white p-8 text-center shadow-card sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Contact for Partnerships &amp; Media
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              For partnership inquiries, affiliate opportunities, sponsored
              content, media inquiries, or collaboration proposals, contact:
            </p>
            <a
              href={`mailto:${PARTNER_EMAIL}`}
              className="mt-3 inline-block text-lg font-semibold text-brand-600 underline"
            >
              {PARTNER_EMAIL}
            </a>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={PARTNERSHIP_MAILTO}
                className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Partnership Inquiry
              </a>
              <a
                href={MEDIA_MAILTO}
                className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Media Inquiry
              </a>
            </div>
            <p className="mt-6 text-sm text-ink-500">
              Please include your company name, website, partnership type, and a
              short summary of the opportunity.
            </p>
            <p className="mt-4 text-sm text-ink-400">
              Learn more{" "}
              <Link href="/about" className="text-brand-600 underline">
                about NRItoUSA
              </Link>{" "}
              or reach the team through our{" "}
              <Link href="/contact" className="text-brand-600 underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
