import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminCategoryForm from "@/components/admin/AdminCategoryForm";
import { adminGuard } from "@/lib/auth";
import { getCategories, getPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const categories = await getCategories(true);
  const counts = await Promise.all(
    categories.map((c) => getPosts({ categoryId: c.id, limit: 200 }))
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Categories</h1>
        <AdminCategoryForm />
      </div>
      <p className="mt-1 text-ink-500">{categories.length} categories.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id} className="border-t border-ink-900/5">
                <td className="px-4 py-3 font-medium text-ink-900">{c.icon} {c.name}</td>
                <td className="px-4 py-3 text-ink-500">{c.slug}</td>
                <td className="px-4 py-3 text-ink-700">{counts[i].length}</td>
                <td className="px-4 py-3">
                  {c.is_active ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                  ) : (
                    <span className="rounded bg-ink-900/5 px-2 py-0.5 text-xs font-semibold text-ink-500">Hidden</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="p-6 text-ink-500">No categories. Run seed.sql or add one above.</p>}
      </div>
    </div>
  );
}
