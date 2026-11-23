import type { Product } from "./mock";

export interface InventoryRow {
  id: string;
  price: number;
  stock: number;
}

/** Low-stock threshold used for the warning label. */
export const LOW_STOCK = 5;

const clean = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function parseNumber(raw: string): number | null {
  const n = Number(raw.replace(/[₪\s]/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Parses rows pasted from Excel: "name <tab> price <tab> quantity" (commas or semicolons also
 * work when no tab is present). Rows are matched by product id, Hebrew name or English name.
 * Unknown names and invalid numbers are skipped, so a bad row never breaks the rest.
 */
export function parsePastedRows(text: string, list: Product[]): InventoryRow[] {
  const byKey = new Map<string, Product>();
  for (const p of list) {
    byKey.set(clean(p.id), p);
    byKey.set(clean(p.name[0]), p);
    byKey.set(clean(p.name[1]), p);
  }
  const rows: InventoryRow[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = (line.includes("\t") ? line.split("\t") : line.includes(";") ? line.split(";") : line.split(",")).map((c) => c.trim());
    const [name, priceRaw, stockRaw] = cells;
    const product = name ? byKey.get(clean(name)) : undefined;
    const price = priceRaw ? parseNumber(priceRaw) : null;
    const stock = stockRaw ? parseNumber(stockRaw) : null;
    if (!product || price === null || stock === null || !Number.isInteger(stock)) continue;
    rows.push({ id: product.id, price, stock });
  }
  return rows;
}

/** UTF-8 CSV with a BOM so Excel shows Hebrew correctly. */
export function toCsv(list: Product[], prices: Record<string, number>, stock: Record<string, number>): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [["id", "name", "price", "stock"].map(esc).join(",")];
  for (const p of list) {
    lines.push([p.id, p.name[0], prices[p.id] ?? p.price, stock[p.id] ?? p.stock].map(esc).join(","));
  }
  return "﻿" + lines.join("\r\n");
}
