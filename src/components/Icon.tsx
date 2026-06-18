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
  | "check"
  | "user"
  | "users"
  | "pen"
  | "star"
  | "megaphone"
  | "linkedin"
  | "mail"
  | "plane-arrival"
  | "id-badge"
  | "chart-arrows"
  | "home-move"
  | "shield-check";

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
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 21c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M17.5 15.2c2.6.5 4 2.4 4 5.3" />
    </>
  ),
  pen: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />,
  star: (
    <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
  ),
  megaphone: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M18 8a4 4 0 0 1 0 8" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  "plane-arrival": (
    <>
      <path d="M3 21h18" />
      <path d="M6 16.5l13-2.4a1.7 1.7 0 0 0-.5-3.3l-3.3.4-5-5.2-2 .3 2.6 5.7-3.7.5-1.8-2-1.5.3 1.4 4.3z" />
    </>
  ),
  "id-badge": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3h6v2.5H9z" />
      <circle cx="12" cy="11" r="2.2" />
      <path d="M8.5 17.5c.5-1.7 1.9-2.6 3.5-2.6s3 .9 3.5 2.6" />
    </>
  ),
  "chart-arrows": (
    <>
      <path d="M4 5v14h16" />
      <path d="M7 15l3.5-4 3 2.5L20 7" />
      <path d="M16 7h4v4" />
    </>
  ),
  "home-move": (
    <>
      <path d="M3 10.5L11 3l8 7.5" />
      <path d="M5 9.5V21h7" />
      <path d="M9 21v-6h4v3" />
      <path d="M15 18h6M18 15l3 3-3 3" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
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
