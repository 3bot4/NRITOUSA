import { urlsetXml, articlesEntries } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(articlesEntries), {
    headers: { "Content-Type": "application/xml" },
  });
}
