import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import LegalPageLayout, {
  LegalCallout,
  LegalList,
  type LegalSection,
} from "@/components/LegalPageLayout";

/*
 * Affiliate Disclosure for nritousa.com (operated by Wealth Building Academy LLC).
 * Required for FTC compliance and affiliate network approvals (e.g. CJ Affiliate).
 * Strong professional draft for attorney review — not legal advice.
 */

const title = "Affiliate Disclosure";
const description =
  "NRI to USA may earn compensation from affiliate links, sponsored placements, and partner recommendations. Affiliate relationships do not change the educational purpose of our content.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Affiliate Disclosure", url: "/affiliate-disclosure" },
    ])
  );

  const sections: LegalSection[] = [
    {
      id: "compensation",
      heading: "We may earn compensation",
      body: (
        <p>
          {site.name} may earn compensation from affiliate links, sponsored
          placements, or partner recommendations that appear on this Site. This
          means that some of the products, services, and providers we mention or
          link to have commercial relationships with us.
        </p>
      ),
    },
    {
      id: "commission",
      heading: "How affiliate links work",
      body: (
        <p>
          We may receive a commission or referral fee if you click on a partner
          link, sign up, or complete a purchase or application through that
          link. This compensation may come at no additional cost to you. In some
          cases we may also receive a flat fee for featuring or reviewing a
          product or service.
        </p>
      ),
    },
    {
      id: "editorial-independence",
      heading: "Affiliate relationships do not change our content",
      body: (
        <p>
          Affiliate relationships do not change the educational purpose of our
          content. Our guides, tools, and recommendations are written to inform
          and educate readers. Compensation does not dictate our editorial
          opinions, and the presence or absence of an affiliate relationship
          does not guarantee that a product is right for you.
        </p>
      ),
    },
    {
      id: "not-advice",
      heading: "Not personalized advice",
      body: (
        <p>
          Content on this Site — including any affiliate or partner
          recommendation — is for general educational purposes only and is not
          personalized legal, tax, immigration, investment, or financial advice.
          Nothing on the Site is a recommendation that any particular product or
          service is suitable for your specific situation.
        </p>
      ),
    },
    {
      id: "user-responsibility",
      heading: "Review provider terms before you act",
      body: (
        <p>
          You should review each provider&apos;s terms, fees, risks, and
          eligibility requirements before using any product or service we
          mention. Products, pricing, promotions, and eligibility change
          frequently and vary by individual circumstance. Always confirm current
          details directly with the provider before signing up.
        </p>
      ),
    },
    {
      id: "contact",
      heading: "Contact",
      body: (
        <>
          <p>Questions about this Affiliate Disclosure? You can reach us at:</p>
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
            See also our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              Disclaimer
            </Link>
            ,{" "}
            <Link href="/privacy-policy" className="text-brand-600 underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/terms-and-conditions"
              className="text-brand-600 underline"
            >
              Terms &amp; Conditions
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
              {site.name} ({site.domain}) is operated by {site.owner}. This
              Affiliate Disclosure explains how we may be compensated when you
              use links on this Site.
            </p>
            <LegalCallout>
              {site.name} may earn compensation from affiliate links, sponsored
              placements, or partner recommendations. We may receive a
              commission if you click or sign up through partner links. These
              relationships do not change the educational purpose of our
              content, which is never personalized legal, tax, immigration,
              investment, or financial advice.
            </LegalCallout>
            <p>In short:</p>
            <LegalList
              items={[
                "We may earn compensation from affiliate links, sponsored placements, or partner recommendations.",
                "We may receive a commission if you click or sign up through partner links.",
                "Affiliate relationships do not change the educational purpose of our content.",
                "Content is not personalized legal, tax, immigration, investment, or financial advice.",
                "Review provider terms, fees, risks, and eligibility before using any product or service.",
              ]}
            />
          </>
        }
        sections={sections}
      />
    </>
  );
}
