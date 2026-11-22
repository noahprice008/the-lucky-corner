import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBasket, Sparkles, LockKeyhole, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CELLAR_URL, GROCERIES_URL, LOGO_URL, STORE_BG_URL } from "@/lib/brand";
import { products, categories, livePosts } from "@/data/mock";
import { localDate } from "@/data/slots";
import { NoticeCard } from "./notice-card";
import { CategoryArt } from "./product-art";
import { useStore, DirectionArrow } from "./context";
import { ProductCard } from "./common";
export function Gateways() {
  const { t } = useStore();
  return (
    <div className="gateways">
      <Link to="/shop" className="gateway">
        <img src={GROCERIES_URL} className="gateway-img" alt="" />
        <div className="gateway-copy">
          <h2>{t("market")}</h2>
          <p>{t("marketDesc")}</p>
          <span className="gateway-link">
            {t("enter")}
            <DirectionArrow />
          </span>
        </div>
      </Link>
      <Link to="/cellar" className="gateway adult-gateway">
        <img src={CELLAR_URL} className="gateway-img" alt="" />
        <div className="gateway-copy">
          <span className="adult-tag">
            <LockKeyhole size={12} />
            {t("ageBadge")}
          </span>
          <h2>{t("cellar")}</h2>
          <p>{t("cellarDesc")}</p>
          <span className="gateway-link">
            {t("adultEnter")}
            <DirectionArrow />
          </span>
        </div>
      </Link>
    </div>
  );
}
export function HomePage() {
  const { t, tr, notices, specialEnabled } = useStore();
  const posts = livePosts(notices, localDate(new Date()));
  const pinned = posts.filter((n) => n.pinned).slice(0, 2);
  return (
    <main className="page-width home-content">
      <section className="hero">
        <img src={STORE_BG_URL} className="hero-photo" alt="" />
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <Sparkles size={15} />
            {t("local")}
          </div>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroText")}</p>
          <div className="hero-actions">
            <Button asChild size="lg" className="hero-cta">
              <Link to="/shop">
                <ShoppingBasket />
                {t("start")}
                <DirectionArrow />
              </Link>
            </Button>
            <Link to="/promotions" className="hero-link">
              {t("specialsLink")}
              <DirectionArrow />
            </Link>
          </div>
        </div>
      </section>
      {pinned.length > 0 && (
        <section className="pinned-posts" aria-label={t("postsFromCorner")}>
          <div className="section-heading">
            <h2>{t("postsFromCorner")}</h2>
            <Link to="/notices">
              {t("allNotices")}
              <DirectionArrow />
            </Link>
          </div>
          <div className="notices-preview mt-0">
            {pinned.map((n) => (
              <Link key={n.id} to="/notices" className="pinned-link">
                <NoticeCard notice={n} featured />
              </Link>
            ))}
          </div>
        </section>
      )}
      <Gateways />
      <section className="category-section">
        <div className="section-heading">
          <h2>{t("categories")}</h2>
          <Link to="/shop">
            {t("viewAll")}
            <DirectionArrow />
          </Link>
        </div>
        <div className="category-grid">
          {categories
            .filter((c) => !c.isAdult18)
            .map((c) => (
              <Link to="/shop" search={{ category: c.id }} key={c.id} className="category-item">
                <div className="category-art" role="img" aria-label={tr(c.name)}>
                  <CategoryArt id={c.id} />
                </div>
                <span>{tr(c.name)}</span>
              </Link>
            ))}
        </div>
      </section>
      {specialEnabled && (
        <Link to="/promotions" className="special-band">
          <div className="special-symbol">✦</div>
          <div>
            <h3>{t("daily")}</h3>
            <p>{t("dailyText")}</p>
          </div>
          <div className="offer">
            {t("specialOffer")}
            <span className="block text-xs font-normal mt-1">{t("snackOffer")}</span>
          </div>
        </Link>
      )}
      <section className="product-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">{t("localOffer")}</p>
            <h2>{t("popular")}</h2>
          </div>
          <Link to="/shop">
            {t("viewAll")}
            <DirectionArrow />
          </Link>
        </div>
        <div className="product-grid">
          {[products[0], products[2], products[4], products[6]]
            .filter((p): p is (typeof products)[number] => p !== undefined)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      <section className="product-section">
        <div className="section-heading">
          <h2>{t("noticePreview")}</h2>
          <Link to="/notices">
            {t("allNotices")}
            <DirectionArrow />
          </Link>
        </div>
        <div className="notices-preview">
          {posts
            .filter((n) => !pinned.includes(n))
            .slice(0, 2)
            .map((n) => (
              <Link key={n.id} to="/notices" className="pinned-link">
                <NoticeCard notice={n} />
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
export function EntryPage() {
  const { t } = useStore();
  return (
    <main className="page-width page-body">
      <div className="entry-panel">
        <img src={LOGO_URL} className="entry-logo" alt={t("brand")} />
        <p className="section-eyebrow">{t("introSmall")}</p>
        <h1>{t("brand")}</h1>
        <p className="text-muted-foreground">{t("welcomeText")}</p>
        <Gateways />
        <Button asChild variant="link" className="mt-6">
          <Link to="/">
            {t("back")}
            <DirectionArrow />
          </Link>
        </Button>
      </div>
    </main>
  );
}
