import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "Contact NRI to USA";
const description =
  "Get in touch with the NRI to USA editorial team with questions, feedback, corrections, or partnership enquiries about our guides for immigrants.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: "/contact", title, description },
  twitter: { title, description },
};

export default function ContactPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              Questions, feedback, a correction to a guide, or a partnership
              idea? We read every message and aim to reply within a few business
              days.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-prose">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Email us
            </h2>
            <p className="mt-3 leading-8 text-ink-700">
              The fastest way to reach the {site.name} editorial team is by
              email:
            </p>
            <p className="mt-4">
              <a
                href={`mailto:${site.email}`}
                className="text-lg font-semibold text-brand-600 hover:text-brand-700"
              >
                {site.email}
              </a>
            </p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              Found an error?
            </h2>
            <p className="mt-3 leading-8 text-ink-700">
              Tax rules, account features, and immigration policies change. If
              you spot something out of date or inaccurate in one of our guides,
              please email us with the article link and we&apos;ll review and
              correct it. Accuracy matters to us.
            </p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              Follow along
            </h2>
            <p className="mt-3 leading-8 text-ink-700">
              We share new guides and updates on social media:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
              <a href={site.social.twitter} className="text-brand-600 hover:text-brand-700">
                Twitter / X
              </a>
              <a href={site.social.instagram} className="text-brand-600 hover:text-brand-700">
                Instagram
              </a>
              <a href={site.social.youtube} className="text-brand-600 hover:text-brand-700">
                YouTube
              </a>
              <a href={site.social.linkedin} className="text-brand-600 hover:text-brand-700">
                LinkedIn
              </a>
            </div>

            <div className="mt-12 rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
              <strong className="font-semibold text-ink-700">
                Please note:
              </strong>{" "}
              {site.name} publishes educational content only. We cannot provide
              personalized financial, tax, legal, or immigration advice by
              email. For your specific situation, please consult a qualified
              professional. See our{" "}
              <Link href="/disclaimer" className="text-brand-600 underline">
                disclaimer
              </Link>
              .
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
