import type { ReadingStatus } from "./readingStatus";

/**
 * 書籍
 */
export type BookType = {
  detail: BookDetailWithoutId;
  readingStatus: ReadingStatus;
};

/**
 * DBに記録されている書籍データ
 */
export type BookDetail = {
  /** 内部ID */
  id: string;
  /** タイトル */
  title: string;
  /** NDL Search のページURL */
  link: string;
  /** 著者 */
  authors?: string[];
  /** 出版社 */
  publishers?: string[];
  /** NDL書誌ID */
  ndlBibId?: string | null;
  /** ISBN */
  isbn?: string | null;
  /** 全国書誌番号 */
  jpNo?: string | null;
  /** JP-eコード */
  jpeCode?: string | null;
};

/**
 * 内部IDを除いた書籍データ
 * NOTE: NDLサーチから取得した書籍データなどで使用
 */
export type BookDetailWithoutId = Omit<BookDetail, "id">;

/**
 * 書籍の識別子
 */
export type BookIdentifiers = Pick<BookDetail, "ndlBibId" | "isbn">;
