import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PostRow from "@/components/community/PostRow";
import { getMyPosts } from "@/lib/community";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Discussions",
  description: "Discussions you've started in the NRI to USA community.",
  alternates: { canonical: "/community/my-posts" },
  robots: { index: false, follow: false },
};

export default async function MyPostsPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/community/my-posts");

  const posts = await getMyPosts(user.id);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-ink-400">
          <Link href="/community" className="hover:text-brand-600">Community</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-600">My discussions</span>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">My discussions</h1>
          <Link href="/community/new" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Start a discussion</Link>
        </div>

        <div className="mt-8 grid gap-4">
          {posts.length ? (
            posts.map((p) => <PostRow key={p.id} post={p} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-ink-800">You haven&apos;t posted yet</p>
              <p className="mt-2 text-ink-500">Start your first discussion and the community can help.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
