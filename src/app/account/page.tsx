import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import PostRow from "@/components/community/PostRow";
import LogoutButton from "@/components/auth/LogoutButton";
import { getProfile } from "@/lib/auth";
import { getMyPosts, getSavedPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your NRI to USA community account.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/account");

  const [myPosts, saved] = await Promise.all([
    getMyPosts(profile.id),
    getSavedPosts(profile.id),
  ]);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">My account</h1>
            <p className="mt-2 text-ink-500">
              <span className="font-semibold text-ink-700">{profile.display_name ?? "Member"}</span>
              {" · "}{profile.email}
              {profile.role !== "member" && (
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold uppercase text-brand-700">{profile.role}</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {profile.role === "admin" && (
              <Link href="/admin" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Admin dashboard</Link>
            )}
            <LogoutButton />
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">My discussions</h2>
            <Link href="/community/my-posts" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="grid gap-3">
            {myPosts.slice(0, 4).map((p) => <PostRow key={p.id} post={p} />)}
            {myPosts.length === 0 && <p className="text-ink-500">You haven&apos;t posted yet. <Link href="/community/new" className="text-brand-600 underline">Start a discussion</Link>.</p>}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">Saved discussions</h2>
            <Link href="/community/saved" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="grid gap-3">
            {saved.slice(0, 4).map((p) => <PostRow key={p.id} post={p} />)}
            {saved.length === 0 && <p className="text-ink-500">Nothing saved yet.</p>}
          </div>
        </section>
      </div>
    </Container>
  );
}
