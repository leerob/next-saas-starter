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
