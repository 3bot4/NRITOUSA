/**
 * Tiny dependency-free line-icon set (24×24, currentColor) for product
 * surfaces — used instead of emoji-as-primary-icons. Not a full icon library;
 * just the handful the homepage needs. Color comes from the parent's text-*.
 */

export type IconName =
  | "calendar"
  | "passport"
  | "dollar"
  | "plane"
  | "clock"
  | "home"
  | "send"
  | "scale"
  | "flag"
  | "briefcase"
  | "arrow-right"
  | "share"
  | "download"
  | "link"
  | "check";

const PATHS: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
  passport: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 17h6" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 2v20M17 6.5C17 4.6 14.8 3.5 12 3.5S7 4.8 7 6.8s2 2.7 5 3.2 5 1.3 5 3.2-2.2 3.3-5 3.3-5-1.1-5-3" />
    </>
  ),
  plane: <path d="M21 15l-7-3V5a2 2 0 0 0-4 0v7l-7 3v2l7-2v3l-2 1.5V22l4-1 4 1v-1.5L17 19v-3l7 2z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  scale: (
    <>
      <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7h6l-3-7zM19 7l-3 7h6l-3-7z" />
    </>
  ),
  flag: <path d="M4 22V4s2-1 5-1 4 2 7 2 4-1 4-1v9s-2 1-4 1-4-2-7-2-5 1-5 1" />,
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  download: <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />,
  link: <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />,
  check: <path d="M20 6L9 17l-5-5" />,
};

export default function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
