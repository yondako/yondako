import type { LibraryStatus } from "@/types/readingStatus";

export const LIBRARY_MESSAGE_NONE = "ｺｺﾊﾄﾞｺ";

export const LIBRARY_MESSAGE = new Map<LibraryStatus, string>([
  ["reading", "ｶﾗｯﾎﾟ"],
  ["read", "ﾅﾆﾓﾅｲ"],
  ["want_read", "ｽｯｷﾘ"],
  ["all", "ｶﾗｯﾎﾟ"],
]);
