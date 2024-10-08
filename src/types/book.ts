import type { ReadingStatus } from "./readingStatus";

/**
 * 書籍
 */
export type BookType = {
  detail: BookDetail;
  readingStatus: ReadingStatus;
};

/**
 * 書籍データ
 */
export type BookDetail = {
  /** 書誌ID */
  ndlBibId: string;
  /** タイトル */
  title: string;
  /** NDL Search のページURL */
  link: string;
  /** 著者 */
  authors?: string[];
  /** 出版社 */
  publishers?: string[];
  /** ISBN */
  isbn?: string | null;
  /** 全国書誌番号 */
  jpNo?: string | null;
  /** JP-eコード */
  jpeCode?: string | null;
};
