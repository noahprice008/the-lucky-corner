import { Pin } from "lucide-react";
import type { Notice } from "@/data/mock";
import { useStore } from "./context";

/** One post as customers see it. Used on the notice board, home page and the owner's live preview. */
export function NoticeCard({ notice, featured = false }: { notice: Notice; featured?: boolean }) {
  const { t, tr } = useStore();
  return (
    <article className={`notice-card${featured ? " notice-featured" : ""}${notice.image ? " has-photo" : ""}`}>
      {notice.image && <img className="notice-photo" src={notice.image} alt="" loading="lazy" />}
      <div className="notice-body">
        <div className="notice-badges">
          <span className="notice-type">{t(notice.type)}</span>
          {notice.pinned && (
            <span className="notice-pinned">
              <Pin size={12} />
              {t("postPinned")}
            </span>
          )}
        </div>
        <h3>{tr(notice.title)}</h3>
        <p>{tr(notice.body)}</p>
        <p className="notice-date">
          <bdi>
            {notice.from} – {notice.until}
          </bdi>
        </p>
      </div>
    </article>
  );
}
