import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { getSiteStats, updateSiteStats } from "@/lib/store";

export async function GET() {
  try {
    const stats = await getSiteStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Error retrieving stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;

    const body = await req.json();
    const updated = await updateSiteStats(body);
    return NextResponse.json({ success: true, stats: updated });
  } catch (error) {
    console.error("Error updating stats:", error);
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
