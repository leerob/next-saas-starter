"use client";

import { Button } from "@/components/ui/button";
import { CartItem, Product } from "@/lib/db/schema";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  items: (CartItem & { product: Product })[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const router = useRouter();

  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <h2 className="text-lg font-semibold">注文内容</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>小計</span>
          <span>{formatPrice(subtotal, "JPY")}</span>
        </div>
        <div className="flex justify-between">
          <span>消費税（10%）</span>
          <span>{formatPrice(tax, "JPY")}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>合計</span>
          <span>{formatPrice(total, "JPY")}</span>
        </div>
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        レジに進む
      </Button>
    </div>
  );
}
