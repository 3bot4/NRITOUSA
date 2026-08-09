import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import TrackedSourceBox from "@/components/tools/TrackedSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import AuthorBioBox from "@/components/AuthorBioBox";
import ShippingIndiaCalculator from "@/components/tools/ShippingIndiaCalculator";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  toolArticleJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  shippingIndiaFaqs,
  shippingIndiaSourceLinks,
  SHIPPING_INDIA_DISCLAIMER,
  SHIPPING_INDIA_LAST_VERIFIED,
  SHIPPING_INDIA_LAST_VERIFIED_HUMAN,
} from "@/data/shippingIndiaRatesData";

const PATH = "/shipping-household-goods-to-india";
const TITLE = "Shipping Household Goods to India: Cost + Customs Duty Calculator";
const DESC =
  "What will it actually cost to ship your household goods from the USA to India? Compare courier, air, and sea freight cost ranges alongside estimated Indian customs duty — in one calculator.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

export default function Page() {
  const url = absoluteUrl(PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: "USA to India Shipping Cost & Customs Duty Calculator",
      description: DESC,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    toolArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: SHIPPING_INDIA_LAST_VERIFIED,
      dateModified: SHIPPING_INDIA_LAST_VERIFIED,
    }),
    faqJsonLd(shippingIndiaFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Shipping Household Goods to India", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="shipping-household-goods-to-india"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Shipping Household Goods to India" }]}
        icon="📦"
        category="Travel & Relocation"
        title="Shipping Household Goods to India: What Will It Actually Cost?"
        hook="Compare courier, air freight, and sea freight (LCL/FCL) cost and transit-time ranges side by side — plus estimated Indian customs duty by category, separating what Transfer-of-Residence relief covers from what it doesn't. One calculator, one number: your total landed cost."
        accent="from-sky-600 to-indigo-600"
        badges={["Shipping cost + customs duty together", "No signup", "Nothing stored"]}
        headerExtra={
          <a
            href="#shipping-calculator"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
          >
            Estimate my cost →
          </a>
        }
        topDisclaimer={<>Educational estimate only. Not a shipping quote or customs assessment.</>}
        sourceNote={
          <>
            Reviewed by Deepak Middha, CA · Last updated {SHIPPING_INDIA_LAST_VERIFIED_HUMAN}. Rate
            figures below are pending verification against carrier tariffs and CBIC sources — see the
            methodology note under the calculator.
          </>
        }
        disclaimerPoints={[
          "Shipping rates, transit times, and customs duty change by carrier and by CBIC notification — always get a real quote and verify duty treatment before you ship.",
          "The assessing customs officer's determination of value, eligibility, and duty is final.",
          "This page and calculator are educational planning aids, not a shipping quote or customs, tax, or legal advice.",
        ]}
        disclaimerExtra={<p>{SHIPPING_INDIA_DISCLAIMER}</p>}
      >
        {/* Intro */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="text-sm leading-relaxed text-ink-600">
                Most guides answer either &quot;how much does shipping cost?&quot; or &quot;how much
                customs duty will I pay?&quot; — never both together. This calculator estimates your{" "}
                <strong>total landed cost</strong>: a shipping-cost range for courier, air freight, sea
                LCL (shared container), and sea FCL (your own 20ft container), plus an itemized customs
                duty estimate that separates what Transfer-of-Residence relief covers from what it
                doesn&apos;t — all in one place.
              </p>
            </div>
          </Container>
        </section>

        {/* Calculator */}
        <section id="shipping-calculator" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">
                Shipping cost + customs duty calculator
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Pick your route and volume, check anything duty-sensitive you&apos;re shipping, and
                enter how long you&apos;ve lived abroad. Nothing you type leaves your browser.
              </p>
              <div className="mt-5">
                <ShippingIndiaCalculator />
              </div>
              <div className="mt-4 rounded-xl border border-ink-900/10 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  Methodology &amp; what&apos;s still pending verification
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">
                  Shipping-cost ranges use per-kg (courier/air) or per-CBF (sea LCL) rates, or a flat
                  20ft-container rate (sea FCL), sourced from published carrier/relocation-company rate
                  pages (not live quotes — get a real one before booking). The courier range comes
                  directly from a named low-cost NRI box-shipper&apos;s published per-box price table
                  (Jio Worldwide — see the source list at the end of this page), converted to an
                  effective per-kg rate for typical packed-box weights; air freight&apos;s range is
                  cross-checked against a separate named DHL/FedEx/UPS express quote. Household goods (furniture,
                  small appliances, kitchen items, kids&apos; items) are bundled into one declared value;
                  Transfer-of-Residence relief is applied using value-cap tiers by continuous years abroad,
                  sourced from secondary summaries of the Baggage Rules 2026. The duty <em>rate</em> applied
                  to value above those tiers is deliberately left unverified — published sources conflict by
                  roughly 4x (a long-standing ~35–38.5% general baggage rate vs. a single source&apos;s claim
                  of a new flat 10% rate effective April 2026) — so the calculator shows the TR-covered and
                  dutiable split as real numbers, but the final duty amount as &quot;not verified&quot; until
                  that specific conflict is resolved against a primary CBIC source. Gold/silver jewellery is
                  flagged with a link to the dedicated gold calculator rather than recomputed here; a car and
                  alcohol are out of scope for this tool since each follows a materially different process.
                  Display-only USD→INR conversion, not a live rate. Last updated{" "}
                  {SHIPPING_INDIA_LAST_VERIFIED_HUMAN}.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-12 sm:py-16">
          <Container>
            <ToolFaq items={shippingIndiaFaqs} />
          </Container>
        </section>

        {/* Related pages */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related return-to-India & money guides"
              links={[
                { href: "/return-to-india", label: "Return to India Planning Hub", desc: "The full playbook for moving money and family back" },
                { href: "/return-to-india-checklist", label: "Free Return-to-India Checklist PDF", desc: "20-chapter sequenced plan for the move" },
                { href: "/calculators/remittance-tcs-cost", label: "Remittance & TCS Cost Calculator", desc: "The true cost of moving the money side, separately from your goods" },
                { href: "/india-property", label: "India Property for NRIs", desc: "Selling, renting, or holding property you leave behind" },
              ]}
            />
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrackedSourceBox
              title="Official customs sources"
              intro="Always verify current duty rates, Transfer-of-Residence rules, and allowances directly with Indian customs, and get a live quote from your carrier:"
              links={shippingIndiaSourceLinks}
              eventName="shipping_india_source_clicked"
              toolSlug="shipping-household-goods-to-india"
            />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={SHIPPING_INDIA_LAST_VERIFIED_HUMAN} />
            <AuthorBioBox
              className="mt-6 max-w-3xl"
              tags={["Cross-border relocation", "NRI return-to-India planning", "Customs & duty"]}
            />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
