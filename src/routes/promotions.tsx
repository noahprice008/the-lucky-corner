import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { PromotionsPage } from "@/components/store/community";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/promotions")({
  pendingComponent: LoadingState,
  head: () => pageHead("promotions"),
  component: PromotionsPage,
});
