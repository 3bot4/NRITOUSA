import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "Privacy Policy";
const description =
  "How NRI to USA (owned by Wealth Building Academy LLC) collects, uses, and protects your information, including cookies, Google Analytics, advertising, and your privacy choices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { type: "website", url: "/privacy-policy", title, description },
  twitter: { title, description },
};

export default function PrivacyPolicyPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Privacy Policy", url: "/privacy-policy" },
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
              &quot;us&quot;, &quot;our&quot;) collects, uses, and safeguards
              information when you visit{" "}
              <a
                href={site.url}
                className="text-brand-600 underline"
                rel="noopener noreferrer"
              >
                {site.domain}
              </a>
              . {site.name} is owned and operated by{" "}
              <strong>{site.owner}</strong>. By using this website, you agree to
              the practices described below.
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
                  <strong>Information you provide</strong> — such as your name,
                  email address, and message if you contact us or subscribe to
                  our newsletter.
                </li>
                <li>
                  <strong>Usage data</strong> — such as pages visited, time on
                  page, browser type, device, approximate location, and
                  referring source, collected automatically through analytics.
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
                Cookies and tracking
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
                Google Analytics
              </h2>
              <p className="mt-3">
                We use Google Analytics to understand how visitors use the site.
                Google Analytics collects aggregated, largely non-identifying
                usage data — such as pages viewed, session duration, and general
                location — to help us improve our content. This data is processed
                according to{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                . You can opt out using the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Advertising &amp; third-party partners
              </h2>
              <p className="mt-3">
                We may display advertising from third-party networks such as
                Google AdSense. Third-party vendors, including Google, use
                cookies to serve ads based on a user&apos;s prior visits to this
                and other websites. Google&apos;s use of advertising cookies
                enables it and its partners to serve ads to you based on your
                visit to our site and/or other sites on the internet.
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
                  Google&apos;s partner-sites policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Newsletter &amp; contact form
              </h2>
              <p className="mt-3">
                If you subscribe to our newsletter or send us a message, we use
                the details you provide solely to respond to you or send the
                updates you requested. Please do not send sensitive financial,
                tax, legal, or immigration documents through the contact form.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                We do not sell your personal information
              </h2>
              <p className="mt-3">
                We do not sell, rent, or trade your personal information to third
                parties. We share data only with service providers (such as
                analytics and advertising partners) that help us operate the
                site, and only as described in this policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Third-party links
              </h2>
              <p className="mt-3">
                Our guides may link to third-party websites. We are not
                responsible for the privacy practices or content of those sites.
                We encourage you to review the privacy policy of any website you
                visit.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Data security
              </h2>
              <p className="mt-3">
                We take reasonable measures to protect the information we hold.
                However, no method of transmission over the internet or
                electronic storage is completely secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Children&apos;s privacy
              </h2>
              <p className="mt-3">
                This site is intended for adults and is not directed at children
                under 13. We do not knowingly collect personal information from
                children. If you believe a child has provided us with personal
                information, please contact us and we will delete it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Your choices
              </h2>
              <p className="mt-3">
                You can unsubscribe from our newsletter at any time using the
                link in any email. You can manage cookies through your browser
                and opt out of personalized ads and analytics as described
                above.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Updates to this policy
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
                . {site.name} is owned and operated by {site.owner}.
              </p>
            </div>

            <div className="rounded-2xl border border-ink-900/5 bg-slate-50 p-5 text-sm text-ink-500">
              This Privacy Policy is provided for general informational purposes
              and should be reviewed by a qualified legal professional for your
              specific business needs.
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
