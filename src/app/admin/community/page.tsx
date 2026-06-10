import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminPostForm from "@/components/admin/AdminPostForm";
import { adminGuard } from "@/lib/auth";
import { getCategories, getStarterProfiles } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Community Post",
  robots: { index: false, follow: false },
};

export default async function AdminCreatePostPage() {
  const guard = await adminGuard();
  if (guard.state !== "ok") return <AccessDenied />;

  const [categories, starters] = await Promise.all([
    getCategories(true),
    getStarterProfiles(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Create a community post</h1>
      <p className="mt-1 text-ink-500">
        Post as the official team or as a clearly-labeled Community Starter persona.
      </p>
      <div className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50/70 p-4 text-sm text-amber-900">
        Posts created as a starter profile are shown publicly as
        <strong> “Name · Community Starter.”</strong> They are never presented as
        independent real members.
      </div>
      <div className="mt-8 max-w-2xl rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
        <AdminPostForm categories={categories} starters={starters} />
      </div>
    </div>
  );
}
