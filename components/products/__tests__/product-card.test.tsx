import { render, screen } from "@testing-library/react";
import { ProductCard } from "../product-card";
import { mockProducts } from "@/lib/mock/products";

describe("ProductCard", () => {
  const mockProduct = mockProducts[0];

  it("商品情報が正しく表示されること", () => {
    render(<ProductCard product={mockProduct} />);

    // 商品名が表示されていることを確認
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

    // 商品説明が表示されていることを確認
    if (mockProduct.description) {
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    }

    // 価格が正しく表示されていることを確認
    const price = Number(mockProduct.price).toLocaleString("ja-JP");
    const priceElement = screen.getByText((content) => content.includes(price));
    expect(priceElement).toBeInTheDocument();

    // 在庫数が表示されていることを確認
    expect(screen.getByText(`在庫: ${mockProduct.stock}`)).toBeInTheDocument();

    // 商品詳細リンクが正しいURLを持っていることを確認
    const detailLink = screen.getByRole("link", { name: "商品詳細" });
    expect(detailLink).toHaveAttribute("href", `/products/${mockProduct.id}`);

    // 商品画像が正しく表示されていることを確認
    const image = screen.getByRole("img", { name: mockProduct.name });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");

    // 商品カードがarticleロールを持っていることを確認
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
