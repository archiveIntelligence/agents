"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const KEY = "vp.cookie-consent";

// Persisted, hydration-safe consent flag via an external store.
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
const getSnapshot = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return "dismissed"; // fail closed: don't nag if storage is blocked
  }
};
const getServerSnapshot = () => "dismissed";

export function CookieConsent() {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (value) return null;

  const choose = (v: "accepted" | "essential") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      // ignore
    }
    // Notify this tab's subscribers (storage event only fires cross-tab).
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="container-px">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            We use essential cookies to run this site. See our{" "}
            <Link href="/legal/cookies" className="font-medium text-brand-600 hover:text-brand-700">
              cookie settings
            </Link>
            .
          </p>
          <div className="flex flex-none gap-2">
            <button
              onClick={() => choose("essential")}
              className="h-9 rounded-full border border-border px-4 text-sm hover:bg-surface-muted"
            >
              Essential only
            </button>
            <button
              onClick={() => choose("accepted")}
              className="h-9 rounded-full bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
