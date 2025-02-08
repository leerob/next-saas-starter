import { desc, and, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import {
  activityLogs,
  teamMembers,
  teams,
  users,
  carts,
  cartItems,
  products,
  Cart,
  CartItem,
  Product,
  User,
} from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/session";
import { mockUser } from "../mock/user";
import { mockProducts } from "../mock/products";
import {
  getMockCart,
  createMockCart,
  getMockCartItems,
  addMockCartItem,
  updateMockCartItemQuantity,
  removeMockCartItem,
  clearMockCart,
} from "../mock/cart";
import { USE_MOCK } from "../config";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  if (USE_MOCK) {
    return mockUser; // 開発用のモックユーザーを返す
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function getProducts() {
  if (USE_MOCK) {
    return mockProducts;
  }
  return await db.select().from(products);
}

export async function getProductById(id: number) {
  if (USE_MOCK) {
    return mockProducts.find((product) => product.id === id) ?? null;
  }
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0] ?? null;
}

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
