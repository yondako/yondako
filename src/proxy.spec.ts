import { expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

test("CSPとnonceをレスポンスと後続のリクエストへ渡す", () => {
  const response = proxy(new NextRequest("https://example.com/library/all"));
  const csp = response.headers.get("content-security-policy");
  const nonce = response.headers.get("x-middleware-request-x-nonce");

  expect(nonce).toBeTruthy();
  expect(csp).toContain(`'nonce-${nonce}'`);
  expect(csp).toContain("frame-ancestors 'none'");
  expect(response.headers.get("x-middleware-request-content-security-policy")).toBe(csp);
});

test("nonceはリクエストごとに生成する", () => {
  const request = new NextRequest("https://example.com/");
  const first = proxy(request).headers.get("x-middleware-request-x-nonce");
  const second = proxy(request).headers.get("x-middleware-request-x-nonce");

  expect(first).not.toBe(second);
});

test("デスクトップとモバイルの端末判定を維持する", () => {
  const desktop = proxy(new NextRequest("https://example.com/"));
  const mobile = proxy(
    new NextRequest("https://example.com/", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
      },
    }),
  );

  expect(desktop.headers.get("x-is-desktop")).toBe("true");
  expect(mobile.headers.has("x-is-desktop")).toBe(false);
});
