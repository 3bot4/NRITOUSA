import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import { adminGuard } from "@/lib/auth";
import { getCategories, getStarterProfiles, getRecentPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seed Data",
  robots: { index: false, follow: false },
};

export default async function AdminSeedPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const [categories, starters, posts] = await Promise.all([
    getCategories(true),
    getStarterProfiles(true),
    getRecentPosts(1),
  ]);

  const Row = ({ label, value, ok }: { label: string; value: number; ok: boolean }) => (
    <div className="flex items-center justify-between rounded-xl border border-ink-900/5 bg-white px-4 py-3">
      <span className="text-ink-700">{label}</span>
      <span className={`font-bold ${ok ? "text-emerald-600" : "text-rose-600"}`}>{ok ? "✓ " : "• "}{value}</span>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Seed data</h1>
      <p className="mt-1 text-ink-500">Check seed status and how to (re)load data.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Row label="Categories" value={categories.length} ok={categories.length >= 13} />
        <Row label="Starter profiles" value={starters.length} ok={starters.length >= 50} />
        <Row label="Posts present" value={posts.length} ok={posts.length > 0} />
      </div>

      <div className="mt-8 space-y-4 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card text-sm leading-relaxed text-ink-700">
        <h2 className="text-lg font-bold text-ink-900">How seeding works</h2>
        <p>
          Seed data is loaded by running the SQL files in your Supabase project — this
          keeps secrets server-side and avoids exposing the service role key in the app.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open your Supabase project → <strong>SQL Editor</strong>.</li>
          <li>Run <code className="rounded bg-slate-100 px-1.5 py-0.5">supabase/schema.sql</code> (tables, RLS, triggers).</li>
          <li>Run <code className="rounded bg-slate-100 px-1.5 py-0.5">supabase/seed.sql</code> (13 categories, 50 starter profiles, 60+ posts, 100+ replies).</li>
          <li>Refresh this page — the counts above should turn green.</li>
        </ol>
        <p className="rounded-xl bg-amber-50 p-3 text-amber-900">
          To add more discussions after launch, use <strong>Create post</strong> and choose a
          Community Starter profile, or re-run a customized seed file. See <code>SUPABASE_SETUP.md</code>.
        </p>
      </div>
    </div>
  );
}
