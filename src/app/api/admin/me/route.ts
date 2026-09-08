import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-server";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!session.username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: session.username,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
