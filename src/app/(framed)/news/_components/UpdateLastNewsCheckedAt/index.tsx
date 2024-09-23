"use client";

import { lastNewsCheckedAtKey } from "@/lib/lastNewsCheckedAt";
import { useEffect } from "react";

export default function UpdateLastNewsCheckedAt() {
  // お知らせページを開いた時刻を保存
  useEffect(() => {
    const now = new Date(new Date().toUTCString()).getTime();
    localStorage.setItem(lastNewsCheckedAtKey, now.toString());
  }, []);

  return null;
}
