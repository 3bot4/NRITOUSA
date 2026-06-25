import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import CalculatorCard from "@/components/CalculatorCard";
import IulComparisonCard from "@/components/IulComparisonCard";
import OptionLeoCard from "@/components/OptionLeoCard";
import ToolsExplorer from "@/components/tools/ToolsExplorer";
import { liveTools } from "@/lib/tools";
import { calculators, usInvestingCalculatorSlugs } from "@/lib/calculators";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TAG } from "@/lib/taxCompliance";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "Free Immigration, Wealth, Tax & Money Tools for Indians in the USA | NRI to USA",
  description:
    "Free tools for Indians in the USA: NRI Wealth Checkup, FBAR/FATCA checker, green card tracker, H-1B salaries, USCIS tools, India tax calculators, and retirement planning.",
  path: "/tools",
});

export default function ToolsHubPage() {
  // Tax & compliance items live exclusively on the India Tax & Compliance hub,
  // so they are excluded here (both the tagged tools and the tagged calculators).
  const hubTools = liveTools.filter(
    (t) => !t.tags?.includes(TAX_COMPLIANCE_TAG)
  );
  const usInvestingCalculators = usInvestingCalculatorSlugs
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const itemList = {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "NRI Wealth Checkup",
        url: absoluteUrl("/nri-wealth-checkup"),
      },
      ...hubTools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: t.title,
        url: absoluteUrl(`/tools/${t.slug}`),
      })),
      ...usInvestingCalculators.map((c, i) => ({
        "@type": "ListItem",
        position: hubTools.length + i + 2,
        name: c.title,
        url: absoluteUrl(`/calculators/${c.slug}`),
      })),
    ],
  };

  const jsonLd = jsonLdGraph(
    itemList,
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Data hub
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Tools for Indians in the USA
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">
            Live government data, made usable: green card waits, H-1B salaries,
            travel access, and processing times. Everything runs in your
            browser — free, instant, and private — with the data source and
            update date stamped on every tool.
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <div className="space-y-8">
            <Link
              href="/nri-wealth-checkup"
              className="group flex flex-col gap-2 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Free Tool
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  NRI Wealth Checkup
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Add your U.S. and India assets, income, NRE/NRO accounts, property, investments,
                  and TDS to generate an educational FBAR, FATCA, PFIC, foreign tax credit, and
                  CPA/CA checklist.
                </p>
              </div>
              <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                Start Wealth Checkup{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>

            <Link
              href="/tools/nri-tax-filing-roadmap"
              className="group flex flex-col gap-2 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Free Tool
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  DIY NRI Tax Filing Roadmap
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  See which U.S. and India tax forms, limits, deadlines,
                  documents, and NRItoUSA tools may apply before you file — FBAR,
                  FATCA &amp; Form 8938; India ITR, TDS refund &amp; Form 26AS;
                  and your U.S. return with Indian income &amp; foreign tax
                  credit.
                </p>
              </div>
              <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                Start tax roadmap{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>

            <Link
              href="/h1b-layoff"
              className="group flex flex-col gap-2 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Visa &amp; Green Card
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  H-1B Layoff Checklist
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  A planning checklist for Indian H-1B workers after layoff, with
                  links to LayoffNext countdown and recovery tools.
                </p>
              </div>
              <span className="flex-none text-sm font-semibold text-orange-600 group-hover:text-orange-700">
                Open checklist{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>

            {/* Searchable, filterable index of every tool & calculator. All
                links render server-side, so the full list stays crawlable. */}
            <ToolsExplorer />

            <div className="rounded-2xl border border-ink-900/5 bg-slate-50 px-5 py-3 text-sm text-ink-500">
              Deep into the green card journey?{" "}
              <Link
                href="/tools/visa-green-card"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                See the full visa &amp; green card tools hub →
              </Link>
            </div>

            <Link
              href={TAX_COMPLIANCE_PATH}
              className="group flex flex-col gap-2 rounded-2xl border border-ink-900/5 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-lg font-bold tracking-tight text-ink-900">
                  Looking for India tax calculators?
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  RNOR residency, property-sale gains, remittance TCS, DTAA
                  credits, 401(k) cash-out, and FBAR/FATCA now live on the India
                  Tax &amp; Compliance hub.
                </p>
              </div>
              <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                Visit the India Tax &amp; Compliance hub{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink-900">
                US Investing &amp; Wealth
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Retirement, housing, and wealth-building tools for immigrants
                building their US life
              </p>
              <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {usInvestingCalculators.map((c) => (
                  <Fragment key={c.slug}>
                    <CalculatorCard calc={c} />
                    {/* IUL comparison lives at an article URL, not /calculators */}
                    {c.slug === "backdoor-roth-eligibility" && (
                      <IulComparisonCard />
                    )}
                  </Fragment>
                ))}
                {/* OptionLeo is an external partner-education card, not a tool */}
                <OptionLeoCard />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
