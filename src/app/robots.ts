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
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
