import Script from "next/script";
import { GA_ID, ADS_ID, gaEnabled } from "@/lib/gtag";

// Loads GA4 + Google Ads (gtag.js) globally. Uses afterInteractive so it never
// blocks the initial render and produces no hydration mismatch. Renders nothing
// in dev. Both IDs share a single gtag.js load with one config() call each.
//
// Sets Google Consent Mode v2 defaults before the config() calls:
// analytics_storage stays 'granted' (preserves current GA/Clarity behavior —
// no CMP exists yet, so this must not regress existing analytics), while the
// ad_* signals default to 'denied' until a CMP (see src/lib/consent.ts) later
// calls gtag('consent', 'update', ...). Safe no-op today since no ads run.
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
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'granted'
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          gtag('config', '${ADS_ID}');
        `}
      </Script>
    </>
  );
}
