import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/db/queries";
import { ProductCard } from "@/components/products/product-card";
import { ProductList } from "@/components/products/product-list";

export const metadata = {
  title: "Online Shop",
  description: "オンラインショップのトップページです。",
};

export default async function HomePage() {
  return <ProductList />;
}
