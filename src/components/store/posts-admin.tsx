import { useMemo, useRef, useState, type FormEvent } from "react";
import { ImagePlus, Megaphone, Pencil, Pin, PinOff, Plus, Trash2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { noticeStatus, type Notice } from "@/data/mock";
import { localDate } from "@/data/slots";
import { useStore } from "./context";
import { NoticeCard } from "./notice-card";

type Draft = {
  id: string | null;
  title: string;
  text: string;
  titleEn: string;
  textEn: string;
  type: Notice["type"];
  from: string;
  until: string;
  pinned: boolean;
  image: string;
};

const today = () => localDate(new Date());
const inDays = (n: number) => localDate(new Date(Date.now() + n * 86400000));
const empty = (): Draft => ({
  id: null,
  title: "",
  text: "",
  titleEn: "",
  textEn: "",
  type: "specials",
  from: today(),
  until: inDays(7),
  pinned: false,
  image: "",
});

// One-tap starting points so the owner never faces a blank form.
const templates: { label: [string, string]; fill: Partial<Draft> }[] = [
  {
    label: ["🔥 מבצע סוף שבוע", "🔥 Weekend special"],
    fill: {
      type: "specials",
      title: "מבצע סוף שבוע",
      text: "מבצע מיוחד על מוצרים נבחרים עד יום שישי בשעה 15:00. הזמינו מראש ואספו בפינה.",
      titleEn: "Weekend special",
      textEn: "A special deal on selected items until Friday 15:00. Order ahead and pick up at the corner.",
    },
  },
  {
    label: ["☕ טרי היום", "☕ Fresh today"],
    fill: {
      type: "news",
      title: "טרי היום בפינה",
      text: "קפה הפוך, מאפים ולחם טרי מחכים לכם מ־07:00.",
      titleEn: "Fresh today at the corner",
      textEn: "Fresh latte, pastries and bread waiting for you from 07:00.",
    },
  },
  {
    label: ["🕒 שעות מיוחדות", "🕒 Special hours"],
    fill: {
      type: "news",
      title: "שעות פעילות מיוחדות",
      text: "ביום זה נסגור מוקדם. ניתן להזמין מראש ולבחור שעת איסוף.",
      titleEn: "Special opening hours",
      textEn: "We close early on this day. You can still order ahead and pick a pickup time.",
    },
  },
  {
    label: ["🎒 חזרה ללימודים", "🎒 Back to school"],
    fill: {
      type: "school",
      title: "חזרה ללימודים",
      text: "מחברות, עטים ועפרונות במחירים מיוחדים לתלמידי השכונה.",
      titleEn: "Back to school",
      textEn: "Notebooks, pens and pencils at special prices for neighborhood students.",
    },
  },
];

// Downscale the chosen photo so demo state stays light.
function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode"));
      img.onload = () => {
        const k = Math.min(1, 900 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function PostsManager() {
  const { t, tr, notices, setNotices, toast } = useStore();
  const [d, setD] = useState<Draft>(empty());
  const fileRef = useRef<HTMLInputElement>(null);
  const day = today();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((o) => ({ ...o, [k]: v }));

  const counts = useMemo(() => {
    const status = notices.map((n) => noticeStatus(n, day));
    return {
      live: status.filter((s) => s === "live").length,
      pinned: notices.filter((n) => n.pinned && !n.draft).length,
      draft: status.filter((s) => s === "draft").length,
    };
  }, [notices, day]);

  const preview: Notice = {
    id: d.id ?? "preview",
    title: [d.title || "…", d.titleEn],
    body: [d.text || "…", d.textEn],
    type: d.type,
    from: d.from,
    until: d.until,
    pinned: d.pinned,
    ...(d.image ? { image: d.image } : {}),
  };

  const save = (asDraft: boolean) => {
    if (!d.title.trim() || !d.text.trim()) return;
    if (d.until < d.from) {
      toast(t("postDateError"));
      return;
    }
    const post: Notice = {
      id: d.id ?? `n${Date.now()}`,
      title: [d.title.trim(), d.titleEn.trim()],
      body: [d.text.trim(), d.textEn.trim()],
      type: d.type,
      from: d.from,
      until: d.until,
      pinned: d.pinned,
      draft: asDraft,
      ...(d.image ? { image: d.image } : {}),
    };
    setNotices((old) =>
      d.id ? old.map((n) => (n.id === d.id ? post : n)) : [post, ...old],
    );
    setD(empty());
    toast(t(asDraft ? "postSavedDraft" : "postPublished"));
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    save(false);
  };
  const edit = (n: Notice) => {
    setD({
      id: n.id,
      title: n.title[0],
      text: n.body[0],
      titleEn: n.title[1],
      textEn: n.body[1],
      type: n.type,
      from: n.from,
      until: n.until,
      pinned: !!n.pinned,
      image: n.image ?? "",
    });
    document.getElementById("posts")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const patch = (id: string, change: Partial<Notice>) =>
    setNotices((old) => old.map((n) => (n.id === id ? { ...n, ...change } : n)));
  const label = (n: Notice) =>
    ({ live: "postLive", scheduled: "postScheduled", expired: "postExpired", draft: "postDraft" } as const)[
      noticeStatus(n, day)
    ];

  return (
    <section id="posts" className="posts-hero" aria-labelledby="posts-heading">
      <header className="posts-head">
        <div className="posts-title">
          <span className="posts-icon">
            <Megaphone />
          </span>
          <div>
            <h2 id="posts-heading">{t("postsTitle")}</h2>
            <p>{t("postsSubtitle")}</p>
          </div>
        </div>
        <ul className="posts-stats">
          <li>
            <bdi>{counts.live}</bdi> {t("postsLiveCount")}
          </li>
          <li>
            <bdi>{counts.pinned}</bdi> {t("postsPinnedCount")}
          </li>
          <li>
            <bdi>{counts.draft}</bdi> {t("postsDraftCount")}
          </li>
        </ul>
      </header>

      <div className="posts-grid">
        <form className="post-form" onSubmit={onSubmit}>
          <div className="post-form-head">
            <h3>{t(d.id ? "postsEdit" : "postsNew")}</h3>
            {d.id && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setD(empty())}>
                <X size={14} />
                {t("postCancel")}
              </Button>
            )}
          </div>
          {!d.id && (
            <div className="post-templates" role="group" aria-label={t("postsQuick")}>
              <span>{t("postsQuick")}</span>
              {templates.map((tpl) => (
                <button
                  type="button"
                  key={tpl.label[0]}
                  onClick={() => setD((o) => ({ ...o, ...tpl.fill }))}
                >
                  {tr(tpl.label)}
                </button>
              ))}
            </div>
          )}
          <label className="form-field">
            {t("postTitle")}
            <input required value={d.title} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="form-field">
            {t("postText")}
            <textarea required rows={3} value={d.text} onChange={(e) => set("text", e.target.value)} />
          </label>
          <details className="post-english">
            <summary>{t("postTitleEn")}</summary>
            <label className="form-field">
              {t("postTitleEn")}
              <input dir="ltr" value={d.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
            </label>
            <label className="form-field">
              {t("postTextEn")}
              <textarea dir="ltr" rows={2} value={d.textEn} onChange={(e) => set("textEn", e.target.value)} />
            </label>
          </details>
          <div className="form-grid">
            <label className="form-field">
              {t("type")}
              <select
                value={d.type}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "news" || v === "specials" || v === "school") set("type", v);
                }}
              >
                <option value="specials">{t("specials")}</option>
                <option value="news">{t("news")}</option>
                <option value="school">{t("school")}</option>
              </select>
            </label>
            <div className="form-field">
              {t("postAddPhoto")}
              <div className="post-photo-row">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      set("image", await readPhoto(f));
                    } catch {
                      /* unreadable file: keep the current photo */
                    }
                    e.target.value = "";
                  }}
                />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                  <ImagePlus size={16} />
                  {t("postAddPhoto")}
                </Button>
                {d.image && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => set("image", "")}>
                    {t("postRemovePhoto")}
                  </Button>
                )}
              </div>
            </div>
            <label className="form-field">
              {t("from")}
              <input type="date" required value={d.from} onChange={(e) => set("from", e.target.value)} />
            </label>
            <label className="form-field">
              {t("until")}
              <input type="date" required min={d.from} value={d.until} onChange={(e) => set("until", e.target.value)} />
            </label>
          </div>
          <label className="toggle-row">
            {t("postPin")}
            <input type="checkbox" checked={d.pinned} onChange={(e) => set("pinned", e.target.checked)} />
          </label>
          <div className="post-actions">
            <Button type="submit">
              <Plus />
              {t(d.id ? "postUpdate" : "postPublish")}
            </Button>
            <Button type="button" variant="outline" onClick={() => save(true)}>
              {t("postSaveDraft")}
            </Button>
          </div>
        </form>

        <div className="post-side">
          <h3>{t("postPreview")}</h3>
          <div className="post-preview">
            <NoticeCard notice={preview} featured />
          </div>
          <h3 className="mt-6">{t("postYours")}</h3>
          {notices.length === 0 && <p className="text-muted-foreground">{t("postNone")}</p>}
          <ul className="post-list">
            {notices.map((n) => {
              const st = noticeStatus(n, day);
              return (
                <li key={n.id} className="post-row">
                  <div className="post-row-main">
                    <span className={`post-status post-status-${st}`}>{t(label(n))}</span>
                    {n.pinned && <Pin size={13} className="post-pin-mark" aria-label={t("postPinned")} />}
                    <strong>{tr(n.title)}</strong>
                    <small>
                      <bdi>
                        {n.from} – {n.until}
                      </bdi>
                    </small>
                  </div>
                  <div className="post-row-actions">
                    <Button variant="ghost" size="icon" aria-label={t("postEditAction")} onClick={() => edit(n)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t(n.pinned ? "postUnpinAction" : "postPinAction")}
                      onClick={() => patch(n.id, { pinned: !n.pinned })}
                    >
                      {n.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t(n.draft ? "postRepublish" : "postUnpublish")}
                      onClick={() => patch(n.id, { draft: !n.draft })}
                    >
                      {n.draft ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("postDelete")}
                      onClick={() => {
                        setNotices((old) => old.filter((x) => x.id !== n.id));
                        toast(t("postDeleted"));
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
