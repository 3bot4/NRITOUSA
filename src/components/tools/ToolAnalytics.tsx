"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  trackToolView,
  trackToolFirstInteraction,
} from "@/lib/analytics";

/**
 * Invisible client beacon mounted by ToolFirstLayout.
 *
 * - Fires `tool_view` once when the tool page mounts.
 * - Fires `tool_first_interaction` once on the user's first input gesture
 *   (pointer / key / form change) anywhere on the page.
 *
 * Only the tool slug and route path are sent — never any entered value.
 * Safely no-ops when GA isn't loaded (dev / blocked analytics).
 */
export default function ToolAnalytics({ toolSlug }: { toolSlug: string }) {
  const pathname = usePathname();
  const interacted = useRef(false);

  useEffect(() => {
    const route = pathname ?? undefined;
    trackToolView({ tool_slug: toolSlug, route });

    const onFirst = () => {
      if (interacted.current) return;
      interacted.current = true;
      trackToolFirstInteraction({ tool_slug: toolSlug, route });
      remove();
    };
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "change",
    ];
    const remove = () =>
      events.forEach((e) => window.removeEventListener(e, onFirst));
    events.forEach((e) =>
      window.addEventListener(e, onFirst, { passive: true })
    );
    return remove;
    // toolSlug/pathname are stable for a given page render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolSlug, pathname]);

  return null;
}
