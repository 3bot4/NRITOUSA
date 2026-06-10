import type { Metadata } from "next";
import Link from "next/link";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { adminGuard } from "@/lib/auth";
import { adminListPosts } from "@/lib/admin-data";
import { adminModeratePost } from "@/lib/actions/admin";
import { authorDisplay } from "@/lib/community-utils";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Posts",
  robots: { index: false, follow: false },
};

export default async function AdminPostsPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const posts = await adminListPosts(150);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Posts</h1>
        <Link href="/admin/community" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">+ New post</Link>
      </div>
      <p className="mt-1 text-ink-500">{posts.length} posts. Pin, lock, hide, or delete.</p>

      <div className="mt-6 space-y-3">
        {posts.map((p) => {
          const a = authorDisplay(p);
          return (
            <div key={p.id} className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                    {p.is_pinned && <span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-brand-700">Pinned</span>}
                    {p.is_locked && <span className="rounded bg-ink-900/5 px-1.5 py-0.5 font-semibold">Locked</span>}
                    {p.status !== "published" && <span className="rounded bg-rose-100 px-1.5 py-0.5 font-semibold text-rose-700">{p.status}</span>}
                    <span>{p.category?.name}</span>
                    <span>· {a.name}{a.badge ? ` (${a.badge})` : ""}</span>
                    <span>· {formatDate(p.created_at)}</span>
                    <span>· {p.replies_count} replies</span>
                  </div>
                  <Link href={`/community/post/${p.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                    {p.title}
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: p.id, op: p.is_pinned ? "unpin" : "pin" }} label={p.is_pinned ? "Unpin" : "Pin"} variant="primary" />
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: p.id, op: p.is_locked ? "unlock" : "lock" }} label={p.is_locked ? "Unlock" : "Lock"} />
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: p.id, op: p.status === "hidden" ? "publish" : "hide" }} label={p.status === "hidden" ? "Unhide" : "Hide"} />
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: p.id, op: "delete" }} label="Delete" variant="danger" confirm="Delete this post permanently?" />
                </div>
              </div>
            </div>
          );
        })}
        {posts.length === 0 && <p className="text-ink-500">No posts found.</p>}
      </div>
    </div>
  );
}
