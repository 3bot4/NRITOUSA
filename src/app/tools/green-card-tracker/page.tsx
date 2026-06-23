import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import DataStamp from "@/components/tools/DataStamp";
import GreenCardEstimator from "@/components/tools/GreenCardEstimator";
import TrackerCharts from "@/components/tools/TrackerCharts";
import VisaBulletinAlert from "@/components/VisaBulletinAlert";
import Eb5SetAsidePanel from "@/components/Eb5SetAsidePanel";
import { getTool } from "@/lib/tools";
import {
  bulletin,
  CATEGORY_SHORT,
  COUNTRY_LABELS,
  formatCutoff,
  getCutoffs,
  type BulletinCountry,
  type EbCategory,
} from "@/lib/visa-bulletin";
import { inventoryMeta } from "@/lib/i485-inventory";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("green-card-tracker")!;

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
      "US law caps employment-based green cards at roughly 140,000 per year across all categories, and no single country of birth may use more than 7% (about 9,800) of them. Because demand from India far exceeds that 7% share every year, the unused demand piles up into a multi-decade backlog for EB-2 and EB-3 India.",
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
];

const CATEGORIES: EbCategory[] = ["eb1", "eb2", "eb3", "eb5"];
const COUNTRIES: BulletinCountry[] = ["india", "china", "row"];

export default function GreenCardTrackerPage() {
  const url = absoluteUrl("/tools/green-card-tracker");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "UtilityApplication",
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
      { name: tool.label, url: "/tools/green-card-tracker" },
    ])
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
      {/* Estimator */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <VisaBulletinAlert className="mx-auto mb-6 max-w-3xl" />
          <GreenCardEstimator variant="full" />
        </Container>
      </section>

      {/* Current bulletin table */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={`Visa bulletin · ${bulletin.month}`}
            title="Current cutoff dates at a glance"
            description="Final Action Dates (approval cutoff) for each employment-based category. 'Current' means no backlog."
          />
          <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/5 bg-[#fafafa] text-left text-xs font-bold uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-3.5">Category</th>
                  {COUNTRIES.map((c) => (
                    <th key={c} className="px-5 py-3.5">
                      {COUNTRY_LABELS[c]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => (
                  <tr
                    key={cat}
                    className="border-b border-ink-900/5 last:border-0"
                  >
                    <td className="px-5 py-3.5 font-semibold text-ink-900">
                      {CATEGORY_SHORT[cat]}
                    </td>
                    {COUNTRIES.map((c) => {
                      const cut = getCutoffs(cat, c);
                      const current = cut.fad === "C";
                      return (
                        <td
                          key={c}
                          className={`px-5 py-3.5 ${
                            current
                              ? "font-semibold text-emerald-600"
                              : "text-ink-700"
                          }`}
                        >
                          {formatCutoff(cut.fad)}
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

      {/* Historical chart */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="History"
            title="How the cutoffs have moved"
            description="Three years of Final Action Date and Dates for Filing movement, from monthly visa bulletin snapshots."
          />
          <TrackerCharts />
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
                The 7% per-country cap
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                No country of birth can use more than 7% of each year&apos;s
                employment-based green cards — about 9,800. Indian demand is
                many multiples of that, so the queue compounds year after year.
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

      {/* FAQ + disclaimer + internal links */}
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
      </ToolFirstLayout>
    </>
  );
}
