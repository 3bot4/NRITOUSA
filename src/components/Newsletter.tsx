"use client";

import { useState } from "react";
import Container from "./Container";

type Status = "idle" | "submitting" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're subscribed — welcome!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const submitting = status === "submitting";

  return (
    <section id="newsletter" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 sm:px-12 sm:py-16">
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Get practical immigrant finance guides every week
            </h2>
            <p className="mt-3 text-ink-400">
              Simple, useful guides about money, housing, cars, taxes, and life
              in the USA. No spam, unsubscribe anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
              {/* Honeypot: hidden from real users, off the tab order. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>

            {message && (
              <p
                role="status"
                className={`mt-3 text-sm ${
                  status === "error" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {message}
              </p>
            )}
            <p className="mt-3 text-xs text-ink-500">
              Practical guides only. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
