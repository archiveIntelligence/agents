"use client";

import { useMemo, useSyncExternalStore } from "react";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";
import { priceCart, type PriceBreakdown } from "./pricing";

const STORAGE_KEY = "vp.cart.v1";

export interface CartItem {
  slug: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
}

// --- External store (idiomatic localStorage sync, no setState-in-effect) ---

const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw) as CartItem[];
  } catch {
    // ignore malformed storage
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage may be unavailable (private mode, quota)
  }
}

function emit() {
  for (const l of listeners) l();
}

function setItems(next: CartItem[]) {
  items = next;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      try {
        items = e.newValue ? (JSON.parse(e.newValue) as CartItem[]) : [];
      } catch {
        items = [];
      }
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => items;
const getServerSnapshot = () => EMPTY;

// Mutations (module-level so they are stable references).
function add(slug: string, quantity = 1) {
  const existing = items.find((i) => i.slug === slug);
  setItems(
    existing
      ? items.map((i) => (i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i))
      : [...items, { slug, quantity }],
  );
}

function setQuantity(slug: string, quantity: number) {
  setItems(
    quantity <= 0
      ? items.filter((i) => i.slug !== slug)
      : items.map((i) => (i.slug === slug ? { ...i, quantity } : i)),
  );
}

function remove(slug: string) {
  setItems(items.filter((i) => i.slug !== slug));
}

function clear() {
  setItems([]);
}

// --- Hook & passthrough provider ---

function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export interface CartApi {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  breakdown: PriceBreakdown;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  ready: boolean;
}

/** Provider is a passthrough; the store lives at module scope. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCart(): CartApi {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const lines = useMemo<CartLine[]>(
    () =>
      current
        .map((i) => {
          const product = productBySlug(i.slug);
          return product ? { ...i, product } : null;
        })
        .filter((l): l is CartLine => l !== null),
    [current],
  );

  const breakdown = useMemo(
    () => priceCart(lines.map((l) => ({ priceCents: l.product.priceCents, quantity: l.quantity }))),
    [lines],
  );

  return {
    items: current,
    lines,
    count: breakdown.itemCount,
    breakdown,
    add,
    setQuantity,
    remove,
    clear,
    ready: current !== EMPTY || loaded,
  };
}
