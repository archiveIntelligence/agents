"use client";

// Mobile slide-out ("sandwich") menu. Hamburger button shown below lg; opens a
// drawer from the inline-end edge with the nav, language/currency switchers and
// the sign-in link. Closes on link tap, backdrop click or Escape.

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { CurrencySwitcher } from "@/components/i18n/currency-switcher";

export function MobileMenu({
  items,
  signInHref,
  signInLabel,
}: {
  items: { href: string; label: string }[];
  signInHref: string;
  signInLabel: string;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer (slides from the inline-end edge; RTL-aware via start-auto/end-0) */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 end-0 z-50 flex w-[82%] max-w-sm flex-col bg-surface shadow-lift transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <span className="eyebrow">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={signInHref}
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            {signInLabel}
          </Link>
        </nav>

        <div className="mt-auto flex items-center gap-3 border-t border-border px-5 py-4">
          <LanguageSwitcher />
          <CurrencySwitcher />
        </div>
      </aside>
    </div>
  );
}
