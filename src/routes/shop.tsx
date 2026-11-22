import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category?: number } => {
    const n = Number(search["category"]);
    return Number.isInteger(n) && n >= 0 && n < 6 ? { category: n } : {};
  },
  pendingComponent: LoadingState,
  head: () => pageHead("market"),
  component: CatalogPage,
});
