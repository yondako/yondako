# yondako

🐙 "よんだこと"を記録するだけのシンプルなWebサービス

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

