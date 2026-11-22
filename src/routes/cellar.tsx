import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/store/catalog";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/cellar")({
  pendingComponent: LoadingState,
  head: () => pageHead("cellar"),
  component: () => <CatalogPage adult />,
});
