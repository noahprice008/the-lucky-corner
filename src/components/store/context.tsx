import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  ShoppingBasket,
  Bell,
  UserRound,
  ShoppingBag,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/lib/brand";
import { copy, type CopyKey, type Lang, type Bilingual } from "@/data/translations";
import {
  products,
  users as initialUsers,
  notices as initialNotices,
  sampleOrders,
  type DemoUser,
  type Order,
  type Notice,
} from "@/data/mock";
import { canAccessAdult, calculateTotal, type PickupSlot } from "@/data/slots";
interface CartItem {
  productId: string;
  qty: number;
}
interface StoreState {
  registeredUsers: DemoUser[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<DemoUser[]>>;
  specialEnabled: boolean;
  setSpecialEnabled: (value: boolean) => void;
  lang: Lang;
  t: (key: CopyKey) => string;
  tr: (value: Bilingual) => string;
  setLang: (l: Lang) => void;
  cart: CartItem[];
  add: (id: string, qty?: number) => void;
  changeQty: (id: string, qty: number) => void;
  clearCart: () => void;
  user: DemoUser | null;
  setUser: (u: DemoUser | null) => void;
  adultConfirmed: boolean;
  confirmAdult: () => void;
  adultAllowed: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  slot: PickupSlot | null;
  setSlot: (s: PickupSlot | null) => void;
  discount: string;
  setDiscount: (s: string) => void;
  subtotal: number;
  total: number;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  lastOrder: Order | null;
  setLastOrder: (o: Order) => void;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  toast: (s: string) => void;
  stock: Record<string, number>;
  setStock: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  adultVisible: boolean;
  setAdultVisible: (b: boolean) => void;
}
const StoreContext = createContext<StoreState | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [registeredUsers, setRegisteredUsers] = useState(initialUsers);
  const [specialEnabled, setSpecialEnabled] = useState(true);
  const [lang, setLang] = useState<Lang>("he");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUserState] = useState<DemoUser | null>(null);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [slot, setSlot] = useState<PickupSlot | null>(null);
  const [discount, setDiscount] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [notices, setNotices] = useState(initialNotices);
  const [message, setMessage] = useState("");
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(products.map((p) => [p.id, p.stock])),
  );
  const [adultVisible, setAdultVisible] = useState(true);
  const t = (key: CopyKey) => copy[key][lang === "he" ? 0 : 1];
  const tr = (v: Bilingual) => v[lang === "he" ? 0 : 1];
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("lucky-cart") ?? "[]") as unknown;
      if (Array.isArray(stored))
        setCart(
          stored.filter(
            (v): v is CartItem =>
              typeof v === "object" &&
              v !== null &&
              "productId" in v &&
              typeof v.productId === "string" &&
              products.some((p) => p.id === v.productId) &&
              "qty" in v &&
              typeof v.qty === "number" &&
              Number.isInteger(v.qty) &&
              v.qty > 0,
          ),
        );
    } catch {}
    setHydrated(true);
    setOrders(sampleOrders());
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem("lucky-cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(id);
  }, [message]);
  const adultAllowed = canAccessAdult(user?.dob, adultConfirmed);
  const setUser = (u: DemoUser | null) => {
    setUserState(u);
    setAdultConfirmed(false);
  };
  const add = (id: string, qty = 1) => {
    const p = products.find((p) => p.id === id);
    if (!p || (stock[id] ?? 0) <= 0) return;
    if (p.isAdult18 && !adultAllowed) {
      setMessage(t("adultReason"));
      return;
    }
    setCart((old) => {
      const found = old.find((v) => v.productId === id);
      return found
        ? old.map((v) =>
            v.productId === id ? { ...v, qty: Math.min(v.qty + qty, stock[id] ?? 0) } : v,
          )
        : [...old, { productId: id, qty: Math.min(qty, stock[id] ?? 0) }];
    });
    setMessage(t(p.isAdult18 ? "idRequired" : "added"));
  };
  const subtotal = cart.reduce(
    (sum, item) => sum + (products.find((p) => p.id === item.productId)?.price ?? 0) * item.qty,
    0,
  );
  return (
    <StoreContext.Provider
      value={{
        registeredUsers,
        setRegisteredUsers,
        specialEnabled,
        setSpecialEnabled,
        lang,
        t,
        tr,
        setLang,
        cart,
        add,
        changeQty: (id, qty) =>
          setCart((old) =>
            qty <= 0
              ? old.filter((v) => v.productId !== id)
              : old.map((v) =>
                  v.productId === id ? { ...v, qty: Math.min(qty, stock[id] ?? 0) } : v,
                ),
          ),
        clearCart: () => setCart([]),
        user,
        setUser,
        adultConfirmed,
        confirmAdult: () => setAdultConfirmed(true),
        adultAllowed,
        favorites,
        toggleFavorite: (id) =>
          setFavorites((old) => (old.includes(id) ? old.filter((v) => v !== id) : [...old, id])),
        slot,
        setSlot,
        discount,
        setDiscount,
        subtotal,
        total: calculateTotal(subtotal, discount),
        orders,
        setOrders,
        lastOrder,
        setLastOrder,
        notices,
        setNotices,
        toast: setMessage,
        stock,
        setStock,
        adultVisible,
        setAdultVisible,
      }}
    >
      {children}
      {message && (
        <div role="status" className="toast-message">
          {message}
        </div>
      )}
    </StoreContext.Provider>
  );
}
export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("Store provider missing");
  return value;
}
export function Price({ value }: { value: number }) {
  return <bdi className="price">₪{value.toFixed(2)}</bdi>;
}
export function DirectionArrow({ className = "" }: { className?: string }) {
  const { lang } = useStore();
  return lang === "he" ? (
    <ArrowLeft size={16} className={className} />
  ) : (
    <ArrowRight size={16} className={className} />
  );
}
export function StoreShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang, cart, user } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const staffView = pathname === "/staff" || pathname === "/owner";
  const nav = [
    { to: "/" as const, key: "home" as const, icon: Home },
    { to: "/shop" as const, key: "shop" as const, icon: ShoppingBasket },
    { to: "/notices" as const, key: "notices" as const, icon: Bell },
    { to: "/account" as const, key: "account" as const, icon: UserRound },
    { to: "/cart" as const, key: "cart" as const, icon: ShoppingBag },
  ];
  const day = new Date().getDay();
  const hours =
    day === 6 ? t("closed") : `${t("open").split("23:00")[0]}${day === 5 ? "15:00" : "23:00"}`;
  return (
    <div dir={lang === "he" ? "rtl" : "ltr"}>
      <header className="store-header">
        <div className="header-inner">
          <Link to="/" className="brand-link">
            <img className="brand-logo" src={LOGO_URL} alt={t("brand")} />
            <div className="min-w-0">
              <div className="brand-title">{t("brand")}</div>
              <div className="brand-tagline">{t("tagline")}</div>
            </div>
          </Link>
          <nav className="header-nav" aria-label={t("shop")}>
            <Link to="/" activeOptions={{ exact: true }}>
              {t("home")}
            </Link>
            <Link to="/shop">{t("shop")}</Link>
            <Link to="/promotions">{t("promotions")}</Link>
            <Link to="/notices">{t("notices")}</Link>
            <Link to="/info">{t("info")}</Link>
          </nav>
          <div className="header-actions">
            <div className="language-control">
              <Globe size={14} />
              <Button
                variant="ghost"
                className={lang === "he" ? "language-active" : ""}
                onClick={() => setLang("he")}
                aria-label="עברית"
              >
                עב
              </Button>
              <span className="text-muted-foreground">/</span>
              <Button
                variant="ghost"
                className={lang === "en" ? "language-active" : ""}
                onClick={() => setLang("en")}
                aria-label="English"
              >
                EN
              </Button>
            </div>
            <Button asChild variant="ghost" size="icon" className="header-account">
              <Link to="/account" aria-label={t("account")}>
                <UserRound />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="header-cart">
              <Link to="/cart" aria-label={t("cart")}>
                <ShoppingBag />
                {cart.length > 0 && (
                  <span className="count-badge">{cart.reduce((n, v) => n + v.qty, 0)}</span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="store-strip">
        <span>
          <span className="status-dot" />
          {hours}
        </span>
        <span>
          <ShoppingBag size={13} />
          {t("pickup")}
        </span>
        <span className="strip-location">
          <MapPin size={13} />
          {t("tagline")}
        </span>
      </div>
      {children}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-name">{t("brand")}</div>
            <div className="footer-tagline">{t("footer")}</div>
          </div>
          <div className="footer-links">
            <Link to="/entry">{t("entry")}</Link>
            <Link to="/info">{t("info")}</Link>
            <Link to="/support">{t("support")}</Link>
            <Link to="/promotions">{t("promotions")}</Link>
            <Link to="/login">{t("login")}</Link>
            {user?.role === "owner" && <Link to="/owner">{t("owner")}</Link>}
            {user?.role === "staff" && <Link to="/staff">{t("staff")}</Link>}
            <span>{t("demo")}</span>
          </div>
        </div>
      </footer>
      {!staffView && (
        <nav className="bottom-nav" aria-label={t("home")}>
          {nav.map(({ to, key, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}>
              <Icon />
              <span>
                {t(key)}
                {key === "cart" && cart.length > 0
                  ? ` (${cart.reduce((s, c) => s + c.qty, 0)})`
                  : ""}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
