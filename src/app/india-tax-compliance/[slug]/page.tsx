import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItrClusterPage from "@/components/ItrClusterPage";
import TdsClusterPage from "@/components/TdsClusterPage";
import { pageMetadata } from "@/lib/seo";
import { getItrPage, itrPages, itrPath } from "@/lib/itrCluster";
import { getTdsPage, tdsPages, tdsPath } from "@/lib/tdsCluster";

/**
 * Shared dynamic route for every /india-tax-compliance/<slug> cluster page.
 * Two sibling clusters live under this hub — "NRI ITR Filing" (lib/itrCluster)
 * and "NRI TDS Refund & Lower TDS" (lib/tdsCluster) — and are resolved by slug.
 * Slugs are unique across both clusters.
 */

export function generateStaticParams() {
  return [...itrPages, ...tdsPages].map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const itr = getItrPage(params.slug);
  if (itr) {
    return pageMetadata({
      title: itr.seoTitle ?? itr.title,
      description: itr.metaDescription ?? itr.excerpt,
      path: itrPath(itr.slug),
      type: "article",
      openGraph: {
        publishedTime: itr.date,
        modifiedTime: itr.updated ?? itr.date,
      },
    });
  }

  const tds = getTdsPage(params.slug);
  if (tds) {
    return pageMetadata({
      title: tds.seoTitle ?? tds.title,
      description: tds.metaDescription ?? tds.excerpt,
      path: tdsPath(tds.slug),
      type: "article",
      openGraph: {
        publishedTime: tds.date,
        modifiedTime: tds.updated ?? tds.date,
      },
    });
  }

  return { title: "Page not found" };
}

export default function IndiaTaxComplianceClusterPage({
  params,
}: {
  params: { slug: string };
}) {
  const itr = getItrPage(params.slug);
  if (itr) return <ItrClusterPage page={itr} />;

  const tds = getTdsPage(params.slug);
  if (tds) return <TdsClusterPage page={tds} />;

  notFound();
}
