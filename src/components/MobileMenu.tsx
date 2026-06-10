"use client";

import Link from "next/link";
import { topics } from "@/lib/topics";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-16 z-40 bg-ink-900/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-ink-900/10 bg-white shadow-xl transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <nav className="px-5 py-6">
          <Link
            href="/tools"
            onClick={onClose}
            className="mb-3 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-semibold text-brand-700"
          >
            <span className="text-xl">🛠️</span>
            <span>Tools & data hub</span>
          </Link>

          <Link
            href="/calculators"
            onClick={onClose}
            className="mb-3 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-semibold text-brand-700"
          >
            <span className="text-xl">🧮</span>
            <span>Cross-border calculators</span>
          </Link>

          <Link
            href="/community"
            onClick={onClose}
            className="mb-5 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-semibold text-brand-700"
          >
            <span className="text-xl">💬</span>
            <span>Community discussions</span>
          </Link>

          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
            Browse topics
          </p>
          <ul className="grid grid-cols-1 gap-1">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/topics/${topic.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-ink-700 transition-colors hover:bg-ink-900/[0.04]"
                >
                  <span className="text-xl">{topic.icon}</span>
                  <span className="font-medium">{topic.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm font-semibold text-ink-700">
            <Link
              href="/resources"
              onClick={onClose}
              className="rounded-xl border border-ink-900/10 px-3 py-3"
            >
              Resources
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="rounded-xl border border-ink-900/10 px-3 py-3"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="rounded-xl border border-ink-900/10 px-3 py-3"
            >
              Contact
            </Link>
          </div>

          <Link
            href="/topics"
            onClick={onClose}
            className="mt-3 block rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Start Here
          </Link>
        </nav>
      </div>
    </div>
  );
}
