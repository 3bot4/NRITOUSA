import type { Metadata } from "next";
import Link from "next/link";
import AccessDenied from "@/components/admin/AccessDenied";
import { adminGuard } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

function Stat({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
      <p className="text-3xl font-extrabold tracking-tight text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Dashboard</h1>
      <p className="mt-1 text-ink-500">Community at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total posts" value={stats.totalPosts} href="/admin/community/posts" />
        <Stat label="Total replies" value={stats.totalReplies} href="/admin/community/replies" />
        <Stat label="Total members" value={stats.totalMembers} />
        <Stat label="Total categories" value={stats.totalCategories} href="/admin/community/categories" />
        <Stat label="Open reports" value={stats.openReports} href="/admin/community/reports" />
        <Stat label="Posts this week" value={stats.postsThisWeek} />
        <Stat label="Replies this week" value={stats.repliesThisWeek} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink-900">Most active categories</h2>
          <ul className="mt-4 space-y-2">
            {stats.topCategories.length ? (
              stats.topCategories.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{c.name}</span>
                  <span className="font-bold text-ink-900">{c.count}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-ink-500">No data yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-ink-900">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/community" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Create post</Link>
            <Link href="/admin/community/starter-profiles" className="rounded-xl border border-ink-900/10 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]">Starter profiles</Link>
            <Link href="/admin/community/reports" className="rounded-xl border border-ink-900/10 px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04]">Review reports</Link>
          </div>
          {stats.totalPosts === 0 && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              No posts found. If Supabase is configured, run <code>schema.sql</code> then <code>seed.sql</code>. See <Link href="/admin/community/seed" className="underline">Seed data</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
