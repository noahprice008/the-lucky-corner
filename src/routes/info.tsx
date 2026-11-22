import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/store/community";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/info")({
  pendingComponent: LoadingState,
  head: () => pageHead("info"),
  component: InfoPage,
});
