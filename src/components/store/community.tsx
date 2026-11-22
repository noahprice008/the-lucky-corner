import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  MapPin,
  Phone,
  Send,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, AdultGate } from "./common";
import { useStore, DirectionArrow } from "./context";
import { NoticeCard } from "./notice-card";
import { livePosts } from "@/data/mock";
import { localDate } from "@/data/slots";
import { CELLAR_URL, GROCERIES_URL } from "@/lib/brand";
export function NoticesPage() {
  const { t, tr, notices, toast } = useStore();
  const [filter, setFilter] = useState("all");
  const [subscribed, setSubscribed] = useState(false);
  const posts = livePosts(notices, localDate(new Date()));
  return (
    <main className="page-width page-body">
      <PageHeading title="notices" subtitle="noticesTop" />
      <div className="notification-previews">
        {posts.slice(0, 2).map((n) => (
          <div className="notification-preview" key={n.id}>
            <Bell size={19} />
            <div className="min-w-0">
              <small>
                {t("noticeDemo")} · {t("brand")}
              </small>
              <p>{tr(n.title)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="filter-row">
        {(["all", "specials", "news", "school"] as const).map((key) => (
          <Button
            variant={filter === key ? "default" : "outline"}
            key={key}
            onClick={() => setFilter(key)}
          >
            {t(key)}
          </Button>
        ))}
      </div>
      <div className="notices-preview mt-0">
        {posts
          .filter((n) => filter === "all" || n.type === filter)
          .map((n) => (
            <NoticeCard key={n.id} notice={n} featured={!!n.pinned} />
          ))}
      </div>
      <section className="subscription">
        <h2>{t("subscribe")}</h2>
        <p className="text-muted-foreground">{t("subscribeText")}</p>
        <form
          className="subscription-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
            toast(t("saved"));
          }}
        >
          <label className="form-field mb-0">
            {t("phone")}
            <input type="tel" required dir="ltr" placeholder="0500000000" />
          </label>
          <Button type="submit" className="self-end" disabled={subscribed}>
            {t(subscribed ? "saved" : "whatsapp")}
          </Button>
        </form>
        <Button variant="outline" className="mt-5" onClick={() => toast(t("pushDemo"))}>
          <Bell />
          {t("push")}
        </Button>
      </section>
    </main>
  );
}
export function PromotionsPage() {
  const { t } = useStore();
  const [slide, setSlide] = useState(0);
  const titles = ["specialOffer", "bundle", "happy"] as const;
  const bodies = ["snackOffer", "bundleDesc", "happyDesc"] as const;
  const title = titles[slide] ?? "specialOffer";
  const body = bodies[slide] ?? "snackOffer";
  return (
    <main className="page-width page-body">
      <PageHeading title="promotions" subtitle="dailyText" />
      <section className="promotion-feature">
        <img
          src={slide === 2 ? CELLAR_URL : GROCERIES_URL}
          alt={t(slide === 2 ? "cellar" : "market")}
        />
        <div className="promotion-copy">
          <span className="adult-tag">
            <Tag size={14} />
            {t("daily")}
          </span>
          <h2>{t(title)}</h2>
          <p>{t(body)}</p>
          <Button asChild className="hero-cta mt-5">
            <Link to={slide === 2 ? "/cellar" : "/shop"}>
              {t("start")}
              <DirectionArrow />
            </Link>
          </Button>
        </div>
      </section>
      <div className="carousel-controls">
        <Button
          variant="outline"
          size="icon"
          aria-label={t("back")}
          onClick={() => setSlide((v) => (v + 2) % 3)}
        >
          <ChevronRight />
        </Button>
        <bdi>{slide + 1} / 3</bdi>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("next")}
          onClick={() => setSlide((v) => (v + 1) % 3)}
        >
          <ChevronLeft />
        </Button>
      </div>
      <div className="gateways">
        <Link to="/shop" search={{ category: 4 }} className="notice-card">
          <span className="notice-type">{t("school")}</span>
          <h3>{t("bundle")}</h3>
          <p>{t("bundleDesc")}</p>
          <span className="gateway-link mt-4">
            {t("enter")}
            <DirectionArrow />
          </span>
        </Link>
        <Link to="/cellar" className="notice-card">
          <span className="notice-type">18+</span>
          <h3>{t("happy")}</h3>
          <p>{t("happyDesc")}</p>
          <span className="gateway-link mt-4">
            {t("adultEnter")}
            <DirectionArrow />
          </span>
        </Link>
      </div>
    </main>
  );
}
export function InfoPage() {
  const { t, toast } = useStore();
  return (
    <main className="page-width page-body">
      <PageHeading title="info" subtitle="tagline" />
      <div className="two-column">
        <section>
          <h2 className="text-2xl font-bold">{t("brand")}</h2>
          <p className="text-muted-foreground my-4">{t("address")}</p>
          <span className="notice-type">{t("pickup")}</span>
          <h2 className="text-xl font-bold mt-6">{t("hours")}</h2>
          <table className="hours-table">
            <tbody>
              <tr>
                <td>{t("sunThu")}</td>
                <td>
                  <bdi>07:00–23:00</bdi>
                </td>
              </tr>
              <tr>
                <td>{t("friday")}</td>
                <td>
                  <bdi>07:00–15:00</bdi>
                </td>
              </tr>
              <tr>
                <td>{t("saturday")}</td>
                <td>{t("closed")}</td>
              </tr>
            </tbody>
          </table>
          <Button variant="outline" onClick={() => toast(t("demo"))}>
            <Phone />
            {t("call")} · <bdi>04-000-0000</bdi>
          </Button>
        </section>
        <section className="map-placeholder">
          <MapPin />
          <strong>{t("map")}</strong>
          <small>{t("mapPlaceholder")}</small>
        </section>
      </div>
    </main>
  );
}
export function SupportPage() {
  const { t, toast } = useStore();
  const [sent, setSent] = useState(false);
  return (
    <main className="page-width page-body">
      <PageHeading title="support" />
      <div className="two-column">
        <section>
          {(
            [
              ["faqPickup", "faqPickupA"],
              ["faqPay", "faqPayA"],
              ["faqAdult", "faqAdultA"],
            ] as const
          ).map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>
                {t(q)}
                <ChevronDown size={18} />
              </summary>
              <p>{t(a)}</p>
            </details>
          ))}
        </section>
        <form
          className="summary"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast(t("sent"));
          }}
        >
          <h2 className="text-xl font-bold mb-5">{t("message")}</h2>
          <label className="form-field">
            {t("name")}
            <input required />
          </label>
          <label className="form-field">
            {t("phone")}
            <input type="tel" dir="ltr" required />
          </label>
          <label className="form-field">
            {t("text")}
            <textarea rows={4} required />
          </label>
          <Button type="submit" disabled={sent}>
            <Send />
            {t(sent ? "sent" : "send")}
          </Button>
        </form>
      </div>
    </main>
  );
}
export function LotteryPage() {
  const { t } = useStore();
  const [revealed, setRevealed] = useState(false);
  return (
    <main className="page-width page-body">
      <AdultGate>
        <PageHeading title="lottery" subtitle="results" />
        <div className="results-ticker">
          <bdi>04 · 12 · 18 · 23 · 29 · 35 + 7</bdi>
        </div>
        <div className="scratch-card">{revealed ? t("scratchResult") : t("scratch")}</div>
        <Button disabled={revealed} onClick={() => setRevealed(true)}>
          {t("reveal")}
        </Button>
        <p className="page-subtitle mt-4">
          {t("results")} · {t("idRequired")}
        </p>
      </AdultGate>
    </main>
  );
}
