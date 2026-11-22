import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { EntryPage } from "@/components/store/home";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/entry")({
  pendingComponent: LoadingState,
  head: () => pageHead("entry"),
  component: EntryPage,
});
