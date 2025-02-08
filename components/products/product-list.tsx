import { getProducts } from "@/lib/db/queries";
import { ProductCard } from "./product-card";

export async function ProductList() {
  const products = await getProducts();

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">商品一覧</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
