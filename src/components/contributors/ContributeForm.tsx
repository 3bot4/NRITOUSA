"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

const field =
  "mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const labelCls = "text-sm font-semibold text-ink-800";

type Status = "idle" | "submitting" | "success" | "error";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUrl = (v: string) => /^https?:\/\/.+/.test(v.trim());

export default function ContributeForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    linkedin: "",
    role: "",
    topic: "",
    story: "",
    company: "", // honeypot
  });
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!isEmail(form.email)) return "Please enter a valid email address.";
    if (!isUrl(form.linkedin))
      return "Please enter a valid LinkedIn URL (starting with https://).";
    if (!form.topic.trim()) return "Please share a proposed title or topic.";
    if (form.story.trim().length < 30)
      return "Please tell us a little more about your story.";
    if (!agree) return "Please confirm you agree to the guidelines.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agree }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ?? "Something went wrong. Please try again."
        );
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink-900">
          Thank you — your story is in.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-ink-600">
          We read every submission and aim to reply within 5–7 business days.
          If it&apos;s a fit, we&apos;ll request your headshot and walk you
          through the next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — visually hidden, off the tab order, ignored by humans. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company (leave blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={set("company")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Full name <span className="text-brand-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email <span className="text-brand-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="linkedin" className={labelCls}>
          LinkedIn URL <span className="text-brand-600">*</span>
        </label>
        <input
          id="linkedin"
          type="url"
          required
          value={form.linkedin}
          onChange={set("linkedin")}
          placeholder="https://www.linkedin.com/in/your-profile"
          className={field}
          aria-describedby="linkedin-note"
        />
        <p id="linkedin-note" className="mt-1.5 text-xs text-ink-400">
          We feature verified professionals; your LinkedIn appears on your
          author profile.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className={labelCls}>
            Current role / title
          </label>
          <input
            id="role"
            type="text"
            value={form.role}
            onChange={set("role")}
            placeholder="e.g. Senior Software Engineer"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="topic" className={labelCls}>
            Proposed title or topic <span className="text-brand-600">*</span>
          </label>
          <input
            id="topic"
            type="text"
            required
            value={form.topic}
            onChange={set("topic")}
            placeholder="e.g. How I navigated an H-1B transfer"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="story" className={labelCls}>
          Your story <span className="text-brand-600">*</span>
        </label>
        <textarea
          id="story"
          required
          rows={8}
          value={form.story}
          onChange={set("story")}
          placeholder="Share your experience, an outline, or the full draft. You can also paste a Google Doc link instead of writing it all here."
          className={field}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="agree"
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-ink-900/20 text-brand-600 focus:ring-2 focus:ring-brand-500/30"
        />
        <label htmlFor="agree" className="text-sm leading-relaxed text-ink-600">
          I&apos;ve read the contributor guidelines and confirm this is my own
          original work, based on my real experience.{" "}
          <span className="text-brand-600">*</span>
        </label>
      </div>

      <p className="rounded-xl bg-ink-900/[0.03] px-4 py-3 text-xs text-ink-500">
        We&apos;ll request your headshot after acceptance.
      </p>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending…
          </>
        ) : (
          "Submit your story"
        )}
      </button>
    </form>
  );
}
