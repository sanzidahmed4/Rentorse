import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth-server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: "rentorce_admin_token",
    path: "/",
  });
  cookieStore.delete({
    name: "apartmento_admin_token",
    path: "/",
  });
  return NextResponse.json({ success: true, message: "Logged out" });
}

export async function GET(req: Request) {
  const session = await getAdminSession(req);
  if (!session.authenticated || !session.username) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session.username });
}
