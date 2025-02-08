import { render, screen } from "@testing-library/react";
import { ProductList } from "../product-list";
import { mockProducts } from "@/lib/mock/products";
import * as queries from "@/lib/db/queries";

// getProductsをモック化
jest.mock("@/lib/db/queries", () => ({
  getProducts: jest.fn(),
}));

describe("ProductList", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    // getProductsのモック実装を設定
    (queries.getProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  it("商品一覧が正しく表示されること", async () => {
    render(await ProductList());

    // タイトルが表示されていることを確認
    expect(
      screen.getByRole("heading", { name: "商品一覧" })
    ).toBeInTheDocument();

    // すべての商品が表示されていることを確認
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();

      if (product.description) {
        expect(screen.getByText(product.description)).toBeInTheDocument();
      }

      const price = Number(product.price).toLocaleString("ja-JP");
      const priceElement = screen.getByText((content) =>
        content.includes(price)
      );
      expect(priceElement).toBeInTheDocument();

      expect(screen.getByText(`在庫: ${product.stock}`)).toBeInTheDocument();
    });

    // 商品カードの数が正しいことを確認
    const productCards = screen.getAllByRole("article");
    expect(productCards).toHaveLength(mockProducts.length);

    // getProductsが1回呼ばれたことを確認
    expect(queries.getProducts).toHaveBeenCalledTimes(1);
  });
});
