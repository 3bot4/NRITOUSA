import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { topics } from "@/lib/topics";
import { articles } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Fetch public community routes for the sitemap. Defensive: if Supabase isn't
 * configured or the query fails, returns just the static community pages so the
 * build never breaks. Admin routes are intentionally excluded.
 */
async function communityRoutes(now: Date): Promise<MetadataRoute.Sitemap> {
  const staticCommunity: MetadataRoute.Sitemap = [
    { url: `${site.url}/community`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/community/rules`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  if (!isSupabaseConfigured) return staticCommunity;
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const [{ data: cats }, { data: posts }] = await Promise.all([
      db.from("community_categories").select("slug").eq("is_active", true),
      db
        .from("community_posts")
        .select("slug, updated_at")
        .eq("status", "published")
        .order("last_activity_at", { ascending: false })
        .limit(1000),
    ]);
    const catRoutes: MetadataRoute.Sitemap = (cats ?? []).map((c: any) => ({
      url: `${site.url}/community/categories/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.6,
    }));
    const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p: any) => ({
      url: `${site.url}/community/post/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.5,
    }));
    return [...staticCommunity, ...catRoutes, ...postRoutes];
  } catch {
    return staticCommunity;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/topics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${site.url}/resources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/long-term-nri-wealth`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/calculators`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/terms-of-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${site.url}/topics/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${site.url}/articles/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${site.url}/calculators/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${site.url}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: t.status === "live" ? 0.8 : 0.4,
  }));

  const community = await communityRoutes(now);

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...calculatorRoutes,
    ...toolRoutes,
    ...articleRoutes,
    ...community,
  ];
}
