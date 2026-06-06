import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CalculatorCard from "@/components/CalculatorCard";
import { calculators } from "@/lib/calculators";

// Highlight a few cross-border calculators on the home page — they're the
// strongest organic-traffic and lead-capture loops on the site.
const featured = [
  "rnor-tax-residency",
  "401k-return-to-india",
  "remittance-tcs-cost",
];

export default function CalculatorsPreview() {
  const items = featured
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Free tools"
          title="Cross-border calculators"
          description="Built for the variables generic calculators ignore — visa horizons, dual-currency shifts, and India–US tax rules."
          action={{ label: "All calculators", href: "/calculators" }}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <CalculatorCard key={c.slug} calc={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}
