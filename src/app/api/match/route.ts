import { NextResponse } from "next/server";
import { matchApartments } from "@/lib/matching-engine";
import { createLead } from "@/lib/store";
import { FunnelFormData } from "@/types";

export async function POST(req: Request) {
  try {
    const body: FunnelFormData = await req.json();

    if (!body.fullName || !body.phone || !body.email) {
      return NextResponse.json(
        { error: "Personal information (name, phone, email) is required." },
        { status: 400 }
      );
    }

    // Extract client IP from headers for IP-based dynamic inventory & zero-duplicate rotation
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfConnectingIp = req.headers.get("cf-connecting-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || cfConnectingIp || "127.0.0.1";

    // 1. Run Dynamic Chameleon Matching Engine with IP and seen-cache context
    const matches = await matchApartments(body, {
      clientIp,
      seenApartmentIds: Array.isArray(body.seenApartmentIds) ? body.seenApartmentIds : [],
    });

    // 2. Save Lead into MongoDB
    const matchedApartmentIds = matches.map((m) => m._id || m.id || "").filter(Boolean);

    const lead = await createLead({
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      isUsResident: Boolean(body.isUsResident),
      age: Number(body.age) || 25,
      familyMembers: Number(body.familyMembers) || 1,
      hasPets: Boolean(body.hasPets),
      petDetails: body.petDetails || "",
      bedrooms: Number(body.bedrooms) || 1,
      bathrooms: Number(body.bathrooms) || 1,
      furnished: body.furnished || "Either",
      kitchenRequired: body.kitchenRequired !== false,
      amenities: body.amenities || [],
      budgetMin: Number(body.budgetMin) || 800,
      budgetMax: Number(body.budgetMax) || 1500,
      creditScore: body.creditScore || "Good (660 - 719)",
      desiredLocation: body.desiredLocation || "USA",
      matchedApartments: matchedApartmentIds,
      selectedApartmentId: body.selectedApartmentId,
      selectedApartmentTitle: body.selectedApartmentTitle || "",
      selectedApartmentPrice: body.selectedApartmentPrice,
      status: "New",
      notes: body.selectedApartmentTitle
        ? `Direct Inquiry for "${body.selectedApartmentTitle}" via Homepage Quiz ($${body.selectedApartmentPrice || "N/A"}/mo)`
        : `Matched with ${matches.length} dynamic units in ${body.desiredLocation}`,
    });

    return NextResponse.json({
      success: true,
      leadId: lead._id || lead.id,
      lead,
      matches,
    });
  } catch (error: unknown) {
    console.error("Error processing apartment match request:", error);
    return NextResponse.json(
      { error: "Failed to match apartments. Please check input parameters." },
      { status: 500 }
    );
  }
}
