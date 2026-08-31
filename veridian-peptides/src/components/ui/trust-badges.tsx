import type { ReactNode } from "react";

// A single, consistent trust cluster reused near every conversion action
// (PDP buy box, cart, checkout). Benefit-led microcopy — what the buyer gets,
// not the internal artefact ("Independently verified purity" over "HPLC report").
// All claims are backed by real COA/shipping practice; nothing invented.

type Item = { label: string; icon: ReactNode };

const ITEMS: Item[] = [
  { label: "Independently verified purity", icon: <BeakerTick /> },
  { label: "Public batch certificate (COA)", icon: <DocTick /> },
  { label: "Encrypted, secure checkout", icon: <Lock /> },
  { label: "Tracked, discreet EU dispatch", icon: <Truck /> },
];

export function TrustBadges({
  variant = "grid",
  className = "",
}: {
  /** grid = two-column buy-box layout; list = single-column aside layout. */
  variant?: "grid" | "list";
  className?: string;
}) {
  return (
    <ul
      className={`${
        variant === "grid"
          ? "grid grid-cols-1 gap-2 sm:grid-cols-2"
          : "space-y-2"
      } text-sm ${className}`}
    >
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-muted-foreground">
          <span className="flex-none text-brand-700">{item.icon}</span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function BeakerTick() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="var(--color-brand-100)" />
      <path d="M4.5 8.2l2.2 2.2 4.8-4.9" stroke="var(--color-brand-700)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocTick() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3.5" y="2" width="9" height="12" rx="1.5" fill="var(--color-brand-100)" stroke="var(--color-brand-700)" strokeWidth="1.2" />
      <path d="M6 9l1.4 1.4L10 7.6" stroke="var(--color-brand-700)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="var(--color-brand-100)" stroke="var(--color-brand-700)" strokeWidth="1.2" />
      <path d="M5.2 7V5.3a2.8 2.8 0 0 1 5.6 0V7" stroke="var(--color-brand-700)" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function Truck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="4" width="8" height="6.5" rx="1" fill="var(--color-brand-100)" stroke="var(--color-brand-700)" strokeWidth="1.2" />
      <path d="M9.5 6.5h2.6L14 8.5v2H9.5z" fill="var(--color-brand-100)" stroke="var(--color-brand-700)" strokeWidth="1.2" />
      <circle cx="5" cy="11.5" r="1.4" fill="white" stroke="var(--color-brand-700)" strokeWidth="1.2" />
      <circle cx="11.5" cy="11.5" r="1.4" fill="white" stroke="var(--color-brand-700)" strokeWidth="1.2" />
    </svg>
  );
}
