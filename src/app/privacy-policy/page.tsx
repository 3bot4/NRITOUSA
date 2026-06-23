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
 * Privacy Policy for nritousa.com (operated by Wealth Building Academy LLC).
 * Strong professional draft for attorney review — not legal advice and not a
 * guarantee of compliance with the CCPA/CPRA, GDPR, or any other law. The
 * "where applicable / if we are subject to" hedging is intentional: confirm
 * which laws actually apply with counsel. Open items live in
 * docs/legal-policy-review-todos.md.
 */

const title = "Privacy Policy";
const description =
  "How NRI to USA (Wealth Building Academy LLC) collects, uses, shares, and protects your information — cookies, Google Analytics, email marketing, your privacy rights, and your choices.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Privacy Policy", url: "/privacy-policy" },
    ])
  );

  const sections: LegalSection[] = [
    {
      id: "introduction",
      heading: "Introduction",
      body: (
        <p>
          {site.owner}, an {site.state} limited liability company, operates{" "}
          {site.domain} under the brand name {site.name} (&quot;we&quot;,
          &quot;us&quot;, &quot;our&quot;). This Privacy Policy explains what
          information we collect, how we use and share it, how long we keep it,
          and the choices and rights you may have.
        </p>
      ),
    },
    {
      id: "information-we-collect",
      heading: "Information we collect",
      body: (
        <>
          <p>
            We aim to collect as little personal information as possible.
            Depending on how you use the Site, we may collect:
          </p>
          <LegalList
            items={[
              <>
                <strong>Information you provide directly</strong> — such as your
                name, email address, message, form responses, newsletter
                signups, guide downloads, and contact requests.
              </>,
              <>
                <strong>Calculator and tool inputs</strong> — many of our
                calculators run entirely in your browser, but depending on the
                tool, some inputs may be processed temporarily to return a
                result. We design tools to avoid collecting sensitive personal
                data.
              </>,
              <>
                <strong>Technical data</strong> — such as IP address, device
                type, browser, operating system, pages visited, referring URL,
                approximate location, and session data.
              </>,
              <>
                <strong>Cookies and analytics data</strong> — as described in our{" "}
                <Link href="/cookie-policy" className="text-brand-600 underline">
                  Cookie Policy
                </Link>
                .
              </>,
              <>
                <strong>Email marketing engagement</strong> — such as opens,
                clicks, and unsubscribes, where our email tools track them.
              </>,
              <>
                <strong>Your communications</strong> — the content of messages
                you send us.
              </>,
            ]}
          />
        </>
      ),
    },
    {
      id: "sensitive-information",
      heading: "Sensitive information warning",
      body: (
        <>
          <LegalWarning>
            Please do not submit Social Security numbers, passport numbers,
            immigration receipt numbers, financial account numbers, tax
            documents, bank statements, biometric data, health data,
            children&apos;s personal information, or other sensitive information
            unless a secure workflow on the Site specifically requests it.
          </LegalWarning>
          <p>
            The Site is designed not to request unnecessary sensitive
            information. If you send sensitive information through a general
            contact form or email, you do so at your own risk.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-information",
      heading: "How we use information",
      body: (
        <>
          <p>We use the information we collect to:</p>
          <LegalList
            items={[
              "Operate, maintain, and improve the website;",
              "Provide tools, calculators, and checklists;",
              "Respond to your inquiries;",
              "Send newsletters or requested downloads;",
              "Analyze traffic and engagement;",
              "Improve our content and user experience;",
              "Prevent spam, abuse, fraud, and security issues; and",
              "Comply with our legal obligations.",
            ]}
          />
        </>
      ),
    },
    {
      id: "analytics-and-cookies",
      heading: "Analytics and cookies",
      body: (
        <>
          <p>
            We use Google Analytics and may use similar tools to understand how
            visitors use the Site. Cookies, pixels, and local storage may be used
            for analytics, performance, preferences, advertising, affiliate
            tracking, and marketing. See our{" "}
            <Link href="/cookie-policy" className="text-brand-600 underline">
              Cookie Policy
            </Link>{" "}
            for details.
          </p>
          <p>
            You can control cookies through your browser settings, and you can opt
            out of Google Analytics using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            . Google processes data according to{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "email-marketing",
      heading: "Email marketing",
      body: (
        <p>
          If you sign up for our newsletter or download a guide, we may use your
          email address to send content and updates. You can unsubscribe at any
          time using the link in any email or by contacting us. Third-party email
          providers may process your email data on our behalf.
        </p>
      ),
    },
    {
      id: "sharing-of-information",
      heading: "Sharing of information",
      body: (
        <>
          <p>We may share information with:</p>
          <LegalList
            items={[
              "Hosting providers;",
              "Analytics providers;",
              "Email marketing providers;",
              "Form and contact providers;",
              "Spam and security tools;",
              "Payment processors (if payments are added in the future);",
              "Professional advisors;",
              "Legal or compliance authorities when required by law; and",
              "A successor entity in connection with a business transfer, merger, or sale.",
            ]}
          />
          <p>
            We do not sell your personal information in the traditional sense. If
            cookies used for analytics or advertising are considered a
            &quot;sale&quot; or &quot;sharing&quot; for targeted advertising under
            certain privacy laws, you may exercise applicable opt-out rights by
            contacting us or using the browser and platform controls described
            above and in our{" "}
            <Link href="/cookie-policy" className="text-brand-600 underline">
              Cookie Policy
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "third-party-links",
      heading: "Third-party links",
      body: (
        <p>
          The Site may link to third-party websites. We are not responsible for
          their privacy practices or content, and we encourage you to review the
          privacy policy of any website you visit.
        </p>
      ),
    },
    {
      id: "data-retention",
      heading: "Data retention",
      body: (
        <p>
          We retain personal information only as long as reasonably necessary for
          business, legal, security, analytics, or compliance purposes. Email
          subscribers are retained until they unsubscribe or request deletion,
          unless we need to keep records for legal or security reasons. Analytics
          data is retained according to our analytics settings.
        </p>
      ),
    },
    {
      id: "data-security",
      heading: "Data security",
      body: (
        <p>
          We use reasonable administrative, technical, and organizational
          safeguards to protect the information we hold. However, no website or
          method of transmission is completely secure, and we cannot guarantee
          absolute security. Please avoid sending sensitive information through
          regular contact forms.
        </p>
      ),
    },
    {
      id: "childrens-privacy",
      heading: "Children's privacy",
      body: (
        <p>
          The Site is intended for a general audience and is not directed to
          children under 13. We do not knowingly collect personal information
          from children under 13. If a parent or guardian believes a child under
          13 has provided us with personal information, please contact us and we
          will delete it. Where education or SAT content is used by minors, we do
          not request unnecessary personal information from minors.
        </p>
      ),
    },
    {
      id: "state-privacy-rights",
      heading: "U.S. state privacy rights",
      body: (
        <p>
          Depending on where you live and which laws apply, you may have rights
          to access, correct, delete, obtain a copy of, or opt out of certain
          uses of your personal information. California residents may have
          additional rights under California privacy law if it applies to us (see
          the California notice below). You can make a request by contacting us at{" "}
          <a href={`mailto:${site.email}`} className="text-brand-600 underline">
            {site.email}
          </a>
          , and we will respond as required by applicable law. Not every privacy
          law applies to every business or visitor.
        </p>
      ),
    },
    {
      id: "california-notice",
      heading: "California privacy notice",
      body: (
        <>
          <p>
            This section applies to California residents where, and to the
            extent, we are subject to the California Consumer Privacy Act as
            amended by the California Privacy Rights Act (the
            &quot;CCPA/CPRA&quot;).
          </p>
          <LegalList
            items={[
              <>
                <strong>Categories of personal information collected:</strong>{" "}
                identifiers (such as name, email, IP address), internet/network
                activity, approximate geolocation, and inferences, as described
                above.
              </>,
              <>
                <strong>Sources:</strong> directly from you, automatically
                through your use of the Site, and from service providers.
              </>,
              <>
                <strong>Business/commercial purposes:</strong> the purposes listed
                under &quot;How we use information.&quot;
              </>,
              <>
                <strong>Categories of third parties / service providers:</strong>{" "}
                hosting, analytics, email, advertising, security, and form
                providers.
              </>,
              <>
                <strong>Sale/share:</strong> we do not sell personal information
                for money. Some advertising/analytics cookies may be considered a
                &quot;sale&quot; or &quot;sharing&quot; under the CCPA/CPRA; where
                applicable you may opt out.
              </>,
            ]}
          />
          <p>Where applicable, California residents may have the right to:</p>
          <LegalList
            items={[
              "Know and access the personal information we have collected;",
              "Request deletion of personal information;",
              "Request correction of inaccurate personal information;",
              "Opt out of the sale or sharing of personal information;",
              "Limit the use of sensitive personal information;",
              "Not be discriminated against for exercising these rights; and",
              "Use an authorized agent to submit requests on your behalf.",
            ]}
          />
          <p>
            To exercise these rights, contact us at{" "}
            <a href={`mailto:${site.email}`} className="text-brand-600 underline">
              {site.email}
            </a>
            . We may need to verify your identity before responding.
          </p>
        </>
      ),
    },
    {
      id: "international-visitors",
      heading: "International visitors",
      body: (
        <>
          <p>
            The Site is operated in the United States. If you access it from
            outside the U.S., you understand that your information may be
            processed in the United States, where data protection laws may differ
            from those in your country.
          </p>
          <p>
            {/* TODO (attorney review): if the Site begins targeting EU/UK users,
                add GDPR/UK GDPR lawful-basis and rights language and review cookie
                consent requirements. */}
            If we begin targeting users in the EU or UK, we will add the
            applicable GDPR / UK GDPR rights and a cookie-consent mechanism after
            review.
          </p>
        </>
      ),
    },
    {
      id: "do-not-track",
      heading: "Do Not Track / Global Privacy Control",
      body: (
        <p>
          Some browsers offer a &quot;Do Not Track&quot; (DNT) signal or a Global
          Privacy Control (GPC) signal. Because there is no common industry
          standard for DNT, the Site does not currently respond to DNT signals.
          {/* TODO: if/when a GPC opt-out is technically implemented, describe how
              the Site honors it and remove this note. */}{" "}
          We are evaluating support for GPC-based opt-out signals and will update
          this section when it is implemented.
        </p>
      ),
    },
    {
      id: "biometric-data",
      heading: "Biometric data",
      body: (
        <>
          <p>
            The Site does not intentionally collect biometric identifiers or
            biometric information, and you should not upload biometric data.
          </p>
          <LegalWarning title="If this ever changes">
            Because {site.owner} is registered in {site.state}, if biometric
            collection is ever added, a separate biometric privacy policy and a
            written consent process must be implemented before any collection
            begins.
          </LegalWarning>
        </>
      ),
    },
    {
      id: "changes",
      heading: "Changes to this Privacy Policy",
      body: (
        <p>
          We may update this Privacy Policy from time to time. When we do, we will
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
          <p>Questions about this Privacy Policy? You can reach us at:</p>
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
          <p>
            You can also visit our{" "}
            <Link href="/contact" className="text-brand-600 underline">
              contact page
            </Link>
            .
          </p>
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
              This Privacy Policy explains how {site.name} collects, uses, shares,
              and protects information when you visit{" "}
              <a
                href={site.url}
                className="text-brand-600 underline"
                rel="noopener noreferrer"
              >
                {site.domain}
              </a>
              . By using the Site, you agree to the practices described here.
            </p>
            <LegalCallout>
              We aim to collect as little personal information as possible and we
              do not sell your personal information in the traditional sense.
            </LegalCallout>
          </>
        }
        sections={sections}
      />
    </>
  );
}
