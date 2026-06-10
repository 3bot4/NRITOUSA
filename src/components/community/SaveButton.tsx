"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleSave } from "@/lib/actions/community";

export default function SaveButton({
  postId,
  postSlug,
  saved,
  isLoggedIn,
}: {
  postId: string;
  postSlug: string;
  saved: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(saved);
  const [pending, start] = useTransition();

  function onClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const fd = new FormData();
    fd.set("post_id", postId);
    fd.set("post_slug", postSlug);
    start(async () => {
      const res = await toggleSave(fd);
      if (!res?.error) setIsSaved((v) => !v);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-900/[0.04] disabled:opacity-50"
    >
      {isSaved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
