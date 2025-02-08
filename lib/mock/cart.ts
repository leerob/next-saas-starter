import { Cart, CartItem } from "@/lib/db/schema";

export const mockCarts: Cart[] = [
  {
    id: 1,
    userId: 1,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 2,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockCartItems: CartItem[] = [
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
    productId: 3,
    quantity: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    cartId: 2,
    productId: 2,
    quantity: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
