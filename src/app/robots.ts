import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Internal JSON endpoints (form handlers, data status) carry no
        // indexable content and must never be crawled. Everything else —
        // tools, calculators, articles, hubs, JS/CSS — stays open.
        disallow: ["/api/"],
      },
      // Google
      { userAgent: "Googlebot", allow: "/" },
      // Bing / Microsoft Copilot
      { userAgent: "Bingbot", allow: "/" },
      // OpenAI (ChatGPT web search + browsing)
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      // Anthropic / Claude
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // Google Gemini / AI Overviews
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
