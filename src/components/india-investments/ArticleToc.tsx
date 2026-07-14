"use client";

import { useEffect, useState } from "react";

/**
 * Long-page navigation for the India Investments pillar. One component renders:
 *  - a sticky vertical table of contents in the left gutter on very wide screens
 *    (>=1440px, where there is room without narrowing the article column);
 *  - a compact collapsible "On this page" control on smaller screens; and
 *  - a back-to-top button after the user scrolls a meaningful distance.
 *
 * The active section is tracked with IntersectionObserver. Scrolling itself is
 * handled by native anchor links + global CSS (scroll-behavior + scroll-padding-top),
 * which already respects prefers-reduced-motion (see globals.css). The desktop
 * rail hides once the reader reaches the closing/related-guides area.
 */
export interface TocItem {
  id: string;
  label: string;
}

/** Sections whose appearance means "we're at the end" — hide the desktop rail. */
const END_SENTINELS = new Set(["guides", "sources", "faq"]);

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            setAtEnd(END_SENTINELS.has(e.target.id));
          }
        }
      },
      // Activate a section once its top passes just below the fixed header and
      // before it leaves the upper part of the viewport.
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 },
    );

    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el != null);
    els.forEach((el) => observer.observe(el));

    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  const backToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      {/* ---------- Desktop sticky rail (>= 1440px) ---------- */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-24 z-30 hidden transition-opacity duration-300 min-[1440px]:block ${
          atEnd ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={atEnd}
      >
        <div className="mx-auto max-w-[1400px] px-4">
          <nav
            aria-label="On this page"
            className="pointer-events-auto max-h-[calc(100vh-8rem)] w-56 overflow-y-auto rounded-2xl border border-ink-900/10 bg-white/90 p-3 shadow-card backdrop-blur [scrollbar-width:thin]"
          >
            <p className="px-2 pb-2 text-[0.625rem] font-bold uppercase tracking-wider text-ink-400">
              On this page
            </p>
            <ul className="space-y-0.5">
              {items.map((it) => {
                const active = it.id === activeId;
                return (
                  <li key={it.id}>
                    <a
                      href={`#${it.id}`}
                      aria-current={active ? "location" : undefined}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.8125rem] leading-tight transition ${
                        active
                          ? "bg-brand-50 font-bold text-brand-800"
                          : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 flex-none rounded-full ${
                          active ? "bg-brand-600" : "bg-ink-900/20"
                        }`}
                      />
                      {it.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* ---------- Mobile / tablet collapsible (< 1440px) ---------- */}
      <div className="sticky top-16 z-20 -mx-4 border-y border-ink-900/5 bg-white/90 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/70 min-[1440px]:hidden print:hidden">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="toc-mobile-panel"
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-2 text-sm font-semibold text-ink-800"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>☰</span> On this page
              <span className="font-normal text-ink-400">· {activeLabel(items, activeId)}</span>
            </span>
            <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>
          <ul
            id="toc-mobile-panel"
            hidden={!open}
            className="mt-1 grid max-h-[60vh] grid-cols-1 gap-0.5 overflow-y-auto pb-2 sm:grid-cols-2"
          >
            {items.map((it) => {
              const active = it.id === activeId;
              return (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active ? "bg-brand-50 font-bold text-brand-800" : "text-ink-600 hover:bg-ink-50"
                    }`}
                  >
                    {it.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ---------- Back to top ---------- */}
      <button
        type="button"
        onClick={backToTop}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 bg-white text-lg text-ink-700 shadow-card transition hover:bg-ink-50 print:hidden ${
          showTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span aria-hidden>↑</span>
      </button>
    </>
  );
}

function activeLabel(items: TocItem[], id: string): string {
  return items.find((i) => i.id === id)?.label ?? items[0]?.label ?? "";
}
