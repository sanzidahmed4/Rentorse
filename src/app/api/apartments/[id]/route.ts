import { NextResponse } from "next/server";
import { requireAdmin, requireAdminRole } from "@/lib/auth-server";
import { getApartmentByIdOrSlug, updateApartment, deleteApartment } from "@/lib/store";
import { submitApartmentUrlToIndexNow, submitToIndexNow, getApartmentPublicUrl } from "@/lib/indexnow";

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

    // Server-side IndexNow notification for search engines (non-blocking)
    submitApartmentUrlToIndexNow(updated).catch((err) => {
      console.error("[IndexNow] Non-blocking submit error on update:", err);
    });

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

    // Retrieve existing apartment details before deletion to determine the exact public URL
    const existingApt = await getApartmentByIdOrSlug(id);
    const deletedUrl = existingApt
      ? getApartmentPublicUrl(existingApt)
      : `https://rentorce.com/apartments/${id}`;

    const deleted = await deleteApartment(id);
    if (!deleted) {
      return NextResponse.json({ error: "Apartment not found or already deleted" }, { status: 404 });
    }

    // Server-side IndexNow notification for deleted URL (non-blocking)
    submitToIndexNow(deletedUrl).catch((err) => {
      console.error("[IndexNow] Non-blocking submit error on delete:", err);
    });

    return NextResponse.json({ success: true, message: "Apartment deleted successfully" });
  } catch (error) {
    console.error("Error deleting apartment:", error);
    return NextResponse.json({ error: "Failed to delete apartment" }, { status: 500 });
  }
}

