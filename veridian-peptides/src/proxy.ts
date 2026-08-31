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

const SITE_USER = process.env.SITE_USER ?? "preview";

// Optional HTTP Basic Auth gate for private preview tunnels (ngrok, cloudflared,
// etc.). Active only when SITE_PASSWORD is set, so normal deploys are unaffected.
function basicAuthGate(request: NextRequest): NextResponse | null {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const [user, pass] = atob(header.slice(6)).split(":");
      if (user === SITE_USER && pass === password) return null;
    } catch {
      // malformed header — fall through to challenge
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Preview", charset="UTF-8"' },
  });
}

export function proxy(request: NextRequest) {
  const gate = basicAuthGate(request);
  if (gate) return gate;

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
