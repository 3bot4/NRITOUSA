import Script from "next/script";

// Impact / Trackonomics affiliate tracking tag
// Loads the Impact.com Universal Tracking Tag (UTT) globally and fires a single
// trackImpression call on every page. Uses afterInteractive so it never blocks
// the initial render and produces no hydration mismatch (the snippet only ever
// touches window/document at runtime, so it is SSR-safe). The inline body is the
// verbatim publisher tag copied from Impact/Trackonomics (Robinhood program).
export default function ImpactTag() {
  return (
    <Script id="impact-utt" strategy="afterInteractive">
      {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7461316-a6e5-406e-982a-9b52e72a435b1.js','script','impactStat',document,window);impactStat('trackImpression');`}
    </Script>
  );
}
