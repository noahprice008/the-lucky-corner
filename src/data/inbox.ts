import type { Order } from "./mock";

// Internal messaging: every message belongs to an order. Replaced by the database later.
export interface InboxMessage {
  id: string;
  orderId: string;
  from: "customer" | "store" | "system";
  text: string;
  /** ISO timestamp. */
  at: string;
  /** Read by the store team. Customer-bound messages are always created read. */
  read: boolean;
}

export function sampleMessages(orders: Order[], now: Date = new Date()): InboxMessage[] {
  const at = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60000).toISOString();
  const [a, b] = orders;
  if (!a || !b) return [];
  return [
    { id: "m1", orderId: a.id, from: "system", text: "Order received", at: at(50), read: true },
    { id: "m2", orderId: b.id, from: "system", text: "Order received", at: at(30), read: true },
    { id: "m3", orderId: b.id, from: "customer", text: "אפשר לאסוף קצת מוקדם יותר?", at: at(12), read: false },
  ];
}

export const unreadCount = (list: InboxMessage[]) =>
  list.filter((m) => m.from === "customer" && !m.read).length;
