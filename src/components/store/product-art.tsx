import { useState } from "react";
import type { Product } from "@/data/mock";

// Flat illustrated icons used when a real product photo is missing, so the grid never shows a broken image.
const ACCENTS = ["#e5483a", "#f0b429", "#3d8bd9", "#4cae6a", "#e86aa6", "#f08a3c", "#7b5bc4", "#1f9d8a"];

function Icon({ kind, c }: { kind: Product["kind"]; c: string }) {
  const dark = "#0000002e";
  const white = "#ffffffd9";
  switch (kind) {
    case "bag":
      return (
        <>
          <path d="M26 16h48l-4 8 4 8-4 8 4 8-4 8 4 8-4 8H26l4-8-4-8 4-8-4-8 4-8-4-8z" fill={c} />
          <rect x="34" y="38" width="32" height="26" rx="13" fill={white} />
          <path d="M26 16h48v6H26z" fill={dark} />
        </>
      );
    case "bottle":
      return (
        <>
          <rect x="43" y="10" width="14" height="10" rx="3" fill="#2d3a45" />
          <path d="M41 20h18v10c8 6 10 14 10 24v30a6 6 0 0 1-6 6H37a6 6 0 0 1-6-6V54c0-10 2-18 10-24z" fill={c} />
          <rect x="33" y="52" width="34" height="24" fill={white} />
        </>
      );
    case "carton":
      return (
        <>
          <path d="M30 34 50 20l20 14v54H30z" fill={c} />
          <path d="M30 34h40v8H30z" fill={dark} />
          <rect x="38" y="50" width="24" height="22" rx="4" fill={white} />
        </>
      );
    case "tub":
      return (
        <>
          <path d="M24 34h52l-5 52H29z" fill={c} />
          <rect x="22" y="24" width="56" height="12" rx="4" fill="#f4f4f4" />
          <rect x="34" y="50" width="32" height="22" rx="5" fill={white} />
        </>
      );
    case "tissue":
      return (
        <>
          <rect x="20" y="40" width="60" height="42" rx="10" fill={c} />
          <circle cx="40" cy="61" r="12" fill={white} />
          <circle cx="62" cy="61" r="12" fill={white} />
          <rect x="30" y="30" width="40" height="14" rx="6" fill="#f4f4f4" />
        </>
      );
    case "notebook":
      return (
        <>
          <rect x="26" y="14" width="48" height="72" rx="5" fill={c} />
          <rect x="22" y="20" width="8" height="60" rx="3" fill={dark} />
          <rect x="38" y="26" width="26" height="14" rx="3" fill={white} />
          <path d="M38 52h26M38 62h26M38 72h18" stroke={white} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "pen":
      return (
        <g transform="rotate(35 50 50)">
          <rect x="44" y="10" width="12" height="62" rx="5" fill={c} />
          <path d="M44 72h12l-6 16z" fill="#2d3a45" />
          <rect x="44" y="18" width="12" height="8" fill={dark} />
        </g>
      );
    case "cup":
      return (
        <>
          <path d="M26 30h40l-4 54H30z" fill="#fff6e6" stroke={c} strokeWidth="4" />
          <path d="M66 40h8a8 8 0 0 1 0 22h-9" fill="none" stroke={c} strokeWidth="5" />
          <path d="M28 40h36l-1 12H29z" fill={c} />
          <path d="M40 20c-4-5 4-7 0-12M52 20c-4-5 4-7 0-12" stroke="#b9b2a5" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case "beer":
      return (
        <>
          <rect x="44" y="10" width="12" height="8" rx="2" fill="#c9a24a" />
          <path d="M42 18h16v16c6 6 8 12 8 20v32a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V54c0-8 2-14 8-20z" fill="#7a3b12" />
          <rect x="36" y="54" width="28" height="26" fill="#f3d27a" />
        </>
      );
    case "wine":
      return (
        <>
          <rect x="45" y="8" width="10" height="12" rx="2" fill="#4a1a24" />
          <path d="M44 20h12v16c6 6 8 10 8 18v30a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6V54c0-8 2-12 8-18z" fill={c} />
          <rect x="38" y="58" width="24" height="20" rx="2" fill="#f8efdc" />
        </>
      );
    case "spirit":
      return (
        <>
          <rect x="42" y="8" width="16" height="12" rx="3" fill="#2d3a45" />
          <path d="M44 20h12v8l12 12v42a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V40l12-12z" fill={c} opacity=".92" />
          <rect x="36" y="48" width="28" height="26" rx="3" fill="#f8efdc" />
        </>
      );
    case "card":
      return (
        <>
          <rect x="14" y="26" width="72" height="48" rx="8" fill={c} />
          <circle cx="36" cy="50" r="10" fill={white} />
          <circle cx="58" cy="50" r="10" fill={white} />
          <circle cx="76" cy="50" r="6" fill="#ffd54f" />
          <text x="86" y="70" fontSize="9" fill={dark} />
        </>
      );
    case "bar":
      return (
        <>
          <rect x="16" y="34" width="68" height="34" rx="6" fill="#5a2a14" />
          <path d="M16 46h68M16 58h68M38 34v34M60 34v34" stroke="#00000033" strokeWidth="2" />
          <rect x="22" y="40" width="56" height="22" rx="4" fill={c} opacity=".9" />
        </>
      );
    case "pencils":
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${22 + i * 14} 12)`}>
              <rect width="10" height="62" rx="2" fill={ACCENTS[(i * 2) % 8]} />
              <path d="M0 62h10l-5 14z" fill="#f2d3a4" />
              <path d="M3.5 72.5h3l-1.5 3.5z" fill="#2d3a45" />
            </g>
          ))}
        </>
      );
    case "eraser":
      return (
        <>
          <rect x="22" y="38" width="56" height="28" rx="6" fill="#ffffff" stroke="#c9c9c9" strokeWidth="2" />
          <rect x="22" y="38" width="22" height="28" rx="6" fill={c} />
        </>
      );
    case "jar":
      return (
        <>
          <rect x="30" y="14" width="40" height="12" rx="4" fill="#c0392b" />
          <path d="M28 26h44v50a10 10 0 0 1-10 10H38a10 10 0 0 1-10-10z" fill={c} />
          <rect x="34" y="46" width="32" height="22" rx="4" fill={white} />
        </>
      );
    case "soap":
      return (
        <>
          <rect x="44" y="12" width="12" height="10" rx="3" fill="#2d3a45" />
          <path d="M40 22h20l6 14v46a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V36z" fill={c} />
          <circle cx="50" cy="60" r="12" fill={white} />
        </>
      );
    default:
      return (
        <>
          <rect x="24" y="18" width="52" height="66" rx="5" fill={c} />
          <rect x="30" y="30" width="40" height="30" rx="4" fill={white} />
          <circle cx="50" cy="45" r="9" fill="#f0b429" />
        </>
      );
  }
}

export function ProductImage({ product, className }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);
  const accent = ACCENTS[Number(product.id.slice(1)) % ACCENTS.length] ?? "#4cae6a";
  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt=""
        loading="lazy"
        decoding="async"
        className={className ?? "product-photo"}
        onError={() => setFailed(true)}
        ref={(el) => {
          // A server-rendered <img> can fail before React attaches onError.
          if (el && el.complete && el.naturalWidth === 0) setFailed(true);
        }}
      />
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={className ?? "product-photo"} aria-hidden="true">
      <ellipse cx="50" cy="90" rx="26" ry="4" fill="#00000018" />
      <Icon kind={product.kind} c={accent} />
    </svg>
  );
}

const CATEGORY_KINDS: Product["kind"][] = ["bag", "bottle", "carton", "soap", "notebook", "cup", "beer", "wine", "spirit", "card"];
export function CategoryArt({ id }: { id: number }) {
  return (
    <svg viewBox="0 0 100 100" className="category-icon" aria-hidden="true">
      <Icon kind={CATEGORY_KINDS[id] ?? "box"} c={ACCENTS[id % ACCENTS.length] ?? "#4cae6a"} />
    </svg>
  );
}
