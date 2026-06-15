import type { Metadata } from "next";
import ClusterPage from "@/components/ClusterPage";
import { pageMetadata } from "@/lib/seo";
import { CLUSTER_BASE, clusterHub } from "@/lib/passportCluster";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: clusterHub.seoTitle ?? clusterHub.title,
    description: clusterHub.metaDescription ?? clusterHub.excerpt,
    path: CLUSTER_BASE,
    type: "article",
    openGraph: {
      publishedTime: clusterHub.date,
      modifiedTime: clusterHub.updated ?? clusterHub.date,
    },
  });
}

export default function PassportHubPage() {
  return <ClusterPage page={clusterHub} />;
}
