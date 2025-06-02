import type { ReadingStatus } from "@/types/readingStatus";

export const pageSize = 24;

/**
 * ライブラリのステータスに応じた空メッセージを取得
 * @param status ライブラリのステータス
 * @returns 空メッセージ
 */
export function getEmptyMessage(status: ReadingStatus) {
  switch (status) {
    case "reading":
      return "ｶﾗｯﾎﾟ";
    case "read":
      return "ﾅﾆﾓﾅｲ";
    case "want_read":
      return "ｽｯｷﾘ";
    default:
      return "ｺｺﾊﾄﾞｺ";
  }
}
