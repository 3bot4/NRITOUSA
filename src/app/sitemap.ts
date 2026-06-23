import type { MetadataRoute } from "next";
import { topics } from "@/lib/topics";
import { articles } from "@/lib/articles";
import { calculators } from "@/lib/calculators";
import { tools } from "@/lib/tools";
import { eduCalcs } from "@/lib/education";
import { clusterPages, clusterPath } from "@/lib/passportCluster";
import { itrPages, itrPath } from "@/lib/itrCluster";
import { tdsPages, tdsPath } from "@/lib/tdsCluster";
import { repatPages, repatPath } from "@/lib/repatriationCluster";
import { giftPages, giftPath } from "@/lib/giftsCluster";
import { uscisChildPages } from "@/lib/uscisCluster";
import { myuscisChildPages } from "@/lib/myuscisCluster";
import { formsChildPages } from "@/lib/uscisFormsCluster";
import { lifePlanningChildPages } from "@/lib/uscisLifePlanningCluster";
import { h1bChildPages } from "@/lib/h1bCluster";
import { greenCardChildPages } from "@/lib/greenCardCluster";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${site.url}/india-tax-compliance`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/india-tax-compliance/nri-tax-forms-limits`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/nri-wealth-checkup`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/india-property`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/return-to-india`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/nri-estate-planning`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/free-immigrant-wealth-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
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
      url: `${site.url}/uscis`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/uscis/case-status`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/uscis/myuscis-account`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${site.url}/uscis/forms`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/uscis/life-planning`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/community/nri-uscis-decisions`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${site.url}/uscis/receipt-number`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/uscis/processing-times`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/h1b`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/green-card`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/visa-bulletin`,
      lastModified: new Date("2026-06-16"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/education`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/education/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/terms-and-conditions`,
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
    {
      url: `${site.url}/cookie-policy`,
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

  const eduRoutes: MetadataRoute.Sitemap = eduCalcs.map((c) => ({
    url: `${site.url}/education/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const passportClusterRoutes: MetadataRoute.Sitemap = clusterPages.map((p) => ({
    url: `${site.url}${clusterPath(p.slug)}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: p.kind === "hub" ? 0.9 : 0.7,
  }));

  const itrClusterRoutes: MetadataRoute.Sitemap = itrPages.map((p) => ({
    url: `${site.url}${itrPath(p.slug)}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: p.kind === "pillar" ? 0.9 : 0.7,
  }));

  const tdsClusterRoutes: MetadataRoute.Sitemap = tdsPages.map((p) => ({
    url: `${site.url}${tdsPath(p.slug)}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: p.kind === "pillar" ? 0.9 : 0.7,
  }));

  const repatClusterRoutes: MetadataRoute.Sitemap = repatPages.map((p) => ({
    url: `${site.url}${repatPath(p.slug)}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: p.kind === "pillar" ? 0.9 : 0.7,
  }));

  const giftClusterRoutes: MetadataRoute.Sitemap = giftPages.map((p) => ({
    url: `${site.url}${giftPath(p.slug)}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: p.kind === "pillar" ? 0.9 : 0.7,
  }));

  const uscisChildRoutes: MetadataRoute.Sitemap = uscisChildPages.map((p) => ({
    url: `${site.url}/uscis/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const h1bChildRoutes: MetadataRoute.Sitemap = h1bChildPages.map((p) => ({
    url: `${site.url}/h1b/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const greenCardChildRoutes: MetadataRoute.Sitemap = greenCardChildPages.map((p) => ({
    url: `${site.url}/green-card/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...calculatorRoutes,
    ...toolRoutes,
    ...eduRoutes,
    ...articleRoutes,
    ...passportClusterRoutes,
    ...itrClusterRoutes,
    ...tdsClusterRoutes,
    ...repatClusterRoutes,
    ...giftClusterRoutes,
    ...uscisChildRoutes,
    ...h1bChildRoutes,
    ...greenCardChildRoutes,
    ...visaBulletinChildPages.map((p) => ({
      url: `${site.url}/visa-bulletin/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...myuscisChildPages.map((p) => ({
      url: `${site.url}/uscis/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...formsChildPages.map((p) => ({
      url: `${site.url}/uscis/forms/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...lifePlanningChildPages.map((p) => ({
      url: `${site.url}/uscis/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
