"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-9 items-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
    >
      Cart
      {ready && count > 0 ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-brand-700">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
