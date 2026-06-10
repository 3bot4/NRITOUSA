import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PostRow from "@/components/community/PostRow";
import { getSavedPosts } from "@/lib/community";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Discussions",
  description: "Discussions you've saved in the NRI to USA community.",
  alternates: { canonical: "/community/saved" },
  robots: { index: false, follow: false },
};

export default async function SavedPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/community/saved");

  const posts = await getSavedPosts(user.id);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-ink-400">
          <Link href="/community" className="hover:text-brand-600">Community</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-600">Saved</span>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Saved discussions</h1>

        <div className="mt-8 grid gap-4">
          {posts.length ? (
            posts.map((p) => <PostRow key={p.id} post={p} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-ink-800">Nothing saved yet</p>
              <p className="mt-2 text-ink-500">Tap “Save” on any discussion to keep it here.</p>
              <Link href="/community" className="mt-5 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Browse discussions</Link>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
