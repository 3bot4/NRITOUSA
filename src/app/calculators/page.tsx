import type { Metadata } from "next";
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
