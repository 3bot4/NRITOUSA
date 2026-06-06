import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "Privacy Policy";
const description =
  "How NRI to USA collects, uses, and protects your information, including cookies, analytics, advertising partners, and your privacy choices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { type: "website", url: "/privacy", title, description },
  twitter: { title, description },
};

export default function PrivacyPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Privacy Policy", url: "/privacy" },
    ])
  );

  const updated = "June 5, 2026";

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
              <span className="text-ink-700">Privacy Policy</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900">
              Privacy Policy
            </h1>
            <p className="mt-4 text-ink-400">Last updated: {updated}</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-prose space-y-8 leading-8 text-ink-700">
            <p>
              This Privacy Policy explains how {site.name} (&quot;we&quot;,
              &quot;us&quot;) collects, uses, and safeguards information when you
              visit {site.domain}. By using this website, you agree to the
              practices described below.
            </p>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Information we collect
              </h2>
              <p className="mt-3">
                We aim to collect as little personal information as possible.
                Depending on how you use the site, this may include:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong>Information you provide</strong> — such as your email
                  address if you subscribe to our newsletter or contact us.
                </li>
                <li>
                  <strong>Usage data</strong> — such as pages visited, time on
                  page, browser type, device, and referring source, collected
                  automatically through analytics.
                </li>
                <li>
                  <strong>Cookies and similar technologies</strong> — small
                  files stored on your device to enable analytics and
                  advertising.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                How we use information
              </h2>
              <p className="mt-3">
                We use the information we collect to operate and improve the
                website, understand which guides are useful, respond to your
                messages, send our newsletter (if you opted in), and maintain
                the security of the site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Cookies
              </h2>
              <p className="mt-3">
                Cookies help us understand site usage and deliver relevant
                content and advertising. You can control or delete cookies
                through your browser settings. Disabling cookies may affect some
                features of the site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Advertising &amp; third-party partners
              </h2>
              <p className="mt-3">
                We may display advertising from third-party networks such as
                Google AdSense. These partners may use cookies and similar
                technologies to serve ads based on your prior visits to this and
                other websites. Third-party vendors, including Google, use
                cookies to serve ads based on a user&apos;s prior visits.
                Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visit to our site
                and/or other sites on the internet.
              </p>
              <p className="mt-3">
                You may opt out of personalized advertising by visiting
                Google&apos;s{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  Ads Settings
                </a>
                . For more information about how advertising vendors use data,
                see{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  Google&apos;s policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Analytics
              </h2>
              <p className="mt-3">
                We may use analytics services to understand how visitors use the
                site. These services collect aggregated, non-identifying usage
                data to help us improve our content.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Your choices
              </h2>
              <p className="mt-3">
                You can unsubscribe from our newsletter at any time using the
                link in any email. You can manage cookies through your browser
                and opt out of personalized ads as described above.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Children&apos;s privacy
              </h2>
              <p className="mt-3">
                This site is intended for adults and is not directed at children
                under 13. We do not knowingly collect personal information from
                children.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Changes to this policy
              </h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. Changes will
                be posted on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Contact
              </h2>
              <p className="mt-3">
                Questions about this policy? Email us at{" "}
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
          </div>
        </Container>
      </section>
    </>
  );
}
