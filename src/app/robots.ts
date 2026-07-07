import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal JSON endpoints (form handlers, data status) carry no
      // indexable content and must never be crawled. Everything else —
      // tools, calculators, articles, hubs, JS/CSS — stays open.
      //
      // The opengraph-image rules keep Google from crawling and indexing the
      // auto-generated 1200x630 OG card routes (next/og ImageResponse) as
      // standalone images — they exist only for social link previews and were
      // showing up as indexed "pages" in Search Console.
      //
      // Two variants are required: "/*/opengraph-image" covers the per-route
      // cards (e.g. /articles/foo/opengraph-image), while "/opengraph-image"
      // covers the ROOT site-wide card. The `*` in "/*/…" requires a path
      // segment before it, so the root URL (/opengraph-image?<hash>) would
      // otherwise stay crawlable — which is exactly what surfaced in Search
      // Console.
      disallow: [
        "/api/",
        "/opengraph-image",
        "/opengraph-image?*",
        "/*/opengraph-image",
        "/*/opengraph-image?*",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
