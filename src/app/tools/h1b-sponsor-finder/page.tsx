import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import H1bEmployerExplorer from "@/components/tools/h1b/H1bEmployerExplorer";
import { getTool } from "@/lib/tools";
import { getEmployerExplorer, getDataAsOf } from "@/lib/h1b/explorer";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h1b-sponsor-finder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-sponsor-finder",
});

const faq: FaqItem[] = [
  {
    question: "Which companies sponsor the most H-1B visas?",
    answer:
      "The table above opens on the national leaderboard — the employers that filed the most certified H-1B Labor Condition Applications (LCAs) in the covered period, ranked by volume, with the median annual wage they offered and the DOL wage-level mix. Amazon, the Big Four accounting and consulting firms, the large Indian IT services companies, and the major US tech employers dominate the top of that list, but thousands of smaller sponsors appear further down. Type a company name in the filter to check any specific employer.",
  },
  {
    question: "Which companies sponsor H-1B visas for my job in my state?",
    answer:
      "Set the job title and work state filters. The tool matches your title against the DOL occupation titles, then re-ranks the employer table to only the companies that filed certified H-1B LCAs for that occupation in that state. You can stack the wage band and minimum-filing-volume filters on top to narrow it further, and every filtered view has its own shareable URL.",
  },
  {
    question: "Does a high LCA count mean the company will sponsor me?",
    answer:
      "No. An LCA is an attestation an employer files with the Department of Labor before it files an H-1B petition with USCIS. A certified LCA is not a petition approval, not a visa, and not a job offer. A high count means the employer has sponsored that role at scale recently — a useful signal of willingness — but every individual case still depends on the lottery, the petition, and an actual job offer. Always confirm sponsorship with the employer directly.",
  },
  {
    question: "Where does this H-1B sponsor data come from?",
    answer:
      "From the US Department of Labor's OFLC LCA disclosure files — the official record of every H-1B labor condition application employers must file. We keep only certified H-1B cases, annualize the offered wages, group filings by employer, occupation, and worksite state, and publish the rollup. The DOL releases this data quarterly, so it lags real filings by roughly a quarter.",
  },
  {
    question: "How is the median wage calculated?",
    answer:
      "Each row of the underlying rollup carries the median annualized wage the employer offered for one occupation in one state. The company-level figure in the table is the filing-count-weighted median of those rows, so a company that files 2,000 developer LCAs and 5 manager LCAs shows a number driven by the developer roles. It is the wage the employer attested to on the LCA — the actual offer can be higher, and total compensation is not captured at all.",
  },
  {
    question: "What do the wage levels I–IV mean?",
    answer:
      "The DOL prevailing-wage system assigns each position a level by experience: I (entry), II (qualified), III (experienced), and IV (senior/fully competent). The wage-level bar on each row shows the mix of levels an employer filed — a sponsor filing mostly Level III–IV roles is hiring more senior than one filing mostly Level I.",
  },
  {
    question: "Why is my employer or role missing?",
    answer:
      "The dataset only includes employers with certified H-1B LCAs in the covered period. If a company hasn't filed recently, or hasn't filed for your exact occupation in your state, it won't appear under those filters — clear the filters and search the company name on its own to check. Public DOL files also strip the employer tax ID, so company names are grouped approximately and a few large sponsors appear under several legal entity names (Amazon.com Services LLC and Amazon Web Services, Inc. are listed separately, for example).",
  },
];

export default async function H1bSponsorFinderPage() {
  // Server-rendered so the leaderboard — company names included — is in the
  // HTML on first paint, before any JavaScript runs. The client explorer takes
  // over from this payload the moment a filter changes.
  const [initial, asOf] = await Promise.all([
    getEmployerExplorer({}),
    getDataAsOf(),
  ]);

  const url = absoluteUrl("/tools/h1b-sponsor-finder");
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
    {
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: "US H-1B sponsors by employer, occupation and state",
      description:
        "Certified H-1B Labor Condition Applications rolled up by employer, occupation and worksite state, with worker positions, median annualized wage and DOL wage-level mix.",
      url,
      license: "https://www.usa.gov/government-works",
      isAccessibleForFree: true,
      creator: { "@id": `${site.url}/#organization` },
      variableMeasured: [
        "Certified H-1B LCA count",
        "Worker positions",
        "Median annual wage",
        "DOL wage level",
      ],
      includedInDataCatalog: {
        "@type": "DataCatalog",
        name: "US Department of Labor OFLC Performance Data",
        url: "https://www.dol.gov/agencies/eta/foreign-labor/performance",
      },
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/h1b-sponsor-finder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="h1b-sponsor-finder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook={`Browse every US company that sponsors H-1Bs — ${initial.summary.employers.toLocaleString(
          "en-US"
        )} employers ranked by certified LCA volume, with median pay and wage levels. Filter by company, job title, state or wage.`}
        accent={tool.accent}
        sourceNote={
          <>
            Built from official DOL OFLC LCA disclosure filings ({asOf}). An LCA
            is a sponsorship signal — not a petition approval or a job offer.
          </>
        }
      >
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <H1bEmployerExplorer initial={initial} asOf={asOf} />
          </Container>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Methodology"
              title="How this list is built"
            />
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
                <h3 className="text-base font-bold text-ink-900">
                  Official DOL filings
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  Every H-1B job requires a certified Labor Condition
                  Application naming the employer, occupation, worksite, and
                  offered wage. The DOL publishes these quarterly — that
                  disclosure file is our only input.
                </p>
              </div>
              <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
                <h3 className="text-base font-bold text-ink-900">
                  Ranked by recent volume
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  We keep certified H-1B cases, group them by employer,
                  occupation, and worksite state, then roll them up per company
                  and rank by LCA count. Filter by role or state and the ranking
                  recomputes against only the filings that match.
                </p>
              </div>
              <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
                <h3 className="text-base font-bold text-ink-900">
                  A signal, not a promise
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  An LCA precedes the USCIS petition. Certification is not
                  approval, not a visa, and not a hire. Treat counts as evidence
                  of an employer&apos;s willingness to sponsor — then verify with
                  the company directly.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
