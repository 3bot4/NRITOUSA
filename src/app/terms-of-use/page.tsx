import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "Terms of Use";
const description =
  "The terms governing your use of NRI to USA, owned by Wealth Building Academy LLC. Content is educational only and not financial, legal, tax, or immigration advice.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms-of-use" },
  openGraph: { type: "website", url: "/terms-of-use", title, description },
  twitter: { title, description },
};

export default function TermsOfUsePage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Terms of Use", url: "/terms-of-use" },
    ])
  );

  const updated = "June 6, 2026";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-ink-900/5 bg-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-prose">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex items-center gap-2 text-sm text-ink-400"
            >
              <Link href="/" className="hover:text-brand-600">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink-700">Terms of Use</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900">
              Terms of Use
            </h1>
            <p className="mt-4 text-ink-400">Last updated: {updated}</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-prose space-y-8 leading-8 text-ink-700">
            <p>
              Welcome to {site.name} ({site.domain}), owned and operated by{" "}
              <strong>{site.owner}</strong>. These Terms of Use
              (&quot;Terms&quot;) govern your access to and use of this website.
              Please read them carefully.
            </p>

            <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 leading-7 text-ink-700">
              By using {site.name}, you understand that content is educational
              only and should not replace advice from licensed financial, tax,
              legal, immigration, or investment professionals.
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Acceptance of terms
              </h2>
              <p className="mt-3">
                By accessing or using this website, you agree to be bound by
                these Terms and our{" "}
                <Link href="/privacy-policy" className="text-brand-600 underline">
                  Privacy Policy
                </Link>
                . If you do not agree, please do not use the site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Educational content only
              </h2>
              <p className="mt-3">
                All content on {site.name} is provided for general educational
                and informational purposes. It does not constitute financial,
                legal, tax, immigration, or investment advice, and it does not
                create any professional or advisory relationship between you and{" "}
                {site.owner}.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                No professional advice
              </h2>
              <p className="mt-3">
                We are not your financial advisor, CPA, attorney, or immigration
                consultant. Before making any decision, consult a licensed
                professional who can review your specific situation. See our{" "}
                <Link href="/disclaimer" className="text-brand-600 underline">
                  full disclaimer
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                User responsibility
              </h2>
              <p className="mt-3">
                You are solely responsible for how you use the information on
                this site and for verifying details with official sources and
                qualified professionals before acting.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                No guarantees of accuracy or completeness
              </h2>
              <p className="mt-3">
                We work to keep content accurate and current, but rules change
                and errors happen. We make no warranties regarding the accuracy,
                completeness, or timeliness of any content, and the site is
                provided on an &quot;as is&quot; and &quot;as available&quot;
                basis.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Third-party links
              </h2>
              <p className="mt-3">
                The site may contain links to third-party websites and may
                display third-party advertising. We do not control and are not
                responsible for the content, accuracy, or practices of those
                sites. Links and ads do not imply endorsement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Intellectual property
              </h2>
              <p className="mt-3">
                All content on this site — including text, graphics, logos, and
                design — is the property of {site.owner} or its licensors and is
                protected by applicable intellectual property laws. You may not
                reproduce, republish, or redistribute substantial portions of
                our content without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Prohibited use
              </h2>
              <p className="mt-3">
                You agree not to use the site for any unlawful purpose, to
                attempt to gain unauthorized access to our systems, to scrape or
                copy content at scale, to introduce malicious code, or to
                interfere with the site&apos;s operation or other users&apos;
                enjoyment of it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Limitation of liability
              </h2>
              <p className="mt-3">
                To the fullest extent permitted by law, {site.owner} and {site.name}{" "}
                shall not be liable for any direct, indirect, incidental, or
                consequential loss or damage arising from your use of, or
                reliance on, the site or its content. You use the site at your
                own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Changes to these terms
              </h2>
              <p className="mt-3">
                We may update these Terms from time to time. Changes will be
                posted on this page with a revised date, and your continued use
                of the site constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Contact
              </h2>
              <p className="mt-3">
                Questions about these Terms? Email us at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-brand-600 underline"
                >
                  {site.email}
                </a>{" "}
                or visit our{" "}
                <Link href="/contact" className="text-brand-600 underline">
                  contact page
                </Link>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-ink-900/5 bg-slate-50 p-5 text-sm text-ink-500">
              These Terms of Use are provided for general informational purposes
              and should be reviewed by a qualified legal professional for your
              specific business needs.
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
