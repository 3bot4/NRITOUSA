import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import ComingSoon from "@/components/tools/ComingSoon";
import flightData from "../../../../data/flight-price-guide.json";
import { getTool } from "@/lib/tools";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("flight-price-guide")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: "/tools/flight-price-guide" },
  openGraph: {
    type: "website",
    url: "/tools/flight-price-guide",
    title: tool.seoTitle,
    description: tool.seoDescription,
  },
  twitter: { title: tool.seoTitle, description: tool.seoDescription },
};

const faq: FaqItem[] = [
  {
    question: "What is the cheapest month to fly from the USA to India?",
    answer:
      "Historically, fares dip in the shoulder seasons — late January through March and September through early November — while mid-December (holiday travel) and June–July (summer vacations) are the most expensive windows, often 50–80% above the yearly low. This tool will show route-by-route monthly averages so you can see the pattern for your exact city pair.",
  },
  {
    question: "Will this show live ticket prices?",
    answer:
      "No — deliberately. It shows seasonal historical-average fares for each major USA–India route so you can judge whether a live quote from your booking site is actually a good deal. For live prices, set alerts on Google Flights once you know your target number.",
  },
];

export default function FlightPriceGuidePage() {
  const jsonLd = jsonLdGraph(
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/flight-price-guide" },
    ])
  );

  const routes = flightData.routes.map((r) => r.label).join(" · ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      <ComingSoon
        planned={[
          `Monthly historical-average round-trip fares for major routes: ${routes}`,
          "Cheapest and priciest months highlighted per route",
          "A 'good deal' threshold so you can judge any live quote instantly",
          "Seasonal booking-window guidance (how far ahead to buy)",
        ]}
        lastUpdated={flightData.lastUpdated}
        source={flightData.source}
        sourceLabel={flightData.sourceLabel}
      />

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
