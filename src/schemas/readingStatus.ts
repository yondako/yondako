import { readingStatusValues } from "@/types/book";
import { picklist } from "valibot";

// 読書ステータスのスキーマ
export const readingStatusSchema = picklist(readingStatusValues);

// "none"を除いた読書ステータスのスキーマ
export const readingStatusSchemaWithoutNone = picklist(
  readingStatusValues.filter((v) => v !== "none"),
);
