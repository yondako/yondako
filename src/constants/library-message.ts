import type { ReadingStatus } from "@/types/readingStatus";

export const LIBRARY_MESSAGE_NONE = "ｺｺﾊﾄﾞｺ";

export const LIBRARY_MESSAGE = new Map<ReadingStatus, string>([
  ["reading", "ｶﾗｯﾎﾟ"],
  ["read", "ﾅﾆﾓﾅｲ"],
  ["want_read", "ｽｯｷﾘ"],
  ["none", LIBRARY_MESSAGE_NONE],
]);
