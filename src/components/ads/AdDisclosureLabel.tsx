interface AdDisclosureLabelProps {
  label?: "Advertisement" | "Sponsored links";
  className?: string;
}

/**
 * The only two labels this site uses above a manual ad placement. Never use
 * a misleading label like "Recommended", "Helpful resources", "Download", or
 * "Next step" — see the ad-placement policy in MONETIZATION_SETUP.md.
 */
export default function AdDisclosureLabel({
  label = "Advertisement",
  className = "",
}: AdDisclosureLabelProps) {
  return (
    <p
      className={`text-center text-[11px] font-semibold uppercase tracking-wide text-ink-400 ${className}`}
    >
      {label}
    </p>
  );
}
