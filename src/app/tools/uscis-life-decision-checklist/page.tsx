import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import UscisLifeDecisionChecklist from "@/components/tools/UscisLifeDecisionChecklist";
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

const tool = getTool("uscis-life-decision-checklist")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-life-decision-checklist",
});

const faq: FaqItem[] = [
  {
    question: "Can I change jobs while my I-485 is pending?",
    answer:
      "Yes — if your I-485 has been pending for at least 180 days AND your I-140 is approved, AC21 portability lets you change to a same-or-similar job without restarting your green card. Before 180 days, a job change is much riskier. Never change jobs without consulting your attorney.",
  },
  {
    question: "Do I need Advance Parole to visit India?",
    answer:
      "If your I-485 is pending, yes — you need a physical Advance Parole card (I-131) in hand before departure. Leaving without it is treated as I-485 abandonment. The H-1B visa stamp exception exists but is narrow and carries risk. File I-131 with your I-485 and wait for the physical card before booking travel.",
  },
  {
    question: "Can I buy a house on H-1B?",
    answer:
      "Yes. Nonimmigrant visa holders can legally purchase property in the US. Most major mortgage lenders accept H-1B borrowers with 1–2+ years of H-1B validity remaining. The questions to answer: what happens if your status changes, your employer changes, or your I-485 is delayed? Plan these scenarios before signing.",
  },
  {
    question: "What happens to my I-140 if I get laid off?",
    answer:
      "If your I-140 has been approved for 180+ days at the time of the layoff, the priority date survives even if your employer withdraws the I-140. Your new employer can file a new I-140 and you can carry the old priority date. You have a 60-day grace period on H-1B to find new sponsorship. Act in the first 72 hours after a layoff.",
  },
  {
    question: "Can my H-4 spouse work if I have an approved I-140?",
    answer:
      "Yes. H-4 EAD eligibility requires two things: (1) you (the H-1B principal) have an approved I-140, and (2) your spouse is in valid H-4 status. The priority date does not need to be current. File I-765 immediately after I-140 is approved. Note: H-4 EAD has no 180-day automatic extension — file renewal 6 months before expiration.",
  },
  {
    question: "Can I start a business on H-1B?",
    answer:
      "You can own a business and earn passive income (dividends, distributions, rent) on H-1B. What you cannot do is actively work in that business without separate work authorization. Your H-4 EAD spouse can actively run a business you own. Once you have EAD from I-485, you can work in your own business freely.",
  },
];

export default function UscisLifeDecisionChecklistPage() {
  const url = absoluteUrl("/tools/uscis-life-decision-checklist");
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
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/uscis-life-decision-checklist" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool}>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/uscis/life-planning"
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            Full life planning guide →
          </Link>
          <Link
            href="/community/nri-uscis-decisions"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20"
          >
            Community insights
          </Link>
        </div>
      </ToolHero>

      {/* Disclaimer strip */}
      <section className="border-b border-ink-900/5 bg-amber-50/40">
        <Container className="py-3">
          <p className="text-center text-xs text-ink-600">
            <strong className="font-semibold text-ink-800">Educational only — not legal advice.</strong>{" "}
            No personal immigration identifiers collected. Always consult your immigration attorney before major decisions.
          </p>
        </Container>
      </section>

      {/* Tool */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <UscisLifeDecisionChecklist />
          </div>
        </Container>
      </section>

      {/* Related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Life decision guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/uscis/change-job-during-green-card", label: "Change Job During Green Card", desc: "AC21 portability, 180-day rule, I-485J notification" },
                { href: "/uscis/buy-house-while-waiting-for-green-card", label: "Buy a House (Green Card Pending)", desc: "H-1B mortgage, down payment, scenarios to plan for" },
                { href: "/uscis/travel-to-india-while-i485-pending", label: "Travel to India (I-485 Pending)", desc: "Advance Parole rules, H-1B travel exception" },
                { href: "/uscis/layoff-green-card-process", label: "Layoff During Green Card", desc: "60-day grace period, I-140 portability, AC21" },
                { href: "/uscis/h4-ead-renewal-delay", label: "H-4 EAD Renewal Gap", desc: "No auto-extension, file 6 months early, income gap planning" },
                { href: "/uscis/start-side-business-on-h1b", label: "Side Business on H-1B", desc: "Passive vs active work distinction, EAD path" },
                { href: "/uscis/kids-aging-out-cspa", label: "Kids Aging Out (CSPA)", desc: "CSPA formula, India EB backlog risk, independent paths" },
                { href: "/uscis/moving-states-address-change", label: "Moving States (H-1B / I-485)", desc: "H-1B amendment, LCA, AR-11, field office transfer" },
              ].map((g) => (
                <Link key={g.href} href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ + disclaimer */}
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
