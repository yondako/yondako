# yondako

🐙 よんだことをわすれないための読書記録サービス

https://github.com/user-attachments/assets/a09637e9-d4da-4cb1-bd4f-055f167f12df

## このプロジェクトについて

### めざすもの

- 気軽に読書記録を残せる
- 「よみたい」「よんでる」「よんだ」本をいつでも見返せる
- 積読、あるいは積読の消化の促進

### やらないこと

- 人と人との交流、SNS的な要素
- 感想の記録

## 環境構築

### 依存関係のインストール

```sh
bun install
```

### .env

`.env.example` をコピーして `.env.local` を作成し、必要な値を設定。

| 環境変数 | 説明 | 必須 |
|-|-|-|
| `DATABASE_PATH` | Drizzle Studio用のローカルDBパス | |
| `RAKUTEN_APP_ID` | [楽天API](https://webservice.rakuten.co.jp/)のアプリID（書影取得用） | ✓ |
| `RAKUTEN_APP_SECRET` | 楽天APIのアプリシークレット（書影取得用） | ✓ |
| `BETTER_AUTH_SECRET` | 認証用シークレット | ✓ |
| `BETTER_AUTH_URL` | 認証用URL（例: `https://local.yondako.com:3000`） | ✓ |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | ✓ |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | ✓ |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | ✓ |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | ✓ |
| `API_SECRET_KEY` | 内部API用シークレットキー | ✓ |
| `FORM_CONTACT_URL` | お問い合わせフォームのURL | |
| `FORM_BUG_REPORT_URL` | バグ報告フォームのURL（`{{userId}}`がユーザーIDに置換される） | |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | umamiのスクリプトURL | |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | umamiのWebsite ID | |
| `SLACK_WEBHOOK_URL` | Slack通知用Webhook URL | |

### DBのセットアップ

```sh
bun run wrangler d1 create yondako_dev
bun run generate:schema "./src/db/schema/*"
bun run wrangler d1 migrations apply yondako_dev --local
```

### Queueの作成

```sh
bun run wrangler queues create yondako-dev-thumbnail
```

### `wrangler.toml` の設定

`wrangler.example.toml` をコピーして `wrangler.toml` を作成し、`database_id` を設定。

```toml
name = "yondako"
main = "custom-worker.ts"
compatibility_date = "2024-12-30"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

[[d1_databases]]
binding = "DB"
database_name = "yondako_dev"
database_id = "<database_idを指定>"
migrations_dir = "src/db/migrations"

[[queues.producers]]
queue = "yondako-dev-thumbnail"
binding = "THUMBNAIL_QUEUE"

[[queues.consumers]]
queue = "yondako-dev-thumbnail"
max_batch_size = 1
max_batch_timeout = 1
max_retries = 3
max_concurrency = 1
```

### 起動

```sh
bun dev
```

### ビルド・プレビュー

```sh
# ビルド
bun run build

# 開発サーバー起動 (Queue は動作しないので注意)
bun run dev

# Queue も一緒に動作させる場合
bun run preview 
```

### Dizzle Studio

```sh
DATABASE_PATH=".wrangler/state/v3/d1/miniflare-D1DatabaseObject/<id>.sqlite"
bun run drizzle:studio
```

## 使用素材とライセンス

| 名称 | ディレクトリ | 提供元 | ライセンス |
|-|-|-|-|
| Noto Color Emoji | `/src/assets/images/noto-color-emoji/` | [googlefonts/noto-emoji: Noto Emoji fonts](https://github.com/googlefonts/noto-emoji?tab=readme-ov-file) | [Apache license, version 2.0](./src/assets/images/noto-color-emoji/LICENSE.txt) |
| Animated Emoji | `src/assets/images/animation-emoji/` | [Animated Emoji](https://googlefonts.github.io/noto-emoji-animation/) | [Legal Code - Attribution 4.0 International - Creative Commons](https://creativecommons.org/licenses/by/4.0/legalcode) |
| Open Doodles | `/src/assets/images/open-doodles/` | [Open Doodles](https://www.opendoodles.com/) | [Deed - CC0 1.0 Universal - Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/) |
| Grads V2 | `/public/images/gradation.webp` (加工済) | [Grads V2 \| Charco Design](https://www.charco.design/grads-v2) | [独自](https://charcodesign.gumroad.com/l/gradsv2) |
| Tabler | `/src/assets/icons/` | [Tabler: Free and Open-Source HTML Dashboard Template](https://tabler.io/icons) | [MIT License](./src/assets/icons/LICENSE.txt) |
| LINE Seed JP | `src/assets/fonts` | [LINE Seed JP](https://seed.line.me/index_jp.html) | [SIL Open Font License, Version 1.1](./src/assets/fonts/LICENSE.txt) |
