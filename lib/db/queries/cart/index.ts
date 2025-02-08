import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { carts, cartItems, products } from "../../schema";
import type { Cart, CartItem, Product } from "../../schema";
import {
  getMockCart,
  createMockCart,
  getMockCartItems,
  addMockCartItem,
  updateMockCartItemQuantity,
  removeMockCartItem,
  clearMockCart,
} from "../../../mock/cart";
import { USE_MOCK } from "../../../config";

export async function getCartForUser(userId: number): Promise<Cart | null> {
  if (USE_MOCK) {
    return getMockCart(userId);
  }

  const result = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.status, "active")))
    .limit(1);

  return result[0] ?? null;
}

export async function getCartItems(
  cartId: number
): Promise<(CartItem & { product: Product | null })[]> {
  if (USE_MOCK) {
    return getMockCartItems(cartId);
  }

  return await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      updatedAt: cartItems.updatedAt,
      product: products,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));
}

export async function createCart(userId: number): Promise<Cart> {
  if (USE_MOCK) {
    return createMockCart(userId);
  }

  const result = await db
    .insert(carts)
    .values({
      userId,
      status: "active",
    })
    .returning();

  return result[0];
}

export async function addToCart(
  cartId: number,
  productId: number,
  quantity: number = 1
): Promise<CartItem> {
  if (USE_MOCK) {
    return addMockCartItem(cartId, productId, quantity);
  }

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
    )
    .limit(1);

  if (existingItem.length > 0) {
    const result = await db
      .update(cartItems)
      .set({
        quantity: existingItem[0].quantity + quantity,
        updatedAt: new Date(),
      })
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))
      )
      .returning();
    return result[0];
  }

  const result = await db
    .insert(cartItems)
    .values({
      cartId,
      productId,
      quantity,
    })
    .returning();

  return result[0];
}

export async function updateCartItemQuantity(
  cartItemId: number,
  quantity: number
): Promise<CartItem> {
  if (USE_MOCK) {
    return updateMockCartItemQuantity(cartItemId, quantity);
  }

  const result = await db
    .update(cartItems)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(eq(cartItems.id, cartItemId))
    .returning();

  return result[0] ?? null;
}

export async function removeFromCart(cartItemId: number): Promise<void> {
  if (USE_MOCK) {
    return removeMockCartItem(cartItemId);
  }

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(cartId: number) {
  if (USE_MOCK) {
    return clearMockCart(cartId);
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}
