import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-server";
import { getLeads, getApartments, getSiteStats } from "@/lib/store";
import { getAdminAuditData, touchAdminActivity, ensureActiveSessionRecorded } from "@/lib/admin-audit";
import { SEED_APARTMENTS } from "@/lib/seed-data";
import { getDefaultSeedUsers } from "@/lib/admin-users";

/** Default fallback stats so admin always shows something meaningful */
const DEFAULT_STATS = {
  _id: "stat_default",
  activeApartments: "3,250+",
  activeRenters: "12,500+",
  propertiesListed: "4,200+",
  customersServed: "9,800+",
  satisfactionRate: "99.4%",
  supportEmail: "leasing@apartmento.us",
  supportPhone: "+1 (800) 492-7836",
};

export async function GET(req: Request) {
  let session;
  try {
    session = await getAdminSession(req);
  } catch (sessionErr) {
    console.error("Session retrieval error:", sessionErr);
    return NextResponse.json(
      { success: false, authenticated: false, error: "Session error" },
      { status: 401 }
    );
  }

  if (!session.authenticated) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: "Unauthorized. Admin authentication required.",
      },
      { status: 401 }
    );
  }

  // Touch user activity heartbeat (non-blocking, errors silenced)
  const forwarded = req.headers.get("x-forwarded-for");
  let clientIp =
    forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "127.0.0.1";
  if (clientIp === "::1") clientIp = "127.0.0.1";

  if (session.username) {
    try {
      touchAdminActivity(session.username, clientIp);
    } catch (_) {}
    try {
      await ensureActiveSessionRecorded(
        session.username,
        clientIp,
        req.headers.get("user-agent")
      );
    } catch (_) {}
  }

  // Fetch all data concurrently — each wrapped individually so one failure
  // doesn't crash the whole response.
  const [leadsResult, apartmentsResult, statsResult, auditResult] =
    await Promise.allSettled([
      getLeads(),
      getApartments(),
      getSiteStats(),
      getAdminAuditData(),
    ]);

  // Resolve with safe fallbacks
  const seedApts = SEED_APARTMENTS.map((apt, idx) => ({
    ...(apt as object),
    _id: `apt_${idx + 1}`,
    serialNumber: apt.serialNumber || idx + 1,
    isManual: false,
    createdBy: "system",
    createdByName: "System Inventory",
  }));

  const seedUsers = getDefaultSeedUsers();
  const seedUserSummaries = seedUsers.map((u) => ({
    id: u.id || `usr_${u.username}`,
    username: u.username,
    displayName: u.displayName || u.username,
    role: u.role,
    createdBy: u.createdBy || "system",
    isActive: false,
    createdAt: u.createdAt || new Date().toISOString(),
    lastLogin: null,
    lastActiveAt: null,
    lastIp: "127.0.0.1",
    lastDevice: "Mac (Chrome)",
    totalLogins: 1,
  }));

  const leads = leadsResult.status === "fulfilled" ? leadsResult.value : [];
  const apartments =
    apartmentsResult.status === "fulfilled" && apartmentsResult.value.length > 0
      ? apartmentsResult.value
      : seedApts;
  const stats =
    statsResult.status === "fulfilled" ? statsResult.value : DEFAULT_STATS;
  const auditData =
    auditResult.status === "fulfilled"
      ? auditResult.value
      : { users: seedUserSummaries, logs: [] };

  // Ensure audit users always contains at least the seed root admins
  const auditUsers = auditData.users ?? [];
  if (auditUsers.length === 0) {
    auditData.users = seedUserSummaries;
  } else {
    // Make sure sanzid and sihabali are always present in the user list
    for (const seed of seedUserSummaries) {
      if (!auditUsers.some((u) => u.username.toLowerCase() === seed.username.toLowerCase())) {
        auditData.users.push(seed);
      }
    }
  }

  const isEditor = session.role === "editor";
  const sanitizedAdminUsers = isEditor
    ? auditData.users.map((u) => ({
        ...u,
        lastIp: undefined,
        lastDevice: undefined,
        totalLogins: undefined,
      }))
    : auditData.users;

  return NextResponse.json({
    success: true,
    authenticated: true,
    currentUser: session.username || "sanzid",
    currentUserRole: session.role || "admin",
    currentUserDisplayName:
      session.displayName || session.username || "Sanzid",
    leads,
    apartments,
    stats,
    adminUsers: sanitizedAdminUsers,
    adminLogs: isEditor ? [] : (auditData.logs ?? []).slice(0, 100),
  });
}
