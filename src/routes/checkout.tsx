import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/store/checkout";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/checkout")({
  pendingComponent: LoadingState,
  head: () => pageHead("checkout"),
  component: CheckoutPage,
});
