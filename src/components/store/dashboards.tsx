import { langInfo } from "@/data/languages";
import { useState, useEffect } from "react";
import { Printer, CalendarDays, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, Price } from "./context";
import { PageHeading, SlotLabel } from "./common";
import { RoleGate, Chart } from "./account";
import { PostsManager } from "./posts-admin";
import { InventoryManager } from "./inventory-admin";
import { InboxPanel } from "./inbox";
import { products, kpis } from "@/data/mock";
import { localDate } from "@/data/slots";
import { LOGO_URL } from "@/lib/brand";
export function OwnerPage() {
  return (
    <RoleGate role="owner">
      <OwnerDashboard />
    </RoleGate>
  );
}
function OwnerDashboard() {
  const {
    t,
    tr,
    stock,
    toast,
    registeredUsers,
    specialEnabled,
    setSpecialEnabled,
  } = useStore();
  return (
    <main className="page-width page-body">
      <PageHeading title="owner" subtitle="demo" />
      <PostsManager />
      <div className="metric-grid">
        {[
          { label: "todayOrders" as const, value: kpis.todayOrders },
          { label: "revenue" as const, value: kpis.revenue },
          { label: "users" as const, value: registeredUsers.length },
          { label: "pending" as const, value: kpis.pending },
        ].map((m) => (
          <article className="metric" key={m.label}>
            <p>{t(m.label)}</p>
            <strong>
              {m.label === "revenue" ? <bdi>₪{m.value.toFixed(2)}</bdi> : <bdi>{m.value}</bdi>}
            </strong>
          </article>
        ))}
      </div>
      <div className="two-column">
        <section>
          <h2 className="text-xl font-bold">{t("hourChart")}</h2>
          <Chart
            values={kpis.hours}
            labels={["07:00", "09:00", "11:00", "13:00", "15:00", "17:00"]}
          />
          <h2 className="text-xl font-bold mb-4">{t("best")}</h2>
          {products.slice(0, 5).map((p, i) => (
            <div className="summary-line" key={p.id}>
              <span>
                {i + 1}. {tr(p.name)}
              </span>
              <bdi>{48 - i * 7}</bdi>
            </div>
          ))}
          <h2 className="text-xl font-bold mt-8 mb-4">{t("out")}</h2>
          {products
            .filter((p) => (stock[p.id] ?? 0) === 0)
            .map((p) => (
              <p className="red-flag mb-2" key={p.id}>
                {tr(p.name)}
              </p>
            ))}
        </section>
        <div>
          <h2 className="text-xl font-bold">{t("dailyManage")}</h2>
          <label className="toggle-row">
            {t("specialOffer")} · {t("snackOffer")}
            <input
              type="checkbox"
              checked={specialEnabled}
              onChange={(e) => setSpecialEnabled(e.target.checked)}
            />
          </label>
          <Button className="mt-4" onClick={() => toast(t("saved"))}>
            <Save />
            {t("save")}
          </Button>
        </div>
      </div>
      <InventoryManager />
      <InboxPanel />
    </main>
  );
}
export function StaffPage() {
  return (
    <RoleGate role="staff">
      <StaffDashboard />
    </RoleGate>
  );
}
function StaffDashboard() {
  const { t, tr, orders, lang } = useStore();
  const [format, setFormat] = useState("A4");
  const [selected, setSelected] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [printing, setPrinting] = useState(false);
  const today = localDate(new Date());
  const todayOrders = orders
    .filter((o) => localDate(new Date(o.slot.start)) === today)
    .sort((a, b) => a.slot.start.localeCompare(b.slot.start));
  const slots = [...new Set(todayOrders.map((o) => o.slot.start))];
  useEffect(() => {
    if (!printing) return;
    const timer = setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 80);
    return () => clearTimeout(timer);
  }, [printing]);
  const print = (id: string | null) => {
    setSelected(id);
    setPrinting(true);
  };
  return (
    <main
      className={`page-width page-body ${format === "80mm" ? "receipt-print" : ""} ${selected ? "print-single" : ""}`}
    >
      <div className="no-print">
        <PageHeading title="staff" subtitle="readonly" />
        <p className="text-primary mb-5">
          {new Date().toLocaleDateString(langInfo(lang).locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          · {t("pickup")}
        </p>
        <div className="flex gap-3 items-end flex-wrap">
          <Button onClick={() => print(null)} disabled={!todayOrders.length}>
            <Printer />
            {t("printAll")}
          </Button>
          <label className="form-field mb-0">
            {t("printSize")}
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option>A4</option>
              <option>80mm</option>
            </select>
          </label>
        </div>
      </div>
      <div className="print-only print-heading">
        <img src={LOGO_URL} alt={t("brand")} />
        <h1>{t("brand")}</h1>
        <p>
          {t("tagline")} · {t("pickup")}
        </p>
      </div>
      <InboxPanel />
      {todayOrders.length === 0 && (
        <div className="empty-state no-print">
          <CalendarDays />
          <p>{t("empty")}</p>
        </div>
      )}
      {slots.map((start) => (
        <section key={start}>
          <h2 className="text-lg font-bold mt-8 no-print">
            <bdi>
              {new Date(start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </bdi>
          </h2>
          {todayOrders
            .filter((o) => o.slot.start === start)
            .map((o) => (
              <article
                className={`queue-card ${selected === o.id ? "selected-slip" : ""}`}
                key={o.id}
              >
                <div className="queue-top">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg">
                      {t("orderNumber")} <bdi>#{o.id}</bdi>
                    </h3>
                    <p className="text-primary mt-2">
                      <SlotLabel start={o.slot.start} end={o.slot.end} />
                    </p>
                  </div>
                  <span className="notice-type">{t(o.status)}</span>
                </div>
                {o.items.map((item) => {
                  const p = products.find((p) => p.id === item.productId);
                  return p ? (
                    <p className={`queue-items ${p.isAdult18 ? "red-flag" : ""}`} key={p.id}>
                      {tr(p.name)} × <bdi>{item.qty}</bdi>
                      {p.isAdult18 ? " · 18+" : ""}
                    </p>
                  ) : null;
                })}
                {o.items.some((c) => products.find((p) => p.id === c.productId)?.isAdult18) && (
                  <p className="red-flag text-sm mt-3">{t("idRequired")}</p>
                )}
                {missing.includes(o.id) && (
                  <p className="red-flag text-sm mt-3 no-print">{t("callCustomer")}</p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                  <Price value={o.total} />
                  <Button
                    className="no-print"
                    variant={missing.includes(o.id) ? "default" : "outline"}
                    onClick={() =>
                      setMissing((m) => (m.includes(o.id) ? m.filter((x) => x !== o.id) : [...m, o.id]))
                    }
                  >
                    {t("missingItem")}
                  </Button>
                  <Button className="print-button" variant="outline" onClick={() => print(o.id)}>
                    <Printer />
                    {t("print")}
                  </Button>
                </div>
              </article>
            ))}
        </section>
      ))}
    </main>
  );
}
