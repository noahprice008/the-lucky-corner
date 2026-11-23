import { describe, expect, it } from "vitest";
import { parsePastedRows, toCsv, LOW_STOCK } from "@/data/inventory";
import { sampleMessages, unreadCount } from "@/data/inbox";
import { products, sampleOrders } from "@/data/mock";

describe("inventory paste and export", () => {
  it("matches rows from Excel by Hebrew name, English name or id", () => {
    const he = products[0]!.name[0];
    const en = products[1]!.name[1];
    const rows = parsePastedRows(`${he}\t8.5\t40\n${en}\t₪9,9\t12\np3\t4\t0`, products);
    expect(rows).toEqual([
      { id: "p1", price: 8.5, stock: 40 },
      { id: "p2", price: 9.9, stock: 12 },
      { id: "p3", price: 4, stock: 0 },
    ]);
  });
  it("skips unknown products and invalid numbers without breaking other rows", () => {
    const rows = parsePastedRows("nope\t5\t5\np1\tabc\t5\np1\t5\t-2\np1\t5\t2.5\np2\t6\t7", products);
    expect(rows).toEqual([{ id: "p2", price: 6, stock: 7 }]);
  });
  it("exports UTF-8 with a BOM and one line per product", () => {
    const csv = toCsv(products, {}, {});
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv.split("\r\n")).toHaveLength(products.length + 1);
  });
  it("defines a low-stock threshold", () => expect(LOW_STOCK).toBeGreaterThan(0));
});

describe("inbox", () => {
  it("seeds messages for existing orders and counts unread customer messages", () => {
    const msgs = sampleMessages(sampleOrders());
    expect(msgs.length).toBeGreaterThan(0);
    expect(unreadCount(msgs)).toBe(1);
    expect(unreadCount(msgs.map((m) => ({ ...m, read: true })))).toBe(0);
  });
});
