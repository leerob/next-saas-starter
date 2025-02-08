import { Product } from "@/lib/db/schema";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "プロテインシェイク - バニラ",
    description:
      "高品質なホエイプロテインを使用した美味しいバニラ風味のプロテインシェイク。1食あたり20gのタンパク質を含有。",
    price: "3500",
    currency: "JPY",
    imageUrl:
      "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800&q=80",
    stock: 100,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  },
  {
    id: 2,
    name: "ヨガマット - プレミアム",
    description:
      "環境に優しい素材を使用した、滑り止め付きの高品質ヨガマット。厚さ6mm。",
    price: "5000",
    currency: "JPY",
    imageUrl:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    stock: 50,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  },
  {
    id: 3,
    name: "ダンベル 5kg セット",
    description:
      "耐久性のある素材で作られた5kgのダンベルセット。快適なグリップ付き。",
    price: "4500",
    currency: "JPY",
    imageUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    stock: 30,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  },
  {
    id: 4,
    name: "スポーツドリンク 24本セット",
    description:
      "電解質とビタミンを含む、運動時の水分補給に最適なスポーツドリンク。",
    price: "2800",
    currency: "JPY",
    imageUrl:
      "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800&q=80",
    stock: 200,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  },
  {
    id: 5,
    name: "トレーニンググローブ",
    description:
      "手のひらの保護と滑り止め効果があるトレーニング用グローブ。サイズ：M",
    price: "2000",
    currency: "JPY",
    imageUrl:
      "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=800&q=80",
    stock: 75,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  },
  {
    id: 6,
    name: "ジムバッグ - プロフェッショナル",
    description: "大容量で多機能なジムバッグ。シューズ収納部屋付き。",
    price: "6500",
    currency: "JPY",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    stock: 40,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
  },
];
