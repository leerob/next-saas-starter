import { Cart, CartItem } from "../db/schema";
import { mockProducts } from "./products";

// カートの状態を保持する変数
let mockCarts: Cart[] = [
  {
    id: 1,
    userId: 1,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockCartItems: CartItem[] = [
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

// カートアイテムの最大IDを追跡
let maxCartItemId = Math.max(...mockCartItems.map((item) => item.id));

// モックカート操作関数
export function getMockCartItems(cartId: number) {
  console.log("getMockCartItems");
  return mockCartItems
    .filter((item) => item.cartId === cartId)
    .map((item) => ({
      ...item,
      product: mockProducts.find((p) => p.id === item.productId)!,
    }));
}

export function getMockCart(userId: number) {
  console.log("getMockCart");
  return mockCarts.find((cart) => cart.userId === userId) || null;
}

export function createMockCart(userId: number): Cart {
  console.log("createMockCart");
  const newCart: Cart = {
    id: mockCarts.length + 1,
    userId,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockCarts.push(newCart);
  return newCart;
}

export function addMockCartItem(
  cartId: number,
  productId: number,
  quantity: number
) {
  console.log("addMockCartItem");
  const existingItem = mockCartItems.find(
    (item) => item.cartId === cartId && item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.updatedAt = new Date();
    return existingItem;
  }

  const newItem: CartItem = {
    id: ++maxCartItemId,
    cartId,
    productId,
    quantity,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockCartItems.push(newItem);
  return newItem;
}

export function updateMockCartItemQuantity(
  cartItemId: number,
  quantity: number
) {
  console.log("updateMockCartItemQuantity");
  const index = mockCartItems.findIndex((item) => item.id === cartItemId);
  if (index === -1) throw new Error("Cart item not found");

  mockCartItems[index] = {
    ...mockCartItems[index],
    quantity,
    updatedAt: new Date(),
  };

  console.log(mockCartItems[index]);
  console.log(mockCartItems);
  return mockCartItems[index];
}

export function removeMockCartItem(cartItemId: number) {
  console.log("removeMockCartItem");
  const index = mockCartItems.findIndex((item) => item.id === cartItemId);
  if (index === -1) throw new Error("Cart item not found");

  console.log(mockCartItems);
  mockCartItems.splice(index, 1);
}

export function clearMockCart(cartId: number) {
  console.log("clearMockCart");
  mockCartItems = mockCartItems.filter((item) => item.cartId !== cartId);
}
