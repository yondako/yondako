import { expect, setSystemTime, test } from "bun:test";
import { lastNewsCheckedKey } from "@/hooks/useCheckLatestNews";
import { render } from "@testing-library/react";
import UpdateLastNewsCheckedAt from "./index";

test("お知らせページを開いた時刻を保存すること", () => {
  const mockTimestamp = 1727582901836;
  setSystemTime(new Date(mockTimestamp));

  render(<UpdateLastNewsCheckedAt />);

  expect(localStorage.getItem(lastNewsCheckedKey)).toBe(
    mockTimestamp.toString(),
  );
});
