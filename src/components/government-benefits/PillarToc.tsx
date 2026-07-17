"use client";

import { useEffect, useState } from "react";

/**
 * Long-page navigation for the government-benefits pillar.
 *
 * WHY THIS EXISTS instead of reusing components/india-investments/ArticleToc:
 * that component positions its desktop rail with `fixed inset-x-0 top-24` inside
 * a max-w-[1400px] box, which is a viewport overlay rather than a layout column.
 * It only avoids colliding with the India Investments article because that page
 * constrains its body to max-w-4xl, leaving a ~12px gap — measured, and far too
 * tight to rely on. On any page with a wider body the rail lands on top of the
 * breadcrumbs, H1 and prose. Its mobile bar also uses `-mx-4`, which is designed
 * to bleed into a Container's px-5 padding and overflows the document by 16px if
 * the parent has no padding.
 *
 * This component fixes both by construction:
 *  - `variant="rail"`   → renders nothing but a sticky <nav>; the PAGE owns the
 *                         grid column, so the TOC can never overlap anything.
 *  - `variant="inline"` → an in-flow disclosure that pushes content down. No
 *                         negative margins, no fixed/absolute positioning.
 *
 * ArticleToc is deliberately left untouched: India Investments depends on it.
 *
 * Sticky offset maths: the site header is `sticky top-0` and `h-16` (64px), and
 * globals.css sets `scroll-padding-top: 5rem` (80px) so anchors already clear it.
 * The rail uses `top-20` (80px) to match, and caps its height at
 * calc(100vh - 5rem - 2rem) so only the list scrolls — never the page.
 */
export interface TocItem {
  id: string;
  label: string;
}

/** Shared active-section tracking. Mirrors the header offset above. */
function useActiveSection(items: TocItem[]): string {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 },
    );
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el != null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

export function TocRail({ items }: { items: TocItem[] }) {
  const activeId = useActiveSection(items);

  return (
    <nav
      aria-label="On this page"
      data-toc
      className="sticky top-20 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-2xl border border-ink-900/10 bg-white/95 p-3 [scrollbar-width:thin]"
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
                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-[0.8125rem] leading-snug transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  active
                    ? "bg-brand-50 font-bold text-brand-800"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`}
              >
                {/* Active state is carried by weight + the ▸ marker + aria-current,
                    never by colour alone. */}
                <span aria-hidden className="mt-[0.3rem] flex-none text-[0.5rem]">
                  {active ? "▸" : "·"}
                </span>
                <span className="min-w-0 break-words">{it.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TocInline({ items }: { items: TocItem[] }) {
  const activeId = useActiveSection(items);
  const [open, setOpen] = useState(false);
  const activeLabel = items.find((i) => i.id === activeId)?.label ?? items[0]?.label ?? "";

  return (
    <nav
      aria-label="On this page"
      data-toc
      className="rounded-2xl border border-ink-900/10 bg-white print:hidden"
    >
      <button
        type="button"
        data-toc-toggle
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="gb-toc-panel"
        className="flex min-h-[44px] w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm font-semibold text-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden>☰</span>
          <span className="flex-none">On this page</span>
          <span className="truncate font-normal text-ink-400">· {activeLabel}</span>
        </span>
        <span aria-hidden className={`flex-none transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {/*
        The closed panel must occupy ZERO layout height and must not be
        announced — so it is display:none, not a zero-opacity container.

        CAREFUL: the `hidden` attribute ALONE does not achieve that here.
        Tailwind's preflight ships
            [hidden]:where(:not([hidden="until-found"])) { display: none }
        whose `:where()` contributes zero specificity, so it ties with
        `.grid { display: grid }` — and `.grid` is emitted later in the
        stylesheet, so `.grid` wins and the panel stays open forever. (Measured:
        a 464px permanently-expanded panel that screenshots happily hid.)
        The class is therefore toggled explicitly; the attribute is kept for
        semantics.
      */}
      <ul
        id="gb-toc-panel"
        hidden={!open}
        className={`${
          open ? "grid" : "hidden"
        } max-h-[55vh] grid-cols-1 gap-0.5 overflow-y-auto overscroll-contain border-t border-ink-900/5 p-2 sm:grid-cols-2`}
      >
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={active ? "location" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  active ? "bg-brand-50 font-bold text-brand-800" : "text-ink-600 hover:bg-ink-50"
                }`}
              >
                {active && (
                  <span aria-hidden className="mr-1 text-[0.5rem]">
                    ▸
                  </span>
                )}
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Back-to-top, kept out of the TOC so it never affects the rail's layout. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 bg-white text-lg text-ink-700 shadow-card transition hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 print:hidden ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
