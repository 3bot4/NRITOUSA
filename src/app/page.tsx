import type { Metadata } from "next";
import Container from "@/components/Container";
import HomeHeroPanel from "@/components/home/HomeHeroPanel";
import TrustBar from "@/components/home/TrustBar";
import MostSearched from "@/components/home/MostSearched";
import JourneyHubs from "@/components/home/JourneyHubs";
import VisitorInsuranceSpotlight from "@/components/home/VisitorInsuranceSpotlight";
import GuidesAndUpdates from "@/components/home/GuidesAndUpdates";
import GuideDirectory from "@/components/home/GuideDirectory";
import WealthCtaBand from "@/components/home/WealthCtaBand";
import RecommendedToolsAd from "@/components/RecommendedToolsAd";
import { jsonLdGraph, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/**
 * Re-render every 6 hours so the market snapshot's age is re-evaluated.
 *
 * The homepage is otherwise fully static, which means anything derived from
 * "now" freezes at build time. marketDataStale() in @/lib/market compares
 * data/market.json's `asOf` against the current date to decide whether the
 * ticker may still present its figures as current — a check that is worthless
 * if it only ever runs at deploy. Six hours is well inside the 3-day staleness
 * threshold and costs one render.
 */
export const revalidate = 21600;

const HOME_TITLE = "NRI to USA — Free Immigration, Tax & Wealth Tools";
const HOME_DESCRIPTION =
  "Free calculators, checklists and guides for Indians in the USA: H-1B and green card timelines, the visa bulletin for India, USCIS case status, FBAR/FATCA, India tax, 401(k) and return-to-India planning.";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function HomePage() {
  const jsonLd = jsonLdGraph(websiteJsonLd, organizationJsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero carries the site search and the Green Card Line rate card, which
          replaced the scrolling ticker strip that used to sit above it. */}
      <HomeHeroPanel />
      <TrustBar />
      <MostSearched />
      <JourneyHubs />

      <Container>
        <VisitorInsuranceSpotlight />
      </Container>

      <GuidesAndUpdates />
      <GuideDirectory />
      <WealthCtaBand />

      <RecommendedToolsAd
        category="home"
        heading="Recommended Financial Tools for NRIs"
        sourcePage="home"
      />
    </>
  );
}
