import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { StaffPage } from "@/components/store/dashboards";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/staff")({
  pendingComponent: LoadingState,
  head: () => pageHead("staff"),
  component: StaffPage,
});
