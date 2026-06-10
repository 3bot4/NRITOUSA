/**
 * Tiny inline-SVG sparkline of a cutoff's historical movement.
 * Takes pre-expanded { month, value } points (value = month index of the
 * cutoff, null where Current / no data) from lib/visa-bulletin expandSeries.
 */
export default function Sparkline({
  points,
  width = 160,
  height = 36,
  stroke = "#10b981",
  className = "",
  label = "Cutoff movement over time",
}: {
  points: { month: string; value: number | null }[];
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
  label?: string;
}) {
  const vals = points.filter(
    (p): p is { month: string; value: number } => p.value !== null
  );
  if (vals.length < 2) return null;

  const min = Math.min(...vals.map((p) => p.value));
  const max = Math.max(...vals.map((p) => p.value));
  const span = max - min || 1;
  const pad = 3;

  const path = points
    .map((p, i) => {
      if (p.value === null) return null;
      const x = pad + (i / (points.length - 1)) * (width - pad * 2);
      const y =
        height - pad - ((p.value - min) / span) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className={className}
    >
      <polyline
        points={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
