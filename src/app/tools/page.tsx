import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import ToolCard from "@/components/tools/ToolCard";
import CalculatorCard from "@/components/CalculatorCard";
import { tools, toolGroups, liveTools } from "@/lib/tools";
import { calculators } from "@/lib/calculators";
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

      <section className="py-16 sm:py-20">
        <Container>
          <div className="space-y-14">
            {toolGroups.map((group) => {
              const items = tools.filter((t) => t.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                    {group}
                  </h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((t) => (
                      <ToolCard key={t.slug} tool={t} />
                    ))}
                  </div>
                </div>
              );
            })}

            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                  Cross-border calculators
                </h2>
                <Link
                  href="/calculators"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  View all calculators <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {calculators.map((c) => (
                  <CalculatorCard key={c.slug} calc={c} />
                ))}
                {/* In-article calculator: lives at its article URL, not /calculators */}
                <Link
                  href="/articles/iul-vs-401k-honest-comparison"
                  className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl shadow-sm">
                      ⚖️
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                    IUL vs 401(k) vs Taxable: Honest Comparison
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                    Side-by-side projection of indexed universal life against a
                    401(k) and a taxable brokerage — caps, floors, fees, death
                    benefit, and a bad-market scenario toggle.
                  </p>
                  <span className="mt-4 text-sm font-semibold text-brand-600">
                    Open comparison{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
