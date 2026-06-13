import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge proxy (formerly "middleware" pre-Next 16).
// Centralised, fast, request-time concerns only:
//   - security headers for every response
//   - lightweight geo/country detection for shipping & tax rules
// Heavy work (auth/session, DB) belongs in route handlers / server actions.

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "on",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // Country hint for downstream shipping/tax logic. Falls back gracefully.
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    "EU";
  response.headers.set("x-shipping-country", country);

  return response;
}

export const config = {
  // Run on application routes, skip static assets and image optimisation.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
