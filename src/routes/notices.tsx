import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { NoticesPage } from "@/components/store/community";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/notices")({
  pendingComponent: LoadingState,
  head: () => pageHead("notices"),
  component: NoticesPage,
});
