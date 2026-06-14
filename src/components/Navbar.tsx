"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import MobileMenu from "./MobileMenu";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "India Tax & Compliance", href: "/india-tax-compliance" },
  { label: "Tools", href: "/tools" },
  { label: "Education", href: "/education" },
  { label: "Calculators", href: "/calculators" },
  { label: "New to USA", href: "/topics/new-to-usa" },
  { label: "Send Money to India", href: "/topics/money-transfer" },
  { label: "Guides", href: "/topics" },
  { label: "Long-Term NRI", href: "/long-term-nri-wealth" },
  { label: "Write for Us", href: "/contribute" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-ink-900/10 bg-white/80 backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="NRI to USA — home"
            className="flex shrink-0 items-center gap-2 font-bold"
          >
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 bg-gradient-to-br from-brand-600 to-emerald-500 text-sm font-extrabold text-white shadow-sm"
            >
              N
            </span>
            <span aria-hidden className="text-lg tracking-tight text-ink-900">
              NRI <span className="text-ink-400 font-semibold">to</span>{" "}
              <span className="text-brand-600">USA</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-brand-700"
                        : "text-ink-600 hover:bg-ink-900/[0.04] hover:text-ink-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/topics"
              className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:inline-block"
            >
              Start Here
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-900/[0.05] lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </Container>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
