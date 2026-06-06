import Script from "next/script";
import { GA_ID, gaEnabled } from "@/lib/gtag";

// Loads GA4 (gtag.js) globally. Uses afterInteractive so it never blocks the
// initial render and produces no hydration mismatch. Renders nothing in dev.
export default function GoogleAnalytics() {
  if (!gaEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
