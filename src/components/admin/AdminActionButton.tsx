"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions/community";

type Action = (formData: FormData) => Promise<ActionResult>;

/**
 * Small reusable button that submits a fixed set of fields to a server action,
 * then refreshes. Used for moderation, toggles, and report status changes.
 */
export default function AdminActionButton({
  action,
  fields,
  label,
  confirm,
  variant = "neutral",
}: {
  action: Action;
  fields: Record<string, string>;
  label: string;
  confirm?: string;
  variant?: "neutral" | "primary" | "danger";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const styles =
    variant === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
      : variant === "primary"
      ? "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
      : "border-ink-900/10 bg-white text-ink-600 hover:bg-ink-900/[0.04]";

  function onClick() {
    if (confirm && !window.confirm(confirm)) return;
    setError(null);
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
    start(async () => {
      const res = await action(fd);
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-50 ${styles}`}
      >
        {pending ? "…" : label}
      </button>
      {error && <span className="mt-1 text-[0.65rem] text-rose-600">{error}</span>}
    </span>
  );
}
