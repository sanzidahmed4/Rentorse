import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("apartmento_admin_token");

  // Validate cryptographic token if present
  let isAuthenticated = false;
  if (token?.value) {
    const verified = await verifyAdminToken(token.value);
    isAuthenticated = verified.valid;
  }

  // Protect /admin routes (except /admin/login)
  if (pathname === "/admin" || (pathname.startsWith("/admin/") && pathname !== "/admin/login")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clean up stale or invalid token cookie
      if (token?.value) {
        response.cookies.delete("apartmento_admin_token");
      }
      return response;
    }
  }

  // If visiting /admin/login: redirect to /admin only if valid, otherwise purge stale cookie
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    } else if (token?.value) {
      const response = NextResponse.next();
      response.cookies.delete("apartmento_admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
