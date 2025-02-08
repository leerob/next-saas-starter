import { ProductList } from "@/components/products/product-list";

export const metadata = {
  title: "商品一覧 - Online Shop",
  description: "オンラインショップの商品一覧ページです。",
};

export default async function HomePage() {
  return <ProductList />;
}
