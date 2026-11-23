import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserRound, LogOut, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, Price, DirectionArrow } from "./context";
import { PageHeading, ProductCard, SlotLabel } from "./common";
import { OrderMessages } from "./inbox";
import { products, users, kpis, type DemoUser } from "@/data/mock";
import { canPreviewRole, isDemoSmsCode } from "@/data/slots";
import type { CopyKey } from "@/data/translations";
export function LoginPage() {
  const { t, setUser, toast, registeredUsers, setRegisteredUsers } = useStore();
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [role, setRole] = useState<DemoUser["role"]>("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "phone" && !isDemoSmsCode(code)) {
      toast(t("invalidCode"));
      return;
    }
    const existing = registeredUsers.find((u) =>
      mode === "phone" ? u.phone === phone : u.email === email,
    );
    const fallback = users.find((u) => u.dob === "1990-03-15");
    const user: DemoUser = {
      id: existing?.id ?? `u${Date.now()}`,
      name: register ? name : (existing?.name ?? fallback?.name ?? t("customer")),
      phone: phone || existing?.phone || "",
      email: email || existing?.email || "",
      dob: register ? dob : (existing?.dob ?? fallback?.dob ?? "1990-03-15"),
      role,
    };
    if (register) {
      setRegisteredUsers((old) => [...old.filter((u) => u.id !== user.id), user]);
    }
    setUser(user);
    toast(t("welcome"));
    navigate({ to: role === "owner" ? "/owner" : role === "staff" ? "/staff" : "/account" });
  };
  return (
    <main className="page-width page-body">
      <div className="form-tool">
        <PageHeading title="login" subtitle="loginHint" />
        <div className="segmented">
          <Button variant={!register ? "default" : "outline"} onClick={() => setRegister(false)}>
            {t("signIn")}
          </Button>
          <Button variant={register ? "default" : "outline"} onClick={() => setRegister(true)}>
            {t("register")}
          </Button>
        </div>
        <form onSubmit={submit}>
          <label className="form-field">
            {t("role")}
            <select
              aria-label={t("role")}
              value={role}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "customer" || v === "owner" || v === "staff") setRole(v);
              }}
            >
              <option value="customer">{t("customer")}</option>
              <option value="owner">{t("ownerRole")}</option>
              <option value="staff">{t("staffRole")}</option>
            </select>
          </label>
          <div className="segmented">
            <Button
              type="button"
              variant={mode === "phone" ? "secondary" : "outline"}
              onClick={() => setMode("phone")}
            >
              {t("phoneMode")}
            </Button>
            <Button
              type="button"
              variant={mode === "email" ? "secondary" : "outline"}
              onClick={() => setMode("email")}
            >
              {t("emailMode")}
            </Button>
          </div>
          {register && (
            <label className="form-field">
              {t("name")}
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          {(register || mode === "phone") && (
            <label className="form-field">
              {t("phone")}
              <input
                type="tel"
                dir="ltr"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0500000000"
              />
            </label>
          )}
          {(register || mode === "email") && (
            <label className="form-field">
              {t("email")}
              <input
                type="email"
                dir="ltr"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </label>
          )}
          {register && (
            <label className="form-field">
              {t("dob")}
              <input
                type="date"
                required
                max={new Date().toISOString().slice(0, 10)}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
          )}
          {mode === "phone" && (
            <>
              <Button
                type="button"
                variant="outline"
                className="mb-4"
                onClick={() => {
                  setSent(true);
                  toast(t("codeSent"));
                }}
              >
                {t("sendCode")}
              </Button>
              {sent && <p className="page-subtitle">{t("codeSent")}</p>}
              <label className="form-field">
                {t("code")}
                <input
                  required
                  dir="ltr"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                />
              </label>
            </>
          )}
          <Button type="submit" className="w-full">
            <UserRound />
            {t(register ? "register" : "signIn")}
          </Button>
        </form>
      </div>
    </main>
  );
}
export function RoleGate({
  role,
  children,
}: {
  role: "owner" | "staff";
  children: React.ReactNode;
}) {
  const { t, user } = useStore();
  return canPreviewRole(user?.role, role) ? (
    <>{children}</>
  ) : (
    <main className="page-width page-body">
      <div className="empty-state">
        <UserRound />
        <p>{t("noAccess")}</p>
        <Button asChild>
          <Link to="/login">{t("login")}</Link>
        </Button>
      </div>
    </main>
  );
}
export function Favorites() {
  const { t, favorites, adultAllowed } = useStore();
  const selected = products.filter(
    (p) => favorites.includes(p.id) && (!p.isAdult18 || adultAllowed),
  );
  return (
    <section className="section-divider">
      <h2 className="text-xl font-bold mb-5">{t("favorites")}</h2>
      {selected.length ? (
        <div className="product-grid">
          {selected.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="page-subtitle">{t("empty")}</p>
      )}
    </section>
  );
}
export function AccountPage() {
  const { t, user, setUser, toast } = useStore();
  const [whatsapp, setWhatsapp] = useState(false);
  const [push, setPush] = useState(true);
  return (
    <main className="page-width page-body">
      <PageHeading title="account" />
      {user ? (
        <>
          <div className="account-header">
            <div className="account-avatar">{user.name.slice(0, 1)}</div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <bdi dir="ltr" className="text-muted-foreground">
                {user.phone || user.email}
              </bdi>
            </div>
            <Button variant="outline" onClick={() => setUser(null)}>
              <LogOut />
              {t("logout")}
            </Button>
          </div>
          <div className="two-column">
            <section>
              <div className="slot-box">
                <p>{t("pickupStore")}</p>
                <strong>{t("brand")}</strong>
                <p>{t("tagline")}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/history">
                  <ShoppingBag />
                  {t("history")}
                  <DirectionArrow />
                </Link>
              </Button>
              {user.role === "owner" && (
                <Button asChild className="ms-3">
                  <Link to="/owner">{t("owner")}</Link>
                </Button>
              )}
              {user.role === "staff" && (
                <Button asChild className="ms-3">
                  <Link to="/staff">{t("staff")}</Link>
                </Button>
              )}
            </section>
            <section>
              <div className="metric">
                <p>{t("points")}</p>
                <strong>
                  <bdi>240</bdi> ✦
                </strong>
              </div>
              <h2 className="text-xl font-bold mt-6">{t("preferences")}</h2>
              <label className="toggle-row">
                {t("whatsapp")}
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.checked)}
                />
              </label>
              <label className="toggle-row">
                {t("push")}
                <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} />
              </label>
              <Button className="mt-4" onClick={() => toast(t("saved"))}>
                {t("save")}
              </Button>
            </section>
          </div>
          <Favorites />
        </>
      ) : (
        <div className="empty-state">
          <UserRound />
          <p>{t("welcome")}</p>
          <Button asChild>
            <Link to="/login">{t("login")}</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
export function Chart({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div
      className="chart-bars"
      role="img"
      aria-label={labels.map((label, i) => `${label}: ${values[i] ?? 0}`).join(", ")}
    >
      {values.map((v, i) => (
        <div key={i} className="chart-column">
          <bdi>{v}</bdi>
          <svg viewBox="0 0 30 120" className="chart-svg" aria-hidden="true">
            <rect
              x="4"
              y={120 - (v / Math.max(...values)) * 115}
              width="22"
              height={(v / Math.max(...values)) * 115}
              rx="2"
            />
          </svg>
          <small>{labels[i] ?? ""}</small>
        </div>
      ))}
    </div>
  );
}
export function HistoryPage() {
  const { t, tr, orders, add, toast, adultAllowed } = useStore();
  return (
    <main className="page-width page-body">
      <PageHeading title="history" subtitle="pickup" />
      <div className="two-column">
        <section>
          {orders.map((o) => (
            <article className="queue-card" key={o.id}>
              <div className="queue-top">
                <div>
                  <h3 className="font-bold">
                    {t("orderNumber")} <bdi>#{o.id}</bdi>
                  </h3>
                  <p className="text-sm text-primary mt-2">
                    <SlotLabel start={o.slot.start} end={o.slot.end} />
                  </p>
                </div>
                <span className="notice-type">{t(o.status)}</span>
              </div>
              {o.items.map((item) => {
                const p = products.find((p) => p.id === item.productId);
                return p ? (
                  <p key={p.id} className="queue-items">
                    {p.emoji} {tr(p.name)} × <bdi>{item.qty}</bdi>
                  </p>
                ) : null;
              })}
              <div className="flex items-center justify-between gap-4 mt-4">
                <Price value={o.total} />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      o.items.some((c) => products.find((p) => p.id === c.productId)?.isAdult18) &&
                      !adultAllowed
                    ) {
                      toast(t("adultReason"));
                      return;
                    }
                    o.items.forEach((c) => add(c.productId, c.qty));
                  }}
                >
                  {t("reorder")}
                </Button>
              </div>
              <OrderMessages orderId={o.id} />
            </article>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-bold">{t("spend")}</h2>
          <Chart values={kpis.monthly} labels={t("monthly").split(",")} />
        </section>
      </div>
      <Favorites />
    </main>
  );
}
