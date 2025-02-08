"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/db/queries";
import {
  getCartForUser,
  createCart,
  addToCart as dbAddToCart,
  updateCartItemQuantity as dbUpdateCartItemQuantity,
  removeFromCart as dbRemoveFromCart,
} from "@/lib/db/queries";

export async function addToCart(productId: number, quantity: number = 1) {
  const user = await getUser();
  if (!user) {
    throw new Error("ログインが必要です");
  }

  let cart = await getCartForUser(user.id);
  if (!cart) {
    cart = await createCart(user.id);
  }

  await dbAddToCart(cart.id, productId, quantity);
  revalidatePath("/cart");
}

export async function updateCartItemQuantity(
  cartItemId: number,
  quantity: number
) {
  const user = await getUser();
  if (!user) {
    throw new Error("ログインが必要です");
  }

  await dbUpdateCartItemQuantity(cartItemId, quantity);
  revalidatePath("/cart");
}

export async function removeFromCart(cartItemId: number) {
  const user = await getUser();
  if (!user) {
    throw new Error("ログインが必要です");
  }

  await dbRemoveFromCart(cartItemId);
  revalidatePath("/cart");
}
