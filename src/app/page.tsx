import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import TrustStrip from "@/components/home/TrustStrip";
import FeaturedTopics from "@/components/home/FeaturedTopics";
import WhyExists from "@/components/home/WhyExists";
import PopularGuides from "@/components/home/PopularGuides";
import FinanceHub from "@/components/home/FinanceHub";
import CommunityPreview from "@/components/home/CommunityPreview";
import StoriesPreview from "@/components/home/StoriesPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedTopics />
      <WhyExists />
      <PopularGuides />
      <FinanceHub />
      <CommunityPreview />
      <StoriesPreview />
      <Newsletter />
    </>
  );
}
