import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import ToolCard from "@/components/tools/ToolCard";
import CalculatorCard from "@/components/CalculatorCard";
import IulComparisonCard from "@/components/IulComparisonCard";
import { tools, toolGroups, liveTools } from "@/lib/tools";
import { calculators, usInvestingCalculatorSlugs } from "@/lib/calculators";
import { TAX_COMPLIANCE_PATH, TAX_COMPLIANCE_TAG } from "@/lib/taxCompliance";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const title = "Free Tools & Data for Indians in the USA";
const description =
  "Free, data-backed tools for NRIs: green card wait estimator with live visa bulletin data, H-1B salary explorer, visa-free travel list, and more.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
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
      ...hubTools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: absoluteUrl(`/tools/${t.slug}`),
      })),
      ...usInvestingCalculators.map((c, i) => ({
        "@type": "ListItem",
        position: hubTools.length + i + 1,
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
            {toolGroups.map((group) => {
              const items = tools.filter(
                (t) =>
                  t.group === group && !t.tags?.includes(TAX_COMPLIANCE_TAG)
              );
              if (!items.length) return null;
              return (
                <div
                  key={group}
                  id={group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
                  className="scroll-mt-24"
                >
                  <h2 className="text-lg font-bold tracking-tight text-ink-900">
                    {group}
                  </h2>
                  <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((t) => (
                      <ToolCard key={t.slug} tool={t} />
                    ))}
                  </div>
                </div>
              );
            })}

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
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
