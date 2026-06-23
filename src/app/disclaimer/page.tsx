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
 * Disclaimer for nritousa.com (operated by Wealth Building Academy LLC).
 * Strong professional draft for attorney review — not legal advice and not a
 * guarantee of compliance. See docs/legal-policy-review-todos.md.
 */

const title = "Disclaimer";
const description =
  "Content and tools on NRI to USA are for general educational purposes only and are not legal, immigration, tax, accounting, financial, investment, or college admissions advice. Read our full disclaimer.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Disclaimer", url: "/disclaimer" },
    ])
  );

  const sections: LegalSection[] = [
    {
      id: "general",
      heading: "General educational disclaimer",
      body: (
        <p>
          All content, tools, calculators, checklists, and resources on{" "}
          {site.name} are provided for general educational and informational
          purposes only. They are general in nature, are not tailored to your
          situation, and are not a substitute for professional advice.
        </p>
      ),
    },
    {
      id: "no-legal-advice",
      heading: "No legal advice",
      body: (
        <p>
          {site.name} is not a law firm and does not provide legal advice. Nothing
          on the Site is legal advice, and no content should be relied upon as a
          substitute for advice from a licensed attorney.
        </p>
      ),
    },
    {
      id: "no-immigration-advice",
      heading: "No immigration advice",
      body: (
        <p>
          {site.name} is not an immigration consultancy and does not provide
          immigration advice or representation. Visa bulletin dates, USCIS
          processing times, priority date movement, and green card estimates are
          informational only and must be verified with official government
          sources.
        </p>
      ),
    },
    {
      id: "no-tax-advice",
      heading: "No tax or accounting advice",
      body: (
        <p>
          {site.name} is not a CPA firm and does not provide tax or accounting
          advice. Content about FBAR, FATCA, DTAA, the foreign tax credit,
          NRE/NRO accounts, and related topics is general education only. Consult
          a CPA, enrolled agent, or tax attorney about your situation.
        </p>
      ),
    },
    {
      id: "no-financial-advice",
      heading: "No financial, investment, or retirement advice",
      body: (
        <p>
          {site.name} is not an investment adviser or broker-dealer and does not
          provide financial, investment, or retirement advice. Nothing on the
          Site is a recommendation to buy, sell, hold, transfer, withdraw, or
          invest in any product or security. Past performance does not guarantee
          future results.
        </p>
      ),
    },
    {
      id: "no-education-guarantee",
      heading: "No college admissions or education guarantee",
      body: (
        <p>
          {site.name} is not a college admissions consultancy. Education, SAT,
          GPA, college cost, and ranking content is for general informational
          purposes and does not guarantee admission, scores, financial aid, or any
          other educational outcome.
        </p>
      ),
    },
    {
      id: "estimates-only",
      heading: "Tools and calculators are estimates only",
      body: (
        <p>
          Our tools and calculators produce simplified educational estimates that
          depend entirely on the inputs and assumptions you provide. They may not
          reflect all rules, exceptions, phaseouts, facts, deadlines, or
          individual circumstances, and they do not guarantee any outcome.
        </p>
      ),
    },
    {
      id: "immigration-data-changes",
      heading: "Immigration, visa bulletin, and processing-time data may change",
      body: (
        <p>
          Immigration rules, visa bulletin dates, priority date movement, USCIS
          and VFS processing times, fees, and forms change frequently and without
          notice. Always verify current information with USCIS and the U.S.
          Department of State before acting.
        </p>
      ),
    },
    {
      id: "tax-rules-change",
      heading: "FBAR/FATCA/IRS and tax rules may change",
      body: (
        <p>
          Tax laws, thresholds, forms, and filing requirements — including those
          for FBAR, FATCA, Form 8938, and Form 1116 — change frequently and vary
          by individual circumstance. Always verify current rules with the IRS and
          a qualified tax professional.
        </p>
      ),
    },
    {
      id: "third-party-sources",
      heading: "Third-party and government source disclaimer",
      body: (
        <p>
          The Site may rely on, summarize, or link to data from government
          agencies and other third parties. We are not responsible for the
          content, accuracy, or availability of third-party or government sources,
          and external links do not imply endorsement.
        </p>
      ),
    },
    {
      id: "no-professional-relationship",
      heading: "No professional relationship",
      body: (
        <p>
          Using this website does not create any attorney-client, CPA-client,
          advisor-client, fiduciary, or other professional relationship between
          you and {site.owner} or anyone associated with the Site.
        </p>
      ),
    },
    {
      id: "no-guarantee-of-outcomes",
      heading: "No guarantee of outcomes",
      body: (
        <p>
          We do not guarantee any immigration, tax, financial, investment,
          education, or legal outcome. Results depend on your specific facts,
          current law, and decisions made by government agencies and other third
          parties that are outside our control.
        </p>
      ),
    },
    {
      id: "verify",
      heading: "User responsibility to verify",
      body: (
        <p>
          You are responsible for your own decisions and for verifying all
          information before acting. Do not rely on this website as your only
          source before filing forms, making tax elections, investing, moving
          money, applying for immigration benefits, or making education decisions.
        </p>
      ),
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation of liability",
      body: (
        <p>
          To the fullest extent permitted by law, {site.owner} and its owners,
          employees, contractors, affiliates, and partners are not liable for any
          loss or damage arising from your reliance on the Site or its content,
          including missed deadlines, tax penalties, immigration consequences,
          investment losses, or financial losses. You use the Site at your own
          risk. See our{" "}
          <Link
            href="/terms-and-conditions"
            className="text-brand-600 underline"
          >
            Terms &amp; Conditions
          </Link>{" "}
          for the full limitation of liability.
        </p>
      ),
    },
    {
      id: "contact",
      heading: "Contact",
      body: (
        <>
          <p>Questions about this Disclaimer? You can reach us at:</p>
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
            <Link href="/privacy-policy" className="text-brand-600 underline">
              Privacy Policy
            </Link>
            ,{" "}
            <Link
              href="/terms-and-conditions"
              className="text-brand-600 underline"
            >
              Terms &amp; Conditions
            </Link>
            , and{" "}
            <Link href="/cookie-policy" className="text-brand-600 underline">
              Cookie Policy
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
              {site.name} ({site.domain}) is operated by {site.owner}. The content
              and tools on this Site are for general educational purposes only.
            </p>
            <LegalCallout>
              {site.name} is not a law firm, CPA firm, investment adviser,
              broker-dealer, immigration consultancy, or college admissions
              consultancy. Using this website does not create any attorney-client,
              CPA-client, advisor-client, fiduciary, or professional relationship.
              Always verify with official sources and qualified professionals
              before acting.
            </LegalCallout>
            <p>In short, nothing on this Site is:</p>
            <LegalList
              items={[
                "Legal advice",
                "Immigration advice",
                "Tax or accounting advice",
                "Financial, investment, or retirement advice",
                "College admissions advice",
              ]}
            />
          </>
        }
        sections={sections}
      />
    </>
  );
}
