import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { site } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd, jsonLdGraph } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
    template: "%s | NRI to USA",
  },
  description: site.description,
  applicationName: site.name,
  // Dynamic, self-referencing canonical for EVERY route. Next resolves a
  // "./" canonical against the current request pathname (see
  // resolveRelativeUrl in next/dist/lib/metadata), then composes it with
  // metadataBase → https://www.nritousa.com<current-path>. Pages that set
  // their own alternates.canonical (via pageMetadata) override this with the
  // identical self-referencing value, so the two are always consistent.
  alternates: { canonical: "./" },
  keywords: [
    "NRI finance",
    "NRI USA",
    "immigrant finance USA",
    "NRI taxes",
    "H-1B finance",
    "build US credit",
    "401k NRI",
    "Roth IRA NRI",
    "India USA money transfer",
    "NRE NRO account",
  ],
  authors: [{ name: site.author }],
  creator: site.author,
  publisher: site.publisher,
  category: "finance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
    description: site.socialTagline,
  },
  twitter: {
    // No @site/@creator handle until a real account exists; the large-image
    // card still works for link previews via the default OG image.
    card: "summary_large_image",
    title: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
    description: site.socialTagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

const siteJsonLd = jsonLdGraph(organizationJsonLd, websiteJsonLd);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Impact.com website ownership verification. The tag uses a nonstandard
            `value` attribute (per Impact.com's snippet), which React's meta
            types reject, so we spread a cast object to emit it verbatim. */}
        <meta
          {...({
            name: "impact-site-verification",
            value: "1d7ce766-75b7-4dfc-8576-a947042b208b",
          } as unknown as React.MetaHTMLAttributes<HTMLMetaElement>)}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
