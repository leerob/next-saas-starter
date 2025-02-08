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
} from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import { mockProducts } from "@/lib/mock/products";
import { mockUser } from "@/lib/mock/user";
import { mockCarts, mockCartItems } from "@/lib/mock/cart";

const USE_MOCK = process.env.USE_MOCK === "true";

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

export async function getCartForUser(userId: number) {
  if (USE_MOCK) {
    return mockCarts.find((cart) => cart.userId === userId) ?? null;
  }

  const result = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.status, "active")))
    .limit(1);

  return result[0] ?? null;
}

export async function getCartItems(cartId: number) {
  if (USE_MOCK) {
    return mockCartItems
      .filter((item) => item.cartId === cartId)
      .map((item) => ({
        ...item,
        product: mockProducts.find((p) => p.id === item.productId)!,
      }));
  }

  return await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: products,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));
}

export async function createCart(userId: number) {
  if (USE_MOCK) {
    const newCart = {
      id: mockCarts.length + 1,
      userId,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCarts.push(newCart);
    return newCart;
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
  quantity: number
) {
  if (USE_MOCK) {
    const existingItem = mockCartItems.find(
      (item) => item.cartId === cartId && item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.updatedAt = new Date();
      return existingItem;
    }

    const newItem = {
      id: mockCartItems.length + 1,
      cartId,
      productId,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCartItems.push(newItem);
    return newItem;
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
) {
  if (USE_MOCK) {
    const item = mockCartItems.find((item) => item.id === cartItemId);
    if (item) {
      item.quantity = quantity;
      item.updatedAt = new Date();
      return item;
    }
    return null;
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

export async function removeFromCart(cartItemId: number) {
  if (USE_MOCK) {
    const index = mockCartItems.findIndex((item) => item.id === cartItemId);
    if (index !== -1) {
      mockCartItems.splice(index, 1);
    }
    return;
  }

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(cartId: number) {
  if (USE_MOCK) {
    const cartIndex = mockCartItems.findIndex((item) => item.cartId === cartId);
    if (cartIndex !== -1) {
      mockCartItems.splice(cartIndex);
    }
    return;
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}
