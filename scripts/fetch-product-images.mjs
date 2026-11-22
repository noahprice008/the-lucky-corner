#!/usr/bin/env node
// Downloads real product photos (Open Food Facts, CC BY-SA) for the barcodes listed in
// src/data/product-barcodes.json into public/images/products/<barcode>.jpg.
// - Safe to run any time: existing files are skipped, every failure is non-fatal (exit 0).
// - The site falls back to illustrated icons for any photo that is missing.
// Run manually: node scripts/fetch-product-images.mjs
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images", "products");
const map = JSON.parse(await readFile(join(root, "src", "data", "product-barcodes.json"), "utf8"));
const codes = [...new Set(Object.entries(map).filter(([k]) => !k.startsWith("_")).map(([, v]) => v))];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const started = Date.now();
const exists = (p) => access(p).then(() => true, () => false);

async function get(url, as, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "LuckyCornerDemo/1.0 (product photo fetch)" },
      });
      if (res.ok) return as === "json" ? await res.json() : Buffer.from(await res.arrayBuffer());
      if (res.status === 429 || res.status >= 500) await sleep(2000 * (i + 1));
      else return null;
    } catch {
      await sleep(1000);
    }
  }
  return null;
}

try {
  await mkdir(outDir, { recursive: true });
  const credits = [];
  let misses = 0;
  for (const code of codes) {
    if (Date.now() - started > 90000) break; // never hold up a deploy for long
    const file = join(outDir, `${code}.jpg`);
    if (await exists(file)) continue;
    const meta = await get(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=image_front_small_url,product_name`, "json");
    const small = meta?.product?.image_front_small_url;
    if (!small) {
      console.log(`skip ${code}: no photo`);
      if (++misses >= 3 && credits.length === 0) {
        console.log("Open Food Facts looks unreachable from here; keeping illustrated icons.");
        break;
      }
      continue;
    }
    const img = (await get(small.replace(".200.", ".400."))) ?? (await get(small));
    if (!img) {
      console.log(`skip ${code}: download failed`);
      continue;
    }
    await writeFile(file, img);
    credits.push(`${code} ${meta.product.product_name ?? ""}`.trim());
    console.log(`ok ${code}`);
    await sleep(1200); // stay under Open Food Facts' anonymous rate limit
  }
  if (credits.length) {
    await writeFile(
      join(outDir, "CREDITS.txt"),
      "Product photos from Open Food Facts contributors, licensed CC BY-SA 4.0 (https://world.openfoodfacts.org).\nPackaging and brand names belong to their owners; demo use only.\n" + credits.join("\n") + "\n",
      { flag: "a" },
    );
  }
} catch (e) {
  console.log("fetch-product-images: skipped (" + (e instanceof Error ? e.message : e) + ")");
}
process.exit(0);
