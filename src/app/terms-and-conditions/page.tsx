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
 * Terms & Conditions for nritousa.com (operated by Wealth Building Academy LLC).
 * This is a strong professional draft prepared for attorney review — it is not
 * legal advice and does not guarantee legal compliance. A qualified attorney
 * licensed in Illinois should review it before it is relied upon. Open items
 * (contact email, mailing address, arbitration/CCPA/GDPR decisions) live in
 * docs/legal-policy-review-todos.md.
 */

const title = "Terms & Conditions";
const description =
  "The terms governing your use of NRI to USA, operated by Wealth Building Academy LLC (Illinois). Educational content and tools only — not legal, tax, immigration, financial, or investment advice.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Terms & Conditions", url: "/terms-and-conditions" },
    ])
  );

  const sections: LegalSection[] = [
    {
      id: "introduction",
      heading: "Introduction",
      body: (
        <>
          <p>
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your access
            to and use of {site.domain} and its content, tools, calculators,
            checklists, and resources (collectively, the &quot;Site&quot;). The
            Site is operated by <strong>{site.owner}</strong>, a {site.state}{" "}
            limited liability company, under the brand name {site.name}.
          </p>
          <p>
            By accessing or using the Site, you agree to be bound by these Terms
            and by our{" "}
            <Link href="/privacy-policy" className="text-brand-600 underline">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              Disclaimer
            </Link>
            , and{" "}
            <Link href="/cookie-policy" className="text-brand-600 underline">
              Cookie Policy
            </Link>
            . If you do not agree with these Terms, please do not use the Site.
          </p>
        </>
      ),
    },
    {
      id: "educational-purpose",
      heading: "Educational purpose only",
      body: (
        <>
          <p>
            {site.name} provides general educational content, tools,
            calculators, checklists, trackers, and planning resources for NRIs,
            immigrants, visa holders, students, taxpayers, and families in the
            United States.
          </p>
          <LegalList
            items={[
              "All content is general in nature and is not personalized advice for your situation.",
              "Content should not be used as the only basis for any immigration, tax, financial, legal, investment, education, college, or relocation decision.",
              "You remain responsible for verifying information and obtaining advice tailored to your circumstances.",
            ]}
          />
        </>
      ),
    },
    {
      id: "no-professional-advice",
      heading: "No professional advice",
      body: (
        <>
          <p>Nothing on the Site constitutes, and you should not rely on it as:</p>
          <LegalList
            items={[
              "Legal advice",
              "Immigration advice",
              "Tax advice",
              "Accounting advice",
              "Financial advice",
              "Investment advice",
              "College admissions advice",
            ]}
          />
          <p>
            Using the Site does not create any attorney-client, CPA-client,
            advisor-client, fiduciary, or other professional relationship between
            you and {site.owner} or anyone associated with the Site.
          </p>
        </>
      ),
    },
    {
      id: "no-guarantee",
      heading: "No guarantee of accuracy or results",
      body: (
        <>
          <p>
            Tools and calculators produce estimates only. Government rules,
            forms, fees, thresholds, visa bulletin dates, processing times, tax
            rules, and financial assumptions change frequently and vary by
            individual circumstance.
          </p>
          <p>
            We work to keep content updated but do not guarantee the
            completeness, accuracy, or timeliness of anything on the Site. You
            must verify information with official sources — such as USCIS, the
            IRS, the U.S. Department of State, VFS Global, college and testing
            organizations — and with qualified professionals before acting.
          </p>
        </>
      ),
    },
    {
      id: "user-responsibility",
      heading: "User responsibility",
      body: (
        <>
          <p>
            You are solely responsible for your own decisions and for how you use
            the information on the Site. Before acting, you should consult
            qualified attorneys, CPAs, tax advisors, financial advisors, or the
            relevant official agencies.
          </p>
          <LegalWarning>
            Do not submit sensitive personal information (such as Social Security
            numbers, passport numbers, immigration receipt numbers, or financial
            account numbers) unless the Site specifically requests it through a
            secure and necessary workflow.
          </LegalWarning>
        </>
      ),
    },
    {
      id: "calculators-and-tools",
      heading: "Calculators and tools",
      body: (
        <>
          <p>
            Calculators and tools on the Site are simplified educational
            estimates. Their results:
          </p>
          <LegalList
            items={[
              "Depend entirely on the inputs and assumptions you provide;",
              "May not reflect all applicable rules, exceptions, phaseouts, facts, deadlines, or individual circumstances; and",
              "Do not guarantee any immigration, tax, financial, investment, education, or legal outcome.",
            ]}
          />
        </>
      ),
    },
    {
      id: "immigration-content",
      heading: "Immigration content",
      body: (
        <>
          <p>
            {site.name} is not a law firm. It does not prepare immigration
            filings or provide immigration representation unless separately
            agreed in writing by a licensed professional.
          </p>
          <p>
            Visa bulletin dates, USCIS processing times, priority date movement,
            green card estimates, and similar content are informational only and
            must be verified against official government sources.
          </p>
        </>
      ),
    },
    {
      id: "tax-content",
      heading: "Tax and FBAR/FATCA content",
      body: (
        <>
          <p>
            {site.name} is not a CPA firm unless separately stated in a written
            engagement agreement. Content about FBAR, FATCA, Form 8938, Form
            1116, DTAA, the foreign tax credit, NRE/NRO accounts, and other tax
            topics is general education only.
          </p>
          <p>
            You should consult a CPA, enrolled agent, tax attorney, or other
            qualified professional regarding your specific tax situation.
          </p>
        </>
      ),
    },
    {
      id: "financial-content",
      heading: "Financial and wealth content",
      body: (
        <>
          <p>
            {site.name} is not an investment adviser, broker-dealer, or financial
            planner. Content about investing, retirement, 401(k) plans,
            remittances, rent-vs-buy decisions, wealth building, and financial
            planning is educational only.
          </p>
          <p>
            No content is a recommendation to buy, sell, hold, transfer,
            withdraw, or invest in any product or security. Past performance does
            not guarantee future results.
          </p>
        </>
      ),
    },
    {
      id: "no-emergency-reliance",
      heading: "No emergency or time-sensitive reliance",
      body: (
        <p>
          Do not rely on the Site for urgent or time-sensitive matters. You must
          independently verify all filing deadlines, expiration dates,
          appointment dates, and official requirements with the relevant
          authority.
        </p>
      ),
    },
    {
      id: "accounts-email-forms",
      heading: "Accounts, email, and forms",
      body: (
        <>
          <p>
            If you submit a form or sign up for emails, you agree to provide
            accurate information. You may unsubscribe from marketing emails at any
            time where applicable.
          </p>
          <LegalWarning>
            Do not submit Social Security numbers, passport numbers, receipt
            numbers, account numbers, or sensitive documents through the Site
            unless we specifically provide a secure and necessary workflow that
            requests them.
          </LegalWarning>
        </>
      ),
    },
    {
      id: "intellectual-property",
      heading: "Intellectual property",
      body: (
        <>
          <p>
            The website design, text, calculators, tools, graphics, branding,
            code, and content are owned by {site.owner} or its licensors unless
            otherwise stated. You may use the Site for personal, non-commercial
            purposes.
          </p>
          <p>
            You may not copy, scrape, republish, resell, or perform automated
            extraction of the Site or its content without our prior written
            permission.
          </p>
        </>
      ),
    },
    {
      id: "prohibited-use",
      heading: "Prohibited use",
      body: (
        <>
          <p>You agree not to:</p>
          <LegalList
            items={[
              "Violate any applicable law or regulation;",
              "Attempt to hack, scrape, overload, or reverse engineer the Site;",
              "Submit false, misleading, or harmful information;",
              "Use the Site for unlawful immigration, tax, fraud, or financial activity;",
              "Copy tools or calculators for competing commercial use; or",
              "Interfere with the security or operation of the Site.",
            ]}
          />
        </>
      ),
    },
    {
      id: "third-party-links",
      heading: "Third-party links and services",
      body: (
        <p>
          The Site may link to government agencies, calculators, partners,
          affiliates, advertisers, and other third-party services. We are not
          responsible for the content, accuracy, privacy practices, or services
          of third parties, and external links do not imply endorsement.
        </p>
      ),
    },
    {
      id: "affiliate-ads",
      heading: "Affiliate links, ads, and sponsored content",
      body: (
        <>
          <p>
            The Site may include affiliate links, advertising, sponsorships,
            referral arrangements, or partner offers, and {site.owner} may earn
            compensation from some links or placements.
          </p>
          <p>
            Compensation does not guarantee endorsement. You should independently
            evaluate any product or service before relying on it.
          </p>
        </>
      ),
    },
    {
      id: "availability-changes",
      heading: "Availability and changes",
      body: (
        <p>
          The Site may be changed, updated, interrupted, or discontinued at any
          time without notice. We may also update these Terms periodically.
          Continued use of the Site after an update constitutes acceptance of the
          revised Terms.
        </p>
      ),
    },
    {
      id: "disclaimer-of-warranties",
      heading: "Disclaimer of warranties",
      body: (
        <p>
          The Site is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis, without warranties of any kind, whether express
          or implied, including warranties of accuracy, reliability,
          availability, merchantability, fitness for a particular purpose, or
          non-infringement. We do not warrant that the Site will be error-free,
          secure, or uninterrupted.
        </p>
      ),
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation of liability",
      body: (
        <>
          <p>
            To the fullest extent permitted by law, {site.owner} and its owners,
            employees, contractors, affiliates, and partners will not be liable
            for any indirect, incidental, consequential, special, punitive, or
            lost-profit damages arising from your use of the Site.
          </p>
          <p>We are not liable for:</p>
          <LegalList
            items={[
              "Decisions you make based on the Site;",
              "Inaccurate data obtained from government or third-party sources; or",
              "Missed deadlines, tax penalties, immigration consequences, investment losses, or financial losses arising from reliance on the Site.",
            ]}
          />
        </>
      ),
    },
    {
      id: "indemnification",
      heading: "Indemnification",
      body: (
        <p>
          You agree to indemnify and hold harmless {site.owner} and its owners,
          employees, contractors, affiliates, and partners from any claims,
          losses, liabilities, and expenses arising from your misuse of the Site,
          your violation of these Terms or any law, or your infringement of any
          third party&apos;s rights.
        </p>
      ),
    },
    {
      id: "governing-law",
      heading: "Governing law",
      body: (
        <p>
          These Terms are governed by the laws of the State of {site.state},
          without regard to its conflict-of-law principles. Subject to the
          section below, you agree that the courts located in {site.state} shall
          have jurisdiction and venue over any dispute, unless your attorney
          advises otherwise. {/* TODO (attorney review): confirm venue/jurisdiction language. */}
        </p>
      ),
    },
    {
      id: "dispute-resolution",
      heading: "Dispute resolution",
      body: (
        <>
          <p>
            If a dispute arises, you agree to first attempt to resolve it
            informally by contacting {site.owner} and allowing a reasonable
            period for the parties to discuss and seek resolution in good faith.
          </p>
          <LegalWarning title="Attorney review required">
            This section intentionally does not include binding arbitration or a
            class-action waiver. Whether to add such provisions — and in what
            form — should be decided with a qualified attorney before
            publication.
          </LegalWarning>
        </>
      ),
    },
    {
      id: "contact",
      heading: "Contact information",
      body: <ContactBlock />,
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
              Welcome to {site.name} ({site.domain}), operated by{" "}
              <strong>{site.owner}</strong>, a {site.state} limited liability
              company. Please read these Terms &amp; Conditions carefully before
              using the Site.
            </p>
            <LegalCallout>
              By using {site.name}, you understand that the content and tools are
              educational only and are not a substitute for advice from a
              licensed legal, tax, immigration, financial, or investment
              professional.
            </LegalCallout>
          </>
        }
        sections={sections}
      />
    </>
  );
}

/** Shared contact details block reused across the legal pages. */
function ContactBlock() {
  return (
    <>
      <p>Questions about these Terms? You can reach us at:</p>
      <ul className="space-y-1">
        <li>
          <strong>Company:</strong> {site.owner}
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${site.email}`} className="text-brand-600 underline">
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
  );
}
