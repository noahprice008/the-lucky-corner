import { ProductImage } from "./product-art";
import { useState, useEffect } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { Mic, Search, Minus, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/mock";
import { useStore, Price } from "./context";
import { PageHeading, ProductCard, AdultGate, EmptyState } from "./common";
export function CatalogPage({ adult = false }: { adult?: boolean }) {
  const content = <Catalog adult={adult} />;
  return (
    <main className="page-width page-body">
      {adult ? <AdultGate>{content}</AdultGate> : content}
    </main>
  );
}
function Catalog({ adult }: { adult: boolean }) {
  const { t, tr, toast, adultVisible } = useStore();
  const searchParams = useSearch({ strict: false }) as { category?: number };
  const [filter, setFilter] = useState<number | undefined>(searchParams.category);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilter(searchParams.category);
  }, [searchParams.category, adult]);
  const visible = products.filter(
    (p) =>
      p.isAdult18 === adult &&
      (!adult || adultVisible) &&
      (filter === undefined || p.category === filter) &&
      tr(p.name).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading title={adult ? "cellar" : "market"} subtitle={adult ? "idRequired" : "pickup"} />
      <div className="search-row">
        <div className="relative">
          <Search className="absolute top-3.5 start-3 text-muted-foreground" size={18} />
          <input
            className="search-input ps-10"
            aria-label={t("search")}
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => toast(t("voiceDemo"))}
          aria-label={t("voice")}
        >
          <Mic />
        </Button>
      </div>
      <div className="filter-row">
        <Button
          variant={filter === undefined ? "default" : "outline"}
          onClick={() => setFilter(undefined)}
        >
          {t("all")}
        </Button>
        {categories
          .filter((c) => c.isAdult18 === adult)
          .map((c) => (
            <Button
              key={c.id}
              variant={filter === c.id ? "default" : "outline"}
              onClick={() => setFilter(c.id)}
            >
              {c.emoji} {tr(c.name)}
            </Button>
          ))}
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search />
          <p>{t("noResults")}</p>
        </div>
      )}
      {adult && (
        <Button asChild className="mt-8">
          <Link to="/lottery">{t("lottery")}</Link>
        </Button>
      )}
    </>
  );
}
export function ProductPage({ id }: { id: string }) {
  const { t, tr, add, stock, favorites, toggleFavorite } = useStore();
  const [qty, setQty] = useState(1);
  const p = products.find((p) => p.id === id);
  if (!p)
    return (
      <main className="page-width page-body">
        <EmptyState />
      </main>
    );
  const content = (
    <div className="two-column">
      <div className="detail-art" role="img" aria-label={tr(p.name)}>
        <ProductImage product={p} />
      </div>
      <div className="detail-copy">
        {p.isAdult18 && <span className="notice-type red-flag">18+</span>}
        <h1>{tr(p.name)}</h1>
        <Price value={p.price} />
        <p>{tr(p.description)}</p>
        <span className="notice-type">
          {t((stock[p.id] ?? 0) > 0 ? "stock" : "out")} · {t("available")}
        </span>
        <h3 className="mt-5 font-bold">{t("ingredients")}</h3>
        <p>{t("specs")}</p>
        <div className="quantity-control my-6">
          <span>{t("quantity")}</span>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("remove")}
            disabled={qty <= 1}
            onClick={() => setQty((v) => v - 1)}
          >
            <Minus />
          </Button>
          <span>{qty}</span>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("add")}
            disabled={qty >= (stock[p.id] ?? 0)}
            onClick={() => setQty((v) => v + 1)}
          >
            <Plus />
          </Button>
        </div>
        <div className="flex gap-3">
          <Button disabled={(stock[p.id] ?? 0) <= 0} onClick={() => add(p.id, qty)}>
            <Plus />
            {t("add")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("favorite")}
            onClick={() => toggleFavorite(p.id)}
          >
            <Heart fill={favorites.includes(p.id) ? "currentColor" : "none"} />
          </Button>
        </div>
        {p.isAdult18 && <p className="red-flag">{t("idRequired")}</p>}
      </div>
    </div>
  );
  return (
    <main className="page-width page-body">
      {p.isAdult18 ? <AdultGate>{content}</AdultGate> : content}
    </main>
  );
}
