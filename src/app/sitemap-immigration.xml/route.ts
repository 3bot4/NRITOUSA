import { urlsetXml, immigrationEntries } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(immigrationEntries), {
    headers: { "Content-Type": "application/xml" },
  });
}
