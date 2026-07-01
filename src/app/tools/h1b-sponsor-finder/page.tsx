import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import H1BSponsorFinder from "@/components/tools/H1BSponsorFinder";
import { getTool } from "@/lib/tools";
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
    question: "Which companies sponsor H-1B visas for my job?",
    answer:
      "Search your job title and work state above. The tool maps your title to its DOL occupation code(s) and lists the employers that filed the most certified H-1B Labor Condition Applications (LCAs) for that occupation in that state over the last 12 months, ranked by volume. Big H-1B filers — large tech companies and IT services firms — will usually top the list, but smaller specialist sponsors show up too.",
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
    question: "What do the wage levels I–IV mean?",
    answer:
      "The DOL prevailing-wage system assigns each position a level by experience: I (entry), II (qualified), III (experienced), and IV (senior/fully competent). The wage-level bar on each card shows the mix of levels an employer filed for that role — a sponsor filing mostly Level III–IV roles is hiring more senior than one filing mostly Level I.",
  },
  {
    question: "Why is my employer or role missing?",
    answer:
      "The dataset only includes employers with certified H-1B LCAs for that occupation in that state in the covered period. If a company hasn't filed for your exact role in your state recently, it won't appear — try a broader job title or a neighboring state. Public DOL files also strip the employer tax ID, so company names are grouped approximately and a few large sponsors may appear under slightly different names.",
  },
];

export default function H1bSponsorFinderPage() {
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
        hook="Which companies actually sponsor H-1Bs for your role, in your state? Search by job title and state to see the employers filing the most certified H-1B LCAs — ranked, with median pay and wage levels."
        accent={tool.accent}
        sourceNote={
          <>
            Built from official DOL OFLC LCA disclosure filings. An LCA is a
            sponsorship signal — not a petition approval or a job offer.
          </>
        }
      >
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <H1BSponsorFinder />
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
                  We keep certified H-1B cases from the last 12 months, group
                  them by employer, occupation, and state, and rank by LCA count
                  (then by total worker positions). The result is who sponsors
                  your role most where you want to work.
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
