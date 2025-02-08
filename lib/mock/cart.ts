import { Cart, CartItem } from "../db/schema";
import { mockProducts } from "./products";

// グローバルステートの型定義
declare global {
  var __mockCarts: Cart[];
  var __mockCartItems: CartItem[];
  var __maxCartItemId: number;
}

// グローバルステートの初期化
if (!global.__mockCarts) {
  global.__mockCarts = [
    {
      id: 1,
      userId: 1,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

if (!global.__mockCartItems) {
  global.__mockCartItems = [
    {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      cartId: 1,
      productId: 2,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

if (!global.__maxCartItemId) {
  global.__maxCartItemId = Math.max(
    ...global.__mockCartItems.map((item) => item.id)
  );
}

// モックカート操作関数
export function getMockCartItems(cartId: number) {
  console.log("getMockCartItems");
  return global.__mockCartItems
    .filter((item) => item.cartId === cartId)
    .map((item) => ({
      ...item,
      product: mockProducts.find((p) => p.id === item.productId)!,
    }));
}

export function getMockCart(userId: number) {
  console.log("getMockCart");
  return global.__mockCarts.find((cart) => cart.userId === userId) || null;
}

export function createMockCart(userId: number): Cart {
  console.log("createMockCart");
  const newCart: Cart = {
    id: global.__mockCarts.length + 1,
    userId,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  global.__mockCarts.push(newCart);
  return newCart;
}

export function addMockCartItem(
  cartId: number,
  productId: number,
  quantity: number
) {
  console.log("addMockCartItem");
  const existingItem = global.__mockCartItems.find(
    (item) => item.cartId === cartId && item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.updatedAt = new Date();
    return existingItem;
  }

  const newItem: CartItem = {
    id: ++global.__maxCartItemId,
    cartId,
    productId,
    quantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  global.__mockCartItems.push(newItem);
  return newItem;
}

export function updateMockCartItemQuantity(
  cartItemId: number,
  quantity: number
) {
  console.log("updateMockCartItemQuantity");
  const index = global.__mockCartItems.findIndex(
    (item) => item.id === cartItemId
  );
  if (index === -1) throw new Error("Cart item not found");

  global.__mockCartItems[index] = {
    ...global.__mockCartItems[index],
    quantity,
    updatedAt: new Date(),
  };

  return global.__mockCartItems[index];
}

export function removeMockCartItem(cartItemId: number) {
  console.log("removeMockCartItem");
  const index = global.__mockCartItems.findIndex(
    (item) => item.id === cartItemId
  );
  if (index === -1) throw new Error("Cart item not found");

  global.__mockCartItems.splice(index, 1);
}

export function clearMockCart(cartId: number) {
  console.log("clearMockCart");
  global.__mockCartItems = global.__mockCartItems.filter(
    (item) => item.cartId !== cartId
  );
}
