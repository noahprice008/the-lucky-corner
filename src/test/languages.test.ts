import { describe, expect, it } from "vitest";
import { languages } from "@/data/languages";
import { packs, translatePair } from "@/data/lang";
import { copy, categoryText, productText, noticeText } from "@/data/translations";
import { categories, products } from "@/data/mock";
import { slotsPerWindow } from "./helpers";

describe("languages", () => {
  it("lists Hebrew first and English last, with right-to-left for Hebrew and Arabic", () => {
    expect(languages.map((l) => l.code)).toEqual(["he", "ru", "fr", "ar", "hi", "en"]);
    expect(languages.filter((l) => l.dir === "rtl").map((l) => l.code)).toEqual(["he", "ar"]);
  });
  it.each(Object.keys(packs) as (keyof typeof packs)[])("%s pack covers every string", (code) => {
    const pack = packs[code];
    for (const key of Object.keys(copy) as (keyof typeof copy)[]) {
      expect(pack.copy[key], `${code}.${key}`).toBeTruthy();
    }
    expect(pack.categories).toHaveLength(categoryText.length);
    expect(pack.products).toHaveLength(productText.length);
    expect(pack.notices).toHaveLength(noticeText.length);
    expect(pack.copy.monthly.split(",")).toHaveLength(5);
  });
  it("translates by language and falls back to English for unknown text", () => {
    expect(translatePair("he", copy.home)).toBe("בית");
    expect(translatePair("en", copy.home)).toBe("Home");
    expect(translatePair("ru", copy.home)).toBe(packs.ru.copy.home);
    expect(translatePair("ar", ["שלום", "Unlisted text"])).toBe("Unlisted text");
  });
  it("translates product names through tr()", () => {
    const p = products[0]!;
    expect(translatePair("fr", p.name)).toBe(packs.fr.products[0]);
  });
});

describe("client answers", () => {
  it("does not sell lottery items", () => {
    expect(categories.some((c) => c.name[1].includes("Lottery"))).toBe(false);
    expect(products.some((p) => p.name[1].toLowerCase().includes("lottery") || p.name[1].toLowerCase().includes("scratch"))).toBe(false);
  });
  it("allows up to 5 orders per half-hour window", () => {
    expect(slotsPerWindow()).toEqual({ capacity: 5, minutes: 30 });
  });
});
