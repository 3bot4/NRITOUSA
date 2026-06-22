import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItrClusterPage from "@/components/ItrClusterPage";
import { pageMetadata } from "@/lib/seo";
import { getItrPage, itrPages, itrPath } from "@/lib/itrCluster";

export function generateStaticParams() {
  return itrPages.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getItrPage(params.slug);
  if (!page) return { title: "Page not found" };
  return pageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.metaDescription ?? page.excerpt,
    path: itrPath(page.slug),
    type: "article",
    openGraph: {
      publishedTime: page.date,
      modifiedTime: page.updated ?? page.date,
    },
  });
}

export default function IndiaTaxComplianceClusterPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getItrPage(params.slug);
  if (!page) notFound();
  return <ItrClusterPage page={page} />;
}
