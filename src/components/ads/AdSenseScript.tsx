import Script from "next/script";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

/**
 * Loads the Google AdSense loader script globally. Renders nothing unless
 * NEXT_PUBLIC_ADSENSE_CLIENT is set and NODE_ENV is production — mirrors
 * GoogleAnalytics.tsx / ClarityAnalytics.tsx. This only loads the library;
 * it requests no ad units itself — see AdSlot.tsx for that, and note no
 * AdSlot is placed on any page yet.
 */
export default function AdSenseScript() {
  if (!adsEnabled) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
