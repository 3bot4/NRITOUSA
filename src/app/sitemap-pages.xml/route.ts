import { urlsetXml, pagesEntries } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(pagesEntries), {
    headers: { "Content-Type": "application/xml" },
  });
}
