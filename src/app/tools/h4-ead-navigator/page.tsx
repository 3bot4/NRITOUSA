import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import H4EadNavigator from "@/components/tools/H4EadNavigator";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h4-ead-navigator")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h4-ead-navigator",
});

const faq: FaqItem[] = [
  {
    question: "What can an H-4 EAD holder do for work?",
    answer:
      "While the H-4 EAD is valid, it is unrestricted as to employer and work type — you can take a W-2 job, work as a 1099 contractor or freelancer, or run your own sole proprietorship or LLC, full-time or part-time. There is no specialty-occupation or prevailing-wage requirement like the H-1B has. The key condition is that the EAD must be valid, which depends on maintaining H-4 status.",
  },
  {
    question: "Can an H-4 EAD holder start a business or an LLC?",
    answer:
      "Yes. You can form and own an LLC and actively work in your own business on a valid H-4 EAD. Anyone can passively own a US company; the EAD is what authorizes you to actively work in it. Once the EAD expires (and renewals filed on or after Oct 30, 2025 no longer get an automatic extension), you must stop actively working until a new EAD is approved.",
  },
  {
    question: "Can an H-4 EAD holder run an in-home daycare?",
    answer:
      "Potentially, but child-care licensing rules — including whether a license is required and how many children you may care for — vary by state and change often. Treat any specific number you see online as illustrative, not compliance advice, and verify the current rules with your state's official licensing authority before caring for any children.",
  },
  {
    question: "Can an H-4 EAD holder do freelance or 1099 work?",
    answer:
      "Yes, freelance and 1099 self-employment are allowed on a valid H-4 EAD. Self-employment income is reported on Schedule C and is subject to self-employment tax, so set aside money for taxes and consider quarterly estimated payments. Confirm your specifics with a CPA.",
  },
  {
    question: "How long does an H-4 EAD renewal take, and will there be a work gap?",
    answer:
      "As of 2026, H-4 EAD (category c(26)) renewals commonly take several months to over a year, and a DHS rule effective October 30, 2025 removed the automatic extension for renewals filed on or after that date — so if your EAD expires before approval, you must stop working in the interim. File as early as possible within the 180-day window. Use the renewal gap calculator on this page and verify current processing times on uscis.gov.",
  },
  {
    question: "Does working on an H-4 EAD hurt my spouse's H-1B or our green card?",
    answer:
      "Lawful work on a valid EAD does not by itself harm the H-1B or a pending green-card case. The real dependency runs the other way: your H-4 status — and therefore your EAD — depends on the H-1B spouse maintaining valid H-1B status. If the H-1B lapses, the H-4 and EAD are affected. This is educational information, not legal advice.",
  },
];

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
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    howTo,
    faqJsonLd(faq),
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
          <H4EadNavigator />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
