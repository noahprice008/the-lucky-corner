import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/store/home";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/")({
  pendingComponent: LoadingState,
  head: () => pageHead("home"),
  component: HomePage,
});
