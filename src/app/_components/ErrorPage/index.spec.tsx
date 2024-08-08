import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import ErrorPage from ".";

test("タイトルがある", () => {
  render(
    <ErrorPage title="エラータイトル">
      <p>ここにテキストを入れる</p>
    </ErrorPage>,
  );

  expect(screen.getByRole("heading").textContent).toBe("エラータイトル");
});
