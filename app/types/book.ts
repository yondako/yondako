export type BookType = {
  info: BookInfo;
  liked: boolean;
  status: BookStatus;
};

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

export type BookStatus = "none" | "read" | "want_read";
