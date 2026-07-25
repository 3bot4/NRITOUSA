"use client";

import { useEffect, useId } from "react";
import { ADSENSE_CLIENT, adsEnabled, isAdEligibleRoute } from "@/lib/ads";
import AdDisclosureLabel from "./AdDisclosureLabel";

interface AdSlotProps {
  /** AdSense ad-unit slot id. No default — supply a real one per placement. */
  slot: string;
  /** Current route pathname, checked against the no-ad-route policy (src/lib/ads.ts). */
  pathname: string;
  /** Reserved height so the surrounding layout doesn't shift once an ad loads. */
  minHeight?: number;
  label?: "Advertisement" | "Sponsored links";
  className?: string;
}

/**
 * Reserved-space, responsive ad container. Renders nothing — not even the
 * reserved space — when ads are disabled or the route is on the no-ad list,
 * so a page lays out identically whether or not AdSense is configured.
 *
 * Placement rules (see MONETIZATION_SETUP.md): never between calculator
 * inputs, beside a primary-action button, inside a result, or in a sticky
 * position that covers controls. No `<AdSlot>` is placed on any live page
 * yet — this component only ships once real slot ids exist.
 */
export default function AdSlot({
  slot,
  pathname,
  minHeight = 250,
  label = "Advertisement",
  className = "",
}: AdSlotProps) {
  const id = useId();
  const eligible = adsEnabled && isAdEligibleRoute(pathname);

  useEffect(() => {
    if (!eligible) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // An ad blocker or a slow/blocked loader script must never surface an
      // error to the visitor — fail silently.
    }
  }, [eligible]);

  if (!eligible) return null;

  return (
    <div className={`mx-auto w-full ${className}`} style={{ minHeight }}>
      <AdDisclosureLabel label={label} />
      <ins
        key={id}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
