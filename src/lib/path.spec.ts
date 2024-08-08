import { test, expect } from "bun:test";
import { createSignInPath } from "./path";

test("コールバックURLがURIエンコードされている", () => {
  const got = createSignInPath("/hello");

  expect(got).toBe("/api/auth/signin?callbackUrl=%2Fhello");
});
