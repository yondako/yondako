"use client";

import { useEffect } from "react";
import { lastNewsCheckedKey } from "@/hooks/useCheckLatestNews";

export default function UpdateLastNewsCheckedAt() {
  // お知らせページを開いた時刻を保存
  useEffect(() => {
    localStorage.setItem(lastNewsCheckedKey, Date.now().toString());
  }, []);

  return null;
}
