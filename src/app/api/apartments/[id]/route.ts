import { NextResponse } from "next/server";
import { requireAdmin, requireAdminRole } from "@/lib/auth-server";
import { getApartmentByIdOrSlug, updateApartment, deleteApartment } from "@/lib/store";

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
    // Both admin and editor can update apartment details
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // STRICT: Only users with "admin" role can delete apartments
    const forbidden = await requireAdminRole(req);
    if (forbidden) return forbidden;

    const { id } = await params;
    const deleted = await deleteApartment(id);
    if (!deleted) {
      return NextResponse.json({ error: "Apartment not found or already deleted" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Apartment deleted successfully" });
  } catch (error) {
    console.error("Error deleting apartment:", error);
    return NextResponse.json({ error: "Failed to delete apartment" }, { status: 500 });
  }
}

