import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import H1bLotteryTimeline from "@/components/tools/H1bLotteryTimeline";
import { getTool } from "@/lib/tools";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("h1b-lottery-timeline")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-lottery-timeline",
});

const faq: FaqItem[] = [
  {
    question: "When does the H-1B lottery happen each year?",
    answer:
      "Electronic registration typically opens in early March and closes in late March, with initial selections announced by March 31. Selected employers file petitions starting April 1, and approved H-1Bs begin October 1 — the start of the federal fiscal year.",
  },
  {
    question: "What are the odds of being selected in the H-1B lottery?",
    answer:
      "Odds depend on registration volume: 85,000 visas (65,000 regular + 20,000 US-master's) are drawn from recent registration pools that have ranged from roughly 350,000 to over 750,000, putting single-registration odds anywhere from ~15% to ~35%. The beneficiary-centric system (one entry per person regardless of employers) has made odds more uniform since 2024.",
  },
];

export default function H1bLotteryTimelinePage() {
  const jsonLd = jsonLdGraph(
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/h1b-lottery-timeline" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      <section className="py-12 sm:py-16">
        <Container>
          <H1bLotteryTimeline />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
