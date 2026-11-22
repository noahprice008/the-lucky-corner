import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { SupportPage } from "@/components/store/community";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/support")({
  pendingComponent: LoadingState,
  head: () => pageHead("support"),
  component: SupportPage,
});
