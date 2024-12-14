# yondako

🐙 よんだことをわすれないための読書記録サービス

https://github.com/user-attachments/assets/73717f15-a8a9-46b6-94bd-3b3643a8094c

## 環境構築

### 依存関係のインストール

```sh
bun install
```

### .env

`.env.example` をコピーして `.env.local` を作成。

### DBのセットアップ

```sh
bun run wrangler d1 create yondako_dev
bun run generate:schema ./src/db/schema/*
bun run wrangler d1 migrations apply yondako --local
```

### `wrangler.toml` の設定

```toml
name = "yondako"
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "yondako_dev"
database_id = "<database_idを指定>"
```

### 起動

```sh
bun dev
```

### ビルド

```sh
bun run build
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
