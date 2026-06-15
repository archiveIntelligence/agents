import type { ProductHighlight } from "@/lib/types";

// Lightweight inline-SVG glyphs (no icon-font dependency). Each key maps to a
// 20×20 stroke icon drawn with currentColor so it inherits the brand tone.
function HighlightIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "flex-none",
  };
  switch (name) {
    case "receptor":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="3" />
          <path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.4 4.4l2.1 2.1M13.5 13.5l2.1 2.1M15.6 4.4l-2.1 2.1M6.5 13.5l-2.1 2.1" />
        </svg>
      );
    case "molecule":
      return (
        <svg {...common}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="15" cy="7" r="2" />
          <circle cx="10" cy="15" r="2" />
          <path d="M6.6 7.3l2.1 6M13.6 8.4l-2.6 5M6.8 6.3l6.4 .6" />
        </svg>
      );
    case "pathway":
      return (
        <svg {...common}>
          <path d="M3 15c3 0 3-10 7-10s4 10 7 10" />
          <circle cx="3" cy="15" r="1.3" />
          <circle cx="17" cy="15" r="1.3" />
        </svg>
      );
    case "purity":
      return (
        <svg {...common}>
          <path d="M10 2l6 2.5v4c0 4-2.7 7-6 9-3.3-2-6-5-6-9v-4z" />
          <path d="M7.3 10l2 2 3.6-3.8" />
        </svg>
      );
    case "vial":
      return (
        <svg {...common}>
          <path d="M7 2h6M8 2v4.5L6.2 9.4A3 3 0 0 0 8.7 14h2.6a3 3 0 0 0 2.5-4.6L12 6.5V2" />
          <path d="M6.6 11h6.8" />
        </svg>
      );
    case "snowflake":
      return (
        <svg {...common}>
          <path d="M10 2v16M3 6l14 8M17 6L3 14" />
          <path d="M10 5.5L8 4M10 5.5L12 4M10 14.5L8 16M10 14.5L12 16" />
        </svg>
      );
    case "blend":
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="4" />
          <circle cx="13" cy="12" r="4" />
        </svg>
      );
    case "copper":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="3" />
          <path d="M10 1v2.5M10 16.5V19M1 10h2.5M16.5 10H19M3.8 3.8l1.8 1.8M14.4 14.4l1.8 1.8" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M11 2L4 11h5l-1 7 7-9h-5z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M4 16c0-7 5-12 12-12 0 7-5 12-12 12z" />
          <path d="M4 16C8 12 11 9 14 7" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M8 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 4 3M12 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-4 3" />
          <path d="M10 4v12" />
        </svg>
      );
    case "sleep":
      return (
        <svg {...common}>
          <path d="M16 11A6 6 0 1 1 9 4a4.5 4.5 0 0 0 7 7z" />
          <path d="M13 3h3l-3 3h3" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...common}>
          <path d="M10 2.5C13 6 15 8.6 15 11.5a5 5 0 0 1-10 0C5 8.6 7 6 10 2.5z" />
        </svg>
      );
    case "water":
      return (
        <svg {...common}>
          <path d="M3 12c1.5 0 1.5 1.5 3 1.5S9.5 12 11 12s1.5 1.5 3 1.5S15.5 12 17 12" />
          <path d="M3 8c1.5 0 1.5 1.5 3 1.5S9.5 8 11 8s1.5 1.5 3 1.5S15.5 8 17 8" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M10 2l6 2.5v4c0 4-2.7 7-6 9-3.3-2-6-5-6-9v-4z" />
        </svg>
      );
    case "flask":
      return (
        <svg {...common}>
          <path d="M8 2v5L4 15a2 2 0 0 0 1.8 3h8.4A2 2 0 0 0 16 15L12 7V2M7 2h6" />
          <path d="M6.5 12h7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="2.5" />
        </svg>
      );
  }
}

/** Skimmable buzzword bullets shown at the top of the PDP. */
export function ProductHighlights({ highlights }: { highlights: ProductHighlight[] }) {
  if (!highlights || highlights.length === 0) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Key highlights">
      {highlights.map((h) => (
        <li
          key={h.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 shadow-soft"
        >
          <span className="text-brand-600">
            <HighlightIcon name={h.icon} />
          </span>
          {h.label}
        </li>
      ))}
    </ul>
  );
}
