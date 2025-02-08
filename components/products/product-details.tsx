import { Product } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  if (!product.name || !product.description || !product.imageUrl) {
    return <div>商品情報が見つかりません</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-lg">{product.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {formatPrice(Number(product.price), product.currency)}
            </p>
            <p className="text-sm text-gray-500">在庫: {product.stock} 個</p>
          </div>
          <Button className="w-full" size="lg">
            カートに追加
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        <p>商品ID: {product.id}</p>
      </CardFooter>
    </Card>
  );
}
