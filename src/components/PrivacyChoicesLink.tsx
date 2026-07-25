"use client";

import { cmpActive, openPrivacyChoices } from "@/lib/consent";

/**
 * Footer "Privacy choices" item — reopens the active CMP's preference
 * center. Renders nothing until a real CMP is configured in
 * src/lib/consent.ts: a visible link to a non-functional action is worse
 * than no link at all.
 */
export default function PrivacyChoicesLink() {
  if (!cmpActive) return null;

  return (
    <li>
      <button
        type="button"
        onClick={openPrivacyChoices}
        className="text-sm text-ink-500 transition-colors hover:text-brand-600"
      >
        Privacy choices
      </button>
    </li>
  );
}
