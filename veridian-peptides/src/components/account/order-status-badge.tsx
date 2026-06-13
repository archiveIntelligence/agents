import { Badge } from "@/components/ui/badge";

const map: Record<string, { label: string; tone: "ok" | "warn" | "off" | "brand" }> = {
  PENDING_PAYMENT: { label: "Awaiting payment", tone: "warn" },
  PAID: { label: "Paid", tone: "ok" },
  FULFILLED: { label: "Shipped", tone: "brand" },
  CANCELLED: { label: "Cancelled", tone: "off" },
  REFUNDED: { label: "Refunded", tone: "off" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const entry = map[status] ?? { label: status, tone: "off" as const };
  return <Badge tone={entry.tone}>{entry.label}</Badge>;
}
