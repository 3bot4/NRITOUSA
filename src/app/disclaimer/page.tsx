import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";

const title = "Disclaimer";
const description =
  "Content on NRI to USA is for educational purposes only and is not financial, legal, tax, or immigration advice. Read our full disclaimer.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Disclaimer", url: "/disclaimer" },
    ])
  );

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
              <span className="text-ink-700">Disclaimer</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-900">
              Disclaimer
            </h1>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-prose space-y-8 leading-8 text-ink-700">
            <p>
              Content on {site.name} (owned and operated by {site.owner}) is for
              educational and informational purposes only. Please consult a
              qualified professional for your situation. Specifically, nothing on
              this website is:
            </p>

            <ul className="list-disc space-y-2 pl-5">
              <li>Financial advice</li>
              <li>Tax advice</li>
              <li>Legal advice</li>
              <li>Immigration advice</li>
              <li>Investment advice</li>
            </ul>

            <p>
              Information can change based on your state, visa status, tax
              residency, income, and personal situation. India–USA cross-border
              finance is especially complex, and you are responsible for
              verifying details with official sources and licensed professionals
              before acting.
            </p>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                No professional advice
              </h2>
              <p className="mt-3">
                The guides on this site discuss complex topics including
                finance, taxes, investing, retirement accounts, real estate, and
                immigration. Laws, tax rules, account features, interest rates,
                and government policies change frequently and vary by individual
                circumstance, state, and country. Nothing on {site.name}{" "}
                constitutes personalized advice or creates a professional
                relationship.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Always verify and consult a professional
              </h2>
              <p className="mt-3">
                Before making any financial, tax, investment, or immigration
                decision, consult a licensed and qualified professional — such as
                a CPA, tax attorney, financial advisor, or immigration attorney —
                who can review your specific situation. Verify current rules with
                official sources such as the IRS, RBI, USCIS, and the relevant
                financial institutions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Accuracy &amp; updates
              </h2>
              <p className="mt-3">
                We work hard to keep our content accurate and current, but we
                make no warranties about completeness, accuracy, or timeliness.
                Information may become outdated. If you find an error, please{" "}
                <Link href="/contact" className="text-brand-600 underline">
                  let us know
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                External links &amp; advertising
              </h2>
              <p className="mt-3">
                This site may link to third-party websites and may display
                third-party advertising. We are not responsible for the content,
                accuracy, or practices of external sites. Links and ads do not
                imply endorsement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Limitation of liability
              </h2>
              <p className="mt-3">
                {site.name} and its authors are not liable for any loss or damage
                arising from your reliance on information published on this site.
                You use the content at your own risk and remain solely
                responsible for your decisions.
              </p>
            </div>

            <p>
              See also our{" "}
              <Link href="/privacy-policy" className="text-brand-600 underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-of-use" className="text-brand-600 underline">
                Terms of Use
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
