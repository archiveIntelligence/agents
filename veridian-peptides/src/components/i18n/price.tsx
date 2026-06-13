"use client";

import { useCurrency } from "./currency-provider";

/**
 * Renders an EUR-denominated cent amount in the user's chosen display
 * currency. A client island so it updates instantly when the currency
 * changes, while server components stay simple.
 */
export function Price({
  cents,
  className,
  strike,
}: {
  cents: number;
  className?: string;
  strike?: boolean;
}) {
  const { format } = useCurrency();
  return (
    <span className={`${strike ? "text-muted-foreground line-through" : ""} ${className ?? ""}`}>
      {format(cents)}
    </span>
  );
}
