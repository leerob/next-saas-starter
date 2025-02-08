import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/products/product-details";
import { mockProducts } from "@/lib/mock/products";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8">
      <ProductDetails product={product} />
    </div>
  );
}
