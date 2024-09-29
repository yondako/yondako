import { expect, setSystemTime, spyOn, test } from "bun:test";
import { lastNewsCheckedKey } from "@/hooks/useCheckLatestNews";
import { render } from "@testing-library/react";
import UpdateLastNewsCheckedAt from "./index";

test("お知らせページを開いた時刻を保存すること", () => {
  const mockTimestamp = 1727582901836;
  setSystemTime(new Date(mockTimestamp));

  const setItemMock = spyOn(Storage.prototype, "setItem");

  render(<UpdateLastNewsCheckedAt />);

  expect(setItemMock).toHaveBeenCalledWith(
    lastNewsCheckedKey,
    mockTimestamp.toString(),
  );

  setItemMock.mockRestore();
});
