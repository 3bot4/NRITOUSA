import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import CalculatorCard from "@/components/CalculatorCard";
import Newsletter from "@/components/Newsletter";
import { calculators, calculatorCategories } from "@/lib/calculators";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const title = "Cross-Border Calculators for NRIs & Immigrants";
const description =
  "Free interactive calculators for NRIs and immigrants: RNOR residency, India property gains, 401(k) cash-out, backdoor Roth, rent vs buy, and more.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: "/calculators",
});

export default function CalculatorsPage() {
  const itemList = {
    "@type": "ItemList",
    itemListElement: calculators.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: absoluteUrl(`/calculators/${c.slug}`),
    })),
  };

  const jsonLd = jsonLdGraph(
    itemList,
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Calculators", url: "/calculators" },
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
            Tools
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Cross-border calculators
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">
            Generic calculators ignore visa limits, dual-currency shifts, and
            cross-border tax rules. These are built for the real variables NRIs
            and immigrants face — free, instant, and private (everything runs in
            your browser).
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

            {calculatorCategories.map((category) => {
              const items = calculators.filter((c) => c.category === category);
              if (!items.length) return null;
              return (
                <div key={category}>
                  <h2 className="text-lg font-bold tracking-tight text-ink-900">
                    {category}
                  </h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((c) => (
                      <CalculatorCard key={c.slug} calc={c} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
