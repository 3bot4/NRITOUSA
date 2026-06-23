import { permanentRedirect } from "next/navigation";

// The canonical terms page now lives at /terms-and-conditions. This legacy
// route (linked from older pages and the sitemap) permanently redirects there
// so no link breaks and search engines consolidate ranking signals.
export default function TermsOfUseRedirect() {
  permanentRedirect("/terms-and-conditions");
}
