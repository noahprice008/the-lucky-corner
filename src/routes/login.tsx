import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/store/account";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/login")({
  pendingComponent: LoadingState,
  head: () => pageHead("login"),
  component: LoginPage,
});
