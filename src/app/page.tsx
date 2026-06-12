import type { Metadata } from "next";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import Ticker from "@/components/home/Ticker";
import HomeHero from "@/components/home/HomeHero";
import LatestUpdates from "@/components/home/LatestUpdates";
import PopularToolsGrid from "@/components/home/PopularToolsGrid";
import HomeDataSidebar from "@/components/home/HomeDataSidebar";
import TopTools from "@/components/home/TopTools";
import CitizenshipFinder from "@/components/home/CitizenshipFinder";
import FeaturedTopics from "@/components/home/FeaturedTopics";
import WhyExists from "@/components/home/WhyExists";
import PopularGuides from "@/components/home/PopularGuides";
import FinanceHub from "@/components/home/FinanceHub";
import ComingSoon from "@/components/home/ComingSoon";
import CommunityPreview from "@/components/home/CommunityPreview";
import StoriesPreview from "@/components/home/StoriesPreview";
import { jsonLdGraph, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
  },
  description:
    "Practical guides for NRIs and immigrants in the USA on money, housing, cars, taxes, investing, retirement, and India-USA life.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
    description:
      "Practical guides for NRIs and immigrants in the USA on money, housing, cars, taxes, investing, retirement, and India-USA life.",
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

      {/* Data-dense main column + right rail (sidebar stacks below on mobile) */}
      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <LatestUpdates />
            <PopularToolsGrid />
          </div>
          <HomeDataSidebar />
        </div>
      </Container>

      {/* Existing depth sections retained for SEO + discovery */}
      <TopTools />
      <CitizenshipFinder />
      <FeaturedTopics />
      <WhyExists />
      <PopularGuides />
      <FinanceHub />
      <ComingSoon />
      <CommunityPreview />
      <StoriesPreview />
      <Newsletter />
    </>
  );
}
