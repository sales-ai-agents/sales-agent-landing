import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/sign-in", "/sign-up", "/forgot-password", "/email-confirm"];
const SESSION_COOKIE = "cs_session";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);
const BILLING_RETURN_ROUTE = "/dashboard/billing/success";
const SEE_OTHER = 303;

const GATED_LANDING_ROUTE = "/landing";
const LANDING_ACCESS_COOKIE = "landing";
const LANDING_ACCESS_VALUE = "true";
const UNMATCHED_ROUTE = "/_not-available";

function isGatedLandingRoute(pathname: string): boolean {
  return pathname === GATED_LANDING_ROUTE || pathname.startsWith(GATED_LANDING_ROUTE + "/");
}

function hasLandingAccess(request: NextRequest): boolean {
  return request.cookies.get(LANDING_ACCESS_COOKIE)?.value === LANDING_ACCESS_VALUE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "POST" && pathname === BILLING_RETURN_ROUTE) {
    return NextResponse.redirect(request.nextUrl, SEE_OTHER);
  }

  if (isGatedLandingRoute(pathname)) {
    const response = hasLandingAccess(request)
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(UNMATCHED_ROUTE, request.url));
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie");
    return response;
  }

  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtectedRoute =
    pathname !== BILLING_RETURN_ROUTE &&
    PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // API6 uses bearer tokens on localhost and preview deployments, where the
  // Secure production cookie may be unavailable. DashboardShell verifies those sessions.
  const usesClientBearerAuth =
    LOCAL_HOSTS.has(request.nextUrl.hostname) || process.env.VERCEL_ENV === "preview";

  if (isProtectedRoute && !hasSession && !usesClientBearerAuth) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|twitter-image|image/|audio/).*)",
  ],
};
