import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import { adminGuard } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdminConfigured } from "@/lib/supabase/admin";
import { adminListMembers } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const members = await adminListMembers(50);

  const Check = ({ ok, label }: { ok: boolean; label: string }) => (
    <li className="flex items-center gap-2">
      <span className={ok ? "text-emerald-600" : "text-rose-600"}>{ok ? "✓" : "✗"}</span>
      <span className="text-ink-700">{label}</span>
    </li>
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Settings</h1>
      <p className="mt-1 text-ink-500">Environment and members overview.</p>

      <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-ink-900">Configuration</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <Check ok={isSupabaseConfigured} label="Public Supabase URL + anon key set" />
          <Check ok={isAdminConfigured} label="Service role key set (server-only)" />
        </ul>
        <p className="mt-3 text-xs text-ink-400">
          The service role key is never exposed to the browser. If a check fails, add the
          value to <code>.env.local</code> (local) or your Vercel project env vars.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-ink-900">Members ({members.length} shown)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-400">
              <tr><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">Role</th></tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-ink-900/5">
                  <td className="py-2 text-ink-900">{m.display_name ?? "—"}</td>
                  <td className="py-2 text-ink-500">{m.email}</td>
                  <td className="py-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-ink-700">{m.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && <p className="py-4 text-ink-500">No members yet.</p>}
        </div>
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-ink-500">
          To promote a member to admin or moderator, run in Supabase SQL Editor:{" "}
          <code className="rounded bg-white px-1.5 py-0.5">update profiles set role = &apos;admin&apos; where email = &apos;you@example.com&apos;;</code>
        </p>
      </div>
    </div>
  );
}
