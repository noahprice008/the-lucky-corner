import type { Lang } from "./translations";

// Languages offered in the header dropdown. To add one later: extend `Lang`
// in translations.ts, add the copy column, then add an entry here.
export const languages: { code: Lang; label: string; dir: "rtl" | "ltr" }[] = [
  { code: "he", label: "עברית", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
];
