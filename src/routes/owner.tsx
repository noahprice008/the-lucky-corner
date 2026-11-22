import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { OwnerPage } from "@/components/store/dashboards";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/owner")({
  pendingComponent: LoadingState,
  head: () => pageHead("owner"),
  component: OwnerPage,
});
