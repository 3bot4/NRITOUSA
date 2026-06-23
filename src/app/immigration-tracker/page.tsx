import type { Metadata } from "next";
import Container from "@/components/Container";
import ImmigrationTrackerDashboard from "@/components/tools/ImmigrationTrackerDashboard";
import ToolAnalytics from "@/components/tools/ToolAnalytics";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const TITLE = "NRI Immigration Tracker | Visa Bulletin, Green Card, USCIS & H1B Data";
const DESCRIPTION =
  "Track EB1, EB2, EB3 India visa bulletin dates, green card backlog, I-485 inventory, H1B lottery odds, USCIS processing times, EAD, advance parole and priority date movement.";
const PATH = "/immigration-tracker";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is the NRI Immigration Tracker?",
    answer:
      "The NRI Immigration Tracker is a free dashboard that consolidates key US immigration data for Indian nationals in one place: EB-1, EB-2, and EB-3 India visa bulletin dates, I-485 pending inventory, H1B lottery odds, USCIS processing times for I-485, I-140, EAD, advance parole, and H-1B petitions, plus a countdown to the next visa bulletin.",
  },
  {
    question: "Is this official USCIS data?",
    answer:
      "No. NRItoUSA.com is not affiliated with USCIS, the U.S. Department of State, or any government agency. All data on this tracker is sourced from official USCIS and State Department publications, but may lag official releases. Every data card shows its source and last-updated date. Always verify directly with official sources before acting on any immigration information.",
  },
  {
    question: "How often are Visa Bulletin dates updated?",
    answer:
      "The US Department of State publishes a new Visa Bulletin each month, typically in the second or third week, for the following month. Priority dates can move forward, stay the same, or retrogress (move back) depending on USCIS demand projections. We update this tracker's manually maintained bulletin data after each release.",
  },
  {
    question: "What does EB2 India gap mean?",
    answer:
      "The EB-2 India gap shown on this tracker is the simple calendar difference between today's date and the current EB-2 India Final Action Date in the Visa Bulletin. It is a quick way to visualize how far back the cutoff is — it is not a wait-time prediction, because cutoff movement depends on demand, per-country caps, and policy that can change month to month.",
  },
  {
    question: "Are USCIS processing times guaranteed?",
    answer:
      "No. USCIS processing times are estimates based on recent completions. They vary by service center, case type, RFE requests, and USCIS workload, and can lengthen or shorten month to month. Always verify current times at the official USCIS case processing times tool before making decisions.",
  },
  {
    question: "How are H1B lottery odds calculated?",
    answer:
      "H-1B lottery odds are estimated by dividing the number of cap-subject registrations selected by USCIS by the total number of eligible unique registrations submitted during the registration period. USCIS runs separate lotteries for the regular 65,000 cap and the 20,000 advanced-degree exemption. Odds vary each year based on employer demand and registration rules.",
  },
  {
    question: "Can I get email alerts for immigration updates?",
    answer:
      "Yes. Use the “Get Monthly Immigration Updates” section on this page to subscribe. You can choose which topics you care about — EB-1/EB-2/EB-3 India movement, H1B, processing times, or a monthly summary. We never ask for receipt numbers, A-numbers, passport numbers, employer names, or documents.",
  },
  {
    question: "Can I share this tracker with friends and family?",
    answer:
      "Yes. Use the share buttons on this page to send the tracker via WhatsApp, Facebook, or X, or copy the link directly. Many Indian families have multiple members waiting in the green card or H1B process, so sharing the dashboard can help everyone follow the same numbers in one place.",
  },
];

export default function ImmigrationTrackerPage() {
  const url = absoluteUrl(PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: TITLE,
      description: DESCRIPTION,
      url,
      applicationCategory: "GovernmentApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      inLanguage: "en-US",
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "NRI Immigration Tracker", url: PATH },
    ]),
    faqJsonLd(FAQ_ITEMS)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolAnalytics toolSlug="immigration-tracker" />
      <Container className="pb-12 pt-6 sm:pb-16">
        <ImmigrationTrackerDashboard faqItems={FAQ_ITEMS} />
      </Container>
    </>
  );
}
