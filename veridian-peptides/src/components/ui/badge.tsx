import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "ok" | "warn" | "off" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-800",
  accent: "bg-accent-100 text-accent-800",
  ok: "bg-brand-100 text-brand-700",
  warn: "bg-amber-100 text-amber-800",
  off: "bg-ink-200 text-ink-600",
  neutral: "bg-surface-muted text-muted-foreground",
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
