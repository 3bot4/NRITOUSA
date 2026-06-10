"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateStarter } from "@/lib/actions/admin";
import type { CommunityStarterProfile } from "@/lib/supabase/types";

export default function AdminStarterEditor({
  starter,
}: {
  starter: CommunityStarterProfile;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", starter.id);
    start(async () => {
      const res = await adminUpdateStarter(fd);
      if (res?.error) setError(res.error);
      else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-ink-900/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-900/[0.04]"
      >
        Edit
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 grid gap-2 rounded-xl border border-ink-900/10 bg-slate-50 p-3 text-sm">
      <input name="name" defaultValue={starter.name} placeholder="Name"
        className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <input name="avatar_initials" defaultValue={starter.avatar_initials ?? ""} maxLength={3} placeholder="Initials"
        className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <input name="label" defaultValue={starter.label} placeholder="Label"
        className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <textarea name="short_bio" defaultValue={starter.short_bio ?? ""} rows={2} placeholder="Short bio"
        className="rounded-lg border border-ink-900/10 px-3 py-2" />
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {pending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink-500">
          Cancel
        </button>
      </div>
    </form>
  );
}
