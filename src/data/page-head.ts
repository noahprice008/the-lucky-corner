import { copy, type CopyKey } from "./translations";
export function pageHead(key: CopyKey) {
  const title = key === "home" ? "פינת המזל" : `${copy[key][0]} · פינת המזל`;
  const description = `${copy[key][1]} at The Lucky Corner, Or Akiva. Bilingual neighborhood store demo, self-pickup only.`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
