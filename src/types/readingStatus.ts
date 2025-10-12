import { picklist } from "valibot";

/**
 * 読書ステータス
 */
export const readingStatusValues = ["none", "want_read", "reading", "read", "all"] as const;

/**
 * 読書ステータス
 */
export type ReadingStatus = (typeof readingStatusValues)[number];

// 読書ステータスのスキーマ
export const readingStatusSchema = picklist(readingStatusValues);

// "none"を除いた読書ステータスのスキーマ
export const readingStatusSchemaWithoutNone = picklist(readingStatusValues.filter((v) => v !== "none"));

// ライブラリページで使用される読書ステータスのスキーマ ("none"を除く)
export const libraryReadingStatusSchema = picklist(readingStatusValues.filter((v) => v !== "none"));
