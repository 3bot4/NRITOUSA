import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import NewPostForm from "@/components/community/NewPostForm";
import CommunityDisclaimer from "@/components/community/Disclaimer";
import { getCategories, getCategoryBySlug } from "@/lib/community";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start a Discussion",
  description: "Ask a question or start a discussion in the NRI to USA community.",
  alternates: { canonical: "/community/new" },
  robots: { index: false, follow: true },
};

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const user = await getUser();
  const categories = await getCategories();
  const preset = searchParams.category
    ? await getCategoryBySlug(searchParams.category)
    : null;

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-ink-400">
          <Link href="/community" className="hover:text-brand-600">Community</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-600">New discussion</span>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Start a discussion</h1>
        <p className="mt-2 text-ink-500">
          Ask a clear question and share context. Keep it experience-based — please don&apos;t share private documents or give direct professional advice.
        </p>

        <div className="my-6"><CommunityDisclaimer compact /></div>

        {user ? (
          <NewPostForm categories={categories} defaultCategory={preset?.id} />
        ) : (
          <div className="rounded-2xl border border-ink-900/10 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-ink-800">Please log in to post</p>
            <p className="mt-2 text-ink-500">You need an account to start a discussion.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login?next=/community/new" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Log in</Link>
              <Link href="/signup" className="rounded-xl border border-ink-900/10 px-6 py-3 font-semibold text-ink-700 hover:bg-ink-900/[0.04]">Sign up</Link>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
