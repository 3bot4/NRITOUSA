import type { Metadata } from "next";
import Container from "@/components/Container";
import Ticker from "@/components/home/Ticker";
import HomeHero from "@/components/home/HomeHero";
import GlobalSearch from "@/components/home/GlobalSearch";
import MostUsedTools from "@/components/home/MostUsedTools";
import HubCards from "@/components/home/HubCards";
import PopularGuidesForIndians from "@/components/home/PopularGuidesForIndians";
import LeadMagnetSpotlight from "@/components/home/LeadMagnetSpotlight";
import LatestUpdates from "@/components/home/LatestUpdates";
import RecommendedToolsAd from "@/components/RecommendedToolsAd";
import { jsonLdGraph, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const HOME_TITLE =
  "NRI to USA — Free Immigration, Tax & Wealth Tools";
const HOME_DESCRIPTION =
  "Free calculators, checklists and guides for Indians in the USA: U.S. income, India assets, taxes, retirement, FBAR/FATCA and return-to-India planning.";

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

      <Ticker />
      <HomeHero />

      <Container className="pb-8 pt-6 sm:pb-10">
        {/* Clean gateway: search → most-used tools → hubs → guide → guides. */}
        <GlobalSearch />
        <MostUsedTools />
        <HubCards />
        <LeadMagnetSpotlight />
        <PopularGuidesForIndians />
        <LatestUpdates />
      </Container>

      <RecommendedToolsAd
        category="home"
        heading="Recommended Financial Tools for NRIs"
        sourcePage="home"
      />
    </>
  );
}
