import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: currency,
  }).format(price);
}

// 消費税率（10%）
export const TAX_RATE = 0.1;

// 税抜価格から税込価格を計算
export function calculateTaxIncluded(price: number): number {
  return Math.round(price * (1 + TAX_RATE));
}

// 合計金額と消費税額を計算
export function calculateOrderAmount(subtotal: number): {
  tax: number;
  total: number;
} {
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  return { tax, total };
}
