import type { Metadata } from "next";
import Link from "next/link";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { adminGuard } from "@/lib/auth";
import { adminListReplies } from "@/lib/admin-data";
import { adminModerateReply } from "@/lib/actions/admin";
import { authorDisplay, excerpt } from "@/lib/community-utils";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Replies",
  robots: { index: false, follow: false },
};

export default async function AdminRepliesPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const replies = await adminListReplies(150);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Replies</h1>
      <p className="mt-1 text-ink-500">{replies.length} recent replies. Hide, delete, or mark best answer.</p>

      <div className="mt-6 space-y-3">
        {replies.map((r) => {
          const a = authorDisplay(r as any);
          return (
            <div key={r.id} className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                {r.is_best_answer && <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700">Best</span>}
                {r.status !== "published" && <span className="rounded bg-rose-100 px-1.5 py-0.5 font-semibold text-rose-700">{r.status}</span>}
                <span>{a.name}{a.badge ? ` (${a.badge})` : ""}</span>
                <span>· {formatDate(r.created_at)}</span>
                {r.post_slug && (
                  <>
                    <span>· on</span>
                    <Link href={`/community/post/${r.post_slug}`} className="text-brand-600 hover:underline">{excerpt(r.post_title ?? "post", 40)}</Link>
                  </>
                )}
              </div>
              <p className="text-sm text-ink-700">{excerpt(r.content, 200)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <AdminActionButton action={adminModerateReply} fields={{ reply_id: r.id, post_id: r.post_id, op: r.is_best_answer ? "unbest" : "best" }} label={r.is_best_answer ? "Unmark best" : "Mark best"} variant="primary" />
                <AdminActionButton action={adminModerateReply} fields={{ reply_id: r.id, op: r.status === "hidden" ? "publish" : "hide" }} label={r.status === "hidden" ? "Unhide" : "Hide"} />
                <AdminActionButton action={adminModerateReply} fields={{ reply_id: r.id, op: "delete" }} label="Delete" variant="danger" confirm="Delete this reply?" />
              </div>
            </div>
          );
        })}
        {replies.length === 0 && <p className="text-ink-500">No replies found.</p>}
      </div>
    </div>
  );
}
