import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLeads, getApartments, getSiteStats } from "@/lib/store";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("apartmento_admin_token");

    if (!token?.value) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all required data in parallel on the server
    const [leads, apartments, stats] = await Promise.all([
      getLeads(),
      getApartments(),
      getSiteStats(),
    ]);

    return NextResponse.json({
      success: true,
      authenticated: true,
      leads,
      apartments,
      stats,
    });
  } catch (error) {
    console.error("Dashboard data load error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
