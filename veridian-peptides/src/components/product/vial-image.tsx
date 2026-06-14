// Programmatic, labelled vial visual. Renders a consistent premium vial with
// the product name + size printed on the label — correct text every time,
// white powder for peptides and blue for the GHK-Cu copper complex.
//
// This is the "overlay" half of the hybrid image approach: when a photoreal
// base render is available (e.g. via the Nano Banana MCP) it can replace the
// SVG glass while the label text stays programmatic for pixel-perfect copy.

export function VialImage({
  name,
  size,
  className,
}: {
  name: string;
  size: string;
  className?: string;
}) {
  const blue = /ghk/i.test(name);
  const powderTop = blue ? "#bfe0ff" : "#fbfbf9";
  const powderBottom = blue ? "#5aa9f0" : "#e9e7df";
  const powderStroke = blue ? "#3f8fd8" : "#d8d6cc";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-surface to-ink-100 ${className ?? ""}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(13,111,80,0.10),transparent_60%)]" />
      <svg viewBox="0 0 200 240" className="relative h-[88%] w-auto drop-shadow-sm" role="img" aria-label={`${name} ${size} vial`}>
        <defs>
          <linearGradient id="vial-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#eef0f1" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="vial-powder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={powderTop} />
            <stop offset="1" stopColor={powderBottom} />
          </linearGradient>
        </defs>

        {/* Cap */}
        <rect x="74" y="6" width="52" height="22" rx="5" fill="var(--color-brand-700)" />
        <rect x="78" y="26" width="44" height="10" rx="3" fill="var(--color-brand-800)" />
        {/* Neck */}
        <rect x="84" y="34" width="32" height="14" fill="url(#vial-glass)" stroke="#dde1e3" strokeWidth="1.5" />
        {/* Body */}
        <rect x="60" y="46" width="80" height="184" rx="14" fill="url(#vial-glass)" stroke="#d3d7d9" strokeWidth="2" />
        {/* Powder */}
        <path
          d="M64 196c0-4 0-6 2-8 14-7 54-7 68 0 2 2 2 4 2 8v18c0 6-4 12-12 12H76c-8 0-12-6-12-12v-18Z"
          fill="url(#vial-powder)"
          stroke={powderStroke}
          strokeWidth="1.5"
        />
        {/* Label */}
        <rect x="56" y="92" width="88" height="86" rx="8" fill="#ffffff" stroke="#e7e5dc" strokeWidth="1.5" />
        <rect x="56" y="92" width="88" height="14" rx="8" fill="var(--color-brand-700)" />
        <foreignObject x="56" y="108" width="88" height="68">
          <div
            // @ts-expect-error xmlns is valid on the div inside foreignObject
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              padding: "2px 5px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: name.length > 22 ? "8px" : "10px",
                lineHeight: 1.05,
                color: "#191916",
                fontWeight: 500,
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.04em",
                color: "var(--color-brand-700)",
                fontWeight: 600,
              }}
            >
              {size}
            </span>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
