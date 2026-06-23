import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import LegalPageLayout, {
  LegalCallout,
  LegalList,
  LegalWarning,
  type LegalSection,
} from "@/components/LegalPageLayout";

/*
 * Cookie Policy for nritousa.com (operated by Wealth Building Academy LLC).
 * Strong professional draft for attorney review — not legal advice and not a
 * guarantee of compliance. A cookie consent banner is NOT currently
 * implemented; see the TODO in docs/legal-policy-review-todos.md before
 * claiming consent compliance for any jurisdiction that requires it.
 */

const title = "Cookie Policy";
const description =
  "How NRI to USA (Wealth Building Academy LLC) uses cookies and similar technologies for analytics, performance, preferences, and advertising — and how you can control them.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Cookie Policy", url: "/cookie-policy" },
    ])
  );

  const sections: LegalSection[] = [
    {
      id: "what-cookies-are",
      heading: "What cookies are",
      body: (
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help the site function, remember your preferences, and
          understand how the site is used. We also use similar technologies such
          as pixels and local storage, which we refer to collectively as
          &quot;cookies&quot; in this policy.
        </p>
      ),
    },
    {
      id: "types-we-use",
      heading: "Types of cookies we may use",
      body: (
        <LegalList
          items={[
            <>
              <strong>Necessary cookies</strong> — required for the Site to
              function and to keep it secure.
            </>,
            <>
              <strong>Analytics cookies</strong> — help us understand how
              visitors use the Site so we can improve it.
            </>,
            <>
              <strong>Performance cookies</strong> — help us measure and improve
              site speed and reliability.
            </>,
            <>
              <strong>Preference cookies</strong> — remember choices you make to
              improve your experience.
            </>,
            <>
              <strong>Advertising / affiliate cookies</strong> — where applicable,
              support advertising and affiliate-link tracking.
            </>,
          ]}
        />
      ),
    },
    {
      id: "google-analytics",
      heading: "Google Analytics and similar tools",
      body: (
        <p>
          We use Google Analytics, and may use similar tools, to collect
          aggregated, largely non-identifying usage data such as pages viewed,
          session duration, and approximate location. This data is processed
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
      ),
    },
    {
      id: "email-marketing-tracking",
      heading: "Email / marketing tracking",
      body: (
        <p>
          If you receive our emails, our email provider may use tracking
          technologies to measure opens, clicks, and engagement so we can improve
          the content we send. You can opt out by unsubscribing using the link in
          any email.
        </p>
      ),
    },
    {
      id: "third-party-cookies",
      heading: "Third-party cookies",
      body: (
        <p>
          Some cookies are set by third parties — such as analytics, advertising,
          affiliate, and embedded-tool providers — when you use the Site. We do
          not control these cookies. Please review the relevant third
          party&apos;s privacy and cookie policies for details about how they use
          data.
        </p>
      ),
    },
    {
      id: "control-cookies",
      heading: "How users can control cookies",
      body: (
        <>
          <p>
            Most browsers let you view, manage, block, and delete cookies through
            their settings. You can also opt out of analytics and personalized
            advertising as described above and in our{" "}
            <Link href="/privacy-policy" className="text-brand-600 underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            Blocking some cookies may affect how parts of the Site work.
          </p>
        </>
      ),
    },
    {
      id: "cookie-consent",
      heading: "Cookie consent / privacy choices",
      body: (
        <>
          <p>
            You can manage cookies at any time through your browser settings and
            the opt-out tools described in this policy.
          </p>
          <LegalWarning title="Note for the site owner (to be confirmed)">
            {/* TODO: Implement a cookie preference banner if required for the
                site's target users/jurisdictions (e.g. EU/UK consent, or certain
                U.S. state requirements). Until then, do not claim cookie-consent
                compliance. See docs/legal-policy-review-todos.md. */}
            A cookie consent banner is not currently implemented. If the Site
            targets users in jurisdictions that require prior consent for
            non-essential cookies, a cookie preference banner should be added
            before relying on this policy for consent.
          </LegalWarning>
        </>
      ),
    },
    {
      id: "updates",
      heading: "Updates",
      body: (
        <p>
          We may update this Cookie Policy from time to time. When we do, we will
          post the updated version on this page and revise the &quot;Last
          updated&quot; date above.
        </p>
      ),
    },
    {
      id: "contact",
      heading: "Contact",
      body: (
        <>
          <p>Questions about this Cookie Policy? You can reach us at:</p>
          <ul className="space-y-1">
            <li>
              <strong>Company:</strong> {site.owner}
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-brand-600 underline"
              >
                {site.email}
              </a>
            </li>
            {site.mailingAddress ? (
              <li>
                <strong>Mailing address:</strong> {site.mailingAddress}
              </li>
            ) : null}
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPageLayout
        title={title}
        lastUpdated={site.legalUpdated}
        intro={
          <>
            <p>
              This Cookie Policy explains how {site.name} ({site.domain}),
              operated by {site.owner}, uses cookies and similar technologies, and
              how you can control them.
            </p>
            <LegalCallout>
              You can control cookies through your browser settings and the
              opt-out tools described below at any time.
            </LegalCallout>
          </>
        }
        sections={sections}
      />
    </>
  );
}
