import { number, pipe, toMinValue } from "valibot";

/** ページネーションのpageパラメータのスキーマ */
export const pageIndexSchema = pipe(number(), toMinValue(1));
