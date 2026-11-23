import type { CopyKey } from "../translations";

/** One complete translation pack. Hebrew and English live in translations.ts. */
export interface LangPack {
  copy: Record<CopyKey, string>;
  /** Same order as `categoryText`. */
  categories: string[];
  /** Same order as `productText`. */
  products: string[];
  /** Same order as `noticeText`. */
  notices: { title: string; body: string }[];
  description: string;
}
