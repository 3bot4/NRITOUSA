import Script from "next/script";
import { CLARITY_ID, clarityEnabled } from "@/lib/clarity";

// Loads Microsoft Clarity (heatmaps + session recordings) globally. Uses
// afterInteractive so it never blocks the initial render and produces no
// hydration mismatch. Renders nothing in dev.
export default function ClarityAnalytics() {
  if (!clarityEnabled) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}
