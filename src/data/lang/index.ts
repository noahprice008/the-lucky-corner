import {
  copy,
  categoryText,
  productText,
  noticeText,
  productDescription,
  type Bilingual,
  type Lang,
} from "../translations";
import type { LangPack } from "./types";
import { ru } from "./ru";
import { fr } from "./fr";
import { ar } from "./ar";
import { hi } from "./hi";

export const packs: Record<Exclude<Lang, "he" | "en">, LangPack> = { ru, fr, ar, hi };

// Every Hebrew/English pair in the app is looked up by its English text, so the
// many `tr(...)` call sites keep working unchanged. Missing entries fall back to English.
const indexes = new Map<Lang, Map<string, string>>();
function build(lang: Exclude<Lang, "he" | "en">): Map<string, string> {
  const pack = packs[lang];
  const m = new Map<string, string>();
  for (const key of Object.keys(copy) as (keyof typeof copy)[]) m.set(copy[key][1], pack.copy[key]);
  categoryText.forEach((c, i) => pack.categories[i] && m.set(c[1], pack.categories[i]));
  productText.forEach((p, i) => pack.products[i] && m.set(p[1], pack.products[i]));
  noticeText.forEach((n, i) => {
    const t = pack.notices[i];
    if (t) {
      m.set(n.title[1], t.title);
      m.set(n.body[1], t.body);
    }
  });
  m.set(productDescription[1], pack.description);
  return m;
}

export function translatePair(lang: Lang, v: Bilingual): string {
  if (lang === "he") return v[0];
  if (lang === "en") return v[1] || v[0];
  let m = indexes.get(lang);
  if (!m) {
    m = build(lang);
    indexes.set(lang, m);
  }
  return m.get(v[1]) ?? (v[1] || v[0]);
}
