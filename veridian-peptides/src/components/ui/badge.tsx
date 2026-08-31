import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "ok" | "warn" | "off" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200",
  accent: "bg-accent-50 text-accent-800 ring-1 ring-inset ring-accent-200",
  ok: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200",
  warn: "bg-gold-100 text-gold-600 ring-1 ring-inset ring-gold-200",
  off: "bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200",
  neutral: "bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
