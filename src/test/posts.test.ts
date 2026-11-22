import { describe, it, expect } from "vitest";
import { noticeStatus, livePosts, notices, products, type Notice } from "@/data/mock";

const base: Notice = { id: "x", title: ["כ", "T"], body: ["ג", "B"], type: "news", from: "2026-11-10", until: "2026-11-20" };

describe("Owner posts", () => {
  it("reports draft, scheduled, live and ended states by date", () => {
    expect(noticeStatus({ ...base, draft: true }, "2026-11-15")).toBe("draft");
    expect(noticeStatus(base, "2026-11-09")).toBe("scheduled");
    expect(noticeStatus(base, "2026-11-10")).toBe("live");
    expect(noticeStatus(base, "2026-11-20")).toBe("live");
    expect(noticeStatus(base, "2026-11-21")).toBe("expired");
  });
  it("shows customers only live posts, pinned first", () => {
    const list: Notice[] = [
      { ...base, id: "a" },
      { ...base, id: "b", pinned: true },
      { ...base, id: "c", draft: true },
      { ...base, id: "d", until: "2026-11-01" },
    ];
    expect(livePosts(list, "2026-11-15").map((n) => n.id)).toEqual(["b", "a"]);
  });
  it("seeds one pinned live post for the demo", () => {
    expect(livePosts(notices, "2026-11-22").some((n) => n.pinned)).toBe(true);
  });
  it("gives every product an illustration kind and keeps photo paths under /images/products", () => {
    for (const p of products) {
      expect(p.kind).toBeTruthy();
      if (p.image) expect(p.image).toMatch(/^\/images\/products\/\d+\.jpg$/);
    }
  });
});
