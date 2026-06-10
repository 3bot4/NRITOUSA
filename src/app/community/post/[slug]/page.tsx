import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import AuthorChip from "@/components/community/AuthorChip";
import ReplyForm from "@/components/community/ReplyForm";
import SaveButton from "@/components/community/SaveButton";
import ReportButton from "@/components/community/ReportButton";
import CommunityDisclaimer from "@/components/community/Disclaimer";
import AdminReplyForm from "@/components/admin/AdminReplyForm";
import AdminActionButton from "@/components/admin/AdminActionButton";
import {
  getPostBySlug,
  getReplies,
  getRelatedPosts,
  isPostSaved,
  getStarterProfiles,
} from "@/lib/community";
import { getUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { authorDisplay, excerpt } from "@/lib/community-utils";
import { formatDate } from "@/lib/format";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";
import { adminModeratePost, adminModerateReply } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Discussion not found" };
  const path = `/community/post/${post.slug}`;
  const description = excerpt(post.content, 160);
  return {
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: post.title,
      description,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") {
    // Allow admins to view hidden posts
    const admin = await isAdmin();
    if (!post || (!admin && post.status !== "published")) notFound();
  }
  if (!post) notFound();

  const [replies, related, user, admin] = await Promise.all([
    getReplies(post.id),
    getRelatedPosts(post, 4),
    getUser(),
    isAdmin(),
  ]);

  const saved = user ? await isPostSaved(user.id, post.id) : false;
  const starters = admin ? await getStarterProfiles() : [];

  // Best-effort view increment (non-blocking)
  try {
    await (createClient().rpc as any)("increment_post_views", {
      p_slug: post.slug,
    });
  } catch {
    /* ignore */
  }

  const postAuthor = authorDisplay(post);
  const paragraphs = post.content.split(/\n\n+/);

  const jsonLd = jsonLdGraph(
    {
      "@type": "DiscussionForumPosting",
      "@id": `${absoluteUrl(`/community/post/${post.slug}`)}#post`,
      headline: post.title,
      text: excerpt(post.content, 300),
      datePublished: post.created_at,
      dateModified: post.updated_at,
      author: { "@type": "Person", name: postAuthor.name },
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.replies_count,
      },
      url: absoluteUrl(`/community/post/${post.slug}`),
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Community", url: "/community" },
      ...(post.category
        ? [{ name: post.category.name, url: `/community/categories/${post.category.slug}` }]
        : []),
      { name: post.title, url: `/community/post/${post.slug}` },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="border-b border-ink-900/5 bg-white py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-400">
                <Link href="/" className="hover:text-brand-600">Home</Link>
                <span aria-hidden>/</span>
                <Link href="/community" className="hover:text-brand-600">Community</Link>
                {post.category && (
                  <>
                    <span aria-hidden>/</span>
                    <Link href={`/community/categories/${post.category.slug}`} className="hover:text-brand-600">
                      {post.category.name}
                    </Link>
                  </>
                )}
              </nav>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                {post.is_pinned && <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">📌 Pinned</span>}
                {post.is_locked && <span className="rounded-full bg-ink-900/5 px-2 py-0.5 font-semibold text-ink-500">🔒 Locked</span>}
                {post.status === "hidden" && <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-700">Hidden</span>}
                {post.category && (
                  <Link href={`/community/categories/${post.category.slug}`} className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-ink-600">
                    {post.category.icon} {post.category.name}
                  </Link>
                )}
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
                {post.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <AuthorChip author={postAuthor} date={`Posted ${formatDate(post.created_at)} · ${post.views_count} views`} />
                <div className="flex items-center gap-2">
                  <SaveButton postId={post.id} postSlug={post.slug} saved={saved} isLoggedIn={Boolean(user)} />
                </div>
              </div>
            </div>
          </Container>
        </header>

        <Container className="py-10">
          <div className="mx-auto max-w-3xl">
            {/* Post body */}
            <div className="prose-none space-y-4 text-[1.05rem] leading-8 text-ink-700">
              {paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <ReportButton postId={post.id} isLoggedIn={Boolean(user)} />
              {admin && (
                <div className="flex flex-wrap items-center gap-2">
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: post.id, op: post.is_pinned ? "unpin" : "pin" }} label={post.is_pinned ? "Unpin" : "Pin"} variant="primary" />
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: post.id, op: post.is_locked ? "unlock" : "lock" }} label={post.is_locked ? "Unlock" : "Lock"} />
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: post.id, op: post.status === "hidden" ? "publish" : "hide" }} label={post.status === "hidden" ? "Unhide" : "Hide"} />
                  <AdminActionButton action={adminModeratePost} fields={{ post_id: post.id, op: "delete" }} label="Delete" variant="danger" confirm="Delete this post permanently?" />
                </div>
              )}
            </div>

            <div className="my-8"><CommunityDisclaimer compact /></div>

            {/* Replies */}
            <h2 className="mb-4 text-xl font-bold tracking-tight text-ink-900">
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </h2>

            <div className="space-y-4">
              {replies.map((reply) => {
                const ra = authorDisplay(reply);
                return (
                  <div
                    key={reply.id}
                    className={`rounded-2xl border p-5 ${
                      reply.is_best_answer
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-ink-900/5 bg-white"
                    }`}
                  >
                    {reply.is_best_answer && (
                      <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
                        ✓ Best answer
                      </p>
                    )}
                    <AuthorChip author={ra} size="sm" date={formatDate(reply.created_at)} />
                    <div className="mt-3 space-y-3 whitespace-pre-line leading-7 text-ink-700">
                      {reply.content.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <ReportButton replyId={reply.id} isLoggedIn={Boolean(user)} />
                      {admin && (
                        <>
                          <AdminActionButton action={adminModerateReply} fields={{ reply_id: reply.id, post_id: post.id, op: reply.is_best_answer ? "unbest" : "best" }} label={reply.is_best_answer ? "Unmark best" : "Mark best"} variant="primary" />
                          <AdminActionButton action={adminModerateReply} fields={{ reply_id: reply.id, op: reply.status === "hidden" ? "publish" : "hide" }} label={reply.status === "hidden" ? "Unhide" : "Hide"} />
                          <AdminActionButton action={adminModerateReply} fields={{ reply_id: reply.id, op: "delete" }} label="Delete" variant="danger" confirm="Delete this reply?" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {replies.length === 0 && (
                <p className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-6 text-center text-ink-500">
                  No replies yet — be the first to share your experience.
                </p>
              )}
            </div>

            {/* Reply forms */}
            <div className="mt-8 space-y-4">
              <ReplyForm postId={post.id} postSlug={post.slug} isLoggedIn={Boolean(user)} isLocked={post.is_locked} />
              {admin && <AdminReplyForm postId={post.id} postSlug={post.slug} starters={starters} />}
            </div>
          </div>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold tracking-tight text-ink-900">Related discussions</h2>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/community/post/${r.slug}`} className="flex items-center justify-between gap-4 rounded-xl border border-ink-900/5 bg-white px-4 py-3 hover:bg-slate-50">
                      <span className="truncate font-medium text-ink-800">{r.title}</span>
                      <span className="flex-none text-xs text-ink-400">{r.replies_count} replies</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      <Newsletter />
    </>
  );
}
