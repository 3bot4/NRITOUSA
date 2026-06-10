"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reportContent } from "@/lib/actions/community";

export default function ReportButton({
  postId,
  replyId,
  isLoggedIn,
}: {
  postId?: string;
  replyId?: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (done) {
    return <span className="text-xs text-ink-400">Reported — thank you</span>;
  }

  function submit() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setError(null);
    const fd = new FormData();
    if (postId) fd.set("post_id", postId);
    if (replyId) fd.set("reply_id", replyId);
    fd.set("reason", reason);
    start(async () => {
      const res = await reportContent(fd);
      if (res?.error) setError(res.error);
      else setDone(true);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => (isLoggedIn ? setOpen(true) : router.push("/login"))}
        className="text-xs text-ink-400 hover:text-rose-600"
      >
        ⚑ Report
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-ink-900/10 bg-slate-50 p-3">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Why are you reporting this? (optional)"
        className="w-full rounded-lg border border-ink-900/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {pending ? "Sending…" : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
