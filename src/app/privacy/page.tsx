import { permanentRedirect } from "next/navigation";

// The canonical privacy page lives at /privacy-policy. This legacy route
// (linked from older pages and the sitemap) permanently redirects there so no
// link breaks and search engines consolidate ranking signals.
export default function PrivacyRedirect() {
  permanentRedirect("/privacy-policy");
}
