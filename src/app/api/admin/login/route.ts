import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  createAdminToken,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/auth";
import { recordAdminLogin } from "@/lib/admin-audit";
import { verifyUserCredentials } from "@/lib/admin-users";

interface AdminUser {
  username: string;
  password: string;
}

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function getValidAdminUsers(): AdminUser[] {
  const users: AdminUser[] = [];

  // 1. Support ADMIN_USERS list (e.g. "sihabali:adminsihab,sanzid:adminsanzid")
  if (process.env.ADMIN_USERS) {
    const pairs = process.env.ADMIN_USERS.split(",");
    for (const pair of pairs) {
      const colonIndex = pair.indexOf(":");
      if (colonIndex > 0) {
        const u = pair.slice(0, colonIndex).trim();
        const p = pair.slice(colonIndex + 1).trim();
        // Disallow old/legacy username 'admin'
        if (u && p && u.toLowerCase() !== "admin") {
          users.push({ username: u, password: p });
        }
      }
    }
  }

  // 2. Support single ADMIN_USERNAME / ADMIN_PASSWORD fallback (ONLY if not 'admin')
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    const singleUser = process.env.ADMIN_USERNAME.trim();
    const singlePass = process.env.ADMIN_PASSWORD.trim();
    if (
      singleUser &&
      singlePass &&
      singleUser.toLowerCase() !== "admin" &&
      !users.some((u) => u.username.toLowerCase() === singleUser.toLowerCase())
    ) {
      users.push({ username: singleUser, password: singlePass });
    }
  }

  // 3. Ensure default authorized admins (sihabali and sanzid) are ALWAYS included
  if (!users.some((u) => u.username.toLowerCase() === "sihabali")) {
    users.push({ username: "sihabali", password: "adminsihab" });
  }
  if (!users.some((u) => u.username.toLowerCase() === "sanzid")) {
    users.push({ username: "sanzid", password: "adminsanzid" });
  }

  return users;
}

export async function POST(req: Request) {
  try {
    // 1. IP extraction for brute-force protection
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    // 2. Check rate limit before processing credentials
    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil((rateCheck.retryAfterSeconds || 900) / 60);
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${minutesLeft} minute(s).`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds || 900),
          },
        }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      recordFailedLogin(clientIp);
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const cleanUsername = username.trim().toLowerCase();

    // STRICT: Explicitly disallow the old/legacy 'admin' account
    if (cleanUsername === "admin") {
      await recordAdminLogin({
        username: "admin",
        ip: clientIp,
        userAgent: req.headers.get("user-agent"),
        status: "FAILED",
      });
      const failRecord = recordFailedLogin(clientIp);
      return NextResponse.json(
        {
          error: "The legacy 'admin' account is permanently deactivated. Please log in using your authorized administrator account (sihabali or sanzid).",
        },
        { status: 401 }
      );
    }

    // 3. Authenticate against registered users (MongoDB + local store + env fallback)
    const verifiedUser = await verifyUserCredentials(cleanUsername, password);

    if (verifiedUser) {
      // Reset rate limit on success
      resetLoginAttempts(clientIp);

      const cookieStore = await cookies();
      // Generate cryptographically signed token for the specific authenticated user with role
      const token = await createAdminToken({
        username: verifiedUser.username,
        role: verifiedUser.role,
        displayName: verifiedUser.displayName,
      });

      cookieStore.set("apartmento_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Record successful login audit
      await recordAdminLogin({
        username: verifiedUser.username,
        ip: clientIp,
        userAgent: req.headers.get("user-agent"),
        status: "SUCCESS",
      });

      return NextResponse.json({
        success: true,
        user: verifiedUser.username,
        role: verifiedUser.role,
        displayName: verifiedUser.displayName,
        message: "Logged in successfully",
      });
    }

    // 4. Fallback check for any legacy valid users configured in env
    const validUsers = getValidAdminUsers();
    let matchedUser: AdminUser | null = null;
    for (const u of validUsers) {
      const isUserMatch = safeCompare(cleanUsername, u.username.toLowerCase());
      const isPassMatch = safeCompare(password, u.password);
      if (isUserMatch && isPassMatch) {
        matchedUser = u;
        break;
      }
    }

    if (matchedUser) {
      resetLoginAttempts(clientIp);

      const cookieStore = await cookies();
      const token = await createAdminToken({
        username: matchedUser.username,
        role: "admin",
        displayName: matchedUser.username === "sihabali" || matchedUser.username === "sihab" ? "Sihab Ali" : "Sanzid",
      });

      cookieStore.set("apartmento_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      await recordAdminLogin({
        username: matchedUser.username,
        ip: clientIp,
        userAgent: req.headers.get("user-agent"),
        status: "SUCCESS",
      });

      return NextResponse.json({
        success: true,
        user: matchedUser.username,
        role: "admin",
        displayName: matchedUser.username === "sihabali" || matchedUser.username === "sihab" ? "Sihab Ali" : "Sanzid",
        message: "Logged in successfully",
      });
    }

    // 5. Record failed attempt and notify remaining tries
    await recordAdminLogin({
      username: username || "unknown",
      ip: clientIp,
      userAgent: req.headers.get("user-agent"),
      status: "FAILED",
    });

    const failRecord = recordFailedLogin(clientIp);
    if (failRecord.locked) {
      return NextResponse.json(
        {
          error: "Too many failed login attempts. Account temporarily locked for 15 minutes.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: `Invalid username or password. ${failRecord.remainingAttempts} attempt(s) remaining before temporary lockout.`,
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Admin login error:", error);
    const message = error?.message || "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
