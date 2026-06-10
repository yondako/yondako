import { Database } from "bun:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "@/db/schema";

const MIGRATIONS_DIR = join(import.meta.dir, "../db/migrations");

export type TestDB = ReturnType<typeof createTestDB>;

/**
 * テスト用のインメモリDBを作成
 *
 * 実際のマイグレーションSQLを適用するため、本番(D1)と同じスキーマでテストできる
 * @returns drizzleのインスタンス
 */
export function createTestDB(): ReturnType<typeof drizzle<typeof schema>> {
  const sqlite = new Database(":memory:");

  // D1はFK制約が有効なため挙動を合わせる
  sqlite.run("PRAGMA foreign_keys = ON");

  applyMigrations(sqlite);

  return drizzle(sqlite, { schema });
}

/**
 * マイグレーションSQLをファイル名順に適用
 *
 * NOTE: meta/_journal.json のtagと実ファイル名が不一致のため drizzle の migrate() は使えない。
 * wrangler d1 migrations apply と同じく .sql をファイル名順に実行する
 * @param sqlite SQLiteのインスタンス
 */
function applyMigrations(sqlite: Database): void {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const content = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");

    for (const statement of content.split("--> statement-breakpoint")) {
      // コメントや空白のみのチャンクは実行するとエラーになるためスキップ
      const hasSql = statement.split("\n").some((line) => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith("--");
      });

      if (hasSql) {
        sqlite.run(statement);
      }
    }
  }
}
