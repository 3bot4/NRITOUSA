import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItrClusterPage from "@/components/ItrClusterPage";
import TdsClusterPage from "@/components/TdsClusterPage";
import RepatriationClusterPage from "@/components/RepatriationClusterPage";
import GiftsClusterPage from "@/components/GiftsClusterPage";
import { pageMetadata } from "@/lib/seo";
import { getItrPage, itrPages, itrPath } from "@/lib/itrCluster";
import { getTdsPage, tdsPages, tdsPath } from "@/lib/tdsCluster";
import { getRepatPage, repatPages, repatPath } from "@/lib/repatriationCluster";
import { getGiftPage, giftPages, giftPath } from "@/lib/giftsCluster";

/**
 * Shared dynamic route for every /india-tax-compliance/<slug> cluster page.
 * Three sibling clusters live under this hub — "NRI ITR Filing" (lib/itrCluster),
 * "NRI TDS Refund & Lower TDS" (lib/tdsCluster), and "Form 15CA/15CB &
 * Repatriation Paperwork" (lib/repatriationCluster) — resolved by slug.
 * Slugs are unique across all three clusters.
 */

export function generateStaticParams() {
  return [...itrPages, ...tdsPages, ...repatPages, ...giftPages].map((p) => ({
    slug: p.slug,
  }));
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

  const repat = getRepatPage(params.slug);
  if (repat) {
    return pageMetadata({
      title: repat.seoTitle ?? repat.title,
      description: repat.metaDescription ?? repat.excerpt,
      path: repatPath(repat.slug),
      type: "article",
      openGraph: {
        publishedTime: repat.date,
        modifiedTime: repat.updated ?? repat.date,
      },
    });
  }

  const gift = getGiftPage(params.slug);
  if (gift) {
    return pageMetadata({
      title: gift.seoTitle ?? gift.title,
      description: gift.metaDescription ?? gift.excerpt,
      path: giftPath(gift.slug),
      type: "article",
      openGraph: {
        publishedTime: gift.date,
        modifiedTime: gift.updated ?? gift.date,
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

  const repat = getRepatPage(params.slug);
  if (repat) return <RepatriationClusterPage page={repat} />;

  const gift = getGiftPage(params.slug);
  if (gift) return <GiftsClusterPage page={gift} />;

  notFound();
}
