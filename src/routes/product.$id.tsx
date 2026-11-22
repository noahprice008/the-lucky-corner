import { LoadingState } from "@/components/store/common";
import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/store/catalog";
import { pageHead } from "@/data/page-head";
import { products } from "@/data/mock";
export const Route = createFileRoute("/product/$id")({
  pendingComponent: LoadingState,
  head: ({ params }) => {
    const p = products.find((p) => p.id === params.id);
    const head = pageHead("product");
    return p
      ? {
          meta: head.meta.map((m) =>
            "title" in m
              ? { title: `${p.name[0]} · פינת המזל` }
              : m.property === "og:title"
                ? { property: "og:title", content: `${p.name[0]} · פינת המזל` }
                : m,
          ),
        }
      : head;
  },
  component: ProductDetail,
});
function ProductDetail() {
  const { id } = Route.useParams();
  return <ProductPage id={id} />;
}
