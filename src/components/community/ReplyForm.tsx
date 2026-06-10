"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createReply } from "@/lib/actions/community";

export default function ReplyForm({
  postId,
  postSlug,
  isLoggedIn,
  isLocked,
}: {
  postId: string;
  postSlug: string;
  isLoggedIn: boolean;
  isLocked: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-ink-900/10 bg-slate-50 p-5 text-sm text-ink-500">
        🔒 This discussion is locked. New replies are turned off.
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-ink-900/10 bg-white p-5 text-sm text-ink-600">
        Please{" "}
        <Link href="/login" className="font-semibold text-brand-600 underline">
          log in
        </Link>{" "}
        or{" "}
        <Link href="/signup" className="font-semibold text-brand-600 underline">
          create an account
        </Link>{" "}
        to join the discussion.
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("post_id", postId);
    fd.set("post_slug", postSlug);
    fd.set("content", content);
    start(async () => {
      const res = await createReply(fd);
      if (res?.error) {
        setError(res.error);
      } else {
        setContent("");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-ink-900/10 bg-white p-5">
      <label htmlFor="reply" className="mb-2 block text-sm font-semibold text-ink-800">
        Your reply
      </label>
      <textarea
        id="reply"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={10000}
        placeholder="Share your experience. Please avoid direct financial, tax, or legal advice — and remind others to consult professionals where needed."
        className="w-full rounded-xl border border-ink-900/10 px-4 py-3 text-ink-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={pending || content.trim().length === 0}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {pending ? "Posting…" : "Post reply"}
        </button>
      </div>
    </form>
  );
}
