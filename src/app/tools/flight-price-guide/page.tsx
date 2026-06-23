import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import RelatedGuides from "@/components/tools/RelatedGuides";
import FlightPriceEstimator from "@/components/tools/FlightPriceEstimator";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("flight-price-guide")!;
const LAST_UPDATED = "2026-06-10";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/flight-price-guide",
});

const faq: FaqItem[] = [
  {
    question: "When are flights from the USA to India usually cheapest?",
    answer:
      "Historically, the cheapest windows are late January through February, and late September through October — after the summer rush and before the Diwali/December peak. March, April, and early September are reasonable shoulder months. The most expensive periods are mid-December (winter break and weddings) and May through July (school summer vacations).",
  },
  {
    question: "How early should NRIs book USA–India tickets?",
    answer:
      "For most trips, 2–6 months ahead is the sweet spot, and 3–6 months is safest for peak months. For December travel, many families book by August or September. Booking under two weeks out almost always costs more, while booking 9–12 months out isn't necessarily cheaper because airlines often haven't released their best fares yet — set fare alerts early and buy when a good fare appears.",
  },
  {
    question: "Are round-trip tickets cheaper than one-way?",
    answer:
      "Usually, yes — on USA–India routes a one-way international fare often costs much more than half of a comparable round-trip, because airlines price one-ways for less price-sensitive travelers. If your return is even loosely planned, price the round-trip. That said, mixing two one-ways on different airlines occasionally wins, so it's worth a quick comparison.",
  },
  {
    question: "Is December expensive for India travel?",
    answer:
      "December is typically the most expensive month on USA–India routes. Winter school break, year-end holidays, and India's wedding season all collide, and fares around mid-December departures with early-January returns can run 50–100% above the yearly low. If you must fly in December, book several months ahead and consider departing in early December or returning mid-January to soften the peak.",
  },
  {
    question: "Should parents visiting the USA book refundable tickets?",
    answer:
      "It's often worth paying somewhat more for refundable or low-change-fee fares for parents. Visitor-visa appointment dates, health situations, and family plans change more often than typical trips, and a single change fee on a restrictive ticket can erase the savings. At minimum, check the change and cancellation rules before buying the cheapest fare.",
  },
  {
    question: "Should students book direct or connecting flights?",
    answer:
      "Connecting flights are usually noticeably cheaper than nonstops, and most students prioritize price. The trade-offs: longer travel time, tighter baggage handling, and a missed-connection risk — so leave generous layovers (ideally 2.5+ hours international) and book the whole journey on one ticket so the airline is responsible for misconnects. Also compare student fares, which can include extra baggage and flexible dates.",
  },
];

export default function FlightPriceGuidePage() {
  const url = absoluteUrl("/tools/flight-price-guide");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "TravelApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/flight-price-guide" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="flight-price-guide"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Will your USA–India fare be low, moderate, or high? Estimate price pressure by route, month, and travel style — with booking-window tips."
        accent={tool.accent}
        disclaimerExtra={
          <p>
            This tool is for educational planning only and does not show live
            airline prices. Flight prices change frequently based on airline,
            availability, route, date, baggage, refund rules, and booking
            platform. Always compare directly with airlines and trusted travel
            providers.
          </p>
        }
      >
      {/* Estimator */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <FlightPriceEstimator />
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-xs text-ink-400">
              Last updated:{" "}
              <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Seasonal
              logic based on long-running USA–India demand patterns, reviewed
              periodically.
            </p>
          </div>
        </Container>
      </section>

      {/* Educational sections */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Make sense of it"
            title="How to use this result"
            description="The estimate is a benchmark, not a quote. Here's how NRIs typically put it to work."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                Treat the range as a benchmark
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Once you know your route and month sit in, say, the
                &ldquo;High&rdquo; band, any live quote near the low end of
                that band is a good deal worth grabbing — and quotes far above
                the high end deserve a second look at other dates, airlines, or
                airports.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                When NRIs usually pay more
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                The expensive pattern is predictable: December holidays, May–July
                school vacations, Diwali-week departures, booking under two
                weeks out, fixed weekend-to-weekend dates, and last-minute
                one-ways. Any two of these together usually means peak pricing.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                How parents visiting USA should plan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Book after the visa interview date is certain, favor refundable
                or low-change-fee fares, pick shoulder months (March–April or
                September–October) for both cheaper fares and milder weather,
                and choose routes with a single comfortable connection over the
                absolute cheapest itinerary.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                Student travel tips
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Compare student fares (extra baggage, date changes) from
                multiple airlines, book the fall-semester arrival early —
                July–August seats to US college towns sell out — keep documents
                handy for the airport, and book connections on a single ticket
                so a delay doesn&apos;t strand you mid-journey.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                India festival travel tips
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Diwali, Christmas–New Year, and summer wedding dates concentrate
                demand on specific weeks. Book 4–6 months ahead, consider
                landing a few days before the festival rush, and check
                alternate Indian airports — a cheap domestic hop can beat an
                expensive direct seat into a festival-week hub.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                Flight booking checklist
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-500">
                <li>✓ Compare 2–3 airlines plus one metasearch site</li>
                <li>✓ Check ±3 days and a nearby alternate airport</li>
                <li>✓ Verify baggage allowance and change/cancel rules</li>
                <li>✓ Confirm passport and visa validity for the dates</li>
                <li>✓ Set a fare alert if you&apos;re not ready to buy</li>
                <li>✓ Book on the airline site (or one ticket) when possible</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>

      {/* Related guides + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={[
              "moving-to-usa-with-family-checklist",
              "usa-money-guide-indian-students",
              "first-30-days-in-usa",
              "cheapest-way-send-money-usa-india",
              "cost-of-moving-india-to-usa",
              "first-7-days-in-usa",
            ]}
          />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
