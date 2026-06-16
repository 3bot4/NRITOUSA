import type { Metadata } from "next";
import Container from "@/components/Container";
import Ticker from "@/components/home/Ticker";
import HomeHero from "@/components/home/HomeHero";
import PopularGuidesForIndians from "@/components/home/PopularGuidesForIndians";
import AllToolsGrid from "@/components/home/AllToolsGrid";
import UscisToolsSpotlight from "@/components/home/UscisToolsSpotlight";
import TaxComplianceSpotlight from "@/components/home/TaxComplianceSpotlight";
import LatestUpdates from "@/components/home/LatestUpdates";
import { jsonLdGraph, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const HOME_TITLE =
  "NRI to USA — Free Immigration, Tax & Money Tools for Indians in the USA";
const HOME_DESCRIPTION =
  "Free tools and guides for Indians in the USA. Passport renewal, visa bulletin tracker, green card wait times, FBAR/FATCA checker, remittance calculator, H-1B salaries and more.";

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
        <PopularGuidesForIndians />
        <UscisToolsSpotlight />
        <TaxComplianceSpotlight />
        <AllToolsGrid />
        <LatestUpdates />
      </Container>
    </>
  );
}
