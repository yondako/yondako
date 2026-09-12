import { expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";

mock.module("@/components/AdaptiveModalDrawer", () => ({
  default: ({ children }: { children: (parts: object) => ReactNode }) =>
    createPortal(children({ Title: "h2", Description: "p", Close: Button }), document.body),
}));

test("ポータル内の絞り込み条件を送信し、外側の検索フォームへ伝播しない", async () => {
  const { default: SearchFilter } = await import(".");
  const outerSubmit = mock();
  render(
    <form onSubmit={outerSubmit}>
      <input name="q" defaultValue="外側の未確定の入力" />
      <SearchFilter query="夏目 & 漱石" searchType="creator">
        <button type="button">絞り込み</button>
      </SearchFilter>
    </form>,
  );

  fireEvent.click(screen.getByLabelText("近代小説 (日本)"));
  fireEvent.click(screen.getByRole("switch"));
  const form = screen.getByRole("button", { name: "絞り込む" }).closest("form");
  if (!form) throw new Error("絞り込みフォームがありません");
  expect(form.getAttribute("action")).toBe("/search");
  expect(Object.fromEntries(new window.FormData(form))).toEqual({
    q: "夏目 & 漱石",
    type: "creator",
    ndc: "913.6",
    sensitive: "on",
  });
  fireEvent.submit(form);
  expect(outerSubmit).not.toHaveBeenCalled();
});
