import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "./auth";

/**
 * Retrieves the admin session and authenticated username.
 * Checks:
 * 1. Authorization: Bearer <token> header
 * 2. apartmento_admin_token HTTP-only cookie
 */
export async function getAdminSession(req?: Request): Promise<{ authenticated: boolean; username?: string }> {
  // 1. Check Authorization header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      const verified = await verifyAdminToken(token);
      if (verified.valid) return { authenticated: true, username: verified.username };
    }
  }

  // 2. Check HTTP-only cookie
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("apartmento_admin_token");
    if (tokenCookie?.value) {
      const verified = await verifyAdminToken(tokenCookie.value);
      if (verified.valid) return { authenticated: true, username: verified.username };
    }
  } catch (err) {
    console.error("Admin session retrieval error:", err);
  }

  return { authenticated: false };
}

/**
 * Verifies if the incoming request has a valid cryptographically signed admin session.
 */
export async function verifyAdminSession(req?: Request): Promise<boolean> {
  const session = await getAdminSession(req);
  return session.authenticated;
}

/**
 * Route protection guard for admin API endpoints.
 * Returns null if authenticated, or a 401 Unauthorized NextResponse if unauthenticated.
 */
export async function requireAdmin(req?: Request): Promise<NextResponse | null> {
  const isAuthenticated = await verifyAdminSession(req);
  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Admin authentication required to perform this action.",
      },
      { status: 401 }
    );
  }
  return null;
}
