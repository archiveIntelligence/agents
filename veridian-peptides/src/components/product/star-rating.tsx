// Presentational star rating. `value` 0–5 (supports fractional fill).

export function StarRating({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={`relative inline-flex align-middle ${className ?? ""}`}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <Stars size={size} color="var(--color-border)" />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <Stars size={size} color="var(--color-gold-500)" />
      </span>
    </span>
  );
}

function Stars({ size, color }: { size: number; color: string }) {
  return (
    <span className="flex flex-none" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.22 5.06 16.8l.94-5.5-4-3.9 5.53-.81L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
}
