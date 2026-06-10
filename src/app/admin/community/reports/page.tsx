import type { Metadata } from "next";
import Link from "next/link";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { adminGuard } from "@/lib/auth";
import { adminListReports } from "@/lib/admin-data";
import { adminUpdateReport } from "@/lib/actions/admin";
import { excerpt } from "@/lib/community-utils";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Reports",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  open: "bg-rose-100 text-rose-700",
  reviewing: "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-700",
  dismissed: "bg-ink-900/5 text-ink-500",
};

export default async function AdminReportsPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const reports = await adminListReports();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Reports</h1>
      <p className="mt-1 text-ink-500">{reports.length} reports.</p>

      <div className="mt-6 space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
              <span className={`rounded px-2 py-0.5 font-semibold ${statusStyles[r.status] ?? ""}`}>{r.status}</span>
              <span>· {formatDate(r.created_at)}</span>
              {r.post?.slug && (
                <Link href={`/community/post/${r.post.slug}`} className="text-brand-600 hover:underline">· View post</Link>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-700">
              <strong className="font-semibold">Reason:</strong> {r.reason || "—"}
            </p>
            {r.post?.title && <p className="mt-1 text-xs text-ink-500">On post: {r.post.title}</p>}
            {r.reply?.content && <p className="mt-1 text-xs text-ink-500">On reply: {excerpt(r.reply.content, 120)}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <AdminActionButton action={adminUpdateReport} fields={{ id: r.id, status: "reviewing" }} label="Reviewing" />
              <AdminActionButton action={adminUpdateReport} fields={{ id: r.id, status: "resolved" }} label="Resolve" variant="primary" />
              <AdminActionButton action={adminUpdateReport} fields={{ id: r.id, status: "dismissed" }} label="Dismiss" />
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-8 text-center text-ink-500">
            No reports. 🎉
          </p>
        )}
      </div>
    </div>
  );
}
