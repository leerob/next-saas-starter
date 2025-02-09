import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getOrdersByUserId } from "@/lib/db/queries/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const orders = await getOrdersByUserId(session.user.id);

  return (
    <div className="container max-w-2xl py-24">
      <Card>
        <CardHeader>
          <CardTitle>注文履歴</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500">
              注文履歴がありません
            </div>
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">注文番号: {order.id}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">
                      {formatPrice(Number(order.totalAmount), order.currency)}
                    </div>
                    <div className="text-sm text-right">
                      {order.status === "pending" && "支払い待ち"}
                      {order.status === "paid" && "支払い完了"}
                      {order.status === "failed" && "支払い失敗"}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
