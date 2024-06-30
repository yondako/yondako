export type BookType = {
  info: BookInfo;
  status: BookStatus;
};

/**
 * 書籍情報
 */
export type BookInfo = {
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
  /** サムネイル画像URL */
  thumbnailUrl?: string | null;
};

/**
 * 読書ステータスの値
 */
export const bookStatusValues = [
  "none",
  "reading",
  "want_read",
  "read",
] as const;

/**
 * 読書ステータス
 */
export type BookStatus = (typeof bookStatusValues)[number];
