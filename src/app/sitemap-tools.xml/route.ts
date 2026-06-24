import { urlsetXml, toolsEntries } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(toolsEntries), {
    headers: { "Content-Type": "application/xml" },
  });
}
