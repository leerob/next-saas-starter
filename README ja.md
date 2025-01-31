# Next.js SaaS スターター

これは、認証サポート、支払いのためのStripe統合、およびログインユーザー向けのダッシュボードを備えたSaaSアプリケーションを構築するためのスターターテンプレートです。

**デモ: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## 特徴

- アニメーション付きターミナル要素を持つマーケティングランディングページ (`/`)
- Stripe Checkoutに接続する価格ページ (`/pricing`)
- ユーザー/チームのCRUD操作が可能なダッシュボードページ
- オーナーとメンバーの役割を持つ基本的なRBAC
- Stripeカスタマーポータルを使用したサブスクリプション管理
- JWTをクッキーに保存するメール/パスワード認証
- ログインルートを保護するグローバルミドルウェア
- サーバーアクションを保護するローカルミドルウェアまたはZodスキーマの検証
- ユーザーイベントのアクティビティログシステム

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/)
- **データベース**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **支払い**: [Stripe](https://stripe.com/)
- **UIライブラリ**: [shadcn/ui](https://ui.shadcn.com/)

## 始め方

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install

```

## ローカルでの実行

同梱のセットアップスクリプトを使用して `.env` ファイルを作成します:

```bash
pnpm db:setup

```

次に、データベースのマイグレーションを実行し、デフォルトのユーザーとチームでデータベースをシードします:

```bash
pnpm db:migrate
pnpm db:seed

```

これにより、以下のユーザーとチームが作成されます:

- ユーザー: `test@test.com`
- パスワード: `admin123`

もちろん、`/sign-up` から新しいユーザーを作成することもできます。

最後に、Next.jsの開発サーバーを実行します:

```bash
pnpm dev

```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて、アプリを確認してください。

オプションとして、StripeのCLIを使用してローカルでStripeのWebhookをリッスンし、サブスクリプション変更イベントを処理することができます:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook

```

## 支払いのテスト

Stripeの支払いをテストするには、以下のテストカード情報を使用します:

- カード番号: `4242 4242 4242 4242`
- 有効期限: 未来の日付
- CVC: 任意の3桁の番号

## 本番環境への移行

SaaSアプリケーションを本番環境にデプロイする準備ができたら、以下の手順に従ってください:

### 本番Stripe Webhookの設定

1. Stripeダッシュボードに移動し、本番環境用の新しいWebhookを作成します。
2. エンドポイントURLを本番APIルートに設定します（例: `https://yourdomain.com/api/stripe/webhook`）。
3. リッスンするイベントを選択します（例: `checkout.session.completed`, `customer.subscription.updated`）。

### Vercelへのデプロイ

1. コードをGitHubリポジトリにプッシュします。
2. リポジトリを [Vercel](https://vercel.com/) に接続し、デプロイします。
3. Vercelのデプロイプロセスに従い、プロジェクトの設定を行います。

### 環境変数の追加

Vercelプロジェクトの設定（またはデプロイ中）で、必要なすべての環境変数を追加します。本番環境用の値を更新することを忘れないでください。以下の変数を含めます:

1. `BASE_URL`: 本番ドメインを設定します。
2. `STRIPE_SECRET_KEY`: 本番環境用のStripeシークレットキーを使用します。
3. `STRIPE_WEBHOOK_SECRET`: ステップ1で作成した本番Webhookのシークレットを使用します。
4. `POSTGRES_URL`: 本番データベースのURLを設定します。
5. `AUTH_SECRET`: ランダムな文字列を設定します。`openssl rand -base64 32` で生成できます。

## その他のテンプレート

このテンプレートは学習リソースとして意図的にミニマルに設計されていますが、より多機能な有料バージョンもコミュニティに存在します:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev Next.js SaaS Starter


