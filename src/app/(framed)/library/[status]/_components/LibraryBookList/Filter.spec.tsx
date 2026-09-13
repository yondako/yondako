import { expect, mock, test } from "bun:test";
import { fireEvent, render } from "@testing-library/react";

const replace = mock();
mock.module("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams("q=ねこ&page=2&order=asc"),
}));
mock.module("@/assets/icons/search.svg", () => ({ default: () => null }));
mock.module("@/assets/icons/sort-ascending.svg", () => ({ default: () => null }));
mock.module("@/assets/icons/sort-descending.svg", () => ({ default: () => null }));

test("入力中は検索せず、空になったら並び順を保持して検索とページ指定を解除する", async () => {
  const { default: Filter } = await import("./Filter");
  const { getByRole } = render(<Filter isOrderAsc />);
  const input = getByRole("searchbox");

  fireEvent.change(input, { target: { value: "ね" } });
  expect(replace).not.toHaveBeenCalled();

  fireEvent.change(input, { target: { value: "" } });
  expect(replace).toHaveBeenCalledTimes(1);
  expect(replace).toHaveBeenCalledWith("?order=asc");
});
