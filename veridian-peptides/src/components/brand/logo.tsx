// Veridian Peptides logomark — original artwork, drawn as SVG.
// A hexagonal "molecule" glyph with a verification check, paired with
// the wordmark. Uses currentColor / brand tokens so it themes cleanly.

export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Veridian Peptides"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vp-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-400)" />
          <stop offset="1" stopColor="var(--color-brand-600)" />
        </linearGradient>
      </defs>
      <path
        d="M20 2.5 34.5 11v18L20 37.5 5.5 29V11L20 2.5Z"
        fill="url(#vp-grad)"
      />
      <path
        d="M13.5 20.5l4.2 4.2 8.8-9"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoGlyph className="h-8 w-8" />
      <span className="font-display text-xl tracking-tight">
        Veridian<span className="text-brand-700"> Peptides</span>
      </span>
    </span>
  );
}
