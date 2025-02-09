import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getOrderById, getOrderItems } from "@/lib/db/queries/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const orderId = parseInt(id);
  const order = await getOrderById(orderId);

  if (!order) {
    redirect("/orders");
  }

  // 他のユーザーの注文は見れないようにする
  if (order.userId !== session.user.id) {
    redirect("/orders");
  }

  // 支払い済みの注文のみ表示
  if (order.status !== "paid") {
    redirect("/orders");
  }

  const orderItems = await getOrderItems(orderId);

  return (
    <div className="container max-w-2xl py-24">
      <Card>
        <CardHeader>
          <CardTitle>注文詳細</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>注文番号</div>
            <div>{order.id}</div>
          </div>
          <div className="flex items-center justify-between">
            <div>注文日時</div>
            <div>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</div>
          </div>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.product?.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      数量: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {formatPrice(
                    Number(item.price) * item.quantity,
                    item.currency
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-semibold">合計</div>
            <div className="text-lg font-semibold">
              {formatPrice(Number(order.totalAmount), order.currency)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
