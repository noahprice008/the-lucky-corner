import { langInfo } from "@/data/languages";
import { ProductImage } from "./product-art";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Check, ShoppingBag, CalendarDays, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mock";
import { getSlots, isPickupAllowed, localDate } from "@/data/slots";
import { useStore, Price, DirectionArrow } from "./context";
import { PageHeading, EmptyState, SlotLabel } from "./common";
export function CartPage() {
  const { t, tr, cart, changeQty, slot, subtotal, total, discount, setDiscount, toast } =
    useStore();
  const [code, setCode] = useState(discount);
  return (
    <main className="page-width page-body">
      <PageHeading title="cart" subtitle="pickup" />
      {cart.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="two-column">
          <div>
            {cart.map((item) => {
              const p = products.find((p) => p.id === item.productId);
              if (!p) return null;
              return (
                <div className="cart-row" key={p.id}>
                  <div className="cart-art">
                    <ProductImage product={p} />
                  </div>
                  <div className="min-w-0">
                    <Link to="/product/$id" params={{ id: p.id }} className="font-semibold">
                      {tr(p.name)}
                    </Link>
                    <div className="mt-2">
                      <Price value={p.price * item.qty} />
                    </div>
                    {p.isAdult18 && <p className="red-flag text-xs mt-1">{t("adultReminder")}</p>}
                  </div>
                  <div className="quantity-control">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${t("remove")} ${tr(p.name)}`}
                      onClick={() => changeQty(p.id, item.qty - 1)}
                    >
                      <Minus />
                    </Button>
                    <span>{item.qty}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${t("add")} ${tr(p.name)}`}
                      onClick={() => changeQty(p.id, item.qty + 1)}
                    >
                      <Plus />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("remove")}
                      onClick={() => changeQty(p.id, 0)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              );
            })}
            <div className="slot-box">
              <CalendarDays size={20} />
              <div className="mt-2">{t("pickupTime")}</div>
              <strong>
                {slot ? <SlotLabel start={slot.start} end={slot.end} /> : t("noSlot")}
              </strong>
              <Button variant="link" asChild className="px-0">
                <Link to="/checkout">
                  {t("chooseSlot")}
                  <DirectionArrow />
                </Link>
              </Button>
            </div>
          </div>
          <aside className="summary">
            <h2 className="font-bold text-xl">{t("total")}</h2>
            <div className="summary-line">
              <span>{t("subtotal")}</span>
              <Price value={subtotal} />
            </div>
            <div className="form-field mt-4">
              <label htmlFor="discount">{t("discount")}</label>
              <div className="flex gap-2">
                <input
                  id="discount"
                  dir="ltr"
                  placeholder="DEMO10"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (code.trim().toUpperCase() === "DEMO10") {
                      setDiscount("DEMO10");
                      toast(t("discountOk"));
                    } else {
                      setDiscount("");
                      toast(t("discountBad"));
                    }
                  }}
                >
                  {t("apply")}
                </Button>
              </div>
            </div>
            {discount === "DEMO10" && (
              <div className="summary-line">
                <span>{t("discountLabel")} 10%</span>
                <Price value={subtotal - total} />
              </div>
            )}
            <div className="summary-line summary-total">
              <span>{t("total")}</span>
              <Price value={total} />
            </div>
            <Button asChild className="w-full mt-5">
              <Link to="/checkout">
                {t("next")}
                <DirectionArrow />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">{t("paymentDemo")}</p>
          </aside>
        </div>
      )}
    </main>
  );
}
export function CheckoutPage() {
  const {
    t,
    tr,
    lang,
    cart,
    slot,
    setSlot,
    total,
    setOrders,
    setLastOrder,
    clearCart,
    toast,
    adultAllowed,
    stock,
  } = useStore();
  const navigate = useNavigate();
  const slots = useMemo(() => getSlots(), []);
  const [date, setDate] = useState(slot?.date ?? localDate(new Date()));
  const [payment, setPayment] = useState("Bit");
  const [placing, setPlacing] = useState(false);
  const dates = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
      }),
    [],
  );
  const hasAdult = cart.some((item) => products.find((p) => p.id === item.productId)?.isAdult18);
  const place = () => {
    if (!slot || slot.full || !isPickupAllowed(new Date(slot.start))) {
      toast(t("required"));
      return;
    }
    if (hasAdult && !adultAllowed) {
      toast(t("adultReason"));
      return;
    }
    if (cart.some((c) => c.qty > (stock[c.productId] ?? 0))) {
      toast(t("out"));
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const order = {
        id: String(10500 + Math.floor(Math.random() * 899)),
        items: [...cart],
        slot: { start: slot.start, end: slot.end },
        total,
        status: "received" as const,
      };
      setLastOrder(order);
      setOrders((old) => [order, ...old]);
      clearCart();
      navigate({ to: "/confirmation" });
    }, 600);
  };
  return (
    <main className="page-width page-body">
      <PageHeading title="checkout" subtitle="pickup" />
      {cart.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="two-column">
          <div>
            <h2 className="text-xl font-bold flex gap-2 items-center">
              <CalendarDays size={22} />
              {t("chooseSlot")}
            </h2>
            <p className="page-subtitle mt-2">{t("slotHint")}</p>
            <div className="date-tabs">
              {dates.map((d) => (
                <Button
                  variant={date === localDate(d) ? "default" : "outline"}
                  key={localDate(d)}
                  onClick={() => setDate(localDate(d))}
                >
                  <span>
                    {d.toLocaleDateString(langInfo(lang).locale, { weekday: "short" })}
                  </span>
                  <bdi>
                    {d.getDate()}/{d.getMonth() + 1}
                  </bdi>
                </Button>
              ))}
            </div>
            <div className="time-grid">
              {slots
                .filter((s) => s.date === date)
                .map((s) => (
                  <Button
                    variant={slot?.start === s.start ? "default" : "outline"}
                    key={s.start}
                    disabled={s.full || !isPickupAllowed(new Date(s.start))}
                    onClick={() => setSlot(s)}
                    aria-label={`${s.time}${s.full ? " " + t("full") : ""}`}
                  >
                    <bdi>{s.time}</bdi>
                    {s.full && <small>{t("full")}</small>}
                  </Button>
                ))}
            </div>
            {slots.filter((s) => s.date === date).length === 0 && (
              <p className="empty-state">{t("closed")}</p>
            )}
            {slot && (
              <div className="slot-box">
                <span>{t("pickupTime")}</span>
                <strong>
                  <SlotLabel start={slot.start} end={slot.end} />
                </strong>
              </div>
            )}
            <h2 className="section-divider text-xl font-bold flex gap-2">
              <CreditCard />
              {t("payment")}
            </h2>
            <div className="payment-options">
              {["Bit", "Credit card", "Apple Pay", "Google Pay"].map((method) => (
                <label className="payment-option" key={method}>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === method}
                    onChange={() => setPayment(method)}
                  />
                  <bdi>{method === "Credit card" ? t("creditCard") : method}</bdi>
                </label>
              ))}
            </div>
            <p className="page-subtitle">{t("paymentDemo")}</p>
          </div>
          <aside className="summary">
            <h2 className="text-xl font-bold mb-4">{t("cart")}</h2>
            {cart.map((c) => {
              const p = products.find((p) => p.id === c.productId);
              return p ? (
                <div className="summary-line" key={c.productId}>
                  <span>
                    {tr(p.name)} × {c.qty}
                  </span>
                  <bdi>₪{(p.price * c.qty).toFixed(2)}</bdi>
                </div>
              ) : null;
            })}
            <div className="summary-line summary-total">
              <span>{t("total")}</span>
              <Price value={total} />
            </div>
            <div className="slot-box">
              <span>{t("pickupTime")}</span>
              <strong>
                {slot ? <SlotLabel start={slot.start} end={slot.end} /> : t("noSlot")}
              </strong>
            </div>
            {hasAdult && <p className="red-flag text-sm mb-4">{t("idRequired")}</p>}
            <Button className="w-full" disabled={placing} onClick={place}>
              <ShoppingBag />
              {placing ? t("preparing") : t("place")}
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
}
export function ConfirmationPage() {
  const { t, lastOrder } = useStore();
  return (
    <main className="page-width page-body">
      <div className="confirmation">
        <div className="success-icon">
          <Check size={42} />
        </div>
        <PageHeading title="confirmation" />
        {lastOrder ? (
          <>
            <p className="text-muted-foreground">
              {t("orderNumber")} <bdi>#{lastOrder.id}</bdi>
            </p>
            <div className="slot-box">
              <span>
                {t("pickupTime")} · {t("pickup")}
              </span>
              <strong>
                <SlotLabel start={lastOrder.slot.start} end={lastOrder.slot.end} />
              </strong>
              <p className="mt-3">
                {t("brand")} · {t("tagline")}
              </p>
            </div>
            <div className="progress-steps">
              <span className="progress-track" />
              {(["received", "preparing", "ready", "picked"] as const).map((key, i) => (
                <div key={key}>
                  <span className={`step-dot ${i === 0 ? "step-active" : ""}`}>
                    {i === 0 ? <Check size={14} /> : i + 1}
                  </span>
                  {t(key)}
                </div>
              ))}
            </div>
            <Price value={lastOrder.total} />
          </>
        ) : (
          <p className="page-subtitle">{t("empty")}</p>
        )}
        <Button asChild className="mt-8">
          <Link to="/">
            {t("back")}
            <DirectionArrow />
          </Link>
        </Button>
      </div>
    </main>
  );
}
