import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-server";
import { getLeads, getApartments, getSiteStats } from "@/lib/store";
import { getAdminAuditData, touchAdminActivity, ensureActiveSessionRecorded } from "@/lib/admin-audit";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
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

    // Touch user activity heartbeat
    const forwarded = req.headers.get("x-forwarded-for");
    let clientIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";
    if (clientIp === "::1") clientIp = "127.0.0.1";

    if (session.username) {
      touchAdminActivity(session.username, clientIp);
      await ensureActiveSessionRecorded(session.username, clientIp, req.headers.get("user-agent"));
    }

    // Fetch all required data in parallel on the server
    const [leads, apartments, stats, auditData] = await Promise.all([
      getLeads(),
      getApartments(),
      getSiteStats(),
      getAdminAuditData(),
    ]);

    return NextResponse.json({
      success: true,
      authenticated: true,
      currentUser: session.username || "sanzid",
      leads,
      apartments,
      stats,
      adminUsers: auditData.users,
      adminLogs: auditData.logs,
    });
  } catch (error) {
    console.error("Dashboard data load error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
