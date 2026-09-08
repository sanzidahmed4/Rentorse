import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { getLeads, createLead, clearAllLeads } from "@/lib/store";

export async function GET(req: Request) {
  try {
    // Protect lead PII strictly to authenticated admins
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const leads = await getLeads({ status, search });
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error("Error retrieving leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.fullName || !body.phone || !body.email) {
      return NextResponse.json(
        { error: "Full name, phone, and email are required" },
        { status: 400 }
      );
    }
    const lead = await createLead(body);
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Restrict clearing all leads strictly to authenticated admins
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;

    await clearAllLeads();
    return NextResponse.json({ success: true, message: "All leads cleared successfully" });
  } catch (error) {
    console.error("Error clearing all leads:", error);
    return NextResponse.json({ error: "Failed to clear leads" }, { status: 500 });
  }
}
