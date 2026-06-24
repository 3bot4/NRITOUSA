import type { Metadata } from "next";
import Container from "@/components/Container";
import Ticker from "@/components/home/Ticker";
import HomeHero from "@/components/home/HomeHero";
import HubCards from "@/components/home/HubCards";
import HomeToolFinder from "@/components/home/HomeToolFinder";
import NriWealthPlanning from "@/components/home/NriWealthPlanning";
import CommonNriQuestions from "@/components/home/CommonNriQuestions";
import PopularGuidesForIndians from "@/components/home/PopularGuidesForIndians";
import AllToolsGrid from "@/components/home/AllToolsGrid";
import UscisToolsSpotlight from "@/components/home/UscisToolsSpotlight";
import TaxComplianceSpotlight from "@/components/home/TaxComplianceSpotlight";
import LeadMagnetSpotlight from "@/components/home/LeadMagnetSpotlight";
import LatestUpdates from "@/components/home/LatestUpdates";
import ImmigrationTrackerSpotlight from "@/components/home/ImmigrationTrackerSpotlight";
import { jsonLdGraph, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const HOME_TITLE =
  "NRI to USA — Free Immigration, Wealth, Tax & Money Tools for Indians in the USA";
const HOME_DESCRIPTION =
  "Free calculators, checklists, and guides for Indian families in the USA managing U.S. income, India assets, taxes, retirement, property, inheritance, FBAR/FATCA, and return-to-India decisions — plus the immigration tools you know us for.";

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
        <HubCards />
        <HomeToolFinder />
        <NriWealthPlanning />
        <CommonNriQuestions />
        <PopularGuidesForIndians />
        <ImmigrationTrackerSpotlight />
        <UscisToolsSpotlight />
        <TaxComplianceSpotlight />
        <LeadMagnetSpotlight />
        <AllToolsGrid />
        <LatestUpdates />
      </Container>
    </>
  );
}
