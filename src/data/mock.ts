import {
  categoryText,
  productText,
  productDescription,
  noticeText,
  type Bilingual,
} from "./translations";
import { getSlots } from "./slots";
// Category: numeric ID, bilingual name, visual placeholder, adult flag.
export const categories = categoryText.map((name, id) => ({
  id,
  name,
  emoji: ["🥨", "🧃", "🥛", "🧼", "📚", "☕", "🍺", "🍷", "🥃", "🎟️"][id] ?? "🛒",
  isAdult18: id >= 6,
}));
// Product: stable ID, bilingual title/description, category, NIS price, stock, adult and out-of-stock flags.
export interface Product {
  id: string;
  name: Bilingual;
  description: Bilingual;
  category: number;
  price: number;
  stock: number;
  isAdult18: boolean;
  isOutOfStock: boolean;
  emoji: string;
}
const prices = [
  7.9, 8.5, 12.9, 3.5, 6.2, 7.5, 6, 3.5, 24.9, 9, 19, 69, 10, 9.9, 8.9, 5.5, 9.9, 4.9, 14.9, 11.9,
  12.9, 14.9, 2.5, 7, 8, 15, 59, 79, 129, 12, 16, 6.9,
];
const cats = [
  0, 0, 1, 1, 2, 2, 4, 4, 3, 5, 6, 7, 9, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 8, 9, 4, 0,
];
const emojis = [
  "🥨",
  "🥔",
  "🍊",
  "💧",
  "🥛",
  "🧀",
  "📓",
  "🖊️",
  "🧻",
  "☕",
  "🍺",
  "🍷",
  "🎟️",
  "🥨",
  "🍫",
  "🫧",
  "🍋",
  "🥣",
  "🧀",
  "🧴",
  "🧼",
  "✏️",
  "◻️",
  "☕",
  "🍵",
  "🍺",
  "🥂",
  "🍸",
  "🥃",
  "🎫",
  "📚",
  "🌽",
];
export const products: Product[] = productText.map((name, i) => ({
  id: `p${i + 1}`,
  name,
  description: productDescription,
  category: cats[i] ?? 0,
  price: prices[i] ?? 10,
  stock: i === 18 || i === 28 ? 0 : 24 + i,
  isAdult18: (cats[i] ?? 0) >= 6,
  isOutOfStock: i === 18 || i === 28,
  emoji: emojis[i] ?? "🛍️",
}));
// Notice: stable ID, translated content, filter type and active date range.
export interface Notice {
  id: string;
  title: Bilingual;
  body: Bilingual;
  type: "specials" | "news" | "school";
  from: string;
  until: string;
}
export const notices: Notice[] = noticeText.map((n, i) => ({
  ...n,
  id: `n${i}`,
  type: i === 1 ? "school" : i === 3 ? "news" : "specials",
  from: "2026-11-01",
  until: "2026-12-31",
}));
// User: local-demo profile only; role is a navigation preview, not security.
export interface DemoUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  role: "customer" | "owner" | "staff";
}
export const users: DemoUser[] = Array.from({ length: 6 }, (_, i) => ({
  id: `u${i}`,
  name: ["נועה לוי", "איתי כהן", "מאיה ישראלי", "דניאל דוד", "אור בן דוד", "רות לוי"][i] ?? "לקוח",
  phone: "0500000000",
  email: `demo${i}@example.test`,
  dob: i < 2 ? "2011-06-10" : "1990-03-15",
  role: "customer",
}));
// Order: stable number, line items, pickup ISO window, NIS total, order status.
export interface Order {
  id: string;
  items: { productId: string; qty: number }[];
  slot: { start: string; end: string };
  total: number;
  status: "received" | "preparing" | "ready" | "picked";
}
export function sampleOrders(now: Date = new Date()): Order[] {
  const slots = getSlots(now).filter(
    (s) => !s.full && new Date(s.start).getTime() >= now.getTime() + 900000,
  );
  return Array.from({ length: 8 }, (_, i) => {
    const slot = slots[Math.min(i < 2 ? i : i * 50, slots.length - 1)];
    return {
      id: `104${i + 1}`,
      items: [
        { productId: `p${i + 1}`, qty: 2 },
        { productId: i % 2 ? "p11" : "p9", qty: 1 },
      ],
      slot: { start: slot?.start ?? now.toISOString(), end: slot?.end ?? now.toISOString() },
      total: 39.8 + i * 7,
      status: i < 2 ? "ready" : i < 4 ? "preparing" : "received",
    };
  });
}
// KPI: mock numeric metrics and hourly/monthly chart series, replaceable with Excel rows.
export const kpis = {
  todayOrders: 24,
  revenue: 1486.5,
  users: 6,
  pending: 8,
  hours: [2, 4, 3, 7, 5, 3],
  monthly: [180, 240, 210, 320, 285],
};
