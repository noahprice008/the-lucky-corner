import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { LotteryPage } from "@/components/store/community";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/lottery")({
  pendingComponent: LoadingState,
  head: () => pageHead("lottery"),
  component: LotteryPage,
});
