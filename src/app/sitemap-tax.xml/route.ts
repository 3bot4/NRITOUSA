import { urlsetXml, taxEntries } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(taxEntries), {
    headers: { "Content-Type": "application/xml" },
  });
}
