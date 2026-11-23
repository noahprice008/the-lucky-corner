import { useMemo, useState } from "react";
import { Download, Search, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "./context";
import { products } from "@/data/mock";
import { LOW_STOCK, parsePastedRows, toCsv } from "@/data/inventory";

/** The owner's main inventory editor: edit price and stock inline, paste from Excel, export CSV. */
export function InventoryManager() {
  const { t, tr, stock, setStock, prices, setPrices, adultVisible, setAdultVisible, toast } = useStore();
  const [query, setQuery] = useState("");
  const [paste, setPaste] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => !q || p.name[0].toLowerCase().includes(q) || p.name[1].toLowerCase().includes(q) || tr(p.name).toLowerCase().includes(q),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const download = () => {
    const blob = new Blob([toCsv(products, prices, stock)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lucky-corner-inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const apply = () => {
    const parsed = parsePastedRows(paste, products);
    if (!parsed.length) {
      toast(t("inventoryNoMatch"));
      return;
    }
    setPrices((old) => ({ ...old, ...Object.fromEntries(parsed.map((r) => [r.id, r.price])) }));
    setStock((old) => ({ ...old, ...Object.fromEntries(parsed.map((r) => [r.id, r.stock])) }));
    setPaste("");
    setShowPaste(false);
    toast(`${parsed.length} ${t("inventoryApplied")}`);
  };
  return (
    <section className="section-divider inventory" id="inventory">
      <h2 className="text-xl font-bold">{t("inventoryTitle")}</h2>
      <p className="page-subtitle">{t("inventorySubtitle")}</p>
      <div className="inventory-tools">
        <label className="inventory-search">
          <Search size={16} aria-hidden />
          <input
            type="search"
            value={query}
            placeholder={t("inventorySearch")}
            aria-label={t("inventorySearch")}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Button variant="outline" onClick={() => setShowPaste((v) => !v)}>
          <ClipboardPaste />
          {t("inventoryPaste")}
        </Button>
        <Button variant="outline" onClick={download}>
          <Download />
          {t("inventoryExport")}
        </Button>
      </div>
      {showPaste && (
        <div className="inventory-paste">
          <p className="page-subtitle">{t("inventoryPasteHint")}</p>
          <textarea value={paste} rows={5} onChange={(e) => setPaste(e.target.value)} dir="auto" />
          <Button onClick={apply} disabled={!paste.trim()}>
            {t("inventoryApply")}
          </Button>
        </div>
      )}
      <label className="toggle-row">
        {t("adultVisibility")}
        <input type="checkbox" checked={adultVisible} onChange={(e) => setAdultVisible(e.target.checked)} />
      </label>
      <div className="inventory-table" role="table">
        <div className="inventory-head" role="row">
          <span role="columnheader">{t("title")}</span>
          <span role="columnheader">{t("inventoryPrice")}</span>
          <span role="columnheader">{t("inventoryStock")}</span>
        </div>
        {rows.map((p) => {
          const qty = stock[p.id] ?? 0;
          return (
            <div className="inventory-row" role="row" key={p.id}>
              <span role="cell">
                {tr(p.name)}
                {p.isAdult18 && <span className="red-flag"> 18+</span>}
                {qty === 0 ? (
                  <em className="inventory-flag out">{t("out")}</em>
                ) : qty <= LOW_STOCK ? (
                  <em className="inventory-flag low">{t("inventoryLow")}</em>
                ) : null}
              </span>
              <input
                role="cell"
                aria-label={`${t("inventoryPrice")} ${tr(p.name)}`}
                type="number"
                min={0}
                step="0.1"
                inputMode="decimal"
                value={prices[p.id] ?? p.price}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isFinite(n) && n >= 0) setPrices((old) => ({ ...old, [p.id]: n }));
                }}
              />
              <input
                role="cell"
                aria-label={`${t("inventoryStock")} ${tr(p.name)}`}
                type="number"
                min={0}
                inputMode="numeric"
                value={qty}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isInteger(n) && n >= 0) setStock((old) => ({ ...old, [p.id]: n }));
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
