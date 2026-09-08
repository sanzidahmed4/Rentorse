import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { getApartmentByIdOrSlug, updateApartment } from "@/lib/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apartment = await getApartmentByIdOrSlug(id);
    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, apartment });
  } catch (error) {
    console.error("Error retrieving apartment:", error);
    return NextResponse.json({ error: "Failed to fetch apartment" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Restrict apartment updates strictly to authenticated admins
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const body = await req.json();
    const updated = await updateApartment(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, apartment: updated });
  } catch (error) {
    console.error("Error updating apartment:", error);
    return NextResponse.json({ error: "Failed to update apartment" }, { status: 500 });
  }
}
