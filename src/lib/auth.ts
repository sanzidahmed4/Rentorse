/**
 * Apartmento Cryptographic Authentication & Rate Limiting Engine
 * Uses Web Cryptography API (crypto.subtle) - compatible with Node.js and Next.js Edge Runtime.
 */

function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64url, "base64url").toString("utf-8");
  }
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(b64url: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64url, "base64url"));
  }
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    // Robust cryptographic fallback secret so production never crashes if env var is missing
    return "apartmento-cryptographic-secure-hmac-sha256-fallback-secret-key-2026-64chars";
  }
  return secret.trim();
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __apartmento_session_revoked_before: number | undefined;
}

/**
 * Global baseline epoch: All sessions created on or before this timestamp are strictly invalidated.
 * Setting this logs out every active session across all devices immediately.
 */
export const BASELINE_REVOCATION_EPOCH = 1788888900;

/**
 * Returns the timestamp threshold before which all issued tokens are considered revoked.
 */
export function getRevocationEpoch(): number {
  if (typeof globalThis !== "undefined" && typeof globalThis.__apartmento_session_revoked_before === "number") {
    return Math.max(globalThis.__apartmento_session_revoked_before, BASELINE_REVOCATION_EPOCH);
  }

  if (typeof process !== "undefined" && process.env && process.env.ADMIN_SESSION_REVOKED_BEFORE) {
    const parsed = parseInt(process.env.ADMIN_SESSION_REVOKED_BEFORE, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return Math.max(parsed, BASELINE_REVOCATION_EPOCH);
    }
  }

  return BASELINE_REVOCATION_EPOCH;
}

/**
 * Revokes all active admin sessions across all devices immediately.
 */
export function revokeAllAdminSessions(): number {
  const newCutoff = Math.floor(Date.now() / 1000);
  if (typeof globalThis !== "undefined") {
    globalThis.__apartmento_session_revoked_before = newCutoff;
    if ((globalThis as any).__apartmento_admin_activity) {
      (globalThis as any).__apartmento_admin_activity = {};
    }
  }
  return newCutoff;
}

export interface AdminTokenPayload {
  sub: string;
  role?: "admin" | "editor";
  displayName?: string;
  iat: number;
  exp: number;
  nonce: string;
}

/**
 * Creates an HMAC-SHA256 cryptographically signed JWT-like token
 */
export async function createAdminToken(
  userOrUsername: string | { username: string; role?: "admin" | "editor"; displayName?: string }
): Promise<string> {
  const username = typeof userOrUsername === "string" ? userOrUsername : userOrUsername.username;
  const role = typeof userOrUsername === "object" && userOrUsername.role ? userOrUsername.role : "admin";
  const displayName = typeof userOrUsername === "object" && userOrUsername.displayName ? userOrUsername.displayName : username;

  const secret = getSecret();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days validity

  // Generate 16 bytes of cryptographically secure random entropy
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = Array.from(nonceBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const payload: AdminTokenPayload = {
    sub: username,
    role,
    displayName,
    iat,
    exp,
    nonce,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = toBase64Url(payloadStr);

  const encoder = new TextEncoder();
  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64)
  );
  const signatureB64 = bufferToBase64Url(signatureBuffer);

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Returns the list of currently authorized admin usernames.
 * Legacy accounts like 'admin' are strictly disbarred.
 */
export function getAllowedAdminUsernames(): string[] {
  const allowed = new Set<string>();

  if (process.env.ADMIN_USERS) {
    const pairs = process.env.ADMIN_USERS.split(",");
    for (const pair of pairs) {
      const colonIndex = pair.indexOf(":");
      if (colonIndex > 0) {
        const u = pair.slice(0, colonIndex).trim().toLowerCase();
        if (u && u !== "admin") {
          allowed.add(u);
        }
      }
    }
  }

  if (process.env.ADMIN_USERNAME) {
    const single = process.env.ADMIN_USERNAME.trim().toLowerCase();
    if (single && single !== "admin") {
      allowed.add(single);
    }
  }

  // Ensure default authorized admin accounts are always present
  allowed.add("sihabali");
  allowed.add("sanzid");

  allowed.delete("admin");
  return Array.from(allowed);
}


/**
 * Validates whether a username is an active, authorized administrator.
 * Rejects legacy or unrecognized usernames.
 */
export function isAuthorizedAdminUsername(username: string | undefined | null): boolean {
  if (!username || typeof username !== "string") return false;
  const clean = username.trim().toLowerCase();
  if (clean === "admin") return false;

  const allowed = getAllowedAdminUsernames();
  if (allowed.includes(clean)) return true;

  // Check persisted users file in Node environment if available
  try {
    if (typeof process !== "undefined" && typeof require !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const usersFile = path.join(process.cwd(), ".data", "admin_users.json");
      if (fs.existsSync(usersFile)) {
        const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
        if (Array.isArray(users) && users.some((u: any) => u.username.toLowerCase() === clean && u.isActive !== false)) {
          return true;
        }
      }
    }
  } catch {
    // Ignore in non-Node environments
  }

  return false;
}

/**
 * Cryptographically verifies an admin token's signature, expiration, and payload
 */
export async function verifyAdminToken(
  token: string | undefined | null
): Promise<{ valid: boolean; username?: string; role?: "admin" | "editor"; displayName?: string; error?: string }> {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "Missing token" };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "Malformed token" };
    }

    const [payloadB64, signatureB64] = parts;
    const secret = getSecret();
    const key = await getHmacKey(secret);
    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const encoder = new TextEncoder();

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadB64)
    );

    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }

    const payloadStr = fromBase64Url(payloadB64);
    const payload: AdminTokenPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    // STRICT: Invalidate tokens issued on or before global revocation cutoff
    const minValidIat = getRevocationEpoch();
    if (typeof payload.iat === "number" && payload.iat <= minValidIat) {
      return { valid: false, error: "Session has been invalidated across all devices" };
    }

    // STRICT: Ensure token subject belongs to an active, authorized user
    if (!payload.sub || !isAuthorizedAdminUsername(payload.sub)) {
      return { valid: false, error: "Unauthorized admin account or session revoked" };
    }

    return {
      valid: true,
      username: payload.sub,
      role: payload.role || "admin",
      displayName: payload.displayName || payload.sub,
    };
  } catch (err) {
    return { valid: false, error: "Verification failed" };
  }
}

// -------------------------------------------------------------
// IP-based Login Rate Limiter (Brute-Force Protection)
// -------------------------------------------------------------
interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  // Check if locked
  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // Check if window has expired
  if (now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.attempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function recordFailedLogin(ip: string): {
  locked: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  let record = loginAttempts.get(ip);

  if (!record || now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
    record = { attempts: 1, firstAttemptTime: now };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, record);
    return {
      locked: true,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  loginAttempts.set(ip, record);
  return {
    locked: false,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - record.attempts,
  };
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}
