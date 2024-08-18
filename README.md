# yondako

🐙 "よんだこと"をわすれないための読書記録サービス

## 環境構築

### 準備

```sh
# 依存関係をインストール
bun install

# DB
bun run wrangler d1 create yondako
bun run generate:schema ./src/db/schema/*
bun run wrangler d1 migrations apply yondako --local

# 開発サーバーを起動
bun dev
```

### ビルド

```sh
bun run build
bun run preview
```

### Dizzle Studio

```
DATABASE_PATH=".wrangler/state/v3/d1/miniflare-D1DatabaseObject/<id>.sqlite"
bun run drizzle:studio
```

## 使用素材

| 内容 | 提供元 |
| -| - |
| グラデーション素材 | [Grads V2 \| Charco Design](https://www.charco.design/grads-v2) |
| イラスト | [Open Doodles](https://www.opendoodles.com/) |
| フォント | [LINE Seed JP](https://seed.line.me/index_jp.html) |
| アイコン | [Tabler: Free and Open-Source HTML Dashboard Template](https://tabler.io/icons) |
