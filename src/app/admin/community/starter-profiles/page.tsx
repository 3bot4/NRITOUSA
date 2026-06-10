import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminStarterEditor from "@/components/admin/AdminStarterEditor";
import { adminGuard } from "@/lib/auth";
import { getStarterProfiles, getStarterUsageCounts } from "@/lib/community";
import { adminToggleStarter } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Starter Profiles",
  robots: { index: false, follow: false },
};

export default async function StarterProfilesPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const [starters, usage] = await Promise.all([
    getStarterProfiles(true),
    getStarterUsageCounts(),
  ]);

  const activeCount = starters.filter((s) => s.is_active).length;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Community Starter profiles</h1>
      <p className="mt-1 text-ink-500">
        {starters.length} profiles · {activeCount} active. These admin-controlled
        personas are always shown publicly with the “Community Starter” label.
      </p>
      <div className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50/70 p-4 text-sm text-amber-900">
        Starter profiles exist to seed useful discussions at launch. They must never
        be presented as independent real members. Disable any you don&apos;t want available.
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {starters.map((s) => {
          const u = usage[s.id] ?? { posts: 0, replies: 0 };
          return (
            <div key={s.id} className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
                    {s.avatar_initials ?? s.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">
                      {s.name}{" "}
                      <span className="text-xs font-medium text-amber-700">· {s.label}</span>
                    </p>
                    <p className="text-xs text-ink-400">
                      {s.gender ?? "—"} · {u.posts} posts · {u.replies} replies
                      {!s.is_active && <span className="ml-1 text-rose-500">· disabled</span>}
                    </p>
                  </div>
                </div>
                <AdminActionButton
                  action={adminToggleStarter}
                  fields={{ id: s.id, is_active: String(s.is_active) }}
                  label={s.is_active ? "Disable" : "Enable"}
                  variant={s.is_active ? "danger" : "primary"}
                />
              </div>
              <AdminStarterEditor starter={s} />
            </div>
          );
        })}
        {starters.length === 0 && <p className="text-ink-500">No starter profiles found. Run seed.sql.</p>}
      </div>
    </div>
  );
}
