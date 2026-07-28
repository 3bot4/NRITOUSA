import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import ToolFaq from "@/components/tools/ToolFaq";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import { getToolHubContent } from "@/lib/toolHubContent";
import DataStamp from "@/components/tools/DataStamp";
import GreenCardEstimator from "@/components/tools/GreenCardEstimator";
import GreenCardQueueTracker from "@/components/tools/GreenCardQueueTracker";
import CostOfWaitingSimulator from "@/components/tools/CostOfWaitingSimulator";
import NextBulletinCountdown from "@/components/tools/NextBulletinCountdown";
import ImmigrationEmailSignup from "@/components/tools/ImmigrationEmailSignup";
import VisaBulletinAlert from "@/components/VisaBulletinAlert";
import Eb5SetAsidePanel from "@/components/Eb5SetAsidePanel";
import { getTool } from "@/lib/tools";
import {
  bulletin,
  EXTENDED_CATEGORIES,
  EXTENDED_CATEGORY_SHORT,
  EXTENDED_COUNTRIES,
  EXTENDED_COUNTRY_LABELS,
  extendedGetMovement,
  formatCutoff,
  getCutoffs,
  getExtendedCutoffs,
} from "@/lib/visa-bulletin";
import { inventoryMeta } from "@/lib/i485-inventory";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  toolArticleJsonLd,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("green-card-tracker")!;
const content = getToolHubContent("green-card-tracker")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/green-card-tracker",
});

const faq: FaqItem[] = [
  {
    question: "How many people are ahead of me in the green card line?",
    answer:
      `Enter your category, country of birth, and priority date above and the tracker shows how many applicants with earlier priority dates are ahead of you, using the USCIS pending Form I-485 inventory (snapshot as of ${inventoryMeta.snapshotDate}). It counts only people who have already filed I-485 at the year-level granularity USCIS reports, so it is a concrete place in line — not a wait time, and it understates total demand because many eligible applicants haven't filed yet.`,
  },
  {
    question: "What is the EB-2 India green card wait time in 2026?",
    answer:
      `The July 2026 Final Action Date for EB-2 India is ${formatCutoff(getCutoffs("eb2", "india").fad)} — EB-2 India has no visa numbers available for July 2026. At the cutoff's recent pace of movement, a new EB-2 India applicant realistically faces a wait measured in decades, not years — which is why many applicants also file EB-1 or EB-3 where eligible.`,
  },
  {
    question:
      "What is the difference between Final Action Dates and Dates for Filing?",
    answer:
      "The Final Action Date (FAD) is the cutoff that controls when a green card can actually be approved. Dates for Filing (DFF) is an earlier cutoff that, in months when USCIS accepts it, lets you submit your I-485 sooner — unlocking EAD work and travel benefits while you wait for the FAD to reach your priority date.",
  },
  {
    question: "Why is the India backlog so much longer than other countries?",
    answer:
      "US law sets a worldwide employment-based preference level of at least 140,000 per year, and under INA §202 no single country of birth may use more than 7% of the combined family-sponsored and employment-based preference limits (a proration cap, not a fixed India quota). Because demand from India far exceeds that prorated share every year, the unused demand piles up into a multi-decade backlog for EB-2 and EB-3 India.",
  },
  {
    question: "Can my priority date move backwards (retrogression)?",
    answer:
      "Yes. When demand exceeds the visas available, the State Department can move a cutoff backwards — called retrogression — or mark a category 'Unavailable'. Cases already filed stay in line, but approvals pause until the cutoff advances past the priority date again. This is why any wait estimate is a projection, not a promise.",
  },
  {
    question: "How accurate is this green card wait estimator?",
    answer:
      "It projects the average movement of your category's cutoff over roughly the last 30 visa bulletins forward, and shows an optimistic-to-pessimistic range rather than a single date. Real waits depend on future demand, retrogression, country-cap spillover, and possible law changes — treat the output as a planning range, not legal advice.",
  },
  {
    question: "Does this tracker cover family-sponsored green card categories too?",
    answer:
      "Yes. Alongside EB-1 through EB-5 (including EB-3 Other Workers and EB-4), the tracker covers F1, F2A, F2B, F3, and F4 family-sponsored categories for India, China, Mexico, the Philippines, and all other countries, using the same re-verified Final Action Date and Dates for Filing data.",
  },
  {
    question: "Why do Mexico and the Philippines have their own green card backlogs?",
    answer:
      "Mexico and the Philippines are large source countries for family-sponsored immigration specifically, so the State Department tracks them as separate chargeability areas alongside India, China, and all other countries — a category can be current for 'all other countries' but still backlogged for Mexico or the Philippines (or vice versa) depending on historical demand.",
  },
  {
    question: "What does '1.5x long-run pace' or '0.4x long-run pace' mean in the pace scenarios?",
    answer:
      "The long-run pace is the average monthly cutoff advancement over the trailing 60 bulletins. The 1.5x and 0.4x scenarios scale that same pace up or down to show how sensitive your projected wait is to faster or slower future movement — they are not separate forecasts, just stress tests on the same baseline.",
  },
  {
    question: "Why does the tracker sometimes show '—' instead of a date?",
    answer:
      "A '—' means that specific category, country, and chart-type cell could not be independently verified against the official Department of State Visa Bulletin archive for that month. We show it as unavailable rather than guess, estimate, or carry forward a neighboring value — a missing figure is safer than a wrong one.",
  },
];

export default function GreenCardTrackerPage() {
  const url = absoluteUrl("/tools/green-card-tracker");
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: content.description,
      url,
      applicationCategory: content.appCategory,
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    toolArticleJsonLd({
      path: "/tools/green-card-tracker",
      headline: tool.seoTitle,
      description: content.description,
      datePublished: "2026-06-16",
      dateModified: content.updated ?? "2026-06-16",
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/green-card-tracker" },
    ]),
    {
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: "US Visa Bulletin Final Action Dates & Dates for Filing, 2021–2026",
      description:
        "Monthly Final Action Date and Dates for Filing cutoffs for every employment-based (EB-1 through EB-5) and family-sponsored (F1, F2A, F2B, F3, F4) immigrant visa category, by country of chargeability (India, China, Mexico, Philippines, all other countries), re-verified cell-by-cell against the official U.S. Department of State Visa Bulletin archive.",
      url,
      license: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
      isAccessibleForFree: true,
      creator: { "@id": `${site.url}/#organization` },
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "text/html",
          contentUrl: url,
        },
      ],
      temporalCoverage: "2021-08/2026-07",
      spatialCoverage: "United States",
      variableMeasured: [
        "Final Action Date",
        "Dates for Filing",
        "Employment-based preference category",
        "Family-sponsored preference category",
        "Country of chargeability",
      ],
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="green-card-tracker"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="How long is the India green card wait? See how many applicants are ahead of you and an honest estimated wait range for your EB category."
        accent={tool.accent}
        sourceNote={
          <>
            Built from USCIS I-485 inventory and State Department visa bulletin
            Final Action Dates. Verify with official sources before making
            decisions.
          </>
        }
      >
      {/* Quick answer + key takeaways */}
      <section className="pb-8 pt-6 sm:pt-8">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-[#fafafa] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Quick answer</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              Pick your category and country of birth below, enter your priority
              date, and the tracker shows the current queue gap, a projected
              wait range under four different pace scenarios, and how the
              cutoff has actually moved over the last five years — all built
              from a re-verified, cell-by-cell dataset covering employment and
              family-sponsored categories across India, China, Mexico, the
              Philippines, and all other countries.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-ink-700 sm:grid-cols-2">
              <li>• Every projection is a range, never a single date</li>
              <li>• Retrogression is tracked, not hidden</li>
              <li>• Covers Final Action Dates and Dates for Filing</li>
              <li>• No account, no data leaves your browser</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Signature dashboard */}
      <section className="pb-12 sm:pb-16">
        <Container>
          <VisaBulletinAlert className="mx-auto mb-6 max-w-3xl" />
          <GreenCardQueueTracker />
        </Container>
      </section>

      {/* Current bulletin table — full matrix */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={`Visa bulletin · ${bulletin.month}`}
            title="Current cutoff dates at a glance"
            description="Final Action Dates for every employment-based and family-sponsored category, all five countries. 'Current' = no backlog; '—' = not yet verified for this cell."
          />
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 bg-[#fafafa] text-left text-xs font-bold uppercase tracking-wider text-ink-400">
                  <th className="px-4 py-3.5">Category</th>
                  {EXTENDED_COUNTRIES.map((c) => (
                    <th key={c} className="px-4 py-3.5">
                      {EXTENDED_COUNTRY_LABELS[c]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXTENDED_CATEGORIES.map((cat) => (
                  <tr key={cat} className="border-b border-ink-900/5 last:border-0">
                    <td className="px-4 py-3.5 font-semibold text-ink-900">
                      {EXTENDED_CATEGORY_SHORT[cat]}
                    </td>
                    {EXTENDED_COUNTRIES.map((c) => {
                      const cut = getExtendedCutoffs(cat, c);
                      const movement = extendedGetMovement(cat, c, "fad");
                      const current = cut.fad === "C";
                      const unverified = cut.fad === null;
                      const changeLabel =
                        movement.status === "advanced" && movement.monthsMoved
                          ? `+${Math.round(movement.monthsMoved * 30)}d`
                          : movement.status === "retrogressed" && movement.monthsMoved
                            ? `${Math.round(movement.monthsMoved * 30)}d`
                            : null;
                      return (
                        <td
                          key={c}
                          className={`px-4 py-3.5 ${
                            unverified
                              ? "text-ink-300"
                              : current
                                ? "font-semibold text-emerald-600"
                                : "text-ink-700"
                          }`}
                        >
                          {unverified ? "—" : formatCutoff(cut.fad ?? "C")}
                          {changeLabel && (
                            <span
                              className={`ml-1.5 text-[10px] font-semibold ${
                                movement.status === "advanced" ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {changeLabel}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataStamp
            className="mt-3"
            lastUpdated={bulletin.lastUpdated}
            source={bulletin.source}
            sourceLabel={bulletin.sourceLabel}
          />
          <Eb5SetAsidePanel className="mt-6" />
        </Container>
      </section>

      {/* People ahead of you (I-485 inventory) + range estimate */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="I-485 inventory"
            title="How many people are ahead of you"
            description="A concrete place in line from USCIS's pending Form I-485 inventory, plus a simplified EB-1/EB-2/EB-3/EB-5 India/China/ROW estimate."
          />
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>
          <GreenCardEstimator variant="full" />
        </Container>
      </section>

      {/* Cost of waiting */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Plan ahead"
            title="What the wait might cost you"
          />
          <CostOfWaitingSimulator projectedYears={null} />
        </Container>
      </section>

      {/* Email capture */}
      <section className="py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <NextBulletinCountdown />
            <ImmigrationEmailSignup source="green-card-tracker" />
          </div>
        </Container>
      </section>

      {/* Explainer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Why the wait exists"
          />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                FAD vs Dates for Filing
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                The <strong className="text-ink-700">Final Action Date</strong>{" "}
                controls when your green card can be approved. The earlier{" "}
                <strong className="text-ink-700">Dates for Filing</strong>{" "}
                cutoff — in months USCIS accepts it — lets you file your I-485
                early and get EAD/Advance Parole benefits while you wait.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                The 7% per-country limit
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Under INA §202, no country of birth can use more than 7% of the
                combined family and employment preference limits — a proration
                cap, not a fixed India quota. Indian demand is many multiples of
                that prorated share, so the queue compounds year after year.
                Country of <em>birth</em>, not citizenship, is what counts.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                The ~140k annual pool
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                All employment-based categories worldwide share roughly 140,000
                green cards a year (plus any unused family-based spillover).
                Dependents count against the cap too, so each approved family
                typically uses 2–3 numbers from the pool.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Methodology */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Methodology"
            title="Exactly how the projection is calculated"
          />
          <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-ink-700">
            <p>
              <strong className="text-ink-900">1. Gap.</strong> We take the
              months between your priority date and the current cutoff for
              your chosen category, country, and chart (Final Action or Dates
              for Filing) — this is your queue position, not a wait time on
              its own.
            </p>
            <p>
              <strong className="text-ink-900">2. Pace.</strong> We measure how
              many cutoff-months the bulletin advanced per calendar month over
              a trailing window (12 months for &ldquo;recent pace&rdquo;, 60
              months for &ldquo;long-run pace&rdquo;), using only re-verified
              bulletin data — never estimated figures.
            </p>
            <p>
              <strong className="text-ink-900">3. Projection.</strong> Wait =
              gap ÷ pace. We show four scenarios (recent pace, long-run pace,
              1.5× long-run, 0.4× long-run) side by side rather than one
              number, because pace varies substantially month to month.
            </p>
            <p>
              <strong className="text-ink-900">4. Honesty checks.</strong> If a
              category is currently retrogressing, or has barely moved in the
              trailing window, we say so instead of projecting — a forward
              projection from a moving-backwards or frozen baseline would be
              misleading. If a cell&apos;s data couldn&apos;t be verified
              against the official archive, we show &ldquo;—&rdquo;, never a
              guess.
            </p>
            <p className="rounded-xl bg-[#fafafa] px-4 py-3 text-xs text-ink-500">
              Cutoff movement is driven by demand, per-country annual limits,
              and unused-visa spillover between categories and countries — it
              is <strong>not a trend</strong> and can move backwards
              (retrogress) at any time. This tool is informational only and is
              not legal advice; verify your specific situation with an
              immigration attorney.
            </p>
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: concepts, process, timeline, documents,
          mistakes, example, related links (FAQ kept live below) */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} hideFaq />
        </Container>
      </section>

      {/* FAQ (live, data-driven) + disclaimer + internal links */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />

          {/* Internal links */}
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">Related guides and tools</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/visa-bulletin", label: "Visa Bulletin Explained", desc: "Final Action Dates, Dates for Filing, and retrogression" },
                { href: "/green-card", label: "Green Card Process for Indians", desc: "PERM, I-140, priority date, I-485 step by step" },
                { href: "/tools/priority-date-checker", label: "Priority Date Checker", desc: "Compare your priority date to the current bulletin" },
                { href: "/visa-bulletin/eb2-india", label: "EB-2 India Guide", desc: "EB-2 Final Action Date history and strategy" },
                { href: "/visa-bulletin/eb3-india", label: "EB-3 India Guide", desc: "EB-3 cutoffs and EB-2/EB-3 downgrade strategy" },
                { href: "/uscis", label: "USCIS Hub", desc: "Case status, processing times, and receipt numbers" },
                { href: "/visa-bulletin/retrogression", label: "Retrogression Explained", desc: "What retrogression means for your pending I-485" },
                { href: "/tools/visa-green-card", label: "All Visa & Green Card Tools", desc: "Every immigration tool on NRItoUSA" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="group flex flex-col gap-0.5 rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
                  <span className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{l.label}</span>
                  <span className="text-xs text-ink-500">{l.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "uscis", "tax", "wealth"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
