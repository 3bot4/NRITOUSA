import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
    template: "%s | NRI to USA",
  },
  description: site.description,
  applicationName: site.name,
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
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    creator: site.twitterHandle,
    title: "NRI to USA — The Complete USA Guide for NRIs & Immigrants",
    description: site.description,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
