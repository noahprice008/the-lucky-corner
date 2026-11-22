import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/store/checkout";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/cart")({
  pendingComponent: LoadingState,
  head: () => pageHead("cart"),
  component: CartPage,
});
