"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Form state synced to the URL query string, so a copied/shared link reopens
 * the calculator with the same inputs and results.
 *
 * - Hydrates from the query string once on mount.
 * - Writes changed fields back to the URL (debounced, replaceState — no history
 *   spam). Only fields that differ from defaults are written, keeping links short.
 * - All values are strings (matching the calculators' input state). Non-sensitive
 *   by design: only the calculator inputs the user typed, never anything else.
 */
export function useUrlState<T extends Record<string, string>>(
  defaults: T
): [T, (key: keyof T, value: string) => void] {
  const [state, setState] = useState<T>(defaults);
  const defaultsRef = useRef(defaults);

  // Hydrate from URL once.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const next = { ...defaultsRef.current };
    let changed = false;
    for (const key in defaultsRef.current) {
      const v = sp.get(key);
      if (v !== null) {
        next[key] = v as T[typeof key];
        changed = true;
      }
    }
    if (changed) setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync to URL (debounced).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      for (const key in state) {
        if (state[key] !== defaultsRef.current[key]) sp.set(key, state[key]);
      }
      const qs = sp.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`
      );
    }, 400);
    return () => clearTimeout(t);
  }, [state]);

  const set = (key: keyof T, value: string) =>
    setState((s) => ({ ...s, [key]: value }));

  return [state, set];
}
