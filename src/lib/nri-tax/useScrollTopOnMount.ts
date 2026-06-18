"use client";

import { useEffect } from "react";

/**
 * The organizer pages render a short "Loading…" state first, then swap in the
 * full content once localStorage is read. That async height change defeats the
 * browser's scroll restoration / router scroll-to-top, which can leave the page
 * at a non-zero offset with the page title tucked under the sticky header.
 *
 * Forcing an instant scroll to the top once on mount guarantees the title,
 * tabs, and buttons clear the sticky header on load and refresh. We temporarily
 * disable CSS smooth-scroll so this reset doesn't animate.
 */
export function useScrollTopOnMount() {
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    el.style.scrollBehavior = prev;
  }, []);
}
