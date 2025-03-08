import { expect, test } from "bun:test";
import { createSignInPath } from "./path";

test("コールバックURLがURIエンコードされている", () => {
  const got = createSignInPath("/hello");
  expect(got).toBe("/?callbackUrl=%2Fhello");
});
