import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { HistoryPage } from "@/components/store/account";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/history")({
  pendingComponent: LoadingState,
  head: () => pageHead("history"),
  component: HistoryPage,
});
