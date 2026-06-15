import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterPage from "@/components/ClusterPage";
import { pageMetadata } from "@/lib/seo";
import {
  clusterChildren,
  clusterPath,
  getClusterPage,
} from "@/lib/passportCluster";

export function generateStaticParams() {
  return clusterChildren.map((p) => ({ page: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { page: string };
}): Metadata {
  const page = getClusterPage(params.page);
  if (!page || page.kind === "hub") return { title: "Page not found" };
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.metaDescription ?? page.excerpt,
    path: clusterPath(page.slug),
    type: "article",
    openGraph: {
      publishedTime: page.date,
      modifiedTime: page.updated ?? page.date,
    },
  });
}

export default function PassportClusterChildPage({
  params,
}: {
  params: { page: string };
}) {
  const page = getClusterPage(params.page);
  if (!page || page.kind === "hub") notFound();
  return <ClusterPage page={page} />;
}
