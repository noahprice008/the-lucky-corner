import type { Lang } from "./translations";

// Languages offered in the header dropdown, in display order. Hebrew is the default.
// To add one: extend `Lang` in translations.ts, add a pack in src/data/lang/, register it in
// src/data/lang/index.ts, then add an entry here.
export const languages: { code: Lang; label: string; dir: "rtl" | "ltr"; locale: string }[] = [
  { code: "he", label: "עברית", dir: "rtl", locale: "he-IL" },
  { code: "ru", label: "Русский", dir: "ltr", locale: "ru-RU" },
  { code: "fr", label: "Français", dir: "ltr", locale: "fr-FR" },
  { code: "ar", label: "العربية", dir: "rtl", locale: "ar" },
  { code: "hi", label: "हिन्दी", dir: "ltr", locale: "hi-IN" },
  { code: "en", label: "English", dir: "ltr", locale: "en-GB" },
];
const FALLBACK = { code: "he" as Lang, label: "עברית", dir: "rtl" as const, locale: "he-IL" };
export const langInfo = (code: Lang) => languages.find((l) => l.code === code) ?? FALLBACK;
