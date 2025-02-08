import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/db/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden" role="article">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl ?? ""}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold">
              {Number(product.price).toLocaleString("ja-JP")}
              <span className="ml-1 text-sm">円</span>
            </p>
            <p className="text-sm text-gray-500">在庫: {product.stock}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>商品詳細</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
