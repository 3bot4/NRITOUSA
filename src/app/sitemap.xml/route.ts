import { sitemapIndexXml } from "@/lib/sitemap-data";

// Sitemap index. Points Google at the five section sitemaps so each content
// area (pages, tools, articles, tax, immigration) can be crawled and reported
// independently in Search Console.
export const dynamic = "force-static";

export function GET() {
  return new Response(sitemapIndexXml(), {
    headers: { "Content-Type": "application/xml" },
  });
}
