import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import H4EadNavigator from "@/components/tools/H4EadNavigator";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h4-ead-navigator")!;
const content = getToolHubContent("h4-ead-navigator")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h4-ead-navigator",
});

const howTo = {
  "@type": "HowTo",
  name: "How to start earning on an H-4 EAD",
  description:
    "The core steps to begin working or freelancing on a valid H-4 Employment Authorization Document.",
  step: [
    { "@type": "HowToStep", name: "Confirm EAD validity", text: "Confirm your EAD is valid and note the exact expiration date." },
    { "@type": "HowToStep", name: "Confirm H-4 status", text: "Confirm your H-4 status / I-94 is valid, since the EAD depends on it." },
    { "@type": "HowToStep", name: "Get an SSN", text: "Get or confirm your Social Security Number." },
    { "@type": "HowToStep", name: "Choose how you'll work", text: "Decide between W-2 employment and self-employment (sole proprietorship vs LLC)." },
    { "@type": "HowToStep", name: "Plan for taxes", text: "Plan for self-employment tax and quarterly estimated taxes on 1099 income, and keep a separate business bank account." },
  ],
};

export default function H4EadNavigatorPage() {
  const url = absoluteUrl("/tools/h4-ead-navigator");
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: content.description,
      url,
      applicationCategory: content.appCategory,
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    howTo,
    faqJsonLd(content.faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/h4-ead-navigator" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="h4-ead-navigator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="What can an H-4 EAD spouse actually do? Find matched work & business ideas, myth-vs-reality answers, and an EAD renewal gap calculator."
        accent={tool.accent}
        disclaimerExtra={
          <p>
            Rules change; verify with an immigration attorney and official
            sources (uscis.gov and your state) before acting.
          </p>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>

          <H4EadNavigator />
        </Container>
      </section>

      {/* Full SEO hub content: explainer, process, timeline, documents,
          mistakes, related links, and FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
