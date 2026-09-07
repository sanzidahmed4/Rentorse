import { NextResponse } from "next/server";
import { getLeads, createLead, clearAllLeads } from "@/lib/store";

export async function GET(req: Request) {
  try {
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
    const lead = await createLead(body);
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearAllLeads();
    return NextResponse.json({ success: true, message: "All leads cleared successfully" });
  } catch (error) {
    console.error("Error clearing all leads:", error);
    return NextResponse.json({ error: "Failed to clear leads" }, { status: 500 });
  }
}

