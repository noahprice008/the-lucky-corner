import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/store/account";
import { pageHead } from "@/data/page-head";
export const Route = createFileRoute("/account")({
  pendingComponent: LoadingState,
  head: () => pageHead("account"),
  component: AccountPage,
});
