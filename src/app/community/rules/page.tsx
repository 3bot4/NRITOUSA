import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import CommunityDisclaimer from "@/components/community/Disclaimer";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";
import { COMMUNITY_RULES } from "@/lib/community-utils";

export const dynamic = "force-static";

const title = "Community Rules";
const description =
  "The rules for the NRI to USA community — be respectful, no spam, protect private information, and no direct financial, tax, legal, or immigration advice.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/community/rules" },
  openGraph: { type: "website", url: "/community/rules", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function CommunityRulesPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Community", url: "/community" },
      { name: "Rules", url: "/community/rules" },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-ink-900/5 bg-white py-12 sm:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-ink-400">
            <Link href="/community" className="hover:text-brand-600">Community</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-600">Rules</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900">Community rules</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-500">
            This community works because people are kind, honest, and careful. A few simple rules keep it that way.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="mx-auto max-w-3xl">
          <ol className="space-y-5">
            {COMMUNITY_RULES.map((r, i) => (
              <li key={r.title} className="flex gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <span aria-hidden className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-bold text-ink-900">{r.title}</h2>
                  <p className="mt-1 text-ink-600">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5 text-sm text-ink-600">
            <h2 className="mb-2 font-bold text-ink-900">About “Community Starter” profiles</h2>
            <p>
              To help the community get going, some discussions are started by clearly
              labeled <strong>“Community Starter”</strong> profiles that are managed by our team.
              They are <strong>not</strong> independent real members — they exist to seed useful
              conversations. Posts from our team are labeled
              <strong> “NRI to USA Team · Official.”</strong> We label these clearly so no one is
              misled about who is posting.
            </p>
          </div>

          <div className="mt-8"><CommunityDisclaimer /></div>
        </div>
      </Container>
    </>
  );
}
