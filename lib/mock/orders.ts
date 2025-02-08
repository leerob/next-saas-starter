import { Order, OrderItem } from "@/lib/db/schema";
import type { NewOrder, NewOrderItem } from "@/lib/db/schema";
import { mockProducts } from "./products";

// グローバルステートの型定義
declare global {
  var __mockOrders: Order[];
  var __mockOrderItems: OrderItem[];
  var __maxOrderId: number;
  var __maxOrderItemId: number;
}

// グローバルステートの初期化
if (!global.__mockOrders) {
  global.__mockOrders = [];
}

if (!global.__mockOrderItems) {
  global.__mockOrderItems = [];
}

if (!global.__maxOrderId) {
  global.__maxOrderId = 0;
}

if (!global.__maxOrderItemId) {
  global.__maxOrderItemId = 0;
}

export async function createMockOrder(data: NewOrder): Promise<Order> {
  const newOrder: Order = {
    id: ++global.__maxOrderId,
    userId: data.userId,
    status: data.status ?? "pending",
    totalAmount: data.totalAmount,
    currency: data.currency ?? "JPY",
    stripeSessionId: data.stripeSessionId ?? null,
    stripePaymentIntentId: data.stripePaymentIntentId ?? null,
    shippingAddress: data.shippingAddress ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  global.__mockOrders.push(newOrder);
  return newOrder;
}

export async function createMockOrderItems(
  items: NewOrderItem[]
): Promise<OrderItem[]> {
  const newItems = items.map((item) => ({
    id: ++global.__maxOrderItemId,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    currency: item.currency ?? "JPY",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  global.__mockOrderItems.push(...newItems);
  return newItems;
}

export async function getMockOrderById(id: number): Promise<Order | null> {
  return global.__mockOrders.find((order) => order.id === id) ?? null;
}

export async function getMockOrderItems(
  orderId: number
): Promise<(OrderItem & { product: (typeof mockProducts)[0] | null })[]> {
  return global.__mockOrderItems
    .filter((item) => item.orderId === orderId)
    .map((item) => ({
      ...item,
      product: mockProducts.find((p) => p.id === item.productId) ?? null,
    }));
}

export async function getMockOrdersByUserId(userId: number): Promise<Order[]> {
  return global.__mockOrders.filter((order) => order.userId === userId);
}

export async function updateMockOrderStatus(
  orderId: number,
  status: string,
  stripePaymentIntentId?: string | null,
  stripeSessionId?: string | null
): Promise<Order> {
  const order = global.__mockOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;
  order.updatedAt = new Date();

  if (stripePaymentIntentId) {
    order.stripePaymentIntentId = stripePaymentIntentId;
  }

  if (stripeSessionId) {
    order.stripeSessionId = stripeSessionId;
  }

  return order;
}

export async function getMockOrderByStripeSessionId(
  sessionId: string
): Promise<Order | null> {
  return (
    global.__mockOrders.find((order) => order.stripeSessionId === sessionId) ??
    null
  );
}
