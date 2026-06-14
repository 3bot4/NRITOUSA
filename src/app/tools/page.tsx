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
import { absoluteUrl, breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "Free Tools & Data for Indians in the USA";
const description =
  "Interactive, data-backed tools for NRIs: green card wait estimator with live visa bulletin data, H-1B salary explorer, visa-free travel list for Indian passports, processing-time tracker, and cross-border calculators.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tools" },
  openGraph: { type: "website", url: "/tools", title, description },
  twitter: { title, description },
};

export default function ToolsHubPage() {
  const crossBorderCalculators = calculators.filter(
    (c) => !usInvestingCalculatorSlugs.includes(c.slug)
  );
  const usInvestingCalculators = usInvestingCalculatorSlugs
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const itemList = {
    "@type": "ItemList",
    itemListElement: [
      ...liveTools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: absoluteUrl(`/tools/${t.slug}`),
      })),
      ...calculators.map((c, i) => ({
        "@type": "ListItem",
        position: liveTools.length + i + 1,
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
              const items = tools.filter((t) => t.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
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

            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-lg font-bold tracking-tight text-ink-900">
                  Cross-border calculators
                </h2>
                <Link
                  href="/calculators"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  View all calculators <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {crossBorderCalculators.map((c) => (
                  <CalculatorCard key={c.slug} calc={c} />
                ))}
              </div>
            </div>

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
