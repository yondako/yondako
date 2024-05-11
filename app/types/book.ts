export type BookType = {
  info: BookInfo;
  liked: boolean;
  status: BookStatus;
};

export type BookInfo = {
  /** タイトル */
  title: string;
  /** NDL Search のページURL */
  link: string;
  /** 著者 */
  authors?: string[];
  /** 出版社 */
  publisher?: string[];
  /** ISBN */
  isbn?: string;
  /** 書誌ID */
  ndlBibId?: string;
  /** 全国書誌番号 */
  jpNo?: string;
  /** サムネイル画像URL */
  thumbnailUrl?: string;
};

export type BookStatus = "none" | "read" | "want_read";
