"use client";

import { lastNewsCheckedKey } from "@/hooks/useCheckLatestNews";
import { useEffect } from "react";

export default function UpdateLastNewsCheckedAt() {
  // お知らせページを開いた時刻を保存
  useEffect(() => {
    localStorage.setItem(lastNewsCheckedKey, Date.now().toString());
  }, []);

  return null;
}
