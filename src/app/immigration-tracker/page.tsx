import type { Metadata } from "next";
import Container from "@/components/Container";
import ImmigrationTrackerDashboard from "@/components/tools/ImmigrationTrackerDashboard";
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
    question: "How often does the Visa Bulletin change?",
    answer:
      "The US Department of State publishes a new Visa Bulletin each month, typically in the second or third week of the month for the following month. Priority dates can move forward, stay the same, or retrogress (move back) depending on USCIS demand projections.",
  },
  {
    question: "What is EB2 India Final Action Date?",
    answer:
      "The EB-2 India Final Action Date is the cutoff date set in the monthly Visa Bulletin. Only Indian nationals with a green card priority date earlier than this cutoff can have their green card (Form I-485 or immigrant visa) approved. Due to the per-country cap, the EB-2 India cutoff is many years in the past, creating a multi-decade backlog for new applicants.",
  },
  {
    question: "What is the difference between Final Action Date and Dates for Filing?",
    answer:
      "The Final Action Date (FAD) controls when USCIS can actually approve a green card. The Dates for Filing (DFF) is an earlier cutoff that, in months when USCIS activates it, lets applicants submit their Form I-485 sooner — unlocking EAD work authorization and advance parole travel benefits while they wait years for the FAD to reach their priority date.",
  },
  {
    question: "What does I-485 backlog mean?",
    answer:
      "The I-485 backlog is the number of Form I-485 (Adjustment of Status) applications already filed with USCIS and waiting in queue. USCIS publishes periodic snapshots of pending employment-based I-485s by country of birth and priority year. The India backlog is large because per-country caps limit how many green cards India-born applicants can receive each year.",
  },
  {
    question: "Are USCIS processing times guaranteed?",
    answer:
      "No. USCIS processing times are estimates based on recent completions. They vary by service center, case type, RFE requests, and USCIS workload. Processing times can lengthen or shorten month to month. Always verify current times at the official USCIS case processing times tool before making decisions.",
  },
  {
    question: "How are H1B lottery odds calculated?",
    answer:
      "H-1B lottery odds are estimated by dividing the number of cap-subject registrations selected by USCIS by the total number of eligible unique registrations submitted during the registration period. USCIS runs separate lotteries for the regular 65,000 cap and the 20,000 advanced-degree exemption. Odds vary each year based on employer demand.",
  },
  {
    question: "Is this official USCIS data?",
    answer:
      "No. NRItoUSA.com is not affiliated with USCIS, the U.S. Department of State, or any government agency. All data on this tracker is sourced from official USCIS and State Department publications, but may lag official releases. Every data card shows its source and last-updated date. Always verify directly with official sources before acting on any immigration information.",
  },
];

export default function ImmigrationTrackerPage() {
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebPage",
      "@id": absoluteUrl(PATH),
      url: absoluteUrl(PATH),
      name: TITLE,
      description: DESCRIPTION,
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
      <Container className="pb-12 pt-6 sm:pb-16">
        <ImmigrationTrackerDashboard faqItems={FAQ_ITEMS} />
      </Container>
    </>
  );
}
