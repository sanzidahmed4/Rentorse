import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "./auth";
import { findAdminUser } from "./admin-users";

export interface AdminSession {
  authenticated: boolean;
  username?: string;
  role?: "admin" | "editor";
  displayName?: string;
}

async function resolveLiveSession(verified: { username?: string; role?: "admin" | "editor"; displayName?: string }): Promise<AdminSession> {
  if (!verified.username) return { authenticated: false };
  const clean = verified.username.toLowerCase();
  const isRoot = ["sanzid", "sihabali"].includes(clean);

  // Root founders are always active administrators
  if (isRoot) {
    return {
      authenticated: true,
      username: clean,
      role: "admin",
      displayName: clean === "sihabali" ? "Sihab Ali" : "Sanzid",
    };
  }

  // Check live user record in database/store
  const liveUser = await findAdminUser(clean);
  if (!liveUser || liveUser.isActive === false) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    username: liveUser.username,
    role: liveUser.role || "editor",
    displayName: liveUser.displayName || liveUser.username,
  };
}

/**
 * Retrieves the admin session and authenticated user details.
 * Checks:
 * 1. Authorization: Bearer <token> header
 * 2. apartmento_admin_token HTTP-only cookie
 */
export async function getAdminSession(req?: Request): Promise<AdminSession> {
  // 1. Check Authorization header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      const verified = await verifyAdminToken(token);
      if (verified.valid) {
        return await resolveLiveSession(verified);
      }
    }
  }

  // 2. Check HTTP-only cookie
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("rentorce_admin_token") || cookieStore.get("apartmento_admin_token");
    if (tokenCookie?.value) {
      const verified = await verifyAdminToken(tokenCookie.value);
      if (verified.valid) {
        return await resolveLiveSession(verified);
      }
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
 * Route protection guard for authenticated admin/editor API endpoints.
 * Returns null if authenticated, or a 401 Unauthorized NextResponse if unauthenticated.
 */
export async function requireAdmin(req?: Request): Promise<NextResponse | null> {
  const isAuthenticated = await verifyAdminSession(req);
  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Authentication required to perform this action.",
      },
      { status: 401 }
    );
  }
  return null;
}

/**
 * Strict route protection guard requiring "admin" role.
 * Returns null if admin, 401 if unauthenticated, or 403 Forbidden if user is an editor.
 */
export async function requireAdminRole(req?: Request): Promise<NextResponse | null> {
  const session = await getAdminSession(req);
  if (!session.authenticated) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Authentication required to perform this action.",
      },
      { status: 401 }
    );
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden. Admin privileges required to perform this action.",
      },
      { status: 403 }
    );
  }

  return null;
}

