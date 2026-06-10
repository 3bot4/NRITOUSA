import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import TrustStrip from "@/components/home/TrustStrip";
import FeaturedTopics from "@/components/home/FeaturedTopics";
import WhyExists from "@/components/home/WhyExists";
import PopularGuides from "@/components/home/PopularGuides";
import CalculatorsPreview from "@/components/home/CalculatorsPreview";
import CitizenshipFinder from "@/components/home/CitizenshipFinder";
import FinanceHub from "@/components/home/FinanceHub";
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
      <Hero />
      <TrustStrip />
      <FeaturedTopics />
      <WhyExists />
      <PopularGuides />
      <CalculatorsPreview />
      <CitizenshipFinder />
      <FinanceHub />
      <CommunityPreview />
      <StoriesPreview />
      <Newsletter />
    </>
  );
}
