# yondako

🐙 "よんだこと"を記録するだけのシンプルなWebサービス

## setup

```sh
# 依存関係をインストール
bun install

# DB
bun run wrangler d1 create yondako_dev
bun run generate:schema ./src/db/schema/*
bun run wrangler d1 migrations apply yondako_dev --local

# 開発サーバーを起動
bun dev
```

## build & start

```sh
bun run build && bun run preview
```

## Dizzle Studio

```
DATABASE_PATH=".wrangler/state/v3/d1/miniflare-D1DatabaseObject/<id>.sqlite"
bun run drizzle-kit studio
```

