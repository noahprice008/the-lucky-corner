import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "@/components/store/checkout";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/confirmation")({
  pendingComponent: LoadingState,
  head: () => pageHead("confirmation"),
  component: ConfirmationPage,
});
