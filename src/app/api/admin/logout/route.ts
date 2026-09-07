import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("apartmento_admin_token");
  return NextResponse.json({ success: true, message: "Logged out" });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("apartmento_admin_token");
  if (!token?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: "admin" });
}
