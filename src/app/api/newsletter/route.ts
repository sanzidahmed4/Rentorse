import { NextResponse } from "next/server";
import { createLead } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Store subscriber in the leads collection so admin can view and contact them
    await createLead({
      fullName: "Newsletter Subscriber",
      email: cleanEmail,
      phone: "N/A",
      isUsResident: true,
      age: 25,
      familyMembers: 1,
      hasPets: false,
      bedrooms: 1,
      bathrooms: 1,
      furnished: "Either",
      kitchenRequired: true,
      amenities: [],
      budgetMin: 800,
      budgetMax: 2000,
      desiredLocation: "USA (All Locations)",
      matchedApartments: [],
      status: "New",
      notes: "Subscribed to New Apartment Alerts & Newsletter",
    });

    return NextResponse.json({
      success: true,
      message: "You're subscribed! We'll notify you as soon as new apartments are listed.",
    });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
