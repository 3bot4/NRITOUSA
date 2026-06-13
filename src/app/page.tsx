import type { Metadata } from "next";
import Container from "@/components/Container";
import Ticker from "@/components/home/Ticker";
import HomeHero from "@/components/home/HomeHero";
import AllToolsGrid from "@/components/home/AllToolsGrid";
import LatestUpdates from "@/components/home/LatestUpdates";
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

      <Container className="py-8 sm:py-10">
        <AllToolsGrid />
        <LatestUpdates />
      </Container>
    </>
  );
}
