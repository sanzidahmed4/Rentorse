import { NextResponse } from "next/server";
import { seedApartmentsIfEmpty } from "@/lib/store";

export async function POST() {
  try {
    const count = await seedApartmentsIfEmpty();
    return NextResponse.json({
      success: true,
      message: `Successfully seeded/verified ${count} apartments.`,
      count,
    });
  } catch (error) {
    console.error("Error in seeding apartments:", error);
    return NextResponse.json({ error: "Failed to seed apartments" }, { status: 500 });
  }
}
