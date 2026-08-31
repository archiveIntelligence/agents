// VERUM Biolabs logomark — original artwork, drawn as SVG.
// Concept B "Molecular V": a "V" built from a peptide-bond chain with atom nodes,
// meeting at a highlighted vertex. "Verum" = Latin for "true". Uses brand tokens
// so it themes cleanly (light/dark, on emerald). Keep this in sync with the favicon
// at src/app/icon.svg (same glyph, concrete colours).

export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="VERUM Biolabs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="vr-mol" x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-500)" />
          <stop offset="1" stopColor="var(--color-brand-700)" />
        </linearGradient>
      </defs>
      {/* peptide-bond chain forming the V */}
      <path
        d="M9 8 20 31 31 8"
        stroke="url(#vr-mol)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* atom nodes */}
      <circle cx="9" cy="8" r="3.4" fill="var(--color-brand-500)" />
      <circle cx="31" cy="8" r="3.4" fill="var(--color-brand-500)" />
      <circle cx="20" cy="31" r="4" fill="var(--color-brand-700)" />
      <circle cx="20" cy="31" r="1.6" fill="white" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoGlyph className="h-8 w-8 shrink-0" />
      <span className="font-display text-xl tracking-tight">
        <span className="tracking-[0.12em] uppercase">Verum</span>
        <span className="text-brand-700"> Biolabs</span>
      </span>
    </span>
  );
}
