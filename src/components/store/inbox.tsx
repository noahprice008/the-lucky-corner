import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "./context";
import { unreadCount, type InboxMessage } from "@/data/inbox";
import type { CopyKey } from "@/data/translations";

const messageText = (m: InboxMessage, t: (k: CopyKey) => string) =>
  m.from === "system" && m.text === "Order received" ? t("received") : m.text;

const quick: CopyKey[] = ["quickReady", "quickMissing", "quickThanks"];

function fromLabel(m: InboxMessage, t: (k: CopyKey) => string, staffView: boolean) {
  if (m.from === "system") return t("messageSystem");
  if (m.from === "store") return t("messageFromStore");
  return staffView ? t("customer") : t("messageYou");
}

/** Shown to a customer under an order: the thread with the store, plus a reply box. */
export function OrderMessages({ orderId }: { orderId: string }) {
  const { t, messages, sendMessage } = useStore();
  const [text, setText] = useState("");
  const thread = messages.filter((m) => m.orderId === orderId);
  return (
    <div className="order-thread">
      <h4>{t("customerMessages")}</h4>
      {thread.map((m) => (
        <p className={`thread-msg from-${m.from}`} key={m.id}>
          <strong>{fromLabel(m, t, false)}</strong> {messageText(m, t)}
        </p>
      ))}
      <form
        className="thread-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMessage(orderId, text.trim(), "customer");
          setText("");
        }}
      >
        <input value={text} dir="auto" placeholder={t("customerWrite")} aria-label={t("customerWrite")} onChange={(e) => setText(e.target.value)} />
        <Button type="submit" disabled={!text.trim()}>
          {t("inboxSend")}
        </Button>
      </form>
    </div>
  );
}

/** The store team's inbox: threads grouped by order, unread count, quick replies. */
export function InboxPanel() {
  const { t, messages, markAllRead, markThreadRead, sendMessage } = useStore();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const unread = unreadCount(messages);
  const orderIds = [...new Set(messages.map((m) => m.orderId))].sort((a, b) => {
    const last = (id: string) => messages.filter((m) => m.orderId === id).map((m) => m.at).sort().pop() ?? "";
    return last(b).localeCompare(last(a));
  });
  return (
    <section className="inbox no-print" id="inbox" aria-live="polite">
      <div className="inbox-head">
        <h2 className="text-xl font-bold">
          <MessageSquare size={20} aria-hidden /> {t("inboxTitle")}
          {unread > 0 && (
            <span className="inbox-badge">
              <bdi>{unread}</bdi> {t("inboxUnread")}
            </span>
          )}
        </h2>
        <Button variant="outline" onClick={markAllRead} disabled={!unread}>
          {t("inboxMarkRead")}
        </Button>
      </div>
      <p className="page-subtitle">{t("inboxSubtitle")}</p>
      {orderIds.length === 0 && <p>{t("inboxEmpty")}</p>}
      {orderIds.map((id) => {
        const thread = messages.filter((m) => m.orderId === id).sort((a, b) => a.at.localeCompare(b.at));
        const hasUnread = thread.some((m) => m.from === "customer" && !m.read);
        const draft = drafts[id] ?? "";
        const send = (text: string) => {
          if (!text.trim()) return;
          sendMessage(id, text.trim(), "store");
          setDrafts((d) => ({ ...d, [id]: "" }));
        };
        return (
          <article className={`inbox-thread ${hasUnread ? "unread" : ""}`} key={id} onClick={() => hasUnread && markThreadRead(id)}>
            <h3 className="font-bold">
              {t("orderNumber")} <bdi>#{id}</bdi>
            </h3>
            {thread.map((m) => (
              <p className={`thread-msg from-${m.from}`} key={m.id}>
                <strong>{fromLabel(m, t, true)}</strong> {messageText(m, t)}
              </p>
            ))}
            <div className="quick-replies">
              {quick.map((k) => (
                <button type="button" key={k} onClick={() => send(t(k))}>
                  {t(k)}
                </button>
              ))}
            </div>
            <form
              className="thread-form"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <input
                value={draft}
                dir="auto"
                placeholder={t("inboxReply")}
                aria-label={t("inboxReply")}
                onChange={(e) => setDrafts((d) => ({ ...d, [id]: e.target.value }))}
              />
              <Button type="submit" disabled={!draft.trim()}>
                {t("inboxSend")}
              </Button>
            </form>
          </article>
        );
      })}
    </section>
  );
}
