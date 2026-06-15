"use client";

import Link from "next/link";

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
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
          <ul className="grid grid-cols-1 gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-xl px-3 py-3 text-base font-semibold text-ink-800 transition-colors hover:bg-ink-900/[0.04] hover:text-brand-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/topics"
            onClick={onClose}
            className="mt-4 block rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Start Here
          </Link>
        </nav>
      </div>
    </div>
  );
}
