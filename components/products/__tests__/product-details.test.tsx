import { render, screen } from "@testing-library/react";
import { ProductDetails } from "../product-details";
import { mockProducts } from "@/lib/mock/products";

describe("ProductDetails", () => {
  const mockProduct = mockProducts[0];

  beforeEach(() => {
    if (
      !mockProduct.name ||
      !mockProduct.description ||
      !mockProduct.imageUrl
    ) {
      throw new Error("Mock product data is invalid");
    }
  });

  it("商品の詳細情報が正しく表示されること", () => {
    if (!mockProduct.description) return;
    render(<ProductDetails product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(/在庫: \d+ 個/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "カートに追加" })
    ).toBeInTheDocument();
    expect(screen.getByText(`商品ID: ${mockProduct.id}`)).toBeInTheDocument();
  });

  it("商品画像が正しく表示されること", () => {
    if (!mockProduct.imageUrl) return;
    render(<ProductDetails product={mockProduct} />);

    const image = screen.getByAltText(mockProduct.name) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain(encodeURIComponent(mockProduct.imageUrl));
  });
});
