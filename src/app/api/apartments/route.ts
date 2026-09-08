import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { getApartments, createApartment } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const bedrooms = searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined;
    const bathrooms = searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined;

    const apartments = await getApartments({ category, bedrooms, bathrooms });
    return NextResponse.json({ success: true, count: apartments.length, apartments });
  } catch (error) {
    console.error("Error retrieving apartments:", error);
    return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Restrict apartment creation strictly to authenticated admins
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;

    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }
    const created = await createApartment(body);
    return NextResponse.json({ success: true, apartment: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating apartment:", error);
    return NextResponse.json({ error: "Failed to create apartment" }, { status: 500 });
  }
}
