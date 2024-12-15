import { type NextRequest, NextResponse, userAgent } from "next/server";
import { site } from "./constants/site";

const isDev = process.env.NODE_ENV === "development";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspList = {
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      site.url,
      process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
      isDev && "'unsafe-eval'",
      isDev && "'unsafe-inline'",
    ],
    "font-src": ["'self'"],
    "object-src": ["https://ndlsearch.ndl.go.jp"],
    "base-uri": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  const cspHeader = Object.entries(cspList)
    .map(([key, values]) => {
      const value = values.filter((e) => typeof e === "string").join(" ");
      return values.length === 0 ? key : `${key} ${value}`;
    })
    .join(";");

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = `${cspHeader};`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  // デスクトップ判定
  const { device } = userAgent(request);
  const isDesktop = typeof device.type === "undefined";

  if (isDesktop) {
    response.headers.set("X-IS-DESKTOP", "true");
  }

  return response;
}
