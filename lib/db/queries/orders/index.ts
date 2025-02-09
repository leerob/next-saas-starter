import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { orders, orderItems, products } from "../../schema";
import type {
  NewOrder,
  NewOrderItem,
  Order,
  OrderItem,
  Product,
} from "../../schema";
import { USE_MOCK } from "@/lib/config";
import {
  createMockOrder,
  createMockOrderItems,
  getMockOrderById,
  getMockOrderItems,
  getMockOrdersByUserId,
  updateMockOrderStatus,
  getMockOrderByStripeSessionId,
} from "@/lib/mock/orders";

export async function createOrder(data: NewOrder): Promise<Order> {
  if (USE_MOCK) {
    return createMockOrder(data);
  }

  const result = await db.insert(orders).values(data).returning();
  return result[0];
}

export async function createOrderItems(
  items: NewOrderItem[]
): Promise<OrderItem[]> {
  if (USE_MOCK) {
    return createMockOrderItems(items);
  }

  const result = await db.insert(orderItems).values(items).returning();
  return result;
}

export async function getOrderById(id: number): Promise<Order | null> {
  if (USE_MOCK) {
    return getMockOrderById(id);
  }

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getOrderItems(
  orderId: number
): Promise<(OrderItem & { product: Product | null })[]> {
  if (USE_MOCK) {
    return getMockOrderItems(orderId);
  }

  return await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      currency: orderItems.currency,
      createdAt: orderItems.createdAt,
      updatedAt: orderItems.updatedAt,
      product: products,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  if (USE_MOCK) {
    return getMockOrdersByUserId(userId);
  }

  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(orders.createdAt);
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  stripePaymentIntentId?: string | null,
  stripeSessionId?: string | null
): Promise<Order> {
  if (USE_MOCK) {
    return updateMockOrderStatus(
      orderId,
      status,
      stripePaymentIntentId,
      stripeSessionId
    );
  }

  const updateData: Partial<Order> = {
    status,
    updatedAt: new Date(),
  };

  if (stripePaymentIntentId) {
    updateData.stripePaymentIntentId = stripePaymentIntentId;
  }

  if (stripeSessionId) {
    updateData.stripeSessionId = stripeSessionId;
  }

  const result = await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId))
    .returning();

  return result[0];
}

export async function getOrderByStripeSessionId(
  sessionId: string
): Promise<Order | null> {
  if (USE_MOCK) {
    return getMockOrderByStripeSessionId(sessionId);
  }

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId))
    .limit(1);
  return result[0] ?? null;
}
