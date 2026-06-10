"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminCreateReply } from "@/lib/actions/admin";
import type { CommunityStarterProfile } from "@/lib/supabase/types";

export default function AdminReplyForm({
  postId,
  postSlug,
  starters,
}: {
  postId: string;
  postSlug: string;
  starters: CommunityStarterProfile[];
}) {
  const router = useRouter();
  const [postedAs, setPostedAs] = useState<"official" | "starter" | "self">("official");
  const [content, setContent] = useState("");
  const [starterId, setStarterId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("post_id", postId);
    fd.set("post_slug", postSlug);
    fd.set("content", content);
    fd.set("posted_as", postedAs);
    if (postedAs === "starter") fd.set("starter_profile_id", starterId);
    start(async () => {
      const res = await adminCreateReply(fd);
      if (res?.error) setError(res.error);
      else {
        setContent("");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-700">
        Admin reply
      </p>
      <div className="mb-3 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-1.5">
          <input type="radio" name="admin_posted_as" checked={postedAs === "official"} onChange={() => setPostedAs("official")} />
          Official
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" name="admin_posted_as" checked={postedAs === "starter"} onChange={() => setPostedAs("starter")} />
          Community Starter
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" name="admin_posted_as" checked={postedAs === "self"} onChange={() => setPostedAs("self")} />
          My admin account
        </label>
      </div>

      {postedAs === "starter" && (
        <select
          value={starterId}
          onChange={(e) => setStarterId(e.target.value)}
          className="mb-3 w-full rounded-xl border border-ink-900/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="">Select a starter profile…</option>
          {starters.map((s) => (
            <option key={s.id} value={s.id}>{s.name} · {s.label}</option>
          ))}
        </select>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-ink-900/10 px-4 py-3 text-sm outline-none focus:border-brand-400"
        placeholder="Reply text…"
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3 flex justify-end">
        <button type="submit" disabled={pending || content.trim().length === 0}
          className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {pending ? "Posting…" : "Post admin reply"}
        </button>
      </div>
    </form>
  );
}
